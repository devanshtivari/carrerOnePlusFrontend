export interface Unit {
  id: string;
  title: string;
  topics: number;
  duration: string;
  status: "completed" | "in-progress" | "locked";
}

export interface CourseData {
  id: string;
  shortName: string;
  title: string;
  description: string;
  imageUrl: string;
  progress: number;
  totalUnits: number;
  totalTopics: number;
  tests: number;
  projects: number;
  learnings: string[];
  instructor: {
    name: string;
    title: string;
    avatarInitials: string;
  };
  classmates: number;
  units: Unit[];
}
