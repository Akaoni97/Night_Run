// Prove del traffico: chi arriva da dietro rallenta, il distratto (circa 1 su 12) può tamponarti, le gomme stridono.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame } = new Function(src + ';return { SupraSim, StreetGame };')();

const setup = () => { const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.vg.firstDone = true; game.s.dist = 9000; game.ents = []; return { sim, game }; };
const car = (game, dx, v, t) => {
  const e = { id: 900 + Math.floor(Math.random() * 99), kind: 'traffic', vt: 'polo', len: 4, lane: game.lane, x: game.s.dist + dx, v, vT: v, vBase: v };
  e.drv = { t, T: t === 'aggressivo' ? 0.75 : 1.5, a: 1.6, b: 3 }; game.ents.push(e); return e;
};
// fa avanzare solo l'auto dietro (il giocatore resta alla sua velocità) e dice la distanza minima
const corri = (game, e, vMe, secs) => {
  const dt = 1 / 60; let min = Infinity, maxB = 0;
  game.sim.v = vMe;
  for (let i = 0; i < secs * 60; i++) {
    const F = game.trafficAccel(e, game.s.dist, dt);
    e.v = Math.max(0, e.v + F.acc * dt); e.x += e.v * dt; game.s.dist += vMe * dt;
    maxB = Math.max(maxB, -F.acc);
    min = Math.min(min, game.s.dist - e.x - (e.len + 4.5) / 2);
  }
  return { min, maxB };
};

test('traffico: un guidatore normale che arriva forte da dietro rallenta e non tampona', () => {
  for (const [dx, vE, vMe] of [[-150, 33, 0], [-80, 36, 15], [-60, 30, 22], [-200, 40, 8]]) {
    const { game } = setup(), e = car(game, dx, vE, 'normale');
    const r = corri(game, e, vMe, 25);
    assert.ok(r.min > 0.5, `da ${-dx} m a ${vE} m/s contro ${vMe} m/s resta a ${r.min.toFixed(1)} m`);
  }
});

test('traffico: dietro una frenata vera si inchioda, le gomme stridono e le luci dei freni si accendono (ciclo vero del gioco)', () => {
  const { sim, game } = setup(); game.trafficOn = false; game.nextRoadEvent = 1e9;
  const e = car(game, -40, 30, 'normale');
  sim.v = 0; game.fx = [];
  let skid = false, brk = false;
  for (let i = 0; i < 90; i++) { sim.v = 0; game.update(1 / 60); if (game.fx.some((f) => f.k === 'skid')) skid = true; if (e.acc < -1.3) brk = true; game.fx = []; }
  assert.ok(skid, 'gomme che stridono'); assert.ok(brk, 'luci dei freni');
  assert.ok(!sim.events.some((x) => x.type === 'crash'), 'e non ti prende');
});

test('traffico: il distratto si accorge tardi e ti tampona; il normale nella stessa situazione no', () => {
  const run = (t) => { const { game } = setup(), e = car(game, -120, 33, t); return corri(game, e, 14, 25); };
  assert.ok(run('normale').min > 0.5);
  assert.ok(run('distratto').min <= 0, 'il distratto arriva addosso');
});

test('traffico: i distratti sono circa uno su dodici, i pesanti mai', () => {
  const { game } = setup(); let dis = 0, n = 6000;
  for (let i = 0; i < n; i++) { const e = { len: 4, vBase: 30 }; if (game.trafficDriver(e).t === 'distratto') dis++; }
  assert.ok(dis / n > 0.06 && dis / n < 0.11, `distratti: ${(dis / n * 100).toFixed(1)} %`);
  for (let i = 0; i < 300; i++) assert.notEqual(game.trafficDriver({ len: 12, vBase: 25 }).t, 'distratto');
});

test('traffico: dietro un\'altra auto più lenta si accoda alla sua velocità senza toccarla', () => {
  const { game } = setup(), lead = car(game, 60, 22, 'normale'), e = car(game, 0, 33, 'aggressivo');
  game.sim.v = 0; game.laneZ = 99;                                   // il giocatore è altrove
  const dt = 1 / 60; let min = Infinity;
  for (let i = 0; i < 40 * 60; i++) {
    const F = game.trafficAccel(e, game.s.dist, dt); e.v = Math.max(0, e.v + F.acc * dt); e.x += e.v * dt; lead.x += lead.v * dt;
    min = Math.min(min, lead.x - e.x - 4);
  }
  assert.ok(min > 0.5, `distanza minima ${min.toFixed(1)} m`);
  assert.ok(Math.abs(e.v - 22) < 1, `si accoda a ${e.v.toFixed(1)} m/s`);
  const gap = lead.x - e.x - 4; assert.ok(gap > 10 && gap < 30, `attaccato ma non troppo: ${gap.toFixed(1)} m`);
});
