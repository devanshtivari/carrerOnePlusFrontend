"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  FileText,
  Trophy,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { TestInfo, TestGuideline } from "./types";

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
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

interface Props {
  test: TestInfo;
  guidelines: TestGuideline[];
  onBeginTest: () => void;
}

export default function TestGuidelines({
  test,
  guidelines,
  onBeginTest,
}: Props) {
  return (
    <motion.div
      className="flex flex-col gap-5"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-2.5 mb-1">
          <ShieldCheck size={20} className="text-[#A1A1AA]" />
          <h1 className="text-[#F2F2F2] text-xl lg:text-2xl font-bold leading-tight">
            Test Instructions
          </h1>
        </div>
        <p className="text-[#A1A1AA] text-sm opacity-70">{test.title}</p>
      </motion.div>

      {/* Subtle Separator */}
      <div className="w-full h-px bg-zinc-800/40" />

      {/* Two-column layout: Left = Guidelines, Right = Summary + CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Guidelines List — spans 2 cols */}
        <motion.div
          variants={stagger}
          className="lg:col-span-2 bg-surface-200 border border-border-default rounded-xl p-5 hover:border-white/10 transition-colors duration-200"
        >
          <h3 className="text-[#F2F2F2] text-base font-bold mb-4">
            Rules & Guidelines
          </h3>
          <div className="flex flex-col">
            {guidelines.map((guideline, index) => (
              <motion.div
                key={guideline.id}
                variants={fadeUp}
                className="flex items-start gap-3 py-3 border-b border-border-default/50 last:border-b-0"
              >
                <span className="size-6 rounded-md bg-surface-300 border border-border-default flex items-center justify-center text-[10px] font-bold text-[#A1A1AA] shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">
                  {guideline.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Summary + Warning + CTA */}
        <motion.div variants={stagger} className="flex flex-col gap-4">
          {/* Test Meta Cards */}
          <motion.div
            variants={fadeUp}
            className="bg-surface-200 border border-border-default rounded-xl p-4 flex flex-col gap-3 hover:border-white/10 transition-colors duration-200"
          >
            <h3 className="text-[#F2F2F2] text-[10px] font-bold uppercase tracking-wider opacity-40 mb-1">
              Test Summary
            </h3>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-300/40 border border-border-default/50">
              <div className="size-8 rounded-lg bg-surface-300 border border-border-default flex items-center justify-center">
                <Clock size={14} className="text-[#A1A1AA]" />
              </div>
              <div>
                <p className="text-[#F2F2F2] text-sm font-bold">
                  {test.duration} min
                </p>
                <p className="text-[#A1A1AA] text-[10px] uppercase tracking-wider font-medium opacity-50">
                  Duration
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-300/40 border border-border-default/50">
              <div className="size-8 rounded-lg bg-surface-300 border border-border-default flex items-center justify-center">
                <FileText size={14} className="text-[#A1A1AA]" />
              </div>
              <div>
                <p className="text-[#F2F2F2] text-sm font-bold">
                  {test.totalQuestions}
                </p>
                <p className="text-[#A1A1AA] text-[10px] uppercase tracking-wider font-medium opacity-50">
                  Questions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-300/40 border border-border-default/50">
              <div className="size-8 rounded-lg bg-surface-300 border border-border-default flex items-center justify-center">
                <Trophy size={14} className="text-[#A1A1AA]" />
              </div>
              <div>
                <p className="text-[#F2F2F2] text-sm font-bold">
                  {test.totalMarks}
                </p>
                <p className="text-[#A1A1AA] text-[10px] uppercase tracking-wider font-medium opacity-50">
                  Total Marks
                </p>
              </div>
            </div>
          </motion.div>

          {/* Warning Notice */}
          <motion.div
            variants={fadeUp}
            className="flex items-start gap-3 p-4 bg-amber-950/30 border border-amber-900/30 rounded-xl"
          >
            <AlertTriangle
              size={16}
              className="text-amber-400 shrink-0 mt-0.5"
            />
            <p className="text-amber-200/80 text-xs leading-relaxed">
              Once you begin, the timer cannot be paused. Ensure you have a
              stable connection and are ready.
            </p>
          </motion.div>

          {/* Begin Test CTA */}
          <motion.div variants={fadeUp}>
            <button
              onClick={onBeginTest}
              className="w-full py-3 bg-white text-black text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-[#E5E5E5] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              Begin Test
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
