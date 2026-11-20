// Prova di Night Run nel browser, a copione. Serve agli assistenti (Claude, Kimi...) per provare una modifica
// come la proverebbe un giocatore, senza riscrivere ogni volta l'avvio, il prologo e il viaggio fino a una tappa.
//
// Uso (dalla radice del repository, serve Playwright con Chromium):
//   node strumenti/prova.js [--mob] [--tutorial] [--out cartella] passo passo ...
//   (senza --tutorial il primo lavoro è dato per fatto, altrimenti il gioco riporta sempre al Bar Sport)
// Passi:
//   tappa:dealer        vai 9 m prima della prossima tappa di quel tipo (bar, fuel, grill, niko, luca, style,
//                       motel, dealer, junk...), da fermo: si vede la facciata
//   km:27.4             mettiti a quel km, da fermo
//   entra / esci        entra nel locale vicino (aspetta la scena dell'interno) / esci
//   soldi:50000         soldi
//   tel / tel:usa       apri o chiudi il telefono / apri un'app del telefono (id: usa, trg, rta, ...)
//   tasto:KeyW / tieni:KeyW:3000   premi un tasto / tienilo premuto per 3 s
//   clic:#selettore     clic su un elemento della pagina (anche "testo=Compra" per il testo di un pulsante)
//   aspetta:1500        aspetta in millisecondi
//   js:espressione      valuta del codice nella pagina (g = game, sim, v2 = view2d) e stampa il risultato
//   foto:nome           salva nome.png nella cartella --out (1280×720, o 390×844 con --mob)
//   stato               stampa lo stato del gioco in breve (km, soldi, auto, locale, bisogni...)
// Alla fine stampa lo stato e gli errori della console. Esce con codice 1 se ci sono errori.
// Le domande iniziali scelgono il cambio automatico: la leva parte in P. Per guidare: js:nightRun.engineTap() e js:nightRun.leva('D').
//
// Esempio: node strumenti/prova.js --out /tmp/foto soldi:40000 tappa:junk foto:fuori entra foto:dentro stato
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const mob = args.includes('--mob');
const oi = args.indexOf('--out'), OUT = oi >= 0 ? path.resolve(args[oi + 1]) : process.cwd();
const steps = args.filter((a, i) => !a.startsWith('--') && !(oi >= 0 && i === oi + 1));

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
});

// lo stato del gioco in breve, da leggere al posto dei pixel
const STATO = () => {
  const n = window.nightRun, g = n.game, s = g.s, v = s.vg || {}, N = v.needs || {};
  const near = g.nearPlace ? g.nearPlace() : null, r = (x, k = 1) => Math.round(x * k) / k;
  return {
    km: r(s.dist / 1000, 100), kmh: r(n.sim.kmh), soldi: Math.round(s.money), auto: g.car, garage: v.garage,
    benzina: r(n.sim.fuel, 100), danni: r(n.sim.damage || 0, 100), gomme: r(n.sim.tireWear || s.tireWear || 0, 100),
    bisogni: { fame: r(N.food, 100), sete: r(N.water, 100), sonno: r(N.sleep, 100), igiene: r(N.wash, 100) },
    dentro: g.inside ? g.inside.id : null, vicino: near ? (near.id || (near.loc && near.loc.id) || true) : null,
    domanda: !!g.prompt, interno: window.NightInterni ? NightInterni.current || null : null,
    telefono: window.telefono ? (window.telefono.isOpen ? window.telefono.view || 'casa' : false) : undefined,
  };
};

