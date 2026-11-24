// ============================================================================
//  Night Run · Forature (dopo strada.js e viaggio.js, prima dello script principale)
//  Due cose diverse, ognuna col suo conto alla rovescia in km (indipendenti):
//  - la foratura lenta: hai preso qualcosa, un colpo secco e la gomma perde piano piano (si vede sul quadro);
//    una ogni 15-20 km;
//  - lo scoppio: la gomma esplode in corsa, un botto, l'aria che esce tutta (PSSSHHH) e poi la gomma a terra che
//    sbatte sull'asfalto finché non ti fermi; uno ogni 42-45 km, sfasato di ±5 km (quindi tra 37 e 50).
//  Solo nel Viaggio, e solo in movimento (lo scoppio sopra i 40 km/h): se scade da fermo aspetta che riparti.
//  I km li conta qui, solo in avanti (s.forat). Prima c'era una foratura a caso ogni ~260 km in viaggio.js e la foratura
//  lenta era uno degli eventi tra le tappe di strada.js: tolte tutte e due, ci pensa questo file.
//  Il suono è sintetizzato in Web Audio (niente registrazioni): NightForature.suono(...) e .tick(...) dal ciclo di
//  index.html. Prova: NightForature.scoppio() (scoppio subito), NightForature.lenta(), NightForature.stato().
//  Funzioni pure provate in test/forature.test.js: forProssimo, forPasso, forScegli.
// ============================================================================
const FOR = {
  lenta: [15, 20],            // km tra una foratura lenta e l'altra
  scoppio: [42, 45],          // km tra uno scoppio e l'altro...
  sfasa: 5,                   // ...più o meno questi km, perché non sia sempre uguale
  vLenta: 5,                  // m/s minimi perché arrivi la foratura lenta (18 km/h)
  vScoppio: 11,               // m/s minimi per lo scoppio (40 km/h)
  perdita: [0.008, 0.018],    // bar al secondo persi dalla foratura lenta (come prima)
  aTerra: 0.3,                // bar che restano dopo lo scoppio
};
const FOR_NOMI = ['anteriore sinistra', 'anteriore destra', 'posteriore sinistra', 'posteriore destra'];

// quanti km mancano al prossimo evento di quel tipo (rnd → numeri tra 0 e 1)
function forProssimo(tipo, rnd) {
  const r = rnd || Math.random, R = FOR[tipo];
  const base = R[0] + (R[1] - R[0]) * r();
  return tipo === 'scoppio' ? base + (r() * 2 - 1) * FOR.sfasa : base;
}
// avanza i conti di dkm; v = velocità (m/s). Restituisce gli eventi da far succedere adesso: ['lenta'], ['scoppio']...
function forPasso(st, dkm, v, rnd) {
  if (!Number.isFinite(st.lenta)) st.lenta = forProssimo('lenta', rnd);
  if (!Number.isFinite(st.scoppio)) st.scoppio = forProssimo('scoppio', rnd);
  const ev = [];
  if (dkm > 0) { st.lenta -= dkm; st.scoppio -= dkm; }
  if (st.lenta <= 0 && Math.abs(v) >= FOR.vLenta) { ev.push('lenta'); st.lenta = forProssimo('lenta', rnd); }
  if (st.scoppio <= 0 && Math.abs(v) >= FOR.vScoppio) { ev.push('scoppio'); st.scoppio = forProssimo('scoppio', rnd); }
  if (st.lenta < 0) st.lenta = 0;            // scaduta da fermo: resta in attesa, non si accumulano debiti
  if (st.scoppio < 0) st.scoppio = 0;
  return ev;
}
// quale gomma: per la lenta una che non perde già e non è a terra, per lo scoppio una non già a terra; -1 se nessuna
function forScegli(T, tipo, rnd) {
  const r = rnd || Math.random;
  const ok = [0, 1, 2, 3].filter((i) => tipo === 'lenta' ? !(T.leak[i] > 0) && T.p[i] > 1.2 : T.p[i] > 0.8);
  return ok.length ? ok[Math.floor(r() * ok.length) % ok.length] : -1;
}

