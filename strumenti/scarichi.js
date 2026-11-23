// Controllo degli scarichi: per ogni auto disegna il retro (di serie e col kit, senza terminale e con i due terminali
// dello scarico) ingrandito, con sopra la fiamma nel punto esatto dove la mette il gioco. Serve a vedere se fiamme,
// scoppi e marmitta rovente escono dalla bocca dello scarico vero del disegno.
//
// Uso (dalla radice, serve Playwright con Chromium):
//   node strumenti/scarichi.js [--out cartella] [--solo id,id] [--zoom 4] [--nuda]   (--nuda: solo il segno verde, senza fiamma)
//   --rossa 0.6: al posto della fiamma la marmitta rovente a quel calore (0-1)
// Salva un foglio per auto (scarichi-<id>.png) e stampa per ognuna: punto della fiamma (x, y nel disegno) e
// dove sta il terminale disegnato dal gioco.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2), opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('--out', '/tmp/scarichi')), ZOOM = +opt('--zoom', 4), SOLO = opt('--solo', ''), NUDA = args.includes('--nuda'), ROSSA = +opt('--rossa', 0);

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.css': 'text/css' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
});

(async () => {
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  const b = await chromium.launch(), page = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await page.route('**cdn.jsdelivr.net**', (r) => r.abort());
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
  await page.waitForFunction(() => window.nightRun && nightRun.view2d, null, { timeout: 20000 });
  await page.waitForTimeout(1500);
  const ids = await page.evaluate((solo) => {
    const all = ['v40', 'supra', ...Object.keys(CARS).filter((id) => CARS[id].sprite && id !== 'v40' && id !== 'supra')];
    return solo ? all.filter((id) => solo.split(',').includes(id)) : all;
  }, SOLO);
  fs.mkdirSync(OUT, { recursive: true });
  for (const id of ids) {
    const res = await page.evaluate(async ({ id, Z, NUDA, ROSSA }) => {
      const v = nightRun.view2d, C = CARS[id] || {};
      const kits = id === 'v40' ? ['none', 'kit'] : C.spriteT ? ['none', 'tuning'] : ['none'];
      const rows = [], info = [];
      for (const kit of kits) for (const tip of [0, 1, 2]) {
        v.setCosmetics({ kit, dirt: 0 }); v.carKey = null; v.setCar(id, { exhaust: tip });
        if (v.genDef()) { const G = v.genImgs(); for (let i = 0; i < 100 && !G.ready; i++) await new Promise((r) => setTimeout(r, 50)); }
        v.setCosmetics({ kit, dirt: 0 }); v.carKey = null; v.setCar(id, { exhaust: tip });   // il gioco intanto può aver rimesso i suoi
        const spr = v.carSprite(1), GE = v.geo(), base = spr.hd || spr;
        // come in street2d.js (frame): disegno e fiamma partono tutti e due da top - k (img) → nel disegno la fiamma è a ex[1]
        const off = 0, fx = GE.ex[0], fy = GE.ex[1] + off;
        rows.push({ base, fx, fy, kit, tip, w: base.width, h: base.height }); info.push(`${kit}/${tip}: fiamma (${fx}, ${fy})`);
      }
      const CW = Math.min(110, rows[0].w), cw = CW * Z + 60 * Z, ch = Math.max(...rows.map((r) => r.h)) * Z;
      const c = document.createElement('canvas'); c.width = cw * 3 + 20; c.height = (ch + 24) * kits.length + 30;
      const g = c.getContext('2d'); g.fillStyle = '#20242c'; g.fillRect(0, 0, c.width, c.height); g.imageSmoothingEnabled = false;
      g.fillStyle = '#fff'; g.font = '16px monospace'; g.fillText(id, 8, 20);
      rows.forEach((r, i) => {
        const X = (i % 3) * cw + 10, Y = Math.floor(i / 3) * (ch + 24) + 30;
        g.fillStyle = '#9aa'; g.font = '12px monospace'; g.fillText(`${r.kit} · terminale ${r.tip} · (${r.fx},${r.fy})`, X, Y + 12);
        const ox = X + 60 * Z;
        g.drawImage(r.base, 0, 0, CW, r.h, ox, Y + 18, CW * Z, r.h * Z);
        // fiamma vera del gioco nel punto calcolato
        if (ROSSA) { v.st.t = 1.234; v.fxMarmitta(g, ox + r.fx * Z, Y + 18 + r.fy * Z, Z, ROSSA, Y + 18 + r.h * Z); } else if (!NUDA) v.st.t = 1.234, v.fxFlame(g, ox + r.fx * Z, Y + 18 + r.fy * Z, Z, 0.9, Y + 18 + r.h * Z, 'arancio');
        g.strokeStyle = '#0f0'; g.lineWidth = 1; g.strokeRect(ox + r.fx * Z - 0.5, Y + 18 + r.fy * Z - 0.5, Z, Z);
      });
      return { png: c.toDataURL('image/png'), info };
    }, { id, Z: ZOOM, NUDA, ROSSA });
    fs.writeFileSync(path.join(OUT, `scarichi-${id}.png`), Buffer.from(res.png.split(',')[1], 'base64'));
    console.log(id.padEnd(10), res.info.join(' | '));
  }
  await b.close(); server.close();
})().catch((e) => { console.error('si è fermato:', e.message); server.close(); process.exit(2); });
