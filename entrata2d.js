// ============================================================================
//  Night Run · L'entrata nei locali, nel 2D (dopo street2d.js)
//  Ogni locale ha il suo posto auto accanto alla porta (`GAME_POSTI` in game.js, con le strisce per terra; al
//  benzinaio è la pompa). L'auto si ferma qualche metro prima e da lì entra nel posto come una manovra vera: avanti o
//  in retro, attraversando le corsie se serve, con le ruote che girano. Poi il protagonista scende, va a piedi fino
//  alla porta ed entra; lo schermo si scurisce e si apre l'interno. Uscendo il contrario: esce dalla porta, torna
//  all'auto, sale, e l'auto scende dal posto in avanti fino alla corsia di destra. U durante la camminata la salta.
//  Tempi in `GAME_ENT`, posti e porte in `GAME_POSTI` (game.js); i tempi di ogni entrata in `inside.dur`/`durOut`.
//  L'inquadratura resta sulla facciata per tutta la manovra (`camHold`, solo durante la manovra). Il protagonista è
//  quello dell'editor (`pgStanding` di personaggio.js); mentre è a piedi il posto di guida resta vuoto.
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined') return;
  const P = Street2D.prototype;
  const cl = (x) => Math.max(0, Math.min(1, x));
  const ez = (t) => { t = cl(t); return t * t * (3 - 2 * t); };
  const E = () => (typeof GAME_ENT !== 'undefined' ? GAME_ENT : { drive: 1.9, getOut: 0.5, walkV: 1.5, door: 0.35, dark: 0.45, getIn: 0.4, back: 1.5 });
  const Z3 = () => (typeof GAME_LANE_Z !== 'undefined' ? GAME_LANE_Z[3] : 0);
  const LIFT = (IN) => (IN.id === 'fuel' ? 10 : 14);       // pixel tra la corsia di destra e il posto auto
  const GY = 216;                                          // dove poggiano le facciate (locali2d.js): lì c'è la porta

  // i momenti dell'entrata e dell'uscita (secondi dall'inizio della fase)
  const tl = (IN) => {
    const e = E(), w = IN.walk || 0;
    if (IN.phase === 'in') { const a = IN.drive || e.drive, b = a + e.getOut, c = b + w, d = c + e.door; return { a, b, c, d, end: IN.dur || d + e.dark }; }
    const b = 0.35, c = b + w, d = c + e.getIn; return { a: 0, b, c, d, end: IN.durOut || d + e.back };
  };

  // l'auto: posizione nel mondo (metri), salita verso il posto (pixel), corsia (z)
  P.entWhere = function (IN, dist) {
    const L = LIFT(IN), T = tl(IN), e = E();
    if (IN.phase === 'in') {
      const x0 = IN.x + (IN.from ?? dist - IN.x), x1 = IN.x + (IN.park ?? 0);
      const u = ez(IN.t / (IN.drive || e.drive)), z3 = Z3();
      // da un'altra corsia: prima attraversa le corsie fino a quella di destra, poi sale nel posto
      const z0 = IN.z0 ?? z3, far = cl(Math.abs(z0 - z3) / 7), l0 = 0.12 + 0.3 * far;
      return { x: x0 + (x1 - x0) * u, lift: L * ez((u - l0) / (1 - l0)), z: z0 + (z3 - z0) * ez(u / (0.25 + 0.4 * far)) };
    }
    if (IN.phase === 'out') {
      const x0 = IN.outFrom ?? IN.x, x1 = IN.outTo ?? dist;
      const u = ez((IN.t - T.d) / (T.end - T.d));
      return { x: x0 + (x1 - x0) * u, lift: L * (1 - ez(u / 0.8)) };     // scende presto e si raddrizza in corsia
    }
    return { x: IN.x + (IN.park ?? 0), lift: L };
  };

  // il protagonista a piedi: posizione (metri), avanzamento verso la porta (0 accanto all'auto, 1 alla porta), trasparenza
  P.entMan = function (IN) {
    if (!IN || !IN.dur || (IN.phase !== 'in' && IN.phase !== 'out')) return null;
    const T = tl(IN), t = IN.t, car = IN.x + (IN.park ?? 0) + 0.3, door = IN.x + (IN.door ?? IN.park ?? 0), w = IN.walk || 0;
    const at = (f) => car + (door - car) * f;
    if (IN.phase === 'in') {
      if (t < T.a || t >= T.d) return null;
      if (t < T.b) return { x: car, f: 0, a: cl((t - T.a) / (T.b - T.a) * 1.6), walk: false, dir: Math.sign(door - car) || 1 };   // scende
      if (t < T.c) { const f = w > 0 ? (t - T.b) / w : 1; return { x: at(f), f, a: 1, walk: true, dir: Math.sign(door - car) || 1, ph: Math.abs(door - car) * f / 1.1 }; }
      return { x: door, f: 1, a: 1 - cl((t - T.c) / (T.d - T.c)), walk: false, dir: 1, inDoor: cl((t - T.c) / (T.d - T.c)) };       // entra
    }
    if (t >= T.d) return null;
    if (t < T.b) return { x: door, f: 1, a: cl(t / T.b), walk: false, dir: Math.sign(car - door) || -1 };                              // esce dalla porta
    if (t < T.c) { const f = 1 - (w > 0 ? (t - T.b) / w : 1); return { x: at(f), f, a: 1, walk: true, dir: Math.sign(car - door) || -1, ph: Math.abs(door - car) * (1 - f) / 1.1 }; }
    return { x: car, f: 0, a: 1 - cl((t - T.c) / (T.d - T.c) * 1.4), walk: false, dir: 1 };                                           // sale
  };

  // chiamata da street2d.js mentre disegna l'auto: spostamento sullo schermo, salita e trasparenza
  P.entPose = function (IN, wx, carX, dist) {
    const w = this.entWhere(IN, dist);
    // dove disegnare l'omino (lo disegna `present`, sopra all'auto): i piedi davanti all'auto, poi alla base della facciata
    const m = this.entMan(IN);
    if (m) {
      const y0 = this.laneY(this.st.lz) - w.lift;
      this._entMan = Object.assign(m, { sx: wx(m.x), sy: y0 + 3 + (GY + 1 - (y0 + 3)) * m.f });
    } else this._entMan = null;
    return { dx: Math.round(wx(w.x) - carX), lift: Math.round(w.lift), a: 1 };
  };

  // il posto di guida resta vuoto mentre il protagonista è a piedi
  const dd = P.drawDriver;
  if (dd) P.drawDriver = function (...a) { if (this._entOut) return; return dd.apply(this, a); };

  // le strisce del posto auto davanti a ogni locale (sopra la facciata, sotto l'auto)
  P.entStall = function (g, e, x) {
    const Pp = typeof GAME_POSTI !== 'undefined' && GAME_POSTI[e.id];
    if (!Pp || e.id === 'fuel' || !this.laneY) return;
    const yb = 231, yt = 214, n = 1 - (this.day || 0) * 0.4;                    // sul marciapiede lontano (y 216-232), sotto le ruote
    g.fillStyle = `rgba(226,228,236,${0.5 * n})`;
    for (const s of [-1, 1]) { const x0 = Math.round(x + ((Pp.park ?? 0) + s * 2.55) * 30); for (let yy = yt; yy <= yb; yy++) g.fillRect(x0 + Math.round((yb - yy) * 0.6), yy, 2, 1); }
    const xl = Math.round(x + ((Pp.park ?? 0) - 2.55) * 30) + 10, xr = Math.round(x + ((Pp.park ?? 0) + 2.55) * 30) + 10;
    g.fillRect(xl, yt, xr - xl, 1);                                               // riga di fondo
    if (this.text) this.text(g, 'P', Math.round(x + (Pp.park ?? 0) * 30) + 2, yb - 9, `rgba(226,228,236,${0.4 * n})`);
  };

  const up = P.update;
  P.update = function (dt, s, game) {
    // le strisce: aggancio a `drawTripPlace` al primo disegno, quando gli altri file l'hanno già avvolto (così è l'ultimo)
    if (!P._entStallOn && P.drawTripPlace) {
      P._entStallOn = true; const o = P.drawTripPlace;
      P.drawTripPlace = function (g, e, x, ...r) { const res = o.call(this, g, e, x, ...r); try { this.entStall(g, e, x); } catch (err) { /* niente strisce */ } return res; };
    }
    const IN = game && game.inside, man = IN && (IN.phase === 'in' || IN.phase === 'out');
    let hold = false;
    this._entMan = null;
    if (man) {
      const dist = game.s.dist, w = this.entWhere(IN, dist), st = this.st, T = tl(IN);
      // ruote che girano con la manovra (l'auto per la fisica è ferma)
      if (this._entX !== undefined && this._entIN === IN) st.spin = (st.spin || 0) + (w.x - this._entX) / 0.31;
      this._entX = w.x; this._entIN = IN;
      if (w.z !== undefined) { st.lz = w.z; st.lzV = 0; }                  // la corsia la tiene la manovra, non la molla del cambio corsia
      this._entOut = !!IN.dur && (IN.phase === 'in' ? IN.t >= T.a + 0.15 : IN.t < T.d - 0.1);
      // inquadratura sulla facciata, come quando sei fermo davanti (stessa regola di street2d.js)
      if (!this.camHold) {
        const prev = st.cam, W = this.LW;
        this.camHold = (cam, d) => { const tg = Math.max(0.3, Math.min(0.5, 0.64 - (IN.x - d) * 30 / W)); return (prev ?? cam) + (tg - (prev ?? cam)) * Math.min(1, dt * 1.6); };
        hold = true;
      }
      const dk = E().dark;
      this._entDark = IN.phase === 'in' ? cl((IN.t - (T.end - dk)) / dk) : 1 - cl(IN.t / 0.35);
    } else {
      this._entDark = IN && IN.phase === 'shop' ? 1 - cl(IN.t / 0.3) : 0;   // dentro: il buio si apre sull'interno
      this._entX = undefined; this._entOut = false;
    }
    try { return up.call(this, dt, s, game); } finally { if (hold) this.camHold = null; }
  };

  // l'omino (sopra a tutto il disegno della strada) e il buio di passaggio tra la strada e l'interno
  const pr = P.present;
  P.present = function (...a) {
    const m = this._entMan, g = this.g;
    if (m && g && typeof pgStanding === 'function' && m.a > 0.01) {
      const look = window.NightPG ? NightPG.now() : null, sc = 0.47 * (1 - 0.15 * (m.inDoor || 0));
      g.save(); g.globalAlpha = m.a;
      if (m.dir < 0) { g.translate(Math.round(m.sx) * 2, 0); g.scale(-1, 1); }            // cammina verso sinistra: specchiato
      pgStanding(g, Math.round(m.sx), Math.round(m.sy), sc, m.ph || 0, !!m.walk, look, 0.12, performance.now() / 1000);
      g.restore();
    }
    const r = pr.apply(this, a);
    const k = this._entDark || 0;
    if (k > 0.001 && this.visible && this.ctx) { const c = this.ctx; c.save(); c.globalAlpha = Math.min(1, k); c.fillStyle = '#04060b'; c.fillRect(0, 0, this.canvas.width, this.canvas.height); c.restore(); }
    return r;
  };
})();
