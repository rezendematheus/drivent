import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { paymentRequest } from '@/protocols';
import paymentService from '@/services/payment-service';

export { getPaymentInfo, postPaymentInfo };

async function getPaymentInfo(req: AuthenticatedRequest, res: Response) {
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

async function postPaymentInfo(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const paymentRequest = req.body as paymentRequest;
    const createdPaymenmt = await paymentService.postPaymentInfo({ userId, paymentRequest });

    res.status(httpStatus.OK).send(createdPaymenmt);
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
