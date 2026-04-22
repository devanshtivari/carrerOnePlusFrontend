export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "Lesson" | "Quiz" | "Lab" | "Case Study";
  completed: boolean;
}

export interface UnitResource {
  name: string;
  type: string;
  sizeOrUrl: string;
}

export interface Chapter {
  id: string;
  title: string;
  duration: string;
  description: string;
  lessons: Lesson[];
  progress: number; // 0 to 100
  totalLessons: number;
}

export interface UnitData {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  imageUrl: string;
  progress: number;
  chapters: Chapter[];
  resources: UnitResource[];
}

export interface CourseContext {
  id: string;
  shortName: string;
  title: string;
}

export interface NextUnit {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  locked: boolean;
}
