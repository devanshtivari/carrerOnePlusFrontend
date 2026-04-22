import api from '@/lib/api';

import type { PaginatedResult } from './types';

export interface ProjectItem {
  id: string;
  title: string;
  description?: string | null;
  unitId?: string | null;
  courseId?: string | null;
  rubric?: unknown;
  totalMarks?: number | null;
  isPublished: boolean;
  dueAt?: string | null;
}

export interface ProjectSubmission {
  id: string;
  projectId: string;
  studentId: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'RETURNED';
  grade?: number | null;
  feedback?: string | null;
  fileUrls?: string[];
  submittedAt?: string | null;
}

export const projectsService = {
  list: async (params: { page?: number; pageSize?: number } = {}) => {
    const { data } = await api.get<PaginatedResult<ProjectItem>>('/projects', { params });
    return data;
  },
  forUnit: async (unitId: string) => {
    const { data } = await api.get<ProjectItem[]>(`/units/${unitId}/projects`);
    return data;
  },
  forCourse: async (courseId: string) => {
    const { data } = await api.get<ProjectItem[]>(`/courses/${courseId}/projects`);
    return data;
  },
  findById: async (id: string) => {
    const { data } = await api.get<ProjectItem>(`/projects/${id}`);
    return data;
  },
  create: async (payload: Partial<ProjectItem>) => {
    const { data } = await api.post<ProjectItem>('/projects', payload);
    return data;
  },
  update: async (id: string, payload: Partial<ProjectItem>) => {
    const { data } = await api.patch<ProjectItem>(`/projects/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/projects/${id}`);
  },
  submit: async (
    projectId: string,
    payload: { fileUrls?: string[]; note?: string },
  ): Promise<ProjectSubmission> => {
    const { data } = await api.post<ProjectSubmission>(`/projects/${projectId}/submissions`, payload);
    return data;
  },
  submissions: async (projectId: string) => {
    const { data } = await api.get<PaginatedResult<ProjectSubmission>>(
      `/projects/${projectId}/submissions`,
    );
    return data;
  },
  mySubmissions: async (params: { page?: number; pageSize?: number } = {}) => {
    const { data } = await api.get<PaginatedResult<ProjectSubmission>>(
      '/project-submissions/me',
      { params },
    );
    return data;
  },
  grade: async (
    submissionId: string,
    payload: { grade: number; feedback?: string },
  ): Promise<ProjectSubmission> => {
    const { data } = await api.patch<ProjectSubmission>(
      `/project-submissions/${submissionId}/grade`,
      payload,
    );
    return data;
  },
};
