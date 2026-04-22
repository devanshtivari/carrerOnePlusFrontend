"use client";

import { motion } from "framer-motion";
import CodeEditorPreview from "./CodeEditorPreview";
import ChatInterface from "./ChatInterface";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
};

export default function AICodeAssistant() {
  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2"
      >
        <motion.h1 
          variants={fadeUp}
          className="text-white text-3xl font-bold tracking-tight"
        >
          AI Code Assistant
        </motion.h1>
        <motion.p 
          variants={fadeUp}
          className="text-[#A1A1AA] text-sm max-w-2xl"
        >
          Your personal AI coding tutor and live code playground. Write HTML, CSS, and JS, preview the results instantly, and ask the AI for help whenever you're stuck.
        </motion.p>
      </motion.div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[600px] h-[calc(100vh-12rem)] pb-6 overflow-hidden">
        {/* Left: Code Editor & Preview */}
        <div className="flex-1 min-w-0 h-full">
          <CodeEditorPreview />
        </div>

        {/* Right: AI Chat Interface */}
        <div className="h-full shrink-0">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
