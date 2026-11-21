// La frizione (v0.72): quella di serie slitta su un motore molto potente, quella da corsa no (nessuna auto).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'cars.js', 'samples.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { CARS, SupraSim, TUNING, tuningParams }')();
const H = 1 / 240;
const drive = (s, sec, each) => { for (let t = 0; t < sec; t += H) { each?.(s, t); s.update(H); s.events.length = 0; } };
const AUTO = Object.keys(E.CARS).filter((i) => !['bus', 'van', 'ambulanza', 'polizia', 'taxi', 'doblo'].includes(i));

// tuning massimo (l'ultimo pezzo di ogni reparto), con la frizione scelta
function crea(id, frizione) {
  const s = new E.SupraSim(), c = E.CARS[id];
  const cat = id === 'supra' ? E.TUNING : c.tuning, params = id === 'supra' ? (sel) => E.tuningParams(sel) : (sel) => c.params(sel);
  if (id !== 'supra') { s.setCar(Object.assign({}, c.P)); s.P.fwd = !!c.fwd; s.P.rearW = c.driveW; }
  const sel = {}; for (const k of Object.keys(cat)) sel[k] = cat[k].items[cat[k].items.length - 1].id;
  if (frizione === 'serie') sel.clutch = cat.clutch.items[0].id;
  s.setTune(params(sel).sim); s.cfg.tc = true; s.setIgnition(true);
  drive(s, 4, (x, t) => x.setStarter(t < 1.2));
  return s;
}
// a gas pieno dalla partenza: quanta parte del tempo in 3ª-6ª la frizione slitta (giri motore oltre quelli delle ruote)
function slitta(id, frizione) {
  const s = crea(id, frizione); s.shift(1);
  let boxT = 0.5, run = 0, sl = 0;
  drive(s, 40, (x) => {
    x.in.thr = 1; boxT -= H;
    if (boxT <= 0 && !x.shiftSeq && x.gear >= 1) { const top = x.P.gears.length - 1; if (x.gear < top && x.rpm > x.P.limiter - 300 && x.shift(x.gear + 1)) boxT = 0.7; }
    if (x.gear >= 3 && !x.shiftSeq && x.clutch < 0.05 && x.rpm > 2500 && x.v * 3.6 > 60) {
      run += H; if (Math.abs(x.we - x.wo * x.ratio(x.gear)) * 9.5493 > 120) sl += H;
    }
  });
  return run ? sl / run : 0;
}

test('la frizione migliore regge più della coppia massima del motore (tutte le auto)', () => {
  for (const id of AUTO) {
    const s = crea(id, 'migliore'), nm = s.estimatePeak().nm;
    assert.ok(s.P.clutchMax >= nm * 1.2, `${id}: regge ${s.P.clutchMax} Nm, il motore ne fa ${Math.round(nm)}`);
  }
});

test('col kit frizione e volano il motore al massimo non slitta, con quella di serie sì', () => {
  for (const id of ['v40', 'e36', 'polo']) {
    assert.ok(slitta(id, 'migliore') < 0.01, `${id}: con la frizione da corsa slitta`);
    assert.ok(slitta(id, 'serie') > 0.05, `${id}: con quella di serie dovrebbe slittare`);
  }
});

test('Supra: il bidisco regge di più e la frizione di serie torna a 820 Nm', () => {
  const sel = (k) => ({ clutch: k });
  const base = Object.fromEntries(Object.keys(E.TUNING).map((k) => [k, E.TUNING[k].items[0].id]));
  assert.equal(E.tuningParams(Object.assign({}, base, sel('oem'))).sim.clutchMax, 820);
  assert.ok(E.tuningParams(Object.assign({}, base, sel('osgiken'))).sim.clutchMax >= 1200);
});
