"use client";

import { Mail, KeyRound, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import type { InputFieldProps } from "../LoginForm/types";

export default function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");

  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [focusedField, setFocusedField] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const newErrorFields: string[] = [];

    if (!email) newErrorFields.push("email");
    if (!otp) newErrorFields.push("otp");

    if (newErrorFields.length > 0) {
      setErrorFields(newErrorFields);
      return;
    }

    try {
      setIsLoading(true);
      const data = await authService.verifyEmail({ email, otp });
      
      if (data?.access_token) {
        sessionStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) {
          sessionStorage.setItem('refresh_token', data.refresh_token);
        }
      }

      setSuccessMessage("Email verified successfully! Redirecting to setup...");
      setTimeout(() => {
        router.push("/student");
      }, 1500);
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
      setErrorFields(["otp"]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setErrorFields(["email"]);
      setErrorMessage("Please provide your email to resend OTP.");
      return;
    }

    try {
      setIsResending(true);
      setErrorMessage("");
      setSuccessMessage("");
      await authService.resendOtp({ email, type: 'VERIFY_EMAIL' });
      setSuccessMessage("A new OTP has been sent to your email.");
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Failed to resend OTP. Try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  const renderField = ({
    id,
    label,
    icon: Icon,
    value,
    setValue,
    type = "text",
    maxLength
  }: InputFieldProps & { maxLength?: number }) => {
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
          maxLength={maxLength}
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
    <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
      {renderField({
        id: "email",
        label: "Email Address",
        icon: Mail,
        value: email,
        setValue: setEmail,
      })}

      <div className="flex flex-col gap-1.5">
        {renderField({
          id: "otp",
          label: "Verification Code (6-digits)",
          icon: KeyRound,
          value: otp,
          setValue: setOtp,
          maxLength: 6
        })}
        <div className="flex justify-end pr-1 mt-0.5">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-xs font-medium text-[#A1A1AA] hover:text-white transition-colors hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
          >
            {isResending ? "Resending..." : "Resend Code"}
          </button>
        </div>
      </div>

      {errorMessage && (
        <p className="text-xs text-red-400 text-center mt-1">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-xs text-emerald-400 text-center mt-1">{successMessage}</p>
      )}

      <button
        className="w-full h-12 mt-2 bg-white hover:bg-[#E5E5E5] text-black font-bold text-sm rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={isLoading || isResending}
      >
        <span>{isLoading ? "Verifying..." : "Verify Email"}</span>
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
