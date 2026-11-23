const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..', '..'), OUT = path.resolve(process.argv[2] || 'fermi'); fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.css': 'text/css', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0])); fs.readFile(p, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); r.end(d); }); });
(async () => {
  await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); await page.route('**cdn.jsdelivr.net**', (r) => r.abort());
  await page.goto(`http://127.0.0.1:${srv.address().port}/index.html`); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(2500);
  const shot = (n) => page.screenshot({ path: path.join(OUT, n + '.png') });
  await shot('titolo');
  await page.evaluate(() => document.getElementById('goBtn').click()); await page.waitForTimeout(2000);
  await page.evaluate(() => { const L = NightPG.get(); NightPG.set(Object.assign({}, L, { capelli: 'coda', capCol: 3 })); });
  await page.waitForTimeout(600); await shot('editor0');
  // sceglie la coda dai pulsanti, se ci sono
  await page.evaluate(() => { const bs = [...document.querySelectorAll('.pged button')]; const c = bs.find((x) => /coda/i.test(x.textContent)); if (c) c.click(); }); await page.waitForTimeout(600); await shot('editor');
  await page.evaluate(() => { const b = document.querySelector('.pged .pg-go'); if (b) b.click(); }); await page.waitForTimeout(1500);
  for (const [n, at, nome] of [[1, 6, 'arrivo'], [2, 5, 'studio'], [3, 4, 'garage'], [4, 5, 'autostrada']]) {
    await page.evaluate(([n, at]) => NightPrologo.jump(n, at), [n, at]); await page.waitForTimeout(900); await shot(nome);
  }
  console.log('errori:', errs.join(' | ') || 'nessuno'); await b.close(); srv.close();
})();
