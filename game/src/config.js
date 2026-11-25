// Palette and content for Supper Shift. Warm, muted flat colours; every ingredient
// and dish has an original name and is drawn from shapes by render.js.

export const PALETTE = {
  wall: '#e7d8c0',
  wallLine: '#d8c4a6',
  floor: '#8c6b52',
  wood: '#a06a43',
  woodDark: '#75462c',
  steel: '#b9c0c0',
  steelDark: '#7e8989',
  ink: '#2d211b',
  cream: '#fff4dd',
  ember: '#d9663a',
  emberDark: '#a8431f',
  sage: '#7d9469',
  sageDark: '#536a44',
  gold: '#e2a13c',
  plum: '#6e4050',
  sea: '#4a7f8c',
  shadow: 'rgba(45,33,27,0.22)',
};

// Seven counter bins. `key` is the keyboard shortcut and the printed bin label.
export const INGREDIENTS = [
  { id: 'tomato',   key: '1', label: 'Tomato',   colour: '#cf5238', dark: '#93341f' },
  { id: 'mushroom', key: '2', label: 'Shroom',   colour: '#c2a184', dark: '#8d6f57' },
  { id: 'noodle',   key: '3', label: 'Noodle',   colour: '#e7c66a', dark: '#ad8b34' },
  { id: 'greens',   key: '4', label: 'Greens',   colour: '#7fa663', dark: '#4f753f' },
  { id: 'shrimp',   key: '5', label: 'Shrimp',   colour: '#e58c72', dark: '#ad513c' },
  { id: 'egg',      key: '6', label: 'Egg',      colour: '#f3e3b0', dark: '#c3a763' },
  { id: 'chilli',   key: '7', label: 'Chilli',   colour: '#c94733', dark: '#8c2c1c' },
];

export const INGREDIENT_BY_ID = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]));

// Recipes are ordered combinations: the pass checks that the plate holds exactly
// these chopped ingredients. `seconds` is the ticket's starting clock.
export const RECIPES = [
  { id: 'sunrise',  name: 'Sunrise Noodles',   needs: ['noodle', 'egg', 'greens'],   seconds: 42, colour: '#e7c66a' },
  { id: 'garden',   name: 'Garden Skillet',    needs: ['mushroom', 'greens', 'tomato'], seconds: 46, colour: '#7fa663' },
  { id: 'tide',     name: 'Tidewater Bowl',    needs: ['shrimp', 'noodle', 'chilli'], seconds: 40, colour: '#e58c72' },
  { id: 'hearth',   name: 'Hearth Ragout',     needs: ['tomato', 'mushroom', 'egg'], seconds: 50, colour: '#cf5238' },
  { id: 'ember',    name: 'Ember Greens',      needs: ['greens', 'chilli', 'shrimp'], seconds: 38, colour: '#c94733' },
];

export const RECIPE_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

export const CANVAS_W = 1280;
export const CANVAS_H = 720;

// Station rectangles, shared by render.js and input.js so clicks and paint agree.
export const ZONES = {
  counter: { x: 28, y: 486, w: 1224, h: 116 },
  prep: { x: 352, y: 236, w: 268, h: 232 },
  stove: { x: 646, y: 236, w: 268, h: 232 },
  plate: { x: 940, y: 236, w: 312, h: 232 },
  board: { x: 28, y: 122, w: 300, h: 338 },
  serve: { x: 1044, y: 400, w: 176, h: 52 },
};
