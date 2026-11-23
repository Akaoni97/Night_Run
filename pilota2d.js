// ============================================================================
//  Il protagonista nella vista 2D (si aggancia a Street2D, dopo street2d.js):
//  - drawDriver: il guidatore dentro l'abitacolo, visto di profilo attraverso i finestrini: sedile e poggiatesta,
//    busto col giubbotto, braccio sul volante, testa col cappellino. Si muove con l'accelerazione, prende la luce
//    del cruscotto e dei lampioni, si vede solo dove c'è vetro (i montanti e i sedili del disegno lo coprono) e sul
//    vetro passano i riflessi della strada.
//  - heroOutline: contorno scuro netto attorno all'auto del giocatore, che la stacca dallo sfondo.
//  - hazeOf: le auto del traffico prendono un velo della foschia del luogo, più forte nelle corsie lontane.
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype;
  const F = 4;                                                   // risoluzione del guidatore: 4 pixel per unità del disegno (poi ridotti a 2: drvPixel)

  // finestrino del pilota di ogni auto, misurato sul disegno: [sinistra, destra, alto, basso] in pixel del disegno.
  // Serve perché sulle vernici argento, bianche e grigie il colore della carrozzeria somiglia a quello del vetro e il
  // riconoscimento automatico sbaglia. Dentro il riquadro il pilota si vede dove non c'è vernice (maschera _paint) né
  // montanti e guarnizioni scure. La Supra (disegno fatto a codice) usa ancora il riconoscimento del vetro.
  const WIN = {   // finestrino del guidatore [x0, x1, y0, y1] nello sprite: disegni ad alta definizione del 21/11, misurati a mano
    v40: [88, 125, 8, 25], r5: [72, 97, 7, 21], b2002: [77, 102, 7, 19], e30: [80, 109, 7, 21], e36: [81, 108, 4, 17], e34: [94, 118, 5, 19],
    a80: [93, 124, 10, 26], a3: [90, 117, 9, 22], a112: [49, 77, 8, 24], doblo: [98, 127, 19, 42], panda: [71, 99, 17, 34], punto: [66, 100, 13, 29],
    golf: [67, 93, 6, 20], corsa: [80, 112, 15, 32], p205: [60, 90, 9, 25], p206: [66, 98, 13, 28], p308: [83, 113, 15, 30], clio: [76, 108, 15, 29],
    williams: [64, 93, 15, 29], taxi: [94, 121, 13, 27], v850: [99, 130, 10, 25], polo: [80, 109, 15, 30], van: [95, 124, 18, 42],
    ambulanza: [166, 196, 34, 62], polizia: [85, 118, 14, 30],
    panda141: [58, 95, 9, 25], ax: [59, 96, 7, 22], twingo: [58, 97, 9, 27], sandero: [80, 108, 15, 29], aygo: [70, 99, 8, 24],
  };
  S.WIN2D = WIN;
  const paintOf = function (id) {
    if (id === 'v40') { if (!Street2D._v40p) { Street2D._v40p = new Image(); Street2D._v40p.src = 'img/v40_paint.png'; } return Street2D._v40p; }
    const k = this && this.genKey ? this.genKey() : id;   // col kit carrozzeria la maschera del disegno tuning
    return Street2D.gen && Street2D.gen[k] ? Street2D.gen[k].paint : null;
  };
  // maschera dal riquadro misurato (null finché la maschera della vernice non è caricata)
  const rectMasks = (hd, R, paint) => {
    const w = hd.width, h = hd.height, d = hd.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    let pm = null;
    if (paint && paint.width === w && paint.height === h) {
      const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(paint, 0, 0);
      pm = x.getImageData(0, 0, w, h).data;
    }
    const m = new Uint8Array(w * h); let n = 0;
    for (let y = Math.max(0, R[2]); y <= Math.min(h - 1, R[3]); y++) for (let x = Math.max(0, R[0]); x <= Math.min(w - 1, R[1]); x++) {
      const i = (y * w + x) * 4, L = (d[i] + d[i + 1] + d[i + 2]) / 3;
      if (d[i + 3] < 200 || L < 30 || L > 238 || (pm && pm[i + 3] > 127)) continue;
      m[y * w + x] = 1; n++;
    }
    const c = document.createElement('canvas'); c.width = w * F; c.height = h * F;
    const x = c.getContext('2d'); x.fillStyle = '#fff';
    for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) if (m[y * w + xx]) x.fillRect(xx * F, y * F, F, F);
    return { glass: c, win: c, n, band: { top: R[2], bot: R[3], x0: R[0], x1: R[1] } };
  };

  // maschere dei vetri sul disegno a grandezza piena (in cache sul disegno stesso)
  // glass: i pixel di vetro (azzurrini, chiari); win: vetro più gli spazi stretti tra vetri (dettagli, maniglie, cuciture)
  S.glassMasks = function (hd, G) {
    if (hd._gm) return hd._gm;
    const D0 = this.genDef && this.genDef(), off = (D0 && D0.off) || [0, 0], W0 = WIN[this.carId];
    const R = W0 && [W0[0] + off[0], W0[1] + off[0], W0[2] + off[1], W0[3] + off[1]];   // disegno tuning: spostato del margine
    if (R) {
      const pi = paintOf.call(this, this.carId), ready = pi && pi.complete && pi.naturalWidth > 0;
      const M = rectMasks(hd, R, ready ? pi : null);
      if (ready) hd._gm = M;                                       // senza maschera della vernice si ricalcola al prossimo giro
      return M;
    }
    const w = hd.width, h = hd.height, d = hd.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    const yMax = Math.max(4, (G.wy || h * 0.6) - (G.wr || 12) * 0.55), cand = new Uint8Array(w * h), glass = new Uint8Array(w * h);
    // vetro: azzurrino o grigio-blu, chiaro e poco saturo (la vernice azzurra è più satura)
    for (let y = 0; y < Math.min(h, yMax); y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4, r = d[i], g = d[i + 1], b = d[i + 2], L = (r + g + b) / 3, mx = Math.max(r, g, b), sat = (mx - Math.min(r, g, b)) / Math.max(1, mx);
      if (d[i + 3] > 0 && b >= r + 4 && L > 60 && L < 242 && sat < 0.385) cand[y * w + x] = 1;
    }
    // fascia dei finestrini sopra la testa del pilota: per ogni colonna il primo tratto di vetro dall'alto, poi la mediana
    const hx = Math.round(G.hx ?? w * 0.55), ys = Math.min(h, Math.floor(yMax)), tops = [], bots = [];
    for (let x = Math.max(0, hx); x < Math.min(w, hx + 7); x++) {
      for (let y = 0; y < ys; y++) {                                // primo tratto di vetro alto almeno 4 (i riflessi sul tetto sono più corti)
        if (!cand[y * w + x]) continue;
        let e = y, gap = 0; for (let q = y + 1; q < ys && gap < 2; q++) { if (cand[q * w + x]) { e = q; gap = 0; } else gap++; }
        if (e - y >= 3) { tops.push(y); bots.push(e); break; }
        y = e;
      }
    }
    const med = (a) => a.sort((p, q) => p - q)[a.length >> 1];
    const best = tops.length >= 3 ? [med(tops), med(bots)] : [0, -1];
    const band = best[1] >= best[0] ? { top: best[0], bot: best[1] } : null;
    if (band) for (let y = Math.max(0, band.top - 1); y <= Math.min(h - 1, band.bot + 1); y++) for (let x = 0; x < w; x++) glass[y * w + x] = cand[y * w + x];
    const win = glass.slice();
    for (let y = 0; y < h; y++) for (let x = 1; x < w - 1; x++) {
      if (glass[y * w + x]) continue;
      let l = 0, r = 0; for (let q = 1; q <= 2; q++) { if (x - q >= 0 && glass[y * w + x - q]) l = 1; if (x + q < w && glass[y * w + x + q]) r = 1; }
      if (l && r) win[y * w + x] = 1;
    }
    const mk = (m) => {
      const c = document.createElement('canvas'); c.width = w * F; c.height = h * F;
      const x = c.getContext('2d'); x.fillStyle = '#fff';
      for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) if (m[y * w + xx]) x.fillRect(xx * F, y * F, F, F);
      return c;
    };
    let n = 0; for (let i = 0; i < glass.length; i++) n += glass[i];
    return (hd._gm = { glass: mk(glass), win: mk(win), n, band });
  };

  // dal disegno a vettori a pixel netti (v0.119): riduce la figura a 2 pixel per unità (la griglia di mezza unità dei disegni HD delle auto e
  // dei passanti). In ogni blocco vince la media, ma un dettaglio scuro (occhio, sopracciglio, bocca, naso) non si perde; colori a livelli,
  // contorno scuro di personaggio.js. Solo la fascia dei finestrini: il resto è comunque coperto dalla maschera dei vetri.
  S.drvPixel = function (x, L, w, h, B) {
    const P = 2, bl = F / P;
    const gx = B && B.x0 != null, rx0 = gx ? Math.max(0, Math.floor(B.x0) - 3) : 0, rx1 = gx ? Math.min(w, Math.ceil(B.x1) + 3) : w, ry0 = B ? Math.max(0, B.top - 3) : 0, ry1 = B ? Math.min(h, B.bot + 4) : h;
    const sw = Math.ceil((rx1 - rx0) * P), sh = Math.ceil((ry1 - ry0) * P); if (sw < 2 || sh < 2) return;
    const Sm = this._drvP || (this._drvP = document.createElement('canvas')); if (Sm.width !== sw || Sm.height !== sh) { Sm.width = sw; Sm.height = sh; }
    const sg = Sm.getContext('2d', { willReadFrequently: true });
    const W0 = (rx1 - rx0) * F, H0 = (ry1 - ry0) * F, src = x.getImageData(rx0 * F, ry0 * F, W0, H0).data;
    const out = sg.createImageData(sw, sh), d = out.data;
    for (let py = 0; py < sh; py++) for (let px = 0; px < sw; px++) {
      let n = 0, r = 0, gg = 0, b = 0, dark = 1e9, dr = 0, dg = 0, db = 0;
      for (let yy = 0; yy < bl; yy++) for (let xx = 0; xx < bl; xx++) {
        const sx = px * bl + xx, sy = py * bl + yy; if (sx >= W0 || sy >= H0) continue;
        const i = (sy * W0 + sx) * 4, a = src[i + 3]; if (a < 150) continue;
        n++; r += src[i]; gg += src[i + 1]; b += src[i + 2];
        const lu = src[i] * 0.3 + src[i + 1] * 0.59 + src[i + 2] * 0.11; if (lu < dark) { dark = lu; dr = src[i]; dg = src[i + 1]; db = src[i + 2]; }
      }
      if (n < bl * bl * 0.45) continue;                          // meno di metà pieno: vuoto
      r /= n; gg /= n; b /= n;
      const mean = r * 0.3 + gg * 0.59 + b * 0.11;
      if (dark < mean * 0.55 && mean > 40) { r = dr; gg = dg; b = db; }
      const o = (py * sw + px) * 4; d[o] = (r >> 3) << 3; d[o + 1] = (gg >> 3) << 3; d[o + 2] = (b >> 3) << 3; d[o + 3] = 255;
    }
    sg.putImageData(out, 0, 0);
    if (typeof pgOutline === 'function') pgOutline(sg, '#0b0a12');
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over'; x.imageSmoothingEnabled = false;
    x.clearRect(rx0 * F, ry0 * F, W0, H0); x.drawImage(Sm, 0, 0, sw, sh, rx0 * F, ry0 * F, sw * bl, sh * bl);
  };

  // il guidatore. G: geometria dell'auto (hx, hy testa, wy, wr), spr: sprite (con spr.hd), st: stato della vista
  S.drawDriver = function (g, spr, G, st, s, k) {
    const hd = spr.hd || spr, w = hd.width, h = hd.height;
    const M = this.glassMasks(hd, G);
    const L = this._drv || (this._drv = document.createElement('canvas'));
    if (L.width < w * F || L.height < h * F) { L.width = Math.max(L.width, w * F); L.height = Math.max(L.height, h * F); }
    const x = L.getContext('2d', { willReadFrequently: true });   // si rilegge (drvPixel): tela in memoria, niente andata e ritorno dalla scheda video
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, L.width, L.height);
    x.setTransform(F, 0, 0, F, 0, 0);
    const day = this.day || 0, nt = 1 - day, bob = Math.max(-1, Math.min(1, -st.heave * 0.15));
    // la figura si adatta all'altezza del finestrino: la testa sta sotto il tetto, le spalle arrivano alla linea di cintura
    const B = M.band, bh = B ? B.bot - B.top + 1 : 10;
    // col riquadro misurato la figura riempie il finestrino (testa sotto il tetto, spalle alla linea di cintura) e sta nella
    // metà posteriore del vetro, come chi guida; senza, la vecchia regola sul vetro riconosciuto
    const sc = B && B.x0 != null ? Math.max(0.75, Math.min(1.75, bh / 12.2)) : Math.max(0.66, Math.min(1.25, bh / 11.2)), lean = st.head * 0.8 * sc;   // grande: si riconosce
    const ax = B && B.x0 != null ? B.x0 + (B.x1 - B.x0) * 0.42 : (G.hx ?? 108) + 3;
    const ay = B && B.x0 != null ? B.top + bh * 0.17 + 4.6 * sc : B ? B.top + 0.8 + 4.9 * sc : (G.hy ?? 0) + 17;
    x.translate(ax, ay); x.scale(sc, sc); x.translate(-ax, -ay);
    const cx = ax + lean / sc, cy = ay + bob / sc, sx = ax + lean * 0.4 / sc;
    this._drvHead = { ax: (ax + lean / sc) * spr.width / w, ay: (ay + bob / sc - 4.2 * sc) * spr.height / h, m: g.getTransform() };   // in unità dello sprite sullo schermo   // dove sta la testa (reazioni.js: la nuvoletta di pensiero)
    const shade = (hex, f) => Street2D.shade(hex, f);
    const dk = 0.42 * nt;                                         // di notte la figura è in ombra, illuminata solo da cruscotto e lampioni
    const C = { seat: shade('#2a2c36', -dk * 0.5), seatHi: shade('#454a5c', -dk * 0.4), jacket: shade('#2b3348', -dk * 0.45), jacketHi: shade('#46557a', -dk * 0.35),
      skin: shade('#d29a72', -dk * 0.6), skinSh: shade('#a06a4c', -dk * 0.6), hair: '#141010', cap: shade('#a81e24', -dk * 0.45), capHi: shade('#d8343a', -dk * 0.4), wheel: '#0c0d12' };
    const el = (ex, ey, rx, ry, col) => { x.fillStyle = col; x.beginPath(); x.ellipse(ex, ey, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2); x.fill(); };
    const poly = (pts, col) => { x.fillStyle = col; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) x.lineTo(p[0], p[1]); x.closePath(); x.fill(); };
    const line = (pts, col, wd) => { x.strokeStyle = col; x.lineWidth = wd; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) x.lineTo(p[0], p[1]); x.stroke(); };
    // sedile e poggiatesta (fermi)
    poly([[sx - 11, cy + 18], [sx - 9.5, cy + 3], [sx - 5.5, cy + 2.5], [sx - 5, cy + 18]], C.seat);
    line([[sx - 9.4, cy + 4], [sx - 9.9, cy + 17]], C.seatHi, 0.6);
    x.fillStyle = C.seat; x.beginPath(); x.roundRect(sx - 10.2, cy - 6.5, 4.4, 7.5, 1.6); x.fill();
    line([[sx - 9.9, cy - 5.5], [sx - 9.9, cy - 0.5]], C.seatHi, 0.5);
    line([[sx - 8, cy + 1], [sx - 8, cy + 3]], '#0a0b10', 0.7);                                                   // aste del poggiatesta
    // la figura: aspetto scelto nell'editor (personaggio.js) e i movimenti di chi guida davvero
    const wx = sx + 14.5, wy = cy + 8.5, t = this.st.t || 0, M2 = this._pgM || (this._pgM = { turn: 0, steer: 0, lz: null, gear: s.gear, shiftK: 0, still: 0, elbow: 0 });
    const dt = Math.min(0.1, Math.max(0, t - (M2.t ?? t))); M2.t = t;
    M2.still = Math.abs(s.v || 0) < 0.5 ? M2.still + dt : 0;
    // dove guarda: freccia a sinistra = verso l'altro finestrino, a destra = verso di noi (specchietto e spalla);
    // ogni tanto un'occhiata allo specchietto; fermo da un po' si guarda intorno
    const mirror = (t % 9.3) > 8.5, sig = s.signal === 'L' ? -0.75 : s.signal === 'R' ? 0.8 : 0;
    let want = sig || (M2.still > 3 ? Math.sin(t * 0.45) * 0.85 : mirror ? 0.35 : 0);
    if (this._rea && this._rea.awe > 0.2) want = 0.15;                                      // stupito: guarda avanti, la strada
    M2.turn += (want - M2.turn) * Math.min(1, dt * 5);
    // sterzo: la mano segue lo spostamento di corsia
    const lz = this.st.lz ?? 0; if (M2.lz === null) M2.lz = lz;
    const dlz = dt > 0 ? (lz - M2.lz) / dt : 0; M2.lz = lz;
    M2.steer += (Math.max(-1, Math.min(1, -dlz * 0.35)) - M2.steer) * Math.min(1, dt * 6);
    // cambio marcia: le spalle seguono il braccio che va alla leva
    if (s.gear !== M2.gear) { M2.shiftK = 1; M2.gear = s.gear; }
    M2.shiftK = Math.max(0, M2.shiftK - dt * 2.6);
    // finestrino giù e andatura tranquilla: il gomito fuori (con un po' di isteresi)
    M2.elbow = (s.win || 0) > 0.7 && Math.abs(s.v || 0) < (M2.elbow ? 24 : 20) ? 1 : 0;
    // radio accesa: muove la testa a tempo e ogni tanto canticchia; sonno: occhi pesanti, sbadigli, la testa che ciondola
    const G2 = window.nightRun && window.nightRun.game, need = G2 && G2.s.vg && G2.s.vg.needs, music = !!(window.nightRun && window.nightRun.radioOn) && Math.abs(s.v || 0) > 1;
    const sleepy = need ? Math.max(0, Math.min(1, (0.32 - need.sleep) / 0.25)) : 0;
    const yawnT = (t % 13) - 11.2, yawn = sleepy > 0.15 && yawnT > 0 ? Math.sin(Math.min(1, yawnT / 1.6) * Math.PI) : 0;
    const nod = sleepy > 0.5 ? Math.max(0, Math.sin(t * 0.7)) ** 6 * 1.4 * sleepy : 0;
    // dopo qualche bicchiere (polizia.js, vg.alc in g/l): la testa ciondola piano, di lato e un po' in su e giù. Nient'altro
    const alc = G2 && G2.s.vg ? Math.min(1, (G2.s.vg.alc || 0) / 1.1) : 0, swayX = alc * (Math.sin(t * 1.15) * 1.3 + Math.sin(t * 2.7) * 0.4), swayY = alc * Math.sin(t * 0.9 + 1) * 0.7;
    const beat = music && !sleepy ? Math.max(0, Math.sin(t * Math.PI * 2 * 1.9)) * 0.32 : 0, sing = music && !sleepy && (t % 11) > 8.5 && Math.floor(t * 4) % 2 === 0;
    const look = window.NightPG ? NightPG.now() : (typeof PG_DEF !== 'undefined' ? PG_DEF : null);
    const blink = (t % 3.9) < 0.11 || ((t + 1.7) % 7.3) < 0.1;
    if (typeof pgDriver === 'function') {
      pgDriver(x, { cx: cx + swayX, cy: cy + beat + nod + swayY, sx, wx, wy, C: pgColors(look, dk * 0.38), look, turn: nod > 0.3 ? 0 : M2.turn, blink: blink || (sleepy > 0.7 && (t % 2.4) < 0.5), breath: Math.sin(t * 1.6),
        steer: M2.steer, elbow: M2.elbow, shiftK: M2.shiftK, lookUp: mirror && !sig ? 1 : 0, sleepy, yawn, sing, awe: this._rea ? this._rea.awe : 0 });
    }
    // volante (corona vista di taglio)
    x.strokeStyle = C.wheel; x.lineWidth = 1; x.beginPath(); x.ellipse(wx, wy - 0.5, 1.3, 4.6, -0.3, 0, Math.PI * 2); x.stroke();
    line([[wx + 0.4, wy - 4.6], [wx + 1.2, wy - 1.5]], shade('#ff9a40', -0.2), 0.4);
    // luce: cruscotto da davanti in basso (ambra), lampioni che passano da sopra, cielo di giorno
    x.globalCompositeOperation = 'source-atop';
    const dash = x.createRadialGradient(wx + 3, wy + 2, 0, wx + 3, wy + 2, 16);
    dash.addColorStop(0, `rgba(255,150,60,${0.55 * nt})`); dash.addColorStop(0.45, `rgba(255,140,60,${0.22 * nt})`); dash.addColorStop(1, 'rgba(255,140,60,0)');
    x.fillStyle = dash; x.fillRect(sx - 14, cy - 10, 34, 30);
    const lamp = this._drvLamp || 0;
    if (lamp > 0.02) { const top = x.createLinearGradient(0, cy - 8, 0, cy + 10); top.addColorStop(0, `rgba(255,214,150,${0.5 * lamp})`); top.addColorStop(1, 'rgba(255,214,150,0)'); x.fillStyle = top; x.fillRect(sx - 14, cy - 10, 34, 30); }
    if (day > 0.05) { x.fillStyle = `rgba(190,215,255,${0.18 * day})`; x.fillRect(sx - 14, cy - 10, 34, 30); }
    // pixel nitidi come il resto dei personaggi (v0.119): la figura è disegnata a vettori, qui si porta alla griglia di mezza unità
    // (la stessa dei disegni HD delle auto e dei passanti), con colori a pochi livelli e il contorno scuro di personaggio.js
    if (this.quality !== 'bassa' && !window.__noDrvPix) this.drvPixel(x, L, w, h, B);
    // solo dentro i vetri
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'destination-in';
    if (M.n > 12) x.drawImage(M.win, 0, 0); else { x.fillStyle = 'rgba(0,0,0,.85)'; x.fillRect(0, 0, L.width, L.height); }
    // finestrino abbassato: dove non c'è più il vetro si vede l'interno, più scuro del cristallo azzurrino del disegno
    // (sotto la figura: destination-over la lascia davanti)
    if ((s.win || 0) > 0.01 && B) {
      const ey = (B.top + (B.bot - B.top + 1) * Math.min(1, s.win) * 0.92) * F;
      const Sh = this._drvS || (this._drvS = document.createElement('canvas'));
      if (Sh.width !== L.width || Sh.height !== L.height) { Sh.width = L.width; Sh.height = L.height; }
      const sx2 = Sh.getContext('2d'); sx2.globalCompositeOperation = 'source-over'; sx2.clearRect(0, 0, Sh.width, Sh.height);
      sx2.fillStyle = `rgba(6,8,14,${0.5 + 0.2 * nt})`; sx2.fillRect(0, Math.max(0, B.top - 1) * F, Sh.width, ey - Math.max(0, B.top - 1) * F);
      sx2.globalCompositeOperation = 'destination-in'; sx2.drawImage(M.win, 0, 0);
      x.globalCompositeOperation = 'destination-over'; x.drawImage(Sh, 0, 0);
    }
    // riflessi della strada sul vetro: due lame chiare inclinate che scorrono all'indietro
    x.globalCompositeOperation = 'source-over';
    const R = this._drvR || (this._drvR = document.createElement('canvas'));
    if (R.width !== L.width || R.height !== L.height) { R.width = L.width; R.height = L.height; }
    const rx = R.getContext('2d'); rx.globalCompositeOperation = 'source-over'; rx.clearRect(0, 0, R.width, R.height);
    const off = ((this.st.reflOff || 0) % (w * F) + w * F) % (w * F);
    rx.fillStyle = `rgba(220,235,255,${0.1 + 0.08 * nt})`;
    // riflessi diagonali sul vetro: tolti (davano fastidio sul guidatore)
    for (const [o, wd] of []) { const bx = (o - off + w * F) % (w * F); rx.beginPath(); rx.moveTo(bx, 0); rx.lineTo(bx + wd * F, 0); rx.lineTo(bx + wd * F - h * F * 0.5, h * F); rx.lineTo(bx - h * F * 0.5, h * F); rx.closePath(); rx.fill(); }
    // finestrino che scende: sopra il bordo del cristallo non c'è più vetro (niente riflessi, il pilota si vede pulito);
    // il bordo è una riga chiara con l'ombra sotto, e scende insieme al motorino
    const wo = Math.max(0, Math.min(1, s.win || 0));
    if (wo > 0.01 && B) {
      const ey = (B.top + (B.bot - B.top + 1) * wo * 0.92) * F;
      rx.clearRect(0, 0, R.width, ey);
      rx.fillStyle = 'rgba(235,245,255,.75)'; rx.fillRect(0, ey, R.width, F * 0.7);
      rx.fillStyle = 'rgba(10,14,24,.45)'; rx.fillRect(0, ey + F * 0.7, R.width, F * 0.6);
    }
    rx.globalCompositeOperation = 'destination-in'; rx.drawImage(M.glass, 0, 0);
    x.drawImage(R, 0, 0);
    // sullo sprite: stessa trasformazione della carrozzeria
    g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.drawImage(L, 0, 0, w * F, h * F, 0, 0, spr.width, spr.height);
    g.restore();
  };

  // contorno scuro attorno all'auto del giocatore (sotto la carrozzeria, mezza unità di spessore)
  S.heroOutline = function (g, spr) {
    if (!spr.getContext) return;
    const sil = this.silOf(spr), o = (this.SS || 1) > 1 ? 0.5 : 1;
    g.save(); g.globalAlpha = 0.95;
    for (const [dx, dy] of [[-o, 0], [o, 0], [0, -o], [0, o]]) g.drawImage(sil, dx, dy);
    g.restore();
  };

  // velo della foschia sulle auto del traffico (in cache per sprite e colore)
  S.hazeOf = function (spr, rgb) {
    const key = 'hz' + rgb; spr._hz = spr._hz || {};
    if (spr._hz[key]) return spr._hz[key];
    const c = document.createElement('canvas'); c.width = spr.width; c.height = spr.height;
    const x = c.getContext('2d'); x.drawImage(spr, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = `rgb(${rgb})`; x.fillRect(0, 0, c.width, c.height);
    return (spr._hz[key] = c);
  };

  // il guidatore si ridisegna al massimo 20 volte al secondo (prestazioni, 23/11/2026): la figura a pixel (drvPixel) costa
  // parecchio e i suoi movimenti sono lenti; negli altri fotogrammi si rimette la figura già pronta, sempre nella
  // posizione dell'auto di questo fotogramma. Cambio di auto o di sprite: si ridisegna subito.
  const DRV_HZ = 20, dd0 = S.drawDriver;
  S.drawDriver = function (g, spr, G, st, s, k) {
    const t = this.st.t || 0, c = this._drvC, L = this._drv;
    if (c && L && c.spr === spr && t >= c.t && t - c.t < 1 / DRV_HZ && this.drvLive !== true) {
      const hd = spr.hd || spr;
      if (c.head) this._drvHead = { ax: c.head.ax, ay: c.head.ay, m: g.getTransform() };
      g.save(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
      g.drawImage(L, 0, 0, hd.width * F, hd.height * F, 0, 0, spr.width, spr.height);
      g.restore();
      return;
    }
    dd0.call(this, g, spr, G, st, s, k);
    this._drvC = { spr, t, head: this._drvHead };
  };
})();
