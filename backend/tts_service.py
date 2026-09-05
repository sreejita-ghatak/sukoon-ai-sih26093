import os
import uuid

import edge_tts


AUDIO_DIR = "generated_audio"

os.makedirs(
    AUDIO_DIR,
    exist_ok=True,
)


def detect_voice(text: str) -> str:

    # Bengali
    if any("\u0980" <= char <= "\u09FF" for char in text):
        return "bn-IN-TanishaaNeural"

    # Hindi
    if any("\u0900" <= char <= "\u097F" for char in text):
        return "hi-IN-SwaraNeural"

    # English
    return "en-IN-NeerjaNeural"


async def text_to_speech(
    text: str,
) -> str:

    voice = detect_voice(text)

    filename = f"{uuid.uuid4()}.mp3"

    output_path = os.path.join(
        AUDIO_DIR,
        filename,
    )

    communicate = edge_tts.Communicate(
        text=text,
        voice=voice,
    )

    await communicate.save(
        output_path
    )

    return output_path