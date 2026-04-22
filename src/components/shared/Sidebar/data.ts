import type { LucideIcon } from "lucide-react";

import { resolveIcon } from "@/lib/icons";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Local fallback navigation. The runtime values are loaded from the backend
 * (`GET /content/navigation`). These constants are still exported so that:
 *   1. We have a working sidebar before the network request resolves.
 *   2. Any older imports continue to type-check.
 *
 * Edit copy/links in `backend/src/content/content.config.ts` instead.
 */
const STUDENT_FALLBACK = [
  { label: "Dashboard", href: "/student", iconName: "LayoutDashboard" },
  { label: "Leaderboard", href: "/student/leaderboard", iconName: "Trophy" },
  { label: "Courses", href: "/student/courses", iconName: "BookOpen" },
  { label: "Project Submission", href: "/student/project-submission", iconName: "FolderUp" },
  { label: "Test Section", href: "/student/tests", iconName: "ClipboardCheck" },
  { label: "My Results", href: "/student/results", iconName: "GraduationCap" },
  { label: "Code Playground", href: "/student/code-playground", iconName: "Code2" },
  { label: "AI Code Tutor", href: "/student/ai-assistant", iconName: "Bot" },
  { label: "Community", href: "/student/community", iconName: "Users" },
  { label: "Notifications", href: "/student/notifications", iconName: "BellRing" },
] as const;

const TEACHER_FALLBACK = [
  { label: "Dashboard", href: "/teacher", iconName: "LayoutDashboard" },
  { label: "Student Performance", href: "/teacher/performance", iconName: "LineChart" },
  { label: "Projects & Lab", href: "/teacher/projects", iconName: "FolderUp" },
  { label: "Reports", href: "/teacher/reports", iconName: "FileText" },
  { label: "Alerts", href: "/teacher/alerts", iconName: "BellRing" },
  { label: "Leaderboard", href: "/teacher/leaderboard", iconName: "Trophy" },
  { label: "Notifications", href: "/teacher/notifications", iconName: "BellRing" },
] as const;

function toItems(
  items: ReadonlyArray<{ label: string; href: string; iconName: string }>,
): SidebarNavItem[] {
  return items.map((it) => ({ label: it.label, href: it.href, icon: resolveIcon(it.iconName) }));
}

export const studentNavItems: SidebarNavItem[] = toItems(STUDENT_FALLBACK);
export const teacherNavItems: SidebarNavItem[] = toItems(TEACHER_FALLBACK);
