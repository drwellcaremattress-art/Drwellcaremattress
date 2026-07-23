"use client";

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star, ShieldCheck, Truck, Activity, Plus, Minus, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState('Queen');
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  
  const basePrice = 14999;
  const sizeMultipliers: Record<string, number> = {
    'Single': 1,
    'Double': 1.2,
    'Queen': 1.5,
    'King': 1.8
  };
  
  const currentPrice = basePrice * sizeMultipliers[selectedSize];

  return (
    <div className="bg-surface-alt min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 text-sm text-ink-muted flex items-center gap-2">
        <Link href="/" className="hover:text-primary-blue">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/collections" className="hover:text-primary-blue">Mattresses</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-ink font-medium">The Dr Well Signature</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-soft p-4 lg:p-8 grid lg:grid-cols-2 gap-12">
          
          {/* Image Gallery */}
          <div className="flex gap-4">
            {/* Thumbnail Rail */}
            <div className="hidden lg:flex flex-col gap-4 w-24">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 ${i === 1 ? 'border-primary-blue' : 'border-transparent hover:border-surface-alt'}`}>
                  <Image src="/images/layers.png" alt={`Thumbnail ${i}`} fill className="object-cover" />
                </div>
              ))}
            </div>
            {/* Main Image */}
            <div className="relative aspect-[4/3] lg:aspect-square flex-grow rounded-2xl overflow-hidden bg-surface-alt group cursor-zoom-in">
              <Image src="/images/layers.png" alt="Main product image" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6 border-b border-surface-alt pb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-brand-green-light text-brand-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Orthopaedic Firm
                </span>
                <div className="flex items-center gap-1 text-warning-gold">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-bold text-ink">4.9 (128 reviews)</span>
                </div>
              </div>
              <h1 className="font-heading text-3xl lg:text-5xl font-bold mb-4">The Dr Well Signature</h1>
              <p className="text-ink-muted font-body leading-relaxed">
                Our flagship orthopaedic mattress engineered with high-density support foam and cooling technology. Designed to align your spine perfectly while you sleep.
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-end gap-4 mb-2">
                <span className="font-mono font-bold text-4xl text-ink">₹{currentPrice.toLocaleString('en-IN')}</span>
                <span className="font-mono text-ink-muted line-through text-xl pb-1">₹{(currentPrice * 1.5).toLocaleString('en-IN')}</span>
                <span className="text-error-red font-bold text-sm pb-1.5">(Save 33%)</span>
              </div>
              <p className="text-sm text-ink-muted">Inclusive of all taxes</p>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-heading font-semibold text-ink">Select Size</h3>
                <button className="text-primary-blue text-sm hover:underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {['Single', 'Double', 'Queen', 'King'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                      selectedSize === size 
                        ? 'border-primary-blue bg-primary-blue-light text-primary-blue ring-1 ring-primary-blue' 
                        : 'border-surface-alt text-ink hover:border-primary-blue/50 hover:bg-surface-alt'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-surface-alt rounded-full p-1 bg-surface-alt">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-white rounded-full text-ink transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-bold text-ink">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-white rounded-full text-ink transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button 
                size="lg" 
                onClick={() => addItem({
                  id: `dr-well-sig-${selectedSize.toLowerCase()}`,
                  name: 'The Dr Well Signature',
                  size: selectedSize,
                  price: currentPrice,
                  qty: qty,
                  image: '/images/layers.png'
                })}
                className="flex-grow bg-primary-blue hover:bg-primary-blue-dark text-white rounded-full text-lg h-14 shadow-lg shadow-primary-blue/20"
              >
                Add to Cart
              </Button>
            </div>

            {/* Trust Icons */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-surface-alt rounded-2xl">
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="h-6 w-6 text-brand-green" />
                <span className="text-xs font-semibold text-ink">10-Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 border-l border-r border-surface-alt/50">
                <Truck className="h-6 w-6 text-brand-green" />
                <span className="text-xs font-semibold text-ink">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Activity className="h-6 w-6 text-brand-green" />
                <span className="text-xs font-semibold text-ink">100-Night Trial</span>
              </div>
            </div>

          </div>
        </div>

        {/* Accoridons / Details section would go here */}
        <div className="mt-12 bg-white rounded-3xl shadow-soft p-8">
          <h2 className="font-heading text-2xl font-bold mb-6">Product Details</h2>
          <div className="prose prose-blue max-w-none">
            <p>The Dr Well Signature Mattress is our most popular model, combining multiple layers of proprietary foam to provide the ideal balance of comfort and orthopaedic support. It aligns your spine naturally, relieving pressure points and reducing back pain.</p>
            <ul>
              <li><strong>Top Layer:</strong> Breathable, cooling fabric cover.</li>
              <li><strong>Comfort Layer:</strong> 2" of plush memory foam that contours to your body.</li>
              <li><strong>Support Layer:</strong> High-resilience orthopaedic core for maximum spine alignment.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
