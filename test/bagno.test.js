// Prove di pipì e cacca (viaggio.js): si caricano col tempo, la pipì in 12 «ore di viaggio» e la cacca in 24, il bagno li svuota,
// a zero fuori da un locale te la fai addosso (e ti serve una doccia).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { SupraSim, StreetGame, VG_BAGNO };')();
const nuovo = () => { const sim = new E.SupraSim(), game = new E.StreetGame(sim, () => 0.5); game.startTrip(); game.s.vg.firstDone = true; return game; };
const passa = (game, minuti) => { for (let t = 0; t < minuti * 60; t += 1) game.vgUpdate(1); };

test('bagno: pipì e cacca partono tranquille e si caricano a tempi diversi', () => {
  const g = nuovo(), N = g.s.vg.needs;
  assert.equal(N.pee, 1); assert.equal(N.poo, 1);
  passa(g, 18);                                                 // metà del tempo della pipì (12 ore × 3 minuti = 36)
  assert.ok(Math.abs(N.pee - 0.5) < 0.02, 'pipì a metà: ' + N.pee);
  assert.ok(Math.abs(N.poo - 0.75) < 0.02, 'cacca a tre quarti: ' + N.poo);
  assert.ok(N.pee < N.poo, 'la pipì scende più in fretta');
});

test('bagno: il bagno svuota, anche se non scappava davvero', () => {
  const g = nuovo(), N = g.s.vg.needs; passa(g, 30);
  assert.ok(N.pee < 0.3);
  assert.equal(g.vgBagno('pee').ok, true); assert.equal(N.pee, 1);
  assert.equal(g.vgBagno('poo').ok, true); assert.equal(N.poo, 1);
  assert.equal(g.vgBagno('altro').ok, false);
});

test('bagno: a zero fuori da un locale te la fai addosso, e ti serve una doccia', () => {
  const g = nuovo(), N = g.s.vg.needs; N.pee = 0.001; N.wash = 0.9;
  passa(g, 1);
  assert.ok(N.pee > 0.5, 'si azzera il bisogno'); assert.ok(N.wash < 0.5, 'igiene giù');
});

test('bagno: bere fa venire prima la pipì; i vecchi salvataggi non si rompono', () => {
  const g = nuovo(), N = g.s.vg.needs; g.s.money = 100;
  const p0 = N.pee; g.vgEat(0, 0.5, 1, 'Acqua'); assert.ok(N.pee < p0);
  delete N.pee; delete N.poo; g.vgUpdate(1);
  assert.ok(N.pee > 0.9 && N.poo > 0.9, 'senza i campi ripartono tranquilli');
});
