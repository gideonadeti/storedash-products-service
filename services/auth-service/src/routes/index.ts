import express from 'express';
import registerRoutes from './registerRoutes';
import verifyAuth from './verifyAuth';

const router = express.Router();

router.use('/', registerRoutes);
router.use('/', verifyAuth);

export default router;
