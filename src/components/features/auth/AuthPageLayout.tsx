"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  dividerText: string;
  image: { src: string; alt: string };
  avatars: { src: string; alt: string }[];
  leftTitle: string;
  leftDescription: string;
  showSocialAuth?: boolean;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const GoogleIcon = () => (
  <svg aria-hidden="true" className="h-4 w-4" opacity="0.8" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export default function AuthPageLayout({
  children,
  dividerText,
  image,
  avatars,
  leftTitle,
  leftDescription,
  showSocialAuth = true,
}: Props) {
  return (
    <motion.div
      className="w-full max-w-5xl bg-surface-200 rounded-4xl shadow-2xl border border-border-default relative z-10 flex flex-col md:flex-row overflow-hidden"
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Left Panel (Promo Area) */}
      <motion.div
        variants={fadeUp}
        className="hidden md:flex flex-col justify-between w-1/2 bg-[#0F0F0F] border-r border-border-default p-10 lg:p-12 relative overflow-hidden group"
      >
        {/* Decorative blur backdrop */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-30%] left-[-20%] w-[160%] h-[160%] bg-linear-to-br from-white/5 to-transparent rounded-full blur-[80px]" />
        </div>

        <motion.div
          className="relative z-10 flex flex-col gap-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeUp}
            className="w-12 h-12 bg-surface-300 border border-border-default rounded-xl flex items-center justify-center text-white"
          >
            <GraduationCap size={24} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#F2F2F2] leading-tight tracking-tight mb-4">
              {leftTitle}
            </h1>
            <p className="text-[#A1A1AA] text-sm lg:text-base leading-relaxed">
              {leftDescription}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="relative z-10 mt-8 flex-1 flex flex-col justify-center"
        >
          <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border border-border-default shadow-lg max-h-70">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#0F0F0F]/80 to-transparent z-10 rounded-b-2xl pointer-events-none" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />

            {/* Floating Widget */}
            <div className="absolute bottom-4 left-4 z-20 bg-surface-200/80 backdrop-blur-md border border-border-default rounded-full p-2 pr-4 pl-3 flex items-center shadow-xl">
              <div className="flex -space-x-3 mr-3">
                {avatars.map((avatar, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={i}
                    className="w-7 h-7 rounded-full border border-surface-200 object-cover"
                    src={avatar.src}
                    alt={avatar.alt}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#A1A1AA]">
                Trusted by <span className="text-[#F2F2F2]">500+</span> learners
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Panel (Form Area) */}
      <motion.div
        variants={stagger}
        className="w-full md:w-1/2 p-8 lg:px-12 flex flex-col justify-center overflow-y-auto"
      >
        <motion.div variants={fadeUp}>{children}</motion.div>

        {showSocialAuth && (
          <>
            <motion.div
              variants={fadeUp}
              className="relative flex items-center py-6 mt-2"
            >
              <div className="grow border-t border-border-default" />
              <span className="shrink-0 mx-4 text-xs font-medium text-zinc-600">
                {dividerText}
              </span>
              <div className="grow border-t border-border-default" />
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-4">
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/google`}
                className="flex-1 h-12 bg-[#0F0F0F] hover:bg-surface-200 border border-border-default text-[#A1A1AA] hover:text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 group cursor-pointer no-underline"
              >
                <GoogleIcon />
                <span className="group-hover:text-[#F2F2F2] transition-colors">
                  Google
                </span>
              </a>

              <a
                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/github`}
                className="flex-1 h-12 bg-[#0F0F0F] hover:bg-surface-200 border border-border-default text-[#A1A1AA] hover:text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 group cursor-pointer no-underline"
              >
                <GitHubIcon />
                <span className="group-hover:text-[#F2F2F2] transition-colors">
                  GitHub
                </span>
              </a>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
