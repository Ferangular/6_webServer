export interface Ticket {
  id: string;
  number: number;
  createdAt: Date;
  handledAtDesk?: string;
  handledAt?: Date;
  done: boolean;
}

export interface TicketResult {
  status: 'ok' | 'error';
  ticket?: Ticket;
  message?: string;
}
