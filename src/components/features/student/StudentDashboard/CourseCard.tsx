import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CourseCardProps } from "./types";

export default function CourseCard({
  id,
  title,
  description,
  imageUrl,
  difficulty,
  progress,
}: CourseCardProps) {
  const difficultyStyles = {
    Beginner:
      "bg-emerald-950/80 text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-900/20",
    Intermediate:
      "bg-amber-950/80 text-amber-300 backdrop-blur-md shadow-lg shadow-amber-900/20",
    Advanced:
      "bg-white/90 text-black backdrop-blur-md shadow-lg shadow-white/10",
  };

  return (
    <div
      className="bg-surface-200 border border-border-default rounded-xl group hover:border-white/20 transition-colors duration-300 flex flex-col h-full"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Image */}
      <div className="relative h-40 shrink-0 bg-surface-300 z-0 rounded-t-[11px] overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-surface-200 to-transparent z-10 pointer-events-none" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        {/* Difficulty Badge */}
        <span
          className={`absolute top-3 right-3 z-20 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${difficultyStyles[difficulty]}`}
        >
          {difficulty}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1 relative z-10 bg-surface-200 rounded-b-[11px]">
        <h3 className="text-[#F2F2F2] text-sm font-bold leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-[#A1A1AA] text-xs leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Progress */}
        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#A1A1AA] text-xs font-medium">Progress</span>
            <span className="text-[#F2F2F2] text-xs font-bold">
              {progress}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-400 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Resume Button — uses Lucide icon for consistency */}
        <Link
          href={`/student/courses/${id}`}
          className="mt-3 w-full py-2.5 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.08)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer group/btn"
        >
          <span>Resume Learning</span>
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
