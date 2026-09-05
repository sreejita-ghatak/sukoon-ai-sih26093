import json
import logging
from typing import List, Optional

from anthropic import AsyncAnthropic

from ai_provider import AIProvider
from schemas import IndicatorSignal, ProviderAnalysisResult


logger = logging.getLogger(__name__)


_SYSTEM_PROMPT = """
You are a supportive listening and risk-signal-extraction assistant
inside a victim/complainant support chat.

You are NOT a doctor, therapist, lawyer, police officer, emergency
service, or counsellor.

Never claim that you contacted police, emergency services, doctors,
counsellors, or any other human service unless an actual system
integration has confirmed that action.

You have TWO jobs for every incoming message.

JOB 1 — VICTIM-FACING RESPONSE

Write a short, warm, natural and conversational reply to the person.

Do not sound clinical or robotic.

Do not immediately tell the person to contact a doctor, counsellor,
police, or other authority unless there is a genuine explicit
immediate safety concern in the current message.

Otherwise, keep listening and ask an appropriate gentle follow-up
question.

JOB 2 — PRIVATE RISK-SIGNAL EXTRACTION

Privately extract risk-relevant signals for the downstream safety
system.

The victim does NOT see these internal signals.

Possible indicators are:

fear
anxiety
threat
intimidation
trauma
social_isolation
hopelessness
panic
sleep_disturbance
physical_danger
self_harm_concern
suicidal_ideation

Only include indicators supported by evidence in the message.

Do NOT invent indicators.

Return ONLY one valid JSON object.

The JSON must have exactly this general structure:

{
  "victim_response": "short empathetic reply",
  "indicators": [
    {
      "name": "fear",
      "severity": 0.0,
      "evidence": "short quote or paraphrase"
    }
  ],
  "explicit_self_harm_or_suicidal_intent": false,
  "explicit_immediate_physical_danger": false,
  "reasoning": "short explanation for a human operator"
}

SEVERITY:

0.0 = absent or extremely weak
1.0 = very strong / explicit

Set explicit_self_harm_or_suicidal_intent to TRUE ONLY when there
is clear explicit evidence of suicidal or self-harm intent.

Set explicit_immediate_physical_danger to TRUE ONLY when there is
clear evidence of immediate physical danger.

Do not treat ordinary sadness, stress, fear, or vague statements
as explicit suicidal intent.

Do not treat every threat as immediate physical danger.

Be conservative and evidence-based.
"""


def _build_user_prompt(
    message: str,
    history: Optional[List[str]],
) -> str:

    parts: List[str] = []

    if history:
        parts.append(
            "Prior messages in this conversation, oldest first:"
        )

        for item in history:
            parts.append(f"- {item}")

        parts.append("")

    parts.append(
        f"Current message:\n{message}"
    )

    return "\n".join(parts)


class ClaudeProvider(AIProvider):

    def __init__(
        self,
        api_key: str,
        model: str = "claude-sonnet-4-6",
    ):
        self._client = AsyncAnthropic(
            api_key=api_key
        )

        self._model = model

    async def analyze(
        self,
        message: str,
        history: Optional[List[str]] = None,
    ) -> ProviderAnalysisResult:

        response = await self._client.messages.create(
            model=self._model,
            max_tokens=1000,
            system=_SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": _build_user_prompt(
                        message,
                        history,
                    ),
                }
            ],
        )

        raw_text = "".join(
            block.text
            for block in response.content
            if getattr(block, "type", None) == "text"
        )

        data = json.loads(raw_text)

        indicators = []

        for item in data.get("indicators", []):

            indicators.append(
                IndicatorSignal(
                    name=item["name"],
                    severity=float(
                        item.get("severity", 0.5)
                    ),
                    evidence=item.get("evidence"),
                )
            )

        return ProviderAnalysisResult(

            victim_response=data[
                "victim_response"
            ],

            indicators=indicators,

            explicit_self_harm_or_suicidal_intent=bool(
                data.get(
                    "explicit_self_harm_or_suicidal_intent",
                    False,
                )
            ),

            explicit_immediate_physical_danger=bool(
                data.get(
                    "explicit_immediate_physical_danger",
                    False,
                )
            ),

            reasoning=data.get(
                "reasoning",
                "",
            ),

            degraded=False,
        )