"use client";

import { motion } from "framer-motion";

import { fadeUp } from "./data";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="py-24 bg-surface-100 border-t border-border-default relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-accent-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div
          variants={fadeUp}
          className="bg-surface-200 border border-border-default rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Get in Touch
            </h2>
            <p className="text-sm text-neutral-400">
              Have questions? We&apos;re here to help.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-surface-300 border border-border-default rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-surface-300 border border-border-default rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Subject
              </label>
              <select className="w-full bg-surface-300 border border-border-default rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all appearance-none cursor-pointer">
                <option value="course">Course Inquiry</option>
                <option value="partnership">School Partnership</option>
                <option value="support">Technical Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Message
              </label>
              <textarea
                placeholder="How can we help you?"
                rows={4}
                className="w-full bg-surface-300 border border-border-default rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-[#E5E5E5] transition-all hover:scale-[1.01] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-lg mt-4"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
