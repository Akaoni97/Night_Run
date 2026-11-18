// ============================================================================
//  EngineDSP · sintesi fisica del suono di motori a 4, 5 e 6 cilindri in linea (nato sul 2JZ-GTE)
//  Gira dentro un AudioWorklet (o in uno ScriptProcessor come ripiego).
//  Nessun campione registrato: ogni scoppio è calcolato sull'angolo di manovella.
// ============================================================================
class BQ {
  constructor() { this.b0 = 1; this.b1 = 0; this.b2 = 0; this.a1 = 0; this.a2 = 0; this.z1 = 0; this.z2 = 0; }
  set(t, f, q, sr, db) {
    f = Math.max(10, Math.min(f, sr * 0.45));
    const w = 2 * Math.PI * f / sr, c = Math.cos(w), s = Math.sin(w), al = s / (2 * q), A = Math.pow(10, (db || 0) / 40);
    let b0, b1, b2, a0, a1, a2;
    if (t === 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; }
    else if (t === 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; }
    else if (t === 'bp') { b0 = al; b1 = 0; b2 = -al; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; }
    else { b0 = 1 + al * A; b1 = -2 * c; b2 = 1 - al * A; a0 = 1 + al / A; a1 = -2 * c; a2 = 1 - al / A; }
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0; this.a1 = a1 / a0; this.a2 = a2 / a0;
    return this;
  }
  p(x) {
    const y = this.b0 * x + this.z1;
    this.z1 = this.b1 * x - this.a1 * y + this.z2;
    this.z2 = this.b2 * x - this.a2 * y;
    return y;
  }
}

class EngineDSP {
  constructor(sr) {
    this.sr = sr;
    this.seed = 0x2f6b1a3d;
    this.th = 0;          // angolo di manovella in gradi, 0..720
    this.k = 0;
    // parametri in arrivo dalla simulazione (target) e copie smussate
    this.T = { rpm: 0, charge: 0, air: 0, thr: 0, boost: 0, turbo: 0, cut: 0, ovr: 9, running: 0, starter: 0,
      speed: 0, spin: 0, drive: 0, gearRpm: 0, rev: 0, wg: 0, sec: 0, pump: 0, rattle: 0, win: 0, winMot: 0 };
    this.S = Object.assign({}, this.T);
    this.cfg = { tune: EngineDSP.stock(), pops: 0, view: 0, vol: 0.8, fx: { bov: 0, pop: 0, turbo: 0 } };
    this.rpmI = 0; this.rpmStep = 0; this.fluM = 0;      // giri interpolati campione per campione
    this.flu = 0;                          // fluttuazione istantanea della velocità d'albero
    this.mix = null; this.mixT = null;

    // cilindri: ordine di scoppio 1-5-3-6-2-4, uno ogni 120° di manovella
    const order = [0, 4, 2, 5, 1, 3];
    this.cyl = [];
    for (let i = 0; i < 6; i++) {
      this.cyl.push({ off: 0, prevA: 719.9, amp: 0, tp: 26, nz: 0.1, disp: 0, ain: 0,
        bias: 1 + this.r() * 0.05, buf: new Float32Array(2048), wi: 0, D: 30, lp: 0, rf: -0.3 });
    }
    order.forEach((c, k) => { this.cyl[c].off = k * 120; });
    this.nCyl = 6;

    // tubo principale (guida d'onda a quarto d'onda)
    this.pipe = new Float32Array(16384); this.pw = 0; this.pD = 400; this.pLp = 0; this.pR = -0.5;
    this.tb = 0; this.tbA = 0.2; this.catS = 0; this.catA = 1; this.catG = 1; this.rasp = 0;
    this.tips = new Float32Array(256); this.tw = 0; this.tipD = 0; this.tipBP = new BQ();
    this.scrBP = new BQ().set('bp', 950, 0.9, sr); this.scrHP = new BQ().set('hp', 300, 0.7, sr);
    this.rattle = 0; this.ratBP = new BQ().set('bp', 3300, 3, sr); this.ratBP2 = new BQ().set('bp', 5400, 4, sr);
    this.chirpPh = 0;
    this.muf = [new BQ(), new BQ(), new BQ(), new BQ()]; this.mufG = 1;
    this.jetBP = new BQ(); this.jetG = 0.2;
    this.radPrev = 0; this.dc1x = 0; this.dc1y = 0;
    this.viewLP = new BQ(); this.viewLP2 = new BQ(); this.barkPK = new BQ().set('peak', 1100, 0.9, sr, 0); this.opHP = new BQ().set('hp', 650, 0.7, sr); this.opHP2 = new BQ().set('hp', 650, 0.7, sr); this.opLP = new BQ().set('lp', 6000, 0.6, sr); this.open = 0; this.openG = 1;
    this.boomBP = new BQ().set('bp', 78, 1.6, sr);
    // Modifica Codex (adattata da Claude): carattere «deciso» opzionale, solo sulla sintesi dello scarico.
    // Con «Originale» (di serie) questo percorso resta escluso e il suono è identico a prima.
    this.codexBody = new BQ().set('peak', 180, 0.8, sr, 2.5);
    this.codexEdge = new BQ().set('peak', 1150, 0.85, sr, 3.5);
    this.codexLoad = 0;
    this.howlBP = new BQ(); this.howlBP2 = new BQ(); this.metBP = new BQ(); this.metBP2 = new BQ(); this.metK = 0; this.howlK = 0;
    this.crackHP = new BQ().set('hp', 700, 0.7, sr);
    this.turbHP = new BQ().set('hp', 2500, 0.7, sr);

    // aspirazione
    this.inHP = new BQ().set('hp', 55, 0.7, sr);
    this.inPK = new BQ().set('peak', 290, 1.4, sr, 7);
    this.inLP = new BQ().set('lp', 1100, 0.7, sr);
    this.roarBP = new BQ().set('bp', 1350, 0.9, sr);
    this.whooshBP = new BQ().set('bp', 2600, 0.8, sr);

    // turbo
    this.tph = 0; this.tph2 = 0; this.lfo = 0;
    // turbo naturale: banda d'aria risonante alla frequenza della girante, deriva lenta di intonazione e volume
    this.wBP = new BQ().set('bp', 4000, 18, sr); this.wBP2 = new BQ().set('bp', 6000, 12, sr); this.wLP = new BQ().set('lp', 6500, 0.6, sr);
    this.wDrift = 0; this.wAmp = 0; this.wN = 0;
    // valvola: strati con filtri propri, scatto d'apertura, tremolio dell'aria
    this.bovAir = new BQ().set('hp', 3200, 0.6, sr); this.bovLow = new BQ().set('bp', 650, 1.1, sr); this.bovWob = 0; this.bovClick = new BQ().set('hp', 1800, 0.7, sr);
    this.flAmp = 1; this.fxB = 1; this.fxT = 1; this.fxS = 1; this.flOn = 0; this.flPulse = 0; this.sgPh = 0; this.sgPh2 = 0; this.sgN = 0;
    this.sgBP = new BQ().set('bp', 5000, 30, sr); this.sgHP = new BQ().set('hp', 900, 0.7, sr);
    this.bov = { env: 0, t: 1, I: 0, len: 0.3, rate: 20 };
    this.bovBP = new BQ(); this.bovHP = new BQ().set('hp', 500, 0.7, sr);
    this.flBP = new BQ().set('bp', 520, 1.2, sr); this.flPh = 0;

    // meccanica
    this.tickEnv = 0; this.tickHP = new BQ().set('hp', 4200, 0.8, sr); this.tickDec = Math.exp(-1 / (sr * 0.0007)); this.lastTick = 0;
    this.knock = 0; this.knockBP = new BQ().set('bp', 1900, 1.1, sr); this.knockDec = Math.exp(-1 / (sr * 0.0035));
    this.beltPh = 0;

    // scoppiettii (afterfire)
    // ogni scoppio è una voce sua (nota del colpo, durata, schiocco, colore del rumore, colpo sordo): fino a 6 insieme
    this.pops = []; this.popV = []; this.popEnv = 0; this.popB = { f: 1, crack: 1, len: 1, thump: 1, vary: 1, boom: 0, bf: 1, mid: 1 };
    this.bV = []; for (let q = 0; q < 5; q++) this.bV.push({ e: 0, dec: 0, ph: 0, f: 80, ft: 50, fd: 0, n: 0, lc: 0.1, ne: 0, nd: 0 });   // voci del borbottio (gorgoglio al rilascio)
    this.burG = 0.75;
    this.burLPc = new BQ().set('lp', 1700, 0.7, sr); this.burLPo = new BQ().set('lp', 4200, 0.7, sr); this.burHP = new BQ().set('hp', 40, 0.7, sr);
    for (let q = 0; q < 6; q++) this.popV.push({ e: 0, dec: 0, f: 68, tf: 88, ph: 0, th: 0, n: 0, nc: 1, nk: 1, br: 1, tk: 1, bE: 0, bA: 0, bDec: 0, bF: 50, bT: 50, bPh: 0, bN1: 0, bN2: 0, bLc: 0.05 });

    // motorino d'avviamento, pompa benzina
    this.stPh = 0; this.stLP = new BQ().set('lp', 900, 0.7, sr); this.pumpPh = 0; this.pumpLP = new BQ().set('lp', 600, 0.7, sr);

    // strada, vento, gomme, trasmissione
    this.brown = 0; this.roadLP = new BQ().set('lp', 320, 0.7, sr);
    this.windBP = new BQ().set('bp', 850, 0.55, sr);
    // finestrino aperto: rombo basso dell'aria che entra, battito ("buffeting") a finestrino socchiuso, motorino elettrico
    this.windLP = new BQ().set('lp', 220, 0.7, sr); this.buffPh = 0; this.motPh = 0; this.motBP = new BQ().set('bp', 900, 1.2, sr); this.winS = 0; this.motS = 0;
    this.sq1 = new BQ().set('bp', 1040, 14, sr); this.sq2 = new BQ().set('bp', 1460, 12, sr); this.sqPh = 0;
    this.gPh = 0;
    this.grind = 0; this.grBP = new BQ().set('bp', 1700, 1.5, sr); this.grPh = 0;
    this.clunk = 0; this.clPh = 0; this.click = 0;

    // riverbero (Schroeder/Freeverb ridotto)
    const sc = sr / 44100;
    // lunghezze base dei pettini; i buffer sono lunghi abbastanza per la galleria (2,6 volte), la parte usata cambia con l'ambiente
    this.rvL = [1116, 1188, 1277, 1356, 1139, 1211, 1300, 1379].map((l) => l * sc);
    this.rv = this.rvL.map((l) => ({ b: new Float32Array(Math.round(l * 2.6) + 2), i: 0, f: 0, n: Math.round(l * 0.55) }));
    // prime riflessioni: una linea di ritardo da 70 ms letta in punti diversi a sinistra e a destra
    this.erN = Math.round(sr * 0.07); this.erB = new Float32Array(this.erN); this.erI = 0;
    this.rvFb = 0.78; this.rvDamp = 0.3; this.rvWet = 0.035; this.erG = 0; this.beltPh = 0; this.env = -1;
    this.ap = [556, 441, 579, 464].map((l) => ({ b: new Float32Array(Math.round(l * sc)), i: 0 }));

    this.dcL = 0; this.dcLy = 0;
    this.configure(this.cfg);
    this.mix = Object.assign({}, this.mixT);
    this.setEnv(0);
    this.aRpm = 1 - Math.exp(-32 / (sr * 0.018));
    this.aFast = 1 - Math.exp(-32 / (sr * 0.03));
    this.aSlow = 1 - Math.exp(-32 / (sr * 0.12));
  }

