import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentService from '@/services/payment-service';

export { getPaymentInfo };

async function getPaymentInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { ticketId } = req.query as { ticketId: string };
    const userId = req.userId;
    const paymentInfo = await paymentService.getPaymentInfo({ userId, ticketId: parseInt(ticketId) });

    res.status(httpStatus.OK).send(paymentInfo);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.status(httpStatus.UNAUTHORIZED).send({
        message: error.message,
      });
    }

    if (error.name === 'NotFoundError') {
      return res.status(httpStatus.NOT_FOUND).send({
        message: error.message,
      });
    }
  }
}
