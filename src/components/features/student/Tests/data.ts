import type { TestItem } from '@/services/types';

import { TestGuideline, TestInfo } from './types';

/** Local fallback; live data comes from `GET /tests` via `testsService.list()`. */
export const availableTests: TestInfo[] = [];

export const testGuidelines: TestGuideline[] = [
  { id: 'g1', text: 'Do not refresh or close the browser during the test. Your progress will be lost.' },
  { id: 'g2', text: 'Each question carries the marks indicated next to it. There is no negative marking.' },
  { id: 'g3', text: 'For MCQ questions, select the single best answer from the options provided.' },
  { id: 'g4', text: 'For text-based questions, provide clear and concise answers in the text area.' },
  { id: 'g5', text: 'The timer starts as soon as you click "Begin Test". It cannot be paused.' },
  { id: 'g6', text: 'The test will auto-submit when the timer reaches zero.' },
  { id: 'g7', text: 'You may navigate between questions freely using the question navigation panel.' },
  { id: 'g8', text: 'Ensure a stable internet connection throughout the test duration.' },
];

export function mapTestType(apiType: string | null | undefined): TestInfo['type'] {
  const t = (apiType ?? '').toUpperCase();
  if (t === 'MCQ') return 'MCQ';
  if (t === 'SUBJECTIVE') return 'Subjective';
  return 'Mixed';
}

export function mapTestStatus(apiStatus: string | null | undefined): TestInfo['status'] {
  const s = (apiStatus ?? '').toUpperCase();
  if (s === 'LIVE') return 'Live';
  if (s === 'COMPLETED' || s === 'ARCHIVED') return 'Completed';
  return 'Upcoming';
}

function formatScheduledDate(iso?: string | null): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
}

function formatScheduledTime(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function toTestInfo(item: TestItem): TestInfo {
  return {
    id: item.id,
    title: item.title ?? 'Untitled test',
    course: item.courseLabel ?? item.course?.title ?? '—',
    courseId: item.courseId ?? item.course?.id ?? null,
    duration: item.durationMinutes ?? 0,
    totalQuestions: item.totalQuestions ?? 0,
    totalMarks: item.totalMarks ?? 0,
    type: mapTestType(item.type),
    status: mapTestStatus(item.status),
    scheduledDate: formatScheduledDate(item.scheduledAt),
    scheduledTime: formatScheduledTime(item.scheduledAt),
    testCode: item.code ?? '',
    // Optimistic default — the dashboard mixes in real prerequisite data
    // once curriculum + progress for the owning course have been resolved.
    unlocked: true,
  };
}
