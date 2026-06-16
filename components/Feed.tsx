"use client";

import { TicketCard } from "@/components/TicketCard";
import { needsLearning, needsSilver } from "@/lib/stages";
import type { Ticket } from "@/types/ticket";

function sortByCreatedDesc(a: Ticket, b: Ticket): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function formatHeaderDate(now = new Date()): { day: string; weekday: string } {
  return {
    day: now.toLocaleDateString("en-US", { day: "2-digit", month: "long" }),
    weekday: now.toLocaleDateString("en-US", { weekday: "long" }),
  };
}

export function Feed({
  tickets,
  onOpenEntry,
  onCreateEntry,
}: {
  tickets: Ticket[];
  onOpenEntry: (id: string) => void;
  onCreateEntry: () => void;
}) {
  const { day, weekday } = formatHeaderDate();
  const unread = tickets.filter((t) => needsLearning(t) || needsSilver(t));
  const unreadIds = new Set(unread.map((t) => t.id));
  const allSorted = [...tickets].sort(sortByCreatedDesc);
  const sent = allSorted.filter((t) => !unreadIds.has(t.id));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-mail-border bg-mail-surface/90 px-5 pb-5 pt-[calc(14px+env(safe-area-inset-top,0px))] backdrop-blur-md">
        <div>
          <p className="text-sm font-medium text-mail-muted">{day}</p>
          <h1 className="mt-0.5 text-3xl font-bold tracking-tight text-mail-text">
            {weekday}
          </h1>
        </div>
        <p className="mt-4 text-sm text-mail-secondary">
          Inbox · {tickets.length}{" "}
          {tickets.length === 1 ? "message" : "messages"}
        </p>
      </header>

      <div className="feed-scroll">
        {tickets.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-mail-paper shadow-sm ring-1 ring-mail-border">
              <span className="text-2xl" aria-hidden>
                ✉️
              </span>
            </div>
            <p className="mt-6 text-lg font-semibold text-mail-text">
              Your inbox is empty
            </p>
            <p className="mt-2 text-sm leading-relaxed text-mail-secondary">
              When something disappoints you, send yourself a note. You&apos;ll
              get reminders to reply in 30 and 90 days.
            </p>
            <button
              type="button"
              onClick={onCreateEntry}
              className="btn-send mt-8"
            >
              New message
            </button>
          </div>
        ) : (
          <>
            {unread.length > 0 ? (
              <section>
                <h2 className="ui-label px-5 py-3">Needs a reply</h2>
                <div className="border-y border-mail-border bg-mail-paper">
                  {unread.sort(sortByCreatedDesc).map((t) => (
                    <TicketCard
                      key={t.id}
                      ticket={t}
                      onOpen={onOpenEntry}
                      unread
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section className={unread.length > 0 ? "mt-6" : ""}>
              <h2 className="ui-label px-5 py-3">
                {unread.length > 0 ? "Earlier" : "Sent to me"}
              </h2>
              <div className="border-y border-mail-border bg-mail-paper">
                {(unread.length > 0 ? sent : allSorted).map((t) => (
                  <TicketCard
                    key={t.id}
                    ticket={t}
                    onOpen={onOpenEntry}
                    unread={needsLearning(t) || needsSilver(t)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
