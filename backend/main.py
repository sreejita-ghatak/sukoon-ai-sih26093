import logging
import os

from database import Base, engine
import models

from database import SessionLocal
from sqlalchemy.orm import Session

from fastapi import Depends, FastAPI, HTTPException, UploadFile, File
from datetime import datetime
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

import risk_engine
from ai_provider import FallbackProvider, get_provider
from schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    ConsentRequest,
    OperatorLoginRequest,
    OperatorNoteRequest,
    SessionMessageRequest,
    SessionMessageResponse,
)
from config import settings
from tts_service import text_to_speech
from voice_features import extract_voice_features
from whisper_service import transcribe_with_whisper

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="SIH26093 - AI Trauma Assessment Module",
    description="MVP backend for AI-assisted stress and trauma risk assessment",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://sukoon-ai-sih26093-1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/audio",
    StaticFiles(directory="generated_audio"),
    name="audio",
)

# Select configured AI provider.
# Without an API key this automatically becomes FallbackProvider.
_provider = get_provider()
_fallback = FallbackProvider()

security = HTTPBearer()


def verify_operator_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    if credentials.credentials != settings.operator_token:
        raise HTTPException(
            status_code=401,
            detail="Invalid operator authorization token.",
        )

    return {
        "username": settings.operator_username,
        "name": "Ananya Roy",
    }

RISK_RANK = {
    "LOW": 1,
    "MODERATE": 2,
    "HIGH": 3,
    "CRITICAL": 4,
}


def apply_no_silent_downgrade(
    previous_level: str | None,
    current_level: str,
    downgrade_streak: int,
) -> tuple[str, int]:

    if previous_level is None:
        return current_level, 0

    previous_rank = RISK_RANK.get(previous_level, 0)
    current_rank = RISK_RANK.get(current_level, 0)

    # Upgrade immediately
    if current_rank > previous_rank:
        return current_level, 0

    # Same level
    if current_rank == previous_rank:
        return current_level, 0

    # Lower current result
    downgrade_streak += 1

    # First lower result: hold previous level
    if downgrade_streak < 2:
        return previous_level, downgrade_streak

    # Second consecutive lower result:
    # allow only ONE step down
    new_rank = max(
        1,
        previous_rank - 1,
    )

    new_level = next(
        level
        for level, rank
        in RISK_RANK.items()
        if rank == new_rank
    )

    return new_level, 0


def calculate_risk_trend(
    history,
) -> str:

    if not history:
        return "NEW"

    if len(history) == 1:
        return "NEW"

    previous = history[-2]
    current = history[-1]

    previous_rank = RISK_RANK.get(
        previous.effective_risk_level,
        0,
    )

    current_rank = RISK_RANK.get(
        current.effective_risk_level,
        0,
    )

    raw_rank = RISK_RANK.get(
        current.raw_risk_level,
        0,
    )

    # Raw assessment dropped, but trajectory
    # protection kept the effective level unchanged.
    if (
        raw_rank < previous_rank
        and current_rank == previous_rank
    ):
        return "HELD"

    if current_rank > previous_rank:
        return "RISING"

    if current_rank < previous_rank:
        return "FALLING"

    return "STABLE"

def get_session_trend(
    db,
    session_id: int,
) -> str:

    history = db.query(
        models.RiskAssessmentHistory
    ).filter(
        models.RiskAssessmentHistory.session_id == session_id
    ).order_by(
        models.RiskAssessmentHistory.created_at.asc()
    ).all()

    return calculate_risk_trend(
        history
    )

@app.get("/")
async def root():
    return {
        "message": "SIH26093 MVP Backend is running",
        "status": "active",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy"
    }

@app.post("/sessions")
async def create_session():
    db = SessionLocal()

    try:
        new_session = models.ChatSession(
            title="New Support Chat"
        )

        db.add(new_session)
        db.commit()
        db.refresh(new_session)

        return {
            "session_id": new_session.id,
            "title": new_session.title,
        }

    finally:
        db.close()

