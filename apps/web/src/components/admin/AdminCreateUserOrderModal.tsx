'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Mail, Lock, Phone, MapPin, ShoppingBag, Plus, Trash2,
  CheckCircle2, Copy, Send, Sparkles, RefreshCw, Key, ShieldCheck,
  Package, IndianRupee, ArrowRight, ExternalLink, Printer
} from 'lucide-react';
import { ProductType } from './AdminProductTable';

interface AdminCreateUserOrderModalProps {
  open: boolean;
  onClose: () => void;
  products: ProductType[];
  onOrderCreated: (order: any) => void;
  onViewReceipt?: (order: any) => void;
  showToast: (type: 'success' | 'error', message: string) => void;
}

interface OrderItemDraft {
  productId: string;
  name: string;
  variantSku: string;
  size: string;
  thickness: string;
  qty: number;
  price: number;
  image: string;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi NCR',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function AdminCreateUserOrderModal({
  open,
  onClose,
  products,
  onOrderCreated,
  onViewReceipt,
  showToast,
}: AdminCreateUserOrderModalProps) {
  // Step: 'form' | 'success'
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [createdOrderObject, setCreatedOrderObject] = useState<any | null>(null);

  // Customer Credentials State
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  // Shipping Address State
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '',
    country: 'India',
  });

  // Items in Order
  const [items, setItems] = useState<OrderItemDraft[]>([]);

  // Item Picker State
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>(
    products[0]?.slug || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>('Single');
  const [selectedThickness, setSelectedThickness] = useState<string>('6 Inch');
  const [itemQty, setItemQty] = useState<number>(1);
  const [customPrice, setCustomPrice] = useState<string>('');

  // Order Details State
  const [orderStatus, setOrderStatus] = useState<string>('Confirmed');
  const [paymentStatus, setPaymentStatus] = useState<string>('cod');
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash on Delivery');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [courier, setCourier] = useState<string>('Blue Dart Express');
  const [trackingId, setTrackingId] = useState<string>('');

  // Success Handover Data
  const [handoverData, setHandoverData] = useState<any | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Auto-generate strong user password
  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pwd = 'DrW-';
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomer((prev) => ({ ...prev, password: pwd }));
    showToast('success', 'Generated secure customer password!');
  };

  // Find currently active product in picker
  const activeProduct = products.find((p) => p.slug === selectedProductSlug) || products[0];

  // Calculate default price for current selected variant
  const getSelectedVariantPrice = () => {
    if (!activeProduct) return 9828;
    const variant = activeProduct.variants?.find((v) => v.size.toLowerCase() === selectedSize.toLowerCase());
    if (variant && variant.price) return variant.price;
    const rate = Number(activeProduct.sqftPrice) || 546;
    const sqftMap: Record<string, number> = { Single: 18, Double: 24, Queen: 30, King: 36 };
    return Math.round(rate * (sqftMap[selectedSize] || 18));
  };

  // Add Item to Order Draft
  const handleAddItem = () => {
    if (!activeProduct) return;
    const price = customPrice ? Number(customPrice) : getSelectedVariantPrice();
    const image = activeProduct.images?.[0]?.url || '/images/products/ecolatex-6.jpeg';

    const newItem: OrderItemDraft = {
      productId: activeProduct.slug,
      name: activeProduct.name,
      variantSku: `${activeProduct.slug.toUpperCase()}-${selectedSize.toUpperCase()}-${selectedThickness.replace(/\s+/g, '')}`,
      size: selectedSize,
      thickness: selectedThickness,
      qty: itemQty,
      price,
      image,
    };

    setItems((prev) => [...prev, newItem]);
    setCustomPrice('');
    setItemQty(1);
    showToast('success', `Added "${activeProduct.name} (${selectedSize})" to order.`);
  };

  const handleRemoveItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalPayable = Math.max(0, subtotal - discountAmount);
  const balanceDue = Math.max(0, totalPayable - advanceAmount);

  // Submit Order Creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name.trim() || !customer.email.trim()) {
      showToast('error', 'Please enter the customer name and login email/username.');
      return;
    }

    if (!customer.password.trim()) {
      generateStrongPassword();
    }

    if (!shippingAddress.street.trim() || !shippingAddress.city.trim() || !shippingAddress.pincode.trim()) {
      showToast('error', 'Please complete the shipping address (Street, City, Pincode).');
      return;
    }

    if (items.length === 0) {
      showToast('error', 'Please add at least one mattress/product to this order.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/create-user-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          shippingAddress,
          items,
          orderStatus,
          paymentStatus,
          paymentMethod,
          discount: discountAmount,
          advanceAmount,
          courier,
          trackingId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create customer order.');
      }

      setHandoverData(data.credentials);
      setCreatedOrderObject(data.order);
      setStep('success');
      onOrderCreated(data.order);
      showToast('success', `Order ${data.credentials.orderNumber} & Customer Account created!`);
    } catch (err: any) {
      showToast('error', err.message || 'Something went wrong while placing order.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // WhatsApp formatted message
  const getWhatsAppMessage = () => {
    if (!handoverData) return '';
    const adv = Number(handoverData.advanceAmount) || 0;
    const bal =
      handoverData.balanceAmount !== undefined
        ? Number(handoverData.balanceAmount)
        : Math.max(0, (Number(handoverData.totalPrice) || 0) - adv);

    return encodeURIComponent(
      `*Dr.Well Care Mattress — Your Order & Account Confirmation*\n\n` +
      `Hello ${handoverData.name},\n` +
      `Your mattress order has been confirmed!\n\n` +
      `📦 *Order ID:* ${handoverData.orderNumber}\n` +
      `💰 *Total Amount:* ₹${handoverData.totalPrice.toLocaleString('en-IN')}\n` +
      (adv > 0 ? `💵 *Advance Paid:* ₹${adv.toLocaleString('en-IN')}\n` : '') +
      (adv > 0
        ? `📦 *Balance Due on Delivery (COD):* ₹${bal.toLocaleString('en-IN')}\n`
        : `💳 *Payment Method:* ${handoverData.paymentMethod}\n`) +
      `🚚 *Delivery To:* ${handoverData.shippingAddress.street}, ${handoverData.shippingAddress.city} - ${handoverData.shippingAddress.pincode}\n\n` +
      `🔐 *Your Account Login Credentials:*\n` +
      `• *Website Login:* ${window.location.origin}/login\n` +
      `• *Username / Email:* ${handoverData.email}\n` +
      `• *Password:* ${handoverData.password}\n\n` +
      `You can track your order live anytime at ${window.location.origin}/account\n\n` +
      `Thank you for choosing Dr.Well Care!`
    );
  };

  const handleResetAndClose = () => {
    setStep('form');
    setCustomer({ name: '', email: '', password: '', phone: '' });
    setShippingAddress({ street: '', city: 'Bangalore', state: 'Karnataka', pincode: '', country: 'India' });
    setItems([]);
    setAdvanceAmount(0);
    setDiscountAmount(0);
    setHandoverData(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* ── Modal Header ── */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-[#0B1A2A] to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-neutral-950 font-black shadow-md">
              <ShoppingBag size={20} />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight font-heading">
                {step === 'form' ? 'Create Customer Order & Login Credentials' : 'Customer Account & Order Handover'}
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {step === 'form'
                  ? 'Set up login username/password, shipping address, products, and generate a user account.'
                  : 'Order placed successfully! Give these credentials to the customer to log in.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Modal Body ── */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ── SECTION 1: Customer Login Credentials ── */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <User size={15} className="text-[#0682E4]" /> Step 1: Customer Login &amp; Profile
                  </h4>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0682E4] hover:underline"
                  >
                    <Key size={13} /> Auto-Generate Password
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Customer Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                    />
                  </div>

                  {/* Customer Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                    />
                  </div>

                  {/* Customer Email / Login Username */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Login Email / Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh.kumar@example.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      The user will use this exact email/username to log into the website.
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Login Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="e.g. DrW@9821"
                        value={customer.password}
                        onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
                        className="w-full px-3.5 py-2.5 pr-20 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-slate-200/80 px-2 py-0.5 rounded"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Share this password with the user so they can access their account.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: Shipping Address ── */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={15} className="text-[#7cb93e]" /> Step 2: Customer Shipping Address
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Street */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      House / Flat / Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 402, Sunshine Heights, 12th Main Road"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bangalore"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="560001"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                    />
                  </div>

                  {/* State */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      State
                    </label>
                    <select
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4] bg-white"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: Add Products ── */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Package size={15} className="text-amber-500" /> Step 3: Add Products to Order
                  </h4>
                  <span className="text-xs font-bold text-slate-500">
                    {items.length} {items.length === 1 ? 'item' : 'items'} in order
                  </span>
                </div>

                {/* Product Selector Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  {/* Product Dropdown */}
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Choose Product
                    </label>
                    <select
                      value={selectedProductSlug}
                      onChange={(e) => setSelectedProductSlug(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      {products.map((p) => (
                        <option key={p.slug} value={p.slug}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Size
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="Single">Single (72x36)</option>
                      <option value="Double">Double (72x48)</option>
                      <option value="Queen">Queen (72x60)</option>
                      <option value="King">King (72x72)</option>
                    </select>
                  </div>

                  {/* Thickness */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Thickness
                    </label>
                    <select
                      value={selectedThickness}
                      onChange={(e) => setSelectedThickness(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="5 Inch">5 Inch</option>
                      <option value="6 Inch">6 Inch</option>
                      <option value="8 Inch">8 Inch</option>
                      <option value="10 Inch">10 Inch</option>
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={itemQty}
                      onChange={(e) => setItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800"
                    />
                  </div>

                  {/* Add Button */}
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full py-2 px-3 rounded-lg bg-[#0682E4] hover:bg-[#056ec1] text-white text-xs font-extrabold flex items-center justify-center gap-1 shadow transition-all active:scale-95"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>
                </div>

                {/* Selected Items List */}
                {items.length > 0 ? (
                  <div className="space-y-2 mt-3">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200"
                          />
                          <div>
                            <span className="font-black text-slate-900 block">{item.name}</span>
                            <span className="text-slate-500 text-[11px]">
                              Size: <b>{item.size}</b> &bull; Thickness: <b>{item.thickness}</b> &bull; Qty: <b>{item.qty}</b>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-black text-slate-900 text-sm">
                            ₹{(item.price * item.qty).toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium">
                    No products added yet. Select a mattress above and click &ldquo;+ Add Item&rdquo;.
                  </div>
                )}
              </div>

              {/* ── SECTION 4: Order Status & Fulfillment ── */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck size={15} className="text-emerald-600" /> Step 4: Order Status &amp; Payment
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Order Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Initial Order Status
                    </label>
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Payment Status
                    </label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="cod">Cash on Delivery (Pending)</option>
                      <option value="paid">Paid (Verified)</option>
                      <option value="pending">Payment Pending</option>
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Razorpay / UPI">Razorpay / UPI</option>
                      <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                      <option value="Card">Credit / Debit Card</option>
                    </select>
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admin Discount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                    />
                  </div>

                  {/* Advance Payment Received */}
                  <div>
                    <label className="block text-xs font-bold text-emerald-800 mb-1 flex items-center justify-between">
                      <span>Advance Received (₹)</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Deposit</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={totalPayable}
                      value={advanceAmount}
                      onChange={(e) => setAdvanceAmount(Math.max(0, Number(e.target.value) || 0))}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-xs font-bold text-emerald-800 bg-emerald-50/40 focus:bg-white focus:border-emerald-500"
                    />
                  </div>

                  {/* Courier */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Courier Partner
                    </label>
                    <input
                      type="text"
                      value={courier}
                      onChange={(e) => setCourier(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                    />
                  </div>

                  {/* Tracking AWB */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tracking AWB (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BD-8921892"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* ── Summary & Submit Button ── */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Order Total Payable:</div>
                  <div className="text-2xl font-black text-amber-400 flex items-center">
                    ₹{totalPayable.toLocaleString('en-IN')}
                    {discountAmount > 0 && (
                      <span className="text-xs text-slate-400 font-normal ml-2 line-through">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  {advanceAmount > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                        Advance Paid: -₹{advanceAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-amber-300 font-black bg-amber-400/15 px-2 py-0.5 rounded border border-amber-400/30">
                        Balance Due on Delivery: ₹{balanceDue.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div className="text-[11px] text-slate-400 mt-1">
                    Includes Free Doorstep Delivery &bull; 100 Nights Trial
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/20 text-xs font-bold text-white hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-neutral-950 text-xs font-black shadow-lg shadow-yellow-500/20 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Creating Order...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} /> Create Customer &amp; Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ── STEP: SUCCESS & HANDOVER TO USER ── */
            <div className="space-y-6">
              {/* Success Banner */}
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center gap-4">
                <span className="p-3 bg-emerald-500 text-white rounded-full shrink-0 shadow-md">
                  <CheckCircle2 size={24} />
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-emerald-950 font-heading">
                    Account &amp; Order Created Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Order <b>{handoverData?.orderNumber}</b> is placed. Give the login credentials below to the customer so they can log in at <b>/login</b> and view their order.
                  </p>
                </div>
              </div>

              {/* ── Ready-to-Handover Credentials Card ── */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                      Customer Handover Card
                    </span>
                    <h3 className="text-lg font-black text-white">{handoverData?.name}</h3>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-black">
                    ● Account Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Login Link */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-1">Website Login Link:</span>
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-mono font-bold text-amber-300 truncate">
                        {typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login'}
                      </code>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            `${window.location.origin}/login`,
                            'loginUrl'
                          )
                        }
                        className="p-1 hover:text-amber-400 transition-colors"
                        title="Copy login URL"
                      >
                        {copiedField === 'loginUrl' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Username / Email */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-1">Login Username / Email:</span>
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-mono font-bold text-white truncate">
                        {handoverData?.email}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(handoverData?.email, 'email')}
                        className="p-1 hover:text-amber-400 transition-colors"
                        title="Copy email"
                      >
                        {copiedField === 'email' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-1">Login Password:</span>
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono font-black text-amber-400 tracking-wider">
                        {handoverData?.password}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(handoverData?.password, 'password')}
                        className="p-1 hover:text-amber-400 transition-colors"
                        title="Copy password"
                      >
                        {copiedField === 'password' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Order ID & Total */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-1">Order ID &amp; Payment Breakdown:</span>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white">
                          {handoverData?.orderNumber} &bull; ₹{handoverData?.totalPrice?.toLocaleString('en-IN')}
                        </span>
                        {Number(handoverData?.advanceAmount) > 0 && (
                          <div className="text-[11px] font-medium text-emerald-400 mt-1 flex flex-wrap gap-2">
                            <span>Advance Paid: <b>₹{Number(handoverData?.advanceAmount).toLocaleString('en-IN')}</b></span>
                            <span className="text-amber-300 font-bold bg-amber-400/20 px-1.5 py-0.5 rounded">
                              COD Balance: ₹{(Number(handoverData?.balanceAmount) ?? Math.max(0, Number(handoverData?.totalPrice) - Number(handoverData?.advanceAmount))).toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(handoverData?.orderNumber, 'orderNumber')}
                        className="p-1 hover:text-amber-400 transition-colors ml-2 shrink-0"
                        title="Copy Order ID"
                      >
                        {copiedField === 'orderNumber' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delivery Address Summary */}
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-slate-300">
                  <span className="text-slate-400 font-bold block mb-0.5">Shipping Address:</span>
                  {handoverData?.shippingAddress?.street}, {handoverData?.shippingAddress?.city}, {handoverData?.shippingAddress?.state} - {handoverData?.shippingAddress?.pincode}
                </div>

                {/* 1-Click Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {/* Copy WhatsApp text */}
                  <button
                    type="button"
                    onClick={() => {
                      const adv = Number(handoverData?.advanceAmount) || 0;
                      const bal =
                        handoverData?.balanceAmount !== undefined
                          ? Number(handoverData?.balanceAmount)
                          : Math.max(0, (Number(handoverData?.totalPrice) || 0) - adv);

                      const msg =
                        `Dr.Well Care Mattress - Order Confirmation & Account Details\n\n` +
                        `Hello ${handoverData?.name},\n` +
                        `Your mattress order has been created!\n\n` +
                        `📦 Order ID: ${handoverData?.orderNumber}\n` +
                        `💰 Total Amount: ₹${handoverData?.totalPrice?.toLocaleString('en-IN')}\n` +
                        (adv > 0 ? `💵 Advance Paid: ₹${adv.toLocaleString('en-IN')}\n` : '') +
                        (adv > 0
                          ? `📦 Balance Due on Delivery (COD): ₹${bal.toLocaleString('en-IN')}\n`
                          : `💳 Payment Method: ${handoverData?.paymentMethod}\n`) +
                        `🚚 Delivery To: ${handoverData?.shippingAddress?.street}, ${handoverData?.shippingAddress?.city} - ${handoverData?.shippingAddress?.pincode}\n\n` +
                        `🔐 Your Account Login:\n` +
                        `• Login Link: ${window.location.origin}/login\n` +
                        `• Username / Email: ${handoverData?.email}\n` +
                        `• Password: ${handoverData?.password}\n\n` +
                        `Track your order live anytime at ${window.location.origin}/account`;
                      copyToClipboard(msg, 'allDetails');
                      showToast('success', 'Copied full message! Paste into WhatsApp or SMS.');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 active:scale-95"
                  >
                    {copiedField === 'allDetails' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copiedField === 'allDetails' ? 'Copied Full Summary!' : '📋 Copy All Details for WhatsApp/SMS'}
                  </button>

                  {/* Send via WhatsApp Web */}
                  <a
                    href={(() => {
                      const digits = (handoverData?.phone || '').replace(/[^0-9]/g, '');
                      const formattedPhone = digits.length === 10 ? `91${digits}` : digits;
                      const phoneQuery = formattedPhone ? `phone=${formattedPhone}&` : '';
                      return `https://api.whatsapp.com/send?${phoneQuery}text=${getWhatsAppMessage()}`;
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                  >
                    <Send size={14} /> Send to Customer via WhatsApp
                  </a>

                  {/* View/Print Receipt */}
                  {onViewReceipt && createdOrderObject && (
                    <button
                      type="button"
                      onClick={() => {
                        onViewReceipt(createdOrderObject);
                        handleResetAndClose();
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      <Printer size={14} /> Print / PDF Receipt
                    </button>
                  )}

                  {/* Done Button */}
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="ml-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-md shadow-yellow-500/20"
                  >
                    Done &bull; View Live Orders Table
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

