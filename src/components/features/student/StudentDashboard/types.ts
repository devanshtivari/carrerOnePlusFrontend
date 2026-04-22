import { LucideIcon } from "lucide-react";

export interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
}

export interface StatCardProps {
  label: string;
  value: string;
  subText?: string;
  subColor?: string;
  icon: LucideIcon;
}

export interface AnnouncementBannerData {
  tag: string;
  sponsor: string;
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink?: string;
  secondaryCtaText: string;
  secondaryCtaLink?: string;
  sponsorName: string;
  /** Tailwind bg class for the tag pill, e.g. "bg-emerald-400" */
  tagColor: string;
  /** Tailwind text class for the tag text, e.g. "text-black" */
  tagTextColor: string;
  /** Tailwind classes for the primary CTA button */
  ctaColor: string;
  /** CSS color for decorative blur orb */
  orbColor: string;
  /** Optional right-side illustration */
  imageUrl?: string;
}

export interface StudentProfile {
  name: string;
  initials: string;
  rank: string;
  totalScore: string;
}

export interface AssessmentData {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  icon: "book" | "alert";
}

export interface FeedbackData {
  id: string;
  instructorName: string;
  instructorInitials: string;
  section: string;
  comment: string;
  gradeInfo: string;
}

export interface StatData {
  label: string;
  value: string;
  subText: string;
  subColor?: string;
  iconName: "BarChart3" | "Flame" | "Trophy" | "CheckCircle2";
}

export interface StudentDashboardData {
  profile: StudentProfile;
  enrolledCourses: CourseCardProps[];
  upcomingAssessments: AssessmentData[];
  recentFeedback: FeedbackData[];
  stats: StatData[];
}
