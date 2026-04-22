import api from '@/lib/api';

import type { FeedbackItem, PaginatedResult } from './types';

export interface FeedbackListParams {
  page?: number;
  pageSize?: number;
  studentId?: string;
}

export const feedbackService = {
  list: async (params: FeedbackListParams = {}): Promise<PaginatedResult<FeedbackItem>> => {
    const { data } = await api.get<PaginatedResult<FeedbackItem>>('/feedback', { params });
    return data;
  },
  findById: async (id: string): Promise<FeedbackItem> => {
    const { data } = await api.get<FeedbackItem>(`/feedback/${id}`);
    return data;
  },
  create: async (payload: {
    studentId: string;
    body: string;
    sectionLabel?: string;
    gradeLabel?: string;
    contextType?: string;
    contextId?: string;
  }): Promise<FeedbackItem> => {
    const { data } = await api.post<FeedbackItem>('/feedback', payload);
    return data;
  },
  update: async (id: string, payload: Partial<FeedbackItem>): Promise<FeedbackItem> => {
    const { data } = await api.patch<FeedbackItem>(`/feedback/${id}`, payload);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/feedback/${id}`);
  },
};
