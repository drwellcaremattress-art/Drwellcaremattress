"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface FestivalSaleBadgeProps {
  title?: string;
  discountPercentage?: number;
  couponCode?: string;
  subtitle?: string;
  className?: string;
}

// 3 Traditional Clay Oil Lamps (Diyas) with glowing flickering flames
function TraditionalDiyas() {
  return (
    <div className="flex items-end justify-center gap-1.5 -mt-3.5 relative z-10 pointer-events-none">
      {/* Left Small Diya */}
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-1.5 h-3 bg-gradient-to-t from-amber-500 via-yellow-300 to-white rounded-full shadow-[0_0_8px_rgba(251,191,36,0.9)] -mb-1"
        />
        <svg width="22" height="12" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="7" rx="11" ry="6" fill="#B45309" stroke="#78350F" strokeWidth="1" />
          <ellipse cx="12" cy="6" rx="9" ry="3.5" fill="#D97706" />
          <ellipse cx="12" cy="5" rx="7" ry="2" fill="#F59E0B" />
        </svg>
      </div>

      {/* Center Main Diya */}
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className="w-2.5 h-4 bg-gradient-to-t from-amber-500 via-yellow-200 to-white rounded-full shadow-[0_0_12px_rgba(251,191,36,1)] -mb-1"
        />
        <svg width="30" height="15" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="16" cy="8" rx="15" ry="7.5" fill="#B45309" stroke="#78350F" strokeWidth="1" />
          <ellipse cx="16" cy="7" rx="12" ry="4.5" fill="#D97706" />
          <ellipse cx="16" cy="6" rx="9" ry="2.5" fill="#FBBF24" />
        </svg>
      </div>

      {/* Right Small Diya */}
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
          className="w-1.5 h-3 bg-gradient-to-t from-amber-500 via-yellow-300 to-white rounded-full shadow-[0_0_8px_rgba(251,191,36,0.9)] -mb-1"
        />
        <svg width="22" height="12" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="7" rx="11" ry="6" fill="#B45309" stroke="#78350F" strokeWidth="1" />
          <ellipse cx="12" cy="6" rx="9" ry="3.5" fill="#D97706" />
          <ellipse cx="12" cy="5" rx="7" ry="2" fill="#F59E0B" />
        </svg>
      </div>
    </div>
  );
}

// 24-point Scalloped Golden Sunburst Path
function SunburstFrame() {
  const points = 24;
  const outerR = 98;
  const innerR = 86;
  const cx = 100;
  const cy = 100;
  let d = '';

  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += (i === 0 ? 'M' : 'L') + ` ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  d += 'Z';

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0 drop-shadow-[0_4px_16px_rgba(245,158,11,0.55)]">
      <defs>
        <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="85%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
      </defs>
      <path d={d} fill="url(#goldGradient)" stroke="#FDE68A" strokeWidth="1.5" />
    </svg>
  );
}

export function FestivalSaleBadge({
  title = 'BIG Festival SALE',
  discountPercentage = 25,
  couponCode = 'FESTIVAL25',
  subtitle,
  className = '',
}: FestivalSaleBadgeProps) {
  // Parse dynamic title intelligently into top prefix, middle serif, and bottom main text
  const words = (title || 'BIG Festival SALE').trim().split(/\s+/);
  let topTag = '— BIG —';
  let middleText = 'Festival';
  let bottomText = 'SALE';

  if (words.length === 1) {
    topTag = '';
    middleText = '';
    bottomText = words[0].toUpperCase();
  } else if (words.length === 2) {
    topTag = `— ${words[0].toUpperCase()} —`;
    middleText = '';
    bottomText = words[1].toUpperCase();
  } else if (words.length >= 3) {
    topTag = `— ${words[0].toUpperCase()} —`;
    middleText = words.slice(1, -1).join(' ');
    bottomText = words[words.length - 1].toUpperCase();
  }

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Ambient festival sparkles */}
      <div className="absolute -top-3 -right-3 text-amber-300 text-xs animate-ping pointer-events-none">✦</div>
      <div className="absolute -top-1 -left-2 text-yellow-300 text-[10px] animate-pulse pointer-events-none">✦</div>

      {/* Main Circular Seal Container */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
        {/* Golden Sunburst Scalloped Outer Edge */}
        <SunburstFrame />

        {/* Inner Ivory / Cream Medallion */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-[#FFFDF2] via-[#FFFBEB] to-[#FEF3C7] border-2 border-amber-300 shadow-[inset_0_2px_8px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center p-1.5 sm:p-2 text-center z-10 overflow-hidden">
          
          {/* Top Tag: e.g. "— BIG —" */}
          {topTag && (
            <div className="text-[8px] sm:text-[10px] font-black tracking-widest text-[#991B1B] uppercase leading-none mb-0.5 max-w-[80px] sm:max-w-[90px] truncate">
              {topTag}
            </div>
          )}

          {/* Middle: e.g. "Festival" in elegant serif font */}
          {middleText && (
            <div className="font-serif italic text-xs sm:text-base font-bold text-[#B91C1C] leading-tight max-w-[85px] sm:max-w-[95px] truncate">
              {middleText}
            </div>
          )}

          {/* Bottom: e.g. "SALE" in extra-bold dark red */}
          <div className="text-base sm:text-xl font-black text-[#7F1D1D] tracking-tight leading-none mb-0.5 sm:mb-1 max-w-[85px] sm:max-w-[95px] truncate">
            {bottomText}
          </div>

          {/* Dynamic 25% OFF Badge Pill */}
          <div className="bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#991B1B] text-white text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full shadow-md border border-amber-200 tracking-wider uppercase shrink-0">
            FLAT {discountPercentage}% OFF
          </div>
        </div>
      </div>

      {/* Bottom Glowing Traditional Diyas */}
      <TraditionalDiyas />

      {/* Coupon pill beneath diyas */}
      {couponCode && (
        <div className="mt-1 bg-amber-950/80 backdrop-blur-sm border border-amber-400/40 text-amber-200 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
          CODE: <span className="text-white font-mono">{couponCode}</span>
        </div>
      )}
    </div>
  );
}
