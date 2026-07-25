'use client';

import React, { useState } from 'react';
import AdminProductTable, { ProductType } from './AdminProductTable';
import { Package, ShoppingCart, Plus, RefreshCw, X, Check, Truck, AlertCircle, Image as ImageIcon } from 'lucide-react';
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
  const [showAddModal, setShowAddModal] = useState(false);

  // New product state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Orthopaedic');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [basePrice, setBasePrice] = useState(546);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct: ProductType = {
      _id: Date.now().toString(),
      slug,
      name,
      brand: 'Dr.Well Care',
      category,
      description: description || 'High-resilience orthopaedic core mattress for optimal posture and spinal relief.',
      benefits: ['Zero Motion Transfer', 'Hypoallergenic Cover', '10-Year Warranty'],
      images: imageUrl ? [{ url: imageUrl, alt: name, position: 0 }] : [{ url: '/images/luxury_hr_mattress.png', alt: name, position: 0 }],
      variants: [
        { size: 'Single (72" × 36")', dimensions: '72" × 36"', thickness_cm: 15, price: basePrice * 18, mrp: basePrice * 25, sku: `${slug}-single`, stock: 15 },
        { size: 'Queen (78" × 60")', dimensions: '78" × 60"', thickness_cm: 15, price: basePrice * 32.5, mrp: basePrice * 45, sku: `${slug}-queen`, stock: 20 },
        { size: 'King (78" × 72")', dimensions: '78" × 72"', thickness_cm: 15, price: basePrice * 39, mrp: basePrice * 55, sku: `${slug}-king`, stock: 12 },
      ],
      firmness: 'Medium Firm',
      warranty_years: 10,
      trialNights: 100,
      ratingAvg: 5.0,
      ratingCount: 1,
      seo: { title: name, description: name, keywords: 'mattress, orthopaedic' },
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
    } catch (err) {
      console.log('Saved to local state fallback');
    }

    setProducts([newProduct, ...products]);
    setShowAddModal(false);
    setName('');
    setDescription('');
    setImageUrl('');
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-body">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Bar Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-[#0B1A2A] p-3 rounded-2xl text-[#7cb93e] shadow-lg">
                <Package size={26} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#0B1A2A] font-heading">
                  Dr.Well Care Store Admin
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Product Inventory, Stock Management & Live Order Fulfillment
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#0682E4] hover:bg-[#0682E4]/90 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-md flex items-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              <Plus size={18} /> Add New Product
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-[#0682E4] text-[#0682E4]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Package size={18} /> Product Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-[#0682E4] text-[#0682E4]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ShoppingCart size={18} /> Live Orders ({orders.length})
          </button>
        </div>

        {/* TAB 1: PRODUCTS INVENTORY */}
        {activeTab === 'products' && (
          <div>
            <AdminProductTable products={products} />
          </div>
        )}

        {/* TAB 2: LIVE ORDERS TRACKING */}
        {activeTab === 'orders' && (
          <div className="bg-white shadow-xl rounded-3xl p-6 border border-slate-100 space-y-4">
            <h3 className="text-lg font-extrabold text-[#0B1A2A]">Live Customer Orders</h3>

            {orders.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-700">No orders placed yet.</p>
                <p className="text-xs">Test orders placed on the website will appear here in real-time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] tracking-wider">
                    <tr>
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4 text-right">Total</th>
                      <th className="p-4 text-center">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <span className="font-mono font-bold text-[#0682E4] block">{ord.orderNumber}</span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-[#0B1A2A] block">{ord.customerName}</span>
                          <span className="text-xs text-slate-400">{ord.customerPhone}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold uppercase text-slate-700 block">{ord.paymentMethod}</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Authorized
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-base text-[#0B1A2A]">
                          ₹{ord.totalPrice?.toLocaleString('en-IN')}
                        </td>
                        <td className="p-4 text-center">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#0B1A2A] outline-none focus:border-[#0682E4]"
                          >
                            <option value="Processing">Processing</option>
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

      {/* ADD NEW PRODUCT MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-extrabold text-[#0B1A2A] mb-4 flex items-center gap-2">
                <Plus className="text-[#0682E4]" /> Add New Mattress Product
              </h3>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr.Well Care Ultra Ortho"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0682E4]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0682E4]"
                    >
                      <option value="Orthopaedic">Orthopaedic</option>
                      <option value="Bonded Series">Bonded Series</option>
                      <option value="Luxury HR Series">Luxury HR Series</option>
                      <option value="Natural Latex">Natural Latex</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Base Price / SqFt (₹)</label>
                    <input
                      type="number"
                      required
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0682E4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Image Asset URL</label>
                  <input
                    type="text"
                    placeholder="/images/luxury_hr_mattress.png"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0682E4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Short product overview..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0682E4]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0682E4] hover:bg-[#0682E4]/90 text-white font-bold text-sm shadow-md"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
