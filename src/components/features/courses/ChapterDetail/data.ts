import type {
  Chapter,
  CourseContext,
  Lesson,
  UnitData,
  UnitResource,
} from "./types";

export const courseContextMap: Record<string, CourseContext> = {};
export const unitDataMap: Record<string, Record<string, UnitData>> = {};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop";

export interface ApiCurriculumLesson {
  id: string;
  title: string;
  type: string;
  durationLabel?: string | null;
  position: number;
}

export interface ApiCurriculumChapter {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  durationLabel?: string | null;
  totalLessons?: number | null;
  lessons: ApiCurriculumLesson[];
}

export interface ApiCurriculumResource {
  id: string;
  name: string;
  kind: string;
  url?: string | null;
  sizeLabel?: string | null;
}

export interface ApiCurriculumUnit {
  id: string;
  moduleNumber?: number | null;
  title: string;
  description?: string | null;
  durationLabel?: string | null;
  status?: string | null;
  isLocked?: boolean | null;
  chapters: ApiCurriculumChapter[];
  resources: ApiCurriculumResource[];
}

export interface ApiCurriculumTree {
  id: string;
  slug: string;
  title: string;
  units: ApiCurriculumUnit[];
}

function mapLessonType(apiType: string): Lesson["type"] {
  const t = (apiType || "").toUpperCase();
  if (t.includes("QUIZ")) return "Quiz";
  if (t.includes("LAB")) return "Lab";
  if (t.includes("CASE")) return "Case Study";
  return "Lesson";
}

export function toLesson(lesson: ApiCurriculumLesson): Lesson {
  return {
    id: lesson.id,
    title: lesson.title,
    duration: lesson.durationLabel ?? "—",
    type: mapLessonType(lesson.type),
    completed: false,
  };
}

export function toChapter(ch: ApiCurriculumChapter): Chapter {
  return {
    id: ch.id,
    title: `Chapter ${ch.position + 1}`,
    description: ch.description ?? ch.title ?? "",
    duration: ch.durationLabel ?? "—",
    progress: 0,
    totalLessons: ch.totalLessons ?? ch.lessons.length,
    lessons: ch.lessons.map(toLesson),
  };
}

export function toUnitData(unit: ApiCurriculumUnit, index = 0): UnitData {
  const resources: UnitResource[] = unit.resources.map((r) => ({
    name: r.name,
    type: r.kind,
    sizeOrUrl: r.sizeLabel ?? r.url ?? "—",
  }));

  return {
    id: unit.id,
    moduleNumber: unit.moduleNumber ?? index + 1,
    title: unit.title,
    description: unit.description ?? "",
    imageUrl: FALLBACK_IMAGE,
    progress: 0,
    chapters: unit.chapters.map(toChapter),
    resources,
  };
}

export function toCourseContext(tree: {
  id: string;
  title: string;
  slug: string;
}): CourseContext {
  const shortName = tree.title.length > 24 ? `${tree.title.slice(0, 22)}…` : tree.title;
  return { id: tree.id, shortName, title: tree.title };
}

/**
 * Overlay real progress onto a freshly-mapped unit. `completedLessonIds`
 * comes from `GET /progress/courses/:id` which only resolves once the user
 * is authenticated and enrolled; when it's empty (initial load / error) we
 * simply return the unit untouched so the UI renders zeroed out.
 */
export function applyProgressToUnit(
  unit: UnitData,
  completedLessonIds: string[],
): UnitData {
  if (!completedLessonIds.length) return unit;
  const completedSet = new Set(completedLessonIds);

  const chapters: Chapter[] = unit.chapters.map((ch) => {
    const lessons = ch.lessons.map((l) => ({
      ...l,
      completed: completedSet.has(l.id),
    }));
    const total = lessons.length || ch.totalLessons || 0;
    const done = lessons.filter((l) => l.completed).length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    return { ...ch, lessons, progress };
  });

  const totalLessons = chapters.reduce(
    (acc, ch) => acc + (ch.lessons.length || ch.totalLessons || 0),
    0,
  );
  const doneLessons = chapters.reduce(
    (acc, ch) => acc + ch.lessons.filter((l) => l.completed).length,
    0,
  );
  const unitProgress =
    totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

  return { ...unit, chapters, progress: unitProgress };
}

export function generateFallbackUnit(_courseId: string, unitId: string): UnitData {
  const moduleNum = parseInt(unitId.replace("unit-", ""), 10) || 1;
  return {
    id: unitId,
    moduleNumber: moduleNum,
    title: `Unit ${moduleNum}`,
    description: "Detailed content for this unit is being prepared.",
    imageUrl: FALLBACK_IMAGE,
    progress: 0,
    chapters: [],
    resources: [],
  };
}
