import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Pin, 
  PinOff, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  User, 
  Sliders, 
  Shield, 
  LifeBuoy, 
  LogOut, 
  PanelLeftClose, 
  X,
  MessageSquare,
  Check
} from 'lucide-react';
import { SavedConversation, UserProfile } from '../../types';

interface SignedInSidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
  isMobile: boolean;
  conversations: SavedConversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onTogglePinConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenPreferences: () => void;
  onOpenPrivacyData: () => void;
  onOpenHelpSafety: () => void;
  onSignOut: () => void;
}

export const SignedInSidebar: React.FC<SignedInSidebarProps> = ({
  isOpen,
  onCloseMobile,
  onToggleCollapse,
  isMobile,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onTogglePinConversation,
  onDeleteConversation,
  userProfile,
  onOpenProfile,
  onOpenPreferences,
  onOpenPrivacyData,
  onOpenHelpSafety,
  onSignOut,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
      if (menuOpenId && !(e.target as HTMLElement).closest('.conv-menu-container')) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpenId]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // Filter conversations by title
  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const pinnedList = filteredConversations.filter((c) => c.isPinned);
  const recentList = filteredConversations
    .filter((c) => !c.isPinned)
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const handleStartRename = (conv: SavedConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenId(null);
    setEditingId(conv.id);
    setEditingTitle(conv.title);
  };

  const handleSaveRename = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingTitle.trim()) {
      onRenameConversation(id, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`${
          isMobile
            ? 'fixed top-0 left-0 bottom-0 z-40 w-72'
            : 'relative z-20 w-72 h-full'
        } bg-[#0b051b]/95 border-r border-purple-500/20 flex flex-col justify-between shrink-0 shadow-2xl transition-all duration-300 select-none`}
      >
        {/* TOP SECTION */}
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Header & Logo */}
          <div className="p-4 border-b border-purple-500/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <span className="text-sm font-bold text-white tracking-wide">Sukoon AI</span>
                <span className="text-[10px] text-purple-300/60 block">Personal Safe Space</span>
              </div>
            </div>

            {/* Collapse toggle / Mobile Close */}
            <button
              type="button"
              onClick={isMobile ? onCloseMobile : onToggleCollapse}
              className="p-1.5 rounded-lg text-purple-300/70 hover:text-white hover:bg-purple-900/50 transition-colors cursor-pointer"
              title={isMobile ? "Close sidebar" : "Collapse sidebar"}
            >
              {isMobile ? <X className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* New Conversation Button */}
          <div className="p-3">
            <button
              type="button"
              onClick={() => {
                onNewConversation();
                if (isMobile) onCloseMobile();
              }}
              className="w-full btn-violet-glow py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="px-3 pb-2">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-purple-400/60 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations…"
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-white placeholder-purple-300/40 text-xs focus:outline-none focus:border-purple-400/60 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-purple-300/50 hover:text-white text-xs cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto px-2 py-1 space-y-4 no-scrollbar">
            {/* PINNED SECTION */}
            {pinnedList.length > 0 && (
              <div>
                <div className="px-2 py-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-purple-400/70 uppercase">
                  <Pin className="w-2.5 h-2.5 text-purple-400" />
                  <span>Pinned</span>
                </div>
                <div className="space-y-1 mt-0.5">
                  {pinnedList.map((conv) => (
                    <ConversationRow
                      key={conv.id}
                      conv={conv}
                      isActive={conv.id === activeConversationId}
                      isEditing={editingId === conv.id}
                      editingTitle={editingTitle}
                      onEditingTitleChange={setEditingTitle}
                      onSaveRename={() => handleSaveRename(conv.id)}
                      onCancelRename={() => setEditingId(null)}
                      onSelect={() => {
                        onSelectConversation(conv.id);
                        if (isMobile) onCloseMobile();
                      }}
                      menuOpen={menuOpenId === conv.id}
                      onToggleMenu={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
                      }}
                      onStartRename={(e) => handleStartRename(conv, e)}
                      onTogglePin={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(null);
                        onTogglePinConversation(conv.id);
                      }}
                      onDeleteClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(null);
                        setDeleteConfirmId(conv.id);
                      }}
                      editInputRef={editInputRef}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* RECENT SECTION */}
            <div>
              <div className="px-2 py-1 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-purple-400/70 uppercase">
                <MessageSquare className="w-2.5 h-2.5 text-purple-400" />
                <span>Recent</span>
              </div>
              {recentList.length === 0 && pinnedList.length === 0 ? (
                <div className="text-center py-6 px-3">
                  <p className="text-xs text-purple-300/50">
                    {searchQuery ? 'No conversations matching search.' : 'No saved conversations yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 mt-0.5">
                  {recentList.map((conv) => (
                    <ConversationRow
                      key={conv.id}
                      conv={conv}
                      isActive={conv.id === activeConversationId}
                      isEditing={editingId === conv.id}
                      editingTitle={editingTitle}
                      onEditingTitleChange={setEditingTitle}
                      onSaveRename={() => handleSaveRename(conv.id)}
                      onCancelRename={() => setEditingId(null)}
                      onSelect={() => {
                        onSelectConversation(conv.id);
                        if (isMobile) onCloseMobile();
                      }}
                      menuOpen={menuOpenId === conv.id}
                      onToggleMenu={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
                      }}
                      onStartRename={(e) => handleStartRename(conv, e)}
                      onTogglePin={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(null);
                        onTogglePinConversation(conv.id);
                      }}
                      onDeleteClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(null);
                        setDeleteConfirmId(conv.id);
                      }}
                      editInputRef={editInputRef}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ACCOUNT AREA */}
        <div className="p-3 border-t border-purple-500/15 relative" ref={accountMenuRef}>
          {/* Account Popover Menu */}
          {isAccountMenuOpen && (
            <div className="absolute bottom-16 left-3 right-3 bg-[#120726] border border-purple-500/30 rounded-2xl p-1.5 shadow-[0_0_40px_rgba(0,0,0,0.7)] text-xs text-purple-200 z-50 animate-fade-in space-y-0.5">
              <div className="px-3 py-2 border-b border-purple-500/15 mb-1">
                <span className="text-xs font-semibold text-white block truncate">{userProfile.displayName}</span>
                <span className="text-[10px] text-purple-300/60 block truncate">{userProfile.email}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAccountMenuOpen(false);
                  onOpenProfile();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-900/40 text-purple-200 hover:text-white transition-colors cursor-pointer text-left"
              >
                <User className="w-3.5 h-3.5 text-purple-400" />
                <span>Profile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAccountMenuOpen(false);
                  onOpenPreferences();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-900/40 text-purple-200 hover:text-white transition-colors cursor-pointer text-left"
              >
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Preferences</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAccountMenuOpen(false);
                  onOpenPrivacyData();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-900/40 text-purple-200 hover:text-white transition-colors cursor-pointer text-left"
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Privacy & Data</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAccountMenuOpen(false);
                  onOpenHelpSafety();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-purple-900/40 text-purple-200 hover:text-white transition-colors cursor-pointer text-left"
              >
                <LifeBuoy className="w-3.5 h-3.5 text-purple-400" />
                <span>Help & Safety</span>
              </button>

              <div className="pt-1 mt-1 border-t border-purple-500/15">
                <button
                  type="button"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-950/50 text-rose-300 hover:text-rose-200 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}

          {/* Account Profile Bar Button */}
          <button
            type="button"
            onClick={() => setIsAccountMenuOpen((prev) => !prev)}
            className="w-full p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/20 hover:border-purple-400/40 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm border border-purple-400/30">
                {getInitials(userProfile.displayName)}
              </div>
              <div className="text-left min-w-0">
                <span className="text-xs font-semibold text-white block truncate group-hover:text-purple-200 transition-colors">
                  {userProfile.displayName}
                </span>
                <span className="text-[10px] text-purple-300/60 block truncate">
                  Account Menu
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-400/60 group-hover:text-purple-200 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div 
              className="bg-[#120726] border border-rose-500/40 rounded-2xl p-5 max-w-xs w-full shadow-2xl text-left animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-sm font-bold text-white">Delete conversation?</h4>
              <p className="text-xs text-purple-200/70 mt-1.5 leading-relaxed">
                This will delete this conversation and its message history from your saved sessions.
              </p>
              <div className="flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900/60 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteConversation(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

interface ConversationRowProps {
  conv: SavedConversation;
  isActive: boolean;
  isEditing: boolean;
  editingTitle: string;
  onEditingTitleChange: (val: string) => void;
  onSaveRename: () => void;
  onCancelRename: () => void;
  onSelect: () => void;
  menuOpen: boolean;
  onToggleMenu: (e: React.MouseEvent) => void;
  onStartRename: (e: React.MouseEvent) => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  editInputRef: React.RefObject<HTMLInputElement>;
}

const ConversationRow: React.FC<ConversationRowProps> = ({
  conv,
  isActive,
  isEditing,
  editingTitle,
  onEditingTitleChange,
  onSaveRename,
  onCancelRename,
  onSelect,
  menuOpen,
  onToggleMenu,
  onStartRename,
  onTogglePin,
  onDeleteClick,
  editInputRef,
}) => {
  return (
    <div className="relative group conv-menu-container">
      {isEditing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSaveRename();
          }}
          className="flex items-center gap-1.5 p-1 bg-purple-950/80 border border-purple-400 rounded-xl"
        >
          <input
            ref={editInputRef}
            type="text"
            value={editingTitle}
            onChange={(e) => onEditingTitleChange(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white px-2 py-1 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onCancelRename();
            }}
          />
          <button
            type="submit"
            className="p-1 rounded-md text-emerald-400 hover:bg-emerald-950/60 cursor-pointer"
            title="Save title"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onCancelRename}
            className="p-1 rounded-md text-purple-400 hover:bg-purple-900/60 cursor-pointer"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </form>
      ) : (
        <div
          onClick={onSelect}
          className={`w-full px-2.5 py-2 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer group ${
            isActive
              ? 'bg-purple-900/50 border border-purple-400/40 text-white shadow-sm'
              : 'hover:bg-purple-950/40 text-purple-200/80 hover:text-white border border-transparent'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1 pr-1">
            {conv.isPinned ? (
              <Pin className="w-3 h-3 text-purple-400 shrink-0" />
            ) : (
              <MessageSquare className="w-3 h-3 text-purple-400/60 shrink-0" />
            )}
            <span className="text-xs truncate font-medium">{conv.title}</span>
          </div>

          {/* Three-dot options menu */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={onToggleMenu}
              className={`p-1 rounded-lg hover:bg-purple-800/60 transition-opacity cursor-pointer ${
                menuOpen || isActive ? 'opacity-100 text-purple-200' : 'opacity-0 group-hover:opacity-100 text-purple-400/70'
              }`}
              title="Conversation options"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-6 w-32 bg-[#140828] border border-purple-500/30 rounded-xl p-1 shadow-2xl z-40 text-xs text-purple-200 animate-fade-in space-y-0.5">
                <button
                  type="button"
                  onClick={onStartRename}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-purple-900/50 text-left cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-purple-400" />
                  <span>Rename</span>
                </button>

                <button
                  type="button"
                  onClick={onTogglePin}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-purple-900/50 text-left cursor-pointer transition-colors"
                >
                  {conv.isPinned ? (
                    <>
                      <PinOff className="w-3 h-3 text-purple-400" />
                      <span>Unpin</span>
                    </>
                  ) : (
                    <>
                      <Pin className="w-3 h-3 text-purple-400" />
                      <span>Pin</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onDeleteClick}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-rose-950/60 text-rose-300 hover:text-rose-200 text-left cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-rose-400" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
