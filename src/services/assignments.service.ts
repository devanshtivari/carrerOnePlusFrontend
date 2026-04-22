import api from '@/lib/api';

import type { PaginatedResult } from './types';

export interface AssignmentItem {
  id: string;
  title: string;
  description?: string | null;
  classId?: string | null;
  totalMarks?: number | null;
  dueAt?: string | null;
  isPublished: boolean;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'RETURNED';
  grade?: number | null;
  feedback?: string | null;
  contentMarkdown?: string | null;
  fileUrls?: string[];
  submittedAt?: string | null;
}

export const assignmentsService = {
  list: async (params: { page?: number; pageSize?: number } = {}) => {
    const { data } = await api.get<PaginatedResult<AssignmentItem>>('/assignments', { params });
    return data;
  },
  forClass: async (classId: string) => {
    const { data } = await api.get<AssignmentItem[]>(`/classes/${classId}/assignments`);
    return data;
  },
  findById: async (id: string) => {
    const { data } = await api.get<AssignmentItem>(`/assignments/${id}`);
    return data;
  },
  create: async (payload: Partial<AssignmentItem>) => {
    const { data } = await api.post<AssignmentItem>('/assignments', payload);
    return data;
  },
  update: async (id: string, payload: Partial<AssignmentItem>) => {
    const { data } = await api.patch<AssignmentItem>(`/assignments/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/assignments/${id}`);
  },
  submit: async (
    assignmentId: string,
    payload: { contentMarkdown?: string; fileUrls?: string[] },
  ): Promise<AssignmentSubmission> => {
    const { data } = await api.post<AssignmentSubmission>(
      `/assignments/${assignmentId}/submissions`,
      payload,
    );
    return data;
  },
  submissions: async (assignmentId: string) => {
    const { data } = await api.get<PaginatedResult<AssignmentSubmission>>(
      `/assignments/${assignmentId}/submissions`,
    );
    return data;
  },
  mySubmissions: async (params: { page?: number; pageSize?: number } = {}) => {
    const { data } = await api.get<PaginatedResult<AssignmentSubmission>>(
      '/assignment-submissions/me',
      { params },
    );
    return data;
  },
  grade: async (
    submissionId: string,
    payload: { grade: number; feedback?: string },
  ): Promise<AssignmentSubmission> => {
    const { data } = await api.patch<AssignmentSubmission>(
      `/assignment-submissions/${submissionId}/grade`,
      payload,
    );
    return data;
  },
};
