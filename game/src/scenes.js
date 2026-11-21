// The five scenes. Each scene paints its base picture in panel space
// (616 x 700) and lists 12 differences. A difference is a spot on the picture
// plus an apply() that repaints that spot for the right-hand panel: it adds
// something, erases something by painting over it with the local background,
// or repaints it another colour. Everything is fixed coordinates, no random
// numbers, no clock: the same scene always paints the same pixels.
import {
  circle, ellipse, rect, roundRect, poly, line, sky, skyStops, stars, pine, label,
  softShadow, PANEL_W, PANEL_H,
} from './art.js';

// Paint a circle filled with the same vertical sky gradient the scene uses,
// so an erased star or bird leaves no trace. The stops must be the scene's
// own: a two-colour patch on the oasis dusk shows up as a grey smudge.
const OBS_SKY = [[0, '#0a1030'], [1, '#2a4d7f']];
const OASIS_SKY = [[0, '#2e2350'], [0.45, '#c65a6e'], [0.75, '#ff9a5c'], [1, '#ffd08a']];
const LODGE_SKY = [[0, '#9db8d8'], [1, '#e8f0f8']];
const REEF_SKY = [[0, '#0a4a7a'], [1, '#2a9ab5']];
const SHOP_SKY = [[0, '#c89a6a'], [1, '#8a5f36']];

