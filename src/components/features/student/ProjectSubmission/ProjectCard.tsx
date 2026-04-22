"use client";

import React from "react";
import { SubmissionProject } from "./types";
import { Calendar, CheckCircle2, AlertCircle, Upload, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  project: SubmissionProject;
  courseId: string;
  unitId: string;
}

export default function ProjectCard({ project, courseId, unitId }: Props) {
  const router = useRouter();
  const isComplete =
    project.status === "Submitted" || project.status === "Graded";

  return (
    <div
      className="bg-surface-200 border border-border-default rounded-xl overflow-hidden flex flex-col group hover:border-white/20 transition-all duration-300 cursor-pointer h-full relative"
      style={{ transform: "translateZ(0)" }}
      onClick={() =>
        router.push(
          `/student/project-submission/${courseId}/${unitId}/${project.id}`,
        )
      }
    >
      {/* Glow absolute positioned */}
      <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl -z-10" />

      {/* Image Container */}
      <div className="relative h-40 bg-surface-300 shrink-0 w-full overflow-hidden border-b border-border-default">
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-surface-200 to-transparent z-10 pointer-events-none" />

        {project.imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-[#A1A1AA]">No Image</span>
          </div>
        )}

        {/* Status Badge Over Image (Glass variant) */}
        <span
          className={`absolute top-3 left-3 z-20 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg ${
            isComplete
              ? "bg-success-500/10 text-success-500 ring-1 ring-success-500/20 shadow-success-900/20"
              : "bg-error-500/10 text-error-500 ring-1 ring-error-500/20 shadow-error-900/20"
          }`}
        >
          {isComplete ? "COMPLETE" : "PENDING"}
        </span>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1 gap-4 z-10 bg-surface-200">
        <div className="flex flex-col gap-1.5 flex-1">
          <h3 className="text-[#F2F2F2] font-bold text-sm leading-snug group-hover:text-white transition-colors">
            {project.title}
          </h3>
          <p className="text-[#A1A1AA] text-[11px] leading-relaxed line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Metas */}
        <div className="flex flex-col gap-2 mt-auto text-[11px] pb-4 border-b border-border-default">
          <div className="flex items-center gap-1.5 text-[#A1A1AA] font-medium">
            <Calendar size={14} className="opacity-70" />
            <span>Deadline: {project.deadline}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 font-bold ${
              isComplete ? "text-success-500" : "text-error-500"
            }`}
          >
            {isComplete ? (
              <CheckCircle2 size={14} />
            ) : (
              <AlertCircle size={14} />
            )}
            <span>{project.status}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          {isComplete ? (
            <button className="w-full py-2.5 rounded-lg border bg-surface-300 border-border-default text-[#A1A1AA] hover:bg-surface-200 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-1.5 font-bold text-[11px] cursor-pointer">
              <Eye size={14} strokeWidth={2} />
              View Details
            </button>
          ) : (
            <button className="w-full py-2.5 bg-white text-black hover:bg-[#E5E5E5] text-[11px] font-bold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload size={14} strokeWidth={2.5} />
              Submit Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
