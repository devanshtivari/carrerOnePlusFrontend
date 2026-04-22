"use client";

import React, { useState, useEffect } from "react";
import {
  Edit2,
  ShieldCheck,
  Trophy,
  BarChart2,
  Calendar,
  User,
  X,
  ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { profileData } from "./data";
import ChangePasswordSection from "./ChangePasswordSection";
import { authService } from "@/services/auth.service";

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

export function Profile() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ avatarUrl: "", bannerUrl: "", fullName: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const u = await authService.getCurrentUser();
        setCurrentUser(u);
        setEditForm({
          avatarUrl: u?.avatarUrl || "",
          bannerUrl: u?.bannerUrl || "",
          fullName: u?.fullName || "",
        });
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await authService.updateProfile({ 
        avatarUrl: editForm.avatarUrl, 
        bannerUrl: editForm.bannerUrl,
        fullName: editForm.fullName
      });
      setCurrentUser(updated);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = currentUser?.fullName || "";
  const displayRole = currentUser?.role || "Student";
  const avatarImage = currentUser?.avatarUrl;
  const bannerImage = currentUser?.bannerUrl;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 text-white">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="w-28 h-28 bg-surface-300 rounded-full" />
          <div className="h-6 w-48 bg-surface-300 rounded" />
          <div className="h-4 w-32 bg-surface-300 rounded" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-brand-bg text-[#f0f0f0] p-6 lg:p-10 font-sans"
      variants={stagger}
      initial="hidden"
      animate="visible"
    >
      {/* Main Profile Card Container */}
      <motion.div
        variants={fadeUp}
        className="max-w-6xl mx-auto bg-surface-100 border border-border-default rounded-3xl overflow-hidden shadow-2xl relative"
      >
        {/* Banner */}
        <div 
          className="h-40 sm:h-48 relative border-b border-border-default bg-surface-300"
          style={bannerImage ? { backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          {!bannerImage && (
            <div className="absolute inset-0 bg-linear-to-r from-surface-300 to-surface-400">
               <div className="absolute inset-0 bg-white/5 blur-[80px] pointer-events-none" />
            </div>
          )}
        </div>

        {/* Content Wrapper inside Card */}
        <div className="px-6 sm:px-10 pb-10">
          {/* Profile Header Row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 mb-10 gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
              {/* Avatar */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[6px] border-surface-100 bg-surface-200 flex items-center justify-center shrink-0 overflow-hidden relative shadow-lg z-10">
                {avatarImage ? (
                  <img src={avatarImage} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-[#888888]" />
                )}
              </div>

              {/* Name & Role */}
              <div className="mb-2 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {displayName}
                </h1>
                <p className="text-accent-primary text-base font-medium mt-1 uppercase">
                  {displayRole}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 bg-white text-black rounded-full font-bold text-sm hover:bg-[#e5e5e5] transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] mb-2 sm:mb-4 cursor-pointer"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>

          <hr className="border-border-default mb-10" />

          {/* Grid Layout for details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Personal Information & Settings */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-3 mb-6"
              >
                <User className="w-5 h-5 text-accent-primary" />
                <h2 className="text-xl font-bold text-white">
                  Personal Information
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  variants={fadeUp}
                  className="bg-surface-200 border border-border-default rounded-2xl p-6 hover:border-white/20 transition-colors group relative overflow-hidden"
                >
                  <p className="text-[#888888] text-xs font-semibold uppercase tracking-wider mb-2">
                    School Name
                  </p>
                  <p className="text-white font-medium text-lg">
                    {currentUser?.schoolName || "Not provided"}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="bg-surface-200 border border-border-default rounded-2xl p-6 hover:border-white/20 transition-colors group relative overflow-hidden"
                >
                  <p className="text-[#888888] text-xs font-semibold uppercase tracking-wider mb-2">
                    Email ID
                  </p>
                  <p className="text-white font-medium text-lg">
                    {currentUser?.email || "Not provided"}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="bg-surface-200 border border-border-default rounded-2xl p-6 hover:border-white/20 transition-colors group relative overflow-hidden"
                >
                  <p className="text-[#888888] text-xs font-semibold uppercase tracking-wider mb-2">
                    Class
                  </p>
                  <p className="text-white font-medium text-lg">
                    {currentUser?.grade || "Not provided"}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="bg-surface-200 border border-border-default rounded-2xl p-6 hover:border-white/20 transition-colors group relative overflow-hidden"
                >
                  <p className="text-[#888888] text-xs font-semibold uppercase tracking-wider mb-2">
                    Age
                  </p>
                  <p className="text-white font-medium text-lg">
                    {currentUser?.age || "Not provided"}
                  </p>
                </motion.div>
              </div>

              {/* Account Status Badge */}
              <motion.div
                variants={fadeUp}
                className="mt-8 bg-surface-200 border border-dashed border-border-default rounded-2xl p-6 flex items-start gap-4 hover:border-white/20 transition-colors"
              >
                <div className="bg-surface-300 p-3 rounded-xl border border-border-default">
                  <ShieldCheck className="w-6 h-6 text-accent-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1">
                    Account Status
                  </h3>
                  <p className="text-[#888888] text-sm">
                    {profileData.statusMessage}
                  </p>
                </div>
              </motion.div>

              {/* Password Settings Included Here */}
              <ChangePasswordSection />

            </div>

            {/* Right Column: Academic Stats */}
            <div className="space-y-6 lg:border-l lg:border-border-default lg:pl-10">
              <motion.div
                variants={fadeUp}
                className="flex items-center gap-3 mb-6"
              >
                <BarChart2 className="w-5 h-5 text-accent-primary" />
                <h2 className="text-xl font-bold text-white">Academic Stats</h2>
              </motion.div>

              <div className="space-y-4">
                {/* Stat Cards */}
                <motion.div
                  variants={fadeUp}
                  className="bg-surface-200 border border-border-default rounded-2xl p-5 flex items-center justify-between hover:border-white/20 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-surface-300 w-12 h-12 rounded-xl flex items-center justify-center border border-border-default group-hover:border-white/20 transition-colors">
                      <Trophy className="w-5 h-5 text-accent-secondary" />
                    </div>
                    <div>
                      <p className="text-[#888888] text-xs font-semibold uppercase tracking-wider mb-1">
                        Total Score
                      </p>
                      <p className="text-2xl font-black text-white">
                        {currentUser?.totalScore ?? 0}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="bg-surface-200 border border-border-default rounded-2xl p-5 flex items-center justify-between hover:border-white/20 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-surface-300 w-12 h-12 rounded-xl flex items-center justify-center border border-border-default group-hover:border-white/20 transition-colors">
                      <BarChart2 className="w-5 h-5 text-accent-primary" />
                    </div>
                    <div>
                      <p className="text-[#888888] text-xs font-semibold uppercase tracking-wider mb-1">
                        Rank
                      </p>
                      <p className="text-2xl font-black text-white">
                        {currentUser?.rank ?? "Unranked"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="bg-surface-200 border border-border-default rounded-2xl p-5 flex items-center justify-between hover:border-white/20 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-surface-300 w-12 h-12 rounded-xl flex items-center justify-center border border-border-default group-hover:border-white/20 transition-colors">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[#888888] text-xs font-semibold uppercase tracking-wider mb-1">
                        Attendance
                      </p>
                      <p className="text-2xl font-black text-white">
                        {currentUser?.attendance ?? "0%"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Academic Progress */}
                <motion.div
                  variants={fadeUp}
                  className="bg-surface-200 border border-border-default rounded-2xl p-6 relative overflow-hidden"
                >
                  <h3 className="text-white font-bold mb-4">
                    Academic Progress
                  </h3>
                  <div className="h-2 w-full bg-surface-400 rounded-full overflow-hidden mb-4 relative">
                    <div className="absolute top-0 bottom-0 left-0 bg-white rounded-full w-[85%] overflow-hidden">
                      <div className="absolute inset-0 bg-linear-to-r from-transparent to-white/30" />
                    </div>
                  </div>
                  <p className="text-[#888888] text-sm leading-relaxed">
                    You are performing better than{" "}
                    <strong className="text-white font-semibold">
                      {currentUser?.percentile ?? "0%"}
                    </strong>{" "}
                    of your class.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0F0F0F] border border-border-default rounded-2xl overflow-hidden shadow-2xl z-10"
            >
              <div className="flex items-center justify-between p-6 border-b border-border-default">
                <h3 className="text-xl font-bold text-white">Edit Profile Details</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-[#888888] hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-zinc-400 mb-1.5 flex items-center gap-2">
                    <User size={16} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm(prev => ({...prev, fullName: e.target.value}))}
                    placeholder="E.g., Alex Johnson"
                    className="w-full h-12 bg-surface-200 text-white border border-border-default rounded-xl px-4 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-400 mb-1.5 flex items-center gap-2">
                    <ImageIcon size={16} /> Avatar URL
                  </label>
                  <input
                    type="url"
                    value={editForm.avatarUrl}
                    onChange={(e) => setEditForm(prev => ({...prev, avatarUrl: e.target.value}))}
                    placeholder="https://example.com/avatar.png"
                    className="w-full h-12 bg-surface-200 text-white border border-border-default rounded-xl px-4 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-400 mb-1.5 flex items-center gap-2">
                    <ImageIcon size={16} /> Banner URL
                  </label>
                  <input
                    type="url"
                    value={editForm.bannerUrl}
                    onChange={(e) => setEditForm(prev => ({...prev, bannerUrl: e.target.value}))}
                    placeholder="https://example.com/banner.png"
                    className="w-full h-12 bg-surface-200 text-white border border-border-default rounded-xl px-4 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all text-sm"
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 h-10 bg-transparent text-[#888888] hover:text-white font-semibold text-sm rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 h-10 bg-white hover:bg-[#E5E5E5] text-black font-semibold text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
