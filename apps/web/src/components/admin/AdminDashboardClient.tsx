'use client';

import React, { useState } from 'react';
import AdminProductTable, { ProductType } from './AdminProductTable';
import AdminProductFormDrawer from './AdminProductFormDrawer';
import AdminDeleteConfirmModal from './AdminDeleteConfirmModal';
import {
  Package, ShoppingCart, Plus, RefreshCw, X, Check,
  Truck, AlertCircle, BarChart3, TrendingUp, IndianRupee, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderType {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: any;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  orderStatus: string;
  items: any[];
  createdAt: string;
}

export default function AdminDashboardClient({
  initialProducts,
  initialOrders,
}: {
  initialProducts: ProductType[];
  initialOrders: OrderType[];
}) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [orders, setOrders] = useState<OrderType[]>(initialOrders);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'add' | 'edit'>('add');
  const [drawerProduct, setDrawerProduct] = useState<ProductType | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ProductType | null>(null);

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
    setOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
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

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

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
          <button
            onClick={openAddDrawer}
            className="flex items-center gap-2 bg-[#0682E4] hover:bg-[#0682E4]/90 text-white px-5 py-3 rounded-2xl font-extrabold text-sm shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95"
          >
            <Plus size={18} /> Add New Product
          </button>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
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
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#0B1A2A]">Live Customer Orders</h3>
              <span className="text-xs text-slate-400 font-semibold">{orders.length} total orders</span>
            </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <ShoppingCart className="w-14 h-14 mx-auto mb-3 text-slate-200" />
                <p className="font-extrabold text-slate-700 mb-1">No orders placed yet.</p>
                <p className="text-xs text-slate-400">Orders placed on the website will appear here in real-time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="p-4">Order</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Items</th>
                      <th className="p-4 text-right">Total</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <span className="font-mono font-extrabold text-[#0682E4] block text-xs">{ord.orderNumber}</span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-800 block text-sm">{ord.customerName}</span>
                          <span className="text-[11px] text-slate-400">{ord.customerPhone}</span>
                          <span className="text-[11px] text-slate-400">{ord.customerEmail}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold uppercase text-slate-700 block text-xs">{ord.paymentMethod}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ord.isPaid ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                            {ord.isPaid ? '✓ Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-xs text-slate-500">{ord.items?.length || 0} item(s)</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-extrabold text-base text-slate-900">₹{ord.totalPrice?.toLocaleString('en-IN')}</span>
                        </td>
                        <td className="p-4 text-center">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-extrabold outline-none border transition-all cursor-pointer ${
                              ord.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              ord.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                              ord.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

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
    </div>
  );
}
