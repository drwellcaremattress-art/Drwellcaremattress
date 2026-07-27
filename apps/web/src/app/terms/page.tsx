"use client";

import React from "react";
import Link from "next/link";
import { FileText, CheckCircle2, ShieldCheck, Scale, Phone, Mail } from "lucide-react";

export default function TermsPage() {
  const terms = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing, browsing, or purchasing from the Dr. Well Care Mattress website, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service, along with our Privacy Policy and 10-Year Warranty terms."
    },
    {
      title: "2. Product Descriptions & Sizing Tolerances",
      content: "All our orthopaedic mattresses are handcrafted at our Surapet, Chennai manufacturing facility using high-grade foams and breathable fabrics. Due to the compressible nature of memory foam and textile stitching, industry-standard sizing tolerances of up to ±0.5 inches in length, width, or height are considered normal and do not constitute a manufacturing defect."
    },
    {
      title: "3. Pricing, Orders & Payment Terms",
      content: "All prices listed on our website are in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST). We reserve the right to modify mattress pricing or promotional discounts without prior notice. Once an order is confirmed and dispatched from our warehouse, standard cancellation policies apply as outlined in our Returns portal."
    },
    {
      title: "4. Shipping & Delivery Protocols",
      content: "We provide free standard delivery across eligible Indian zip codes via logistics partners (BlueDart, Delhivery, Xpressbees). Delivery timelines typically range from 3 to 7 business days. While we strive for punctual dispatch, Dr. Well Care is not liable for minor delays caused by unforeseen logistical, weather, or regional transit disruptions."
    },
    {
      title: "5. 10-Year Orthopaedic Warranty Conditions",
      content: "Our comprehensive 10-Year Warranty applies exclusively to mattress purchases by standard residential customers. The 10-Year Warranty covers structural foam sagging (>1 inch) and zipper defects as defined in our official Warranty Certificate."
    },
    {
      title: "6. Limitation of Liability & Governing Law",
      content: "These terms are governed by and construed in accordance with the laws of India. Any disputes or legal proceedings arising out of customer transactions or website usage shall fall under the exclusive jurisdiction of the competent courts located in Chennai, Tamil Nadu."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20 font-body">
      
      {/* Header */}
      <section className="bg-[#0B1A2A] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7cb93e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-[#7cb93e] font-bold text-xs uppercase tracking-wider mb-4 border border-white/10">
            <Scale className="w-3.5 h-3.5" /> Legal & Commercial Agreement
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black mb-4">Terms of Service</h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Effective Date: July 2026 • Dr. Well Care Mattress (Surapet, Chennai, India)
          </p>
        </div>
      </section>

      {/* Content Area */}
      <section className="container mx-auto px-4 py-16 max-w-4xl -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-12 space-y-8">
          
          <div className="p-5 bg-slate-100 border border-slate-200 rounded-2xl flex items-start gap-4 text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
            <FileText className="w-6 h-6 text-[#0B1A2A] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#0B1A2A] block mb-1">Welcome to Dr. Well Care Mattress:</span>
              Please read these Terms of Service carefully before placing your order. These guidelines govern your relationship with our company and ensure a transparent, fair shopping experience.
            </div>
          </div>

          <div className="space-y-8 divide-y divide-slate-100">
            {terms.map((item, idx) => (
              <div key={idx} className={idx > 0 ? "pt-8" : ""}>
                <h2 className="font-heading text-lg sm:text-xl font-black text-[#0B1A2A] mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#0682E4] shrink-0" />
                  {item.title}
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pl-7">
                  {item.content}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-6 rounded-2xl text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Surapet, Chennai — 600066</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#0682E4]" />
              <span>+91 93429 22044</span>
            </div>
            <Link href="/privacy" className="text-[#0682E4] hover:underline font-extrabold">
              View Privacy Policy →
            </Link>
          </div>

        </div>
      </section>
      
    </div>
  );
}
