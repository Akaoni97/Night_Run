// ============================================================================
//  Dettagli della vista 2D a densità doppia (si aggancia a Street2D, dopo effetti2d.js):
//  - tileHD: le tessere dei palazzi, disegnate a 360 righe, si portano a 720 arrotondando spigoli e diagonali
//    (algoritmo Scale2x) e aggiungendo grana, mattoni sui muri, riflessi sui vetri e luce dalla strada;
//  - damaged: i danni dell'auto costruiti sul suo disegno: muso accartocciato, ammaccature con luce e ombra,
//    graffi, vernice saltata, faro rotto, parabrezza crepato, fuliggine.
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, rnd = Street2D.rnd;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const vn = (x) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return rnd(i) * (1 - u) + rnd(i + 1) * u; };

  // ---------------------------------------------------------------- palazzi a densità doppia
  // layer: 'mid' (vicini: tutti i dettagli), 'far' (solo spigoli e un filo di grana), 'haze' (solo spigoli).
  S.tileHD = function (t, layer) {
    t.hd = true;
    const src = t.c, w = src.width, h = src.height; if (!w || !h) return;
    const sd = src.getContext('2d').getImageData(0, 0, w, h), s32 = new Uint32Array(sd.data.buffer);
    const c = document.createElement('canvas'); c.width = w * 2; c.height = h * 2;
    const x = c.getContext('2d'), im = x.createImageData(w * 2, h * 2), d32 = new Uint32Array(im.data.buffer), d = im.data, W2 = w * 2;
    // colori del muro: i due più frequenti tra quelli né scuri né luminosi (solo sui palazzi vicini)
    const wall = new Set();
    if (layer === 'mid') {
      const cnt = new Map(); let tot = 0;
      for (let i = 0; i < s32.length; i++) { const v = s32[i]; if (v >>> 24 !== 255) continue; tot++; const l = ((v & 255) + ((v >> 8) & 255) + ((v >> 16) & 255)) / 3; if (l > 34 && l < 150) cnt.set(v, (cnt.get(v) || 0) + 1); }
      [...cnt.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).forEach(([v, n]) => { if (n > tot * 0.07) wall.add(v); });
    }
    const isWall = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) {
      const i = y * w + xx, P = s32[i], A = y > 0 ? s32[i - w] : P, D = y < h - 1 ? s32[i + w] : P, C = xx > 0 ? s32[i - 1] : P, B = xx < w - 1 ? s32[i + 1] : P;
      const o = (y * 2) * W2 + xx * 2;
      d32[o] = C === A && C !== D && A !== B ? A : P; d32[o + 1] = A === B && A !== C && B !== D ? B : P;
      d32[o + W2] = D === C && D !== B && C !== A ? C : P; d32[o + W2 + 1] = B === D && B !== A && D !== C ? D : P;
      if (wall.has(P)) isWall[i] = 1;
    }
    if (layer !== 'haze') {
      const H2 = h * 2, seed = w * 7.3 + h, mid = layer === 'mid';
      for (let hy = 0; hy < H2; hy++) for (let hx = 0; hx < W2; hx++) {
        const i = (hy * W2 + hx) * 4; if (d[i + 3] < 255) continue;
        const l = (d[i] + d[i + 1] + d[i + 2]) / 3;
        let f = 1 + (rnd(hx * 12.9898 + hy * 78.233 + seed) - 0.5) * (mid ? 0.08 : 0.05);         // grana
        if (mid) {
          if (l < 150) f *= 0.9 + 0.18 * Math.pow(hy / H2, 2);                                       // la strada schiarisce i piani bassi
          if (isWall[(hy >> 1) * w + (hx >> 1)] && (hy % 4 === 3 || hx % 8 === (((hy >> 2) & 1) ? 0 : 4))) f *= 0.9;   // mattoni
          if (l > 150 && (hx + hy) % 14 < 2) f *= 1.09;                                              // riflesso sui vetri accesi
          else if (l < 40 && d[i + 2] > d[i] + 14 && (hx + hy) % 14 < 2) f *= 1.6;                    // e su quelli spenti
        }
        d[i] = clamp(d[i] * f, 0, 255); d[i + 1] = clamp(d[i + 1] * f, 0, 255); d[i + 2] = clamp(d[i + 2] * f, 0, 255);
      }
    }
    x.putImageData(im, 0, 0);
    t.c = c;
  };

  // ---------------------------------------------------------------- danni
  // spr: sprite dell'auto (con spr.hd, il disegno a grandezza piena); dmg 0..1; G: geometria nel disegno
  // (ax ruote, wy, wr, head faro, hx/hy testa del pilota). Restituisce uno sprite uguale ma danneggiato (in cache).
  S.damaged = function (spr, dmg, G) {
    if (!spr || !spr.hd || !G || !G.ax) return spr;
    const lv = Math.min(10, Math.ceil(dmg * 10)); if (lv < 1) return spr;
    spr._dm = spr._dm || {}; if (spr._dm[lv]) return spr._dm[lv];
    const dd = lv / 10, b = spr.hd, w = b.width, h = b.height;
    const hc = document.createElement('canvas'); hc.width = w; hc.height = h;
    const x = hc.getContext('2d', { willReadFrequently: true }); x.drawImage(b, 0, 0);
    const im = x.getImageData(0, 0, w, h), p = im.data, o = new Uint8ClampedArray(p);
    const fxw = G.ax[1], wy = G.wy ?? h * 0.75, wr = G.wr ?? 14, head = G.head || [w - 8, wy - wr * 1.1], hy = G.hy || 0, hx = G.hx || w * 0.55, seed = w * 3.1 + h;
    const ok = (xx, yy) => xx >= 0 && yy >= 0 && xx < w && yy < h && p[(yy * w + xx) * 4 + 3] > 0;
    const mul = (xx, yy, f) => { xx = Math.round(xx); yy = Math.round(yy); if (!ok(xx, yy)) return; const i = (yy * w + xx) * 4; p[i] = clamp(p[i] * f, 0, 255); p[i + 1] = clamp(p[i + 1] * f, 0, 255); p[i + 2] = clamp(p[i + 2] * f, 0, 255); };
    const mix = (xx, yy, r, g, bl, a) => { xx = Math.round(xx); yy = Math.round(yy); if (!ok(xx, yy)) return; const i = (yy * w + xx) * 4; p[i] += (r - p[i]) * a; p[i + 1] += (g - p[i + 1]) * a; p[i + 2] += (bl - p[i + 2]) * a; };
    // muso accartocciato: la parte davanti alla ruota si accorcia, di più all'altezza del paraurti e in modo irregolare
    const x0 = Math.min(w - 10, Math.round(fxw + wr + 2)), zone = w - x0, cmax = dd > 0.25 ? Math.round((dd - 0.25) * 9) : 0;
    if (cmax > 0) for (let y = 0; y < h; y++) {
      const cy = clamp(Math.round(cmax * (0.4 + 0.6 * vn(y * 0.33 + seed)) * (y > head[1] - 8 ? 1 : 0.55)), 0, zone - 4);
      if (!cy) continue;
      for (let xx = x0; xx < w; xx++) {
        const i = (y * w + xx) * 4;
        if (xx >= w - cy) { p[i + 3] = 0; continue; }
        const j = (y * w + x0 + Math.floor((xx - x0) * zone / (zone - cy))) * 4;
        p[i] = o[j]; p[i + 1] = o[j + 1]; p[i + 2] = o[j + 2]; p[i + 3] = o[j + 3];
        if ((xx - x0) % 5 === 4) { p[i] *= 0.8; p[i + 1] *= 0.8; p[i + 2] *= 0.8; }               // pieghe della lamiera
      }
    }
    const nose = w - Math.round(cmax * 0.7);
    // ammaccature: conche con l'orlo in luce da una parte e in ombra dall'altra; quasi tutte sul muso, qualcuna sulla fiancata
    const nd = Math.round(dd * 8);
    for (let q = 0; q < nd; q++) {
      const front = q < nd * 0.7, cx = front ? x0 - wr + rnd(q * 3.1 + seed) * (nose - x0 + wr - 5) : G.ax[0] + wr + rnd(q * 5.7 + seed) * (fxw - G.ax[0] - 2 * wr);
      const cy = head[1] - 6 + rnd(q * 7.3 + seed) * (wy - head[1] + 4), rx = 3 + rnd(q * 1.9 + seed) * 5, ry = 2 + rnd(q * 4.1 + seed) * 3;
      for (let dy = -Math.ceil(ry); dy <= ry; dy++) for (let dx = -Math.ceil(rx); dx <= rx; dx++) {
        const e = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry); if (e >= 1) continue;
        mul(cx + dx, cy + dy, e > 0.5 ? ((dx / rx + dy / ry) > 0 ? 1.24 : 0.7) : 0.8);
      }
    }
    // graffi: righe chiare (fondo scoperto) quasi orizzontali, spezzate, con un filo d'ombra sotto
    const ns = Math.round(dd * 12);
    for (let q = 0; q < ns; q++) {
      const x1 = G.ax[0] + rnd(q * 2.7 + seed + 3) * (nose - G.ax[0] - 14), y1 = head[1] - 4 + rnd(q * 6.1 + seed) * (wy - head[1] - 2), len = 6 + rnd(q * 9.3 + seed) * 20, sl = (rnd(q * 4.7 + seed) - 0.5) * 0.25;
      for (let k = 0; k < len; k++) { if (rnd(q * 31 + k + seed) > 0.86) continue; mix(x1 + k, y1 + k * sl, 196, 202, 212, 0.72); mix(x1 + k, y1 + k * sl + 1, 10, 12, 18, 0.32); }
    }
    // vernice saltata sul muso: fondo grigio, lamiera scura, un po' di ruggine quando il danno è vecchio e grave
    const nc = Math.round(dd * 30);
    for (let q = 0; q < nc; q++) {
      const cx = x0 - 6 + rnd(q * 3.3 + seed + 9) * (nose - x0 + 4), cy = head[1] - 6 + rnd(q * 8.9 + seed) * (wy + wr * 0.3 - head[1] + 6), t = rnd(q * 5.1 + seed);
      const col = t < 0.5 ? [106, 111, 122] : t < 0.8 || dd < 0.6 ? [52, 55, 64] : [122, 74, 42];
      mix(cx, cy, col[0], col[1], col[2], 0.9); if (t > 0.3) mix(cx + 1, cy, col[0], col[1], col[2], 0.8); if (t > 0.7) mix(cx, cy + 1, col[0], col[1], col[2], 0.7);
    }
    // faro rotto: buco scuro con qualche scheggia di vetro
    if (dd > 0.35) {
      const fx0 = Math.min(head[0], nose - 4), fy0 = head[1];
      for (let dy = -3; dy <= 3; dy++) for (let dx = -5; dx <= 5; dx++) if ((dx * dx) / 25 + (dy * dy) / 9 < 1) mix(fx0 + dx, fy0 + dy, 16, 18, 26, 0.86);
      for (let q = 0; q < 5; q++) mix(fx0 - 4 + rnd(q + seed) * 8, fy0 - 2 + rnd(q * 3 + seed) * 4, 176, 186, 200, 0.9);
    }
    // parabrezza crepato: raggi sottili da un punto davanti al pilota
    if (dd > 0.6) {
      const wx0 = hx + 20, wy0 = 16 + hy;
      for (let q = 0; q < 8; q++) { const a = q / 8 * Math.PI * 2 + rnd(q + seed) * 0.6, len = 4 + rnd(q * 3 + seed) * 7; for (let k = 1; k < len; k++) mix(wx0 + Math.cos(a) * k, wy0 + Math.sin(a) * k * 0.7, 232, 238, 246, 0.6 - k * 0.03); }
    }
    // fuliggine sul cofano
    if (dd > 0.5) {
      const cx = (x0 + nose) / 2, cy = head[1] - 7, rx = (nose - x0) / 2 + 4, ry = 6;
      for (let dy = -ry; dy <= ry; dy++) for (let dx = -Math.ceil(rx); dx <= rx; dx++) { const e = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry); if (e < 1 && Street2D.bayer(Math.round(cx + dx), Math.round(cy + dy)) > e) mix(cx + dx, cy + dy, 10, 11, 16, 0.4 * (dd - 0.3)); }
    }
    x.putImageData(im, 0, 0);
    // compagno a grandezza di sprite (maschere di luce, ombra, qualità bassa)
    const c = document.createElement('canvas'); c.width = spr.width; c.height = spr.height;
    const cx2 = c.getContext('2d'); cx2.imageSmoothingEnabled = false; cx2.drawImage(hc, 0, 0, c.width, c.height);
    c.hd = hc; c.img = spr.img; c.geo = spr.geo; c.wheelImg = spr.wheelImg; c.wheelHd = spr.wheelHd; c.k = spr.k;
    // disegno ad alta definizione (hd2, densità m): ogni pixel cambiato dal danno cambia il suo quadratino m×m, il resto resta nitido
    if (spr.hd2) {
      const H2 = spr.hd2, m = Math.round(H2.width / w), h2 = document.createElement('canvas'); h2.width = H2.width; h2.height = H2.height;
      const x2c = h2.getContext('2d', { willReadFrequently: true }); x2c.drawImage(H2, 0, 0);
      const im2 = x2c.getImageData(0, 0, h2.width, h2.height), q = im2.data, W2 = h2.width;
      for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
        const i = (yy * w + xx) * 4;
        if (p[i] === o[i] && p[i + 1] === o[i + 1] && p[i + 2] === o[i + 2] && p[i + 3] === o[i + 3]) continue;
        for (let dy = 0; dy < m; dy++) for (let dx = 0; dx < m; dx++) { const j = ((yy * m + dy) * W2 + xx * m + dx) * 4; q[j] = p[i]; q[j + 1] = p[i + 1]; q[j + 2] = p[i + 2]; q[j + 3] = p[i + 3]; }
      }
      x2c.putImageData(im2, 0, 0); c.hd2 = h2;
    }
    return (spr._dm[lv] = c);
  };
})();
