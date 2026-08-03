"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCw, 
  Truck, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  HeartHandshake,
  Calendar,
  PackageCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReturnsPage() {
  const [form, setForm] = useState({
    orderId: "",
    email: "",
    phone: "",
    actionType: "Return & Full Refund (10-Year Warranty Guarantee)",
    reason: "Firmness Preference (Too Firm / Too Soft)",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.orderId.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please provide your Order ID, Email, and Phone number.");
      return;
    }
    if (!form.notes.trim() || form.notes.trim().length < 10) {
      setError("Please briefly describe your sleep experience (at least 10 characters).");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `RET-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketId(generatedId);
    }, 1200);
  };

  const steps = [
    {
      step: "01",
      title: "Day 1 – 30: Body Adjustment Phase",
      desc: "Your body needs up to 30 nights to realign and adapt from an old sagging mattress to proper orthopaedic spinal support. We ask that you sleep on your new mattress for at least 30 nights before initiating a return.",
      icon: <Clock className="w-6 h-6 text-[#0682E4]" />,
      color: "border-blue-200 bg-blue-50/60"
    },
    {
      step: "02",
      title: "Hassle-Free Request",
      desc: "If you are still not 100% satisfied after the adjustment period, simply fill out the return or exchange form below. No need to keep or re-pack in the original cardboard box!",
      icon: <RefreshCw className="w-6 h-6 text-purple-600" />,
      color: "border-purple-200 bg-purple-50/60"
    },
    {
      step: "03",
      title: "Free Doorstep Pickup & Full Refund",
      desc: "We coordinate a free doorstep pickup via our logistics partners (BlueDart / Delhivery / Xpressbees). Once inspected and picked up, your 100% refund is credited back to your original source within 3-5 business days.",
      icon: <Truck className="w-6 h-6 text-[#7cb93e]" />,
      color: "border-emerald-200 bg-emerald-50/60"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20 font-body">
      
      {/* Hero Section */}
      <section className="bg-[#0B1A2A] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0682E4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7cb93e]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#7cb93e] font-bold text-xs uppercase tracking-wider mb-4 border border-white/10">
            <HeartHandshake className="w-4 h-4" /> 10-Year Orthopaedic Protection
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            Warranty & <span className="text-[#7cb93e]">Returns Portal</span>
          </h1>
          <p className="text-base sm:text-lg text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
            We believe in building mattresses that provide long-lasting orthopaedic support. Every Dr. Well Care mattress is backed by our comprehensive 10-year warranty and dedicated customer care.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="container mx-auto px-4 py-16 max-w-6xl -mt-8 relative z-20">
        
        {/* 3-Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {steps.map((st, idx) => (
            <div key={idx} className={`p-6 sm:p-8 rounded-3xl border ${st.color} shadow-sm bg-white flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all`}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono font-black text-2xl text-slate-300 group-hover:text-[#0B1A2A] transition-colors">{st.step}</span>
                  <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-100">{st.icon}</div>
                </div>
                <h3 className="font-heading text-lg font-black text-[#0B1A2A] mb-2">{st.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{st.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-1.5 shrink-0" />
                <span>Dr. Well Care Customer Guarantee</span>
              </div>
            </div>
          ))}
        </div>

        {/* Return & Exchange Request Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-12 max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-[#0682E4] block mb-1">Online Authorization Portal</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#0B1A2A]">Initiate Return or Model Exchange</h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">
              If you have completed your 30-night adjustment window and wish to proceed, please submit your order details below.
            </p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs sm:text-sm font-semibold shadow-sm"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Banner */}
          {ticketId ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-6 bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 sm:p-10">
              <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                <PackageCheck className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-emerald-950">Return Authorization Ticket #<span className="font-mono text-[#0682E4] bg-white px-3 py-1 rounded-xl border border-blue-200">{ticketId}</span> Generated</h3>
              <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
                We have registered your request for <span className="font-bold text-[#0B1A2A]">{form.actionType}</span>. Our Chennai dispatch logistics officer will call you within 24 hours to confirm pickup address and timing.
              </p>

              <div className="p-5 bg-white rounded-2xl border border-emerald-100 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between"><span className="text-slate-500 font-bold">Order Reference:</span> <span className="font-mono font-bold text-[#0B1A2A]">{form.orderId}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-bold">Selected Action:</span> <span className="font-bold text-[#0682E4]">{form.actionType}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 font-bold">Estimated Pickup:</span> <span className="font-bold text-emerald-600">2 - 4 Business Days</span></div>
              </div>

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <Button onClick={() => setTicketId("")} className="bg-[#0682E4] hover:bg-[#7cb93e] text-white font-bold px-8 py-3.5 rounded-xl transition-colors">
                  Submit Another Request
                </Button>
                <Link href="/collections">
                  <Button variant="outline" className="border-slate-300 hover:bg-slate-100 text-slate-800 font-bold px-8 py-3.5 rounded-xl">
                    Browse Orthopaedic Models
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Order ID / Invoice # *</label>
                  <input type="text" name="orderId" value={form.orderId} onChange={handleChange} placeholder="e.g. DW-8492 or Flipkart ID" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Registered Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="ramesh@example.com" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Pickup Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 81244 65404" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Requested Action *</label>
                  <select name="actionType" value={form.actionType} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium text-slate-700">
                    <option value="Return & Full Refund (10-Year Warranty Guarantee)">Return &amp; Full Refund (10-Year Warranty Guarantee)</option>
                    <option value="Model Exchange (Upgrade to Orthopaedic / Dual Comfort)">Model Exchange (Upgrade to Orthopaedic / Dual Comfort)</option>
                    <option value="Size Exchange (Wrong Cot Dimensions Ordered)">Size Exchange (Wrong Cot Dimensions Ordered)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Primary Reason *</label>
                  <select name="reason" value={form.reason} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium text-slate-700">
                    <option value="Firmness Preference (Too Firm / Too Soft)">Firmness Preference (Too Firm / Too Soft)</option>
                    <option value="Body Adjustment Period Completed - Still Uncomfortable">Body Adjustment Period Completed — Still Uncomfortable</option>
                    <option value="Want a Thicker / Taller Mattress Model">Want a Thicker / Taller Mattress Model</option>
                    <option value="Cot Size Miscalculation on Initial Order">Cot Size Miscalculation on Initial Order</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Additional Notes / Pickup Instructions *</label>
                <textarea name="notes" rows={4} value={form.notes} onChange={handleChange} placeholder="Please provide any helpful context regarding your sleep experience or preferred pickup timing..." className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium resize-none" />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#0682E4] hover:bg-[#056ec1] text-white font-black py-4 rounded-xl text-base shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying Order Details...</> : <><RefreshCw className="w-5 h-5" /> Submit Return / Exchange Authorization</>}
              </Button>
            </form>
          )}
        </div>

      </section>
      
    </div>
  );
}
