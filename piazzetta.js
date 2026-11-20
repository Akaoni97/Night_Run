// ============================================================================
//  Night Run · La piazzetta (dopo sfascio.js, prima dei file che avvolgono `drawTripPlace` per ultimi)
//  Ogni 2 o 3 tappe, la tappa è una piazzetta: due negozi affiancati, uno a sinistra e uno a destra della stessa tappa. Ti fermi, premi U e
//  scegli dove entrare. La tappa resta quella di sempre (stesso `id`, bacheca, lavori e consegne non cambiano): le si aggiunge il secondo
//  negozio (`VG.stop(n).twin`). Le coppie sono a caso, tutte con la stessa probabilità, **tranne Luca (shop) e Neon Kustom (style): non
//  stanno mai nella stessa piazzetta** (tresca tra Luca e Jeshka, `jeshka.js`). Parte pura: `vgPiazzaSet`, `vgTwin`; disegno e scelta qui sotto.
// ============================================================================
// prima piazzetta alla tappa 3 (le prime due servono al tutorial), poi ogni 2 o 3. I due negozi stanno affiancati con `spazio` pixel tra le facciate
// (mezza larghezza di ognuna in `hw`), uno a sinistra e uno a destra del centro della tappa; la telecamera (street2d.js) punta al centro del
// gruppo, così tutti e due entrano nello schermo. Il benzinaio, il più largo, sta sempre a sinistra.
const VG_PIAZZA = { primo: 3, gap: [2, 3], spazio: -6, hw: { bar: 104, fuel: 150, grill: 130, motel: 130, niko: 130, shop: 130, style: 130, dealer: 130, junk: 130 } };
const VG_PIAZZA_VIETATE = [['shop', 'style']];                  // coppie che non stanno mai insieme

// le tappe che sono una piazzetta, in ordine (si calcolano una volta sola, sempre le stesse)
const _vgPz = [VG_PIAZZA.primo];
function vgPiazzaSet(n) {
  while (_vgPz[_vgPz.length - 1] < n) { const k = _vgPz.length, g = VG_PIAZZA.gap; _vgPz.push(_vgPz[k - 1] + g[0] + Math.floor(VG.hash(k * 3.7 + 1) * (g[1] - g[0] + 1))); }
  return _vgPz.includes(n);
}
// il secondo negozio della tappa n (null se non è una piazzetta): a caso tra gli altri, mai un'accoppiata vietata
function vgTwin(n, id) {
  if (!vgPiazzaSet(n)) return null;
  const pool = Object.keys(VG_PLACE).filter((k) => k !== id && !VG_PIAZZA_VIETATE.some(([a, b]) => (a === id && b === k) || (b === id && a === k)));
  return pool[Math.floor(VG.hash(n * 5.3 + 9) * pool.length) % pool.length] || null;
}
// la tappa con i suoi due negozi (`twin`) e da che lato sta ognuno (`dx` in metri dal centro: uno a sinistra, uno a destra)
(function () {
  const stop = VG.stop;
  VG.stop = function (n) {
    const s = stop.call(VG, n), T = vgTwin(n, s.id);
    if (!T) return s;
    const P = VG_PLACE[T], hw = (k) => VG_PIAZZA.hw[k] || 130;
    let L = s.id, R = T; if (VG.hash(n * 2.1 + 4) < 0.5) [L, R] = [R, L];
    if (R === 'fuel') [L, R] = [R, L];
    const D = (hw(L) + hw(R) + VG_PIAZZA.spazio) / 30, xR = D / 2, xL = -D / 2;
    s.dx = s.id === L ? xL : xR;
    s.twin = { id: T, name: P.name(n), what: P.what, col: P.col, dx: s.id === L ? xR : xL };
    return s;
  };
})();
// i due luoghi in cui si può entrare: stessi dati della tappa, con id, nome e posizione del negozio scelto
function vgPiazzaSub(p, i) {
  const t = i === 0 ? { id: p.id, name: p.name, what: p.what, col: p.col, dx: p.dx } : p.twin;
  const s = Object.assign({}, p, { id: t.id, name: t.name, what: t.what, col: t.col, x: p.x + t.dx, twin: null, dx: 0 });
  s.rel = s.x - (typeof game !== 'undefined' && game && game.s ? game.s.dist : p.x - p.rel);
  return s;
}

if (typeof Street2D !== 'undefined') (function () {
  const S = Street2D.prototype, prev = S.drawTripPlace;
  S.drawTripPlace = function (g, e, x, st, near, open) {
    if (!e.twin) return prev ? prev.call(this, g, e, x, st, near, open) : false;
    for (const i of [0, 1]) {
      const t = i === 0 ? { id: e.id, name: e.name, what: e.what, col: e.col, dx: e.dx } : e.twin, X = x + t.dx * 30;
      const sub = Object.assign({}, e, { id: t.id, name: t.name, what: t.what, col: t.col, x: e.x + t.dx, twin: null, dx: 0 });
      if (prev) prev.call(this, g, sub, X, st, near, open);
      if (this.entStall) this.entStall(g, sub, X);                  // le strisce del posto auto di ognuno (la tappa intera non ne ha: entrata2d.js)
    }
    return true;
  };
})();

// scelta del negozio: una domanda con i due nomi (U sulla piazzetta)
const NightPiazza = {
  sub: vgPiazzaSub,
  choose(game, p) {
    const a = vgPiazzaSub(p, 0), b = vgPiazzaSub(p, 1);
    const go = (q) => () => { game.enterPlace(Object.assign(q, { ok: p.ok })); };
    return game.ask({ kind: 'story', title: 'Piazzetta', time: 900, text: 'Due negozi uno accanto all\'altro. Dove vuoi entrare?',
      options: [{ label: a.name, act: go(a) }, { label: b.name, act: go(b) }, { label: 'Resta in strada', act() {} }] });
  },
};
if (typeof window !== 'undefined') Object.assign(window, { VG_PIAZZA, vgPiazzaSet, vgTwin, NightPiazza });
