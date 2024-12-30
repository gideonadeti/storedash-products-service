import express from 'express';

import requireAuthentication from '../middlewares/authCheck';
import {
  createRetailProfile,
  getRetailerProfileByUid,
  updateRetailerProfile,
} from '../controllers/retailer.controller';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();

// router.route('/retailer');

router
  .route('/retailer/:accountId')
  .post(requireAuthentication, catchAsync(createRetailProfile))
  .patch(requireAuthentication, catchAsync(updateRetailerProfile))
  .get(requireAuthentication, catchAsync(getRetailerProfileByUid));

export default router;
