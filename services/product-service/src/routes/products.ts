import { Router } from 'express';

import { handleProductsGet } from '../controllers/products';

const router = Router();

router.get('/', handleProductsGet);

export default router;
