import type { Ticket } from "@/types/ticket";

/** Sample entries across journey stages (for tests or optional demo tooling). */
export function createDemoTickets(now: Date = new Date()): Ticket[] {
  const isoDaysAgo = (days: number) => {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - days);
    return d.toISOString();
  };

  const fresh: Ticket = {
    id: "DEMO0001",
    createdAt: isoDaysAgo(5),
    disappointment:
      "I was passed over for the role I had been preparing for all quarter.",
    learning: null,
    learningAt: null,
    silver: null,
    silverAt: null,
  };

  const atStop: Ticket = {
    id: "DEMO0002",
    createdAt: isoDaysAgo(35),
    disappointment:
      "A collaboration I counted on fell through at the last minute.",
    learning: null,
    learningAt: null,
    silver: null,
    silverAt: null,
  };

  const atDestination: Ticket = {
    id: "DEMO0003",
    createdAt: isoDaysAgo(95),
    disappointment: "I missed an important deadline and felt I let my team down.",
    learning:
      "I learned to ask for help earlier and to break work into smaller milestones.",
    learningAt: isoDaysAgo(65),
    silver: null,
    silverAt: null,
  };

  return [fresh, atStop, atDestination];
}
