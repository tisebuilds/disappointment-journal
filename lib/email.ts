import type { Ticket } from "@/types/ticket";

export function deriveSubject(text: string, max = 72): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t) return "No subject";
  const firstSentence = t.split(/[.!?\n]/)[0]?.trim() ?? t;
  const candidate = firstSentence.length <= max ? firstSentence : t;
  if (candidate.length <= max) return candidate;
  return `${candidate.slice(0, max).trim()}…`;
}

export function emailSubject(ticket: Ticket): string {
  if (ticket.subject?.trim()) return ticket.subject.trim();
  return deriveSubject(ticket.disappointment);
}

export function emailSnippet(text: string, max = 120): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

export function formatInboxDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (sameDay) {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  });
}

export function formatMessageDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
