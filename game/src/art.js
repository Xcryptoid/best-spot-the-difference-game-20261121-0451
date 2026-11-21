// Shared canvas drawing helpers for the five scenes. Every helper draws in the
// local panel coordinate space (0..PANEL_W, 0..PANEL_H) and uses flat colours so
// a difference can be painted over cleanly by its own apply() step.
export const PANEL_W = 616;
export const PANEL_H = 700;

export function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

export function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
}

// Same as sky(), but with any number of gradient stops, so a scene whose sky
// has three or four bands can repaint a patch of it exactly.
export function skyStops(ctx, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, PANEL_H);
}

export function stars(ctx, list, fill) {
  ctx.fillStyle = fill;
  for (const [x, y, r] of list) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Four-point sparkle on the biggest star.
  const [sx, sy] = list[0];
  ctx.strokeStyle = fill;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sx - 8, sy);
  ctx.lineTo(sx + 8, sy);
  ctx.moveTo(sx, sy - 8);
  ctx.lineTo(sx, sy + 8);
  ctx.stroke();
}

export function pine(ctx, x, baseY, h, dark) {
  const w = h * 0.42;
  ctx.fillStyle = dark ? '#0e3d24' : '#146b35';
  for (let tier = 0; tier < 3; tier += 1) {
    const ty = baseY - h + (tier * h) / 3;
    const tw = w * (1 - tier * 0.24);
    poly(ctx, [[x, ty], [x - tw / 2, ty + h / 3 + 8], [x + tw / 2, ty + h / 3 + 8]], ctx.fillStyle);
  }
  rect(ctx, x - 5, baseY - 8, 10, 14, '#5a3a22');
}

export function label(ctx, text, x, y, size, color, align) {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px Georgia, serif`;
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

export function softShadow(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
