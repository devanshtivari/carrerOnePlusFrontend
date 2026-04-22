"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, FileText, ArrowRight } from "lucide-react";
import { TestResult } from "./types";

interface Props {
  result: TestResult;
  totalQuestions: number;
  onClose: () => void;
}

export default function TestResultModal({
  result,
  totalQuestions,
  onClose,
}: Props) {
  const formatTimeTaken = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-sm bg-surface-200 border border-border-default rounded-2xl p-8 flex flex-col items-center gap-6 z-10"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Success Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl scale-150 pointer-events-none" />
            <div className="relative size-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-[#F2F2F2]" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center flex flex-col gap-1">
            <h2 className="text-[#F2F2F2] text-xl font-bold">
              Test Submitted!
            </h2>
            <p className="text-[#A1A1AA] text-sm">
              Your responses have been recorded successfully.
            </p>
          </div>

          {/* Result Stats */}
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between p-3.5 bg-surface-300/40 border border-border-default rounded-xl">
              <div className="flex items-center gap-2.5">
                <FileText size={16} className="text-[#A1A1AA]" />
                <span className="text-[#A1A1AA] text-xs font-medium">
                  Questions Attempted
                </span>
              </div>
              <span className="text-[#F2F2F2] text-sm font-bold">
                {result.attempted}{" "}
                <span className="text-[#A1A1AA] font-normal">
                  / {totalQuestions}
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-surface-300/40 border border-border-default rounded-xl">
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-[#A1A1AA]" />
                <span className="text-[#A1A1AA] text-xs font-medium">
                  Time Taken
                </span>
              </div>
              <span className="text-[#F2F2F2] text-sm font-bold">
                {formatTimeTaken(result.timeTaken)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-surface-300/40 border border-border-default rounded-xl">
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-[#A1A1AA]" />
                <span className="text-[#A1A1AA] text-xs font-medium">
                  Submitted At
                </span>
              </div>
              <span className="text-[#F2F2F2] text-sm font-bold">
                {result.submittedAt}
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-white text-black text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-[#E5E5E5] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            Back to Tests
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
