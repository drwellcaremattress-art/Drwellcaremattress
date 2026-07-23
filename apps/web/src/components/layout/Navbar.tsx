"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Menu, ShieldCheck, Truck, Search, Moon, Phone, Mail, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { toggleCart, items } = useCartStore();
  const itemCount = items.reduce((total, item) => total + item.qty, 0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/collections?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="absolute w-full z-50 top-0 left-0 right-0">
      {/* Top Contact & Trust Bar */}
      <div className="bg-[#0682E4] border-b border-[#0682E4]/20 text-[11px] py-2 px-6 flex items-center justify-between font-bold tracking-wide shadow-sm text-white">
        
        {/* Contact Info (Hidden on very small screens) */}
        <div className="hidden md:flex items-center gap-6">
          <a href="tel:9342922044" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
            <Phone className="w-3.5 h-3.5" />
            <span>+91 93429 22044</span>
          </a>
          <a href="mailto:drwellcaremattress@gmail.com" className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
            <Mail className="w-3.5 h-3.5" />
            <span>drwellcaremattress@gmail.com</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 md:gap-6 w-full md:w-auto text-[12px]">
          <div className="flex items-center gap-2">
            <Moon className="w-3.5 h-3.5 text-white"/>
            <span className="text-white">100-Night Trial</span>
          </div>
          <span className="opacity-30 font-light text-[10px] text-white hidden sm:inline">|</span>
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-white"/>
            <span className="text-white">Free Shipping</span>
          </div>
          <span className="opacity-30 font-light text-[10px] text-white hidden sm:inline">|</span>
          <div className="flex items-center gap-2 hidden sm:flex">
            <ShieldCheck className="w-3.5 h-3.5 text-white"/>
            <span className="text-white">
              10-Year <span className="relative inline-block text-white">
                Warranty
                <svg className="absolute w-full h-1 -bottom-0.5 left-0 text-white/50" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 10 Q50 20 100 10" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </span>
          </div>
        </div>
      </div>
      
      {/* Main Nav (Flush top, rounded bottom) */}
      <div className="mx-auto w-[98%] max-w-[1600px]">
        <div className="bg-white/90 backdrop-blur-md rounded-b-[24px] shadow-sm h-[80px] px-6 lg:px-10 flex items-center justify-between border-b border-x border-gray-100">
          <div className="flex items-center gap-4">
            <Menu 
              className="h-5 w-5 lg:hidden text-[#0682E4] cursor-pointer" 
              onClick={() => setIsMobileMenuOpen(true)}
            />
            <Link href="/" className="flex items-center justify-center">
              <Image src="/images/logo.png" alt="Dr Well Care Logo" width={150} height={50} className="h-12 w-auto object-contain hover:scale-105 transition-transform" priority />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-center gap-8 xl:gap-12 font-body font-bold text-[15px] text-[#0B1A2A]">
            <Link href="/" className="hover:text-[#0682E4] transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0682E4] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/about" className="hover:text-[#6CB50E] transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#6CB50E] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/collections" className="hover:text-[#0682E4] transition-colors relative group">
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0682E4] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/faq" className="hover:text-[#6CB50E] transition-colors relative group">
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#6CB50E] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/contact" className="hover:text-[#6CB50E] transition-colors relative group">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#6CB50E] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          <div className="flex items-center justify-end gap-2 text-[#0B1A2A]">
            <Button variant="ghost" size="icon" className="hover:text-[#0682E4] hover:bg-[#0682E4]/10 rounded-full transition-colors" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="w-[18px] h-[18px]" strokeWidth={2} />
            </Button>
            <Link href="/login">
              <Button variant="ghost" size="icon" className="hover:text-[#6CB50E] hover:bg-[#6CB50E]/10 rounded-full transition-colors">
                <User className="w-[18px] h-[18px]" strokeWidth={2} />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="hover:text-[#0682E4] hover:bg-[#0682E4]/10 rounded-full transition-colors relative" onClick={toggleCart}>
              <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={2} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-[#0682E4] text-[9px] font-bold text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 mx-auto w-[98%] max-w-[1600px] bg-white rounded-2xl shadow-lg border border-gray-100 p-4 z-40"
            >
              <form onSubmit={handleSearch} className="flex gap-4 items-center">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search mattresses, pillows, or accessories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:border-[#0682E4] focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="bg-[#0682E4] hover:bg-[#0682E4]/90 text-white rounded-xl px-6 py-6 font-bold">
                  Search
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white z-50 flex flex-col shadow-xl lg:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <Image src="/images/logo.png" alt="Dr Well Care Logo" width={120} height={40} className="h-10 w-auto object-contain" />
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </Button>
              </div>
              <nav className="flex flex-col py-4 font-body font-bold text-[16px] text-[#0B1A2A]">
                <Link href="/" className="px-6 py-4 hover:bg-gray-50 hover:text-[#0682E4] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link href="/about" className="px-6 py-4 hover:bg-gray-50 hover:text-[#6CB50E] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                <Link href="/collections" className="px-6 py-4 hover:bg-gray-50 hover:text-[#0682E4] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
                <Link href="/faq" className="px-6 py-4 hover:bg-gray-50 hover:text-[#6CB50E] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
                <Link href="/contact" className="px-6 py-4 hover:bg-gray-50 hover:text-[#6CB50E] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
              </nav>
              <div className="mt-auto p-6 border-t border-gray-100 text-sm text-gray-500">
                <a href="tel:9342922044" className="flex items-center gap-3 mb-4">
                  <Phone className="w-4 h-4 text-[#0682E4]" />
                  +91 93429 22044
                </a>
                <a href="mailto:drwellcaremattress@gmail.com" className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#0682E4]" />
                  drwellcaremattress@gmail.com
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
