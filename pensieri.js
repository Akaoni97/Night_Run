// ============================================================================
//  Night Run · I pensieri del protagonista (dopo missioni.js)
//  Ogni tanto il protagonista dice cosa pensa: un testo scritto sulla strada, 8-10 secondi, senza vignetta e senza riquadro.
//  Quattro sorgenti: PENS_KM (uno scritto, a un certo km: la radio, il navigatore...), PENS_BISOGNI (fame, sete, sonno,
//  igiene: due livelli, prima presto e poi con urgenza), PENS_STATO (com'è messa l'auto e la situazione: fari rotti, spia
//  del motore, gomma, pioggia, soldi in rosso, ricercato; una volta quando comincia) e PENS_ANIMO (pensieri a caso, ognuno
//  una sola volta per partita).
//  Non si ripetono: ogni gruppo si pesca da un mazzo mescolato, che si ricarica solo quando è finito.
//  I TESTI SONO SEGNAPOSTO (tranne la radio): si cambiano qui. La storia nuova ne aggiunge con game.vgThink(testo).
//  Stato in game.s.vg.pens; l'ultimo pensiero in game.thought ({ text, left, id }), che il testo a schermo legge.
// ============================================================================
const PENS_KM = [
  { km: 1, id: 'radio', text: 'La radio gracchia. E queste stazioni non le ho mai sentite, eppure sono sempre in zona.' },
  { km: 3.5, id: 'navigatore', text: 'Il navigatore del telefono dice solo «prosegui dritto». Utile.' },
  { km: 6, id: 'uscite', text: 'Guido da un po\' e non ho ancora visto un\'uscita. Non mi ricordavo questa strada così.' },
  { km: 9, id: 'volvo', text: '{Auto} di zio Claudio non l\'avevo mai guidata. Si sente che l\'ha tenuta bene.' },   // {Auto}: l'auto scelta nel garage
  { km: 13, id: 'bar', text: 'Tanti bar, tutti aperti. A quest\'ora, poi.' },
  { km: 18, id: 'cartello', text: 'Sono sicuro di aver già visto quel cartello. Forse no.' },
];
// [soglia del livello 1, soglia del livello 2]: sotto la prima parla presto, sotto la seconda con urgenza
const PENS_SOGLIE = { food: [0.45, 0.2], water: [0.45, 0.2], sleep: [0.45, 0.2], wash: [0.35, 0.15], pee: [0.4, 0.15], poo: [0.4, 0.15] };
const PENS_BISOGNI = {
  food: [
    ['Lo stomaco comincia a farsi sentire.', 'Un panino non mi farebbe schifo.', 'Non mangio da un po\'. Al prossimo bar mi fermo.', 'Ho un buco allo stomaco.', 'Speriamo che il prossimo bar sia aperto: ho fame.'],
    ['Ho una fame che vedo doppio.', 'Mi tremano le mani dalla fame. Al primo posto che trovo mi fermo.', 'Lo stomaco ormai protesta a voce alta.', 'Se non mangio qualcosa adesso mi mangio il volante.'],
  ],
  water: [
    ['Ho la bocca asciutta.', 'Un goccio d\'acqua adesso sarebbe oro.', 'Mi sa che ho sete da un po\'.', 'La gola è secca. Dov\'è la bottiglia?'],
    ['Ho una sete bestiale.', 'Potrei bere una fontana intera.', 'Sete. Solo sete. Non riesco a pensare ad altro.'],
  ],
  sleep: [
    ['Gli occhi mi pesano.', 'Ho sbadigliato tre volte in un minuto.', 'La strada è lunga e io sono stanco. Devo stare attento.'],
    ['Gli occhi mi si chiudono da soli.', 'Se chiudo gli occhi un secondo... no. No.', 'Devo fermarmi a dormire. Adesso.'],
  ],
  wash: [
    ['Avrei bisogno di una doccia.', 'Mi sento appiccicoso. Una doccia ci starebbe.'],
    ['Faccio schifo anche a me stesso.', 'Mi sento uno straccio sporco.'],
  ],
  pee: [
    ['Ho bevuto come un cammello e adesso la vescica presenta il conto.', 'Un bagno. Anche brutto. Anche senza porta.', 'Ogni buca la sento in un posto preciso, e non è la schiena.', 'Non è urgente. Non ancora. Ma lo sarà, e lo sa.', 'Al prossimo locale mi fermo, e stavolta non ci penso due volte.', 'Il sedile vibra. Io le sento tutte, una per una.', 'Il rumore dell\'acqua alla radio non aiuta. Per niente.'],
    ['Se arrivo al prossimo locale senza incidenti mi faccio una statua.', 'Il corpo ha smesso di chiedere e ha cominciato a minacciare.', 'Guido con le gambe incrociate. Questo è il mio livello adesso.', 'Non resisto più: o trovo un bagno o mi fermo in mezzo alla strada.', 'Oh merda. Letteralmente no, ma la pipì sì. Vi prego, un bagno.', 'Ogni dosso è un esame di coscienza.', 'Se mi scappa ancora un po\' divento un cartello di pericolo.'],
  ],
  poo: [
    ['La pancia borbotta una cosa che non è fame.', 'Mi sa che il panino di prima ha altri programmi per me.', 'Il corpo mi manda segnali. Per ora gentili.', 'Sento una pressione sorda e costante. Il prossimo bagno è un appuntamento fissato.', 'Non è il momento. Ma il momento sta arrivando e non ha fretta.', 'Una pausa tecnica non mi dispiacerebbe. Di quelle lunghe, con la porta chiusa.'],
    ['Oh merda. No, aspetta, quasi: mi sto cagando addosso.', 'Se mi viene adesso, questa macchina diventa un luogo del delitto.', 'Stringo tutto. Tutto. Fino alla pace con me stesso.', 'Devo andare in bagno. Adesso. Non è una richiesta.', 'Qualcuno mi dica che il prossimo locale è vicino. Anche una bugia pietosa va bene.', 'Se esco vivo da questo viaggio lo racconto solo a mio cognato.', 'Prometto di non mangiare più niente per il resto della vita. Ma fatemi arrivare.'],
  ],
};
// a caso, ogni tanto, mentre si guida: ognuno una sola volta per partita
const PENS_ANIMO = [
  'Che silenzio. Solo il motore e la strada.',
  '{Auto} tira bene, per essere {tipo}.',
  'Chissà cosa aveva in mente lo zio con tutte quelle auto sotto i teli.',
  'Di notte la strada sembra più lunga. Come diceva il notaio.',
  'Ho la strada quasi tutta per me.',
  'Chissà se prima o poi arrivo a una fine.',
  'Ho lasciato la luce accesa a casa? Boh.',
  'Mi sa che ho esagerato col caffè.',
  'A quest\'ora ogni canzone sembra scritta apposta per chi guida da solo.',
  'Conto le strisce bianche. Poi perdo il conto. Poi ricomincio.',
  'Chi guida di notte ha sempre qualcosa da cui scappare. O verso cui correre.',
  'Le luci dei camion da lontano sembrano un paese che si muove.',
];
// com'è messa l'auto e la situazione: `on` dice se vale adesso; parla quando comincia (e lo ripete dopo PENS_RIPETI)
const PENS_STATO = {
  luci: { on: (g) => (g.sim.damage || 0) > 0.35, frasi: ['I fari vanno e vengono. Qualche botta di troppo, e si vede.', 'Si è accesa la spia delle luci. Con questi fari a singhiozzo di notte è un terno al lotto.'] },
  motore: { on: (g) => (g.sim.damage || 0) > 0.6 || !!(g.carState && g.carState().tired), frasi: ['La spia del motore è accesa. Finché tira, tiro avanti. Poi si vedrà.', 'Spia gialla sul quadro. Da Mario prima che diventi rossa.'] },
  gomma: { on: (g) => g.tyres && Math.min(...g.tyres().p) < 1.9, frasi: ['Il volante tira da una parte. Una gomma è giù.', 'Spia delle gomme. Al prossimo benzinaio le gonfio, o da Mario se perde.'] },
  pioggia: { on: (g) => (g.sim.wet || 0) > 0.5, frasi: ['Con quest\'acqua l\'auto galleggia. Piede leggero.', 'Pioggia. Le frenate si allungano, meglio tenere le distanze.'] },
  rosso: { on: (g) => g.s.money < 0, frasi: ['Sono in rosso. Il prossimo lavoro lo prendo senza fare storie.', 'Conto in negativo. Per la benzina mi fanno ancora credito, ma non durerà.'] },
  ricercato: { on: (g) => !!(g.s.pol && g.s.pol.fuga), frasi: ['Tutte le volanti hanno la mia targa. Devo sparire in un parcheggio.', 'Sirene in giro. Il primo locale che trovo, mi ci infilo.'] },
};
const PENS_PAUSA = 25;                    // secondi minimi tra un pensiero e il prossimo
const PENS_ANIMO_OGNI = [150, 150];       // i pensieri a caso arrivano ogni 150-300 secondi di guida
const PENS_RIPETI = 420;                  // se il bisogno resta, lo ripete (con un'altra frase) ogni 7 minuti

