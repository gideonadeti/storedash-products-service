import express from 'express';
import { validateOtp } from '../controllers/auth.controller';

const router = express.Router();

router.route('/').post(validateOtp);

export default router;
