'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Search, Phone, Mail, BadgeCheck,
  Trash2, Copy, CheckCircle2, Key, Eye, EyeOff,
  Building, RefreshCw, X, ShieldCheck, IndianRupee, FileText,
  Briefcase, Sparkles
} from 'lucide-react';

export interface EmployeeData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  employeeDetails?: {
    department?: string;
    designation?: string;
    employeeCode?: string;
    status?: string;
  };
  totalInvoices?: number;
  totalRevenue?: number;
  createdAt: string;
}

interface AdminEmployeesManagerProps {
  showToast: (type: 'success' | 'error', message: string) => void;
}

const DEPARTMENTS = [
  'Sales & Billing Desk',
  'Direct Showroom Staff',
  'Customer Support & Telecalling',
  'Logistics & Dispatch Ops',
  'Accounts & Finance'
];

const DESIGNATIONS = [
  'Sales Executive',
  'Billing Specialist',
  'Showroom Consultant',
  'Senior Sales Officer',
  'Store Manager'
];

export default function AdminEmployeesManager({ showToast }: AdminEmployeesManagerProps) {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [createdCredentials, setCreatedCredentials] = useState<any | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state for creating employee
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    department: 'Sales & Billing Desk',
    designation: 'Sales Executive',
    employeeCode: '',
  });

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/employees');
      const data = await res.json();
      if (data.success) {
        setEmployees(data.employees || []);
      } else {
        showToast('error', data.message || 'Failed to load employees');
      }
    } catch (err: any) {
      showToast('error', 'Error connecting to employees API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pwd = 'DrW-Emp-';
    for (let i = 0; i < 5; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm(prev => ({ ...prev, password: pwd }));
    showToast('success', 'Generated secure employee password');
  };

  const generateEmpCode = () => {
    const code = `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    setForm(prev => ({ ...prev, employeeCode: code }));
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      showToast('error', 'Please fill in Employee Name, Email/Username, and Password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        showToast('success', data.message || 'Employee created successfully!');
        setCreatedCredentials(data.credentials);
        setIsAddModalOpen(false);
        setForm({
          name: '',
          email: '',
          phone: '',
          password: '',
          department: 'Sales & Billing Desk',
          designation: 'Sales Executive',
          employeeCode: '',
        });
        fetchEmployees();
      } else {
        showToast('error', data.message || 'Failed to create employee');
      }
    } catch (err: any) {
      showToast('error', 'Error connecting to employees API');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/employees?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Employee deleted successfully');
        setEmployees(prev => prev.filter(e => e._id !== id));
        setDeleteConfirmId(null);
      } else {
        showToast('error', data.message || 'Failed to delete employee');
      }
    } catch (err) {
      showToast('error', 'Failed to delete employee');
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast('success', `${field} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const filteredEmployees = employees.filter(emp => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      (emp.phone && emp.phone.includes(q)) ||
      (emp.employeeDetails?.department && emp.employeeDetails.department.toLowerCase().includes(q)) ||
      (emp.employeeDetails?.designation && emp.employeeDetails.designation.toLowerCase().includes(q)) ||
      (emp.employeeDetails?.employeeCode && emp.employeeDetails.employeeCode.toLowerCase().includes(q))
    );
  });

  const totalInvoicesBilled = employees.reduce((sum, e) => sum + (e.totalInvoices || 0), 0);
  const totalTurnoverBilled = employees.reduce((sum, e) => sum + (e.totalRevenue || 0), 0);

  return (
    <div className="space-y-6">
      {/* ── Top Header & Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Total Employees
            </span>
            <span className="text-3xl font-black text-slate-900">{employees.length}</span>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">Authorized Staff</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Active Billing Staff
            </span>
            <span className="text-3xl font-black text-emerald-600">{employees.length}</span>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">100% Active</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <BadgeCheck size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Staff Invoices
            </span>
            <span className="text-3xl font-black text-[#0682E4]">{totalInvoicesBilled}</span>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">Orders Created</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0682E4]">
            <FileText size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Staff Billed Turnover
            </span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              ₹{totalTurnoverBilled.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">Direct Billing</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <IndianRupee size={22} />
          </div>
        </div>
      </div>

      {/* ── Action Bar: Search & Add Employee ── */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by employee name, email, code, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0682E4] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchEmployees}
            disabled={loading}
            className="p-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Refresh List"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-[#0682E4]' : ''} />
          </button>

          <button
            type="button"
            onClick={() => {
              generateEmpCode();
              generateStrongPassword();
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <UserPlus size={16} />
            + Create Employee Account
          </button>
        </div>
      </div>

      {/* ── Recently Created Credentials Handover Card ── */}
      <AnimatePresence>
        {createdCredentials && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider mb-2">
                  <CheckCircle2 size={13} /> Employee Account Created Successfully!
                </div>
                <h3 className="text-xl font-black text-white">
                  Share Login Credentials with {createdCredentials.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                  The employee can log in using their email/username & password at the login page. On their profile page, they will see their exclusive invoice billing desk with their name automatically stamped on all generated invoices.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Username / Email</span>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="font-mono text-xs font-extrabold text-white truncate">{createdCredentials.email}</span>
                      <button
                        onClick={() => copyToClipboard(createdCredentials.email, 'Email')}
                        className="p-1 rounded hover:bg-white/10 text-emerald-400 cursor-pointer"
                        title="Copy"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password</span>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="font-mono text-xs font-extrabold text-amber-300 truncate">{createdCredentials.password}</span>
                      <button
                        onClick={() => copyToClipboard(createdCredentials.password, 'Password')}
                        className="p-1 rounded hover:bg-white/10 text-amber-300 cursor-pointer"
                        title="Copy"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/15">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Designation / ID</span>
                    <div className="mt-1">
                      <span className="text-xs font-bold text-white block">{createdCredentials.designation}</span>
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{createdCredentials.employeeCode}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const shareText = `*DR.WELL CARE EMPLOYEE LOGIN CREDENTIALS*\n\nStaff Name: ${createdCredentials.name}\nDesignation: ${createdCredentials.designation}\nStaff ID: ${createdCredentials.employeeCode}\n\nLogin URL: ${window.location.origin}/login\nUsername/Email: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\n\n_Note: Please log in to access your Staff Billing Desk & generate customer invoices._`;
                    copyToClipboard(shareText, 'All Credentials');
                  }}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy size={15} />
                  Copy Complete Details
                </button>
                <button
                  type="button"
                  onClick={() => setCreatedCredentials(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
                >
                  Dismiss Banner
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Employees Table ── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw size={24} className="animate-spin text-emerald-600" />
            <span className="text-xs font-bold">Loading employees...</span>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Users size={28} />
            </div>
            <h4 className="text-base font-extrabold text-slate-800">No Employees Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No employees match "${searchQuery}". Try a different search.`
                : 'Click the "+ Create Employee Account" button to add your first billing staff member.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Department & Role</th>
                  <th className="py-3.5 px-4 text-center">Staff Invoices</th>
                  <th className="py-3.5 px-4 text-right">Total Billed</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => {
                  const initials = emp.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                  const empCode = emp.employeeDetails?.employeeCode || `EMP-${emp._id.slice(-4).toUpperCase()}`;

                  return (
                    <tr key={emp._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 text-sm block">{emp.name}</span>
                            <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 inline-block mt-0.5">
                              {empCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Mail size={12} className="text-slate-400 shrink-0" />
                            <span className="font-mono font-semibold text-slate-800">{emp.email}</span>
                          </div>
                          {emp.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone size={12} className="text-slate-400 shrink-0" />
                              <span className="font-mono">{emp.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block text-xs">
                            {emp.employeeDetails?.designation || 'Sales Executive'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium block">
                            {emp.employeeDetails?.department || 'Sales & Billing'}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-[#0682E4] font-black text-xs border border-blue-200/60">
                          <FileText size={12} /> {emp.totalInvoices || 0}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <span className="font-mono font-extrabold text-slate-900 text-sm">
                          ₹{(emp.totalRevenue || 0).toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          Active Staff
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {deleteConfirmId === emp._id ? (
                            <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl border border-red-200">
                              <span className="text-[10px] font-bold text-red-700 px-1">Delete?</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteEmployee(emp._id)}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-extrabold cursor-pointer"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(emp._id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                              title="Delete Employee"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal: Create New Employee ── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold">
                    <UserPlus size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Create New Employee</h3>
                    <p className="text-[11px] text-slate-400">Generate staff credentials for the Invoice Billing Desk</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateEmployee} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                {/* Employee Full Name */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Employee Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                {/* Username / Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                      Username / Login Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@drwellcare.com"
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                      Staff Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={form.phone}
                      onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Department & Designation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                      Department
                    </label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                      Designation
                    </label>
                    <select
                      value={form.designation}
                      onChange={(e) => setForm(prev => ({ ...prev, designation: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    >
                      {DESIGNATIONS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Employee ID / Code */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                      Staff ID / Employee Code
                    </label>
                    <button
                      type="button"
                      onClick={generateEmpCode}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles size={11} /> Auto-Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. EMP-2490"
                    value={form.employeeCode}
                    onChange={(e) => setForm(prev => ({ ...prev, employeeCode: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono"
                  />
                </div>

                {/* Login Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                      Login Password *
                    </label>
                    <button
                      type="button"
                      onClick={generateStrongPassword}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles size={11} /> Generate Password
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter or generate password"
                      value={form.password}
                      onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-4 pr-11 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Info Note */}
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-[11px] text-emerald-800 flex items-start gap-2">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Staff Invoice Access:</span>
                    When this employee logs in, their profile page will display the exclusive Invoice Billing Desk. Any invoice they create will automatically carry their name at the top.
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} />
                        Confirm & Create Employee
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
