import type { Course as ApiCourse, Enrollment } from "@/services/types";

import type { Course } from "./types";

export const enrolledCourses: Course[] = [];
export const filters = ["All Courses", "In Progress", "Not Started", "Completed"];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop";

function badgeFor(progress: number): { badge: string; badgeStyle: string } {
  if (progress === 100) {
    return { badge: "Completed", badgeStyle: "bg-success-500 text-black" };
  }
  if (progress > 0) {
    return { badge: "In Progress", badgeStyle: "bg-accent-primary text-black" };
  }
  return {
    badge: "New",
    badgeStyle: "bg-white/90 text-black backdrop-blur-md",
  };
}

function formatEnrollmentCount(count?: number): string {
  if (!count || count < 1000) return String(count ?? 0);
  return `${(count / 1000).toFixed(1)}k`;
}

export function toCourseCard(enrollment: Enrollment): Course {
  const c = enrollment.course;
  const { badge, badgeStyle } = badgeFor(enrollment.progress);
  return {
    id: c?.id ?? enrollment.courseId,
    title: c?.title ?? "Untitled Course",
    description: c?.shortDescription ?? c?.description ?? "",
    imageUrl: c?.imageUrl ?? FALLBACK_IMAGE,
    badge,
    badgeStyle,
    progress: Math.round(enrollment.progress ?? 0),
    lessons: c?.unitsCount ?? 0,
    duration: c?.estimatedHours ? `${c.estimatedHours}h` : "—",
    enrolled: formatEnrollmentCount(0),
    rating: 4.8,
    instructor: c?.instructor?.fullName ?? "—",
  };
}

/**
 * Convert a raw catalogue `Course` (no enrollment attached) into the
 * same card shape. Used for courses assigned to the student's grade
 * that they haven't enrolled in yet — rendered as progress=0 "Not started".
 */
export function toCatalogCard(course: ApiCourse): Course {
  const { badge, badgeStyle } = badgeFor(0);
  return {
    id: course.id,
    title: course.title,
    description: course.shortDescription ?? course.description ?? "",
    imageUrl: course.imageUrl ?? FALLBACK_IMAGE,
    badge,
    badgeStyle,
    progress: 0,
    lessons: course.unitsCount ?? 0,
    duration: course.estimatedHours ? `${course.estimatedHours}h` : "—",
    enrolled: formatEnrollmentCount(course.enrollmentsCount ?? 0),
    rating: 4.8,
    instructor: course.instructor?.fullName ?? "—",
  };
}