  // parti di serie (stesso contenuto di tuningParams(stock).dsp)
  static stock() {
    return {
      ex: { L: 4.4, r: -0.42, m: [['lp', 360, 0.6], ['lp', 1000, 0.5], ['peak', 105, 1.0, 6], ['peak', 420, 2, -5]], g: 1.7, jet: 0.12, rasp: 0, tips: 1 },
      cat: { lp: 2600, g: 0.85, pop: 1 },
      tb: { f0: 2500, f1: 8700, w: 0.035, wh: 0.05, damp: 1700, twin: 1, mani: 0 },
      bov: { v: 0, f0: 1800, sw: 600, q: 0.7, g: 0.12, chirp: 0 },
      scream: 0, intake: { in: 1, roar: 1, wh: 1 }, lope: 0, rattle: 0, spark: 0,
    };
  }

  // rumore bianco [-1,1)
  r() {
    let s = this.seed;
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    this.seed = s;
    return (s | 0) / 2147483648;
  }
  g() { return (this.r() + this.r() + this.r()) * 0.577; }

  msg(m) {
    if (m.p) Object.assign(this.T, m.p);
    if (m.cfg) this.configure(Object.assign(this.cfg, m.cfg));
    if (m.env !== undefined || m.cfg) this.setEnv(m.env !== undefined ? m.env : this.env);
    const fx = this.cfg.fx || {}; this.fxB = fx.bov ? 0 : 1; this.fxT = fx.turbo ? 0.25 : 1; this.fxS = fx.turbo ? 0 : 1;
    if (m.ev) for (const e of m.ev) this.event(e);
  }

  configure(c) {
    const sr = this.sr, t = c.tune || EngineDSP.stock();
    this.tn = t;
    // collettori: ghisa originale 3+3 (biturbo) oppure tubolare 6-1 a lunghezze quasi uguali (single)
    const twin = t.tb.mani === 0;
    // quattro cilindri (Volvo B4204S): ordine 1-3-4-2, uno scoppio ogni 180°; sei cilindri: 1-5-3-6-2-4 ogni 120°
    // cinque cilindri (Volvo 850 R, modifica Codex): 1-2-4-5-3, uno scoppio ogni 144°
    if ((t.cyl || 6) === 4) { this.nCyl = 4; [0, 2, 3, 1].forEach((c, k) => { this.cyl[c].off = k * 180; }); }
    else if (t.cyl === 5) { this.nCyl = 5; [0, 1, 3, 4, 2].forEach((c, k) => { this.cyl[c].off = k * 144; }); }
    else { this.nCyl = 6; [0, 4, 2, 5, 1, 3].forEach((c, k) => { this.cyl[c].off = k * 120; }); }
    // carattere del singolo motore (auto da disegno): collettori, durata degli impulsi, farfalle singole, urlo metallico
    const v = t.voice || {};
    // scoppi dello scarico: nota (f, moltiplica i 68 Hz del colpo), schiocco (crack), durata (len), colpo sordo (thump),
    // quanto cambiano da uno all'altro (vary). Di serie tutto a 1: Supra e V40 hanno la stessa media di prima
    // boom: boato basso che scende di nota e non passa dal silenziatore (0 = niente, Supra e V40 di serie); bf: sua altezza;
    // mid: quanto dello scoppio passa dal tubo e dal silenziatore (la parte che suona da petardo)
    this.popB = Object.assign({ f: 1, crack: 1, len: 1, thump: 1, vary: 1, boom: 0, bf: 1, mid: 1 }, v.pop || {});
    this.vc = { diesel: v.diesel || 0, pulse: v.pulse || 1, rough: v.rough || 0, howl: v.howl || 0, metal: v.metal || 0, boomRpm: v.boomRpm || 3300, hiRpm: v.hiRpm || 6800 };
    const L = v.mani || (this.nCyl === 5 ? [0.56, 0.50, 0.46, 0.50, 0.56] : this.nCyl === 4 ? [0.62, 0.58, 0.58, 0.62, 0.6, 0.6] : twin ? [0.44, 0.35, 0.30, 0.32, 0.37, 0.47] : [0.88, 0.86, 0.84, 0.84, 0.86, 0.88]);
    const split = v.split != null ? v.split : twin ? 0.22 : 0;
    this.cyl.forEach((cy, i) => {
      cy.D = Math.max(2, Math.round(((L[i] != null ? L[i] : 0.6) + (i >= 3 ? split : 0)) / 610 * sr));
      cy.rf = v.rf != null ? v.rf : twin ? -0.28 : -0.38;
      cy.vb = v.bias ? v.bias[i] || 1 : 1;                          // cilindri un po' diversi tra loro (motori vecchi)
    });
    this.howlBP.set('bp', v.howlF || 800, 3.2, sr); this.howlBP2.set('bp', (v.howlF || 800) * 2.02, 5, sr);
    this.metBP.set('bp', v.metalF || 3000, 1.6, sr); this.metBP2.set('bp', (v.metalF || 3000) * 1.62, 2.4, sr);
    this.tbA = 1 - Math.exp(-2 * Math.PI * t.tb.damp / sr);
    // catalizzatore
    this.catA = t.cat.lp > 0 ? 1 - Math.exp(-2 * Math.PI * t.cat.lp / sr) : 1;
    this.catG = t.cat.g;
    // tubo e silenziatore
    const ex = t.ex;
    this.pD = Math.min(8000, Math.round(ex.L / 495 * sr));
    this.pR = ex.r;
    ex.m.forEach((m, i) => this.muf[i].set(m[0], m[1], m[2], sr, m[3]));
    this.mufG = ex.g; this.jetG = ex.jet; this.rasp = ex.rasp;
    this.jetBP.set('bp', 3200, 0.6, sr);
    // doppia uscita: il secondo terminale arriva 0,4 ms dopo e con un timbro leggermente diverso
    this.tipD = ex.tips > 1 ? Math.round(0.00042 * sr) : 0;
    this.tipBP.set('peak', 1250, 1.2, sr, 3);
    // valvola: 0 ricircolo OEM, 1 blow-off, 2 nessuna (flutter)
    // punto d'ascolto: 0 abitacolo, 1 esterno posteriore, 2 vano motore
    // g: livello d'insieme (da fuori uno scarico si sente più forte che da dentro) · er: quanto arrivano le riflessioni
    // dell'ambiente (in abitacolo poco, filtrate dai vetri) · belt: cinghia e alternatore (si sentono solo col cofano aperto)
    const V = [
      { exh: 0.62, lp: 1300, boom: 0.9, intake: 0.5, mech: 0.12, turbo: 0.3, bov: 0.45, road: 0.3, wind: 0.9, tire: 0.55, gear: 1.0, starter: 0.55, pump: 1.0, rev: 0.14, width: 0.15, g: 0.82, er: 0.12, belt: 0.04 },
      { exh: 1.0, lp: 14000, boom: 0.0, intake: 0.16, mech: 0.07, turbo: 0.32, bov: 0.6, road: 0.35, wind: 0.12, tire: 1.0, gear: 0.15, starter: 0.3, pump: 0.0, rev: 0.11, width: 1.0, g: 1.8, er: 1.0, belt: 0.08 },
      { exh: 0.35, lp: 2600, boom: 0.0, intake: 1.0, mech: 0.8, turbo: 1.0, bov: 1.0, road: 0.15, wind: 0.1, tire: 0.3, gear: 0.45, starter: 1.0, pump: 0.25, rev: 0.08, width: 0.35, g: 1.15, er: 0.45, belt: 1.0 },
    ];
    this.mixT = Object.assign({}, V[c.view]);
    this.mixT.character = c.character === 'codex' ? 1 : 0;   // modifica Codex: passa piano da un profilo all'altro
  }

