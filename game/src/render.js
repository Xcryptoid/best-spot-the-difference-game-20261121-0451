// Harbour Lights — everything drawn on the canvas: header HUD, the two picture
// panels, found-difference markers, pop and hint effects, and the title /
// round-clear / victory / time-up screens.
import {
  DIFFERENCES,
  FIELD,
  FONT,
  HINT_COOLDOWN,
  PALETTE,
  PANEL,
  PANEL_LEFT_X,
  PANEL_RIGHT_X,
  ROUND_TIME,
  SCENE,
  SCENE_BLURBS,
  SCENE_NAMES,
} from './config.js';
import { drawScene } from './scenes.js';
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_ROUND, SCREEN_TITLE, SCREEN_WIN, remainingCount } from './state.js';

export const BUTTONS = {
  hint: { x: 880, y: 14, w: 120, h: 44 },
  mute: { x: 1010, y: 14, w: 100, h: 44 },
  restart: { x: 1120, y: 14, w: 120, h: 44 },
  start: { x: 490, y: 520, w: 300, h: 64 },
  again: { x: 490, y: 500, w: 300, h: 64 },
  next: { x: 490, y: 500, w: 300, h: 64 },
};

const sceneCache = new Map();

function sceneCanvas(round, isRight) {
  const key = `${round}-${isRight ? 'r' : 'l'}`;
  let canvas = sceneCache.get(key);
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = SCENE.width;
    canvas.height = SCENE.height;
    drawScene(canvas.getContext('2d'), round, isRight);
    sceneCache.set(key, canvas);
  }
  return canvas;
}

function panelTransform(ctx, panelX) {
  ctx.save();
  ctx.translate(panelX, PANEL.y);
  ctx.scale(PANEL.width / SCENE.width, PANEL.height / SCENE.height);
}

