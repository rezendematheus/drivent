import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllTicketType } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getAllTicketType);
ticketsRouter.get('/', authenticateToken);
ticketsRouter.post('/', authenticateToken);

export { ticketsRouter };
