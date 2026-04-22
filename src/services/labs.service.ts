import api from '@/lib/api';

import type { LabItem, PaginatedResult } from './types';

export interface LabListParams {
  page?: number;
  pageSize?: number;
  status?: LabItem['status'];
}

export const labsService = {
  list: async (params: LabListParams = {}): Promise<PaginatedResult<LabItem>> => {
    const { data } = await api.get<PaginatedResult<LabItem>>('/labs', { params });
    return data;
  },
  findById: async (id: string): Promise<LabItem> => {
    const { data } = await api.get<LabItem>(`/labs/${id}`);
    return data;
  },
  create: async (payload: Partial<LabItem>): Promise<LabItem> => {
    const { data } = await api.post<LabItem>('/labs', payload);
    return data;
  },
  update: async (id: string, payload: Partial<LabItem>): Promise<LabItem> => {
    const { data } = await api.patch<LabItem>(`/labs/${id}`, payload);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/labs/${id}`);
  },
};
