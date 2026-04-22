import React from "react";

/* ── Overview Stat Card ── */
export default function OverviewStatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-surface-200 border border-border-default rounded-xl p-4 flex flex-col items-center gap-2 group hover:border-white/20 transition-all duration-300">
      <Icon
        size={20}
        className="text-[#A1A1AA] group-hover:text-white transition-colors duration-200"
      />
      <span className="text-white text-xl font-black">{value}</span>
      <span className="text-[#A1A1AA] text-[11px] font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
