"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Star, ShieldCheck, Truck, Check, ChevronDown, RotateCcw, X, BedDouble, Zap, Sparkles, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ProductInfoProps {
  product: any;
}

// ─── Base size dimensions & area per category ─────────────────────────────────
const BASE_SIZES: Record<string, {
  color: string;
  bgLight: string;
  rows: { dim: string; sqft: number }[];
}> = {
  Single: {
    color: '#055bc7',
    bgLight: '#eff6ff',
    rows: [
      { dim: '72" × 30"', sqft: 15.00 },
      { dim: '75" × 30"', sqft: 15.63 },
      { dim: '72" × 36"', sqft: 18.00 },
      { dim: '75" × 36"', sqft: 18.75 },
      { dim: '78" × 36"', sqft: 19.50 },
    ],
  },
  Double: {
    color: '#599c15',
    bgLight: '#f0fdf4',
    rows: [
      { dim: '72" × 48"', sqft: 24.00 },
      { dim: '75" × 48"', sqft: 25.00 },
      { dim: '78" × 48"', sqft: 26.00 },
      { dim: '84" × 48"', sqft: 28.00 },
    ],
  },
  Queen: {
    color: '#782c7a',
    bgLight: '#fdf4ff',
    rows: [
      { dim: '72" × 60"', sqft: 30.00 },
      { dim: '75" × 60"', sqft: 31.25 },
      { dim: '78" × 60"', sqft: 32.50 },
      { dim: '84" × 60"', sqft: 35.00 },
    ],
  },
  King: {
    color: '#eb7407',
    bgLight: '#fff7ed',
    rows: [
      { dim: '72" × 72"', sqft: 36.00 },
      { dim: '75" × 72"', sqft: 37.50 },
      { dim: '78" × 72"', sqft: 39.00 },
      { dim: '84" × 72"', sqft: 42.00 },
    ],
  },
};

const getDynamicSizeData = (rate: number) => {
  const result: Record<string, {
    color: string;
    bgLight: string;
    rows: { dim: string; sqft: number; price: number }[];
  }> = {};
  for (const [key, val] of Object.entries(BASE_SIZES)) {
    result[key] = {
      color: val.color,
      bgLight: val.bgLight,
      rows: val.rows.map(r => ({
        dim: r.dim,
        sqft: r.sqft,
        price: Math.round(r.sqft * rate),
      })),
    };
  }
  return result;
};

