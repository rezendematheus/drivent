import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const hotels = await hotelsService.getAllHotels();

    res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    next(error);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { hotelId } = req.params as { hotelId: string };
    const { userId } = req;
    const hotel = await hotelsService.getHotelById({ hotelId: Number(hotelId), userId });
    res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    next(error);
  }
}
