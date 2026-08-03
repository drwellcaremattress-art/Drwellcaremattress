"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Phone, Mail } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "When you interact with Dr. Well Care Mattress (via our online store or customer support channels), we collect essential personal details necessary to process your orders and provide orthopaedic sleep consultations. This includes your full name, email address, phone number, shipping/billing address, and cot measurement specifications."
    },
    {
      title: "2. Payment Security & 256-Bit Encryption",
      content: "All online financial transactions on Dr. Well Care Mattress are processed through highly secure, RBI-compliant payment gateways (Razorpay, UPI, Net Banking, and major credit/debit cards). We utilize 256-bit SSL encryption. We NEVER store your credit card numbers, CVV, or bank account passwords on our servers."
    },
    {
      title: "3. How We Use Your Data",
      content: "Your data is strictly utilized to: (a) Dispatch and deliver your mattress orders via trusted logistics partners like BlueDart, Delhivery, or Xpressbees; (b) Register and verify your 10-Year Orthopaedic Warranty eligibility; (c) Send critical order tracking SMS/WhatsApp updates and invoice receipts."
    },
    {
      title: "4. Zero Data Selling Guarantee",
      content: "We respect your personal privacy as much as we value your sleep quality. Dr. Well Care Mattress will never sell, rent, trade, or distribute your personal contact information to third-party advertisers or data brokers under any circumstances."
    },
    {
      title: "5. Cookies & Analytics",
      content: "Our website uses essential performance cookies to remember the items in your shopping cart, maintain your logged-in session state, and analyze anonymous web traffic to improve our user interface and mattress sizing guides."
    },
    {
      title: "6. Your Rights & Contacting Our Privacy Officer",
      content: "You have the full right to request access to, modification of, or deletion of your personal account history and saved delivery addresses at any time. To exercise these rights or raise privacy concerns, contact our Data Protection Officer at drwellcaremattress@gmail.com or visit our Surapet, Chennai headquarters."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20 font-body">
      
      {/* Header */}
      <section className="bg-[#0B1A2A] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0682E4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-4 border border-white/10">
            <Lock className="w-3.5 h-3.5" /> 100% Secure & Confidential
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black mb-4">Privacy Policy</h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Effective Date: July 2026 • Dr. Well Care Mattress (Surapet, Chennai, India)
          </p>
        </div>
      </section>

      {/* Content Area */}
      <section className="container mx-auto px-4 py-16 max-w-4xl -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-12 space-y-8">
          
          <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-4 text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
            <ShieldCheck className="w-6 h-6 text-[#0682E4] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#0B1A2A] block mb-1">Our Commitment to You:</span>
              At Dr. Well Care, safeguarding your personal data is a top institutional priority. This Privacy Policy details how we handle, protect, and respect your information across our website and customer support channels.
            </div>
          </div>

          <div className="space-y-8 divide-y divide-slate-100">
            {sections.map((sec, idx) => (
              <div key={idx} className={idx > 0 ? "pt-8" : ""}>
                <h2 className="font-heading text-lg sm:text-xl font-black text-[#0B1A2A] mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#7cb93e] shrink-0" />
                  {sec.title}
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-7">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-6 rounded-2xl text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0682E4]" />
              <span>drwellcaremattress@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>+91 81244 65404</span>
            </div>
            <Link href="/terms" className="text-[#0682E4] hover:underline font-extrabold">
              View Terms of Service →
            </Link>
          </div>

        </div>
      </section>
      
    </div>
  );
}
