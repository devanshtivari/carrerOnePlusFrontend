import React from "react";

export function UnitProgressBar({ progress }: { progress: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-surface-400 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-accent-primary text-xs font-bold whitespace-nowrap">
        {progress}% Completed
      </span>
    </div>
  );
}
