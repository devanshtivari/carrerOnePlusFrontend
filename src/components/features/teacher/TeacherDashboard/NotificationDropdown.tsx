"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

import { useNotifications } from "@/hooks/useNotifications";

import { fromApi, iconMap } from "../Notifications/data";

/* ── Component Props ── */
interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return;

    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    /* Delay listener so the triggering click doesn't immediately close */
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, onClose]);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const { items, unread, markAllRead, markRead } = useNotifications({ autoLoad: isOpen, pageSize: 10 });
  const notifications = items.map(fromApi);
  const unreadCount = unread;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            ref={dropdownRef}
            /* ── Positioning ──
             *  • Mobile: full-width centered overlay
             *  • Desktop: anchored top-right below the bell button */
            className="
              fixed sm:absolute z-50
              inset-x-4 top-20 sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2
              w-auto sm:w-[380px]
              bg-surface-100 border border-border-default
              rounded-2xl shadow-2xl shadow-black/40
              flex flex-col
              max-h-[calc(100vh-6rem)] sm:max-h-[480px]
              overflow-hidden
            "
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-default shrink-0">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-[#F2F2F2]" />
                <h3 className="text-[#F2F2F2] text-sm font-bold">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-accent-primary/15 text-accent-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-accent-primary/20">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="size-7 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-surface-300 transition-all cursor-pointer"
                aria-label="Close notifications"
              >
                <X size={14} />
              </button>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                  <Bell
                    size={32}
                    className="text-surface-400 mb-3"
                  />
                  <p className="text-[#A1A1AA] text-sm font-medium">
                    No notifications yet
                  </p>
                  <p className="text-[#A1A1AA]/60 text-xs mt-1">
                    We&apos;ll notify you of important updates.
                  </p>
                </div>
              ) : (
                <div className="py-1">
                  {notifications.map((item, idx) => {
                    const { icon: Icon, color, bg } = iconMap[item.type];

                    return (
                      <React.Fragment key={item.id}>
                        <button
                          onClick={() => !item.read && markRead(item.id)}
                          className={`w-full text-left flex items-start gap-3.5 px-5 py-3.5 transition-colors duration-150 cursor-pointer group ${
                            item.read
                              ? "hover:bg-surface-200/60"
                              : "bg-surface-200/30 hover:bg-surface-200/60"
                          }`}
                        >
                          {/* Icon */}
                          <div
                            className={`shrink-0 size-9 rounded-lg border flex items-center justify-center ${bg} ${color} mt-0.5`}
                          >
                            <Icon size={16} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`text-sm font-semibold leading-tight ${
                                  item.read
                                    ? "text-[#A1A1AA]"
                                    : "text-[#F2F2F2]"
                                }`}
                              >
                                {item.title}
                              </p>

                              {/* Unread dot */}
                              {!item.read && (
                                <span className="shrink-0 mt-1.5 size-2 bg-accent-primary rounded-full" />
                              )}
                            </div>
                            <p className="text-[#A1A1AA] text-xs leading-relaxed mt-0.5 line-clamp-2">
                              {item.message}
                            </p>
                            <span className="text-[#A1A1AA]/60 text-[10px] font-medium mt-1 block">
                              {item.time}
                            </span>
                          </div>
                        </button>

                        {/* Separator */}
                        {idx < notifications.length - 1 && (
                          <div className="mx-5 h-px bg-linear-to-r from-transparent via-border-default to-transparent" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border-default px-5 py-3 flex items-center justify-between">
              <button
                onClick={() => markAllRead()}
                disabled={unread === 0}
                className="text-[#A1A1AA] hover:text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                Mark all as read
              </button>
              <a
                href="/teacher/notifications"
                onClick={onClose}
                className="text-accent-primary hover:text-accent-primary/80 text-xs font-bold transition-colors cursor-pointer"
              >
                View all
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
