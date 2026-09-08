const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://sukoon-ai-sih26093.onrender.com';

export async function createSession(): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.status}`);
  }

  const data = await response.json();
  return data.session_id;
}

export async function setSessionConsent(
  sessionId: number,
  consent: boolean
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/consent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        consent,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to save consent: ${response.status}`);
  }
}

export async function sendMessage(
  sessionId: number,
  message: string
): Promise<{
  victim_response: string;
  assessment?: unknown;
  effective_risk_level?: string | null;
}> {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.status}`);
  }

  return response.json();
}

export async function sendVoiceMessage(
  sessionId: number,
  audioBlob: Blob
): Promise<{
  session_id: number;
  transcript: string;
  voice_features?: unknown;
  voice_analysis_id?: number;
  chat_result: {
    victim_response: string;
    assessment?: unknown;
    effective_risk_level?: string | null;
  };
  response_audio_url?: string | null;
}> {
  const formData = new FormData();

  formData.append(
    'audio',
    audioBlob,
    'recording.webm'
  );

  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/voice`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to send voice message: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

// ================================
// Operator API
// ================================

export async function operatorLogin(
  username: string,
  password: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/operator/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Operator login failed: ${response.status} ${errorText}`
    );
  }

  return response.json();
}


export async function getOperatorCases(
  token: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/operator/cases`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to load operator cases: ${response.status} ${errorText}`
    );
  }

  return response.json();
}


export async function getOperatorCase(
  sessionId: number,
  token: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/operator/cases/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to load case: ${response.status} ${errorText}`
    );
  }

  return response.json();
}


export async function acknowledgeOperatorCase(
  sessionId: number,
  token: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/operator/cases/${sessionId}/acknowledge`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to acknowledge case: ${response.status} ${errorText}`
    );
  }

  return response.json();
}


export async function resolveOperatorCase(
  sessionId: number,
  token: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/operator/cases/${sessionId}/resolve`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to resolve case: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

export async function getOperatorRiskHistory(
  sessionId: number,
  token: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/operator/cases/${sessionId}/risk-history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to load risk history: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

export async function getOperatorVoiceAnalyses(
  sessionId: number,
  token: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/operator/cases/${sessionId}/voice-analyses`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to load voice analyses: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

export async function addOperatorCaseNote(
  sessionId: number,
  content: string,
  token: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/operator/cases/${sessionId}/notes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
  note: content,
}),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to add case note: ${response.status} ${errorText}`
    );
  }

  return response.json();
}

export async function getOperatorCaseNotes(
  sessionId: number,
  token: string
): Promise<any> {
  const response = await fetch(
    `${API_BASE_URL}/operator/cases/${sessionId}/notes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to load case notes: ${response.status} ${errorText}`
    );
  }

  return response.json();
}