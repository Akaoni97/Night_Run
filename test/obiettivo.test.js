// Prove del prossimo traguardo (obiettivo.js): il pezzo bloccato più vicino e il prossimo vantaggio dei km.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'obiettivo.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { SupraSim, StreetGame, setActiveCar, obProssimo, obProssimoPezzo, obProssimoVantaggio, obTesto };')();

const nuovo = (car = 'supra') => { E.setActiveCar(car); const sim = new E.SupraSim(), game = new E.StreetGame(sim, () => 0.5); game.startTrip(); return game; };

test('obiettivo: parte da un traguardo vero con i chilometri che mancano', () => {
  const g = nuovo();
  const o = E.obProssimo(g);
  assert.ok(o && o.left > 0, 'dev\'esserci qualcosa da raggiungere');
  assert.match(E.obTesto(o), /^tra [\d,]+ km$/);
});

test('obiettivo: il pezzo scelto è davvero bloccato e il più vicino', () => {
  const g = nuovo();
  const p = E.obProssimoPezzo(g);
  assert.ok(p, 'un pezzo a livello alto è ancora bloccato a 0 km');
  assert.ok(p.km > g.odo);
  g.s.cars[g.car].km = p.km + 1;
  const q = E.obProssimoPezzo(g);
  assert.ok(!q || q.km !== p.km, 'sbloccato, passa al successivo');
});

test('obiettivo: il vantaggio dei km segue i chilometri della macchina in uso', () => {
  const g = nuovo();
  g.carState().km = 10;
  const v = E.obProssimoVantaggio(g);
  assert.equal(v.km, 25);
  assert.ok(Math.abs(v.left - 15) < 1e-9);
});

test('obiettivo: fuori dalla carriera niente pezzi bloccati', () => {
  const g = nuovo(); g.mode = 'free';
  assert.equal(E.obProssimoPezzo(g), null);
});
