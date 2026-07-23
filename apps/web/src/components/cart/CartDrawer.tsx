"use client";

import { useCartStore } from '@/store/cartStore';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQty, getCartTotal } = useCartStore();

  if (!isOpen) return null;

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
        <div className="flex items-center justify-between p-6 border-b border-surface-alt">
          <h2 className="font-heading text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary-blue" />
            Your Cart ({items.length})
          </h2>
          <button onClick={toggleCart} className="p-2 hover:bg-surface-alt rounded-full transition-colors text-ink-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
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
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-heading font-semibold text-ink line-clamp-1">{item.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-ink-muted hover:text-error-red">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-ink-muted">Size: {item.size}</p>
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
            <Link href="/checkout" onClick={toggleCart}>
              <Button size="lg" className="w-full bg-brand-green hover:bg-brand-green-dark text-white rounded-full text-lg shadow-lg shadow-brand-green/20">
                Proceed to Checkout
              </Button>
            </Link>
            <p className="text-center text-xs text-ink-muted mt-4 flex items-center justify-center gap-1">
              Shipping & taxes calculated at checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}
