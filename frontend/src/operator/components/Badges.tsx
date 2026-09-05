import React from 'react';
import { RiskLevel, CaseStatus } from '../types';

export const RiskBadge: React.FC<{ level: RiskLevel; size?: 'sm' | 'md' | 'lg' }> = ({ level, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] font-mono',
    md: 'px-2.5 py-1 text-xs font-mono font-medium',
    lg: 'px-3.5 py-1.5 text-sm font-mono font-semibold',
  }[size];

  switch (level) {
    case 'Critical':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-950/70 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-950/40 backdrop-blur-md ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-400" />
          Critical
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-950/70 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-950/40 backdrop-blur-md ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-300" />
          High
        </span>
      );
    case 'Moderate':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-yellow-950/60 text-yellow-300 border border-yellow-500/40 shadow-sm backdrop-blur-md ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          Moderate
        </span>
      );
    case 'Low':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-950/40 backdrop-blur-md ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
          Low
        </span>
      );
  }
};

export const StatusBadge: React.FC<{ status: CaseStatus; size?: 'sm' | 'md' }> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px] font-mono' : 'px-2.5 py-1 text-xs font-mono font-medium';

  switch (status) {
    case 'New':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-lg bg-purple-900/40 text-purple-200 border border-purple-400/50 shadow-sm shadow-purple-900/30 backdrop-blur-md ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          New
        </span>
      );
    case 'Acknowledged':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-lg bg-indigo-950/70 text-indigo-300 border border-indigo-500/40 shadow-sm backdrop-blur-md ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          Acknowledged
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-lg bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 shadow-sm backdrop-blur-md ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          Resolved
        </span>
      );
  }
};
