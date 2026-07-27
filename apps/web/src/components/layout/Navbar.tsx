"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Menu, ShieldCheck, Search, Phone, Mail, X, ArrowRight, Truck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { useCartStore } from '@/store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { getDeduplicatedCatalog } from '@/lib/catalog';

export function Navbar() {
  const pathname = usePathname();
  const { toggleCart, items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const itemCount = mounted ? items.reduce((total, item) => total + item.qty, 0) : 0;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const matchingProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.trim().toLowerCase();
    return getDeduplicatedCatalog().filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.subtitle.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      (p.badge && p.badge.toLowerCase().includes(query)) ||
      (p.thickness && p.thickness.toLowerCase().includes(query))
    ).slice(0, 6);
  }, [searchQuery]);

  if (pathname === '/login') return null;

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
            <Truck className="w-3.5 h-3.5 text-white"/>
            <span className="text-white">
              Free <span className="relative inline-block text-white">
                Shipping
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
              <Image src="/images/logo.png" alt="Dr Well Care Logo" width={200} height={65} className="h-14 sm:h-[58px] w-auto object-contain hover:scale-105 transition-transform" priority />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-9 font-body font-bold text-[14px] xl:text-[15px] text-[#0B1A2A]">
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
            <Link href="/collections?type=Luxury+HR+Series" className="hover:text-[#6CB50E] transition-colors relative group text-[#6CB50E] font-bold flex items-center gap-1 bg-[#6CB50E]/10 px-3 py-1.5 rounded-full border border-[#6CB50E]/30">
              Luxury HR Series
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#6CB50E] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/collections?type=Bonded+Series" className="hover:text-[#0682E4] transition-colors relative group text-[#0682E4] font-bold flex items-center gap-1 bg-[#0682E4]/10 px-3 py-1.5 rounded-full border border-[#0682E4]/30">
              Bonded Series
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
            <Link href="/account">
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
              className="absolute top-full left-0 right-0 mt-2 mx-auto w-[98%] max-w-[1600px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 sm:p-6 z-50"
            >
              <form onSubmit={handleSearch} className="flex gap-4 items-center">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search mattresses (e.g. Orthopaedic, Memory Foam, Latex, 8 Inch, King Size)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 focus:border-[#0682E4] focus:bg-white rounded-xl outline-none transition-all text-sm font-semibold text-[#0B1A2A]"
                    autoFocus
                  />
                  {searchQuery && (
                    <button 
                      type="button" 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Button type="submit" className="bg-[#0682E4] hover:bg-[#0682E4]/90 text-white rounded-xl px-8 py-6 font-bold shadow-md shrink-0">
                  Search
                </Button>
              </form>

              {/* Live Search Results Dropdown List */}
              {searchQuery.trim() && (
                <div className="mt-5 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-2">
                    <span>Relevant Products ({matchingProducts.length})</span>
                    <Link 
                      href={`/collections?search=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="text-[#0682E4] hover:underline flex items-center gap-1 font-bold"
                    >
                      View All Results <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {matchingProducts.length === 0 ? (
                    <div className="py-10 text-center text-sm text-gray-500 font-medium bg-gray-50/80 rounded-2xl border border-dashed border-gray-200">
                      No mattresses or sleep products found matching "{searchQuery}".
                      <div className="mt-2 text-xs text-gray-400">Try searching for "Ortho", "Latex", "Memory Foam", or "Bonded".</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                      {matchingProducts.map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/product/${prod.slug}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 transition-all group border border-gray-100/80 hover:border-gray-200 hover:shadow-sm"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gray-100 relative overflow-hidden shrink-0 shadow-inner">
                              <Image src={prod.image} alt={prod.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div>
                              <h4 className="text-sm font-extrabold text-[#0B1A2A] group-hover:text-[#0682E4] transition-colors line-clamp-1">{prod.title}</h4>
                              <p className="text-xs font-semibold text-[#7cb93e] mt-0.5 line-clamp-1">{prod.subtitle}</p>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 font-medium">
                                <span className="bg-gray-100 px-2 py-0.5 rounded-md font-mono">{prod.thickness}</span>
                                <span>• {prod.warranty || 10}Y Warranty</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0 pl-3">
                            <div className="text-xs uppercase font-bold text-gray-400">From</div>
                            <div className="text-base font-black text-[#0B1A2A]">{prod.price}</div>
                            {prod.originalPrice && (
                              <div className="text-[11px] text-gray-400 line-through font-mono">₹{prod.originalPrice.toLocaleString('en-IN')}</div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
                <Link href="/collections?type=Luxury+HR+Series" className="px-6 py-3 bg-[#6CB50E]/10 text-[#6CB50E] font-bold mx-6 my-1 rounded-xl hover:bg-[#6CB50E]/20 transition-colors flex items-center justify-between border border-[#6CB50E]/30" onClick={() => setIsMobileMenuOpen(false)}>
                  <span>Luxury HR Series</span>
                  <span className="text-[10px] bg-[#6CB50E] text-white font-bold px-2 py-0.5 rounded">Flagship</span>
                </Link>
                <Link href="/collections?type=Bonded+Series" className="px-6 py-3 bg-[#0682E4]/10 text-[#0682E4] font-bold mx-6 my-1 rounded-xl hover:bg-[#0682E4]/20 transition-colors flex items-center justify-between border border-[#0682E4]/30" onClick={() => setIsMobileMenuOpen(false)}>
                  <span>Bonded Series</span>
                  <span className="text-[10px] bg-[#0682E4] text-white font-bold px-2 py-0.5 rounded">80kg+ Support</span>
                </Link>
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
