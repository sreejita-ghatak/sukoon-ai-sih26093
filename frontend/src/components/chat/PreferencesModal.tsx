import React from 'react';
import { X, Sliders, Volume2, Globe, Eye, Sparkles } from 'lucide-react';
import { UserPreferences } from '../../types';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-7 border border-purple-500/30 shadow-[0_0_60px_rgba(147,51,234,0.35)] text-white max-h-[90vh] overflow-y-auto no-scrollbar"
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
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Preferences</h3>
            <p className="text-xs text-purple-200/70 mt-0.5">
              Customize your comfort, voice pace, and reading experience
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Section 1: Voice & Audio Interaction */}
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-200 uppercase tracking-wider">
              <Volume2 className="w-4 h-4 text-purple-400" />
              <span>Voice & Speech Delivery</span>
            </div>

            {/* Voice Pace */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs sm:text-sm font-medium text-white">Voice Speech Pace</p>
                <p className="text-[11px] text-purple-300/60">Speed when listening to AI responses</p>
              </div>
              <div className="inline-flex rounded-xl bg-purple-900/50 p-1 border border-purple-500/30">
                <button
                  type="button"
                  onClick={() => onUpdatePreferences({ voiceSpeed: 'gentle' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    preferences.voiceSpeed === 'gentle'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  Gentle (0.9x)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdatePreferences({ voiceSpeed: 'natural' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    preferences.voiceSpeed === 'natural'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  Natural (1.0x)
                </button>
              </div>
            </div>

            {/* Auto Read Voice */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-500/15">
              <div>
                <p className="text-xs sm:text-sm font-medium text-white">Auto-Read AI Voice Responses</p>
                <p className="text-[11px] text-purple-300/60">Automatically speak AI replies when you use voice</p>
              </div>
              <button
                type="button"
                onClick={() => onUpdatePreferences({ autoReadVoice: !preferences.autoReadVoice })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  preferences.autoReadVoice ? 'bg-purple-600' : 'bg-purple-950 border border-purple-500/30'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.autoReadVoice ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 2: Display & Reading Comfort */}
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-200 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Reading Comfort</span>
            </div>

            {/* Font Size */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs sm:text-sm font-medium text-white">Chat Text Size</p>
                <p className="text-[11px] text-purple-300/60">Adjust readability scale for conversations</p>
              </div>
              <div className="inline-flex rounded-xl bg-purple-900/50 p-1 border border-purple-500/30">
                <button
                  type="button"
                  onClick={() => onUpdatePreferences({ fontSize: 'normal' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    preferences.fontSize === 'normal'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => onUpdatePreferences({ fontSize: 'relaxed' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    preferences.fontSize === 'relaxed'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  Relaxed
                </button>
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-500/15">
              <div>
                <p className="text-xs sm:text-sm font-medium text-white">Reduced Motion</p>
                <p className="text-[11px] text-purple-300/60">Minimize background particles and gentle pulsing</p>
              </div>
              <button
                type="button"
                onClick={() => onUpdatePreferences({ reducedMotion: !preferences.reducedMotion })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  preferences.reducedMotion ? 'bg-purple-600' : 'bg-purple-950 border border-purple-500/30'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    preferences.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 3: Language */}
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-200 uppercase tracking-wider mb-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <span>Language Preference</span>
            </div>
            <select
              value={preferences.language}
              onChange={(e) => onUpdatePreferences({ language: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-purple-900/50 border border-purple-500/30 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400 cursor-pointer"
            >
              <option value="English" className="bg-[#0b051b] text-white">English (Default)</option>
              <option value="Hindi" className="bg-[#0b051b] text-white">Hindi (हिंदी)</option>
              <option value="Urdu" className="bg-[#0b051b] text-white">Urdu (اردو)</option>
              <option value="Bilingual" className="bg-[#0b051b] text-white">Bilingual / Hinglish (English + Hindi)</option>
            </select>
            <p className="text-[11px] text-purple-300/60 mt-2">
              Sukoon AI understands input in multiple languages and responds with empathetic clarity.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center justify-between text-xs text-purple-300/60">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Comfort settings saved automatically</span>
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
