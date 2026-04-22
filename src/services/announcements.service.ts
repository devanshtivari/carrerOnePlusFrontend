import api from '@/lib/api';

import type { AnnouncementItem, PaginatedResult } from './types';

export interface AnnouncementListParams {
  page?: number;
  pageSize?: number;
  audience?: AnnouncementItem['audience'];
  activeOnly?: boolean;
}

export const announcementsService = {
  list: async (params: AnnouncementListParams = {}): Promise<PaginatedResult<AnnouncementItem>> => {
    const { data } = await api.get<PaginatedResult<AnnouncementItem>>('/announcements', { params });
    return data;
  },
  listForMe: async (
    params: AnnouncementListParams = {},
  ): Promise<PaginatedResult<AnnouncementItem>> => {
    const { data } = await api.get<PaginatedResult<AnnouncementItem>>('/announcements/me', {
      params,
    });
    return data;
  },
  findById: async (id: string): Promise<AnnouncementItem> => {
    const { data } = await api.get<AnnouncementItem>(`/announcements/${id}`);
    return data;
  },
  create: async (payload: Partial<AnnouncementItem>): Promise<AnnouncementItem> => {
    const { data } = await api.post<AnnouncementItem>('/announcements', payload);
    return data;
  },
  update: async (id: string, payload: Partial<AnnouncementItem>): Promise<AnnouncementItem> => {
    const { data } = await api.patch<AnnouncementItem>(`/announcements/${id}`, payload);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/announcements/${id}`);
  },
};
