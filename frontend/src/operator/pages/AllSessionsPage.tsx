import React, { useState, useMemo } from 'react';
import { Search, MessagesSquare, ChevronRight, User, Shield, Filter, Sparkles } from 'lucide-react';
import { useOperator } from '../OperatorContext';
import { RiskBadge, StatusBadge } from '../components/Badges';
import { GlassCard } from '../components/GlassComponents';

export const AllSessionsPage: React.FC = () => {
  const { cases, navigate } = useOperator();

  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'All' | 'Anonymous' | 'Account Session'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredSessions = useMemo(() => {
    return cases.filter((s) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim().replace('#', '').replace('session', '').trim();
        const matchId = s.id.toLowerCase().includes(q) || s.sessionCode.toLowerCase().includes(q);
        const matchStatus = s.status.toLowerCase().includes(q);
        if (!matchId && !matchStatus) return false;
      }
      if (userTypeFilter !== 'All' && s.userType !== userTypeFilter) {
        return false;
      }
      if (statusFilter !== 'All' && s.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [cases, searchQuery, userTypeFilter, statusFilter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-900/30">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
              <MessagesSquare className="w-4.5 h-4.5 text-purple-400" />
            </div>
            <span>All Monitored Sessions</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Comprehensive audit registry of all anonymous and authenticated support sessions
          </p>
        </div>

        <span className="text-xs text-purple-300 font-mono bg-purple-950/70 px-3.5 py-1.5 rounded-xl border border-purple-800/50 shadow-sm">
          Showing <strong className="text-white">{filteredSessions.length}</strong> total sessions
        </span>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="all-sessions-search"
            type="text"
            placeholder="Filter sessions by ID or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#150a2b]/70 border border-purple-900/50 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 font-sans transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* User Type Filter */}
          <div className="flex items-center gap-1 bg-purple-950/40 p-1 rounded-xl border border-purple-900/40">
            {(['All', 'Anonymous', 'Account Session'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setUserTypeFilter(type)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  userTypeFilter === type
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {type === 'Account Session' ? 'Account' : type}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-purple-950/40 p-1 rounded-xl border border-purple-900/40">
            {['All', 'New', 'Acknowledged', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

      </GlassCard>

      {/* Sessions Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-purple-900/40 bg-purple-950/40 text-purple-300/80 font-mono font-medium">
                <th className="py-3.5 pl-4 sm:pl-6">Session ID</th>
                <th className="py-3.5">Session Type</th>
                <th className="py-3.5">Risk Level</th>
                <th className="py-3.5">Current SVI</th>
                <th className="py-3.5">Started</th>
                <th className="py-3.5">Last Activity</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 text-right pr-4 sm:pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/20">
              {filteredSessions.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => navigate(`/operator/cases/${s.id}`)}
                  className="hover:bg-purple-950/40 transition-colors cursor-pointer group"
                >
                  <td className="py-4 pl-4 sm:pl-6 font-mono font-bold text-white group-hover:text-purple-300 transition-colors">
                    {s.sessionCode}
                  </td>
                  <td className="py-4">
                    <span className="text-zinc-300 font-medium">
                      {s.userType === 'Anonymous' ? 'Anonymous Session' : `Account (${s.maskedUserId})`}
                    </span>
                  </td>
                  <td className="py-4">
                    <RiskBadge level={s.riskLevel} />
                  </td>
                  <td className="py-4 font-mono font-bold text-purple-200">
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple-950/80 border border-purple-700/50">
                      SVI {s.svi}
                    </span>
                  </td>
                  <td className="py-4 text-zinc-400 font-mono">
                    {s.startedAt}
                  </td>
                  <td className="py-4 text-zinc-400 font-mono">
                    {s.lastActivity}
                  </td>
                  <td className="py-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="py-4 text-right pr-4 sm:pr-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/operator/cases/${s.id}`);
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-medium transition-all cursor-pointer shadow-sm"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

    </div>
  );
};
