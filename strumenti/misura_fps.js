// Night Run · misura dei fotogrammi e di dove va il tempo (per le ottimizzazioni)
// Avvia il gioco come strumenti/prova.js, mette un posto, l'ora e il meteo, guida col gas a fondo e:
//   1. conta i fotogrammi per qualche secondo (fps, media e peggiori del tempo fra un fotogramma e l'altro);
//   2. registra il profilo della CPU di Chrome e somma il tempo «proprio» di ogni funzione e di ogni file.
// Uso: node strumenti/misura_fps.js [--vista 1920x1080] [--km 47] [--ora notte] [--meteo pioggia] [--q alta] [--sec 6] [--top 40] [--profilo]
//   [--js 'codice'] (eseguito prima della misura, per provare a spegnere una cosa: --js "document.documentElement.classList.add('classico')")
//   [--sonda] (tempo di ogni funzione del disegno di Street2D, di sim.update e game.update, in ms per fotogramma, comprese le chiamate dentro)
//   [--gpu] (scheda video emulata: le letture di pixel dalla tela costano come su un PC vero)
//   [--fisso] (densità doppia fissa: niente gradini automatici, per confrontare a parità di disegno)
// Senza --profilo misura solo gli fps (il profilo stesso rallenta un po'). Il browser di prova disegna senza scheda video:
// i numeri assoluti sono più bassi di un PC vero, contano i rapporti fra prima e dopo.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const A = process.argv.slice(2), opt = (k, d) => { const i = A.indexOf('--' + k); return i >= 0 ? A[i + 1] : d; };
const VISTA = opt('vista', '1920x1080').split('x').map(Number), KM = +opt('km', 47), ORA = opt('ora', 'notte'), METEO = opt('meteo', 'pioggia');
const PRIMA = opt('js', ''), Q = opt('q', 'alta'), SEC = +opt('sec', 6), TOP = +opt('top', 40), PROF = A.includes('--profilo');

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.css': 'text/css', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
});

