"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  UploadCloud,
  X,
  File,
  CheckCircle2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

import { useApi } from "@/hooks/useApi";
import { coursesService } from "@/services/courses.service";
import { projectsService } from "@/services/projects.service";

import {
  toSubmissionCourse,
  toSubmissionProject,
  toSubmissionUnit,
} from "./data";

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

export default function ProjectSubmissionDetailView() {
  const { courseId, unitId, projectId } = useParams<{
    courseId: string;
    unitId: string;
    projectId: string;
  }>();

  const { data: apiCourse } = useApi(
    () => (courseId ? coursesService.findById(courseId) : Promise.resolve(null)),
    [courseId],
  );
  const { data: apiUnits } = useApi(
    () => (courseId ? coursesService.unitsByCourse(courseId) : Promise.resolve([])),
    [courseId],
  );
  const { data: apiProject } = useApi(
    () => (projectId ? projectsService.findById(projectId) : Promise.resolve(null)),
    [projectId],
  );
  const { data: mySubmissions, refetch: refetchSubmissions } = useApi(
    () => projectsService.mySubmissions({ pageSize: 100 }),
    [],
  );

  const course = apiCourse ? toSubmissionCourse(apiCourse) : null;
  const units = (apiUnits ?? []).map((u, idx) => toSubmissionUnit(u, idx));
  const unit = units.find((u) => u.id === unitId) ?? units[0];

  const latestSubmission = useMemo(() => {
    const forProject = (mySubmissions?.items ?? []).filter(
      (s) => s.projectId === projectId,
    );
    return forProject.sort(
      (a, b) =>
        new Date(b.submittedAt ?? 0).getTime() -
        new Date(a.submittedAt ?? 0).getTime(),
    )[0];
  }, [mySubmissions, projectId]);

  const project = apiProject
    ? toSubmissionProject(apiProject, latestSubmission ?? null)
    : null;

  const historyData = useMemo(
    () =>
      (mySubmissions?.items ?? []).map((sub) => ({
        courseUnit: `${course?.title ?? "Course"} • ${unit?.title ?? "Unit"}`,
        projectName: apiProject?.title ?? "Project",
        fileName: sub.fileUrls?.[0]?.split("/").pop() ?? "submission",
        dateTime: sub.submittedAt
          ? new Date(sub.submittedAt).toLocaleString()
          : "—",
        status:
          sub.status === "GRADED"
            ? "APPROVED"
            : sub.status === "RETURNED"
              ? "REVIEWED"
              : "PENDING",
      })),
    [mySubmissions, course, unit, apiProject],
  );

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isComplete =
    project?.status === "Submitted" ||
    project?.status === "Graded" ||
    submitSuccess;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: globalThis.File) => {
    setSelectedFile(file);
    setUploadProgress(0);
    // Fake upload progress animation
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15;
      if (prog >= 100) {
        setUploadProgress(100);
        clearInterval(interval);
      } else {
        setUploadProgress(Math.floor(prog));
      }
    }, 200);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const simulateSubmission = async () => {
    if (!selectedFile || !projectId) return;
    setIsSubmitting(true);
    try {
      await projectsService.submit(projectId, {
        fileUrls: [selectedFile.name],
        note: `Uploaded ${selectedFile.name}`,
      });
      await refetchSubmissions();
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Failed to submit project", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project || !course || !unit) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <p className="text-[#A1A1AA] text-sm">Loading project details…</p>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-6"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumbs */}
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-2 text-[13px] text-[#A1A1AA] font-medium flex-wrap mb-2"
      >
        <Link
          href="/student"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Home
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <Link
          href="/student/project-submission"
          className="hover:text-white transition-colors cursor-pointer"
        >
          Project Submission
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <Link
          href={`/student/project-submission/${courseId}`}
          className="hover:text-white transition-colors cursor-pointer"
        >
          {course.title.match(/Class\s*\d+/)?.[0] || course.title}
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <Link
          href={`/student/project-submission/${courseId}/${unitId}`}
          className="hover:text-white transition-colors cursor-pointer"
        >
          {unit.unitNumber}
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-[#F2F2F2] truncate max-w-50">
          {project.title}
        </span>
      </motion.div>

      {/* ── Completed Project Detail View ── */}
      {isComplete && (
        <>
          {/* Project Hero Banner */}
          <motion.div
            variants={fadeUp}
            className="bg-surface-200 border border-border-default rounded-xl overflow-hidden relative"
          >
            {/* Banner Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-200 via-surface-200/60 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${
                    project.status === "Graded"
                      ? "bg-success-500/20 text-success-500 ring-1 ring-success-500/30"
                      : "bg-accent-secondary/20 text-accent-secondary ring-1 ring-accent-secondary/30"
                  }`}
                >
                  <CheckCircle2 size={13} />
                  {project.status}
                </span>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6 pt-0 -mt-8 relative z-10 flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#F2F2F2] tracking-tight mb-2">
                  {project.title}
                </h2>
                <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-2xl">
                  {project.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                <div className="bg-surface-300 border border-border-default rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                    Status
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      project.status === "Graded"
                        ? "text-success-500"
                        : "text-accent-secondary"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="bg-surface-300 border border-border-default rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                    Deadline
                  </span>
                  <span className="text-sm font-bold text-[#F2F2F2]">
                    {project.deadline}
                  </span>
                </div>
                <div className="bg-surface-300 border border-border-default rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                    Submitted On
                  </span>
                  <span className="text-sm font-bold text-[#F2F2F2]">
                    {submitSuccess
                      ? new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Oct 10, 2024"}
                  </span>
                </div>
                {project.status === "Graded" && (
                  <div className="bg-surface-300 border border-border-default rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                      Grade
                    </span>
                    <span className="text-sm font-black text-success-500">
                      A+ (95/100)
                    </span>
                  </div>
                )}
                {project.status === "Submitted" && (
                  <div className="bg-surface-300 border border-border-default rounded-xl p-4 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                      Review
                    </span>
                    <span className="text-sm font-bold text-amber-400">
                      Pending
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Submitted File Card */}
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <h2 className="text-xl font-bold text-[#F2F2F2]">
              Submitted File
            </h2>
            <div className="bg-surface-200 border border-border-default rounded-xl p-5 flex items-center gap-4">
              <div className="p-3 bg-surface-300 text-[#F2F2F2] rounded-xl shrink-0 border border-border-default">
                <File size={24} />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-bold text-[#F2F2F2] text-[15px] truncate">
                  {project.title
                    .toLowerCase()
                    .replace(/\s+/g, "_")
                    .replace(/[^a-z0-9_]/g, "")}
                  _submission.pdf
                </span>
                <span className="text-[#A1A1AA] text-[13px] mt-0.5">
                  2.4 MB • Uploaded successfully
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1 text-xs font-bold text-success-500 bg-success-500/10 px-3 py-1.5 rounded-full ring-1 ring-success-500/20">
                  <CheckCircle2 size={13} />
                  Verified
                </span>
              </div>
            </div>
          </motion.div>

          {/* Teacher Feedback (only for Graded) */}
          {project.status === "Graded" && (
            <motion.div variants={fadeUp} className="flex flex-col gap-3">
              <h2 className="text-xl font-bold text-[#F2F2F2]">
                Teacher Feedback
              </h2>
              <div className="bg-surface-200 border border-border-default rounded-xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-300 rounded-full flex items-center justify-center text-sm font-bold text-[#F2F2F2] border border-border-default">
                    DR
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#F2F2F2]">
                      Dr. Rajesh Kumar
                    </span>
                    <span className="text-xs text-[#A1A1AA]">
                      Course Instructor
                    </span>
                  </div>
                </div>
                <div className="bg-surface-300 border border-border-default rounded-lg p-4">
                  <p className="text-sm text-[#A1A1AA] leading-relaxed italic">
                    &ldquo;Excellent work on this project! Your implementation
                    demonstrates a strong understanding of the core concepts.
                    The code is well-structured and the documentation is
                    thorough. Consider adding more edge case handling in the
                    next iteration.&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* ── Upload UI (only for Not Submitted projects) ── */}
      {!isComplete && (
        <>
          {/* Allowed Formats Banner */}
          <motion.div
            variants={fadeUp}
            className="bg-surface-200 border border-border-default rounded-xl p-6 relative overflow-hidden flex flex-col md:flex-row gap-6 items-center"
          >
            <div className="flex flex-col gap-3 flex-1 relative z-10 w-full">
              <div className="flex items-center gap-2 text-[#F2F2F2]">
                <CheckCircle size={18} className="text-accent-primary" />
                <h2 className="text-xl font-bold tracking-tight">
                  Allowed Formats
                </h2>
              </div>
              <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-xl">
                Please ensure your submission adheres to the following
                guidelines. Files exceeding the size limit will be automatically
                rejected.
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="px-3 py-1.5 bg-surface-300 rounded-full text-xs font-bold text-[#F2F2F2]">
                  PDF Document
                </span>
                <span className="px-3 py-1.5 bg-surface-300 rounded-full text-xs font-bold text-[#F2F2F2]">
                  JPG/PNG Images
                </span>
                <span className="px-3 py-1.5 bg-surface-300 rounded-full text-xs font-bold text-[#F2F2F2]">
                  MP4 Video
                </span>
                <span className="px-3 py-1.5 bg-accent-primary/10 text-accent-primary rounded-full text-xs font-bold">
                  Max 100MB
                </span>
              </div>
            </div>

            {/* Project Image (Right side) */}
            <div className="relative w-full md:w-56 h-32 rounded-lg overflow-hidden shrink-0 border border-white/5 z-10 hidden sm:block group">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-tr from-[#0F172A]/80 to-transparent mix-blend-overlay" />
            </div>
          </motion.div>

          {/* Upload Area */}
          <motion.div variants={fadeUp} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#F2F2F2]">
              Upload Your Files
            </h2>

            <div className="flex flex-col gap-4 bg-surface-200 border border-border-default rounded-xl p-6">
              {/* Drag and Drop Zone */}
              {!selectedFile ? (
                <div
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all duration-300 min-h-50 text-center ${
                    dragActive
                      ? "border-accent-primary bg-accent-primary/5"
                      : "border-border-default hover:border-white/20 hover:bg-surface-300/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                    accept=".zip,.pdf,.rar,.jpg,.png,.mp4"
                  />

                  <div className="w-14 h-14 bg-surface-300 border border-border-default rounded-full flex items-center justify-center mb-4 text-[#F2F2F2] shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    <UploadCloud size={24} />
                  </div>
                  <h3 className="text-[#F2F2F2] text-lg font-bold mb-1">
                    Drag and drop your project here
                  </h3>
                  <p className="text-sm text-[#A1A1AA] mb-4">
                    or click the button to browse your files
                  </p>

                  <button className="px-6 py-2.5 bg-[#F2F2F2] text-black font-bold rounded-lg pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center gap-2">
                    <UploadCloud size={16} strokeWidth={2.5} />
                    Browse Files
                  </button>
                </div>
              ) : (
                /* Selected File View */
                <div className="flex flex-col p-5 border border-border-default rounded-xl bg-surface-300 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4 z-10 relative gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="p-3 bg-surface-400 text-[#F2F2F2] rounded-xl shrink-0 border border-border-default">
                        <File size={24} />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-bold text-[#F2F2F2] text-[15px] truncate">
                          {selectedFile.name}
                        </span>
                        <span className="text-[#A1A1AA] text-[13px] mt-0.5">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                          {uploadProgress < 100 ? "Uploading..." : "Ready"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={removeFile}
                      className="text-[#A1A1AA] hover:text-white p-2 rounded-lg hover:bg-surface-400 transition-colors shrink-0"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="flex items-center gap-4 z-10 relative">
                    <div className="flex-1 h-3 bg-[#111111] rounded-full overflow-hidden flex border border-border-default/50">
                      <div
                        className="h-full bg-accent-primary transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-[#F2F2F2] w-12 text-right tracking-tight">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
              )}

              {/* Action */}
              <button
                onClick={simulateSubmission}
                disabled={!selectedFile || isSubmitting || uploadProgress < 100}
                className={`w-full py-4 mt-2 rounded-lg font-bold text-[15px] transition-all duration-300 flex items-center justify-center gap-2 ${
                  !selectedFile || isSubmitting || uploadProgress < 100
                    ? "bg-surface-300 text-[#888888] cursor-not-allowed"
                    : "bg-white text-black hover:bg-[#E5E5E5] shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-[#888888] border-t-transparent rounded-full animate-spin" />
                ) : null}
                {isSubmitting ? "Submitting..." : "Submit Project"}
              </button>
            </div>
          </motion.div>
        </>
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {submitSuccess && selectedFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSubmitSuccess(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-surface-200 border border-border-default rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-6 shadow-2xl z-10 overflow-hidden"
            >
              {/* Glow Behind Modal Icon */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-success-500/20 blur-[50px] rounded-full pointer-events-none" />

              <div className="w-20 h-20 bg-success-500/10 text-success-500 rounded-full flex items-center justify-center ring-4 ring-success-500/20 shadow-[0_0_30px_rgba(16,185,129,0.3)] relative z-10">
                <CheckCircle2 size={40} />
              </div>
              <div className="flex flex-col gap-2 z-10 w-full">
                <h3 className="text-2xl font-bold text-[#F2F2F2]">
                  Project Submitted!
                </h3>
                <p className="text-sm text-[#A1A1AA]">
                  Your project has been securely uploaded and is now awaiting
                  review by your instructor.
                </p>

                {/* Details Box */}
                <div className="mt-4 bg-surface-300 border border-border-default rounded-xl p-4 flex flex-col gap-3 text-left">
                  <div className="flex justify-between items-center pb-3 border-b border-border-default/50">
                    <span className="text-xs text-[#A1A1AA] font-bold tracking-wider uppercase">
                      File
                    </span>
                    <span className="text-sm font-semibold text-[#F2F2F2] max-w-50 truncate">
                      {selectedFile.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border-default/50">
                    <span className="text-xs text-[#A1A1AA] font-bold tracking-wider uppercase">
                      Date
                    </span>
                    <span className="text-sm font-semibold text-[#F2F2F2]">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#A1A1AA] font-bold tracking-wider uppercase">
                      Time
                    </span>
                    <span className="text-sm font-semibold text-[#F2F2F2]">
                      {new Date().toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full mt-2 z-10 flex gap-3">
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="flex-1 py-3 bg-white text-black hover:bg-[#E5E5E5] shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] rounded-lg font-bold text-sm transition-all"
                >
                  Return to Course
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submission History Table */}
      <motion.div variants={fadeUp} className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#F2F2F2]">
            Submission History
          </h2>
          <button className="text-sm font-bold text-accent-primary hover:text-accent-secondary transition-colors flex items-center gap-1">
            View all <ChevronRight size={14} />
          </button>
        </div>

        <div className="bg-surface-200 border border-border-default rounded-xl overflow-hidden w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-300/50 border-b border-border-default">
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] min-w-48">
                  COURSE & UNIT
                </th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] min-w-40">
                  PROJECT NAME
                </th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] min-w-40">
                  FILE NAME
                </th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] min-w-32">
                  DATE/TIME
                </th>
                <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((row, idx) => {
                let statusStyle = "";
                if (row.status === "APPROVED")
                  statusStyle =
                    "bg-success-500/10 text-success-500 ring-1 ring-success-500/20 shadow-success-900/10";
                else if (row.status === "REVIEWED")
                  statusStyle =
                    "bg-accent-secondary/10 text-accent-secondary ring-1 ring-accent-secondary/20 shadow-accent-secondary/10";
                else
                  statusStyle =
                    "bg-surface-300 text-[#F2F2F2] ring-1 ring-border-default";

                // Split course unit text
                const [course, unitText] = row.courseUnit.split(" • ");

                return (
                  <tr
                    key={idx}
                    className="border-b last:border-b-0 border-border-default hover:bg-surface-300/20 transition-colors"
                  >
                    <td className="py-4 px-4 align-top">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#F2F2F2]">
                          {course}
                        </span>
                        <span className="text-xs text-[#A1A1AA]">
                          {unitText}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="text-sm text-[#A1A1AA] font-medium">
                        {row.projectName}
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-1.5 text-sm text-[#3B82F6] font-medium hover:text-blue-400 cursor-pointer">
                        <div className="p-1 rounded bg-[#3B82F6]/10 text-[#3B82F6]">
                          <File size={12} />
                        </div>
                        {row.fileName}
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="text-sm text-[#A1A1AA]">
                        {row.dateTime}
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span
                        className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusStyle}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
