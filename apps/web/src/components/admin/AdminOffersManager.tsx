'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FestivalSaleBadge } from '../home/FestivalSaleBadge';
import { OfferData } from '../home/HeroOfferDisplay3D';
import {
  Save, RefreshCw, Eye, Tag, Percent,
  ExternalLink, Sparkles, Zap,
  Upload, Trash2, Plus, Play, Film,
  Layers, ChevronLeft, ChevronRight, X
} from 'lucide-react';

interface SlideItem {
  image: string;
  alt?: string;
  link?: string;
}

interface AdminOffersManagerProps {
  initialOffer?: Partial<OfferData> | null;
  onOfferSaved?: (updatedOffer: OfferData) => void;
  showToast: (type: 'success' | 'error', message: string) => void;
}

const DEFAULT_SLIDES: SlideItem[] = [
  {
    image: '/images/hero_banner_bedroom.png',
    alt: 'Enhance Your Bedroom with Orthopaedic Comfort',
    link: '/collections',
  },
  {
    image: '/images/luxury_mattress_hero.png',
    alt: 'Luxury Bedroom with Dr Well Care Mattress',
    link: '/collections?type=Luxury+HR+Series',
  },
  {
    image: '/images/bonded_section_main.png',
    alt: 'Bonded Orthopaedic Support Mattress',
    link: '/collections?type=Bonded+Series',
  },
];

const DEFAULT_OFFER: OfferData = {
  title: 'BIG Festival SALE',
  subtitle: 'Festive Special Discount',
  couponCode: 'FESTIVAL25',
  discountPercentage: 25,
  buttonText: 'Shop Festive Deals',
  linkUrl: '/collections',
  isActive: true,

  festiveCardImage: '/images/hero_recliner_sale.png',
  festiveBadgeTitle: 'BIG Festival SALE',
  festiveDiscount: 25,
  festiveCouponCode: 'FESTIVAL25',
  festiveLinkUrl: '/collections',

  mainBannerImage: '/images/hero_banner_bedroom.png',
  mainBannerLink: '/collections',
  mainBannerSlides: DEFAULT_SLIDES,

  showcaseCardImage: '/images/hero_dining_showcase.png',
  showcaseCardVideoUrl: '',
  showcaseCardTitle: 'Denzen Marble Top Dining Set',
  showcaseCardBrand: 'DAMRO Internationally Trusted Furniture',
  showcaseCardLinkUrl: '/collections',
};

const MARKETING_PRESETS = [
  {
    name: 'Big Festival Sale (25% OFF)',
    discount: 25,
    title: 'BIG Festival SALE',
    code: 'FESTIVAL25',
    linkUrl: '/collections',
  },
  {
    name: 'Diwali Mega Sale (30% OFF)',
    discount: 30,
    title: 'Diwali Mega SALE',
    code: 'DIWALI30',
    linkUrl: '/collections',
  },
  {
    name: 'Pongal / New Year (25% OFF)',
    discount: 25,
    title: 'New Year SALE',
    code: 'PONGAL25',
    linkUrl: '/collections',
  },
  {
    name: 'Ortho Special (50% OFF)',
    discount: 50,
    title: 'Ortho Mega SALE',
    code: 'ORTHO50',
    linkUrl: '/collections',
  },
];

