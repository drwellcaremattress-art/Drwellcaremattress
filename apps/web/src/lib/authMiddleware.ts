import jwt from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';
import { User, IUser } from './models/User';
import { connectDB } from './db';
import { NextRequest } from 'next/server';

export const protect = async (req: NextRequest): Promise<IUser | null> => {
  await connectDB();
  const authHeader = req.headers.get('authorization');

  // 1. Check Bearer token (Mobile/API clients)
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (user) return user as IUser;
    } catch (error) {
      console.error('Bearer Auth Error:', error);
    }
  }

  // 2. Check NextAuth JWT cookie (Web session)
  try {
    const nextAuthToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || 'fallback-secret',
    });
    if (nextAuthToken?.email) {
      const user = await User.findOne({
        email: nextAuthToken.email.toLowerCase().trim(),
      }).select('-passwordHash');
      if (user) return user as IUser;
    }
  } catch (cookieErr) {
    console.error('NextAuth Token Error:', cookieErr);
  }

  return null;
};
