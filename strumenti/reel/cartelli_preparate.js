const { chromium } = require('playwright'); const path = require('path');
const FONTS = path.resolve(__dirname, '..', '..', 'vendor', 'fonts', 'fonts.css');
const OUT = path.resolve(process.argv[2] || 'cartelli'); require('fs').mkdirSync(OUT, { recursive: true });   // uso: node cartelli_preparate.js CARTELLA_OUT CARTELLA_RIPRESE require('fs').mkdirSync(OUT, { recursive: true });
const cap = (en, it) => ({ pos: 'bot', en, it });
// Carte del video «di serie / preparata» (strumenti/reel/preparate.js). I CV e il motore vengono dai dati delle riprese (car.hp, car.motore).
const J = (n) => { try { return JSON.parse(require('fs').readFileSync(path.join(process.argv[3] || '.', n + '.json'), 'utf8')).car; } catch (e) { return null; } };
const NOME = { e30: 'BMW M3 E30', p205: 'PEUGEOT 205 GTI', golf: 'VW GOLF GTI' };
const CARDS = { titolo: { pos: 'bot', en: 'Stock. Then everything.', it: 'Di serie. Poi tutto il resto.' } };
for (const id of ['e30', 'p205', 'golf']) {
  const a = J(id + '_a_serie'), p = J(id + '_b_preparata');
  CARDS[id + '_a'] = { pos: 'top', city: NOME[id], en: 'STOCK · ' + (a ? a.hp : '?') + ' HP', it: 'Di serie' };
  CARDS[id + '_b'] = { pos: 'top', city: NOME[id], en: 'ENGINE SWAP · ' + (p ? String(p.motore).replace(' aspirato', ' + turbo') : '') + ' · ' + (p ? p.hp : '?') + ' HP', it: 'Preparata: motore cambiato, kit, neon, cerchi' };
}
CARDS.fine = { pos: 'end', big: 'NIGHT <em>RUN</em>', sub: 'THE LAST HIGHWAY', en: 'Play free in your browser', it: 'Gioca gratis dal browser', link: 'LINK IN BIO' };

const css = `
:root{--amb:#ffb347;--pink:#ff5fa8;--mut:#cfc6b8}
html,body{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden;font-family:"Barlow Semi Condensed",system-ui,sans-serif;color:#fff}
.c{position:absolute;left:0;right:0;text-align:center;padding:0 60px;text-shadow:0 2px 14px rgba(0,0,0,.9),0 0 3px rgba(0,0,0,.9)}
.bot{bottom:300px}.top{top:110px}.mid{top:760px}.end{top:700px}
.en{font:600 54px/1.1 "Saira Stencil One",Impact,sans-serif;letter-spacing:.02em}
.it{font:italic 500 36px/1.25 "Barlow Semi Condensed";color:var(--mut);margin-top:10px}
.city{font:400 92px/1 "Saira Stencil One",Impact,sans-serif;letter-spacing:.06em;color:#fff;font-style:italic}
.big{font:400 150px/.95 "Saira Stencil One",Impact,sans-serif;font-style:italic}.big em{font-style:italic;color:transparent;-webkit-text-stroke:4px var(--amb)}
.sub{font:400 40px/1 "Saira Stencil One",Impact;letter-spacing:.32em;color:var(--amb);margin:16px 0 40px}
.pill{display:inline-block;margin-top:36px;font:700 34px "Share Tech Mono",monospace;letter-spacing:.14em;color:#140c04;background:linear-gradient(135deg,#ffd27a,#ff9a3a);padding:14px 26px;border-radius:12px;text-shadow:none}
.wash{position:absolute;left:0;right:0;pointer-events:none}
`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [k, c] of Object.entries(CARDS)) {
    const body = (c.big ? `<div class="big">${c.big}</div><div class="sub">${c.sub}</div>` : '') + (c.city ? `<div class="city">${c.city}</div>` : '') + `<div class="en">${c.en}</div><div class="it">${c.it}</div>` + (c.link ? `<div class="pill">${c.link}</div>` : '');
    const wash = c.pos === 'bot' ? '<div class="wash" style="bottom:200px;height:420px;background:linear-gradient(0deg,rgba(0,0,0,.55),transparent)"></div>' : c.pos === 'top' ? '<div class="wash" style="top:60px;height:340px;background:linear-gradient(180deg,rgba(0,0,0,.5),transparent)"></div>' : '';
    require('fs').writeFileSync(path.join(OUT, 'c.html'), `<html><head><link rel="stylesheet" href="file://${FONTS}"><style>${css}</style></head><body>${wash}<div class="c ${c.pos}">${body}</div></body></html>`);
    await p.goto('file://' + path.join(OUT, 'c.html'));
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, k + '.png'), omitBackground: true });
  }
  await b.close(); console.log('cartelli:', Object.keys(CARDS).length);
})();
