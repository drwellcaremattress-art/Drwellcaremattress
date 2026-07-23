"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, ShieldCheck, Truck, Check, ChevronDown, RotateCcw } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface ProductInfoProps {
  product: any;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState('Single');
  const [selectedThickness, setSelectedThickness] = useState('6 Inch');
  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(),
      name: product.title,
      size: selectedSize,
      price: product.price,
      image: product.images[0],
      qty: 1
    });
    toggleCart(); // Open cart to show it was added
  };

  const sizes = [
    { name: 'Single', dim: '72" x 36"' },
    { name: 'Double', dim: '72" x 48"' },
    { name: 'Queen', dim: '72" x 60"' },
    { name: 'King', dim: '72" x 72"' },
  ];

  const thicknesses = ['5 Inch', '6 Inch', '8 Inch', '10 Inch'];

  return (
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

          {/* Pricing */}
          <div>
            <div className="flex items-end gap-3 mb-1">
              <span className="font-heading text-3xl font-bold text-[#7cb93e]">₹{product.price.toLocaleString()}</span>
              <span className="text-lg text-[#94a3b8] font-medium line-through mb-1">₹{product.originalPrice.toLocaleString()}</span>
            </div>
            <p className="text-xs font-bold text-[#0B1A2A] bg-green-50 text-green-700 px-2 py-1 rounded inline-block">
              You save ₹{(product.originalPrice - product.price).toLocaleString()} ({(100 - (product.price / product.originalPrice) * 100).toFixed(0)}% OFF)
            </p>
          </div>
        </div>

        {/* 10 Year Warranty Badge - Right side matching image */}
        <div className="shrink-0 flex flex-col items-center justify-center bg-[#0B1A2A] rounded-2xl p-3 sm:p-4 shadow-xl border border-[#1e3046] w-24 sm:w-28 relative overflow-hidden group">
          {/* Subtle Glow Background */}
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#7cb93e]/20 rounded-full blur-xl group-hover:bg-[#7cb93e]/30 transition-colors"></div>
          
          <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] mb-1 z-10" strokeWidth={2} />
          
          <div className="text-center z-10 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 border-[2px] sm:border-[3px] border-[#7cb93e] border-b-transparent rounded-full opacity-80 pointer-events-none"></div>
            <span className="block text-white font-black text-3xl sm:text-4xl leading-none tracking-tighter mt-1 drop-shadow-md">10</span>
            <span className="block text-white font-bold text-[9px] sm:text-[11px] tracking-[0.2em] uppercase mt-1 drop-shadow-sm">Year</span>
          </div>
          
          {/* Ribbon */}
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
              onClick={() => setSelectedSize(size.name)}
              className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left ${
                selectedSize === size.name 
                  ? 'border-[#0B1A2A] bg-gray-50' 
                  : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-center w-full mb-1">
                <span className={`font-bold text-sm ${selectedSize === size.name ? 'text-[#0B1A2A]' : 'text-[#64748b]'}`}>{size.name}</span>
                {selectedSize === size.name && <Check className="w-4 h-4 text-[#0B1A2A]" />}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium">{size.dim}</span>
            </button>
          ))}
        </div>
        <button className="mt-3 w-full border border-dashed border-gray-300 rounded-xl p-3 text-sm font-medium text-[#64748b] hover:bg-gray-50 transition-colors flex items-center justify-between">
          <span>Need a Custom Size?</span>
          <ChevronDown className="w-4 h-4" />
        </button>
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
          Add to Cart
        </Button>
      </div>

      
    </div>
  );
}
