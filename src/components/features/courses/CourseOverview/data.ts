import type { Course, Unit as ApiUnit } from "@/services/types";

import { CourseData, Unit } from "./types";

export const courseDataMap: Record<string, CourseData> = {};

interface CurriculumUnit {
  id: string;
  moduleNumber?: number | null;
  title: string;
  description?: string | null;
  durationLabel?: string | null;
  status?: string | null;
  isLocked?: boolean | null;
  chapters?: Array<{ id: string; totalLessons?: number | null }>;
}

interface CurriculumTree {
  id: string;
  slug: string;
  title: string;
  units: CurriculumUnit[];
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop";

function initialsOf(name?: string | null): string {
  if (!name) return "IN";
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function shortNameFor(title: string): string {
  return title.length > 24 ? `${title.slice(0, 22)}…` : title;
}

export function toCourseData(
  course: Course,
  curriculum?: CurriculumTree | null,
  progress = 0,
): CourseData {
  const apiUnits: CurriculumUnit[] =
    curriculum?.units ?? (course as unknown as { units?: CurriculumUnit[] }).units ?? [];

  const units: Unit[] = apiUnits.map((u, idx) => {
    const topics = (u.chapters ?? []).reduce(
      (acc, ch) => acc + (ch.totalLessons ?? 0),
      0,
    );
    const status: Unit["status"] = u.isLocked
      ? "locked"
      : idx === 0
        ? "in-progress"
        : "locked";
    return {
      id: u.id,
      title: u.title,
      topics,
      duration: u.durationLabel ?? "—",
      status,
    };
  });

  const totalTopics = units.reduce((acc, u) => acc + u.topics, 0);

  return {
    id: course.id,
    shortName: shortNameFor(course.title),
    title: course.title,
    description: course.shortDescription ?? course.description ?? "",
    imageUrl: course.imageUrl ?? FALLBACK_IMAGE,
    progress: Math.round(progress),
    totalUnits: units.length,
    totalTopics,
    tests: 0,
    projects: 0,
    learnings: course.description
      ? course.description
          .split(".")
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 4)
      : [],
    instructor: {
      name: course.instructor?.fullName ?? "Instructor",
      title: "Course Instructor",
      avatarInitials: initialsOf(course.instructor?.fullName),
    },
    classmates: 0,
    units,
  };
}

export function toApiUnitList(units: ApiUnit[]): CurriculumUnit[] {
  return units.map((u, idx) => ({
    id: u.id,
    moduleNumber: idx + 1,
    title: u.title,
    description: u.description ?? null,
    durationLabel: null,
    status: null,
    isLocked: idx > 0,
    chapters: [],
  }));
}