export function ProductInfo({ product }: ProductInfoProps) {
  const initialVariantIndex = product.thicknessVariants ? Math.max(0, product.thicknessVariants.findIndex((v: any) => v.slug === product.slug || v.thickness === product.thickness)) : 0;
  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(initialVariantIndex);
  const activeVariant = product.thicknessVariants && product.thicknessVariants.length > 0 ? product.thicknessVariants[activeVariantIndex] : null;

  // Determine exact price per sq.ft rate for this product or selected thickness variant
  const rate = (activeVariant ? activeVariant.sqftPrice : product.sqftPrice) || Math.round((typeof product.price === 'number' ? product.price : (product.priceValue || 9828)) / 18) || 546;
  const SIZE_DATA = getDynamicSizeData(rate);

  const [selectedSize, setSelectedSize] = useState('Single');
  const [selectedDim, setSelectedDim] = useState('72" × 36"'); // default 72"×36"
  const selectedThickness = activeVariant ? activeVariant.thickness : (product.thickness || '6 Inch');
  const [popupOpen, setPopupOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customL, setCustomL] = useState('');
  const [customW, setCustomW] = useState('');
  const { addItem, toggleCart } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (popupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [popupOpen]);

  const sizeData = SIZE_DATA[selectedSize] || SIZE_DATA['Single'];
  const selectedSubSize = sizeData.rows.find(r => r.dim === selectedDim) || sizeData.rows.find(r => r.dim === '72" × 36"') || sizeData.rows[0];

  // Derived price shown in the UI
  const basePriceVal = activeVariant ? activeVariant.priceValue : (typeof product.price === 'number' ? product.price : (product.priceValue || 9828));
  const displayPrice = selectedSubSize ? selectedSubSize.price : basePriceVal;
  const baseOriginalPrice = activeVariant ? activeVariant.originalPrice : (product.originalPrice || Math.round(displayPrice * 1.3));
  const discountRatio = baseOriginalPrice && displayPrice ? (baseOriginalPrice / (typeof product.price === 'number' ? product.price : (product.priceValue || displayPrice))) : 1.3;

  // Custom size price calculation
  const customSqft = customL && customW
    ? ((parseFloat(customL) * parseFloat(customW)) / 144).toFixed(2)
    : null;
  const customPrice = customSqft
    ? Math.round(parseFloat(customSqft) * rate)
    : null;
  const displayOriginalPrice = selectedSubSize ? Math.round(selectedSubSize.price * discountRatio) : baseOriginalPrice;
  const displayWarranty = activeVariant ? activeVariant.warranty : (product.warranty || 10);

  const handleAddToCart = () => {
    addItem({
      id: activeVariant ? activeVariant.slug : product.id.toString(),
      name: product.title,
      size: selectedSubSize ? `${selectedSize} (${selectedSubSize.dim}) - ${selectedThickness}` : `${selectedSize} - ${selectedThickness}`,
      price: displayPrice,
      image: activeVariant && activeVariant.image ? activeVariant.image : (product.images && product.images[0] ? product.images[0] : ''),
      qty: 1,
    });
    toggleCart();
  };

  const handleSizeClick = (sizeName: string) => {
    setSelectedSize(sizeName);
    // Auto-select first sub-size of new category
    if (SIZE_DATA[sizeName]?.rows?.[0]) {
      setSelectedDim(SIZE_DATA[sizeName].rows[0].dim);
    }
    setPopupOpen(true);
  };

  const handleSubSizeSelect = (row: { dim: string; sqft: number; price: number }) => {
    setSelectedDim(row.dim);
    setPopupOpen(false);
  };


  const sizes = [
    { name: 'Single', dim: '72" × 36"' },
    { name: 'Double', dim: '72" × 48"' },
    { name: 'Queen', dim: '72" × 60"' },
    { name: 'King', dim: '72" × 72"' },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">

        {/* Header Info & Badge */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#0B1A2A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">Best Seller</span>
                <div className="flex items-center gap-1 bg-[#f8f9fa] px-2.5 py-1 rounded-full border border-gray-100">
                  <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
                  <span className="text-xs font-bold text-[#0B1A2A]">{product.rating}</span>
                  <span className="text-xs text-[#64748b]">({product.reviews} reviews)</span>
                </div>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#0B1A2A] leading-tight mb-2">
                {product.title}
              </h1>
              <p className="text-[#5B6B7B] text-sm sm:text-base font-medium">
                {activeVariant ? activeVariant.subtitle : product.subtitle}
              </p>
            </div>

            {/* Pricing — updates with selected sub-size */}
            <div>
              <div className="flex items-end gap-3 mb-1">
                <span className="font-heading text-3xl font-bold text-[#7cb93e]">
                  ₹{displayPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-lg text-[#94a3b8] font-medium line-through mb-1">
                  ₹{displayOriginalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              {selectedSubSize && (
                <p className="text-xs text-[#64748b] mb-1">
                  Size: <span className="font-semibold text-[#0B1A2A]">{selectedSubSize.dim}</span>
                  {' '}({selectedSubSize.sqft} sq.ft)
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200/60 inline-flex items-center">
                  You save ₹{(displayOriginalPrice - displayPrice).toLocaleString('en-IN', {maximumFractionDigits: 0})} ({(100 - (displayPrice / displayOriginalPrice) * 100).toFixed(0)}% OFF)
                </span>
                <span className="text-xs font-extrabold text-[#0682E4] bg-[#0682E4]/10 px-3 py-1 rounded-lg border border-[#0682E4]/20 inline-flex items-center gap-1.5 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0682E4]" />
                  Rate: ₹{rate}/Sq.Ft
                </span>
              </div>
            </div>
          </div>

          {/* 10 Year Warranty Badge */}
          <div className="shrink-0 flex flex-col items-center justify-center bg-[#0B1A2A] rounded-2xl p-3 sm:p-4 shadow-xl border border-[#1e3046] w-24 sm:w-28 relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#7cb93e]/20 rounded-full blur-xl group-hover:bg-[#7cb93e]/30 transition-colors"></div>
            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] mb-1 z-10" strokeWidth={2} />
            <div className="text-center z-10 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 border-[2px] sm:border-[3px] border-[#7cb93e] border-b-transparent rounded-full opacity-80 pointer-events-none"></div>
              <span className="block text-white font-black text-3xl sm:text-4xl leading-none tracking-tighter mt-1 drop-shadow-md">{displayWarranty}</span>
              <span className="block text-white font-bold text-[9px] sm:text-[11px] tracking-[0.2em] uppercase mt-1 drop-shadow-sm">Year</span>
            </div>
            <div className="relative mt-2 z-10 w-[115%]">
              <div className="absolute -left-1 -right-1 top-1/2 -translate-y-1/2 h-full bg-[#5a8b2a] -z-10 skew-y-3 shadow-md"></div>
              <div className="bg-[#7cb93e] text-[#0B1A2A] text-[10px] sm:text-[11px] font-black uppercase px-1 py-1 text-center shadow-lg relative">
                WARRANTY
              </div>
            </div>
            <div className="text-[6px] sm:text-[7px] text-white/60 mt-2.5 z-10 font-medium tracking-wide text-center">Confidence in Every Sleep</div>
          </div>
        </div>

        {/* Configuration: Size */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-[#0B1A2A]">Select Size</h3>
            <button className="text-xs text-[#3b82f6] font-semibold hover:underline">Size Guide</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {sizes.map((size) => (
              <button
                key={size.name}
                onClick={() => handleSizeClick(size.name)}
                className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left ${
                  selectedSize === size.name
                    ? 'border-[#0B1A2A] bg-gray-50'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <span className={`font-bold text-sm ${selectedSize === size.name ? 'text-[#0B1A2A]' : 'text-[#64748b]'}`}>
                    {size.name}
                  </span>
                  {selectedSize === size.name && <Check className="w-4 h-4 text-[#0B1A2A]" />}
                </div>
                <span className="text-[11px] text-[#94a3b8] font-medium">
                  {selectedSize === size.name && selectedSubSize
                    ? selectedSubSize.dim
                    : size.dim}
                </span>
              </button>
            ))}
          </div>

          {/* Interactive 3D Thickness Selector */}
          <div className="mt-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-[#0B1A2A] flex items-center gap-2">
                Select Thickness
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#7cb93e]/20 text-[#5a8b2a] border border-[#7cb93e]/30 text-[10px] font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-2.5 h-2.5" /> 3D Engineered Profile
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(product.thicknessVariants && product.thicknessVariants.length > 0 ? product.thicknessVariants : [{ thickness: product.thickness || '6 Inch', priceValue: product.price, price: typeof product.price === 'number' ? `₹${product.price.toLocaleString('en-IN')}` : product.price }]).map((variant: any, idx: number) => {
                const isSelected = product.thicknessVariants && product.thicknessVariants.length > 0 ? activeVariantIndex === idx : true;
                const thickNum = variant.thickness.split(' ')[0];
                const thickUnit = variant.thickness.split(' ').slice(1).join(' ') || 'Inch';
                
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (product.thicknessVariants && product.thicknessVariants.length > 0) {
                        setActiveVariantIndex(idx);
                        if (variant.slug && typeof window !== 'undefined') {
                          window.history.replaceState(null, '', `/product/${variant.slug}`);
                        }
                      }
                    }}
                    className={`relative overflow-hidden rounded-2xl p-3.5 transition-all duration-300 text-left flex flex-col justify-between border-2 group cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#0B1A2A] via-[#112338] to-[#0B1A2A] text-white border-[#0682E4] shadow-[0_10px_25px_-5px_rgba(6,130,228,0.35)] -translate-y-0.5'
                        : 'bg-white text-[#0B1A2A] border-gray-100 hover:border-[#0682E4]/40 hover:bg-gray-50/50 shadow-sm'
                    }`}
                  >
                    {isSelected && (
                      <>
                        <div className="absolute -right-6 -top-6 w-20 h-20 bg-[#0682E4]/20 rounded-full blur-xl pointer-events-none" />
                        <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-[#7cb93e]/15 rounded-full blur-xl pointer-events-none" />
                      </>
                    )}

                    <div className="flex justify-between items-start w-full mb-2 relative z-10">
                      <div className="w-9 h-9 shrink-0 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center relative overflow-hidden shadow-inner">
                        <div className="relative w-5 h-5 flex items-center justify-center" style={{ perspective: '400px' }}>
                          <motion.div
                            animate={isSelected ? { rotateZ: [0, 3, -3, 0], y: [0, -1, 0] } : {}}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                            className="relative w-full h-full flex flex-col justify-end items-center"
                            style={{ transformStyle: 'preserve-3d', transform: 'rotateX(55deg) rotateZ(-35deg)' }}
                          >
                            <div
                              className="w-5 h-4 rounded-sm bg-gradient-to-tr from-white via-blue-100 to-white shadow-md border border-white/80 absolute"
                              style={{ transform: 'translateZ(6px)' }}
                            />
                            <div
                              className="w-5 h-4 rounded-sm bg-gradient-to-tr from-[#7cb93e] to-[#9ad15c] shadow-sm absolute opacity-90"
                              style={{ transform: 'translateZ(3px)' }}
                            />
                            <div className="w-5 h-4 rounded-sm bg-gradient-to-tr from-[#0682E4] to-[#3a9ef5] shadow-lg absolute" />
                          </motion.div>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#7cb93e] flex items-center justify-center text-[#0B1A2A] shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-black tabular-nums tracking-tight ${isSelected ? 'text-white' : 'text-[#0B1A2A]'}`}>
                          {thickNum}
                        </span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-[#7cb93e]' : 'text-[#64748b]'}`}>
                          {thickUnit}
                        </span>
                      </div>
                      <div className={`text-[11px] font-semibold mt-1 ${isSelected ? 'text-slate-300' : 'text-[#64748b]'}`}>
                        {variant.price || (variant.priceValue ? `₹${variant.priceValue.toLocaleString('en-IN')}` : '')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Size Toggle */}
          <button
            onClick={() => setCustomOpen(o => !o)}
            className="mt-3 w-full border border-dashed border-gray-300 rounded-xl p-3 text-sm font-medium text-[#64748b] hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <span>Need a Custom Size? <span className="text-xs font-bold text-[#0682E4] ml-1">(Calculated at ₹{rate}/Sq.Ft)</span></span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${customOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Custom Size Panel */}
          <AnimatePresence>
            {customOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mt-2 border border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 space-y-4">
                  <p className="text-xs text-[#64748b] font-medium">Enter your custom dimensions (in inches):</p>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-[#0B1A2A] mb-1">Length (L)&quot;</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 75"
                        value={customL}
                        onChange={e => setCustomL(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#0B1A2A] focus:outline-none focus:border-[#0682E4] focus:ring-1 focus:ring-[#0682E4]/30 bg-white"
                      />
                    </div>
                    <div className="flex items-end pb-2 text-[#94a3b8] font-bold text-lg">×</div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-[#0B1A2A] mb-1">Width (W)&quot;</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 42"
                        value={customW}
                        onChange={e => setCustomW(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#0B1A2A] focus:outline-none focus:border-[#0682E4] focus:ring-1 focus:ring-[#0682E4]/30 bg-white"
                      />
                    </div>
                  </div>

                  {customSqft && customPrice && (
                    <div className="bg-white border border-[#0682E4]/20 rounded-xl p-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] text-[#64748b] font-medium">
                          {customL}&quot; × {customW}&quot; = <span className="font-bold text-[#0B1A2A]">{customSqft} sq.ft</span>
                        </p>
                        <p className="text-[11px] text-[#64748b] mt-0.5">Estimated price</p>
                      </div>
                      <span className="text-lg font-black text-[#0682E4]">
                        ₹{customPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  {customSqft && customPrice && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          addItem({
                            id: product.id.toString(),
                            name: product.title,
                            size: `Custom ${customL}" × ${customW}" - ${selectedThickness}`,
                            price: customPrice,
                            image: product.images[0],
                            qty: 1,
                          });
                          toggleCart();
                        }}
                        className="w-full bg-[#0682E4] hover:bg-[#056ec1] text-white rounded-xl py-2.5 font-bold text-sm transition-colors"
                      >
                        Add Custom Size to Cart — ₹{customPrice.toLocaleString('en-IN')}
                      </button>
                      <button
                        onClick={() => {
                          addItem({
                            id: product.id.toString(),
                            name: product.title,
                            size: `Custom ${customL}" × ${customW}" - ${selectedThickness}`,
                            price: customPrice,
                            image: product.images[0],
                            qty: 1,
                          });
                          if (!session) {
                            alert('Please login or create an account first to complete your purchase!');
                            router.push('/login?callbackUrl=/checkout');
                          } else {
                            router.push('/checkout');
                          }
                        }}
                        className="w-full bg-[#7cb93e] hover:bg-[#68a032] text-white rounded-xl py-2.5 font-extrabold text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Zap className="w-4 h-4" /> Buy Custom Size Now
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-2">
          <Button
            size="lg"
            className="w-full bg-[#7cb93e] hover:bg-[#68a032] text-white h-14 rounded-xl font-bold text-base shadow-[0_8px_20px_-8px_rgba(124,185,62,0.6)] transition-all hover:-translate-y-0.5"
            onClick={handleAddToCart}
          >
            Add to Cart — ₹{displayPrice.toLocaleString('en-IN')}
          </Button>
          <Button
            size="lg"
            className="w-full bg-[#0682E4] hover:bg-[#7cb93e] text-white h-14 rounded-xl font-extrabold text-base shadow-md transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            onClick={() => {
              handleAddToCart();
              if (!session) {
                alert('Please login or create an account first to complete your purchase!');
                router.push('/login?callbackUrl=/checkout');
              } else {
                router.push('/checkout');
              }
            }}
          >
            <Zap className="w-5 h-5 text-[#7cb93e] fill-[#7cb93e]" /> Buy Now — Instant Checkout
          </Button>
        </div>

      </div>

      {/* ─── Luxury Size Selection Modal ──────────────────────────────────────── */}
      {popupOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          style={{ backgroundColor: 'rgba(11, 26, 42, 0.65)', backdropFilter: 'blur(8px)' }}
          onClick={() => setPopupOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] w-full max-w-lg overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-7 py-5 flex items-center justify-between text-white relative overflow-hidden shadow-md"
              style={{ backgroundColor: sizeData.color }}
            >
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <BedDouble className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-extrabold tracking-wider uppercase text-white leading-tight">
                    {selectedSize} Mattress Sizes
                  </h2>
                  <p className="text-xs text-white/80 font-medium">
                    Select standard dimensions for {selectedSize.toLowerCase()} bed
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPopupOpen(false)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 flex items-center justify-center transition-all relative z-10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 text-[11px] font-extrabold text-[#64748b] tracking-wider uppercase py-3.5 px-6 bg-[#f8fafc] border-b border-gray-200/80">
              <div className="col-span-5 text-left">Dimensions (L × W)</div>
              <div className="col-span-3 text-center border-l border-r border-gray-200/60">Surface Area</div>
              <div className="col-span-4 text-right">Price</div>
            </div>

            {/* Table Rows (No scrollbars, full natural height) */}
            <div className="divide-y divide-gray-100 bg-white">
              {sizeData.rows.map((row, idx) => {
                const isSelected = selectedSubSize?.dim === row.dim;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSubSizeSelect(row)}
                    className={`w-full grid grid-cols-12 py-4 px-6 text-sm items-center transition-all duration-200 group ${
                      isSelected
                        ? 'font-bold'
                        : 'hover:bg-slate-50/80 text-gray-700'
                    }`}
                    style={
                      isSelected
                        ? { backgroundColor: sizeData.bgLight, boxShadow: `inset 4px 0 0 ${sizeData.color}` }
                        : {}
                    }
                  >
                    {/* Dimension Column */}
                    <div className="col-span-5 flex items-center gap-2.5 text-left">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                        isSelected 
                          ? 'border-transparent text-white' 
                          : 'border-gray-300 bg-white group-hover:border-gray-400'
                      }`}
                      style={isSelected ? { backgroundColor: sizeData.color } : {}}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-base tracking-tight ${isSelected ? 'text-[#0B1A2A] font-extrabold' : 'font-semibold text-slate-800'}`}>
                        {row.dim}
                      </span>
                    </div>

                    {/* Sq.Ft Column */}
                    <div className="col-span-3 text-center font-medium text-slate-500 border-l border-r border-gray-100 py-1">
                      <span className="bg-slate-100/80 px-2 py-0.5 rounded text-xs font-semibold text-slate-600">
                        {row.sqft.toFixed(2)} sq.ft
                      </span>
                    </div>

                    {/* Price Column */}
                    <div className="col-span-4 text-right">
                      <span
                        className={`text-lg tracking-tight ${isSelected ? 'font-black' : 'font-bold'}`}
                        style={isSelected ? { color: sizeData.color } : { color: '#0B1A2A' }}
                      >
                        ₹{row.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#f8fafc] border-t border-gray-200/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#64748b]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Selected: <strong className="text-[#0B1A2A]">{selectedSubSize?.dim || sizeData.rows[0].dim}</strong></span>
              </div>
              <button
                onClick={() => setPopupOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:opacity-95 transition-opacity"
                style={{ backgroundColor: sizeData.color }}
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
