"use client";

import { BottomNav, type NavTab } from "@/components/BottomNav";
import { DetailOverlay } from "@/components/DetailOverlay";
import { Feed } from "@/components/Feed";
import { NewEntryOverlay } from "@/components/NewEntryOverlay";
import { SettingsTab } from "@/components/SettingsTab";
import { loadTickets, saveTickets } from "@/lib/tickets";
import type { Ticket } from "@/types/ticket";
import { useEffect, useState } from "react";

type Screen = "feed" | "new" | "detail";

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newSheetKey, setNewSheetKey] = useState(0);
  const [tab, setTab] = useState<NavTab>("entries");
  const [screen, setScreen] = useState<Screen>("feed");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setTickets(loadTickets());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveTickets(tickets);
  }, [tickets, hydrated]);

  const activeTicket = activeId
    ? tickets.find((t) => t.id === activeId) ?? null
    : null;

  const openNew = () => {
    setNewSheetKey((k) => k + 1);
    setScreen("new");
  };

  const closeNew = () => {
    setScreen("feed");
  };

  const openDetail = (id: string) => {
    setActiveId(id);
    setScreen("detail");
  };

  const closeDetail = () => {
    setActiveId(null);
    setScreen("feed");
  };

  const addTicket = (ticket: Ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  const saveLearning = (id: string, learning: string) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, learning, learningAt: now }
          : t,
      ),
    );
  };

  const saveSilver = (id: string, silver: string) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, silver, silverAt: now } : t,
      ),
    );
  };

  return (
    <div className="app-shell">
      {tab === "entries" ? (
        <Feed
          tickets={tickets}
          onOpenEntry={openDetail}
          onCreateEntry={openNew}
        />
      ) : (
        <SettingsTab tickets={tickets} onTicketsChange={setTickets} />
      )}

      <BottomNav
        active={tab}
        onTab={(t) => {
          setTab(t);
          if (screen === "new") closeNew();
          if (screen === "detail") closeDetail();
        }}
        onAdd={() => {
          setTab("entries");
          openNew();
        }}
      />

      <NewEntryOverlay
        key={newSheetKey}
        open={screen === "new"}
        onClose={closeNew}
        onCreate={addTicket}
      />

      <DetailOverlay
        ticket={activeTicket}
        open={screen === "detail"}
        onClose={closeDetail}
        onSaveLearning={saveLearning}
        onSaveSilver={saveSilver}
      />
    </div>
  );
}
