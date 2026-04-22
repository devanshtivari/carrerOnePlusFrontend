import api from '@/lib/api';
import { apiDebug, apiWarn } from '@/lib/debug';

import type { NotificationItem, PaginatedResult } from './types';

export interface NotificationListResponse extends PaginatedResult<NotificationItem> {
  unread: number;
}

/**
 * Backend sends `readAt` (Date | null). The UI consumes a derived boolean
 * `read` — this helper keeps a single source of truth at the service boundary
 * so components can rely on either field.
 */
function normalise(item: NotificationItem): NotificationItem {
  return {
    ...item,
    read: item.read ?? Boolean(item.readAt),
  };
}

/**
 * Some older / dev builds of the backend may return a bare array instead of
 * a paginated envelope. Accept both shapes so the UI doesn't flicker empty
 * while we migrate handlers.
 */
function coerceList(
  data: unknown,
): { rawItems: NotificationItem[]; envelope: Partial<NotificationListResponse> } {
  if (Array.isArray(data)) {
    return { rawItems: data as NotificationItem[], envelope: {} };
  }
  if (data && typeof data === 'object') {
    const d = data as Partial<NotificationListResponse> & { data?: unknown };
    if (Array.isArray(d.items)) {
      return { rawItems: d.items, envelope: d };
    }
    // Some NestJS interceptors wrap the payload as `{ data: {...} }`.
    if (d.data && typeof d.data === 'object' && Array.isArray((d.data as { items?: unknown }).items)) {
      return {
        rawItems: (d.data as { items: NotificationItem[] }).items,
        envelope: d.data as Partial<NotificationListResponse>,
      };
    }
  }
  return { rawItems: [], envelope: {} };
}

export const notificationsService = {
  listMine: async (
    params: { page?: number; pageSize?: number; unreadOnly?: boolean } = {},
  ): Promise<NotificationListResponse> => {
    const { data } = await api.get<NotificationListResponse>('/notifications/me', { params });
    apiDebug('notifications.listMine', 'raw response', data);

    const { rawItems, envelope } = coerceList(data);
    if (rawItems.length === 0 && (envelope.unread ?? 0) > 0) {
      apiWarn(
        'notifications.listMine',
        `server reports unread=${envelope.unread} but returned 0 items — likely paginated out or filtered.`,
      );
    }

    const items = rawItems.map(normalise);
    return {
      items,
      total: envelope.total ?? items.length,
      page: envelope.page ?? 1,
      pageSize: envelope.pageSize ?? items.length,
      totalPages: envelope.totalPages ?? (items.length ? 1 : 0),
      unread: envelope.unread ?? 0,
    };
  },
  markRead: async (id: string): Promise<NotificationItem> => {
    const { data } = await api.patch<NotificationItem>(`/notifications/${id}/read`);
    return normalise(data);
  },
  markAllRead: async (): Promise<{ updated: number }> => {
    const { data } = await api.patch<{ updated: number }>('/notifications/me/read-all');
    return data;
  },
  create: async (payload: {
    userId: string;
    type: NotificationItem['type'];
    title: string;
    body?: string;
    link?: string;
  }): Promise<NotificationItem> => {
    const { data } = await api.post<NotificationItem>('/notifications', payload);
    return normalise(data);
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};
