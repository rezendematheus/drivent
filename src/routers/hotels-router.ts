import { Router } from 'express';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();

hotelsRouter.get('/', authenticateToken);
hotelsRouter.get('/:id', authenticateToken);

export { hotelsRouter };
