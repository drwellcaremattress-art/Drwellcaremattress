'use client';

import React, { useState } from 'react';
import AdminProductTable, { ProductType } from './AdminProductTable';
import AdminProductFormDrawer from './AdminProductFormDrawer';
import AdminDeleteConfirmModal from './AdminDeleteConfirmModal';
import AdminOffersManager from './AdminOffersManager';
import { OfferData } from '../home/HeroOfferDisplay3D';
import OrderReceiptModal from '../orders/OrderReceiptModal';
import AdminCreateUserOrderModal from './AdminCreateUserOrderModal';
import {
  Package, ShoppingCart, Plus, RefreshCw, X, Check,
  Truck, AlertCircle, BarChart3, TrendingUp, IndianRupee, Users, Trash2, MapPin,
  Printer, ExternalLink, Copy, CheckCircle2, Phone, Mail, FileText, Search, ChevronRight,
  Clock, CreditCard, ShieldCheck, Sparkles, Flame, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderType {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: any;
  billingAddress?: any;
  paymentMethod: string;
  paymentStatus?: string;
  totalPrice: number;
  total?: number;
  subtotal?: number;
  discount?: number;
  advanceAmount?: number;
  balanceAmount?: number;
  shipping?: number;
  tax?: number;
  isPaid: boolean;
  orderStatus: string;
  items: any[];
  trackingId?: string;
  courier?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  createdAt: string;
}

export default function AdminDashboardClient({
  initialProducts,
  initialOrders,
  initialOffer,
}: {
  initialProducts: ProductType[];
  initialOrders: OrderType[];
  initialOffer?: Partial<OfferData> | null;
}) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'offers'>('products');
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [orders, setOrders] = useState<OrderType[]>(initialOrders);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [drawerProduct, setDrawerProduct] = useState<ProductType | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ProductType | null>(null);

  // Orders Management & Receipt State
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<OrderType | null>(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { courier: string; trackingId: string; trackingUrl: string }>>({});
  const [savingTrackingId, setSavingTrackingId] = useState<string | null>(null);
  const [advanceInputs, setAdvanceInputs] = useState<Record<string, string>>({});
  const [savingAdvanceId, setSavingAdvanceId] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleOrderCreated = (newOrder: any) => {
    const total = newOrder.total || 0;
    const advance = Number(newOrder.advanceAmount) || 0;
    const balance = newOrder.balanceAmount !== undefined ? Number(newOrder.balanceAmount) : Math.max(0, total - advance);

    const formatted: OrderType = {
      _id: newOrder._id,
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName || 'Customer',
      customerPhone: newOrder.customerPhone || 'N/A',
      customerEmail: newOrder.userEmail || 'N/A',
      shippingAddress: newOrder.shippingAddress || {},
      billingAddress: newOrder.billingAddress || newOrder.shippingAddress || {},
      paymentMethod: newOrder.paymentMethod || 'COD',
      paymentStatus: newOrder.paymentStatus || 'pending',
      totalPrice: total,
      subtotal: newOrder.subtotal || 0,
      discount: newOrder.discount || 0,
      advanceAmount: advance,
      balanceAmount: balance,
      shipping: 0,
      tax: 0,
      isPaid: newOrder.paymentStatus === 'paid' || balance === 0,
      orderStatus: newOrder.orderStatus || 'Processing',
      items: newOrder.items || [],
      trackingId: newOrder.trackingId || '',
      courier: newOrder.courier || '',
      trackingUrl: newOrder.trackingUrl || '',
      estimatedDelivery: newOrder.estimatedDelivery || '',
      createdAt: newOrder.createdAt || new Date().toISOString(),
    };
    setOrders((prev) => [formatted, ...prev]);
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const getTrackingField = (order: OrderType, field: 'courier' | 'trackingId' | 'trackingUrl') => {
    if (trackingInputs[order._id] && trackingInputs[order._id][field] !== undefined) {
      return trackingInputs[order._id][field];
    }
    return order[field] || '';
  };

  const setTrackingField = (orderId: string, field: 'courier' | 'trackingId' | 'trackingUrl', value: string) => {
    setTrackingInputs((prev) => {
      const current = prev[orderId] || {
        courier: orders.find(o => o._id === orderId)?.courier || 'Blue Dart Express',
        trackingId: orders.find(o => o._id === orderId)?.trackingId || '',
        trackingUrl: orders.find(o => o._id === orderId)?.trackingUrl || '',
      };
      return {
        ...prev,
        [orderId]: { ...current, [field]: value },
      };
    });
  };

  const handleSaveTracking = async (order: OrderType) => {
    const courier = getTrackingField(order, 'courier') || 'Blue Dart Express';
    const trackingId = getTrackingField(order, 'trackingId');
    let trackingUrl = getTrackingField(order, 'trackingUrl');

    if (!trackingId.trim()) {
      showToast('error', 'Please enter a valid tracking code or AWB number.');
      return;
    }

    // Auto-generate courier URL if left blank
    if (!trackingUrl.trim()) {
      const cLower = courier.toLowerCase();
      if (cLower.includes('delhivery')) {
        trackingUrl = `https://www.delhivery.com/track/package/${trackingId.trim()}`;
      } else if (cLower.includes('blue dart') || cLower.includes('bluedart')) {
        trackingUrl = `https://www.bluedart.com/tracking`;
      } else if (cLower.includes('dtdc')) {
        trackingUrl = `https://www.dtdc.in/tracking/shipment-tracking.asp`;
      } else if (cLower.includes('india post')) {
        trackingUrl = `https://www.indiapost.gov.in`;
      }
    }

    setSavingTrackingId(order._id);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courier,
          trackingId: trackingId.trim(),
          trackingUrl: trackingUrl.trim(),
          // Auto advance status to Shipped if currently Processing or Confirmed
          orderStatus: (order.orderStatus === 'Processing' || order.orderStatus === 'Confirmed') ? 'Shipped' : order.orderStatus,
        }),
      });

      if (!res.ok) throw new Error('Failed to update tracking');
      const updated = await res.json();

      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id
            ? {
                ...o,
                courier: updated.courier || courier,
                trackingId: updated.trackingId || trackingId.trim(),
                trackingUrl: updated.trackingUrl || trackingUrl.trim(),
                orderStatus: updated.orderStatus || o.orderStatus,
              }
            : o
        )
      );

      showToast('success', `Live tracking code saved for ${order.orderNumber}!`);
    } catch (err: any) {
      showToast('error', err.message || 'Tracking update failed.');
    } finally {
      setSavingTrackingId(null);
    }
  };

  const getAdvanceInputValue = (orderId: string, currentVal: number) => {
    if (advanceInputs[orderId] !== undefined) {
      return advanceInputs[orderId];
    }
    return currentVal > 0 ? String(currentVal) : '';
  };

  const handleAdvanceInputChange = (orderId: string, val: string) => {
    setAdvanceInputs((prev) => ({ ...prev, [orderId]: val }));
  };

  const handleSaveAdvance = async (order: OrderType) => {
    const rawVal = advanceInputs[order._id] !== undefined ? advanceInputs[order._id] : (order.advanceAmount ?? 0);
    const advance = Math.max(0, Number(rawVal) || 0);
    const total = Number(order.totalPrice || order.total || 0);
    const balance = Math.max(0, total - advance);

    setSavingAdvanceId(order._id);
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          advanceAmount: advance,
          balanceAmount: balance,
        }),
      });
      if (!res.ok) throw new Error('Failed to update advance amount.');

      setOrders((prev) =>
        prev.map((o) =>
          o._id === order._id
            ? {
                ...o,
                advanceAmount: advance,
                balanceAmount: balance,
                isPaid: balance === 0 && total > 0,
                paymentStatus: balance === 0 && total > 0 ? 'paid' : (advance > 0 ? 'advance_paid' : o.paymentStatus),
              }
            : o
        )
      );
      showToast('success', `Advance of ₹${advance.toLocaleString('en-IN')} saved! Balance due: ₹${balance.toLocaleString('en-IN')}`);
    } catch (err: any) {
      showToast('error', err.message || 'Error updating advance amount');
    } finally {
      setSavingAdvanceId(null);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(id);
    showToast('success', `Copied ${text} to clipboard!`);
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  // ── Handlers ──
  const openAddDrawer = () => {
    setDrawerProduct(null);
    setDrawerMode('add');
    setDrawerOpen(true);
  };

  const openEditDrawer = (product: ProductType) => {
    setDrawerProduct(product);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const openDeleteModal = (product: ProductType) => {
    setDeleteTarget(product);
  };

  const handleProductSaved = (savedProduct: ProductType) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p._id === savedProduct._id);
      if (exists) {
        return prev.map((p) => (p._id === savedProduct._id ? savedProduct : p));
      }
      return [savedProduct, ...prev];
    });
  };

  const handleProductDeleted = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    setDeleteTarget(null);
  };

  const handleStatusToggle = (product: ProductType, newStatus: string) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === product._id ? { ...p, status: newStatus } : p))
    );
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
    } catch (err) {
      console.error('Order status update failed:', err);
    }
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderNumber}?`)) {
      return;
    }
    setOrders((prev) => prev.filter((o) => o._id !== orderId));
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Delete order failed:', err);
    }
  };

  const formatAddress = (addr: any) => {
    if (!addr) return 'N/A';
    if (typeof addr === 'string') return addr;
    const street = addr.streetAddress || addr.address || addr.street || addr.addressLine1 || '';
    const city = addr.city || '';
    const state = addr.state || '';
    const pincode = addr.pincode || addr.zipCode || addr.postalCode || '';
    const parts = [street, city, state, pincode].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };


  // ── Stats ──
  const activeProducts = products.filter((p) => p.status === 'active').length;
  const draftProducts = products.filter((p) => p.status === 'draft').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Processing').length;

  const stats = [
    { label: 'Total Products', value: products.length, sub: `${activeProducts} active · ${draftProducts} draft`, icon: Package, color: 'text-[#0682E4]', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Live Orders', value: orders.length, sub: `${pendingOrders} pending`, icon: ShoppingCart, color: 'text-[#7cb93e]', bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: 'all time', icon: IndianRupee, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { label: 'Low Stock Items', value: products.filter((p) => p.variants?.reduce((s, v) => s + v.stock, 0) < 10).length, sub: 'need restocking', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  ];

  // Helper to format WhatsApp URL for direct customer dispatch
  const getCustomerWhatsAppUrl = (ord: OrderType) => {
    const rawPhone = ord.customerPhone || '';
    const digits = rawPhone.replace(/[^0-9]/g, '');
    const phone = digits.length === 10 ? `91${digits}` : digits;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://drwellcare.com';
    const total = Number(ord.totalPrice || ord.total || 0);
    const advance = Math.max(0, Number(ord.advanceAmount || 0));
    const balance = ord.balanceAmount !== undefined ? Number(ord.balanceAmount) : Math.max(0, total - advance);

    const trackingText = ord.trackingId ? `\n🚚 Courier: ${ord.courier || 'Blue Dart'}\n📦 Tracking AWB: ${ord.trackingId}` : '';
    const paymentBreakdown = advance > 0
      ? `\n💰 *Total Price:* ₹${total.toLocaleString('en-IN')}\n💵 *Advance Paid:* ₹${advance.toLocaleString('en-IN')}\n📦 *Balance Due on Delivery:* ₹${balance.toLocaleString('en-IN')} (${ord.paymentMethod})`
      : `\n💰 *Total Amount:* ₹${total.toLocaleString('en-IN')} (${ord.paymentMethod})`;

    const text = encodeURIComponent(
      `*Dr.Well Care Mattress — Order Update*\n\n` +
      `Hello ${ord.customerName},\n` +
      `Here is an update on your order *#${ord.orderNumber}*:\n\n` +
      `📌 *Status:* ${ord.orderStatus}${paymentBreakdown}${trackingText}\n\n` +
      `Track your order live anytime:\n${origin}/account\n\n` +
      `Thank you for choosing Dr.Well Care!`
    );
    return phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-body pt-32 lg:pt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#0B1A2A] to-[#0f253d] p-3.5 rounded-2xl text-[#7cb93e] shadow-lg">
              <Package size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1A2A] font-heading">
                Admin Dashboard
              </h1>
              <p className="text-xs text-slate-500 font-semibold">
                Dr.Well Care — Product Inventory & Order Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCreateOrderModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-4 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <Plus size={16} /> Create User &amp; Order
            </button>
            <button
              onClick={openAddDrawer}
              className="flex items-center gap-2 bg-[#0682E4] hover:bg-[#0682E4]/90 text-white px-4 py-2.5 rounded-2xl font-extrabold text-xs shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            // Helper to format WhatsApp URL for direct customer dispatch
  const getCustomerWhatsAppUrl = (ord: OrderType) => {
    const rawPhone = ord.customerPhone || '';
    const digits = rawPhone.replace(/[^0-9]/g, '');
    const phone = digits.length === 10 ? `91${digits}` : digits;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://drwellcare.com';
    const total = Number(ord.totalPrice || ord.total || 0);
    const advance = Math.max(0, Number(ord.advanceAmount || 0));
    const balance = ord.balanceAmount !== undefined ? Number(ord.balanceAmount) : Math.max(0, total - advance);

    const trackingText = ord.trackingId ? `\n🚚 Courier: ${ord.courier || 'Blue Dart'}\n📦 Tracking AWB: ${ord.trackingId}` : '';
    const paymentBreakdown = advance > 0
      ? `\n💰 *Total Price:* ₹${total.toLocaleString('en-IN')}\n💵 *Advance Paid:* ₹${advance.toLocaleString('en-IN')}\n📦 *Balance Due on Delivery:* ₹${balance.toLocaleString('en-IN')} (${ord.paymentMethod})`
      : `\n💰 *Total Amount:* ₹${total.toLocaleString('en-IN')} (${ord.paymentMethod})`;

    const text = encodeURIComponent(
      `*Dr.Well Care Mattress — Order Update*\n\n` +
      `Hello ${ord.customerName},\n` +
      `Here is an update on your order *#${ord.orderNumber}*:\n\n` +
      `📌 *Status:* ${ord.orderStatus}${paymentBreakdown}${trackingText}\n\n` +
      `Track your order live anytime:\n${origin}/account\n\n` +
      `Thank you for choosing Dr.Well Care!`
    );
    return phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
  };

  return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`bg-white rounded-2xl p-5 border ${stat.border} shadow-sm`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={18} className={stat.color} />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-xs font-bold text-slate-500 mt-0.5">{stat.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Tab Navigation ── */}
        <div className="flex items-center gap-1 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-4 font-extrabold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-[#0682E4] text-[#0682E4]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Package size={16} /> Product Inventory
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ml-1 ${activeTab === 'products' ? 'bg-blue-100 text-[#0682E4]' : 'bg-slate-100 text-slate-500'}`}>
              {products.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-4 font-extrabold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-[#0682E4] text-[#0682E4]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ShoppingCart size={16} /> Live Orders
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ml-1 ${activeTab === 'orders' ? 'bg-blue-100 text-[#0682E4]' : 'bg-slate-100 text-slate-500'}`}>
              {orders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`pb-4 px-4 font-extrabold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'offers'
                ? 'border-[#0682E4] text-[#0682E4]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Sparkles size={16} className={activeTab === 'offers' ? 'text-amber-500' : 'text-slate-400'} /> Festival Sale Offer
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ml-1 ${activeTab === 'offers' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>
              25% OFF Badge
            </span>
          </button>
        </div>

        {/* ── TAB: PRODUCTS ── */}
        {activeTab === 'products' && (
          <AdminProductTable
            products={products}
            onEdit={openEditDrawer}
            onDelete={openDeleteModal}
            onStatusToggle={handleStatusToggle}
          />
        )}

        {/* ── TAB: ORDERS ── */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Orders Header & Search / Filter Toolbar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black text-[#0B1A2A] font-heading">
                    Customer Orders Management
                  </h3>
                  <span className="px-3 py-1 bg-blue-50 text-[#0682E4] rounded-full text-xs font-black">
                    {orders.length} Total
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Manage live dispatch, courier AWB tracking codes, and generate tax receipts.
                </p>
              </div>

              {/* Actions & Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCreateOrderModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0682E4] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-black shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 active:scale-95 shrink-0"
                >
                  <Plus size={16} /> Create User Account &amp; Order
                </button>

                {/* Search Bar */}
                <div className="relative min-w-[240px] sm:min-w-[280px]">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search Order ID, Name, Phone..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0682E4]/20 focus:border-[#0682E4] transition-all"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {[
                { id: 'all', label: 'All Orders', count: orders.length },
                { id: 'Processing', label: 'Processing', count: orders.filter(o => o.orderStatus === 'Processing').length },
                { id: 'Confirmed', label: 'Confirmed', count: orders.filter(o => o.orderStatus === 'Confirmed').length },
                { id: 'Shipped', label: 'Shipped', count: orders.filter(o => o.orderStatus === 'Shipped').length },
                { id: 'Out for Delivery', label: 'Out for Delivery', count: orders.filter(o => o.orderStatus === 'Out for Delivery').length },
                { id: 'Delivered', label: 'Delivered', count: orders.filter(o => o.orderStatus === 'Delivered').length },
                { id: 'Cancelled', label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'Cancelled').length },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setOrderStatusFilter(pill.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    orderStatusFilter === pill.id
                      ? 'bg-[#0B1A2A] text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{pill.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                    orderStatusFilter === pill.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {pill.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Filtered Orders List */}
            {(() => {
              const filteredOrders = orders.filter((o) => {
                // Status filter
                if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) {
                  return false;
                }
                // Search filter
                if (!orderSearch.trim()) return true;
                const q = orderSearch.toLowerCase().trim();
                const num = (o.orderNumber || '').toLowerCase();
                const name = (o.customerName || '').toLowerCase();
                const phone = (o.customerPhone || '').toLowerCase();
                const awb = (o.trackingId || '').toLowerCase();
                const courier = (o.courier || '').toLowerCase();
                return num.includes(q) || name.includes(q) || phone.includes(q) || awb.includes(q) || courier.includes(q);
              });

              if (filteredOrders.length === 0) {
                // Helper to format WhatsApp URL for direct customer dispatch
  const getCustomerWhatsAppUrl = (ord: OrderType) => {
    const rawPhone = ord.customerPhone || '';
    const digits = rawPhone.replace(/[^0-9]/g, '');
    const phone = digits.length === 10 ? `91${digits}` : digits;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://drwellcare.com';
    const total = Number(ord.totalPrice || ord.total || 0);
    const advance = Math.max(0, Number(ord.advanceAmount || 0));
    const balance = ord.balanceAmount !== undefined ? Number(ord.balanceAmount) : Math.max(0, total - advance);

    const trackingText = ord.trackingId ? `\n🚚 Courier: ${ord.courier || 'Blue Dart'}\n📦 Tracking AWB: ${ord.trackingId}` : '';
    const paymentBreakdown = advance > 0
      ? `\n💰 *Total Price:* ₹${total.toLocaleString('en-IN')}\n💵 *Advance Paid:* ₹${advance.toLocaleString('en-IN')}\n📦 *Balance Due on Delivery:* ₹${balance.toLocaleString('en-IN')} (${ord.paymentMethod})`
      : `\n💰 *Total Amount:* ₹${total.toLocaleString('en-IN')} (${ord.paymentMethod})`;

    const text = encodeURIComponent(
      `*Dr.Well Care Mattress — Order Update*\n\n` +
      `Hello ${ord.customerName},\n` +
      `Here is an update on your order *#${ord.orderNumber}*:\n\n` +
      `📌 *Status:* ${ord.orderStatus}${paymentBreakdown}${trackingText}\n\n` +
      `Track your order live anytime:\n${origin}/account\n\n` +
      `Thank you for choosing Dr.Well Care!`
    );
    return phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
  };

  return (
                  <div className="py-20 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
                    <ShoppingCart className="w-16 h-16 mx-auto mb-3 text-slate-200" />
                    <p className="font-extrabold text-slate-700 text-base mb-1">No matching orders found.</p>
                    <p className="text-xs text-slate-400">
                      {orderSearch ? `No orders matched "${orderSearch}". Try clearing the search.` : 'Orders placed on the store will appear here in real-time.'}
                    </p>
                  </div>
                );
              }

              // Helper to format WhatsApp URL for direct customer dispatch
  const getCustomerWhatsAppUrl = (ord: OrderType) => {
    const rawPhone = ord.customerPhone || '';
    const digits = rawPhone.replace(/[^0-9]/g, '');
    const phone = digits.length === 10 ? `91${digits}` : digits;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://drwellcare.com';
    const total = Number(ord.totalPrice || ord.total || 0);
    const advance = Math.max(0, Number(ord.advanceAmount || 0));
    const balance = ord.balanceAmount !== undefined ? Number(ord.balanceAmount) : Math.max(0, total - advance);

    const trackingText = ord.trackingId ? `\n🚚 Courier: ${ord.courier || 'Blue Dart'}\n📦 Tracking AWB: ${ord.trackingId}` : '';
    const paymentBreakdown = advance > 0
      ? `\n💰 *Total Price:* ₹${total.toLocaleString('en-IN')}\n💵 *Advance Paid:* ₹${advance.toLocaleString('en-IN')}\n📦 *Balance Due on Delivery:* ₹${balance.toLocaleString('en-IN')} (${ord.paymentMethod})`
      : `\n💰 *Total Amount:* ₹${total.toLocaleString('en-IN')} (${ord.paymentMethod})`;

    const text = encodeURIComponent(
      `*Dr.Well Care Mattress — Order Update*\n\n` +
      `Hello ${ord.customerName},\n` +
      `Here is an update on your order *#${ord.orderNumber}*:\n\n` +
      `📌 *Status:* ${ord.orderStatus}${paymentBreakdown}${trackingText}\n\n` +
      `Track your order live anytime:\n${origin}/account\n\n` +
      `Thank you for choosing Dr.Well Care!`
    );
    return phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
  };

  return (
                /* ── 3 CARDS PER ROW GRID ── */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrders.map((ord) => {
                    const currentCourier = getTrackingField(ord, 'courier') || 'Blue Dart Express';
                    const currentTrackingId = getTrackingField(ord, 'trackingId');
                    const currentTrackingUrl = getTrackingField(ord, 'trackingUrl');
                    const isSavingThis = savingTrackingId === ord._id;
                    const items = ord.items || [];

                    // Helper to format WhatsApp URL for direct customer dispatch
  const getCustomerWhatsAppUrl = (ord: OrderType) => {
    const rawPhone = ord.customerPhone || '';
    const digits = rawPhone.replace(/[^0-9]/g, '');
    const phone = digits.length === 10 ? `91${digits}` : digits;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://drwellcare.com';
    const total = Number(ord.totalPrice || ord.total || 0);
    const advance = Math.max(0, Number(ord.advanceAmount || 0));
    const balance = ord.balanceAmount !== undefined ? Number(ord.balanceAmount) : Math.max(0, total - advance);

    const trackingText = ord.trackingId ? `\n🚚 Courier: ${ord.courier || 'Blue Dart'}\n📦 Tracking AWB: ${ord.trackingId}` : '';
    const paymentBreakdown = advance > 0
      ? `\n💰 *Total Price:* ₹${total.toLocaleString('en-IN')}\n💵 *Advance Paid:* ₹${advance.toLocaleString('en-IN')}\n📦 *Balance Due on Delivery:* ₹${balance.toLocaleString('en-IN')} (${ord.paymentMethod})`
      : `\n💰 *Total Amount:* ₹${total.toLocaleString('en-IN')} (${ord.paymentMethod})`;

    const text = encodeURIComponent(
      `*Dr.Well Care Mattress — Order Update*\n\n` +
      `Hello ${ord.customerName},\n` +
      `Here is an update on your order *#${ord.orderNumber}*:\n\n` +
      `📌 *Status:* ${ord.orderStatus}${paymentBreakdown}${trackingText}\n\n` +
      `Track your order live anytime:\n${origin}/account\n\n` +
      `Thank you for choosing Dr.Well Care!`
    );
    return phone ? `https://api.whatsapp.com/send?phone=${phone}&text=${text}` : `https://api.whatsapp.com/send?text=${text}`;
  };

  return (
                      <div
                        key={ord._id}
                        className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                      >
                        {/* ── CARD TOP / HEADER ── */}
                        <div className="p-5 pb-4 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-black text-sm text-[#0682E4] tracking-tight">
                                  {ord.orderNumber}
                                </span>
                                <button
                                  onClick={() => handleCopy(ord.orderNumber, ord._id)}
                                  title="Copy Order ID"
                                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                >
                                  {copiedOrderId === ord._id ? (
                                    <Check size={13} className="text-emerald-600" />
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                </button>
                              </div>
                              <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                                <Clock size={11} />
                                {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteOrder(ord._id, ord.orderNumber)}
                              title="Delete Order"
                              className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Status & Payment Tag Row */}
                          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
                            {/* Order Status Select */}
                            <div className="relative flex-grow">
                              <select
                                value={ord.orderStatus}
                                onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                                className={`w-full rounded-xl px-3 py-1.5 text-xs font-extrabold outline-none border transition-all cursor-pointer ${
                                  ord.orderStatus === 'Delivered'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : ord.orderStatus === 'Cancelled'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : ord.orderStatus === 'Shipped'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : ord.orderStatus === 'Out for Delivery'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>

                            {/* Payment Status Pill */}
                            <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-extrabold text-slate-700">
                              <span className="uppercase text-[10px] font-black">{ord.paymentMethod}</span>
                              <span
                                className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                                  ord.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {ord.isPaid ? 'PAID' : 'PENDING'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ── CARD BODY ── */}
                        <div className="p-5 space-y-4 flex-grow text-xs">
                          {/* Customer Details */}
                          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#0B1A2A] text-white flex items-center justify-center font-black text-xs shrink-0">
                                {ord.customerName?.charAt(0)?.toUpperCase() || 'C'}
                              </div>
                              <span className="font-extrabold text-slate-900 text-sm truncate">
                                {ord.customerName}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-slate-600 pt-1">
                              <a
                                href={`tel:${ord.customerPhone}`}
                                className="flex items-center gap-1 text-[#0682E4] hover:underline font-semibold"
                              >
                                <Phone size={12} /> {ord.customerPhone}
                              </a>
                              {ord.customerEmail && ord.customerEmail !== 'N/A' && (
                                <a
                                  href={`mailto:${ord.customerEmail}`}
                                  className="flex items-center gap-1 text-slate-500 hover:text-[#0682E4] truncate max-w-[140px]"
                                  title={ord.customerEmail}
                                >
                                  <Mail size={12} /> {ord.customerEmail}
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Shipping Address (Full Details) */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <MapPin size={11} className="text-[#0682E4]" /> Full Shipping Address
                            </span>
                            <p className="text-slate-700 font-medium leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100 text-xs whitespace-pre-line">
                              {formatAddress(ord.shippingAddress)}
                            </p>
                          </div>

                          {/* Purchased Items List */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                              <span>Purchased Items ({items.length})</span>
                              <span>Price</span>
                            </div>

                            <div className="max-h-36 overflow-y-auto space-y-2 pr-1 hide-scrollbar">
                              {items.length > 0 ? (
                                items.map((it: any, i: number) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                                  >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-200 flex items-center justify-center">
                                      {it.image ? (
                                        <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <Package className="w-5 h-5 text-slate-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-extrabold text-slate-900 truncate">
                                        <span className="text-[#0682E4] font-black">{it.qty || 1}x</span> {it.name || 'Mattress'}
                                      </div>
                                      <div className="text-[10.5px] text-slate-500 truncate mt-0.5">
                                        {it.variantSku || it.dimensions || it.size || 'Standard'}
                                      </div>
                                      {it.color && (
                                        <div className="flex items-center gap-1 mt-0.5">
                                          <span
                                            className={`w-2 h-2 rounded-full border border-black/10 ${
                                              it.color === 'Blue' ? 'bg-[#0682E4]' : it.color === 'Gray' ? 'bg-slate-400' : 'bg-white'
                                            }`}
                                          />
                                          <span className="text-[10px] font-medium text-slate-500">Color: {it.color}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="font-mono font-extrabold text-slate-900 text-xs">
                                        ₹{Number(it.price || 0).toLocaleString('en-IN')}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-slate-400 text-xs text-center py-2">0 items listed.</p>
                              )}
                            </div>
                          </div>

                          {/* Grand Total Strip */}
                          <div className="flex items-baseline justify-between p-3 rounded-2xl bg-[#0B1A2A] text-white">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                                Total Order Amount
                              </span>
                              <span className="text-[10px] text-slate-400">All taxes included</span>
                            </div>
                            <span className="text-xl font-black font-mono text-[#7cb93e]">
                              ₹{Number(ord.totalPrice || ord.total || 0).toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* ── ADVANCE PAYMENT & BALANCE DUE SECTION ── */}
                          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-black text-[#0B1A2A] uppercase tracking-wider flex items-center gap-1.5">
                                <CreditCard size={13} className="text-[#0682E4]" /> Advance Payment & Balance
                              </span>
                              {Number(ord.advanceAmount || 0) > 0 ? (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                                  Advance: ₹{Number(ord.advanceAmount).toLocaleString('en-IN')}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200/70 text-slate-600">
                                  ₹0 Advance
                                </span>
                              )}
                            </div>

                            {/* Editable Advance Input + Quick Update Button */}
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                                <input
                                  type="number"
                                  min="0"
                                  max={Number(ord.totalPrice || ord.total || 0)}
                                  value={getAdvanceInputValue(ord._id, ord.advanceAmount || 0)}
                                  onChange={(e) => handleAdvanceInputChange(ord._id, e.target.value)}
                                  placeholder="Advance received..."
                                  className="w-full pl-7 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0682E4]"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSaveAdvance(ord)}
                                disabled={savingAdvanceId === ord._id}
                                className="py-1.5 px-3 bg-[#0682E4] hover:bg-[#0571c7] text-white rounded-xl text-xs font-extrabold transition-all shadow-sm flex items-center gap-1 active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
                              >
                                {savingAdvanceId === ord._id ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />}
                                Save Advance
                              </button>
                            </div>

                            {/* Balance Breakdown Display */}
                            <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                              <div>
                                <span className="text-slate-600 font-bold block">
                                  Balance Due (COD / Delivery):
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ₹{Number(ord.totalPrice || ord.total || 0).toLocaleString('en-IN')} - ₹{Number(ord.advanceAmount || 0).toLocaleString('en-IN')}
                                </span>
                              </div>
                              <span className="font-mono font-black text-base text-[#0B1A2A]">
                                ₹{Math.max(0, Number(ord.totalPrice || ord.total || 0) - Number(ord.advanceAmount || 0)).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          {/* ── LIVE TRACKING MANAGEMENT SECTION ── */}
                          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-black text-[#0B1A2A] uppercase tracking-wider flex items-center gap-1.5">
                                <Truck size={14} className="text-[#0682E4]" /> Live Tracking Code
                              </span>
                              {ord.trackingId && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                                  AWB Active
                                </span>
                              )}
                            </div>

                            {/* Courier Dropdown */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">
                                  Courier Partner
                                </label>
                                <select
                                  value={currentCourier}
                                  onChange={(e) => setTrackingField(ord._id, 'courier', e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0682E4]"
                                >
                                  <option value="Blue Dart Express">Blue Dart</option>
                                  <option value="Delhivery Logistics">Delhivery</option>
                                  <option value="DTDC Express">DTDC</option>
                                  <option value="India Post">India Post</option>
                                  <option value="Dr.Well Care Express">Dr.Well Logistics</option>
                                  <option value="Shadowfax">Shadowfax</option>
                                  <option value="Ekart Logistics">Ekart</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">
                                  Tracking Code / AWB
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. BD-844545"
                                  value={currentTrackingId}
                                  onChange={(e) => setTrackingField(ord._id, 'trackingId', e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#0682E4]"
                                />
                              </div>
                            </div>

                            {/* Tracking URL input */}
                            <div>
                              <label className="text-[10px] font-extrabold text-slate-500 uppercase block mb-1">
                                Live Tracking URL (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="https://track.courier.com/..."
                                value={currentTrackingUrl}
                                onChange={(e) => setTrackingField(ord._id, 'trackingUrl', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-800 focus:outline-none focus:border-[#0682E4]"
                              />
                            </div>

                            {/* Update Tracking Button */}
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleSaveTracking(ord)}
                                disabled={isSavingThis}
                                className="flex-1 py-2 px-3 bg-[#0682E4] hover:bg-[#0571c7] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                              >
                                {isSavingThis ? (
                                  <>
                                    <RefreshCw size={13} className="animate-spin" /> Saving...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 size={13} /> Update Tracking Code
                                  </>
                                )}
                              </button>

                              {(ord.trackingUrl || ord.trackingId) && (
                                <a
                                  href={
                                    ord.trackingUrl ||
                                    (ord.courier?.toLowerCase().includes('delhivery')
                                      ? `https://www.delhivery.com/track/package/${ord.trackingId}`
                                      : `https://www.bluedart.com/tracking`)
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Open Courier Portal"
                                  className="p-2 bg-white hover:bg-slate-100 text-[#0682E4] border border-slate-200 rounded-xl transition-colors shrink-0"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ── CARD BOTTOM / ACTION FOOTER ── */}
                        <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/50 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptOrder(ord)}
                            className="py-2.5 px-3 bg-slate-900 hover:bg-[#0682E4] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                          >
                            <Printer size={14} />
                            Receipt
                          </button>
                          <a
                            href={getCustomerWhatsAppUrl(ord)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 text-center"
                            title="Send order update directly to customer's WhatsApp"
                          >
                            <Send size={14} />
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* ── TAB: 3D PROMO OFFERS ── */}
        {activeTab === 'offers' && (
          <AdminOffersManager
            initialOffer={initialOffer}
            showToast={showToast}
          />
        )}
      </div>

      {/* ── Toast Notification Banner ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-[200] px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2.5 border ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : 'bg-red-900 text-white border-red-700'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertCircle size={16} className="text-red-400" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Official Order Receipt Modal ── */}
      <OrderReceiptModal
        order={selectedReceiptOrder}
        open={Boolean(selectedReceiptOrder)}
        onClose={() => setSelectedReceiptOrder(null)}
      />

      {/* ── Add/Edit Drawer ── */}
      <AdminProductFormDrawer
        open={drawerOpen}
        mode={drawerMode}
        product={drawerProduct}
        onClose={() => setDrawerOpen(false)}
        onSaved={handleProductSaved}
      />

      {/* ── Delete Confirm Modal ── */}
      <AdminDeleteConfirmModal
        open={!!deleteTarget}
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleProductDeleted}
      />
      {/* ── Create User Account & Order Modal ── */}
      <AdminCreateUserOrderModal
        open={createOrderModalOpen}
        onClose={() => setCreateOrderModalOpen(false)}
        products={products}
        onOrderCreated={handleOrderCreated}
        onViewReceipt={setSelectedReceiptOrder}
        showToast={showToast}
      />
    </div>
  );
}
