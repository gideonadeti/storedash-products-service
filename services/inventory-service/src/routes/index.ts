import express from 'express';
import inventoryRoutes from './inventoryRoutes';

const router = express.Router();

router.use('/users', inventoryRoutes);

export default router;
