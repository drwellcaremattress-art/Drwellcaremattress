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
        message: 'Employee session not found',
        employee: null,
        invoices: [],
      }, { status: 200 });
    }

    const isEmployee = user.role === 'employee' || user.role === 'admin';
    if (!isEmployee) {
      return NextResponse.json({
        success: false,
        message: 'Access denied: not an employee',
        employee: null,
        invoices: [],
      }, { status: 200 });
    }

    const userEmail = (user.email || '').toLowerCase().trim();
    const orders = await Order.find({
      $or: [
        { employeeId: user._id },
        { employeeEmail: userEmail },
        { employeeName: user.name }
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
    return NextResponse.json({ success: false, message: error.message, invoices: [], employee: null }, { status: 200 });
  }
}
