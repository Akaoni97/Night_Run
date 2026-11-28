// Prove del prologo: parte solo a inizio di un Viaggio nuovo, e i testi sono completi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../prologo.js', import.meta.url), 'utf8');
const { PRO_LETTERA, PRO_NOTAIO, PRO_AUTO, PRO_NOTAIO_LOOK, proShould } = new Function(src + ';return { PRO_LETTERA, PRO_NOTAIO, PRO_AUTO, PRO_NOTAIO_LOOK, proShould };')();
const pgSrc = readFileSync(new URL('../personaggio.js', import.meta.url), 'utf8');
const PG = new Function('var window, document, localStorage;' + pgSrc + ';return { pgNorm, PG_X };')();

test('prologo: parte solo a inizio di un Viaggio nuovo', () => {
  assert.equal(proShould({ vg: { on: true }, dist: 0 }), true);
  assert.equal(proShould({ vg: { on: true, prologo: 1 }, dist: 0 }), false, 'già visto');
  assert.equal(proShould({ vg: { on: true }, dist: 5000 }), false, 'partita già avanti');
  assert.equal(proShould({ vg: { on: false }, dist: 0 }), false, 'fuori dal Viaggio');
  assert.equal(proShould(null), false);
});

test('prologo: le sei auto dell’eredità sono le utilitarie di prima generazione e le due familiari', () => {
  assert.deepEqual(PRO_AUTO.map(({ id }) => id), ['panda141', 'ax', 'twingo', 'punto1', 'a80', 'v40']);
  for (const { id, ok } of PRO_AUTO) {
    assert.equal(ok, true, `${id} selezionabile`);
    assert.ok(readFileSync(new URL(`../img/${id}.png`, import.meta.url)).length > 0, `${id} ha una carrozzeria`);
  }
});

test('prologo: lettera e colloquio hanno testo', () => {
  assert.ok(PRO_LETTERA.join(' ').includes('eredità'));
  assert.ok(PRO_NOTAIO.length >= 3 && PRO_NOTAIO.every((t) => t.length > 10));
});

test('prologo: il notaio in piedi è un personaggio del gioco, in abito (tratto speciale di personaggio.js)', () => {
  assert.ok(PG.PG_X.includes('abito'));
  const L = PG.pgNorm(PRO_NOTAIO_LOOK);
  assert.equal(L.x && L.x.abito, true, 'il tratto abito resta dopo pgNorm');
  assert.equal(L.occhiali, 'vista'); assert.equal(L.testa, 'niente');
});
