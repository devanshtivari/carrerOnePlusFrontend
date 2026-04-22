"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";

import { contentService } from "@/services/content.service";
import type { LandingJourneyStepContent } from "@/services/types";

import { fadeUp, steps as fallbackSteps } from "./data";

const FALLBACK_STEPS: LandingJourneyStepContent[] = fallbackSteps.map((s) => ({
  num: s.num,
  title: s.title,
  description: s.desc,
}));

export default function JourneySection() {
  const [steps, setSteps] = useState<LandingJourneyStepContent[]>(FALLBACK_STEPS);

  useEffect(() => {
    let cancelled = false;
    contentService
      .landing()
      .then((res) => {
        if (!cancelled && Array.isArray(res.journey)) setSteps(res.journey);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="journey" className="py-24 bg-surface-100 border-y border-border-default">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div variants={fadeUp} className="text-center mb-20 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Your Journey to Innovation
          </h2>
          <p className="text-neutral-400 text-base">
            Start your tech career in five simple steps.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-0.5 bg-border-default z-0" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="relative z-10 flex flex-col items-center text-center space-y-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-brand-bg border-2 border-border-default flex items-center justify-center text-xl font-black text-white group-hover:border-accent-primary group-hover:text-accent-primary transition-colors shadow-xl">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{step.title}</h3>
                  <p className="text-sm text-neutral-400">{step.description}</p>
                </div>
              </motion.div>
            ))}

            {/* Final Step */}
            <motion.div
              variants={fadeUp}
              className="relative z-10 flex flex-col items-center text-center space-y-4 group"
            >
              <div className="w-14 h-14 rounded-full bg-accent-primary flex items-center justify-center text-brand-bg shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">Get Certified</h3>
                <p className="text-sm text-neutral-400">
                  Earn industry recognized certificates
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