@app.post("/sessions/{session_id}/consent")
async def set_risk_assessment_consent(
    session_id: int,
    payload: ConsentRequest,
):
    db = SessionLocal()

    try:
        chat_session = db.query(
            models.ChatSession
        ).filter(
            models.ChatSession.id == session_id
        ).first()

        if chat_session is None:
            raise HTTPException(
                status_code=404,
                detail="Chat session not found.",
            )

        chat_session.risk_assessment_consent = payload.consent
        db.commit()
        db.refresh(chat_session)

        return {
            "session_id": session_id,
            "risk_assessment_consent": chat_session.risk_assessment_consent,
        }

    finally:
        db.close()

@app.get("/sessions")
async def list_sessions():
    db = SessionLocal()

    try:
        sessions = db.query(
            models.ChatSession
        ).order_by(
            models.ChatSession.updated_at.desc()
        ).all()

        return [
            {
                "session_id": session.id,
                "title": session.title,
                "created_at": session.created_at,
                "updated_at": session.updated_at,
                "is_active": session.is_active,

                # Latest risk information
                "latest_risk_level": session.latest_risk_level,
                "latest_stress_score": session.latest_stress_score,
                "latest_safety_concern": session.latest_safety_concern,
                "latest_urgency": session.latest_urgency,
            }
            for session in sessions
        ]

    finally:
        db.close()

@app.post("/operator/login")
async def operator_login(
    payload: OperatorLoginRequest,
):
    if (
        payload.username != settings.operator_username
        or payload.password != settings.operator_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid operator credentials.",
        )

    return {
        "access_token": settings.operator_token,
        "token_type": "bearer",
    }
@app.get("/operator/cases")
async def operator_case_queue(
    _: bool = Depends(verify_operator_token),
):
    db = SessionLocal()

    try:
        sessions = db.query(
            models.ChatSession
        ).filter(
            models.ChatSession.latest_risk_level.isnot(None)
        ).all()

        priority = {
            "CRITICAL": 4,
            "HIGH": 3,
            "MODERATE": 2,
            "LOW": 1,
        }

        sessions.sort(
            key=lambda session: (
                priority.get(session.latest_risk_level, 0),
                session.updated_at,
            ),
            reverse=True,
        )

        return [
            {
                "session_id": session.id,
                "title": session.title,
                "risk_level": session.latest_risk_level,
                "stress_score": session.latest_stress_score,
                "trend": get_session_trend(db, session.id),
                "safety_concern": session.latest_safety_concern,
                "urgency": session.latest_urgency,
                "case_status": session.case_status,
                "escalation_level": session.escalation_level,
                "downgrade_streak": session.downgrade_streak,
                "updated_at": session.updated_at,
            }
            for session in sessions
        ]

    finally:
        db.close()   
@app.get("/operator/cases/{session_id}")
async def operator_case_detail(
    session_id: int,
    _: bool = Depends(verify_operator_token),
):
    db = SessionLocal()

    try:
        chat_session = db.query(
            models.ChatSession
        ).filter(
            models.ChatSession.id == session_id
        ).first()

        if chat_session is None:
            raise HTTPException(
                status_code=404,
                detail="Case not found.",
            )

        messages = db.query(
            models.ChatMessage
        ).filter(
            models.ChatMessage.session_id == session_id
        ).order_by(
            models.ChatMessage.created_at.asc()
        ).all()

        risk_history = db.query(
            models.RiskAssessmentHistory
        ).filter(
            models.RiskAssessmentHistory.session_id == session_id
        ).order_by(
            models.RiskAssessmentHistory.created_at.asc()
        ).all()

        trend = calculate_risk_trend(
            risk_history
        )

    
        return {
            "session_id": chat_session.id,
            "title": chat_session.title,
            "risk_level": chat_session.latest_risk_level,
            "stress_score": chat_session.latest_stress_score,
            "trend": trend,
            "safety_concern": chat_session.latest_safety_concern,
            "urgency": chat_session.latest_urgency,
            "case_status": chat_session.case_status,
            "assigned_operator": chat_session.assigned_operator,
            "acknowledged_at": chat_session.acknowledged_at,
            "escalation_level": chat_session.escalation_level,
            "downgrade_streak": chat_session.downgrade_streak,
            "created_at": chat_session.created_at,
            "updated_at": chat_session.updated_at,
            "messages": [
                {
                    "id": message.id,
                    "role": message.role,
                    "content": message.content,
                    "created_at": message.created_at,
                }
                for message in messages
            ],
        }

    finally:
        db.close()     
