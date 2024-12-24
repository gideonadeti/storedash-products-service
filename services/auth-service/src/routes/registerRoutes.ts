import express from 'express';
import { registerDriver } from '../controllers/registerController';

const router = express.Router();

// router.post('/admin', getAllUsers);
router.post('/driver', registerDriver);
// router.post('/distributor', getAllUsers);
// router.post('/retailer', getAllUsers);

export default router;
