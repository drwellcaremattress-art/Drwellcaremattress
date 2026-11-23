'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import {
  Store, Plus, Search, FileText, IndianRupee, Printer, ExternalLink,
  ShieldCheck, LogOut, CheckCircle2, Phone, Mail, MapPin, Package,
  Clock, CreditCard, Sparkles, X, RefreshCw, ShoppingCart, User
} from 'lucide-react';
import AdminCreateUserOrderModal from '../admin/AdminCreateUserOrderModal';
import OrderReceiptModal from '../orders/OrderReceiptModal';
import { ProductType } from '../admin/AdminProductTable';

export interface DealerInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  storeName: string;
  city?: string;
  state?: string;
  gstNumber?: string;
  address?: string;
}

interface DealerPortalClientProps {
  dealerInfo: DealerInfo;
  initialOrders: any[];
  products: ProductType[];
}

export default function DealerPortalClient({
  dealerInfo,
  initialOrders,
  products,
}: DealerPortalClientProps) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<any | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOrderCreated = (newOrder: any) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.includes(q) ||
      (o.items || []).some((it: any) => it.name?.toLowerCase().includes(q))
    );
  });

  const totalSales = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Processing' || o.orderStatus === 'Confirmed').length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* ── Dealer Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-[#0B1A2A] text-white border-b border-white/10 shadow-lg backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Store Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0682E4] text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
              <Store size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-heading font-black tracking-tight text-white">
                  {dealerInfo.storeName}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black uppercase tracking-wider">
                  Authorized Dealer
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
                <span>Partner: <b>{dealerInfo.name}</b></span>
                {dealerInfo.phone && <span>• {dealerInfo.phone}</span>}
                {dealerInfo.city && <span>• {dealerInfo.city}</span>}
              </p>
            </div>
          </div>

          {/* Action & Logout */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-[#0682E4] hover:bg-[#056ec1] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Create Invoice &amp; Order</span>
              <span className="sm:hidden">New Invoice</span>
            </button>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-[#0B1A2A] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} className="text-emerald-400" /> Dr. Well Care Partner Network
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight">
                Welcome back, {dealerInfo.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Generate official GST invoices, register customer login credentials for warranty benefits, and track fulfillment in real time. Every invoice automatically prints your showroom name <b>{dealerInfo.storeName}</b> as the authorized issuing partner.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="py-3 px-6 rounded-2xl bg-white hover:bg-slate-100 text-[#0B1A2A] font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
            >
              <Plus size={18} className="text-[#0682E4]" /> + New Customer Invoice
            </button>
          </div>
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0682E4] flex items-center justify-center font-black">
              <FileText size={22} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Invoices Billed</span>
              <span className="text-2xl font-black text-slate-900">{orders.length}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <IndianRupee size={22} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Billed Volume</span>
              <span className="text-2xl font-black text-slate-900">₹{totalSales.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Clock size={22} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">In-Transit / Processing</span>
              <span className="text-2xl font-black text-slate-900">{pendingOrders}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-black">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Delivered Orders</span>
              <span className="text-2xl font-black text-slate-900">{deliveredOrders}</span>
            </div>
          </div>
        </div>

        {/* ── Search & Filter ── */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <Search size={18} className="text-slate-400 ml-1" />
          <input
            type="text"
            placeholder="Search your invoices by Order Number, Customer Name, Phone, Mattress..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          )}
        </div>

        {/* ── Invoices & Orders Table ── */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-base text-slate-900">
                Dealer Orders &amp; Invoices
              </h3>
              <p className="text-xs text-slate-500">
                Official receipts generated under {dealerInfo.storeName}. Click any invoice to preview or print.
              </p>
            </div>
            <span className="text-xs font-extrabold text-[#0682E4] bg-blue-50 px-3 py-1 rounded-full">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="py-20 text-center text-slate-400 space-y-3">
              <FileText size={40} className="mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">No Invoices Found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery
                  ? `No orders match "${searchQuery}".`
                  : 'You have not created any customer orders yet. Click "+ Create Invoice & Order" to generate your first customer order.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">Order / Invoice #</th>
                    <th className="py-3.5 px-4">Customer Details</th>
                    <th className="py-3.5 px-4">Purchased Mattresses</th>
                    <th className="py-3.5 px-4 text-right">Total Amount</th>
                    <th className="py-3.5 px-4 text-center">Payment</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Invoice Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Order Number & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-extrabold text-slate-900 block text-xs">
                          {o.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {o.createdAt
                            ? new Date(o.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Recent'}
                        </span>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{o.customerName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone size={10} className="text-slate-400" />
                          <span>{o.customerPhone}</span>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {(o.items || []).map((it: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                              <span className="font-extrabold">{it.name}</span>
                              <span className="text-slate-400 text-[10.5px]">
                                ({it.size || it.dimensions || 'Standard'} • {it.color || 'White'})
                              </span>
                              <span className="font-bold text-[#0682E4] text-[10.5px]">×{it.qty || 1}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-black text-slate-900 text-sm">
                          ₹{(Number(o.total) || 0).toLocaleString('en-IN')}
                        </div>
                        {o.advanceAmount > 0 && o.balanceAmount > 0 && (
                          <div className="text-[10px] text-amber-600 font-bold">
                            Bal: ₹{Number(o.balanceAmount).toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                            o.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : o.paymentStatus === 'advance_paid'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {o.paymentStatus === 'paid' ? 'Paid' : o.paymentStatus === 'advance_paid' ? 'Adv Paid' : 'Pending / COD'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                            o.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700'
                              : o.orderStatus === 'Shipped'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-blue-50 text-[#0682E4]'
                          }`}
                        >
                          {o.orderStatus || 'Processing'}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedReceiptOrder(o)}
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-[#0682E4] text-white font-extrabold text-xs shadow-xs transition-all active:scale-95"
                        >
                          <Printer size={13} /> View Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ── Order Creation Modal for Dealer ── */}
      <AdminCreateUserOrderModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        products={products}
        onOrderCreated={handleOrderCreated}
        onViewReceipt={(ord) => {
          setIsCreateModalOpen(false);
          setSelectedReceiptOrder(ord);
        }}
        showToast={showToast}
        dealerInfo={{
          id: dealerInfo.id,
          name: dealerInfo.name,
          storeName: dealerInfo.storeName,
          phone: dealerInfo.phone,
          email: dealerInfo.email,
        }}
      />

      {/* ── Official Invoice Receipt Modal (with Dealer Details) ── */}
      <OrderReceiptModal
        order={selectedReceiptOrder}
        open={Boolean(selectedReceiptOrder)}
        onClose={() => setSelectedReceiptOrder(null)}
      />

      {/* ── Toast ── */}
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
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
