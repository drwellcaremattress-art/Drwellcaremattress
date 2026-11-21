"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Zap, Cloud, Wind, Layers } from 'lucide-react';

export function LuxuryHRSeriesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="bg-gradient-to-br from-[#0a1f0a] via-[#132a13] to-[#0d1f0d] rounded-[2rem] text-white shadow-2xl border border-[#6CB50E]/20 relative overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-[#6CB50E]/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#6CB50E]/8 rounded-full blur-[100px] pointer-events-none" />
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* TOP SECTION - Title + Mattress Hero */}
      <div className="grid lg:grid-cols-12 relative z-10">
        {/* Left - Text content */}
        <div className="lg:col-span-5 p-8 md:p-10 lg:p-12 xl:p-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#6CB50E]/15 text-[#6CB50E] font-bold text-[11px] tracking-[0.15em] uppercase border border-[#6CB50E]/30 mb-6">
            <Sparkles className="w-4 h-4" />
            Showroom Flagship Collection
          </div>

          {/* Title */}
          <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-5">
            LUXURY<br />HR SERIES
          </h2>

          {/* Subtitle */}
          <h3 className="text-lg sm:text-xl font-bold text-[#6CB50E] italic mb-4">
            Experience Luxury. Choose Your Comfort.
          </h3>

          {/* Description */}
          <p className="text-white/60 text-sm sm:text-[15px] leading-relaxed font-body max-w-md">
            Crafted with premium materials to deliver exceptional comfort, superior support, and long-lasting durability. Available in four specialized high-resilience comfort variants designed for discerning sleepers.
          </p>
        </div>

        {/* Right - Mattress Hero Image */}
        <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[420px]">
          {/* Mattress image */}
          <div className="absolute inset-0 z-10">
            <Image src="/images/luxury_hr_mattress.png" alt="Luxury HR Series Mattress" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover lg:object-contain object-center" />
          </div>

          {/* 10 Year Warranty Badge - top right */}
          <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-20 w-20 h-20 sm:w-24 sm:h-24">
            <Image src="/images/warranty_badge.png" alt="10 Year Premium Build Warranty" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-contain drop-shadow-[0_4px_15px_rgba(245,158,11,0.4)]" />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION - 4 Variant Cards */}
      <div className="px-6 sm:px-8 lg:px-12 pb-8 lg:pb-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
          {[
            {
              title: "HR Foam",
              subtitle: "HIGH RESILIENCE SUPPORT",
              desc: "Instant bounce-back elasticity that prevents body impressions and keeps spinal posture natural.",
              icon: <Zap className="w-5 h-5" />,
              image: "/images/hr_foam_texture.png"
            },
            {
              title: "Memory Foam",
              subtitle: "ZERO PRESSURE RELIEF",
              desc: "Adapts precisely to your body contours, melting away joint pain and tension.",
              icon: <Cloud className="w-5 h-5" />,
              image: "/images/memory_foam_texture.png"
            },
            {
              title: "Natural Latex",
              subtitle: "100% ORGANIC & COOL",
              desc: "Eco-friendly, naturally hypoallergenic, and pin-core ventilated for cool tropical sleeping.",
              icon: <Wind className="w-5 h-5" />,
              image: "/images/natural_latex_texture.png"
            },
            {
              title: "Pocket Spring",
              subtitle: "ZERO PARTNER DISTURBANCE",
              desc: "Independently encased steel coils that isolate motion and provide luxury hotel buoyancy.",
              icon: <Layers className="w-5 h-5" />,
              image: "/images/pocket_spring_texture.png"
            },
          ].map((variant, idx) => (
            <Link key={idx} href="/collections?type=Luxury+HR+Series" className="block group">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white/[0.04] rounded-2xl border border-[#6CB50E]/15 hover:border-[#6CB50E]/40 overflow-hidden backdrop-blur-sm shadow-lg transition-colors h-full flex flex-col cursor-pointer"
              >
                {/* Material texture image */}
                <div className="relative h-32 sm:h-36 w-full overflow-hidden">
                  <Image src={variant.image} alt={variant.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  {/* Icon overlay */}
                  <div className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-[#0a1f0a]/80 backdrop-blur-sm flex items-center justify-center text-[#6CB50E] border border-[#6CB50E]/30">
                    {variant.icon}
                  </div>
                </div>

                {/* Card content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="font-heading font-extrabold text-lg sm:text-xl text-white mb-0.5">{variant.title}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#6CB50E] mb-2">{variant.subtitle}</p>
                  <p className="text-[12px] text-white/55 leading-relaxed flex-grow">{variant.desc}</p>
                  <div className="pt-3 mt-3 border-t border-white/8 flex items-center justify-between text-[11px] font-bold text-white/80">
                    <span>Premium Build</span>
                    <span className="text-[#6CB50E]">10-Yr Warranty →</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/collections?type=Luxury+HR+Series#series-products" className="inline-block w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-10 bg-[#6CB50E] hover:bg-[#5da00c] text-white font-bold py-5 rounded-xl text-[15px] transition-all shadow-[0_8px_25px_-5px_rgba(108,181,14,0.5)] hover:shadow-[0_12px_30px_-5px_rgba(108,181,14,0.6)] flex items-center justify-center gap-3 group mx-auto">
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z" /><path d="M19 19H5a1 1 0 010-2h14a1 1 0 010 2z" /></svg>
              View Luxury HR Series Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
