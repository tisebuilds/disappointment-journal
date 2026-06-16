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
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) {
      setPhase("form");
      setSubject("");
      setBody("");
    }
  }, [open]);

  useEffect(() => {
    if (!open || phase !== "form") return;
    const t = window.setTimeout(() => bodyRef.current?.focus(), 200);
    return () => window.clearTimeout(t);
  }, [open, phase]);

  if (!open) return null;

  const submit = () => {
    const disappointment = body.trim();
    if (!disappointment) return;
    const ticket: Ticket = {
      id: generateTicketId(),
      createdAt: new Date().toISOString(),
      subject: subject.trim() || null,
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
      className="fixed inset-0 z-40 flex flex-col bg-mail-surface overlay-enter"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compose-title"
    >
      {phase === "form" ? (
        <>
          <header className="flex shrink-0 items-center justify-between bg-mail-header px-5 py-4 pt-[calc(14px+env(safe-area-inset-top,0px))] text-white">
            <h2 id="compose-title" className="text-[15px] font-semibold">
              New Message
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-full border-0 bg-transparent text-xl text-white/80 transition-colors hover:text-white"
              aria-label="Close"
            >
              ×
            </button>
          </header>

          <div className="shrink-0 bg-mail-paper">
            <div className="compose-field">
              <span className="compose-field-label">To</span>
              <span className="text-[15px] font-medium text-mail-text">me</span>
            </div>
            <div className="compose-field">
              <label className="compose-field-label" htmlFor="compose-subject">
                Subject
              </label>
              <input
                id="compose-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="compose-field-input"
                placeholder="What happened?"
              />
            </div>
          </div>

          <textarea
            ref={bodyRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-0 w-full flex-1 resize-none border-0 bg-mail-paper px-5 py-4 text-[16px] leading-relaxed text-mail-text outline-none placeholder:text-mail-muted"
            placeholder="Write what disappointed you…"
          />

          <footer
            className="shrink-0 border-t border-mail-border bg-mail-surface px-5 py-4"
            style={{
              paddingBottom: `calc(16px + env(safe-area-inset-bottom, 0px))`,
            }}
          >
            <button
              type="button"
              className="btn-send"
              onClick={submit}
              disabled={!body.trim()}
            >
              Send
            </button>
          </footer>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center bg-mail-paper px-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-mail-accent">
            <span className="text-3xl" aria-hidden>
              ✓
            </span>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-mail-text">Message sent</h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mail-secondary">
            It&apos;s in your inbox. You&apos;ll be nudged to reply in 30 days,
            then again at 90.
          </p>
          <button
            type="button"
            className="btn-send mt-10"
            onClick={onClose}
          >
            Back to inbox
          </button>
        </div>
      )}
    </div>
  );
}
