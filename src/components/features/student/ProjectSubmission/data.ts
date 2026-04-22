import type { ProjectItem, ProjectSubmission as ApiProjectSubmission } from '@/services/projects.service';
import type { Course, Unit } from '@/services/types';

import {
  SubmissionCourse,
  SubmissionProject,
  SubmissionUnit,
} from './types';

/**
 * Static course/unit/project data has been replaced with live data loaded
 * from the catalog and assessments APIs. These arrays are kept as empty
 * fallbacks so existing imports continue to compile while views fetch the
 * real data via hooks.
 */
export const submissionCourses: SubmissionCourse[] = [];
export const courseUnits: Record<string, SubmissionUnit[]> = {};
export const unitProjects: Record<string, SubmissionProject[]> = {};

const LEVEL_MAP: Record<string, { label: string; color: string }> = {
  BEGINNER: {
    label: 'MIDDLE SCHOOL',
    color: 'bg-emerald-950/80 text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-900/20',
  },
  INTERMEDIATE: {
    label: 'ADVANCED',
    color: 'bg-amber-950/80 text-amber-300 backdrop-blur-md shadow-lg shadow-amber-900/20',
  },
  ADVANCED: {
    label: 'EXPERT',
    color: 'bg-white/90 text-black backdrop-blur-md shadow-lg shadow-white/10',
  },
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop';

export function toSubmissionCourse(course: Course): SubmissionCourse {
  const level = LEVEL_MAP[course.difficulty] ?? LEVEL_MAP.BEGINNER;
  return {
    id: course.id,
    title: course.title,
    description: course.shortDescription ?? course.description ?? '',
    imageUrl: course.imageUrl ?? FALLBACK_IMAGE,
    level: level.label,
    levelColor: level.color,
    availableProjects: course.unitsCount ?? 0,
    avatars: [],
  };
}

export function toSubmissionUnit(
  unit: Unit,
  index: number,
  imageUrl?: string | null,
  projectsCount?: number,
): SubmissionUnit {
  const unitNumber = `UNIT ${String(index + 1).padStart(2, '0')}`;
  return {
    id: unit.id,
    unitNumber,
    title: unit.title,
    interactiveProjects: projectsCount ?? 0,
    hours: 0,
    imageUrl: imageUrl ?? FALLBACK_IMAGE,
    isLocked: false,
  };
}

export function toSubmissionProject(
  project: ProjectItem,
  submission?: ApiProjectSubmission | null,
): SubmissionProject {
  let status: SubmissionProject['status'] = 'Not Submitted';
  if (submission) {
    if (submission.status === 'GRADED') status = 'Graded';
    else if (submission.status === 'SUBMITTED' || submission.status === 'RETURNED')
      status = 'Submitted';
  }
  return {
    id: project.id,
    title: project.title,
    description: project.description ?? '',
    imageUrl: FALLBACK_IMAGE,
    deadline: project.dueAt
      ? new Date(project.dueAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : 'No deadline',
    status,
  };
}
