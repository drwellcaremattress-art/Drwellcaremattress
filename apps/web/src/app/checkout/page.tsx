"use client";

import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { CreditCard, Truck, User, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
    payment: 'razorpay'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (items.length === 0) return alert('Cart is empty');
    
    // In a real app we'd redirect to login if no session, but we will assume they might be guest or handle it here
    const token = (session as any)?.accessToken;
    if (!token) {
      alert("Please login first to checkout (Mock limitation)");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        orderItems: items.map(i => ({
          productId: i.id, // Ensure this matches DB format, assuming it does for mock
          variantSku: i.size,
          qty: i.qty,
          price: i.price
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.pinCode,
          country: 'India'
        },
        billingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.pinCode,
          country: 'India'
        },
        paymentMethod: formData.payment,
        itemsPrice: subtotal,
        taxPrice: 0,
        shippingPrice: shipping,
        totalPrice: total,
      };

      const res = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        alert("Order placed successfully!");
        clearCart();
        router.push('/');
      } else {
        const error = await res.json();
        alert(`Error placing order: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-alt min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl grid lg:grid-cols-3 gap-12">
        
        {/* Checkout Form - 2/3 width */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="flex items-center gap-2 text-ink-muted mb-8">
            <Link href="/collections" className="hover:text-primary-blue flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to shopping
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <User className="h-6 w-6 text-primary-blue" />
              Contact Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-ink-muted mb-1">First Name</label>
                <input name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full border-border rounded-lg p-3 focus:ring-2 focus:ring-primary-blue outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-ink-muted mb-1">Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full border-border rounded-lg p-3 focus:ring-2 focus:ring-primary-blue outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-ink-muted mb-1">Email Address</label>
                <input name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full border-border rounded-lg p-3 focus:ring-2 focus:ring-primary-blue outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-ink-muted mb-1">Phone Number (For delivery updates)</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full border-border rounded-lg p-3 focus:ring-2 focus:ring-primary-blue outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <Truck className="h-6 w-6 text-primary-blue" />
              Shipping Address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-ink-muted mb-1">Street Address</label>
                <input name="address" value={formData.address} onChange={handleInputChange} type="text" className="w-full border-border rounded-lg p-3 focus:ring-2 focus:ring-primary-blue outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-ink-muted mb-1">City</label>
                <input name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full border-border rounded-lg p-3 focus:ring-2 focus:ring-primary-blue outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-ink-muted mb-1">State</label>
                <select name="state" value={formData.state} onChange={handleInputChange} className="w-full border-border rounded-lg p-3 focus:ring-2 focus:ring-primary-blue outline-none bg-white">
                  <option>Maharashtra</option>
                  <option>Delhi</option>
                  <option>Karnataka</option>
                  <option>Tamil Nadu</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-ink-muted mb-1">PIN Code</label>
                <input name="pinCode" value={formData.pinCode} onChange={handleInputChange} type="text" className="w-full border-border rounded-lg p-3 focus:ring-2 focus:ring-primary-blue outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-soft p-8">
            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-primary-blue" />
              Payment Method
            </h2>
            
            <div className="space-y-4">
              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${formData.payment === 'razorpay' ? 'border-primary-blue bg-primary-blue-light' : 'border-surface-alt hover:bg-surface-alt'}`}>
                <input type="radio" name="payment" value="razorpay" checked={formData.payment === 'razorpay'} onChange={handleInputChange} className="text-primary-blue focus:ring-primary-blue h-5 w-5" />
                <div className="flex-grow">
                  <span className="font-bold text-ink block">Razorpay (Cards, UPI, NetBanking)</span>
                  <span className="text-xs text-ink-muted">Securely process payments via Razorpay India</span>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${formData.payment === 'stripe' ? 'border-primary-blue bg-primary-blue-light' : 'border-surface-alt hover:bg-surface-alt'}`}>
                <input type="radio" name="payment" value="stripe" checked={formData.payment === 'stripe'} onChange={handleInputChange} className="text-primary-blue focus:ring-primary-blue h-5 w-5" />
                <div className="flex-grow">
                  <span className="font-bold text-ink block">Stripe (International Cards)</span>
                  <span className="text-xs text-ink-muted">For international credit card payments</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Order Summary - 1/3 width */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-soft p-8 sticky top-24">
            <h2 className="font-heading text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.length === 0 ? (
                <p className="text-ink-muted text-sm">Your cart is empty.</p>
              ) : items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-surface-alt flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-1 -right-1 bg-ink text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-heading font-semibold text-sm line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-ink-muted mb-1">{item.size}</p>
                    <p className="font-mono text-sm font-bold">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-surface-alt pt-6 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Subtotal</span>
                <span className="font-mono font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Shipping</span>
                <span className="text-brand-green font-medium uppercase text-xs">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-surface-alt pt-3 mt-3">
                <span>Total</span>
                <span className="font-mono">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Button onClick={handleCheckout} disabled={loading || items.length === 0} size="lg" className="w-full bg-primary-blue hover:bg-primary-blue-dark text-white rounded-full text-lg shadow-lg shadow-primary-blue/20">
              {loading ? 'Processing...' : 'Pay Now (Mock)'}
            </Button>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-muted">
              <ShieldCheck className="h-4 w-4" />
              Secure 256-bit SSL encryption.
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
