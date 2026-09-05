import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  LogOut, 
  Check, 
  Sliders, 
  Lock, 
  Sparkles, 
  KeyRound, 
  UserCheck, 
  Clock, 
  Volume2, 
  Radio, 
  ShieldAlert, 
  ShieldCheck,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { useOperator } from '../OperatorContext';
import { GlassCard } from '../components/GlassComponents';

type SettingsCategory = 'profile' | 'notifications' | 'sync' | 'security';

export const OperatorSettingsPage: React.FC = () => {
  const { operator, logout } = useOperator();

  const [activeTab, setActiveTab] = useState<SettingsCategory>('profile');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState('15s');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const navCategories = [
    {
      id: 'profile' as SettingsCategory,
      label: 'Profile & Shift',
      desc: 'Operator credentials & duty hours',
      icon: User,
    },
    {
      id: 'notifications' as SettingsCategory,
      label: 'Notifications',
      desc: 'Critical tones & push alerts',
      icon: Bell,
    },
    {
      id: 'sync' as SettingsCategory,
      label: 'Live Sync',
      desc: 'SVI polling & stream frequency',
      icon: Sliders,
    },
    {
      id: 'security' as SettingsCategory,
      label: 'Security',
      desc: '2FA status & active session',
      icon: Lock,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-purple-900/30">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-md">
              <Settings className="w-4.5 h-4.5 text-purple-400" />
            </div>
            <span>Operator Console Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage your console identity, real-time alert thresholds, and security parameters
          </p>
        </div>

        {isSaved && (
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-sm shadow-emerald-950">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Preferences Saved</span>
          </span>
        )}
      </div>

      {/* Two-Panel Settings Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Internal Settings Navigation (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <GlassCard className="p-3 space-y-1.5 shadow-xl">
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-purple-300/70 border-b border-purple-900/30 mb-1 flex items-center justify-between">
              <span>Settings Categories</span>
              <Sparkles className="w-3 h-3 text-purple-400" />
            </div>

            {navCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/35 via-purple-700/20 to-indigo-950/40 border border-purple-400/50 text-white shadow-[0_4px_20px_rgba(168,85,247,0.25),inset_0_1px_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-purple-950/40 hover:border-purple-800/40 border border-transparent hover:translate-x-0.5'
                  }`}
                >
                  {isActive && (
                    <>
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-300/60 to-transparent pointer-events-none" />
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-purple-400 to-indigo-400 rounded-r-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    </>
                  )}

                  <div className="flex items-center gap-3 relative z-10">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-b from-purple-500/40 to-purple-900/40 text-purple-200 border border-purple-400/60 shadow-[0_0_12px_rgba(168,85,247,0.35)]' 
                        : 'bg-purple-950/40 text-zinc-400 border border-purple-900/30 group-hover:text-purple-300 group-hover:bg-purple-900/40'
                    }`}>
                      <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-tight">{cat.label}</p>
                      <p className="text-[10px] text-zinc-400 group-hover:text-zinc-300 transition-colors">{cat.desc}</p>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 relative z-10 ${
                    isActive ? 'text-purple-300 translate-x-0.5' : 'text-zinc-600 group-hover:text-zinc-400'
                  }`} />
                </button>
              );
            })}
          </GlassCard>

          {/* Quick Identity Card in Left Column */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#120726]/90 via-[#0a0316]/90 to-[#070212]/95 border border-purple-900/35 text-xs text-zinc-400 relative overflow-hidden backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.06)]">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-600/15 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 text-purple-300 mb-1.5 relative z-10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-white">Console Status: Certified</span>
            </div>
            <p className="text-[11px] leading-relaxed relative z-10">
              Assigned to active triage rota under Crisis Response Protocol v4.2.
            </p>
          </div>
        </div>

        {/* Right Side: Main Content Panel (8 cols) */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSave}>
            <GlassCard className="p-6 sm:p-8 relative min-h-[480px] flex flex-col justify-between shadow-2xl">
              {/* Subtle ambient light backdrops */}
              <div className="absolute -left-10 -top-10 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* TOP TAB CONTENT */}
              <div className="relative z-10">
                
                {/* 1. PROFILE & SHIFT PANEL */}
                {activeTab === 'profile' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-purple-900/30">
                      <div>
                        <h2 className="text-base font-bold font-display text-white">Operator Profile & Shift Information</h2>
                        <p className="text-xs text-zinc-400 mt-0.5">Authorised crisis triage operator credentials and shift parameters</p>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5 shadow-sm shadow-emerald-950">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active Duty
                      </span>
                    </div>

                    {/* Rich Operator Avatar & Badge Spotlight */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-indigo-950/30 border border-purple-800/40 flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.08)]">
                      {/* Localized illumination behind identity */}
                      <div className="absolute -left-4 -top-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
                      
                      {/* Luminous AR Avatar */}
                      <div className="relative shrink-0">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-2xl blur-sm opacity-50 pointer-events-none" />
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 border border-purple-300/50 flex items-center justify-center text-white font-mono font-bold text-xl shadow-[0_8px_25px_rgba(147,51,234,0.5),inset_0_1px_2px_0_rgba(255,255,255,0.4)] relative z-10">
                          {operator?.name?.split(' ').map((n) => n[0]).join('') || 'AR'}
                        </div>
                      </div>

                      <div className="text-center sm:text-left min-w-0 flex-1 relative z-10">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                          <h3 className="text-base font-bold text-white tracking-tight">{operator?.name || 'Ananya Roy'}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-500/40 shadow-sm">
                            {operator?.badgeId || 'CR-8821'}
                          </span>
                        </div>
                        <p className="text-xs text-purple-300/80 font-medium">{operator?.role || 'Senior Crisis Specialist & Operator'}</p>
                        <p className="text-[11px] font-mono text-zinc-400 mt-1">{operator?.email || 'ananya.roy@sukoon.ai'}</p>
                      </div>

                      <div className="shrink-0 text-center sm:text-right p-3 rounded-xl bg-purple-950/60 border border-purple-800/40 relative z-10 shadow-inner">
                        <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-0.5">Assigned Shift</span>
                        <span className="text-xs font-bold text-emerald-300 font-mono">Day (08:00 - 18:00)</span>
                      </div>
                    </div>

                    {/* Metadata Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                      <div>
                        <label className="block text-purple-300/80 mb-1.5 font-semibold text-[11px] uppercase tracking-wider">Operator Full Name</label>
                        <input
                          type="text"
                          disabled
                          value={operator?.name || 'Ananya Roy'}
                          className="w-full bg-[#150a2b]/70 border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-zinc-200 cursor-not-allowed font-medium shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-purple-300/80 mb-1.5 font-semibold text-[11px] uppercase tracking-wider">Authorized Email</label>
                        <input
                          type="text"
                          disabled
                          value={operator?.email || 'ananya.roy@sukoon.ai'}
                          className="w-full bg-[#150a2b]/70 border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-zinc-200 cursor-not-allowed font-mono shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-purple-300/80 mb-1.5 font-semibold text-[11px] uppercase tracking-wider">Operator Badge ID</label>
                        <input
                          type="text"
                          disabled
                          value={operator?.badgeId || 'CR-8821'}
                          className="w-full bg-[#150a2b]/70 border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-zinc-200 cursor-not-allowed font-mono font-bold text-purple-300 shadow-inner"
                        />
                      </div>

                      <div>
                        <label className="block text-purple-300/80 mb-1.5 font-semibold text-[11px] uppercase tracking-wider">Assigned Operational Shift</label>
                        <input
                          type="text"
                          disabled
                          value={operator?.shift || 'Day Operations (08:00 - 18:00 IST)'}
                          className="w-full bg-[#150a2b]/70 border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-zinc-200 cursor-not-allowed shadow-inner"
                        />
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. NOTIFICATIONS PANEL */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-4 border-b border-purple-900/30">
                      <div>
                        <h2 className="text-base font-bold font-display text-white">Critical Alert Notifications</h2>
                        <p className="text-xs text-zinc-400 mt-0.5">Configure auditory chimes and desktop push dispatch rules</p>
                      </div>
                      <Volume2 className="w-5 h-5 text-purple-400" />
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Toggle 1: Audio chime */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#14082c]/60 to-[#0c041a]/80 border border-purple-900/40 hover:border-purple-700/60 transition-all flex items-center justify-between gap-4 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.05)]">
                        <div className="space-y-1">
                          <span className="font-bold text-white text-sm block">Audible Tone for Critical SVI Alerts</span>
                          <span className="text-xs text-zinc-400 block leading-relaxed">
                            Plays a distinctive chime whenever any active session crosses the Critical SVI threshold (&gt;75).
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={soundAlerts}
                            onChange={(e) => setSoundAlerts(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-purple-950 border border-purple-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-checked:border-purple-400 peer-checked:shadow-[0_0_14px_rgba(168,85,247,0.5)] shadow-inner"></div>
                        </label>
                      </div>

                      {/* Toggle 2: Desktop push */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#14082c]/60 to-[#0c041a]/80 border border-purple-900/40 hover:border-purple-700/60 transition-all flex items-center justify-between gap-4 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.05)]">
                        <div className="space-y-1">
                          <span className="font-bold text-white text-sm block">Browser Desktop Notifications</span>
                          <span className="text-xs text-zinc-400 block leading-relaxed">
                            Sends high-priority system alerts even when the operator console tab is minimized or running in background.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={desktopNotifications}
                            onChange={(e) => setDesktopNotifications(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-purple-950 border border-purple-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-checked:border-purple-400 peer-checked:shadow-[0_0_14px_rgba(168,85,247,0.5)] shadow-inner"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. LIVE SYNC PANEL */}
                {activeTab === 'sync' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-4 border-b border-purple-900/30">
                      <div>
                        <h2 className="text-base font-bold font-display text-white">Dashboard Live Sync Preferences</h2>
                        <p className="text-xs text-zinc-400 mt-0.5">Control automated telemetry polling frequency & stream bandwidth</p>
                      </div>
                      <Radio className="w-5 h-5 text-purple-400" />
                    </div>

                    <div className="p-5 rounded-2xl bg-gradient-to-b from-[#14082c]/60 to-[#0c041a]/80 border border-purple-900/40 space-y-4 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.05)]">
                      <div>
                        <label className="block text-sm font-bold text-white mb-1">Telemetry Auto-Refresh Polling Interval</label>
                        <p className="text-xs text-zinc-400 mb-3">
                          Select the cadence for querying live session vulnerability indices and queue changes.
                        </p>
                        <select
                          value={autoRefreshInterval}
                          onChange={(e) => setAutoRefreshInterval(e.target.value)}
                          className="w-full sm:w-80 bg-[#150a2b] border border-purple-700/60 hover:border-purple-500 rounded-xl px-4 py-2.5 text-zinc-100 text-xs focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 font-sans cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.1)] transition-all"
                        >
                          <option value="5s">Every 5 seconds (High Frequency Triage)</option>
                          <option value="15s">Every 15 seconds (Recommended Standard)</option>
                          <option value="30s">Every 30 seconds (Balanced Bandwidth)</option>
                          <option value="60s">Every 60 seconds (Low Bandwidth)</option>
                        </select>
                      </div>

                      <div className="pt-3 border-t border-purple-900/30 flex items-center gap-2 text-[11px] text-purple-300/80 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Current WebSocket Heartbeat: 100% stable (Latency: 24ms)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SECURITY PANEL */}
                {activeTab === 'security' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-4 border-b border-purple-900/30">
                      <div>
                        <h2 className="text-base font-bold font-display text-white">Session Security & Authentication</h2>
                        <p className="text-xs text-zinc-400 mt-0.5">Manage operator session validity, cryptographic tokens, and signout</p>
                      </div>
                      <Fingerprint className="w-5 h-5 text-purple-400" />
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#14082c]/60 to-[#0c041a]/80 border border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.05)]">
                        <div>
                          <span className="font-bold text-white text-sm block">Authenticated Operator Session</span>
                          <span className="text-xs text-zinc-400 block mt-0.5">
                            Status: <strong className="text-emerald-400 font-mono">Active & Encrypted</strong> • 2FA Verification: <strong className="text-purple-300 font-mono">Enforced</strong>
                          </span>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-purple-900/60 text-purple-200 font-mono text-xs border border-purple-700/40 shrink-0">
                          Session #OP-9942
                        </span>
                      </div>

                      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-rose-950/25 to-[#1a040b]/30 border border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="font-bold text-rose-300 text-sm block">Terminate Operator Session</span>
                          <span className="text-xs text-zinc-400 block mt-0.5">
                            Immediately logs out and releases your active case queue assignments back to the pool.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={logout}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-semibold transition-all duration-200 cursor-pointer shrink-0 hover:scale-[1.02] active:scale-[0.99] shadow-md shadow-rose-950/50"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* BOTTOM ACTIONS BAR */}
              <div className="pt-6 mt-6 border-t border-purple-900/30 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-sans">
                  Changes to notification and polling preferences are persisted locally.
                </span>

                <button
                  id="save-operator-settings-btn"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-950/60 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  Save Preferences
                </button>
              </div>

            </GlassCard>
          </form>
        </div>

      </div>

    </div>
  );
};
