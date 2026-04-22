"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Clock,
  FileText,
  Lock,
  Trophy,
} from "lucide-react";

import { TestInfo } from "./types";

interface Props {
  test: TestInfo;
  onStartTest: (testId: string) => void;
}

const statusStyles: Record<TestInfo["status"], string> = {
  Live: "bg-emerald-950/80 text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-900/20",
  Upcoming:
    "bg-amber-950/80 text-amber-300 backdrop-blur-md shadow-lg shadow-amber-900/20",
  Completed: "bg-surface-300 text-[#A1A1AA] backdrop-blur-md",
};

export default function TestInfoCard({ test, onStartTest }: Props) {
  const isLive = test.status === "Live";
  const isCompleted = test.status === "Completed";
  const isLocked = !test.unlocked && !isCompleted;

  return (
    <div className="bg-surface-200 border border-border-default rounded-xl group hover:border-white/20 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusStyles[test.status]}`}
          >
            {isLive && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
            )}
            {test.status}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] bg-surface-300/60 px-2.5 py-1 rounded-full">
            {test.type}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-[#F2F2F2] text-sm font-bold leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {test.title}
          </h3>
          <p className="text-[#A1A1AA] text-[11px] font-medium">
            {test.course}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-1">
          <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-surface-300/40 border border-border-default/50">
            <Clock size={14} className="text-[#A1A1AA] group-hover:text-white transition-colors duration-200" />
            <span className="text-[#F2F2F2] text-xs font-bold">{test.duration}m</span>
            <span className="text-[#A1A1AA] text-[9px] font-medium uppercase tracking-wider">Duration</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-surface-300/40 border border-border-default/50">
            <FileText size={14} className="text-[#A1A1AA] group-hover:text-white transition-colors duration-200" />
            <span className="text-[#F2F2F2] text-xs font-bold">{test.totalQuestions}</span>
            <span className="text-[#A1A1AA] text-[9px] font-medium uppercase tracking-wider">Questions</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-surface-300/40 border border-border-default/50">
            <Trophy size={14} className="text-[#A1A1AA] group-hover:text-white transition-colors duration-200" />
            <span className="text-[#F2F2F2] text-xs font-bold">{test.totalMarks}</span>
            <span className="text-[#A1A1AA] text-[9px] font-medium uppercase tracking-wider">Marks</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#A1A1AA] mt-1">
          <BookOpen size={12} className="opacity-60" />
          <span>
            {test.scheduledDate} • {test.scheduledTime}
          </span>
        </div>

        {isLocked && test.prerequisite && (
          <div className="mt-1 flex items-start gap-2 rounded-lg border border-amber-800/40 bg-amber-950/30 px-3 py-2">
            <Lock size={13} className="mt-0.5 shrink-0 text-amber-300" />
            <div className="flex flex-col gap-0.5">
              <p className="text-amber-200 text-[11px] font-semibold leading-tight">
                Complete “{test.prerequisite.chapterTitle}” first
              </p>
              <p className="text-[#A1A1AA] text-[10px] leading-snug">
                This assessment unlocks once every lesson in the prerequisite
                chapter is completed.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="w-full h-px bg-linear-to-r from-transparent via-border-default to-transparent" />

      <div className="p-4">
        {isLocked && test.prerequisite ? (
          <Link
            href={test.prerequisite.href}
            className="w-full py-2.5 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer bg-surface-300 text-[#F2F2F2] border border-border-default hover:bg-surface-200 hover:text-white hover:border-white/20 no-underline"
          >
            Go to prerequisite chapter
            <ArrowUpRight
              size={12}
              strokeWidth={2.5}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
            />
          </Link>
        ) : (
          <button
            onClick={() => !isCompleted && onStartTest(test.id)}
            disabled={isCompleted}
            className={`w-full py-2.5 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
              isCompleted
                ? "bg-surface-300 text-[#A1A1AA] cursor-not-allowed"
                : isLive
                  ? "bg-white text-black hover:bg-[#E5E5E5] shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  : "bg-surface-300 text-[#F2F2F2] border border-border-default hover:bg-surface-200 hover:text-white hover:border-white/20"
            }`}
          >
            {isCompleted ? (
              "View Results"
            ) : isLive ? (
              <>
                Start Test
                <ArrowUpRight
                  size={12}
                  strokeWidth={2.5}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                />
              </>
            ) : (
              "Scheduled"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
