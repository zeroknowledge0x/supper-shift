// Keyboard and mouse bindings. The same four verbs work either way: pick,
// chop, move the pan/plate, serve. Zones come from config so paint and hit
// tests cannot drift apart.

import { INGREDIENTS, ZONES, CANVAS_W, CANVAS_H } from './config.js';
import { pick, chop, loadPan, plateUp, serve } from './state.js';

function inside(x, y, z) {
  return x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h;
}

export function attachInput(canvas, state) {
  const act = {
    pick: (id) => pick(state, id),
    chop: () => chop(state),
    advance: () => {
      if (state.chopped.length) loadPan(state);
      else if (state.pan.cook >= 1) plateUp(state);
    },
    serve: () => serve(state),
  };

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    const bin = INGREDIENTS.find((i) => i.key === key);
    if (bin) act.pick(bin.id);
    else if (key === 'c') act.chop();
    else if (key === ' ') { act.advance(); event.preventDefault(); }
    else if (key === 'enter') act.serve();
  });

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * CANVAS_W / rect.width;
    const y = (event.clientY - rect.top) * CANVAS_H / rect.height;
    if (inside(x, y, ZONES.board)) return;
    if (inside(x, y, ZONES.serve)) { act.serve(); return; }
    if (inside(x, y, ZONES.prep)) { act.chop(); return; }
    if (inside(x, y, ZONES.stove)) { act.advance(); return; }
    if (inside(x, y, ZONES.plate)) { act.serve(); return; }
    if (inside(x, y, ZONES.counter)) {
      const idx = Math.floor((x - ZONES.counter.x - 18) / 174);
      const item = INGREDIENTS[idx];
      if (item) act.pick(item.id);
    }
  });
  return act;
}
