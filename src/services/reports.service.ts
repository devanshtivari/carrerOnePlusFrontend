import api from '@/lib/api';

import type { PaginatedResult, ReportItem } from './types';

export interface ReportsListParams {
  page?: number;
  pageSize?: number;
  kind?: ReportItem['kind'];
}

export const reportsService = {
  list: async (params: ReportsListParams = {}): Promise<PaginatedResult<ReportItem>> => {
    const { data } = await api.get<PaginatedResult<ReportItem>>('/reports', { params });
    return data;
  },
  findById: async (id: string): Promise<ReportItem> => {
    const { data } = await api.get<ReportItem>(`/reports/${id}`);
    return data;
  },
  create: async (payload: Partial<ReportItem>): Promise<ReportItem> => {
    const { data } = await api.post<ReportItem>('/reports', payload);
    return data;
  },
  update: async (id: string, payload: Partial<ReportItem>): Promise<ReportItem> => {
    const { data } = await api.patch<ReportItem>(`/reports/${id}`, payload);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/reports/${id}`);
  },
};
