// Prove dei comandi dell'auto: cosa compare, stato salvato, effetto sulla pressione del turbo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'comandi.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { SupraSim, StreetGame, CMD_BOOST, cmdState, cmdAvailable, cmdBoostNext, cmdExhToggle, cmdNeonToggle, cmdApply, TRUNK_KG };')();

const nuovo = () => { const sim = new E.SupraSim(), game = new E.StreetGame(sim, () => 0.5); game.startTrip(); return { sim, game }; };

test('comandi: sull\'auto di partenza non compare niente', () => {
  const { sim, game } = nuovo(); sim.tune.turbo.max = 0; sim.tune.pw = 1;      // come la Volvo ereditata: aspirata e di serie
  const a = E.cmdAvailable(game, sim, null);
  assert.deepEqual(a, { rimorchio: false, turbo: false, scarico: false, neon: false });
});

test('comandi: ogni comando compare solo quando ha senso', () => {
  const { sim, game } = nuovo(); sim.tune.turbo.max = 0; sim.tune.pw = 1;
  game.s.vg.trailer = true; assert.ok(E.cmdAvailable(game, sim, null).rimorchio);
  sim.tune.turbo.max = 0.6; assert.ok(E.cmdAvailable(game, sim, null).turbo);
  sim.tune.pw = 1.1; assert.ok(E.cmdAvailable(game, sim, null).scarico);
  assert.ok(!E.cmdAvailable(game, sim, { glow: 'none' }).neon); assert.ok(E.cmdAvailable(game, sim, { glow: '#2ee6ff' }).neon);
});

test('comandi: pressione, scarico e neon cambiano e si salvano con la partita', () => {
  const { sim, game } = nuovo(); sim.tune.turbo.max = 0.6;
  assert.equal(E.cmdBoostNext(game.s).id, 'forte'); assert.equal(E.cmdBoostNext(game.s).id, 'eco'); assert.equal(E.cmdBoostNext(game.s).id, 'norm');
  assert.equal(E.cmdExhToggle(game.s), 0); assert.equal(E.cmdNeonToggle(game.s), 0);
  E.cmdBoostNext(game.s); const json = game.save(), g2 = new E.StreetGame(new E.SupraSim(), () => 0.5); g2.load(json);
  assert.deepEqual(g2.s.cmd, { boost: 2, exh: 0, neon: 0 });
});

test('comandi: la pressione FORTE dà più coppia di ECO, e senza turbo non cambia nulla', () => {
  assert.ok(E.CMD_BOOST[2].k > E.CMD_BOOST[0].k);
  const { sim, game } = nuovo(); sim.tune.turbo.max = 0; E.cmdState(game.s).boost = 2; E.cmdApply(game, sim, null); assert.equal(sim.boostCtl, 1, 'senza turbo il comando non agisce');
  sim.tune.turbo.max = 0.7; E.cmdApply(game, sim, null); assert.equal(sim.boostCtl, 1.2);
});

test('comandi: lo sgancio del rimorchio controlla anche i chili', () => {
  const { sim, game } = nuovo(); game.s.vg.trailer = true; game.s.vg.trailerOn = true; game.s.trunk = [{ kind: 'scatola', kg: E.TRUNK_KG + 50, name: 'pesante' }];
  const r = game.vgTrailer(false); assert.ok(!r.ok, 'troppo peso per il solo bagagliaio'); assert.ok(game.s.vg.trailerOn);
  game.s.trunk = [{ kind: 'scatola', kg: 10, name: 'leggera' }]; assert.ok(game.vgTrailer(false).ok);
});

// pressione vera: la mappa ECO / NORMALE / FORTE cambia i bar in tubo, non solo la coppia
function picco(k) {
  const sim = new E.SupraSim(); sim.tune.turbo.max = 0.9; sim.boostCtl = k;
  const fino = (sec, each) => { for (let t = 0; t < sec; t += 1 / 60) { each(t); sim.update(1 / 60); sim.events.length = 0; } };
  sim.setIgnition(true); fino(4, (t) => sim.setStarter(t < 1.2));
  sim.shift(2); let max = 0; fino(6, () => { sim.in.thr = 1; if (sim.rpm > 6500 && sim.gear < 4 && !sim.shiftSeq) sim.shift(sim.gear + 1); max = Math.max(max, sim.pipeP); });
  return { bar: max, cv: sim.estimatePeak().cv };
}
test('comandi: ECO, NORMALE e FORTE cambiano la pressione in tubo e la potenza', () => {
  const eco = picco(E.CMD_BOOST[0].k), norm = picco(1), forte = picco(E.CMD_BOOST[2].k);
  assert.ok(eco.bar < norm.bar * 0.8, `ECO ${eco.bar.toFixed(2)} bar contro NORMALE ${norm.bar.toFixed(2)}`);
  assert.ok(forte.bar > norm.bar * 1.1, `FORTE ${forte.bar.toFixed(2)} bar contro NORMALE ${norm.bar.toFixed(2)}`);
  assert.ok(eco.cv < norm.cv && norm.cv < forte.cv, `CV ${eco.cv.toFixed(0)} < ${norm.cv.toFixed(0)} < ${forte.cv.toFixed(0)}`);
  // v0.106: la wastegate fa un picco di un attimo sopra il target, come sulle auto vere (ritardo della capsula), poi si assesta
  assert.ok(forte.bar <= 0.9 * 1.2 * 1.18, `FORTE: il picco della wastegate resta contenuto (${forte.bar.toFixed(2)} bar)`);
});
