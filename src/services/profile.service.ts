import api from '@/lib/api';

import type { PaginatedResult, UserProfile } from './types';

export interface UpdateProfilePayload {
  fullName?: string;
  initials?: string;
  bio?: string;
  mobile?: string;
  grade?: string;
  schoolName?: string;
  rollNo?: string;
  instructorTitle?: string;
  age?: number;
  avatarUrl?: string;
  bannerUrl?: string;
}

export const profileService = {
  me: async (): Promise<UserProfile> => {
    const { data } = await api.get<UserProfile>('/profile/me');
    return data;
  },
  updateMe: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const { data } = await api.patch<UserProfile>('/profile/me', payload);
    return data;
  },
  findById: async (id: string): Promise<UserProfile> => {
    const { data } = await api.get<UserProfile>(`/profile/${id}`);
    return data;
  },
  listStaff: async (page = 1, pageSize = 20): Promise<PaginatedResult<UserProfile>> => {
    const { data } = await api.get<PaginatedResult<UserProfile>>('/profile/staff', {
      params: { page, pageSize },
    });
    return data;
  },
  listStudents: async (page = 1, pageSize = 20): Promise<PaginatedResult<UserProfile>> => {
    const { data } = await api.get<PaginatedResult<UserProfile>>('/profile/students', {
      params: { page, pageSize },
    });
    return data;
  },
};
