"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell, CheckSquare, ChevronRight } from "lucide-react";
import Link from "next/link";

import { useNotifications } from "@/hooks/useNotifications";

import { fromApi, iconMap } from "./data";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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

export default function NotificationsView() {
  const { items, unread, loading, error, markAllRead, markRead } = useNotifications();
  const notifications = items.map(fromApi);

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 text-[13px] text-[#A1A1AA] font-medium"
      >
        <Link href="/teacher" className="hover:text-white transition-colors cursor-pointer">
          Home
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2]">Notifications</span>
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center justify-between">
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
              Stay on top of updates, grading alerts, and platform maintenance.
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

      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      {error && (
        <div className="rounded-2xl border border-accent-critical/30 bg-accent-critical/10 p-4 text-sm text-accent-critical">
          Could not load notifications. Please try again later.
        </div>
      )}

      <motion.div variants={fadeUp} className="flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-surface-200 border border-border-default rounded-2xl">
            <div className="animate-pulse size-12 rounded-full bg-surface-300 mb-4" />
            <p className="text-[#A1A1AA] text-sm">Loading notifications…</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-surface-200 border border-border-default rounded-2xl">
            <Bell size={48} className="text-surface-300 mb-4" />
            <h3 className="text-[#F2F2F2] text-lg font-bold">You&apos;re all caught up!</h3>
            <p className="text-[#A1A1AA] text-sm mt-1">No new notifications at the moment.</p>
          </div>
        ) : (
          notifications.map((item) => {
            const { icon: Icon, color, bg } = iconMap[item.type];
            return (
              <motion.div
                key={item.id}
                variants={fadeUp}
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

                <div className={`shrink-0 size-12 rounded-xl border flex items-center justify-center ${bg} ${color}`}>
                  <Icon size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h3 className={`text-base font-bold ${item.read ? 'text-[#F2F2F2]' : 'text-white'}`}>
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
      </motion.div>
    </motion.div>
  );
}