(function pensieri() {
  if (typeof StreetGame === 'undefined' || typeof VG === 'undefined') return;
  const P = StreetGame.prototype;

  const stato = (g) => { const v = g.s.vg; return v.pens || (v.pens = { seen: {}, deck: {}, last: -999, t: 0, nextAmb: 120, lvl: {}, nag: {}, lastIdx: {} }); };
  // pesca da un mazzo mescolato: nessuna frase si ripete finché non sono uscite tutte
  P.vgPensDraw = function (pool, key) {
    const p = stato(this), rnd = this.rnd || Math.random;
    let deck = p.deck[key];
    if (!deck || !deck.length) {
      deck = pool.map((_, i) => i);
      for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
      if (deck.length > 1 && deck[deck.length - 1] === p.lastIdx[key]) deck.unshift(deck.pop());
    }
    const i = deck.pop(); p.deck[key] = deck; (p.lastIdx = p.lastIdx || {})[key] = i; return pool[i];
  };
  // il pensiero a schermo: da 8 a 10 secondi secondo la lunghezza
  P.vgThink = function (text) {
    const p = stato(this);
    this.thoughtN = (this.thoughtN || 0) + 1;
    text = typeof vgTesto === 'function' ? vgTesto(this, text) : text;
    this.thought = { text, left: Math.max(8, Math.min(10, 7.5 + text.length * 0.025)), id: this.thoughtN };
    p.last = p.t;
  };

  P.vgPensTick = function (dt) {
    const v = this.s.vg, p = stato(this); p.lastIdx = p.lastIdx || {};
    p.t += dt;
    if (this.thought && this.thought.left > 0) this.thought.left -= dt;
    // non si pensa in un locale, durante una domanda, in gara, o da fermi
    if (this.prompt || this.inside || this.race || Math.abs(this.sim.v) < 2 || p.t - p.last < PENS_PAUSA) return;
    const km = vgKm(this);
    // 1. un pensiero scritto, a un certo km
    const k = PENS_KM.find((q) => km >= q.km && !p.seen[q.id]);
    if (k) { p.seen[k.id] = true; this.vgThink(k.text); return; }
    // 2. un bisogno che peggiora (o che dura): parla prima il più urgente
    const order = Object.keys(PENS_SOGLIE).sort((a, b) => v.needs[a] - v.needs[b]);
    for (const n of order) {
      const th = PENS_SOGLIE[n], val = v.needs[n], lvl = val < th[1] ? 2 : val < th[0] ? 1 : 0, was = p.lvl[n] || 0;
      p.lvl[n] = lvl;
      if (lvl && (lvl > was || p.t - (p.nag[n] || 0) > PENS_RIPETI)) { p.nag[n] = p.t; this.vgThink(this.vgPensDraw(PENS_BISOGNI[n][lvl - 1], n + lvl)); return; }
    }
    // 3. com'è messa l'auto o la situazione, quando comincia
    p.st = p.st || {};
    for (const [id, q] of Object.entries(PENS_STATO)) {
      let on = false; try { on = !!q.on(this); } catch (e) { on = false; }
      const was = p.st[id];
      if (on && (!was || p.t - was > PENS_RIPETI)) { p.st[id] = p.t; this.vgThink(this.vgPensDraw(q.frasi, 'st' + id)); return; }
      if (!on && was) p.st[id] = 0;
    }
    // 4. un pensiero a caso, ogni tanto
    if (p.t >= p.nextAmb) {
      const left = PENS_ANIMO.filter((_, i) => !p.seen['a' + i]);
      p.nextAmb = p.t + PENS_ANIMO_OGNI[0] + (this.rnd || Math.random)() * PENS_ANIMO_OGNI[1];
      if (left.length) { const i = PENS_ANIMO.indexOf(left[Math.floor((this.rnd || Math.random)() * left.length)]); p.seen['a' + i] = true; this.vgThink(PENS_ANIMO[i]); }
    }
  };

  const upd = P.vgUpdate;
  P.vgUpdate = function (dt) {
    upd.call(this, dt);
    if (this.mode === 'career' && this.s.vg && this.s.vg.on) this.vgPensTick(dt);
  };
})();

