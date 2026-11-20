// ============================================================================
//  Quartieri della città (si aggancia a Street2D, dopo street2d.js).
//  La città non è più tutta uguale: lungo la strada si alternano quartieri, ognuno con i suoi palazzi,
//  i suoi colori, le sue insegne, la sua luce e un punto di riferimento sullo sfondo.
//  - DISTRICTS: l'elenco, in ordine di strada (poi ricomincia); districtAt(m) dice in quale si è al metro m.
//  - kindExtra: i palazzi nuovi (baracca, grattacielo di vetro, boutique, hotel, fabbrica, container, mercato).
//  - landmark: le sagome lontane (ruota panoramica, gru, ciminiere, guglia, cisterna, pagoda).
//  - decayTile: il degrado dei condomini dei bassifondi.
//  - districtPeople: pedoni e oggetti del marciapiede secondo il quartiere (incappucciati e bidoni col fuoco nei
//    bassifondi, completi e fioriere nel quartiere alto, operai e muletti al porto, bancarelle in via delle lanterne...).
//  - districtRoad: l'asfalto di ogni quartiere (buche e cartacce nei bassifondi, asfalto nuovo e catarifrangenti nel
//    quartiere alto, binari e gasolio al porto, coriandoli della festa in via delle lanterne).
//  Per aggiungere un quartiere basta una voce in DISTRICTS.
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, rnd = Street2D.rnd, sh = Street2D.shade;
  const FAR0 = ['#171640', '#1c1a4a', '#141338', '#1e1844'];
  // kinds: quanto pesa ogni tipo di palazzo · mid/far: colori dei muri vicini e delle sagome lontane · farH: altezza
  // dello sfondo · dark/farDark: quante finestre sono spente · signP/words/neon/flick: insegne · haze/glow: foschia
  // e chiarore sull'orizzonte · lamp/broken: lampioni · grade: tinta di tutta la scena · people: pedoni
  Street2D.DISTRICTS = [
    { id: 'casa', name: 'QUARTIERE DI CASA', len: 900, kinds: { apt: 3, house: 3.4, park: 1.6, konbini: 1, ramen: 0.5, parking: 0.8 },
      mid: ['#123049', '#1b2a52', '#2a1f4f', '#163d4a', '#2b2a5c', '#3a2246'], far: FAR0, farH: 0.8, dark: 0.4, farDark: 0.7, signP: 0.3, flick: 0.1,
      words: ['BAR', 'PIZZA', 'CAFE', 'GOMME', 'AUTO', '24H'], neon: ['#2ee6ff', '#ffb000', '#b8ff3a'],
      haze: [70, 50, 114], hazeA: 1, glow: [90, 60, 130], glowA: 0.1, lamp: '#ffcf7a', broken: 0, grade: [120, 110, 170], gradeA: 0, people: 4, land: null, landP: 0 },
    { id: 'centro', name: 'CENTRO · LE LUCI', len: 1300, kinds: { apt: 3, office: 2, konbini: 1.6, ramen: 1.6, parking: 1, shrine: 0.5 },
      mid: ['#123049', '#1b2a52', '#2a1f4f', '#2b2a5c', '#3a2246', '#40204e'], far: ['#1c1850', '#241a58', '#18144a', '#2a1c5a'], farH: 1.15, dark: 0.22, farDark: 0.5, signP: 0.95, flick: 0.2,
      words: ['RAMEN', 'BAR', '24H', 'HOTEL', 'SUSHI', 'DISCO', 'KARAOKE', 'TATTOO', 'CAFE', 'PIZZA', 'SLOT', 'CINEMA'], neon: ['#2ee6ff', '#ff2e88', '#b8ff3a', '#ffb000', '#b07bff'],
      haze: [120, 50, 130], hazeA: 1.15, glow: [255, 70, 170], glowA: 0.22, lamp: '#ffd7a0', broken: 0, grade: [255, 80, 190], gradeA: 0.1, people: 8, land: 'ferris', landP: 0.07 },
    { id: 'bassi', name: 'I BASSIFONDI', len: 1100, kinds: { shack: 4.6, apt: 3, warehouse: 1.2, ramen: 0.4 }, decay: true,
      mid: ['#2a2e22', '#33291f', '#252a2e', '#2e2a24', '#1f2a26'], far: ['#141a1c', '#181c18', '#12161a', '#1a1a16'], farH: 0.6, dark: 0.72, farDark: 0.9, signP: 0.3, flick: 0.75,
      words: ['BAR', 'PEGNI', 'GOMME', 'SLOT', 'CASH', '24H', 'ROTTAMI'], neon: ['#b8ff3a', '#ff5a3a', '#ffb000'], win: ['#d9a85a', '#c8b070', '#8fb8a0', '#d98a5a'],
      haze: [52, 62, 40], hazeA: 1.5, glow: [120, 110, 50], glowA: 0.16, lamp: '#cfd66a', broken: 0.4, grade: [120, 140, 60], gradeA: 0.16, people: 2, land: 'tank', landP: 0.12 },
    { id: 'ricco', name: 'QUARTIERE ALTO', len: 1200, kinds: { tower: 4, boutique: 2.6, hotel: 1.6, office: 1.2, park: 1 },
      mid: ['#16405e', '#1b3a6a', '#22406a', '#2a3566'], far: ['#16264e', '#1a2c5a', '#142046', '#1e3060'], farH: 1.55, dark: 0.3, farDark: 0.42, signP: 0.25, flick: 0,
      words: ['LUSSO', 'BANCA', 'ORO', 'SPA', 'VIP', 'GALLERIA'], neon: ['#ffd98a', '#f4f1e6', '#9fe0ff'], win: ['#fff0c8', '#ffe9b8', '#cfe6ff', '#fff8e4'],
      haze: [44, 70, 140], hazeA: 0.8, glow: [110, 170, 255], glowA: 0.2, lamp: '#e4ecff', broken: 0, grade: [90, 150, 255], gradeA: 0.12, people: 4, land: 'spire', landP: 0.1 },
    { id: 'porto', name: 'ZONA DEL PORTO', len: 1100, kinds: { factory: 3, containers: 3.2, warehouse: 3, parking: 0.8 },
      mid: ['#2e2a2a', '#33302c', '#2a2e33', '#3a2e28'], far: ['#1e1a1a', '#221c18', '#1a1818', '#261e18'], farH: 0.75, dark: 0.6, farDark: 0.85, signP: 0.2, flick: 0.3,
      words: ['DOGANA', 'CARGO', 'MOLO 7', 'DEPOSITO', 'PESA'], neon: ['#ffb000', '#ff5a3a', '#f4f1e6'], win: ['#ffb45a', '#ffd98a', '#ff9a4a'],
      haze: [110, 66, 34], hazeA: 1.35, glow: [255, 140, 50], glowA: 0.2, lamp: '#ffa64a', broken: 0.1, grade: [255, 140, 40], gradeA: 0.14, people: 1, land: 'crane', landP: 0.16 },
    { id: 'lanterne', name: 'VIA DELLE LANTERNE', len: 1000, kinds: { market: 4, shrine: 2, ramen: 2.2, house: 1.6, apt: 1 },
      mid: ['#3a2030', '#40242a', '#33203a', '#2e2434'], far: ['#241430', '#2a1630', '#20122a', '#2e1a2e'], farH: 0.85, dark: 0.35, farDark: 0.6, signP: 0.7, flick: 0.1,
      words: ['RAMEN', 'SUSHI', 'TE', 'MERCATO', 'SAKE', 'FESTA', 'UDON'], neon: ['#ff3a2a', '#ffd23f', '#ff8a5a'], win: ['#ffd36b', '#ffb35c', '#ff9c7a', '#ffe6a3'],
      haze: [130, 44, 60], hazeA: 1.1, glow: [255, 80, 60], glowA: 0.22, lamp: '#ffb07a', broken: 0, grade: [255, 70, 50], gradeA: 0.12, people: 8, land: 'pagoda', landP: 0.1 },
  ];
  const DS = Street2D.DISTRICTS, TOT = DS.reduce((a, d) => a + d.len, 0);
  // quartiere al metro m, e quanto manca al confine più vicino (per sfumare i colori)
  S.districtAt = function (m) { return this.districtInfo(m).D; };
  S.districtInfo = function (m) {
    let k = ((Math.max(0, m) % TOT) + TOT) % TOT;
    for (let i = 0; i < DS.length; i++) { if (k < DS[i].len) return { D: DS[i], i, into: k, left: DS[i].len - k }; k -= DS[i].len; }
    return { D: DS[0], i: 0, into: 0, left: DS[0].len };
  };
  // colori d'atmosfera sfumati negli 80 m a cavallo di un confine
  S.districtMix = function (m) {
    const I = this.districtInfo(m), A = I.D, B = I.left < 80 ? DS[(I.i + 1) % DS.length] : I.into < 80 && m > 80 ? DS[(I.i + DS.length - 1) % DS.length] : A;
    const t = B === A ? 0 : I.left < 80 ? 0.5 - I.left / 160 : 0.5 - I.into / 160;
    const L = (a, b) => a + (b - a) * t, L3 = (k) => [0, 1, 2].map((q) => Math.round(L(A[k][q], B[k][q])));
    const hex = (k) => { const a = parseInt(A[k].slice(1), 16), b = parseInt(B[k].slice(1), 16); return '#' + [16, 8, 0].map((s) => Math.round(L((a >> s) & 255, (b >> s) & 255)).toString(16).padStart(2, '0')).join(''); };
    return { A, haze: L3('haze'), hazeA: L(A.hazeA, B.hazeA), glow: L3('glow'), glowA: L(A.glowA, B.glowA), grade: L3('grade'), gradeA: L(A.gradeA, B.gradeA), lamp: hex('lamp'), broken: A.broken, people: A.people };
  };
  S.pickKind = function (D, q) {
    let tot = 0; for (const k in D.kinds) tot += D.kinds[k];
    let v = q * tot; for (const k in D.kinds) { v -= D.kinds[k]; if (v <= 0) return k; }
    return 'apt';
  };

  // ---------------------------------------------------------------- palazzi nuovi
  S.kindExtra = function (kind, r, D) {
    const C = this.C, ink = C.ink;
    const dims = { shack: [60, 44], tower: [48, 138], boutique: [64, 50], hotel: [72, 92], factory: [76, 58], containers: [70, 46], market: [70, 44] }[kind];
    const w = dims[0] + Math.floor(r(1) * 8), h = dims[1] + Math.floor(r(2) * (kind === 'tower' ? 36 : kind === 'hotel' ? 18 : 10)), top = 30;
    const c = document.createElement('canvas'); c.width = w + 2; c.height = h + top + 1;
    const x = c.getContext('2d', { willReadFrequently: true }), gy = top + h;
    const px = (col, xx, yy, ww = 1, hh = 1) => { x.fillStyle = col; x.fillRect(Math.round(xx), Math.round(yy), Math.round(ww), Math.round(hh)); };
    const meta = { w: w + 2, h: h + top + 1, signs: [], beacons: [], shop: null, glows: [] };
    const ball = (cx, cy, rr, col) => { for (let dy = -rr; dy <= rr; dy++) { const ww = Math.round(Math.sqrt(rr * rr - dy * dy) * 2); px(dy < -rr / 3 ? sh(col, 0.25) : dy > rr / 3 ? sh(col, -0.3) : col, cx - ww / 2, cy + dy, ww, 1); } };
    if (kind === 'shack') {
      // baracca: lamiere di recupero, tetto tenuto fermo dai sassi, telo, panni stesi, bidone col fuoco
      const pal = ['#5a4a3a', '#3f5a58', '#6a3f2e', '#4a4f58', '#59523a', '#2f4a5e'];
      px(ink, 0, top + 6, w + 2, h - 5);
      for (let xx = 1, n = 0; xx < w + 1; n++) {
        const pw = Math.min(w + 1 - xx, 8 + Math.floor(r(30 + n) * 10)), col = pal[Math.floor(r(40 + n) * pal.length)], drop = Math.floor(r(50 + n) * 4), y0 = top + 7 + drop, ph = h - 6 - drop;
        px(col, xx, y0, pw, ph); for (let k = xx + 1; k < xx + pw; k += 2) px(sh(col, -0.18), k, y0, 1, ph);
        px(sh(col, 0.2), xx, y0, pw, 1); px(ink, xx + pw - 1, y0, 1, ph);
        if (r(60 + n) < 0.6) for (let q = 0; q < 7; q++) px('#7a4526', xx + Math.floor(r(70 + n * 7 + q) * pw), y0 + 3 + Math.floor(r(80 + n * 5 + q) * (ph - 6)), 2, 1 + Math.floor(r(q + n) * 3));
        xx += pw;
      }
      px(ink, -1, top + 3, w + 4, 5); px('#4a505c', 0, top + 4, w + 2, 3); for (let k = 0; k < w + 2; k += 3) px('#353a44', k, top + 4, 1, 3);
      px('#6a6f7a', 8, top + 1, 4, 3); px('#565b66', w - 18, top + 1, 5, 3); px(ink, w / 2 - 4, top, 9, 4); px('#22252c', w / 2 - 3, top + 1, 7, 2);
      px('#2a5fa8', w - 28, top + 8, 18, 11); px('#3f7ac8', w - 28, top + 8, 18, 2); px('#1f4a88', w - 22, top + 10, 1, 9); px('#1f4a88', w - 15, top + 10, 1, 9);
      const lit = r(5) < 0.45, wx0 = 7, wy0 = top + 16;
      px(ink, wx0 - 1, wy0 - 1, 14, 11); px(lit ? '#d9a85a' : '#10141f', wx0, wy0, 12, 9); for (let k = 0; k < 4; k++) px(ink, wx0 + 2 + k * 3, wy0, 1, 9);
      if (lit) { meta.glows.push({ x: wx0 + 6, y: wy0 + 5, r: 12, col: '#d9a85a', a: 0.08 }); meta.shop = { x: wx0 + 6, w: 14, col: '#d9a85a' }; }
      px(ink, w - 42, gy - 22, 13, 22); px('#3a2a1e', w - 41, gy - 21, 11, 21); px('#4f3a28', w - 41, gy - 21, 3, 21); px('#c9a84a', w - 33, gy - 11, 2, 2);
      for (let q = 0; q < 3; q++) { const col = C.neon[Math.floor(r(19 + q) * 5)]; for (let k = 0; k < 10; k++) px(col, 5 + q * 15 + k, gy - 7 - (k % 4 < 2 ? k % 2 : 2 - (k % 2)) - (q % 2) * 4, 1, 2); }
      px('#ffe9a8', w - 36, gy - 26, 2, 2); meta.glows.push({ x: w - 35, y: gy - 24, r: 12, col: '#ffcf7a', a: 0.1 });
      px(ink, 4, top - 14, 1, 18); px(ink, w - 3, top - 14, 1, 18);
      const ly = (k) => top - 12 + Math.round(Math.sin((k - 5) / (w - 8) * Math.PI) * 3);
      for (let k = 5; k < w - 3; k++) px('#8a90a6', k, ly(k), 1, 1);
      ['#d8dde6', '#c42a1a', '#2a5fa8', '#e8c84a', '#d87aa8'].forEach((col, q) => { const k = 9 + q * Math.floor((w - 22) / 4), hh = 6 + (q % 2) * 2; if (k > w - 10) return; px(col, k, ly(k) + 1, 5, hh); px(sh(col, -0.25), k + 3, ly(k) + 1, 2, hh); });
      px('#9aa0ae', w - 15, top - 4, 6, 5); px(ink, w - 13, top + 1, 1, 3);
      if (r(8) < 0.5) { const bx = w - 13; px(ink, bx - 1, gy - 11, 9, 11); px('#4a3a2e', bx, gy - 10, 7, 10); px('#6a5240', bx, gy - 7, 7, 1); px('#ff7a14', bx + 1, gy - 14, 5, 4); px('#ffc832', bx + 2, gy - 13, 3, 3); px('#fff4cc', bx + 3, gy - 12, 1, 2); meta.glows.push({ x: bx + 3, y: gy - 12, r: 22, col: '#ff8a20', a: 0.16 }); meta.shop = { x: bx + 3, w: 20, col: '#ff8a20' }; }
    } else if (kind === 'tower') {
      // grattacielo di vetro: facciata a pannelli che riflette il cielo, piani accesi, corona illuminata, atrio dorato
      const tint = ['#16405e', '#1b3a6a', '#14504e', '#2a3566'][Math.floor(r(4) * 4)], sw = w - 10;
      px(ink, 0, top + 18, w + 2, h - 17); px(tint, 1, top + 19, w, h - 18);
      px(ink, 5, top + 4, sw + 2, 15); px(sh(tint, 0.08), 6, top + 5, sw, 14);
      px(ink, w / 2, top - 24, 2, 29); px('#8a90a6', w / 2, top - 24, 1, 29); meta.beacons.push({ x: Math.floor(w / 2), y: top - 26 });
      for (let yy = top + 22; yy < gy - 24; yy += 5) {
        const fl = r(yy * 0.37);
        for (let xx = 3; xx < w - 4; xx += 6) {
          const q = r(xx * 1.3 + yy * 2.1);
          let col = sh(tint, 0.06 + 0.3 * ((xx + (gy - yy) * 0.5) / (w + h * 0.5)));
          if (fl < 0.2) col = q < 0.8 ? '#fff0c8' : '#ffd98a'; else if (q < 0.1) col = '#cfe6ff'; else if (q < 0.17) col = '#ffe9b8';
          px(col, xx, yy, 5, 4); px(sh(col, 0.14), xx, yy, 5, 1);
        }
      }
      for (let yy = top + 22; yy < gy - 24; yy++) px('rgba(200,225,255,.13)', 4 + ((yy - top) * 0.45) % (w - 14), yy, 10, 1);   // riflesso obliquo del cielo
      px(sh(tint, -0.4), 1, top + 19, 2, h - 18); px(sh(tint, -0.4), w - 1, top + 19, 2, h - 18); px(sh(tint, 0.35), 3, top + 19, 1, h - 42);
      px('#ffd98a', 8, top + 8, sw - 4, 3); px('#fff4d8', 8, top + 8, sw - 4, 1); meta.glows.push({ x: w / 2, y: top + 9, r: 26, ry: 0.4, col: '#ffd98a', a: 0.1 });
      px(ink, 1, gy - 23, w, 23); px('#1a1d2a', 2, gy - 22, w - 2, 22); px('#ffe9b8', 5, gy - 19, w - 8, 16); px('#fff8e4', 5, gy - 19, w - 8, 2);
      for (let k = 5; k < w - 4; k += 9) px('#2a2d3a', k, gy - 19, 2, 16);
      px('#3a2f1a', w / 2 - 6, gy - 15, 12, 15); px('#ffe9b8', w / 2 - 5, gy - 14, 4, 13); px('#ffe9b8', w / 2 + 1, gy - 14, 4, 13);
      px(ink, w / 2 - 12, gy - 25, 24, 4); px('#c9a84a', w / 2 - 11, gy - 24, 22, 2);
      meta.shop = { x: w / 2, w: w - 8, col: '#ffe9b8' }; meta.glows.push({ x: w / 2, y: gy - 10, r: w / 2, ry: 0.5, col: '#ffe0a0', a: 0.08 });
    } else if (kind === 'boutique') {
      // negozio di lusso: pietra chiara, tenda nera col filetto d'oro, vetrina calda coi manichini, siepe a sfera
      const wall = ['#d8d0c0', '#c8c4cc', '#e0d2b8'][Math.floor(r(4) * 3)];
      px(ink, 0, top + 8, w + 2, h - 7); px(wall, 1, top + 9, w, h - 8);
      px(ink, -1, top + 6, w + 4, 4); px(sh(wall, 0.3), 0, top + 7, w + 2, 2);
      for (let yy = top + 13; yy < gy - 26; yy += 5) px(sh(wall, -0.1), 1, yy, w, 1);
      for (let q = 0; q < 3; q++) {
        const ax = 8 + q * Math.floor((w - 24) / 2);
        px(ink, ax - 1, top + 12, 10, 11); px('#ffe9b8', ax, top + 13, 8, 9); px('#fff8e4', ax, top + 13, 8, 1); px(wall, ax, top + 13, 1, 1); px(wall, ax + 7, top + 13, 1, 1); px(ink, ax + 4, top + 14, 1, 8);
        px(ink, ax - 2, top + 22, 12, 1); for (let k = 0; k < 6; k++) px(ink, ax - 2 + k * 2, top + 19, 1, 3);
        meta.glows.push({ x: ax + 4, y: top + 17, r: 9, col: '#ffe0a0', a: 0.06 });
      }
      px(ink, 1, gy - 27, w, 6); px('#14161e', 2, gy - 26, w - 2, 4); px('#c9a84a', 2, gy - 22, w - 2, 1);
      const word = ['LUSSO', 'ORO', 'ATELIER', 'MODA', 'VIP'][Math.floor(r(7) * 5)];
      this.text(x, word, Math.round((w + 2 - this.textW(word, 1)) / 2), gy - 26, '#e8c878', 1);
      px(ink, 5, gy - 20, w - 22, 18); px('#ffe6b0', 6, gy - 19, w - 24, 16); px('#fff6dc', 6, gy - 19, w - 24, 2); px(sh('#ffe6b0', -0.2), 6, gy - 6, w - 24, 3);
      for (let k = 12; k < w - 24; k += 12) { px('#2a2430', k, gy - 15, 3, 10); px('#2a2430', k + 1, gy - 17, 1, 2); px(['#c42a1a', '#163a8c', '#c9a84a', '#f4f1e6'][Math.floor(r(k) * 4)], k - 1, gy - 12, 5, 6); }
      px(ink, w - 15, gy - 20, 10, 20); px('#3a2f1a', w - 14, gy - 19, 8, 19); px('#ffe6b0', w - 13, gy - 17, 6, 10); px('#c9a84a', w - 8, gy - 9, 1, 3);
      px('#3a3f48', w - 4, gy - 5, 5, 5); ball(w - 2, gy - 10, 4, '#2f6a3e');
      meta.shop = { x: 6 + (w - 24) / 2, w: w - 24, col: '#ffe6b0' }; meta.glows.push({ x: w / 2 - 6, y: gy - 10, r: w / 2, ry: 0.45, col: '#ffe0a0', a: 0.09 });
    } else if (kind === 'hotel') {
      // grand hotel: facciata classica, balconcini, tetto a mansarda con abbaini, pensilina rossa e bandiere
      const wall = ['#cfc4ae', '#c8a89a', '#b8bcc8'][Math.floor(r(4) * 3)];
      px(ink, 0, top + 10, w + 2, h - 9); px(wall, 1, top + 11, w, h - 10);
      px(ink, 2, top + 1, w - 2, 10); px('#2a3352', 3, top + 2, w - 4, 8); px('#3a4468', 3, top + 2, w - 4, 1);
      for (let q = 0; q < 3; q++) { const dx = 10 + q * Math.floor((w - 28) / 2); px(ink, dx, top + 3, 8, 7); px(r(20 + q) < 0.6 ? '#ffe9b8' : '#141a2a', dx + 1, top + 5, 6, 4); }
      px(sh(wall, 0.18), 1, top + 11, 3, h - 10); px(sh(wall, -0.18), w - 2, top + 11, 3, h - 10);
      for (let yy = top + 16; yy < gy - 32; yy += 15) {
        for (let xx = 8; xx < w - 12; xx += 12) {
          const lit = r(xx + yy * 1.7) < 0.62, col = ['#ffe9b8', '#ffd98a', '#fff4d8'][Math.floor(r(xx * 3 + yy) * 3)];
          px(ink, xx - 1, yy - 1, 8, 11); px(lit ? col : '#141a2a', xx, yy, 6, 9); px(ink, xx + 3, yy, 1, 9);
          if (lit && r(xx * 5 + yy) < 0.4) px(sh(col, -0.3), xx, yy, 2, 9);
          px(ink, xx - 2, yy + 9, 10, 2); px('#8a8478', xx - 2, yy + 9, 10, 1);
        }
        px(sh(wall, -0.15), 1, yy + 12, w, 1);
      }
      const tw = this.textW('HOTEL', 2); meta.signs.push({ word: 'HOTEL', sc: 2, x: Math.round((w + 2 - tw) / 2), y: gy - 42, col: '#ffd98a', flick: false });
      px(ink, w / 2 - 16, gy - 25, 32, 5); px('#8a1c24', w / 2 - 15, gy - 24, 30, 3); px('#c9a84a', w / 2 - 15, gy - 21, 30, 1);
      px(ink, w / 2 - 10, gy - 20, 20, 20); px('#ffe9b8', w / 2 - 9, gy - 19, 8, 19); px('#ffe9b8', w / 2 + 1, gy - 19, 8, 19); px('#c9a84a', w / 2 - 1, gy - 19, 2, 19);
      for (const sx of [5, w / 2 + 13]) { const sw = w / 2 - 18; px(ink, sx, gy - 18, sw, 12); px('#ffe0a0', sx + 1, gy - 17, sw - 2, 10); px('#fff4d8', sx + 1, gy - 17, sw - 2, 1); }
      px(ink, 12, top - 12, 1, 14); px('#c42a1a', 13, top - 12, 6, 4); px(ink, w - 12, top - 12, 1, 14); px('#163a8c', w - 11, top - 12, 6, 4);
      meta.shop = { x: w / 2, w: 22, col: '#ffe9b8' }; meta.glows.push({ x: w / 2, y: gy - 12, r: 26, ry: 0.6, col: '#ffe0a0', a: 0.1 });
    } else if (kind === 'factory') {
      // fabbrica: tetto a shed, finestroni a riquadri, ciminiera a fasce col fumo, portone con le strisce
      const wall = ['#4a3a36', '#3f444e', '#44403a'][Math.floor(r(4) * 3)], tw = Math.floor(w / 4);
      px(ink, 0, top + 14, w + 2, h - 13); px(wall, 1, top + 15, w, h - 14);
      for (let yy = top + 18; yy < gy; yy += 4) px(sh(wall, -0.12), 1, yy, w, 1);
      for (let q = 0; q < 4; q++) { for (let j = 0; j < 10; j++) px(j === 0 ? ink : '#2e333e', 1 + q * tw + j, top + 5 + j, tw - j, 1); px(r(30 + q) < 0.6 ? '#ffb45a' : '#1a1f2c', 1 + q * tw, top + 6, 2, 8); }
      for (let xx = 6; xx < w - 30; xx += 16) { const lit = r(xx) < 0.55; px(ink, xx - 1, top + 22, 13, 17); for (let a = 0; a < 3; a++) for (let b = 0; b < 4; b++) px(lit ? (r(xx + a * 3 + b) < 0.85 ? '#ffb45a' : '#ffd98a') : '#161b28', xx + a * 4, top + 23 + b * 4, 3, 3); if (lit) meta.glows.push({ x: xx + 6, y: top + 30, r: 12, col: '#ff9a4a', a: 0.07 }); }
      px(ink, w - 26, gy - 24, 22, 24); px('#5a5f6a', w - 25, gy - 23, 20, 23); for (let k = 0; k < 23; k += 3) px('#4a4f5a', w - 25, gy - 23 + k, 20, 1);
      for (let k = 0; k < 20; k++) px((k >> 1) % 2 ? '#ffc832' : '#1a1a1a', w - 25 + k, gy - 26, 1, 2);
      px('#ffd98a', w - 16, gy - 29, 3, 2); meta.glows.push({ x: w - 15, y: gy - 26, r: 16, col: '#ffa64a', a: 0.12 }); meta.shop = { x: w - 15, w: 20, col: '#ffa64a' };
      const cx = 9; px(ink, cx - 1, top - 20, 9, 36); px('#6a4a40', cx, top - 19, 7, 34); px('#d8dde6', cx, top - 19, 7, 3); px('#c42a1a', cx, top - 16, 7, 3); px('#d8dde6', cx, top - 13, 7, 3); px(sh('#6a4a40', -0.25), cx + 5, top - 10, 2, 25);
      meta.beacons.push({ x: cx + 3, y: top - 22 });
      for (let q = 0; q < 4; q++) { const rr = 3 + q; x.fillStyle = `rgba(130,128,146,${0.5 - q * 0.09})`; for (let dy = -rr; dy <= rr; dy++) { const ww = Math.round(Math.sqrt(rr * rr - dy * dy) * 2); x.fillRect(Math.round(cx + 6 + q * 6 - ww / 2), Math.max(0, top - 24 - q + dy), ww, 1); } }
      px('#2a2f3a', 1, gy - 31, w - 28, 2); px('#5a6070', 1, gy - 31, w - 28, 1);
    } else if (kind === 'containers') {
      // piazzale: container accatastati di tutti i colori e una torre faro
      const cw = Math.floor((w - 8) / 3), ch = 14, cols = ['#8a3a2a', '#2a5a8a', '#2f6a4a', '#b8902a', '#6a3f7a', '#a8482a'];
      for (let lv = 0; lv < 3; lv++) for (let q = 0; q < 3; q++) {
        if (lv === 2 && r(q + 9) < 0.5) continue; if (lv === 1 && q === 2 && r(13) < 0.3) continue;
        const col = cols[Math.floor(r(lv * 5 + q + 1) * 6)], x0 = 1 + q * cw, y0 = gy - (lv + 1) * ch;
        px(ink, x0, y0, cw, ch); px(col, x0 + 1, y0 + 1, cw - 2, ch - 2); for (let k = 1; k < cw - 2; k += 2) px(sh(col, -0.2), x0 + 1 + k, y0 + 1, 1, ch - 2);
        px(sh(col, 0.25), x0 + 1, y0 + 1, cw - 2, 1); px(ink, x0 + cw - 6, y0 + 1, 1, ch - 2); px('#c9ced6', x0 + cw - 4, y0 + 3, 1, ch - 6);
        this.text(x, ['MSK', 'TKO', 'NRN', 'CGM'][Math.floor(r(lv + q * 3) * 4)], x0 + 2, y0 + 5, sh(col, 0.55), 1);
      }
      px(ink, w - 5, top - 14, 2, gy - top + 14); px(ink, w - 11, top - 16, 13, 4); px('#fff4cc', w - 10, top - 15, 4, 2); px('#fff4cc', w - 4, top - 15, 4, 2);
      meta.glows.push({ x: w - 5, y: top - 10, r: 34, ry: 0.9, col: '#ffd98a', a: 0.1 }); meta.shop = { x: w - 5, w: 30, col: '#ffd98a' };
    } else if (kind === 'market') {
      // mercato coperto: tetto di tegole, stendardi, banchi con la tenda a righe e un filo di lanterne rosse
      px(ink, 0, top + 10, w + 2, h - 9); px('#4a3424', 1, top + 11, w, h - 10); for (let k = 0; k < w; k += 5) px('#3a281a', 1 + k, top + 11, 1, h - 10);
      for (let j = 0; j < 7; j++) px(j % 2 ? '#2a3352' : '#1b2236', -1, top + 4 + j, w + 4, 1); px('#3a4468', -1, top + 4, w + 4, 1); px('#3a4468', -2, top + 3, 3, 1); px('#3a4468', w + 1, top + 3, 3, 1);
      ['#c42a1a', '#f2e9d0', '#163a8c'].forEach((col, q) => { const bx = 6 + q * Math.floor((w - 12) / 2); px(col, bx, top + 13, 5, 13); px(sh(col, -0.3), bx, top + 13, 1, 13); px(q === 1 ? '#c42a1a' : '#ffd23f', bx + 2, top + 16, 1, 3); px(q === 1 ? '#c42a1a' : '#ffd23f', bx + 1, top + 21, 3, 1); });
      for (let q = 0; q < 2; q++) {
        const sx = 3 + q * Math.floor(w / 2), sw = Math.floor(w / 2) - 5;
        px('#ffd98a', sx + 1, gy - 19, sw - 2, 9); px('#ffb060', sx + 1, gy - 13, sw - 2, 3);
        px('#1a1530', sx + sw / 2, gy - 17, 4, 7); px(C.skin, sx + sw / 2, gy - 19, 4, 3);
        for (let k = 0; k < sw; k++) px((k >> 2) % 2 ? '#c42a1a' : '#f2e9d0', sx + k, gy - 24, 1, 5); px('rgba(0,0,0,.3)', sx, gy - 19, sw, 1);
        px(ink, sx, gy - 11, sw, 11); px('#6b4a2e', sx + 1, gy - 10, sw - 2, 10); px('#8a6440', sx + 1, gy - 10, sw - 2, 2);
        for (let k = 0; k < sw - 5; k += 4) px(['#ff7a14', '#3fb36a', '#ffd23f', '#c42a1a'][Math.floor(r(k + q * 9) * 4)], sx + 2 + k, gy - 13, 3, 3);
        meta.glows.push({ x: sx + sw / 2, y: gy - 14, r: sw / 2 + 4, ry: 0.6, col: '#ffb060', a: 0.1 });
      }
      for (let k = 4; k < w - 4; k += 8) { const ly = top + 12 + Math.round(Math.sin((k / w) * Math.PI) * 3); px(ink, k + 1, ly - 1, 2, 1); px('#ff3a2a', k, ly, 4, 5); px('#ffb060', k + 1, ly + 1, 2, 3); meta.glows.push({ x: k + 2, y: ly + 2, r: 7, col: '#ff5a3a', a: 0.14 }); }
      meta.shop = { x: w / 2, w: w - 10, col: '#ffd98a' };
    }
    return { c, ...meta };
  };

  // ---------------------------------------------------------------- punti di riferimento lontani
  // Sagome scure con poche luci, alte sopra i tetti: si riconosce il quartiere già da lontano.
  S.landmark = function (kind, r, D) {
    const dims = { ferris: [92, 96], crane: [76, 104], spire: [30, 150], tank: [40, 74], pagoda: [56, 100] }[kind] || [40, 80];
    const w = dims[0], h = dims[1], top = 25, c = document.createElement('canvas'); c.width = w + 2; c.height = h + 26;
    const x = c.getContext('2d', { willReadFrequently: true }), gy = top + h, base = D.far[0], dk = sh(base, -0.25), lt = sh(base, 0.5);
    const px = (col, xx, yy, ww = 1, hh = 1) => { x.fillStyle = col; x.fillRect(Math.round(xx), Math.round(yy), Math.round(ww), Math.round(hh)); };
    const line = (x0, y0, x1, y1, col) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (let k = 0; k <= n; k++) px(col, x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n); };
    const meta = { w: w + 2, h: h + 26, signs: [], beacons: [], shop: null, glows: [] };
    if (kind === 'ferris') {
      const cx = w / 2, cy = top + 44, R = 40;
      line(cx, cy, cx - 22, gy, dk); line(cx, cy, cx + 22, gy, dk); px(dk, cx - 26, gy - 3, 52, 3);
      for (let a = 0; a < Math.PI * 2; a += 0.025) { px(lt, cx + Math.cos(a) * R, cy + Math.sin(a) * R); px(base, cx + Math.cos(a) * (R - 5), cy + Math.sin(a) * (R - 5)); }
      for (let q = 0; q < 12; q++) { const a = q / 12 * Math.PI * 2; line(cx, cy, cx + Math.cos(a) * R, cy + Math.sin(a) * R, sh(base, 0.25)); }
      for (let q = 0; q < 12; q++) { const a = q / 12 * Math.PI * 2 + 0.26, col = D.neon[q % D.neon.length], kx = cx + Math.cos(a) * R, ky = cy + Math.sin(a) * R; px(dk, kx - 2, ky, 5, 4); px(col, kx - 1, ky + 1, 3, 2); meta.glows.push({ x: Math.round(kx), y: Math.round(ky) + 2, r: 5, col, a: 0.12 }); }
      px('#ffd23f', cx - 2, cy - 2, 5, 5); meta.glows.push({ x: cx, y: cy, r: 12, col: '#ffd23f', a: 0.1 });
    } else if (kind === 'crane') {
      // gru da porto: portale, braccio a sbalzo, cabina, container appeso
      px(dk, 14, top + 30, 4, h - 30); px(dk, 44, top + 30, 4, h - 30); line(14, gy - 1, 46, top + 32, dk); line(46, gy - 1, 16, top + 32, dk);
      px(dk, 4, top + 24, w - 6, 6); px(lt, 4, top + 24, w - 6, 1); px(dk, 28, top + 4, 4, 22); line(30, top + 4, 6, top + 24, dk); line(30, top + 4, w - 4, top + 24, dk);
      px(dk, 36, top + 30, 12, 9); px('#ffd98a', 38, top + 32, 4, 3);
      px(dk, w - 16, top + 30, 1, 22); px('#8a3a2a', w - 24, top + 52, 17, 8); px(sh('#8a3a2a', 0.25), w - 24, top + 52, 17, 1);
      meta.beacons.push({ x: 29, y: top + 2 }, { x: w - 5, y: top + 22 }); meta.glows.push({ x: 40, y: top + 34, r: 14, col: '#ffa64a', a: 0.1 });
      const cx = 5; px(dk, cx, top + 44, 6, h - 44); px('#d8dde6', cx, top + 44, 6, 3); px('#c42a1a', cx, top + 47, 6, 3);                 // ciminiera accanto
      for (let q = 0; q < 4; q++) { const rr = 3 + q; x.fillStyle = `rgba(150,130,120,${0.4 - q * 0.08})`; for (let dy = -rr; dy <= rr; dy++) { const ww = Math.round(Math.sqrt(rr * rr - dy * dy) * 2); x.fillRect(Math.round(cx + 5 + q * 5 - ww / 2), top + 38 - q * 3 + dy, ww, 1); } }
    } else if (kind === 'spire') {
      // torre sottile col belvedere illuminato
      const cx = w / 2;
      px(dk, cx - 6, top + 60, 12, h - 60); px(dk, cx - 4, top + 34, 8, 26); px(dk, cx - 1, top, 2, 34);
      px(dk, cx - 10, top + 46, 20, 8); px('#cfe6ff', cx - 9, top + 48, 18, 2); px('#fff8e4', cx - 9, top + 51, 18, 1);
      for (let yy = top + 66; yy < gy - 4; yy += 6) px(r(yy) < 0.6 ? '#cfe6ff' : lt, cx - 4, yy, 8, 2);
      px(lt, cx - 6, top + 60, 1, h - 60);
      meta.beacons.push({ x: Math.floor(cx), y: top - 2 }); meta.glows.push({ x: cx, y: top + 50, r: 18, ry: 0.5, col: '#9fd0ff', a: 0.14 });
    } else if (kind === 'tank') {
      // cisterna dell'acqua sui tralicci, antenne storte, un cartellone spento
      px(dk, 8, top + 30, 2, h - 30); px(dk, w - 10, top + 30, 2, h - 30); line(9, gy - 1, w - 10, top + 40, dk); line(w - 10, gy - 1, 9, top + 40, dk);
      px(dk, 4, top + 10, w - 8, 22); px(sh(base, 0.12), 5, top + 11, w - 10, 3); for (let k = 6; k < w - 6; k += 4) px(sh(base, -0.4), k, top + 14, 1, 17);
      px(dk, 8, top + 6, w - 16, 5); px(dk, w / 2 - 1, top + 2, 2, 5);
      line(w - 8, top + 10, w - 2, top - 8, dk); line(6, top + 10, 3, top - 4, dk); px(dk, 0, top - 2, 8, 1); px(dk, w - 6, top - 4, 7, 1);
      if (r(3) < 0.5) px('#d9a85a', w / 2 - 2, gy - 12, 4, 3);
    } else if (kind === 'pagoda') {
      // pagoda a cinque tetti, finestre calde a ogni piano
      const cx = w / 2;
      for (let q = 0; q < 5; q++) {
        const hw = 10 + q * 4, y0 = top + 14 + q * 17;
        px(dk, cx - hw - 4, y0, hw * 2 + 8, 3); px(lt, cx - hw - 4, y0, hw * 2 + 8, 1); px(dk, cx - hw - 6, y0 - 1, 3, 1); px(dk, cx + hw + 3, y0 - 1, 3, 1);
        px(dk, cx - hw + 2, y0 + 3, hw * 2 - 4, 14); for (let k = cx - hw + 5; k < cx + hw - 6; k += 6) px('#ffb35c', k, y0 + 7, 3, 5);
        meta.glows.push({ x: cx, y: y0 + 9, r: hw, ry: 0.4, col: '#ff8a4a', a: 0.07 });
      }
      px(dk, cx - 1, top - 4, 2, 18); px('#ffd23f', cx - 1, top - 5, 2, 2);
    }
    return { c, ...meta };
  };

  // ---------------------------------------------------------------- degrado (condomini dei bassifondi)
  S.decayTile = function (x, r, w, h, top) {
    const px = (col, xx, yy, ww = 1, hh = 1) => { x.fillStyle = col; x.fillRect(Math.round(xx), Math.round(yy), ww, hh); };
    for (let yy = top + 6; yy < top + h - 22; yy += 12) for (let xx = 6; xx < w - 9; xx += 10) if (r(xx * 9.1 + yy * 3.3) < 0.16) { px('#4a3626', xx, yy, 6, 7); px('#2e2118', xx, yy + 2, 6, 1); px('#2e2118', xx, yy + 5, 6, 1); px('#5e4632', xx, yy, 6, 1); }   // finestre sbarrate con le assi
    for (let q = 0; q < 12; q++) px('rgba(6,8,10,.3)', 3 + r(q * 3.7 + 90) * (w - 6), top + 2 + r(q * 5.3 + 91) * h * 0.55, r(q + 92) < 0.3 ? 2 : 1, 8 + r(q * 2.1 + 93) * 28);       // colature
    for (let q = 0; q < 3; q++) { let cx = 4 + r(q + 95) * (w - 20), cy = top + 10 + r(q * 7 + 96) * (h - 50); for (let k = 0; k < 14; k++) { px('#0c0e14', cx, cy, 1, 1); cx += 1; cy += r(k + q * 31 + 97) > 0.5 ? 1 : r(k + q * 17 + 98) > 0.6 ? -1 : 0; } }   // crepe
    const gy = top + h;
    for (let q = 0; q < 2; q++) { const col = this.C.neon[Math.floor(r(q + 99) * 5)], gx = 5 + q * (w / 2 - 4); for (let k = 0; k < 16; k++) px(col, gx + k, gy - 26 - (k % 6 < 3 ? k % 3 : 3 - (k % 3)), 1, 2); px(col, gx + 2, gy - 22, 10, 1); }   // scritte sui muri
  };

  // ---------------------------------------------------------------- cartello del quartiere
  // Quando si entra in un quartiere il suo nome compare per qualche secondo in alto.
  S.districtBanner = function (g, dist, dt) {
    const st = this.st, I = this.districtInfo(dist);
    if (st.distId !== I.D.id) { st.distId = I.D.id; st.distT = 0; }
    st.distT = (st.distT ?? 9) + dt;
    if (st.distT > 4.2) return;
    const a = Math.min(1, st.distT * 2.5) * Math.min(1, (4.2 - st.distT) * 1.5), name = I.D.name, tw = this.textW(name, 2), W = this.LW;
    // dentro la parte di scena inquadrata (da fermi la ripresa stringe sull'auto e taglia il cielo)
    const z = Math.max(1, this.fxZoom || 1), sw = W / z, shh = this.LH / z, f = this.fxFocus || { x: W / 2, y: this.LH / 2 };
    const vx = z > 1.001 ? Math.max(0, Math.min(W - sw, f.x - sw / 2)) : 0, vy = z > 1.001 ? Math.max(0, Math.min(this.LH - shh, f.y - shh / 2)) : 0;
    const bx = Math.round(vx + (sw - tw) / 2), by = Math.round(vy + 46 / z + 8);
    g.save(); g.globalAlpha = a;
    g.fillStyle = 'rgba(6,7,14,.78)'; g.fillRect(bx - 12, by - 7, tw + 24, 24);
    g.fillStyle = I.D.neon[0]; g.fillRect(bx - 12, by - 7, tw + 24, 1); g.fillRect(bx - 12, by + 16, tw + 24, 1);
    this.text(g, name, bx, by, '#f4f1e6', 2);
    g.restore();
  };
  // ---------------------------------------------------------------- asfalto dei quartieri
  // Disegnato sopra la carreggiata di base, a passi di 9 m (ogni passo ha il suo seme: le cose restano dove sono).
  // Corsie: bordo alto 238, linee tratteggiate 262 e 300, bordo basso 335.
  S.districtRoad = function (g, wx, from, to, TUN) {
    if (!this.districtAt) return;
    const C = this.C, u = 1 / (this.SS || 1), night = 1 - (this.day || 0), STEP = 9;
    const skip = (m) => TUN && m > TUN.a - 40 && m < TUN.b + 20;
    const ppm = wx(1) - wx(0), lanesY = [[241, 260], [265, 298], [303, 333]];
    const px = (col, x, y, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), w, h); };
    for (let m = Math.floor(from / STEP) * STEP - STEP; m < to; m += STEP) {
      if (skip(m)) continue;
      const D = this.districtAt(m), k = Math.round(m / STEP), r = (o) => rnd(k * 7.13 + o * 3.71), x0 = wx(m), x1 = wx(m + STEP);
      if (D.id === 'bassi') {
        // strisce consumate: pezzi di tratteggio mangiati dal traffico
        for (const ly of [262, 300]) if (r(ly) < 0.55) { g.fillStyle = 'rgba(18,20,34,.82)'; const a = x0 + r(ly + 1) * ppm * STEP; g.fillRect(Math.round(a), ly, Math.round(ppm * (0.6 + r(ly + 2) * 2.2)), 2); }
        // rattoppo storto, più scuro del resto
        if (r(3) < 0.3) {
          const x = x0 + r(4) * (x1 - x0), y = 244 + Math.floor(r(5) * 80), w = 16 + Math.floor(r(6) * 30), h = 5 + Math.floor(r(7) * 7);
          px('#171a29', x, y, w, h); px('#0e1019', x, y, w, 1); px('#2a2f44', x, y + h, w, 1);
          for (let q = 0; q < w * h * 0.25; q++) px(rnd(q + k) > 0.5 ? '#12141f' : '#1f2335', x + Math.floor(rnd(q * 3 + k) * w), y + Math.floor(rnd(q * 7 + k) * h));
        }
        // buca: bordo rotto, fondo nero, acqua che riflette il cielo e un neon
        if (r(8) < 0.62) {
          const L = lanesY[Math.floor(r(9) * 3)], ry = 3 + Math.floor(r(13) * 3), y = L[0] + ry + 1 + Math.floor(r(10) * Math.max(1, L[1] - L[0] - ry * 2 - 2)), x = x0 + r(11) * (x1 - x0), rx = 12 + Math.floor(r(12) * 14);
          g.fillStyle = '#4a5170'; this.span(g, x, y + 1, rx + 2, ry + 1);                                  // bordo rotto, illuminato davanti
          g.fillStyle = '#07080f'; this.span(g, x, y, rx + 1, ry);
          g.fillStyle = '#0f1220'; this.span(g, x + 1, y + 1, rx - 1, ry - 1);
          if (r(14) < 0.75) {                                                                                // acqua: riflette il cielo e un neon
            g.fillStyle = '#25305a'; this.span(g, x + 1, y + 1, rx * 0.8, Math.max(1, ry - 2));
            px('#8796d6', x - rx * 0.5, y, Math.max(3, rx * 0.45), 1); px(C.neon[k % C.neon.length], x + rx * 0.15, y + 1, 4, 1);
          }
          for (let q = 0; q < rx; q += 3) px('#20243a', x - rx + q * 2, y - ry - (q % 2), 2, 1);                // crepe del bordo alto
          for (let q = 0; q < 5; q++) px(q % 2 ? '#525a7a' : '#2c3148', x + (r(20 + q) - 0.5) * rx * 3.2, y + (r(30 + q) - 0.3) * ry * 3, 2, 1);   // sassi sparsi
        }
        // cartacce e lattine lungo i bordi
        for (let q = 0; q < 3; q++) if (r(40 + q) < 0.45) {
          const x = x0 + r(50 + q) * (x1 - x0), y = r(60 + q) < 0.5 ? 240 + Math.floor(r(70 + q) * 6) : 327 + Math.floor(r(70 + q) * 6), t = r(80 + q);
          if (t < 0.5) { px('#cfc7ab', x, y, 5, 3); px('#9a927a', x + 1, y + 2, 4, 1); px('#efe8d0', x + 1, y, 2, 1); }   // cartaccia
          else if (t < 0.8) { px(['#c0392b', '#2e7dd1', '#7fbf2a'][q], x, y, 5, 2); px('#e8e8e8', x, y, 1, 2); px('#2a2a2a', x + 4, y, 1, 2); }   // lattina schiacciata
          else { px('#5a4026', x, y - 1, 7, 4); px('#7a5a36', x, y - 1, 7, 1); px('#3a2a1a', x + 3, y, 1, 3); }   // cartone
        }
      } else if (D.id === 'ricco') {
        // asfalto steso da poco: più scuro e uniforme (le linee restano chiare)
        g.fillStyle = 'rgba(8,10,24,.42)'; for (const L of lanesY) g.fillRect(Math.floor(x0), L[0], Math.ceil(x1 - x0) + 1, L[1] - L[0] + 1);
        g.fillStyle = 'rgba(120,150,220,.05)'; g.fillRect(Math.floor(x0), 241, Math.ceil(x1 - x0) + 1, 2);
        // linea di bordo continua e catarifrangenti ogni 4,5 m che si accendono coi fari
        px('#e8e4d4', x0, 336, Math.ceil(x1 - x0) + 1, 1);
        for (let q = 0; q < 2; q++) {
          const x = wx(m + q * 4.5);
          for (const ly of [262, 300]) {
            const tw = 0.6 + 0.4 * Math.sin(m * 0.7 + ly + (this._t || 0) * 3);
            px('#4a4436', x - 1, ly - 1, 5, 4); px(`rgba(255,${210 + 35 * tw | 0},140,${0.7 + 0.3 * tw})`, x, ly, 3, 2);
            if (night > 0.3) { this.light(g, x + 1.5, ly + 1, 9, 3, '#ffe2a0', 0.07 * night * tw, 2); if (this.lightAdd) this.lightAdd(x + 1.5, ly + 1, 8, 3, '255,236,190', 0.7 * night * tw); }
          }
        }
      } else if (D.id === 'porto') {
        // binari del porto che attraversano la strada (ogni 63 m), annegati in una fascia di cemento
        if (k % 4 === 1) {
          const x = Math.round(x0 + (x1 - x0) * 0.3), w = Math.round(ppm * 2.2);
          px('#2c2e36', x, 239, w, 97); px('#3a3c44', x, 239, w, 1); px('#18191f', x + w, 239, 1, 97);
          for (let yy = 241; yy < 335; yy += 6) px('#25272e', x + 1, yy, w - 2, 1);
          for (const rx of [Math.round(w * 0.22), Math.round(w * 0.72)]) { px('#0c0d12', x + rx, 239, 2, 97); px('#8a8f9e', x + rx + 2, 239, 1, 97); px('#c8ccd8', x + rx + 2, 248 + (k * 13) % 70, 1, 6); }
          if (night > 0.3 && this.lightAdd) this.lightAdd(x + w / 2, 290, w * 0.7, 30, '255,170,90', 0.12 * night);
        }
        // macchie di gasolio iridescenti
        if (r(5) < 0.65) {
          const x = x0 + r(6) * (x1 - x0), y = 248 + Math.floor(r(7) * 78), rx = 12 + Math.floor(r(8) * 14);
          g.fillStyle = 'rgba(4,5,10,.62)'; this.span(g, x, y, rx, 3); this.span(g, x + rx * 0.7, y + 2, rx * 0.4, 2);
          px('rgba(190,90,230,.6)', x - rx * 0.6, y - 1, rx * 0.45, 1); px('rgba(70,210,210,.6)', x - rx * 0.15, y, rx * 0.45, 1); px('rgba(230,200,70,.55)', x + rx * 0.25, y + 1, rx * 0.35, 1);
        }
      } else if (D.id === 'lanterne') {
        // coriandoli e cartine rosse e oro della festa, più fitti verso i marciapiedi
        for (let q = 0; q < 10; q++) {
          if (r(q + 90) < 0.35) continue;
          const edge = r(q + 100) < 0.7, y = edge ? (r(q + 110) < 0.5 ? 240 + r(q + 120) * 8 : 325 + r(q + 120) * 9) : 244 + r(q + 120) * 86;
          px(['#ff3a2a', '#ffd23f', '#ff8a5a', '#f4f1e6'][q % 4], x0 + r(q + 130) * (x1 - x0), y, q % 3 ? 2 : 3, q % 2 ? 1 : 2);
        }
        if (r(9) < 0.3) { const x = x0 + r(10) * (x1 - x0); px('#c4241c', x, 328, 7, 4); px('#ffd23f', x + 2, 329, 3, 1); px('#7a1410', x, 331, 7, 1); }   // busta rossa caduta
      }
    }
  };
  // ---------------------------------------------------------------- pedoni e oggetti del marciapiede lontano
  // Ogni tratto di 6 m ha il suo seme: chi ci passeggia e cosa c'è appoggiato al muro dipendono dal quartiere.
  // Figura base (come i pedoni di sempre): testa 204-210, busto 210-220, gambe 220-229, piedi a 229.
  const KINDS = {
    casa: ['plain', 'plain', 'shopper', 'dog', 'kid'], centro: ['plain', 'phone', 'shopper', 'couple', 'plain', 'phone'],
    bassi: ['hood', 'hood', 'smoker', 'sitter', 'plain'], ricco: ['suit', 'lady', 'suit', 'lady', 'plain'],
    porto: ['worker', 'worker', 'forklift', 'worker'], lanterne: ['festive', 'festive', 'plain', 'couple'],
  };
  const PROPS = { casa: ['bike', 'bins'], centro: ['scooter', 'bins'], bassi: ['barrel', 'bags', 'cart', 'bags'], ricco: ['planter', 'bollards'], porto: ['pallets', 'drums'], lanterne: ['stall', 'stall'] };
  S.districtPeople = function (g, wx, from, to, t) {
    const C = this.C, ink = C.ink, SS = this.SS || 1, u = 1 / SS, night = 1 - (this.day || 0), rain = !!this.rainOn;
    const R = (v) => Math.round(v * SS) / SS;
    const px = (col, x, y, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(R(x), R(y), w, h); };
    const STEP = 6;
    // una figura: o = { coat, legs (colore), hair, head ('hair'|'hood'|'helmet'|'hat'|'bun'), dir, walk, small, long, vest, item }
    const fig = (X, o) => {
      const s = o.small ? 0.72 : 1, top = 229 - 25 * s, dir = o.dir;
      const Y = (v) => top + v * s;
      const lg = o.walk ? Math.floor(t * 7 + X * 0.1) % 2 : 0;
      px('rgba(4,5,12,.4)', X - 3, 229.5, 10 * s, 2);                                          // ombra
      px(ink, X - 1, Y(-0.5), 7 * s + 0.5, 26 * s);                                              // contorno
      // gambe (o veste lunga)
      if (o.long) { px(o.coat, X, Y(6), 5 * s, 19 * s); px(Street2D.shade(o.coat, -0.3), X + (dir > 0 ? 0 : 4 * s), Y(6), 1 * s, 19 * s); }
      else { px(o.legs || '#1a1a2a', X + (lg ? 0 : 1) * s, Y(15.5), 2 * s, 9 * s); px(o.legs || '#1a1a2a', X + (lg ? 3 : 2) * s, Y(15.5), 2 * s, 9 * s); }
      // busto
      px(o.coat, X, Y(5.5), 5 * s, 10.5 * s); px(Street2D.shade(o.coat, 0.3), X + (dir > 0 ? 4 * s : 0), Y(5.5), 1 * s, 10 * s);
      if (o.vest) { px('#ff8a1a', X, Y(6), 5 * s, 7 * s); px('#e8f0f0', X, Y(9.5), 5 * s, 1 * s); }   // gilet ad alta visibilità
      if (o.suit) { px('#e8e6e0', X + (dir > 0 ? 3 : 1) * s, Y(6), 1 * s, 4 * s); px('#7a1a24', X + (dir > 0 ? 3 : 1) * s, Y(7), 1 * s, 2 * s); }   // camicia e cravatta
      // testa
      px(C.skin, X, Y(0.5), 5 * s, 5 * s); px(Street2D.shade(C.skin, -0.25), X + (dir > 0 ? 0 : 4 * s), Y(0.5), 1 * s, 5 * s);
      const hc = o.hair || '#1a1010';
      if (o.head === 'hood') { px(o.coat, X - 0.5, Y(-0.5), 6 * s, 3 * s); px(o.coat, X + (dir > 0 ? -0.5 : 3.5 * s), Y(-0.5), 2 * s, 6 * s); px('#0a0a10', X + (dir > 0 ? 3 : 0) * s, Y(2), 2 * s, 3 * s); }
      else if (o.head === 'helmet') { px('#ffd23f', X - 0.5, Y(-0.5), 6 * s, 2.5 * s); px('#fff3a0', X, Y(-0.5), 3 * s, 1 * s); }
      else if (o.head === 'hat') { px('#14141c', X - 1, Y(0.5), 7 * s, 1 * s); px('#14141c', X, Y(-1.5), 5 * s, 2 * s); }
      else if (o.head === 'bun') { px(hc, X, Y(-0.5), 5 * s, 2 * s); px(hc, X + (dir > 0 ? -1 : 4) * s, Y(-1.5), 2 * s, 2 * s); px(hc, X + (dir > 0 ? 0 : 4) * s, Y(1), 1 * s, 4 * s); }
      else { px(hc, X, Y(-0.5), 5 * s, 2 * s); px(hc, dir > 0 ? X : X + 4 * s, Y(0.5), 1 * s, 3 * s); }
      // oggetti in mano
      const hx = X + (dir > 0 ? 5.5 : -2.5) * s;
      if (o.item === 'bag') { px(ink, hx, Y(9), 3, 5); px(o.bagCol || '#d9c08a', hx, Y(9.5), 2, 4); }
      else if (o.item === 'bags') { px(ink, hx, Y(9), 4, 6); px(o.bagCol || '#ff2e88', hx, Y(9.5), 3, 5); px('#f4f1e6', hx + 1, Y(9), 1, 1); }
      else if (o.item === 'handbag') { px('#2a1810', hx, Y(9), 3, 3); px('#d9a85a', hx + 1, Y(8), 1, 1); }
      else if (o.item === 'phone') { const c = '#bfe8ff'; px(c, hx - (dir > 0 ? 1 : -1), Y(5), 1, 2); if (night > 0.3) { this.light(g, hx, Y(5.5), 5, 4, '#9fd8ff', 0.12 * night, 2); if (this.lightAdd) this.lightAdd(hx, Y(4), 8, 8, '160,210,255', 0.6 * night); } }
      else if (o.item === 'cig') { const on = Math.sin(t * 1.3 + X) > 0.2; px(on ? '#ff6a1a' : '#a04010', hx, Y(5), 1, 1); if (on && night > 0.3 && this.lightAdd) this.lightAdd(hx, Y(5), 4, 4, '255,110,30', 0.5 * night);
        if (Math.floor(t * 2 + X) % 5 === 0) px('rgba(200,200,210,.35)', hx + 1, Y(2) - ((t * 6) % 6), 1, 2); }
      else if (o.item === 'clip') { px('#d9c08a', hx, Y(8), 2, 3); }
      if (rain && o.umbrella) { const uc = o.umbrella; px(ink, X - 4, Y(-4), 13 * s, 3); px(uc, X - 3.5, Y(-4), 12 * s, 2); px(Street2D.shade(uc, 0.3), X - 2, Y(-4.5), 8 * s, 1); px('#1a1a1a', X + 2, Y(-2), 1, 6); }
    };
    // oggetti del quartiere appoggiati al muro o sul bordo del marciapiede
    const prop = (kind, X, r) => {
      if (kind === 'barrel') {                       // bidone col fuoco: luce che balla sul muro e sui passanti
        px(ink, X - 1, 218, 9, 12); px('#5a3a22', X, 219, 7, 10); px('#7a5032', X + 1, 219, 1, 10); px('#3a2414', X, 222, 7, 1); px('#3a2414', X, 226, 7, 1);
        for (let q = 0; q < 4; q++) { const f = Math.sin(t * (9 + q * 3) + q * 2 + X) * 0.5 + 0.5; px(q % 2 ? '#ffd23f' : '#ff7a1a', X + 1 + q * 1.5, 218 - 2 - f * 4, 1.5, 2 + f * 3); }
        const fl = 0.75 + 0.25 * Math.sin(t * 11 + X) * Math.sin(t * 7.3);
        this.light(g, X + 3.5, 214, 22, 12, '#ff8a30', 0.06 * fl * (0.4 + night), 3);
        if (this.lightAdd) this.lightAdd(X + 3.5, 218, 40 * fl, 16, '255,140,50', 0.95 * night * fl);
      } else if (kind === 'bags') {
        for (let q = 0; q < 3; q++) { const bx = X + q * 4, h = 5 + (q % 2) * 2; px(ink, bx - 1, 229 - h - 1, 6, h + 1); px('#14161c', bx, 229 - h, 4, h); px('#3a3e4a', bx + 1, 229 - h, 1, 2); }
      } else if (kind === 'cart') {
        px('#8a8f9e', X, 220, 12, 1); px('#8a8f9e', X, 220, 1, 6); px('#8a8f9e', X + 11, 220, 1, 6); px('#8a8f9e', X, 225, 12, 1);
        for (let q = 2; q < 11; q += 2) px('#5c616c', X + q, 221, 1, 4); px('#8a8f9e', X - 2, 219, 3, 1); px(ink, X + 1, 228, 2, 2); px(ink, X + 9, 228, 2, 2);
      } else if (kind === 'planter') {
        px(ink, X - 1, 219, 12, 11); px('#9a958a', X, 224, 10, 6); px('#c8c2b4', X, 224, 10, 1);
        px('#1f4a2a', X, 218, 10, 6); px('#2f6a3a', X + 1, 217, 8, 3); px('#4a8a52', X + 2, 217, 3, 1);
      } else if (kind === 'bollards') {
        for (let q = 0; q < 3; q++) { const bx = X + q * 9; px(ink, bx - 1, 221, 4, 9); px('#2a2e38', bx, 222, 2, 8); px('#ffe9b8', bx, 222, 2, 1); if (night > 0.3 && this.lightAdd) this.lightAdd(bx + 1, 226, 10, 6, '255,233,184', 0.7 * night); }
      } else if (kind === 'pallets') {
        for (let q = 0; q < 3; q++) { const py = 228 - q * 3; px(ink, X - 1, py - 1, 15, 3); px('#a07a44', X, py - 1, 13, 1); px('#6a4a24', X, py, 13, 1); for (let z = 0; z < 13; z += 5) px('#5a3a1a', X + z, py, 2, 1); }
        if (r(9) < 0.5) { px(ink, X + 1, 213, 11, 7); px('#c8b48a', X + 2, 214, 9, 5); px('#8a7a5a', X + 2, 216, 9, 1); }   // scatolone sopra
      } else if (kind === 'drums') {
        for (let q = 0; q < 2; q++) { const bx = X + q * 7, c = q ? '#2a5aa8' : '#b8321e'; px(ink, bx - 1, 219, 7, 11); px(c, bx, 220, 5, 9); px(Street2D.shade(c, 0.35), bx + 1, 220, 1, 9); px(Street2D.shade(c, -0.4), bx, 223, 5, 1); }
      } else if (kind === 'stall') {                 // bancarella: tendone a strisce, lanterna, vapore dalla pentola
        px(ink, X - 1, 204, 22, 4); for (let q = 0; q < 20; q += 4) { px('#c4241c', X + q, 205, 2, 2); px('#f4f1e6', X + q + 2, 205, 2, 2); }
        px('#3a2414', X, 207, 1, 22); px('#3a2414', X + 19, 207, 1, 22);
        px(ink, X - 1, 220, 22, 9); px('#7a4a24', X, 221, 20, 8); px('#9a6a34', X, 221, 20, 1);
        px('#2a2a30', X + 4, 218, 5, 3); for (let q = 0; q < 3; q++) px('rgba(230,230,240,.4)', X + 5 + Math.sin(t * 2 + q) * 1.5, 216 - ((t * 5 + q * 3) % 9), 1.5, 1.5);
        px('#ff3a2a', X + 14, 209, 3, 4); px('#ffd23f', X + 15, 210, 1, 2);
        if (this.lightAdd) this.lightAdd(X + 10, 216, 30, 14, '255,170,90', 0.85 * night);
        this.light(g, X + 15, 211, 9, 7, '#ff6a3a', 0.06 * (0.4 + night), 2);
      } else if (kind === 'bike') {
        px(ink, X, 223, 1, 1); g.strokeStyle = '#2a2d34'; g.lineWidth = u * 1.5;
        for (const cx of [X + 2, X + 12]) { g.beginPath(); g.arc(R(cx), 226, 3.4, 0, Math.PI * 2); g.stroke(); }
        px('#b8321e', X + 2, 222, 10, 1); px('#b8321e', X + 7, 222, 1, 4); px('#14141c', X + 6, 221, 3, 1); px('#8a8f9e', X + 11, 220, 2, 1);
      } else if (kind === 'bins') {
        for (const [q, c] of [[0, '#2a6a3a'], [1, '#2a4a9a'], [2, '#d9b02a']]) { const bx = X + q * 6; px(ink, bx - 1, 220, 6, 10); px(c, bx, 221, 4, 9); px(Street2D.shade(c, -0.35), bx, 221, 4, 1); }
      } else if (kind === 'scooter') {
        px(ink, X, 219, 12, 10); px('#e8e4d4', X + 1, 220, 8, 4); px('#e8e4d4', X + 8, 218, 3, 6); px('#14141c', X + 9, 217, 3, 1);
        px('#14141c', X + 1, 226, 3, 3); px('#14141c', X + 8, 226, 3, 3); px('#ffb000', X + 11, 220, 1, 1);
      }
    };
    for (let j = Math.floor((from - 40) / STEP); j * STEP < to + 40; j++) {
      const m0 = j * STEP, D = this.districtAt(m0 + STEP / 2), r = (o) => rnd(j * 13.37 + o * 7.1);
      const Pk = PROPS[D.id], Kk = KINDS[D.id] || KINDS.casa;
      if (Pk && r(1) < 0.3) prop(Pk[Math.floor(r(2) * Pk.length)], wx(m0 + 0.5 + r(3) * (STEP - 1.5)), r);
      const dens = Math.min(1, (D.people || 4) / 5);
      for (let n = 0; n < 2; n++) {
        if (r(10 + n) > dens * (n ? 0.4 : 0.8)) continue;
        const kind = Kk[Math.floor(r(20 + n) * Kk.length)], seed = r(30 + n);
        const still = kind === 'smoker' || kind === 'sitter';
        // a piedi: avanti e indietro lungo il proprio tratto (prima o poi si gira), ognuno col suo passo
        const sp = kind === 'forklift' ? 1.1 : kind === 'kid' ? 1.6 : 1.1 + seed * 0.6, span = 8 + seed * 6;
        const ph = t * sp / span + seed * 4, tri = 2 * Math.abs(ph % 2 - 1) - 1, goingRight = (ph % 2) < 1;
        const mm = m0 + r(40 + n) * STEP + (still ? 0 : tri * span * 0.5), X = Math.round(wx(mm)), dir = still ? (seed < 0.5 ? 1 : -1) : goingRight ? -1 : 1;
        if (X < -30 || X > this.LW + 30) continue;
        const pal = (a) => a[Math.floor(seed * 97) % a.length];
        const umbrella = pal(['#c4241c', '#1a2a6a', '#2a2a2a', '#d9b02a', '#3a7a4a']);
        if (kind === 'forklift') {                       // muletto giallo con l'operaio e le forche alzate a metà
          const lift = 3 + Math.sin(t * 0.7 + seed * 9) * 2, fx = dir > 0 ? X + 14 : X - 4;
          px(ink, X - 1, 214, 16, 16); px('#e8b020', X, 220, 14, 7); px('#c89010', X, 225, 14, 2); px('#14141c', X + 3, 214, 1, 6); px('#14141c', X + 10, 214, 1, 6); px('#14141c', X + 3, 214, 8, 1);
          px(C.skin, X + 5, 215, 3, 3); px('#ffd23f', X + 5, 214, 3, 1);
          px('#3a3e4a', dir > 0 ? X + 14 : X - 2, 210, 2, 19); px('#8a8f9e', fx, 227 - lift, 5, 1);
          px(ink, X + 1, 227, 4, 3); px(ink, X + 9, 227, 4, 3); px('#ffb000', dir > 0 ? X : X + 13, 219, 1, 1);
          if (night > 0.3 && this.lightAdd) this.lightAdd(dir > 0 ? X + 18 : X - 6, 224, 16, 6, '255,220,150', 0.6 * night);
          continue;
        }
        if (kind === 'sitter') {                          // seduto per terra contro il muro, con la coperta
          px(ink, X - 1, 216, 10, 14); px('#4a3a2a', X, 222, 9, 7); px('#6a5a3a', X, 222, 9, 1); px('#2a2e3a', X + 1, 217, 5, 6);
          px(C.skin, X + 1, 213, 4, 4); px('#3a2a1a', X + 1, 212, 4, 2); px('#8a7a5a', X + 7, 227, 3, 2);   // tazza per le monete
          continue;
        }
        const base = { dir, walk: !still };
        if (kind === 'plain') fig(X, { ...base, coat: pal(['#2a1f4f', '#123049', '#3a1f2e', '#1f3a2e', '#4a2a1a', '#2a2a3a']), hair: pal(['#1a1010', '#3a2010', '#d9c08a', '#0a0a0a', '#7a3a1a', '#c0c0c0']), umbrella, item: seed > 0.8 ? 'bag' : null });
        else if (kind === 'shopper') fig(X, { ...base, coat: pal(['#7a2a4a', '#2a4a6a', '#5a4a2a']), hair: pal(['#3a2010', '#d9c08a', '#1a1010']), head: seed > 0.5 ? 'bun' : 'hair', item: D.id === 'casa' ? 'bag' : 'bags', bagCol: pal(['#ff2e88', '#2ee6ff', '#ffb000', '#f4f1e6']), umbrella });
        else if (kind === 'phone') fig(X, { ...base, coat: pal(['#1a1a2a', '#3a1f4a', '#123049']), hair: pal(['#0a0a0a', '#7a3a1a']), item: 'phone', umbrella });
        else if (kind === 'dog') { fig(X, { ...base, coat: pal(['#3a4a2a', '#4a2a1a']), hair: '#5a4a3a', umbrella });
          const dx = X + (dir > 0 ? 9 : -9), lg = Math.floor(t * 9) % 2; px(ink, dx - 1, 223, 8, 6); px('#8a5a2a', dx, 224, 6, 3); px('#8a5a2a', dx + (dir > 0 ? 5 : -1), 222, 2, 3);
          px('#5a3a1a', dx + 1 + lg, 227, 1, 2); px('#5a3a1a', dx + 4 - lg, 227, 1, 2); g.strokeStyle = '#1a1a1a'; g.lineWidth = u; g.beginPath(); g.moveTo(R(X + (dir > 0 ? 5 : 0)), 216); g.lineTo(R(dx + (dir > 0 ? 6 : 0)), 223); g.stroke(); }
        else if (kind === 'kid') fig(X, { ...base, small: true, coat: pal(['#d9b02a', '#c4241c', '#2a8ad8']), hair: '#3a2010' });
        else if (kind === 'couple') { const o2 = { ...base, coat: pal(['#5a1a2a', '#2a3a5a']), hair: '#1a1010', umbrella }; fig(X, o2); fig(X + (dir > 0 ? -7 : 7), { ...o2, coat: pal(['#d9c08a', '#3a5a3a', '#7a2a4a']), hair: pal(['#d9c08a', '#3a2010']), head: 'bun', umbrella: null }); }
        else if (kind === 'hood') fig(X, { ...base, coat: pal(['#2a2e34', '#1f2a24', '#3a2e24', '#2a2a3a']), legs: '#2a3a5a', head: 'hood' });
        else if (kind === 'smoker') fig(X, { ...base, coat: pal(['#3a2e24', '#2a2e34']), legs: '#2a2a3a', hair: '#1a1010', item: 'cig' });
        else if (kind === 'suit') fig(X, { ...base, coat: pal(['#14161e', '#1a2030', '#2a2a30']), legs: '#14161e', hair: pal(['#1a1010', '#8a8a8a', '#3a2010']), suit: true, item: seed > 0.6 ? 'phone' : null, umbrella: '#14141c' });
        else if (kind === 'lady') fig(X, { ...base, coat: pal(['#c8b48a', '#5a1a2a', '#1a1a1a', '#e8e4d4']), long: true, hair: pal(['#d9c08a', '#1a1010', '#7a3a1a']), head: seed > 0.4 ? 'bun' : 'hair', item: 'handbag', umbrella: '#14141c' });
        else if (kind === 'worker') fig(X, { ...base, coat: '#2a3a5a', legs: '#2a3a5a', head: 'helmet', vest: true, item: seed > 0.6 ? 'clip' : null });
        else if (kind === 'festive') fig(X, { ...base, coat: pal(['#c4241c', '#1a2a6a', '#5a2a6a', '#d9b02a']), long: true, hair: '#0a0a0a', head: 'bun', item: seed > 0.7 ? 'bag' : null });
      }
    }
  };
})();
