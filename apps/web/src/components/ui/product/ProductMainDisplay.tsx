"use client";

import { useState, useEffect } from 'react';
import { ImageGallery } from '@/components/ui/product/ImageGallery';
import { ProductInfo } from '@/components/ui/product/ProductInfo';

import { ProductDetails } from '@/components/ui/product/ProductDetails';

interface ProductMainDisplayProps {
  product: any;
}

export function ProductMainDisplay({ product }: ProductMainDisplayProps) {
  const matchedVariantIdx = product.thicknessVariants?.findIndex((v: any) => v.slug === product.slug);
  const initialVariantIndex = matchedVariantIdx !== undefined && matchedVariantIdx >= 0 ? matchedVariantIdx : 0;

  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(initialVariantIndex);

  useEffect(() => {
    if (product.thicknessVariants && product.thicknessVariants.length > 0) {
      const idx = product.thicknessVariants.findIndex((v: any) => v.slug === product.slug);
      setActiveVariantIndex(idx >= 0 ? idx : 0);
    }
  }, [product.slug]);

  const defaultColorName = product.colors && product.colors.length > 0 ? product.colors[0].name : 'White';
  const [selectedColor, setSelectedColor] = useState<string>(defaultColorName);

  const activeVariant = product.thicknessVariants && product.thicknessVariants.length > 0 
    ? product.thicknessVariants[activeVariantIndex] 
    : null;

  const currentColors = (activeVariant?.colors && activeVariant.colors.length > 0)
    ? activeVariant.colors
    : (product.colors || []);

  const currentVideoUrl = activeVariant?.videoUrl || product.videoUrl || null;

  // Derive images for the currently selected thickness variant
  let currentImages = product.images || [];
  if (activeVariant?.images && activeVariant.images.length > 0) {
    currentImages = activeVariant.images;
  } else if (activeVariant?.image) {
    currentImages = [activeVariant.image, ...(product.images || []).slice(1)];
  }

  // Active color image logic:
  // If the active color has a specific image assigned, bring it to the front so the gallery displays it!
  const activeColorObj = currentColors.find(
    (c: any) =>
      c.name?.toLowerCase().trim() === selectedColor?.toLowerCase().trim() ||
      (selectedColor?.toLowerCase().includes('white') && c.name?.toLowerCase().includes('white')) ||
      (selectedColor?.toLowerCase().includes('blue') && c.name?.toLowerCase().includes('blue')) ||
      (selectedColor?.toLowerCase().includes('gray') && c.name?.toLowerCase().includes('gray'))
  );

  if (activeColorObj?.image && activeColorObj.image.trim()) {
    const colorImg = activeColorObj.image.trim();
    currentImages = [colorImg, ...currentImages.filter((img: string) => img !== colorImg)];
  }

  const handleVariantChange = (idx: number, variantSlug?: string) => {
    setActiveVariantIndex(idx);
    if (variantSlug && typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/product/${variantSlug}`);
    }
  };

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
  };

  return (
    <div className="flex flex-col gap-16 lg:gap-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Gallery (7 cols) */}
        <div className="lg:col-span-7">
          <ImageGallery images={currentImages} videoUrl={currentVideoUrl} title={product.title} badge="LUXURY" />
        </div>

        {/* Right: Info & Purchase (5 cols) */}
        <div className="lg:col-span-5 sticky top-28 z-30">
          <ProductInfo 
            product={{
              ...product,
              colors: currentColors,
            }} 
            externalVariantIndex={activeVariantIndex}
            onVariantChange={handleVariantChange}
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
          />
        </div>
      </div>

      <hr className="my-6 border-gray-100" />

      {/* Bottom Section: Product Details & Specs, updating dynamically with selected thickness */}
      <ProductDetails product={product} activeVariant={activeVariant} />
    </div>
  );
}
