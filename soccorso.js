// ============================================================================
//  Night Run · Il soccorso stradale (dopo garage.js, prima di documenti.js)
//  App Soccorso nel telefono (anche su cellulare): scegli uno o più servizi (rifornimento, carrozzeria, gomme, gomme
//  nuove, manutenzione), ognuno col suo prezzo vero (pieno = litri che mancano, carrozzeria = danni, ecc.) più
//  l'uscita del furgone. Premi «Chiama»: l'auto accosta e si ferma, il furgone (per ora il primo furgone del gioco:
//  `van`; in futuro un vero carro attrezzi) arriva da dietro, ti supera, si mette davanti con le quattro frecce e si
//  ferma. Il meccanico scende, fa i lavori uno dopo l'altro (martello, aria, olio, pompa) e intanto lo stato dell'auto
//  migliora davvero, poco per volta. Alla fine saluta, risale e il furgone riparte. Si paga a lavoro finito (il fido
//  di `GAME_FIDO` vale). Un riquadro con le barre di avanzamento (con «Accelera») resta sopra la strada.
//  Il furgone e il carro attrezzi sono di Nico (quello dell'Officina Nico, tagliandi e carrozzeria): è lui che scende e lavora (`SOC_LOOK`).
//  Traino (`SOC.traino`): con l'auto distrutta Nico ti aggancia con la catena e ti porta alla prossima Officina Nico (buio e arrivo, premi U per entrare); non se salti una consegna. Con l'assicurazione in regola (documenti.js) la carrozzeria costa la franchigia.
//  Stato: `game.soc` (solo mentre dura la chiamata, non si salva). Costanti in `SOC`, scena in `Street2D.socDraw`.
// ============================================================================
const SOC = {
  uscita: 40,            // € di uscita del furgone
  gomma: 30,             // € per ogni gomma sgonfia o forata sistemata
  vmax: 24,              // m/s del furgone mentre arriva (86 km/h)
  dec: 7,                // m/s² con cui frena davanti all'auto
  dist: 7.2,             // m da dove si ferma, davanti al centro dell'auto
  merge: 4.5,            // m davanti all'auto da cui cambia corsia
  walkV: 2.3,            // m/s del meccanico
  accel: 4.5,            // m/s² del furgone che riparte
  libera: 46,            // m di distanza a cui l'auto torna tua
  spot: { hood: 3.1, wheelF: 1.4, wheelR: -1.5, flap: -2.0 },   // dove lavora, in m dal centro dell'auto
  soglia: { oil: 0.85, plugs: 0.85, pads: 0.85 },               // sotto questo livello la manutenzione serve
  traino: { base: 60, perKm: 12, v: 13, dur: 5, danni: 0.6 },   // € di base e al km fino all'officina; m/s e secondi di strada col carro; danni da cui serve
};
const SOC_NOMI = { fuel: 'Rifornimento', body: 'Carrozzeria', tyres: 'Gonfia e ripara le gomme', newtyres: 'Gomme nuove', maint: 'Manutenzione', traino: 'Traino' };
// l'aspetto di Nico, il meccanico del furgone (lo stesso dell'interno dell'Officina Nico, LOOK.nico in interni_hd.js)
const SOC_LOOK = { pelle: 2, capelli: 'corti', capCol: 0, testa: 'cappellino', testaCol: 2, sopra: 'felpa', sopraCol: 1, barba: 'corta', occhiali: 'sole', x: { canotta: true, tatuaggi: true, catena: true } };

