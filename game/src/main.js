// Bootstrap: one fixed 1280x800 canvas, one Game, one animation loop. Mouse
// clicks and the H / M / R keys drive the game; ?shot=start|play|near|win
// stages a frozen frame for the screenshots instead of playing. The game is
// exposed as window.__game so an automated play-test can drive it.
import { Game, VIEW_W, VIEW_H } from './game.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const game = new Game();
window.__game = game;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) stageShot(shot, game);

function toCanvasCoords(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * VIEW_W,
    y: ((event.clientY - rect.top) / rect.height) * VIEW_H,
  };
}

canvas.addEventListener('click', (event) => {
  const { x, y } = toCanvasCoords(event);
  game.click(x, y);
});

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'h') game.useHint();
  else if (key === 'm') game.toggleMute();
  else if (key === 'r') game.startGame();
  else if (key === ' ' || key === 'enter') {
    if (game.screen === 'title') game.startGame();
    else if (game.screen !== 'play') game.advance();
    event.preventDefault();
  }
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  // A staged shot is a frozen frame: the loop redraws it but never advances
  // the timer, so the screenshot is the same whenever it is taken.
  if (!shot) game.tick(dt);
  game.render(ctx);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
window.__ready = true;
