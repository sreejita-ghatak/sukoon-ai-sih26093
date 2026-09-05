import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CaseData, CaseStatus, OperatorAlert, OperatorNote, OperatorUser } from './types';
import { CURRENT_OPERATOR, INITIAL_ALERTS, INITIAL_CASES } from './mockData';

import {
  operatorLogin,
  getOperatorCases,
  getOperatorCase,
  acknowledgeOperatorCase,
  resolveOperatorCase,
  getOperatorRiskHistory,
  getOperatorVoiceAnalyses,
  addOperatorCaseNote,
  getOperatorCaseNotes,
} from '../api/client';


interface OperatorContextType {
  operator: OperatorUser | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  cases: CaseData[];
  alerts: OperatorAlert[];
  currentPath: string;
  navigate: (path: string) => void;
  acknowledgeCase: (caseId: string) => void;
  resolveCase: (caseId: string, resolutionNote?: string) => void;
  addCaseNote: (caseId: string, content: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  getCaseById: (caseId: string) => CaseData | undefined;
}

const OperatorContext = createContext<OperatorContextType | undefined>(undefined);

const OPERATOR_STORAGE_KEY = 'sukoon_operator_session_v1';
const CASES_STORAGE_KEY = 'sukoon_operator_cases_v1';
const ALERTS_STORAGE_KEY = 'sukoon_operator_alerts_v1';

export const OperatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Path routing
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/operator/login';
  });

  // Operator Auth state
  const [operator, setOperator] = useState<OperatorUser | null>(() => {
    try {
      const saved = localStorage.getItem(OPERATOR_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const isAuthenticated = !!operator;

  // Cases state
  const [cases, setCases] = useState<CaseData[]>([]);

  const mapBackendCase = (item: any): CaseData => {
  const riskMap: Record<string, CaseData['riskLevel']> = {
    LOW: 'Low',
    MODERATE: 'Moderate',
    HIGH: 'High',
    CRITICAL: 'Critical',
  };

  const statusMap: Record<string, CaseStatus> = {
    NEW: 'New',
    ACKNOWLEDGED: 'Acknowledged',
    RESOLVED: 'Resolved',
  };

  const trendMap: Record<string, CaseData['riskTrend']> = {
    NEW: 'Stable',
    STABLE: 'Stable',
    HELD: 'Stable',
    RISING: 'Rising',
    DECREASING: 'Decreasing',
  };

  const updatedDate = item.updated_at
    ? new Date(item.updated_at)
    : new Date();

  return {
    id: String(item.session_id),
    sessionCode: `Session #${item.session_id}`,
    svi: Number(item.stress_score ?? 0),
    riskLevel: riskMap[item.risk_level] ?? 'Low',
    riskTrend: trendMap[item.trend] ?? 'Stable',
    status: statusMap[item.case_status] ?? 'New',
    userType: 'Anonymous',
    language: 'Auto-detected',
    inputType: 'Text',
    startedAt: updatedDate.toLocaleString(),
    lastActivity: updatedDate.toLocaleString(),
    escalationStatus: item.escalation_level ?? 'MONITOR',
    assignedOperator: item.assigned_operator ?? 'Unassigned',
    acknowledgedAt: item.acknowledged_at
      ? new Date(item.acknowledged_at).toLocaleString()
      : undefined,
    detectedIndicators: item.safety_concern
      ? ['Safety concern detected']
      : [],
    recommendedActions:
      item.escalation_level === 'URGENT'
        ? ['Immediate human review recommended']
        : item.escalation_level === 'HUMAN_REVIEW'
        ? ['Human review recommended']
        : ['Continue monitoring'],
    voiceAnalysis: {
      available: false,
    },
    history: [],
    transcript: Array.isArray(item.messages)
  ? item.messages.map((message: any) => ({
      id: String(message.id),

      sender:
        message.role === 'user'
          ? 'user'
          : 'ai',

      text: message.content ?? '',

      time: message.created_at
        ? new Date(message.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '',

      inputType: 'text',
    }))
  : [],
    notes: [],
  };
};
  // Alerts state
  const [alerts, setAlerts] = useState<OperatorAlert[]>(() => {
    try {
      const saved = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ALERTS;
  });

  useEffect(() => {
  if (!isAuthenticated) {
    return;
  }

  const loadRealCases = async () => {
    try {
      const savedSession = localStorage.getItem(
        OPERATOR_STORAGE_KEY
      );

      if (!savedSession) {
        return;
      }

      const parsedSession = JSON.parse(savedSession);
      const token = parsedSession.accessToken;

      if (!token) {
        console.error('Operator access token not found.');
        return;
      }

      const backendCases = await getOperatorCases(token);

      const mappedCases = backendCases.map(mapBackendCase);

      setCases(mappedCases);
    } catch (error) {
      console.error(
        'Failed to load real operator cases:',
        error
      );
    }
  };

  loadRealCases();
}, [isAuthenticated]);

  // Persist cases
  useEffect(() => {
    try {
      localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
    } catch (e) {
      console.error(e);
    }
  }, [cases]);

  // Persist alerts
  useEffect(() => {
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
  }, [alerts]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = async (
  email: string,
  pass: string
): Promise<boolean> => {
  try {
    const result = await operatorLogin(
      email.trim(),
      pass
    );

    const token = result.access_token;

    if (!token) {
      throw new Error('No access token received.');
    }

    const user: OperatorUser = {
      ...CURRENT_OPERATOR,
      email: email.trim() || CURRENT_OPERATOR.email,
    };

    setOperator(user);

    localStorage.setItem(
      OPERATOR_STORAGE_KEY,
      JSON.stringify({
        ...user,
        accessToken: token,
      })
    );

    navigate('/operator/dashboard');

    return true;
  } catch (error) {
    console.error('Operator login failed:', error);

    return false;
  }
};
  const logout = () => {
    setOperator(null);
    try {
      localStorage.removeItem(OPERATOR_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    navigate('/operator/login');
  };

  const acknowledgeCase = async (caseId: string) => {
  try {
    const savedSession = localStorage.getItem(
      OPERATOR_STORAGE_KEY
    );

    if (!savedSession) {
      console.error('Operator session not found.');
      return;
    }

    const parsedSession = JSON.parse(savedSession);
    const token = parsedSession.accessToken;

    if (!token) {
      console.error('Operator access token not found.');
      return;
    }

    await acknowledgeOperatorCase(
      Number(caseId),
      token
    );

    const now = new Date();

    const timeString =
      `Today ${now
        .getHours()
        .toString()
        .padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

    const operatorName =
      operator?.name || 'Ananya Roy';

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const newNotes: OperatorNote[] = [
            ...c.notes,
            {
              id: `note-ack-${Date.now()}`,
              operatorName,
              operatorRole:
                operator?.role || 'Operator',
              timestamp: timeString,
              createdAt: Date.now(),
              content:
                `Case acknowledged by ${operatorName}. Monitoring ongoing telemetry.`,
            },
          ];

          return {
            ...c,
            status: 'Acknowledged' as CaseStatus,
            assignedOperator: operatorName,
            acknowledgedBy: operatorName,
            acknowledgedAt: timeString,
            notes: newNotes,
          };
        }

        return c;
      })
    );
  } catch (error) {
    console.error(
      'Failed to acknowledge case:',
      error
    );
  }
};

const resolveCase = async (
  caseId: string,
  resolutionNote?: string
) => {
  try {
    const savedSession = localStorage.getItem(
      OPERATOR_STORAGE_KEY
    );

    if (!savedSession) {
      console.error('Operator session not found.');
      return;
    }

    const parsedSession = JSON.parse(savedSession);
    const token = parsedSession.accessToken;

    if (!token) {
      console.error('Operator access token not found.');
      return;
    }

    await resolveOperatorCase(
      Number(caseId),
      token
    );

    const now = new Date();

    const timeString =
      `Today ${now
        .getHours()
        .toString()
        .padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

    const operatorName =
      operator?.name || 'Ananya Roy';

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          const newNotes: OperatorNote[] = [
            ...c.notes
          ];

          if (
            resolutionNote &&
            resolutionNote.trim()
          ) {
            newNotes.push({
              id: `note-res-${Date.now()}`,
              operatorName,
              operatorRole:
                operator?.role || 'Operator',
              timestamp: timeString,
              createdAt: Date.now(),
              content:
                `Resolution Note: ${resolutionNote.trim()}`,
            });
          }

          return {
            ...c,
            status: 'Resolved' as CaseStatus,
            resolvedBy: operatorName,
            resolvedAt: timeString,
            resolutionNote:
              resolutionNote || c.resolutionNote,
            notes: newNotes,
          };
        }

        return c;
      })
    );
  } catch (error) {
    console.error(
      'Failed to resolve case:',
      error
    );
  }
};

 const addCaseNote = async (
  caseId: string,
  content: string
) => {
  if (!content.trim()) return;

  try {
    const savedSession = localStorage.getItem(
      OPERATOR_STORAGE_KEY
    );

    if (!savedSession) {
      console.error('Operator session not found.');
      return;
    }

    const parsedSession = JSON.parse(savedSession);
    const token = parsedSession.accessToken;

    if (!token) {
      console.error('Operator access token not found.');
      return;
    }

    await addOperatorCaseNote(
      Number(caseId),
      content.trim(),
      token
    );

    const now = new Date();

    const timeString =
      `Today ${now
        .getHours()
        .toString()
        .padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

    const operatorName =
      operator?.name || 'Ananya Roy';

    const newNote: OperatorNote = {
      id: `note-${Date.now()}`,
      operatorName,
      operatorRole: operator?.role || 'Operator',
      timestamp: timeString,
      createdAt: Date.now(),
      content: content.trim(),
    };

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            notes: [newNote, ...c.notes],
          };
        }

        return c;
      })
    );
  } catch (error) {
    console.error(
      'Failed to add case note:',
      error
    );
  }
};

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isAcknowledged: true } : a))
    );
  };


  useEffect(() => {
  if (!isAuthenticated || !currentPath.startsWith('/operator/cases/')) {
    return;
  }

  const caseId = currentPath.split('/').pop();

  if (!caseId) {
    return;
  }

  const loadCaseDetail = async () => {
    try {
      const savedSession = localStorage.getItem(
        OPERATOR_STORAGE_KEY
      );

      if (!savedSession) {
        return;
      }

      const parsedSession = JSON.parse(savedSession);
      const token = parsedSession.accessToken;

      if (!token) {
        console.error('Operator access token not found.');
        return;
      }

      const backendCase = await getOperatorCase(
  Number(caseId),
  token
);

const backendHistory = await getOperatorRiskHistory(
  Number(caseId),
  token
);

const backendVoice = await getOperatorVoiceAnalyses(
  Number(caseId),
  token
);

const backendNotes = await getOperatorCaseNotes(
  Number(caseId),
  token
);

const mappedCase = mapBackendCase(backendCase);

const mappedHistory = Array.isArray(
  backendHistory.risk_history
)
  ? backendHistory.risk_history.map(
      (item: any) => {
        const createdDate = item.created_at
          ? new Date(item.created_at)
          : new Date();

        const levelMap: Record<
          string,
          CaseData['riskLevel']
        > = {
          LOW: 'Low',
          MODERATE: 'Moderate',
          HIGH: 'High',
          CRITICAL: 'Critical',
        };

        return {
          time: createdDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          timestamp: createdDate.getTime(),
          svi: Number(item.stress_score ?? 0),
          category:
            levelMap[item.effective_risk_level] ??
            'Low',
          event:
            item.degraded
              ? 'Fallback assessment'
              : `Risk assessed as ${item.effective_risk_level}`,
        };
      }
    )
  : [];

  const latestVoice =
  Array.isArray(backendVoice.voice_analyses) &&
  backendVoice.voice_analyses.length > 0
    ? backendVoice.voice_analyses[
        backendVoice.voice_analyses.length - 1
      ]
    : null;

const mappedVoiceAnalysis = latestVoice
  ? {
      available: true,
      speechActivity: `${Number(
        latestVoice.duration_seconds ?? 0
      ).toFixed(2)} sec recorded speech`,
      pausePattern: `${(
        Number(latestVoice.pause_ratio ?? 0) * 100
      ).toFixed(1)}% pause ratio`,
      pitchVariation: `${Number(
        latestVoice.pitch_variation_hz ?? 0
      ).toFixed(2)} Hz`,
      confidence: 'Signal extracted',
      emotionalIndicators: [],
      notes: `Mean pitch: ${Number(
        latestVoice.mean_pitch_hz ?? 0
      ).toFixed(2)} Hz`,
    }
  : {
      available: false,
    };

    const mappedNotes: OperatorNote[] =
  Array.isArray(backendNotes.notes)
    ? backendNotes.notes.map((item: any) => {
        const createdDate = item.created_at
          ? new Date(item.created_at)
          : new Date();

        return {
          id: String(item.id),
          operatorName:
            item.author === 'operator'
              ? operator?.name || 'Operator'
              : item.author || 'Operator',
          operatorRole: operator?.role || 'Operator',
          timestamp: createdDate.toLocaleString(),
          createdAt: createdDate.getTime(),
          content: item.note ?? '',
        };
      })
    : [];

      setCases((currentCases) =>
        currentCases.map((existingCase) =>
          existingCase.id === mappedCase.id
            ? {
                ...existingCase,
                ...mappedCase,
                history: mappedHistory,
                notes: mappedNotes,
                voiceAnalysis: mappedVoiceAnalysis,
                inputType: latestVoice ? 'Voice & Text' : 'Text',
              }
            : existingCase
        )
      );
    } catch (error) {
      console.error(
        'Failed to load case detail:',
        error
      );
    }
  };

  loadCaseDetail();
}, [currentPath, isAuthenticated]);


  const getCaseById = (caseId: string) => {
    return cases.find((c) => c.id === caseId);
  };

  return (
    <OperatorContext.Provider
      value={{
        operator,
        isAuthenticated,
        login,
        logout,
        cases,
        alerts,
        currentPath,
        navigate,
        acknowledgeCase,
        resolveCase,
        addCaseNote,
        acknowledgeAlert,
        getCaseById,
      }}
    >
      {children}
    </OperatorContext.Provider>
  );
};

export const useOperator = () => {
  const context = useContext(OperatorContext);
  if (!context) {
    throw new Error('useOperator must be used within an OperatorProvider');
  }
  return context;
};