(function socLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  const cl = (x) => Math.max(0, Math.min(1, x));
  const ez = (p) => { p = cl(p); return p * p * (3 - 2 * p); };
  const PRICE = () => (typeof GAME_FUEL_PRICE !== 'undefined' ? GAME_FUEL_PRICE : 1.95);
  const career = (g) => g.mode === 'career';
  const MAINT = ['oil', 'plugs', 'pads'];

  // i servizi di adesso con prezzo e motivo se non servono: [{ id, name, info, price, ok, why }]
  P.socServizi = function () {
    const sim = this.sim, c = career(this), out = [];
    const miss = Math.max(0, (1 - sim.fuel) * sim.P.tank), pct = Math.round(sim.fuel * 100);
    out.push({ id: 'fuel', name: SOC_NOMI.fuel, ok: miss >= 1.5, price: c ? Math.round(miss * PRICE()) : 0,
      info: miss >= 1.5 ? `${Math.round(miss)} litri per il pieno · serbatoio al ${pct} %` : 'Il serbatoio è già pieno', litri: miss });
    const dm = sim.damage || 0;
    const bp = c ? this.repairCost() : 0, bf = c && this.repairCostFull ? this.repairCostFull() : bp;
    out.push({ id: 'body', name: SOC_NOMI.body, ok: dm >= 0.01, price: bp, full: bf,
      info: dm >= 0.01 ? `danni al ${Math.round(dm * 100)} %${bf > bp ? ` · assicurazione: paghi € ${bp} di franchigia` : ''}` : 'La carrozzeria è a posto' });
    const T = this.tyres(), bad = [0, 1, 2, 3].filter((i) => T.p[i] < 1.9 || T.leak[i] > 0.001);
    out.push({ id: 'tyres', name: SOC_NOMI.tyres, ok: bad.length > 0, price: c ? bad.length * SOC.gomma : 0, bad,
      info: bad.length ? `${bad.length} ${bad.length === 1 ? 'gomma sgonfia o forata' : 'gomme sgonfie o forate'}` : 'Le gomme sono gonfie e sane' });
    const w = sim.tireWear || 0;
    out.push({ id: 'newtyres', name: SOC_NOMI.newtyres, ok: w >= 0.2, price: c ? this.tireCost() : 0,
      info: w >= 0.2 ? `usura al ${Math.round(w * 100)} %` : 'Le gomme sono ancora buone' });
    const m = this.maint(), need = MAINT.filter((k) => m[k] < SOC.soglia[k]);
    const NM = { oil: 'olio', plugs: 'candele', pads: 'freni' };
    out.push({ id: 'maint', name: SOC_NOMI.maint, ok: need.length > 0, price: c ? need.reduce((a, k) => a + this.serviceCost(k), 0) : 0, keys: need,
      info: need.length ? need.map((k) => `${NM[k]} ${Math.round(m[k] * 100)} %`).join(' · ') : 'Olio, candele e freni sono a posto' });
    const tw = this.socTraino();
    out.push({ id: 'traino', name: 'Carro attrezzi di Nico', ok: tw.ok, price: c ? tw.price : 0, info: tw.info, dest: tw.dest, st: tw.st });
    return out;
  };
  // il carro attrezzi di Nico: con la carrozzeria distrutta ti porta alla prossima Officina Nico
  P.socTraino = function () {
    const no = (info) => ({ ok: false, info, price: 0 });
    if (typeof VG === 'undefined' || !this.s.vg) return no('Il traino serve solo nel Viaggio');
    const dm = this.sim.damage || 0;
    if (dm < SOC.traino.danni) return no('L\'auto cammina ancora: il carro attrezzi serve con la carrozzeria distrutta');
    const dest = 'niko', d = this.s.dist, n0 = Math.max(0, VG.stopIndex(d)); let st = null;
    for (let n = n0; n < n0 + 40; n++) { const q = VG.stop(n); if (q.x > d + 60 && q.id === dest) { st = q; break; } }
    if (!st) return no('Nessuna officina davanti');
    const km = (st.x - d) / 1000, nome = 'all\'Officina Nico';
    const price = Math.round((SOC.traino.base + SOC.traino.perKm * km) / 5) * 5, gl = this.vgGoal && this.vgGoal();
    const carico = this.s.trunk.some((it) => (it.to !== undefined && it.pay !== undefined) || it.kind === 'missione' || it.first);   // solo se hai una consegna in corso (andare a una bacheca non si perde)
    if (carico && gl && gl.x != null && gl.x > d && gl.x < st.x) return no(`Hai una consegna prima di arrivare ${nome}: col traino la salteresti`);
    return { ok: true, dest, st, price, info: `Auto distrutta: Nico ti porta ${nome}, a ${km.toFixed(1).replace('.', ',')} km. Poi scegli tu` };
  };
  P.socTotale = function (ids) {
    if (ids.includes('traino')) ids = ['traino'];                                // il traino sostituisce tutto: i lavori si fanno in officina
    const sv = this.socServizi().filter((s) => ids.includes(s.id) && s.ok), tw = sv.some((s) => s.id === 'traino'), u = career(this) && !tw ? SOC.uscita : 0;
    return { sv, servizi: sv.reduce((a, s) => a + s.price, 0), uscita: u, total: sv.reduce((a, s) => a + s.price, 0) + u };
  };
  // si può chiamare adesso? (null = sì, altrimenti il motivo)
  P.socPuoi = function () {
    if (this.soc) return 'Il furgone è già in arrivo';
    if (this.inside) return 'Il furgone si chiama dalla strada, non da dentro un locale';
    if (this.prompt) return 'Prima rispondi alla domanda';
    if (this.ap) return 'Aspetta: l\'auto sta finendo una manovra';
    if (this.sim.v < -0.5) return 'Fermati prima di chiamare';
    return null;
  };

  // chiama il furgone con i servizi scelti: l'auto accosta e si ferma, poi arriva
  P.socCall = function (ids) {
    const why = this.socPuoi(); if (why) return { ok: false, why };
    const T = this.socTotale(ids || []);
    if (!T.sv.length) return { ok: false, why: 'Scegli almeno un servizio' };
    if (career(this) && T.total > this.s.money + (typeof GAME_FIDO !== 'undefined' ? GAME_FIDO : 0)) return { ok: false, why: `Costa € ${T.total}: non bastano nemmeno i soldi e il fido` };
    this.soc = { ph: 'brake', t: 0, still: 0, stopped: false, fast: 1, total: T.total, spent: 0, L: this.lane,
      sv: T.sv.map((s) => ({ id: s.id, name: s.name, price: s.price, full: s.full, bad: s.bad, keys: s.keys, litri: s.litri, st: s.st, dest: s.dest, p: 0, paid: false })) };
    this.lane = 3; this.manualT = 0;                                                       // si accosta nella corsia più a destra, la più vicina ai bordi: dà meno fastidio al traffico
    this.stopAt(null, () => { if (this.soc) this.soc.stopped = true; });
    this.ap.enter = true;                                                                 // cambio di corsia deciso, come davanti a un locale
    this.say(Math.abs(this.sim.v) > 0.5 ? 'Hai chiamato Nico: accosto e aspetto il furgone' : 'Hai chiamato Nico: il furgone sta arrivando', 'info');
    return { ok: true, total: T.total };
  };
  P.socAnnulla = function (testo) {
    const S = this.soc; if (!S) return;
    if (S.van) { S.van.soc = false; S.van.still = false; S.van.hazard = false; S.van.vBase = S.van.vT = Math.max(S.van.v || 0, 12); }
    this.soc = null; this.ap = null; if (testo) this.say(testo, 'bad');
  };

  // il furgone nasce dietro e ci passa accanto: la corsia vicina alla nostra
  P.socSpawn = function () {
    const S = this.soc, d = this.s.dist, L = S.L = this.lane || 1;
    const A = L === 2 ? 1 : 2;
    S.tx = d + SOC.dist;
    S.van = { id: this.id++, kind: 'traffic', vt: 'van', len: 4.3, lane: A, x: d - 110, v: SOC.vmax, vT: 0, vBase: 0, color: 'orig', still: true, soc: true, hazard: false, rescue: true };
    this.ents.push(S.van); S.ph = 'come'; S.t = 0;
  };

  // il copione del meccanico: scende, va ai punti di lavoro nell'ordine che costa meno strada, saluta, torna
  P.socPlan = function () {
    const S = this.soc, d = this.s.dist, SP = {}, door = S.tx + 0.55, segs = [];
    for (const k of Object.keys(SOC.spot)) SP[k] = d + SOC.spot[k];                    // metri assoluti sulla strada
    let t = 0, pos = door;
    const walk = (to) => { const dur = Math.max(0.3, Math.abs(to - pos) / SOC.walkV); segs.push({ k: 'walk', t0: t, t1: t + dur, from: pos, to }); t += dur; pos = to; };
    const work = (id, at, dur, p0, p1, kind) => { if (Math.abs(pos - at) > 0.05) walk(at); segs.push({ k: 'work', id, kind: kind || id, at, t0: t, t1: t + dur, p0, p1 }); t += dur; };
    segs.push({ k: 'out', t0: 0, t1: 0.9, at: door }); t = 0.9;
    const by = (id) => S.sv.find((s) => s.id === id);
    if (by('traino')) work('traino', SP.hood, 3, 0, 1);
    if (by('body')) work('body', SP.hood, 5.5, 0, 1);
    if (by('maint')) work('maint', SP.hood, 4.5, 0, 1);
    if (by('tyres')) { work('tyres', SP.wheelF, 2.2, 0, 0.5); work('tyres', SP.wheelR, 2.2, 0.5, 1); }
    if (by('newtyres')) { work('newtyres', SP.wheelF, 3.2, 0, 0.5); work('newtyres', SP.wheelR, 3.2, 0.5, 1); }
    if (by('fuel')) work('fuel', SP.flap, Math.max(4, Math.min(9, 3 + by('fuel').litri / 6)), 0, 1);
    segs.push({ k: 'wave', t0: t, t1: t + 1.2, at: pos }); t += 1.2;
    walk(door);
    segs.push({ k: 'in', t0: t, t1: t + 0.6, at: door }); t += 0.6;
    S.seq = { segs, end: t }; S.mt = 0; S.ph = 'work';
  };

  // aggiorna lo stato vero dell'auto a seconda dell'avanzamento di un servizio (0..1)
  P.socApplica = function (sv, p) {
    if (p <= 0) return;
    const sim = this.sim, e = ez(p), s0 = sv.s0 || (sv.s0 = {});
    if (sv.id === 'fuel') {
      if (s0.f === undefined) s0.f = sim.fuel;
      sim.fuel = Math.min(1, s0.f + (1 - s0.f) * e); if (sim.fuel > 0.004) sim.dry = false;
    } else if (sv.id === 'body') {
      if (s0.d === undefined) s0.d = sim.damage;
      sim.damage = s0.d * (1 - e);
    } else if (sv.id === 'tyres') {
      const T = this.tyres(); if (!s0.p) s0.p = T.p.slice();
      for (const i of sv.bad || []) { T.leak[i] = 0; T.p[i] = s0.p[i] + (2.3 - s0.p[i]) * e; }
    } else if (sv.id === 'newtyres') {
      if (s0.w === undefined) s0.w = sim.tireWear || 0;
      sim.tireWear = s0.w * (1 - e); if (p >= 1) sim.tireT = 24;
    } else if (sv.id === 'maint') {
      const m = this.maint(); if (!s0.m) s0.m = { oil: m.oil, plugs: m.plugs, pads: m.pads };
      for (const k of sv.keys || []) m[k] = s0.m[k] + (1 - s0.m[k]) * e;
    }
  };
  const FATTO = { traino: 'Traino fatto', fuel: 'Pieno fatto', body: 'Carrozzeria sistemata', tyres: 'Gomme gonfie e a posto', newtyres: 'Gomme nuove montate', maint: 'Manutenzione fatta' };
  P.socPaga = function (sv) {
    if (sv.paid) return; sv.paid = true;
    this.s.money -= sv.price; this.soc.spent += sv.price;
    this.say(`${FATTO[sv.id]}${sv.price ? `: − € ${sv.price}` : ''}`, 'buy');
    if (sv.id === 'body' && sv.full > sv.price && this.docSinistro) this.docSinistro(sv.full - sv.price);   // l'assicurazione ha coperto: è un sinistro (documenti.js)
  };

  P.socStep = function (dt) {
    const S = this.soc, d = this.s.dist;
    S.t += dt;
    if (S.van && !this.ents.includes(S.van)) return this.socAnnulla();                     // la partita è ripartita: niente furgoni fantasma
    if (S.ph !== 'brake' && S.ph !== 'libera' && !this.ap) this.stopAt(null, null);       // l'auto resta ferma finché lavorano
    if (S.ph === 'brake') {
      if (S.stopped && Math.abs(this.sim.v) < 0.4) { S.still += dt; if (S.still > 0.8) this.socSpawn(); }
      else S.still = 0;
      if (S.t > 30) this.socAnnulla('Non riesco a fermarmi qui: il furgone non può raggiungerti. Riprova.');
    } else if (S.ph === 'come') {
      const e = S.van, rem = S.tx - e.x;
      if (rem < 0.12 || S.t > 25) { e.v = 0; e.x = S.tx; S.pt = (S.pt || 0) + dt; } else e.v = Math.min(SOC.vmax, Math.sqrt(2 * SOC.dec * rem));
      if (e.x - d > SOC.merge && e.lane !== S.L) e.lane = S.L;
      if (rem < 45) e.hazard = true;
      if (S.pt > 0.7) {
        const sett = e._z === undefined || Math.abs(e._z - GAME_LANE_Z[S.L]) < 0.3;
        if (sett || S.pt > 3) { e.lane = S.L; e.hazard = true; this.say('Il furgone di Nico è arrivato', 'info'); if (this.diaAdd && !S.sv.some((x) => x.id === 'traino')) this.diaAdd('soc', 'Soccorso stradale: il furgone ti raggiunge', true); this.socPlan(); }
      }
    } else if (S.ph === 'work') {
      S.mt += dt;
      for (const sv of S.sv) {
        let p = 0;
        for (const g of S.seq.segs) if (g.k === 'work' && g.id === sv.id && S.mt >= g.t0) p = Math.max(p, g.p0 + (g.p1 - g.p0) * cl((S.mt - g.t0) / (g.t1 - g.t0)));
        sv.p = p; this.socApplica(sv, p); if (p >= 1 && sv.id !== 'traino') this.socPaga(sv);
      }
      if (S.mt >= S.seq.end && S.sv.some((s) => s.id === 'traino')) { S.ph = 'tow'; S.t = 0; S.dark = 0; if (this.diaAdd) this.diaAdd('soc', 'Il furgone ti aggancia e ti porta via', true); }
      else if (S.mt >= S.seq.end) {
        S.ph = 'leave'; S.t = 0;
        const u = career(this) ? SOC.uscita : 0; this.s.money -= u; S.spent += u;
        this.say(`Soccorso: tutto fatto${S.spent ? `, in tutto − € ${S.spent}` : ''}`, 'buy');
        if (this.diaAdd) this.diaAdd('soc', `Soccorso: ${S.sv.map((x) => x.name.toLowerCase()).join(', ')}${S.spent ? ` (€ ${S.spent})` : ''}`);
        if (!this.sim.running && S.sv.some((s) => s.id === 'fuel')) this.say('Riavvia il motore: il serbatoio è pieno', 'fuel');
      }
    } else if (S.ph === 'tow') {                                                          // si va insieme (l'auto viene trainata), poi buio e si arriva
      const e = S.van, tw = SOC.traino, v = tw.v * Math.min(1, S.t / 1.2);
      e.v = v; this.s.dist += v * dt; e.x = this.s.dist + SOC.dist; S.dark = cl((S.t - tw.dur) / 0.7);
      if (S.t >= tw.dur + 0.7) {
        const sv = S.sv.find((x) => x.id === 'traino'), tgt = sv.st.x - 22;
        this.socPaga(sv);
        this.s.dist = tgt; this.s.far = Math.max(this.s.far || 0, tgt); this.nextTraffic = 0;
        this.ents = this.ents.filter((x) => x === e); e.x = tgt + SOC.dist; e.v = 0;
        this.say('Nico ti ha lasciato davanti all\'officina: premi U per entrare', 'info');
        if (this.diaAdd) this.diaAdd('soc', 'Col carro attrezzi di Nico fino all\'Officina Nico', true);
        S.ph = 'arrivo'; S.t = 0;
      }
    } else if (S.ph === 'arrivo') {
      S.dark = 1 - cl(S.t / 0.8); if (S.t > 1) { S.ph = 'leave'; S.t = 0; S.dark = 0; }
    } else if (S.ph === 'leave') {
      const e = S.van; e.v = Math.min(SOC.vmax, (e.v || 0) + SOC.accel * dt); if (e.v > 5) e.hazard = false;
      if (e.x - d > SOC.libera || S.t > 25) {                                              // lontano: l'auto è di nuovo tua e il furgone è traffico normale
        e.soc = false; e.still = false; e.hazard = false; e.vBase = e.vT = Math.max(e.v, 16);
        this.ap = null; this.soc = null;
      }
    }
  };
  const up = P.update;
  P.update = function (dt) { up.call(this, dt); if (this.soc) this.socStep(dt * (this.soc.fast || 1)); else this.socGuasto(); };
  // da fermo con una gomma a terra il gioco ti ricorda il soccorso, una volta per guasto
  P.socGuasto = function () {
    if (this.mode !== 'career' || !this.s.vg || this.prompt || this.inside || this.ap || Math.abs(this.sim.v) > 0.5) return;
    const T = this.tyres(), key = Math.min(...T.p) < 0.5 ? 'gomma' : null;
    if (!key) { this._socAsk = null; return; }
    if (this._socAsk === key) return; this._socAsk = key;
    this.ask({ kind: 'soccorso', title: 'Gomma a terra', time: 30,
      text: 'Una gomma è a terra. Nico arriva col furgone e te la sistema sul posto.',
      options: [{ label: 'Chiama il soccorso (app)', act: () => { if (typeof window !== 'undefined') { if (window.socPre) window.socPre(['tyres']); if (window.telefono && window.telefono.show) window.telefono.show('soc'); } } }, { label: 'Lascio stare', act: () => {} }],
      onTimeout: () => {} });
  };
})();

