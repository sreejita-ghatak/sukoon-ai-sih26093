/**
 * Subtle calming harmonic ambient audio synthesizer using the Web Audio API
 */
class CalmSoundscape {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.04, now + 3);

      // Low soothing warm 432Hz harmonic (root 108Hz / 216Hz calming drone)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sine';
      this.osc1.frequency.setValueAtTime(108, now); // Low calming octave

      // Gentle theta binaural difference (112 Hz creates a 4Hz theta wave)
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(112, now);

      this.osc1.connect(this.gainNode);
      this.osc2.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.osc1.start(now);
      this.osc2.start(now);
      this.isPlaying = true;
    } catch (e) {
      console.warn('AudioContext not permitted or supported yet:', e);
      this.isPlaying = false;
    }
  }

  public stop() {
    if (this.gainNode && this.ctx) {
      const now = this.ctx.currentTime;
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      setTimeout(() => {
        try {
          this.osc1?.stop();
          this.osc2?.stop();
          this.osc1?.disconnect();
          this.osc2?.disconnect();
          this.isPlaying = false;
        } catch {
          // ignore
        }
      }, 1600);
    } else {
      this.isPlaying = false;
    }
  }

  public getPlayingState(): boolean {
    return this.isPlaying;
  }
}

export const soundscape = new CalmSoundscape();
