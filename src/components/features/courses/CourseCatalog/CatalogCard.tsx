import { BookOpen, Clock, Users, Star, ArrowUpRight } from "lucide-react";
import type { CatalogCourse } from "./types";

export default function CatalogCard({ course }: { course: CatalogCourse }) {
  return (
    <div
      className="bg-surface-200 border border-border-default rounded-xl group hover:border-white/20 transition-colors duration-300 flex flex-col h-full relative"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Image Container */}
      <div className="relative h-36 shrink-0 bg-surface-300 z-0 rounded-t-[11px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-surface-200 to-transparent z-10 pointer-events-none" />

        <span
          className={`absolute top-3 left-3 z-20 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-lg ${course.badgeStyle}`}
        >
          {course.badge}
        </span>
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

      <div className="p-4 flex flex-col gap-2.5 flex-1 relative z-10 bg-surface-200 rounded-b-[11px]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {course.tags.slice(0, 2).map((tag: string, i: number) => (
            <span
              key={tag}
              className="text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA] bg-surface-300 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-[#F2F2F2] text-sm font-bold leading-snug group-hover:text-white transition-colors">
          {course.title}
        </h3>
        <p className="text-[#A1A1AA] text-[11px] leading-relaxed line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center gap-3 text-[#A1A1AA] text-[10px]">
          <span className="flex items-center gap-1">
            <BookOpen size={10} />
            {course.lessons} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users size={10} />
            {course.enrolled}
          </span>
        </div>

        <p className="text-[#A1A1AA] text-[10px]">
          by{" "}
          <span className="text-[#F2F2F2] font-medium">
            {course.instructor}
          </span>
        </p>

        <div className="mt-auto pt-3 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 border-t border-border-default">
          <div className="flex items-baseline gap-2">
            <span className="text-white text-base font-bold">
              {course.price}
            </span>
            {course.originalPrice && (
              <span className="text-[#A1A1AA] text-xs line-through">
                {course.originalPrice}
              </span>
            )}
          </div>
          <button className="px-4 py-2 bg-white hover:bg-[#E5E5E5] text-black text-[11px] font-bold rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.08)] hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-200 cursor-pointer flex items-center justify-center w-full sm:w-auto gap-1.5 group/btn mt-2 sm:mt-0">
            Enroll Now
            <ArrowUpRight
              size={12}
              strokeWidth={2.5}
              className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
