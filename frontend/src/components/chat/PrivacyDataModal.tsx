import React, { useState } from 'react';
import { X, Shield, Trash2, AlertTriangle, Check, UserX, Database, Info } from 'lucide-react';

interface PrivacyDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedConversationsCount: number;
  onClearAllHistory: () => void;
  onDeleteAccount: () => void;
}

export const PrivacyDataModal: React.FC<PrivacyDataModalProps> = ({
  isOpen,
  onClose,
  savedConversationsCount,
  onClearAllHistory,
  onDeleteAccount,
}) => {
  const [confirmState, setConfirmState] = useState<'none' | 'clearHistory' | 'deleteAccount'>('none');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteClear = () => {
    onClearAllHistory();
    setConfirmState('none');
    setFeedbackMessage('All conversation history has been cleared.');
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleExecuteDeleteAccount = () => {
    setConfirmState('none');
    onDeleteAccount();
  };

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
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Privacy & Data</h3>
            <p className="text-xs text-purple-200/70 mt-0.5">
              Control your saved conversations and account storage
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Storage Summary */}
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-xs sm:text-sm font-semibold text-white">Saved Conversations</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-900/70 text-purple-200 border border-purple-500/30">
                {savedConversationsCount} {savedConversationsCount === 1 ? 'chat' : 'chats'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-purple-200/70 mt-2 leading-relaxed">
              Because you chose <strong>Sign In & Save Progress</strong>, your conversations and custom titles are safely retained for your personal continuity. You can manage or delete any conversation at any time.
            </p>
          </div>

          {/* Account Data Association Explanation */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-200 uppercase tracking-wider">
              <Info className="w-3.5 h-3.5 text-purple-400" />
              <span>What is Associated With Your Account</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] sm:text-xs text-purple-200/75 leading-relaxed">
              <li>Your saved conversation transcripts and reflection history.</li>
              <li>Your custom conversation titles and pinned status.</li>
              <li>Your personalized comfort preferences and display name.</li>
              <li>Private Sessions are ephemeral and never added to your account history.</li>
              <li>No personal advertising profiles are ever built from your conversations.</li>
            </ul>
          </div>

          {/* Action 1: Clear All History */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-white">Clear All Conversation History</h4>
              <p className="text-[11px] text-purple-300/60 mt-0.5">
                Permanently removes all saved chats from your signed-in workspace.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmState('clearHistory')}
              disabled={savedConversationsCount === 0}
              className="self-start sm:self-center shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium text-amber-200 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
          </div>

          {/* Action 2: Delete Account & Stored Data */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-rose-200">Delete Account & Stored Data</h4>
              <p className="text-[11px] text-rose-300/60 mt-0.5">
                Erases your Sukoon profile, preferences, and all saved session data.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmState('deleteAccount')}
              className="self-start sm:self-center shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium text-rose-200 bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/40 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

        {/* Confirmation Overlay / Dialog */}
        {confirmState !== 'none' && (
          <div className="mt-5 p-4 rounded-2xl bg-[#14061a] border border-amber-500/40 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-900/50 text-amber-300 shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">
                  {confirmState === 'clearHistory'
                    ? 'Clear all saved conversations?'
                    : 'Permanently delete your Sukoon account?'}
                </h4>
                <p className="text-xs text-purple-200/80 mt-1 leading-relaxed">
                  {confirmState === 'clearHistory'
                    ? 'This will erase all past conversations and custom titles from your account. This action cannot be undone.'
                    : 'This will erase all saved conversations, preferences, and sign you out immediately.'}
                </p>
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setConfirmState('none')}
                    className="px-3 py-1.5 rounded-xl text-xs text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900/60 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmState === 'clearHistory' ? handleExecuteClear : handleExecuteDeleteAccount}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold text-white cursor-pointer shadow-md ${
                      confirmState === 'clearHistory'
                        ? 'bg-amber-600 hover:bg-amber-500'
                        : 'bg-rose-600 hover:bg-rose-500'
                    }`}
                  >
                    {confirmState === 'clearHistory' ? 'Yes, Clear All' : 'Yes, Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center justify-between text-xs text-purple-300/60">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Confidential & User-Controlled</span>
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
