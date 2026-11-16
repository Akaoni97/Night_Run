// Prove del prologo: parte solo a inizio di un Viaggio nuovo, e i testi sono completi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../prologo.js', import.meta.url), 'utf8');
const { PRO_LETTERA, PRO_NOTAIO, PRO_AUTO, proShould } = new Function(src + ';return { PRO_LETTERA, PRO_NOTAIO, PRO_AUTO, proShould };')();

test('prologo: parte solo a inizio di un Viaggio nuovo', () => {
  assert.equal(proShould({ vg: { on: true }, dist: 0 }), true);
  assert.equal(proShould({ vg: { on: true, prologo: 1 }, dist: 0 }), false, 'già visto');
  assert.equal(proShould({ vg: { on: true }, dist: 5000 }), false, 'partita già avanti');
  assert.equal(proShould({ vg: { on: false }, dist: 0 }), false, 'fuori dal Viaggio');
  assert.equal(proShould(null), false);
});

test('prologo: sei auto, solo la Volvo si può scegliere', () => {
  assert.equal(PRO_AUTO.length, 6);
  assert.deepEqual(PRO_AUTO.filter((a) => a.ok).map((a) => a.id), ['v40']);
});

test('prologo: lettera e colloquio hanno testo', () => {
  assert.ok(PRO_LETTERA.join(' ').includes('eredità'));
  assert.ok(PRO_NOTAIO.length >= 3 && PRO_NOTAIO.every((t) => t.length > 10));
});
