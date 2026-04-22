export interface RosterStudent {
  id: string;
  name: string;
  rollNo: string;
  grade: number;
  initials: string;
}

export type Cohort = {
  grade: string;
  section: string;
  avgPercentage?: number;
  meanGPA?: number;
};

export interface StudentPerformanceData {
  reports: {
    id: string;
    title: string;
    updatedAt: string;
    icon: string;
  }[];
  cohorts: Cohort[];
  roster: RosterStudent[];
}
