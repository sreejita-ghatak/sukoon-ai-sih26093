from abc import ABC, abstractmethod
from typing import List, Optional

from config import settings
from schemas import IndicatorSignal, ProviderAnalysisResult


# ------------------------------------------------------------
# FALLBACK SAFETY PHRASES
# ------------------------------------------------------------
# IMPORTANT:
# This fallback is NOT the real multilingual AI system.
# It is only used when the configured AI provider is unavailable.
# The real AI provider will handle contextual multilingual analysis.
# ------------------------------------------------------------

_SELF_HARM_TERMS = [
    # English
    "kill myself",
    "end my life",
    "want to die",
    "don't want to live",
    "do not want to live",
    "suicide",
    "hurt myself",
    "harm myself",
    "end everything",

    # Bengali
    "নিজেকে মেরে ফেলব",
    "নিজেকে মেরে ফেলবো",
    "আমি মরতে চাই",
    "বাঁচতে চাই না",
    "আর বাঁচতে চাই না",
    "নিজের ক্ষতি করব",
    "নিজেকে শেষ করে দেব",
    "সব শেষ করে দেব",

    # Hindi
    "खुद को मार दूंगा",
    "खुद को मार दूंगी",
    "मैं मरना चाहता हूं",
    "मैं मरना चाहती हूं",
    "जीना नहीं चाहता",
    "जीना नहीं चाहती",
    "खुद को नुकसान पहुंचाऊंगा",
    "खुद को नुकसान पहुंचाऊंगी",
    "सब खत्म कर दूंगा",
    "सब खत्म कर दूंगी",
]


_IMMEDIATE_DANGER_TERMS = [
    # English
    "he is coming to kill me",
    "they are coming to kill me",
    "someone is trying to kill me",
    "he has a gun",
    "he has a knife",
    "they have a weapon",
    "not safe tonight",
    "they are outside my house",
    "he is outside my house",
    "they will attack me tonight",

    # Bengali
    "ওরা আমাকে মারতে আসছে",
    "ওরা আমাকে মেরে ফেলবে",
    "আমাকে মেরে ফেলতে আসছে",
    "ওদের কাছে বন্দুক আছে",
    "ওদের কাছে ছুরি আছে",
    "ওরা আমার বাড়ির বাইরে",
    "ওরা আমার বাড়ির বাইরে",
    "আজ রাতে আমি নিরাপদ নই",
    "আজ রাতে ওরা আমাকে আক্রমণ করবে",

    # Hindi
    "वे मुझे मारने आ रहे हैं",
    "वो मुझे मारने आ रहे हैं",
    "वे मुझे मार देंगे",
    "वो मुझे मार देंगे",
    "उनके पास बंदूक है",
    "उनके पास चाकू है",
    "वे मेरे घर के बाहर हैं",
    "वो मेरे घर के बाहर हैं",
    "आज रात मैं सुरक्षित नहीं हूं",
    "आज रात वे मुझ पर हमला करेंगे",
]


class AIProvider(ABC):
    """
    Common interface for every AI provider.

    Future providers can include:
    - Claude
    - OpenAI
    - Gemini
    - other multilingual models
    """

    @abstractmethod
    async def analyze(
        self,
        message: str,
        history: Optional[List[str]] = None,
    ) -> ProviderAnalysisResult:
        raise NotImplementedError

    async def chat(
        self,
        message: str,
        history: Optional[List[str]] = None,
    ) -> str:
        return (
            "Thank you for sharing that. "
            "I'm here to listen. "
            "Would you like to tell me a little more?"
        )
class FallbackProvider(AIProvider):
    """
    Conservative emergency fallback.

    This is only used when the real AI provider is unavailable.

    It does NOT perform full psychological or contextual analysis.
    It only catches a limited set of explicit safety-critical phrases.
    """

    async def analyze(
        self,
        message: str,
        history: Optional[List[str]] = None,
    ) -> ProviderAnalysisResult:

        lowered = message.lower().strip()

        self_harm_hit = any(
            term.lower() in lowered
            for term in _SELF_HARM_TERMS
        )

        danger_hit = any(
            term.lower() in lowered
            for term in _IMMEDIATE_DANGER_TERMS
        )

        indicators: List[IndicatorSignal] = []

        if self_harm_hit:
            indicators.append(
                IndicatorSignal(
                    name="self_harm_concern",
                    severity=1.0,
                    evidence="Explicit self-harm or suicidal safety phrase detected by fallback.",
                )
            )

        if danger_hit:
            indicators.append(
                IndicatorSignal(
                    name="physical_danger",
                    severity=1.0,
                    evidence="Explicit immediate physical-danger phrase detected by fallback.",
                )
            )

        if self_harm_hit or danger_hit:
            victim_response = (
                "Thank you for telling me this. "
                "I’m still here with you. "
                "Can you tell me whether you are in immediate danger right now?"
            )
        else:
            victim_response = (
                "Thank you for telling me. "
                "Part of my analysis system is temporarily unavailable, "
                "but I’m still here to listen. "
                "Can you tell me a little more about what is happening?"
            )

        return ProviderAnalysisResult(
            victim_response=victim_response,
            indicators=indicators,

            explicit_self_harm_or_suicidal_intent=self_harm_hit,
            explicit_immediate_physical_danger=danger_hit,

            reasoning=(
                "The primary AI provider was unavailable. "
                "This result came from a limited emergency fallback that checks "
                "only explicit safety-critical phrases. "
                "It is not a full contextual or clinical assessment."
            ),

            degraded=True,
        )


def get_provider() -> AIProvider:
    """
    Creates the configured AI provider.

    Supported:
    - gemini
    - claude

    If configuration is missing or unsupported,
    the emergency fallback is returned.
    """

    provider_name = (
        settings.ai_provider or "gemini"
    ).lower()

    if provider_name == "gemini":

        if not settings.gemini_api_key:
            return FallbackProvider()

        if not settings.ai_model:
            return FallbackProvider()

        from gemini_provider import GeminiProvider

        return GeminiProvider(
            api_key=settings.gemini_api_key,
            model=settings.ai_model,
        )

    if provider_name == "claude":

        api_key = (
            settings.anthropic_api_key
            or settings.ai_api_key
        )

        if not api_key:
            return FallbackProvider()

        if not settings.ai_model:
            return FallbackProvider()

        from claude_provider import ClaudeProvider

        return ClaudeProvider(
            api_key=api_key,
            model=settings.ai_model,
        )

    return FallbackProvider()