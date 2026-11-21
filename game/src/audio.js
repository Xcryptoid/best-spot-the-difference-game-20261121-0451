// All sound is synthesised with WebAudio: no audio files, no network. A tiny
// step sequencer plays a soft music loop, and short blips mark finds, mistakes,
// hints and round ends. Audio starts only after the first user gesture, so the
// browser's autoplay policy is never fought.
const NOTE_FREQ = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
  C3: 130.81, F3: 174.61, G3: 196.0, A3: 220.0,
};

// A slow, gentle loop: a bass note on each bar and a wandering melody above it.
const MUSIC_BARS = [
  { bass: 'C3', melody: ['E4', 'G4', 'A4', 'G4'] },
  { bass: 'F3', melody: ['A4', 'C5', 'A4', 'F4'] },
  { bass: 'G3', melody: ['B4', 'D5', 'B4', 'G4'] },
  { bass: 'C3', melody: ['E4', 'G4', 'C5', 'E5'] },
];
const BAR_SECONDS = 2.4;

export class SoundBank {
  constructor() {
    this.ctx = null;
    this.musicGain = null;
    this.master = null;
    this.muted = false;
    this.musicTimer = null;
    this.barIndex = 0;
    this.started = false;
  }

  unlock() {
    if (this.started) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.12;
      this.musicGain.connect(this.master);
      this.started = true;
      this.startMusic();
    } catch {
      this.ctx = null;
    }
  }

  tone(freq, when, dur, type, vol, dest) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(vol, when + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, when + dur);
    osc.connect(gain);
    gain.connect(dest || this.master);
    osc.start(when);
    osc.stop(when + dur + 0.05);
  }

  blip(notes, type, vol, step) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime;
    notes.forEach((n, i) => this.tone(NOTE_FREQ[n], t0 + i * (step || 0.09), 0.28, type, vol));
  }

  find() { this.blip(['E5', 'G5', 'C5'], 'sine', 0.5, 0.07); }
  wrong() {
    if (!this.ctx || this.muted) return;
    this.tone(140, this.ctx.currentTime, 0.22, 'sawtooth', 0.22);
    this.tone(110, this.ctx.currentTime + 0.08, 0.25, 'sawtooth', 0.18);
  }
  hint() { this.blip(['A5', 'E5'], 'triangle', 0.4, 0.12); }
  clear() { this.blip(['C5', 'E5', 'G5', 'C5'], 'triangle', 0.45, 0.11); }
  win() { this.blip(['C5', 'E5', 'G5', 'C5', 'E5', 'G5'], 'sine', 0.5, 0.13); }
  lose() { this.blip(['G4', 'E4', 'C4'], 'triangle', 0.4, 0.16); }
  click() {
    if (!this.ctx || this.muted) return;
    this.tone(660, this.ctx.currentTime, 0.06, 'square', 0.12);
  }

  startMusic() {
    if (!this.ctx || this.musicTimer !== null) return;
    const playBar = () => {
      if (this.muted || !this.ctx) return;
      const bar = MUSIC_BARS[this.barIndex % MUSIC_BARS.length];
      this.barIndex += 1;
      const t0 = this.ctx.currentTime + 0.05;
      this.tone(NOTE_FREQ[bar.bass], t0, BAR_SECONDS * 0.9, 'sine', 0.5, this.musicGain);
      bar.melody.forEach((n, i) => {
        this.tone(NOTE_FREQ[n], t0 + (i * BAR_SECONDS) / 4, 0.5, 'triangle', 0.35, this.musicGain);
      });
    };
    playBar();
    this.musicTimer = window.setInterval(playBar, BAR_SECONDS * 1000);
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master) this.master.gain.value = muted ? 0 : 0.5;
  }
}
