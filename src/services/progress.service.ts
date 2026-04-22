import api from '@/lib/api';

export interface CourseProgress {
  courseId: string;
  enrollmentId?: string | null;
  totalLessons: number;
  completedLessons: number;
  /**
   * Older endpoints returned `percent`; the current backend serialises this
   * as `progressPercent` (see `ProgressService.recalcCourseProgress`). Both
   * are exposed here so consumers don't need to care which one landed.
   */
  percent?: number;
  progressPercent?: number;
  completedAt?: string | null;
  completedLessonIds?: string[];
  recentLessonId?: string | null;
}

export const progressService = {
  markLessonComplete: async (lessonId: string) => {
    const { data } = await api.post('/progress/lessons', { lessonId });
    return data;
  },
  unmarkLesson: async (lessonId: string) => {
    await api.delete(`/progress/lessons/${lessonId}`);
  },
  forCourse: async (courseId: string): Promise<CourseProgress> => {
    const { data } = await api.get<CourseProgress>(`/progress/courses/${courseId}`);
    return data;
  },
  forUserCourse: async (userId: string, courseId: string): Promise<CourseProgress> => {
    const { data } = await api.get<CourseProgress>(
      `/progress/users/${userId}/courses/${courseId}`,
    );
    return data;
  },
};
