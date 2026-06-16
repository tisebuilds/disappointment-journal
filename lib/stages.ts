import { daysBetween } from "@/lib/demo";
import type { Ticket, TicketStage } from "@/types/ticket";

export function daysSince(iso: string): number {
  return daysBetween(iso);
}

export function stageFor(ticket: Ticket): TicketStage {
  const d = daysSince(ticket.createdAt);
  if (!ticket.learning && d >= 30) return "stop";
  if (ticket.learning && !ticket.silver && d >= 90) return "destination";
  if (ticket.silver) return "arrived";
  return "departed";
}

export const STAGE_META: Record<
  TicketStage,
  { label: string; short: string; dot: string; accent: string }
> = {
  departed: {
    label: "Waiting",
    short: "WAITING",
    dot: "#c4c4c0",
    accent: "#5c5c58",
  },
  stop: {
    label: "Reply due",
    short: "REPLY DUE",
    dot: "#2563eb",
    accent: "#1d4ed8",
  },
  destination: {
    label: "Final reply",
    short: "FINAL REPLY",
    dot: "#2563eb",
    accent: "#1d4ed8",
  },
  arrived: {
    label: "Complete",
    short: "COMPLETE",
    dot: "#8a8a86",
    accent: "#5c5c58",
  },
};

export function needsLearning(ticket: Ticket): boolean {
  return stageFor(ticket) === "stop";
}

export function needsSilver(ticket: Ticket): boolean {
  return stageFor(ticket) === "destination";
}

export function isCheckpointReady(ticket: Ticket): boolean {
  const s = stageFor(ticket);
  return s === "stop" || s === "destination";
}
