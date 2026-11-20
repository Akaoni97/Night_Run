// Prove dell'entrata nei locali: l'auto si ferma qualche metro prima della porta e da lì svolta nel piazzale
// (entrata2d.js la disegna); parcheggia sempre davanti alla facciata; uscendo la strada riparte in avanti, mai indietro.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, VG, GAME_LANE_Z, GAME_POSTI } = new Function(src + ';return { SupraSim, StreetGame, VG, GAME_LANE_Z, GAME_POSTI };')();

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
  const park = GAME_POSTI[T.id].park;
  assert.ok(c - park > -7 && c - park < -3, `fermo ${(park - c).toFixed(1)} m prima del posto auto`);
  assert.equal(game.inside.park, park, 'parcheggia nel posto del locale');
  assert.ok(game.inside.walk > 0.5 && game.inside.dur > game.inside.walk + 2, 'poi scende e va a piedi alla porta');
  assert.equal(game.laneZ, GAME_LANE_Z[3]);
  step(game.inside.dur - 0.3); assert.equal(game.inside.phase, 'in', 'cammina ancora');
  step(0.4); assert.equal(game.inside.phase, 'shop');
});

test('entrata: sempre nello stesso posto auto del locale, avanti o in retro', () => {
  const { sim, game, step } = vera();
  let n = 0, retro = 0;
  for (const off of [-8, -5, -2, 0, 2, 3, 5, 8, 11]) {
    const T = VG.stop(5); game.inside = null; game.ap = null; game.s.dist = T.x + off; sim.v = 0;
    const p = game.nearPlace(); if (!p || !p.ok) continue;          // troppo oltre: il gioco non fa entrare (regola di sempre)
    game.enterPlace(p); n++; step(0.3);
    const I = game.inside; assert.ok(I, `entra da ${off} m`);
    assert.equal(I.park, GAME_POSTI[T.id].park, `posto del locale anche da ${off} m`);
    if (I.park < I.from) retro++;
  }
  assert.ok(n >= 5 && retro >= 2, `provati ${n} punti, ${retro} in retro`);
  for (const [id, P] of Object.entries(GAME_POSTI)) assert.ok(P.park >= -4 && P.park <= 4 && P.door >= -1 && P.door <= 6.5, `${id}: posto e porta dentro la facciata`);
});

test('uscita: dal piazzale si scende in avanti, la strada non torna mai indietro', () => {
  const { sim, game, step } = vera(); const T = VG.stop(4);
  game.s.dist = T.x - 2; sim.v = 0; game.enterPlace(game.nearPlace()); step(0.2); step(game.inside.dur + 0.2);
  assert.equal(game.inside.phase, 'shop');
  const d0 = game.s.dist; game.exitPlace();
  assert.ok(game.s.dist >= d0 && game.s.dist >= game.inside.outFrom + 4, 'si riparte qualche metro più avanti');
  const out = game.inside.durOut; assert.ok(out > 2, 'torna a piedi all\'auto');
  game.entSkip(); step(1.6); assert.equal(game.inside, null, 'U salta la camminata');
});

test('entrata: U durante la camminata salta al buio', () => {
  const { sim, game, step } = vera(); const T = VG.stop(4);
  game.s.dist = T.x - 2; sim.v = 0; game.enterPlace(game.nearPlace()); step(2.2);
  assert.equal(game.inside.phase, 'in'); game.entSkip(); step(0.6); assert.equal(game.inside.phase, 'shop');
});
