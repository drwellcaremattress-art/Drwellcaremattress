import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Order } from '@/lib/models/Order';
import { protect } from '@/lib/authMiddleware';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    let user: any = await protect(req);

    if (!user) {
      const session = await getServerSession(authOptions);
      const url = new URL(req.url);
      const emailQuery = url.searchParams.get('email');
      const emailOrIdent = session?.user?.email || emailQuery;

      if (emailOrIdent) {
        const clean = emailOrIdent.toLowerCase().trim();
        user = await User.findOne({
          $or: [
            { email: clean },
            { email: new RegExp(`^${clean}$`, 'i') },
            { phone: clean },
            ...((session?.user as any)?.id ? [{ _id: (session?.user as any).id }] : [])
          ]
        }).lean();
      }
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Dealer session not found',
        dealerInfo: null,
        orders: [],
      }, { status: 200 });
    }

    const isDealer = user.role === 'dealer' || user.role === 'admin';
    if (!isDealer) {
      return NextResponse.json({
        success: false,
        message: 'Access denied: not a dealer',
        dealerInfo: null,
        orders: [],
      }, { status: 200 });
    }

    const userEmail = (user.email || '').toLowerCase().trim();
    const orders = await Order.find({
      $or: [
        { dealerId: user._id },
        { dealerEmail: userEmail }
      ]
    }).sort({ createdAt: -1 }).lean();

    const dealerData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      storeName: user.dealerDetails?.storeName || `${user.name}'s Store`,
      city: user.dealerDetails?.city || 'Bangalore',
      state: user.dealerDetails?.state || 'Karnataka',
      gstNumber: user.dealerDetails?.gstNumber || '',
      address: user.dealerDetails?.address || '',
    };

    return NextResponse.json({
      success: true,
      dealerInfo: dealerData,
      orders: JSON.parse(JSON.stringify(orders)),
    });
  } catch (error: any) {
    console.error('Error in /api/dealer/invoices:', error);
    return NextResponse.json({ success: false, message: error.message, orders: [], dealerInfo: null }, { status: 200 });
  }
}
