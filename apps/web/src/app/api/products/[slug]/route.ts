import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import mongoose from 'mongoose';

function buildQuery(slugOrId: string) {
  if (mongoose.Types.ObjectId.isValid(slugOrId)) {
    return { _id: slugOrId };
  }
  return { slug: slugOrId };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const isAdmin = url.searchParams.get('admin') === 'true';

    let query: any = buildQuery(params.slug);
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
    
    console.log('--- INCOMING PUT API VARIANTS PAYLOAD ---');
    console.log(JSON.stringify(body.variants, null, 2));
    
    const query = buildQuery(params.slug);

    // If slug is being updated, check for conflicts
    if (body.slug && body.slug !== params.slug) {
      const conflict = await Product.findOne({ slug: body.slug });
      if (conflict && conflict._id.toString() !== (query as any)._id?.toString()) {
        return NextResponse.json({ message: 'A product with this slug already exists.' }, { status: 409 });
      }
    }
    
    const updatedProduct = await Product.findOneAndUpdate(
      query,
      { $set: body },
      { new: true, runValidators: true } // SubDimensions are validated here
    );
    
    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    console.error('PUT /api/products error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    
    const query = buildQuery(params.slug);
    const deleted = await Product.findOneAndDelete(query);
    
    if (!deleted) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Product deleted successfully', slug: params.slug });
  } catch (error: any) {
    console.error('DELETE /api/products error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
