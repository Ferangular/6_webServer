import { Request, Response } from 'express';
import { TicketService } from './ticket.service.js';

export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  getTickets = (_req: Request, res: Response): void => {
    res.json(this.ticketService.allTickets);
  };

  getLastTicketNumber = (_req: Request, res: Response): void => {
    res.json(this.ticketService.lastTicketNumber);
  };

  getPendingTickets = (_req: Request, res: Response): void => {
    res.json(this.ticketService.pendingTickets);
  };

  createTicket = (_req: Request, res: Response): void => {
    res.status(201).json(this.ticketService.createTicket());
  };

  drawTicket = (req: Request, res: Response): void => {
    const desk = req.params.desk?.trim();

    if (!desk) {
      res.status(400).json({ status: 'error', message: 'El escritorio es requerido' });
      return;
    }

    const result = this.ticketService.drawTicket(desk);
    res.status(result.status === 'ok' ? 200 : 409).json(result);
  };

  finishTicket = (req: Request, res: Response): void => {
    const result = this.ticketService.finishTicket(req.params.ticketId ?? '');
    res.status(result.status === 'ok' ? 200 : 404).json(result);
  };

  getWorkingTickets = (_req: Request, res: Response): void => {
    res.json(this.ticketService.lastWorkingTickets);
  };
}
