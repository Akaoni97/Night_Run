// Modifiche Codex (adattate da Claude il 18/11): cinque cilindri della 850 R e livelli audio. Il carattere «deciso» è stato tolto il 21/11.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
function engine() {
  let seed = 71;
  const math = Object.create(Math); math.random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  return new Function('Math', src + ';return { EngineDSP, CARS };')(math);
}
function render(car, _x, sr = 48000, rpm = 3500, thr = 0.85, view = 1) {
  const { EngineDSP, CARS } = engine(), dsp = new EngineDSP(sr);
  dsp.msg({ cfg: { tune: CARS[car].params(CARS[car].presets[0].sel).dsp, view, vol: 0.6 },
    p: { rpm, thr, charge: thr, air: thr, running: 1 } });
  const L = new Float32Array(sr), R = new Float32Array(sr);
  dsp.render(L, R, sr); dsp.render(L, R, sr);
  return { dsp, L, R };
}
const rms = (a) => Math.sqrt(a.reduce((s, x) => s + x * x, 0) / a.length);

test('Codex: la 850 R emette 125 scoppi al secondo a 3000 giri', () => {
  const { dsp, L, R } = render('v850', 'originale', 48000, 3000);
  let fires = 0; const cycle = dsp.cycle.bind(dsp);
  dsp.cycle = (c) => { fires++; cycle(c); };
  dsp.render(L, R, L.length);
  assert.ok(Math.abs(fires - 125) <= 2, `${fires} scoppi invece di 125`);
});

test('Codex: tutti i veicoli e i punti di ascolto producono audio valido anche a 44,1 kHz', () => {
  const { CARS } = engine();
  for (const car of Object.keys(CARS)) for (const view of [0, 1, 2]) {
    const { L, R } = render(car, null, 44100, CARS[car].P?.idle || 800, 0.15, view);
    for (const a of [L, R]) for (const x of a) assert.ok(Number.isFinite(x) && Math.abs(x) <= 0.9, `${car}, vista ${view}`);
  }
});
