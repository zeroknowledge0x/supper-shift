// Boot and frame loop for Supper Shift. With ?shot=<name> the game opens a
// fixed state and holds it, which is how shots.json takes honest in-browser
// renders of this same code. Without it, the shift runs normally.

import { drawKitchen } from './render.js';
import { makeState, applyShot, tick } from './state.js';
import { attachInput } from './input.js';

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const params = new URLSearchParams(location.search);
const seed = Number(params.get('seed')) || 7;
const shot = params.get('shot');
const state = applyShot(makeState(seed), shot);
attachInput(canvas, state);

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!shot) tick(state, dt);
  drawKitchen(ctx, state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Exposed so a play-test can read the state without reaching into a module.
window.supperShift = state;
