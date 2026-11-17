// ============================================================================
//  Effetti della vista 2D (si aggancia a Street2D, come viaggio2d.js):
//  fumo a sbuffi in pixel art illuminato da lampioni, stop e fiammate; fiammata dello scarico a bande
//  di colore con lingue che scorrono; scintille che rimbalzano; ombre delle auto proiettate dai lampioni;
//  fascio dei fari sfumato a retino; luci che scorrono sulla carrozzeria; asfalto con grana, tracce e rattoppi.
//  Tutto resta a pixel netti: le sfumature sono a bande con retino (matrice di Bayer), niente sfocature.
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, rnd = Street2D.rnd, PPM = 30;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // rumore morbido a una e due dimensioni (deterministico)
  const vn = (x) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return rnd(i) * (1 - u) + rnd(i + 1) * u; };
  const vn2 = (x, y, per) => {
    const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const h = (a, b) => rnd(((a % per) + per) % per * 1.31 + b * 57.7);
    return (h(ix, iy) * (1 - ux) + h(ix + 1, iy) * ux) * (1 - uy) + (h(ix, iy + 1) * (1 - ux) + h(ix + 1, iy + 1) * ux) * uy;
  };

  // ---------------------------------------------------------------- sbuffi di fumo (sprite in cache)
  // Tre toni per sbuffo (ombra sotto, mezzo, luce sopra). I toni "lit_" si disegnano sopra, trasparenti,
  // quando lo sbuffo passa vicino a una luce: lampione, stop, fiammata.
  const TONES = {
    tyre: [[74, 80, 112], [122, 129, 160], [170, 176, 200]],
    exhaust: [[40, 43, 58], [62, 66, 84], [88, 93, 112]],
    steam: [[104, 114, 150], [134, 144, 178], [160, 168, 198]],
    soot: [[18, 19, 28], [32, 34, 46], [50, 53, 66]],
    mist: [[80, 96, 134], [108, 124, 160], [138, 152, 186]],
    lit_warm: [[150, 110, 70], [210, 160, 100], [250, 206, 140]],
    lit_fire: [[170, 60, 16], [240, 120, 28], [255, 190, 80]],
    lit_red: [[120, 16, 24], [190, 30, 40], [240, 70, 64]],
  };
  // tipi di particella a sbuffo: durata, crescita, opacità, velocità di salita, freno dell'aria, tono
  const KIND = {
    tyre: { rate: 0.7, gr: 12, a: 0.6, rise: -11, drag: 1.7, tone: 'tyre' },
    smoke: { rate: 0.8, gr: 16, a: 0.42, rise: -11, drag: 1.7, tone: 'tyre' },
    puff: { rate: 1.4, gr: 7, a: 0.4, rise: -9, drag: 1.2, tone: 'exhaust' },
    steam: { rate: 0.6, gr: 6, a: 0.3, rise: -16, drag: 0, tone: 'steam' },
    soot: { rate: 1.0, gr: 10, a: 0.5, rise: -12, drag: 1.4, tone: 'soot' },
    mist: { rate: 1.7, gr: 20, a: 0.2, rise: -5, drag: 2.6, tone: 'mist' },
  };
  S.puffSprite = function (tone, r, v) {
    const SS = this.SS || 1, rq = Math.max(1, Math.min(34, r < 8 ? Math.round(r) : Math.round(r / 2) * 2)), key = tone + rq + '_' + v + '_' + SS;
    const P = Street2D._puffs || (Street2D._puffs = {});
    if (P[key]) return P[key];
    const N = (rq * 2 + 3) * SS, RR = rq * SS, c = document.createElement('canvas'); c.width = N; c.height = N; c.lw = rq * 2 + 3;
    const x = c.getContext('2d'), im = x.createImageData(N, N), d = im.data, T = TONES[tone] || TONES.tyre, cx = N / 2 - 0.5;
    // nuvoletta: un cerchio centrale e sei lobi attorno, diversi per ogni variante
    const lobes = [[0, 0, RR * 0.68]];
    for (let i = 0; i < 6 && rq > 2; i++) {
      const a = i / 6 * Math.PI * 2 + rnd(v * 17 + i) * 0.9, lr = RR * (0.32 + rnd(v * 7 + i * 3) * 0.2), dd = Math.min(RR - lr, RR * (0.4 + rnd(v * 31 + i) * 0.22));
      lobes.push([Math.cos(a) * dd, Math.sin(a) * dd, lr]);
    }
    for (let py = 0; py < N; py++) for (let px = 0; px < N; px++) {
      const dx = px - cx, dy = py - cx; let e = -9;
      for (const l of lobes) e = Math.max(e, l[2] - Math.hypot(dx - l[0], dy - l[1]));
      if (e < 0) continue;
      const by = Street2D.bayer(px, py);
      if (rq > 3 && e < 1.3 * SS && by < 0.42) continue;                         // bordo a retino, più morbido
      const sv = dy / RR * 0.85 + dx / RR * 0.2 + (by - 0.5) * 0.34;         // luce dall'alto
      const col = T[sv < -0.22 ? 2 : sv < 0.3 ? 1 : 0], i = (py * N + px) * 4;
      d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255;
    }
    x.putImageData(im, 0, 0);
    return (P[key] = c);
  };

  // ---------------------------------------------------------------- particelle
  // layer 0 = dietro l'auto (si disegnano prima della carrozzeria e qui si aggiornano tutte), layer 1 = davanti.
  S.fxParts = function (g, dt, wx, W, layer) {
    const E = this.fxEnv || {}, t = this.st.t, low = this.quality === 'bassa';
    if (layer === 0) {
      for (const p of this.parts) {
        if (p.k === 'shard') {
          p.life -= dt * p.rate; p.m += p.dx / PPM * dt; p.y += p.vy * dt; p.vy += 260 * dt;
          if (p.y >= p.gy) { p.y = p.gy; if (p.vy > 25) { p.vy *= -0.32; p.dx *= 0.55; } else { p.vy = 0; p.dx *= Math.exp(-7 * dt); } }
          continue;
        }
        if (p.k === 'spark' || p.k === 'spray') {
          p.pm = p.m; p.py = p.y;
          p.life -= dt * (p.rate || (p.k === 'spray' ? 2.6 : 1.5)); p.m += p.dx / PPM * dt; p.y += p.vy * dt; p.vy += (p.k === 'spark' ? 210 : 90) * dt;
          if (p.gy !== undefined && p.y > p.gy && p.vy > 0) { p.y = p.gy; p.vy *= -0.38; p.dx *= 0.6; }   // rimbalza sull'asfalto
        } else if (p.k === 'fire') {
          p.life -= dt * 3; p.m += p.dx / PPM * dt; p.y += p.vy * dt; p.vy -= 24 * dt; p.r += dt * 5;
        } else {
          const K = KIND[p.k] || KIND.tyre;
          p.life -= dt * (p.rate || K.rate);
          p.dx *= Math.exp(-K.drag * dt); p.m += p.dx / PPM * dt;
          p.vy += (K.rise - p.vy) * Math.min(1, dt * 1.5); p.y += p.vy * dt;
          p.r += (p.gr ?? K.gr) * dt * (0.35 + 0.65 * Math.max(0, p.life));    // si gonfia in fretta, poi rallenta
        }
      }
      this.parts = this.parts.filter((p) => p.life > 0 && wx(p.m) > -90 && wx(p.m) < W + 90);
      if (this.parts.length > (low ? 110 : 280)) this.parts.splice(0, this.parts.length - (low ? 110 : 280));
    }
    const night = 1 - (this.day || 0), lamps = E.lampX || [];
    for (const p of this.parts) {
      if ((p.layer ?? 1) !== layer) continue;
      const X = wx(p.m), Y = Math.round(p.y), L = Math.max(0, p.life);
      if (p.k === 'shard') {
        // frammento: un pixel o due; i vetri brillano quando prendono la luce
        g.globalAlpha = Math.min(1, L * 3); g.fillStyle = p.col; g.fillRect(X, Y, p.sz, 1);
        if (p.glint && ((t * 7 + p.m * 3) % 1) < 0.18) { g.fillStyle = '#ffffff'; g.fillRect(X, Y, 1, 1); }
        g.globalAlpha = 1; continue;
      }
      if (p.k === 'spark') {
        // scintilla: testa chiara e scia che va dal giallo al rosso scuro
        const X0 = wx(p.pm ?? p.m), Y0 = Math.round(p.py ?? p.y);
        g.fillStyle = L > 0.6 ? '#ff9a28' : L > 0.3 ? '#e8380c' : '#7a1c0c';
        for (let q = 1; q <= 3; q++) g.fillRect(Math.round(X + (X0 - X) * q / 3 * 1.6), Math.round(Y + (Y0 - Y) * q / 3 * 1.6), 1, 1);
        g.fillStyle = L > 0.6 ? '#fff4cc' : L > 0.3 ? '#ffc832' : '#ff7a14'; g.fillRect(X, Y, L > 0.5 ? 2 : 1, 1);
        continue;
      }
      if (p.k === 'spray') {
        g.fillStyle = `rgba(170,196,240,${0.55 * L})`; g.fillRect(X, Y, 2, 2); g.fillStyle = `rgba(236,244,255,${0.5 * L})`; g.fillRect(X, Y, 1, 1);
        continue;
      }
      if (p.k === 'fire') {
        // pallina di fuoco: bianca e gialla appena nata, poi arancio, rossa, e infine fuliggine
        if (L > 0.22) {
          const pal = L > 0.7 ? ['#ff7a14', '#ffc832', '#fff4cc'] : L > 0.45 ? ['#e8380c', '#ff7a14', '#ffc832'] : ['#8a1c0c', '#e8380c', null];
          g.fillStyle = pal[0]; this.span(g, X, Y, p.r, p.r); g.fillStyle = pal[1]; this.span(g, X, Y, p.r * 0.62, p.r * 0.62);
          if (pal[2]) { g.fillStyle = pal[2]; this.span(g, X, Y, p.r * 0.3, p.r * 0.3); }
        } else { g.globalAlpha = Math.min(0.5, L * 3); const sp = this.puffSprite('soot', p.r + 1, 0); g.drawImage(sp, X - (sp.lw >> 1), Y - (sp.lw >> 1), sp.lw, sp.lw); g.globalAlpha = 1; }
        continue;
      }
      const K = KIND[p.k] || KIND.tyre, v = p.v || 0;
      const a = Math.min(1, (1 - L) * 9 + 0.3) * Math.min(1, L * 1.7) * (p.a ?? K.a);
      if (a < 0.012) continue;
      const Xw = X + Math.round(Math.sin(t * 1.6 + p.m * 2.3) * Math.min(3, p.r * 0.12));     // l'aria lo muove appena
      const sp = this.puffSprite(K.tone, p.r, v), dx0 = Xw - (sp.lw >> 1), dy0 = Y - (sp.lw >> 1), lw0 = sp.lw;
      g.globalAlpha = a; g.drawImage(sp, dx0, dy0, lw0, lw0);
      if (!low && p.r >= 3) {
        // il fumo prende la luce di quello che ha vicino
        let lw = 0; for (const lx of lamps) lw = Math.max(lw, 1 - Math.abs(Xw - (lx + 18)) / 80);
        lw *= night * 0.55 * clamp((250 - Y) / 60 + 0.9, 0.5, 1);
        if (lw > 0.04) { g.globalAlpha = a * lw; g.drawImage(this.puffSprite('lit_warm', p.r, v), dx0, dy0, lw0, lw0); }
        if (E.fa > 0.05) { const f = (1 - Math.hypot(Xw - E.fx, (Y - E.fy) * 1.4) / 80) * Math.min(1, E.fa); if (f > 0.04) { g.globalAlpha = Math.min(1, a * f * 1.5); g.drawImage(this.puffSprite('lit_fire', p.r, v), dx0, dy0, lw0, lw0); } }
        if (E.ba > 0.05) { const f = (1 - Math.hypot(Xw - E.bx, (Y - E.by) * 1.3) / 60) * E.ba * night; if (f > 0.04) { g.globalAlpha = a * f * 0.8; g.drawImage(this.puffSprite('lit_red', p.r, v), dx0, dy0, lw0, lw0); } }
      }
      g.globalAlpha = 1;
    }
  };

  // ---------------------------------------------------------------- fiammata dello scarico
  // Bande di colore piene (rosso, arancio, giallo, bianco) con il contorno che ondeggia: le lingue nascono
  // alla bocca e scorrono verso la punta, la fiamma sale un po' e si sfrangia in fondo.
  // aria calda dietro la marmitta: lo sfondo tremola a righe (copiato e rimesso spostato di poco, riga per riga).
  // Più forte a motore caldo e su di giri, al limitatore e con le fiammate; il vento della corsa la porta via.
  S.fxHaze = function (g, rx, exY, s, st, k) {
    if (!s.running) { st.haze = Math.max(0, (st.haze || 0) - 0.02); if (st.haze < 0.02) return; }
    const v = Math.abs(s.v || 0), load = Math.min(1, (s.rpm || 0) / 6000) * (0.4 + 0.6 * (s.thr || 0));
    const tgt = s.running ? (0.25 + 0.75 * load + Math.min(1, st.flame || 0)) * Math.max(0.15, 1 - v / 22) * ((s.waterT ?? 85) > 60 ? 1 : 0.5) : 0;
    st.haze = (st.haze || 0) + (tgt - (st.haze || 0)) * 0.08;
    const a = st.haze; if (a < 0.03) return;
    const m = g.getTransform(), W = Math.round(46 * k), H = Math.round(18 * k), x0 = rx - W, y0 = exY - H + Math.round(3 * k);
    const dx = Math.round(m.a * x0 + m.e), dy = Math.round(m.d * y0 + m.f), dw = Math.round(m.a * W), dh = Math.round(m.d * H);
    if (dw < 4 || dh < 4 || dx < 0 || dy < 0 || dx + dw > g.canvas.width || dy + dh > g.canvas.height) return;
    const T = this._hz || (this._hz = document.createElement('canvas'));
    if (T.width !== dw || T.height !== dh) { T.width = dw; T.height = dh; }
    const tx = T.getContext('2d'); tx.clearRect(0, 0, dw, dh); tx.drawImage(g.canvas, dx, dy, dw, dh, 0, 0, dw, dh);
    const t = this.st.t, step = Math.max(1, Math.round(m.d)), amp = 1.6 * a * m.a;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = false;
    for (let y = 0; y < dh; y += step) {
      const f = y / dh, ramp = Math.sin(Math.PI * f) * (0.4 + 0.6 * (1 - Math.abs((dw * 0.6) / dw - 0.6)));   // più forte al centro della colonna
      const off = Math.round(Math.sin(t * 23 + y * 0.55 / step) * amp * ramp + Math.sin(t * 9 - y * 0.21 / step) * amp * 0.5 * ramp);
      if (off) g.drawImage(T, 0, y, dw, step, dx + off, dy + y, dw, step);
    }
    g.restore();
  };

  S.fxFlame = function (g, rx, exY, k, fl, y0) {
    const t = this.st.t, f = Math.min(1.5, fl), big = f > 0.85;
    const L = Math.max(8, Math.round((18 + f * 44) * k * (0.82 + 0.36 * vn(t * 31)))), H0 = (3.4 + f * 4.2) * k, fr = Math.floor(t * 30);
    const SS = this.SS || 1, u1 = 1 / SS, rq = (v) => Math.round(v * SS) / SS;                   // densità doppia: colonne e altezze a mezze unità
    const cols = [];
    for (let i = 0; i < L; i += u1) {
      const u = i / L, env = (u < 0.14 ? 0.55 + u / 0.14 * 0.45 : 1) * Math.pow(1 - u, 0.7);
      const half = H0 * env * (0.78 + 0.44 * vn(i * 0.2 - t * 15));
      cols.push([rx - 1 - i, exY - u * u * 9 * k * (0.6 + 0.4 * f) + Math.sin(i * 0.5 - t * 26) * 0.9 * u * k,
        half * (0.8 + 0.5 * vn(i * 0.3 - t * 19 + 40)), half * (0.62 + 0.36 * vn(i * 0.26 - t * 13 + 90)), u]);
    }
    g.fillStyle = 'rgba(110,18,8,.7)';                                           // contorno scuro: stacca la fiamma dallo sfondo
    for (const c of cols) { const y1 = rq(c[1] - c[2]), y2 = rq(c[1] + c[3]); if (y2 - y1 >= 2) g.fillRect(c[0], y1 - u1, u1, y2 - y1 + 2 * u1); }
    const band = (col, sz, taper) => {
      g.fillStyle = col;
      for (const c of cols) {
        const m = sz * Math.max(0, 1 - c[4] * taper), y1 = rq(c[1] - c[2] * m), y2 = rq(c[1] + c[3] * m);
        if (y2 - y1 >= u1) g.fillRect(c[0], y1, u1, y2 - y1);
        else if (sz === 1 && rnd(c[0] * 3.1 + fr) < 0.55) g.fillRect(c[0], y1, u1, u1);    // punta sfrangiata
      }
    };
    band('#e8380c', 1, 0); band('#ff7a14', 0.74, 0.25); band('#ffc832', 0.5, 0.6); band('#fff4cc', 0.27, 1.1);
    if (big) {
      // scoppi grossi: radice azzurra alla bocca e nodi bianchi lungo il getto
      g.fillStyle = '#a8e4ff'; for (const c of cols) if (c[4] < 0.16) g.fillRect(c[0], rq(c[1]), u1, 1);
      g.fillStyle = '#ffffff'; for (let n = 1; n <= 3; n++) { const c = cols[Math.round(n * 6.5 * k * SS)]; if (c && c[4] < 0.6) g.fillRect(c[0], rq(c[1]) - 1, 2, 2); }
    }
    for (const c of cols) if (c[4] > 0.35 && rnd(c[0] * 1.7 + fr * 3) < 0.13) {      // lingue che si staccano sopra
      g.fillStyle = c[4] > 0.7 ? '#e8380c' : '#ff7a14'; g.fillRect(c[0], rq(c[1] - c[2] - 2 - rnd(c[0] + fr) * 3 * k), u1 * 2, u1 * 2);
    }
    const a = Math.min(1, f);
    this.light(g, rx - L * 0.45, exY - 1, L * 0.95, H0 * 2.6 + 3, '#ff7a20', 0.13 * a, 3);        // alone
    this.light(g, rx - L * 0.4, y0 + 1, L * 1.2 + 16, 6, '#ff8a20', 0.24 * a, 4);                  // luce sull'asfalto
    return L;
  };

  // ---------------------------------------------------------------- ombre
  S.silOf = function (spr) {
    if (spr._sil) return spr._sil;
    const c = document.createElement('canvas'); c.width = spr.width; c.height = spr.height;
    const x = c.getContext('2d'); x.drawImage(spr, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = 'rgb(4,5,12)'; x.fillRect(0, 0, c.width, c.height);
    return (spr._sil = c);
  };
  // Ombra di un'auto: contatto scuro sotto la scocca, più la sagoma proiettata sull'asfalto da ogni lampione
  // vicino (si allunga e gira mentre gli passi sotto), dal sole di giorno, dalla luna dove non ci sono lampioni.
  // hg = altezza nello sprite della linea di terra.
  S.fxShadow = function (g, spr, left, y0, hg, cx, lampX) {
    const day = this.day || 0, night = 1 - day;
    this.shadow(g, cx, y0, spr.width * 0.45, 3, 0.5);
    if (this.quality === 'bassa' || !spr.getContext) return;
    const sil = this.silOf(spr);
    const cast = (sx, sy, a) => {
      if (a < 0.03) return;
      g.save(); g.globalAlpha = a; g.imageSmoothingEnabled = false;
      this.tf(g, 1, 0, -sx, -sy, left + sx * hg, y0 + sy * hg); g.drawImage(sil, 0, 0); g.restore();
    };
    if (day > 0.05) cast(0.5, 0.16, 0.36 * day * (this.rainOn ? 0.4 : 1));
    let any = false;
    for (const lx of lampX || []) {
      const d = cx - (lx + 18), w = 1 - Math.abs(d) / 520; if (w <= 0) continue;
      any = true; cast(clamp(d / 120, -1.4, 1.4), 0.2, 0.44 * w * w * night);
    }
    if (!any && night > 0.3) cast(0.3, 0.13, 0.2 * night);
  };

  // ---------------------------------------------------------------- fascio dei fari
  // Cono di luce a cinque livelli con retino: forte al faro, si spegne in lunghezza e ai bordi.
  S.beamSprite = function (len, up, dn) {
    len = Math.round(len / 10) * 10; up = Math.round(up); dn = Math.round(dn);
    const SS = this.SS || 1, key = 'beam' + len + '_' + up + '_' + dn + '_' + SS, B = Street2D._beams || (Street2D._beams = {});
    if (B[key]) return B[key];
    const H = up + dn + 6, c = document.createElement('canvas'); c.width = len * SS; c.height = H * SS; c.oy = up + 3; c.lw = len; c.lh = H;
    const x = c.getContext('2d'), im = x.createImageData(len * SS, H * SS), d = im.data;
    for (let px = 0; px < len * SS; px++) {
      const u = px / (len * SS), top = c.oy - 2 - up * u, bot = c.oy + 2 + dn * u;
      for (let py = Math.max(0, Math.floor(top * SS)); py < Math.min(H, bot) * SS; py++) {
        const v = (py / SS - top) / (bot - top), e = Math.min(v, 1 - v) * 2, soft = e < 0.5 ? (e / 0.5) * (e / 0.5) * (3 - 2 * e / 0.5) : 1;
        const I = Math.pow(1 - u, 1.25) * soft * (0.6 + 0.4 * (1 - v));
        const q = Math.min(5, Math.floor(I * 5 + Street2D.bayer(px, py)));
        if (!q) continue;
        const i = (py * len * SS + px) * 4; d[i] = 255; d[i + 1] = 240; d[i + 2] = 200; d[i + 3] = q * 36;
      }
    }
    x.putImageData(im, 0, 0);
    return (B[key] = c);
  };
  S.fxBeam = function (g, fx, fy, len, dn, a) {
    if (a < 0.02) return;
    const sp = this.beamSprite(len, 5, dn);
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = Math.min(1, a); g.drawImage(sp, Math.round(fx), Math.round(fy) - sp.oy, sp.lw, sp.lh); g.restore();
  };

  // ---------------------------------------------------------------- luci sulla carrozzeria
  // Le luci si disegnano su una tela d'appoggio, si ritagliano sulla sagoma dell'auto e si sommano allo sprite:
  // così il lampione, lo stop e la fiammata illuminano solo la lamiera e non l'aria attorno.
  // lights: { x, w, a } striscia verticale (riflesso del lampione) oppure { x, y, r, col, a } alone tondo. Coordinate dello sprite.
  S.fxBodyLight = function (g, spr, lights) {
    if (!lights.length || !spr.getContext) return;
    const c = this._lit || (this._lit = document.createElement('canvas')), w = spr.width, h = spr.height;
    if (c.width < w || c.height < h) { c.width = Math.max(c.width, w); c.height = Math.max(c.height, h); }
    const x = c.getContext('2d');
    x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, w, h); x.globalCompositeOperation = 'lighter';
    for (const l of lights) {
      if (l.r) {
        const gr = x.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r); gr.addColorStop(0, `rgba(${l.col},${l.a})`); gr.addColorStop(1, `rgba(${l.col},0)`);
        x.fillStyle = gr; x.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2);
      } else {
        // riflesso del lampione: una fascia larga e tenue su tutta la fiancata e una lama stretta sul tetto e sui vetri
        const lc = l.col || '255,214,150', band = (hw, a, y1) => { const gr = x.createLinearGradient(l.x - hw, 0, l.x + hw, 0); gr.addColorStop(0, `rgba(${lc},0)`); gr.addColorStop(0.5, `rgba(${lc},${a})`); gr.addColorStop(1, `rgba(${lc},0)`); x.fillStyle = gr; x.fillRect(l.x - hw, 0, hw * 2, y1); };
        band(l.w, l.a * 0.5, h); band(l.w * 0.3, l.a, h * 0.5);
      }
    }
    x.globalCompositeOperation = 'destination-in'; x.drawImage(spr, 0, 0);
    g.save(); g.globalCompositeOperation = 'lighter'; g.drawImage(c, 0, 0, w, h, 0, 0, w, h); g.restore();
  };

  // ---------------------------------------------------------------- effetti dell'auto del giocatore
  // Segni di gomma, fumo dalle ruote motrici, spruzzi, scintille, scoppi e fiammate. c = posizioni calcolate in update().
  S.fxCar = function (g, dt, s, game, c) {
    const st = this.st, { left, SW, k, y0, GE, carX, dist, rx, exY, top } = c, R = Math.random, low = this.quality === 'bassa';
    const mOf = (px) => dist + (px - carX) / PPM, v = Math.abs(s.v), spin = s.spin || 0;
    const drv = s.fwd ? 1 : 0, wD = left + GE.ax[drv] * k, wO = left + GE.ax[1 - drv] * k;   // ruota motrice e l'altra
    const emit = (key, rate, fn) => { st[key] = (st[key] || 0) + rate * dt; let n = 0; while (st[key] >= 1 && n++ < 8) { st[key] -= 1; fn(); } if (st[key] > 1) st[key] = 0; };
    // ruote bloccate (auto senza ABS): lo dice la fisica, asse per asse. Con l'ABS al lavoro restano segni leggeri a tratti
    const lock = !!s.locked && v > 1, absMk = !!s.abs && v > 6 && (st.t * 9) % 1 < 0.55;
    // segni di gomma: dalle ruote motrici quando pattinano, dalle ruote bloccate quando strisciano
    if (((s.skid || 0) > 0.18 && v > 0.3) || lock || absMk) {
      const len = Math.max(0.15, v * dt * 1.05 + 0.05), a = lock ? Math.min(0.7, 0.3 + (s.skid || 0.5)) : absMk && !((s.skid || 0) > 0.18) ? 0.14 : Math.min(0.7, 0.25 + (s.skid || 0.5));
      const ws = lock ? [s.lockF ? (s.fwd ? wD : wO) : null, s.lockR ? (s.fwd ? wO : wD) : null].filter((x) => x !== null) : absMk ? [wD, wO] : [wD];
      for (const wxp of ws) { const m = mOf(wxp) - len; this.marks.push({ m, y: y0 - 1, len, a }, { m, y: y0 - 4, len, a: a * 0.6 }); }
    }
    // fumo delle gomme: sbuffi piccoli e fitti che il battistrada lancia indietro, più grossi quando pattina forte
    const tyre = (wxp, pow, big) => this.parts.push({ k: 'tyre', m: mOf(wxp - (4 + R() * 12) * k), y: y0 - 2 - R() * 5, dx: v * PPM * 0.06 - (24 + R() * 50) * (0.5 + pow),
      vy: -(5 + R() * 14), r: (big ? 6 : 3) + R() * 3, gr: (big ? 17 : 10) + R() * 8, life: 1, rate: (big ? 0.45 : 0.7) + R() * 0.3, a: 0.5 + 0.22 * pow, layer: R() < 0.3 ? 0 : 1, v: (R() * 3) | 0 });
    if (spin > 0.12) { emit('eSmk', (low ? 4 : 7) + spin * (low ? 8 : 15), () => tyre(wD, spin, false)); if (spin > 0.5) emit('eBig', 3.5 * spin, () => tyre(wD, spin, true)); }
    if (lock) emit('eLock', low ? 5 : 9, () => tyre(R() < 0.5 ? wD : wO, 0.25, false));
    if (st.launch > 0.6) emit('eLaunch', 5, () => tyre(wD, 0.4, true));
    // bagnato: nebbiolina d'acqua dietro le ruote quando piove; spruzzi passando sulle pozzanghere (5 m ogni 61)
    if (this.rainOn && v > 6) emit('eMist', Math.min(low ? 12 : 30, v * 0.9), () => this.parts.push({ k: 'mist', m: mOf((R() < 0.5 ? wD : wO) - (8 + R() * 8) * k), y: y0 - 3 - R() * 7, dx: v * PPM * 0.22, vy: -6 - R() * 10, r: 3 + R() * 3, life: 1, layer: R() < 0.4 ? 0 : 1, v: (R() * 3) | 0 }));
    const wet = ((dist % 61) + 61) % 61 < 5;
    if ((wet || this.rainOn) && v > 12) emit('eSpray', Math.min(60, (v - 12) * (wet ? 3 : 1)), () => this.parts.push({ k: 'spray', m: mOf((R() < 0.5 ? wD : wO) - 14 * k), y: y0 - 2 - R() * 4, vy: -14 - R() * 22, dx: v * PPM * 0.5 - 30 - R() * 60, life: 1, gy: y0 }));
    // urti: scintille dal punto di contatto (muso, coda o fianco), lampo, pezzi di vetro e plastica che cadono e restano sull'asfalto
    if (game) for (const f of game.fx) {
      if (f.k !== 'crash' && !(f.k === 'scrape' && f.I)) continue;
      const kind = f.k === 'scrape' ? 'side' : f.kind || 'front', I = Math.min(1.5, f.I || 0.8);
      const cx = kind === 'front' ? left + SW : kind === 'rear' ? left : left + SW * (0.3 + R() * 0.4), dir = kind === 'rear' ? -1 : 1;
      this.hitFx = { kind, I, t: kind === 'side' ? 0.45 : 0.3, cx: cx - carX, dir };
      st.hitFlash = Math.min(1, 0.5 + 0.4 * I);
      if (kind !== 'side') {
        const n = Math.round((low ? 8 : 18) * Math.min(1.4, 0.4 + I));
        for (let q = 0; q < n; q++) {
          const r = R(), glass = r < 0.45, paint = !glass && r < 0.7;
          this.parts.push({ k: 'shard', m: mOf(cx + (R() - 0.5) * 6), y: y0 - 8 - R() * 18, vy: -30 - R() * 90 * I, dx: v * PPM * (0.92 + R() * 0.12) + dir * (10 + R() * 60),
            life: 1, rate: 0.12 + R() * 0.1, gy: y0 - R() * 6, col: glass ? (R() < 0.5 ? '#cfe8ff' : '#8fb4d8') : paint ? (this.paintHex || '#c03030') : R() < 0.5 ? '#1c1d22' : '#ff4a2a', sz: R() < 0.25 ? 2 : 1, glint: glass });
        }
      }
    }
    if (this.hitFx && this.hitFx.t > 0) {
      const H = this.hitFx; H.t -= dt;
      const cx = carX + H.cx + (H.kind === 'side' ? (R() - 0.5) * SW * 0.3 : 0);
      emit('eCrash', H.kind === 'side' ? 110 : 160 * Math.min(1.3, H.I), () => this.parts.push({ k: 'spark', m: mOf(cx), y: y0 - (H.kind === 'side' ? 6 + R() * 10 : 10 + R() * 20), vy: -40 - R() * 80,
        dx: v * PPM * (H.kind === 'side' ? 0.8 : 0.9) + H.dir * (20 + R() * 90) - (H.kind === 'side' ? 40 + R() * 50 : 0), life: 1, rate: 1.6 + R(), gy: y0 }));
    }
    st.hitFlash = Math.max(0, (st.hitFlash || 0) - dt * 7);
    if (st.hitFlash > 0.03 && this.hitFx) this.light(g, carX + this.hitFx.cx, y0 - 14, 60 * st.hitFlash, 22, '#fff0c8', 0.35 * st.hitFlash, 3);   // lampo nel punto d'urto
    // scoppiettii: ogni scoppio accende la fiammata e lancia scintille e uno sbuffo di fuliggine
    st.flame = Math.max(0, st.flame - dt * 8);
    st.popFlash = Math.max(0, (st.popFlash || 0) - dt * 6);
    if (s.flame && R() < s.flame * dt * 22) {
      const big = R() < 0.35 + s.flame * 0.3;
      st.flame = big ? 1.1 + R() * 0.4 : 0.6 + R() * 0.4; st.popFlash = big ? 1 : 0.55; st.popJolt = big ? 1.2 : 0.5;
      for (let q = 0; q < (big ? 5 : 2); q++) this.parts.push({ k: 'spark', m: mOf(rx), y: exY + (R() - 0.5) * 4, vy: -10 - R() * 70, dx: v * PPM * 0.5 - 40 - R() * 110, life: 1, rate: 1.2 + R() * 1.2, gy: y0 });
      this.parts.push({ k: 'soot', m: mOf(rx - 12), y: exY - 2, vy: -8 - R() * 8, r: 2.5 + R() * 2, life: 1, dx: v * PPM * 0.2 - 24, v: (R() * 3) | 0 });
    }
    if (st.flame > 0.05) {
      const L = this.fxFlame(g, rx, exY, k, st.flame, y0), fl = Math.min(1.5, st.flame);
      if (R() < fl * dt * 14) this.parts.push({ k: 'fire', m: mOf(rx - L * (0.5 + R() * 0.5)), y: exY - (2 + R() * 4) * k, vy: -10 - R() * 16, dx: v * PPM * 0.4 - 50 - R() * 50, r: (2 + R() * 1.8) * k, life: 1 });
    }
    // anello d'urto alla bocca negli scoppi grossi; la punta cromata si arroventa
    st.ring = Math.max(0, (st.ring || 0) - dt * 5); st.tipHeat = Math.max(0, (st.tipHeat || 0) - dt * 0.6);
    if (st.flame > 1.05 && !(st.ringLock > st.t)) { st.ring = 1; st.ringLock = st.t + 0.25; st.tipHeat = Math.min(1, st.tipHeat + 0.35); }
    if (st.ring > 0.02) { const rr = (1 - st.ring) * 14 * k + 2; g.strokeStyle = `rgba(255,240,200,${st.ring * 0.8})`; g.lineWidth = 1; g.beginPath(); g.ellipse(rx - 2, exY, rr * 0.6, rr, 0, 0, Math.PI * 2); g.stroke(); }
    if (!low) this.fxHaze(g, rx, exY, s, st, k);
    if (st.tipHeat > 0.03) { g.fillStyle = `rgba(255,${120 + (1 - st.tipHeat) * 80 | 0},40,${st.tipHeat * 0.8})`; g.fillRect(rx, exY - Math.round(k), Math.max(2, Math.round(5 * k)), Math.max(1, Math.round(2 * k))); }
    if (st.popFlash > 0.02) this.light(g, rx - 20, y0, 70 * st.popFlash, 8, '#ff8a20', 0.22 * st.popFlash, 3);   // lampo sull'asfalto
    // scarico: sbuffi scuri al minimo, più radi in marcia
    if (s.running) emit('ePuff', s.rpm < 1500 ? 2.5 : 0.7, () => this.parts.push({ k: 'puff', m: mOf(rx), y: exY, vy: -5, r: 1.5 + R(), life: 1, dx: v * PPM * 0.3 - 12, v: (R() * 3) | 0 }));
    // auto molto danneggiata: vapore dal cofano, fumo nero quando è quasi distrutta
    const dmg = s.damage || 0;
    if (dmg > 0.45 && s.running && GE.head) emit('eSteam', (dmg - 0.35) * (low ? 8 : 16), () => this.parts.push({ k: dmg > 0.8 && R() < 0.6 ? 'soot' : 'steam', m: mOf(left + (GE.head[0] - 12 - R() * 14) * k), y: top + (GE.head[1] - 6) * k, vy: -12 - R() * 10, dx: v * PPM * 0.12, r: 2 + R() * 2, gr: 12, a: 0.42, life: 1, v: (R() * 3) | 0 }));
    // luci che il fumo può prendere: fiammata e stop
    this.fxEnv = { lampX: c.lampX, fx: rx - 18, fy: exY, fa: Math.max(st.popFlash || 0, st.flame > 0.05 ? Math.min(1, st.flame) : 0), bx: left, by: top + 30 * k, ba: s.brake > 0.05 ? 1 : s.ign ? 0.3 : 0 };
    this.fxParts(g, dt, c.wx, c.W, 1);
  };

  // ---------------------------------------------------------------- cielo
  // Il fondo si calcola una volta sola alla densità della tela: sfumatura a retino fine, velo di nebulosa,
  // stelle di grandezze e tinte diverse (più rade verso l'orizzonte, dove la città schiarisce il cielo),
  // luna con mari, crateri in rilievo e alone. Poi, a ogni fotogramma: stelle che brillano e nuvole a più piani.
  const SKY = [[0, 6, 6, 24], [0.35, 16, 14, 48], [0.62, 34, 26, 84], [0.82, 60, 40, 108], [1, 90, 56, 124]];
  const CRATERS = [[-0.35, -0.26, 0.26], [0.35, 0.43, 0.18], [0.43, -0.48, 0.13], [-0.13, 0.6, 0.12], [0.1, -0.05, 0.1], [-0.6, 0.3, 0.09], [0.62, 0.05, 0.08], [-0.05, -0.68, 0.08], [0.2, 0.76, 0.06]];
  S.skyBuild = function (W, H, SS, key) {
    const w = W * SS, h = H * SS, c = document.createElement('canvas'); c.width = w; c.height = h; c._k = key;
    const x = c.getContext('2d'), im = x.createImageData(w, h), d = im.data;
    const mx = (W - 90) * SS, my = 48 * SS, MR = 23 * SS;
    for (let py = 0; py < h; py++) {
      const t = py / (h - 1); let q = 0; while (q < SKY.length - 2 && t > SKY[q + 1][0]) q++;
      const A = SKY[q], B = SKY[q + 1], f = (t - A[0]) / (B[0] - A[0]), r0 = A[1] + (B[1] - A[1]) * f, g0 = A[2] + (B[2] - A[2]) * f, b0 = A[3] + (B[3] - A[3]) * f;
      const ly = py / SS;
      for (let px = 0; px < w; px++) {
        const lx = px / SS, by = Street2D.bayer(px, py);
        const dn = (ly - (36 + lx * 0.11)) / 34, neb = Math.exp(-dn * dn) * (0.25 + 0.75 * vn2(lx / 46, ly / 24, 64)) * (1 - t * 0.7);
        const md = Math.hypot(px - mx, py - my) / (62 * SS), halo = md < 1 ? (1 - md) * (1 - md) : 0;
        const i = (py * w + px) * 4, dq = (v) => Math.floor(v / 4 + by) * 4;             // retino fine: niente gradini
        d[i] = dq(r0 + neb * 16 + halo * 44); d[i + 1] = dq(g0 + neb * 10 + halo * 38); d[i + 2] = dq(b0 + neb * 34 + halo * 76); d[i + 3] = 255;
      }
    }
    // stelle fisse
    const N = Math.round(W * 1.1);
    for (let n = 0; n < N; n++) {
      const sx = Math.floor(rnd(n * 1.7 + 3) * w), sy = Math.floor(Math.pow(rnd(n * 2.3 + 11), 1.6) * 176 * SS), br = rnd(n * 3.1 + 7), tint = rnd(n * 5.3 + 1);
      if (Math.hypot(sx - mx, sy - my) < MR + 3 * SS) continue;
      const k = (0.3 + 0.7 * br * br) * (1 - sy / (200 * SS)), col = tint < 0.25 ? [170, 185, 255] : tint > 0.85 ? [255, 222, 190] : [226, 230, 255];
      const put = (xx, yy, kk) => { if (xx < 0 || yy < 0 || xx >= w || yy >= h) return; const i = (yy * w + xx) * 4; for (let ch = 0; ch < 3; ch++) d[i + ch] = Math.min(255, d[i + ch] + col[ch] * kk); };
      put(sx, sy, k);
      if (br > 0.93 && SS > 1) { put(sx + 1, sy, k * 0.5); put(sx - 1, sy, k * 0.5); put(sx, sy + 1, k * 0.5); put(sx, sy - 1, k * 0.5); }
    }
    // luna
    for (let yy = -MR; yy <= MR; yy++) for (let xx = -MR; xx <= MR; xx++) {
      const nx = xx / MR, ny = yy / MR, rr = nx * nx + ny * ny; if (rr > 1) continue;
      let L = 1 - 0.16 * rr - clamp((nx + ny) * 0.5 + 0.15, 0, 1) * 0.2, R = 255, G = 243, B = 206;
      if (vn2(nx * 2.6 + 9, ny * 2.6 + 4, 64) > 0.55) { L *= 0.9; G -= 6; B -= 14; }                    // mari
      for (const cr of CRATERS) {
        const dx = nx - cr[0], dy = ny - cr[1], dd = Math.hypot(dx, dy) / cr[2];
        if (dd < 1) { L *= dd > 0.72 ? ((dx + dy) > 0 ? 1.07 : 0.84) : 0.9; }                             // bordo in luce e in ombra, fondo più scuro
      }
      if (rr > 0.93) L *= 0.86;
      L = Math.round(L * 12) / 12;                                                                        // pochi toni netti
      const i = ((my + yy) * w + mx + xx) * 4; if (i < 0 || mx + xx < 0 || mx + xx >= w) continue;
      d[i] = clamp(R * L, 0, 255); d[i + 1] = clamp(G * L, 0, 255); d[i + 2] = clamp(B * L, 0, 255);
    }
    x.putImageData(im, 0, 0);
    return c;
  };
  // nuvola a tre toni: corpo scuro, dorso schiarito dalla luna, pancia tinta dalle luci della città
  // nuvola notturna: un velo morbido fatto di tanti sbuffi sfumati, scuro, col bordo di sopra schiarito dalla luna
  // e la pancia appena tinta dalle luci di sotto (niente contorni netti: di notte le nuvole non hanno bordi)
  S.cloudHD = function (k, SS) {
    const w = 110 + k * 30, hh = 34;
    return this.sprite(w * SS, hh * SS, (x) => {
      x.scale(SS, SS);
      const n = 14 + k * 3, blob = (cx, cy, rx, ry, rgb, a) => { x.save(); x.translate(cx, cy); x.scale(1, ry / rx); const gr = x.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(0.6, `rgba(${rgb},${a * 0.55})`); gr.addColorStop(1, `rgba(${rgb},0)`); x.fillStyle = gr; x.fillRect(-rx, -rx, rx * 2, rx * 2); x.restore(); };
      const pts = [];
      for (let i = 0; i < n; i++) { const u = (i + 0.5) / n, m = Math.sin(Math.PI * u); pts.push([8 + u * (w - 16) + (rnd(i * 3 + k) - 0.5) * 8, 20 - m * (6 + 5 * rnd(i * 5 + k)), 9 + 13 * m * (0.6 + 0.5 * rnd(i * 7 + k)), 4 + 4 * m]); }
      for (const [cx, cy, rx, ry] of pts) blob(cx, cy + 2, rx, ry + 1, '30,28,70', 0.55);          // corpo
      for (const [cx, cy, rx, ry] of pts) blob(cx, cy + 5, rx * 0.8, ry * 0.6, '70,40,90', 0.18);    // pancia tinta dalle luci di sotto
      x.globalCompositeOperation = 'source-atop';
      for (const [cx, cy, rx, ry] of pts) blob(cx - 2, cy - ry * 0.6, rx * 0.7, ry * 0.5, '150,150,210', 0.22);   // dorso illuminato dalla luna
    }, false);
  };
  S.skyHD = function (g, t, dist) {
    const W = this.LW, SS = this.SS || 1, H = 224, key = W + '_' + SS, u = 1 / SS;
    if (!this.skyCache || this.skyCache._k !== key) this.skyCache = this.skyBuild(W, H, SS, key);
    g.drawImage(this.skyCache, 0, 0, W, H);
    if (this.rainOn) {
      // pioggia: nuvole basse e cupe coprono luna e stelle
      g.fillStyle = '#1a1c2c'; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 18; i++) { const cx = ((i * 97 + t * 4) % (W + 160)) - 80, cy = 30 + (i % 5) * 26; g.fillStyle = i % 2 ? '#22253a' : '#262a40'; this.span(g, cx, cy, 70 + (i % 3) * 20, 16 + (i % 4) * 4); }
    } else {
      // stelle che brillano: un punto fine che si accende e ogni tanto fa la croce
      for (let i = 0; i < 70; i++) {
        const sx = Math.floor(rnd(i) * W), sy = Math.floor(rnd(i + 50) * 150), ph = Math.sin(t * (1.5 + rnd(i + 9) * 3) + i);
        if (ph < 0.3) continue;
        g.fillStyle = ph > 0.8 ? '#ffffff' : '#aab4f0'; g.fillRect(sx, sy, u, u);
        if (ph > 0.8 && i % 6 === 0) { g.fillStyle = 'rgba(200,210,255,.7)'; g.fillRect(sx - 2, sy, 4 + u, u); g.fillRect(sx, sy - 2, u, 4 + u); }
      }
    }
    const ck = 'cloudsHD' + SS;
    if (!this.spr[ck]) this.spr[ck] = [0, 1, 2, 3].map((k) => this.cloudHD(k, SS));
    // nuvole su più piani: le lontane piccole, lente e sbiadite, le vicine grandi
    const lay = [[3, 22, 0.5, 2, 0.55], [1, 44, 0.62, 3, 0.7], [0, 30, 0.8, 4, 0.85], [2, 66, 1, 5.5, 1], [1, 98, 0.9, 7, 0.9], [3, 120, 0.7, 4.5, 0.6]];
    lay.forEach(([k, y, sc, sp, al], n) => {
      const c = this.spr[ck][k], cw = c.width / SS * sc, span = W + 300, cx = ((-(t * sp) - dist * 0.03 * sc + n * 233) % span + span) % span - 150;
      g.globalAlpha = al * 0.85 * (this.rainOn ? 0.5 : 1); g.drawImage(c, Math.round(cx), y, cw, c.height / SS * sc);
    });
    g.globalAlpha = 1;
  };

  // ---------------------------------------------------------------- asfalto
  // Mattonella 512×104: grana a più toni, chiazze, tracce lisce e scure delle ruote in ogni corsia, colature
  // d'olio al centro, rattoppi, crepe sigillate col catrame e sassolini chiari che brillano.
  S.roadTile = function () {
    const SS = this.SS || 1, rk = 'road' + SS;
    if (this.spr[rk]) return this.spr[rk];
    const TW = 512, TH = 104, c = document.createElement('canvas'); c.width = TW * SS; c.height = TH * SS; c.lw = TW;
    const x = c.getContext('2d'), im = x.createImageData(TW * SS, TH * SS), d = im.data;
    const n0 = parseInt(this.C.road.slice(1), 16), R0 = n0 >> 16, G0 = (n0 >> 8) & 255, B0 = n0 & 255;
    const lanes = [14, 45, 82];                                              // centro delle tre corsie nella mattonella
    for (let hy = 0; hy < TH * SS; hy++) for (let hx = 0; hx < TW * SS; hx++) {
      const y = hy / SS, px = hx / SS, depth = y / TH; let f = 1.1 - 0.14 * depth, smooth = 0;
      for (const lc of lanes) for (const sgn of [-1, 1]) { const dd = Math.abs(y - (lc + sgn * (7 + depth * 2))); if (dd < 2.6) { const w = 1 - dd / 2.6; f -= 0.11 * w; smooth = Math.max(smooth, w); } }
      for (const lc of lanes) if (Math.abs(y - lc) < 2) f -= 0.07 * vn2(px / 8, lc, 64);
      f += (vn2(px / 16, y / 7, 32) - 0.5) * 0.2;                          // chiazze larghe
      const gr = rnd(hx * 12.9898 + hy * 78.233), amp = (1 - smooth * 0.6) * (SS > 1 ? 0.8 : 1);
      if (gr < 0.11) f -= 0.17 * amp; else if (gr > 0.89) f += 0.15 * amp;
      if (gr > 0.9955) f += 0.6;                                            // sassolino chiaro
      const i = (hy * TW * SS + hx) * 4;
      d[i] = clamp(R0 * f, 0, 255); d[i + 1] = clamp(G0 * f, 0, 255); d[i + 2] = clamp(B0 * f + (1 - depth) * 4, 0, 255); d[i + 3] = 255;
    }
    x.putImageData(im, 0, 0); x.scale(SS, SS);
    // rattoppi: asfalto più nuovo e più scuro, bordo sigillato
    const patch = (px, py, w, h, sd) => {
      x.fillStyle = '#1b1e30'; x.fillRect(px, py, w, h);
      for (let q = 0; q < w * h * 0.3; q++) { x.fillStyle = rnd(q + sd) > 0.5 ? '#161928' : '#22263a'; x.fillRect(px + Math.floor(rnd(q * 3 + sd) * w), py + Math.floor(rnd(q * 7 + sd) * h), 1, 1); }
      x.fillStyle = '#0f111b'; x.fillRect(px, py, w, 1); x.fillRect(px, py, 1, h); x.fillStyle = '#2c3148'; x.fillRect(px, py + h, w + 1, 1); x.fillRect(px + w, py, 1, h);
    };
    patch(140, 60, 56, 18, 11); patch(372, 8, 44, 13, 57); patch(300, 86, 30, 12, 91);
    // crepe sottili e crepe sigillate col catrame (più larghe e nere, lucide)
    const crack = (cx, cy, n, s0, tar) => {
      for (let q = 0; q < n; q++) {
        x.fillStyle = tar ? '#151828' : '#171a2b'; x.fillRect(cx, cy, 1, tar ? 2 : 1);
        if (tar && rnd(q + s0 + 5) > 0.8) { x.fillStyle = '#2c3148'; x.fillRect(cx, cy, 1, 1); }
        cx += 1; cy += rnd(q + s0) > 0.6 ? 1 : rnd(q + s0 + 9) > 0.66 ? -1 : 0;
        if (!tar && rnd(q + s0 + 3) > 0.9) x.fillRect(cx, cy + 1, 1, 2);
      }
    };
    crack(30, 16, 34, 40); crack(200, 88, 26, 60); crack(90, 70, 18, 80); crack(330, 40, 30, 23); crack(450, 70, 24, 71);
    crack(60, 36, 44, 5, true); crack(400, 52, 50, 47, true);
    // macchie d'olio al centro delle corsie, a retino
    const stain = (cx, cy, rx2, ry2) => { x.fillStyle = 'rgba(8,9,16,.55)'; for (let yy = -ry2; yy <= ry2; yy++) for (let xx = -rx2; xx <= rx2; xx++) { const e = (xx * xx) / (rx2 * rx2) + (yy * yy) / (ry2 * ry2); if (e < 1 && Street2D.bayer(cx + xx, cy + yy) > e * 0.9) x.fillRect(cx + xx, cy + yy, 1, 1); } };
    stain(96, 45, 9, 3); stain(286, 14, 7, 2); stain(430, 82, 11, 3); stain(214, 82, 6, 2);
    x.fillStyle = 'rgba(80,100,160,.08)'; x.fillRect(0, 0, TW, 4);
    return (this.spr[rk] = c);
  };
})();
