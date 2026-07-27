"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Sparkles, 
  Wind, 
  Cloud, 
  Layers, 
  Info, 
  Store, 
  HelpCircle, 
  Mail, 
  Lock, 
  PhoneCall, 
  MessageCircle,
  MapPin,
  ChevronRight,
  Download
} from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  
  if (pathname === '/login') return null;

  return (
    <footer className="bg-[#0e3b3e] text-white pt-10 lg:pt-12 pb-0 relative overflow-hidden font-body">
      {/* Background glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7cb93e]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#0682E4]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Main 2-column top container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-8">
          
          {/* LEFT COLUMN: Logo Image, Tagline, & Creative Contact Buttons */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand Logo & Tagline */}
            <div>
              <Link href="/" className="inline-block bg-white/95 p-3 rounded-2xl shadow-lg border border-white/20 hover:scale-[1.02] transition-transform">
                <Image 
                  src="/images/logo.png" 
                  alt="Dr Well Care Logo" 
                  width={240} 
                  height={75} 
                  className="h-14 sm:h-16 w-auto object-contain"
                  priority 
                />
              </Link>
              <p className="text-[#a7c4c5] text-sm sm:text-base leading-snug mt-3 max-w-md font-normal">
                Orthopaedic & Wellness Mattress D2C Platform. Say No To Back Pain.
              </p>
            </div>

            {/* Address, Phone & Email info */}
            <div className="space-y-2.5 text-xs sm:text-sm text-[#a7c4c5] pt-1">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#174e51] flex items-center justify-center shrink-0 border border-white/10">
                  <PhoneCall className="w-3.5 h-3.5 text-[#7cb93e]" />
                </div>
                <a href="tel:9342922044" className="font-medium text-white hover:text-[#7cb93e] transition-colors">
                  +91 93429 22044
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#174e51] flex items-center justify-center shrink-0 border border-white/10">
                  <Mail className="w-3.5 h-3.5 text-[#7cb93e]" />
                </div>
                <a href="mailto:drwellcaremattress@gmail.com" className="font-medium text-white hover:text-[#7cb93e] transition-colors break-all">
                  drwellcaremattress@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <div className="w-7 h-7 rounded-full bg-[#174e51] flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#7cb93e]" />
                </div>
                <span className="leading-relaxed">No. 551, Sivapragasam Nagar, Surapet, Chennai-600066.</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Shop & Support Links with Icons + 3 Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Top Row: Shop & Support side-by-side with icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
              
              {/* Shop Column */}
              <div className="relative pr-4">
                <h3 className="font-heading font-extrabold text-xl text-white mb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#0682E4]" />
                  Shop
                </h3>
                <ul className="space-y-2.5 text-[#a7c4c5] text-sm font-medium">
                  <li>
                    <Link href="/collections?type=Bonded+Series" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                      <div className="w-6 h-6 rounded-md bg-[#0682E4]/20 flex items-center justify-center text-[#0682E4] group-hover:bg-[#0682E4] group-hover:text-white transition-colors">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <span>Bonded Series (80kg+)</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/collections?type=Luxury+HR+Series" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                      <div className="w-6 h-6 rounded-md bg-[#6CB50E]/20 flex items-center justify-center text-[#6CB50E] group-hover:bg-[#6CB50E] group-hover:text-white transition-colors">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span>Luxury HR Series</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/collections?type=Latex" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                      <div className="w-6 h-6 rounded-md bg-[#22c55e]/20 flex items-center justify-center text-[#22c55e] group-hover:bg-[#22c55e] group-hover:text-white transition-colors">
                        <Wind className="w-3.5 h-3.5" />
                      </div>
                      <span>Natural Latex Range</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/collections?type=Memory+Foam" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                      <div className="w-6 h-6 rounded-md bg-[#60a5fa]/20 flex items-center justify-center text-[#60a5fa] group-hover:bg-[#60a5fa] group-hover:text-white transition-colors">
                        <Cloud className="w-3.5 h-3.5" />
                      </div>
                      <span>Memory Foam Range</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/collections" className="hover:text-white transition-colors flex items-center gap-2.5 group text-white/90">
                      <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white group-hover:bg-[#0682E4] transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold">View All Collections</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support Column */}
              <div className="relative pr-4">
                <h3 className="font-heading font-extrabold text-xl text-white mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#7cb93e]" />
                  Support
                </h3>
                <ul className="space-y-2.5 text-[#a7c4c5] text-sm font-medium">
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                      <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[#a7c4c5] group-hover:bg-[#7cb93e] group-hover:text-white transition-colors">
                        <Info className="w-3.5 h-3.5" />
                      </div>
                      <span>About Dr Well Care</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/collections" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                      <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[#a7c4c5] group-hover:bg-[#7cb93e] group-hover:text-white transition-colors">
                        <Store className="w-3.5 h-3.5" />
                      </div>
                      <span>Our Showroom</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                      <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[#a7c4c5] group-hover:bg-[#7cb93e] group-hover:text-white transition-colors">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </div>
                      <span>Frequently Asked Questions</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                      <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[#a7c4c5] group-hover:bg-[#7cb93e] group-hover:text-white transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span>Contact Us</span>
                    </Link>
                  </li>
                  <li>
                    <a href="/catalogue-1.pdf" download="DR.WELL CARE CATALOGUE (1).pdf" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                      <div className="w-6 h-6 rounded-md bg-[#7cb93e]/20 flex items-center justify-center text-[#7cb93e] group-hover:bg-[#7cb93e] group-hover:text-white transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[#7cb93e] font-bold">Download Catalogue (PDF)</span>
                    </a>
                  </li>
                  <li>
                    <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-2.5 group">
                      <div className="w-6 h-6 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-amber-300 font-bold">Admin Portal</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Row: 3 Compact Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Card 1: Woman sleeping */}
              <div className="relative h-24 sm:h-28 rounded-xl overflow-hidden border border-white/15 shadow-sm group">
                <Image 
                  src="/images/footer_woman_sleep.png" 
                  alt="Peaceful Orthopaedic Sleep" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              {/* Card 2: 3D Mattress Cutaway */}
              <div className="relative h-24 sm:h-28 rounded-xl overflow-hidden border border-white/15 shadow-sm group bg-[#16494c]">
                <Image 
                  src="/images/footer_mattress_cutaway.png" 
                  alt="Dr Well Care Mattress Construction" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              {/* Card 3: Back Pain Relieved Light Cream Badge Card */}
              <div className="h-24 sm:h-28 rounded-xl bg-[#edf3eb] text-[#0e3b3e] p-3 flex flex-col items-center justify-center text-center shadow-sm border border-white/20">
                <div className="w-8 h-8 rounded-full bg-[#dbe8d8] flex items-center justify-center text-[#0e3b3e] mb-1">
                  <svg className="w-5 h-5 text-[#0e3b3e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="w-16 h-2 my-0.5">
                  <svg viewBox="0 0 100 20" className="w-full h-full text-[#0e3b3e]">
                    <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="4 2" />
                  </svg>
                </div>
                <span className="font-heading font-extrabold text-sm sm:text-base text-[#0e3b3e] tracking-tight">
                  Back Pain Relieved
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Copyright Bar */}
      <div className="bg-[#072426] border-t border-white/10 py-3.5 mt-4">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-[#a7c4c5] text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} Dr Well Care. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

