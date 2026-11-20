// Prove di «Ti tengo compagnia» (jeshka.js): l'ordine delle scene, il cavo, il segnale dei cinque lampi, l'incontro.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'jeshka.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, VG, JL, JL_SCENE } = new Function(src + ';return { SupraSim, StreetGame, VG, JL, JL_SCENE };')();

const nuova = () => { const g = new StreetGame(new SupraSim(), () => 0.5); g.startTrip(); g.s.vg.firstDone = true; g.prompt = null; return g; };
const tappa = (g, id, giro = 0) => { const k = ['bar', 'fuel', 'grill', 'niko', 'bar', 'motel', 'fuel', 'shop', 'bar', 'grill', 'style', 'motel'].indexOf(id) + giro * 12; const I = VG.stop(k); g.s.dist = g.s.far = I.x; return I; };

test('jeshka: non c\'è niente prima dei km giusti, poi le scene in ordine partendo da Neon', () => {
  const g = nuova();
  g.s.dist = 5000; assert.equal(g.jlScena('style', { x: 5000 }), null); assert.equal(g.jlScena('shop', { x: 5000 }), null);
  let I = tappa(g, 'style'); assert.equal(g.jlScena('style', I), 'neon1'); g.jlFatto('neon1', null, I);
  assert.equal(g.jlScena('style', I), null, 'alla stessa tappa niente seconda scena');
  I = tappa(g, 'shop', 1); assert.equal(g.jlScena('shop', I), 'luca1'); g.jlFatto('luca1', 'neon', I); assert.ok(g.jlState().lucaSa);
  assert.equal(g.jlScena('shop', I), null, 'luca2 solo sapendo di Jeshka');
  I = tappa(g, 'style', 1); assert.equal(g.jlScena('style', I), 'neon2'); g.jlFatto('neon2', 'luca', I);
  assert.ok(g.jlState().nome && g.jlState().messaggio);
  I = tappa(g, 'shop', 2); assert.equal(g.jlScena('shop', I), 'luca2'); g.jlFatto('luca2', null, I); assert.equal(g.jlState().cavo, 1);
  I = tappa(g, 'style', 2); assert.equal(g.jlScena('style', I), 'neon3'); g.jlFatto('neon3', 'dopo', I);
  assert.equal(g.jlState().auto, false, '«non ancora»'); assert.equal(g.jlScena('style', I), null);
  I = tappa(g, 'style', 3); assert.equal(g.jlScena('style', I), 'neon3'); g.jlFatto('neon3', 'sali', I);
  assert.ok(g.jlState().auto && g.jlState().cavo === 2);
});

test('jeshka: partendo da Luca senza aver visto Neon funziona lo stesso; chi se ne va dal furgone non sa il nome', () => {
  const g = nuova();
  let I = tappa(g, 'shop'); assert.equal(g.jlScena('shop', I), 'luca1'); g.jlFatto('luca1', null, I); assert.ok(!g.jlState().lucaSa);
  I = tappa(g, 'style'); g.jlFatto(g.jlScena('style', I), null, I);
  I = tappa(g, 'style', 1); assert.equal(g.jlScena('style', I), 'neon2'); g.jlFatto('neon2', 'via', I);
  assert.equal(g.jlState().nome, false);
  I = tappa(g, 'shop', 1); assert.equal(g.jlScena('shop', I), null, 'senza nome Luca non racconta');
  const scelte = JL_SCENE.neon2.b.s; assert.ok(scelte.some((s) => s[3] && s[3](g)), 'col quaderno letto c\'è la domanda su Luca');
});

test('jeshka: in macchina il messaggio falso, poi cinque lampi nel piazzale del tuning e l\'incontro; la fine 15 km dopo', () => {
  const g = nuova(); const J = g.jlState();
  Object.assign(J, { neon: 2, luca: 2, nome: true, cavo: 1, stop: {} });
  let I = tappa(g, 'style', 1); g.jlFatto('neon3', 'sali', I);
  g.sim.v = 30; let sms = false;
  for (let i = 0; i < 400 && !J.sms; i++) { g.s.dist += 10; g.update(1 / 30); }
  assert.ok(J.sms, 'il numero sconosciuto ha scritto');
  const S = tappa(g, 'shop', 2); g.s.dist = S.x - 150;
  assert.ok(g.jlPiazzale(), 'nel piazzale');
  for (let i = 0; i < 4; i++) g.flashLights(); assert.equal(J.segnale, false);
  g.flashLights(); assert.equal(J.segnale, true, 'cinque lampi');
  assert.equal(g.jlScena('shop', S), 'arrivo');
  g.jlFatto('incontro', null, S); assert.ok(J.incontro && !J.auto);
  assert.equal(g.jlScena('shop', S), null, 'la fine non subito');
  const N = tappa(g, 'style', 3); assert.equal(g.jlScena('style', N), 'biglietto');
  g.s.dist = S.x + (JL.fineKm + 1) * 1000; assert.equal(g.jlScena('shop', { x: g.s.dist }), 'fine');
  g.jlFatto('fine'); assert.equal(g.jlScena('shop', { x: g.s.dist }), null);
});

test('jeshka: lontano dal tuning i lampi non contano', () => {
  const g = nuova(); const J = g.jlState(); Object.assign(J, { auto: true, segnale: false, colpi: [] });
  const S = tappa(g, 'shop', 1); g.s.dist = S.x - 1500;
  for (let i = 0; i < 6; i++) g.flashLights(); assert.equal(J.segnale, false);
});
