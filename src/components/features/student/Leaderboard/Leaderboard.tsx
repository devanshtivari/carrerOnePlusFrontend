"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Flame, BookOpen, ChevronRight, Globe, Flag, School, Users } from "lucide-react";
import Link from "next/link";

import EmptyState from "@/components/shared/EmptyState";
import { useApi } from "@/hooks/useApi";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { classesService } from "@/services/classes.service";
import { leaderboardService } from "@/services/leaderboard.service";

import { SCOPE_API_MAP, emptyLeaderboard, toLeaderboardData } from "./data";
import type { LeaderboardScope, LeaderboardUser } from "./types";

/* ── Animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/* ── Tab config ── */
const tabs: { key: LeaderboardScope; label: string; icon: React.ElementType }[] = [
  { key: "class", label: "Class", icon: Users },
  { key: "school", label: "School", icon: School },
  { key: "national", label: "National", icon: Flag },
  { key: "global", label: "Global", icon: Globe },
];

export default function Leaderboard() {
  const { user: currentUser, loading: userLoading } = useCurrentUser();
  const [activeScope, setActiveScope] = useState<LeaderboardScope>("class");

  const scopeParam = SCOPE_API_MAP[activeScope];

  // The backend requires a `scopeKey` for CLASS / SCHOOL leaderboards.
  // We look up the student's class membership (first match) and use their
  // `schoolName` from the auth profile; NATIONAL / GLOBAL need no key.
  const { data: myMemberships, loading: membershipsLoading } = useApi(
    () => classesService.myClasses(),
    [],
  );
  const classId = myMemberships?.[0]?.classId ?? null;
  const schoolName = currentUser?.schoolName ?? null;

  const scopeKey =
    scopeParam === "CLASS"
      ? classId
      : scopeParam === "SCHOOL"
        ? schoolName
        : null;

  const scopeKeyRequired = scopeParam === "CLASS" || scopeParam === "SCHOOL";
  const scopeKeyMissing = scopeKeyRequired && !scopeKey;

  const { data: payload, loading: boardLoading } = useApi(
    () => {
      if (scopeKeyMissing) return Promise.resolve(null);
      return leaderboardService.list({
        scope: scopeParam,
        ...(scopeKey ? { scopeKey } : {}),
        limit: 10,
      });
    },
    [scopeParam, scopeKey, scopeKeyMissing],
  );

  const handleScopeChange = useCallback((scope: LeaderboardScope) => {
    setActiveScope(scope);
  }, []);

  const isLoading =
    userLoading ||
    membershipsLoading ||
    (boardLoading && !scopeKeyMissing);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 text-white">
        <div className="animate-pulse flex flex-col gap-6 w-full max-w-4xl">
          <div className="h-10 w-48 bg-surface-300 rounded mb-8" />
          <div className="h-64 rounded-xl bg-surface-300 w-full" />
        </div>
      </div>
    );
  }

  const scopeData =
    payload && !scopeKeyMissing
      ? toLeaderboardData(activeScope, payload)
      : emptyLeaderboard;

  const usersWithRealData = scopeData.users.map((u: LeaderboardUser) => {
    if (u.isCurrentUser && currentUser?.fullName) {
      return {
        ...u,
        name: currentUser.fullName,
        initials:
          currentUser.initials ?? currentUser.fullName.substring(0, 2).toUpperCase(),
      };
    }
    return u;
  });

  const topUsers = usersWithRealData.filter((u) => u.rank <= 3);
  const restUsers = usersWithRealData.filter((u) => u.rank > 3);

  /* Find current user if outside top-10 (shown as a pinned footer row) */
  const currentUserEntry = usersWithRealData.find((u) => u.isCurrentUser);
  const currentUserInList = restUsers.some((u) => u.isCurrentUser) || topUsers.some((u) => u.isCurrentUser);

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 lg:gap-8"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumbs */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 text-[13px] text-[#A1A1AA] font-medium"
      >
        <Link
          href="/student"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Home
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2]">Leaderboard</span>
      </motion.div>

      {/* Title + Scope Tabs */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[#F2F2F2] text-3xl font-black tracking-tight">
              {scopeData.title}
            </h1>
            <Trophy size={24} className="text-accent-primary opacity-80" />
          </div>
          <p className="text-[#A1A1AA] text-base max-w-2xl">
            {scopeData.description}
          </p>
        </div>

        {/* Scope Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-200 border border-border-default rounded-xl w-fit shrink-0">
          {tabs.map((tab) => {
            const isActive = activeScope === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => handleScopeChange(tab.key)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    : "text-[#A1A1AA] hover:text-white hover:bg-surface-300"
                }`}
              >
                <Icon size={15} className={isActive ? "text-black" : ""} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Gradient Separator */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      {scopeKeyMissing && (
        <motion.div variants={fadeUp}>
          <EmptyState
            icon={activeScope === "class" ? Users : School}
            title={
              activeScope === "class"
                ? "No class leaderboard yet"
                : "No school leaderboard yet"
            }
            description={
              activeScope === "class"
                ? "You're not part of a class yet — once you're enrolled, your class leaderboard will appear here."
                : "We couldn't determine your school from your profile, so the school leaderboard is unavailable."
            }
            action={{ label: "View my classes", href: "/student/classes" }}
          />
        </motion.div>
      )}

      {/* ── Podium Section ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`podium-${activeScope}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {topUsers.length === 3 && (
            <div className="flex justify-center items-end gap-3 sm:gap-8 pb-4 px-4 relative">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-surface-300/20 to-transparent pointer-events-none rounded-b-3xl blur-2xl" />

              {/* 2nd Place */}
              <div className="relative flex flex-col items-center w-28 sm:w-36">
                <div className="relative size-14 sm:size-16 rounded-full bg-surface-300 border-2 border-zinc-500/50 flex items-center justify-center text-white text-lg font-bold shadow-[0_0_20px_rgba(161,161,170,0.15)] mb-3 z-10">
                  {topUsers[1].initials}
                  <div className="absolute -bottom-2 -right-2 size-6 rounded-full bg-zinc-700 border border-zinc-500 flex items-center justify-center text-xs font-black text-white shadow-lg">
                    2
                  </div>
                </div>
                <div className="text-center mb-3">
                  <p className="text-[#F2F2F2] text-sm font-bold truncate w-full px-1">
                    {topUsers[1].name}
                  </p>
                  <p className="text-[#A1A1AA] text-xs font-bold mt-0.5">
                    {topUsers[1].points} pts
                  </p>
                </div>
                <div className="w-full h-24 sm:h-28 bg-linear-to-t from-surface-300 to-surface-200 border-t border-x border-zinc-500/20 rounded-t-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-zinc-500/5" />
                </div>
              </div>

              {/* 1st Place */}
              <div className="relative flex flex-col items-center w-32 sm:w-44 z-10">
                <div className="mb-2 text-amber-400">
                  <Trophy
                    size={32}
                    fill="currentColor"
                    className="opacity-80 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                  />
                </div>
                <div className="relative size-20 sm:size-24 rounded-full bg-surface-300 border-2 border-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_30px_rgba(245,158,11,0.25)] mb-3 z-10">
                  {topUsers[0].initials}
                  <div className="absolute -bottom-3 -right-3 size-8 rounded-full bg-amber-600 border-2 border-amber-400 flex items-center justify-center text-sm font-black text-white shadow-lg">
                    1
                  </div>
                </div>
                <div className="text-center mb-4">
                  <p className="text-[#F2F2F2] text-base font-bold truncate w-full px-1">
                    {topUsers[0].name}
                  </p>
                  <p className="text-accent-primary text-sm font-bold mt-0.5">
                    {topUsers[0].points} pts
                  </p>
                </div>
                <div className="w-full h-32 sm:h-40 bg-linear-to-t from-surface-300 to-amber-950/20 border-t border-x border-amber-500/30 rounded-t-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-amber-500/5" />
                  <div className="absolute inset-x-0 top-0 h-1 bg-amber-500/50" />
                </div>
              </div>

              {/* 3rd Place */}
              <div className="relative flex flex-col items-center w-28 sm:w-36">
                <div className="relative size-14 sm:size-16 rounded-full bg-surface-300 border-2 border-orange-600/50 flex items-center justify-center text-white text-lg font-bold shadow-[0_0_20px_rgba(234,88,12,0.15)] mb-3 z-10">
                  {topUsers[2].initials}
                  <div className="absolute -bottom-2 -right-2 size-6 rounded-full bg-orange-800 border border-orange-600 flex items-center justify-center text-xs font-black text-white shadow-lg">
                    3
                  </div>
                </div>
                <div className="text-center mb-3">
                  <p className="text-[#F2F2F2] text-sm font-bold truncate w-full px-1">
                    {topUsers[2].name}
                  </p>
                  <p className="text-[#A1A1AA] text-xs font-bold mt-0.5">
                    {topUsers[2].points} pts
                  </p>
                </div>
                <div className="w-full h-20 sm:h-24 bg-linear-to-t from-surface-300 to-surface-200 border-t border-x border-orange-600/20 rounded-t-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-orange-600/5" />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Table Section ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`table-${activeScope}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
          className="bg-surface-200 border border-border-default rounded-xl overflow-hidden flex flex-col relative z-20"
        >
          {/* Header row */}
          <div className="hidden md:grid grid-cols-[3rem_minmax(10rem,1fr)_repeat(2,minmax(5rem,auto))_5rem] sm:grid-cols-[4rem_minmax(12rem,1fr)_repeat(2,minmax(6rem,auto))_6rem] gap-3 sm:gap-4 items-center px-4 sm:px-5 py-4 bg-surface-300 border-b border-border-default">
            <div className="text-[#A1A1AA] text-[11px] font-bold uppercase tracking-wider text-center">
              Rank
            </div>
            <div className="text-[#A1A1AA] text-[11px] font-bold uppercase tracking-wider">
              Student
            </div>
            <div className="text-[#A1A1AA] text-[11px] font-bold uppercase tracking-wider">
              Courses
            </div>
            <div className="text-[#A1A1AA] text-[11px] font-bold uppercase tracking-wider">
              Streak
            </div>
            <div className="text-[#A1A1AA] text-[11px] font-bold uppercase tracking-wider text-right">
              Score
            </div>
          </div>

          {/* User list */}
          <motion.div
            className="flex flex-col"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {restUsers.map((user) => (
              <LeaderboardRow key={user.id} user={user} />
            ))}
          </motion.div>

          {/* Pinned current user row if they're not in the visible list */}
          {!currentUserInList && currentUserEntry && (
            <>
              <div className="mx-4 flex items-center gap-3 py-2">
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-border-default to-transparent" />
                <span className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-widest shrink-0">
                  Your Position
                </span>
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-border-default to-transparent" />
              </div>
              <LeaderboardRow user={currentUserEntry} />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Extracted Row Component ── */
function LeaderboardRow({ user }: { user: LeaderboardUser }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`grid grid-cols-[3rem_1fr_auto] md:grid-cols-[4rem_minmax(12rem,1fr)_repeat(2,minmax(6rem,auto))_6rem] gap-3 sm:gap-4 items-center px-4 sm:px-5 py-4 border-b border-border-default last:border-0 hover:bg-surface-300/40 transition-colors duration-200 group ${
        user.isCurrentUser
          ? "bg-surface-300/20 shadow-[inset_3px_0_0_0_#10B981]"
          : ""
      }`}
    >
      {/* Rank */}
      <div className="flex justify-center items-center">
        <div className="text-[#A1A1AA] font-bold text-sm sm:text-base">
          {user.rank}
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`relative shrink-0 size-9 sm:size-10 rounded-full border flex items-center justify-center text-xs font-bold ${
            user.isCurrentUser
              ? "bg-surface-300 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
              : "bg-surface-300 border-border-default text-white group-hover:border-white/20 transition-colors"
          }`}
        >
          {user.initials}
        </div>
        <div className="truncate">
          <div className="flex items-center gap-2">
            <span className="text-[#F2F2F2] font-semibold text-sm sm:text-base truncate">
              {user.name}
            </span>
            {user.isCurrentUser && (
              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                You
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Courses - hidden on mobile */}
      <div className="hidden md:flex items-center gap-2 text-[#A1A1AA] text-sm font-medium">
        <BookOpen
          size={14}
          className="text-surface-400 group-hover:text-[#A1A1AA] transition-colors"
        />
        {user.coursesCompleted}
      </div>

      {/* Streak - hidden on mobile */}
      <div className="hidden md:flex items-center gap-2 text-[#A1A1AA] text-sm font-medium">
        <Flame
          size={14}
          className="text-accent-secondary/70 group-hover:text-accent-secondary transition-colors"
        />
        {user.streak}{" "}
        <span className="text-[10px] text-surface-400 uppercase tracking-widest hidden lg:inline">
          Days
        </span>
      </div>

      {/* Points */}
      <div className="flex flex-col items-end gap-0.5 sm:gap-1">
        <div className="flex items-center gap-1.5">
          <Trophy
            size={14}
            className="text-accent-primary hidden sm:block opacity-70 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-[#F2F2F2] font-bold text-sm sm:text-base whitespace-nowrap">
            {user.points}
          </span>
        </div>
        <span className="text-[#A1A1AA] text-[10px] font-bold uppercase tracking-wider block md:hidden">
          Points
        </span>
      </div>
    </motion.div>
  );
}
