import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { Review } from '@/lib/models/Review';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    // Find the product by slug or id
    const isId = mongoose.Types.ObjectId.isValid(params.slug);
    const productQuery = isId ? { _id: params.slug } : { slug: params.slug };
    const product = await Product.findOne(productQuery).select('_id');
    
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const reviews = await Review.find({ productId: product._id }).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('GET /api/products/[slug]/reviews error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    // Find the product by slug or id
    const isId = mongoose.Types.ObjectId.isValid(params.slug);
    const productQuery = isId ? { _id: params.slug } : { slug: params.slug };
    const product = await Product.findOne(productQuery);
    
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const body = await req.json();
    const { userName, rating, title, comment, images, userId } = body;

    if (!userName || !rating || !title || !comment) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Determine verified purchase (for now, default true if they are logged in, or false if not)
    // You could query Orders here, but for simplicity we will just take what is passed
    // or assume logged in users are somewhat trusted for this MVP.
    const isVerifiedPurchase = !!userId; 

    const newReview = new Review({
      productId: product._id,
      userId,
      userName,
      rating: Number(rating),
      title,
      comment,
      images: images || [],
      isVerifiedPurchase
    });

    await newReview.save();

    // Recalculate average rating
    const allReviews = await Review.find({ productId: product._id });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? (totalRating / allReviews.length).toFixed(1) : 0;

    product.ratingAvg = Number(avgRating);
    product.ratingCount = allReviews.length;
    await product.save();

    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/products/[slug]/reviews error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
