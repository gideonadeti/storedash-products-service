import express from 'express';
import {
  registerDriver,
  registerRetailer,
} from '../controllers/registerController';

const router = express.Router();

router.route('/driver').post(registerDriver);

router.route('/retailer').post(registerRetailer);
router.route('/retailer/:id').post(registerRetailer);

export default router;
