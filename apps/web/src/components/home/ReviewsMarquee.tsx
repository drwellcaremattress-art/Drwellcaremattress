'use client';

import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  model: string;
  verified: boolean;
}

const REVIEWS: ReviewItem[] = [
  {
    id: '1',
    name: 'Dr. Senthil Kumar',
    location: 'Chennai (Anna Nagar)',
    rating: 5,
    date: '3 days ago',
    title: 'Instant relief from chronic lower back pain',
    comment: 'As an orthopaedic consultant in Chennai, I am particular about spinal alignment. This mattress provides genuine ergonomic lumbar support without being rock hard.',
    model: 'Ortho Bonded 8"',
    verified: true,
  },
  {
    id: '2',
    name: 'Soundarya & Vijayaraghavan',
    location: 'Coimbatore',
    rating: 5,
    date: '1 week ago',
    title: 'Zero partner motion disturbance',
    comment: 'My husband shifts frequently during sleep, but I don’t feel a thing on my side anymore. Waking up fully rested for the first time in years.',
    model: 'Luxury HR Series',
    verified: true,
  },
  {
    id: '3',
    name: 'Saravanan & Priya M.',
    location: 'Madurai',
    rating: 5,
    date: '2 weeks ago',
    title: 'Replaced our 6-year-old saggy mattress',
    comment: 'The firmness is spot on. Breathable fabric keeps it cool even during warm Tamil Nadu summers. Worth every single rupee.',
    model: 'Ortho Support Pro',
    verified: true,
  },
  {
    id: '4',
    name: 'Karthik Rangarajan',
    location: 'Tiruchirappalli (Trichy)',
    rating: 5,
    date: '2 weeks ago',
    title: 'Kept it on night one',
    comment: 'The 100-night trial gave me confidence, but after the very first night, my neck stiffness was gone. Never going back to ordinary mattresses.',
    model: 'Luxury HR Series',
    verified: true,
  },
  {
    id: '5',
    name: 'Meenakshi Sundaram',
    location: 'Salem',
    rating: 5,
    date: '3 weeks ago',
    title: 'Firm yet cradles pressure points',
    comment: 'Perfect balance of firm orthopaedic core and plush top quilting. My shoulder and hip pressure points feel weightless.',
    model: 'Bonded Series',
    verified: true,
  },
  {
    id: '6',
    name: 'Balasubramanian V.',
    location: 'Tirunelveli',
    rating: 5,
    date: '1 month ago',
    title: 'Exceptional craftsmanship & delivery',
    comment: 'Delivered seamlessly in immaculate condition. You can immediately feel the density of the bonded core and premium stitch finish.',
    model: 'Ortho Bonded 6"',
    verified: true,
  },
  {
    id: '7',
    name: 'Kavitha Vijayakumar',
    location: 'Erode',
    rating: 5,
    date: '1 month ago',
    title: 'Recommended by our physiotherapist',
    comment: 'My mother has L4-L5 disc compression. Within two weeks of sleeping on Dr. Well Care, her morning stiffness reduced remarkably.',
    model: 'Ortho Bonded Series',
    verified: true,
  },
  {
    id: '8',
    name: 'Muruganathan S.',
    location: 'Vellore',
    rating: 5,
    date: '1 month ago',
    title: 'Stays cool all night long',
    comment: 'Doesn’t trap body heat like standard memory foam mattresses. Very breathable and durable edge support.',
    model: 'Luxury HR Series',
    verified: true,
  },
];

export function ReviewsMarquee() {
  return (
    <section className="relative w-full py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden border-t border-slate-100 select-none">
      {/* ── Minimalist Section Header ── */}
      <div className="container mx-auto px-4 max-w-5xl text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-bold text-slate-700 tracking-wider uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6CB50E]" />
          Verified Sleeper Reviews
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#0B1A2A] tracking-tight mb-2">
          Real Stories. Real Spine Relief.
        </h2>

        {/* Minimal Star Rating pill */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="font-extrabold text-slate-800">4.9 / 5.0</span>
          <span>•</span>
          <span>Based on 10,000+ Happy Sleepers across India</span>
        </div>
      </div>

      {/* ── Infinite Scrolling Marquee Track ── */}
      <div className="relative w-full overflow-hidden group">
        {/* Left & Right Edge Gradient Fades for Smooth Infinite Appearance */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        {/* Marquee Row (Doubled array for gapless seamless loop) */}
        <div className="flex items-stretch gap-4 sm:gap-5 w-max animate-marquee hover:[animation-play-state:paused]">
          {[...REVIEWS, ...REVIEWS].map((rev, index) => (
            <div
              key={`${rev.id}-${index}`}
              className="w-[300px] sm:w-[340px] p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] hover:border-slate-300 transition-all flex flex-col justify-between shrink-0"
            >
              {/* Top Row: Stars + Verified Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    <CheckCircle2 size={11} className="stroke-[2.5]" />
                    Verified Buyer
                  </span>
                )}
              </div>

              {/* Review Title & Body */}
              <div className="space-y-1.5 mb-4">
                <h3 className="text-xs sm:text-[13px] font-black text-slate-900 leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h3>
                <p className="text-[12px] text-slate-600 leading-relaxed font-normal">
                  {rev.comment}
                </p>
              </div>

              {/* Bottom Row: Customer Info & Product Tag */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div>
                  <p className="font-extrabold text-slate-800">{rev.name}</p>
                  <p className="text-[10px] text-slate-400">{rev.location}</p>
                </div>

                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {rev.model}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
