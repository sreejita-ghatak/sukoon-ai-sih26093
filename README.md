# 🪷 Sukoon AI

### Privacy-First AI-Assisted Stress & Trauma Assessment and Human Escalation System

**Smart India Hackathon 2026 — SIH26093**

Sukoon AI is an AI-assisted support platform designed to help identify stress, fear, vulnerability, and potential safety concerns from user conversations while keeping human operators in the decision loop.

The MVP combines multilingual conversational support, consent-controlled AI assessment, deterministic risk classification, voice analysis, escalation workflows, and an operator console for reviewing and managing cases.

> **Important:** Sukoon AI is a prototype decision-support system. It is not a medical diagnostic tool and does not replace trained mental-health professionals, emergency services, law enforcement, or other qualified human responders.

---

## 🎯 Problem Statement

**SIH26093 — AI-Based Real-Time Stress & Trauma Assessment Module for Victims/Complainants Accessing NHAA (14566) and Integrated Portal**

**Organization:** Ministry of Social Justice and Empowerment (MoSJE)

The objective is to assist in identifying indicators such as stress, trauma, fear, anxiety, vulnerability, intimidation, social isolation, and potential safety concerns from user interactions, and to support appropriate human intervention.

---

## ✨ Core Features

### 💬 Multilingual Support Conversation

Sukoon AI provides a conversational interface designed to support:

- English
- Hindi
- Bengali
- Mixed-language conversations

The assistant attempts to preserve and respond appropriately to the user's conversational language.

---

### 🎙️ Voice + Text Input

Users can communicate through:

- Text messages
- Recorded voice messages

The voice pipeline supports:

**Voice Recording → Speech-to-Text → Conversation Analysis → Risk Assessment → Response**

The MVP also extracts selected acoustic features from voice recordings, including:

- Speech duration
- Pause ratio
- Mean pitch
- Pitch variation

Voice transcription accuracy may vary depending on audio quality, language, accent, model availability, and environmental noise.

---

## 🛡️ Consent-First Risk Assessment

Sukoon AI follows a consent-controlled assessment design.

Risk assessment is performed only after the user provides consent for AI-assisted analysis.

Without assessment consent:

- Conversation can continue
- Risk assessment is not performed
- Automated risk escalation is not triggered

This separates conversational support from consent-dependent assessment.

---

## 🧠 Hybrid AI + Deterministic Risk Architecture

Sukoon AI does not rely only on an LLM to make the final risk classification.

The system separates:

### AI Layer

Used to interpret conversational context and extract relevant signals.

### Deterministic Risk Engine

Uses structured signals to calculate and classify the effective risk state.

Current categories:

| Risk Level | Score Range |
|---|---:|
| Low | 0–25 |
| Moderate | 26–50 |
| High | 51–75 |
| Critical | 76–100 |

The prototype can also trigger higher-priority handling when explicit safety-related indicators are detected.

---

## 📉 No Silent Downgrade

A single calmer message should not immediately erase an earlier serious risk state.

Sukoon AI therefore implements a **No Silent Downgrade** mechanism.

When a lower-risk assessment follows a higher-risk state, the system can hold the previous level before permitting a gradual downgrade.

This helps prevent sudden risk reduction caused by one isolated message.

---

## 🚨 Human Escalation Workflow

Depending on assessed risk and safety indicators, a session can be routed through escalation states such as:

- Monitoring
- Human Review
- Urgent Review

Critical or explicit safety-related situations can be prioritized for immediate human review within the operator workflow.

The MVP does **not** claim to automatically contact police, hospitals, emergency services, or other external authorities.

---

# 🖥️ Operator Console

Sukoon AI includes a dedicated authenticated operator interface.

Operators can:

- View case queues
- Inspect individual sessions
- Review conversation transcripts
- Review current risk state
- View detected safety indicators
- Review recommended interventions
- Inspect risk history
- Inspect available voice-analysis information
- Add persistent operator notes
- Acknowledge cases
- Resolve cases

---

## 🔄 Case Lifecycle

Cases support the following operational lifecycle:

```text
NEW
  ↓
ACKNOWLEDGED
  ↓
RESOLVED
```

Acknowledgement and resolution states are persisted by the backend.

Operator-authored notes can also be stored and retrieved for later review.

---

## 📈 Risk History

Risk assessments are stored as the conversation progresses.

