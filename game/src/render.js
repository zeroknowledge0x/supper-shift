// All painting for Supper Shift. Each function owns one part of the kitchen so
// the source outline reads as a set of small, clearly named jobs. Only flat
// canvas shapes and system fonts are used: no images, fonts or network at all.

import { PALETTE as P, INGREDIENTS, INGREDIENT_BY_ID, RECIPE_BY_ID, ZONES, CANVAS_W, CANVAS_H } from './config.js';

export function drawKitchen(ctx, state) {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  drawWall(ctx);
  drawFloor(ctx);
  drawHeader(ctx, state);
  drawOrderBoard(ctx, state);
  drawCounter(ctx, state);
  drawPrepStation(ctx, state);
  drawStoveStation(ctx, state);
  drawPassStation(ctx, state);
  drawFooter(ctx, state);
  if (state.flash > 0) {
    ctx.fillStyle = `rgba(226,161,60,${Math.min(0.16, state.flash * 0.26)})`;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }
}

function drawWall(ctx) {
  ctx.fillStyle = P.wall;
  ctx.fillRect(0, 0, CANVAS_W, 486);
  ctx.strokeStyle = P.wallLine;
  ctx.lineWidth = 2;
  for (let y = 112; y < 486; y += 46) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
  }
  for (let x = 0; x < CANVAS_W; x += 92) {
    ctx.beginPath(); ctx.moveTo(x, 112); ctx.lineTo(x, 486); ctx.stroke();
  }
  // A window with evening light, upper right.
  roundRect(ctx, 1000, 118, 248, 104, 10, P.steelDark);
  roundRect(ctx, 1008, 126, 232, 88, 6, '#9fc4c9');
  ctx.fillStyle = '#e7c27c';
  ctx.beginPath(); ctx.arc(1164, 158, 18, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6f9b7a';
  ctx.beginPath(); ctx.moveTo(1008, 214); ctx.lineTo(1064, 170); ctx.lineTo(1108, 214); ctx.fill();
  ctx.beginPath(); ctx.moveTo(1092, 214); ctx.lineTo(1140, 176); ctx.lineTo(1186, 214); ctx.fill();
  ctx.strokeStyle = P.steelDark;
  ctx.beginPath(); ctx.moveTo(1124, 126); ctx.lineTo(1124, 214); ctx.moveTo(1008, 170); ctx.lineTo(1240, 170); ctx.stroke();
  // A shelf of jars on the left wall.
  ctx.fillStyle = P.woodDark;
  ctx.fillRect(340, 150, 300, 12);
  const jars = ['#cf5238', '#e7c66a', '#7fa663', '#6e4050', '#e58c72'];
  jars.forEach((c, i) => {
    const x = 356 + i * 56;
    ctx.fillStyle = c;
    roundRect(ctx, x, 112, 38, 38, 5, c);
    ctx.fillStyle = P.cream;
    ctx.fillRect(x + 8, 108, 22, 6);
  });
  txt(ctx, 'PANTRY', 490, 176, 13, P.ink, 'bold', 'center');
}

function drawFloor(ctx) {
  ctx.fillStyle = P.floor;
  ctx.fillRect(0, 602, CANVAS_W, CANVAS_H - 602);
  ctx.strokeStyle = '#7a5942';
  ctx.lineWidth = 2;
  for (let x = -200; x < CANVAS_W + 200; x += 110) {
    ctx.beginPath(); ctx.moveTo(x, CANVAS_H); ctx.lineTo(x + 150, 602); ctx.stroke();
  }
}

