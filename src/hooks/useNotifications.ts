'use client';

import { useCallback, useEffect, useState } from 'react';

import { notificationsService } from '@/services/notifications.service';
import type { NotificationItem } from '@/services/types';

export function useNotifications(opts: { autoLoad?: boolean; pageSize?: number } = {}) {
  const { autoLoad = true, pageSize = 20 } = opts;
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationsService.listMine({ pageSize });
      setItems(Array.isArray(res?.items) ? res.items : []);
      setUnread(res?.unread ?? 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    if (autoLoad) {
      refetch();
    }
  }, [autoLoad, refetch]);

  const markRead = useCallback(async (id: string) => {
    await notificationsService.markRead(id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnread((u) => Math.max(0, u - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    await notificationsService.markAllRead();
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  }, []);
  
  return { items, unread, loading, error, refetch, markRead, markAllRead };
}
