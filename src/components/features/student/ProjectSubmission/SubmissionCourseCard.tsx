"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmissionCourse } from "./types";

interface Props {
  course: SubmissionCourse;
}

export default function SubmissionCourseCard({ course }: Props) {
  const router = useRouter();

  return (
    <div
      className="bg-surface-200 border border-border-default rounded-xl group hover:border-white/20 transition-colors duration-300 flex flex-col h-full relative"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Image */}
      <div className="relative h-44 shrink-0 bg-surface-300 z-0 rounded-t-[11px] overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-surface-200 to-transparent z-10 pointer-events-none" />

        {/* Actual Image or Placeholder */}
        {course.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-surface-300 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
            <span className="text-sm text-[#A1A1AA]">Image Placeholder</span>
          </div>
        )}

        {/* Level Badge */}
        <span
          className={`absolute top-3 left-3 z-20 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${course.levelColor}`}
        >
          {course.level}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col gap-2.5 flex-1 relative z-10 bg-surface-200 rounded-b-[11px]">
        {/* Glow absolute positioned */}
        <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-b-[11px] -z-10" />

        <div className="flex flex-col gap-0.5">
          <h3 className="text-[#F2F2F2] text-sm font-bold leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {course.title}
          </h3>
          <p className="text-[#A1A1AA] text-[11px] leading-relaxed line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Info Metric & Stacked Avatars */}
        <div className="flex items-center justify-between text-[#A1A1AA] text-[11px] mt-1 border-b border-border-default pb-3">
          <span className="flex items-center gap-1.5 font-medium">
            <svg
              className="w-3.5 h-3.5 opacity-70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {course.availableProjects} Interactive Projects
          </span>

          <div className="flex items-center">
            {course.avatars.map((avatar, idx) => (
              <div
                key={avatar.id}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-surface-200 ${
                  avatar.bgColor
                } ${avatar.textColor} ${idx > 0 ? "-ml-2" : ""} z-${10 - idx}`}
              >
                {avatar.initials}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-1 flex items-center w-full gap-3">
          <button
            onClick={() =>
              router.push(`/student/project-submission/${course.id}`)
            }
            className="w-full py-2 bg-white text-black hover:bg-[#E5E5E5] text-[11px] font-bold rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.08)] hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-200 flex items-center justify-center gap-1.5 group/selectBtn cursor-pointer"
          >
            Select Course
            <ArrowUpRight
              size={12}
              strokeWidth={2.5}
              className="group-hover/selectBtn:translate-x-0.5 group-hover/selectBtn:-translate-y-0.5 transition-transform duration-200"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
