'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';

interface MarqueeProduct {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  price: string;
  image: string;
  slug: string;
  badge?: string;
  glowColor: string;
}

const ROW_ONE_PRODUCTS: MarqueeProduct[] = [
  {
    id: 'luxoria',
    title: 'Luxoria Pocket Spring',
    subtitle: '5-Zone Zero Partner Disturbance',
    category: 'Luxury Hybrid',
    price: '₹12,960',
    image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1785309269/file_eyfbz8.png',
    slug: 'luxoria',
    badge: 'FLAGSHIP',
    glowColor: 'rgba(245, 158, 11, 0.35)',
  },
  {
    id: 'ecolatex-6',
    title: 'Eco Latex Organic',
    subtitle: '100% Pure Botanical Latex Core',
    category: 'Organic Series',
    price: '₹10,800',
    image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1785309272/file_jwuqkf.png',
    slug: 'ecolatex-6',
    badge: '100% NATURAL',
    glowColor: 'rgba(16, 185, 129, 0.35)',
  },
  {
    id: 'memory-dump-10',
    title: 'Memory Dump Cryo-Gel',
    subtitle: 'NASA Space-Age Cooling Foam',
    category: 'Cooling Tech',
    price: '₹21,600',
    image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1785309267/file_wzfsp5.png',
    slug: 'memory-dump-10',
    badge: '4°C COOLER',
    glowColor: 'rgba(6, 182, 212, 0.35)',
  },
  {
    id: 'mona-softy',
    title: 'Mona Softy Cloud',
    subtitle: 'Plush Ergonomic Cushion Layer',
    category: 'Comfort Series',
    price: '₹9,504',
    image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1785309266/file_sikimv.png',
    slug: 'mona-softy',
    badge: 'BESTSELLER',
    glowColor: 'rgba(168, 85, 247, 0.35)',
  },
  {
    id: 'lax-o-bond-6',
    title: 'Lax-o-Bond Medical Ortho',
    subtitle: 'High-Density 80D Spine Alignment',
    category: 'Doctor Recommended',
    price: '₹14,580',
    image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1785309262/file_nr0lxc.png',
    slug: 'lax-o-bond-6',
    badge: 'ORTHOPAEDIC',
    glowColor: 'rgba(59, 130, 246, 0.35)',
  },
  {
    id: 'luxoria-latex',
    title: 'Luxoria Latex Grand',
    subtitle: 'Pocket Spring & Natural Latex Fusion',
    category: 'Ultra Luxury',
    price: '₹21,870',
    image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1785309241/file_wdvv4q.png',
    slug: 'luxoria-latex',
    badge: 'PREMIUM',
    glowColor: 'rgba(234, 179, 8, 0.35)',
  },
];

const ROW_TWO_PRODUCTS: MarqueeProduct[] = [
  {
    id: 'natural-latex-6',
    title: 'Natural Latex Pin-Core',
    subtitle: 'Continuous Airflow Micro-Vents',
    category: 'Latex Series',
    price: '₹19,260',
    image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1785309265/file_ivsmr0.png',
    slug: 'natural-latex',
    badge: 'HYPOALLERGENIC',
    glowColor: 'rgba(16, 185, 129, 0.35)',
  },
  {
    id: 'memory-bond-plus',
    title: 'Memory Bond Plus',
    subtitle: 'Memory Foam + Rebonded Spine Core',
    category: 'Dual Comfort',
    price: '₹18,810',
    image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1785309254/file_p5umkd.png',
    slug: 'memory-bond-plus',
    badge: 'DUAL CORE',
    glowColor: 'rgba(6, 130, 228, 0.35)',
  },
  {
    id: 'softy-bond-plus',
    title: 'Softy Bond Pro',
    subtitle: 'Zero Sinking Orthopaedic Base',
    category: 'Bonded Series',
    price: '₹14,166',
    image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1785309250/file_tiitcm.png',
    slug: 'softy-bond-plus',
    badge: 'DURABLE',
    glowColor: 'rgba(108, 181, 14, 0.35)',
  },
  {
    id: 'mona-lite-6',
    title: 'Mona Lite Active',
    subtitle: 'Everyday Back Support & Breathable',
    category: 'Budget Series',
    price: '₹7,938',
    image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1785309237/file_uepcd2.png',
    slug: 'mona-lite-6',
    badge: 'POPULAR',
    glowColor: 'rgba(147, 51, 234, 0.35)',
  },
  {
    id: 'ecolatex-8',
    title: 'Eco Latex 8" Royal',
    subtitle: 'Deep Natural Latex Suspension',
    category: 'Organic Series',
    price: '₹19,008',
    image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1785309270/file_ljyz2d.png',
    slug: 'ecolatex-8',
    badge: '8-INCH DEEP',
    glowColor: 'rgba(16, 185, 129, 0.35)',
  },
  {
    id: 'memory-dump-8',
    title: 'Memory Dump Ortho Pro',
    subtitle: 'Targeted Pressure Equalizing Core',
    category: 'Cooling Tech',
    price: '₹15,840',
    image: 'https://res.cloudinary.com/m1dy2af4/image/upload/v1785309278/file_gvsmkx.png',
    slug: 'memory-dump-8',
    badge: 'SPINE RELIEF',
    glowColor: 'rgba(14, 165, 233, 0.35)',
  },
];

