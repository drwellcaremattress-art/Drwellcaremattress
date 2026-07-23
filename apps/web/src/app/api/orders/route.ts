import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/lib/models/Order';
import { protect } from '@/lib/authMiddleware';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await protect(req);
    
    if (!user) {
      // Allow guest checkout if we want, but currently it's protected in express
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

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

    if (orderItems && orderItems.length === 0) {
      return NextResponse.json({ message: 'No order items' }, { status: 400 });
    }

    const order = new Order({
      orderNumber: `ORD-${Date.now()}`,
      userId: user._id,
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
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await protect(req);
    
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const orders = await Order.find({ userId: user._id });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
