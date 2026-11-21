// Harbour Lights — the three scenes, each drawn twice from one function.
// drawScene(ctx, index, isRight) paints the scene into a 600x560 box. The left
// panel is the reference; the right panel is the same picture with ten deliberate
// changes (see DIFFERENCES in config.js). All art is original vector drawing.
import { SCENE } from './config.js';

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, SCENE.height);
  g.addColorStop(0, top);
  g.addColorStop(0.62, bottom);
  g.addColorStop(0.63, '#2e6f8e');
  g.addColorStop(1, '#1d4e6b');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCENE.width, SCENE.height);
}

function cloud(ctx, x, y, s, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 20 * s, y - 8 * s, 15 * s, 0, Math.PI * 2);
  ctx.arc(x + 40 * s, y, 17 * s, 0, Math.PI * 2);
  ctx.fill();
}

function gull(ctx, x, y, s, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.5 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y);
  ctx.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y);
  ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 12 * s, y);
  ctx.stroke();
}

function sun(ctx, x, y, r) {
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffd94d';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (r + 6), y + Math.sin(a) * (r + 6));
    ctx.lineTo(x + Math.cos(a) * (r + 16), y + Math.sin(a) * (r + 16));
    ctx.stroke();
  }
}

// --- Scene 0: Harbour Morning ----------------------------------------------
function drawHarbour(ctx, right) {
  sky(ctx, '#ffe6a3', '#bfe3ee');
  if (!right) sun(ctx, 88, 78, 30);
  cloud(ctx, 300, 70, 1, 'rgba(255,255,255,0.9)');
  cloud(ctx, 480, 46, 0.7, 'rgba(255,255,255,0.8)');
  gull(ctx, 220, 110, 1, '#3a4a5a');
  gull(ctx, 330, 80, 0.9, '#3a4a5a');
  if (!right) gull(ctx, 452, 92, 1, '#3a4a5a');

  // Sea
  ctx.fillStyle = '#2e7fa8';
  ctx.fillRect(0, 330, SCENE.width, 230);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(30 + i * 110, 360 + i * 28);
    ctx.quadraticCurveTo(70 + i * 110, 352 + i * 28, 110 + i * 110, 360 + i * 28);
    ctx.stroke();
  }
  // Buoy: orange on the left, green on the right.
  ctx.fillStyle = right ? '#58b368' : '#ff7a3c';
  ctx.beginPath();
  ctx.arc(150, 428, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillRect(144, 402, 12, 12);
  // A jumping fish, left panel only.
  if (!right) {
    ctx.fillStyle = '#c9e8f5';
    ctx.beginPath();
    ctx.ellipse(262, 468, 18, 8, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(278, 460);
    ctx.lineTo(290, 452);
    ctx.lineTo(286, 466);
    ctx.closePath();
    ctx.fill();
  }

  // Dock
  ctx.fillStyle = '#8a6b46';
  ctx.fillRect(0, 470, SCENE.width, 90);
  ctx.fillStyle = '#6f5433';
  for (let x = 0; x < SCENE.width; x += 60) ctx.fillRect(x, 470, 3, 90);
  // Crates: three on the left, two on the right.
  ctx.fillStyle = '#b98a4e';
  ctx.fillRect(64, 430, 56, 40);
  ctx.fillRect(124, 430, 56, 40);
  if (!right) ctx.fillRect(94, 392, 56, 40);
  ctx.strokeStyle = '#7a5a30';
  ctx.lineWidth = 2;
  ctx.strokeRect(64, 430, 56, 40);
  ctx.strokeRect(124, 430, 56, 40);
  if (!right) ctx.strokeRect(94, 392, 56, 40);
  // Rope coil, left panel only.
  if (!right) {
    ctx.strokeStyle = '#d9c08a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(384, 500, 18, 0, Math.PI * 2);
    ctx.arc(384, 500, 10, 0, Math.PI * 2);
    ctx.stroke();
  }
  // The dock cat, left panel only.
  if (!right) {
    ctx.fillStyle = '#e8e0d0';
    ctx.beginPath();
    ctx.ellipse(486, 492, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(500, 478, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(494, 471);
    ctx.lineTo(496, 462);
    ctx.lineTo(501, 470);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(504, 471);
    ctx.lineTo(507, 462);
    ctx.lineTo(510, 470);
    ctx.closePath();
    ctx.fill();
  }

  // Boat with a flag: red on the left, blue on the right.
  ctx.fillStyle = '#a34d2d';
  ctx.beginPath();
  ctx.moveTo(250, 300);
  ctx.lineTo(380, 300);
  ctx.lineTo(360, 330);
  ctx.lineTo(270, 330);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f4efe4';
  ctx.beginPath();
  ctx.moveTo(315, 300);
  ctx.lineTo(315, 190);
  ctx.lineTo(345, 190);
  ctx.lineTo(315, 300);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5a3a22';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(315, 300);
  ctx.lineTo(315, 150);
  ctx.stroke();
  ctx.fillStyle = right ? '#3f7fd0' : '#d23c2e';
  ctx.beginPath();
  ctx.moveTo(315, 150);
  ctx.lineTo(348, 160);
  ctx.lineTo(315, 172);
  ctx.closePath();
  ctx.fill();

  // Lighthouse on the right.
  ctx.fillStyle = '#f4efe4';
  ctx.fillRect(522, 180, 36, 150);
  ctx.fillStyle = '#d23c2e';
  ctx.fillRect(522, 210, 36, 18);
  ctx.fillRect(522, 262, 36, 18);
  ctx.fillStyle = '#2b3a4d';
  ctx.fillRect(518, 152, 44, 30);
  ctx.fillStyle = right ? '#3a4a5a' : '#ffe98a';
  ctx.fillRect(526, 158, 28, 18);
  // Its lamp glows on the left panel only.
  if (!right) {
    ctx.fillStyle = 'rgba(255,233,138,0.35)';
    ctx.beginPath();
    ctx.arc(540, 167, 34, 0, Math.PI * 2);
    ctx.fill();
  }
  // Window: lit on the left, dark on the right.
  ctx.fillStyle = right ? '#2b3a4d' : '#ffe98a';
  ctx.fillRect(532, 224, 16, 20);
  ctx.fillStyle = '#2b3a4d';
  ctx.beginPath();
  ctx.moveTo(514, 152);
  ctx.lineTo(540, 128);
  ctx.lineTo(566, 152);
  ctx.closePath();
  ctx.fill();
}

// --- Scene 1: Night Market ---------------------------------------------------
function lantern(ctx, x, y, colour, lit) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f4d35e';
  ctx.fillRect(x - 8, y - 24, 16, 5);
  ctx.fillRect(x - 8, y + 19, 16, 5);
  if (lit) {
    ctx.fillStyle = 'rgba(255,220,120,0.25)';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMarket(ctx, right) {
  sky(ctx, '#1b1440', '#3a2358');
  // Moon: full on the left, crescent on the right.
  ctx.fillStyle = '#f4ead0';
  ctx.beginPath();
  ctx.arc(92, 72, 28, 0, Math.PI * 2);
  ctx.fill();
  if (right) {
    ctx.fillStyle = '#1b1440';
    ctx.beginPath();
    ctx.arc(104, 66, 26, 0, Math.PI * 2);
    ctx.fill();
  }
  // Stars
  ctx.fillStyle = '#fff';
  for (const [x, y] of [[180, 50], [260, 90], [360, 40], [470, 70], [540, 130], [40, 150]]) {
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // Balloon, left panel only.
  if (!right) {
    ctx.fillStyle = '#e5484d';
    ctx.beginPath();
    ctx.ellipse(524, 88, 16, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e5484d';
    ctx.beginPath();
    ctx.moveTo(524, 108);
    ctx.quadraticCurveTo(516, 130, 524, 148);
    ctx.stroke();
  }
  // String lights across the top.
  ctx.strokeStyle = '#c9b458';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 60);
  ctx.quadraticCurveTo(300, 110, 600, 60);
  ctx.stroke();
  for (let i = 0; i < 9; i += 1) {
    const x = 40 + i * 65;
    const y = 60 + Math.sin((x / 600) * Math.PI) * 42;
    // One bulb is out on the right panel.
    ctx.fillStyle = right && i === 4 ? '#4a4460' : '#ffe98a';
    ctx.beginPath();
    ctx.arc(x, y + 8, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stalls
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(40, 300, 220, 130);
  ctx.fillStyle = '#7a4e2e';
  ctx.fillRect(340, 300, 220, 130);
  // Awnings: extra stripe on the right panel.
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? '#d23c2e' : '#f4efe4';
    ctx.fillRect(40 + i * 37, 240, 37, 60);
    ctx.fillStyle = (i % 2 === 0) !== right ? '#d23c2e' : '#f4efe4';
    ctx.fillRect(340 + i * 37, 240, 37, 60);
  }
  // Banner star on the left stall: present left, missing right.
  if (!right) {
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? 14 : 6;
      ctx[i === 0 ? 'moveTo' : 'lineTo'](104 + Math.cos(a) * r, 246 + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  }
  // Fruit bowl: apples left, oranges right.
  ctx.fillStyle = right ? '#ff9f1c' : '#d23c2e';
  for (const [x, y] of [[140, 360], [160, 352], [180, 362]]) {
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#8a6b46';
  ctx.beginPath();
  ctx.ellipse(160, 380, 34, 10, 0, 0, Math.PI);
  ctx.fill();
  // Vendor with a hat: straw left, teal right.
  ctx.fillStyle = '#e8b98a';
  ctx.beginPath();
  ctx.arc(258, 312, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = right ? '#2e8b8b' : '#e8c96a';
  ctx.beginPath();
  ctx.ellipse(258, 296, 30, 9, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(238, 288, 40, 8);
  ctx.fillStyle = '#4d7ea8';
  ctx.fillRect(228, 332, 60, 60);
  // Tea sign: lamp lit left, dark right.
  ctx.fillStyle = '#2b3a4d';
  ctx.fillRect(428, 170, 60, 52);
  ctx.fillStyle = right ? '#4a4460' : '#ffe98a';
  ctx.font = 'bold 26px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TEA', 458, 206);
  ctx.textAlign = 'left';
  // Paper lanterns: red left, yellow right for the middle one.
  lantern(ctx, 150, 148, '#d23c2e', true);
  lantern(ctx, 208, 148, right ? '#f2c94c' : '#d23c2e', true);
  lantern(ctx, 470, 148, '#d23c2e', true);
  // Ground and the little market dog, left panel only.
  ctx.fillStyle = '#2e2438';
  ctx.fillRect(0, 430, SCENE.width, 130);
  if (!right) {
    ctx.fillStyle = '#c98a4e';
    ctx.beginPath();
    ctx.ellipse(486, 462, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(502, 448, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(496, 440);
    ctx.lineTo(498, 430);
    ctx.lineTo(503, 439);
    ctx.closePath();
    ctx.fill();
  }
  // Cobbles
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 8; i += 1) ctx.fillRect(30 + i * 70, 500, 44, 8);
}

// --- Scene 2: Lantern Garden -------------------------------------------------
function drawGarden(ctx, right) {
  sky(ctx, '#2c3a5e', '#7a6a9e');
  // Fireflies: one missing on the right.
  ctx.fillStyle = '#ffe98a';
  for (const [x, y] of [[120, 90], [240, 70], [340, 100], [500, 80]]) {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!right) {
    ctx.beginPath();
    ctx.arc(420, 120, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  // Tree with leaves: one leaf missing on the right.
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(88, 220, 22, 110);
  ctx.fillStyle = '#3f7d4e';
  ctx.beginPath();
  ctx.arc(99, 200, 62, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(60, 240, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(140, 240, 34, 0, Math.PI * 2);
  ctx.fill();
  if (!right) {
    ctx.fillStyle = '#6fae62';
    ctx.beginPath();
    ctx.ellipse(96, 268, 12, 7, 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  // Butterfly: wing spot on the left only.
  ctx.fillStyle = '#e8a0c8';
  ctx.beginPath();
  ctx.ellipse(168, 168, 14, 20, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(188, 168, 14, 20, 0.4, 0, Math.PI * 2);
  ctx.fill();
  if (!right) {
    ctx.fillStyle = '#7a2e5e';
    ctx.beginPath();
    ctx.arc(172, 162, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#2b2b3a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(178, 150);
  ctx.lineTo(178, 186);
  ctx.stroke();

  // Pond
  ctx.fillStyle = '#3a7d9e';
  ctx.beginPath();
  ctx.ellipse(300, 440, 220, 90, 0, 0, Math.PI * 2);
  ctx.fill();
  // Ripples: present left, absent right.
  if (!right) {
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(300, 420, 30, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(300, 420, 48, 13, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Frog on a lily pad, left panel only.
  if (!right) {
    ctx.fillStyle = '#3f7d4e';
    ctx.beginPath();
    ctx.ellipse(330, 470, 34, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#58b368';
    ctx.beginPath();
    ctx.arc(330, 462, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(324, 456, 4, 0, Math.PI * 2);
    ctx.arc(336, 456, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(324, 456, 2, 0, Math.PI * 2);
    ctx.arc(336, 456, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  // Flowers: one bloom changes colour on the right; one loses a petal.
  const blooms = [
    [120, 420, '#e86a8a', 6],
    [210, 452, '#f2c94c', right ? 5 : 6],
    [150, 480, '#b48ae8', 6],
    [260, 500, '#e86a8a', 6],
  ];
  for (const [x, y, colour, petals] of blooms) {
    const c = x === 120 && right ? '#7aa8e8' : colour;
    ctx.fillStyle = c;
    for (let i = 0; i < petals; i += 1) {
      const a = (i / petals) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * 10, y + Math.sin(a) * 10, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  // Grass
  ctx.strokeStyle = '#3f7d4e';
  ctx.lineWidth = 3;
  for (let x = 20; x < SCENE.width; x += 46) {
    ctx.beginPath();
    ctx.moveTo(x, 540);
    ctx.lineTo(x + 6, 522);
    ctx.stroke();
  }
  // Bridge: one plank missing on the right.
  ctx.fillStyle = '#8a6b46';
  for (let i = 0; i < 6; i += 1) {
    if (right && i === 3) continue;
    ctx.fillRect(230 + i * 16, 322, 14, 26);
  }
  ctx.strokeStyle = '#5a3a22';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(225, 322);
  ctx.lineTo(325, 322);
  ctx.moveTo(225, 348);
  ctx.lineTo(325, 348);
  ctx.stroke();
  // Stone lantern: flame lit left, dark right.
  ctx.fillStyle = '#8a8a9e';
  ctx.fillRect(508, 240, 24, 60);
  ctx.fillRect(500, 196, 40, 12);
  ctx.fillRect(504, 208, 32, 32);
  ctx.fillStyle = right ? '#3a3a4d' : '#ffb347';
  ctx.beginPath();
  ctx.ellipse(520, 224, 7, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  // Stepping stones: four left, three right.
  ctx.fillStyle = '#b8b8c8';
  for (const [x, y] of [[400, 500], [430, 520], [460, 500]]) {
    ctx.beginPath();
    ctx.ellipse(x, y, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!right) {
    ctx.beginPath();
    ctx.ellipse(452, 492, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

const DRAWERS = [drawHarbour, drawMarket, drawGarden];

export function drawScene(ctx, index, isRight) {
  ctx.save();
  ctx.clearRect(0, 0, SCENE.width, SCENE.height);
  DRAWERS[index](ctx, isRight);
  ctx.restore();
}
