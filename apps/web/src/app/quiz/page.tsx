"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Award, 
  Moon, 
  Activity, 
  Heart, 
  UserCheck,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    position: "",
    pain: "",
    firmness: "",
    size: ""
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const questions = [
    {
      id: 1,
      title: "What is your primary sleep position?",
      subtitle: "Your sleep posture determines how much pressure relief your shoulders and hips require.",
      options: [
        { label: "Side Sleeper", desc: "Needs contouring pressure relief on hips and shoulders.", val: "side", icon: "🌙" },
        { label: "Back Sleeper", desc: "Needs lumbar support to keep the spine neutrally aligned.", val: "back", icon: "🛌" },
        { label: "Stomach Sleeper", desc: "Needs firmer support to prevent lower back arching.", val: "stomach", icon: "⚡" },
        { label: "Combination Sleeper", desc: "Tosses and turns; needs responsive dual-comfort foam.", val: "combo", icon: "🔄" },
      ]
    },
    {
      id: 2,
      title: "Do you experience any back pain or morning stiffness?",
      subtitle: "Dr. Well Care mattresses are scientifically designed to alleviate joint and lumbar stress.",
      options: [
        { label: "Severe Lower Back / Lumbar Pain", desc: "Requires targeted high-density orthopaedic support.", val: "severe", icon: "🩹" },
        { label: "Mild Morning Stiffness", desc: "Needs balanced spinal alignment and pressure redistribution.", val: "mild", icon: "✨" },
        { label: "No Pain — Seeking Pure Comfort", desc: "Looking for deep, restorative hotel-style luxury sleep.", val: "none", icon: "👑" },
        { label: "Sciatica / Joint Sensitivity", desc: "Needs zero-pressure memory foam cushioning.", val: "sciatica", icon: "🛡️" },
      ]
    },
    {
      id: 3,
      title: "What is your preferred mattress firmness?",
      subtitle: "Firmness is subjective, but our multi-layer engineering ensures support across all feels.",
      options: [
        { label: "Medium-Firm (Doctor Recommended)", desc: "The sweet spot of spinal support and cushioning comfort.", val: "med-firm", icon: "⚖️" },
        { label: "Firm Orthopaedic Support", desc: "Solid, no-sink support ideal for heavy back pain relief.", val: "firm", icon: "🧱" },
        { label: "Plush Cloud-Like Memory Foam", desc: "Soft, body-hugging comfort that relieves pressure points.", val: "plush", icon: "☁️" },
        { label: "Dual Comfort (Reversible Firm & Soft)", desc: "Flip the mattress depending on your mood or seasonal need.", val: "dual", icon: "🌗" },
      ]
    },
    {
      id: 4,
      title: "What size bed / cot do you sleep on?",
      subtitle: "We manufacture all standard Indian sizes and custom cot dimensions at our Surapet Chennai plant.",
      options: [
        { label: "King Size (78\" × 72\")", desc: "Spacious comfort for couples and families.", val: "king", icon: "👑" },
        { label: "Queen Size (78\" × 60\")", desc: "The most popular size for modern master bedrooms.", val: "queen", icon: "🛏️" },
        { label: "Double / Single Bed", desc: "Ideal for guest rooms, kids, or compact bedrooms.", val: "single", icon: "🏠" },
        { label: "Custom Cot Dimensions", desc: "Non-standard antique or custom architect cot size.", val: "custom", icon: "📐" },
      ]
    }
  ];

  const handleSelect = (val: string) => {
    const updated = { ...answers };
    if (step === 1) updated.position = val;
    if (step === 2) updated.pain = val;
    if (step === 3) updated.firmness = val;
    if (step === 4) updated.size = val;
    setAnswers(updated);

    if (step < 4) {
      setStep(step + 1);
    } else {
      // Calculate result
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        // Determine recommended model
        if (updated.pain === "severe" || updated.firmness === "firm") {
          setResult({
            name: "Lax-o-Bond",
            tagline: "Heavy Duty Orthopaedic Support",
            desc: "High-Density Bonded Foam specially designed with strong & durable support. Actively prevents lower back sagging and provides the exact firmness recommended by orthopaedic specialists.",
            price: "₹14,580",
            image: "/images/products/lax-o-bond-6.jpeg",
            features: ["High-Density Lumbar Core", "Zero Sagging Guarantee", "Strong & Durable Support", "Firm Orthopaedic"],
            link: "/product/lax-o-bond-6"
          });
        } else if (updated.firmness === "plush" || updated.pain === "sciatica") {
          setResult({
            name: "Memory Dump",
            tagline: "Zero-Gravity Pressure Relief & Body Contouring",
            desc: "Designed with open-cell gel memory foam that cushions pressure points on hips and shoulders. It absorbs partner motion completely and regulates sleeping temperature all night.",
            price: "₹15,840",
            image: "/images/products/memory-dump-8.png",
            features: ["Cooling Gel Memory Foam", "Zero Motion Transfer", "Deep Contour Cushioning", "Deep REM Sleep System"],
            link: "/product/memory-dump-8"
          });
        } else {
          setResult({
            name: "Softy Bond",
            tagline: "The Perfect All-Rounder Ortho Sleep System",
            desc: "Our most versatile mattress featuring High-Density Bonded Foam for strong spine alignment and soft top feel for everyday comfort. Perfect for couples and combination sleepers.",
            price: "₹10,440",
            image: "/images/products/softy-bond-6.jpeg",
            features: ["Orthopaedic alignment", "Plush comfort layer", "Free Doorstep Delivery", "10-Year Warranty"],
            link: "/product/softy-bond"
          });
        }
      }, 1500);
    }
  };

  const currentQ = questions[step - 1];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20 font-body">
      
      {/* Hero Header */}
      <section className="bg-[#0B1A2A] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7cb93e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0682E4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#7cb93e] font-bold text-xs uppercase tracking-wider mb-4 border border-white/10">
            <Sparkles className="w-4 h-4" /> Biomechanical Sleep Matcher
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
            Find Your Perfect <span className="text-[#7cb93e]">Mattress</span>
          </h1>
          <p className="text-base sm:text-lg text-white/80 font-medium leading-relaxed">
            Take our 60-second orthopaedic sleep assessment. Answer 4 simple questions and let our biomechanical algorithm match you with your ideal Dr. Well Care mattress.
          </p>
        </div>
      </section>

      {/* Quiz Area */}
      <section className="container mx-auto px-4 py-16 max-w-4xl -mt-8 relative z-20">
        
        {isCalculating ? (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-12 sm:p-20 text-center space-y-6">
            <div className="w-20 h-20 bg-[#0682E4]/10 text-[#0682E4] rounded-3xl flex items-center justify-center mx-auto animate-pulse">
              <Activity className="w-10 h-10 animate-spin" />
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#0B1A2A]">Analyzing Spinal Biomechanics...</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Matching your sleep posture, back pain profile, and firmness preference against Dr. Well Care orthopaedic foam specifications...
            </p>
          </div>
        ) : result ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0B1A2A] to-[#162a42] p-6 sm:p-10 text-white text-center relative overflow-hidden">
              <span className="inline-flex items-center gap-1.5 px-4 py-1 bg-[#7cb93e] text-white text-xs font-black uppercase tracking-wider rounded-full mb-3 shadow-md">
                <Award className="w-3.5 h-3.5" /> 99.4% Biomechanical Match
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-black mb-2">We Found Your Ideal Sleep System!</h2>
              <p className="text-white/80 text-sm max-w-xl mx-auto">Based on your answers, this model will provide the exact orthopaedic alignment and comfort your body craves.</p>
            </div>

            <div className="p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
                <Image src={result.image} alt={result.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
              </div>

              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-[#0682E4] block">{result.tagline}</span>
                <h3 className="font-heading text-2xl sm:text-3xl font-black text-[#0B1A2A]">{result.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{result.desc}</p>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  {result.features.map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-bold">Direct Factory Price Starting From:</span>
                    <span className="font-mono text-2xl font-black text-[#0682E4]">{result.price}</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link href={result.link} className="flex-1 sm:flex-none">
                      <Button className="w-full bg-[#0682E4] hover:bg-[#7cb93e] text-white font-extrabold px-8 py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-base transition-colors">
                        <ShoppingBag className="w-5 h-5 text-white" /> View &amp; Shop This Mattress
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200/80 p-6 text-center flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Free Doorstep Delivery Across India</span>
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-[#0682E4]" /> 10-Year Manufacturer Warranty</span>
              <button onClick={() => { setResult(null); setStep(1); }} className="text-[#0682E4] hover:underline flex items-center gap-1 font-extrabold">
                <RefreshCw className="w-3.5 h-3.5" /> Retake Quiz
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-12">
            
            {/* Step Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                <span>Question {step} of 4</span>
                <span className="text-[#0682E4]">{Math.round((step / 4) * 100)}% Completed</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: `${((step - 1) / 4) * 100}%` }} 
                  animate={{ width: `${(step / 4) * 100}%` }} 
                  transition={{ duration: 0.4 }}
                  className="h-full bg-gradient-to-r from-[#0B1A2A] to-[#0682E4] rounded-full" 
                />
              </div>
            </div>

            {/* Question Header */}
            <div className="mb-8 text-center sm:text-left">
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#0B1A2A] mb-2">{currentQ.title}</h2>
              <p className="text-slate-500 text-sm font-medium">{currentQ.subtitle}</p>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt.val)}
                  className="p-5 rounded-2xl border-2 border-slate-200 hover:border-[#0682E4] hover:bg-blue-50/30 transition-all text-left group flex items-start gap-4 shadow-sm hover:shadow-md"
                >
                  <span className="text-3xl p-3 rounded-xl bg-slate-50 group-hover:bg-white border border-slate-200/80 shrink-0 shadow-inner">
                    {opt.icon}
                  </span>
                  <div>
                    <h4 className="font-heading font-extrabold text-base text-[#0B1A2A] group-hover:text-[#0682E4] mb-1 flex items-center justify-between">
                      {opt.label}
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#0682E4]" />
                    </h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {step > 1 && (
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-start">
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-xs font-bold text-slate-500 hover:text-[#0B1A2A] flex items-center gap-1.5 py-2 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  ← Previous Question
                </button>
              </div>
            )}

          </div>
        )}

      </section>
      
    </div>
  );
}