function skyPatch(ctx, x, y, r, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function groundPatch(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ---------------------------------------------------------------------------
// Scene 1 — Moonlit Observatory. Easiest round: big, clear differences.
// ---------------------------------------------------------------------------
const OBS_STARS = [
  [60, 60, 2.5], [150, 60, 2], [210, 40, 1.8], [300, 70, 2.2], [380, 45, 1.6],
  [520, 55, 2], [560, 140, 1.8], [40, 150, 2], [120, 190, 1.6], [200, 130, 2],
  [260, 95, 1.5], [340, 150, 2.1], [420, 80, 1.7], [480, 190, 2], [540, 230, 1.6],
  [90, 250, 1.8], [180, 260, 1.5], [580, 300, 2], [30, 320, 1.7], [240, 210, 1.4],
  [410, 240, 1.6], [500, 280, 1.5], [70, 360, 1.8], [560, 360, 1.6],
];

function paintObservatory(ctx) {
  sky(ctx, '#0a1030', '#2a4d7f');
  stars(ctx, OBS_STARS, '#e8ecff');
  // Shooting star, top left.
  line(ctx, 88, 78, 150, 118, 'rgba(255,255,255,0.9)', 2.5);
  circle(ctx, 152, 120, 3.5, '#ffffff');
  // The moon and its craters.
  circle(ctx, 478, 108, 50, '#f5ecd2');
  circle(ctx, 462, 92, 9, '#d9cba6');
  circle(ctx, 494, 122, 12, '#d9cba6');
  circle(ctx, 470, 132, 6, '#d9cba6');
  // Rolling hills and ground.
  poly(ctx, [[0, 600], [140, 540], [300, 585], [460, 545], [616, 590], [616, 700], [0, 700]], '#12263f');
  rect(ctx, 0, 590, PANEL_W, 110, '#16351f');
  // Pine trees at both edges.
  pine(ctx, 70, 610, 150, false);
  pine(ctx, 552, 615, 130, true);
  // The observatory: white base, domed roof, slit and telescope.
  rect(ctx, 208, 470, 200, 122, '#e8e4d8');
  ctx.fillStyle = '#f2eee2';
  ctx.beginPath();
  ctx.arc(308, 470, 100, Math.PI, 0);
  ctx.fill();
  rect(ctx, 296, 382, 24, 92, '#22304a');
  line(ctx, 308, 402, 384, 318, '#c8ccd4', 15);
  circle(ctx, 386, 316, 11, '#9aa0ac');
  // Flag on the dome.
  line(ctx, 308, 372, 308, 330, '#5a4a32', 3);
  poly(ctx, [[308, 330], [342, 340], [308, 350]], '#d23c2e');
  // Round lit window and wooden door.
  circle(ctx, 258, 520, 14, '#ffd76a');
  circle(ctx, 258, 520, 14, 'rgba(255,215,106,0.25)');
  rect(ctx, 288, 530, 40, 62, '#6b4a2f');
  circle(ctx, 320, 562, 3, '#ffd76a');
  // Stone path from the door to the bottom edge.
  poly(ctx, [[288, 592], [328, 592], [362, 700], [254, 700]], '#8a7a5c');
  ellipse(ctx, 300, 620, 12, 7, '#6e6046');
  ellipse(ctx, 318, 655, 13, 7, '#6e6046');
  ellipse(ctx, 296, 685, 12, 7, '#6e6046');
  // Wooden fence, bottom left.
  line(ctx, 24, 622, 196, 622, '#4a3826', 5);
  line(ctx, 24, 646, 196, 646, '#4a3826', 5);
  for (const fx of [30, 70, 110, 150, 190]) rect(ctx, fx - 4, 606, 8, 52, '#5a4630');
  // Owl on a branch, left.
  line(ctx, 60, 312, 132, 296, '#4a3826', 5);
  ellipse(ctx, 96, 296, 15, 19, '#8a6f4d');
  circle(ctx, 96, 280, 11, '#8a6f4d');
  circle(ctx, 90, 278, 3.5, '#ffffff');
  circle(ctx, 102, 278, 3.5, '#ffffff');
  circle(ctx, 90, 278, 1.8, '#10131c');
  circle(ctx, 102, 278, 1.8, '#10131c');
  poly(ctx, [[88, 272], [84, 262], [94, 270]], '#8a6f4d');
  poly(ctx, [[104, 272], [108, 262], [98, 270]], '#8a6f4d');
  // Flower bush, bottom right.
  circle(ctx, 512, 648, 26, '#1d4a26');
  circle(ctx, 540, 658, 22, '#1d4a26');
  circle(ctx, 488, 660, 20, '#1d4a26');
  circle(ctx, 500, 636, 4, '#ff8fb0');
  circle(ctx, 528, 644, 4, '#ffd76a');
  circle(ctx, 544, 652, 4, '#ff8fb0');
  circle(ctx, 512, 656, 4, '#ffd76a');
  circle(ctx, 488, 648, 4, '#ff8fb0');
  // Cat sitting on the path.
  ellipse(ctx, 340, 652, 15, 12, '#3a3a44');
  circle(ctx, 340, 636, 9, '#3a3a44');
  poly(ctx, [[333, 630], [330, 620], [338, 628]], '#3a3a44');
  poly(ctx, [[347, 630], [350, 620], [342, 628]], '#3a3a44');
  line(ctx, 352, 656, 368, 646, '#3a3a44', 4);
}

const OBS_DIFFS = [
  {
    label: 'two extra craters on the moon', x: 478, y: 108, r: 42,
    apply(ctx) {
      circle(ctx, 486, 96, 7, '#d9cba6');
      circle(ctx, 462, 118, 5, '#d9cba6');
    },
  },
  {
    label: 'a star goes missing', x: 150, y: 60, r: 16,
    apply(ctx) { skyPatch(ctx, 150, 60, 8, OBS_SKY); },
  },
  {
    label: 'the telescope turns brass', x: 346, y: 360, r: 30,
    apply(ctx) {
      line(ctx, 308, 402, 384, 318, '#d9a441', 15);
      circle(ctx, 386, 316, 11, '#b57f2a');
    },
  },
  {
    label: 'the dome window goes dark', x: 258, y: 520, r: 20,
    apply(ctx) { circle(ctx, 258, 520, 14, '#2a3550'); },
  },
  {
    label: 'the owl flies away', x: 96, y: 292, r: 26,
    apply(ctx) {
      skyPatch(ctx, 96, 292, 26, OBS_SKY);
      line(ctx, 60, 312, 132, 296, '#4a3826', 5);
    },
  },
  {
    label: 'the left pine loses its top tier', x: 70, y: 472, r: 30,
    apply(ctx) {
      skyPatch(ctx, 70, 468, 34, OBS_SKY);
      poly(ctx, [[70, 500], [46, 540], [94, 540]], '#146b35');
    },
  },
  {
    label: 'an extra stone on the path', x: 306, y: 668, r: 14,
    apply(ctx) { ellipse(ctx, 306, 668, 12, 7, '#6e6046'); },
  },
  {
    label: 'a fence post goes missing', x: 150, y: 630, r: 16,
    apply(ctx) {
      groundPatch(ctx, 150, 630, 10, 26, '#16351f');
      line(ctx, 130, 622, 170, 622, '#4a3826', 5);
      line(ctx, 130, 646, 170, 646, '#4a3826', 5);
    },
  },
  {
    label: 'the shooting star is gone', x: 120, y: 100, r: 26,
    apply(ctx) { skyPatch(ctx, 120, 100, 30, OBS_SKY); },
  },
  {
    label: 'the dome flag turns teal', x: 325, y: 340, r: 18,
    apply(ctx) { poly(ctx, [[308, 330], [342, 340], [308, 350]], '#2e8f86'); },
  },
  {
    label: 'the bush loses its flowers', x: 518, y: 646, r: 26,
    apply(ctx) {
      circle(ctx, 500, 636, 5, '#1d4a26');
      circle(ctx, 528, 644, 5, '#1d4a26');
      circle(ctx, 544, 652, 5, '#1d4a26');
      circle(ctx, 512, 656, 5, '#1d4a26');
      circle(ctx, 488, 648, 5, '#1d4a26');
    },
  },
  {
    label: 'the cat wanders off', x: 340, y: 646, r: 24,
    apply(ctx) { groundPatch(ctx, 340, 646, 26, 18, '#8a7a5c'); },
  },
];

// ---------------------------------------------------------------------------
// Scene 2 — Desert Oasis at Dusk.
// ---------------------------------------------------------------------------
function paintOasis(ctx) {
  skyStops(ctx, OASIS_SKY);
  // Low sun with a soft glow.
  circle(ctx, 140, 170, 62, 'rgba(255,215,106,0.25)');
  circle(ctx, 140, 170, 44, '#ffd76a');
  // Birds.
  line(ctx, 292, 92, 302, 84, '#2e2350', 2.5);
  line(ctx, 302, 84, 312, 92, '#2e2350', 2.5);
  line(ctx, 352, 72, 362, 64, '#2e2350', 2.5);
  line(ctx, 362, 64, 372, 72, '#2e2350', 2.5);
  line(ctx, 412, 112, 422, 104, '#2e2350', 2.5);
  line(ctx, 422, 104, 432, 112, '#2e2350', 2.5);
  // Dunes.
  poly(ctx, [[0, 430], [160, 400], [340, 440], [500, 405], [616, 435], [616, 700], [0, 700]], '#d99a52');
  poly(ctx, [[0, 520], [180, 490], [380, 530], [616, 495], [616, 700], [0, 700]], '#e8b06a');
  // The oasis pond with ripples.
  ellipse(ctx, 430, 520, 122, 42, '#3f8fb5');
  ellipse(ctx, 430, 520, 104, 32, '#4aa8c8');
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(430, 516, 62, 14, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(430, 528, 34, 8, 0, 0, Math.PI * 2); ctx.stroke();
  // Palm trees.
  line(ctx, 120, 480, 128, 380, '#6e4a26', 9);
  for (const [fx, fy, tx, ty] of [[128, 380, 70, 350], [128, 380, 100, 330], [128, 380, 128, 322], [128, 380, 158, 336], [128, 380, 186, 356]]) {
    line(ctx, fx, fy, tx, ty, '#2e7d32', 6);
  }
  line(ctx, 520, 452, 514, 372, '#6e4a26', 8);
  for (const [fx, fy, tx, ty] of [[514, 372, 466, 346], [514, 372, 496, 330], [514, 372, 530, 328], [514, 372, 560, 344]]) {
    line(ctx, fx, fy, tx, ty, '#2e7d32', 5);
  }
  // Red tent with a pole and a lit lantern.
  poly(ctx, [[170, 500], [250, 380], [330, 500]], '#c0392b');
  poly(ctx, [[232, 500], [250, 452], [268, 500]], '#7a2418');
  line(ctx, 250, 380, 250, 344, '#5a4630', 5);
  circle(ctx, 250, 356, 14, 'rgba(255,215,106,0.35)');
  roundRect(ctx, 242, 348, 16, 20, 4, '#ffd76a');
  // Camel with one hump.
  ellipse(ctx, 330, 580, 52, 30, '#a97c50');
  circle(ctx, 330, 556, 20, '#a97c50');
  line(ctx, 372, 566, 396, 520, '#a97c50', 16);
  circle(ctx, 400, 512, 11, '#a97c50');
  line(ctx, 292, 606, 292, 648, '#a97c50', 8);
  line(ctx, 312, 606, 312, 648, '#a97c50', 8);
  line(ctx, 348, 606, 348, 648, '#a97c50', 8);
  line(ctx, 368, 606, 368, 648, '#a97c50', 8);
  circle(ctx, 404, 508, 2.5, '#10131c');
  // Cactus with one arm.
  roundRect(ctx, 552, 540, 18, 90, 9, '#3f7d44');
  line(ctx, 552, 580, 528, 580, '#3f7d44', 9);
  line(ctx, 528, 580, 528, 552, '#3f7d44', 9);
  // Rocks on the sand.
  ellipse(ctx, 180, 640, 16, 9, '#9a8a76');
  ellipse(ctx, 90, 660, 12, 7, '#9a8a76');
  ellipse(ctx, 470, 640, 13, 8, '#9a8a76');
}

const OASIS_DIFFS = [
  {
    label: 'the sun shrinks', x: 140, y: 170, r: 40,
    apply(ctx) {
      skyPatch(ctx, 140, 170, 60, OASIS_SKY);
      circle(ctx, 140, 170, 44, 'rgba(255,215,106,0.25)');
      circle(ctx, 140, 170, 30, '#ffd76a');
    },
  },
  {
    label: 'the tall palm loses a frond', x: 100, y: 330, r: 26,
    apply(ctx) { skyPatch(ctx, 100, 330, 22, OASIS_SKY); },
  },
  {
    label: 'the camel grows a second hump', x: 352, y: 552, r: 26,
    apply(ctx) { circle(ctx, 356, 554, 17, '#a97c50'); },
  },
  {
    label: 'a fish appears in the pond', x: 430, y: 520, r: 24,
    apply(ctx) {
      ellipse(ctx, 430, 520, 14, 7, '#ff8c42');
      poly(ctx, [[444, 520], [454, 514], [454, 526]], '#ff8c42');
      circle(ctx, 424, 518, 1.8, '#10131c');
    },
  },
  {
    label: 'the tent turns green', x: 250, y: 440, r: 40,
    apply(ctx) {
      poly(ctx, [[170, 500], [250, 380], [330, 500]], '#2e7d4f');
      poly(ctx, [[232, 500], [250, 452], [268, 500]], '#1d5233');
    },
  },
  {
    label: 'the cactus grows a right arm', x: 578, y: 566, r: 24,
    apply(ctx) {
      line(ctx, 570, 580, 592, 580, '#3f7d44', 9);
      line(ctx, 592, 580, 592, 556, '#3f7d44', 9);
    },
  },
  {
    label: 'a bird flies away', x: 362, y: 68, r: 18,
    apply(ctx) { skyPatch(ctx, 362, 68, 16, OASIS_SKY); },
  },
  {
    label: 'a star appears in the dusk', x: 500, y: 90, r: 14,
    apply(ctx) {
      circle(ctx, 500, 90, 3, '#ffffff');
      line(ctx, 492, 90, 508, 90, '#ffffff', 1.5);
      line(ctx, 500, 82, 500, 98, '#ffffff', 1.5);
    },
  },
  {
    label: 'a rock vanishes from the sand', x: 180, y: 640, r: 16,
    apply(ctx) { groundPatch(ctx, 180, 640, 18, 10, '#e8b06a'); },
  },
  {
    label: 'a third ripple on the pond', x: 430, y: 534, r: 26,
    apply(ctx) {
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(430, 538, 82, 20, 0, 0, Math.PI * 2); ctx.stroke();
    },
  },
  {
    label: 'the lantern goes out', x: 250, y: 358, r: 18,
    apply(ctx) {
      skyPatch(ctx, 250, 358, 16, OASIS_SKY);
      roundRect(ctx, 242, 348, 16, 20, 4, '#8a8a8a');
    },
  },
  {
    label: 'a snake crosses the sand', x: 420, y: 650, r: 22,
    apply(ctx) {
      ctx.strokeStyle = '#6e4a26';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(398, 650);
      ctx.quadraticCurveTo(410, 640, 420, 650);
      ctx.quadraticCurveTo(430, 660, 442, 650);
      ctx.stroke();
      circle(ctx, 444, 650, 4, '#6e4a26');
    },
  },
];

export const SCENES_PART1 = [
  { id: 1, name: 'Moonlit Observatory', time: 150, paint: paintObservatory, diffs: OBS_DIFFS },
  { id: 2, name: 'Desert Oasis at Dusk', time: 150, paint: paintOasis, diffs: OASIS_DIFFS },
];

// ---------------------------------------------------------------------------
// Scene 3 — Snowy Mountain Lodge.
// ---------------------------------------------------------------------------
function paintLodge(ctx) {
  sky(ctx, '#9db8d8', '#e8f0f8');
  // Snow-capped mountains.
  poly(ctx, [[0, 340], [150, 150], [300, 340]], '#7a8fa8');
  poly(ctx, [[120, 340], [170, 210], [220, 260], [260, 340]], '#ffffff');
  poly(ctx, [[330, 340], [470, 130], [616, 340]], '#6a7f96');
  poly(ctx, [[440, 340], [470, 180], [500, 230], [520, 340]], '#ffffff');
  rect(ctx, 0, 340, PANEL_W, 360, '#eef3f8');
  // Pine trees with snow.
  pine(ctx, 80, 520, 130, true);
  poly(ctx, [[80, 400], [58, 440], [102, 440]], '#ffffff');
  pine(ctx, 540, 530, 120, false);
  poly(ctx, [[540, 420], [520, 455], [560, 455]], '#ffffff');
  // The lodge: timber walls, snowy roof, chimney with smoke.
  rect(ctx, 200, 430, 220, 150, '#7a5230');
  poly(ctx, [[180, 430], [310, 350], [440, 430]], '#ffffff');
  poly(ctx, [[180, 430], [310, 350], [440, 430], [440, 442], [180, 442]], '#dfe9f2');
  rect(ctx, 360, 372, 26, 60, '#8a6a4a');
  circle(ctx, 373, 356, 9, '#e8e8e8');
  circle(ctx, 373, 336, 7, '#e8e8e8');
  circle(ctx, 373, 318, 5, '#e8e8e8');
  // Lit windows and the door with a wreath.
  rect(ctx, 224, 470, 40, 44, '#ffd76a');
  line(ctx, 244, 470, 244, 514, '#7a5230', 3);
  line(ctx, 224, 492, 264, 492, '#7a5230', 3);
  rect(ctx, 356, 470, 40, 44, '#ffd76a');
  line(ctx, 376, 470, 376, 514, '#7a5230', 3);
  rect(ctx, 288, 500, 44, 80, '#4a3220');
  circle(ctx, 310, 540, 13, '#2e7d32');
  circle(ctx, 310, 540, 6, '#4a3220');
  circle(ctx, 310, 528, 2.5, '#d23c2e');
  // Icicles along the roof edge.
  for (const ix of [210, 250, 330, 400]) {
    poly(ctx, [[ix, 442], [ix + 8, 442], [ix + 4, 470]], '#bcd8f0');
  }
  // Snowman with a black hat and carrot nose.
  circle(ctx, 470, 610, 26, '#ffffff');
  circle(ctx, 470, 566, 19, '#ffffff');
  circle(ctx, 470, 534, 14, '#ffffff');
  rect(ctx, 458, 512, 24, 12, '#1c1c1c');
  rect(ctx, 452, 522, 36, 5, '#1c1c1c');
  poly(ctx, [[484, 534], [506, 538], [484, 542]], '#e07830');
  circle(ctx, 465, 530, 2.5, '#1c1c1c');
  circle(ctx, 475, 530, 2.5, '#1c1c1c');
  rect(ctx, 452, 552, 36, 7, '#c0392b');
  // Crossed skis stuck in the snow.
  line(ctx, 120, 640, 180, 600, '#c0392b', 7);
  line(ctx, 180, 640, 120, 600, '#2e5fa3', 7);
  // Frozen pond with skate marks.
  ellipse(ctx, 150, 690, 90, 16, '#a8c8e0');
  line(ctx, 110, 688, 190, 692, 'rgba(255,255,255,0.7)', 2);
  line(ctx, 130, 696, 170, 684, 'rgba(255,255,255,0.5)', 2);
  // Sled leaning on the lodge wall.
  line(ctx, 428, 560, 452, 620, '#a33c2a', 7);
  line(ctx, 420, 590, 460, 590, '#a33c2a', 5);
  // Woodpile.
  for (let i = 0; i < 6; i += 1) {
    circle(ctx, 160 + (i % 3) * 20, 560 + Math.floor(i / 3) * 16, 9, '#8a6a4a');
    circle(ctx, 160 + (i % 3) * 20, 560 + Math.floor(i / 3) * 16, 5, '#d9b48a');
  }
  // Footprints in the snow.
  ellipse(ctx, 250, 640, 6, 9, '#c8d8e8');
  ellipse(ctx, 262, 660, 6, 9, '#c8d8e8');
  ellipse(ctx, 250, 680, 6, 9, '#c8d8e8');
  // A small bird on the chimney.
  ellipse(ctx, 373, 348, 8, 6, '#3a4a5a');
  circle(ctx, 379, 344, 4, '#3a4a5a');
}

const LODGE_DIFFS = [
  {
    label: 'the chimney loses a smoke puff', x: 373, y: 336, r: 16,
    apply(ctx) { skyPatch(ctx, 373, 336, 9, LODGE_SKY); },
  },
  {
    label: 'the snowman hat turns red', x: 470, y: 517, r: 20,
    apply(ctx) {
      rect(ctx, 458, 512, 24, 12, '#c0392b');
      rect(ctx, 452, 522, 36, 5, '#c0392b');
    },
  },
  {
    label: 'the carrot nose is gone', x: 494, y: 538, r: 14,
    apply(ctx) { circle(ctx, 494, 538, 9, '#ffffff'); },
  },
  {
    label: 'the wreath moves to the window', x: 310, y: 540, r: 20,
    apply(ctx) {
      circle(ctx, 310, 540, 14, '#4a3220');
      circle(ctx, 376, 492, 13, '#2e7d32');
      circle(ctx, 376, 492, 6, '#ffd76a');
      circle(ctx, 376, 480, 2.5, '#d23c2e');
    },
  },
  {
    label: 'the skis lie parallel', x: 150, y: 620, r: 26,
    apply(ctx) {
      groundPatch(ctx, 150, 620, 40, 24, '#eef3f8');
      line(ctx, 118, 632, 182, 632, '#c0392b', 7);
      line(ctx, 118, 648, 182, 648, '#2e5fa3', 7);
    },
  },
  {
    label: 'one window goes dark', x: 376, y: 492, r: 20,
    apply(ctx) {
      rect(ctx, 356, 470, 40, 44, '#2a3550');
      line(ctx, 376, 470, 376, 514, '#7a5230', 3);
    },
  },
  {
    label: 'the pine loses its ornaments', x: 80, y: 470, r: 26,
    apply(ctx) {
      circle(ctx, 62, 470, 4, '#0e3d24');
      circle(ctx, 92, 486, 4, '#0e3d24');
      circle(ctx, 76, 500, 4, '#0e3d24');
    },
  },
  {
    label: 'the sled is gone', x: 440, y: 590, r: 24,
    apply(ctx) { groundPatch(ctx, 440, 590, 26, 36, '#eef3f8'); },
  },
  {
    label: 'an icicle melts away', x: 334, y: 456, r: 14,
    apply(ctx) { groundPatch(ctx, 334, 456, 9, 15, '#dfe9f2'); },
  },
  {
    label: 'the footprints fade', x: 256, y: 660, r: 22,
    apply(ctx) {
      ellipse(ctx, 250, 640, 7, 10, '#eef3f8');
      ellipse(ctx, 262, 660, 7, 10, '#eef3f8');
      ellipse(ctx, 250, 680, 7, 10, '#eef3f8');
    },
  },
  {
    label: 'one log leaves the woodpile', x: 200, y: 576, r: 14,
    apply(ctx) { groundPatch(ctx, 200, 576, 11, 11, '#eef3f8'); },
  },
  {
    label: 'the chimney bird flies off', x: 374, y: 346, r: 14,
    apply(ctx) { skyPatch(ctx, 374, 346, 11, LODGE_SKY); },
  },
];

// ---------------------------------------------------------------------------
// Scene 4 — Underwater Coral Reef.
// ---------------------------------------------------------------------------
function paintReef(ctx) {
  sky(ctx, '#0a4a7a', '#2a9ab5');
  // Light rays from the surface.
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  poly(ctx, [[120, 0], [170, 0], [90, 420], [40, 420]], 'rgba(255,255,255,0.14)');
  poly(ctx, [[300, 0], [330, 0], [300, 420], [260, 420]], 'rgba(255,255,255,0.14)');
  poly(ctx, [[470, 0], [495, 0], [520, 420], [480, 420]], 'rgba(255,255,255,0.14)');
  // Sandy bottom.
  rect(ctx, 0, 620, PANEL_W, 80, '#e0c48f');
  // Coral: pink branches, orange fan, purple tubes.
  line(ctx, 90, 620, 90, 520, '#e86a8a', 10);
  line(ctx, 90, 560, 60, 520, '#e86a8a', 7);
  line(ctx, 90, 550, 122, 510, '#e86a8a', 7);
  line(ctx, 90, 530, 76, 496, '#e86a8a', 6);
  circle(ctx, 60, 518, 6, '#e86a8a');
  circle(ctx, 122, 508, 6, '#e86a8a');
  ellipse(ctx, 480, 580, 46, 40, '#ff8c42');
  line(ctx, 480, 620, 480, 540, '#e07830', 6);
  rect(ctx, 540, 560, 12, 60, '#8a5fc0');
  rect(ctx, 562, 548, 12, 72, '#8a5fc0');
  circle(ctx, 546, 556, 7, '#a87ed8');
  circle(ctx, 568, 544, 7, '#a87ed8');
  // Seaweed stalks.
  line(ctx, 210, 620, 200, 540, '#2e7d32', 7);
  line(ctx, 232, 620, 240, 552, '#2e7d32', 7);
  line(ctx, 254, 620, 250, 566, '#2e7d32', 7);
  // A school of five small fish.
  for (const [fx, fy] of [[180, 180], [230, 200], [280, 170], [330, 200], [380, 180]]) {
    ellipse(ctx, fx, fy, 16, 8, '#ffd76a');
    poly(ctx, [[fx + 14, fy], [fx + 26, fy - 7], [fx + 26, fy + 7]], '#ffd76a');
    circle(ctx, fx - 6, fy - 2, 2, '#10131c');
  }
  // Sea turtle swimming left.
  ellipse(ctx, 420, 300, 46, 28, '#3f7d44');
  ellipse(ctx, 420, 300, 34, 19, '#6abf69');
  circle(ctx, 368, 296, 12, '#3f7d44');
  ellipse(ctx, 396, 322, 14, 7, '#2e6b30');
  ellipse(ctx, 444, 322, 14, 7, '#2e6b30');
  ellipse(ctx, 448, 282, 12, 6, '#2e6b30');
  circle(ctx, 364, 294, 2.5, '#10131c');
  // Diver with a yellow tank.
  ellipse(ctx, 250, 420, 34, 16, '#2e5fa3');
  circle(ctx, 222, 412, 11, '#e8b06a');
  rect(ctx, 244, 396, 12, 26, '#ffd76a');
  line(ctx, 282, 424, 308, 440, '#2e5fa3', 8);
  line(ctx, 282, 424, 306, 412, '#2e5fa3', 8);
  circle(ctx, 224, 410, 5, '#9fd8ef');
  // Treasure chest, open, gold spilling out.
  rect(ctx, 500, 640, 64, 34, '#6e4a26');
  poly(ctx, [[500, 640], [564, 640], [556, 612], [508, 612]], '#8a5f36');
  circle(ctx, 512, 634, 5, '#ffd76a');
  circle(ctx, 530, 630, 5, '#ffd76a');
  circle(ctx, 548, 636, 5, '#ffd76a');
  // Starfish on the sand.
  circle(ctx, 140, 660, 12, '#ff8c42');
  poly(ctx, [[140, 648], [144, 658], [154, 658], [146, 664], [149, 674], [140, 668], [131, 674], [134, 664], [126, 658], [136, 658]], '#ff8c42');
  // Clam, open, with a pearl.
  ellipse(ctx, 330, 660, 24, 10, '#d8c8e8');
  ellipse(ctx, 330, 650, 24, 8, '#e8dcf2');
  circle(ctx, 330, 652, 6, '#ffffff');
  // Bubbles rising.
  for (const [bx, by, br] of [[300, 380, 6], [320, 350, 5], [310, 320, 4], [340, 290, 5], [330, 260, 4], [350, 230, 3]]) {
    circle(ctx, bx, by, br, 'rgba(255,255,255,0.5)');
  }
}

const REEF_DIFFS = [
  {
    label: 'the turtle turns around', x: 368, y: 296, r: 22,
    apply(ctx) {
      skyPatch(ctx, 368, 296, 15, REEF_SKY);
      circle(ctx, 472, 296, 12, '#3f7d44');
      circle(ctx, 476, 294, 2.5, '#10131c');
    },
  },
  {
    label: 'one fish leaves the school', x: 280, y: 170, r: 20,
    apply(ctx) { skyPatch(ctx, 280, 170, 22, REEF_SKY); },
  },
  {
    label: 'the treasure chest closes', x: 532, y: 626, r: 26,
    apply(ctx) {
      rect(ctx, 500, 612, 64, 28, '#8a5f36');
      rect(ctx, 528, 622, 8, 18, '#ffd76a');
      groundPatch(ctx, 512, 634, 6, 6, '#e0c48f');
      groundPatch(ctx, 530, 630, 6, 6, '#e0c48f');
      groundPatch(ctx, 548, 636, 6, 6, '#e0c48f');
    },
  },
  {
    label: 'the starfish turns pink', x: 140, y: 662, r: 18,
    apply(ctx) {
      circle(ctx, 140, 660, 12, '#ff8fb0');
      poly(ctx, [[140, 648], [144, 658], [154, 658], [146, 664], [149, 674], [140, 668], [131, 674], [134, 664], [126, 658], [136, 658]], '#ff8fb0');
    },
  },
  {
    label: 'a bubble pops', x: 340, y: 290, r: 14,
    apply(ctx) { skyPatch(ctx, 340, 290, 8, REEF_SKY); },
  },
  {
    label: 'the pink coral grows a branch', x: 108, y: 512, r: 20,
    apply(ctx) {
      line(ctx, 90, 545, 116, 508, '#e86a8a', 6);
      circle(ctx, 118, 506, 6, '#e86a8a');
    },
  },
  {
    label: 'the diver tank turns red', x: 250, y: 409, r: 18,
    apply(ctx) { rect(ctx, 244, 396, 12, 26, '#c0392b'); },
  },
  {
    label: 'the clam snaps shut', x: 330, y: 654, r: 20,
    apply(ctx) {
      ellipse(ctx, 330, 660, 24, 10, '#d8c8e8');
      ellipse(ctx, 330, 652, 24, 7, '#c8b8d8');
    },
  },
  {
    label: 'a seaweed stalk is gone', x: 238, y: 586, r: 20,
    apply(ctx) {
      skyPatch(ctx, 238, 586, 20, REEF_SKY);
      groundPatch(ctx, 240, 614, 8, 8, '#e0c48f');
    },
  },
  {
    label: 'a seahorse drifts in', x: 180, y: 460, r: 22,
    apply(ctx) {
      ctx.strokeStyle = '#e8b06a';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(180, 462, 12, Math.PI * 0.4, Math.PI * 1.8);
      ctx.stroke();
      circle(ctx, 190, 446, 6, '#e8b06a');
      line(ctx, 194, 442, 202, 438, '#e8b06a', 3);
    },
  },
  {
    label: 'an anchor rests on the sand', x: 420, y: 660, r: 22,
    apply(ctx) {
      line(ctx, 420, 636, 420, 668, '#3a4a5a', 5);
      line(ctx, 402, 648, 438, 648, '#3a4a5a', 5);
      circle(ctx, 420, 634, 5, '#3a4a5a');
      line(ctx, 404, 668, 414, 660, '#3a4a5a', 4);
      line(ctx, 436, 668, 426, 660, '#3a4a5a', 4);
    },
  },
  {
    label: 'one light ray fades', x: 315, y: 200, r: 24,
    apply(ctx) { skyPatch(ctx, 315, 200, 26, REEF_SKY); },
  },
];

// ---------------------------------------------------------------------------
// Scene 5 — Clockwork Toy Workshop. Hardest round: small, subtle differences.
// ---------------------------------------------------------------------------
function paintWorkshop(ctx) {
  sky(ctx, '#c89a6a', '#8a5f36');
  rect(ctx, 0, 560, PANEL_W, 140, '#6e4a26');
  // Window with a crescent moon.
  rect(ctx, 440, 60, 130, 150, '#22304a');
  rect(ctx, 448, 68, 114, 134, '#2a3d5e');
  line(ctx, 505, 68, 505, 202, '#22304a', 5);
  line(ctx, 448, 135, 562, 135, '#22304a', 5);
  circle(ctx, 530, 100, 22, '#f5ecd2');
  circle(ctx, 538, 96, 19, '#2a3d5e');
  // Wall gears.
  for (const [gx, gy, gr, col] of [[120, 130, 34, '#d9a441'], [190, 110, 26, '#c8ccd4'], [90, 210, 24, '#b57f2a'], [170, 190, 20, '#d9a441']]) {
    circle(ctx, gx, gy, gr, col);
    circle(ctx, gx, gy, gr * 0.45, '#8a5f36');
    for (let t = 0; t < 8; t += 1) {
      const a = (t / 8) * Math.PI * 2;
      circle(ctx, gx + Math.cos(a) * gr, gy + Math.sin(a) * gr, 5, col);
    }
  }
  // Shelves with toys.
  rect(ctx, 40, 300, 220, 12, '#5a3a22');
  rect(ctx, 40, 430, 220, 12, '#5a3a22');
  circle(ctx, 90, 272, 20, '#e86a8a');
  circle(ctx, 90, 258, 12, '#e86a8a');
  circle(ctx, 84, 256, 2.5, '#10131c');
  circle(ctx, 96, 256, 2.5, '#10131c');
  rect(ctx, 140, 250, 34, 34, '#2e5fa3');
  rect(ctx, 140, 250, 34, 12, '#e8e4d8');
  circle(ctx, 220, 280, 18, '#d23c2e');
  // Toy blocks spelling TOY on the lower shelf.
  for (const [bx, ch] of [[70, 'T'], [110, 'O'], [150, 'Y']]) {
    rect(ctx, bx, 396, 32, 32, '#e8b06a');
    label(ctx, ch, bx + 16, 414, 22, '#3a2a1a');
  }
  rect(ctx, 200, 400, 30, 28, '#2e7d32');
  // Workbench with a lamp, a wrench and a teddy bear.
  rect(ctx, 280, 540, 300, 20, '#5a3a22');
  rect(ctx, 290, 560, 12, 100, '#4a3220');
  rect(ctx, 558, 560, 12, 100, '#4a3220');
  circle(ctx, 330, 520, 18, 'rgba(255,215,106,0.35)');
  line(ctx, 330, 540, 330, 500, '#3a3a3a', 5);
  circle(ctx, 330, 492, 12, '#ffd76a');
  // Teddy bear with a red bow.
  ellipse(ctx, 420, 500, 26, 22, '#a97c50');
  circle(ctx, 420, 472, 16, '#a97c50');
  circle(ctx, 406, 460, 6, '#a97c50');
  circle(ctx, 434, 460, 6, '#a97c50');
  circle(ctx, 414, 470, 2.5, '#10131c');
  circle(ctx, 426, 470, 2.5, '#10131c');
  poly(ctx, [[420, 486], [410, 494], [420, 500], [430, 494]], '#d23c2e');
  // Rocking horse facing left.
  ellipse(ctx, 510, 500, 30, 16, '#8a5f36');
  circle(ctx, 482, 486, 11, '#8a5f36');
  line(ctx, 482, 478, 472, 468, '#8a5f36', 6);
  line(ctx, 540, 516, 480, 516, '#5a3a22', 6);
  line(ctx, 486, 516, 480, 528, '#5a3a22', 5);
  line(ctx, 534, 516, 540, 528, '#5a3a22', 5);
  // Cuckoo clock on the wall.
  rect(ctx, 300, 120, 90, 110, '#6e4a26');
  poly(ctx, [[292, 120], [345, 84], [398, 120]], '#6e4a26');
  circle(ctx, 345, 160, 30, '#f5ecd2');
  line(ctx, 345, 160, 345, 138, '#1c1c1c', 3);
  line(ctx, 345, 160, 362, 160, '#1c1c1c', 3);
  circle(ctx, 345, 160, 3, '#1c1c1c');
  line(ctx, 345, 190, 345, 206, '#8a6a4a', 4);
  circle(ctx, 345, 210, 5, '#ffd76a');
  // The cuckoo bird, out of its little door.
  circle(ctx, 345, 118, 9, '#2e5fa3');
  circle(ctx, 352, 114, 4, '#2e5fa3');
  poly(ctx, [[354, 112], [360, 110], [356, 116]], '#e8b06a');
  // Toy train on a track along the floor.
  line(ctx, 60, 640, 560, 640, '#3a3a3a', 5);
  for (const tx of [100, 160, 220, 280, 340, 400, 460, 520]) {
    line(ctx, tx, 632, tx, 648, '#3a3a3a', 4);
  }
  rect(ctx, 90, 600, 60, 34, '#c0392b');
  rect(ctx, 96, 580, 30, 22, '#c0392b');
  circle(ctx, 106, 640, 8, '#1c1c1c');
  circle(ctx, 134, 640, 8, '#1c1c1c');
  rect(ctx, 160, 606, 44, 28, '#2e5fa3');
  circle(ctx, 172, 640, 7, '#1c1c1c');
  circle(ctx, 192, 640, 7, '#1c1c1c');
  rect(ctx, 214, 606, 44, 28, '#2e7d32');
  circle(ctx, 226, 640, 7, '#1c1c1c');
  circle(ctx, 246, 640, 7, '#1c1c1c');
  rect(ctx, 268, 606, 44, 28, '#e8b06a');
  circle(ctx, 280, 640, 7, '#1c1c1c');
  circle(ctx, 300, 640, 7, '#1c1c1c');
  // Wrench on the bench.
  line(ctx, 480, 528, 520, 540, '#c8ccd4', 6);
  circle(ctx, 522, 541, 7, '#c8ccd4');
}

const WORKSHOP_DIFFS = [
  {
    label: 'the cuckoo hides inside', x: 345, y: 116, r: 16,
    apply(ctx) {
      circle(ctx, 345, 116, 11, '#6e4a26');
      rect(ctx, 336, 108, 18, 16, '#4a3220');
    },
  },
  {
    label: 'the clock strikes four', x: 345, y: 160, r: 22,
    apply(ctx) {
      circle(ctx, 345, 160, 30, '#f5ecd2');
      line(ctx, 345, 160, 345, 138, '#1c1c1c', 3);
      line(ctx, 345, 160, 360, 168, '#1c1c1c', 3);
      circle(ctx, 345, 160, 3, '#1c1c1c');
    },
  },
  {
    label: 'a wall gear is gone', x: 90, y: 210, r: 22,
    apply(ctx) { skyPatch(ctx, 90, 210, 28, SHOP_SKY); },
  },
  {
    label: 'the train loses its last car', x: 290, y: 620, r: 24,
    apply(ctx) { groundPatch(ctx, 290, 620, 30, 26, '#6e4a26'); },
  },
  {
    label: 'the teddy bow turns blue', x: 420, y: 492, r: 14,
    apply(ctx) { poly(ctx, [[420, 486], [410, 494], [420, 500], [430, 494]], '#2e5fa3'); },
  },
  {
    label: 'the rocking horse turns around', x: 510, y: 492, r: 22,
    apply(ctx) {
      groundPatch(ctx, 482, 486, 14, 14, '#c89a6a');
      circle(ctx, 538, 486, 11, '#8a5f36');
      line(ctx, 538, 478, 548, 468, '#8a5f36', 6);
    },
  },
  {
    label: 'the bench lamp goes out', x: 330, y: 494, r: 18,
    apply(ctx) {
      skyPatch(ctx, 330, 500, 24, SHOP_SKY);
      line(ctx, 330, 540, 330, 500, '#3a3a3a', 5);
      circle(ctx, 330, 492, 12, '#8a8a8a');
    },
  },
  {
    label: 'the blocks spell TOP', x: 166, y: 412, r: 16,
    apply(ctx) {
      rect(ctx, 150, 396, 32, 32, '#e8b06a');
      label(ctx, 'P', 166, 414, 22, '#3a2a1a');
    },
  },
  {
    label: 'the shelf doll is gone', x: 90, y: 270, r: 20,
    apply(ctx) { skyPatch(ctx, 90, 270, 24, SHOP_SKY); },
  },
  {
    label: 'the window moon turns full', x: 530, y: 100, r: 20,
    apply(ctx) {
      circle(ctx, 530, 100, 22, '#f5ecd2');
      circle(ctx, 538, 96, 19, '#f5ecd2');
    },
  },
  {
    label: 'the wrench is gone', x: 500, y: 534, r: 18,
    apply(ctx) { groundPatch(ctx, 500, 534, 26, 10, '#5a3a22'); },
  },
  {
    label: 'a wall gear turns silver', x: 120, y: 130, r: 26,
    apply(ctx) {
      circle(ctx, 120, 130, 34, '#c8ccd4');
      circle(ctx, 120, 130, 15, '#8a5f36');
      for (let t = 0; t < 8; t += 1) {
        const a = (t / 8) * Math.PI * 2;
        circle(ctx, 120 + Math.cos(a) * 34, 130 + Math.sin(a) * 34, 5, '#c8ccd4');
      }
    },
  },
];

export const SCENES = [
  ...SCENES_PART1,
  { id: 3, name: 'Snowy Mountain Lodge', time: 140, paint: paintLodge, diffs: LODGE_DIFFS },
  { id: 4, name: 'Underwater Coral Reef', time: 140, paint: paintReef, diffs: REEF_DIFFS },
  { id: 5, name: 'Clockwork Toy Workshop', time: 130, paint: paintWorkshop, diffs: WORKSHOP_DIFFS },
];

