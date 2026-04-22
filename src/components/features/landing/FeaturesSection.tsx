"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { resolveIcon } from "@/lib/icons";
import { contentService } from "@/services/content.service";
import type { LandingFeatureContent } from "@/services/types";

import { fadeUp, features as fallbackFeatures } from "./data";

const FALLBACK: LandingFeatureContent[] = fallbackFeatures.map((f) => ({
  iconName: f.icon.displayName ?? "BookOpen",
  title: f.title,
  description: f.description,
}));

export default function FeaturesSection() {
  const [features, setFeatures] = useState<LandingFeatureContent[]>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    contentService
      .landing()
      .then((res) => {
        if (!cancelled && Array.isArray(res.features)) {
          setFeatures(res.features);
        }
      })
      .catch(() => {
        // keep fallback
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-24 bg-brand-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div variants={fadeUp} className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Why Choose Career1Plus?
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-base">
            Experience a premium learning ecosystem designed specifically for the modern student.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = resolveIcon(feature.iconName);
            return (
              <motion.div
                key={index}
                variants={fadeUp}
                className="p-8 bg-surface-200 border border-border-default rounded-3xl group cursor-pointer hover:border-white/20 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="w-14 h-14 rounded-2xl bg-surface-300 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-border-default">
                  <Icon className="w-6 h-6 text-accent-primary" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
