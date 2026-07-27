import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { PRODUCT_CATALOG } from '@/lib/catalog';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const seedData = PRODUCT_CATALOG.map(p => ({
      slug: p.slug,
      name: p.title,
      category: p.category,
      status: p.status,
      firmness: p.firmness,
      description: p.description,
      benefits: p.benefits,
      images: p.images.map((url, idx) => ({ url, alt: `${p.title} - View ${idx + 1}`, position: idx + 1 })),
      variants: p.variants,
      warranty_years: p.warranty,
      originalPrice: p.originalPrice,
      sqftPrice: p.sqftPrice,
      thickness: p.thickness,
      ratingAvg: p.rating,
      ratingCount: p.reviews,
    }));

    await Product.deleteMany({});
    await Product.insertMany(seedData);
    return NextResponse.json({ message: `Database cleared and successfully seeded with all ${seedData.length} products!` });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

