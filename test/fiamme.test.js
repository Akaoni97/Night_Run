// Prove delle fiamme secondo il tuning: livello dell'auto (flameTier) e tipo di fiammata (flameStyle).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['fiamme.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { flameTier, flameStyle, flameVariant, flamePalFor } = new Function(src + ';return { flameTier, flameStyle, flameVariant, flamePalFor };')();

const auto = (pw, max, spark, pops, extra = 1, ctl = 1) => ({ tune: { pw, turbo: { max }, sparkCut: spark, ecuPops: pops }, extraPw: extra, boostCtl: ctl });
const quote = (tier, kind, rpm) => {                          // frazione di ogni stile su una griglia fitta di numeri a caso
  const q = { torch: 0, free: 0, bang: 0 }, N = 2000;
  for (let i = 0; i < N; i++) q[flameStyle(tier, kind, rpm, (i + 0.5) / N)]++;
  for (const k in q) q[k] /= N;
  return q;
};

test('fiamme: il livello dell\'auto va da leggero a spinto secondo pezzi e pressione', () => {
  assert.equal(flameTier(auto(1, 0, false, false), 0.25).tier, 0, 'V40 di serie');
  assert.equal(flameTier(auto(1, 0.75, false, false), 1).tier, 0, 'Supra di serie');
  assert.equal(flameTier(auto(1.04, 0.7, false, false), 0.7).tier, 1, 'V40 sleeper: medio');
  assert.equal(flameTier(auto(1.07, 1, true, true), 1.25).tier, 1, 'Supra street: medio');
  assert.equal(flameTier(auto(1.14, 1.5, true, true), 1.4).tier, 2, 'V40 full: spinto');
  assert.equal(flameTier(auto(1.1, 2.1, true, true), 1.7).tier, 2, 'Supra drag: spinto');
});

test('fiamme: la mappa del turbo sposta il livello (ECO abbassa, FORTE alza)', () => {
  const al = (ctl) => flameTier(auto(1.1, 1.5, true, true, 1, ctl), 1.1);
  assert.ok(al(0.6).score < al(1).score && al(1).score < al(1.2).score);
  assert.equal(al(1).tier, 2, 'NORMALE: spinto');
  assert.equal(al(0.6).tier, 1, 'ECO sullo stesso motore scende al medio');
  assert.equal(al(1.2).tier, 2, 'FORTE resta spinto');
});

test('fiamme: leggero = botti, medio = fiamme libere, spinto = ossidrica', () => {
  const l = quote(0, 'limiter', 0.95), m = quote(1, 'limiter', 0.95), s = quote(2, 'limiter', 0.95);
  assert.ok(l.bang > 0.75 && l.torch === 0, 'leggero: botto');
  assert.ok(m.free > 0.6 && m.free > m.torch && m.free > m.bang, 'medio: fiamma libera');
  assert.ok(s.torch > 0.6 && s.torch > s.free, 'spinto: ossidrica');
});

test('fiamme: spinto a metà rilascio fa la fiamma libera, ai giri alti l\'ossidrica; nelle cambiate più botti', () => {
  const mid = quote(2, 'lift', 0.5), high = quote(2, 'lift', 0.9), cambio = quote(2, 'shift', 0.6), lim = quote(2, 'limiter', 0.95);
  assert.ok(mid.free > high.free && mid.free > 0.4, `fiamma libera a metà rilascio: ${mid.free.toFixed(2)} contro ${high.free.toFixed(2)} ai giri alti`);
  assert.ok(high.torch > mid.torch);
  assert.ok(cambio.bang > lim.bang, 'nelle cambiate più botti che al limitatore');
  for (const q of [mid, high, cambio, lim]) assert.ok(Math.abs(q.torch + q.free + q.bang - 1) < 1e-9);
});

test('fiamme: la fiamma libera ha quattro versioni e i colori seguono il livello', () => {
  for (const t of [0, 1, 2]) { const v = new Set(); for (let i = 0; i < 100; i++) v.add(flameVariant(t, i / 100)); assert.ok(v.size >= 3, `livello ${t}: ${[...v]}`); }
  const medio = new Set(), spinto = new Set();
  for (let i = 0; i < 100; i++) { medio.add(flamePalFor(1, i / 100)); spinto.add(flamePalFor(2, i / 100)); }
  assert.ok(medio.has('arancio') && medio.has('gialla'), 'il medio è arancio e giallo');
  assert.ok(spinto.has('blu') && flamePalFor(2, 0.1) === 'blu', 'lo spinto è blu');
  assert.equal(flamePalFor(0, 0.5), 'arancio');
});
