// ============================================================================
//  Night Run · Le facciate dei locali del Viaggio (dopo viaggio2d.js)
//  Bar, benzinaio, autogrill Sosta 24, Motel Ovunque, Officina Niko, Da Luca Tuning, Neon Kustom: edifici a due piani o
//  capannoni con materiali veri (intonaco, mattoni, lamiera, pannelli), vetrine con l'interno acceso e chi c'è dentro,
//  insegne al neon che ogni tanto sfarfallano, tende, lampade a muro, piante, tavolini, pompe, e la luce che cade sul
//  marciapiede. Di giorno le vetrine riflettono il cielo e i neon sono quasi spenti.
//  Si aggancia a Street2D.prototype.drawTripPlace prima degli altri (concessionario, usato, sfascio lo avvolgono dopo):
//  qui si disegnano bar, fuel, grill, motel, niko, shop e style; il resto passa al disegno di prima.
//  Regole: base a y 216, niente oltre x − 155 a sinistra (lì l'usato mette l'auto col cartello VENDESI), insegne sotto
//  y 50 (sopra c'è lo specchietto), testi a pixel in maiuscolo, caso con Street2D.rnd.
// ============================================================================
(function () {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, prev = S.drawTripPlace, rnd = Street2D.rnd, GY = 216;
  const MINE = { bar: 1, fuel: 1, grill: 1, motel: 1, niko: 1, shop: 1, style: 1 };

  // ---------------------------------------------------------------- colori
  const hx = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const mix = (a, b, k) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  // neon che ogni tanto si spegne per un attimo (sempre uguale per lo stesso locale)
  const flick = (t, s, p = 0.035) => rnd(Math.floor(t * 9) * 7.31 + s * 13.7) > p;

  // ---------------------------------------------------------------- attrezzi comuni (this = Street2D)
  S.lcBox = function (g, x, y, w, h, col) { g.fillStyle = this.C.ink; g.fillRect(x - 1, y - 1, w + 2, h + 2); g.fillStyle = col; g.fillRect(x, y, w, h); };

  // muro: intonaco (macchie e sporco in basso), mattoni (uno per uno, toni diversi), lamiera grecata, pannelli
  // il muro non cambia: si disegna una volta in una tela a parte (alla densità della scena) e poi si incolla
  const WALLS = new Map();
  S.lcWall = function (g, L, T, W, H, base, kind, seed) {
    const SS = this.SS || 1, key = [W, H, base, kind, seed, SS].join('|');
    let c = WALLS.get(key);
    if (!c) {
      if (WALLS.size > 40) WALLS.clear();
      c = document.createElement('canvas'); c.width = W * SS; c.height = H * SS;
      const x = c.getContext('2d'); x.scale(SS, SS); this.lcWallPaint(x, 0, 0, W, H, base, kind, seed); WALLS.set(key, c);
    }
    g.drawImage(c, L, T, W, H);
  };
  S.lcWallPaint = function (g, L, T, W, H, base, kind, seed) {
    g.fillStyle = base; g.fillRect(L, T, W, H);
    const dk = mix(base, '#000000', 0.22), lt = mix(base, '#ffffff', 0.07);
    if (kind === 'mattoni') {
      for (let y = T, r = 0; y < T + H; y += 4, r++) {
        g.fillStyle = dk; g.fillRect(L, y, W, 1);
        for (let x = L - (r % 2) * 4, c = 0; x < L + W; x += 8, c++) {
          const v = rnd(seed + r * 31 + c * 7.3);
          if (v > 0.7) { g.fillStyle = v > 0.9 ? lt : mix(base, '#000000', 0.1); g.fillRect(Math.max(L, x + 1), y + 1, Math.min(7, L + W - x - 1), 3); }
          g.fillStyle = dk; if (x > L) g.fillRect(x, y + 1, 1, 3);
        }
      }
    } else if (kind === 'lamiera') {
      for (let x = L; x < L + W; x += 4) { g.fillStyle = lt; g.fillRect(x, T, 1, H); g.fillStyle = dk; g.fillRect(x + 2, T, 1, H); }
      for (let q = 0; q < W / 30; q++) { const x = L + Math.floor(rnd(seed + q * 3.1) * W); g.fillStyle = 'rgba(120,70,40,.18)'; g.fillRect(x, T + Math.floor(rnd(seed + q) * H * 0.5), 2, Math.floor(H * 0.4)); }   // ruggine che cola
    } else if (kind === 'pannelli') {
      for (let x = L; x < L + W; x += 24) { g.fillStyle = dk; g.fillRect(x, T, 1, H); g.fillStyle = lt; g.fillRect(x + 1, T, 1, H); }
      for (let y = T + 30; y < T + H; y += 30) { g.fillStyle = dk; g.fillRect(L, y, W, 1); }
    } else {
      for (let q = 0; q < W * H / 60; q++) { const s = seed + q * 1.7; g.fillStyle = rnd(s) > 0.5 ? dk : lt; g.fillRect(L + Math.floor(rnd(s + 1) * W), T + Math.floor(rnd(s + 2) * H), 1 + Math.floor(rnd(s + 3) * 2), 1); }
    }
    // sporco che sale da terra e ombra sotto il tetto
    const gr = g.createLinearGradient(0, T + H - 18, 0, T + H); gr.addColorStop(0, 'rgba(10,8,16,0)'); gr.addColorStop(1, 'rgba(10,8,16,.35)');
    g.fillStyle = gr; g.fillRect(L, T + H - 18, W, 18);
    g.fillStyle = 'rgba(8,6,14,.3)'; g.fillRect(L, T, W, 3);
  };

  // cornicione: bordo scuro, cappello chiaro, ombra sotto
  S.lcCornice = function (g, L, T, W, col) {
    g.fillStyle = this.C.ink; g.fillRect(L - 4, T - 5, W + 8, 6);
    g.fillStyle = col; g.fillRect(L - 3, T - 4, W + 6, 4); g.fillStyle = mix(col, '#ffffff', 0.25); g.fillRect(L - 3, T - 4, W + 6, 1);
    g.fillStyle = 'rgba(6,4,12,.4)'; g.fillRect(L, T + 1, W, 2);
  };

  // vetrina: telaio, vetro (caldo di notte, cielo di giorno), dentro chi c'è (callback), riflessi, luce sul marciapiede
  S.lcGlass = function (g, x, y, w, h, o) {
    o = o || {};
    const C = this.C, n = 1 - (this.day || 0), warm = o.col || '#ffcf7a', frame = o.frame || '#2a2a32';
    g.fillStyle = C.ink; g.fillRect(x - 2, y - 2, w + 4, h + 4); g.fillStyle = frame; g.fillRect(x - 1, y - 1, w + 2, h + 2);
    const inT = mix('#5a6a82', warm, n), inB = mix('#3a4456', mix(warm, '#000000', 0.45), n);
    const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, inT); gr.addColorStop(1, inB);
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    if (o.inside) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); o.inside(g, x, y, w, h, n); g.restore(); }
    // riflessi in diagonale e un velo di cielo in alto
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    g.fillStyle = `rgba(200,220,255,${0.05 + 0.1 * (1 - n)})`;
    for (let q = 0; q < 2; q++) { const sx = x + w * (0.25 + q * 0.45); g.beginPath(); g.moveTo(sx, y); g.lineTo(sx + 6 + q * 3, y); g.lineTo(sx - h * 0.5 + 6, y + h); g.lineTo(sx - h * 0.5, y + h); g.closePath(); g.fill(); }
    g.fillStyle = `rgba(160,180,230,${0.08 + 0.12 * (1 - n)})`; g.fillRect(x, y, w, 2);
    g.restore();
    if (o.mull) for (let q = 1; q < o.mull; q++) { const mx = Math.round(x + q * w / o.mull); g.fillStyle = C.ink; g.fillRect(mx - 1, y, 2, h); g.fillStyle = frame; g.fillRect(mx, y, 1, h); }
    if (o.kick) { g.fillStyle = frame; g.fillRect(x, y + h - o.kick, w, o.kick); g.fillStyle = mix(frame, '#ffffff', 0.15); g.fillRect(x, y + h - o.kick, w, 1); }
    if (n > 0.1) {
      this.light(g, x + w / 2, y + h / 2, w * 0.6, h * 0.6, warm, 0.035 * n, 2);
      if (!o.noSpill) this.light(g, x + w / 2, GY + 6, w * 0.75, 7, warm, 0.07 * n, 3);   // luce che cade sul marciapiede
    }
  };

  // finestra di casa con le persiane (aperte, chiuse o una sola), davanzale, e a volte i vasi di fiori
  S.lcWindow = function (g, x, y, w, h, o) {
    const C = this.C, n = 1 - (this.day || 0), lit = o.lit && n > 0.15;
    g.fillStyle = C.ink; g.fillRect(x - 1, y - 1, w + 2, h + 2);
    g.fillStyle = lit ? mix('#4a5468', '#ffcf7a', n) : mix('#1a1a26', '#4a5a72', 1 - n); g.fillRect(x, y, w, h);
    if (lit) { g.fillStyle = mix('#c8a060', '#ffe6a8', n); g.fillRect(x, y, 3, h); g.fillRect(x + w - 3, y, 3, h); g.fillStyle = 'rgba(80,40,20,.35)'; g.fillRect(x, y, w, 2);   // tende
      if (o.who) { g.fillStyle = 'rgba(40,24,20,.7)'; g.fillRect(x + w / 2 - 2, y + h - 9, 5, 9); g.fillRect(x + w / 2 - 1, y + h - 12, 3, 3); }
      this.light(g, x + w / 2, y + h / 2, w, h, '#ffcf7a', 0.05 * n, 2); }
    g.fillStyle = C.ink; g.fillRect(x + Math.floor(w / 2), y, 1, h); g.fillRect(x, y + Math.floor(h / 2), w, 1);   // croce degli infissi
    const sh = o.shut || '#2f5a3a', sw = Math.ceil(w / 2) + 1;
    const leaf = (lx, closed) => { g.fillStyle = C.ink; g.fillRect(lx - 1, y - 1, sw + 1, h + 2); g.fillStyle = sh; g.fillRect(lx, y, sw - 1, h);
      for (let yy = y + 2; yy < y + h; yy += 2) { g.fillStyle = mix(sh, '#000000', 0.3); g.fillRect(lx, yy, sw - 1, 1); } if (closed) { g.fillStyle = mix(sh, '#ffffff', 0.2); g.fillRect(lx, y, 1, h); } };
    if (o.closed) { leaf(x, true); leaf(x + w - sw + 1, true); }
    else { leaf(x - sw - 1, false); leaf(x + w + 2, false); }
    g.fillStyle = C.ink; g.fillRect(x - 3, y + h + 1, w + 6, 3); g.fillStyle = '#8a8478'; g.fillRect(x - 2, y + h + 1, w + 4, 2);   // davanzale
    if (o.flowers) {
      g.fillStyle = '#5a3020'; g.fillRect(x - 1, y + h - 3, w + 2, 4);
      for (let q = 0; q < w; q += 2) { g.fillStyle = rnd(x + q) > 0.5 ? '#3a7a3a' : '#2a5a2a'; g.fillRect(x + q, y + h - 6 - Math.floor(rnd(q + y) * 3), 2, 4);
        if (rnd(q * 3 + x) > 0.55) { g.fillStyle = ['#e83a4a', '#ff8ac0', '#ffd23f'][Math.floor(rnd(q + 9) * 3)]; g.fillRect(x + q, y + h - 7 - Math.floor(rnd(q + y) * 3), 2, 2); } }
    }
  };

  // tenda da sole a strisce con la balza smerlata e l'ombra sul muro
  S.lcAwning = function (g, x, y, w, c1, c2, d = 10) {
    const C = this.C;
    g.fillStyle = 'rgba(6,4,12,.45)'; g.fillRect(x + 2, y + d + 3, w - 4, 5);
    for (let r = 0; r < d; r++) {
      const off = Math.round((d - r) * 0.4);
      for (let k = 0; k * 8 < w + off; k++) { g.fillStyle = k % 2 ? c2 : c1; g.fillRect(x - off + k * 8, y + r, Math.min(8, x + w + off - (x - off + k * 8)), 1); }
    }
    g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x, y, w, 1);
    g.fillStyle = C.ink; g.fillRect(x - 1, y + d, w + 2, 1);
    for (let k = 0; k * 8 < w; k++) { const px = x + k * 8; g.fillStyle = k % 2 ? c2 : c1; g.fillRect(px, y + d + 1, 8, 2); g.fillRect(px + 1, y + d + 3, 6, 1); g.fillStyle = C.ink; g.fillRect(px + 2, y + d + 4, 4, 1); }
  };

  // scritta al neon: tubo spento sotto, colore acceso sopra, alone; sfarfalla
  S.lcNeon = function (g, str, x, y, col, sc, t, seed, w0) {
    const n = 1 - (this.day || 0), on = flick(t, seed) && n > 0.05, w = w0 || this.textW(str, sc);
    this.text(g, str, x + 1, y + 1, 'rgba(0,0,0,.6)', sc);
    this.text(g, str, x, y, on ? mix(mix(col, '#3a3440', 0.55), col, n) : mix(col, '#1a1420', 0.75), sc);
    if (on) { this.text(g, str, x, y, mix(col, '#ffffff', 0.35 * n), Math.max(1, sc)); this.light(g, x + w / 2, y + 2.5 * sc, w * 0.62 + 6, 5 * sc + 4, col, 0.07 * n, 3); }
    return on;
  };

  // lampada a muro (applique) o a collo d'oca: braccio, paralume, cono di luce verso il basso
  S.lcLamp = function (g, x, y, col = '#ffd9a0', goose) {
    const C = this.C, n = 1 - (this.day || 0);
    g.fillStyle = C.ink; if (goose) { g.fillRect(x - 1, y - 6, 2, 6); g.fillRect(x - 1, y - 7, 6, 2); g.fillRect(x + 3, y - 6, 4, 3); }
    else { g.fillRect(x - 3, y, 6, 2); g.fillRect(x - 1, y - 3, 2, 3); }
    g.fillStyle = n > 0.2 ? mix('#c8b090', col, n) : '#8a8070'; g.fillRect(goose ? x + 4 : x - 2, goose ? y - 3 : y + 2, goose ? 2 : 4, 1);
    if (n > 0.2) {
      const lx = goose ? x + 5 : x, ly = goose ? y - 2 : y + 3, rgb = Street2D.rgb(col);
      g.save(); g.globalCompositeOperation = 'lighter';
      const gr = g.createLinearGradient(0, ly, 0, ly + 26); gr.addColorStop(0, `rgba(${rgb},${0.22 * n})`); gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr; g.beginPath(); g.moveTo(lx - 2, ly); g.lineTo(lx + 2, ly); g.lineTo(lx + 12, ly + 26); g.lineTo(lx - 12, ly + 26); g.closePath(); g.fill(); g.restore();
      this.light(g, lx, ly, 6, 4, col, 0.2 * n, 2);
    }
  };

  // vaso con una pianta (cespuglio o palmetta), deterministico
  S.lcPlant = function (g, x, s, tall) {
    const C = this.C;
    g.fillStyle = C.ink; g.fillRect(x - 6, GY - 9, 12, 9); g.fillStyle = '#6a4a3a'; g.fillRect(x - 5, GY - 8, 10, 8); g.fillStyle = '#8a6450'; g.fillRect(x - 5, GY - 8, 10, 1);
    const h = tall ? 26 : 13;
    for (let q = 0; q < (tall ? 40 : 22); q++) {
      const a = rnd(s + q), b = rnd(s + q * 2.3), px = x + Math.round((a - 0.5) * (tall ? 14 : 14) * (1 - b * 0.4)), py = GY - 9 - Math.round(b * h);
      g.fillStyle = rnd(s + q * 5) > 0.6 ? '#3e7a44' : rnd(s + q * 7) > 0.5 ? '#2a5a34' : '#1e4228'; g.fillRect(px, py, 2, 2);
    }
  };

  // piazzale davanti: asfalto più chiaro, cordolo, strisce
  S.lcYard = function (g, x, w) {
    g.fillStyle = '#262a3e'; g.fillRect(x - w / 2, GY, w, 16); g.fillStyle = '#4a5070'; g.fillRect(x - w / 2, GY, w, 1);
    for (let k = -w / 2 + 6; k < w / 2 - 6; k += 12) { g.fillStyle = '#30354e'; g.fillRect(x + k, GY + 8, 6, 1); }
  };

  // persona vista attraverso il vetro: sagoma scura con un po' di colore
  const sil = (g, x, y, col, t, s) => {
    const b = Math.round(Math.sin(t * 1.3 + s) * 0.6);
    g.fillStyle = 'rgba(20,14,18,.78)'; g.fillRect(x - 2, y - 13 + b, 5, 5); g.fillRect(x - 3, y - 8 + b, 7, 8);
    g.fillStyle = col; g.fillRect(x - 3, y - 7 + b, 7, 3);
  };

  // ---------------------------------------------------------------- il bar: casa a due piani, caffè sotto
  S.lcBar = function (g, e, X, st, near, open) {
    const C = this.C, t = st.t, n = 1 - (this.day || 0), s = Math.round(e.x) % 997, L = X - 104, W = 208, T = 92, mid = 156;
    this.lcYard(g, X, 120);
    // tavolini fuori con l'ombrellone (a destra, sul marciapiede davanti)
    for (const tx of [X + 124, X + 150]) {
      g.fillStyle = C.ink; g.fillRect(tx - 1, GY - 40, 2, 40);
      g.fillStyle = C.ink; g.fillRect(tx - 15, GY - 44, 30, 5); for (let k = 0; k < 7; k++) { g.fillStyle = k % 2 ? '#f4efe0' : '#c8282b'; g.fillRect(tx - 14 + k * 4, GY - 43, 4, 3); }
      g.fillStyle = '#c8282b'; g.fillRect(tx - 16, GY - 40, 2, 2); g.fillRect(tx + 14, GY - 40, 2, 2);
      g.fillStyle = C.ink; g.fillRect(tx - 7, GY - 14, 14, 2); g.fillRect(tx - 1, GY - 12, 2, 12); g.fillRect(tx - 4, GY - 1, 8, 1);
      g.fillStyle = '#8a8478'; g.fillRect(tx - 6, GY - 14, 12, 1);
      g.fillStyle = '#e8e2d0'; g.fillRect(tx - 3, GY - 16, 2, 2); g.fillStyle = '#5a2a1a'; g.fillRect(tx + 1, GY - 17, 2, 3);   // tazzina e bicchiere
      for (const cx of [tx - 11, tx + 9]) { g.fillStyle = C.ink; g.fillRect(cx, GY - 18, 2, 18); g.fillRect(cx, GY - 9, 5, 2); g.fillRect(cx + 4, GY - 9, 1, 9); }
    }
    // camino e antenna
    g.fillStyle = C.ink; g.fillRect(L + 24, T - 22, 12, 22); g.fillStyle = '#5a3a2c'; g.fillRect(L + 25, T - 21, 10, 21); g.fillStyle = '#3a2620'; g.fillRect(L + 23, T - 24, 14, 3);
    g.fillStyle = C.ink; g.fillRect(R(L + 150), T - 30, 1, 30); g.fillRect(L + 142, T - 26, 17, 1); g.fillRect(L + 145, T - 21, 11, 1);
    // tetto di coppi
    g.fillStyle = C.ink; g.fillRect(L - 6, T - 8, W + 12, 9);
    for (let k = 0; k < (W + 10) / 4; k++) { g.fillStyle = k % 2 ? '#8a3a28' : '#7a3222'; g.fillRect(L - 5 + k * 4, T - 7, 4, 7); g.fillStyle = '#a85a40'; g.fillRect(L - 5 + k * 4, T - 7, 2, 1); }
    // facciata: intonaco caldo sopra, zoccolo di pietra sotto
    this.lcWall(g, L, T, W, GY - T, '#6e5038', 'intonaco', s);
    g.fillStyle = '#4a4246'; g.fillRect(L, GY - 8, W, 8); g.fillStyle = '#5a5258'; g.fillRect(L, GY - 8, W, 1);
    for (let k = 0; k < W; k += 16) { g.fillStyle = '#3a3438'; g.fillRect(L + k, GY - 7, 1, 7); }
    g.fillStyle = C.ink; g.fillRect(L - 1, T, 1, GY - T); g.fillRect(L + W, T, 1, GY - T);
    // marcapiano
    g.fillStyle = C.ink; g.fillRect(L - 2, mid - 6, W + 4, 4); g.fillStyle = '#9a8a70'; g.fillRect(L - 1, mid - 5, W + 2, 2);
    // primo piano: tre finestre con le persiane, una accesa con qualcuno
    const lit = rnd(s + 4) > 0.3;
    this.lcWindow(g, L + 20, T + 14, 22, 28, { lit, who: true, flowers: true });
    this.lcWindow(g, X - 11, T + 14, 22, 28, { closed: true });
    this.lcWindow(g, L + W - 42, T + 14, 22, 28, { lit: !lit, flowers: true });
    // insegna dei tabacchi (blu con la T)
    g.fillStyle = C.ink; g.fillRect(L + W - 13, T + 20, 12, 14); g.fillStyle = '#163a8c'; g.fillRect(L + W - 12, T + 21, 10, 12); this.text(g, 'T', L + W - 9, T + 25, '#f4f1e6');
    if (n > 0.2) this.light(g, L + W - 7, T + 27, 10, 10, '#4a7aff', 0.05 * n, 2);
    // insegna col nome: tavola scura con le lettere illuminate da tre lampade a collo d'oca
    const name = e.name.toUpperCase(), nw = this.textW(name, 1), bw = Math.max(nw + 24, 110), bL = Math.round(X - bw / 2);
    this.lcBox(g, bL, mid, bw, 14, '#20160f'); g.fillStyle = '#3a2a1c'; g.fillRect(bL, mid, bw, 1);
    this.lcNeon(g, name, Math.round(X - nw / 2), mid + 5, '#ffd23f', 1, t, s);
    for (const q of [0.15, 0.5, 0.85]) this.lcLamp(g, Math.round(bL + bw * q) - 3, mid - 1, '#ffe2a8', true);
    // tenda a strisce sopra le vetrine
    this.lcAwning(g, L + 6, mid + 17, W - 12, '#c8282b', '#f4efe0', 9);
    // due vetrine: bancone, bottiglie, macchina del caffè, lampade a sospensione, gente al banco
    const inside = (g2, x0, y0, w, h, nn) => {
      for (let q = 0; q < w; q += 4) { g2.fillStyle = ['#3b7a3a', '#c8a040', '#8a2a2a', '#d8d0c0', '#3a5a9a'][Math.floor(rnd(q + x0) * 5)]; g2.fillRect(x0 + q + 1, y0 + 6 + (q % 8 ? 0 : 1), 2, 5); }
      g2.fillStyle = 'rgba(60,36,20,.85)'; g2.fillRect(x0, y0 + 11, w, 2);
      for (let q = 6; q < w; q += 14) { g2.fillStyle = mix('#5a4a3a', '#ffe6a8', nn); g2.fillRect(x0 + q, y0, 1, 2); g2.fillRect(x0 + q - 1, y0 + 2, 3, 2); }
      g2.fillStyle = 'rgba(50,30,18,.9)'; g2.fillRect(x0, y0 + h - 9, w, 9); g2.fillStyle = 'rgba(140,100,60,.9)'; g2.fillRect(x0, y0 + h - 9, w, 1);   // bancone
      g2.fillStyle = '#b8bcc4'; g2.fillRect(x0 + w - 14, y0 + h - 15, 10, 6); g2.fillStyle = '#5a5f68'; g2.fillRect(x0 + w - 13, y0 + h - 13, 8, 1);   // macchina del caffè
      sil(g2, x0 + 10 + Math.round(rnd(x0) * 8), y0 + h - 2, '#4a6a9a', t, x0);
      if (w > 50) sil(g2, x0 + 30 + Math.round(rnd(x0 + 1) * 8), y0 + h - 2, '#9a3a3a', t, x0 + 3);
    };
    this.lcGlass(g, L + 12, mid + 32, 62, GY - 10 - mid - 32, { inside, kick: 4, frame: '#3a2a20' });
    this.lcGlass(g, L + W - 74, mid + 32, 62, GY - 10 - mid - 32, { inside, kick: 4, frame: '#3a2a20' });
    // porta a vetri: si apre quando ti fermi
    const dW = 22, dT = mid + 30, dH = GY - 8 - dT, dL = X - dW / 2;
    g.fillStyle = C.ink; g.fillRect(dL - 2, dT - 2, dW + 4, dH + 2);
    g.fillStyle = mix('#3a3040', '#ffcf7a', n * (0.5 + 0.5 * open)); g.fillRect(dL, dT, dW, dH);
    const lw = Math.round((dW / 2 - 1) * (1 - open * 0.8));
    for (const [lx, a] of [[dL, 0], [dL + dW - lw, 1]]) { g.fillStyle = '#3a2a20'; g.fillRect(lx, dT, lw, dH); g.fillStyle = mix('#5a6a82', '#ffd9a0', n * 0.8); g.fillRect(lx + 2, dT + 2, Math.max(0, lw - 4), dH - 8); g.fillStyle = '#c8a040'; g.fillRect(a ? lx + 1 : lx + lw - 2, dT + dH / 2, 1, 4); }
    if (n > 0.1) this.light(g, X, GY + 4, 26 + 20 * open, 6, '#ffcf7a', (0.06 + 0.08 * open) * n, 3);
    // lampade ai lati della porta, lavagnetta, piante
    this.lcLamp(g, dL - 8, dT + 4); this.lcLamp(g, dL + dW + 8, dT + 4);
    g.fillStyle = C.ink; g.fillRect(X + 18, GY - 20, 16, 20); g.fillStyle = '#1e2a22'; g.fillRect(X + 19, GY - 19, 14, 13);
    this.text(g, '1,2', X + 20, GY - 17, '#e8e6df'); g.fillStyle = '#e8e6df'; g.fillRect(X + 21, GY - 10, 9, 1);
    g.fillStyle = '#6a4a30'; g.fillRect(X + 19, GY - 6, 1, 6); g.fillRect(X + 32, GY - 6, 1, 6);
    this.lcPlant(g, L + 8, s + 11, true); this.lcPlant(g, X - 24, s + 21);
    // insegna a bandiera BAR sull'angolo
    const bx = L + W - 2; g.fillStyle = C.ink; g.fillRect(bx, mid - 34, 10, 2); g.fillRect(bx + 4, mid - 32, 13, 34);
    g.fillStyle = '#1a1210'; g.fillRect(bx + 5, mid - 31, 11, 32);
    ['B', 'A', 'R'].forEach((ch, i) => this.lcNeon(g, ch, bx + 9, mid - 27 + i * 9, '#ff5f3a', 1, t, s + 40 + i, 3));
    this.placeTag(g, X, mid - 17, 'BAR', '#ffd23f', near);
  };
  const R = Math.round;

  // ---------------------------------------------------------------- il benzinaio: pensilina, due isole, totem dei prezzi, market
  S.lcFuel = function (g, e, X, st, near) {
    const C = this.C, t = st.t, n = 1 - (this.day || 0), s = Math.round(e.x) % 991;
    const cL = X - 120, cW = 230, cT = 120, cH = 16, ink = C.ink;
    this.lcYard(g, X - 4, 250);
    // luce forte sotto la pensilina sul piazzale (prima di tutto, così la pensilina ci sta sopra)
    if (n > 0.1) { this.light(g, X - 5, GY - 6, 120, 30, '#e8f0ff', 0.05 * n, 3); this.light(g, X - 5, GY + 8, 140, 10, '#e8f0ff', 0.08 * n, 3); }
    // market a destra: muro a pannelli, vetrata accesa, insegna
    const mL = X + 118, mW = 80, mT = 150;
    this.lcWall(g, mL, mT, mW, GY - mT, '#3a4256', 'pannelli', s);
    this.lcCornice(g, mL, mT, mW, '#d8dce6');
    g.fillStyle = '#2ee6ff'; g.fillRect(mL, mT + 1, mW, 2); if (n > 0.2) this.light(g, mL + mW / 2, mT + 2, mW * 0.6, 4, '#2ee6ff', 0.07 * n, 2);
    this.lcNeon(g, 'MARKET', mL + Math.round((mW - this.textW('MARKET', 1)) / 2), mT + 7, '#ffd23f', 1, t, s + 5);
    this.lcGlass(g, mL + 6, mT + 18, 44, GY - mT - 24, { col: '#eef6ff', mull: 2, kick: 4, inside: (g2, x0, y0, w, h) => {
      for (let r = 0; r < 3; r++) for (let q = 0; q < w; q += 3) { g2.fillStyle = ['#ff7a3a', '#2ee6ff', '#ffd23f', '#b8ff3a', '#ff5fa8', '#e8e6df'][Math.floor(rnd(q * 3 + r + x0) * 6)]; g2.fillRect(x0 + q, y0 + 8 + r * 8, 2, 4); }
      for (let r = 0; r < 3; r++) { g2.fillStyle = 'rgba(80,90,110,.8)'; g2.fillRect(x0, y0 + 12 + r * 8, w, 1); }
      sil(g2, x0 + w - 10, y0 + h - 4, '#c82a2a', t, x0); } });
    const dX = mL + 56; g.fillStyle = ink; g.fillRect(dX - 1, mT + 23, 20, GY - mT - 23); g.fillStyle = mix('#5a6a82', '#e8f4ff', n * 0.9); g.fillRect(dX, mT + 24, 18, GY - mT - 24);
    g.fillStyle = '#9aa3b2'; g.fillRect(dX + 8, mT + 24, 2, GY - mT - 24);
    // frigo del ghiaccio e cestino davanti al market
    this.lcBox(g, mL - 14, GY - 16, 12, 16, '#e8f4ff'); g.fillStyle = '#2e7ad8'; g.fillRect(mL - 14, GY - 13, 12, 4); this.text(g, 'ICE', mL - 14, GY - 13, '#ffffff');
    if (n > 0.2) this.light(g, mL - 8, GY - 8, 10, 10, '#bfe0ff', 0.06 * n, 2);
    // colonne della pensilina, rivestite
    for (const px of [cL + 22, cL + cW - 26]) {
      g.fillStyle = ink; g.fillRect(px - 1, cT + cH, 8, GY - cT - cH); g.fillStyle = '#c9ced6'; g.fillRect(px, cT + cH, 6, GY - cT - cH);
      g.fillStyle = '#e8ecf5'; g.fillRect(px + 1, cT + cH, 1, GY - cT - cH); g.fillStyle = '#8a92a2'; g.fillRect(px + 4, cT + cH, 2, GY - cT - cH);
      g.fillStyle = '#c8282b'; g.fillRect(px, GY - 18, 6, 3); g.fillStyle = '#f4f1e6'; g.fillRect(px, GY - 15, 6, 2);   // fascia catarifrangente
    }
    // due isole con le pompe
    for (const [px, k] of [[X - 54, 0], [X + 26, 1]]) {
      g.fillStyle = ink; g.fillRect(px - 20, GY - 6, 58, 6); g.fillStyle = '#9aa0ae'; g.fillRect(px - 19, GY - 5, 56, 5); g.fillStyle = '#c8ccd6'; g.fillRect(px - 19, GY - 5, 56, 1);
      for (let q = 0; q < 56; q += 6) { g.fillStyle = (q / 6) % 2 ? '#1a1a1a' : '#ffd23f'; g.fillRect(px - 19 + q, GY - 3, 6, 3); }   // cordolo zebrato
      // pompa: corpo, display acceso, tre pistole, tubo
      g.fillStyle = ink; g.fillRect(px - 1, GY - 46, 20, 40); g.fillStyle = '#e8ecf2'; g.fillRect(px, GY - 45, 18, 38);
      g.fillStyle = k ? '#2e7ad8' : '#1aa86a'; g.fillRect(px, GY - 45, 18, 6); g.fillStyle = '#ffffff'; g.fillRect(px, GY - 45, 18, 1);
      if (n > 0.2) this.light(g, px + 9, GY - 42, 14, 6, k ? '#4a9aff' : '#3bff9a', 0.08 * n, 2);
      g.fillStyle = '#0b0f16'; g.fillRect(px + 2, GY - 37, 14, 9);
      const lit = n > 0.1 ? '#b8ff3a' : '#5a8a2a'; this.text(g, String(10 + Math.floor(rnd(s + k) * 80)), px + 4, GY - 35, lit);
      g.fillStyle = '#5a6070'; g.fillRect(px + 2, GY - 26, 14, 1);
      for (let q = 0; q < 3; q++) { g.fillStyle = ['#1aa86a', '#ffd23f', '#1a1a1a'][q]; g.fillRect(px + 3 + q * 5, GY - 23, 3, 6); g.fillStyle = ink; g.fillRect(px + 4 + q * 5, GY - 17, 1, 3); }
      g.fillStyle = '#2a2a30'; g.fillRect(px + 18, GY - 30, 2, 2); g.fillRect(px + 20, GY - 28, 2, 14); g.fillRect(px + 21, GY - 14, 3, 2);   // tubo
      g.fillStyle = '#c8ccd6'; g.fillRect(px, GY - 10, 18, 3);
      // estintore
      g.fillStyle = ink; g.fillRect(px - 12, GY - 18, 6, 12); g.fillStyle = '#d42a2a'; g.fillRect(px - 11, GY - 17, 4, 10); g.fillStyle = '#f4f1e6'; g.fillRect(px - 11, GY - 14, 4, 1);
    }
    // pensilina: fascia bianca con la riga ciano accesa, il nome, le lampade sotto
    g.fillStyle = ink; g.fillRect(cL - 2, cT - 2, cW + 4, cH + 5);
    const fg = g.createLinearGradient(0, cT, 0, cT + cH); fg.addColorStop(0, '#f4f6fb'); fg.addColorStop(1, '#c8ceda'); g.fillStyle = fg; g.fillRect(cL, cT, cW, cH);
    g.fillStyle = '#163a8c'; g.fillRect(cL, cT, 28, cH); g.fillStyle = '#ffd23f'; g.fillRect(cL + 8, cT + 4, 12, 8); g.fillStyle = '#163a8c'; g.fillRect(cL + 11, cT + 6, 6, 4);   // marchio
    this.text(g, 'BENZINA 24H', cL + 36 + Math.round((cW - 44 - this.textW('BENZINA 24H', 2)) / 2), cT + 3, '#163a8c', 2);
    g.fillStyle = flick(t, s + 9, 0.02) ? '#2ee6ff' : '#1a6a80'; g.fillRect(cL, cT + cH - 2, cW, 2);
    if (n > 0.1) this.light(g, X - 5, cT + cH, cW * 0.5, 4, '#2ee6ff', 0.07 * n, 2);
    g.fillStyle = '#9aa0ae'; g.fillRect(cL, cT + cH, cW, 3); g.fillStyle = '#6a7080'; g.fillRect(cL, cT + cH + 2, cW, 1);
    for (let k = 0; k < 6; k++) {
      const lx = cL + 40 + k * 32; g.fillStyle = n > 0.1 ? '#ffffff' : '#c8ccd6'; g.fillRect(lx, cT + cH + 3, 12, 2);
      if (n > 0.1) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, cT + cH + 5, 0, GY);
        gr.addColorStop(0, `rgba(232,240,255,${0.16 * n})`); gr.addColorStop(1, 'rgba(232,240,255,0)'); g.fillStyle = gr;
        g.beginPath(); g.moveTo(lx, cT + cH + 5); g.lineTo(lx + 12, cT + cH + 5); g.lineTo(lx + 26, GY); g.lineTo(lx - 14, GY); g.closePath(); g.fill(); g.restore(); }
    }
    // totem dei prezzi a sinistra (cifre a LED)
    const tx = X - 148;
    const ty = 102;
    g.fillStyle = ink; g.fillRect(tx + 9, ty + 70, 8, GY - ty - 70); g.fillStyle = '#5a6070'; g.fillRect(tx + 10, ty + 70, 6, GY - ty - 70);
    g.fillStyle = ink; g.fillRect(tx - 2, ty, 30, 74); g.fillStyle = '#f4f6fb'; g.fillRect(tx - 1, ty + 1, 28, 14);
    g.fillStyle = '#163a8c'; g.fillRect(tx - 1, ty + 1, 28, 3); g.fillStyle = '#ffd23f'; g.fillRect(tx + 9, ty + 6, 8, 6);
    g.fillStyle = '#0b0f16'; g.fillRect(tx - 1, ty + 16, 28, 57);
    const rows = [['B', '1,95', '#b8ff3a'], ['D', '1,84', '#ffd23f'], ['G', '0,79', '#2ee6ff']];
    rows.forEach(([a, p, c], i) => { this.text(g, a, tx + 1, ty + 20 + i * 18, '#e8e6df'); this.lcNeon(g, p, tx + 8, ty + 20 + i * 18, c, 1, t, s + 20 + i); g.fillStyle = '#2a2e3a'; g.fillRect(tx, ty + 28 + i * 18, 26, 1); });
    this.placeTag(g, X - 5, cT + 26, 'BENZINA', '#2ee6ff', near);
  };

  // ---------------------------------------------------------------- l'autogrill Sosta 24: vetrata lunga, pensilina d'ingresso, palo alto
  S.lcGrill = function (g, e, X, st, near, open) {
    const C = this.C, t = st.t, n = 1 - (this.day || 0), s = Math.round(e.x) % 983, ink = C.ink;
    const L = X - 150, W = 300, T = 116, band = 14;
    this.lcYard(g, X, 160);
    // impianti sul tetto
    for (const [ax, aw] of [[L + 30, 22], [L + 70, 14], [L + W - 60, 26]]) { this.lcBox(g, ax, T - 10, aw, 10, '#5a6070'); for (let q = 2; q < aw; q += 3) { g.fillStyle = '#3a3f4c'; g.fillRect(ax + q, T - 8, 1, 6); } }
    // fascia arancione del tetto con la scritta
    g.fillStyle = ink; g.fillRect(L - 3, T - 3, W + 6, band + 4);
    const bg = g.createLinearGradient(0, T, 0, T + band); bg.addColorStop(0, '#ff9a4a'); bg.addColorStop(1, '#d85a1a'); g.fillStyle = bg; g.fillRect(L, T, W, band);
    g.fillStyle = '#ffd0a0'; g.fillRect(L, T, W, 1);
    this.text(g, 'SOSTA 24  -  RISTORO  -  MARKET  -  DOCCE', L + 10, T + 5, '#3a1a08', 1);
    if (n > 0.1) this.light(g, X, T + 7, W * 0.55, 10, '#ff7a3a', 0.06 * n, 3);
    // muro a sinistra in pietra con le icone dei servizi
    const sL = L, sW = 46, gT = T + band;
    this.lcWall(g, sL, gT, sW, GY - gT, '#4a4650', 'mattoni', s);
    for (const [i, lab, c] of [[0, 'BAGNI', '#2ee6ff'], [1, 'DOCCE', '#ffd23f'], [2, 'PASTI', '#b8ff3a']]) {
      const iy = gT + 10 + i * 16; this.lcBox(g, sL + 9, iy, 28, 11, '#14161e'); this.text(g, lab, sL + 23 - Math.round(this.textW(lab, 1) / 2), iy + 3, c);
      if (n > 0.2) this.light(g, sL + 23, iy + 5, 16, 6, c, 0.04 * n, 2);
    }
    // vetrata lunga: plafoniere, scaffali, cassa, gente
    const vL = sL + sW, vW = W - sW;
    this.lcGlass(g, vL + 2, gT + 4, vW - 4, GY - gT - 8, { col: '#fff0d0', mull: 8, kick: 5, frame: '#3a3e4c', inside: (g2, x0, y0, w, h, nn) => {
      for (let q = 6; q < w; q += 22) { g2.fillStyle = mix('#8a909a', '#ffffff', nn); g2.fillRect(x0 + q, y0 + 2, 12, 1); }
      for (let r = 0; r < 4; r++) for (let q = 0; q < w * 0.45; q += 3) { g2.fillStyle = ['#ff7a3a', '#2ee6ff', '#ffd23f', '#b8ff3a', '#ff5fa8', '#e8e6df', '#9a5a3a'][Math.floor(rnd(q * 1.7 + r * 5 + s) * 7)]; g2.fillRect(x0 + 4 + q, y0 + 12 + r * 10, 2, 5); }
      for (let r = 0; r < 4; r++) { g2.fillStyle = 'rgba(70,74,90,.85)'; g2.fillRect(x0 + 4, y0 + 17 + r * 10, w * 0.45, 1); }
      g2.fillStyle = 'rgba(40,40,50,.85)'; g2.fillRect(x0 + w * 0.62, y0 + h - 16, w * 0.3, 16); g2.fillStyle = 'rgba(255,122,58,.9)'; g2.fillRect(x0 + w * 0.62, y0 + h - 16, w * 0.3, 2);   // bancone del bar
      const bx = Math.round(x0 + w * 0.75) + 4; g2.fillStyle = 'rgba(30,30,40,.8)'; g2.fillRect(bx, y0 + 8, 24, 9); this.text(g2, 'BAR', bx + 7, y0 + 10, '#ffd23f');
      sil(g2, x0 + w * 0.5, y0 + h - 2, '#3a6a9a', t, 1); sil(g2, x0 + w * 0.7, y0 + h - 14, '#e8e6df', t, 2); sil(g2, x0 + w * 0.82, y0 + h - 2, '#9a3a5a', t, 3); sil(g2, x0 + w * 0.2, y0 + h - 2, '#5a9a3a', t, 4);
    } });
    // ingresso sporgente con la porta scorrevole
    const eL = X + 10, eW = 52;
    g.fillStyle = ink; g.fillRect(eL - 4, gT + 10, eW + 8, 6); g.fillStyle = '#ff7a3a'; g.fillRect(eL - 3, gT + 11, eW + 6, 4);
    for (let q = 0; q < 4; q++) { g.fillStyle = n > 0.1 ? '#ffffff' : '#c8ccd6'; g.fillRect(eL + 6 + q * 12, gT + 15, 4, 1); }
    const dT = gT + 18, dH = GY - dT, half = eW / 2, oh = Math.round((half - 2) * open);
    g.fillStyle = ink; g.fillRect(eL - 2, dT - 1, eW + 4, dH + 1); g.fillStyle = mix('#5a6a82', '#d8c8a8', n); g.fillRect(eL, dT, eW, dH);
    g.fillStyle = 'rgba(190,210,240,.35)'; g.fillRect(eL, dT, half - oh, dH); g.fillRect(eL + half + oh, dT, half - oh, dH);
    g.fillStyle = '#3a3e4c'; g.fillRect(eL + half - oh - 1, dT, 1, dH); g.fillRect(eL + half + oh, dT, 1, dH);
    if (n > 0.1) this.light(g, eL + half, GY + 5, 34 + 20 * open, 7, '#fff0d0', (0.08 + 0.06 * open) * n, 3);
    // fioriere con gli alberelli e il deposito dei carrelli
    this.lcPlant(g, vL - 2, s + 3, true); this.lcPlant(g, L + W + 10, s + 7, true);
    for (let q = 0; q < 3; q++) { const cx = L + W - 46 + q * 5; g.fillStyle = ink; g.fillRect(cx, GY - 12, 10, 1); g.fillRect(cx + 1, GY - 12, 1, 9); g.fillRect(cx + 8, GY - 12, 1, 9); g.fillRect(cx + 1, GY - 4, 8, 1); g.fillStyle = '#9aa0ae'; g.fillRect(cx + 2, GY - 11, 6, 1); }
    // palo alto con l'insegna
    const px = L + W + 30;
    const py = 88;
    g.fillStyle = ink; g.fillRect(px - 3, py + 20, 7, GY - py - 20); g.fillStyle = '#6a7080'; g.fillRect(px - 2, py + 20, 5, GY - py - 20); g.fillStyle = '#9aa0ae'; g.fillRect(px - 2, py + 20, 1, GY - py - 20);
    g.fillStyle = ink; g.fillRect(px - 30, py, 62, 36);
    const pg = g.createLinearGradient(0, py + 1, 0, py + 35); pg.addColorStop(0, '#ff9a4a'); pg.addColorStop(1, '#d8501a'); g.fillStyle = pg; g.fillRect(px - 29, py + 1, 60, 34);
    g.fillStyle = '#ffd0a0'; g.fillRect(px - 29, py + 1, 60, 1);
    this.text(g, 'SOSTA', px - Math.round(this.textW('SOSTA', 2) / 2), py + 5, '#fff6e0', 2);
    this.text(g, '24', px - Math.round(this.textW('24', 2) / 2) + 10, py + 18, '#fff6e0', 2);
    g.fillStyle = '#fff6e0'; for (let q = 0; q < 3; q++) g.fillRect(px - 22 + q * 5, py + 22 - q * 2, 3, 6 + q * 2);   // le tre barre del logo
    if (n > 0.1) this.light(g, px, py + 18, 44, 26, '#ff7a3a', 0.09 * n, 3);
    this.placeTag(g, X + 36, T + band + 2, 'AUTOGRILL', '#ff7a3a', near);
  };

  // ---------------------------------------------------------------- Motel Ovunque: due piani di stanze, ballatoio, scala, distributori, insegna a freccia
  S.lcMotel = function (g, e, X, st, near) {
    const C = this.C, t = st.t, n = 1 - (this.day || 0), s = Math.round(e.x) % 977, ink = C.ink;
    const L = X - 130, W = 260, T = 110, fl = 50;
    this.lcYard(g, X, 200);
    // scala esterna a sinistra
    for (let q = 0; q < 12; q++) { g.fillStyle = ink; g.fillRect(L - 30 + q * 2, GY - 4 - q * 4, 8, 2); g.fillStyle = '#6a6070'; g.fillRect(L - 29 + q * 2, GY - 4 - q * 4, 6, 1); }
    g.fillStyle = ink; g.fillRect(L - 32, GY - 54, 1, 54); g.fillRect(L - 32, GY - 54, 30, 1); g.fillRect(L - 8, T + fl - 4, 1, 50);
    // tetto con le tegole e l'insegna della cassa
    g.fillStyle = ink; g.fillRect(L - 6, T - 8, W + 12, 9);
    for (let k = 0; k < (W + 10) / 4; k++) { g.fillStyle = k % 2 ? '#4a3048' : '#3e283c'; g.fillRect(L - 5 + k * 4, T - 7, 4, 7); g.fillStyle = '#6a4a64'; g.fillRect(L - 5 + k * 4, T - 7, 2, 1); }
    const msg = 'LA TUA CASSA TI ASPETTA', mw = this.textW(msg, 1) + 10;
    for (const px of [L + 14, L + 8 + mw - 8]) { g.fillStyle = ink; g.fillRect(px, T - 9, 2, 3); }
    this.lcBox(g, L + 6, T - 20, mw, 11, '#14101a');
    for (let q = 0; q < mw; q += 4) { g.fillStyle = (Math.floor(t * 6) + q / 4) % 3 === 0 ? '#ffe08a' : '#5a4a2a'; g.fillRect(L + 6 + q, T - 20, 1, 1); g.fillRect(L + 6 + q, T - 10, 1, 1); }   // lampadine che corrono
    this.lcNeon(g, msg, L + 11, T - 17, '#ffd23f', 1, t, s + 3);
    // facciata a due piani
    this.lcWall(g, L, T, W, GY - T, '#4a3448', 'intonaco', s);
    g.fillStyle = ink; g.fillRect(L - 1, T, 1, GY - T); g.fillRect(L + W, T, 1, GY - T);
    // ballatoio del primo piano con la ringhiera
    g.fillStyle = ink; g.fillRect(L - 10, T + fl - 2, W + 12, 6); g.fillStyle = '#6a5068'; g.fillRect(L - 9, T + fl - 1, W + 10, 3);
    g.fillStyle = 'rgba(6,4,12,.45)'; g.fillRect(L, T + fl + 4, W, 5);
    g.fillStyle = ink; g.fillRect(L - 10, T + fl - 16, W + 12, 1); for (let q = L - 10; q < L + W + 2; q += 5) g.fillRect(q, T + fl - 16, 1, 14);
    for (const px of [L + 4, L + W / 2, L + W - 6]) { g.fillStyle = ink; g.fillRect(px, T + fl + 4, 3, GY - T - fl - 4); g.fillStyle = '#6a5068'; g.fillRect(px + 1, T + fl + 4, 1, GY - T - fl - 4); }
    // stanze: porta, numero, finestra con le tende, condizionatore; la 7 è sempre accesa e rosa
    for (let f = 0; f < 2; f++) for (let q = 0; q < 7; q++) {
      const dx = L + 10 + q * 36, dy = T + 8 + f * fl, num = f * 7 + q + 1, seven = num === 7, on = seven || rnd(num + s) < 0.4;
      g.fillStyle = ink; g.fillRect(dx - 1, dy - 1, 13, 31); g.fillStyle = seven ? '#ff5fa8' : '#5a4258'; g.fillRect(dx, dy, 11, 30);
      g.fillStyle = seven ? '#ff9ac8' : '#6a5068'; g.fillRect(dx + 1, dy + 2, 9, 11); g.fillRect(dx + 1, dy + 15, 9, 12);
      g.fillStyle = '#d8b040'; g.fillRect(dx + 8, dy + 15, 2, 2);
      const nm = String(num); this.text(g, nm, dx + 6 - Math.round(this.textW(nm, 1) / 2), dy - 7, seven ? '#ff9ac8' : '#a890a8');
      if (seven && n > 0.1) this.light(g, dx + 5, dy + 15, 12, 18, '#ff5fa8', 0.09 * n, 3);
      this.lcWindow(g, dx + 15, dy + 6, 14, 11, { lit: on, shut: '#5a4258', closed: !on && rnd(num * 3 + s) < 0.5 });
      this.lcBox(g, dx + 16, dy + 21, 12, 6, '#8a8c94'); g.fillStyle = '#5a5c64'; for (let k = 1; k < 12; k += 2) g.fillRect(dx + 16 + k, dy + 22, 1, 4);   // condizionatore
      g.fillStyle = 'rgba(20,30,40,.5)'; g.fillRect(dx + 21, dy + 27, 1, f ? GY - dy - 27 : 2);   // gocciolio
      if (f === 0) this.lcLamp(g, dx + 5, dy - 10, '#ffd9a0');
    }
    // distributori sotto il ballatoio: ghiaccio (azzurro) e bibite (rosso)
    const vx = L + W - 2;
    this.lcBox(g, vx + 4, GY - 32, 16, 32, '#c8282b'); g.fillStyle = mix('#5a1a1a', '#ff8a8a', n); g.fillRect(vx + 6, GY - 29, 9, 20); g.fillStyle = '#1a1a1a'; g.fillRect(vx + 16, GY - 26, 2, 6);
    this.lcBox(g, vx + 23, GY - 26, 14, 26, '#d8ecff'); g.fillStyle = '#2e7ad8'; g.fillRect(vx + 23, GY - 22, 14, 5); this.text(g, 'ICE', vx + 24, GY - 22, '#ffffff');
    if (n > 0.1) { this.light(g, vx + 12, GY - 18, 14, 18, '#ff5a5a', 0.07 * n, 2); this.light(g, vx + 30, GY - 14, 12, 14, '#9fd0ff', 0.06 * n, 2); }
    // insegna a freccia sul palo, con le lampadine che corrono
    const px = L + W + 52, oy = 52;   // tutta l'insegna scende di oy
    g.fillStyle = ink; g.fillRect(px - 3, 60 + oy, 6, GY - 60 - oy); g.fillStyle = '#4a3a4a'; g.fillRect(px - 2, 60 + oy, 4, GY - 60 - oy);
    g.fillStyle = ink; g.fillRect(px - 40, 40 + oy, 86, 48); g.fillStyle = '#20101e'; g.fillRect(px - 38, 42 + oy, 82, 44);
    for (let q = 0; q < 40; q++) {   // cornice di lampadine
      const p = q / 40, per = 2 * (82 + 44), d = p * per; let bx, by;
      if (d < 82) { bx = px - 38 + d; by = 42 + oy; } else if (d < 126) { bx = px + 44; by = 42 + oy + d - 82; } else if (d < 208) { bx = px + 44 - (d - 126); by = 86 + oy; } else { bx = px - 38; by = 86 + oy - (d - 208); }
      const lit = (q + Math.floor(t * 8)) % 4 === 0;
      g.fillStyle = lit && n > 0.05 ? '#ffe08a' : '#6a5a3a'; g.fillRect(Math.round(bx) - 1, Math.round(by) - 1, 2, 2);
    }
    this.lcNeon(g, 'MOTEL', px - 32, 47 + oy, '#ff5fa8', 2, t, s + 1);
    this.lcNeon(g, 'OVUNQUE', px - 32, 62 + oy, '#2ee6ff', 1, t, s + 2);
    if (Math.floor(t * 2) % 2) this.lcNeon(g, 'LIBERO', px - 32, 74 + oy, '#3bff7a', 1, t, s + 9); else this.text(g, 'LIBERO', px - 32, 74 + oy, '#103a20');
    // freccia che indica l'ingresso
    const ax = px - 52, ay = 96 + oy; for (let q = 0; q < 6; q++) { const lit = (q + Math.floor(t * 6)) % 6 < 2 && n > 0.05; g.fillStyle = lit ? '#ffd23f' : '#5a4a2a'; g.fillRect(px - q * 7, ay + q * 3, 4, 3); }
    g.fillStyle = Math.floor(t * 6) % 6 < 2 && n > 0.05 ? '#ffd23f' : '#5a4a2a'; g.fillRect(ax + 6, ay + 16, 8, 3); g.fillRect(ax + 6, ay + 12, 3, 7);
    if (n > 0.1) this.light(g, px + 2, 64 + oy, 56, 34, '#ff5fa8', 0.08 * n, 3);
    this.lcPlant(g, L - 40, s + 5, true);
    this.placeTag(g, X, T + fl + 10, 'MOTEL', '#ff5fa8', near);
  };

  // ---------------------------------------------------------------- Officina Niko e Da Luca Tuning: capannone col portone sezionale
  S.lcGarage = function (g, e, X, st, near, open) {
    const C = this.C, t = st.t, n = 1 - (this.day || 0), s = Math.round(e.x) % 971, ink = C.ink, niko = e.id === 'niko';
    const L = X - 130, W = 260, T = niko ? 112 : 110, dL = X - 52, dW = 104, dT = 140, dH = GY - dT, oh = Math.round(dH * open);
    this.lcYard(g, X, 130);
    if (niko) {
      // tetto a capanna in lamiera con la grondaia
      g.fillStyle = ink; g.beginPath(); g.moveTo(L - 8, T + 1); g.lineTo(X, T - 18); g.lineTo(L + W + 8, T + 1); g.closePath(); g.fill();
      g.fillStyle = '#5a5c62'; g.beginPath(); g.moveTo(L - 6, T); g.lineTo(X, T - 16); g.lineTo(L + W + 6, T); g.closePath(); g.fill();
      for (let q = L; q < L + W; q += 6) { g.fillStyle = '#6a6c72'; const yy = T - 16 * (1 - Math.abs(q - X) / (W / 2 + 6)); g.fillRect(q, yy + 1, 1, T - yy - 1); }
      g.fillStyle = '#3a3c42'; g.fillRect(L - 6, T, W + 12, 2);
      g.fillStyle = ink; g.fillRect(L + W + 4, T, 2, GY - T);   // pluviale
      this.lcWall(g, L, T + 2, W, 40, '#5e6066', 'lamiera', s);
      this.lcWall(g, L, T + 42, W, GY - T - 42, '#5a3e30', 'mattoni', s + 1);
    } else {
      this.lcWall(g, L, T, W, GY - T, '#1e2028', 'pannelli', s);
      this.lcCornice(g, L, T, W, '#2a2c36');
      g.fillStyle = flick(t, s, 0.02) ? '#ffb000' : '#6a4a10'; g.fillRect(L, T + 27, W, 2);   // riga di LED ambra
      if (n > 0.1) this.light(g, X, T + 28, W * 0.5, 4, '#ffb000', 0.06 * n, 2);
      for (let q = 0; q < 6; q++) { g.fillStyle = q % 2 ? '#1a1a1a' : '#e8e6df'; g.fillRect(L + 8 + q * 4, T + 8, 4, 4); g.fillStyle = q % 2 ? '#e8e6df' : '#1a1a1a'; g.fillRect(L + 8 + q * 4, T + 12, 4, 4); }   // scacchi da gara
    }
    g.fillStyle = ink; g.fillRect(L - 1, T, 1, GY - T); g.fillRect(L + W, T, 1, GY - T);
    // insegna
    const sign = niko ? 'OFFICINA NIKO' : 'DA LUCA TUNING', scol = niko ? '#5ad1ff' : '#ffb000', sw = this.textW(sign, 2), sL = Math.round(X - sw / 2) - 8;
    if (niko) {
      this.lcBox(g, sL, T + 8, sw + 16, 18, '#163a6c'); g.fillStyle = '#2a5a9a'; g.fillRect(sL, T + 8, sw + 16, 1);
      this.text(g, sign, sL + 8, T + 12, '#f4f1e6', 2);
      for (const q of [0.12, 0.5, 0.88]) this.lcLamp(g, Math.round(sL + (sw + 16) * q) - 3, T + 7, '#e8f0ff', true);
    } else {
      this.lcBox(g, sL, T + 6, sw + 16, 18, '#0e0e12');
      this.lcNeon(g, sign, sL + 8, T + 10, scol, 2, t, s + 2, sw);
      for (let q = 0; q < 3; q++) { g.fillStyle = scol; g.fillRect(sL - 10 + q * 3, T + 10 + q, 2, 10 - q * 2); g.fillRect(sL + sw + 22 - q * 3, T + 10 + q, 2, 10 - q * 2); }
    }
    // portone sezionale: dentro il ponte, le luci, gli attrezzi; si alza quando ti fermi
    g.fillStyle = ink; g.fillRect(dL - 4, dT - 4, dW + 8, dH + 4); g.fillStyle = '#8a8c94'; g.fillRect(dL - 3, dT - 3, dW + 6, 2);
    const gr = g.createLinearGradient(0, dT, 0, GY); gr.addColorStop(0, mix('#4a5468', '#b8c4d4', n)); gr.addColorStop(1, mix('#2a3040', '#646e80', n));
    g.fillStyle = gr; g.fillRect(dL, dT, dW, dH);
    for (let q = 0; q < 3; q++) { g.fillStyle = n > 0.1 ? '#ffffff' : '#c8ccd6'; g.fillRect(dL + 14 + q * 32, dT + 3, 12, 1); }
    // parete degli attrezzi
    g.fillStyle = 'rgba(40,46,60,.85)'; g.fillRect(dL + 26, dT + 10, 50, 22);
    for (let q = 0; q < 12; q++) { g.fillStyle = ['#c8ccd6', '#d42a2a', '#ffd23f', '#9aa0ae'][q % 4]; g.fillRect(dL + 29 + (q % 6) * 8, dT + 13 + Math.floor(q / 6) * 9, 2, 6); }
    g.fillStyle = '#ffd23f'; g.fillRect(dL + 10, dT + 20, 4, dH - 20); g.fillRect(dL + dW - 14, dT + 20, 4, dH - 20);   // colonne del ponte
    g.fillStyle = '#d42a2a'; g.fillRect(dL + dW - 34, GY - 16, 14, 16); g.fillStyle = '#8a1a10'; g.fillRect(dL + dW - 34, GY - 12, 14, 1);   // carrello rosso
    if (!niko) { g.fillStyle = '#2a2a30'; g.fillRect(dL + 22, GY - 5, 60, 5); g.fillStyle = '#5a5c64'; this.span(g, dL + 36, GY - 3, 6, 2); this.span(g, dL + 68, GY - 3, 6, 2);   // banco a rulli
      if (n > 0.1 && Math.floor(t * 2) % 2) this.light(g, dL + 52, dT + 20, 30, 16, '#ff2a2a', 0.05 * n, 2); }
    sil(g, dL + 60, GY - 1, niko ? '#1a3a8a' : '#1a1a1a', t, s);
    // il portone (a doghe, si arrotola in alto)
    g.fillStyle = '#5a6070'; g.fillRect(dL, dT, dW, dH - oh);
    for (let yy = dT + 5; yy < dT + dH - oh; yy += 6) { g.fillStyle = '#454b5a'; g.fillRect(dL, yy, dW, 1); g.fillStyle = '#6a7080'; g.fillRect(dL, yy + 1, dW, 1); }
    if (dH - oh > 6) { g.fillStyle = '#2a2e38'; g.fillRect(dL + dW / 2 - 6, dT + dH - oh - 4, 12, 2); }
    if (n > 0.1 && oh > 2) this.light(g, X, GY + 4, 70, 8, '#e8f0ff', 0.1 * open * n, 3);
    // a sinistra: ufficio con la finestra (veneziane) e la porta
    this.lcGlass(g, L + 12, 150, 50, 30, { col: '#e8f0ff', noSpill: true, inside: (g2, x0, y0, w, h) => {
      for (let yy = y0 + 2; yy < y0 + h; yy += 3) { g2.fillStyle = 'rgba(60,64,80,.55)'; g2.fillRect(x0, yy, w, 1); }
      sil(g2, x0 + 30, y0 + h - 2, niko ? '#2a3a6a' : '#ffb000', t, s + 5); } });
    this.text(g, niko ? 'GOMME' : 'CERCHI', L + 14, 186, niko ? '#ffb000' : '#ff5fa8');
    this.text(g, niko ? 'REVISIONI' : 'ELABORAZIONI', L + 14, 194, '#e8e6df');
    this.lcLamp(g, L + 37, 145);
    // a destra: gomme, fusto, compressore (Niko) / ruote in esposizione e bandiere (Luca)
    if (niko) {
      for (let q = 0; q < 5; q++) { g.fillStyle = ink; g.fillRect(dL + dW + 12, GY - 7 - q * 7, 22, 7); g.fillStyle = '#1b1b20'; g.fillRect(dL + dW + 13, GY - 6 - q * 7, 20, 5); g.fillStyle = '#34343c'; g.fillRect(dL + dW + 13, GY - 6 - q * 7, 20, 1); }
      g.fillStyle = ink; g.fillRect(L + W - 22, GY - 22, 16, 22); g.fillStyle = '#c42a1a'; g.fillRect(L + W - 21, GY - 21, 14, 21); g.fillStyle = '#8a1a10'; g.fillRect(L + W - 21, GY - 16, 14, 1); g.fillRect(L + W - 21, GY - 8, 14, 1);
      this.lcBox(g, dL + dW + 40, GY - 14, 18, 14, '#2a6a3a'); g.fillStyle = ink; g.fillRect(dL + dW + 44, GY - 18, 10, 4); g.fillStyle = '#c8ccd6'; this.span(g, dL + dW + 49, GY - 7, 3, 3);
      this.lcLamp(g, dL + dW + 24, dT - 8); this.lcLamp(g, dL - 24, dT - 8);
    } else {
      for (let q = 0; q < 3; q++) { const cx = dL + dW + 18 + q * 15, cy = GY - 10 - (q % 2) * 12, a = t * 0.6 + q;
        g.fillStyle = ink; this.span(g, cx, cy, 7, 7); g.fillStyle = ['#c9ced6', '#d9a82e', '#1c1d22'][q]; this.span(g, cx, cy, 5, 5);
        g.fillStyle = ink; for (let k = 0; k < 5; k++) { const aa = a + k * 1.2566; g.fillRect(Math.round(cx + Math.cos(aa) * 3), Math.round(cy + Math.sin(aa) * 3), 1, 1); } g.fillRect(cx, cy, 1, 1); }
      for (const fx of [L + W + 10, L + W + 26]) {   // bandiere a vela
        g.fillStyle = ink; g.fillRect(fx, GY - 60, 1, 60);
        for (let r = 0; r < 44; r++) { const w = Math.round(8 * Math.sin((r + 4) / 48 * Math.PI) + Math.sin(t * 3 + r * 0.2 + fx) * 1.2); g.fillStyle = r > 14 && r < 30 ? '#14161e' : '#ffb000'; g.fillRect(fx + 1, GY - 60 + r, Math.max(1, w), 1); }
      }
      this.lcLamp(g, dL - 24, dT - 8, '#ffcf7a');
    }
    this.placeTag(g, X, dT + 4, niko ? 'MECCANICO' : 'TUNING', scol, near);
  };

  // ---------------------------------------------------------------- Neon Kustom: mattoni scuri, murale, neon ovunque
  S.lcStyle = function (g, e, X, st, near, open) {
    const C = this.C, t = st.t, n = 1 - (this.day || 0), s = Math.round(e.x) % 967, ink = C.ink;
    const L = X - 130, W = 260, T = 112, ph = Math.floor(t * 2) % 2;
    this.lcYard(g, X, 140);
    this.lcWall(g, L, T, W, GY - T, '#2a1e34', 'mattoni', s);
    this.lcCornice(g, L, T, W, '#3a2c48');
    g.fillStyle = ink; g.fillRect(L - 1, T, 1, GY - T); g.fillRect(L + W, T, 1, GY - T);
    // murale sul lato sinistro: onde di colore e una stella, a spruzzo
    const mx = L + 4, my = T + 34, mw = 48, mh = 40;
    for (let q = 0; q < 220; q++) { const u = rnd(s + q), v = rnd(s + q * 1.9), px = mx + Math.floor(u * mw), py = my + Math.floor(v * mh), w = Math.sin(u * 7 + 1) * 8;
      const band = Math.floor((py - my + w) / 9); g.fillStyle = ['#ff2e88', '#b07bff', '#2ee6ff', '#ffd23f', '#ff7a3a'][((band % 5) + 5) % 5]; g.globalAlpha = 0.55; g.fillRect(px, py, 2, 2); }
    g.globalAlpha = 1; this.text(g, 'NK', mx + 14, my + 14, '#f4f1e6', 2);
    // insegna al neon grande, con la cornice di tubo
    const nL = X - 78, nW = 156;
    this.lcBox(g, nL, T + 8, nW, 26, '#0e0812');
    const on1 = this.lcNeon(g, 'NEON', nL + 6, T + 12, '#ff2e88', 3, t, s + 1, this.textW('NEON', 3));
    this.lcNeon(g, 'KUSTOM', nL + 60, T + 12, ph ? '#2ee6ff' : '#9af6ff', 2, t, s + 2);
    this.text(g, 'CERCHI - VERNICI - NEON', nL + 60, T + 25, '#f4f1e6');
    g.fillStyle = on1 && n > 0.05 ? '#ff2e88' : '#4a1a30'; g.fillRect(nL - 3, T + 5, nW + 6, 1); g.fillRect(nL - 3, T + 36, nW + 6, 1); g.fillRect(nL - 3, T + 5, 1, 32); g.fillRect(nL + nW + 2, T + 5, 1, 32);
    // vetrina con i cerchi che girano
    this.lcGlass(g, L + 60, 152, 62, 54, { col: '#ff6ab8', frame: '#ff2e88', inside: (g2, x0, y0, w, h) => {
      g2.fillStyle = 'rgba(10,6,18,.75)'; g2.fillRect(x0, y0, w, h);
      const rimCols = ['#d9a82e', '#c9ced6', '#ff2e88', '#2ee6ff'];
      for (let q = 0; q < 4; q++) { const cx = x0 + 15 + (q % 2) * 32, cy = y0 + 16 + Math.floor(q / 2) * 30, a = t * (0.8 + q * 0.2);
        g2.fillStyle = '#08080a'; this.span(g2, cx, cy, 11, 11); g2.fillStyle = rimCols[q]; this.span(g2, cx, cy, 8, 8); g2.fillStyle = '#08080a'; this.span(g2, cx, cy, 5, 5);
        g2.fillStyle = rimCols[q]; for (let k = 0; k < 5; k++) { const aa = a + k * 1.2566; g2.fillRect(Math.round(cx + Math.cos(aa) * 4), Math.round(cy + Math.sin(aa) * 4), 2, 2); }
        g2.fillStyle = '#ffffff'; g2.fillRect(cx - 5, cy - 6, 2, 1); }
    } });
    // ingresso con la cornice al neon e il pavimento a scacchi
    const dL = X + 4, dW = 104, dT = 150, dH = GY - dT, oh = Math.round(dH * open);
    g.fillStyle = ph ? '#2ee6ff' : '#1aa8c0'; g.fillRect(dL - 3, dT - 3, dW + 6, dH + 3);
    if (n > 0.1) this.light(g, dL + dW / 2, dT, dW * 0.55, 6, '#2ee6ff', 0.08 * n, 2);
    g.fillStyle = '#120b20'; g.fillRect(dL, dT, dW, dH);
    for (let q = 0; q < 8; q++) { g.fillStyle = q % 2 ? '#2a1d44' : '#0e0a18'; g.fillRect(dL + q * 13, 200, 13, 16); }
    g.fillStyle = 'rgba(176,123,255,.5)'; g.fillRect(dL + 20, dT + 10, 64, 2); this.light(g, dL + dW / 2, 190, 50, 22, '#b07bff', 0.12, 3);
    // bombolette sugli scaffali
    for (let q = 0; q < 14; q++) { g.fillStyle = ['#ff2e88', '#2ee6ff', '#ffd23f', '#b8ff3a', '#b07bff'][q % 5]; g.fillRect(dL + 10 + q * 6, dT + 16, 3, 7); g.fillStyle = '#e8e6df'; g.fillRect(dL + 10 + q * 6, dT + 15, 3, 1); }
    g.fillStyle = '#3a2c48'; g.fillRect(dL + 6, dT + 23, dW - 12, 2);
    g.fillStyle = '#2a2140'; g.fillRect(dL, dT, dW, dH - oh);
    for (let yy = dT + 5; yy < dT + dH - oh; yy += 6) { g.fillStyle = '#1d1630'; g.fillRect(dL, yy, dW, 1); g.fillStyle = '#34284e'; g.fillRect(dL, yy + 1, dW, 1); }
    this.light(g, dL + dW / 2, 214, 80, 9, '#2ee6ff', 0.1, 3);
    // tubo al neon che corre sul muro fino all'insegna
    g.fillStyle = on1 && n > 0.05 ? '#b07bff' : '#3a2a5a'; g.fillRect(L + W - 8, T + 40, 2, GY - T - 50); g.fillRect(L + W - 20, T + 40, 14, 2);
    this.lcPlant(g, L + 56, s + 9);
    this.placeTag(g, X + 56, dT + 6, 'ESTETICA', '#ff2e88', near);
  };

  // ---------------------------------------------------------------- carcasse (sfascio): il disegno vero dell'auto, ingiallito,
  // scurito, con ruggine e un vetro rotto; in cache a grandezza piena (si scala al disegno: con la densità doppia resta nitido)
  S.lcWreck = function (id) {
    const key = 'lcwreck' + id; if (this.spr[key]) return this.spr[key];
    if (typeof CARS === 'undefined' || !CARS[id] || !CARS[id].sprite) return null;
    const spr = this.trafficSprite(id, 'orig', 1); if (!spr || !spr.hd) return null;
    const b = spr.hd, w = b.width, h = b.height, G = spr.geo, c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    try { x.filter = 'sepia(0.7) saturate(0.5) brightness(0.55) contrast(1.15)'; } catch (e) { /* senza filtri */ }
    x.drawImage(b, 0, 0);
    if (spr.wheelImg && spr.wheelImg.width) for (const ax of G.ax) x.drawImage(spr.wheelImg, Math.round(ax - spr.wheelImg.width / 2), Math.round(G.wy - spr.wheelImg.height / 2));
    x.filter = 'none'; x.globalCompositeOperation = 'source-atop';
    for (let q = 0; q < 26; q++) { const r = rnd(w * 3 + q * 7.7); x.fillStyle = q % 3 ? 'rgba(120,56,22,.5)' : 'rgba(18,12,8,.55)'; x.fillRect(Math.floor(rnd(q + w) * w), Math.floor(h * 0.25 + r * h * 0.6), 3 + Math.floor(rnd(q * 2 + h) * 12), 2 + Math.floor(r * 4)); }
    x.fillStyle = 'rgba(8,6,6,.75)'; x.beginPath(); x.moveTo(w * 0.62, h * 0.18); x.lineTo(w * 0.74, h * 0.22); x.lineTo(w * 0.7, h * 0.42); x.lineTo(w * 0.6, h * 0.36); x.closePath(); x.fill();
    c.geo = G; return (this.spr[key] = c);
  };

  // ---------------------------------------------------------------- aggancio
  S.drawTripPlace = function (g, e, x, st, near, open) {
    if (!MINE[e.id]) return prev ? prev.call(this, g, e, x, st, near, open) : false;
    const X = Math.round(x);
    if (e.id === 'bar') this.lcBar(g, e, X, st, near, open);
    else if (e.id === 'fuel') this.lcFuel(g, e, X, st, near, open);
    else if (e.id === 'grill') this.lcGrill(g, e, X, st, near, open);
    else if (e.id === 'motel') this.lcMotel(g, e, X, st, near, open);
    else if (e.id === 'style') this.lcStyle(g, e, X, st, near, open);
    else this.lcGarage(g, e, X, st, near, open);
    return true;
  };
})();
