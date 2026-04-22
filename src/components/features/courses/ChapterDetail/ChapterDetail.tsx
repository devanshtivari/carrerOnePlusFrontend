"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  ExternalLink,
  Lock,
  ArrowRight,
  Award,
  Play,
  HelpCircle,
  FlaskConical,
  BookMarked,
} from "lucide-react";

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
import { progressService } from "@/services/progress.service";

import { UnitProgressBar } from "./ChapterProgressBar";
import { LessonAccordionItem } from "./LessonAccordionItem";
import {
  applyProgressToUnit,
  generateFallbackUnit,
  toCourseContext,
  toUnitData,
  type ApiCurriculumTree,
} from "./data";
export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "Lesson" | "Quiz" | "Lab" | "Case Study";
  completed: boolean;
}

/* ── Main Component ── */
export default function ChapterDetail({
  courseId,
  unitId,
  chapterId,
}: {
  courseId: string;
  unitId: string;
  chapterId: string;
}) {
  const [showAllLessons, setShowAllLessons] = useState(false);
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);

  const { data: tree, loading } = useApi<ApiCurriculumTree | null>(
    () => (courseId ? coursesService.curriculumById(courseId) : Promise.resolve(null)),
    [courseId],
  );

  // Pull in the per-user progress summary so `completedLessonIds` can be
  // mapped onto each lesson/chapter/unit. This is what drives the progress
  // bar and the "Completed" chip in the lesson header.
  const { data: progress } = useApi(
    () => (courseId ? progressService.forCourse(courseId).catch(() => null) : Promise.resolve(null)),
    [courseId],
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-[#A1A1AA] text-sm">Loading chapter…</p>
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
  const baseUnit = apiUnit
    ? toUnitData(apiUnit, unitIndex)
    : generateFallbackUnit(courseId, unitId);
  const completedLessonIds = progress?.completedLessonIds ?? [];
  const unit = applyProgressToUnit(baseUnit, completedLessonIds);
  const chapter = unit.chapters.find((c) => c.id === chapterId);

  if (!chapter) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-[#A1A1AA] text-sm">Chapter not found.</p>
      </div>
    );
  }

  // Determine next chapter
  const allChapterIds = unit.chapters.map(c => c.id);
  const currentIndex = allChapterIds.indexOf(chapterId);
  const nextChapterId =
    currentIndex >= 0 && currentIndex < allChapterIds.length - 1
      ? allChapterIds[currentIndex + 1]
      : null;
  const nextChapter = nextChapterId ? unit.chapters.find((c) => c.id === nextChapterId) : null;

  const hiddenCount = chapter.lessons.length - 5;
  const completedLessons = chapter.lessons.filter((l) => l.completed).length;

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Dynamic Breadcrumb */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 flex-wrap"
      >
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
        <Link
          href={`/student/courses/${courseId}/${unitId}`}
          className="text-[#A1A1AA] text-xs font-medium hover:text-white transition-colors"
        >
          Unit {unit.moduleNumber}
        </Link>
        <span className="text-[#A1A1AA] text-xs">›</span>
        <span className="text-[#F2F2F2] text-xs font-medium">
          {chapter.title.split(':')[0]}
        </span>
      </motion.div>

      {/* Unit Header */}
      <motion.div variants={fadeUp}>
        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-primary mb-2 block">
          Module {unit.moduleNumber} / {chapter.title}
        </span>
        <h1 className="text-white text-2xl lg:text-3xl font-bold leading-tight mb-2">
          {chapter.description}
        </h1>
        <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-2xl">
          {unit.description}
        </p>
      </motion.div>

      {/* Hero Image + Progress + Resources row */}
      <motion.div variants={fadeUp} className="flex flex-col lg:flex-row gap-4 lg:h-[320px]">
        {/* Image with progress overlay */}
        <div className="flex-1 relative rounded-xl overflow-hidden h-48 lg:h-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={unit.imageUrl}
            alt={unit.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-surface-200/90 via-surface-200/40 to-transparent" />
          {/* Progress info on image */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="bg-surface-200/80 backdrop-blur-md border border-border-default rounded-xl p-4">
              <h4 className="text-white text-sm font-bold mb-2">
                Chapter Progress
              </h4>
              {chapter.progress === 100 ? (
                <p className="text-accent-primary text-xs font-medium mb-2">
                  Excellent work! You&apos;ve mastered all core concepts in this
                  chapter.
                </p>
              ) : (
                <p className="text-[#A1A1AA] text-xs mb-2">
                  {completedLessons}/{chapter.totalLessons} Lessons completed
                </p>
              )}
              <UnitProgressBar progress={chapter.progress} />
              {chapter.progress === 100 && (
                <button className="mt-3 text-accent-primary text-xs font-medium flex items-center gap-1 hover:opacity-80 cursor-pointer">
                  <Award size={14} />
                  View Chapter Certificate
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="w-full lg:w-64 shrink-0 bg-surface-200 border border-border-default rounded-xl p-5 flex flex-col gap-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#A1A1AA]">
            Unit Resources
          </h4>
          {unit.resources.length === 0 ? (
            <p className="text-[#A1A1AA] text-xs">
              No resources available yet.
            </p>
          ) : (
            unit.resources.map((res, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <div className="size-8 rounded-lg bg-surface-300 border border-border-default flex items-center justify-center shrink-0">
                  <FileText
                    size={14}
                    className="text-[#A1A1AA] group-hover:text-white transition-colors"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#F2F2F2] text-xs font-medium truncate group-hover:text-white transition-colors">
                    {res.name}
                  </p>
                  <p className="text-[#A1A1AA] text-[10px]">
                    {res.type} · {res.sizeOrUrl}
                  </p>
                </div>
                {res.sizeOrUrl === "external" ? (
                  <ExternalLink
                    size={12}
                    className="text-[#A1A1AA] group-hover:text-white transition-colors shrink-0"
                  />
                ) : (
                  <Download
                    size={12}
                    className="text-[#A1A1AA] group-hover:text-white transition-colors shrink-0"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Lessons Content */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-base font-bold">Lessons Content</h3>
          <span className="text-[#A1A1AA] text-xs">
            Estimated time: {chapter.duration}
          </span>
        </div>

        {/* Always-visible lessons (first 5) */}
        <motion.div variants={stagger} className="flex flex-col gap-2">
          {chapter.lessons.slice(0, 5).map((lesson, i) => (
            <motion.div key={lesson.id} variants={fadeUp}>
              <LessonAccordionItem
                lesson={lesson}
                index={i}
                moduleNumber={unit.moduleNumber}
                isOpen={openLessonId === lesson.id}
                onToggle={() =>
                  setOpenLessonId(openLessonId === lesson.id ? null : lesson.id)
                }
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Expandable extra lessons — jitter-free */}
        <AnimatePresence initial={false}>
          {showAllLessons && chapter.lessons.length > 5 && (
            <motion.div
              key="extra-lessons"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: "hidden" }}
            >
              <div className="flex flex-col gap-2 pt-2">
                {chapter.lessons.slice(5).map((lesson, i) => (
                  <LessonAccordionItem
                    key={lesson.id}
                    lesson={lesson}
                    index={5 + i}
                    moduleNumber={unit.moduleNumber}
                    isOpen={openLessonId === lesson.id}
                    onToggle={() =>
                      setOpenLessonId(
                        openLessonId === lesson.id ? null : lesson.id,
                      )
                    }
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show More / Less */}
        {hiddenCount > 0 && (
          <button
            onClick={() => {
              setShowAllLessons(!showAllLessons);
              if (showAllLessons) setOpenLessonId(null);
            }}
            className="mt-3 text-accent-primary text-xs font-medium flex items-center gap-1 hover:opacity-80 cursor-pointer mx-auto transition-opacity"
          >
            {showAllLessons ? (
              <>
                Show less <ChevronUp size={14} />
              </>
            ) : (
              <>
                Show {hiddenCount} more lessons <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </motion.div>

      {/* Up Next */}
      {nextChapter && (
        <motion.div
          variants={fadeUp}
          className="bg-surface-200 border border-border-default rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-1 block">
              Up Next Chapter
            </span>
            <p className="text-white text-base font-bold">
              {nextChapter.title}: {nextChapter.description}
            </p>
          </div>
          {unit.progress === 100 ? (
            <Link
              href={`/student/courses/${courseId}/${unitId}/${nextChapterId}`}
              className="px-5 py-2.5 bg-white hover:bg-[#E5E5E5] text-black text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-200 flex items-center gap-2 cursor-pointer shrink-0 no-underline"
            >
              Next Chapter
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          ) : (
            <div className="px-5 py-2.5 bg-surface-300 text-[#A1A1AA] text-sm font-bold rounded-lg border border-border-default flex items-center gap-2 shrink-0 opacity-60 cursor-not-allowed">
              <Lock size={14} />
              Unlock Next Chapter
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
