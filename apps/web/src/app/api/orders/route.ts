import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/lib/db';
import { Order } from '@/lib/models/Order';

const SECRET = process.env.NEXTAUTH_SECRET || process.env.SECRET || 'fallback-secret';

export async function GET(req: NextRequest) {
  try {
    // getToken reads the JWT cookie directly — works reliably in all Route Handler environments
    const token = await getToken({ req, secret: SECRET });

    if (!token?.email) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({
      $or: [
        { userEmail: token.email },
        { 'shippingAddress.email': token.email },
      ],
    }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('[GET /api/orders]', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET });

    if (!token?.email) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();

    const {
      orderNumber,
      orderItems,
      customerName,
      customerPhone,
      shippingAddress,
      billingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = await req.json();

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ message: 'No order items' }, { status: 400 });
    }

    const order = new Order({
      orderNumber: orderNumber || `ORD-${Date.now()}`,
      userEmail: token.email,
      customerName,
      customerPhone,
      items: orderItems,
      shippingAddress,
      billingAddress,
      paymentGateway: paymentMethod || 'razorpay',
      paymentMethod: paymentMethod || 'razorpay',
      paymentStatus: paymentMethod === 'cod' ? 'cod' : 'paid',
      subtotal: itemsPrice,
      tax: taxPrice,
      shipping: shippingPrice,
      total: totalPrice,
    });

    const createdOrder = await order.save();
    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/orders]', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