function drawPanel(ctx, state, panelX, isRight) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(panelX, PANEL.y, PANEL.width, PANEL.height);
  ctx.clip();
  ctx.drawImage(sceneCanvas(state.round, isRight), panelX, PANEL.y, PANEL.width, PANEL.height);
  ctx.restore();
  ctx.strokeStyle = PALETTE.panelBorder;
  ctx.lineWidth = 3;
  ctx.strokeRect(panelX, PANEL.y, PANEL.width, PANEL.height);
  ctx.fillStyle = 'rgba(20,26,38,0.85)';
  ctx.fillRect(panelX + 8, PANEL.y + 8, 44, 26);
  ctx.fillStyle = PALETTE.text;
  ctx.font = `bold 16px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(isRight ? 'B' : 'A', panelX + 30, PANEL.y + 27);
  ctx.textAlign = 'left';
}

function drawMarker(ctx, panelX, x, y, r, now) {
  panelTransform(ctx, panelX);
  ctx.strokeStyle = PALETTE.foundRing;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, r + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.45, y);
  ctx.lineTo(x - r * 0.1, y + r * 0.4);
  ctx.lineTo(x + r * 0.5, y - r * 0.4);
  ctx.stroke();
  ctx.restore();
  void now;
}

function drawHintRing(ctx, panelX, diff, now) {
  const pulse = 1 + 0.18 * Math.sin(now * 8);
  panelTransform(ctx, panelX);
  ctx.strokeStyle = PALETTE.hintRing;
  ctx.lineWidth = 5;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(diff.x, diff.y, (diff.r + 8) * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawPop(ctx, panelX, pop, now) {
  const age = 0.6 - (pop.until - now);
  const frac = Math.min(1, Math.max(0, age / 0.6));
  panelTransform(ctx, panelX);
  ctx.strokeStyle = `rgba(255,217,77,${1 - frac})`;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(pop.x, pop.y, 20 + frac * 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawWrongFlash(ctx, panelX, flash, now) {
  panelTransform(ctx, panelX);
  const alpha = Math.max(0, (flash.until - now) / 0.5);
  ctx.strokeStyle = `rgba(255,107,94,${alpha})`;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  const s = 16;
  ctx.beginPath();
  ctx.moveTo(flash.x - s, flash.y - s);
  ctx.lineTo(flash.x + s, flash.y + s);
  ctx.moveTo(flash.x + s, flash.y - s);
  ctx.lineTo(flash.x - s, flash.y + s);
  ctx.stroke();
  ctx.restore();
}

function drawButton(ctx, rect, label, enabled, hover) {
  ctx.fillStyle = enabled ? (hover ? PALETTE.buttonHover : PALETTE.button) : '#3a4456';
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.w, rect.h, 10);
  ctx.fill();
  ctx.fillStyle = enabled ? '#fff' : PALETTE.muted;
  ctx.font = `bold 17px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 6);
  ctx.textAlign = 'left';
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function drawHeader(ctx, state, now, hover) {
  ctx.fillStyle = PALETTE.header;
  ctx.fillRect(0, 0, FIELD.width, 72);
  ctx.fillStyle = PALETTE.headerLine;
  ctx.fillRect(0, 72, FIELD.width, 2);
  ctx.fillStyle = PALETTE.accent;
  ctx.font = `bold 28px ${FONT}`;
  ctx.fillText('Harbour Lights', 20, 44);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `16px ${FONT}`;
  ctx.fillText(`Scene ${state.round + 1} of 3 · ${SCENE_NAMES[state.round]}`, 20, 64);

  if (state.screen === SCREEN_PLAY || state.screen === SCREEN_ROUND) {
    const left = remainingCount(state);
    ctx.fillStyle = left === 0 ? PALETTE.good : PALETTE.text;
    ctx.font = `bold 26px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(`${left} difference${left === 1 ? '' : 's'} left`, 640, 34);
    ctx.font = `18px ${FONT}`;
    ctx.fillStyle = PALETTE.muted;
    ctx.fillText(`${state.found.size} found · Score ${state.score}`, 640, 60);
    ctx.textAlign = 'left';
    const low = state.timeLeft <= 30;
    ctx.fillStyle = low ? PALETTE.bad : PALETTE.text;
    ctx.font = `bold 30px ${FONT}`;
    ctx.fillText(`⏱ ${formatTime(state.timeLeft)}`, 760, 46);
  }

  // The hint button only makes sense while a round is being played; on the
  // title, victory and time-up screens it stays out of the way.
  if (state.screen === SCREEN_PLAY || state.screen === SCREEN_ROUND) {
    const hintReady = now >= state.hintReadyAt && state.screen === SCREEN_PLAY;
    const hintLabel = hintReady ? '💡 Hint (H)' : `Hint ${Math.max(0, Math.ceil(state.hintReadyAt - now))}s`;
    drawButton(ctx, BUTTONS.hint, hintLabel, hintReady, hover === 'hint');
  }
  drawButton(ctx, BUTTONS.mute, state.muted ? '🔇 Muted' : '🔊 Sound', true, hover === 'mute');
  drawButton(ctx, BUTTONS.restart, '↻ Restart (R)', true, hover === 'restart');
}

function overlay(ctx, title, lines, buttonLabel, buttonKey, hover) {
  ctx.fillStyle = 'rgba(10,14,22,0.82)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.fillStyle = PALETTE.accent;
  ctx.font = `bold 46px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(title, FIELD.width / 2, 210);
  ctx.fillStyle = PALETTE.text;
  ctx.font = `21px ${FONT}`;
  lines.forEach((line, i) => ctx.fillText(line, FIELD.width / 2, 268 + i * 34));
  if (buttonLabel) {
    drawButton(ctx, BUTTONS[buttonKey], buttonLabel, true, hover === buttonKey);
    ctx.fillStyle = PALETTE.muted;
    ctx.font = `16px ${FONT}`;
    ctx.fillText('Press Enter to continue', FIELD.width / 2, BUTTONS[buttonKey].y + 96);
  }
  ctx.textAlign = 'left';
}

export function render(ctx, state, now, hover) {
  ctx.clearRect(0, 0, FIELD.width, FIELD.height);
  ctx.fillStyle = PALETTE.backdrop;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  drawHeader(ctx, state, now, hover);

  if (state.screen === SCREEN_TITLE) {
    drawPanel(ctx, state, PANEL_LEFT_X, false);
    drawPanel(ctx, state, PANEL_RIGHT_X, true);
    overlay(
      ctx,
      'Harbour Lights',
      [
        'A spot-the-difference hunt in three hand-drawn scenes.',
        'Click a difference on either picture to circle it. 10 per scene.',
        'Wrong clicks cost 15 points and 3 seconds. H costs 25 points.',
        'Find all ten before the timer runs out — then the next scene waits.',
      ],
      '▶  Start the hunt',
      'start',
      hover,
    );
    return;
  }

  drawPanel(ctx, state, PANEL_LEFT_X, false);
  drawPanel(ctx, state, PANEL_RIGHT_X, true);
  const diffs = DIFFERENCES[state.round];
  for (const diff of diffs) {
    if (!state.found.has(diff.id)) continue;
    drawMarker(ctx, PANEL_LEFT_X, diff.x, diff.y, diff.r, now);
    drawMarker(ctx, PANEL_RIGHT_X, diff.x, diff.y, diff.r, now);
  }
  if (state.hinted && now <= state.hintEndsAt) {
    drawHintRing(ctx, PANEL_LEFT_X, state.hinted, now);
    drawHintRing(ctx, PANEL_RIGHT_X, state.hinted, now);
  }
  if (state.pop && now <= state.pop.until) {
    drawPop(ctx, PANEL_LEFT_X, state.pop, now);
    drawPop(ctx, PANEL_RIGHT_X, state.pop, now);
  }
  if (state.wrongFlash && now <= state.wrongFlash.until) {
    const panelX = state.wrongFlash.panel === 'right' ? PANEL_RIGHT_X : PANEL_LEFT_X;
    drawWrongFlash(ctx, panelX, state.wrongFlash, now);
  }

  // Low-time warning strip.
  if (state.screen === SCREEN_PLAY && state.timeLeft <= 30) {
    ctx.fillStyle = 'rgba(255,107,94,0.9)';
    ctx.font = `bold 20px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('Hurry — the light is fading!', FIELD.width / 2, 706);
    ctx.textAlign = 'left';
  }

  if (state.screen === SCREEN_ROUND) {
    overlay(
      ctx,
      `Scene ${state.round + 1} clear!`,
      [
        state.message,
        `Score so far: ${state.score}`,
        `Next up: ${SCENE_NAMES[state.round + 1]} — ${SCENE_BLURBS[state.round + 1]}`,
      ],
      'Next scene  ▶',
      'next',
      hover,
    );
  } else if (state.screen === SCREEN_WIN) {
    const minutes = Math.floor(state.elapsed / 60);
    const seconds = Math.round(state.elapsed % 60);
    overlay(
      ctx,
      'You found them all!',
      [
        `All 30 differences, across three scenes. Final score: ${state.score}.`,
        `Finished in ${minutes}m ${String(seconds).padStart(2, '0')}s.`,
        state.score > state.best ? 'A new best score for this browser!' : `Best score on this browser: ${state.best}.`,
        'Thanks for playing Harbour Lights.',
      ],
      '↻  Play again',
      'again',
      hover,
    );
  } else if (state.screen === SCREEN_OVER) {
    overlay(
      ctx,
      'Time is up!',
      [
        `You found ${state.found.size} of 10 differences in ${SCENE_NAMES[state.round]}.`,
        `Score: ${state.score}. The unfound ones are still hiding — try again!`,
      ],
      '↻  Try this scene again',
      'again',
      hover,
    );
  }
  void ROUND_TIME;
}
