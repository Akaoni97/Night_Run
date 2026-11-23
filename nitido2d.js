// ============================================================================
//  Night Run · Grafica più nitida (dopo entrata2d.js: avvolge Street2D)
//  La scena si disegna su una tela a 360 righe (720 con la densità doppia) e poi si ingrandisce sullo schermo.
//  Su uno schermo vero il rapporto non è quasi mai intero (720 → 1022 righe in una finestra a 1080p: ×1,42) e
//  l'ingrandimento a pixel netti faceva pixel larghi a volte 1 e a volte 2: righe che cambiano spessore, scritte storte.
//  Qui:
//  - blit: ingrandimento «nitido e regolare»: prima ×2 (o ×3) a pixel netti, poi un passo morbido fino alla misura
//    vera dello schermo. Ogni pixel della scena diventa grande uguale, con il bordo appena sfumato (niente pixel
//    doppi e niente sfocatura). Con un rapporto intero resta a pixel netti.
//  - carrozzerie (body): i disegni del proprietario passano per Scale2x (diagonali e curve senza scalini, colori e
//    contorni del disegno identici) e si portano una volta sola alla misura vera della corsia (bodyHD, in cache):
//    niente pixel doppi, e inclinate (beccheggio, schiacciamento) restano pulite. Contorno scuro, luce di contorno,
//    riflessi dei lampioni e velo della foschia seguono la stessa sagoma, alla densità vera (un pixel di schermo).
//  - ruote (wheelDraw): la ruota del disegno a densità doppia che gira liscia, invece di rifare gli scalini a ogni
//    rotazione.
//  - bagliore più netto: si illuminano le luci vere (neon, fari, lampade), non c'è più il velo su tutta la scena.
//  Con qualità bassa o leggera (densità semplice) tutto resta com'era. `street2d.sharp = false` spegne tutto (prove).
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype;
  const on = (v) => (v.SS || 1) > 1 && v.sharp !== false;

  // ---------------------------------------------------------------- Scale2x (EPX), in cache sulla tela d'origine
  // Ogni pixel diventa 2×2: un angolo prende il colore dei due vicini quando quei due sono uguali (e diversi dagli altri
  // due). Le diagonali a scalini diventano linee, le curve si arrotondano; nessun colore nuovo, contorni uguali.
  const x2 = (src) => {
    if (!src || !src.width) return src;
    if (src._x2) return src._x2;
    const w = src.width, h = src.height, t = document.createElement('canvas'); t.width = w; t.height = h;
    const tx = t.getContext('2d', { willReadFrequently: true }); tx.drawImage(src, 0, 0);
    const sd = tx.getImageData(0, 0, w, h), s32 = new Uint32Array(sd.data.buffer), W2 = w * 2;
    for (let i = 0; i < s32.length; i++) if ((s32[i] >>> 24) < 8) s32[i] = 0;          // trasparenti tutti uguali
    const c = document.createElement('canvas'); c.width = W2; c.height = h * 2;
    const x = c.getContext('2d', { willReadFrequently: true }), im = x.createImageData(W2, h * 2), d32 = new Uint32Array(im.data.buffer);
    for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) {
      const i = y * w + xx, P = s32[i], A = y > 0 ? s32[i - w] : P, D = y < h - 1 ? s32[i + w] : P, C = xx > 0 ? s32[i - 1] : P, B = xx < w - 1 ? s32[i + 1] : P;
      const o = (y * 2) * W2 + xx * 2;
      d32[o] = C === A && C !== D && A !== B ? A : P; d32[o + 1] = A === B && A !== C && B !== D ? B : P;
      d32[o + W2] = D === C && D !== B && C !== A ? C : P; d32[o + W2 + 1] = B === D && B !== A && D !== C ? D : P;
    }
    x.putImageData(im, 0, 0);
    try { src._x2 = c; } catch (e) { /* oggetto non estendibile: niente cache */ }
    return c;
  };
  Street2D.x2 = x2;

  // ---------------------------------------------------------------- presentazione: ingrandimento nitido e regolare
  // c = contesto dello schermo; (sx, sy, sw, sh) = rettangolo della tela interna in pixel veri; (dx, dy, dw, dh) = dove va
  S.blit = function (c, sx, sy, sw, sh, dx, dy, dw, dh) {
    const k = dh / sh;
    // tela dello schermo già a multiplo intero (fitScreen di street2d.js, v0.134): una passata a pixel netti, il resto lo fa il browser
    if (this.sharp === false || k < 1.02 || Math.abs(k - Math.round(k)) < 0.01 || this._ir === 'auto') {
      c.imageSmoothingEnabled = k < 0.99; c.imageSmoothingQuality = k >= 0.5 ? 'low' : 'medium';   // rimpicciolire poco: basta la sfumatura semplice ('high' rifaceva le mipmap a ogni fotogramma)
      c.drawImage(this.lo, sx, sy, sw, sh, dx, dy, dw, dh);
      c.imageSmoothingEnabled = false; return;
    }
    const n = Math.min(4, Math.ceil(k)), uw = Math.round(sw * n), uh = Math.round(sh * n);
    // la tela di mezzo cresce e basta: con lo zoom e le scosse la misura cambierebbe a ogni fotogramma, e rifarla ogni
    // volta (memoria nuova sulla scheda video) costava più dell'ingrandimento. Si usa solo l'angolo in alto a sinistra.
    const up = this._up || (this._up = document.createElement('canvas'));
    if (up.width < uw || up.height < uh) { up.width = Math.max(up.width, uw + 16); up.height = Math.max(up.height, uh + 16); }
    const ux = up.getContext('2d'); ux.imageSmoothingEnabled = false;
    ux.drawImage(this.lo, sx, sy, sw, sh, 0, 0, uw, uh);                               // ×n a pixel netti
    // giù alla misura vera: si rimpicciolisce sempre meno della metà, basta la sfumatura semplice ('low'). 'medium' rifaceva
    // a ogni fotogramma le copie rimpicciolite (mipmap) di una tela da milioni di pixel, per lo stesso risultato.
    c.imageSmoothingEnabled = true; c.imageSmoothingQuality = this.blitQ || 'low';
    c.drawImage(up, 0, 0, uw, uh, dx, dy, dw, dh);                                      // poi giù alla misura vera, morbido
    c.imageSmoothingEnabled = false;
  };

  // ---------------------------------------------------------------- carrozzerie alla densità vera
  // bodyHD(spr): il disegno Scale2x portato a (larghezza dello sprite × SS): è quello che si vede sullo schermo
  const bodyHD = function (spr) {
    const SS = this.SS || 1, key = 'b' + SS;
    spr._hd2 = spr._hd2 || {};
    if (spr._hd2[key]) return spr._hd2[key];
    const src = spr.hd2 || x2(spr.hd), W = spr.width * SS, H = spr.height * SS, c = document.createElement('canvas'); c.width = W; c.height = H;   // hd2: disegno già ad alta definizione (strumenti/disegni_hd.py)
    const x = c.getContext('2d', { willReadFrequently: true }), exact = src.width === W && src.height === H;
    x.imageSmoothingEnabled = !exact; x.imageSmoothingQuality = 'high'; x.drawImage(src, 0, 0, W, H);
    if (!exact) {   // bordo della sagoma netto: niente aloni mezzi trasparenti attorno all'auto
      const im = x.getImageData(0, 0, W, H), d = im.data;
      for (let i = 3; i < d.length; i += 4) { const a = d[i]; if (a < 96) d[i] = 0; else if (a < 255) { const f = 255 / a; d[i - 3] = Math.min(255, d[i - 3] * f); d[i - 2] = Math.min(255, d[i - 2] * f); d[i - 1] = Math.min(255, d[i - 1] * f); d[i] = 255; } }
      x.putImageData(im, 0, 0);
    }
    return (spr._hd2[key] = c);
  };
  S.bodyHD = bodyHD;
  const axisOk = (g, SS) => {
    const m = g.getTransform ? g.getTransform() : null; if (!m) return true;
    return Math.abs(m.b) < 1e-4 && Math.abs(m.c) < 1e-4 && Math.abs(m.a - SS) < 1e-3 && Math.abs(m.d - SS) < 1e-3;
  };
  const body0 = S.body;
  S.body = function (g, spr, x, y) {
    if (!(spr.hd || spr.hd2) || !on(this)) return body0.call(this, g, spr, x, y);
    const SS = this.SS, hd = bodyHD.call(this, spr), sm = g.imageSmoothingEnabled, q = g.imageSmoothingQuality;
    g.imageSmoothingEnabled = !axisOk(g, SS); g.imageSmoothingQuality = 'high';
    g.drawImage(hd, 0, 0, hd.width, hd.height, x, y, spr.width, spr.height);
    g.imageSmoothingEnabled = sm; g.imageSmoothingQuality = q;
  };
  // sagoma scura (contorno dell'auto del giocatore) alla densità vera
  const silHD = function (spr) {
    const SS = this.SS || 1, key = 's' + SS; spr._hd2 = spr._hd2 || {};
    if (spr._hd2[key]) return spr._hd2[key];
    const b = bodyHD.call(this, spr), c = document.createElement('canvas'); c.width = b.width; c.height = b.height;
    const x = c.getContext('2d'); x.drawImage(b, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = 'rgb(4,5,12)'; x.fillRect(0, 0, c.width, c.height);
    return (spr._hd2[key] = c);
  };
  const outline0 = S.heroOutline;
  if (outline0) S.heroOutline = function (g, spr) {
    if (!spr.hd || !on(this)) return outline0.call(this, g, spr);
    const sil = silHD.call(this, spr), o = 1 / this.SS, w = spr.width, h = spr.height, sm = g.imageSmoothingEnabled;
    g.save(); g.globalAlpha = 0.95; g.imageSmoothingEnabled = !axisOk(g, this.SS);
    for (const [dx, dy] of [[-o, 0], [o, 0], [0, -o], [0, o]]) g.drawImage(sil, dx, dy, w, h);
    g.restore(); g.imageSmoothingEnabled = sm;
  };
  // luce di contorno (neon che si alternano): un pixel di schermo pieno sul bordo alto e mezzo sotto, lungo la sagoma vera
  const rim0 = S.rimOf;
  S.rimOf = function (spr, col) {
    if (!spr.hd || !on(this)) return rim0.call(this, spr, col);
    const SS = this.SS, key = 'r' + SS + col; spr._hd2 = spr._hd2 || {};
    if (spr._hd2[key]) return spr._hd2[key];
    const b = bodyHD.call(this, spr), w = b.width, h = b.height, d = b.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    const c = document.createElement('canvas'); c.width = w; c.height = h; c.lw = spr.width; c.lh = spr.height;
    const x = c.getContext('2d'), o = x.createImageData(w, h), n = parseInt(col.slice(1), 16), R = n >> 16, G = (n >> 8) & 255, B = n & 255;
    const A = (xx, yy) => (xx < 0 || yy < 0 || xx >= w || yy >= h ? 0 : d[(yy * w + xx) * 4 + 3]);
    for (let yy = 1; yy < h; yy++) for (let xx = 1; xx < w - 1; xx++) {
      if (A(xx, yy) < 128) continue;
      const up = A(xx, yy - 1) < 128, up2 = !up && A(xx, yy - 2) < 128, side = A(xx - 1, yy) < 128 || A(xx + 1, yy) < 128;
      const a = up ? 255 : up2 ? 120 : side && yy < h * 0.6 ? 150 : 0;
      if (!a) continue;
      const i = (yy * w + xx) * 4; o.data[i] = R; o.data[i + 1] = G; o.data[i + 2] = B; o.data[i + 3] = a;
    }
    x.putImageData(o, 0, 0);
    return (spr._hd2[key] = c);
  };
  // velo della foschia sulle auto del traffico: stessa sagoma della carrozzeria
  const haze0 = S.hazeOf;
  if (haze0) S.hazeOf = function (spr, rgb) {
    if (!spr.hd || !on(this)) return haze0.call(this, spr, rgb);
    const key = 'h' + this.SS + rgb; spr._hd2 = spr._hd2 || {};
    if (spr._hd2[key]) return spr._hd2[key];
    const b = bodyHD.call(this, spr), c = document.createElement('canvas'); c.width = b.width; c.height = b.height;
    const x = c.getContext('2d'); x.drawImage(b, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = `rgb(${rgb})`; x.fillRect(0, 0, c.width, c.height);
    return (spr._hd2[key] = c);
  };
  // riflessi dei lampioni e degli stop sulla carrozzeria: sfumature alla densità vera (niente gradini da due pixel)
  const bodyLight0 = S.fxBodyLight;
  if (bodyLight0) S.fxBodyLight = function (g, spr, lights) {
    if (!spr.hd || !on(this)) return bodyLight0.call(this, g, spr, lights);
    if (!lights.length) return;
    const SS = this.SS, b = bodyHD.call(this, spr), W = b.width, H = b.height, w = spr.width, h = spr.height;
    const c = this._litHD || (this._litHD = document.createElement('canvas'));
    if (c.width < W || c.height < H) { c.width = Math.max(c.width, W); c.height = Math.max(c.height, H); }
    const x = c.getContext('2d');
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, W, H);
    x.setTransform(SS, 0, 0, SS, 0, 0); x.globalCompositeOperation = 'lighter';
    for (const l of lights) {
      if (l.r) {
        const gr = x.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r); gr.addColorStop(0, `rgba(${l.col},${l.a})`); gr.addColorStop(1, `rgba(${l.col},0)`);
        x.fillStyle = gr; x.fillRect(l.x - l.r, l.y - l.r, l.r * 2, l.r * 2);
      } else {
        const lc = l.col || '255,214,150', hw = l.w, gr = x.createLinearGradient(l.x - hw, 0, l.x + hw, 0);
        gr.addColorStop(0, `rgba(${lc},0)`); gr.addColorStop(0.5, `rgba(${lc},${l.a * 0.5})`); gr.addColorStop(1, `rgba(${lc},0)`);
        x.fillStyle = gr; x.fillRect(l.x - hw, 0, hw * 2, h);
      }
    }
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'destination-in'; x.drawImage(b, 0, 0);
    const sm = g.imageSmoothingEnabled;
    g.save(); g.globalCompositeOperation = 'lighter'; g.imageSmoothingEnabled = !axisOk(g, SS); g.drawImage(c, 0, 0, W, H, 0, 0, w, h); g.restore();
    g.imageSmoothingEnabled = sm;
  };

  // ---------------------------------------------------------------- ruote: disegno a densità doppia che gira liscio
  // La ruota si disegna ruotata: a pixel netti ogni rotazione rifaceva gli scalini (il cerchio «friggeva»). Con la ruota
  // Scale2x e la rotazione morbida il cerchio resta tondo; i raggi a scatti fissi come prima (niente sfarfallio).
  // step = frazione di giro tra uno scatto e l'altro (π/20 per l'auto del giocatore, π/12 per il traffico)
  S.wheelDraw = function (g, img, cx, cy, s2, ang, speed, step = Math.PI / 20) {
    const hd = img._hd ? img : on(this) ? x2(img) : img;           // _hd: ruota già a densità doppia (disegnata a parte)
    g.save(); g.translate(Math.round(cx), Math.round(cy));
    g.imageSmoothingEnabled = hd !== img || !!img._hd; g.imageSmoothingQuality = 'high';
    if (speed > 9) { for (let i = 0; i < 4; i++) { g.save(); g.globalAlpha = i ? 0.35 : 1; g.rotate(ang + i * Math.PI / 10); g.drawImage(hd, -s2 / 2, -s2 / 2, s2, s2); g.restore(); } }
    else { g.rotate(Math.round(ang / step) * step); g.drawImage(hd, -s2 / 2, -s2 / 2, s2, s2); }
    g.restore();
  };

  // ---------------------------------------------------------------- bagliore più netto
  // Due livelli come prima, ma con la soglia più alta (si accendono neon, fari, lampade e riflessi forti, non le
  // superfici chiare qualsiasi) e il largo più leggero: le luci brillano, la scena non si vela.
  const glow0 = S.glowPass;
  if (glow0) S.glowPass = function (c, src, SS) {
    if (this.sharp === false) return glow0.call(this, c, src, SS);
    if (typeof c.filter !== 'string' || this.glow === false || (this.quality || 'alta') !== 'alta') return;
    const day = this.day || 0, W2 = c.canvas.width, H2 = c.canvas.height; const todo = [];
    const pass = (key, div, filt, alpha) => {
      if (alpha <= 0.01) return;
      const bw = Math.max(1, Math.round(this.LW / div)), bh = Math.max(1, Math.round(360 / div));
      const cv = this[key] || (this[key] = document.createElement('canvas'));
      if (cv.width !== bw || cv.height !== bh) { cv.width = bw; cv.height = bh; }
      const b = cv.getContext('2d'); b.filter = filt; b.clearRect(0, 0, bw, bh);
      b.drawImage(this.lo, src[0] * SS, src[1] * SS, src[2] * SS, src[3] * SS, 0, 0, bw, bh); b.filter = 'none';
      todo.push([cv, alpha]);   // prima si leggono tutti e due dalla scena, poi si sommano (la scena può essere la tela stessa: present a densità vera)
    };
    pass('bl', 3, 'brightness(0.5) contrast(4.6) saturate(1.5) blur(1.5px)', 0.46 - day * 0.3);
    if (!this.slow) pass('bl2', 8, 'brightness(0.47) contrast(4.2) saturate(1.6) blur(5px)', 0.3 - day * 0.22);
    if (!todo.length) return;
    // v0.134: i due livelli si sommano prima su una tela piccola (quella dello stretto) e poi una passata sola sulla scena
    // grande, invece di due: il largo è già sfocato di 5 px a 1/8, passare da 1/3 non cambia niente
    let src2 = todo[0][0], a2 = todo[0][1];
    if (todo.length > 1) {
      const [c1, al1] = todo[0], [c2, al2] = todo[1], m = this._blM || (this._blM = document.createElement('canvas'));
      if (m.width !== c1.width || m.height !== c1.height) { m.width = c1.width; m.height = c1.height; }
      const mx = m.getContext('2d'), top = Math.max(al1, al2);
      mx.globalCompositeOperation = 'source-over'; mx.globalAlpha = 1; mx.clearRect(0, 0, m.width, m.height); mx.imageSmoothingEnabled = true;
      mx.globalCompositeOperation = 'lighter'; mx.globalAlpha = al1 / top; mx.drawImage(c1, 0, 0);
      mx.globalAlpha = al2 / top; mx.drawImage(c2, 0, 0, m.width, m.height);
      src2 = m; a2 = top;
    }
    c.save(); c.imageSmoothingEnabled = true; c.globalCompositeOperation = 'lighter'; c.globalAlpha = a2; c.drawImage(src2, 0, 0, W2, H2); c.restore();
  };

  // ---------------------------------------------------------------- marciapiede lontano a densità doppia (y 215 → 236)
  // Due file di lastre sfalsate con le fughe e lo spigolo in luce, qualche lastra crepata, macchiata, rifatta o con
  // le gomme da masticare; il cordolo di pietra (piano chiaro con la grana, faccia in ombra, giunti) e la canaletta.
  // Mattonella in cache alla densità vera: a ogni fotogramma solo qualche copia che scorre.
  const TW = 168, rnd = Street2D.rnd;   // 168 = 7 lastre da 24 (fila lontana) = 6 da 28 (fila vicina) = 4 pietre da 42
  const mix = (a, b, k) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16), m = (s) => Math.round(((A >> s) & 255) * (1 - k) + ((B >> s) & 255) * k);
    return '#' + [16, 8, 0].map((s) => m(s).toString(16).padStart(2, '0')).join(''); };
  const tileOf = function (key, W, H, paint) {
    const SS = this.SS || 1, k = key + SS;
    if (this.spr[k]) return this.spr[k];
    const c = document.createElement('canvas'); c.width = W * SS; c.height = H * SS; c.lw = W; c.lh = H;
    const x = c.getContext('2d'); x.scale(SS, SS); paint(x, 1 / SS);
    return (this.spr[k] = c);
  };
  // fila di lastre: y0, altezza, larghezza delle lastre, sfasamento, seme, colore base
  const slabs = (x, u, y0, h, sw, off, seed, base, joint) => {
    const n = TW / sw, f = (col, a, b, w, hh) => { x.fillStyle = col; x.fillRect(a, b, w, hh); };
    x.save(); x.beginPath(); x.rect(0, y0, TW, h); x.clip();
    for (let i = -1; i <= n; i++) {
      const x0 = i * sw + off, id = ((i % n) + n) % n, s = seed + id * 7.13, tone = (rnd(s) - 0.5) * 0.12;
      const redo = rnd(s + 1) < 0.1, col = Street2D.shade(redo ? mix(base, '#3a4058', 0.35) : base, tone);
      f(col, x0, y0, sw, h);
      f(Street2D.shade(col, 0.16), x0 + u, y0, sw - u, u);                                    // spigolo alto in luce
      f(Street2D.shade(col, -0.18), x0 + u, y0 + h - u, sw - u, u);                           // e basso in ombra
      f(joint, x0, y0, u, h);                                                                   // fuga
      if (rnd(s + 2) < 0.5) f(Street2D.shade(col, 0.07), x0 + sw * 0.3, y0 + h * 0.35, sw * 0.4, h * 0.3);   // consumata al centro
      const d = rnd(s + 3);
      if (d < 0.16) {                                                                           // crepa
        let cx = x0 + 3 + rnd(s + 4) * (sw - 8), cy = y0 + u; const dir = rnd(s + 5) < 0.5 ? -1 : 1;
        for (let q = 0; q < h / u - 2; q++) { f(Street2D.shade(col, -0.35), cx, cy, u, u); cy += u; if (rnd(s + q * 1.7) < 0.45) cx += dir * u; }
      } else if (d < 0.3) {                                                                     // macchia
        const cx = x0 + sw * (0.25 + rnd(s + 6) * 0.5), cy = y0 + h * 0.5, rx = 2 + rnd(s + 7) * 3, ry = h * 0.3;
        for (let yy = -ry; yy <= ry; yy += u) for (let xx = -rx; xx <= rx; xx += u) {
          const e = (xx * xx) / (rx * rx) + (yy * yy) / (ry * ry);
          if (e < 1 && Street2D.bayer(Math.round((cx + xx) / u), Math.round((cy + yy) / u)) > e * 0.8) f(Street2D.shade(col, -0.22), cx + xx, cy + yy, u, u);
        }
      } else if (d < 0.42) {                                                                    // gomme da masticare
        for (let q = 0; q < 3; q++) f(Street2D.shade(col, 0.32), x0 + 2 + rnd(s + 10 + q) * (sw - 4), y0 + 1 + rnd(s + 20 + q) * (h - 2), u, u);
      }
    }
    x.restore();
  };
  S.walkTile = function () {
    return tileOf.call(this, 'walkHD', TW, 21, (x, u) => {
      const f = (col, a, b, w, h) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
      f('#0a0d18', 0, 0, TW, 1);                                                                // piede del palazzo
      f('#1a1d2c', 0, 1, TW, 0.5);
      slabs(x, u, 1.5, 6, 24, 0, 11, '#2a2e44', '#191c2b');                                     // fila lontana
      f('#191c2b', 0, 7.5, TW, 0.5);
      slabs(x, u, 8, 6.5, 28, 14, 53, '#2d3148', '#1a1d2c');                                    // fila vicina, sfalsata
      f('#141725', 0, 14.5, TW, 0.5);
      // cordolo: piano di pietra chiara con la grana, spigolo lucido, giunti ogni 42
      f('#4a5070', 0, 15, TW, 2); f('#6c74a0', 0, 15, TW, 0.5); f('#3d4362', 0, 16.5, TW, 0.5);
      for (let q = 0; q < 140; q++) f(rnd(q * 3.3 + 1) < 0.5 ? '#3f4565' : '#58608a', rnd(q * 7.7 + 2) * TW, 15.5 + Math.floor(rnd(q * 1.9 + 3) * 2) * 0.5, 0.5, 0.5);
      // faccia del cordolo in ombra (verso la strada), poi la canaletta
      const gr = x.createLinearGradient(0, 17, 0, 21); gr.addColorStop(0, '#2a2e43'); gr.addColorStop(1, '#171a29'); x.fillStyle = gr; x.fillRect(0, 17, TW, 4);
      for (let j = 0; j < TW; j += 42) { f('#1e2133', j + 19, 15, 0.5, 6); f('#5a6288', j + 19.5, 15, 0.5, 2); }
      for (let q = 0; q < 26; q++) f('#3a3f58', rnd(q * 5.1 + 7) * TW, 17.5 + rnd(q * 2.3 + 8) * 3, rnd(q + 9) < 0.5 ? 1 : 0.5, 0.5);   // scheggiature
      f('#0e1019', 0, 20.5, TW, 0.5);
      // caditoia nella faccia del cordolo
      f('#0a0c14', 108, 17.5, 12, 3); for (let b = 109; b < 120; b += 1.5) f('#2c3048', b, 18, 0.5, 2.5); f('#3c4262', 108, 17.5, 12, 0.5);
    });
  };
  S.walkHD = function (g, dist, PPM, W) {
    if (!on(this)) return false;
    const t = this.walkTile(), SS = this.SS, ofs = Math.round((((dist * PPM) % TW) + TW) % TW * SS) / SS;
    for (let x = -ofs; x < W; x += TW) g.drawImage(t, x, 215, TW, 21);
    return true;
  };

  // ---------------------------------------------------------------- cordolo vicino (in basso, y 339 → 360)
  S.curbTile = function () {
    return tileOf.call(this, 'curbHD', TW, 21, (x, u) => {
      const f = (col, a, b, w, h) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
      f('#0a0d18', 0, 0, TW, 1.5); f('#1b1f31', 0, 1.5, TW, 0.5); f('#7a82a8', 0, 2, TW, 0.5);   // canaletta e spigolo
      f('#5c6386', 0, 2.5, TW, 1.5); f('#4a5070', 0, 3.5, TW, 0.5);
      for (let q = 0; q < 120; q++) f(rnd(q * 4.1 + 2) < 0.5 ? '#4e5577' : '#6e77a0', rnd(q * 6.3 + 5) * TW, 2.5 + Math.floor(rnd(q * 2.9 + 1) * 3) * 0.5, 0.5, 0.5);
      const gr = x.createLinearGradient(0, 4, 0, 12); gr.addColorStop(0, '#3e4360'); gr.addColorStop(1, '#2c3046'); x.fillStyle = gr; x.fillRect(0, 4, TW, 8);
      for (let j = 0; j < TW; j += 42) { f('#22263a', j + 7, 2.5, 0.5, 9.5); f('#565d82', j + 7.5, 2.5, 0.5, 9.5); }   // giunti tra le pietre
      for (let q = 0; q < 40; q++) { const a = rnd(q * 3.7 + 11) * TW, b = 4.5 + rnd(q * 5.3 + 12) * 7; f(rnd(q + 13) < 0.6 ? '#262a3d' : '#4a5070', a, b, rnd(q + 14) < 0.4 ? 1 : 0.5, 0.5); }
      f('#2a2e44', 0, 11.5, TW, 0.5); f('#14172a', 0, 12, TW, 1);
      // marciapiede vicino: lastre grandi (quasi sempre sotto il cruscotto)
      slabs(x, u, 13, 8, 42, 21, 97, '#2b2f45', '#1a1d2c');
    });
  };
  S.curbHD = function (g, dist, PPM, W) {
    if (!on(this)) return false;
    const t = this.curbTile(), SS = this.SS, ofs = Math.round((((dist * PPM) % TW) + TW) % TW * SS) / SS;
    for (let x = -ofs; x < W; x += TW) g.drawImage(t, x, 339, TW, 21);
    return true;
  };

  // ---------------------------------------------------------------- lampioni a densità doppia
  // Palo tondo (lato in luce, lato in ombra, riflesso stretto), anelli, sportello, base svasata coi bulloni, braccio
  // curvo col tirante, testa della lampada con lo spigolo lucido e il vetro (acceso: colore della lampada col cuore
  // chiaro; spento: vetro scuro con un riflesso). Varianti fisse per lampione: niente, adesivi, cartello di divieto.
  // Lo sprite parte da (x − 6, 112): x è il palo, come prima.
  S.lampSprite = function (col, lit, variant) {
    const key = 'lampHD' + col + (lit ? 1 : 0) + variant;
    return tileOf.call(this, key, 36, 120, (x, u) => {
      const f = (c, a, b, w, h) => { x.fillStyle = c; x.fillRect(a + 6, b - 112, w, h); };   // coordinate come sulla strada (palo a 0)
      const ink = '#0a0d18', mid = '#3c4262', dark = '#272b42', lite = '#5c6488', spec = '#8c94bc';
      // palo
      f(ink, -2, 121, 4.5, 102); f(dark, -1.5, 121, 3.5, 101); f(mid, -1.5, 121, 2, 101); f(lite, -1, 121, 0.5, 101); f(spec, -0.5, 125, 0.5, 60);
      for (const ay of [150, 182, 206]) { f(ink, -2.5, ay, 5.5, 2); f(lite, -2, ay, 4.5, 0.5); f(dark, -2, ay + 1, 4.5, 0.5); }   // anelli
      f(ink, -1.5, 196, 3.5, 7); f(dark, -1, 196.5, 2.5, 6); f('#4a5070', -0.5, 199, 0.5, 0.5);                           // sportello
      // base svasata e piastra coi bulloni
      f(ink, -3.5, 213, 7.5, 9); f(dark, -3, 213.5, 6.5, 8); f(mid, -3, 213.5, 3.5, 8); f(lite, -2.5, 213.5, 0.5, 8);
      f(ink, -5, 221, 10.5, 9); f('#2e3350', -4.5, 221.5, 9.5, 8); f('#4a5070', -4.5, 221.5, 9.5, 0.5); f('#1c1f30', -4.5, 229, 9.5, 0.5);
      for (const bx of [-3.5, 3]) { f('#6a7298', bx, 223, 0.5, 0.5); f('#14172a', bx, 223.5, 0.5, 0.5); }
      // braccio curvo e tirante
      const arc = [[0, 121.5], [0.5, 120], [1.5, 119], [3, 118.5]];
      for (const [ax, ay] of arc) { f(ink, ax - 1, ay - 1, 2.5, 2.5); }
      f(ink, 2, 117.5, 22, 3); f(mid, 2.5, 118, 21.5, 1.5); f(lite, 2.5, 118, 21.5, 0.5);
      for (const [ax, ay] of arc) { f(mid, ax - 0.5, ay - 0.5, 1.5, 1.5); }
      for (let q = 0; q < 9; q++) f(dark, 1 + q, 128.5 - q * 0.75, 0.5, 0.5);                // tirante
      // testa della lampada
      f(ink, 11, 119.5, 16, 7); f('#2e3350', 11.5, 120, 15, 3); f(lite, 12, 120, 14, 0.5); f(spec, 13, 120, 5, 0.5);
      f('#1e2133', 12, 123, 14, 1.5);
      if (lit) {
        const L = col, core = mix(col, '#ffffff', 0.7);
        f(L, 12.5, 124.5, 13, 2.5); f(core, 14, 125, 10, 1); f(mix(col, '#ffffff', 0.92), 16, 125, 6, 0.5); f(Street2D.shade(L, -0.25), 12.5, 126.5, 13, 0.5);
      } else { f('#23263a', 12.5, 124.5, 13, 2.5); f('#4a5070', 14, 125, 4, 0.5); }
      // varianti: adesivi strappati o cartello di divieto di sosta
      if (variant === 1) { f('#d9d4c4', -1.5, 168, 3, 4); f('#b8ff3a', -1.5, 169, 3, 1); f('#ff2e88', -1, 175, 2.5, 3); f('#9aa0b8', -1.5, 176, 1, 1); }
      if (variant === 2) {
        f(ink, -5.5, 138, 11, 11); f('#1d4fb8', -5, 138.5, 10, 10); f('#d8202a', -4, 139.5, 8, 8); f('#1d4fb8', -3, 140.5, 6, 6);
        for (let q = 0; q < 6; q++) f('#d8202a', -3 + q, 140.5 + q, 1, 1);                    // divieto di sosta
        f(lite, -5, 138.5, 10, 0.5);
      }
    });
  };
  // disegna il lampione (palo, braccio, testa, vetro); la luce e i riflessi restano a street2d.js
  S.lampHD = function (g, x, lit, col, lm) {
    if (!on(this)) return false;
    const v = Math.floor(rnd((lm || x) * 0.37 + 5) * 6), variant = v === 1 ? 1 : v === 2 ? 2 : 0;
    g.drawImage(this.lampSprite(col, lit, variant), x - 6, 112, 36, 120);
    return true;
  };

  // ---------------------------------------------------------------- asfalto a specchio: riflesso morbido, a mezze unità
  // Prima: 90 righe alte un'unità spostate a scatti interi (sull'asciutto sembravano trattini a scala sotto ogni
  // insegna). Ora: il riflesso a metà risoluzione (morbido come un riflesso vero) e strisce di mezza unità che ondeggiano
  // piano; sull'asciutto quasi ferme, con la pioggia l'onda di prima.
  S.wetHD = function (g, W, t, wetA) {
    if (!on(this)) return false;
    const SS = this.SS, rain = !!this.rainOn, RW = Math.ceil(W / 2), RH = 53;
    const rf = this._rfHD || (this._rfHD = document.createElement('canvas'));
    if (rf.width !== RW || rf.height !== RH) { rf.width = RW; rf.height = RH; }
    const rg = rf.getContext('2d'); rg.imageSmoothingEnabled = true; rg.imageSmoothingQuality = 'medium'; rg.clearRect(0, 0, RW, RH);
    rg.drawImage(this.lo, 0, 110 * SS, W * SS, 106 * SS, 0, 0, RW, RH);
    const st = 1 / SS;
    // (prestazioni, 23/11/2026) prima 180 copie a strisce, ognuna capovolta e sfumata da sola; ora il riflesso si capovolge
    // e si sfuma (1 − r/95) tutto insieme in una tela, e si copiano solo i tratti di righe con lo stesso spostamento
    // (sull'asciutto quasi tutte): stesso disegno, molte meno copie
    const fl = this._rfFl || (this._rfFl = document.createElement('canvas'));
    if (fl.width !== W * SS || fl.height !== 90 * SS) { fl.width = W * SS; fl.height = 90 * SS; }
    const fx = fl.getContext('2d');
    fx.save(); fx.globalCompositeOperation = 'copy'; fx.imageSmoothingEnabled = true; fx.imageSmoothingQuality = 'medium';
    fx.setTransform(SS, 0, 0, -SS, 0, 105 * 0.85 * SS);            // riga r della tela = riga (105 − r/0,85)/2 del riflesso
    fx.drawImage(rf, 0, 0, RW, RH, 0, 0, W, 106 * 0.85);
    fx.setTransform(SS, 0, 0, SS, 0, 0); fx.globalCompositeOperation = 'destination-in';
    const fade = fx.createLinearGradient(0, 0, 0, 95); fade.addColorStop(0, 'rgba(0,0,0,1)'); fade.addColorStop(1, 'rgba(0,0,0,0)');
    fx.fillStyle = fade; fx.fillRect(0, 0, W, 90); fx.restore();
    g.save(); g.globalCompositeOperation = 'lighter'; g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'medium';
    g.globalAlpha = wetA * (rain ? 1 : 0.9);
    const amp0 = rain ? 1.6 : 0.35, ph = t * (rain ? 6 : 2.5), wobOf = (r) => Math.round(Math.sin(r * 0.55 + ph) * (1 + r * 0.03) * amp0 * SS) / SS;
    const R1 = 105 * 0.85;                                           // oltre, il riflesso finisce (sy < 0)
    let r0 = 0, w0 = wobOf(0);
    for (let r = st; ; r += st) {
      const end = r >= 90 || r > R1, w = end ? NaN : wobOf(r);
      if (end || w !== w0) {
        const h = Math.min(r, 90) - r0;
        g.drawImage(fl, 0, Math.round(r0 * SS), W * SS, Math.round(h * SS), w0, 241 + r0, W, h);
        if (end) break;
        r0 = r; w0 = w;
      }
    }
    g.restore();
    return true;
  };
})();
