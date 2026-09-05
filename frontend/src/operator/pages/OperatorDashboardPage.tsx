import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight,
  ChevronRight,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { useOperator } from '../OperatorContext';
import { SVI_DISTRIBUTION, SVI_TREND_DATA } from '../mockData';
import { RiskBadge, StatusBadge } from '../components/Badges';
import { GlassCard, GlassKpiCard, ChartGlossTooltip } from '../components/GlassComponents';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';

export const OperatorDashboardPage: React.FC = () => {
  const { operator, cases, alerts, navigate } = useOperator();

  // Metric Computations
  const activeSessionsCount = cases.filter((c) => c.status !== 'Resolved').length;
  const highRiskCasesCount = cases.filter((c) => (c.riskLevel === 'High' || c.riskLevel === 'Critical') && c.status !== 'Resolved').length;
  const criticalAlertsCount = alerts.filter((a) => a.severity === 'Critical' && !a.isAcknowledged).length;
  const resolvedTodayCount = cases.filter((c) => c.status === 'Resolved').length + 42; // Real prototype total

  // Filter high risk cases for quick action
  const highRiskCases = cases
    .filter((c) => c.riskLevel === 'High' || c.riskLevel === 'Critical')
    .slice(0, 4);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#160a30]/85 via-[#0d061c]/90 to-[#100726]/85 border border-purple-800/35 backdrop-blur-2xl shadow-[0_16px_45px_-10px_rgba(0,0,0,0.75),inset_0_1px_1px_0_rgba(255,255,255,0.12)] overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        {/* Soft radial purple/blue ambient backdrops */}
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-purple-600/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-56 h-56 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Faint glass reflection near upper edge */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono text-purple-200 bg-purple-900/40 px-2.5 py-0.5 rounded-full border border-purple-600/40 flex items-center gap-1.5 shadow-sm shadow-purple-950">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Real-Time Telemetry Stream
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight drop-shadow-[0_2px_12px_rgba(168,85,247,0.2)]">
            Welcome back, {operator?.name || 'Operator'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Operational Overview & Telemetry • Shift ID: <span className="text-purple-300 font-mono font-semibold">{operator?.badgeId || 'CR-8821'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            id="dashboard-view-queue-btn"
            onClick={() => navigate('/operator/cases')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-950/60 hover:shadow-purple-900/80 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.99] border border-purple-400/30"
          >
            <span>View Case Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Active Sessions */}
        <GlassKpiCard
          title="Active Sessions"
          value={activeSessionsCount}
          subtitle="Monitored in real-time"
          badge="Live Monitoring"
          badgeType="emerald"
          icon={Users}
          variant="purple"
          onClick={() => navigate('/operator/sessions')}
        />

        {/* High Risk Cases */}
        <GlassKpiCard
          title="High Risk Cases"
          value={highRiskCasesCount}
          subtitle="Requires immediate review"
          badge="Action Required"
          badgeType="amber"
          icon={AlertTriangle}
          variant="high"
          onClick={() => navigate('/operator/cases')}
        />

        {/* Critical Alerts */}
        <GlassKpiCard
          title="Critical Alerts"
          value={criticalAlertsCount}
          subtitle="Awaiting acknowledgement"
          badge="Immediate"
          badgeType="rose"
          icon={ShieldAlert}
          variant="critical"
          onClick={() => navigate('/operator/alerts')}
        />

        {/* Resolved Today */}
        <GlassKpiCard
          title="Resolved Today"
          value={resolvedTodayCount}
          subtitle="Safely de-escalated"
          badge="Safe Closure"
          badgeType="emerald"
          icon={CheckCircle2}
          variant="success"
          onClick={() => navigate('/operator/reports')}
        />

      </div>

      {/* Main Grid: Risk Overview Distribution + Average SVI Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk Overview (SVI Ranges & Distribution) - 5 cols */}
        <GlassCard className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm sm:text-base font-bold font-display text-white">Risk Overview (SVI Distribution)</h2>
                <p className="text-[11px] text-zinc-400">Sukoon Vulnerability Index (SVI) Categorization</p>
              </div>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-700/40">
                OPERATOR ONLY
              </span>
            </div>

            {/* SVI Scale Key Details */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-300">Low (0–25)</span>
                  <span className="text-xs font-bold font-mono text-white">24</span>
                </div>
                <div className="w-full bg-zinc-800/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full w-[38%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-yellow-950/20 border border-yellow-500/20 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-yellow-300">Moderate (26–50)</span>
                  <span className="text-xs font-bold font-mono text-white">21</span>
                </div>
                <div className="w-full bg-zinc-800/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-full rounded-full w-[33%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300">High (51–75)</span>
                  <span className="text-xs font-bold font-mono text-white">12</span>
                </div>
                <div className="w-full bg-zinc-800/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full w-[19%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-300">Critical (76–100)</span>
                  <span className="text-xs font-bold font-mono text-white">6</span>
                </div>
                <div className="w-full bg-zinc-800/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-500 to-rose-400 h-full rounded-full w-[10%]" />
                </div>
              </div>
            </div>

            {/* Distribution Bar Chart with glossy styling */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SVI_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="barGradYellow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fde047" />
                      <stop offset="100%" stopColor="#ca8a04" />
                    </linearGradient>
                    <linearGradient id="barGradAmber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fb923c" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                    <linearGradient id="barGradRose" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#be123c" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3b1d6e" opacity={0.25} vertical={false} />
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip content={<ChartGlossTooltip unit="Cases" />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    <Cell fill="url(#barGradEmerald)" />
                    <Cell fill="url(#barGradYellow)" />
                    <Cell fill="url(#barGradAmber)" />
                    <Cell fill="url(#barGradRose)" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 mt-2 border-t border-purple-900/30 pt-2.5 text-center">
            Total Monitored Sessions: <span className="text-white font-mono font-bold">63</span>
          </p>
        </GlassCard>

        {/* Average SVI Trend (Restrained & Readable) - 7 cols */}
        <GlassCard className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-sm sm:text-base font-bold font-display text-white">Average SVI Trend (Today)</h2>
                <p className="text-[11px] text-zinc-400">Aggregate vulnerability trajectory across all active shifts</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800/40">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                <span>Shift Avg: <strong>47 SVI</strong></span>
              </div>
            </div>

            <div className="h-64 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SVI_TREND_DATA} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sviGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3b1d6e" opacity={0.3} vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip content={<ChartGlossTooltip unit="SVI" />} />
                  <Area
                    type="monotone"
                    dataKey="avgSvi"
                    name="Average SVI"
                    stroke="#c084fc"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#sviGradient)"
                    dot={{ fill: '#c084fc', stroke: '#581c87', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#ffffff', stroke: '#a855f7', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-zinc-400 border-t border-purple-900/30 pt-3 mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400 shadow-sm shadow-purple-400" /> Hourly Mean SVI Index
            </span>
            <span className="font-mono text-purple-300">Last refreshed: Live Sync</span>
          </div>
        </GlassCard>

      </div>

      {/* Recent High-Risk Cases Section */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold font-display text-white">Recent High-Risk Cases</h2>
            <p className="text-xs text-zinc-400">Cases requiring prompt review and counsellor oversight</p>
          </div>
          <button
            onClick={() => navigate('/operator/cases')}
            className="text-xs text-purple-300 hover:text-white flex items-center gap-1 font-medium transition-colors cursor-pointer px-3 py-1 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/40"
          >
            <span>All Cases ({cases.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-purple-900/40 text-purple-300/80 font-mono font-medium">
                <th className="pb-3 pl-2">Session ID</th>
                <th className="pb-3">Current SVI</th>
                <th className="pb-3">Risk Level</th>
                <th className="pb-3">Escalation / Trigger</th>
                <th className="pb-3">Latest Activity</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/20">
              {highRiskCases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate(`/operator/cases/${c.id}`)}
                  className="hover:bg-purple-950/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 pl-2 font-mono font-bold text-white group-hover:text-purple-300 transition-colors">
                    {c.sessionCode}
                  </td>
                  <td className="py-3.5">
                    <span className="font-mono font-bold text-purple-200 px-2.5 py-0.5 rounded-lg bg-purple-950/80 border border-purple-700/50">
                      SVI {c.svi}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <RiskBadge level={c.riskLevel} size="sm" />
                  </td>
                  <td className="py-3.5 text-zinc-300 max-w-[200px] truncate">
                    {c.escalationStatus}
                  </td>
                  <td className="py-3.5 text-zinc-400 font-mono">
                    {c.lastActivity}
                  </td>
                  <td className="py-3.5">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/operator/cases/${c.id}`);
                      }}
                      className="px-3 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-medium transition-all cursor-pointer shadow-sm"
                    >
                      Open Case
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
