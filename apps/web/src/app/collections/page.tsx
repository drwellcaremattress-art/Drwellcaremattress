"use client";

import Image from 'next/image';
import { ProductListing } from '@/components/ui/ProductListing';
import { 
  Moon,
  ShieldCheck,
  Activity,
  Bone
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function CollectionsPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="bg-white min-h-screen pb-0 flex flex-col" ref={containerRef}>
      
      {/* 1. Immersive Header Section */}
      <div className="relative w-full h-[50vh] min-h-[400px] mb-20 overflow-hidden pt-20 flex items-center">
        
        {/* Parallax Background Image */}
        <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
          <Image 
            src="/images/collections_hero.png"
            alt="Dr Well Care Mattress Showroom"
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
          {/* Deep dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A2A]/90 via-[#0B1A2A]/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-100 h-24 bottom-0 top-auto"></div>
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="font-heading text-5xl lg:text-7xl font-bold text-white mb-4"
            >
              Our Mattresses
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/80 text-lg lg:text-xl font-medium"
            >
              Engineered for perfect support. Designed for perfect sleep. Explore our premium collection below.
            </motion.p>
          </div>
        </div>

        {/* Floating Glassmorphism Feature Icons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="absolute bottom-8 right-0 left-0 container mx-auto px-4 z-20 flex gap-4 lg:gap-8 overflow-x-auto hide-scrollbar"
        >
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 shadow-xl min-w-max hover:bg-white/20 transition-colors">
            <Bone className="w-5 h-5 text-[#7cb93e]" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">Orthopaedic</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 shadow-xl min-w-max hover:bg-white/20 transition-colors">
            <Activity className="w-5 h-5 text-[#7cb93e]" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">Pressure Relief</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 shadow-xl min-w-max hover:bg-white/20 transition-colors">
            <ShieldCheck className="w-5 h-5 text-[#7cb93e]" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">10-Yr Warranty</span>
          </div>
        </motion.div>
      </div>

      {/* 2. Reusable Product Listing Component */}
      <ProductListing />

      {/* 3. Bottom Trust Banner (Dark Mode Glow) */}
      <section className="container mx-auto px-4 mb-24 relative z-10 mt-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0B1A2A] rounded-[2rem] p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative overflow-hidden border border-white/10"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#7cb93e]/10 blur-[100px] pointer-events-none"></div>

          <div className="flex items-start gap-4 relative z-10 group">
            <Moon className="w-8 h-8 text-[#7cb93e] flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h4 className="font-heading font-bold text-white text-lg mb-1">100-Night Trial</h4>
              <p className="text-white/60 text-sm leading-relaxed">Sleep on it for 100 nights. Not perfect? We&apos;ll pick it up.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 relative z-10 group">
            <ShieldCheck className="w-8 h-8 text-[#7cb93e] flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h4 className="font-heading font-bold text-white text-lg mb-1">10-Year Warranty</h4>
              <p className="text-white/60 text-sm leading-relaxed">Guaranteed durability and support for a full decade.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 relative z-10 group">
            <Activity className="w-8 h-8 text-[#7cb93e] flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h4 className="font-heading font-bold text-white text-lg mb-1">Doctor Recommended</h4>
              <p className="text-white/60 text-sm leading-relaxed">Approved by leading orthopaedists for back support.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 relative z-10 group">
            <div className="w-8 h-8 rounded-full border-2 border-[#7cb93e] flex items-center justify-center flex-shrink-0 text-[#7cb93e] font-bold group-hover:scale-110 transition-transform duration-300">
              0%
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-lg mb-1">No Cost EMI</h4>
              <p className="text-white/60 text-sm leading-relaxed">Easy payment options with 0% interest on credit cards.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Marquee Footer Banner */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#0c1824] via-[#102a43] to-[#0c1824] py-24 mt-auto flex flex-col items-center justify-center shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] border-y border-white/5">
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-50%] left-[-20%] w-[70%] h-[150%] bg-[#0682E4] opacity-[0.07] blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-[-50%] right-[-20%] w-[70%] h-[150%] bg-[#6CB50E] opacity-[0.07] blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
        </div>

        {/* Infinite Marquee */}
        <div className="flex w-full whitespace-nowrap overflow-hidden relative z-10 before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-[100px] md:before:w-[250px] before:bg-gradient-to-r before:from-[#0c1824] before:to-transparent after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-[100px] md:after:w-[250px] after:bg-gradient-to-l after:from-[#0c1824] after:to-transparent">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
            className="flex items-center min-w-max"
          >
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex items-center">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-12 mx-6">
                    <p className="text-5xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight uppercase text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>
                      Better Sleep.
                    </p>
                    <p className="text-5xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight uppercase text-white">
                      Better Health.
                    </p>
                    <p className="text-5xl md:text-7xl lg:text-8xl font-heading font-black tracking-tight uppercase text-[#0682E4] drop-shadow-[0_0_20px_rgba(6,130,228,0.4)]">
                      Better You.
                    </p>
                    <div className="w-6 h-6 rounded-full bg-[#6CB50E] shadow-[0_0_20px_rgba(108,181,14,0.6)]"></div>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center mt-16 relative z-20"
        >
          <p className="text-white/80 max-w-lg mx-auto text-lg md:text-xl font-medium tracking-wide">Join thousands of Indians who have upgraded their sleep experience.</p>
        </motion.div>
      </div>
    </div>
  );
}
