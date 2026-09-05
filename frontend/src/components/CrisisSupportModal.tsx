import React from 'react';
import { PhoneCall, X, Phone, MessageSquare, Globe, Heart, Shield, ArrowRight } from 'lucide-react';

interface CrisisSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisSupportModal: React.FC<CrisisSupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-xl animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-support-title"
    >
      <div 
        className="relative w-full max-w-xl glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-500/25 max-h-[90vh] overflow-y-auto no-scrollbar shadow-[0_0_60px_rgba(147,51,234,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-purple-300 hover:text-white bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/20 transition-all cursor-pointer"
          aria-label="Close crisis support modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 drop-shadow-[0_0_12px_rgba(168,85,247,0.5)] shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h2 id="crisis-support-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Immediate Human Crisis Support
            </h2>
            <p className="text-xs sm:text-sm text-purple-300/70">
              Free, confidential 24/7 human helplines and trained responders.
            </p>
          </div>
        </div>

        {/* Calm Intro Notice */}
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200/80 mb-5 leading-relaxed flex items-start gap-2.5">
          <Heart className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span>
            If you are in immediate danger, distress, or need to speak with a trained human professional right away, these resources are available around the clock.
          </span>
        </div>

        {/* Helplines List */}
        <div className="space-y-3 mb-6">
          {/* Resource 1: 988 */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/15 hover:border-purple-400/30 transition-all">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-semibold text-white text-sm">National Crisis & Suicide Lifeline</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-500/20">
                Call or Text
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mb-2">
              Dial <strong className="text-white font-semibold">988</strong> (USA & Canada) — Free, confidential, 24/7
            </p>
            <div className="flex items-center gap-2">
              <a
                href="tel:988"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-white px-2.5 py-1 rounded-lg bg-purple-900/40 border border-purple-500/20 transition-colors"
              >
                <Phone className="w-3 h-3" /> Call 988
              </a>
            </div>
          </div>

          {/* Resource 2: Domestic Violence */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/15 hover:border-purple-400/30 transition-all">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-semibold text-white text-sm">National Domestic Violence Hotline</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-500/20">
                24/7 Confidential
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mb-2">
              Call <strong className="text-white font-semibold">1-800-799-SAFE (7233)</strong> or text <strong className="text-white font-semibold">"START"</strong> to 88788
            </p>
            <div className="flex items-center gap-2">
              <a
                href="tel:18007997233"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-white px-2.5 py-1 rounded-lg bg-purple-900/40 border border-purple-500/20 transition-colors"
              >
                <Phone className="w-3 h-3" /> Call 1-800-799-7233
              </a>
              <a
                href="sms:88788?body=START"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-white px-2.5 py-1 rounded-lg bg-purple-900/40 border border-purple-500/20 transition-colors"
              >
                <MessageSquare className="w-3 h-3" /> Text START to 88788
              </a>
            </div>
          </div>

          {/* Resource 3: Crisis Text Line */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/15 hover:border-purple-400/30 transition-all">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-semibold text-white text-sm">Crisis Text Line</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-500/20">
                Text Support
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mb-2">
              Text <strong className="text-white font-semibold">HOME</strong> to <strong className="text-white font-semibold">741741</strong> to connect with a crisis counselor
            </p>
            <div className="flex items-center gap-2">
              <a
                href="sms:741741?body=HOME"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-white px-2.5 py-1 rounded-lg bg-purple-900/40 border border-purple-500/20 transition-colors"
              >
                <MessageSquare className="w-3 h-3" /> Text HOME to 741741
              </a>
            </div>
          </div>

          {/* Resource 4: International */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/15 hover:border-purple-400/30 transition-all">
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="font-semibold text-white text-sm">International Support</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-500/20">
                Worldwide Directory
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mb-2">
              Find free, confidential crisis hotlines and support services in over 100 countries.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://findahelpline.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-white px-2.5 py-1 rounded-lg bg-purple-900/40 border border-purple-500/20 transition-colors"
              >
                <Globe className="w-3 h-3" /> Visit findahelpline.com
              </a>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-purple-500/15">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 hover:text-white border border-purple-500/20 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
