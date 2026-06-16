import type { Ticket, TicketStage } from "@/types/ticket";

export function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
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
    label: "En Route",
    short: "EN ROUTE",
    dot: "#c4a882",
    accent: "#7a5c3a",
  },
  stop: {
    label: "1st Checkpoint",
    short: "1ST CHECKPOINT",
    dot: "#d4845a",
    accent: "#b0622a",
  },
  destination: {
    label: "Final Checkpoint",
    short: "FINAL CHECKPOINT",
    dot: "#7a9e7e",
    accent: "#4a7a54",
  },
  arrived: {
    label: "Arrived",
    short: "ARRIVED",
    dot: "#9e9e9e",
    accent: "#5a5a5a",
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
