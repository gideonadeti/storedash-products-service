import express from 'express';

import requireAuthentication from '../middlewares/authCheck';
import {
  getDistributorProfileByUid,
  createDistributorProfile,
  updateDistributorerProfile,
} from '../controllers/distributor.controller';
import { catchAsync } from '../utils/catchAsync';

const router = express.Router();

router
  .route('/distributor/:accountId')
  .post(requireAuthentication, catchAsync(createDistributorProfile))
  .patch(requireAuthentication, catchAsync(updateDistributorerProfile))
  .get(requireAuthentication, catchAsync(getDistributorProfileByUid));

export default router;
