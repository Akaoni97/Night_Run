// ============================================================================
//  Night Run · Le illustrazioni dei componenti (22/11, dallo zip del proprietario «Night-Run-Sprite-Componenti»)
//  Una libreria di componenti COMUNE A TUTTE LE AUTO (la Supra è un'auto come le altre): un foglio con un disegno per
//  tipo e livello di pezzo (img/componenti/atlas.png 128×96 per disegno, atlas_hd.png 256×192) e sei cornici per le
//  rarità delle valigette (img/componenti/rarita/*.png). Provenienza in img/componenti/catalogo.json.
//  - compPos(cat, id, items): il disegno per un pezzo, con le stesse regole per ogni auto. Prima il nome (gomme da drag
//    → disegno delle slick, biturbo → disegno coi due turbo, nessun turbo → niente; un id uguale al nome di un disegno
//    lo prende), poi il livello nel catalogo di quell'auto: il primo pezzo (di serie) → il disegno di serie, gli altri
//    distribuiti dal più semplice al più spinto sui disegni rimasti del reparto. Reparti senza disegno: null.
//  - compHTML(cat, id): un riquadro HTML con l'illustrazione (scheda del pezzo nell'officina, officina.js).
//  - compImg(cb) carica il foglio HD e la funzione compDraw(g, pos, x, y, w, h) lo disegna su una tela (valigette.js).
//  Funzioni pure provate in test/componenti.test.js.
// ============================================================================
const COMP = {
  atlas: 'img/componenti/atlas.png', atlasHd: 'img/componenti/atlas_hd.png', cell: [128, 96], cellHd: [256, 192], cols: 6, rows: 14,
  rarita: ['comune', 'noncomune', 'raro', 'epico', 'mitico', 'leggendario'].map((r) => 'img/componenti/rarita/' + r + '.png'),
};
// i disegni del foglio per reparto, dal livello di serie al più spinto: [nome del disegno, colonna, riga]
const COMP_POS = {
  turbo: [['ct12b', 0, 0], ['gtx3582', 1, 0], ['pte6466', 2, 0], ['efr9180', 3, 0], ['t51r', 4, 0]],
  exhaust: [['oem', 0, 1], ['hks', 1, 1], ['apexi', 2, 1], ['tomei', 3, 1], ['blitz', 4, 1], ['straight', 5, 1]],
  cat: [['oem', 0, 4], ['sport', 1, 4], ['tubolare', 2, 4], ['decat', 3, 4]],
  intake: [['oem', 0, 5], ['pf', 1, 5]],
  bov: [['oem', 0, 6], ['ssqv', 1, 6], ['raceport', 2, 6], ['greddy', 3, 6]],
  wastegate: [['int', 0, 7], ['tial', 1, 7]],
  suspension: [['oem', 0, 2], ['springs', 1, 2], ['dampers', 2, 2], ['tein', 3, 2], ['race', 4, 2], ['pro', 5, 2]],
  ecu: [['oem', 0, 3], ['haltech', 1, 3], ['link', 2, 3]],
  cams: [['oem', 0, 8], ['hks264', 1, 8], ['hks272', 2, 8]],
  intercooler: [['oem', 0, 9], ['hks', 1, 9]],
  clutch: [['oem', 0, 10], ['osgiken', 1, 10]],
  gearbox: [['oem', 0, 11], ['close', 1, 11]],
  tires: [['oem', 0, 12], ['r888r', 1, 12], ['etstreet', 2, 12]],
  final: [['oem', 0, 13], ['f3769', 1, 13], ['osg4083', 2, 13]],
};
// regole per nome, uguali per tutte le auto: il tipo di pezzo dice il disegno (null = niente disegno)
const COMP_NOMI = {
  turbo: (id) => (/^(none|sc|compressore)/.test(id) ? null : /twin|biturbo|ct12/.test(id) ? 'ct12b' : undefined),
  bov: (id) => (id === 'none' ? null : undefined),
  tires: (id) => (/drag|slick(?!s)|etstreet/.test(id) && !/semi/.test(id) ? 'etstreet' : /sport|semi|r888/.test(id) ? 'r888r' : undefined),
  suspension: (id) => (/coil/.test(id) ? 'tein' : undefined),
  gearbox: (id) => (id !== 'oem' && id !== 'stock' ? 'close' : undefined),
  clutch: (id) => (id !== 'oem' && id !== 'stock' ? 'osgiken' : undefined),
  final: (id) => (/lsd|quaife|auto/.test(id) ? 'osg4083' : undefined),
  intercooler: (id) => (/fmic|front|grande/.test(id) ? 'hks' : undefined),
  cat: (id) => (/decat|pista/.test(id) ? 'decat' : undefined),
  exhaust: (id) => (/race|gara|straight|dritto/.test(id) ? 'straight' : undefined),
};
// i disegni di un reparto che fanno da «scala» per i pezzi senza regola di nome (il disegno coi due turbo resta ai
// biturbo, lo scarico dritto a quelli da gara)
const COMP_SCALA = { turbo: (t) => t.filter((r) => r[0] !== 'ct12b'), exhaust: (t) => t.slice(1).filter((r) => r[0] !== 'straight') };

