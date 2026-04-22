"use client";

import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import type { InputFieldProps } from "./types";

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [focusedField, setFocusedField] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrorFields: string[] = [];

    if (!identifier) newErrorFields.push("identifier");
    if (!password) newErrorFields.push("password");

    if (newErrorFields.length > 0) {
      setErrorFields(newErrorFields);
      toast.error("Please provide both your email/mobile and password.");
      return;
    }

    try {
      setIsLoading(true);
      await authService.login({ email: identifier, password });
      router.push("/student");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Invalid credentials provided.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
      setErrorFields(["identifier", "password"]);
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
    isPassword,
    showPwd,
    setShowPwd,
  }: InputFieldProps) => {
    const isFloating = focusedField === id || value !== "";
    const hasError = errorFields.includes(id);
    const isFocused = focusedField === id;

    // Inner shadow validation for empty required fields
    const borderColor = hasError
      ? "border-white focus:border-white ring-1 ring-white shadow-[inset_0_0_15px_rgba(255,255,255,0.15)]"
      : "border-border-default focus:border-white focus:ring-1 focus:ring-white";

    const labelColor = isFocused ? "text-white" : "text-zinc-500";
    const iconColor = isFocused ? "text-white" : "text-[#A1A1AA]";

    return (
      <div className="relative group w-full flex-1">
        {/* Input Icon */}
        <span
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 pointer-events-none ${iconColor}`}
        >
          <Icon size={20} />
        </span>

        {/* Floating Label */}
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

        {/* Password Toggle */}
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
    <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
      {renderField({
        id: "identifier",
        label: "Email or Mobile",
        icon: User,
        value: identifier,
        setValue: setIdentifier,
      })}

      <div className="flex flex-col gap-1.5">
        {renderField({
          id: "password",
          label: "Password",
          icon: Lock,
          isPassword: true,
          value: password,
          setValue: setPassword,
          showPwd: showPassword,
          setShowPwd: setShowPassword,
        })}
        <div className="flex justify-end pr-1 mt-0.5">
          <a
            className="text-xs font-medium text-[#A1A1AA] hover:text-white transition-colors hover:underline"
            href="/forgot-password"
          >
            Forgot password?
          </a>
        </div>
      </div>

      <button
        className="w-full h-12 mt-2 bg-white hover:bg-[#E5E5E5] text-black font-bold text-sm rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={isLoading}
      >
        <span>{isLoading ? "Signing In..." : "Sign In"}</span>
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
