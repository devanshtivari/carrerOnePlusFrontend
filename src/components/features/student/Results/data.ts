import type { ResultsSummary } from "@/services/types";

import { ResultsData } from "./types";

/**
 * Local fallback rendered while the live payload from `GET /results/me`
 * (via `resultsService.myResults()`) is loading or if the request fails.
 *
 * The live data is shaped into `ResultsData` by `toResultsData()` below.
 */
export const resultsData: ResultsData = {
  stats: [
    {
      label: "OVERALL GPA",
      value: "—",
      subText: "Loading…",
      subColor: "text-[#A1A1AA]",
      iconName: "GraduationCap",
    },
    {
      label: "TESTS TAKEN",
      value: "0",
      subText: "—",
      subColor: "text-[#A1A1AA]",
      iconName: "ClipboardCheck",
    },
    {
      label: "ASSIGNMENTS DONE",
      value: "0",
      subText: "—",
      subColor: "text-[#A1A1AA]",
      iconName: "FileCheck",
    },
    {
      label: "PROJECTS COMPLETED",
      value: "0",
      subText: "—",
      subColor: "text-[#A1A1AA]",
      iconName: "FolderCheck",
    },
  ],
  subjectScores: [],
  recentTests: [],
  growthTimeline: [
    { month: "Sep", score: 0 },
    { month: "Oct", score: 0 },
    { month: "Nov", score: 0 },
    { month: "Dec", score: 0 },
  ],
  assignments: [],
};

function gradeFromPct(pct: number): string {
  if (pct >= 95) return "A+";
  if (pct >= 90) return "A";
  if (pct >= 85) return "A-";
  if (pct >= 80) return "B+";
  if (pct >= 75) return "B";
  if (pct >= 70) return "B-";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

function gradeFromScore(score: number, maxScore: number): string {
  if (maxScore <= 0) return "-";
  return gradeFromPct((score / maxScore) * 100);
}

function formatDate(iso?: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function mapTestType(type: string): "MCQ" | "Mixed" | "Subjective" {
  const t = type.toUpperCase();
  if (t === "MCQ" || t === "MULTIPLE_CHOICE") return "MCQ";
  if (t === "SUBJECTIVE" || t === "ESSAY" || t === "DESCRIPTIVE") return "Subjective";
  return "Mixed";
}

function mapTestStatus(status: string): "Graded" | "Pending Review" {
  return status.toUpperCase() === "GRADED" ? "Graded" : "Pending Review";
}

export function toResultsData(summary: ResultsSummary): ResultsData {
  const s = summary.stats;
  const stats: ResultsData["stats"] = [
    {
      label: "OVERALL GPA",
      value: (s.overallGpa ?? 0).toFixed(1),
      subText: `${s.testsThisMonth} tests this month`,
      subColor: "text-accent-primary",
      iconName: "GraduationCap",
    },
    {
      label: "TESTS TAKEN",
      value: String(s.testsTaken),
      subText: `${summary.recentTests.length} recent`,
      subColor: "text-[#A1A1AA]",
      iconName: "ClipboardCheck",
    },
    {
      label: "ASSIGNMENTS DONE",
      value: String(s.assignmentsDone),
      subText: s.assignmentsPending > 0 ? `${s.assignmentsPending} pending` : "All caught up",
      subColor:
        s.assignmentsPending > 0 ? "text-accent-secondary" : "text-accent-primary",
      iconName: "FileCheck",
    },
    {
      label: "PROJECTS COMPLETED",
      value: String(s.projectsCompleted),
      subText: `${s.projectsTotal} total`,
      subColor: "text-accent-primary",
      iconName: "FolderCheck",
    },
  ];

  const subjectScores: ResultsData["subjectScores"] = summary.subjectScores.map((row) => ({
    id: row.id,
    subject: row.subject,
    grade: row.grade ?? gradeFromScore(row.score, row.maxScore),
    score: row.score,
    maxScore: row.maxScore,
    trend: row.trend === "UP" ? "up" : row.trend === "DOWN" ? "down" : "stable",
    trendValue: row.trendValue ?? "0",
  }));

  const recentTests: ResultsData["recentTests"] = summary.recentTests.map((t) => ({
    id: t.id,
    title: t.title,
    subject: t.subject || "—",
    date: formatDate(t.date),
    score: t.score,
    maxScore: t.maxScore,
    type: mapTestType(t.type),
    status: mapTestStatus(t.status),
  }));

  const growthTimeline: ResultsData["growthTimeline"] = summary.growthTimeline.length
    ? summary.growthTimeline.map((g) => ({ month: g.month, score: g.score }))
    : resultsData.growthTimeline;

  const assignments: ResultsData["assignments"] = summary.assignments.map((a) => ({
    id: a.id,
    title: a.title,
    subject: a.subject || "—",
    submittedDate: formatDate(a.submittedDate),
    grade: a.grade ?? "-",
    feedback: a.feedback ?? undefined,
  }));

  return { stats, subjectScores, recentTests, growthTimeline, assignments };
}
