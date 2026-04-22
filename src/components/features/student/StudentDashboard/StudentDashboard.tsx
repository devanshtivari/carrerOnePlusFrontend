"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Flame,
  Trophy,
  CheckCircle2,
  Bell,
  AlertTriangle,
  BookOpen,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { useApi } from "@/hooks/useApi";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useNotifications } from "@/hooks/useNotifications";
import { dashboardService } from "@/services/dashboard.service";

import AnnouncementBanner from "./AnnouncementBanner";
import CourseCard from "./CourseCard";
import NotificationDropdown from "./NotificationDropdown";
import StatCard from "./StatCard";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const ICONS: Record<string, LucideIcon> = {
  BarChart3,
  Flame,
  Trophy,
  CheckCircle2,
};

export default function StudentDashboard() {
  const { user, loading: userLoading } = useCurrentUser();
  const { data, loading: dashLoading, error } = useApi(() => dashboardService.student(), []);
  const { unread } = useNotifications({ pageSize: 1 });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleNotifications = useCallback(() => setIsNotificationsOpen((prev) => !prev), []);
  const closeNotifications = useCallback(() => setIsNotificationsOpen(false), []);

  const isLoading = userLoading || dashLoading;
  const displayName = data?.profile?.name || user?.fullName || "Student";
  const initials =
    data?.profile?.initials ||
    (user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : "U");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-surface-300 rounded-full" />
          <div className="h-6 w-48 bg-surface-300 rounded" />
          <div className="h-4 w-32 bg-surface-300 rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-accent-critical/30 bg-accent-critical/10 p-6 text-sm text-accent-critical">
          Could not load dashboard. Please refresh the page.
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-md scale-125 pointer-events-none" />
            <div className="relative size-11 rounded-full bg-surface-300 border border-white/10 flex items-center justify-center text-white text-base font-bold">
              {initials}
            </div>
          </div>
          <div>
            <h1 className="text-[#F2F2F2] text-xl font-bold leading-tight">{displayName}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
              <span className="text-[#A1A1AA] text-[11px] font-medium uppercase tracking-wider">
                Class Rank{" "}
                <span className="text-[#F2F2F2] font-bold">
                  {data.profile.rank || "—"}
                </span>
              </span>
              <span className="w-1 h-1 rounded-full bg-surface-400" />
              <span className="text-[#A1A1AA] text-[11px] font-medium uppercase tracking-wider">
                Total Score{" "}
                <span className="text-[#F2F2F2] font-bold">
                  {data.profile.totalScore || "—"}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="relative flex items-center gap-3">
          <button
            onClick={toggleNotifications}
            className={`relative size-10 rounded-lg border flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isNotificationsOpen
                ? "bg-surface-300 border-white/20 text-white"
                : "bg-surface-200 border-border-default text-[#A1A1AA] hover:text-white hover:bg-surface-300 hover:border-white/20"
            }`}
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute top-2 right-2 size-2 bg-accent-primary rounded-full ring-2 ring-surface-200" />
            )}
          </button>
          <NotificationDropdown isOpen={isNotificationsOpen} onClose={closeNotifications} />
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight">
            Student Dashboard
          </h2>
          <Sparkles size={20} className="text-accent-secondary opacity-60" />
        </div>
        <p className="text-[#A1A1AA] text-sm">
          Welcome back, {displayName.split(" ")[0]}! You&apos;re making great progress this week.
        </p>
      </motion.div>

      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      <motion.div variants={fadeUp}>
        <AnnouncementBanner />
      </motion.div>

      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger}>
        {data?.stats?.map((stat, idx) => {
          const Icon = ICONS[stat.iconName] || CheckCircle2;
          return (
            <motion.div key={idx} variants={fadeUp}>
              <StatCard
                label={stat.label}
                value={stat.value}
                subText={stat.subText ?? ""}
                subColor={stat.subColor ?? undefined}
                icon={Icon}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#F2F2F2] text-lg font-bold">Enrolled Courses</h3>
          <a
            href="/student/courses"
            className="text-[#A1A1AA] hover:text-white text-xs font-medium transition-colors cursor-pointer hover:underline underline-offset-4"
          >
            View all courses
          </a>
        </div>
        {data.enrolledCourses.length === 0 ? (
          <div className="rounded-2xl border border-border-default bg-surface-200 p-8 text-center text-[#A1A1AA] text-sm">
            You haven&apos;t enrolled in any courses yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.enrolledCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                imageUrl={course.imageUrl}
                difficulty={course.difficulty as "Beginner" | "Intermediate" | "Advanced"}
                progress={course.progress}
              />
            ))}
          </div>
        )}
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-5" variants={stagger}>
        <motion.div
          variants={fadeUp}
          className="bg-surface-200 border border-border-default rounded-xl p-5 hover:border-white/10 transition-colors duration-200"
        >
          <h3 className="text-[#F2F2F2] text-base font-bold mb-4">Upcoming Assessments</h3>
          {data.upcomingAssessments.length === 0 ? (
            <p className="text-[#A1A1AA] text-sm">No assessments scheduled.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.upcomingAssessments.map((assessment, index) => (
                <React.Fragment key={assessment.id}>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-300/40 transition-colors duration-150 cursor-pointer group">
                    <div
                      className={`size-10 rounded-lg bg-surface-300 border border-border-default flex items-center justify-center transition-colors ${
                        assessment.icon === "book"
                          ? "text-accent-primary group-hover:border-accent-primary/30"
                          : "text-accent-secondary group-hover:border-accent-secondary/30"
                      }`}
                    >
                      {assessment.icon === "book" ? (
                        <BookOpen size={18} />
                      ) : (
                        <AlertTriangle size={18} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#F2F2F2] text-sm font-semibold leading-tight">
                        {assessment.title}
                      </p>
                      <p className="text-[#A1A1AA] text-xs mt-0.5">
                        {assessment.date} • {assessment.time}
                      </p>
                    </div>
                    <span className="text-[#A1A1AA] text-xs font-medium bg-surface-300/50 px-2.5 py-1 rounded-full whitespace-nowrap">
                      {assessment.duration}
                    </span>
                  </div>

                  {index < data.upcomingAssessments.length - 1 && (
                    <div className="w-full h-px bg-linear-to-r from-transparent via-border-default to-transparent" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="bg-surface-200 border border-border-default rounded-xl p-5 hover:border-white/10 transition-colors duration-200"
        >
          <h3 className="text-[#F2F2F2] text-base font-bold mb-4">Recent Feedback</h3>
          {data.recentFeedback.length === 0 ? (
            <p className="text-[#A1A1AA] text-sm">No feedback yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {data.recentFeedback.map((feedback) => (
                <div
                  key={feedback.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-300/40 transition-colors duration-150 cursor-pointer"
                >
                  <div className="relative shrink-0">
                    <div className="size-10 rounded-full bg-surface-300 border border-border-default flex items-center justify-center text-white text-xs font-bold">
                      {feedback.instructorInitials}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[#F2F2F2] text-sm font-semibold whitespace-nowrap">
                        {feedback.instructorName}
                      </span>
                      <span className="text-[#A1A1AA] text-[10px] sm:text-[11px] bg-surface-300/50 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {feedback.section}
                      </span>
                    </div>
                    <p className="text-[#A1A1AA] text-xs leading-relaxed">{feedback.comment}</p>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 bg-accent-primary/10 text-accent-primary text-xs font-bold px-2.5 py-1 rounded-full border border-accent-primary/20">
                      {feedback.gradeInfo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
