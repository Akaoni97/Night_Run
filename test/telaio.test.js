// Telaio e trazione veri delle auto da disegno (v0.85): passo, baricentro, peso sull'asse motore, gomme e ruote di ogni
// auto al posto dei valori uguali per tutte; velocità massima e 0-100 vicini a quelli veri. Supra e V40 restano com'erano.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'suoni.js', 'cars.js', 'samples.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { CARS, GEN_NEW, GEN_TELAIO, SupraSim, TUNING_PRESETS, tuningParams }')();
const H = 1 / 240;
const drive = (s, sec, each) => { for (let t = 0; t < sec; t += H) { if (each?.(s, t) === false) return; s.update(H); s.events.length = 0; } };

function corsa(id) {
  const s = new E.SupraSim(), c = E.CARS[id];
  const sel = Object.fromEntries(Object.keys(c.tuning).map((k) => [k, c.tuning[k].items[0].id]));
  s.setCar(Object.assign({}, c.P)); s.setTune(c.params(sel).sim); s.P.fwd = !!c.fwd; s.P.rearW = c.driveW;
  s.cfg.tc = true; s.setIgnition(true); drive(s, 4, (x, t) => x.setStarter(t < 1.2)); s.shift(1);
  let boxT = 0.5, t100 = 0, vmax = 0, tv = 0;
  drive(s, 150, (x, t) => {
    x.in.thr = 1; boxT -= H;
    if (boxT <= 0 && !x.shiftSeq && x.gear >= 1) {
      const P = x.P, g = x.gear, rpmAt = (n) => Math.abs(x.wo * x.ratio(n)) * 9.5493;
      if (g < P.gears.length - 1 && x.rpm > P.idle + (P.limiter - P.idle) * 0.91 && rpmAt(g + 1) > P.idle + 350 && x.shift(g + 1)) boxT = 0.7;
    }
    const k = x.v * 3.6; if (!t100 && k >= 100) t100 = t;
    if (k > vmax + 0.05) { vmax = k; tv = t; } else if (t - tv > 12) return false;
  });
  return { t100, vmax };
}

test('ogni auto da disegno ha il suo telaio, non quello comune', () => {
  for (const q of E.GEN_NEW) {
    const id = q[0], T = E.GEN_TELAIO[id], P = E.CARS[id].P;
    assert.ok(T, id + ' senza telaio');
    assert.equal(P.wb, T.wb, id + ' passo'); assert.equal(P.cgH, T.cgH, id + ' baricentro');
    assert.equal(E.CARS[id].driveW, T.dw, id + ' peso sull\'asse motore'); assert.equal(E.CARS[id].mu, T.mu, id + ' gomme');
    assert.ok(T.dw > 0.45 && T.dw < 0.7 && T.cgH > 0.45 && T.wb > 2 && T.mu >= 0.88 && T.mu <= 1.05, id + ' valori fuori misura');
  }
  // le ruote seguono la misura: una Panda 141 non gira con le ruote della Supra
  assert.ok(E.CARS.panda141.P.Iw < 2 && E.CARS.panda141.P.Iwf < 1.4, 'ruote della Panda 141 leggere');
  assert.ok(E.CARS.v850.P.Iwf > E.CARS.panda141.P.Iwf * 1.5, 'ruote da 17 della 850 R più pesanti');
});

test('Supra e V40 restano come prima', () => {
  const v = E.CARS.v40.P;
  assert.equal(v.wb, 2.56); assert.equal(v.cgH, 0.52); assert.equal(v.Iwf, 1.6); assert.equal(v.lossK, undefined); assert.equal(v.Iw, undefined);
  assert.equal(E.CARS.v40.driveW, 0.61); assert.equal(new E.SupraSim().P.lossK, undefined);
});

test('velocità massima e 0-100 vicini ai dati veri', () => {
  // [0-100 min, max, velocità massima min, max] dalle prove su strada (con un margine: il modello è semplice)
  const att = { e30: [6.3, 7.3, 228, 245], panda: [13, 15.5, 152, 170], polo: [14.5, 18, 155, 176], ax: [11, 14, 155, 168], aygo: [12, 15, 152, 165], v850: [6.5, 7.6, 235, 260] };
  for (const [id, [a, b, c, d]] of Object.entries(att)) {
    const r = corsa(id);
    assert.ok(r.t100 > a && r.t100 < b, `${id}: 0-100 in ${r.t100.toFixed(1)} s, atteso tra ${a} e ${b}`);
    assert.ok(r.vmax > c && r.vmax < d, `${id}: ${r.vmax.toFixed(0)} km/h, attesi tra ${c} e ${d}`);
  }
});
