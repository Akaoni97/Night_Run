// ============================================================================
//  Night Run · L'entrata nei locali, nel 2D (dopo street2d.js)
//  Prima l'auto si fermava sulla porta e poi scivolava di lato, dritta verso l'alto, dentro il locale: sembrava un
//  teletrasporto. Adesso si ferma qualche metro prima (game.js, `enterPlace`) e da lì svolta nel piazzale come una
//  manovra vera: parte piano, va avanti (o in retro, se la porta l'hai appena passata) salendo verso la facciata,
//  con le ruote che girano, e si ferma davanti; poi lo schermo si scurisce e si apre l'interno. Uscendo il contrario:
//  dal buio l'auto scende dal piazzale in avanti e rientra nella corsia di destra.
//  Dove parcheggia lo decide game.js (`inside.from`, `inside.park`, `inside.outFrom`, `inside.outTo`), i tempi sono
//  GAME_ENT_IN e GAME_ENT_OUT. L'inquadratura resta sulla facciata per tutta la manovra (con `camHold`, solo durante
//  la manovra: il resto della telecamera non cambia).
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined') return;
  const P = Street2D.prototype;
  const cl = (x) => Math.max(0, Math.min(1, x));
  const ez = (t) => { t = cl(t); return t * t * (3 - 2 * t); };
  const T_IN = () => (typeof GAME_ENT_IN !== 'undefined' ? GAME_ENT_IN : 2.4);
  const T_OUT = () => (typeof GAME_ENT_OUT !== 'undefined' ? GAME_ENT_OUT : 1.8);
  const DARK = 0.45;                    // secondi di buio alla fine dell'entrata e all'inizio dell'uscita

  // posizione dell'auto nel mondo (metri) e quanto è salita verso la facciata (pixel), in questo momento della manovra
  P.entWhere = function (IN, dist) {
    const L = IN.id === 'fuel' ? 12 : 28;                  // al benzinaio la pompa è sul bordo del piazzale
    if (IN.phase === 'in') {
      const x0 = IN.x + (IN.from ?? dist - IN.x), x1 = IN.x + (IN.park ?? 0);
      const u = ez(IN.t / (T_IN() - DARK)), z3 = typeof GAME_LANE_Z !== 'undefined' ? GAME_LANE_Z[3] : 0;
      // da un'altra corsia: prima attraversa le corsie fino a quella di destra, poi sale nel piazzale
      const z0 = IN.z0 ?? z3, far = cl(Math.abs(z0 - z3) / 7), l0 = 0.12 + 0.3 * far;
      return { x: x0 + (x1 - x0) * u, lift: L * ez((u - l0) / (1 - l0)), z: z0 + (z3 - z0) * ez(u / (0.25 + 0.4 * far)) };
    }
    if (IN.phase === 'out') {
      const x0 = IN.outFrom ?? IN.x, x1 = IN.outTo ?? dist;
      const u = ez((IN.t - 0.15) / (T_OUT() - 0.15));
      return { x: x0 + (x1 - x0) * u, lift: L * (1 - ez(u / 0.8)) };     // scende presto e si raddrizza in corsia
    }
    return { x: IN.x + (IN.park ?? 0), lift: L };
  };

  // chiamata da street2d.js mentre disegna l'auto: spostamento sullo schermo, salita e trasparenza
  P.entPose = function (IN, wx, carX, dist) {
    const w = this.entWhere(IN, dist);
    return { dx: Math.round(wx(w.x) - carX), lift: Math.round(w.lift), a: 1 };
  };

  const up = P.update;
  P.update = function (dt, s, game) {
    const IN = game && game.inside, man = IN && (IN.phase === 'in' || IN.phase === 'out');
    let hold = false;
    if (man) {
      const dist = game.s.dist, w = this.entWhere(IN, dist), st = this.st;
      // ruote che girano con la manovra (l'auto per la fisica è ferma)
      if (this._entX !== undefined && this._entIN === IN) st.spin = (st.spin || 0) + (w.x - this._entX) / 0.31;
      this._entX = w.x; this._entIN = IN;
      if (w.z !== undefined) { st.lz = w.z; st.lzV = 0; }                  // la corsia la tiene la manovra, non la molla del cambio corsia
      // inquadratura sulla facciata, come quando sei fermo davanti (stessa regola di street2d.js)
      if (!this.camHold) {
        const prev = st.cam, W = this.LW;
        this.camHold = (cam, d) => { const tg = Math.max(0.3, Math.min(0.5, 0.64 - (IN.x - d) * 30 / W)); return (prev ?? cam) + (tg - (prev ?? cam)) * Math.min(1, dt * 1.6); };
        hold = true;
      }
      this._entDark = IN.phase === 'in' ? cl((IN.t - (T_IN() - DARK)) / DARK) : 1 - cl(IN.t / 0.35);
    } else { this._entDark = IN && IN.phase === 'shop' ? 1 - cl(IN.t / 0.3) : 0; this._entX = undefined; }   // dentro: il buio si apre sull'interno
    try { return up.call(this, dt, s, game); } finally { if (hold) this.camHold = null; }
  };

  // il buio di passaggio tra la strada e l'interno, sopra a tutto il disegno
  const pr = P.present;
  P.present = function (...a) {
    const r = pr.apply(this, a);
    const k = this._entDark || 0;
    if (k > 0.001 && this.visible && this.ctx) { const c = this.ctx; c.save(); c.globalAlpha = Math.min(1, k); c.fillStyle = '#04060b'; c.fillRect(0, 0, this.canvas.width, this.canvas.height); c.restore(); }
    return r;
  };
})();
