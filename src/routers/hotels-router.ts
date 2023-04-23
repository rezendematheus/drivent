import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotels, getHotelById } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter.get('/', authenticateToken, getAllHotels);
hotelsRouter.get('/:hotelId', authenticateToken, getHotelById);

export { hotelsRouter };
