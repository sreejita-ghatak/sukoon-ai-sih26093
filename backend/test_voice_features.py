from pathlib import Path

from voice_features import extract_voice_features


audio_path = Path("PTT-20260831-WA0005.opus")

audio_bytes = audio_path.read_bytes()

features = extract_voice_features(
    audio_bytes
)

print(features)
