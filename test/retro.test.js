// Prove della retromarcia nel viaggio: se ti fermi poco oltre un locale torni indietro e ci entri;
// più di GAME_BACK_MAX metri indietro non si va (l'autostrada resta a senso unico).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, VG, GAME_BACK_MAX } = new Function(src + ';return { SupraSim, StreetGame, VG, GAME_BACK_MAX };')();

// il primo lavoro col pacco già a bordo: la tappa giusta è il benzinaio della consegna
const setup = () => {
  const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip();
  game.trafficOn = false; game.nextRoadEvent = 1e9; game.ents = []; game.placesOn = true;
  game.s.trunk.push({ kind: 'missione', first: true, name: 'Pacco' });
  return { sim, game, T: VG.stop(1) };
};
// gira il ciclo vero del gioco con l'auto a velocità fissa (negativa = in retro)
const vai = (game, v, secs) => { for (let i = 0; i < secs * 60; i++) { game.sim.v = v; game.update(1 / 60); } };

test('retro: fermo 20 m oltre il locale del primo lavoro, torno indietro in retro e posso entrare', () => {
  const { sim, game, T } = setup();
  game.s.dist = T.x - 100; vai(game, 10, 12);                       // arrivo e lo supero di 20 m
  assert.ok(Math.abs(game.s.dist - (T.x + 20)) < 1, `sono a ${(game.s.dist - T.x).toFixed(1)} m dal locale`);
  const p0 = game.nearPlace(); assert.ok(!p0 || !p0.ok || p0.x !== T.x, 'da lì non si entra');
  vai(game, -2, 7);                                                 // retro a 7 km/h per 7 s: 14 m indietro
  assert.ok(game.s.dist < T.x + 8, `tornato a ${(game.s.dist - T.x).toFixed(1)} m dal locale`);
  sim.v = 0; const p = game.nearPlace();
  assert.ok(p && p.ok && p.x === T.x, 'adesso il locale è lì e ci si può fermare');
});

test(`retro: più di ${60} m indietro non si va, e il contachilometri non conta la retro`, () => {
  const { game, T } = setup();
  game.s.dist = T.x - 400; vai(game, 10, 5);
  const far = game.s.dist, km = game.s.cars[game.car].km;
  vai(game, -3, 40);                                                // 120 m di retro
  assert.ok(Math.abs(game.s.dist - (far - GAME_BACK_MAX)) < 0.5, `fermo a ${(far - game.s.dist).toFixed(1)} m dal punto più lontano`);
  assert.equal(game.s.cars[game.car].km, km);
  vai(game, 10, 3); assert.ok(game.s.dist > far - GAME_BACK_MAX + 25, 'e poi si riparte in avanti');
});

test('retro: dopo un salto all\'indietro (partita nuova, tutorial) la retro funziona e non spinge mai avanti', () => {
  const { game } = setup();
  game.s.dist = 5000; vai(game, 10, 1);
  game.s.dist = 200;                                                // salto all'indietro senza retro
  vai(game, -2, 3);
  assert.ok(game.s.dist < 200 && game.s.dist > 190, `retro dopo il salto: ${game.s.dist.toFixed(1)}`);
});