function drawHeader(ctx, state) {
  ctx.fillStyle = P.woodDark;
  ctx.fillRect(0, 0, CANVAS_W, 100);
  ctx.fillStyle = P.ember;
  ctx.fillRect(0, 94, CANVAS_W, 6);
  txt(ctx, 'SUPPER SHIFT', 30, 54, 44, P.cream, 'bold');
  ctx.fillStyle = P.ember;
  ctx.fillRect(30, 70, 210, 3);
  txt(ctx, 'a little kitchen rush', 32, 84, 16, '#e7c8a0', 'normal');
  txt(ctx, 'SCORE', 700, 34, 15, '#e7c8a0', 'bold');
  txt(ctx, String(state.score).padStart(4, '0'), 700, 72, 38, P.cream, 'bold');
  const comboX = 860;
  txt(ctx, 'COMBO', comboX, 34, 15, '#e7c8a0', 'bold');
  txt(ctx, `x${Math.max(1, state.combo)}`, comboX, 72, 38, state.combo > 1 ? P.gold : P.cream, 'bold');
  const t = Math.max(0, state.shiftLeft);
  txt(ctx, 'SHIFT CLOCK', 1010, 34, 15, '#e7c8a0', 'bold');
  txt(ctx, `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`,
    1010, 74, 40, t < 20 ? P.ember : P.cream, 'bold');
}

function drawOrderBoard(ctx, state) {
  const z = ZONES.board;
  roundRect(ctx, z.x, z.y, z.w, z.h, 12, P.woodDark);
  roundRect(ctx, z.x + 8, z.y + 8, z.w - 16, z.h - 16, 8, '#3b2b23');
  txt(ctx, 'ORDER BOARD', z.x + z.w / 2, z.y + 38, 22, P.cream, 'bold', 'center');
  state.tickets.slice(0, 3).forEach((ticket, i) => {
    const x = z.x + 22;
    const y = z.y + 56 + i * 92;
    const recipe = RECIPE_BY_ID[ticket.recipeId];
    const urgent = ticket.left < 12;
    ctx.fillStyle = urgent ? '#f3dfc0' : '#eee0c6';
    roundRect(ctx, x, y, 256, 82, 6, ctx.fillStyle);
    ctx.fillStyle = recipe.colour;
    ctx.fillRect(x, y, 10, 82);
    txt(ctx, `#${ticket.id}  ${recipe.name}`, x + 22, y + 26, 19, P.ink, 'bold');
    recipe.needs.forEach((id, k) => drawIngredientIcon(ctx, id, x + 34 + k * 38, y + 47, 12));
    const barW = 232;
    ctx.fillStyle = '#cbb99a';
    ctx.fillRect(x + 12, y + 66, barW, 9);
    ctx.fillStyle = urgent ? P.ember : P.sage;
    const shown = Math.max(0, Math.min(1, ticket.left / ticket.total));
    ctx.fillRect(x + 12, y + 66, barW * shown, 9);
    txt(ctx, `${Math.ceil(ticket.left)}s`, x + 246, y + 46, 15, urgent ? P.emberDark : P.ink, 'bold', 'right');
  });
  if (state.tickets.length === 0) txt(ctx, 'All tickets served', z.x + 150, z.y + 200, 18, P.cream, 'normal', 'center');
}

function drawCounter(ctx, state) {
  const z = ZONES.counter;
  ctx.fillStyle = P.wood;
  ctx.fillRect(z.x, z.y, z.w, z.h);
  ctx.fillStyle = P.woodDark;
  ctx.fillRect(z.x, z.y, z.w, 12);
  ctx.fillStyle = '#c58a5c';
  ctx.fillRect(z.x, z.y + z.h - 12, z.w, 12);
  INGREDIENTS.forEach((item, i) => {
    const x = z.x + 18 + i * 174;
    const y = z.y + 18;
    const picked = state.picked === item.id;
    ctx.fillStyle = picked ? P.gold : '#6b4329';
    roundRect(ctx, x, y, 156, 82, 8, ctx.fillStyle);
    ctx.fillStyle = '#3f2819';
    roundRect(ctx, x + 8, y + 8, 140, 52, 6, ctx.fillStyle);
    drawIngredientIcon(ctx, item.id, x + 78, y + 34, 21);
    txt(ctx, item.key, x + 14, y + 24, 18, P.cream, 'bold');
    txt(ctx, item.label, x + 78, y + 74, 17, P.cream, 'bold', 'center');
  });
  if (state.chopped.length) {
    txt(ctx, `chopped bowl: ${state.chopped.length} item(s)`, z.x + 18, z.y - 10, 16, P.ink, 'bold');
    state.chopped.forEach((id, i) => drawIngredientIcon(ctx, id, z.x + 210 + i * 30, z.y - 22, 11));
  }
}

