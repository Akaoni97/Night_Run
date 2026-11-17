// Prove dei traguardi: elenco valido, sblocco una volta sola, premi pagati, contatori (scia, km puliti, velocità).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'valigette.js', 'traguardi.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, TRG_LIST } = new Function(src + ';return { SupraSim, StreetGame, TRG_LIST };')();

const trip = () => { const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); return { sim, game }; };

test('traguardi: id unici, ognuno con nome, testo e un premio valido', () => {
  const ids = new Set();
  for (const T of TRG_LIST) {
    assert.ok(!ids.has(T.id), 'id doppio ' + T.id); ids.add(T.id);
    assert.ok(T.name && T.text && typeof T.check === 'function', T.id);
    assert.ok((T.prize.soldi > 0) !== !!T.prize.cassa, 'un premio solo: ' + T.id);
    if (T.prize.cassa) assert.ok(['bronzo', 'argento', 'oro'].includes(T.prize.cassa), T.id);
  }
  assert.ok(TRG_LIST.length >= 20);
});

test('traguardi: all\'inizio del viaggio nessuno è già fatto', () => {
  const { game } = trip();
  assert.deepEqual(game.achStep(0.25).map((T) => T.id), []);
});

test('traguardi: si sbloccano una volta sola e pagano il premio', () => {
  const { game } = trip(); game.s.money = 0;
  game.s.dist = 10500;
  const a = game.achStep(0.25).map((T) => T.id);
  assert.deepEqual(a, ['km10']); assert.equal(game.s.money, 300);
  assert.deepEqual(game.achStep(0.25), [], 'non si ripete');
  assert.equal(game.s.money, 300);
  game.s.dist = 51000; game.achStep(0.25);
  assert.ok(game.cases().own.some((c) => c.type === 'bronzo' && /Mezza notte/.test(c.why)), 'valigetta di bronzo per i 50 km');
});

test('traguardi: la scia conta solo se resti dietro di fila', () => {
  const { game, sim } = trip(); sim.v = 30; sim.draft = 0.3;
  for (let k = 0; k < 76; k++) game.achStep(0.25);               // 19 s
  sim.draft = 0; game.achStep(0.25);                              // esci dalla scia: si riparte da zero
  sim.draft = 0.3;
  for (let k = 0; k < 76; k++) assert.ok(!game.achStep(0.25).some((T) => T.id === 'scia'));
  for (let k = 0; k < 8; k++) if (game.achStep(0.25).some((T) => T.id === 'scia')) return;
  assert.fail('dopo 20 s di fila doveva sbloccarsi');
});

test('traguardi: un danno nuovo azzera i km puliti', () => {
  const { game, sim } = trip(); const c = () => game.ach().c;
  game.achStep(0.25); game.s.dist = 20000; game.achStep(0.25);
  assert.ok(c().cleanKm > 19);
  sim.damage += 0.05; game.achStep(0.25); assert.ok(c().cleanKm < 0.01);
  game.s.dist = 51000; const got = game.achStep(0.25).map((T) => T.id);
  assert.ok(got.includes('pulito'), '31 km puliti dopo il danno');
});

test('traguardi: velocità massima e progressi tra 0 e 1', () => {
  const { game, sim } = trip(); sim.v = 210 / 3.6;
  const got = game.achStep(0.25).map((T) => T.id);
  assert.ok(got.includes('v200') && !got.includes('v250'));
  const v250 = TRG_LIST.find((T) => T.id === 'v250');
  assert.ok(Math.abs(game.achProgress(v250) - 210 / 250) < 0.01);
  for (const T of TRG_LIST) { const p = game.achProgress(T); assert.ok(p >= 0 && p <= 1, T.id); }
});