@app.post("/operator/cases/{session_id}/acknowledge")
async def acknowledge_case(
    session_id: int,
    operator_info: dict = Depends(verify_operator_token),
):
    db = SessionLocal()

    try:
        chat_session = db.query(
            models.ChatSession
        ).filter(
            models.ChatSession.id == session_id
        ).first()

        if chat_session is None:
            raise HTTPException(
                status_code=404,
                detail="Case not found.",
            )

        if chat_session.case_status == "RESOLVED":
            raise HTTPException(
                status_code=409,
                detail="Resolved case cannot be acknowledged.",
            )

        if chat_session.case_status == "ACKNOWLEDGED":
            raise HTTPException(
                status_code=409,
                detail="Case has already been acknowledged.",
            )

        chat_session.case_status = "ACKNOWLEDGED"
        chat_session.assigned_operator = operator_info["name"]
        chat_session.acknowledged_at = datetime.utcnow()
        audit_entry = models.AuditLog(
            session_id=session_id,
            action="CASE_ACKNOWLEDGED",
            actor="operator",
            details="Operator acknowledged the case.",
        )

        db.add(audit_entry)       
        db.commit()

        return {
            "session_id": session_id,
            "case_status": chat_session.case_status,
        }

    finally:
        db.close()      
@app.post("/operator/cases/{session_id}/resolve")
async def resolve_case(
    session_id: int,
    _: bool = Depends(verify_operator_token),
):
    db = SessionLocal()

    try:
        chat_session = db.query(
            models.ChatSession
        ).filter(
            models.ChatSession.id == session_id
        ).first()

        if chat_session is None:
            raise HTTPException(
                status_code=404,
                detail="Case not found.",
            )

        if chat_session.case_status == "RESOLVED":
            raise HTTPException(
                status_code=409,
                detail="Case has already been resolved.",
            )

        chat_session.case_status = "RESOLVED"
        chat_session.is_active = False

        audit_entry = models.AuditLog(
            session_id=session_id,
            action="CASE_RESOLVED",
            actor="operator",
            details="Operator resolved the case.",
        )

        db.add(audit_entry)

        db.commit()

        return {
            "session_id": session_id,
            "case_status": chat_session.case_status,
            "is_active": chat_session.is_active,
        }

    finally:
        db.close()
@app.get("/operator/cases/{session_id}/audit")
async def get_case_audit_log(
    session_id: int,
    _: bool = Depends(verify_operator_token),
):
    db = SessionLocal()

    try:
        chat_session = db.query(
            models.ChatSession
        ).filter(
            models.ChatSession.id == session_id
        ).first()

        if chat_session is None:
            raise HTTPException(
                status_code=404,
                detail="Case not found.",
            )

        logs = db.query(
            models.AuditLog
        ).filter(
            models.AuditLog.session_id == session_id
        ).order_by(
            models.AuditLog.created_at.asc()
        ).all()

        return {
            "session_id": session_id,
            "audit_logs": [
                {
                    "id": log.id,
                    "action": log.action,
                    "actor": log.actor,
                    "details": log.details,
                    "created_at": log.created_at,
                }
                for log in logs
            ],
        }

    finally:
        db.close()

@app.post("/operator/cases/{session_id}/notes")
async def add_operator_note(
    session_id: int,
    payload: OperatorNoteRequest,
    _: bool = Depends(verify_operator_token),
):
    db = SessionLocal()

    try:
        chat_session = db.query(
            models.ChatSession
        ).filter(
            models.ChatSession.id == session_id
        ).first()

        if chat_session is None:
            raise HTTPException(
                status_code=404,
                detail="Case not found.",
            )

        new_note = models.OperatorNote(
            session_id=session_id,
            note=payload.note,
            author="operator",
        )

        db.add(new_note)

        audit_entry = models.AuditLog(
            session_id=session_id,
            action="OPERATOR_NOTE_ADDED",
            actor="operator",
            details="Operator added an internal case note.",
        )

        db.add(audit_entry)
        db.commit()
        db.refresh(new_note)

        return {
            "id": new_note.id,
            "session_id": session_id,
            "note": new_note.note,
            "author": new_note.author,
            "created_at": new_note.created_at,
        }

    finally:
        db.close()

