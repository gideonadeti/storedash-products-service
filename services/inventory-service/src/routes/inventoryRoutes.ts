import express from 'express';
import {
  createProduct,
  getAllProduct,
} from '../controllers/inventoryController';

const router = express.Router();

router.get('/', getAllProduct);
router.post('/', createProduct);

export default router;
