// Harbour Lights — every sound is synthesised with WebAudio; no audio files.
// A soft music loop (a slow harp-like arpeggio) plus one-shot effects.
export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.musicTimer = null;
    this.musicStep = 0;
    this.notes = [523.25, 587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33];
  }

  ensure() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  setMuted(muted) {
    this.muted = muted;
    if (muted) this.stopMusic();
    else this.startMusic();
  }

  tone(freq, start, dur, type, vol, slideTo) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime + start;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  /** The satisfying find: a bright two-note chime with a little pop. */
  chime() {
    this.ensure();
    this.tone(880, 0, 0.22, 'sine', 0.22);
    this.tone(1318.5, 0.07, 0.3, 'sine', 0.18);
    this.tone(220, 0, 0.08, 'triangle', 0.12, 440);
  }

  wrong() {
    this.ensure();
    this.tone(160, 0, 0.18, 'square', 0.07, 110);
  }

  hintSound() {
    this.ensure();
    this.tone(1046.5, 0, 0.15, 'sine', 0.14);
    this.tone(784, 0.1, 0.2, 'sine', 0.12);
  }

  click() {
    this.ensure();
    this.tone(660, 0, 0.06, 'triangle', 0.08);
  }

  win() {
    this.ensure();
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, i * 0.12, 0.35, 'sine', 0.2));
  }

  lose() {
    this.ensure();
    [392, 330, 262].forEach((f, i) => this.tone(f, i * 0.16, 0.3, 'triangle', 0.14));
  }

  startMusic() {
    if (!this.ctx || this.muted || this.musicTimer) return;
    this.musicTimer = window.setInterval(() => {
      const note = this.notes[this.musicStep % this.notes.length];
      this.tone(note, 0, 0.9, 'sine', 0.05);
      if (this.musicStep % 4 === 2) this.tone(note / 2, 0, 1.2, 'sine', 0.04);
      this.musicStep += 1;
    }, 620);
  }

  stopMusic() {
    if (this.musicTimer) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}
