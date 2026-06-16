export type TicketStage = "departed" | "stop" | "destination" | "arrived";

export interface Ticket {
  id: string;
  createdAt: string;
  /** Email-style subject line; falls back to a snippet of disappointment. */
  subject?: string | null;
  disappointment: string;
  learning: string | null;
  learningAt: string | null;
  silver: string | null;
  silverAt: string | null;
}
