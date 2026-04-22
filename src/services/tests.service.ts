import api from '@/lib/api';
import { apiDebug, apiWarn } from '@/lib/debug';

import type { PaginatedResult, TestAttempt, TestItem, TestQuestion } from './types';

export interface TestListParams {
  page?: number;
  pageSize?: number;
  status?: TestItem['status'];
  courseId?: string;
  classId?: string;
}

function coercePaginated<T>(data: unknown): PaginatedResult<T> {
  if (Array.isArray(data)) {
    const items = data as T[];
    return { items, total: items.length, page: 1, pageSize: items.length, totalPages: 1 };
  }
  if (data && typeof data === 'object') {
    const d = data as Partial<PaginatedResult<T>> & { data?: unknown };
    if (Array.isArray(d.items)) {
      return {
        items: d.items,
        total: d.total ?? d.items.length,
        page: d.page ?? 1,
        pageSize: d.pageSize ?? d.items.length,
        totalPages: d.totalPages ?? (d.items.length ? 1 : 0),
      };
    }
    if (d.data && typeof d.data === 'object' && Array.isArray((d.data as { items?: unknown }).items)) {
      const inner = d.data as PaginatedResult<T>;
      return inner;
    }
  }
  return { items: [], total: 0, page: 1, pageSize: 0, totalPages: 0 };
}

export const testsService = {
  list: async (params: TestListParams = {}): Promise<PaginatedResult<TestItem>> => {
    const { data } = await api.get<PaginatedResult<TestItem>>('/tests', { params });
    apiDebug('tests.list', 'raw response', data);
    const result = coercePaginated<TestItem>(data);
    if (result.items.length === 0) {
      apiWarn('tests.list', 'returned 0 items — check if tests have been seeded for this environment.');
    }
    return result;
  },
  findById: async (id: string): Promise<TestItem> => {
    const { data } = await api.get<TestItem>(`/tests/${id}`);
    return data;
  },
  findByCode: async (code: string): Promise<TestItem> => {
    const { data } = await api.get<TestItem>(`/tests/code/${code}`);
    return data;
  },
  create: async (payload: Partial<TestItem>): Promise<TestItem> => {
    const { data } = await api.post<TestItem>('/tests', payload);
    return data;
  },
  update: async (id: string, payload: Partial<TestItem>): Promise<TestItem> => {
    const { data } = await api.patch<TestItem>(`/tests/${id}`, payload);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/tests/${id}`);
  },
  questions: async (testId: string): Promise<TestQuestion[]> => {
    const { data } = await api.get<TestQuestion[]>(`/tests/${testId}/questions`);
    return data;
  },
};

export const attemptsService = {
  myAttempts: async (params: { page?: number; pageSize?: number } = {}) => {
    const { data } = await api.get<PaginatedResult<TestAttempt>>('/attempts/me', { params });
    return coercePaginated<TestAttempt>(data);
  },
  forTest: async (testId: string) => {
    const { data } = await api.get<PaginatedResult<TestAttempt>>(`/attempts/test/${testId}`);
    return coercePaginated<TestAttempt>(data);
  },
  findById: async (id: string) => {
    const { data } = await api.get<TestAttempt>(`/attempts/${id}`);
    return data;
  },
  start: async (testId: string) => {
    const { data } = await api.post<TestAttempt>('/attempts/start', { testId });
    return data;
  },
  answer: async (
    attemptId: string,
    payload: { questionId: string; selectedOptionIds?: string[]; textAnswer?: string },
  ) => {
    const { data } = await api.post<TestAttempt>(`/attempts/${attemptId}/answer`, payload);
    return data;
  },
  submit: async (attemptId: string) => {
    const { data } = await api.post<TestAttempt>(`/attempts/${attemptId}/submit`);
    return data;
  },
};