@app.get("/operator/cases/{session_id}/notes")
async def get_operator_notes(
    session_id: int,
    _: bool = Depends(verify_operator_token),
):
    db = SessionLocal()

    try:
        chat_session = db.query(
            models.ChatSession
        ).filter(
            models.ChatSession.id == session_id
        ).first()

        if chat_session is None:
            raise HTTPException(
                status_code=404,
                detail="Case not found.",
            )

        notes = db.query(
            models.OperatorNote
        ).filter(
            models.OperatorNote.session_id == session_id
        ).order_by(
            models.OperatorNote.created_at.asc()
        ).all()

        return {
            "session_id": session_id,
            "notes": [
                {
                    "id": note.id,
                    "note": note.note,
                    "author": note.author,
                    "created_at": note.created_at,
                }
                for note in notes
            ],
        }

    finally:
        db.close()

@app.get("/operator/cases/{session_id}/voice-analyses")
async def get_case_voice_analyses(
    session_id: int,
    _: bool = Depends(verify_operator_token),
):
    db = SessionLocal()

    try:
        chat_session = db.query(
            models.ChatSession
        ).filter(
            models.ChatSession.id == session_id
        ).first()

        if chat_session is None:
            raise HTTPException(
                status_code=404,
                detail="Case not found.",
            )

        analyses = db.query(
            models.VoiceAnalysis
        ).filter(
            models.VoiceAnalysis.session_id == session_id
        ).order_by(
            models.VoiceAnalysis.created_at.asc()
        ).all()

        return {
            "session_id": session_id,
            "voice_analyses": [
                {
                    "id": item.id,
                    "transcript": item.transcript,
                    "duration_seconds": item.duration_seconds,
                    "pause_ratio": item.pause_ratio,
                    "mean_pitch_hz": item.mean_pitch_hz,
                    "pitch_variation_hz": item.pitch_variation_hz,
                    "created_at": item.created_at,
                }
                for item in analyses
            ],
        }

    finally:
        db.close()

@app.get("/operator/cases/{session_id}/risk-history")
async def get_case_risk_history(
    session_id: int,
    _: bool = Depends(verify_operator_token),
):
    db = SessionLocal()

    try:
        chat_session = db.query(
            models.ChatSession
        ).filter(
            models.ChatSession.id == session_id
        ).first()

        if chat_session is None:
            raise HTTPException(
                status_code=404,
                detail="Case not found.",
            )

        history = db.query(
            models.RiskAssessmentHistory
        ).filter(
            models.RiskAssessmentHistory.session_id == session_id
        ).order_by(
            models.RiskAssessmentHistory.created_at.asc()
        ).all()

        return {
            "session_id": session_id,
            "risk_history": [
                {
                    "id": item.id,
                    "stress_score": item.stress_score,
                    "raw_risk_level": item.raw_risk_level,
                    "effective_risk_level": item.effective_risk_level,
                    "safety_concern": item.safety_concern,
                    "urgency": item.urgency,
                    "degraded": item.degraded,
                    "created_at": item.created_at,
                }
                for item in history
            ],
        }

    finally:
        db.close()

