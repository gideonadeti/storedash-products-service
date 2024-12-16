import express from 'express';
import orderRoutes from './orderRoutes';

const router = express.Router();

router.use('/users', orderRoutes);

export default router;
