import api from '@/lib/api';

import type { CalendarEventItem, PaginatedResult } from './types';

export interface CalendarListParams {
  page?: number;
  pageSize?: number;
  type?: CalendarEventItem['type'];
  from?: string;
  to?: string;
}

export const calendarService = {
  list: async (params: CalendarListParams = {}): Promise<PaginatedResult<CalendarEventItem>> => {
    const { data } = await api.get<PaginatedResult<CalendarEventItem>>('/calendar-events', {
      params,
    });
    return data;
  },
  findById: async (id: string): Promise<CalendarEventItem> => {
    const { data } = await api.get<CalendarEventItem>(`/calendar-events/${id}`);
    return data;
  },
  create: async (payload: Partial<CalendarEventItem>): Promise<CalendarEventItem> => {
    const { data } = await api.post<CalendarEventItem>('/calendar-events', payload);
    return data;
  },
  update: async (
    id: string,
    payload: Partial<CalendarEventItem>,
  ): Promise<CalendarEventItem> => {
    const { data } = await api.patch<CalendarEventItem>(`/calendar-events/${id}`, payload);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/calendar-events/${id}`);
  },
};
