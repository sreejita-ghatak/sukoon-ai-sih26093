import React, { useState } from 'react';
import { X, User, Mail, Check, Sparkles, Shield } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateDisplayName: (newName: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateDisplayName,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.displayName);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateDisplayName(nameInput.trim());
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-7 border border-purple-500/30 shadow-[0_0_60px_rgba(147,51,234,0.35)] text-white"
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

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-purple-500/20">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-sm">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Profile</h3>
            <p className="text-xs text-purple-200/70 mt-0.5">
              Manage your personal display details for Sukoon AI
            </p>
          </div>
        </div>

        {/* Profile Card & Avatar */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0 border border-purple-400/40">
            {getInitials(profile.displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-white truncate">
              {profile.displayName}
            </h4>
            <p className="text-xs text-purple-300/80 truncate mt-0.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <span>{profile.email}</span>
            </p>
            <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/30 text-[10px] text-purple-200 font-medium">
              <Sparkles className="w-2.5 h-2.5 text-purple-300" />
              <span>{profile.authProvider}</span>
            </div>
          </div>
        </div>

        {/* Save confirmation toast */}
        {saveSuccess && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Display name updated in Sukoon AI.</span>
          </div>
        )}

        {/* Fields */}
        <div className="space-y-4">
          {/* Display Name Section */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-purple-200 uppercase tracking-wider">
                Display Name
              </label>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(profile.displayName);
                    setIsEditing(true);
                  }}
                  className="text-xs text-purple-300 hover:text-white underline cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-3">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter display name"
                  className="w-full px-3.5 py-2 rounded-xl bg-purple-900/50 border border-purple-500/40 text-white placeholder-purple-300/40 text-sm focus:outline-none focus:border-purple-400"
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setNameInput(profile.displayName);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900/60 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-violet-glow px-4 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
                  >
                    Save Name
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm font-medium text-white">{profile.displayName}</p>
            )}

            <p className="text-[11px] text-purple-300/60 mt-2 leading-relaxed">
              This display name is used only within Sukoon AI to address you with warmth and care. It does not alter your Google or email account settings.
            </p>
          </div>

          {/* Email Section (Read-only) */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20">
            <label className="block text-xs font-semibold text-purple-200 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-purple-100/90 font-mono">{profile.email}</span>
              <span className="text-[10px] text-purple-400/80 bg-purple-900/40 px-2 py-0.5 rounded-md border border-purple-500/20">
                Managed by Provider
              </span>
            </div>
            <p className="text-[11px] text-purple-300/60 mt-2">
              Your email is kept confidential and used exclusively for your private account continuity.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center justify-between text-xs text-purple-300/60">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Encrypted Session Identity</span>
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
