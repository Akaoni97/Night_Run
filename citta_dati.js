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

  LM.pantheon = { lift: 44, w: 72, h: 62, draw(o) {
    // Pantheon: il portico di colonne col frontone davanti alla rotonda con la cupola
    const { px, w, gy } = o, cx = w / 2;
    px(o.dk, 8, gy - 38, w - 16, 38); for (let j = 0; j < 20; j++) { const rr = Math.round(Math.sqrt(1 - Math.pow(j / 20, 2)) * 22); px(j % 5 ? o.dk : sh(o.dk, 0.2), cx - rr, gy - 38 - j, rr * 2, 1); } px(FL2, cx - 2, gy - 58, 4, 2);
    px(o.dk, 2, gy - 4, w - 4, 4); for (let k = 0; k < 8; k++) { px(o.dk, 6 + k * 8, gy - 34, 4, 30); px(FL2, 7 + k * 8, gy - 32, 2, 26); }
    for (let j = 0; j < 10; j++) px(o.dk, 4 + j, gy - 44 + j, w - 8 - j * 2, 1); px(FL, 6, gy - 34, w - 12, 1);
    o.meta.glows.push({ x: cx, y: gy - 30, r: 38, ry: 0.7, col: FL, a: 0.12 }); } };

  LM.notredame = { lift: 20, w: 92, h: 78, draw(o) {
    // Notre-Dame: la facciata con le due torri quadrate, il rosone illuminato e la guglia al centro
    const { px, w, gy } = o, cx = w / 2;
    px(o.dk, 6, gy - 40, w - 12, 40); for (const tx of [6, w - 30]) { px(o.dk, tx, gy - 70, 24, 70); for (let k = 0; k < 3; k++) px(FL2, tx + 3 + k * 7, gy - 62, 3, 12); px(sh(o.dk, 0.3), tx, gy - 70, 24, 2); for (let k = 0; k < 6; k++) px(o.dk, tx + k * 4, gy - 73, 2, 3); }
    for (let a = 0; a < 6.28; a += 0.3) px(FL, cx + Math.cos(a) * 7, gy - 34 + Math.sin(a) * 7, 2, 2); px(FL2, cx - 3, gy - 37, 6, 6);
    for (let k = 0; k < 3; k++) { px(FL2, cx - 20 + k * 20, gy - 20, 4, 18); px(o.dk, cx - 21 + k * 20, gy - 22, 6, 2); }
    for (let j = 0; j < 22; j++) px(o.dk, cx - 1 - Math.floor((22 - j) * 0.08), gy - 40 - j - 6, 3 + Math.floor((22 - j) * 0.16), 1); px(o.dk, cx, gy - 74, 1, 8); o.meta.beacons.push({ x: cx, y: gy - 74 });
    o.meta.glows.push({ x: cx, y: gy - 36, r: 40, col: FL, a: 0.1 }); } };

  LM.towerbridge = { lift: 8, w: 132, h: 70, draw(o) {
    // Tower Bridge: due torri con i tetti a punta, la passerella in alto e la strada sospesa
    const { px, w, gy, line } = o, BL = '#3a62a8';
    for (const tx of [18, w - 42]) { px(o.dk, tx, gy - 62, 24, 62); px(sh(o.dk, 0.25), tx, gy - 62, 2, 62); for (let k = 0; k < 3; k++) { px(FL2, tx + 4 + k * 7, gy - 50, 3, 9); px(FL2, tx + 4 + k * 7, gy - 32, 3, 9); }
      for (let j = 0; j < 12; j++) px(o.dk, tx + Math.floor(j * 0.9), gy - 62 - j, 24 - Math.floor(j * 1.8), 1); for (const dx of [0, 21]) { px(o.dk, tx + dx, gy - 70, 3, 8); } px(o.dk, tx + 11, gy - 78, 2, 8); }
    px(BL, 40, gy - 54, w - 82, 3); px(sh(BL, 0.3), 40, gy - 54, w - 82, 1); for (let k = 40; k < w - 42; k += 5) px(BL, k, gy - 54, 1, 8);
    px(o.dk, 0, gy - 10, w, 3); px(BL, 0, gy - 11, w, 1); line(40, gy - 54, 18, gy - 12, BL); line(w - 42, gy - 54, w - 20, gy - 12, BL); line(w / 2, gy - 52, w / 2, gy - 12, sh(BL, -0.2));
    o.meta.glows.push({ x: w / 2, y: gy - 40, r: 56, ry: 0.5, col: '#8ab0ff', a: 0.08 }); o.meta.beacons.push({ x: 29, y: gy - 79 }, { x: w - 31, y: gy - 79 }); } };

  LM.berlindom = { lift: 36, w: 76, h: 66, draw(o) {
    // duomo di Berlino: grande cupola di rame verde con le quattro torrette
    const { px, w, gy } = o, cx = w / 2, GR = '#4a8a7a';
    px(o.dk, 6, gy - 30, w - 12, 30); for (let k = 10; k < w - 10; k += 6) px(FL2, k, gy - 22, 2, 10);
    px(o.dk, cx - 16, gy - 44, 32, 14); for (let j = 0; j < 22; j++) { const rr = Math.round(Math.sqrt(1 - Math.pow(j / 22, 2)) * 17); px(j % 4 ? GR : sh(GR, 0.25), cx - rr, gy - 44 - j, rr * 2, 1); } px(FL2, cx - 1, gy - 70, 2, 5); px(o.dk, cx - 1, gy - 76, 2, 7);
    for (const tx of [4, w - 12]) { px(o.dk, tx, gy - 46, 8, 16); for (let j = 0; j < 7; j++) px(GR, tx + Math.floor(j * 0.3), gy - 46 - j, 8 - Math.floor(j * 0.6), 1); }
    o.meta.glows.push({ x: cx, y: gy - 36, r: 36, col: FL, a: 0.1 }); o.meta.beacons.push({ x: cx, y: gy - 77 }); } };

  LM.karlskirche = { lift: 30, w: 96, h: 70, draw(o) {
    // Karlskirche: la cupola verde, il portico e le due colonne alte ai lati
    const { px, w, gy } = o, cx = w / 2, GR = '#3a8a6a';
    px(o.dk, 16, gy - 34, w - 32, 34); for (let k = 0; k < 6; k++) { px(o.dk, 24 + k * 9, gy - 28, 4, 26); px(FL2, 25 + k * 9, gy - 26, 2, 22); }
    for (let j = 0; j < 12; j++) px(o.dk, 20 + j, gy - 46 + j, w - 40 - j * 2, 1);
    px(o.dk, cx - 14, gy - 52, 28, 18); for (let j = 0; j < 20; j++) { const rr = Math.round(Math.sqrt(1 - Math.pow(j / 20, 2)) * 15); px(j % 4 ? GR : sh(GR, 0.25), cx - rr, gy - 52 - j, rr * 2, 1); } px(FL2, cx - 1, gy - 78, 2, 6);
    for (const tx of [3, w - 11]) { px(o.dk, tx, gy - 56, 8, 56); for (let k = 0; k < 14; k++) px(FL2, tx + 1 + (k % 2) * 4, gy - 52 + k * 3.6, 2, 2); px(o.dk, tx - 1, gy - 58, 10, 3); px(GR, tx + 1, gy - 62, 6, 4); }
    o.meta.glows.push({ x: cx, y: gy - 34, r: 44, col: FL, a: 0.1 }); } };

  LM.toro = { lift: 58, w: 62, h: 40, draw(o) {
    // il toro nero di Osborne, la sagoma sulle colline di tutta la Spagna
    const { px, w, gy } = o, K = '#0a0a10';
    for (let xx = 8; xx < 50; xx++) { const t = (xx - 8) / 42, hh = Math.round(8 + 10 * Math.sin(t * Math.PI) * 1.1); px(K, xx, gy - 10 - hh, 1, hh + 4); }     // corpo
    px(K, 6, gy - 26, 8, 10); px(K, 2, gy - 30, 7, 8); px(K, 1, gy - 34, 2, 6); px(K, 9, gy - 34, 2, 6); px(K, 3, gy - 28, 2, 2);                  // testa e corna
    px(K, 12, gy - 32, 18, 7); px(K, 10, gy - 28, 5, 5);                                                                                       // garrese
    for (const lx of [10, 16, 40, 46]) px(K, lx, gy - 8, 3, 12);                                                                                // zampe
    px(K, 50, gy - 22, 3, 14); px(K, 52, gy - 10, 2, 5);                                                                                        // coda
    px(FL2, 4, gy - 28, 1, 1); } };

  LM.belem = { lift: 26, w: 64, h: 44, draw(o) {
    // torre di Belem: la torre merlata con le torrette e le logge, sull'acqua
    const { px, w, gy } = o;
    px(o.dk, 8, gy - 10, w - 16, 10); px(o.dk, 18, gy - 40, 24, 30); for (let k = 0; k < 6; k++) px(o.dk, 18 + k * 4, gy - 43, 2, 3);
    for (const tx of [14, 40]) { px(o.dk, tx, gy - 48, 8, 12); for (let j = 0; j < 6; j++) px(o.dk, tx + Math.floor(j * 0.3), gy - 48 - j, 8 - Math.floor(j * 0.6), 1); }
    for (let k = 0; k < 3; k++) px(FL2, 21 + k * 6, gy - 34, 3, 8); for (let k = 0; k < 4; k++) px(FL2, 14 + k * 9, gy - 6, 4, 5); px(o.dk, 8, gy - 12, 6, 2); px(o.dk, w - 14, gy - 12, 6, 2);
    o.meta.glows.push({ x: w / 2, y: gy - 24, r: 30, col: FL, a: 0.12 }); } };

  LM.lincoln = { lift: 40, w: 104, h: 50, draw(o) {
    // Lincoln Memorial: il tempio di colonne bianche sulla scalinata, illuminato
    const { px, w, gy } = o, W1 = '#d8d6cc', W2 = '#a8a69c';
    for (let k = 0; k < 4; k++) px(W2, 4 + k * 2, gy - 4 + k, w - 8 - k * 4, 1); px(W1, 0, gy - 6, w, 2);
    px(W2, 8, gy - 8, w - 16, 3); for (let k = 0; k < 12; k++) { px(W1, 10 + k * 7.6, gy - 36, 4, 28); px('#8a887e', 13 + k * 7.6, gy - 36, 1, 28); }
    px(W1, 6, gy - 40, w - 12, 4); px(W2, 8, gy - 46, w - 16, 6); px(W1, 12, gy - 50, w - 24, 4); px('#6a6a64', w / 2 - 6, gy - 30, 12, 22); px('#ffe9b8', w / 2 - 4, gy - 28, 8, 18);
    o.meta.glows.push({ x: w / 2, y: gy - 28, r: 54, ry: 0.5, col: '#fff0d0', a: 0.13 }); } };


  // stili di facciata: targhe delle vie, bandiere e particolari (si disegnano in cityFacade, `ex` e `plate`)
  const FX = Street2D.CITY_FACADES;
  const setF = (id, o) => Object.assign(FX[id], o);
  setF('roma_palazzo', { ex: ['plate', 'bucato', 'madonnella', 'tabacchi'], plate: ['#e8e4d4', '#1a1a2a', 'VIA DEL CORSO'] });
  setF('roma_umbertino', { ex: ['plate', 'tabacchi', 'bucato'], plate: ['#e8e4d4', '#1a1a2a', 'VIA DEL CORSO'] });
  setF('parigi_haussmann', { ex: ['plate', 'fleurs', 'tabacFr', 'pharmacy'], plate: ['#1a3a8a', '#f4f1e6', 'RUE DE RIVOLI'] });
  setF('parigi_belleepoque', { ex: ['plate', 'fleurs', 'tabacFr', 'pharmacy'], plate: ['#1a3a8a', '#f4f1e6', 'RUE DE RIVOLI'] });
  setF('londra_mattoni', { ex: ['plate'], plate: ['#f4f1e6', '#1a1a2a', 'REGENT ST W1'], alt: ['pub', 0.3] });
  setF('londra_vittoriano', { ex: ['plate'], plate: ['#f4f1e6', '#1a1a2a', 'REGENT ST W1'], alt: ['pub', 0.45] });
  setF('stoccolma_gamla', { ex: ['plate', 'flag'], plate: ['#1a5aa8', '#f4f1e6', 'STORGATAN'], flag: ['#1a5aa8', 'cross', '#ffd23f'] });
  setF('stoccolma_citta', { ex: ['plate', 'flag'], plate: ['#1a5aa8', '#f4f1e6', 'STORGATAN'], flag: ['#1a5aa8', 'cross', '#ffd23f'] });
  setF('berlino_altbau', { ex: ['plate', 'graffiti'], plate: ['#f4f1e6', '#1a1a2a', 'FRIEDRICHSTR'] });
  setF('berlino_platte', { ex: ['graffiti', 'plate'], plate: ['#f4f1e6', '#1a1a2a', 'FRIEDRICHSTR'], exP: 0.75 });
  setF('praga_barocco', { ex: ['plate', 'statuette'], plate: ['#f4f1e6', '#c4241c', 'NA PRIKOPE'] });
  setF('vienna_ring', { ex: ['plate', 'statuette'], plate: ['#1a3a8a', '#f4f1e6', 'KARNTNER STR'] });
  setF('madrid_granvia', { ex: ['plate', 'jamon', 'statuette'], plate: ['#1a4aa8', '#f4f1e6', 'GRAN VIA'] });
  setF('lisbona_azulejo', { ex: ['plate', 'azulejo', 'bucato', 'balcLights'], plate: ['#e8e4d4', '#2a5aa8', 'RUA AUGUSTA'] });
  setF('atene_cubo', { ex: ['bougainvillea', 'flag', 'plate'], plate: ['#1a4aa8', '#f4f1e6', 'ERMOU'], flag: ['#f4f1e6', 'stripes', '#2a5aa8'] });
  setF('atene_polikatoikia', { ex: ['flag', 'plate'], plate: ['#1a4aa8', '#f4f1e6', 'ERMOU'], flag: ['#f4f1e6', 'stripes', '#2a5aa8'] });
  setF('washington_federale', { ex: ['flag', 'plate'], plate: ['#1a6a3a', '#f4f1e6', 'K ST NW'], flag: ['#f4f1e6', 'us'], exP: 0.7 });
  setF('washington_mattoni', { ex: ['flag', 'plate'], plate: ['#1a6a3a', '#f4f1e6', 'K ST NW'], flag: ['#f4f1e6', 'us'] });

  // ---------------------------------------------------------------- quartieri
  // modello: una funzione che riempie i campi comuni
  const FAR = (a) => a;
  const D = (o) => Object.assign({ len: 1000, dark: 0.28, farDark: 0.55, signP: 0.55, flick: 0.12, hazeA: 1, glowA: 0.14, broken: 0, gradeA: 0.08, people: 5, landP: 0.14 }, o);

  CITY.roma = [
    D({ id: 'roma_corso', name: 'VIA DEL CORSO', len: 1100, kinds: { 'fac:roma_palazzo': 5, 'fac:roma_umbertino': 3, boutique: 0.8, hotel: 0.5 },
      mid: ['#8a6a3e', '#9a5a38'], far: ['#2a1c30', '#321e30', '#261a2c', '#2e2034'], farH: 0.9, win: ['#ffd98a', '#ffe9b8', '#ffc46a'],
      words: ['BAR', 'GELATI', 'PIZZA', 'TRATTORIA', 'FARMACIA', 'TABACCHI', 'OSTERIA', 'CAFFE'], neon: ['#ffb000', '#ff5a3a', '#2ee6ff', '#b8ff3a'],
      haze: [110, 60, 60], glow: [255, 150, 70], lamp: '#ffbf6a', grade: [255, 150, 80], gradeA: 0.1, land: 'colosseo|pantheon|cupola', landP: 0.2, people: 7 }),
    D({ id: 'roma_popolo', name: 'PIAZZA DEL POPOLO', len: 900, kinds: { 'fac:roma_palazzo': 4, 'fac:roma_umbertino': 4, park: 1.2, boutique: 0.5 },
      mid: ['#8a6a3e', '#9a5a38'], far: ['#2a1c30', '#321e30', '#261a2c'], farH: 0.85, win: ['#ffd98a', '#ffe9b8'],
      words: ['CAFFE', 'BAR', 'GELATERIA', 'LIBRERIA', 'ENOTECA', 'PIZZA'], neon: ['#ffb000', '#ff5a3a', '#b8ff3a'],
      haze: [100, 56, 70], glow: [255, 140, 80], lamp: '#ffc070', grade: [255, 130, 70], gradeA: 0.1, land: 'pantheon|cupola|colosseo', landP: 0.16, people: 8 }),
    D({ id: 'roma_eur', name: 'EUR', len: 800, kinds: { office: 3, tower: 2, hotel: 1.2, 'fac:roma_umbertino': 1.5, park: 1 },
      mid: ['#2a3350', '#2a3a5a', '#34304a'], far: ['#1c1850', '#241a58', '#18144a'], farH: 1.1, win: ['#fff0c8', '#ffe9b8', '#cfe6ff'],
      words: ['BANCA', 'UFFICI', 'HOTEL', 'ENI', 'BAR'], neon: ['#2ee6ff', '#ffd98a', '#f4f1e6'], haze: [60, 60, 120], glow: [120, 150, 255], lamp: '#ffd7a0', grade: [180, 160, 255], gradeA: 0.08, land: 'spire', landP: 0.08, people: 4 }),
  ];

  CITY.parigi = [
    D({ id: 'parigi_champs', name: 'CHAMPS-ELYSEES', len: 1200, kinds: { 'fac:parigi_haussmann': 5, 'fac:parigi_belleepoque': 3, boutique: 1.6, hotel: 1 },
      mid: ['#9a907c', '#a89a82'], far: ['#1c2048', '#222654', '#181c42', '#262a5a'], farH: 1, win: ['#ffe9b8', '#ffd98a', '#fff4d8'],
      words: ['CAFE', 'BRASSERIE', 'PHARMACIE', 'TABAC', 'BOULANGERIE', 'HOTEL', 'BISTRO', 'LUXE'], neon: ['#ffd98a', '#ff2e88', '#2ee6ff', '#f4f1e6'],
      haze: [70, 70, 130], glow: [255, 200, 110], lamp: '#ffd98a', grade: [255, 200, 120], gradeA: 0.08, land: 'eiffel|notredame|arco', landP: 0.2, people: 8 }),
    D({ id: 'parigi_concorde', name: 'PLACE DE LA CONCORDE', len: 900, kinds: { 'fac:parigi_haussmann': 4, 'fac:parigi_belleepoque': 4, park: 1.5, hotel: 1 },
      mid: ['#9a907c', '#a89a82'], far: ['#1c2048', '#222654', '#181c42'], farH: 0.95, win: ['#ffe9b8', '#fff4d8'],
      words: ['CAFE', 'BISTRO', 'LIBRAIRIE', 'FLEURS', 'BAR', 'TABAC'], neon: ['#ffd98a', '#ff5a3a', '#b8ff3a'],
      haze: [70, 66, 130], glow: [255, 190, 110], lamp: '#ffd98a', grade: [255, 190, 130], gradeA: 0.08, land: 'eiffel|notredame', landP: 0.22, people: 8 }),
    D({ id: 'parigi_defense', name: 'LA DEFENSE', len: 700, kinds: { tower: 3, office: 2.6, hotel: 1, 'fac:parigi_belleepoque': 1 },
      mid: ['#16405e', '#1b3a6a'], far: ['#16264e', '#1a2c5a', '#142046'], farH: 1.5, win: ['#fff0c8', '#cfe6ff', '#ffe9b8'], dark: 0.3,
      words: ['BANQUE', 'BUREAUX', 'HOTEL', 'METRO'], neon: ['#9fe0ff', '#f4f1e6', '#ffd98a'], haze: [44, 70, 140], glow: [110, 170, 255], lamp: '#e4ecff', grade: [100, 160, 255], gradeA: 0.12, land: 'arco', landP: 0.1, people: 3 }),
  ];

  CITY.londra = [
    D({ id: 'londra_regent', name: 'REGENT STREET', len: 1100, kinds: { 'fac:londra_vittoriano': 5, 'fac:londra_mattoni': 2, boutique: 1.4, hotel: 0.8 },
      mid: ['#7a6a50', '#8a6a4a'], far: ['#1c2038', '#222640', '#181c34', '#262a48'], farH: 1, win: ['#ffd98a', '#ffe9b8', '#ffc46a'],
      words: ['PUB', 'CAFE', 'HOTEL', 'BOOKS', 'CHEMIST', 'TEA ROOMS', 'TAXI', 'BANK'], neon: ['#ffb000', '#ff3a2a', '#2ee6ff', '#b8ff3a'],
      haze: [80, 84, 110], hazeA: 1.3, glow: [255, 160, 70], lamp: '#ffa64a', grade: [150, 170, 210], gradeA: 0.12, land: 'bigben|towerbridge|ferris', landP: 0.2, people: 8 }),
    D({ id: 'londra_trafalgar', name: 'TRAFALGAR SQUARE', len: 900, kinds: { 'fac:londra_vittoriano': 4, 'fac:londra_mattoni': 3, park: 1, hotel: 1 },
      mid: ['#7a6a50', '#8a6a4a'], far: ['#1c2038', '#222640', '#181c34'], farH: 1, win: ['#ffd98a', '#ffe9b8'],
      words: ['PUB', 'GALLERY', 'CAFE', 'TICKETS', 'THEATRE', 'BAR'], neon: ['#ffb000', '#ff3a2a', '#b07bff'],
      haze: [80, 80, 112], hazeA: 1.35, glow: [255, 150, 70], lamp: '#ffa64a', grade: [150, 165, 205], gradeA: 0.12, land: 'bigben|towerbridge|ferris', landP: 0.18, people: 8 }),
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
      haze: [60, 68, 100], glow: [190, 210, 255], lamp: '#e8f0ff', grade: [160, 180, 230], gradeA: 0.12, land: 'brandenburg|fernsehturm|berlindom', landP: 0.2, people: 6 }),
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
      haze: [70, 62, 110], glow: [255, 200, 120], lamp: '#ffe0a0', grade: [220, 190, 150], gradeA: 0.08, land: 'stephansdom|karlskirche|ferris', landP: 0.2, people: 7 }),
    D({ id: 'vienna_stephans', name: 'STEPHANSPLATZ', len: 900, kinds: { 'fac:vienna_ring': 4, 'fac:praga_barocco': 3, boutique: 1.2 },
      mid: ['#9a9482', '#a89c84'], far: ['#1e1a48', '#241e50', '#181440'], farH: 0.95, win: ['#ffe9b8', '#ffd98a'],
      words: ['CAFE', 'SACHER', 'WURST', 'BAR', 'JUWELIER'], neon: ['#ffd98a', '#ff5a3a', '#b8ff3a'],
      haze: [74, 62, 106], glow: [255, 190, 120], lamp: '#ffe0a0', grade: [230, 190, 150], gradeA: 0.08, land: 'stephansdom|karlskirche', landP: 0.28, people: 8 }),
  ];

  CITY.madrid = [
    D({ id: 'madrid_granvia', name: 'GRAN VIA', len: 1200, kinds: { 'fac:madrid_granvia': 6, hotel: 1.2, boutique: 1.2, tower: 0.5 },
      mid: ['#aaa496', '#9a9486'], far: ['#2a1a3c', '#321e44', '#261634', '#2e2048'], farH: 1.1, win: ['#ffe9b8', '#ffd98a', '#fff4d8'], signP: 0.9, flick: 0.2,
      words: ['TAPAS', 'CERVECERIA', 'FARMACIA', 'HOTEL', 'BAR', 'CINE', 'JAMON', 'CAFE'], neon: ['#ff2e88', '#ffb000', '#2ee6ff', '#b8ff3a'],
      haze: [110, 60, 90], glow: [255, 100, 120], lamp: '#ffb860', grade: [255, 120, 120], gradeA: 0.1, land: 'metropolis|toro', landP: 0.26, people: 9 }),
    D({ id: 'madrid_sol', name: 'PUERTA DEL SOL', len: 900, kinds: { 'fac:madrid_granvia': 5, 'fac:parigi_belleepoque': 1.5, boutique: 1 },
      mid: ['#aaa496', '#9a9486'], far: ['#2a1a3c', '#321e44', '#261634'], farH: 1, win: ['#ffe9b8', '#ffd98a'], signP: 0.8,
      words: ['TAPAS', 'BAR', 'CAFE', 'TIENDA', 'LOTERIA', 'RESTAURANTE'], neon: ['#ff2e88', '#ffb000', '#2ee6ff'],
      haze: [110, 60, 84], glow: [255, 110, 120], lamp: '#ffb860', grade: [255, 120, 110], gradeA: 0.1, land: 'metropolis|toro', landP: 0.2, people: 9 }),
  ];

  CITY.lisbona = [
    D({ id: 'lisbona_liberdade', name: 'AVENIDA DA LIBERDADE', len: 1000, kinds: { 'fac:lisbona_azulejo': 4, 'fac:madrid_granvia': 1.5, boutique: 1.2, hotel: 1 },
      mid: ['#4a6a8a', '#8a8a52'], far: ['#1c1c4a', '#22225a', '#181840'], farH: 0.95, win: ['#ffd98a', '#ffe9b8', '#ffc46a'],
      words: ['PASTELARIA', 'CAFE', 'BAR', 'FARMACIA', 'TASCA', 'HOTEL', 'FADO'], neon: ['#ffb000', '#2ee6ff', '#ff5a3a', '#b8ff3a'],
      haze: [100, 70, 80], glow: [255, 170, 100], lamp: '#ffc880', grade: [255, 170, 110], gradeA: 0.1, land: 'santajusta|belem|castelo', landP: 0.22, people: 7 }),
    D({ id: 'lisbona_comercio', name: 'PRACA DO COMERCIO', len: 900, kinds: { 'fac:lisbona_azulejo': 6, 'fac:roma_umbertino': 1, park: 0.6 },
      mid: ['#8a8a52', '#8a6a4a'], far: ['#1c1c4a', '#22225a', '#181840'], farH: 0.9, win: ['#ffd98a', '#ffe9b8'],
      words: ['PASTEIS', 'CAFE', 'TASCA', 'BAR', 'LOJA', 'VINHOS'], neon: ['#ffb000', '#ff5a3a', '#2ee6ff'],
      haze: [96, 70, 90], glow: [255, 160, 100], lamp: '#ffc880', grade: [255, 160, 110], gradeA: 0.1, land: 'belem|castelo|santajusta', landP: 0.24, people: 7 }),
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
      haze: [50, 66, 116], glow: [200, 220, 255], lamp: '#fff0d0', grade: [180, 200, 250], gradeA: 0.1, land: 'campidoglio|lincoln|obelisco', landP: 0.26, people: 5 }),
    D({ id: 'wash_constitution', name: 'CONSTITUTION AVENUE', len: 1000, kinds: { 'fac:washington_federale': 5, park: 1.4, 'fac:washington_mattoni': 1 },
      mid: ['#aaa8a0', '#b4b2aa'], far: ['#141a46', '#1a2050', '#10163c'], farH: 0.85, win: ['#fff4d8', '#ffe9b8'], dark: 0.4, signP: 0.25,
      words: ['MUSEUM', 'CAFE', 'BANK', 'DELI'], neon: ['#ff3a2a', '#2a5fd8', '#f4f1e6'],
      haze: [50, 64, 112], glow: [200, 220, 255], lamp: '#fff0d0', grade: [180, 200, 250], gradeA: 0.1, land: 'lincoln|obelisco|campidoglio', landP: 0.3, people: 4 }),
  ];
  // un monumento ogni 12 tessere lontane (se ne vede più o meno uno per schermo), con una fase diversa per quartiere
  let ph = 2; for (const id in CITY) for (const d of CITY[id]) { if (d.land) { d.landEvery = 12; d.landPhase = ph; ph = (ph + 4) % 9; } }
  // oggetti del marciapiede di ogni quartiere (si disegnano in citta_dettagli.js)
  const PROPS_BY = {
    roma_corso: ['pino', 'nasone', 'tavolini', 'ztl', 'vespa', 'edicola', 'cipresso'], roma_popolo: ['pino', 'fontana', 'tavolini', 'colonna', 'nasone', 'cipresso', 'vespa'], roma_eur: ['pino', 'cipresso', 'ztl', 'vespa'],
    parigi_champs: ['morris', 'platano', 'lampadaire', 'terrasse', 'kiosque', 'wallace'], parigi_concorde: ['platano', 'lampadaire', 'bouquiniste', 'morris', 'terrasse', 'wallace'], parigi_defense: ['metro', 'lampadaire', 'platano'],
    londra_regent: ['cabina', 'pilastro', 'roundel', 'fermata', 'lampioneL', 'ringhiera', 'semaforo'], londra_trafalgar: ['cabina', 'lampioneL', 'roundel', 'fermata', 'pilastro', 'ringhiera'], londra_docklands: ['roundel', 'semaforo', 'lampioneL', 'fermata'],
    stoccolma_drott: ['bandieraSE', 'tbana', 'biciclette', 'betulla', 'cafeSE'], stoccolma_stortorget: ['bandieraSE', 'biciclette', 'cafeSE', 'betulla'],
    berlino_linden: ['ampel', 'litfass', 'tiglio', 'ubahn', 'doner'], berlino_alex: ['ampel', 'ubahn', 'doner', 'mauer', 'litfass'],
    praga_vaclav: ['lampagot', 'statua', 'birreria', 'kastanie'], praga_staromestske: ['lampagot', 'statua', 'birreria', 'kastanie'],
    vienna_ring: ['lampagot', 'wurst', 'kastanie', 'statua', 'ubahn'], vienna_stephans: ['wurst', 'lampagot', 'statua', 'kastanie'],
    madrid_granvia: ['metroM', 'terraza', 'fernandina', 'madrono'], madrid_sol: ['metroM', 'terraza', 'fernandina', 'madrono'],
    lisbona_liberdade: ['palma', 'arraial', 'jacaranda', 'pasteis', 'azulejoPannello'], lisbona_comercio: ['arraial', 'palma', 'pasteis', 'azulejoPannello', 'jacaranda'],
    atene_syntagma: ['olivo', 'bandieraGR', 'periptero', 'colonnaGR', 'gatto', 'arancio'], atene_ermou: ['olivo', 'pergola', 'periptero', 'arancio', 'gatto', 'bandieraGR'],
    wash_penn: ['bandieraUS', 'cassetta', 'idrante', 'metroDC', 'ciliegio', 'hotdog', 'segnaleUS'], wash_constitution: ['bandieraUS', 'ciliegio', 'hotdog', 'idrante', 'cassetta', 'segnaleUS'],
  };
  for (const id in CITY) for (const d of CITY[id]) { d.props = PROPS_BY[d.id] || []; d.propP = 0.9; }
})();
