import { Router } from 'express';
import { TicketController } from './controller.js';
import { TicketService } from './ticket.service.js';

export class TicketRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new TicketController(new TicketService());

    router.get('/', controller.getTickets);
    router.get('/last', controller.getLastTicketNumber);
    router.get('/pending', controller.getPendingTickets);
    router.get('/working-on', controller.getWorkingTickets);
    router.post('/', controller.createTicket);
    router.get('/draw/:desk', controller.drawTicket);
    router.put('/done/:ticketId', controller.finishTicket);

    return router;
  }
}
