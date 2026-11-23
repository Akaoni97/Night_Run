// Prove delle fiamme secondo il tuning: livello dell'auto (flameTier) e tipo di fiammata (flameStyle).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['fiamme.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { flameTier, flameStyle, flameVariant, flamePalFor, FLAME_BIG_RPM } = new Function(src + ';return { flameTier, flameStyle, flameVariant, flamePalFor, FLAME_BIG_RPM };')();

const auto = (pw, max, spark, pops, extra = 1, ctl = 1) => ({ tune: { pw, turbo: { max }, sparkCut: spark, ecuPops: pops }, extraPw: extra, boostCtl: ctl });
const quote = (tier, kind, rpm) => {                          // frazione di ogni stile su una griglia fitta di numeri a caso
  const q = { torch: 0, free: 0, bang: 0, big: 0 }, N = 2000;
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

test('fiamme: rilascio sotto i 5.000 giri = fiamme di livello medio, sopra = una bella fiammata grossa', () => {
  assert.equal(FLAME_BIG_RPM, 5000);
  for (const t of [1, 2]) {
    const basso = quote(t, 'lift', 0.5), alto = quote(t, 'liftHigh', 0.9);
    assert.ok(basso.free > 0.75 && basso.big === 0, `livello ${t}, sotto i 5.000: fiamma libera (${basso.free.toFixed(2)})`);
    assert.ok(alto.big > 0.55 && alto.free < basso.free, `livello ${t}, sopra i 5.000: la grossa (${alto.big.toFixed(2)})`);
  }
  assert.ok(quote(2, 'liftHigh', 0.9).torch > 0.2, 'nello spinto la grossa ha anche l\'ossidrica');
  assert.ok(quote(0, 'lift', 0.5).bang > 0.8 && quote(0, 'liftHigh', 0.9).bang > 0.55, 'leggero: botti');
});

test('fiamme: ogni famiglia di fiammata esiste e le quote fanno 1', () => {
  const visti = new Set();
  for (const t of [0, 1, 2]) for (const k of ['limiter', 'lift', 'liftHigh', 'shift']) {
    const q = quote(t, k, 0.6); assert.ok(Math.abs(q.torch + q.free + q.bang + q.big - 1) < 1e-9, `${t} ${k}`);
    for (const n of Object.keys(q)) if (q[n] > 0) visti.add(n);
  }
  assert.deepEqual([...visti].sort(), ['bang', 'big', 'free', 'torch']);
  assert.ok(quote(2, 'shift', 0.6).bang > quote(2, 'limiter', 0.95).bang, 'nelle cambiate più botti che al limitatore');
});

test('fiamme: la fiamma libera ha quattro versioni e i colori seguono il livello', () => {
  for (const t of [0, 1, 2]) { const v = new Set(); for (let i = 0; i < 100; i++) v.add(flameVariant(t, i / 100)); assert.ok(v.size >= 3, `livello ${t}: ${[...v]}`); }
  const medio = new Set(), spinto = new Set();
  for (let i = 0; i < 100; i++) { medio.add(flamePalFor(1, i / 100)); spinto.add(flamePalFor(2, i / 100)); }
  assert.ok(medio.has('arancio') && medio.has('gialla'), 'il medio è arancio e giallo');
  assert.ok(spinto.has('blu') && flamePalFor(2, 0.1) === 'blu', 'lo spinto è blu');
  assert.equal(flamePalFor(0, 0.5), 'arancio');
});

// ---------------------------------------------------------------- marmitta rovente (v0.119)
const M = new Function(src + ';return { MARMITTA, marmittaPasso, marmittaRossa };')();
const tira = (tier, sec, o = {}) => {                  // secondi di gas negli ultimi giri, a passi di 1/60
  let h = 0; const n = Math.round(sec * 60);
  for (let i = 0; i < n; i++) h = M.marmittaPasso(h, 1 / 60, Object.assign({ rpm: 6200, lim: 6500, gas: 1, acceso: true, tier }, o));
  return h;
};
test('marmitta: di serie diventa rossa dopo 15 s di giri alti, media dopo 10, spinta dopo 2 e incandescente a 5,5', () => {
  assert.equal(M.marmittaRossa(tira(0, 14.5), 0), 0, 'di serie a 14,5 s ancora fredda');
  assert.ok(M.marmittaRossa(tira(0, 16), 0) > 0.01, 'di serie a 16 s comincia');
  assert.equal(M.marmittaRossa(tira(0, 22), 0), 1, 'di serie a 22 s incandescente');
  assert.equal(M.marmittaRossa(tira(1, 9.5), 1), 0, 'media a 9,5 s fredda');
  assert.ok(M.marmittaRossa(tira(1, 11), 1) > 0.01, 'media a 11 s comincia');
  assert.equal(M.marmittaRossa(tira(2, 1.9), 2), 0, 'spinta a 1,9 s fredda');
  assert.ok(M.marmittaRossa(tira(2, 3.5), 2) > 0.2, 'spinta a 3,5 s già rossa');
  assert.equal(M.marmittaRossa(tira(2, 5.6), 2), 1, 'spinta a 5,6 s incandescente');
});
test('marmitta: sotto gli ultimi 1.500 giri, senza gas o a motore spento non si scalda; poi si raffredda piano', () => {
  assert.equal(tira(2, 10, { rpm: 4900 }), 0, 'a 4.900 giri su 6.500 niente');
  assert.equal(tira(2, 10, { gas: 0.3 }), 0, 'gas a un terzo niente');
  assert.equal(tira(2, 10, { acceso: false }), 0, 'motore spento niente');
  assert.ok(tira(2, 10, { rpm: 6500 }) > 5, 'sul limitatore sì');
  let h = tira(2, 30);
  assert.ok(h <= M.MARMITTA.picco[2] + M.MARMITTA.margine + 1e-9, 'il calore non cresce all\'infinito');
  for (let i = 0; i < 60 * 3; i++) h = M.marmittaPasso(h, 1 / 60, { rpm: 3000, lim: 6500, gas: 0.2, acceso: true, tier: 2 });
  assert.ok(M.marmittaRossa(h, 2) > 0.3, 'dopo 3 s di crociera è ancora rossa');
  for (let i = 0; i < 60 * 10; i++) h = M.marmittaPasso(h, 1 / 60, { rpm: 900, lim: 6500, gas: 0, acceso: true, tier: 2 });
  assert.equal(M.marmittaRossa(h, 2), 0, 'dopo altri 10 s è fredda');
});
