import React, { useState, useEffect } from 'react';
import { CosmicBackground } from './CosmicBackground';
import { Header } from './Header';
import { HeroContent } from './HeroContent';
import { LuminousLotusHero } from './LuminousLotusHero';
import { PrivacyModal } from './PrivacyModal';
import { ConversationModal } from './ConversationModal';
import { CrisisSupportModal } from './CrisisSupportModal';
import { AccountModal } from './AccountModal';
import { AboutFeatures } from './AboutFeatures';
import { soundscape } from '../utils/audioSynth';
import { getSavedAuthEmail, saveAuthEmail, clearAuthEmail, setAccountConsent, hasAccountConsented } from '../utils/consentStorage';
import { ChevronDown } from 'lucide-react';

export function VictimApp() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isConversationOpen, setIsConversationOpen] = useState(false);
  const [isCrisisSupportOpen, setIsCrisisSupportOpen] = useState(false);
  
  // Persisted or session authenticated state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = getSavedAuthEmail();
    return !!saved;
  });
  const [userEmail, setUserEmail] = useState<string>(() => {
    return getSavedAuthEmail() || '';
  });

  // Pre-seed sample returning account consent for demonstration if not set
  useEffect(() => {
    if (!hasAccountConsented('ghataksreejita@gmail.com')) {
      setAccountConsent('ghataksreejita@gmail.com');
    }
  }, []);

  const [accountModalState, setAccountModalState] = useState<{
    isOpen: boolean;
    mode: 'signin' | 'signup';
  }>({
    isOpen: false,
    mode: 'signin',
  });
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Auth Handlers
  const handleAuthenticated = (email: string) => {
    const trimmed = email.trim();
    setIsAuthenticated(true);
    setUserEmail(trimmed);
    saveAuthEmail(trimmed);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    clearAuthEmail();
  };

  // Quick Panic Exit (Emergency Safety)
  const handleQuickExit = () => {
    // Stop audio
    soundscape.stop();
    // Redirect immediately to neutral page
    window.location.replace('https://www.google.com');
  };

  // Listen for Escape key for instant emergency exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPrivacyOpen) {
          setIsPrivacyOpen(false);
        } else if (isConversationOpen) {
          setIsConversationOpen(false);
        } else if (isCrisisSupportOpen) {
          setIsCrisisSupportOpen(false);
        } else if (accountModalState.isOpen) {
          setAccountModalState((prev) => ({ ...prev, isOpen: false }));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPrivacyOpen, isConversationOpen, isCrisisSupportOpen, accountModalState.isOpen]);

  const handleToggleAudio = () => {
    const state = soundscape.toggle();
    setIsAudioPlaying(state);
  };

  const handleScrollToLearnMore = () => {
    const el = document.getElementById('learn-more');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030108] text-white flex flex-col justify-between overflow-x-hidden select-none font-sans">
      {/* Dynamic Cosmic Background with Particles & Silky Energy Waves */}
      <CosmicBackground />

      {/* Main Full Viewport Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <Header
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onSignIn={() => setAccountModalState({ isOpen: true, mode: 'signin' })}
          onCreateAccount={() => setAccountModalState({ isOpen: true, mode: 'signup' })}
          isAuthenticated={isAuthenticated}
          userEmail={userEmail}
          onSignOut={handleSignOut}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
          onQuickExit={handleQuickExit}
        />

        {/* Hero Section */}
        <main className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-6 sm:py-10 max-w-7xl mx-auto w-full">
          
          {/* Desktop & Mobile Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
            
            {/* On Mobile: Lotus is displayed on top first; On Desktop: on the right (approx 40% width) */}
            <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center items-center py-2 sm:py-4">
              <LuminousLotusHero className="w-full max-w-[380px] sm:max-w-[480px] lg:max-w-[580px] xl:max-w-[620px]" />
            </div>

            {/* Left Copy & Actions */}
            <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center">
              <HeroContent
                onStartConversation={() => setIsConversationOpen(true)}
                onOpenPrivacy={() => setIsPrivacyOpen(true)}
                onOpenCrisisSupport={() => setIsCrisisSupportOpen(true)}
              />
            </div>

          </div>

          {/* Bottom Center: Scroll to learn more */}
          <div className="mt-8 lg:mt-6 pb-4 flex flex-col items-center justify-center text-center">
            <button
              onClick={handleScrollToLearnMore}
              className="group flex flex-col items-center gap-1.5 text-xs text-purple-300/50 hover:text-purple-200 transition-colors focus:outline-none cursor-pointer"
            >
              <span className="tracking-wide">Scroll to learn more</span>
              <ChevronDown className="w-4 h-4 text-purple-400/60 group-hover:text-purple-300 group-hover:translate-y-1 transition-all" />
            </button>
          </div>

        </main>

      </div>

      {/* Extended Information & Helplines Section */}
      <AboutFeatures
        onStartConversation={() => setIsConversationOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* Footer */}
      <footer className="relative z-20 w-full py-8 border-t border-purple-900/30 text-center text-xs text-purple-300/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Sukoon AI. All rights reserved. Private AI-assisted support.</p>
          <div className="flex items-center gap-4 text-purple-300/60">
            <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-purple-200 transition-colors">
              Privacy Architecture
            </button>
            <span>•</span>
            <button onClick={handleQuickExit} className="hover:text-rose-300 transition-colors">
              Discreet Exit
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onStartConversation={() => setIsConversationOpen(true)}
      />

      <ConversationModal
        isOpen={isConversationOpen}
        onClose={() => setIsConversationOpen(false)}
        isAuthenticated={isAuthenticated}
        userEmail={userEmail}
        onAuthenticate={handleAuthenticated}
        onSignOut={handleSignOut}
        onOpenCrisisSupport={() => setIsCrisisSupportOpen(true)}
        onQuickExit={handleQuickExit}
      />

      <CrisisSupportModal
        isOpen={isCrisisSupportOpen}
        onClose={() => setIsCrisisSupportOpen(false)}
      />

      <AccountModal
        isOpen={accountModalState.isOpen}
        initialMode={accountModalState.mode}
        onClose={() => setAccountModalState((prev) => ({ ...prev, isOpen: false }))}
        onAuthenticated={handleAuthenticated}
        onStartConversation={() => setIsConversationOpen(true)}
        onStartAnonymous={() => {
          setAccountModalState((prev) => ({ ...prev, isOpen: false }));
          setIsConversationOpen(true);
        }}
      />
    </div>
  );
}
