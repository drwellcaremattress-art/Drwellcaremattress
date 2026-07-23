import express from 'express';
import { createProductReview, getProductReviews } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

// Note: We'll mount this route on /api/products/:id/reviews from index.ts, 
// so we need mergeParams to access :id
const router = express.Router({ mergeParams: true });

router.route('/').post(protect, createProductReview).get(getProductReviews);

export default router;
