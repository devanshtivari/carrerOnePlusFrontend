"use client";

import { useEffect, useState } from "react";

import { coursesService } from "@/services/courses.service";
import { progressService } from "@/services/progress.service";

import type { TestPrerequisite } from "./types";

interface CurriculumLesson {
  id: string;
}
interface CurriculumChapter {
  id: string;
  title: string;
  lessons?: CurriculumLesson[];
}
interface CurriculumUnit {
  id: string;
  chapters?: CurriculumChapter[];
}
interface CurriculumTree {
  id: string;
  units?: CurriculumUnit[];
}

export interface PrerequisiteRecord {
  courseId: string;
  completed: boolean;
  prerequisite: TestPrerequisite;
}

export type PrerequisiteMap = Record<string, PrerequisiteRecord>;

/**
 * Resolve prerequisite state for every course referenced by a set of tests.
 *
 * Convention used by this app: the *first chapter* of the test's course is
 * the unlock gate. Teachers can control the gate by re-ordering chapters in
 * a course; the API already returns them in positional order.
 *
 * We fetch curriculum + progress per unique course in parallel and expose a
 * keyed map so the dashboard can render lock state per-card without extra
 * round-trips.
 */
export function useTestPrerequisites(courseIds: (string | null | undefined)[]) {
  const unique = Array.from(
    new Set(courseIds.filter((id): id is string => typeof id === "string" && id.length > 0)),
  );
  // Join into a stable dependency string so React only refires when the set
  // of course IDs actually changes.
  const key = unique.sort().join(",");
  const [map, setMap] = useState<PrerequisiteMap>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (unique.length === 0) {
      setMap({});
      return;
    }
    let cancelled = false;
    setLoading(true);

    (async () => {
      const entries = await Promise.all(
        unique.map(async (courseId) => {
          try {
            const [treeRaw, progress] = await Promise.all([
              coursesService.curriculumById(courseId),
              progressService.forCourse(courseId).catch(() => null),
            ]);

            const tree = treeRaw as CurriculumTree;
            const firstUnit = tree.units?.[0];
            const firstChapter = firstUnit?.chapters?.[0];
            if (!firstUnit || !firstChapter) return null;

            const completedSet = new Set(progress?.completedLessonIds ?? []);
            const lessonIds = firstChapter.lessons?.map((l) => l.id) ?? [];
            const completed =
              lessonIds.length > 0 && lessonIds.every((id) => completedSet.has(id));

            const rec: PrerequisiteRecord = {
              courseId,
              completed,
              prerequisite: {
                courseId,
                chapterId: firstChapter.id,
                chapterTitle: firstChapter.title,
                unitId: firstUnit.id,
                href: `/student/courses/${courseId}/${firstUnit.id}/${firstChapter.id}`,
              },
            };
            return rec;
          } catch {
            // Swallow per-course failures — the card should fall back to
            // "unlocked" rather than blocking the whole dashboard.
            return null;
          }
        }),
      );

      if (cancelled) return;
      const next: PrerequisiteMap = {};
      for (const entry of entries) {
        if (entry) next[entry.courseId] = entry;
      }
      setMap(next);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { map, loading };
}
