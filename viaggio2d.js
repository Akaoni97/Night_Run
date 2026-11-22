// ============================================================================
//  Night Run · Il Viaggio in 2D: bar, autogrill "Sosta 24", Motel 4Ever, autostoppisti, cippi chilometrici,
//  cartelli strani, rimorchio, colpi di sonno. Aggiunge metodi a Street2D (caricato dopo street2d.js).
// ============================================================================
(function () {
  const S = Street2D.prototype, rnd = Street2D.rnd;

  // ---------------------------------------------------------------- facciate dei locali (sul marciapiede lontano, base y 216)
  S.drawTripPlace = function (g, e, x, st, near, open) {
    if (e.id !== 'bar' && e.id !== 'grill' && e.id !== 'motel') return false;
    const C = this.C, t = st.t, win = (wx, wy, w, h, col = '#ffcf7a') => { g.fillStyle = C.ink; g.fillRect(wx - 1, wy - 1, w + 2, h + 2); g.fillStyle = col; g.fillRect(wx, wy, w, h); this.light(g, wx + w / 2, wy + h / 2, w, h, col, 0.06, 2); };
    g.fillStyle = '#23263a'; g.fillRect(x - 50, 216, 100, 16); g.fillStyle = '#4a5070'; g.fillRect(x - 50, 216, 100, 1);
    if (e.id === 'bar') {
      const L = x - 84, R = x + 84, top = 150;
      g.fillStyle = C.ink; g.fillRect(L - 2, top - 2, R - L + 4, 218 - top);
      g.fillStyle = '#4a3a2c'; g.fillRect(L, top, R - L, 216 - top);
      for (let yy = top + 5; yy < 216; yy += 5) { g.fillStyle = '#3e3024'; g.fillRect(L, yy, R - L, 1); }
      win(L + 10, top + 22, 46, 30); win(R - 56, top + 22, 46, 30);
      g.fillStyle = C.ink; g.fillRect(x - 13, top + 20, 26, 46); g.fillStyle = open > 0.5 ? '#ffcf7a' : '#2a1c14'; g.fillRect(x - 11, top + 22, 22, 44);
      for (let k = 0; k < 14; k++) { g.fillStyle = k % 2 ? '#c8282b' : '#f4f1e6'; g.fillRect(L + k * 12, top + 8, 12, 7); }   // tenda a strisce
      g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(L, top + 15, R - L, 3);
      const name = e.name.toUpperCase(), w = this.textW(name, 1);
      g.fillStyle = C.ink; g.fillRect(x - w / 2 - 5, top - 14, w + 10, 12); this.text(g, name, Math.round(x - w / 2), top - 11, '#ffd23f');
      this.light(g, x, top - 8, w, 10, '#ffd23f', 0.08, 3);
      for (const tx of [L - 26, R + 10]) { g.fillStyle = '#6a5a48'; g.fillRect(tx, 206, 16, 2); g.fillRect(tx + 7, 208, 2, 8); g.fillStyle = '#c8282b'; g.fillRect(tx + 2, 196, 12, 2); g.fillRect(tx + 7, 186, 2, 10); }   // tavolini
      this.placeTag(g, x, top - 30, 'BAR', '#ffd23f', near);
      return true;
    }
    if (e.id === 'grill') {
      const L = x - 150, R = x + 150, top = 132;
      g.fillStyle = C.ink; g.fillRect(L - 2, top - 2, R - L + 4, 218 - top);
      g.fillStyle = '#2c3040'; g.fillRect(L, top, R - L, 216 - top);
      g.fillStyle = '#ff7a3a'; g.fillRect(L, top, R - L, 10); g.fillStyle = '#ffb07a'; g.fillRect(L, top, R - L, 1);
      for (let q = 0; q < 6; q++) win(L + 12 + q * 48, top + 22, 38, 40, q === 2 || q === 3 ? '#e8f4ff' : '#ffe6b0');
      g.fillStyle = C.ink; g.fillRect(x - 20, top + 30, 40, 54); g.fillStyle = open > 0.5 ? '#e8f4ff' : '#6a7a90'; g.fillRect(x - 18, top + 32, 36, 52);
      // insegna alta sul palo
      g.fillStyle = C.ink; g.fillRect(R + 16, 70, 5, 146); g.fillRect(R - 8, 54, 54, 30); g.fillStyle = '#ff7a3a'; g.fillRect(R - 6, 56, 50, 26);
      this.text(g, 'SOSTA', R - 1, 59, '#fff6e0'); this.text(g, '24', R + 12, 69, '#fff6e0', 1);
      this.light(g, R + 19, 69, 40, 24, '#ff7a3a', 0.1, 3);
      this.placeTag(g, x, top - 18, 'AUTOGRILL', '#ff7a3a', near);
      return true;
    }
    // Motel 4Ever: fila di stanze su due piani, la 7 sempre accesa, insegna rosa col braccio che lampeggia
    const L = x - 140, R = x + 140, top = 118;
    g.fillStyle = C.ink; g.fillRect(L - 2, top - 2, R - L + 4, 218 - top);
    g.fillStyle = '#3a2c3c'; g.fillRect(L, top, R - L, 216 - top);
    g.fillStyle = '#52384e'; g.fillRect(L, top + 46, R - L, 4); g.fillStyle = '#2a1f2c'; g.fillRect(L, top + 50, R - L, 2);   // ballatoio
    for (let fl = 0; fl < 2; fl++) for (let q = 0; q < 7; q++) {
      const dx = L + 12 + q * 38, dy = top + 10 + fl * 50, num = fl * 7 + q + 1, seven = num === 7;
      g.fillStyle = C.ink; g.fillRect(dx - 1, dy - 1, 14, 30); g.fillStyle = seven ? '#ff5fa8' : '#5a4258'; g.fillRect(dx, dy, 12, 28);
      win(dx + 16, dy + 6, 14, 10, seven || rnd(num + Math.round(e.x)) < 0.35 ? '#ffcf7a' : '#1a1424');
      if (seven) this.text(g, '7', dx + 4, dy + 4, '#fff6e0');
    }
    g.fillStyle = C.ink; g.fillRect(R + 14, 40, 6, 176);
    g.fillStyle = C.ink; g.fillRect(R - 20, 30, 80, 46); g.fillStyle = '#2a1424'; g.fillRect(R - 18, 32, 76, 42);
    const on = Math.sin(t * 7) > -0.6, blink = Math.floor(t * 2) % 2;
    this.text(g, 'MOTEL', R - 10, 37, on ? '#ff5fa8' : '#4a1a34', 2); this.text(g, '4EVER', R - 12, 53, on ? '#2ee6ff' : '#14303a');
    this.text(g, 'LIBERO', R - 4, 64, blink ? '#3bff7a' : '#103a20');
    if (on) { this.light(g, R + 20, 48, 60, 30, '#ff5fa8', 0.12, 3); this.light(g, R + 20, 58, 50, 14, '#2ee6ff', 0.07, 3); }
    g.fillStyle = C.ink; g.fillRect(L + 6, top - 18, 168, 14); this.text(g, 'LA TUA CASSA TI ASPETTA', L + 10, top - 15, '#ffd23f');
    this.placeTag(g, x, top - 34, 'MOTEL', '#ff5fa8', near);
    return true;
  };

  // ---------------------------------------------------------------- interni (dietro all'auto ferma)
  S.drawTripInterior = function (g, I, W, t) {
    if (I.id !== 'bar' && I.id !== 'grill' && I.id !== 'motel') return false;
    const C = this.C;
    if (I.id === 'bar') {
      g.fillStyle = '#2a1e16'; g.fillRect(0, 0, W, 360);
      for (let xx = 0; xx < W; xx += 40) { g.fillStyle = '#33251a'; g.fillRect(xx, 30, 38, 200); }
      g.fillStyle = '#4a3020'; g.fillRect(0, 150, W, 70); g.fillStyle = '#6a4a30'; g.fillRect(0, 150, W, 4);   // bancone
      for (let q = 0; q < 40; q++) { const bx = 20 + q * 18; if (bx > W - 20) break; g.fillStyle = ['#3b7a3a', '#c8a040', '#8a2a2a', '#d8d0c0'][q % 4]; g.fillRect(bx, 60 + (q % 2) * 2, 6, 24); g.fillRect(bx + 2, 54 + (q % 2) * 2, 2, 6); }   // bottiglie
      g.fillStyle = '#c9ced6'; g.fillRect(W - 220, 112, 60, 38); g.fillStyle = '#5a5f68'; g.fillRect(W - 214, 118, 48, 6); g.fillStyle = '#ffd23f'; g.fillRect(W - 210, 128, 4, 4);   // macchina del caffè
      for (let k = 0; k < 4; k++) this.light(g, 80 + k * 200, 20, 120, 60, '#ffcf7a', 0.06, 3);
      this.person(g, W - 120, 222, 'luca', t);
      return true;
    }
    if (I.id === 'grill') {
      g.fillStyle = '#20232e'; g.fillRect(0, 0, W, 360);
      for (let xx = 30; xx < W; xx += 110) { g.fillStyle = C.ink; g.fillRect(xx, 18, 70, 6); g.fillStyle = '#eef6ff'; g.fillRect(xx + 2, 19, 66, 3); this.light(g, xx + 35, 24, 90, 40, '#dfeaff', 0.06, 3); }
      for (let r = 0; r < 3; r++) for (let q = 0; q < 30; q++) { const bx = 20 + q * 14; if (bx > W * 0.55) break; g.fillStyle = ['#ff7a3a', '#2ee6ff', '#ffd23f', '#b8ff3a', '#ff5fa8'][(q + r) % 5]; g.fillRect(bx, 70 + r * 36, 10, 14); }   // scaffali
      g.fillStyle = '#3a3e4c'; for (let r = 0; r < 3; r++) g.fillRect(14, 84 + r * 36, W * 0.55, 3);
      g.fillStyle = C.ink; g.fillRect(W - 280, 40, 200, 26); this.text(g, 'SOSTA 24', W - 268, 46, '#ff7a3a', 2);
      this.text(g, 'DOCCE  PASTI  MARKET', W - 268, 74, '#e8f4ff');
      return true;
    }
    // motel: il parcheggio davanti alle stanze, la porta 7 aperta e la cassa che ti aspetta sulla soglia
    const gr = g.createLinearGradient(0, 0, 0, 240); gr.addColorStop(0, '#0a0614'); gr.addColorStop(1, '#2a1630'); g.fillStyle = gr; g.fillRect(0, 0, W, 240);
    g.fillStyle = '#3a2c3c'; g.fillRect(0, 70, W, 170);
    for (let q = 0; q < 12; q++) {
      const dx = 30 + q * 70, seven = q === 4; if (dx > W - 40) break;
      g.fillStyle = C.ink; g.fillRect(dx - 2, 120, 30, 120); g.fillStyle = seven ? '#ffcf7a' : '#5a4258'; g.fillRect(dx, 122, 26, 118);
      this.text(g, String(q + 3), dx + 9, 104, seven ? '#ff5fa8' : '#8a7088');
      if (seven) {
        this.light(g, dx + 13, 200, 80, 60, '#ffcf7a', 0.12, 3);
        // la cassa: legno scuro, angoli d'ottone
        g.fillStyle = C.ink; g.fillRect(dx - 8, 212, 44, 30); g.fillStyle = '#5a3a22'; g.fillRect(dx - 6, 214, 40, 26);
        g.fillStyle = '#7a5232'; g.fillRect(dx - 6, 214, 40, 3); g.fillStyle = '#d8b040'; for (const [cx, cy] of [[-6, 214], [30, 214], [-6, 236], [30, 236]]) g.fillRect(dx + cx, cy, 4, 4);
        g.fillStyle = '#d8b040'; g.fillRect(dx + 12, 224, 4, 5);
      }
    }
    g.fillStyle = '#1a1420'; g.fillRect(0, 240, W, 120);
    for (let xx = 0; xx < W; xx += 90) { g.fillStyle = '#e8e6df'; g.fillRect(xx, 250, 2, 90); }
    return true;
  };

  // ---------------------------------------------------------------- oggetti del viaggio sulla strada
  S.drawTripEnt = function (g, e, x, st) {
    if (e.kind === 'ghost') return true;                     // si vede solo nel radar
    const C = this.C, t = st.t;
    if (e.kind === 'hitch') {
      // autostoppista sul bordo: zaino, pollice alzato
      const y = 228, X = Math.round(x), coat = ['#3a1f2e', '#1f3a2e', '#2a1f4f', '#4a2a1a'][e.id % 4], sign = Math.floor(t * 2) % 2;
      g.fillStyle = 'rgba(4,5,12,.45)'; g.fillRect(X - 6, y, 16, 2);
      g.fillStyle = C.ink; g.fillRect(X - 3, y - 30, 11, 30);
      g.fillStyle = '#5a4a2a'; g.fillRect(X - 6, y - 25, 5, 12);                // zaino
      g.fillStyle = coat; g.fillRect(X - 2, y - 23, 8, 12);
      g.fillStyle = C.skin; g.fillRect(X - 1, y - 30, 6, 6); g.fillStyle = '#2a1a10'; g.fillRect(X - 1, y - 31, 6, 2);
      g.fillStyle = '#1a1a2a'; g.fillRect(X - 1, y - 11, 3, 11); g.fillRect(X + 3, y - 11, 3, 11);
      g.fillStyle = coat; g.fillRect(X + 6, y - 22 - sign, 6, 3); g.fillStyle = C.skin; g.fillRect(X + 11, y - 25 - sign, 3, 5);   // braccio e pollice
      if (e.story) this.light(g, X + 2, y - 15, 14, 22, '#c8d0ff', 0.05 + 0.04 * Math.sin(t * 3), 2);
      return true;
    }
    if (e.kind === 'vgsign') {
      const X = Math.round(x);
      if (e.cippo) { g.fillStyle = C.ink; g.fillRect(X - 1, 196, 16, 32); g.fillStyle = '#e8e6df'; g.fillRect(X, 197, 14, 30); g.fillStyle = '#c8282b'; g.fillRect(X, 197, 14, 4); this.text(g, 'KM', X + 2, 205, '#14161e'); this.text(g, '9', X + 5, 213, '#14161e'); return true; }
      if (e.app) {                                   // cartellone luminoso: scarica l'app (il telefono la offre quando lo superi)
        const L = e.text.split('|'), w = Math.max(...L.map((s) => s.length)) * 4 + 12, h = L.length * 9 + 8, top = 150, bx = X - Math.round(w / 2);
        g.fillStyle = C.ink; g.fillRect(bx + 6, top + h, 3, 228 - top - h); g.fillRect(bx + w - 9, top + h, 3, 228 - top - h);
        this.light(g, X, top + h / 2, w * 0.9, h + 14, '#7fb0ff', 0.14, 3);
        g.fillStyle = C.ink; g.fillRect(bx - 1, top - 1, w + 2, h + 2); g.fillStyle = '#10224a'; g.fillRect(bx, top, w, h); g.fillStyle = '#1e3f86'; g.fillRect(bx, top, w, 2);
        const blink = Math.floor((performance.now() || 0) / 500) % 2;
        L.forEach((s, i) => this.text(g, s, bx + Math.round((w - s.length * 4) / 2), top + 5 + i * 9, i === L.length - 1 && blink ? '#fff6c8' : '#ffd23f'));
        return true;
      }
      if (e.wall) {
        g.fillStyle = '#5a3a30'; g.fillRect(X + 60, 180, 90, 48); for (let yy = 182; yy < 228; yy += 5) for (let xx = X + 60 + ((yy / 5) % 2 ? 0 : 6); xx < X + 150; xx += 12) { g.fillStyle = '#3e2820'; g.fillRect(xx, yy, 1, 5); g.fillRect(X + 60, yy, 90, 1); }
        g.fillStyle = '#2a5a2a'; for (let q = 0; q < 30; q++) g.fillRect(X + 60 + Math.floor(rnd(q + e.id) * 88), 180 + Math.floor(rnd(q * 3 + e.id) * 46), 3, 2);   // muschio
        g.fillStyle = C.ink; g.fillRect(X - 1, 120, 4, 108); g.fillRect(X - 40, 100, 82, 26); g.fillStyle = '#0d5a3a'; g.fillRect(X - 38, 102, 78, 22);
        this.text(g, e.text, X - 34, 109, '#f4f1e6');
        return true;
      }
      if (e.cap) {                                   // cartello direzionale verde della capitale: una sola riga bianca su due pali
        const w = e.text.length * 4 + 12, bx = X - Math.round(w / 2);
        g.fillStyle = C.ink; g.fillRect(bx + 5, 168, 3, 60); g.fillRect(bx + w - 8, 168, 3, 60);
        g.fillStyle = '#e8e6df'; g.fillRect(bx - 1, 140, w + 2, 29); g.fillStyle = '#0d5a3a'; g.fillRect(bx, 141, w, 27);
        this.light(g, X, 154, w, 40, '#9fe8c0', 0.07, 2);
        this.text(g, e.text, bx + 6, 151, '#f4f1e6'); g.fillStyle = '#f4f1e6'; g.fillRect(bx + 6, 160, w - 12, 1);
        return true;
      }
      // cartone scritto a mano legato al guardrail
      const lines = []; let cur = '';
      for (const w of e.text.split(' ')) { if ((cur + ' ' + w).trim().length > 12) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; }
      lines.push(cur.trim());
      const h = lines.length * 8 + 6;
      g.fillStyle = '#8a7050'; g.fillRect(X - 30, 222 - h, 62, h); g.fillStyle = '#a08060'; g.fillRect(X - 30, 222 - h, 62, 2);
      lines.forEach((l, i) => this.text(g, l, X - 27, 225 - h + i * 8, '#1a1010'));
      g.fillStyle = '#3a3f58'; g.fillRect(X - 30, 222, 62, 2);
      return true;
    }
    return false;
  };

  // cippi chilometrici ogni km, sul bordo lontano
  S.drawKmPosts = function (g, wx, visFrom, visTo) {
    for (let m = Math.ceil(visFrom / 1000) * 1000; m < visTo; m += 1000) {
      const X = wx(m), km = String(Math.round(m / 1000));
      if (m <= 0) continue;
      g.fillStyle = this.C.ink; g.fillRect(X - 1, 204, 4 + 4 * km.length + 4, 26);
      g.fillStyle = '#e8e6df'; g.fillRect(X, 205, 2 + 4 * km.length + 4, 24); g.fillStyle = '#c8282b'; g.fillRect(X, 205, 2 + 4 * km.length + 4, 3);
      this.text(g, km, X + 3, 212, '#14161e');
    }
  };

  // rimorchietto dietro l'auto
  S.drawTrailer = function (g, left, y0, k, s, st) {
    const C = this.C, w = Math.round(78 * k), h = Math.round(26 * k), X = left - w - Math.round(10 * k), top = y0 - h - Math.round(12 * k);
    g.fillStyle = C.ink; g.fillRect(X + w - 2, y0 - Math.round(16 * k), Math.round(14 * k), 3);                       // timone
    g.fillStyle = C.ink; g.fillRect(X - 1, top - 1, w + 2, h + 2); g.fillStyle = '#5a5f68'; g.fillRect(X, top, w, h);
    g.fillStyle = '#7a808a'; g.fillRect(X, top, w, 2); g.fillStyle = '#3a3e46'; for (let q = 1; q < 4; q++) g.fillRect(X + Math.round(q * w / 4), top + 2, 1, h - 2);
    g.fillStyle = '#c8b090'; g.fillRect(X + 4, top - Math.round(8 * k), Math.round(20 * k), Math.round(8 * k)); g.fillRect(X + Math.round(28 * k), top - Math.round(6 * k), Math.round(16 * k), Math.round(6 * k));   // scatole
    g.fillStyle = '#ff2a2a'; g.fillRect(X, top + 4, 3, 4); this.light(g, X, top + 6, 8, 5, '#ff2a2a', 0.15, 2);
    this.wheel(g, X + Math.round(w * 0.5), y0 - Math.round(11 * k), Math.max(5, Math.round(11 * k)), -st.spin, Math.abs(s.v));
  };

  // ---------------------------------------------------------------- specchietto retrovisore (in alto al centro)
  // Dietro la lunetta si vedono il guidatore e chi è salito a bordo, come sagome controluce: un posto davanti e due dietro
  // (una coppia siede dietro). Chi sparisce a metà strada sfuma piano e non torna. Con v.mirror (la coppia di «non guardare
  // nello specchietto») i passeggeri dietro hanno gli occhi accesi.
  S.drawMirror = function (g, game, v, t) {
    const MW = 108, MH = 30, x = 4, y = 8, cx = x + MW / 2;   // coordinate nella tela dello specchietto (vedi paintMirror)
    // chi c'è a bordo: slot 0 = davanti, 1 = dietro a destra, 2 = dietro a sinistra
    const slots = [null, null, null];
    for (const p of v.pax) if (p.n >= 2) { slots[1] = { gone: p.gone, eyes: v.mirror }; slots[2] = { gone: p.gone, eyes: v.mirror }; }
    for (const p of v.pax) if (!(p.n >= 2)) { const i = slots.findIndex((q) => !q); if (i >= 0) slots[i] = { gone: p.gone, eyes: false }; }
    // dissolvenze: entra in un attimo, esce subito se scende, sfuma in tre secondi se sparisce
    const m = this._mir || (this._mir = { a: [0, 0, 0], t });
    const dt = Math.min(0.1, Math.max(0, t - m.t)); m.t = t;
    for (let i = 0; i < 3; i++) {
      const q = slots[i], tgt = q && !q.gone ? 1 : 0, rate = tgt ? 1.6 : q ? 0.35 : 3;
      m.a[i] += Math.sign(tgt - m.a[i]) * Math.min(Math.abs(tgt - m.a[i]), rate * dt);
    }
    const mono = '#04050a';
    // cornice, attacco al tetto, vetro
    g.fillStyle = '#06070c'; g.fillRect(cx - 4, 0, 8, y - 2); g.fillRect(x - 2, y - 3, MW + 4, MH + 6); g.fillRect(x - 3, y - 2, MW + 6, MH + 4);
    g.fillStyle = '#272d42'; g.fillRect(x - 1, y - 3, MW + 2, 1);
    g.save(); g.beginPath(); g.rect(x, y, MW, MH); g.clip();
    const gr = g.createLinearGradient(0, y, 0, y + MH); gr.addColorStop(0, '#0d1424'); gr.addColorStop(1, '#05070d'); g.fillStyle = gr; g.fillRect(x, y, MW, MH);
    // lunetta con il bagliore della strada dietro e i lampioni che si allontanano verso il centro
    const wx = x + 12, ww = MW - 24, wy = y + 3, wh = 14;
    const wg = g.createLinearGradient(0, wy, 0, wy + wh); wg.addColorStop(0, '#1b2444'); wg.addColorStop(1, '#4a3a6e'); g.fillStyle = wg; g.fillRect(wx, wy, ww, wh);
    const d = (game.s.dist || 0) * 0.035;
    for (let i = 0; i < 6; i++) {
      const ph = (d + i / 6) % 1, r = 1 - ph, lx = Math.round(cx + (i % 2 ? 1 : -1) * (3 + r * (ww / 2 - 4))), ly = wy + wh - 4 - Math.round(r * 2);
      g.fillStyle = `rgba(255,184,90,${0.15 + 0.6 * r})`; g.fillRect(lx, ly, r > 0.5 ? 2 : 1, 1);
    }
    g.fillStyle = '#080b16'; g.fillRect(x, y + 17, MW, MH - 17);                 // sedili e cappelliera
    const head = (px, hy, w, a, eyes, cap) => {   // sagoma vista da dietro: testa a righe, collo, spalle (il guidatore ha il cappellino)
      if (a < 0.02) return;
      g.globalAlpha = a; g.fillStyle = mono;
      g.fillRect(px - w / 2 + 1, hy, w - 2, 1); g.fillRect(px - w / 2, hy + 1, w, w - 2); g.fillRect(px - w / 2 + 1, hy + w - 1, w - 2, 1);
      if (cap) { g.fillRect(px - w / 2 - 1, hy + 2, w + 2, 1); g.fillRect(px - w / 2 + 1, hy - 1, w - 2, 1); }
      g.fillRect(px - 1, hy + w, 2, 2); g.fillRect(px - w, hy + w + 2, w * 2, 2); g.fillRect(px - w - 1, hy + w + 4, w * 2 + 2, 14);
      if (eyes) { g.globalAlpha = a * (0.55 + 0.45 * Math.sin(t * 2.1)); g.fillStyle = '#dfe6ff'; g.fillRect(px - 2, hy + 3, 1, 1); g.fillRect(px + 1, hy + 3, 1, 1); }
      g.globalAlpha = 1;
    };
    head(cx + 10, y + 7, 6, m.a[1], slots[1] && slots[1].eyes);                  // dietro a destra
    head(cx - 10, y + 7, 6, m.a[2], slots[2] && slots[2].eyes);                  // dietro a sinistra
    for (const px of [cx - 28, cx + 28]) { g.fillStyle = '#0c0f1b'; g.fillRect(px - 7, y + 9, 14, 10); }   // poggiatesta anteriori
    head(cx - 28, y + 8, 8, 1, false, true);                                           // il guidatore c'è sempre
    head(cx + 28, y + 8, 8, m.a[0], slots[0] && slots[0].eyes);                  // davanti, a destra
    g.fillStyle = 'rgba(190,205,255,.05)'; g.fillRect(x, y, MW, 2);              // riflesso del vetro
    g.restore();
  };

  // Lo specchietto sta fisso in alto sullo schermo, anche quando l'inquadratura si stringe: si disegna a parte, a pixel
  // pieni, dopo lo zoom (present). drawTripFx lo prenota a ogni fotogramma.
  S.paintMirror = function () {
    const R = this._mirReq; this._mirReq = null; if (!R) return;
    const MW = 108, MH = 30, CW = MW + 8, CH = MH + 14;
    if (!this._mirCv) { this._mirCv = document.createElement('canvas'); this._mirCv.width = CW * 2; this._mirCv.height = CH * 2; }
    const mg = this._mirCv.getContext('2d'); mg.setTransform(2, 0, 0, 2, 0, 0); mg.clearRect(0, 0, CW, CH);
    this.drawMirror(mg, R.game, R.v, R.t);
    const c = this.ctx, u = this.canvas.height / this.LH;
    c.save(); c.imageSmoothingEnabled = false; c.globalAlpha = 1 - Math.min(1, (R.v.blackout || 0) * 1.3);
    c.drawImage(this._mirCv, Math.round(this.canvas.width / 2 - CW * u / 2), 0, Math.round(CW * u), Math.round(CH * u));
    c.restore();
  };
  const presentBase = S.present;
  S.present = function (shake, shakeX) { presentBase.call(this, shake, shakeX); if (this.visible) this.paintMirror(); };

  // colpi di sonno, palpebre pesanti, chilometri che impazziscono
  S.drawTripFx = function (g, game, t) {
    const v = game.vgView && game.vgView(); if (!v) return;
    const W = this.LW, H = 360, sl = v.needs.sleep;
    this._mirReq = game.inside ? null : { game, v, t };
    if (this.palpebre && typeof senApertura === 'function') {   // sensi.js: occhi che si chiudono (sonno e colpi di sonno)
      this.palpebre(g, senApertura(sl, t, v.blackout || 0));
    } else {
      if (sl < 0.35) {   // vignetta che si stringe
        const a = Math.min(0.75, (0.35 - sl) * 2.2) * (0.75 + 0.25 * Math.sin(t * 1.3));
        const gr = g.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, W * 0.62); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${a})`);
        g.fillStyle = gr; g.fillRect(0, 0, W, H);
      }
      if (v.blackout > 0) { g.fillStyle = `rgba(0,0,0,${Math.min(1, v.blackout * 1.3)})`; g.fillRect(0, 0, W, H); }
    }
    if (v.mirror && Math.random() < 0.02) { g.fillStyle = 'rgba(200,210,255,.08)'; g.fillRect(0, 0, W, H); }
    if (v.glitch > 0) {
      const big = String(Math.floor(41200 + Math.random() * 9e5)), w = this.textW(big, 4);
      g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(W / 2 - w / 2 - 10, 120, w + 20, 34); this.text(g, big, Math.round(W / 2 - w / 2), 127, '#ff3a3a', 4);
    }
  };
})();
