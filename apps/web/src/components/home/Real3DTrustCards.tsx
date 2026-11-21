'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cloud, ShieldCheck } from 'lucide-react';

interface TrustCardData {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  colorName: 'blue' | 'green' | 'amber' | 'purple';
  gradientLeft: string;
  glowShadow: string;
  icon: React.ReactNode;
}

// 1. Stylized 3D Spine Vertebrae Icon (Matching reference image)
function SpineIcon() {
  return (
    <svg viewBox="0 0 32 40" fill="none" className="w-6 h-8 drop-shadow-md">
      {/* Upper Cervical vertebrae */}
      <rect x="11" y="2" width="10" height="3" rx="1.5" fill="white" />
      <rect x="9" y="6" width="14" height="3.5" rx="1.5" fill="white" />
      <rect x="8" y="10.5" width="16" height="3.5" rx="1.5" fill="white" />
      <rect x="7.5" y="15" width="17" height="3.5" rx="1.5" fill="white" />
      {/* Lumbar discs with vibrant green accents matching reference */}
      <rect x="7" y="19.5" width="18" height="4" rx="1.8" fill="#A3E635" />
      <rect x="7.5" y="24.5" width="17" height="4" rx="1.8" fill="#84CC16" />
      <rect x="8" y="29.5" width="16" height="4" rx="1.8" fill="#65A30D" />
      {/* Base Sacrum */}
      <path d="M9 34.5C9 34.5 12 38 16 38C20 38 23 34.5 23 34.5H9Z" fill="white" />
    </svg>
  );
}

// 2. Crescent Moon with "Z Z" Sleep Icon (Matching reference image)
function MoonSleepIcon() {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 drop-shadow-md">
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
          fill="rgba(255,255,255,0.25)"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Floating Z letters */}
      <div className="absolute -top-1.5 right-0 flex flex-col items-center leading-none text-white font-black">
        <span className="text-[9px] scale-90 translate-x-1">z</span>
        <span className="text-[11px] font-black tracking-tighter">z</span>
      </div>
    </div>
  );
}

const TRUST_CARDS: TrustCardData[] = [
  {
    id: 'ortho',
    title: 'Orthopaedic',
    subtitle: 'Support',
    link: '/collections?type=Bonded+Series',
    colorName: 'blue',
    gradientLeft: 'from-[#005FE8] via-[#0047C4] to-[#002F99]',
    glowShadow: 'shadow-[0_20px_35px_-8px_rgba(0,85,232,0.42),0_8px_16px_rgba(0,0,0,0.06)]',
    icon: <SpineIcon />,
  },
  {
    id: 'pressure',
    title: 'Pressure',
    subtitle: 'Relief',
    link: '/collections?type=Luxury+HR+Series',
    colorName: 'green',
    gradientLeft: 'from-[#65BA14] via-[#529E0B] to-[#3C7904]',
    glowShadow: 'shadow-[0_20px_35px_-8px_rgba(82,158,11,0.42),0_8px_16px_rgba(0,0,0,0.06)]',
    icon: (
      <Cloud className="w-7 h-7 text-white stroke-[2.4] fill-white/20 drop-shadow-md" />
    ),
  },
  {
    id: 'warranty',
    title: '10-Year',
    subtitle: 'Warranty',
    link: '/warranty',
    colorName: 'amber',
    gradientLeft: 'from-[#FFA700] via-[#EB8900] to-[#C96C00]',
    glowShadow: 'shadow-[0_20px_35px_-8px_rgba(235,137,0,0.42),0_8px_16px_rgba(0,0,0,0.06)]',
    icon: (
      <ShieldCheck className="w-7 h-7 text-white stroke-[2.4] fill-white/20 drop-shadow-md" />
    ),
  },
  {
    id: 'sleep',
    title: 'Better Sleep,',
    subtitle: 'Better Life',
    link: '/about',
    colorName: 'purple',
    gradientLeft: 'from-[#8A38F5] via-[#701ED9] to-[#540EB8]',
    glowShadow: 'shadow-[0_20px_35px_-8px_rgba(112,30,217,0.42),0_8px_16px_rgba(0,0,0,0.06)]',
    icon: <MoonSleepIcon />,
  },
];

