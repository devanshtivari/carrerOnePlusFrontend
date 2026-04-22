"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

import { fadeUp } from "./data";

/** Animate a number from 0 → target when `start` becomes true */
function useCountUp(target: number, duration = 1.6, start = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    let raf: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // ease-out cubic for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}

export default function AboutSection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(statsRef, { once: true, margin: "-80px" });

  const studentsCount = useCountUp(500, 1.8, isInView);
  const schoolsCount = useCountUp(3, 1.2, isInView);

  return (
    <section id="about" className="py-24 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div variants={fadeUp} className="relative h-100 lg:h-125">
          <div className="absolute inset-0 rounded-3xl overflow-hidden border border-border-default shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
              alt="Career1Plus team"
              fill
              className="object-cover opacity-80"
            />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Fostering <span className="text-accent-primary">Innovation</span>{" "}
            Since 2024
          </h2>
          <div className="space-y-6 text-base text-neutral-400 leading-relaxed">
            <p>
              Career1Plus started with a simple mission: to make high-end
              technology education accessible to every school student in India.
              We believe that innovation shouldn&apos;t be limited by geography
              or resources.
            </p>
            <p>
              Our platform bridges the gap between traditional academics and the
              rapidly evolving tech industry, ensuring that students aren&apos;t
              just consumers of technology, but its creators.
            </p>
          </div>

          <div
            ref={statsRef}
            className="grid grid-cols-2 gap-8 pt-8 border-t border-border-default"
          >
            <div>
              <p className="text-4xl font-black text-white mb-1 tabular-nums">
                {studentsCount}
                <span className="text-accent-primary">+</span>
              </p>
              <p className="text-sm text-neutral-500 font-bold uppercase tracking-wider">
                Active Students
              </p>
            </div>
            <div>
              <p className="text-4xl font-black text-white mb-1 tabular-nums">
                {schoolsCount}
              </p>
              <p className="text-sm text-neutral-500 font-bold uppercase tracking-wider">
                Partner Schools
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
