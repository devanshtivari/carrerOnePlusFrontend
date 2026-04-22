"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Send,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { TestQuestion, TestInfo, UserAnswer } from "./types";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

interface Props {
  test: TestInfo;
  questions: TestQuestion[];
  onSubmit: (answers: UserAnswer[], timeTaken: number) => void;
}

export default function TestPage({ test, questions, onSubmit }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(test.duration * 60); // seconds
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const totalTime = test.duration * 60;
  const elapsed = totalTime - timeLeft;
  const isLowTime = timeLeft <= 120; // Under 2 mins
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k].trim() !== "",
  ).length;

  // Timer
  useEffect(() => {
    if (hasSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasSubmitted]);

  // Auto-submit on timer end
  useEffect(() => {
    if (timeLeft === 0 && !hasSubmitted) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleSubmit = useCallback(() => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    const userAnswers: UserAnswer[] = Object.entries(answers).map(
      ([questionId, answer]) => ({ questionId, answer }),
    );
    onSubmit(userAnswers, elapsed);
  }, [answers, elapsed, hasSubmitted, onSubmit]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const setAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const currentAnswer = answers[currentQuestion.id] || "";

  return (
    <motion.div
      className="flex flex-col gap-0 h-full"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      {/* Top Bar — Timer + Progress */}
      <div className="flex items-center justify-between p-4 bg-surface-200 border-b border-border-default sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <h3 className="text-[#F2F2F2] text-sm font-bold hidden sm:block">
            {test.title}
          </h3>
          <span className="text-[#A1A1AA] text-[11px] font-medium bg-surface-300/60 px-2.5 py-1 rounded-full">
            {answeredCount}/{questions.length} answered
          </span>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-bold transition-colors duration-300 ${
            isLowTime
              ? "bg-red-950/40 border-red-900/40 text-red-400"
              : "bg-surface-300/40 border-border-default text-[#F2F2F2]"
          }`}
        >
          {isLowTime && (
            <AlertTriangle size={14} className="text-red-400 animate-pulse" />
          )}
          <Clock size={14} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Question Navigation — Side panel */}
        <div className="hidden md:flex flex-col gap-2 p-4 bg-surface-200/50 border-r border-border-default w-20 shrink-0 overflow-y-auto">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#A1A1AA] mb-2 text-center">
            Questions
          </span>
          {questions.map((q, index) => {
            const isAnswered = answers[q.id] && answers[q.id].trim() !== "";
            const isCurrent = index === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(index)}
                className={`size-10 rounded-lg text-xs font-bold flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                  isCurrent
                    ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                    : isAnswered
                      ? "bg-white/10 text-white border-white/20"
                      : "bg-surface-300 text-[#A1A1AA] border-border-default hover:border-white/20 hover:text-white"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {/* Main Question Area */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto">
          {/* Question Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-[#A1A1AA] text-xs font-bold mt-1 shrink-0">
                Q{currentIndex + 1}.
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-[#F2F2F2] text-base font-semibold leading-relaxed">
                  {currentQuestion.question}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] bg-surface-300/60 px-2 py-0.5 rounded-full">
                    {currentQuestion.type === "mcq"
                      ? "Multiple Choice"
                      : "Written Answer"}
                  </span>
                  {currentQuestion.marks > 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-white/10 px-2 py-0.5 rounded-full">
                      {currentQuestion.marks} marks
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Answer Area */}
          <div className="flex flex-col gap-3 flex-1">
            {currentQuestion.type === "mcq" && currentQuestion.options ? (
              <div className="flex flex-col gap-2.5">
                {currentQuestion.options.map((option) => {
                  const isSelected = currentAnswer === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setAnswer(option.id)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? "bg-white/5 border-white/20 text-[#F2F2F2]"
                          : "bg-surface-300/40 border-border-default text-[#A1A1AA] hover:border-white/10 hover:text-[#F2F2F2] hover:bg-surface-300/60"
                      }`}
                    >
                      {/* Radio circle */}
                      <span
                        className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isSelected ? "border-white" : "border-surface-400"
                        }`}
                      >
                        {isSelected && (
                          <span className="size-2.5 rounded-full bg-white transition-all" />
                        )}
                      </span>
                      <span className="font-medium">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <textarea
                value={currentAnswer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full min-h-50 p-4 bg-surface-300 border border-border-default rounded-xl text-[#F2F2F2] text-sm leading-relaxed placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white focus:border-white transition-all duration-200 resize-none"
              />
            )}
          </div>

          {/* Mobile Question Navigation */}
          <div className="flex md:hidden flex-wrap gap-1.5 p-3 bg-surface-200 border border-border-default rounded-xl">
            {questions.map((q, index) => {
              const isAnswered = answers[q.id] && answers[q.id].trim() !== "";
              const isCurrent = index === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`size-8 rounded-md text-[10px] font-bold flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? "bg-white text-black"
                      : isAnswered
                        ? "bg-white/10 text-white"
                        : "bg-surface-300 text-[#A1A1AA]"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border-default/50">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-300 border border-border-default text-[#A1A1AA] text-xs font-bold rounded-lg hover:border-white/20 hover:text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-white text-black text-xs font-bold rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-[#E5E5E5] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-200 cursor-pointer"
              >
                Submit Test
                <Send size={14} strokeWidth={2.5} />
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(questions.length - 1, prev + 1),
                  )
                }
                className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-300 border border-border-default text-[#A1A1AA] text-xs font-bold rounded-lg hover:border-white/20 hover:text-white transition-all duration-200 cursor-pointer"
              >
                Next
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
