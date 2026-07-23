"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
        <Image 
          src={images[activeIndex] || '/images/layers.png'} 
          alt="Product Image" 
          fill 
          className="object-contain"
          priority
        />
        {/* Simple mock badges */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#7cb93e]"></div>
          <span className="text-[10px] font-bold text-[#0B1A2A] tracking-wider uppercase">In Stock</span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {images.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
              activeIndex === idx ? 'border-[#0B1A2A] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
            } bg-gray-50`}
          >
            <Image 
              src={img} 
              alt={`Thumbnail ${idx + 1}`} 
              fill 
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
