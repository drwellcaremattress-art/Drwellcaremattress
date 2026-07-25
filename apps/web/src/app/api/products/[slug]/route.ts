import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';

import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const isAdmin = url.searchParams.get('admin') === 'true';

    let query: any = { slug: params.slug };
    if (mongoose.Types.ObjectId.isValid(params.slug)) {
      query = { _id: params.slug };
    }
    
    if (!isAdmin) {
      query.status = 'active';
    }
    
    const product = await Product.findOne(query);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    
    let query: any = { slug: params.slug };
    if (mongoose.Types.ObjectId.isValid(params.slug)) {
      query = { _id: params.slug };
    }
    
    // Prevent updating slug directly unless explicitly handled (to avoid duplicates/errors)
    if (body.slug) delete body.slug;
    
    const updatedProduct = await Product.findOneAndUpdate(
      query,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
