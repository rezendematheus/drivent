import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllHotels, getHotelById } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter.get('/', authenticateToken, getAllHotels);
hotelsRouter.get('/:id', authenticateToken);

export { hotelsRouter };
