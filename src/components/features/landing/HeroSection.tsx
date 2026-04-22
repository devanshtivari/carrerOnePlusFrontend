"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { PlayCircle, ChevronDown } from "lucide-react";
import Image from "next/image";

import { fadeUp } from "./data";
export default function HeroSection() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 100);
  });
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-150 h-150 bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full z-10">
        {/* Left Content */}
        <motion.div
          variants={fadeUp}
          className="space-y-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-sm font-bold tracking-wider uppercase backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
            Future-Ready Curriculum
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Building India&apos;s
            <br />
            <span className="text-accent-primary">Next Gen</span> of
            <br />
            Tech Innovators
          </h1>

          <p className="text-lg md:text-lg text-neutral-400 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Empowering students from Class 6-12 with cutting-edge tech skills,
            hands-on projects, and a futuristic curriculum designed for
            tomorrow&apos;s leaders.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link
              href="/student/courses"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-[#E5E5E5] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-center text-lg"
            >
              Explore Courses
            </Link>
            <Link href="#journey" className="w-full sm:w-auto px-8 py-4 bg-surface-200 text-white font-bold rounded-xl border border-border-default hover:bg-surface-300 transition-all flex items-center justify-center gap-2 group text-lg">
              <PlayCircle className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
              See How it Works
            </Link>
          </div>
        </motion.div>

        {/* Right Content / Graphic */}
        <motion.div
          variants={fadeUp}
          className="relative hidden lg:block h-125"
        >
          <div className="absolute inset-0 bg-surface-200 rounded-3xl border border-border-default overflow-hidden">
            {/* Using an abstract tech image as placeholder */}
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
              alt="Students collaborating"
              fill
              className="object-cover opacity-60 mix-blend-luminosity"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-xs font-medium text-neutral-500 tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-neutral-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
