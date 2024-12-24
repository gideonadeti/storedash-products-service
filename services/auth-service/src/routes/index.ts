import express from 'express';
import registerRoutes from './registerRoutes';

const router = express.Router();

router.use('/register', registerRoutes);

export default router;
