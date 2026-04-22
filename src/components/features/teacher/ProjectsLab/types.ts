export interface StatMetric {
  id: string;
  label: string;
  value: string | number;
  subText?: string;
  subColor?: string;
  iconName: string;
}

export interface ProjectProgress {
  id: string;
  gradeContent: string; // e.g. "Grade 9 - Web Portfolio"
  progress: number; // 0-100
}

export interface LabStatus {
  id: string;
  serverName: string;
  status: "Available" | "High Traffic" | "Maintenance";
  uptime: string;
}

export interface ClassDetail {
  id: string;
  className: string;
  activeProjects: number;
}

export interface ProjectsLabData {
  stats: StatMetric[];
  projectProgress: ProjectProgress[];
  labStatus: LabStatus[];
  classes: ClassDetail[];
}

export interface ProjectSubmission {
  id: string;
  fileName: string;
  fileSize: string;
  submissionDate: string;
  downloadUrl: string;
}

export interface ClassStudent {
  id: string;
  name: string;
  initials: string;
  rollNo: string;
  completionPercent: number;
  lastActive: string;
  marks?: number;
  totalMarks?: number;
  status?: "Not Started" | "In Progress" | "Submitted" | "Completed";
  submissions?: ProjectSubmission[];
}

export interface ClassAssignment {
  id: string;
  title: string;
  dueDate: string;
  submittedCount: number;
  totalStudents: number;
  status: "Active" | "Past Due" | "Completed";
}

export interface ClassRoster {
  label: string;
  students: ClassStudent[];
  assignments: ClassAssignment[];
}
