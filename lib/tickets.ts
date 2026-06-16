import type { Ticket } from "@/types/ticket";

const KEY = "dtc_v1";

const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateTicketId(): string {
  let s = "";
  for (let i = 0; i < 8; i++) {
    s += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)]!;
  }
  return s;
}

export function loadTickets(): Ticket[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY) ?? "[]";
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTicketLike) as Ticket[];
  } catch {
    return [];
  }
}

function isTicketLike(x: unknown): x is Ticket {
  if (x === null || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.createdAt === "string" &&
    typeof o.disappointment === "string" &&
    (o.learning === null || typeof o.learning === "string") &&
    (o.learningAt === null || typeof o.learningAt === "string") &&
    (o.silver === null || typeof o.silver === "string") &&
    (o.silverAt === null || typeof o.silverAt === "string")
  );
}

export function saveTickets(tickets: Ticket[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(tickets));
}

export function exportTickets(tickets: Ticket[]): void {
  const blob = new Blob([JSON.stringify(tickets, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: `my-entries-${Date.now()}.json`,
  });
  a.click();
  URL.revokeObjectURL(url);
}

export function importTickets(file: File): Promise<Ticket[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string") {
          reject(new Error("Invalid file"));
          return;
        }
        const parsed = JSON.parse(text) as unknown;
        if (!Array.isArray(parsed)) {
          reject(new Error("Invalid file"));
          return;
        }
        const tickets = parsed.filter(isTicketLike) as Ticket[];
        saveTickets(tickets);
        resolve(tickets);
      } catch {
        reject(new Error("Invalid file"));
      }
    };
    reader.onerror = () => reject(new Error("Read failed"));
    reader.readAsText(file);
  });
}

export function clearTickets(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
