"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";

import { useApi } from "@/hooks/useApi";
import { coursesService } from "@/services/courses.service";

import {
  generateFallbackUnit,
  toCourseContext,
  toUnitData,
  type ApiCurriculumTree,
} from "../ChapterDetail/data";

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

export default function UnitOverview({
  courseId,
  unitId,
}: {
  courseId: string;
  unitId: string;
}) {
  const { data: tree, loading } = useApi<ApiCurriculumTree | null>(
    () => (courseId ? coursesService.curriculumById(courseId) : Promise.resolve(null)),
    [courseId],
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-[#A1A1AA] text-sm">Loading unit…</p>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-[#A1A1AA] text-sm">Course not found.</p>
      </div>
    );
  }

  const courseCtx = toCourseContext(tree);
  const apiUnit = tree.units.find((u) => u.id === unitId);
  const unitIndex = tree.units.findIndex((u) => u.id === unitId);
  const unit = apiUnit ? toUnitData(apiUnit, unitIndex) : generateFallbackUnit(courseId, unitId);

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8 pb-12"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
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
        <Link
          href={`/student/courses/${courseId}`}
          className="text-[#A1A1AA] text-xs font-medium hover:text-white transition-colors"
        >
          {courseCtx.shortName}
        </Link>
        <span className="text-[#A1A1AA] text-xs">›</span>
        <span className="text-[#F2F2F2] text-xs font-medium">
          Unit {unit.moduleNumber}
        </span>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="bg-surface-200 border border-border-default rounded-xl overflow-hidden relative lg:h-[320px]"
      >
        <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:h-[320px]">
          <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center gap-4 overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent-primary bg-accent-primary/10 px-3 py-1 rounded-full w-fit">
              Module {unit.moduleNumber}
            </span>
            <h1 className="text-white text-2xl lg:text-3xl font-bold leading-tight">
              {unit.title}
            </h1>
            <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-lg mb-2">
              {unit.description}
            </p>
          </div>

          <div className="relative w-full lg:w-96 h-52 lg:h-auto shrink-0 border-l border-border-default/50">
            <div className="absolute inset-0 bg-linear-to-l from-transparent to-surface-200 z-10 pointer-events-none hidden lg:block" />
            <div className="absolute inset-0 bg-linear-to-t from-surface-200 to-transparent z-10 pointer-events-none lg:hidden" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={unit.imageUrl}
              alt={unit.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-4">
        <h3 className="text-white text-base font-bold">Chapters in this Unit</h3>
        {unit.chapters.length === 0 ? (
          <p className="text-[#A1A1AA] text-sm">No chapters available yet.</p>
        ) : (
          <motion.div variants={stagger} className="flex flex-col gap-3">
            {unit.chapters.map((chapter, index) => {
              const isCompleted = chapter.progress === 100;
              const isLocked =
                index > 0 &&
                unit.chapters[index - 1].progress < 100 &&
                chapter.progress === 0;
              const isActive =
                (chapter.progress > 0 && chapter.progress < 100) ||
                (index === 0 && chapter.progress === 0) ||
                (index > 0 &&
                  unit.chapters[index - 1].progress === 100 &&
                  chapter.progress === 0);

              return (
                <motion.div key={chapter.id} variants={fadeUp}>
                  <div
                    className={`group flex items-center justify-between gap-4 p-5 rounded-xl border transition-all duration-300 ${
                      isActive
                        ? "bg-surface-300 border-accent-primary/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                        : "bg-surface-200 border-border-default hover:border-white/20"
                    } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="shrink-0 flex items-center justify-center">
                        {isCompleted ? (
                          <CheckCircle2 size={24} className="text-accent-primary" />
                        ) : isLocked ? (
                          <Lock size={20} className="text-[#A1A1AA]" />
                        ) : (
                          <div className="size-6 rounded-full border-2 border-accent-primary flex items-center justify-center">
                            <div className="size-2.5 rounded-full bg-accent-primary" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <p
                          className={`text-sm font-semibold leading-tight ${
                            isActive ? "text-white" : "text-[#F2F2F2]"
                          }`}
                        >
                          {chapter.title}: {chapter.description}
                        </p>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] text-[#A1A1AA]">
                          <span className="flex items-center gap-1">
                            <ClipboardCheck size={12} /> {chapter.totalLessons} Lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen size={12} /> {chapter.duration}
                          </span>
                          {isCompleted && (
                            <span className="text-accent-primary font-medium">· Completed</span>
                          )}
                          {isActive && !isCompleted && chapter.progress > 0 && (
                            <span className="text-accent-secondary font-medium">
                              · In Progress ({chapter.progress}%)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {!isLocked ? (
                        <Link
                          href={`/student/courses/${courseId}/${unitId}/${chapter.id}`}
                          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-2 ${
                            isActive && !isCompleted
                              ? "bg-white text-black hover:bg-[#E5E5E5] shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                              : "bg-surface-400 text-white hover:bg-surface-500 border border-border-default hover:border-white/20"
                          }`}
                        >
                          {isCompleted
                            ? "Review Chapter"
                            : isActive && chapter.progress > 0
                              ? "Continue"
                              : "Start Chapter"}
                          <ArrowRight size={14} strokeWidth={2.5} />
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 bg-surface-300 text-[#A1A1AA] text-xs font-bold rounded-lg border border-border-default flex items-center gap-2"
                        >
                          Locked
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
