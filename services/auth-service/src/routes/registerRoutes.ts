import express from 'express';
import {
  registerDriver,
  registerRetailer,
} from '../controllers/registerController';
import requireAuthentication from '../middlewares/authCheck';

const router = express.Router();

router.route('/driver').post(registerDriver);

router.route('/retailer').post(registerRetailer);
router.route('/retailer/:id').post(requireAuthentication, registerRetailer);

export default router;
