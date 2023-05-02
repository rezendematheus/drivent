import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBooking, updateBooking, createBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter.get('/', authenticateToken, getBooking);
bookingRouter.post('/', authenticateToken, createBooking);
bookingRouter.put('/:bookingId', authenticateToken, updateBooking);

export { bookingRouter };
