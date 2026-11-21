// Prove dei tratti speciali dei personaggi del gioco (personaggio.js, L.x): si tengono, quelli sconosciuti spariscono.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../personaggio.js', import.meta.url), 'utf8');
const X = new Function('var window, document, localStorage;' + src + ';return { pgNorm, PG_X, PG_DEF };')();

test('personaggi: i tratti speciali passano pgNorm, quelli inventati no; il protagonista non ne ha', () => {
  const L = X.pgNorm({ capelli: 'ricci', x: { pazzo: true, tatuaggi: true, ali: true } });
  assert.deepEqual(L.x, { pazzo: true, tatuaggi: true });
  assert.equal(X.pgNorm(X.PG_DEF).x, undefined);
  assert.equal(X.pgNorm({ x: { ali: true } }).x, undefined);
  for (const k of ['canotta', 'tatuaggi', 'muscoli', 'catena', 'pazzo', 'barbone']) assert.ok(X.PG_X.includes(k));
});
