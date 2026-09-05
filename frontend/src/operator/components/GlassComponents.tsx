import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'purple' | 'critical' | 'high' | 'success' | 'cyan';
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  hoverEffect = false,
  className = '',
  children,
  ...props
}) => {
  const variantClass = {
    default: 'bg-gradient-to-b from-[#0e0720]/80 via-[#0a0418]/85 to-[#070212]/90 border-purple-900/30 text-zinc-100 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.7),inset_0_1px_1px_0_rgba(255,255,255,0.08)]',
    purple: 'glass-card-purple text-zinc-100',
    critical: 'glass-card-critical text-zinc-100',
    high: 'glass-card-high text-zinc-100',
    success: 'glass-card-success text-zinc-100',
    cyan: 'glass-card-cyan text-zinc-100',
  }[variant];

  return (
    <div
      className={`relative backdrop-blur-2xl border rounded-2xl overflow-hidden transition-all duration-200 ${
        hoverEffect ? 'hover:scale-[1.01] hover:-translate-y-1 hover:shadow-2xl hover:border-purple-400/40 cursor-pointer' : ''
      } ${variantClass} ${className}`}
      {...props}
    >
      {/* Specular top-edge highlight for true glass reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent pointer-events-none" />
      {/* Soft internal gradient depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.025] to-transparent pointer-events-none" />
      {children}
    </div>
  );
};

interface GlassKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeType?: 'default' | 'emerald' | 'amber' | 'rose' | 'purple';
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'purple' | 'critical' | 'high' | 'success';
  onClick?: () => void;
  className?: string;
}

export const GlassKpiCard: React.FC<GlassKpiCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  badgeType = 'default',
  icon: Icon,
  variant = 'default',
  onClick,
  className = '',
}) => {
  const iconConfig = {
    default: {
      pod: 'bg-gradient-to-b from-purple-800/40 via-purple-900/30 to-[#120626]/80 border-purple-500/40 text-purple-200 group-hover:border-purple-300/70 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]',
      glow: 'bg-purple-600/15 group-hover:bg-purple-500/30',
      highlight: 'via-purple-300/30',
    },
    purple: {
      pod: 'bg-gradient-to-b from-purple-700/45 via-indigo-900/35 to-[#120626]/80 border-purple-400/45 text-purple-200 group-hover:border-purple-300/80 group-hover:text-white group-hover:shadow-[0_0_22px_rgba(168,85,247,0.4)]',
      glow: 'bg-purple-500/20 group-hover:bg-purple-400/35',
      highlight: 'via-purple-200/40',
    },
    critical: {
      pod: 'bg-gradient-to-b from-rose-700/45 via-rose-950/40 to-[#1e050f]/80 border-rose-500/45 text-rose-200 group-hover:border-rose-400/80 group-hover:text-white group-hover:shadow-[0_0_22px_rgba(244,63,94,0.4)]',
      glow: 'bg-rose-600/20 group-hover:bg-rose-500/35',
      highlight: 'via-rose-200/40',
    },
    high: {
      pod: 'bg-gradient-to-b from-amber-700/45 via-amber-950/40 to-[#220d04]/80 border-amber-500/45 text-amber-200 group-hover:border-amber-400/80 group-hover:text-white group-hover:shadow-[0_0_22px_rgba(249,115,22,0.4)]',
      glow: 'bg-amber-600/20 group-hover:bg-amber-500/35',
      highlight: 'via-amber-200/40',
    },
    success: {
      pod: 'bg-gradient-to-b from-emerald-700/45 via-emerald-950/40 to-[#041e12]/80 border-emerald-500/45 text-emerald-200 group-hover:border-emerald-400/80 group-hover:text-white group-hover:shadow-[0_0_22px_rgba(16,185,129,0.4)]',
      glow: 'bg-emerald-600/20 group-hover:bg-emerald-500/35',
      highlight: 'via-emerald-200/40',
    },
  }[variant];

  const badgeClass = {
    default: 'text-zinc-400 bg-purple-950/60 border-purple-800/40',
    emerald: 'text-emerald-300 bg-emerald-950/60 border-emerald-700/50 shadow-sm shadow-emerald-950',
    amber: 'text-amber-300 bg-amber-950/60 border-amber-700/50 shadow-sm shadow-amber-950',
    rose: 'text-rose-300 bg-rose-950/60 border-rose-700/50 shadow-sm shadow-rose-950',
    purple: 'text-purple-300 bg-purple-950/60 border-purple-700/50 shadow-sm shadow-purple-950',
  }[badgeType];

  return (
    <div
      onClick={onClick}
      className={`group relative bg-gradient-to-b from-[#0e0720]/85 via-[#0a0418]/85 to-[#070212]/90 backdrop-blur-2xl border border-purple-900/35 hover:border-purple-400/50 rounded-2xl p-5 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.7),inset_0_1px_1px_0_rgba(255,255,255,0.08)] hover:shadow-2xl hover:shadow-purple-950/50 hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden ${className}`}
    >
      {/* Contextual ambient background glow */}
      <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-2xl transition-all duration-300 pointer-events-none ${iconConfig.glow}`} />
      
      {/* Specular top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

      <div className="flex items-center justify-between mb-3.5 relative z-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-300/70 group-hover:text-purple-200 transition-colors">
          {title}
        </span>
        
        {/* Luminous Glass Icon Pod */}
        <div className="relative">
          <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-inner transition-all duration-200 relative overflow-hidden ${iconConfig.pod}`}>
            {/* Top specular reflection arc */}
            <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${iconConfig.highlight} to-transparent pointer-events-none`} />
            <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 relative z-10" />
          </div>
        </div>
      </div>

      <div className="flex items-baseline justify-between relative z-10">
        <div className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white group-hover:text-purple-100 transition-colors">
          {value}
        </div>
        {badge && (
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 font-mono ${badgeClass}`}>
            {badgeType === 'rose' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
            {badgeType === 'emerald' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] text-zinc-400 mt-2 font-medium relative z-10 flex items-center gap-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export const ChartGlossTooltip: React.FC<{
  active?: boolean;
  payload?: any[];
  label?: string;
  unit?: string;
}> = ({ active, payload, label, unit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e0620]/95 backdrop-blur-2xl border border-purple-500/40 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
        {label && <p className="font-semibold text-purple-200 border-b border-purple-900/50 pb-1 mb-1 font-mono">{label}</p>}
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: entry.color || entry.fill || '#c084fc' }} />
              {entry.name || 'Value'}:
            </span>
            <span className="font-mono font-bold text-white">
              {entry.value} {unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
