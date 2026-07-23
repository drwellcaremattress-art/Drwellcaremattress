import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { z } from 'zod';

const querySchema = z.object({
  category: z.string().optional(),
  firmness: z.string().optional(),
  sort: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const searchParams = Object.fromEntries(url.searchParams.entries());
    
    // Fallback if parsing fails, but we'll try to parse correctly
    let query: any = {};
    try {
      query = querySchema.parse(searchParams);
    } catch (e) {
      // ignore strict validation errors for query params
      query = searchParams;
    }

    let filter: any = { status: 'active' };
    if (query.category) filter.category = query.category;
    if (query.firmness) filter.firmness = query.firmness;

    const products = await Product.find(filter);
    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
