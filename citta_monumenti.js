// ============================================================================
//  Night Run · I monumenti delle capitali, ad alta definizione (dopo citta_dati.js, v0.114)
//  Chiesto da Nico: «i monumenti come le case, più reali, definiti e con dettagli». Ogni monumento è disegnato al doppio
//  della risoluzione (pixel da mezza unità, `hd: true`, vedi `mkHD` in citta2d.js) con attrezzi comuni: pietra a conci con la
//  luce da sinistra, colonne scanalate coi capitelli, archi, cupole a spicchi, frontoni, finestre accese, e il faro dal basso
//  che schiarisce la parte bassa. Sostituiscono i disegni semplici di citta_dati.js (stesse chiavi, stesse misure `w`/`h`/`lift`).
//  Per un monumento nuovo: una voce in `M` con `w`, `h`, `lift` e `draw(o)`; `o.px(col, x, y, w, h)` accetta mezze unità.
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined' || !Street2D.CITY_LANDMARKS) return;
  const LM = Street2D.CITY_LANDMARKS, sh = Street2D.shade;
  const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

  // ---------------------------------------------------------------- attrezzi
  // pietra a conci: corsi orizzontali, giunti sfalsati, bordo sinistro in luce e destro in ombra
  const ash = (o, x, y, w, h, base, c = 3) => {
    o.px(base, x, y, w, h);
    for (let yy = y + c, row = 0; yy < y + h; yy += c, row++) { o.px(sh(base, -0.15), x, yy, w, 0.5); for (let xx = x + (row % 2 ? c : 0); xx < x + w; xx += c * 2) o.px(sh(base, -0.11), xx, yy - c, 0.5, c); }
    o.px(sh(base, 0.2), x, y, 1, h); o.px(sh(base, -0.3), x + w - 1.5, y, 1.5, h); o.px(sh(base, 0.24), x, y, w, 0.5);
  };
  // luce dei fari dal basso: strisce sempre più trasparenti verso l'alto
  const flood = (o, x, y, w, h, col, a) => { o.x.save(); o.x.globalCompositeOperation = 'source-atop'; for (let i = 0; i < 12; i++) { const t = i / 12; o.px(rgba(col, a * (1 - t) * (1 - t)), x, y + h - (i + 1) * h / 12, w, h / 12 + 0.5); } o.x.restore(); };
  // colonna scanalata con capitello e base
  const col = (o, x, y, h, w, b) => {
    o.px(b, x, y, w, h); for (let k = 1; k < w * 2 - 1; k += 1.5) o.px(sh(b, -0.13), x + k / 2, y, 0.5, h);
    o.px(sh(b, 0.3), x, y, 0.5 + w * 0.12, h); o.px(sh(b, -0.32), x + w * 0.78, y, w * 0.22, h);
    o.px(sh(b, 0.06), x - 0.5, y - 1.5, w + 1, 1.5); o.px(sh(b, 0.32), x - 0.5, y - 1.5, w + 1, 0.5); o.px(sh(b, -0.1), x - 0.5, y + h, w + 1, 1);
  };
  // arco a tutto sesto: x sinistra, y cima, w larghezza, h altezza totale
  const arch = (o, x, y, w, h, fill) => { const r = w / 2; for (let j = 0; j < h * 2; j++) { const yy = y + j / 2; let hw = r; if (j / 2 < r) { const dy = r - j / 2; hw = Math.sqrt(Math.max(0, r * r - dy * dy)); } o.px(fill, x + r - hw, yy, hw * 2, 0.5); } };
  // arco a sesto acuto (gotico)
  const parch = (o, x, y, w, h, fill) => { const r = w / 2; for (let j = 0; j < h * 2; j++) { const yy = y + j / 2, t = j / 2; let hw = r; if (t < r * 1.2) hw = r * Math.min(1, Math.sqrt(Math.max(0, 1 - Math.pow((r * 1.2 - t) / (r * 1.2), 1.6)))); o.px(fill, x + r - hw, yy, hw * 2, 0.5); } };
  // finestra accesa o spenta, con davanzale e riflesso
  const win = (o, x, y, w, h, on, pointed) => { (pointed ? parch : arch)(o, x - 0.5, y - 0.5, w + 1, h + 1, '#1a1220'); (pointed ? parch : arch)(o, x, y, w, h, on ? '#ffcf7a' : '#2a2438'); if (on) o.px('#fff0c0', x + 0.5, y + h * 0.45, w - 1, 0.5); o.px('#1a1220', x + w / 2 - 0.25, y + 1, 0.5, h - 1); };
  // frontone triangolare
  const pedi = (o, x, y, w, h, b) => { for (let j = 0; j < h * 2; j++) { const t = j / (h * 2), hw = (w / 2) * t; o.px(sh(b, -0.18), x + w / 2 - hw, y + j / 2, hw * 2, 0.5); } for (let j = 0; j < h * 2; j++) { const t = j / (h * 2), hw = (w / 2) * t; o.px(sh(b, 0.3), x + w / 2 - hw, y + j / 2, 0.5, 0.5); o.px(sh(b, -0.2), x + w / 2 + hw - 0.5, y + j / 2, 0.5, 0.5); } o.px(sh(b, 0.28), x - 0.5, y + h, w + 1, 1); o.px(sh(b, -0.2), x - 0.5, y + h + 1, w + 1, 0.5); };
  // cornicione a più strisce
  const cornice = (o, x, y, w, b) => { o.px(sh(b, 0.32), x - 1, y, w + 2, 0.5); o.px(b, x - 1, y + 0.5, w + 2, 1); o.px(sh(b, -0.3), x, y + 1.5, w, 0.5); for (let k = x; k < x + w; k += 2) o.px(sh(b, -0.22), k, y + 1, 0.5, 1); };
  // cupola a spicchi: cx centro, yb base, r raggio, h altezza
  const dome = (o, cx, yb, r, h, b, ribs = 12) => {
    for (let j = 0; j < h * 2; j++) { const t = j / (h * 2), hw = Math.sqrt(1 - t * t) * r, yy = yb - j / 2 - 0.5; o.px(b, cx - hw, yy, hw * 2, 0.5); o.px(sh(b, 0.26), cx - hw, yy, hw * 0.34, 0.5); o.px(sh(b, -0.34), cx + hw * 0.46, yy, hw * 0.54, 0.5); }
    for (let k = -ribs / 2 + 1; k < ribs / 2; k++) for (let u = 0; u <= 0.97; u += 0.025) { const hw = Math.sqrt(1 - u * u) * r; o.px(sh(b, -0.36), cx + (k / (ribs / 2)) * hw, yb - u * h, 0.5, 0.5); }
    o.px(sh(b, 0.35), cx - r * 0.5, yb - h * 0.82, r * 0.5, 0.5);
  };
  const FL = '#e8b868', FL2 = '#c8904a', WARM = '#ffcf7a';

  const M = {};
  // ---------------------------------------------------------------- Roma
  M.colosseo = { w: 124, h: 54, lift: 70, draw(o) {
    const { gy, w } = o, B = '#c9a070', hAt = (xx) => xx < w * 0.52 ? 50 : Math.max(24, 50 - (xx - w * 0.52) * 0.52 + ((xx * 7) % 5 < 2 ? -3 : 0));
    // parete interna dietro la parte crollata, più scura
    for (let xx = w * 0.5; xx < w - 3; xx += 0.5) { const hh = Math.min(50, hAt(xx) + 9); o.px('#7a5836', xx, gy - hh, 0.5, hh); }
    ash(o, 2, gy - 50, w - 4, 50, B, 3);
    for (let xx = 2; xx < w - 2; xx += 0.5) { const hh = hAt(xx); if (hh < 50) o.x.clearRect(xx, gy - 50, 0.5, 50 - hh); }
    for (let xx = 2; xx < w - 2; xx += 0.5) { const hh = hAt(xx); if (hh < 50) o.px('#7a5836', xx, gy - hh - (xx * 13 % 3) * 0.5, 0.5, 9); }          // interno dei corsi spezzati
    // tre ordini di arcate con le semicolonne tra i piloni, poi l'attico con le finestrelle
    const tiers = [[gy - 14, 14, '#3a2414'], [gy - 27, 13, '#3a2414'], [gy - 40, 13, '#3a2414']];
    tiers.forEach(([ty, th, dk], t) => {
      for (let xx = 4; xx < w - 7; xx += 7) { if (hAt(xx) < gy - ty - 1 + 0.5 && hAt(xx) < (gy - ty)) continue; const top = ty + 2;
        if (gy - top > hAt(xx)) continue; arch(o, xx, top, 4, th - 3, dk); arch(o, xx + 0.5, top + 0.5, 3, th - 3.5, '#5a3a1c'); o.px(t === 0 ? '#a06a30' : '#e8a050', xx + 0.5, ty + th - 5, 3, 3);
        o.px(sh(B, 0.3), xx - 1, top, 0.5, th - 3); o.px(sh(B, -0.3), xx + 4.5, top, 0.5, th - 3); o.px(sh(B, 0.34), xx + 1, top - 0.5, 2, 0.5);
        if (xx + 7 < w - 7) { o.px(sh(B, 0.14), xx + 5.5, ty + 2, 1, th - 2); } }
      if (gy - ty - th < hAt(w * 0.3)) { o.px(sh(B, 0.3), 2, ty, Math.min(w - 4, 62), 0.5); o.px(sh(B, -0.3), 2, ty + 0.5, Math.min(w - 4, 62), 0.5); } });
    for (let xx = 5; xx < w * 0.52; xx += 7) { o.px('#2a1a0a', xx, gy - 47, 2, 3.5); o.px('#e8a050', xx, gy - 45.5, 2, 0.5); o.px(sh(B, -0.35), xx - 0.5, gy - 49, 0.5, 2); o.px(sh(B, -0.35), xx + 2.5, gy - 49, 0.5, 2); }
    cornice(o, 2, gy - 50.5, w * 0.52 - 2, B); flood(o, 2, gy - 50, w - 4, 50, FL, 0.34);
    o.meta.glows.push({ x: w / 2, y: gy - 20, r: 58, ry: 0.35, col: FL, a: 0.1 }); } };

  M.pantheon = { w: 72, h: 62, lift: 44, draw(o) {
    const { gy, w } = o, B = '#cdb48a', cx = w / 2;
    o.px(sh(B, -0.25), 12, gy - 46, w - 24, 20); for (let xx = 14; xx < w - 14; xx += 4) { o.px(sh(B, -0.4), xx, gy - 46, 0.5, 20); o.px(sh(B, 0.1), xx + 0.5, gy - 46, 0.5, 20); }
    ash(o, 8, gy - 38, w - 16, 14, B, 3); cornice(o, 8, gy - 39, w - 16, B);
    dome(o, cx, gy - 40, 24, 15, sh(B, -0.1), 20); for (let q = 0; q < 8; q++) o.px(sh(B, -0.3), cx - 19 + q * 5, gy - 49, 3, 0.5); o.px('#fff0c0', cx - 1.5, gy - 55.5, 3, 1.5);
    for (let k = 0; k < 8; k++) col(o, 8 + k * 7.9, gy - 30, 26, 3.4, sh(B, 0.04));
    o.px(sh(B, -0.35), 8, gy - 34, w - 16, 4); o.px(sh(B, 0.2), 8, gy - 34, w - 16, 0.5); for (let xx = 10; xx < w - 10; xx += 3) o.px(sh(B, 0.3), xx, gy - 33, 1, 2);
    pedi(o, 6, gy - 46, w - 12, 12, B); o.px(sh(B, -0.4), 14, gy - 42, w - 28, 5);
    for (let s = 0; s < 4; s++) { o.px(sh(B, 0.12 - s * 0.05), 4 - s, gy - 4 + s, w - 8 + s * 2, 1); } o.px(sh(B, -0.3), 4, gy, w - 8, 0.5);
    o.px('#2a1a10', cx - 4, gy - 22, 8, 18); o.px('#ffcf7a', cx - 3, gy - 21, 6, 17); o.px('#8a6a3a', cx, gy - 21, 0.5, 17);
    flood(o, 4, gy - 56, w - 8, 56, FL, 0.4); o.meta.glows.push({ x: cx, y: gy - 28, r: 40, ry: 0.7, col: FL, a: 0.12 }); } };

  M.cupola = { w: 66, h: 96, lift: 44, draw(o) {
    const { gy, w } = o, B = '#d2b88e', cx = w / 2;
    ash(o, 2, gy - 26, w - 4, 26, B, 3); cornice(o, 2, gy - 27, w - 4, B);
    for (let k = 0; k < 9; k++) { col(o, 5 + k * 6.6, gy - 21, 17, 2.4, B); } for (let k = 0; k < 8; k++) { const x0 = 7.5 + k * 6.6; win(o, x0, gy - 17, 2.5, 5, k % 3 !== 1, false); }
    o.px(sh(B, -0.2), 2, gy - 29, w - 4, 2); for (let k = 0; k < 16; k++) { o.px(sh(B, -0.4), 4 + k * 3.8, gy - 33, 1, 4); o.px(sh(B, 0.2), 4 + k * 3.8, gy - 34, 1, 1); }       // statue sull'attico
    ash(o, cx - 17, gy - 52, 34, 22, sh(B, 0.02), 3); for (let k = 0; k < 8; k++) { col(o, cx - 16 + k * 4.2, gy - 50, 17, 1.8, B); win(o, cx - 14.3 + k * 4.2, gy - 49, 1.8, 5, k % 2 === 0); } cornice(o, cx - 17, gy - 53, 34, B);
    dome(o, cx, gy - 53, 16, 22, sh(B, -0.04), 16);
    o.px(sh(B, -0.3), cx - 4, gy - 77, 8, 3); for (let k = 0; k < 4; k++) { o.px(sh(B, 0.2), cx - 3 + k * 2, gy - 76.5, 0.5, 2); } o.px(sh(B, -0.1), cx - 3, gy - 80, 6, 3); dome(o, cx, gy - 80, 3.5, 4, sh(B, 0.1), 4);
    o.px('#c9a84a', cx - 0.5, gy - 88, 1, 6); o.px('#c9a84a', cx - 2, gy - 86, 4, 1); o.px('#e8c870', cx - 0.5, gy - 82, 1, 1.5);
    flood(o, 2, gy - 90, w - 4, 90, FL, 0.34); o.meta.glows.push({ x: cx, y: gy - 50, r: 34, col: FL, a: 0.12 }); o.meta.beacons.push({ x: cx, y: gy - 90 }); } };

  // ---------------------------------------------------------------- Parigi
  M.eiffel = { w: 74, h: 148, lift: 4, draw(o) {
    const { gy, w, line } = o, cx = w / 2, FE = '#cfa050', FD = '#7a5428', FH = '#f0cc7a';
    const hw = (y) => { const t = (gy - y) / 140; return Math.max(1.2, 29 * Math.pow(1 - Math.min(1, t), 1.95) + 1.6); };
    for (let y = gy; y > gy - 140; y -= 0.5) { const h = hw(y); o.px(FE, cx - h, y, 1.5, 0.5); o.px(FE, cx + h - 1.5, y, 1.5, 0.5); o.px(FH, cx - h, y, 0.5, 0.5); o.px(FD, cx + h - 0.5, y, 0.5, 0.5); }
    for (const dx of [-0.34, 0.34]) for (let y = gy; y > gy - 118; y -= 0.5) { const h = hw(y) * 0.62 * Math.sign(dx) * -1; o.px(FD, cx + h * -1 + (dx < 0 ? 0 : -0.5), y, 0.5, 0.5); }
    for (let y = gy - 3; y > gy - 132; y -= (y > gy - 50 ? 5 : y > gy - 90 ? 4 : 3)) { const a = hw(y), b = hw(y - 4); line(cx - a, y, cx + b, y - 4, FD); line(cx + a, y, cx - b, y - 4, FD); o.px(FE, cx - a, y, a * 2, 0.5); }
    arch(o, cx - 26, gy - 20, 14, 20, '#1a1020'); arch(o, cx + 12, gy - 20, 14, 20, '#1a1020'); o.px('#1a1020', cx - 12, gy - 4, 24, 4);
    for (const [yy, ww] of [[gy - 44, 24], [gy - 84, 14], [gy - 120, 7]]) { o.px(sh(FE, -0.1), cx - ww - 1, yy, ww * 2 + 2, 2); o.px(FH, cx - ww - 1, yy, ww * 2 + 2, 0.5); for (let k = -ww; k < ww; k += 1.5) o.px(FD, cx + k, yy - 2, 0.5, 2); o.px(FD, cx - ww, yy - 2, ww * 2, 0.5); }
    o.px(FD, cx - 0.5, gy - 150 + 10, 1, 22); o.px(FH, cx - 0.5, gy - 140, 0.5, 8); o.px('#ffd98a', cx - 1, gy - 141, 2, 1.5);
    for (let k = 0; k < 40; k++) { const y = gy - 6 - (k * 37) % 120, h = hw(y); o.px('#fff4c8', cx - h + ((k * 53) % 100) / 100 * h * 2, y, 0.5, 0.5); }
    flood(o, cx - 30, gy - 70, 60, 70, FL, 0.28); o.meta.glows.push({ x: cx, y: gy - 60, r: 42, ry: 1.2, col: FL, a: 0.1 }); o.meta.beacons.push({ x: cx, y: gy - 142 }); } };

  M.arco = { w: 66, h: 62, lift: 62, draw(o) {
    const { gy, w } = o, B = '#d0b486', cx = w / 2;
    ash(o, 4, gy - 54, w - 8, 54, B, 4); o.px(sh(B, -0.22), 4, gy - 54, w - 8, 9); for (let k = 0; k < 14; k++) { o.x.fillStyle = sh(B, 0.2); o.x.beginPath(); o.x.arc(7 + k * 3.9, gy - 50, 1.4, 0, 6.28); o.x.fill(); o.px(sh(B, -0.4), 6.5 + k * 3.9, gy - 50.5, 1, 1); }   // fregio con gli scudi
    cornice(o, 3, gy - 55, w - 6, B); cornice(o, 3, gy - 45, w - 6, B); o.px(sh(B, -0.3), 3, gy - 44, w - 6, 0.5);
    arch(o, cx - 11, gy - 40, 22, 40, '#201626'); arch(o, cx - 10, gy - 38, 20, 38, '#3a2a22');
    for (let yy = gy - 36; yy < gy - 6; yy += 3) for (let xx = cx - 9; xx < cx + 9; xx += 3) o.px('#5a3e2c', xx, yy, 2, 2);               // cassettoni della volta
    o.px('#ffcf7a', cx - 10, gy - 5, 20, 5); o.px(sh(B, 0.3), cx - 11.5, gy - 41, 23, 0.5);
    for (const gx of [8, w - 19]) { o.px(sh(B, -0.12), gx, gy - 40, 11, 38); o.px(sh(B, 0.3), gx, gy - 40, 0.5, 38); for (let q = 0; q < 7; q++) { o.px(sh(B, q % 2 ? 0.22 : -0.28), gx + 2 + (q * 3) % 7, gy - 34 + q * 4.5, 3, 3.5); } o.px(sh(B, 0.2), gx + 3, gy - 38, 5, 3); }   // gruppi scolpiti
    for (let s = 0; s < 3; s++) o.px(sh(B, 0.1 - s * 0.06), 2 - s, gy - 3 + s, w - 4 + s * 2, 1);
    flood(o, 2, gy - 56, w - 4, 56, FL, 0.42); o.meta.glows.push({ x: cx, y: gy - 28, r: 36, ry: 0.7, col: FL, a: 0.12 }); } };

  M.notredame = { w: 92, h: 118, lift: 20, draw(o) {
    const { gy, w } = o, B = '#c4a87c', cx = w / 2;
    ash(o, 7, gy - 46, w - 14, 46, B, 3);
    for (const tx of [7, w - 31]) { ash(o, tx, gy - 72, 24, 28, sh(B, -0.03), 3); for (let k = 0; k < 2; k++) { parch(o, tx + 3.5 + k * 9, gy - 68, 4.5, 16, '#2a1c14'); for (let q = 0; q < 6; q++) o.px('#6a4a2a', tx + 4 + k * 9, gy - 67 + q * 2.4, 3.5, 0.5); o.px('#ffcf7a', tx + 4.5 + k * 9, gy - 56, 2.5, 4); }
      cornice(o, tx, gy - 72.5, 24, B); for (let k = 0; k < 8; k++) { o.px(sh(B, -0.1), tx + 1 + k * 3, gy - 75, 1.5, 3); o.px(sh(B, 0.3), tx + 1 + k * 3, gy - 75, 0.5, 3); } o.px(sh(B, -0.3), tx + 1, gy - 72, 22, 0.5); }
    for (let j = 0; j < 36; j++) { const hh = 1.6 - j * 0.03; o.px(sh('#9a8a6a', j % 3 ? 0 : 0.2), cx - hh / 2 - 0.3, gy - 74 - j, hh + 0.6, 1); } for (let j = 0; j < 7; j++) { o.px('#9a8a6a', cx - 2 - j * 0.1, gy - 78 - j * 4.5, 4, 0.5); } o.px('#e8c870', cx - 0.5, gy - 112, 1, 2);
    for (const px0 of [14, 33, 52]) { parch(o, px0, gy - 20, 12, 20, '#241810'); parch(o, px0 + 1.5, gy - 18, 9, 18, '#3a281a'); for (let k = 1; k < 4; k++) parch(o, px0 + 0.5 - k * 0.0, gy - 20 + k * 0.5, 12 - k, 19, 'rgba(70,50,30,.0)'); o.px('#ffcf7a', px0 + 5, gy - 6, 2, 6); }
    for (let k = 0; k < 28; k++) { o.px(sh(B, -0.35), 10 + k * 2.55, gy - 28, 1, 5); o.px(sh(B, 0.25), 10.5 + k * 2.55, gy - 28, 0.5, 5); } cornice(o, 8, gy - 29, w - 16, B); cornice(o, 8, gy - 22.5, w - 16, B);
    const rx = cx, ry = gy - 36; for (let r2 = 8; r2 > 0; r2 -= 0.5) { const ring = Math.floor(r2) % 2; o.x.fillStyle = r2 > 7 ? '#2a1c14' : ring ? '#e8b868' : '#ffd98a'; o.x.beginPath(); o.x.arc(rx, ry, r2, 0, 6.28); o.x.fill(); }
    for (let k = 0; k < 12; k++) { const a = k / 12 * 6.28; o.line(rx, ry, rx + Math.cos(a) * 7, ry + Math.sin(a) * 7, '#6a4a2a'); } o.x.fillStyle = '#6a4a2a'; o.x.beginPath(); o.x.arc(rx, ry, 1.6, 0, 6.28); o.x.fill();
    for (let k = 0; k < 4; k++) { o.px(sh(B, -0.25), 10 + k * 20, gy - 46, 2, 9); o.px(sh(B, 0.25), 10 + k * 20, gy - 46, 0.5, 9); }
    flood(o, 7, gy - 70, w - 14, 70, FL, 0.34); o.meta.glows.push({ x: cx, y: gy - 36, r: 42, col: FL, a: 0.1 }); o.meta.beacons.push({ x: cx, y: gy - 112 }); } };

  // ---------------------------------------------------------------- Londra
  M.bigben = { w: 74, h: 150, lift: 14, draw(o) {
    const { gy, w, line } = o, B = '#c0a478', tx = 12, tw = 22, cx = tx + tw / 2;
    // palazzo di Westminster: facciata gotica con le finestre a sesto acuto e i pinnacoli
    ash(o, 38, gy - 28, w - 38, 28, sh(B, -0.05), 3); cornice(o, 38, gy - 29, w - 38, B); for (let k = 0; k < 6; k++) for (let r = 0; r < 2; r++) win(o, 40.5 + k * 5.5, gy - 24 + r * 11, 2.6, 7, (k + r) % 3 !== 0, true);
    for (let k = 0; k < 9; k++) { o.px(sh(B, -0.1), 38 + k * 4.5, gy - 33, 1.5, 4); o.px(sh(B, 0.3), 38 + k * 4.5, gy - 33, 0.5, 4); o.px(sh(B, 0.2), 38.3 + k * 4.5, gy - 35, 0.8, 2); }
    ash(o, w - 12, gy - 44, 11, 16, sh(B, -0.08), 3); parch(o, w - 9, gy - 41, 5, 11, '#241810'); o.px('#ffcf7a', w - 8, gy - 38, 3, 4);                         // torre Victoria
    ash(o, tx, gy - 104, tw, 104, B, 3); for (const sx of [-2.2, tw]) { ash(o, tx + sx, gy - 100, 2.4, 100, sh(B, -0.08), 3); for (let q = 0; q < 6; q++) o.px(sh(B, 0.26), tx + sx, gy - 98 + q * 16, 2.4, 0.5); }
    for (let k = 0; k < 4; k++) for (let r = 0; r < 4; r++) { if (r === 3 && k > 1) continue; parch(o, tx + 3.5 + (k % 2) * 8.5, gy - 8 - r * 13 - (k > 1 ? 7 : 0), 3.2, 9, '#241810'); if ((k + r) % 3 !== 0) o.px('#ffcf7a', tx + 4.2 + (k % 2) * 8.5, gy - 5 - r * 13 - (k > 1 ? 7 : 0), 1.8, 4); }
    ash(o, tx - 1, gy - 90, tw + 2, 6, sh(B, 0.04), 3); cornice(o, tx - 1, gy - 91, tw + 2, B);
    const ccx = cx, ccy = gy - 100; for (let r2 = 8.6; r2 > 0; r2 -= 0.5) { o.x.fillStyle = r2 > 8 ? '#3a2a1a' : r2 > 6.6 ? '#c9a84a' : '#fff0c8'; o.x.beginPath(); o.x.arc(ccx, ccy, r2, 0, 6.28); o.x.fill(); }
    for (let h12 = 0; h12 < 12; h12++) { const a = h12 / 12 * 6.28; o.px('#3a2a1a', ccx + Math.cos(a) * 5.6 - 0.25, ccy + Math.sin(a) * 5.6 - 0.25, 1, 1); } o.line(ccx, ccy, ccx + 3.6, ccy - 2.1, '#3a2a1a'); o.line(ccx, ccy, ccx - 0.5, ccy - 5, '#3a2a1a');
    ash(o, tx - 1, gy - 124, tw + 2, 22, sh(B, 0.02), 3); for (let k = 0; k < 3; k++) { parch(o, tx + 2.5 + k * 6.2, gy - 120, 4, 15, '#241810'); for (let q = 0; q < 7; q++) o.px('#6a4a2a', tx + 3 + k * 6.2, gy - 119 + q * 2, 3, 0.5); }
    for (const sx of [-2, tw - 0.5]) { o.px(sh(B, -0.12), tx + sx, gy - 130, 2.5, 8); for (let j = 0; j < 8; j++) o.px(sh(B, 0.2 - j * 0.02), tx + sx + 0.3 + j * 0.1, gy - 138 - j, 1.8 - j * 0.2, 1); }
    for (let j = 0; j < 40; j++) { const hh = (tw - 4) * (1 - j / 40); o.px(j % 4 ? '#6a7a8a' : '#c9a84a', cx - hh / 2, gy - 126 - j, hh, 1); } o.px('#e8c870', cx - 0.5, gy - 170 + 14, 1, 5); o.px('#e8c870', cx - 0.5, gy - 160, 1, 6);
    flood(o, 0, gy - 120, w, 120, FL, 0.3); o.meta.glows.push({ x: ccx, y: ccy, r: 18, col: '#fff0c8', a: 0.2 }); o.meta.beacons.push({ x: cx, y: gy - 166 }); } };
  M.bigben.h = 150;

  M.towerbridge = { w: 132, h: 70, lift: 8, draw(o) {
    const { gy, w, line } = o, B = '#b4a488', BL = '#4a78c8', tw = 24;
    // catene azzurre e carreggiata: le due ali che si alzano si chiudono al centro
    for (const [a, b] of [[14 + tw / 2, 0], [w - 14 - tw / 2, w]]) for (let k = 0; k <= 1; k += 0.01) { const x = a + (b - a) * k, y = gy - 58 + (Math.pow(k, 2)) * 40; o.px(BL, x, y, 0.5, 0.5); o.px(sh(BL, 0.3), x, y - 0.5, 0.5, 0.5); }
    for (let k = 0; k < w; k += 3) { const kk = Math.abs((k - w / 2) / (w / 2)); }
    o.px('#2a3a6a', 0, gy - 12, w, 3); o.px(BL, 0, gy - 12.5, w, 0.5); for (let k = 0; k < w; k += 2.5) o.px('#2a3a6a', k, gy - 9, 0.5, 4); o.px(sh(BL, 0.3), 36, gy - 13, w - 72, 0.5);
    for (const tx of [14, w - 14 - tw]) { ash(o, tx, gy - 64, tw, 64, B, 3); for (const sx of [0, tw - 4]) { ash(o, tx + sx - 0.5, gy - 70, 4.5, 70, sh(B, -0.06), 3); for (let j = 0; j < 14; j++) o.px(j % 3 ? '#5a7a9a' : '#8aa8c8', tx + sx + 0.4 + j * 0.15, gy - 70 - j, 3.2 - j * 0.3, 1); o.px('#5a7a9a', tx + sx + 1.8, gy - 86, 0.5, 4); }
      for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) { parch(o, tx + 5.5 + k * 5.2, gy - 20 - r * 17, 3, 10, '#1a1c28'); if ((k + r) % 2 === 0) o.px('#ffcf7a', tx + 6.3 + k * 5.2, gy - 16 - r * 17, 1.4, 5); }
      for (let j = 0; j < 14; j++) { o.px(j % 3 ? '#5a7a9a' : '#8aa8c8', tx + 6 + j * 0.3, gy - 64 - j * 1, tw - 12 - j * 0.6, 1); } cornice(o, tx, gy - 65, tw, B); }
    for (let yy = gy - 52; yy < gy - 46; yy += 3) o.px(BL, 14 + tw, yy, w - 28 - tw * 2, 0.5); o.px(BL, 14 + tw, gy - 52, w - 28 - tw * 2, 1.5); for (let k = 14 + tw; k < w - 14 - tw; k += 3) { line(k, gy - 52, k + 3, gy - 46, '#5a8ad8'); line(k + 3, gy - 52, k, gy - 46, '#5a8ad8'); }
    flood(o, 10, gy - 70, w - 20, 70, '#9ab8f0', 0.25); o.meta.glows.push({ x: w / 2, y: gy - 36, r: 58, ry: 0.5, col: '#8ab0ff', a: 0.09 }); o.meta.beacons.push({ x: 26, y: gy - 88 }, { x: w - 26, y: gy - 88 }); } };

  M.eye = { w: 92, h: 96, lift: 6, draw(o) {
    const { gy, line } = o, cx = 46, cy = gy - 52, R = 42;
    for (const d of [-1, 1]) { line(cx + d * 1.5, cy, cx + d * 20, gy, '#c8d8e8'); line(cx + d * 3, cy, cx + d * 23, gy, '#7a8aa0'); line(cx + d * 20, gy, cx + d * 24, gy, '#c8d8e8'); }
    o.px('#8a9ab0', cx - 26, gy - 1, 52, 1.5);
    for (let a = 0; a < 6.283; a += 0.01) { const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R; o.px('#dce8f8', x, y, 0.8, 0.8); const x2 = cx + Math.cos(a) * (R - 2.4), y2 = cy + Math.sin(a) * (R - 2.4); o.px('#8aa0c0', x2, y2, 0.5, 0.5); }
    for (let k = 0; k < 40; k++) { const a = k / 40 * 6.283; line(cx, cy, cx + Math.cos(a) * (R - 2.4), cy + Math.sin(a) * (R - 2.4), 'rgba(200,220,255,.6)'); }
    for (let k = 0; k < 32; k++) { const a = k / 32 * 6.283 + 0.05, x = cx + Math.cos(a) * (R + 1.4), y = cy + Math.sin(a) * (R + 1.4); o.x.fillStyle = '#e8f4ff'; o.x.beginPath(); o.x.ellipse(x, y, 2, 1.6, a, 0, 6.28); o.x.fill(); o.px('#6aa8ff', x - 0.5, y - 0.5, 1, 1); }
    o.x.fillStyle = '#e8f0ff'; o.x.beginPath(); o.x.arc(cx, cy, 2.6, 0, 6.28); o.x.fill(); o.px('#7a8aa0', cx - 0.5, cy - 0.5, 1, 1);
    o.meta.glows.push({ x: cx, y: cy, r: 48, col: '#9ac8ff', a: 0.09 }); } };

  M.riesenrad = { w: 92, h: 96, lift: 6, draw(o) {
    const { gy, line } = o, cx = 46, cy = gy - 50, R = 40;
    for (const d of [-1, 1]) { line(cx + d * 1.2, cy, cx + d * 16, gy, '#7a4a30'); line(cx + d * 2.6, cy, cx + d * 19, gy, '#4a2c1c'); } for (let k = 0; k < 6; k++) { const y = cy + k * (gy - cy) / 6.5; line(cx - 2 - k * 2.2, y, cx + 2 + k * 2.2, y, '#5a3a24'); }
    for (let a = 0; a < 6.283; a += 0.012) { o.px('#c8905a', cx + Math.cos(a) * R, cy + Math.sin(a) * R, 0.8, 0.8); o.px('#7a4a30', cx + Math.cos(a) * (R - 1.6), cy + Math.sin(a) * (R - 1.6), 0.5, 0.5); }
    for (let k = 0; k < 30; k++) { const a = k / 30 * 6.283; line(cx, cy, cx + Math.cos(a) * R, cy + Math.sin(a) * R, 'rgba(210,150,100,.65)'); }
    for (let k = 0; k < 15; k++) { const a = k / 15 * 6.283 + 0.1, x = cx + Math.cos(a) * (R + 2.4), y = cy + Math.sin(a) * (R + 2.4); o.px('#8a2418', x - 1.6, y - 1.6, 3.2, 3.2); o.px('#ffd98a', x - 0.8, y - 0.8, 1.6, 1.4); o.px('#3a1008', x - 1.6, y + 1.2, 3.2, 0.5); }
    o.x.fillStyle = '#c8905a'; o.x.beginPath(); o.x.arc(cx, cy, 2.6, 0, 6.28); o.x.fill();
    o.meta.glows.push({ x: cx, y: cy, r: 46, col: '#ffb868', a: 0.1 }); } };

  // ---------------------------------------------------------------- Stoccolma
  M.stadshuset = { w: 42, h: 112, lift: 22, draw(o) {
    const { gy, w } = o, B = '#a86a4a', cx = w / 2;
    ash(o, 4, gy - 38, w - 8, 38, B, 2.5); for (let k = 0; k < 5; k++) { arch(o, 7 + k * 6.4, gy - 20, 3.6, 12, '#2a1810'); o.px('#ffcf7a', 7.5 + k * 6.4, gy - 13, 2.6, 4); } for (let k = 0; k < 6; k++) o.px(sh(B, 0.25), 6 + k * 6.4, gy - 20, 0.5, 14);
    ash(o, cx - 9, gy - 92, 18, 56, sh(B, 0.02), 2.5); for (let q = 0; q < 4; q++) { arch(o, cx - 3.2, gy - 84 + q * 12, 6.4, 8, '#2a1810'); o.px(q % 2 ? '#ffcf7a' : '#c8904a', cx - 2.4, gy - 80 + q * 12, 4.8, 4); }
    ash(o, cx - 11, gy - 100, 22, 9, sh(B, 0.06), 2.5); for (let k = 0; k < 4; k++) { arch(o, cx - 9 + k * 5, gy - 99, 3, 7, '#2a1810'); o.px('#ffcf7a', cx - 8.5 + k * 5, gy - 95, 2, 3); } cornice(o, cx - 11, gy - 101, 22, B);
    ash(o, cx - 6, gy - 112, 12, 12, sh(B, 0.04), 2.5); for (let j = 0; j < 14; j++) { const hh = 5.5 * (1 - j / 14); o.px(j % 3 ? '#4a8a7a' : '#6aa89a', cx - hh, gy - 113 - j, hh * 2, 1); } o.px('#4a8a7a', cx - 0.5, gy - 134 + 8, 1, 8);
    for (let k = -1; k <= 1; k++) { o.px('#e8c040', cx + k * 2.2 - 1, gy - 126, 2, 1.5); o.px('#e8c040', cx + k * 2.2 - 0.5, gy - 127.5, 1, 1.5); } o.px('#e8c040', cx - 3.5, gy - 125, 7, 0.5);
    flood(o, 4, gy - 100, w - 8, 100, FL, 0.3); o.meta.glows.push({ x: cx, y: gy - 70, r: 26, ry: 1, col: FL, a: 0.09 }); o.meta.beacons.push({ x: cx, y: gy - 128 }); } };
  M.stadshuset.h = 112;

  M.ironspire = { w: 24, h: 120, lift: 0, draw(o) {
    const { gy, w, line } = o, cx = w / 2, I = '#3a3848';
    ash(o, 3, gy - 34, w - 6, 34, '#8a6a58', 2.5); for (let k = 0; k < 2; k++) { parch(o, 5 + k * 8, gy - 28, 4, 14, '#1a1220'); o.px('#ffcf7a', 5.8 + k * 8, gy - 20, 2.4, 6); } cornice(o, 3, gy - 35, w - 6, '#8a6a58');
    for (let y = gy - 35; y > gy - 118; y -= 0.5) { const t = (gy - 35 - y) / 83, h = Math.max(0.6, 8 * Math.pow(1 - t, 1.2)); o.px(I, cx - h, y, 0.8, 0.5); o.px(I, cx + h - 0.8, y, 0.8, 0.5); }
    for (let y = gy - 38; y > gy - 112; y -= 5) { const t = (gy - 35 - y) / 83, h = Math.max(0.6, 8 * Math.pow(1 - t, 1.2)), t2 = (gy - 35 - y + 5) / 83, h2 = Math.max(0.6, 8 * Math.pow(1 - t2, 1.2)); line(cx - h, y, cx + h2, y - 5, '#5a566a'); line(cx + h, y, cx - h2, y - 5, '#5a566a'); o.px(I, cx - h, y, h * 2, 0.5); }
    for (const dy of [-60, -86]) for (const dx of [-3, 3]) { o.px(I, cx + dx - 0.5, gy + dy, 1, 3); }
    o.px(I, cx - 0.25, gy - 128 + 10, 0.5, 12); o.px('#e8c040', cx - 1, gy - 119, 2, 1.5); flood(o, 3, gy - 70, w - 6, 70, FL, 0.22); o.meta.beacons.push({ x: cx, y: gy - 122 }); } };

  // ---------------------------------------------------------------- Berlino
  M.fernsehturm = { w: 46, h: 158, lift: 0, draw(o) {
    const { gy, w } = o, cx = w / 2, C = '#a29cb4';
    for (let y = gy; y > gy - 96; y -= 0.5) { const hw = y > gy - 30 ? 5.2 - (gy - y) / 8 : 1.7 + (y > gy - 60 ? 0.4 : 0); o.px(C, cx - hw, y, hw * 2, 0.5); o.px(sh(C, 0.3), cx - hw, y, 0.6, 0.5); o.px(sh(C, -0.35), cx + hw - 0.7, y, 0.7, 0.5); }
    for (let k = 0; k < 6; k++) o.px(sh(C, -0.25), cx - 2, gy - 12 - k * 13, 4, 0.5);
    o.px(sh(C, -0.1), cx - 9, gy - 1, 18, 1.5); o.px(sh(C, 0.2), cx - 7, gy - 3.5, 14, 2.5);
    const by = gy - 110, R = 13.5; for (let dy = -R; dy <= R; dy += 0.5) { const ww = Math.sqrt(R * R - dy * dy), t = (dy + R) / (2 * R); o.px(t < 0.32 ? '#fff0c0' : t < 0.7 ? '#e8d4a0' : '#a89870', cx - ww, by + dy, ww * 2, 0.5); o.px('#fffbe8', cx - ww, by + dy, ww * 0.25, 0.5); o.px('#6a5a3a', cx + ww * 0.55, by + dy, ww * 0.45, 0.5); }
    for (let a = -R + 2; a < R - 1; a += 2.4) for (let b = -R + 2; b < R - 1; b += 2.4) if (Math.hypot(a, b) < R - 1.2) { o.px('#8a7a54', cx + a, by + b, 1, 1); o.px('#fff8d8', cx + a, by + b, 0.5, 0.5); }
    o.px('#4a4a5a', cx - 7, by + 10, 14, 4); for (let k = 0; k < 7; k++) o.px('#ffcf7a', cx - 6 + k * 2, by + 11, 1, 2);
    for (let y = by - 12; y > by - 50; y -= 0.5) { o.px(((Math.floor(y / 4) % 2) ? '#d8d8e0' : '#c4241c'), cx - 0.5, y, 1, 0.5); } o.px(C, cx - 2, by - 12, 4, 6); o.px('#d8d8e0', cx - 0.5, by - 52, 0.5, 6);
    flood(o, cx - 8, gy - 60, 16, 60, '#c8b8f0', 0.25); o.meta.glows.push({ x: cx, y: by, r: 26, col: '#ffd98a', a: 0.18 }); o.meta.beacons.push({ x: cx, y: by - 52 }); } };

  M.brandenburg = { w: 96, h: 84, lift: 60, draw(o) {
    const { gy, w } = o, B = '#cfc2a2', cx = w / 2;
    for (let s = 0; s < 4; s++) o.px(sh(B, 0.1 - s * 0.05), 3 - s, gy - 3 + s * 0.8, w - 6 + s * 2, 1);
    for (let k = 0; k < 12; k++) col(o, 8 + k * 6.6 + (k >= 6 ? 0 : 0), gy - 36, 32, 4, k % 2 ? sh(B, 0.02) : B);
    ash(o, 6, gy - 42, w - 12, 7, sh(B, 0.02), 3); for (let k = 0; k < 24; k++) { o.px(sh(B, -0.3), 8 + k * 3.5, gy - 41, 1, 5); o.px(sh(B, 0.2), 9 + k * 3.5, gy - 41, 1.5, 5); } cornice(o, 6, gy - 43, w - 12, B);
    ash(o, 14, gy - 52, w - 28, 9, B, 3); for (let k = 0; k < 6; k++) { o.px(sh(B, 0.2), 18 + k * 11, gy - 49, 5, 4); o.px(sh(B, -0.35), 18 + k * 11, gy - 49, 5, 0.5); } cornice(o, 14, gy - 53, w - 28, B);
    o.px(sh(B, -0.3), cx - 14, gy - 60, 28, 7);
    for (let h = 0; h < 4; h++) { const hx = cx - 13 + h * 7; o.px('#7a5a30', hx, gy - 66, 4, 7); o.px('#a8803a', hx + 3, gy - 70, 2, 5); o.px('#a8803a', hx + 4, gy - 71, 2, 2); o.px('#d8b050', hx, gy - 66, 0.5, 7); }   // i cavalli della quadriga
    o.px('#7a5a30', cx - 14, gy - 62, 28, 2); o.px('#d8b050', cx - 14, gy - 62, 28, 0.5); o.px('#a8803a', cx - 2, gy - 76, 4, 9); o.px('#d8b050', cx - 1, gy - 76, 1, 9); o.px('#a8803a', cx + 1, gy - 82, 0.8, 8); o.px('#c8d870', cx + 1.8, gy - 82, 4, 3);
    for (const dx of [-1, 0, 1, 2, 3]) o.px('#1a1220', cx - 18 + dx * 9, gy - 5, 0.5, 0.5);
    flood(o, 3, gy - 60, w - 6, 60, FL, 0.4); o.meta.glows.push({ x: cx, y: gy - 26, r: 50, ry: 0.5, col: FL, a: 0.12 }); } };

  M.berlindom = { w: 76, h: 66, lift: 36, draw(o) {
    const { gy, w } = o, B = '#c4b496', GR = '#4a9a86', cx = w / 2;
    ash(o, 6, gy - 28, w - 12, 28, B, 3); cornice(o, 6, gy - 29, w - 12, B); for (let k = 0; k < 7; k++) { col(o, 9 + k * 8.5, gy - 24, 18, 2.6, B); win(o, 12.5 + k * 8.5 - 3.5, gy - 22, 2.6, 7, k % 3 !== 1, false); }
    o.px(sh(B, -0.2), 4, gy - 32, w - 8, 3); for (let k = 0; k < 20; k++) o.px(sh(B, -0.4), 6 + k * 3.4, gy - 35, 1, 3);
    ash(o, cx - 17, gy - 48, 34, 19, sh(B, 0.02), 3); for (let k = 0; k < 8; k++) { col(o, cx - 16 + k * 4.2, gy - 46, 14, 1.8, B); } for (let k = 0; k < 7; k++) win(o, cx - 14 + k * 4.2, gy - 45, 1.6, 5, true, false); cornice(o, cx - 17, gy - 49, 34, B);
    dome(o, cx, gy - 49, 16, 22, GR, 16); o.px(sh(GR, -0.3), cx - 4, gy - 73, 8, 3); dome(o, cx, gy - 73, 3.4, 4.5, GR, 4); o.px('#c9a84a', cx - 0.5, gy - 82, 1, 5); o.px('#c9a84a', cx - 2, gy - 80, 4, 1);
    for (const tx of [3, w - 12]) { ash(o, tx, gy - 52, 9, 24, sh(B, 0.02), 3); win(o, tx + 3, gy - 46, 3, 8, true, false); for (let j = 0; j < 8; j++) o.px(j % 3 ? GR : sh(GR, 0.25), tx + 0.5 + j * 0.25, gy - 53 - j, 8 - j * 0.5, 1); o.px('#c9a84a', tx + 4.2, gy - 68, 0.6, 3); }
    flood(o, 3, gy - 80, w - 6, 80, FL, 0.3); o.meta.glows.push({ x: cx, y: gy - 36, r: 38, col: FL, a: 0.11 }); o.meta.beacons.push({ x: cx, y: gy - 82 }); } };

  // ---------------------------------------------------------------- Praga
  M.tyn = { w: 70, h: 124, lift: 26, draw(o) {
    const { gy, w, line } = o, B = '#7a7468';
    ash(o, 6, gy - 54, w - 12, 54, B, 3); for (let k = 0; k < 6; k++) { parch(o, 9 + k * 9.3, gy - 36, 4, 14, '#1a1620'); if (k % 2 === 0) o.px('#ffcf7a', 10 + k * 9.3, gy - 28, 2, 6); } cornice(o, 6, gy - 55, w - 12, B);
    for (let j = 0; j < 14; j++) { const hw = (w - 28) / 2 * (1 - j / 14) + 1; o.px(sh(B, -0.05 + j * 0.01), w / 2 - hw, gy - 56 - j, hw * 2, 1); } for (let k = 0; k < 4; k++) parch(o, w / 2 - 6 + k * 3.2, gy - 66, 1.8, 7, '#1a1620');
    [[20, 0], [w - 20, 1]].forEach(([cx, i]) => { const top = i ? gy - 108 : gy - 118;
      ash(o, cx - 9, gy - 84, 18, 30, B, 3); parch(o, cx - 2, gy - 78, 4, 14, '#1a1620'); o.px('#ffcf7a', cx - 1, gy - 70, 2, 5); parch(o, cx - 2, gy - 60, 4, 6, '#1a1620');
      cornice(o, cx - 9, gy - 85, 18, B); for (let j = 0; j < 38; j++) { const hh = 9 * (1 - j / 38); o.px(j % 3 ? '#4a4660' : '#6a6684', cx - hh, gy - 85 - j, hh * 2, 1); o.px('#8a86a4', cx - hh, gy - 85 - j, 0.6, 1); }
      for (const tx of [-10, 8]) { ash(o, cx + tx, gy - 96, 2.5, 12, sh(B, -0.05), 2); for (let j = 0; j < 7; j++) o.px('#4a4660', cx + tx + 0.2 + j * 0.15, gy - 97 - j, 2 - j * 0.25, 1); }
      o.px('#c9a84a', cx - 0.5, top + 22 - 0, 1, 4); o.meta.beacons.push({ x: cx, y: top + 24 }); });
    flood(o, 6, gy - 100, w - 12, 100, FL, 0.28); o.meta.glows.push({ x: w / 2, y: gy - 56, r: 38, col: FL, a: 0.1 }); } };

  M.vito = { w: 92, h: 118, lift: 30, draw(o) {
    const { gy, w, line } = o, B = '#9a9078';
    ash(o, 0, gy - 26, w, 26, '#c4a878', 3); for (let k = 0; k < 15; k++) { win(o, 3 + k * 6, gy - 20, 2.6, 7, k % 3 !== 0, false); o.px(sh('#c4a878', 0.2), 5.8 + k * 6, gy - 22, 0.5, 18); } cornice(o, 0, gy - 27, w, '#c4a878');
    ash(o, 28, gy - 70, 32, 44, B, 3); for (let k = 0; k < 3; k++) { parch(o, 31 + k * 9.3, gy - 56, 5, 22, '#1a1620'); o.px('#ffcf7a', 32.5 + k * 9.3, gy - 40, 2.2, 10); for (let q = 0; q < 4; q++) line(31 + k * 9.3 + 0.5, gy - 54 + q * 4, 36 + k * 9.3 - 0.5, gy - 54 + q * 4, 'rgba(60,50,40,.5)'); }
    const rx = 44, ry = gy - 62; for (let r2 = 6; r2 > 0; r2 -= 0.5) { o.x.fillStyle = r2 > 5.2 ? '#1a1620' : ((Math.floor(r2) % 2) ? '#e8b868' : '#ffd98a'); o.x.beginPath(); o.x.arc(rx, ry, r2, 0, 6.28); o.x.fill(); } for (let k = 0; k < 10; k++) { const a = k / 10 * 6.28; line(rx, ry, rx + Math.cos(a) * 5, ry + Math.sin(a) * 5, '#6a4a2a'); }
    cornice(o, 28, gy - 71, 32, B); for (let k = 0; k < 8; k++) { o.px(sh(B, -0.1), 29 + k * 4, gy - 76, 2, 5); for (let j = 0; j < 4; j++) o.px('#5a5668', 29.4 + k * 4 + j * 0.2, gy - 76 - j * 0.9, 1.2, 1); }
    ash(o, 54, gy - 100, 10, 30, sh(B, 0.02), 3); parch(o, 56.5, gy - 94, 5, 14, '#1a1620'); o.px('#ffcf7a', 57.5, gy - 88, 2.5, 6); for (let j = 0; j < 36; j++) { const hh = 5 * (1 - j / 36); o.px(j % 3 ? '#4a4660' : '#6a6684', 59 - hh, gy - 101 - j, hh * 2, 1); } o.px('#c9a84a', 58.6, gy - 140 + 26, 0.8, 4);
    for (const bx of [24, 62]) { line(bx, gy - 58, bx + (bx < 40 ? -6 : 6), gy - 28, '#7a7058'); line(bx + 1, gy - 58, bx + (bx < 40 ? -5 : 7), gy - 28, '#7a7058'); }
    flood(o, 0, gy - 100, w, 100, FL, 0.3); o.meta.glows.push({ x: 46, y: gy - 56, r: 36, col: FL, a: 0.1 }); o.meta.beacons.push({ x: 59, y: gy - 112 }); } };

  // ---------------------------------------------------------------- Vienna
  M.stephansdom = { w: 76, h: 124, lift: 20, draw(o) {
    const { gy, w, line } = o, B = '#8a8276';
    ash(o, 22, gy - 46, 52, 46, B, 3); for (let k = 0; k < 6; k++) { parch(o, 25 + k * 8, gy - 38, 4, 18, '#1a1620'); if (k % 2) o.px('#ffcf7a', 26 + k * 8, gy - 30, 2, 8); } cornice(o, 22, gy - 47, 52, B);
    for (let j = 0; j < 38; j++) { const t = j / 38, inset = t * 6; for (let xx = 22 + inset; xx < 74 - inset; xx += 0.5) { const a = Math.floor((xx - 22) / 3) % 2, b = Math.floor(j / 3) % 2, c = (a + b) % 2; o.px(c ? '#a8742a' : (Math.floor(j / 3) % 3 === 0 ? '#2a2a50' : '#3a6a5a'), xx, gy - 48 - j, 0.5, 1); } }
    o.px('#4a4660', 22, gy - 48, 52, 0.5); for (let j = 0; j < 38; j++) { const inset = j / 38 * 6; o.px('#2a2038', 22 + inset - 0.5, gy - 48 - j, 0.5, 1); o.px('#2a2038', 74 - inset, gy - 48 - j, 0.5, 1); }
    ash(o, 4, gy - 90, 16, 90, B, 3); for (let r = 0; r < 4; r++) { parch(o, 8, gy - 82 + r * 17, 4, 12, '#1a1620'); if (r % 2 === 0) o.px('#ffcf7a', 9, gy - 76 + r * 17, 2, 5); }
    for (let j = 0; j < 50; j++) { const t = j / 50, hh = 8 * (1 - t) + 0.4; o.px(j % 3 ? '#5a5668' : '#7a7690', 12 - hh, gy - 91 - j, hh * 2, 1); if (j % 6 === 0) { o.px('#9a96b0', 12 - hh - 1, gy - 91 - j, 1, 1); o.px('#9a96b0', 12 + hh, gy - 91 - j, 1, 1); } }
    o.px('#c9a84a', 11.4, gy - 146 + 4, 1.2, 8); cornice(o, 4, gy - 91, 16, B);
    flood(o, 4, gy - 100, w - 8, 100, FL, 0.3); o.meta.glows.push({ x: 40, y: gy - 50, r: 38, col: FL, a: 0.1 }); o.meta.beacons.push({ x: 12, y: gy - 142 }); } };

  M.karlskirche = { w: 96, h: 70, lift: 30, draw(o) {
    const { gy, w, line } = o, B = '#c4b696', GR = '#4a9a78', cx = w / 2;
    ash(o, 18, gy - 34, w - 36, 34, B, 3); cornice(o, 18, gy - 35, w - 36, B); for (let k = 0; k < 6; k++) col(o, 26 + k * 8, gy - 30, 26, 3.2, sh(B, 0.03)); o.px(sh(B, -0.3), 26, gy - 34, 44, 4);
    pedi(o, 22, gy - 47, w - 44, 12, B); o.px(sh(B, -0.4), 30, gy - 43, 36, 6); for (let k = 0; k < 7; k++) o.px(sh(B, 0.2), 33 + k * 5, gy - 42, 2, 4);
    ash(o, cx - 14, gy - 54, 28, 20, sh(B, -0.04), 3); for (let k = 0; k < 6; k++) { win(o, cx - 12 + k * 4.4, gy - 52, 2.4, 8, true, false); } cornice(o, cx - 14, gy - 55, 28, B);
    dome(o, cx, gy - 55, 14, 20, GR, 16); o.px(sh(GR, -0.3), cx - 4, gy - 75, 8, 3); dome(o, cx, gy - 75, 3.4, 4, GR, 4); o.px('#c9a84a', cx - 0.5, gy - 83, 1, 4);
    for (const tx of [4, w - 12]) { ash(o, tx, gy - 62, 8, 62, B, 2.5); for (let k = 0; k < 14; k++) { o.px(sh(B, k % 2 ? 0.28 : -0.3), tx + 1.5 + (k % 2) * 3, gy - 56 + k * 4, 3, 1.4); } o.px(sh(B, -0.2), tx - 1, gy - 64, 10, 3); o.px(sh(B, 0.3), tx - 1, gy - 64, 10, 0.5); for (let j = 0; j < 7; j++) o.px(j % 2 ? GR : sh(GR, 0.2), tx + 0.5 + j * 0.2, gy - 65 - j, 7 - j * 0.4, 1); o.px('#c9a84a', tx + 3.7, gy - 76, 0.6, 3); }
    for (let s = 0; s < 3; s++) o.px(sh(B, 0.1 - s * 0.05), 14 - s, gy - 2 + s * 0.7, w - 28 + s * 2, 1);
    flood(o, 4, gy - 76, w - 8, 76, FL, 0.34); o.meta.glows.push({ x: cx, y: gy - 36, r: 46, col: FL, a: 0.1 }); o.meta.beacons.push({ x: cx, y: gy - 84 }); } };

  // ---------------------------------------------------------------- Madrid
  M.metropolis = { w: 46, h: 96, lift: 30, draw(o) {
    const { gy, w } = o, B = '#d0c4aa', cx = w / 2;
    ash(o, 4, gy - 42, w - 8, 42, B, 3); for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) win(o, 7 + k * 8.5, gy - 38 + r * 9, 3.4, 6, (k + r * 2) % 3 !== 1, false); for (let k = 0; k < 4; k++) o.px(sh(B, -0.2), 5.5 + k * 8.5, gy - 40, 0.5, 38);
    cornice(o, 4, gy - 43, w - 8, B); ash(o, 9, gy - 64, w - 18, 22, sh(B, 0.04), 3); for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) win(o, 12 + k * 7.5, gy - 60 + r * 9.5, 3.2, 6, true, false); cornice(o, 9, gy - 65, w - 18, B);
    ash(o, 14, gy - 78, w - 28, 13, B, 3); win(o, cx - 2, gy - 75, 4, 8, true, false); for (const dx of [-8, 6]) col(o, cx + dx, gy - 76, 9, 2, B); cornice(o, 14, gy - 79, w - 28, B);
    dome(o, cx, gy - 79, 8, 10, '#3a4262', 8); for (let k = 0; k < 6; k++) o.px('#6a7aa8', cx - 6 + k * 2.4, gy - 82 - (k % 3), 0.5, 2); o.px('#c9a84a', cx - 1.4, gy - 96, 3, 8); o.px('#e8c870', cx - 3.5, gy - 92, 7, 1.5); o.px('#e8c870', cx - 0.5, gy - 99, 1, 5); o.px('#e8c870', cx - 2, gy - 98, 4, 0.5);
    flood(o, 4, gy - 80, w - 8, 80, FL, 0.3); o.meta.glows.push({ x: cx, y: gy - 50, r: 30, col: FL, a: 0.1 }); o.meta.beacons.push({ x: cx, y: gy - 100 }); } };

  M.toro = { w: 62, h: 40, lift: 58, draw(o) {
    // il toro nero di Osborne: sagoma col garrese alto, testa bassa con le corna, quattro zampe e la coda
    const { gy, x } = o, K = '#08080e', Y = gy - 38, O = 3;
    const poly = (P, c) => { x.fillStyle = c; x.beginPath(); P.forEach(([a, b], i) => { if (i) x.lineTo(a + O, Y + b); else x.moveTo(a + O, Y + b); }); x.closePath(); x.fill(); };
    poly([[2, 17], [5, 14.5], [6.5, 11], [9, 9], [14, 6.5], [20, 3], [26, 2.5], [32, 5.5], [40, 8], [46, 9], [48, 11], [49, 13], [51, 13.5], [52, 22], [50.6, 22], [50, 15], [48.5, 16], [47, 21], [46, 26], [46.5, 38], [43, 38], [43, 28], [40, 25], [34, 25.5], [29, 26], [28.5, 38], [25, 38], [24.5, 28], [20, 25.5], [15, 23], [11, 23], [8.5, 22.5], [6, 21], [3, 19]], K);
    poly([[8, 9], [5.5, 5], [6, 1.5], [8, 4.5], [9.5, 8.5]], K); poly([[10.5, 8], [10, 4.5], [11.5, 2.5], [12.5, 6], [12, 8.5]], '#12121c');
    poly([[43.5, 27], [41, 38], [38.5, 38], [39.5, 27]], '#12121c');                                         // l'altra zampa, appena più chiara
    for (let k = 0; k < 24; k++) o.px('#1c1c2c', 14 + k, Y + 3.2 + Math.sin(k / 24 * 3.14) * -2.4 + k * 0.17, 1, 0.5);   // riflesso sulla schiena
    o.px('#e8c870', 6 + O, Y + 13, 0.5, 0.5);
    o.meta.glows.push({ x: 30, y: gy - 20, r: 30, col: '#ffb060', a: 0.07 }); } };

  // ---------------------------------------------------------------- Lisbona
  M.santajusta = { w: 34, h: 104, lift: 24, draw(o) {
    const { gy, w, line } = o, I = '#4a3a30', cx = w / 2;
    for (const dx of [-9, 8]) { o.px(I, cx + dx, gy - 84, 1.4, 84); o.px('#7a6048', cx + dx, gy - 84, 0.5, 84); }
    for (let y = gy - 3; y > gy - 82; y -= 7) { line(cx - 9, y, cx + 9, y - 7, '#6a5240'); line(cx + 9, y, cx - 9, y - 7, '#6a5240'); o.px(I, cx - 9, y, 19, 0.5); arch(o, cx - 6, y - 6, 12, 5.5, 'rgba(0,0,0,0)'); }
    for (let y = gy - 8; y > gy - 80; y -= 14) { for (let k = 0; k < 4; k++) { parch(o, cx - 7.5 + k * 4, y - 6, 3, 6, 'rgba(90,70,50,.35)'); } }
    o.px(I, cx - 12, gy - 96, 25, 4); o.px('#c8905a', cx - 12, gy - 96, 25, 0.5); for (let k = -11; k < 12; k += 2) { o.px(I, cx + k, gy - 100, 0.5, 4); } o.px(I, cx - 12, gy - 100, 25, 0.5);
    ash(o, cx - 7, gy - 112, 15, 12, '#6a5240', 2.5); for (let k = 0; k < 3; k++) { parch(o, cx - 5.5 + k * 4, gy - 110, 2.4, 8, '#1a1220'); o.px('#ffcf7a', cx - 5 + k * 4, gy - 106, 1.4, 4); } for (let j = 0; j < 12; j++) o.px(j % 2 ? '#4a3a30' : '#8a6a50', cx - 6 + j * 0.45, gy - 113 - j, 14 - j * 0.9, 1); o.px('#c9a84a', cx - 0.4, gy - 128 + 10, 0.8, 5);
    o.px('#c88a4a', cx - 3.5, gy - 66, 7, 9); o.px('#ffcf7a', cx - 2.5, gy - 64, 5, 5);
    flood(o, 4, gy - 80, w - 8, 80, FL, 0.3); o.meta.glows.push({ x: cx, y: gy - 70, r: 22, col: FL, a: 0.1 }); o.meta.beacons.push({ x: cx, y: gy - 116 }); } };
  M.santajusta.h = 104;

  M.belem = { w: 64, h: 44, lift: 26, draw(o) {
    const { gy, w, line } = o, B = '#d8c8a4';
    ash(o, 6, gy - 12, w - 12, 12, sh(B, -0.1), 3); for (let k = 0; k < 8; k++) { o.px('#1a1620', 9 + k * 6.4, gy - 8, 2.4, 3); o.px(sh(B, 0.2), 9 + k * 6.4, gy - 12, 3, 0.5); } for (let k = 0; k < 15; k++) o.px(sh(B, 0.1), 7 + k * 3.7, gy - 14, 2, 2);
    ash(o, 18, gy - 42, 28, 30, B, 3); for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) { arch(o, 20.5 + k * 8, gy - 37 + r * 12, 4.4, 9, '#1a1620'); if ((k + r) % 2 === 0) o.px('#ffcf7a', 21 + k * 8, gy - 33 + r * 12, 3.4, 4); } o.px(sh(B, 0.3), 18, gy - 26, 28, 0.5); o.px(sh(B, -0.3), 18, gy - 25.5, 28, 0.5);
    for (let k = 0; k < 7; k++) { o.px(sh(B, 0.1), 18 + k * 4.3, gy - 45, 2.4, 3.5); o.px('#9a6a4a', 18.6 + k * 4.3, gy - 44, 1.2, 1.5); }
    for (const tx of [13, 46]) { ash(o, tx, gy - 50, 6, 16, sh(B, 0.04), 3); for (let j = 0; j < 7; j++) o.px(j % 2 ? '#a8a090' : sh(B, 0.2), tx + 0.2 + j * 0.3, gy - 51 - j, 5.6 - j * 0.6, 1); o.px('#c9a84a', tx + 2.7, gy - 61, 0.6, 3); }
    flood(o, 6, gy - 50, w - 12, 50, FL, 0.36); o.meta.glows.push({ x: w / 2, y: gy - 24, r: 32, col: FL, a: 0.12 }); } };

  M.castelo = { w: 96, h: 58, lift: 40, draw(o) {
    const { gy, w, line } = o, B = '#b8a07a';
    for (let xx = 0; xx < w; xx += 0.5) { const hh = 12 + 10 * Math.sin(xx / w * Math.PI) + ((xx * 11) % 4) * 0.4; o.px('#4a3a30', xx, gy - hh, 0.5, hh); } for (let k = 0; k < 60; k++) o.px(k % 3 ? '#5a4a3c' : '#3a2c24', (k * 17) % w, gy - 4 - (k * 7) % 14, 3, 1);
    ash(o, 8, gy - 38, w - 16, 26, B, 3); for (let k = 0; k < 20; k++) { o.px(B, 8 + k * 4.4, gy - 42, 2.4, 4); o.px(sh(B, 0.3), 8 + k * 4.4, gy - 42, 2.4, 0.5); o.px(sh(B, -0.3), 10.4 + k * 4.4, gy - 42, 0.5, 4); } for (let k = 0; k < 6; k++) win(o, 14 + k * 12, gy - 30, 2.4, 6, k % 2 === 0, false);
    for (const tx of [4, 40, w - 20]) { ash(o, tx, gy - 54, 14, 40, sh(B, 0.02), 3); for (let k = 0; k < 4; k++) { o.px(sh(B, 0.04), tx + k * 3.7, gy - 58, 2.2, 4); o.px(sh(B, 0.3), tx + k * 3.7, gy - 58, 2.2, 0.5); } cornice(o, tx - 0.5, gy - 54.5, 15, B); win(o, tx + 5, gy - 46, 3.6, 9, true, false); o.px('#c4241c', tx + 7, gy - 70 + 12, 0.6, 5); o.px('#f4f1e6', tx + 7.5, gy - 58, 3, 2); }
    flood(o, 4, gy - 60, w - 8, 60, FL, 0.34); o.meta.glows.push({ x: w / 2, y: gy - 30, r: 44, ry: 0.5, col: FL, a: 0.11 }); } };

  // ---------------------------------------------------------------- Atene
  M.partenone = { w: 112, h: 74, lift: 44, draw(o) {
    const { gy, w } = o, B = '#d8c498', rock = '#3a2c34';
    for (let xx = 0; xx < w; xx += 0.5) { const t = xx / w, hh = 12 + 11 * Math.sin(Math.min(1, t * 1.15) * Math.PI) + (t < 0.1 ? -6 : 0) + ((xx * 13) % 3) * 0.5; o.px(rock, xx, gy - hh, 0.5, hh); } for (let k = 0; k < 90; k++) o.px(k % 3 ? '#4a3c44' : '#2a2028', (k * 13) % w, gy - 3 - (k * 7) % 20, 3, 0.5 + (k % 2));
    const bx = 12, bw = 88, by = gy - 19;
    for (let s = 0; s < 3; s++) { o.px(sh(B, 0.06 - s * 0.05), bx - 3 + s, by + s * 1, bw + 6 - s * 2, 1); } o.px(sh(B, -0.25), bx - 3, by + 3, bw + 6, 0.5);
    for (let k = 0; k < 17; k++) { const hh = 24 - (k > 14 ? 1 : 0); col(o, bx + k * 5.2, by - 24, 24, 3, k % 2 ? sh(B, 0.02) : B); }
    ash(o, bx - 2, by - 30, bw + 4, 6, B, 3); for (let k = 0; k < 20; k++) { o.px(sh(B, -0.3), bx - 1 + k * 4.5, by - 29, 1.2, 4); o.px(sh(B, 0.2), bx - 1 + k * 4.5 + 1.4, by - 29, 2, 4); }
    pedi(o, bx - 3, by - 40, bw + 6, 10, B); o.px(sh(B, -0.4), bx + 8, by - 36, bw - 16, 5); for (let k = 0; k < 10; k++) { o.px(sh(B, 0.1), bx + 14 + k * 6, by - 35, 2.4, 3.5); }
    for (let q = 0; q < 6; q++) o.px(rgba('#0a0a14', 0.5), bx + 12 + q * 13, by - 30, 0.5, 4);
    flood(o, 4, gy - 70, w - 8, 70, FL, 0.45); o.meta.glows.push({ x: w / 2, y: gy - 36, r: 58, ry: 0.5, col: FL, a: 0.14 }); } };

  // ---------------------------------------------------------------- Washington
  M.campidoglio = { w: 112, h: 80, lift: 44, draw(o) {
    const { gy, w } = o, W1 = '#e0ddd2', cx = w / 2;
    ash(o, 2, gy - 24, w - 4, 24, W1, 3); cornice(o, 2, gy - 25, w - 4, W1); for (let r = 0; r < 2; r++) for (let k = 0; k < 18; k++) { if (k > 7 && k < 11) continue; win(o, 6 + k * 5.6, gy - 20 + r * 9, 2.6, 6, (k + r) % 3 !== 1, false); }
    pedi(o, 6, gy - 34, 22, 8, W1); pedi(o, w - 28, gy - 34, 22, 8, W1); ash(o, 6, gy - 26, 22, 3, W1, 3);
    ash(o, cx - 20, gy - 36, 40, 12, sh(W1, 0.02), 3); for (let k = 0; k < 8; k++) col(o, cx - 19 + k * 5, gy - 32, 9, 2.2, W1); pedi(o, cx - 21, gy - 44, 42, 8, W1);
    ash(o, cx - 14, gy - 56, 28, 12, sh(W1, 0.02), 3); for (let k = 0; k < 10; k++) { col(o, cx - 13 + k * 2.8, gy - 54, 9, 1.4, W1); } o.px(sh(W1, -0.3), cx - 14, gy - 45, 28, 0.5); cornice(o, cx - 15, gy - 57, 30, W1);
    ash(o, cx - 12, gy - 64, 24, 8, W1, 3); for (let k = 0; k < 8; k++) o.px(sh(W1, -0.3), cx - 11 + k * 3, gy - 63, 0.5, 6);
    dome(o, cx, gy - 64, 11.5, 14, W1, 14); for (let k = 0; k < 3; k++) o.px(sh(W1, -0.25), cx - 8 + k * 6, gy - 70 + k * 0.3, 3, 0.5);
    for (let k = 0; k < 8; k++) col(o, cx - 8 + k * 2.2, gy - 78, 5, 1.2, W1); cornice(o, cx - 10, gy - 79, 20, W1); dome(o, cx, gy - 79, 5.5, 6, W1, 6);
    o.px('#7a6a48', cx - 1, gy - 90, 2, 6); o.px('#9a8858', cx - 0.5, gy - 93, 1, 3); o.px('#c8984a', cx, gy - 95, 0.5, 2);
    for (let s = 0; s < 4; s++) o.px(sh(W1, -0.05 - s * 0.05), cx - 24 + s * 2, gy - 3 + s * 0.8, 48 - s * 4, 1);
    flood(o, 2, gy - 90, w - 4, 90, '#fff4dc', 0.4); o.meta.glows.push({ x: cx, y: gy - 50, r: 58, ry: 0.55, col: '#fff0d0', a: 0.13 }); o.meta.beacons.push({ x: cx, y: gy - 96 }); } };

  M.obelisco = { w: 22, h: 150, lift: 0, draw(o) {
    const { gy, w } = o, W1 = '#dcdad0', cx = w / 2;
    for (let y = gy - 6; y > gy - 136; y -= 0.5) { const hw = 5 - (gy - 6 - y) / 130 * 3.2; o.px(W1, cx - hw, y, hw * 2, 0.5); o.px(sh(W1, 0.18), cx - hw, y, 0.7, 0.5); o.px(sh(W1, -0.3), cx + hw - 1, y, 1, 0.5); }
    for (let y = gy - 8; y > gy - 134; y -= 3.4) { const hw = 5 - (gy - 6 - y) / 130 * 3.2; o.px(sh(W1, -0.16), cx - hw, y, hw * 2, 0.5); }
    for (let j = 0; j < 14; j++) { const hw = 1.8 * (1 - j / 14) + 0.2; o.px(j % 2 ? W1 : sh(W1, 0.12), cx - hw, gy - 137 - j, hw * 2, 1); } o.px('#c8984a', cx - 0.4, gy - 152 + 2, 0.8, 1.4);
    o.px(sh(W1, -0.1), cx - 8, gy - 6, 16, 3); o.px(sh(W1, -0.2), cx - 9, gy - 3, 18, 3); for (let k = 0; k < 8; k++) { o.px('#c4241c', cx - 7 + k * 2, gy - 12, 0.5, 6); o.px('#f4f1e6', cx - 6.5 + k * 2, gy - 12, 1, 1.5); }
    flood(o, cx - 8, gy - 90, 16, 90, '#fff4dc', 0.32); o.meta.beacons.push({ x: cx, y: gy - 150 }); o.meta.glows.push({ x: cx, y: gy - 70, r: 22, ry: 2, col: '#fff0d0', a: 0.08 }); } };

  M.lincoln = { w: 104, h: 50, lift: 40, draw(o) {
    const { gy, w } = o, W1 = '#e2dfd4', cx = w / 2;
    for (let s = 0; s < 6; s++) o.px(sh(W1, 0.08 - s * 0.05), 3 + s * 1.5, gy - 6 + s * 1, w - 6 - s * 3, 1); o.px(sh(W1, -0.2), 0, gy - 7, w, 1.5);
    ash(o, 6, gy - 11, w - 12, 5, sh(W1, -0.04), 3);
    for (let k = 0; k < 12; k++) col(o, 10 + k * 7.6, gy - 36, 25, 4, k % 2 ? sh(W1, 0.02) : W1);
    ash(o, 6, gy - 42, w - 12, 6, W1, 3); for (let k = 0; k < 20; k++) o.px(sh(W1, -0.35), 8 + k * 4.7, gy - 41, 0.8, 4); cornice(o, 6, gy - 43, w - 12, W1);
    ash(o, 10, gy - 48, w - 20, 6, sh(W1, 0.02), 3); for (let k = 0; k < 13; k++) { o.px(sh(W1, 0.2), 12 + k * 6.6, gy - 47, 3, 4); } cornice(o, 10, gy - 49, w - 20, W1);
    o.px('#3a342c', cx - 12, gy - 33, 24, 24); o.px('#ffe6a8', cx - 10, gy - 31, 20, 20); o.px('#c8a870', cx - 3, gy - 28, 6, 8); o.px('#a88858', cx - 4, gy - 20, 8, 7); o.px('#e8d4a0', cx - 2, gy - 36, 4, 2);
    flood(o, 2, gy - 48, w - 4, 48, '#fff4dc', 0.4); o.meta.glows.push({ x: cx, y: gy - 28, r: 54, ry: 0.5, col: '#fff0d0', a: 0.13 }); } };

  // sostituiscono i disegni semplici di citta_dati.js
  for (const k of Object.keys(M)) { const m = M[k]; LM[k] = { w: m.w, h: m.h, lift: m.lift || 0, hd: true, draw: m.draw }; }
  // la ruota panoramica di Londra e quella di Vienna hanno i loro disegni: nei quartieri `ferris` diventa `eye` o `riesenrad`
  const CITY = Street2D.CITY_DISTRICTS;
  for (const id in CITY) for (const d of CITY[id]) if (d.land) d.land = d.land.split('|').map((k) => k === 'ferris' ? (id === 'vienna' ? 'riesenrad' : 'eye') : k).join('|');
})();
