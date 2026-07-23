"use client";

import { useState } from 'react';
import { Package, MapPin, Heart, User, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="bg-surface-alt min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold">My Account</h1>
          <p className="text-ink-muted mt-2">Welcome back, Test User!</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <nav className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-3 p-4 text-left transition-colors border-l-4 ${activeTab === 'orders' ? 'border-primary-blue bg-primary-blue-light/30 text-primary-blue font-semibold' : 'border-transparent text-ink hover:bg-surface-alt'}`}
                >
                  <Package className="h-5 w-5" /> Orders
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`flex items-center gap-3 p-4 text-left transition-colors border-l-4 ${activeTab === 'addresses' ? 'border-primary-blue bg-primary-blue-light/30 text-primary-blue font-semibold' : 'border-transparent text-ink hover:bg-surface-alt'}`}
                >
                  <MapPin className="h-5 w-5" /> Addresses
                </button>
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex items-center gap-3 p-4 text-left transition-colors border-l-4 ${activeTab === 'wishlist' ? 'border-primary-blue bg-primary-blue-light/30 text-primary-blue font-semibold' : 'border-transparent text-ink hover:bg-surface-alt'}`}
                >
                  <Heart className="h-5 w-5" /> Wishlist
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 p-4 text-left transition-colors border-l-4 ${activeTab === 'profile' ? 'border-primary-blue bg-primary-blue-light/30 text-primary-blue font-semibold' : 'border-transparent text-ink hover:bg-surface-alt'}`}
                >
                  <User className="h-5 w-5" /> Profile
                </button>
                <div className="h-px bg-surface-alt my-2"></div>
                <button className="flex items-center gap-3 p-4 text-left transition-colors border-l-4 border-transparent text-error-red hover:bg-error-red/10">
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-heading text-2xl font-bold mb-6">Order History</h2>
                
                {[
                  { id: '#DW-10042', date: 'Oct 12, 2026', total: 14999, status: 'delivered', color: 'bg-brand-green/20 text-brand-green-dark' },
                  { id: '#DW-10089', date: 'Nov 05, 2026', total: 29998, status: 'processing', color: 'bg-warning-gold/20 text-warning-gold' },
                ].map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-soft p-6 border border-transparent hover:border-surface-alt transition-colors">
                    <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                      <div>
                        <h3 className="font-heading font-semibold text-lg">{order.id}</h3>
                        <p className="text-sm text-ink-muted">Placed on {order.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.color}`}>
                          {order.status}
                        </span>
                        <span className="font-mono font-bold text-lg">₹{order.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 py-4 border-t border-b border-surface-alt my-4">
                      <div className="h-16 w-16 bg-surface-alt rounded-lg flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold">The Dr Well Signature</p>
                        <p className="text-sm text-ink-muted">Size: Queen | Qty: 1</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="outline" className="rounded-full">View Invoice</Button>
                      <Button className="bg-primary-blue hover:bg-primary-blue-dark text-white rounded-full">Track Order</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-2xl font-bold">Saved Addresses</h2>
                  <Button className="bg-primary-blue text-white rounded-full">Add New</Button>
                </div>
                <div className="bg-white rounded-2xl shadow-soft p-6 border-l-4 border-primary-blue">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold mb-1">Home</h3>
                      <p className="text-ink-muted text-sm leading-relaxed">
                        Test User<br />
                        123 Wellness Avenue, Apt 4B<br />
                        Andheri West, Mumbai, Maharashtra 400053<br />
                        Phone: +91 98765 43210
                      </p>
                    </div>
                    <div className="flex gap-2 text-primary-blue text-sm">
                      <button className="hover:underline">Edit</button>
                      <span>|</span>
                      <button className="hover:underline text-error-red">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <h2 className="font-heading text-2xl font-bold mb-6">Profile Details</h2>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ink-muted mb-1">Full Name</label>
                    <input type="text" defaultValue="Test User" className="w-full border-border rounded-lg p-3 focus:ring-2 focus:ring-primary-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-muted mb-1">Email</label>
                    <input type="email" defaultValue="test@drwellcare.com" disabled className="w-full border-border rounded-lg p-3 bg-surface-alt text-ink-muted outline-none cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-muted mb-1">Phone</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full border-border rounded-lg p-3 focus:ring-2 focus:ring-primary-blue outline-none" />
                  </div>
                  <Button className="bg-brand-green hover:bg-brand-green-dark text-white rounded-full mt-4">Save Changes</Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
