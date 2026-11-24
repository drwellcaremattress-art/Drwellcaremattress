import { NextRequest, NextResponse } from 'next/server';
import { protect } from '@/lib/authMiddleware';

export const dynamic = 'force-dynamic';

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
      phone: user.phone || '',
      dob: (user as any).dob || '',
      gender: (user as any).gender || '',
      firmnessPref: (user as any).firmnessPref || '',
      sleepPosition: (user as any).sleepPosition || '',
      backPainRelief: (user as any).backPainRelief || '',
      role: user.role || 'user',
      addresses: user.addresses || [],
      dealerDetails: (user as any).dealerDetails || null,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  try {
    const user = await protect(req);
    
    if (!user) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Update fields if provided
    if (body.name || body.fullName) user.name = body.name || body.fullName;
    if (body.phone !== undefined) user.phone = body.phone;
    if (body.dob !== undefined) (user as any).dob = body.dob;
    if (body.gender !== undefined) (user as any).gender = body.gender;
    if (body.firmnessPref !== undefined) (user as any).firmnessPref = body.firmnessPref;
    if (body.sleepPosition !== undefined) (user as any).sleepPosition = body.sleepPosition;
    if (body.backPainRelief !== undefined) (user as any).backPainRelief = body.backPainRelief;
    if (body.addresses) user.addresses = body.addresses;
    
    await user.save();

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      dob: (user as any).dob || '',
      gender: (user as any).gender || '',
      firmnessPref: (user as any).firmnessPref || '',
      sleepPosition: (user as any).sleepPosition || '',
      backPainRelief: (user as any).backPainRelief || '',
      role: user.role || 'user',
      addresses: user.addresses || [],
      dealerDetails: (user as any).dealerDetails || null,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
