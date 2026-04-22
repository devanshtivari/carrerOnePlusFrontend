import { LucideIcon } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string | number;
  subText?: string;
  subColor?: string;
  icon: LucideIcon;
}

export interface Metric {
  label: string;
  value: string;
  subText: string;
  subColor: string;
  iconName: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  priority: "High" | "Medium" | "Critical";
  studentsAffected?: number;
  timeInfo?: string;
}

export interface TeacherDashboardData {
  stats: Metric[];
  alerts: Alert[];
  upcomingEvents: {
    id: string;
    title: string;
    date: string;
    time: string;
    type: string;
  }[];
}