  // ambiente intorno all'auto: 0 strada aperta (solo l'asfalto riflette), 1 città (i palazzi rimandano lo scarico),
  // 2 galleria (pareti vicine e coda lunga). Le riflessioni arrivano prima a un orecchio e poi all'altro: è questo che apre
  // lo stereo. In abitacolo la coda della galleria passa attraverso i vetri; la stanzetta dell'abitacolo resta corta.
  setEnv(env) {
    env = env === 1 || env === 2 ? env : 0; this.env = env;
    const view = this.cfg.view | 0, sr = this.sr;
    const E = [
      { len: 0.5, fb: 0.55, damp: 0.35, wet: 0.08, L: [[1.3, 0.38]], R: [[1.75, 0.38]] },
      { len: 1.0, fb: 0.7, damp: 0.4, wet: 0.3, L: [[1.3, 0.3], [19, 0.34], [41, 0.22]], R: [[1.75, 0.3], [27, 0.32], [53, 0.2]] },
      { len: 2.4, fb: 0.86, damp: 0.5, wet: 0.75, L: [[1.3, 0.3], [8, 0.46], [23, 0.36], [47, 0.22]], R: [[1.75, 0.3], [11, 0.46], [29, 0.34], [61, 0.2]] },
    ][env];
    const cabin = view === 0 && env < 2;                   // in abitacolo (fuori dalla galleria) conta la stanzetta dell'abitacolo
    const len = cabin ? 0.55 : E.len;
    this.rv.forEach((cb, q) => { cb.n = Math.max(8, Math.min(cb.b.length - 1, Math.round(this.rvL[q] * len))); cb.i %= cb.n; });
    this.rvFbT = cabin ? 0.78 : E.fb; this.rvDamp = E.damp;
    this.rvWetT = (cabin ? 0.035 : 0) + E.wet * [0.22, 1, 0.55][view];
    const tap = (a) => a.map(([ms, g]) => [Math.round(ms * sr / 1000), g]);
    this.erTL = tap(E.L); this.erTR = tap(E.R);
  }

  event(e) {
    const T = this.T;
    if (e.type === 'bov') {
      this.bov.I = Math.min(1.3, e.I || 0.8); this.bov.t = 0; this.bov.env = 0.0001;
      this.bov.len = this.tn.bov.v === 2 ? 0.75 + 0.65 * this.bov.I : 0.16 + 0.38 * this.bov.I;
      this.chirpPh = 0;
      this.bov.rate = 23;
    } else if (e.type === 'grind') this.grind = 1;
    else if (e.type === 'clunk') this.clunk = 1;
    else if (e.type === 'click') this.click = 1;
    else if (e.type === 'crash') this.hit(e.I || 0.6, e.kind || 'front');
    else if (e.type === 'bump') { this.bump = Math.min(1.5, (this.bump || 0) + (e.I || 0.6)); this.bumpPh = 0; if (e.hit) this.hit(Math.min(0.35, (e.I || 0.4) * 0.5), 'bump'); }   // la lamiera solo nei colpetti contro un'auto
    void T;
  }

  // ---- urti: botta sorda, lamiera che si accartoccia, pannelli che vibrano, vetri, pezzi che cadono, strisciata ----
  // I = forza (0..1,5); kind: front (tamponi tu), rear (ti tamponano), side (strisciata di fianco), bump (colpetto)
  hit(I, kind) {
    const sr = this.sr, H = this.H || (this.H = {
      th: 0, cr: 0, crG: 0, crHold: 0, crBP: new BQ(), crBP2: new BQ(), crLP: new BQ(),
      ring: [0, 1, 2, 3, 4].map(() => ({ bq: new BQ(), a: 0, d: 1 })), gT: 0, gA: 0,
      tr: 0, trHP: new BQ().set('hp', 1200, 0.7, sr), boom: new BQ(), thLP: new BQ(), thLPf: 900, gs: 0, gsBP: new BQ(), gl: 0, glBP: new BQ(), glHP: new BQ().set('hp', 3800, 0.7, sr),
      db: 0, dbBP: new BQ(), sc: 0, scT: 0, scLen: 0, scBP: new BQ(), scSq: new BQ(), scLP: new BQ().set('lp', 140, 0.7, sr), scPh: 0, scJ: 0,
      cab: new BQ(), cabState: -1, ex: 0,
    });
    I = Math.max(0.05, Math.min(1.5, I));
    const u = () => 0.5 + 0.5 * this.r();                                     // 0..1
    // il motore si abbassa per un attimo: la botta copre tutto (e chi guida molla il gas)
    H.duck = Math.max(H.duck || 0, kind === 'bump' ? 0.15 : kind === 'side' ? 0.3 : Math.min(0.65, 0.3 + 0.3 * I));
    if (kind === 'side') {
      // strisciata: lamiera contro lamiera per qualche decimo di secondo, colpo leggero all'inizio
      H.sc = Math.max(H.sc, 0.55 + 0.45 * Math.min(1, I)); H.scT = 0; H.scLen = 0.45 + 0.35 * u();
      H.scBP.set('bp', 1100 + 900 * u(), 1.6, sr); H.scSq.set('bp', 2600 + 1600 * u(), 14, sr);
      H.th = Math.max(H.th, 0.35 * I); H.thLPf = 700; H.boom.set('bp', 80, 2.2, sr); H.tr = Math.max(H.tr, 0.35);
      H.cr = Math.max(H.cr, 0.35 * I); H.crHold = 0.05; H.crBP.set('bp', 2400, 0.9, sr); H.crBP2.set('bp', 4200, 1.4, sr);
      H.db = Math.max(H.db, 0.25 * I); H.dbBP.set('bp', 1500, 4, sr);
    } else {
      const big = kind === 'bump' ? 0 : Math.min(1, I / 1.2);
      // botta: il colpo della massa, una nota che cade in fretta (più bassa e lunga se è forte)
      H.th = Math.max(H.th, kind === 'bump' ? 0.5 * I : 0.55 + 0.6 * I); H.thLPf = kind === 'bump' ? 500 : 1400; H.boom.set('bp', 60 + 35 * u(), 2.2, sr);
      H.tr = Math.max(H.tr, kind === 'bump' ? 0.3 : 0.7 + 0.3 * big);              // lo schiocco del contatto
      // lamiera: scrosci di crepitii filtrati, più lunghi coi colpi forti
      H.cr = Math.max(H.cr, kind === 'bump' ? 0.25 * I : 0.5 + 0.55 * I); H.crHold = kind === 'bump' ? 0.01 : 0.06 + 0.16 * big;
      H.crBP.set('bp', 450 + 400 * u(), 0.7, sr); H.crBP2.set('bp', 1700 + 900 * u(), 1.0, sr); H.crLP.set('lp', 420, 0.7, sr);   // accartocciarsi (medio-basso) e strappo
      // pannelli: cinque modi non armonici, diversi a ogni urto (si eccitano col crepitio: niente note fisse)
      const base = [170, 310, 590, 1080, 2150];
      H.ring.forEach((m, k) => { m.bq.set('bp', base[k] * (0.8 + 0.45 * u()), 7 + 9 * u(), sr); m.a = (1 - k * 0.15) * (kind === 'bump' ? 0.25 : 0.4 + 0.6 * big); m.d = Math.exp(-1 / (sr * (0.04 + 0.16 * u() / (1 + k * 0.5)))); });
      // vetri e plastiche: solo negli urti veri
      if (kind !== 'bump' && I > 0.7) { H.gl = Math.max(H.gl, Math.min(1, (I - 0.55) * 1.4)); H.gs = H.gl; H.glBP.set('bp', 5200 + 2200 * u(), 6, sr); H.gsBP.set('bp', 4500 + 2000 * u(), 0.9, sr); }
      if (kind !== 'bump') { H.db = Math.max(H.db, 0.3 + 0.5 * big); H.dbBP.set('bp', 900 + 900 * u(), 5, sr); }
    }
  }

