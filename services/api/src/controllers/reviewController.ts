import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { Product } from '../models/Product';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, body, title } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      productId,
      userId: req.user?._id,
    });

    if (alreadyReviewed) {
      res.status(400).json({ message: 'Product already reviewed' });
      return;
    }

    const review = await Review.create({
      productId,
      userId: req.user?._id,
      rating: Number(rating),
      body: body || 'Great product',
      title: title || 'Review',
      verifiedPurchase: true, // Assuming for now
    });

    // Update product rating
    const allReviews = await Review.find({ productId });
    
    product.ratingCount = allReviews.length;
    product.ratingAvg =
      allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    await product.save();

    res.status(201).json({ message: 'Review added', review });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ productId: req.params.id }).populate('userId', 'name');
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
