import React from 'react';
import { Shield, Sparkles, Volume2, VolumeX, LogOut, UserCheck } from 'lucide-react';

interface HeaderProps {
  onOpenPrivacy: () => void;
  onSignIn?: () => void;
  onCreateAccount?: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
  onSignOut?: () => void;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
  onQuickExit?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPrivacy,
  onSignIn,
  onCreateAccount,
  isAuthenticated = false,
  userEmail = '',
  onSignOut,
  isAudioPlaying,
  onToggleAudio,
  onQuickExit,
}) => {
  return (
    <header className="relative z-30 w-full px-6 sm:px-10 lg:px-16 pt-6 sm:pt-8 flex items-center justify-between">
      {/* Brand Mark & Title */}
      <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        {/* Luminous Purple Lotus Logo Mark */}
        <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-purple-500/25 blur-md group-hover:bg-purple-400/40 transition-all duration-500" />
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full relative z-10 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Lotus Petals SVG */}
            <path
              d="M50 15 C50 15 36 38 36 56 C36 67 42 74 50 78 C58 74 64 67 64 56 C64 38 50 15 50 15Z"
              fill="url(#lotusGradCenter)"
              opacity="0.95"
            />
            <path
              d="M50 25 C45 35 22 45 18 62 C15 73 24 81 33 82 C41 82 46 76 50 78 C42 72 36 65 36 56 C36 44 46 32 50 25Z"
              fill="url(#lotusGradLeft)"
              opacity="0.8"
            />
            <path
              d="M50 25 C55 35 78 45 82 62 C85 73 76 81 67 82 C59 82 54 76 50 78 C58 72 64 65 64 56 C64 44 54 32 50 25Z"
              fill="url(#lotusGradRight)"
              opacity="0.8"
            />
            <path
              d="M50 42 C40 50 8 58 6 72 C5 82 14 87 23 87 C34 87 43 81 50 80 C40 78 30 76 30 68 C30 58 43 49 50 42Z"
              fill="url(#lotusGradOuterLeft)"
              opacity="0.65"
            />
            <path
              d="M50 42 C60 50 92 58 94 72 C95 82 86 87 77 87 C66 87 57 81 50 80 C60 78 70 76 70 68 C70 58 57 49 50 42Z"
              fill="url(#lotusGradOuterRight)"
              opacity="0.65"
            />
            <circle cx="50" cy="65" r="4.5" fill="#ffffff" filter="drop-shadow(0 0 4px #ffffff)" />

            <defs>
              <linearGradient id="lotusGradCenter" x1="50" y1="15" x2="50" y2="78" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f5f3ff" />
                <stop offset="40%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>
              <linearGradient id="lotusGradLeft" x1="18" y1="25" x2="50" y2="82" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e9d5ff" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6b21a8" />
              </linearGradient>
              <linearGradient id="lotusGradRight" x1="82" y1="25" x2="50" y2="82" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e9d5ff" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6b21a8" />
              </linearGradient>
              <linearGradient id="lotusGradOuterLeft" x1="6" y1="42" x2="50" y2="87" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d8b4fe" />
                <stop offset="100%" stopColor="#581c87" />
              </linearGradient>
              <linearGradient id="lotusGradOuterRight" x1="94" y1="42" x2="50" y2="87" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d8b4fe" />
                <stop offset="100%" stopColor="#581c87" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-bold tracking-[0.08em] text-white/95 group-hover:text-purple-200 transition-colors">
              SUKOON AI
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-normal text-purple-200/65 tracking-wide -mt-0.5">
            Private AI-assisted support
          </span>
        </div>
      </div>

      {/* Right Controls: Sign In / Create Account, Shield Pill & Emergency / Sound Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Subtle Secondary Navigation: Sign In & Create Account OR Authenticated Profile Badge */}
        {isAuthenticated ? (
          <div className="flex items-center gap-1.5 rounded-full bg-purple-950/50 border border-purple-500/30 px-3 py-1 text-xs text-purple-200 mr-0.5 sm:mr-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="max-w-[110px] sm:max-w-[140px] truncate font-medium text-white text-[11px] sm:text-xs">
              {userEmail || 'Account Active'}
            </span>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="ml-1 text-[10px] text-purple-300/60 hover:text-purple-200 transition-colors cursor-pointer"
                title="Sign out of Sukoon AI"
              >
                (Sign out)
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center rounded-full bg-purple-950/35 border border-purple-500/20 p-0.5 text-xs text-purple-300/70 mr-0.5 sm:mr-1">
            <button
              onClick={onSignIn}
              className="px-2 sm:px-2.5 py-1 rounded-full hover:text-white hover:bg-purple-900/40 transition-colors font-medium cursor-pointer"
            >
              Sign In
            </button>
            <span className="text-purple-500/30 text-[10px] select-none">•</span>
            <button
              onClick={onCreateAccount}
              className="px-2 sm:px-2.5 py-1 rounded-full hover:text-white hover:bg-purple-900/40 transition-colors font-medium cursor-pointer"
            >
              Create Account
            </button>
          </div>
        )}

        {/* Soothing Sound Toggle (Optional calm frequency) */}
        {onToggleAudio && (
          <button
            onClick={onToggleAudio}
            title={isAudioPlaying ? "Mute calming soundscape" : "Play calming theta soundscape"}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-full glass-pill text-purple-300 hover:text-purple-100 transition-all text-xs flex items-center gap-1.5 focus:outline-none"
            aria-label="Toggle ambient calm audio"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                <span className="hidden md:inline text-[11px] text-purple-200/80">432Hz Tone</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-purple-400/60" />
                <span className="hidden md:inline text-[11px] text-purple-300/60">Sound</span>
              </>
            )}
          </button>
        )}

        {/* Top-Right Shield Pill */}
        <button
          onClick={onOpenPrivacy}
          className="glass-pill px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-2 sm:gap-2.5 text-xs sm:text-xs text-purple-200/90 hover:text-white transition-all duration-300 group cursor-pointer"
          title="Click to view security and privacy architecture"
        >
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 group-hover:text-purple-300 transition-colors drop-shadow-[0_0_6px_rgba(192,132,252,0.6)]" />
          <span className="hidden sm:inline font-medium tracking-wide">
            Private <span className="text-purple-400/60 mx-0.5">•</span> Confidential <span className="text-purple-400/60 mx-0.5">•</span> Secure
          </span>
          <span className="sm:hidden font-medium text-[11px] tracking-wide">
            Private & Secure
          </span>
        </button>

        {/* Quick Exit (Safety Panic Button) */}
        {onQuickExit && (
          <button
            onClick={onQuickExit}
            title="Emergency Quick Exit (Leaves site immediately & clears session)"
            className="glass-pill px-2.5 py-1.5 rounded-full text-[11px] text-rose-300/80 hover:text-rose-200 hover:border-rose-500/30 transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3 h-3 text-rose-400" />
            <span className="hidden lg:inline text-[10px] uppercase tracking-wider font-semibold">Quick Exit</span>
          </button>
        )}
      </div>
    </header>
  );
};
