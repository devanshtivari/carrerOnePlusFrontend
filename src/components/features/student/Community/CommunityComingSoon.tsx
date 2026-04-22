"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  MessageSquare,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";

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

const FEATURE_CARDS: Array<{
  title: string;
  description: string;
  icon: typeof Users;
}> = [
  {
    title: "Study groups",
    description:
      "Form cohorts around subjects you care about, share notes, and solve doubts together.",
    icon: Users,
  },
  {
    title: "Discussion threads",
    description:
      "Ask questions, compare approaches, and get feedback from peers and mentors.",
    icon: MessageSquare,
  },
  {
    title: "Weekly challenges",
    description:
      "Opt-in coding and analysis challenges with community-voted best solutions.",
    icon: Trophy,
  },
];

export default function CommunityComingSoon() {
  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8"
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
        <span className="text-[#F2F2F2]">Community</span>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-3">
        <div className="size-12 rounded-xl bg-surface-200 border border-border-default flex items-center justify-center">
          <Users size={24} className="text-[#F2F2F2]" />
        </div>
        <div>
          <h1 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight">
            Community
          </h1>
          <p className="text-[#A1A1AA] text-sm mt-0.5">
            A shared space to learn with — and from — your cohort.
          </p>
        </div>
      </motion.div>

      {/* Gradient Separator */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      {/* Hero card */}
      <motion.div
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl border border-border-default bg-surface-200"
      >
        {/* decorative gradient glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-accent-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 p-8 lg:p-12">
          <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full border border-accent-primary/30 bg-accent-primary/10 text-accent-primary text-[11px] font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            Coming soon
          </span>

          <h2 className="text-[#F2F2F2] text-2xl lg:text-4xl font-bold leading-tight max-w-2xl">
            Your cohort, your questions, your momentum — all in one place.
          </h2>

          <p className="text-[#A1A1AA] text-sm lg:text-base leading-relaxed max-w-2xl">
            We&apos;re building a focused space for students to connect with
            classmates, exchange feedback on projects, and celebrate wins
            together. It&apos;ll unlock alongside your next cohort — stay tuned.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/student"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-bold hover:bg-[#E5E5E5] transition-colors cursor-pointer"
            >
              Back to dashboard
            </Link>
            <Link
              href="/student/notifications"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-default bg-surface-300 text-[#F2F2F2] text-sm font-semibold hover:bg-surface-200 hover:border-white/20 transition-colors cursor-pointer"
            >
              Get notified
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Feature preview grid */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {FEATURE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={fadeUp}
              className="rounded-2xl border border-border-default bg-surface-200 p-5 flex flex-col gap-3 hover:border-white/10 transition-colors"
            >
              <div className="size-10 rounded-lg border border-border-default bg-surface-300/60 flex items-center justify-center text-[#F2F2F2]">
                <Icon size={18} />
              </div>
              <h3 className="text-[#F2F2F2] text-base font-bold leading-tight">
                {card.title}
              </h3>
              <p className="text-[#A1A1AA] text-sm leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer nudge */}
      <motion.p
        variants={fadeUp}
        className="text-center text-[#A1A1AA] text-sm"
      >
        Have ideas for what Community should include?{" "}
        <Link
          href="/student/ai-assistant"
          className="text-[#F2F2F2] font-semibold hover:underline underline-offset-4 cursor-pointer"
        >
          Tell your mentor
        </Link>
        .
      </motion.p>
    </motion.div>
  );
}