  // un campione dell'urto (0 quando non c'è niente)
  hitSample(TAU, view) {
    const H = this.H, sr = this.sr; let o = 0, ex = 0;
    if (H.tr > 1e-3) { o += H.trHP.p(this.r()) * H.tr * 2.2; H.tr *= Math.exp(-1 / (sr * 0.004)); }
    if (H.th > 1e-3) {
      // botta: rumore che si scurisce in fretta (filtro che scende) più il rimbombo della scocca, niente note pure
      if ((this.k & 15) === 0) { H.thLPf = 110 + (H.thLPf - 110) * Math.exp(-16 / (sr * 0.05)); H.thLP.set('lp', H.thLPf, 0.9, sr); }
      const nz = this.r();
      o += (H.thLP.p(nz) * 10 + H.boom.p(nz) * 45) * H.th;
      H.th *= Math.exp(-1 / (sr * 0.12));
    }
    if (H.cr > 1e-3) {
      // la lamiera cede a scatti: pezzetti di 1-9 ms di rumore, quasi tutti deboli e pochi forti, più qualche schiocco
      if ((H.gT -= 1) <= 0) { H.gT = Math.round(sr * (0.001 + 0.008 * Math.abs(this.r()))); const q = Math.abs(this.r()); H.gA = q * q * q * 3; }
      const grain = Math.abs(this.r()) < 0.004 ? this.r() * 5 : 0;
      ex = (this.r() * H.gA + grain) * H.cr;
      o += H.crBP.p(ex) * 2.6 + H.crBP2.p(ex) * 0.55;
      if (H.crHold > 0) H.crHold -= 1 / sr; else H.cr *= Math.exp(-1 / (sr * 0.07));
    }
    if (H.ring[0].a > 1e-4) {
      // pannelli che vibrano: modi non armonici che si spengono a tempi diversi, sporcati dagli scatti della lamiera
      const nz = this.r() * 0.35 + ex;
      let r = 0; for (const m of H.ring) { r += m.bq.p(nz) * m.a; m.a *= m.d; }
      o += r * 1.6;
    }
    if (H.gs > 1e-3) { const nz = this.r(); o += (H.gsBP.p(nz) * 1.6 + H.glHP.p(nz) * 0.5) * H.gs * (0.6 + 0.4 * Math.abs(this.r())); H.gs *= Math.exp(-1 / (sr * 0.09)); }
    if (H.gl > 1e-3) {
      // vetri: tintinnii sottili e radi che continuano mentre i pezzi cadono
      const k = Math.abs(this.r()) < 0.0022 * H.gl ? this.r() * 6 : 0;
      o += (H.glBP.p(k) * 1.2 + H.glHP.p(k) * 0.35) * H.gl;
      H.gl *= Math.exp(-1 / (sr * 0.45));
    }
    if (H.db > 1e-3) {
      // plastiche e pezzi che rimbalzano sull'asfalto
      const k = Math.abs(this.r()) < 0.0009 ? this.r() * 5 : 0;
      o += H.dbBP.p(k) * H.db * 1.4;
      H.db *= Math.exp(-1 / (sr * 0.5));
    }
    if (H.sc > 1e-3) {
      // strisciata: attrito a scatti (stick-slip), rumore filtrato che sale e scende, un fischio di lamiera e un rombo basso
      H.scT += 1 / sr; H.scPh += (28 + 18 * Math.min(1, this.S.speed / 30)) / sr; if (H.scPh > 1) { H.scPh -= 1; H.scJ = 0.4 + 0.6 * Math.abs(this.r()); }
      const env = H.scT < 0.02 ? H.scT / 0.02 : H.scT < H.scLen ? 1 : Math.exp(-(H.scT - H.scLen) / 0.12);
      const stick = H.scJ * (0.55 + 0.45 * Math.sin(TAU * H.scPh));
      const nz = this.r();
      o += (H.scBP.p(nz) * 2.4 * stick + H.scSq.p(nz) * 1.6 * (0.4 + 0.6 * stick) + H.scLP.p(nz) * 2.0) * H.sc * env;
      if (env < 1e-3 && H.scT > H.scLen) H.sc = 0;
    }
    // in abitacolo: si sente attraverso la scocca, alti attutiti e botta più piena
    if (view === 0) { if (H.cabState !== 0) { H.cab.set('lp', 2600, 0.7, sr); H.cabState = 0; } return H.cab.p(o) * 1.25; }
    return o;
  }

  addPop(big) {
    if (this.pops.length > 12) return;
    const d = Math.round((0.002 + this.r() * 0.5 * 0.03 + 0.015) * this.sr);
    let a = big ? 1.3 + 0.9 * Math.abs(this.r()) : 0.45 + 0.55 * Math.abs(this.r());
    if (this.cfg.fx && this.cfg.fx.pop) a *= 0.3;
    if (this.bov.env > 0 && this.tn.bov.v === 2) a *= 0.35;   // lascia sentire lo stu-tu-tu
    if (this.T.cut === 1) a *= 0.7;        // scoppi registrati caricati: qui resta solo il crepitio
    // ognuno un po' diverso: nota ±17 %, durata, schiocco, rumore più o meno cupo, colpo sordo; le grosse più lunghe e basse
    const B = this.popB, k = B.vary, rr = () => this.r() * k;
    const f = 68 * B.f * Math.exp(0.16 * rr()) * (big ? 0.92 : 1), len = B.len * Math.max(0.45, 1 + 0.35 * rr()) * (big ? 1.3 : 1);
    // boato: BOOM grosso e lungo, bam medio, pim corto e più alto; le grosse quasi sempre BOOM
    let bk = 0, bfm = 1, blm = 1;
    if (B.boom > 0) {
      const q = Math.abs(this.r());
      if (big || q < 0.3) { bk = 1 + 0.4 * Math.abs(this.r()); bfm = 0.82; blm = 1.5; }
      else if (q < 0.75) { bk = 0.6 + 0.3 * Math.abs(this.r()); bfm = 1; blm = 1; }
      else { bk = 0.3; bfm = 1.55; blm = 0.45; }
      bk *= B.boom; bfm *= B.bf * Math.exp(0.15 * rr());
    }
    const P = { bk, bfm, blm, d: Math.max(1, d), a, f, tf: 88 * B.f * Math.exp(0.09 * rr()), len, br: B.crack * Math.max(0.3, 1 + 0.38 * rr()), nc: Math.max(0.3, 1 - 0.5 * Math.abs(rr())), tk: B.thump * (big ? 1.15 : 0.9 + 0.2 * Math.abs(rr())) };
    this.pops.push(P);
    if (Math.abs(this.r()) < 0.22 * k) this.pops.push(Object.assign({}, P, { d: P.d + Math.round((0.006 + 0.008 * Math.abs(this.r())) * this.sr), a: a * (0.35 + 0.25 * Math.abs(this.r())), f: f * 1.06, len: len * 0.7 }));   // doppio colpo: pa-pam
    else if (!big && Math.abs(this.r()) < 0.12 * k) {     // crepitio: tre-cinque schiocchi piccoli in fila
      let dd = P.d; const n = 3 + Math.floor(Math.abs(this.r()) * 3);
      for (let q = 0; q < n; q++) { dd += Math.round((0.004 + 0.006 * Math.abs(this.r())) * this.sr); this.pops.push(Object.assign({}, P, { d: dd, a: a * (0.14 + 0.12 * Math.abs(this.r())), f: f * (1.2 + 0.3 * Math.abs(this.r())), len: 0.35, br: P.br * 1.4, bk: P.bk * 0.35, bfm: P.bfm * 1.5, blm: 0.4 })); }
    }
  }

  // Borbottio al rilascio: un gorgoglio basso e pieno di colpetti irregolari, raggruppati a raffiche, che resta nello scarico dopo aver mollato il gas.
  // Ha le sue voci (bV) e un suo livello nel mix, che non dipende dal gas (a gas mollato lo scarico normale è quasi muto: i colpi dei pop restavano a -25 dB).
  // lvl: quanto è carico (di serie ~0,55; mappa pop & bang, taglio d'accensione, decat e scarichi aperti lo alzano).
  addBurble(lvl, hi) {
    if (this.pops.length > 12) return;
    const sr = this.sr, r = () => Math.abs(this.r()), B = this.popB;
    const one = (d, a, len, f) => this.pops.push({ vb: 1, d: Math.max(1, d), a, len, f, nz: 0.45 + 0.5 * r() });
    const a0 = (0.55 + 0.45 * r()) * (0.8 + 0.3 * lvl) * (0.6 + 0.4 * hi);
    const f = 82 * B.f * (0.8 + 0.4 * r());
    one(Math.round((0.002 + 0.01 * r()) * sr), a0, B.len * (0.8 + 0.8 * r()), f);
    this.flu += 0.06 + 0.05 * lvl;                                       // piccolo strappo dell'albero: il regime balla un attimo
    if (r() < 0.2 + 0.2 * lvl) {                                          // raffica "brrrap": tre-sei colpetti ravvicinati che calano
      let dd = 0; const n = 3 + Math.floor(r() * 4);
      for (let q = 0; q < n; q++) { dd += Math.round((0.022 + 0.02 * r()) * sr); one(dd, a0 * Math.pow(0.82, q + 1) * (0.7 + 0.5 * r()), 0.6 + 0.4 * r(), f * (1 + 0.1 * q) * (0.9 + 0.2 * r())); }
    }
    if (r() < 0.12 * lvl) this.addPop(false);                            // ogni tanto uno schiocco secco sopra il gorgoglio
  }

