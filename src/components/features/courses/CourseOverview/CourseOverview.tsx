"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Layers,
  ClipboardCheck,
  FolderUp,
  ChevronRight,
  CheckCircle2,
  Circle,
  Lock,
  ArrowRight,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import ProgressRing from "./ProgressRing";
import OverviewStatCard from "./OverviewStatCard";

/* ── Animation Variants (Void Design System §6) ── */
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

import { useApi } from "@/hooks/useApi";
import { coursesService } from "@/services/courses.service";
import { enrollmentsService } from "@/services/enrollments.service";

import { toApiUnitList, toCourseData } from "./data";

/* ── Main Component ── */
export default function CourseOverview({ courseId }: { courseId: string }) {
  const { data: apiCourse, loading: courseLoading } = useApi(
    () => coursesService.findById(courseId),
    [courseId],
  );
  const { data: curriculum } = useApi(
    () =>
      coursesService
        .curriculumById(courseId)
        .catch(() => null),
    [courseId],
  );
  const { data: apiUnits } = useApi(
    () => coursesService.unitsByCourse(courseId),
    [courseId],
  );
  const { data: myEnrollments } = useApi(
    () => enrollmentsService.list({ courseId, pageSize: 1 }),
    [courseId],
  );

  if (courseLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-[#A1A1AA] text-sm">Loading course…</p>
      </div>
    );
  }

  if (!apiCourse) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-[#A1A1AA] text-sm">Course not found.</p>
      </div>
    );
  }

  const curriculumTree =
    curriculum ?? {
      id: apiCourse.id,
      slug: apiCourse.slug,
      title: apiCourse.title,
      units: toApiUnitList(apiUnits ?? []),
    };

  const progress = myEnrollments?.items?.[0]?.progress ?? 0;
  const course = toCourseData(apiCourse, curriculumTree, progress);

  if (course.units.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-[#A1A1AA] text-sm">No curriculum available yet.</p>
      </div>
    );
  }

  // Find the first in-progress or locked unit for "Continue Learning"
  const activeUnit =
    course.units.find((u) => u.status === "in-progress") ||
    course.units.find((u) => u.status === "locked") ||
    course.units[0];

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Dynamic Breadcrumb */}
      <motion.div variants={fadeUp} className="flex items-center gap-2">
        <Link
          href="/student"
          className="text-[#A1A1AA] text-xs font-medium hover:text-white transition-colors"
        >
          Home
        </Link>
        <span className="text-[#A1A1AA] text-xs">›</span>
        <Link
          href="/student/courses"
          className="text-[#A1A1AA] text-xs font-medium hover:text-white transition-colors"
        >
          Courses
        </Link>
        <span className="text-[#A1A1AA] text-xs">›</span>
        <span className="text-[#F2F2F2] text-xs font-medium">
          {course.shortName}
        </span>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        variants={fadeUp}
        className="bg-surface-200 border border-border-default rounded-2xl overflow-hidden relative lg:h-[320px]"
      >
        {/* Inner glow */}
        <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:h-[320px]">
          {/* Left Content */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center gap-4 overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent-primary bg-accent-primary/10 px-3 py-1 rounded-full w-fit">
              Enrolled
            </span>
            <h1 className="text-white text-2xl lg:text-3xl font-bold leading-tight">
              {course.title}
            </h1>
            <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-lg">
              {course.description}
            </p>
            <Link
              href={`/student/courses/${course.id}/${activeUnit.id}`}
              className="mt-2 w-fit px-6 py-2.5 bg-white hover:bg-[#E5E5E5] text-black text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              Continue Learning
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative w-full lg:w-80 h-52 lg:h-auto shrink-0">
            <div className="absolute inset-0 bg-linear-to-l from-transparent to-surface-200 z-10 pointer-events-none hidden lg:block" />
            <div className="absolute inset-0 bg-linear-to-t from-surface-200 to-transparent z-10 pointer-events-none lg:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content: Two-column on desktop */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column — Curriculum & Learnings */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Stats Row */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            <motion.div variants={fadeUp}>
              <OverviewStatCard
                icon={Layers}
                value={course.totalUnits}
                label="Total Units"
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <OverviewStatCard
                icon={BookOpen}
                value={course.totalTopics}
                label="Total Topics"
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <OverviewStatCard
                icon={ClipboardCheck}
                value={course.tests}
                label="Tests"
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <OverviewStatCard
                icon={FolderUp}
                value={course.projects}
                label="Projects"
              />
            </motion.div>
          </motion.div>

          {/* What You'll Learn */}
          <motion.div
            variants={fadeUp}
            className="bg-surface-200 border border-border-default rounded-xl p-6"
          >
            <h3 className="text-white text-base font-bold mb-4">
              What you will learn
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.learnings.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="text-accent-primary mt-0.5 shrink-0"
                  />
                  <span className="text-[#A1A1AA] text-sm leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Course Curriculum */}
          <motion.div variants={fadeUp}>
            <h3 className="text-white text-base font-bold mb-4">
              Course Curriculum
            </h3>
            <motion.div variants={stagger} className="flex flex-col gap-2">
              {course.units.map((unit, index) => {
                const isCompleted = unit.status === "completed";
                const isActive = unit.status === "in-progress";
                const isLocked = unit.status === "locked";

                return (
                  <motion.div key={unit.id} variants={fadeUp}>
                    <Link
                      href={
                        isLocked
                          ? "#"
                          : `/student/courses/${course.id}/${unit.id}`
                      }
                      className={`group flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-300 ${
                        isActive
                          ? "bg-surface-300 border-accent-primary/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                          : "bg-surface-200 border-border-default hover:border-white/20"
                      } ${isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {/* Status Icon */}
                      <div className="shrink-0">
                        {isCompleted && (
                          <CheckCircle2
                            size={20}
                            className="text-accent-primary"
                          />
                        )}
                        {isActive && (
                          <div className="size-5 rounded-full border-2 border-accent-primary flex items-center justify-center">
                            <div className="size-2 rounded-full bg-accent-primary" />
                          </div>
                        )}
                        {isLocked && (
                          <Lock size={18} className="text-[#A1A1AA]" />
                        )}
                      </div>

                      {/* Unit Info */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold leading-tight ${
                            isActive ? "text-white" : "text-[#F2F2F2]"
                          }`}
                        >
                          Unit {index + 1}: {unit.title}
                        </p>
                        <p className="text-[#A1A1AA] text-[11px] mt-1">
                          {unit.topics} Topics · {unit.duration}{" "}
                          {isCompleted && (
                            <span className="text-accent-primary">
                              · Completed
                            </span>
                          )}
                          {isActive && (
                            <span className="text-accent-secondary">
                              · In Progress
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Arrow */}
                      {!isLocked && (
                        <ChevronRight
                          size={16}
                          className="text-[#A1A1AA] group-hover:text-white transition-colors shrink-0"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column — Progress, Instructor, Classmates */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          {/* Course Progress */}
          <motion.div
            variants={fadeUp}
            className="bg-surface-200 border border-border-default rounded-xl p-6 flex flex-col items-center gap-4"
          >
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] self-start">
              Course Progress
            </h4>
            <ProgressRing progress={course.progress} />
            <p className="text-[#A1A1AA] text-xs text-center leading-relaxed">
              &ldquo;Unit 2: Decision Trees&rdquo; is your next milestone.
            </p>
            <button className="w-full py-2 bg-surface-300 hover:bg-surface-400 text-[#F2F2F2] text-xs font-medium rounded-lg border border-border-default hover:border-white/20 transition-all duration-200 cursor-pointer">
              View Detailed Report
            </button>
          </motion.div>

          {/* Instructor */}
          <motion.div
            variants={fadeUp}
            className="bg-surface-200 border border-border-default rounded-xl p-6"
          >
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-4">
              Your Instructor
            </h4>
            <div className="flex items-center gap-3 mb-4">
              <div className="size-11 rounded-full bg-surface-300 border border-border-default flex items-center justify-center text-white text-sm font-bold">
                {course.instructor.avatarInitials}
              </div>
              <div>
                <p className="text-[#F2F2F2] text-sm font-semibold">
                  {course.instructor.name}
                </p>
                <p className="text-[#A1A1AA] text-[11px]">
                  {course.instructor.title}
                </p>
              </div>
            </div>
            <button className="w-full py-2 bg-surface-300 hover:bg-surface-400 text-[#F2F2F2] text-xs font-medium rounded-lg border border-border-default hover:border-white/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
              <MessageCircle size={14} />
              Ask a Question
            </button>
          </motion.div>

          {/* Classmates */}
          <motion.div
            variants={fadeUp}
            className="bg-surface-200 border border-border-default rounded-xl p-6"
          >
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-3">
              Classmates ({course.classmates.toLocaleString()})
            </h4>
            <div className="flex -space-x-2 mb-3">
              {["AJ", "MK", "RL", "TS"].map((initials, i) => (
                <div
                  key={i}
                  className="size-8 rounded-full bg-surface-300 border-2 border-surface-200 flex items-center justify-center text-white text-[10px] font-bold"
                >
                  {initials}
                </div>
              ))}
              <div className="size-8 rounded-full bg-accent-primary/20 border-2 border-surface-200 flex items-center justify-center text-accent-primary text-[10px] font-bold">
                +{course.classmates > 100 ? "99" : course.classmates - 4}
              </div>
            </div>
            <p className="text-[#A1A1AA] text-xs">
              84 students are currently active studying this course.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
