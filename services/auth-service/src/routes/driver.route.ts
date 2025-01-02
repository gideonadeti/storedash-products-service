import express from 'express';

import requireAuthentication from '../middlewares/authCheck';

import { catchAsync } from '../utils/catchAsync';
import {
  addVehicleData,
  createDriverProfile,
  getDriverProfileByUid,
  getDriverVehicleData,
  updateDriverProfile,
} from '../controllers/driver.controller';

const router = express.Router();

router
  .route('/driver/vehicle')
  .post(requireAuthentication, catchAsync(addVehicleData))
  .get(requireAuthentication, catchAsync(getDriverVehicleData));
router
  .route('/driver/:accountId')
  .post(requireAuthentication, catchAsync(createDriverProfile))
  .patch(requireAuthentication, catchAsync(updateDriverProfile))
  .get(requireAuthentication, catchAsync(getDriverProfileByUid));

export default router;
