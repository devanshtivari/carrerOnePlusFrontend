import Link from "next/link";
import { BookOpen, Clock, Users, Star, ArrowUpRight } from "lucide-react";
import type { Course } from "./types";

/* ── Enrolled Course Card Component ── */
export default function EnrolledCourseCard({ course }: { course: Course }) {
  return (
    <div
      className="bg-surface-200 border border-border-default rounded-xl group hover:border-white/20 transition-colors duration-300 flex flex-col h-full relative"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Image Container */}
      <div className="relative h-48 shrink-0 bg-surface-300 z-0 rounded-t-[11px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-surface-200 to-transparent z-10 pointer-events-none" />

        {/* Badge */}
        <span
          className={`absolute top-3 left-3 z-20 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-lg ${course.badgeStyle}`}
        >
          {course.badge}
        </span>
        {/* Rating */}
        <div className="absolute bottom-3 right-3 z-20">
          <span className="flex items-center gap-1 bg-surface-200/80 backdrop-blur-md text-[#F2F2F2] text-[10px] font-medium px-2 py-1 rounded-full">
            <Star
              size={10}
              className="text-accent-secondary fill-accent-secondary"
            />
            {course.rating}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1 relative z-10 bg-surface-200 rounded-b-[11px]">
        <div>
          <h3 className="text-[#F2F2F2] text-base font-bold leading-snug group-hover:text-white transition-colors mb-1.5">
            {course.title}
          </h3>
          <p className="text-[#A1A1AA] text-xs leading-relaxed line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-[#A1A1AA] text-[11px]">
          <span className="flex items-center gap-1.5">
            <BookOpen size={12} />
            {course.lessons} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={12} />
            {course.enrolled}
          </span>
        </div>

        {/* Instructor */}
        <p className="text-[#A1A1AA] text-[11px]">
          by{" "}
          <span className="text-[#F2F2F2] font-medium">
            {course.instructor}
          </span>
        </p>

        {/* Progress */}
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#A1A1AA] text-xs font-medium">
              Course Progress
            </span>
            <span className="text-[#F2F2F2] text-xs font-bold">
              {course.progress}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-400 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/student/courses/${course.id}`}
          className="mt-3 w-full py-2.5 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.08)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer group/btn"
        >
          <span>
            {course.progress === 100
              ? "Review Course"
              : course.progress > 0
                ? "Resume Learning"
                : "Start Learning"}
          </span>
          <ArrowUpRight
            size={14}
            strokeWidth={2.5}
            className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200"
          />
        </Link>
      </div>
    </div>
  );
}
