// Suono delle riprese di strumenti/reel/preparate.js: per ogni NOME.json rifà l'audio col motore del gioco (dsp.js) E coi campioni dei
// pezzi montati (campioni.js: turbina, valvola, scoppi, limitatore a raffica...), in un OfflineAudioContext di Chromium col compressore
// del gioco. Usa lo stato della fisica salvato a ogni passo (`q`, `p`, `ev`) e i pezzi della ripresa (`car.sel`, `car.donor`):
// quello che si sente è quello che si vede. Scrive NOME.wav (48 kHz stereo) e stampa i kit che suonano.
// Uso: node strumenti/reel/suono_preparate.js CARTELLA_RIPRESE [vista 0|1|2] [volume campioni 0-2]
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const [dir, vista = '1', volC = '1'] = process.argv.slice(2);
if (!dir) { console.error('uso: node strumenti/reel/suono_preparate.js CARTELLA_RIPRESE [vista] [volume campioni]'); process.exit(1); }
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.wav': 'audio/wav', '.json': 'application/json' };
const PAGINA = '<!doctype html><meta charset="utf-8">' + ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'suoni.js', 'cars.js', 'officina.js', 'campioni.js'].map((f) => `<script src="/${f}"></script>`).join('');
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/__suono__')) { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(PAGINA); }
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
});

async function rendi(o) {
  const SR = 48000, B = 128, { sec, env, tv0, car, log: raw } = o.rip, id = car.id, sel = car.sel;
  setActiveCar(id);
  const game = { mode: 'free', s: { swap: car.donor ? { [id]: car.donor } : {} } };
  if (car.donor) TUNING = offMerge(id, car.donor);                       // eslint-disable-line no-global-assign
  const TP = tuningParams(sel), sim = new SupraSim();
  sim.setCar(Object.assign({}, CARS[id].P)); offSwapApply(game, id, TP, sim, sel); sim.setTune(TP.sim);
  const pops = !!TP.sim.ecuPops;
  const info = cmpInfo(TUNING, sel, TP, id), res = cmpRisolvi(game, id, info), fx = cmpFx(res);
  const log = raw.map((e) => Object.assign({}, e, { t: e.t - tv0 }));
  const N = Math.round(sec * SR), L = new Float32Array(N), R = new Float32Array(N), bl = new Float32Array(B), br = new Float32Array(B);
  const dsp = new EngineDSP(SR);
  dsp.msg({ cfg: { tune: TP.dsp, view: o.vista, vol: 0.9, pops: pops ? 1 : 0, fx } }); dsp.msg({ env: env || 0 });
  let k = 0; while (k < log.length && log[k].t < 0) k++;
  const first = log[Math.max(0, k - 1)];
  if (first) for (let i = 0; i < 40; i++) { dsp.msg({ p: first.p, ev: [] }); dsp.render(bl, br, B); }
  for (let i = 0; i < N; i += B) {
    const tEnd = (i + B) / SR, ev = []; let p = null;
    while (k < log.length && log[k].t <= tEnd) { p = log[k].p; ev.push(...log[k].ev); k++; }
    if (p || ev.length) dsp.msg(p ? { p, ev } : { ev });
    dsp.render(bl, br, B);
    L.set(bl.subarray(0, Math.min(B, N - i)), i); R.set(br.subarray(0, Math.min(B, N - i)), i);
  }
  // campioni: stesso motore audio dei pezzi del gioco, un tick per passo della fisica
  const ctx = new OfflineAudioContext(2, N, SR), comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -8; comp.knee.value = 6; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.12; comp.connect(ctx.destination);
  const b = ctx.createBuffer(2, N, SR); b.copyToChannel(L, 0); b.copyToChannel(R, 1); const src = ctx.createBufferSource(); src.buffer = b; src.connect(comp); src.start(0);
  const pl = new CampioniPlayer(ctx, comp); pl.setKits(res, info);
  await Promise.all(Object.values(res).filter(Boolean).map((x) => pl.load(x)));
  const all = raw.map((e) => Object.assign({}, e, { t: e.t - tv0 }));
  for (let j = 0; j < all.length; j++) {
    const f = all[j]; if (f.t < 0) continue;
    const dt = j > 0 ? Math.max(1 / 240, f.t - all[j - 1].t) : 1 / 60, r = f.q.ratio;
    pl.clock = f.t; pl.tick(Object.assign({}, f.q, { cfg: { pops: f.q.pops }, ratio: () => r }), f.ev, dt, { view: o.vista, env: env || 0, vol: 0.8 * o.volC, exh: 1 });
  }
  const mix = await ctx.startRendering();
  const m0 = mix.getChannelData(0), m1 = mix.getChannelData(1);
  let pk = 0; for (let i = 0; i < N; i++) pk = Math.max(pk, Math.abs(m0[i]), Math.abs(m1[i]));
  const gain = Math.min(0.6, 0.97 / (pk || 1));                          // un po' più basso, mai oltre lo zero: il montaggio poi porta tutto al volume giusto
  const pcm = new Int16Array(N * 2); let peak = 0;
  for (let i = 0; i < N; i++) { peak = Math.max(peak, Math.abs(m0[i] * gain), Math.abs(m1[i] * gain)); pcm[2 * i] = m0[i] * gain * 32767; pcm[2 * i + 1] = m1[i] * gain * 32767; }
  const u8 = new Uint8Array(pcm.buffer); let bin = ''; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return { res, b64: btoa(bin), N, SR, peak, hp: Math.round(sim.estimatePeak().cv) };
}

(async () => {
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await b.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(`http://127.0.0.1:${server.address().port}/__suono__`);
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.json')).sort()) {
    const rip = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (!rip.car || !rip.car.sel) continue;
    const r = await page.evaluate(rendi, { rip, vista: +vista, volC: +volC });
    const data = Buffer.from(r.b64, 'base64'), h = Buffer.alloc(44);
    h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22);
    h.writeUInt32LE(r.SR, 24); h.writeUInt32LE(r.SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
    const out = path.join(dir, f.replace(/\.json$/, '.wav')); fs.writeFileSync(out, Buffer.concat([h, data]));
    console.log(f.replace(/\.json$/, ''), '·', rip.sec + ' s · picco', (20 * Math.log10(r.peak || 1e-9)).toFixed(1), 'dB · kit:', Object.entries(r.res).filter(([, v]) => v).map(([k, v]) => `${k}=${v.split('/')[1]}`).join(' ') || 'nessuno');
  }
  if (errs.length) console.log('ERRORI:\n  ' + [...new Set(errs)].join('\n  '));
  await b.close(); server.close();
})().catch((e) => { console.error('suono fermo:', e.message); server.close(); process.exit(2); });
