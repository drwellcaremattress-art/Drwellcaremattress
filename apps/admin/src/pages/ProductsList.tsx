import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, Package, Edit, Trash2, ChevronDown, ChevronUp, Moon, ShieldCheck, Star } from 'lucide-react';

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
}

const fetchProducts = async (): Promise<ProductType[]> => {
  try {
    const response = await axios.get('/api/products?admin=true');
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default function ProductsList() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Products</h1>
          <p className="text-ink-muted">Manage all products in your catalog.</p>
        </div>
        <Link 
          to="/products/new"
          className="bg-primary-blue hover:bg-primary-blue-dark text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      <div className="w-full bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-ink-muted uppercase text-xs tracking-wider font-semibold">
                <th className="px-6 py-4">Image & Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <React.Fragment key={product._id}>
                  <tr
                    onClick={() => toggleRow(product._id)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors duration-200 ${
                      expandedRow === product._id ? 'bg-slate-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package size={20} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-ink">{product.name}</div>
                          <div className="text-xs text-ink-muted font-mono">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize">
                        {product.category?.replace('-', ' ') || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          product.status === 'active'
                            ? 'bg-brand-green/10 text-brand-green'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {product.status || 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-slate-400">
                        <Link to={`/products/${product._id}`} className="hover:text-primary-blue transition-colors" title="Edit">
                          <Edit size={18} />
                        </Link>
                        <button className="hover:text-error-red transition-colors" title="Delete">
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(product._id);
                          }}
                          className="hover:text-ink transition-colors"
                        >
                          {expandedRow === product._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expandable Details Row */}
                  {expandedRow === product._id && (
                    <tr>
                      <td colSpan={4} className="p-0 border-b border-slate-100">
                        <div
                          className="overflow-hidden bg-slate-50/50 transition-all duration-300 ease-in-out"
                        >
                          <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                            {/* Left Column: Details */}
                            <div className="flex-1 space-y-6">
                              <div>
                                <h4 className="text-sm font-bold text-ink uppercase tracking-wider mb-2">
                                  Description
                                </h4>
                                <p className="text-sm text-ink-muted leading-relaxed line-clamp-3">
                                  {product.description || 'No description provided.'}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                                  <div className="bg-primary-blue-light/30 p-2 rounded-lg text-primary-blue"><Moon size={16} /></div>
                                  <div>
                                    <div className="text-xs text-slate-500">Firmness</div>
                                    <div className="text-sm font-semibold">{product.firmness || 'N/A'}</div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                                  <div className="bg-brand-green/20 p-2 rounded-lg text-brand-green"><ShieldCheck size={16} /></div>
                                  <div>
                                    <div className="text-xs text-slate-500">Warranty</div>
                                    <div className="text-sm font-semibold">{product.warranty_years || 0} yrs</div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                                  <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Moon size={16} /></div>
                                  <div>
                                    <div className="text-xs text-slate-500">Trial Nights</div>
                                    <div className="text-sm font-semibold">{product.trialNights || 100}</div>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                                  <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Star size={16} /></div>
                                  <div>
                                    <div className="text-xs text-slate-500">Rating</div>
                                    <div className="text-sm font-semibold">{product.ratingAvg || 0}</div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Column: Variants */}
                            <div className="flex-1 space-y-6">
                              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-semibold text-sm text-ink">
                                  Variants ({product.variants?.length || 0})
                                </div>
                                <div className="max-h-48 overflow-y-auto p-4 space-y-3">
                                  {product.variants?.map((v, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 hover:border-primary-blue/30 transition-colors">
                                      <div>
                                        <div className="font-medium text-sm text-ink">{v.size || v.dimensions} ({v.thickness_cm || 15}cm)</div>
                                        <div className="text-xs text-slate-500 font-mono">SKU: {v.sku || `SKU-${i}`}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-bold text-brand-green">₹{v.price}</div>
                                        <div className="text-xs text-slate-400 line-through">₹{v.mrp}</div>
                                      </div>
                                    </div>
                                  ))}
                                  {(!product.variants || product.variants.length === 0) && (
                                    <div className="text-sm text-slate-500 text-center py-4">No variants configured.</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <p className="text-lg font-medium text-ink">No products found</p>
                    <p className="text-sm mt-1">Get started by creating a new product.</p>
                    <Link 
                      to="/products/new"
                      className="inline-flex mt-4 text-primary-blue hover:underline font-medium items-center gap-1"
                    >
                      <Plus size={16} /> Add Product
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
