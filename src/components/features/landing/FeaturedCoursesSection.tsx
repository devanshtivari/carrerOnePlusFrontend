"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users } from "lucide-react";

import { fadeUp, featuredCourses } from "./data";

export default function FeaturedCoursesSection() {
  return (
    <section id="courses" className="py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Featured Courses
            </h2>
            <p className="text-neutral-400 text-sm">
              Tailored learning paths for every grade.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.slice(0, 3).map((course, index) => (
            <motion.div
              key={course.id}
              variants={fadeUp}
              className="bg-surface-200 border border-border-default rounded-2xl overflow-hidden group cursor-pointer hover:border-white/20 transition-all duration-300 flex flex-col h-full"
            >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-surface-200 via-transparent to-transparent opacity-80" />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${course.badgeStyle}`}
                    >
                      {course.level}
                    </span>
                    <span className="text-xs font-bold text-neutral-400">
                      {course.grade}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-neutral-400 mb-6 line-clamp-2 flex-1">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border-default">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-bold">
                        {course.enrolled} students
                      </span>
                    </div>
                    <Link
                      href="/student/courses"
                      className="text-sm font-bold text-accent-primary flex items-center gap-1 group/link"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
