"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Heart, 
  ShieldCheck, 
  Leaf, 
  Award,
  Users,
  Moon,
  Activity,
  Cloud,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Wind
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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

  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-[#7cb93e]" />,
      title: "10-Year Guarantee",
      description: "Built to last. We stand behind our engineering with an industry-leading warranty that ensures your investment is protected."
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-[#7cb93e]" />,
      title: "Doctor Recommended",
      description: "Developed in consultation with leading orthopaedic specialists to ensure optimal spinal alignment and pressure relief."
    },
    {
      icon: <Cloud className="w-8 h-8 text-[#7cb93e]" />,
      title: "Zero Motion Transfer",
      description: "Our advanced foams isolate movement, so you'll never be disturbed by a restless partner again."
    },
    {
      icon: <Leaf className="w-8 h-8 text-[#7cb93e]" />,
      title: "Eco-Conscious",
      description: "CertiPUR-US® certified foams made without harmful chemicals, prioritizing both your health and the environment."
    }
  ];

  const experts = [
    { name: "Dr. Sarah Jenkins", role: "Lead Orthopaedic Advisor", exp: "15+ Years" },
    { name: "Marcus Thorne", role: "Head of Sleep Engineering", exp: "20+ Years" },
    { name: "Elena Rostova", role: "Materials Scientist", exp: "12+ Years" }
  ];

  return (
    <div className="flex flex-col bg-[#0B1A2A] overflow-hidden" ref={containerRef}>
      
      {/* 1. Immersive Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden pt-20">
        
        {/* Parallax Background */}
        <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-[120%] -top-[10%] z-0">
          <div className="absolute inset-0 bg-[#0B1A2A] z-0"></div>
          <Image 
            src="/images/ChatGPT Image Jul 22, 2026, 12_25_42 PM.png"
            alt="Dr Well Mattress Hero"
            fill
            className="object-cover object-center opacity-90"
            priority
          />
          {/* Abstract glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7cb93e]/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2A] via-[#0B1A2A]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1A2A]/60 via-transparent to-transparent"></div>
        </motion.div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-start text-left pt-12 md:pt-20">
          
          {/* Animated Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-flex items-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 pr-4 p-1.5 shadow-xl mb-8"
          >
            <span className="bg-[#7cb93e] text-white text-[10px] font-bold px-3 py-1 rounded-full mr-3 uppercase tracking-wider">Our Story</span>
            <span className="text-white/80 text-xs font-semibold">The pursuit of perfect sleep</span>
          </motion.div>

          <motion.h1 
            className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 max-w-4xl"
          >
            <motion.span 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.1 }}
              className="block"
            >
              We engineer <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#7cb93e]">dreams,</span>
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.2 }}
              className="block"
            >
              not just mattresses.
            </motion.span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl font-body leading-relaxed mb-10 font-medium"
          >
            At Dr. Well Mattress, we've spent over a decade researching sleep biomechanics to create the ultimate restorative sleep system for the modern Indian lifestyle.
          </motion.p>
          
          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 md:left-4 md:-translate-x-0"
          >
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-[30px] h-[50px] rounded-full border-2 border-white/20 flex justify-center p-1"
            >
              <div className="w-1 h-3 bg-[#7cb93e] rounded-full" />
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* 2. The Journey (Timeline/Split Section) */}
      <section className="py-24 relative z-20 container mx-auto px-4">
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
            <Image 
              src="/images/hero2.png"
              alt="Dr. Well Mattress Clinical Research"
              fill
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
      </section>

      {/* 3. The Wellcare Standard (NEW) */}
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
                      <Image 
                        src="/images/wellcare.png"
                        alt="Dr. Wellcare Mattress"
                        fill
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

      {/* 4. Why Choose Dr Well Care (5-column Grid) */}
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

      {/* 4. Our Experts */}
      <section className="py-24 relative z-20 container mx-auto px-4">
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-6">Meet the <span className="text-[#7cb93e]">Experts</span></h2>
            <p className="text-white/70 max-w-2xl mx-auto">Our multidisciplinary team combines medical expertise with cutting-edge materials science.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {experts.map((expert, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="bg-white/5 rounded-[2rem] border border-white/10 p-6 flex flex-col items-center text-center group hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0B1A2A] to-[#1a3556] border-2 border-[#7cb93e]/30 group-hover:border-[#7cb93e] transition-colors mb-4 flex items-center justify-center shadow-lg">
                  <Users className="w-10 h-10 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-white font-bold text-xl mb-1">{expert.name}</h4>
                <p className="text-[#7cb93e] text-sm font-medium mb-3">{expert.role}</p>
                <div className="flex items-center gap-1 bg-[#0B1A2A] px-3 py-1 rounded-full border border-white/10">
                  <Award className="w-3 h-3 text-white/50" />
                  <span className="text-white/60 text-xs">{expert.exp}</span>
                </div>
              </motion.div>
            ))}
          </div>
      </section>

      {/* Marquee Footer Banner (Matches Homepage) */}
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
          <Button size="lg" className="mt-8 bg-[#7cb93e] hover:bg-[#68a032] text-white rounded-full px-8 h-14 text-base font-bold shadow-[0_8px_20px_-8px_rgba(124,185,62,0.8)] transition-all hover:-translate-y-1 group">
             Shop Collection
             <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>

    </div>
  );
}
