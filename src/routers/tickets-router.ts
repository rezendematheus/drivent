import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getAllTicketType, getAllUserTicket, postTicket } from '@/controllers';
import { ticketTypeIdSchema } from '@/schemas/tickets-schemas';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getAllTicketType);
ticketsRouter.get('/', authenticateToken, getAllUserTicket);
ticketsRouter.post('/', authenticateToken, validateBody(ticketTypeIdSchema), postTicket);

export { ticketsRouter };
