import React from 'react';
import { MessageSquare, ArrowRight, ChevronRight, Lock, Sparkles } from 'lucide-react';

interface HeroContentProps {
  onStartConversation: () => void;
  onOpenPrivacy: () => void;
  onOpenCrisisSupport?: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  onStartConversation,
  onOpenPrivacy,
  onOpenCrisisSupport,
}) => {
  return (
    <div className="flex flex-col justify-center max-w-xl xl:max-w-2xl text-left z-20">
      
      {/* Primary Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-[-0.03em] leading-[1.08] text-white">
        <span className="block text-white/95">
          You are not alone.
        </span>
        <span className="block mt-1 sm:mt-1.5">
          <span className="text-white/95">We are </span>
          <span className="text-violet-glow-intense inline-block">
            here for you.
          </span>
        </span>
      </h1>

      {/* Supporting Copy */}
      <p className="mt-5 sm:mt-7 text-base sm:text-lg lg:text-xl font-normal text-purple-100/75 leading-relaxed max-w-lg">
        A private space to talk, share and be heard —
        <br className="hidden sm:inline" />
        {' '}at your own pace.
      </p>

      {/* CTA Button & Secondary Privacy Link & Urgent Crisis Action */}
      <div className="mt-8 sm:mt-10 flex flex-col items-start gap-3.5 sm:gap-4">
        {/* Main CTA Button: Start a Conversation */}
        <button
          onClick={onStartConversation}
          id="btn-start-conversation"
          className="btn-violet-glow group relative px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-white font-semibold text-base sm:text-lg flex items-center gap-3 cursor-pointer select-none"
        >
          <MessageSquare className="w-5 h-5 text-purple-200 group-hover:scale-110 transition-transform duration-300" />
          <span className="tracking-wide">Start a Conversation</span>
          <ArrowRight className="w-5 h-5 text-purple-200 group-hover:translate-x-1 transition-transform duration-300" />
        </button>

        {/* Secondary Links Row: Learn how privacy works + Discreet Crisis Support */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 pt-1">
          {/* Secondary Privacy Link */}
          <button
            onClick={onOpenPrivacy}
            id="btn-learn-privacy"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-medium text-purple-300/80 hover:text-purple-100 transition-colors pl-1 py-1 focus:outline-none cursor-pointer"
          >
            <span>Learn how privacy works</span>
            <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 group-hover:text-purple-200 transition-all" />
          </button>

          {onOpenCrisisSupport && (
            <>
              <span className="hidden sm:inline text-purple-500/40 text-xs select-none">•</span>
              {/* Discreet Urgent Crisis Support Link */}
              <button
                onClick={onOpenCrisisSupport}
                id="btn-urgent-crisis-help"
                className="group flex items-center gap-1.5 text-xs sm:text-sm font-medium text-purple-300/80 hover:text-purple-100 transition-colors pl-1 sm:pl-0 py-1 focus:outline-none cursor-pointer"
              >
                <span>Need urgent human help?</span>
                <span className="text-purple-300 underline underline-offset-4 decoration-purple-500/50 group-hover:decoration-purple-200 flex items-center gap-1 font-semibold">
                  View crisis support <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom-left Privacy Guarantee Indicator */}
      <div className="mt-12 sm:mt-16 lg:mt-20 flex items-center gap-2.5 text-xs sm:text-sm text-purple-300/60 font-medium">
        <Lock className="w-4 h-4 text-purple-400/80" />
        <span>Your privacy is our priority</span>
      </div>
    </div>
  );
};
