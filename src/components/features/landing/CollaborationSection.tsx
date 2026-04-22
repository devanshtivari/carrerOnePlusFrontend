"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import { contentService } from "@/services/content.service";
import type { LandingCollabContent } from "@/services/types";

import { fadeUp, collaborateFeatures as fallbackCollab } from "./data";

const FALLBACK: LandingCollabContent[] = fallbackCollab.map((c) => ({
  title: c.title,
  description: c.desc,
}));

export default function CollaborationSection() {
  const [collaborateFeatures, setCollabFeatures] =
    useState<LandingCollabContent[]>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    contentService
      .landing()
      .then((res) => {
        if (!cancelled && Array.isArray(res.collaboration)) {
          setCollabFeatures(res.collaboration);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="schools"
      className="py-24 bg-surface-200 relative overflow-hidden"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-accent-primary/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div variants={fadeUp} className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-300 border border-border-default text-neutral-300 text-sm font-bold tracking-wider uppercase">
            Institution Collaboration
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Empower Your Students with Career1Plus
          </h2>
          <p className="text-base text-neutral-400 max-w-2xl mx-auto">
            Partner with India&apos;s leading tech education platform to
            integrate a futuristic curriculum into your school&apos;s ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {collaborateFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="p-8 bg-surface-100 border border-border-default rounded-3xl group cursor-pointer hover:border-accent-primary/30 transition-all duration-300 text-center"
            >
              <h3 className="text-white font-bold text-xl mb-3">
                {feature.title}
              </h3>
              <p className="text-neutral-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="text-center">
          <Link
            href="#contact"
            className="inline-block px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-[#E5E5E5] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-lg"
          >
            Partner with Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
