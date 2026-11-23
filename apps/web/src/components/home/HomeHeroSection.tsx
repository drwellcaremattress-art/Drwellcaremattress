"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, X, Check, ExternalLink, ArrowRight, Flame, Volume2, VolumeX } from 'lucide-react';
import { FestivalSaleBadge } from './FestivalSaleBadge';

export interface HeroSlide {
  image: string;
  alt?: string;
  link?: string;
}

export interface LiveOfferData {
  title?: string;
  discountPercentage?: number;
  couponCode?: string;
  subtitle?: string;
  linkUrl?: string;
  isActive?: boolean;

  // Festive Card
  festiveCardImage?: string;
  festiveBadgeTitle?: string;
  festiveDiscount?: number;
  festiveCouponCode?: string;
  festiveLinkUrl?: string;

  // Main Banner Carousel
  mainBannerImage?: string;
  mainBannerLink?: string;
  mainBannerSlides?: HeroSlide[];

  // Showcase Card & Video
  showcaseCardImage?: string;
  showcaseCardVideoUrl?: string;
  showcaseCardTitle?: string;
  showcaseCardBrand?: string;
  showcaseCardLinkUrl?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    image: '/images/hero_banner_bedroom.png',
    alt: 'Enhance Your Bedroom with Orthopaedic Comfort',
    link: '/collections',
  },
  {
    image: '/images/luxury_mattress_hero.png',
    alt: 'Luxury Dr. Well Care Bedroom Collection',
    link: '/collections?type=Luxury+HR+Series',
  },
  {
    image: '/images/bonded_section_main.png',
    alt: 'Bonded Orthopaedic Support Mattress',
    link: '/collections?type=Bonded+Series',
  },
];

const DEFAULT_OFFER: LiveOfferData = {
  title: 'BIG Festival SALE',
  discountPercentage: 25,
  couponCode: 'FESTIVAL25',
  subtitle: 'Festive Special Discount',
  linkUrl: '/collections',
  isActive: true,

  festiveCardImage: '/images/hero_recliner_sale.png',
  festiveBadgeTitle: 'BIG Festival SALE',
  festiveDiscount: 25,
  festiveCouponCode: 'FESTIVAL25',
  festiveLinkUrl: '/collections',

  mainBannerSlides: DEFAULT_SLIDES,

  showcaseCardImage: '/images/hero_dining_showcase.png',
  showcaseCardVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // fallback or empty
  showcaseCardTitle: 'Denzen Marble Top Dining Set',
  showcaseCardBrand: 'DAMRO Internationally Trusted Furniture',
  showcaseCardLinkUrl: '/collections',
};

// Helper: parse YouTube or standard video embed url
function getEmbedUrl(url: string): { type: 'youtube' | 'video' | 'none'; src: string } {
  if (!url) return { type: 'none', src: '' };
  const trimmed = url.trim();

  // YouTube match
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
    };
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'youtube',
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  // Direct video file (.mp4, .webm, or uploaded URL)
  return { type: 'video', src: trimmed };
}

