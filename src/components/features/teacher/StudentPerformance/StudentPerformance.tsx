"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, FileText, BarChart2, Users, Filter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useApi } from "@/hooks/useApi";
import { profileService } from "@/services/profile.service";
import { reportsService } from "@/services/reports.service";

import { toCohorts, toReportSummary } from "./data";

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

export default function StudentPerformance() {
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { data: studentsData } = useApi(
    () => profileService.listStudents(1, 100),
    [],
  );
  const { data: reportsData } = useApi(
    () => reportsService.list({ pageSize: 10 }),
    [],
  );

  const cohorts = useMemo(
    () => toCohorts(studentsData?.items ?? []),
    [studentsData],
  );
  const reports = useMemo(
    () => (reportsData?.items ?? []).map(toReportSummary),
    [reportsData],
  );

  const allGrades = Array.from(new Set(cohorts.map((c) => c.grade))).sort();

  const toggleFilter = (grade: string) => {
    setActiveFilters((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade],
    );
  };

  const filteredCohorts =
    activeFilters.length > 0
      ? cohorts.filter((c) => activeFilters.includes(c.grade))
      : cohorts;

  const handleClassSelect = (grade: string, section: string) => {
    const classId = `${grade}${section}`.toLowerCase();
    router.push(`/teacher/performance/${classId}`);
  };

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 h-full"
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
        <span className="text-[#F2F2F2]">Student Performance</span>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <Users size={24} className="text-[#A1A1AA]" />
          <h1 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight">
            Academic Cohort Selection
          </h1>
        </div>
        <p className="text-[#A1A1AA] text-sm">
          Refine your institutional view. Compare grades and click on a specific class to deep-dive into its comprehensive performance analytics.
        </p>
      </motion.div>

      {/* Gradient Separator */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      {/* Filtering Bar */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
         <div className="flex items-center gap-2 text-[#A1A1AA] mr-2">
            <Filter size={16} />
            <span className="text-sm font-semibold">Filter Comparison:</span>
         </div>
         {allGrades.map(grade => {
           const isActive = activeFilters.includes(grade);
           return (
             <button 
               key={grade}
               onClick={() => toggleFilter(grade)}
               className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                 isActive 
                 ? 'bg-accent-primary/20 border-accent-primary/50 text-accent-primary shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                 : 'bg-surface-200 border-border-default text-[#A1A1AA] hover:border-white/20 hover:text-white'
               }`}
             >
               Grade {grade}
             </button>
           );
         })}
         {activeFilters.length > 0 && (
           <button 
             onClick={() => setActiveFilters([])}
             className="px-3 py-1.5 rounded-full text-xs font-bold text-[#A1A1AA] hover:text-white transition-colors"
           >
             Clear Filters
           </button>
         )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Selection Area */}
        <motion.div variants={stagger} className="lg:col-span-3 flex flex-col gap-6">
           {/* Comparison Graph Area */}
           <motion.div variants={fadeUp} className="bg-surface-200 border border-border-default rounded-xl p-6 min-h-[450px] flex flex-col justify-between group hover:border-white/10 transition-colors">
              <div className="flex justify-between items-center z-10 mb-8">
                 <h3 className="text-[#F2F2F2] text-lg font-bold flex items-center gap-2">Class Comparison Graph</h3>
                 <span className="bg-surface-300 text-[#F2F2F2] text-xs font-semibold px-3 py-1.5 rounded-full border border-border-default">Mean % Average</span>
              </div>
              
              <div className="flex-1 flex items-end justify-around w-full pt-16 pb-4 relative mt-auto mx-auto max-w-4xl">
                 {/* Decorative Graph lines */}
                 <div className="w-full h-px bg-border-default absolute bottom-0 left-0 right-0 z-0"></div>
                 <div className="w-full h-px bg-white/5 absolute bottom-[25%] left-0 right-0 z-0 border-dashed border-t border-white/10"></div>
                 <div className="w-full h-px bg-white/5 absolute bottom-[50%] left-0 right-0 z-0 border-dashed border-t border-white/10"></div>
                 <div className="w-full h-px bg-white/5 absolute bottom-[75%] left-0 right-0 z-0 border-dashed border-t border-white/10"></div>
                 <div className="w-full h-px bg-white/5 absolute bottom-[100%] left-0 right-0 z-0 border-dashed border-t border-white/10"></div>

                 {/* Bar Chart Data */}
                 {filteredCohorts.map((cohort, index) => {
                   // Ensure it scales correctly using the avgPercentage. Max height ~100%
                   const height = `${cohort.avgPercentage || 50}%`; 
                   
                   return (
                     <div 
                       key={index} 
                       onClick={() => handleClassSelect(cohort.grade, cohort.section)}
                       className="flex flex-col items-center gap-3 z-10 h-full justify-end cursor-pointer group/bar relative px-2 w-full flex-1"
                     >
                       {/* Floating tooltip */}
                       <div className="absolute -top-12 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-surface-300 border border-border-default px-3 py-2 rounded text-xs font-bold text-[#F2F2F2] shadow-lg pointer-events-none whitespace-nowrap z-50 flex flex-col items-center gap-1">
                         <span className="text-accent-primary">{cohort.avgPercentage}% Avg</span>
                         <span className="text-[#A1A1AA] font-normal">Click to view {cohort.grade}-{cohort.section} roster</span>
                       </div>
                       
                       <div className="w-full max-w-16 flex flex-col items-center gap-2 h-full justify-end">
                           <div 
                             className="w-full rounded-t-sm transition-all duration-300 bg-surface-300 border border-transparent group-hover/bar:bg-accent-primary group-hover/bar:shadow-[0_0_20px_rgba(16,185,129,0.3)] relative"
                             style={{ height }}
                           >
                              {/* Inline Percentage explicitly requested by user */}
                              <span className="absolute -top-6 w-full text-center text-[10px] font-bold text-[#A1A1AA] group-hover/bar:text-white transition-colors">{cohort.avgPercentage}%</span>
                           </div>
                           <span className="text-xs font-bold text-[#A1A1AA] group-hover/bar:text-white transition-colors mt-1">{cohort.grade}-{cohort.section}</span>
                       </div>
                     </div>
                   );
                 })}
                 
                 {filteredCohorts.length === 0 && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-[#A1A1AA] z-10">
                     <p className="font-semibold text-sm">No cohorts selected.</p>
                     <p className="text-xs mt-1">Please select at least one grade to compare.</p>
                   </div>
                 )}
              </div>
           </motion.div>
        </motion.div>

        {/* Right sidebar */}
        <motion.div variants={fadeUp} className="lg:col-span-1">
           <div className="bg-surface-200 border border-border-default rounded-xl p-5 hover:border-white/10 transition-colors">
              <h3 className="text-[#F2F2F2] text-base font-bold mb-4">Recent Reports</h3>
              <div className="flex flex-col gap-4">
                {reports.length === 0 && (
                  <p className="text-[#A1A1AA] text-xs">No reports yet.</p>
                )}
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-300/40 transition-colors duration-150 cursor-pointer group">
                    <div className="size-10 rounded-lg bg-surface-300 border border-border-default flex items-center justify-center text-[#A1A1AA] group-hover:text-white transition-colors">
                       {report.icon === 'FileText' ? <FileText size={18} /> : <BarChart2 size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-[#F2F2F2] text-sm font-semibold leading-tight">{report.title}</h4>
                       <p className="text-[#A1A1AA] text-xs mt-0.5">{report.updatedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
