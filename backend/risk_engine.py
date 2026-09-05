from schemas import AnalyzeResponse, ProviderAnalysisResult, RiskLevel


# ------------------------------------------------------------
# BASE INDICATOR WEIGHTS
# ------------------------------------------------------------
# Prototype weights only.
# These are NOT clinically validated scores.
# ------------------------------------------------------------

INDICATOR_WEIGHTS: dict[str, float] = {
    "fear": 10,
    "anxiety": 8,
    "threat": 14,
    "intimidation": 12,
    "trauma": 12,
    "social_isolation": 8,
    "hopelessness": 12,
    "panic": 10,
    "sleep_disturbance": 5,
    "physical_danger": 18,
    "self_harm_concern": 20,
    "suicidal_ideation": 24,
}


# ------------------------------------------------------------
# RISK THRESHOLDS
# ------------------------------------------------------------

_THRESHOLDS: list[tuple[int, RiskLevel]] = [
    (25, RiskLevel.LOW),
    (50, RiskLevel.MODERATE),
    (75, RiskLevel.HIGH),
    (100, RiskLevel.CRITICAL),
]


_RECOMMENDED_ACTIONS: dict[RiskLevel, str] = {

    RiskLevel.LOW:
        "Continue the conversation naturally and keep listening for changes.",

    RiskLevel.MODERATE:
        "Continue supportive conversation and monitor for escalating risk signals.",

    RiskLevel.HIGH:
        (
            "Flag this case for human operator review and continue "
            "supportive conversation without alarming the user."
        ),

    RiskLevel.CRITICAL:
        (
            "Flag immediately for urgent human review according to "
            "the platform safety policy. Do not claim emergency services "
            "have been contacted unless a real integration confirms it."
        ),
}


def _normalise_indicator(name: str) -> str:
    return (
        name.lower()
        .strip()
        .replace(" ", "_")
        .replace("-", "_")
    )


def _score_to_level(score: int) -> RiskLevel:

    for ceiling, level in _THRESHOLDS:

        if score <= ceiling:
            return level

    return RiskLevel.CRITICAL


def _compute_base_score(
    result: ProviderAnalysisResult
) -> int:

    total = 0.0

    indicator_names = set()

    for signal in result.indicators:

        key = _normalise_indicator(
            signal.name
        )

        indicator_names.add(key)

        weight = INDICATOR_WEIGHTS.get(
            key,
            5
        )

        total += (
            weight *
            signal.severity
        )


    # --------------------------------------------------------
    # COMBINATION / INTERACTION BONUSES
    # --------------------------------------------------------
    # Individual signals can become more meaningful when they
    # appear together.
    #
    # These rules remain deterministic and auditable.
    # --------------------------------------------------------

    if {
        "fear",
        "threat"
    }.issubset(indicator_names):

        total += 10


    if {
        "threat",
        "anxiety"
    }.issubset(indicator_names):

        total += 8


    if {
        "threat",
        "physical_danger"
    }.issubset(indicator_names):

        total += 15


    if {
        "fear",
        "physical_danger"
    }.issubset(indicator_names):

        total += 10


    if {
        "hopelessness",
        "self_harm_concern"
    }.issubset(indicator_names):

        total += 20


    if {
        "suicidal_ideation",
        "self_harm_concern"
    }.issubset(indicator_names):

        total += 20


    return max(
        0,
        min(
            100,
            round(total)
        )
    )


def assess(
    result: ProviderAnalysisResult
) -> AnalyzeResponse:

    score = _compute_base_score(
        result
    )

    risk_level = _score_to_level(
        score
    )


    # --------------------------------------------------------
    # HARD SAFETY OVERRIDE
    # --------------------------------------------------------

    safety_reasons = []

    if result.explicit_self_harm_or_suicidal_intent:

        safety_reasons.append(
            "explicit self-harm/suicidal safety signal"
        )


    if result.explicit_immediate_physical_danger:

        safety_reasons.append(
            "explicit immediate physical-danger signal"
        )


    safety_override = bool(
        safety_reasons
    )
    override_reason = None

    if result.explicit_self_harm_or_suicidal_intent:
        override_reason = "explicit_self_harm_or_suicidal_intent"

    elif result.explicit_immediate_physical_danger:
        override_reason = "explicit_immediate_physical_danger"

    if safety_override:

        risk_level = RiskLevel.CRITICAL


    # --------------------------------------------------------
    # URGENCY
    # --------------------------------------------------------

    urgency = risk_level


    # --------------------------------------------------------
    # SAFETY CONCERN
    # --------------------------------------------------------

    safety_concern = (
        safety_override
        or risk_level
        in (
            RiskLevel.HIGH,
            RiskLevel.CRITICAL,
        )
    )


    recommended_action = (
        _RECOMMENDED_ACTIONS[
            risk_level
        ]
    )


    if result.degraded:

        recommended_action = (
            "Primary AI analysis is unavailable; "
            "this assessment used a limited emergency fallback. "
            + recommended_action
        )


    # --------------------------------------------------------
    # EXPLAINABLE REASONING
    # --------------------------------------------------------

    reasoning_parts = []

    if result.reasoning:

        reasoning_parts.append(
            result.reasoning
        )


    reasoning_parts.append(
        f"Prototype SVI = {score}/100."
    )


    if safety_override:

        reasoning_parts.append(
            "Final risk level was elevated to CRITICAL "
            "by a hard safety override because of: "
            + ", ".join(
                safety_reasons
            )
            + "."
        )

    else:

        reasoning_parts.append(
            "Final risk level was determined from "
            f"the SVI threshold: {risk_level.value}."
        )


    return AnalyzeResponse(

        stress_score=score,

        risk_level=risk_level,

        indicators=[
            signal.name
            for signal
            in result.indicators
        ],

        safety_concern=safety_concern,

        urgency=urgency,

        safety_override=safety_override,
        override_reason=override_reason,

        recommended_action=(
            recommended_action
        ),

        reasoning=" ".join(
            reasoning_parts
        ),

        victim_response=(
            result.victim_response
        ),
    )