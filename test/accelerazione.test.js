// Lo scatto delle auto (v0.71): le potenti non devono perdere la spinta quando sgommano, le piccole non cambiano.
// Partenza da fermi a gas pieno col cambio automatico di index.html (autoBox), con e senza controllo di trazione.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'cars.js', 'samples.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { CARS, SupraSim, TUNING_PRESETS, tuningParams }')();
const H = 1 / 240;
const drive = (s, sec, each) => { for (let t = 0; t < sec; t += H) { each?.(s, t); s.update(H); s.events.length = 0; } };

function crea(id, tc) {
  const s = new E.SupraSim(), c = E.CARS[id];
  if (id === 'supra') s.setTune(E.tuningParams(E.TUNING_PRESETS.find((p) => p.id === 'stock').sel).sim);
  else {
    const sel = Object.fromEntries(Object.keys(c.tuning).map((k) => [k, c.tuning[k].items[0].id]));
    s.setCar(Object.assign({}, c.P)); s.setTune(c.params(sel).sim);
    s.P.fwd = !!c.fwd; s.P.rearW = c.driveW;                         // come fa game.applyMass
  }
  s.cfg.tc = tc; s.setIgnition(true); drive(s, 4, (x, t) => x.setStarter(t < 1.2));
  return s;
}
// stessa logica di autoBox in index.html, a gas pieno
function scatto(id, tc) {
  const s = crea(id, tc); s.shift(1);
  let boxT = 0.5, t60 = 0, t100 = 0;
  drive(s, 30, (x, t) => {
    x.in.thr = 1; boxT -= H;
    if (boxT <= 0 && !x.shiftSeq && x.gear >= 1) {
      const P = x.P, top = P.gears.length - 1, g = x.gear, rpmAt = (n) => Math.abs(x.wo * x.ratio(n)) * 9.5493;
      const up = P.idle + (P.limiter - P.idle) * 0.91;
      if (g < top && x.rpm > up && rpmAt(g + 1) > P.idle + 350 && x.shift(g + 1)) boxT = 0.7;
    }
    const k = x.v * 3.6; if (!t60 && k >= 60) t60 = t; if (!t100 && k >= 100) t100 = t;
  });
  return { t60, t100 };
}

test('le potenti hanno più sprint: 0-100 vicino ai tempi veri', () => {
  const att = { supra: [5.2, 6.0], e36: [5.7, 6.5], e34: [5.8, 6.6], v850: [6.7, 7.6] };
  for (const [id, [a, b]] of Object.entries(att)) {
    const r = scatto(id, true);
    assert.ok(r.t100 > a && r.t100 < b, `${id}: 0-100 in ${r.t100.toFixed(2)} s, atteso tra ${a} e ${b}`);
  }
});

test('sgommare non costa quasi niente: senza controllo di trazione non si va molto più piano', () => {
  for (const id of ['supra', 'e36', 'e34', 'v850']) {
    const on = scatto(id, true), off = scatto(id, false);
    assert.ok(off.t100 < on.t100 + 0.35, `${id}: con TC ${on.t100.toFixed(2)} s, senza ${off.t100.toFixed(2)} s`);
    assert.ok(off.t60 < on.t60 + 0.45, `${id}: 0-60 con TC ${on.t60.toFixed(2)} s, senza ${off.t60.toFixed(2)} s`);
  }
});

test('le piccole restano com\'erano: niente scatti da supercar', () => {
  const att = { panda: [13.5, 16.5], golf: [8.3, 9.6], v40: [8.6, 10.2], polo: [15.5, 18.5] };
  for (const [id, [a, b]] of Object.entries(att)) {
    const r = scatto(id, true);
    assert.ok(r.t100 > a && r.t100 < b, `${id}: 0-100 in ${r.t100.toFixed(2)} s, atteso tra ${a} e ${b}`);
  }
});
