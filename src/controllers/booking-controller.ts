import { Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { forbiddenError } from '@/errors/forbidden-error';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const booking = await bookingService.getBookingByUserId(userId);

    res.status(httpStatus.OK).send(booking);
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const roomId = req.body.roomId as number;
    const createdBooking = await bookingService.createBooking({ userId, roomId });

    res.status(httpStatus.CREATED).send(createdBooking);
  } catch (error) {
    next(error);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req;
    const bookingId = Number(req.params?.bookingId);
    const roomId = req.body?.roomId as number;
    if (!roomId || !bookingId) throw forbiddenError();

    const updatedBooking = await bookingService.updateBookingRoom({ userId, bookingId, roomId });
    res.status(httpStatus.OK).send(updatedBooking);
  } catch (error) {
    next(error);
  }
}
