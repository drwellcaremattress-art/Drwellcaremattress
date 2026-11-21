"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Play, Video, ChevronLeft, ChevronRight, Maximize2, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
  videoUrl?: string | null;
  title?: string;
  badge?: string;
}

export const getVideoEmbedInfo = (url?: string | null) => {
  if (!url || typeof url !== 'string') return { type: null, embedUrl: null };
  const trimmed = url.trim();
  if (!trimmed) return { type: null, embedUrl: null };

  // YouTube (standard watch, youtu.be, embed, shorts)
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube' as const,
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      videoId: ytMatch[1],
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo' as const,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      videoId: vimeoMatch[1],
    };
  }

  // Google Drive preview
  const gdriveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([\w-]+)/i);
  if (gdriveMatch && gdriveMatch[1]) {
    return {
      type: 'iframe' as const,
      embedUrl: `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`,
      videoId: gdriveMatch[1],
    };
  }

  // Direct video file (Cloudinary, local /videos/uploads, or MP4/WebM URL)
  return {
    type: 'video' as const,
    embedUrl: trimmed,
    videoId: null,
  };
};

export function ImageGallery({ images, videoUrl, title, badge }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'image' | 'video'>('image');

  // Interactive Magnifier Loupe Zoom States
  const [isZoomed, setIsZoomed] = useState(false);
  const [containerSize, setContainerSize] = useState({ w: 500, h: 375 });
  const [lensSize, setLensSize] = useState(200);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const zoomFactor = 2.8;

  useEffect(() => {
    setActiveIndex(0);
    setViewMode('image');
    setIsZoomed(false);
  }, [images]);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setContainerSize({ w: rect.width, h: rect.height });
          setLensSize(Math.min(220, Math.max(160, Math.round(rect.width * 0.38))));
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const videoInfo = getVideoEmbedInfo(videoUrl);
  const hasVideo = Boolean(videoInfo.type && videoInfo.embedUrl);

  const updateZoom = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w <= 0 || h <= 0) return;

    if (containerSize.w !== w || containerSize.h !== h) {
      setContainerSize({ w, h });
    }

    const currentLensSize = Math.min(220, Math.max(160, Math.round(w * 0.38)));
    setLensSize(currentLensSize);

    const mouseX = Math.max(0, Math.min(w, clientX - rect.left));
    const mouseY = Math.max(0, Math.min(h, clientY - rect.top));

    const rawLensX = mouseX - currentLensSize / 2;
    const rawLensY = mouseY - currentLensSize / 2;

    const clampedLensX = Math.max(0, Math.min(w - currentLensSize, rawLensX));
    const clampedLensY = Math.max(0, Math.min(h - currentLensSize, rawLensY));

    setLensPos({ x: clampedLensX, y: clampedLensY });

    const zoomW = w * zoomFactor;
    const zoomH = h * zoomFactor;

    const minOffsetLeft = currentLensSize - zoomW;
    const maxOffsetLeft = 0;
    const rawOffsetLeft = (mouseX - clampedLensX) - (mouseX * zoomFactor);
    const finalOffsetLeft = Math.max(minOffsetLeft, Math.min(maxOffsetLeft, rawOffsetLeft));

    const minOffsetTop = currentLensSize - zoomH;
    const maxOffsetTop = 0;
    const rawOffsetTop = (mouseY - clampedLensY) - (mouseY * zoomFactor);
    const finalOffsetTop = Math.max(minOffsetTop, Math.min(maxOffsetTop, rawOffsetTop));

    setZoomOffset({ x: finalOffsetLeft, y: finalOffsetTop });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== 'image') return;
    if (!isZoomed) setIsZoomed(true);
    updateZoom(e.clientX, e.clientY);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== 'image') return;
    setIsZoomed(true);
    updateZoom(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (viewMode !== 'image' || !e.touches[0]) return;
    setIsZoomed(true);
    updateZoom(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (viewMode !== 'image' || !e.touches[0]) return;
    updateZoom(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    setIsZoomed(false);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setViewMode('image');
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setViewMode('image');
  };

  const currentImage = images[activeIndex] || '/images/layers.png';

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* ── Main Display Area ── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center transition-all ${viewMode === 'image' ? 'cursor-crosshair' : ''
          }`}
      >
        {viewMode === 'video' && hasVideo ? (
          <div className="w-full h-full bg-black flex items-center justify-center relative">
            {videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' || videoInfo.type === 'iframe' ? (
              <iframe
                src={videoInfo.embedUrl!}
                title={title || "Product Video"}
                className="w-full h-full rounded-2xl border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                src={videoInfo.embedUrl!}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain rounded-2xl"
              />
            )}
            <button
              onClick={() => setViewMode('image')}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border border-white/20 shadow-lg z-20 cursor-pointer"
            >
              Back to Photos
            </button>
          </div>
        ) : (
          <>
            {/* Base 1x Image (Stays crisp and centered in place) */}
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-crosshair"
              onClick={() => setLightboxOpen(true)}
              title="Click to view full screen"
            >
              <Image
                src={currentImage}
                alt={title || "Product Image"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain pointer-events-none select-none"
                priority
              />
            </div>

            {/* Floating Square Magnifier Lens / Loupe (Matching reference image) */}
            {isZoomed && viewMode === 'image' && (
              <div
                className="absolute pointer-events-none overflow-hidden rounded-xl border-2 border-white/95 shadow-[0_16px_40px_rgba(0,0,0,0.28),0_4px_12px_rgba(0,0,0,0.12)] bg-white z-30 ring-1 ring-black/10 transition-opacity duration-150"
                style={{
                  width: lensSize,
                  height: lensSize,
                  left: lensPos.x,
                  top: lensPos.y,
                }}
              >
                {/* Inside Lens: High-Res Zoomed Image panning precisely under cursor */}
                <div
                  className="relative pointer-events-none will-change-transform"
                  style={{
                    width: containerSize.w * zoomFactor,
                    height: containerSize.h * zoomFactor,
                    transform: `translate3d(${zoomOffset.x}px, ${zoomOffset.y}px, 0)`,
                  }}
                >
                  <Image
                    src={currentImage}
                    alt={title || "Zoom Detail"}
                    fill
                    sizes="1600px"
                    className="object-contain pointer-events-none select-none"
                    priority
                  />
                </div>

                {/* Center focus indicator */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full border border-white/80 shadow-[0_0_2px_rgba(0,0,0,0.7)] bg-white/20" />
                </div>
              </div>
            )}

            {/* In Stock Badge (Top-left) */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2 pointer-events-none z-20">
              <div className="w-2 h-2 rounded-full bg-[#7cb93e]"></div>
              <span className="text-[10px] font-bold text-[#0B1A2A] tracking-wider uppercase">
                {badge || 'In Stock'}
              </span>
            </div>

            {/* Expand Fullscreen Button (Top-right, matching reference image) */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="p-2 bg-white/90 hover:bg-white text-slate-700 hover:text-[#0682E4] rounded-xl border border-gray-200/90 shadow-sm backdrop-blur-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Fullscreen view"
              >
                <Maximize2 size={16} />
              </button>
            </div>

            {/* Left / Right Carousel Arrow Controls */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg border border-gray-200 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 z-20"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg border border-gray-200 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 z-20"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Watch Video Floating Pill */}
            {hasVideo && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode('video');
                }}
                className="absolute bottom-4 right-4 bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 border border-white/10 group cursor-pointer z-20"
              >
                <div className="w-5 h-5 rounded-full bg-[#7cb93e] flex items-center justify-center text-[#0B1A2A]">
                  <Play className="w-3 h-3 fill-current translate-x-0.5" />
                </div>
                <span>Watch Product Video</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Thumbnails Rail (Photos + Video) ── */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setActiveIndex(idx);
              setViewMode('image');
              setIsZoomed(false);
            }}
            className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${viewMode === 'image' && activeIndex === idx
                ? 'border-[#0682E4] ring-2 ring-[#0682E4]/20 opacity-100 shadow-md'
                : 'border-transparent opacity-60 hover:opacity-100'
              } bg-gray-50`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </button>
        ))}

        {/* Video Thumbnail Button */}
        {hasVideo && (
          <button
            type="button"
            onClick={() => {
              setViewMode('video');
              setIsZoomed(false);
            }}
            className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center bg-slate-900 text-white cursor-pointer ${viewMode === 'video'
                ? 'border-[#0682E4] ring-2 ring-[#0682E4]/40 opacity-100 shadow-md'
                : 'border-slate-800 opacity-75 hover:opacity-100'
              }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#0682E4] flex items-center justify-center mb-1 shadow-md group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 text-white fill-current translate-x-0.5" />
            </div>
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-200">
              Video
            </span>
          </button>
        )}
      </div>

      {/* ── High-Resolution Fullscreen Lightbox Modal ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxOpen(false)}
          >
            <div
              className="relative max-w-5xl w-full h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={currentImage}
                  alt={title || "Product Full Image"}
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20 transition-all active:scale-95"
              >
                <X size={20} />
              </button>

              {/* Navigation in Lightbox */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Caption */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                {title || 'Dr.Well Care Mattress'} &bull; {activeIndex + 1} of {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
