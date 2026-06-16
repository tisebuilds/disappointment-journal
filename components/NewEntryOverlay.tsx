"use client";

import { generateTicketId } from "@/lib/tickets";
import type { Ticket } from "@/types/ticket";
import { useEffect, useRef, useState } from "react";

type Phase = "form" | "success";

export function NewEntryOverlay({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (ticket: Ticket) => void;
}) {
  const [phase, setPhase] = useState<Phase>("form");
  const [text, setText] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open || phase !== "form") return;
    const t = window.setTimeout(() => taRef.current?.focus(), 250);
    return () => window.clearTimeout(t);
  }, [open, phase]);

  if (!open) return null;

  const submit = () => {
    const disappointment = text.trim();
    if (!disappointment) return;
    const ticket: Ticket = {
      id: generateTicketId(),
      createdAt: new Date().toISOString(),
      disappointment,
      learning: null,
      learningAt: null,
      silver: null,
      silverAt: null,
    };
    onCreate(ticket);
    setPhase("success");
  };

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col bg-ticket-paper overlay-enter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-entry-title"
    >
      {phase === "form" ? (
        <>
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-ticket-border px-4 pb-4 pt-[calc(16px+env(safe-area-inset-top,0px))]">
            <div>
              <p className="ui-label text-ticket-t3">New entry</p>
              <h2
                id="new-entry-title"
                className="mt-2 font-serif text-[22px] font-bold leading-tight text-ticket-t1"
              >
                What disappointed you?
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-11 shrink-0 items-center justify-center border border-ticket-t1 bg-transparent font-mono text-lg text-ticket-t1"
              aria-label="Close"
            >
              ×
            </button>
          </header>

          <textarea
            ref={taRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="min-h-0 w-full flex-1 resize-none border-0 bg-transparent px-4 py-4 font-serif text-[22px] italic leading-relaxed text-ticket-t1 outline-none placeholder:text-ticket-t3/60"
            style={{ fontSize: "22px" }}
            placeholder="Write it out…"
          />

          <footer
            className="shrink-0 border-t border-ticket-border bg-ticket-surface p-4"
            style={{
              paddingBottom: `calc(16px + env(safe-area-inset-bottom, 0px))`,
            }}
          >
            <button
              type="button"
              className="btn-primary w-full"
              onClick={submit}
              disabled={!text.trim()}
            >
              Create entry →
            </button>
          </footer>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="ui-label text-ticket-t3">Sealed</p>
          <h2 className="mt-4 font-serif text-3xl font-black text-ticket-t1">
            Disappointment sealed
          </h2>
          <p className="mt-4 max-w-sm font-serif text-lg font-bold italic leading-relaxed text-ticket-t2">
            Your testimony has begun.
          </p>
          <p className="mt-6 font-mono text-[10px] font-normal uppercase leading-relaxed tracking-[0.2em] text-ticket-t3">
            1st checkpoint in 30 days.
            <br />
            Last checkpoint at 90.
          </p>
          <button
            type="button"
            className="btn-primary mt-10 w-full max-w-xs"
            onClick={onClose}
          >
            Back to my entries
          </button>
        </div>
      )}
    </div>
  );
}
