// Ascolta i campioni dei pezzi insieme al motore sintetizzato, fuori dal gioco: la fisica vera (sim.js) guida dsp.js e il
// lettore dei campioni (campioni.js) in un OfflineAudioContext di Chromium, con lo stesso compressore del gioco. Salva un WAV
// del mix e stampa i livelli ogni mezzo secondo: motore da solo, campioni da soli, mix (per tarare i volumi di CMP.g).
//
// Uso (dalla radice del repository, serve Playwright con Chromium, come strumenti/prova.js):
//   node strumenti/ascolta_campioni.js <auto> '<pezzi in JSON>' <copione> <file.wav> [vista 0|1|2] [ambiente 0|1|2]
//   copioni: giro (minimo, gas a fondo tre marce, rilascio lungo, un colpo di gas, rilascio), launch (2-step da fermo,
//            partenza, cambiate, rilascio), limitatore (in folle contro il limitatore, poi rilascio)
//   nei pezzi: "__pops":1 accende la mappa pop & bang, "__launch":1 il launch; "__kit":{"valvola":"valvola/gufo"} forza dei kit
// Esempio:
//   node strumenti/ascolta_campioni.js v40 '{"turbo":"td04","exhaust":"turboback","ecu":"standalone","__pops":1}' giro /tmp/v40.wav
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const [car = 'v40', pezziJ = '{}', copione = 'giro', out = 'campioni.wav', vista = '1', amb = '0'] = process.argv.slice(2);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.wav': 'audio/wav', '.json': 'application/json' };
const PAGINA = '<!doctype html><meta charset="utf-8">' + ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'cars.js', 'campioni.js'].map((f) => `<script src="/${f}"></script>`).join('');
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/__ascolta__')) { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(PAGINA); }
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
});

