import React from 'react';
import { X, HelpCircle, PhoneCall, ShieldCheck, HeartHandshake, AlertCircle, LifeBuoy } from 'lucide-react';

interface HelpSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCrisisSupport?: () => void;
}

export const HelpSafetyModal: React.FC<HelpSafetyModalProps> = ({
  isOpen,
  onClose,
  onOpenCrisisSupport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-7 border border-purple-500/30 shadow-[0_0_60px_rgba(147,51,234,0.35)] text-white max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-purple-300 hover:text-white bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/20 transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-purple-500/20">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-sm">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Help & Safety</h3>
            <p className="text-xs text-purple-200/70 mt-0.5">
              Guidance on using Sukoon AI and finding urgent support
            </p>
          </div>
        </div>

        {/* Direct Crisis Support Banner */}
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-900/60 text-rose-300 shrink-0">
              <PhoneCall className="w-4 h-4 text-rose-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-rose-100">Need Immediate Emergency Help?</h4>
              <p className="text-xs text-rose-200/80 mt-0.5">
                If you are in danger or distress, connect directly with free verified crisis helplines.
              </p>
            </div>
          </div>
          {onOpenCrisisSupport && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCrisisSupport();
              }}
              className="self-start sm:self-center shrink-0 px-4 py-2 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer shadow-md"
            >
              Open Crisis Helplines
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* 1. How Sukoon AI Works */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-200 uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-purple-400" />
              <span>How Sukoon AI Supports You</span>
            </div>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Sukoon AI is designed as a compassionate, non-judgmental conversational sanctuary. You can express thoughts via typing or voice, work through grounding anchors, and unpack feelings at your own rhythm without social fear or urgency.
            </p>
          </div>

          {/* 2. Responsible AI Boundaries */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-200 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-purple-400" />
              <span>Important Boundaries & Limitations</span>
            </div>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Sukoon AI provides reflective emotional support and risk screening. It is not a licensed doctor, psychiatrist, or emergency response service. AI models cannot diagnose clinical conditions or guarantee medical outcomes.
            </p>
          </div>

          {/* 3. Key Crisis Numbers */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-200 uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 text-purple-400" />
              <span>National & Regional Crisis Resources</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-500/20">
                <span className="font-semibold text-white block">Tele-MANAS (India)</span>
                <span className="text-purple-300 font-mono text-sm">14416 / 1800-891-4416</span>
                <span className="text-[10px] text-purple-300/60 block mt-0.5">24/7 Free Mental Health Care</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-500/20">
                <span className="font-semibold text-white block">Vandrevala Foundation</span>
                <span className="text-purple-300 font-mono text-sm">+91 9999 666 555</span>
                <span className="text-[10px] text-purple-300/60 block mt-0.5">24/7 Free Crisis Counseling</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-500/20">
                <span className="font-semibold text-white block">Suicide & Crisis Lifeline</span>
                <span className="text-purple-300 font-mono text-sm">988 (USA / Canada)</span>
                <span className="text-[10px] text-purple-300/60 block mt-0.5">Call or Text 24/7</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-900/40 border border-purple-500/20">
                <span className="font-semibold text-white block">Emergency Helpline</span>
                <span className="text-purple-300 font-mono text-sm">112 (India / EU) / 911 (US)</span>
                <span className="text-[10px] text-purple-300/60 block mt-0.5">Immediate Police & Medical Aid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center justify-between text-xs text-purple-300/60">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Crisis button is always pinned on the top bar</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
