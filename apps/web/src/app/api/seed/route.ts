import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { PRODUCT_CATALOG } from '@/lib/catalog';

// PROTECTED: This route requires a secret to prevent accidental DB wipes
// Only run with: /api/seed?secret=DRWELL_SEED_2024
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== 'DRWELL_SEED_2024') {
    return NextResponse.json({ message: 'Forbidden. This route requires ?secret=DRWELL_SEED_2024 to prevent accidental data loss.' }, { status: 403 });
  }

  try {
    await connectDB();
    
    // Only seed products that don't already have Cloudinary images in the DB
    const existing = await Product.find({}).select('slug images layersImage').lean();
    const existingMap = new Map(existing.map((p: any) => [p.slug, p]));
    
    const seedData = PRODUCT_CATALOG.map(p => {
      const existingProduct = existingMap.get(p.slug) as any;
      // Preserve Cloudinary images if they already exist in DB
      const hasCloudinaryImages = existingProduct?.images?.some((i: any) => 
        (typeof i === 'string' ? i : i.url || '').includes('cloudinary')
      );
      
      return {
        slug: p.slug,
        name: p.title,
        category: p.category,
        status: p.status,
        firmness: p.firmness,
        description: p.description,
        benefits: p.benefits,
        // Only use catalog images if DB doesn't have Cloudinary images yet
        images: hasCloudinaryImages 
          ? existingProduct.images 
          : p.images.map((url, idx) => ({ url, alt: `${p.title} - View ${idx + 1}`, position: idx + 1 })),
        // Preserve existing layersImage
        layersImage: existingProduct?.layersImage || undefined,
        variants: p.variants,
        warranty_years: p.warranty,
        originalPrice: p.originalPrice,
        sqftPrice: p.sqftPrice,
        thickness: p.thickness,
        ratingAvg: p.rating,
        ratingCount: p.reviews,
      };
    });

    await Product.deleteMany({});
    await Product.insertMany(seedData);
    return NextResponse.json({ message: `Database seeded with all ${seedData.length} products! Cloudinary images preserved where available.` });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
