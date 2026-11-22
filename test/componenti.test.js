// Le illustrazioni dei componenti (componenti.js): ogni pezzo della Supra ha il suo disegno, le altre auto prendono
// quello dello stesso reparto a un livello simile; i premi «pezzo» delle valigette portano l'illustrazione.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'suoni.js', 'cars.js', 'componenti.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { CARS, CAR_IDS, TUNING, COMP, COMP_POS, compPos, compHTML }')();

test('i file dello zip ci sono e il catalogo combacia col foglio', () => {
  for (const f of [E.COMP.atlas, E.COMP.atlasHd, ...E.COMP.rarita, 'img/componenti/catalogo.json']) assert.ok(existsSync(new URL(f, dir)), f);
  const cat = JSON.parse(readFileSync(new URL('img/componenti/catalogo.json', dir), 'utf8'));
  for (const c of cat.components) {
    const p = E.compPos(c.category, c.id);
    assert.deepEqual(p, { x: c.atlas.x / 128, y: c.atlas.y / 96 }, `${c.category}:${c.id}`);
  }
});

test('ogni pezzo della Supra ha il suo disegno esatto', () => {
  for (const cat of Object.keys(E.COMP_POS)) for (const it of E.TUNING[cat] ? E.TUNING[cat].items : []) {
    const p = E.compPos(cat, it.id, E.TUNING[cat].items);
    if (E.COMP_POS[cat].some((r) => r[0] === it.id)) assert.ok(p, `${cat}:${it.id}`);
  }
});

test('le altre auto: stesso reparto, livello simile; di serie = di serie, il più spinto = il più spinto', () => {
  let n = 0;
  for (const id of E.CAR_IDS) {
    const t = id === 'supra' ? null : E.CARS[id].tuning; if (!t) continue;
    for (const cat of Object.keys(E.COMP_POS)) {
      const items = t[cat] && t[cat].items; if (!items || items.length < 2) continue;
      const first = E.compPos(cat, items[0].id, items);
      if (items[0].id !== 'none') assert.ok(first, `${id} ${cat} di serie`);
      for (const it of items) { const p = E.compPos(cat, it.id, items); if (p) { n++; assert.ok(p.x >= 0 && p.x < 6 && p.y >= 0 && p.y < 14); } }
    }
  }
  assert.ok(n > 300, `disegni trovati: ${n}`);
  const g = (cat, id, items) => E.compPos(cat, id, items);
  assert.deepEqual(g('tires', 'drag', ['oem', 'sport', 'drag']), g('tires', 'etstreet'));
  assert.equal(g('turbo', 'none', ['none', 'mini05']), null, 'senza turbo niente disegno');
  assert.equal(g('weight', 's1', ['oem', 's1']), null, 'reparti senza disegno');
  assert.match(E.compHTML('turbo', 't51r'), /atlas_hd\.png/);
});

test('le valigette danno l\'illustrazione col pezzo', () => {
  const v = readFileSync(new URL('valigette.js', dir), 'utf8');
  assert.match(v, /comp: typeof compPos === 'function' \? compPos\(c\.cat, c\.it\.id/);
  assert.match(v, /window\.compDraw\(x, prize\.comp/);
});
