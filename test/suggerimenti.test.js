// Prove dei suggerimenti dei primi minuti (suggerimenti.js): uno alla volta, una volta sola, mai fuori luogo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../suggerimenti.js', import.meta.url), 'utf8');
const E = new Function('localStorage', src + ';return { SG_LISTA, SG_PAUSA, sgScegli, NightSugg };');
const base = { motore: true, fermo: false, auto: true, leva: 'D', km: 0, kmh: 80, benzina: 0.8, soldi: 100, tStrada: 30, tMotore: 30, padStrano: false };

test('suggerimenti: motore spento e fermo da un po\' → come si accende', () => {
  const { sgScegli } = E(null);
  assert.equal(sgScegli(Object.assign({}, base, { motore: false, fermo: true }), {}).id, 'accendi');
  assert.equal(sgScegli(Object.assign({}, base, { motore: false, fermo: true, tStrada: 5 }), {}), null);
});

test('suggerimenti: leva in P a motore acceso → premi E', () => {
  const { sgScegli } = E(null);
  assert.equal(sgScegli(Object.assign({}, base, { fermo: true, leva: 'P', kmh: 0 }), {}).id, 'leva');
  assert.equal(sgScegli(Object.assign({}, base, { fermo: true, leva: 'P', kmh: 0, auto: false }), {}), null);
});

test('suggerimenti: ognuno solo una volta e mai due insieme', () => {
  const { NightSugg, SG_PAUSA } = E({ getItem: () => null, setItem: () => {} });
  const dette = [];
  const x = (dt, ctx) => NightSugg.tick({ dt, attivo: true, spento: false, say: (t) => dette.push(t), ctx: Object.assign({}, base, ctx) });
  for (let i = 0; i < 100; i++) x(0.5, { km: 3, soldi: 900 });          // 50 s: ne esce uno solo
  assert.equal(dette.length, 1);
  for (let i = 0; i < 100; i++) x(0.5, { km: 3, soldi: 900 });          // altri 50 s: il secondo
  assert.equal(dette.length, 2);
  assert.notEqual(dette[0], dette[1]);
  for (let i = 0; i < 2000; i++) x(0.5, { km: 3, soldi: 900 });         // alla fine tutti detti una volta sola
  assert.equal(new Set(dette).size, dette.length);
});

test('suggerimenti: niente in un locale, con la domanda aperta o se spenti', () => {
  const { NightSugg } = E({ getItem: () => null, setItem: () => {} });
  const dette = [];
  for (let i = 0; i < 400; i++) { NightSugg.tick({ dt: 0.5, attivo: false, spento: false, say: (t) => dette.push(t), ctx: Object.assign({}, base, { km: 5 }) }); NightSugg.tick({ dt: 0.5, attivo: true, spento: true, say: (t) => dette.push(t), ctx: Object.assign({}, base, { km: 5 }) }); }
  assert.equal(dette.length, 0);
});

test('suggerimenti: joystick strano ferma → apre la finestra una volta', () => {
  const { NightSugg } = E({ getItem: () => null, setItem: () => {} });
  const aperte = [];
  for (let i = 0; i < 200; i++) NightSugg.tick({ dt: 0.5, attivo: true, spento: false, say: () => {}, apri: (n) => aperte.push(n), ctx: Object.assign({}, base, { padStrano: true, fermo: true, km: 0, motore: true, leva: 'D' }) });
  assert.deepEqual(aperte, ['joystick']);
});
