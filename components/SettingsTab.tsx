"use client";

import { DemoPanel } from "@/components/DemoPanel";
import { clearTickets, exportTickets, importTickets } from "@/lib/tickets";
import type { Ticket } from "@/types/ticket";
import { useState } from "react";

export function SettingsTab({
  tickets,
  onTicketsChange,
  demoDayOffset,
  onDemoDayOffsetChange,
}: {
  tickets: Ticket[];
  onTicketsChange: (next: Ticket[]) => void;
  demoDayOffset: number;
  onDemoDayOffsetChange: (days: number) => void;
}) {
  const [importError, setImportError] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImportError(null);
    try {
      const next = await importTickets(file);
      onTicketsChange(next);
    } catch {
      setImportError("Could not read that file. Try a backup JSON from this app.");
    }
  };

  const onReset = () => {
    clearTickets();
    onTicketsChange([]);
    setResetConfirm(false);
  };

  return (
    <div
      className="feed-scroll flex flex-col gap-10 px-5"
      style={{ paddingTop: "calc(20px + env(safe-area-inset-top, 0px))" }}
    >
      <section>
        <p className="ui-label">About</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-mail-text">
          Notes to Self
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-mail-secondary">
          Send yourself a message when something disappoints you. Reply in 30
          days with what you learned, then again at 90 with the silver lining.
        </p>
      </section>

      <DemoPanel
        tickets={tickets}
        demoDayOffset={demoDayOffset}
        onDemoDayOffsetChange={onDemoDayOffsetChange}
        onTicketsChange={onTicketsChange}
      />

      <section>
        <p className="ui-label">Data</p>
        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            className="btn-outline w-full"
            onClick={() => exportTickets(tickets)}
          >
            Export inbox
          </button>
          <label className="btn-outline block w-full cursor-pointer text-center">
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={onPickFile}
            />
            Import inbox
          </label>
          {importError ? (
            <p className="text-sm text-red-700">{importError}</p>
          ) : null}
          {!resetConfirm ? (
            <button
              type="button"
              className="btn-ghost w-full"
              onClick={() => setResetConfirm(true)}
            >
              Delete all messages
            </button>
          ) : (
            <div className="rounded-2xl border border-mail-border bg-mail-paper p-4">
              <p className="text-sm font-medium text-mail-text">
                This will delete all messages. Are you sure?
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  className="btn-primary flex-1"
                  onClick={onReset}
                >
                  Yes, delete all
                </button>
                <button
                  type="button"
                  className="btn-outline flex-1"
                  onClick={() => setResetConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <p className="text-xs text-mail-muted">
        {tickets.length} {tickets.length === 1 ? "message" : "messages"} stored
        locally on this device.
      </p>
    </div>
  );
}