The operator interface can display historical assessment information to help understand how the session's risk state has changed over time.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────┐
│        Victim / User        │
│      Text + Voice Input     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│      React / TypeScript     │
│        Victim Client        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        FastAPI Backend      │
├─────────────────────────────┤
│ Session / Consent Service   │
│ Conversation Service        │
│ Voice Processing            │
│ AI Provider Integration     │
│ Deterministic Risk Engine   │
│ Escalation Workflow         │
│ Operator APIs               │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐   ┌──────────────┐
│ AI Provider  │   │    SQLite    │
│   Gemini     │   │  MVP Storage │
└──────────────┘   └──────┬───────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Operator Console│
                 │ Human-in-the-   │
                 │ Loop Review     │
                 └─────────────────┘
```

---

## 🔐 Privacy & Safety Design

The MVP includes:

- Explicit assessment consent
- Anonymous/private-session support
- Separation of conversational support and risk assessment
- Human-in-the-loop escalation
- Authenticated operator access
- Environment-variable-based secret management
- Persistent case-management information
- Decision-support rather than medical-diagnosis framing

Sensitive credentials and API keys are stored outside the source code using environment variables.

---

## 🧰 Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite
- JWT-based operator authentication

### AI & Voice

- Google Gemini
- Faster-Whisper fallback
- FFmpeg
- Librosa
- Browser MediaRecorder API

---

## 📁 Project Structure

```text
SIH26093-MVP/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── schemas.py
│   ├── risk_engine.py
│   ├── gemini_provider.py
│   ├── whisper_service.py
│   ├── voice_features.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── operator/
│   │   ├── api/
│   │   └── ...
│   └── package.json
│
└── README.md
```

---

# 🚀 Running the Project Locally

## 1. Backend

Navigate to:

```bash
cd backend
```

Create and activate a Python virtual environment, then install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file containing the required environment variables.

Example:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_api_key_here
AI_MODEL=your_supported_gemini_model

OPERATOR_USERNAME=your_operator_username
OPERATOR_PASSWORD=your_secure_password
OPERATOR_TOKEN=your_secure_token
```

> Never commit the real `.env` file or API credentials to GitHub.

Start the backend:

```bash
uvicorn main:app --reload --port 8001
```

Backend:

```text
http://127.0.0.1:8001
```

---

## 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend development server:

```text
http://localhost:3000
```

Operator portal:

```text
http://localhost:3000/operator/login
```

---

## 📦 Production Build

To create a production frontend build:

```bash
cd frontend
npm run build
```

The generated production files are placed in:

```text
frontend/dist/
```

---

## ⚠️ MVP Limitations

This repository contains an SIH prototype rather than a production healthcare or emergency-response platform.

Current limitations include:

- Speech-to-text accuracy can vary, particularly across multilingual voice recordings
- SQLite is used for MVP persistence
- External emergency-service integration is not implemented
- Risk scores are prototype decision-support metrics and are not clinically validated diagnostic scores
- Production-grade identity, infrastructure, monitoring, security hardening, and compliance would require further work
- Some dashboard/reporting elements may remain prototype-oriented and should not be interpreted as live production telemetry

---

## 🔮 Future Scope

Potential future improvements include:

- Improved multilingual speech recognition
- Production PostgreSQL deployment
- Stronger operator identity and role-based access control
- Secure real-time operator notifications
- Advanced longitudinal risk analysis
- Validated assessment frameworks developed with domain experts
- Stronger encryption and production security controls
- Accessibility improvements
- Integration with authorized counselling and support workflows
- Carefully governed emergency-service integrations where legally and ethically appropriate

---

## 🧪 MVP Status

Core flows tested in the prototype include:

- Text conversation
- Consent-controlled assessment
- AI-assisted signal extraction
- Deterministic risk classification
- Safety-related escalation
- Persistent sessions
- Operator case retrieval
- Case acknowledgement
- Case resolution
- Persistent manual operator notes
- Risk history
- Voice recording and processing
- Production frontend build

---

## 👥 Team

**Smart India Hackathon 2026**

Team details can be added here before final submission.

---

## ⚖️ Disclaimer

Sukoon AI is an experimental academic prototype created for Smart India Hackathon 2026.

It must not be used as a substitute for professional medical, psychological, legal, law-enforcement, or emergency assistance. AI-generated assessments may be incomplete or incorrect and should be reviewed by appropriately trained humans.

---

<p align="center">
  <strong>Sukoon AI 🪷</strong><br>
  Technology for safer, consent-aware and human-centered support.
</p>