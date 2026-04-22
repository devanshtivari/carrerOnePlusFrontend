import { Star, TrendingUp } from "lucide-react";
import type { CatalogCourse } from "./types";

export default function TrendingCard({ course }: { course: CatalogCourse }) {
  return (
    <div
      className="w-64 sm:w-72 shrink-0 bg-surface-200 border border-border-default rounded-xl group hover:border-white/20 transition-colors duration-300 flex flex-col relative h-full"
      style={{ transform: "translateZ(0)" }}
    >
      <div className="relative h-32 shrink-0 bg-surface-300 z-0 rounded-t-[11px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-surface-200 to-transparent z-10 pointer-events-none" />

        <span className="absolute top-2 left-2 z-20 text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-accent-secondary text-black shadow-lg flex items-center gap-1">
          <TrendingUp size={8} />
          Trending
        </span>
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1 relative z-10 bg-surface-200 rounded-b-[11px]">
        <h4 className="text-[#F2F2F2] text-xs font-bold leading-snug line-clamp-1 group-hover:text-white transition-colors">
          {course.title}
        </h4>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-0.5 text-accent-secondary">
            <Star
              size={9}
              className="fill-accent-secondary text-accent-secondary"
            />
            {course.rating}
          </span>
          <span className="text-[#A1A1AA]">{course.enrolled} students</span>
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-white text-xs font-bold">{course.price}</span>
          {course.originalPrice && (
            <span className="text-[#A1A1AA] text-[10px] line-through">
              {course.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
