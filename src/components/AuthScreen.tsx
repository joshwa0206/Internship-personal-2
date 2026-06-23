import React, { useState } from 'react';
import { Shield, Sparkles, Terminal, LogIn, Lock, Mail, Cpu, Laptop, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthScreenProps {
  viewType: 'desktop' | 'mobile';
  onLogin: (memberId: string) => void;
}

export default function AuthScreen({ viewType, onLogin }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedDemoUser, setSelectedDemoUser] = useState('sarah-cooper');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [sentResetLink, setSentResetLink] = useState(false);

  const handleDemoLogin = (id: string) => {
    setIsSubmitting(true);
    setError('');
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(id);
    }, 900);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(selectedDemoUser); // Authenticate as selected role
    }, 1200);
  };

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a registered email.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSentResetLink(true);
      setError('');
    }, 1000);
  };

  const isDesktop = viewType === 'desktop';

  return (
    <div className={`relative flex flex-col justify-between h-full text-zinc-100 font-sans overflow-y-auto overflow-x-hidden ${isDesktop ? 'p-10' : 'p-6 bg-slate-950/80'}`}>
      
      {/* Background Neon Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />

      {/* Header Logotype */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="font-semibold text-sm tracking-widest bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              AETHER<span className="text-cyan-400 font-bold">ENGINE</span>
            </span>
            <div className="text-[9px] text-zinc-500 tracking-wider font-mono uppercase">Task Cluster v3.8</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-[9px] font-mono text-cyan-400">
          <Shield className="w-2.5 h-2.5" />
          <span>AES-256</span>
        </div>
      </div>

      {/* Auth Box Container */}
      <div className={`relative z-10 my-auto ${isDesktop ? 'max-w-md mx-auto w-full' : 'w-full'}`}>
        <AnimatePresence mode="wait">
          {!isForgotPassword ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className={`bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 ${isDesktop ? 'shadow-2xl shadow-cyan-950/20' : 'shadow-xl'}`}
            >
              <div className="mb-5 text-center">
                <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-teal-200 bg-clip-text text-transparent">
                  Access Secure Terminal
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Authenticate cryptographic session credential keys
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-400 flex items-center gap-2 font-mono">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCustomLogin} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                    Security ID (Email)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sarah.c@aetherengine.io"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      Passphrase
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError('');
                        setSentResetLink(false);
                      }}
                      className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Bypass Keys?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Simulated Login Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs tracking-wider transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'ESTABLISHING HANDSHAKE...' : 'AUTHORIZE ACCESS'}</span>
                  <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-30 -translate-x-full group-hover:animate-shine" />
                </button>
              </form>

              {/* Or Divider */}
              <div className="relative my-5 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800/80"></div>
                </div>
                <span className="relative z-10 px-3 bg-[#0B111E] text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  Quick Bypass Shells
                </span>
              </div>

              {/* Quick Login Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => handleDemoLogin('sarah-cooper')}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-850 hover:bg-slate-900/80 hover:border-cyan-500/30 transition-all text-left text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
                      className="w-6 h-6 rounded-full border border-slate-800 object-cover"
                      alt="Sarah"
                    />
                    <div>
                      <div className="font-semibold text-zinc-300 group-hover:text-cyan-400">Sarah Cooper</div>
                      <div className="text-[9px] text-slate-500 font-mono">Lead Designer</div>
                    </div>
                  </div>
                  <Terminal className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400" />
                </button>

                <button
                  onClick={() => handleDemoLogin('alex-rivera')}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-850 hover:bg-slate-900/80 hover:border-cyan-500/30 transition-all text-left text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                      className="w-6 h-6 rounded-full border border-slate-800 object-cover"
                      alt="Alex"
                    />
                    <div>
                      <div className="font-semibold text-zinc-300 group-hover:text-cyan-400">Alex Rivera</div>
                      <div className="text-[9px] text-slate-500 font-mono">Sr. Full Stack Dev</div>
                    </div>
                  </div>
                  <Terminal className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl"
            >
              <div className="mb-5 text-center">
                <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-teal-200 bg-clip-text text-transparent">
                  Cryptographic Key Bypass
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Send certificate token request to private subnet
                </p>
              </div>

              {sentResetLink ? (
                <div className="space-y-4 text-center my-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-200">Bypass Certificate Dispatched</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                      We sent a simulated recovery token link to <span className="text-cyan-400 font-mono">{email || 'your-email@aetherengine.io'}</span>.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsForgotPassword(false);
                      setSentResetLink(false);
                      setError('');
                    }}
                    className="mt-2 text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
                  >
                    Return to Login Frame
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetRequest} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-400 flex items-center gap-2 font-mono">
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                      Registered Admin Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah.c@aetherengine.io"
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500/80 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'DISPATCHING TO SUBSYSTEM...' : 'SEND HARD RESET TOKEN'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setError('');
                    }}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors py-1 cursor-pointer"
                  >
                    Cancel & Return
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Frame Decals & Status Bar */}
      <div className="relative z-10 flex items-center justify-between mt-auto pt-6 text-[9px] font-mono text-slate-500 border-t border-slate-900">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-ping"></span>
          <span>SYSTEMSECURE // VERIFIED</span>
        </div>
        <div className="text-right">
          INTEGRITY METRIC: <span className="text-cyan-400">99.98%</span>
        </div>
      </div>
    </div>
  );
}