// il disegno { x, y } (in celle) per il pezzo id del reparto cat; items = i pezzi di quel reparto sull'auto
function compPos(cat, id, items) {
  const tab = COMP_POS[cat]; if (!tab) return null;
  const regola = COMP_NOMI[cat] || (() => undefined);
  const nome = (x) => { const r = regola(x); if (r !== undefined) return r; return tab.some((t) => t[0] === x) ? x : undefined; };
  const cella = (n) => { const e = tab.find((t) => t[0] === n); return e ? { x: e[1], y: e[2] } : null; };
  const n = nome(id);
  if (n === null) return null;
  if (n !== undefined) return cella(n);
  const lista = (items || []).map((it) => (typeof it === 'string' ? it : it.id));
  if (!lista.includes(id)) return null;
  if (lista[0] === id && cat !== 'turbo') return { x: tab[0][1], y: tab[0][2] };     // il primo del catalogo è quello di serie
  const resto = lista.filter((x, i) => nome(x) === undefined && !(i === 0 && cat !== 'turbo'));
  const scala = COMP_SCALA[cat] ? COMP_SCALA[cat](tab) : tab.slice(1);
  if (!scala.length) return null;
  const i = resto.indexOf(id), lv = resto.length <= 1 ? 0 : Math.round(i / (resto.length - 1) * (scala.length - 1));
  const e = scala[Math.max(0, Math.min(scala.length - 1, lv))];
  return { x: e[1], y: e[2] };
}
// i pezzi del reparto sull'auto in uso (TUNING di tuning.js/cars.js)
function compItems(cat) { return typeof TUNING !== 'undefined' && TUNING[cat] ? TUNING[cat].items : null; }
// riquadro HTML con l'illustrazione (sfondo dal foglio HD, scalato con le percentuali)
function compHTML(cat, id, cls) {
  const p = compPos(cat, id, compItems(cat)); if (!p) return '';
  const bx = p.x / (COMP.cols - 1) * 100, by = p.y / (COMP.rows - 1) * 100;
  return `<div class="${cls || 'comp-img'}" role="img" aria-label="" style="background-image:url(${COMP.atlasHd});background-size:${COMP.cols * 100}% ${COMP.rows * 100}%;background-position:${bx}% ${by}%"></div>`;
}

(function compUI() {
  if (typeof document === 'undefined') return;
  const css = document.createElement('style');
  css.textContent = `.comp-img{width:100%;max-width:240px;aspect-ratio:4/3;margin:0 auto 6px;background-repeat:no-repeat;filter:drop-shadow(0 6px 10px rgba(0,0,0,.45))}
.comp-mini{flex:0 0 auto;width:52px;height:39px;margin-right:8px;background-repeat:no-repeat;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))}.of-head:has(.comp-mini){justify-content:flex-start}.of-head:has(.comp-mini) .of-i{margin-left:auto}`;
  document.head.appendChild(css);
  let im = null, fr = null;
  window.compImg = function (cb) {
    if (im && im.complete && im.naturalWidth) return cb && cb(im), im;
    if (!im) { im = new Image(); im.src = COMP.atlasHd; }
    if (cb) im.addEventListener('load', () => cb(im), { once: true });
    return null;
  };
  window.compFrame = function (r, cb) {
    fr = fr || [];
    if (fr[r] && fr[r].complete && fr[r].naturalWidth) return cb && cb(fr[r]), fr[r];
    if (!fr[r]) { fr[r] = new Image(); fr[r].src = COMP.rarita[r]; }
    if (cb) fr[r].addEventListener('load', () => cb(fr[r]), { once: true });
    return null;
  };
  // disegna la casella p del foglio HD in (x, y, w, h) su una tela, a pixel morbidi (sono illustrazioni)
  window.compDraw = function (g, p, x, y, w, h) {
    const a = window.compImg(); if (!a || !p) return false;
    const [cw, ch] = COMP.cellHd, sm = g.imageSmoothingEnabled; g.imageSmoothingEnabled = true;
    g.drawImage(a, p.x * cw, p.y * ch, cw, ch, x, y, w, h); g.imageSmoothingEnabled = sm; return true;
  };
  window.compImg();                                   // il foglio arriva in sottofondo, così è pronto per officina e valigette
})();

if (typeof window !== 'undefined') Object.assign(window, { COMP, COMP_POS, COMP_NOMI, compPos, compItems, compHTML });
