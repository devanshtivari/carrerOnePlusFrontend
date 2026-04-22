export interface ResultStat {
  label: string;
  value: string;
  subText?: string;
  subColor?: string;
  iconName: string;
}

export interface SubjectScore {
  id: string;
  subject: string;
  grade: string;
  score: number;
  maxScore: number;
  trend: "up" | "down" | "stable";
  trendValue: string;
}

export interface TestResult {
  id: string;
  title: string;
  subject: string;
  date: string;
  score: number;
  maxScore: number;
  type: "MCQ" | "Mixed" | "Subjective";
  status: "Graded" | "Pending Review";
}

export interface GrowthPoint {
  month: string;
  score: number;
}

export interface AssignmentResult {
  id: string;
  title: string;
  subject: string;
  submittedDate: string;
  grade: string;
  feedback?: string;
}

export interface ResultsData {
  stats: ResultStat[];
  subjectScores: SubjectScore[];
  recentTests: TestResult[];
  growthTimeline: GrowthPoint[];
  assignments: AssignmentResult[];
}
