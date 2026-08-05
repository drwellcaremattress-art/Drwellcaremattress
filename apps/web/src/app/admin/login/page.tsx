"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid admin credentials");
      } else {
        // Redirect to admin dashboard on success
        router.push("/admin");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050B14] relative overflow-hidden font-body">
      {/* Background aesthetic blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#7cb93e]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#0682E4]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 sm:p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl mx-4"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shadow-inner border border-white/5">
            <Lock className="w-8 h-8 text-[#7cb93e]" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-bold text-white mb-2 tracking-tight">Admin Portal</h1>
          <p className="text-white/50 text-sm">Sign in to access the control panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:border-[#7cb93e] focus:ring-1 focus:ring-[#7cb93e]/50 outline-none transition-all"
                placeholder="admin@drwellcare.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-white/70 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:border-[#7cb93e] focus:ring-1 focus:ring-[#7cb93e]/50 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#7cb93e] to-[#68a032] hover:from-[#8cd048] hover:to-[#7cb93e] text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In to Dashboard"}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-white/40">
          <p>Protected Area. Authorized personnel only.</p>
        </div>
      </motion.div>
    </div>
  );
}
