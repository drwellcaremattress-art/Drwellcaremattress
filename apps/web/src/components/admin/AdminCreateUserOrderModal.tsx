'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Mail, Lock, Phone, MapPin, ShoppingBag, Plus, Trash2,
  CheckCircle2, Copy, Send, Sparkles, RefreshCw, Key, ShieldCheck,
  Package, IndianRupee, ArrowRight, ExternalLink, Printer
} from 'lucide-react';
import { ProductType } from './AdminProductTable';

export interface DealerInfo {
  id?: string;
  name?: string;
  storeName?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  gstNumber?: string;
  address?: string;
}

export interface EmployeeInfo {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  department?: string;
  designation?: string;
  employeeCode?: string;
}

interface AdminCreateUserOrderModalProps {
  open: boolean;
  onClose: () => void;
  products: ProductType[];
  onOrderCreated: (order: any) => void;
  onViewReceipt?: (order: any) => void;
  showToast: (type: 'success' | 'error', message: string) => void;
  dealerInfo?: DealerInfo;
  employeeInfo?: EmployeeInfo;
}

interface OrderItemDraft {
  productId: string;
  name: string;
  variantSku: string;
  size: string;
  thickness: string;
  color?: string;
  qty: number;
  price: number;
  image: string;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi NCR',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function AdminCreateUserOrderModal({
  open,
  onClose,
  products,
  onOrderCreated,
  onViewReceipt,
  showToast,
  dealerInfo,
  employeeInfo,
}: AdminCreateUserOrderModalProps) {
  // Step: 'form' | 'success'
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [createdOrderObject, setCreatedOrderObject] = useState<any | null>(null);

  // Customer Credentials State
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  // Shipping Address State
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '',
    country: 'India',
  });

  // Items in Order
  const [items, setItems] = useState<OrderItemDraft[]>([]);

  // Internal catalog products state with self-healing fallback
  const [catalogProducts, setCatalogProducts] = useState<ProductType[]>(products || []);

  useEffect(() => {
    if (products && products.length > 0) {
      setCatalogProducts(products);
    } else {
      axios.get('/api/admin/products')
        .then((res) => {
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            setCatalogProducts(res.data);
          } else {
            axios.get('/api/products').then((r2) => {
              if (r2.data && Array.isArray(r2.data)) setCatalogProducts(r2.data);
            }).catch(() => {});
          }
        })
        .catch(() => {
          axios.get('/api/products').then((r2) => {
            if (r2.data && Array.isArray(r2.data)) setCatalogProducts(r2.data);
          }).catch(() => {});
        });
    }
  }, [products]);

  // Clean and parse product attributes
  const cleanProductName = (name: string) => {
    return (name || '').replace(/\s*-\s*\d+(\.\d+)?\s*(inch|in)?$/i, '').trim();
  };

  const parseThickness = (p: any): string => {
    if (p.thickness) {
      const m = p.thickness.match(/(\d+)\s*(inch|in)?/i);
      if (m) return `${m[1]} Inch`;
    }
    if (p.variants?.[0]?.thickness_cm) {
      const inVal = Math.round(p.variants[0].thickness_cm / 2.54);
      if (inVal > 0) return `${inVal} Inch`;
    }
    if (p.slug) {
      const slugMatch = p.slug.match(/-(\d+)$/);
      if (slugMatch) return `${slugMatch[1]} Inch`;
    }
    return '6 Inch';
  };

  interface ProductGroup {
    name: string;
    defaultProduct: ProductType;
    thicknessDocs: Record<string, ProductType>;
    availableThicknesses: string[];
  }

  // Deduplicate products by unique base model name (NO REPEATED NAMES!)
  const productGroups = useMemo<ProductGroup[]>(() => {
    const map = new Map<string, ProductGroup>();

    (catalogProducts || []).forEach((p: any) => {
      if (!p || !p.name) return;
      const modelName = cleanProductName(p.name);
      const th = parseThickness(p);

      if (!map.has(modelName)) {
        map.set(modelName, {
          name: modelName,
          defaultProduct: p,
          thicknessDocs: { [th]: p },
          availableThicknesses: [th],
        });
      } else {
        const group = map.get(modelName)!;
        group.thicknessDocs[th] = p;
        if (!group.availableThicknesses.includes(th)) {
          group.availableThicknesses.push(th);
        }
        if ((p.variants?.length || 0) > (group.defaultProduct.variants?.length || 0)) {
          group.defaultProduct = p;
        }
      }
    });

    // Sort thicknesses ascending: e.g. 4 Inch, 5 Inch, 6 Inch, 8 Inch, 10 Inch
    map.forEach((grp) => {
      grp.availableThicknesses.sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0));
      if (grp.availableThicknesses.length === 0) {
        grp.availableThicknesses = ['6 Inch', '8 Inch'];
      }
    });

    return Array.from(map.values());
  }, [catalogProducts]);

  // Item Picker State
  const [selectedProductName, setSelectedProductName] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('Single');
  const [selectedThickness, setSelectedThickness] = useState<string>('6 Inch');

  // Keep selectedProductName synchronized with available product groups
  useEffect(() => {
    if (productGroups.length > 0) {
      if (!selectedProductName || !productGroups.some((g) => g.name === selectedProductName)) {
        setSelectedProductName(productGroups[0].name);
      }
    }
  }, [productGroups, selectedProductName]);

  // Active product group for current model name
  const activeGroup = useMemo(() => {
    return productGroups.find((g) => g.name === selectedProductName) || productGroups[0] || null;
  }, [productGroups, selectedProductName]);

  // Ensure selectedThickness aligns with active group's available thicknesses
  useEffect(() => {
    if (activeGroup?.availableThicknesses && activeGroup.availableThicknesses.length > 0) {
      if (!activeGroup.availableThicknesses.includes(selectedThickness)) {
        if (activeGroup.availableThicknesses.includes('6 Inch')) {
          setSelectedThickness('6 Inch');
        } else {
          setSelectedThickness(activeGroup.availableThicknesses[0]);
        }
      }
    }
  }, [activeGroup, selectedThickness]);

  // Find currently active product document in picker (based on product name + thickness)
  const activeProduct = useMemo(() => {
    if (!activeGroup) return catalogProducts[0] || null;
    return activeGroup.thicknessDocs[selectedThickness] || activeGroup.defaultProduct || catalogProducts[0];
  }, [activeGroup, selectedThickness, catalogProducts]);

  // Sub-dimension selection (like product page popup)
  const [selectedSubDim, setSelectedSubDim] = useState<{ dim: string; sqft: number } | null>(null);
  const [isCustomSize, setIsCustomSize] = useState<boolean>(false);
  const [customL, setCustomL] = useState<string>('');
  const [customW, setCustomW] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('Pure White');
  const [itemQty, setItemQty] = useState<number>(1);
  const [customPrice, setCustomPrice] = useState<string>('');

  // Custom / Accessory Item State (fully empty by default for pillows, bed covers, etc.)
  const [customItemName, setCustomItemName] = useState<string>('');
  const [customItemPrice, setCustomItemPrice] = useState<string>('');
  const [customItemQty, setCustomItemQty] = useState<string>('');

  // Order Details State
  const [orderStatus, setOrderStatus] = useState<string>('Confirmed');
  const [paymentStatus, setPaymentStatus] = useState<string>('cod');
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash on Delivery');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [courier, setCourier] = useState<string>('Blue Dart Express');
  const [trackingId, setTrackingId] = useState<string>('');

  // Success Handover Data
  const [handoverData, setHandoverData] = useState<any | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Auto-generate strong user password
  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pwd = 'DrW-';
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomer((prev) => ({ ...prev, password: pwd }));
    showToast('success', 'Generated secure customer password!');
  };

  // Colors available for this product
  const availableColors = useMemo(() => {
    if (activeProduct?.colors && activeProduct.colors.length > 0) {
      const list = activeProduct.colors
        .map((c: any) => (typeof c === 'string' ? c : c?.name))
        .filter(Boolean);
      if (list.length > 0) return Array.from(new Set(list));
    }
    return ['Pure White', 'Royal Blue', 'Slate Gray'];
  }, [activeProduct]);

  // Keep selectedColor aligned when activeProduct changes
  useEffect(() => {
    if (availableColors.length > 0 && !availableColors.includes(selectedColor)) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableColors, selectedColor]);

  // Active variant for current size category
  const activeVariant = useMemo(() =>
    activeProduct?.variants?.find((v) => v.size.toLowerCase() === selectedSize.toLowerCase()),
    [activeProduct, selectedSize]
  );

  // Sub-dimensions list; fallback to single default if none defined
  const subDimensions = React.useMemo(() => {
    if (activeVariant?.subDimensions && activeVariant.subDimensions.length > 0) {
      return activeVariant.subDimensions as { dim: string; sqft: number }[];
    }
    // Fallback defaults per size category
    const defaults: Record<string, { dim: string; sqft: number }[]> = {
      Single: [
        { dim: '72" × 30"', sqft: 15 },
        { dim: '75" × 30"', sqft: 15.63 },
        { dim: '72" × 36"', sqft: 18 },
        { dim: '75" × 36"', sqft: 18.75 },
        { dim: '78" × 36"', sqft: 19.5 },
      ],
      Double: [
        { dim: '72" × 48"', sqft: 24 },
        { dim: '75" × 48"', sqft: 25 },
        { dim: '78" × 48"', sqft: 26 },
      ],
      Queen: [
        { dim: '72" × 60"', sqft: 30 },
        { dim: '75" × 60"', sqft: 31.25 },
        { dim: '78" × 60"', sqft: 32.5 },
      ],
      King: [
        { dim: '72" × 72"', sqft: 36 },
        { dim: '75" × 72"', sqft: 37.5 },
        { dim: '78" × 72"', sqft: 39 },
      ],
    };
    return defaults[selectedSize] || defaults.Single;
  }, [activeVariant, selectedSize]);

  // Auto-select first sub-dim when product or size category changes
  React.useEffect(() => {
    if (subDimensions.length > 0) {
      setSelectedSubDim(subDimensions[0]);
    }
    setIsCustomSize(false);
    setCustomL('');
    setCustomW('');
  }, [activeProduct, selectedSize]);

  // Compute price from sqftPrice × sqft (same formula as product page)
  const computedPrice = React.useMemo(() => {
    const sqftRate = Number(activeProduct?.sqftPrice) || 546;
    if (isCustomSize && customL && customW) {
      const sqft = (Number(customL) * Number(customW)) / 144;
      return Math.round(sqftRate * sqft);
    }
    if (selectedSubDim) return Math.round(sqftRate * selectedSubDim.sqft);
    if (activeVariant?.price) return activeVariant.price;
    const sqftMap: Record<string, number> = { Single: 18, Double: 24, Queen: 30, King: 36 };
    return Math.round(sqftRate * (sqftMap[selectedSize] || 18));
  }, [activeProduct, activeVariant, selectedSubDim, isCustomSize, customL, customW, selectedSize]);

  // Add Item to Order Draft
  const handleAddItem = () => {
    if (!activeProduct) return;
    const price = customPrice ? Number(customPrice) : computedPrice;

    // Determine dimension label for this item
    const dimLabel = isCustomSize
      ? `${customL}" × ${customW}"`
      : (selectedSubDim?.dim || selectedSize);

    // Check if the selected color has a specific image
    const matchedColorObj = activeProduct?.colors?.find(
      (c: any) => (typeof c === 'string' ? c : c?.name)?.toLowerCase() === selectedColor.toLowerCase()
    );
    const colorSpecificImage = typeof matchedColorObj === 'object' && matchedColorObj?.image ? matchedColorObj.image : '';
    const image = colorSpecificImage || activeProduct.images?.[0]?.url || '/images/products/ecolatex-6.jpeg';

    const productName = activeGroup?.name || activeProduct.name;
    const newItem: OrderItemDraft = {
      productId: activeProduct.slug,
      name: productName,
      variantSku: `${activeProduct.slug.toUpperCase()}-${dimLabel.replace(/[^A-Z0-9]/gi, '')}-${selectedThickness.replace(/\s+/g, '')}-${selectedColor.replace(/\s+/g, '').toUpperCase()}`,
      size: dimLabel,
      thickness: selectedThickness,
      color: selectedColor,
      qty: itemQty,
      price,
      image,
    };

    setItems((prev) => [...prev, newItem]);
    setCustomPrice('');
    setItemQty(1);
    showToast('success', `Added "${productName} (${dimLabel}, ${selectedThickness}, ${selectedColor})" to order.`);
  };

  const handleAddCustomItem = () => {
    const cleanName = customItemName.trim();
    const priceVal = Number(customItemPrice);
    const qtyVal = parseInt(customItemQty, 10);

    if (!cleanName) {
      showToast('error', 'Please enter a product name (e.g. Pillow, Bed Cover).');
      return;
    }
    if (!customItemPrice || isNaN(priceVal) || priceVal <= 0) {
      showToast('error', 'Please enter a valid price for the custom item.');
      return;
    }
    if (!customItemQty || isNaN(qtyVal) || qtyVal < 1) {
      showToast('error', 'Please enter a valid quantity (minimum 1).');
      return;
    }

    const slugPart = cleanName.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'CUSTOM';
    const newItem: OrderItemDraft = {
      productId: `custom-${Date.now()}`,
      name: cleanName,
      variantSku: `CUSTOM-${slugPart}`,
      size: 'Custom Item',
      thickness: '',
      color: '',
      qty: qtyVal,
      price: Math.round(priceVal),
      image: '/images/products/ecolatex-6.jpeg',
    };

    setItems((prev) => [...prev, newItem]);
    setCustomItemName('');
    setCustomItemPrice('');
    setCustomItemQty('');
    showToast('success', `Added "${cleanName} × ${qtyVal}" (₹${(Math.round(priceVal) * qtyVal).toLocaleString('en-IN')}) to order.`);
  };

  const handleRemoveItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Financial calculations (includes live pending custom item if typed, or added items)
  const pendingCustomTotal =
    customItemName.trim() && Number(customItemPrice) > 0
      ? Math.round(Number(customItemPrice)) * Math.max(1, parseInt(customItemQty, 10) || 1)
      : 0;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0) + pendingCustomTotal;
  const totalPayable = Math.max(0, subtotal - discountAmount);
  const balanceDue = Math.max(0, totalPayable - advanceAmount);

  // Submit Order Creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name.trim() || !customer.email.trim()) {
      showToast('error', 'Please enter the customer name and login email/username.');
      return;
    }

    if (!customer.password.trim()) {
      generateStrongPassword();
    }

    if (!shippingAddress.street.trim() || !shippingAddress.city.trim() || !shippingAddress.pincode.trim()) {
      showToast('error', 'Please complete the shipping address (Street, City, Pincode).');
      return;
    }

    // Auto-include custom item if user typed name + price without clicking Add Custom Item first
    let submitItems = [...items];
    if (customItemName.trim() && Number(customItemPrice) > 0) {
      const cleanName = customItemName.trim();
      const priceVal = Math.round(Number(customItemPrice));
      const qtyVal = Math.max(1, parseInt(customItemQty, 10) || 1);
      const slugPart = cleanName.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'CUSTOM';
      submitItems.push({
        productId: `custom-${Date.now()}`,
        name: cleanName,
        variantSku: `CUSTOM-${slugPart}`,
        size: 'Custom Item',
        thickness: '',
        color: '',
        qty: qtyVal,
        price: priceVal,
        image: '/images/products/ecolatex-6.jpeg',
      });
    }

    if (submitItems.length === 0) {
      showToast('error', 'Please add at least one mattress/product or custom item to this order.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/create-user-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          shippingAddress,
          items: submitItems,
          orderStatus,
          paymentStatus,
          paymentMethod,
          discount: discountAmount,
          advanceAmount,
          courier,
          trackingId,
          dealerId: dealerInfo?.id,
          dealerName: dealerInfo?.name,
          dealerStoreName: dealerInfo?.storeName,
          dealerPhone: dealerInfo?.phone,
          dealerEmail: dealerInfo?.email,
          employeeId: employeeInfo?.id,
          employeeName: employeeInfo?.name,
          employeeEmail: employeeInfo?.email,
          employeePhone: employeeInfo?.phone,
          employeeCode: employeeInfo?.employeeCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create customer order.');
      }

      setHandoverData(data.credentials);
      setCreatedOrderObject(data.order);
      setStep('success');
      onOrderCreated(data.order);
      showToast('success', `Order ${data.credentials.orderNumber} & Customer Account created!`);
    } catch (err: any) {
      showToast('error', err.message || 'Something went wrong while placing order.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // WhatsApp formatted message
  const getWhatsAppMessage = () => {
    if (!handoverData) return '';
    const adv = Number(handoverData.advanceAmount) || 0;
    const bal =
      handoverData.balanceAmount !== undefined
        ? Number(handoverData.balanceAmount)
        : Math.max(0, (Number(handoverData.totalPrice) || 0) - adv);

    return encodeURIComponent(
      `*Dr.Well Care Mattress — Your Order & Account Confirmation*\n\n` +
      `Hello ${handoverData.name},\n` +
      `Your mattress order has been confirmed!\n\n` +
      `📦 *Order ID:* ${handoverData.orderNumber}\n` +
      `💰 *Total Amount:* ₹${handoverData.totalPrice.toLocaleString('en-IN')}\n` +
      (adv > 0 ? `💵 *Advance Paid:* ₹${adv.toLocaleString('en-IN')}\n` : '') +
      (adv > 0
        ? `📦 *Balance Due on Delivery (COD):* ₹${bal.toLocaleString('en-IN')}\n`
        : `💳 *Payment Method:* ${handoverData.paymentMethod}\n`) +
      `🚚 *Delivery To:* ${handoverData.shippingAddress.street}, ${handoverData.shippingAddress.city} - ${handoverData.shippingAddress.pincode}\n\n` +
      `🔐 *Your Account Login Credentials:*\n` +
      `• *Website Login:* ${window.location.origin}/login\n` +
      `• *Username / Email:* ${handoverData.email}\n` +
      `• *Password:* ${handoverData.password}\n\n` +
      `You can track your order live anytime at ${window.location.origin}/account\n\n` +
      `Thank you for choosing Dr.Well Care!`
    );
  };

  const handleResetAndClose = () => {
    setStep('form');
    setCustomer({ name: '', email: '', password: '', phone: '' });
    setShippingAddress({ street: '', city: 'Bangalore', state: 'Karnataka', pincode: '', country: 'India' });
    setItems([]);
    setCustomItemName('');
    setCustomItemPrice('');
    setCustomItemQty('');
    setAdvanceAmount(0);
    setDiscountAmount(0);
    setHandoverData(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* ── Modal Header ── */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-[#0B1A2A] to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-neutral-950 font-black shadow-md">
              <ShoppingBag size={20} />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight font-heading">
                {step === 'form' ? 'Create Customer Order & Login Credentials' : 'Customer Account & Order Handover'}
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {step === 'form'
                  ? 'Set up login username/password, shipping address, products, and generate a user account.'
                  : 'Order placed successfully! Give these credentials to the customer to log in.'}
              </p>
              {dealerInfo && (
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/25 text-blue-300 border border-blue-400/30 text-[10.5px] font-bold">
                    Issuing Dealer: {dealerInfo.storeName || dealerInfo.name}
                  </span>
                </div>
              )}
              {employeeInfo && (
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 text-[10.5px] font-bold">
                    Billing Staff: {employeeInfo.name} ({employeeInfo.designation || 'Sales Executive'})
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Modal Body ── */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ── SECTION 1: Customer Login Credentials ── */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <User size={15} className="text-[#0682E4]" /> Step 1: Customer Login &amp; Profile
                  </h4>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0682E4] hover:underline"
                  >
                    <Key size={13} /> Auto-Generate Password
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Customer Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                    />
                  </div>

                  {/* Customer Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                    />
                  </div>

                  {/* Customer Email / Login Username */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Login Email / Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh.kumar@example.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      The user will use this exact email/username to log into the website.
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Login Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="e.g. DrW@9821"
                        value={customer.password}
                        onChange={(e) => setCustomer({ ...customer, password: e.target.value })}
                        className="w-full px-3.5 py-2.5 pr-20 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-slate-200/80 px-2 py-0.5 rounded"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Share this password with the user so they can access their account.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── SECTION 2: Shipping Address ── */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={15} className="text-[#7cb93e]" /> Step 2: Customer Shipping Address
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Street */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      House / Flat / Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 402, Sunshine Heights, 12th Main Road"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bangalore"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="560001"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                    />
                  </div>

                  {/* State */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      State
                    </label>
                    <select
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4] bg-white"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: Add Products ── */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Package size={15} className="text-amber-500" /> Step 3: Add Products to Order
                  </h4>
                  <span className="text-xs font-bold text-slate-500">
                    {items.length} {items.length === 1 ? 'item' : 'items'} in order
                  </span>
                </div>

                {/* Product Selector Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  {/* Product Dropdown */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Choose Product
                    </label>
                    <select
                      value={selectedProductName}
                      onChange={(e) => setSelectedProductName(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0682E4]"
                    >
                      {productGroups.map((group) => (
                        <option key={group.name} value={group.name} className="font-bold text-slate-900 py-1">
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size Category */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Size Category
                    </label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0682E4]"
                    >
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Queen">Queen</option>
                      <option value="King">King</option>
                    </select>
                  </div>

                  {/* Thickness */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Thickness
                    </label>
                    <select
                      value={selectedThickness}
                      onChange={(e) => setSelectedThickness(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0682E4]"
                    >
                      {(activeGroup?.availableThicknesses || ['4 Inch', '5 Inch', '6 Inch', '8 Inch', '10 Inch']).map((th) => (
                        <option key={th} value={th} className="font-bold text-slate-900 py-1">
                          {th}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Colour Selection */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between">
                      <span>Colour</span>
                    </label>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {availableColors.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={itemQty}
                      onChange={(e) => setItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-2 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 text-center"
                    />
                  </div>

                  {/* Add Button */}
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full py-2 px-3 rounded-lg bg-[#0682E4] hover:bg-[#056ec1] text-white text-xs font-extrabold flex items-center justify-center gap-1 shadow transition-all active:scale-95"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>
                </div>

                {/* ── Inline Sub-Dimension / Custom Size Picker ── */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Header row */}
                  <div className="grid grid-cols-12 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200 px-3 py-2">
                    <div className="col-span-1"></div>
                    <div className="col-span-4">Dimensions (L × W)</div>
                    <div className="col-span-3 text-center">Surface Area</div>
                    <div className="col-span-4 text-right">Price</div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {subDimensions.map((sd) => {
                      const sqftRate = Number(activeProduct?.sqftPrice) || 546;
                      const price = Math.round(sqftRate * sd.sqft);
                      const isSelected = !isCustomSize && selectedSubDim?.dim === sd.dim;
                      return (
                        <label
                          key={sd.dim}
                          className={`grid grid-cols-12 items-center px-3 py-2.5 cursor-pointer transition-all text-xs ${
                            isSelected
                              ? 'bg-blue-50 text-[#0682E4]'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="col-span-1">
                            <input
                              type="radio"
                              checked={isSelected}
                              onChange={() => { setSelectedSubDim(sd); setIsCustomSize(false); }}
                              className="accent-[#0682E4]"
                            />
                          </div>
                          <div className="col-span-4 font-bold">{sd.dim}</div>
                          <div className="col-span-3 text-center text-slate-400 text-[11px]">{sd.sqft.toFixed(2)} sq.ft</div>
                          <div className={`col-span-4 text-right font-black ${isSelected ? 'text-[#0682E4]' : 'text-slate-800'}`}>
                            ₹{price.toLocaleString('en-IN')}
                          </div>
                        </label>
                      );
                    })}

                    {/* Custom Size Row */}
                    <label
                      className={`grid grid-cols-12 items-center px-3 py-2.5 cursor-pointer transition-all text-xs ${
                        isCustomSize
                          ? 'bg-purple-50 text-purple-700'
                          : 'hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      <div className="col-span-1">
                        <input
                          type="radio"
                          checked={isCustomSize}
                          onChange={() => setIsCustomSize(true)}
                          className="accent-purple-500"
                        />
                      </div>
                      <div className="col-span-3 font-bold">Custom Size</div>
                      {isCustomSize ? (
                        <>
                          <div className="col-span-5 flex items-center gap-1.5 justify-center">
                            <input
                              type="number"
                              placeholder='L"'
                              value={customL}
                              onChange={(e) => setCustomL(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-14 px-2 py-1 rounded-md border border-purple-300 text-xs font-bold text-center bg-white"
                            />
                            <span className="text-slate-400 font-bold">×</span>
                            <input
                              type="number"
                              placeholder='W"'
                              value={customW}
                              onChange={(e) => setCustomW(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-14 px-2 py-1 rounded-md border border-purple-300 text-xs font-bold text-center bg-white"
                            />
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {customL && customW ? `${((Number(customL) * Number(customW)) / 144).toFixed(2)} sq.ft` : ''}
                            </span>
                          </div>
                          <div className="col-span-3 text-right font-black text-purple-700">
                            {customL && customW ? `₹${computedPrice.toLocaleString('en-IN')}` : '—'}
                          </div>
                        </>
                      ) : (
                        <div className="col-span-8 text-slate-400 text-[11px]">Enter custom L × W in inches →</div>
                      )}
                    </label>
                  </div>

                  {/* Price Preview Footer */}
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-t border-slate-200">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {isCustomSize && customL && customW
                        ? `Custom: ${customL}" × ${customW}"`
                        : selectedSubDim
                        ? `Selected: ${selectedSubDim.dim}`
                        : 'No dimension selected'}
                    </span>
                    <span className="text-sm font-black text-[#0682E4]">
                      ₹{computedPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* ── Custom / Accessory Item Entry (Pillows, Bed Covers, etc.) ── */}
                <div className="bg-white p-4 rounded-xl border border-dashed border-emerald-300 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Plus size={14} className="text-emerald-600" /> Add Custom Product / Accessory (Pillow, Bed Cover, Protector, etc.)
                    </span>
                    {customItemName.trim() && Number(customItemPrice) > 0 && (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Line Total: ₹{(Math.round(Number(customItemPrice)) * Math.max(1, parseInt(customItemQty, 10) || 1)).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Custom Product Name
                      </label>
                      <input
                        type="text"
                        value={customItemName}
                        onChange={(e) => setCustomItemName(e.target.value)}
                        placeholder="Type item name (e.g. Memory Pillow, Bed Cover)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={customItemPrice}
                        onChange={(e) => setCustomItemPrice(e.target.value)}
                        placeholder="Enter price"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={customItemQty}
                        onChange={(e) => setCustomItemQty(e.target.value)}
                        placeholder="Qty"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-400 text-center bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="button"
                        onClick={handleAddCustomItem}
                        className="w-full py-2 px-3 rounded-lg bg-[#7cb93e] hover:bg-[#68a032] text-white text-xs font-extrabold flex items-center justify-center gap-1 shadow transition-all active:scale-95 cursor-pointer"
                      >
                        <Plus size={14} /> Add Custom
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selected Items List */}
                {items.length > 0 ? (
                  <div className="space-y-2 mt-3">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          {item.productId?.startsWith('custom-') ? (
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                              <Package size={18} />
                            </div>
                          ) : (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded-lg bg-slate-100 border border-slate-200"
                            />
                          )}
                          <div>
                            <span className="font-black text-slate-900 block">{item.name}</span>
                            <span className="text-slate-500 text-[11px] flex items-center gap-1.5 flex-wrap mt-0.5">
                              <span>{item.productId?.startsWith('custom-') ? 'Type:' : 'Size:'} <b>{item.size}</b></span>
                              {item.thickness && <span>&bull; Thickness: <b>{item.thickness}</b></span>}
                              {item.color && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-[#0682E4] rounded-md font-bold text-[10.5px]">
                                  <span className={`w-1.5 h-1.5 rounded-full ${item.color.toLowerCase().includes('blue') ? 'bg-[#0682E4]' :
                                      item.color.toLowerCase().includes('gray') || item.color.toLowerCase().includes('grey') ? 'bg-slate-400' :
                                        'bg-white border border-slate-300'
                                    }`} />
                                  Colour: {item.color}
                                </span>
                              )}
                              <span>&bull; Qty: <b>{item.qty}</b></span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-black text-slate-900 text-sm">
                            ₹{(item.price * item.qty).toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium">
                    No products added yet. Select a mattress above and click &ldquo;+ Add Item&rdquo;.
                  </div>
                )}
              </div>

              {/* ── SECTION 4: Order Status & Fulfillment ── */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck size={15} className="text-emerald-600" /> Step 4: Order Status &amp; Payment
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Order Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Initial Order Status
                    </label>
                    <select
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Payment Status
                    </label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="cod">Cash on Delivery (Pending)</option>
                      <option value="paid">Paid (Verified)</option>
                      <option value="pending">Payment Pending</option>
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Razorpay / UPI">Razorpay / UPI</option>
                      <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                      <option value="Card">Credit / Debit Card</option>
                    </select>
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Admin Discount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                    />
                  </div>

                  {/* Advance Payment Received */}
                  <div>
                    <label className="block text-xs font-bold text-emerald-800 mb-1 flex items-center justify-between">
                      <span>Advance Received (₹)</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Deposit</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={totalPayable}
                      value={advanceAmount}
                      onChange={(e) => setAdvanceAmount(Math.max(0, Number(e.target.value) || 0))}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 text-xs font-bold text-emerald-800 bg-emerald-50/40 focus:bg-white focus:border-emerald-500"
                    />
                  </div>

                  {/* Courier */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Courier Partner
                    </label>
                    <input
                      type="text"
                      value={courier}
                      onChange={(e) => setCourier(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                    />
                  </div>

                  {/* Tracking AWB */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tracking AWB (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BD-8921892"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* ── Summary & Submit Button ── */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Order Total Payable:</div>
                  <div className="text-2xl font-black text-amber-400 flex items-center">
                    ₹{totalPayable.toLocaleString('en-IN')}
                    {discountAmount > 0 && (
                      <span className="text-xs text-slate-400 font-normal ml-2 line-through">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  {advanceAmount > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                        Advance Paid: -₹{advanceAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-amber-300 font-black bg-amber-400/15 px-2 py-0.5 rounded border border-amber-400/30">
                        Balance Due on Delivery: ₹{balanceDue.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div className="text-[11px] text-slate-400 mt-1">
                    Includes Free Doorstep Delivery &bull; 100 Nights Trial
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/20 text-xs font-bold text-white hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-neutral-950 text-xs font-black shadow-lg shadow-yellow-500/20 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Creating Order...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} /> Create Customer &amp; Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ── STEP: SUCCESS & HANDOVER TO USER ── */
            <div className="space-y-6">
              {/* Success Banner */}
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center gap-4">
                <span className="p-3 bg-emerald-500 text-white rounded-full shrink-0 shadow-md">
                  <CheckCircle2 size={24} />
                </span>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-emerald-950 font-heading">
                    Account &amp; Order Created Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Order <b>{handoverData?.orderNumber}</b> is placed. Give the login credentials below to the customer so they can log in at <b>/login</b> and view their order.
                  </p>
                </div>
              </div>

              {/* ── Ready-to-Handover Credentials Card ── */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                      Customer Handover Card
                    </span>
                    <h3 className="text-lg font-black text-white">{handoverData?.name}</h3>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-black">
                    ● Account Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Login Link */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-1">Website Login Link:</span>
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-mono font-bold text-amber-300 truncate">
                        {typeof window !== 'undefined' ? `${window.location.origin}/login` : '/login'}
                      </code>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            `${window.location.origin}/login`,
                            'loginUrl'
                          )
                        }
                        className="p-1 hover:text-amber-400 transition-colors"
                        title="Copy login URL"
                      >
                        {copiedField === 'loginUrl' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Username / Email */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-1">Login Username / Email:</span>
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-mono font-bold text-white truncate">
                        {handoverData?.email}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(handoverData?.email, 'email')}
                        className="p-1 hover:text-amber-400 transition-colors"
                        title="Copy email"
                      >
                        {copiedField === 'email' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-1">Login Password:</span>
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono font-black text-amber-400 tracking-wider">
                        {handoverData?.password}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(handoverData?.password, 'password')}
                        className="p-1 hover:text-amber-400 transition-colors"
                        title="Copy password"
                      >
                        {copiedField === 'password' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Order ID & Total */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-400 block mb-1">Order ID &amp; Payment Breakdown:</span>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-white">
                          {handoverData?.orderNumber} &bull; ₹{handoverData?.totalPrice?.toLocaleString('en-IN')}
                        </span>
                        {Number(handoverData?.advanceAmount) > 0 && (
                          <div className="text-[11px] font-medium text-emerald-400 mt-1 flex flex-wrap gap-2">
                            <span>Advance Paid: <b>₹{Number(handoverData?.advanceAmount).toLocaleString('en-IN')}</b></span>
                            <span className="text-amber-300 font-bold bg-amber-400/20 px-1.5 py-0.5 rounded">
                              COD Balance: ₹{(Number(handoverData?.balanceAmount) ?? Math.max(0, Number(handoverData?.totalPrice) - Number(handoverData?.advanceAmount))).toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(handoverData?.orderNumber, 'orderNumber')}
                        className="p-1 hover:text-amber-400 transition-colors ml-2 shrink-0"
                        title="Copy Order ID"
                      >
                        {copiedField === 'orderNumber' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delivery Address Summary */}
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-slate-300">
                  <span className="text-slate-400 font-bold block mb-0.5">Shipping Address:</span>
                  {handoverData?.shippingAddress?.street}, {handoverData?.shippingAddress?.city}, {handoverData?.shippingAddress?.state} - {handoverData?.shippingAddress?.pincode}
                </div>

                {/* 1-Click Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {/* Copy WhatsApp text */}
                  <button
                    type="button"
                    onClick={() => {
                      const adv = Number(handoverData?.advanceAmount) || 0;
                      const bal =
                        handoverData?.balanceAmount !== undefined
                          ? Number(handoverData?.balanceAmount)
                          : Math.max(0, (Number(handoverData?.totalPrice) || 0) - adv);

                      const msg =
                        `Dr.Well Care Mattress - Order Confirmation & Account Details\n\n` +
                        `Hello ${handoverData?.name},\n` +
                        `Your mattress order has been created!\n\n` +
                        `📦 Order ID: ${handoverData?.orderNumber}\n` +
                        `💰 Total Amount: ₹${handoverData?.totalPrice?.toLocaleString('en-IN')}\n` +
                        (adv > 0 ? `💵 Advance Paid: ₹${adv.toLocaleString('en-IN')}\n` : '') +
                        (adv > 0
                          ? `📦 Balance Due on Delivery (COD): ₹${bal.toLocaleString('en-IN')}\n`
                          : `💳 Payment Method: ${handoverData?.paymentMethod}\n`) +
                        `🚚 Delivery To: ${handoverData?.shippingAddress?.street}, ${handoverData?.shippingAddress?.city} - ${handoverData?.shippingAddress?.pincode}\n\n` +
                        `🔐 Your Account Login:\n` +
                        `• Login Link: ${window.location.origin}/login\n` +
                        `• Username / Email: ${handoverData?.email}\n` +
                        `• Password: ${handoverData?.password}\n\n` +
                        `Track your order live anytime at ${window.location.origin}/account`;
                      copyToClipboard(msg, 'allDetails');
                      showToast('success', 'Copied full message! Paste into WhatsApp or SMS.');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 active:scale-95"
                  >
                    {copiedField === 'allDetails' ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copiedField === 'allDetails' ? 'Copied Full Summary!' : '📋 Copy All Details for WhatsApp/SMS'}
                  </button>

                  {/* Send via WhatsApp Web */}
                  <a
                    href={(() => {
                      const digits = (handoverData?.phone || '').replace(/[^0-9]/g, '');
                      const formattedPhone = digits.length === 10 ? `91${digits}` : digits;
                      const phoneQuery = formattedPhone ? `phone=${formattedPhone}&` : '';
                      return `https://api.whatsapp.com/send?${phoneQuery}text=${getWhatsAppMessage()}`;
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                  >
                    <Send size={14} /> Send to Customer via WhatsApp
                  </a>

                  {/* View/Print Receipt */}
                  {onViewReceipt && createdOrderObject && (
                    <button
                      type="button"
                      onClick={() => {
                        onViewReceipt(createdOrderObject);
                        handleResetAndClose();
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      <Printer size={14} /> Print / PDF Receipt
                    </button>
                  )}

                  {/* Done Button */}
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="ml-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-md shadow-yellow-500/20"
                  >
                    Done &bull; View Live Orders Table
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

