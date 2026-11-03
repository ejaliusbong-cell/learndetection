/**
 * Client-Side Emergency Siren Synthesizer using Web Audio API
 * Generates official-sounding disaster warning tone (sweep modulation)
 */

class SirenSynthesizer {
  private audioCtx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  private initContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  start() {
    if (this.isPlaying) return;
    this.initContext();

    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    try {
      const ctx = this.audioCtx;

      // Master gain
      this.gainNode = ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
      this.gainNode.connect(ctx.destination);

      // Primary siren tone (Sawtooth for alerting bite)
      this.osc1 = ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(650, ctx.currentTime);

      // Sub harmonic tone (Sine for depth)
      this.osc2 = ctx.createOscillator();
      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(325, ctx.currentTime);

      // LFO for pitch sweep modulation (0.6 Hz cycle between 650Hz and 1050Hz)
      this.lfo = ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.7, ctx.currentTime);

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(350, ctx.currentTime);

      this.lfo.connect(lfoGain);
      lfoGain.connect(this.osc1.frequency);

      this.osc1.connect(this.gainNode);
      this.osc2.connect(this.gainNode);

      this.osc1.start();
      this.osc2.start();
      this.lfo.start();

      this.isPlaying = true;
    } catch (e) {
      console.warn('Could not start emergency siren audio:', e);
    }
  }

  stop() {
    if (!this.isPlaying) return;

    try {
      if (this.gainNode && this.audioCtx) {
        // Smooth fade out
        this.gainNode.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.2);
      }

      setTimeout(() => {
        try {
          this.osc1?.stop();
          this.osc2?.stop();
          this.lfo?.stop();
          this.osc1?.disconnect();
          this.osc2?.disconnect();
          this.lfo?.disconnect();
        } catch {}
        this.osc1 = null;
        this.osc2 = null;
        this.lfo = null;
        this.isPlaying = false;
      }, 220);
    } catch {
      this.isPlaying = false;
    }
  }

  toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  getStatus(): boolean {
    return this.isPlaying;
  }
}

export const siren = new SirenSynthesizer();
