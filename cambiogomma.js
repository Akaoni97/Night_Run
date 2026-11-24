// ============================================================================
//  Night Run · Il cambio gomma con la ruota di scorta, fatto da te (dopo soccorso.js)
//  Tasto 9, o «Usa» sulla ruota di scorta nel bagagliaio: l'auto si sposta nella corsia di destra e si ferma
//  (`changeTyre` in viaggio.js, `ap.gomma`). Poi il protagonista scende, va al bagagliaio a prendere la scorta,
//  la porta alla ruota forata, si inginocchia: crick, bulloni, cambio, bulloni, giù. Torna al bagagliaio con la
//  gomma forata, la mette dentro, risale. Come il meccanico del soccorso, ma sei tu (`pgStanding` col tuo aspetto).
//  Tempi e punti in `CG`; la sequenza è pura (`cgTimeline`, `cgAt`) e provata in test/cambiogomma.test.js.
//  U durante il cambio lo accelera ×3 (e lo rimette normale).
// ============================================================================
const CG = {
  porta: 0.3,        // m dal centro dell'auto: dove scende (la portiera)
  baule: -2.1,       // m: il bagagliaio, dietro
  ruota: [1.4, 1.4, -1.5, -1.5],   // m: dove sta la ruota (anteriore sinistra, destra, posteriore sinistra, destra)
  walkV: 1.7,        // m/s a piedi
  scende: 0.5,       // s per scendere
  sale: 0.45,        // s per risalire
  prende: 0.9,       // s al bagagliaio per prendere la scorta
  posa: 0.7,         // s al bagagliaio per mettere dentro la forata
  lavoro: 6,         // s in ginocchio alla ruota
  fasi: [['crick', 0.22], ['svita', 0.2], ['cambio', 0.16], ['avvita', 0.24], ['giu', 0.18]],   // parti del lavoro (frazioni)
  fast: 3,           // con U
};

// la sequenza per la gomma i: [{ k, t0, t1, at | from,to, carry }]  (carry: 'scorta' | 'forata')
function cgTimeline(i) {
  const W = CG.ruota[i] ?? CG.ruota[0], segs = []; let t = 0;
  const add = (o, d) => { segs.push(Object.assign(o, { t0: t, t1: t + d })); t += d; };
  const walk = (from, to, carry) => add({ k: 'walk', from, to, carry }, Math.abs(to - from) / CG.walkV);
  add({ k: 'out', at: CG.porta }, CG.scende);
  walk(CG.porta, CG.baule);
  add({ k: 'baule', at: CG.baule, carry: 'scorta' }, CG.prende);
  walk(CG.baule, W, 'scorta');
  add({ k: 'lavoro', at: W }, CG.lavoro);
  walk(W, CG.baule, 'forata');
  add({ k: 'posa', at: CG.baule, carry: 'forata' }, CG.posa);
  walk(CG.baule, CG.porta);
  add({ k: 'in', at: CG.porta }, CG.sale);
  return { segs, end: t, ruota: W };
}
const cgDur = (i) => cgTimeline(i).end;

// dov'è il protagonista al secondo t: { x, a, dir, walk, ph, kneel, carry, k, fase, u }; null prima e dopo
function cgAt(TL, t) {
  if (!TL || t < 0 || t >= TL.end) return null;
  const g = TL.segs.find((q) => t >= q.t0 && t < q.t1) || TL.segs[TL.segs.length - 1];
  const u = Math.max(0, Math.min(1, (t - g.t0) / Math.max(1e-3, g.t1 - g.t0)));
  if (g.k === 'walk') {
    const e = u * u * (3 - 2 * u), x = g.from + (g.to - g.from) * e;
    return { k: 'walk', x, a: 1, dir: Math.sign(g.to - g.from) || 1, walk: true, ph: Math.abs(g.to - g.from) * e / 1.1, carry: g.carry || null, u };
  }
  if (g.k === 'out') return { k: 'out', x: g.at, a: Math.min(1, u * 1.6), dir: -1, carry: null, u };
  if (g.k === 'in') return { k: 'in', x: g.at, a: 1 - u, dir: 1, carry: null, u };
  if (g.k === 'lavoro') {
    let acc = 0, fase = CG.fasi[CG.fasi.length - 1][0], fu = 1;
    for (const [nome, f] of CG.fasi) { if (u < acc + f) { fase = nome; fu = (u - acc) / f; break; } acc += f; }
    return { k: 'lavoro', x: g.at, a: 1, dir: g.at >= CG.baule ? -1 : 1, kneel: true, fase, fu, u, carry: null };
  }
  // al bagagliaio: girato verso il bagagliaio (dietro), la ruota in mano a metà
  return { k: g.k, x: g.at, a: 1, dir: -1, carry: g.k === 'baule' ? (u > 0.5 ? 'scorta' : null) : (u < 0.5 ? 'forata' : null), u };
}

if (typeof window !== 'undefined') Object.assign(window, { CG, cgTimeline, cgAt, cgDur });
if (typeof module !== 'undefined') module.exports = { CG, cgTimeline, cgAt, cgDur };

