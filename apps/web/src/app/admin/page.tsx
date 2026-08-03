import React from 'react';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { Order } from '@/lib/models/Order';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await connectDB();

  // Fetch products cleanly
  const productsRaw = await Product.find({}).sort({ createdAt: -1 }).lean();
  const plainProducts = JSON.parse(JSON.stringify(productsRaw));

  const products = plainProducts.map((p: any) => ({
    _id: p._id,
    slug: p.slug,
    name: p.name,
    brand: p.brand || 'Dr.Well Care',
    category: p.category,
    description: p.description,
    benefits: p.benefits || [],
    images: (p.images || []).map((img: any) => ({
      url: typeof img === 'string' ? img : (img.url || ''),
      alt: img.alt || '',
      position: img.position || 0,
    })),
    variants: (p.variants || []).map((v: any) => ({
      size: v.size || '',
      dimensions: v.dimensions || '',
      thickness_cm: v.thickness_cm || 15,
      price: v.price || 0,
      mrp: v.mrp || 0,
      sku: v.sku || '',
      stock: v.stock || 0,
      image: v.image || '',
    })),
    firmness: p.firmness || 'Medium Firm',
    warranty_years: p.warranty_years || 10,
    trialNights: p.trialNights || 100,
    ratingAvg: p.ratingAvg || 4.9,
    ratingCount: p.ratingCount || 28,
    sqftPrice: p.sqftPrice || 0,
    thickness: p.thickness || '',
    subtitle: p.subtitle || '',
    seo: p.seo || { title: '', description: '', keywords: '' },
    status: p.status || 'active',
    createdAt: p.createdAt || new Date().toISOString(),
  }));

  // Fetch orders cleanly
  const ordersRaw = await Order.find({}).sort({ createdAt: -1 }).lean();
  const plainOrders = JSON.parse(JSON.stringify(ordersRaw));

  const orders = plainOrders.map((o: any) => ({
    _id: o._id,
    orderNumber: o.orderNumber || `ORD-${String(o._id).slice(-6)}`,
    customerName: o.customerName || 'Customer',
    customerPhone: o.customerPhone || 'N/A',
    customerEmail: o.customerEmail || 'N/A',
    shippingAddress: o.shippingAddress || {},
    paymentMethod: o.paymentGateway || o.paymentMethod || 'Razorpay',
    totalPrice: o.total || o.totalPrice || 0,
    isPaid: o.isPaid || o.paymentStatus === 'paid' || false,
    orderStatus: o.orderStatus || o.status || 'Processing',
    items: o.items || o.orderItems || [],
    createdAt: o.createdAt || new Date().toISOString(),
  }));

  return <AdminDashboardClient initialProducts={products} initialOrders={orders} />;
}
