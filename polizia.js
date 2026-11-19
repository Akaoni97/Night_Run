// ============================================================================
//  Night Run · Polizia (dopo documenti.js)
//  Tutto quello che fa la polizia oltre alla multa di velocità di base (game.js: GAME_SPEED_LIMIT, speedFine):
//  - FERMO (polStop): velocità, posto di controllo, etilometro, pattuglia in coda. L'agente controlla anche i documenti
//    (documenti.js): con l'assicurazione scaduta la paghi lì, oltre alla multa. Tre risposte: Paga, Contesta, Scappa.
//  - CONTESTA: scegli una scusa tra tre (POL_SCUSE); ognuna ha le sue probabilità: annullata, ridotta, confermata, peggio.
//  - SCAPPA: inseguimento (this.pol.ch): la volante parte dopo qualche secondo e prova a raggiungerti. Se la distanzi
//    di 450 m, o ti infili in un locale con un po' di vantaggio, o resisti 75 s, l'hai seminata (ricercato +2, e a volte
//    un posto di blocco più avanti). Se ti affianca, fermo con multa grossa.
//  - AUTOVELOX e TUTOR (s.pol.ctl): pochi, a volte niente per 7-12 km. Cartello 500 m prima, segnati sulla mappa in
//    basso. Il verbale arriva sul telefono qualche km dopo (s.pol.verb).
//  - PATTUGLIA IN CODA: ogni tanto una volante ti si mette dietro per un paio di km; se passi i 136 ti ferma.
//  - ETILOMETRO: al bar si bevono alcolici (s.vg.alc, grammi per litro). Un bar su cinque ha la volante fuori: all'uscita
//    ti fa soffiare. Da ubriaco niente effetti grafici: la testa ciondola (pilota2d.js) e il protagonista ci scherza su.
// ============================================================================
const POL = {
  liberoP: 0.35, libero: [7, 12], gap: [2.5, 6],   // km fra un controllo e l'altro: a volte un tratto libero
  tutorP: 0.35, tutorLen: [4, 9],                     // km di tratto col Tutor
  cartello: 500,                                      // m: cartello prima dell'autovelox o del Tutor
  verbale: [2, 5],                                    // km dopo i quali arriva il verbale sul telefono
  codaKm: [6, 14], codaP: 0.25, codaLen: [1.5, 3],    // pattuglia in coda: ogni quanto ci si prova, probabilità, km
  barOgni: 5,                                         // un bar su cinque ha l'etilometro
  alcLimite: 0.5, alcCala: 0.00035,                   // g/l: limite e quanto cala al secondo
  fuga: { ritardo: 2.6, acc: 3.2, vmax: 50, perso: 450, tempo: 75, multa: 1000 },
};
// bevande del bar: prezzo e g/l che aggiungono
const POL_ALCOLICI = [
  { id: 'birra', name: 'Birra media', price: 4, alc: 0.25 },
  { id: 'spritz', name: 'Spritz', price: 5, alc: 0.3 },
  { id: 'amaro', name: 'Amaro', price: 3, alc: 0.2 },
  { id: 'whisky', name: 'Whisky', price: 6, alc: 0.4 },
];
// multa per tasso alcolemico (come il codice della strada, semplificato)
function alcFine(gl) { return gl < POL.alcLimite ? 0 : gl < 0.8 ? 543 : gl < 1.5 ? 800 : 1500; }

