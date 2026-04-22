// Shared API types mirroring backend DTOs / responses.
// Keep these in sync with backend schema/DTOs.

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  initials?: string | null;
  bio?: string | null;
  role: UserRole;
  isEmailVerified?: boolean;
  isActive?: boolean;
  authProvider?: string;
  mobile?: string | null;
  grade?: string | null;
  schoolName?: string | null;
  age?: number | null;
  rollNo?: string | null;
  instructorTitle?: string | null;
  totalScore?: number | null;
  rank?: number | null;
  attendance?: number | null;
  percentile?: number | null;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
}

// Catalog / Courses
export type CourseDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  iconName?: string | null;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  imageUrl?: string | null;
  difficulty: CourseDifficulty;
  estimatedHours?: number | null;
  isPublished: boolean;
  categoryId?: string | null;
  category?: Category | null;
  instructorId?: string | null;
  instructor?: { id: string; fullName: string; avatarUrl?: string | null } | null;
  unitsCount?: number;
  enrollmentsCount?: number;
}

export interface Unit {
  id: string;
  courseId: string;
  slug: string;
  title: string;
  description?: string | null;
  position: number;
}

export interface Chapter {
  id: string;
  unitId: string;
  slug: string;
  title: string;
  description?: string | null;
  position: number;
}

export interface Lesson {
  id: string;
  chapterId: string;
  slug: string;
  title: string;
  description?: string | null;
  contentMarkdown?: string | null;
  videoUrl?: string | null;
  durationMinutes?: number | null;
  position: number;
}

export interface Resource {
  id: string;
  unitId: string;
  title: string;
  url: string;
  type?: string | null;
}

// Enrollments / progress
export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  progress: number;
  enrolledAt: string;
  course?: Course;
}

// Engagement / notifications
// Mirrors the Prisma `NotificationType` enum on the backend.
export type NotificationType =
  | 'COURSE'
  | 'ACHIEVEMENT'
  | 'FEEDBACK'
  | 'ALERT'
  | 'SYSTEM';
export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body?: string | null;
  link?: string | null;
  /**
   * Timestamp the notification was marked read. `null` / missing means unread.
   * The backend column is `readAt` — we keep both names for compatibility
   * across the codebase and derive `read` client-side where convenient.
   */
  readAt?: string | null;
  read?: boolean;
  createdAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  description?: string | null;
  audience: 'ALL' | 'STUDENTS' | 'INSTRUCTORS' | 'ADMINS';
  ctaText?: string | null;
  ctaUrl?: string | null;
  imageUrl?: string | null;
  tag?: string | null;
  sponsor?: string | null;
  sponsorName?: string | null;
  tagColor?: string | null;
  tagTextColor?: string | null;
  ctaColor?: string | null;
  orbColor?: string | null;
  publishedAt?: string | null;
  expiresAt?: string | null;
  isActive: boolean;
  authorId?: string | null;
}

export interface FeedbackItem {
  id: string;
  studentId: string;
  instructorId: string;
  body: string;
  sectionLabel?: string | null;
  gradeLabel?: string | null;
  contextType?: string | null;
  contextId?: string | null;
  createdAt: string;
  student?: UserProfile;
  instructor?: UserProfile;
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  studentsAffected?: number | null;
  timeInfo?: string | null;
  resolvedAt?: string | null;
  resolvedById?: string | null;
  createdAt: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  type: 'CLASS' | 'EXAM' | 'DEADLINE' | 'EVENT' | 'OTHER';
  startsAt: string;
  endsAt?: string | null;
  location?: string | null;
  description?: string | null;
  ownerId?: string | null;
}

// Labs
export interface LabItem {
  id: string;
  name: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE' | 'MAINTENANCE';
  uptimeNote?: string | null;
  activeUsers?: number | null;
  updatedAt: string;
}

// Analytics / Results / Reports
export interface SubjectScore {
  id: string;
  userId: string;
  subjectLabel: string;
  score: number;
  maxScore: number;
  gradeLabel?: string | null;
  trend: 'UP' | 'DOWN' | 'STABLE';
  trendValue?: string | number | null;
  recordedAt: string;
}

export interface GrowthSnapshot {
  id: string;
  userId: string;
  monthKey: string;
  monthLabel: string;
  score: number;
  recordedAt: string;
}

export interface ReportItem {
  id: string;
  ownerId: string;
  title: string;
  description?: string | null;
  kind: 'PERFORMANCE' | 'ATTENDANCE' | 'PROJECT' | 'TEST' | 'CUSTOM';
  payload?: unknown;
  createdAt: string;
}

