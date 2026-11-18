// Prove del personaggio: aspetto sempre valido, casuale valido, colori di sempre per chi non sceglie, disegno senza errori.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../personaggio.js', import.meta.url), 'utf8');
const P = new Function(src + ';return { PG_OPZ, PG_DEF, pgNorm, pgRandom, pgColors, pgDriver, pgStanding, pgBack };')();

// una tela finta che accetta tutto e conta i disegni
const finta = () => { let n = 0; const c = new Proxy({}, { get: (o, k) => (k === 'n' ? n : k in o ? o[k] : (...a) => { n++; return k === 'createLinearGradient' || k === 'createRadialGradient' ? { addColorStop() {} } : undefined; }), set: (o, k, v) => { o[k] = v; return true; } }); return c; };

test('personaggio: valori sconosciuti o mancanti tornano quelli di partenza', () => {
  assert.deepEqual(P.pgNorm(null), P.PG_DEF);
  const L = P.pgNorm({ pelle: 99, capelli: 'verdi', testa: 'berretto', sopraCol: 3, barba: 'piena' });
  assert.equal(L.pelle, P.PG_DEF.pelle); assert.equal(L.capelli, P.PG_DEF.capelli);
  assert.equal(L.testa, 'berretto'); assert.equal(L.sopraCol, 3); assert.equal(L.barba, 'piena');
});

test('personaggio: il casuale è sempre un aspetto valido', () => {
  for (let i = 0; i < 300; i++) { const L = P.pgRandom(); assert.deepEqual(P.pgNorm(L), L); }
});

test('personaggio: chi non sceglie ha i colori del protagonista di sempre (cappellino rosso, giubbotto blu)', () => {
  const C = P.pgColors(P.PG_DEF);
  assert.equal(C.cap, '#a81e24'); assert.equal(C.jacket, '#2b3348'); assert.equal(C.skin, '#d29a72'); assert.equal(C.hair, '#141010');
});

test('personaggio: ogni combinazione si disegna in auto, in piedi e di spalle', () => {
  const vals = P.PG_OPZ.map((q) => (q.col ? q.col.map((c, i) => i) : q.v.map((v) => v[0])));
  for (let i = 0; i < 120; i++) {
    const L = {}; P.PG_OPZ.forEach((q, j) => { L[q.k] = vals[j][(i * (j + 3)) % vals[j].length]; });
    const g = finta();
    P.pgDriver(g, { cx: 10, cy: 10, sx: 10, wx: 24, wy: 18, C: P.pgColors(L, 0.3), look: L, turn: (i % 5) / 2 - 1, blink: i % 2, breath: 0.5, steer: 0.3, elbow: i % 3 === 0 ? 1 : 0, shiftK: 0.5 });
    P.pgStanding(g, 100, 300, 1, i / 10, i % 2 === 0, L, 0.2, i);
    P.pgBack(g, 150, 300, i, L);
    assert.ok(g.n > 40, 'ha disegnato qualcosa');
  }
});
