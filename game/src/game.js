// The game itself: one state machine, five scenes, twelve differences a scene.
// Two panels are drawn side by side from the same scene painter; the right one
// gets every difference applied. A click inside a difference's circle on either
// panel finds it. The header shows the score, the countdown and how many
// differences are still hidden. Nothing here reads the clock for logic except
// the countdown, which the render loop drives with its own delta time.
import { SCENES } from './scenes.js';
import { PANEL_W, PANEL_H, circle, ellipse, rect, roundRect, poly, line, label } from './art.js';
import { SoundBank } from './audio.js';

export const VIEW_W = 1280;
export const VIEW_H = 800;
const HEADER_H = 56;
const PANEL_X_LEFT = 16;
const PANEL_X_RIGHT = 648;
const PANEL_Y = 68;
const FIND_POINTS = 100;
const WRONG_POINTS = 15;
const WRONG_SECONDS = 3;
const HINT_POINTS = 25;
const HINT_COOLDOWN = 15;
const HINT_SHOW = 3;
const TIME_BONUS_PER_SECOND = 5;

export const HINT_BUTTON = { x: 1008, y: 10, w: 118, h: 36 };
export const MUTE_BUTTON = { x: 1136, y: 10, w: 56, h: 36 };
export const RESTART_BUTTON = { x: 1200, y: 10, w: 64, h: 36 };

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function pointInRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

export class Game {
  constructor() {
    this.sounds = new SoundBank();
    this.screen = 'title';
    this.sceneIndex = 0;
    this.found = new Set();
    this.foundAt = new Map();
    this.score = 0;
    this.roundScore = 0;
    this.timeLeft = SCENES[0].time;
    this.elapsed = 0;
    this.hintDiff = -1;
    this.hintUntil = 0;
    this.hintReadyAt = 0;
    this.wrongMarks = [];
    this.lastBonus = 0;
    this.totalFound = 0;
    this.muted = false;
  }

  get scene() { return SCENES[this.sceneIndex]; }
  get remaining() { return this.scene.diffs.length - this.found.size; }

  startGame() {
    this.sceneIndex = 0;
    this.score = 0;
    this.totalFound = 0;
    this.beginScene();
    this.screen = 'play';
  }

  beginScene() {
    this.found = new Set();
    this.foundAt = new Map();
    this.roundScore = 0;
    this.timeLeft = this.scene.time;
    this.hintDiff = -1;
    this.hintReadyAt = 0;
    this.wrongMarks = [];
  }

  advance() {
    if (this.screen === 'clear') {
      if (this.sceneIndex + 1 >= SCENES.length) {
        this.screen = 'win';
        this.sounds.win();
      } else {
        this.sceneIndex += 1;
        this.beginScene();
        this.screen = 'play';
      }
    } else if (this.screen === 'over') {
      // Retry the same world, keeping the score earned so far.
      this.beginScene();
      this.screen = 'play';
    } else if (this.screen === 'win') {
      this.startGame();
    }
  }

  click(px, py) {
    this.sounds.unlock();
    if (this.screen === 'title') {
      this.startGame();
      return;
    }
    if (pointInRect(px, py, HINT_BUTTON)) { this.useHint(); return; }
    if (pointInRect(px, py, MUTE_BUTTON)) { this.toggleMute(); return; }
    if (pointInRect(px, py, RESTART_BUTTON)) { this.startGame(); return; }
    if (this.screen === 'clear' || this.screen === 'over' || this.screen === 'win') {
      this.advance();
      return;
    }
    if (this.screen !== 'play') return;
    const panel = this.panelAt(px, py);
    if (!panel) {
      this.wrongClick(px, py);
      return;
    }
    const diff = this.diffAt(panel.lx, panel.ly);
    if (diff >= 0) this.findDiff(diff);
    else this.wrongClick(px, py);
  }

  panelAt(px, py) {
    if (py < PANEL_Y || py > PANEL_Y + PANEL_H) return null;
    if (px >= PANEL_X_LEFT && px <= PANEL_X_LEFT + PANEL_W) {
      return { lx: px - PANEL_X_LEFT, ly: py - PANEL_Y };
    }
    if (px >= PANEL_X_RIGHT && px <= PANEL_X_RIGHT + PANEL_W) {
      return { lx: px - PANEL_X_RIGHT, ly: py - PANEL_Y };
    }
    return null;
  }

