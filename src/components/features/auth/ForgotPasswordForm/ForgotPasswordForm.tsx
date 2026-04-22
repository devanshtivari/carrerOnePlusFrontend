"use client";

import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import type { InputFieldProps } from "../LoginForm/types";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [focusedField, setFocusedField] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorFields(["email"]);
      return;
    }

    try {
      setIsLoading(true);
      await authService.forgotPassword({ email });
      setSuccessMessage("If this email is registered, an OTP has been sent. Please check your inbox.");
      // Redirect to reset password page with email param
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Failed to initiate password reset. Try again."
      );
      setErrorFields(["email"]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = ({
    id,
    label,
    icon: Icon,
    value,
    setValue,
    type = "text",
  }: InputFieldProps) => {
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
            isFloating
              ? "top-1.5 text-[10px]"
              : "top-1/2 -translate-y-1/2 text-sm"
          } ${labelColor}`}
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          value={value}
          onFocus={() => setFocusedField(id)}
          onBlur={() => setFocusedField("")}
          onChange={(e) => {
            setValue(e.target.value);
            if (hasError) setErrorFields(errorFields.filter((f) => f !== id));
          }}
          className={`w-full h-13 bg-[#0F0F0F] text-[#F2F2F2] border rounded-lg pl-11 pr-4 pt-4 pb-1 focus:outline-none transition-all text-sm ${borderColor}`}
          autoComplete="off"
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Link 
        href="/login" 
        className="inline-flex items-center text-xs font-medium text-[#A1A1AA] hover:text-white transition-colors gap-1.5 w-fit group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to login
      </Link>
      
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {renderField({
          id: "email",
          label: "Email Address",
          icon: Mail,
          value: email,
          setValue: setEmail,
        })}

        {errorMessage && (
          <p className="text-xs text-red-400 text-center mt-1">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-xs text-emerald-400 text-center mt-1">{successMessage}</p>
        )}

        <button
          className="w-full h-12 mt-2 bg-white hover:bg-[#E5E5E5] text-black font-bold text-sm rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          <span>{isLoading ? "Sending..." : "Send Reset Link"}</span>
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
}
