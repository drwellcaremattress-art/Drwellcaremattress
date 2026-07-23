import express from 'express';
import { getProducts, getProductBySlug } from '../controllers/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

export default router;
