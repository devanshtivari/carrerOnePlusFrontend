"use client";

import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { motion } from "framer-motion";

export default function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all password fields." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      setIsSaving(true);
      await authService.changePassword({ currentPassword, newPassword, confirmPassword });
      setMessage({ type: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to change password. Make sure your current password is correct.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderPasswordField = (
    label: string,
    value: string,
    setValue: (val: string) => void,
    show: boolean,
    setShow: (val: boolean) => void
  ) => (
    <div>
      <label className="text-sm font-medium text-[#888888] mb-1.5 flex items-center gap-2">
        <Lock size={16} /> {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-12 bg-surface-300 text-white border border-border-default rounded-xl pl-4 pr-12 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all text-sm"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white transition-colors cursor-pointer"
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <motion.form 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      onSubmit={handleSave} 
      className="mt-8 bg-surface-200 border border-border-default rounded-2xl p-6 hover:border-white/20 transition-colors"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-surface-300 p-3 rounded-xl border border-border-default">
          <Lock className="w-6 h-6 text-accent-secondary" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg mb-1">Security Settings</h3>
          <p className="text-[#888888] text-sm">Update your account password</p>
        </div>
      </div>

      <div className="space-y-4">
        {renderPasswordField("Current Password", currentPassword, setCurrentPassword, showCurrent, setShowCurrent)}
        
        <div className="h-px w-full bg-border-default my-4"></div>
        
        {renderPasswordField("New Password", newPassword, setNewPassword, showNew, setShowNew)}
        {renderPasswordField("Confirm New Password", confirmPassword, setConfirmPassword, showNew, setShowNew)}
      </div>

      {message.text && (
        <p
          className={`text-sm mt-4 font-medium ${
            message.type === "success" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 h-10 bg-white hover:bg-[#e5e5e5] text-black font-bold text-sm rounded-full transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Updating..." : "Update Password"}
        </button>
      </div>
    </motion.form>
  );
}
