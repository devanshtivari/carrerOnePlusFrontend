import api from '@/lib/api';

import type { Enrollment, PaginatedResult } from './types';

export interface EnrollmentListParams {
  page?: number;
  pageSize?: number;
  userId?: string;
  courseId?: string;
}

export const enrollmentsService = {
  list: async (params: EnrollmentListParams = {}): Promise<PaginatedResult<Enrollment>> => {
    const { data } = await api.get<PaginatedResult<Enrollment>>('/enrollments', { params });
    return data;
  },
  findById: async (id: string): Promise<Enrollment> => {
    const { data } = await api.get<Enrollment>(`/enrollments/${id}`);
    return data;
  },
  enroll: async (courseId: string): Promise<Enrollment> => {
    const { data } = await api.post<Enrollment>('/enrollments', { courseId });
    return data;
  },
  touch: async (id: string): Promise<Enrollment> => {
    const { data } = await api.post<Enrollment>(`/enrollments/${id}/touch`);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/enrollments/${id}`);
  },
};
