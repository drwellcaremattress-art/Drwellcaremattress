'use client';

import React, { useState } from 'react';
import {
  ChevronDown, ChevronUp, Package, Star, ShieldCheck, Moon,
  Edit, Trash2, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ProductType {
  _id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  type?: string;
  description: string;
  benefits: string[];
  images: { url: string; alt: string; position: number }[];
  variants: {
    size: string;
    dimensions: string;
    thickness_cm: number;
    price: number;
    mrp: number;
    sku: string;
    stock: number;
  }[];
  firmness: string;
  warranty_years: number;
  originalPrice?: number;
  sqftPrice?: number;
  thickness?: string;
  subtitle?: string;
  trialNights: number;
  ratingAvg: number;
  ratingCount: number;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  status: string;
  createdAt: string;
}

interface Props {
  products: ProductType[];
  onEdit: (product: ProductType) => void;
  onDelete: (product: ProductType) => void;
  onStatusToggle: (product: ProductType, newStatus: string) => void;
}

export default function AdminProductTable({ products, onEdit, onDelete, onStatusToggle }: Props) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleStatusToggle = async (product: ProductType, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = product.status === 'active' ? 'draft' : 'active';
    setTogglingStatus(product._id);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        onStatusToggle(product, newStatus);
      }
    } catch (err) {
      console.error('Status toggle failed:', err);
    } finally {
      setTogglingStatus(null);
    }
  };

  const totalStock = (product: ProductType) =>
    product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 0;

  const lowestPrice = (product: ProductType) => {
    if (!product.variants || product.variants.length === 0) return null;
    return Math.min(...product.variants.map(v => v.price));
  };

  const categoryColor = (cat: string) => {
    const map: Record<string, string> = {
      orthopaedic: 'bg-blue-100 text-blue-800',
      bonded: 'bg-purple-100 text-purple-800',
      latex: 'bg-green-100 text-green-800',
      'memory-foam': 'bg-indigo-100 text-indigo-800',
      hybrid: 'bg-orange-100 text-orange-800',
      'pocket-spring': 'bg-cyan-100 text-cyan-800',
      budget: 'bg-yellow-100 text-yellow-800',
    };
    return map[cat?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-100 text-slate-500 uppercase text-[11px] tracking-wider font-bold">
              <th className="px-6 py-4">Product</th>
              <th className="px-4 py-4">Category</th>
              <th className="px-4 py-4">Price</th>
              <th className="px-4 py-4">Stock</th>
              <th className="px-4 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const stock = totalStock(product);
              const price = lowestPrice(product);
              const isLowStock = stock > 0 && stock < 10;
              const isOutOfStock = stock === 0;

              return (
                <React.Fragment key={product._id}>
                  <tr
                    onClick={() => toggleRow(product._id)}
                    className={`hover:bg-blue-50/40 cursor-pointer transition-colors duration-150 ${
                      expandedRow === product._id ? 'bg-blue-50/40' : 'bg-white'
                    }`}
                  >
                    {/* Product Name + Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                          {product.images?.[0]?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-300">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{product.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{product.slug}</div>
                          <div className="text-[11px] text-slate-500 font-semibold">{product.firmness}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${categoryColor(product.category)}`}>
                        {(product.category || '').replace(/-/g, ' ')}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-4">
                      {price !== null ? (
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm">₹{price.toLocaleString('en-IN')}</span>
                          <span className="text-[11px] text-slate-400 block">from</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">N/A</span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isOutOfStock
                          ? 'bg-red-100 text-red-700'
                          : isLowStock
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isOutOfStock && <AlertCircle size={10} />}
                        {isOutOfStock ? 'Out of Stock' : isLowStock ? `Low: ${stock}` : `${stock} units`}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={(e) => handleStatusToggle(product, e)}
                        disabled={togglingStatus === product._id}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${
                          product.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {product.status === 'active' ? <Eye size={11} /> : <EyeOff size={11} />}
                        {product.status === 'active' ? 'Active' : 'Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                          title="Edit product"
                          className="p-2 rounded-xl text-slate-400 hover:text-[#0682E4] hover:bg-blue-50 transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(product); }}
                          title="Delete product"
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleRow(product._id); }}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                        >
                          {expandedRow === product._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Details Row */}
                  <AnimatePresence>
                    {expandedRow === product._id && (
                      <tr>
                        <td colSpan={6} className="p-0 border-b border-gray-100">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: 'easeInOut' }}
                            className="overflow-hidden bg-slate-50/60"
                          >
                            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* Left: Description + Benefits + Meta */}
                              <div className="space-y-5">
                                <div>
                                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Description</h4>
                                  <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Moon size={14} /></div>
                                    <div>
                                      <div className="text-[10px] text-slate-400 font-semibold">Firmness</div>
                                      <div className="text-sm font-bold text-slate-800">{product.firmness}</div>
                                    </div>
                                  </div>
                                  <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><ShieldCheck size={14} /></div>
                                    <div>
                                      <div className="text-[10px] text-slate-400 font-semibold">Warranty</div>
                                      <div className="text-sm font-bold text-slate-800">{product.warranty_years} yrs</div>
                                    </div>
                                  </div>
                                  <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Moon size={14} /></div>
                                    <div>
                                      <div className="text-[10px] text-slate-400 font-semibold">Trial Nights</div>
                                      <div className="text-sm font-bold text-slate-800">{product.trialNights}</div>
                                    </div>
                                  </div>
                                  <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                                    <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Star size={14} /></div>
                                    <div>
                                      <div className="text-[10px] text-slate-400 font-semibold">Rating</div>
                                      <div className="text-sm font-bold text-slate-800">{product.ratingAvg} ({product.ratingCount})</div>
                                    </div>
                                  </div>
                                </div>

                                {product.benefits?.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Benefits</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                      {product.benefits.map((b, i) => (
                                        <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-600 font-medium">{b}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Right: Variants + SEO */}
                              <div className="space-y-5">
                                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 font-extrabold text-xs text-slate-600 uppercase tracking-wider">
                                    Variants ({product.variants?.length || 0})
                                  </div>
                                  <div className="max-h-52 overflow-y-auto divide-y divide-slate-100">
                                    {product.variants?.map((v, i) => (
                                      <div key={i} className="flex justify-between items-center px-4 py-3 hover:bg-slate-50 transition-colors">
                                        <div>
                                          <div className="font-bold text-sm text-slate-800">{v.size}</div>
                                          <div className="text-[11px] text-slate-400 font-mono">SKU: {v.sku}</div>
                                          <div className="text-[11px] text-slate-400">{v.thickness_cm}cm • {v.dimensions}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-extrabold text-slate-900">₹{v.price?.toLocaleString('en-IN')}</div>
                                          <div className="text-[11px] text-slate-400 line-through">₹{v.mrp?.toLocaleString('en-IN')}</div>
                                          <div className={`text-[11px] font-bold mt-0.5 ${v.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                            Stock: {v.stock}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {product.seo && (
                                  <div className="bg-white border border-slate-200 rounded-2xl p-4">
                                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3">SEO Details</h4>
                                    <div className="space-y-2 text-xs">
                                      <div><span className="text-slate-400 font-semibold">Title: </span><span className="text-slate-700 font-medium">{product.seo.title || '—'}</span></div>
                                      <div><span className="text-slate-400 font-semibold">Desc: </span><span className="text-slate-600 line-clamp-2">{product.seo.description || '—'}</span></div>
                                      <div><span className="text-slate-400 font-semibold">Keywords: </span><span className="text-slate-600 italic">{product.seo.keywords || '—'}</span></div>
                                    </div>
                                  </div>
                                )}

                                {/* Quick action buttons in expanded view */}
                                <div className="flex gap-3">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0682E4] text-white text-xs font-extrabold hover:bg-[#0682E4]/90 transition-colors shadow-sm"
                                  >
                                    <Edit size={13} /> Edit All Details
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(product); }}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-extrabold hover:bg-red-100 transition-colors"
                                  >
                                    <Trash2 size={13} /> Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}

            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                  <Package className="mx-auto h-14 w-14 text-slate-200 mb-4" />
                  <p className="text-lg font-extrabold text-slate-700 mb-1">No products in inventory</p>
                  <p className="text-sm text-slate-400">Click "Add New Product" to create your first product in MongoDB.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
