"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";
import {
  Search,
  X,
  Sparkles,
  TrendingUp,
  Code2,
  Brain,
  Database,
  Shield,
  Palette,
  Smartphone,
  BarChart3,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { categoriesService, coursesService } from "@/services/courses.service";

import CatalogCard from "./CatalogCard";
import TrendingCard from "./TrendingCard";

/* ── Animation Variants (Void Design System §6) ── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

import { categories, levels, toCatalogCourse } from "./data";

/* ── Main ── */
export default function CourseCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All Levels");
  const [focusedSearch, setFocusedSearch] = useState(false);

  const { data: coursesData, loading } = useApi(
    () => coursesService.list({ pageSize: 50, published: true }),
    [],
  );
  const { data: cats } = useApi(() => categoriesService.list(), []);

  const catalogCourses = useMemo(
    () => (coursesData?.items ?? []).map((c) => toCatalogCourse(c, cats ?? [])),
    [coursesData, cats],
  );

  const filteredCourses = useMemo(() => {
    return catalogCourses.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCategory =
        activeCategory === "All" || c.category === activeCategory;

      const matchesLevel =
        activeLevel === "All Levels" || c.level === activeLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [catalogCourses, searchQuery, activeCategory, activeLevel]);

  const featuredCourses = catalogCourses.filter((c) => c.isFeatured);

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6 md:gap-8 overflow-x-hidden"
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
        <Link
          href="/student/courses"
          className="text-[#A1A1AA] text-xs font-medium hover:text-white transition-colors"
        >
          Courses
        </Link>
        <span className="text-[#A1A1AA] text-xs">›</span>
        <span className="text-[#F2F2F2] text-xs font-medium">Catalog</span>
      </motion.div>

      {/* Trending Marquee */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-accent-secondary" />
          <h2 className="text-[#F2F2F2] text-sm font-bold">Trending Now</h2>
        </div>
        <div className="relative overflow-hidden max-w-full">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-(--background) to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-(--background) to-transparent z-10 pointer-events-none" />
          <motion.div
            className="flex gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {[...featuredCourses, ...featuredCourses].map((course, i) => (
              <TrendingCard key={`${course.id}-${i}`} course={course} />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-[#F2F2F2] text-base font-bold mb-4">
          Browse All Courses
        </h2>

        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative max-w-lg w-full">
            <span
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none ${
                focusedSearch ? "text-white" : "text-[#A1A1AA]"
              }`}
            >
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by title, instructor, or tag..."
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

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:pb-0 md:overflow-visible scrollbar-hide">
            <LayoutGroup id="catalog-categories">
              {categories.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setActiveCategory(label)}
                  className={`relative shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === label
                      ? "text-black"
                      : "bg-surface-200 text-[#A1A1AA] border border-border-default hover:text-white hover:border-white/20"
                  }`}
                >
                  {activeCategory === label && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.08)]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon size={12} className="relative z-10" />
                  <span className="relative z-10">{label}</span>
                </button>
              ))}
            </LayoutGroup>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:pb-0 md:overflow-visible scrollbar-hide">
            <span className="text-[#A1A1AA] text-[11px] font-medium mr-1 shrink-0">
              Level:
            </span>
            <LayoutGroup id="catalog-levels">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setActiveLevel(level)}
                  className={`relative px-3 py-1 shrink-0 rounded-full text-[11px] font-medium transition-colors duration-200 cursor-pointer ${
                    activeLevel === level
                      ? "text-black"
                      : "text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  {activeLevel === level && (
                    <motion.div
                      layoutId="activeLevelPill"
                      className="absolute inset-0 bg-white/90 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{level}</span>
                </button>
              ))}
            </LayoutGroup>
          </div>
        </div>
      </motion.div>

      {/* Gradient Separator */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      {/* Course Grid with AnimatePresence for smooth filter transitions */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative h-full w-full max-w-full"
      >
        <AnimatePresence mode="popLayout" initial={true}>
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
              <CatalogCard course={course} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Loading State */}
      {loading && filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full flex flex-col items-center justify-center py-16"
        >
          <p className="text-[#A1A1AA] text-sm">Loading courses…</p>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full flex flex-col items-center justify-center py-16"
        >
          <Search size={40} className="text-[#A1A1AA] opacity-30 mb-4" />
          <p className="text-[#A1A1AA] text-sm">
            No courses found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
              setActiveLevel("All Levels");
            }}
            className="mt-3 text-accent-primary text-xs font-medium hover:opacity-80 transition-opacity cursor-pointer"
          >
            Clear all filters
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
