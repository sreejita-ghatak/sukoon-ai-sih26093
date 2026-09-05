import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  PieChart as PieIcon, 
  Download, 
  Users, 
  CheckCircle2,
  PhoneCall,
  HeartHandshake,
  Scale,
  ShieldAlert,
  Activity,
  Mic,
  AlertTriangle
} from 'lucide-react';
import { REPORTS_DATA, SVI_DISTRIBUTION, SVI_TREND_DATA } from '../mockData';
import { GlassCard, GlassKpiCard, ChartGlossTooltip } from '../components/GlassComponents';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend
} from 'recharts';

export const ReportsPage: React.FC = () => {
  // Dynamically calculate the total sessions from risk breakdown to avoid hardcoding
  const dynamicTotal = REPORTS_DATA.riskBreakdown.reduce((sum, item) => sum + item.value, 0);

  // Intervention icon & color mapping
  const getInterventionDetails = (actionName: string) => {
    switch (actionName) {
      case 'Emergency Helpline':
        return {
          icon: PhoneCall,
          variant: 'critical' as const,
          badgeBg: 'bg-rose-950/70 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-950',
          podBg: 'bg-rose-900/40 border-rose-500/50 text-rose-300 shadow-inner',
          glowBg: 'bg-rose-600/25',
          iconColor: 'text-rose-300',
        };
      case 'Human Follow-up':
        return {
          icon: Users,
          variant: 'success' as const,
          badgeBg: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-950',
          podBg: 'bg-emerald-900/40 border-emerald-500/50 text-emerald-300 shadow-inner',
          glowBg: 'bg-emerald-600/25',
          iconColor: 'text-emerald-300',
        };
      case 'Counselling Referral':
        return {
          icon: HeartHandshake,
          variant: 'cyan' as const,
          badgeBg: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-950',
          podBg: 'bg-cyan-900/40 border-cyan-500/50 text-cyan-300 shadow-inner',
          glowBg: 'bg-cyan-600/25',
          iconColor: 'text-cyan-300',
        };
      case 'Legal Aid Advisory':
        return {
          icon: Scale,
          variant: 'purple' as const,
          badgeBg: 'bg-purple-950/70 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-950',
          podBg: 'bg-purple-900/40 border-purple-500/50 text-purple-300 shadow-inner',
          glowBg: 'bg-purple-600/25',
          iconColor: 'text-purple-300',
        };
      case 'Police Support Connection':
      default:
        return {
          icon: ShieldAlert,
          variant: 'cyan' as const,
          badgeBg: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-950',
          podBg: 'bg-cyan-900/40 border-cyan-500/50 text-cyan-300 shadow-inner',
          glowBg: 'bg-cyan-600/25',
          iconColor: 'text-cyan-300',
        };
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-900/30">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
              <BarChart3 className="w-4.5 h-4.5 text-purple-400" />
            </div>
            <span>Aggregate Telemetry & Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Privacy-preserving aggregate metrics across all active shifts and support escalations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-300 font-mono bg-purple-950/70 px-3.5 py-1.5 rounded-xl border border-purple-800/50 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Reporting Window: Today (24h)
          </span>
        </div>
      </div>

      {/* Aggregate KPI Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <GlassKpiCard
          title="Total Volume Handled"
          value={dynamicTotal || REPORTS_DATA.totalSessions}
          subtitle="100% end-to-end encrypted telemetry"
          badge="Encrypted"
          badgeType="purple"
          icon={Activity}
          variant="purple"
        />

        <GlassKpiCard
          title="Escalations Triggered"
          value={REPORTS_DATA.escalationsCount}
          subtitle={`Avg response: ${REPORTS_DATA.averageResponseTime}`}
          badge="Priority"
          badgeType="amber"
          icon={AlertTriangle}
          variant="high"
        />

        <GlassKpiCard
          title="Voice Telemetry Sessions"
          value={REPORTS_DATA.voiceAnalysisCount}
          subtitle="44% of total volume"
          badge="Acoustic"
          badgeType="purple"
          icon={Mic}
          variant="purple"
        />

        <GlassKpiCard
          title="Resolution Rate"
          value="71.4%"
          subtitle="Safe de-escalation achieved (45 / 63)"
          badge="De-escalated"
          badgeType="emerald"
          icon={CheckCircle2}
          variant="success"
        />

      </div>

      {/* 2 Major Charts: Risk Distribution & Hourly Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk Distribution Breakdown (Donut with center label) */}
        <GlassCard className="lg:col-span-6 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm sm:text-base font-bold font-display text-white">
                Sessions by SVI Risk Level
              </h2>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-700/40">
                PROPORTION
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-4">Volume breakdown across vulnerability tiers</p>
            
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<ChartGlossTooltip unit="Sessions" />} />
                  <Pie
                    data={REPORTS_DATA.riskBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={92}
                    innerRadius={62}
                    paddingAngle={3}
                    stroke="#0e071c"
                    strokeWidth={2}
                  >
                    {REPORTS_DATA.riskBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Dynamic Center Label Inside Donut Chart */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                  {dynamicTotal}
                </span>
                <span className="text-[11px] font-semibold text-purple-300/80 uppercase tracking-wider">
                  Total Cases
                </span>
              </div>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-purple-900/30 mt-2">
            {REPORTS_DATA.riskBreakdown.map((item) => (
              <div key={item.name} className="p-2 rounded-xl bg-purple-950/20 border border-purple-900/30 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-xs font-semibold text-zinc-200">{item.name}</span>
                </div>
                <span className="text-xs font-mono font-bold text-white">{item.value}</span>
                <span className="text-[10px] text-zinc-400 ml-1">
                  ({((item.value / dynamicTotal) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Hourly Volume vs High Risk Spikes */}
        <GlassCard className="lg:col-span-6 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm sm:text-base font-bold font-display text-white">
                Session Volume by Hour of Day
              </h2>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-700/40">
                HOURLY TREND
              </span>
            </div>
            <p className="text-xs text-zinc-400 mb-4">Total session throughput with high-risk volume overlay</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={REPORTS_DATA.hourlyVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barTotalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#6b21a8" />
                    </linearGradient>
                    <linearGradient id="barHighGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#9f1239" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3b1d6e" opacity={0.3} vertical={false} />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip content={<ChartGlossTooltip unit="Sessions" />} />
                  <Bar dataKey="total" fill="url(#barTotalGrad)" radius={[5, 5, 0, 0]} name="Total Sessions" />
                  <Bar dataKey="highRisk" fill="url(#barHighGrad)" radius={[5, 5, 0, 0]} name="High / Critical" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-purple-900/30 mt-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-purple-600 shadow-sm" />
              <span className="text-zinc-300 font-medium">Total Sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-rose-500 shadow-sm" />
              <span className="text-zinc-300 font-medium">High / Critical Spike</span>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Actionable Support Interventions Summary */}
      <GlassCard className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm sm:text-base font-bold font-display text-white">
            Support Interventions Triggered
          </h2>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-700/40">
            ACTION PROTOCOLS
          </span>
        </div>
        <p className="text-xs text-zinc-400 mb-5">Frequency of suggested resources and external connections provided during active triage</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {REPORTS_DATA.actionDistribution.map((item) => {
            const details = getInterventionDetails(item.action);
            const Icon = details.icon;
            return (
              <GlassCard
                key={item.action}
                variant={details.variant}
                hoverEffect
                className="p-4 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Ambient glow behind icon */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-xl pointer-events-none transition-all duration-300 ${details.glowBg}`} />

                <div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 group-hover:scale-110 ${details.podBg}`}>
                      <Icon className={`w-4.5 h-4.5 ${details.iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${details.badgeBg}`}>
                      Active
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-white leading-snug relative z-10">{item.action}</h3>
                </div>

                <div className="flex items-baseline justify-between mt-4 pt-2 border-t border-white/10 relative z-10">
                  <span className="text-2xl font-extrabold font-mono text-white tracking-tight">{item.count}</span>
                  <span className="text-[11px] text-zinc-400 font-medium">referrals</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </GlassCard>

    </div>
  );
};
