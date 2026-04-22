"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Download,
  FileText,
  CheckCircle2,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";

import { useApi } from "@/hooks/useApi";
import { classesService } from "@/services/classes.service";
import { profileService } from "@/services/profile.service";
import { projectsService } from "@/services/projects.service";
import { resultsService } from "@/services/results.service";
import type { ResultsSummary } from "@/services/types";

type AssignmentSummary = ResultsSummary["assignments"][number];

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function StudentProjectDetailsView({
  classId,
  studentId,
}: {
  classId: string;
  studentId: string;
}) {
  const { data: classItem } = useApi(
    () => classesService.findById(classId),
    [classId],
  );
  const { data: profile } = useApi(
    () => profileService.findById(studentId),
    [studentId],
  );
  const { data: summary } = useApi(
    () => resultsService.forUser(studentId),
    [studentId],
  );
  const { data: projectsData } = useApi(
    () => projectsService.list({ pageSize: 100 }),
    [],
  );

  const projects = projectsData?.items ?? [];

  const submissionsByProject = useMemo(() => {
    const map = new Map<string, AssignmentSummary>();
    (summary?.assignments ?? []).forEach((a) => {
      map.set(a.id, a);
    });
    return map;
  }, [summary]);

  if (!classItem || !profile) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center h-full gap-4">
        <UserCircle2 size={48} className="text-surface-400" />
        <h2 className="text-[#F2F2F2] text-xl font-bold">Loading student…</h2>
        <Link
          href={`/teacher/projects/class/${classId}`}
          className="text-accent-primary hover:underline font-bold mt-4"
        >
          ← Back to Class Workspace
        </Link>
      </div>
    );
  }

  const completionPercent = Math.round(profile.attendance ?? 0);
  const overallScore = summary?.stats.overallGpa ?? 0;

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8 h-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center gap-2 text-[13px] text-[#A1A1AA] font-medium"
      >
        <Link href="/teacher" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <Link
          href="/teacher/projects"
          className="hover:text-white transition-colors"
        >
          Projects & Lab
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <Link
          href={`/teacher/projects/class/${classId}`}
          className="hover:text-white transition-colors"
        >
          {classItem.name}
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2]">{profile.fullName}</span>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-6">
        <div className="bg-surface-200 border border-border-default rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

          <div className="flex items-center gap-5 z-10">
            <div className="size-16 rounded-full bg-surface-300 border border-border-default flex items-center justify-center text-[#F2F2F2] text-xl font-bold">
              {profile.initials ?? "ST"}
            </div>
            <div>
              <h1 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight">
                {profile.fullName}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-surface-300/50 px-2.5 py-1 rounded text-[#A1A1AA] text-xs font-medium tracking-wide">
                  {profile.email}
                </span>
                <span className="text-[#A1A1AA] text-xs flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  Last active{" "}
                  {profile.lastLoginAt
                    ? new Date(profile.lastLoginAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end z-10 gap-2">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-accent-primary leading-none">
                {completionPercent}%
              </span>
              <span className="text-[#A1A1AA] text-sm uppercase tracking-widest font-bold pb-0.5">
                Attendance
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#A1A1AA] text-sm">
              Overall GPA:{" "}
              <strong className="text-white">{overallScore.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-6">
        <h2 className="text-[#F2F2F2] text-xl font-bold flex items-center gap-2">
          Project Submissions{" "}
          <span className="p-1 rounded-md bg-surface-300 text-xs font-mono text-[#A1A1AA] leading-none">
            {projects.length} Projects
          </span>
        </h2>

        {projects.length === 0 ? (
          <div className="p-10 border border-border-default border-dashed rounded-2xl flex items-center justify-center text-[#A1A1AA]">
            No projects available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => {
              const submission = submissionsByProject.get(proj.id);
              const isSubmitted = Boolean(submission?.submittedDate);

              return (
                <div
                  key={proj.id}
                  className="bg-surface-200 border border-border-default rounded-xl p-5 flex flex-col justify-between group hover:border-white/10 transition-colors"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <h4 className="text-[#F2F2F2] font-bold text-sm leading-tight group-hover:text-white transition-colors">
                        {proj.title}
                      </h4>
                      {isSubmitted ? (
                        <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.1)] flex items-center gap-1">
                          <CheckCircle2 size={10} /> Submitted
                        </span>
                      ) : (
                        <span className="bg-surface-300 text-[#A1A1AA] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-[#A1A1AA] text-xs line-clamp-2">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                      <FileText size={14} />
                      <span>Due {formatDate(proj.dueAt)}</span>
                    </div>

                    {isSubmitted && (
                      <button className="size-8 rounded-lg bg-surface-300 text-[#F2F2F2] flex items-center justify-center hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all">
                        <Download size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
