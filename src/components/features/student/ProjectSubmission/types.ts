export interface SubmissionCourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  level: string; // e.g., "MIDDLE SCHOOL", "ADVANCED", "EXPERT"
  levelColor: string; // e.g., "text-blue-500", "text-emerald-500", "text-purple-500"
  availableProjects: number;
  avatars: { id: string; initials: string; bgColor: string; textColor: string }[];
}

export interface SubmissionUnit {
  id: string;
  unitNumber: string;
  title: string;
  interactiveProjects: number;
  hours: number;
  imageUrl?: string;
  isLocked: boolean;
}

export interface SubmissionProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  deadline: string;
  status: 'Not Submitted' | 'Submitted' | 'Graded';
}