export default function AdminOffersManager({
  initialOffer,
  onOfferSaved,
  showToast,
}: AdminOffersManagerProps) {
  const [form, setForm] = useState<OfferData>({
    ...DEFAULT_OFFER,
    ...(initialOffer || {}),
    mainBannerSlides:
      initialOffer?.mainBannerSlides && initialOffer.mainBannerSlides.length > 0
        ? initialOffer.mainBannerSlides
        : DEFAULT_SLIDES,
  });

  const [activeTab, setActiveTab] = useState<'festive' | 'carousel' | 'showcase'>('festive');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleChange = (field: keyof OfferData, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Robust Native File Uploader via /api/upload with instant MongoDB auto-sync
  const handleUploadFile = async (
    file: File,
    targetKey: 'festiveCardImage' | 'showcaseCardImage' | 'showcaseCardVideoUrl' | 'addSlide' | { type: 'replaceSlide'; index: number }
  ) => {
    if (!file) return;
    const fieldIdentifier = typeof targetKey === 'string' ? targetKey : `replaceSlide-${targetKey.index}`;
    setUploadingField(fieldIdentifier);

    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();

      if (!res.ok || !result.url) {
        throw new Error(result.message || 'File upload failed');
      }

      const uploadedUrl = result.url;
      let updatedForm: OfferData = { ...form };

      if (targetKey === 'addSlide') {
        const updatedSlides = [
          ...(form.mainBannerSlides || []),
          {
            image: uploadedUrl,
            alt: `Banner Slide ${(form.mainBannerSlides || []).length + 1}`,
            link: '/collections',
          },
        ];
        updatedForm.mainBannerSlides = updatedSlides;
        setForm(updatedForm);
        showToast('success', 'New slide uploaded and added to carousel!');
      } else if (typeof targetKey === 'object' && targetKey.type === 'replaceSlide') {
        const updatedSlides = [...(form.mainBannerSlides || [])];
        if (updatedSlides[targetKey.index]) {
          updatedSlides[targetKey.index] = {
            ...updatedSlides[targetKey.index],
            image: uploadedUrl,
          };
          updatedForm.mainBannerSlides = updatedSlides;
          setForm(updatedForm);
          showToast('success', `Slide #${targetKey.index + 1} photo replaced successfully!`);
        }
      } else if (typeof targetKey === 'string') {
        updatedForm = {
          ...updatedForm,
          [targetKey]: uploadedUrl,
        };
        setForm(updatedForm);
        showToast('success', `Uploaded ${file.name} successfully!`);
      }

      // Automatically sync and persist the uploaded asset to MongoDB
      try {
        const saveRes = await fetch('/api/offers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedForm),
        });
        const saveData = await saveRes.json();
        if (saveData?.success && saveData.offer) {
          setForm(saveData.offer);
          if (onOfferSaved) onOfferSaved(saveData.offer);
        }
      } catch (autoSaveErr) {
        console.warn('Auto-save after upload notification:', autoSaveErr);
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to upload file');
    } finally {
      setUploadingField(null);
    }
  };

  // Slide Management Helpers
  const handleSlideChange = (index: number, field: keyof SlideItem, value: string) => {
    const slides = [...(form.mainBannerSlides || [])];
    if (slides[index]) {
      slides[index] = { ...slides[index], [field]: value };
      handleChange('mainBannerSlides', slides);
    }
  };

  const handleDeleteSlide = (index: number) => {
    const slides = (form.mainBannerSlides || []).filter((_, i) => i !== index);
    const updated = slides.length > 0 ? slides : DEFAULT_SLIDES;
    handleChange('mainBannerSlides', updated);
    setPreviewSlideIdx(0);
    showToast('success', 'Slide removed from carousel');
  };

  const handleAddNewSlide = () => {
    const slides = [
      ...(form.mainBannerSlides || []),
      {
        image: '/images/hero_banner_bedroom.png',
        alt: `New Collection Slide ${(form.mainBannerSlides || []).length + 1}`,
        link: '/collections',
      },
    ];
    handleChange('mainBannerSlides', slides);
    showToast('success', 'New blank slide added! You can now replace its photo and link.');
  };

  const handleApplyPreset = (preset: typeof MARKETING_PRESETS[0]) => {
    setForm((prev) => ({
      ...prev,
      title: preset.title,
      festiveBadgeTitle: preset.title,
      discountPercentage: preset.discount,
      festiveDiscount: preset.discount,
      couponCode: preset.code,
      festiveCouponCode: preset.code,
      linkUrl: preset.linkUrl,
      festiveLinkUrl: preset.linkUrl,
    }));
    showToast('success', `Applied "${preset.name}" preset! Click Publish to save.`);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...form,
        title: form.festiveBadgeTitle || form.title,
        festiveBadgeTitle: form.festiveBadgeTitle || form.title,
        discountPercentage: form.festiveDiscount ?? form.discountPercentage ?? 25,
        festiveDiscount: form.festiveDiscount ?? form.discountPercentage ?? 25,
        couponCode: form.festiveCouponCode || form.couponCode || 'FESTIVAL25',
        festiveCouponCode: form.festiveCouponCode || form.couponCode || 'FESTIVAL25',
        linkUrl: form.festiveLinkUrl || form.linkUrl || '/collections',
        festiveLinkUrl: form.festiveLinkUrl || form.linkUrl || '/collections',
      };

      const res = await fetch('/api/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save offer');
      }
      setForm(data.offer);
      if (onOfferSaved) onOfferSaved(data.offer);
      showToast('success', 'Hero layout updated and published live to storefront!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update offer');
    } finally {
      setIsSaving(false);
    }
  };

  const slides = form.mainBannerSlides && form.mainBannerSlides.length > 0
    ? form.mainBannerSlides
    : DEFAULT_SLIDES;

  return (
    <div className="space-y-6">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Homepage Hero & Offers CMS
            </span>
            <span className="text-xs text-slate-400 font-medium">• 100% Storefront Synced</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Homepage Hero Showcase Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Full control over all 3 hero cards: Festive Sunburst Badge, Main Bedroom Slider, and Dining Showcase with Video.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
          >
            <Eye size={14} /> View Store
          </a>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0682E4] hover:bg-[#056ec1] text-white text-xs font-extrabold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <Save size={14} /> Save & Publish Live
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── 1-Click Campaign Presets ── */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 mb-3 text-xs font-black text-slate-600 uppercase tracking-wider">
          <Zap size={14} className="text-amber-500" />
          <span>Quick 1-Click Campaign Presets:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MARKETING_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-3.5 rounded-xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-400/50 transition-all text-left shadow-sm group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 group-hover:text-[#0682E4]">
                  {preset.name}
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  {preset.discount}% OFF
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 truncate">
                {preset.title} · <code className="text-slate-700 font-bold">{preset.code}</code>
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Switcher for the 3 Hero Sections ── */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('festive')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === 'festive'
              ? 'border-amber-500 text-amber-700 bg-amber-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles size={16} className="text-amber-500" />
          Top-Right: Festive Sale Card
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('carousel')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === 'carousel'
              ? 'border-[#0682E4] text-[#0682E4] bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers size={16} className="text-[#0682E4]" />
          Left Column: Main Hero Carousel ({slides.length} Slides)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('showcase')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === 'showcase'
              ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Film size={16} className="text-emerald-600" />
          Bottom-Right: Video Card
        </button>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN: Selected Tab Controls (7 Cols) ── */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
          
          {/* ══════════ TAB 1: FESTIVE SALE CARD ══════════ */}
          {activeTab === 'festive' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-500" /> Festive Sunburst Badge & Card Image
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize the golden sunburst seal, discount percentage, coupon code, and card photo.
                  </p>
                </div>

                {/* Display Switch */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-bold text-slate-600">Active:</span>
                  <div
                    onClick={() => handleChange('isActive', !form.isActive)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      form.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${
                        form.isActive ? 'translate-x-[23px]' : 'translate-x-[3px]'
                      }`}
                    />
                  </div>
                </label>
              </div>

              {/* Background Image Upload / Replace */}
              <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/70 space-y-3">
                <label className="block text-xs font-black text-amber-950 uppercase tracking-wider">
                  Card Background Image
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-36 h-20 rounded-xl overflow-hidden border border-amber-300 bg-white shadow-sm shrink-0">
                    <Image
                      src={form.festiveCardImage || '/images/hero_recliner_sale.png'}
                      alt="Festive background preview"
                      fill
                      className="object-cover object-left"
                    />
                  </div>
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex items-center gap-2">
                      {/* Hidden File Input */}
                      <input
                        id="festive-img-input"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/*"
                        style={{ display: 'none' }}
                        disabled={uploadingField !== null}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadFile(file, 'festiveCardImage');
                          e.target.value = '';
                        }}
                      />

                      {/* Direct Click Button */}
                      <button
                        type="button"
                        onClick={() => document.getElementById('festive-img-input')?.click()}
                        disabled={uploadingField === 'festiveCardImage'}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-black transition-all shadow-md shadow-amber-600/20 cursor-pointer select-none ${
                          uploadingField === 'festiveCardImage' ? 'opacity-70 pointer-events-none' : ''
                        }`}
                      >
                        {uploadingField === 'festiveCardImage' ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" /> Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={14} className="stroke-[2.5]" /> Upload New Photo
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleChange('festiveCardImage', '/images/hero_recliner_sale.png')}
                        className="px-3.5 py-2.5 rounded-xl border border-amber-300 hover:bg-amber-100/60 text-amber-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Reset Image
                      </button>
                    </div>

                    <input
                      type="text"
                      value={form.festiveCardImage || ''}
                      onChange={(e) => handleChange('festiveCardImage', e.target.value)}
                      placeholder="/images/hero_recliner_sale.png or https://..."
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-mono text-slate-700 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Badge Text Customization */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                  Festival Badge Main Title (e.g. &ldquo;BIG Festival SALE&rdquo;)
                </label>
                <input
                  type="text"
                  value={form.festiveBadgeTitle || form.title || ''}
                  onChange={(e) => {
                    handleChange('festiveBadgeTitle', e.target.value);
                    handleChange('title', e.target.value);
                  }}
                  placeholder="BIG Festival SALE"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Renders inside the 24-point golden sunburst medallion.
                </p>
              </div>

              {/* Discount Percentage and Coupon Code Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Percent size={13} className="text-amber-500" /> Discount Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="90"
                      value={form.festiveDiscount ?? form.discountPercentage ?? 25}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        handleChange('festiveDiscount', val);
                        handleChange('discountPercentage', val);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                      % OFF
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Displays in the crimson pill as &ldquo;FLAT {form.festiveDiscount ?? form.discountPercentage}% OFF&rdquo;.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Tag size={13} className="text-[#0682E4]" /> Coupon Code (Click-to-Copy)
                  </label>
                  <input
                    type="text"
                    value={form.festiveCouponCode || form.couponCode || ''}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      handleChange('festiveCouponCode', val);
                      handleChange('couponCode', val);
                    }}
                    placeholder="FESTIVAL25"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-black text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Auto-copied to customer&apos;s clipboard when card is clicked.
                  </p>
                </div>
              </div>

              {/* Destination Link */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <ExternalLink size={13} className="text-[#0682E4]" /> Destination Link URL
                </label>
                <input
                  type="text"
                  value={form.festiveLinkUrl || form.linkUrl || '/collections'}
                  onChange={(e) => {
                    handleChange('festiveLinkUrl', e.target.value);
                    handleChange('linkUrl', e.target.value);
                  }}
                  placeholder="/collections"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* ══════════ TAB 2: MAIN HERO CAROUSEL (SLIDER) ══════════ */}
          {activeTab === 'carousel' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Layers size={18} className="text-[#0682E4]" /> Left Main Bedroom Slider ({slides.length} Slides)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Add, edit, upload, or remove slides rotating in the main hero banner.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Hidden Input for Add Slide */}
                  <input
                    id="carousel-new-slide-input"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/*"
                    style={{ display: 'none' }}
                    disabled={uploadingField !== null}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadFile(file, 'addSlide');
                      e.target.value = '';
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => document.getElementById('carousel-new-slide-input')?.click()}
                    disabled={uploadingField === 'addSlide'}
                    className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0682E4] hover:bg-[#056ec1] active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer select-none ${
                      uploadingField === 'addSlide' ? 'opacity-70 pointer-events-none' : ''
                    }`}
                  >
                    {uploadingField === 'addSlide' ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> Upload & Add Slide
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleAddNewSlide}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Blank Slide
                  </button>
                </div>
              </div>

              {/* Slides List */}
              <div className="space-y-4">
                {slides.map((slide, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0682E4] text-white flex items-center justify-center text-[10px] font-black">
                          {idx + 1}
                        </span>
                        Slide #{idx + 1}
                      </span>
                      {slides.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSlide(idx)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-bold hover:bg-red-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} /> Delete Slide
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      {/* Image Thumbnail + Direct Upload Button */}
                      <div className="sm:col-span-4 flex flex-col gap-2">
                        <div className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-200 bg-white">
                          <Image
                            src={slide.image || '/images/hero_banner_bedroom.png'}
                            alt={slide.alt || 'Slide preview'}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Hidden Input for Replace Slide */}
                        <input
                          id={`carousel-slide-input-${idx}`}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/*"
                          style={{ display: 'none' }}
                          disabled={uploadingField !== null}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadFile(file, { type: 'replaceSlide', index: idx });
                            e.target.value = '';
                          }}
                        />

                        {/* Replace Image Button for this specific slide */}
                        <button
                          type="button"
                          onClick={() => document.getElementById(`carousel-slide-input-${idx}`)?.click()}
                          disabled={uploadingField === `replaceSlide-${idx}`}
                          className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-[#0682E4] text-[11px] font-extrabold cursor-pointer transition-all ${
                            uploadingField === `replaceSlide-${idx}` ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        >
                          {uploadingField === `replaceSlide-${idx}` ? (
                            <>
                              <RefreshCw size={11} className="animate-spin" /> Uploading...
                            </>
                          ) : (
                            <>
                              <Upload size={11} /> Replace Photo
                            </>
                          )}
                        </button>
                      </div>

                      {/* Inputs */}
                      <div className="sm:col-span-8 space-y-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
                            Image Path or Cloudinary URL:
                          </label>
                          <input
                            type="text"
                            value={slide.image}
                            onChange={(e) => handleSlideChange(idx, 'image', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 bg-white"
                            placeholder="/images/hero_banner_bedroom.png"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
                              Alt Description:
                            </label>
                            <input
                              type="text"
                              value={slide.alt || ''}
                              onChange={(e) => handleSlideChange(idx, 'alt', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white"
                              placeholder="Banner description"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
                              Target Link URL:
                            </label>
                            <input
                              type="text"
                              value={slide.link || ''}
                              onChange={(e) => handleSlideChange(idx, 'link', e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white"
                              placeholder="/collections"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════ TAB 3: SHOWCASE VIDEO ONLY (NO BACKGROUND IMAGE) ══════════ */}
          {activeTab === 'showcase' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Film size={18} className="text-emerald-600" /> Bottom-Right Hero Video Showcase
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload a video from your computer or provide a link. The video runs directly in the bottom-right hero card.
                  </p>
                </div>
              </div>

              {/* Video Player & Upload Section */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-slate-50 to-blue-50/40 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Film size={14} className="text-emerald-600" /> Video File (Runs Directly in Card)
                  </label>
                  {form.showcaseCardVideoUrl && (
                    <button
                      type="button"
                      onClick={() => handleChange('showcaseCardVideoUrl', '')}
                      className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Trash2 size={12} /> Remove Video
                    </button>
                  )}
                </div>

                {/* Video Preview If Present */}
                {form.showcaseCardVideoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-300 aspect-[16/9] max-h-60 w-full flex items-center justify-center shadow-inner">
                    {form.showcaseCardVideoUrl.includes('youtube.com') || form.showcaseCardVideoUrl.includes('youtu.be') ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${
                          form.showcaseCardVideoUrl.includes('watch?v=')
                            ? form.showcaseCardVideoUrl.split('watch?v=')[1]?.split('&')[0]
                            : form.showcaseCardVideoUrl.split('youtu.be/')[1]
                        }?modestbranding=1&rel=0`}
                        title="Showcase Video Preview"
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <video
                        key={form.showcaseCardVideoUrl}
                        src={form.showcaseCardVideoUrl}
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center bg-white/70 flex flex-col items-center justify-center gap-2">
                    <Film size={36} className="text-slate-400" />
                    <p className="text-xs font-extrabold text-slate-700">No Video Uploaded Yet</p>
                    <p className="text-[11px] text-slate-500">
                      Upload an MP4, WebM, or MOV video from your computer to play in this card.
                    </p>
                  </div>
                )}

                {/* Upload Buttons and URL Input */}
                <div className="space-y-3 pt-1">
                  {/* Hidden Input for Video Upload */}
                  <input
                    id="showcase-video-file-input"
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/*"
                    style={{ display: 'none' }}
                    disabled={uploadingField !== null}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadFile(file, 'showcaseCardVideoUrl');
                      e.target.value = '';
                    }}
                  />

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    {/* Big Prominent Upload Video Button */}
                    <button
                      type="button"
                      onClick={() => document.getElementById('showcase-video-file-input')?.click()}
                      disabled={uploadingField === 'showcaseCardVideoUrl'}
                      className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black transition-all shadow-md shadow-emerald-600/20 cursor-pointer select-none shrink-0 ${
                        uploadingField === 'showcaseCardVideoUrl' ? 'opacity-70 pointer-events-none' : ''
                      }`}
                    >
                      {uploadingField === 'showcaseCardVideoUrl' ? (
                        <>
                          <RefreshCw size={15} className="animate-spin" /> Uploading Video From Computer...
                        </>
                      ) : (
                        <>
                          <Upload size={15} className="stroke-[2.5]" /> Upload Video from Computer
                        </>
                      )}
                    </button>

                    {/* Or URL input */}
                    <input
                      type="text"
                      value={form.showcaseCardVideoUrl || ''}
                      onChange={(e) => handleChange('showcaseCardVideoUrl', e.target.value)}
                      placeholder="Or paste video URL (MP4, YouTube, Cloudinary URL)..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Supports .mp4, .webm, .mov files uploaded directly from your computer, or external URLs.
                  </p>
                </div>
              </div>

              {/* Showcase Overlay Title and Brand (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Overlay Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.showcaseCardTitle || ''}
                    onChange={(e) => handleChange('showcaseCardTitle', e.target.value)}
                    placeholder="e.g. Denzen Marble Top Dining Set"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Overlay Brand / Subtitle (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.showcaseCardBrand || ''}
                    onChange={(e) => handleChange('showcaseCardBrand', e.target.value)}
                    placeholder="e.g. DAMRO Furniture"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Target Link */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <ExternalLink size={13} className="text-[#0682E4]" /> Destination Link URL (Optional)
                </label>
                <input
                  type="text"
                  value={form.showcaseCardLinkUrl || '/collections'}
                  onChange={(e) => handleChange('showcaseCardLinkUrl', e.target.value)}
                  placeholder="/collections"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setForm(DEFAULT_OFFER);
                showToast('success', 'Reset all fields to default values.');
              }}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Reset to Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0682E4] hover:bg-[#056ec1] text-white text-xs font-extrabold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <Save size={14} /> Save & Publish Live
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Live Interactive Storefront Simulation (5 Cols) ── */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
            
            {/* Header bar */}
            <div className="relative z-10 flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-white/70">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Storefront Simulator
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                1:1 Real-Time Preview
              </span>
            </div>

            {/* ── SIMULATION OF THE 3 CARDS ── */}
            <div className="space-y-4 relative z-10">
              
              {/* 1. Main Hero Banner Slide Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                  <span>Bedroom Banner Slider ({previewSlideIdx + 1}/{slides.length})</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewSlideIdx((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      title="Previous Slide"
                    >
                      <ChevronLeft size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSlideIdx((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      title="Next Slide"
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                  <Image
                    src={slides[previewSlideIdx]?.image || '/images/hero_banner_bedroom.png'}
                    alt="Slide preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
                    {slides.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full ${
                          i === previewSlideIdx ? 'w-4 bg-[#6CB50E]' : 'w-1.5 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Festive Sale Card Preview */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-bold block">
                  Festive Sale Recliner Card
                </span>
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-amber-400/40 bg-[#fdfbf7] w-full aspect-[16/8] flex items-center justify-between p-3">
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={form.festiveCardImage || '/images/hero_recliner_sale.png'}
                      alt="Recliner Preview"
                      fill
                      className="object-cover object-left"
                    />
                  </div>
                  <div className="relative z-20 ml-auto scale-[0.82] origin-right">
                    <FestivalSaleBadge
                      title={form.festiveBadgeTitle || form.title}
                      discountPercentage={form.festiveDiscount ?? form.discountPercentage ?? 25}
                      couponCode={form.festiveCouponCode || form.couponCode || 'FESTIVAL25'}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Showcase Video Card Preview (Direct Inline Video Player) */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-bold block">
                  Bottom-Right Video Card (Runs Directly in Hero)
                </span>
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-black w-full aspect-[16/8] flex items-center justify-center">
                  {form.showcaseCardVideoUrl ? (
                    form.showcaseCardVideoUrl.includes('youtube.com') || form.showcaseCardVideoUrl.includes('youtu.be') ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${
                          form.showcaseCardVideoUrl.includes('watch?v=')
                            ? form.showcaseCardVideoUrl.split('watch?v=')[1]?.split('&')[0]
                            : form.showcaseCardVideoUrl.split('youtu.be/')[1]
                        }?modestbranding=1&rel=0&controls=1`}
                        title="Showcase Video"
                        className="w-full h-full border-0 object-cover"
                      />
                    ) : (
                      <video
                        key={form.showcaseCardVideoUrl}
                        src={form.showcaseCardVideoUrl}
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center text-white/60">
                      <Film size={26} className="text-white/40 mb-1.5" />
                      <p className="text-[11px] font-bold text-white">No Video Uploaded</p>
                      <p className="text-[9px] text-white/50">Upload a video file to play directly in this card</p>
                    </div>
                  )}

                  {/* Overlay Title / Brand if provided */}
                  {form.showcaseCardTitle && (
                    <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md pointer-events-none">
                      <p className="text-[10px] font-bold text-white">{form.showcaseCardTitle}</p>
                      {form.showcaseCardBrand && (
                        <p className="text-[8px] text-emerald-400 font-semibold">{form.showcaseCardBrand}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <p className="text-[11px] text-slate-400">
                ✨ Live simulation reacts to all uploads and edits instantly. Click &ldquo;Save & Publish Live&rdquo; to sync with MongoDB and update the storefront.
              </p>
            </div>
          </div>

          {/* Quick Config Summary */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Festive Discount:</span>
              <span className="bg-red-50 text-red-700 font-black px-2 py-0.5 rounded border border-red-200">
                FLAT {form.festiveDiscount ?? form.discountPercentage ?? 25}% OFF
              </span>
            </div>
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Festival Coupon:</span>
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-amber-700 font-black">
                {form.festiveCouponCode || form.couponCode || 'FESTIVAL25'}
              </span>
            </div>
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Hero Slides:</span>
              <span className="text-[#0682E4] font-bold">
                {slides.length} Banner Slides Active
              </span>
            </div>
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Video Attached:</span>
              <span className={form.showcaseCardVideoUrl ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                {form.showcaseCardVideoUrl ? '● Video Connected' : 'No Video Attached'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── PREVIEW VIDEO MODAL ── */}
      {isVideoModalOpen && (
        <div
          onClick={() => setIsVideoModalOpen(false)}
          className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 aspect-video flex items-center justify-center"
          >
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white border border-white/30 flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>
            <iframe
              src={
                form.showcaseCardVideoUrl?.includes('youtube.com') || form.showcaseCardVideoUrl?.includes('youtu.be')
                  ? `https://www.youtube.com/embed/${form.showcaseCardVideoUrl.split('v=')[1] || ''}?autoplay=1`
                  : form.showcaseCardVideoUrl
              }
              title="Showcase Video Preview"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
