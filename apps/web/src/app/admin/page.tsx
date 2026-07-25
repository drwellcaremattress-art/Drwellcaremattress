import React from 'react';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { Order } from '@/lib/models/Order';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await connectDB();

  // Fetch products
  const productsRaw = await Product.find({}).sort({ createdAt: -1 }).lean();
  const products = productsRaw.map((p: any) => ({
    _id: p._id.toString(),
    slug: p.slug,
    name: p.name,
    brand: p.brand || 'Dr.Well Care',
    category: p.category,
    description: p.description,
    benefits: p.benefits || [],
    images: p.images || [],
    variants: p.variants || [],
    firmness: p.firmness || 'Medium Firm',
    warranty_years: p.warranty_years || 10,
    trialNights: p.trialNights || 100,
    ratingAvg: p.ratingAvg || 4.9,
    ratingCount: p.ratingCount || 28,
    seo: p.seo || { title: '', description: '', keywords: '' },
    status: p.status || 'active',
    createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
  }));

  // Fetch orders
  const ordersRaw = await Order.find({}).sort({ createdAt: -1 }).lean();
  const orders = ordersRaw.map((o: any) => ({
    _id: o._id.toString(),
    orderNumber: o.orderNumber || `ORD-${o._id.toString().slice(-6)}`,
    customerName: o.customerName || 'Customer',
    customerPhone: o.customerPhone || 'N/A',
    customerEmail: o.customerEmail || 'N/A',
    shippingAddress: o.shippingAddress || {},
    paymentMethod: o.paymentGateway || o.paymentMethod || 'Razorpay',
    totalPrice: o.total || o.totalPrice || 0,
    isPaid: o.isPaid || false,
    orderStatus: o.orderStatus || o.status || 'Processing',
    items: o.items || o.orderItems || [],
    createdAt: o.createdAt?.toISOString() || new Date().toISOString(),
  }));

  return <AdminDashboardClient initialProducts={products} initialOrders={orders} />;
}
