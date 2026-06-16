"use client";

import { emailSnippet, emailSubject, formatInboxDate } from "@/lib/email";
import { daysSince, isCheckpointReady, stageFor, STAGE_META } from "@/lib/stages";
import type { Ticket } from "@/types/ticket";

export function TicketCard({
  ticket,
  onOpen,
  unread = false,
}: {
  ticket: Ticket;
  onOpen: (id: string) => void;
  unread?: boolean;
}) {
  const stage = stageFor(ticket);
  const meta = STAGE_META[stage];
  const d = daysSince(ticket.createdAt);
  const ready = isCheckpointReady(ticket);
  const subject = emailSubject(ticket);
  const snippet = emailSnippet(ticket.disappointment);
  const showUnread = unread || ready;

  return (
    <button
      type="button"
      onClick={() => onOpen(ticket.id)}
      className="relative flex w-full gap-3 border-0 border-b border-mail-border bg-mail-paper px-5 py-4 text-left transition-colors last:border-b-0 active:bg-mail-accent"
    >
      {showUnread ? (
        <span
          className="mt-2 size-2 shrink-0 rounded-full bg-mail-unread"
          aria-label="Needs reply"
        />
      ) : (
        <span className="mt-2 size-2 shrink-0" aria-hidden />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p
            className={`truncate text-[15px] leading-snug ${
              showUnread ? "font-semibold text-mail-text" : "font-medium text-mail-text"
            }`}
          >
            {subject}
          </p>
          <span className="shrink-0 text-xs text-mail-muted">
            {formatInboxDate(ticket.createdAt)}
          </span>
        </div>

        <p className="mt-0.5 truncate text-sm text-mail-secondary">
          <span className="text-mail-muted">me · </span>
          {snippet}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
            style={{
              color: ready ? "#ffffff" : meta.accent,
              backgroundColor: ready ? "#111111" : "#f0ede8",
            }}
          >
            {meta.short}
          </span>
          <span className="text-[11px] text-mail-muted">
            {d} {d === 1 ? "day" : "days"} ago
          </span>
        </div>
      </div>
    </button>
  );
}
