"use client";

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { X, Minus, Plus, ShoppingBag, ShieldCheck, Truck, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQty, getCartTotal } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={toggleCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-alt bg-slate-900 text-white">
          <div>
            <h2 className="font-heading text-xl font-bold flex items-center gap-2 text-white">
              <ShoppingBag className="h-5 w-5 text-[#7cb93e]" />
              Your Cart ({items.length})
            </h2>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Items Added & Ready
            </span>
          </div>
          <button onClick={toggleCart} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length > 0 && (
            <div className="bg-gradient-to-r from-emerald-50 via-blue-50 to-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-800">Order Clarifications & Assurance</span>
              </div>
              <ul className="text-[11px] space-y-1.5 text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#0682E4] shrink-0" />
                  <span><strong>Free Express Delivery:</strong> Direct factory dispatch in 3-5 days</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span><strong>10-Year Warranty:</strong> Full protection against sagging & defects</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span><strong>100% Secure Checkout:</strong> Razorpay (UPI/Cards) & COD</span>
                </li>
              </ul>
            </div>
          )}

          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-ink-muted">
              <div className="w-48 h-48 sm:w-64 sm:h-64 mb-4">
                <DotLottieReact
                  src="https://lottie.host/1a4e32db-a73c-48f8-9c51-74f3981cf0fa/VQB4P9hSGi.lottie"
                  loop
                  autoplay
                />
              </div>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-surface-alt flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-heading font-semibold text-ink line-clamp-1">{item.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-ink-muted hover:text-error-red">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-ink-muted mt-0.5">Size: {item.size}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-slate-500 font-semibold">Color:</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0B1A2A] text-white text-[11px] font-bold shadow-xs">
                        <span className={`w-2 h-2 rounded-full border border-white/20 ${
                          (item.color || 'White') === 'Blue' ? 'bg-[#0682E4]' : (item.color || 'White') === 'Gray' ? 'bg-slate-400' : 'bg-white'
                        }`} />
                        {item.color || 'White'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <span className="font-mono font-bold text-primary-blue">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                    
                    {/* Qty Stepper */}
                    <div className="flex items-center border border-surface-alt rounded-lg overflow-hidden">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-1.5 hover:bg-surface-alt text-ink">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-1.5 hover:bg-surface-alt text-ink">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-surface-alt bg-surface-alt/30">
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-ink-muted">Subtotal</span>
              <span className="font-mono font-bold text-2xl text-ink">₹{getCartTotal().toLocaleString('en-IN')}</span>
            </div>
            <Button 
              size="lg" 
              onClick={() => {
                toggleCart();
                if (!session) {
                  alert('Please login or create an account first to proceed to checkout!');
                  router.push('/login?callbackUrl=/checkout');
                } else {
                  router.push('/checkout');
                }
              }}
              className="w-full bg-brand-green hover:bg-brand-green-dark text-white rounded-full text-lg shadow-lg shadow-brand-green/20 font-bold"
            >
              Proceed to Checkout
            </Button>
            <p className="text-center text-xs text-ink-muted mt-4 flex items-center justify-center gap-1">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
