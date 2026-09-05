import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  CheckCircle2, 
  Clock, 
  Mic, 
  MessageSquare, 
  FileText, 
  Activity, 
  TrendingUp, 
  Send, 
  User, 
  Globe, 
  HelpCircle, 
  Sparkles, 
  X,
  AlertOctagon,
  LifeBuoy,
  Volume2,
  ShieldCheck
} from 'lucide-react';
import { useOperator } from '../OperatorContext';
import { RiskBadge, StatusBadge } from '../components/Badges';
import { GlassCard, ChartGlossTooltip } from '../components/GlassComponents';
import { RiskLevel } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface CaseDetailPageProps {
  caseId: string;
}

export const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ caseId }) => {
  const { getCaseById, acknowledgeCase, resolveCase, addCaseNote, navigate, operator } = useOperator();

  const caseData = getCaseById(caseId);

  const [activeTab, setActiveTab] = useState<'risk' | 'voice' | 'history' | 'notes'>('risk');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');

  if (!caseData) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto my-12 bg-[#0e071c] border border-purple-900/40 rounded-3xl backdrop-blur-xl">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white mb-1">Case Not Found</h2>
        <p className="text-xs text-zinc-400 mb-6">
          The requested session ID "{caseId}" could not be located in active memory.
        </p>
        <button
          onClick={() => navigate('/operator/cases')}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md"
        >
          Return to Case Queue
        </button>
      </div>
    );
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    addCaseNote(caseData.id, newNoteContent);
    setNewNoteContent('');
  };

  const handleConfirmResolve = () => {
    resolveCase(caseData.id, resolutionNote);
    setIsResolveModalOpen(false);
    setResolutionNote('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-900/30">
        <div className="flex items-center gap-3">
          <button
            id="case-detail-back-btn"
            onClick={() => navigate('/operator/cases')}
            className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-900/40 text-purple-300 hover:text-white transition-all cursor-pointer shadow-sm"
            title="Back to Case Queue"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight font-mono">
                {caseData.sessionCode}
              </h1>
              <RiskBadge level={caseData.riskLevel} />
              <StatusBadge status={caseData.status} />
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Started: {caseData.startedAt} • Last Activity: {caseData.lastActivity}
            </p>
          </div>
        </div>

        {/* Action Buttons: Acknowledge / Resolve */}
        <div className="flex items-center gap-2.5">
          {caseData.status === 'New' && (
            <button
              id="acknowledge-case-btn"
              onClick={() => acknowledgeCase(caseData.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-950/60 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Acknowledge Case</span>
            </button>
          )}

          {caseData.status !== 'Resolved' && (
            <button
              id="resolve-case-btn"
              onClick={() => setIsResolveModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/25 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Resolve Case</span>
            </button>
          )}

          {caseData.status === 'Resolved' && (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-1.5 shadow-sm shadow-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">Case Safely Resolved</span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION A: Session Information Details Card */}
      <GlassCard className="p-5 sm:p-6 shadow-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-300/70 mb-3.5 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-purple-400" />
          <span>Session Telemetry & Metadata</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/30">
            <span className="text-[11px] text-zinc-400 block mb-1">Session ID</span>
            <span className="text-xs font-mono font-bold text-white">{caseData.sessionCode}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/30">
            <span className="text-[11px] text-zinc-400 block mb-1">Current SVI Score</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-mono font-extrabold text-purple-200">{caseData.svi} / 100</span>
              <span className="text-[10px] text-zinc-400">({caseData.riskLevel})</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/30">
            <span className="text-[11px] text-zinc-400 block mb-1">User Identity</span>
            <span className="text-xs font-medium text-purple-300">
              {caseData.userType === 'Anonymous' ? 'Anonymous Session' : `Masked ID (${caseData.maskedUserId})`}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/30">
            <span className="text-[11px] text-zinc-400 block mb-1">Input Channels</span>
            <span className="text-xs font-medium text-white flex items-center gap-1">
              {caseData.inputType.includes('Voice') && <Mic className="w-3.5 h-3.5 text-purple-400" />}
              {caseData.inputType}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/30">
            <span className="text-[11px] text-zinc-400 block mb-1">Escalation Status</span>
            <span className="text-xs font-semibold text-amber-300 truncate block">
              {caseData.escalationStatus}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/30">
            <span className="text-[11px] text-zinc-400 block mb-1">Assigned Operator</span>
            <span className="text-xs font-medium text-white truncate block">
              {caseData.assignedOperator}
            </span>
          </div>

        </div>

        {caseData.acknowledgedBy && (
          <div className="mt-4 pt-3 border-t border-purple-900/30 flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 font-mono">
            <span>Acknowledged by: <strong className="text-purple-300">{caseData.acknowledgedBy}</strong> at {caseData.acknowledgedAt}</span>
            {caseData.resolvedBy && (
              <span>• Resolved by: <strong className="text-emerald-400">{caseData.resolvedBy}</strong> at {caseData.resolvedAt}</span>
            )}
          </div>
        )}
      </GlassCard>

      {/* Main 2-Column Split: B. Conversation Transcript & C. Operator Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SECTION B: Conversation Transcript (7 cols on desktop) */}
        <GlassCard className="lg:col-span-7 p-5 sm:p-6 flex flex-col h-[640px] shadow-sm">
          
          <div className="flex items-center justify-between pb-3 border-b border-purple-900/30 mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold font-display text-white">Conversation Transcript</h2>
            </div>
            <span className="text-[10px] text-purple-300 font-mono bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-700/40">
              READ-ONLY AUDIT STREAM
            </span>
          </div>

          {/* Transcript Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {caseData.transcript.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-semibold text-zinc-400">
                      {isUser ? 'Victim / User' : 'Sukoon AI Assistant'}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{msg.time}</span>
                    {msg.inputType === 'voice' && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.2 rounded-full bg-purple-900/50 text-purple-200 border border-purple-700/40 font-mono">
                        <Mic className="w-2.5 h-2.5 text-purple-400" />
                        Voice {msg.audioDuration ? `(${msg.audioDuration})` : ''}
                      </span>
                    )}
                  </div>

                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-purple-600/20 text-purple-100 border border-purple-500/40 rounded-tr-sm shadow-sm'
                        : 'bg-[#180d30]/90 text-zinc-200 border border-purple-900/50 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Transcript Notice */}
          <div className="pt-3 border-t border-purple-900/30 text-[11px] text-zinc-400 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400/80" />
            <span>Original user messages are encrypted and immutable. Operator cannot modify the victim's stream.</span>
          </div>

        </GlassCard>

        {/* SECTION C: Operator Analysis Panel (5 cols on desktop) */}
        <GlassCard className="lg:col-span-5 flex flex-col h-[640px] shadow-sm overflow-hidden p-0">
          
          {/* Analysis Tabs Header */}
          <div className="grid grid-cols-4 border-b border-purple-900/30 bg-[#120726]/80 text-xs">
            <button
              onClick={() => setActiveTab('risk')}
              className={`py-3 text-center font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'risk'
                  ? 'border-purple-400 text-white bg-purple-950/40 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Risk Analysis
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`py-3 text-center font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'voice'
                  ? 'border-purple-400 text-white bg-purple-950/40 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Voice Analysis
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 text-center font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'border-purple-400 text-white bg-purple-950/40 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3 text-center font-medium border-b-2 transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'border-purple-400 text-white bg-purple-950/40 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Notes ({caseData.notes.length})
            </button>
          </div>

          {/* TAB 1: RISK ANALYSIS */}
          {activeTab === 'risk' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-5">
              
              {/* Score Header */}
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-900/40 flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-[11px] text-zinc-400 uppercase tracking-wider block font-semibold">
                    Current SVI Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold font-mono text-white">{caseData.svi}</span>
                    <span className="text-xs text-zinc-400">/ 100</span>
                    <span className="text-xs font-semibold text-purple-300 ml-1">({caseData.riskLevel})</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-zinc-400 block">Risk Trend</span>
                  <span className={`text-xs font-bold font-mono ${
                    caseData.riskTrend === 'Rising' ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {caseData.riskTrend === 'Rising' ? '↑ Rapid Increase' : '→ Stable'}
                  </span>
                </div>
              </div>

              {/* Detected Indicators */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-300/80 mb-2.5">
                  Detected Vulnerability Indicators
                </h3>
                <div className="flex flex-wrap gap-2">
                  {caseData.detectedIndicators.map((ind) => (
                    <span
                      key={ind}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-purple-950/60 text-purple-200 border border-purple-700/40 shadow-sm"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Actions */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-300/80 mb-2.5 flex items-center gap-1.5">
                  <LifeBuoy className="w-3.5 h-3.5 text-purple-400" />
                  <span>Recommended Support Interventions</span>
                </h3>
                <div className="space-y-2">
                  {caseData.recommendedActions.map((action) => (
                    <div
                      key={action}
                      className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/30 flex items-center justify-between text-xs"
                    >
                      <span className="text-zinc-200 font-medium">{action}</span>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded-md border border-purple-800/40">
                        Actionable Protocol
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-medical Disclaimer */}
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/30 text-[11px] text-zinc-400 leading-relaxed">
                <strong>Notice:</strong> SVI assessment indicators are algorithmically generated decision-support metrics and do not constitute a formal medical or psychological diagnosis.
              </div>

            </div>
          )}

          {/* TAB 2: VOICE ANALYSIS */}
          {activeTab === 'voice' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {!caseData.voiceAnalysis.available ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                  <Mic className="w-10 h-10 text-purple-900/50 mb-3" />
                  <p className="text-xs font-medium text-zinc-300">
                    No voice analysis available for this session.
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    This user interacted purely through encrypted text input.
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-purple-300">Vocal Telemetry Status</span>
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40 shadow-sm">
                        Confidence: {caseData.voiceAnalysis.confidence}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-1">{caseData.voiceAnalysis.notes}</p>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/30">
                      <span className="text-zinc-400 block text-[11px]">Speech Activity</span>
                      <span className="text-white font-medium">{caseData.voiceAnalysis.speechActivity}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/30">
                      <span className="text-zinc-400 block text-[11px]">Pause Pattern</span>
                      <span className="text-white font-medium">{caseData.voiceAnalysis.pausePattern}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/30">
                      <span className="text-zinc-400 block text-[11px]">Pitch Variation</span>
                      <span className="text-white font-medium">{caseData.voiceAnalysis.pitchVariation}</span>
                    </div>
                  </div>

                  {caseData.voiceAnalysis.emotionalIndicators && (
                    <div>
                      <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                        Acoustic Emotional Cues
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {caseData.voiceAnalysis.emotionalIndicators.map((cue) => (
                          <span
                            key={cue}
                            className="px-2.5 py-1 rounded-xl text-xs font-medium bg-rose-950/50 text-rose-300 border border-rose-800/40 shadow-sm"
                          >
                            {cue}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/30 text-[11px] text-zinc-400 leading-relaxed">
                    <strong>Caution:</strong> Acoustic cues, pitch, and pauses alone do not establish a medical diagnosis. They serve solely as auxiliary risk context.
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: HISTORY / SVI TRAJECTORY */}
          {activeTab === 'history' && (
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-300/80">
                SVI Trajectory Over Session Duration
              </h3>

              {/* Trajectory Chart */}
              <div className="h-44 w-full bg-purple-950/20 border border-purple-900/30 rounded-2xl p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={caseData.history} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3b1d6e" opacity={0.3} vertical={false} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip content={<ChartGlossTooltip unit="SVI" />} />
                    <Line
                      type="monotone"
                      dataKey="svi"
                      name="Vulnerability Index"
                      stroke="#c084fc"
                      strokeWidth={2.5}
                      dot={{ fill: '#c084fc', stroke: '#581c87', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* History Events Timeline */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Assessment Milestones
                </h4>
                <div className="space-y-2">
                  {caseData.history.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-900/30 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-zinc-400">{h.time}</span>
                        <span className="text-zinc-200">{h.event}</span>
                      </div>
                      <span className="font-mono font-bold text-purple-200 px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-700/40">
                        SVI {h.svi}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OPERATOR NOTES */}
          {activeTab === 'notes' && (
            <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden">
              
              {/* Existing Notes List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
                {caseData.notes.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500 text-xs">
                    No operator notes recorded yet for this session.
                  </div>
                ) : (
                  caseData.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3.5 rounded-2xl bg-purple-950/25 border border-purple-900/40 text-xs space-y-1.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[11px] text-purple-300/80">
                        <span className="font-semibold text-white">{note.operatorName} ({note.operatorRole})</span>
                        <span className="font-mono text-zinc-400">{note.timestamp}</span>
                      </div>
                      <p className="text-zinc-200 leading-relaxed">{note.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="pt-3 border-t border-purple-900/30">
                <textarea
                  id="add-operator-note-textarea"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Record an internal operator observation or action..."
                  rows={2}
                  className="w-full bg-[#150a2b]/70 border border-purple-900/50 rounded-xl p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 resize-none font-sans transition-all"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-zinc-500">
                    Internal notes are confidential & never visible to the victim.
                  </span>
                  <button
                    id="submit-operator-note-btn"
                    type="submit"
                    disabled={!newNoteContent.trim()}
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-purple-950"
                  >
                    Add Note
                  </button>
                </div>
              </form>

            </div>
          )}

        </GlassCard>

      </div>

      {/* RESOLVE CASE CONFIRMATION MODAL */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0e071c] border border-purple-800/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 backdrop-blur-2xl">
            
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold font-display text-white text-base">Resolve Case Confirmation</h3>
              </div>
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white bg-purple-950/40 border border-purple-900/30 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to resolve <strong className="text-white font-mono">{caseData.sessionCode}</strong>? This indicates that the necessary de-escalation, counselling referrals, or safety checks have been completed.
            </p>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300/70 mb-1.5 font-sans">
                Optional Resolution Summary Note:
              </label>
              <textarea
                id="resolution-note-input"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="e.g. Grounding completed safely. User connected with designated crisis support helpline."
                rows={3}
                className="w-full bg-[#150a2b]/70 border border-purple-900/50 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/25 resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResolveModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-purple-950/40 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                id="confirm-resolve-case-btn"
                type="button"
                onClick={handleConfirmResolve}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition-all cursor-pointer"
              >
                Confirm Resolution
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
