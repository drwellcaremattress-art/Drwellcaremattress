"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, Activity, Moon, CircleDot, User, Wind, Leaf, Award } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { ReviewSection } from './ReviewSection';

export function ProductDetails({ product }: { product?: any }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  // Dynamic layers generator based on product slug/title
  const getProductLayers = (p: any) => {
    const slug = (p?.slug || '').toLowerCase();
    const title = (p?.title || p?.name || '').toLowerCase();
    
    // Default layers
    let layers = [
      { title: 'Premium Quilted Cover', desc: 'Ultra-soft, highly breathable fabric treated with anti-microbial technology.' },
      { title: 'Transition Memory Foam', desc: 'Adapts to your body shape instantly, relieving pressure points.' },
      { title: 'High-Resilience Support Foam', desc: 'The dense foundation layer that ensures your spine stays aligned.' }
    ];

    if (slug.includes('memory-dump') || title.includes('memory dump')) {
      layers = [
        { title: 'Ice-Cool Breathable Cover', desc: 'Advanced cooling fabric that actively draws heat away from your body.' },
        { title: 'Aero-Gel Memory Foam', desc: 'Plush, contouring memory foam infused with cooling gel for temperature regulation.' },
        { title: 'Adaptive Transition Layer', desc: 'Provides progressive support and prevents the "sinking" feeling.' },
        { title: 'Orthopaedic Core Base', desc: 'High-density foundation foam for lasting durability and zero partner disturbance.' }
      ];
    } else if (slug.includes('luxoria-latex') || title.includes('luxoria latex')) {
      layers = [
        { title: 'Luxury Cashmere Blend Cover', desc: 'Exquisitely soft, hypoallergenic cover for a true 5-star hotel feel.' },
        { title: '100% Natural Pincore Latex', desc: 'Breathable, buoyant, and eco-friendly latex layer for responsive comfort.' },
        { title: 'Plush HR Foam', desc: 'High-resilience foam that contours to your body\'s natural curves.' },
        { title: 'Heavy-Duty Support Core', desc: 'Engineered base layer providing ultimate stability and edge support.' }
      ];
    } else if (slug.includes('luxoria') || title.includes('luxoria')) {
      layers = [
        { title: 'Luxury Cashmere Blend Cover', desc: 'Exquisitely soft, hypoallergenic cover for a true 5-star hotel feel.' },
        { title: 'Cloud-Plush Memory Foam', desc: 'Deep contouring layer that gently cradles your pressure points.' },
        { title: 'High-Resilience Transition', desc: 'Responsive foam that perfectly balances softness with spinal support.' },
        { title: 'Heavy-Duty Support Core', desc: 'Engineered base layer providing ultimate stability and edge support.' }
      ];
    } else if (slug.includes('eco-latex') || slug.includes('ecolatex') || title.includes('eco latex')) {
      layers = [
        { title: 'Organic Cotton Cover', desc: 'GOTS-certified organic cotton that is naturally breathable and soft.' },
        { title: '100% Natural Latex Core', desc: 'Sustainably sourced, naturally cooling latex with pincore technology.' },
        { title: 'HR Support Base', desc: 'Durable foundation ensuring perfect posture alignment throughout the night.' }
      ];
    } else if (slug.includes('natural-latex') || title.includes('natural latex')) {
      layers = [
        { title: 'Premium Organic Cover', desc: 'Breathable organic fabric that wicks away moisture for a cool sleep.' },
        { title: 'Pure Pincore Latex', desc: 'Hypoallergenic, dust-mite resistant natural latex offering buoyant support.' },
        { title: 'Firm Orthopaedic Base', desc: 'High-density foam that provides long-lasting structural integrity.' }
      ];
    } else if (slug.includes('lax-o-bond') || title.includes('lax o bond')) {
      layers = [
        { title: 'Quilted Fabric Cover', desc: 'Soft-touch fabric quilted with hypersoft foam for immediate comfort.' },
        { title: 'Latex-Feel Comfort Layer', desc: 'Bouncy, responsive foam that mimics the feel of natural latex.' },
        { title: 'High-Density Rebonded Core', desc: 'Ultra-firm rebonded foam for exceptional orthopaedic back support.' }
      ];
    } else if (slug.includes('memory-bond') || title.includes('memory bond')) {
      layers = [
        { title: 'Premium Knitted Cover', desc: 'Breathable and stretchable knitted fabric for enhanced airflow.' },
        { title: 'Contouring Memory Foam', desc: 'Pressure-relieving memory foam that molds perfectly to your body.' },
        { title: 'High-Density Rebonded Core', desc: 'Ultra-firm rebonded foam for exceptional orthopaedic back support.' }
      ];
    } else if (slug.includes('softy-bond') || title.includes('softy bond')) {
      layers = [
        { title: 'Plush Quilted Cover', desc: 'Luxurious soft cover designed for a cozy and comforting feel.' },
        { title: 'Ultra-Soft Comfort Foam', desc: 'A cloud-like layer that gently cushions your shoulders and hips.' },
        { title: 'High-Density Rebonded Core', desc: 'Ultra-firm rebonded foam providing targeted support for your spine.' }
      ];
    } else if (slug.includes('mona-softy') || title.includes('mona softy')) {
      layers = [
        { title: 'Breathable Knitted Cover', desc: 'Soft and durable fabric that promotes optimal airflow.' },
        { title: 'Plush Comfort Foam', desc: 'A responsive soft layer that provides instant relaxation.' },
        { title: 'High-Resilience Base', desc: 'Firm foundation foam that prevents sagging and supports alignment.' }
      ];
    } else if (slug.includes('mona-lite') || title.includes('mona lite')) {
      layers = [
        { title: 'Durable Woven Cover', desc: 'Tough, long-lasting fabric that protects the mattress core.' },
        { title: 'Firm Support Foam', desc: 'High-density foam engineered for maximum orthopaedic firmness.' },
        { title: 'Stabilizing Base Layer', desc: 'Provides edge-to-edge support and ensures mattress longevity.' }
      ];
    }

    return layers;
  };

  const layers = getProductLayers(product);

  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      
      {/* 0. Feature Bar (User Requested) */}
      <section className="bg-[#0B1A2A] rounded-[2.5rem] shadow-2xl p-8 lg:p-10 relative overflow-hidden">
        {/* Animated Background Glowing Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-[#7cb93e]/20 rounded-full blur-[100px] pointer-events-none"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"
        ></motion.div>
        
        {/* Glassmorphism subtle overlay */}
        <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl pointer-events-none border border-white/5 rounded-[2.5rem]"></div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-wrap lg:flex-nowrap justify-center gap-6 lg:gap-4 relative z-10"
        >
          
          <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.05 }} className="flex flex-col items-center justify-center gap-4 w-[45%] lg:w-full pt-4 lg:pt-0 cursor-default group">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.5),inset_0_-3px_6px_rgba(0,0,0,0.2),inset_0_3px_6px_rgba(255,255,255,0.4)] flex items-center justify-center text-white transition-all duration-300 relative">
              <Activity className="w-7 h-7 relative z-10" />
            </div>
            <span className="text-[11px] font-extrabold text-white/90 text-center tracking-wider">ORTHOPAEDIC<br/>SUPPORT</span>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.05 }} className="flex flex-col items-center justify-center gap-4 w-[45%] lg:w-full pt-4 lg:pt-0 cursor-default group">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.5),inset_0_-3px_6px_rgba(0,0,0,0.2),inset_0_3px_6px_rgba(255,255,255,0.4)] flex items-center justify-center text-white transition-all duration-300 relative">
              <User className="w-7 h-7 relative z-10" />
            </div>
            <span className="text-[11px] font-extrabold text-white/90 text-center tracking-wider">RELIEVES<br/>BACK PAIN</span>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.05 }} className="flex flex-col items-center justify-center gap-4 w-[45%] lg:w-full pt-4 lg:pt-0 cursor-default group">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 shadow-[0_10px_30px_-10px_rgba(6,182,212,0.5),inset_0_-3px_6px_rgba(0,0,0,0.2),inset_0_3px_6px_rgba(255,255,255,0.4)] flex items-center justify-center text-white transition-all duration-300 relative">
              <Wind className="w-7 h-7 relative z-10" />
            </div>
            <span className="text-[11px] font-extrabold text-white/90 text-center tracking-wider">SUPERIOR<br/>COMFORT</span>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.05 }} className="flex flex-col items-center justify-center gap-4 w-[45%] lg:w-full pt-4 lg:pt-0 cursor-default group">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-red-600 shadow-[0_10px_30px_-10px_rgba(225,29,72,0.5),inset_0_-3px_6px_rgba(0,0,0,0.2),inset_0_3px_6px_rgba(255,255,255,0.4)] flex items-center justify-center text-white transition-all duration-300 relative">
              <ShieldCheck className="w-7 h-7 relative z-10" />
            </div>
            <span className="text-[11px] font-extrabold text-white/90 text-center tracking-wider">DUST MITE<br/>RESISTANT</span>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.05 }} className="flex flex-col items-center justify-center gap-4 w-[45%] lg:w-full pt-4 lg:pt-0 cursor-default group">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5),inset_0_-3px_6px_rgba(0,0,0,0.2),inset_0_3px_6px_rgba(255,255,255,0.4)] flex items-center justify-center text-white transition-all duration-300 relative">
              <Leaf className="w-7 h-7 relative z-10" />
            </div>
            <span className="text-[11px] font-extrabold text-white/90 text-center tracking-wider">ECO FRIENDLY<br/>MATERIALS</span>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.05 }} className="flex flex-col items-center justify-center gap-4 w-[45%] lg:w-full pt-4 lg:pt-0 cursor-default group">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-600 shadow-[0_10px_30px_-10px_rgba(192,38,211,0.5),inset_0_-3px_6px_rgba(0,0,0,0.2),inset_0_3px_6px_rgba(255,255,255,0.4)] flex items-center justify-center text-white transition-all duration-300 relative">
              <Award className="w-7 h-7 relative z-10" />
            </div>
            <span className="text-[11px] font-extrabold text-white/90 text-center tracking-wider">PREMIUM<br/>QUALITY</span>
          </motion.div>

        </motion.div>
      </section>
      {/* 1. Inside the Mattress (Layer Breakdown) */}
      <section className="py-12 lg:py-24 relative overflow-hidden bg-[#FAFBFC] rounded-[3rem] mb-20 shadow-sm border border-gray-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7cb93e]/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0B1A2A]/5 rounded-full blur-3xl -z-0"></div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16 lg:mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-4xl sm:text-5xl font-extrabold text-[#0B1A2A] mb-4 tracking-tight"
            >
              What&apos;s inside the mattress?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#5B6B7B] font-medium text-lg max-w-2xl mx-auto"
            >
              Every layer of the <span className="text-[#7cb93e] font-bold">{product?.title}</span> is engineered with precision to provide the perfect balance of support, comfort, and breathability.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left side: Layers list */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-6 relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#7cb93e] to-[#0B1A2A] hidden md:block opacity-20"></div>
              
              {layers.map((layer: any, index: number) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="relative flex gap-5 bg-white p-6 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_30px_-15px_rgba(124,185,62,0.3)] hover:border-[#7cb93e]/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B1A2A] to-[#1a365d] text-white flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-inner group-hover:scale-110 group-hover:from-[#7cb93e] group-hover:to-[#5a8b2a] transition-all duration-500 z-10 relative">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#0B1A2A] mb-2 group-hover:text-[#7cb93e] transition-colors">{layer.title}</h3>
                    <p className="text-[#5B6B7B] text-sm leading-relaxed font-medium">
                      {layer.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right side: Image */}
            <div className="lg:col-span-7 order-1 lg:order-2 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full aspect-square max-w-[600px] bg-white rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] p-8 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-50 opacity-50"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-10 right-10 w-20 h-20 bg-[#7cb93e]/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#0B1A2A]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>

                <div className="relative w-full h-full">
                  <Image 
                    src={product?.layersImage || "/images/layers.png"} 
                    alt={`${product?.title} Mattress Layers`}
                    fill 
                    className="object-contain drop-shadow-2xl z-10 transition-transform duration-700 ease-out group-hover:scale-105" 
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Benefits */}
      <section className="bg-[#0B1A2A] rounded-[3rem] p-10 lg:p-20 text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] bg-[#7cb93e]/10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-16 relative z-10">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
            Designed for <span className="text-[#7cb93e]">Deep Sleep</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto font-medium">
            We spent years developing the perfect sleep surface so you can wake up feeling refreshed every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
            <Activity className="w-8 h-8 text-[#7cb93e] mb-4" />
            <h3 className="text-lg font-bold mb-2">Spinal Alignment</h3>
            <p className="text-sm text-white/70">Maintains the natural curve of your spine, preventing morning backaches.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
            <Moon className="w-8 h-8 text-[#7cb93e] mb-4" />
            <h3 className="text-lg font-bold mb-2">Zero Motion Transfer</h3>
            <p className="text-sm text-white/70">Move freely without waking your partner. Total motion isolation.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
            <CircleDot className="w-8 h-8 text-[#7cb93e] mb-4" />
            <h3 className="text-lg font-bold mb-2">Cooling Tech</h3>
            <p className="text-sm text-white/70">Breathable foams that wick away body heat for a cooler night&apos;s sleep.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-colors">
            <ShieldCheck className="w-8 h-8 text-[#7cb93e] mb-4" />
            <h3 className="text-lg font-bold mb-2">Hypoallergenic</h3>
            <p className="text-sm text-white/70">Resistant to dust mites and allergens, perfect for sensitive sleepers.</p>
          </div>
        </div>
      </section>

      {/* 3. Specifications */}
      <section>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          <div className="lg:w-1/3">
            <h2 className="font-heading text-3xl font-bold text-[#0B1A2A] mb-4">
              Specifications
            </h2>
            <p className="text-[#5B6B7B] font-medium mb-6">
              The technical details of what makes our mattress the best in class.
            </p>
          </div>
          <div className="lg:w-2/3 w-full bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              <div className="p-6">
                <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Firmness</p>
                <p className="text-[#0B1A2A] font-medium">{product?.firmness || 'Medium Firm (7/10)'}</p>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Cover Material</p>
                <p className="text-[#0B1A2A] font-medium">Premium Cotton Blend Fabric</p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-100"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              <div className="p-6">
                <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Warranty</p>
                <p className="text-[#0B1A2A] font-medium">{product?.warranty || 10}-Year Limited Warranty</p>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Shipping & Delivery</p>
                <p className="text-[#0B1A2A] font-medium">Free Doorstep Delivery Across India</p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-100"></div>
            <div className="p-6">
                <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Certifications</p>
                <p className="text-[#0B1A2A] font-medium">CertiPUR-US® Certified foams, free from harmful chemicals.</p>
            </div>
          </div>
        </div>

        {/* Customer Testimonials & Reviews System */}
        <ReviewSection 
          productName={product?.title || "Dr.Well Care Orthopaedic Mattress"} 
          productSlug={product?.slug} 
          productCategory={product?.category} 
        />
      </section>
    </div>
  );
}
