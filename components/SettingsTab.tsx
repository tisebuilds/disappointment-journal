"use client";

import { clearTickets, exportTickets, importTickets } from "@/lib/tickets";
import type { Ticket } from "@/types/ticket";
import { useState } from "react";

export function SettingsTab({
  tickets,
  onTicketsChange,
}: {
  tickets: Ticket[];
  onTicketsChange: (next: Ticket[]) => void;
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
      className="feed-scroll flex flex-col gap-10"
      style={{ paddingTop: "calc(16px + env(safe-area-inset-top, 0px))" }}
    >
      <section>
        <p className="ui-label text-ticket-t3">About</p>
        <h2 className="mt-3 font-serif text-3xl font-black text-ticket-t1">
          Disappointment Capsule
        </h2>
        <p className="mt-4 font-mono text-[10px] font-normal uppercase leading-relaxed tracking-[0.2em] text-ticket-t2">
          Seal a disappointment. Reflect at 30 days. Find the silver lining at
          90.
        </p>
      </section>

      <section>
        <p className="ui-label text-ticket-t3">Data</p>
        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            className="btn-outline w-full"
            onClick={() => exportTickets(tickets)}
          >
            Save backup
          </button>
          <label className="btn-outline block w-full cursor-pointer text-center">
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={onPickFile}
            />
            Load backup
          </label>
          {importError ? (
            <p className="font-mono text-[10px] text-red-800">{importError}</p>
          ) : null}
          {!resetConfirm ? (
            <button
              type="button"
              className="btn-ghost w-full"
              onClick={() => setResetConfirm(true)}
            >
              Reset all
            </button>
          ) : (
            <div className="border border-ticket-border bg-ticket-paper p-4">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-ticket-t2">
                This will delete all entries. Are you sure?
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
    </div>
  );
}
