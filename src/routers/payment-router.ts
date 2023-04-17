import { Router } from 'express';
import { authenticateToken, validateBody, validateQuery } from '@/middlewares';
import { ticketIdParamsSchema } from '@/schemas/tickets-schemas';
import { getPaymentInfo, postPaymentInfo } from '@/controllers/payment-controller';
import { paymentBodySchema } from '@/schemas/payment-schemas';

const paymentRouter = Router();

paymentRouter.get('', authenticateToken, validateQuery(ticketIdParamsSchema), getPaymentInfo);
paymentRouter.post('/process', authenticateToken, validateBody(paymentBodySchema), postPaymentInfo);

export { paymentRouter };