(async () => {
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const URL = `http://127.0.0.1:${server.address().port}/index.html`;
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: mob ? { width: 390, height: 844 } : { width: 1280, height: 720 }, hasTouch: mob });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|ERR_ABORTED/.test(m.text())) errs.push(m.text()); });
  page.on('response', (r) => { if (r.status() === 404) errs.push('404 ' + r.url().replace(/^https?:\/\/[^/]+/, '')); });
  await page.route('**cdn.jsdelivr.net**', (r) => r.abort());          // three.js serve solo alla vista 3D
  await page.goto(URL); await page.waitForTimeout(1200);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* niente */ } });
  // avvio: pulsante di partenza, editor del personaggio confermato, prologo saltato, domande iniziali con la prima risposta
  await page.evaluate(() => { const b = document.getElementById('goBtn'); b && b.click(); }); await page.waitForTimeout(2500);
  await page.evaluate(() => { const b = document.querySelector('.pged .pg-go'); if (b) b.click(); }); await page.waitForTimeout(1500);   // l'editor del personaggio: va bene così
  await page.evaluate(() => { if (window.NightPrologo && NightPrologo.playing) NightPrologo.finish(); }); await page.waitForTimeout(800);
  for (let i = 0; i < 6; i++) { await page.evaluate(() => { const g = nightRun.game; if (g.prompt) try { g.answer(0); } catch (e) { /* niente */ } }); await page.waitForTimeout(150); }
  // il primo lavoro (tutorial) ti riporta sempre al Bar Sport: lo diamo per fatto, così tappa: e km: saltano davvero.
  // Con --tutorial resta da fare (per provare proprio il tutorial).
  if (!args.includes('--tutorial')) await page.evaluate(() => { const v = nightRun.game.s.vg; if (v) v.firstDone = true; });

  const log = (...a) => console.log(...a);
  for (const st of steps) {
    const i = st.indexOf(':'), k = i < 0 ? st : st.slice(0, i), a = i < 0 ? '' : st.slice(i + 1);
    if (k === 'tappa') {
      const x = await page.evaluate((id) => { const g = nightRun.game; let n = Math.max(0, Math.ceil((g.s.dist + 20 - VG_STOP0) / VG_STEP));
        for (let j = 0; j < 400 && VG.stop(n + j).id !== id; j++) if (j === 399) return null; while (VG.stop(n).id !== id) n++;
        const x = VG.stopX(n); g.s.dist = x - 9; g.sim.v = 0; return x; }, a);
      log(x == null ? `tappa ${a}: non trovata` : `tappa ${a}: km ${(x / 1000).toFixed(1)}`); await page.waitForTimeout(1500);
    } else if (k === 'km') { await page.evaluate((m) => { const g = nightRun.game; g.s.dist = m; g.sim.v = 0; }, parseFloat(a) * 1000); await page.waitForTimeout(1500);
    } else if (k === 'entra') {
      // come il giocatore fermo davanti alla porta: 2 m prima della tappa più vicina, senza accosto automatico
      await page.evaluate(() => { const g = nightRun.game, n = Math.round((g.s.dist - VG_STOP0) / VG_STEP); g.s.dist = VG.stopX(n) - 2; g.sim.v = 0; });
      await page.waitForTimeout(300);
      await page.evaluate(() => { const g = nightRun.game; if (g.inside) return true; const q = g.nearPlace(); if (q && q.ok !== false) g.enterPlace(q); return true; });
      await page.waitForFunction(() => { const I = nightRun.game.inside; return !I || I.phase === 'shop'; }, null, { timeout: 15000 }).catch(() => {});   // manovra, camminata e buio (entrata2d.js)
      await page.waitForTimeout(900);
      const dentro = await page.evaluate(() => { const g = nightRun.game; return g.inside ? g.inside.id : null; });
      log(dentro ? 'entrato: ' + dentro : 'entra: nessun locale vicino');
    } else if (k === 'esci') { await page.evaluate(() => nightRun.game.exitPlace()); await page.waitForTimeout(2000);
    } else if (k === 'soldi') { await page.evaluate((m) => { nightRun.game.s.money = m; }, +a);
    } else if (k === 'tel') {
      if (!a) await page.keyboard.press('Digit0');
      else await page.evaluate((id) => { window.telefono.show(id); window.telefono.render(); }, a);
      await page.waitForTimeout(900);
    } else if (k === 'tasto') { await page.keyboard.press(a); await page.waitForTimeout(200);
    } else if (k === 'tieni') { const [key, ms] = a.split(':'); await page.keyboard.down(key); await page.waitForTimeout(+ms || 1000); await page.keyboard.up(key);
    } else if (k === 'clic') {
      const ok = a.startsWith('testo=')
        ? await page.evaluate((t) => { const b = [...document.querySelectorAll('button,.kbtn,[role=button],[data-k],[data-id]')].find((x) => x.offsetParent && x.textContent.toLowerCase().includes(t.toLowerCase())); if (b) b.click(); return !!b; }, a.slice(6))
        : await page.evaluate((s) => { const b = document.querySelector(s); if (b) b.click(); return !!b; }, a);
      log(ok ? `clic ${a}` : `clic ${a}: non trovato`); await page.waitForTimeout(400);
    } else if (k === 'aspetta') { await page.waitForTimeout(+a || 1000);
    } else if (k === 'js') {
      const r = await page.evaluate((code) => { const g = nightRun.game, sim = nightRun.sim, v2 = nightRun.view2d; try { return JSON.stringify(eval(code)); } catch (e) { return 'ERRORE ' + e.message; } }, a);
      log('js', a, '→', r);
    } else if (k === 'foto') { fs.mkdirSync(OUT, { recursive: true }); const f = path.join(OUT, (mob ? 'mob-' : 'desk-') + a + '.png'); await page.screenshot({ path: f }); log('foto', f);
    } else if (k === 'stato') { log('stato', JSON.stringify(await page.evaluate(STATO)));
    } else log('passo sconosciuto:', st);
  }
  log('stato finale', JSON.stringify(await page.evaluate(STATO)));
  const E = [...new Set(errs)];
  log(E.length ? 'ERRORI:\n  ' + E.join('\n  ') : 'nessun errore in console');
  await b.close(); server.close();
  process.exit(E.length ? 1 : 0);
})().catch((e) => { console.error('la prova si è fermata:', e.message); server.close(); process.exit(2); });
