// Le illustrazioni dei componenti (componenti.js): una libreria comune a tutte le auto (la Supra è come le altre), stesse
// regole per ognuna (nome del pezzo, poi livello nel suo catalogo); i premi «pezzo» delle valigette portano l'illustrazione.
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

test('stesse regole per tutte le auto: il primo pezzo è quello di serie, il nome conta, poi il livello', () => {
  const nm = (cat, p) => (p ? E.COMP_POS[cat].find((t) => t[1] === p.x && t[2] === p.y)[0] : null);
  for (const id of E.CAR_IDS) {
    const t = id === 'supra' ? E.TUNING : E.CARS[id].tuning; if (!t) continue;
    for (const cat of ['exhaust', 'suspension', 'tires', 'intake', 'cat']) if (t[cat] && t[cat].items.length > 1) {
      assert.equal(nm(cat, E.compPos(cat, t[cat].items[0].id, t[cat].items)), E.COMP_POS[cat][0][0], `${id} ${cat}: di serie`);
    }
    if (t.tires) for (const it of t.tires.items) if (/drag|^slick/.test(it.id)) assert.equal(nm('tires', E.compPos('tires', it.id, t.tires.items)), 'etstreet', `${id} ${it.id}`);
    if (t.turbo) for (const it of t.turbo.items) if (/twin/.test(it.id)) assert.equal(nm('turbo', E.compPos('turbo', it.id, t.turbo.items)), 'ct12b', `${id} biturbo`);
  }
  // un catalogo inventato, senza nessun nome della libreria: dal più semplice al più spinto
  const items = ['oem', 'a', 'b', 'c', 'd'], liv = items.slice(1).map((x) => E.compPos('exhaust', x, items).x);
  assert.deepEqual(liv, [...liv].sort((p, q) => p - q), 'livelli in ordine');
  assert.ok(liv[liv.length - 1] > liv[0]);
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
