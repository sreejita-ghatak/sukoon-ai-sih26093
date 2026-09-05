import React, { useState } from 'react';
import { ShieldCheck, Heart, Sparkles, Clock, Lock, PhoneCall, ChevronDown, ChevronUp } from 'lucide-react';

interface AboutFeaturesProps {
  onStartConversation: () => void;
  onOpenPrivacy: () => void;
}

export const AboutFeatures: React.FC<AboutFeaturesProps> = ({
  onStartConversation,
  onOpenPrivacy,
}) => {
  const [showHelplines, setShowHelplines] = useState(false);

  return (
    <section id="learn-more" className="relative z-20 w-full max-w-6xl mx-auto px-6 sm:px-10 py-24 sm:py-32">
      {/* Subtle section divider glow */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-20" />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/25 text-purple-300 text-xs font-semibold tracking-wide uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>A Safe Space to Speak, Heal & Be Heard</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          Designed with Empathy, <br />
          <span className="text-violet-glow-intense">Protected by Strict Privacy</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-purple-200/70 leading-relaxed">
          Sukoon AI offers a gentle, judgment-free space to speak your truth, understand your options, and find calm whenever you need it most.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
        {/* Card 1 */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-6 group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 text-purple-300" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5">
            Trauma-Informed Care
          </h3>
          <p className="text-sm text-purple-200/70 leading-relaxed">
            Engineered with deep empathy guidelines. The AI responds without judgment, validates your feelings, and never rushes your healing process.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-6 group-hover:scale-105 transition-transform">
            <Lock className="w-6 h-6 text-purple-300" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5">
            Privacy on Your Terms
          </h3>
          <p className="text-sm text-purple-200/70 leading-relaxed">
            Start anonymously with no account required. Your conversation stays private. If you choose, create a secure account to save your chat history and continue your support journey later.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-6 group-hover:scale-105 transition-transform">
            <Clock className="w-6 h-6 text-purple-300" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5">
            Available 24 / 7
          </h3>
          <p className="text-sm text-purple-200/70 leading-relaxed">
            Late nights, anxious mornings, or difficult moments — support is always here instantly, with zero wait times and infinite patience.
          </p>
        </div>
      </div>

      {/* Emergency Crisis Helpline Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-purple-500/20 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
              <PhoneCall className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Need immediate human crisis help?</h4>
              <p className="text-xs text-purple-300/70">Access free, confidential 24/7 human helplines and crisis responders.</p>
            </div>
          </div>
          <button
            onClick={() => setShowHelplines(!showHelplines)}
            className="glass-pill px-4 py-2 rounded-full text-xs font-semibold text-purple-200 hover:text-white flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <span>{showHelplines ? "Hide Numbers" : "View Helplines"}</span>
            {showHelplines ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showHelplines && (
          <div className="mt-6 pt-6 border-t border-purple-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs animate-fade-in">
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/15">
              <span className="font-semibold text-white block mb-1">National Crisis & Suicide Lifeline</span>
              <p className="text-purple-300/80 mb-1.5">Dial <strong className="text-purple-200">988</strong> (USA & Canada) — Free, 24/7</p>
              <span className="text-[11px] text-purple-400">Call or Text</span>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/15">
              <span className="font-semibold text-white block mb-1">National Domestic Violence Hotline</span>
              <p className="text-purple-300/80 mb-1.5">Call <strong className="text-purple-200">1-800-799-SAFE (7233)</strong> or text "START" to 88788</p>
              <span className="text-[11px] text-purple-400">Confidential & 24/7</span>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/15">
              <span className="font-semibold text-white block mb-1">Crisis Text Line</span>
              <p className="text-purple-300/80 mb-1.5">Text <strong className="text-purple-200">HOME</strong> to 741741</p>
              <span className="text-[11px] text-purple-400">Connect with a Crisis Counselor</span>
            </div>
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/15">
              <span className="font-semibold text-white block mb-1">International Support</span>
              <p className="text-purple-300/80 mb-1.5">Visit <strong className="text-purple-200">findahelpline.com</strong></p>
              <span className="text-[11px] text-purple-400">Free, confidential support worldwide</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA Block */}
      <div className="text-center mt-16">
        <button
          onClick={onStartConversation}
          className="btn-violet-glow px-8 py-3.5 rounded-full text-white font-semibold text-base inline-flex items-center gap-3 cursor-pointer"
        >
          <span>Begin Private Conversation</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