// ---------------------------------------------------------------- il testo sulla strada (solo nel browser)
// In basso, subito a destra della barra dell'autostrada (la mappa a barra, stretta apposta), sulla sua stessa riga e prima del
// bottone della corsia. Dove non c'è spazio (schermi stretti) sta in basso a destra, alzato sopra quello che occupa l'angolo
// (pedali al tocco, riquadro del cambio, bottone corsia). Ogni 150 ms ricalcola dove sono gli altri. Si nasconde col menu,
// il prologo o il telefono aperti.
(function testo() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  let el = null, mostrato = -1;
  const css = document.createElement('style');
  css.textContent = `.pensiero{position:absolute;right:12px;bottom:84px;width:max-content;max-width:clamp(160px,calc(50% - 232px),360px);text-align:right;pointer-events:none;z-index:6;
    font:italic 500 clamp(14px,1.7vw,21px)/1.4 "Barlow Semi Condensed",Georgia,serif;color:#f4ead2;letter-spacing:.01em;opacity:0;transform:translateY(6px);transition:opacity .7s ease,transform .7s ease;
    text-shadow:0 0 12px #000,0 0 3px #000,0 2px 5px #000}
    .pensiero.on{opacity:.95;transform:none}
    @media (prefers-reduced-motion:reduce){.pensiero{transition:none}}`;
  document.head.appendChild(css);
  const visibile = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return b.width < 1 || b.height < 1 ? null : b; };
  // dove mettere il testo: accanto alla barra se c'è spazio (almeno 200 px), altrimenti sopra l'angolo in basso a destra
  const posizione = (stage) => {
    const r = stage.getBoundingClientRect(), mm = visibile(document.querySelector('.minimap'));
    let fine = r.right - 12;                                             // il testo finisce prima dei comandi della metà destra (bottone corsia, pedali al tocco)
    for (const sel of ['.lanebtn.r', '.touchpedals']) { const b = visibile(document.querySelector(sel)); if (b && b.left > r.left + r.width / 2) fine = Math.min(fine, b.left - 28); }
    if (mm) {
      const libero = fine - (mm.right + 16);
      if (libero >= 200) return { accanto: true, left: Math.round(mm.right + 16 - r.left), bottom: Math.round(r.bottom - mm.bottom), maxW: Math.min(libero, 420) };
    }
    let top = r.bottom;                                                  // altrimenti: sopra il più alto tra gli elementi visibili della metà destra
    for (const sel of ['#hudG', '.touchpedals', '.lanebtn.r']) {
      const b = visibile(document.querySelector(sel)); if (!b || b.right < r.left + r.width / 2) continue;
      top = Math.min(top, b.top);
    }
    return { accanto: false, bottom: Math.max(14, Math.round(r.bottom - top + 12)) };
  };
  setInterval(() => {
    const NR = window.nightRun, g = NR && NR.game, th = g && g.thought; if (!th) return;
    const stage = document.getElementById('roadStage'); if (!stage) return;
    if (!el) { el = document.createElement('div'); el.className = 'pensiero'; el.setAttribute('aria-live', 'polite'); stage.appendChild(el); }
    if (th.id !== mostrato) { mostrato = th.id; el.textContent = th.text; }
    const p = posizione(stage), st = el.style;
    st.bottom = p.bottom + 'px';
    if (p.accanto) { st.left = p.left + 'px'; st.right = 'auto'; st.maxWidth = p.maxW + 'px'; st.textAlign = 'left'; }
    else { st.left = 'auto'; st.right = '12px'; st.maxWidth = ''; st.textAlign = ''; }
    const nascosto = (window.gameMenu && window.gameMenu.isOpen) || (window.NightPrologo && window.NightPrologo.playing) || (window.telefono && window.telefono.isOpen);
    el.classList.toggle('on', th.left > 0.8 && !nascosto);
  }, 150);
})();
if (typeof window !== 'undefined') Object.assign(window, { PENS_KM, PENS_BISOGNI, PENS_ANIMO, PENS_SOGLIE, PENS_STATO });
