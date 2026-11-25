# Supper Shift

[![make.fun bounty](https://img.shields.io/badge/make.fun-bounty-6C5CE7)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![License: MIT](https://img.shields.io/badge/License-MIT-2E8B57.svg)](https://opensource.org/licenses/MIT)
[![Built with Hermes Agent](https://img.shields.io/badge/built%20with-Hermes%20Agent-C0392B)](https://hermes-agent.nousresearch.com/docs)

A small, original desk-browser cooking game. You run the pass during a dinner
rush: read the tickets on the order board, pick ingredients off the counter,
chop them at the board, cook them in the pan, plate the dish and serve it before
the ticket timer runs out. Keyboard and mouse, no build step, no network.

## Play

Serve `game/` from any static server and open `index.html` in a desktop browser,
or from this repository run:

```
node22 serve.ts
```

then open <http://localhost:8080>.

Controls: number keys pick an ingredient, `C` chops the picked ingredient,
`Space` moves the pan to the pass, `Enter` serves the plated dish. The same
stations can be clicked with the mouse. `?shot=open|prep|assembly|rush` opens a
fixed demonstration frame used for the screenshots.

## Layout

- `game/index.html` - the page and canvas.
- `game/src/config.js` - palette, ingredients, recipes.
- `game/src/state.js` - orders, timers, scoring, station actions.
- `game/src/render.js` - all drawing of the kitchen and its stations.
- `game/src/input.js` - keyboard and mouse bindings.
- `game/src/main.js` - boot and the frame loop.
- `vendor/makefun-game.ts` - the kit's dossier library, unchanged.
- `main.ts` - copies `game/` and `screenshots/` to `/output` and writes the dossier.

MIT licensed; all art is drawn in code by this repository.
