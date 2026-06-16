"use client";

import { JourneyTrack } from "@/components/JourneyTrack";
import { emailSubject, formatMessageDate } from "@/lib/email";
import {
  daysSince,
  needsLearning,
  needsSilver,
  stageFor,
  STAGE_META,
} from "@/lib/stages";
import type { Ticket } from "@/types/ticket";
import { useState } from "react";

function MessageBlock({
  label,
  date,
  children,
}: {
  label: string;
  date?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="border-b border-mail-border px-5 py-6 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-mail-muted">
            {label}
          </p>
          <p className="mt-1 text-sm font-semibold text-mail-text">me</p>
        </div>
        {date ? (
          <time className="shrink-0 text-xs text-mail-muted">{date}</time>
        ) : null}
      </div>
      <div className="mt-4 text-[15px] leading-relaxed text-mail-text">
        {children}
      </div>
    </article>
  );
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

  const subject = emailSubject(ticket);

  return (
    <>
      <header className="shrink-0 border-b border-mail-border bg-mail-paper px-5 pb-4 pt-[calc(12px+env(safe-area-inset-top,0px))]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-mail-border bg-mail-surface text-lg text-mail-text"
            aria-label="Back to inbox"
          >
            ←
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-mail-text">
              {subject}
            </h2>
            <p className="mt-0.5 text-xs text-mail-muted">
              {meta.short} · {d} {d === 1 ? "day" : "days"} ago
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-mail-accent px-4 py-3">
          <p className="ui-label">Thread</p>
          <div className="mt-2">
            <JourneyTrack ticket={ticket} />
          </div>
        </div>
      </header>

      <div
        className="min-h-0 flex-1 overflow-y-auto bg-mail-paper"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <MessageBlock
          label="Original message"
          date={formatMessageDate(ticket.createdAt)}
        >
          {ticket.disappointment}
        </MessageBlock>

        {ticket.learning ? (
          <MessageBlock
            label="Re: 30-day reply"
            date={
              ticket.learningAt
                ? formatMessageDate(ticket.learningAt)
                : undefined
            }
          >
            {ticket.learning}
          </MessageBlock>
        ) : needsLearning(ticket) ? (
          <article className="border-b border-mail-border bg-mail-surface px-5 py-6">
            <p className="text-xs font-medium uppercase tracking-wide text-mail-muted">
              Re: 30-day reply
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mail-secondary">
              30 days have passed. What did this teach you?
            </p>
            <textarea
              value={learningDraft}
              onChange={(e) => setLearningDraft(e.target.value)}
              className="mt-4 min-h-[120px] w-full resize-y rounded-2xl border border-mail-border bg-mail-paper p-4 text-[15px] leading-relaxed text-mail-text outline-none focus:border-mail-border-strong"
              placeholder="Write your reply…"
            />
          </article>
        ) : firstLockedEarly ? (
          <article className="border-b border-mail-border px-5 py-6">
            <p className="text-xs font-medium uppercase tracking-wide text-mail-muted">
              Re: 30-day reply
            </p>
            <p className="mt-3 text-sm text-mail-muted">
              Scheduled in {daysTo30} {daysTo30 === 1 ? "day" : "days"}.
            </p>
          </article>
        ) : null}

        {ticket.silver ? (
          <MessageBlock
            label="Re: 90-day reply"
            date={
              ticket.silverAt ? formatMessageDate(ticket.silverAt) : undefined
            }
          >
            {ticket.silver}
          </MessageBlock>
        ) : finalLockedNoLearning ? (
          <article className="border-b border-mail-border px-5 py-6">
            <p className="text-xs font-medium uppercase tracking-wide text-mail-muted">
              Re: 90-day reply
            </p>
            <p className="mt-3 text-sm text-mail-muted">
              Reply to your 30-day note first.
            </p>
          </article>
        ) : finalLockedWaiting90 ? (
          <article className="border-b border-mail-border px-5 py-6">
            <p className="text-xs font-medium uppercase tracking-wide text-mail-muted">
              Re: 90-day reply
            </p>
            <p className="mt-3 text-sm text-mail-muted">
              Scheduled in {daysTo90} {daysTo90 === 1 ? "day" : "days"}.
            </p>
          </article>
        ) : needsSilver(ticket) ? (
          <article className="border-b border-mail-border bg-mail-surface px-5 py-6">
            <p className="text-xs font-medium uppercase tracking-wide text-mail-muted">
              Re: 90-day reply
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mail-secondary">
              A good thing that happened because of this…
            </p>
            <textarea
              value={silverDraft}
              onChange={(e) => setSilverDraft(e.target.value)}
              className="mt-4 min-h-[120px] w-full resize-y rounded-2xl border border-mail-border bg-mail-paper p-4 text-[15px] leading-relaxed text-mail-text outline-none focus:border-mail-border-strong"
              placeholder="Write your reply…"
            />
          </article>
        ) : null}
      </div>

      {showStickyFooter ? (
        <footer
          className="shrink-0 border-t border-mail-border bg-mail-surface px-5 py-4"
          style={{
            paddingBottom: `calc(16px + env(safe-area-inset-bottom, 0px))`,
          }}
        >
          {needsLearning(ticket) ? (
            <button
              type="button"
              className="btn-send w-full sm:w-auto"
              disabled={!canSaveLearning}
              onClick={() => {
                onSaveLearning(ticket.id, learningDraft.trim());
              }}
            >
              Send reply
            </button>
          ) : null}
          {needsSilver(ticket) ? (
            <button
              type="button"
              className="btn-send w-full sm:w-auto"
              disabled={!canSaveSilver}
              onClick={() => {
                onSaveSilver(ticket.id, silverDraft.trim());
              }}
            >
              Send reply
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
      className="fixed inset-0 z-40 flex flex-col bg-mail-bg overlay-enter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
    >
      <span id="detail-title" className="sr-only">
        Message thread
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