function drawPrepStation(ctx, state) {
  const z = ZONES.prep;
  stationFrame(ctx, z, 'PREP BOARD', P.sageDark);
  ctx.fillStyle = '#d9b98c';
  roundRect(ctx, z.x + 30, z.y + 48, z.w - 60, z.h - 78, 8, '#d9b98c');
  state.chopped.forEach((id, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    drawIngredientIcon(ctx, id, z.x + 74 + col * 62, z.y + 96 + row * 56, 19);
  });
  ctx.strokeStyle = P.steel;
  ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(z.x + z.w - 96, z.y + 60); ctx.lineTo(z.x + z.w - 44, z.y + 128); ctx.stroke();
  ctx.fillStyle = P.woodDark;
  ctx.fillRect(z.x + z.w - 106, z.y + 52, 26, 12);
  txt(ctx, state.chopped.length ? 'bowl ready' : 'chop here', z.x + z.w / 2, z.y + z.h - 18, 16, P.ink, 'bold', 'center');
}

function drawStoveStation(ctx, state) {
  const z = ZONES.stove;
  stationFrame(ctx, z, 'STOVE', P.emberDark);
  ctx.fillStyle = '#4a403a';
  roundRect(ctx, z.x + 26, z.y + 54, z.w - 52, z.h - 84, 10, '#4a403a');
  state.pan.ingredients.forEach((id, i) => {
    drawIngredientIcon(ctx, id, z.x + 84 + i * 50, z.y + 118, 17);
  });
  ctx.fillStyle = P.steelDark;
  ctx.fillRect(z.x + 48, z.y + 148, z.w - 96, 12);
  ctx.fillStyle = state.pan.cook >= 1 ? P.gold : P.ember;
  ctx.fillRect(z.x + 48, z.y + 148, (z.w - 96) * state.pan.cook, 12);
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = P.ember;
    ctx.beginPath();
    ctx.moveTo(z.x + 100 + i * 42, z.y + 186);
    ctx.quadraticCurveTo(z.x + 112 + i * 42, z.y + 158, z.x + 124 + i * 42, z.y + 186);
    ctx.fill();
  }
  txt(ctx, state.pan.cook >= 1 ? 'pan ready - plate it' : 'on the flame', z.x + z.w / 2, z.y + z.h - 18, 16, P.ink, 'bold', 'center');
}

