"use client";

import {
  formatDemoDate,
  offsetForTargetAge,
  saveDemoDayOffset,
} from "@/lib/demo";
import { daysSince } from "@/lib/stages";
import { createDemoTickets } from "@/lib/seed";
import type { Ticket } from "@/types/ticket";
import { useState } from "react";

function sortNewestFirst(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function DemoPanel({
  tickets,
  demoDayOffset,
  onDemoDayOffsetChange,
  onTicketsChange,
}: {
  tickets: Ticket[];
  demoDayOffset: number;
  onDemoDayOffsetChange: (days: number) => void;
  onTicketsChange: (next: Ticket[]) => void;
}) {
  const [inputValue, setInputValue] = useState(String(demoDayOffset));

  const applyOffset = (days: number) => {
    const safe = Math.max(0, Math.min(365, Math.floor(days)));
    saveDemoDayOffset(safe);
    onDemoDayOffsetChange(safe);
    setInputValue(String(safe));
  };

  const bump = (delta: number) => {
    applyOffset(demoDayOffset + delta);
  };

  const jumpNewestToDay = (targetDay: number) => {
    const newest = sortNewestFirst(tickets)[0];
    if (!newest) return;
    applyOffset(offsetForTargetAge(newest.createdAt, targetDay));
  };

  const loadSamples = () => {
    onTicketsChange(createDemoTickets());
    applyOffset(0);
  };

  const newest = sortNewestFirst(tickets)[0];
  const newestAge = newest ? daysSince(newest.createdAt) : null;

  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
            Demo controls
          </p>
          <p className="mt-1 text-sm text-amber-950/80">
            Simulate time passing without waiting. Offsets affect unlocks only —
            your real send dates stay the same.
          </p>
        </div>
        {demoDayOffset > 0 ? (
          <span className="shrink-0 rounded-full bg-amber-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-950">
            Active
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-2">
          <label
            htmlFor="demo-day-offset"
            className="text-sm font-medium text-amber-950"
          >
            Days simulated
          </label>
          <span className="text-xs text-amber-900/70">
            Effective today: {formatDemoDate()}
          </span>
        </div>

        <input
          id="demo-day-offset"
          type="range"
          min={0}
          max={120}
          value={Math.min(demoDayOffset, 120)}
          onChange={(e) => applyOffset(Number(e.target.value))}
          className="mt-3 w-full accent-amber-700"
        />

        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            min={0}
            max={365}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => {
              const n = Number(inputValue);
              if (Number.isFinite(n)) applyOffset(n);
              else setInputValue(String(demoDayOffset));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const n = Number(inputValue);
                if (Number.isFinite(n)) applyOffset(n);
              }
            }}
            className="w-20 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-mail-text outline-none focus:border-amber-400"
          />
          <span className="text-sm text-amber-900/80">days forward</span>
          <button
            type="button"
            className="btn-ghost ml-auto px-2 py-1 text-xs"
            onClick={() => applyOffset(0)}
          >
            Reset clock
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 active:bg-amber-100"
          onClick={() => bump(1)}
        >
          +1 day
        </button>
        <button
          type="button"
          className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 active:bg-amber-100"
          onClick={() => bump(7)}
        >
          +7 days
        </button>
        <button
          type="button"
          className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 active:bg-amber-100"
          onClick={() => bump(30)}
        >
          +30 days
        </button>
      </div>

      {newest ? (
        <div className="mt-5 border-t border-amber-200/80 pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-900/80">
            Newest message
          </p>
          <p className="mt-1 truncate text-sm text-amber-950">
            {newest.subject?.trim() ||
              newest.disappointment.slice(0, 48) ||
              "Untitled"}
          </p>
          <p className="mt-0.5 text-xs text-amber-900/70">
            Currently reads as {newestAge} {newestAge === 1 ? "day" : "days"}{" "}
            old
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 active:bg-amber-100"
              onClick={() => jumpNewestToDay(1)}
            >
              Day 1
            </button>
            <button
              type="button"
              className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 active:bg-amber-100"
              onClick={() => jumpNewestToDay(30)}
            >
              Day 30 — unlock reply
            </button>
            <button
              type="button"
              className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-950 active:bg-amber-100"
              onClick={() => jumpNewestToDay(90)}
            >
              Day 90 — final reply
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="btn-outline mt-5 w-full border-amber-300 bg-white text-amber-950"
        onClick={loadSamples}
      >
        Load sample inbox
      </button>

      <p className="mt-3 text-[11px] leading-relaxed text-amber-900/60">
        Sample inbox includes messages at day 5, day 35, and day 95. Reset the
        clock after loading to see them as-is, or fast-forward your own message.
      </p>
    </section>
  );
}
