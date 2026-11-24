// Il motore audio come gira davvero nel gioco (v0.144): nel worklet arriva solo il testo di BQ ed EngineDSP più le costanti
// che index.html copia a parte (dspConst). Se EngineDSP usa una costante globale che non viene copiata, nel gioco il motore
// va in errore al primo campione e resta muto (successo con la v0.142: DSP_TB e DSP_CB). Qui si ricostruisce lo stesso
// testo, lo si fa girare isolato e si controlla che suoni.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const dir = new URL('../', import.meta.url);
const dsp = readFileSync(new URL('dsp.js', dir), 'utf8');
const tutto = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'suoni.js', 'cars.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const html = readFileSync(new URL('index.html', dir), 'utf8');

test('worklet: EngineDSP suona da solo, con le sole costanti che index.html gli copia', () => {
  const G = new Function(tutto + ';return { CARS, BQ, EngineDSP, DSP_TB: typeof DSP_TB !== "undefined" ? DSP_TB : undefined, DSP_CB: typeof DSP_CB !== "undefined" ? DSP_CB : undefined };')();
  // quali costanti copia index.html: i nomi tra «typeof X !== 'undefined'» nella riga di dspConst
  const riga = html.slice(html.indexOf('const dspConst'), html.indexOf('const src = dspConst'));
  const nomi = [...riga.matchAll(/typeof (\w+) !== 'undefined'/g)].map((m) => m[1]);
  const testa = nomi.map((k) => `const ${k} = ${JSON.stringify(G[k])};`).join('\n');
  const src = testa + '\n' + G.BQ.toString() + '\n' + G.EngineDSP.toString() + '\n;return EngineDSP;';
  const Iso = new Function(src)();                       // isolato: niente altro di dsp.js in vista
  for (const id of ['panda', 'supra', 'v40']) {
  const c = G.CARS[id], d = new Iso(48000);
  d.msg({ cfg: { tune: c.params(c.presets[0].sel).dsp, view: 1, vol: 1, fx: {} }, p: { rpm: 3000, thr: 0.5, charge: 0.5, air: 0.5, running: 1 } });
  const L = new Float32Array(4096), R = new Float32Array(4096);
  assert.doesNotThrow(() => { for (let i = 0; i < 12; i++) d.render(L, R, L.length); }, id + ': il motore va in errore nel worklet (manca una costante in dspConst di index.html?)');
  const rms = Math.sqrt(L.reduce((s, x) => s + x * x, 0) / L.length);
  assert.ok(rms > 1e-3, id + ': il motore nel worklet è muto (rms ' + rms + ')');
  }
});
