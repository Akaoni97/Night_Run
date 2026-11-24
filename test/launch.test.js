// Launch control (v0.158): spento non limita niente, nemmeno con lo stutter box; acceso limita ai giri del launch.
// Scoppiettii (v0.158): scarico e catalizzatore di serie = niente, poi crescono coi livelli (tuning.js scoppiPop).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'suoni.js', 'cars.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { SupraSim, CARS, scoppiPop };')();
const H = 1 / 1000;

function sgasa(launch) {
  const s = new E.SupraSim(); s.setTune({ limType: 'stutter', ecuLaunch: true });
  s.cfg.launch = launch; s.setIgnition(true);
  for (let t = 0; t < 3; t += H) { s.setStarter(t < 1.2); s.update(H); }
  let mx = 0; for (let t = 0; t < 3; t += H) { s.in.thr = 1; s.update(H); mx = Math.max(mx, s.rpm); }
  return { mx, lr: s.P.launchRpm, lim: s.P.limiter };
}
test('launch spento: in folle i giri salgono fino al limitatore, anche con lo stutter box', () => {
  const off = sgasa(false), on = sgasa(true);
  assert.ok(off.mx > off.lim - 400, `spento: arriva a ${off.mx | 0} (limitatore ${off.lim})`);
  assert.ok(on.mx < on.lr + 300, `acceso: ${on.mx | 0}, launch a ${on.lr}`);
});

test('scoppiettii: di serie niente, primo livello pochi, poi sempre di più', () => {
  const c = E.CARS.e36, P = (ex, cat, sim) => E.scoppiPop(c.tuning, { exhaust: ex, cat }, sim || {});
  assert.equal(P('oem', 'oem'), 0);
  const a = P('terminale', 'oem'), b = P('terminale', 'sport'), m = P('race', 'decat');
  assert.ok(a > 0 && b > a && m > b, `${a} ${b} ${m}`);
  assert.ok(P('oem', 'oem', { ecuPops: true }) >= 1.4, 'la mappa pop & bang scoppietta anche con lo scarico di serie');
});