export function Real3DTrustCards() {
  return (
    <section className="relative w-full py-8 px-3 sm:px-6 max-w-[1440px] mx-auto select-none overflow-hidden">
      {/* ── Background Wave Ribbon (Smooth 3D Green Ribbon Flowing Behind) ── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10 opacity-75">
        <svg
          viewBox="0 0 1440 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full min-w-[1000px] object-cover scale-y-110"
        >
          <path
            d="M-50 120C180 30 350 200 600 110C850 20 1080 180 1490 80"
            stroke="url(#greenRibbonGrad)"
            strokeWidth="38"
            strokeLinecap="round"
            className="blur-[1px]"
          />
          <path
            d="M-40 125C190 35 360 205 610 115C860 25 1090 185 1500 85"
            stroke="white"
            strokeWidth="3"
            strokeOpacity="0.4"
          />
          <defs>
            <linearGradient id="greenRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#84CC16" stopOpacity="0.25" />
              <stop offset="45%" stopColor="#65A30D" stopOpacity="0.55" />
              <stop offset="75%" stopColor="#4D7C0F" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#A3E635" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── 4 Real 3D Slanted Parallelogram Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-5 xl:gap-6 items-center justify-center">
        {TRUST_CARDS.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="relative group cursor-pointer"
          >
            <Link href={card.link} className="block relative">
              {/* ── CARD SHELL: Skewed Parallelogram with Deep 3D Shadow ── */}
              <div
                className={`relative flex items-stretch h-[82px] sm:h-[88px] rounded-[22px] overflow-hidden bg-white/95 backdrop-blur-md border border-white/80 ${card.glowShadow} transition-all duration-300 group-hover:shadow-2xl`}
                style={{
                  transform: 'skewX(-13deg)',
                  boxShadow: '0 16px 32px -8px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0,0,0,0.06)',
                }}
              >
                {/* ── LEFT SECTION: Glossy Color Dome Capsule ── */}
                <div
                  className={`relative w-[38%] min-w-[76px] sm:min-w-[84px] bg-gradient-to-br ${card.gradientLeft} flex items-center justify-center overflow-hidden shrink-0`}
                >
                  {/* Glass Top Rim Specular Highlight (The 3D Gloss) */}
                  <div className="absolute top-0 inset-x-0 h-[48%] bg-gradient-to-b from-white/45 via-white/15 to-transparent pointer-events-none rounded-t-xl" />
                  
                  {/* Subtle Diagonal Glass Glare */}
                  <div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
                    style={{ transform: 'rotate(25deg) scale(1.5)' }}
                  />

                  {/* Icon (Un-skewed to stay straight & upright) */}
                  <div
                    className="relative z-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ transform: 'skewX(13deg)' }}
                  >
                    {card.icon}
                  </div>

                  {/* Right divider shadow */}
                  <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-black/15 shadow-sm" />
                </div>

                {/* ── RIGHT SECTION: High-Gloss White Surface with Typography ── */}
                <div className="relative flex-1 bg-gradient-to-b from-[#ffffff] via-[#fbfcfe] to-[#f1f5f9] flex flex-col justify-center px-4 sm:px-5">
                  {/* Inner top gloss line */}
                  <div className="absolute top-0 inset-x-0 h-[1.5px] bg-white pointer-events-none" />

                  {/* Text Container (Un-skewed to maintain typography readability) */}
                  <div
                    className="flex flex-col justify-center"
                    style={{ transform: 'skewX(13deg)' }}
                  >
                    <span className="text-[14px] sm:text-[15px] xl:text-[16px] font-black text-[#0B1A2A] tracking-tight leading-[1.15]">
                      {card.title}
                    </span>
                    <span className="text-[12px] sm:text-[13px] font-bold text-[#5B6B7B] tracking-tight leading-[1.15] mt-0.5">
                      {card.subtitle}
                    </span>

                    {/* Green Accent Underline Pill (Matching Reference Image) */}
                    <div className="w-6 sm:w-7 h-[3px] rounded-full bg-[#6CB50E] mt-1.5 shadow-sm" />
                  </div>
                </div>

                {/* Subtle Interactive Surface Hover Shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
