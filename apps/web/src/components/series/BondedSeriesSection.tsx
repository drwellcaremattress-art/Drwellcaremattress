"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Heart, 
  Layers, 
  Zap, 
  Star, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

export function BondedSeriesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="bg-gradient-to-br from-[#040d1a] via-[#0a1929] to-[#0d2240] rounded-[2rem] text-white shadow-2xl border border-[#0682E4]/20 relative overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#0682E4]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[20%] w-[400px] h-[400px] bg-[#0682E4]/6 rounded-full blur-[100px] pointer-events-none" />
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="grid lg:grid-cols-12 relative z-10 min-h-[580px]">
        {/* LEFT COLUMN - Content + Exact Graphic Image */}
        <div className="lg:col-span-7 p-6 md:p-8 lg:p-10 relative flex flex-col justify-between overflow-hidden">
          {/* Background Artwork - Exact User Image */}
          <div className="absolute inset-0 z-0">
            <Image src="/images/bonded_section_main.png"
              alt="Bonded Series Orthopaedic Support"
              fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-left"
              priority
            />
            {/* Subtle dark gradient overlay on left for sharp text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#040d1a]/90 via-[#040d1a]/60 to-transparent pointer-events-none" />
          </div>

          {/* Top Text Content */}
          <div className="relative z-10 max-w-lg space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0682E4]/20 text-white font-bold text-[10px] tracking-[0.15em] uppercase border border-[#0682E4]/40 backdrop-blur-md shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0682E4]" />
              Heavy Weight Ortho Support
            </div>

            {/* Title */}
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight drop-shadow-md">
              BONDED<br />SERIES
            </h2>

            {/* Subtitle */}
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#0682E4] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <h3 className="text-base sm:text-lg font-bold text-[#0682E4]">
                Best Mattress for People Above 80 kg
              </h3>
            </div>

            {/* Description */}
            <p className="text-white/80 text-[13px] sm:text-sm leading-relaxed font-body max-w-md drop-shadow-sm">
              Engineered with High-Density Bonded Foam, the Bonded Series is specially designed for individuals weighing above 80 kg, providing unmatched spinal support and preventing mattress sagging.
            </p>
          </div>

          {/* Middle/Bottom Features & Trust Bar */}
          <div className="relative z-10 space-y-6 pt-6 mt-6">
            {/* Feature icons */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 max-w-lg">
              {[
                { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, label: "Strong &\nDurable Support" },
                { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>, label: "Excellent Weight\nDistribution" },
                { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>, label: "Orthopaedic\nBack Support" },
                { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: "Long-Lasting\nComfort" },
                { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, label: "Ideal for Heavy\nWeight Sleepers" },
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-black/20 backdrop-blur-md p-2 rounded-xl border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-[#0682E4]/25 flex items-center justify-center text-[#0682E4] shrink-0 border border-[#0682E4]/40">
                    {feat.icon}
                  </div>
                  <span className="text-[11px] font-bold text-white leading-tight whitespace-pre-line">{feat.label}</span>
                </div>
              ))}
            </div>

            {/* Bottom trust bar */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/15">
              {[
                { icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: "Engineered\nfor Durability" },
                { icon: <Award className="w-3.5 h-3.5" />, text: "Premium\nQuality Foam" },
                { icon: <Heart className="w-3.5 h-3.5" />, text: "Trusted by\nThousands" },
                { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: "Warranty\nAssured" },
              ].map((trust, i) => (
                <div key={i} className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-[#0682E4]/25 flex items-center justify-center text-[#0682E4] shrink-0 border border-[#0682E4]/40">
                    {trust.icon}
                  </div>
                  <span className="text-[10px] font-bold text-white/90 leading-tight whitespace-pre-line">{trust.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Featured Products sidebar */}
        <div className="lg:col-span-5 bg-white/[0.04] backdrop-blur-md p-6 sm:p-8 lg:border-l border-white/10 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <span className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#0682E4]" />
              Featured Products
            </span>
            <span className="text-[10px] bg-[#0682E4] text-white font-black px-3 py-1 rounded-md uppercase tracking-wider">5 Models</span>
          </div>

          {/* Product cards */}
          <div className="space-y-3 flex-grow">
            {[
              { name: "Softy Bond (6\" & 8\")", desc: "Soft Comfort Layer\nover Ortho Bond", tag: "NEW", tagBorder: "border-[#22c55e]", tagText: "text-[#22c55e]", tagIcon: <Zap className="w-3.5 h-3.5" />, image: "/images/products/softy-bond-6.jpeg", slug: "softy-bond" },
              { name: "Softy Bond Plus", desc: "Deep Plush Cushioning &\nFirm Spine Alignment", tag: "EXCLUSIVE", tagBorder: "border-[#f59e0b]", tagText: "text-[#f59e0b]", tagIcon: <ShieldCheck className="w-3.5 h-3.5" />, image: "/images/products/softy-bond-plus-8.jpeg", slug: "softy-bond" },
              { name: "Memory Bond", desc: "Bonded Foam with\nPlush Memory Top", tag: "POPULAR", tagBorder: "border-[#3b82f6]", tagText: "text-[#3b82f6]", tagIcon: <Star className="w-3.5 h-3.5" />, image: "/images/products/memory-bond-6.jpeg", slug: "memory-bond" },
              { name: "Memory Bond Plus", desc: "Enhanced Memory Contour\n& Bonded Core", tag: "PREMIUM", tagBorder: "border-[#22c55e]", tagText: "text-[#22c55e]", tagIcon: <Sparkles className="w-3.5 h-3.5" />, image: "/images/products/memory-bond-plus-8.jpeg", slug: "memory-bond" },
              { name: "Lax-o-Bond (6\" & 8\")", desc: "Flagship Bonded\nOrthopaedic Support", tag: "BEST SELLER", tagBorder: "border-[#f59e0b]", tagText: "text-[#f59e0b]", tagIcon: <Award className="w-3.5 h-3.5" />, image: "/images/products/lax-o-bond-6.jpeg", slug: "lax-o-bond" },
            ].map((prod, idx) => (
              <Link key={idx} href={`/product/${prod.slug}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.06] hover:border-[#0682E4]/30 transition-all cursor-pointer group">
                {/* Product thumbnail */}
                <div className="w-16 h-14 rounded-lg overflow-hidden bg-white/5 shrink-0 relative border border-white/10">
                  <Image src={prod.image} alt={prod.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                </div>
                {/* Product info */}
                <div className="flex-grow min-w-0">
                  <h4 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0682E4] to-[#7cb93e] text-[15px] group-hover:from-white group-hover:to-[#7cb93e] transition-all leading-tight">{prod.name}</h4>
                  <p className="text-[11px] text-white/50 leading-tight mt-0.5 whitespace-pre-line">{prod.desc}</p>
                </div>
                {/* Tag badge - dark bg with colored border & text */}
                <div className={`bg-[#0a1525]/80 rounded-xl p-2 flex flex-col items-center justify-center shrink-0 min-w-[65px] border ${prod.tagBorder}/40`}>
                  <div className={`${prod.tagText} mb-1`}>{prod.tagIcon}</div>
                  <span className={`text-[8px] font-bold ${prod.tagText} uppercase tracking-wider text-center leading-tight`}>{prod.tag}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link href="/collections?type=Bonded+Series#series-products" className="block mt-5">
            <Button className="w-full bg-[#0682E4] hover:bg-[#0570c7] text-white font-bold py-5 rounded-xl text-[15px] transition-all shadow-[0_8px_25px_-5px_rgba(6,130,228,0.5)] hover:shadow-[0_12px_30px_-5px_rgba(6,130,228,0.6)] flex items-center justify-center gap-2 group">
              View Bonded Series Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