@app.post("/sessions/{session_id}/voice")
async def upload_voice(
    session_id: int,
    audio: UploadFile = File(...),
):
    db = SessionLocal()

    try:
        chat_session = db.query(
            models.ChatSession
        ).filter(
            models.ChatSession.id == session_id
        ).first()

        if chat_session is None:
            raise HTTPException(
                status_code=404,
                detail="Chat session not found.",
            )

        if not chat_session.is_active:
            raise HTTPException(
                status_code=409,
                detail="This chat session has already been resolved.",
            )
        
        audio_bytes = await audio.read()

        if not audio_bytes:
            raise HTTPException(
                status_code=400,
                detail="Empty audio file.",
            )
        try:
            voice_features = extract_voice_features(
                audio_bytes
            )

        except Exception:
            logger.exception(
                "Voice feature extraction failed."
            )

            voice_features = None

        mime_type = audio.content_type or "audio/mpeg"

        

        try:
            transcript = await _provider.transcribe_audio(
                audio_bytes,
                mime_type,
            )

        except Exception:
            logger.exception(
                "Primary audio transcription failed. "
                "Switching to local Whisper fallback."
            )

            try:
                suffix = os.path.splitext(
                    audio.filename or "audio.ogg"
                )[1] or ".ogg"

                transcript = transcribe_with_whisper(
                    audio_bytes,
                    suffix=suffix,
                )

            except Exception:
                logger.exception(
                    "Local Whisper transcription also failed."
                )

                raise HTTPException(
                    status_code=503,
                    detail="Voice transcription temporarily unavailable.",
                )

        message_payload = SessionMessageRequest(
            message=transcript
        )

        message_result = await send_session_message(
            session_id=session_id,
            payload=message_payload,
        )

        voice_record = models.VoiceAnalysis(
            session_id=session_id,
            transcript=transcript,
            duration_seconds=voice_features.get("duration_seconds")
            if voice_features else None,
            pause_ratio=voice_features.get("pause_ratio")
            if voice_features else None,
            mean_pitch_hz=voice_features.get("mean_pitch_hz")
            if voice_features else None,
            pitch_variation_hz=voice_features.get("pitch_variation_hz")
            if voice_features else None,
        )

        db.add(voice_record)
        db.commit()
        db.refresh(voice_record)        
        response_text = message_result["victim_response"]
        response_text = message_result["victim_response"]

        try:
            audio_response_path = await text_to_speech(
                response_text
            )

            response_audio_url = (
                f"/audio/"
                f"{audio_response_path.replace('\\', '/').split('/')[-1]}"
            )

        except Exception:
            logger.exception(
                "Text-to-speech generation failed."
            )

            response_audio_url = None

        return {
            "session_id": session_id,
            "filename": audio.filename,
            "content_type": mime_type,
            "size_bytes": len(audio_bytes),
            "transcript": transcript,
            "voice_features": voice_features,
            "voice_analysis_id": voice_record.id,
            "chat_result": message_result,
            "response_audio_url": response_audio_url,
        }

    finally:
        db.close()
