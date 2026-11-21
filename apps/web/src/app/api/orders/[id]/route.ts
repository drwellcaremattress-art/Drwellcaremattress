import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order } from '@/lib/models/Order';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = params;

    // If advanceAmount is being updated, automatically recompute balanceAmount
    if (body.advanceAmount !== undefined) {
      const existingOrder = await Order.findById(id);
      if (existingOrder) {
        const orderTotal = Number(existingOrder.total || 0);
        const advance = Math.max(0, Number(body.advanceAmount) || 0);
        body.advanceAmount = advance;
        body.balanceAmount = Math.max(0, orderTotal - advance);

        // If balance is 0, mark as paid
        if (body.balanceAmount === 0 && orderTotal > 0) {
          body.isPaid = true;
          body.paymentStatus = 'paid';
        } else if (advance > 0) {
          body.paymentStatus = 'advance_paid';
        }
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('[PUT /api/orders/[id]]', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('[DELETE /api/orders/[id]]', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
