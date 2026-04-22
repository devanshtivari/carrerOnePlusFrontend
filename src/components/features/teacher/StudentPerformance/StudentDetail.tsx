"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, GraduationCap, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

import { useApi } from "@/hooks/useApi";
import { profileService } from "@/services/profile.service";
import { resultsService } from "@/services/results.service";

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

export default function StudentDetail({ studentId, classId }: { studentId: string, classId?: string }) {
  const [activeSubject, setActiveSubject] = useState("Overall Average");
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  const { data: profile } = useApi(
    () => profileService.findById(studentId),
    [studentId],
  );
  const { data: summary } = useApi(
    () => resultsService.forUser(studentId),
    [studentId],
  );

  const studentInfo = useMemo(() => {
    const fullName = profile?.fullName ?? "Student";
    const initials =
      profile?.initials ??
      fullName
        .split(/\s+/)
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();
    return {
      name: fullName,
      rollNo: profile?.rollNo ?? "—",
      grade: profile?.totalScore ?? summary?.stats.overallGpa ?? 0,
      initials,
    };
  }, [profile, summary]);

  const quizzes = useMemo(() => {
    const tests = summary?.recentTests ?? [];
    return tests.map((t) => ({
      id: t.id,
      title: t.title,
      score: t.score,
      total: t.maxScore || 100,
      date: t.date ? new Date(t.date).toLocaleDateString(undefined, { month: "short", day: "2-digit" }) : "—",
    }));
  }, [summary]);

  const assignments = useMemo(() => {
    const rows = summary?.assignments ?? [];
    return rows.map((a) => ({
      id: a.id,
      title: a.title,
      status: a.feedback ? "Graded" : a.submittedDate ? "Pending Review" : "Overdue",
      score: a.grade ?? null,
      date: a.submittedDate
        ? new Date(a.submittedDate).toLocaleDateString(undefined, { month: "short", day: "2-digit" })
        : "—",
    }));
  }, [summary]);

  const yearlyPerformance = useMemo(() => {
    const timeline = summary?.growthTimeline ?? [];
    const baseSeries = timeline.map((g, idx) => ({
      id: `g-${idx}`,
      type: "Quiz",
      title: g.month,
      month: g.month,
      date: g.month,
      score: g.score,
    }));
    const subjectMap: Record<string, typeof baseSeries> = {
      "Overall Average": baseSeries.length
        ? baseSeries
        : [{ id: "empty", type: "Quiz", title: "—", month: "—", date: "—", score: 0 }],
    };
    for (const row of summary?.subjectScores ?? []) {
      subjectMap[row.subject] = [
        {
          id: `subj-${row.id}`,
          type: "Quiz",
          title: row.subject,
          month: "Now",
          date: "Now",
          score: row.score,
        },
      ];
    }
    return subjectMap;
  }, [summary]);

  const student = {
    ...studentInfo,
    attendance: profile?.attendance ?? 0,
    lastActive: profile?.lastLoginAt
      ? new Date(profile.lastLoginAt).toLocaleString()
      : "—",
    quizzes,
    assignments,
    yearlyPerformance,
  };

  const derivedClassId = classId || "8a";
  const displayClassId = derivedClassId.toUpperCase();
  const displayGrade = derivedClassId.replace(/[^0-9]/g, "");
  const displaySection = derivedClassId.replace(/[^a-zA-Z]/g, "").toUpperCase();

  const myRank = profile?.rank ?? 0;
  const totalStudents = profile?.percentile ? Math.max(100 - (profile?.percentile ?? 0), 1) : 40;

  const completedAssignments = student.assignments.filter(
    (a) => a.status === "Graded" || a.status === "Pending Review",
  ).length;
  const totalAssignments = student.assignments.length;
  
  const activeEvents = student.yearlyPerformance[activeSubject as keyof typeof student.yearlyPerformance] || student.yearlyPerformance["Overall Average"];

  const scores = activeEvents.map(d => d.score);
  const chartHeight = 220;
  const maxScore = 100;
  const minScore = Math.max(0, Math.min(...scores) - 10);
  const scoreRange = maxScore - minScore;

  // Transform to coordinates for 100x100 viewBox
  const points = activeEvents.map((d, i) => {
     const x = activeEvents.length === 1 ? 50 : (i / (activeEvents.length - 1)) * 100;
     const normalizedScore = (d.score - minScore) / scoreRange;
     const y = 100 - (normalizedScore * 100);
     return { x, y, ...d };
  });

  const pathPoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPath = `M ${points[0].x},100 L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${points[points.length-1].x},100 Z`;

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6"
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
          href="/teacher"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Home
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <Link
          href="/teacher/performance"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Student Performance
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <Link
          href={`/teacher/performance/${derivedClassId}`}
          className="hover:text-white transition-colors cursor-pointer font-semibold"
        >
          {displayClassId}
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2]">{student.name}</span>
      </motion.div>

      {/* Header Profile */}
      <motion.div variants={fadeUp} className="bg-surface-200 border border-border-default rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden group hover:border-white/10 transition-colors">
         <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

         <div className="relative z-10 flex flex-col items-center gap-3 shrink-0">
             <div className="size-20 md:size-24 rounded-full bg-surface-300 border border-white/20 flex items-center justify-center text-[#F2F2F2] text-2xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.05)]">
               {student.initials}
             </div>
             <span className="px-3 py-1 bg-surface-300 border border-border-default rounded-full text-xs font-bold text-[#A1A1AA] uppercase">{student.rollNo}</span>
         </div>
         
         <div className="relative z-10 flex-1 text-center md:text-left flex flex-col justify-center pt-2 w-full">
            <h1 className="text-[#F2F2F2] text-3xl font-black">{student.name}</h1>
            <p className="text-[#A1A1AA] text-sm mt-1">Grade {displayGrade} • Section {displaySection}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6 w-full">
               <div className="bg-surface-300/50 rounded-lg p-3 flex-1 md:flex-none min-w-[120px] text-center md:text-left border border-border-default">
                  <p className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-widest mb-1">Rank</p>
                  <p className="text-white text-xl font-bold">{myRank}<span className="text-[#A1A1AA] text-sm font-semibold"> /{totalStudents}</span></p>
               </div>
               <div className="bg-surface-300/50 rounded-lg p-3 flex-1 md:flex-none min-w-[120px] text-center md:text-left border border-border-default">
                  <p className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-widest mb-1">Overall Grade</p>
                  <p className="text-accent-primary text-xl font-bold">{student.grade}%</p>
               </div>
               <div className="bg-surface-300/50 rounded-lg p-3 flex-1 md:flex-none min-w-[120px] text-center md:text-left border border-border-default">
                  <p className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-widest mb-1">Assignments</p>
                  <p className="text-white text-xl font-bold">{completedAssignments}<span className="text-[#A1A1AA] text-sm font-semibold"> /{totalAssignments}</span></p>
               </div>
               <div className="bg-surface-300/50 rounded-lg p-3 flex-1 md:flex-none min-w-[120px] text-center md:text-left border border-border-default">
                  <p className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-widest mb-1">Attendance</p>
                  <p className="text-[#F2F2F2] text-xl font-bold">{student.attendance}%</p>
               </div>
            </div>
         </div>
      </motion.div>

      {/* Gradient Separator */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30 my-2" />

      {/* Performance Chart */}
      <motion.div variants={fadeUp} className="bg-surface-200 border border-border-default rounded-xl p-6 flex flex-col hover:border-white/10 transition-colors w-full relative z-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center z-10 mb-6 gap-4">
             <div className="flex flex-col">
                <h3 className="text-[#F2F2F2] text-lg font-bold flex items-center gap-2">Yearly Performance Trend</h3>
                <div className="flex items-center gap-4 mt-1">
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent-primary"></div><span className="text-[#A1A1AA] text-xs">Quizzes</span></div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[#A1A1AA] text-xs">Assignments</span></div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-[#A1A1AA] text-xs">Projects</span></div>
                </div>
             </div>
             <div className="flex bg-surface-300 p-1 rounded-lg border border-border-default overflow-x-auto max-w-full custom-scrollbar">
                {Object.keys(student.yearlyPerformance).map(subject => (
                  <button
                    key={subject}
                    onClick={() => {
                        setActiveSubject(subject);
                        setHoveredEventId(null);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                      activeSubject === subject ? 'bg-accent-primary text-black' : 'text-[#A1A1AA] hover:text-[#F2F2F2]'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
             </div>
          </div>
          
          <div 
             className="w-full relative mx-auto mt-6" 
             style={{ height: chartHeight }}
             onMouseLeave={() => setHoveredEventId(null)}
          >
             {/* Minimal Stock Grid */}
             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full h-px bg-white border-dashed border-t border-white/30"></div>
                <div className="w-full h-px bg-white border-dashed border-t border-white/30"></div>
                <div className="w-full h-px bg-white border-dashed border-t border-white/30"></div>
                <div className="w-full h-px bg-border-default opacity-50"></div>
             </div>

             {/* SVG Area Chart */}
             <div className="absolute inset-0 z-10 h-full w-full pointer-events-none">
               <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                 <defs>
                   <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#10b981" stopOpacity="0.4"/>
                     <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"/>
                   </linearGradient>
                 </defs>
                 
                 <path
                   d={areaPath}
                   fill="url(#chartGradient)"
                   className="transition-all duration-300 ease-in-out"
                 />
                 
                 <polyline
                   fill="none"
                   stroke="#10b981"
                   strokeWidth="2.5"
                   vectorEffect="non-scaling-stroke"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                   points={pathPoints}
                   className="transition-all duration-300 ease-in-out drop-shadow-[0_2px_4px_rgba(16,185,129,0.5)]"
                 />
               </svg>
             </div>
             
             {/* Hover: vertical line + dot + tooltip */}
             {hoveredEventId && (() => {
                const p = points.find(pt => pt.id === hoveredEventId);
                if (!p) return null;
                const dotBg = p.type === 'Quiz' ? '#10b981' : p.type === 'Assignment' ? '#3b82f6' : '#a855f7';
                const textColor = p.type === 'Quiz' ? 'text-accent-primary' 
                                : p.type === 'Assignment' ? 'text-blue-400' : 'text-purple-400';
                return (
                  <div className="absolute inset-0 pointer-events-none z-30">
                     {/* Vertical dashed line */}
                     <div className="absolute top-0 h-full w-px border-l border-dashed border-white/25" style={{ left: `${p.x}%` }} />

                     {/* Small dot on the line */}
                     <div
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                           left: `${p.x}%`,
                           top: `${p.y}%`,
                           transform: 'translate(-50%, -50%)',
                           backgroundColor: dotBg,
                           boxShadow: `0 0 6px ${dotBg}`,
                        }}
                     />

                     {/* Tooltip */}
                     <div
                        className="absolute flex items-center gap-2 bg-surface-400 border border-border-default px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap"
                        style={{
                           left: `${p.x}%`,
                           top: `${p.y}%`,
                           transform: 'translate(-50%, calc(-100% - 12px))',
                        }}
                     >
                        <span className={`text-sm font-black ${textColor}`}>{p.score}%</span>
                        <span className="text-[11px] font-semibold text-[#A1A1AA]">{p.title}</span>
                     </div>
                  </div>
                );
             })()}

             {/* Invisible Flex Hover Zones */}
             <div className="absolute inset-0 z-20 flex">
                {points.map((p, i) => (
                    <div 
                      key={`hover-zone-${p.id}`} 
                      className="flex-1 h-full cursor-crosshair"
                      onMouseEnter={() => setHoveredEventId(p.id)}
                    />
                ))}
             </div>
          </div>
          
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Quizzes Overview */}
         <motion.div variants={fadeUp} className="bg-surface-200 border border-border-default rounded-xl p-6 flex flex-col hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                 <div className="size-8 rounded-lg bg-surface-300 flex items-center justify-center border border-border-default">
                    <GraduationCap className="text-[#A1A1AA]" size={16} />
                 </div>
                 <h3 className="text-[#F2F2F2] text-lg font-bold">Recent Quizzes</h3>
               </div>
               <span className="text-xs font-semibold text-[#A1A1AA] bg-surface-300 px-3 py-1 rounded-full border border-border-default">{student.quizzes.length} Total</span>
            </div>
            <div className="flex flex-col gap-0 border border-border-default rounded-lg overflow-hidden h-[300px] overflow-y-auto custom-scrollbar">
               {student.quizzes.map((quiz, i) => (
                 <div key={quiz.id} className={`flex justify-between items-center p-4 bg-surface-100/50 ${i !== student.quizzes.length -1 ? 'border-b border-border-default' : ''} hover:bg-surface-300/40 transition-colors`}>
                    <div>
                       <p className="text-[#F2F2F2] text-sm font-semibold">{quiz.title}</p>
                       <p className="text-[#A1A1AA] text-xs leading-none mt-1">{quiz.date}</p>
                    </div>
                    <div className="flex items-baseline gap-1 bg-surface-300/50 px-3 py-1 rounded-lg">
                       <span className="text-[#F2F2F2] font-bold text-lg">{quiz.score}</span>
                       <span className="text-[#A1A1AA] text-xs">/{quiz.total}</span>
                    </div>
                 </div>
               ))}
            </div>
         </motion.div>

         {/* Assignments Overview */}
         <motion.div variants={fadeUp} className="bg-surface-200 border border-border-default rounded-xl p-6 flex flex-col hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                 <div className="size-8 rounded-lg bg-surface-300 flex items-center justify-center border border-border-default">
                    <CheckCircle2 className="text-[#A1A1AA]" size={16} />
                 </div>
                 <h3 className="text-[#F2F2F2] text-lg font-bold">Project & Assignments</h3>
               </div>
               <span className="text-xs font-semibold text-[#A1A1AA] bg-surface-300 px-3 py-1 rounded-full border border-border-default">{student.assignments.length} Total</span>
            </div>
            <div className="flex flex-col gap-0 border border-border-default rounded-lg overflow-hidden h-[300px] overflow-y-auto custom-scrollbar">
               {student.assignments.map((assignment, i) => {
                 let statusIcon;
                 let statusColor;

                 if (assignment.status === 'Graded') {
                    statusIcon = <CheckCircle2 size={12} />;
                    statusColor = "text-accent-primary bg-accent-primary/10 border-accent-primary/20";
                 } else if (assignment.status === 'Pending Review') {
                    statusIcon = <Clock size={12} />;
                    statusColor = "text-accent-secondary bg-accent-secondary/10 border-accent-secondary/20";
                 } else {
                    statusIcon = <AlertCircle size={12} />;
                    statusColor = "text-accent-critical bg-accent-critical/10 border-accent-critical/20";
                 }

                 return (
                   <div key={assignment.id} className={`flex justify-between items-center p-4 bg-surface-100/50 ${i !== student.assignments.length -1 ? 'border-b border-border-default' : ''} hover:bg-surface-300/40 transition-colors`}>
                      <div>
                         <p className="text-[#F2F2F2] text-sm font-semibold">{assignment.title}</p>
                         <p className="text-[#A1A1AA] text-xs leading-none mt-1">{assignment.date}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                         <div className={`px-2 py-0.5 rounded-md flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                            {statusIcon} {assignment.status}
                         </div>
                         {assignment.score && (
                           <span className="text-[#A1A1AA] text-[11px] font-bold">Score: <span className="text-[#F2F2F2]">{assignment.score}</span></span>
                         )}
                      </div>
                   </div>
                 )
               })}
            </div>
         </motion.div>
      </div>
    </motion.div>
  );
}
