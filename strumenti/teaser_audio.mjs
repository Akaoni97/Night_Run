// Suono del motore per il video teaser: rifà l'audio di ogni ripresa col motore audio vero del gioco (EngineDSP),
// usando i parametri salvati da strumenti/teaser.js a ogni passo della fisica (giri, gas, carico, turbo, cambiate,
// avviamento...). Così il suono va esattamente insieme a quello che si vede.
// Uso: node strumenti/teaser_audio.mjs CARTELLA_RIPRESE [auto] [vista]
//   per ogni NOME.json scrive NOME.wav (48 kHz stereo); auto di serie v40, vista 1 = da fuori
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js'].map((f) => readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
const { EngineDSP, CARS } = new Function(src + ';return { EngineDSP, CARS };')();
const [dir, id = 'v40', vista = '1'] = process.argv.slice(2);
if (!dir) { console.error('uso: node strumenti/teaser_audio.mjs CARTELLA_RIPRESE [auto] [vista]'); process.exit(1); }
const SR = 48000, B = 128;

for (const f of readdirSync(dir).filter((n) => n.endsWith('.json')).sort()) {
  const { sec, env, tv0 = 0, car, log: raw } = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
  // auto e preparazione della ripresa (salvate da teaser.js); se mancano, quella data sulla riga di comando
  const c = CARS[(car && car.id) || id], pr = (car && c.presets.find((q) => q.id === car.preset)) || c.presets[0], tp = c.params(pr.sel);
  const log = raw.map((e) => Object.assign({}, e, { t: e.t - tv0 }));   // tempo del video: 0 = primo fotogramma
  const dsp = new EngineDSP(SR);
  dsp.msg({ cfg: { tune: tp.dsp, view: +vista, vol: 1, pops: 0, fx: {} } }); dsp.msg({ env: env || 0 });
  const N = Math.round(sec * SR), L = new Float32Array(N), R = new Float32Array(N), bl = new Float32Array(B), br = new Float32Array(B);
  // un po' di "riscaldamento" fermo sul primo stato, così il motore audio non parte dal silenzio a metà giro
  let k = 0, gF = 1, pF = 0;
  while (k < log.length && log[k].t < 0) k++;                        // quello che succede prima del primo fotogramma non si sente
  const first = log[Math.max(0, k - 1)];
  if (first) for (let i = 0; i < 40; i++) { dsp.msg({ p: first.p, ev: [] }); dsp.render(bl, br, B); }
  for (let i = 0; i < N; i += B) {
    const tEnd = (i + B) / SR, ev = [];
    let p = null;
    while (k < log.length && log[k].t <= tEnd) { p = log[k].p; ev.push(...log[k].ev); k++; }
    let far = 0; for (let j = k - 1; j >= 0 && j >= k - 3; j--) far = Math.max(far, log[j].far || 0);
    if (p || ev.length) dsp.msg(p ? { p, ev } : { ev });
    dsp.render(bl, br, B);
    // auto che si allontana (telecamera ferma): più piano e verso destra, come se passasse oltre
    gF += ((far > 0 ? 1 / (1 + Math.pow(far / 28, 1.4)) : 1) - gF) * 0.02; pF += ((far > 0 ? Math.min(0.85, far / 40) : 0) - pF) * 0.02;
    for (let q = 0; q < B; q++) { bl[q] *= gF * (1 - pF); br[q] *= gF * (1 + 0.25 * pF); }
    L.set(bl.subarray(0, Math.min(B, N - i)), i); R.set(br.subarray(0, Math.min(B, N - i)), i);
  }
  const buf = Buffer.alloc(44 + N * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12); buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
  let peak = 0;
  for (let i = 0; i < N; i++) {
    peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  const out = path.join(dir, f.replace(/\.json$/, '.wav'));
  writeFileSync(out, buf);
  console.log(f.replace(/\.json$/, ''), sec + ' s,', log.length, 'passi, picco', (20 * Math.log10(peak || 1e-9)).toFixed(1), 'dB →', out);
}
