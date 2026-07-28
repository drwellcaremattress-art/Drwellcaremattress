'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Save, Plus, Trash2, ChevronRight, Package, Tag, FileText,
  Image as ImageIcon, Search, AlertCircle, CheckCircle2, Loader2,
  LayoutGrid, DollarSign, List
} from 'lucide-react';
import { ProductType } from './AdminProductTable';

const CATEGORIES = ['orthopaedic', 'bonded', 'latex', 'memory-foam', 'pocket-spring', 'hybrid', 'budget'];
const TYPES = ['Orthopaedic', 'Bonded Series', 'Hybrid', 'Latex', 'Memory Foam', 'Pocket Spring', 'Budget Mattress', 'Luxury HR Series'];
const FIRMNESS_OPTIONS = ['Soft', 'Medium Soft', 'Medium', 'Medium Firm', 'Firm', 'Orthopaedic Firm'];
const STATUS_OPTIONS = ['active', 'draft'];

const TABS = [
  { id: 'basics', label: 'Basics', icon: Package },
  { id: 'variants', label: 'Pricing & Variants', icon: DollarSign },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'images', label: 'Images', icon: ImageIcon },
  { id: 'seo', label: 'SEO', icon: Search },
];

const emptyVariant = () => ({
  size: '',
  dimensions: '',
  thickness_cm: 15,
  price: 0,
  mrp: 0,
  sku: '',
  stock: 0,
});

const emptyProduct = (): Partial<ProductType> => ({
  name: '',
  slug: '',
  brand: 'Dr.Well Care',
  category: 'orthopaedic',
  description: '',
  benefits: [],
  images: [],
  variants: [emptyVariant()],
  firmness: 'Medium Firm',
  warranty_years: 10,
  trialNights: 100,
  ratingAvg: 0,
  ratingCount: 0,
  seo: { title: '', description: '', keywords: '' },
  status: 'draft',
});

interface Props {
  open: boolean;
  mode: 'add' | 'edit';
  product: ProductType | null;
  onClose: () => void;
  onSaved: (product: ProductType) => void;
}

