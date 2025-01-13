import multer from 'multer';
import { Router } from 'express';

import { handleProductsPost } from '../controllers/products';

const router = Router();
const upload = multer({ dest: 'temp/' });

router.post('/', upload.array('images', 5), handleProductsPost);

export default router;