// ---------------------------------------------------------------- la scena sulla strada (solo nel browser)
(function cgScena() {
  if (typeof Street2D === 'undefined' || typeof document === 'undefined') return;
  const P = Street2D.prototype;
  const ink = '#10121c';
  const up = P.update;
  P.update = function (dt, s, game) {
    const G = game && game.ap && game.ap.gomma; this._cg = G && G.go ? G : null; this._cgOut = false;
    if (this._cg) { const m = cgAt(this._cg.tl, this._cg.t); this._cgOut = !!m && !(m.k === 'out' && m.u < 0.25) && !(m.k === 'in' && m.u > 0.8); }
    return up.call(this, dt, s, game);
  };
  // il posto di guida resta vuoto mentre sei a piedi
  const dd = P.drawDriver;
  if (dd) P.drawDriver = function (...a) { if (this._cgOut) return; return dd.apply(this, a); };

  // una ruota vista di fianco (in mano o appoggiata)
  function ruota(g, x, y, r, flat) {
    g.fillStyle = ink; g.beginPath(); g.ellipse(x, y, r + 1, flat ? (r + 1) * 0.35 : r + 1, 0, 0, 7); g.fill();
    g.fillStyle = '#1d1f28'; g.beginPath(); g.ellipse(x, y, r, flat ? r * 0.35 : r, 0, 0, 7); g.fill();
    g.fillStyle = '#8c95a8'; g.beginPath(); g.ellipse(x, y, r * 0.5, flat ? r * 0.17 : r * 0.5, 0, 0, 7); g.fill();
    g.fillStyle = '#4a5162'; g.beginPath(); g.ellipse(x, y, r * 0.18, flat ? r * 0.07 : r * 0.18, 0, 0, 7); g.fill();
  }

  P.cgDraw = function (g, G) {
    const m = cgAt(G.tl, G.t); if (!m || !this.carPos) return;
    const PPM = 30, cp = this.carPos, t = this.st.t, SX = (x) => Math.round(cp.x + x * PPM);
    const hy = this.laneY(this.st.lz), k = 0.47 * (this.laneS ? this.laneS(hy) / this.laneS(240) : 1);
    const px = SX(m.x), py = Math.round(hy + 6), R = Math.max(4, Math.round(15 * k));
    const wx = SX(G.tl.ruota), work = m.k === 'lavoro';
    // il crick sotto la ruota, e la ruota tolta per terra durante il cambio
    if (work) {
      const su = m.fase === 'crick' ? m.fu : m.fase === 'giu' ? 1 - m.fu : 1;
      g.fillStyle = ink; g.fillRect(wx - 5, py - 2, 11, 3); g.fillStyle = '#c8282b'; g.fillRect(wx - 4, py - 1, 9, 1);
      g.fillStyle = '#9aa3b8'; g.fillRect(wx - 1, Math.round(py - 3 - su * 5), 2, Math.round(2 + su * 5));
      if (m.fase === 'cambio' || m.fase === 'avvita' || m.fase === 'giu') ruota(g, px + m.dir * -14, py + 1, R, true);
      if (m.fase === 'cambio' && m.fu < 0.5) ruota(g, px + m.dir * -8, py - 10, R, false);
      const beat = m.fase === 'crick' ? 0.8 : m.fase === 'svita' || m.fase === 'avvita' ? 1.2 : 9;
      const b = Math.floor(t / beat);
      if (beat < 9 && this._cgB !== b) {
        this._cgB = b;
        if (this.comic) this.comic(m.fase === 'crick' ? 'CRICK' : 'TAC TAC TAC', px + m.dir * 12, py - 34, m.fase === 'crick' ? '#ffd23f' : '#e8f0ff', 2);
      }
      if (m.fase === 'svita' || m.fase === 'avvita') { const a = t * 14; g.fillStyle = '#cfd6e4'; g.fillRect(Math.round(px + m.dir * 9 + Math.cos(a) * 3), Math.round(py - 14 + Math.sin(a) * 3), 2, 2); }
    }
    if ((m.k === 'baule' || m.k === 'posa') && Math.abs(m.u - 0.5) < 0.04 && this._cgS !== m.k) { this._cgS = m.k; if (this.comic) this.comic(m.k === 'baule' ? 'CLAC' : 'SBAM', SX(CG.baule) - 6, py - 40, '#ffb347', 2); }
    if (m.k !== 'baule' && m.k !== 'posa') this._cgS = null;
    if (m.a <= 0.01 || typeof pgStanding !== 'function') return;
    const look = window.NightPG ? NightPG.now() : null;
    g.save(); g.globalAlpha = m.a;
    if (m.kneel) { g.translate(0, py); g.scale(1, 0.72); g.translate(0, -py); }
    if (m.dir < 0) { g.translate(px * 2, 0); g.scale(-1, 1); }
    pgStanding(g, px, py, k, m.ph || 0, !!m.walk, look, 0.12, t, undefined);
    g.restore();
    // la ruota in mano, davanti alla pancia
    if (m.carry) ruota(g, px + m.dir * Math.round(7 * k / 0.47), Math.round(py - 15 * k / 0.47), R, false);
  };

  const pr = P.present;
  P.present = function (...a) {
    if (this._cg && this.g) { try { this.cgDraw(this.g, this._cg); } catch (err) { /* niente scena */ } }
    return pr.apply(this, a);
  };
})();

// ---------------------------------------------------------------- U accelera (solo nel browser)
(function cgTasti() {
  if (typeof window === 'undefined') return;
  window.addEventListener('keydown', (e) => {
    const g = window.nightRun && window.nightRun.game, G = g && g.ap && g.ap.gomma;
    if (!G || e.repeat || (e.key !== 'u' && e.key !== 'U')) return;
    e.preventDefault(); e.stopImmediatePropagation(); G.fast = G.fast > 1 ? 1 : CG.fast;
    if (g.say) g.say(G.fast > 1 ? 'Cambio gomma accelerato ×' + CG.fast : 'Cambio gomma a velocità normale', 'info');
  }, true);
})();
