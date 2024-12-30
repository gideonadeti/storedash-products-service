import express from 'express';
import { registerUser } from '../controllers/auth-user.controller';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();

router.route('/auth').post(catchAsync(registerUser));
// router.route('/auth/verify').post(catchAsync(registerUser));

export default router;