function drawPassStation(ctx, state) {
  const z = ZONES.plate;
  stationFrame(ctx, z, 'THE PASS', P.sea);
  ctx.fillStyle = P.cream;
  ctx.beginPath(); ctx.ellipse(z.x + z.w / 2, z.y + 128, 104, 62, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#d9c7a7';
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.ellipse(z.x + z.w / 2, z.y + 128, 86, 48, 0, 0, Math.PI * 2); ctx.stroke();
  if (state.plate.ready && state.plate.dishId) {
    state.plate.ingredients.forEach((id, i) => {
      const a = (i / state.plate.ingredients.length) * Math.PI * 2 - Math.PI / 2;
      drawIngredientIcon(ctx, id, z.x + z.w / 2 + Math.cos(a) * 38, z.y + 128 + Math.sin(a) * 22, 18);
    });
    const r = RECIPE_BY_ID[state.plate.dishId];
    txt(ctx, r.name, z.x + z.w / 2, z.y + 52, 18, P.ink, 'bold', 'center');
  } else {
    txt(ctx, 'empty plate', z.x + z.w / 2, z.y + 134, 18, '#a08f74', 'normal', 'center');
  }
  const b = ZONES.serve;
  ctx.fillStyle = state.plate.ready ? P.ember : '#7b6a58';
  roundRect(ctx, b.x, b.y, b.w, b.h, 8, ctx.fillStyle);
  txt(ctx, 'SERVE  [ENTER]', b.x + b.w / 2, b.y + 33, 18, P.cream, 'bold', 'center');
}

function drawFooter(ctx, state) {
  ctx.fillStyle = '#241a15';
  ctx.fillRect(0, 660, CANVAS_W, 60);
  txt(ctx, '1-7 pick ingredient   C chop   SPACE pan/plate   ENTER serve   (or click each station)',
    24, 696, 17, '#e7c8a0', 'normal');
  txt(ctx, state.message, CANVAS_W - 24, 696, 19, P.cream, 'bold', 'right');
}

function stationFrame(ctx, z, heading, accent) {
  ctx.fillStyle = P.steelDark;
  roundRect(ctx, z.x, z.y, z.w, z.h, 12, ctx.fillStyle);
  ctx.fillStyle = '#dde3e0';
  roundRect(ctx, z.x + 6, z.y + 6, z.w - 12, z.h - 12, 8, ctx.fillStyle);
  ctx.fillStyle = accent;
  ctx.fillRect(z.x + 6, z.y + 6, z.w - 12, 32);
  txt(ctx, heading, z.x + z.w / 2, z.y + 28, 18, P.cream, 'bold', 'center');
}

// One icon per ingredient, built from primitives so the game owns its art.
export function drawIngredientIcon(ctx, id, cx, cy, size) {
  const item = INGREDIENT_BY_ID[id] || INGREDIENTS[0];
  ctx.save();
  ctx.translate(cx, cy);
  if (id === 'tomato') {
    ctx.fillStyle = item.colour;
    ctx.beginPath(); ctx.arc(0, 2, size, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = P.sageDark;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.ellipse(i * size * 0.4, -size * 0.8, size * 0.34, size * 0.16, i * 0.5, 0, Math.PI * 2); ctx.fill();
    }
  } else if (id === 'mushroom') {
    ctx.fillStyle = '#e8d7b8';
    roundRect(ctx, -size * 0.3, 0, size * 0.6, size, 4, '#e8d7b8');
    ctx.fillStyle = item.colour;
    ctx.beginPath(); ctx.arc(0, 0, size, Math.PI, 0); ctx.fill();
    ctx.fillStyle = item.dark;
    ctx.beginPath(); ctx.arc(-size * 0.4, -size * 0.3, size * 0.16, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(size * 0.35, -size * 0.4, size * 0.12, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'noodle') {
    ctx.strokeStyle = item.dark;
    ctx.lineWidth = Math.max(2, size * 0.18);
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(-size, i * size * 0.5);
      ctx.bezierCurveTo(-size * 0.3, i * size * 0.5 - size * 0.7, size * 0.3, i * size * 0.5 + size * 0.7, size, i * size * 0.5);
      ctx.stroke();
    }
  } else if (id === 'greens') {
    ctx.fillStyle = item.dark;
    ctx.beginPath(); ctx.moveTo(0, size); ctx.lineTo(0, -size * 0.6); ctx.strokeStyle = item.dark; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = item.colour;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.ellipse(i * size * 0.5, -size * 0.2, size * 0.42, size * 0.26, i * 0.7, 0, Math.PI * 2); ctx.fill();
    }
  } else if (id === 'shrimp') {
    ctx.strokeStyle = item.colour;
    ctx.lineWidth = size * 0.5;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 0, size * 0.7, -0.6, 3.6); ctx.stroke();
    ctx.fillStyle = item.dark;
    ctx.beginPath(); ctx.arc(size * 0.6, size * 0.2, size * 0.16, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'egg') {
    ctx.fillStyle = item.colour;
    ctx.beginPath(); ctx.ellipse(0, 0, size * 0.72, size, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = P.gold;
    ctx.beginPath(); ctx.arc(0, size * 0.1, size * 0.34, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'chilli') {
    ctx.strokeStyle = item.colour;
    ctx.lineWidth = size * 0.44;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-size * 0.7, -size * 0.6);
    ctx.quadraticCurveTo(size * 0.5, -size * 0.9, size * 0.5, size * 0.8);
    ctx.stroke();
    ctx.strokeStyle = P.sageDark;
    ctx.lineWidth = size * 0.2;
    ctx.beginPath(); ctx.moveTo(-size * 0.7, -size * 0.6); ctx.lineTo(-size * 0.9, -size); ctx.stroke();
  }
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r, fill) {
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

function txt(ctx, text, x, y, size, colour, weight = 'normal', align = 'left') {
  ctx.fillStyle = colour;
  ctx.font = `${weight} ${size}px ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}
