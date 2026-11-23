import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Product } from '@/lib/models/Product';
import { Order } from '@/lib/models/Order';
import DealerPortalClient from '@/components/dealer/DealerPortalClient';

export const dynamic = 'force-dynamic';

export default async function DealerPortalPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/dealer');
  }

  const role = (session.user as any)?.role;
  if (role !== 'dealer' && role !== 'admin') {
    redirect('/account');
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email?.toLowerCase().trim() }).lean();
  
  // Fetch active products
  const productsRaw = await Product.find({}).sort({ createdAt: -1 }).lean();
  const products = JSON.parse(JSON.stringify(productsRaw));

  // Orders created by this dealer
  const ordersRaw = await Order.find({
    $or: [
      { dealerId: user?._id },
      { dealerEmail: session.user.email?.toLowerCase().trim() },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  const orders = JSON.parse(JSON.stringify(ordersRaw));

  const dealerInfo = {
    id: user?._id?.toString() || '',
    name: user?.name || session.user.name || 'Authorized Dealer',
    email: user?.email || session.user.email || '',
    phone: user?.phone || '',
    storeName: user?.dealerDetails?.storeName || `${user?.name || 'Dealer'}'s Store`,
    city: user?.dealerDetails?.city || 'Bangalore',
    state: user?.dealerDetails?.state || 'Karnataka',
    gstNumber: user?.dealerDetails?.gstNumber || '',
    address: user?.dealerDetails?.address || '',
  };

  return (
    <DealerPortalClient
      dealerInfo={dealerInfo}
      initialOrders={orders}
      products={products}
    />
  );
}
