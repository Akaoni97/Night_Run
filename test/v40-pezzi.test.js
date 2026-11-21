// Prove dei pezzi nuovi della V40 da Luca: turbo da 0,5 / 1,0 / 1,5 bar, downpipe, terminale, camme, cambio, gomme da drag, frizione da corsa, e i 450 CV.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { CARS, TUNING_V40, V40_PRESETS, SupraSim, v40Params }')();
const stock = Object.fromEntries(Object.keys(E.TUNING_V40).map((k) => [k, E.TUNING_V40[k].items[0].id]));
const cv = (sel) => { const s = new E.SupraSim(), p = E.v40Params(Object.assign({}, stock, sel)); s.setCar(Object.assign({}, E.CARS.v40.P)); s.setTune(p.sim); return s.estimatePeak().cv; };
const item = (k, id) => E.TUNING_V40[k].items.find((i) => i.id === id);

test('V40: i reparti nuovi ci sono e ogni preparazione li nomina tutti', () => {
  for (const k of ['cat', 'cams', 'gearbox']) assert.ok(E.TUNING_V40[k] && E.TUNING_V40[k].items.length >= 3, k);
  for (const p of E.V40_PRESETS) for (const k of Object.keys(E.TUNING_V40)) if (k !== 'limiter' && k !== 'suspension') assert.ok(p.sel[k], `${p.id} senza ${k}`);
  for (const p of E.V40_PRESETS) for (const [k, id] of Object.entries(p.sel)) assert.ok(item(k, id), `${p.id}: ${k}=${id} non esiste`);
});

test('turbo: 0,5, 0,7, 1,0 e 1,5 bar in ordine, e la centralina limita la pressione', () => {
  const bar = (id) => item('turbo', id).sim.turbo.max;
  assert.deepEqual(['mini05', 'td04', 'bar10', 'td04_19t', 'big15'].map(bar), [0.5, 0.7, 1.0, 1.5, 1.5]);
  const t = (id, ecu) => cv({ turbo: id, ecu });
  assert.ok(t('mini05', 'oem') > 140 && t('mini05', 'oem') < t('bar10', 'remap'), 'più bar, più cavalli');
  assert.ok(t('big15', 'standalone') > t('big15', 'oem') * 1.2, 'la centralina originale tiene il turbo grosso a 1 bar');
});

test('downpipe, terminale, camme e aspirazione danno cavalli', () => {
  const base = cv({ turbo: 'td04', ecu: 'remap' });
  assert.ok(cv({ turbo: 'td04', ecu: 'remap', cat: 'decat' }) > base * 1.05, 'downpipe');
  assert.ok(cv({ exhaust: 'terminale' }) > cv({}), 'terminale');
  assert.ok(cv({ cams: 'race' }) > cv({}), 'camme');
  assert.ok(cv({ intake: 'ram' }) > cv({ intake: 'pf' }), 'airbox con presa fredda');
});

test('gomme da drag (livello 3), cambio e frizione da corsa', () => {
  assert.equal(E.TUNING_V40.tires.items.findIndex((i) => i.id === 'drag'), 3);
  const mu = (id) => E.v40Params(Object.assign({}, stock, { tires: id })).sim.mu;
  assert.ok(mu('drag') > mu('semislick') && mu('drag') >= 1.5);
  assert.equal(E.v40Params(stock).sim.gears, null, 'cambio di serie');
  const g = E.v40Params(Object.assign({}, stock, { gearbox: 'drag' })).sim.gears;
  assert.ok(g[1] > E.CARS.v40.P.gears[1], 'prima più corta');
  assert.ok(E.v40Params(Object.assign({}, stock, { clutch: 'race' })).sim.clutchMax >= 900);
});

test('la preparazione «Drag 450» passa i 450 CV con le gomme da drag', () => {
  const d = E.V40_PRESETS.find((p) => p.id === 'drag');
  assert.equal(d.sel.tires, 'drag');
  assert.ok(cv(d.sel) >= 450, `CV ${cv(d.sel)}`);
  assert.ok(cv(E.V40_PRESETS.find((p) => p.id === 'sleeper').sel) < 250, 'la sleeper resta una sleeper');
});
