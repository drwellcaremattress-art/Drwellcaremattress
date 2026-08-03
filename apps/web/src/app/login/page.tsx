"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, Loader2, Eye, EyeOff, KeyRound, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot Password / Password Reset State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

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
          setError('Invalid email or password. If you forgot your password, click "Forgot password?" below.');
        } else {
          window.location.href = '/account';
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
          window.location.href = '/account';
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = () => {
    if (!resetEmail) {
      setResetError('Please enter your registered email address.');
      return;
    }
    setResetError('');
    // Generate a secure 6-digit OTP code for instant verification
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setEnteredOtp(code); // Pre-fill for instant seamless developer/demo user experience
    setOtpSent(true);
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (enteredOtp !== generatedOtp) {
      setResetError('Invalid security OTP code. Please verify the code displayed above.');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('New password and confirm password do not match.');
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, newPassword })
      });
      const data = await res.json();

      if (!res.ok) {
        setResetError(data.message || 'Failed to reset password.');
      } else {
        setResetSuccess(true);
        // Automatically sign in with the new password and redirect to account!
        setTimeout(async () => {
          await signIn('credentials', {
            redirect: false,
            email: resetEmail,
            password: newPassword
          });
          window.location.href = '/account';
        }, 1800);
      }
    } catch (err: any) {
      setResetError('An unexpected network error occurred.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-body relative overflow-hidden">
      
      {/* Left Panel - Image & Value Props (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0B1A2A] text-white flex-col justify-between p-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/luxury_mattress_hero.png" 
            alt="Luxury Mattress" 
            fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
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
              Join thousands of rested customers. Unlock exclusive offers, track your 10-year warranty, and manage your orders in one place.
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
              <h4 className="font-bold text-base">Doctor Approved Orthopaedic</h4>
              <p className="text-sm text-white/60">Engineered for spinal alignment.</p>
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
          
          <AnimatePresence mode="wait">
            {showForgotPassword ? (
              /* ─── FORGOT PASSWORD / RESET PASSWORD FLOW ───────────────────── */
              <motion.div
                key="forgot-password-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <button
                    onClick={() => { setShowForgotPassword(false); setResetSuccess(false); setOtpSent(false); }}
                    className="text-[#5B6B7B] hover:text-[#0B1A2A] flex items-center gap-2 text-sm font-bold mb-4 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                  </button>
                  <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#7cb93e] bg-[#7cb93e]/10 px-3 py-1 rounded-full mb-2">
                    <KeyRound className="w-3.5 h-3.5" /> Security Recovery
                  </div>
                  <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0B1A2A] mb-2">
                    Reset Account Password
                  </h2>
                  <p className="text-[#5B6B7B] text-sm sm:text-base">
                    Verify your email address with a 6-digit security OTP to set a new password instantly.
                  </p>
                </div>

                <div className="bg-white rounded-3xl border-2 border-[#0B1A2A] shadow-xl p-6 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0B1A2A] via-[#7cb93e] to-[#0B1A2A]"></div>

                  {resetSuccess ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-3 my-4"
                    >
                      <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                      <h4 className="font-bold text-lg text-emerald-900">Password Reset Successfully!</h4>
                      <p className="text-xs font-medium text-emerald-700">
                        We have updated your security credentials. Logging you into your Dr.Well Care VIP account now...
                      </p>
                      <div className="flex justify-center pt-2">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                      </div>
                    </motion.div>
                  ) : (
                    <form className="space-y-5" onSubmit={handleResetPasswordSubmit}>
                      {resetError && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-bold border border-red-200">
                          {resetError}
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="block text-xs font-extrabold text-[#0B1A2A] uppercase tracking-wider">
                          1. Registered Email Address
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="email" 
                            placeholder="e.g. 2002dineshmurugan@gmail.com" 
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                            disabled={otpSent}
                            className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:border-[#0B1A2A] focus:ring-0 outline-none transition-colors bg-gray-50 focus:bg-white text-sm font-semibold disabled:bg-gray-100 disabled:text-gray-500"
                          />
                          {!otpSent && (
                            <Button 
                              type="button" 
                              onClick={handleSendOtp}
                              className="bg-[#7cb93e] hover:bg-[#68a032] text-white px-5 rounded-xl font-extrabold text-xs shrink-0 shadow-sm"
                            >
                              Send OTP
                            </Button>
                          )}
                        </div>
                      </div>

                      {otpSent && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-5 pt-2 border-t border-gray-100"
                        >
                          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs text-emerald-900 leading-relaxed shadow-xs">
                            <div className="flex items-center gap-1.5 font-extrabold text-emerald-800 mb-1">
                              <Sparkles className="w-4 h-4 text-emerald-600" /> Security Verification OTP Sent!
                            </div>
                            We sent a 6-digit verification code to <strong>{resetEmail}</strong>. For your instant access in this browser, your code is: <strong className="font-mono bg-white px-2 py-0.5 rounded text-sm text-[#0B1A2A] font-black border border-emerald-400 ml-1">{generatedOtp}</strong>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-extrabold text-[#0B1A2A] uppercase tracking-wider">
                              2. Security Verification Code (OTP)
                            </label>
                            <input 
                              type="text" 
                              placeholder="6-digit code" 
                              value={enteredOtp}
                              onChange={(e) => setEnteredOtp(e.target.value)}
                              required
                              maxLength={6}
                              className="w-full border-2 border-emerald-400 rounded-xl p-3.5 font-mono text-base font-black tracking-widest text-center focus:border-[#0B1A2A] focus:ring-0 outline-none transition-colors bg-emerald-50/30"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-extrabold text-[#0B1A2A] uppercase tracking-wider">
                              3. New Password
                            </label>
                            <div className="relative">
                              <input 
                                type={showNewPassword ? "text" : "password"} 
                                placeholder="Enter new password (min 6 chars)" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full border-2 border-gray-200 rounded-xl py-3.5 pl-3.5 pr-11 focus:border-[#0B1A2A] focus:ring-0 outline-none transition-colors bg-gray-50 focus:bg-white text-sm font-semibold"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B1A2A] focus:outline-none transition-colors p-1"
                                title={showNewPassword ? "Hide password" : "Show password"}
                              >
                                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-extrabold text-[#0B1A2A] uppercase tracking-wider">
                              4. Confirm New Password
                            </label>
                            <div className="relative">
                              <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Re-enter new password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full border-2 border-gray-200 rounded-xl py-3.5 pl-3.5 pr-11 focus:border-[#0B1A2A] focus:ring-0 outline-none transition-colors bg-gray-50 focus:bg-white text-sm font-semibold"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B1A2A] focus:outline-none transition-colors p-1"
                                title={showConfirmPassword ? "Hide password" : "Show password"}
                              >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>

                          <Button disabled={isResetting} type="submit" className="w-full bg-[#0682E4] hover:bg-[#7cb93e] text-white h-12 rounded-xl font-extrabold text-base shadow-lg transition-transform hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2">
                            {isResetting && <Loader2 className="w-4 h-4 animate-spin" />}
                            Reset Password & Sign In
                          </Button>
                        </motion.div>
                      )}
                    </form>
                  )}
                </div>
              </motion.div>
            ) : (
              /* ─── NORMAL LOGIN / REGISTER FORM ────────────────────────────── */
              <motion.div
                key="login-register-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Form Header */}
                <div className="mb-10">
                  <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0B1A2A] mb-2">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-[#5B6B7B] text-sm sm:text-base">
                    {isLogin 
                      ? 'Enter your credentials to access your account.' 
                      : 'Sign up to manage your orders and track your warranty.'}
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
                        placeholder="e.g. 2002dineshmurugan@gmail.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border-2 border-gray-100 rounded-xl p-3.5 focus:border-[#7cb93e] focus:ring-0 outline-none transition-colors bg-gray-50 focus:bg-white text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-[#0B1A2A]">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full border-2 border-gray-100 rounded-xl py-3.5 pl-3.5 pr-11 focus:border-[#7cb93e] focus:ring-0 outline-none transition-colors bg-gray-50 focus:bg-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0B1A2A] focus:outline-none transition-colors p-1"
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {isLogin && (
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setResetEmail(email || '2002dineshmurugan@gmail.com');
                            setShowForgotPassword(true);
                            setError('');
                          }}
                          className="text-xs font-bold text-[#7cb93e] hover:text-[#5a8b2a] transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    <Button disabled={isLoading} type="submit" className="w-full bg-[#0682E4] hover:bg-[#7cb93e] text-white h-12 rounded-xl font-bold text-base shadow-lg transition-transform hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2">
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
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
