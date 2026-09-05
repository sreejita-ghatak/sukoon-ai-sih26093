export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
export type CaseStatus = 'New' | 'Acknowledged' | 'Resolved';

export interface OperatorUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  badgeId: string;
  shift: string;
}

export interface VoiceAnalysisData {
  available: boolean;
  speechActivity?: string;
  pausePattern?: string;
  pitchVariation?: string;
  confidence?: string;
  emotionalIndicators?: string[];
  notes?: string;
}

export interface SVIHistoryPoint {
  time: string;
  timestamp: number;
  svi: number;
  category: RiskLevel;
  event: string;
}

export interface OperatorNote {
  id: string;
  operatorName: string;
  operatorRole: string;
  timestamp: string;
  createdAt: number;
  content: string;
}

export interface CaseTranscriptMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  inputType?: 'text' | 'voice';
  audioDuration?: string;
}

export interface CaseData {
  id: string;
  sessionCode: string; // e.g. "Session #1287"
  svi: number; // 0 - 100
  riskLevel: RiskLevel;
  riskTrend: 'Rising' | 'Stable' | 'Decreasing';
  status: CaseStatus;
  userType: 'Anonymous' | 'Account Session';
  maskedUserId?: string;
  language: string;
  inputType: 'Text' | 'Voice' | 'Voice & Text';
  startedAt: string;
  lastActivity: string;
  escalationStatus: string;
  assignedOperator: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNote?: string;
  detectedIndicators: string[];
  recommendedActions: string[];
  voiceAnalysis: VoiceAnalysisData;
  history: SVIHistoryPoint[];
  transcript: CaseTranscriptMessage[];
  notes: OperatorNote[];
}

export interface OperatorAlert {
  id: string;
  caseId: string;
  sessionCode: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Warning';
  timestamp: string;
  createdAt: number;
  isAcknowledged: boolean;
  triggerReason: string;
}
