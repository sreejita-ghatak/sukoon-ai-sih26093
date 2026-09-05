import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  MessagesSquare, 
  Bell, 
  BarChart3, 
  Settings, 
  LogOut, 
  ShieldAlert, 
  UserCheck,
  X
} from 'lucide-react';
import { useOperator } from '../OperatorContext';

interface OperatorSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const OperatorSidebar: React.FC<OperatorSidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const { currentPath, navigate, operator, logout, alerts } = useOperator();

  const unacknowledgedAlertsCount = alerts.filter((a) => !a.isAcknowledged).length;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/operator/dashboard',
      icon: LayoutDashboard,
      active: currentPath === '/operator/dashboard',
    },
    {
      label: 'Case Queue',
      path: '/operator/cases',
      icon: Inbox,
      active: currentPath === '/operator/cases' || currentPath.startsWith('/operator/cases/'),
    },
    {
      label: 'All Sessions',
      path: '/operator/sessions',
      icon: MessagesSquare,
      active: currentPath === '/operator/sessions',
    },
    {
      label: 'Alerts',
      path: '/operator/alerts',
      icon: Bell,
      active: currentPath === '/operator/alerts',
      badge: unacknowledgedAlertsCount > 0 ? unacknowledgedAlertsCount : undefined,
    },
    {
      label: 'Reports',
      path: '/operator/reports',
      icon: BarChart3,
      active: currentPath === '/operator/reports',
    },
    {
      label: 'Settings',
      path: '/operator/settings',
      icon: Settings,
      active: currentPath === '/operator/settings',
    },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#070212]/95 backdrop-blur-2xl border-r border-purple-900/30 text-zinc-300 select-none relative overflow-hidden shadow-2xl">
      {/* Subtle background ambient purple glow */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Branding */}
      <div className="p-5 border-b border-purple-900/30 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md shadow-purple-950/50">
            <ShieldAlert className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-white text-base tracking-wide">SUKOON AI</span>
            </div>
            <p className="text-[10px] font-mono font-semibold text-purple-400 uppercase tracking-widest">Operator Console</p>
          </div>
        </div>

        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Operator Live Status Chip */}
      <div className="px-5 py-2.5 border-b border-purple-900/20 bg-purple-950/25 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="text-xs font-medium text-emerald-300">Console Online</span>
        </div>
        <span className="text-[10px] text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded-md border border-purple-700/40 font-mono font-semibold">
          SECURE
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto relative z-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              id={`operator-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer group relative overflow-hidden ${
                item.active
                  ? 'bg-gradient-to-r from-purple-600/30 via-purple-700/20 to-indigo-950/40 text-white border border-purple-400/45 shadow-[0_4px_16px_rgba(168,85,247,0.2),inset_0_1px_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-purple-950/35 hover:border-purple-800/35 border border-transparent hover:translate-x-1'
              }`}
            >
              {item.active && (
                <>
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-transparent pointer-events-none" />
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-purple-400 to-indigo-400 rounded-r-full shadow-[0_0_6px_rgba(168,85,247,0.7)]" />
                </>
              )}
              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  item.active 
                    ? 'bg-purple-500/25 text-purple-200 border border-purple-400/40 shadow-sm shadow-purple-900/50' 
                    : 'text-zinc-400 group-hover:text-purple-200 group-hover:bg-purple-900/35'
                }`}>
                  <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
                </div>
                <span className="font-medium tracking-tight group-hover:text-white transition-colors">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-950 animate-pulse relative z-10">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Operator Identity & Logout */}
      <div className="p-4 border-t border-purple-900/30 bg-[#0a0417]/90 relative z-10">
        <div className="flex items-center justify-between gap-2 mb-3 p-2 rounded-xl bg-purple-950/30 border border-purple-900/30">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-mono font-bold text-xs shrink-0 shadow-md">
              {operator?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('') || 'AR'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{operator?.name || 'Ananya Roy'}</p>
              <p className="text-[10px] font-mono text-purple-300/70 truncate">{operator?.role || 'Operator'}</p>
            </div>
          </div>
          <span title="Verified Operator" className="shrink-0 text-emerald-400">
            <UserCheck className="w-4 h-4" />
          </span>
        </div>

        <button
          id="operator-logout-btn"
          onClick={() => {
            if (onMobileClose) onMobileClose();
            logout();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition-all duration-200 cursor-pointer shadow-sm"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Console</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