(function () {
  'use strict';
  // ---------------------------------------------------------------- il gioco
  if (typeof StreetGame !== 'undefined') {
    const P = StreetGame.prototype, tu = P.tyreUpdate;
    if (tu) P.tyreUpdate = function (dt, dkm) {
      tu.call(this, dt, dkm);
      if (!this.s.vg || this.inside || this.rulli) return;               // solo nel Viaggio, mai dentro un locale o sui rulli
      const st = this.s.forat || (this.s.forat = {});
      for (const k of forPasso(st, dkm, this.sim.v)) (k === 'lenta' ? this.foraLenta : this.foraScoppio).call(this);
    };
    P.foraLenta = function () {
      if (!this.tyres) return false;
      const T = this.tyres(), i = forScegli(T, 'lenta'); if (i < 0) return false;
      T.leak[i] = FOR.perdita[0] + Math.random() * (FOR.perdita[1] - FOR.perdita[0]);
      this.say('Un colpo secco sotto la scocca: hai preso qualcosa. Tieni d\'occhio la pressione delle gomme', 'info');
      if (this.vgThink) this.vgThink('Cos\'era quel colpo? Speriamo non una gomma. Al prossimo benzinaio do un\'occhiata.');
      if (this.fx) this.fx.push({ k: 'gommaLenta', i });
      return true;
    };
    P.foraScoppio = function () {
      if (!this.tyres) return false;
      const T = this.tyres(), i = forScegli(T, 'scoppio'); if (i < 0) return false;
      T.p[i] = Math.min(T.p[i], FOR.aTerra); T.leak[i] = Math.max(T.leak[i] || 0, 0.25);
      this.say(`BANG! È scoppiata la gomma ${FOR_NOMI[i]}: accosta e cambiala (9)`, 'bad');
      if (this.vgThink) this.vgThink('Porca… è esplosa. Piano, piano, non inchiodare. Accosto.');
      if (this.fx) this.fx.push({ k: 'scoppio', i, v: Math.abs(this.sim.v) });
      if (this.statAdd) this.statAdd('scoppi');
      return true;
    };
  }

  // ---------------------------------------------------------------- il suono
  let rumore = null, flap = { prossimo: 0, fase: 0 };
  const noise = (ctx) => {
    if (rumore && rumore.sampleRate === ctx.sampleRate) return rumore;
    const n = ctx.sampleRate * 2, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return (rumore = b);
  };
  const uscita = (audio) => audio.comp || audio.ctx.destination;      // dopo il compressore: l'udito ovattato di sensi.js vale anche qui
  const pan = (ctx, i, out) => { if (!ctx.createStereoPanner) return out; const p = ctx.createStereoPanner(); p.pan.value = i % 2 ? 0.35 : -0.35; p.connect(out); return p; };

  // lo scoppio: botto (schiocco secco + colpo basso nella scocca), poi l'aria che esce tutta in un paio di secondi,
  // forte e ruvida, che scende di tono mentre la gomma si svuota
  function scoppio(audio, vol, i, t0) {
    const ctx = audio.ctx, t = (t0 != null ? t0 : ctx.currentTime) + 0.01, V = vol, out = pan(ctx, i || 0, uscita(audio)), nb = noise(ctx);
    // 1) lo schiocco: rumore pieno, attacco istantaneo, saturato perché "spacchi"
    const s1 = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), sh = ctx.createWaveShaper(), g1 = ctx.createGain();
    const curva = new Float32Array(1024); for (let k = 0; k < 1024; k++) { const x = k / 511.5 - 1; curva[k] = Math.tanh(x * 3.2); }
    sh.curve = curva; s1.buffer = nb; hp.type = 'highpass'; hp.frequency.value = 160;
    g1.gain.setValueAtTime(0.0001, t); g1.gain.linearRampToValueAtTime(0.55 * V, t + 0.002); g1.gain.exponentialRampToValueAtTime(0.16 * V, t + 0.035); g1.gain.exponentialRampToValueAtTime(0.0005, t + 0.22);
    s1.connect(hp); hp.connect(sh); sh.connect(g1); g1.connect(out); s1.start(t, Math.random()); s1.stop(t + 0.25);
    // 2) il colpo basso: la scocca che prende la botta (seno che cade da 95 a 32 Hz)
    const o = ctx.createOscillator(), g2 = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(32, t + 0.3);
    g2.gain.setValueAtTime(0.0001, t); g2.gain.linearRampToValueAtTime(0.6 * V, t + 0.006); g2.gain.exponentialRampToValueAtTime(0.0005, t + 0.42);
    o.connect(g2); g2.connect(out); o.start(t); o.stop(t + 0.45);
    // 3) lo strappo: un crepitio acuto brevissimo (la carcassa che si apre)
    const s3 = ctx.createBufferSource(), bp3 = ctx.createBiquadFilter(), g3 = ctx.createGain();
    s3.buffer = nb; bp3.type = 'bandpass'; bp3.frequency.value = 4200; bp3.Q.value = 1.2;
    g3.gain.setValueAtTime(0.0001, t + 0.004); g3.gain.linearRampToValueAtTime(0.32 * V, t + 0.008); g3.gain.exponentialRampToValueAtTime(0.0005, t + 0.09);
    s3.connect(bp3); bp3.connect(g3); g3.connect(out); s3.start(t, Math.random()); s3.stop(t + 0.1);
    // 4) PSSSSHHHH: l'aria che esce. Rumore in banda larga che scende da ~3,6 kHz a ~700 Hz mentre cala, con un tremolio
    //    di turbolenza; parte forte subito dopo il botto e si spegne in circa 2 secondi
    const s4 = ctx.createBufferSource(), bp4 = ctx.createBiquadFilter(), hp4 = ctx.createBiquadFilter(), g4 = ctx.createGain(), tr = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
    s4.buffer = nb; s4.loop = true; bp4.type = 'bandpass'; bp4.Q.value = 0.7; hp4.type = 'highpass'; hp4.frequency.value = 380;
    bp4.frequency.setValueAtTime(3600, t + 0.02); bp4.frequency.exponentialRampToValueAtTime(1500, t + 0.9); bp4.frequency.exponentialRampToValueAtTime(700, t + 2.2);
    g4.gain.setValueAtTime(0.0001, t + 0.015); g4.gain.linearRampToValueAtTime(0.5 * V, t + 0.06); g4.gain.setTargetAtTime(0.0001, t + 0.35, 0.55);
    lfo.frequency.value = 23 + Math.random() * 9; lg.gain.value = 0.22; tr.gain.value = 0.78; lfo.connect(lg); lg.connect(tr.gain);
    s4.connect(bp4); bp4.connect(hp4); hp4.connect(tr); tr.connect(g4); g4.connect(out);
    s4.start(t + 0.015, Math.random()); lfo.start(t); s4.stop(t + 3.2); lfo.stop(t + 3.2);
    flap.prossimo = 0;
  }
  // la foratura lenta: un "tac" secco (il sasso o il chiodo) e un filo d'aria che sibila per un attimo
  function lenta(audio, vol, i, t0) {
    const ctx = audio.ctx, t = (t0 != null ? t0 : ctx.currentTime) + 0.01, out = pan(ctx, i || 0, uscita(audio)), nb = noise(ctx);
    const s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = nb; bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 2.5;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.32 * vol, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.06);
    s.connect(bp); bp.connect(g); g.connect(out); s.start(t, Math.random()); s.stop(t + 0.08);
    const s2 = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), g2 = ctx.createGain();
    s2.buffer = nb; hp.type = 'highpass'; hp.frequency.value = 5200;
    g2.gain.setValueAtTime(0.0001, t + 0.05); g2.gain.linearRampToValueAtTime(0.05 * vol, t + 0.12); g2.gain.exponentialRampToValueAtTime(0.0005, t + 0.9);
    s2.connect(hp); hp.connect(g2); g2.connect(out); s2.start(t + 0.05, Math.random()); s2.stop(t + 0.95);
  }
  // la gomma a terra che sbatte: un tonfo sordo (la carcassa) e uno schiaffo (la gomma sull'asfalto) a ogni giro di ruota,
  // più forte e fitto quanto più vai forte; si programma un po' in anticipo per non perdere colpi tra un fotogramma e l'altro
  function colpo(audio, t, forza, i) {
    const ctx = audio.ctx, out = pan(ctx, i, uscita(audio)), nb = noise(ctx);
    // il tonfo: un "whup" basso (seno che cade da 110 a 60 Hz) dentro un soffio sordo
    const o = ctx.createOscillator(), go = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(60, t + 0.06);
    go.gain.setValueAtTime(0.0001, t); go.gain.linearRampToValueAtTime(0.5 * forza, t + 0.005); go.gain.exponentialRampToValueAtTime(0.0005, t + 0.07);
    o.connect(go); go.connect(out); o.start(t); o.stop(t + 0.08);
    const s = ctx.createBufferSource(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = nb; lp.type = 'lowpass'; lp.frequency.value = 420 + 220 * forza;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.75 * forza, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.06);
    s.connect(lp); lp.connect(g); g.connect(out); s.start(t, Math.random() * 1.8); s.stop(t + 0.07);
    // lo schiaffo della gomma sull'asfalto
    const s2 = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g2 = ctx.createGain();
    s2.buffer = nb; bp.type = 'bandpass'; bp.frequency.value = 900 + 500 * Math.random(); bp.Q.value = 1.4;
    g2.gain.setValueAtTime(0.0001, t + 0.008); g2.gain.linearRampToValueAtTime(0.28 * forza, t + 0.011); g2.gain.exponentialRampToValueAtTime(0.0005, t + 0.05);
    s2.connect(bp); bp.connect(g2); g2.connect(out); s2.start(t + 0.008, Math.random() * 1.8); s2.stop(t + 0.06);
  }
  function tick(audio, game, sim, vol, muted, adesso) {   // adesso: solo per le prove fuori dal gioco (resa offline)
    if (!audio || !audio.ctx || muted || !game || !game.tyres || game.inside) { flap.prossimo = 0; return; }
    const T = game.tyres(), v = Math.abs(sim.v); let i = -1, piatta = 0;
    for (let k = 0; k < 4; k++) { const f = Math.max(0, (0.9 - T.p[k]) / 0.9); if (f > piatta) { piatta = f; i = k; } }
    if (i < 0 || piatta < 0.05 || v < 1.5) { flap.prossimo = 0; return; }
    const ctx = audio.ctx, now = adesso != null ? adesso : ctx.currentTime, r = (sim.P && sim.P.r) || 0.31, giro = 2 * Math.PI * r / v;   // secondi per giro di ruota
    const passo = Math.max(0.045, giro), forza = vol * piatta * Math.min(1, 0.25 + v / 28);
    if (!flap.prossimo || flap.prossimo < now) flap.prossimo = now + 0.02;
    while (flap.prossimo < now + 0.12) { colpo(audio, flap.prossimo, forza * (0.85 + 0.3 * Math.random()), i); flap.prossimo += passo * (0.94 + 0.12 * Math.random()); }
  }
  function suono(audio, f, vol, muted, t0) {
    if (!audio || !audio.ctx || muted || !f) return;
    try { if (f.k === 'scoppio') scoppio(audio, vol, f.i, t0); else if (f.k === 'gommaLenta') lenta(audio, vol, f.i, t0); } catch (e) { /* audio non disponibile */ }
  }

  if (typeof window !== 'undefined') {
    const g = () => window.nightRun && window.nightRun.game;
    window.NightForature = {
      suono, tick,
      scoppio: () => { const G = g(); return G ? G.foraScoppio() : false; },
      lenta: () => { const G = g(); return G ? G.foraLenta() : false; },
      stato: () => { const G = g(); return G && G.s.forat ? { lenta: +G.s.forat.lenta.toFixed(2), scoppio: +G.s.forat.scoppio.toFixed(2) } : null; },
    };
  }
})();
