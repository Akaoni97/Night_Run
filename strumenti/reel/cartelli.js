const { chromium } = require('playwright'); const path = require('path');
const FONTS = path.resolve(__dirname, '..', '..', 'vendor', 'fonts', 'fonts.css');
const OUT = path.resolve(process.argv[2] || 'cartelli'); require('fs').mkdirSync(OUT, { recursive: true });
const cap = (en, it) => ({ pos: 'bot', en, it });
const CARDS = {
  titolo: cap('Free to play in your browser', 'Gratis, nel browser'),
  editor: cap('Create your driver', 'Crea il tuo pilota (anche col codino)'),
  arrivo: cap('A rainy night. An inheritance.', "Una notte di pioggia. Un'eredità."),
  garage: cap('Six cars. Pick one.', 'Sei auto. Scegline una.'),
  tokyo: { pos: 'top', city: 'TOKYO', en: '12 capital cities', it: '12 capitali da attraversare' },
  roma: { pos: 'top', city: 'ROMA', en: 'Ochre walls, green shutters', it: 'Muri ocra e persiane verdi' },
  parigi: { pos: 'top', city: 'PARIGI', en: 'Eiffel Tower in the rain', it: 'La Torre Eiffel sotto la pioggia' },
  londra: { pos: 'top', city: 'LONDRA', en: 'Brick, fog and pubs', it: 'Mattoni, nebbia e pub' },
  berlino: { pos: 'top', city: 'BERLINO', en: 'Cold light, TV tower', it: 'Luce fredda e Fernsehturm' },
  atene: { pos: 'top', city: 'ATENE', en: 'The Acropolis glows over the town', it: "L'Acropoli illuminata sulla citta" },
  washington: { pos: 'top', city: 'WASHINGTON', en: 'The Capitol on the horizon', it: "Il Campidoglio all'orizzonte" },
  semaforo: cap('Real physics, every car different', 'Fisica vera: ogni auto è diversa'),
  e36: cap('Tune every engine', 'Elabora ogni motore'),
  officina: cap("Luca's tuning shop", "L'officina di Luca: pezzi veri, suoni veri"),
  mare: cap('Every night is different', 'Ogni notte è diversa'),
  telefono: cap('Something is wrong…', 'Qualcosa non torna…'),
  supra: cap('Turbo. Pop & bang. Real engine sound.', 'Turbo, scoppi e suono del motore'),
  fine: { pos: 'end', big: 'NIGHT <em>RUN</em>', sub: 'THE LAST HIGHWAY', en: 'Play free in your browser', it: 'Gioca gratis dal browser' },
};
const css = `
:root{--amb:#ffb347;--pink:#ff5fa8;--mut:#cfc6b8}
html,body{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden;font-family:"Barlow Semi Condensed",system-ui,sans-serif;color:#fff}
.c{position:absolute;left:0;right:0;text-align:center;padding:0 60px;text-shadow:0 2px 14px rgba(0,0,0,.9),0 0 3px rgba(0,0,0,.9)}
.bot{bottom:300px}.top{top:280px}.mid{top:760px}.end{top:700px}
.en{font:600 54px/1.1 "Saira Stencil One",Impact,sans-serif;letter-spacing:.02em}
.it{font:italic 500 36px/1.25 "Barlow Semi Condensed";color:var(--mut);margin-top:10px}
.city{font:400 124px/1 "Saira Stencil One",Impact,sans-serif;letter-spacing:.06em;color:#fff;font-style:italic}
.big{font:400 150px/.95 "Saira Stencil One",Impact,sans-serif;font-style:italic}.big em{font-style:italic;color:transparent;-webkit-text-stroke:4px var(--amb)}
.sub{font:400 40px/1 "Saira Stencil One",Impact;letter-spacing:.32em;color:var(--amb);margin:16px 0 40px}
.pill{display:inline-block;margin-top:36px;font:700 34px "Share Tech Mono",monospace;letter-spacing:.14em;color:#140c04;background:linear-gradient(135deg,#ffd27a,#ff9a3a);padding:14px 26px;border-radius:12px;text-shadow:none}
.wash{position:absolute;left:0;right:0;pointer-events:none}
`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const [k, c] of Object.entries(CARDS)) {
    const body = (c.big ? `<div class="big">${c.big}</div><div class="sub">${c.sub}</div>` : '') + (c.city ? `<div class="city">${c.city}</div>` : '') + `<div class="en">${c.en}</div><div class="it">${c.it}</div>` + (c.link ? `<div class="pill">${c.link}</div>` : '');
    const wash = c.pos === 'bot' ? '<div class="wash" style="bottom:200px;height:420px;background:linear-gradient(0deg,rgba(0,0,0,.55),transparent)"></div>' : c.pos === 'top' ? '<div class="wash" style="top:230px;height:320px;background:linear-gradient(180deg,rgba(0,0,0,.5),transparent)"></div>' : '';
    require('fs').writeFileSync(path.join(OUT, 'c.html'), `<html><head><link rel="stylesheet" href="file://${FONTS}"><style>${css}</style></head><body>${wash}<div class="c ${c.pos}">${body}</div></body></html>`);
    await p.goto('file://' + path.join(OUT, 'c.html'));
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: path.join(OUT, k + '.png'), omitBackground: true });
  }
  await b.close(); console.log('cartelli:', Object.keys(CARDS).length);
})();
