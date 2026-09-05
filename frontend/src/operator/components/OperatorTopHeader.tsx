import React, { useState } from 'react';
import { Menu, Search, Bell, Shield, ArrowRight } from 'lucide-react';
import { useOperator } from '../OperatorContext';

interface OperatorTopHeaderProps {
  onToggleMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

export const OperatorTopHeader: React.FC<OperatorTopHeaderProps> = ({
  onToggleMobileMenu,
  title,
  subtitle,
}) => {
  const { currentPath, navigate, alerts, cases } = useOperator();
  const [searchQuery, setSearchQuery] = useState('');

  const unacknowledgedCount = alerts.filter((a) => !a.isAcknowledged).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase().replace('#', '').replace('session', '').trim();
    if (!query) return;

    // Search by case ID or session code
    const matched = cases.find(
      (c) => c.id.toLowerCase() === query || c.sessionCode.toLowerCase().includes(query)
    );
    if (matched) {
      navigate(`/operator/cases/${matched.id}`);
      setSearchQuery('');
    } else {
      navigate(`/operator/cases?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-[#070212]/85 backdrop-blur-xl border-b border-purple-900/30 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-lg shadow-purple-950/20">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white bg-purple-950/30 border border-purple-900/30 hover:bg-purple-900/40 transition-all cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {title ? (
            <h1 className="text-base sm:text-lg font-bold font-display text-white tracking-tight">{title}</h1>
          ) : (
            <div className="flex items-center gap-2 text-xs font-mono text-purple-300/70">
              <span className="text-zinc-500 font-sans">CONSOLE</span>
              <span className="text-purple-500">/</span>
              <span className="text-purple-300 font-semibold uppercase">
                {currentPath.replace('/operator/', '').replace('/', ' / ') || 'DASHBOARD'}
              </span>
            </div>
          )}
          {subtitle && <p className="text-xs text-zinc-400 hidden sm:block font-sans mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Right controls: Fast Search & Alerts Shortcut */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="operator-header-search"
            type="text"
            placeholder="Search Session ID (e.g. 1287)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56 lg:w-64 bg-purple-950/30 border border-purple-900/40 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all font-mono"
          />
        </form>

        <button
          onClick={() => navigate('/operator/alerts')}
          className="relative p-2 rounded-xl bg-purple-950/30 border border-purple-900/40 text-zinc-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-900/30 transition-all cursor-pointer shadow-sm"
          title="Operator Alerts"
          aria-label="View Alerts"
        >
          <Bell className="w-4 h-4 text-purple-300" />
          {unacknowledgedCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono font-bold text-[10px] flex items-center justify-center animate-pulse shadow-sm shadow-rose-950">
              {unacknowledgedCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
