"use client";

import React from "react";
import { ArrowRight, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmissionUnit } from "./types";

interface Props {
  unit: SubmissionUnit;
  courseId: string;
}

export default function SubmissionUnitCard({ unit, courseId }: Props) {
  const router = useRouter();
  const isLocked = unit.isLocked;

  return (
    <div
      className={`group relative border rounded-xl overflow-hidden flex flex-col sm:flex-row items-stretch sm:items-center transition-all duration-300 ${
        isLocked
          ? "bg-surface-100 border-border-default opacity-60 cursor-not-allowed"
          : "bg-surface-200 border-border-default hover:border-white/20 shadow-sm hover:shadow-md"
      }`}
      style={{ transform: "translateZ(0)" }}
    >
      {/* Absolute overlay for inner glow on hover (only if unlocked) */}
      {!isLocked && (
        <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
      )}

      {/* Image Section (Left) */}
      <div className="relative h-28 sm:h-auto sm:w-48 sm:self-stretch shrink-0 bg-surface-300 z-10 overflow-hidden border-b sm:border-b-0 sm:border-r border-border-default">
        {/* Actual Image or Placeholder */}
        {unit.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={unit.imageUrl}
            alt={unit.title}
            className={`w-full h-full object-cover z-0 ${
              isLocked
                ? "opacity-30 grayscale"
                : "transition-transform duration-500 ease-out group-hover:scale-105"
            }`}
          />
        ) : (
          <div className="w-full h-full bg-surface-300 flex items-center justify-center min-h-27.5">
            <span className="text-sm text-[#A1A1AA]">Unit Image</span>
          </div>
        )}

        {/* Unit Number Badge */}
        <span
          className={`absolute top-3 left-3 z-20 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-lg ${
            isLocked
              ? "bg-surface-300/80 text-[#888888] backdrop-blur-md"
              : "bg-surface-300/80 text-[#F2F2F2] backdrop-blur-md"
          }`}
        >
          {unit.unitNumber}
        </span>

        {/* Locked Overlay Badge */}
        {isLocked && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-surface-300/80 text-[#A1A1AA]">
              <Lock size={10} />
              LOCKED
            </span>
          </div>
        )}
      </div>

      {/* Content Section (Middle) */}
      <div className="p-4 sm:p-5 flex flex-col gap-2 flex-1 relative z-10 justify-center min-w-0">
        {/* Title */}
        <h3
          className={`text-base font-bold leading-snug truncate ${
            isLocked
              ? "text-[#888888]"
              : "text-[#F2F2F2] group-hover:text-white transition-colors duration-200"
          }`}
        >
          {unit.title}
        </h3>

        {/* Metrics */}
        <div className="flex items-center gap-4 text-[#A1A1AA] text-xs font-medium">
          <span className="flex items-center gap-1.5 shrink-0">
            <svg
              className="w-4 h-4 opacity-70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {unit.interactiveProjects} Projects
          </span>
          <span className="w-1 h-1 rounded-full bg-border-default shrink-0" />
          <span className="flex items-center gap-1.5 shrink-0">
            <svg
              className="w-4 h-4 opacity-70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {unit.hours} Hours
          </span>
        </div>
      </div>

      {/* Actions (Right) */}
      <div className="p-4 pt-0 sm:pt-4 sm:pl-0 flex items-center gap-3 sm:gap-4 shrink-0 z-10 sm:ml-auto">
        <button
          onClick={() => {
            if (!isLocked) {
              router.push(`/student/project-submission/${courseId}/${unit.id}`);
            }
          }}
          disabled={isLocked}
          className={`px-5 py-2.5 rounded-lg font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 group/btn cursor-pointer ${
            isLocked
              ? "bg-surface-300 text-[#888888] cursor-not-allowed border border-border-default"
              : "bg-white hover:bg-[#E5E5E5] text-black shadow-[0_0_10px_rgba(255,255,255,0.08)] hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          }`}
        >
          View Projects
          {!isLocked && (
            <ArrowRight
              size={14}
              strokeWidth={2.5}
              className="group-hover/btn:translate-x-0.5 transition-transform duration-200"
            />
          )}
        </button>
      </div>
    </div>
  );
}
