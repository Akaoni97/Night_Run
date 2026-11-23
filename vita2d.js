// ============================================================================
//  Night Run · Vita e giochi di luce nel 2D (dopo paesaggi2d.js)
//  Riempie il paesaggio di cose che si muovono e di luce, in tre strati che street2d.js chiama durante il disegno:
//  - vitaSky   (dietro i palazzi e i paesaggi): stormi di uccelli e scie d'aereo di giorno, fuochi d'artificio
//               sul mare, sui paesi e ogni tanto in città, lampi di calore lontani all'orizzonte fuori città.
//  - vitaRoad  (sull'asfalto, sotto auto e lampioni): foglie, cartacce e rotolacampo portati dal vento, che
//               l'auto in velocità solleva e si lascia dietro.
//  - vitaFront (dopo la penombra notturna, quindi luminosi): riflessi verticali di insegne e lampioni
//               sull'asfalto, scintille sul bagnato, falene intorno ai lampioni, lucciole nei campi,
//               raggi di sole al tramonto col pulviscolo, miraggio caldo sulla strada nel deserto.
//  Tutto deterministico dove possibile (Street2D.rnd), spento con la qualità bassa o sui dispositivi lenti.
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, rnd = Street2D.rnd;

  // alone tondo di un colore, in cache: si ridimensiona invece di creare una sfumatura per ogni puntino
  const halos = {};
  const halo = (rgb) => {
    if (halos[rgb]) return halos[rgb];
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas'); c.width = c.height = 32; const x = c.getContext('2d'), gr = x.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(0.3, `rgba(${rgb},.45)`); gr.addColorStop(1, `rgba(${rgb},0)`); x.fillStyle = gr; x.fillRect(0, 0, 32, 32);
    return (halos[rgb] = c);
  };
  // da chiamare con g in 'lighter'
  const glow = (g, x, y, r, rgb, a) => { const h = halo(rgb); if (!h || a < 0.01) return; g.globalAlpha = Math.min(1, a); g.drawImage(h, x - r, y - r, r * 2, r * 2); g.globalAlpha = 1; };
  const off = (v) => v.quality === 'bassa' || v.noVita;   // noVita: Prestazioni (prestazioni.js)

  // ---------------------------------------------------------------- cielo
  const R0 = (v, e) => v * (1 - Math.exp(-2.4 * e)), drop0 = (e) => 9 * e * e;
  S.vitaSky = function (g, dist, t, bg) {
    if (off(this)) return;
    const W = this.LW, day = this.day || 0, ss = this.sunset || 0, night = 1 - day, rain = !!this.rainOn;
    // stormi: una V di uccelli che batte le ali; di giorno grigi, al tramonto neri controluce
    if (!rain && (day > 0.25 || ss > 0.25)) {
      const vis = Math.max(day, ss);
      for (let f = 0; f < 2; f++) {
        const per = 34 + f * 13, cyc = Math.floor((t + f * 17) / per), ph = ((t + f * 17) % per) / per, seed = cyc * 7.3 + f * 31;
        if (rnd(seed) < 0.35) continue;                                          // non sempre
        const dir = rnd(seed + 1) < 0.5 ? -1 : 1, span = W + 160, n = 4 + Math.floor(rnd(seed + 2) * 5);
        const hx = dir > 0 ? -80 + ph * span : W + 80 - ph * span, hy = 46 + rnd(seed + 3) * 70 + Math.sin(t * 0.4 + f) * 4;
        g.fillStyle = ss > 0.4 ? `rgba(20,12,24,${0.85 * vis})` : `rgba(40,46,62,${0.7 * vis})`;
        for (let i = 0; i < n; i++) {
          const side = i % 2 ? 1 : -1, row = Math.ceil(i / 2), bx = Math.round(hx - dir * row * 7), by = Math.round(hy + side * row * 4 + Math.sin(t * 1.3 + i) * 1.5);
          const up = Math.sin(t * 9 + i * 1.7) > 0;
          g.fillRect(bx, by, 1, 1);
          if (up) { g.fillRect(bx - 2, by - 1, 2, 1); g.fillRect(bx + 1, by - 1, 2, 1); } else { g.fillRect(bx - 2, by, 2, 1); g.fillRect(bx + 1, by, 2, 1); g.fillRect(bx - 3, by + 1, 1, 1); g.fillRect(bx + 3, by + 1, 1, 1); }
        }
      }
    }
    // scia di condensa di un aereo alto, di giorno: si allarga e sfuma dietro
    if (!rain && day > 0.5) {
      const per = 70, ph = (t % per) / per, seed = Math.floor(t / per);
      if (ph < 0.6 && rnd(seed + 9) < 0.7) {
        const k = ph / 0.6, x0 = -40 + k * (W + 80), y0 = 26 + rnd(seed) * 30 - k * 10;
        for (let q = 0; q < 60; q++) {
          const a = 0.35 * day * (1 - q / 60), w = 1 + q / 25;
          g.fillStyle = `rgba(255,255,255,${a})`; g.fillRect(Math.round(x0 - q * 3), Math.round(y0 + q * 0.5 - w / 2), 3, Math.max(1, Math.round(w)));
        }
        g.fillStyle = `rgba(230,236,245,${day})`; g.fillRect(Math.round(x0), Math.round(y0), 2, 1);
      }
    }
    // fuochi d'artificio: sul mare e sui paesi spesso, in città ogni tanto; razzo che sale, scoppio, scintille che cadono
    if (!rain && night > 0.6) {
      const per = bg === 'city' || bg === 'highway' ? 70 : 40, cyc = Math.floor(t / per), into = t - cyc * per, show = 13;
      const often = bg === 'sea' || bg === 'village' || rnd(cyc * 3.3 + 1) < 0.5;
      if (often && into < show + 2.5) {
        g.save(); g.globalCompositeOperation = 'lighter';
        const COLS = ['255,80,120', '120,220,255', '255,210,90', '170,255,120', '220,140,255', '255,150,60'];
        for (let b = 0; b < 9; b++) {
          const tb = b * 1.35 + rnd(cyc + b * 1.7) * 0.8, a = into - tb; if (a < 0 || a > 3.2) continue;
          const sd = cyc * 13 + b, cx = W * (0.12 + rnd(sd) * 0.76) - (dist * 0.04) % 40, cy = 40 + rnd(sd + 1) * 60, col = COLS[Math.floor(rnd(sd + 2) * COLS.length)], col2 = COLS[Math.floor(rnd(sd + 5) * COLS.length)];
          if (a < 0.7) {                                                           // il razzo
            const k = a / 0.7, ry = 200 - (200 - cy) * (1 - (1 - k) * (1 - k));
            for (let q = 0; q < 6; q++) { g.fillStyle = `rgba(255,220,170,${0.7 * (1 - q / 6)})`; g.fillRect(Math.round(cx + Math.sin(a * 30 + q) * 0.5), Math.round(ry + q * 2), 1, 2); }
            continue;
          }
          const e = a - 0.7, n = 40 + Math.floor(rnd(sd + 3) * 20), v = 38 + rnd(sd + 4) * 26, fade = Math.max(0, 1 - e / 2.4), ring = rnd(sd + 6) < 0.3;
          if (e < 0.6) { glow(g, cx, cy, 110, col, 0.7 * (1 - e / 0.6)); glow(g, cx, cy, 30, '255,255,255', 0.8 * (1 - e / 0.6)); if (this.lightAdd) this.lightAdd(cx, 236, 300, 60, col, 0.6 * (1 - e / 0.6)); }
          glow(g, cx, cy + drop0(e), R0(v, e) * 1.3, col, 0.18 * fade);   // lampo che tinge cielo e strada
          const R = R0(v, e), drop = drop0(e);
          for (let i = 0; i < n; i++) {
            const an = i / n * Math.PI * 2 + rnd(sd + i) * 0.2, rr = ring ? R : R * (0.55 + 0.45 * rnd(sd + i * 3));
            const px = cx + Math.cos(an) * rr, py = cy + Math.sin(an) * rr * 0.9 + drop;
            const tw = e > 1.2 ? (Math.sin(t * 40 + i) > 0 ? 1 : 0.3) : 1, c2 = i % 3 ? col : col2;
            g.fillStyle = `rgba(255,255,240,${fade * tw})`; g.fillRect(Math.round(px), Math.round(py), 1, 1);
            g.fillStyle = `rgba(${c2},${fade * tw})`; g.fillRect(Math.round(px) - 1, Math.round(py), 1, 1); g.fillRect(Math.round(px) + 1, Math.round(py), 1, 1); g.fillRect(Math.round(px), Math.round(py) - 1, 1, 1); g.fillRect(Math.round(px), Math.round(py) + 1, 1, 1);
            for (let q = 1; q < 5; q++) { g.fillStyle = `rgba(${c2},${0.4 * fade * (1 - q / 5)})`; g.fillRect(Math.round(px - Math.cos(an) * q * 2.2), Math.round(py - Math.sin(an) * q * 2.2 - q * 0.6), 1, 1); }   // codina
            if (i % 4 === 0) glow(g, px, py, 5, c2, 0.5 * fade * tw);
          }
        }
        g.restore();
      }
    }
    // lampi di calore: lontano, senza pioggia né tuono, una nuvola all'orizzonte si accende due volte
    if (!rain && night > 0.6 && (bg === 'desert' || bg === 'plain' || bg === 'mountain' || bg === 'sea')) {
      const per = 9 + (bg === 'desert' ? 0 : 5), cyc = Math.floor(t / per), ph = t - cyc * per;
      if (ph < 0.5 && rnd(cyc * 5.1) < 0.6) {
        const f = (ph < 0.08 ? 1 : ph < 0.16 ? 0.2 : ph < 0.26 ? 0.8 : Math.max(0, 1 - (ph - 0.26) / 0.24)) * (0.6 + 0.4 * rnd(cyc));
        const x = W * (0.15 + rnd(cyc * 2.7) * 0.7);
        g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x, 150, 120, '170,160,255', 0.3 * f); glow(g, x, 160, 50, '230,220,255', 0.25 * f); g.restore();
      }
    }
  };

  // ---------------------------------------------------------------- sull'asfalto: cose portate dal vento
  S.vitaRoad = function (g, dist, t, bg, dt, s, wx, carX) {
    if (off(this) || !wx) return;
    const W = this.LW, PPM = 30, v = Math.abs((s && s.v) || 0), day = this.day || 0;
    const L = this._deb || (this._deb = []);
    const kind = bg === 'desert' ? 'tumble' : bg === 'city' || bg === 'highway' ? 'paper' : 'leaf';
    const visTo = dist + (W - carX) / PPM, wind = bg === 'desert' ? -3.5 : -1.2;
    // nuovi pezzi: entrano da destra mentre si viaggia, da fermi ogni tanto dal bordo
    const rate = kind === 'tumble' ? 0.25 : 2 + v * 0.08;
    if (L.length < 40 && Math.random() < rate * dt) {
      const m = v > 3 ? visTo + 1 : dist + (Math.random() * W - carX) / PPM;
      L.push({ m, y: 244 + Math.random() * 88, z: 0, vz: 0, vm: wind * (0.5 + Math.random()), sp: Math.random() * 6, k: kind, c: Math.floor(Math.random() * 4) });
    }
    for (let i = L.length - 1; i >= 0; i--) {
      const p = L[i];
      p.m += p.vm * dt; p.sp += dt * (3 + Math.abs(p.vm) * 2);
      // l'auto passa vicino in velocità: il pezzo vola su e resta dietro nel risucchio
      const x = wx(p.m), carY = 300;
      if (v > 8 && Math.abs(x - carX - 40) < 70 && Math.abs(p.y - carY) < 40 && p.z < 2) { p.vz = 30 + v * 1.2; p.vm = (s.v > 0 ? 1 : -1) * Math.min(14, v * 0.35); }
      p.vz -= 70 * dt; p.z = Math.max(0, p.z + p.vz * dt); if (p.z === 0) { p.vz = p.k === 'tumble' ? Math.max(0, -p.vz * 0.5) : 0; p.vm += (wind - p.vm) * dt * 0.8; }
      if (x < -40 || x > W + 80) { L.splice(i, 1); continue; }
      const X = Math.round(x), Y = Math.round(p.y - p.z);
      if (p.z > 0.5) { g.fillStyle = 'rgba(4,5,12,.25)'; g.fillRect(X - 2, Math.round(p.y) + 1, 5, 1); }
      if (p.k === 'leaf') {
        const col = ['#a8622a', '#c98a32', '#7a8a2a', '#8a3a1a'][p.c], fl = Math.sin(p.sp) > 0;
        g.fillStyle = col; if (fl) { g.fillRect(X, Y, 4, 2); g.fillRect(X + 1, Y - 1, 2, 1); } else { g.fillRect(X, Y - 1, 2, 3); g.fillRect(X + 2, Y, 1, 2); }
        g.fillStyle = Street2D.shade(col, -0.35); g.fillRect(X + 1, Y + (fl ? 1 : 0), 2, 1);
      } else if (p.k === 'paper' && (this.SS || 1) > 1) {
        // a densità doppia si riconosce cos'è: giornale col testo, pallina di carta, bicchiere di carta, scontrino
        const fl = Math.floor(p.sp) % 3, u = 0.5, lt = day > 0.5, pc = lt ? '#e8e4d8' : '#a8a6b8', sh = lt ? '#b8b4a8' : '#7c7a8e', ink = lt ? '#6a6a78' : '#55546a';
        const f = (c, a, b, w, h) => { g.fillStyle = c; g.fillRect(a, b, w, h); };
        if (p.c === 0) {                                                       // giornale che sventola
          if (fl === 0) { f(sh, X, Y - 1, 7, 4); f(pc, X, Y - 1, 6.5, 3.5); for (let q = 0; q < 3; q++) f(ink, X + 1, Y - 0.5 + q, q === 0 ? 3 : 4.5, u); f(sh, X + 3.5, Y - 1, u, 3.5); }
          else if (fl === 1) { f(pc, X, Y + 1, 7, 1.5); f(ink, X + 1, Y + 1.5, 4, u); f(sh, X, Y + 2, 7, u); }
          else { f(sh, X + 1, Y - 2, 3.5, 6); f(pc, X + 1, Y - 2, 3, 5.5); f(ink, X + 1.5, Y - 1, 2, u); f(ink, X + 1.5, Y, 2, u); f(ink, X + 1.5, Y + 1, 1.5, u); }
        } else if (p.c === 1) {                                                // pallina di carta che rotola
          const r = Math.floor(p.sp * 2) % 4; f(sh, X, Y - 1, 4, 3.5); f(pc, X + 0.5, Y - 1.5, 3, 3); f(lt ? '#fffaf0' : '#c8c6d6', X + 0.5 + (r & 1) * 1.5, Y - 1.5 + (r >> 1) * 1, 1, u); f(sh, X + 1 + (r & 1), Y, 1.5, u);
        } else if (p.c === 2) {                                                // bicchiere di carta schiacciato
          f('#e8e4d8', X, Y - 0.5, 6, 2.5); f('#c4241c', X + 0.5, Y, 5, 1); f('#ffffff', X + 1, Y - 0.5, 2, u); f(sh, X, Y + 1.5, 6, u); f('#d8d0c0', X + 5.5, Y - 1, 1, 3.5);
        } else {                                                                // scontrino lungo e sottile
          if (fl === 2) { f(pc, X + 1, Y - 2.5, 1.5, 6); f(ink, X + 1.5, Y - 2, u, 4); } else { f(pc, X, Y, 8, 1); f(ink, X + 1, Y + 0.5, 1, u); f(ink, X + 3, Y + 0.5, 2, u); f(ink, X + 6, Y + 0.5, 1, u); f(sh, X, Y + 1, 8, u); }
        }
      } else if (p.k === 'paper') {
        const fl = Math.floor(p.sp) % 3; g.fillStyle = day > 0.5 ? '#e8e4d8' : '#a8a6b8';
        if (fl === 0) g.fillRect(X, Y - 1, 6, 4); else if (fl === 1) g.fillRect(X, Y + 1, 6, 2); else g.fillRect(X + 1, Y - 2, 3, 6);
        g.fillStyle = '#8a8a9a'; g.fillRect(X + 1, Y + (fl === 1 ? 1 : 1), 2, 1);
      } else {
        // rotolacampo: una palla di rametti che rotola e rimbalza
        const r = 6, a0 = -p.m * 0.8; g.fillStyle = '#7a5a30';
        for (let q = 0; q < 14; q++) { const an = a0 + q * 0.9, rr = r * (0.4 + 0.6 * rnd(q * 3.1 + p.c)); g.fillRect(Math.round(X + Math.cos(an) * rr), Math.round(Y - r + Math.sin(an) * rr), 2, 1); }
        g.fillStyle = '#a07a40'; for (let q = 0; q < 8; q++) { const an = -a0 + q * 1.3; g.fillRect(Math.round(X + Math.cos(an) * r * 0.6), Math.round(Y - r + Math.sin(an) * r * 0.6), 1, 1); }
        g.fillStyle = 'rgba(4,5,12,.3)'; g.fillRect(X - 5, Math.round(p.y) + 1, 10, 1);
      }
    }
  };

  // ---------------------------------------------------------------- sull'asfalto, prima delle auto: riflessi e scintille sul bagnato
  // (v0.118) Erano in vitaFront, dopo le auto: le strisce di luce passavano sopra la carrozzeria. Ora stanno sulla strada e le auto ci
  // passano sopra; la penombra notturna viene dopo e li scurisce, quindi l'intensità è un po' più alta di prima (RIFL_K).
  const RIFL_K = 1.7;
  S.vitaRiflessi = function (g, dist, t, bg, dt, s) {
    if (off(this)) return;
    const W = this.LW, day = this.day || 0, night = 1 - day, rain = !!this.rainOn;
    const lamps = this._lampX || [], shops = this._shops || [], slow = !!this.slow;
    if (night <= 0.2) return;
    g.save(); g.globalCompositeOperation = 'lighter';
      // riflessi verticali sull'asfalto: lunghe strisce tremolanti sotto insegne e lampioni (di più col bagnato)
      const wet = (rain ? 1 : 0.6) * night;
      // a densità doppia trattini di mezza unità, più fitti e più fini (sull'asciutto ondeggiano meno): un riflesso, non una scala
      const u = 1 / (this.SS || 1), fine = u < 1, step = fine ? 1.5 : 3, hh = fine ? 1 : 2, q = (v) => Math.round(v / u) * u;
      // v0.136: i trattini si raggruppano in 6 livelli di trasparenza e ogni livello è una figura sola (prima un fillRect per
      // trattino, ~350 a fotogramma); la differenza fra un livello e l'altro non si vede
      const LIV = 6, bins = [];
      const streak = (x, rgb, a, w) => {
        for (let i = 0; i < LIV; i++) bins[i] = null;
        for (let y = 240; y < 334; y += step) {
          const k = (y - 240) / 94, wob = Math.sin(y * 0.45 + t * (rain ? 9 : 4) + x * 0.1) * (1 + k * 2) * (fine && !rain ? 0.7 : 1), ww = Math.max(u, q(w * (1 - k * 0.5)));
          const al = (1 - k) * (0.7 + 0.3 * Math.sin(y * 1.7 + t * 6)), b = Math.max(0, Math.min(LIV - 1, Math.round(al * (LIV - 1))));
          (bins[b] || (bins[b] = [])).push(q(x + wob - ww / 2), y, ww);
        }
        g.fillStyle = `rgb(${rgb})`;
        for (let b = 0; b < LIV; b++) {
          const R = bins[b]; if (!R) continue;
          g.globalAlpha = a * (b / (LIV - 1)) * (fine ? 0.9 : 1); g.beginPath();
          for (let i = 0; i < R.length; i += 3) g.rect(R[i], R[i + 1], R[i + 2], hh);
          g.fill();
        }
        g.globalAlpha = 1;
      };
      for (const sh of shops) if (sh.x > -20 && sh.x < W + 20) streak(sh.x, Street2D.rgb(sh.col), 0.32 * RIFL_K * wet, Math.min(14, sh.w * 0.3));
      for (const x of lamps) if (x > -40 && x < W + 20) streak(x + 19, '255,214,150', 0.3 * RIFL_K * wet, 7);
      // scintille sul bagnato: puntini che si accendono e spengono nelle pozze di luce dei lampioni
      if (!slow) for (const x of lamps) for (let i = 0; i < (rain ? 9 : 4); i++) {
        const sd = Math.floor(t * 5) + i * 17 + Math.round(x), px = x + 19 + (rnd(sd) - 0.5) * 110, py = 246 + rnd(sd + 1) * 80;
        if (rnd(sd + 2) < 0.5) continue; g.fillStyle = `rgba(255,240,210,${Math.min(1, 0.5 * RIFL_K * night)})`; g.fillRect(q(px), q(py), 1, 1);
      }
    g.restore();
  };

  // ---------------------------------------------------------------- fari sul bagnato (v0.119)
  // I fari e le luci posteriori si specchiano sull'asfalto: una colonna che trema sotto il muso e sotto il fanale, e una chiazza di luce
  // allungata davanti. Con la pioggia molto, sull'asciutto appena. Si disegna sotto la linea di terra: non copre la carrozzeria.
  S.fxFariBagnato = function (g, fx, y0, tx, s, night, t) {
    if (off(this) || night < 0.15 || this.noLuci) return;
    const wet = (this.rainOn ? 1 : 0.32) * night;
    const u = 1 / (this.SS || 1), col = (x, rgb, a, len, w) => {
      g.fillStyle = `rgb(${rgb})`;
      for (let y = 0; y < len; y += 1) {
        const k = y / len, wob = Math.sin(y * 0.9 + t * (this.rainOn ? 9 : 4) + x) * (0.6 + k * 1.6);
        g.globalAlpha = Math.min(1, a * (1 - k) * (0.75 + 0.25 * Math.sin(y * 2.1 + t * 7)));
        g.fillRect(Math.round((x + wob - w / 2) / u) * u, y0 + 1 + y, w, 1);
      }
      g.globalAlpha = 1;
    };
    g.save(); g.globalCompositeOperation = 'lighter';
    this.light(g, fx + 46, y0 + 5, 78, 6, '#fff2cf', 0.2 * wet, 3);                                   // chiazza davanti al muso
    col(fx, '255,240,200', 0.5 * wet, 16, 3); col(fx - 3, '255,230,180', 0.25 * wet, 11, 2);         // colonna del faro
    const brake = s && s.brake > 0.05;
    col(tx, '255,50,70', (brake ? 0.62 : 0.22) * (this.rainOn ? 1 : 0.7) * night, brake ? 18 : 12, 3);   // fanale posteriore (più forte frenando)
    if (brake) this.light(g, tx - 16, y0 + 5, 30, 4, '#ff3a4a', 0.16 * wet, 3);
    g.restore();
  };

  // ---------------------------------------------------------------- davanti, dopo la penombra: falene e lucciole, raggi di sole, miraggio
  S.vitaFront = function (g, dist, t, bg, dt, s) {
    if (off(this)) return;
    const W = this.LW, day = this.day || 0, ss = this.sunset || 0, night = 1 - day, rain = !!this.rainOn;
    const lamps = this._lampX || [], shops = this._shops || [], slow = !!this.slow;
    g.save(); g.globalCompositeOperation = 'lighter';
    if (night > 0.2) {
      const u = 1 / (this.SS || 1), fine = u < 1, q = (v) => Math.round(v / u) * u;
      // falene intorno alla testa dei lampioni
      if (!rain) for (const x of lamps) {
        if (x < -40 || x > W + 20) continue;
        for (let i = 0; i < 4; i++) {
          const r = 5 + i * 3, px = x + 19 + Math.cos(t * (4 + i) + i * 2.1 + x) * r + Math.sin(t * 13 + i) * 1.5, py = 131 + Math.sin(t * (3.1 + i * 0.7) + i * 1.7) * (3 + i);
          g.fillStyle = `rgba(255,240,200,${0.8 * night})`; g.fillRect(q(px), q(py), fine ? u : 1, fine ? u : 1);
        }
      }
      // lucciole nei campi e nei paesi: si accendono a respiro, verde-giallo
      if (!rain && night > 0.55 && (bg === 'plain' || bg === 'mountain' || bg === 'village')) {
        const n = slow ? 14 : 34;
        for (let i = 0; i < n; i++) {
          const sp = W + 120, px = ((rnd(i * 4.1) * sp - dist * 30 * (0.25 + rnd(i) * 0.3) + Math.sin(t * 0.5 + i) * 18) % sp + sp) % sp - 60;
          const py = (i % 3 ? 196 + rnd(i * 2.3) * 34 : 340 + rnd(i * 2.3) * 16) + Math.sin(t * 0.9 + i * 1.3) * 5;
          const b = Math.pow(Math.max(0, Math.sin(t * (1.1 + rnd(i * 5) * 0.8) + i * 2.4)), 3) * night;
          if (b < 0.03) continue;
          glow(g, px, py, 11, '200,255,90', 0.85 * b); glow(g, px, py, 3, '240,255,170', b); g.fillStyle = `rgba(240,255,170,${b})`; g.fillRect(Math.round(px), Math.round(py), 1, 1);
        }
      }
    }
    g.restore();
    // raggi di sole: fasci obliqui che partono dal sole basso (soprattutto al tramonto), col pulviscolo dentro
    const sunK = rain ? 0 : Math.max(ss, day * 0.5);
    if (sunK > 0.05) {
      const sx = W * 0.22, sy = 150 - day * 110, warm = ss > 0.3 ? '255,170,100' : '255,240,200';
      g.save(); g.globalCompositeOperation = 'lighter';
      for (let r = 0; r < 6; r++) {
        const an = 0.25 + r * 0.19 + Math.sin(t * 0.07 + r) * 0.03, len = 420, wd = 0.025 + rnd(r * 3.3) * 0.03;
        const a = (0.2 + 0.1 * Math.sin(t * 0.3 + r * 1.9)) * sunK;
        const gr = g.createLinearGradient(sx, sy, sx + Math.cos(an) * len, sy + Math.sin(an) * len);
        gr.addColorStop(0, `rgba(${warm},${a})`); gr.addColorStop(1, `rgba(${warm},0)`); g.fillStyle = gr;
        g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + Math.cos(an - wd) * len, sy + Math.sin(an - wd) * len); g.lineTo(sx + Math.cos(an + wd) * len, sy + Math.sin(an + wd) * len); g.closePath(); g.fill();
      }
      g.fillStyle = `rgba(${warm},${0.5 * sunK})`;
      for (let i = 0; i < 30; i++) {
        const an = 0.3 + rnd(i) * 0.9, d0 = 40 + ((rnd(i + 1) * 300 + t * (3 + rnd(i + 2) * 4)) % 300);
        if (Math.sin(t * 2 + i) < 0) continue;
        g.fillRect(Math.round(sx + Math.cos(an) * d0 + Math.sin(t * 0.6 + i) * 3), Math.round(sy + Math.sin(an) * d0), 1, 1);
      }
      g.restore();
    }
    // miraggio: di giorno nel deserto e in pianura la strada lontana diventa uno specchio d'acqua che trema
    if (day > 0.55 && !rain && (bg === 'desert' || bg === 'plain' || bg === 'highway') && this.lo) {
      const SS = this.SS || 1;
      g.save(); g.globalAlpha = 0.35 * day;
      for (let r = 0; r < 10; r++) { const wob = Math.round(Math.sin(t * 7 + r * 1.9) * 2); g.globalAlpha = 0.6 * day * (1 - r / 10); g.drawImage(this.lo, 0, (60 + r * 4) * SS, W * SS, SS, wob, 239 + r, W, 1); }
      g.restore();
    }
  };
})();
