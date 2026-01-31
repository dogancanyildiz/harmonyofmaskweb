/**
 * Simple sound effects using Web Audio API (no asset files).
 * Jump: short high beep. Goal: ascending success tone. Death: low short tone.
 * Master volume (0–1) scales SFX; music volume (0–1) for optional loop.
 */
export class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private masterVolume = 1;
  private musicVolume = 0.5;
  private musicOsc: OscillatorNode | null = null;
  private musicGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (this.ctx) return this.ctx;
    const Ctor =
      typeof window !== 'undefined' &&
      (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    if (!Ctor) return null;
    this.ctx = new (Ctor as typeof AudioContext)();
    return this.ctx;
  }

  private beep(frequency: number, durationMs: number, type: OscillatorType = 'sine', volume = 0.15): void {
    if (!this.enabled || this.masterVolume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const v = volume * this.masterVolume;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(v, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + durationMs / 1000);
    osc.start(now);
    osc.stop(now + durationMs / 1000);
  }

  playJump(): void {
    this.beep(520, 80, 'sine', 0.12);
  }

  playGoal(): void {
    const ctx = this.getContext();
    if (!ctx || !this.enabled || this.masterVolume <= 0) return;
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(392, now);
    osc.frequency.setValueAtTime(523, now + 0.08);
    osc.frequency.setValueAtTime(659, now + 0.16);
    gain.gain.setValueAtTime(0.15 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  playDeath(): void {
    this.beep(180, 200, 'sawtooth', 0.1);
  }

  playMaskSwitch(): void {
    this.beep(330, 50, 'sine', 0.08);
  }

  setEnabled(value: boolean): void {
    this.enabled = value;
  }

  setMasterVolume(value: number): void {
    this.masterVolume = Math.max(0, Math.min(1, value));
  }

  setMusicVolume(value: number): void {
    this.musicVolume = Math.max(0, Math.min(1, value));
    if (this.musicGain) this.musicGain.gain.setValueAtTime(this.musicVolume * 0.06, this.getContext()?.currentTime ?? 0);
  }

  startMusic(): void {
    const ctx = this.getContext();
    if (!ctx || this.musicOsc) return;
    if (ctx.state === 'suspended') ctx.resume();
    this.musicOsc = ctx.createOscillator();
    this.musicGain = ctx.createGain();
    this.musicOsc.connect(this.musicGain);
    this.musicGain.connect(ctx.destination);
    this.musicOsc.type = 'sine';
    this.musicOsc.frequency.setValueAtTime(220, ctx.currentTime);
    this.musicGain.gain.setValueAtTime(this.musicVolume * 0.06, ctx.currentTime);
    this.musicOsc.start(ctx.currentTime);
  }

  stopMusic(): void {
    if (this.musicOsc) {
      try {
        this.musicOsc.stop();
      } catch {
        // already stopped
      }
      this.musicOsc = null;
      this.musicGain = null;
    }
  }
}
