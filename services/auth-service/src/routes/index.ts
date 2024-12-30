import express from 'express';
import authUser from './auth-user.route';
import auth from './auth.router';
import retailerRoutes from './retailer.route';
const router = express.Router();

router.use('/', authUser);
router.use('/', retailerRoutes);
router.use('/', auth);

export default router;
