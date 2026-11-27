// ============================================================================
//  Night Run · Le scene delle fiamme (dopo effetti2d.js, v0.169, rifatte v0.170)
//  Ogni fiammata è una scena che dura qualche decimo di secondo e cambia forma mentre vive: nasce alla bocca, si gonfia (bulbo),
//  si allunga, poi SI STACCA dal tubo e se ne va per conto suo (portata via dall'aria della corsa), si sfrangia in pezzi e si spegne.
//  Cosa è una scena (copione, tempi, tipi, varianti) è in fiamme.js (`fiammaCopione`, `fiammaTipo`): qui c'è solo il disegno.
//    scenaNuova(st, tipo, {R, tier, pal, forza})   mette in coda una scena (rispetta il riposo tra una scena e l'altra)
//    scenaTick(g, dt, env)   disegna le scene vive e lancia scintille, grumi di fuoco e fuliggine; dice se ce n'è una
//  Disegno (v0.170, «premium»): il fuoco ha volume e sfumature: sette bande di colore (dal rosso scuro al bianco caldo, mescolate
//  a metà tra le quattro della tavolozza), lingue che guizzano in alto (`lick`), bordo a puntini che sfuma nel buio, scintille
//  che salgono dalla cresta, anima incandescente. I grumi di fuoco che restano indietro sulla strada sono piccole fiamme a goccia
//  (`_fireBlob`) che guizzano e salgono, non palline. Forma e movimento dipendono dall'età: lunghezza che cresce a scatto, bulbo,
//  stacco, strappi (rag), cono (race), salita del fuoco caldo (curl), onde (wob), diamanti (diam), pulsare (flick).
//  `Street2D.fiammeVecchie = true` rimette le fiamme di prima; `Street2D.fiammaForzata = 'rally'` le fa uscire tutte di quel tipo (prove).
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined' || !Street2D.fxHelp || typeof fiammaCopione !== 'function') return;
  const S = Street2D.prototype, { FLAME_PAL, flameLight, vn } = Street2D.fxHelp, rnd = Street2D.rnd, PPM = 30;
  const ease = (x) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
  // sette bande dalla tavolozza a quattro: le intermedie sono la media delle vicine
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, f) => { const x = hex(a), y = hex(b); return '#' + [0, 1, 2].map((i) => Math.round(x[i] + (y[i] - x[i]) * f).toString(16).padStart(2, '0')).join(''); };
  const rampe = new Map();
  const ramp = (P) => {
    const k = P.b.map((x) => x.join()).join('|'); let r = rampe.get(k);
    if (!r) { const b = P.b, m = (i) => [mix(b[i][0], b[i + 1][0], 0.5), mix(b[i][1], b[i + 1][1], 0.5)]; r = [b[0], m(0), b[1], m(1), b[2], m(2), b[3]]; rampe.set(k, r); }
    return r;
  };
  const SZ = [1, 0.84, 0.68, 0.54, 0.41, 0.28, 0.15], TP = [0, 0.12, 0.26, 0.4, 0.58, 0.8, 1.05];

  // chiazza di luce sulla strada: ellisse con caduta morbida (nessun gradino), più forte sotto la fiamma
  const chiazze = new Map();
  function chiazza(view, g, cx, cy, rx, ry, hex, a) {
    if (rx < 1 || ry < 1 || a <= 0) return;
    let im = chiazze.get(hex);
    if (!im) {
      const r = 64, c = Street2D.rgb(hex); im = document.createElement('canvas'); im.width = im.height = 2 * r;
      const x = im.getContext('2d'), gr = x.createRadialGradient(r, r, 0, r, r, r);
      for (let i = 0; i <= 8; i++) { const u = i / 8; gr.addColorStop(u, `rgba(${c},${Math.pow(1 - u, 1.7).toFixed(3)})`); }
      x.fillStyle = gr; x.fillRect(0, 0, 2 * r, 2 * r); chiazze.set(hex, im);
    }
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = Math.min(1, a); g.imageSmoothingEnabled = true; g.drawImage(im, cx - rx, cy - ry, rx * 2, ry * 2); g.restore();
  }

  S.scenaNuova = function (st, tipo, o) {
    const sc = st.scene || (st.scene = []);
    if (!o.forza && st.t < (st.scCool || 0)) return false;
    if (sc.length >= 5) return false;
    const c = fiammaCopione(tipo, o.tier | 0, o.R, o.scala); if (!c) return false;
    sc.push({ c, age: 0, pal: o.pal || 'arancio', seed: Math.floor(o.R() * 1000), fired: c.pops.map(() => false) });
    st.scCool = st.t + c.cool;
    return true;
  };

  // quello che ogni sparo lancia nel momento in cui parte: scintille, grumi di fuoco (restano indietro sulla strada), fuliggine
  S._scenaSpara = function (st, E, p, s) {
    const R = E.R, k = E.k, { rx, exY, y0, v, mOf, parts } = E, special = s.pal && s.pal !== 'arancio' && s.pal !== 'gialla' ? s.pal : null;
    for (let q = 0; q < p.sparks; q++) parts.push({ k: 'spark', m: mOf(rx - R() * p.len * k * 0.3), y: exY + p.dy * k + (R() - 0.5) * 3, vy: -(8 + R() * 60) * p.sparkV,
      dx: v * PPM * 0.5 - 60 - R() * 150 * p.sparkV, life: 1, rate: 0.8 + R() * 1.2, gy: y0 });
    for (let q = 0; q < p.clumps; q++) parts.push({ k: 'fire', blob: 1, sd: R() * 100, m: mOf(rx - (6 + R() * p.len * 0.6) * k), y: exY - R() * 6 * k, vy: -8 - R() * 30,
      dx: v * PPM * 0.4 - (45 + R() * 150), r: (1.7 + R() * 1.9) * k, life: 1, rate: 1.5 + R() * 0.9, gr: 0.3 + R() * 0.8, pal: special });
    if (p.soot) for (let q = 0; q < p.soot; q++) parts.push({ k: 'soot', m: mOf(rx - (14 + R() * 10) * k), y: exY - 3 * k, vy: -7 - R() * 8, r: (1.8 + R() * 1.6) * k, a: 0.22, layer: 0, life: 1, dx: v * PPM * 0.2 - 24, v: (R() * 3) | 0 });   // il fumo viene dopo la fiamma, rado e dietro l'auto
    st.popJolt = Math.max(st.popJolt || 0, Math.min(1.2, p.luce * 1.1));
  };

  // un grumo di fuoco che resta indietro: una goccia di fiamma che guizza e sale, con le sue sfumature, non una pallina.
  // p.life 1 → 0: nasce piena e calda, poi si accorcia, si fa rossa e si spegne.
  S._fireBlob = function (g, X, Y, p, L) {
    const t = this.st.t, SS = this.SS || 1, u = 1 / SS, rq = (v) => Math.round(v * SS) / SS, F = FLAME_PAL[p.pal] || FLAME_PAL.arancio, R7 = ramp(F);
    const sc = 0.5 + 0.5 * Math.min(1, L * 1.5), r = p.r * sc, h = r * 1.35, bot = r * 0.85, sd = p.sd || 0;
    const calore = Math.min(1, L * 1.35);                                              // quanto è ancora calda: sceglie le bande
    const ci = (i) => { const j = Math.max(0, Math.min(6, i - Math.round((1 - calore) * 4))); return R7[j][0]; };
    const row = (y, hw, cx, col) => { const x1 = rq(cx - hw), x2 = rq(cx + hw); if (x2 - x1 >= u) { g.fillStyle = col; g.fillRect(x1, rq(Y + y), x2 - x1, u); } };
    for (let y = -h; y <= bot; y += u) {
      const s = (y + h) / (h + bot);                                                    // 0 punta, 1 base
      const body = s < 0.45 ? Math.pow(s / 0.45, 1.5) : Math.sqrt(Math.max(0, 1 - Math.pow((s - 0.45) / 0.55, 2)));
      const fl = 0.68 + 0.62 * vn(y * 0.9 + t * 22 + sd), hw = r * 1.15 * body * fl, cx = X + Math.sin(y * 0.7 + t * 26 + sd) * 1.2 * (1 - s) * (r / 3);
      if (hw < u * 0.5) continue;
      row(y, hw + u, cx, F.o); row(y, hw, cx, ci(0));
      row(y, hw * 0.8, cx, ci(1)); row(y, hw * 0.62, cx, ci(2)); row(y, hw * 0.46, cx, ci(3));
      if (s > 0.4) { row(y, hw * 0.3, cx, ci(4)); if (s > 0.55 && calore > 0.5) row(y, hw * 0.16, cx, ci(5)); }
    }
  };

  // la tela d'appoggio e quelle del bagliore (riusate: una per misura)
  const tele = {};
  const tela = (n, w, h) => { let c = tele[n]; if (!c) c = tele[n] = document.createElement('canvas'); if (c.width !== w || c.height !== h) { c.width = w; c.height = h; } return c; };
  const filtro = typeof CanvasRenderingContext2D !== 'undefined' && 'filter' in CanvasRenderingContext2D.prototype;

  // il corpo di uno sparo all'età ph (0 nasce … 1 finito), disegnato su og (la tela d'appoggio: stesse coordinate della strada).
  // Dà { i: intensità 0-1, Lc, H0, flash } per la luce, il fumo e il bagliore.
  S._scenaCorpo = function (g, E, P, p, ph, s) {
    const t = this.st.t, k = E.k, SS = this.SS || 1, u1 = 1 / SS, rq = (v) => Math.round(v * SS) / SS, fr = Math.floor(t * 30), rx = E.rx, exY = E.exY + p.dy * k;
    const vel = E.v || 0, vento = 1 / (1 + vel / 9);                                                      // la corsa schiaccia la fiamma all'indietro: sale meno, si allunga di più
    const Lfull = p.len * k * (1 + Math.min(0.3, vel / 80)), Lc = Lfull * ease(ph / p.grow);
    const tail = ph > p.detach ? Lc * Math.pow((ph - p.detach) / (1 - p.detach), 1.15) * 0.92 : 0;      // il pezzo vicino alla bocca si spegne: la fiamma si stacca
    if (Lc - tail < 2 * u1) return null;
    const fade = ph > 0.62 ? Math.max(0, 1 - Math.pow((ph - 0.62) / 0.38, 1.4)) : 1;
    const bulb = ph < 0.18 ? 1 + (p.bulb - 1) * (1 - ph / 0.18) : 1;
    const sd = s.seed + p.ph0 * 37, flick = p.flick ? (Math.sin(t * p.flick * 6.283 + sd) > 0 ? 1 : 0.62) : 1;
    const H0 = p.th * k * bulb * fade * flick, tg = Math.tan(p.ang), span = Lc - tail;
    const drift = ph > p.detach ? Math.min(40 * k, vel * PPM * 0.55 * (ph - p.detach) * p.d) : 0;       // la parte staccata resta indietro con l'aria
    const gola = tail > 0 ? Infinity : E.gola, cutAt = p.cut || P.cut || 0, R7 = ramp(P);
    const centroAt = (i) => { const wf = i / Lfull; return exY - p.curl * vento * (0.06 * Lfull + 1.5 * k) * wf * wf - i * tg + Math.sin(i * 0.5 - t * 26 + sd) * 0.9 * ((i - tail) / span) * k * p.wob; };
    const cols = [];
    for (let i = tail; i < Lc; i += u1) {
      const w2 = (i - tail) / span;
      const env = p.cone ? Math.sin(Math.PI * Math.pow(Math.min(1, w2), 0.7)) * 0.9 + 0.22 * (1 - w2)
        : (w2 < 0.12 ? 0.55 + w2 / 0.12 * 0.45 : 1) * Math.pow(1 - w2, p.taper);
      const tailEnv = tail > 0 ? Math.min(1, (i - tail) / (Lfull * 0.2 + 1)) : 1;
      let half = H0 * env * tailEnv * (0.74 + 0.5 * vn(i * 0.2 - t * 15 + sd * 3) + 0.18 * (vn(i * 0.7 - t * 33 + sd) - 0.5));        // due ottave di turbolenza
      if (p.jag) half *= 1 - p.jag * rnd(Math.floor(i * SS * 0.7) + fr * 91 + sd);                      // bordo spigoloso
      if (p.rag) { const q = (vn(i * 0.22 + sd * 9 - t * 11) - p.rag * 0.38) / 0.16; half *= 0.1 + 0.9 * Math.max(0, Math.min(1, q)); }   // strozzature: grumi dai bordi morbidi
      // lingue che guizzano in alto: picchi che corrono verso la punta
      const lick = p.lick ? 1 + p.lick * Math.pow(Math.max(0, Math.sin(i * 0.85 - t * 38 + sd)), 3) * Math.min(1, w2 * 3.2) : 1;
      const ap = gola + i * 0.8, x = rx - u1 - i - (drift && i >= tail ? drift : 0), yc = centroAt(i);
      cols.push([x, yc, Math.min(ap, half * lick * (0.85 + 0.5 * vn(i * 0.3 - t * 19 + 40 + sd))), Math.min(ap, half * (0.56 + 0.34 * vn(i * 0.26 - t * 13 + 90 + sd))), w2,
        cutAt && w2 > cutAt + 0.06 * Math.sin(x * 0.7 + fr) ? 1 : 0]);
    }
    g.fillStyle = P.o;
    for (const c of cols) { const y1 = rq(c[1] - c[2]), y2 = rq(c[1] + c[3]); if (y2 - y1 >= u1 * 2) g.fillRect(c[0], y1 - u1, u1, y2 - y1 + 2 * u1); }
    const band = (bc, sz, taper) => {
      let left = 0, right = 0, top = 0, height = 0, color;
      for (const c of cols) {
        const m = sz * Math.max(0, 1 - c[4] * taper), y1 = rq(c[1] - c[2] * m), y2 = rq(c[1] + c[3] * m);
        const h = y2 - y1 >= u1 || (sz === 1 && rnd(c[0] * 3.1 + fr) < 0.55) ? Math.max(u1, y2 - y1) : 0, col = bc[c[5]];
        if (h && h === height && y1 === top && col === color) { left = c[0]; continue; }
        if (height) g.fillRect(left, top, right - left, height);
        height = h; if (!h) continue;
        if (col !== color) { g.fillStyle = col; color = col; }
        left = c[0]; right = left + u1; top = y1;
      }
      if (height) g.fillRect(left, top, right - left, height);
    };
    for (let b = 0; b < 7; b++) band(R7[b], SZ[b], TP[b]);
    // bordo a puntini che sfuma nel buio e scintille che salgono dalla cresta
    const dot = R7[0][0];
    for (const c of cols) {
      const q = rnd(c[0] * 5.3 + fr * 7);
      if (c[4] > 0.08 && q < 0.3 * Math.min(1, fade * 1.4)) { g.fillStyle = q < 0.12 ? R7[2][0] : dot; g.fillRect(c[0], rq(c[1] - c[2]) - u1 * (1 + (q * 12 | 0) % 3), u1, u1); }
      if (c[4] > 0.25 && q > 0.93) { g.fillStyle = R7[3][0]; g.fillRect(c[0], rq(c[1] - c[2]) - u1 * (3 + (q * 90 | 0) % 6), u1, u1); }
    }
    if (gola < Infinity) { g.fillStyle = R7[6][0]; g.fillRect(rx - u1, rq(exY - u1 / 2), u1, u1); }
    if (p.diam) {                                                                                        // diamanti del getto: gonfiori più chiari lungo l'anima, un po' irregolari
      g.fillStyle = R7[5][0];
      for (let n = 1; n <= p.diam; n++) {
        const i = n * Lc / (p.diam + 1.2) * (0.94 + 0.12 * rnd(sd + n)), hh = H0 * (0.5 - n * 0.05) * (flick < 1 ? 0.7 : 1);
        if (i > tail && hh > 0.3) g.fillRect(rq(rx - 1 - i - (drift && i >= tail ? drift : 0) - 1.5), rq(centroAt(i) - hh * 0.7), 3, Math.max(u1, rq(hh * 1.4)));
      }
    }
    const flash = p.star && ph < 0.3 ? 1 + 1.3 * (1 - ph / 0.3) : 1;                                     // il lampo dei botti: più bagliore per un attimo
    return { i: fade * Math.min(1, 0.35 + Lc / (Lfull + 1e-6)), Lc, H0, fade, flash, rx, exY };
  };

  // disegna tutte le scene vive; E = { st, rx, exY, k, y0, gola, v, mOf, R, parts }. Dà 1 se c'è una scena in corso.
  // Le fiamme si disegnano su una tela d'appoggio: sulla strada ci va il disegno netto (nucleo bruciato, bordo a puntini) e sopra, a
  // luce somma (`lighter`), due copie sfocate: bagliore stretto e alone largo. È quello che fa sembrare vero il fuoco di notte.
  S.scenaTick = function (g, dt, E) {
    const st = E.st, sc = st.scene; st.scAct = 0;
    if (!sc || !sc.length) return 0;
    const k = E.k, SSn = this.SS || 1, Wu = 215 * k, Hu = 110 * k, ox = E.rx - 200 * k, oy = E.exY - 75 * k;
    const cw = Math.ceil(Wu * SSn), ch = Math.ceil(Hu * SSn), cv = tela('corpo', cw, ch), og = cv.getContext('2d');
    og.setTransform(1, 0, 0, 1, 0, 0); og.globalAlpha = 1; og.globalCompositeOperation = 'source-over'; og.clearRect(0, 0, cw, ch);
    og.setTransform(SSn, 0, 0, SSn, -ox * SSn, -oy * SSn); og.imageSmoothingEnabled = false;
    let inten = 0, flash = 1; const luci = [];
    for (const s of sc) {
      s.age += dt;
      const P = FLAME_PAL[s.pal] || FLAME_PAL.arancio;
      s.c.pops.forEach((p, i) => {
        if (s.age < p.t) return;
        if (!s.fired[i]) { s.fired[i] = true; this._scenaSpara(st, E, p, s); }
        const ph = (s.age - p.t) / p.d; if (ph >= 1) return;
        const r = this._scenaCorpo(og, E, P, p, ph, s); if (!r) return;
        inten = Math.max(inten, r.i * p.luce); flash = Math.max(flash, r.flash); luci.push([r, P, p]);
      });
    }
    const fl = 0.8 + 0.3 * vn(this.st.t * 47 + (sc[0].seed || 0));                                          // il fuoco non brilla mai uguale
    g.save(); g.imageSmoothingEnabled = false; g.drawImage(cv, 0, 0, cw, ch, ox, oy, Wu, Hu); g.restore();   // il disegno netto
    if (inten > 0 && this.quality !== 'bassa') {                                                           // bagliore stretto + alone largo
      const a = Math.min(1, inten) * fl;
      const bagliore = (n, div, blur, alfa) => {
        const w = Math.max(8, Math.ceil(cw / div)), h = Math.max(8, Math.ceil(ch / div)), bc = tela(n, w, h), bg = bc.getContext('2d');
        bg.setTransform(1, 0, 0, 1, 0, 0); bg.clearRect(0, 0, w, h); bg.imageSmoothingEnabled = true; bg.imageSmoothingQuality = 'high';
        if (filtro) bg.filter = `blur(${blur}px)`;
        bg.drawImage(cv, 0, 0, cw, ch, 0, 0, w, h); if (filtro) bg.filter = 'none';
        g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = Math.min(1, alfa * a * flash); g.imageSmoothingEnabled = true; g.drawImage(bc, 0, 0, w, h, ox, oy, Wu, Hu); g.restore();
      };
      bagliore('bag1', 2, 1, 0.75); bagliore('bag2', 5, 1, 0.55);
    }
    for (const [r, P, p] of luci) {                                                                        // la luce che butta in giro: sull'aria intorno e sulla strada
      const a = Math.min(1, r.fade * p.luce * r.flash);
      chiazza(this, g, r.rx - r.Lc * 0.42, r.exY - 1, r.Lc * 0.85 + 12, r.H0 * 2.4 + 8, P.l, 0.3 * a * fl);
      chiazza(this, g, r.rx - r.Lc * 0.38, E.y0 + 1, r.Lc * 0.75 + 14, 5 + r.H0 * 0.5, P.g || '#ff8a20', 0.5 * a * fl);
    }
    st.scene = sc.filter((s) => s.age < s.c.dur);
    st.scAct = st.scene.length || inten > 0 ? 1 : 0;
    if (inten > 0) { st.flame = Math.max(st.flame || 0, Math.min(1.14, inten * 0.95)); st.popFlash = Math.max(st.popFlash || 0, Math.min(1, inten * 0.8)); }
    return st.scAct;
  };
})();