  cycle(c) {
    const S = this.S, T = this.T;
    const run = S.running > 0.5;
    const fire = run && T.cut === 0;
    const rn = S.rpm / 7000;
    let comb = 0;
    if (fire) {
      const ch = Math.max(S.charge, 0.04);
      const low = Math.max(0, 1 - S.rpm / 1600), lope = this.tn.lope * Math.max(0, 1 - S.rpm / 2600);
      // variazione da ciclo a ciclo (un motore vero non fa mai due scoppi uguali) più un "respiro" lento comune
      this.breath = (this.breath || 0) * 0.985 + this.g() * 0.01;
      let jitter = (1 + this.g() * (0.045 + 0.3 * low + 0.12 * lope + 0.12 * this.vc.rough)) * (1 + this.breath * (1 + 2 * low));
      // camme lunghe: incrocio delle valvole, qualche ciclo debole e "sporco"
      if (lope > 0 && Math.abs(this.r()) < 0.09 * lope) jitter *= 0.35 + 0.3 * Math.abs(this.r());
      comb = Math.pow(ch, 0.9) * jitter;
      // soft cut: anticipo tolto a caso cilindro per cilindro, il motore ronza e sputacchia contro il limite
      if (T.soft > 0.04 && Math.abs(this.r()) < T.soft * 0.7) { comb *= 0.12 + 0.2 * Math.abs(this.r()); if (Math.abs(this.r()) < T.soft * 0.25) this.addPop(false); }
      // ogni scoppio dà una piccola spinta all'albero: la velocità oscilla dentro il ciclo
      this.flu += (0.03 + 0.05 * lope) * comb * Math.min(1, 1100 / Math.max(S.rpm, 300));
      if (S.rattle > 0.01) this.rattle += S.rattle * (0.6 + 0.4 * Math.abs(this.r()));
      c.tp = (11 + 15 * Math.max(0, 1 - Math.min(ch, 1))) * (1 + this.g() * 0.035) * this.vc.pulse;
      c.j = this.g() * (0.5 + 2.8 * low);                                   // scoppio un po' in anticipo o in ritardo
      c.nz = 0.22 + 0.32 * Math.min(ch, 1.6);
      this.knock += comb * 0.5 * (1 + 4 * this.vc.diesel);   // gasolio: il ticchettio della combustione
    } else {
      c.tp = 28; c.nz = 0.12;
    }
    c.amp = (0.045 + 0.055 * rn) * (0.4 + S.air) + comb * c.bias * (c.vb || 1);
    if (!run) c.amp = S.rpm > 20 ? 0.06 * Math.min(1, S.rpm / 180) : 0;
    c.disp = 0.06 * rn * (0.3 + S.air);
    c.ain = S.air * (0.25 + rn) * (1 - 0.55 * S.turbo);
    // afterfire: carburante incombusto che esplode nello scarico
    if (!fire && run && S.rpm > 1600) {
      let ch = 0, big = false;
      const pm = this.tn.cat.pop, sp = this.tn.spark;
      // rilascio del gas: raffica di scoppiettii subito dopo il rilascio, più fitta ai giri alti;
      // con la mappa pop & bang durano di più e sono più forti
      const hi = Math.min(1, (S.rpm - 1600) / 4000);
      if (T.cut === 1) ch = (this.cfg.pops ? 0.12 * Math.exp(-T.ovr / 2.2) + 0.015 : (0.06 * Math.exp(-T.ovr / 0.8) + 0.003) * (0.4 + 0.6 * hi)) * pm;
      if (T.cut === 1 && Math.abs(this.r()) < ch * 0.2) big = true;
      else if (T.cut === 2) { ch = sp ? (this.cfg.pops ? 0.34 : 0.16) * pm : 0.02; big = true; }
      else if (T.cut === 3) { ch = (this.cfg.pops ? 0.55 : 0.3) * pm; big = true; }
      if (Math.abs(this.r()) < ch) this.addPop(big || Math.abs(this.r()) < 0.15);
    }
    // borbottio al rilascio: dopo aver mollato il gas ad alti giri il motore gorgoglia a raffiche (si spegne in qualche secondo, più lungo con le mappe pop & bang)
    if (!fire && run && T.cut === 1 && S.rpm > 1300) {
      const pm = this.tn.cat.pop, lvl = 0.55 + (this.cfg.pops ? 0.5 : 0) + (this.tn.spark ? 0.2 : 0) + 0.35 * Math.min(1.5, Math.max(0, pm - 1));
      const env = Math.exp(-T.ovr / (0.9 + 1.5 * lvl)), hi = Math.min(1, (S.rpm - 1300) / 3500);
      const cps = Math.max(12, S.rpm / 60 * this.nCyl / 2);                // scoppi al secondo: serve a contare il tempo dentro il ciclo
      const bb = this.bb || (this.bb = { on: false, t: 0 });
      bb.t -= 1 / cps;
      if (bb.t <= 0) { bb.on = !bb.on; bb.t = bb.on ? 0.05 + 0.16 * Math.abs(this.r()) : 0.04 + 0.2 * Math.abs(this.r()) * (1.3 - Math.min(1, lvl * 0.6)); }
      const rate = (7 + 8 * lvl) * env * (0.35 + 0.65 * hi);              // colpetti al secondo a gas mollato, a raffiche, metà del tempo
      if (bb.on && Math.abs(this.r()) < Math.min(0.9, rate / (0.5 * cps))) {
        this.addBurble(lvl, hi);
        if (Math.abs(this.r()) < 0.05 * lvl * env) this.addPop(true);      // ogni tanto un colpo grosso
      }
    } else if (this.bb) this.bb.on = false;
  }

  control() {
    const S = this.S, T = this.T;
    const rTarget = S.rpm + (T.rpm - S.rpm) * this.aRpm;
    this.rpmStep = (rTarget - this.rpmI) / 32;
    S.rpm = rTarget;
    const f = this.aFast, s = this.aSlow;
    S.charge += (T.charge - S.charge) * f;
    S.air += (T.air - S.air) * f;
    S.thr += (T.thr - S.thr) * f;
    S.boost += (T.boost - S.boost) * f;
    S.turbo += (T.turbo - S.turbo) * f;
    S.running += (T.running - S.running) * f;
    S.starter += (T.starter - S.starter) * f;
    S.speed += (T.speed - S.speed) * s;
    S.spin += (T.spin - S.spin) * f;
    S.drive += (T.drive - S.drive) * s;
    S.gearRpm += (T.gearRpm - S.gearRpm) * f;
    S.rev += (T.rev - S.rev) * s;
    S.wg += (T.wg - S.wg) * f;
    S.sec += (T.sec - S.sec) * f;
    S.pump += (T.pump - S.pump) * s;
    S.rattle += (T.rattle - S.rattle) * f;
    const M = this.mix, MT = this.mixT;
    for (const k in MT) M[k] += (MT[k] - M[k]) * s;
    // il suono "si apre": con giri e carico il filtro si spalanca, i medi abbaiano e il volume cresce;
    // scalino quando entra il secondo turbo (biturbo sequenziale) — non una rampa lineare
    const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const ld = Math.min(1, S.charge * 1.2) * Math.min(1, S.thr * 1.6);
    this.codexLoad = ld;
    const vc = this.vc, hi = vc.hiRpm;
    // urlo metallico in alto (sei in linea BMW, collettori in acciaio) e ululato delle farfalle singole
    this.metK = vc.metal * ss(hi - 3200, hi - 200, S.rpm) * (0.25 + 0.75 * ld);
    this.howlK = vc.howl * ss(2500, hi - 500, S.rpm) * (0.2 + 0.8 * Math.min(1, S.thr * 1.4)) * (1 - 0.6 * S.turbo);
    const oT = Math.min(1, ss(2200, hi, S.rpm) * (0.35 + 0.65 * ld) * 0.8 + 0.3 * S.sec * ld + 0.15 * ss(0.15, 0.7, S.boost) * ld);
    this.open += (oT - this.open) * (oT > this.open ? 0.12 : 0.05);
    const o = this.open;
    // corpo che cambia coi giri: rimbombo verso i 3300, grinta oltre i 5000
    const bell = Math.exp(-Math.pow((S.rpm - vc.boomRpm) / 520, 2));
    this.openG = (0.82 + 0.38 * o + 0.1 * bell * ld) * (1 + 0.12 * ss(hi - 1800, hi, S.rpm) * ld);
    const lpW = M.lp * (this.cfg.view === 0 ? 1 + 2.4 * (this.winS || 0) : 1);   // in abitacolo col finestrino giù lo scarico arriva diretto
    this.viewLP.set('lp', Math.min(15000, lpW * (0.55 + 1.75 * o)), 0.6, this.sr);
    this.viewLP2.set('lp', Math.min(16000, lpW * (0.9 + 2.2 * o)), 0.6, this.sr);
    this.barkPK.set('peak', 900 + 900 * o, 0.9, this.sr, 7.5 * o);
    if (this.bov.env > 0) {
      const pr = Math.min(1, this.bov.t / this.bov.len);
      const b = this.tn.bov;
      this.bovBP.set('bp', b.f0 - b.sw * pr, b.q, this.sr);
      this.bov.rate = 24 - 12 * pr;
    }
  }

