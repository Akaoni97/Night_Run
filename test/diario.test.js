// Prove della mappa del diario (diario.js, v0.110): dove cade ogni capitale lungo il giro e dove sta un km sulla spezzata.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../diario.js', import.meta.url), 'utf8');
const { diaPercorso, diaPunto } = new Function(src + ';return { diaPercorso, diaPunto };')();
const ORD = ['a', 'b', 'c'];

test('diario: i km delle capitali lungo il giro', () => {
  const p = diaPercorso([['a', 12], ['x', 30], ['b', 12], ['x', 30], ['c', 12], ['b', 5]], ORD);
  assert.deepEqual(p, [{ id: 'a', km: 0 }, { id: 'b', km: 42 }, { id: 'c', km: 84 }]);
});
test('diario: un km sulla spezzata delle capitali', () => {
  const p = [{ id: 'a', km: 0 }, { id: 'b', km: 40 }, { id: 'c', km: 80 }];
  assert.equal(diaPunto(p, 0), 0);
  assert.equal(diaPunto(p, 20), 0.5);
  assert.equal(diaPunto(p, 40), 1);
  assert.equal(diaPunto(p, 60), 1.5);
  assert.equal(diaPunto(p, 9999), 2);
  assert.equal(diaPunto([], 5), 0);
});
test('diario: con il giro vero ogni capitale ha il suo km e Tokyo è a zero', () => {
  const v = readFileSync(new URL('../viaggio.js', import.meta.url), 'utf8').match(/const VG_ROUTE = (\[[\s\S]*?\]);\n/)[1];
  const c = readFileSync(new URL('../capitali.js', import.meta.url), 'utf8').match(/const CAP_ORDER = (\[[^\]]*\])/)[1];
  const route = new Function('return ' + v)(), ord = new Function('return ' + c)();
  const p = diaPercorso(route, ord);
  assert.equal(p.length, 12); assert.equal(p[0].km, 0); assert.ok(p.every((x, i) => !i || x.km > p[i - 1].km));
});
