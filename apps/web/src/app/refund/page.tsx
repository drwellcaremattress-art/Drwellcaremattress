"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2, Phone, Mail, RefreshCw } from "lucide-react";

export default function RefundPage() {
  const sections = [
    {
      title: "1. Return Eligibility",
      content: "Mattresses can be returned within 10 days of delivery if they are found to be defective or damaged upon arrival. The mattress must be unused, in its original packaging, and accompanied by the original invoice."
    },
    {
      title: "2. Non-Returnable Items",
      content: "Custom-sized mattresses, pillows, and accessories are not eligible for returns or refunds unless there is a manufacturing defect."
    },
    {
      title: "3. Refund Process",
      content: "Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed and automatically credited back to your original method of payment within 5-7 business days."
    },
    {
      title: "4. Exchanges",
      content: "We only replace items if they are defective or damaged during transit. If you need to exchange an item for the exact same model, please contact our support team."
    },
    {
      title: "5. Cancellation Policy",
      content: "Orders can be cancelled within 24 hours of placement without any penalty. After 24 hours, if the mattress has already entered the production phase or has been shipped, cancellation fees may apply."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20 font-body">
      
      {/* Header */}
      <section className="bg-[#0B1A2A] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0682E4]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-4 border border-white/10">
            <RefreshCw className="w-3.5 h-3.5" /> Easy Returns
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black mb-4">Refund & Return Policy</h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Effective Date: July 2026 • VKS ENTERPRISES (Dr. Well Care Mattress)
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
              At VKS ENTERPRISES, we strive to ensure you get the best sleep experience. If you are not completely satisfied with your purchase, our clear and fair refund policy is here to help.
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
              <span>+91 93429 22044</span>
            </div>
            <Link href="/contact" className="text-[#0682E4] hover:underline font-extrabold">
              Contact Support →
            </Link>
          </div>

        </div>
      </section>
      
    </div>
  );
}
