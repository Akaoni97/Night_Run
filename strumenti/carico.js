// Sfruttamento del motore grafico: misura quanto pesa ogni parte del gioco su un fotogramma e stampa lo schema a barre
// (come in SFRUTTAMENTO.md). Avvia il gioco con strumenti/prova.js, passa alla densità doppia, guida in città e
// cronometra le funzioni di Street2D (tempo proprio, senza quello delle funzioni chiamate), la fisica e il resto del
// ciclo. Poi converte i tempi per un PC di gamma media (CONV) e li mette in percentuale sul fotogramma da 16,7 ms.
//
// Uso (dalla radice, serve Playwright con Chromium):
//   node strumenti/carico.js [--secondi 9] [--pioggia] [--json file]
// Le cifre del computer dove gira sono vere; quelle del «PC medio» sono una stima (CONV): vanno prese con ±30-50 %.
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');

const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const SEC = +opt('--secondi', 9), PIOGGIA = args.includes('--pioggia'), JSON_OUT = opt('--json', '');
const BUDGET = 1000 / 60;   // ms di un fotogramma a 60 al secondo

// Conversione dal computer della misura (cloud senza scheda video, 2 core Xeon 2,1 GHz) a un PC medio (Ryzen 5 / i5 recente
// con GTX 1660 o RTX 3060): il codice JavaScript va ~2,2 volte più veloce, gli effetti che coprono tutto lo schermo li fa la
// scheda video (~7 volte più veloce). Se si misura su un PC vero si mette --conv 1.
const CONV = { cpu: +opt('--conv', 2.2), gpu: +opt('--conv', 7) };

// Le parti dello schema: nome, funzioni di Street2D (o etichette speciali) e se sono a tutto schermo (scheda video).
const PARTI = [
  ['Pilota in auto', ['drawDriver', 'drvPixel', 'heroOutline', 'glassMasks', 'pgDriverDraw']],
  ['Logica, traffico, quadro, polizia', ['(resto del ciclo)', 'update', 'perfStep']],
  ['Asfalto bagnato e riflessi', ['wetHD', 'vitaRiflessi', 'fxFariBagnato'], true],
  ['Foschia sulle auto', ['fxHaze', 'hazeOf'], true],
  ['Ingrandimento allo schermo', ['blit', 'present'], true],
  ['Luci notturne e bagliore', ['glowPass', 'lightPass', 'light', 'lightAdd', 'lampCone', 'fxBodyLight', 'fxBeam', 'fxHeadlamp', 'rimOf'], true],
  ['Fisica (motore, gomme, turbo)', ['sim.update']],
  ['Città, palazzi, cielo', ['drawCity', 'building', 'tileHD', 'districtAt', 'districtInfo', 'districtMix', 'skyHD', 'drawSky', 'drawTrain', 'span', 'drawScenery', 'walkHD', 'curbHD', 'lampHD', 'landmark', 'kindExtra', 'drawNearSide']],
  ['Passanti', ['districtPeople', 'pedSprite', 'cityProps']],
  ['Fumo, gomme, fiamme, marmitta', ['puffSprite', 'fxParts', 'fxCar', 'fxFlame', 'fxFlameV', 'fxTorch', 'fxBang', 'fxMarmitta', 'fxShadow', 'tireFx', 'wheelDraw', 'v40Wheel', 'genWheel', 'supraWheel', 'body', 'bodyHD', 'scenaTick', 'scenaNuova', '_scenaCorpo', '_scenaSpara', '_fireBlob']],
  ['Vita (stormi, foglie, falene)', ['vitaSky', 'vitaRoad', 'vitaFront']],
  ['Scritte, radar, specchietto', ['text', 'drawLaneRadar', 'drawMirror', 'paintMirror', 'drawComics', 'comic', 'comicEv', 'reaDraw', 'districtBanner']],
];

const WRAP = `(() => {
  const P = Street2D.prototype, M = (window.__prof = { self: {}, n: {}, frames: 0, frame: [] }), stack = [];
  const wrap = (obj, name, label) => {
    const f = obj[name]; if (typeof f !== 'function' || f.__w) return;
    const w = function (...a) { const t = performance.now(); stack.push(0);
      try { return f.apply(this, a); } finally { const dt = performance.now() - t, ch = stack.pop();
        M.self[label] = (M.self[label] || 0) + dt - ch; M.n[label] = (M.n[label] || 0) + 1; if (stack.length) stack[stack.length - 1] += dt; } };
    w.__w = 1; obj[name] = w; };
  for (const k of Object.getOwnPropertyNames(P)) if (k !== 'constructor') { try { wrap(P, k, k); } catch (e) {} }
  wrap(sim, 'update', 'sim.update');
  const R = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => R((ts) => { const t = performance.now(); stack.push(0); cb(ts);
    const dt = performance.now() - t, ch = stack.pop(); M.self['(resto del ciclo)'] = (M.self['(resto del ciclo)'] || 0) + dt - ch; M.frame.push(dt); M.frames++; });
  return 'ok'; })()`.replace(/\n\s*/g, ' ');
