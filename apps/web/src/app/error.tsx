"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ShieldCheck, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Dr.Well Care Global Application Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center p-4 pt-24 font-body">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-12 text-center relative overflow-hidden">
        
        {/* Top Decorative Alert Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500" />

        <div className="w-20 h-20 bg-amber-50 border border-amber-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner text-amber-600">
          <AlertTriangle className="w-10 h-10 animate-bounce" />
        </div>

        <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[11px] font-extrabold uppercase tracking-wider rounded-full mb-3 border border-red-200">
          Application Exception Caught
        </span>

        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0B1A2A] mb-3">
          Oops! Something Disrupted Your Experience
        </h1>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          Even our orthopaedic support couldn&apos;t cushion this unexpected bump in the road. An error occurred while processing your request or rendering this page.
        </p>

        {error.message && (
          <div className="mb-8 p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-left font-mono text-xs text-slate-700 overflow-x-auto max-h-24">
            <span className="font-bold text-slate-500 block mb-1">Error Details:</span>
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button
            onClick={() => reset()}
            className="bg-[#0682E4] hover:bg-[#056ec1] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again / Reload
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-[#0B1A2A]" /> Return to Homepage
            </Button>
          </Link>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Your account and cart data remain secure</span>
          </div>
          <Link href="/contact" className="text-[#0682E4] font-bold hover:underline flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" /> Contact Support Team
          </Link>
        </div>

      </div>
    </div>
  );
}
