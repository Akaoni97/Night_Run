// Ruote e auto che si fermano (v1.04). Due errori: oltre il picco della gomma lo slittamento all'indietro (freno motore,
// scalata, ruote lanciate su un'auto fermata) dava una spinta in avanti al posto di una frenata, e la ruota prendeva a
// girare all'indietro sempre più forte, sgommando anche a motore spento; il gioco che ferma l'auto di colpo (Luca Garage,
// tutorial, «Vai a») azzerava solo la velocità e non ruote e trasmissione. Qui: sim.ferma() e la gomma col segno giusto.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'cars.js', 'samples.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { CARS, SupraSim }')();
const H = 1 / 240;
const run = (s, sec, each) => { for (let t = 0; t < sec; t += H) { if (each && each(s, t) === false) return; s.update(H); s.events.length = 0; } };

function crea(id) {
  const s = new E.SupraSim(), c = E.CARS[id];
  const sel = Object.fromEntries(Object.keys(c.tuning).map((k) => [k, c.tuning[k].items[0].id]));
  s.setCar(Object.assign({}, c.P)); s.setTune(c.params(sel).sim); s.P.fwd = !!c.fwd; s.P.rearW = c.driveW;
  s.setIgnition(true); let ok = 0; run(s, 4, (x) => { ok = x.running ? ok + H : 0; x.setStarter(ok < 0.4); });
  return s;
}
// lanciata in 4ª oltre i 100 all'ora
function lancia(s) {
  s.shift(1);
  run(s, 30, (x) => { x.in.thr = 1; if (!x.shiftSeq && x.gear < 4 && x.rpm > x.P.limiter * 0.9) x.shift(x.gear + 1); if (x.gear === 4 && x.v > 30) return false; });
  s.in.thr = 0;
}

test('auto fermata di colpo con le ruote lanciate: le gomme smettono subito di slittare', () => {
  for (const id of ['e36', 'v40', 'panda141']) {
    const s = crea(id); lancia(s);
    s.v = 0;                                   // come faceva il gioco prima di ferma(): ruote ancora a 100 all'ora
    s.setIgnition(false);                       // anche a motore spento
    run(s, 1.5);
    const slip = Math.abs(s.ww * s.P.r - s.v) * 3.6;
    assert.ok(slip < 3, `${id}: ruota e auto devono tornare insieme (slittamento ${slip.toFixed(1)} km/h)`);
    assert.ok(Math.abs(s.ww * s.P.r) * 3.6 < 40, `${id}: la ruota non deve girare all'indietro sempre più forte (${(s.ww * s.P.r * 3.6).toFixed(0)} km/h)`);
    assert.ok(s.skid < 0.1, `${id}: niente sgommata (${s.skid.toFixed(2)})`);
  }
});

test('sim.ferma(): ferme anche ruote e trasmissione, niente fumo, motore acceso al minimo', () => {
  const s = crea('e36'); lancia(s);
  s.ferma();
  assert.equal(s.v, 0); assert.equal(s.ww, 0); assert.equal(s.wo, 0); assert.equal(s.kap, 0);
  run(s, 2);
  assert.ok(Math.abs(s.v) < 0.05, 'resta ferma: ' + s.v);
  assert.ok(s.skid < 0.01, 'niente fumo: ' + s.skid);
  assert.ok(s.running, 'il motore non si spegne');
  assert.ok(s.rpm < s.P.idle + 400, 'giri al minimo: ' + s.rpm.toFixed(0));
});

test('scalata brusca con la frizione mollata di colpo: freno motore, l\'auto rallenta e il motore resta acceso', () => {
  for (const [id, wet] of [['e36', 0], ['e36', 1.4], ['v850', 1], ['panda141', 0]]) {
    const s = crea(id);
    const vT = (s.P.limiter + 500) / 9.5493 / s.ratio(2) * s.P.r;        // la 2ª porta il motore oltre il limitatore
    s.shift(1);
    run(s, 60, (x) => { x.in.thr = 1; if (!x.shiftSeq && x.gear < 4 && x.rpm > x.P.limiter * 0.9) x.shift(x.gear + 1); if (x.gear >= 3 && x.v >= vT) return false; });
    s.in.thr = 0; s.wet = wet; run(s, 0.3);
    const v0 = s.v;
    s.cfg.autoClutch = false; s.in.clutch = 1; s.shift(2); s.in.clutch = 0;
    run(s, 3);
    assert.ok(s.v < v0 - 3, `${id} (bagnato ${wet}): deve rallentare, da ${(v0 * 3.6).toFixed(0)} a ${(s.v * 3.6).toFixed(0)} km/h`);
    assert.ok(s.running, `${id}: il motore non deve spegnersi (prima le ruote si bloccavano)`);
    assert.ok(Math.abs(s.ww * s.P.r - s.v) * 3.6 < 5, `${id}: ruote di nuovo agganciate all'asfalto`);
  }
});