  diffAt(lx, ly) {
    const diffs = this.scene.diffs;
    for (let i = 0; i < diffs.length; i += 1) {
      if (this.found.has(i)) continue;
      const d = diffs[i];
      const dx = lx - d.x;
      const dy = ly - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) return i;
    }
    return -1;
  }

  findDiff(i) {
    this.found.add(i);
    this.foundAt.set(i, this.elapsed);
    this.score += FIND_POINTS;
    this.roundScore += FIND_POINTS;
    this.totalFound += 1;
    this.sounds.find();
    if (this.hintDiff === i) this.hintDiff = -1;
    if (this.found.size === this.scene.diffs.length) {
      this.lastBonus = Math.ceil(this.timeLeft) * TIME_BONUS_PER_SECOND;
      this.score += this.lastBonus;
      this.screen = 'clear';
      this.sounds.clear();
    }
  }

  wrongClick(px, py) {
    this.score = Math.max(0, this.score - WRONG_POINTS);
    this.timeLeft = Math.max(0, this.timeLeft - WRONG_SECONDS);
    this.wrongMarks.push({ x: px, y: py, at: this.elapsed });
    this.sounds.wrong();
  }

  useHint() {
    if (this.screen !== 'play') return;
    if (this.elapsed < this.hintReadyAt) return;
    let target = -1;
    for (let i = 0; i < this.scene.diffs.length; i += 1) {
      if (!this.found.has(i)) { target = i; break; }
    }
    if (target < 0) return;
    this.score = Math.max(0, this.score - HINT_POINTS);
    this.hintDiff = target;
    this.hintUntil = this.elapsed + HINT_SHOW;
    this.hintReadyAt = this.elapsed + HINT_COOLDOWN;
    this.sounds.hint();
  }

  toggleMute() {
    this.muted = !this.muted;
    this.sounds.setMuted(this.muted);
  }

  tick(dt) {
    this.elapsed += dt;
    if (this.screen !== 'play') return;
    this.timeLeft -= dt;
    if (this.hintDiff >= 0 && this.elapsed > this.hintUntil) this.hintDiff = -1;
    this.wrongMarks = this.wrongMarks.filter((m) => this.elapsed - m.at < 0.7);
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.screen = 'over';
      this.sounds.lose();
    }
  }

  // -- rendering ------------------------------------------------------------

  render(ctx) {
    ctx.clearRect(0, 0, VIEW_W, VIEW_H);
    this.renderHeader(ctx);
    this.renderPanels(ctx);
    this.renderWrongMarks(ctx);
    if (this.screen === 'title') this.renderTitle(ctx);
    if (this.screen === 'clear') this.renderClear(ctx);
    if (this.screen === 'over') this.renderOver(ctx);
    if (this.screen === 'win') this.renderWin(ctx);
    this.renderFooter(ctx);
  }

  renderHeader(ctx) {
    rect(ctx, 0, 0, VIEW_W, HEADER_H, '#171b28');
    label(ctx, 'SPOT THE DIFFERENCE', 16, 30, 20, '#ffd76a', 'left');
    label(ctx, `SCENE ${this.sceneIndex + 1}/5 · ${this.scene.name}`, 470, 30, 15, '#e8ecff', 'center');
    label(ctx, `SCORE ${this.score}`, 700, 30, 17, '#ffffff', 'center');
    const low = this.timeLeft <= 30 && this.screen === 'play';
    label(ctx, formatTime(this.timeLeft), 830, 30, 22, low ? '#ff6a5e' : '#ffffff', 'center');
    label(ctx, `${this.remaining} LEFT`, 940, 30, 17, '#ffd76a', 'center');
    this.renderHeaderButton(ctx, HINT_BUTTON, `HINT ${this.elapsed < this.hintReadyAt ? Math.ceil(this.hintReadyAt - this.elapsed) + 's' : '−25'}`);
    this.renderHeaderButton(ctx, MUTE_BUTTON, this.muted ? 'MUTED' : 'SOUND');
    this.renderHeaderButton(ctx, RESTART_BUTTON, 'RESTART');
    // Scene progress dots.
    for (let i = 0; i < SCENES.length; i += 1) {
      const cx = 640 + i * 18;
      ctx.fillStyle = i < this.sceneIndex ? '#ffd76a' : i === this.sceneIndex ? '#ffffff' : '#3a4152';
      ctx.beginPath();
      ctx.arc(cx, 48, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  renderHeaderButton(ctx, b, text) {
    roundRect(ctx, b.x, b.y, b.w, b.h, 6, '#232838');
    ctx.strokeStyle = '#3a4152';
    ctx.lineWidth = 1;
    ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
    label(ctx, text, b.x + b.w / 2, b.y + b.h / 2 + 1, 12, '#e8ecff');
  }

  renderPanels(ctx) {
    this.renderPanel(ctx, PANEL_X_LEFT, false);
    this.renderPanel(ctx, PANEL_X_RIGHT, true);
  }

  renderPanel(ctx, x, varied) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, PANEL_Y, PANEL_W, PANEL_H);
    ctx.clip();
    ctx.translate(x, PANEL_Y);
    this.scene.paint(ctx);
    if (varied) {
      for (const d of this.scene.diffs) d.apply(ctx);
    }
    this.renderMarkers(ctx);
    ctx.restore();
    ctx.strokeStyle = '#3a4152';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, PANEL_Y + 1, PANEL_W - 2, PANEL_H - 2);
    label(ctx, varied ? 'RIGHT' : 'LEFT', x + PANEL_W - 44, PANEL_Y + 18, 12, 'rgba(232,236,255,0.75)', 'center');
  }

  renderMarkers(ctx) {
    // Found differences: a gold ring and a check on both panels.
    for (const i of this.found) {
      const d = this.scene.diffs[i];
      const age = this.elapsed - (this.foundAt.get(i) || 0);
      const pulse = age < 0.4 ? 1 + (0.4 - age) * 0.5 : 1;
      ctx.strokeStyle = '#ffd76a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = '#ffd76a';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(d.x - d.r * 0.45, d.y);
      ctx.lineTo(d.x - d.r * 0.12, d.y + d.r * 0.32);
      ctx.lineTo(d.x + d.r * 0.5, d.y - d.r * 0.32);
      ctx.stroke();
    }
    // Hint: a pulsing dashed ring on the hinted difference, both panels.
    if (this.hintDiff >= 0) {
      const d = this.scene.diffs[this.hintDiff];
      const pulse = 1 + 0.12 * Math.sin(this.elapsed * 8);
      ctx.strokeStyle = '#7dd8ff';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Wrong clicks are drawn in screen space, after the panels, because a miss
  // can land anywhere — on a panel, in the gap between them, or on the header.
  renderWrongMarks(ctx) {
    for (const m of this.wrongMarks) {
      const age = this.elapsed - m.at;
      const alpha = Math.max(0, 1 - age / 0.7);
      ctx.strokeStyle = `rgba(255,106,94,${alpha})`;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      const s = 12;
      ctx.beginPath();
      ctx.moveTo(m.x - s, m.y - s);
      ctx.lineTo(m.x + s, m.y + s);
      ctx.moveTo(m.x + s, m.y - s);
      ctx.lineTo(m.x - s, m.y + s);
      ctx.stroke();
    }
  }

  renderFooter(ctx) {
    label(ctx, 'Click a difference on either picture  ·  H hint (−25 pts, 15 s cooldown)  ·  R restart  ·  M mute', VIEW_W / 2, 786, 13, '#8d94a8');
  }

  overlay(ctx) {
    ctx.fillStyle = 'rgba(10,12,20,0.72)';
    ctx.fillRect(0, HEADER_H, VIEW_W, VIEW_H - HEADER_H);
  }

  renderTitle(ctx) {
    this.overlay(ctx);
    label(ctx, 'SPOT THE DIFFERENCE', VIEW_W / 2, 300, 54, '#ffd76a');
    label(ctx, 'FIVE WORLDS · SIXTY DIFFERENCES', VIEW_W / 2, 352, 20, '#e8ecff');
    label(ctx, 'Two pictures hang side by side. Twelve things changed between them.', VIEW_W / 2, 408, 17, '#c8cede');
    label(ctx, 'Find them all before the clock runs out — then the next world opens.', VIEW_W / 2, 434, 17, '#c8cede');
    label(ctx, 'A find is worth 100 points. A miss costs 15 points and 3 seconds.', VIEW_W / 2, 470, 15, '#8d94a8');
    label(ctx, 'H asks for a hint (−25 points). R restarts. M mutes the music.', VIEW_W / 2, 494, 15, '#8d94a8');
    label(ctx, 'CLICK TO BEGIN', VIEW_W / 2, 566, 22, '#ffffff');
  }

  renderClear(ctx) {
    this.overlay(ctx);
    label(ctx, 'ROUND CLEAR!', VIEW_W / 2, 320, 48, '#ffd76a');
    label(ctx, `${this.scene.name} — all 12 differences found`, VIEW_W / 2, 372, 18, '#e8ecff');
    label(ctx, `Finds ${this.roundScore} pts  +  time bonus ${this.lastBonus} pts`, VIEW_W / 2, 420, 17, '#c8cede');
    label(ctx, `Score ${this.score}`, VIEW_W / 2, 458, 22, '#ffffff');
    label(ctx, this.sceneIndex + 1 >= SCENES.length ? 'CLICK FOR THE FINALE' : 'CLICK FOR THE NEXT WORLD', VIEW_W / 2, 530, 18, '#ffd76a');
  }

  renderOver(ctx) {
    this.overlay(ctx);
    label(ctx, "TIME'S UP", VIEW_W / 2, 320, 48, '#ff6a5e');
    label(ctx, `${this.scene.name} — ${this.remaining} difference${this.remaining === 1 ? '' : 's'} still hidden`, VIEW_W / 2, 372, 18, '#e8ecff');
    label(ctx, `Score ${this.score}`, VIEW_W / 2, 420, 22, '#ffffff');
    label(ctx, 'CLICK OR PRESS R TO TRY THIS WORLD AGAIN', VIEW_W / 2, 500, 17, '#ffd76a');
  }

  renderWin(ctx) {
    this.overlay(ctx);
    label(ctx, 'YOU FOUND THEM ALL!', VIEW_W / 2, 300, 48, '#ffd76a');
    label(ctx, 'Sixty differences across five worlds — every last one.', VIEW_W / 2, 352, 18, '#e8ecff');
    label(ctx, `FINAL SCORE ${this.score}`, VIEW_W / 2, 420, 26, '#ffffff');
    label(ctx, 'CLICK TO PLAY AGAIN', VIEW_W / 2, 500, 18, '#ffd76a');
  }
}
