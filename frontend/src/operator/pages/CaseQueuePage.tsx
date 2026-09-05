import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, Inbox, ShieldAlert, Sparkles, User, RefreshCw, Layers } from 'lucide-react';
import { useOperator } from '../OperatorContext';
import { RiskBadge, StatusBadge } from '../components/Badges';
import { GlassCard } from '../components/GlassComponents';
import { RiskLevel, CaseStatus } from '../types';

export const CaseQueuePage: React.FC = () => {
  const { cases, navigate } = useOperator();

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | CaseStatus>('All');
  const [sortBy, setSortBy] = useState<'priority' | 'svi' | 'activity'>('priority');

  // Filter and prioritize
  const filteredCases = useMemo(() => {
    return cases
      .filter((c) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim().replace('#', '').replace('session', '').trim();
          const matchId = c.id.toLowerCase().includes(q) || c.sessionCode.toLowerCase().includes(q);
          const matchEscalation = c.escalationStatus.toLowerCase().includes(q);
          const matchOp = c.assignedOperator.toLowerCase().includes(q);
          if (!matchId && !matchEscalation && !matchOp) return false;
        }

        // Risk filter
        if (riskFilter !== 'All' && c.riskLevel !== riskFilter) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'All' && c.status !== statusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          // Priority order: Critical (4) > High (3) > Moderate (2) > Low (1)
          const priorityWeight: Record<RiskLevel, number> = {
            Critical: 4,
            High: 3,
            Moderate: 2,
            Low: 1,
          };
          const diff = priorityWeight[b.riskLevel] - priorityWeight[a.riskLevel];
          if (diff !== 0) return diff;
          // Tie-break with SVI score
          return b.svi - a.svi;
        }
        if (sortBy === 'svi') {
          return b.svi - a.svi;
        }
        return 0; // Default
      });
  }, [cases, searchQuery, riskFilter, statusFilter, sortBy]);

  const riskCounts = useMemo(() => {
    return {
      All: cases.length,
      Critical: cases.filter((c) => c.riskLevel === 'Critical').length,
      High: cases.filter((c) => c.riskLevel === 'High').length,
      Moderate: cases.filter((c) => c.riskLevel === 'Moderate').length,
      Low: cases.filter((c) => c.riskLevel === 'Low').length,
    };
  }, [cases]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-900/30">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
              <Inbox className="w-4.5 h-4.5 text-purple-400" />
            </div>
            <span>Case Queue & Triage</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Priority queue ordered by vulnerability index (Critical & High priority first)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-300 font-mono bg-purple-950/70 px-3.5 py-1.5 rounded-xl border border-purple-800/50 shadow-sm">
            Showing <strong className="text-white">{filteredCases.length}</strong> of {cases.length} cases
          </span>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <GlassCard className="p-4 sm:p-5 space-y-4">
        
        {/* Top filter row: Search + Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="case-queue-search"
              type="text"
              placeholder="Search by Session ID, Escalation, or Operator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#150a2b]/70 border border-purple-900/50 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 transition-all font-sans"
            />
          </div>

          {/* Status Filter Pill Group */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300/70 mr-1 hidden sm:inline">Status:</span>
            {(['All', 'New', 'Acknowledged', 'Resolved'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/60 border border-purple-400/40'
                    : 'bg-purple-950/30 text-zinc-400 hover:text-white border border-purple-900/30 hover:bg-purple-900/40'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

        </div>

        {/* Bottom filter row: Risk Level Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-purple-900/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300/70 mr-1">Risk Level:</span>
          {(['All', 'Critical', 'High', 'Moderate', 'Low'] as const).map((lvl) => {
            const count = riskCounts[lvl];
            const isSelected = riskFilter === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-500/25 text-white border border-purple-400/60 shadow-sm shadow-purple-950/50'
                    : 'bg-purple-950/20 text-zinc-400 hover:text-zinc-200 border border-purple-900/30 hover:bg-purple-900/30'
                }`}
              >
                <span>{lvl}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-purple-600 text-white' : 'bg-purple-950/80 text-purple-300 border border-purple-800/40'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </GlassCard>

      {/* Cases Table */}
      <GlassCard className="overflow-hidden">
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center text-zinc-400">
            <Inbox className="w-10 h-10 text-purple-400/40 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">No cases match your filters</h3>
            <p className="text-xs text-zinc-400 mt-1">Try resetting the risk or status filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setRiskFilter('All');
                setStatusFilter('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-md shadow-purple-950"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-900/40 bg-purple-950/40 text-purple-300/80 font-mono font-medium">
                  <th className="py-3.5 pl-4 sm:pl-6">Session ID</th>
                  <th className="py-3.5">Risk Level</th>
                  <th className="py-3.5">Current SVI</th>
                  <th className="py-3.5">Escalation Status</th>
                  <th className="py-3.5">Assigned Operator</th>
                  <th className="py-3.5">Latest Activity</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5 text-right pr-4 sm:pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/20">
                {filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    id={`case-row-${c.id}`}
                    onClick={() => navigate(`/operator/cases/${c.id}`)}
                    className="hover:bg-purple-950/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 pl-4 sm:pl-6">
                      <div className="flex items-center gap-2 font-mono font-bold text-white group-hover:text-purple-300 transition-colors">
                        <span>{c.sessionCode}</span>
                        {c.inputType.includes('Voice') && (
                          <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-600/40 shadow-sm">
                            Voice
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400">
                        {c.userType === 'Anonymous' ? 'Anonymous Session' : `Encrypted ID (${c.maskedUserId})`}
                      </span>
                    </td>

                    <td className="py-4">
                      <RiskBadge level={c.riskLevel} />
                    </td>

                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-purple-200 px-2.5 py-0.5 rounded-lg bg-purple-950/80 border border-purple-700/50">
                          {c.svi}
                        </span>
                        <span className={`text-[10px] font-medium ${
                          c.riskTrend === 'Rising' ? 'text-rose-400 font-semibold' : c.riskTrend === 'Decreasing' ? 'text-emerald-400 font-semibold' : 'text-zinc-400'
                        }`}>
                          {c.riskTrend === 'Rising' ? '↑ Rising' : c.riskTrend === 'Decreasing' ? '↓ Easing' : '→ Stable'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4">
                      <span className="text-zinc-200 font-medium">
                        {c.escalationStatus}
                      </span>
                    </td>

                    <td className="py-4 text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400/80" />
                        <span className="font-medium">{c.assignedOperator}</span>
                      </div>
                    </td>

                    <td className="py-4 text-zinc-400 font-mono">
                      {c.lastActivity}
                    </td>

                    <td className="py-4">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="py-4 text-right pr-4 sm:pr-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/operator/cases/${c.id}`);
                        }}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-medium transition-all cursor-pointer shadow-sm"
                      >
                        <span>Open Case</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

    </div>
  );
};
