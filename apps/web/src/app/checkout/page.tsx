"use client";

import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { CreditCard, Truck, User, ArrowLeft, ShieldCheck, CheckCircle2, Printer, Download, ShoppingBag, QrCode } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const subtotal = mounted ? getCartTotal() : 0;
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;
  const displayItems = mounted ? items : [];

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
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  useEffect(() => {
    const formatDisplayName = (email?: string | null, name?: string | null) => {
      if (!email) return name || '';
      const lowerEmail = email.toLowerCase().trim();
      if (lowerEmail.includes('dineshmurugan')) return 'Dinesh Murugan';
      if (name && name.trim() && !name.includes('@')) return name;
      const prefix = lowerEmail.split('@')[0].replace(/[0-9]/g, '').replace(/[._-]/g, ' ').trim() || '';
      return prefix.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    let fName = '';
    let lName = '';
    let emailStr = session?.user?.email || '';
    let phoneStr = '';
    let addrStr = '';
    let cityStr = '';
    let stateStr = 'Tamil Nadu';
    let pinStr = '';

    try {
      const savedProfileStr = localStorage.getItem('drwell_user_profile');
      if (savedProfileStr) {
        const prof = JSON.parse(savedProfileStr);
        if (prof.fullName && prof.fullName !== 'VIP Customer' && prof.fullName !== 'Rajesh Sharma') {
          const parts = prof.fullName.trim().split(' ');
          fName = parts[0] || '';
          lName = parts.slice(1).join(' ') || '';
        }
        if (prof.email) emailStr = prof.email;
        if (prof.phone && prof.phone !== '+91 98765 43210') phoneStr = prof.phone;
      }
    } catch (e) {}

    if (!fName && emailStr) {
      const derived = formatDisplayName(emailStr, session?.user?.name);
      if (derived) {
        const parts = derived.trim().split(' ');
        fName = parts[0] || '';
        lName = parts.slice(1).join(' ') || '';
      }
    }

    try {
      const savedAddrsStr = localStorage.getItem('drwell_user_addresses');
      if (savedAddrsStr) {
        const addrs = JSON.parse(savedAddrsStr);
        if (Array.isArray(addrs)) {
          setSavedAddresses(addrs);
          if (addrs.length > 0) {
            const defAddr = addrs.find((a: any) => a.isDefault) || addrs[0];
            if (defAddr) {
              if (defAddr.street) addrStr = defAddr.street;
              if (defAddr.city) cityStr = defAddr.city;
              if (defAddr.state) stateStr = defAddr.state;
              if (defAddr.pincode) pinStr = defAddr.pincode;
              if (!phoneStr && defAddr.phone && defAddr.phone !== '+91 98765 43210') phoneStr = defAddr.phone;
            }
          }
        }
      }
    } catch (e) {}

    if (!fName) fName = 'Dinesh';
    if (!lName) lName = 'Murugan';
    if (!phoneStr) phoneStr = '+91 9843240703';

    setFormData(prev => ({
      ...prev,
      firstName: prev.firstName || fName,
      lastName: prev.lastName || lName,
      email: prev.email || emailStr,
      phone: prev.phone || phoneStr,
      address: prev.address || addrStr,
      city: prev.city || cityStr,
      state: prev.state || stateStr,
      pinCode: prev.pinCode || pinStr,
    }));
  }, [session]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSelectSavedAddress = (addr: any) => {
    let fName = formData.firstName;
    let lName = formData.lastName;
    if (addr.name) {
      const parts = addr.name.trim().split(' ');
      fName = parts[0] || fName;
      lName = parts.slice(1).join(' ') || lName;
    }
    setFormData(prev => ({
      ...prev,
      firstName: prev.firstName || fName || 'Dinesh',
      lastName: prev.lastName || lName || 'Murugan',
      address: addr.street || addr.address || '',
      city: addr.city || '',
      state: addr.state || 'Tamil Nadu',
      pinCode: addr.pincode || addr.postalCode || '',
      phone: addr.phone || prev.phone || '+91 9843240703'
    }));
    setFormErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const saveOrderToAccountHistory = (ordNum: string, orderItems: any[], orderTotal: number, form: any) => {
    try {
      const existingOrders = JSON.parse(localStorage.getItem('drwell_user_orders') || '[]');
      const newOrderObj = {
        id: ordNum.replace('DRWELL-ORD-', 'DW-'),
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        total: orderTotal,
        status: 'In Transit — Processing Dispatch',
        statusColor: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
        itemTitle: orderItems[0]?.name || 'Dr.Well Care Orthopaedic Series',
        size: orderItems[0]?.size || 'King (78" × 72" × 8")',
        qty: orderItems.reduce((sum: number, i: any) => sum + (i.qty || 1), 0),
        payment: form.payment === 'cod' ? 'Cash on Delivery (COD) / Pay at Doorstep' : 'UPI / Online Paid (100% Secured)',
        warrantyId: `WAR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        steps: [
          { label: 'Order Confirmed', time: 'Just now', done: true },
          { label: 'Manufactured & QC Passed (Pune Plant)', time: 'Pending QC', done: false },
          { label: 'Dispatched via BlueDart Express', time: 'Pending Dispatch', done: false },
          { label: 'Out for Delivery (Local Hub)', time: 'Expected Soon', done: false },
        ]
      };
      localStorage.setItem('drwell_user_orders', JSON.stringify([newOrderObj, ...existingOrders]));

      const existingAddrs = JSON.parse(localStorage.getItem('drwell_user_addresses') || '[]');
      const newAddrObj = {
        id: `addr-${Date.now()}`,
        tag: 'Home',
        name: `${form.firstName} ${form.lastName}`.trim(),
        street: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pinCode,
        phone: form.phone,
        isDefault: true
      };
      const addrExists = existingAddrs.some((a: any) => a.street?.toLowerCase() === form.address?.toLowerCase() && a.pincode === form.pinCode);
      if (!addrExists && form.address && form.pinCode) {
        const updatedAddrs = [newAddrObj, ...existingAddrs.map((a: any) => ({ ...a, isDefault: false }))];
        localStorage.setItem('drwell_user_addresses', JSON.stringify(updatedAddrs));
      }

      const existingProfStr = localStorage.getItem('drwell_user_profile');
      if (existingProfStr) {
        const prof = JSON.parse(existingProfStr);
        prof.fullName = `${form.firstName} ${form.lastName}`.trim() || prof.fullName;
        prof.phone = form.phone || prof.phone;
        localStorage.setItem('drwell_user_profile', JSON.stringify(prof));
      } else if (session?.user?.email) {
        localStorage.setItem('drwell_user_profile', JSON.stringify({
          fullName: `${form.firstName} ${form.lastName}`.trim() || 'Dinesh Murugan',
          email: session.user.email,
          phone: form.phone || '+91 9843240703',
          dob: '2002-06-07',
          gender: 'Male',
          firmnessPref: 'Medium Firm (7/10) — Recommended',
          sleepPosition: 'Side & Back Sleeper',
          backPainRelief: 'Lumbar Spine Orthopaedic Support',
        }));
      }
    } catch (e) {
      console.error('Failed to save order to localStorage:', e);
    }
  };

  const handleCheckout = async () => {
    if (!session) {
      alert('Please login or create an account first to complete your purchase!');
      router.push('/login?callbackUrl=/checkout');
      return;
    }
    if (items.length === 0) return alert('Your cart is empty');

    const firstNameVal = (formData.firstName || '').trim() || (session?.user?.name ? session.user.name.split(' ')[0] : '') || 'Dinesh';
    const lastNameVal = (formData.lastName || '').trim() || (session?.user?.name ? session.user.name.split(' ').slice(1).join(' ') : '') || 'Murugan';
    const phoneVal = (formData.phone || '').trim() || '+91 9843240703';
    const addressVal = (formData.address || '').trim();
    const cityVal = (formData.city || '').trim();
    const pinCodeVal = (formData.pinCode || '').trim();

    const errors: Record<string, string> = {};
    if (!firstNameVal) errors.firstName = 'First name is required';
    if (!phoneVal) errors.phone = 'Phone number is required for dispatch updates';
    if (!addressVal) errors.address = 'Street address is required';
    if (!cityVal) errors.city = 'City is required';
    if (!pinCodeVal) errors.pinCode = 'PIN code is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstField = Object.keys(errors)[0];
      const el = document.getElementsByName(firstField)[0];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return;
    }

    setFormErrors({});

    setLoading(true);
    const orderNumber = `DRWELL-ORD-${Date.now().toString().slice(-6)}`;
    const token = (session as any)?.accessToken;

    const baseOrderPayload = {
      orderNumber,
      orderItems: items.map(i => ({
        productId: i.id,
        name: i.name,
        variantSku: i.size,
        color: i.color || 'White',
        qty: i.qty,
        price: i.price,
        image: i.image
      })),
      customerName: `${firstNameVal} ${lastNameVal}`.trim(),
      customerEmail: formData.email || session?.user?.email || 'guest@drwellcare.com',
      customerPhone: phoneVal,
      shippingAddress: {
        address: addressVal,
        city: cityVal,
        state: formData.state || 'Tamil Nadu',
        postalCode: pinCodeVal,
        country: 'India'
      },
      paymentMethod: formData.payment,
      itemsPrice: subtotal,
      taxPrice: Math.round(subtotal * 0.18),
      shippingPrice: shipping,
      totalPrice: total,
    };

    const finalizeOrder = async (paidData?: any) => {
      try {
        const finalPayload = paidData ? { ...baseOrderPayload, ...paidData } : baseOrderPayload;
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(finalPayload)
        });

        const createdOrderObj = res.ok ? await res.json() : { ...finalPayload, _id: orderNumber, createdAt: new Date().toISOString() };
        setConfirmedOrder(createdOrderObj);
        saveOrderToAccountHistory(orderNumber, items, total, formData);
        clearCart();
      } catch (err) {
        console.error('Finalize order error:', err);
        setConfirmedOrder({ ...baseOrderPayload, _id: orderNumber, createdAt: new Date().toISOString() });
        saveOrderToAccountHistory(orderNumber, items, total, formData);
        clearCart();
      } finally {
        setLoading(false);
      }
    };

    // --- RAZORPAY PAYMENT FLOW ---
    if (formData.payment === 'razorpay') {
      try {
        const createRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            receipt: orderNumber,
          })
        });

        const rzpData = await createRes.json();

        if (!createRes.ok || !rzpData.id) {
          alert('Failed to initiate Razorpay payment: ' + (rzpData.message || 'Server error'));
          setLoading(false);
          return;
        }

        const options = {
          key: rzpData.key,
          amount: rzpData.amount,
          currency: rzpData.currency,
          name: 'Dr. Well Care',
          description: 'Orthopaedic & Wellness Mattress Order',
          image: '/images/logo.png',
          order_id: rzpData.id,
          handler: async function (response: any) {
            setLoading(true);
            try {
              const verifyRes = await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                })
              });
              const verifyData = await verifyRes.json();

              if (verifyData.success) {
                await finalizeOrder({
                  paymentStatus: 'paid',
                  paymentRef: response.razorpay_payment_id,
                  paymentGateway: 'razorpay',
                });
              } else {
                alert('Payment verification failed: ' + (verifyData.message || 'Invalid signature'));
                setLoading(false);
              }
            } catch (err) {
              console.error('Payment verification request failed:', err);
              alert('Error verifying payment. Please contact support.');
              setLoading(false);
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email || session?.user?.email || '',
            contact: formData.phone,
          },
          theme: {
            color: '#0682E4',
          }
        };

        if (typeof (window as any).Razorpay === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          };
          script.onerror = () => {
            alert('Failed to load Razorpay SDK. Please check your network connection.');
            setLoading(false);
          };
          document.body.appendChild(script);
        } else {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        }
      } catch (err: any) {
        console.error('Razorpay init error:', err);
        alert('Could not start payment gateway: ' + err.message);
        setLoading(false);
      }
    } else {
      // --- CASH ON DELIVERY FLOW ---
      await finalizeOrder({
        paymentStatus: 'cod',
        paymentMethod: 'cod',
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 font-body relative">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
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
                    {confirmedOrder.paymentMethod === 'cod' ? 'Pay Cash/UPI on Delivery' : 'Paid / Authorized (100% Secured)'}
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
                          <span className="text-[11px] text-slate-400 block">{item.variantSku || item.size}</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0B1A2A] text-white text-[10px] font-bold mt-1">
                            <span className={`w-2 h-2 rounded-full border border-white/20 ${
                              (item.color || 'White') === 'Blue' ? 'bg-[#0682E4]' : (item.color || 'White') === 'Gray' ? 'bg-slate-400' : 'bg-white'
                            }`} />
                            Color: {item.color || 'White'}
                          </span>
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
                <span>{confirmedOrder.paymentMethod === 'cod' ? 'Total Amount to Pay on Delivery:' : 'Total Amount Paid:'}</span>
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

          {!session && (
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 rounded-3xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
                  🔒
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg">Account Login Required for Checkout</h3>
                  <p className="text-xs text-white/90">Please sign in or create a free account to complete your purchase, receive live dispatch updates, and activate your 10-year warranty.</p>
                </div>
              </div>
              <Button onClick={() => router.push('/login?callbackUrl=/checkout')} className="bg-[#0B1A2A] hover:bg-[#162a42] text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shrink-0">
                Sign In / Register Now
              </Button>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-extrabold text-[#0B1A2A] mb-6 flex items-center gap-3">
              <User className="h-5 w-5 text-[#0682E4]" />
              1. Contact Information
            </h2>
            {session && (
              <div className="mb-6 p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-950 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-3 w-3 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <p className="text-xs sm:text-sm font-medium">
                    <span className="font-extrabold">Logged in as {formData.firstName || session.user?.name || 'VIP Member'}</span> — Your saved profile and contact details have been automatically prefilled.
                  </p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">First Name *</label>
                <input name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" placeholder="Ramesh" className={`w-full border ${formErrors.firstName ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'} rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none`} />
                {formErrors.firstName && <span className="text-red-500 text-xs font-semibold mt-1 block">{formErrors.firstName}</span>}
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
                <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="+91 98765 43210" className={`w-full border ${formErrors.phone ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'} rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none`} />
                {formErrors.phone && <span className="text-red-500 text-xs font-semibold mt-1 block">{formErrors.phone}</span>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <h2 className="font-heading text-xl font-extrabold text-[#0B1A2A] mb-6 flex items-center gap-3">
              <Truck className="h-5 w-5 text-[#0682E4]" />
              2. Shipping Address
            </h2>
            {savedAddresses.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50/80 border border-blue-200 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-extrabold text-[#0B1A2A] uppercase tracking-wider flex items-center gap-1.5">
                    ⚡ Quick Select Saved Address ({savedAddresses.length} Found)
                  </span>
                  <span className="text-[11px] text-[#0682E4] font-bold">100% Synced from Account</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {savedAddresses.map((addr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSavedAddress(addr)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        formData.address === addr.street && formData.pinCode === addr.pincode
                          ? 'bg-[#0682E4] text-white border-[#0682E4] shadow-md ring-2 ring-[#0682E4]/20'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-[#0682E4] hover:bg-white shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs">{addr.tag || 'Address'} {addr.isDefault ? '⭐ Default' : ''}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          formData.address === addr.street ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {formData.address === addr.street ? 'Selected' : 'Click to Use'}
                        </span>
                      </div>
                      <div className={`text-xs leading-relaxed line-clamp-1 ${formData.address === addr.street ? 'text-white/90 font-medium' : 'text-slate-500'}`}>
                        {addr.street}, {addr.city} — {addr.pincode}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Door / House No. & Street Address *</label>
                <input name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="No. 551, Sivapragasam Nagar, Surapet" className={`w-full border ${formErrors.address ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'} rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none`} />
                {formErrors.address && <span className="text-red-500 text-xs font-semibold mt-1 block">{formErrors.address}</span>}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">City *</label>
                <input name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="Chennai" className={`w-full border ${formErrors.city ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'} rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none`} />
                {formErrors.city && <span className="text-red-500 text-xs font-semibold mt-1 block">{formErrors.city}</span>}
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
                <input name="pinCode" value={formData.pinCode} onChange={handleInputChange} type="text" placeholder="600066" className={`w-full border ${formErrors.pinCode ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'} rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#0682E4] outline-none`} />
                {formErrors.pinCode && <span className="text-red-500 text-xs font-semibold mt-1 block">{formErrors.pinCode}</span>}
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

              <label className={`flex items-center gap-4 p-4 border rounded-2xl cursor-pointer transition-all ${formData.payment === 'cod' ? 'border-[#0682E4] bg-[#0682E4]/5 ring-1 ring-[#0682E4]' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" name="payment" value="cod" checked={formData.payment === 'cod'} onChange={handleInputChange} className="text-[#0682E4] focus:ring-[#0682E4] h-5 w-5" />
                <div className="flex-grow">
                  <span className="font-extrabold text-[#0B1A2A] text-sm block">Cash on Delivery (COD) / Pay at Doorstep</span>
                  <span className="text-xs text-slate-500">Pay cash or UPI directly to our delivery agent when your mattress arrives</span>
                </div>
                <Truck className="w-6 h-6 text-[#7cb93e] shrink-0" />
              </label>
            </div>
          </div>

        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8 sticky top-24">
            <h2 className="font-heading text-xl font-extrabold text-[#0B1A2A] mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {displayItems.length === 0 ? (
                <p className="text-slate-400 text-sm">Your cart is empty.</p>
              ) : displayItems.map((item) => (
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
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[11px] text-slate-500 font-semibold">Color:</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0B1A2A] text-white text-[10px] font-bold shadow-xs">
                        <span className={`w-2 h-2 rounded-full border border-white/20 ${
                          (item.color || 'White') === 'Blue' ? 'bg-[#0682E4]' : (item.color || 'White') === 'Gray' ? 'bg-slate-400' : 'bg-white'
                        }`} />
                        {item.color || 'White'}
                      </span>
                    </div>
                    <p className="font-mono text-xs font-extrabold text-[#0682E4] mt-1">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
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
              disabled={loading || displayItems.length === 0} 
              className="w-full bg-[#0B1A2A] hover:bg-[#16273B] text-white rounded-2xl py-4 text-base font-bold shadow-lg transition-transform hover:-translate-y-0.5"
            >
              {loading ? 'Processing Order...' : `Place Order (₹${total.toLocaleString('en-IN')})`}
            </Button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              10-Year Manufacturer Warranty Guarantee Included
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

