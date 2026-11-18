// Riprese per il video "coming soon" di Night Run: registra il gioco vero, senza interfaccia, a 30 fotogrammi al
// secondo con il tempo finto del browser (Playwright clock): il gioco avanza di 1/30 s per fotogramma anche su un
// computer lento, quindi il video è fluido. Scrive un video muto senza scritte (master); testi e musica si
// aggiungono dopo con ffmpeg (strumenti/teaser_monta.sh), così si cambiano senza rifare le riprese.
//
// Uso (dalla radice del repository, serve Playwright con Chromium e ffmpeg):
//   node strumenti/teaser.js cartella_uscita
// Le inquadrature sono in SHOTS qui sotto: paesaggio, ora del giorno, velocità, pioggia, durata.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(process.argv[2] || '.');
const FPS = 30, W = 1920, H = 1080;

// day: 0 notte, 1 giorno; sunset: 0..1; v: m/s; t0: tempo della scena (sceglie quando cadono fuochi, uccelli, ...)
const SHOTS = [                                                  // km: dove si è sul percorso del viaggio (VG_ROUTE in viaggio.js)
  { name: '01_tramonto', km: 110, day: 0.55, sunset: 0.75, v: 22, sec: 4.0, t0: 10 },          // Bassa Reggiana
  { name: '02_citta', km: 4, day: 0, sunset: 0, v: 9, sec: 4.0, t0: 50 },                      // Tokyo
  { name: '03_pioggia', km: 90, day: 0, sunset: 0, v: 24, rain: true, sec: 3.0, t0: 70 },      // Parigi
  { name: '04_wangan', km: 27, day: 0, sunset: 0, v: 36, sec: 3.0, t0: 90 },                   // Wangan
  { name: '05_fuochi', km: 320, day: 0, sunset: 0, v: 11, sec: 4.5, t0: 201 },                 // Positano
  { name: '06_lucciole', km: 400, day: 0, sunset: 0, v: 7, sec: 6.5, t0: 300 },                // San Gimignano
];

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
});

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const URL = `http://127.0.0.1:${server.address().port}/index.html`;
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.route('**cdn.jsdelivr.net**', (r) => r.abort());
  await page.clock.install();
  await page.goto(URL);
  const run = (ms) => page.clock.runFor(ms);
  await run(1500);
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) { /* niente */ } const b = document.getElementById('goBtn'); b && b.click(); });
  await run(2500);
  await page.evaluate(() => { if (window.NightPrologo && NightPrologo.playing) NightPrologo.finish(); });
  await run(800);
  for (let i = 0; i < 6; i++) { await page.evaluate(() => { const g = nightRun.game; if (g.prompt) try { g.answer(0); } catch (e) { /* niente */ } }); await run(150); }
  // solo la strada: la tela del gioco a tutto schermo, niente radar, cartelli del viaggio e insegne dei quartieri
  await page.evaluate(([w, h]) => {
    const v2 = nightRun.view2d, c = v2.canvas;
    nightRun.game.s.vg.firstDone = true;                                 // tutorial del primo pacco già fatto: si può andare ovunque
    document.body.appendChild(c); c.hidden = false;
    c.style.cssText = `position:fixed;left:0;top:0;width:${w}px;height:${h}px;z-index:99999`;
    v2.resize(); v2.laneRadar = false; v2.drawTripFx = null; v2.districtBanner = null; v2.quality = 'alta'; v2.slow = false;
    v2.setDaylight = function () {}; v2.setRain = function () {}; v2.comic = function () {};
    window.__shot = null;
    // ogni fotogramma: velocità costante, niente auto nella tua corsia davanti (niente incidenti), niente polizia
    setInterval(() => {
      const s = window.__shot; if (!s) return; const g = nightRun.game;
      nightRun.sim.v = s.v; g.siren = false; v2.rainOn = !!s.rain; v2.comics = []; v2.day = s.day; v2.sunset = s.sunset; v2.slow = false; v2.tAvg = 0;
      // solo traffico e locali: niente cartelloni e oggetti della storia (la storia è del cognato, nel video non si svela)
      if (g.ents) g.ents = g.ents.filter((e) => e.kind === 'place' || e.kind === 'station' || (e.kind === 'traffic' && !(e.lane === g.lane && e.x > g.s.dist - 30 && e.x < g.s.dist + 160)));
      if (g.prompt) try { g.answer(0); } catch (e) { /* niente */ }
    }, 5);
  }, [W, H]);

  for (const sh of SHOTS) {
    await page.evaluate((s) => {
      const g = nightRun.game, v2 = nightRun.view2d;
      g.s.dist = s.km * 1000; v2.rainOn = !!s.rain; v2.st.t = s.t0;
      v2.day = s.day; v2.sunset = s.sunset; v2._deb = []; window.__shot = s;
    }, sh);
    await run(2500);                                                       // la scena si assesta (inquadratura, velocità)
    const file = path.join(OUT, sh.name + '.mp4');
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', file], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = process.env.PROVA ? 1 : Math.round(sh.sec * FPS);   // PROVA=1: un fotogramma per inquadratura
    for (let i = 0; i < n; i++) {
      await run(1000 / FPS);
      const png = await page.evaluate(() => nightRun.view2d.canvas.toDataURL('image/png'));
      if (!ff.stdin.write(Buffer.from(png.slice(22), 'base64'))) await new Promise((ok) => ff.stdin.once('drain', ok));
    }
    ff.stdin.end(); await new Promise((ok) => ff.on('close', ok));
    console.log('ripresa', sh.name, n, 'fotogrammi');
  }
  console.log(errs.length ? 'errori: ' + errs.join(' | ') : 'nessun errore in console');
  await b.close(); server.close();
})().catch((e) => { console.error(e); process.exit(1); });
