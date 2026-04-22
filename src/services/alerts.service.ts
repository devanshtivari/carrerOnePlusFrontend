import api from '@/lib/api';

import type { AlertItem, PaginatedResult } from './types';

export interface AlertListParams {
  page?: number;
  pageSize?: number;
  priority?: AlertItem['priority'];
  resolved?: boolean;
}

export const alertsService = {
  list: async (params: AlertListParams = {}): Promise<PaginatedResult<AlertItem>> => {
    const { data } = await api.get<PaginatedResult<AlertItem>>('/alerts', { params });
    return data;
  },
  findById: async (id: string): Promise<AlertItem> => {
    const { data } = await api.get<AlertItem>(`/alerts/${id}`);
    return data;
  },
  create: async (payload: Partial<AlertItem>): Promise<AlertItem> => {
    const { data } = await api.post<AlertItem>('/alerts', payload);
    return data;
  },
  update: async (id: string, payload: Partial<AlertItem>): Promise<AlertItem> => {
    const { data } = await api.patch<AlertItem>(`/alerts/${id}`, payload);
    return data;
  },
  resolve: async (id: string): Promise<AlertItem> => {
    const { data } = await api.patch<AlertItem>(`/alerts/${id}/resolve`);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/alerts/${id}`);
  },
};
