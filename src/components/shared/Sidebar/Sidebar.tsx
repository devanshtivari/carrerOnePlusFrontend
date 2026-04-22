"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ChevronRight, X } from "lucide-react";
import { authService } from "@/services/auth.service";
import { contentService } from "@/services/content.service";
import { resolveIcon } from "@/lib/icons";
import { studentNavItems as studentFallback, teacherNavItems as teacherFallback, type SidebarNavItem } from "./data";
import type { SidebarProps } from "./types";
import { getAssetPath } from "@/utils/assets";

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState<{fullName: string; role: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studentItems, setStudentItems] = useState<SidebarNavItem[]>(studentFallback);
  const [teacherItems, setTeacherItems] = useState<SidebarNavItem[]>(teacherFallback);

  useEffect(() => {
    authService.getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    contentService
      .navigation()
      .then((nav) => {
        if (cancelled) return;
        setStudentItems(
          nav.studentNavItems.map((it) => ({
            label: it.label,
            href: it.href,
            icon: resolveIcon(it.iconName),
          })),
        );
        setTeacherItems(
          nav.teacherNavItems.map((it) => ({
            label: it.label,
            href: it.href,
            icon: resolveIcon(it.iconName),
          })),
        );
      })
      .catch(() => {
        // Keep fallback values on failure.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    if (onClose) onClose();
    router.push("/login");
  };

  const isTeacher = user?.role === "TEACHER" || user?.role === "INSTRUCTOR" || user?.role === "ADMIN";
  const navItemsToUse = isTeacher ? teacherItems : studentItems;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border-default">

        <Link 
          href={user?.role === "TEACHER" ? "/teacher" : "/student"} 
          onClick={onClose}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="size-7 flex items-center justify-center bg-white rounded shrink-0">
            <Image src={getAssetPath("/LOGO.svg")} alt="Career1Plus Logo" width={20} height={20} className="object-contain" />
          </div>
          <h2 className="text-[#F2F2F2] text-lg font-bold leading-tight tracking-[-0.015em]">
            Career1Plus
          </h2>
        </Link>

        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden size-8 rounded-lg flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-surface-300 transition-all cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
        {navItemsToUse.map((item, index) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/student" && item.href !== "/teacher" && pathname.startsWith(item.href));

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.05 * index,
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    : "text-[#A1A1AA] hover:bg-surface-300 hover:text-white"
                }`}
              >
                <item.icon
                  size={20}
                  className={
                    isActive
                      ? "text-black"
                      : "text-[#A1A1AA] group-hover:text-white transition-colors"
                  }
                />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <ChevronRight size={14} className="text-black/40" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Gradient separator */}
      <div className="mx-4 h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      {/* User Profile & Logout */}
      <div className="px-4 py-4 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex items-center gap-3 px-2 py-1 rounded-lg">
            <div className="size-9 rounded-full bg-surface-300 animate-pulse border border-border-default" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-4 w-24 bg-surface-300 animate-pulse rounded" />
              <div className="h-3 w-16 bg-surface-300 animate-pulse rounded" />
            </div>
          </div>
        ) : (
          <Link
            href="/student/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-surface-300/30 transition-colors duration-200 cursor-pointer"
          >
            <div className="relative">
              <div className="size-9 rounded-full bg-surface-300 border border-border-default flex items-center justify-center text-white text-sm font-bold uppercase">
                {user?.fullName ? user.fullName.substring(0, 2) : "U"}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-accent-primary rounded-full ring-2 ring-surface-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#F2F2F2] text-sm font-semibold leading-tight">
                {user?.fullName || "Student"}
              </span>
              <span className="text-[#A1A1AA] text-xs max-w-30 truncate capitalize">
                {user?.role ? `${user.role} Account` : "Account"}
              </span>
            </div>
          </Link>
        )}

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-accent-critical hover:bg-accent-critical/10 transition-all duration-200 w-full cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar — always visible on lg+ */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-surface-100 border-r border-border-default flex-col z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer — slide-in overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.aside
              className="fixed top-0 left-0 h-screen w-72 bg-surface-100 border-r border-border-default flex flex-col z-50 lg:hidden shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
