import api from '@/lib/api';

import type { ScopedLeaderboard } from './types';

export type LeaderboardScopeKey = 'CLASS' | 'SCHOOL' | 'NATIONAL' | 'GLOBAL';

export interface LeaderboardParams {
  scope: LeaderboardScopeKey;
  scopeKey?: string;
  limit?: number;
}

export const leaderboardService = {
  list: async (params: LeaderboardParams): Promise<ScopedLeaderboard> => {
    const { data } = await api.get<ScopedLeaderboard>('/leaderboard', { params });
    return data;
  },
  recompute: async (params: {
    scope: LeaderboardScopeKey;
    scopeKey?: string;
  }): Promise<{ scope: string; scopeKey: string | null; count: number }> => {
    const { data } = await api.post<{
      scope: string;
      scopeKey: string | null;
      count: number;
    }>('/leaderboard/recompute', params);
    return data;
  },
};
