import api from '@/lib/api';

import type { GrowthSnapshot, ResultsSummary, SubjectScore } from './types';

export const resultsService = {
  myResults: async (): Promise<ResultsSummary> => {
    const { data } = await api.get<ResultsSummary>('/results/me');
    return data;
  },
  forUser: async (userId: string): Promise<ResultsSummary> => {
    const { data } = await api.get<ResultsSummary>(`/results/users/${userId}`);
    return data;
  },
  upsertSubjectScore: async (
    userId: string,
    payload: {
      subjectLabel: string;
      score: number;
      maxScore?: number;
      gradeLabel?: string;
      trend?: SubjectScore['trend'];
      trendValue?: number;
    },
  ): Promise<SubjectScore> => {
    const { data } = await api.put<SubjectScore>(
      `/results/users/${userId}/subject-scores`,
      payload,
    );
    return data;
  },
  upsertGrowth: async (
    userId: string,
    payload: { monthKey: string; monthLabel: string; score: number },
  ): Promise<GrowthSnapshot> => {
    const { data } = await api.put<GrowthSnapshot>(`/results/users/${userId}/growth`, payload);
    return data;
  },
};
