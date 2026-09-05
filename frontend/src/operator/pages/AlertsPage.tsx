import React from 'react';
import { Bell, ShieldAlert, AlertTriangle, Clock, Check, ArrowRight, CheckCheck, Sparkles } from 'lucide-react';
import { useOperator } from '../OperatorContext';
import { GlassCard } from '../components/GlassComponents';

export const AlertsPage: React.FC = () => {
  const { alerts, acknowledgeAlert, navigate } = useOperator();

  const unackCount = alerts.filter((a) => !a.isAcknowledged).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-900/30">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
              <Bell className="w-4.5 h-4.5 text-purple-400" />
            </div>
            <span>Operational Crisis Alerts</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Automated trigger detections for rapid SVI increases, safety threats, and session anomalies
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unackCount > 0 ? (
            <span className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-950/30">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>{unackCount} Unacknowledged Alert{unackCount > 1 ? 's' : ''}</span>
            </span>
          ) : (
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>All Alerts Acknowledged</span>
            </span>
          )}
        </div>
      </div>

      {/* Alerts Grid / List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const isCritical = alert.severity === 'Critical';
          const isHigh = alert.severity === 'High';

          return (
            <GlassCard
              key={alert.id}
              className={`p-5 transition-all ${
                alert.isAcknowledged
                  ? 'opacity-70 bg-[#090412]/50 border-purple-950/30'
                  : isCritical
                  ? 'border-rose-500/50 shadow-xl shadow-rose-950/30 ring-1 ring-rose-500/30 bg-gradient-to-r from-rose-950/30 via-[#10061e]/90 to-[#10061e]/90'
                  : isHigh
                  ? 'border-amber-500/50 shadow-lg shadow-amber-950/25 bg-gradient-to-r from-amber-950/20 via-[#10061e]/90 to-[#10061e]/90'
                  : 'border-purple-800/40 shadow-sm'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                    isCritical
                      ? 'bg-rose-950/90 text-rose-300 border border-rose-600/50 shadow-rose-950/40'
                      : isHigh
                      ? 'bg-amber-950/90 text-amber-300 border border-amber-600/50 shadow-amber-950/40'
                      : 'bg-purple-950/90 text-purple-300 border border-purple-600/50 shadow-purple-950/40'
                  }`}>
                    <ShieldAlert className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                      <span className="font-bold text-white text-sm sm:text-base font-display">
                        {alert.title}
                      </span>
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-purple-950/90 text-purple-200 border border-purple-750/50 shadow-inner">
                        {alert.sessionCode}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : isHigh
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-300 mb-2.5 leading-relaxed">
                      {alert.description}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-zinc-400 font-mono">
                      <span>Trigger: <strong className="text-purple-300">{alert.triggerReason}</strong></span>
                      <span className="text-purple-900">•</span>
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <Clock className="w-3 h-3 text-purple-400" />
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  {!alert.isAcknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3.5 py-2 rounded-xl bg-purple-900/30 hover:bg-purple-900/60 text-purple-300 hover:text-white border border-purple-700/40 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/operator/cases/${alert.caseId}`)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-950 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                  >
                    <span>Open Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </GlassCard>
          );
        })}
      </div>

    </div>
  );
};
