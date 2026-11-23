import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Order } from '@/lib/models/Order';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET: Fetch all registered dealers + stats
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const dealersRaw = await User.find({ role: 'dealer' })
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    // Fetch order aggregation per dealer
    const dealerIds = dealersRaw.map((d: any) => d._id);
    const orders = await Order.find({
      $or: [
        { dealerId: { $in: dealerIds } },
        { dealerEmail: { $in: dealersRaw.map((d: any) => d.email) } }
      ]
    }).select('dealerId dealerEmail total orderStatus createdAt').lean();

    const dealers = dealersRaw.map((dealer: any) => {
      const dealerOrders = orders.filter((o: any) => 
        (o.dealerId && o.dealerId.toString() === dealer._id.toString()) ||
        (o.dealerEmail && o.dealerEmail.toLowerCase() === dealer.email.toLowerCase())
      );
      const totalRevenue = dealerOrders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
      return {
        ...dealer,
        totalOrders: dealerOrders.length,
        totalRevenue,
      };
    });

    return NextResponse.json({ success: true, dealers });
  } catch (error: any) {
    console.error('Error fetching dealers:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch dealers' },
      { status: 500 }
    );
  }
}

// POST: Create a new dealer account (Admin only)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      name,
      email,
      password,
      phone,
      storeName,
      city,
      state,
      gstNumber,
      address,
    } = body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Dealer name, email/username, and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `An account with email "${cleanEmail}" already exists.` },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password.trim(), 10);

    const newDealer = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: (phone || '').trim(),
      passwordHash,
      role: 'dealer',
      authProvider: 'local',
      dealerDetails: {
        storeName: (storeName || `${name.trim()}'s Store`).trim(),
        city: (city || '').trim(),
        state: (state || 'Karnataka').trim(),
        gstNumber: (gstNumber || '').trim(),
        address: (address || '').trim(),
        status: 'active',
      },
    });

    return NextResponse.json({
      success: true,
      message: `Dealer "${name}" created successfully.`,
      dealer: {
        _id: newDealer._id,
        name: newDealer.name,
        email: newDealer.email,
        phone: newDealer.phone,
        role: newDealer.role,
        dealerDetails: newDealer.dealerDetails,
        createdAt: (newDealer as any).createdAt,
      },
      credentials: {
        name: newDealer.name,
        storeName: newDealer.dealerDetails?.storeName,
        email: newDealer.email,
        password: password.trim(),
        loginUrl: '/login',
      },
    });
  } catch (error: any) {
    console.error('Error creating dealer:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create dealer' },
      { status: 500 }
    );
  }
}

// DELETE: Remove dealer by id
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Dealer ID is required' },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Dealer deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting dealer:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete dealer' },
      { status: 500 }
    );
  }
}