@app.post(
    "/sessions/{session_id}/messages",
    response_model=SessionMessageResponse,
)
async def send_session_message(
    session_id: int,
    payload: SessionMessageRequest,
):
    db = SessionLocal()

    try:
        chat_session = db.query(
            models.ChatSession
        ).filter(
            models.ChatSession.id == session_id
        ).first()

        if chat_session is None:
            raise HTTPException(
                status_code=404,
                detail="Chat session not found.",
            )

        if not chat_session.is_active:
            raise HTTPException(
                status_code=409,
                detail="This chat session has already been resolved.",
            )

        previous_messages = db.query(
            models.ChatMessage
        ).filter(
            models.ChatMessage.session_id == session_id
        ).order_by(
            models.ChatMessage.created_at.asc()
        ).all()

        history = [
            f"{item.role}: {item.content}"
            for item in previous_messages
        ]

        user_message = models.ChatMessage(
            session_id=session_id,
            role="user",
            content=payload.message,
        )

        db.add(user_message)
        db.commit()

        if chat_session.risk_assessment_consent:

            try:
                result = await _provider.analyze(
                    payload.message,
                    history,
                )

            except Exception:
                logger.exception(
                    "AI provider failed. Switching to fallback provider."
                )

                result = await _fallback.analyze(
                    payload.message,
                    history,
                )

            assessment = risk_engine.assess(result)

            previous_level = chat_session.latest_risk_level

            if result.degraded:
                effective_level = (
                    previous_level
                    if previous_level
                    else assessment.risk_level.value
                )

                new_downgrade_streak = chat_session.downgrade_streak

            else:
                effective_level, new_downgrade_streak = (
                    apply_no_silent_downgrade(
                        previous_level=previous_level,
                        current_level=assessment.risk_level.value,
                        downgrade_streak=chat_session.downgrade_streak,
                    )
                )

            chat_session.downgrade_streak = new_downgrade_streak

            chat_session.latest_risk_level = effective_level
            chat_session.latest_stress_score = assessment.stress_score
            chat_session.latest_safety_concern = (
                effective_level in ("HIGH", "CRITICAL")
            )

            chat_session.latest_urgency = effective_level

            history_record = models.RiskAssessmentHistory(
                session_id=session_id,
                stress_score=assessment.stress_score,
                raw_risk_level=assessment.risk_level.value,
                effective_risk_level=effective_level,
                safety_concern=chat_session.latest_safety_concern,
                urgency=chat_session.latest_urgency,
                degraded=result.degraded,
            )

            db.add(history_record)

            if effective_level == "CRITICAL":
                chat_session.escalation_level = "URGENT"

            elif effective_level in ("MODERATE", "HIGH"):            
                chat_session.escalation_level = "HUMAN_REVIEW"

            else:
                chat_session.escalation_level = "MONITOR"

            victim_response = assessment.victim_response

        else:

            try:
                victim_response = await _provider.chat(
                    payload.message,
                    history,
                )

            except Exception:
                logger.exception(
                    "Chat provider failed. Using basic supportive fallback."
                )

                victim_response = (
                    "Thank you for sharing that. "
                    "I'm here to listen. "
                    "Would you like to tell me a little more?"
                )

            assessment = None

        assistant_message = models.ChatMessage(
            session_id=session_id,
            role="assistant",
            content=victim_response,
        )       
        from datetime import datetime


        chat_session.updated_at = datetime.utcnow()

        if (
            chat_session.title == "New Support Chat"
            and chat_session.risk_assessment_consent
            and assessment is not None
            and not result.degraded
        ):
            indicator_names = {
                item.lower().strip().replace(" ", "_")
                for item in assessment.indicators
            }

            if "suicidal_ideation" in indicator_names or "self_harm_concern" in indicator_names:
                chat_session.title = "Immediate safety support"

            elif "physical_danger" in indicator_names:
                chat_session.title = "Physical safety concern"

            elif "threat" in indicator_names or "intimidation" in indicator_names:
                chat_session.title = "Threat-related support"

            elif "social_isolation" in indicator_names:
                chat_session.title = "Emotional support"

            elif "anxiety" in indicator_names or "fear" in indicator_names:
                chat_session.title = "Stress and safety support"

            else:
                chat_session.title = "Support conversation"       
        db.add(assistant_message)
        db.commit()

        return {
            "session_id": session_id,
            "risk_assessment_consent": chat_session.risk_assessment_consent,
            "assessment": assessment,
            "victim_response": victim_response,
            "effective_risk_level": (
                chat_session.latest_risk_level
                if chat_session.latest_risk_level
                else None
            ),
            "downgrade_streak": chat_session.downgrade_streak,
        }       

    finally:
        db.close()
@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:

    # STEP 1:
    # Ask the configured AI provider to extract contextual risk signals.
    try:
        result = await _provider.analyze(
            payload.message,
            payload.history,
        )

    except Exception:
        logger.exception(
            "AI provider failed. Switching to fallback provider."
        )

        # STEP 2:
        # If the real AI provider fails, use the conservative fallback.
        try:
            result = await _fallback.analyze(
                payload.message,
                payload.history,
            )

        except Exception as exc:
            raise HTTPException(
                status_code=503,
                detail="Analysis temporarily unavailable.",
            ) from exc

    # STEP 3:
    # AI does NOT directly determine the final risk classification.
    # The deterministic risk engine processes the extracted signals.
    try:
        return risk_engine.assess(result)

    except ValidationError as exc:
        logger.exception(
            "Failed to build final risk assessment."
        )

        raise HTTPException(
            status_code=500,
            detail="Internal error while assessing message.",
        ) from exc