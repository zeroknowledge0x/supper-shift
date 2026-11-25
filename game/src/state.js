// Game state: tickets, the three stations, scoring and the deterministic frames
// used by the screenshots. No clocks, no randomness at render time.

import { INGREDIENTS, RECIPES, RECIPE_BY_ID } from './config.js';

export function makeState(seed = 7) {
  let n = seed >>> 0 || 7;
  const rand = () => {
    n = (n * 1664525 + 1013904223) >>> 0;
    return n / 4294967296;
  };
  const state = {
    rand,
    tickets: [],
    nextTicket: 0,
    picked: null,
    chopped: [],
    pan: { ingredients: [], cook: 0, ready: false },
    plate: { dishId: null, ingredients: [], ready: false },
    score: 0,
    served: 0,
    combo: 0,
    shiftLeft: 90,
    message: 'Pick an ingredient to start the shift',
    flash: 0,
    over: false,
  };
  addTicket(state);
  addTicket(state);
  addTicket(state);
  return state;
}

export function addTicket(state) {
  const r = RECIPES[Math.floor(state.rand() * RECIPES.length)];
  state.tickets.push({
    id: ++state.nextTicket,
    recipeId: r.id,
    left: r.seconds,
    total: r.seconds,
  });
}

// Pick a counter bin; the chosen ingredient glows until it is chopped.
export function pick(state, id) {
  if (state.over) return;
  state.picked = id;
  state.message = `${label(id)} on the board - press C to chop`;
}

// Chop the picked ingredient into the prep bowl.
export function chop(state) {
  if (state.over || !state.picked) return;
  state.chopped.push(state.picked);
  state.message = `${label(state.picked)} chopped - add it to the pan`;
  state.picked = null;
}

// Tip the chopped bowl into the pan. Cooking fills a bar, then the dish is ready.
export function loadPan(state) {
  if (state.over || state.chopped.length === 0) return;
  state.pan.ingredients = state.chopped.slice();
  state.pan.cook = 0.08;
  state.pan.ready = false;
  state.chopped = [];
  state.message = 'Pan on the flame - let it finish';
}

// Move the cooked contents onto the plate.
export function plateUp(state) {
  if (state.over || state.pan.cook < 1) return;
  state.plate.ingredients = state.pan.ingredients.slice();
  state.plate.dishId = matchRecipe(state.plate.ingredients);
  state.plate.ready = true;
  state.pan = { ingredients: [], cook: 0, ready: false };
  state.message = state.plate.dishId ? 'Plated - serve the matching ticket' : ' plated, but no ticket matches';
}

// Serve the plate to the first ticket whose recipe matches the ingredients.
export function serve(state) {
  if (state.over || !state.plate.ready) return;
  const key = [...state.plate.ingredients].sort().join('|');
  const idx = state.tickets.findIndex((t) => {
    const r = RECIPE_BY_ID[t.recipeId];
    return [...r.needs].sort().join('|') === key;
  });
  if (idx === -1) {
    state.combo = 0;
    state.message = 'No ticket wants that plate - check the board';
    state.flash = 0.4;
    return;
  }
  const t = state.tickets[idx];
  const bonus = Math.round(10 + t.left * 0.6);
  state.combo += 1;
  state.score += bonus + (state.combo - 1) * 5;
  state.served += 1;
  state.tickets.splice(idx, 1);
  state.plate = { dishId: null, ingredients: [], ready: false };
  state.message = `${RECIPE_BY_ID[t.recipeId].name} served - ${bonus} points, combo x${state.combo}`;
  state.flash = 0.6;
  addTicket(state);
}

export function matchRecipe(ingredients) {
  const key = [...ingredients].sort().join('|');
  for (const r of RECIPES) if ([...r.needs].sort().join('|') === key) return r.id;
  return null;
}

export function tick(state, dt) {
  if (state.over) return;
  state.shiftLeft = Math.max(0, state.shiftLeft - dt);
  state.flash = Math.max(0, state.flash - dt);
  if (state.pan.cook > 0 && state.pan.cook < 1) {
    state.pan.cook = Math.min(1, state.pan.cook + dt / 2.2);
    if (state.pan.cook === 1) state.message = 'Pan is ready - plate it up';
  }
  for (const t of state.tickets) {
    t.left = Math.max(0, t.left - dt);
    if (t.left === 0 && !t.expired) {
      t.expired = true;
      state.combo = 0;
      state.message = 'A ticket timed out - combo lost';
      state.flash = 0.5;
    }
  }
  if (state.shiftLeft === 0) {
    state.over = true;
    state.message = `Shift over - ${state.served} served, ${state.score} points`;
  }
}

// Fixed frames for shots.json. They set a real game state and no rendering trick.
export function applyShot(state, shot) {
  state.tickets.forEach((t) => { t.expired = false; });
  if (shot === 'prep') {
    state.picked = 'greens';
    state.chopped = ['noodle', 'egg', 'greens'];
    state.tickets[0].left = 26;
    state.tickets[1].left = 39;
    state.tickets[2].left = 44;
    state.message = 'Chopped bowl ready for the pan';
  } else if (shot === 'assembly') {
    state.score = 240;
    state.combo = 3;
    state.served = 2;
    state.pan.ingredients = ['shrimp', 'noodle', 'chilli'];
    state.pan.cook = 0.86;
    state.plate.ingredients = ['mushroom', 'greens', 'tomato'];
    state.plate.dishId = 'garden';
    state.plate.ready = true;
    state.tickets[0].left = 18;
    state.tickets[1].left = 27;
    state.tickets[2].left = 35;
    state.shiftLeft = 51;
    state.message = 'Plate ready - Garden Skillet';
    state.flash = 0.3;
  } else if (shot === 'rush') {
    state.score = 610;
    state.combo = 6;
    state.served = 7;
    state.chopped = ['egg'];
    state.pan.ingredients = ['tomato', 'mushroom', 'egg'];
    state.pan.cook = 0.62;
    state.plate.ingredients = ['shrimp', 'noodle', 'chilli'];
    state.plate.dishId = 'tide';
    state.plate.ready = true;
    state.tickets[0].left = 7;
    state.tickets[1].left = 12;
    state.tickets[2].left = 19;
    state.shiftLeft = 18;
    state.message = 'Service rush - Tidewater Bowl ready to serve';
    state.flash = 0.5;
  } else {
    state.tickets[0].left = 41;
    state.tickets[1].left = 45;
    state.tickets[2].left = 49;
    state.message = 'Pick an ingredient to start the shift';
  }
  return state;
}

function label(id) {
  const item = INGREDIENTS.find((i) => i.id === id);
  return item ? item.label : id;
}
