"use client";

import { KeyRound, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import type { InputFieldProps } from "../LoginForm/types";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [focusedField, setFocusedField] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!emailParam) {
      setErrorMessage("No email provided. Please start the password recovery process again.");
    }
  }, [emailParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!emailParam) {
      setErrorMessage("Invalid request. Missing email.");
      return;
    }

    const newErrorFields: string[] = [];

    if (!otp) newErrorFields.push("otp");
    if (!newPassword) newErrorFields.push("newPassword");
    if (!confirmPassword) newErrorFields.push("confirmPassword");

    if (newErrorFields.length > 0) {
      setErrorFields(newErrorFields);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorFields([...errorFields, "confirmPassword"]);
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      await authService.resetPassword({
        email: emailParam,
        otp,
        newPassword,
        confirmPassword,
      });
      setSuccessMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Failed to reset password. Check your OTP."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!emailParam) return;

    try {
      setIsResending(true);
      setErrorMessage("");
      setSuccessMessage("");
      await authService.resendOtp({ email: emailParam, type: "RESET_PASSWORD" });
      setSuccessMessage("A new OTP has been sent to your email.");
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Failed to resend OTP. Try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  // Reused field renderer specifically adapted for this component.
  const renderField = ({
    id,
    label,
    icon: Icon,
    value,
    setValue,
    type = "text",
    isPassword,
    showPwd,
    setShowPwd,
  }: InputFieldProps & { isPassword?: boolean; showPwd?: boolean; setShowPwd?: (v: boolean) => void }) => {
    const isFloating = focusedField === id || value !== "";
    const hasError = errorFields.includes(id);
    const isFocused = focusedField === id;

    const borderColor = hasError
      ? "border-white focus:border-white ring-1 ring-white shadow-[inset_0_0_15px_rgba(255,255,255,0.15)]"
      : "border-border-default focus:border-white focus:ring-1 focus:ring-white";

    const labelColor = isFocused ? "text-white" : "text-zinc-500";
    const iconColor = isFocused ? "text-white" : "text-[#A1A1AA]";

    return (
      <div className="relative group w-full flex-1">
        <span
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 pointer-events-none ${iconColor}`}
        >
          {Icon && <Icon size={20} />}
        </span>
        <label
          htmlFor={id}
          className={`absolute left-11 transition-all z-10 pointer-events-none ${
            isFloating ? "top-1.5 text-[10px]" : "top-1/2 -translate-y-1/2 text-sm"
          } ${labelColor}`}
        >
          {label}
        </label>
        <input
          id={id}
          type={isPassword && !showPwd ? "password" : type}
          value={value}
          onFocus={() => setFocusedField(id)}
          onBlur={() => setFocusedField("")}
          onChange={(e) => {
            setValue(e.target.value);
            if (hasError) setErrorFields(errorFields.filter((f) => f !== id));
          }}
          className={`w-full h-13 bg-[#0F0F0F] text-[#F2F2F2] border rounded-lg pl-11 ${
            isPassword ? "pr-12" : "pr-4"
          } pt-4 pb-1 focus:outline-none transition-all text-sm ${borderColor}`}
          autoComplete="off"
        />
        {isPassword && setShowPwd && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer z-10"
          >
            {showPwd ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
    );
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        {renderField({
          id: "otp",
          label: "Verification Code (OTP)",
          icon: KeyRound,
          value: otp,
          setValue: setOtp,
        })}
        <div className="flex justify-end pr-1 mt-0.5">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || !emailParam}
            className="text-xs font-medium text-[#A1A1AA] hover:text-white transition-colors hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
          >
            {isResending ? "Resending..." : "Resend Code"}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {renderField({
          id: "newPassword",
          label: "New Password",
          icon: Lock,
          isPassword: true,
          value: newPassword,
          setValue: setNewPassword,
          showPwd: showPassword,
          setShowPwd: setShowPassword,
        })}

        {renderField({
          id: "confirmPassword",
          label: "Confirm Password",
          icon: Lock,
          isPassword: true,
          value: confirmPassword,
          setValue: setConfirmPassword,
          showPwd: showConfirmPassword,
          setShowPwd: setShowConfirmPassword,
        })}
      </div>

      {errorMessage && <p className="text-xs text-red-500 text-center mt-1">{errorMessage}</p>}
      {successMessage && <p className="text-xs text-emerald-400 text-center mt-1">{successMessage}</p>}

      <button
        className="w-full h-12 mt-2 bg-white hover:bg-[#E5E5E5] text-black font-bold text-sm rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={isLoading || !emailParam}
      >
        <span>{isLoading ? "Resetting..." : "Reset Password"}</span>
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
