"use client";

import type { Ticket } from "@/types/ticket";

function Dot({ filled }: { filled: boolean }) {
  return (
    <span
      className="size-2 shrink-0 rounded-full border-2"
      style={{
        backgroundColor: filled ? "#16100a" : "transparent",
        borderColor: filled ? "#16100a" : "#b8a080",
      }}
      aria-hidden
    />
  );
}

function Segment({ filled }: { filled: boolean }) {
  return (
    <span
      className="mx-0.5 h-0.5 min-w-[12px] flex-1"
      style={{ backgroundColor: filled ? "#16100a" : "#b8a080" }}
      aria-hidden
    />
  );
}

export function JourneyTrack({ ticket }: { ticket: Ticket }) {
  const hasLearning = Boolean(ticket.learning);
  const hasSilver = Boolean(ticket.silver);

  return (
    <div className="mt-3">
      <div className="flex items-center">
        <Dot filled />
        <Segment filled={hasLearning} />
        <Dot filled={hasLearning} />
        <Segment filled={hasSilver} />
        <Dot filled={hasSilver} />
      </div>
      <div
        className="mt-1.5 flex justify-between gap-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-ticket-track"
        style={{ color: "#7a6248" }}
      >
        <span className="max-w-[28%] text-left leading-tight">Logged</span>
        <span className="max-w-[36%] text-center leading-tight">
          1st Checkpoint
        </span>
        <span className="max-w-[36%] text-right leading-tight">
          Final Checkpoint
        </span>
      </div>
    </div>
  );
}
