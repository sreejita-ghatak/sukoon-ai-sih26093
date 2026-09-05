import os
import subprocess
import tempfile

import imageio_ffmpeg
import librosa
import numpy as np


def extract_voice_features(
    audio_bytes: bytes,
) -> dict:

    input_path = None
    output_path = None

    try:
        # Save browser-recorded WebM audio temporarily
        with tempfile.NamedTemporaryFile(
            suffix=".webm",
            delete=False,
        ) as input_file:
            input_file.write(audio_bytes)
            input_path = input_file.name

        # Temporary WAV output
        with tempfile.NamedTemporaryFile(
            suffix=".wav",
            delete=False,
        ) as output_file:
            output_path = output_file.name

        # Use FFmpeg bundled with imageio-ffmpeg
        ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()

        subprocess.run(
            [
                ffmpeg_path,
                "-y",
                "-i",
                input_path,
                "-ac",
                "1",
                "-ar",
                "16000",
                output_path,
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        # Load converted WAV
        audio_data, sample_rate = librosa.load(
            output_path,
            sr=None,
            mono=True,
        )

        duration_seconds = librosa.get_duration(
            y=audio_data,
            sr=sample_rate,
        )

        rms = librosa.feature.rms(
            y=audio_data
        )[0]

        if len(rms) == 0:
            raise ValueError("No usable audio frames found.")

        silence_threshold = np.max(rms) * 0.20

        silent_frames = np.sum(
            rms < silence_threshold
        )

        total_frames = len(rms)

        pause_ratio = (
            silent_frames / total_frames
            if total_frames > 0
            else 0.0
        )

        pitches = librosa.yin(
            audio_data,
            fmin=75,
            fmax=500,
            sr=sample_rate,
        )

        valid_pitches = pitches[
            np.isfinite(pitches)
        ]

        if len(valid_pitches) > 0:
            mean_pitch = float(
                np.mean(valid_pitches)
            )

            pitch_variation = float(
                np.std(valid_pitches)
            )
        else:
            mean_pitch = 0.0
            pitch_variation = 0.0

        return {
            "duration_seconds": round(
                float(duration_seconds),
                2,
            ),
            "pause_ratio": round(
                float(pause_ratio),
                3,
            ),
            "mean_pitch_hz": round(
                mean_pitch,
                2,
            ),
            "pitch_variation_hz": round(
                pitch_variation,
                2,
            ),
        }

    finally:
        # Clean up temporary files
        for path in (input_path, output_path):
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except OSError:
                    pass