"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  FolderOpen,
  Search,
  Users,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useApi } from "@/hooks/useApi";
import { assignmentsService } from "@/services/assignments.service";
import { classesService } from "@/services/classes.service";
import type { AssignmentItem } from "@/services/assignments.service";
import type { ClassMembership } from "@/services/classes.service";

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

function initialsOf(name?: string | null): string {
  if (!name) return "ST";
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function mapStatus(item: AssignmentItem): "Active" | "Past Due" | "Completed" {
  if (!item.dueAt) return "Active";
  const due = new Date(item.dueAt).getTime();
  if (Number.isNaN(due)) return "Active";
  if (due < Date.now()) return "Past Due";
  return "Active";
}

function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function ClassWorkspace({ classId }: { classId: string }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: classItem } = useApi(
    () => classesService.findById(classId),
    [classId],
  );
  const { data: memberships } = useApi(
    () => classesService.members(classId),
    [classId],
  );
  const { data: assignmentList } = useApi(
    () => assignmentsService.forClass(classId).catch(() => []),
    [classId],
  );

  const students = useMemo(() => {
    const list = (memberships ?? []).filter(
      (m: ClassMembership) => m.role === "STUDENT",
    );
    return list.map((m, idx) => ({
      id: m.userId,
      name: m.user?.fullName ?? "Unnamed Student",
      initials: m.user?.initials ?? initialsOf(m.user?.fullName),
      rollNo: `${(classItem?.code ?? "ST").toUpperCase()}-${String(idx + 1).padStart(2, "0")}`,
      completionPercent: Math.round(m.user?.attendance ?? 0),
      lastActive: m.user?.lastLoginAt
        ? new Date(m.user.lastLoginAt).toLocaleDateString()
        : "—",
    }));
  }, [memberships, classItem]);

  const assignments = useMemo(
    () =>
      (assignmentList ?? []).map((a) => ({
        id: a.id,
        title: a.title,
        dueDate: formatDate(a.dueAt),
        submittedCount: 0,
        totalStudents: students.length,
        status: mapStatus(a),
      })),
    [assignmentList, students.length],
  );

  if (!classItem) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col items-center justify-center h-full gap-4">
        <FolderOpen size={48} className="text-surface-400" />
        <h2 className="text-[#F2F2F2] text-xl font-bold">Loading class…</h2>
        <Link
          href="/teacher/projects"
          className="text-accent-primary text-sm font-bold hover:underline"
        >
          ← Back to Projects & Lab
        </Link>
      </div>
    );
  }

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8 h-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 text-[13px] text-[#A1A1AA] font-medium"
      >
        <Link
          href="/teacher"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Home
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <Link
          href="/teacher/projects"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Projects & Lab
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2]">{classItem.name}</span>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <Users size={24} className="text-[#A1A1AA]" />
          <h1 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight">
            {classItem.name} Workspace
          </h1>
        </div>
        <p className="text-[#A1A1AA] text-sm">
          Review active assignments and monitor individual student progress for{" "}
          {classItem.name}.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={stagger}
      >
        <motion.div
          variants={fadeUp}
          className="lg:col-span-2 flex flex-col gap-4"
        >
          <div className="relative group w-full">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] group-focus-within:text-white transition-colors"
            />
            <input
              type="text"
              placeholder="Search student by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-200 border border-border-default text-[#F2F2F2] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white focus:border-white placeholder:text-[#888888] transition-all"
            />
          </div>

          <div className="bg-surface-200 border border-border-default rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 border-b border-border-default p-4 bg-surface-100/50">
              <div className="col-span-4 text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest pl-2">
                Student
              </div>
              <div className="col-span-2 text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest text-center">
                Roll No
              </div>
              <div className="col-span-3 text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest text-center">
                Completion
              </div>
              <div className="col-span-2 text-[#A1A1AA] text-[10px] font-bold uppercase tracking-widest text-center hidden sm:block">
                Last Active
              </div>
              <div className="col-span-1" />
            </div>

            <div className="flex flex-col">
              {filteredStudents.map((student) => {
                const isHigh = student.completionPercent >= 80;
                const isMid =
                  student.completionPercent >= 50 &&
                  student.completionPercent < 80;
                const barColor = isHigh
                  ? "bg-accent-primary"
                  : isMid
                    ? "bg-accent-secondary"
                    : "bg-accent-critical";
                const textColor = isHigh
                  ? "text-accent-primary"
                  : isMid
                    ? "text-accent-secondary"
                    : "text-accent-critical";

                return (
                  <div
                    key={student.id}
                    onClick={() =>
                      router.push(
                        `/teacher/projects/class/${classId}/${student.id}`,
                      )
                    }
                    className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 last:border-b-0 hover:bg-surface-300 transition-colors group cursor-pointer items-center"
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="size-9 rounded-full bg-surface-300 border border-border-default flex items-center justify-center text-[#F2F2F2] text-xs font-bold leading-none shrink-0 group-hover:border-white/20 transition-colors">
                        {student.initials}
                      </div>
                      <span className="text-[#F2F2F2] font-semibold text-sm group-hover:text-white transition-colors truncate">
                        {student.name}
                      </span>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <span className="px-3 py-1 bg-surface-300/50 rounded-full text-[#A1A1AA] text-xs font-medium tracking-wide">
                        {student.rollNo}
                      </span>
                    </div>

                    <div className="col-span-3 flex items-center gap-2 justify-center">
                      <div className="w-16 h-1.5 bg-surface-400 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor}`}
                          style={{ width: `${student.completionPercent}%` }}
                        />
                      </div>
                      <span className={`font-bold text-xs ${textColor}`}>
                        {student.completionPercent}%
                      </span>
                    </div>

                    <div className="col-span-2 hidden sm:flex justify-center">
                      <span className="text-[#A1A1AA] text-xs">
                        {student.lastActive}
                      </span>
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <ChevronRight
                        size={16}
                        className="text-[#A1A1AA] group-hover:text-white group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  </div>
                );
              })}

              {filteredStudents.length === 0 && (
                <div className="p-10 text-center flex flex-col items-center justify-center gap-2">
                  <Search size={32} className="text-surface-400 mb-2" />
                  <span className="text-[#F2F2F2] font-semibold">
                    No students found
                  </span>
                  <span className="text-[#A1A1AA] text-sm">
                    Try adjusting your search query
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border-default flex items-center justify-between bg-surface-100/50">
              <span className="text-[#A1A1AA] text-xs">
                Showing {filteredStudents.length} of {students.length} students
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-1">
          <div className="bg-surface-200 border border-border-default rounded-xl p-5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-5">
              <ClipboardCheck size={18} className="text-[#A1A1AA]" />
              <h3 className="text-[#F2F2F2] text-base font-bold">
                Active Assignments
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {assignments.length === 0 && (
                <p className="text-[#A1A1AA] text-xs">
                  No assignments posted yet.
                </p>
              )}
              {assignments.map((a) => {
                const statusColor =
                  a.status === "Completed"
                    ? "bg-emerald-950/80 text-emerald-300"
                    : a.status === "Past Due"
                      ? "bg-red-950/80 text-red-300"
                      : "bg-surface-300 text-[#F2F2F2]";

                return (
                  <div
                    key={a.id}
                    className="p-4 rounded-lg bg-surface-300 border border-border-default flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-[#F2F2F2] text-sm font-semibold leading-tight">
                        {a.title}
                      </h4>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wide px-2.5 py-1 rounded-full shrink-0 ${statusColor}`}
                      >
                        {a.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-[#A1A1AA]">
                      <span>Due: {a.dueDate}</span>
                      <span className="font-semibold">
                        {a.submittedCount}/{a.totalStudents} submitted
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-400 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-primary rounded-full"
                        style={{
                          width: `${a.totalStudents === 0 ? 0 : (a.submittedCount / a.totalStudents) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
