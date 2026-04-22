import type { ReportItem, UserProfile } from "@/services/types";

import { Cohort, RosterStudent, StudentPerformanceData } from "./types";

/**
 * Local fallback for cohort aggregates. Cohorts are not yet exposed as a
 * dedicated endpoint; the component derives a comparable structure from
 * real student data when available.
 *
 * Live data:
 *  - roster:  `GET /profile/students` via `profileService.listStudents()`
 *  - reports: `GET /reports`          via `reportsService.list()`
 */
export const performanceData: StudentPerformanceData = {
  reports: [],
  cohorts: [],
  roster: [],
};

function initialsFor(user: Pick<UserProfile, "fullName" | "initials">): string {
  if (user.initials) return user.initials.toUpperCase();
  return user.fullName
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function toRosterStudent(user: UserProfile): RosterStudent {
  return {
    id: user.id,
    name: user.fullName,
    rollNo: user.rollNo ?? "—",
    grade: user.totalScore ?? 0,
    initials: initialsFor(user),
  };
}

export function toCohorts(users: UserProfile[]): Cohort[] {
  const map = new Map<string, { total: number; count: number }>();
  for (const u of users) {
    const grade = u.grade ?? "Other";
    const rollSection = (u.rollNo ?? "A")
      .replace(/\d/g, "")
      .slice(0, 1)
      .toUpperCase();
    const section = rollSection || "A";
    const key = `${grade}::${section}`;
    const existing = map.get(key) ?? { total: 0, count: 0 };
    existing.total += u.totalScore ?? 0;
    existing.count += 1;
    map.set(key, existing);
  }
  return Array.from(map.entries())
    .map(([key, agg]) => {
      const [grade, section] = key.split("::");
      const avg = agg.count ? agg.total / agg.count : 0;
      return {
        grade,
        section,
        avgPercentage: Math.round(avg * 10) / 10,
        meanGPA: Math.round((avg / 25) * 10) / 10,
      } satisfies Cohort;
    })
    .sort((a, b) => {
      if (a.grade !== b.grade) return a.grade.localeCompare(b.grade);
      return a.section.localeCompare(b.section);
    });
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - then);
  const min = Math.floor(diff / 60000);
  if (min < 60) return `Updated ${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `Updated ${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `Updated ${day}d ago`;
}

export function toReportSummary(
  item: ReportItem,
): StudentPerformanceData["reports"][number] {
  return {
    id: item.id,
    title: item.title,
    updatedAt: timeAgo(item.createdAt),
    icon: item.kind === "PERFORMANCE" ? "BarChart" : "FileText",
  };
}
