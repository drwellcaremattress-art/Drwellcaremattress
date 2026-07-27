import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Order } from '@/lib/models/Order';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();

    // Find orders by email stored on order, or by userEmail field
    const orders = await Order.find({
      $or: [
        { userEmail: session.user.email },
        { 'shippingAddress.email': session.user.email },
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
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    await connectDB();

    const {
      orderItems,
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
      orderNumber: `ORD-${Date.now()}`,
      userEmail: session.user.email,
      items: orderItems,
      shippingAddress,
      billingAddress,
      paymentGateway: paymentMethod,
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
