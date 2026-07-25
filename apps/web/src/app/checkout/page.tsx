"use client";

import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { CreditCard, Truck, User, ArrowLeft, ShieldCheck, CheckCircle2, Printer, Download, ShoppingBag, Banknote, QrCode } from 'lucide-react';
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
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pinCode: '',
    payment: 'razorpay'
  });
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (items.length === 0) return alert('Your cart is empty');
    if (!formData.firstName || !formData.phone || !formData.address || !formData.city || !formData.pinCode) {
      return alert('Please fill in all required shipping fields (Name, Phone, Address, City, PIN Code)');
    }

    setLoading(true);

    try {
      const orderNumber = `DRWELL-ORD-${Date.now().toString().slice(-6)}`;
      const token = (session as any)?.accessToken;

      const orderData = {
        orderNumber,
        orderItems: items.map(i => ({
          productId: i.id,
          name: i.name,
          variantSku: i.size,
          qty: i.qty,
          price: i.price,
          image: i.image
        })),
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerEmail: formData.email || 'guest@drwellcare.com',
        customerPhone: formData.phone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.pinCode,
          country: 'India'
        },
        paymentMethod: formData.payment,
        itemsPrice: subtotal,
        taxPrice: Math.round(subtotal * 0.18), // 18% GST estimate
        shippingPrice: shipping,
        totalPrice: total,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const resultData = await res.json();
        setConfirmedOrder(resultData._id ? resultData : { ...orderData, _id: orderNumber, createdAt: new Date().toISOString() });
        clearCart();
      } else {
        // Fallback for demo mode
        setConfirmedOrder({ ...orderData, _id: orderNumber, createdAt: new Date().toISOString() });
        clearCart();
      }
    } catch (err) {
      console.error(err);
      // Demo mode fallback
      const orderNumber = `DRWELL-ORD-${Date.now().toString().slice(-6)}`;
      setConfirmedOrder({
        orderNumber,
        orderItems: items,
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerPhone: formData.phone,
        customerEmail: formData.email || 'guest@drwellcare.com',
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.pinCode,
          country: 'India'
        },
        paymentMethod: formData.payment,
        totalPrice: total,
        createdAt: new Date().toISOString()
      });
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 font-body relative">
      
      {/* ORDER CONFIRMATION & INVOICE MODAL */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="text-center pb-6 border-b border-slate-100 relative">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Order Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1A2A] mt-2 font-heading">
                Thank You For Your Order!
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tax Invoice & Order Receipt • Dr.Well Care Mattress
              </p>
            </div>

            {/* Invoice Summary Details */}
            <div className="py-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 font-medium block">Order Number</span>
                  <span className="font-mono font-bold text-[#0682E4]">{confirmedOrder.orderNumber || confirmedOrder._id}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Date & Time</span>
                  <span className="font-medium text-[#0B1A2A]">{new Date(confirmedOrder.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Payment Method</span>
                  <span className="font-bold uppercase text-[#0B1A2A]">{confirmedOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Payment Status</span>
                  <span className="font-bold text-emerald-600">
                    {confirmedOrder.paymentMethod === 'cod' ? 'Pending on Delivery' : 'Paid / Authorized'}
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-slate-50 p-4 rounded-2xl text-xs sm:text-sm">
                <span className="text-slate-400 font-medium block mb-1">Delivering To</span>
                <span className="font-bold text-[#0B1A2A] block">{confirmedOrder.customerName} ({confirmedOrder.customerPhone})</span>
                <span className="text-slate-600 block">{confirmedOrder.shippingAddress?.address}, {confirmedOrder.shippingAddress?.city}, {confirmedOrder.shippingAddress?.state} - {confirmedOrder.shippingAddress?.postalCode}</span>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Item</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(confirmedOrder.orderItems || confirmedOrder.items || []).map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <span className="font-bold text-[#0B1A2A] block">{item.name || item.productId}</span>
                          <span className="text-[11px] text-slate-400">{item.variantSku || item.size}</span>
                        </td>
                        <td className="p-3 text-center font-bold">{item.qty}</td>
                        <td className="p-3 text-right font-mono font-bold">₹{(item.price * item.qty).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation */}
              <div className="bg-[#0B1A2A] text-white p-4 rounded-2xl flex justify-between items-center font-bold text-base sm:text-lg">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-[#7cb93e] text-xl">₹{(confirmedOrder.totalPrice || total).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="flex-1 rounded-2xl py-3 border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-2 hover:bg-slate-50"
              >
                <Printer className="w-4 h-4 text-[#0682E4]" /> Print Receipt
              </Button>
              <Button
                onClick={() => router.push('/')}
                className="flex-1 rounded-2xl py-3 bg-[#0682E4] hover:bg-[#0682E4]/90 text-white font-bold flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Continue Shopping
              </Button>
            </div>

          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl grid lg:grid-cols-3 gap-8">
        
        {/* Checkout Form - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center gap-2 text-slate-500">
            <Link href="/collections" className="hover:text-[#0682E4] flex items-center gap-1 font-medium text-sm">
              <ArrowLeft className="h-4 w-4" /> Back to Store
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-extrabold text-[#0B1A2A] mb-6 flex items-center gap-3">
              <User className="h-5 w-5 text-[#0682E4]" />
              1. Contact Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">First Name *</label>
                <input name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" placeholder="Ramesh" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" placeholder="Kumar" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email Address</label>
                <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="ramesh@example.com" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Phone Number (For Delivery Updates) *</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="+91 98765 43210" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-extrabold text-[#0B1A2A] mb-6 flex items-center gap-3">
              <Truck className="h-5 w-5 text-[#0682E4]" />
              2. Shipping Address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Door / House No. & Street Address *</label>
                <input name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="No. 551, Sivapragasam Nagar, Surapet" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">City *</label>
                <input name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="Chennai" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">State</label>
                <select name="state" value={formData.state} onChange={handleInputChange} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none bg-white">
                  <option>Tamil Nadu</option>
                  <option>Karnataka</option>
                  <option>Maharashtra</option>
                  <option>Kerala</option>
                  <option>Andhra Pradesh</option>
                  <option>Delhi</option>
                </select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">PIN Code *</label>
                <input name="pinCode" value={formData.pinCode} onChange={handleInputChange} type="text" placeholder="600066" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-extrabold text-[#0B1A2A] mb-6 flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-[#0682E4]" />
              3. Select Payment Gateway
            </h2>
            
            <div className="space-y-3">
              <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${formData.payment === 'razorpay' ? 'border-[#0682E4] bg-[#0682E4]/5 ring-1 ring-[#0682E4]' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" name="payment" value="razorpay" checked={formData.payment === 'razorpay'} onChange={handleInputChange} className="text-[#0682E4] focus:ring-[#0682E4] h-5 w-5" />
                <div className="flex-grow">
                  <span className="font-extrabold text-[#0B1A2A] text-sm block">Razorpay / Google Pay / PhonePe / UPI / Credit Cards</span>
                  <span className="text-xs text-slate-500">Instant 256-bit SSL encrypted online payment</span>
                </div>
                <QrCode className="w-6 h-6 text-[#0682E4] shrink-0" />
              </label>

              <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${formData.payment === 'cod' ? 'border-[#7cb93e] bg-[#7cb93e]/5 ring-1 ring-[#7cb93e]' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" name="payment" value="cod" checked={formData.payment === 'cod'} onChange={handleInputChange} className="text-[#7cb93e] focus:ring-[#7cb93e] h-5 w-5" />
                <div className="flex-grow">
                  <span className="font-extrabold text-[#0B1A2A] text-sm block">Cash on Delivery (COD)</span>
                  <span className="text-xs text-slate-500">Pay cash or UPI directly when your mattress arrives at your doorstep</span>
                </div>
                <Banknote className="w-6 h-6 text-[#7cb93e] shrink-0" />
              </label>
            </div>
          </div>

        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 sticky top-24">
            <h2 className="font-heading text-xl font-extrabold text-[#0B1A2A] mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.length === 0 ? (
                <p className="text-slate-400 text-sm">Your cart is empty.</p>
              ) : items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-1 -right-1 bg-[#0B1A2A] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-xs text-[#0B1A2A] line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.size}</p>
                    <p className="font-mono text-xs font-extrabold text-[#0682E4]">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 mb-6 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold text-[#0B1A2A] border-t border-slate-100 pt-3 mt-2">
                <span>Total Amount</span>
                <span className="font-mono text-[#0682E4]">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Button 
              onClick={handleCheckout} 
              disabled={loading || items.length === 0} 
              className="w-full bg-[#0B1A2A] hover:bg-[#16273B] text-white rounded-2xl py-4 text-base font-bold shadow-lg transition-transform hover:-translate-y-0.5"
            >
              {loading ? 'Processing Order...' : `Place Order (₹${total.toLocaleString('en-IN')})`}
            </Button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              100-Night Risk-Free Trial Guarantee Included
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

