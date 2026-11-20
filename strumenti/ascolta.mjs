// Ascolto "a orecchio spento": fa girare la fisica vera di un'auto (SupraSim) e il motore audio vero (EngineDSP)
// fuori dal browser, salva un file WAV da ascoltare e stampa i numeri che contano (volume, picchi, saturazione,
// giri e frequenza degli scoppi). Serve agli assistenti, che nel browser di prova non hanno l'audio.
//
// Uso (dalla radice del repository):
//   node strumenti/ascolta.mjs <auto> <copione> <file.wav> [vista] [ambiente]
//   auto:     id di CARS (supra, v40, e30, panda...)
//   copione:  minimo (8 s al minimo) | sgasate (in folle, colpi di gas) | allungo (da fermo, gas a fondo, cambia
//             marcia vicino al limitatore) | crociera (in 4ª a velocità costante, gas parziale) | limitatore (in folle sul limitatore) | rilascio (in 3ª gas a fondo e poi gas mollato: borbottio)
//             | urti (a 100 km/h: tamponamento forte a 2 s, strisciata a 5 s, colpetto a 8 s, tamponamento leggero a 10 s)
//   vista:    0 abitacolo (predefinita), 1 esterno, 2 vano motore
//   ambiente: 0 strada aperta (predefinito), 1 città, 2 galleria
// Esempio: node strumenti/ascolta.mjs e30 allungo /tmp/e30.wav 1
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js'].map((f) => readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
const { EngineDSP, SupraSim, CARS } = new Function(src + ';return { EngineDSP, SupraSim, CARS };')();

const [id = 'v40', copione = 'allungo', out = 'ascolto.wav', vista = '0', amb = '0'] = process.argv.slice(2);
const c = CARS[id];
if (!c) { console.error('auto sconosciuta: ' + id + '\nauto: ' + Object.keys(CARS).join(', ')); process.exit(1); }

const SR = 48000, B = 128, dt = B / SR;
// PRESET=<id> sceglie la preparazione (es. single per la Supra), POPS=1 accende la mappa pop & bang
const pr = (process.env.PRESET && c.presets.find((q) => q.id === process.env.PRESET)) || c.presets[0];
const tp = c.params(pr.sel);
const sim = new SupraSim();
sim.setCar(id === 'supra' ? null : Object.assign({}, c.P));
sim.setTune(tp.sim); sim.P.mass = c.mass; sim.P.fwd = c.fwd; sim.P.rearW = c.driveW;
const dsp = new EngineDSP(SR);
dsp.msg({ cfg: { tune: tp.dsp, view: +vista, vol: 1, pops: process.env.POPS ? 1 : 0, fx: {}, character: process.env.CARATTERE || 'originale' } }); sim.cfg.pops = !!process.env.POPS; dsp.msg({ env: +amb });

const lim = tp.sim.limiter || 7000, cyl = (tp.dsp && tp.dsp.cyl) || 6;
// copioni: (t, sim) → gas, e intanto cambiano marcia; durata in secondi
const COP = {
  minimo: { T: 8, f: () => 0 },
  sgasate: { T: 10, f: (t) => (t % 2.5 > 1 && t % 2.5 < 1.45 ? 1 : 0) },
  limitatore: { T: 6, f: (t) => (t > 1 ? 1 : 0) },
  rilascio: { T: 14, f: (t, s) => { if (s.gear !== 3 && !s.shiftSeq) { s.gear = 3; s.v = 100 / 3.6; s.ww = s.v / s.P.r; s.wo = s.ww; } return t % 7 < 2.2 ? 1 : 0; } },   // in 3ª: gas a fondo 2 s, poi si molla per 5 s, due volte (borbottio al rilascio)
  scoppi: { T: 12, f: (t) => (t % 3 > 0.6 && t % 3 < 1.5 ? 1 : 0) },        // in folle: sgasata fino in alto e rilascio, quattro volte (scoppi in rilascio)
  allungo: { T: 16, f: (t, s) => {
    if (t < 1) return 0;
    if (s.gear === 0) { s.shift(1); }
    if (s.rpm > lim * 0.96 && s.gear > 0 && s.gear < s.topGear() && !s.shiftSeq) s.shift(s.gear + 1);
    return 1;
  } },
  // urti a 100 km/h in 4ª: tamponamento forte (2 s), strisciata di fianco (5 s), colpetto (8 s), tamponamento leggero (10 s)
  urti: { T: 12, ev: [[2, { type: 'crash', I: 1.4, kind: 'front' }], [5, { type: 'crash', I: 0.5, kind: 'side' }], [8, { type: 'bump', I: 0.4, hit: true }], [10, { type: 'crash', I: 0.5, kind: 'rear' }]],
    f: (t, s) => { if (s.gear !== 4 && !s.shiftSeq) { s.gear = 4; s.v = 100 / 3.6; s.ww = s.v / s.P.r; s.wo = s.ww; } return 0.3; } },
  crociera: { T: 10, f: (t, s) => { if (s.gear !== 4 && !s.shiftSeq) { s.gear = 4; s.v = 100 / 3.6; s.ww = s.v / s.P.r; s.wo = s.ww; } return 0.3; } },
};
const C = COP[copione];
if (!C) { console.error('copione sconosciuto: ' + copione + ' (' + Object.keys(COP).join(', ') + ')'); process.exit(1); }

