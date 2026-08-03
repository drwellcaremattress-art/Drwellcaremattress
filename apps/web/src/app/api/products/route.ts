import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { z } from 'zod';

const querySchema = z.object({
  category: z.string().optional(),
  firmness: z.string().optional(),
  sort: z.string().optional(),
  admin: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    
    let query: any = {};
    try {
      query = querySchema.parse(searchParams);
    } catch (e) {
      query = searchParams;
    }

    let filter: any = { status: 'active' };
    
    if (query.admin === 'true') {
      delete filter.status;
    }

    if (query.category) filter.category = query.category;
    if (query.firmness) filter.firmness = query.firmness;

    const products = await Product.find(filter);
    // Force schema reload
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.category || !body.firmness) {
      return NextResponse.json(
        { message: 'name, category, and firmness are required.' },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Ensure slug is unique — append timestamp suffix if already exists
    const existingProduct = await Product.findOne({ slug: body.slug });
    if (existingProduct) {
      body.slug = `${body.slug}-${Date.now().toString().slice(-4)}`;
    }

    // Set defaults
    body.brand = body.brand || 'Dr.Well Care';
    body.status = body.status || 'draft';
    body.warranty_years = body.warranty_years || 10;
    body.trialNights = body.trialNights || 100;
    body.ratingAvg = body.ratingAvg || 0;
    body.ratingCount = body.ratingCount || 0;

    const newProduct = new Product(body);
    await newProduct.save();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/products error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ message: 'A product with this slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
