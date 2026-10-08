import { Uuid } from '../../config/uuid.adapter.js';
import { WebSocketServer } from '../websockets/websocket.server.js';
import { Ticket, TicketResult } from './ticket.interface.js';

export class TicketService {
  private tickets: Ticket[] = Array.from({ length: 6 }, (_, index) => ({
    id: Uuid.v4(),
    number: index + 1,
    createdAt: new Date(),
    done: false,
  }));
  private readonly workingTickets: Ticket[] = [];

  get allTickets(): Ticket[] {
    return this.tickets;
  }

  get pendingTickets(): Ticket[] {
    return this.tickets.filter((ticket) => !ticket.handledAtDesk && !ticket.done);
  }

  get lastWorkingTickets(): Ticket[] {
    return this.workingTickets.slice(0, 4);
  }

  get lastTicketNumber(): number {
    return this.tickets.at(-1)?.number ?? 0;
  }

  createTicket(): Ticket {
    const ticket: Ticket = {
      id: Uuid.v4(),
      number: this.lastTicketNumber + 1,
      createdAt: new Date(),
      done: false,
    };

    this.tickets.push(ticket);
    this.notifyPendingCount();
    return ticket;
  }

  drawTicket(desk: string): TicketResult {
    const ticket = this.pendingTickets[0];

    if (!ticket) {
      return { status: 'error', message: 'No hay tickets pendientes' };
    }

    ticket.handledAtDesk = desk;
    ticket.handledAt = new Date();
    this.workingTickets.unshift({ ...ticket });
    this.notifyPendingCount();
    this.notifyWorkingTickets();

    return { status: 'ok', ticket };
  }

  finishTicket(id: string): TicketResult {
    const ticket = this.tickets.find((currentTicket) => currentTicket.id === id);

    if (!ticket) {
      return { status: 'error', message: 'Ticket no encontrado' };
    }

    ticket.done = true;
    return { status: 'ok', ticket };
  }

  private notifyPendingCount(): void {
    WebSocketServer.instance.sendMessage('on-ticket-count-changed', this.pendingTickets.length);
  }

  private notifyWorkingTickets(): void {
    WebSocketServer.instance.sendMessage('on-working-changed', this.lastWorkingTickets);
  }
}
