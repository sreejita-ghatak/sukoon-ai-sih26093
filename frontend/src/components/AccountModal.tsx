import React, { useState } from 'react';
import { User, Lock, Mail, Sparkles, X, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  initialMode: 'signin' | 'signup';
  onClose: () => void;
  onStartAnonymous: () => void;
  onAuthenticated?: (email: string) => void;
  onStartConversation?: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onStartAnonymous,
  onAuthenticated,
  onStartConversation,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Sync mode when reopened with different initialMode
  React.useEffect(() => {
    setMode(initialMode);
    setSubmitted(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userEmail = email.trim() || 'member@sukoon.ai';
    if (onAuthenticated) {
      onAuthenticated(userEmail);
    }
    setSubmitted(true);
  };

  const handleProceedAfterAuth = () => {
    onClose();
    if (onStartConversation) {
      onStartConversation();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-md glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-500/25 shadow-[0_0_60px_rgba(147,51,234,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/20 transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {mode === 'signin' ? 'Sign In' : 'Create an Account'}
            </h2>
            <p className="text-xs text-purple-300/70">
              Optional • Anonymous access is always available
            </p>
          </div>
        </div>

        {/* Explanatory Notice */}
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200/80 mb-5 leading-relaxed">
          <p className="font-semibold text-purple-200 mb-0.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            No account required to use Sukoon AI
          </p>
          Creating an account allows you to securely save conversation history and revisit previous guidance whenever you wish.
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              {mode === 'signin' ? 'Welcome Back' : 'Account Configured'}
            </h3>
            <p className="text-xs text-purple-200/80 max-w-xs mx-auto">
              Your session preferences have been noted. You can now continue directly to your private support space.
            </p>
            <div className="pt-3">
              <button
                onClick={handleProceedAfterAuth}
                className="w-full btn-violet-glow py-2.5 rounded-full text-sm font-semibold text-white cursor-pointer"
              >
                Proceed to Safe Space
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-purple-200/80 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/60" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-950/50 border border-purple-500/25 text-white placeholder-purple-300/30 text-xs focus:outline-none focus:border-purple-400/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-purple-200/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/60" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-950/50 border border-purple-500/25 text-white placeholder-purple-300/30 text-xs focus:outline-none focus:border-purple-400/60 transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="submit"
                className="w-full btn-violet-glow py-2.5 rounded-full text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartAnonymous();
                }}
                className="w-full py-2.5 rounded-full text-xs font-medium text-purple-300/80 hover:text-white hover:bg-purple-900/30 transition-all border border-purple-500/20 cursor-pointer"
              >
                Continue Anonymously (No Account)
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-xs text-purple-300/70 hover:text-purple-200 transition-colors cursor-pointer"
              >
                {mode === 'signin' 
                  ? "Don't have an account? Create one" 
                  : "Already have an account? Sign In"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
