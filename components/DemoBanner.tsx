"use client";

import { formatDemoDate } from "@/lib/demo";

export function DemoBanner({
  demoDayOffset,
  onReset,
}: {
  demoDayOffset: number;
  onReset: () => void;
}) {
  if (demoDayOffset <= 0) return null;

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-amber-200 bg-amber-100 px-4 py-2 pt-[calc(8px+env(safe-area-inset-top,0px))] text-amber-950">
      <p className="text-xs leading-snug">
        <span className="font-semibold">Demo mode</span>
        <span className="text-amber-900/80">
          {" "}
          · +{demoDayOffset} {demoDayOffset === 1 ? "day" : "days"} ·{" "}
          {formatDemoDate()}
        </span>
      </p>
      <button
        type="button"
        onClick={onReset}
        className="shrink-0 rounded-full border border-amber-300 bg-white px-3 py-1 text-[11px] font-medium"
      >
        Reset
      </button>
    </div>
  );
}
