"use client";

import Image from 'next/image';
import { ProductListing } from '@/components/ui/ProductListing';
import { 
  Moon,
  ShieldCheck,
  Activity,
  Bone,
  Truck,
  Wind,
  Layers,
  Sparkles
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

      {/* 3. The Dr Well Care Advantage - Premium Glass Grid */}
      <section className="container mx-auto px-4 mb-28 relative z-10 mt-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-[#0682E4]/10 text-[#0682E4] text-xs font-black tracking-widest px-4 py-1.5 rounded-full uppercase mb-3 inline-block">The Wellcare Difference</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#0B1A2A]">Why Choose Our Orthopaedic Series?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              tag: "SCIENTIFIC ALIGNMENT",
              tagColor: "bg-[#0682E4]/15 text-[#0682E4] border-[#0682E4]/30",
              title: "5-Zone Ortho Core",
              desc: "Engineered with multi-density HR & bonded foam layers to contour to your spine's natural curves and relieve lumbar pressure.",
              icon: <Activity className="w-6 h-6 text-[#0682E4]" />,
              glow: "hover:shadow-[0_20px_40px_rgba(6,130,228,0.12)] hover:border-[#0682E4]/40",
              iconBg: "bg-[#0682E4]/10 border-[#0682E4]/20",
              watermark: <Layers className="w-32 h-32 text-[#0682E4]" />
            },
            {
              tag: "ZERO DISTURBANCE SLEEP",
              tagColor: "bg-[#7cb93e]/15 text-[#5a8b2a] border-[#7cb93e]/30",
              title: "Motion Isolation Tech",
              desc: "Advanced energy-absorbing foam core eliminates partner disturbance and motion transfer, giving you deep, uninterrupted sleep every night.",
              icon: <Moon className="w-6 h-6 text-[#7cb93e]" />,
              glow: "hover:shadow-[0_20px_40px_rgba(124,185,62,0.12)] hover:border-[#7cb93e]/40",
              iconBg: "bg-[#7cb93e]/10 border-[#7cb93e]/20",
              watermark: <Moon className="w-32 h-32 text-[#7cb93e]" />
            },
            {
              tag: "DOORSTEP PAYMENT",
              tagColor: "bg-[#f59e0b]/15 text-[#b45309] border-[#f59e0b]/30",
              title: "Cash on Delivery",
              desc: "Free express dispatch across India via BlueDart & Delhivery. Inspect your order and pay via Cash or UPI right when it arrives.",
              icon: <Truck className="w-6 h-6 text-[#f59e0b]" />,
              glow: "hover:shadow-[0_20px_40px_rgba(245,158,11,0.12)] hover:border-[#f59e0b]/40",
              iconBg: "bg-[#f59e0b]/10 border-[#f59e0b]/20",
              watermark: <Truck className="w-32 h-32 text-[#f59e0b]" />
            },
            {
              tag: "COOL SLEEP GUARANTEE",
              tagColor: "bg-[#06b6d4]/15 text-[#0e7490] border-[#06b6d4]/30",
              title: "Airflow Cooling Tech",
              desc: "Infused with open-cell cooling memory foam and premium knitted bamboo-cotton cover for zero heat trapping all night long.",
              icon: <Wind className="w-6 h-6 text-[#06b6d4]" />,
              glow: "hover:shadow-[0_20px_40px_rgba(6,182,212,0.12)] hover:border-[#06b6d4]/40",
              iconBg: "bg-[#06b6d4]/10 border-[#06b6d4]/20",
              watermark: <Sparkles className="w-32 h-32 text-[#06b6d4]" />
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`bg-white rounded-3xl p-7 border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden flex flex-col justify-between ${item.glow}`}
            >
              {/* Background Watermark Icon */}
              <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700 pointer-events-none">
                {item.watermark}
              </div>

              <div>
                {/* Top Header: Icon & Badge */}
                <div className="flex items-center justify-between gap-3 mb-6 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full border tracking-wider uppercase ${item.tagColor}`}>
                    {item.tag}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-heading font-extrabold text-xl text-[#0B1A2A] mb-3 group-hover:text-[#0682E4] transition-colors relative z-10">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium relative z-10">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Decorative Line */}
              <div className="w-12 h-1 rounded-full bg-slate-200 group-hover:w-full group-hover:bg-[#0682E4] transition-all duration-500 mt-6 relative z-10"></div>
            </motion.div>
          ))}
        </div>
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
