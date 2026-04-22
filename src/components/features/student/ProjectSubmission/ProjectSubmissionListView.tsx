"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useApi } from "@/hooks/useApi";
import { coursesService } from "@/services/courses.service";
import { projectsService, type ProjectSubmission } from "@/services/projects.service";

import ProjectCard from "./ProjectCard";
import {
  toSubmissionCourse,
  toSubmissionProject,
  toSubmissionUnit,
} from "./data";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function ProjectSubmissionListView() {
  const { courseId, unitId } = useParams<{
    courseId: string;
    unitId: string;
  }>();

  const { data: apiCourse } = useApi(
    () => (courseId ? coursesService.findById(courseId) : Promise.resolve(null)),
    [courseId],
  );
  const { data: apiUnits } = useApi(
    () => (courseId ? coursesService.unitsByCourse(courseId) : Promise.resolve([])),
    [courseId],
  );
  const { data: apiProjects, loading } = useApi(
    () => (unitId ? projectsService.forUnit(unitId) : Promise.resolve([])),
    [unitId],
  );
  const { data: mySubmissions } = useApi(
    () => projectsService.mySubmissions({ pageSize: 100 }),
    [],
  );

  const course = apiCourse ? toSubmissionCourse(apiCourse) : null;

  const units = (apiUnits ?? []).map((u, idx) => toSubmissionUnit(u, idx));
  const unit = units.find((u) => u.id === unitId) ?? units[0];

  const submissionsByProject = useMemo(() => {
    const map = new Map<string, ProjectSubmission>();
    (mySubmissions?.items ?? []).forEach((sub) => {
      const current = map.get(sub.projectId);
      if (!current || new Date(sub.submittedAt ?? 0) > new Date(current.submittedAt ?? 0)) {
        map.set(sub.projectId, sub);
      }
    });
    return map;
  }, [mySubmissions]);

  const projects = (apiProjects ?? []).map((p) =>
    toSubmissionProject(p, submissionsByProject.get(p.id) ?? null),
  );

  const completedCount = projects.filter(
    (p) => p.status === "Submitted" || p.status === "Graded",
  ).length;
  const totalCount = projects.length;
  const completionPercentage = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
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
        <Link
          href="/student/project-submission"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Project Submission
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <Link
          href={`/student/project-submission/${courseId}`}
          className="hover:text-white transition-colors cursor-pointer"
        >
          {course?.title.match(/Class\s*\d+/)?.[0] || course?.title || "Course"}
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2]">{unit?.unitNumber ?? "Unit"}</span>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border-default/50"
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-[#F2F2F2] text-3xl font-black tracking-tight">
            Project List
          </h1>
          <p className="text-[#A1A1AA] text-base max-w-2xl">
            Manage and submit your assignments for {unit?.title ?? "this unit"}. Track
            your progress and meet your deadlines.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-surface-200 border border-border-default rounded-xl p-3 shadow-md shrink-0">
          <div className="flex flex-col items-center justify-center px-2">
            <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
              Completion
            </span>
            <span className="text-xl font-black text-accent-primary">
              {completionPercentage}% Done
            </span>
          </div>
          <div className="w-px h-10 bg-border-default/50" />
          <div className="flex items-center justify-center size-10 rounded-full bg-surface-300 border-2 border-accent-secondary/30 text-[#F2F2F2] text-sm font-bold">
            {completedCount} / {totalCount}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={stagger}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4"
      >
        {loading && (
          <p className="text-[#A1A1AA] text-sm col-span-full">Loading projects…</p>
        )}
        {!loading && projects.length === 0 && (
          <p className="text-[#A1A1AA] text-sm col-span-full">
            No projects published for this unit yet.
          </p>
        )}
        {projects.map((project) => (
          <motion.div key={project.id} variants={fadeUp}>
            <ProjectCard
              project={project}
              courseId={courseId ?? ""}
              unitId={unitId ?? ""}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
