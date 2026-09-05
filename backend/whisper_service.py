import os
import tempfile

from faster_whisper import WhisperModel


_model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8",
)


def transcribe_with_whisper(
    audio_bytes: bytes,
    suffix: str = ".ogg",
) -> str:

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:
            temp_file.write(audio_bytes)
            temp_path = temp_file.name

        segments, _ = _model.transcribe(
            temp_path,
            beam_size=5,
        )

        transcript = " ".join(
            segment.text.strip()
            for segment in segments
        ).strip()

        if not transcript:
            raise ValueError(
                "Whisper returned an empty transcription."
            )

        return transcript

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)