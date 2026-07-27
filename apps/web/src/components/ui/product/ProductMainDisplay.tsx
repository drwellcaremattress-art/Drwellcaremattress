"use client";

import { useState } from 'react';
import { ImageGallery } from '@/components/ui/product/ImageGallery';
import { ProductInfo } from '@/components/ui/product/ProductInfo';

interface ProductMainDisplayProps {
  product: any;
}

export function ProductMainDisplay({ product }: ProductMainDisplayProps) {
  const initialVariantIndex = product.thicknessVariants 
    ? Math.max(0, product.thicknessVariants.findIndex((v: any) => v.slug === product.slug || v.thickness === product.thickness)) 
    : 0;
  
  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(initialVariantIndex);

  const activeVariant = product.thicknessVariants && product.thicknessVariants.length > 0 
    ? product.thicknessVariants[activeVariantIndex] 
    : null;

  // Derive images for the currently selected thickness variant
  const currentImages = activeVariant?.images && activeVariant.images.length > 0 
    ? activeVariant.images 
    : (activeVariant?.image ? [activeVariant.image, activeVariant.image, activeVariant.image] : product.images);

  const handleVariantChange = (idx: number, variantSlug?: string) => {
    setActiveVariantIndex(idx);
    if (variantSlug && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/product/${variantSlug}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
      {/* Left: Gallery (7 cols) */}
      <div className="lg:col-span-7">
        <ImageGallery images={currentImages} title={product.title} badge="LUXURY" />
      </div>

      {/* Right: Info & Purchase (5 cols) */}
      <div className="lg:col-span-5 sticky top-28 z-30">
        <ProductInfo 
          product={product} 
          externalVariantIndex={activeVariantIndex}
          onVariantChange={handleVariantChange}
        />
      </div>
    </div>
  );
}
