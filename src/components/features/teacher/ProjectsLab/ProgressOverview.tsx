"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  BarChart2,
  AlertTriangle,
  TrendingDown,
  Filter,
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

/* ── seed-consistent data ── */
interface AssignmentProgress {
  id: string;
  grade: string;
  title: string;
  progress: number;
  totalStudents: number;
  submitted: number;
}

interface Bottleneck {
  id: string;
  grade: string;
  topic: string;
  stuckPercent: number;
  affectedStudents: number;
}

const assignments: AssignmentProgress[] = [
  { id: "a1", grade: "9", title: "Web Portfolio – HTML/CSS", progress: 92, totalStudents: 45, submitted: 41 },
  { id: "a2", grade: "9", title: "JavaScript Mini-App", progress: 78, totalStudents: 45, submitted: 35 },
  { id: "a3", grade: "8", title: "Python Calculator", progress: 74, totalStudents: 42, submitted: 31 },
  { id: "a4", grade: "8", title: "Data Visualisation Poster", progress: 65, totalStudents: 42, submitted: 27 },
  { id: "a5", grade: "7", title: "Scratch Animated Story", progress: 58, totalStudents: 40, submitted: 23 },
  { id: "a6", grade: "7", title: "Algorithms Worksheet", progress: 50, totalStudents: 40, submitted: 20 },
  { id: "a7", grade: "6", title: "Intro to HTML – My First Page", progress: 42, totalStudents: 38, submitted: 16 },
  { id: "a8", grade: "6", title: "Typing Speed Challenge", progress: 88, totalStudents: 38, submitted: 33 },
];

const bottlenecks: Bottleneck[] = [
  { id: "b1", grade: "8", topic: "For Loops & Iteration", stuckPercent: 60, affectedStudents: 25 },
  { id: "b2", grade: "7", topic: "Conditional Logic (if/else)", stuckPercent: 45, affectedStudents: 18 },
  { id: "b3", grade: "6", topic: "Understanding Tags vs Attributes", stuckPercent: 55, affectedStudents: 21 },
  { id: "b4", grade: "9", topic: "CSS Flexbox Layouts", stuckPercent: 30, affectedStudents: 14 },
];


export default function ProgressOverview() {
  const [activeGradeFilter, setActiveGradeFilter] = useState<string[]>([]);
  const allGrades = ["6", "7", "8", "9"];

  const toggleGrade = (g: string) =>
    setActiveGradeFilter((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );

  const filteredAssignments =
    activeGradeFilter.length > 0
      ? assignments.filter((a) => activeGradeFilter.includes(a.grade))
      : assignments;

  const filteredBottlenecks =
    activeGradeFilter.length > 0
      ? bottlenecks.filter((b) => activeGradeFilter.includes(b.grade))
      : bottlenecks;

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8 h-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumbs */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 text-[13px] text-[#A1A1AA] font-medium"
      >
        <Link href="/teacher" className="hover:text-white transition-colors cursor-pointer">Home</Link>
        <ChevronRight size={14} className="opacity-50" />
        <Link href="/teacher/projects" className="hover:text-white transition-colors cursor-pointer">Projects & Lab</Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2]">Progress Overview</span>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <BarChart2 size={24} className="text-[#A1A1AA]" />
          <h1 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight">
            Assignment Progress Overview
          </h1>
        </div>
        <p className="text-[#A1A1AA] text-sm">
          Track completion rates for every active assignment and identify topics
          where students need extra help.
        </p>
      </motion.div>

      {/* Gradient Separator */}
      <motion.div variants={fadeUp}>
        <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />
      </motion.div>

      {/* Grade Filters */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-[#A1A1AA] mr-2">
          <Filter size={16} />
          <span className="text-sm font-semibold">Filter by Grade:</span>
        </div>
        {allGrades.map((g) => {
          const isActive = activeGradeFilter.includes(g);
          return (
            <button
              key={g}
              onClick={() => toggleGrade(g)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                isActive
                  ? "bg-accent-primary/20 border-accent-primary/50 text-accent-primary shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                  : "bg-surface-200 border-border-default text-[#A1A1AA] hover:border-white/20 hover:text-white"
              }`}
            >
              Grade {g}
            </button>
          );
        })}
        {activeGradeFilter.length > 0 && (
          <button
            onClick={() => setActiveGradeFilter([])}
            className="px-3 py-1.5 rounded-full text-xs font-bold text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
          >
            Clear
          </button>
        )}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={stagger}>
        {/* Left: Assignment Bars */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-2 bg-surface-200 border border-border-default rounded-xl p-6 group hover:border-white/10 transition-colors"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[#F2F2F2] text-lg font-bold">All Active Assignments</h3>
            <span className="bg-surface-300 text-[#F2F2F2] text-xs font-semibold px-3 py-1.5 rounded-full border border-border-default">
              {filteredAssignments.length} assignments
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {filteredAssignments.map((a, idx) => (
              <div key={a.id} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A1A1AA] bg-surface-300 px-2 py-0.5 rounded">
                      G{a.grade}
                    </span>
                    <span className="text-[#F2F2F2] font-semibold">{a.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#A1A1AA] text-xs hidden sm:inline">
                      {a.submitted}/{a.totalStudents} submitted
                    </span>
                    <span className="text-accent-primary font-black tracking-tight">
                      {a.progress}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-surface-400 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${a.progress}%` }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                      delay: 0.2 + idx * 0.06,
                    }}
                    className={`h-full rounded-full ${
                      a.progress >= 80
                        ? "bg-accent-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        : a.progress >= 50
                          ? "bg-accent-secondary shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                          : "bg-accent-critical shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                    }`}
                  />
                </div>
              </div>
            ))}

            {filteredAssignments.length === 0 && (
              <div className="py-10 text-center text-[#A1A1AA] text-sm">
                No assignments match the selected grades.
              </div>
            )}
          </div>
        </motion.div>

        {/* Right: Bottleneck Insights */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-1 flex flex-col gap-6"
        >
          <div className="bg-surface-200 border border-border-default rounded-xl p-5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle size={18} className="text-accent-secondary" />
              <h3 className="text-[#F2F2F2] text-base font-bold">
                Where Students Are Stuck
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {filteredBottlenecks.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-lg bg-surface-300 border border-border-default flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <TrendingDown size={14} className="text-accent-critical shrink-0" />
                      <h4 className="text-[#F2F2F2] text-sm font-semibold leading-tight">
                        {b.topic}
                      </h4>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A1A1AA] bg-surface-200 px-2 py-0.5 rounded shrink-0">
                      G{b.grade}
                    </span>
                  </div>
                  <p className="text-[#A1A1AA] text-xs">
                    {b.stuckPercent}% of Grade {b.grade} students haven&apos;t
                    cleared this topic ({b.affectedStudents} students).
                  </p>
                </div>
              ))}

              {filteredBottlenecks.length === 0 && (
                <p className="text-[#A1A1AA] text-sm text-center py-4">
                  No bottlenecks for selected grades.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
