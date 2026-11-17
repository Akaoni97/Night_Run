// Prove degli urti: cosa succede all'auto, all'altra auto, al suono.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, EngineDSP } = new Function(src + ';return { SupraSim, StreetGame, EngineDSP };')();

const setup = () => { const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.dist = 9000; return { sim, game }; };
const car = (game, dx, v) => ({ id: 999, kind: 'traffic', vt: 'panda', len: 3.6, lane: game.lane, x: game.s.dist + dx, v, vT: v, vBase: v });

test('urti: tamponamento: il suono sa che è di muso, l\'altra auto si ammacca, mette le quattro frecce e non inchioda', () => {
  const { sim, game } = setup(), e = car(game, 4, 25); sim.v = 40;
  game.crash(e, 'front');
  const ev = sim.events.find((x) => x.type === 'crash'); assert.ok(ev && ev.kind === 'front' && ev.I > 1);
  assert.ok(e.dent && e.hazT > 5 && e.calmT > 0, 'ammaccata, frecce, rallenta piano');
  assert.ok(game.shockT > 0 && game.shockE === e, 'chi guida molla il gas e si tiene lontano');
  assert.ok(e.v > sim.v, 'quella davanti viene spinta avanti');
  assert.ok(game.fx.some((f) => f.k === 'crash' && f.kind === 'front'));
});

test('urti: strisciata di fianco: suono di strisciata, niente tamponamento', () => {
  const { sim, game } = setup(), e = car(game, 0, 30); sim.v = 34;
  game.crash(e, 'side');
  const ev = sim.events.find((x) => x.type === 'crash'); assert.equal(ev.kind, 'side');
  assert.ok(game.fx.some((f) => f.k === 'scrape' && f.I > 0)); assert.ok(!(game.shockT > 0));
});

// livello medio (RMS) del suono in una finestra, con e senza urto
function level(ev, view, from, to) {
  const d = new EngineDSP(48000), B = 128, L = new Float32Array(B), R = new Float32Array(B);
  d.msg({ cfg: { view, vol: 1 } });
  let s = 0, n = 0, peak = 0;
  for (let i = 0; i < 48000 * to; i += B) {
    d.msg({ p: { rpm: 3200, charge: 0.4, air: 0.35, thr: 0.3, running: 1, speed: 27, drive: 0.3, gearRpm: 3200 }, ev: i === 48000 * 0.5 - (48000 * 0.5) % B && ev ? [ev] : [] });
    d.render(L, R, B);
    if (i >= 48000 * from) for (let k = 0; k < B; k++) { s += L[k] * L[k]; n++; peak = Math.max(peak, Math.abs(L[k])); assert.ok(Number.isFinite(L[k])); }
  }
  return { rms: Math.sqrt(s / n), peak };
}

test('urti: il tamponamento si sente sopra il motore in tutti i punti d\'ascolto, e poi sparisce', () => {
  for (const view of [0, 1, 2]) {
    const quiet = level(null, view, 0.5, 0.8).rms, loud = level({ type: 'crash', I: 1.2, kind: 'front' }, view, 0.5, 0.8).rms;
    assert.ok(20 * Math.log10(loud / quiet) > 4, `vista ${view}: +${(20 * Math.log10(loud / quiet)).toFixed(1)} dB`);
    const after = level({ type: 'crash', I: 1.2, kind: 'front' }, view, 2.5, 3.5).rms, base = level(null, view, 2.5, 3.5).rms;
    assert.ok(Math.abs(20 * Math.log10(after / base)) < 2.5, `vista ${view}: dopo 2 s torna il motore (${(20 * Math.log10(after / base)).toFixed(2)} dB)`);
  }
});

test('urti: la strisciata dura più del colpo secco', () => {
  const base = level(null, 1, 0.7, 0.9).rms;
  const side = level({ type: 'crash', I: 0.8, kind: 'side' }, 1, 0.7, 0.9).rms, bump = level({ type: 'bump', I: 0.4 }, 1, 0.7, 0.9).rms;
  assert.ok(side > base * 1.15, `dopo 0,2-0,4 s la strisciata si sente ancora (${(20 * Math.log10(side / base)).toFixed(1)} dB)`); assert.ok(side > bump);
});
