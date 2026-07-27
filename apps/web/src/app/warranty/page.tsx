"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Award, 
  HelpCircle, 
  Loader2, 
  Sparkles, 
  Download, 
  Phone,
  Calendar,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WarrantyPage() {
  const [activeTab, setActiveTab] = useState<"register" | "claim">("register");
  
  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    phone: "",
    invoiceNo: "",
    model: "Dr. Well Care Orthopaedic Dual Comfort Series",
    size: "King (78 in × 72 in × 8 in)",
    purchaseDate: new Date().toISOString().split("T")[0],
    serialNo: ""
  });
  
  // Claim Form State
  const [claimForm, setClaimForm] = useState({
    warrantyId: "",
    email: "",
    phone: "",
    issueType: "Foam Indentation / Sagging (> 1 inch)",
    description: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccessId, setRegSuccessId] = useState("");
  const [claimSuccessId, setClaimSuccessId] = useState("");
  const [error, setError] = useState("");

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegForm({ ...regForm, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleClaimChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setClaimForm({ ...claimForm, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!regForm.name.trim() || !regForm.email.trim() || !regForm.phone.trim()) {
      setError("Please fill in all required contact fields (Name, Email, Phone).");
      return;
    }
    if (!regForm.invoiceNo.trim()) {
      setError("Please enter your Order ID or Invoice Number (e.g. DW-8492 or Amazon/Flipkart Order ID).");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedWarId = `WAR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setRegSuccessId(generatedWarId);
      
      // Save to localStorage so user can see it in account if logged in
      try {
        const existingProfStr = localStorage.getItem("drwell_user_profile");
        if (existingProfStr) {
          const prof = JSON.parse(existingProfStr);
          prof.warrantyId = generatedWarId;
          prof.registeredModel = regForm.model;
          localStorage.setItem("drwell_user_profile", JSON.stringify(prof));
        }
      } catch (err) {}
    }, 1200);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!claimForm.warrantyId.trim() && !claimForm.email.trim()) {
      setError("Please enter either your Registered Warranty ID or your Email address.");
      return;
    }
    if (!claimForm.description.trim() || claimForm.description.trim().length < 15) {
      setError("Please describe the issue in detail (at least 15 characters) so our inspection team can evaluate it.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedClaimId = `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
      setClaimSuccessId(generatedClaimId);
    }, 1200);
  };

  const coverageDetails = [
    {
      title: "What IS Covered Under 10-Year Warranty",
      items: [
        "Visible indentation or sagging greater than 1 inch (2.5 cm) not caused by improper foundation.",
        "Physical flaws in the core orthopaedic foam layers causing premature deterioration.",
        "Manufacturing defects in the outer breathable zippered cover fabric.",
        "Splitting or cracking of the foam material despite normal usage."
      ],
      type: "covered",
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-950"
    },
    {
      title: "What IS NOT Covered (Exclusions)",
      items: [
        "Normal softening of memory foam over time that does not affect orthopaedic support.",
        "Personal comfort preferences or changes in firmness preference over time.",
        "Physical damage from spills, stains, burns, cuts, or improper support frame.",
        "Mattresses sold by unauthorized resellers or second-hand purchases."
      ],
      type: "excluded",
      color: "border-red-200 bg-red-50/50 text-red-950"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20 font-body">
      
      {/* Hero Banner */}
      <section className="bg-[#0B1A2A] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7cb93e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0682E4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#7cb93e] font-bold text-xs uppercase tracking-wider mb-4 border border-white/10">
            <Award className="w-4 h-4" /> Official 10-Year Protection
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
            10-Year Orthopaedic <span className="text-[#7cb93e]">Warranty Portal</span>
          </h1>
          <p className="text-base sm:text-lg text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Every Dr. Well Care mattress is engineered to maintain its structural integrity for a decade. Register your purchase online or submit a warranty inspection claim with ease.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="container mx-auto px-4 py-16 max-w-5xl -mt-8 relative z-20">
        
        {/* Tab Navigation Bar */}
        <div className="bg-white rounded-3xl p-2 shadow-lg border border-slate-200/80 flex max-w-xl mx-auto mb-12">
          <button
            onClick={() => { setActiveTab("register"); setError(""); setRegSuccessId(""); }}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "register"
                ? "bg-[#0B1A2A] text-white shadow-md"
                : "text-slate-600 hover:text-[#0B1A2A] hover:bg-slate-50"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#7cb93e]" /> Register New Warranty
          </button>
          <button
            onClick={() => { setActiveTab("claim"); setError(""); setClaimSuccessId(""); }}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "claim"
                ? "bg-[#0682E4] text-white shadow-md"
                : "text-slate-600 hover:text-[#0682E4] hover:bg-slate-50"
            }`}
          >
            <FileText className="w-4 h-4 text-white" /> File Support Claim
          </button>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs sm:text-sm font-semibold shadow-sm max-w-3xl mx-auto"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Sections */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-12 mb-16">
          
          {/* TAB 1: REGISTRATION FORM */}
          {activeTab === "register" && (
            <div>
              {regSuccessId ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                    <Award className="w-10 h-10 animate-bounce" />
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#0B1A2A]">Warranty Certificate Activated!</h2>
                  <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
                    Congratulations, <span className="font-bold text-[#0B1A2A]">{regForm.name}</span>! Your 10-Year Orthopaedic Warranty has been officially registered and verified in our central Chennai database.
                  </p>
                  
                  <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl max-w-md mx-auto text-left space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold uppercase tracking-wider">Certificate ID:</span>
                      <span className="font-mono font-extrabold text-base text-[#0682E4] bg-blue-100/50 px-3 py-1 rounded-lg border border-blue-200">{regSuccessId}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-bold">Registered Model:</span>
                      <span className="font-bold text-[#0B1A2A] truncate max-w-[200px]">{regForm.model}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-bold">Valid Until:</span>
                      <span className="font-bold text-emerald-600">{new Date().getFullYear() + 10} (Full 10 Years)</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap justify-center gap-4">
                    <Button onClick={() => window.print()} className="bg-[#0682E4] hover:bg-[#7cb93e] text-white font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 transition-colors">
                      <Download className="w-4 h-4 text-white" /> Print / Save Certificate (.PDF)
                    </Button>
                    <Link href="/account">
                      <Button variant="outline" className="border-slate-300 hover:bg-slate-100 text-slate-800 font-bold px-6 py-3.5 rounded-xl">
                        View in Account Profile
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-6" noValidate>
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h3 className="font-heading text-xl font-extrabold text-[#0B1A2A] flex items-center gap-2">
                      <Tag className="w-5 h-5 text-[#0682E4]" /> 1. Customer & Purchase Details
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Enter the details as they appear on your purchase invoice or delivery confirmation.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Full Name *</label>
                      <input type="text" name="name" value={regForm.name} onChange={handleRegChange} placeholder="Ramesh Kumar" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Email Address *</label>
                      <input type="email" name="email" value={regForm.email} onChange={handleRegChange} placeholder="ramesh@example.com" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Phone Number *</label>
                      <input type="tel" name="phone" value={regForm.phone} onChange={handleRegChange} placeholder="+91 98765 43210" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium" />
                    </div>
                  </div>

                  <div className="border-b border-slate-100 pb-4 mb-6 pt-4">
                    <h3 className="font-heading text-xl font-extrabold text-[#0B1A2A] flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#7cb93e]" /> 2. Mattress Specifications
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Order ID / Invoice Number *</label>
                      <input type="text" name="invoiceNo" value={regForm.invoiceNo} onChange={handleRegChange} placeholder="e.g. DW-8492 or Amazon/Flipkart Order ID" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Purchase Date *</label>
                      <input type="date" name="purchaseDate" value={regForm.purchaseDate} onChange={handleRegChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Mattress Series Model *</label>
                      <select name="model" value={regForm.model} onChange={handleRegChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium text-slate-700">
                        <option value="Dr. Well Care Orthopaedic Dual Comfort Series">Dr. Well Care Orthopaedic Dual Comfort Series</option>
                        <option value="Dr. Well Care Memory Foam Cloud Series">Dr. Well Care Memory Foam Cloud Series</option>
                        <option value="Dr. Well Care Natural Latex Hybrid Series">Dr. Well Care Natural Latex Hybrid Series</option>
                        <option value="Dr. Well Care Pocket Spring Hotel Series">Dr. Well Care Pocket Spring Hotel Series</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Mattress Size *</label>
                      <select name="size" value={regForm.size} onChange={handleRegChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium text-slate-700">
                        <option value="King (78 in × 72 in × 8 in)">King (78 in × 72 in × 8 in)</option>
                        <option value="Queen (78 in × 60 in × 6 in)">Queen (78 in × 60 in × 6 in)</option>
                        <option value="Double (72 in × 48 in × 6 in)">Double (72 in × 48 in × 6 in)</option>
                        <option value="Single (72 in × 36 in × 6 in)">Single (72 in × 36 in × 6 in)</option>
                        <option value="Custom Cot Size (Specified on Order)">Custom Cot Size (Specified on Order)</option>
                      </select>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-[#0682E4] hover:bg-[#7cb93e] text-white font-black py-4 rounded-xl text-base shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying & Registering...</> : <><ShieldCheck className="w-5 h-5 text-white" /> Activate 10-Year Warranty</>}
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: CLAIM FORM */}
          {activeTab === "claim" && (
            <div>
              {claimSuccessId ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-blue-500/30">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-black text-[#0B1A2A]">Inspection Ticket #<span className="font-mono text-[#0682E4]">{claimSuccessId}</span> Filed</h2>
                  <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
                    Our quality control team at the Surapet Chennai plant has received your claim. A senior technical officer will review the details and contact you within 24 hours to schedule a complimentary home inspection.
                  </p>
                  <div className="pt-4">
                    <Button onClick={() => setClaimSuccessId("")} className="bg-[#0682E4] hover:bg-[#7cb93e] text-white font-bold px-8 py-3.5 rounded-xl transition-colors">
                      Submit Another Query
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleClaimSubmit} className="space-y-6" noValidate>
                  <div className="border-b border-slate-100 pb-4 mb-6">
                    <h3 className="font-heading text-xl font-extrabold text-[#0B1A2A] flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#0682E4]" /> File a Warranty Support Claim
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">We will dispatch an orthopaedic technical specialist to inspect and resolve your issue.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Registered Warranty ID or Order ID *</label>
                      <input type="text" name="warrantyId" value={claimForm.warrantyId} onChange={handleClaimChange} placeholder="e.g. WAR-2026-84921 or DW-8492" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Registered Email Address *</label>
                      <input type="email" name="email" value={claimForm.email} onChange={handleClaimChange} placeholder="ramesh@example.com" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Phone Number for Inspection *</label>
                      <input type="tel" name="phone" value={claimForm.phone} onChange={handleClaimChange} placeholder="+91 98765 43210" className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Issue Classification *</label>
                      <select name="issueType" value={claimForm.issueType} onChange={handleClaimChange} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium text-slate-700">
                        <option value="Foam Indentation / Sagging (> 1 inch)">Foam Indentation / Sagging (&gt; 1 inch)</option>
                        <option value="Outer Zipper / Cover Stitching Flaw">Outer Zipper / Cover Stitching Flaw</option>
                        <option value="Foam Layer Splitting / Cracking">Foam Layer Splitting / Cracking</option>
                        <option value="Size Measurement Discrepancy">Size Measurement Discrepancy</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Detailed Description of Issue *</label>
                    <textarea name="description" rows={4} value={claimForm.description} onChange={handleClaimChange} placeholder="Please explain when the issue was noticed and where on the mattress it is located..." className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-slate-50/50 focus:bg-white font-medium resize-none" />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-[#0682E4] hover:bg-[#056ec1] text-white font-black py-4 rounded-xl text-base shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Transmitting Claim Data...</> : <><FileText className="w-5 h-5" /> Submit Warranty Inspection Request</>}
                  </Button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Coverage Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coverageDetails.map((cov, idx) => (
            <div key={idx} className={`p-6 sm:p-8 rounded-3xl border ${cov.color} shadow-sm space-y-4`}>
              <h3 className="font-heading text-lg font-black flex items-center gap-2">
                {cov.type === "covered" ? <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" /> : <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />}
                {cov.title}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {cov.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${cov.type === "covered" ? "bg-emerald-500" : "bg-red-400"}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </section>
      
    </div>
  );
}
