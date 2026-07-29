"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
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
import { PRODUCT_CATALOG, getDeduplicatedCatalog } from '@/lib/catalog';

function ProductListingContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams ? searchParams.get('type') : null;

  const defaultProducts = getDeduplicatedCatalog();

  const [products, setProducts] = useState<any[]>(defaultProducts);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('drwell_user_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        setWishlist(parsed.map((item: any) => typeof item === 'string' ? item : item.slug));
      }
    } catch (e) {}
  }, []);

  const toggleWishlist = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const savedStr = localStorage.getItem('drwell_user_wishlist');
      let current: any[] = savedStr ? JSON.parse(savedStr) : [];
      const exists = current.some((item: any) => (typeof item === 'string' ? item : item.slug) === product.slug);
      if (exists) {
        current = current.filter((item: any) => (typeof item === 'string' ? item : item.slug) !== product.slug);
      } else {
        current.push({
          title: product.title,
          slug: product.slug,
          price: product.price || '₹14,999',
          mrp: product.originalPrice ? `₹${Number(product.originalPrice).toLocaleString('en-IN')}` : '₹21,000',
          badge: product.badge || 'ORTHOPEDIC',
        });
      }
      localStorage.setItem('drwell_user_wishlist', JSON.stringify(current));
      setWishlist(current.map(item => typeof item === 'string' ? item : item.slug));
    } catch (err) {}
  };

  useEffect(() => {
    axios.get('/api/products').then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const typeMap: any = {
          'orthopaedic': 'Orthopaedic',
          'memory-foam': 'Memory Foam',
          'latex': 'Latex',
          'hybrid': 'Hybrid',
          'pocket-spring': 'Pocket Spring',
          'bonded': 'Bonded Series',
          'luxury-hr': 'Luxury HR Series',
          'budget': 'Budget Mattress'
        };
        
        const staticDedupe = getDeduplicatedCatalog();
        const seenNames = new Set<string>();
        const cleanName = (name: string) => (name || 'Mattress').replace(/\s*-\s*\d+\s*(inch|")?|\s+\d+\s*(inch|")?$/i, '').replace(/\s+plus$/i, '').trim();

        const mapped: any[] = [];
        
        staticDedupe.forEach((s, idx) => {
          seenNames.add(s.title.toLowerCase().trim());
          const priceVal = s.priceValue || 12999;
          mapped.push({
            id: s.id || idx + 1,
            title: s.title,
            slug: s.slug,
            type: s.type || 'Orthopaedic',
            firmness: s.firmness || 'Medium Firm',
            subtitle: s.subtitle || 'Premium Mattress',
            description: s.description || 'Advanced spine support and pressure relief.',
            badge: s.badge || (idx === 0 ? 'BEST SELLER' : (idx === 1 ? 'NEW' : 'POPULAR')),
            badgeColor: s.badgeColor || (idx % 2 === 0 ? 'bg-[#7cb93e] text-white' : 'bg-[#3b82f6] text-white'),
            thickness: s.thickness,
            price: s.price || `₹${priceVal.toLocaleString('en-IN')}`,
            priceValue: priceVal,
            originalPrice: s.originalPrice || Math.round(priceVal * 1.3),
            sqftPrice: s.sqftPrice || 546,
            warranty: s.warranty || 10,
            image: s.image || "/images/products/ecolatex-6.jpeg",
            thicknessVariants: s.thicknessVariants
          });
        });

        res.data.forEach((p: any, idx: number) => {
          const baseName = cleanName(p.name);
          const nameLower = baseName.toLowerCase();
          
          const firstVariant = p.variants && p.variants[0] ? p.variants[0] : null;
          const priceVal = p.sqftPrice ? p.sqftPrice * 18 : (firstVariant ? firstVariant.price : 12999);
          const thicknessVal = p.thickness || (firstVariant && firstVariant.thickness_cm ? `${Math.round(firstVariant.thickness_cm / 2.54)} Inch` : '6 Inch');
          const dbImage = p.images && p.images[0] ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url) : null;

          if (seenNames.has(nameLower)) {
            const existingIndex = mapped.findIndex(m => m.title.toLowerCase().trim() === nameLower);
            if (existingIndex !== -1) {
              if (dbImage) mapped[existingIndex].image = dbImage;
              mapped[existingIndex].priceValue = priceVal;
              mapped[existingIndex].price = `₹${priceVal.toLocaleString('en-IN')}`;
              if (p.originalPrice || firstVariant) {
                mapped[existingIndex].originalPrice = p.originalPrice || (firstVariant ? firstVariant.mrp : Math.round(priceVal * 1.3));
              }
              // If the DB product is the "default" one they want to show, update the slug
              // E.g., lax-o-bond-8 will replace lax-o-bond's link on the collections page, which is fine since they just updated it.
              mapped[existingIndex].slug = p.slug;
            }
            return;
          }
          seenNames.add(nameLower);

          mapped.push({
            id: p._id || staticDedupe.length + idx + 1,
            title: baseName,
            slug: p.slug,
            type: typeMap[p.category] || p.category || 'Orthopaedic',
            firmness: p.firmness || 'Medium Firm',
            subtitle: p.description ? p.description.split('.')[0] : 'Premium Mattress',
            description: p.description || 'Advanced spine support and pressure relief.',
            badge: 'NEW',
            badgeColor: 'bg-[#3b82f6] text-white',
            thickness: thicknessVal,
            price: `₹${priceVal.toLocaleString('en-IN')}`,
            priceValue: priceVal,
            originalPrice: p.originalPrice || (firstVariant ? firstVariant.mrp : Math.round(priceVal * 1.3)),
            sqftPrice: p.sqftPrice || 546,
            warranty: p.warranty_years || p.warranty || 10,
            image: dbImage || "/images/products/ecolatex-6.jpeg"
          });
        });

        setProducts(mapped);
      }
    }).catch(err => {
      console.error("Failed to load dynamic products:", err);
    });
  }, []);

  // States for filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFirmnesses, setSelectedFirmnesses] = useState<string[]>([]);

  useEffect(() => {
    if (typeParam) {
      const formatted = typeParam.replace(/\+/g, ' ').trim();
      const match = typesList.find(t => t.toLowerCase() === formatted.toLowerCase()) || formatted;
      setSelectedTypes([match]);
      setTimeout(() => {
        const el = document.getElementById('product-listing-section') || document.querySelector('aside');
        if (el) {
          const yOffset = -100;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
    }
  }, [typeParam]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Best Selling');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const typesList = ['Latex', 'Memory Foam', 'Luxury HR Series', 'Bonded Series', 'Budget Mattress', 'Orthopaedic', 'Hybrid'];
  const firmnessList = ['Soft', 'Medium Soft', 'Medium Firm', 'Firm'];
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
      let typeMatch = selectedTypes.length === 0 || selectedTypes.some(t => {
        const normT = (t || '').replace(/\+/g, ' ').toLowerCase().trim();
        const titleLower = (p.title || p.name || '').toLowerCase().trim();
        const slugLower = (p.slug || '').toLowerCase().trim();
        const typeLower = (p.type || '').toLowerCase().trim();
        const categoryLower = (p.category || '').toLowerCase().trim();
        
        if (normT === 'latex') return typeLower === 'latex' || categoryLower === 'latex' || titleLower.includes('latex') || slugLower.includes('latex') || slugLower.includes('ecolatex');
        if (normT === 'memory foam') return typeLower === 'memory foam' || categoryLower === 'memory-foam' || titleLower.includes('memory') || slugLower.includes('memory');
        if (normT === 'hybrid') {
          return slugLower.includes('luxoria-latex') || slugLower === 'luxoria';
        }
        if (normT === 'orthopaedic' || normT === 'orthopedic') {
          return slugLower.includes('mona-softy') || slugLower.includes('memory-dump') || slugLower.includes('lax-o-bond');
        }
        if (normT === 'bonded series' || normT === 'bonded') {
          return slugLower.includes('softy-bond') || slugLower.includes('memory-bond') || slugLower.includes('lax-o-bond');
        }
        if (normT === 'luxury hr series' || normT === 'luxury hr' || normT === 'hr series' || normT === 'luxury-hr') {
          return slugLower.includes('mona-lite') || slugLower.includes('mona-softy') || slugLower.includes('ecolatex') || slugLower === 'luxoria' || slugLower.includes('luxoria-latex') || slugLower.includes('memory-dump') || slugLower.includes('memory-bond');
        }
        if (normT === 'budget mattress' || normT === 'budget') {
          return slugLower.includes('mona');
        }

        return typeLower === normT || categoryLower === normT;
      });
      let firmnessMatch = selectedFirmnesses.length === 0 || selectedFirmnesses.some(f => {
        const normF = f.toLowerCase().trim();
        const slugLower = (p.slug || '').toLowerCase().trim();
        if (normF === 'soft') return slugLower.includes('memory-dump') || slugLower === 'luxoria' || slugLower.includes('luxoria-latex');
        if (normF === 'firm') return slugLower.includes('mona-lite');
        if (normF === 'medium soft') return slugLower.includes('lax-o-bond') || slugLower.includes('memory-bond') || slugLower.includes('natural-latex');
        if (normF === 'medium firm') return slugLower.includes('ecolatex') || slugLower.includes('softy-bond') || slugLower.includes('mona-softy');
        return (p.firmness || '').toLowerCase().includes(normF);
      });
      let sizeMatch = true; 
      
      return typeMatch && firmnessMatch && sizeMatch;
    });

    // Sorting & Custom Sequence Enforcement
    if (sortBy === 'Price: Low to High') {
      filtered.sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortBy === 'Price: High to Low') {
      filtered.sort((a, b) => b.priceValue - a.priceValue);
    } else if (sortBy === 'Newest Arrivals') {
      filtered.sort((a, b) => b.id - a.id);
    } else {
      // Best Selling / Default: enforce exact requested display order
      const getMasterRank = (item: any) => {
        const t = (item.title || item.name || '').toLowerCase().trim();
        const s = (item.slug || '').toLowerCase().trim();
        if (t === 'mona lite' || s.includes('mona-lite')) return 1;
        if (t === 'mona softy' || s.includes('mona-softy')) return 2;
        if (t === 'memory dump' || s.includes('memory-dump')) return 3;
        if (t === 'luxoria' || s === 'luxoria') return 4;
        if (t === 'luxoria latex' || s.includes('luxoria-latex')) return 5;
        if (t === 'lax-o-bond' || s.includes('lax-o-bond')) return 6;
        if (t === 'memory bond' || s.includes('memory-bond')) return 7;
        if (t === 'natural latex' || s.includes('natural-latex')) return 8;
        if (t === 'eco latex' || s.includes('ecolatex')) return 9;
        if (t === 'softy bond' || s.includes('softy-bond')) return 10;
        return 99;
      };
      filtered.sort((a, b) => getMasterRank(a) - getMasterRank(b));
    }

    return filtered;
  }, [products, selectedTypes, selectedFirmnesses, selectedSizes, sortBy]);

  return (
    <div className="container mx-auto px-4 pb-8 relative z-20 bg-white pt-10">
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4 border-b border-gray-100 pb-6">
            <div>
              <h2 className="font-heading text-4xl font-bold text-[#0B1A2A] mb-2 tracking-tight">
                {selectedTypes.includes('Bonded Series') ? 'Bonded Series Collection' : selectedTypes.includes('Luxury HR Series') ? 'Luxury HR Series Collection' : 'Our Collections'}
              </h2>
              <p className="text-[#64748b] text-sm md:text-base font-medium max-w-xl">
                {selectedTypes.includes('Bonded Series') 
                  ? 'Specially designed for heavy weight sleepers above 80 kg, engineered with High-Density Bonded Foam.'
                  : selectedTypes.includes('Luxury HR Series')
                  ? 'Experience luxury and choose your comfort with our flagship high resilience & organic variants.'
                  : 'Explore our meticulously crafted range of mattresses, designed for the ultimate restorative sleep experience.'}
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

          {/* Dynamic Series Showcase Banner */}
          {selectedTypes.includes('Bonded Series') && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 md:p-8 bg-gradient-to-r from-[#0B1A2A] via-[#0f253d] to-[#0B1A2A] rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#0682E4]/40">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-block px-3 py-1 rounded-full bg-[#0682E4]/30 text-[#0682E4] font-extrabold text-xs uppercase tracking-wider border border-[#0682E4]/40">Heavy Weight Ortho Support</div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">BONDED SERIES</h3>
                <p className="text-white/80 text-sm md:text-base max-w-xl">Best Mattress for People Above 80 kg with strong, durable, long-lasting spinal support and zero sagging.</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center shrink-0">
                <span className="px-3 py-1.5 bg-[#0682E4]/20 text-white rounded-xl text-xs font-bold border border-[#0682E4]/30">✔️ Strong Support</span>
                <span className="px-3 py-1.5 bg-[#0682E4]/20 text-white rounded-xl text-xs font-bold border border-[#0682E4]/30">✔️ 80kg+ Support</span>
                <span className="px-3 py-1.5 bg-[#0682E4]/20 text-white rounded-xl text-xs font-bold border border-[#0682E4]/30">✔️ Ortho Alignment</span>
              </div>
            </motion.div>
          )}

          {selectedTypes.includes('Luxury HR Series') && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 md:p-8 bg-gradient-to-r from-[#0f172a] via-[#1a2f1c] to-[#0f172a] rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#6CB50E]/40">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-block px-3 py-1 rounded-full bg-[#6CB50E]/30 text-[#6CB50E] font-extrabold text-xs uppercase tracking-wider border border-[#6CB50E]/40">Showroom Flagship Collection</div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">LUXURY HR SERIES</h3>
                <p className="text-white/80 text-sm md:text-base max-w-xl">Experience Luxury. Choose Your Comfort. Crafted with premium high resilience foam, natural latex, and independent pocket springs.</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center shrink-0">
                <span className="px-3 py-1.5 bg-[#6CB50E]/20 text-white rounded-xl text-xs font-bold border border-[#6CB50E]/30">✨ HR Foam</span>
                <span className="px-3 py-1.5 bg-[#6CB50E]/20 text-white rounded-xl text-xs font-bold border border-[#6CB50E]/30">✨ Memory Foam</span>
                <span className="px-3 py-1.5 bg-[#6CB50E]/20 text-white rounded-xl text-xs font-bold border border-[#6CB50E]/30">✨ Natural Latex</span>
                <span className="px-3 py-1.5 bg-[#6CB50E]/20 text-white rounded-xl text-xs font-bold border border-[#6CB50E]/30">✨ Pocket Spring</span>
              </div>
            </motion.div>
          )}

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
                    <button 
                      onClick={(e) => toggleWishlist(product, e)}
                      className={`absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all transform active:scale-90 ${
                        wishlist.includes(product.slug) ? 'text-red-500' : 'text-[#64748b] hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(product.slug) ? 'fill-red-500 text-red-500' : ''}`} strokeWidth={2.5} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow flex flex-col px-2 pb-2">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="font-heading font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#0682E4] to-[#7cb93e] leading-tight group-hover:scale-[1.02] transition-transform origin-left">{product.title}</h3>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#64748b] block mb-0.5">From</span>
                        <div className="flex items-baseline justify-end gap-1.5">
                          {product.originalPrice && (
                            <span className="text-xs font-semibold text-gray-400 line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="text-xl font-black text-[#0B1A2A]">{product.price}</span>
                        </div>
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
                        {product.warranty || 10}-Year Warranty
                      </div>
                    </div>
                    
                    <Link href={`/product/${product.slug}`} className="mt-auto block">
                      <Button className="w-full bg-[#0682E4] hover:bg-[#7cb93e] text-white rounded-xl py-6 font-bold text-[15px] shadow-[0_4px_14px_0_rgba(6,130,228,0.25)] hover:shadow-[0_6px_20px_rgba(124,185,62,0.3)] transition-all duration-300 relative overflow-hidden group/btn">
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

export function ProductListing() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500 font-bold text-lg">Loading collection...</div>}>
      <ProductListingContent />
    </Suspense>
  );
}

