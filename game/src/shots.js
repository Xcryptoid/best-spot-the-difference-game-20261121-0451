// Staged frames for the screenshots, behind ?shot=start|play|near|win. Each
// one sets the game to a fixed, fully determined state — no randomness, no
// clock — so the same shot always renders the same frame. The play shot is
// the cover: a world mid-hunt, five differences already ringed in gold, seven
// still hidden, the counter reading 7 LEFT.
import { SCENES } from './scenes.js';

function foundSet(game, indexes) {
  game.found = new Set(indexes);
  game.foundAt = new Map(indexes.map((i) => [i, game.elapsed - 5]));
}

export function stageShot(name, game) {
  if (name === 'play') {
    game.sceneIndex = 1;
    game.beginScene();
    game.screen = 'play';
    game.elapsed = 60;
    game.timeLeft = 105;
    game.score = 500;
    game.roundScore = 500;
    game.totalFound = 5;
    foundSet(game, [0, 2, 4, 7, 9]);
    return;
  }
  if (name === 'near') {
    game.sceneIndex = 3;
    game.beginScene();
    game.screen = 'play';
    game.elapsed = 120;
    game.timeLeft = 24;
    game.score = 3400;
    game.roundScore = 1100;
    game.totalFound = 47;
    foundSet(game, [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 11]);
    return;
  }
  if (name === 'win') {
    game.sceneIndex = 4;
    game.beginScene();
    game.screen = 'win';
    game.elapsed = 0;
    game.score = 6240;
    game.totalFound = 60;
    return;
  }
  // start, and anything else: the title screen over the first world.
  game.sceneIndex = 0;
  game.beginScene();
  game.screen = 'title';
  game.elapsed = 0;
}

export function shotSceneName(name) {
  if (name === 'play') return SCENES[1].name;
  if (name === 'near') return SCENES[3].name;
  if (name === 'win') return SCENES[4].name;
  return SCENES[0].name;
}
