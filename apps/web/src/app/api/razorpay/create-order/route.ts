import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: 'Invalid amount' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ message: 'Razorpay API credentials not configured in environment' }, { status: 500 });
    }

    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;

    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt: receipt || `rec_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Razorpay Order Creation Error]', data);
      return NextResponse.json(
        { message: data.error?.description || 'Failed to create Razorpay order' },
        { status: res.status }
      );
    }

    return NextResponse.json({
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      key: keyId,
    });
  } catch (error: any) {
    console.error('[POST /api/razorpay/create-order]', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
