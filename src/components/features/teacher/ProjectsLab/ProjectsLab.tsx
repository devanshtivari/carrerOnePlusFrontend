"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  Activity, 
  ChevronRight, 
  ArrowRight,
  Server
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useApi } from "@/hooks/useApi";
import { classesService } from "@/services/classes.service";
import { labsService } from "@/services/labs.service";
import { projectsService } from "@/services/projects.service";

import { toClassDetail, toLabStatus } from "./data";

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

export default function ProjectsLab() {
  const router = useRouter();

  const { data: labsData } = useApi(() => labsService.list({ pageSize: 10 }), []);
  const { data: classesData } = useApi(() => classesService.list({ pageSize: 20 }), []);
  const { data: projectsData } = useApi(() => projectsService.list({ pageSize: 100 }), []);

  const labStatus = (labsData?.items ?? []).map(toLabStatus);
  const classes = (classesData?.items ?? []).map((c) => toClassDetail(c, 0));

  const totalProjects = projectsData?.total ?? 0;
  const publishedProjects = (projectsData?.items ?? []).filter((p) => p.isPublished).length;

  const stats = [
    {
      id: "stat_1",
      label: "Total Active Projects",
      value: String(publishedProjects),
      subText: `${totalProjects} total`,
      subColor: "text-accent-primary",
      iconName: "FolderOpen",
    },
    {
      id: "stat_2",
      label: "Classes",
      value: String(classes.length),
      subText: "Active cohorts",
      subColor: "text-[#A1A1AA]",
      iconName: "CheckCircle",
    },
    {
      id: "stat_3",
      label: "Lab Environments",
      value: String(labStatus.length),
      subText: "Configured servers",
      subColor: "text-accent-secondary",
      iconName: "Clock",
    },
    {
      id: "stat_4",
      label: "Operational Labs",
      value: String(labStatus.filter((l) => l.status === "Available").length),
      subText: "Running smoothly",
      subColor: "text-accent-primary",
      iconName: "Activity",
    },
  ];

  const projectProgress = classes.slice(0, 4).map((c, idx) => ({
    id: c.id,
    gradeContent: c.className,
    progress: Math.max(30, Math.min(95, 40 + idx * 15)),
  }));

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-7xl mx-auto flex flex-col gap-8 h-full"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Top Header Row with Breadcrumbs */}
      {/* Breadcrumbs */}
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
        <span className="text-[#F2F2F2]">Projects & Lab</span>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold leading-tight">
          Projects & Lab Management
        </h1>
        <p className="text-[#A1A1AA] text-sm mt-1">
          Track cohort deliverables and monitor sandbox environment resource usage.
        </p>
      </motion.div>

      {/* Gradient Separator */}
      <motion.div variants={fadeUp}>
        <div className="w-full h-px bg-linear-to-r from-transparent via-zinc-700 to-transparent opacity-30" />
      </motion.div>

      {/* Stats Row */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={stagger}
      >
        {stats.map((stat, idx) => {
          const Icon = 
            stat.iconName === "FolderOpen" ? FolderOpen :
            stat.iconName === "CheckCircle" ? CheckCircle :
            stat.iconName === "Clock" ? Clock : Activity;
          return (
            <motion.div 
              key={idx} 
              variants={fadeUp} 
              className="bg-surface-200 border border-border-default rounded-xl p-5 relative group overflow-hidden hover:border-white/20 transition-all duration-300"
            >
              {/* Glass hover overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-2 relative z-10">
                <p className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <div className="p-1.5 rounded-md bg-surface-300 text-[#A1A1AA] group-hover:text-white transition-colors border border-border-default">
                  <Icon size={14} />
                </div>
              </div>
              <div className="flex items-baseline gap-2 relative z-10 mt-4">
                <h3 className="text-[#F2F2F2] text-3xl font-black tracking-tight">{stat.value}</h3>
              </div>
              {stat.subText && (
                <div className="mt-2 relative z-10">
                   <p className={`text-xs font-semibold ${stat.subColor || 'text-[#A1A1AA]'}`}>
                     {stat.subText}
                   </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Middle Content */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={stagger}
      >
        {/* Left Area: Project Progress Overview */}
        <motion.div 
          variants={fadeUp} 
          className="lg:col-span-2 bg-surface-200 border border-border-default rounded-xl p-6 group hover:border-white/10 transition-colors"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[#F2F2F2] text-lg font-bold">Project Progress Overview</h3>
            <button 
              onClick={() => router.push('/teacher/projects/progress')}
              className="text-[#A1A1AA] text-xs font-bold uppercase hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              See All <ArrowRight size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {projectProgress.map((prog, idx) => (
              <div key={prog.id} className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#F2F2F2] font-semibold">{prog.gradeContent}</span>
                  <span className="text-accent-primary font-black tracking-tight">{prog.progress}%</span>
                </div>
                {/* Progress Bar Track */}
                <div className="w-full h-2.5 bg-surface-400 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${prog.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 + (idx * 0.1) }}
                    className="h-full bg-accent-primary shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Area: Lab Resource Status */}
        <motion.div 
          variants={fadeUp} 
          className="lg:col-span-1 bg-surface-300 border border-border-default rounded-xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors"
        >
          {/* Subtle bloom behind for premium effect instead of standard purple */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 blur-[50px] pointer-events-none rounded-full" />
          
          <h3 className="text-[#F2F2F2] text-lg font-bold mb-6 relative z-10">Lab Resource Status</h3>
          
          <div className="flex flex-col gap-4 relative z-10">
            {labStatus.length === 0 && (
              <p className="text-[#A1A1AA] text-xs">No labs configured yet.</p>
            )}
            {labStatus.map((lab) => (
              <div 
                key={lab.id} 
                className="p-4 rounded-xl border bg-surface-200 border-border-default flex items-start gap-4 transition-all duration-300 group-hover:border-white/20"
              >
                <div className={`mt-0.5 shrink-0 ${lab.status === 'Available' ? 'text-accent-primary' : 'text-accent-secondary'}`}>
                  <Server size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-[#F2F2F2] text-sm font-bold">{lab.serverName}</h4>
                    <span className={`text-[10px] uppercase tracking-wide font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg ${
                      lab.status === 'Available' 
                        ? 'bg-emerald-950/80 text-emerald-300 shadow-emerald-900/20' 
                        : 'bg-amber-950/80 text-amber-300 shadow-amber-900/20'
                    }`}>
                      {lab.status}
                    </span>
                  </div>
                  <p className="text-[#A1A1AA] text-xs">{lab.uptime}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Area: Select Class */}
      <motion.div variants={fadeUp} className="flex flex-col gap-4">
        <h3 className="text-[#F2F2F2] text-lg font-bold">Select Class to View Details</h3>
        <p className="text-[#A1A1AA] text-xs mb-2">Deep dive into a particular class's active projects and recent lab sessions.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classes.length === 0 && (
            <p className="text-[#A1A1AA] text-xs col-span-full">No classes found.</p>
          )}
          {classes.map((cls) => (
            <motion.div 
              key={cls.id} 
              variants={fadeUp}
              onClick={() => router.push(`/teacher/projects/class/${cls.id}`)}
              className="bg-surface-200 border border-border-default rounded-xl p-5 flex flex-col justify-between group cursor-pointer hover:border-white/20 hover:bg-surface-300 transition-all duration-300 h-32"
            >
              <div className="flex justify-between items-start">
                <div className="bg-[#111] border border-border-default size-10 rounded-lg flex items-center justify-center text-[#F2F2F2] group-hover:text-white transition-colors">
                  <FolderOpen size={18} />
                </div>
                <ChevronRight size={18} className="text-[#A1A1AA] group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h4 className="text-[#F2F2F2] text-base font-bold">{cls.className}</h4>
                <p className="text-[#A1A1AA] text-xs mt-1">{cls.activeProjects} active projects</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
