"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, ShieldCheck, Phone, Check } from 'lucide-react';

interface OfferData {
  title: string;
  discountPercentage: number;
  couponCode: string;
  buttonText: string;
  linkUrl: string;
  isActive: boolean;
}

const DEFAULT_OFFER: OfferData = {
  title: 'Ortho Collection',
  discountPercentage: 50,
  couponCode: 'DRWELL50',
  buttonText: 'Shop Collection',
  linkUrl: '/collections',
  isActive: true,
};

// 3-ray celebration spark rays matching image 1
function SparkRays() {
  return (
    <svg width="15" height="12" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 -mt-0.5">
      <line x1="2.5" y1="12" x2="5.5" y2="3" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="9" y1="13" x2="9" y2="1.5" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="15.5" y1="12" x2="12.5" y2="3" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Exact recreation of the glowing emerald-gold capsule from Image 1
function OfferCapsule({ offer, onCopy }: { offer: OfferData; onCopy?: () => void }) {
  return (
    <div
      className="inline-flex items-center gap-2 sm:gap-3 rounded-full px-3 sm:px-4 py-1 border-2 border-[#FDE68A] transition-all hover:scale-[1.02] cursor-pointer shadow-[0_0_18px_rgba(251,191,36,0.55),0_0_35px_rgba(245,158,11,0.25)] select-none shrink-0"
      style={{
        background: 'linear-gradient(90deg, #02382C 0%, #034b3c 45%, #045242 65%, #022f24 100%)',
      }}
      onClick={onCopy}
      title={offer.couponCode ? `Coupon Code: ${offer.couponCode}` : undefined}
    >
      {/* "Flat" + Spark Rays + Yellow Discount Badge */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-white font-black italic text-xs sm:text-sm tracking-tight">Flat</span>
        <SparkRays />
        <div className="bg-gradient-to-r from-[#FDE047] via-[#FACC15] to-[#EAB308] text-neutral-950 font-black italic text-[10px] sm:text-[11px] px-2 py-0.5 rounded -rotate-2 border border-yellow-200 shadow-sm">
          {offer.discountPercentage || 50}% OFF
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="w-[1px] h-4 bg-white/30 shrink-0" />

      {/* Title */}
      <span className="text-white font-extrabold text-[11px] sm:text-xs tracking-tight whitespace-nowrap">
        {offer.title || 'Ortho Collection'}
      </span>

      {/* Golden CTA Button */}
      <Link
        href={offer.linkUrl || '/collections'}
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-gradient-to-r from-[#FDE047] via-[#FACC15] to-[#F59E0B] text-neutral-950 font-black text-[10px] sm:text-[11px] tracking-tight shadow-[0_2px_10px_rgba(245,158,11,0.4)] hover:brightness-105 transition-all shrink-0 ml-1"
      >
        <span>{offer.buttonText || 'Shop Collection'}</span>
        <ArrowRight size={11} className="stroke-[3]" />
      </Link>
    </div>
  );
}

export function TopMarqueeBar() {
  const [offer, setOffer] = useState<OfferData>(DEFAULT_OFFER);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/offers')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.offer) {
          setOffer({
            title: data.offer.title || DEFAULT_OFFER.title,
            discountPercentage: data.offer.discountPercentage ?? DEFAULT_OFFER.discountPercentage,
            couponCode: data.offer.couponCode || DEFAULT_OFFER.couponCode,
            buttonText: data.offer.buttonText || DEFAULT_OFFER.buttonText,
            linkUrl: data.offer.linkUrl || DEFAULT_OFFER.linkUrl,
            isActive: data.offer.isActive !== undefined ? data.offer.isActive : true,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleCopyCode = () => {
    if (offer.couponCode) {
      navigator.clipboard.writeText(offer.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const marqueeItems = (
    <div className="flex items-center gap-6 sm:gap-10 shrink-0 pr-6 sm:pr-10">
      {/* 1. Main Glowing Offer Capsule */}
      <OfferCapsule offer={offer} onCopy={handleCopyCode} />

      {/* Sparkle separator */}
      <span className="text-[#FDE047] text-xs font-black animate-pulse">✦</span>

      {/* 2. Second Glowing Offer Capsule */}
      <OfferCapsule offer={offer} onCopy={handleCopyCode} />

      {/* Sparkle separator */}
      <span className="text-[#FDE047] text-xs font-black animate-pulse">✦</span>

      {/* 3. Third Glowing Offer Capsule */}
      <OfferCapsule offer={offer} onCopy={handleCopyCode} />

      {/* Sparkle separator */}
      <span className="text-[#FDE047] text-xs font-black animate-pulse">✦</span>

      {/* 4. Fourth Glowing Offer Capsule */}
      <OfferCapsule offer={offer} onCopy={handleCopyCode} />

      {/* Sparkle separator */}
      <span className="text-[#FDE047] text-xs font-black animate-pulse">✦</span>
    </div>
  );

  return (
    <div
      className="relative w-full overflow-hidden z-50 border-b border-[#FDE68A]/30 py-1.5 shadow-md"
      style={{
        background: 'linear-gradient(90deg, #022018 0%, #033626 50%, #022018 100%)',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Toast popup when user clicks capsule to copy coupon code */}
      {copied && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] bg-neutral-950 text-amber-300 font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-2xl border border-amber-400 flex items-center gap-1.5 animate-bounce">
          <Check size={13} className="text-emerald-400" /> Coupon &ldquo;{offer.couponCode}&rdquo; Copied!
        </div>
      )}

      {/* Infinite Marquee Track */}
      <div className="flex w-max">
        <motion.div
          animate={{ x: isPaused ? undefined : ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 28,
          }}
          className="flex items-center shrink-0"
        >
          {marqueeItems}
          {marqueeItems}
        </motion.div>
      </div>
    </div>
  );
}
