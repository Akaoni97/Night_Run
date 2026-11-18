// ============================================================================
//  Night Run · Le gomme (dopo dettagli2d.js)
//  Si aggancia alle ruote di Street2D (genWheel, v40Wheel, supraWheel, wheel) e alle ruote del traffico (tireFx):
//  - Volvo V40: la ruota del disegno del proprietario (img/v40_wheel.png) al posto dei copricerchi disegnati a codice,
//    che erano quasi bianchi e di notte, col bagliore, sembravano accesi
//  - ombra del passaruota sulla parte alta, cerchi un po' più scuri di notte (non superano più la soglia del bagliore),
//    riflesso fermo in alto (la luce viene dai lampioni, non gira con la ruota)
//  - fianco con un filo di luce e le scritte che girano; battistrada a tasselli sul bordo (meno marcato se consumato)
//  - rigonfiamento dove la gomma tocca terra: più largo e schiacciato con poca pressione (game.s.tyres, bar), a terra
//    con la gomma forata; di lato si vedono le gomme destre (anteriore 1, posteriore 3)
//  - in velocità cerchio e fianco si sfumano; sotto la pioggia la gomma bagnata luccica
//  Con qualità bassa niente effetti (resta la ruota del disegno).
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // raggio del cerchio misurato sul disegno della ruota (fin dove il metallo è chiaro) e colore medio del metallo (in cache)
  const rimInfo = (img) => {
    if (!img || !img.width) return null;
    if (img._rim) return img._rim;
    const W = img.width, H = img.height, c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, W, H).data, cx = W / 2 - 0.5, cy = H / 2 - 0.5, R = W / 2, sum = [], n = [];
    let rs = 0, gs = 0, bs = 0, m = 0;
    for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) {
      const i = (y * W + xx) * 4; if (d[i + 3] < 20) continue;
      const r = Math.round(Math.hypot(xx - cx, y - cy)), l = (d[i] + d[i + 1] + d[i + 2]) / 3;
      sum[r] = (sum[r] || 0) + l; n[r] = (n[r] || 0) + 1;
      if (r < R * 0.55 && l > 70) { rs += d[i]; gs += d[i + 1]; bs += d[i + 2]; m++; }
    }
    let edge = Math.round(R * 0.6);
    for (let r = 1; r < R; r++) if (n[r] && sum[r] / n[r] > 62) edge = r;
    return (img._rim = { frac: clamp((edge + 0.5) / R, 0.4, 0.8), rgb: m ? [rs / m, gs / m, bs / m].map(Math.round).join(',') : '150,155,165' });
  };
  // pressione della gomma che si vede (lato destro dell'auto: anteriore destra 1, posteriore destra 3)
  const pressOf = (rear) => {
    const G = typeof window !== 'undefined' && window.nightRun && window.nightRun.game, T = G && G.s && G.s.tyres;
    return T && Array.isArray(T.p) ? T.p[rear ? 3 : 1] : 2.3;
  };
  const wearOf = () => { const s = typeof window !== 'undefined' && window.nightRun && window.nightRun.sim; return s ? clamp(s.tireWear || 0, 0, 1) : 0; };

  // gli effetti sopra una ruota già disegnata. R = raggio esterno della gomma (unità del disegno a 360 righe)
  // o: { rim (frazione del raggio), rgb (colore medio del cerchio), press (bar), wear (0..1) }
  S.tireFx = function (g, cx, cy, R, ang, speed, o = {}) {
    if (this.quality === 'bassa' || !(R > 3)) return;
    const u = 1 / (this.SS || 1), night = 1 - (this.day || 0), rimR = R * (o.rim || 0.62), mid = (rimR + R) / 2;
    const blur = clamp((Math.abs(speed || 0) - 6) / 16, 0, 1), wear = o.wear || 0;
    const def = clamp((2.3 - (o.press ?? 2.3)) / 1.9, 0, 1);              // 0 gonfia, 1 a terra
    cx = Math.round(cx); cy = Math.round(cy);
    g.save();
    // ---- dentro la ruota: ombra del passaruota, cerchio più cupo di notte, riflesso fermo, sfocatura in velocità
    g.beginPath(); g.arc(cx, cy, R + 0.3, 0, TAU); g.clip();
    const ao = g.createLinearGradient(0, cy - R, 0, cy + R * 0.15);
    ao.addColorStop(0, `rgba(4,6,14,${0.55 + 0.15 * night})`); ao.addColorStop(0.45, `rgba(4,6,14,${0.22 + 0.1 * night})`); ao.addColorStop(1, 'rgba(4,6,14,0)');
    g.fillStyle = ao; g.fillRect(cx - R - 1, cy - R - 1, R * 2 + 2, R * 1.2 + 2);
    g.fillStyle = `rgba(10,12,26,${0.14 + 0.24 * night})`; g.beginPath(); g.arc(cx, cy, rimR, 0, TAU); g.fill();
    if (blur > 0.02) { g.fillStyle = `rgba(${o.rgb || '150,155,165'},${0.32 * blur})`; g.beginPath(); g.arc(cx, cy, rimR * 0.96, 0, TAU); g.fill(); g.fillStyle = `rgba(20,22,30,${0.35 * blur})`; g.beginPath(); g.arc(cx, cy, rimR * 0.3, 0, TAU); g.fill(); }
    g.fillStyle = 'rgba(0,0,0,.14)'; g.beginPath(); g.arc(cx, cy, rimR, 0.15, Math.PI - 0.15); g.fill();     // metà bassa del cerchio in ombra
    g.strokeStyle = `rgba(255,244,226,${0.22 + 0.14 * (1 - night)})`; g.lineWidth = u; g.beginPath(); g.arc(cx, cy, rimR * 0.82, -2.05, -1.05); g.stroke();   // riflesso dei lampioni, fermo
    // ---- fianco della gomma: filo di luce sulla spalla, scritte che girano (in velocità un anello sfocato)
    g.strokeStyle = 'rgba(150,156,172,.26)'; g.lineWidth = u; g.beginPath(); g.arc(cx, cy, R - 1.2 * u - 0.5, -2.4, -0.75); g.stroke();
    if (blur < 0.7) {
      g.fillStyle = `rgba(176,180,192,${0.34 * (1 - blur)})`;
      for (const a0 of [ang + 0.4, ang + Math.PI + 0.4]) for (let q = 0; q < 7; q++) {
        if (q === 3) continue;                                                          // spazio tra le parole
        const a = a0 + q * 0.085 * (13 / R), x = cx + Math.cos(a) * mid, y = cy + Math.sin(a) * mid;
        g.fillRect(x - u / 2, y - u / 2, u * (q % 2 ? 1 : 1.5), u);
      }
    }
    if (blur > 0.2) { g.strokeStyle = `rgba(160,165,178,${0.12 * blur})`; g.lineWidth = u; g.beginPath(); g.arc(cx, cy, mid, 0, TAU); g.stroke(); }
    // ---- battistrada: tasselli sul bordo che girano (consumati si vedono meno)
    if (blur < 0.5) {
      const nb = Math.max(14, Math.round(R * 1.5)), step = TAU / nb;
      g.fillStyle = `rgba(78,80,92,${0.6 * (1 - wear * 0.8) * (1 - blur * 2)})`;
      for (let q = 0; q < nb; q++) { const a = ang * 1 + q * step, x = cx + Math.cos(a) * (R - u * 0.6), y = cy + Math.sin(a) * (R - u * 0.6); if (y < cy + R * 0.7) g.fillRect(x - u / 2, y - u / 2, u, u); }
    }
    // ---- bagnato: la gomma luccica in alto
    if (this.rainOn) { g.strokeStyle = 'rgba(190,212,245,.3)'; g.lineWidth = u; g.beginPath(); g.arc(cx, cy, R - 0.6, -2.5, -0.65); g.stroke(); }
    g.restore();
    // ---- a terra: la gomma si allarga e si schiaccia (con poca pressione molto di più)
    const bh = 0.8 + def * 2.6, bw = R * (0.46 + 0.4 * def) + 0.5, by = cy + R - bh / 2 - 0.2;
    g.fillStyle = '#0c0d11'; g.beginPath(); g.ellipse(cx, by, bw, bh / 2 + 0.4, 0, 0, TAU); g.fill();
    if (def > 0.2) { g.fillStyle = `rgba(96,100,114,${0.12 + 0.2 * def})`; g.fillRect(cx - bw * 0.6, by - bh / 2 - 0.3, bw * 1.2, u); }   // la piega del fianco schiacciato
    if (def > 0.6) { g.fillStyle = 'rgba(96,100,114,.35)'; g.fillRect(cx - bw * 0.9, by, bw * 0.5, u); g.fillRect(cx + bw * 0.4, by, bw * 0.5, u); }
  };

  // ---------------------------------------------------------------- ruote del giocatore
  const gen = S.genWheel;
  S.genWheel = function (g, cx, cy, k, ang, speed = 0, rear = false) {
    gen.call(this, g, cx, cy, k, ang, speed, rear);
    const D = this.genDef(), G = Street2D.gen && Street2D.gen[this.carId], ri = rimInfo(G && G.wheel);
    if (D) this.tireFx(g, cx, cy, D.wr * k + 0.5, ang, speed, { rim: ri && ri.frac, rgb: ri && ri.rgb, press: pressOf(rear), wear: wearOf() });
  };
  // la V40 di serie: la ruota disegnata dal proprietario (copricerchio a dieci fori); coi cerchi in lega resta il disegno a codice
  const v40Img = () => { if (!Street2D._v40w) { const im = new Image(); im.src = 'img/v40_wheel.png'; Street2D._v40w = im; } return Street2D._v40w; };
  const v40 = S.v40Wheel;
  S.v40Wheel = function (g, cx, cy, k, ang, speed = 0, rear = false) {
    const style = (this.cos || {}).wheels, im = v40Img();
    if ((!style || style === 'none') && im.complete && im.naturalWidth) {
      const s2 = im.width * k;
      g.save(); g.imageSmoothingEnabled = false; g.translate(Math.round(cx), Math.round(cy));
      if (speed > 9) { for (let i = 0; i < 4; i++) { g.save(); g.globalAlpha = i ? 0.35 : 1; g.rotate(ang + i * Math.PI / 10); g.drawImage(im, -s2 / 2, -s2 / 2, s2, s2); g.restore(); } }
      else { g.rotate(Math.round(ang / (Math.PI / 20)) * (Math.PI / 20)); g.drawImage(im, -s2 / 2, -s2 / 2, s2, s2); }
      g.restore();
    } else v40.call(this, g, cx, cy, k, ang, speed, rear);
    const ri = im.complete && im.naturalWidth ? rimInfo(im) : null;
    this.tireFx(g, cx, cy, 14.4 * k + 0.6, ang, speed, { rim: ri ? ri.frac : 0.66, rgb: ri && ri.rgb, press: pressOf(rear), wear: wearOf() });
  };
  const sup = S.supraWheel;
  S.supraWheel = function (g, cx, cy, k, ang, speed = 0, rear = false) {
    sup.call(this, g, cx, cy, k, ang, speed, rear);
    this.tireFx(g, cx, cy, 15.5 * k, ang, speed, { rim: 0.64, press: pressOf(rear), wear: wearOf() });
  };
  // ruota disegnata a codice (traffico senza disegno, sagome di riserva): r è già il raggio esterno
  const wh = S.wheel;
  S.wheel = function (g, cx, cy, r, ang, speed) {
    wh.call(this, g, cx, cy, r, ang, speed);
    this.tireFx(g, cx, cy, r + 0.5, ang, speed, { rim: Math.max(0.4, (r - 6) / r) });
  };
  S.tireRim = rimInfo;
})();
