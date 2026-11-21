// Harbour Lights — the game state machine: title, play, round clear, victory,
// time-up. Pure data and rules; rendering lives in render.js.
import { DIFFERENCES, FIND_POINTS, HINT_COOLDOWN, HINT_COST, ROUND_TIME, WRONG_POINTS, WRONG_TIME } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_ROUND = 'round';
export const SCREEN_WIN = 'win';
export const SCREEN_OVER = 'over';

export function freshState() {
  return {
    screen: SCREEN_TITLE,
    round: 0,
    score: 0,
    best: 0,
    found: new Set(),
    hinted: null,
    hintEndsAt: 0,
    hintReadyAt: 0,
    timeLeft: ROUND_TIME[0],
    wrongFlash: null,
    pop: null,
    muted: false,
    frozen: false,
    startedAt: 0,
    elapsed: 0,
    message: '',
    messageUntil: 0,
  };
}

export function roundDifferences(state) {
  return DIFFERENCES[state.round];
}

export function remainingCount(state) {
  return roundDifferences(state).length - state.found.size;
}

export function startRound(state, round) {
  state.round = round;
  state.screen = SCREEN_PLAY;
  state.found = new Set();
  state.hinted = null;
  state.hintReadyAt = 0;
  state.timeLeft = ROUND_TIME[round];
  state.wrongFlash = null;
  state.pop = null;
  state.message = '';
}

export function startGame(state) {
  state.score = 0;
  state.elapsed = 0;
  startRound(state, 0);
}

/** Apply a click at scene coordinates; returns 'found' | 'wrong' | 'already'. */
export function applyClick(state, diffIndex, now) {
  const diffs = roundDifferences(state);
  const diff = diffs[diffIndex];
  if (!diff) return 'wrong';
  if (state.found.has(diff.id)) return 'already';
  state.found.add(diff.id);
  state.score += FIND_POINTS;
  state.pop = { id: diff.id, x: diff.x, y: diff.y, until: now + 0.6 };
  if (state.found.size === diffs.length) {
    const bonus = Math.round(state.timeLeft) * 2;
    state.score += bonus;
    state.screen = state.round >= DIFFERENCES.length - 1 ? SCREEN_WIN : SCREEN_ROUND;
    state.message = `Round clear! Time bonus +${bonus}`;
    state.messageUntil = now + 3;
  }
  return 'found';
}

export function applyWrong(state, x, y, now) {
  state.score = Math.max(0, state.score - WRONG_POINTS);
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_TIME);
  state.wrongFlash = { x, y, until: now + 0.5 };
  return 'wrong';
}

/** Use a hint: highlights one unfound difference. Returns the diff or null. */
export function useHint(state, now) {
  if (state.screen !== SCREEN_PLAY) return null;
  if (now < state.hintReadyAt) return null;
  const unfound = roundDifferences(state).filter((d) => !state.found.has(d.id));
  if (unfound.length === 0) return null;
  const diff = unfound[0];
  state.hinted = { id: diff.id, x: diff.x, y: diff.y };
  state.hintEndsAt = now + 3;
  state.hintReadyAt = now + HINT_COOLDOWN;
  state.score = Math.max(0, state.score - HINT_COST);
  return diff;
}

/** Advance the clock by dt seconds; returns true when time just ran out. */
export function tick(state, dt, now) {
  if (state.screen !== SCREEN_PLAY || state.frozen) return false;
  state.timeLeft -= dt;
  state.elapsed += dt;
  if (state.hinted && now > state.hintEndsAt) state.hinted = null;
  if (state.pop && now > state.pop.until) state.pop = null;
  if (state.wrongFlash && now > state.wrongFlash.until) state.wrongFlash = null;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = SCREEN_OVER;
    return true;
  }
  return false;
}
