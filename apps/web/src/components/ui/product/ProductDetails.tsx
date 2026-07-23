"use client";

import Image from 'next/image';
import { ShieldCheck, Activity, Moon, CircleDot, User, Wind, Leaf, Award } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

export function ProductDetails() {
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
      <section>
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0B1A2A] mb-3">
            What&apos;s inside the mattress?
          </h2>
          <p className="text-[#5B6B7B] font-medium max-w-xl mx-auto">
            Every layer is engineered with precision to provide the perfect balance of support, comfort, and breathability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 lg:order-1 flex flex-col gap-8 lg:pr-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#e8f4fa] text-[#3b82f6] flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1A2A] mb-1">Premium Quilted Cover</h3>
                <p className="text-[#5B6B7B] text-sm leading-relaxed">
                  Ultra-soft, highly breathable fabric treated with anti-microbial technology to keep your mattress fresh and cool.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#f0ebf8] text-[#8b5cf6] flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1A2A] mb-1">Transition Memory Foam</h3>
                <p className="text-[#5B6B7B] text-sm leading-relaxed">
                  Adapts to your body shape instantly, relieving pressure points and reducing tossing and turning.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#f5f9f0] text-[#7cb93e] flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1A2A] mb-1">High-Resilience Support Foam</h3>
                <p className="text-[#5B6B7B] text-sm leading-relaxed">
                  The dense foundation layer that ensures your spine stays aligned while providing zero partner disturbance.
                </p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 bg-gray-50 rounded-[2rem] aspect-square relative p-8 flex items-center justify-center">
            <div className="absolute w-full h-full inset-0 bg-gradient-to-tr from-gray-100 to-transparent rounded-[2rem]"></div>
            <Image 
              src="/images/layers.png" 
              alt="Mattress Layers" 
              fill 
              className="object-contain p-8 drop-shadow-2xl relative z-10 hover:scale-105 transition-transform duration-700" 
            />
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
                <p className="text-[#0B1A2A] font-medium">Medium Firm (7/10)</p>
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
                <p className="text-[#0B1A2A] font-medium">10-Year Limited Warranty</p>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Trial Period</p>
                <p className="text-[#0B1A2A] font-medium">100 Nights Risk-Free</p>
              </div>
            </div>
            <div className="h-px w-full bg-gray-100"></div>
            <div className="p-6">
                <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Certifications</p>
                <p className="text-[#0B1A2A] font-medium">CertiPUR-US® Certified foams, free from harmful chemicals.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
