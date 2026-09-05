import React from 'react';
import { Shield, Lock, EyeOff, Trash2, Mic, PhoneOff, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onStartConversation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-xl animate-fade-in">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-purple-500/25 max-h-[90vh] overflow-y-auto no-scrollbar shadow-[0_0_60px_rgba(147,51,234,0.35)]"
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

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Privacy & Security by Design
            </h2>
            <p className="text-xs sm:text-sm text-purple-300/70">
              Built specifically to provide a safe, respectful environment for victims and complainants.
            </p>
          </div>
        </div>

        {/* 4 Pillars of Privacy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {/* Pillar 1 */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/15 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-200 font-semibold text-sm">
              <EyeOff className="w-4 h-4 text-purple-400" />
              <span>Anonymous Access Available</span>
            </div>
            <p className="text-xs text-purple-200/70 leading-relaxed">
              Start immediately with no account required. Anonymous access is always available without needing an email or personal credentials.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/15 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-200 font-semibold text-sm">
              <Trash2 className="w-4 h-4 text-purple-400" />
              <span>Privacy on Your Terms</span>
            </div>
            <p className="text-xs text-purple-200/70 leading-relaxed">
              Your privacy is our priority. Start anonymously, or optionally create a secure account whenever you wish to save your history.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/15 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-200 font-semibold text-sm">
              <Mic className="w-4 h-4 text-purple-400" />
              <span>Optional Voice Privacy — Prototype Feature</span>
            </div>
            <p className="text-xs text-purple-200/70 leading-relaxed">
              Optional voice modulation is designed to reduce direct voice identifiability. Availability depends on the enabled voice features.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/15 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-200 font-semibold text-sm">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Quick Exit Protection</span>
            </div>
            <p className="text-xs text-purple-200/70 leading-relaxed">
              Press the Escape (ESC) key or Quick Exit button at any moment to immediately close the interface and redirect to a neutral page.
            </p>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="p-4 sm:p-5 rounded-2xl bg-purple-900/15 border border-purple-500/20 mb-6">
          <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-3">
            Our Commitments to You
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-purple-100/80">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Your conversations are treated as private and are not sold or used for advertising. Data handling is minimized and protected according to the service’s privacy practices.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Anonymous access is always available — creating an account is completely optional.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Trauma-informed AI trained to provide non-judgmental, calm emotional support.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-sm font-medium text-purple-300 hover:text-white hover:bg-purple-900/30 transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onStartConversation();
            }}
            className="w-full sm:w-auto btn-violet-glow px-6 py-2.5 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start a Conversation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
