// Harbour Lights — mouse and keyboard input: maps a click on the canvas back to
// scene coordinates, finds the nearest unfound difference, and routes the
// header and overlay buttons.
import { DIFFERENCES, PANEL, PANEL_LEFT_X, PANEL_RIGHT_X, SCENE } from './config.js';
import { applyClick, applyWrong, SCREEN_OVER, SCREEN_PLAY, SCREEN_ROUND, SCREEN_TITLE, SCREEN_WIN, startGame, startRound, useHint } from './state.js';
import { BUTTONS } from './render.js';

function panelAt(x, y) {
  if (y < PANEL.y || y > PANEL.y + PANEL.height) return null;
  if (x >= PANEL_LEFT_X && x <= PANEL_LEFT_X + PANEL.width) return PANEL_LEFT_X;
  if (x >= PANEL_RIGHT_X && x <= PANEL_RIGHT_X + PANEL.width) return PANEL_RIGHT_X;
  return null;
}

function toScene(x, panelX, y) {
  return {
    x: ((x - panelX) / PANEL.width) * SCENE.width,
    y: ((y - PANEL.y) / PANEL.height) * SCENE.height,
  };
}

function inside(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

export function buttonAt(state, x, y) {
  if (inside(BUTTONS.hint, x, y)) return 'hint';
  if (inside(BUTTONS.mute, x, y)) return 'mute';
  if (inside(BUTTONS.restart, x, y)) return 'restart';
  if (state.screen === SCREEN_TITLE && inside(BUTTONS.start, x, y)) return 'start';
  if (state.screen === SCREEN_ROUND && inside(BUTTONS.next, x, y)) return 'next';
  if ((state.screen === SCREEN_WIN || state.screen === SCREEN_OVER) && inside(BUTTONS.again, x, y)) return 'again';
  return null;
}

/** Handle a click in logical 1280x720 coordinates. Returns a sound to play. */
export function handleClick(state, x, y, now, sounds) {
  const button = buttonAt(state, x, y);
  if (button === 'hint') {
    const diff = useHint(state, now);
    if (diff) sounds.hintSound();
    return;
  }
  if (button === 'mute') {
    state.muted = !state.muted;
    sounds.setMuted(state.muted);
    return;
  }
  if (button === 'restart') {
    startGame(state);
    sounds.click();
    return;
  }
  if (button === 'start') {
    startGame(state);
    sounds.ensure();
    sounds.startMusic();
    return;
  }
  if (button === 'next') {
    startRound(state, state.round + 1);
    sounds.click();
    return;
  }
  if (button === 'again') {
    if (state.screen === SCREEN_OVER) startRound(state, state.round);
    else startGame(state);
    sounds.click();
    return;
  }
  if (state.screen !== SCREEN_PLAY || state.frozen) return;

  const panelX = panelAt(x, y);
  if (panelX === null) return;
  const point = toScene(x, panelX, y);
  const diffs = DIFFERENCES[state.round];
  let best = -1;
  let bestDist = Infinity;
  for (let i = 0; i < diffs.length; i += 1) {
    const d = diffs[i];
    if (state.found.has(d.id)) continue;
    const dist = Math.hypot(point.x - d.x, point.y - d.y);
    if (dist < d.r + 10 && dist < bestDist) {
      best = i;
      bestDist = dist;
    }
  }
  if (best >= 0) {
    const result = applyClick(state, best, now);
    if (result === 'found') {
      sounds.chime();
      if (state.screen === SCREEN_WIN) sounds.win();
    }
  } else {
    applyWrong(state, point.x, point.y, now);
    state.wrongFlash.panel = panelX === PANEL_LEFT_X ? 'left' : 'right';
    sounds.wrong();
  }
}

/** Handle a key press. Returns true when the key did something. */
export function handleKey(state, key, now, sounds) {
  const k = key.toLowerCase();
  if (k === 'm') {
    state.muted = !state.muted;
    sounds.setMuted(state.muted);
    return true;
  }
  if (k === 'r') {
    startGame(state);
    return true;
  }
  if (k === 'h') {
    const diff = useHint(state, now);
    if (diff) sounds.hintSound();
    return true;
  }
  if (k === 'enter' || k === ' ') {
    if (state.screen === SCREEN_TITLE) {
      startGame(state);
      sounds.ensure();
      sounds.startMusic();
      return true;
    }
    if (state.screen === SCREEN_ROUND) {
      startRound(state, state.round + 1);
      return true;
    }
    if (state.screen === SCREEN_WIN) {
      startGame(state);
      return true;
    }
    if (state.screen === SCREEN_OVER) {
      startRound(state, state.round);
      return true;
    }
  }
  return false;
}
