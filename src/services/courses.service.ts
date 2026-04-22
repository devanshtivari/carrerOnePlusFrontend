import api from '@/lib/api';

import type { Category, Chapter, Course, Lesson, PaginatedResult, Resource, Unit } from './types';

/**
 * Params accepted by `GET /courses`.
 *
 * Field names mirror the backend `ListCoursesQueryDto` exactly — the validator
 * runs in whitelist mode, so extra / misspelt fields trigger a 400. Historical
 * note: `published` and `level` here map to `isPublished` / `CourseLevel`
 * columns on the DB row, but the query-param names are different.
 */
export interface CourseListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  category?: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  published?: boolean;
  featured?: boolean;
  instructorId?: string;
  sortBy?: 'createdAt' | 'title' | 'ratingAvg' | 'ratingCount';
  sortDir?: 'asc' | 'desc';
  /**
   * Student grade to scope the catalogue to (e.g. "6", "10"). Backend maps
   * this onto the `grade:<n>` tag convention.
   */
  grade?: string;
}

export const coursesService = {
  list: async (params: CourseListParams = {}): Promise<PaginatedResult<Course>> => {
    const { data } = await api.get<PaginatedResult<Course>>('/courses', { params });
    return data;
  },
  findById: async (id: string): Promise<Course> => {
    const { data } = await api.get<Course>(`/courses/${id}`);
    return data;
  },
  findBySlug: async (slug: string): Promise<Course> => {
    const { data } = await api.get<Course>(`/courses/slug/${slug}`);
    return data;
  },
  curriculumById: async (id: string) => {
    const { data } = await api.get(`/courses/${id}/curriculum`);
    return data;
  },
  curriculumBySlug: async (slug: string) => {
    const { data } = await api.get(`/courses/slug/${slug}/curriculum`);
    return data;
  },
  unitsByCourse: async (courseId: string): Promise<Unit[]> => {
    const { data } = await api.get<Unit[]>(`/courses/${courseId}/units`);
    return data;
  },
  chaptersByUnit: async (unitId: string): Promise<Chapter[]> => {
    const { data } = await api.get<Chapter[]>(`/units/${unitId}/chapters`);
    return data;
  },
  lessonsByChapter: async (chapterId: string): Promise<Lesson[]> => {
    const { data } = await api.get<Lesson[]>(`/chapters/${chapterId}/lessons`);
    return data;
  },
  lesson: async (id: string): Promise<Lesson> => {
    const { data } = await api.get<Lesson>(`/lessons/${id}`);
    return data;
  },
  resourcesByUnit: async (unitId: string): Promise<Resource[]> => {
    const { data } = await api.get<Resource[]>(`/units/${unitId}/resources`);
    return data;
  },
};

export const categoriesService = {
  list: async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  },
  findBySlug: async (slug: string): Promise<Category> => {
    const { data } = await api.get<Category>(`/categories/${slug}`);
    return data;
  },
};
