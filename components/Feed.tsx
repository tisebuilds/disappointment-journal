"use client";

import { TicketCard } from "@/components/TicketCard";
import { needsLearning, needsSilver } from "@/lib/stages";
import type { Ticket } from "@/types/ticket";

function sortByCreatedDesc(a: Ticket, b: Ticket): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
  const checkpoint = tickets.filter((t) => needsLearning(t) || needsSilver(t));
  const allSorted = [...tickets].sort(sortByCreatedDesc);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-ticket-border bg-ticket-paper/95 px-4 pb-4 pt-[calc(12px+env(safe-area-inset-top,0px))] backdrop-blur-sm">
        <p className="ui-label text-ticket-t3">Your capsule</p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <h1 className="font-serif text-3xl font-black leading-tight text-ticket-t1 sm:text-4xl">
            Disappointment
            <br />
            Capsule
          </h1>
          <button
            type="button"
            onClick={onCreateEntry}
            className="btn-outline shrink-0 px-4 py-3 text-[10px]"
          >
            + New
          </button>
        </div>
      </header>

      <div className="feed-scroll">
        {tickets.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center px-2 py-16 text-center">
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-ticket-t3">
              NO ENTRIES YET
            </p>
            <p className="mt-6 font-serif text-xl font-bold italic leading-relaxed text-ticket-t1">
              Suffering allows you to be a witness for others.
            </p>
            <button
              type="button"
              onClick={onCreateEntry}
              className="btn-ghost mt-10"
            >
              Log first disappointment →
            </button>
          </div>
        ) : (
          <>
            {checkpoint.length > 0 ? (
              <section className="mb-8">
                <h2 className="ui-label mb-3 flex items-center gap-2 text-ticket-t1">
                  <span
                    className="inline-block size-2 rounded-full bg-ticket-t1"
                    aria-hidden
                  />
                  YOUR CHECKPOINT IS HERE
                </h2>
                <div className="flex flex-col">
                  {checkpoint.sort(sortByCreatedDesc).map((t) => (
                    <TicketCard
                      key={t.id}
                      ticket={t}
                      onOpen={onOpenEntry}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <h2 className="ui-label mb-3 text-ticket-t3">ALL ENTRIES</h2>
              <div className="flex flex-col">
                {allSorted.map((t) => (
                  <TicketCard
                    key={t.id}
                    ticket={t}
                    onOpen={onOpenEntry}
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