// le scuse: p = probabilità di [annullata, ridotta a metà, confermata, peggio (+50 %)]; r = risposta dell'agente per esito.
// solo: la scusa vale solo per quel tipo di fermo ('speed', 'alcol', 'docs'); senza, vale sempre.
const POL_SCUSE = [
  { t: '«Mia moglie sta per partorire!»', p: [0.15, 0.1, 0.45, 0.3], r: [
    '«Allora corra! Anzi no, vada piano. Ma vada. Auguri.»',
    '«Facciamo metà multa e un regalo per il bambino.»',
    '«È la terza moglie che partorisce stasera. Paghi.»',
    '«Sul sedile c\'è solo un panino. Partorisce anche lui? Multa piena e qualcosa in più.»'] },
  { t: '«Il tachimetro segna 20 in meno, è un difetto di queste vecchie auto.»', solo: ['speed'], p: [0.05, 0.35, 0.45, 0.15], r: [
    '«Ha ragione, il nostro radar è più vecchio della sua auto. Vada.»',
    '«Lo so, ce l\'aveva anche mio padre. Le tolgo metà.»',
    '«Allora ne approfitti per farlo aggiustare. Con quello che le resta.»',
    '«Quindi andava ancora più forte. Grazie della collaborazione.»'] },
  { t: '«Lei assomiglia tantissimo a mio cugino!»', p: [0.12, 0.08, 0.6, 0.2], r: [
    '«...Gino? Sei tu? Vai, vai, e salutami la zia.»',
    '«Ho un cugino anch\'io. Gli assomiglia. Metà multa, per la famiglia.»',
    '«Non ho cugini. Paghi.»',
    '«Mio cugino è in galera. Vuole fargli compagnia? No? Allora paghi di più.»'] },
  { t: '«Mi scusi, ha ragione. Non succederà più.»', p: [0.1, 0.5, 0.38, 0.02], r: [
    '«Uno sincero, a quest\'ora. Mi ha commosso. Vada.»',
    '«Almeno è onesto. Le tolgo un pezzo.»',
    '«Lo dicono tutti. Paghi lo stesso.»',
    '«Lo ha detto anche l\'altra volta. Me lo ricordo, sa?»'] },
  { t: '«Avevo un\'urgenza. Fisiologica. Grave.»', p: [0.08, 0.42, 0.4, 0.1], r: [
    '«Per carità, vada. E non sul sedile.»',
    '«Capisco. Il prossimo bar è vicino. Metà multa e stringa i denti.»',
    '«Il bagno costa meno della multa. Paghi.»',
    '«Allora aspetterà anche il verbale. Lungo.»'] },
  { t: '«Vi stavo seguendo, pensavo foste in emergenza.»', solo: ['speed'], p: [0.03, 0.12, 0.45, 0.4], r: [
    '«Ammirevole. Sbagliato, ma ammirevole. Vada.»',
    '«Fantasia da vendere. Metà multa per l\'impegno.»',
    '«Noi andavamo a novanta.»',
    '«Ci seguiva a centocinquanta? Allora la multa la seguo io.»'] },
  { t: '«Era analcolica. Glielo giuro su mia nonna.»', solo: ['alcol'], p: [0.05, 0.2, 0.5, 0.25], r: [
    '«L\'apparecchio sbaglia, a volte. Stasera ha fortuna.»',
    '«Sua nonna ha un buon avvocato. Metà.»',
    '«Anche l\'etilometro ha una nonna. E dice di no.»',
    '«Lasci stare la nonna. Patente, multa, e la prossima volta acqua.»'] },
  { t: '«L\'assicurazione l\'ho pagata ieri, la ricevuta è in posta.»', solo: ['docs'], p: [0.06, 0.24, 0.5, 0.2], r: [
    '«Va bene, mi fido. Stasera mi fido di tutti.»',
    '«Facciamo a metà: io mi fido metà, lei paga metà.»',
    '«Anche il computer è in posta? Perché dice scaduta.»',
    '«Ieri era domenica. Si aggiunge la fantasia al verbale.»'] },
  { t: '«Sto andando da Niko, il meccanico: è per questo che corro.»', p: [0.1, 0.2, 0.5, 0.2], r: [
    '«Niko? Gli dica che la mia la ritiro lunedì. Vada.»',
    '«Conosco Niko. Metà multa, e che non mi faccia più pagare il bullone a parte.»',
    '«Anche io vado da Niko. A cinquanta all\'ora.»',
    '«Niko mi ha venduto una frizione rotta. Lei paga per tutti e due.»'] },
];
// frasi del protagonista quando ha bevuto, e quando gli passa
const POL_BRILLO = [
  'Quella birra era più forte di quanto sembrava.',
  'Le strisce stasera sono più storte del solito. O sono io.',
  'Mi sento benissimo. Ed è proprio questo il problema.',
  'Se mi ferma la polizia respiro dal naso. Funziona, no? No.',
  'Il volante gira da solo... no, sono io che giro.',
  'Canterei. Ma la radio ha già sofferto abbastanza.',
  'Chi ha aggiunto una corsia? Ah, no. Sono sempre tre.',
  'Niente più spritz. Promesso. Fino al prossimo bar.',
  'Guido benissimo. Il problema è che lo penso troppo forte.',
];
const POL_SOBRIO = ['Mi sta passando. La testa torna al suo posto.', 'Ok, adesso le strisce sono dritte. Meglio così.'];

