"use client";

import { JourneyTrack } from "@/components/JourneyTrack";
import { daysSince, isCheckpointReady, stageFor, STAGE_META } from "@/lib/stages";
import type { Ticket } from "@/types/ticket";

function formatCardDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

function snippet(text: string, max = 140): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

export function TicketCard({
  ticket,
  onOpen,
}: {
  ticket: Ticket;
  onOpen: (id: string) => void;
}) {
  const stage = stageFor(ticket);
  const meta = STAGE_META[stage];
  const d = daysSince(ticket.createdAt);
  const ready = isCheckpointReady(ticket);

  return (
    <button
      type="button"
      onClick={() => onOpen(ticket.id)}
      className="relative w-full border-0 p-5 text-left transition-[transform,background-color] active:scale-[0.98] active:bg-[#f3ead8]"
      style={{
        backgroundColor: ready ? "#ffffff" : "#faf4ea",
        marginBottom: 3,
        boxShadow: ready ? "inset 2px 0 0 0 #16100a" : "none",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[9px] font-bold tracking-[0.18em] text-ticket-t3">
          {formatCardDate(ticket.createdAt)}
        </span>
        <span
          className="shrink-0 font-mono text-[9px] font-bold tracking-[0.15em]"
          style={{
            color: ready ? "#faf4ea" : "#7a6248",
            backgroundColor: ready ? "#16100a" : "transparent",
            padding: ready ? "4px 8px" : "0",
          }}
        >
          {meta.short}
        </span>
      </div>
      <p className="mt-3 font-serif text-[22px] font-bold italic leading-snug text-ticket-t1">
        &ldquo;{snippet(ticket.disappointment)}&rdquo;
      </p>
      <JourneyTrack ticket={ticket} />
      <p className="mt-2 font-mono text-[9px] font-bold tracking-[0.18em] text-ticket-t3">
        {d} {d === 1 ? "DAY" : "DAYS"} IN
      </p>
    </button>
  );
}
