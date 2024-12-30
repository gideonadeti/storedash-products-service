import express from 'express';
import authUser from './auth-user.route';
import auth from './auth.router';
import retailerRoutes from './retailer.route';
import distributorRoutes from './distributor.route';
const router = express.Router();

router.use('/', auth);
router.use('/', authUser);
router.use('/', retailerRoutes);
router.use('/', distributorRoutes);

export default router;
