"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  TrendingUp,
  UserCheck,
  Rocket,
  Bell,
  AlertTriangle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { useApi } from "@/hooks/useApi";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useNotifications } from "@/hooks/useNotifications";
import { dashboardService } from "@/services/dashboard.service";

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
  Users,
  TrendingUp,
  UserCheck,
  Rocket,
};

function formatEventDate(iso: string): { mon: string; day: string } {
  const d = new Date(iso);
  const mon = d.toLocaleDateString(undefined, { month: "short" }).toUpperCase();
  const day = String(d.getDate()).padStart(2, "0");
  return { mon, day };
}

function formatEventTime(iso: string, location?: string | null): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return location ? `${time} • ${location}` : time;
}

export default function TeacherDashboard() {
  const { user, loading: userLoading } = useCurrentUser();
  const { data, loading, error } = useApi(() => dashboardService.teacher(), []);
  const { unread } = useNotifications({ pageSize: 1 });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleNotifications = useCallback(() => setIsNotificationsOpen((p) => !p), []);
  const closeNotifications = useCallback(() => setIsNotificationsOpen(false), []);

  const isLoading = userLoading || loading;
  const displayName = data?.profile?.name || user?.fullName || "Teacher";
  const initials =
    data?.profile?.initials ||
    (user?.fullName ? user.fullName.substring(0, 2).toUpperCase() : "T");
  const role = data?.profile?.title || user?.instructorTitle || "Lead Teacher";

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
                Role <span className="text-[#F2F2F2] font-bold">{role}</span>
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
            Principal Dashboard
          </h2>
          <Sparkles size={20} className="text-accent-secondary opacity-60" />
        </div>
        <p className="text-[#A1A1AA] text-sm">
          Overview of institutional academic performance and operations.
        </p>
      </motion.div>

      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger}>
        {data.stats.map((stat, idx) => {
          const Icon = ICONS[stat.iconName] || Users;
          return (
            <motion.div key={idx} variants={fadeUp}>
              <StatCard
                label={stat.label}
                value={stat.value}
                subText={stat.subText ?? ""}
                subColor="text-[#A1A1AA]"
                icon={Icon}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={stagger}>
        <motion.div
          variants={fadeUp}
          className="lg:col-span-2 bg-surface-200 border border-border-default rounded-xl p-6 relative group overflow-hidden"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-[#F2F2F2] text-lg font-bold">Class-wise Performance</h3>
              <p className="text-[#A1A1AA] text-xs">
                Academic scoring distribution (Classes 6-9)
              </p>
            </div>
            <div className="bg-surface-300 text-[#F2F2F2] text-xs font-semibold px-3 py-1.5 rounded-full">
              Quarterly
            </div>
          </div>

          <div className="relative h-64 w-full flex items-end justify-between px-4 pb-6 mt-10">
            <div className="absolute top-0 w-full border-b border-border-default opacity-50"></div>
            <div className="absolute top-1/2 w-full border-b border-border-default opacity-50"></div>
            <div className="absolute bottom-6 w-full border-b border-border-default"></div>

            <div className="flex flex-col items-center gap-2 group/bar cursor-pointer z-10 w-1/4">
              <div className="h-10 w-16 md:w-20 bg-surface-300 rounded-t-sm group-hover/bar:bg-surface-400 transition-colors relative" />
              <span className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider relative top-2">
                CLASS 6
              </span>
              <span className="text-accent-critical text-[10px] font-bold relative top-2">
                Lowest
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 group/bar cursor-pointer z-10 w-1/4">
              <div className="h-28 w-16 md:w-20 bg-surface-300 rounded-t-sm group-hover/bar:bg-surface-400 transition-colors relative" />
              <span className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider relative top-2">
                CLASS 7
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 group/bar cursor-pointer z-10 w-1/4">
              <div className="relative h-48 w-16 md:w-20 bg-accent-primary rounded-t-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-start justify-center pt-2 group-hover/bar:brightness-110 transition-all cursor-pointer">
                <div className="absolute -top-7 bg-accent-primary text-black text-[10px] font-extrabold px-2 py-0.5 rounded shadow-lg opacity-0 lg:opacity-100 group-hover/bar:opacity-100 transition-opacity">
                  92%
                </div>
              </div>
              <span className="text-accent-primary text-xs font-bold uppercase tracking-wider relative top-2">
                CLASS 8
              </span>
              <span className="text-accent-primary text-[10px] font-bold relative top-2">
                Top Best
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 group/bar cursor-pointer z-10 w-1/4">
              <div className="h-36 w-16 md:w-20 bg-surface-300 rounded-t-sm group-hover/bar:bg-surface-400 transition-colors relative" />
              <span className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider relative top-2">
                CLASS 9
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div className="flex flex-col gap-6" variants={stagger}>
          <motion.div
            variants={fadeUp}
            className="bg-surface-200 border border-border-default rounded-xl p-5 hover:border-white/20 transition-all duration-200 cursor-default"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-accent-critical" />
                <h3 className="text-[#F2F2F2] text-lg font-bold">Critical Alerts</h3>
              </div>
              <span className="bg-accent-critical/20 text-accent-critical text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border border-accent-critical/30">
                Action Req.
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {data.alerts.length === 0 ? (
                <p className="text-[#A1A1AA] text-sm">No critical alerts.</p>
              ) : (
                data.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg flex flex-col gap-1.5 border backdrop-blur-md ${
                      alert.priority === "CRITICAL"
                        ? "bg-accent-critical/5 border-accent-critical/20"
                        : "bg-accent-secondary/5 border-accent-secondary/20"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-[#F2F2F2] text-sm font-semibold">{alert.title}</h4>
                      {alert.studentsAffected ? (
                        <span className="text-accent-critical text-xs font-bold text-right shrink-0">
                          {alert.studentsAffected}
                          <br />
                          Students
                        </span>
                      ) : (
                        <span className="text-accent-secondary text-xs font-bold shrink-0 text-right">
                          {alert.priority}
                          <br />
                          Priority
                        </span>
                      )}
                    </div>
                    <p className="text-[#A1A1AA] text-xs">{alert.message}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-surface-200 border border-border-default rounded-xl p-5 shrink-0 grow hover:border-white/20 transition-all duration-200 cursor-default"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[#F2F2F2] text-base font-bold">Upcoming Events</h3>
              <span className="text-[#A1A1AA] text-xs font-bold uppercase hover:text-white cursor-pointer transition-colors tracking-wide">
                Calendar
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {data.upcomingEvents.length === 0 ? (
                <p className="text-[#A1A1AA] text-sm">No upcoming events.</p>
              ) : (
                data.upcomingEvents.map((event) => {
                  const { mon, day } = formatEventDate(event.startsAt);
                  return (
                    <div key={event.id} className="flex gap-4 group">
                      <div className="flex flex-col items-center justify-center shrink-0 w-12 h-14 bg-surface-300 border border-border-default rounded-lg">
                        <span className="text-[#A1A1AA] text-[10px] font-bold uppercase tracking-tight">
                          {mon}
                        </span>
                        <span className="text-accent-primary text-base font-black">{day}</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[#F2F2F2] text-sm font-bold group-hover:text-white transition-colors">
                          {event.title}
                        </p>
                        <p className="text-[#A1A1AA] text-xs">
                          {formatEventTime(event.startsAt, event.location)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
