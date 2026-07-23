"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await signIn('credentials', {
          redirect: false,
          email,
          password
        });
        
        if (res?.error) {
          setError('Invalid email or password');
        } else {
          window.location.href = '/';
        }
      } else {
        // Register
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.message || 'Failed to create account');
        } else {
          // Auto login after register
          await signIn('credentials', {
            redirect: false,
            email,
            password
          });
          window.location.href = '/';
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-body relative overflow-hidden">
      
      {/* Left Panel - Image & Value Props (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0B1A2A] text-white flex-col justify-between p-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/luxury_mattress_hero.png" 
            alt="Luxury Mattress" 
            fill 
            className="object-cover opacity-40 hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2A] via-[#0B1A2A]/80 to-transparent"></div>
        </div>

        {/* Top Content */}
        <div className="relative z-10">
          <Link href="/" className="text-white/70 hover:text-white flex items-center gap-2 text-sm w-fit transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to store
          </Link>
          <div className="mt-20">
            <h1 className="font-heading text-5xl font-bold leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Transform Your Sleep Experience
            </h1>
            <p className="text-lg text-white/80 font-medium max-w-md">
              Join thousands of rested customers. Unlock exclusive offers, track your 100-night trial, and manage your orders in one place.
            </p>
          </div>
        </div>

        {/* Bottom Value Props */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#7cb93e]/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#7cb93e]" />
            </div>
            <div>
              <h4 className="font-bold text-base">100-Night Risk Free Trial</h4>
              <p className="text-sm text-white/60">Sleep on it, test it, love it.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#7cb93e]/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#7cb93e]" />
            </div>
            <div>
              <h4 className="font-bold text-base">10-Year Warranty</h4>
              <p className="text-sm text-white/60">Comprehensive coverage for a decade.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#7cb93e]/20 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#7cb93e]" />
            </div>
            <div>
              <h4 className="font-bold text-base">Free Delivery</h4>
              <p className="text-sm text-white/60">Direct to your doorstep.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative">
        {/* Mobile Back Button */}
        <Link href="/" className="lg:hidden absolute top-6 left-6 text-gray-500 hover:text-[#0B1A2A] flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="w-full max-w-md">
          {/* Form Header */}
          <div className="mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0B1A2A] mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-[#5B6B7B] text-sm sm:text-base">
              {isLogin 
                ? 'Enter your credentials to access your account.' 
                : 'Sign up to manage your orders and track your trial.'}
            </p>
          </div>

          {/* Form Container with Animation */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 relative overflow-hidden">
            {/* Subtle top border glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B1A2A] to-[#7cb93e]"></div>

            <form className="space-y-5" onSubmit={handleAuth}>
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="name-input"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-1 overflow-hidden"
                  >
                    <label className="block text-sm font-bold text-[#0B1A2A]">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Dr Well Customer" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                      className="w-full border-2 border-gray-100 rounded-xl p-3.5 focus:border-[#7cb93e] focus:ring-0 outline-none transition-colors bg-gray-50 focus:bg-white text-sm"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#0B1A2A]">Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border-2 border-gray-100 rounded-xl p-3.5 focus:border-[#7cb93e] focus:ring-0 outline-none transition-colors bg-gray-50 focus:bg-white text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#0B1A2A]">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border-2 border-gray-100 rounded-xl p-3.5 focus:border-[#7cb93e] focus:ring-0 outline-none transition-colors bg-gray-50 focus:bg-white text-sm"
                />
              </div>

              {isLogin && (
                <div className="flex justify-end pt-1">
                  <Link href="#" className="text-xs font-bold text-[#7cb93e] hover:text-[#5a8b2a] transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button disabled={isLoading} type="submit" className="w-full bg-[#0B1A2A] hover:bg-[#16273B] text-white h-12 rounded-xl font-bold text-base shadow-lg transition-transform hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
          </div>

          {/* Footer toggle */}
          <div className="mt-8 text-center text-sm font-medium text-[#5B6B7B]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-[#0B1A2A] font-bold hover:text-[#7cb93e] transition-colors"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
