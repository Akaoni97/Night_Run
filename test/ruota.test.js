// Prove della ruota giornaliera: un giro al giorno, serie, giro d'oro, probabilità, premi veri.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'valigette.js', 'traguardi.js', 'ruota.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, RUOTA_SEG, RUOTA_PREV } = new Function(src + ';return { SupraSim, StreetGame, RUOTA_SEG, RUOTA_PREV };')();

const trip = () => { const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); return { sim, game }; };
const lcg = (seed) => () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const idx = (id) => RUOTA_SEG.findIndex((S) => S.id === id);
// rnd che fa uscire lo spicchio i (prima chiamata), poi numeri qualsiasi
const pickRnd = (game, i, gold = false) => { const o = game.ruotaOdds(gold); let a = 0; for (let k = 0; k < i; k++) a += o[k]; const v = (a + o[i] / 2) / 100; let first = true; return () => (first ? ((first = false), v) : 0.5); };

test('ruota: dodici spicchi, pesi che fanno 100, auto leggendaria all\'1 %', () => {
  assert.equal(RUOTA_SEG.length, 12);
  assert.ok(Math.abs(RUOTA_SEG.reduce((a, S) => a + S.w, 0) - 100) < 1e-9);
  const car = RUOTA_SEG[idx('auto')]; assert.equal(car.rar, 5); assert.equal(car.w, 1);
  assert.equal(new Set(RUOTA_SEG.map((S) => S.id)).size, 12);
});

test('ruota: un giro solo al giorno, il giorno dopo si rigira', () => {
  const { game } = trip();
  assert.ok(game.ruotaReady('2026-11-17'));
  assert.ok(game.ruotaSpin(lcg(1), '2026-11-17'));
  assert.equal(game.ruotaSpin(lcg(2), '2026-11-17'), null, 'secondo giro nello stesso giorno');
  assert.ok(game.ruotaReady('2026-11-18')); assert.ok(game.ruotaSpin(lcg(3), '2026-11-18'));
});

test('ruota: la serie cresce giorno dopo giorno e si azzera se salti', () => {
  const { game } = trip();
  assert.equal(RUOTA_PREV('2026-03-01'), '2026-02-28'); assert.equal(RUOTA_PREV('2027-01-01'), '2026-12-31');
  for (const d of ['2026-11-28', '2026-11-29', '2026-11-30', '2026-12-01']) game.ruotaSpin(lcg(5), d);
  assert.equal(game.ruota().streak, 4);
  game.ruotaSpin(lcg(5), '2026-12-03'); assert.equal(game.ruota().streak, 1, 'saltato il 2');
  assert.equal(game.ruota().best, 4);
});

test('ruota: il settimo giorno di fila è il giro d\'oro, senza premi comuni', () => {
  const { game } = trip(), rnd = lcg(11);
  for (let d = 1; d <= 6; d++) { assert.ok(!game.ruotaGold(`2026-12-0${d}`)); game.ruotaSpin(rnd, `2026-12-0${d}`); }
  assert.ok(game.ruotaGold('2026-12-07'));
  const o = game.ruotaOdds(true);
  RUOTA_SEG.forEach((S, i) => { if (S.rar === 0) assert.equal(o[i], 0, S.id); });
  assert.ok(Math.abs(o.reduce((a, b) => a + b, 0) - 100) < 1e-9);
  for (let k = 0; k < 200; k++) { game.ruota().last = '2026-12-06'; game.ruota().streak = 6; const p = game.ruotaSpin(rnd, '2026-12-07'); assert.ok(p.gold && RUOTA_SEG[p.seg].rar > 0, 'mai un comune nel giro d\'oro'); }
});

test('ruota: le frequenze seguono le probabilità', () => {
  const { game } = trip(), rnd = lcg(42), n = 6000, cnt = RUOTA_SEG.map(() => 0);
  for (let k = 0; k < n; k++) { game.ruota().last = null; game.ruota().streak = 0; cnt[game.ruotaSpin(rnd, '2026-11-17').seg]++; }
  RUOTA_SEG.forEach((S, i) => { const f = cnt[i] / n * 100; assert.ok(Math.abs(f - S.w) < Math.max(0.8, S.w * 0.2), `${S.id}: ${f.toFixed(2)} % contro ${S.w} %`); });
});

test('ruota: i premi arrivano davvero (soldi, valigetta, ticket, potenziamento, auto)', () => {
  const { game } = trip(); let day = 0; const next = () => `2026-10-${String(++day).padStart(2, '0')}`;
  game.s.money = 0; game.ruotaSpin(pickRnd(game, idx('m2500')), next()); assert.equal(game.s.money, 2500);
  game.ruotaSpin(pickRnd(game, idx('oro')), next()); assert.ok(game.cases().own.some((c) => c.type === 'oro' && c.why === 'la ruota'));
  const t0 = game.cases().tickets.mod; game.ruotaSpin(pickRnd(game, idx('mod')), next()); assert.equal(game.cases().tickets.mod, t0 + 1);
  game.ruotaSpin(pickRnd(game, idx('pista')), next()); assert.ok(game.cases().boosts.some((b) => b.pw === 0.15));
  const g0 = game.s.vg.garage.length, pz = game.ruotaSpin(pickRnd(game, idx('auto')), next());
  assert.equal(pz.rar, 5); assert.ok(pz.car && game.s.vg.garage.includes(pz.car) && game.s.vg.garage.length === g0 + 1, 'auto nel garage');
  assert.equal(game.ruota().log[0].seg, 'auto');
  assert.ok(['supra', 'r5', 'e34', 'e30', 'e36', 'williams', 'b2002'].includes(pz.car), 'solo sportive: ' + pz.car);
  // tutte già nel garage: contanti
  for (const id of ['supra', 'r5', 'e34', 'e30', 'e36', 'williams', 'b2002']) if (!game.s.vg.garage.includes(id)) game.s.vg.garage.push(id);
  const m = game.s.money, pz2 = game.ruotaSpin(pickRnd(game, idx('auto')), next());
  assert.ok(!pz2.car && game.s.money === m + 60000);
});
