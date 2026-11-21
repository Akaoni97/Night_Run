// Prove di Luca Garage: il negozio più vicino, il passaggio a pagamento e le condizioni per partire.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'lucagarage.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, VG, LG } = new Function(src + ';return { SupraSim, StreetGame, VG, LG };')();
const trip = () => { const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.money = 5000; return { sim, game }; };

test('luca garage: trova il negozio di Luca più vicino, davanti o dietro', () => {
  const { game } = trip();
  const n = game.lgNear(); assert.equal(VG.stop(n.n).id, 'shop');
  game.s.dist = n.x + 3000; const dietro = game.lgNear();
  assert.equal(dietro.n, n.n); assert.equal(dietro.avanti, false);
  game.s.dist = n.x - 3000; assert.equal(game.lgNear().avanti, true);
});

test('luca garage: il passaggio costa, ti lascia fermo davanti alla porta e non si può rifare lì', () => {
  const { sim, game } = trip(); const n = game.lgNear();
  const m = game.s.money; sim.v = 0;
  const r = game.lgGo(); assert.ok(r.ok);
  assert.equal(game.s.money, m - LG.prezzo);
  assert.equal(game.s.dist, n.x - LG.davanti); assert.equal(sim.v, 0);
  assert.equal(game.lgGo().ok, false, 'già davanti a Luca'); assert.equal(game.s.money, m - LG.prezzo);
});

test('luca garage: serve da fermi, fuori da un locale e con i soldi', () => {
  const { sim, game } = trip(); game.s.dist = game.lgNear().x + 5000;
  sim.v = 20; assert.match(game.lgGo().why, /Fermati/);
  sim.v = 0; game.inside = { id: 'bar' }; assert.match(game.lgGo().why, /esci/);
  game.inside = null; game.s.money = LG.prezzo - 1; assert.match(game.lgGo().why, /Servono/);
  game.s.money = LG.prezzo; assert.ok(game.lgGo().ok); assert.equal(game.s.money, 0);
});
