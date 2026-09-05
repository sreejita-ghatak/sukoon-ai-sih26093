from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text ,Float
from sqlalchemy.orm import relationship

from database import Base


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(
        String(200),
        nullable=False,
        default="New Support Chat",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
    )
    latest_risk_level = Column(
        String(20),
        nullable=True,
    )

    latest_stress_score = Column(
        Integer,
        nullable=True,
    )

    latest_safety_concern = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    latest_urgency = Column(
        String(20),
        nullable=True,
    )
    case_status = Column(
        String(20),
        nullable=False,
        default="NEW",
    )

    assigned_operator = Column(
        String(200),
        nullable=True,
    )

    acknowledged_at = Column(
        DateTime,
        nullable=True,
    )

    escalation_level = Column(
        String(20),
        nullable=False,
        default="MONITOR",
    )

    risk_assessment_consent = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    downgrade_streak = Column(
        Integer,
        nullable=False,
        default=0,
    )

    messages = relationship(
        "ChatMessage",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="ChatMessage.created_at",
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("chat_sessions.id"),
        nullable=False,
        index=True,
    )

    role = Column(
        String(20),
        nullable=False,
    )

    content = Column(
        Text,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    session = relationship(
        "ChatSession",
        back_populates="messages",
    )
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("chat_sessions.id"),
        nullable=False,
        index=True,
    )

    action = Column(
        String(50),
        nullable=False,
    )

    actor = Column(
        String(100),
        nullable=False,
        default="operator",
    )

    details = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

class OperatorNote(Base):
    __tablename__ = "operator_notes"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("chat_sessions.id"),
        nullable=False,
        index=True,
    )

    note = Column(
        Text,
        nullable=False,
    )

    author = Column(
        String(100),
        nullable=False,
        default="operator",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

class VoiceAnalysis(Base):
    __tablename__ = "voice_analyses"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("chat_sessions.id"),
        nullable=False,
        index=True,
    )

    transcript = Column(
        Text,
        nullable=False,
    )

    duration_seconds = Column(Float, nullable=True)
    pause_ratio = Column(Float, nullable=True)
    mean_pitch_hz = Column(Float, nullable=True)
    pitch_variation_hz = Column(Float, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

class RiskAssessmentHistory(Base):
    __tablename__ = "risk_assessment_history"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("chat_sessions.id"),
        nullable=False,
        index=True,
    )

    stress_score = Column(
        Integer,
        nullable=False,
    )

    raw_risk_level = Column(
        String(20),
        nullable=False,
    )

    effective_risk_level = Column(
        String(20),
        nullable=False,
    )

    safety_concern = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    urgency = Column(
        String(20),
        nullable=False,
    )

    degraded = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )