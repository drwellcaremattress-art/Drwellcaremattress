"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductListing } from '@/components/ui/ProductListing';
import { CollectionsGrid } from '@/components/home/CollectionsGrid';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { Real3DTrustCards } from '@/components/home/Real3DTrustCards';
import { ReviewsMarquee } from '@/components/home/ReviewsMarquee';
import ProductMarqueeShowcase from '@/components/home/ProductMarqueeShowcase';
import { Activity, ShieldCheck, Truck, ArrowRight, Cloud, Moon, Award, Star, CheckCircle2, Heart, Wind, Check, Sparkles, Layers, Zap } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="flex flex-col pb-0 bg-white overflow-x-clip" ref={containerRef}>

      {/* 1. New 3-Part Hero Showcase Grid */}
      <HomeHeroSection />

      {/* 2. Real Interactive 3D Slanted Badges (Matching Reference Exactly) */}
      <Real3DTrustCards />

      {/* 2.5 Our Collections - Thumbnail Category Grid */}
      <CollectionsGrid />

      {/* 3. Science of Sleep Section (NEW) */}
      {/* The Journey Section */}
      <section className="py-24 relative z-20 bg-[#0B1A2A]">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* Text block (Moved to the left side) */}
            <motion.div variants={fadeUpVariants} className="space-y-8">
              <div>
                <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
                  Born from a passion for <span className="text-[#7cb93e]">healing.</span>
                </h2>
                <p className="text-lg text-white/70 leading-relaxed font-body">
                  Dr. Well Mattress started with a simple observation by our founders: modern lifestyles were breaking our backs, and traditional mattresses were only making it worse.
                </p>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#0B1A2A] text-[#7cb93e] group-[.is-active]:bg-[#7cb93e] group-[.is-active]:text-white shadow-[0_0_15px_rgba(124,185,62,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-500">
                    <span className="font-bold text-sm">01</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl shadow-xl">
                    <h4 className="text-white font-bold text-lg mb-1">The Discovery</h4>
                    <p className="text-white/60 text-sm">Identifying the critical link between spinal alignment and deep REM sleep.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#0B1A2A] text-white/50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <span className="font-bold text-sm">02</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl">
                    <h4 className="text-white font-bold text-lg mb-1">Engineering Comfort</h4>
                    <p className="text-white/60 text-sm">Developing our proprietary multi-layer foam technology.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#0B1A2A] text-white/50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <span className="font-bold text-sm">03</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl">
                    <h4 className="text-white font-bold text-lg mb-1">Redefining Standards</h4>
                    <p className="text-white/60 text-sm">Becoming the top-rated orthopaedic mattress in India.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Image block (Moved to the right side) */}
            <motion.div variants={fadeUpVariants} className="relative w-full aspect-[4/3] group mt-12 lg:mt-0">
              <Image src="/images/hero2.png"
                alt="Dr. Well Mattress Clinical Research"
                fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Overlay stat card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-6 left-4 right-4 md:bottom-0 md:left-12 md:right-12 bg-[#0B1A2A]/95 backdrop-blur-xl border border-white/20 p-6 rounded-2xl z-30 shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#7cb93e]/20 flex items-center justify-center text-[#7cb93e] shrink-0">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white text-xl sm:text-2xl font-bold font-heading">10,000+</p>
                    <p className="text-white/60 text-xs sm:text-sm font-medium">Hours of Clinical Sleep Research</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Product Images Runway Marquee (Between Journey & Giant Text Banner) ── */}
      <ProductMarqueeShowcase />

      {/* Marquee Footer Banner (Original Dark Background & Dual Opposite Direction Tracks) */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#0c1824] via-[#102a43] to-[#0c1824] py-20 sm:py-24 flex flex-col items-center justify-center shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] border-y border-white/5 select-none">

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-50%] left-[-20%] w-[70%] h-[150%] bg-[#0682E4] opacity-[0.07] blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-[-50%] right-[-20%] w-[70%] h-[150%] bg-[#6CB50E] opacity-[0.07] blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
        </div>

        {/* Dual Opposite Marquee Container */}
        <div className="w-full flex flex-col gap-6 relative z-10 before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-[80px] md:before:w-[200px] before:bg-gradient-to-r before:from-[#0c1824] before:to-transparent after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-[80px] md:after:w-[200px] after:bg-gradient-to-l after:from-[#0c1824] after:to-transparent">
          
          {/* TRACK 1: Flows Left */}
          <div className="flex w-full whitespace-nowrap overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 32 }}
              className="flex items-center min-w-max hover:[animation-play-state:paused]"
            >
              {[...Array(2)].map((_, groupIndex) => (
                <div key={`track1-grp-${groupIndex}`} className="flex items-center">
                  {[...Array(3)].map((_, i) => (
                    <div key={`track1-${groupIndex}-${i}`} className="flex items-center space-x-8 md:space-x-12 mx-4 md:mx-6">
                      <p className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight uppercase text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>
                        Better Sleep.
                      </p>
                      <p className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight uppercase text-white">
                        Better Health.
                      </p>
                      <p className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight uppercase text-[#0682E4] drop-shadow-[0_0_20px_rgba(6,130,228,0.4)]">
                        Better You.
                      </p>
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#6CB50E] shadow-[0_0_20px_rgba(108,181,14,0.6)]"></div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* TRACK 2: Flows Right (Opposite Direction) */}
          <div className="flex w-full whitespace-nowrap overflow-hidden">
            <motion.div
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 36 }}
              className="flex items-center min-w-max hover:[animation-play-state:paused]"
            >
              {[...Array(2)].map((_, groupIndex) => (
                <div key={`track2-grp-${groupIndex}`} className="flex items-center">
                  {[...Array(3)].map((_, i) => (
                    <div key={`track2-${groupIndex}-${i}`} className="flex items-center space-x-8 md:space-x-12 mx-4 md:mx-6">
                      <p className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight uppercase text-white">
                        Doctor Certified.
                      </p>
                      <p className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight uppercase text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>
                        10-Year Warranty.
                      </p>
                      <p className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight uppercase text-[#6CB50E] drop-shadow-[0_0_20px_rgba(108,181,14,0.6)]">
                        100-Night Trial.
                      </p>
                      <p className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight uppercase text-[#0682E4] drop-shadow-[0_0_20px_rgba(6,130,228,0.4)]">
                        Zero Motion Transfer.
                      </p>
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#0682E4] shadow-[0_0_20px_rgba(6,130,228,0.6)]"></div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center mt-12 sm:mt-16 relative z-20"
        >
          <p className="text-white/80 max-w-lg mx-auto text-base sm:text-lg md:text-xl font-medium tracking-wide">
            Join thousands of Indians who have upgraded their sleep experience.
          </p>
        </motion.div>
      </div>

      {/* 4. Products Listing Section - 3 Cards Per Row, Filter Removed */}
      <div id="product-listing-section">
        <ProductListing showFilters={false} gridCols={3} headingTitle="All Mattresses" />
      </div>

      {/* The Wellcare Standard Section */}
      <section className="py-24 relative z-20 bg-[#0B1A2A]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[3rem] overflow-hidden bg-[#06101B] border border-white/10 p-8 md:p-16 lg:p-24 shadow-2xl"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7cb93e]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

            <div className="flex flex-col gap-12 md:gap-16 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#7cb93e]/10 text-[#7cb93e] font-medium text-sm mb-6 border border-[#7cb93e]/20">
                  <CheckCircle2 className="w-4 h-4" />
                  The Wellcare Signature
                </div>
                <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7cb93e]">Wellcare</span> Difference.
                </h2>
                <p className="text-lg text-white/70 leading-relaxed font-body mb-8">
                  Our signature Wellcare technology is the culmination of years of biomechanical research. It actively adapts to your body's micro-movements, ensuring zero pressure points and deep, uninterrupted REM sleep.
                </p>

                <div className="flex justify-center gap-8 md:gap-16">
                  <div className="flex flex-col gap-2 items-center">
                    <span className="text-4xl md:text-5xl font-heading font-bold text-white">98%</span>
                    <span className="text-sm text-white/50">Reported better back health</span>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div className="flex flex-col gap-2 items-center">
                    <span className="text-4xl md:text-5xl font-heading font-bold text-white">100%</span>
                    <span className="text-sm text-white/50">Non-toxic & certified</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                className="relative w-full group"
              >
                {/* Rectangular Border Animation Wrapper */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0px 0px 0px 0px rgba(124,185,62,0.1)",
                      "0px 0px 25px 5px rgba(124,185,62,0.6)",
                      "0px 0px 0px 0px rgba(124,185,62,0.1)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-[#0B1A2A] border-[3px] border-[#7cb93e]/40 overflow-hidden relative z-20"
                >
                  <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[3/1] lg:aspect-[3.5/1] overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-0"
                    >
                      <Image src="/images/wellcare.png"
                        alt="Dr. Wellcare Mattress"
                        fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center"
                      />
                    </motion.div>

                    {/* Floating animated label over image */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-6 right-6 md:top-12 md:right-12 bg-[#06101B]/90 backdrop-blur-md border border-white/20 p-4 shadow-2xl z-30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#7cb93e] flex items-center justify-center text-white shadow-[0_0_15px_rgba(124,185,62,0.5)]">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">Certified</p>
                          <p className="text-white/70 text-xs">Orthopaedic Tech</p>
                        </div>
                      </div>
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#06101B] via-[#06101B]/20 to-transparent opacity-80 pointer-events-none" />
                  </div>

                  {/* Description Underneath Image */}
                  <div className="bg-[#06101B] p-8 md:p-12 relative z-30 border-t border-white/10">
                    <h3 className="text-2xl md:text-3xl font-bold font-heading text-white mb-8 flex items-center gap-3">
                      <CheckCircle2 className="w-8 h-8 text-[#7cb93e]" />
                      The Dr. Well Care Advantage
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                      <motion.div whileHover={{ y: -5 }} className="bg-white/5 p-6 border border-white/5 transition-colors hover:border-[#7cb93e]/30">
                        <h4 className="text-[#7cb93e] font-bold mb-3 text-lg">Spinal Alignment</h4>
                        <p className="text-white/70 text-sm leading-relaxed">Targeted zones adapt to your body weight, keeping your spine naturally aligned throughout the night.</p>
                      </motion.div>
                      <motion.div whileHover={{ y: -5 }} className="bg-white/5 p-6 border border-white/5 transition-colors hover:border-[#7cb93e]/30">
                        <h4 className="text-[#7cb93e] font-bold mb-3 text-lg">Temperature Neutral</h4>
                        <p className="text-white/70 text-sm leading-relaxed">Advanced breathable materials dissipate heat, maintaining the perfect sleep climate.</p>
                      </motion.div>
                      <motion.div whileHover={{ y: -5 }} className="bg-white/5 p-6 border border-white/5 transition-colors hover:border-[#7cb93e]/30">
                        <h4 className="text-[#7cb93e] font-bold mb-3 text-lg">Pressure Relief</h4>
                        <p className="text-white/70 text-sm leading-relaxed">Distributes weight evenly to eliminate pressure points on hips and shoulders.</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Dr Well Care (5-column Grid) */}
      <motion.section
        animate={{
          backgroundColor: ["#06101B", "#0B1A2A", "#06101B"]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="py-24 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 max-w-[1400px] relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wider uppercase mb-2">
              Why Choose Dr Well Care Mattress?
            </h2>
            <motion.div
              animate={{ width: ["0%", "80px", "0%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="h-1 bg-[#7cb93e] mx-auto mt-4"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Item 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div
                whileHover={{ rotateY: 180, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-28 h-28 bg-[#3b82f6]/10 rounded-full flex items-center justify-center shadow-lg mb-6 border border-white/10 group-hover:border-[#3b82f6] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer"
              >
                <Activity className="w-12 h-12 text-[#3b82f6]" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Spinal Support</h3>
              <p className="text-sm text-white/70 leading-relaxed px-2">Ergonomic design that supports natural spinal alignment.</p>
            </motion.div>

            {/* Item 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div
                whileHover={{ rotateY: 180, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-28 h-28 bg-[#ef4444]/10 rounded-full flex items-center justify-center shadow-lg mb-6 border border-white/10 group-hover:border-[#ef4444] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] cursor-pointer"
              >
                <Heart className="w-12 h-12 text-[#ef4444]" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Premium Comfort</h3>
              <p className="text-sm text-white/70 leading-relaxed px-2">High-quality materials for a soft, luxurious feel.</p>
            </motion.div>

            {/* Item 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div
                whileHover={{ rotateY: 180, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-28 h-28 bg-[#0ea5e9]/10 rounded-full flex items-center justify-center shadow-lg mb-6 border border-white/10 group-hover:border-[#0ea5e9] group-hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] cursor-pointer"
              >
                <Wind className="w-12 h-12 text-[#0ea5e9]" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Breathable Design</h3>
              <p className="text-sm text-white/70 leading-relaxed px-2">Advanced airflow technology keeps you cool and fresh.</p>
            </motion.div>

            {/* Item 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div
                whileHover={{ rotateY: 180, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-28 h-28 bg-[#7cb93e]/10 rounded-full flex items-center justify-center shadow-lg mb-6 border border-white/10 group-hover:border-[#7cb93e] group-hover:shadow-[0_0_20px_rgba(124,185,62,0.3)] cursor-pointer"
              >
                <ShieldCheck className="w-12 h-12 text-[#7cb93e]" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Durable & Reliable</h3>
              <p className="text-sm text-white/70 leading-relaxed px-2">Built to last with top-grade materials and craftsmanship.</p>
            </motion.div>

            {/* Item 5 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div
                whileHover={{ rotateY: 180, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-28 h-28 bg-[#eab308]/10 rounded-full flex items-center justify-center shadow-lg mb-6 border border-white/10 group-hover:border-[#eab308] group-hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] cursor-pointer"
              >
                <Award className="w-12 h-12 text-[#eab308]" strokeWidth={1.5} />
              </motion.div>
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Quality Assured</h3>
              <p className="text-sm text-white/70 leading-relaxed px-2">Rigorously tested to meet the highest quality standards.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 4. Verified Customer Reviews Marquee (Minimal & Elegant) */}
      <ReviewsMarquee />

    </div>
  );
}
