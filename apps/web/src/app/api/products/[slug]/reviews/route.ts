import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Review } from '@/lib/models/Review';
import { Product } from '@/lib/models/Product';
import { User } from '@/lib/models/User';
import { protect } from '@/lib/authMiddleware';

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const user = await protect(req);
    
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const { rating, body, title } = await req.json();
    
    // In Express it used product ID instead of slug, but the URL param here is slug
    // We should probably find the product by ID or Slug.
    // Express path was /api/products/:id/reviews, let's assume params.slug is the productId
    const productId = params.slug;

    let product = null;
    if (productId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(productId);
    }
    if (!product) {
      product = await Product.findOne({ slug: productId }) || await Product.findOne({ slug: productId.replace(/-\d+(inch|")?$/i, '') });
    }

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const targetId = product.slug || productId;

    const alreadyReviewed = await Review.findOne({
      productId: targetId,
      userId: user._id,
    });

    if (alreadyReviewed) {
      return NextResponse.json({ message: 'Product already reviewed' }, { status: 400 });
    }

    const review = await Review.create({
      productId: targetId,
      userId: user._id,
      rating: Number(rating),
      body: body || 'Great product',
      title: title || 'Review',
      verifiedPurchase: true,
    });

    const allReviews = await Review.find({ productId: targetId });
    
    product.ratingCount = allReviews.length;
    product.ratingAvg =
      allReviews.reduce((acc: number, item: any) => item.rating + acc, 0) / (allReviews.length || 1);

    await product.save();

    return NextResponse.json({ message: 'Review added', review }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const productId = params.slug;
    
    const baseSlug = productId.replace(/-\d+(inch|")?$/i, '');
    const queryIds = [productId];
    if (baseSlug !== productId) {
      queryIds.push(baseSlug);
    }

    const reviews = await Review.find({ productId: { $in: queryIds } }).populate('userId', 'name').sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
