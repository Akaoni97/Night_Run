// ============================================================================
//  Night Run · Le capitali con l'aspetto di quelle vere (v0.112, chieste da Nico)
//  Si aggancia a Street2D dopo quartieri2d.js. Prima tutte le capitali del Viaggio avevano i quartieri di Tokyo (konbini,
//  ramen, pagode): ora ognuna ha i suoi palazzi, i suoi colori, le sue insegne e i suoi monumenti sullo sfondo.
//  - CITY_FACADES: gli stili di facciata (muro, finestre, tetto, piano terra) di ogni città; `cityFacade(id, r, D)` disegna
//    una tessera di palazzo vicino (stessa forma di quelle di quartieri2d.js: { c, w, h, signs, beacons, shop, glows }).
//  - CITY_LANDMARKS: monumenti lontani (Colosseo, Torre Eiffel, Big Ben, Fernsehturm, Campidoglio...), `cityLandmark`.
//  - CITY_DISTRICTS[id]: i quartieri di ogni capitale, nello stesso formato di Street2D.DISTRICTS (vedi quartieri2d.js);
//    `districtInfo` usa quelli della città dove sei (`this._city`), Tokyo e i luoghi fuori città restano come prima.
//  I disegni sono tutti a codice, niente immagini. Tessere in cache per città (si svuota quando si cambia città).
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, sh = Street2D.shade;

  // tela a mezze unità (v0.114): i monumenti si disegnano al doppio della risoluzione (pixel da 0,5 unità) e la tessera
  // porta `hd: true`, così `drawCity` la usa com'è (come fa con quelle passate da `tileHD`); w e H restano in unità
  const mkHD = (w, H) => {
    const c = document.createElement('canvas'); c.width = w * 2; c.height = H * 2;
    const x = c.getContext('2d', { willReadFrequently: true }); x.setTransform(2, 0, 0, 2, 0, 0);
    const R = (v) => Math.round(v * 2) / 2;
    const px = (col, xx, yy, ww = 1, hh = 1) => { x.fillStyle = col; x.fillRect(R(xx), R(yy), Math.max(0.5, R(ww)), Math.max(0.5, R(hh))); };
    const line = (x0, y0, x1, y1, col) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 0.5) * 2; for (let k = 0; k <= n; k++) px(col, x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n, 0.5, 0.5); };
    return { c, x, px, line, hd: true };
  };

  // piccola tela con i soliti attrezzi di disegno a pixel
  const mk = (w, H) => {
    const c = document.createElement('canvas'); c.width = w; c.height = H;
    const x = c.getContext('2d', { willReadFrequently: true });
    const px = (col, xx, yy, ww = 1, hh = 1) => { x.fillStyle = col; x.fillRect(Math.round(xx), Math.round(yy), Math.round(ww), Math.round(hh)); };
    const line = (x0, y0, x1, y1, col) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1); for (let k = 0; k <= n; k++) px(col, x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n); };
    return { c, x, px, line };
  };

  // ---------------------------------------------------------------- stili di facciata
  // w, h: misure del corpo · wall: colori dei muri (scuri, di notte) · tex: brick, plaster, stone, panel, tile
  // win: sash, arch, shutter, french, rect, tall · frame/shut: infissi · lit: colori dei vetri accesi · dark: quota di finestre spente
  // roof: mansard, copper, tiles, gable, step, flat, pediment, tank, brickpitch · rc: colore del tetto · ground: cafe, arcade, shop, door, columns, tank
  // aw: colori delle tende · chim: comignoli · bal: balconcini (iron, long, none) · words/neon: insegne del piano terra
  const FAC = {
    // ---- Roma: ocra, terracotta, persiane verdi, finestre ad arco, tetto a tegole con altana
    roma_palazzo: { w: [58, 80], h: [82, 118], wall: ['#8a6a3e', '#9a5a38', '#8a7448', '#a06a44'], tex: 'plaster', win: 'shutter', frame: '#d8c9a0', shut: '#3a5a3a', lit: ['#ffd98a', '#ffe9b8', '#ffc46a'], dark: 0.25, step: 15, roof: 'tiles', rc: '#8a3a22', ground: 'arcade', aw: ['#7a2a24', '#d8c9a0'], bal: 'iron', chim: 1, ivy: 1 },
    roma_umbertino: { w: [56, 76], h: [96, 132], wall: ['#7a5a3a', '#8a4a34', '#7a6a50'], tex: 'stone', win: 'arch', frame: '#d8c9a0', shut: '#3a5a3a', lit: ['#ffd98a', '#ffe9b8'], dark: 0.3, step: 16, roof: 'flat', rc: '#6a4a30', ground: 'shop', aw: ['#2a5a3a', '#d8c9a0'], bal: 'long', chim: 0 },
    // ---- Parigi: pietra chiara, tetto a mansarda di zinco con abbaini, balconi in ferro, caffè con tende e tavolini
    parigi_haussmann: { w: [60, 84], h: [92, 124], wall: ['#9a907c', '#a89a82', '#8e8a7e'], tex: 'stone', win: 'french', frame: '#2a2e3a', shut: '#2a2e3a', lit: ['#ffe9b8', '#ffd98a', '#fff4d8'], dark: 0.28, step: 15, roof: 'mansard', rc: '#4a5468', ground: 'cafe', aw: ['#8a1c24', '#2a5a3a', '#1c2a5a'], bal: 'iron', chim: 1 },
    parigi_belleepoque: { w: [56, 72], h: [86, 110], wall: ['#a89a80', '#98907a'], tex: 'stone', win: 'french', frame: '#2a2e3a', shut: '#2a2e3a', lit: ['#ffe9b8', '#fff4d8'], dark: 0.3, step: 14, roof: 'mansard', rc: '#56607a', ground: 'shop', aw: ['#1c2a5a', '#8a1c24'], bal: 'long', chim: 1 },
    // ---- Londra: mattoni rossi e bruni, finestre a ghigliottina bianche, comignoli, porte nere con le ringhiere
    londra_mattoni: { w: [50, 70], h: [78, 110], wall: ['#7a3a2c', '#6a3226', '#7a4a34', '#5a3a30'], tex: 'brick', win: 'sash', frame: '#d8d4c4', shut: '#d8d4c4', lit: ['#ffd98a', '#ffe9b8', '#ffc46a'], dark: 0.3, step: 14, roof: 'brickpitch', rc: '#3a2e34', ground: 'door', aw: ['#1c3a2a', '#2a2a3a'], bal: 'none', chim: 3 },
    londra_vittoriano: { w: [60, 84], h: [84, 116], wall: ['#7a6a50', '#8a6a4a', '#6a5a4a'], tex: 'stone', win: 'sash', frame: '#e0dccb', shut: '#e0dccb', lit: ['#ffd98a', '#ffe9b8'], dark: 0.28, step: 15, roof: 'flat', rc: '#3a3a44', ground: 'shop', aw: ['#1c3a2a', '#7a1c24', '#1c2a5a'], bal: 'iron', chim: 2 },
    // ---- Stoccolma: facciate strette color pastello con frontone a gradoni
    stoccolma_gamla: { w: [44, 60], h: [86, 120], wall: ['#9a7a3a', '#9a4a3a', '#8a6a4a', '#9a6a5a', '#7a8a6a'], tex: 'plaster', win: 'sash', frame: '#e8e4d4', shut: '#e8e4d4', lit: ['#ffd98a', '#ffe9b8', '#ffc46a'], dark: 0.28, step: 14, roof: 'step', rc: '#5a3a3a', ground: 'door', aw: ['#2a4a6a'], bal: 'none', chim: 1 },
    stoccolma_citta: { w: [58, 78], h: [88, 122], wall: ['#7a7a82', '#8a7a6a', '#6a7280'], tex: 'plaster', win: 'rect', frame: '#e8e4d4', shut: '#e8e4d4', lit: ['#fff0c8', '#ffe9b8', '#cfe6ff'], dark: 0.3, step: 14, roof: 'copper', rc: '#3a6a5a', ground: 'shop', aw: ['#2a4a6a', '#9a3a2a'], bal: 'none', chim: 1 },
    // ---- Berlino: Altbau con stucchi e Plattenbau grigi a griglia, luci fredde
    berlino_altbau: { w: [60, 82], h: [90, 124], wall: ['#7a7468', '#6a6a70', '#80766a'], tex: 'plaster', win: 'tall', frame: '#c8c8c0', shut: '#c8c8c0', lit: ['#fff4d8', '#ffe9b8', '#e8f0ff'], dark: 0.3, step: 15, roof: 'flat', rc: '#4a4a52', ground: 'cafe', aw: ['#2a5a3a', '#6a1c24'], bal: 'iron', chim: 0 },
    berlino_platte: { w: [66, 92], h: [100, 146], wall: ['#6a6e76', '#767a80', '#62666e'], tex: 'panel', win: 'rect', frame: '#a8acb2', shut: '#a8acb2', lit: ['#e8f0ff', '#cfe6ff', '#fff4d8'], dark: 0.35, step: 12, roof: 'flat', rc: '#3a3e46', ground: 'shop', aw: ['#2a3a5a'], bal: 'box', chim: 0 },
    // ---- Praga: pastelli barocchi con frontoni a volute e tegole rosse
    praga_barocco: { w: [50, 70], h: [84, 116], wall: ['#9a6a6a', '#7a8a6a', '#9a8a5a', '#6a7a8a', '#8a6a8a'], tex: 'plaster', win: 'arch', frame: '#e8e0cc', shut: '#e8e0cc', lit: ['#ffd98a', '#ffe9b8', '#ffc46a'], dark: 0.28, step: 14, roof: 'step', rc: '#8a3a2a', ground: 'arcade', aw: ['#6a1c24'], bal: 'iron', chim: 1 },
    // ---- Vienna: palazzi chiari della Ringstrasse con cornicione e tetto di rame verde
    vienna_ring: { w: [64, 88], h: [96, 128], wall: ['#9a9482', '#a89c84', '#8e8a7a'], tex: 'stone', win: 'arch', frame: '#e8e2d0', shut: '#e8e2d0', lit: ['#ffe9b8', '#fff4d8', '#ffd98a'], dark: 0.28, step: 16, roof: 'copper', rc: '#3a7a6a', ground: 'columns', aw: ['#6a1c24'], bal: 'long', chim: 1 },
    // ---- Madrid: Gran Via, pietra bianca e ardesia, torrette
    madrid_granvia: { w: [62, 86], h: [100, 134], wall: ['#aaa496', '#9a9486', '#b0a898'], tex: 'stone', win: 'french', frame: '#2a2e3a', shut: '#2a2e3a', lit: ['#ffe9b8', '#ffd98a', '#fff4d8'], dark: 0.28, step: 15, roof: 'mansard', rc: '#3a4252', ground: 'shop', aw: ['#8a1c24', '#2a3a5a', '#2a5a3a'], bal: 'iron', chim: 0 },
    // ---- Lisbona: facciate a azulejos, ferro battuto, tetti di tegole
    lisbona_azulejo: { w: [46, 62], h: [80, 112], wall: ['#4a6a8a', '#8a8a52', '#8a6a4a', '#5a7a7a', '#8a5a4a'], tex: 'tile', win: 'shutter', frame: '#e8e4d4', shut: '#5a3a24', lit: ['#ffd98a', '#ffe9b8', '#ffc46a'], dark: 0.3, step: 14, roof: 'tiles', rc: '#9a4a2a', ground: 'door', aw: ['#2a4a6a'], bal: 'iron', chim: 1 },
    // ---- Atene: cubi bianchi con terrazza e persiane azzurre, polikatoikia di cemento con tende
    atene_cubo: { w: [48, 66], h: [60, 96], wall: ['#b8b4a8', '#c0bcb0', '#a8a89c'], tex: 'plaster', win: 'shutter', frame: '#e8e8e0', shut: '#2a5a9a', lit: ['#ffe9b8', '#ffd98a', '#fff4d8'], dark: 0.3, step: 14, roof: 'tank', rc: '#8a8a82', ground: 'door', aw: ['#2a5a9a', '#e8e8e0'], bal: 'box', chim: 0 },
    atene_polikatoikia: { w: [58, 80], h: [90, 128], wall: ['#8a8678', '#9a9686', '#7e7a70'], tex: 'panel', win: 'rect', frame: '#d8d4c4', shut: '#d8d4c4', lit: ['#ffe9b8', '#ffd98a', '#fff4d8'], dark: 0.3, step: 14, roof: 'tank', rc: '#6a665c', ground: 'shop', aw: ['#2a5a9a', '#8a1c24', '#e8e8e0'], bal: 'box', chim: 0 },
    // ---- Washington: edifici federali bianchi con colonne e frontone, case di mattoni
    washington_federale: { w: [66, 92], h: [70, 100], wall: ['#aaa8a0', '#b4b2aa', '#a0a098'], tex: 'stone', win: 'rect', frame: '#e8e8e0', shut: '#e8e8e0', lit: ['#fff4d8', '#ffe9b8'], dark: 0.35, step: 15, roof: 'pediment', rc: '#8a8a84', ground: 'columns', aw: ['#6a1c24'], bal: 'none', chim: 0 },
    washington_mattoni: { w: [50, 68], h: [76, 104], wall: ['#7a4a3a', '#8a5a44', '#6a4a40'], tex: 'brick', win: 'sash', frame: '#e8e4d4', shut: '#1c3a2a', lit: ['#ffd98a', '#ffe9b8'], dark: 0.3, step: 14, roof: 'flat', rc: '#3a3a40', ground: 'door', aw: ['#1c3a2a', '#6a1c24'], bal: 'none', chim: 2 },
  };
  Street2D.CITY_FACADES = FAC;

  // ---------------------------------------------------------------- una facciata
  S.cityFacade = function (id, r, D) {
    const P = FAC[id], ink = this.C.ink, TOP = 46;
    const w = P.w[0] + Math.floor(r(1) * (P.w[1] - P.w[0] + 1)), h = P.h[0] + Math.floor(r(2) * (P.h[1] - P.h[0] + 1)), gy = TOP + h;
    const { c, x: cx, px, line } = mk(w + 2, h + TOP + 1), winPos = [];
    const meta = { w: w + 2, h: h + TOP + 1, signs: [], beacons: [], shop: null, glows: [] };
    const wall = P.wall[Math.floor(r(4) * P.wall.length)], gH = P.ground === 'tank' ? 0 : 20, ground = P.alt && r(23) < P.alt[1] ? P.alt[0] : P.ground;       // altezza del piano terra
    // corpo
    px(ink, 0, TOP, w + 2, h + 1); px(wall, 1, TOP + 1, w, h - 1);
    px(sh(wall, 0.14), 1, TOP + 1, 3, h - 1); px(sh(wall, -0.3), w - 1, TOP + 1, 2, h - 1);
    // trama del muro
    if (P.tex === 'brick') { for (let yy = TOP + 2; yy < gy - gH; yy += 3) { px(sh(wall, -0.2), 1, yy, w, 1); for (let xx = 1 + ((yy / 3) % 2) * 3; xx < w; xx += 6) px(sh(wall, -0.2), xx, yy - 2, 1, 2); } }
    else if (P.tex === 'stone') { for (let yy = TOP + 6; yy < gy - gH; yy += 9) { px(sh(wall, -0.16), 1, yy, w, 1); px(sh(wall, 0.12), 1, yy + 1, w, 1); } }
    else if (P.tex === 'panel') { for (let yy = TOP + 6; yy < gy - gH; yy += 12) px(sh(wall, -0.18), 1, yy, w, 1); for (let xx = 8; xx < w; xx += 11) px(sh(wall, -0.14), xx, TOP + 1, 1, h - 1); }
    else if (P.tex === 'plaster') { for (let q = 0; q < 14; q++) px(sh(wall, r(q + 50) < 0.5 ? 0.08 : -0.1), 2 + r(q * 3.1 + 60) * (w - 6), TOP + 3 + r(q * 1.7 + 61) * (h - gH - 8), 2 + Math.floor(r(q + 62) * 4), 1); }
    // cornicione / marcapiano
    px(sh(wall, 0.3), 0, TOP + 1, w + 2, 2); px(ink, 0, TOP + 3, w + 2, 1);
    // finestre
    const stepY = P.step, ww = P.win === 'tall' || P.win === 'french' ? 6 : P.win === 'rect' ? 7 : 6, wh = P.win === 'tall' ? 11 : P.win === 'french' ? 11 : P.win === 'rect' ? 6 : 8;
    const nx = Math.max(2, Math.floor((w - 8) / (ww + 6))), gap = (w - nx * ww) / (nx + 1);
    const y0 = TOP + 9, y1 = gy - gH - wh - 3;
    const win = (xx, yy, lit, q) => {
      const frame = P.frame, glass = lit ? P.lit[Math.floor(q * 7) % P.lit.length] : '#0d1426';
      if (P.win === 'shutter') { px(ink, xx - 3, yy - 1, ww + 6, wh + 2); px(P.shut, xx - 3, yy, 2, wh); px(P.shut, xx + ww + 1, yy, 2, wh); for (let k = 1; k < wh; k += 2) { px(sh(P.shut, -0.3), xx - 3, yy + k, 2, 1); px(sh(P.shut, -0.3), xx + ww + 1, yy + k, 2, 1); } }
      else px(ink, xx - 1, yy - 1, ww + 2, wh + 2);
      px(glass, xx, yy, ww, wh); if (lit) px(sh(glass, 0.35), xx, yy, ww, 1);
      if (P.win === 'sash') { px(frame, xx - 1, yy - 1, ww + 2, 1); px(frame, xx - 1, yy + wh, ww + 2, 1); px(frame, xx - 1, yy, 1, wh); px(frame, xx + ww, yy, 1, wh); px(frame, xx + ww / 2, yy, 1, wh); px(frame, xx, yy + wh / 2 - 1, ww, 1); }
      else if (P.win === 'arch') { px(wall, xx - 1, yy - 1, 1, 1); px(wall, xx + ww, yy - 1, 1, 1); px(frame, xx - 1, yy - 2, ww + 2, 1); px(frame, xx - 1, yy + wh, ww + 2, 1); if (!lit) px('#1a2440', xx, yy, 1, wh); px(ink, xx + ww / 2, yy, 1, wh); }
      else if (P.win === 'french' || P.win === 'tall') { px(frame, xx - 1, yy - 2, ww + 2, 1); px(ink, xx + ww / 2, yy, 1, wh); px(frame, xx - 1, yy + wh, ww + 2, 1); if (P.bal === 'iron' || P.bal === 'long') { px(ink, xx - 2, yy + wh - 3, ww + 4, 1); for (let k = 0; k < ww + 4; k += 2) px(ink, xx - 2 + k, yy + wh - 3, 1, 4); } }
      else { px(frame, xx - 1, yy - 1, ww + 2, 1); px(frame, xx - 1, yy + wh, ww + 2, 1); px(ink, xx + ww / 2, yy, 1, wh); }
      if (lit && q < 0.22) px(sh(glass, -0.4), xx, yy + 1, ww, 3);                      // tenda
      else if (lit && q < 0.32) { px('#1a1530', xx + 2, yy + 3, 2, wh - 3); px(this.C.skin, xx + 2, yy + 2, 2, 2); }   // sagoma
    };
    for (let yy = y0, row = 0; yy <= y1; yy += stepY, row++) {
      for (let k = 0; k < nx; k++) {
        const xx = Math.round(gap * (k + 1) + ww * k), q = r(xx * 0.31 + yy * 1.7 + 9);
        win(xx + 1, yy, q >= P.dark, r(xx * 1.3 + yy * 0.7)); winPos.push([xx + 1, yy, ww, wh]);
      }
      if (P.bal === 'long' && row % 2 === 1) { px(ink, 1, yy + wh + 1, w, 1); for (let k = 2; k < w; k += 3) px(ink, k, yy + wh + 1, 1, 3); }
      if (P.bal === 'box' && row % 2 === 0) for (let k = 0; k < nx; k += 2) { const xx = Math.round(gap * (k + 1) + ww * k); px(ink, xx - 1, yy + wh + 1, ww + 4, 3); px(sh(wall, 0.1), xx, yy + wh + 1, ww + 2, 2); }
    }
    if (P.ivy) for (let q = 0; q < 3; q++) { const ix = 3 + r(q + 70) * (w - 12), iy = TOP + 20 + r(q + 71) * (h - 60); for (let k = 0; k < 18; k++) px(k % 3 ? '#2a5a34' : '#3a7a44', ix + (k % 4), iy + k, 1 + (k % 2), 1); }
    // tetto
    const rc = P.rc, rt = P.roof;
    if (rt === 'mansard' || rt === 'copper') {
      const rh = 15; for (let j = 0; j < rh; j++) { const ins = Math.round(j * 0.4); px(ink, ins, TOP - rh + j, w + 2 - ins * 2, 1); px(j % 3 ? rc : sh(rc, -0.2), ins + 1, TOP - rh + j, w - ins * 2, 1); }
      px(sh(rc, 0.3), 3, TOP - rh + 1, w - 4, 1);
      const nd = Math.max(2, Math.floor(w / 24));
      for (let k = 0; k < nd; k++) { const dx = Math.round((w / nd) * (k + 0.5)) - 3, lit = r(k + 80) > 0.3; px(ink, dx - 1, TOP - 11, 8, 9); px(lit ? P.lit[0] : '#0d1426', dx, TOP - 9, 6, 6); px(sh(rc, 0.4), dx - 1, TOP - 12, 8, 1); px(ink, dx + 3, TOP - 9, 1, 6); px(sh(rc, 0.25), dx + 2, TOP - 14, 2, 3); }
      for (let q = 0; q < P.chim; q++) { const cx = 6 + Math.floor(r(q + 90) * (w - 16)); px(ink, cx, TOP - rh - 8, 5, 9); px('#4a3a34', cx + 1, TOP - rh - 7, 3, 8); px(ink, cx - 1, TOP - rh - 9, 7, 2); }
    } else if (rt === 'tiles') {
      px(ink, -1, TOP - 4, w + 4, 5); px(rc, 0, TOP - 3, w + 2, 3); for (let k = 0; k < w + 2; k += 3) px(sh(rc, -0.25), k, TOP - 3, 1, 3); px(sh(rc, 0.3), 0, TOP - 3, w + 2, 1);
      if (r(14) < 0.5) { const ax = 6 + Math.floor(r(15) * (w - 30)); px(ink, ax - 1, TOP - 18, 24, 15); px(sh(wall, 0.05), ax, TOP - 17, 22, 14); for (let k = 0; k < 4; k++) { px(P.lit[0], ax + 2 + k * 5, TOP - 14, 3, 9); px(ink, ax + 3 + k * 5, TOP - 14, 1, 9); } px(ink, ax - 2, TOP - 20, 28, 3); px(rc, ax - 1, TOP - 19, 26, 2); }   // altana
      for (let q = 0; q < P.chim; q++) { const cx = 8 + Math.floor(r(q + 91) * (w - 20)); px(ink, cx, TOP - 12, 5, 9); px('#6a4a3a', cx + 1, TOP - 11, 3, 8); px(ink, cx - 1, TOP - 13, 7, 2); }
    } else if (rt === 'gable' || rt === 'step') {
      const gh = 18;
      if (rt === 'gable') { for (let j = 0; j < gh; j++) { const ins = Math.round(j * (w / 2) / gh); px(ink, ins, TOP - gh + j, w + 2 - ins * 2, 1); px(rc, ins + 1, TOP - gh + j, Math.max(0, w - ins * 2), 1); } }
      else { for (let s = 0; s < 6; s++) { const ins = 2 + Math.round(s * (w / 2 - 4) / 6), yy = TOP - 3 - s * 3; px(ink, ins, yy, w + 2 - ins * 2, 3); px(sh(wall, s % 2 ? 0.1 : 0), ins + 1, yy + 1, Math.max(0, w - ins * 2), 2); px(sh(wall, 0.3), ins + 1, yy + 1, Math.max(0, w - ins * 2), 1); }
        px(ink, w / 2, TOP - 26, 2, 8); px(P.lit[0], w / 2 - 2, TOP - 12, 5, 4); px(ink, w / 2 - 3, TOP - 13, 7, 1); }
      for (let q = 0; q < P.chim; q++) { const cx = 6 + Math.floor(r(q + 92) * (w - 14)); px(ink, cx, TOP - 22, 4, 12); px('#5a4a44', cx + 1, TOP - 21, 2, 11); px(ink, cx - 1, TOP - 23, 6, 2); }
    } else if (rt === 'brickpitch') {
      px(ink, -1, TOP - 7, w + 4, 8); px(rc, 0, TOP - 6, w + 2, 6); for (let k = 0; k < w + 2; k += 4) px(sh(rc, -0.25), k, TOP - 6, 1, 6);
      for (let q = 0; q < P.chim; q++) { const cx = 6 + Math.floor((w - 16) * (q + 0.3) / P.chim); px(ink, cx, TOP - 20, 6, 14); px('#6a3a2c', cx + 1, TOP - 19, 4, 13); for (let k = 0; k < 4; k++) px(sh('#6a3a2c', -0.3), cx + 1, TOP - 19 + k * 3, 4, 1); px(ink, cx - 1, TOP - 22, 8, 3); px('#b8643a', cx, TOP - 21, 2, 2); px('#b8643a', cx + 3, TOP - 21, 2, 2); }
    } else if (rt === 'pediment') {
      const pw = w - 6, ph = 16; for (let j = 0; j < ph; j++) { const ins = Math.round((ph - j) * (pw / 2) / ph); px(ink, 3 + ins - 1, TOP - ph + j, pw + 2 - ins * 2, 1); px(sh(wall, 0.2), 3 + ins, TOP - ph + j, Math.max(0, pw - ins * 2), 1); }
      px(ink, 2, TOP - 1, w, 2); px(sh(wall, 0.35), 3, TOP - 1, w - 2, 1);
      px('#fff4d8', w / 2 - 1, TOP - 10, 3, 3); px(ink, w / 2, TOP - 28, 1, 14); px('#c42a1a', w / 2 + 1, TOP - 28, 6, 4); px('#f4f1e6', w / 2 + 1, TOP - 24, 6, 2); px('#2a3a8c', w / 2 + 1, TOP - 22, 6, 2);   // bandiera
    } else if (rt === 'tank') {
      px(ink, -1, TOP - 3, w + 4, 4); px(sh(wall, 0.3), 0, TOP - 2, w + 2, 2);
      const tx = 6 + Math.floor(r(16) * (w - 22)); px(ink, tx, TOP - 14, 12, 10); px('#7a8a9a', tx + 1, TOP - 13, 10, 8); px('#a8b8c8', tx + 1, TOP - 13, 10, 1); px(ink, tx + 2, TOP - 4, 1, 2); px(ink, tx + 9, TOP - 4, 1, 2);
      if (r(17) < 0.6) { px(ink, w - 16, TOP - 12, 2, 9); px(ink, w - 20, TOP - 12, 10, 1); px(ink, w - 18, TOP - 9, 6, 1); }            // antenna
      for (let k = 0; k < 3; k++) { const px0 = 4 + k * 8; if (r(k + 18) < 0.5) { px('#2f6a3e', px0, TOP - 6, 5, 4); px('#3f8a52', px0 + 1, TOP - 8, 3, 3); } }
    } else {                                                                                       // flat
      px(ink, -1, TOP - 3, w + 4, 4); px(sh(wall, 0.3), 0, TOP - 2, w + 2, 2);
      for (let q = 0; q < P.chim; q++) { const cx = 6 + Math.floor((w - 16) * (q + 0.4) / Math.max(1, P.chim)); px(ink, cx, TOP - 14, 5, 12); px('#4a3a34', cx + 1, TOP - 13, 3, 11); px(ink, cx - 1, TOP - 15, 7, 2); }
      if (r(19) < 0.4) { px(ink, w - 18, TOP - 9, 14, 6); px('#5a6070', w - 17, TOP - 8, 12, 4); }
    }
    // piano terra
    if (gH) {
      px(ink, 0, gy - gH, w + 2, gH + 1); px(sh(wall, -0.45), 1, gy - gH + 1, w, gH - 1);
      const lit = r(13) < 0.78, glass = lit ? ['#ffe6a3', '#ffd9a0', '#fff0c8'][Math.floor(r(16) * 3)] : '#1b2a44';
      if (ground === 'arcade') {
        const n = Math.max(3, Math.floor(w / 14)), pw = (w - 2) / n;
        for (let k = 0; k < n; k++) { const ax = 1 + Math.round(k * pw), aw = Math.round(pw) - 3; px(ink, ax + 1, gy - gH + 2, aw + 2, gH - 2); px(lit ? glass : '#0d1426', ax + 2, gy - gH + 3, aw, gH - 3); px(ink, ax + 1, gy - gH + 2, 1, 1); px(ink, ax + aw + 2, gy - gH + 2, 1, 1); if (lit) px(sh(glass, -0.3), ax + 2, gy - 6, aw, 5); px(sh(wall, 0.2), ax + 1, gy - gH + 1, aw + 2, 1); }
        if (lit) meta.shop = { x: w / 2, w: w - 10, col: glass };
      } else if (ground === 'columns') {
        px(ink, 2, gy - gH + 1, w - 2, 2); px(sh(wall, 0.3), 3, gy - gH + 1, w - 4, 1);
        for (let k = 4; k < w - 3; k += 9) { px(ink, k, gy - gH + 3, 4, gH - 3); px(sh(wall, 0.25), k + 1, gy - gH + 3, 2, gH - 3); }
        px('#241a12', 8, gy - 12, 10, 12); px(lit ? glass : '#0d1426', 10, gy - 11, 6, 11); if (lit) meta.shop = { x: 13, w: 14, col: glass };
        px(ink, 0, gy - 2, w + 2, 2); px(sh(wall, 0.15), 1, gy - 2, w, 1);
      } else if (ground === 'cafe') {
        px(lit ? glass : '#1b2a44', 5, gy - 14, w - 20, 12); px(sh(glass, -0.3), 5, gy - 6, w - 20, 4); if (!lit) px('#2a3a54', 5, gy - 14, w - 20, 1);
        for (let k = 9; k < w - 18; k += 10) { px('#1a1530', k, gy - 9, 3, 7); px(this.C.skin, k, gy - 11, 3, 3); }
        const a = P.aw[Math.floor(r(14) * P.aw.length)]; for (let k = 1; k < w + 1; k++) px(Math.floor(k / 4) % 2 ? a : '#e8e0cc', k, gy - gH + 1, 1, 4); for (let k = 1; k < w + 1; k += 4) px(a, k, gy - gH + 5, 2, 2); px('rgba(0,0,0,.35)', 1, gy - gH + 5, w, 1);
        px('#241a12', w - 12, gy - 13, 8, 13); px('#3a2a1c', w - 11, gy - 12, 6, 12);
        for (let k = 0; k < 2; k++) { const tx = 6 + k * 14; px(ink, tx, gy - 2, 7, 1); px(ink, tx + 3, gy - 2, 1, 2); px('#e8e0cc', tx, gy - 3, 7, 1); }
        if (lit) meta.shop = { x: 5 + (w - 20) / 2, w: w - 20, col: glass };
      } else if (ground === 'shop') {
        px(lit ? glass : '#1b2a44', 5, gy - 14, w - 20, 13); if (lit) { px(sh(glass, -0.25), 5, gy - 5, w - 20, 4); for (let k = 8; k < w - 18; k += 8) px(['#6b4a2e', '#2b8a6e', '#c42a1a', '#163a8c'][Math.floor(r(k) * 4)], k, gy - 9, 3, 4); }
        const a = P.aw[Math.floor(r(14) * P.aw.length)]; px(a, 1, gy - gH + 1, w, 3); for (let k = 1; k < w; k += 5) px(sh(a, 0.25), k, gy - gH + 1, 2, 3);
        px('#241a12', w - 12, gy - 13, 8, 13); px('#3a2a1c', w - 11, gy - 12, 6, 12); px('#d9c08a', w - 6, gy - 7, 1, 1);
        if (lit) meta.shop = { x: 5 + (w - 20) / 2, w: w - 20, col: glass };
      } else if (ground === 'pub') {
        // pub: facciata nera e verde con le lettere d'oro, finestre calde a riquadri, lanterne e insegna a bandiera
        px(sh('#14301f', 0.05), 1, gy - gH + 1, w, gH - 1); px('#c9a84a', 1, gy - gH + 1, w, 1); px('#0a1a12', 1, gy - gH + 6, w, 1);
        let name = ['THE ROYAL OAK', 'THE CROWN', 'RED LION', 'KINGS ARMS', 'WHITE HART', 'THE ANCHOR'][Math.floor(r(24) * 6)]; while (name.length > 3 && this.textW(name, 1) > w - 10) name = name.slice(0, -1);
        this.text(cx, name, Math.round((w + 2 - this.textW(name, 1)) / 2), gy - gH + 2, '#e8c878', 1);
        for (let k = 4; k < w - 18; k += 13) { px(ink, k, gy - 13, 11, 11); px(lit ? '#ffcf7a' : '#2a1d12', k + 1, gy - 12, 9, 9); px(ink, k + 5, gy - 12, 1, 9); px(ink, k + 1, gy - 8, 9, 1); if (lit) meta.glows.push({ x: k + 5, y: gy - 8, r: 9, col: '#ffcf7a', a: 0.08 }); }
        px('#241a12', w - 12, gy - 13, 8, 13); px('#3a2a1c', w - 11, gy - 12, 6, 12); px('#c9a84a', w - 6, gy - 7, 1, 1);
        px(ink, w - 3, gy - gH - 6, 1, 9); px(ink, w - 3, gy - gH - 6, 6, 1); px(ink, w + 1, gy - gH - 5, 1, 3); px('#c9a84a', w - 1, gy - gH - 2, 5, 5); px('#5a3a1a', w, gy - gH - 1, 3, 3);   // insegna a bandiera
        if (lit) meta.shop = { x: w / 2, w: w - 14, col: '#ffcf7a' };
      } else if (ground === 'door') {
        px(sh(wall, -0.2), 1, gy - gH + 1, w, 2);
        for (let k = 0; k < 2; k++) { const dx = 6 + k * Math.floor(w / 2 - 6); if (dx + 10 > w) continue; px(ink, dx, gy - 15, 10, 15); px(r(k + 20) < 0.5 ? '#14181e' : '#2a1d3a', dx + 1, gy - 14, 8, 14); px(lit ? '#ffd98a' : '#0d1426', dx + 2, gy - 14, 6, 3); px('#c9a84a', dx + 7, gy - 7, 1, 1); px(sh(wall, 0.3), dx - 1, gy - 1, 12, 1); px(sh(wall, 0.2), dx - 2, gy - 2, 14, 2); if (lit) meta.glows.push({ x: dx + 5, y: gy - 12, r: 8, col: '#ffd98a', a: 0.08 }); }
        px(ink, 1, gy - 5, w, 1); for (let k = 2; k < w; k += 4) px(ink, k, gy - 5, 1, 5);     // ringhiera
      }
      // insegna al neon sul piano terra
      if (D && D.words && r(6) < D.signP) {
        let word = D.words[Math.floor(r(7) * D.words.length)];
        const sc = this.textW(word, 2) <= w - 14 ? 2 : 1;
        while (this.textW(word, sc) > w - 10) word = word.slice(0, -1);
        meta.signs.push({ word, sc, x: Math.round((w + 2 - this.textW(word, sc)) / 2), y: TOP + 6 + Math.floor(r(8) * (h - 50)), col: D.neon[Math.floor(r(9) * D.neon.length)], flick: r(10) < D.flick });
      }
    }
    // particolari della città: targhe, insegne, bucato, bandiere, fiori... (P.ex, ognuno con la sua probabilità)
    const EX = {
      plate: () => { const T = P.plate; if (!T || !gH) return; let tx = T[2]; while (tx.length > 3 && this.textW(tx, 1) > w - 12) tx = tx.slice(0, -1); const tw = this.textW(tx, 1), xx = 5 + Math.floor(r(30) * Math.max(1, w - tw - 14)), yy = gy - gH - 7;
        px(ink, xx - 2, yy - 1, tw + 4, 8); px(T[0], xx - 1, yy, tw + 2, 6); this.text(cx, tx, xx, yy + 0.5, T[1], 1); },
      tabacchi: () => { if (!gH) return; const xx = w - 12 - Math.floor(r(31) * 8), yy = gy - gH - 14; px(ink, xx - 1, yy - 1, 10, 12); px('#14141c', xx, yy, 8, 10); this.text(cx, 'T', xx + 2, yy + 2, '#f4f1e6', 1); px('#f4f1e6', xx + 1, yy + 8, 6, 1); meta.glows.push({ x: xx + 4, y: yy + 5, r: 7, col: '#ffffff', a: 0.05 }); },
      tabacFr: () => { if (!gH) return; const xx = w - 13 - Math.floor(r(32) * 6), yy = gy - gH - 15; for (let j = 0; j < 5; j++) { const ww = (5 - j) * 2 - 1; px('#d82a2a', xx + 5 - (5 - j), yy + 4 + j, ww, 1); px('#d82a2a', xx + 5 - (5 - j), yy + 4 - j, ww, 1); } px('#ffd0d0', xx + 3, yy + 3, 2, 2); meta.glows.push({ x: xx + 4, y: yy + 4, r: 9, col: '#ff3a2a', a: 0.12 }); },
      pharmacy: () => { if (!gH) return; const xx = 6 + Math.floor(r(33) * 10), yy = gy - gH - 15; px(ink, xx - 1, yy - 1, 11, 11); px('#14301f', xx, yy, 9, 9); px('#3aff7a', xx + 3, yy + 1, 3, 7); px('#3aff7a', xx + 1, yy + 3, 7, 3); meta.glows.push({ x: xx + 4.5, y: yy + 4.5, r: 12, col: '#3aff7a', a: 0.18 }); },
      bucato: () => { const row = winPos[Math.floor(r(34) * winPos.length)]; if (!row) return; const y = row[1] + row[3] + 3; px(ink, 2, y, w - 2, 1);
        for (let k = 5; k < w - 8; k += 6) { const col = ['#e8e4d4', '#c4241c', '#2a6ad8', '#e8c84a', '#d87aa8'][Math.floor(r(35 + k) * 5)]; px(col, k, y + 1, 4, 5 + Math.floor(r(36 + k) * 3)); px(sh(col, -0.3), k + 3, y + 1, 1, 5); } },
      madonnella: () => { const yy = TOP + 22 + Math.floor(r(37) * 20), xx = 4 + Math.floor(r(38) * (w - 16)); px(ink, xx - 1, yy - 1, 8, 12); px('#3a5a8a', xx, yy, 6, 10); px('#e8d8a8', xx + 2, yy + 2, 2, 4); px('#c9a84a', xx + 1, yy + 1, 4, 1); px('#ffe9b8', xx + 2, yy + 7, 2, 1); meta.glows.push({ x: xx + 3, y: yy + 5, r: 10, col: '#ffd98a', a: 0.12 }); },
      fleurs: () => { for (const [xx, yy, ww, wh] of winPos) if (r(xx * 3.1 + yy) < 0.7) { px(ink, xx - 2, yy + wh - 1, ww + 4, 3); px('#2f6a3a', xx - 1, yy + wh - 1, ww + 2, 1); for (let k = 0; k < ww + 2; k += 2) px(k % 4 ? '#d82a2a' : '#f0a0c0', xx - 1 + k, yy + wh - 2, 1, 1); } },
      flag: () => { const T = P.flag; if (!T) return; const xx = w - 9, yy = TOP - 24; px(ink, xx, yy, 1, 24); px(T[0], xx + 1, yy + 1, 9, 6); if (T[1] === 'cross') { px(T[2], xx + 3, yy + 1, 2, 6); px(T[2], xx + 1, yy + 3, 9, 1); } else if (T[1] === 'stripes') { for (let k = 0; k < 6; k += 2) px(T[2], xx + 1, yy + 1 + k, 9, 1); px('#2a5aa8', xx + 1, yy + 1, 4, 4); px('#f4f1e6', xx + 2, yy + 1, 1, 4); } else if (T[1] === 'us') { for (let k = 0; k < 6; k += 2) px('#d82a2a', xx + 1, yy + 1 + k, 9, 1); px('#1a2a8a', xx + 1, yy + 1, 4, 4); } },
      graffiti: () => { if (!gH) return; for (let k = 0; k < 3; k++) { const col = ['#e84a8a', '#2ad8e8', '#e8c84a', '#8a5aff', '#3aff7a'][Math.floor(r(40 + k) * 5)]; const gx = 4 + k * Math.floor((w - 12) / 3), gyy = gy - 12 - Math.floor(r(43 + k) * 3); for (let j = 0; j < 14; j++) px(col, gx + j, gyy + Math.round(Math.sin(j * 0.8 + k) * 2), 1, 2); px(ink, gx + 1, gyy + 3, 10, 1); } },
      azulejo: () => { const xx = 4 + Math.floor(r(44) * (w - 22)), yy = gy - gH - 14; px(ink, xx - 1, yy - 1, 16, 14); px('#e8e4d4', xx, yy, 14, 12); for (let a = 0; a < 7; a++) for (let b = 0; b < 6; b++) if ((a + b) % 2 === 0) px('#2a5aa8', xx + a * 2, yy + b * 2, 2, 2); px('#2a5aa8', xx, yy, 14, 1); px('#2a5aa8', xx, yy + 11, 14, 1); },
      jamon: () => { if (!meta.shop) return; const sx = meta.shop.x - meta.shop.w / 2 + 2; for (let k = 0; k < 4; k++) { const hx = sx + 3 + k * 8; if (hx > w - 16) break; px('#5a2a1a', hx, gy - 14, 1, 2); px('#a03a2a', hx - 1, gy - 12, 4, 5); px('#7a2a1a', hx, gy - 7, 2, 2); px('#e8d8c0', hx + 1, gy - 12, 1, 2); } },
      statuette: () => { for (let k = 0; k < 3; k++) { const xx = 8 + k * Math.floor((w - 18) / 2); px(ink, xx - 1, TOP - 12, 5, 11); px('#6a6a62', xx, TOP - 11, 3, 9); px('#6a6a62', xx - 1, TOP - 9, 5, 1); px('#6a6a62', xx, TOP - 13, 3, 2); } },
      bougainvillea: () => { const xx = w - 4 - Math.floor(r(45) * 10); for (let k = 0; k < 14; k++) { px(k % 3 ? '#c8208a' : '#e84aa8', xx - (k * 5) % 12, TOP + 4 + (k * 3) % 26, 3, 2); } for (let k = 0; k < 8; k++) px('#2f6a3a', xx - (k * 4) % 12 + 1, TOP + 5 + (k * 4) % 26, 2, 1); },
      balcLights: () => { const y = TOP + 8 + Math.floor(r(46) * 20); px(ink, 3, y, w - 3, 1); for (let k = 5; k < w - 4; k += 4) px(['#ff5a3a', '#ffd23f', '#3ad8a0', '#5a8aff'][(k >> 2) % 4], k, y + 1, 2, 2); },
    };
    (P.ex || []).forEach((name, k) => { if (EX[name] && r(200 + k * 3.3) < (P.exP == null ? 0.55 : P.exP)) EX[name](); });
    if (r(21) < 0.35 && (rt === 'flat' || rt === 'tank' || rt === 'pediment')) meta.beacons.push({ x: 8, y: TOP - 4 });
    return { c, ...meta };
  };

  // ---------------------------------------------------------------- monumenti lontani
  // (si riempiono dopo: Colosseo, Eiffel, Big Ben, ...). Stessa forma di S.landmark in quartieri2d.js.
  const LM = {};
  Street2D.CITY_LANDMARKS = LM;
  const baseLandmark = S.landmark;
  S.landmark = function (kind, r, D) {
    if (!LM[kind]) return baseLandmark.call(this, kind, r, D);
    // `lift`: i monumenti bassi (Colosseo, Partenone...) poggiano su un basamento di case lontane, così sporgono sopra i palazzi vicini
    const d = LM[kind], w = d.w, h = d.h, lift = d.lift || 0, top = 25, { c, px, line, x, hd } = (d.hd ? mkHD : mk)(w + 2, h + 26 + lift), gy = top + h;
    const base = D.far[0], dk = sh(base, -0.25), lt = sh(base, 0.5), meta = { w: w + 2, h: h + 26 + lift, signs: [], beacons: [], shop: null, glows: [] };
    if (lift) {
      for (let xx = 0, k = 0; xx < w + 2; k++) { const bw = 10 + Math.floor(r(60 + k) * 10), bh = Math.round(lift * (0.62 + 0.38 * r(70 + k))); px(dk, xx, gy + lift - bh, Math.min(bw, w + 2 - xx), bh); xx += bw; }
      for (let q = 0; q < Math.round(w * lift / 90); q++) px(r(80 + q) < 0.6 ? '#c89a4a' : '#8a86d0', 2 + Math.floor(r(90 + q) * (w - 4)), gy + 4 + Math.floor(r(100 + q) * (lift - 8)), 2, 2);
    }
    d.draw({ px, line, x, w, h, top, gy, dk, lt, base, r, meta, sh, D, S: this });
    return { c, hd: !!hd, ...meta };
  };
  // monumenti a distanza regolare (uno ogni `landEvery` tessere lontane, di norma meno di uno per schermo) invece che a caso
  const baseBuilding = S.building;
  S.building = function (layer, i, D) {
    if (!this._city || layer !== 'far' || !D || !D.land || !D.landEvery) return baseBuilding.call(this, layer, i, D);
    const key = layer + ':' + i, hit = this.tiles.get(key); if (hit) return hit;
    const E = D.landEvery, ph = ((i % E) + E) % E, k = String(D.land).split('|');
    if (ph !== D.landPhase % E) return baseBuilding.call(this, layer, i, Object.assign({}, D, { land: null }));
    const rr = (n) => Street2D.rnd(i * 13.7 + 1 + n), t = this.landmark(k[Math.floor(i / E + 3) % k.length] || k[0], rr, D);
    this.tiles.set(key, t); if (this.tiles.size > 260) this.tiles.delete(this.tiles.keys().next().value);
    return t;
  };

  // ---------------------------------------------------------------- quartieri per città
  const CITY = {};
  Street2D.CITY_DISTRICTS = CITY;
  Street2D.CITY_LIST = CITY;
  const baseInfo = S.districtInfo, baseKind = S.kindExtra;
  S.districtInfo = function (m) {
    const L = this._city && CITY[this._city];
    if (!L) return baseInfo.call(this, m);
    const tot = L.reduce((a, d) => a + d.len, 0); let k = ((Math.max(0, m) % tot) + tot) % tot;
    for (let i = 0; i < L.length; i++) { if (k < L[i].len) return { D: L[i], i, into: k, left: L[i].len - k, list: L }; k -= L[i].len; }
    return { D: L[0], i: 0, into: 0, left: L[0].len, list: L };
  };
  // districtMix di quartieri2d.js passa dal suo elenco: con una città nostra lo rifacciamo sul suo elenco
  const baseMix = S.districtMix;
  S.districtMix = function (m) {
    const L = this._city && CITY[this._city]; if (!L) return baseMix.call(this, m);
    const I = this.districtInfo(m), A = I.D, B = I.left < 80 ? L[(I.i + 1) % L.length] : I.into < 80 && m > 80 ? L[(I.i + L.length - 1) % L.length] : A;
    const t = B === A ? 0 : I.left < 80 ? 0.5 - I.left / 160 : 0.5 - I.into / 160;
    const lerp = (a, b) => a + (b - a) * t, L3 = (k) => [0, 1, 2].map((q) => Math.round(lerp(A[k][q], B[k][q])));
    const hex = (k) => { const a = parseInt(A[k].slice(1), 16), b = parseInt(B[k].slice(1), 16); return '#' + [16, 8, 0].map((s) => Math.round(lerp((a >> s) & 255, (b >> s) & 255)).toString(16).padStart(2, '0')).join(''); };
    return { A, haze: L3('haze'), hazeA: lerp(A.hazeA, B.hazeA), glow: L3('glow'), glowA: lerp(A.glowA, B.glowA), grade: L3('grade'), gradeA: lerp(A.gradeA, B.gradeA), lamp: hex('lamp'), broken: A.broken, people: A.people };
  };
  // i palazzi di città: kind `fac:<stile>` → facciata; gli altri tipi come prima
  S.kindExtra = function (kind, r, D) {
    if (kind.startsWith('fac:')) return this.cityFacade(kind.slice(4), r, D);
    return baseKind.call(this, kind, r, D);
  };
  // la città in cui si è: se cambia, le tessere in cache (di un'altra città) si buttano
  S.setCity = function (id) {
    const key = CITY[id] ? id : null;
    if (this._city === key) return;
    this._city = key; if (this.tiles) this.tiles.clear();
  };
  Street2D.cityDef = (id) => CITY[id] || null;
})();
