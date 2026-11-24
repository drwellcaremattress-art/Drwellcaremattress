import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Order } from '@/lib/models/Order';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      customer,
      shippingAddress,
      items,
      orderStatus = 'Processing',
      paymentStatus = 'cod',
      paymentMethod = 'COD',
      courier = 'Blue Dart Express',
      trackingId = '',
      notes = '',
    } = body;

    // Validation
    if (!customer?.name || !customer?.email) {
      return NextResponse.json(
        { message: 'Customer name and login email/username are required.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: 'Please select at least one product for this order.' },
        { status: 400 }
      );
    }

    if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.pincode) {
      return NextResponse.json(
        { message: 'Please complete the shipping address (Street, City, Pincode).' },
        { status: 400 }
      );
    }

    const cleanEmail = customer.email.toLowerCase().trim();
    const cleanPhone = (customer.phone || shippingAddress.phone || '').trim();
    const rawPassword = (customer.password || 'DrWell@2026').trim();

    // 1. Find or create the customer user account
    let user = await User.findOne({ email: cleanEmail });

    const formattedAddress = {
      id: `addr_${Date.now()}`,
      tag: 'Home',
      name: customer.name.trim(),
      street: shippingAddress.street.trim(),
      city: shippingAddress.city.trim(),
      state: (shippingAddress.state || 'Karnataka').trim(),
      pincode: shippingAddress.pincode.trim(),
      phone: cleanPhone || '+91 93429 22044',
      isDefault: true,
    };

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(rawPassword, salt);

      user = await User.create({
        name: customer.name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        passwordHash,
        addresses: [formattedAddress],
        role: 'user',
        authProvider: 'local',
      });
    } else {
      // User exists — update password if requested, and add address
      if (rawPassword) {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(rawPassword, salt);
      }
      if (customer.name) user.name = customer.name.trim();
      if (cleanPhone) user.phone = cleanPhone;

      // Add address if not duplicate
      const existingAddresses = user.addresses || [];
      const hasDuplicate = existingAddresses.some(
        (a: any) =>
          a.street?.toLowerCase() === formattedAddress.street.toLowerCase() &&
          a.pincode === formattedAddress.pincode
      );
      if (!hasDuplicate) {
        user.addresses = [formattedAddress, ...existingAddresses];
      }
      await user.save();
    }

    // 2. Compute order financials
    const subtotal = items.reduce(
      (sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1),
      0
    );
    const discount = Number(body.discount) || 0;
    const finalTotal = Math.max(0, subtotal - discount);
    const advanceAmount = Math.max(0, Number(body.advanceAmount) || 0);
    const balanceAmount = Math.max(0, finalTotal - advanceAmount);

    // 3. Generate clean Order Number
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `DRW-ORD-${randomSuffix}`;

    // 4. Create Order
    const sanitizedItems = items.map((it: any) => ({
      productId: it.productId || it.slug || '',
      name: it.name || 'Mattress',
      variantSku: it.variantSku || `${(it.name || 'PROD').toUpperCase()}-${it.size || 'SINGLE'}`,
      color: (it.color && !/thickness|inch/i.test(it.color)) ? it.color : 'Pure White',
      thickness: it.thickness || '',
      size: it.size || '',
      qty: Number(it.qty) || 1,
      price: Number(it.price) || 0,
      image: it.image || '/images/products/ecolatex-6.jpeg',
    }));

    const fullShippingAddress = {
      ...shippingAddress,
      name: user.name,
      email: user.email,
      phone: cleanPhone,
      country: shippingAddress.country || 'India',
    };

    const newOrder = await Order.create({
      orderNumber,
      userId: user._id,
      userEmail: user.email,
      customerName: user.name,
      customerPhone: cleanPhone,
      dealerId: body.dealerId || undefined,
      dealerName: body.dealerName || undefined,
      dealerStoreName: body.dealerStoreName || undefined,
      dealerPhone: body.dealerPhone || undefined,
      dealerEmail: body.dealerEmail || undefined,
      employeeId: body.employeeId || undefined,
      employeeName: body.employeeName || undefined,
      employeeEmail: body.employeeEmail || undefined,
      employeePhone: body.employeePhone || undefined,
      employeeCode: body.employeeCode || undefined,
      items: sanitizedItems,
      shippingAddress: fullShippingAddress,
      billingAddress: fullShippingAddress,
      subtotal,
      discount,
      shipping: 0,
      tax: 0,
      total: finalTotal,
      advanceAmount,
      balanceAmount,
      paymentStatus: balanceAmount === 0 && finalTotal > 0 ? 'paid' : (advanceAmount > 0 ? 'advance_paid' : paymentStatus),
      paymentMethod,
      paymentGateway: 'assisted_admin',
      paymentRef: body.paymentRef || (paymentStatus === 'paid' ? `ADMIN-REF-${Date.now().toString().slice(-6)}` : ''),
      orderStatus,
      courier,
      trackingId,
      trackingUrl: trackingId ? `https://www.bluedart.com/tracking?trackNumber=${trackingId}` : '',
      estimatedDelivery:
        body.estimatedDelivery ||
        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
    });

    return NextResponse.json({
      success: true,
      message: 'Customer account and order created successfully!',
      order: newOrder,
      credentials: {
        name: user.name,
        email: user.email,
        password: rawPassword,
        phone: cleanPhone,
        loginUrl: '/login',
        orderNumber: newOrder.orderNumber,
        totalPrice: newOrder.total,
        advanceAmount: newOrder.advanceAmount,
        balanceAmount: newOrder.balanceAmount,
        orderStatus: newOrder.orderStatus,
        paymentStatus: newOrder.paymentStatus,
        paymentMethod: newOrder.paymentMethod,
        itemsCount: sanitizedItems.length,
        shippingAddress: fullShippingAddress,
      },
    });
  } catch (error: any) {
    console.error('Error creating user and order:', error);
    return NextResponse.json(
      { message: error.message || 'Server error while creating order.' },
      { status: 500 }
    );
  }
}

