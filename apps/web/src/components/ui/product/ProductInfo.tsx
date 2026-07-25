"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, ShieldCheck, Truck, Check, ChevronDown, RotateCcw, X, BedDouble } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface ProductInfoProps {
  product: any;
}

// ─── Price data per size category ───────────────────────────────────────────
const SIZE_DATA: Record<string, {
  color: string;
  bgLight: string;
  rows: { dim: string; sqft: number; price: number }[];
}> = {
  Single: {
    color: '#055bc7',
    bgLight: '#eff6ff',
    rows: [
      { dim: '72" × 30"', sqft: 15.00, price: 8190 },
      { dim: '75" × 30"', sqft: 15.63, price: 8526 },
      { dim: '72" × 36"', sqft: 18.00, price: 9828 },
      { dim: '75" × 36"', sqft: 18.75, price: 10237 },
      { dim: '78" × 36"', sqft: 19.50, price: 10647 },
    ],
  },
  Double: {
    color: '#599c15',
    bgLight: '#f0fdf4',
    rows: [
      { dim: '72" × 48"', sqft: 24.00, price: 13104 },
      { dim: '75" × 48"', sqft: 25.00, price: 13650 },
      { dim: '78" × 48"', sqft: 26.00, price: 14196 },
      { dim: '84" × 48"', sqft: 28.00, price: 15288 },
    ],
  },
  Queen: {
    color: '#782c7a',
    bgLight: '#fdf4ff',
    rows: [
      { dim: '72" × 60"', sqft: 30.00, price: 16380 },
      { dim: '75" × 60"', sqft: 31.25, price: 17053 },
      { dim: '78" × 60"', sqft: 32.50, price: 17725 },
      { dim: '84" × 60"', sqft: 35.00, price: 19110 },
    ],
  },
  King: {
    color: '#eb7407',
    bgLight: '#fff7ed',
    rows: [
      { dim: '72" × 72"', sqft: 36.00, price: 19656 },
      { dim: '75" × 72"', sqft: 37.50, price: 20475 },
      { dim: '78" × 72"', sqft: 39.00, price: 21294 },
      { dim: '84" × 72"', sqft: 42.00, price: 22932 },
    ],
  },
};

