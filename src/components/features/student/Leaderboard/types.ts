export type LeaderboardScope = "class" | "school" | "national" | "global";

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  initials: string;
  points: string;
  coursesCompleted: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardData {
  title: string;
  description: string;
  users: LeaderboardUser[];
}

export type ScopedLeaderboardData = Record<LeaderboardScope, LeaderboardData>;
