"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  ChevronUp,
  RotateCcw,
  CircleDot,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

export function ProductListing() {
  const products = [
    { id: 1, title: 'Ecolatex', slug: 'ecolatex-6', type: 'Latex', firmness: 'Medium Firm', subtitle: 'Premium Mattress', description: 'Advanced spine support and pressure relief.', badge: 'NEW', badgeColor: 'bg-[#7cb93e] text-white', thickness: '6 Inch', price: '₹12,999', priceValue: 12999, image: "/images/products/ecolatex 6'.png" },
    { id: 2, title: 'Ecolatex', slug: 'ecolatex-8', type: 'Latex', firmness: 'Medium Firm', subtitle: 'Premium Mattress', description: 'Advanced spine support and pressure relief.', badge: 'BEST SELLER', badgeColor: 'bg-[#3b82f6] text-white', thickness: '8 Inch', price: '₹14,999', priceValue: 14999, image: "/images/products/ecolatex 8'.png" },
    { id: 3, title: 'Lax-o-Bond', slug: 'lax-o-bond', type: 'Orthopaedic', firmness: 'Firm', subtitle: 'Premium Orthopaedic', description: 'Advanced spine support and pressure relief.', badge: 'POPULAR', badgeColor: 'bg-[#8b5cf6] text-white', thickness: 'Standard', price: '₹11,999', priceValue: 11999, image: "/images/products/lax-o-bond.png" },
    { id: 4, title: 'Luxoria', slug: 'luxoria', type: 'Hybrid', firmness: 'Medium Soft', subtitle: 'Luxury Mattress', description: 'Cloud-like comfort that contours to your body.', badge: 'LUXURY', badgeColor: 'bg-[#0B1A2A] text-white', thickness: 'Standard', price: '₹18,999', priceValue: 18999, image: "/images/products/luxoria.png" },
    { id: 5, title: 'Memory Bond', slug: 'memory-bond', type: 'Memory Foam', firmness: 'Medium', subtitle: 'Memory Foam Mattress', description: 'Cloud-like comfort that contours to your body.', badge: 'PREMIUM', badgeColor: 'bg-[#10b981] text-white', thickness: 'Standard', price: '₹15,999', priceValue: 15999, image: "/images/products/memory bond.png" },
    { id: 6, title: 'Memory Dump', slug: 'memory-dump-6', type: 'Memory Foam', firmness: 'Soft', subtitle: 'Memory Foam Mattress', description: 'Cloud-like comfort that contours to your body.', badge: 'NEW', badgeColor: 'bg-[#7cb93e] text-white', thickness: '6 Inch', price: '₹13,999', priceValue: 13999, image: "/images/products/Memory Dump 6'.png" },
    { id: 7, title: 'Memory Dump', slug: 'memory-dump-8', type: 'Memory Foam', firmness: 'Medium Soft', subtitle: 'Memory Foam Mattress', description: 'Cloud-like comfort that contours to your body.', badge: 'LIMITED', badgeColor: 'bg-[#f59e0b] text-white', thickness: '8 Inch', price: '₹16,999', priceValue: 16999, image: "/images/products/Memory Dump 8'.png" },
    { id: 8, title: 'Mono Softy', slug: 'mono-softy', type: 'Hybrid', firmness: 'Medium Soft', subtitle: 'Comfort Mattress', description: 'Cloud-like comfort that contours to your body.', badge: 'POPULAR', badgeColor: 'bg-[#8b5cf6] text-white', thickness: 'Standard', price: '₹10,999', priceValue: 10999, image: "/images/products/mono softy.png" },
    { id: 9, title: 'Softy Bond', slug: 'softy-bond-6', type: 'Orthopaedic', firmness: 'Medium Soft', subtitle: 'Comfort Mattress', description: 'Cloud-like comfort that contours to your body.', badge: 'NEW', badgeColor: 'bg-[#7cb93e] text-white', thickness: '6 Inch', price: '₹12,499', priceValue: 12499, image: "/images/products/softy bond 6'.png" },
    { id: 10, title: 'Softybond Plus', slug: 'softybond-plus-8', type: 'Orthopaedic', firmness: 'Medium', subtitle: 'Comfort Mattress', description: 'Cloud-like comfort that contours to your body.', badge: 'EXCLUSIVE', badgeColor: 'bg-[#ef4444] text-white', thickness: '8 Inch', price: '₹15,499', priceValue: 15499, image: "/images/products/softybond plus 8'.png" }
  ];

  // States for filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFirmnesses, setSelectedFirmnesses] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Best Selling');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const typesList = ['Orthopaedic', 'Memory Foam', 'Latex', 'Hybrid'];
  const firmnessList = ['Soft', 'Medium Soft', 'Medium', 'Medium Firm', 'Firm'];
  const sizesList = ['Single (72 x 36 in)', 'Queen (60 x 72 in)', 'King (72 x 72 in)', 'Custom Size'];

  // Toggle filter helper
  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedFirmnesses([]);
    setSelectedSizes([]);
  };

  // Filter and Sort Logic
  const processedProducts = useMemo(() => {
    let filtered = products.filter(p => {
      let typeMatch = selectedTypes.length === 0 || selectedTypes.includes(p.type);
      let firmnessMatch = selectedFirmnesses.length === 0 || selectedFirmnesses.includes(p.firmness);
      // We don't have actual sizes array on products right now, so we assume all products are available in all sizes
      let sizeMatch = true; 
      
      return typeMatch && firmnessMatch && sizeMatch;
    });

    // Sorting
    if (sortBy === 'Price: Low to High') {
      filtered.sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortBy === 'Price: High to Low') {
      filtered.sort((a, b) => b.priceValue - a.priceValue);
    } else if (sortBy === 'Newest Arrivals') {
      filtered.sort((a, b) => b.id - a.id);
    } // 'Best Selling' -> default order

    return filtered;
  }, [products, selectedTypes, selectedFirmnesses, selectedSizes, sortBy]);

  return (
    <div className="container mx-auto px-4 pb-24 relative z-20 bg-white pt-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden w-full flex justify-between items-center bg-gray-50 p-4 rounded-xl -mb-4 border border-gray-100">
          <Button onClick={() => setShowMobileFilters(!showMobileFilters)} variant="outline" className="flex items-center gap-2 font-bold text-[#0B1A2A] bg-white">
            <Filter className="w-4 h-4" />
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <span className="text-sm font-bold text-gray-500">{processedProducts.length} Products</span>
        </div>

        {/* Sidebar */}
        <aside className={`w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] overflow-y-auto hide-scrollbar self-start ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] mb-4">
            <h2 className="font-heading font-bold text-lg mb-6 text-[#0B1A2A]">Filter By</h2>
            
            {/* Mattress Type */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4 cursor-pointer">
                <h3 className="font-semibold text-sm">Mattress Type</h3>
                <ChevronUp className="w-4 h-4 text-[#64748b]" />
              </div>
              <div className="space-y-3">
                {typesList.map((type) => {
                  const isActive = selectedTypes.includes(type);
                  return (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(selectedTypes, setSelectedTypes, type)}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-[#0B1A2A] border-[#0B1A2A]' : 'border-gray-200 group-hover:border-[#0B1A2A]'}`}>
                        {isActive && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-sm transition-colors ${isActive ? 'text-[#0B1A2A] font-semibold' : 'text-[#64748b] group-hover:text-[#0B1A2A]'}`}>{type}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            
            <div className="h-px bg-gray-100 w-full mb-6"></div>

            {/* Firmness Level */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4 cursor-pointer">
                <h3 className="font-semibold text-sm">Firmness Level</h3>
                <ChevronUp className="w-4 h-4 text-[#64748b]" />
              </div>
              <div className="space-y-3">
                {firmnessList.map((level) => {
                  const isActive = selectedFirmnesses.includes(level);
                  return (
                    <label key={level} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(selectedFirmnesses, setSelectedFirmnesses, level)}>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isActive ? 'border-[#0B1A2A]' : 'border-gray-200 group-hover:border-[#0B1A2A]'}`}>
                        {isActive && <div className="w-2 h-2 rounded-full bg-[#0B1A2A]"></div>}
                      </div>
                      <span className={`text-sm transition-colors ${isActive ? 'text-[#0B1A2A] font-semibold' : 'text-[#64748b] group-hover:text-[#0B1A2A]'}`}>{level}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full mb-6"></div>

            {/* Size */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4 cursor-pointer">
                <h3 className="font-semibold text-sm">Size</h3>
                <ChevronUp className="w-4 h-4 text-[#64748b]" />
              </div>
              <div className="space-y-3">
                {sizesList.map((size) => {
                  const isActive = selectedSizes.includes(size);
                  return (
                    <label key={size} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-[#0B1A2A] border-[#0B1A2A]' : 'border-gray-200 group-hover:border-[#0B1A2A]'}`}>
                        {isActive && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-sm transition-colors ${isActive ? 'text-[#0B1A2A] font-semibold' : 'text-[#64748b] group-hover:text-[#0B1A2A]'}`}>{size}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <Button onClick={clearFilters} variant="outline" className="w-full flex items-center justify-center gap-2 border-gray-200 text-[#0B1A2A] hover:bg-gray-50 rounded-lg">
              <RotateCcw className="w-4 h-4 text-[#7cb93e]" />
              Clear All Filters
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-gray-100 pb-6">
            <div>
              <h2 className="font-heading text-4xl font-bold text-[#0B1A2A] mb-2 tracking-tight">Our Collections</h2>
              <p className="text-[#64748b] text-sm md:text-base font-medium max-w-xl">
                Explore our meticulously crafted range of mattresses, designed for the ultimate restorative sleep experience.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0 shrink-0">
              <span className="text-sm font-semibold text-[#64748b]">Sort by:</span>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-[#0B1A2A] focus:outline-none focus:ring-2 focus:ring-[#7cb93e] focus:border-transparent transition-shadow cursor-pointer shadow-sm"
                >
                  <option>Best Selling</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
                <ChevronUp className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 rotate-180 pointer-events-none text-[#0B1A2A]" />
              </div>
            </div>
          </div>

          {processedProducts.length === 0 ? (
            <div className="py-20 text-center text-gray-500 font-medium">No products match your selected filters.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
              {processedProducts.map((product, index) => (
                <motion.div 
                  key={product.id} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                  className="bg-white rounded-[2rem] p-5 flex flex-col shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] group hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] transition-all duration-500 border border-gray-100 hover:border-transparent hover:-translate-y-1"
                >
                  
                  {/* Image & Badges */}
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#f8fafc] mb-6 shadow-inner">
                    <Image src={product.image} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className={`absolute top-4 left-4 px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-lg shadow-md ${product.badgeColor}`}>
                      {product.badge}
                    </div>
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:text-red-500 hover:bg-white transition-all transform active:scale-90">
                      <Heart className="w-4 h-4 text-[#64748b]" strokeWidth={2.5} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow flex flex-col px-2 pb-2">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="font-heading font-extrabold text-xl text-[#0B1A2A] leading-tight">{product.title}</h3>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#64748b] block mb-0.5">From</span>
                        <span className="text-xl font-black text-[#0B1A2A]">{product.price}</span>
                      </div>
                    </div>
                    <p className="text-[#7cb93e] text-xs font-bold uppercase tracking-wider mb-3">{product.subtitle}</p>
                    <p className="text-[#64748b] text-sm mb-5 line-clamp-2 leading-relaxed">{product.description}</p>
                    
                    <div className="flex items-center gap-5 mb-6 text-xs text-[#475569] font-bold mt-auto bg-gray-50/80 p-3 rounded-xl border border-gray-100 flex-wrap">
                      <div className="flex items-center gap-2 bg-[#7cb93e]/15 text-[#5a8b2a] px-3 py-1.5 rounded-lg border border-[#7cb93e]/30 shadow-sm">
                        <CircleDot className="w-4 h-4 text-[#5a8b2a]" />
                        Thickness: <span className="text-[#3b5c1c]">{product.thickness}</span>
                      </div>
                      <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
                      <div className="flex items-center gap-2 text-[#0B1A2A]">
                        <ShieldCheck className="w-4 h-4 text-[#0B1A2A]" />
                        10-Year Warranty
                      </div>
                    </div>
                    
                    <Link href={`/product/${product.slug}`} className="mt-auto block">
                      <Button className="w-full bg-[#0B1A2A] hover:bg-[#7cb93e] text-white rounded-xl py-6 font-bold text-[15px] shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(124,185,62,0.3)] transition-all duration-300 relative overflow-hidden group/btn">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          View Details
                          <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </Button>
                    </Link>
                  </div>
                  
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
