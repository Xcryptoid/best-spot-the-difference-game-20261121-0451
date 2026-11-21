// Harbour Lights — the staged screenshot scenes behind ?shot=start|play|near|win.
// Each one sets a fixed, deterministic game state (no timer running, no random
// choices) so the same query always renders the same frame.
import { DIFFERENCES } from './config.js';
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN, startRound } from './state.js';

function markFound(state, count) {
  const diffs = DIFFERENCES[state.round];
  state.found = new Set(diffs.slice(0, count).map((d) => d.id));
}

/**
 * Set `state` to the named scene and return the screen to draw.
 * start: title over the harbour scene. play: round 1 mid-hunt, 4 found, 6 left.
 * near: round 2 nearly done, 8 found, 2 left, clock nearly out. win: victory.
 */
export function stageShot(name, state) {
  state.frozen = true;
  if (name === 'play') {
    startRound(state, 0);
    markFound(state, 4);
    state.score = 400;
    state.timeLeft = 132;
    state.screen = SCREEN_PLAY;
    return;
  }
  if (name === 'near') {
    startRound(state, 1);
    markFound(state, 8);
    state.score = 1250;
    state.timeLeft = 47;
    state.screen = SCREEN_PLAY;
    return;
  }
  if (name === 'win') {
    startRound(state, 2);
    markFound(state, 10);
    state.score = 3420;
    state.elapsed = 372;
    state.best = 3420;
    state.screen = SCREEN_WIN;
    return;
  }
  if (name === 'over') {
    startRound(state, 0);
    markFound(state, 3);
    state.score = 285;
    state.timeLeft = 0;
    state.screen = SCREEN_OVER;
    return;
  }
  state.screen = SCREEN_TITLE;
  state.round = 0;
  state.score = 0;
  state.found = new Set();
}
