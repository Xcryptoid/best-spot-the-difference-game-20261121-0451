// Harbour Lights — boot and the animation loop. The canvas keeps a fixed
// 1280x720 logical size and CSS scales it to the window; clicks are mapped back
// through the canvas bounding box. With ?shot=<name> the game renders one
// frozen, deterministic frame for screenshots instead of playing.
import { BEST_KEY, FIELD } from './config.js';
import { SoundBank } from './audio.js';
import { buttonAt, handleClick, handleKey } from './input.js';
import { render } from './render.js';
import { stageShot } from './shots.js';
import { freshState, SCREEN_WIN, tick } from './state.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');
const state = freshState();
const sounds = new SoundBank();

try {
  state.best = Number(window.localStorage.getItem(BEST_KEY) ?? 0) || 0;
} catch {
  state.best = 0;
}

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
let frozenNow = 1.0;
if (shot) {
  stageShot(shot, state);
  frozenNow = 1.0;
}

let hover = null;
let last = performance.now();
let lastStatus = '';

function logicalPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * FIELD.width,
    y: ((event.clientY - rect.top) / rect.height) * FIELD.height,
  };
}

canvas.addEventListener('click', (event) => {
  const point = logicalPoint(event);
  handleClick(state, point.x, point.y, performance.now() / 1000, sounds);
});

canvas.addEventListener('mousemove', (event) => {
  const point = logicalPoint(event);
  hover = buttonAt(state, point.x, point.y);
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') return;
  handleKey(state, event.key, performance.now() / 1000, sounds);
  event.preventDefault();
});

function frame(nowMs) {
  const now = shot ? frozenNow : nowMs / 1000;
  const dt = shot ? 0 : Math.min(0.1, (nowMs - last) / 1000);
  last = nowMs;
  const ranOut = tick(state, dt, now);
  if (ranOut) sounds.lose();
  if (state.screen === SCREEN_WIN && state.score > state.best) {
    state.best = state.score;
    try {
      window.localStorage.setItem(BEST_KEY, String(state.best));
    } catch {
      // Best score is a nicety; a blocked store must never break the game.
    }
  }
  render(ctx, state, now, hover);
  const text =
    state.screen === 'play'
      ? `${10 - state.found.size} differences left in scene ${state.round + 1}, ${Math.ceil(state.timeLeft)} seconds, score ${state.score}`
      : state.screen;
  if (text !== lastStatus) {
    status.textContent = text;
    lastStatus = text;
  }
  if (!shot) window.requestAnimationFrame(frame);
}

render(ctx, state, frozenNow, hover);
if (shot) {
  status.textContent = `staged shot ${shot}`;
} else {
  window.requestAnimationFrame(frame);
}
