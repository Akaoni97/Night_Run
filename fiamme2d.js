// ============================================================================
//  Night Run · Le scene delle fiamme (dopo effetti2d.js, v0.169)
//  Ogni fiammata è una scena che dura qualche decimo di secondo e cambia forma mentre vive: nasce alla bocca, si gonfia (bulbo),
//  si allunga, poi SI STACCA dal tubo e se ne va per conto suo (portata via dall'aria della corsa), si sfrangia in pezzi e si spegne.
//  Cosa è una scena (copione, tempi, tipi) è in fiamme.js (`fiammaCopione`, `fiammaTipo`): qui c'è solo il disegno.
//    scenaNuova(st, tipo, {R, tier, pal, forza})   mette in coda una scena (rispetta il riposo tra una scena e l'altra)
//    scenaTick(g, dt, env)   disegna le scene vive e lancia scintille, grumi di fuoco e fuliggine; dice se ce n'è una
//  Il corpo della fiamma è fatto a colonne come fxFlame (bande rosso/arancio/giallo/bianco, contorno scuro), ma con forma e
//  movimento che dipendono dall'età: lunghezza che cresce a scatto, bulbo iniziale, stacco, strappi (rag), cono (race), salita
//  del fuoco caldo (curl), onde (wob), diamanti (diam), pulsare (flick). `Street2D.fiammeVecchie = true` rimette le fiamme di prima.
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined' || !Street2D.fxHelp || typeof fiammaCopione !== 'function') return;
  const S = Street2D.prototype, { FLAME_PAL, flameLight, vn } = Street2D.fxHelp, rnd = Street2D.rnd, PPM = 30;
  const ease = (x) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);

  S.scenaNuova = function (st, tipo, o) {
    const sc = st.scene || (st.scene = []);
    if (!o.forza && st.t < (st.scCool || 0)) return false;
    if (sc.length >= 4) return false;
    const c = fiammaCopione(tipo, o.tier | 0, o.R); if (!c) return false;
    sc.push({ c, age: 0, pal: o.pal || 'arancio', seed: Math.floor(o.R() * 1000), fired: c.pops.map(() => false) });
    st.scCool = st.t + c.cool;
    return true;
  };

  // quello che ogni sparo lancia nel momento in cui parte: scintille, grumi di fuoco (restano indietro sulla strada), fuliggine
  S._scenaSpara = function (st, E, p, s) {
    const R = E.R, k = E.k, { rx, exY, y0, v, mOf, parts } = E, special = s.pal === 'verde' || s.pal === 'viola' ? s.pal : null;
    for (let q = 0; q < p.sparks; q++) parts.push({ k: 'spark', m: mOf(rx - R() * p.len * k * 0.3), y: exY + (R() - 0.5) * 3, vy: -(8 + R() * 60) * p.sparkV,
      dx: v * PPM * 0.5 - 60 - R() * 150 * p.sparkV, life: 1, rate: 1.1 + R() * 1.3, gy: y0 });
    for (let q = 0; q < p.clumps; q++) parts.push({ k: 'fire', m: mOf(rx - (6 + R() * p.len * 0.6) * k), y: exY - R() * 6 * k, vy: -10 - R() * 34,
      dx: v * PPM * 0.4 - (50 + R() * 170), r: (2.4 + R() * 2.4) * k, life: 1, rate: 1.4 + R() * 0.9, gr: 2 + R() * 3, pal: special });
    if (p.soot) for (let q = 0; q < p.soot; q++) parts.push({ k: 'soot', m: mOf(rx - 12), y: exY - 2, vy: -8 - R() * 8, r: 2.5 + R() * 2, life: 1, dx: v * PPM * 0.2 - 24, v: (R() * 3) | 0 });
    if (p.ring) { st.ring = 1; st.ringLock = st.t + 0.25; }
    st.popJolt = Math.max(st.popJolt || 0, Math.min(1.2, p.luce * 1.1));
  };

  // il corpo di uno sparo all'età ph (0 nasce … 1 finito). Dà l'intensità (0-1) per la luce e per fumo e alone.
  S._scenaCorpo = function (g, E, P, p, ph, s) {
    const t = this.st.t, k = E.k, SS = this.SS || 1, u1 = 1 / SS, rq = (v) => Math.round(v * SS) / SS, fr = Math.floor(t * 30), rx = E.rx, exY = E.exY;
    const Lfull = p.len * k, Lc = Lfull * ease(ph / p.grow);
    const tail = ph > p.detach ? Lc * Math.pow((ph - p.detach) / (1 - p.detach), 1.15) * 0.92 : 0;      // il pezzo vicino alla bocca si spegne: la fiamma si stacca
    if (Lc - tail < 2 * u1) return 0;
    const fade = ph > 0.62 ? Math.max(0, 1 - Math.pow((ph - 0.62) / 0.38, 1.4)) : 1;
    const bulb = ph < 0.18 ? 1 + (p.bulb - 1) * (1 - ph / 0.18) : 1;
    const flick = p.flick ? (Math.sin(t * p.flick * 6.283 + s.seed) > 0 ? 1 : 0.62) : 1;
    const H0 = p.th * k * bulb * fade * flick, tg = Math.tan(p.ang), span = Lc - tail;
    const drift = ph > p.detach ? Math.min(40 * k, E.v * PPM * 0.55 * (ph - p.detach) * p.d) : 0;       // la parte staccata resta indietro con l'aria
    const gola = tail > 0 ? Infinity : E.gola, cutAt = p.cut || P.cut || 0, sd = s.seed;
    const centroAt = (i) => { const wf = i / Lfull; return exY - p.curl * (0.06 * Lfull + 1.5 * k) * wf * wf - i * tg + Math.sin(i * 0.5 - t * 26 + sd) * 0.9 * ((i - tail) / span) * k * p.wob; };
    const cols = [];
    for (let i = tail; i < Lc; i += u1) {
      const w2 = (i - tail) / span;
      const env = p.cone ? Math.sin(Math.PI * Math.pow(Math.min(1, w2), 0.7)) * 0.9 + 0.22 * (1 - w2)
        : (w2 < 0.12 ? 0.55 + w2 / 0.12 * 0.45 : 1) * Math.pow(1 - w2, p.taper);
      const tailEnv = tail > 0 ? Math.min(1, (i - tail) / (Lfull * 0.2 + 1)) : 1;
      let half = H0 * env * tailEnv * (0.78 + 0.44 * vn(i * 0.2 - t * 15 + sd * 3));
      if (p.jag) half *= 1 - p.jag * rnd(Math.floor(i * SS * 0.7) + fr * 91 + sd);                      // bordo spigoloso
      if (p.rag) { const q = (vn(i * 0.22 + sd * 9 - t * 11) - p.rag * 0.38) / 0.16; half *= 0.1 + 0.9 * Math.max(0, Math.min(1, q)); }   // strozzature: la fiamma si spezza in grumi dai bordi morbidi
      const ap = gola + i * 0.8, x = rx - u1 - i - (drift && i >= tail ? drift : 0), yc = centroAt(i);
      cols.push([x, yc, Math.min(ap, half * (0.8 + 0.5 * vn(i * 0.3 - t * 19 + 40 + sd))), Math.min(ap, half * (0.62 + 0.36 * vn(i * 0.26 - t * 13 + 90 + sd))), w2,
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
    band(P.b[0], 1, 0); band(P.b[1], 0.74, 0.25); band(P.b[2], 0.5, 0.6); band(P.b[3], 0.27, 1.1);
    if (gola < Infinity) { g.fillStyle = P.b[3][0]; g.fillRect(rx - u1, rq(exY - u1 / 2), u1, u1); }
    if (p.diam) {                                                                                        // diamanti del getto
      g.fillStyle = '#ffffff';
      for (let n = 1; n <= p.diam; n++) {
        const i = n * Lc / (p.diam + 1.2), hh = H0 * (0.6 - n * 0.06) * (flick < 1 ? 0.7 : 1);
        if (i > tail && hh > 0.3) g.fillRect(rq(rx - 1 - i - (drift && i >= tail ? drift : 0) - 1), rq(centroAt(i) - hh), 2, Math.max(u1, rq(hh * 2)));
      }
    }
    if (p.star && ph < 0.38) {                                                                           // la stella del botto
      const cx = rx - Lc * 0.45, ln = (3 + 9 * (1 - ph / 0.38)) * k;
      for (let r = 0; r < 8; r++) {
        const an = r * Math.PI / 4 + sd, dx = Math.cos(an), dy = Math.sin(an);
        for (let d = 2; d < ln; d += 1) { g.fillStyle = d < ln * 0.5 ? '#fff6d0' : '#ffc832'; g.fillRect(rq(cx + dx * d * 1.3), rq(exY + dy * d), u1 * 2, u1 * 2); }
      }
    }
    const a = Math.min(1, fade * p.luce);
    flameLight(this, g, rx - Lc * 0.45, exY - 1, Lc * 0.95, H0 * 2.6 + 3, P.l, 0.13 * a, 3);
    flameLight(this, g, rx - Lc * 0.4, E.y0 + 1, Lc * 1.2 + 16, 6, P.g || '#ff8a20', 0.24 * a, 4);
    return fade * Math.min(1, 0.35 + Lc / (Lfull + 1e-6));
  };

  // disegna tutte le scene vive; E = { st, rx, exY, k, y0, gola, v, mOf, R, parts }. Dà 1 se c'è una scena in corso.
  S.scenaTick = function (g, dt, E) {
    const st = E.st, sc = st.scene; st.scAct = 0;
    if (!sc || !sc.length) return 0;
    let inten = 0;
    for (const s of sc) {
      s.age += dt;
      const P = FLAME_PAL[s.pal] || FLAME_PAL.arancio;
      s.c.pops.forEach((p, i) => {
        if (s.age < p.t) return;
        if (!s.fired[i]) { s.fired[i] = true; this._scenaSpara(st, E, p, s); }
        const ph = (s.age - p.t) / p.d; if (ph >= 1) return;
        inten = Math.max(inten, this._scenaCorpo(g, E, P, p, ph, s) * p.luce);
      });
    }
    st.scene = sc.filter((s) => s.age < s.c.dur);
    st.scAct = st.scene.length || inten > 0 ? 1 : 0;
    if (inten > 0) { st.flame = Math.max(st.flame || 0, Math.min(1.14, inten * 0.95)); st.popFlash = Math.max(st.popFlash || 0, Math.min(1, inten * 0.8)); }
    return st.scAct;
  };
})();
