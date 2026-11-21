import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

function buildQuery(slugOrId: string) {
  if (mongoose.Types.ObjectId.isValid(slugOrId)) {
    return { _id: slugOrId };
  }
  return { slug: slugOrId };
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const slug = params.slug;

    // 1. Check deduplication cookie: "drwell_viewed_products"
    const viewedCookie = req.cookies.get('drwell_viewed_products')?.value || '';
    const viewedSlugs = viewedCookie ? viewedCookie.split('|') : [];

    const query = buildQuery(slug);
    const existingProduct = await Product.findOne(query).select('slug viewCount name').lean();

    if (!existingProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const currentSlug = (existingProduct as any).slug || slug;
    const currentCount = (existingProduct as any).viewCount || 0;

    // 2. If already viewed in current session (within last 24h), do NOT increment DB
    if (viewedSlugs.includes(currentSlug)) {
      return NextResponse.json({
        success: true,
        alreadyViewed: true,
        viewCount: currentCount,
        message: 'View already recorded in this 24h session',
      });
    }

    // 3. New unique view: atomically increment viewCount in DB
    const updated = await Product.findOneAndUpdate(
      query,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).select('viewCount').lean();

    const newViewCount = (updated as any)?.viewCount ?? (currentCount + 1);

    // 4. Update the deduplication cookie (expires in 24 hours)
    const updatedSlugs = Array.from(new Set([...viewedSlugs, currentSlug]));
    const response = NextResponse.json({
      success: true,
      alreadyViewed: false,
      viewCount: newViewCount,
      message: 'Unique view recorded successfully',
    });

    response.cookies.set('drwell_viewed_products', updatedSlugs.join('|'), {
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('[POST /api/products/[slug]/view error]:', error);
    return NextResponse.json(
      { message: error.message || 'Server error tracking view' },
      { status: 500 }
    );
  }
}