export default function AdminProductFormDrawer({ open, mode, product, onClose, onSaved }: Props) {
  const [activeTab, setActiveTab] = useState('basics');
  const [formData, setFormData] = useState<any>(emptyProduct());
  const [benefitInput, setBenefitInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveTab('basics');
      setSlugManuallyEdited(false);
      setBenefitInput('');
      setImageInput('');
      if (mode === 'edit' && product) {
        setFormData({
          ...emptyProduct(),
          ...product,
          images: product.images || [],
          variants: product.variants && product.variants.length > 0 ? product.variants : [emptyVariant()],
          benefits: product.benefits || [],
          seo: product.seo || { title: '', description: '', keywords: '' },
        });
      } else {
        setFormData(emptyProduct());
      }
    }
  }, [open, mode, product]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNameChange = (value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      name: value,
      slug: !slugManuallyEdited
        ? value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : prev.slug,
    }));
  };

  const handleSeoChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, seo: { ...prev.seo, [field]: value } }));
  };

  const addBenefit = () => {
    if (!benefitInput.trim()) return;
    setFormData((prev: any) => ({ ...prev, benefits: [...(prev.benefits || []), benefitInput.trim()] }));
    setBenefitInput('');
  };

  const removeBenefit = (idx: number) => {
    setFormData((prev: any) => ({ ...prev, benefits: prev.benefits.filter((_: any, i: number) => i !== idx) }));
  };

  const addImage = () => {
    if (!imageInput.trim()) return;
    const newImg = { url: imageInput.trim(), alt: formData.name || 'Product image', position: formData.images?.length || 0 };
    setFormData((prev: any) => ({ ...prev, images: [...(prev.images || []), newImg] }));
    setImageInput('');
  };

  const removeImage = (idx: number) => {
    setFormData((prev: any) => ({ ...prev, images: prev.images.filter((_: any, i: number) => i !== idx) }));
  };

  const addVariant = () => {
    setFormData((prev: any) => ({ ...prev, variants: [...(prev.variants || []), emptyVariant()] }));
  };

  const removeVariant = (idx: number) => {
    setFormData((prev: any) => ({
      ...prev,
      variants: prev.variants.filter((_: any, i: number) => i !== idx),
    }));
  };

  const updateVariant = (idx: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = [...prev.variants];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.firmness || !formData.description) {
      showToast('error', 'Name, category, firmness, and description are required.');
      setActiveTab('basics');
      return;
    }
    setSaving(true);
    try {
      const url = mode === 'edit' && product?._id
        ? `/api/products/${product._id}`
        : '/api/products';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Save failed');
      }

      const saved = await res.json();
      showToast('success', `Product "${saved.name}" ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
      setTimeout(() => {
        onSaved(saved);
        onClose();
      }, 1200);
    } catch (err: any) {
      showToast('error', err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0682E4]/30 focus:border-[#0682E4] transition-all placeholder:text-slate-400';
  const labelCls = 'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5';

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-3xl bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-[#0B1A2A] to-[#0f253d] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#0682E4]/20 rounded-xl flex items-center justify-center">
                  <Package size={18} className="text-[#7cb93e]" />
                </div>
                <div>
                  <h2 className="font-extrabold text-white text-base">
                    {mode === 'edit' ? `Edit: ${product?.name}` : 'Add New Product'}
                  </h2>
                  <p className="text-white/50 text-xs">{mode === 'edit' ? 'Update product details in MongoDB' : 'Create a new mattress in MongoDB'}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/50 hover:text-white transition-colors p-1">
                <X size={22} />
              </button>
            </div>

            {/* Tab Nav */}
            <div className="flex border-b border-slate-100 bg-white shrink-0 overflow-x-auto hide-scrollbar">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'border-[#0682E4] text-[#0682E4] bg-blue-50/50'
                        : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* ── TAB: BASICS ── */}
              {activeTab === 'basics' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className={labelCls}>Product Name *</label>
                      <input className={inputCls} placeholder="e.g. Lax-o-Bond Premium" value={formData.name} onChange={e => handleNameChange(e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Slug (URL)</label>
                      <input
                        className={inputCls + ' font-mono text-xs'}
                        placeholder="e.g. lax-o-bond-premium"
                        value={formData.slug}
                        onChange={e => { setSlugManuallyEdited(true); handleChange('slug', e.target.value); }}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Brand</label>
                      <input className={inputCls} value={formData.brand} onChange={e => handleChange('brand', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Category *</label>
                      <select className={inputCls} value={formData.category} onChange={e => handleChange('category', e.target.value)}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Type</label>
                      <select className={inputCls} value={formData.type || ''} onChange={e => handleChange('type', e.target.value)}>
                        <option value="">-- Select --</option>
                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Firmness *</label>
                      <select className={inputCls} value={formData.firmness} onChange={e => handleChange('firmness', e.target.value)}>
                        {FIRMNESS_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Status</label>
                      <select className={inputCls} value={formData.status} onChange={e => handleChange('status', e.target.value)}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Warranty (Years)</label>
                      <input type="number" className={inputCls} value={formData.warranty_years} onChange={e => handleChange('warranty_years', Number(e.target.value))} min={0} max={25} />
                    </div>
                    <div>
                      <label className={labelCls}>Trial Nights</label>
                      <input type="number" className={inputCls} value={formData.trialNights} onChange={e => handleChange('trialNights', Number(e.target.value))} min={0} />
                    </div>
                    <div>
                      <label className={labelCls}>Rating Avg</label>
                      <input type="number" className={inputCls} value={formData.ratingAvg} onChange={e => handleChange('ratingAvg', Number(e.target.value))} min={0} max={5} step={0.1} />
                    </div>
                    <div>
                      <label className={labelCls}>Rating Count</label>
                      <input type="number" className={inputCls} value={formData.ratingCount} onChange={e => handleChange('ratingCount', Number(e.target.value))} min={0} />
                    </div>
                    <div>
                      <label className={labelCls}>Thickness</label>
                      <input className={inputCls} placeholder="e.g. 6 Inch" value={formData.thickness || ''} onChange={e => handleChange('thickness', e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Sqft Price (₹)</label>
                      <input type="number" className={inputCls} value={formData.sqftPrice || ''} onChange={e => handleChange('sqftPrice', Number(e.target.value))} placeholder="e.g. 546" />
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Subtitle</label>
                      <input className={inputCls} placeholder="Short one-line description" value={formData.subtitle || ''} onChange={e => handleChange('subtitle', e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB: VARIANTS ── */}
              {activeTab === 'variants' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-800 text-sm">Size Variants</h3>
                    <button onClick={addVariant} className="flex items-center gap-1.5 px-3 py-2 bg-[#0682E4] text-white rounded-xl text-xs font-bold hover:bg-[#0682E4]/90 transition-colors">
                      <Plus size={13} /> Add Variant
                    </button>
                  </div>

                  {formData.variants?.map((v: any, idx: number) => (
                    <div key={idx} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-3 relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-[#0682E4] uppercase tracking-wider">Variant #{idx + 1}</span>
                        {formData.variants.length > 1 && (
                          <button onClick={() => removeVariant(idx)} className="text-red-400 hover:text-red-600 p-1">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Size Label</label>
                          <input className={inputCls} placeholder='e.g. Single (72" × 36")' value={v.size} onChange={e => updateVariant(idx, 'size', e.target.value)} />
                        </div>
                        <div>
                          <label className={labelCls}>Dimensions</label>
                          <input className={inputCls} placeholder='e.g. 72" × 36"' value={v.dimensions} onChange={e => updateVariant(idx, 'dimensions', e.target.value)} />
                        </div>
                        <div>
                          <label className={labelCls}>Price (₹)</label>
                          <input type="number" className={inputCls} value={v.price} onChange={e => updateVariant(idx, 'price', Number(e.target.value))} />
                        </div>
                        <div>
                          <label className={labelCls}>MRP (₹)</label>
                          <input type="number" className={inputCls} value={v.mrp} onChange={e => updateVariant(idx, 'mrp', Number(e.target.value))} />
                        </div>
                        <div>
                          <label className={labelCls}>Thickness (cm)</label>
                          <input type="number" className={inputCls} value={v.thickness_cm} onChange={e => updateVariant(idx, 'thickness_cm', Number(e.target.value))} />
                        </div>
                        <div>
                          <label className={labelCls}>Stock (units)</label>
                          <input type="number" className={inputCls} value={v.stock} onChange={e => updateVariant(idx, 'stock', Number(e.target.value))} />
                        </div>
                        <div className="col-span-2">
                          <label className={labelCls}>SKU</label>
                          <input className={`${inputCls} font-mono text-xs`} placeholder="e.g. LAXB-6-SINGLE" value={v.sku} onChange={e => updateVariant(idx, 'sku', e.target.value)} />
                        </div>
                        <div className="col-span-2 border-t border-slate-100 pt-3 mt-1">
                          <label className={labelCls}>Variant Specific Image (Optional)</label>
                          <p className="text-[10px] text-slate-400 mb-2">Upload a specific image for this size/thickness (e.g. showing 8" thickness)</p>
                          <div className="flex items-center gap-3">
                            {v.image && (
                              <div className="w-12 h-12 rounded bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={v.image} alt="Variant" className="max-w-full max-h-full object-cover" />
                              </div>
                            )}
                            <div className="w-48 shrink-0 relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const fd = new FormData();
                                  fd.append('file', file);
                                  
                                  setSaving(true);
                                  try {
                                    const res = await fetch('/api/upload', {
                                      method: 'POST',
                                      body: fd,
                                    });
                                    if (!res.ok) throw new Error('Upload failed');
                                    const data = await res.json();
                                    updateVariant(idx, 'image', data.url);
                                    showToast('success', 'Variant image uploaded!');
                                  } catch (err: any) {
                                    showToast('error', 'Failed to upload variant image.');
                                  } finally {
                                    setSaving(false);
                                    e.target.value = '';
                                  }
                                }}
                              />
                              <div className="w-full px-3 py-2 rounded-lg bg-blue-50 text-[#0682E4] border border-blue-100 text-[11px] font-bold text-center flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors">
                                <ImageIcon size={14} /> {v.image ? 'Change Image' : 'Upload Image'}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">OR</span>
                            <div className="flex-grow">
                               <input className={`${inputCls} py-2 text-[11px]`} placeholder="Paste URL directly" value={v.image || ''} onChange={e => updateVariant(idx, 'image', e.target.value)} />
                            </div>
                            {v.image && (
                              <button onClick={() => updateVariant(idx, 'image', '')} className="text-red-400 hover:text-red-600 p-1.5 shrink-0 transition-colors bg-red-50 rounded-lg">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB: CONTENT ── */}
              {activeTab === 'content' && (
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Description *</label>
                    <textarea
                      rows={5}
                      className={inputCls + ' resize-none'}
                      placeholder="Full product description..."
                      value={formData.description}
                      onChange={e => handleChange('description', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Key Benefits / Features</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        className={inputCls}
                        placeholder="e.g. Zero Motion Transfer"
                        value={benefitInput}
                        onChange={e => setBenefitInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addBenefit(); } }}
                      />
                      <button onClick={addBenefit} className="px-4 py-2 bg-[#7cb93e] text-white rounded-xl text-xs font-bold whitespace-nowrap hover:bg-[#5a8b2a] transition-colors">
                        + Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.benefits?.map((b: string, i: number) => (
                        <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700">
                          {b}
                          <button onClick={() => removeBenefit(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                      {(!formData.benefits || formData.benefits.length === 0) && (
                        <p className="text-xs text-slate-400 italic">No benefits added yet. Type above and press Enter or click Add.</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Mattress Layers Image */}
                  <div className="pt-4 border-t border-slate-100">
                    <label className={labelCls}>Mattress Layers Image (Optional)</label>
                    <p className="text-xs text-slate-400 mb-3">Upload a custom cross-section image for the "What's inside the mattress" section. Falls back to default if left empty.</p>
                    <div className="flex flex-col gap-4">
                      {/* Current layers image preview */}
                      {formData.layersImage && (
                        <div className="flex items-center gap-4 p-3 border border-slate-200 rounded-xl bg-slate-50/50">
                          <div className="w-20 h-20 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-2 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={formData.layersImage} alt="Layers" className="max-w-full max-h-full object-contain" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate mb-1">Current Layers Image</p>
                            <p className="text-[10px] text-slate-400 truncate">{formData.layersImage}</p>
                          </div>
                          <button onClick={() => handleChange('layersImage', '')} className="p-2 text-red-400 hover:text-red-600 bg-white border border-red-100 rounded-lg shadow-sm transition-colors shrink-0">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <div className="flex-grow">
                          <div className="relative">
                            <input 
                              type="file" 
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const fd = new FormData();
                                fd.append('file', file);
                                
                                setSaving(true);
                                try {
                                  const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: fd,
                                  });
                                  if (!res.ok) {
                                    const errData = await res.json();
                                    throw new Error(errData.message || 'Upload failed');
                                  }
                                  const data = await res.json();
                                  
                                  handleChange('layersImage', data.url);
                                  showToast('success', 'Layers image uploaded successfully!');
                                } catch (err: any) {
                                  showToast('error', err.message || 'Failed to upload layers image.');
                                } finally {
                                  setSaving(false);
                                  e.target.value = '';
                                }
                              }}
                            />
                            <div className="w-full px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold text-center flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors">
                              <ImageIcon size={14} /> Upload Custom Layers Image
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase shrink-0">OR</span>
                        <div className="flex-grow">
                          <input
                            className={inputCls}
                            placeholder="Paste URL (e.g. /images/layers.png)"
                            value={formData.layersImage || ''}
                            onChange={e => handleChange('layersImage', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── TAB: IMAGES ── */}
              {activeTab === 'images' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Add Image</label>
                    <div className="flex flex-col gap-4">
                      {/* File Upload Option */}
                      <div className="flex items-center gap-4 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                        <div className="flex-grow">
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Upload from Computer</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="block w-full text-sm text-slate-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-xl file:border-0
                              file:text-xs file:font-bold
                              file:bg-[#0682E4]/10 file:text-[#0682E4]
                              hover:file:bg-[#0682E4]/20
                              cursor-pointer"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('file', file);
                              const fd = new FormData();
                              fd.append('file', file);
                              
                              setSaving(true);
                              try {
                                const res = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: fd,
                                });
                                if (!res.ok) {
                                  const errData = await res.json();
                                  throw new Error(errData.message || 'Upload failed');
                                }
                                const data = await res.json();
                                
                                const newImg = { url: data.url, alt: formData.name || 'Product image', position: formData.images?.length || 0 };
                                setFormData((prev: any) => ({ ...prev, images: [...(prev.images || []), newImg] }));
                                showToast('success', 'Image uploaded successfully!');
                              } catch (err: any) {
                                showToast('error', err.message || 'Failed to upload image.');
                              } finally {
                                setSaving(false);
                                e.target.value = ''; // Reset input
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="h-px bg-slate-200 flex-grow"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase">OR</span>
                        <div className="h-px bg-slate-200 flex-grow"></div>
                      </div>

                      {/* URL Option */}
                      <div className="flex gap-2">
                        <input
                          className={inputCls}
                          placeholder="Paste image URL (e.g. /images/products/my-mattress.jpeg)"
                          value={imageInput}
                          onChange={e => setImageInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                        />
                        <button onClick={addImage} className="px-4 py-2 bg-[#0682E4] text-white rounded-xl text-xs font-bold whitespace-nowrap hover:bg-[#0682E4]/90 transition-colors">
                          + Add URL
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    {formData.images?.length === 0 && (
                      <div className="py-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
                        <ImageIcon size={28} className="mx-auto mb-2 opacity-30" />
                        <p className="text-xs">No images added. Upload a file or add a URL above.</p>
                      </div>
                    )}
                    {formData.images?.map((img: any, idx: number) => (
                      <div key={idx} className={`flex items-center gap-3 p-3 border rounded-xl transition-all ${idx === 0 ? 'bg-blue-50/50 border-[#0682E4]/30 shadow-[0_0_15px_-3px_rgba(6,130,228,0.1)]' : 'bg-slate-50/60 border-slate-200'}`}>
                        <div className="w-16 h-14 bg-white border border-slate-200 rounded-lg overflow-hidden shrink-0 relative">
                          {idx === 0 && (
                            <div className="absolute inset-x-0 bottom-0 bg-[#0682E4] text-white text-[8px] font-bold text-center py-0.5 uppercase tracking-wider">
                              Primary
                            </div>
                          )}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.url} alt={img.alt} className="w-full h-full object-cover" onError={(e: any) => { e.target.src = '/images/placeholder.png'; }} />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-xs font-semibold text-slate-700 truncate">{img.url}</p>
                          <input
                            className="text-xs text-slate-400 bg-transparent border-none outline-none w-full mt-0.5"
                            placeholder="Alt text..."
                            value={img.alt || ''}
                            onChange={e => {
                              const imgs = [...formData.images];
                              imgs[idx] = { ...imgs[idx], alt: e.target.value };
                              handleChange('images', imgs);
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {idx !== 0 && (
                            <button
                              onClick={() => {
                                const newImgs = [...formData.images];
                                const current = newImgs.splice(idx, 1)[0];
                                newImgs.unshift(current);
                                handleChange('images', newImgs);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-[#0682E4] hover:border-[#0682E4]/30 hover:bg-blue-50 transition-all mr-2"
                            >
                              Make Primary
                            </button>
                          )}
                          <button onClick={() => removeImage(idx)} className="text-red-400 hover:text-red-600 p-1 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB: SEO ── */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>SEO Title</label>
                    <input className={inputCls} placeholder="e.g. Buy Orthopaedic Mattress Online — Dr.Well Care" value={formData.seo?.title || ''} onChange={e => handleSeoChange('title', e.target.value)} />
                    <p className="text-xs text-slate-400 mt-1">Recommended: 50–60 characters. Current: {(formData.seo?.title || '').length}</p>
                  </div>
                  <div>
                    <label className={labelCls}>SEO Meta Description</label>
                    <textarea rows={3} className={inputCls + ' resize-none'} placeholder="Short compelling summary for search engines..." value={formData.seo?.description || ''} onChange={e => handleSeoChange('description', e.target.value)} />
                    <p className="text-xs text-slate-400 mt-1">Recommended: 140–160 characters. Current: {(formData.seo?.description || '').length}</p>
                  </div>
                  <div>
                    <label className={labelCls}>Keywords (comma-separated)</label>
                    <input className={inputCls} placeholder="orthopaedic mattress, back pain relief, Dr.Well Care" value={formData.seo?.keywords || ''} onChange={e => handleSeoChange('keywords', e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between gap-4 shrink-0">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <div className="flex items-center gap-3">
                {/* Tab navigation arrows */}
                <div className="flex gap-1.5">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`w-2 h-2 rounded-full transition-all ${activeTab === t.id ? 'bg-[#0682E4] w-4' : 'bg-slate-200 hover:bg-slate-300'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0682E4] hover:bg-[#0682E4]/90 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 30, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 30, x: '-50%' }}
                  className={`fixed bottom-6 left-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-bold ${
                    toast.type === 'success'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  {toast.message}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
