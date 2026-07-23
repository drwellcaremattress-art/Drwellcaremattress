import jwt from 'jsonwebtoken';
import { User, IUser } from './models/User';
import { connectDB } from './db';
import { NextRequest } from 'next/server';

export const protect = async (req: NextRequest): Promise<IUser | null> => {
  const authHeader = req.headers.get('authorization');
  let token;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };

      await connectDB();
      // Get user from token
      const user = await User.findById(decoded.id).select('-passwordHash');
      
      if (!user) {
        return null;
      }

      return user as IUser;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  return null;
};
