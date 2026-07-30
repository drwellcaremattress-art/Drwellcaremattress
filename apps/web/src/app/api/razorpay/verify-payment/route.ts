import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ message: 'Missing payment verification params', success: false }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json({ message: 'Razorpay secret key not configured', success: false }, { status: 500 });
    }

    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('[Razorpay Signature Mismatch]', { generatedSignature, razorpay_signature });
      return NextResponse.json({ message: 'Invalid payment signature. Verification failed.', success: false }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error: any) {
    console.error('[POST /api/razorpay/verify-payment]', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error', success: false }, { status: 500 });
  }
}