(async () => {
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  // --gpu: tela «accelerata» come su un PC vero (scheda video emulata da SwiftShader): le letture di pixel bloccano come sul PC
  const GPU = A.includes('--gpu') ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--enable-accelerated-2d-canvas'] : [];
  const b = await chromium.launch({ args: ['--disable-gpu-vsync', '--disable-frame-rate-limit', ...GPU] });
  const page = await b.newPage({ viewport: { width: VISTA[0], height: VISTA[1] } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.text().startsWith('§')) console.log(m.text().slice(1)); });   // console.log('§...') dalla pagina: si stampa qui
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html`); await page.waitForTimeout(1200);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* niente */ } });
  await page.evaluate(() => { const b = document.getElementById('goBtn'); b && b.click(); }); await page.waitForTimeout(2500);
  await page.evaluate(() => { const b = document.querySelector('.pged .pg-go'); if (b) b.click(); }); await page.waitForTimeout(1500);
  await page.evaluate(() => { if (window.NightPrologo && NightPrologo.playing) NightPrologo.finish(); }); await page.waitForTimeout(800);
  for (let i = 0; i < 6; i++) { await page.evaluate(() => { const g = nightRun.game; if (g.prompt) try { g.answer(0); } catch (e) { /* niente */ } }); await page.waitForTimeout(150); }
  await page.evaluate(([km, ora, meteo, q]) => {
    const g = nightRun.game; if (g.s.vg) g.s.vg.firstDone = true;
    const set = (id, v) => { const s = document.getElementById(id); if (s && v) { s.value = v; s.dispatchEvent(new Event('change', { bubbles: true })); } };
    set('clockSel', ora); set('meteoSel', meteo); set('q3d', q);
    try { localStorage.removeItem('nr_slow'); } catch (e) { /* niente */ }
    const v = nightRun.view2d; if (v && v.slowReset) v.slowReset();
    g.s.dist = km * 1000; g.sim.v = 0;
    if (window.NightDev) { try { NightDev.polizia(true); } catch (e) { /* niente */ } }
  }, [KM, ORA, METEO, Q]);
  await page.waitForTimeout(1500);
  await page.evaluate(() => { nightRun.engineTap(); }); await page.waitForTimeout(1500);
  await page.evaluate(() => { nightRun.leva('D'); });
  if (A.includes('--fisso')) await page.evaluate(() => { NR_PREST.densita = 'doppia'; NR_PREST.preset = 'custom'; });
  if (PRIMA) await page.evaluate((c) => { try { (0, eval)(c); } catch (e) { console.log('js: ' + e.message); } }, PRIMA);
  await page.keyboard.down('KeyW'); await page.waitForTimeout(4000);

  if (A.includes('--sonda')) await page.evaluate(() => {
    const T = (window.__sonda = { t: {}, n: 0 }), wrap = (o, k, nome) => { const f = o[k]; if (typeof f !== 'function' || f.__s) return;
      const w = function () { const t0 = performance.now(); try { return f.apply(this, arguments); } finally { T.t[nome] = (T.t[nome] || 0) + performance.now() - t0; } }; w.__s = 1; o[k] = w; };
    const P = Street2D.prototype; for (const k of Object.getOwnPropertyNames(P)) if (k !== 'constructor') { const d = Object.getOwnPropertyDescriptor(P, k); if (d && typeof d.value === 'function') wrap(P, k, 'S.' + k); }
    wrap(nightRun.sim, 'update', 'sim.update'); wrap(nightRun.game, 'update', 'game.update');
    if (window.HudPro) for (const k of Object.keys(HudPro)) wrap(HudPro, k, 'HudPro.' + k);
    const f = () => { T.n++; requestAnimationFrame(f); }; requestAnimationFrame(f);
  });
  const cdpM = await page.context().newCDPSession(page); await cdpM.send('Performance.enable');
  const met = async () => Object.fromEntries((await cdpM.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
  const m0 = await met();
  // 1. fotogrammi: tempo fra un requestAnimationFrame e l'altro e tempo del disegno (tPrev di Street2D)
  const fr = await page.evaluate((sec) => new Promise((ok) => {
    const d = [], dr = []; let t0 = performance.now(), last = t0;
    const f = (t) => { d.push(t - last); last = t; const v = nightRun.view2d; if (v && v.tPrev !== undefined) dr.push(v.tPrev);
      if (t - t0 < sec * 1000) requestAnimationFrame(f); else ok({ d, dr, slow: v && v.slow, lv: v && v.pfLv, ss: v && v.SS, kmh: Math.round(nightRun.sim.kmh) }); };
    requestAnimationFrame(f);
  }), SEC);
  const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] || 0; };
  const p95 = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length * 0.95)] || 0; };
  const avg = fr.d.reduce((x, y) => x + y, 0) / fr.d.length;
  console.log(`vista ${VISTA.join('x')} · km ${KM} · ${ORA} · ${METEO} · qualità ${Q} · SS ${fr.ss} · gradino ${fr.lv} · ${fr.kmh} km/h`);
  console.log(`fps ${(1000 / avg).toFixed(1)} · fotogramma mediano ${med(fr.d).toFixed(1)} ms · 95° ${p95(fr.d).toFixed(1)} ms · disegno 2D mediano ${med(fr.dr).toFixed(1)} ms`);

  { const m1 = await met(), n = fr.d.length, d = (k) => ((m1[k] - m0[k]) * 1000 / n).toFixed(1);
    console.log(`per fotogramma (ms): script ${d('ScriptDuration')} · stili ${d('RecalcStyleDuration')} (${((m1.RecalcStyleCount - m0.RecalcStyleCount) / n).toFixed(1)} volte) · layout ${d('LayoutDuration')} (${((m1.LayoutCount - m0.LayoutCount) / n).toFixed(1)} volte) · compiti ${d('TaskDuration')}`); }
  if (A.includes('--sonda')) {
    const r = await page.evaluate(() => { const T = window.__sonda; return { n: T.n, t: Object.entries(T.t).map(([k, v]) => [k, v / T.n]).sort((a, b) => b[1] - a[1]).slice(0, 45) }; });
    console.log(`\nsonda (ms per fotogramma, comprese le chiamate dentro; ${r.n} fotogrammi):\n` + r.t.map(([k, v]) => `  ${v.toFixed(2).padStart(7)}  ${k}`).join('\n'));
  }
  // 2. profilo della CPU
  if (PROF) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
    await cdp.send('Profiler.start'); await page.waitForTimeout(SEC * 1000);
    const { profile } = await cdp.send('Profiler.stop');
    const byId = new Map(profile.nodes.map((n) => [n.id, n])), self = new Map();
    const dt = profile.timeDeltas; let tot = 0;
    profile.samples.forEach((id, i) => { const w = dt[i] || 0; tot += w; self.set(id, (self.get(id) || 0) + w); });
    const fn = new Map(), file = new Map();
    for (const [id, w] of self) {
      const cf = byId.get(id).callFrame, f = (cf.url || '').split('/').pop() || '(' + cf.functionName + ')';
      const k = `${cf.functionName || '(anonima)'} ${f}:${cf.lineNumber + 1}`;
      fn.set(k, (fn.get(k) || 0) + w); file.set(f, (file.get(f) || 0) + w);
    }
    const pr = (m, n) => [...m].sort((a, c) => c[1] - a[1]).slice(0, n).map(([k, w]) => `  ${(100 * w / tot).toFixed(1).padStart(5)} %  ${k}`).join('\n');
    console.log('\ntempo proprio per file:\n' + pr(file, 25));
    console.log('\ntempo proprio per funzione:\n' + pr(fn, TOP));
  }
  await page.keyboard.up('KeyW');
  if (errs.length) console.log('ERRORI:\n  ' + [...new Set(errs)].join('\n  '));
  await b.close(); server.close();
})().catch((e) => { console.error('misura fermata:', e.message); server.close(); process.exit(2); });
