"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import EmptyState from "@/components/shared/EmptyState";
import { useApi } from "@/hooks/useApi";
import { testsService } from "@/services/tests.service";

import TestInfoCard from "./TestInfoCard";
import { toTestInfo } from "./data";
import { useTestPrerequisites } from "./usePrerequisites";
import type { TestInfo } from "./types";

// NOTE:
// Earlier versions of this file used framer-motion's variant-propagation
// pattern (parent `variants={stagger}` + grandchild `variants={fadeUp}`).
// Under Next.js 15 + React 19 that pattern occasionally left the test
// cards stuck at `opacity: 0` even though the API had returned data and
// the `.map()` ran in the console. Using explicit `initial`/`animate`
// props per motion element sidesteps the variant plumbing entirely and
// is still visually staggered thanks to `transition.delay`.

const sectionFade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function TestDashboard() {
  const router = useRouter();
  const { data, loading, error } = useApi(
    () => testsService.list({ pageSize: 50 }),
    [],
  );

  const handleStartTest = (testId: string) => {
    router.push(`/student/tests/${testId}`);
  };

  const rawTests = (data?.items ?? []).map(toTestInfo);
  const { map: prereqMap } = useTestPrerequisites(
    rawTests.map((t) => t.courseId ?? null),
  );

  // Stitch prerequisite + unlock state onto each card. Completed tests are
  // always considered unlocked — locking after the fact would hide scores.
  const tests: TestInfo[] = rawTests.map((t) => {
    if (!t.courseId || t.status === "Completed") {
      return { ...t, unlocked: true };
    }
    const record = prereqMap[t.courseId];
    if (!record) return t;
    return {
      ...t,
      prerequisite: record.completed ? undefined : record.prerequisite,
      unlocked: record.completed,
    };
  });

  const liveTests = tests.filter((t) => t.status === "Live");
  const upcomingTests = tests.filter((t) => t.status === "Upcoming");
  const completedTests = tests.filter((t) => t.status === "Completed");

  const renderCardGroup = (list: TestInfo[], baseDelay: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {list.map((test, i) => (
        <motion.div
          key={test.id}
          initial={sectionFade.initial}
          animate={sectionFade.animate}
          transition={{
            duration: 0.4,
            delay: baseDelay + i * 0.06,
            ease: "easeOut",
          }}
        >
          <TestInfoCard test={test} onStartTest={handleStartTest} />
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Breadcrumbs */}
      <motion.div
        initial={sectionFade.initial}
        animate={sectionFade.animate}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-2 text-[13px] text-[#A1A1AA] font-medium"
      >
        <Link
          href="/student"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Home
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2]">Tests</span>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={sectionFade.initial}
        animate={sectionFade.animate}
        transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 mb-1">
          <ClipboardList size={24} className="text-[#A1A1AA]" />
          <h1 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight">
            Assessments & Tests
          </h1>
        </div>
        <p className="text-[#A1A1AA] text-sm">
          View your upcoming tests, enter test codes, and track your assessment
          history.
        </p>
      </motion.div>

      {/* Gradient Separator */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />

      {loading && (
        <p className="text-[#A1A1AA] text-sm">Loading your tests…</p>
      )}
      {error && !loading && (
        <p className="text-accent-critical text-sm">
          Unable to load tests. Please try again later.
        </p>
      )}
      {!loading && !error && tests.length === 0 && (
        <motion.div
          initial={sectionFade.initial}
          animate={sectionFade.animate}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <EmptyState
            icon={ClipboardList}
            title="No tests scheduled yet"
            description="Your teacher hasn't published any tests for you just yet. Once they do, you'll see live, upcoming, and completed assessments here."
            action={{ label: "Back to dashboard", href: "/student" }}
            secondaryAction={{ label: "Browse courses", href: "/student/courses" }}
          />
        </motion.div>
      )}

      {/* Live Tests */}
      {liveTests.length > 0 && (
        <motion.div
          initial={sectionFade.initial}
          animate={sectionFade.animate}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-[#F2F2F2] text-lg font-bold">Live Now</h2>
          </div>
          {renderCardGroup(liveTests, 0.15)}
        </motion.div>
      )}

      {/* Upcoming Tests */}
      {upcomingTests.length > 0 && (
        <motion.div
          initial={sectionFade.initial}
          animate={sectionFade.animate}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        >
          <h2 className="text-[#F2F2F2] text-lg font-bold mb-4">Upcoming</h2>
          {renderCardGroup(upcomingTests, 0.2)}
        </motion.div>
      )}

      {/* Completed Tests */}
      {completedTests.length > 0 && (
        <motion.div
          initial={sectionFade.initial}
          animate={sectionFade.animate}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        >
          <h2 className="text-[#F2F2F2] text-lg font-bold mb-4">Completed</h2>
          {renderCardGroup(completedTests, 0.25)}
        </motion.div>
      )}

      {/* Footer */}
      <motion.div
        initial={sectionFade.initial}
        animate={sectionFade.animate}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
        className="mt-6 text-center"
      >
        <p className="text-[#A1A1AA] text-sm">
          Need help with a test?{" "}
          <button className="text-[#F2F2F2] font-semibold hover:underline underline-offset-4 cursor-pointer">
            Contact your instructor
          </button>
        </p>
      </motion.div>
    </div>
  );
}
