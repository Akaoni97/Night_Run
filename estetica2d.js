'use strict';
// ============================================================================
//  Night Run · Estetica come la V40 per tutte le auto da disegno (v0.176, dopo gomme2d.js)
//  La V40 ha da sempre cerchi in lega a codice (5 razze e a raggi), kit leggero (labbro, minigonne, diffusore), spoiler sul
//  portellone, intercooler frontale dietro il paraurti e scritta TURBO coi turbo grossi. Qui gli stessi pezzi per tutte le
//  auto di GEN_CARS (catalogo in cars.js), misurati sulla sagoma di ognuna (`estProfilo`: per ogni colonna del disegno il
//  primo e l'ultimo pixel pieno, il colore medio della vernice): niente coordinate scritte a mano per auto.
//  Lo spoiler cambia forma: sul tetto per le due volumi, le familiari e i furgoni, alettone sul baule per le berline
//  (baule molto più basso del tetto). Col kit completo del disegno tuning niente kit leggero né spoiler (li ha già).
//  Si aggancia a `genBase` (strati sul disegno, in cache come il resto) e a `genWheel` (cerchi a codice).
//  Prove: `window.NightEstetica.profilo()` per l'auto in uso.
// ============================================================================
(function estetica2d() {
  if (typeof Street2D === 'undefined' || typeof document === 'undefined') return;
  const S = Street2D.prototype;
  const EST = { plastica: '#1a1d24', costa: '#3a4048', ic: '#9aa3b2', alette: '#5a6070', turbo: '#e8ecf2', riga: '#c41a1a' };
  const shade = (hex, k) => Street2D.shade(hex, k);
  const med = (a) => { const b = a.filter((v) => v != null).sort((p, q) => p - q); return b.length ? b[b.length >> 1] : null; };

  // la sagoma dell'auto alla misura di sempre: per ogni colonna primo (top) e ultimo (bot) pixel pieno sopra terra,
  // davanti e dietro della parte bassa, colore medio della vernice (dalla maschera)
  function estProfilo(st) {
    const D = st.genDef(), G = st.genImgs(); if (!D || !G.ready || !G.img.width) return null;
    Street2D._estP = Street2D._estP || {};
    const key = st.genKey(); if (Street2D._estP[key]) return Street2D._estP[key];
    const W = D.w, H = D.h, c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d', { willReadFrequently: true }); x.imageSmoothingEnabled = false;
    x.drawImage(Street2D.spritePulito(G.img, D.img), 0, 0, W, H);
    const d = x.getImageData(0, 0, W, H).data, terra = Math.min(H, Math.round(D.wy + D.wr));
    const top = [], bot = [];
    for (let xx = 0; xx < W; xx++) {
      top[xx] = null; bot[xx] = null;
      const pieno = (y) => d[(y * W + xx) * 4 + 3] > 128;
      for (let y = 0; y < terra; y++) if (pieno(y)) { if (top[xx] == null && pieno(y + 1) && pieno(y + 2) && pieno(y + 3)) top[xx] = y; bot[xx] = y; }   // in alto: 4 pixel pieni di fila (le antenne non contano)
    }
    // e mediana su 5 colonne: via anche specchietti e tergicristalli
    const top0 = top.slice(); for (let xx = 0; xx < W; xx++) top[xx] = med(top0.slice(Math.max(0, xx - 2), xx + 3));
    // la parte bassa (sotto il centro delle ruote): dove finisce l'auto davanti e dietro
    const basso = (xx) => { for (let y = Math.round(D.wy - D.wr * 0.6); y < terra; y++) if (d[(y * W + xx) * 4 + 3] > 128) return true; return false; };
    let rear = 0, front = W - 1; while (rear < W - 1 && !basso(rear)) rear++; while (front > 0 && !basso(front)) front--;
    // colore della vernice: media dei pixel della maschera, né troppo scuri né riflessi
    let col = '#6a6e78';
    if (G.paint && G.paint.width) {
      const mc = document.createElement('canvas'); mc.width = W; mc.height = H; const mx = mc.getContext('2d', { willReadFrequently: true }); mx.drawImage(G.paint, 0, 0, W, H);
      const m = mx.getImageData(0, 0, W, H).data; let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < d.length; i += 4) { if (m[i + 3] < 128 || d[i + 3] < 128) continue; const L = (d[i] + d[i + 1] + d[i + 2]) / 3; if (L < 30 || L > 215) continue; r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
      if (n > 20) col = '#' + [r, g, b].map((v) => Math.round(v / n).toString(16).padStart(2, '0')).join('');
    }
    return (Street2D._estP[key] = { W, H, top, bot, rear, front, terra, col });
  }

  // gli strati sul disegno, in unità dello sprite (m = 2: a densità doppia, coi dettagli a mezza unità)
  function strati(st, x, m) {
    const D = st.genDef(), P = estProfilo(st); if (!D || !P) return;
    const C0 = st.cos || {}, L = st.carLook || {}, tuning = C0.kit === 'tuning';
    const kit = C0.kit === 'kit', spoiler = C0.spoiler === 'roof' && !tuning, fmic = !!L.fmic, turbo2 = !!L.turbo2;
    if (!kit && !spoiler && !fmic && !turbo2) return;
    const q = (v) => Math.round(v * m) / m;                                   // al pixel vero più vicino
    const box = (col, a, b, w, h) => { if (w <= 0 || h <= 0) return; x.fillStyle = col; x.fillRect(q(a), q(b), q(w) || 1 / m, q(h) || 1 / m); };
    const u = 1 / m, ink = st.C.ink, hex = st.v40Paint && st.v40Paint !== 'orig' ? st.v40Paint : P.col;
    const ax0 = D.ax[0], ax1 = D.ax[1], wr = D.wr, suolo = P.terra - 2.5;   // niente sotto i 2,5 px da terra
    const span = (a, b, f) => { const out = []; for (let xx = Math.max(0, Math.round(a)); xx <= Math.min(P.W - 1, Math.round(b)); xx++) out.push(f(xx)); return out; };
    x.save(); x.setTransform(m, 0, 0, m, 0, 0);
    if (kit) {
      // minigonne tra i passaruota, sul fondo della fiancata
      const xs = ax0 + wr * 1.15, xe = ax1 - wr * 1.15, ys = Math.min(suolo - 3, med(span(xs, xe, (xx) => P.bot[xx])));
      box(ink, xs, ys - 1, xe - xs, 4); box(shade(hex, -0.25), xs + u, ys - 1 + u, xe - xs - 2 * u, 2); box(shade(hex, 0.15), xs + u, ys - 1 + u, xe - xs - 2 * u, u);
      box(EST.plastica, xs + u, ys + 1, xe - xs - 2 * u, 2 - u);
      // labbro anteriore sotto il paraurti, che sporge di un filo
      const fx = ax1 + wr * 1.1, yf = Math.min(suolo - 1, Math.max(...span(fx, P.front, (xx) => P.bot[xx] ?? 0)));
      box(ink, fx, yf - 0.5, P.front - fx + 2, 3); box(EST.plastica, fx + u, yf, P.front - fx + 1, 2 - u); box(EST.costa, fx + 2, yf, P.front - fx - 2, u);
      // diffusore dietro, con le alette
      const rx = ax0 - wr * 1.1, yr = Math.min(suolo - 1, med(span(P.rear + 1, rx, (xx) => P.bot[xx])));
      box(ink, P.rear - 1, yr - 1.5, rx - P.rear + 1, 3.5); box(EST.plastica, P.rear, yr - 1, rx - P.rear - u, 2.5);
      for (let a = P.rear + 2; a < rx - 1; a += 3) box(EST.costa, a, yr - 1, u, 2.5);
    }
    if (spoiler) {
      const roofY = Math.min(...span(P.W * 0.3, P.W * 0.65, (xx) => P.top[xx] ?? 999)), alto = P.terra - roofY, len = P.W * 0.1;
      // il punto più alto della coda (ultimo 12 % dell'auto): sulle due volumi e le familiari è il bordo del tetto, sulle berline il baule
      // berlina: la coda è un baule piatto ben sotto il tetto; due volumi: un portellone inclinato o dritto fino al tetto
      const baule = span(P.rear + P.W * 0.03, P.rear + P.W * 0.1, (xx) => P.top[xx] ?? 999), coda = med(baule);
      if (coda - roofY > alto * 0.15 && Math.max(...baule) - Math.min(...baule) <= 3) {
        // berlina: alettone sul baule, su due supporti; il piano del baule è la mediana delle colonne della coda
        const xa = P.rear + 1.5, xb = xa + P.W * 0.11, yt = med(span(xa + 2, xb, (xx) => P.top[xx])), yb = yt - 4;
        for (const sx of [xa + (xb - xa) * 0.28, xa + (xb - xa) * 0.75]) { box(ink, sx - 1.5, yb + 1, 3, yt - yb + 1); box(shade(hex, -0.35), sx - 0.5, yb + 2, 1, yt - yb - 1); }
        box(ink, xa - 1.5, yb - 1, xb - xa + 2.5, 3.5); box(shade(hex, 0.05), xa - 1, yb - 0.5, xb - xa + 1.5, 2.5); box(shade(hex, 0.4), xa - 1, yb - 0.5, xb - xa + 1.5, u);
        box(ink, xa - 2, yb - 2, 2, 5);                                     // paratia
      } else {
        // due volumi, familiari e furgoni: spoiler appoggiato sul bordo del tetto, che sporge un filo oltre il portellone
        // il bordo del tetto: dove la coda arriva all'altezza del tetto (mediana del tetto: la base dell'antenna non conta); lo spoiler ci poggia e sporge dietro
        const tetto = med(span(P.W * 0.25, P.W * 0.6, (xx) => P.top[xx]));
        let xt = P.rear; while (xt < P.W * 0.4 && (P.top[xt] == null || P.top[xt] > tetto + 4)) xt++;
        const yt = med(span(xt, xt + len * 0.5, (xx) => P.top[xx])) ?? tetto, xa = Math.max(P.rear - 1, xt - len * 0.4);
        box(ink, xa, yt - 3, len, 4); box(shade(hex, 0.05), xa + u, yt - 3 + u, len - 2 * u, 2.5); box(shade(hex, 0.35), xa + u, yt - 3 + u, len - 2 * u, u);
        box(ink, xa - u, yt - 2, 1.5, 3.5);                                 // bordo che scende sul lunotto
      }
    }
    if (fmic) {
      // intercooler frontale dietro la griglia bassa del paraurti
      const bf = Math.min(suolo - 1, P.bot[Math.max(0, P.front - 6)] ?? suolo), hy = D.head ? D.head[1] : bf - 12;
      const y0 = Math.round(hy + (bf - hy) * 0.45), x1 = P.front - 2, x0 = Math.max(ax1 + wr * 1.05, x1 - 15);
      box(ink, x0, y0, x1 - x0, 6); box(EST.ic, x0 + u * 2, y0 + 1, x1 - x0 - 4 * u, 4);
      for (let a = x0 + 1; a < x1 - 1; a += 2) box(EST.alette, a, y0 + 1, u, 4);
    }
    if (turbo2) {
      // TURBO sulla fiancata, tra la fiancata dietro e la portiera, con la riga rossa sotto
      const sd = (D.slots || {}).st_door, sr = (D.slots || {}).st_rear;
      const cx = sd && sr ? (sr[0] + sr[2] + sd[0]) / 2 : (ax0 + ax1) / 2, cy = sd ? sd[1] - 1 : D.wy - wr * 1.4;
      st.text(x, 'TURBO', Math.round(cx - 9), Math.round(cy) + 1, ink); st.text(x, 'TURBO', Math.round(cx - 10), Math.round(cy), EST.turbo);
      box(EST.riga, cx - 10, cy + 6.5, 20, 1.5);
    }
    x.restore();
  }

  // ---- il vano ruota (v0.178): nei disegni delle auto il passaruota è un buco trasparente e la ruota si disegna a parte;
  // dove la gomma è più piccola del buco, o tra le razze, si vedeva la strada. Qui il buco (dal bordo dell'arco fino alla
  // linea della fiancata: sotto resta la strada, come sotto un'auto vera) prende il vano: rivestimento scuro con le
  // nervature, ammortizzatore con la molla, braccio della sospensione verso il centro dell'auto. Solo pixel trasparenti:
  // il disegno non cambia. D = sprite (ax, wy, wr, w), m = densità della tela (1 o 2). Anche per traffico e camion.
  const VANO = { fondo: '#0a0b0f', bordo: '#050507', nervo: 'rgba(255,255,255,.045)', molla: ['#8a919e', '#3a3e47'], stelo: '#4a505b', braccio: '#262a32' };
  Street2D.passaruota = function (c, m, D) {
    if (!c || !c.width || !D || !D.ax || c._vano) return; c._vano = true;
    const W = c.width, H = c.height, x = c.getContext('2d', { willReadFrequently: true }), img = x.getImageData(0, 0, W, H), d = img.data;
    const pieno = (px, py) => px >= 0 && py >= 0 && px < W && py < H && d[(py * W + px) * 4 + 3] > 100;
    const mask = new Uint8Array(W * H); let tot = 0;
    const R = D.wr * m;
    for (const ax of D.ax) {
      const A = Math.round(ax * m), Y = Math.round(D.wy * m), lim = Math.round(R * 1.9);
      let dentro = false;
      for (let py = Math.max(0, Y - Math.round(R * 1.6)); py < Math.min(H, Y + R); py++) {
        if (pieno(A, py)) { if (dentro) break; continue; }          // sopra l'arco: carrozzeria
        let xl = A, xr = A;
        while (xl > A - lim && !pieno(xl - 1, py)) xl--;
        while (xr < A + lim && !pieno(xr + 1, py)) xr++;
        if (xl <= A - lim || xr >= A + lim || !pieno(xl - 1, py) || !pieno(xr + 1, py)) { if (dentro) break; continue; }   // sotto la fiancata: si apre
        dentro = true;
        for (let px = xl; px <= xr; px++) { mask[py * W + px] = 1; tot++; }
      }
    }
    if (!tot) return;
    const L = document.createElement('canvas'); L.width = W; L.height = H;
    const g = L.getContext('2d'); g.setTransform(m, 0, 0, m, 0, 0);
    const u = 1 / m, r = D.wr, mezzo = (D.w || W / m) / 2;
    for (const ax of D.ax) {
      const cy = D.wy, verso = ax < mezzo ? 1 : -1;
      const gr = g.createRadialGradient(ax, cy, r * 0.2, ax, cy, r * 1.5);
      gr.addColorStop(0, '#15171d'); gr.addColorStop(0.7, VANO.fondo); gr.addColorStop(1, VANO.bordo);
      g.fillStyle = gr; g.fillRect(ax - r * 2, cy - r * 1.7, r * 4, r * 2.8);
      g.fillStyle = VANO.nervo; for (let q = -r * 1.8; q < r * 1.8; q += 2) g.fillRect(ax + q, cy - r * 1.7, u, r * 2.8);   // nervature del rivestimento
      // braccio della sospensione, dal mozzo verso il centro dell'auto
      g.strokeStyle = VANO.braccio; g.lineWidth = 2; g.beginPath(); g.moveTo(ax, cy + r * 0.1); g.lineTo(ax + verso * r * 1.6, cy + r * 0.35); g.stroke();
      // ammortizzatore con la molla, dalla cupola in alto al mozzo
      const sx = ax + verso * r * 0.18, top = cy - r * 1.55, bw = Math.max(1.5, r * 0.18), mw = Math.max(3, r * 0.5);
      g.fillStyle = VANO.stelo; g.fillRect(sx - bw / 2, top, bw, cy - top);
      g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(sx - bw / 2, top, u, cy - top);
      for (let yy = top + 1; yy < cy - r * 0.35; yy += 2.2) {              // spire della molla
        g.fillStyle = VANO.molla[1]; g.fillRect(sx - mw / 2, yy + u, mw, 1);
        g.fillStyle = VANO.molla[0]; g.fillRect(sx - mw / 2, yy, mw, Math.max(u, 0.6));
      }
    }
    const ld = g.getImageData(0, 0, W, H); for (let i = 0; i < mask.length; i++) if (!mask[i]) ld.data[i * 4 + 3] = 0;
    g.putImageData(ld, 0, 0);
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'destination-over'; x.drawImage(L, 0, 0); x.restore();
  };

  const gb = S.genBase;
  S.genBase = function (m = 1) {
    const c = gb.call(this, m);
    if (c && !c._est && c.width && this.genImgs().ready) {
      c._est = true;
      try { Street2D.passaruota(c, m, this.genDef()); } catch (e) { /* senza vano ruota */ }
      try { strati(this, c.getContext('2d', { willReadFrequently: true }), m); } catch (e) { /* senza estetica in più */ }
    }
    return c;
  };

  // cerchi in lega a codice, come quelli della V40 (v40Wheel), alla misura della ruota di ogni auto
  function cerchio(st, g, cx, cy, R, ang, speed, rear, style) {
    g.save(); g.translate(Math.round(cx), Math.round(cy));
    g.fillStyle = '#0b0c10'; g.beginPath(); g.arc(0, 0, R, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#1c1e24'; g.beginPath(); g.arc(0, 0, R * 0.9, 0, Math.PI * 2); g.fill();
    const L = st.carLook || {}, k = R / 14.4;
    st.brake(g, 0, 0, k * (L.low > 0 ? 1.02 : 0.98), ang, rear);
    const blur = speed > 9; g.rotate(blur ? ang : Math.round(ang / (Math.PI / 20)) * (Math.PI / 20));
    const rc = st.cos && st.cos.rims && st.cos.rims !== 'none' ? st.cos.rims : '#c9ced6';
    g.strokeStyle = rc; g.lineWidth = Math.max(1, 1.2 * k); g.beginPath(); g.arc(0, 0, R * 0.7, 0, Math.PI * 2); g.stroke();
    if (style === 'mesh') {
      g.lineWidth = Math.max(1, 0.7 * k); g.globalAlpha = blur ? 0.5 : 1;
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.beginPath(); g.moveTo(Math.cos(a) * R * 0.2, Math.sin(a) * R * 0.2); g.lineTo(Math.cos(a + 0.35) * R * 0.68, Math.sin(a + 0.35) * R * 0.68); g.stroke(); }
      g.globalAlpha = 1;
    } else for (let i = 0; i < 5; i++) {
      g.save(); g.rotate(i * Math.PI * 2 / 5); g.globalAlpha = blur ? 0.55 : 1;
      g.fillStyle = rc; g.fillRect(-1.3 * k, -R * 0.68, 2.6 * k, R * 0.48); g.fillStyle = '#eef2f6'; g.fillRect(-1.3 * k, -R * 0.68, 0.9 * k, R * 0.48); g.restore();
    }
    g.fillStyle = '#8a909c'; g.beginPath(); g.arc(0, 0, R * 0.2, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  const gw = S.genWheel;
  S.genWheel = function (g, cx, cy, k, ang, speed = 0, rear = false) {
    const style = (this.cos || {}).wheels, D = this.genDef();
    if (D && (!style || style === 'none')) {
      // dietro le razze: il piatto scuro del mozzo, fino al bordo del cerchio (i vuoti tra le razze sono trasparenti per far
      // vedere il disco del freno, ma il disco non arriva al cerchio e fuori si vedeva la strada; v0.178)
      g.save(); g.fillStyle = '#0c0d11'; g.beginPath(); g.arc(Math.round(cx), Math.round(cy), Street2D.raggioGrafico(D) * k * 0.7, 0, Math.PI * 2); g.fill(); g.restore();
    }
    if (!D || !style || style === 'none') return gw.call(this, g, cx, cy, k, ang, speed, rear);
    const R = Street2D.raggioGrafico(D) * k;
    cerchio(this, g, cx, cy, R, ang, speed, rear, style);
    if (this.tireFx) this.tireFx(g, cx, cy, R, ang, speed, { rim: 0.66 });
  };

  if (typeof window !== 'undefined') window.NightEstetica = { profilo: () => { const v = window.nightRun && window.nightRun.view2d; return v && v.genDef() ? estProfilo(v) : null; }, EST };
})();