const DUMP = `JSON.stringify({ frames: __prof.frames, self: __prof.self, frame: __prof.frame.slice(10), SS: nightRun.view2d.SS, heap: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1e6) : null, ls: (() => { let t = 0; for (let i = 0; i < localStorage.length; i++) t += localStorage.getItem(localStorage.key(i)).length; return t; })() })`;

const passi = [
  "js:(()=>{NR_PREST.densita='doppia';nightRun.view2d.pfLv=0;return 1})()",
  PIOGGIA ? 'js:(()=>{nightRun.view2d.setRain&&nightRun.view2d.setRain(1);if(sim)sim.wet=1;return 1})()' : 'aspetta:10',
  'js:nightRun.engineTap()', 'aspetta:2000', "js:nightRun.leva('D')",
  'js:' + WRAP, `tieni:KeyW:${Math.round(SEC * 1000)}`, 'js:' + DUMP,
];
let out;
try { out = execFileSync('node', [path.join(__dirname, 'prova.js'), '--out', '/tmp/nr-carico', ...passi], { encoding: 'utf8', maxBuffer: 64 << 20, timeout: (SEC + 90) * 1000 }); }
catch (e) { console.error('la prova si è fermata:', e.message); process.exit(2); }
const riga = out.split('\n').find((l) => l.includes('→') && l.includes('"frames'));
if (!riga) { console.error('misura non trovata nell\'uscita di prova.js'); process.exit(2); }
const D = JSON.parse(JSON.parse(riga.slice(riga.indexOf('→') + 1).trim()));

const perFr = (k) => (D.self[k] || 0) / D.frames;
const usati = new Set(), righe = [];
for (const [nome, fn, gpu] of PARTI) {
  const ms = fn.reduce((s, k) => s + perFr(k), 0); fn.forEach((k) => usati.add(k));
  righe.push({ nome, ms, pc: ms / (gpu ? CONV.gpu : CONV.cpu) });
}
const altro = Object.keys(D.self).filter((k) => !usati.has(k)).reduce((s, k) => s + perFr(k), 0);
righe.push({ nome: 'Altro disegno 2D', ms: altro, pc: altro / CONV.cpu });
righe.sort((a, b) => b.pc - a.pc);
const fr = D.frame.slice().sort((a, b) => a - b), media = fr.reduce((s, x) => s + x, 0) / fr.length;
const tot = righe.reduce((s, r) => s + r.pc, 0);

const barra = (p) => { const n = Math.max(0, p) / 10, pieni = Math.floor(n), r = n - pieni, parz = ['', '▏', '▎', '▍', '▌', '▋', '▊', '▉'][Math.floor(r * 8)];
  return '`' + ('█'.repeat(Math.min(10, pieni)) + (pieni < 10 ? parz : '')).padEnd(10, '░').slice(0, Math.max(10, pieni + 1)) + '`'; };
const pct = (v) => (v < 2 ? v.toFixed(1) : Math.round(v)).toString().replace('.', ',') + ' %';
const oggi = new Date().toLocaleDateString('it-IT');
console.log(`Sfruttamento del motore grafico · ${oggi} · ${PIOGGIA ? 'città di notte con la pioggia' : 'città di notte'}, densità doppia, ${SEC} s di guida`);
console.log(`Misurato qui: ${media.toFixed(1)} ms a fotogramma (${Math.round(1000 / media)} al secondo), memoria ${D.heap ?? '?'} MB, salvataggi ${Math.round(D.ls / 1024)} KB\n`);
console.log('| Parte | Carico sul fotogramma (PC medio) | Stima | Misurato qui |');
console.log('|---|---|---|---|');
for (const r of righe) console.log(`| ${r.nome} | ${barra(r.pc / BUDGET * 100)} | ~${pct(r.pc / BUDGET * 100)} | ${r.ms.toFixed(2).replace('.', ',')} ms |`);
console.log(`| **Totale** | ${barra(tot / BUDGET * 100)} | **~${pct(tot / BUDGET * 100)}** | ${righe.reduce((s, r) => s + r.ms, 0).toFixed(1).replace('.', ',')} ms |`);
if (JSON_OUT) fs.writeFileSync(JSON_OUT, JSON.stringify({ data: oggi, pioggia: PIOGGIA, media, righe, tot, budget: BUDGET, conv: CONV, heap: D.heap, ls: D.ls, funzioni: Object.fromEntries(Object.keys(D.self).map((k) => [k, +perFr(k).toFixed(3)]).sort((a, b) => b[1] - a[1])) }, null, 1));
