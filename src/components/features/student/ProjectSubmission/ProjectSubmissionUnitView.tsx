"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useApi } from "@/hooks/useApi";
import { coursesService } from "@/services/courses.service";

import SubmissionUnitCard from "./SubmissionUnitCard";
import { toSubmissionCourse, toSubmissionUnit } from "./data";

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

export default function ProjectSubmissionUnitView() {
  const { courseId } = useParams<{ courseId: string }>();

  const { data: apiCourse } = useApi(
    () => (courseId ? coursesService.findById(courseId) : Promise.resolve(null)),
    [courseId],
  );
  const { data: apiUnits, loading } = useApi(
    () => (courseId ? coursesService.unitsByCourse(courseId) : Promise.resolve([])),
    [courseId],
  );

  const course = apiCourse ? toSubmissionCourse(apiCourse) : null;
  const units = (apiUnits ?? []).map((u, idx) => toSubmissionUnit(u, idx));

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
        <span className="text-[#F2F2F2]">
          {course?.title.match(/Class\s*\d+/)?.[0] || course?.title || "Course"}
        </span>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="border-b border-border-default/50 pb-6 mb-2"
      >
        <h1 className="text-[#F2F2F2] text-3xl font-black tracking-tight mb-2">
          Unit Selection
        </h1>
        <p className="text-[#A1A1AA] text-base">
          {course?.title ?? "Course"} • Academic Session 2024
        </p>
      </motion.div>

      <motion.div variants={stagger} className="flex flex-col gap-4">
        {loading && <p className="text-[#A1A1AA] text-sm">Loading units…</p>}
        {!loading && units.length === 0 && (
          <p className="text-[#A1A1AA] text-sm">No units yet for this course.</p>
        )}
        {units.map((unit) => (
          <motion.div key={unit.id} variants={fadeUp}>
            <SubmissionUnitCard unit={unit} courseId={courseId ?? ""} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
