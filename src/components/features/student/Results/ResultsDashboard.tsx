"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  GraduationCap,
  ClipboardCheck,
  FileCheck,
  FolderCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Calendar,
  MessageSquare,
  ChevronDown,
  PieChart,
  X,
} from "lucide-react";
import Link from "next/link";

import { useApi } from "@/hooks/useApi";
import { resultsService } from "@/services/results.service";

import { resultsData as fallback, toResultsData } from "./data";

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

/* ── Icon resolver ── */
const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  ClipboardCheck,
  FileCheck,
  FolderCheck,
};

/* ── Grade color helper ── */
function gradeColor(grade: string): string {
  if (grade.startsWith("A")) return "text-accent-primary";
  if (grade.startsWith("B")) return "text-accent-secondary";
  return "text-[#A1A1AA]";
}

function gradeBg(grade: string): string {
  if (grade.startsWith("A")) return "bg-emerald-950/80 text-emerald-300";
  if (grade.startsWith("B")) return "bg-amber-950/80 text-amber-300";
  return "bg-surface-300 text-[#A1A1AA]";
}

/* ── Pie chart color palette ── */
const PIE_COLORS = [
  "#10B981", // emerald
  "#F59E0B", // amber
  "#3B82F6", // blue
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
];

/* ── Build conic-gradient for pie chart ── */
function buildPieGradient(segments: { label: string; count: number }[]) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  let accumulated = 0;
  const stops: string[] = [];

  segments.forEach((seg, i) => {
    const start = (accumulated / total) * 360;
    accumulated += seg.count;
    const end = (accumulated / total) * 360;
    stops.push(`${PIE_COLORS[i % PIE_COLORS.length]} ${start}deg ${end}deg`);
  });

  return `conic-gradient(${stops.join(", ")})`;
}