export interface ResultsSummary {
  stats: {
    overallGpa: number;
    testsTaken: number;
    testsThisMonth: number;
    assignmentsDone: number;
    assignmentsPending: number;
    projectsCompleted: number;
    projectsTotal: number;
  };
  subjectScores: Array<{
    id: string;
    subject: string;
    grade: string | null;
    score: number;
    maxScore: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
    trendValue: string | null;
  }>;
  recentTests: Array<{
    id: string;
    title: string;
    subject: string;
    date: string;
    score: number;
    maxScore: number;
    type: string;
    status: string;
  }>;
  growthTimeline: Array<{ month: string; score: number }>;
  assignments: Array<{
    id: string;
    title: string;
    subject: string;
    submittedDate: string | null;
    grade: string | null;
    feedback: string | null;
  }>;
}

export interface StudentDashboardPayload {
  profile: {
    id: string;
    name: string;
    initials: string;
    rank?: string | null;
    totalScore?: string | null;
  };
  stats: Array<{
    label: string;
    value: string;
    subText?: string | null;
    subColor?: string | null;
    iconName: string;
  }>;
  enrolledCourses: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    difficulty: string;
    progress: number;
  }>;
  upcomingAssessments: Array<{
    id: string;
    title: string;
    date: string;
    time: string;
    duration: string;
    icon: string;
  }>;
  recentFeedback: Array<{
    id: string;
    instructorName: string;
    instructorInitials: string;
    section: string;
    comment: string;
    gradeInfo: string;
  }>;
}

export interface TeacherDashboardPayload {
  profile: {
    id: string;
    name: string;
    initials: string;
    title?: string | null;
  };
  stats: Array<{ label: string; value: string; iconName: string; subText?: string | null }>;
  alerts: AlertItem[];
  upcomingEvents: CalendarEventItem[];
  recentFeedback: FeedbackItem[];
}

// Tests / assessments
export type TestStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'ARCHIVED';
export type TestType = 'MCQ' | 'MIXED' | 'SUBJECTIVE';
export interface TestItem {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  courseLabel?: string | null;
  courseId?: string | null;
  durationMinutes: number;
  totalMarks: number;
  totalQuestions: number;
  type: TestType;
  status: TestStatus;
  scheduledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  course?: { id: string; slug: string; title: string } | null;
}

export interface TestQuestion {
  id: string;
  testId: string;
  prompt: string;
  type: 'MCQ' | 'TEXT';
  marks: number;
  position: number;
  options: Array<{
    id: string;
    label: string;
    text: string;
    isCorrect?: boolean;
    position: number;
  }>;
}

export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'EXPIRED';
  score?: number | null;
  startedAt: string;
  submittedAt?: string | null;
}

// Leaderboard
export interface LeaderboardEntry {
  id: string;
  scope: 'CLASS' | 'SCHOOL' | 'NATIONAL' | 'GLOBAL';
  scopeKey: string | null;
  userId: string;
  rank: number;
  points: number;
  coursesDone: number;
  streakDays: number;
  computedAt: string;
  user: {
    id: string;
    fullName: string;
    avatarUrl?: string | null;
    initials?: string | null;
  };
  isCurrentUser?: boolean;
}

export interface ScopedLeaderboard {
  scope: 'CLASS' | 'SCHOOL' | 'NATIONAL' | 'GLOBAL';
  scopeKey: string | null;
  entries: LeaderboardEntry[];
  currentUser: LeaderboardEntry | null;
}

// Content
export interface NavLinkContent {
  label: string;
  href: string;
}
export interface SidebarLinkContent extends NavLinkContent {
  iconName: string;
}
export interface FooterColumnContent {
  title: string;
  links: NavLinkContent[];
}
export interface LandingFeatureContent {
  iconName: string;
  title: string;
  description: string;
}
export interface LandingJourneyStepContent {
  num: string;
  title: string;
  description: string;
}
export interface LandingCollabContent {
  title: string;
  description: string;
}

export interface SiteContent {
  brand: { name: string; tagline: string };
  navLinks: NavLinkContent[];
  studentNavItems: SidebarLinkContent[];
  teacherNavItems: SidebarLinkContent[];
  footer: { columns: FooterColumnContent[]; legal: string };
  landing: {
    features: LandingFeatureContent[];
    journey: LandingJourneyStepContent[];
    collaboration: LandingCollabContent[];
  };
}

export type NavigationContent = Pick<
  SiteContent,
  "navLinks" | "studentNavItems" | "teacherNavItems"
>;
export type FooterContent = SiteContent["footer"];
export type LandingContent = SiteContent["landing"];

// Generic list query
export interface ListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}
