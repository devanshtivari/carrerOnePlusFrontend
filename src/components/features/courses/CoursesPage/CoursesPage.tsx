"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";
import { BookOpen, Filter, Search, X } from "lucide-react";

import EmptyState from "@/components/shared/EmptyState";
import { useApi } from "@/hooks/useApi";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { classesService } from "@/services/classes.service";
import { coursesService } from "@/services/courses.service";
import { enrollmentsService } from "@/services/enrollments.service";

import EnrolledCourseCard from "./EnrolledCourseCard";
import { filters, toCourseCard, toCatalogCard } from "./data";

/* ── Animation variants (Void Design System §6) ── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/**
 * Class-scoped course listing.
 *
 * Previously the student's "My Courses" tab pulled from
 * `/enrollments?userId=me` and offered a separate "Browse Catalog" CTA. The
 * product flow now reads:
 *
 *   1. Derive the student's grade from their class membership (fallback to
 *      the `grade` column on the user profile).
 *   2. Pull `GET /courses?grade=<n>&published=true` → that's the entire
 *      surfaced catalogue for this student.
 *   3. Merge in enrollment progress so the cards still render "In progress /
 *      Not started / Completed" affordances without losing the grade filter.
 *
 * Net effect: students see the 2-3 courses intended for their grade, no more
 * browsing a full generic catalogue.
 */
export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Courses");
  const [focusedSearch, setFocusedSearch] = useState(false);

  const { user } = useCurrentUser();
  const { data: memberships } = useApi(() => classesService.myClasses(), []);

  // Prefer the class's grade (most authoritative — set by the teacher) and
  // fall back to the user's stored grade, finally defaulting to '10' so the
  // UI never shows a blank grid for test accounts missing a class.
  const derivedGrade =
    memberships?.find((m) => m.role === "STUDENT")?.class?.grade ??
    user?.grade ??
    null;

  const { data: coursesData, loading: coursesLoading } = useApi(
    () =>
      coursesService.list({
        pageSize: 50,
        published: true,
        ...(derivedGrade ? { grade: derivedGrade } : {}),
      }),
    [derivedGrade],
  );

  const { data: enrollmentsData, loading: enrollmentsLoading } = useApi(
    () => enrollmentsService.list({ pageSize: 100 }),
    [],
  );

  const loading = coursesLoading || enrollmentsLoading;

  const courses = useMemo(() => {
    const enrollments = enrollmentsData?.items ?? [];
    const enrollmentByCourseId = new Map(
      enrollments.map((e) => [e.courseId, e] as const),
    );

    // If the student has an enrollment for a course in their grade, reuse
    // the enrollment shape (so `progress`, `badge` etc. stay accurate).
    // Otherwise synthesise a fresh "Not started" card from the catalogue row.
    const cards = (coursesData?.items ?? []).map((course) => {
      const enrollment = enrollmentByCourseId.get(course.id);
      if (enrollment) return toCourseCard(enrollment);
      return toCatalogCard(course);
    });

    return cards;
  }, [coursesData, enrollmentsData]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.instructor.toLowerCase().includes(q);

      if (activeFilter === "In Progress")
        return matchesSearch && course.progress > 0 && course.progress < 100;
      if (activeFilter === "Not Started")
        return matchesSearch && course.progress === 0;
      if (activeFilter === "Completed")
        return matchesSearch && course.progress === 100;
      return matchesSearch;
    });
  }, [courses, searchQuery, activeFilter]);

  const gradeLabel = derivedGrade ? `Grade ${derivedGrade}` : "Your grade";

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Breadcrumb */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-2"
      >
        <Link
          href="/student"
          className="text-[#A1A1AA] text-xs font-medium hover:text-white transition-colors"
        >
          Home
        </Link>
        <span className="text-[#A1A1AA] text-xs">›</span>
        <span className="text-[#F2F2F2] text-xs font-medium">Courses</span>
      </motion.div>

      {/* Header + Search */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight">
            Courses for {gradeLabel}
          </h2>
          {derivedGrade && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#A1A1AA] bg-surface-300 border border-border-default px-2 py-1 rounded-full">
              <BookOpen size={11} />
              Class-scoped
            </span>
          )}
        </div>
        <p className="text-[#A1A1AA] text-sm mb-6">
          These are the courses hand-picked for your grade. Pick up where you
          left off or start something new.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md group w-full">
            <span
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none ${
                focusedSearch ? "text-white" : "text-[#A1A1AA]"
              }`}
            >
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onFocus={() => setFocusedSearch(true)}
              onBlur={() => setFocusedSearch(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-surface-100 text-[#F2F2F2] border border-border-default rounded-lg pl-11 pr-10 text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200"
              autoComplete="off"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full bg-surface-300 flex items-center justify-center text-[#A1A1AA] hover:text-white hover:bg-surface-400 transition-colors cursor-pointer"
                >
                  <X size={12} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:pb-0 md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full sm:w-auto relative">
            <Filter size={14} className="text-[#A1A1AA] mr-1 shrink-0" />
            <LayoutGroup>
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer ${
                    activeFilter === filter
                      ? "text-black"
                      : "bg-surface-200 text-[#A1A1AA] border border-border-default hover:text-white hover:border-white/20"
                  }`}
                >
                  {activeFilter === filter && (
                    <motion.div
                      layoutId="activeFilterPill"
                      className="absolute inset-0 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.08)]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{filter}</span>
                </button>
              ))}
            </LayoutGroup>
          </div>
        </div>
      </motion.div>

      {/* Gradient separator */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      {/* Course grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 gap-6 relative"
      >
        <AnimatePresence initial={true}>
          {filteredCourses.map((course, idx) => (
            <motion.div
              layout="position"
              key={course.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{
                duration: 0.4,
                delay: Math.min(idx * 0.08, 0.3),
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{ width: "100%" }}
              className="flex flex-col h-full"
            >
              <EnrolledCourseCard course={course} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Loading state */}
      {loading && filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full flex flex-col items-center justify-center py-16"
        >
          <p className="text-[#A1A1AA] text-sm">Loading your courses…</p>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && filteredCourses.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title={
            searchQuery || activeFilter !== "All Courses"
              ? "No matching courses"
              : "No courses for your grade yet"
          }
          description={
            searchQuery || activeFilter !== "All Courses"
              ? "Try clearing your filters or searching for something else."
              : `Your teacher hasn't published any courses for ${gradeLabel.toLowerCase()} yet. Check back soon — or ask them to share the course code directly.`
          }
          action={{ label: "Back to dashboard", href: "/student" }}
        />
      )}
    </motion.div>
  );
}
