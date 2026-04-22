import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  Trophy,
} from "lucide-react";
import React from "react";

import type { NotificationItem as ApiNotificationItem } from "@/services/types";

import { NotificationItem } from "./types";

function categorize(item: ApiNotificationItem): NotificationItem["type"] {
  const apiType = (item.type ?? "").toString().toUpperCase();
  switch (apiType) {
    case "COURSE":
      return "course";
    case "ACHIEVEMENT":
      return "achievement";
    case "FEEDBACK":
      return "feedback";
    case "ALERT":
      return "alert";
    case "SYSTEM":
      return "system";
    default:
      break;
  }

  const title = (item.title || "").toLowerCase();
  if (title.includes("achievement") || title.includes("engagement") || title.includes("badge")) {
    return "achievement";
  }
  if (title.includes("feedback") || title.includes("interaction") || title.includes("reply")) {
    return "feedback";
  }
  if ((item.link || "").includes("/courses") || title.includes("curriculum") || title.includes("lesson")) {
    return "course";
  }
  return "system";
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr${hr === 1 ? "" : "s"} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString();
}

export function fromApi(item: ApiNotificationItem): NotificationItem {
  return {
    id: item.id,
    type: categorize(item),
    title: item.title,
    message: item.body ?? "",
    time: timeAgo(item.createdAt),
    read: item.read ?? Boolean(item.readAt),
  };
}

export const iconMap: Record<
  NotificationItem["type"],
  { icon: React.ElementType; color: string; bg: string }
> = {
  course: {
    icon: BookOpen,
    color: "text-accent-primary",
    bg: "bg-accent-primary/10 border-accent-primary/20",
  },
  achievement: {
    icon: Trophy,
    color: "text-accent-secondary",
    bg: "bg-accent-secondary/10 border-accent-secondary/20",
  },
  feedback: {
    icon: MessageSquare,
    color: "text-sky-400",
    bg: "bg-sky-400/10 border-sky-400/20",
  },
  alert: {
    icon: AlertTriangle,
    color: "text-accent-critical",
    bg: "bg-accent-critical/10 border-accent-critical/20",
  },
  system: {
    icon: CheckCircle2,
    color: "text-[#A1A1AA]",
    bg: "bg-surface-300 border-border-default",
  },
};
