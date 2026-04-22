"use client";

import { motion, Variants } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import {
  HeroSection,
  FeaturesSection,
  JourneySection,
  FeaturedCoursesSection,
  AnalyticsSection,
  CollaborationSection,
  AboutSection,
  ContactSection,
} from "@/components/features/landing";

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <motion.main
        className="min-h-screen bg-brand-bg relative overflow-hidden selection:bg-white selection:text-black"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <HeroSection />
        <FeaturesSection />
        <JourneySection />
        <FeaturedCoursesSection />
        <AnalyticsSection />
        <CollaborationSection />
        <AboutSection />
        <ContactSection />
      </motion.main>
      <Footer />
    </>
  );
}