function ProductCard({ product }: { product: MarqueeProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative w-[320px] sm:w-[380px] md:w-[410px] rounded-2xl bg-white border border-slate-200/90 hover:border-[#0682E4]/50 overflow-hidden shrink-0 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_36px_rgba(6,130,228,0.15)] hover:-translate-y-1.5 flex flex-col select-none"
    >
      {/* Full Mattress Image Container - No badges blocking */}
      <div className="relative w-full aspect-[1.42/1] bg-white p-2 sm:p-2.5 overflow-hidden flex items-center justify-center">
        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 320px, 410px"
            className="object-contain"
          />
        </div>
      </div>

      {/* Bottom Footer Row: Title, Price & Direct Link */}
      <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <h4 className="font-heading font-bold text-[#0B1A2A] text-sm sm:text-base leading-snug group-hover:text-[#0682E4] transition-colors truncate">
            {product.title}
          </h4>
          <p className="text-[11px] text-slate-500 truncate">
            {product.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs sm:text-sm font-black text-[#6CB50E]">
            {product.price}
          </span>
          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#0682E4] text-slate-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ProductMarqueeShowcase() {
  return (
    <section className="relative w-full py-20 sm:py-24 bg-white border-y border-slate-100 overflow-hidden select-none z-20">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#0682E4]/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#6CB50E]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Decorative Subtle Radial Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(#0B1A2A 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />

      {/* Minimal Header */}
      <div className="container mx-auto px-4 max-w-4xl text-center mb-12 sm:mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 backdrop-blur-md text-[#0682E4] text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#0682E4] animate-pulse" />
          OUR MATTRESS RUNWAY
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black tracking-tight text-[#0B1A2A] mb-3">
          Discover The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0682E4] via-[#0B1A2A] to-[#6CB50E]">Dr. Well Care Collection</span>
        </h2>

        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
          Hover to pause and inspect any mattress. Tap to view specifications, size options, and doctor-certified comfort ratings.
        </p>
      </div>

      {/* ── DUAL-TRACK OPPOSITE INFINITE MARQUEE RUNWAY ── */}
      <div className="relative w-full flex flex-col gap-6 sm:gap-7 overflow-hidden">
        
        {/* Soft Fade Edges on Left and Right for Seamless Infinite Illusion */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-40 bg-gradient-to-r from-white via-white/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-40 bg-gradient-to-l from-white via-white/80 to-transparent z-20" />

        {/* TRACK 1: Flows to the Left */}
        <div className="anim-marquee-left flex items-center gap-5 sm:gap-6">
          {[...ROW_ONE_PRODUCTS, ...ROW_ONE_PRODUCTS].map((product, idx) => (
            <ProductCard key={`row1-${product.id}-${idx}`} product={product} />
          ))}
        </div>

        {/* TRACK 2: Flows to the Right (Opposite Direction for Dynamic Contrast) */}
        <div className="anim-marquee-right flex items-center gap-5 sm:gap-6">
          {[...ROW_TWO_PRODUCTS, ...ROW_TWO_PRODUCTS].map((product, idx) => (
            <ProductCard key={`row2-${product.id}-${idx}`} product={product} />
          ))}
        </div>

      </div>

      {/* Bottom Minimal Trust Bar */}
      <div className="container mx-auto px-4 max-w-3xl mt-12 sm:mt-14 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0682E4]" />
            100-Night Risk-Free Sleep Trial
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6CB50E]" />
            10-Year Comprehensive Warranty
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Free Doorstep Delivery in Tamil Nadu
          </div>
        </div>
      </div>

    </section>
  );
}
