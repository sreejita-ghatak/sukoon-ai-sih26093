import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, ShieldAlert, AlertCircle, KeyRound, RefreshCw } from 'lucide-react';
import { useOperator } from '../OperatorContext';

const DEMO_OTP = '246810';

export const OperatorLoginPage: React.FC = () => {
  const { login } = useOperator();
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(45);
  const [canResend, setCanResend] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for 2FA resend availability
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === '2fa' && resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else if (resendCooldown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, resendCooldown]);

  // Focus first OTP input when switching to 2FA step
  useEffect(() => {
    if (step === '2fa') {
      const timer = setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please provide an Operator ID or authorized email.');
      return;
    }
    if (!password) {
      setError('Please provide your operator authentication credential.');
      return;
    }

    setIsLoading(true);
    // Simulating frontend progression to 2FA verification step
    setTimeout(() => {
      setIsLoading(false);
      setStep('2fa');
      setResendCooldown(45);
      setCanResend(false);
    }, 350);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle pasted code
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      if (pastedDigits.length > 0) {
        const newOtp = [...otp];
        pastedDigits.forEach((digit, i) => {
          if (index + i < 6) {
            newOtp[index + i] = digit;
          }
        });
        setOtp(newOtp);
        const nextIndex = Math.min(index + pastedDigits.length, 5);
        otpInputsRef.current[nextIndex]?.focus();
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance to next input
    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const digits = pastedData.split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      const targetIdx = Math.min(digits.length, 5);
      otpInputsRef.current[targetIdx]?.focus();
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  const code = otp.join('');

  if (code.length !== 6) {
    setError('Please enter the complete 6-digit verification code.');
    return;
  }

  if (code !== DEMO_OTP) {
    setError('Invalid demo verification code.');
    return;
  }

  setIsLoading(true);

  try {
    const success = await login(email, password);

    if (!success) {
      setError('Invalid operator ID or password.');
      setStep('credentials');
      setOtp(['', '', '', '', '', '']);
    }
  } catch (error) {
    console.error('Operator authentication failed:', error);
    setError('Unable to connect to the authentication service.');
  } finally {
    setIsLoading(false);
  }
};

  const handleResendCode = () => {
    if (!canResend) return;
    setCanResend(false);
    setResendCooldown(45);
    setError(null);
  };

  const handleQuickDemoFill = () => {
    setEmail('leo@gmail.com');
    setPassword('');
    setError(null);
  };

  const handleBackToLogin = () => {
    setStep('credentials');
    setError(null);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen w-full bg-[#05010a] text-white flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 -left-10 w-[300px] h-[300px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Brand Bar */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md shadow-purple-950">
            <ShieldAlert className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-wider text-white">SUKOON AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-purple-400 font-mono">Operations Portal</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5 shadow-sm shadow-emerald-950/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Gateway Active
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md z-10 my-auto">
        <div className="relative bg-gradient-to-b from-[#100722]/85 via-[#0b0419]/85 to-[#070212]/90 border border-purple-900/40 rounded-3xl p-6 sm:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl overflow-hidden group transition-all duration-300">
          {/* Top specular highlight beam */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/40 to-transparent pointer-events-none" />
          <div className="absolute -right-16 -top-16 w-36 h-36 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />
          
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 relative z-10 shadow-sm shadow-rose-950">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {step === 'credentials' ? (
            /* STEP 1: CREDENTIALS SCREEN */
            <div>
              <div className="text-center mb-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-800/40 via-purple-900/50 to-indigo-950/80 border border-purple-400/40 flex items-center justify-center mx-auto mb-4 text-purple-200 shadow-[0_8px_20px_rgba(147,51,234,0.35),inset_0_1px_1px_0_rgba(255,255,255,0.2)]">
                  <Lock className="w-6 h-6 text-purple-300" />
                </div>
                <h2 className="text-xl font-display font-bold text-white tracking-tight">Sukoon AI</h2>
                <h3 className="text-lg font-display font-semibold text-purple-300 mb-1">Operator Console</h3>
                <p className="text-xs text-purple-300/60 font-medium">Authorized Operators Only</p>
              </div>

              <form onSubmit={handleCredentialsSubmit} className="space-y-4 relative z-10">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300/70 mb-1.5 font-sans">
                    Email / Operator ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-purple-400/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="operator-email-input"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. operator@sukoon.ai"
                      className="w-full bg-[#150a2b]/70 border border-purple-900/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 transition-all font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300/70 font-sans">
                      Password
                    </label>
                    <span className="text-[11px] text-purple-400 font-mono font-medium">2FA Required</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-purple-400/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="operator-password-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#150a2b]/70 border border-purple-900/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 transition-all font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  id="operator-signin-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-purple-950/60 hover:shadow-purple-900/80 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] border border-purple-400/30"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick prototype login helper */}
              <div className="mt-6 pt-5 border-t border-purple-900/30 text-center relative z-10">
                <p className="text-[11px] text-zinc-400 mb-2">Demo Access</p>
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-4 font-mono transition-colors cursor-pointer"
                >
                  Use Demo Operator
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: TWO-FACTOR VERIFICATION SCREEN */
            <div>
              <div className="text-center mb-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-800/40 via-indigo-900/50 to-[#120626]/80 border border-purple-400/40 flex items-center justify-center mx-auto mb-4 text-purple-200 shadow-[0_8px_20px_rgba(147,51,234,0.35),inset_0_1px_1px_0_rgba(255,255,255,0.2)]">
                  <KeyRound className="w-6 h-6 text-purple-300" />
                </div>
                
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-900/50 border border-purple-500/40 text-[10px] font-mono text-purple-200 mb-2">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Two-Factor Authentication Required</span>
                </div>

                <h2 className="text-xl font-display font-bold text-white tracking-tight">Verify Your Identity</h2>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed max-w-xs mx-auto">
                  Enter the 6-digit verification code sent to your registered authentication method.
                </p>
              </div>

              <form onSubmit={handle2FASubmit} className="space-y-5 relative z-10">
                {/* 6-Digit OTP Input Boxes */}
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-11 h-13 sm:w-12 sm:h-14 bg-[#150a2b]/80 border border-purple-900/60 focus:border-purple-400 rounded-xl text-center text-lg sm:text-xl font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all shadow-inner shadow-purple-950/80"
                    />
                  ))}
                </div>

                {/* Verification Guidance Notice */}
                <div className="text-center">
                  <p className="text-[11px] text-purple-300/60 font-sans">
                     Prototype Demo Verification Code: <span className="font-mono text-purple-200">246810</span>
                  </p>
                </div>

                <button
                  id="operator-verify-2fa-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-purple-950/60 hover:shadow-purple-900/80 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] border border-purple-400/30"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Enter Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend Code & Back to Login Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-purple-900/30 text-xs">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={!canResend}
                    className={`flex items-center gap-1.5 font-mono text-[11px] transition-colors cursor-pointer ${
                      canResend 
                        ? 'text-purple-300 hover:text-purple-200 underline underline-offset-4' 
                        : 'text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    <RefreshCw className={`w-3 h-3 ${!canResend ? 'opacity-50' : ''}`} />
                    <span>{canResend ? 'Resend Code' : `Resend code in ${resendCooldown}s`}</span>
                  </button>
                </div>
              </form>

              {/* Security Service Notice */}
              <div className="mt-5 pt-3 border-t border-purple-950/60 text-center relative z-10">
                <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                  Verification will be completed through the secure backend authentication service.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Security Notice */}
      <div className="w-full max-w-md text-center z-10 pb-2">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-purple-300/40">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400/60" />
          <span>Encrypted Session • Audit Logging Enabled • Internal Use Only</span>
        </div>
      </div>
    </div>
  );
};

