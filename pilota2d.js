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
  const F = 3;                                                   // risoluzione del guidatore: 3 pixel per unità del disegno

  // finestrino del pilota di ogni auto, misurato sul disegno: [sinistra, destra, alto, basso] in pixel del disegno.
  // Serve perché sulle vernici argento, bianche e grigie il colore della carrozzeria somiglia a quello del vetro e il
  // riconoscimento automatico sbaglia. Dentro il riquadro il pilota si vede dove non c'è vernice (maschera _paint) né
  // montanti e guarnizioni scure. La Supra (disegno fatto a codice) usa ancora il riconoscimento del vetro.
  const WIN = {
    v40: [88, 125, 8, 25], r5: [72, 98, 6, 21], b2002: [76, 107, 4, 20], e30: [77, 115, 7, 23], e36: [74, 111, 4, 19], e34: [92, 118, 2, 20],
    a80: [95, 129, 13, 25], a3: [90, 121, 8, 21], a112: [56, 84, 8, 23], doblo: [95, 123, 17, 40], panda: [68, 97, 16, 33], punto: [67, 107, 13, 32],
    golf: [66, 98, 6, 21], corsa: [79, 110, 14, 34], p205: [62, 95, 8, 25], p206: [67, 102, 13, 29], p308: [84, 123, 16, 33], clio: [77, 109, 16, 31],
    williams: [66, 105, 16, 33], taxi: [93, 115, 11, 25], v850: [105, 134, 10, 25], polo: [80, 116, 16, 33], van: [97, 136, 16, 40],
    ambulanza: [165, 205, 33, 64], polizia: [88, 128, 12, 29],
  };
  S.WIN2D = WIN;
  const paintOf = (id) => {
    if (id === 'v40') { if (!Street2D._v40p) { Street2D._v40p = new Image(); Street2D._v40p.src = 'img/v40_paint.png'; } return Street2D._v40p; }
    return Street2D.gen && Street2D.gen[id] ? Street2D.gen[id].paint : null;
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
    const R = WIN[this.carId];
    if (R) {
      const pi = paintOf(this.carId), ready = pi && pi.complete && pi.naturalWidth > 0;
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

  // il guidatore. G: geometria dell'auto (hx, hy testa, wy, wr), spr: sprite (con spr.hd), st: stato della vista
  S.drawDriver = function (g, spr, G, st, s, k) {
    const hd = spr.hd || spr, w = hd.width, h = hd.height;
    const M = this.glassMasks(hd, G);
    const L = this._drv || (this._drv = document.createElement('canvas'));
    if (L.width < w * F || L.height < h * F) { L.width = Math.max(L.width, w * F); L.height = Math.max(L.height, h * F); }
    const x = L.getContext('2d');
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, L.width, L.height);
    x.setTransform(F, 0, 0, F, 0, 0);
    const day = this.day || 0, nt = 1 - day, bob = Math.max(-1, Math.min(1, -st.heave * 0.15));
    // la figura si adatta all'altezza del finestrino: la testa sta sotto il tetto, le spalle arrivano alla linea di cintura
    const B = M.band, bh = B ? B.bot - B.top + 1 : 10;
    // col riquadro misurato la figura riempie il finestrino (testa sotto il tetto, spalle alla linea di cintura) e sta nella
    // metà posteriore del vetro, come chi guida; senza, la vecchia regola sul vetro riconosciuto
    const sc = B && B.x0 != null ? Math.max(0.7, Math.min(1.55, bh / 14)) : Math.max(0.62, Math.min(1.15, bh / 12.5)), lean = st.head * 0.8 * sc;
    const ax = B && B.x0 != null ? B.x0 + (B.x1 - B.x0) * 0.42 : (G.hx ?? 108) + 3;
    const ay = B && B.x0 != null ? B.top + bh * 0.17 + 4.6 * sc : B ? B.top + 0.8 + 4.9 * sc : (G.hy ?? 0) + 17;
    x.translate(ax, ay); x.scale(sc, sc); x.translate(-ax, -ay);
    const cx = ax + lean / sc, cy = ay + bob / sc, sx = ax + lean * 0.4 / sc;
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
    // busto e spalla
    poly([[sx - 6.5, cy + 6.2], [sx - 2, cy + 4.8], [sx + 3.6, cy + 5.6], [sx + 6, cy + 18], [sx - 7.4, cy + 18]], C.jacket);
    line([[sx - 1.5, cy + 5], [sx + 3.4, cy + 5.8], [sx + 5.6, cy + 17]], C.jacketHi, 0.55);                       // bordo in luce
    line([[sx - 0.5, cy + 5.2], [sx + 0.8, cy + 8.2]], shade(C.jacket, -0.35), 0.45);                              // bavero
    // braccio verso il volante e mano
    const wx = sx + 14.5, wy = cy + 8.5;
    line([[sx + 1.6, cy + 7.5], [sx + 6.6, cy + 13.2], [wx - 1.8, wy + 0.8]], C.jacket, 2.5);
    line([[sx + 2.4, cy + 6.8], [sx + 7.2, cy + 12.4], [wx - 2, wy]], C.jacketHi, 0.5);
    el(wx - 1.1, wy + 0.3, 1.4, 1.1, C.skin);
    // volante (corona vista di taglio)
    x.strokeStyle = C.wheel; x.lineWidth = 1; x.beginPath(); x.ellipse(wx, wy - 0.5, 1.3, 4.6, -0.3, 0, Math.PI * 2); x.stroke();
    line([[wx + 0.4, wy - 4.6], [wx + 1.2, wy - 1.5]], shade('#ff9a40', -0.2), 0.4);
    // collo, testa, orecchio, naso, cappellino
    poly([[cx - 1.3, cy + 2.4], [cx + 1.6, cy + 2.4], [cx + 1.9, cy + 5.6], [cx - 1.6, cy + 5.6]], C.skinSh);
    el(cx, cy, 3.6, 4.1, C.skin);
    el(cx - 1.3, cy + 0.4, 2.4, 3.8, C.skinSh);                                                                    // guancia in ombra verso dietro
    poly([[cx + 3.2, cy - 0.8], [cx + 4.5, cy + 1.2], [cx + 3.3, cy + 1.6]], C.skin);                              // naso
    el(cx + 2.3, cy - 0.6, 0.45, 0.4, '#1a1414');                                                                  // occhio
    el(cx - 0.7, cy + 0.6, 0.9, 1.3, shade(C.skinSh, -0.15));                                                      // orecchio
    poly([[cx - 3.6, cy - 0.8], [cx - 3.9, cy + 2.6], [cx - 2.1, cy + 3.4], [cx - 2.2, cy - 0.8]], C.hair);        // capelli sulla nuca
    poly([[cx - 3.9, cy - 0.6], [cx - 3.4, cy - 3.6], [cx - 0.4, cy - 4.9], [cx + 2.7, cy - 4.3], [cx + 3.3, cy - 1.8]], C.cap);
    line([[cx - 2.8, cy - 3.8], [cx + 0.2, cy - 4.8], [cx + 2.4, cy - 4.3]], C.capHi, 0.55);
    poly([[cx + 2.4, cy - 2.2], [cx + 6.2, cy - 1.6], [cx + 5.8, cy - 1], [cx + 2.6, cy - 1.3]], shade(C.cap, -0.25)); // visiera
    // luce: cruscotto da davanti in basso (ambra), lampioni che passano da sopra, cielo di giorno
    x.globalCompositeOperation = 'source-atop';
    const dash = x.createRadialGradient(wx + 3, wy + 2, 0, wx + 3, wy + 2, 16);
    dash.addColorStop(0, `rgba(255,150,60,${0.55 * nt})`); dash.addColorStop(0.45, `rgba(255,140,60,${0.22 * nt})`); dash.addColorStop(1, 'rgba(255,140,60,0)');
    x.fillStyle = dash; x.fillRect(sx - 14, cy - 10, 34, 30);
    const lamp = this._drvLamp || 0;
    if (lamp > 0.02) { const top = x.createLinearGradient(0, cy - 8, 0, cy + 10); top.addColorStop(0, `rgba(255,214,150,${0.5 * lamp})`); top.addColorStop(1, 'rgba(255,214,150,0)'); x.fillStyle = top; x.fillRect(sx - 14, cy - 10, 34, 30); }
    if (day > 0.05) { x.fillStyle = `rgba(190,215,255,${0.18 * day})`; x.fillRect(sx - 14, cy - 10, 34, 30); }
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
})();
