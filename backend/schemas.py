from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class RiskLevel(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AnalyzeRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        description="The victim's current message."
    )

    history: Optional[List[str]] = Field(
        default=None,
        description="Optional prior messages, oldest first."
    )

    @field_validator("message")
    @classmethod
    def message_not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("message must not be blank")
        return value


class AnalyzeResponse(BaseModel):
    stress_score: int = Field(..., ge=0, le=100)
    risk_level: RiskLevel
    indicators: List[str] = Field(default_factory=list)

    safety_concern: bool
    urgency: RiskLevel
    safety_override: bool = False
    override_reason: Optional[str] = None
    recommended_action: str
    reasoning: str
    victim_response: str


class SessionMessageResponse(BaseModel):
    session_id: int
    risk_assessment_consent: bool
    assessment: Optional[AnalyzeResponse] = None
    victim_response: str
    effective_risk_level: Optional[RiskLevel] = None
    downgrade_streak: int = 0


class IndicatorSignal(BaseModel):
    name: str

    severity: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="0 = weak/absent, 1 = strong/explicit"
    )

    evidence: Optional[str] = None


class ProviderAnalysisResult(BaseModel):
    """
    Raw analysis returned by an AI provider.

    This is NOT the final risk assessment.
    The risk engine converts these signals into the final response.
    """

    victim_response: str

    indicators: List[IndicatorSignal] = Field(
        default_factory=list
    )

    explicit_self_harm_or_suicidal_intent: bool = False

    explicit_immediate_physical_danger: bool = False

    reasoning: str = ""

    degraded: bool = False

class SessionMessageRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        description="New message for an existing chat session."
    )

    @field_validator("message")
    @classmethod
    def session_message_not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("message must not be blank")
        return value

class OperatorLoginRequest(BaseModel):
    username: str
    password: str

class ConsentRequest(BaseModel):
    consent: bool

class OperatorNoteRequest(BaseModel):
    note: str = Field(
        ...,
        min_length=1,
        description="Internal note written by an authorized operator.",
    )

    @field_validator("note")
    @classmethod
    def note_not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("note must not be blank")
        return value.strip()