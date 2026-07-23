import express from 'express';
import { addOrderItems, getMyOrders } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);

export default router;
