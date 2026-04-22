import api from '@/lib/api';

import type { StudentDashboardPayload, TeacherDashboardPayload } from './types';

export const dashboardService = {
  student: async (): Promise<StudentDashboardPayload> => {
    const { data } = await api.get<StudentDashboardPayload>('/dashboard/student');
    return data;
  },
  teacher: async (): Promise<TeacherDashboardPayload> => {
    const { data } = await api.get<TeacherDashboardPayload>('/dashboard/teacher');
    return data;
  },
};
