'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Search, Phone, Mail, MapPin, Store,
  Trash2, Copy, CheckCircle2, Send, Key, Eye, EyeOff,
  Building, RefreshCw, X, ShieldCheck, IndianRupee, FileText
} from 'lucide-react';

export interface DealerData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  dealerDetails?: {
    storeName?: string;
    city?: string;
    state?: string;
    gstNumber?: string;
    address?: string;
    status?: string;
  };
  totalOrders?: number;
  totalRevenue?: number;
  createdAt: string;
}

interface AdminDealersManagerProps {
  showToast: (type: 'success' | 'error', message: string) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi NCR',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function AdminDealersManager({ showToast }: AdminDealersManagerProps) {
  const [dealers, setDealers] = useState<DealerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [createdCredentials, setCreatedCredentials] = useState<any | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state for creating dealer
  const [form, setForm] = useState({
    name: '',
    storeName: '',
    email: '',
    phone: '',
    password: '',
    city: 'Bangalore',
    state: 'Karnataka',
    gstNumber: '',
    address: '',
  });

  const fetchDealers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dealers');
      const data = await res.json();
      if (data.success) {
        setDealers(data.dealers || []);
      } else {
        showToast('error', data.message || 'Failed to load dealers');
      }
    } catch (err: any) {
      showToast('error', 'Error connecting to dealers API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pwd = 'DrW-Dlr-';
    for (let i = 0; i < 5; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm(prev => ({ ...prev, password: pwd }));
    showToast('success', 'Generated secure dealer password');
  };

  const handleCreateDealer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      showToast('error', 'Please fill in Name, Email and Password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/dealers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create dealer');
      }

      showToast('success', `Dealer "${form.name}" created successfully!`);
      setCreatedCredentials(data.credentials);
      fetchDealers();
      // Reset form
      setForm({
        name: '',
        storeName: '',
        email: '',
        phone: '',
        password: '',
        city: 'Bangalore',
        state: 'Karnataka',
        gstNumber: '',
        address: '',
      });
    } catch (err: any) {
      showToast('error', err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDealer = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/dealers?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Dealer deleted successfully');
        setDealers(prev => prev.filter(d => d._id !== id));
        setDeleteConfirmId(null);
      } else {
        showToast('error', data.message || 'Failed to delete dealer');
      }
    } catch (err: any) {
      showToast('error', 'Error deleting dealer');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast('success', `Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const filteredDealers = dealers.filter(d => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      d.name?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q) ||
      d.phone?.includes(q) ||
      d.dealerDetails?.storeName?.toLowerCase().includes(q) ||
      d.dealerDetails?.city?.toLowerCase().includes(q)
    );
  });

  const totalDealerOrders = dealers.reduce((sum, d) => sum + (d.totalOrders || 0), 0);
  const totalDealerRevenue = dealers.reduce((sum, d) => sum + (d.totalRevenue || 0), 0);

  return (
    <div className="space-y-6">
      {/* ── Top Bar & Stats ── */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-blue-50 text-[#0682E4] font-black">
              <Store size={20} />
            </span>
            <h2 className="text-xl font-heading font-black text-[#0B1A2A]">
              Authorized Dealers Network
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Manage dealer credentials, view individual order volumes, and empower partners to bill customer orders.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAddModalOpen(true);
            setCreatedCredentials(null);
            generateStrongPassword();
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#0682E4] hover:bg-[#056ec1] text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
        >
          <UserPlus size={16} /> + Add New Dealer
        </button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0682E4] flex items-center justify-center font-black">
            <Users size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Dealers</span>
            <span className="text-2xl font-black text-slate-900">{dealers.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            <FileText size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Invoices Generated</span>
            <span className="text-2xl font-black text-slate-900">{totalDealerOrders}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <IndianRupee size={22} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Dealer Sales</span>
            <span className="text-2xl font-black text-slate-900">₹{totalDealerRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <Search size={18} className="text-slate-400 ml-1" />
        <input
          type="text"
          placeholder="Search by dealer name, store name, email, phone, city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs sm:text-sm font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Dealers Table ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <RefreshCw size={24} className="animate-spin text-[#0682E4]" />
            <span className="text-xs font-bold">Loading dealers...</span>
          </div>
        ) : filteredDealers.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <Store size={40} className="mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No Authorized Dealers Found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No dealers match "${searchQuery}". Try a different search.`
                : 'Click "+ Add New Dealer" above to create credentials for your first store partner.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Dealer &amp; Store Name</th>
                  <th className="py-3.5 px-4">Login Email / Username</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-center">Invoices</th>
                  <th className="py-3.5 px-4 text-right">Revenue</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDealers.map((d) => (
                  <tr key={d._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Dealer & Store */}
                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-900 text-xs sm:text-sm">
                        {d.dealerDetails?.storeName || d.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <span>Contact: <b>{d.name}</b></span>
                        {d.dealerDetails?.gstNumber && (
                          <span className="font-mono text-[10px] text-slate-400">
                            • GST: {d.dealerDetails.gstNumber}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Login Email */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {d.email}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-slate-700 font-bold">
                      {d.phone || '—'}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-bold text-slate-800">{d.dealerDetails?.city || 'Bangalore'}</div>
                      <div className="text-[10px] text-slate-400">{d.dealerDetails?.state || 'Karnataka'}</div>
                    </td>

                    {/* Invoices */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-[#0682E4] font-black text-xs">
                        {d.totalOrders || 0}
                      </span>
                    </td>

                    {/* Revenue */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      ₹{(d.totalRevenue || 0).toLocaleString('en-IN')}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-extrabold border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => copyToClipboard(d.email, `Email for ${d.name}`)}
                          className="p-1.5 text-slate-400 hover:text-[#0682E4] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Copy Dealer Email"
                        >
                          <Copy size={14} />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(d._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Dealer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal: Add New Dealer ── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-[#0B1A2A] to-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-blue-500 text-white font-black shadow-md">
                    <Store size={20} />
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black tracking-tight font-heading">
                      {createdCredentials ? 'Dealer Credentials Ready' : 'Register New Authorized Dealer'}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      {createdCredentials
                        ? 'Account created! Copy or WhatsApp these credentials to the dealer.'
                        : 'Set up login credentials and showroom details for your partner.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {createdCredentials ? (
                  /* Success Handover Card */
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-emerald-800">
                      <ShieldCheck size={24} className="text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-extrabold text-sm block">Dealer Account Successfully Activated!</span>
                        <span className="text-xs text-emerald-700">
                          The dealer can now log in at <b className="underline">/login</b> and create invoices.
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Store Name</span>
                        <span className="font-extrabold text-slate-900 text-sm">{createdCredentials.storeName}</span>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/80 pt-2.5">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Login Username / Email</span>
                          <span className="font-mono font-bold text-slate-900 text-xs">{createdCredentials.email}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(createdCredentials.email, 'Email')}
                          className="px-2.5 py-1 text-xs font-bold text-[#0682E4] hover:bg-blue-50 rounded-lg flex items-center gap-1"
                        >
                          {copiedField === 'Email' ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          Copy
                        </button>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/80 pt-2.5">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Temporary Password</span>
                          <span className="font-mono font-black text-amber-700 text-sm bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {createdCredentials.password}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(createdCredentials.password, 'Password')}
                          className="px-2.5 py-1 text-xs font-bold text-amber-700 hover:bg-amber-100 rounded-lg flex items-center gap-1"
                        >
                          {copiedField === 'Password' ? <CheckCircle2 size={13} className="text-emerald-500" /> : <Copy size={13} />}
                          Copy
                        </button>
                      </div>

                      <div className="border-t border-slate-200/80 pt-2.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Login URL</span>
                        <span className="font-mono text-xs text-slate-600 block">https://drwellcaremattress.com/login</span>
                      </div>
                    </div>

                    {/* WhatsApp share */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `*Dr. Well Care Mattress - Authorized Dealer Portal Access*\n\nHello ${createdCredentials.name},\nYour Authorized Dealer Portal account has been created for *${createdCredentials.storeName}*.\n\n*Login URL:* https://drwellcaremattress.com/login\n*Username:* ${createdCredentials.email}\n*Password:* ${createdCredentials.password}\n\nYou can log in and start generating official customer orders and invoices immediately.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow transition-all"
                    >
                      <Send size={15} /> Send Credentials via WhatsApp
                    </a>

                    <button
                      onClick={() => {
                        setCreatedCredentials(null);
                        setIsAddModalOpen(false);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                    >
                      Done &amp; Close
                    </button>
                  </div>
                ) : (
                  /* Form */
                  <form onSubmit={handleCreateDealer} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Dealer Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Kumar"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                        />
                      </div>

                      {/* Store Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Store / Showroom Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sri Venkateshwara Furniture"
                          value={form.storeName}
                          onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                        />
                      </div>

                      {/* Login Email */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Login Email / Username <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="dealer.ramesh@gmail.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Dealer Contact Phone
                        </label>
                        <input
                          type="tel"
                          placeholder="9876543210"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                        />
                      </div>

                      {/* Password */}
                      <div className="sm:col-span-2">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700">
                            Login Password <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={generateStrongPassword}
                            className="text-xs font-bold text-[#0682E4] hover:underline flex items-center gap-1"
                          >
                            <Key size={12} /> Auto-Generate
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0682E4]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                        <select
                          value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      {/* GST */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          GST Number (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="29AAAAA0000A1Z5"
                          value={form.gstNumber}
                          onChange={(e) => setForm({ ...form, gstNumber: e.target.value.toUpperCase() })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none"
                        />
                      </div>

                      {/* Address */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Showroom / Store Address
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Shop #14, Main Commercial Street, Indiranagar"
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2.5 rounded-xl bg-[#0682E4] hover:bg-[#056ec1] text-white text-xs font-black shadow-md transition-all active:scale-95 disabled:opacity-50"
                      >
                        {submitting ? 'Creating Dealer...' : 'Create Dealer Account'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Delete Confirm ── */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                  <Trash2 size={24} />
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">Delete Dealer Account?</h4>
                <p className="text-xs text-slate-500">
                  This dealer will no longer be able to log in. Past orders and invoices will remain safe in the system.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteConfirmId && handleDeleteDealer(deleteConfirmId)}
                  className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