// Price per sq.ft base rate used for custom size calculation
const PRICE_PER_SQFT = 546; // ₹546 per sq.ft (derived from Single 72×30 = 15 sqft @ ₹8190)

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState('Single');
  const [selectedSubSize, setSelectedSubSize] = useState(SIZE_DATA['Single'].rows[2]); // default 72"×36"
  const [selectedThickness, setSelectedThickness] = useState('6 Inch');
  const [popupOpen, setPopupOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customL, setCustomL] = useState('');
  const [customW, setCustomW] = useState('');
  const { addItem, toggleCart } = useCartStore();

  // Thickness multiplier
  let thicknessMultiplier = 1.0;
  if (selectedThickness === '5 Inch') thicknessMultiplier = 0.85;
  if (selectedThickness === '8 Inch') thicknessMultiplier = 1.3;
  if (selectedThickness === '10 Inch') thicknessMultiplier = 1.6;

  // Derived price shown in the UI
  const baseDisplayPrice = selectedSubSize ? selectedSubSize.price : product.price;
  const displayPrice = Math.round(baseDisplayPrice * thicknessMultiplier);

  // Custom size price calculation
  const customSqft = customL && customW
    ? ((parseFloat(customL) * parseFloat(customW)) / 144).toFixed(2)
    : null;
  const customPrice = customSqft
    ? Math.round(parseFloat(customSqft) * PRICE_PER_SQFT * thicknessMultiplier)
    : null;

  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(),
      name: product.title,
      size: selectedSubSize ? `${selectedSize} (${selectedSubSize.dim}) - ${selectedThickness}` : `${selectedSize} - ${selectedThickness}`,
      price: displayPrice,
      image: product.images[0],
      qty: 1,
    });
    toggleCart();
  };

  const handleSizeClick = (sizeName: string) => {
    setSelectedSize(sizeName);
    // Auto-select first sub-size of new category
    setSelectedSubSize(SIZE_DATA[sizeName].rows[0]);
    setPopupOpen(true);
  };

  const handleSubSizeSelect = (row: typeof selectedSubSize) => {
    setSelectedSubSize(row);
    setPopupOpen(false);
  };

  const sizeData = SIZE_DATA[selectedSize];

  const sizes = [
    { name: 'Single', dim: '72" × 36"' },
    { name: 'Double', dim: '72" × 48"' },
    { name: 'Queen', dim: '72" × 60"' },
    { name: 'King', dim: '72" × 72"' },
  ];

  const thicknesses = ['5 Inch', '6 Inch', '8 Inch', '10 Inch'];

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
                {product.subtitle}
              </p>
            </div>

            {/* Pricing — updates with selected sub-size */}
            <div>
              <div className="flex items-end gap-3 mb-1">
                <span className="font-heading text-3xl font-bold text-[#7cb93e]">
                  ₹{displayPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-lg text-[#94a3b8] font-medium line-through mb-1">
                  ₹{Math.round(product.originalPrice * thicknessMultiplier).toLocaleString('en-IN')}
                </span>
              </div>
              {selectedSubSize && (
                <p className="text-xs text-[#64748b] mb-1">
                  Size: <span className="font-semibold text-[#0B1A2A]">{selectedSubSize.dim}</span>
                  {' '}({selectedSubSize.sqft} sq.ft)
                </p>
              )}
              <p className="text-xs font-bold text-[#0B1A2A] bg-green-50 text-green-700 px-2 py-1 rounded inline-block">
                You save ₹{(product.originalPrice * thicknessMultiplier - displayPrice).toLocaleString('en-IN', {maximumFractionDigits: 0})} ({(100 - (displayPrice / (product.originalPrice * thicknessMultiplier)) * 100).toFixed(0)}% OFF)
              </p>
            </div>
          </div>

          {/* 10 Year Warranty Badge */}
          <div className="shrink-0 flex flex-col items-center justify-center bg-[#0B1A2A] rounded-2xl p-3 sm:p-4 shadow-xl border border-[#1e3046] w-24 sm:w-28 relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#7cb93e]/20 rounded-full blur-xl group-hover:bg-[#7cb93e]/30 transition-colors"></div>
            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] mb-1 z-10" strokeWidth={2} />
            <div className="text-center z-10 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 border-[2px] sm:border-[3px] border-[#7cb93e] border-b-transparent rounded-full opacity-80 pointer-events-none"></div>
              <span className="block text-white font-black text-3xl sm:text-4xl leading-none tracking-tighter mt-1 drop-shadow-md">10</span>
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

          {/* Custom Size Toggle */}
          <button
            onClick={() => setCustomOpen(o => !o)}
            className="mt-3 w-full border border-dashed border-gray-300 rounded-xl p-3 text-sm font-medium text-[#64748b] hover:bg-gray-50 transition-colors flex items-center justify-between"
          >
            <span>Need a Custom Size?</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${customOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Custom Size Panel */}
          {customOpen && (
            <div className="mt-2 border border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 space-y-4">
              <p className="text-xs text-[#64748b] font-medium">Enter your custom dimensions (in inches):</p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#0B1A2A] mb-1">Length (L)"</label>
                  <input
                    type="number"
                    min="1"
                    placeholder='e.g. 75'
                    value={customL}
                    onChange={e => setCustomL(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#0B1A2A] focus:outline-none focus:border-[#055bc7] focus:ring-1 focus:ring-[#055bc7]/30 bg-white"
                  />
                </div>
                <div className="flex items-end pb-2 text-[#94a3b8] font-bold text-lg">×</div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-[#0B1A2A] mb-1">Width (W)"</label>
                  <input
                    type="number"
                    min="1"
                    placeholder='e.g. 42'
                    value={customW}
                    onChange={e => setCustomW(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#0B1A2A] focus:outline-none focus:border-[#055bc7] focus:ring-1 focus:ring-[#055bc7]/30 bg-white"
                  />
                </div>
              </div>

              {customSqft && customPrice && (
                <div className="bg-white border border-[#055bc7]/20 rounded-xl p-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] text-[#64748b] font-medium">
                      {customL}" × {customW}" = <span className="font-bold text-[#0B1A2A]">{customSqft} sq.ft</span>
                    </p>
                    <p className="text-[11px] text-[#64748b] mt-0.5">Estimated price</p>
                  </div>
                  <span className="text-lg font-black text-[#055bc7]">
                    ₹{customPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {customSqft && customPrice && (
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
                  className="w-full bg-[#055bc7] hover:bg-[#044aab] text-white rounded-xl py-2.5 font-bold text-sm transition-colors"
                >
                  Add Custom Size to Cart — ₹{customPrice.toLocaleString('en-IN')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Configuration: Thickness */}
        <div>
          <h3 className="text-sm font-bold text-[#0B1A2A] mb-3">Select Thickness</h3>
          <div className="flex flex-wrap gap-3">
            {thicknesses.map((thick) => (
              <button
                key={thick}
                onClick={() => setSelectedThickness(thick)}
                className={`px-5 py-2.5 rounded-full border-2 transition-all font-bold text-sm ${
                  selectedThickness === thick
                    ? 'border-[#0B1A2A] bg-[#0B1A2A] text-white'
                    : 'border-gray-100 text-[#64748b] hover:border-gray-300'
                }`}
              >
                {thick}
              </button>
            ))}
          </div>
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
        </div>

      </div>

      {/* ─── Sub-Size Popup Modal ────────────────────────────────────────── */}
      {popupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setPopupOpen(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ backgroundColor: sizeData.color }}
            >
              <div className="flex items-center gap-3">
                <BedDouble className="w-6 h-6 text-white" />
                <h2 className="text-white font-heading text-xl font-bold tracking-widest">
                  {selectedSize.toUpperCase()}
                </h2>
              </div>
              <button
                onClick={() => setPopupOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Table Header */}
            <div
              className="grid grid-cols-3 text-[11px] font-bold text-gray-600 uppercase text-center py-3 border-b border-gray-200"
              style={{ backgroundColor: '#f8fafc' }}
            >
              <div>Size (Inches)</div>
              <div className="border-l border-r border-gray-200 flex items-center justify-center">Sq.Ft.</div>
              <div>Price (₹)</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100 max-h-[55vh] overflow-y-auto">
              {sizeData.rows.map((row, idx) => {
                const isSelected = selectedSubSize?.dim === row.dim;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSubSizeSelect(row)}
                    className={`w-full grid grid-cols-3 py-4 px-2 text-sm font-semibold text-center transition-all ${
                      isSelected ? 'ring-2 ring-inset' : 'hover:bg-opacity-50'
                    }`}
                    style={
                      isSelected
                        ? { backgroundColor: sizeData.bgLight, ringColor: sizeData.color }
                        : { backgroundColor: 'transparent' }
                    }
                  >
                    <div className="flex items-center justify-center gap-1">
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: sizeData.color }} />
                      )}
                      <span className={isSelected ? 'font-bold text-[#0B1A2A]' : 'text-gray-700'}>
                        {row.dim}
                      </span>
                    </div>
                    <div className="text-gray-500 border-l border-r border-gray-100 flex items-center justify-center">
                      {row.sqft.toFixed(2)}
                    </div>
                    <div
                      className="flex items-center justify-center font-bold"
                      style={{ color: sizeData.color }}
                    >
                      ₹ {row.price.toLocaleString('en-IN')}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer note */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-xs text-[#64748b]">
                Click a row to select that size — price updates automatically.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
