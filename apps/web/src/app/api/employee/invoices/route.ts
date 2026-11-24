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

    const isEmployee = user.role === 'employee' || user.role === 'admin';
    if (!isEmployee) {
      return NextResponse.json({ success: false, message: 'Access denied: not an employee' }, { status: 403 });
    }

    const orders = await Order.find({
      $or: [
        { employeeId: user._id },
        { employeeEmail: email }
      ]
    }).sort({ createdAt: -1 }).lean();

    const employeeData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      department: user.employeeDetails?.department || 'Sales & Billing',
      designation: user.employeeDetails?.designation || 'Sales Executive',
      employeeCode: user.employeeDetails?.employeeCode || `EMP-${user._id.toString().slice(-4).toUpperCase()}`,
    };

    return NextResponse.json({
      success: true,
      employee: employeeData,
      invoices: JSON.parse(JSON.stringify(orders)),
    });
  } catch (error: any) {
    console.error('Error in /api/employee/invoices:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
