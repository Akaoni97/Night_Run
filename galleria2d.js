// ============================================================================
//  Gallerie del Viaggio (si aggancia a Street2D, dopo street2d.js).
//  Dove il paesaggio cambia (VG_ROUTE in viaggio.js) la strada passa sotto la montagna: imbocco col nome,
//  dentro volta, piastrelle, luci al sodio che scorrono, ventole, nicchie SOS e cartelli delle uscite;
//  il paesaggio cambia mentre si è dentro e all'uscita se ne trova uno nuovo.
//  tunnelSpan dice se c'è una galleria in vista; drawTunnelBack la disegna dietro la strada, drawTunnelFront
//  copre il bordo vicino e scurisce l'interno (dopo pioggia e luce del giorno).
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, rnd = Street2D.rnd, PPM = 30;
  const HALF = 180;                                              // metà lunghezza della galleria, in metri
  const LAMP = 12, FAN = 120, SOS = 150;                         // passo di luci, ventole e nicchie SOS
  const NAMES = { tokyo: 'CITTA', bassa: 'DELLA BASSA', sangimignano: 'DELLE TORRI', positano: 'DEL MARE', hakone: 'DEL PASSO', wangan: 'DELLA BAIA', route66: 'DEL DESERTO' };

  // confini tra paesaggi in metri, dal km 0 (il primo tratto è casa, poi il giro si ripete)
  const borders = () => {
    if (typeof VG_ROUTE === 'undefined') return [];
    if (S._borders) return S._borders;
    const out = []; let m = VG_ROUTE[0][1] * 1000;
    const cyc = VG_ROUTE.slice(1);
    for (let lap = 0; lap < 40; lap++) for (let i = 0; i < cyc.length; i++) { out.push({ x: m, to: cyc[i][0] }); m += cyc[i][1] * 1000; }
    return (S._borders = out);
  };
  S.tunnelSpan = function (game, from, to) {
    if (!game || !game.s || !game.s.vg) return null;
    for (const B of borders()) {
      if (B.x - HALF > to + 60) break;
      if (B.x + HALF >= from - 60) return { a: B.x - HALF, b: B.x + HALF, B: B.x, to: B.to, name: 'GALLERIA ' + (NAMES[B.to] || '') };
    }
    return null;
  };
  // luci della volta in vista (posizione in metri)
  S.tunnelLamps = function (T, from, to) {
    const out = [];
    for (let m = Math.ceil(Math.max(T.a + 6, from) / LAMP) * LAMP; m < Math.min(T.b - 4, to); m += LAMP) out.push(m);
    return out;
  };

  // montagna sopra l'imbocco: roccia e prato che salgono dal portale e si perdono nel paesaggio
  const mountain = (g, x, dir, W) => {
    const span = 260;
    for (let k = 0; k <= span; k += 2) {
      const xx = x + dir * k; if (xx < -4 || xx > W + 4) continue;
      const u = k / span, top = 40 + u * u * 150 + Math.sin(k * 0.09) * 6 + rnd(Math.floor(k / 6) + (dir > 0 ? 50 : 0)) * 5;
      g.fillStyle = '#1f2a22'; g.fillRect(xx, top, 2, 236 - top);
      g.fillStyle = '#2f4430'; g.fillRect(xx, top, 2, 3);                                      // prato in cima
      g.fillStyle = '#3d5a3a'; if (k % 6 === 0) g.fillRect(xx, top - 1, 1, 1);
      if (k % 14 === 0) { g.fillStyle = '#2a2a30'; g.fillRect(xx, top + 18 + rnd(k) * 40, 3, 2); }   // sassi
    }
  };
  // imbocco: muro di testa in cemento con la luce di benvenuto e il nome della galleria
  const portal = (g, x, T, inner, self) => {
    g.fillStyle = '#0a0a0e'; g.fillRect(x - 3, 30, 36, 206);
    g.fillStyle = '#5a5c64'; g.fillRect(x - 2, 31, 34, 205);
    g.fillStyle = '#74767e'; g.fillRect(x - 2, 31, 34, 3); g.fillRect(x - 2, 31, 3, 205);
    g.fillStyle = '#44464e'; for (let y = 52; y < 236; y += 22) g.fillRect(x - 2, y, 34, 1);
    for (let k = 0; k < 34; k += 4) { g.fillStyle = (k >> 2) % 2 ? '#ffc832' : '#141414'; g.fillRect(x - 2 + k, 214, 4, 6); }   // fascia gialla e nera
    const w = self.textW(T.name, 1) + 10, sx = Math.round(x + 15 - w / 2);
    g.fillStyle = '#0a0a0e'; g.fillRect(sx - 1, 37, w + 2, 13); g.fillStyle = '#1b3a86'; g.fillRect(sx, 38, w, 11);
    self.text(g, T.name, sx + 5, 41, '#f4f1e6', 1);
    if (!inner) { self.light(g, x + 15, 60, 30, 10, '#ffd98a', 0.1, 3); g.fillStyle = '#ffe9b8'; g.fillRect(x + 6, 58, 18, 2); }
  };

  S.drawTunnelBack = function (g, T, wx, W, t) {
    const xa = wx(T.a), xb = wx(T.b), x0 = Math.max(0, xa), x1 = Math.min(W, xb);
    if (x1 <= x0) return;
    // volta e pareti
    g.save(); g.beginPath(); g.rect(x0, 0, x1 - x0, 236); g.clip();
    const gr = g.createLinearGradient(0, 0, 0, 236);
    gr.addColorStop(0, '#121116'); gr.addColorStop(0.18, '#1d1c22'); gr.addColorStop(0.2, '#2c2b30'); gr.addColorStop(0.6, '#34333a'); gr.addColorStop(0.62, '#6e6c62'); gr.addColorStop(0.9, '#7e7a6c'); gr.addColorStop(0.91, '#2a2a30'); gr.addColorStop(1, '#202026');
    g.fillStyle = gr; g.fillRect(x0, 0, x1 - x0, 236);
    const off = (m) => wx(m);
    // giunti del rivestimento ogni 4 m, macchie di umidità, piastrelle in basso
    for (let m = Math.floor((T.a) / 4) * 4; m < T.b; m += 4) { const x = off(m); if (x < x0 - 2 || x > x1) continue; g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x, 46, 1, 100); if (rnd(m) < 0.3) { g.fillStyle = 'rgba(20,18,14,.25)'; g.fillRect(x + 4, 60 + rnd(m + 1) * 30, 2 + rnd(m + 2) * 3, 30 + rnd(m + 3) * 50); } }
    g.fillStyle = 'rgba(40,38,32,.5)';
    for (let y = 152; y < 213; y += 6) g.fillRect(x0, y, x1 - x0, 1);
    for (let m = Math.floor(T.a / 0.3) * 0.3; m < T.b; m += 0.3) { const x = off(m); if (x >= x0 && x <= x1) g.fillRect(x, 146, 1, 67); }
    g.fillStyle = '#2a4a8a'; g.fillRect(x0, 196, x1 - x0, 4); g.fillStyle = '#e8e4d6'; g.fillRect(x0, 200, x1 - x0, 2);   // fascia blu e bianca
    // marciapiede di servizio con la ringhiera
    g.fillStyle = '#4a4a52'; g.fillRect(x0, 214, x1 - x0, 2); g.fillStyle = '#3a3a42'; g.fillRect(x0, 216, x1 - x0, 16);
    g.fillStyle = '#8a8c94'; g.fillRect(x0, 206, x1 - x0, 1);
    for (let m = Math.ceil(T.a / 2) * 2; m < T.b; m += 2) { const x = off(m); if (x >= x0 && x <= x1) g.fillRect(x, 206, 1, 9); }
    // canalina delle luci sulla volta, ventole, nicchie SOS, cartelli verdi delle uscite
    g.fillStyle = '#0e0e12'; g.fillRect(x0, 38, x1 - x0, 5);
    for (let m = Math.ceil(T.a / FAN) * FAN + 30; m < T.b - 20; m += FAN) {
      const x = off(m); if (x < x0 - 60 || x > x1 + 10) continue;
      for (const d of [0, 34]) { g.fillStyle = '#0a0a0e'; g.fillRect(x + d, 14, 28, 14); g.fillStyle = '#4a4c54'; g.fillRect(x + d + 1, 15, 26, 12); g.fillStyle = '#5e6068'; g.fillRect(x + d + 1, 15, 26, 2); g.fillStyle = '#1a1a20'; g.fillRect(x + d + 1, 18, 2, 6); g.fillRect(x + d + 25, 18, 2, 6); }
    }
    for (let m = Math.ceil(T.a / SOS) * SOS + 40; m < T.b - 10; m += SOS) {
      const x = off(m); if (x < x0 - 40 || x > x1 + 10) continue;
      g.fillStyle = '#0a0a0e'; g.fillRect(x - 1, 160, 26, 40); g.fillStyle = '#e8701a'; g.fillRect(x, 161, 24, 38);
      g.fillStyle = '#f4f1e6'; g.fillRect(x + 3, 164, 18, 9); this.text(g, 'SOS', x + 6, 166, '#c42a1a', 1);
      g.fillStyle = '#c45410'; g.fillRect(x + 3, 176, 18, 20); g.fillStyle = '#ffd98a'; g.fillRect(x + 10, 180, 4, 4);
      this.light(g, x + 12, 180, 26, 26, '#ff8a20', 0.08, 3);
      const ex = x + 60; g.fillStyle = '#0a0a0e'; g.fillRect(ex - 1, 120, 50, 14); g.fillStyle = '#1f8a4a'; g.fillRect(ex, 121, 48, 12);
      this.text(g, 'USCITA', ex + 3, 124, '#f4f1e6', 1); g.fillStyle = '#f4f1e6'; g.fillRect(ex + 33, 126, 10, 1); g.fillRect(ex + 41, 125, 1, 3);
      this.light(g, ex + 24, 127, 32, 12, '#3bff7a', 0.06, 3);
    }
    for (const m of this.tunnelLamps(T, T.a - 2, T.b + 2)) {
      const x = off(m); if (x < x0 - 20 || x > x1 + 20) continue;
      g.fillStyle = '#ffe2a0'; g.fillRect(x - 6, 41, 13, 2); g.fillStyle = '#fff6d8'; g.fillRect(x - 3, 41, 7, 1);
      this.light(g, x, 44, 22, 8, '#ffb347', 0.22, 3);
      this.light(g, x, 170, 50, 60, '#ffb347', 0.05, 3);                        // luce sulla parete
    }
    g.restore();
    // imbocchi e montagna fuori
    if (xa > -40 && xa < W + 300) { mountain(g, xa, -1, W); portal(g, xa - 30, T, false, this); }
    if (xb > -300 && xb < W + 40) { mountain(g, xb, 1, W); portal(g, xb, T, true, this); }
  };

  // bordo vicino e luce dentro la galleria (si chiama dopo pioggia e luce del giorno)
  S.drawTunnelFront = function (g, T, wx, W) {
    const xa = wx(T.a), xb = wx(T.b), x0 = Math.max(0, xa), x1 = Math.min(W, xb);
    if (x1 <= x0) return;
    g.fillStyle = '#0a0a0e'; g.fillRect(x0, 338, x1 - x0, 2);
    g.fillStyle = '#3a3a42'; g.fillRect(x0, 340, x1 - x0, 4); g.fillStyle = '#26262c'; g.fillRect(x0, 344, x1 - x0, 16);
    g.fillStyle = '#ffc832'; for (let m = Math.ceil(T.a / 1.2) * 1.2; m < T.b; m += 2.4) { const x = wx(m); if (x >= x0 && x <= x1) g.fillRect(x, 344, 12, 2); }   // cordolo giallo e nero
    for (const x of [xa - 30, xb]) if (x > -40 && x < W + 10) { g.fillStyle = '#0a0a0e'; g.fillRect(x - 3, 336, 36, 24); g.fillStyle = '#5a5c64'; g.fillRect(x - 2, 337, 34, 23); }
    // dentro: penombra calda, luci al sodio che scendono sulla strada
    g.save(); g.beginPath(); g.rect(x0, 0, x1 - x0, 360); g.clip();
    g.fillStyle = 'rgba(14,10,4,.34)'; g.fillRect(x0, 0, x1 - x0, 360);
    g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,170,70,.35)'; g.fillRect(x0, 0, x1 - x0, 360);
    g.restore();
    for (const m of this.tunnelLamps(T, T.a, T.b)) { const x = wx(m); if (x < x0 - 30 || x > x1 + 30) continue; this.light(g, x, 290, 70, 40, '#ffb347', 0.045, 3); }
  };
})();
