'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Package, Star, ShieldCheck, Moon, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mocking the interface based on the schema
export interface ProductType {
  _id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
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

export default function AdminProductTable({ products }: { products: ProductType[] }) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <th className="px-6 py-4 font-semibold">Image & Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <React.Fragment key={product._id}>
                <tr
                  onClick={() => toggleRow(product._id)}
                  className={`hover:bg-blue-50/50 cursor-pointer transition-colors duration-200 ${
                    expandedRow === product._id ? 'bg-blue-50/50' : 'bg-white'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <Package size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 font-mono text-xs">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                      {product.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <button className="hover:text-blue-600 transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(product._id);
                        }}
                        className="hover:text-gray-900 transition-colors"
                      >
                        {expandedRow === product._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expandable Details Row */}
                <AnimatePresence>
                  {expandedRow === product._id && (
                    <tr>
                      <td colSpan={4} className="p-0 border-b border-gray-100">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden bg-gray-50/50"
                        >
                          <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                            {/* Left Column: Details */}
                            <div className="flex-1 space-y-6">
                              <div>
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                                  Description
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {product.description}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Moon size={16} /></div>
                                  <div>
                                    <div className="text-xs text-gray-500">Firmness</div>
                                    <div className="text-sm font-semibold">{product.firmness}</div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                                  <div className="bg-green-100 p-2 rounded-lg text-green-600"><ShieldCheck size={16} /></div>
                                  <div>
                                    <div className="text-xs text-gray-500">Warranty</div>
                                    <div className="text-sm font-semibold">{product.warranty_years} yrs</div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                                  <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Moon size={16} /></div>
                                  <div>
                                    <div className="text-xs text-gray-500">Trial Nights</div>
                                    <div className="text-sm font-semibold">{product.trialNights}</div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                                  <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Star size={16} /></div>
                                  <div>
                                    <div className="text-xs text-gray-500">Rating</div>
                                    <div className="text-sm font-semibold">{product.ratingAvg} ({product.ratingCount})</div>
                                  </div>
                                </div>
                              </div>
                              
                              {product.benefits?.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                                    Benefits
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {product.benefits.map((b, i) => (
                                      <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
                                        {b}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right Column: Variants & SEO */}
                            <div className="flex-1 space-y-6">
                              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 font-semibold text-sm text-gray-700">
                                  Variants ({product.variants?.length || 0})
                                </div>
                                <div className="max-h-64 overflow-y-auto p-4 space-y-3">
                                  {product.variants?.map((v, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                                      <div>
                                        <div className="font-medium text-sm text-gray-900">{v.size} ({v.thickness_cm}cm)</div>
                                        <div className="text-xs text-gray-500 font-mono">SKU: {v.sku}</div>
                                        <div className="text-xs text-gray-500">{v.dimensions}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-bold text-gray-900">₹{v.price}</div>
                                        <div className="text-xs text-gray-400 line-through">₹{v.mrp}</div>
                                        <div className={`text-xs mt-1 ${v.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                          Stock: {v.stock}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {product.seo && (
                                <div className="bg-white border border-gray-200 rounded-xl p-4">
                                  <h4 className="text-sm font-bold text-gray-900 mb-3">SEO Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <div><span className="text-gray-500">Title:</span> <span className="font-medium">{product.seo.title || 'N/A'}</span></div>
                                    <div><span className="text-gray-500">Description:</span> <span className="text-gray-600 line-clamp-2">{product.seo.description || 'N/A'}</span></div>
                                    <div><span className="text-gray-500">Keywords:</span> <span className="text-gray-600 italic">{product.seo.keywords || 'N/A'}</span></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
            
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-lg font-medium text-gray-900">No products found</p>
                  <p className="text-sm">Get started by creating a new product.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
