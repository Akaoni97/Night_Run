// Meteo (v0.90, decisioni di Nico del 22/11): il tempo dinamico va secondo il paesaggio e l'ora, neve e nebbia anche in
// città, di notte la nebbia solo ogni tanto (il resto nei momenti horror), il vento entra nella fisica.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const met = readFileSync(new URL('meteo2d.js', dir), 'utf8');
const window = {};
new Function('window', 'Street2D', met)(window, Object.assign(function () {}, { prototype: {}, rnd: () => 0.5 }));
const pesi = window.NightMeteo.meteoPesi;
const p = (bg, h, t) => (pesi(bg, h).find((x) => x[0] === t) || [t, 0])[1];

test('neve e nebbia anche in città', () => {
  assert.ok(p('city', 7, 'nebbia') > 0.2, 'nebbia in città all\'alba');
  assert.ok(p('city', 2, 'neve') > 0.08, 'neve in città di notte');
});

test('il tempo segue l\'ora', () => {
  assert.ok(p('plain', 6, 'nebbia') > p('plain', 14, 'nebbia') * 2, 'nebbia all\'alba più che a mezzogiorno');
  assert.ok(p('plain', 2, 'nebbia') < p('plain', 19, 'nebbia') / 2, 'di notte la nebbia solo ogni tanto');
  assert.ok(p('mountain', 2, 'neve') > p('mountain', 14, 'neve'), 'neve più facile di notte');
  assert.ok(p('desert', 15, 'vento') > p('desert', 2, 'vento'), 'vento soprattutto di pomeriggio');
  for (const bg of ['plain', 'village', 'mountain', 'desert', 'highway', 'city', 'sea']) for (let h = 0; h < 24; h++)
    assert.ok(pesi(bg, h).reduce((a, x) => a + x[1], 0) <= 0.851, `${bg} alle ${h}: resta anche il sereno`);
});

test('il vento entra nella fisica: contro frena, a favore spinge, senza vento come prima', () => {
  const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'suoni.js', 'cars.js', 'samples.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
  const E = new Function(src + ';return { CARS, SupraSim }')();
  const H = 1 / 240;
  const vmax = (windV, windX) => {
    const s = new E.SupraSim(), c = E.CARS.panda, sel = Object.fromEntries(Object.keys(c.tuning).map((k) => [k, c.tuning[k].items[0].id]));
    s.setCar(Object.assign({}, c.P)); s.setTune(c.params(sel).sim); s.P.fwd = true; s.P.rearW = c.driveW; s.windV = windV; s.windX = windX;
    s.setIgnition(true); for (let t = 0; t < 4; t += H) { s.setStarter(t < 1.2); s.update(H); s.events.length = 0; }
    s.shift(4); let best = 0; for (let t = 0; t < 90; t += H) { s.in.thr = 1; if (s.gear === 4 && s.rpm > 5600) s.shift(5); s.update(H); s.events.length = 0; best = Math.max(best, s.v * 3.6); }
    return best;
  };
  const calma = vmax(0, 0), contro = vmax(10, 0), favore = vmax(-10, 0), traverso = vmax(0, 20);
  assert.ok(contro < calma - 10, `vento contro: ${contro.toFixed(0)} contro ${calma.toFixed(0)} km/h`);
  assert.ok(favore > calma + 8, `vento a favore: ${favore.toFixed(0)} contro ${calma.toFixed(0)} km/h`);
  assert.ok(traverso < calma - 0.3, `vento di traverso: ${traverso.toFixed(0)} contro ${calma.toFixed(0)} km/h`);
  assert.equal(new E.SupraSim().windV, undefined, 'di serie niente vento');
});
