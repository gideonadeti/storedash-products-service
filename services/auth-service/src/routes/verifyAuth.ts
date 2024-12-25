import express from 'express';
import { validateOtp } from '../controllers/otpController';
const router = express.Router();

router.route('/verify').post(validateOtp);

export default router;
