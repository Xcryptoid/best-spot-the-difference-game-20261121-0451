// Harbour Lights — every tuning number, colour and scene definition in one place.
// The playfield is a fixed 1280x720 logical area; the renderer scales it to the
// window, so no rule below depends on the screen size.
export const FIELD = { width: 1280, height: 720 };

export const PANEL = { y: 84, height: 556, width: 596 };
export const PANEL_LEFT_X = 16;
export const PANEL_RIGHT_X = 668;
export const SCENE = { width: 600, height: 560 };

export const ROUND_TIME = [180, 150, 120];
export const HINT_COOLDOWN = 15;
export const HINT_COST = 25;
export const WRONG_POINTS = 15;
export const WRONG_TIME = 3;
export const FIND_POINTS = 100;

export const PALETTE = {
  backdrop: '#141a26',
  header: '#1d2637',
  headerLine: '#31405c',
  text: '#f4efe4',
  muted: '#9aa7bd',
  accent: '#ffc94d',
  accentDark: '#e8a91c',
  good: '#7ddc8a',
  bad: '#ff6b5e',
  panelBorder: '#3a4a66',
  foundRing: '#ffd94d',
  hintRing: '#7ddcff',
  button: '#2b6cb0',
  buttonHover: '#3182ce',
};

export const FONT = '"Trebuchet MS", "Segoe UI", system-ui, sans-serif';

export const SCENE_NAMES = [
  'Harbour Morning',
  'Night Market',
  'Lantern Garden',
];

export const SCENE_BLURBS = [
  'A sleepy fishing harbour wakes up. Ten things changed between the two pictures.',
  'Lanterns, stalls and supper smells. Ten things changed — look closely, it is busier here.',
  'A quiet garden at dusk. Ten small things changed, and they hide well.',
];

// One entry per difference: position in scene space (600x560), click radius, and a
// short label shown on the victory recap. `right` describes how the right panel
// differs; the drawing code reads these flags.
export const DIFFERENCES = [
  [
    { id: 'sun', x: 88, y: 78, r: 42, label: 'the morning sun' },
    { id: 'flag', x: 312, y: 168, r: 26, label: 'the boat flag colour' },
    { id: 'gull', x: 452, y: 92, r: 24, label: 'a seagull in the sky' },
    { id: 'lamp', x: 540, y: 152, r: 26, label: 'the lighthouse lamp' },
    { id: 'buoy', x: 150, y: 428, r: 28, label: 'the buoy colour' },
    { id: 'fish', x: 262, y: 468, r: 26, label: 'a jumping fish' },
    { id: 'cat', x: 486, y: 482, r: 26, label: 'the dock cat' },
    { id: 'crates', x: 122, y: 412, r: 30, label: 'a crate on the dock' },
    { id: 'window', x: 540, y: 232, r: 20, label: 'the lighthouse window' },
    { id: 'rope', x: 384, y: 500, r: 26, label: 'a coil of rope' },
  ],
  [
    { id: 'moon', x: 92, y: 72, r: 36, label: 'the moon' },
    { id: 'lantern', x: 208, y: 148, r: 26, label: 'a paper lantern colour' },
    { id: 'awning', x: 380, y: 270, r: 30, label: 'an awning stripe' },
    { id: 'fruit', x: 156, y: 372, r: 28, label: 'the fruit in the bowl' },
    { id: 'sign', x: 458, y: 196, r: 26, label: 'the tea sign lamp' },
    { id: 'balloon', x: 524, y: 88, r: 24, label: 'a red balloon' },
    { id: 'bulb', x: 300, y: 110, r: 18, label: 'a string-light bulb' },
    { id: 'hat', x: 258, y: 288, r: 26, label: 'the vendor hat' },
    { id: 'pup', x: 486, y: 448, r: 26, label: 'the little market dog' },
    { id: 'banner', x: 104, y: 246, r: 24, label: 'the stall banner star' },
  ],
  [
    { id: 'bloom', x: 120, y: 420, r: 26, label: 'a flower colour' },
    { id: 'petals', x: 210, y: 452, r: 24, label: 'a flower petal count' },
    { id: 'frog', x: 330, y: 470, r: 26, label: 'the frog on the lily pad' },
    { id: 'stone', x: 452, y: 492, r: 22, label: 'a stepping stone' },
    { id: 'wing', x: 178, y: 168, r: 24, label: 'a butterfly wing spot' },
    { id: 'flame', x: 520, y: 208, r: 22, label: 'a lantern flame' },
    { id: 'leaf', x: 96, y: 268, r: 24, label: 'a leaf on the tree' },
    { id: 'ripple', x: 300, y: 420, r: 26, label: 'a ripple in the pond' },
    { id: 'firefly', x: 420, y: 120, r: 18, label: 'a firefly' },
    { id: 'bridge', x: 268, y: 330, r: 24, label: 'a bridge plank' },
  ],
];

export const BEST_KEY = 'harbour-lights.best';
