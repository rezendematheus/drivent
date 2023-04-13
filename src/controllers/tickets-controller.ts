import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export { getAllTicketType, getAllUserTicket, postTicket };

async function getAllTicketType(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const allTicketType = (await ticketsService.getAllTicketType()) || [];
    res.status(200).send(allTicketType);
  } catch (error) {
    next(error);
  }
}

async function getAllUserTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const allUserTicket = await ticketsService.getAllUserTicket({ userId });
    res.status(200).send(allUserTicket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
    /* console.log(error);
    next(error); */
  }
}

async function postTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const { ticketTypeId } = req.body as { ticketTypeId: number };
    const userId = req.userId;
    const createdTicket = await ticketsService.postUserTicket({ userId, ticketTypeId });
    res.status(201).send(createdTicket);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
