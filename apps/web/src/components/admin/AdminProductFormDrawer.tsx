'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Save, Plus, Trash2, Package, Tag, FileText,
  Image as ImageIcon, Search, AlertCircle, CheckCircle2, Loader2,
  DollarSign, RefreshCw, ChevronDown, ChevronUp, IndianRupee
} from 'lucide-react';
import { ProductType } from './AdminProductTable';

const CATEGORIES = ['orthopaedic', 'bonded', 'latex', 'memory-foam', 'pocket-spring', 'hybrid', 'budget'];
const TYPES = ['Orthopaedic', 'Bonded Series', 'Hybrid', 'Latex', 'Memory Foam', 'Budget Mattress', 'Luxury HR Series'];
const FIRMNESS_OPTIONS = ['Soft', 'Medium Soft', 'Medium', 'Medium Firm', 'Firm', 'Orthopaedic Firm', 'Plush'];
const STATUS_OPTIONS = ['active', 'draft'];

const TABS = [
  { id: 'basics', label: 'Basics', icon: Package },
  { id: 'variants', label: 'Pricing & Variants', icon: DollarSign },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'images', label: 'Images', icon: ImageIcon },
  { id: 'seo', label: 'SEO', icon: Search },
];

// ─── Exact same structure as ProductInfo.tsx on the website ─────────────────
const BASE_SIZES: Record<string, {
  label: string;
  color: string;
  bgLight: string;
  accent: string;
  defaultDim: string;   // The "standard" dimension shown on the size selector
  defaultSqft: number;  // sqft of that default dimension
  rows: { dim: string; sqft: number }[];
}> = {
  Single: {
    label: 'Single',
    color: '#055bc7',
    bgLight: '#eff6ff',
    accent: '#dbeafe',
    defaultDim: '72" × 36"',
    defaultSqft: 18,
    rows: [
      { dim: '72" × 30"', sqft: 15.00 },
      { dim: '75" × 30"', sqft: 15.63 },
      { dim: '72" × 36"', sqft: 18.00 },
      { dim: '75" × 36"', sqft: 18.75 },
      { dim: '78" × 36"', sqft: 19.50 },
    ],
  },
  Double: {
    label: 'Double',
    color: '#599c15',
    bgLight: '#f0fdf4',
    accent: '#dcfce7',
    defaultDim: '72" × 48"',
    defaultSqft: 24,
    rows: [
      { dim: '72" × 48"', sqft: 24.00 },
      { dim: '75" × 48"', sqft: 25.00 },
      { dim: '78" × 48"', sqft: 26.00 },
      { dim: '84" × 48"', sqft: 28.00 },
    ],
  },
  Queen: {
    label: 'Queen',
    color: '#782c7a',
    bgLight: '#fdf4ff',
    accent: '#f3e8ff',
    defaultDim: '72" × 60"',
    defaultSqft: 30,
    rows: [
      { dim: '72" × 60"', sqft: 30.00 },
      { dim: '75" × 60"', sqft: 31.25 },
      { dim: '78" × 60"', sqft: 32.50 },
      { dim: '84" × 60"', sqft: 35.00 },
    ],
  },
  King: {
    label: 'King',
    color: '#eb7407',
    bgLight: '#fff7ed',
    accent: '#ffedd5',
    defaultDim: '72" × 72"',
    defaultSqft: 36,
    rows: [
      { dim: '72" × 72"', sqft: 36.00 },
      { dim: '75" × 72"', sqft: 37.50 },
      { dim: '78" × 72"', sqft: 39.00 },
      { dim: '84" × 72"', sqft: 42.00 },
    ],
  },
};

const SIZE_KEYS = ['Single', 'Double', 'Queen', 'King'] as const;
type SizeKey = typeof SIZE_KEYS[number];

// Default variant per size category
const defaultVariantForSize = (sizeKey: SizeKey, sqftPrice: number, slugBase: string) => {
  const s = BASE_SIZES[sizeKey];
  const price = Math.round(s.defaultSqft * sqftPrice);
  const mrp = Math.round(price * 1.3);
  return {
    size: sizeKey,
    dimensions: s.defaultDim,
    price,
    mrp,
    sku: `${slugBase.toUpperCase()}-${sizeKey.toUpperCase()}-6IN`,
    stock: 20,
    image: '',
    subDimensions: s.rows.map(r => ({ dim: r.dim, sqft: r.sqft })),
  };
};

