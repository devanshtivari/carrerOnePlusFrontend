"use client";

import {
  User,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Phone,
  BookOpen,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import type { SignupInputFieldProps } from "./types";

export default function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [grade, setGrade] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [focusedField, setFocusedField] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrorFields: string[] = [];

    if (!fullName) newErrorFields.push("fullName");
    if (!email) newErrorFields.push("email");
    if (!mobile) newErrorFields.push("mobile");
    if (!grade) newErrorFields.push("grade");
    if (!password) newErrorFields.push("password");
    if (!confirmPassword) newErrorFields.push("confirmPassword");

    if (newErrorFields.length > 0) {
      setErrorFields(newErrorFields);
      toast.error("Please fill out all required fields.");
      return;
    }

    if (mobile.replace(/\D/g, "").length !== 10) {
      setErrorFields([...errorFields, "mobile"]);
      toast.error("Mobile number must be exactly 10 digits.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorFields([...errorFields, "password"]);
      toast.error("Password must be at least 8 characters, with a letter, number, & symbol.");
      return;
    }

    // Basic password match
    if (password !== confirmPassword) {
      setErrorFields([...errorFields, "password", "confirmPassword"]);
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({ fullName, email, mobile, grade, password, confirmPassword });
      // Redirect to verification with email pre-filled
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Registration failed. Try again.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
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
    options,
    isPassword,
    showPwd,
    setShowPwd,
    maxLength,
  }: SignupInputFieldProps) => {
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

        {options ? (
          <>
            <select
              id={id}
              value={value}
              onFocus={() => setFocusedField(id)}
              onBlur={() => setFocusedField("")}
              onChange={(e) => {
                setValue(e.target.value);
                if (hasError)
                  setErrorFields(errorFields.filter((f) => f !== id));
              }}
              className={`w-full h-13 bg-[#0F0F0F] text-[#F2F2F2] border rounded-lg pl-11 pr-10 pt-4 pb-1 focus:outline-none transition-all text-sm appearance-none cursor-pointer ${borderColor}`}
              style={{ color: value === "" ? "transparent" : "" }}
            >
              <option value="" disabled className="hidden"></option>
              {options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="text-[#F2F2F2]"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] pointer-events-none">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </>
        ) : (
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
            maxLength={maxLength}
          />
        )}

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
        id: "fullName",
        label: "Full Name",
        icon: User,
        value: fullName,
        setValue: setFullName,
      })}

      <div className="flex flex-col md:flex-row gap-4">
        {renderField({
          id: "grade",
          label: "Class / Grade",
          icon: BookOpen,
          value: grade,
          setValue: setGrade,
          options: [
            { value: "9", label: "Grade 9" },
            { value: "10", label: "Grade 10" },
            { value: "11", label: "Grade 11" },
            { value: "12", label: "Grade 12" },
            { value: "undergrad", label: "Undergraduate" },
            { value: "graduate", label: "Graduate" },
            { value: "other", label: "Other" },
          ],
        })}

        {renderField({
          id: "mobile",
          label: "Mobile Number",
          icon: Phone,
          type: "tel",
          value: mobile,
          maxLength: 10,
          setValue: (val) => {
            // Remove all characters except digits, spaces, hyphens, plus, and parentheses
            const filtered = val.replace(/[^\d\s+\-()]/g, "");
            setMobile(filtered);
          },
        })}
      </div>

      {renderField({
        id: "email",
        label: "Email Address",
        icon: Mail,
        type: "email",
        value: email,
        setValue: setEmail,
      })}

      <div className="flex flex-col md:flex-row gap-4">
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

      <button
        className="w-full h-12 mt-2 bg-white hover:bg-[#E5E5E5] text-black font-bold text-sm rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={isLoading}
      >
        <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
        <UserPlus size={18} />
      </button>
    </form>
  );
}
