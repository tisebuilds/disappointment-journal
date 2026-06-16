export type TicketStage = "departed" | "stop" | "destination" | "arrived";

export interface Ticket {
  id: string;
  createdAt: string;
  disappointment: string;
  learning: string | null;
  learningAt: string | null;
  silver: string | null;
  silverAt: string | null;
}
