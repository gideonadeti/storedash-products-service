import express from 'express';
import authUser from './auth-user.route';
import auth from './auth.route';
import retailerRoutes from './retailer.route';
import distributorRoutes from './distributor.route';
import driverRoutes from './driver.route';
const router = express.Router();

router.use('/', auth);
router.use('/', authUser);
router.use('/', retailerRoutes);
router.use('/', distributorRoutes);
router.use('/', driverRoutes);

export default router;
