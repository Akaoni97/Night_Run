// ============================================================================
//  Night Run · Alta definizione leggera di insegne e oggetti (dopo nitido2d.js; solo a densità doppia)
//  · INSEGNE: le scritte a pixel grandi della strada (scala 2 e più: insegne dei locali, cartelli, nomi) passano dal
//    carattere 3×5 al 5×7 degli interni (lo stesso F5 di interni_hd.js), disegnato a mezza unità: lettere più fini,
//    stesso spazio di prima. Le scritte piccole (scala 1) restano come sono.
//  · OGGETTI del marciapiede vicino (idrante, paletto, cestino coi sacchi, parchimetro, distributore di giornali,
//    cartello di divieto di sosta rotondo): ridisegnati a mezza unità con riflessi, bulloni e bordi tondi.
//  Leggero: ogni scritta (testo, colore, scala) e ogni oggetto si disegnano una volta sola in una piccola tela e poi si
//  copiano (meno lavoro di prima, che rifaceva i quadratini a ogni fotogramma). Con qualità bassa o leggera, con
//  densità normale (Prestazioni) o con `street2d.sharp = false` resta tutto come prima. Il gatto resta quello di sempre.
// ============================================================================
(function insegneHD() {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype;
  const F5 = { A: [14, 17, 17, 31, 17, 17, 17], B: [30, 17, 17, 30, 17, 17, 30], C: [14, 17, 16, 16, 16, 17, 14], D: [30, 17, 17, 17, 17, 17, 30], E: [31, 16, 16, 30, 16, 16, 31], F: [31, 16, 16, 30, 16, 16, 16], G: [14, 17, 16, 23, 17, 17, 15], H: [17, 17, 17, 31, 17, 17, 17], I: [14, 4, 4, 4, 4, 4, 14], J: [7, 2, 2, 2, 2, 18, 12], K: [17, 18, 20, 24, 20, 18, 17], L: [16, 16, 16, 16, 16, 16, 31], M: [17, 27, 21, 21, 17, 17, 17], N: [17, 17, 25, 21, 19, 17, 17], O: [14, 17, 17, 17, 17, 17, 14], P: [30, 17, 17, 30, 16, 16, 16], Q: [14, 17, 17, 17, 21, 18, 13], R: [30, 17, 17, 30, 20, 18, 17], S: [15, 16, 16, 14, 1, 1, 30], T: [31, 4, 4, 4, 4, 4, 4], U: [17, 17, 17, 17, 17, 17, 14], V: [17, 17, 17, 17, 17, 10, 4], W: [17, 17, 17, 21, 21, 21, 10], X: [17, 17, 10, 4, 10, 17, 17], Y: [17, 17, 17, 10, 4, 4, 4], Z: [31, 1, 2, 4, 8, 16, 31],
    0: [14, 17, 19, 21, 25, 17, 14], 1: [4, 12, 4, 4, 4, 4, 14], 2: [14, 17, 1, 2, 4, 8, 31], 3: [31, 2, 4, 2, 1, 17, 14], 4: [2, 6, 10, 18, 31, 2, 2], 5: [31, 16, 30, 1, 1, 17, 14], 6: [6, 8, 16, 30, 17, 17, 14], 7: [31, 1, 2, 4, 8, 8, 8], 8: [14, 17, 17, 14, 17, 17, 14], 9: [14, 17, 17, 15, 1, 2, 12],
    '.': [0, 0, 0, 0, 0, 12, 12], ',': [0, 0, 0, 0, 12, 4, 8], ':': [0, 12, 12, 0, 12, 12, 0], '-': [0, 0, 0, 31, 0, 0, 0], '/': [1, 1, 2, 4, 8, 16, 16], '€': [7, 8, 30, 8, 30, 8, 7], "'": [4, 4, 8, 0, 0, 0, 0], '!': [4, 4, 4, 4, 4, 0, 4], '?': [14, 17, 1, 2, 4, 0, 4], '%': [24, 25, 2, 4, 8, 19, 3], '+': [0, 4, 4, 31, 4, 4, 0], '·': [0, 0, 0, 4, 0, 0, 0], ' ': [0, 0, 0, 0, 0, 0, 0] };
  const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  // si può: densità doppia vera sulla tela su cui si sta disegnando (le tele di appoggio a densità semplice no)
  const on = (v, g) => v.SS > 1 && v.sharp !== false && v.quality !== 'bassa' && v.quality !== 'leggera' && !!g.getTransform && g.getTransform().a >= 1.99;
  const LIM = 700;

  // ---------------------------------------------------------------- insegne
  const TXT = new Map();
  function scritta(str, col, sc) {
    const key = str + '|' + col + '|' + sc;
    let c = TXT.get(key); if (c) return c;
    if (TXT.size > LIM) TXT.clear();
    // in pixel veri: la casella di una lettera era 6sc × 10sc; il 5×7 ci entra «grassetto» (ogni pixel largo pw + 1) e alto
    // quasi quanto prima (ph per riga), così l'insegna resta piena come prima ma le lettere sono disegnate fini
    const pw = sc, ph = Math.floor(10 * sc / 7) + (sc === 2 ? 1 : 0), PAD = 2;
    const n = str.length, W = Math.max(1, (n * 4 - 1) * sc * 2 + PAD), H = 10 * sc + PAD * 2;
    c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d'); x.fillStyle = col;
    const ox = Math.round((6 * sc - (5 * pw + 1)) / 2), oy = PAD + Math.floor((10 * sc - 7 * ph) / 2);
    let cx = 0;
    for (const ch of str) {
      const f = F5[ch] || F5[' '];
      for (let r = 0; r < 7; r++) for (let k = 0; k < 5; k++) if (f[r] & (16 >> k)) x.fillRect(cx + ox + k * pw, oy + r * ph, pw + 1, ph);
      cx += 8 * sc;
    }
    TXT.set(key, c); return c;
  }
  const text0 = S.text;
  S.text = function (g, str, x, y, color, sc = 1) {
    if (sc < 2 || typeof color !== 'string' || !on(this, g)) return text0.call(this, g, str, x, y, color, sc);
    const c = scritta(norm(str), color, sc);
    const sm = g.imageSmoothingEnabled; g.imageSmoothingEnabled = false;
    g.drawImage(c, Math.round(x), Math.round(y) - 1, c.width / 2, c.height / 2);   // PAD = 2 pixel veri = 1 unità sopra
    g.imageSmoothingEnabled = sm;
  };

  // ---------------------------------------------------------------- oggetti del marciapiede
  const OW = 48, OH = 64, OX = 24, OY = 60;                       // tela dell'oggetto in unità; (OX, OY) = piede
  const PROP = {};
  function oggetto(kind, ink) {
    if (PROP[kind]) return PROP[kind];
    const c = document.createElement('canvas'); c.width = OW * 2; c.height = OH * 2;
    const g = c.getContext('2d'); g.setTransform(2, 0, 0, 2, OX * 2, OY * 2);
    const r = (col, x, y, w = 0.5, h = 0.5) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
    const disco = (cx, cy, rad, col) => { g.fillStyle = col; for (let y = -rad; y < rad; y += 0.5) for (let x = -rad; x < rad; x += 0.5) if ((x + 0.25) ** 2 + (y + 0.25) ** 2 <= rad * rad) g.fillRect(cx + x, cy + y, 0.5, 0.5); };
    if (kind === 0) {                                             // idrante: cupola, bocchettoni coi bulloni, catenella
      r(ink, -6, -22, 13, 22); r('#b8241a', -5.5, -21.5, 12, 21.5); r('#e2402e', -5, -21, 2.5, 20); r('#ff6a55', -4.5, -20, 1, 17); r('#7a160e', 4, -21, 2, 21);
      r(ink, -5, -26, 11, 4.5); r('#c42a1a', -4.5, -25.5, 10, 3.5); r('#ff6a55', -4, -25, 3, 1);
      r(ink, -2.5, -28, 6, 2.5); r('#e8e4d6', -2, -27.5, 5, 1.5);
      r(ink, -9.5, -15.5, 20, 5); r('#c42a1a', -9, -15, 19, 4); r('#ff5a45', -9, -15, 19, 1); r('#7a160e', -9, -12, 19, 1);
      for (const bx of [-8.5, 9]) { r('#ffd23f', bx, -14, 1, 1); r('#8a6a10', bx + 0.5, -13.5, 0.5, 0.5); }
      r('#ffd23f', -1.5, -9.5, 3.5, 3.5); r('#fff2a0', -1, -9, 1, 1); r('#8a6a10', -1.5, -6.5, 3.5, 0.5);
      for (let k = 0; k < 6; k++) r('#c9ced6', 2.5 + k * 0.5, -9 + (k % 2) * 0.5);   // catenella
      r(ink, -7, -1.5, 15, 1.5); r('#5a1410', -6.5, -1.5, 14, 1);
    } else if (kind === 1) {                                      // paletto con le fasce catarifrangenti
      r(ink, -4, -24, 9, 24); r('#7a8096', -3.5, -23.5, 8, 23.5); r('#c9ced6', -3, -23, 2, 22.5); r('#e8ecf4', -2.5, -23, 0.5, 22); r('#4a4e5e', 3, -23, 1.5, 23);
      r(ink, -4, -25.5, 9, 2); r('#9aa0b4', -3.5, -25, 8, 1.5);
      for (const fy of [-19, -14]) { r(ink, -3.5, fy - 0.5, 8, 3.5); r('#f4f1e6', -3, fy, 7, 2.5); r('#c42a1a', -3, fy + 0.5, 7, 1); r('#ffffff', -2.5, fy, 1.5, 0.5); }
    } else if (kind === 2) {                                      // cestino a doghe e sacco nero col nodo
      r(ink, -8, -24, 17, 24); r('#1f6b4a', -7.5, -23.5, 16, 23.5); r('#3aa07a', -7, -23, 2.5, 22.5); r('#145238', 6, -23, 2, 23);
      for (let k = -21; k < -1; k += 3) r('#0f3d2a', -7.5, k, 16, 0.5);
      r(ink, -9, -26, 19, 2.5); r('#2b8a6e', -8.5, -25.5, 18, 1); r('#0a1810', -6.5, -24.5, 14, 1);
      r('#f4f1e6', -1.5, -17, 4, 3); r('#1f6b4a', -1, -16.5, 3, 2); r('#f4f1e6', -0.5, -16, 1, 1);   // il simbolo del cestino
      r(ink, 9, -10.5, 12.5, 10.5); r('#14161e', 9.5, -10, 11.5, 10); r('#2a2d38', 10.5, -9, 3.5, 2.5); r('#3a3e4c', 11, -8.5, 1, 1); r('#0a0b10', 18, -10, 2.5, 10);
      r(ink, 14, -13, 2.5, 3); r('#14161e', 14.5, -12.5, 1.5, 2);   // il nodo
    } else if (kind === 3) {                                      // parchimetro: display acceso, fessura, adesivo
      r(ink, -1.5, -28, 4, 28); r('#5a6070', -1, -27.5, 3, 27.5); r('#9aa0b4', -1, -27.5, 1, 27.5);
      r(ink, -5.5, -39, 12, 13); r('#c9ced6', -5, -38.5, 11, 12); r('#eef2f8', -5, -38.5, 11, 1); r('#8a90a0', -5, -27.5, 11, 1);
      r(ink, -4, -37, 9, 4.5); r('#0a2830', -3.5, -36.5, 8, 3.5); r('#2ee6ff', -3, -36, 2, 2.5); r('#2ee6ff', -0.5, -36, 1, 0.5); r('#7ff4ff', -0.5, -35, 3, 0.5); r('#2ee6ff', -0.5, -34, 2, 0.5);
      r('#14161e', -2, -31, 5, 1); r('#1d4fa8', -4, -30, 2.5, 1.5); r('#ffd23f', 2.5, -30, 2, 1.5);
    } else if (kind === 4) {                                      // distributore di giornali con la prima pagina
      r(ink, -9, -24, 19, 24); r('#1d4fa8', -8.5, -23.5, 18, 23.5); r('#5d8cff', -8, -23, 2, 22.5); r('#123a80', 7.5, -23, 1.5, 23);
      r(ink, -6.5, -19, 14, 9); r('#e8e4d6', -6, -18.5, 13, 8); r('#9a9890', -5.5, -15.5, 12, 0.5); r('#9a9890', -5.5, -14, 7, 0.5); r('#9a9890', -5.5, -12.5, 9, 0.5); r('#5a6070', 2.5, -14, 3.5, 2.5);
      r('#c42a1a', -5.5, -18, 12, 1.5);
      r('#14161e', -2, -8, 5, 1); r('#c9ced6', 3.5, -8.5, 2, 2); r(ink, -9, -1.5, 19, 1.5);
      const F = F5, word = 'NEWS'; let cx = -5;                    // NEWS col carattere fine
      for (const ch of word) { const f = F[ch]; for (let rr = 0; rr < 7; rr++) for (let k = 0; k < 5; k++) if (f[rr] & (16 >> k)) r('#f4f1e6', cx + k * 0.5, -22.5 + rr * 0.5); cx += 3; }
    } else if (kind === 5) {                                      // cartello rotondo di divieto di sosta con la targhetta
      r(ink, -1, -46, 3, 46); r('#8a90a0', -0.5, -46, 2, 46); r('#c9ced6', -0.5, -46, 0.5, 46);
      disco(0.5, -45.5, 9, ink); disco(0.5, -45.5, 8.5, '#c42a1a'); disco(0.5, -45.5, 6.5, '#1d4fa8');
      for (let k = -5; k < 5; k += 0.5) r('#c42a1a', 0.5 + k - 0.75, -45.5 + k - 0.25, 1.5, 0.5);   // la barra in diagonale
      r('#ff6a55', -5, -52, 2, 0.5); r('#ff6a55', -6.5, -50, 0.5, 2);
      r(ink, -5, -35, 11, 6); r('#f4f1e6', -4.5, -34.5, 10, 5); r('#1a1a24', -3.5, -33, 1.5, 2); r('#1a1a24', -1, -33, 3, 0.5); r('#1a1a24', 3, -33, 1.5, 2);   // 0-24
    }
    PROP[kind] = c; return c;
  }
  const prop0 = S.prop;
  S.prop = function (g, kind, x, base, t) {
    if (kind > 5 || !on(this, g)) return prop0.call(this, g, kind, x, base, t);
    const c = oggetto(kind, this.C.ink);
    g.drawImage(c, Math.round(x) - OX, Math.round(base) - OY, OW, OH);
  };
  Street2D.insegneHD = { scritta, oggetto, F5 };
})();
