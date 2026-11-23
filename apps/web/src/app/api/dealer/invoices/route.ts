import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Order } from '@/lib/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    await connectDB();
    const email = session.user.email.toLowerCase().trim();
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const isDealer = user.role === 'dealer' || user.role === 'admin';
    if (!isDealer) {
      return NextResponse.json({ success: false, message: 'Access denied: not a dealer' }, { status: 403 });
    }

    const orders = await Order.find({
      $or: [
        { dealerId: user._id },
        { dealerEmail: email }
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
      dealer: dealerData,
      invoices: JSON.parse(JSON.stringify(orders)),
    });
  } catch (error: any) {
    console.error('Error in /api/dealer/invoices:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
