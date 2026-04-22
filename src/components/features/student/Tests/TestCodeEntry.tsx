"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { KeyRound, AlertCircle, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

interface Props {
  expectedCode: string;
  testTitle: string;
  onCodeValid: () => void;
}

export default function TestCodeEntry({
  expectedCode,
  testTitle,
  onCodeValid,
}: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toUpperCase() === expectedCode.toUpperCase()) {
      setError("");
      onCodeValid();
    } else {
      setError("Invalid test code. Please check and try again.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <div
        className={`w-full max-w-md bg-surface-200 border border-border-default rounded-2xl p-8 flex flex-col items-center gap-6 ${isShaking ? "animate-shake" : ""}`}
      >
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 rounded-full blur-xl scale-150 pointer-events-none" />
          <div className="relative size-16 rounded-2xl bg-surface-300 border border-border-default flex items-center justify-center">
            <KeyRound size={28} className="text-[#A1A1AA]" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-[#F2F2F2] text-xl font-bold">Enter Test Code</h2>
          <p className="text-[#A1A1AA] text-sm leading-relaxed">
            Enter the unique code provided by your instructor to access{" "}
            <span className="text-[#F2F2F2] font-semibold">{testTitle}</span>.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (error) setError("");
              }}
              placeholder="e.g. TEST-001"
              className={`w-full px-4 py-3.5 bg-surface-300 border rounded-xl text-[#F2F2F2] text-sm font-mono tracking-widest placeholder:text-zinc-600 placeholder:tracking-wider focus:outline-none focus:ring-1 transition-all duration-200 ${
                error
                  ? "border-white ring-1 ring-white shadow-[inset_0_0_15px_rgba(255,255,255,0.15)]"
                  : "border-border-default focus:ring-white focus:border-white"
              }`}
              autoFocus
            />
          </div>

          {/* Error Message — fixed height to prevent layout shift */}
          <div className="h-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-xs font-medium"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-white text-black text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-[#E5E5E5] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            Verify Code
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </form>

        {/* Help text */}
        <p className="text-[#A1A1AA] text-[11px] text-center">
          Don&apos;t have a code?{" "}
          <button className="text-[#F2F2F2] font-semibold hover:underline underline-offset-4 cursor-pointer">
            Contact your instructor
          </button>
        </p>
      </div>
    </motion.div>
  );
}
