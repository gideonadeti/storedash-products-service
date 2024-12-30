import express from 'express';

import { catchAsync } from '../utils/catchAsync';
import { validateOtp } from '../controllers/auth.controller';

const router = express.Router();

router.route('/auth/verify').post(catchAsync(validateOtp));

export default router;
