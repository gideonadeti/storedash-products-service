import multer from 'multer';
import { Router } from 'express';

import {
  handleProductsPost,
  handleProductsGet,
  handleProductsPut,
  handleProductDelete,
} from '../controllers/products';

const router = Router();
const upload = multer({ dest: 'temp/' });

router.post('/', upload.array('images', 5), handleProductsPost);
router.get('/', handleProductsGet);
router.put('/:productId', handleProductsPut);
router.delete('/:productId', handleProductDelete);

export default router;