// gira nella pagina: fisica + sintesi a fotogrammi, poi due rese offline (solo campioni, mix)
async function rendi(o) {
  const SR = 48000, dt = 1 / 60, car = o.car, pezzi = o.pezzi;
  setActiveCar(car);
  const sel = {}; for (const k in TUNING) sel[k] = TUNING[k].items[0].id;
  for (const k in pezzi) if (!k.startsWith('__')) sel[k] = pezzi[k];
  const TP = tuningParams(sel), sim = new SupraSim();
  sim.setCar(car === 'supra' ? null : Object.assign({}, CARS[car].P)); sim.setTune(TP.sim);
  Object.assign(sim.cfg, { pops: !!pezzi.__pops && !!TP.sim.ecuPops, launch: !!pezzi.__launch, autoClutch: true, revMatch: true, tc: true });
  const info = cmpInfo(TUNING, sel, TP, car), res = cmpRisolvi({ mode: 'free', s: {} }, car, info);
  Object.assign(res, pezzi.__kit || {});
  const dsp = new EngineDSP(SR);
  dsp.msg({ cfg: { tune: TP.dsp, view: o.view, vol: 0.8, pops: sim.cfg.pops ? 1 : 0, fx: cmpFx(res) } }); dsp.msg({ env: o.env });
  // avviamento (non registrato)
  sim.setIgnition(true); sim.setStarter(true);
  const tmp = new Float32Array(Math.ceil(SR * dt) + 2), tmp2 = new Float32Array(tmp.length);
  for (let t = 0; t < 2.5; t += dt) { if (sim.running && sim.rpm > 600) sim.setStarter(false); sim.update(dt); dsp.msg({ p: sim.audioParams(), ev: sim.events.splice(0) }); dsp.render(tmp, tmp2, Math.round(SR * dt)); }
  const lim = sim.P.limiter, top = sim.topGear();
  const box = (q) => { if (q.gear > 0 && q.gear < top && q.rpm > lim - 250 && !q.shiftSeq) q.shift(q.gear + 1); };
  const C = {
    giro: { sec: 14, f: (q, t) => {
      if (t < 1.2) { q.in.thr = 0; q.in.brake = 0; }
      else if (t < 1.3) { if (q.gear === 0) q.shift(1); }
      else if (t < 7.5) { q.in.thr = 1; box(q); }
      else if (t < 10.5) q.in.thr = 0;
      else if (t < 11.6) { q.in.thr = 1; box(q); }
      else q.in.thr = 0;
    } },
    launch: { sec: 12, f: (q, t) => {
      if (t < 0.4) { q.in.brake = 1; if (q.gear === 0) q.shift(1); }
      else if (t < 3.2) { q.in.brake = 1; q.in.thr = 1; }
      else if (t < 8.5) { q.in.brake = 0; q.in.thr = 1; box(q); }
      else q.in.thr = 0;
    } },
    limitatore: { sec: 7, f: (q, t) => { q.in.thr = t > 0.8 && t < 4.5 ? 1 : 0; } },
  }[o.copione] || null;
  if (!C) throw new Error('copione sconosciuto: ' + o.copione);
  const N = Math.round(C.sec * SR), L = new Float32Array(N), R = new Float32Array(N), frames = [];
  let i0 = 0, t = 0;
  while (i0 < N) {
    C.f(sim, t); sim.update(dt);
    const ev = sim.events.splice(0), n = Math.min(N - i0, Math.round(SR * (t + dt)) - i0);
    dsp.msg({ p: sim.audioParams(), ev }); dsp.render(L.subarray(i0, i0 + n), R.subarray(i0, i0 + n), n);
    const ratio = sim.ratio(sim.gear);
    frames.push({ t, ev, q: { running: sim.running, rpm: sim.rpm, thr: sim.thr, cut: sim.cut, v: sim.v, tur: sim.tur, wg: sim.wg, gear: sim.gear, ww: sim.ww, ovr: sim.ovr, cfg: { pops: sim.cfg.pops }, shiftSeq: sim.shiftSeq ? 1 : null, launchArmed: sim.launchArmed, kmh: sim.kmh, ratio: () => ratio } });
    i0 += n; t += dt;
  }
  async function resa(conSintesi, conCampioni) {
    const ctx = new OfflineAudioContext(2, N, SR);
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -8; comp.knee.value = 6; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.12;   // come ensureAudio
    comp.connect(ctx.destination);
    if (conSintesi) { const b = ctx.createBuffer(2, N, SR); b.copyToChannel(L, 0); b.copyToChannel(R, 1); const s = ctx.createBufferSource(); s.buffer = b; s.connect(comp); s.start(0); }
    if (conCampioni) {
      const pl = new CampioniPlayer(ctx, comp); pl.setKits(res, info);
      await Promise.all(Object.values(res).filter(Boolean).map((id) => pl.load(id)));
      for (const f of frames) { pl.clock = f.t; pl.tick(f.q, f.ev, dt, { view: o.view, env: o.env, vol: 0.8, exh: 1 }); }
    }
    const b = await ctx.startRendering();
    return [b.getChannelData(0), b.getChannelData(1)];
  }
  const solo = await resa(false, true), mix = await resa(true, true), mot = await resa(true, false);
  // livelli ogni mezzo secondo
  const db = (x) => (x > 1e-9 ? (20 * Math.log10(x)).toFixed(1) : '-∞');
  const mis = (ch, a, b) => { let s = 0, p = 0; for (let i = a; i < b; i++) { const v = ch[0][i]; s += v * v; p = Math.max(p, Math.abs(v)); } return [Math.sqrt(s / Math.max(1, b - a)), p]; };
  const righe = [];
  for (let k = 0; k * 0.5 < C.sec; k++) {
    const a = Math.round(k * 0.5 * SR), b = Math.min(N, Math.round((k + 1) * 0.5 * SR)), fr = frames[Math.min(frames.length - 1, Math.round(k * 0.5 / dt + 0.25 / dt))].q;
    const m1 = mis(mot, a, b), m2 = mis(solo, a, b), m3 = mis(mix, a, b);
    righe.push(`${(k * 0.5).toFixed(1).padStart(5)} s  ${String(Math.round(fr.rpm)).padStart(5)} giri  ${fr.gear}ª  ${String(Math.round(fr.kmh)).padStart(3)} km/h  taglio ${fr.cut}   motore ${db(m1[0]).padStart(6)}/${db(m1[1]).padStart(6)}   campioni ${db(m2[0]).padStart(6)}/${db(m2[1]).padStart(6)}   mix ${db(m3[0]).padStart(6)}/${db(m3[1]).padStart(6)} dB`);
  }
  let sat = 0; for (const ch of mix) for (const v of ch) if (Math.abs(v) > 0.985) sat++;
  // WAV a 16 bit del mix (in base64)
  const pcm = new Int16Array(N * 2); for (let i = 0; i < N; i++) { pcm[2 * i] = Math.max(-1, Math.min(1, mix[0][i])) * 32767; pcm[2 * i + 1] = Math.max(-1, Math.min(1, mix[1][i])) * 32767; }
  const u8 = new Uint8Array(pcm.buffer); let bin = ''; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return { res, righe, sat: sat / (N * 2), b64: btoa(bin), SR, N };
}

(async () => {
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await b.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(`http://127.0.0.1:${server.address().port}/__ascolta__`);
  const r = await page.evaluate(rendi, { car, pezzi: JSON.parse(pezziJ), copione, view: +vista, env: +amb });
  const data = Buffer.from(r.b64, 'base64'), h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
  h.writeUInt32LE(r.SR, 24); h.writeUInt32LE(r.SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(out, Buffer.concat([h, data]));
  console.log('kit che suonano:', Object.entries(r.res).filter(([, v]) => v).map(([k, v]) => `${k}=${v.split('/')[1]}`).join('  ') || 'nessuno');
  console.log('tempo   giri       marcia velocità   taglio   livelli RMS/picco');
  for (const x of r.righe) console.log(x);
  console.log(`saturati: ${(r.sat * 100).toFixed(3)} %   ·   salvato ${out}`);
  if (errs.length) console.log('ERRORI:\n  ' + [...new Set(errs)].join('\n  '));
  await b.close(); server.close();
})().catch((e) => { console.error('ascolto fermo:', e.message); server.close(); process.exit(2); });
