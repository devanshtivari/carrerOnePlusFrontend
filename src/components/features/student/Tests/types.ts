export interface MCQOption {
  id: string;
  text: string;
}

export interface TestQuestion {
  id: string;
  type: 'mcq' | 'text';
  question: string;
  marks: number;
  options?: MCQOption[]; // Only for MCQ
}

export interface TestGuideline {
  id: string;
  text: string;
}

export interface TestPrerequisite {
  /** Course that owns the prerequisite chapter. */
  courseId: string;
  /** Chapter the student must complete before this test unlocks. */
  chapterId: string;
  chapterTitle: string;
  unitId: string;
  /** Deep link to the chapter page. */
  href: string;
}

export interface TestInfo {
  id: string;
  title: string;
  course: string;
  courseId?: string | null;
  duration: number; // in minutes
  totalQuestions: number;
  totalMarks: number;
  type: 'MCQ' | 'Mixed' | 'Subjective';
  status: 'Upcoming' | 'Live' | 'Completed';
  scheduledDate: string;
  scheduledTime: string;
  testCode: string; // unique code to enter the test
  /** Set when the test is gated behind a chapter that is not yet complete. */
  prerequisite?: TestPrerequisite;
  /** `true` if the prerequisite chapter has been completed (or none exists). */
  unlocked: boolean;
}

export interface TestResult {
  totalQuestions: number;
  attempted: number;
  timeTaken: number; // in seconds
  submittedAt: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string; // optionId for MCQ, text for text questions
}
