// Prove dell'entrata nei locali: l'auto si ferma qualche metro prima della porta e da lì svolta nel piazzale
// (entrata2d.js la disegna); parcheggia sempre davanti alla facciata; uscendo la strada riparte in avanti, mai indietro.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, VG, GAME_ENT_IN, GAME_ENT_OUT, GAME_LANE_Z } = new Function(src + ';return { SupraSim, StreetGame, VG, GAME_ENT_IN, GAME_ENT_OUT, GAME_LANE_Z };')();

const vera = () => {
  const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip();
  game.trafficOn = false; game.nextRoadEvent = 1e9; game.ents = []; game.placesOn = true;
  game.s.vg.firstDone = true; game.s.vg.tutEnd = true; sim.cfg.autoClutch = true;
  sim.setIgnition(true); sim.setStarter(true);
  const step = (secs, pedali) => { for (let i = 0; i < secs * 60; i++) { const o = game.control(pedali ? pedali() : { thr: sim.in.thr, brake: sim.in.brake }, 1 / 60); sim.in.thr = o.thr; sim.in.brake = o.brake; sim.update(1 / 60); game.update(1 / 60); } };
  step(2); sim.setStarter(false);
  return { sim, game, step };
};

test('entrata: arrivando a 40 km/h ci si ferma qualche metro prima della porta, senza strisciare, poi si svolta nel piazzale', () => {
  const { sim, game, step } = vera(); const T = VG.stop(3);
  sim.shift(1); game.s.dist = T.x - 70; sim.v = 11; sim.wo = sim.ww = 11 / 0.31; step(0.1);
  const p = game.nearPlace(); assert.ok(p && p.ok && p.x === T.x);
  game.enterPlace(p);
  let t = 0; while (!game.inside && t < 20) { step(0.05); t += 0.05; }
  assert.ok(game.inside, 'entra');
  const c = game.s.dist - T.x;
  assert.ok(c > -7 && c < -3, `fermo ${(-c).toFixed(1)} m prima della porta`);
  assert.ok(game.inside.park - game.inside.from >= 3, 'da lì va avanti di qualche metro');
  assert.equal(game.laneZ, GAME_LANE_Z[3]);
  step(GAME_ENT_IN + 0.1); assert.equal(game.inside.phase, 'shop');
});

test('entrata: parcheggio sempre davanti alla facciata; appena passata la porta si entra in retro', () => {
  const { sim, game, step } = vera();
  let n = 0, retro = 0;
  for (const off of [-8, -5, -2, 0, 2, 3, 5, 8, 11]) {
    const T = VG.stop(5); game.inside = null; game.ap = null; game.s.dist = T.x + off; sim.v = 0;
    const p = game.nearPlace(); if (!p || !p.ok) continue;          // troppo oltre: il gioco non fa entrare (regola di sempre)
    game.enterPlace(p); n++; step(0.3);
    const I = game.inside; assert.ok(I, `entra da ${off} m`);
    assert.ok(I.park >= -4.01 && I.park <= 6.01, `parcheggia a ${I.park} m dalla porta`);
    assert.ok(Math.abs(I.park - I.from) >= 2.5, `si muove davvero (${I.from} → ${I.park})`);
    if (off >= 0) { assert.ok(I.park < I.from, 'oltre la porta: in retro'); retro++; }
  }
  assert.ok(n >= 5 && retro >= 2, `provati ${n} punti, ${retro} in retro`);
});

test('uscita: dal piazzale si scende in avanti, la strada non torna mai indietro', () => {
  const { sim, game, step } = vera(); const T = VG.stop(4);
  game.s.dist = T.x - 2; sim.v = 0; game.enterPlace(game.nearPlace()); step(GAME_ENT_IN + 0.5);
  assert.equal(game.inside.phase, 'shop');
  const d0 = game.s.dist; game.exitPlace();
  assert.ok(game.s.dist >= d0 && game.s.dist >= game.inside.outFrom + 4, 'si riparte qualche metro più avanti');
  step(GAME_ENT_OUT + 0.2); assert.equal(game.inside, null);
});
