import jwt from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
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

  // 2. Check NextAuth Session via getServerSession (standard for Next.js App Router)
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const cleanEmail = session.user.email.toLowerCase().trim();
      const user = await User.findOne({
        $or: [
          { email: cleanEmail },
          { email: new RegExp(`^${cleanEmail}$`, 'i') },
          { phone: cleanEmail },
          ...((session.user as any)?.id ? [{ _id: (session.user as any).id }] : [])
        ]
      }).select('-passwordHash');
      if (user) return user as IUser;
    }
  } catch (sessErr) {
    console.error('getServerSession Error:', sessErr);
  }

  // 3. Fallback: Check NextAuth JWT cookie
  try {
    const nextAuthToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (nextAuthToken?.email) {
      const cleanEmail = (nextAuthToken.email as string).toLowerCase().trim();
      const user = await User.findOne({
        $or: [
          { email: cleanEmail },
          { email: new RegExp(`^${cleanEmail}$`, 'i') },
          { phone: cleanEmail },
          ...(nextAuthToken.sub ? [{ _id: nextAuthToken.sub }] : [])
        ]
      }).select('-passwordHash');
      if (user) return user as IUser;
    }
  } catch (cookieErr) {
    console.error('NextAuth Token Error:', cookieErr);
  }

  // 4. Fallback: check query param if email is provided by authenticated client
  try {
    const url = new URL(req.url);
    const emailParam = url.searchParams.get('email');
    if (emailParam) {
      const cleanEmail = emailParam.toLowerCase().trim();
      const user = await User.findOne({
        $or: [
          { email: cleanEmail },
          { email: new RegExp(`^${cleanEmail}$`, 'i') },
          { phone: cleanEmail },
        ]
      }).select('-passwordHash');
      if (user) return user as IUser;
    }
  } catch (e) {}

  return null;
};
