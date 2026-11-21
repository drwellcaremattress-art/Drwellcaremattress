import React from 'react';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { Order } from '@/lib/models/Order';
import { Offer } from '@/lib/models/Offer';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let products: any[] = [];
  let orders: any[] = [];
  let offer: any = null;

  try {
    await connectDB();

    // Fetch products cleanly
    const productsRaw = await Product.find({}).sort({ createdAt: -1 }).lean();
    const plainProducts = JSON.parse(JSON.stringify(productsRaw));

    products = plainProducts.map((p: any) => ({
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
      videoUrl: p.videoUrl || '',
      layersImage: p.layersImage || '',
      colors: (p.colors || []).map((c: any) => ({
        name: c.name || '',
        hex: c.hex || '#FFFFFF',
        image: c.image || '',
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
        subDimensions: v.subDimensions || [],
      })),
      firmness: p.firmness || 'Medium Firm',
      warranty_years: p.warranty_years || 10,
      trialNights: p.trialNights || 100,
      ratingAvg: p.ratingAvg || 4.9,
      ratingCount: p.ratingCount || 28,
      viewCount: p.viewCount || 0,
      sqftPrice: p.sqftPrice || 0,
      thickness: p.thickness || '',
      subtitle: p.subtitle || '',
      seo: p.seo || { title: '', description: '', keywords: '' },
      status: p.status || 'active',
      createdAt: p.createdAt || new Date().toISOString(),
    }));

    // Fetch orders cleanly with all details
    const ordersRaw = await Order.find({}).sort({ createdAt: -1 }).lean();
    const plainOrders = JSON.parse(JSON.stringify(ordersRaw));

    orders = plainOrders.map((o: any) => {
      // Determine best customer name
      const addr = o.shippingAddress || {};
      const nameFromAddr = addr.firstName ? `${addr.firstName} ${addr.lastName || ''}`.trim() : (addr.name || '');
      const customerName = o.customerName || nameFromAddr || 'Customer';
      const customerPhone = o.customerPhone || addr.phone || 'N/A';
      const customerEmail = o.userEmail || o.customerEmail || addr.email || 'N/A';

      return {
        _id: o._id,
        orderNumber: o.orderNumber || `ORD-${String(o._id).slice(-6)}`,
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress: addr,
        billingAddress: o.billingAddress || addr,
        paymentMethod: o.paymentGateway || o.paymentMethod || 'Razorpay',
        paymentStatus: o.paymentStatus || (o.isPaid ? 'paid' : 'pending'),
        totalPrice: o.total || o.totalPrice || 0,
        subtotal: o.subtotal || o.total || o.totalPrice || 0,
        advanceAmount: Number(o.advanceAmount) || 0,
        balanceAmount: o.balanceAmount !== undefined ? Number(o.balanceAmount) : Math.max(0, (Number(o.total || o.totalPrice || 0)) - (Number(o.advanceAmount) || 0)),
        discount: o.discount || 0,
        shipping: o.shipping || 0,
        tax: o.tax || 0,
        isPaid: o.isPaid || o.paymentStatus === 'paid' || false,
        orderStatus: o.orderStatus || o.status || 'Processing',
        items: o.items || o.orderItems || [],
        trackingId: o.trackingId || '',
        courier: o.courier || '',
        trackingUrl: o.trackingUrl || '',
        estimatedDelivery: o.estimatedDelivery || '',
        createdAt: o.createdAt || new Date().toISOString(),
      };
    });

    // Fetch active promo offer
    const offerRaw = await Offer.findOne({}).sort({ updatedAt: -1 }).lean();
    offer = offerRaw ? JSON.parse(JSON.stringify(offerRaw)) : null;
  } catch (dbErr) {
    console.error('Admin page DB fetch error, rendering with fallback data:', dbErr);
  }

  return <AdminDashboardClient initialProducts={products} initialOrders={orders} initialOffer={offer} />;
}
