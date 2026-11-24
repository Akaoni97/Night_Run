// ============================================================================
//  Night Run · Luci e dettagli dei paesaggi fuori città (dopo dettagli2d.js)
//  Si aggiunge a Street2D.drawScenery, dopo il disegno di ogni paesaggio: il bagliore dei paesi all'orizzonte, le luci
//  lontane (paesi, cascine, strade con le auto, treni, navi), i fari e i lampeggianti, le torri illuminate da sotto.
//  Le posizioni ripetono gli stessi calcoli dei paesaggi in street2d.js (stessi tileRun e semi), così le luci cadono
//  sulle cose giuste. Tutto deterministico (Street2D.rnd), tranne quello che si muove col tempo t.
//  Cartelloni illuminati lungo la strada (pianura e deserto, scritte inventate in PB_TESTI) e aree di servizio lontane in pianura.
// ============================================================================
(function paesaggi() {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, prev = S.drawScenery, rnd = Street2D.rnd;

  // un punto di luce: il pixel acceso e l'alone
  S.pDot = function (g, x, y, col, a = 0.18, r = 5, w = 1, h = 1) { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), w, h); if (a > 0) this.light(g, x + w / 2, y + h / 2, r, r * 0.7, col, a, 2); };
  // bagliore all'orizzonte (paesi e città lontane che illuminano il cielo basso)
  S.pHorizon = function (g, y, rgb, a) {
    const W = this.LW; g.save(); g.globalCompositeOperation = 'lighter';
    const gr = g.createLinearGradient(0, y - 60, 0, y + 6); gr.addColorStop(0, `rgba(${rgb},0)`); gr.addColorStop(0.75, `rgba(${rgb},${a * 0.6})`); gr.addColorStop(1, `rgba(${rgb},${a})`);
    g.fillStyle = gr; g.fillRect(0, y - 60, W, 66); g.restore();
  };
  // auto lontane su una strada all'orizzonte: coppie di fari bianchi in un senso, fanali rossi nell'altro
  S.pFarCars = function (g, y, dist, t, n, par, seed) {
    const W = this.LW + 200;
    for (let k = 0; k < n; k++) {
      const dir = k % 2 ? 1 : -1, sp = 9 + rnd(k * 3.1 + seed) * 7, x = ((rnd(k + seed) * W + dir * t * sp - dist * par) % W + W) % W - 100;
      const col = dir > 0 ? '#ff4a3a' : '#fff2c8'; this.pDot(g, x, y + (k % 3) * 0.5, col, dir > 0 ? 0.08 : 0.12, 4, 1, 1); g.fillStyle = col; g.fillRect(Math.round(x) + 2, Math.round(y + (k % 3) * 0.5), 1, 1);
    }
  };

  // cartellone pubblicitario lungo la strada, illuminato da due lampade sul bordo alto: due righe di testo inventato
  // (maiuscolo ASCII), una fascia di colore, i pali e la passerella. x = bordo sinistro, base = dove poggiano i pali
  S.pBillboard = function (g, x, base, lines, col, paper, t, k, lit = true) {
    const w = 66, h = 26, top = base - 50, X = Math.round(x);
    g.fillStyle = '#0c0d14'; g.fillRect(X + 12, top + h, 2, base - top - h); g.fillRect(X + w - 14, top + h, 2, base - top - h);   // pali
    g.fillRect(X + 8, top + h + 4, w - 16, 1);                                                                                     // passerella
    g.fillStyle = '#16161f'; g.fillRect(X - 1, top - 1, w + 2, h + 2);
    g.fillStyle = paper; g.fillRect(X, top, w, h);
    g.fillStyle = col; g.fillRect(X, top + h - 5, w, 5); g.fillRect(X, top, 3, h - 5);
    lines.forEach((ln, r) => this.text(g, ln, X + 4 + Math.max(0, (w - 6 - this.textW(ln)) / 2), top + 4 + r * 8, r ? Street2D.shade(col, -0.35) : '#1a1620'));
    // lampade: un braccio sopra il cartellone, la luce che cade sul foglio (sfarfalla appena, una ogni tanto è fulminata)
    const dead = rnd(k * 9.3) < 0.15;
    for (const lx of [X + 14, X + w - 18]) {
      g.fillStyle = '#0c0d14'; g.fillRect(lx, top - 5, 1, 5); g.fillRect(lx, top - 5, 5, 1);
      const on = lit && !(dead && lx > X + 20) && (rnd(k + lx) > 0.08 || Math.sin(t * 23 + k) > -0.6);
      g.fillStyle = on ? '#fff3d0' : '#3a3428'; g.fillRect(lx + 3, top - 4, 3, 1);
      if (on) {
        g.save(); g.globalCompositeOperation = 'lighter';
        const gr = g.createLinearGradient(0, top - 3, 0, top + h); gr.addColorStop(0, 'rgba(255,236,190,.38)'); gr.addColorStop(1, 'rgba(255,236,190,0)');
        g.fillStyle = gr; g.beginPath(); g.moveTo(lx + 3, top - 3); g.lineTo(lx + 22, top + h); g.lineTo(lx - 16, top + h); g.fill(); g.restore();
        this.light(g, lx + 4, top - 3, 14, 8, '#ffe8b0', 0.12, 3);
      }
    }
    if (lit) this.light(g, X + w / 2, top + h / 2, w * 0.7, h, '#ffe0a0', 0.05, 3);
  };
  // area di servizio lontana, dall'altra parte dei campi: la pensilina coi neon, il palo col prezzo, i camion fermi
  S.pServiceArea = function (g, x, y, t, k) {
    const X = Math.round(x);
    g.fillStyle = '#10131c'; g.fillRect(X, y - 3, 46, 3); g.fillRect(X + 4, y, 1, 4); g.fillRect(X + 41, y, 1, 4);    // pensilina
    for (let q = 0; q < 9; q++) { g.fillStyle = '#eef6ff'; g.fillRect(X + 2 + q * 5, y, 3, 1); }
    this.light(g, X + 23, y + 3, 40, 8, '#dff0ff', 0.12, 3);
    g.fillStyle = '#0c0e16'; g.fillRect(X + 52, y - 4, 26, 8); for (let q = 0; q < 4; q++) { g.fillStyle = rnd(k + q) < 0.6 ? '#ffd890' : '#2a2a38'; g.fillRect(X + 54 + q * 6, y - 2, 3, 2); }   // il bar
    g.fillStyle = '#0c0e16'; g.fillRect(X - 10, y - 18, 1, 22); g.fillRect(X - 14, y - 20, 9, 5);                                  // palo coi prezzi
    const c = ['#3aff9a', '#ffb000', '#2ee6ff'][Math.floor(rnd(k * 2.1) * 3)]; g.fillStyle = c; g.fillRect(X - 13, y - 19, 7, 1); g.fillRect(X - 13, y - 17, 7, 1);
    this.light(g, X - 10, y - 18, 10, 6, c, 0.14, 3);
    for (let q = 0; q < 2; q++) { const tx = X + 84 + q * 20; g.fillStyle = '#0a0b12'; g.fillRect(tx, y - 3, 16, 5); g.fillStyle = '#ff3a2a'; g.fillRect(tx, y + 1, 1, 1); }   // camion
  };
  const PB_TESTI = {
    plain: [['MOBILIFICIO', 'USCITA 3 KM'], ['AGRITURISMO', 'IL PIOPPO'], ['SAGRA DEL', 'LAMBRUSCO'], ['DISCOTECA', 'LA NEBBIA'], ['GOMMISTA 24H', 'USCITA 2'], ['CASEIFICIO', 'SPACCIO 1 KM'], ['TRATTORIA', 'DA ORNELLA']],
    desert: [['ULTIMA BENZINA', 'PER 80 MIGLIA'], ['DINER', 'APERTO 24H'], ['MOTEL', 'FRA 12 MIGLIA'], ['SERPENTI VIVI', 'USCITA 3'], ['TACOS', 'FRA 2 MIGLIA'], ['MUSEO DEI', 'MINERALI']],
  };
  const PB_COL = { plain: [['#c8402a', '#efe6d2'], ['#2a6a3a', '#ece8d8'], ['#2a4a8a', '#e8e6dc'], ['#8a2a6a', '#efe2e8']], desert: [['#d8642a', '#f0dfc0'], ['#2a7a8a', '#efe6d0'], ['#b82a2a', '#f2e8d2']] };
  const PB_SKIP_DESERT = (m) => { const r = ((m - 700) % 1600 + 1600) % 1600; return r < 260 || r > 1540; };   // lontani dal motel della Route 66
  // i cartelloni stanno a distanze vere lungo la strada (si muovono con la strada, come i paletti)
  S.pBillboards = function (g, bg, base, R, t, step, skip, lit = true) {
    const { wx, visFrom, visTo } = R, T = PB_TESTI[bg], C = PB_COL[bg];
    for (let m = Math.floor((visFrom - 80) / step) * step + step * 0.37; m < visTo + 10; m += step) {
      const k = Math.round(m); if (rnd(k * 0.731) < 0.42 || (skip && skip(m))) continue;
      const [col, paper] = C[Math.floor(rnd(k * 1.7) * C.length)];
      this.pBillboard(g, wx(m), base, T[Math.floor(rnd(k * 2.3) * T.length)], col, paper, t, k, lit);
    }
  };

  S.drawScenery = function (g, dist, t, bg, R) {
    prev.call(this, g, dist, t, bg, R);
    if (this.quality === 'bassa' && this.slow) return;
    const W = this.LW, night = 1 - 0.6 * (this.day || 0);
    if (night < 0.5) {                                                   // di giorno solo i cartelloni, a lampade spente
      if (bg === 'plain') this.pBillboards(g, 'plain', 211, R, t, 160, null, false);
      if (bg === 'desert') this.pBillboards(g, 'desert', 222, R, t, 190, PB_SKIP_DESERT, false);
      return;
    }
    const { wx, visFrom, visTo } = R;

    if (bg === 'plain') {
      // Bassa: i paesi lontani (case, campanile illuminato), la provinciale con le auto, le aie delle cascine col lampione
      this.pHorizon(g, 190, '255,150,80', 0.16);
      this.tileRun(dist * 0.02, 360, (i, x) => {
        if (rnd(i * 4.7) < 0.35) return;
        const cx = x + 60 + rnd(i) * 200, n = 8 + Math.floor(rnd(i + 1) * 12);
        for (let q = 0; q < n; q++) this.pDot(g, cx + (rnd(i * 31 + q) - 0.5) * 70, 186 + rnd(i * 17 + q) * 5, rnd(i * 7 + q) < 0.75 ? '#ffc870' : '#fff0d0', q % 3 ? 0 : 0.05, 3);
        if (rnd(i * 2.9) < 0.6) {   // campanile illuminato dal basso
          const tx = cx + 10; g.fillStyle = '#2a2236'; g.fillRect(tx, 166, 4, 22); g.fillRect(tx - 1, 164, 6, 3); g.fillRect(tx + 1, 160, 2, 4);
          g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, 188, 0, 160); gr.addColorStop(0, 'rgba(255,190,110,.45)'); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.fillRect(tx, 160, 4, 28); g.restore();
          this.pDot(g, tx + 1, 170, '#fff4d8', 0.1, 4, 2, 2);                             // l'orologio
        }
      });
      this.pFarCars(g, 194, dist, t, 6, 0.6, 11);
      // le aie delle cascine (stesso calcolo di street2d.js: tileRun(dist * 3.2, 220), r0 tra 0,55 e 0,8)
      this.tileRun(dist * 3.2, 220, (i, x) => {
        const r0 = rnd(i * 3.7); if (r0 < 0.55 || r0 >= 0.8) return;
        const bx = x + 40, lx = bx - 10;
        g.fillStyle = '#1a1c26'; g.fillRect(lx, 168, 2, 36); g.fillRect(lx, 168, 7, 2);
        g.fillStyle = '#ffd08a'; g.fillRect(lx + 5, 170, 3, 2);
        this.light(g, lx + 6, 172, 26, 18, '#ffb860', 0.09, 3); this.light(g, lx + 10, 202, 40, 6, '#ffb860', 0.07, 3);   // alone e pozza nell'aia
        g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,190,110,.06)'; g.beginPath(); g.moveTo(lx + 4, 172); g.lineTo(lx + 22, 172); g.lineTo(lx + 44, 204); g.lineTo(lx - 16, 204); g.fill(); g.restore();
      });
      // la cabina elettrica lampeggia rosso sui tralicci (uno ogni tanto)
      this.tileRun(dist * 1.4, 260, (i, x) => { if (rnd(i * 5.5) < 0.6) return; if (Math.floor(t * 1.2 + i) % 2) this.pDot(g, x - 1, 118, '#ff3a2a', 0.2, 6, 2, 2); });
      // un'area di servizio lontana ogni tanto, dall'altra parte dei campi, e i cartelloni lungo la strada
      this.tileRun(dist * 0.5, 800, (i, x) => { if (rnd(i * 4.3) < 0.4) return; this.pServiceArea(g, x + 200 + rnd(i) * 400, 188, t, i); });
      this.pBillboards(g, 'plain', 211, R, t, 160);
      return;
    }

    if (bg === 'village') {
      // San Gimignano: le torri illuminate da sotto, il paese sul colle con le finestre, bagliore caldo
      this.pHorizon(g, 196, '255,170,90', 0.14);
      const tx = Math.round(W * 0.35 - ((dist * 0.012) % (W + 600))) + ((dist * 0.012) % (W + 600) > W * 0.35 + 200 ? W + 600 : 0);
      const tw = [[-70, 40], [-52, 52], [-38, 34], [-22, 58], [-8, 46], [6, 62], [20, 38], [34, 54], [50, 44], [66, 36], [-60, 30], [80, 28], [-86, 24], [92, 22]];
      g.save(); g.globalCompositeOperation = 'lighter';
      for (const [dx, h] of tw) { const gr = g.createLinearGradient(0, 162, 0, 158 - h); gr.addColorStop(0, 'rgba(255,196,120,.38)'); gr.addColorStop(1, 'rgba(255,196,120,.04)'); g.fillStyle = gr; g.fillRect(tx + dx, 158 - h, 8, h + 4); }
      g.restore();
      this.light(g, tx, 150, 150, 40, '#ffb060', 0.05, 4);
      for (let q = 0; q < 30; q++) this.pDot(g, tx - 100 + rnd(q + 300) * 200, 166 + rnd(q + 301) * 18, '#ffd890', q % 4 ? 0 : 0.06, 3);
      this.pFarCars(g, 198, dist, t, 4, 0.5, 23);
      return;
    }

    if (bg === 'sea') {
      // Positano: il faro sul promontorio col fascio che gira, un traghetto illuminato, la luna che brilla sull'acqua
      this.pHorizon(g, 168, '120,170,255', 0.1);
      const mx = W - 90; this.light(g, mx, 120, 70, 70, '#e8f0ff', 0.04, 4);
      this.tileRun(dist * 0.03, 1500, (i, x) => {
        if (rnd(i * 6.1) < 0.3) return;
        const px = x + 700, base = 168;
        g.fillStyle = '#140e20'; for (let c = -90; c < 90; c += 2) { const h = Math.round(26 * Math.cos(c / 58) + 6); g.fillRect(px + c, base - h, 2, h); }
        g.fillStyle = '#d8d4c8'; g.fillRect(px - 3, base - 58, 7, 26); g.fillStyle = '#b8342a'; g.fillRect(px - 3, base - 50, 7, 4); g.fillRect(px - 3, base - 40, 7, 4);
        g.fillStyle = '#20242e'; g.fillRect(px - 4, base - 64, 9, 6); g.fillRect(px - 2, base - 67, 5, 3);
        const ang = t * 1.1 + i, facing = Math.cos(ang);
        this.pDot(g, px - 1, base - 62, '#fff6d0', 0.25 + 0.5 * Math.max(0, facing), 10 + 30 * Math.max(0, facing), 3, 2);
        g.save(); g.globalCompositeOperation = 'lighter';
        const len = 260, dirx = Math.sin(ang), spread = 0.06 + 0.25 * Math.abs(facing);
        const gr = g.createLinearGradient(px, 0, px + dirx * len, 0); gr.addColorStop(0, 'rgba(255,240,200,.32)'); gr.addColorStop(1, 'rgba(255,240,200,0)');
        g.fillStyle = gr; g.beginPath(); g.moveTo(px, base - 62); g.lineTo(px + dirx * len, base - 62 - len * spread * 0.4); g.lineTo(px + dirx * len, base - 62 + len * spread * 0.4); g.fill(); g.restore();
      });
      { // il traghetto: scafo scuro, due file di oblò accesi, riflesso sull'acqua
        const fx = ((t * 6 - dist * 0.025) % (W + 300) + W + 300) % (W + 300) - 150, fy = 176;
        g.fillStyle = '#0a0c18'; g.fillRect(Math.round(fx), fy - 6, 70, 6); g.fillRect(Math.round(fx) + 14, fy - 11, 40, 5); g.fillRect(Math.round(fx) + 30, fy - 15, 6, 4);
        for (let q = 0; q < 14; q++) { g.fillStyle = q % 5 ? '#ffe2a0' : '#9fd8ff'; g.fillRect(Math.round(fx) + 4 + q * 4.6, fy - 4, 2, 1); if (q < 8) g.fillRect(Math.round(fx) + 17 + q * 4.5, fy - 9, 2, 1); }
        this.pDot(g, fx + 70, fy - 5, '#3aff6a', 0.1, 4); this.pDot(g, fx, fy - 5, '#ff3a2a', 0.1, 4); this.light(g, fx + 35, fy - 6, 50, 10, '#ffd890', 0.05, 3);
        g.fillStyle = 'rgba(255,220,150,.18)'; for (let r = 1; r < 7; r++) g.fillRect(Math.round(fx) + 6 + Math.round(Math.sin(t * 3 + r) * 2), fy + r * 2, 58, 1);
      }
      return;
    }

    if (bg === 'mountain') {
      // Hakone: le luci di un paese a valle, i tornanti dall'altra parte con le auto, l'antenna col lampeggiante rosso
      this.pHorizon(g, 200, '255,160,90', 0.1);
      this.tileRun(dist * 0.03, 700, (i, x) => {
        if (rnd(i * 3.3) < 0.3) return;
        const cx = x + 300; for (let q = 0; q < 22; q++) this.pDot(g, cx + (rnd(i * 13 + q) - 0.5) * 120, 196 + rnd(i * 19 + q) * 8, rnd(q + i) < 0.7 ? '#ffc070' : '#d8e8ff', q % 4 ? 0 : 0.05, 3);
        // tornanti: una strada a zig-zag sul fianco, e due auto che salgono
        const sx = cx + 120, pts = [[0, 0], [50, -10], [0, -20], [50, -30], [0, -40]];
        g.fillStyle = 'rgba(90,96,130,.5)'; g.beginPath(); for (let s = 0; s < pts.length - 1; s++) { const [ax, ay] = pts[s], [bx, by] = pts[s + 1]; for (let u = 0; u <= 25; u++) g.rect(Math.round(sx + ax + (bx - ax) * u / 25), Math.round(196 + ay + (by - ay) * u / 25), 1, 1); } g.fill();
        for (let c = 0; c < 2; c++) { const f = ((t * 0.08 + c * 0.5 + rnd(i)) % 1) * (pts.length - 1), s = Math.floor(f), u = f - s, [ax, ay] = pts[s], [bx, by] = pts[s + 1]; this.pDot(g, sx + ax + (bx - ax) * u, 196 + ay + (by - ay) * u - 1, c ? '#ff4a3a' : '#fff2c8', 0.1, 4, 2, 1); }
      });
      this.tileRun(dist * 0.03, 900, (i, x) => {   // antenna sulla cresta
        if (rnd(i * 8.8) < 0.5) return; const ax = x + 450, top = 150;
        g.fillStyle = '#121626'; g.beginPath(); for (let y = top; y < 184; y++) { const w = Math.round((y - top) * 0.12); g.rect(ax - w, y, 1, 1); g.rect(ax + w, y, 1, 1); } g.rect(ax, top - 6, 1, 6); g.fill();
        if (Math.floor(t * 1.4 + i) % 2) { this.pDot(g, ax - 1, top - 8, '#ff3a2a', 0.25, 7, 2, 2); this.pDot(g, ax - 1, top + 14, '#ff3a2a', 0.12, 4, 2, 1); }
      });
      return;
    }

    if (bg === 'desert') {
      // Route 66: il treno merci sull'orizzonte col faro, la torre radio, il bagliore rosa lontano, auto sulla statale vecchia
      this.pHorizon(g, 198, '255,120,160', 0.12);
      { const len = 520, tx = ((t * 14 - dist * 0.04) % (W + len + 200) + W + len + 200) % (W + len + 200) - len, y = 199;
        g.fillStyle = '#0c0810'; g.fillRect(Math.round(tx), y - 5, len, 5); g.fillRect(Math.round(tx + len - 26), y - 8, 22, 3);
        for (let c = 0; c < len - 30; c += 13) { g.fillStyle = '#16101a'; g.fillRect(Math.round(tx + c), y - 6, 11, 1); }
        this.pDot(g, tx + len + 1, y - 4, '#fff6d0', 0.3, 14, 2, 2);
        g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(tx + len, 0, tx + len + 160, 0); gr.addColorStop(0, 'rgba(255,240,200,.25)'); gr.addColorStop(1, 'rgba(255,240,200,0)');
        g.fillStyle = gr; g.beginPath(); g.moveTo(tx + len + 2, y - 4); g.lineTo(tx + len + 160, y - 10); g.lineTo(tx + len + 160, y + 2); g.fill(); g.restore();
        this.pDot(g, tx + 1, y - 3, '#ff3a2a', 0.08, 4);
      }
      this.tileRun(dist * 0.015, 800, (i, x) => {
        if (rnd(i * 7.7) < 0.4) return; const ax = x + 400, top = 120;
        g.fillStyle = '#1a1018'; g.beginPath(); for (let y = top; y < 196; y++) { const w = Math.round((y - top) * 0.08); g.rect(ax - w, y, 1, 1); g.rect(ax + w, y, 1, 1); if ((y - top) % 9 === 0) g.rect(ax - w, y, w * 2, 1); } g.fill();
        if (Math.floor(t * 1.1 + i) % 2) for (const yy of [top - 2, top + 30, top + 56]) this.pDot(g, ax - 1, yy, '#ff3a2a', 0.18, 6, 2, 2);
      });
      this.pFarCars(g, 203, dist, t, 3, 0.9, 41);
      // cartelloni lungo la statale, lontani dal motel (che sta a 700 m ogni 1,6 km)
      this.pBillboards(g, 'desert', 222, R, t, 190, PB_SKIP_DESERT);
      return;
    }

    if (bg === 'highway') {
      // Wangan: i grattacieli dall'altra parte della baia coi lampeggianti rossi sui tetti
      this.pHorizon(g, 172, '255,120,200', 0.12);
      this.tileRun(dist * 0.025, 90, (i, x) => { if (rnd(i * 2.2) < 0.55) return; if (Math.floor(t * 0.9 + i * 0.37) % 2) this.pDot(g, x + rnd(i) * 60, 120 + rnd(i + 3) * 40, '#ff3a3a', 0.14, 5, 1, 1); });
    }
  };

  // catarifrangenti sulle strisce fuori città: si accendono quando li prendono i fari (davanti all'auto)
  S.pStuds = function (g, dist, PPM, carX, night) {
    if (night < 0.4) return;
    for (let x = -((dist * PPM) % (12 * PPM)); x < this.LW; x += 12 * PPM) {
      const d = x - carX, lit = d > 30 && d < 360 ? Math.max(0, 1 - Math.abs(d - 150) / 210) : 0;
      for (const y of [262, 300]) { g.fillStyle = lit > 0.05 ? '#ffe08a' : '#8a7a50'; g.fillRect(Math.round(x) - 2, y, 2, 2); if (lit > 0.05) this.light(g, x - 1, y + 1, 4 + lit * 5, 3, '#ffd060', 0.12 * lit * night, 2); }
    }
  };
})();
