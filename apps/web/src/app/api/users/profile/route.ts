import { NextRequest, NextResponse } from 'next/server';
import { protect } from '@/lib/authMiddleware';

export async function GET(req: NextRequest) {
  try {
    const user = await protect(req);
    
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
