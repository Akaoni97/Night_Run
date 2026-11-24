// Prove delle forature (forature.js): foratura lenta ogni 15-20 km, scoppio ogni 42-45 km ± 5, indipendenti,
// solo in movimento; lo scoppio porta la gomma a terra e lascia l'evento per il suono.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'forature.js', 'missioni.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, FOR, forProssimo, forPasso, forScegli } = new Function(src + ';return { SupraSim, StreetGame, FOR, forProssimo, forPasso, forScegli };')();

test('forature: gli intervalli stanno nei range chiesti', () => {
  for (let i = 0; i < 2000; i++) {
    const l = forProssimo('lenta'), s = forProssimo('scoppio');
    assert.ok(l >= 15 && l <= 20, 'lenta ' + l);
    assert.ok(s >= 37 && s <= 50, 'scoppio ' + s);
  }
  assert.equal(forProssimo('scoppio', () => 0.5), 43.5, 'centro del range senza sfasatura');
});

test('forature: due conti indipendenti, in 1.000 km circa 57 lente e 23 scoppi', () => {
  const st = {}; let L = 0, S = 0;
  for (let km = 0; km < 1000; km += 0.05) for (const e of forPasso(st, 0.05, 30)) e === 'lenta' ? L++ : S++;
  assert.ok(L >= 50 && L <= 66, 'lente ' + L);
  assert.ok(S >= 20 && S <= 27, 'scoppi ' + S);
});

test('forature: da fermi non succede niente, poi arriva appena riparti', () => {
  const st = { lenta: 0.1, scoppio: 0.1 };
  assert.deepEqual(forPasso(st, 0.2, 0), []);
  assert.deepEqual(forPasso(st, 0, 6), ['lenta'], 'a 22 km/h la lenta sì, lo scoppio no');
  assert.deepEqual(forPasso(st, 0, 20), ['scoppio']);
  assert.ok(st.lenta >= 15 && st.scoppio >= 37, 'conti ripartiti');
});

test('forature: la scelta della gomma salta quelle già bucate', () => {
  const T = { p: [2.3, 0.3, 2.3, 2.3], leak: [0.01, 0.25, 0, 0] };
  for (let i = 0; i < 50; i++) { const k = forScegli(T, 'lenta'); assert.ok(k === 2 || k === 3, 'lenta ' + k); }
  for (let i = 0; i < 50; i++) assert.notEqual(forScegli(T, 'scoppio'), 1);
  assert.equal(forScegli({ p: [0.3, 0.3, 0.3, 0.3], leak: [1, 1, 1, 1] }, 'scoppio'), -1);
});

test('forature: nel viaggio lo scoppio mette la gomma a terra e lascia l\'evento per suono e scritta', () => {
  const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.vg.firstDone = true;
  game.s.forat = { lenta: 99, scoppio: 0.01 }; sim.v = 30;
  game.tyreUpdate(1 / 60, 0.02);
  const T = game.tyres();
  assert.ok(T.p.some((p) => p <= FOR.aTerra + 1e-9), 'una gomma a terra');
  assert.ok(game.fx.some((f) => f.k === 'scoppio'), 'evento scoppio');
  assert.ok(game.s.forat.scoppio >= 37, 'prossimo scoppio tra 37 e 50 km');
  // la lenta
  game.fx.length = 0; game.s.forat.lenta = 0.01; game.tyreUpdate(1 / 60, 0.02);
  assert.ok(game.fx.some((f) => f.k === 'gommaLenta'), 'evento foratura lenta');
  assert.equal(T.leak.filter((l) => l > 0 && l < 0.05).length, 1, 'una gomma che perde piano');
});

test('forature: tra gli eventi a caso della strada non c\'è più la gomma', () => {
  const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip();
  const T = game.tyres(), r0 = Math.random;
  try { for (let i = 0; i < 200; i++) { Math.random = () => (i % 100) / 100; game.ents = []; game.spawnRoadEvent(); } } finally { Math.random = r0; }
  assert.ok(T.leak.every((l) => !l), 'nessuna gomma bucata dagli eventi a caso');
});
