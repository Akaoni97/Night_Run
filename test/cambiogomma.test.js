// Prove del cambio gomma animato (cambiogomma.js + changeTyre di viaggio.js): l'auto va a destra e si ferma, il
// protagonista scende, prende la scorta, la monta e risale; la gomma torna buona solo a lavoro finito.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'forature.js', 'missioni.js', 'cambiogomma.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, CG, cgTimeline, cgAt, GAME_LANE_Z } = new Function(src + ';return { SupraSim, StreetGame, CG, cgTimeline, cgAt, GAME_LANE_Z };')();

test('cambio gomma: la sequenza va porta → bagagliaio → ruota → bagagliaio → porta', () => {
  const TL = cgTimeline(0), ks = TL.segs.map((s) => s.k);
  assert.deepEqual(ks, ['out', 'walk', 'baule', 'walk', 'lavoro', 'walk', 'posa', 'walk', 'in']);
  assert.ok(TL.end > 10 && TL.end < 20, 'durata ' + TL.end);
  const lav = TL.segs.find((s) => s.k === 'lavoro');
  assert.equal(cgAt(TL, (lav.t0 + lav.t1) / 2).kneel, true);
  assert.equal(cgAt(TL, lav.t1 - 0.01).fase, 'giu');
  assert.equal(cgAt(TL, TL.segs[3].t0 + 0.1).carry, 'scorta', 'va alla ruota con la scorta in mano');
  assert.equal(cgAt(TL, TL.segs[5].t0 + 0.1).carry, 'forata', 'torna con la forata');
  assert.equal(cgAt(TL, TL.end + 1), null);
  assert.ok(cgTimeline(2).end < cgTimeline(0).end, 'la posteriore è più vicina al bagagliaio');
});

test('cambio gomma: da «Usa» sulla scorta, a destra, poi la gomma torna buona a lavoro finito', () => {
  const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip();
  const T = game.tyres(); T.p[1] = 0.3; game.lane = 1; game.laneZ = GAME_LANE_Z[1];
  const si = game.s.trunk.findIndex((x) => x.kind === 'scorta');
  const r = game.useItem(si);
  assert.equal(r.ok, true, r.why);
  assert.equal(game.lane, 3, 'va nella corsia di destra');
  assert.ok(game.ap && game.ap.gomma, 'pilota automatico col cambio gomma');
  assert.ok(!game.s.trunk.some((x) => x.kind === 'scorta'), 'la scorta è uscita dal bagagliaio');
  const G = game.ap.gomma, end = G.tl.end;
  game.ap.stopped = true; game.laneZ = GAME_LANE_Z[3];
  for (let t = 0; t < end - 0.5; t += 0.1) game.ap.tick(0.1);
  assert.ok(T.p[1] < 1, 'a metà lavoro la gomma è ancora a terra');
  for (let t = 0; t < 1; t += 0.1) if (game.ap) game.ap.tick(0.1);
  assert.equal(game.ap, null, 'auto di nuovo tua');
  assert.ok(T.p[1] > 1.9, 'gomma cambiata');
  assert.ok(game.s.trunk.some((x) => x.kind === 'forata'), 'la forata nel bagagliaio');
});