  render(outL, outR, n) {
    const sr = this.sr, S = this.S, cfg = this.cfg, cyl = this.cyl, tn = this.tn;
    const TAU = 6.283185307179586;
    for (let i = 0; i < n; i++) {
      if ((this.k++ & 31) === 0) this.control();
      const M = this.mix;
      const rn = S.rpm / 7000;
      // giri interpolati senza gradini + oscillazione della velocità d'albero dopo ogni scoppio
      this.rpmI += this.rpmStep;
      const dth = Math.max(0, this.rpmI) * 6 / sr;
      this.flu *= 1 - Math.min(0.5, dth / 55);
      this.fluM += (this.flu - this.fluM) * 0.0008;
      this.th += dth * (1 + this.flu - this.fluM);
      if (this.th >= 720) this.th -= 720;
      const th = this.th;
      const nz = this.r(), nz2 = this.r(), nz3 = this.r();

      // ---- impulsi di scarico (blowdown) e aspirazione, cilindro per cilindro ---
      let col = 0, inn = 0;
      for (let j = 0; j < this.nCyl; j++) {
        const c = cyl[j];
        let a = th - c.off; if (a < 0) a += 720;
        if (a < c.prevA) this.cycle(c);
        c.prevA = a;
        let p = 0;
        const aj = a - (c.j || 0);
        if (aj > 0 && aj < 300) {
          const x = aj / c.tp;
          p = c.amp * x * x * Math.exp(2 - 2 * x) * (1 + c.nz * nz);
          if (aj < 240) p += c.disp * Math.sin(aj * 0.01308997);
        }
        // collettore: guida d'onda con riflessione all'unione
        const b = c.buf, m = 2047;
        c.lp += 0.45 * (b[(c.wi - 2 * c.D) & m] - c.lp);
        b[c.wi] = p + c.rf * c.lp;
        col += b[(c.wi - c.D) & m];
        c.wi = (c.wi + 1) & m;
        let ai = a - 380; if (ai < 0) ai += 720;
        if (ai < 230) inn += c.ain * Math.sin(ai * 0.01365);
      }

      // ---- turbina: smorza e leviga gli impulsi --------------------------------
      this.tb += this.tbA * (col - this.tb);
      let x = col * 0.22 + this.tb * 0.62;
      x += this.turbHP.p(nz2) * S.turbo * S.air * 0.015;
      // catalizzatore
      this.catS += this.catA * (x - this.catS);
      x = this.catS * this.catG;
      // onda d'urto: a pieno carico gli impulsi si irripidiscono (più armoniche, più "rasp")
      if (this.rasp > 0) { const q = x * 3; x += this.rasp * 0.18 * (q / (1 + Math.abs(q))) * Math.abs(x) * 3; }

      // brontolio di fondo: mezzo ordine (un giro di camme) ai bassi giri, dà corpo e "peso" al motore
      x += Math.sin(th * 0.0087266) * 0.012 * Math.max(0, 1 - rn * 1.6) * (0.4 + S.charge) * (S.running > 0.5 ? 1 : 0);

      // ---- afterfire -------------------------------------------------------------
      for (let q = this.pops.length - 1; q >= 0; q--) {
        const pp = this.pops[q];
        if (--pp.d <= 0 && pp.vb) {
          let w = this.bV[0]; for (const vv of this.bV) if (vv.e < w.e) w = vv;
          w.e = Math.min(1.6, pp.a); w.f = pp.f * 1.5; w.ft = pp.f * 0.62; w.fd = Math.exp(-1 / (sr * 0.03)); w.dec = Math.exp(-1 / (sr * 0.05 * pp.len)); w.ph = 0; w.n = 0;
          w.lc = 1 - Math.exp(-TAU * (260 + 520 * pp.nz) / sr); w.ne = 0.9 * pp.nz; w.nd = Math.exp(-1 / (sr * 0.03));
          this.pops.splice(q, 1);
        } else if (pp.vb) continue;
        else if (pp.d <= 0) {
          // la voce più quieta lascia il posto al nuovo scoppio
          let w = this.popV[0]; for (const vv of this.popV) if (vv.e < w.e) w = vv;
          w.e = Math.min(2.5, pp.a); w.dec = Math.exp(-1 / (sr * 0.014 * pp.len)); w.f = pp.f; w.tf = pp.tf; w.ph = 0; w.th = 0;
          w.nc = pp.nc; w.nk = Math.sqrt((2 - pp.nc) / pp.nc); w.n = 0; w.br = pp.br; w.tk = pp.tk;
          w.bE = Math.min(2.5, pp.a) * pp.bk; w.bA = 0;
          if (pp.bk > 0) {
            w.bT = 50 * pp.bfm; w.bF = w.bT * 2.4;                       // parte alto (l'onda d'urto) e cade in 25 ms
            w.bDec = Math.exp(-1 / (sr * 0.06 * this.popB.len * pp.blm));
            w.bLc = 1 - Math.exp(-TAU * (260 + 380 * (pp.bfm - 0.8)) / sr);  // rumore cupo: 260-600 Hz
          }
          this.pops.splice(q, 1);
        }
      }
      let pop = 0, popC = 0, popT = 0, popE = 0, popB = 0;
      const bG = 1 - Math.exp(-1 / (sr * 0.025)), bAt = 1 - Math.exp(-1 / (sr * 0.0015));
      for (let q = 0; q < 6; q++) {
        const vv = this.popV[q];
        if (vv.bE > 1e-4) {
          vv.bPh += vv.bF / sr; vv.bF += (vv.bT - vv.bF) * bG; vv.bA += (1 - vv.bA) * bAt;
          vv.bN1 += vv.bLc * (nz3 - vv.bN1); vv.bN2 += vv.bLc * (vv.bN1 - vv.bN2);
          popB += vv.bE * vv.bA * (0.8 * Math.sin(TAU * vv.bPh) + vv.bN2 * 3.2);
          vv.bE *= vv.bDec; popE += vv.bE * 0.5;
        }
        if (vv.e < 1e-4) continue;
        vv.ph += vv.f / sr; vv.th += vv.tf / sr; vv.n += vv.nc * (nz3 - vv.n);
        const sp = vv.e * (vv.n * vv.nk * 0.85 + 0.7 * Math.sin(TAU * vv.ph));
        pop += sp; popC += sp * vv.br; popT += Math.sin(TAU * vv.th) * Math.min(1.6, vv.e) * 0.24 * vv.tk; popE += vv.e;
        vv.e *= vv.dec;
      }
      this.popEnv = popE;
      // ---- borbottio: colpo basso che scende di nota + rumore cupo, saturato come uno scoppio nel tubo ----
      let bur = 0;
      for (let q = 0; q < 5; q++) {
        const vb = this.bV[q]; if (vb.e < 1e-4) continue;
        vb.ph += vb.f / sr; vb.f = vb.ft + (vb.f - vb.ft) * vb.fd; vb.n += vb.lc * (nz3 - vb.n);
        bur += vb.e * (0.85 * Math.sin(TAU * vb.ph) + 2.6 * vb.ne * vb.n);
        vb.e *= vb.dec; vb.ne *= vb.nd;
      }
      bur = this.burHP.p(Math.tanh(bur * 1.3) * 0.34);
      bur = this.cfg.view === 0 ? (this.burLPo.p(bur), this.burLPc.p(bur) * 1.15) : (this.burLPc.p(bur), this.burLPo.p(bur));
      x += pop * 0.9 * this.popB.mid;

      // ---- tubo principale (risonanze a quarto d'onda) --------------------------
      const pb = this.pipe, pm = 16383;
      this.pLp += 0.35 * (pb[(this.pw - 2 * this.pD) & pm] - this.pLp);
      pb[this.pw] = x + this.pR * this.pLp;
      let y = pb[(this.pw - this.pD) & pm];
      this.pw = (this.pw + 1) & pm;
      // getto in uscita: fruscio proporzionale alla velocità dei gas
      const flow = rn * (0.25 + S.charge);
      y += this.jetBP.p(nz) * flow * flow * 0.05 * this.jetG;
      // silenziatore
      for (let q = 0; q < 4; q++) y = this.muf[q].p(y);
      y *= this.mufG;
      // radiazione dalla bocca del terminale (≈ derivata) + blocco DC
      const rad = y - 0.9 * this.radPrev; this.radPrev = y;
      const ex = rad - this.dc1x + 0.995 * this.dc1y; this.dc1x = rad; this.dc1y = ex;
      // scoppio all'uscita del terminale: schiocco secco (crack) più un colpo sordo (thump) che non passa dal silenziatore
      const crack = this.crackHP.p(popC) * 0.55;
      const thump = Math.max(-0.4, Math.min(0.4, popT));
      let met = 0;
      if (this.metK > 1e-3) { const q = this.metBP.p(ex) * 30; met = (Math.tanh(q) * 0.7 + this.metBP2.p(Math.tanh(q * 2)) * 0.25) * 0.13 * this.metK * this.openG; }
      let exh = this.barkPK.p(this.viewLP2.p(this.viewLP.p(ex + crack + met)));
      { const k = 0.9 + 2.6 * this.open; exh = Math.tanh(exh * k) / k * this.openG; }   // si sporca quando si apre (picchi smussati, non più forte)
      // voce aperta: gli armonici alti degli impulsi (ruvidi, saturati) che il silenziatore lascia passare solo a gas spalancato
      if (this.open > 0.02) {
        const o = this.open, hv = this.opHP2.p(this.opHP.p(ex));
        exh += this.opLP.p(Math.tanh(hv * (6 + 10 * o)) * 0.13) * o * o * this.openG * (M.lp < 4000 ? 1.5 : 1);   // in abitacolo arriva attraverso la scocca: più forte per compensare il filtro
      }
      if (M.character > 1e-5) {
        // modifica Codex: più corpo nei medio-bassi e attacco quando acceleri, saturazione morbida (niente picchi)
        const load = this.codexLoad, drive = 1 + 0.6 * load;
        const tone = this.codexEdge.p(this.codexBody.p(exh)), shaped = Math.tanh(tone * drive) / drive;
        exh += (shaped - exh) * M.character * (0.35 + 0.65 * load);
      }
      exh += thump;
      if (popB !== 0) exh += Math.tanh(popB * 1.1) * 0.25;      // boato: saturato come un colpo nel tubo, niente picchi
      const boom = this.boomBP.p(ex) * 1.6;
      // screamer pipe della wastegate: gas di scarico liberi, impulsi compresi
      if (tn.scream && S.wg > 0.005) exh += (this.scrBP.p(nz2) * 0.6 + this.scrHP.p(col) * 0.45) * S.wg * 0.4;
      // secondo terminale (scarichi a doppia uscita)
      this.tips[this.tw] = exh;
      const exhR = this.tipD ? this.tipBP.p(this.tips[(this.tw - this.tipD) & 255]) : exh;
      this.tw = (this.tw + 1) & 255;

      // ---- aspirazione -------------------------------------------------------------
      let intake = this.inLP.p(this.inPK.p(this.inHP.p(inn))) * 1.1 * tn.intake.in;
      intake += this.roarBP.p(nz2) * S.air * Math.pow(rn, 1.5) * 0.12 * (1 - 0.5 * S.turbo) * tn.intake.roar;
      // farfalle singole: ogni cornetto risuona, a gas aperto un ululato tonale che sale coi giri
      if (this.howlK > 1e-3) { const hq = Math.tanh(inn * 1.6) * 0.3 + nz3 * Math.abs(inn) * 0.6; intake += (this.howlBP.p(hq) * 0.8 + this.howlBP2.p(hq) * 0.35) * this.howlK * (0.6 + 0.6 * tn.intake.in) * 0.85 * (1 + 0.3 / Math.max(0.1, M.intake)); }   // fuori dall'auto l'ululato si sente comunque

      // ---- turbo: fischio della girante, soffio, valvola --------------------------
      const tb = tn.tb, ft = tb.f0 + (tb.f1 - tb.f0) * S.turbo;
      this.lfo += (nz * 0.002 - this.lfo * 0.0005);
      this.wDrift += (nz2 * 0.0006 - this.wDrift * 0.00025);            // deriva lenta (pochi Hz di variazione)
      this.wAmp += (nz3 * 0.004 - this.wAmp * 0.0012);                   // respiro del volume
      const ftv = ft * (1 + this.lfo + this.wDrift);
      if ((this.wN = (this.wN + 1) & 31) === 0) { this.wBP.set('bp', ftv, 18, sr); this.wBP2.set('bp', ftv * 1.49, 12, sr); }
      this.tph += ftv / sr; if (this.tph > 1) this.tph -= 1;
      const band = this.wBP.p(nz) * 5.5 + this.wBP2.p(nz2) * 1.6;           // aria che fischia, non una sinusoide pura
      let whistle = (0.42 * Math.sin(TAU * this.tph) + 0.08 * Math.sin(2 * TAU * this.tph) + band) * (1 + Math.max(-0.4, Math.min(0.4, this.wAmp * 6)));
      if (tb.twin) {
        this.tph2 += ft * 0.87 / sr; if (this.tph2 > 1) this.tph2 -= 1;
        whistle += S.sec * 0.8 * Math.sin(TAU * this.tph2);
      }
      const tAmp = Math.pow(S.turbo, 1.7) * (0.22 + 0.78 * S.thr) * tb.w * (0.6 + 0.4 * tn.intake.wh);
      let turbo = this.wLP.p(whistle * tAmp) + this.whooshBP.p(nz3) * S.turbo * S.air * tb.wh * tn.intake.wh;

      let bov = 0; this.flOn = 0; this.flPulse = 0;
      if (this.bov.env > 0) {
        const B = this.bov; B.t += 1 / sr;
        const att = 0.004;
        const env = B.t < att ? B.t / att : Math.exp(-(B.t - att) / (B.len * 0.38));
        this.bovWob += (nz3 - this.bovWob) * 0.004;                          // turbolenza: il getto non è mai liscio
        const wob = 1 + this.bovWob * 1.8;
        const nb = this.bovHP.p(this.bovBP.p(nz));
        const air = this.bovAir.p(nz2) * Math.exp(-B.t / (B.len * 0.18));    // sibilo alto, si spegne per primo
        const low = this.bovLow.p(nz3) * Math.exp(-B.t / (B.len * 0.55));    // "pff" grave, dura di più
        const click = B.t < 0.003 ? this.bovClick.p(nz) * (1 - B.t / 0.003) * 1.6 : 0;   // scatto della valvola che si apre
        const bv = tn.bov;
        if (bv.v === 2) {
          this.flPh += B.rate / sr;
          if (this.flPh > 1) { this.flPh -= 1; this.flAmp = 0.65 + 0.35 * Math.random(); B.rate *= 0.94 + 0.12 * Math.random(); }   // battiti irregolari
          const chop = Math.pow(0.5 + 0.5 * Math.cos(TAU * this.flPh), 4) * this.flAmp;
          this.flOn = chop * env * B.I; this.flPulse = chop;
          bov = (nb * 0.5 + this.flBP.p(nz2) * 1.5 + low * 0.95 + Math.sin(TAU * this.tph) * 0.1) * chop * env * wob * B.I * bv.g * 1.35 + click * bv.g * B.I * 0.5;
        } else {
          bov = (nb * 0.62 + air * 0.32 + low * 0.45) * env * wob * B.I * bv.g + click * bv.g * B.I;
          // sibilo tonale iniziale (tipo "trombetta") che scende di frequenza
          if (bv.chirp > 0 && B.t < 0.25) {
            this.chirpPh += (3400 - 5200 * B.t) / sr; if (this.chirpPh > 1) this.chirpPh -= 1;
            bov += Math.sin(TAU * this.chirpPh) * bv.chirp * B.I * 0.1 * Math.exp(-B.t / 0.07) * Math.min(1, B.t / 0.006);
          }
        }
        if (B.t > B.len * 3) B.env = 0;
      }

      // ---- meccanica: punterie, combustione nel basamento, cinghia ----------------
      const tk = Math.floor(th / 30);
      if (tk !== this.lastTick) { this.lastTick = tk; if (S.rpm > 30) this.tickEnv = Math.random() < 0.25 ? 0.15 : 0.3 + 0.7 * Math.abs(nz2); }
      let mech = this.tickHP.p(nz) * this.tickEnv * (0.12 + 0.5 * rn) * 0.06;
      this.tickEnv *= this.tickDec;
      mech += this.knockBP.p(nz3) * this.knock * 0.05;
      this.knock *= this.knockDec;
      this.beltPh += S.rpm / 60 * 9.3 / sr; if (this.beltPh > 1) this.beltPh -= 1;
      mech += Math.sin(TAU * this.beltPh) * 0.004 * Math.min(1, S.rpm / 600);

      // ---- motorino d'avviamento e pompa benzina ------------------------------------
      let starter = 0;
      if (S.starter > 0.002) {
        const f0 = 28 + S.rpm * 10.5 / 60;
        this.stPh += f0 / sr; if (this.stPh > 1) this.stPh -= 1;
        const saw = 2 * this.stPh - 1;
        starter = (this.stLP.p(saw) * 0.5 + Math.sin(TAU * 24 * this.stPh) * 0.1 + nz2 * 0.05 * (0.6 + 0.4 * saw)) * S.starter * 0.32;
      }
      let pump = 0;
      if (S.pump > 0.002) {
        this.pumpPh += 152 / sr; if (this.pumpPh > 1) this.pumpPh -= 1;
        pump = (Math.sin(TAU * this.pumpPh) * 0.5 + this.pumpLP.p(nz) * 0.6) * S.pump * 0.02;
      }

      // ---- strada, vento, gomme, cambio ------------------------------------------------
      const v = S.speed;
      this.brown = this.brown * 0.996 + nz2 * 0.06;
      let road = this.roadLP.p(this.brown) * Math.min(1.6, Math.pow(v / 30, 1.1)) * 0.5;
      // vento: in abitacolo coi finestrini chiusi resta solo il fruscio filtrato dalle guarnizioni; aperti entra l'aria
      // (fruscio pieno e rombo basso) e a finestrino socchiuso, oltre i 50 km/h, l'abitacolo pulsa come una bottiglia
      this.winS += ((this.T.win || 0) - this.winS) * 0.0005; this.motS += ((this.T.winMot || 0) - this.motS) * 0.002;
      const cab = cfg.view === 0, wo = this.winS, vk = Math.min(3, (v / 55) * (v / 55));
      let wind = this.windBP.p(nz3) * vk * 0.22 * (cab ? 0.2 + 0.8 * wo : 1);
      if (cab && wo > 0.02) {
        const half = Math.max(0, 1 - Math.abs(wo - 0.35) / 0.3), buf = half * Math.max(0, Math.min(1, (v - 14) / 10));
        this.buffPh += (13 + v * 0.12) / sr; if (this.buffPh > 1) this.buffPh -= 1;
        wind += this.windLP.p(nz) * vk * 0.5 * wo + Math.sin(TAU * this.buffPh) * buf * 0.05 * Math.min(1.4, vk);
      }
      // motorino del finestrino: ronzio con un po' di fatica, si sente quasi solo da dentro
      let winMotor = 0;
      if (this.motS > 0.003) {
        this.motPh += (88 + 10 * Math.sin(TAU * this.buffPh)) / sr; if (this.motPh > 1) this.motPh -= 1;
        winMotor = (this.motBP.p((this.motPh * 2 - 1) + nz2 * 0.25) * 0.05 + (this.motPh * 2 - 1) * 0.006) * this.motS * (cab ? 1 : 0.12);
      }
      let tire = 0;
      if (S.spin > 0.005) {
        this.sqPh += 8.5 / sr; if (this.sqPh > 1) this.sqPh -= 1;
        tire = (this.sq1.p(nz) + this.sq2.p(nz2) * 0.8) * S.spin * 1.3 * (0.75 + 0.25 * Math.sin(TAU * this.sqPh));
      }
      const gr = Math.abs(S.gearRpm);
      this.gPh += gr / 60 * 31 / sr; if (this.gPh > 1) this.gPh -= 1;
      let gear = Math.sin(TAU * this.gPh) * (0.006 * Math.min(1, S.drive) + S.rev * 0.05 * Math.min(1, gr / 500));
      // cinghia dei servizi: l'alternatore gira 2,7 volte l'albero, fischio sottile con una seconda armonica
      this.beltPh += rn * 7000 / 60 * 2.7 / sr; if (this.beltPh > 1) this.beltPh -= 1;
      const belt = S.running > 0.5 ? (Math.sin(TAU * this.beltPh) + 0.35 * Math.sin(2 * TAU * this.beltPh)) * (0.0022 + 0.003 * rn) : 0;
      if (this.grind > 1e-3) {
        this.grPh += 52 / sr; if (this.grPh > 1) this.grPh -= 1;
        gear += this.grBP.p(nz) * this.grind * (0.4 + 0.6 * this.grPh) * 0.5;
        this.grind *= Math.exp(-1 / (sr * 0.12));
      }
      if (this.clunk > 1e-3) {
        this.clPh += 58 / sr;
        gear += Math.sin(TAU * this.clPh) * this.clunk * 0.12 + nz * this.clunk * this.clunk * 0.04;
        this.clunk *= Math.exp(-1 / (sr * 0.03));
      } else this.clPh = 0;
      // giunto della strada: tonfo sordo delle gomme e della sospensione
      if (this.bump > 1e-3) {
        this.bumpPh += 47 / sr;
        road += (Math.sin(TAU * this.bumpPh) * 0.5 + this.roadLP.p(nz) * 2.5) * this.bump * 0.35;
        this.bump *= Math.exp(-1 / (sr * 0.045));
      }
      if (this.click > 1e-3) { gear += this.tickHP.p(nz3) * this.click * 0.25; this.click *= Math.exp(-1 / (sr * 0.004)); }

      // tintinnio della frizione bidisco in folle al minimo
      if (this.rattle > 1e-3) {
        mech += (this.ratBP.p(nz2) + this.ratBP2.p(nz3) * 0.7) * this.rattle * 0.5;
        this.rattle *= this.knockDec;
      }

      // pompaggio del compressore: il fischio della turbina (ancora in rotazione) si spezza a colpi, "stu-tu-tu"
      let surge = 0;
      if (this.flOn > 0) {
        // fischio vero della girante: tono puro con armoniche, l'altezza sale in ogni colpo (l'aria torna indietro
        // e la girante riaccelera per un istante) e scende tra un colpo e l'altro; più un filo d'aria intonato
        const spin = 0.45 + 0.55 * Math.min(1, S.turbo * 1.6);
        const fs = ftv * (0.84 + 0.2 * this.flPulse) * (0.75 + 0.25 * spin);
        this.sgPh += fs / sr; if (this.sgPh > 1) this.sgPh -= 1;
        this.sgPh2 += fs * 1.52 / sr; if (this.sgPh2 > 1) this.sgPh2 -= 1;
        if ((this.sgN = (this.sgN + 1) & 31) === 0) this.sgBP.set('bp', fs, 30, sr);
        const tone = 0.62 * Math.sin(TAU * this.sgPh) + 0.18 * Math.sin(2 * TAU * this.sgPh) + 0.1 * Math.sin(TAU * this.sgPh2)
          + this.sgBP.p(nz2) * 3.2 + this.sgHP.p(nz3) * 0.05 * this.flPulse;
        surge = tone * this.flOn * spin * 1.0 * (0.6 + 0.4 * Math.min(1, tn.tb.w / 0.035));
        turbo *= 1 - 0.75 * Math.min(1, this.flOn * 2);
      }
      // ---- mix per punto d'ascolto ---------------------------------------------------------
      const side = exhR * M.exh - exh * M.exh;   // differenza tra i terminali → immagine stereo
      const cabK = this.cfg.view === 0 ? (tn.cabin || 1) : 1;   // abitacolo alleggerito: rimbomba di più
      let out = exh * M.exh * cabK + boom * M.boom * cabK + intake * M.intake + mech * M.mech * (1 + 5 * this.vc.diesel) + turbo * M.turbo * this.fxT + surge * (M.turbo + M.bov) * this.fxS + bov * M.bov * this.fxB
        + road * M.road + wind * M.wind + tire * M.tire + gear * M.gear + starter * M.starter + pump * M.pump + belt * M.belt + winMotor;
      // in abitacolo coi finestrini aperti lo scarico e la strada entrano più forti
      if (cab) out += (exh * M.exh * 0.6 + road * 0.45 + tire * 0.4) * wo;
      out = out * M.g + bur * this.burG + 1e-18;       // il borbottio ha il suo livello, non passa dal mix del motore
      // urti: livello pari in tutti i punti d'ascolto (non passano dal mix del motore), poi riverbero dell'ambiente
      if (this.H) { const H = this.H; if (H.duck > 1e-3) { out *= 1 - H.duck; H.duck *= Math.exp(-1 / (sr * 0.3)); } out += this.hitSample(TAU, this.cfg.view) * 0.32; }

      // ---- ambiente: prime riflessioni (asfalto, palazzi, pareti) e coda di riverbero -------------------------------
      this.rvFb += ((this.rvFbT ?? 0.78) - this.rvFb) * 0.0002; this.rvWet += ((this.rvWetT ?? 0.035) - this.rvWet) * 0.0002;
      const eb = this.erB, en = this.erN; eb[this.erI] = out;
      let el = 0, er = 0;
      for (const [d, gg] of this.erTL) el += eb[(this.erI - d + en) % en] * gg;
      for (const [d, gg] of this.erTR) er += eb[(this.erI - d + en) % en] * gg;
      this.erI = (this.erI + 1) % en;
      const rin = out * 0.22, fb = this.rvFb, dm = this.rvDamp;
      let wl = 0, wr = 0;
      for (let q = 0; q < 8; q++) {
        const cb = this.rv[q], buf = cb.b, o = buf[cb.i];
        cb.f = o * (1 - dm) + cb.f * dm;
        buf[cb.i] = rin + cb.f * fb;
        cb.i = (cb.i + 1) % cb.n;
        if (q < 4) wl += o; else wr += o;
      }
      for (let q = 0; q < 4; q++) {
        const ap = this.ap[q], buf = ap.b, o = buf[ap.i];
        const inp = q < 2 ? wl : wr;
        const yv = -inp + o;
        buf[ap.i] = inp + o * 0.5;
        ap.i = (ap.i + 1) % buf.length;
        if (q < 2) wl = yv; else wr = yv;
      }
      const g = cfg.vol * 2.6;
      const w = side * 0.5 * M.width;
      const eo = cab ? 1 + 4 * wo : 1, ro = cab ? 1 + 2.5 * wo : 1;   // finestrino aperto: l'eco della città e della galleria entra
      outL[i] = Math.tanh((out - w + el * M.er * eo + wl * this.rvWet * ro) * g) * 0.9;
      outR[i] = Math.tanh((out + w + er * M.er * eo + wr * this.rvWet * ro) * g) * 0.9;
    }
  }
}
