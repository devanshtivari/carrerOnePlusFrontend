import { LucideIcon } from "lucide-react";
import type { StatCardProps } from "./types";

export default function StatCard({
  label,
  value,
  subText,
  subColor = "text-[#A1A1AA]",
  icon: Icon,
}: StatCardProps) {
  return (
    <div className="relative bg-surface-200 border border-border-default rounded-xl p-4 sm:p-5 flex flex-col gap-3 flex-1 min-w-0 sm:min-w-45 group hover:border-white/20 transition-all duration-200 overflow-hidden cursor-default">
      {/* Subtle inner glow on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[#A1A1AA] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
          {label}
        </span>
        <div className="size-7 sm:size-8 rounded-lg bg-surface-300/50 flex items-center justify-center shrink-0">
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A1A1AA] group-hover:text-white transition-colors duration-200" />
        </div>
      </div>
      <div className="relative z-10 flex items-end gap-1.5 sm:gap-2 flex-wrap">
        <span className="text-[#F2F2F2] text-2xl sm:text-3xl font-black leading-none tracking-tight">
          {value}
        </span>
        {subText && (
          <span className={`text-xs font-medium ${subColor} mb-0.5`}>
            {subText}
          </span>
        )}
      </div>
    </div>
  );
}
