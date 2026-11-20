// Prove delle statistiche (statistiche.js): contano fughe, prese, vmax, auto distrutte, volte in rosso.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'documenti.js', 'polizia.js', 'statistiche.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, STAT_VOCI } = new Function(src + ';return { SupraSim, StreetGame, STAT_VOCI };')();

test('statistiche: fughe, prese, velocità massima, auto distrutte e rosso si contano; la scheda le scrive tutte', () => {
  const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.vg.firstDone = true;
  game.polRnd = () => 0.9; game.nextSpawn = 1e9; game.trafficOn = false; game.nextRoadEvent = 1e9; game.s.money = 5000;
  const d = game.docs(); d.ass = d.bollo = d.rev = 1e6; game.s.dist = 20000; game.s.far = 20000;
  for (let i = 0; i < 6; i++) { game.update(1 / 30); if (game.prompt) game.answer(0); } game.prompt = null;
  sim.v = 40; game.update(1 / 30);
  assert.ok(game.stats().vmax >= 140);
  game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop(); game.answer(2);
  assert.equal(game.stats().fughe, 1);
  game.polPresa(game.pol.ch.e); assert.equal(game.stats().prese, 1);
  sim.damage = 1; game.update(1 / 30); game.update(1 / 30); assert.equal(game.stats().rotte, 1, 'una volta sola');
  game.s.money = -10; game.update(1 / 30); assert.equal(game.stats().rosso, 1);
  const L = game.statList(); assert.equal(L.length, STAT_VOCI.length); assert.ok(L.every((x) => x.nome && x.testo !== 'NaN'));
});
