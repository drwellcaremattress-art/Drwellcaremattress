"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Loader2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry / Mattress Sizing",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [ticketId, setTicketId] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Strict Validation
    if (!formState.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formState.email.trim() || !formState.email.includes("@") || !formState.email.includes(".")) {
      setError("Please enter a valid email address so our team can respond to you.");
      return;
    }
    if (!formState.phone.trim() || formState.phone.replace(/[^0-9]/g, "").length < 10) {
      setError("Please enter a valid 10-digit phone or WhatsApp number.");
      return;
    }
    if (!formState.message.trim() || formState.message.trim().length < 10) {
      setError("Please describe your inquiry with at least 10 characters.");
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable network dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      const generatedId = `DW-SUP-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketId(generatedId);
      setFormState({ name: "", email: "", phone: "", subject: "General Inquiry / Mattress Sizing", message: "" });
    }, 1200);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-[#0682E4]" />,
      title: "Our Headquarters & Plant",
      details: ["No. 551, Sivapragasam Nagar,", "Surapet, Chennai — 600066, Tamil Nadu."],
      color: "bg-blue-50/80 border-blue-100",
    },
    {
      icon: <Phone className="w-6 h-6 text-emerald-600" />,
      title: "Call / WhatsApp Support",
      details: ["+91 93429 22044 / +91 98432 40703", "Mon - Sat: 9:00 AM – 8:00 PM IST"],
      color: "bg-emerald-50/80 border-emerald-100",
    },
    {
      icon: <Mail className="w-6 h-6 text-purple-600" />,
      title: "Direct Email Desk",
      details: ["drwellcaremattress@gmail.com", "support@drwellmattress.com"],
      color: "bg-purple-50/80 border-purple-100",
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      title: "Store & Dispatch Hours",
      details: ["Everyday: 9:00 AM – 8:30 PM", "Rapid 24-Hour Dispatch Active"],
      color: "bg-amber-50/80 border-amber-100",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20 font-body">
      
      {/* Hero Banner */}
      <section className="bg-[#0B1A2A] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0682E4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7cb93e]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#7cb93e] font-bold text-xs uppercase tracking-wider mb-4 border border-white/10">
            <Sparkles className="w-4 h-4" /> 100% Dedicated Customer Support
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            We&apos;re Here to Help You <span className="text-[#7cb93e]">Sleep Better</span>
          </h1>
          <p className="text-base sm:text-lg text-white/80 font-medium leading-relaxed">
            Have a question about orthopaedic sizing, custom mattress firmness, or order delivery? Speak directly with our sleep consultants and Chennai dispatch team.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16 sm:py-20 max-w-6xl -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Contact Cards Left Column */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-heading text-2xl font-black text-[#0B1A2A] mb-2 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#0682E4]" /> Connect With Us
            </h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Reach out through any channel below. Our average reply time is under 15 minutes during business hours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {contactInfo.map((info, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border ${info.color} bg-white shadow-sm transition-all hover:shadow-md flex items-start gap-4`}>
                  <div className="p-3 rounded-xl bg-white shadow-sm border border-slate-100 shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-sm text-[#0B1A2A] mb-1">{info.title}</h3>
                    {info.details.map((line, i) => (
                      <p key={i} className="text-xs text-slate-600 font-medium">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-gradient-to-br from-[#0B1A2A] to-[#162a42] rounded-2xl text-white shadow-lg mt-6">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-6 h-6 text-[#7cb93e]" />
                <h4 className="font-bold text-base">Custom Size Mattresses?</h4>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Need a non-standard cot size (e.g. 75&quot; × 66&quot;)? We manufacture custom orthopaedic mattresses at our Chennai facility within 48 hours! Mention your exact cot measurements in the form.
              </p>
            </div>
          </div>

          {/* Contact Form Right Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-10">
            <div className="mb-8">
              <span className="text-xs font-black uppercase tracking-wider text-[#0682E4] block mb-1">Send a Message</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#0B1A2A]">Online Support Desk</h2>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs sm:text-sm font-semibold shadow-sm"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Modal / Banner */}
            <AnimatePresence>
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="py-12 px-6 text-center bg-emerald-50/70 border border-emerald-200 rounded-3xl space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h3 className="font-heading text-2xl font-black text-emerald-950">Inquiry Received Successfully!</h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Dr. Well Care. We have generated support ticket <span className="font-mono font-bold text-[#0682E4] bg-white px-2 py-0.5 rounded border border-blue-200">{ticketId}</span> for your request.
                  </p>
                  <div className="pt-4">
                    <Button 
                      onClick={() => setIsSubmitted(false)} 
                      className="bg-[#0B1A2A] hover:bg-[#162a42] text-white font-bold px-8 py-3.5 rounded-xl shadow-md"
                    >
                      Send Another Message
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="Ramesh Kumar"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none transition-all bg-slate-50/50 focus:bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="ramesh@example.com"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none transition-all bg-slate-50/50 focus:bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none transition-all bg-slate-50/50 focus:bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Inquiry Topic *
                      </label>
                      <select
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none transition-all bg-slate-50/50 focus:bg-white font-medium text-slate-700"
                      >
                        <option value="General Inquiry / Mattress Sizing">General Inquiry / Mattress Sizing</option>
                        <option value="Custom Size Mattress Quotation">Custom Size Mattress Quotation</option>
                        <option value="Order Tracking & Dispatch">Order Tracking & Dispatch</option>
                        <option value="100-Night Trial & Returns">100-Night Trial & Returns</option>
                        <option value="10-Year Warranty Support">10-Year Warranty Support</option>
                        <option value="Bulk / Hotel Hospitality Orders">Bulk / Hotel Hospitality Orders</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Message or Custom Cot Measurements *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      placeholder="Please describe your requirement or mention your exact cot dimensions (e.g. Length 78 inches by Width 60 inches)..."
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none transition-all bg-slate-50/50 focus:bg-white font-medium resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0682E4] hover:bg-[#056ec1] text-white font-black py-4 rounded-xl text-base shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Dispatching Inquiry...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> Submit Support Ticket
                      </>
                    )}
                  </Button>
                </form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>
      
    </div>
  );
}
