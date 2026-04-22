import type {
  LeaderboardScopeKey,
} from "@/services/leaderboard.service";
import type { LeaderboardEntry, ScopedLeaderboard } from "@/services/types";

import type {
  LeaderboardData,
  LeaderboardScope,
  LeaderboardUser,
  ScopedLeaderboardData,
} from "./types";

export const SCOPE_API_MAP: Record<LeaderboardScope, LeaderboardScopeKey> = {
  class: "CLASS",
  school: "SCHOOL",
  national: "NATIONAL",
  global: "GLOBAL",
};

const SCOPE_TITLES: Record<LeaderboardScope, { title: string; description: string }> = {
  class: {
    title: "Class Leaderboard",
    description: "Top performing students across your class this week.",
  },
  school: {
    title: "School Leaderboard",
    description: "Top students across all classes in your school.",
  },
  national: {
    title: "National Leaderboard",
    description: "Top students across the country competing for the crown.",
  },
  global: {
    title: "Global Leaderboard",
    description: "The best learners worldwide. See where you stand on the global stage.",
  },
};

function initialsFor(entry: LeaderboardEntry): string {
  if (entry.user.initials) return entry.user.initials.toUpperCase();
  return entry.user.fullName
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function toUser(entry: LeaderboardEntry): LeaderboardUser {
  return {
    id: entry.id,
    rank: entry.rank,
    name: entry.user.fullName,
    initials: initialsFor(entry),
    points: entry.points.toLocaleString(),
    coursesCompleted: entry.coursesDone,
    streak: entry.streakDays,
    isCurrentUser: !!entry.isCurrentUser,
  };
}

export function toLeaderboardData(
  scope: LeaderboardScope,
  payload: ScopedLeaderboard,
): LeaderboardData {
  const meta = SCOPE_TITLES[scope];
  const users = payload.entries.map(toUser);
  if (payload.currentUser && !users.some((u) => u.isCurrentUser)) {
    users.push(toUser({ ...payload.currentUser, isCurrentUser: true }));
  }
  return { ...meta, users };
}

export const emptyLeaderboard: LeaderboardData = {
  title: "Leaderboard",
  description: "Loading rankings…",
  users: [],
};

/**
 * Local fallback used while the live payload is in flight or when the
 * backend cannot be reached. Live data comes from `GET /leaderboard`
 * via `leaderboardService.list({ scope })`.
 */
export const leaderboardData: ScopedLeaderboardData = {
  class: { ...SCOPE_TITLES.class, users: [] },
  school: { ...SCOPE_TITLES.school, users: [] },
  national: { ...SCOPE_TITLES.national, users: [] },
  global: { ...SCOPE_TITLES.global, users: [] },
};
