// Prove del banco prova (banco.js): la copia della fisica sui rulli, la curva di potenza registrata a gas pieno.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'banco.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, CARS, bancoSim, bancoRegistra, bancoPicco, bancoPulita } = new Function(src + ';return { SupraSim, CARS, bancoSim, bancoRegistra, bancoPicco, bancoPulita };')();

test('banco: la copia ha gli stessi pezzi, sui rulli tira fino al limitatore e la curva ha il picco giusto', () => {
  const sim = new SupraSim(); sim.setTune({ pw: 1.1 });
  const d = bancoSim(sim, 'supra'); assert.equal(d.tune.pw, 1.1); assert.notEqual(d, sim); assert.equal(d.P.cd, 0);
  d.setIgnition(true); d.setStarter(true);
  let ok = 0; for (let t = 0; t < 4 && ok < 0.5; t += 1 / 60) { d.update(1 / 60); ok = d.running ? ok + 1 / 60 : 0; }
  d.setStarter(false); for (let t = 0; t < 1; t += 1 / 60) d.update(1 / 60); assert.ok(d.running, 'il motore gira');
  d.shift(1); for (let t = 0; t < 1.5; t += 1 / 60) { d.in.thr = 0.5; d.update(1 / 60); }
  d.shift(2); for (let t = 0; t < 1; t += 1 / 60) d.update(1 / 60);
  d.shift(3); const curva = []; let maxRpm = 0;
  for (let t = 0; t < 25; t += 1 / 60) {
    d.in.thr = 1; d.update(1 / 60); maxRpm = Math.max(maxRpm, d.rpm);
    if (d.lock && !d.shiftSeq && d.gear === 3 && d.rpm > 1500) bancoRegistra(curva, d.rpm, Math.max(0, d.Tnet) * d.rpm / 7023, Math.max(0, d.Tnet));
  }
  assert.ok(maxRpm > d.P.limiter - 400, 'arriva al limitatore: ' + maxRpm);
  const pk = bancoPicco(curva), est = d.estimatePeak();
  assert.ok(curva.length > 20 && pk.cv.v > est.cv * 0.75 && pk.cv.v < est.cv * 1.25, `picco ${pk.cv.v} contro ${est.cv}`);
  assert.equal(sim.running, false, 'l\'auto vera non si è mossa');
});

test('banco: la curva pulita toglie i buchi di un attimo e il primo punto basso', () => {
  const c = [{ rpm: 1700, cv: 15, nm: 60 }, { rpm: 1800, cv: 50, nm: 190 }, { rpm: 1900, cv: 53, nm: 192 }, { rpm: 2000, cv: 20, nm: 60 }, { rpm: 2100, cv: 58, nm: 193 }, { rpm: 2200, cv: 60, nm: 193 }];
  assert.deepEqual(bancoPulita(c).map((p) => p.rpm), [1800, 1900, 2100, 2200]);
});

test('rulli dal vivo: sui rulli i pezzi si montano anche con le ruote che girano, in strada no', () => {
  const s2 = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
  const E = new Function(s2 + ';return { SupraSim, StreetGame };')();
  const sim = new E.SupraSim(), game = new E.StreetGame(sim, () => 0.5); game.mode = 'career';
  sim.v = 20; assert.equal(game.canMount(), false, 'in strada a 72 km/h niente pezzi');
  game.rulli = true; assert.equal(game.canMount(), true, 'sui rulli sì');
  game.rulli = false; sim.v = 0; assert.equal(game.canMount(), true, 'da fermo sì');
});
