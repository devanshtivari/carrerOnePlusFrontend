'use client';

import { useEffect, useState } from 'react';

import { authService } from '@/services/auth.service';
import type { UserProfile } from '@/services/types';

export function useCurrentUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    authService
      .getCurrentUser()
      .then((u) => {
        if (!cancelled) setUser(u as UserProfile);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading, error };
}
