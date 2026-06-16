"use client";

import { JourneyTrack } from "@/components/JourneyTrack";
import {
  daysSince,
  needsLearning,
  needsSilver,
  stageFor,
  STAGE_META,
} from "@/lib/stages";
import type { Ticket } from "@/types/ticket";
import { useState } from "react";

function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function DetailBody({
  ticket,
  onClose,
  onSaveLearning,
  onSaveSilver,
}: {
  ticket: Ticket;
  onClose: () => void;
  onSaveLearning: (id: string, learning: string) => void;
  onSaveSilver: (id: string, silver: string) => void;
}) {
  const [learningDraft, setLearningDraft] = useState(
    () => ticket.learning ?? "",
  );
  const [silverDraft, setSilverDraft] = useState(() => ticket.silver ?? "");

  const d = daysSince(ticket.createdAt);
  const stage = stageFor(ticket);
  const meta = STAGE_META[stage];
  const canSaveLearning =
    needsLearning(ticket) && learningDraft.trim().length > 0;
  const canSaveSilver = needsSilver(ticket) && silverDraft.trim().length > 0;
  const showStickyFooter = needsLearning(ticket) || needsSilver(ticket);
  const daysTo30 = Math.max(0, 30 - d);
  const daysTo90 = Math.max(0, 90 - d);

  const firstLockedEarly = !ticket.learning && d < 30;
  const finalLockedNoLearning = !ticket.learning;
  const finalLockedWaiting90 =
    ticket.learning && !ticket.silver && d < 90;

  return (
    <>
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-ticket-border px-4 pb-4 pt-[calc(12px+env(safe-area-inset-top,0px))]">
        <button
          type="button"
          onClick={onClose}
          className="btn-ghost px-0 py-2 font-mono text-[10px] font-bold tracking-[0.2em]"
        >
          ← Entries
        </button>
        <span className="font-mono text-[9px] font-bold tracking-[0.15em] text-ticket-t3">
          {meta.short}
        </span>
        <span className="ml-auto font-mono text-[9px] font-bold tracking-[0.15em] text-ticket-t3">
          {d} {d === 1 ? "DAY" : "DAYS"} IN
        </span>
      </header>

      <div
        className="min-h-0 flex-1 overflow-y-auto px-4 py-6"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <p className="ui-label text-ticket-t3">Itinerary</p>
        <div className="mt-3 rounded-none border border-ticket-border bg-ticket-paper p-4">
          <div className="flex justify-between gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-ticket-t3">
            <span>Logged</span>
            <span>1st Checkpoint</span>
            <span>Final Checkpoint</span>
          </div>
          <div className="mt-2">
            <JourneyTrack ticket={ticket} />
          </div>
        </div>

        <section className="mt-8">
          <p className="ui-label text-ticket-t3">
            Logged · {formatLongDate(ticket.createdAt)}
          </p>
          <p className="mt-3 font-serif text-xl font-bold italic leading-relaxed text-ticket-t1">
            {ticket.disappointment}
          </p>
        </section>

        <section className="mt-10">
          <p className="ui-label text-ticket-t3">1st checkpoint · I learned…</p>
          {ticket.learning ? (
            <p className="mt-3 font-serif text-lg font-bold italic leading-relaxed text-ticket-t1">
              {ticket.learning}
            </p>
          ) : needsLearning(ticket) ? (
            <>
              <p className="mt-3 font-mono text-[10px] font-normal uppercase leading-relaxed tracking-[0.18em] text-ticket-t2">
                30 days have passed. What did this teach you?
              </p>
              <textarea
                value={learningDraft}
                onChange={(e) => setLearningDraft(e.target.value)}
                className="mt-4 min-h-[140px] w-full resize-y border border-ticket-border bg-transparent p-3 font-serif text-[20px] italic leading-relaxed text-ticket-t1 outline-none"
                style={{ fontSize: "22px" }}
              />
            </>
          ) : firstLockedEarly ? (
            <p className="mt-3 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-ticket-t3">
              Unlocks in {daysTo30} {daysTo30 === 1 ? "day" : "days"}.
            </p>
          ) : null}
        </section>

        <section className="mt-10">
          <p className="ui-label text-ticket-t3">
            Final checkpoint · A good thing that came from this…
          </p>
          {ticket.silver ? (
            <p className="mt-3 font-serif text-lg font-bold italic leading-relaxed text-ticket-t1">
              {ticket.silver}
            </p>
          ) : finalLockedNoLearning ? (
            <p className="mt-3 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-ticket-t3">
              Final reflection · Complete 1st checkpoint first
            </p>
          ) : finalLockedWaiting90 ? (
            <p className="mt-3 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-ticket-t3">
              Unlocks in {daysTo90} {daysTo90 === 1 ? "day" : "days"}.
            </p>
          ) : needsSilver(ticket) ? (
            <>
              <p className="mt-3 font-mono text-[10px] font-normal uppercase leading-relaxed tracking-[0.18em] text-ticket-t2">
                A good thing that happened because of this…
              </p>
              <textarea
                value={silverDraft}
                onChange={(e) => setSilverDraft(e.target.value)}
                className="mt-4 min-h-[140px] w-full resize-y border border-ticket-border bg-transparent p-3 font-serif text-[20px] italic leading-relaxed text-ticket-t1 outline-none"
                style={{ fontSize: "22px" }}
              />
            </>
          ) : null}
        </section>
      </div>

      {showStickyFooter ? (
        <footer
          className="shrink-0 border-t border-ticket-border bg-ticket-surface p-4"
          style={{
            paddingBottom: `calc(16px + env(safe-area-inset-bottom, 0px))`,
          }}
        >
          {needsLearning(ticket) ? (
            <button
              type="button"
              className="btn-primary w-full"
              disabled={!canSaveLearning}
              onClick={() => {
                onSaveLearning(ticket.id, learningDraft.trim());
              }}
            >
              Save my entry →
            </button>
          ) : null}
          {needsSilver(ticket) ? (
            <button
              type="button"
              className="btn-primary w-full"
              disabled={!canSaveSilver}
              onClick={() => {
                onSaveSilver(ticket.id, silverDraft.trim());
              }}
            >
              Complete my reflection ✦
            </button>
          ) : null}
        </footer>
      ) : null}
    </>
  );
}

export function DetailOverlay({
  ticket,
  open,
  onClose,
  onSaveLearning,
  onSaveSilver,
}: {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
  onSaveLearning: (id: string, learning: string) => void;
  onSaveSilver: (id: string, silver: string) => void;
}) {
  if (!open || !ticket) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col bg-ticket-surface overlay-enter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
    >
      <span id="detail-title" className="sr-only">
        Entry detail
      </span>
      <DetailBody
        key={ticket.id}
        ticket={ticket}
        onClose={onClose}
        onSaveLearning={onSaveLearning}
        onSaveSilver={onSaveSilver}
      />
    </div>
  );
}
