import express from 'express';
import registerRoutes from './registerRoutes';

const router = express.Router();

router.use('/', registerRoutes);

export default router;
