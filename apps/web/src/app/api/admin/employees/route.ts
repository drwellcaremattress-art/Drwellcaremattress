import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Order } from '@/lib/models/Order';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// GET: Fetch all registered employees + billing/invoice stats
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const employeesRaw = await User.find({ role: 'employee' })
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    // Fetch order aggregation per employee
    const employeeIds = employeesRaw.map((e: any) => e._id);
    const employeeEmails = employeesRaw.map((e: any) => e.email.toLowerCase());

    const orders = await Order.find({
      $or: [
        { employeeId: { $in: employeeIds } },
        { employeeEmail: { $in: employeeEmails } }
      ]
    }).select('employeeId employeeEmail total orderStatus createdAt').lean();

    const employees = employeesRaw.map((employee: any) => {
      const employeeOrders = orders.filter((o: any) => 
        (o.employeeId && o.employeeId.toString() === employee._id.toString()) ||
        (o.employeeEmail && o.employeeEmail.toLowerCase() === employee.email.toLowerCase())
      );
      const totalRevenue = employeeOrders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
      return {
        ...employee,
        totalInvoices: employeeOrders.length,
        totalRevenue,
      };
    });

    return NextResponse.json({ success: true, employees });
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST: Create a new employee account (Admin only)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      name,
      email,
      password,
      phone,
      department = 'Sales & Billing',
      designation = 'Sales Executive',
      employeeCode,
    } = body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Employee name, username/email, and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, message: `An account with email/username "${cleanEmail}" already exists.` },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password.trim(), 10);
    const generatedCode = (employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`).trim();

    const newEmployee = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: (phone || '').trim(),
      passwordHash,
      role: 'employee',
      authProvider: 'local',
      employeeDetails: {
        department: (department || 'Sales & Billing').trim(),
        designation: (designation || 'Sales Executive').trim(),
        employeeCode: generatedCode,
        status: 'active',
      },
    });

    return NextResponse.json({
      success: true,
      message: `Employee "${name}" created successfully.`,
      employee: {
        _id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email,
        phone: newEmployee.phone,
        role: newEmployee.role,
        employeeDetails: newEmployee.employeeDetails,
        createdAt: (newEmployee as any).createdAt,
      },
      credentials: {
        name: newEmployee.name,
        email: newEmployee.email,
        password: password.trim(),
        department: newEmployee.employeeDetails?.department,
        designation: newEmployee.employeeDetails?.designation,
        employeeCode: newEmployee.employeeDetails?.employeeCode,
        loginUrl: '/login',
      },
    });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create employee' },
      { status: 500 }
    );
  }
}

// DELETE: Remove employee by id
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Employee ID is required' },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete employee' },
      { status: 500 }
    );
  }
}