export default function ResultsDashboard() {
  const { data: summary, loading } = useApi(() => resultsService.myResults(), []);
  const resultsData = summary ? toResultsData(summary) : fallback;
  const _loading = loading; // surface loading state if needed in future
  void _loading;
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<"top" | "bottom">("bottom");
  const [tappedTestId, setTappedTestId] = useState<string | null>(null);
  const [hoveredTestId, setHoveredTestId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<"top" | "bottom">("bottom");

  const computeTooltipPos = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setTooltipPos(spaceBelow < 80 ? "top" : "bottom");
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (expandedAssignment && target && !target.closest('.feedback-region')) {
        setExpandedAssignment(null);
      }
      if (tappedTestId && target && !target.closest('.test-title-region')) {
        setTappedTestId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedAssignment, tappedTestId]);
  const maxGrowth = Math.max(...resultsData.growthTimeline.map((g) => g.score));
  const minGrowth = Math.min(...resultsData.growthTimeline.map((g) => g.score));
  const growthRange = maxGrowth - minGrowth || 1;

  /* ── Compute pie chart data from assignments ── */
  const subjectCountMap: Record<string, number> = {};
  resultsData.assignments.forEach((a) => {
    subjectCountMap[a.subject] = (subjectCountMap[a.subject] || 0) + 1;
  });
  const pieSegments = Object.entries(subjectCountMap).map(([label, count]) => ({
    label,
    count,
  }));
  const totalProjects = pieSegments.reduce((s, p) => s + p.count, 0);
  const pieGradient = buildPieGradient(pieSegments);

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
        <Link href="/student" className="hover:text-white transition-colors cursor-pointer">Home</Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2]">My Results</span>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight">
          My Results
        </h1>
        <p className="text-[#A1A1AA] text-sm mt-1">
          Your academic performance at a glance — scores, grades, and growth over time.
        </p>
      </motion.div>

      {/* Gradient Separator */}
      <motion.div variants={fadeUp}>
        <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />
      </motion.div>

      {/* ═══════ Stats Row ═══════ */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={stagger}
      >
        {resultsData.stats.map((stat, idx) => {
          const Icon = iconMap[stat.iconName] || GraduationCap;
          return (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="bg-surface-200 border border-border-default rounded-xl p-5 relative group overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="flex justify-between items-start mb-2 relative z-10">
                <p className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <div className="p-1.5 rounded-md bg-surface-300 text-[#A1A1AA] group-hover:text-white transition-colors border border-border-default">
                  <Icon size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-2 relative z-10 mt-4">
                <h3 className="text-[#F2F2F2] text-3xl font-black tracking-tight">{stat.value}</h3>
              </div>
              {stat.subText && (
                <div className="mt-2 relative z-10">
                  <p className={`text-xs font-semibold ${stat.subColor || "text-[#A1A1AA]"}`}>
                    {stat.subText}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* ═══════ Main Grid: Subject Scores + Growth Timeline ═══════ */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={stagger}>

        {/* Left: Subject-wise Scores (Bar Chart) */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-2 bg-surface-200 border border-border-default rounded-xl p-6 hover:border-white/10 transition-colors"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-[#A1A1AA]" />
              <h3 className="text-[#F2F2F2] text-lg font-bold">Subject-wise Performance</h3>
            </div>
            <span className="bg-surface-300 text-[#F2F2F2] text-xs font-semibold px-3 py-1.5 rounded-full border border-border-default">
              {resultsData.subjectScores.length} subjects
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {resultsData.subjectScores.map((subj, idx) => {
              const percent = (subj.score / subj.maxScore) * 100;
              const TrendIcon = subj.trend === "up" ? TrendingUp : subj.trend === "down" ? TrendingDown : Minus;
              const trendColor = subj.trend === "up" ? "text-accent-primary" : subj.trend === "down" ? "text-accent-critical" : "text-[#A1A1AA]";

              return (
                <div key={subj.id} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-[#F2F2F2] font-semibold">{subj.subject}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gradeBg(subj.grade)}`}>
                        {subj.grade}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
                        <TrendIcon size={12} />
                        <span>{subj.trendValue}</span>
                      </div>
                      <span className={`font-black tracking-tight ${gradeColor(subj.grade)}`}>
                        {subj.score}/{subj.maxScore}
                      </span>
                    </div>
                  </div>

                  {/* Bar */}
                  <div className="w-full h-2.5 bg-surface-400 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 + idx * 0.08 }}
                      className={`h-full rounded-full ${
                        percent >= 85
                          ? "bg-accent-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                          : percent >= 70
                            ? "bg-accent-secondary shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                            : "bg-accent-critical shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right: Growth Timeline (Vertical Bar Chart) — FIXED with pixel heights */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-1 bg-surface-200 border border-border-default rounded-xl p-6 hover:border-white/10 transition-colors"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-accent-primary" />
            <h3 className="text-[#F2F2F2] text-lg font-bold">Growth Timeline</h3>
          </div>
          <p className="text-[#A1A1AA] text-xs mb-6">Average score progression across all subjects.</p>

          {/* Vertical Bar Chart — uses fixed pixel heights to avoid flex layout issues */}
          <div className="flex items-end gap-3" style={{ height: 180 }}>
            {resultsData.growthTimeline.map((point, idx) => {
              /* Normalize so the shortest bar is still ~20% visible */
              const normalized = ((point.score - minGrowth) / growthRange) * 0.7 + 0.3;
              const barHeight = Math.round(normalized * 160);
              const isLast = idx === resultsData.growthTimeline.length - 1;

              return (
                <div key={point.month} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                  <span className={`text-[10px] font-bold ${isLast ? "text-accent-primary" : "text-[#A1A1AA]"}`}>
                    {point.score}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: barHeight }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 + idx * 0.1 }}
                    className={`w-full rounded-t-md ${
                      isLast
                        ? "bg-accent-primary shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "bg-surface-400"
                    }`}
                  />
                  <span className={`text-[10px] font-semibold ${isLast ? "text-[#F2F2F2]" : "text-[#A1A1AA]"}`}>
                    {point.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-border-default flex justify-between items-center">
            <span className="text-[#A1A1AA] text-xs">Growth since Sep</span>
            <span className="text-accent-primary text-sm font-black">
              +{resultsData.growthTimeline[resultsData.growthTimeline.length - 1].score - resultsData.growthTimeline[0].score} pts
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* ═══════ Row: Recent Tests + Pie Chart ═══════ */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={stagger}>

        {/* Left: Recent Test Scores Table */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-2 bg-surface-200 border border-border-default rounded-xl hover:border-white/10 transition-colors"
        >
          <div className="p-6 pb-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ClipboardCheck size={18} className="text-[#A1A1AA]" />
              <h3 className="text-[#F2F2F2] text-lg font-bold">Recent Test Scores</h3>
            </div>
            <span className="bg-surface-300 text-[#F2F2F2] text-xs font-semibold px-3 py-1.5 rounded-full border border-border-default">
              {resultsData.recentTests.length} tests
            </span>
          </div>

          {/* Table — using native HTML table for locked column alignment */}
          <div style={{ overflowX: "auto", overflowY: "visible" }}>
            <table className="w-full min-w-[700px]" style={{ tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "28%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "12%" }} />
              </colgroup>
              <thead>
                <tr className="border-b border-border-default bg-surface-100/50">
                  <th className="text-left text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest px-6 py-3">Test</th>
                  <th className="text-center text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest px-2 py-3">Subject</th>
                  <th className="text-center text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest px-2 py-3">Date</th>
                  <th className="text-center text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest px-2 py-3">Type</th>
                  <th className="text-center text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest px-2 py-3">Score</th>
                  <th className="text-center text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest px-2 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {resultsData.recentTests.map((test) => {
                  const percent = test.maxScore > 0 ? (test.score / test.maxScore) * 100 : 0;
                  const isPending = test.status === "Pending Review";
                  return (
                    <tr
                      key={test.id}
                      className="border-b border-white/5 last:border-b-0 hover:bg-surface-300 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div
                          className="relative test-title-region"
                          onMouseEnter={(e) => {
                            computeTooltipPos(e.currentTarget);
                            setHoveredTestId(test.id);
                          }}
                          onMouseLeave={() => setHoveredTestId(null)}
                        >
                          <span
                            onClick={(e) => {
                              const region = e.currentTarget.parentElement;
                              if (region) computeTooltipPos(region);
                              setTappedTestId(tappedTestId === test.id ? null : test.id);
                            }}
                            className="text-[#F2F2F2] font-semibold text-sm truncate block cursor-pointer hover:text-white transition-colors"
                          >
                            {test.title}
                          </span>
                          <AnimatePresence>
                            {(hoveredTestId === test.id || tappedTestId === test.id) && (
                              <motion.div
                                initial={{ opacity: 0, y: tooltipPos === "bottom" ? -4 : 4, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: tooltipPos === "bottom" ? -4 : 4, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className={`absolute left-0 z-50 pointer-events-none ${
                                  tooltipPos === "bottom"
                                    ? "top-full mt-2 origin-top-left"
                                    : "bottom-full mb-2 origin-bottom-left"
                                }`}
                              >
                                {/* Caret pointer */}
                                <div className={`absolute left-4 w-3 h-3 bg-surface-200 rotate-45 z-20 ${
                                  tooltipPos === "bottom"
                                    ? "-top-1.5 border-l border-t border-border-default"
                                    : "-bottom-1.5 border-r border-b border-border-default"
                                }`} />
                                <div className="bg-surface-200 border border-border-default rounded-xl px-4 py-3 shadow-xl relative z-10 max-w-[280px] sm:max-w-[420px]">
                                  <span className="text-[#F2F2F2] text-xs sm:text-sm font-medium leading-relaxed break-words">{test.title}</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                      <td className="px-2 py-4 text-center">
                        <span className="px-2.5 py-1 bg-surface-300/50 rounded-full text-[#A1A1AA] text-xs font-medium whitespace-nowrap">
                          {test.subject}
                        </span>
                      </td>
                      <td className="px-2 py-4 text-center">
                        <span className="text-[#A1A1AA] text-xs whitespace-nowrap">{test.date}</span>
                      </td>
                      <td className="px-2 py-4 text-center">
                        <span className="text-[#A1A1AA] text-xs font-medium whitespace-nowrap">{test.type}</span>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-2 justify-center">
                          {isPending ? (
                            <span className="text-[#A1A1AA] text-xs italic">Awaiting</span>
                          ) : (
                            <>
                              <div className="w-12 h-1.5 bg-surface-400 rounded-full overflow-hidden shrink-0">
                                <div
                                  className={`h-full rounded-full ${
                                    percent >= 85 ? "bg-accent-primary" : percent >= 60 ? "bg-accent-secondary" : "bg-accent-critical"
                                  }`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className={`text-xs font-bold shrink-0 ${
                                percent >= 85 ? "text-accent-primary" : percent >= 60 ? "text-accent-secondary" : "text-accent-critical"
                              }`}>
                                {test.score}/{test.maxScore}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-4 text-center">
                        <span className={`text-[10px] uppercase font-bold tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap ${
                          isPending
                            ? "bg-amber-950/80 text-amber-300"
                            : "bg-emerald-950/80 text-emerald-300"
                        }`}>
                          {isPending ? "Pending" : "Graded"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right: Pie Chart — Projects by Subject */}
        <motion.div
          variants={fadeUp}
          className="lg:col-span-1 bg-surface-200 border border-border-default rounded-xl p-6 hover:border-white/10 transition-colors flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={18} className="text-[#A1A1AA]" />
            <h3 className="text-[#F2F2F2] text-lg font-bold">Projects by Subject</h3>
          </div>

          {/* Animated SVG Donut Chart */}
          <div className="flex justify-center mb-6">
            <div className="relative" style={{ width: 180, height: 180 }}>
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Background Track */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-surface-400, #3f3f46)" strokeWidth="20" />
                
                {/* Animated Segments */}
                {pieSegments.map((seg, i) => {
                  /* 
                    Circumference of r=40 is 2 * pi * 40 = 251.327
                    We calculate the sweep amount based on cumulative percentage 
                  */
                  const circumference = 251.327;
                  
                  // Calculate previous segments total
                  const previousCount = pieSegments.slice(0, i).reduce((sum, s) => sum + s.count, 0);
                  const startOffset = (previousCount / totalProjects) * circumference;
                  const segmentLength = (seg.count / totalProjects) * circumference;
                  
                  return (
                    <motion.circle
                      key={seg.label}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={PIE_COLORS[i % PIE_COLORS.length]}
                      strokeWidth="20"
                      strokeDasharray={`0 ${circumference}`}
                      strokeDashoffset={-startOffset}
                      initial={{ strokeDasharray: `0 ${circumference}` }}
                      animate={{ strokeDasharray: `${segmentLength} ${circumference - segmentLength}` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    />
                  );
                })}
              </svg>
              
              {/* Center hole content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-surface-200 flex flex-col items-center justify-center relative z-10 shadow-[inset_0px_0px_10px_rgba(0,0,0,0.5)]">
                  <motion.span 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="text-[#F2F2F2] text-2xl font-black"
                  >
                    {totalProjects}
                  </motion.span>
                  <motion.span 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="text-[#A1A1AA] text-[10px] font-semibold uppercase tracking-wider"
                  >
                    Total
                  </motion.span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3">
            {pieSegments.map((seg, i) => (
              <div key={seg.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-[#A1A1AA] text-xs">{seg.label}</span>
                </div>
                <span className="text-[#F2F2F2] text-xs font-bold">
                  {seg.count} <span className="text-[#A1A1AA] font-normal">({Math.round((seg.count / totalProjects) * 100)}%)</span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ═══════ Assignments Completed ═══════ */}
      <motion.div
        variants={fadeUp}
        className="bg-surface-200 border border-border-default rounded-xl p-6 hover:border-white/10 transition-colors"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <FileCheck size={18} className="text-[#A1A1AA]" />
            <h3 className="text-[#F2F2F2] text-lg font-bold">Assignments & Projects</h3>
          </div>
          <span className="bg-surface-300 text-[#F2F2F2] text-xs font-semibold px-3 py-1.5 rounded-full border border-border-default">
            {resultsData.assignments.length} completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resultsData.assignments.map((asn) => {
            const isOpen = expandedAssignment === asn.id;
            return (
              <motion.div
                layout
                key={asn.id}
                className="bg-surface-300 border border-border-default rounded-lg p-4 flex flex-col gap-3 hover:border-white/20 transition-colors group relative"
                style={{ borderRadius: "0.5rem" }}
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-[#F2F2F2] text-sm font-semibold leading-tight group-hover:text-white transition-colors">
                    {asn.title}
                  </h4>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full shrink-0 ml-2 ${gradeBg(asn.grade)}`}>
                    {asn.grade}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-[#A1A1AA]">
                  <span>{asn.subject}</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={10} />
                    <span>{asn.submittedDate}</span>
                  </div>
                </div>

                <div className="relative feedback-region">
                  {asn.feedback && (
                    <button
                      onClick={(e) => {
                        if (isOpen) {
                          setExpandedAssignment(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const spaceBelow = window.innerHeight - rect.bottom;
                          setPopoverPosition(spaceBelow < 160 ? "top" : "bottom");
                          setExpandedAssignment(asn.id);
                        }
                      }}
                      className={`flex items-center gap-1.5 text-[#A1A1AA] text-[10px] uppercase tracking-wider font-bold hover:text-white transition-colors cursor-pointer w-fit mt-1 px-2.5 py-1.5 rounded-md ${
                        isOpen ? "bg-surface-400 text-white" : "bg-surface-400/50 hover:bg-surface-400"
                      }`}
                    >
                      <MessageSquare size={12} />
                    </button>
                  )}

                  {/* Floating Bubble Popover */}
                  <AnimatePresence>
                    {isOpen && asn.feedback && (
                      <motion.div
                        initial={{ opacity: 0, y: popoverPosition === "bottom" ? -5 : 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: popoverPosition === "bottom" ? -5 : 5, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`absolute left-0 w-[280px] z-50 ${
                          popoverPosition === "bottom" 
                            ? "top-full mt-2 origin-top-left" 
                            : "bottom-full mb-2 origin-bottom-left"
                        }`}
                      >
                        {/* Bubble pointer (caret) */}
                        <div 
                          className={`absolute left-6 w-3 h-3 bg-surface-200 rotate-45 z-20 ${
                            popoverPosition === "bottom"
                              ? "-top-1.5 border-l border-t border-border-default"
                              : "-bottom-1.5 border-r border-b border-border-default"
                          }`} 
                        />
                        
                        <div className="bg-surface-200 border border-border-default rounded-xl p-4 shadow-xl relative z-10">
                          <p className="text-[#F2F2F2] text-sm leading-relaxed italic relative">
                            <span className="text-surface-400/50 text-2xl absolute -top-2 -left-2 select-none pointer-events-none font-serif">&quot;</span>
                            <span className="relative z-10 pl-2">{asn.feedback}</span>
                            <span className="text-surface-400/50 text-2xl absolute -bottom-4 right-0 select-none pointer-events-none font-serif">&quot;</span>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