(function poliziaLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const R = (g) => (g.polRnd || Math.random)();
  const between = (g, a) => a[0] + R(g) * (a[1] - a[0]);
  const on = (g) => g.track === 'city' && (g.s.vg || (g.loc && g.loc.bg === 'highway'));
  const st = (g) => (g.s.pol = g.s.pol || { nextKm: null, ctl: [], verb: [], codaKm: null });
  P.polState = function () { return st(this); };

  // ------------------------------------------------------------ fermo: velocità, documenti, alcol
  // e: la volante che ferma (o null: se ne crea una dietro), why: 'speed' | 'docs' | 'alcol' | 'fuga', data: { kmh, sf, gl }
  P.polStop = function (e, why, data = {}) {
    if (this.pol && this.pol.stop) return false;
    this.pol = this.pol || {};
    const heat = this.s.heat || 0, voci = [];
    let tot = 0, ass = 0;
    if (why === 'speed') { const f = Math.round(data.sf.fine * (1 + heat * 0.3) / 10) * 10; tot += f; voci.push(`Il radar dice ${Math.round(data.kmh)} km/h: ${data.sf.over} oltre il limite di ${GAME_SPEED_LIMIT}, tolta la tolleranza. € ${fmt(f)}.`); }
    if (why === 'alcol') {
      const gl = data.gl || 0, f = alcFine(gl);
      if (f) { tot += f; voci.push(`Etilometro: ${gl.toFixed(2).replace('.', ',')} g/l, il limite è 0,5. € ${fmt(f)}${gl >= 0.8 ? ' e la patente la rivede tra un po\'' : ''}.`); }
      else voci.push(`Etilometro: ${gl.toFixed(2).replace('.', ',')} g/l. «Sotto il limite, vada pure. Piano.»`);
    }
    if (why === 'fuga') { const f = Math.round((POL.fuga.multa + (data.base || 0) * 1.5) / 10) * 10; tot += f; voci.push(`Fuga all'alt, guida pericolosa, resistenza: € ${fmt(f)}. «Le è andata bene che non l'abbiamo inseguita in elicottero.»`); }
    // i documenti li guardano sempre (documenti.js); l'assicurazione scaduta si paga lì
    const sc = typeof this.docScaduti === 'function' && typeof DOC !== 'undefined' ? this.docScaduti() : [];
    for (const x of sc) tot += DOC.multa[x];
    if (sc.length) voci.push(`Documenti: ${sc.map((x) => DOC_NOMI[x].toLowerCase()).join(', ')} ${sc.length > 1 ? 'scaduti' : 'scaduta'}, € ${fmt(sc.reduce((a, x) => a + DOC.multa[x], 0))}.`);
    if (sc.includes('ass')) { ass = this.docCosto('ass'); voci.push(`«Senza assicurazione non si riparte»: la fai qui, € ${fmt(ass)}.`); }
    else if (typeof DOC !== 'undefined' && why !== 'docs') voci.push('Patente e libretto: in regola.');
    if (why === 'docs' && !sc.length) { this.say('Posto di controllo: patente e libretto. «Tutto in regola, buona strada.»', 'police'); return false; }
    if (!tot && !ass) { this.say(voci.join(' '), 'police'); return false; }
    if (!e) { e = { id: this.id++, kind: 'police', lane: this.lane, x: this.s.dist - 40, v: 0 }; this.ents.push(e); }
    const S = this.pol.stop = { e, why, data, tot, ass, voci, sc, contested: false };
    e.chase = true; e.lane = this.lane; e.x = Math.min(e.x, this.s.dist - 40); e.checked = true;
    this.siren = 1;
    this.say(why === 'speed' ? `Polizia! Fermato a ${Math.round(data.kmh)} km/h, limite ${GAME_SPEED_LIMIT}` : why === 'alcol' ? 'Polizia: «Accosti, controllo con l\'etilometro.»' : why === 'fuga' ? 'Ti hanno preso.' : 'La paletta si alza: accosta, controllo documenti', 'police');
    this.stopAt(null, () => this.polAsk(S));
    return true;
  };
  const titolo = { speed: 'Eccesso di velocità', docs: 'Controllo documenti', alcol: 'Etilometro', fuga: 'Fermato dopo la fuga' };
  P.polAsk = function (S, extra) {
    const pay = S.tot + S.ass, opts = [{ label: `Paga € ${fmt(pay)}`, act: () => this.polPay(S) }];
    if (!S.contested && S.tot > 0 && S.why !== 'fuga') opts.push({ label: 'Contesta', act: () => this.polContest(S) });
    if (S.why !== 'fuga') opts.push({ label: 'Scappa', act: () => this.polFlee(S) });
    const ok = this.ask({ kind: 'police', title: titolo[S.why] || 'Polizia', time: 14, text: (extra ? extra + ' ' : '') + S.voci.join(' '), options: opts, onTimeout: () => this.polPay(S) });
    if (!ok) { this.prompt = null; this.ask({ kind: 'police', title: titolo[S.why] || 'Polizia', time: 14, text: S.voci.join(' '), options: opts, onTimeout: () => this.polPay(S) }); }
  };
  P.polPay = function (S) {
    const pay = S.tot + S.ass;
    this.s.money -= pay; this.s.fines = (this.s.fines || 0) + S.tot;
    if (S.why !== 'docs' || S.tot > 0) this.s.heat = Math.min(5, (this.s.heat || 0) + (S.why === 'fuga' ? 3 : 1));
    if (S.ass) { const d = this.docs(), k = this.s.dist / 1000; d.ass = Math.max(d.ass, k) + DOC.durata.ass; }
    S.e.chase = false; S.e.v = 0; S.e.lane = 0; S.e.x = Math.min(S.e.x, this.s.dist - 30);
    this.siren = 0; this.ap = null; this.pol.stop = null;
    this.say(`Pagato: − € ${fmt(pay)}${S.ass ? ' (assicurazione compresa)' : ''}`, 'police');
  };
  // contestazione: tre scuse a caso tra quelle che valgono per questo fermo
  P.polContest = function (S) {
    S.contested = true;
    const pool = POL_SCUSE.filter((q) => !q.solo || q.solo.includes(S.why)), pick = [];
    while (pick.length < 3 && pool.length) pick.push(pool.splice(Math.floor(R(this) * pool.length), 1)[0]);
    this.prompt = null;
    this.ask({ kind: 'police', title: 'Contesti', time: 14, text: 'L\'agente ti guarda da sopra gli occhiali. «Sentiamo.»',
      options: pick.map((q) => ({ label: q.t.replace(/[«»]/g, '').slice(0, 46) + (q.t.length > 48 ? '…' : ''), act: () => this.polScusa(S, q) })),
      onTimeout: () => this.polAsk(S, '«Niente da dire? Meglio così.»') });
  };
  P.polScusa = function (S, q) {
    let k = R(this), esito = 0;
    while (esito < 3 && k >= q.p[esito]) { k -= q.p[esito]; esito++; }
    const prima = S.tot;
    S.tot = esito === 0 ? 0 : esito === 1 ? Math.round(S.tot / 2 / 10) * 10 : esito === 3 ? Math.round(S.tot * 1.5 / 10) * 10 : S.tot;
    S.esito = esito;
    const dopo = esito === 0 ? 'Multa annullata.' : esito === 1 ? `Multa scesa da € ${fmt(prima)} a € ${fmt(S.tot)}.` : esito === 3 ? `Multa salita a € ${fmt(S.tot)}.` : 'Multa confermata.';
    S.voci = [`Tu: ${q.t}`, `L'agente: ${q.r[esito]}`, dopo + (S.ass ? ` L'assicurazione però la fai: € ${fmt(S.ass)}.` : '')];
    if (esito === 0 && !S.ass) { this.say(`${q.r[0]} Multa annullata.`, 'money'); S.e.chase = false; S.e.v = 0; S.e.lane = 0; this.siren = 0; this.ap = null; this.pol.stop = null; return; }
    this.polAsk(S);
  };

  // ------------------------------------------------------------ fuga e inseguimento
  P.polFlee = function (S) {
    const F = POL.fuga;
    this.pol.stop = null; this.ap = null; this.siren = 1;
    S.e.chase = false; S.e.pursuit = true; S.e.checked = true; S.e.v = 0;
    this.pol.ch = { e: S.e, gap: 12, t: 0, vP: 0, close: 0, vmax: F.vmax + (this.s.heat || 0) * 1.5 + R(this) * 3, base: S.tot, said: 0 };
    this.s.heat = Math.min(5, (this.s.heat || 0) + 1);
    this.say('Sgommi via. Dietro, la sirena si accende.', 'police');
  };
  P.polChase = function (dt) {
    const C = this.pol.ch, F = POL.fuga, sim = this.sim, d = this.s.dist;
    C.t += dt;
    if (C.t > F.ritardo) {
      const want = C.gap > 30 ? C.vmax : Math.min(C.vmax, sim.v + 2 + (C.gap - 8) * 0.25);   // vicino: si accosta senza tamponarti
      C.vP += Math.max(-6, Math.min(F.acc, (want - C.vP) * 2)) * dt;
    }
    C.gap = Math.max(7, C.gap + (sim.v - C.vP) * dt);
    C.close = C.gap < 9 && sim.v < C.vP + 1 ? C.close + dt : Math.max(0, C.close - dt);
    const e = C.e;
    if (C.gap < 200) { if (!this.ents.includes(e)) this.ents.push(e); e.x = d - C.gap; e.v = C.vP; e.lane = this.lane; e._z = undefined; }
    else if (this.ents.includes(e)) this.ents.splice(this.ents.indexOf(e), 1);
    const step = C.gap > 300 ? 3 : C.gap > 150 ? 2 : 1;
    if (step > C.said) { C.said = step; this.say(step === 1 ? 'La volante ti sta addosso' : step === 2 ? 'La volante resta indietro: 150 m' : 'Ancora un po\': la sirena si sente appena', 'police'); }
    if (C.close > 2.2) { this.pol.ch = null; this.polStop(e, 'fuga', { base: C.base }); return; }
    if (C.gap > F.perso || C.t > F.tempo) this.polLost(C.t > F.tempo && C.gap <= F.perso ? 'Hanno smesso di inseguirti. Forse.' : 'Li hai seminati.');
  };
  P.polLost = function (msg) {
    const C = this.pol.ch; this.pol.ch = null; this.siren = 0;
    if (C && C.e) { const i = this.ents.indexOf(C.e); if (i >= 0) this.ents.splice(i, 1); }
    this.s.heat = Math.min(5, (this.s.heat || 0) + 1);
    this.say(msg + ' Livello di ricercato alle stelle.', 'police');
    if (R(this) < 0.6) {                         // un posto di blocco più avanti: due volanti in prima e seconda, la terza libera
      const x = this.s.dist + 1800 + R(this) * 2200;
      for (const lane of [1, 2]) this.ents.push({ id: this.id++, kind: 'police', lane, x: x + lane * 3, v: 0, busy: true, still: true, hazard: true, block: true, checked: true });
      this.pol.block = { x, base: C ? C.base : 0 };
      this.say('Alla radio: posto di blocco più avanti. Corsia di sorpasso libera, ma ti guardano in faccia.', 'info');
    }
  };
  P.polBlock = function () {
    const B = this.pol.block, d = this.s.dist; if (!B || d < B.x - 4) return;
    this.pol.block = null;
    this.ents.forEach((o) => { if (o.block) o.blockDone = true; });
    const kmh = this.kmh;
    if (this.lane === 3 && kmh < 60 && R(this) < 0.5) { this.say('Ti fanno cenno di passare: non ti hanno riconosciuto.', 'info'); return; }
    if (kmh >= 60) {                            // tirato dritto al posto di blocco: si riparte, e più arrabbiati
      const e = { id: this.id++, kind: 'police', lane: this.lane, x: d - 15, v: 0, pursuit: true, checked: true }; this.ents.push(e);
      this.pol.ch = { e, gap: 15, t: POL.fuga.ritardo - 0.8, vP: sim0(this), close: 0, vmax: POL.fuga.vmax + 6 + (this.s.heat || 0) * 1.5, base: B.base, said: 0 };
      this.siren = 1; this.say('Hai tirato dritto al posto di blocco. Si riparte.', 'police'); return;
    }
    this.polStop(null, 'fuga', { base: B.base });
  };
  const sim0 = (g) => Math.max(0, g.sim.v * 0.6);

  // ------------------------------------------------------------ autovelox e Tutor: pochi, a volte niente per 7-12 km
  P.polPlan = function () {
    const S = st(this), km = this.s.dist / 1000;
    if (S.nextKm === null || S.nextKm === undefined) S.nextKm = km + between(this, POL.gap);
    while (S.nextKm < km + 3.2) {
      const x = S.nextKm * 1000, tutor = R(this) < POL.tutorP;
      if (tutor) { const len = between(this, POL.tutorLen) * 1000; S.ctl.push({ k: 'tutor', x, x2: x + len }); S.nextKm += len / 1000; }
      else S.ctl.push({ k: 'velox', x });
      S.nextKm += R(this) < POL.liberoP ? between(this, POL.libero) : between(this, POL.gap);
    }
    S.ctl = S.ctl.filter((c) => (c.x2 || c.x) > this.s.dist - 400);
  };
  // per la mappa in basso: { x, t, name }
  P.polPins = function (a, b) {
    const S = st(this), out = [];
    for (const c of S.ctl) {
      if (c.k === 'velox' && c.x > a && c.x < b) out.push({ x: c.x, t: 'V', name: 'Autovelox' });
      if (c.k === 'tutor') { if (c.x > a && c.x < b) out.push({ x: c.x, t: 'T', name: 'Inizio Tutor' }); if (c.x2 > a && c.x2 < b) out.push({ x: c.x2, t: 'T', name: 'Fine Tutor', end: true }); }
    }
    return out;
  };
  P.polCams = function (dt, d0) {
    const S = st(this), d = this.s.dist, kmh = this.kmh;
    this.polT = (this.polT || 0) + dt;
    for (const o of this.ents) if (o.kind === 'velox' && o.flashT > 0) o.flashT -= dt;
    for (const c of S.ctl) {
      // cartello, autovelox e portali sulla strada quando si avvicinano (la strada butta via quello che è troppo lontano)
      if (!c.ents && c.x - d < 1300) {
        c.ents = true;
        this.ents.push({ id: this.id++, kind: 'polsign', lane: 0, x: c.x - POL.cartello, v: 0, tutor: c.k === 'tutor', keep: true });
        this.ents.push({ id: this.id++, kind: c.k === 'tutor' ? 'tutor' : 'velox', lane: 0, x: c.x, v: 0, ctl: c, keep: true });
      }
      if (c.k === 'tutor' && c.ents && !c.ents2 && c.x2 - d < 1300) { c.ents2 = true; this.ents.push({ id: this.id++, kind: 'tutor', lane: 0, x: c.x2, v: 0, end: true, ctl: c, keep: true }); }
      if (d0 < c.x && d >= c.x) {
        if (c.k === 'velox') {
          const sf = speedFine(kmh), cam = this.ents.find((o) => o.ctl === c && o.kind === 'velox');
          if (sf) { if (cam) cam.flashT = 0.35; this.fx.push({ k: 'velox' }); this.polVerbale(sf, Math.round(kmh), 'autovelox'); }
        } else { c.t0 = this.polT; this.say(`Inizio Tutor: ${fmt((c.x2 - c.x) / 1000)} km di velocità media controllata`, 'info'); }
      }
      if (c.k === 'tutor' && c.t0 !== undefined && d0 < c.x2 && d >= c.x2) {
        const avg = (c.x2 - c.x) / Math.max(1, this.polT - c.t0) * 3.6, sf = speedFine(avg); c.t0 = undefined;
        this.say(`Fine Tutor: media ${Math.round(avg)} km/h`, sf ? 'police' : 'info');
        if (sf) this.polVerbale(sf, Math.round(avg), 'Tutor (media)');
      }
    }
    // verbali: arrivano qualche km dopo, sul telefono
    for (const V of S.verb) if (!V.done && d >= V.due) {
      V.done = true; this.s.money -= V.fine; this.s.fines = (this.s.fines || 0) + V.fine;
      const txt = `Verbale: ${V.what}, ${V.kmh} km/h (limite ${GAME_SPEED_LIMIT}). Addebitati € ${fmt(V.fine)}.`;
      if (typeof window !== 'undefined' && window.telefono && window.telefono.sms) window.telefono.sms('Polizia Stradale', txt, { bad: 1 });
      this.say(txt, 'police');
    }
    S.verb = S.verb.filter((V) => !V.done);
  };
  P.polVerbale = function (sf, kmh, what) {
    st(this).verb.push({ fine: sf.fine, kmh, what, due: this.s.dist + between(this, POL.verbale) * 1000 });
  };

  // ------------------------------------------------------------ pattuglia in coda
  P.polTail = function (dt) {
    const S = st(this), km = this.s.dist / 1000, d = this.s.dist;
    if (S.codaKm === null || S.codaKm === undefined) S.codaKm = km + between(this, POL.codaKm);
    const T = this.pol.tail;
    if (!T) {
      if (km < S.codaKm) return;
      if (this.prompt || this.ap || this.pol.ch || this.sim.v < 15) { S.codaKm = km + 0.5; return; }   // non è il momento: riprova tra poco
      S.codaKm = km + between(this, POL.codaKm);
      if (R(this) >= POL.codaP) return;
      const e = { id: this.id++, kind: 'police', lane: this.lane, x: d - 70, v: this.sim.v, checked: true, tail: true };
      this.ents.push(e); this.pol.tail = { e, gap: 70, left: between(this, POL.codaLen) * 1000, over: 0 };
      this.say('Una volante ti si è messa dietro.', 'info');
      if (this.vgThink && this.s.vg) this.vgThink('Volante negli specchietti. Calma. Mani sul volante, velocità da nonno.');
      return;
    }
    T.gap += (18 - T.gap) * Math.min(1, dt * 0.5); T.left -= this.sim.v * dt;
    const e = T.e; e.x = d - T.gap; e.v = this.sim.v; e.lane = this.lane;
    T.over = speedFine(this.kmh) ? T.over + dt : 0;
    if (T.over > 1.5) { this.pol.tail = null; e.tail = false; this.polStop(e, 'speed', { kmh: this.kmh, sf: speedFine(this.kmh) }); return; }
    if (T.left <= 0 || this.inside) {             // ti lascia: mette la freccia e ti supera
      this.pol.tail = null; e.tail = false; e.lane = Math.min(3, this.lane + 1); e.v = Math.max(this.sim.v + 3, 27); e.x = d - 12;
      this.say('La volante ti supera e se ne va.', 'info');
    }
  };

  // ------------------------------------------------------------ alcol
  P.polDrink = function (id) {
    const v = this.s.vg, a = POL_ALCOLICI.find((q) => q.id === id); if (!v || !a) return { ok: false };
    const r = this.vgPay(a.price, a.name); if (!r.ok) return r;
    v.alc = Math.min(2.5, (v.alc || 0) + a.alc); v.needs.water = Math.min(1, v.needs.water + 0.1);
    return { ok: true, alc: v.alc };
  };
  P.polBarCheck = function (n) { return n >= 0 && ((n * 7919 + 13) % POL.barOgni) === 0; };
  P.polAlc = function (dt) {
    const v = this.s.vg; if (!v) return;
    if (v.alc > 0) v.alc = Math.max(0, v.alc - POL.alcCala * dt);
    const p = (this.pol.brillo = this.pol.brillo || { t: 20, was: false });
    if (v.alc > 0.3) {
      p.was = true; p.t -= dt;
      if (p.t <= 0 && this.vgThink && !this.prompt && !this.inside && this.sim.v > 3) { p.t = 50 + R(this) * 40; this.vgThink(POL_BRILLO[Math.floor(R(this) * POL_BRILLO.length)]); }
    } else if (p.was && v.alc < 0.1) { p.was = false; p.t = 20; if (this.vgThink) this.vgThink(POL_SOBRIO[Math.floor(R(this) * POL_SOBRIO.length)]); }
  };
  // uscita da un bar con la volante fuori: la volante è parcheggiata 150 m più avanti e ti fa soffiare
  const exit = P.exitPlace;
  P.exitPlace = function () {
    const I = this.inside;
    exit.call(this);
    if (I && I.id === 'bar' && this.s.vg && typeof VG !== 'undefined' && this.polBarCheck(VG.stopIndex(I.x)))
      this.ents.push({ id: this.id++, kind: 'police', lane: 0, x: this.s.dist + 150, v: 0, alcol: true, checked: true, docChk: true });
  };
  // in un locale con la volante a ridosso: ti prendono; con un po' di vantaggio: seminata
  const enter = P.enterPlace;
  P.enterPlace = function (p) {
    if (this.pol && this.pol.ch) { if (this.pol.ch.gap > 60) this.polLost('Ti infili nel parcheggio e spegni i fari. Passano oltre.'); else { const C = this.pol.ch; this.pol.ch = null; this.polStop(C.e, 'fuga', { base: C.base }); return; } }
    return enter.call(this, p);
  };

  // ------------------------------------------------------------ posto di controllo (strada.js): ora ti fanno accostare
  P.docControllo = function () { return this.polStop(null, 'docs') ? { ok: true, fermo: true } : { ok: true, multa: 0 }; };
  // la volante ferma ti ferma per velocità: con tutto il resto (documenti, contesta, scappa)
  P.busted = function (e) { const sf = speedFine(this.kmh) || { over: 1, fine: 42 }; this.polStop(e, 'speed', { kmh: this.kmh, sf }); };
  P.payFine = function () { if (this.pol && this.pol.stop) this.polPay(this.pol.stop); };

  const up = P.update;
  P.update = function (dt) {
    const d0 = this.s.dist;
    up.call(this, dt);
    this.pol = this.pol || {};
    this.ents = this.ents.filter((o) => !o.blockDone || o.x - this.s.dist > -60);
    if (this.inside || !on(this)) return;
    if (this.s.vg) this.polAlc(dt);
    this.polPlan(); this.polCams(dt, d0);
    if (this.pol.ch) this.polChase(dt);
    else if (this.pol.block) this.polBlock();
    if (!this.pol.ch && !this.pol.stop) this.polTail(dt);
    // la volante fuori dal bar: passandole accanto ti fa soffiare
    for (const e of this.ents) if (e.alcol && !e.alcDone && Math.abs(e.x - this.s.dist) < 12 && !this.prompt && !this.ap) { e.alcDone = true; this.polStop(e, 'alcol', { gl: (this.s.vg && this.s.vg.alc) || 0 }); }
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { POL, POL_ALCOLICI, POL_SCUSE, alcFine });

// ---------------------------------------------------------------- disegno: cartelli, autovelox, portali del Tutor
(function poliziaDisegno() {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, prev = S.drawTripEnt;
  S.drawTripEnt = function (g, e, x, st) {
    if (e.kind !== 'polsign' && e.kind !== 'velox' && e.kind !== 'tutor') return prev ? prev.call(this, g, e, x, st) : false;
    const C = this.C, X = Math.round(x);
    if (e.kind === 'polsign') {                     // cartello blu: controllo elettronico della velocità (o Tutor)
      const L = e.tutor ? ['TUTOR', 'VELOCITA MEDIA', 'CONTROLLATA'] : ['CONTROLLO', 'ELETTRONICO', 'DELLA VELOCITA'];
      const w = 64, h = 34, top = 146, bx = X - w / 2;
      g.fillStyle = C.ink; g.fillRect(X - 2, top + h, 4, 228 - top - h);
      g.fillStyle = C.ink; g.fillRect(bx - 1, top - 1, w + 2, h + 2); g.fillStyle = '#e8e6df'; g.fillRect(bx, top, w, h);
      g.fillStyle = '#1d4fa8'; g.fillRect(bx + 1, top + 1, w - 2, h - 2);
      L.forEach((s, i) => this.text(g, s, X - Math.round(this.textW(s) / 2), top + 4 + i * 10, '#f4f1e6'));
      if (this.lightAdd) this.lightAdd(X, top + h / 2, 70, 40, '160,190,255', 0.25);
      return true;
    }
    if (e.kind === 'velox') {                       // palo con la cassetta grigia e l'obiettivo; lampo bianco se scatta
      g.fillStyle = C.ink; g.fillRect(X - 2, 150, 5, 78);
      g.fillStyle = C.ink; g.fillRect(X - 9, 134, 20, 18); g.fillStyle = '#8c8f94'; g.fillRect(X - 8, 135, 18, 16);
      g.fillStyle = '#e07020'; g.fillRect(X - 8, 135, 18, 3); g.fillStyle = '#14161e'; g.fillRect(X + 3, 141, 6, 6); g.fillStyle = '#5a6a8a'; g.fillRect(X + 4, 142, 2, 2);
      if (e.flashT > 0) { const k = Math.min(1, e.flashT / 0.2); g.fillStyle = '#ffffff'; g.fillRect(X + 2, 140, 8, 8); this.light(g, X + 6, 144, 60, 44, '#ffffff', 0.9 * k, 3); this.light(g, X + 6, 150, 180, 120, '#f0f4ff', 0.4 * k, 4); if (this.lightAdd) this.lightAdd(X + 6, 230, 260, 120, '255,255,255', 1.2); }
      return true;
    }
    // Tutor: portale a sbalzo sopra la strada, con la scritta
    g.fillStyle = C.ink; g.fillRect(X - 2, 118, 5, 110); g.fillRect(X - 2, 116, 90, 5);
    g.fillStyle = '#5a5e66'; g.fillRect(X - 1, 117, 88, 3);
    g.fillStyle = C.ink; g.fillRect(X + 30, 120, 34, 12); g.fillStyle = '#1d4fa8'; g.fillRect(X + 31, 121, 32, 10);
    this.text(g, e.end ? 'FINE' : 'TUTOR', X + 33 + (e.end ? 4 : 0), 123, '#f4f1e6');
    for (const k of [12, 72]) { g.fillStyle = '#14161e'; g.fillRect(X + k, 121, 6, 5); g.fillStyle = '#c02020'; g.fillRect(X + k + 2, 122, 2, 2); }
    return true;
  };
})();
