"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronRight, Download, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useApi } from "@/hooks/useApi";
import { profileService } from "@/services/profile.service";

import { toRosterStudent } from "./data";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function StudentRoster({ classId }: { classId: string }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"none" | "high-to-low" | "low-to-high">("none");

  const { data, loading } = useApi(() => profileService.listStudents(1, 100), []);
  const roster = useMemo(
    () => (data?.items ?? []).map(toRosterStudent),
    [data],
  );

  const filteredRoster = useMemo(() => {
    const query = searchQuery.toLowerCase();
    let next = roster.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.rollNo.toLowerCase().includes(query),
    );
    if (sortOrder === "high-to-low") {
      next = [...next].sort((a, b) => b.grade - a.grade);
    } else if (sortOrder === "low-to-high") {
      next = [...next].sort((a, b) => a.grade - b.grade);
    }
    return next;
  }, [roster, searchQuery, sortOrder]);

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
        <Link
          href="/teacher/performance"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Student Performance
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2] uppercase">{classId}</span>
      </motion.div>
      
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <Users size={24} className="text-[#A1A1AA]" />
             <h1 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight uppercase">
               Student Roster: {classId}
             </h1>
           </div>
           <p className="text-[#A1A1AA] text-sm">
             Academic Year 2023-24 • Total {roster.length} Students
           </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-200 border border-border-default hover:border-white/20 hover:bg-surface-300 text-[#F2F2F2] rounded-lg text-sm font-medium transition-all group cursor-pointer w-full md:w-auto">
           <Download size={16} className="text-[#A1A1AA] group-hover:text-white transition-colors" /> Export PDF
        </button>
      </motion.div>

      {/* Gradient Separator */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-center">
         <div className="relative group w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Search student by name or roll number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-200 border border-border-default text-[#F2F2F2] rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white placeholder:text-[#888888] transition-all"
            />
         </div>
         
         <div className="relative shrink-0 select-none hidden sm:block">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="appearance-none bg-surface-200 border border-border-default text-[#F2F2F2] rounded-xl px-4 py-3.5 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all cursor-pointer hover:border-white/20 h-[50px]"
            >
              <option value="none">Sort by Score</option>
              <option value="high-to-low">Highest to Lowest</option>
              <option value="low-to-high">Lowest to Highest</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#A1A1AA]">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
         </div>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-surface-200 border border-border-default rounded-xl overflow-hidden mt-2">
         {/* Table Header */}
         <div className="grid grid-cols-12 gap-4 border-b border-border-default p-4 bg-surface-100/50">
            <div className="col-span-5 text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest pl-2">Name</div>
            <div className="col-span-3 text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest text-center">Roll No</div>
            <div className="col-span-3 text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest text-right">Overall Grade</div>
            <div className="col-span-1 text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest flex justify-center">Actions</div>
         </div>

         {/* Table Body */}
         <div className="flex flex-col">
            {filteredRoster.map((student, idx) => {
              const isHighClass = student.grade >= 90;
              const isMidClass = student.grade >= 80 && student.grade < 90;
              const gradeColor = isHighClass ? 'text-accent-primary' : isMidClass ? 'text-accent-secondary' : 'text-[#F2F2F2]';

              return (
                <div key={student.id} onClick={() => router.push(`/teacher/performance/${classId}/${student.id}`)} className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 last:border-b-0 hover:bg-surface-300 transition-colors group cursor-pointer items-center">
                  <div className="col-span-5 flex items-center gap-4">
                     <div className="size-9 rounded-full bg-surface-300 border border-border-default flex items-center justify-center text-[#F2F2F2] text-xs font-bold leading-none shrink-0 group-hover:border-white/20 transition-colors">
                        {student.initials}
                     </div>
                     <span className="text-[#F2F2F2] font-semibold text-sm group-hover:text-white transition-colors">{student.name}</span>
                  </div>
                  
                  <div className="col-span-3 flex justify-center">
                    <span className="px-3 py-1 bg-surface-300/50 rounded-full text-[#A1A1AA] text-xs font-medium tracking-wide">
                      {student.rollNo}
                    </span>
                  </div>

                  <div className="col-span-3 flex justify-end items-center gap-2">
                     <span className={`font-bold text-sm ${gradeColor}`}>{student.grade}%</span>
                     <span className={`size-1.5 rounded-full ${isHighClass ? 'bg-accent-primary' : isMidClass ? 'bg-accent-secondary' : 'bg-surface-400'}`}></span>
                  </div>

                  <div className="col-span-1 flex justify-center">
                     <div className="text-[#A1A1AA] group-hover:text-white transition-all transform group-hover:translate-x-1">
                        <ChevronRight size={18} />
                     </div>
                  </div>
                </div>
              )
            })}

            {filteredRoster.length === 0 && (
              <div className="p-10 text-center flex flex-col items-center justify-center gap-2">
                <Search size={32} className="text-surface-400 mb-2" />
                <span className="text-[#F2F2F2] font-semibold">
                  {loading ? "Loading students…" : "No students found"}
                </span>
                {!loading && (
                  <span className="text-[#A1A1AA] text-sm">Try adjusting your search query</span>
                )}
              </div>
            )}
         </div>

         {/* Pagination Footer */}
         <div className="p-4 border-t border-border-default flex items-center justify-between bg-surface-100/50">
           <span className="text-[#A1A1AA] text-xs">Showing {filteredRoster.length} of {roster.length} students</span>
           <div className="flex gap-1">
             <button className="size-8 rounded flex items-center justify-center border border-border-default bg-surface-200 text-[#A1A1AA] cursor-not-allowed opacity-50"><ChevronRight size={14} className="rotate-180" /></button>
             <button className="size-8 rounded flex items-center justify-center bg-white text-black font-bold text-xs"><span className="leading-none select-none">1</span></button>
             <button className="size-8 rounded flex items-center justify-center border border-border-default bg-surface-200 text-[#A1A1AA] hover:text-white hover:border-white/20 transition-colors text-xs font-semibold"><span className="leading-none select-none">2</span></button>
             <button className="size-8 rounded flex items-center justify-center border border-border-default bg-surface-200 text-[#A1A1AA] hover:text-white hover:border-white/20 transition-colors"><ChevronRight size={14} /></button>
           </div>
         </div>
      </motion.div>
    </motion.div>
  );
}