const emptyProduct = (): Partial<ProductType> => ({
  name: '',
  slug: '',
  brand: 'Dr.Well Care',
  category: 'orthopaedic',
  description: '',
  benefits: [],
  images: [],
  variants: SIZE_KEYS.map(k => defaultVariantForSize(k, 546, 'product')),
  firmness: 'Medium Firm',
  warranty_years: 10,
  trialNights: 100,
  sqftPrice: 546,
  thickness: '6 Inch',
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

// Sub-dimension editing state
type EditingDim = { sizeKey: SizeKey; rowIdx: number; dim: string; sqft: string };

export default function AdminProductFormDrawer({ open, mode, product, onClose, onSaved }: Props) {
  const [activeTab, setActiveTab] = useState('basics');
  const [formData, setFormData] = useState<any>(emptyProduct());
  const [benefitInput, setBenefitInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({ Single: true, Double: false, Queen: false, King: false });
  const [editingDim, setEditingDim] = useState<EditingDim | null>(null);
  const [addingDimForSize, setAddingDimForSize] = useState<SizeKey | null>(null);
  const [newDimForm, setNewDimForm] = useState({ dim: '', sqft: '' });

  useEffect(() => {
    if (open) {
      setActiveTab('basics');
      setSlugManuallyEdited(false);
      setBenefitInput('');
      setImageInput('');
      setExpandedCards({ Single: true, Double: false, Queen: false, King: false });
      setEditingDim(null);
      setAddingDimForSize(null);
      setNewDimForm({ dim: '', sqft: '' });

      if (mode === 'edit' && product) {
        // Build 4 canonical size variants, merging existing DB data
        const existing = product.variants || [];
        const mergedVariants = SIZE_KEYS.map(sizeKey => {
          const dbVar = existing.find((v: any) =>
            v.size?.toLowerCase() === sizeKey.toLowerCase() ||
            (sizeKey === 'Single' && (v.size === 'Single' || v.size === 'Single XL')) ||
            (sizeKey === 'Double' && (v.size === 'Double' || v.size === 'Diwan'))
          );
          const sqftP = Number(product.sqftPrice) || 546;
          const s = BASE_SIZES[sizeKey];
          const defaultPrice = Math.round(s.defaultSqft * sqftP);
          // Use DB subDimensions if they exist (and have rows), else fall back to BASE_SIZES
          const subDimensions =
            (dbVar as any)?.subDimensions?.length > 0
              ? (dbVar as any).subDimensions.map((d: any) => ({ dim: d.dim, sqft: Number(d.sqft) }))
              : s.rows.map((r: { dim: string; sqft: number }) => ({ dim: r.dim, sqft: r.sqft }));
          return {
            size: sizeKey,
            dimensions: dbVar?.dimensions || s.defaultDim,
            price: dbVar?.price || defaultPrice,
            mrp: dbVar?.mrp || Math.round(defaultPrice * 1.3),
            sku: dbVar?.sku || `${(product.slug || 'prod').toUpperCase()}-${sizeKey.toUpperCase()}-6IN`,
            stock: dbVar?.stock ?? 20,
            image: dbVar?.image || '',
            subDimensions,
          };
        });

        setFormData({
          ...emptyProduct(),
          ...product,
          images: product.images || [],
          variants: mergedVariants,
          benefits: product.benefits || [],
          seo: product.seo || { title: '', description: '', keywords: '' },
          sqftPrice: Number(product.sqftPrice) || 546,
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

  // ── Recalculate all variant prices from sqftPrice ──
  const recalcAllFromSqftPrice = (sqftP: number) => {
    setFormData((prev: any) => ({
      ...prev,
      sqftPrice: sqftP,
      variants: SIZE_KEYS.map(sizeKey => {
        const existing = (prev.variants || []).find((v: any) => v.size === sizeKey);
        const s = BASE_SIZES[sizeKey];
        const price = Math.round(s.defaultSqft * sqftP);
        const mrp = Math.round(price * 1.3);
        return {
          size: sizeKey,
          dimensions: existing?.dimensions || s.defaultDim,
          price,
          mrp,
          sku: existing?.sku || `${(prev.slug || 'prod').toUpperCase()}-${sizeKey.toUpperCase()}-6IN`,
          stock: existing?.stock ?? 20,
          image: existing?.image || '',
          subDimensions: existing?.subDimensions?.length > 0
            ? existing.subDimensions
            : s.rows.map((r: any) => ({ dim: r.dim, sqft: r.sqft })),
        };
      }),
    }));
    showToast('success', `Recalculated all 4 size prices from ₹${sqftP}/sq.ft`);
  };

  // ── Sub-dimension CRUD helpers ──

  // Parse "80\"×38\"" / "80"*38" / "80x38" → sqft = (L×W)/144
  const parseSqft = (dim: string): number | null => {
    const cleaned = dim.replace(/"/g, '').replace(/\s+/g, '');
    const match = cleaned.match(/^([\d.]+)[×xX*]([\d.]+)$/);
    if (!match) return null;
    const l = parseFloat(match[1]);
    const w = parseFloat(match[2]);
    if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) return null;
    return parseFloat(((l * w) / 144).toFixed(2));
  };

  const getSubDims = (sizeKey: SizeKey): { dim: string; sqft: number }[] => {
    const v = (formData.variants || []).find((v: any) => v.size === sizeKey);
    return v?.subDimensions || BASE_SIZES[sizeKey].rows.map(r => ({ dim: r.dim, sqft: r.sqft }));
  };

  const setSubDims = (sizeKey: SizeKey, dims: { dim: string; sqft: number }[]) => {
    setFormData((prev: any) => {
      const existing = (prev.variants || []).find((v: any) => v.size === sizeKey);
      if (existing) {
        return {
          ...prev,
          variants: prev.variants.map((v: any) =>
            v.size !== sizeKey ? v : { ...v, subDimensions: dims }
          ),
        };
      } else {
        return {
          ...prev,
          variants: [...(prev.variants || []), { size: sizeKey, subDimensions: dims }],
        };
      }
    });
  };

  const addSubDim = (sizeKey: SizeKey) => {
    const dim = newDimForm.dim.trim();
    const sqft = parseFloat(newDimForm.sqft);
    if (!dim || isNaN(sqft) || sqft <= 0) {
      showToast('error', 'Enter a valid dimension and sqft value.');
      return;
    }
    const current = getSubDims(sizeKey);
    setSubDims(sizeKey, [...current, { dim, sqft }]);
    setAddingDimForSize(null);
    setNewDimForm({ dim: '', sqft: '' });
  };

  const removeSubDim = (sizeKey: SizeKey, rowIdx: number) => {
    const current = getSubDims(sizeKey);
    if (current.length <= 1) {
      showToast('error', 'Each size must have at least one dimension.');
      return;
    }
    setSubDims(sizeKey, current.filter((_, i) => i !== rowIdx));
  };

  const startEditSubDim = (sizeKey: SizeKey, rowIdx: number) => {
    const row = getSubDims(sizeKey)[rowIdx];
    setEditingDim({ sizeKey, rowIdx, dim: row.dim, sqft: String(row.sqft) });
  };

  const commitSubDimEdit = () => {
    if (!editingDim) return;
    const dim = editingDim.dim.trim();
    const sqft = parseFloat(editingDim.sqft);
    if (!dim || isNaN(sqft) || sqft <= 0) {
      showToast('error', 'Enter a valid dimension and sqft value.');
      return;
    }
    const current = getSubDims(editingDim.sizeKey);
    const updated = current.map((r, i) =>
      i === editingDim.rowIdx ? { dim, sqft } : r
    );
    setSubDims(editingDim.sizeKey, updated);
    setEditingDim(null);
  };

  // ── Update a single variant field ──
  const updateVariant = (sizeKey: SizeKey, field: string, value: any) => {
    setFormData((prev: any) => {
      const existing = (prev.variants || []).find((v: any) => v.size === sizeKey);
      
      let val = value;
      if (field === 'price' || field === 'mrp' || field === 'stock') {
        val = value === '' ? '' : Number(value);
      }

      if (existing) {
        return {
          ...prev,
          variants: prev.variants.map((v: any) => {
            if (v.size !== sizeKey) return v;
            const updated = { ...v, [field]: val };
            if (field === 'price' && typeof val === 'number' && val > 0 && (!v.mrp || v.mrp === 0)) {
              updated.mrp = Math.round(val * 1.3);
            }
            return updated;
          }),
        };
      } else {
        const newVariant: any = { size: sizeKey, [field]: val };
        if (field === 'price' && typeof val === 'number' && val > 0) {
          newVariant.mrp = Math.round(val * 1.3);
        }
        return {
          ...prev,
          variants: [...(prev.variants || []), newVariant],
        };
      }
    });
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

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.firmness || !formData.description) {
      showToast('error', 'Name, category, firmness, and description are required.');
      setActiveTab('basics');
      return;
    }
    setSaving(true);

    const sqftP = Number(formData.sqftPrice) || 546;
    const slugBase = (formData.slug || formData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const sanitizedVariants = SIZE_KEYS.map(sizeKey => {
      const v = (formData.variants || []).find((v: any) => v.size === sizeKey) || {};
      const s = BASE_SIZES[sizeKey];
      const price = Number(v.price) > 0 ? Number(v.price) : Math.round(s.defaultSqft * sqftP);
      const mrp = Number(v.mrp) > 0 ? Number(v.mrp) : Math.round(price * 1.3);
      const subDimensions = v.subDimensions?.length > 0
        ? v.subDimensions.map((d: any) => ({ dim: d.dim, sqft: Number(d.sqft) }))
        : s.rows.map(r => ({ dim: r.dim, sqft: r.sqft }));
      return {
        size: sizeKey,
        dimensions: v.dimensions || s.defaultDim,
        thickness_cm: 15,
        price,
        mrp,
        sku: v.sku || `${slugBase.toUpperCase()}-${sizeKey.toUpperCase()}-6IN`,
        stock: Number(v.stock) || 0,
        image: v.image || '',
        subDimensions,
      };
    });

    const singleVariant = sanitizedVariants.find(v => v.size === 'Single');
    const lowestPrice = singleVariant?.price || sanitizedVariants[0]?.price || 0;

    const payload = {
      ...formData,
      variants: sanitizedVariants,
      sqftPrice: sqftP,
      priceValue: lowestPrice,
      price: lowestPrice,
      originalPrice: Number(formData.originalPrice) || Math.round(lowestPrice * 1.3),
      warranty_years: Number(formData.warranty_years) || 10,
      trialNights: Number(formData.trialNights) || 100,
      ratingAvg: Number(formData.ratingAvg) || 4.9,
      ratingCount: Number(formData.ratingCount) || 0,
    };

    try {
      const url = mode === 'edit' && product?._id ? `/api/products/${product._id}` : '/api/products';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Save failed');
      }
      const saved = await res.json();
      showToast('success', `Product "${saved.name}" ${mode === 'edit' ? 'updated' : 'created'} successfully!`);
      setTimeout(() => { onSaved(saved); onClose(); }, 1200);
    } catch (err: any) {
      showToast('error', err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0682E4]/30 focus:border-[#0682E4] transition-all placeholder:text-slate-400';
  const labelCls = 'block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5';

  // ── Live price computation ──
  const sqftP = Number(formData.sqftPrice) || 0;

  const getVariant = (sizeKey: SizeKey) =>
    (formData.variants || []).find((v: any) => v.size === sizeKey) || {};

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
                      <input
                        type="number"
                        className={inputCls}
                        value={!formData.warranty_years ? '' : formData.warranty_years}
                        onChange={e => handleChange('warranty_years', e.target.value === '' ? '' : Number(e.target.value))}
                        min={0} max={25}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Trial Nights</label>
                      <input
                        type="number"
                        className={inputCls}
                        value={!formData.trialNights ? '' : formData.trialNights}
                        onChange={e => handleChange('trialNights', e.target.value === '' ? '' : Number(e.target.value))}
                        min={0}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Rating Avg</label>
                      <input
                        type="number"
                        className={inputCls}
                        value={!formData.ratingAvg ? '' : formData.ratingAvg}
                        onChange={e => handleChange('ratingAvg', e.target.value === '' ? '' : Number(e.target.value))}
                        min={0} max={5} step={0.1}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Rating Count</label>
                      <input
                        type="number"
                        className={inputCls}
                        value={!formData.ratingCount ? '' : formData.ratingCount}
                        onChange={e => handleChange('ratingCount', e.target.value === '' ? '' : Number(e.target.value))}
                        min={0}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Thickness</label>
                      <input className={inputCls} placeholder="e.g. 6 Inch" value={formData.thickness || ''} onChange={e => handleChange('thickness', e.target.value)} />
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
                <div className="space-y-6">

                  {/* ── MASTER: sqftPrice Control ── */}
                  <div className="bg-gradient-to-br from-[#0B1A2A] to-[#0f253d] rounded-2xl p-5 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <IndianRupee size={16} className="text-[#7cb93e]" />
                      <h3 className="font-extrabold text-sm uppercase tracking-wider">Base Rate (₹/sq.ft)</h3>
                    </div>
                    <p className="text-white/50 text-xs mb-4">
                      This is the master price rate. All sub-dimension prices are auto-calculated from this value on the product page.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">₹</span>
                        <input
                          type="number"
                          className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-black text-xl placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#7cb93e]/50 focus:border-[#7cb93e]/50 transition-all"
                          placeholder="e.g. 528"
                          value={formData.sqftPrice === 0 || formData.sqftPrice === '' || formData.sqftPrice === null ? '' : formData.sqftPrice}
                          onChange={e => handleChange('sqftPrice', e.target.value === '' ? '' : Number(e.target.value))}
                        />
                      </div>
                      <button
                        onClick={() => sqftP > 0 && recalcAllFromSqftPrice(sqftP)}
                        disabled={!sqftP}
                        className="flex items-center gap-2 px-4 py-3 bg-[#7cb93e] hover:bg-[#5a8b2a] text-white rounded-xl font-extrabold text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-900/30 whitespace-nowrap"
                      >
                        <RefreshCw size={14} />
                        Recalculate All
                      </button>
                    </div>

                    {/* Quick live summary bar */}
                    {sqftP > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {SIZE_KEYS.map(sizeKey => {
                          const s = BASE_SIZES[sizeKey];
                          const price = Math.round(s.defaultSqft * sqftP);
                          return (
                            <div key={sizeKey} className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-lg px-2.5 py-1.5">
                              <span className="text-[10px] font-bold text-white/60 uppercase">{sizeKey}</span>
                              <span className="text-xs font-black text-[#7cb93e]">₹{price.toLocaleString('en-IN')}</span>
                              <span className="text-[9px] text-white/40">from</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* ── LIVE PRICE PREVIEW TABLE (mirrors website popup) ── */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Live Price Preview</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">This is exactly what customers see in the size-selection popup on the product page</p>
                      </div>
                      {sqftP > 0 && (
                        <span className="text-xs font-bold text-[#0682E4] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                          @ ₹{sqftP}/sq.ft
                        </span>
                      )}
                    </div>

                    {sqftP <= 0 ? (
                      <div className="py-8 text-center text-slate-400">
                        <IndianRupee size={28} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-semibold">Enter a sqft price above to see live prices</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {SIZE_KEYS.map(sizeKey => {
                          const s = BASE_SIZES[sizeKey];
                          return (
                            <div key={sizeKey} className="p-0">
                              {/* Category Header */}
                              <div
                                className="flex items-center gap-3 px-4 py-2.5"
                                style={{ backgroundColor: s.accent }}
                              >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                                <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: s.color }}>
                                  {s.label} Mattress
                                </span>
                              </div>
                              {/* Sub-dimension rows */}
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-slate-100 bg-slate-50/60">
                                    <th className="text-left px-4 py-2 font-bold text-slate-500 w-1/3">Dimensions (L × W)</th>
                                    <th className="text-left px-4 py-2 font-bold text-slate-500 w-1/3">Surface Area</th>
                                    <th className="text-right px-4 py-2 font-bold text-slate-500 w-1/3">Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {s.rows.map((row, rIdx) => {
                                    const price = Math.round(row.sqft * sqftP);
                                    const isDefault = row.dim === s.defaultDim;
                                    return (
                                      <tr
                                        key={rIdx}
                                        className={`border-b border-slate-50 transition-colors ${isDefault ? 'bg-blue-50/40' : 'hover:bg-slate-50'}`}
                                      >
                                        <td className="px-4 py-2.5 font-semibold text-slate-700">
                                          {row.dim}
                                          {isDefault && (
                                            <span className="ml-2 text-[9px] font-bold bg-[#0682E4]/10 text-[#0682E4] px-1.5 py-0.5 rounded uppercase">default</span>
                                          )}
                                        </td>
                                        <td className="px-4 py-2.5 text-slate-500">{row.sqft.toFixed(2)} sq.ft</td>
                                        <td className="px-4 py-2.5 text-right font-black" style={{ color: s.color }}>
                                          ₹{price.toLocaleString('en-IN')}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* ── PER-CATEGORY VARIANT CARDS (Stock, SKU, MRP, Image) ── */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm">Size Category Details</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Set stock, SKU, MRP and optional image per size</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {SIZE_KEYS.map(sizeKey => {
                        const s = BASE_SIZES[sizeKey];
                        const v = getVariant(sizeKey);
                        const isExpanded = expandedCards[sizeKey];
                        const displayPrice = sqftP > 0 ? Math.round(s.defaultSqft * sqftP) : (Number(v.price) || 0);
                        const displayMrp = Number(v.mrp) || Math.round(displayPrice * 1.3);

                        return (
                          <div
                            key={sizeKey}
                            className="border-2 rounded-2xl overflow-hidden transition-all"
                            style={{ borderColor: isExpanded ? s.color : '#e2e8f0' }}
                          >
                            {/* Card Header */}
                            <button
                              type="button"
                              onClick={() => setExpandedCards(prev => ({ ...prev, [sizeKey]: !prev[sizeKey] }))}
                              className="w-full flex items-center justify-between px-4 py-3.5 transition-colors"
                              style={{ backgroundColor: isExpanded ? s.bgLight : '#f8fafc' }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-xs" style={{ backgroundColor: s.color }}>
                                  {sizeKey[0]}
                                </div>
                                <div className="text-left">
                                  <div className="font-extrabold text-slate-800 text-sm">{sizeKey} Mattress</div>
                                  <div className="text-[11px] text-slate-500">{s.defaultDim} · {s.defaultSqft} sq.ft</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {displayPrice > 0 && (
                                  <div className="text-right">
                                    <div className="font-black text-sm" style={{ color: s.color }}>₹{displayPrice.toLocaleString('en-IN')}</div>
                                    <div className="text-[10px] text-slate-400 line-through">₹{displayMrp.toLocaleString('en-IN')}</div>
                                  </div>
                                )}
                                {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                              </div>
                            </button>

                            {/* Card Body */}
                            {isExpanded && (
                              <div className="px-4 pb-4 pt-3 bg-white space-y-3 border-t border-slate-100">

                                {/* Dimensions field — full width, at top */}
                                <div>
                                  <label className={labelCls}>Default Dimension (L × W)</label>
                                  <div className="flex gap-2">
                                    <select
                                      className={inputCls}
                                      value={s.rows.some(r => r.dim === (v.dimensions || s.defaultDim)) ? (v.dimensions || s.defaultDim) : '__custom__'}
                                      onChange={e => {
                                        if (e.target.value === '__custom__') return;
                                        const chosen = s.rows.find(r => r.dim === e.target.value);
                                        updateVariant(sizeKey, 'dimensions', e.target.value);
                                        if (chosen && sqftP > 0) {
                                          updateVariant(sizeKey, 'price', Math.round(chosen.sqft * sqftP));
                                        }
                                      }}
                                    >
                                      {s.rows.map(r => (
                                        <option key={r.dim} value={r.dim}>
                                          {r.dim}  ({r.sqft} sq.ft){r.dim === s.defaultDim ? ' — standard' : ''}
                                        </option>
                                      ))}
                                      {!s.rows.some(r => r.dim === (v.dimensions || s.defaultDim)) && (
                                        <option value="__custom__">{v.dimensions} (custom)</option>
                                      )}
                                    </select>
                                    <input
                                      className={`${inputCls} max-w-[160px] font-mono text-xs`}
                                      placeholder={`e.g. ${s.defaultDim}`}
                                      value={v.dimensions || s.defaultDim}
                                      onChange={e => updateVariant(sizeKey, 'dimensions', e.target.value)}
                                    />
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-1">
                                    Select a standard option (auto-updates price) or type a custom dimension in the right box.
                                  </p>
                                </div>

                                {/* ── Sub-Dimensions CRUD Table ── */}
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                  <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 border-b border-slate-200">
                                    <div>
                                      <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">Popup Size Options</span>
                                      <span className="ml-2 text-[10px] text-slate-400">— what customers see when they click this size</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setAddingDimForSize(sizeKey);
                                        setEditingDim(null);
                                        setNewDimForm({ dim: '', sqft: '' });
                                      }}
                                      className="flex items-center gap-1 px-2.5 py-1 bg-[#0682E4] text-white rounded-lg text-[11px] font-bold hover:bg-[#0682E4]/90 transition-colors"
                                    >
                                      <Plus size={11} />
                                      Add
                                    </button>
                                  </div>

                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="bg-slate-50/60 border-b border-slate-100">
                                        <th className="text-left px-3 py-2 font-bold text-slate-500 w-[40%]">Dimensions (L × W)</th>
                                        <th className="text-left px-3 py-2 font-bold text-slate-500 w-[22%]">Sq.ft</th>
                                        <th className="text-right px-3 py-2 font-bold text-slate-500 w-[25%]">Price</th>
                                        <th className="w-[13%]" />
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {getSubDims(sizeKey).map((row, rIdx) => {
                                        const isEditingThis = editingDim?.sizeKey === sizeKey && editingDim?.rowIdx === rIdx;
                                        const rowPrice = sqftP > 0 ? Math.round(row.sqft * sqftP) : 0;
                                        return (
                                          <tr key={rIdx} className={`border-b border-slate-50 ${isEditingThis ? 'bg-blue-50/60' : 'hover:bg-slate-50'} transition-colors`}>
                                            {isEditingThis ? (
                                              <>
                                                <td className="px-2 py-1.5">
                                                  <input
                                                    autoFocus
                                                    className="w-full px-2 py-1 rounded-lg border border-[#0682E4] text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#0682E4]/40"
                                                    value={editingDim.dim}
                                                    placeholder='e.g. 75" × 36"'
                                                    onChange={e => {
                                                      const newDim = e.target.value;
                                                      const auto = parseSqft(newDim);
                                                      setEditingDim(prev => prev ? {
                                                        ...prev,
                                                        dim: newDim,
                                                        ...(auto !== null ? { sqft: String(auto) } : {}),
                                                      } : null);
                                                    }}
                                                    onKeyDown={e => { if (e.key === 'Enter') commitSubDimEdit(); if (e.key === 'Escape') setEditingDim(null); }}
                                                  />
                                                </td>
                                                <td className="px-2 py-1.5">
                                                  <input
                                                    type="number"
                                                    className="w-full px-2 py-1 rounded-lg border border-[#0682E4] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0682E4]/40"
                                                    value={editingDim.sqft}
                                                    placeholder="e.g. 18.75"
                                                    step="0.01"
                                                    onChange={e => setEditingDim(prev => prev ? { ...prev, sqft: e.target.value } : null)}
                                                    onKeyDown={e => { if (e.key === 'Enter') commitSubDimEdit(); if (e.key === 'Escape') setEditingDim(null); }}
                                                  />
                                                </td>
                                                <td className="px-2 py-1.5 text-right text-[10px] text-slate-400">
                                                  {sqftP > 0 && editingDim.sqft ? `₹${Math.round(parseFloat(editingDim.sqft || '0') * sqftP).toLocaleString('en-IN')}` : '—'}
                                                </td>
                                                <td className="px-2 py-1.5">
                                                  <div className="flex items-center gap-1 justify-end">
                                                    <button type="button" onClick={commitSubDimEdit} className="p-1 rounded bg-[#0682E4] text-white hover:bg-[#0682E4]/90 transition-colors" title="Save">
                                                      <CheckCircle2 size={12} />
                                                    </button>
                                                    <button type="button" onClick={() => setEditingDim(null)} className="p-1 rounded bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors" title="Cancel">
                                                      <X size={12} />
                                                    </button>
                                                  </div>
                                                </td>
                                              </>
                                            ) : (
                                              <>
                                                <td className="px-3 py-2.5 font-semibold text-slate-700 font-mono">{row.dim}</td>
                                                <td className="px-3 py-2.5 text-slate-500">{row.sqft} sq.ft</td>
                                                <td className="px-3 py-2.5 text-right font-black" style={{ color: s.color }}>
                                                  {rowPrice > 0 ? `₹${rowPrice.toLocaleString('en-IN')}` : '—'}
                                                </td>
                                                <td className="px-2 py-2.5">
                                                  <div className="flex items-center gap-1 justify-end">
                                                    <button
                                                      type="button"
                                                      onClick={() => startEditSubDim(sizeKey, rIdx)}
                                                      className="p-1 rounded text-slate-400 hover:text-[#0682E4] hover:bg-blue-50 transition-colors"
                                                      title="Edit"
                                                    >
                                                      <Tag size={12} />
                                                    </button>
                                                    <button
                                                      type="button"
                                                      onClick={() => removeSubDim(sizeKey, rIdx)}
                                                      className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                      title="Delete"
                                                    >
                                                      <Trash2 size={12} />
                                                    </button>
                                                  </div>
                                                </td>
                                              </>
                                            )}
                                          </tr>
                                        );
                                      })}

                                      {/* Add new dimension row */}
                                      {addingDimForSize === sizeKey && (
                                        <tr className="bg-green-50/50 border-b border-slate-100">
                                          <td className="px-2 py-1.5">
                                            <input
                                              autoFocus
                                              className="w-full px-2 py-1 rounded-lg border border-[#7cb93e] text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-[#7cb93e]/40"
                                              value={newDimForm.dim}
                                              placeholder='e.g. 80" × 36"'
                                              onChange={e => {
                                                const newDim = e.target.value;
                                                const auto = parseSqft(newDim);
                                                setNewDimForm(p => ({
                                                  ...p,
                                                  dim: newDim,
                                                  ...(auto !== null ? { sqft: String(auto) } : {}),
                                                }));
                                              }}
                                              onKeyDown={e => { if (e.key === 'Enter') addSubDim(sizeKey); if (e.key === 'Escape') setAddingDimForSize(null); }}
                                            />
                                          </td>
                                          <td className="px-2 py-1.5">
                                            <input
                                              type="number"
                                              step="0.01"
                                              className="w-full px-2 py-1 rounded-lg border border-[#7cb93e] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#7cb93e]/40"
                                              value={newDimForm.sqft}
                                              placeholder="e.g. 20"
                                              onChange={e => setNewDimForm(p => ({ ...p, sqft: e.target.value }))}
                                              onKeyDown={e => { if (e.key === 'Enter') addSubDim(sizeKey); if (e.key === 'Escape') setAddingDimForSize(null); }}
                                            />
                                          </td>
                                          <td className="px-2 py-1.5 text-right text-[10px] text-slate-400">
                                            {sqftP > 0 && newDimForm.sqft ? `₹${Math.round(parseFloat(newDimForm.sqft || '0') * sqftP).toLocaleString('en-IN')}` : '—'}
                                          </td>
                                          <td className="px-2 py-1.5">
                                            <div className="flex items-center gap-1 justify-end">
                                              <button type="button" onClick={() => addSubDim(sizeKey)} className="p-1 rounded bg-[#7cb93e] text-white hover:bg-[#5a8b2a] transition-colors" title="Add">
                                                <CheckCircle2 size={12} />
                                              </button>
                                              <button type="button" onClick={() => setAddingDimForSize(null)} className="p-1 rounded bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors" title="Cancel">
                                                <X size={12} />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className={labelCls}>Price (₹)</label>
                                    <input
                                      type="number"
                                      className={inputCls}
                                      placeholder={`e.g. ${Math.round(s.defaultSqft * 528)}`}
                                      value={v.price === 0 || v.price === '' || v.price === null || v.price === undefined ? '' : v.price}
                                      onChange={e => updateVariant(sizeKey, 'price', e.target.value === '' ? '' : Number(e.target.value))}
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Auto-set when you pick a dimension above. Override if needed.</p>
                                  </div>
                                  <div>
                                    <label className={labelCls}>MRP (₹) — shown as strikethrough</label>
                                    <input
                                      type="number"
                                      className={inputCls}
                                      placeholder={`e.g. ${Math.round(Math.round(s.defaultSqft * 528) * 1.3)}`}
                                      value={v.mrp === 0 || v.mrp === '' || v.mrp === null || v.mrp === undefined ? '' : v.mrp}
                                      onChange={e => updateVariant(sizeKey, 'mrp', e.target.value === '' ? '' : Number(e.target.value))}
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Default: price × 1.3</p>
                                  </div>
                                  <div>
                                    <label className={labelCls}>Stock (units)</label>
                                    <input
                                      type="number"
                                      className={inputCls}
                                      placeholder="20"
                                      value={v.stock === 0 || v.stock === '' || v.stock === null || v.stock === undefined ? '' : v.stock}
                                      onChange={e => updateVariant(sizeKey, 'stock', e.target.value === '' ? '' : Number(e.target.value))}
                                    />
                                  </div>
                                  <div>
                                    <label className={labelCls}>SKU</label>
                                    <input
                                      className={`${inputCls} font-mono text-xs`}
                                      placeholder={`e.g. PROD-${sizeKey.toUpperCase()}-6IN`}
                                      value={v.sku || ''}
                                      onChange={e => updateVariant(sizeKey, 'sku', e.target.value)}
                                    />
                                  </div>
                                </div>

                                {/* Image upload for this size */}
                                <div className="border-t border-slate-100 pt-3">
                                  <label className={labelCls}>Size Image (Optional)</label>
                                  <div className="flex items-center gap-3">
                                    {v.image && (
                                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={v.image} alt={sizeKey} className="max-w-full max-h-full object-cover" />
                                      </div>
                                    )}
                                    <div className="relative shrink-0">
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
                                            const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                            if (!res.ok) throw new Error('Upload failed');
                                            const data = await res.json();
                                            updateVariant(sizeKey, 'image', data.url);
                                            showToast('success', `${sizeKey} image uploaded!`);
                                          } catch {
                                            showToast('error', 'Failed to upload image.');
                                          } finally {
                                            setSaving(false);
                                            e.target.value = '';
                                          }
                                        }}
                                      />
                                      <div className="px-3 py-2 rounded-lg bg-blue-50 text-[#0682E4] border border-blue-100 text-[11px] font-bold flex items-center gap-1.5 hover:bg-blue-100 transition-colors">
                                        <ImageIcon size={13} /> {v.image ? 'Change' : 'Upload'}
                                      </div>
                                    </div>
                                    <div className="flex-grow">
                                      <input
                                        className={`${inputCls} py-2 text-[11px]`}
                                        placeholder="Or paste image URL"
                                        value={v.image || ''}
                                        onChange={e => updateVariant(sizeKey, 'image', e.target.value)}
                                      />
                                    </div>
                                    {v.image && (
                                      <button
                                        onClick={() => updateVariant(sizeKey, 'image', '')}
                                        className="text-red-400 hover:text-red-600 p-1.5 bg-red-50 rounded-lg transition-colors shrink-0"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
                    <p className="text-xs text-slate-400 mb-3">Upload a custom cross-section image for the "What's inside the mattress" section.</p>
                    <div className="flex flex-col gap-4">
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
                                  const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                  if (!res.ok) throw new Error('Upload failed');
                                  const data = await res.json();
                                  handleChange('layersImage', data.url);
                                  showToast('success', 'Layers image uploaded successfully!');
                                } catch {
                                  showToast('error', 'Failed to upload layers image.');
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
                      <div className="flex items-center gap-4 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                        <div className="flex-grow">
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Upload from Computer</label>
                          <input
                            type="file"
                            accept="image/*"
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0682E4]/10 file:text-[#0682E4] hover:file:bg-[#0682E4]/20 cursor-pointer"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const fd = new FormData();
                              fd.append('file', file);
                              setSaving(true);
                              try {
                                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                                if (!res.ok) throw new Error('Upload failed');
                                const data = await res.json();
                                const newImg = { url: data.url, alt: formData.name || 'Product image', position: formData.images?.length || 0 };
                                setFormData((prev: any) => ({ ...prev, images: [...(prev.images || []), newImg] }));
                                showToast('success', 'Image uploaded successfully!');
                              } catch {
                                showToast('error', 'Failed to upload image.');
                              } finally {
                                setSaving(false);
                                e.target.value = '';
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="h-px bg-slate-200 flex-grow" />
                        <span className="text-xs font-bold text-slate-400 uppercase">OR</span>
                        <div className="h-px bg-slate-200 flex-grow" />
                      </div>

                      <div className="flex gap-2">
                        <input
                          className={inputCls}
                          placeholder="Paste image URL"
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
                      <div key={idx} className={`flex items-center gap-3 p-3 border rounded-xl transition-all ${idx === 0 ? 'bg-blue-50/50 border-[#0682E4]/30' : 'bg-slate-50/60 border-slate-200'}`}>
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
                    toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
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