export function HomeHeroSection() {
  const [offer, setOffer] = useState<LiveOfferData>(DEFAULT_OFFER);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch active offer from Admin DB
  useEffect(() => {
    fetch('/api/offers')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.offer) {
          setOffer((prev) => ({
            ...prev,
            ...data.offer,
          }));
        }
      })
      .catch(() => { });
  }, []);

  const slides: HeroSlide[] =
    offer.mainBannerSlides && offer.mainBannerSlides.length > 0
      ? offer.mainBannerSlides
      : DEFAULT_SLIDES;

  // Auto carousel rotation every 5 seconds (pauses on hover)
  useEffect(() => {
    if (slides.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length, isHovered]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const code = offer.festiveCouponCode || offer.couponCode || 'FESTIVAL25';
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePlayVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (offer.showcaseCardVideoUrl) {
      setIsVideoModalOpen(true);
    } else {
      // If no video set, navigate to showcase link
      window.location.href = offer.showcaseCardLinkUrl || '/collections';
    }
  };

  const activeVideo = getEmbedUrl(offer.showcaseCardVideoUrl || '');
  const activeSlide = slides[currentSlide] || slides[0];
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    } else {
      setIsMuted((prev) => !prev);
    }
  };

  return (
    <section className="relative w-full pt-24 sm:pt-28 pb-6 px-3 sm:px-6 xl:px-8 max-w-[1720px] mx-auto select-none overflow-hidden">
      {/* ── Ambient Luxury Glows Behind the Hero ── */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-sky-400/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-16 right-10 w-[600px] h-[450px] bg-gradient-to-bl from-amber-400/15 via-emerald-400/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Toast Notification when customer clicks festive offer card */}
      {copied && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-neutral-950 text-amber-300 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-2xl border border-amber-400 flex items-center gap-2 animate-bounce">
          <Check size={14} className="text-emerald-400 stroke-[3]" />
          Festival Coupon &ldquo;{offer.festiveCouponCode || offer.couponCode}&rdquo; Copied! (Flat{' '}
          {offer.festiveDiscount || offer.discountPercentage}% OFF)
        </div>
      )}

      {/* ── 3-Section Hero Showcase Grid (Balanced Height ~540px to 570px) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch lg:min-h-[540px] xl:min-h-[570px]">
        {/* ── LEFT COLUMN: Main Bedroom Hero Carousel (~62% width) ── */}
        <div
          className="lg:col-span-7 xl:col-span-8 relative rounded-3xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(15,23,42,0.12),0_0_1px_1px_rgba(0,0,0,0.05)] border border-slate-200/80 bg-white aspect-[3/2] flex items-center justify-center group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link href={activeSlide.link || '/collections'} className="absolute inset-0 block w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0.8, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.8 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full bg-white flex items-center justify-center"
              >
                <Image
                  src={activeSlide.image || '/images/hero_banner_bedroom.png'}
                  alt={activeSlide.alt || 'Dr. Well Care Mattress Collection'}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.01]"
                />
              </motion.div>
            </AnimatePresence>
          </Link>

          {/* Carousel Left Arrow Navigation */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={22} className="stroke-[2.5]" />
            </button>
          )}

          {/* Carousel Right Arrow Navigation */}
          {slides.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={22} className="stroke-[2.5]" />
            </button>
          )}

          {/* Slide Indicator Dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurrentSlide(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentSlide ? 'w-7 bg-[#6CB50E]' : 'w-2.5 bg-white/70 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN: Stacked Cards (~38% width, exactly matching left height) ── */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 lg:gap-5">
          {/* 1. Top Card: Recliner + Dynamic "BIG Festival SALE 25% OFF" Badge */}
          <div className="relative flex-1 rounded-3xl overflow-hidden shadow-[0_15px_35px_-12px_rgba(245,158,11,0.18),0_0_1px_1px_rgba(245,158,11,0.15)] border border-amber-200/80 bg-[#fdfbf7] aspect-[16/9] sm:aspect-[16/7] lg:aspect-auto min-h-[180px] sm:min-h-0 flex items-center justify-between p-3.5 sm:p-6 group transition-all duration-300 hover:shadow-[0_22px_45px_-10px_rgba(245,158,11,0.25)]">
            {/* Background Image of Room with Recliner */}
            <div className="absolute inset-0 z-0">
              <Image
                src={offer.festiveCardImage || '/images/hero_recliner_sale.png'}
                alt="Big Festival Sale Recliner"
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover object-left transition-transform duration-500 group-hover:scale-[1.01]"
                priority
              />
            </div>

            {/* Top-Left Festive Privilege Badge */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-md text-white text-[11px] font-black tracking-wide shadow-sm pointer-events-none">
              <Flame size={13} className="text-yellow-200 fill-yellow-200" />
              <span>LIMITED FESTIVAL SPECIAL</span>
            </div>

            {/* Clickable link over background */}
            <Link
              href={offer.festiveLinkUrl || offer.linkUrl || '/collections'}
              className="absolute inset-0 z-10"
              title="Shop Festival Sale"
            />

            {/* Dynamic Festival Badge Overlay (Positioned on the right side) */}
            <div
              onClick={handleCopyCode}
              className="relative z-20 ml-auto cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title={`Click to copy coupon code: ${offer.festiveCouponCode || offer.couponCode || 'FESTIVAL25'}`}
            >
              <FestivalSaleBadge
                title={offer.festiveBadgeTitle || offer.title || 'BIG Festival SALE'}
                discountPercentage={offer.festiveDiscount || offer.discountPercentage || 25}
                couponCode={offer.festiveCouponCode || offer.couponCode || 'FESTIVAL25'}
              />
            </div>
          </div>

          {/* 2. Bottom Card: Direct Video Showcase (Runs Directly in the Card) */}
          <div className="relative flex-1 rounded-3xl overflow-hidden shadow-[0_15px_35px_-12px_rgba(0,0,0,0.25),0_0_1px_1px_rgba(255,255,255,0.08)] border border-slate-800 bg-black aspect-[16/8] sm:aspect-[16/7] lg:aspect-auto flex items-center justify-center group transition-all duration-300 hover:shadow-[0_22px_45px_-10px_rgba(0,0,0,0.35)]">
            {offer.showcaseCardVideoUrl ? (
              activeVideo.type === 'youtube' ? (
                <iframe
                  src={activeVideo.src}
                  title={offer.showcaseCardTitle || 'Showcase Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0 object-cover"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    key={offer.showcaseCardVideoUrl}
                    src={offer.showcaseCardVideoUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* Sound Toggle Button (Bottom-Right) */}
                  <button
                    type="button"
                    onClick={toggleSound}
                    className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    title={isMuted ? 'Click to unmute video audio' : 'Click to mute'}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX size={14} className="text-white/70" />
                        <span>Tap for Sound</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={14} className="text-emerald-400" />
                        <span className="text-emerald-300">Sound ON</span>
                      </>
                    )}
                  </button>
                </>
              )
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4 text-white/70">
                <p className="text-xs font-bold text-white">Dr. Well Care Video Showcase</p>
                <p className="text-[11px] text-white/50">Upload an MP4 video in Admin to play it directly here</p>
              </div>
            )}

            {/* Live Showcase Tag (Top-Left) */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[10px] sm:text-[11px] font-black text-white tracking-wide uppercase">
                {offer.showcaseCardTitle || 'DR. WELL CARE LAB · LIVE DEMO'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── VIDEO MODAL ── */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoModalOpen(false)}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-video flex items-center justify-center"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white border border-white/30 flex items-center justify-center transition-all hover:scale-110"
                aria-label="Close video"
              >
                <X size={20} />
              </button>

              {/* Video Player */}
              {activeVideo.type === 'youtube' ? (
                <iframe
                  src={activeVideo.src}
                  title={offer.showcaseCardTitle || 'Product Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : activeVideo.type === 'video' ? (
                <video
                  src={activeVideo.src}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-white p-6">
                  <p className="text-lg font-bold mb-2">No video link specified</p>
                  <p className="text-xs text-white/60 mb-4">You can set a YouTube link or upload a video in Admin.</p>
                  <Link
                    href={offer.showcaseCardLinkUrl || '/collections'}
                    onClick={() => setIsVideoModalOpen(false)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0682E4] text-white text-xs font-bold"
                  >
                    Explore Collection <ExternalLink size={14} />
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
