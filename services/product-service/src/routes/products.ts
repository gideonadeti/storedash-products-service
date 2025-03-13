import multer from 'multer';
import { Router } from 'express';

import {
  handleProductsPost,
  handleProductsGet,
  handleProductGet,
  handleCategoriesGet,
  handleSubCategoriesGet,
  handleProductsPut,
  handleProductsPatch,
  handleProductsDelete,
} from '../controllers/products';

const router = Router();
const upload = multer({ dest: 'temp/' });

router.post('/', upload.array('images', 5), handleProductsPost);
router.get('/', handleProductsGet);
router.get('/categories', handleCategoriesGet);
router.get('/sub-categories', handleSubCategoriesGet);
router.get('/:productId', handleProductGet);
router.put('/:productId', handleProductsPut);
router.patch('/:productId', upload.array('images', 5), handleProductsPatch);
router.delete('/:productId', handleProductsDelete);

export default router;