// avviamento a parte (non si registra), poi il copione
sim.setIgnition(true);
for (let t = 0; t < 4; t += 1 / 60) { sim.setStarter(t < 1.2); sim.update(1 / 60); sim.events.length = 0; }

let nPop = 0; const _ap = dsp.addPop.bind(dsp), _ab = dsp.addBurble ? dsp.addBurble.bind(dsp) : null; dsp.addPop = (...a) => { nPop++; return _ap(...a); }; if (_ab) dsp.addBurble = (...a) => { nPop++; return _ab(...a); };
const N = Math.round(C.T * SR), L = new Float32Array(N), R = new Float32Array(N), bl = new Float32Array(B), br = new Float32Array(B);
const rpmAt = new Float32Array(Math.ceil(N / B)), gearAt = new Int8Array(rpmAt.length);
let k = 0;
for (let i = 0; i < N; i += B, k++) {
  const t = i / SR;
  sim.in.thr = C.f(t, sim); sim.in.clutch = 0; sim.in.brake = 0;
  sim.update(dt);
  const evs = sim.events.splice(0);
  if (C.ev) for (const [te, e] of C.ev) if (te >= t && te < t + dt) evs.push(Object.assign({}, e));
  dsp.msg({ p: sim.audioParams(), ev: evs });
  dsp.render(bl, br, B);
  L.set(bl.subarray(0, Math.min(B, N - i)), i); R.set(br.subarray(0, Math.min(B, N - i)), i);
  rpmAt[k] = sim.rpm; gearAt[k] = sim.gear;
}

// WAV 16 bit stereo, senza guadagno: quello che esce dal motore audio
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12); buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
let clip = 0;
for (let i = 0; i < N; i++) {
  if (Math.abs(L[i]) > 1 || Math.abs(R[i]) > 1) clip++;
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
}
writeFileSync(out, buf);

// frequenza fondamentale con l'autocorrelazione (25-600 Hz) su un pezzo mono
function fund(a, b) {
  const n = Math.min(b - a, 8192), x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = (L[a + i] + R[a + i]) / 2;
  let best = 0, lag = 0;
  for (let l = Math.floor(SR / 600); l < SR / 25; l++) { let s = 0; for (let i = 0; i + l < n; i++) s += x[i] * x[i + l]; if (s > best) { best = s; lag = l; } }
  return lag && lag > Math.floor(SR / 600) ? SR / lag : 0;   // al bordo = rumore, nessuna nota chiara
}
const db = (v) => (v > 0 ? (20 * Math.log10(v)).toFixed(1) : '-inf');
console.log(`${c.name || id} · ${copione} · vista ${vista} · ambiente ${amb} · ${cyl} cilindri, limitatore ${lim} giri → ${out}`);
console.log('  s     giri  marcia  RMS dB  picco dB  scoppi attesi Hz  fondamentale Hz');
const seg = Math.round(SR * (C.T > 10 ? 1 : 0.5));
let rmsAll = 0, peakAll = 0;
for (let a = 0; a < N; a += seg) {
  const b = Math.min(N, a + seg); let s = 0, p = 0;
  for (let i = a; i < b; i++) { const m = (L[i] + R[i]) / 2; s += m * m; p = Math.max(p, Math.abs(L[i]), Math.abs(R[i])); }
  rmsAll += s; peakAll = Math.max(peakAll, p);
  const kk = Math.min(rpmAt.length - 1, Math.floor((a + b) / 2 / B)), rpm = rpmAt[kk];
  console.log(`${(a / SR).toFixed(1).padStart(4)}  ${String(Math.round(rpm)).padStart(6)}  ${String(gearAt[kk]).padStart(6)}  ${db(Math.sqrt(s / (b - a))).padStart(6)}  ${db(p).padStart(8)}  ${(rpm / 60 * cyl / 2).toFixed(0).padStart(16)}  ${(fund(a, b) ? fund(a, b).toFixed(0) : '—').padStart(15)}`);
}
console.log(`schiocchi contati (scoppi, borbottii): ${nPop} in ${C.T} s`);
console.log(`totale: RMS ${db(Math.sqrt(rmsAll / N))} dB, picco ${db(peakAll)} dB, campioni saturati ${clip} (${(clip / N * 100).toFixed(2)} %)`);
if (clip / N > 0.001) console.log('ATTENZIONE: il suono satura (oltre lo 0,1 % dei campioni fuori scala)');
