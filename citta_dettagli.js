// ============================================================================
//  Night Run · I particolari delle capitali (dopo citta_dati.js, v0.113)
//  Quello che fa riconoscere una città dal marciapiede: pini e fontanelle a Roma, colonne Morris e metro Guimard a Parigi,
//  cabine rosse e lampioni neri a Londra, Ampelmännchen e torri della pubblicità a Berlino, bandiere, fermate, alberi.
//  - `Street2D.CITY_PROPS[kind]`: oggetti del marciapiede (disegnati sotto i passanti da `cityProps`, agganciato a
//    `districtPeople`); ogni quartiere elenca i suoi in `props` (citta_dati.js) con la probabilità `propP`.
//  - `Street2D.CITY_ROAD[id]`: segni sull'asfalto (agganciati a `districtRoad`): LOOK RIGHT e doppia riga gialla a Londra,
//    sampietrini a Roma, strisce gialle a Washington.
//  Tutto a codice, deterministico (`Street2D.rnd`): le cose restano dove sono. Test in test/citta.test.js.
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined' || !Street2D.CITY_DISTRICTS) return;
  const S = Street2D.prototype, sh = Street2D.shade, rnd = Street2D.rnd;
  const PR = {}; Street2D.CITY_PROPS = PR;
  const RD = {}; Street2D.CITY_ROAD = RD;
  const G = 229;                                              // la linea del marciapiede su cui si appoggia tutto

  // piccoli attrezzi comuni: c = { px, X, ink, night, t, r, S, g }
  const tree = (c, X, o) => {                                 // albero: tronco e chioma a macchie
    const { px, ink } = c, th = o.th || 16, cw = o.cw || 20, ch = o.ch || 14, top = G - th - ch + 4;
    px(ink, X + cw / 2 - 2, G - th, 4, th); px(o.trunk || '#3a2a1e', X + cw / 2 - 1, G - th, 2, th);
    for (let q = 0; q < 26; q++) { const a = q * 2.4, rr = 0.55 + 0.45 * ((q * 7) % 5) / 5, x = X + cw / 2 + Math.cos(a) * cw / 2 * rr, y = top + ch / 2 + Math.sin(a) * ch / 2 * rr; px(q % 3 ? o.leaf : sh(o.leaf, 0.22), x - 2.5, y - 1.5, 5 + (q % 2), 3); }
    px(sh(o.leaf, -0.3), X + cw / 2 - cw * 0.35, top + ch * 0.72, cw * 0.7, 2);
  };
  const pole = (c, X, h, col) => { c.px(c.ink, X - 1, G - h, 3, h); c.px(col || '#2a2e38', X, G - h, 1, h); };
  const lampGlow = (c, x, y, rr, rgb, a) => { if (c.night > 0.25 && c.S.lightAdd) c.S.lightAdd(x, y, rr, rr * 0.6, rgb, a * c.night); };
  const flag = (c, X, y, w, h, draw) => { const wave = Math.sin(c.t * 2.2 + X) * 0.6; draw(X, y + wave, w, h); };

  // ---------------------------------------------------------------- Roma
  PR.pino = (c) => { const { px, X, ink } = c;      // pino marittimo: tronco lungo e chioma piatta a ombrello
    px(ink, X + 6, G - 30, 4, 30); px('#4a3424', X + 7, G - 30, 2, 30); px('#6a4a30', X + 7, G - 24, 1, 6);
    for (let q = 0; q < 34; q++) { const x = X - 6 + (q * 5) % 28, y = G - 40 + ((q * 3) % 7) - Math.abs(x - X - 8) * 0.12; px(q % 3 ? '#1f4a2a' : '#2f6a3a', x, y, 5, 2); }
    px('#16381f', X - 6, G - 36, 28, 1); };
  PR.cipresso = (c) => { const { px, X, ink } = c;
    px(ink, X, G - 36, 7, 36); for (let j = 0; j < 34; j++) { const w = Math.round(2 + 3.5 * Math.sin(Math.min(1, j / 20) * 1.5)); px(j % 4 ? '#1c4426' : '#2a5a34', X + 3.5 - w / 2, G - 35 + j, w, 1); } px('#3a2a1e', X + 3, G - 3, 1, 3); };
  PR.nasone = (c) => { const { px, X, ink } = c;   // la fontanella di ghisa che a Roma si chiama nasone
    px(ink, X - 1, G - 14, 6, 14); px('#2a4a32', X, G - 13, 4, 13); px('#3a6a44', X, G - 13, 1, 13); px('#2a4a32', X + 1, G - 15, 3, 2); px('#8a8f9e', X + 4, G - 11, 3, 1); px('#8a8f9e', X + 6, G - 10, 1, 2);
    px('#6a7a96', X + 5, G - 6 + (c.t * 6 % 3), 1, 2); px(ink, X - 2, G - 2, 10, 2); px('#7a7466', X - 1, G - 2, 8, 1); };
  PR.fontana = (c) => { const { px, X, ink, t } = c;   // fontana di travertino con il getto
    px(ink, X - 1, G - 9, 26, 9); px('#b8ad94', X, G - 8, 24, 7); px('#d8ceb4', X, G - 8, 24, 1); px('#4a6a8a', X + 2, G - 6, 20, 3); px('#7aa0c8', X + 3, G - 6, 18, 1);
    px(ink, X + 10, G - 18, 4, 10); px('#b8ad94', X + 11, G - 17, 2, 9); px('#9a8f78', X + 8, G - 12, 8, 2);
    for (let q = 0; q < 6; q++) { const f = (t * 3 + q * 0.5) % 3; px('#cfe6ff', X + 12 + Math.sin(q * 2) * (f * 2), G - 18 + f * 3.4, 1, 2); }
    lampGlow(c, X + 12, G - 8, 22, '180,210,255', 0.35); };
  PR.tavolini = (c) => { const { px, X, ink } = c;   // trattoria: tavolini con la tovaglia a quadri e l'ombrellone
    for (let q = 0; q < 2; q++) { const x = X + q * 14; px(ink, x - 1, G - 8, 11, 8); px('#c4241c', x, G - 8, 9, 2); px('#f4f1e6', x + 2, G - 8, 2, 2); px('#f4f1e6', x + 6, G - 8, 2, 2); px('#e8e0cc', x, G - 6, 9, 1); px(ink, x + 4, G - 5, 1, 5); px('#5a3a22', x - 2, G - 5, 2, 5); px('#5a3a22', x + 9, G - 5, 2, 5); }
    px(ink, X + 6, G - 26, 18, 3); px('#d8c9a0', X + 7, G - 25, 16, 2); px('#8a2a24', X + 11, G - 25, 4, 2); px(ink, X + 14, G - 24, 1, 17);
    lampGlow(c, X + 14, G - 12, 24, '255,200,120', 0.4); };
  PR.ztl = (c) => { const { px, X, ink } = c;      // cartello ZTL (zona a traffico limitato)
    pole(c, X, 22); px(ink, X - 5, G - 29, 12, 12); px('#f4f1e6', X - 4, G - 28, 10, 10); px('#c4241c', X - 4, G - 28, 10, 2); px('#c4241c', X - 4, G - 20, 10, 1); px('#c4241c', X - 4, G - 28, 1, 10); px('#c4241c', X + 5, G - 28, 1, 10);
    c.S.text(c.g, 'ZTL', X - 4, G - 24, '#1a1a2a', 1); };
  PR.colonna = (c) => { const { px, X, ink } = c;  // colonna antica spezzata
    px(ink, X - 1, G - 16, 10, 16); px('#cfc4a8', X, G - 15, 8, 15); px('#e0d6bc', X, G - 15, 2, 15); for (let k = 2; k < 8; k += 2) px('#9a8f78', X + k, G - 15, 1, 15);
    px(ink, X - 3, G - 3, 14, 3); px('#b8ad94', X - 2, G - 3, 12, 2); px('#a89c80', X + 5, G - 18, 6, 3); };
  PR.vespa = (c) => { const { px, X, ink } = c;
    px(ink, X, G - 14, 16, 14); px('#e8d8a8', X + 2, G - 12, 9, 6); px('#e8d8a8', X + 10, G - 15, 3, 8); px(ink, X + 9, G - 16, 5, 2); px('#2a2a30', X + 2, G - 6, 4, 6); px('#2a2a30', X + 11, G - 6, 4, 6); px('#b8321e', X + 4, G - 8, 5, 2); px('#ffe9b8', X + 15, G - 12, 1, 2); };
  PR.edicola = (c) => { const { px, X, ink } = c;
    px(ink, X - 1, G - 26, 24, 26); px('#3a5a3a', X, G - 25, 22, 25); px('#2a4a2a', X, G - 25, 22, 3); px('#e8d8a8', X + 2, G - 22, 18, 1);
    for (let k = 0; k < 5; k++) px(['#c4241c', '#e8c84a', '#2a6ad8', '#f4f1e6', '#d87aa8'][k], X + 2 + k * 3.6, G - 16, 3, 7); px('#1a1a2a', X + 2, G - 9, 18, 8); px('#ffe9b8', X + 4, G - 8, 14, 5);
    c.S.text(c.g, 'GIORNALI', X + 2, G - 21, '#f4f1e6', 1); lampGlow(c, X + 11, G - 8, 26, '255,220,150', 0.5); };

  // ---------------------------------------------------------------- Parigi
  PR.morris = (c) => { const { px, X, ink } = c;    // colonna Morris: manifesti di spettacoli, tettuccio a cono
    px(ink, X - 1, G - 28, 12, 28); px('#1f4a3a', X, G - 27, 10, 27); px('#2f6a52', X, G - 27, 2, 27); px('#143426', X + 8, G - 27, 2, 27);
    px('#e8d8a8', X + 1, G - 22, 8, 12); px('#c4241c', X + 2, G - 21, 6, 3); px('#2a3a8a', X + 2, G - 16, 6, 4); px('#1f4a3a', X, G - 10, 10, 2);
    for (let j = 0; j < 5; j++) px(ink, X + j * 1, G - 33 + j, 10 - j * 2, 1); px('#1f4a3a', X + 1, G - 32, 8, 5); px(ink, X + 4, G - 36, 2, 4); px('#c9a84a', X + 4, G - 37, 2, 2);
    lampGlow(c, X + 5, G - 16, 22, '255,220,140', 0.35); };
  PR.wallace = (c) => { const { px, X, ink } = c;    // fontanella Wallace: ghisa verde con le cariatidi
    px(ink, X - 1, G - 24, 11, 24); px('#2a5a44', X, G - 23, 9, 23); px('#3a7a5a', X, G - 23, 1, 23); px('#1a3a2c', X + 8, G - 23, 1, 23); px('#2a5a44', X + 1, G - 26, 7, 3); px('#c9a84a', X + 3, G - 28, 3, 2);
    px('#1a3a2c', X + 2, G - 12, 5, 8); px('#7aa0c8', X + 3, G - 6 + (c.t * 7 % 3), 1, 3); px(ink, X - 1, G - 2, 11, 2); };
  PR.metro = (c) => { const { px, X, ink, S: s, g } = c;  // entrata del metrò di Guimard: arco verde coi due lampioni arancio
    for (const dx of [0, 24]) { px(ink, X + dx - 1, G - 26, 5, 26); px('#2a6a4a', X + dx, G - 25, 3, 25); px('#e89a2a', X + dx - 1, G - 32, 5, 6); px('#ffd98a', X + dx, G - 31, 3, 3); }
    px(ink, X - 1, G - 26, 29, 8); px('#2a6a4a', X, G - 25, 27, 6); for (let q = 0; q < 27; q += 3) px('#1a4a32', X + q, G - 25, 1, 6);
    s.text(g, 'METRO', X + 3, G - 24, '#e8f0d8', 1); px('#3a8a62', X, G - 25, 27, 1);
    lampGlow(c, X + 1, G - 30, 20, '255,170,60', 0.5); lampGlow(c, X + 25, G - 30, 20, '255,170,60', 0.5); };
  PR.platano = (c) => tree(c, c.X, { th: 18, cw: 26, ch: 16, leaf: '#4a6a3a', trunk: '#8a8478' });
  PR.lampadaire = (c) => { const { px, X, ink } = c;  // lampione parigino a due globi
    pole(c, X, 30, '#1f2a2a'); px(ink, X - 4, G - 24, 9, 2); px('#1f2a2a', X - 3, G - 24, 7, 1);
    for (const dx of [-5, 4]) { px(ink, X + dx - 1, G - 31, 4, 7); px('#fff0c0', X + dx, G - 30, 2, 5); }
    lampGlow(c, X - 4, G - 28, 26, '255,230,160', 0.55); lampGlow(c, X + 5, G - 28, 26, '255,230,160', 0.55); };
  PR.terrasse = (c) => { const { px, X, ink } = c;    // terrazza del caffè: tavolino rotondo e sedie intrecciate
    for (let q = 0; q < 2; q++) { const x = X + q * 13; px(ink, x - 1, G - 9, 9, 2); px('#e8e0cc', x, G - 9, 7, 1); px(ink, x + 3, G - 8, 1, 8); px('#5a4a3a', x - 3, G - 7, 3, 7); px(ink, x - 3, G - 8, 3, 1); px('#5a4a3a', x + 8, G - 7, 3, 7); px('#ffd98a', x + 2, G - 11, 3, 2); }
    lampGlow(c, X + 8, G - 10, 18, '255,210,130', 0.4); };
  PR.kiosque = (c) => { const { px, X, ink, S: s, g } = c;
    px(ink, X - 1, G - 28, 22, 28); px('#2a5a44', X, G - 27, 20, 27); px('#1a3a2c', X, G - 27, 20, 3); px('#c9a84a', X, G - 24, 20, 1);
    for (let k = 0; k < 5; k++) px(['#c4241c', '#e8c84a', '#2a6ad8', '#f4f1e6', '#d87aa8'][k], X + 2 + k * 3.6, G - 20, 3, 8); px('#1a2a2a', X + 2, G - 10, 16, 9);
    s.text(g, 'KIOSQUE', X + 2, G - 23, '#e8f0d8', 1); lampGlow(c, X + 10, G - 10, 24, '255,225,150', 0.4); };
  PR.bouquiniste = (c) => { const { px, X, ink } = c;
    px(ink, X - 1, G - 12, 24, 12); px('#2a5a44', X, G - 11, 22, 11); px('#1a3a2c', X, G - 11, 22, 2);
    for (let k = 0; k < 9; k++) px(['#7a2a24', '#2a4a7a', '#7a6a2a', '#4a2a5a'][k % 4], X + 1 + k * 2.4, G - 8, 2, 5); px('#c9a84a', X, G - 4, 22, 1); };

  // ---------------------------------------------------------------- Londra
  PR.cabina = (c) => { const { px, X, ink } = c;    // cabina telefonica rossa
    px(ink, X - 1, G - 25, 11, 25); px('#b01c1c', X, G - 24, 9, 24); px('#d82a2a', X, G - 24, 1, 24); px('#7a1010', X + 8, G - 24, 1, 24);
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) { px('#ffe9b8', X + 1 + b * 2.8, G - 21 + a * 5, 2, 4); px('#7a1010', X + 3 + b * 2.8, G - 21 + a * 5, 1, 4); }
    px('#b01c1c', X - 1, G - 27, 11, 3); px('#e8c84a', X + 2, G - 26, 5, 1); px(ink, X + 3, G - 29, 3, 2); lampGlow(c, X + 5, G - 14, 20, '255,210,150', 0.45); };
  PR.pilastro = (c) => { const { px, X, ink } = c;
    px(ink, X - 1, G - 14, 8, 14); px('#b01c1c', X, G - 13, 6, 13); px('#d82a2a', X, G - 13, 1, 13); px('#7a1010', X + 5, G - 13, 1, 13); px('#14141c', X + 1, G - 9, 4, 1); px('#14141c', X, G - 15, 6, 2); px('#7a1010', X + 1, G - 11, 4, 1); };
  PR.roundel = (c) => { const { px, X, ink, g, S: s } = c;   // cartello della metropolitana
    pole(c, X, 28, '#2a2e38'); px(ink, X - 8, G - 36, 18, 9); px('#f4f1e6', X - 7, G - 35, 16, 7);
    for (let a = 0; a < 12; a++) { const an = a / 12 * 6.28; px('#c4241c', X + 1 + Math.cos(an) * 5, G - 31.5 + Math.sin(an) * 3, 2, 2); }
    px('#1a2a8a', X - 7, G - 33, 16, 2); s.text(g, 'TUBE', X - 6, G - 35, '#f4f1e6', 1);
    lampGlow(c, X + 1, G - 32, 22, '255,255,240', 0.3); };
  PR.fermata = (c) => { const { px, X, ink } = c;   // fermata del bus con la bandiera rossa
    pole(c, X, 24, '#2a2e38'); px(ink, X - 1, G - 32, 11, 9); px('#c4241c', X, G - 31, 9, 7); px('#f4f1e6', X + 3, G - 29, 3, 3); px('#f4f1e6', X + 2, G - 28, 5, 1); };
  PR.ringhiera = (c) => { const { px, X, ink } = c;  // ringhiera nera a punta
    for (let k = 0; k < 22; k += 3) { px(ink, X + k - 1, G - 13, 3, 13); px('#1a1a22', X + k, G - 12, 1, 12); px('#3a3a46', X + k, G - 14, 1, 2); } px('#1a1a22', X - 1, G - 11, 23, 1); px('#1a1a22', X - 1, G - 3, 23, 1); };
  PR.lampioneL = (c) => { const { px, X, ink } = c;  // lampione vittoriano nero con la lanterna
    pole(c, X, 32, '#14161c'); px(ink, X - 3, G - 38, 8, 7); px('#14161c', X - 2, G - 37, 6, 5); px('#ffe9b8', X - 1, G - 36, 4, 3); px(ink, X - 4, G - 40, 10, 2);
    lampGlow(c, X + 1, G - 34, 30, '255,200,120', 0.7); };
  PR.semaforo = (c) => { const { px, X, ink, t } = c;
    pole(c, X, 26, '#2a2e38'); px(ink, X - 2, G - 34, 6, 10); const ph = Math.floor(t / 3 + X * 0.01) % 3;
    px('#14141c', X - 1, G - 33, 4, 8); px(ph === 0 ? '#ff3a2a' : '#3a1414', X, G - 32, 2, 2); px(ph === 1 ? '#ffb02a' : '#3a2a14', X, G - 29, 2, 2); px(ph === 2 ? '#3aff6a' : '#143a1c', X, G - 26, 2, 2); };

  // ---------------------------------------------------------------- Stoccolma
  PR.bandieraSE = (c) => { const { px, X, ink } = c; pole(c, X, 40, '#8a8f9e'); flag(c, X + 1, G - 40, 16, 10, (x, y) => { px(ink, x - 1, y - 1, 18, 12); px('#1a5aa8', x, y, 16, 10); px('#ffd23f', x + 4, y, 3, 10); px('#ffd23f', x, y + 4, 16, 2); }); };
  PR.tbana = (c) => { const { px, X, ink, S: s, g } = c;
    pole(c, X, 28, '#2a2e38'); px(ink, X - 6, G - 36, 14, 14); px('#1a5aa8', X - 5, G - 35, 12, 12); s.text(g, 'T', X - 1, G - 32, '#f4f1e6', 2); lampGlow(c, X + 1, G - 30, 20, '120,170,255', 0.45); };
  PR.biciclette = (c) => { const { px, X, ink, g } = c;
    px('#2a2e38', X, G - 6, 24, 1); for (let q = 0; q < 3; q++) { const x = X + 3 + q * 8; g.strokeStyle = '#2a2d34'; g.lineWidth = 1; for (const cx of [x, x + 6]) { g.beginPath(); g.arc(Math.round(cx), G - 5, 3.4, 0, 6.28); g.stroke(); } px(['#2a6ad8', '#c4241c', '#e8c84a'][q], x, G - 9, 6, 1); px(ink, x + 3, G - 9, 1, 5); } };
  PR.betulla = (c) => { const { px, X } = c;
    px(c.ink, X + 8, G - 20, 3, 20); px('#e8e4d4', X + 9, G - 20, 1, 20); for (let k = 0; k < 6; k++) px('#2a2a30', X + 9, G - 18 + k * 3, 1, 1);
    tree(c, X, { th: 20, cw: 20, ch: 14, leaf: '#8aa83a', trunk: '#e8e4d4' }); };
  PR.cafeSE = (c) => { const { px, X, ink } = c;     // tavolino con la coperta e la candela
    for (let q = 0; q < 2; q++) { const x = X + q * 12; px(ink, x - 1, G - 9, 9, 2); px('#e8e4d4', x, G - 9, 7, 1); px(ink, x + 3, G - 8, 1, 8); px('#9a4a3a', x - 2, G - 12, 3, 9); px('#ffd98a', x + 3, G - 11, 1, 2); }
    lampGlow(c, X + 8, G - 10, 20, '255,200,120', 0.45); };

  // ---------------------------------------------------------------- Berlino
  PR.ampel = (c) => { const { px, X, ink, t } = c;     // semaforo pedonale con l'Ampelmännchen
    pole(c, X, 26, '#2a2e38'); px(ink, X - 3, G - 36, 9, 11); px('#14141c', X - 2, G - 35, 7, 9); const walk = Math.floor(t / 3 + X * 0.013) % 2 === 0;
    const col = walk ? '#3aff6a' : '#ff3a2a';
    px(col, X + 1, G - 34, 2, 2); px(col, X + 1, G - 32, 1, 3); px(col, X - 1, G - 31, 2, 1); px(col, X + 2, G - 31, 2, 1); px(col, X + (walk ? 0 : 2), G - 29, 1, 2); px(col, X + (walk ? 3 : 1), G - 29, 1, 2); if (!walk) px(col, X - 1, G - 33, 6, 1);
    lampGlow(c, X + 1, G - 31, 16, walk ? '60,255,110' : '255,60,40', 0.5); };
  PR.ubahn = (c) => { const { px, X, ink, S: s, g } = c;
    pole(c, X, 28, '#2a2e38'); px(ink, X - 7, G - 36, 16, 11); px('#1a5aa8', X - 6, G - 35, 14, 9); s.text(g, 'U', X - 1, G - 33, '#f4f1e6', 2); lampGlow(c, X + 1, G - 31, 20, '120,170,255', 0.45); };
  PR.litfass = (c) => { const { px, X, ink } = c;     // colonna della pubblicità
    px(ink, X - 1, G - 28, 12, 28); px('#cfc4a8', X, G - 27, 10, 27); px('#e8dec4', X, G - 27, 2, 27); px('#9a8f78', X + 8, G - 27, 2, 27);
    for (let k = 0; k < 4; k++) { px(['#c4241c', '#2a6ad8', '#e8c84a', '#1a1a2a'][k], X + 1 + (k % 2) * 4, G - 24 + Math.floor(k / 2) * 9, 4, 8); }
    px('#3a3a46', X - 1, G - 30, 12, 3); px(ink, X + 4, G - 33, 2, 3); lampGlow(c, X + 5, G - 16, 20, '255,240,200', 0.3); };
  PR.doner = (c) => { const { px, X, ink, S: s, g, t } = c;
    px(ink, X - 1, G - 28, 24, 28); px('#8a2a24', X, G - 27, 22, 27); px('#c4241c', X, G - 27, 22, 4); px('#1a1a2a', X + 2, G - 20, 18, 17); px('#ffe9b8', X + 3, G - 19, 16, 8);
    for (let k = 0; k < 4; k++) px(k % 2 ? '#a0603a' : '#c8884a', X + 9 + ((Math.floor(t * 4) + k) % 2), G - 18 + k * 2, 5, 2); s.text(g, 'DONER', X + 3, G - 25, '#f4f1e6', 1);
    lampGlow(c, X + 11, G - 10, 28, '255,200,110', 0.6); };
  PR.mauer = (c) => { const { px, X, ink } = c;       // pezzi del Muro dipinti dai graffiti
    for (let q = 0; q < 3; q++) { const x = X + q * 9; px(ink, x - 1, G - 27, 9, 27); px('#8a8a82', x, G - 26, 7, 26); px('#a8a8a0', x, G - 26, 1, 26);
      px(['#e84a8a', '#2ad8e8', '#e8c84a'][q], x + 1, G - 22, 5, 3); px(['#2a8a3a', '#e84a2a', '#5a2ae8'][q], x + 1, G - 16, 5, 6); px('#1a1a2a', x + 2, G - 10, 3, 1); px(['#e8c84a', '#e84a8a', '#2ad8e8'][q], x + 1, G - 8, 5, 2); } };
  PR.tiglio = (c) => tree(c, c.X, { th: 18, cw: 24, ch: 15, leaf: '#4a7a3a', trunk: '#6a5a48' });

  // ---------------------------------------------------------------- Praga / Vienna
  PR.lampagot = (c) => { const { px, X, ink } = c;     // lampione gotico con la lanterna a punta
    pole(c, X, 30, '#2a2e2a'); px(ink, X - 3, G - 37, 8, 8); px('#2a2e2a', X - 2, G - 36, 6, 6); px('#ffd98a', X - 1, G - 35, 4, 4); for (let j = 0; j < 4; j++) px(ink, X - 1 + j * 0.5, G - 41 + j, 4 - j, 1);
    lampGlow(c, X + 1, G - 33, 30, '255,190,100', 0.65); };
  PR.statua = (c) => { const { px, X, ink } = c;      // statua su un piedistallo
    px(ink, X - 2, G - 12, 14, 12); px('#6a6a62', X - 1, G - 11, 12, 11); px('#8a8a82', X - 1, G - 11, 12, 1); px(ink, X + 2, G - 28, 6, 17); px('#3a3a42', X + 3, G - 27, 4, 16); px('#3a3a42', X + 6, G - 30, 2, 8); px('#3a3a42', X + 3, G - 31, 4, 4); };
  PR.birreria = (c) => { const { px, X, ink, S: s, g } = c;
    for (let q = 0; q < 2; q++) { const x = X + q * 14; px(ink, x - 1, G - 8, 12, 8); px('#6a4a2a', x, G - 8, 10, 2); px('#8a6a3a', x, G - 8, 10, 1); px('#5a3a1a', x + 1, G - 6, 2, 6); px('#5a3a1a', x + 7, G - 6, 2, 6); px('#e8c84a', x + 2, G - 12, 3, 4); px('#f4f1e6', x + 2, G - 12, 3, 1); px('#e8c84a', x + 6, G - 12, 3, 4); }
    s.text(g, 'PIVO', X + 5, G - 18, '#e8c84a', 1); lampGlow(c, X + 12, G - 10, 22, '255,200,110', 0.4); };
  PR.wurst = (c) => { const { px, X, ink, S: s, g } = c;  // il chiosco delle salsicce
    px(ink, X - 1, G - 26, 22, 26); px('#c4241c', X, G - 25, 20, 4); for (let k = 0; k < 20; k += 4) px('#f4f1e6', X + k, G - 25, 2, 4); px('#e8dec4', X, G - 21, 20, 18); px('#2a2a30', X + 2, G - 17, 16, 10); px('#ffe9b8', X + 3, G - 16, 14, 7);
    for (let k = 0; k < 4; k++) px('#a0422a', X + 4 + k * 3, G - 15, 2, 4); s.text(g, 'WURST', X + 3, G - 23, '#1a1a2a', 1); lampGlow(c, X + 10, G - 12, 26, '255,200,120', 0.55); };
  PR.kastanie = (c) => tree(c, c.X, { th: 16, cw: 24, ch: 16, leaf: '#5a7a2a', trunk: '#4a3a2a' });

  // ---------------------------------------------------------------- Madrid
  PR.metroM = (c) => { const { px, X, ink, S: s, g } = c;  // losanga blu del metro
    pole(c, X, 24, '#2a2e38'); px(ink, X - 6, G - 36, 14, 14); for (let j = 0; j < 6; j++) { px('#1a4aa8', X - j + 1, G - 30 + j, j * 2 + 1, 1); px('#1a4aa8', X - j + 1, G - 30 - j, j * 2 + 1, 1); }
    s.text(g, 'M', X - 1, G - 32, '#f4f1e6', 1); lampGlow(c, X + 1, G - 30, 18, '120,170,255', 0.4); };
  PR.madrono = (c) => { const { px, X } = c;       // l'albero del corbezzolo con i frutti rossi (l'orso e il madroño)
    tree(c, X, { th: 14, cw: 20, ch: 14, leaf: '#2f6a3a', trunk: '#5a3a2a' }); for (let k = 0; k < 6; k++) px('#d82a2a', X + 4 + (k * 7) % 14, G - 26 + (k * 5) % 9, 2, 2);
    px(c.ink, X + 20, G - 10, 11, 10); px('#8a8a82', X + 21, G - 9, 9, 9); px('#6a6a62', X + 22, G - 14, 5, 5); px('#8a8a82', X + 26, G - 13, 3, 3); };
  PR.terraza = (c) => { const { px, X, ink } = c;     // terrazza con ombrellone rosso
    for (let q = 0; q < 2; q++) { const x = X + q * 13; px(ink, x - 1, G - 8, 9, 8); px('#e8e0cc', x, G - 8, 7, 1); px(ink, x + 3, G - 7, 1, 7); px('#2a2a30', x - 2, G - 7, 3, 7); px('#2a2a30', x + 7, G - 7, 3, 7); }
    px(ink, X + 4, G - 26, 20, 3); px('#c4241c', X + 5, G - 25, 18, 2); px('#f4f1e6', X + 10, G - 25, 4, 2); px(ink, X + 14, G - 24, 1, 16); lampGlow(c, X + 14, G - 12, 24, '255,200,120', 0.4); };
  PR.fernandina = (c) => { const { px, X, ink } = c;   // lampione a più bracci
    pole(c, X, 26, '#1f2a2a'); px(ink, X - 6, G - 28, 14, 2); px('#1f2a2a', X - 5, G - 28, 12, 1); for (const dx of [-5, 1, 6]) { px(ink, X + dx - 1, G - 33, 3, 5); px('#ffe9b8', X + dx, G - 32, 1, 3); }
    lampGlow(c, X + 1, G - 30, 30, '255,225,150', 0.6); };

  // ---------------------------------------------------------------- Lisbona
  PR.palma = (c) => { const { px, X, ink } = c;
    px(ink, X + 5, G - 26, 4, 26); px('#6a5a42', X + 6, G - 26, 2, 26); for (let k = 0; k < 26; k += 3) px('#4a3a2a', X + 6, G - 26 + k, 2, 1);
    for (let q = 0; q < 7; q++) { const a = -2.9 + q * 0.5; for (let j = 0; j < 9; j++) px(q % 2 ? '#2f6a3a' : '#3f8a4a', X + 7 + Math.cos(a) * j * 1.3, G - 27 + Math.sin(a) * j * 0.7 + j * j * 0.05, 2, 1); } };
  PR.arraial = (c) => { const { px, X, ink, t } = c;   // lampadine colorate della festa di strada
    pole(c, X, 34, '#2a2e38'); pole(c, X + 46, 34, '#2a2e38');
    for (let k = 0; k < 46; k += 3) { const y = G - 34 + Math.round(Math.sin(k / 46 * 3.14) * 5), col = ['#ff5a3a', '#ffd23f', '#3ad8a0', '#5a8aff', '#ff6ab8'][(k / 3 + Math.floor(t * 2)) % 5 | 0]; px(ink, X + k, y, 3, 1); px(col, X + k, y + 1, 2, 2); }
    lampGlow(c, X + 23, G - 28, 40, '255,210,140', 0.4); };
  PR.jacaranda = (c) => tree(c, c.X, { th: 16, cw: 24, ch: 15, leaf: '#8a6ac8', trunk: '#4a3a2a' });
  PR.azulejoPannello = (c) => { const { px, X, ink } = c;   // pannello di azulejos azzurri e bianchi
    px(ink, X - 1, G - 20, 14, 20); px('#e8e4d4', X, G - 19, 12, 18); for (let a = 0; a < 6; a++) for (let b = 0; b < 6; b++) if ((a + b) % 2 === 0) px('#2a5aa8', X + a * 2, G - 19 + b * 3, 2, 3);
    px('#2a5aa8', X, G - 19, 12, 1); px('#2a5aa8', X, G - 2, 12, 1); };
  PR.pasteis = (c) => { const { px, X, ink, S: s, g } = c;
    px(ink, X - 1, G - 28, 24, 28); px('#f4e8c8', X, G - 27, 22, 27); px('#c4241c', X, G - 27, 22, 4); px('#1a1a2a', X + 2, G - 19, 18, 17); px('#ffe9b8', X + 3, G - 18, 16, 7);
    for (let k = 0; k < 5; k++) { px('#c88a3a', X + 4 + k * 3, G - 14, 2, 2); } s.text(g, 'PASTEIS', X + 2, G - 24, '#f4f1e6', 1); lampGlow(c, X + 11, G - 10, 26, '255,210,130', 0.55); };

  // ---------------------------------------------------------------- Atene
  PR.olivo = (c) => { const { px, X, ink } = c;       // ulivo: tronco contorto e chioma argentata
    px(ink, X + 5, G - 14, 6, 14); px('#6a5a48', X + 6, G - 14, 3, 14); px('#4a3a2a', X + 8, G - 12, 1, 8); px('#6a5a48', X + 3, G - 16, 3, 5); px('#6a5a48', X + 10, G - 17, 3, 5);
    for (let q = 0; q < 24; q++) { const x = X - 2 + (q * 5) % 22, y = G - 28 + ((q * 3) % 9) + Math.abs(x - X - 8) * 0.12; px(q % 3 ? '#7a9a7a' : '#a8c4a0', x, y, 5, 3); } };
  PR.periptero = (c) => { const { px, X, ink, S: s, g } = c;    // il chiosco greco azzurro e bianco
    px(ink, X - 1, G - 26, 18, 26); px('#2a5aa8', X, G - 25, 16, 25); px('#e8f0f8', X, G - 25, 16, 3); for (let k = 0; k < 16; k += 4) px('#2a5aa8', X + k, G - 25, 2, 3);
    for (let k = 0; k < 5; k++) px(['#c4241c', '#e8c84a', '#2ad8e8', '#f4f1e6', '#d87aa8'][k], X + 2 + k * 2.6, G - 18, 2, 7); px('#1a2a4a', X + 2, G - 9, 12, 8); px('#ffe9b8', X + 3, G - 8, 10, 5);
    s.text(g, 'KIOSK', X + 2, G - 22, '#f4f1e6', 1); lampGlow(c, X + 8, G - 10, 22, '255,230,170', 0.45); };
  PR.bandieraGR = (c) => { const { px, X, ink } = c; pole(c, X, 40, '#8a8f9e'); flag(c, X + 1, G - 40, 16, 11, (x, y) => { px(ink, x - 1, y - 1, 18, 13); for (let k = 0; k < 9; k++) px(k % 2 ? '#f4f1e6' : '#1a5aa8', x, y + k * 1.2, 16, 1.2); px('#1a5aa8', x, y, 6, 6); px('#f4f1e6', x + 2, y, 2, 6); px('#f4f1e6', x, y + 2, 6, 2); }); };
  PR.colonnaGR = (c) => { const { px, X, ink } = c;  // rocchi di colonna dorica
    for (let q = 0; q < 2; q++) { const x = X + q * 12, h = 12 - q * 5; px(ink, x - 1, G - h - 1, 9, h + 1); px('#d8ceb4', x, G - h, 7, h); px('#ece2c8', x, G - h, 2, h); for (let k = 2; k < 7; k += 2) px('#a89c80', x + k, G - h, 1, h); px('#c8bea4', x - 1, G - h - 2, 9, 2); } };
  PR.gatto = (c) => { const { px, X, ink } = c; px(ink, X - 1, G - 11, 9, 11); px('#d8a050', X, G - 10, 7, 10); px('#d8a050', X + 1, G - 13, 3, 3); px('#d8a050', X + 1, G - 14, 1, 1); px('#d8a050', X + 3, G - 14, 1, 1); px('#8a5a24', X + 5, G - 7, 2, 1); px('#ffe9b8', X + 1, G - 12, 1, 1); px('#d8a050', X + 7, G - 3, 4, 2); };
  PR.arancio = (c) => { const { px, X } = c; tree(c, X, { th: 14, cw: 20, ch: 14, leaf: '#2f6a3a', trunk: '#4a3a2a' }); for (let k = 0; k < 6; k++) px('#ff9a1a', X + 3 + (k * 7) % 14, G - 25 + (k * 5) % 9, 2, 2); };
  PR.pergola = (c) => { const { px, X, ink, S: s, g } = c;  // pergola della taverna con le lanterne
    for (const dx of [0, 30]) px(ink, X + dx, G - 26, 2, 26); px(ink, X - 1, G - 27, 34, 2); for (let k = 0; k < 32; k += 3) px('#2f6a3a', X + k, G - 27 + (k % 2), 3, 2);
    for (let k = 0; k < 3; k++) { const x = X + 5 + k * 10; px(ink, x, G - 25, 1, 3); px('#ffd98a', x - 1, G - 22, 3, 3); lampGlow(c, x, G - 21, 14, '255,210,130', 0.4); }
    s.text(g, 'TAVERNA', X + 4, G - 17, '#e8f0f8', 1); px(ink, X + 3, G - 9, 12, 2); px('#e8f0f8', X + 4, G - 9, 10, 1); px('#2a5aa8', X + 4, G - 8, 10, 1); };

  // ---------------------------------------------------------------- Washington
  PR.bandieraUS = (c) => { const { px, X, ink } = c; pole(c, X, 44, '#8a8f9e'); flag(c, X + 1, G - 44, 18, 11, (x, y) => { px(ink, x - 1, y - 1, 20, 13); for (let k = 0; k < 7; k++) px(k % 2 ? '#f4f1e6' : '#c4241c', x, y + k * 1.6, 18, 1.6); px('#1a2a8a', x, y, 8, 6); px('#f4f1e6', x + 2, y + 2, 1, 1); px('#f4f1e6', x + 5, y + 3, 1, 1); }); };
  PR.cassetta = (c) => { const { px, X, ink } = c; px(ink, X - 1, G - 14, 12, 14); px('#1a3a8a', X, G - 13, 10, 13); px('#2a5ac8', X, G - 13, 10, 3); px('#14141c', X + 2, G - 9, 6, 1); px('#f4f1e6', X + 2, G - 6, 6, 1); px(ink, X, G - 1, 2, 1); px(ink, X + 8, G - 1, 2, 1); };
  PR.idrante = (c) => { const { px, X, ink } = c; px(ink, X - 1, G - 14, 8, 14); px('#e8b020', X, G - 13, 6, 13); px('#ffd23f', X, G - 13, 1, 13); px('#a87810', X + 5, G - 13, 1, 13); px('#e8b020', X - 2, G - 9, 10, 3); px('#c89010', X + 1, G - 15, 4, 2); };
  PR.metroDC = (c) => { const { px, X, ink, S: s, g } = c;   // pilone del metro di Washington
    px(ink, X - 1, G - 34, 9, 34); px('#5a3a22', X, G - 33, 7, 33); px('#7a5232', X, G - 33, 1, 33); px('#e8e4d4', X + 1, G - 31, 5, 5); s.text(g, 'M', X + 2, G - 30, '#5a3a22', 1);
    px('#14141c', X + 1, G - 24, 5, 3); px(ink, X - 2, G - 2, 11, 2); };
  PR.ciliegio = (c) => { const { px, X } = c; tree(c, X, { th: 14, cw: 26, ch: 17, leaf: '#e89ac0', trunk: '#4a3a2a' }); for (let k = 0; k < 8; k++) px('#fff0f8', X + 3 + (k * 7) % 22, G - 28 + (k * 5) % 12, 2, 2); };
  PR.hotdog = (c) => { const { px, X, ink, S: s, g } = c;
    px(ink, X - 2, G - 32, 22, 3); for (let k = 0; k < 20; k += 4) { px('#c4241c', X - 1 + k, G - 31, 2, 2); px('#f4f1e6', X + 1 + k, G - 31, 2, 2); } px(ink, X + 9, G - 29, 1, 14);
    px(ink, X, G - 16, 18, 16); px('#8a8f9e', X + 1, G - 15, 16, 12); px('#e8f0f0', X + 1, G - 15, 16, 2); px('#1a1a2a', X + 2, G - 12, 14, 4); s.text(g, 'HOT DOG', X + 2, G - 12, '#ffd23f', 1); px(ink, X + 2, G - 3, 3, 3); px(ink, X + 13, G - 3, 3, 3);
    lampGlow(c, X + 9, G - 10, 22, '255,220,140', 0.45); };
  PR.segnaleUS = (c) => { const { px, X, ink, S: s, g, t } = c; pole(c, X, 24, '#2a2e38'); px(ink, X - 5, G - 33, 12, 10); px('#e8e4d4', X - 4, G - 32, 10, 8); const w = Math.floor(t / 3) % 2 === 0; s.text(g, w ? 'WALK' : 'WAIT', X - 3, G - 30, w ? '#1a5ad8' : '#c4241c', 1); };

  // ---------------------------------------------------------------- aggancio a districtPeople
  const basePeople = S.districtPeople;
  S.districtPeople = function (g, wx, from, to, t) {
    if (this._city && this.districtAt) this.cityProps(g, wx, from, to, t);
    return basePeople.call(this, g, wx, from, to, t);
  };
  S.cityProps = function (g, wx, from, to, t) {
    const SS = this.SS || 1, R = (v) => Math.round(v * SS) / SS, ink = this.C.ink, night = 1 - (this.day || 0), STEP = 5;
    const px = (col, x, y, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(R(x), R(y), w, h); };
    for (let j = Math.floor((from - 50) / STEP); j * STEP < to + 50; j++) {
      const m0 = j * STEP, D = this.districtAt(m0 + STEP / 2), r = (o) => rnd(j * 17.31 + o * 5.7);
      if (!D.props || r(1) > (D.propP || 0.5)) continue;
      const kind = D.props[Math.floor(r(2) * D.props.length)], f = PR[kind]; if (!f) continue;
      const X = Math.round(wx(m0 + 0.6 + r(3) * (STEP - 2.2))); if (X < -50 || X > this.LW + 50) continue;
      f({ g, px, X, ink, night, t, r, S: this });
    }
  };

  // ---------------------------------------------------------------- asfalto delle città
  // y delle corsie: bordo alto 238, tratteggi 262 e 300, bordo basso 335. wx(m) → x.
  RD.londra = (c) => {
    const { g, px, x0, m, k, r, ppm } = c;
    if (r(21) < 0.5) { c.S.text(g, 'LOOK RIGHT', Math.round(x0 + r(22) * 60), 322 + Math.floor(r(23) * 3), 'rgba(236,236,226,.75)', 2); }
    px('#e8c84a', x0, 239, ppm * 9, 1); px('#e8c84a', x0, 241, ppm * 9, 1);                                // doppia riga gialla del bordo
  };
  RD.roma = (c) => {
    const { g, px, x0, r, ppm } = c;                                                                       // sampietrini: tasselli scuri a macchie
    if (r(31) < 0.55) { const x = x0 + r(32) * ppm * 6, y = 246 + Math.floor(r(33) * 70), w = 26 + Math.floor(r(34) * 30), h = 10 + Math.floor(r(35) * 12);
      for (const [col, on] of [['#242636', true], ['#2e3044', false]]) {   // due colori, due figure (v0.136: erano ~280 fillRect a fotogramma)
        g.fillStyle = col; g.beginPath();
        for (let a = 0; a < w; a += 4) for (let b = 0; b < h; b += 3) if (((a + b) % 3 !== 0) === on) g.rect(Math.round(x + a + (b % 2) * 2), Math.round(y + b), 3, 2);
        g.fill();
      } }
  };
  RD.washington = (c) => { const { px, x0, ppm } = c; px('#e8b020', x0, 239, ppm * 9, 1); };
  RD.parigi = (c) => { const { px, x0, ppm, r } = c; if (r(41) < 0.3) for (let q = 0; q < 6; q++) px('rgba(196,200,214,.35)', x0 + r(42 + q) * ppm * 9, 244 + Math.floor(r(50 + q) * 70), 2, 1); };
  RD.lisbona = (c) => { const { px, x0, r, ppm } = c; if (r(61) < 0.4) { const x = x0 + r(62) * ppm * 6, y = 248 + Math.floor(r(63) * 60); for (let a = 0; a < 28; a += 4) { px('#3a3c52', x + a, y + (a % 8 ? 1 : 0), 3, 2); px('#6a6c84', x + a + 2, y + 3, 2, 1); } } };
  const baseRoad = S.districtRoad;
  S.districtRoad = function (g, wx, from, to, TUN) {
    baseRoad.call(this, g, wx, from, to, TUN);
    const f = this._city && RD[this._city]; if (!f || !this.districtAt) return;
    const ppm = wx(1) - wx(0), STEP = 9, px = (col, x, y, w = 1, h = 1) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), h); };
    for (let m = Math.floor(from / STEP) * STEP - STEP; m < to; m += STEP) {
      if (TUN && m > TUN.a - 40 && m < TUN.b + 20) continue;
      const k = Math.round(m / STEP); f({ g, px, x0: wx(m), m, k, ppm, S: this, r: (o) => rnd(k * 7.13 + o * 3.71) });
    }
  };
})();
