import {
  AlertTriangle,
  BarChart3,
  Bell,
  BellRing,
  BookOpen,
  Bot,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  ClipboardCheck,
  Code2,
  FileText,
  Flame,
  FolderGit2,
  FolderUp,
  GraduationCap,
  Home,
  LayoutDashboard,
  LineChart,
  type LucideIcon,
  MessageSquare,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";

/**
 * Icon registry: maps backend icon name strings (e.g. "BookOpen") -> Lucide React components.
 * Keep this list in sync with `siteContent.*.iconName` values used by the backend
 * `content` module. Falls back to `BookOpen` when a name is unknown.
 */
const REGISTRY: Record<string, LucideIcon> = {
  AlertTriangle,
  BarChart3,
  Bell,
  BellRing,
  BookOpen,
  Bot,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  ClipboardCheck,
  Code2,
  FileText,
  Flame,
  FolderGit2,
  FolderUp,
  GraduationCap,
  Home,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
};

export function resolveIcon(name?: string | null): LucideIcon {
  if (!name) return BookOpen;
  return REGISTRY[name] ?? BookOpen;
}
