"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, CheckSquare, ChevronRight } from "lucide-react";
import Link from "next/link";

import EmptyState from "@/components/shared/EmptyState";
import { useNotifications } from "@/hooks/useNotifications";

import { fromApi, iconMap } from "./data";

// NOTE:
// We intentionally avoid Framer Motion's variant-propagation pattern here
// (parent `variants={stagger}` + child `variants={fadeUp}`). Under Next.js
// 15 + React 19 a small subset of renders kept the grandchild list items
// pinned at `opacity: 0` — the data was fetched and `map()` ran (visible
// in the console), but nothing painted. Using explicit `initial`/`animate`
// per motion element sidesteps the propagation entirely and is still
// reasonably orchestrated thanks to staggered `transition.delay`s.

const fadeDelays = (base: number, step = 0.06) =>
  Array.from({ length: 64 }, (_, i) => base + i * step);

export default function NotificationsView() {
  const { items, unread, loading, error, markAllRead, markRead } = useNotifications();

  const notifications = items.map(fromApi);
  const delays = fadeDelays(0.15);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      {/* Breadcrumbs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-2 text-[13px] text-[#A1A1AA] font-medium"
      >
        <Link href="/student" className="hover:text-white transition-colors cursor-pointer">
          Home
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2]">Notifications</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-xl bg-surface-200 border border-border-default flex items-center justify-center">
            <Bell size={24} className="text-[#F2F2F2]" />
          </div>
          <div>
            <h1 className="text-[#F2F2F2] text-2xl font-bold leading-tight flex items-center gap-2">
              Notifications
              {unread > 0 && (
                <span className="bg-accent-primary/10 text-accent-primary text-xs font-bold px-2.5 py-0.5 rounded-full border border-accent-primary/20">
                  {unread} new
                </span>
              )}
            </h1>
            <p className="text-[#A1A1AA] text-sm mt-0.5">
              Catch up on updates, reminders, and recent feedback.
            </p>
          </div>
        </div>

        <button
          onClick={() => markAllRead()}
          disabled={unread === 0 || loading}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-surface-200 hover:bg-surface-300 border border-border-default rounded-lg text-sm font-medium text-[#F2F2F2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckSquare size={16} className="text-[#A1A1AA]" />
          Mark all as read
        </button>
      </motion.div>

      {/* Gradient Separator */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      {error && (
        <div className="rounded-2xl border border-accent-critical/30 bg-accent-critical/10 p-4 text-sm text-accent-critical">
          Could not load notifications. Please try again later.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-surface-200 border border-border-default rounded-2xl">
            <div className="animate-pulse size-12 rounded-full bg-surface-300 mb-4" />
            <p className="text-[#A1A1AA] text-sm">Loading notifications…</p>
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="You're all caught up"
            description="No new notifications at the moment. We'll ping you here when there's something new from your courses, teachers, or the platform."
            action={{ label: "Back to dashboard", href: "/student" }}
          />
        ) : (
          notifications.map((item, idx) => {
            // Guard against an unknown notification type silently rendering
            // nothing: fall back to the `system` preset so the row is always
            // visible even if the backend starts emitting a new enum value.
            const preset = iconMap[item.type] ?? iconMap.system;
            const { icon: Icon, color, bg } = preset;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: delays[idx] ?? 0.15,
                  ease: "easeOut",
                }}
                onClick={() => !item.read && markRead(item.id)}
                className={`relative flex items-start gap-4 p-5 rounded-2xl border transition-colors ${
                  item.read
                    ? "bg-surface-200/50 border-border-default"
                    : "bg-surface-200 border-border-default hover:border-white/10 cursor-pointer"
                }`}
              >
                {!item.read && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-primary rounded-r-full" />
                )}

                <div
                  className={`shrink-0 size-12 rounded-xl border flex items-center justify-center ${bg} ${color}`}
                >
                  <Icon size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h3
                      className={`text-base font-bold ${
                        item.read ? "text-[#F2F2F2]" : "text-white"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span className="text-[#A1A1AA] text-xs font-semibold whitespace-nowrap bg-surface-300/50 px-2 py-1 rounded-md w-fit">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-2xl">
                    {item.message}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