if (typeof window !== 'undefined') Object.assign(window, { SOC, SOC_NOMI, SOC_LOOK });

// ---------------------------------------------------------------- la scena sulla strada (solo nel browser)
(function socScena() {
  if (typeof Street2D === 'undefined' || typeof document === 'undefined') return;
  const P = Street2D.prototype;
  const cl = (x) => Math.max(0, Math.min(1, x));
  const up = P.update;
  P.update = function (dt, s, game) {
    const S = game && game.soc; this._soc = S || null; this._socG = game || null;
    // inquadratura: l'auto si sposta a sinistra per far stare tutto il furgone nello schermo (come davanti a un locale)
    let hold = false;
    if (S && S.ph !== 'brake' && !this.camHold) { const prev = this.st.cam; this.camHold = (cam) => { const b = prev ?? cam; return b + (0.31 - b) * Math.min(1, dt * 1.6); }; hold = true; }
    try { return up.call(this, dt, s, game); } finally { if (hold) this.camHold = null; }
  };
  const pr = P.present;
  P.present = function (...a) {
    if (this._soc && this.g && this.carPos) { try { this.socDraw(this.g, this._soc, this._socG); } catch (err) { /* niente scena */ } }
    const r = pr.apply(this, a), k = this._soc && this._soc.dark;
    if (k > 0.001 && this.visible && this.ctx) { const c = this.ctx; c.save(); c.globalAlpha = Math.min(1, k); c.fillStyle = '#04060b'; c.fillRect(0, 0, this.canvas.width, this.canvas.height); c.restore(); }   // il buio del traino
    return r;
  };

  const ink = '#10121c';
  // dove sta il meccanico adesso: { x (m), pose, a, dir, kneel, seg }
  function man(S) {
    if (S.ph !== 'work' || !S.seq) return null;
    const mt = S.mt, segs = S.seq.segs;
    const g = segs.find((q) => mt >= q.t0 && mt < q.t1) || segs[segs.length - 1];
    const u = cl((mt - g.t0) / Math.max(0.001, g.t1 - g.t0));
    if (g.k === 'out') return { x: g.at, a: u, dir: -1, walk: false, seg: g, u };
    if (g.k === 'in') return { x: g.at, a: 1 - u, dir: 1, walk: false, seg: g, u };
    if (g.k === 'walk') { const e = u * u * (3 - 2 * u), f = g.from + (g.to - g.from) * e; return { x: f, a: 1, dir: Math.sign(g.to - g.from) || 1, walk: true, ph: Math.abs(g.to - g.from) * e / 1.1, seg: g, u }; }
    return { x: g.at, a: 1, dir: g.k === 'wave' ? 1 : -1, walk: false, pose: g.k === 'wave' ? 'wave' : 'idle', kneel: g.k === 'work' && (g.kind === 'tyres' || g.kind === 'newtyres'), seg: g, u };
  }

  P.socDraw = function (g, S, game) {
    const st = this.st, PPM = 30, cp = this.carPos, dist = game.s.dist, t = st.t, SX = (m) => Math.round(cp.x + (m - dist) * PPM);
    const e = S.van, sc0 = e && e._scr;
    // il furgone: lampeggiante sul tetto e la scritta sulla fiancata
    if (e && sc0 && e.x - dist > -40 && e.x - dist < 40) {
      const ph = Math.floor(t * 6) % 2, bx = Math.round(sc0.left + sc0.w * 0.46), by = sc0.sy + 1;
      g.fillStyle = ink; g.fillRect(bx - 7, by, 15, 3);
      g.fillStyle = ph ? '#ffb020' : '#7a4a08'; g.fillRect(bx - 6, by - 2, 6, 3);
      g.fillStyle = ph ? '#7a4a08' : '#ffb020'; g.fillRect(bx + 1, by - 2, 6, 3);
      this.light(g, bx + (ph ? -3 : 4), by, 46, 22, '#ffa020', 0.22, 3); this.light(g, bx + (ph ? -3 : 4), by + 14, 90, 8, '#ffa020', 0.08, 3);
      if (this.lightAdd) this.lightAdd(bx, by, 130, 50, '255,170,40', ph ? 0.5 : 0.3);
      const tx = Math.round(sc0.left + sc0.w * 0.13), ty = Math.round(sc0.sy + sc0.h * 0.5);
      this.text(g, 'SOCCORSO', tx + 1, ty + 1, ink, 1); this.text(g, 'SOCCORSO', tx, ty, '#ff9f1a', 1);
    }
    const tw = S.sv && S.sv.some((x) => x.id === 'traino');
    if (tw && e && sc0 && (S.ph === 'tow' || (S.ph === 'work' && S.seq && S.mt > 1.5))) {      // la catena dal muso dell'auto alla coda del furgone
      const ax = Math.round(sc0.left + 3), ay = Math.round(sc0.y - 12 * (sc0.k || 1)), bx = SX(dist + 2.25), by = Math.round(this.laneY(this.st.lz) - 11);
      for (let i = 0; i <= 22; i++) { const u = i / 22, X = Math.round(ax + (bx - ax) * u), Y = Math.round(ay + (by - ay) * u + Math.sin(u * Math.PI) * 4);
        g.fillStyle = ink; g.fillRect(X - 1, Y - 1, 4, 3); g.fillStyle = i % 2 ? '#9aa3b8' : '#5a6070'; g.fillRect(X, Y, 2, 1); }
    }
    const m = man(S); if (!m) return;
    const hy = this.laneY(this.st.lz), k = 0.47 * (this.laneS ? this.laneS(hy) / this.laneS(240) : 1);
    const px = SX(m.x), py = Math.round(hy + 6);                                      // i piedi: sul lato vicino all'auto
    const seg = m.seg, work = seg.k === 'work', bob = work ? Math.sin(t * 14) * 1.2 : 0;
    // effetti del lavoro
    if (work) {
      const hx = px + m.dir * 11, hyy = py - 20 + bob, T6 = t * 6;
      if (seg.kind === 'body') {
        for (let i = 0; i < 7; i++) { const ph = (t * 5 + i * 0.29) % 1; g.fillStyle = i % 2 ? '#ffd23f' : '#fff3b0'; g.fillRect(Math.round(hx + m.dir * (ph * 12 + i % 3)), Math.round(hyy - 2 + ph * ph * 16 - (1 - ph) * 6), 1, 1); }
        this.light(g, hx, hyy, 22, 12, '#ffcf5a', Math.floor(t * 9) % 2 ? 0.2 : 0.06, 3);
        const b = Math.floor(t / 0.9); if (this._socB !== b) { this._socB = b; this.comic(b % 2 ? 'CLANG!' : 'TOC TOC', hx, hyy - 18, '#ffd23f', 2); }
      } else if (seg.kind === 'tyres' || seg.kind === 'newtyres') {
        for (let i = 0; i < 5; i++) { const ph = (t * 2.2 + i * 0.21) % 1; g.fillStyle = `rgba(230,236,255,${0.5 * (1 - ph)})`; g.fillRect(Math.round(px + m.dir * (8 + ph * 7)), Math.round(py - 7 - ph * 12), 2 + (i % 2), 2); }
        const b = Math.floor(t / 1.1); if (this._socB !== b) { this._socB = b; this.comic(seg.kind === 'tyres' ? 'PSSSSSS' : 'TAC TAC TAC', px + m.dir * 14, py - 30, '#e8f0ff', 2); }
      } else if (seg.kind === 'maint') {
        g.fillStyle = '#d9a021'; g.fillRect(hx, Math.round(hyy), 2, Math.round(14 + Math.sin(T6) * 2)); g.fillRect(hx - 1, Math.round(hyy), 4, 1);
        this.light(g, hx, hyy + 8, 14, 8, '#e0a020', 0.1, 3);
        const b = Math.floor(t / 1.3); if (this._socB !== b) { this._socB = b; this.comic('GLUG GLUG', hx, hyy - 16, '#ffcf5a', 2); }
      } else if (seg.kind === 'fuel') {
        // tubo dalla coda del furgone al bocchettone, a festone
        const fx = SX(dist + SOC.spot.flap + 0.1), fy = Math.round(hy - 17 * (cp.k || 1)), e2 = S.van && S.van._scr;
        if (e2) {
          const ax = e2.left + 3, ay = Math.round(e2.y - 10 * (e2.k || 1));
          for (let i = 0; i <= 28; i++) { const u = i / 28, X = Math.round(ax + (fx - ax) * u), Y = Math.round(ay + (fy - ay) * u + Math.sin(u * Math.PI) * 14);
            g.fillStyle = ink; g.fillRect(X - 1, Y - 1, 4, 4); g.fillStyle = '#3a3d4c'; g.fillRect(X, Y, 2, 2); }
        }
        const b = Math.floor(t / 1.2); if (this._socB !== b) { this._socB = b; this.comic('GLUG GLUG', fx, fy - 16, '#ffcf5a', 2); }
        this.light(g, fx, fy, 14, 8, '#ffcf5a', 0.12, 3);
      }
    }
    if (m.a <= 0.01 || typeof pgStanding !== 'function') return;
    g.save(); g.globalAlpha = m.a;
    if (m.kneel) { g.translate(0, py); g.scale(1, 0.8); g.translate(0, -py); }
    if (m.dir < 0) { g.translate(px * 2, 0); g.scale(-1, 1); }
    pgStanding(g, px, Math.round(py + bob), k * (1 - 0.1 * (seg.k === 'in' ? m.u : 0)), m.ph || 0, !!m.walk, SOC_LOOK, 0.12, t, m.pose);
    g.restore();
  };
})();

