import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ message: 'Email and new password are required' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user) {
      user.passwordHash = passwordHash;
      await user.save();
    } else {
      // If user is not yet in MongoDB, create account seamlessly so password reset always works
      const namePart = email.split('@')[0];
      const displayName = namePart
        .replace(/[0-9]/g, '')
        .replace(/[._-]/g, ' ')
        .trim() || 'Dr Well Customer';
      
      const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

      user = await User.create({
        name: capitalizedName,
        email: email.toLowerCase().trim(),
        passwordHash,
      });
    }

    return NextResponse.json({
      message: 'Password reset successful',
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString()),
    }, { status: 200 });

  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json({ message: error.message || 'Server error during password reset' }, { status: 500 });
  }
}
