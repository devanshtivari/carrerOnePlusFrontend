"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * Props for the shared animated EmptyState.
 *
 * The component is intentionally opinionated about the aesthetic (dark
 * surface, orbiting sparkles, subtle gradient halo) so every empty page in
 * the app feels like it belongs to the same product — if you need a
 * completely different look, build a one-off instead of overriding this.
 */
interface EmptyStateProps {
  /** Hero icon displayed inside the animated halo. Defaults to `Sparkles`. */
  icon?: LucideIcon;
  /** Short, scannable heading — 2-6 words is the sweet spot. */
  title: string;
  /** One-line explanation of *why* the list is empty and what to do next. */
  description?: string;
  /** Optional call-to-action button. Uses an internal `href` via `next/link`. */
  action?: {
    label: string;
    href: string;
  };
  /** Optional secondary CTA rendered as a ghost button next to `action`. */
  secondaryAction?: {
    label: string;
    href: string;
  };
  /** Extra classes appended to the outer wrapper (e.g. sizing overrides). */
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const orbitVariants = {
  animate: {
    rotate: 360,
    transition: { repeat: Infinity, duration: 18, ease: "linear" as const },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.06, 1],
    opacity: [0.7, 1, 0.7],
    transition: { repeat: Infinity, duration: 3.2, ease: "easeInOut" as const },
  },
};

export default function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  action,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`relative flex flex-col items-center justify-center text-center rounded-2xl border border-border-default bg-surface-200 px-6 py-12 overflow-hidden ${className}`}
    >
      {/* Ambient gradient halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(circle at 50% 100%, rgba(236,72,153,0.12), transparent 55%)",
        }}
      />

      {/* Icon halo with slow orbit */}
      <div className="relative mb-5 flex items-center justify-center">
        <motion.div
          variants={orbitVariants}
          animate="animate"
          className="absolute size-32 rounded-full border border-dashed border-white/10"
        />
        <motion.div
          variants={orbitVariants}
          animate="animate"
          style={{ animationDelay: "-4s" }}
          className="absolute size-24 rounded-full border border-dashed border-white/15"
        />
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="relative z-10 size-16 rounded-2xl bg-surface-300/80 border border-border-default flex items-center justify-center shadow-lg shadow-black/30"
        >
          <Icon size={28} className="text-[#F2F2F2]" />
        </motion.div>

        {/* Orbiting sparkle dots */}
        <motion.div
          variants={orbitVariants}
          animate="animate"
          className="absolute size-32 pointer-events-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-accent-primary" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-accent-secondary" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-sky-400" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-emerald-400" />
        </motion.div>
      </div>

      <h3 className="relative text-[#F2F2F2] text-lg sm:text-xl font-bold tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="relative mt-2 max-w-md text-sm text-[#A1A1AA] leading-relaxed">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="relative mt-6 flex flex-col sm:flex-row items-center gap-3">
          {action && (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              {action.label}
            </Link>
          )}
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-300 hover:bg-surface-300/80 border border-border-default text-sm font-medium text-[#F2F2F2] transition-colors"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
}
