'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export interface OfferData {
  _id?: string;
  title: string;
  subtitle?: string;
  couponCode: string;
  discountPercentage: number;
  buttonText: string;
  linkUrl: string;
  isActive: boolean;
  // Kept for backward compatibility if stored in DB
  tag?: string;
  badgeText?: string;
  rating?: number;
  reviewsCount?: string;
  theme?: string;
  cardLayout?: string;

  // Hero Section Customization
  festiveCardImage?: string;
  festiveBadgeTitle?: string;
  festiveDiscount?: number;
  festiveCouponCode?: string;
  festiveLinkUrl?: string;

  mainBannerImage?: string;
  mainBannerLink?: string;
  mainBannerSlides?: { image: string; alt?: string; link?: string }[];

  showcaseCardImage?: string;
  showcaseCardVideoUrl?: string;
  showcaseCardTitle?: string;
  showcaseCardBrand?: string;
  showcaseCardLinkUrl?: string;
}

// Crisp 3-ray celebration sunburst (matching image exactly)
function SparkRays({ className = '' }: { className?: string }) {
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 -mt-1 ml-0.5 ${className}`}
    >
      <line x1="2.5" y1="12" x2="5.5" y2="3" stroke="#FDE047" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="9" y1="13" x2="9" y2="1.5" stroke="#FDE047" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="15.5" y1="12" x2="12.5" y2="3" stroke="#FDE047" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export default function HeroOfferDisplay3D({
  initialOffer,
  previewMode = false,
}: {
  initialOffer?: Partial<OfferData>;
  previewMode?: boolean;
}) {
  const [offer, setOffer] = useState<OfferData>({
    title: initialOffer?.title || 'Ortho Collection',
    subtitle: initialOffer?.subtitle || '',
    couponCode: initialOffer?.couponCode || 'DRWELL35',
    discountPercentage: initialOffer?.discountPercentage ?? 35,
    buttonText: initialOffer?.buttonText || 'Shop Now',
    linkUrl: initialOffer?.linkUrl || '/collections',
    isActive: initialOffer?.isActive !== undefined ? initialOffer.isActive : true,
  });

  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Sync state if initialOffer prop changes (from Admin live preview)
  useEffect(() => {
    if (initialOffer) {
      setOffer((prev) => ({ ...prev, ...initialOffer }));
    }
  }, [initialOffer]);

  // Client fetch live offer if not in preview mode and no initialOffer passed
  useEffect(() => {
    if (!previewMode && !initialOffer?._id) {
      fetch('/api/offers')
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data.offer) {
            setOffer(data.offer);
          }
        })
        .catch((err) => console.error('Failed to load live offer:', err));
    }
  }, [previewMode, initialOffer?._id]);

  // Gentle 3D tilt tracking mouse
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 220, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (offer.couponCode) {
      navigator.clipboard.writeText(offer.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  if (!offer.isActive && !previewMode) {
    return null;
  }

  // Parse title into two words (e.g. "Ortho" and "Collection")
  const titleParts = (offer.title || 'Ortho Collection').trim().split(/\s+/);
  const mainWord = titleParts[0] || 'Ortho';
  const secondWord = titleParts.slice(1).join(' ') || 'Collection';

  return (
    <div
      className={`select-none ${previewMode ? 'w-full max-w-[540px] mx-auto' : 'w-full max-w-[520px]'}`}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <motion.div
          animate={previewMode ? {} : { y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        >
          {/* ── Capsule Container matching user image exactly ── */}
          <div
            className="relative rounded-full px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#FDE68A] flex items-center justify-between gap-2.5 sm:gap-5 transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #02382C 0%, #034b3c 45%, #045242 65%, #022f24 100%)',
              boxShadow:
                '0 0 25px 3px rgba(251, 191, 36, 0.75), 0 0 50px 6px rgba(245, 158, 11, 0.35), 0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Left Group: "Flat" + 3 Spark Rays + Yellow 35% OFF Badge */}
            <div
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 sm:gap-2 relative select-none cursor-pointer group/badge shrink-0"
              title={`Click to copy coupon code: ${offer.couponCode || 'DRWELL35'}`}
            >
              <div className="flex items-center gap-1 pl-0.5">
                <span className="text-white font-black italic text-base sm:text-lg leading-none tracking-tight">
                  Flat
                </span>
                <SparkRays />
              </div>

              <div className="bg-gradient-to-r from-[#FDE047] via-[#FACC15] to-[#EAB308] text-neutral-950 font-black italic text-xs sm:text-sm px-3 sm:px-3.5 py-1 rounded-lg -rotate-2 border border-yellow-200 shadow-[0_3px_10px_rgba(0,0,0,0.35)] transition-transform group-hover/badge:scale-105">
                {offer.discountPercentage || 35}% OFF
              </div>

              <AnimatePresence>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.8 }}
                    animate={{ opacity: 1, y: -26, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.8 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-950 text-amber-300 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-lg pointer-events-none whitespace-nowrap flex items-center gap-1 border border-amber-400 z-30"
                  >
                    <Check size={10} /> Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Vertical Hairline Divider */}
            <div className="w-[1px] h-7 sm:h-8 bg-white/25 shrink-0 self-center" />

            {/* Middle Group: Stacked "Ortho Collection" in Crisp White */}
            <div className="flex flex-col justify-center leading-tight shrink-0 text-left">
              <span className="text-white font-black text-xs sm:text-sm tracking-tight">
                {mainWord}
              </span>
              <span className="text-white font-black text-xs sm:text-sm tracking-tight">
                {secondWord}
              </span>
            </div>

            {/* Right Group: Golden Pill CTA Button: "Shop Now →" */}
            <Link
              href={offer.linkUrl || '/collections'}
              className="ml-auto inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#FDE047] via-[#FACC15] to-[#F59E0B] text-neutral-950 font-black text-xs sm:text-sm tracking-tight shadow-[0_4px_16px_rgba(245,158,11,0.5)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.7)] hover:scale-105 active:scale-95 transition-all group shrink-0"
            >
              <span>{offer.buttonText || 'Shop Now'}</span>
              <ArrowRight
                size={14}
                className="stroke-[3] group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
