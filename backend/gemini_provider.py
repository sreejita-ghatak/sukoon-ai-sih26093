import asyncio
import json
from typing import List, Optional

from google import genai
from google.genai import types
from google.genai import errors

from ai_provider import AIProvider
from schemas import IndicatorSignal, ProviderAnalysisResult


_SYSTEM_PROMPT = """
You are a supportive conversational assistant and private
risk-signal extraction component for a victim/complainant
support system.

You are NOT a doctor, therapist, psychologist, lawyer,
police officer, counsellor, or emergency service.

You must never claim that police, doctors, counsellors,
emergency services, or authorities have been contacted
unless a real external integration confirms that action.

You have TWO simultaneous jobs.

JOB 1 — VICTIM-FACING CONVERSATION

Respond naturally, calmly and supportively in the SAME
LANGUAGE the user is speaking whenever possible.

Do not sound clinical, robotic, judgmental or interrogative.

Do not immediately push every distressed person toward
doctors, counsellors, police or authorities.

For ordinary or moderate distress:
- listen,
- acknowledge what they said,
- ask a gentle and useful follow-up question.

For a genuine immediate safety concern:
- prioritize safety,
- ask whether the person is currently in immediate danger,
- do not falsely claim any outside help has already been contacted.

JOB 2 — PRIVATE RISK SIGNAL EXTRACTION

Extract only evidence-supported indicators from the
current message and available conversation history.

Allowed indicators:

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

Do not diagnose mental illness.

Do not say that the user "has depression", PTSD or another
clinical disorder.

Instead extract observable risk/distress indicators.

Return ONLY valid JSON in this structure:

{
  "victim_response": "natural reply in the user's language",
  "indicators": [
    {
      "name": "fear",
      "severity": 0.0,
      "evidence": "short supporting phrase"
    }
  ],
  "explicit_self_harm_or_suicidal_intent": false,
  "explicit_immediate_physical_danger": false,
  "reasoning": "short operator-facing explanation"
}

SEVERITY:
0.0 = extremely weak
1.0 = explicit / very strong

Set explicit_self_harm_or_suicidal_intent=true ONLY when
there is clear evidence of actual self-harm or suicidal intent.

Set explicit_immediate_physical_danger=true ONLY when
there is clear evidence that physical harm may be imminent.

General fear, sadness or distress alone must NOT trigger
either hard-safety boolean.

Consider semantic meaning, not only keywords.

Support multilingual Indian-language conversations whenever
the underlying model can understand the language.
"""


def _build_prompt(
    message: str,
    history: Optional[List[str]],
) -> str:

    parts = []

    if history:
        parts.append(
            "Previous conversation messages, oldest first:"
        )

        for item in history:
            parts.append(f"- {item}")

        parts.append("")

    parts.append(
        f"Current victim message:\n{message}"
    )

    return "\n".join(parts)


class GeminiProvider(AIProvider):

    def __init__(
        self,
        api_key: str,
        model: str,
    ):
        if not model:
            raise ValueError(
                "AI_MODEL is not configured."
            )

        self._client = genai.Client(
            api_key=api_key
        )

        self._model = model

    async def analyze(
        self,
        message: str,
        history: Optional[List[str]] = None,
    ) -> ProviderAnalysisResult:

        last_error = None

        for attempt in range(3):
            try:
                response = await self._client.aio.models.generate_content(
                    model=self._model,
                    contents=_build_prompt(
                        message,
                        history,
                    ),
                    config=types.GenerateContentConfig(
                        system_instruction=_SYSTEM_PROMPT,
                        response_mime_type="application/json",
                        temperature=0.2,
                    ),
                )

                break

            except errors.ClientError as exc:
                # 429 means the current Gemini quota/rate limit
                # has been exhausted. Retrying immediately is useless.
                if getattr(exc, "code", None) == 429:
                    raise

                last_error = exc

                if attempt < 2:
                    await asyncio.sleep(
                        1.5 * (attempt + 1)
                    )
                else:
                    raise last_error

            except Exception as exc:
                last_error = exc

                if attempt < 2:
                    await asyncio.sleep(
                        1.5 * (attempt + 1)
                    )
                else:
                    raise last_error

        raw_text = response.text

        if not raw_text:
            raise ValueError(
                "Gemini returned an empty response."
            )

        clean_text = raw_text.strip()
        decoder = json.JSONDecoder()
        data, _ = decoder.raw_decode(
            clean_text
        )

        indicators = []

        for item in data.get(
            "indicators",
            []
        ):
            indicators.append(
                IndicatorSignal(
                    name=item["name"],
                    severity=float(
                        item.get(
                            "severity",
                            0.5
                        )
                    ),
                    evidence=item.get(
                        "evidence"
                    ),
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
    
    async def chat(
        self,
        message: str,
        history: Optional[List[str]] = None,
    ) -> str:

        chat_prompt = """
You are a supportive conversational assistant.

The user has NOT consented to safety/risk assessment.

You may:
- respond naturally and supportively,
- continue the conversation,
- reply in the same language as the user whenever possible.

You must NOT:
- calculate or infer a risk score,
- classify LOW/MODERATE/HIGH/CRITICAL,
- extract or store trauma/risk indicators,
- perform safety profiling,
- generate operator-facing reasoning,
- recommend escalation to an operator.

Return ONLY the conversational reply as plain text.
"""

        context_parts = []

        if history:
            context_parts.append(
                "Previous conversation messages, oldest first:"
            )

            for item in history:
                context_parts.append(f"- {item}")

            context_parts.append("")

        context_parts.append(
            f"Current user message:\n{message}"
        )

        response = await self._client.aio.models.generate_content(
            model=self._model,
            contents="\n".join(context_parts),
            config=types.GenerateContentConfig(
                system_instruction=chat_prompt,
                temperature=0.4,
            ),
        )

        if not response.text:
            raise ValueError(
                "Gemini returned an empty chat response."
            )

        return response.text.strip()
        

    async def transcribe_audio(
        self,
        audio_bytes: bytes,
        mime_type: str,
    ) -> str:

        prompt = """
You are a strict speech-to-text transcription engine.

Listen only to the provided audio and write exactly what is actually spoken.

STRICT RULES:
- Transcribe only words that are clearly audible in the audio.
- Preserve the original spoken language and script.
- The speaker may use English, Bengali, Hindi, or a mixture of these languages.
- Never translate the speech.
- Never summarize or paraphrase.
- Never complete unfinished sentences.
- Never invent names, people, events, dialogue, context, or missing words.
- Never answer or respond to what the speaker says.
- Never perform risk assessment or emotional analysis.
- If a word is unclear, write [unclear] instead of guessing.
- If the audio contains no intelligible speech, return [inaudible].
- Return ONLY the transcript as plain text.
"""

        response = await self._client.aio.models.generate_content(
            model=self._model,
            contents=[
                prompt,
                types.Part.from_bytes(
                    data=audio_bytes,
                    mime_type=mime_type,
                ),
            ],
        )

        if not response.text:
            raise ValueError(
                "Gemini returned an empty transcription."
            )

        return response.text.strip()