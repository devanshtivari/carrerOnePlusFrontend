'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseApiState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: () => Promise<void>;
  setData: (data: T | null) => void;
}

/**
 * useApi
 * Lightweight async data hook with automatic cancellation on unmount.
 * No global cache - components own their lifecycle.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(() => coursesService.list({ pageSize: 10 }));
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: ReadonlyArray<unknown> = [],
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const cancelled = useRef(false);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      if (!cancelled.current) {
        setData(result);
      }
    } catch (err) {
      if (!cancelled.current) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
      }
    } finally {
      if (!cancelled.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    cancelled.current = false;
    run();
    return () => {
      cancelled.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, refetch: run, setData };
}
