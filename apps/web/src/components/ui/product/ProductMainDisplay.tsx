"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageGallery } from '@/components/ui/product/ImageGallery';
import { ProductInfo } from '@/components/ui/product/ProductInfo';

interface ProductMainDisplayProps {
  product: any;
}

export function ProductMainDisplay({ product }: ProductMainDisplayProps) {
  const router = useRouter();
  const initialVariantIndex = product.thicknessVariants 
    ? Math.max(0, product.thicknessVariants.findIndex((v: any) => v.slug === product.slug || v.thickness === product.thickness)) 
    : 0;
  
  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(initialVariantIndex);

  const activeVariant = product.thicknessVariants && product.thicknessVariants.length > 0 
    ? product.thicknessVariants[activeVariantIndex] 
    : null;

  // Derive images for the currently selected thickness variant
  let currentImages = product.images;
  if (activeVariant?.image) {
    // If variant has an image, use it as the primary, and keep the rest of the product images
    currentImages = [activeVariant.image, ...(product.images || []).slice(1)];
  } else if (activeVariant?.images && activeVariant.images.length > 0) {
    currentImages = activeVariant.images;
  }

  const handleVariantChange = (idx: number, variantSlug?: string) => {
    setActiveVariantIndex(idx);
    if (variantSlug && typeof window !== 'undefined') {
      if (variantSlug !== product.slug) {
        // If it's a completely separate product in the database, navigate to it!
        router.push(`/product/${variantSlug}`);
      } else {
        // If it's just a variant on the same product, just update the URL cosmetically
        window.history.replaceState(null, '', `/product/${variantSlug}`);
      }
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
