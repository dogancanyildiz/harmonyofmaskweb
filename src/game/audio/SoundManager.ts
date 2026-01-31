/**
 * Simple sound effects using Web Audio API (no asset files).
 * Jump: short high beep. Goal: ascending success tone. Death: low short tone.
 */
export class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled = true;

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
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + durationMs / 1000);
    osc.start(now);
    osc.stop(now + durationMs / 1000);
  }

  playJump(): void {
    this.beep(520, 80, 'sine', 0.12);
  }

  playGoal(): void {
    const ctx = this.getContext();
    if (!ctx || !this.enabled) return;
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
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  playDeath(): void {
    this.beep(180, 200, 'sawtooth', 0.1);
  }

  setEnabled(value: boolean): void {
    this.enabled = value;
  }
}
