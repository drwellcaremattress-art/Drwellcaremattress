"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Search, ShoppingBag, ShieldCheck, Phone, ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-[88vh] bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col items-center justify-center p-4 pt-24 font-body relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0682E4]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7cb93e]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10">
        
        <div className="w-24 h-24 bg-[#0B1A2A] text-[#7cb93e] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-200">
          <Compass className="w-12 h-12 animate-spin-slow" />
        </div>

        <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#0682E4] text-xs font-black uppercase tracking-widest rounded-full mb-4 border border-blue-200">
          Error 404 — Page Not Found
        </span>

        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-[#0B1A2A] mb-4 tracking-tight">
          Rest Area <span className="text-[#0682E4]">Not Found.</span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-10 font-medium">
          Looks like you wandered off the sleep track. The mattress, collection, or page you are looking for has been moved or no longer exists.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <Link href="/">
            <Button className="bg-[#0B1A2A] hover:bg-[#162a42] text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg flex items-center gap-2 text-base">
              <Home className="w-5 h-5 text-[#7cb93e]" /> Back to Homepage
            </Button>
          </Link>

          <Link href="/collections">
            <Button variant="outline" className="border-slate-300 hover:bg-slate-100 text-slate-800 font-bold px-8 py-4 rounded-2xl flex items-center gap-2 text-base">
              <ShoppingBag className="w-5 h-5 text-[#0682E4]" /> Browse All Mattresses
            </Button>
          </Link>
        </div>

        {/* Quick Navigation Cards */}
        <div className="border-t border-slate-200/80 pt-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Explore Popular Destinations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            
            <Link href="/collections" className="p-4 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-[#0682E4] rounded-2xl transition-all group shadow-sm">
              <span className="font-extrabold text-sm text-[#0B1A2A] group-hover:text-[#0682E4] flex items-center justify-between mb-1">
                Orthopaedic Series <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <p className="text-xs text-slate-500">View doctor-recommended lumbar support mattresses.</p>
            </Link>

            <Link href="/quiz" className="p-4 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-[#7cb93e] rounded-2xl transition-all group shadow-sm">
              <span className="font-extrabold text-sm text-[#0B1A2A] group-hover:text-[#7cb93e] flex items-center justify-between mb-1">
                Firmness Quiz <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <p className="text-xs text-slate-500">Take our 1-minute quiz to find your ideal sleep firmness.</p>
            </Link>

            <Link href="/contact" className="p-4 bg-white hover:bg-purple-50/50 border border-slate-200 hover:border-purple-500 rounded-2xl transition-all group shadow-sm">
              <span className="font-extrabold text-sm text-[#0B1A2A] group-hover:text-purple-600 flex items-center justify-between mb-1">
                Support & Contact <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <p className="text-xs text-slate-500">Speak with our sleep consultants or delivery team.</p>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
