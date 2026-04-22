"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { useApi } from "@/hooks/useApi";
import { coursesService } from "@/services/courses.service";

import SubmissionCourseCard from "./SubmissionCourseCard";
import { toSubmissionCourse } from "./data";

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

export default function ProjectSubmissionCourseView() {
  const { data, loading } = useApi(
    () => coursesService.list({ pageSize: 20, published: true }),
    [],
  );
  const courses = (data?.items ?? []).map(toSubmissionCourse);

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
          href="/student"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Home
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2]">Project Submission</span>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight">
            Select Course
          </h1>
        </div>
        <p className="text-[#A1A1AA] text-sm">
          Which subject are you submitting a project for today?
        </p>
      </motion.div>

      {/* Gradient Separator */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      {/* Course List */}
      <motion.div
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {loading && (
          <p className="text-[#A1A1AA] text-sm col-span-full">Loading courses…</p>
        )}
        {!loading && courses.length === 0 && (
          <p className="text-[#A1A1AA] text-sm col-span-full">
            No courses available right now.
          </p>
        )}
        {courses.map((course) => (
          <motion.div key={course.id} variants={fadeUp}>
            <SubmissionCourseCard course={course} />
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Text */}
      <motion.div variants={fadeUp} className="mt-8 text-center">
        <p className="text-[#A1A1AA] text-sm">
          Can&apos;t find your course?{" "}
          <button className="text-[#2563EB] font-bold hover:underline underline-offset-4 cursor-pointer">
            Contact your instructor
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}