// ---------------------------------------------------------------- riquadro sulla strada e app nel telefono (solo nel browser)
(function socInterfaccia() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const G = () => window.nightRun && window.nightRun.game;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sel = new Set();

  // ---- riquadro con le barre di avanzamento (mentre dura la chiamata)
  const css = document.createElement('style');
  css.textContent = `#socBox{position:absolute;left:50%;top:96px;transform:translateX(-50%);z-index:6;width:min(92vw,340px);padding:10px 12px 11px;border-radius:14px;background:rgba(10,14,28,.88);border:1px solid #ffb02055;box-shadow:0 8px 26px #000a;color:#eef;font:600 12px system-ui,sans-serif;display:none;pointer-events:auto}
#socBox.on{display:block;animation:socIn .2s ease-out}@keyframes socIn{from{opacity:0;transform:translate(-50%,-8px)}to{opacity:1;transform:translate(-50%,0)}}
#socBox h4{margin:0 0 2px;font:800 13px system-ui;color:#ffb020;letter-spacing:.04em;text-transform:uppercase;display:flex;justify-content:space-between;align-items:center;gap:8px}
#socBox .st{color:#c9cfe8;margin-bottom:7px}#socBox .r{display:grid;grid-template-columns:1fr auto;gap:2px 8px;margin-top:5px}
#socBox .r i{grid-column:1/3;display:block;height:6px;border-radius:3px;background:#ffffff1c;overflow:hidden}#socBox .r u{display:block;height:100%;background:linear-gradient(90deg,#ffb020,#ffd86a);transition:width .25s}
#socBox .r.ok u{background:#2fd16a}#socBox .r span:last-child{color:#9fb0d8}
#socBox button{font:800 11px system-ui;border:0;border-radius:9px;padding:5px 10px;background:#ffb020;color:#2a1600;cursor:pointer}#socBox button.x{background:#ffffff22;color:#fff}`;
  document.head.appendChild(css);
  let box = null, last = '';
  const STATO = { brake: 'Accosto e mi fermo…', come: 'Il furgone di Nico sta arrivando…', work: 'Nico sta lavorando', tow: 'Il carro attrezzi di Nico ti porta via…', arrivo: 'Arrivati', leave: 'Fatto: il furgone riparte' };
  function paint() {
    const g = G(), S = g && g.soc;
    if (!box) { const host = document.getElementById('roadStage') || document.body; box = document.createElement('div'); box.id = 'socBox'; host.appendChild(box); box.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; const gg = G(); if (gg && gg.soc) { gg.soc.fast = gg.soc.fast > 1 ? 1 : 4; last = ''; paint(); } }); }
    if (!S) { if (box.classList.contains('on')) box.classList.remove('on'); last = ''; return; }
    const html = `<h4><span>Soccorso stradale</span><button type="button" class="${S.fast > 1 ? '' : 'x'}">${S.fast > 1 ? 'Velocità normale' : 'Accelera ×4'}</button></h4><div class="st">${STATO[S.ph] || ''}</div>`
      + S.sv.map((v) => `<div class="r ${v.p >= 1 ? 'ok' : ''}"><span>${esc(v.name)}</span><span>${v.p >= 1 ? 'fatto ✓' : v.price ? '€ ' + fmt(v.price) : ''}</span><i><u style="width:${Math.round(v.p * 100)}%"></u></i></div>`).join('');
    if (html !== last) { last = html; box.innerHTML = html; }
    box.classList.add('on');
  }
  setInterval(paint, 200);
  window.addEventListener('keydown', (e) => { const g = G(); if (g && g.soc && (e.key === 'u' || e.key === 'U') && !e.repeat) { g.soc.fast = g.soc.fast > 1 ? 1 : 4; last = ''; } });

  // ---- app Soccorso nel telefono
  const CSS = `
.sc-hd{background:linear-gradient(135deg,#5a2a08,#1a0e06);border-radius:16px;padding:10px 12px;margin-bottom:8px;font-size:12px;color:var(--t2)}.sc-hd b{display:block;font:800 16px system-ui;color:#fff}
.sc-it{display:grid;grid-template-columns:26px 1fr auto;gap:10px;align-items:center;width:100%;text-align:left;padding:10px 10px;margin-bottom:6px;border-radius:14px;border:1px solid #ffffff18;background:#ffffff0d;color:#fff;cursor:pointer}
.sc-it.on{border-color:#ffb020;background:#ffb02022}.sc-it[disabled]{opacity:.45;cursor:default}
.sc-ck{width:22px;height:22px;border-radius:7px;border:2px solid #ffffff55;display:grid;place-items:center;font-size:14px;color:#2a1600}.sc-it.on .sc-ck{background:#ffb020;border-color:#ffb020}
.sc-it b{display:block;font-size:13.5px}.sc-it small{display:block;color:var(--t2);font-size:11.5px;margin-top:1px}.sc-pr{font:800 14px system-ui;color:#b8ff3a;white-space:nowrap}.sc-it[disabled] .sc-pr{color:var(--t2)}
.sc-sum{margin-top:10px;padding:10px 12px;border-radius:14px;background:#ffffff10;font-size:12.5px}.sc-sum div{display:flex;justify-content:space-between;margin:2px 0}.sc-sum .t{font:800 16px system-ui;border-top:1px solid #ffffff22;padding-top:6px;margin-top:5px}
.sc-go{display:block;width:100%;margin-top:10px;padding:13px;border:0;border-radius:14px;font:800 15px system-ui;background:linear-gradient(145deg,#ffb347,#e8590c);color:#2a1000;cursor:pointer}.sc-go[disabled]{opacity:.4;cursor:default}
.sc-no{margin-top:8px;font-size:12px;color:#ffb347;text-align:center}`;
  function render() {
    const g = G(); if (!g || !g.s) return '';
    const sv = g.socServizi(), T = g.socTotale([...sel]), why = g.socPuoi();
    for (const id of [...sel]) { const s = sv.find((x) => x.id === id); if (!s || !s.ok) sel.delete(id); }
    const money = Math.floor(g.s.money);
    const items = sv.map((s) => `<button class="sc-it ${sel.has(s.id) ? 'on' : ''}" data-x="t" data-id="${s.id}" ${s.ok ? '' : 'disabled'}><span class="sc-ck">${sel.has(s.id) ? '✓' : ''}</span><span><b>${esc(s.name)}</b><small>${esc(s.info)}</small></span><span class="sc-pr">${s.ok ? '€ ' + fmt(s.price) : '—'}</span></button>`).join('');
    const S = g.soc;
    if (S) return `<div class="view app"><div class="nav"><h3>Soccorso</h3></div><div class="body"><div class="sc-hd"><b>Il furgone è in arrivo</b>${esc(STATO[S.ph] || '')}. Guarda la strada.</div></div></div>`;
    return `<div class="view app"><div class="nav"><h3>Soccorso</h3></div><div class="body">
      <div class="sc-hd"><b>Furgone del soccorso</b>Scegli cosa ti serve: arriva, ti si ferma davanti con le quattro frecce e lavora sul posto. Paghi a lavoro finito (hai € ${fmt(money)}).</div>
      ${items}
      <div class="sc-sum"><div><span>Uscita del furgone</span><span>€ ${fmt(T.uscita)}</span></div><div><span>Servizi scelti (${T.sv.length})</span><span>€ ${fmt(T.servizi)}</span></div><div class="t"><span>Totale</span><span>€ ${fmt(T.total)}</span></div></div>
      <button class="sc-go" data-x="call" ${T.sv.length && !why ? '' : 'disabled'}>Chiama il furgone</button>
      ${why ? `<div class="sc-no">${esc(why)}</div>` : ''}
    </div></div>`;
  }
  function click(D) {
    const g = G(); if (!g) return;
    if (D.x === 't') { if (sel.has(D.id)) sel.delete(D.id); else if (D.id === 'traino') { sel.clear(); sel.add(D.id); } else { sel.delete('traino'); sel.add(D.id); } }
    else if (D.x === 'call') {
      const r = g.socCall([...sel]);
      if (!r.ok) g.say(r.why, 'bad'); else { sel.clear(); if (window.telefono.close) window.telefono.close(); }
    }
    window.telefono.render();
  }
  window.socPre = (ids) => { sel.clear(); for (const i of ids) sel.add(i); };                // la domanda del guasto sceglie il servizio giusto
  const add = () => {
    if (!window.telefono || !window.telefono.addApp) return false;
    window.telefono.addApp({ id: 'soc', name: 'Soccorso', color: 'linear-gradient(145deg,#ffb347,#c2410c)', css: CSS,
      icon: '<path d="M2 16V8h10v8"/><path d="M12 11h4.5l3.5 3v2h-8"/><circle cx="6.5" cy="17.2" r="1.8"/><circle cx="16" cy="17.2" r="1.8"/><path d="M5 5.5l1-2 1 2"/>', render, click });
    if (window.telefono.install) window.telefono.install('soc');
    return true;
  };
  if (!add()) addEventListener('load', add);
})();
