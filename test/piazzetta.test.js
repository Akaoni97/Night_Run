// Prove della piazzetta (piazzetta.js): ogni 2 o 3 tappe, due negozi; Luca e Russian Kùstòm (Jeshka) mai insieme.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'concessionario.js', 'sfascio.js', 'piazzetta.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { VG, VG_PLACE, VG_PIAZZA, vgPiazzaSet, vgTwin, NightPiazza };')();

test('piazzetta: una tappa ogni 2 o 3, dalla quarta, mai nelle prime due (tutorial)', () => {
  const p = []; for (let n = 0; n < 400; n++) if (E.VG.stop(n).twin) p.push(n);
  assert.equal(p[0], E.VG_PIAZZA.primo); assert.ok(p[0] >= 2);
  for (let i = 1; i < p.length; i++) assert.ok([2, 3].includes(p[i] - p[i - 1]), `distanza ${p[i] - p[i - 1]} alla ${p[i]}`);
  assert.ok(p.length > 100);
});

test('piazzetta: Luca e Russian Kùstòm non stanno mai insieme, tutte le altre coppie sì', () => {
  const coppie = new Set();
  for (let n = 0; n < 6000; n++) {
    const s = E.VG.stop(n); if (!s.twin) continue;
    const c = [s.id, s.twin.id].sort().join('+'); coppie.add(c);
    assert.notEqual(s.id, s.twin.id, 'due negozi uguali');
    assert.ok(c !== 'shop+style', 'Luca e Jeshka insieme alla tappa ' + n);
  }
  const ids = Object.keys(E.VG_PLACE), possibili = new Set();
  for (const a of ids) for (const b of ids) if (a !== b && [a, b].sort().join('+') !== 'shop+style') possibili.add([a, b].sort().join('+'));
  const mancano = [...possibili].filter((c) => !coppie.has(c));
  assert.ok(mancano.length <= 4, 'coppie che non escono mai: ' + mancano.join(', '));
});

test('piazzetta: i due negozi stanno ai lati, il benzinaio a sinistra, e sono sempre gli stessi per la stessa tappa', () => {
  let visti = 0;
  for (let n = 0; n < 400; n++) {
    const s = E.VG.stop(n); if (!s.twin) continue; visti++;
    assert.ok(s.dx * s.twin.dx < 0, 'uno a sinistra e uno a destra');
    if (s.id === 'fuel') assert.ok(s.dx < 0); if (s.twin.id === 'fuel') assert.ok(s.twin.dx < 0);
    assert.deepEqual(E.VG.stop(n).twin, s.twin, 'sempre uguale');
  }
  assert.ok(visti > 100);
});

test('piazzetta: si entra nel negozio scelto, spostato dal suo lato', () => {
  const s = (() => { for (let n = 3; n < 60; n++) { const t = E.VG.stop(n); if (t.twin) return t; } })();
  const p = Object.assign({}, s, { rel: 8, ok: true });
  const a = E.NightPiazza.sub(p, 0), b = E.NightPiazza.sub(p, 1);
  assert.equal(a.id, s.id); assert.equal(b.id, s.twin.id);
  assert.equal(a.x, s.x + s.dx); assert.equal(b.x, s.x + s.twin.dx);
  assert.equal(a.twin, null); assert.equal(b.twin, null);
});
