"use client";

import { useState } from "react";
import {
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  FlaskConical,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import YouTubePlayer from "@/components/shared/YouTubePlayer";
import { progressService } from "@/services/progress.service";
import { apiWarn } from "@/lib/debug";

import { getLessonTypeBadge } from "./helpers";
import { Lesson } from "./types";

/**
 * YouTube link every video-bearing lesson streams. Per product requirement
 * every lesson video points at this URL until the content team replaces it
 * with per-lesson streams. The YouTubePlayer component also tracks watch
 * progress and emits `onCompleted` once the student watches >=95% of it.
 */
const CANONICAL_VIDEO_URL = "https://youtu.be/0lBjcaMokvo";

export function LessonAccordionItem({
  lesson,
  index,
  moduleNumber,
  isOpen,
  onToggle,
}: {
  lesson: Lesson;
  index: number;
  moduleNumber: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  // Optimistic completion bit: the API call can lag network-wise but the
  // checkmark should flip instantly when the student finishes the video.
  const [locallyCompleted, setLocallyCompleted] = useState(lesson.completed);

  const handleVideoCompleted = async () => {
    if (locallyCompleted) return;
    setLocallyCompleted(true);
    try {
      await progressService.markLessonComplete(lesson.id);
    } catch (err) {
      // Non-fatal — the UI already flipped; surface the issue for devs but
      // don't unwind the optimistic state because the video was actually
      // watched end-to-end. A future visit will reconcile server-side.
      apiWarn("progress.markLessonComplete", err);
    }
  };

  const completed = lesson.completed || locallyCompleted;

  return (
    <div className="bg-surface-200 border border-border-default rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-3.5 cursor-pointer group text-left"
      >
        <div className="shrink-0">
          {completed ? (
            <CheckCircle2 size={18} className="text-accent-primary" />
          ) : (
            <Circle size={18} className="text-[#A1A1AA]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#F2F2F2] text-sm font-medium leading-tight group-hover:text-white transition-colors">
            {moduleNumber}.{index + 1} {lesson.title}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-[#A1A1AA] text-[11px]">
              <Clock size={10} />
              {lesson.duration}
            </span>
            {lesson.type === "Lesson" ? (
              <span className="flex items-center gap-1 text-[#A1A1AA] text-[11px]">
                <BookOpen size={10} />
                Read
              </span>
            ) : (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getLessonTypeBadge(
                  lesson.type,
                )}`}
              >
                {lesson.type}
              </span>
            )}
          </div>
        </div>
        <span
          className={`text-[11px] font-medium shrink-0 mr-2 ${
            completed ? "text-accent-primary" : "text-[#A1A1AA]"
          }`}
        >
          {completed ? "Completed" : ""}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown size={16} className="text-[#A1A1AA]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-5 pt-1">
              {lesson.type === "Lesson" && (
                <YouTubePlayer
                  videoUrl={CANONICAL_VIDEO_URL}
                  initialCompleted={completed}
                  onCompleted={handleVideoCompleted}
                  caption={`Video lesson · ${lesson.duration}`}
                />
              )}

              {lesson.type === "Lab" && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FlaskConical size={16} className="text-emerald-300" />
                    <span className="text-[#F2F2F2] text-sm font-semibold">
                      Hands-on Lab
                    </span>
                  </div>
                  <YouTubePlayer
                    videoUrl={CANONICAL_VIDEO_URL}
                    initialCompleted={completed}
                    onCompleted={handleVideoCompleted}
                    caption={`Lab walkthrough · ${lesson.duration}`}
                  />
                  <p className="text-[#A1A1AA] text-xs leading-relaxed">
                    Complete the interactive lab environment to practice the
                    concepts covered in this module.
                  </p>
                </div>
              )}

              {lesson.type === "Case Study" && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                    <BookMarked size={16} className="text-white" />
                    <span className="text-[#F2F2F2] text-sm font-semibold">
                      Case Study
                    </span>
                  </div>
                  <YouTubePlayer
                    videoUrl={CANONICAL_VIDEO_URL}
                    initialCompleted={completed}
                    onCompleted={handleVideoCompleted}
                    caption={`Case study video · ${lesson.duration}`}
                  />
                  <p className="text-[#A1A1AA] text-xs leading-relaxed">
                    Analyze a real-world scenario and apply the concepts
                    you&apos;ve learned.
                  </p>
                </div>
              )}

              {lesson.type === "Quiz" && (
                <QuizPrompt onSolved={handleVideoCompleted} solved={completed} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Very lightweight quiz UI. The actual test flow lives under /student/tests;
 * this is purely the in-chapter "knowledge check" affordance. Submitting any
 * answer flips the lesson to completed so the chapter progress can advance.
 */
function QuizPrompt({
  solved,
  onSolved,
}: {
  solved: boolean;
  onSolved: () => void | Promise<void>;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(solved);

  const submit = async () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    await onSolved();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <HelpCircle size={16} className="text-amber-300" />
        <span className="text-[#F2F2F2] text-sm font-semibold">
          Quick Knowledge Check
        </span>
      </div>
      <p className="text-[#A1A1AA] text-xs mb-2">
        Test your understanding of the concepts covered so far.
      </p>
      <div className="flex flex-col gap-2">
        {["Option A", "Option B", "Option C", "Option D"].map((opt, oi) => {
          const isSelected = selected === oi;
          return (
            <button
              key={oi}
              type="button"
              onClick={() => !submitted && setSelected(oi)}
              className={`text-left px-4 py-2.5 border rounded-lg text-sm transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                isSelected
                  ? "bg-surface-400 border-white/30 text-white"
                  : "bg-surface-300 border-border-default text-[#F2F2F2] hover:border-white/20 hover:bg-surface-400"
              }`}
            >
              <span className="size-5 rounded-full border border-border-default flex items-center justify-center text-[10px] font-bold text-[#A1A1AA] shrink-0">
                {String.fromCharCode(65 + oi)}
              </span>
              <span className="text-[#A1A1AA] text-sm">
                Sample answer {opt.split(" ")[1].toLowerCase()}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={submit}
        disabled={selected === null || submitted}
        className="mt-2 w-fit px-5 py-2 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.08)] hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitted ? "Submitted" : "Submit Answer"}
      </button>
    </div>
  );
}
