// Prove della sezione Prestazioni (prestazioni.js): scelte pronte, gradini automatici, cosa si disegna.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../prestazioni.js', import.meta.url), 'utf8');
const X = new Function('var localStorage = { getItem: () => null, setItem() {}, removeItem() {} };' + src + ';return { PREST, PREST_PRESET, PREST_DEF, prestFlags, prestMisura, NR_PREST };')();

test('prestazioni: di serie tutto acceso, a densità automatica, senza tetto ai fotogrammi', () => {
  assert.equal(X.NR_PREST.preset, 'auto'); assert.equal(X.NR_PREST.fps, 0);
  assert.deepEqual(X.prestFlags(X.NR_PREST, 0), { slow: false, glow: true, luci: true, vita: true, passanti: true, gomme: true });
});

test('prestazioni: i gradini automatici spengono una cosa alla volta, la densità per ultima', () => {
  const P = X.PREST_PRESET.auto.v;
  assert.equal(X.prestFlags(P, 1).glow, false); assert.equal(X.prestFlags(P, 1).vita, true); assert.equal(X.prestFlags(P, 1).slow, false);
  assert.equal(X.prestFlags(P, 2).vita, false); assert.equal(X.prestFlags(P, 2).passanti, false); assert.equal(X.prestFlags(P, 2).slow, false);
  assert.equal(X.prestFlags(P, 3).slow, true);
  assert.equal(X.prestFlags(X.PREST_PRESET.max.v, 3).slow, false, 'Massima: i gradini non contano');
  assert.equal(X.prestFlags(X.PREST_PRESET.minima.v, 0).slow, true);
  assert.equal(X.prestFlags(X.PREST_PRESET.fluida.v, 0).glow, false);
});

test('prestazioni: si scende di un gradino solo se il disegno resta lento per qualche secondo', () => {
  let st = { lv: 0 };
  for (let i = 0; i < 60 * 2; i++) st = X.prestMisura(st, 40, 1 / 60);
  assert.equal(st.lv, 0, 'due secondi non bastano');
  for (let i = 0; i < 60 * 2; i++) st = X.prestMisura(st, 40, 1 / 60);
  assert.equal(st.lv, 1);
  let ok = { lv: 0 }; for (let i = 0; i < 60 * 10; i++) ok = X.prestMisura(ok, 12, 1 / 60);
  assert.equal(ok.lv, 0, 'un computer veloce resta al massimo');
  let picco = { lv: 0 }; for (let i = 0; i < 60 * 10; i++) picco = X.prestMisura(picco, i % 60 === 0 ? 200 : 10, 1 / 60);
  assert.equal(picco.lv, 0, 'uno scatto ogni tanto non conta');
});
