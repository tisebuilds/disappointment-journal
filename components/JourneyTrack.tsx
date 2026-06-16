"use client";

import type { Ticket } from "@/types/ticket";

function Dot({ filled }: { filled: boolean }) {
  return (
    <span
      className="size-2 shrink-0 rounded-full"
      style={{
        backgroundColor: filled ? "#111111" : "#d4d4d0",
      }}
      aria-hidden
    />
  );
}

function Segment({ filled }: { filled: boolean }) {
  return (
    <span
      className="mx-0.5 h-px min-w-[12px] flex-1"
      style={{ backgroundColor: filled ? "#111111" : "#e8e8e4" }}
      aria-hidden
    />
  );
}

export function JourneyTrack({ ticket }: { ticket: Ticket }) {
  const hasLearning = Boolean(ticket.learning);
  const hasSilver = Boolean(ticket.silver);

  return (
    <div>
      <div className="flex items-center">
        <Dot filled />
        <Segment filled={hasLearning} />
        <Dot filled={hasLearning} />
        <Segment filled={hasSilver} />
        <Dot filled={hasSilver} />
      </div>
      <div className="mt-1.5 flex justify-between gap-1 text-[10px] font-medium text-mail-muted">
        <span className="max-w-[28%] text-left leading-tight">Sent</span>
        <span className="max-w-[36%] text-center leading-tight">30-day</span>
        <span className="max-w-[36%] text-right leading-tight">90-day</span>
      </div>
    </div>
  );
}
