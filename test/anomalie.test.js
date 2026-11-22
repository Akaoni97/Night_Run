// Prove delle anomalie di Luca (VG_ODD in viaggio.js, v0.99): ci sono tutte, i livelli arrivano coi km, gli effetti funzionano.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { SupraSim, StreetGame, VG_ODD, INV };')();
const nuovo = () => { const sim = new E.SupraSim(), game = new E.StreetGame(sim, () => 0.5); game.startTrip(); game.s.vg.firstDone = true; game.vgThink = function (t) { this.pensato = t; }; return game; };
const odd = (id) => E.VG_ODD.find((o) => o.id === id);

test('anomalie: le otto di Luca ci sono, con id unici, e quelle che ne chiamano un\'altra la trovano', () => {
  const ids = E.VG_ODD.map((o) => o.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ['specchio', 'uscita18', 'radioKm', 'gemella', 'barista', 'cippoFalso', 'cassa', 'seiUguali']) assert.ok(odd(id), id);
  for (const o of E.VG_ODD) { if (o.then) assert.ok(odd(o.then.id), 'then ' + o.then.id); if (o.gives) assert.ok(E.INV[o.gives], 'gives ' + o.gives); assert.ok(o.text.length > 20); }
  // tre livelli: si notano appena prima, poi si possono verificare, poi lasciano qualcosa
  assert.ok(odd('specchio').km < odd('gemella').km && odd('gemella').km < odd('cassa').km);
});

test('anomalie: lo specchietto, l\'auto dietro sparisce quando cambi corsia e allora arriva il pensiero', () => {
  const g = nuovo(); g.lane = 1;
  g.vgOddFai(odd('specchio'), 30, 'road');
  const gh = g.ents.find((e) => e.kind === 'ghost' && e.mirror); assert.ok(gh); assert.ok(gh.x < g.s.dist, 'sta dietro');
  g.vgSpecchio(0.5); assert.ok(g.ents.includes(gh)); assert.equal(g.pensato, undefined);
  g.lane = 2; g.vgSpecchio(0.1);
  assert.ok(!g.ents.some((e) => e.kind === 'ghost')); assert.match(g.pensato, /non c'è più/);
});

test('anomalie: il cartello «USCITA 18 KM» torna uguale dieci km dopo, il cippo segna un km che non esiste', () => {
  const g = nuovo();
  g.vgOddFai(odd('uscita18'), 40, 'road');
  assert.deepEqual(g.s.vg.oddDue, [{ id: 'uscita18bis', km: 50 }]);
  assert.ok(g.ents.some((e) => e.kind === 'vgsign' && e.text === 'USCITA 18 KM'));
  g.vgOddFai(odd('cippoFalso'), 87.6, 'road');
  assert.equal(g.ents.find((e) => e.cippo).num, '-87');
});

test('anomalie: la gemella e le sei auto uguali stanno ferme in corsia d\'emergenza e non si urtano', () => {
  const g = nuovo();
  g.vgOddFai(odd('gemella'), 70, 'road');
  const t = g.ents.find((e) => e.twin); assert.ok(t); assert.equal(t.vt, g.car); assert.equal(t.lane, 0); assert.equal(t.v, 0); assert.ok(t.soc && t.hazard);
  g.vgOddFai(odd('seiUguali'), 160, 'road');
  const sei = g.ents.filter((e) => e.odd && !e.twin); assert.equal(sei.length, 6);
  assert.equal(new Set(sei.map((e) => e.vt + e.color)).size, 1, 'tutte uguali');
});

test('anomalie: nella cassa del motel compare un oggetto che non hai preso', () => {
  const g = nuovo(), n = g.s.vg.cassa.length;
  g.vgOddFai(odd('cassa'), 160, 'motel');
  assert.equal(g.s.vg.cassa.length, n + 1); assert.equal(g.s.vg.cassa[n].kind, 'caffe');
});

test('anomalie: nei testi il nome dell\'auto c\'è davvero (prima restava scritto «{Auto}»), per la gemella quella che guidi', () => {
  const g = nuovo(); let chiesto = null; g.ask = (q) => { chiesto = q; };
  g.s.carId = 'twingo'; g.s.vg.eredita = 'v40';
  g.vgOddFai(odd('gemella'), 70, 'bar');                               // fuori strada il testo arriva subito
  assert.ok(chiesto && !/\{/.test(chiesto.text), chiesto && chiesto.text);
  assert.match(chiesto.text, /^La Twingo ferma/);
});
