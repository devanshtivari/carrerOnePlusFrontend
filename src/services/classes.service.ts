import api from '@/lib/api';

import type { PaginatedResult, UserProfile } from './types';

export interface ClassItem {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
}

export interface ClassSummary {
  id: string;
  code: string;
  name: string;
  grade?: string | null;
  section?: string | null;
  schoolName?: string | null;
}

export interface ClassMembership {
  id: string;
  classId: string;
  userId: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ASSISTANT';
  joinedAt: string;
  user?: UserProfile;
  /**
   * Back-reference to the class metadata. Populated by
   * `GET /classes/me` so the frontend can scope course / leaderboard
   * queries without a second fetch.
   */
  class?: ClassSummary;
}

export const classesService = {
  list: async (params: { page?: number; pageSize?: number } = {}) => {
    const { data } = await api.get<PaginatedResult<ClassItem>>('/classes', { params });
    return data;
  },
  /**
   * Backend returns `ClassMembership[]` with embedded class context,
   * not raw `ClassItem[]` — each row exposes `classId` for the target class.
   */
  myClasses: async () => {
    const { data } = await api.get<ClassMembership[]>('/classes/me');
    return data;
  },
  findByCode: async (code: string) => {
    const { data } = await api.get<ClassItem>(`/classes/code/${code}`);
    return data;
  },
  findById: async (id: string) => {
    const { data } = await api.get<ClassItem>(`/classes/${id}`);
    return data;
  },
  members: async (id: string) => {
    const { data } = await api.get<ClassMembership[]>(`/classes/${id}/members`);
    return data;
  },
  create: async (payload: Partial<ClassItem>) => {
    const { data } = await api.post<ClassItem>('/classes', payload);
    return data;
  },
  update: async (id: string, payload: Partial<ClassItem>) => {
    const { data } = await api.patch<ClassItem>(`/classes/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/classes/${id}`);
  },
  addMember: async (id: string, payload: { userId: string; role?: ClassMembership['role'] }) => {
    const { data } = await api.post<ClassMembership>(`/classes/${id}/members`, payload);
    return data;
  },
  removeMember: async (membershipId: string) => {
    await api.delete(`/classes/memberships/${membershipId}`);
  },
};
