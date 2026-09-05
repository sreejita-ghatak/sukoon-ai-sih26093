import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    ai_provider: str = os.getenv(
        "AI_PROVIDER",
        "gemini"
    )

    # Generic key if needed by another provider later.
    ai_api_key: str | None = os.getenv("AI_API_KEY")

    anthropic_api_key: str | None = os.getenv(
        "ANTHROPIC_API_KEY"
    )

    gemini_api_key: str | None = os.getenv(
        "GEMINI_API_KEY"
    )

    ai_model: str | None = os.getenv(
        "AI_MODEL"
    )
    operator_username: str = os.getenv(
        "OPERATOR_USERNAME",
        "admin"
    )

    operator_password: str = os.getenv(
        "OPERATOR_PASSWORD",
        ""
    )

    operator_token: str = os.getenv(
        "OPERATOR_TOKEN",
        ""
    )

settings = Settings()