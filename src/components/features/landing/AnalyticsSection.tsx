"use client";

import { motion } from "framer-motion";
import { Zap, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { fadeUp } from "./data";

export default function AnalyticsSection() {
  return (
    <section className="py-24 bg-surface-100 border-t border-border-default overflow-hidden relative">
      <div className="absolute top-0 right-0 w-150 h-150 bg-accent-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div variants={fadeUp} className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Monitor Your Growth With{" "}
            <span className="text-accent-primary">Intuitive Analytics</span>
          </h2>
          <p className="text-base text-neutral-400 leading-relaxed">
            Our student dashboard provides real-time insights into your learning
            journey, helping you stay motivated and focused on your goals.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-200 border border-border-default flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-accent-secondary" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-1">
                  Learning Streak
                </h4>
                <p className="text-sm text-neutral-400">
                  Maintain consistency and earn XP bonuses for daily activities.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-200 border border-border-default flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-1">
                  Class Ranking
                </h4>
                <p className="text-sm text-neutral-400">
                  See how you stand against thousands of students across India.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/student"
            className="inline-block px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-[#E5E5E5] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-lg"
          >
            Explore Dashboard
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} className="relative h-100 lg:h-125">
          {/* Abstract representation of the dashboard to match the aesthetic */}
          <div className="absolute inset-0 bg-surface-200 rounded-3xl border border-border-default overflow-hidden shadow-2xl flex flex-col p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-surface-300 rounded-full animate-pulse" />
              <div>
                <div className="w-32 h-4 bg-surface-300 rounded-full mb-2" />
                <div className="w-24 h-3 bg-surface-300 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-surface-100 rounded-xl border border-border-default">
                <p className="text-xs text-neutral-500 font-bold mb-1">
                  Learning Streak
                </p>
                <p className="text-2xl font-black text-white">
                  14 Days{" "}
                  <span className="text-accent-secondary text-sm ml-1">
                    🔥 Hot
                  </span>
                </p>
              </div>
              <div className="p-4 bg-surface-100 rounded-xl border border-border-default">
                <p className="text-xs text-neutral-500 font-bold mb-1">
                  National Rank
                </p>
                <p className="text-2xl font-black text-white">#142</p>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-400 font-medium">
                    Python Masterclass
                  </span>
                  <span className="text-sm text-white font-bold">78%</span>
                </div>
                <div className="h-2 bg-surface-300 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-primary w-[78%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-400 font-medium">
                    Cyber Security Essentials
                  </span>
                  <span className="text-sm text-white font-bold">45%</span>
                </div>
                <div className="h-2 bg-surface-300 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-secondary w-[45%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
