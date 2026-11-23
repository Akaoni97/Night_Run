// ============================================================================
//  Night Run · Monumenti e quartieri delle capitali (dopo citta2d.js, v0.112)
//  Qui stanno i dati: i monumenti lontani (`Street2D.CITY_LANDMARKS`, disegnati a codice come sagome illuminate) e i quartieri
//  di ogni capitale (`Street2D.CITY_DISTRICTS[id]`, stesso formato di `Street2D.DISTRICTS` in quartieri2d.js). Tokyo resta
//  con i suoi quartieri di sempre. Una `land` con più monumenti si scrive «a|b|c» (se ne sceglie uno a caso per tessera).
//  Per aggiungere un monumento: una voce in LM con le misure e `draw`. Per un quartiere: una voce nell'elenco della città.
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined' || !Street2D.CITY_LANDMARKS) return;
  const LM = Street2D.CITY_LANDMARKS, CITY = Street2D.CITY_DISTRICTS, sh = Street2D.shade;
  const S = Street2D.prototype, baseLand = S.landmark;
  // più monumenti in una voce sola
  S.landmark = function (kind, r, D) { if (kind.includes('|')) { const k = kind.split('|'); kind = k[Math.floor(r(42) * k.length)]; } return baseLand.call(this, kind, r, D); };

  // ---------------------------------------------------------------- monumenti
  // colori: dk silhouette scura, lt riflesso, fl luce calda dei fari che li illuminano
  const FL = '#e8c070', FL2 = '#c8984a', WH = '#e8e4d0';
  const arches = (o, x0, y0, n, aw, ah, gap, col, lit) => { for (let k = 0; k < n; k++) { const ax = x0 + k * (aw + gap); o.px(col, ax, y0 + 2, aw, ah - 2); o.px(col, ax + 1, y0 + 1, aw - 2, 1); if (lit) o.px(lit, ax + 1, y0 + 3, aw - 2, ah - 4); } };

  LM.colosseo = { lift: 70, w: 124, h: 54, draw(o) {
    // anello a tre ordini di arcate, più alto a sinistra e spezzato a destra, attico con finestrelle
    const { px, w, gy } = o, y1 = gy - 50;
    const hAt = (xx) => xx < w * 0.55 ? 50 : Math.max(26, 50 - (xx - w * 0.55) * 0.55);
    for (let xx = 2; xx < w - 2; xx++) { const hh = Math.round(hAt(xx)); px(o.dk, xx, gy - hh, 1, hh); }
    for (let t = 0; t < 3; t++) { const yy = gy - 48 + t * 15; for (let xx = 4; xx < w - 6; xx += 7) { const hh = hAt(xx); if (gy - hh > yy) continue; px('#3a2a1a', xx, yy + 3, 4, 10); px(t === 2 ? '#2a1c10' : FL2, xx + 1, yy + 4, 2, 8); px(FL, xx + 1, yy + 4, 2, 2); } px(sh(o.dk, 0.3), 2, yy + 14, w - 4, 1); }
    px(sh(o.dk, 0.25), 2, gy - 50, 62, 1); for (let xx = 6; xx < 68; xx += 6) px(FL2, xx, gy - 49, 2, 3);
    o.meta.glows.push({ x: w / 2, y: gy - 20, r: 56, ry: 0.35, col: FL, a: 0.1 }); } };

  LM.cupola = { lift: 44, w: 66, h: 96, draw(o) {
    // San Pietro: tamburo con le colonne, cupola a spicchi, lanterna, facciata bassa
    const { px, w, gy, line } = o, cx = w / 2;
    px(o.dk, 4, gy - 22, w - 8, 22); for (let xx = 8; xx < w - 8; xx += 5) px(FL2, xx, gy - 18, 2, 14); px(sh(o.dk, 0.3), 4, gy - 22, w - 8, 1);
    px(o.dk, cx - 14, gy - 40, 28, 18); for (let k = -12; k <= 12; k += 4) px(FL2, cx + k, gy - 38, 2, 14); px(sh(o.dk, 0.35), cx - 15, gy - 41, 30, 2);
    for (let j = 0; j < 22; j++) { const rr = Math.round(Math.sqrt(1 - Math.pow(j / 22, 2)) * 13); px(j % 5 ? o.dk : sh(o.dk, 0.2), cx - rr, gy - 42 - j, rr * 2, 1); }
    for (let k = -9; k <= 9; k += 4.5) line(cx + k, gy - 42, cx + k * 0.3, gy - 60, FL2);
    px(o.dk, cx - 3, gy - 70, 6, 9); px(FL2, cx - 1, gy - 68, 2, 5); px(o.dk, cx - 1, gy - 78, 2, 9); px(o.dk, cx - 3, gy - 75, 6, 2);
    o.meta.glows.push({ x: cx, y: gy - 40, r: 26, col: FL, a: 0.1 }); o.meta.beacons.push({ x: cx, y: gy - 80 }); } };

  LM.eiffel = { lift: 4, w: 74, h: 148, draw(o) {
    // traliccio che si stringe, tre piani, antenna: acceso d'oro
    const { px, line, w, gy } = o, cx = w / 2, FE = '#c89a4a';
    const half = (y) => { const t = (gy - y) / 138; return Math.max(1.5, 30 * Math.pow(1 - t, 1.9) + 2); };
    for (let y = gy; y > gy - 138; y--) { const hw = Math.round(half(y)); px(FE, cx - hw, y, 2, 1); px(FE, cx + hw - 1, y, 2, 1); }
    for (let y = gy - 4; y > gy - 130; y -= 6) { const hw = half(y), hn = half(y - 6); line(cx - hw, y, cx + hn, y - 6, '#9a7234'); line(cx + hw, y, cx - hn, y - 6, '#9a7234'); }
    px(o.dk, cx - 26, gy - 3, 5, 3); px(o.dk, cx + 22, gy - 3, 5, 3);
    for (const [yy, ww] of [[gy - 42, 25], [gy - 82, 15], [gy - 118, 8]]) { px(o.dk, cx - ww, yy, ww * 2, 3); px(FL, cx - ww, yy, ww * 2, 1); }
    for (let k = -22; k < 22; k += 4) px(FL, cx + k, gy - 3, 2, 2);
    px(o.dk, cx - 1, gy - 150 + 12, 2, 24); px(FE, cx, gy - 138, 1, 8); o.meta.beacons.push({ x: cx, y: gy - 138 });
    o.meta.glows.push({ x: cx, y: gy - 60, r: 40, ry: 1.2, col: FL, a: 0.1 }); } };

  LM.arco = { lift: 62, w: 66, h: 62, draw(o) {
    const { px, w, gy } = o, cx = w / 2;
    px(o.dk, 4, gy - 56, w - 8, 56); px('#b89048', 4, gy - 56, w - 8, 1); px('#b89048', 4, gy - 49, w - 8, 1);
    for (let k = 0; k < 9; k++) px(FL2, 8 + k * 6, gy - 54, 3, 4);           // attico con gli scudi
    px('#1a1426', cx - 11, gy - 34, 22, 34); for (let j = 0; j < 10; j++) px('#1a1426', cx - 11 + Math.round(j * 0.4), gy - 38 - j + 4, 22 - Math.round(j * 0.8), 1);
    px('#2a2036', cx - 9, gy - 32, 18, 32); px(FL, cx - 1, gy - 28, 2, 28);
    px(FL2, 4, gy - 46, 8, 28); px(FL2, w - 12, gy - 46, 8, 28); px(sh(FL2, -0.3), 6, gy - 44, 4, 24); px(sh(FL2, -0.3), w - 10, gy - 44, 4, 24);
    px(sh(o.dk, 0.3), 3, gy - 57, w - 6, 2);
    o.meta.glows.push({ x: cx, y: gy - 30, r: 34, ry: 0.7, col: FL, a: 0.1 }); } };

  LM.bigben = { lift: 14, w: 74, h: 128, draw(o) {
    // torre dell'orologio (quadrante acceso) accanto al palazzo di Westminster coi pinnacoli
    const { px, w, gy, line } = o, tx = 12, tw = 20;
    px(o.dk, 34, gy - 26, w - 36, 26); for (let k = 36; k < w - 4; k += 5) { px(FL2, k, gy - 18, 2, 6); px(o.dk, k, gy - 32, 1, 6); }
    px(o.dk, tx, gy - 100, tw, 100); px(sh(o.dk, 0.25), tx, gy - 100, 2, 100);
    px('#3a3042', tx + 2, gy - 28, tw - 4, 26); for (let yy = gy - 24; yy > gy - 70; yy -= 9) px(FL2, tx + 8, yy, 4, 5);
    px(o.dk, tx - 2, gy - 112, tw + 4, 16); px(FL, tx + 1, gy - 108, tw - 2, 10);
    for (let a = 0; a < 6.28; a += 0.4) px('#3a3042', tx + 10 + Math.cos(a) * 4, gy - 103 + Math.sin(a) * 4);
    px('#3a3042', tx + 10, gy - 107, 1, 4); px('#3a3042', tx + 10, gy - 103, 3, 1);
    px(o.dk, tx - 2, gy - 96, tw + 4, 4); px(o.dk, tx, gy - 124, tw, 12);
    for (let j = 0; j < 18; j++) px(o.dk, tx + 2 + Math.floor(j * 0.45), gy - 124 - j, tw - 4 - Math.floor(j * 0.9), 1);
    px(o.dk, tx + 9, gy - 150 + 8, 2, 6); px(FL2, tx + 9, gy - 128, 2, 4);
    for (const dx of [-2, tw]) { px(o.dk, tx + dx, gy - 118, 2, 6); px(FL2, tx + dx, gy - 118, 1, 2); }
    o.meta.glows.push({ x: tx + 10, y: gy - 103, r: 16, col: FL, a: 0.16 }); o.meta.beacons.push({ x: tx + 10, y: gy - 138 }); } };

  LM.stadshuset = { lift: 22, w: 42, h: 112, draw(o) {
    // municipio di Stoccolma: torre quadrata di mattoni con le aperture ad arco e le tre corone d'oro
    const { px, w, gy } = o, cx = w / 2;
    px(o.dk, 4, gy - 36, w - 8, 36); for (let k = 8; k < w - 8; k += 6) px(FL2, k, gy - 26, 3, 8);
    px(o.dk, cx - 9, gy - 90, 18, 56); px(sh(o.dk, 0.2), cx - 9, gy - 90, 2, 56);
    for (let yy = gy - 84; yy < gy - 44; yy += 12) px(FL2, cx - 3, yy, 6, 7);
    px(o.dk, cx - 11, gy - 98, 22, 10); for (let k = -8; k <= 4; k += 6) px(FL, cx + k, gy - 96, 3, 6);
    px(o.dk, cx - 5, gy - 108, 10, 10); px('#c8984a', cx - 4, gy - 103, 8, 3);
    px(o.dk, cx - 1, gy - 124 + 14, 2, 10); px(FL, cx - 3, gy - 112, 6, 2); px(FL, cx - 2, gy - 114, 1, 2); px(FL, cx + 1, gy - 114, 1, 2);
    o.meta.glows.push({ x: cx, y: gy - 60, r: 24, ry: 1, col: FL, a: 0.08 }); o.meta.beacons.push({ x: cx, y: gy - 114 }); } };

  LM.ironspire = { w: 24, h: 120, draw(o) {
    // chiesa di Riddarholmen: guglia di ferro traforata
    const { px, w, gy, line } = o, cx = w / 2;
    px(o.dk, 4, gy - 30, w - 8, 30); px(FL2, cx - 2, gy - 22, 4, 9);
    for (let y = gy - 30; y > gy - 118; y--) { const hw = Math.max(0, Math.round(8 * (1 - (gy - 30 - y) / 88))); px(o.dk, cx - hw, y, 1, 1); px(o.dk, cx + hw, y, 1, 1); if ((y % 7) === 0) px(o.dk, cx - hw, y, hw * 2 + 1, 1); }
    px(o.dk, cx, gy - 124, 1, 8); px(FL, cx - 1, gy - 119, 3, 2); o.meta.beacons.push({ x: cx, y: gy - 125 }); } };

  LM.fernsehturm = { w: 46, h: 158, draw(o) {
    // torre della televisione di Berlino: fusto sottile (chiaro, per vederlo sul cielo), sfera a «palla da discoteca» illuminata, antenna
    const { px, w, gy } = o, cx = w / 2, SHAFT = '#6a6296';
    for (let y = gy; y > gy - 96; y--) { const hw = y > gy - 24 ? 5 - Math.floor((gy - y) / 8) : 2; px(SHAFT, cx - hw, y, hw * 2 + 1, 1); px('#8a82b4', cx - hw, y, 1, 1); }
    px(SHAFT, cx - 8, gy - 2, 16, 2);
    const by = gy - 108, R = 13; for (let dy = -R; dy <= R; dy++) { const ww = Math.round(Math.sqrt(R * R - dy * dy)); px(dy < -3 ? FL : dy > 5 ? FL2 : '#fff0c0', cx - ww, by + dy, ww * 2 + 1, 1); }
    for (let k = -R; k < R; k += 3) for (let dy = -R + 2; dy < R; dy += 3) if (Math.hypot(k, dy) < R - 1) px('#7a5a2a', cx + k, by + dy, 1, 1);
    px(SHAFT, cx - 6, by + 10, 12, 4); px(SHAFT, cx - 1, by - 40, 2, 28); px(SHAFT, cx - 1, by - 50, 1, 50); px(FL2, cx, by - 36, 1, 4);
    o.meta.glows.push({ x: cx, y: by, r: 24, col: FL, a: 0.16 }); o.meta.beacons.push({ x: cx, y: by - 46 }); } };

  LM.brandenburg = { lift: 60, w: 96, h: 56, draw(o) {
    const { px, w, gy } = o;
    px(o.dk, 4, gy - 4, w - 8, 4); px(o.dk, 6, gy - 44, w - 12, 8); px(sh(o.dk, 0.3), 6, gy - 44, w - 12, 1); px(o.dk, 24, gy - 52, w - 48, 8);
    for (let k = 0; k < 6; k++) { const xx = 8 + k * 15; px(o.dk, xx, gy - 38, 6, 34); px(FL2, xx + 1, gy - 36, 2, 30); }
    px(FL2, 22, gy - 38, 52, 1);
    px(o.dk, w / 2 - 12, gy - 64, 24, 12); px(o.dk, w / 2 - 6, gy - 72, 8, 8);            // quadriga
    for (let k = 0; k < 4; k++) px(o.dk, w / 2 - 12 + k * 6, gy - 68, 3, 6);
    o.meta.glows.push({ x: w / 2, y: gy - 22, r: 48, ry: 0.5, col: FL, a: 0.1 }); } };

  LM.tyn = { lift: 26, w: 70, h: 124, draw(o) {
    // chiesa di Tyn: due guglie gotiche coi torricini agli angoli e il frontone in mezzo
    const { px, w, gy } = o;
    px(o.dk, 6, gy - 52, w - 12, 52); for (let k = 10; k < w - 10; k += 8) px(FL2, k, gy - 30, 3, 10);
    for (const cx of [20, w - 20]) {
      px(o.dk, cx - 9, gy - 82, 18, 40); px(sh(o.dk, 0.2), cx - 9, gy - 82, 2, 40);
      for (let j = 0; j < 36; j++) px(o.dk, cx - 9 + Math.floor(j * 0.25), gy - 82 - j, 18 - Math.floor(j * 0.5), 1);
      for (const tx of [-11, 9]) { px(o.dk, cx + tx, gy - 92, 3, 14); px(o.dk, cx + tx + 1, gy - 100, 1, 9); }
      px(FL2, cx - 2, gy - 70, 4, 10); px(FL2, cx - 2, gy - 52, 4, 7); px(o.dk, cx, gy - 126 + 10, 1, 8);
      o.meta.beacons.push({ x: cx, y: gy - 119 }); }
    for (let j = 0; j < 12; j++) px(o.dk, 28 + j, gy - 54 - j, w - 56 - 2 * j, 1);
    o.meta.glows.push({ x: w / 2, y: gy - 50, r: 38, col: FL, a: 0.09 }); } };

  LM.vito = { lift: 30, w: 92, h: 112, draw(o) {
    // castello di Praga: la cattedrale di San Vito con la guglia alta e le mura col palazzo
    const { px, w, gy, line } = o;
    px(o.dk, 0, gy - 26, w, 26); for (let k = 4; k < w - 4; k += 6) px(FL2, k, gy - 18, 2, 6); px(sh(o.dk, 0.25), 0, gy - 26, w, 1);
    px(o.dk, 30, gy - 62, 30, 38); for (let k = 33; k < 58; k += 5) px(FL2, k, gy - 50, 2, 9);
    for (let j = 0; j < 34; j++) px(o.dk, 56 + Math.floor(j * 0.12), gy - 62 - j, 8 - Math.floor(j * 0.2), 1);
    px(o.dk, 56, gy - 98, 7, 36); for (let j = 0; j < 14; j++) px(o.dk, 56 + Math.floor(j * 0.2), gy - 98 - j, 7 - Math.floor(j * 0.4), 1); px(o.dk, 58, gy - 124 + 12, 2, 8);
    px(FL, 58, gy - 80, 3, 7); px(o.dk, 34, gy - 78, 6, 16); px(o.dk, 36, gy - 90, 2, 12);
    line(30, gy - 40, 22, gy - 26, o.dk); line(60, gy - 40, 68, gy - 26, o.dk);
    o.meta.glows.push({ x: 48, y: gy - 50, r: 34, col: FL, a: 0.1 }); o.meta.beacons.push({ x: 59, y: gy - 108 }); } };

  LM.stephansdom = { lift: 20, w: 76, h: 124, draw(o) {
    // duomo di Vienna: tetto altissimo a losanghe e la guglia sud
    const { px, w, gy } = o;
    px(o.dk, 18, gy - 42, 54, 42); for (let k = 22; k < 68; k += 7) px(FL2, k, gy - 20, 3, 12);
    for (let j = 0; j < 36; j++) { px(o.dk, 18 + Math.floor(j * 0.3), gy - 42 - j, 54 - Math.floor(j * 0.6), 1); }
    for (let yy = gy - 74; yy < gy - 44; yy += 4) for (let xx = 24 + ((yy / 4) % 2) * 4; xx < 66; xx += 8) px(yy % 8 ? '#a8742a' : '#2a2038', xx, yy, 3, 2);
    px(o.dk, 4, gy - 88, 14, 88); px(sh(o.dk, 0.2), 4, gy - 88, 2, 88);
    for (let j = 0; j < 36; j++) px(o.dk, 4 + Math.floor(j * 0.2), gy - 88 - j, 14 - Math.floor(j * 0.38), 1);
    px(o.dk, 10, gy - 128 + 6, 2, 6); px(FL2, 9, gy - 60, 4, 14); px(FL2, 9, gy - 34, 4, 10); px(FL, 10, gy - 104, 2, 5);
    o.meta.glows.push({ x: 22, y: gy - 60, r: 34, col: FL, a: 0.1 }); o.meta.beacons.push({ x: 11, y: gy - 125 }); } };

  LM.metropolis = { lift: 30, w: 46, h: 96, draw(o) {
    // edificio Metropolis di Madrid: scalinata di piani, cupola di ardesia e la Vittoria alata d'oro
    const { px, w, gy } = o, cx = w / 2;
    px(o.dk, 4, gy - 40, w - 8, 40); px(sh(o.dk, 0.3), 3, gy - 41, w - 6, 2); for (let yy = gy - 36; yy < gy - 6; yy += 9) for (let k = 8; k < w - 10; k += 7) px(r2(o, k, yy) ? FL : '#2a2038', k, yy, 3, 5);
    px(o.dk, 10, gy - 62, w - 20, 22); px(sh(o.dk, 0.3), 9, gy - 63, w - 18, 1); for (let k = 14; k < w - 14; k += 7) px(FL2, k, gy - 56, 3, 8);
    px(o.dk, 14, gy - 76, w - 28, 14); for (let j = 0; j < 14; j++) px(o.dk, 15 + Math.floor(j * 0.6), gy - 76 - j, w - 30 - Math.floor(j * 1.2), 1);
    px('#c89a4a', cx - 1, gy - 100, 3, 9); px('#e8c070', cx - 4, gy - 96, 9, 2); px('#e8c070', cx - 1, gy - 104, 3, 4);
    o.meta.glows.push({ x: cx, y: gy - 60, r: 28, col: FL, a: 0.1 }); o.meta.beacons.push({ x: cx, y: gy - 106 }); } };
  const r2 = (o, a, b) => o.r(a * 3.7 + b * 1.3) < 0.6;

  LM.santajusta = { lift: 24, w: 34, h: 104, draw(o) {
    // ascensore di Santa Justa: torre di ferro neogotica con la passerella in cima
    const { px, w, gy, line } = o, cx = w / 2;
    for (const dx of [-8, 7]) px(o.dk, cx + dx, gy - 82, 2, 82);
    for (let y = gy - 4; y > gy - 80; y -= 8) { line(cx - 8, y, cx + 8, y - 8, o.dk); line(cx + 8, y, cx - 8, y - 8, o.dk); px(o.dk, cx - 8, y, 17, 1); }
    px(o.dk, cx - 14, gy - 92, 29, 6); px(FL2, cx - 12, gy - 90, 25, 2); px(o.dk, cx - 6, gy - 104 + 4, 14, 12); px(FL, cx - 3, gy - 96, 8, 3);
    px(o.dk, cx, gy - 110 + 8, 1, 6); px(FL2, cx - 9, gy - 64, 5, 8); o.meta.glows.push({ x: cx, y: gy - 70, r: 20, col: FL, a: 0.1 }); o.meta.beacons.push({ x: cx, y: gy - 104 }); } };

  LM.castelo = { lift: 40, w: 96, h: 58, draw(o) {
    // castello di Sao Jorge sulla collina: mura merlate e torri illuminate
    const { px, w, gy } = o;
    for (let xx = 0; xx < w; xx++) { const hh = 10 + Math.round(10 * Math.sin(xx / w * Math.PI)); px('#2a2030', xx, gy - hh, 1, hh); }
    px(o.dk, 10, gy - 36, w - 20, 22); for (let k = 10; k < w - 10; k += 4) px(o.dk, k, gy - 40, 2, 4);
    for (const tx of [10, 44, w - 22]) { px(o.dk, tx, gy - 50, 12, 36); for (let k = 0; k < 12; k += 4) px(o.dk, tx + k, gy - 54, 2, 4); px(FL2, tx + 4, gy - 40, 3, 7); }
    o.meta.glows.push({ x: w / 2, y: gy - 30, r: 40, ry: 0.5, col: FL, a: 0.1 }); } };

  LM.partenone = { lift: 44, w: 112, h: 74, draw(o) {
    // Acropoli: la roccia e il Partenone con le colonne e il frontone, illuminati d'oro
    const { px, w, gy } = o, rock = '#2a2230';
    for (let xx = 0; xx < w; xx++) { const t = xx / w, hh = Math.round(14 + 12 * Math.sin(Math.min(1, t * 1.15) * Math.PI) + (t < 0.12 ? -6 : 0)); px(rock, xx, gy - hh, 1, hh); }
    for (let xx = 4; xx < w - 4; xx += 5) px('#3a2e3c', xx, gy - 26 + (xx % 7), 3, 2);
    const bx = 14, bw = 84, by = gy - 28;
    px(FL2, bx - 2, by, bw + 4, 3); px(FL, bx - 2, by, bw + 4, 1);
    for (let k = 0; k < 11; k++) { px(FL2, bx + k * 8, by - 24, 4, 24); px(FL, bx + k * 8, by - 24, 1, 24); }
    px(FL2, bx - 2, by - 29, bw + 4, 5); px(FL, bx - 2, by - 29, bw + 4, 1);
    for (let j = 0; j < 9; j++) px(FL2, bx + j * 3, by - 38 + j, bw - j * 6, 1);
    o.meta.glows.push({ x: w / 2, y: gy - 36, r: 58, ry: 0.5, col: FL, a: 0.14 }); } };

  LM.campidoglio = { lift: 44, w: 112, h: 80, draw(o) {
    // Campidoglio di Washington: la cupola bianca su due ali
    const { px, w, gy } = o, cx = w / 2, W1 = '#d8d6cc', W2 = '#a8a69c';
    px(W2, 2, gy - 22, w - 4, 22); px(W1, 2, gy - 22, w - 4, 2); for (let k = 6; k < w - 6; k += 6) { px('#2a2840', k, gy - 16, 3, 8); }
    px(W1, cx - 26, gy - 34, 52, 12); for (let k = -22; k <= 22; k += 5) px(W2, cx + k, gy - 32, 2, 10);
    px(W2, cx - 16, gy - 50, 32, 16); px(W1, cx - 17, gy - 52, 34, 2); for (let k = -13; k <= 13; k += 4) px(W1, cx + k, gy - 48, 2, 12);
    for (let j = 0; j < 22; j++) { const rr = Math.round(Math.sqrt(1 - Math.pow(j / 22, 2)) * 14); px(j % 5 ? W1 : W2, cx - rr, gy - 52 - 22 + j, rr * 2, 1); }
    px(W1, cx - 3, gy - 82, 6, 8); px(W1, cx - 1, gy - 90, 2, 8); px('#c8984a', cx - 1, gy - 92, 2, 3);
    o.meta.glows.push({ x: cx, y: gy - 44, r: 56, ry: 0.5, col: '#fff0d0', a: 0.12 }); o.meta.beacons.push({ x: cx, y: gy - 93 }); } };

  LM.obelisco = { w: 22, h: 150, draw(o) {
    // monumento a Washington: obelisco bianco con le luci rosse in cima
    const { px, w, gy } = o, cx = w / 2;
    for (let y = gy; y > gy - 134; y--) { const hw = Math.round(5 - (gy - y) / 134 * 3.4); px('#d0cec4', cx - hw, y, hw * 2 + 1, 1); }
    px('#a8a69c', cx - 5, gy - 120, 1, 120);
    for (let j = 0; j < 14; j++) px('#d0cec4', cx - 1 - Math.floor((14 - j) * 0.13), gy - 134 - j, 3 + Math.floor((14 - j) * 0.26), 1);
    px('#b8b6ac', cx - 8, gy - 3, 17, 3);
    o.meta.beacons.push({ x: cx, y: gy - 148 }); o.meta.glows.push({ x: cx, y: gy - 70, r: 22, ry: 2, col: '#fff0d0', a: 0.08 }); } };

  // ---------------------------------------------------------------- quartieri
  // modello: una funzione che riempie i campi comuni
  const FAR = (a) => a;
  const D = (o) => Object.assign({ len: 1000, dark: 0.28, farDark: 0.55, signP: 0.55, flick: 0.12, hazeA: 1, glowA: 0.14, broken: 0, gradeA: 0.08, people: 5, landP: 0.14 }, o);

  CITY.roma = [
    D({ id: 'roma_corso', name: 'VIA DEL CORSO', len: 1100, kinds: { 'fac:roma_palazzo': 5, 'fac:roma_umbertino': 3, boutique: 0.8, hotel: 0.5 },
      mid: ['#8a6a3e', '#9a5a38'], far: ['#2a1c30', '#321e30', '#261a2c', '#2e2034'], farH: 0.9, win: ['#ffd98a', '#ffe9b8', '#ffc46a'],
      words: ['BAR', 'GELATI', 'PIZZA', 'TRATTORIA', 'FARMACIA', 'TABACCHI', 'OSTERIA', 'CAFFE'], neon: ['#ffb000', '#ff5a3a', '#2ee6ff', '#b8ff3a'],
      haze: [110, 60, 60], glow: [255, 150, 70], lamp: '#ffbf6a', grade: [255, 150, 80], gradeA: 0.1, land: 'colosseo|cupola', landP: 0.2, people: 7 }),
    D({ id: 'roma_popolo', name: 'PIAZZA DEL POPOLO', len: 900, kinds: { 'fac:roma_palazzo': 4, 'fac:roma_umbertino': 4, park: 1.2, boutique: 0.5 },
      mid: ['#8a6a3e', '#9a5a38'], far: ['#2a1c30', '#321e30', '#261a2c'], farH: 0.85, win: ['#ffd98a', '#ffe9b8'],
      words: ['CAFFE', 'BAR', 'GELATERIA', 'LIBRERIA', 'ENOTECA', 'PIZZA'], neon: ['#ffb000', '#ff5a3a', '#b8ff3a'],
      haze: [100, 56, 70], glow: [255, 140, 80], lamp: '#ffc070', grade: [255, 130, 70], gradeA: 0.1, land: 'cupola|colosseo', landP: 0.16, people: 8 }),
    D({ id: 'roma_eur', name: 'EUR', len: 800, kinds: { office: 3, tower: 2, hotel: 1.2, 'fac:roma_umbertino': 1.5, park: 1 },
      mid: ['#2a3350', '#2a3a5a', '#34304a'], far: ['#1c1850', '#241a58', '#18144a'], farH: 1.1, win: ['#fff0c8', '#ffe9b8', '#cfe6ff'],
      words: ['BANCA', 'UFFICI', 'HOTEL', 'ENI', 'BAR'], neon: ['#2ee6ff', '#ffd98a', '#f4f1e6'], haze: [60, 60, 120], glow: [120, 150, 255], lamp: '#ffd7a0', grade: [180, 160, 255], gradeA: 0.08, land: 'spire', landP: 0.08, people: 4 }),
  ];

  CITY.parigi = [
    D({ id: 'parigi_champs', name: 'CHAMPS-ELYSEES', len: 1200, kinds: { 'fac:parigi_haussmann': 5, 'fac:parigi_belleepoque': 3, boutique: 1.6, hotel: 1 },
      mid: ['#9a907c', '#a89a82'], far: ['#1c2048', '#222654', '#181c42', '#262a5a'], farH: 1, win: ['#ffe9b8', '#ffd98a', '#fff4d8'],
      words: ['CAFE', 'BRASSERIE', 'PHARMACIE', 'TABAC', 'BOULANGERIE', 'HOTEL', 'BISTRO', 'LUXE'], neon: ['#ffd98a', '#ff2e88', '#2ee6ff', '#f4f1e6'],
      haze: [70, 70, 130], glow: [255, 200, 110], lamp: '#ffd98a', grade: [255, 200, 120], gradeA: 0.08, land: 'eiffel|arco', landP: 0.2, people: 8 }),
    D({ id: 'parigi_concorde', name: 'PLACE DE LA CONCORDE', len: 900, kinds: { 'fac:parigi_haussmann': 4, 'fac:parigi_belleepoque': 4, park: 1.5, hotel: 1 },
      mid: ['#9a907c', '#a89a82'], far: ['#1c2048', '#222654', '#181c42'], farH: 0.95, win: ['#ffe9b8', '#fff4d8'],
      words: ['CAFE', 'BISTRO', 'LIBRAIRIE', 'FLEURS', 'BAR', 'TABAC'], neon: ['#ffd98a', '#ff5a3a', '#b8ff3a'],
      haze: [70, 66, 130], glow: [255, 190, 110], lamp: '#ffd98a', grade: [255, 190, 130], gradeA: 0.08, land: 'eiffel', landP: 0.22, people: 8 }),
    D({ id: 'parigi_defense', name: 'LA DEFENSE', len: 700, kinds: { tower: 3, office: 2.6, hotel: 1, 'fac:parigi_belleepoque': 1 },
      mid: ['#16405e', '#1b3a6a'], far: ['#16264e', '#1a2c5a', '#142046'], farH: 1.5, win: ['#fff0c8', '#cfe6ff', '#ffe9b8'], dark: 0.3,
      words: ['BANQUE', 'BUREAUX', 'HOTEL', 'METRO'], neon: ['#9fe0ff', '#f4f1e6', '#ffd98a'], haze: [44, 70, 140], glow: [110, 170, 255], lamp: '#e4ecff', grade: [100, 160, 255], gradeA: 0.12, land: 'arco', landP: 0.1, people: 3 }),
  ];

  CITY.londra = [
    D({ id: 'londra_regent', name: 'REGENT STREET', len: 1100, kinds: { 'fac:londra_vittoriano': 5, 'fac:londra_mattoni': 2, boutique: 1.4, hotel: 0.8 },
      mid: ['#7a6a50', '#8a6a4a'], far: ['#1c2038', '#222640', '#181c34', '#262a48'], farH: 1, win: ['#ffd98a', '#ffe9b8', '#ffc46a'],
      words: ['PUB', 'CAFE', 'HOTEL', 'BOOKS', 'CHEMIST', 'TEA ROOMS', 'TAXI', 'BANK'], neon: ['#ffb000', '#ff3a2a', '#2ee6ff', '#b8ff3a'],
      haze: [80, 84, 110], hazeA: 1.3, glow: [255, 160, 70], lamp: '#ffa64a', grade: [150, 170, 210], gradeA: 0.12, land: 'bigben|ferris', landP: 0.2, people: 8 }),
    D({ id: 'londra_trafalgar', name: 'TRAFALGAR SQUARE', len: 900, kinds: { 'fac:londra_vittoriano': 4, 'fac:londra_mattoni': 3, park: 1, hotel: 1 },
      mid: ['#7a6a50', '#8a6a4a'], far: ['#1c2038', '#222640', '#181c34'], farH: 1, win: ['#ffd98a', '#ffe9b8'],
      words: ['PUB', 'GALLERY', 'CAFE', 'TICKETS', 'THEATRE', 'BAR'], neon: ['#ffb000', '#ff3a2a', '#b07bff'],
      haze: [80, 80, 112], hazeA: 1.35, glow: [255, 150, 70], lamp: '#ffa64a', grade: [150, 165, 205], gradeA: 0.12, land: 'bigben|ferris', landP: 0.18, people: 8 }),
    D({ id: 'londra_docklands', name: 'DOCKLANDS', len: 800, kinds: { tower: 3, office: 2.6, 'fac:londra_mattoni': 1.2, containers: 0.6 },
      mid: ['#16405e', '#1b3a6a'], far: ['#16264e', '#1a2c5a', '#142046'], farH: 1.5, win: ['#fff0c8', '#cfe6ff', '#ffe9b8'], dark: 0.3,
      words: ['BANK', 'OFFICES', 'DLR', 'HOTEL'], neon: ['#9fe0ff', '#f4f1e6', '#ffd98a'], haze: [60, 76, 120], hazeA: 1.2, glow: [110, 170, 255], lamp: '#e4ecff', grade: [120, 160, 230], gradeA: 0.1, land: 'ferris|spire', landP: 0.1, people: 3 }),
  ];

  CITY.stoccolma = [
    D({ id: 'stoccolma_drott', name: 'DROTTNINGGATAN', len: 1000, kinds: { 'fac:stoccolma_citta': 4, 'fac:stoccolma_gamla': 3, boutique: 1 },
      mid: ['#7a7a82', '#8a7a6a'], far: ['#141c48', '#1a2250', '#10163e'], farH: 0.95, win: ['#fff0c8', '#ffe9b8', '#ffd98a'],
      words: ['CAFE', 'FIKA', 'APOTEK', 'BAR', 'SMORGAS', 'HOTELL', 'KONDITORI'], neon: ['#2ee6ff', '#ffd98a', '#f4f1e6'],
      haze: [40, 64, 120], glow: [120, 170, 255], lamp: '#ffe0b0', grade: [120, 170, 255], gradeA: 0.12, land: 'stadshuset|ironspire', landP: 0.2, people: 6 }),
    D({ id: 'stoccolma_stortorget', name: 'STORTORGET', len: 900, kinds: { 'fac:stoccolma_gamla': 6, 'fac:stoccolma_citta': 1.5, park: 0.6 },
      mid: ['#9a7a3a', '#9a4a3a'], far: ['#141c48', '#1a2250', '#10163e'], farH: 0.8, win: ['#ffd98a', '#ffe9b8', '#ffc46a'],
      words: ['CAFE', 'KROG', 'ANTIK', 'BAR', 'FIKA'], neon: ['#ffd98a', '#ff5a3a', '#2ee6ff'],
      haze: [44, 60, 116], glow: [140, 180, 255], lamp: '#ffd8a0', grade: [140, 170, 240], gradeA: 0.12, land: 'ironspire|stadshuset', landP: 0.2, people: 6 }),
  ];

  CITY.berlino = [
    D({ id: 'berlino_linden', name: 'UNTER DEN LINDEN', len: 1000, kinds: { 'fac:berlino_altbau': 5, 'fac:berlino_platte': 1.5, hotel: 1 },
      mid: ['#7a7468', '#6a6a70'], far: ['#181a3e', '#1e2046', '#14163a'], farH: 1, win: ['#fff4d8', '#e8f0ff', '#ffe9b8'],
      words: ['CAFE', 'BIERGARTEN', 'APOTHEKE', 'BAR', 'HOTEL', 'KINO', 'IMBISS'], neon: ['#e8f0ff', '#ff2e88', '#b8ff3a', '#ffb000'],
      haze: [60, 68, 100], glow: [190, 210, 255], lamp: '#e8f0ff', grade: [160, 180, 230], gradeA: 0.12, land: 'brandenburg|fernsehturm', landP: 0.2, people: 6 }),
    D({ id: 'berlino_alex', name: 'ALEXANDERPLATZ', len: 1000, kinds: { 'fac:berlino_platte': 5, 'fac:berlino_altbau': 2, office: 1.4, tower: 1 },
      mid: ['#6a6e76', '#767a80'], far: ['#181a3e', '#1e2046', '#14163a'], farH: 1.1, win: ['#e8f0ff', '#cfe6ff', '#fff4d8'], dark: 0.35,
      words: ['IMBISS', 'DONER', 'KAUFHAUS', 'BAR', 'KINO', 'U-BAHN'], neon: ['#e8f0ff', '#ff2e88', '#ffb000'],
      haze: [56, 64, 96], glow: [180, 200, 255], lamp: '#dfe8ff', grade: [150, 170, 225], gradeA: 0.14, land: 'fernsehturm', landP: 0.26, people: 6 }),
  ];

  CITY.praga = [
    D({ id: 'praga_vaclav', name: 'VACLAVSKE NAMESTI', len: 1000, kinds: { 'fac:praga_barocco': 4, 'fac:vienna_ring': 1.5, hotel: 1.2, boutique: 0.8 },
      mid: ['#9a6a6a', '#7a8a6a'], far: ['#241a44', '#2a1e4e', '#1e163a'], farH: 1, win: ['#ffd98a', '#ffe9b8', '#ffc46a'],
      words: ['PIVNICE', 'CAFE', 'HOTEL', 'BAR', 'LEKARNA', 'POHODA', 'CUKRARNA'], neon: ['#ffb000', '#ff5a3a', '#2ee6ff', '#b07bff'],
      haze: [90, 60, 110], glow: [255, 160, 90], lamp: '#ffc070', grade: [220, 150, 170], gradeA: 0.1, land: 'tyn|vito', landP: 0.22, people: 7 }),
    D({ id: 'praga_staromestske', name: 'STAROMESTSKE NAMESTI', len: 1000, kinds: { 'fac:praga_barocco': 6, 'fac:vienna_ring': 1 },
      mid: ['#9a6a6a', '#7a8a6a'], far: ['#241a44', '#2a1e4e', '#1e163a'], farH: 0.9, win: ['#ffd98a', '#ffe9b8'],
      words: ['PIVNICE', 'CAFE', 'RESTAURACE', 'BAR', 'KRYSTAL'], neon: ['#ffb000', '#ff5a3a', '#b8ff3a'],
      haze: [96, 60, 106], glow: [255, 150, 90], lamp: '#ffc070', grade: [230, 150, 160], gradeA: 0.1, land: 'tyn|vito', landP: 0.26, people: 8 }),
  ];

  CITY.vienna = [
    D({ id: 'vienna_ring', name: 'RINGSTRASSE', len: 1100, kinds: { 'fac:vienna_ring': 6, 'fac:praga_barocco': 1, hotel: 1.2, boutique: 0.8 },
      mid: ['#9a9482', '#a89c84'], far: ['#1e1a48', '#241e50', '#181440'], farH: 1, win: ['#ffe9b8', '#fff4d8', '#ffd98a'],
      words: ['CAFE', 'KONDITOREI', 'HOTEL', 'OPER', 'BAR', 'APOTHEKE', 'WIRTSHAUS'], neon: ['#ffd98a', '#ff2e88', '#f4f1e6'],
      haze: [70, 62, 110], glow: [255, 200, 120], lamp: '#ffe0a0', grade: [220, 190, 150], gradeA: 0.08, land: 'stephansdom|ferris', landP: 0.2, people: 7 }),
    D({ id: 'vienna_stephans', name: 'STEPHANSPLATZ', len: 900, kinds: { 'fac:vienna_ring': 4, 'fac:praga_barocco': 3, boutique: 1.2 },
      mid: ['#9a9482', '#a89c84'], far: ['#1e1a48', '#241e50', '#181440'], farH: 0.95, win: ['#ffe9b8', '#ffd98a'],
      words: ['CAFE', 'SACHER', 'WURST', 'BAR', 'JUWELIER'], neon: ['#ffd98a', '#ff5a3a', '#b8ff3a'],
      haze: [74, 62, 106], glow: [255, 190, 120], lamp: '#ffe0a0', grade: [230, 190, 150], gradeA: 0.08, land: 'stephansdom', landP: 0.28, people: 8 }),
  ];

  CITY.madrid = [
    D({ id: 'madrid_granvia', name: 'GRAN VIA', len: 1200, kinds: { 'fac:madrid_granvia': 6, hotel: 1.2, boutique: 1.2, tower: 0.5 },
      mid: ['#aaa496', '#9a9486'], far: ['#2a1a3c', '#321e44', '#261634', '#2e2048'], farH: 1.1, win: ['#ffe9b8', '#ffd98a', '#fff4d8'], signP: 0.9, flick: 0.2,
      words: ['TAPAS', 'CERVECERIA', 'FARMACIA', 'HOTEL', 'BAR', 'CINE', 'JAMON', 'CAFE'], neon: ['#ff2e88', '#ffb000', '#2ee6ff', '#b8ff3a'],
      haze: [110, 60, 90], glow: [255, 100, 120], lamp: '#ffb860', grade: [255, 120, 120], gradeA: 0.1, land: 'metropolis', landP: 0.26, people: 9 }),
    D({ id: 'madrid_sol', name: 'PUERTA DEL SOL', len: 900, kinds: { 'fac:madrid_granvia': 5, 'fac:parigi_belleepoque': 1.5, boutique: 1 },
      mid: ['#aaa496', '#9a9486'], far: ['#2a1a3c', '#321e44', '#261634'], farH: 1, win: ['#ffe9b8', '#ffd98a'], signP: 0.8,
      words: ['TAPAS', 'BAR', 'CAFE', 'TIENDA', 'LOTERIA', 'RESTAURANTE'], neon: ['#ff2e88', '#ffb000', '#2ee6ff'],
      haze: [110, 60, 84], glow: [255, 110, 120], lamp: '#ffb860', grade: [255, 120, 110], gradeA: 0.1, land: 'metropolis', landP: 0.2, people: 9 }),
  ];

  CITY.lisbona = [
    D({ id: 'lisbona_liberdade', name: 'AVENIDA DA LIBERDADE', len: 1000, kinds: { 'fac:lisbona_azulejo': 4, 'fac:madrid_granvia': 1.5, boutique: 1.2, hotel: 1 },
      mid: ['#4a6a8a', '#8a8a52'], far: ['#1c1c4a', '#22225a', '#181840'], farH: 0.95, win: ['#ffd98a', '#ffe9b8', '#ffc46a'],
      words: ['PASTELARIA', 'CAFE', 'BAR', 'FARMACIA', 'TASCA', 'HOTEL', 'FADO'], neon: ['#ffb000', '#2ee6ff', '#ff5a3a', '#b8ff3a'],
      haze: [100, 70, 80], glow: [255, 170, 100], lamp: '#ffc880', grade: [255, 170, 110], gradeA: 0.1, land: 'santajusta|castelo', landP: 0.22, people: 7 }),
    D({ id: 'lisbona_comercio', name: 'PRACA DO COMERCIO', len: 900, kinds: { 'fac:lisbona_azulejo': 6, 'fac:roma_umbertino': 1, park: 0.6 },
      mid: ['#8a8a52', '#8a6a4a'], far: ['#1c1c4a', '#22225a', '#181840'], farH: 0.9, win: ['#ffd98a', '#ffe9b8'],
      words: ['PASTEIS', 'CAFE', 'TASCA', 'BAR', 'LOJA', 'VINHOS'], neon: ['#ffb000', '#ff5a3a', '#2ee6ff'],
      haze: [96, 70, 90], glow: [255, 160, 100], lamp: '#ffc880', grade: [255, 160, 110], gradeA: 0.1, land: 'castelo|santajusta', landP: 0.24, people: 7 }),
  ];

  CITY.atene = [
    D({ id: 'atene_syntagma', name: 'SYNTAGMA SQUARE', len: 1000, kinds: { 'fac:atene_polikatoikia': 4, 'fac:atene_cubo': 2.5, hotel: 1, park: 0.8 },
      mid: ['#8a8678', '#9a9686'], far: ['#16204e', '#1c2858', '#121a44'], farH: 0.9, win: ['#ffe9b8', '#ffd98a', '#fff4d8'],
      words: ['TAVERNA', 'GYROS', 'CAFE', 'HOTEL', 'BAR', 'FARMAKEIO', 'SOUVLAKI'], neon: ['#2ee6ff', '#ffd98a', '#f4f1e6', '#ff2e88'],
      haze: [60, 84, 140], glow: [140, 190, 255], lamp: '#ffe4b0', grade: [140, 190, 255], gradeA: 0.1, land: 'partenone', landP: 0.3, people: 8 }),
    D({ id: 'atene_ermou', name: 'ERMOU STREET', len: 1000, kinds: { 'fac:atene_cubo': 4, 'fac:atene_polikatoikia': 3, boutique: 1.2 },
      mid: ['#b8b4a8', '#c0bcb0'], far: ['#16204e', '#1c2858', '#121a44'], farH: 0.85, win: ['#ffe9b8', '#ffd98a'],
      words: ['TAVERNA', 'CAFE', 'SOUVLAKI', 'BAR', 'MODA', 'OUZERI'], neon: ['#2ee6ff', '#ffd98a', '#ff5a3a'],
      haze: [60, 80, 136], glow: [140, 190, 255], lamp: '#ffe4b0', grade: [140, 185, 250], gradeA: 0.1, land: 'partenone', landP: 0.3, people: 8 }),
  ];

  CITY.washington = [
    D({ id: 'wash_penn', name: 'PENNSYLVANIA AVENUE', len: 1100, kinds: { 'fac:washington_federale': 4, 'fac:washington_mattoni': 2, office: 1.4, hotel: 1 },
      mid: ['#aaa8a0', '#b4b2aa'], far: ['#141a46', '#1a2050', '#10163c'], farH: 0.9, win: ['#fff4d8', '#ffe9b8'], dark: 0.35, signP: 0.4,
      words: ['DINER', 'CAFE', 'BANK', 'HOTEL', 'BAR', 'PHARMACY', 'DELI'], neon: ['#ff3a2a', '#2a5fd8', '#f4f1e6', '#ffb000'],
      haze: [50, 66, 116], glow: [200, 220, 255], lamp: '#fff0d0', grade: [180, 200, 250], gradeA: 0.1, land: 'campidoglio|obelisco', landP: 0.26, people: 5 }),
    D({ id: 'wash_constitution', name: 'CONSTITUTION AVENUE', len: 1000, kinds: { 'fac:washington_federale': 5, park: 1.4, 'fac:washington_mattoni': 1 },
      mid: ['#aaa8a0', '#b4b2aa'], far: ['#141a46', '#1a2050', '#10163c'], farH: 0.85, win: ['#fff4d8', '#ffe9b8'], dark: 0.4, signP: 0.25,
      words: ['MUSEUM', 'CAFE', 'BANK', 'DELI'], neon: ['#ff3a2a', '#2a5fd8', '#f4f1e6'],
      haze: [50, 64, 112], glow: [200, 220, 255], lamp: '#fff0d0', grade: [180, 200, 250], gradeA: 0.1, land: 'obelisco|campidoglio', landP: 0.3, people: 4 }),
  ];
  // un monumento ogni 12 tessere lontane (se ne vede più o meno uno per schermo), con una fase diversa per quartiere
  let ph = 2; for (const id in CITY) for (const d of CITY[id]) { if (d.land) { d.landEvery = 12; d.landPhase = ph; ph = (ph + 4) % 9; } }
})();
