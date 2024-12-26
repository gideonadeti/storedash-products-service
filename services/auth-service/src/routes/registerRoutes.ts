import express from 'express';
import {
  addRetailerProfile,
  getRetailerProfileByUid,
  registerDriver,
  registerRetailer,
  searchRetailerProfile,
} from '../controllers/registerController';
import requireAuthentication from '../middlewares/authCheck';

const router = express.Router();

router.route('/driver').post(registerDriver);

router
  .route('/retailer')
  .post(registerRetailer)
  .get(requireAuthentication, searchRetailerProfile);

router
  .route('/retailer/:uid')
  .post(requireAuthentication, addRetailerProfile)
  .get(requireAuthentication, getRetailerProfileByUid);

export default router;
