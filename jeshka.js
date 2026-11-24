// ============================================================================
//  Night Run · «Ti tengo compagnia» (dopo statistiche.js): storia secondaria di Jeshka e Luca
//  Jeshka, meccanica russa, tiene il banco di Russian Kùstòm; Luca prepara le auto da Da Luca Tuning. Si cercano da
//  quando si sono persi per un'ora a un'area di servizio, e alla fine hanno avuto la stessa idea: fermarsi dove l'altro
//  può trovarli. Non è la storia principale (Rosa, Ottavio, Livia restano come sono): la trova solo chi entra in
//  quei due negozi e si ferma a guardare. Proposta di Codex, riscritta per il gioco.
//
//  Scene nel pannello del negozio (NightJL.panel, chiamata da openPlace per 'style' e 'shop'), in quest'ordine
//  ma partendo da uno qualunque dei due negozi:
//    neon1   il cassetto dei fusibili (dal km 30)          luca1  il quaderno e il banco girato al contrario (dal km 20)
//    neon2   la signora del furgone e i cinque lampi: il nome di Jeshka, e se hai letto il quaderno, il messaggio
//    luca2   il cavo e l'ora in più (serve sapere di Jeshka)
//    neon3   il nastro sul cavo: Jeshka sale in macchina (si può dire «non ancora»)
//  In macchina: chiacchiere ogni tanto, il messaggio di un numero sconosciuto che scrive come Luca (la strada imita le
//  voci: lei lo smaschera), e il segnale: cinque colpi di abbaglianti (tasto F) nel piazzale del tuning.
//    incontro  a tutto schermo, entrando da Luca col segnale (o col pulsante, se il segnale è saltato)
//    fine      a tutto schermo, a un tuning almeno 15 km dopo; Neon resta chiuso con un biglietto
//  Stato in game.s.vg.jl. Prova: jlDebug.vai('neon3'), jlDebug.stato(), jlDebug.incontro(), jlDebug.fine().
// ============================================================================
const JL = {
  kmNeon: 30, kmLuca: 20,      // da quale km si fanno vedere
  segnale: 5, segnaleT: 7,     // colpi di abbaglianti e in quanti secondi
  piazzale: [-40, 320],        // dove vale il segnale: metri prima del tuning (positivi) e dopo (negativi)
  smsKm: 1.6,                  // dopo quanti km in macchina arriva il messaggio falso
  chiacchieraKm: [3.5, 6],     // ogni quanto Jeshka dice qualcosa in macchina
  fineKm: 15,                  // la scena finale non prima di tanti km dall'incontro
};
// le frasi di Jeshka in macchina, una alla volta, senza ripetersi
const JL_CHIACCHIERE = [
  'Jeshka: «Le luci di posizione ce le hai storte. Non ti dico niente, ma ce le hai storte.»',
  'Jeshka guarda fuori: «Tre volte sono passata da quell\'area. Tre. La ragazza al banco ormai mi salutava per nome.»',
  'Jeshka: «Lui si addormenta in macchina, lo sai? Sempre. Prometteva di tenermi sveglia e dopo un semaforo russava.»',
  'Jeshka si gira il cavo tra le dita: «Il nastro l\'ha messo storto apposta. Così vedo che l\'ha messo lui.»',
  'Jeshka: «Se mi addormento svegliami. No, non svegliarmi. Svegliami.»',
  'Jeshka: «Quando arriviamo non spegnere subito il motore. Voglio sentire se lo riconosce dal rumore.»',
];

// --------------------------------------------------------------------------- stato e logica (senza pagina)
function jlState(g) {
  const vg = g.s.vg || (g.s.vg = {});
  return (vg.jl = vg.jl || { neon: 0, luca: 0, nome: false, quaderno: false, messaggio: false, cavo: 0, auto: false, incontro: false, fine: false, stop: {} });
}
const jlKm = (g) => (g.s.dist || 0) / 1000;
const jlStop = (g, I) => (typeof VG !== 'undefined' && I && Number.isFinite(I.x) ? VG.stopIndex(I.x) : Math.round(jlKm(g) * 10));
// quale scena c'è adesso in questo negozio (null = niente): deciso solo dallo stato, così si prova senza pagina
function jlScena(g, id, I) {
  const J = jlState(g), km = jlKm(g), n = jlStop(g, I), nuova = (k) => J.stop[k] !== n;   // mai due scene dello stesso negozio alla stessa tappa
  if (!g.s.vg) return null;
  if (id === 'style') {
    if (J.incontro) return J.biglietto ? null : 'biglietto';
    if (J.auto) return null;
    if (J.neon === 0 && km >= JL.kmNeon) return 'neon1';
    if (J.neon === 1 && nuova('neon')) return 'neon2';
    if (J.neon === 2 && J.cavo === 1 && nuova('neon')) return 'neon3';
    return null;
  }
  if (id === 'shop') {
    if (J.fine) return null;
    if (J.incontro) return km - (J.incontroKm || 0) >= JL.fineKm ? 'fine' : null;
    if (J.auto) return 'arrivo';
    if (J.luca === 0 && km >= JL.kmLuca) return 'luca1';
    if (J.luca === 1 && J.nome && J.cavo === 0 && nuova('luca')) return 'luca2';
    return null;
  }
  return null;
}
// gli effetti delle scelte: id della scena + chiave della scelta
function jlFatto(g, scena, k, I) {
  const J = jlState(g), n = jlStop(g, I), km = jlKm(g);
  if (scena === 'neon1') { J.neon = 1; J.stop.neon = n; }
  if (scena === 'luca1') { J.luca = 1; J.quaderno = true; J.stop.luca = n; if (k === 'neon') J.lucaSa = true; }
  if (scena === 'neon2') { J.neon = 2; J.stop.neon = n; if (k !== 'via') J.nome = true; if (k === 'luca') J.messaggio = true; }
  if (scena === 'luca2') { J.luca = 2; J.cavo = 1; J.stop.luca = n; }
  if (scena === 'neon3') { J.stop.neon = n; if (k === 'sali') { J.cavo = 2; J.auto = true; J.autoKm = km; J.chKm = km + JL.chiacchieraKm[0]; J.ch = 0; J.sms = false; J.segnale = false; J.colpi = []; } }
  if (scena === 'incontro') { J.incontro = true; J.auto = false; J.incontroKm = km; J.stop.luca = n; }
  if (scena === 'biglietto') J.biglietto = true;
  if (scena === 'fine') J.fine = true;
}

(function jlGioco() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  P.jlState = function () { return jlState(this); };
  P.jlScena = function (id, I) { return jlScena(this, id, I); };
  P.jlFatto = function (scena, k, I) { return jlFatto(this, scena, k, I); };
  // il segnale: cinque colpi di abbaglianti nel piazzale del tuning, con Jeshka in macchina
  const fl = P.flashLights;
  P.flashLights = function () {
    const r = fl ? fl.apply(this, arguments) : null;
    const J = this.s.vg && this.s.vg.jl;
    if (J && J.auto && !J.segnale && this.jlPiazzale()) {
      const t = Date.now() / 1000; J.colpi = (J.colpi || []).filter((c) => t - c < JL.segnaleT); J.colpi.push(t);
      if (J.colpi.length >= JL.segnale) {
        J.segnale = true; J.colpi = [];
        this.say('Cinque lampi sul portone. Dentro l\'officina si accende una luce, poi un\'altra.', 'info');
        if (this.vgThink) this.vgThink('Jeshka si è tolta la cintura e non scende. Entro io per primo, con lei dietro.', true);
      } else if (J.colpi.length === 1) this.say('Jeshka conta sottovoce: «Odin…»', 'info');
    }
    return r;
  };
  // il tuning più vicino davanti (o appena passato): ci sei, nel piazzale?
  P.jlPiazzale = function () {
    if (!this.placesBetween) return null;
    const d = this.s.dist;
    return this.placesBetween(d + JL.piazzale[0], d + JL.piazzale[1]).find((p) => p.id === 'shop' || (p.twin && p.twin.id === 'shop')) || null;
  };
  const up = P.update;
  P.update = function (dt) {
    up.call(this, dt);
    const J = this.s.vg && this.s.vg.jl; if (!J || !J.auto || this.inside) return;
    const km = jlKm(this);
    // il numero sconosciuto che scrive come lui: la strada imita, lei se ne accorge
    if (!J.sms && km - (J.autoKm || km) >= JL.smsKm) {
      J.sms = true;
      if (typeof window !== 'undefined' && window.telefono && window.telefono.sms) window.telefono.sms('Numero sconosciuto', 'Ti tengo compagnia.', { bad: true });
      this.say('Jeshka legge il messaggio sul tuo telefono e lo gira a faccia in giù.', 'bad');
      { const t = 'Jeshka: «Non è lui. Lui quella frase non la finisce mai: si addormenta prima.»'; if (!(this.vgThink && this.vgThink(t, true))) this.say(t, 'info'); }
      return;
    }
    if (km >= (J.chKm || 1e9) && (J.ch || 0) < JL_CHIACCHIERE.length) {
      const k = JL_CHIACCHIERE[J.ch++]; J.chKm = km + JL.chiacchieraKm[0] + Math.random() * (JL.chiacchieraKm[1] - JL.chiacchieraKm[0]);
      if (!this.prompt) this.say(k, 'info');
    }
  };
})();

// --------------------------------------------------------------------------- i testi delle scene
// passo: { r: [[chi, testo], ...], s: [[etichetta, passo dopo | null = fine, chiave dell'effetto, condizione]] }
// chi: '' = racconto, 'TU', o il nome. La scena finisce quando una scelta porta a null: lì si applica jlFatto.
const JL_SCENE = {
  neon1: { a: { r: [
    ['', 'Al banco di Russian Kùstòm c\'è una donna coi capelli raccolti in una matita. Non alza la testa dal cablaggio che sta spellando.'],
    ['MECCANICA', 'Spostala.'],
    ['TU', 'Scusa?'],
    ['MECCANICA', 'La macchina. Sei parcheggiato davanti al cassetto dei fusibili. Se mi salta la corrente mentre ci sei tu davanti, la colpa è tua e anche il preventivo.'],
  ], s: [['La sposto', 'b'], ['Quale cassetto?', 'c']] },
  b: { r: [['', 'Fai manovra. Quando torni ha già acceso due neon di prova sotto il bancone, uno rosa e uno blu, e ti guarda per la prima volta.'], ['MECCANICA', 'Spasibo. Adesso sì. Dimmi che luci vuoi, e non dirmi «quelle belle».']], s: [['Va bene', null]] },
  c: { r: [['', 'Indica con la pinza una cassetta grigia sul muro. Sopra c\'è scritto FUSIBILI con un pennarello, tre volte, sempre più grande.'], ['MECCANICA', 'Quello. Con scritto «fusibili». Siete tutti uguali, voi che entrate di notte.']], s: [['La sposto, la sposto', null]] } },

  luca1: { a: { r: [
    ['', 'Sul banco di Luca c\'è un quaderno a quadretti aperto: ordini di pezzi, regolazioni, numeri di telefono senza nome.'],
    ['', 'A metà pagina, tra «carburatore Weber da rifare» e «4 candele fredde», una riga scritta più piano delle altre: «Lampada per la signora del furgone. Portalampada nuovo, il suo balla».'],
    ['LUCA', 'Senti una cosa. Sulla strada che hai fatto, hai visto un\'officina col banco girato al contrario? Rivolto verso le macchine che entrano, non verso la strada.'],
  ], s: [['Sì: Russian Kùstòm, più indietro', 'b', 'neon', (g) => jlState(g).neon >= 1], ['No, perché?', 'c']] },
  b: { r: [
    ['', 'Luca smette di pulirsi le mani. Per un momento sembra uno che ha sentito chiamare il suo nome in un posto affollato.'],
    ['LUCA', 'Chi c\'era al banco?'],
    ['TU', 'Una meccanica. Accento dell\'est. Mi ha fatto spostare la macchina.'],
    ['LUCA', 'Dai fusibili.'],
    ['', 'Non è una domanda. Apre il quaderno, scrive qualcosa, lo richiude prima che tu possa leggere.'],
    ['LUCA', 'Non dirle niente. Se non è lei, non voglio che qualcuno speri per niente. Che pezzi ti servono?'],
  ], s: [['Va bene', null]] },
  c: { r: [['LUCA', 'Niente. Se la vedi, me lo dici. Chi tiene il banco girato così vuole vedere in faccia chi arriva.'], ['', 'Torna al cofano che stava aprendo. Il quaderno resta aperto su quella riga.']], s: [['Va bene', null]] } },

  neon2: { a: { r: [
    ['', 'Stavolta la meccanica è in ginocchio accanto alla portiera di un furgone bianco. Al volante c\'è una donna sui cinquant\'anni che stringe il volante come se dovesse partire subito.'],
    ['DONNA', 'Mia figlia guida l\'altro furgone. È sorda. Per chiamarla abbiamo sempre usato lo specchietto: io apro e chiudo la mano sul volante, lei mi vede e risponde. Qui sotto è troppo buio. Non mi vede più.'],
    ['', 'La meccanica sta fissando una piccola luce dietro al parabrezza, con due fascette e un filo che scende fino al pulsante del clacson.'],
    ['MECCANICA', 'Cinque volte col pollice. Cinque lampi corti. Lei li vede anche da lontano. Prova.'],
  ], s: [['Tieni ferma la torcia', 'b', 'aiuta'], ['Resta a guardare', 'b', 'guarda'], ['Non è affare tuo: esci', null, 'via']] },
  b: { r: [
    ['', 'La donna prova. Sbaglia, ne fa quattro, poi sei. La meccanica le prende il pollice e lo batte sul pulsante con lei, contando in russo, finché il gesto le viene da solo.'],
    ['', 'Quando il furgone se ne va, la meccanica resta seduta per terra con la schiena contro il bancone.'],
    ['MECCANICA', 'È stata lei la prima a dirmi che Luca era ancora in giro. L\'aveva visto a un\'officina, con una lampada in mano. Le dovevo un favore.'],
    ['TU', 'Luca?'],
    ['JESHKA', 'Mio marito. Più o meno. Io sono Jeshka. Non ripeterlo male, lo fanno tutti.'],
  ], s: [['C\'è un Luca al tuning. Ha scritto della lampada della signora', 'c', null, (g) => jlState(g).quaderno], ['Spero che lo trovi', 'd']] },
  c: { r: [
    ['', 'Jeshka ti afferra il polso. Ha le dita nere di grasso e non se ne accorge.'],
    ['JESHKA', 'Com\'era. Alto così? Si tocca la spalla destra quando alza le braccia? Si taglia i capelli da solo, si vede da dietro?'],
    ['TU', 'Ha scritto «portalampada nuovo, il suo balla».'],
    ['', 'Jeshka ride, una volta sola, dal naso.'],
    ['JESHKA', 'È lui. Mette sempre la virgola prima di «il suo». Lo prendevo in giro per questo.'],
    ['', 'Poi smette di ridere.'],
    ['JESHKA', 'Non posso partire. Se parto e lui intanto viene a cercarmi, ci incrociamo un\'altra volta e ricominciamo da capo. Digli di restare fermo. Diglielo tu.'],
  ], s: [['Glielo dico', null, 'luca']] },
  d: { r: [['JESHKA', 'Lo trovo. Prima o poi entra qualcuno che l\'ha visto. Per questo tengo il banco girato verso l\'ingresso.'], ['', 'Si rialza e torna ai suoi fili come se non avesse detto niente.']], s: [['Va bene', null, 'nome']] } },

  luca2: { a: { r: [
    ['TU', 'Ho conosciuto Jeshka. Da Russian Kùstòm.'],
    ['', 'Luca si siede sul paraurti della macchina che ha sul ponte. Si siede proprio, come uno a cui hanno tolto le gambe.'],
    ['LUCA', 'Viaggiavamo con due macchine. A uno svincolo ho visto uno fermo, mi sono accostato. Le ho fatto segno di andare avanti. Lei mi ha aspettato alla prima area di servizio. Ore. Poi ha pensato che fossi rimasto a piedi ed è tornata indietro a cercarmi.'],
    ['LUCA', 'Quando sono arrivato io, la ragazza al banco si ricordava benissimo di lei. Mi ha dato questo.'],
    ['', 'Dal cassetto tira fuori un cavo del telefono, arrotolato strettissimo, come lo arrotola chi ha paura che si annodi.'],
    ['LUCA', 'Glielo dicevo sempre, che così prima o poi lo spacca. Se quel giorno fosse rimasta un\'ora in più, adesso saremmo a casa. Allora ho deciso che quello che rimane un\'ora in più sono io.'],
  ], s: [['Lei dice di dirti di restare fermo', 'b', null, (g) => jlState(g).messaggio], ['Perché non vai tu da lei?', 'c']] },
  b: { r: [['', 'Luca guarda il cavo.'], ['LUCA', 'Allora siamo in due a stare fermi, e da fermi non ci si trova. Portaglielo tu. Lei capisce.'], ['', 'Prima di dartelo ci passa sopra un giro di nastro isolante, dove la guaina si è aperta.']], s: [['Prendi il cavo', null]] },
  c: { r: [['LUCA', 'Perché se parto io e lei intanto viene qui, la ragazza al banco mi dà un altro cavo. Portaglielo tu. Lei capisce.'], ['', 'Prima di dartelo ci passa sopra un giro di nastro isolante, dove la guaina si è aperta.']], s: [['Prendi il cavo', null]] } },

  neon3: { a: { r: [
    ['', 'Posi il cavo sul banco di Russian Kùstòm. Jeshka non lo tocca subito.'],
    ['', 'Poi lo srotola. Si è aperto proprio dove lei lo piegava sempre, e sopra c\'è un giro di nastro nero, messo un po\' storto.'],
    ['JESHKA', 'Ci ha messo il nastro.'],
    ['TU', 'Ha detto che lui resta lì un\'ora in più. Sempre.'],
    ['JESHKA', 'Certo che resta. Qualcuno dei due dovrà pur stare fermo, no?'],
    ['', 'Lo dice seccata. Poi lo sente, quello che ha detto. Si siede sul bancone, con il cavo in mano, e per un po\' non dice niente.'],
    ['JESHKA', 'Mi porti tu? Io la macchina non la prendo. Se guido io, a metà strada mi giro.'],
  ], s: [['Sali', 'b', 'sali'], ['Non ancora', 'c', 'dopo']] },
  b: { r: [
    ['', 'Jeshka spegne i neon uno per uno, tranne quello sopra la porta. Attacca un biglietto al cassetto dei fusibili.'],
    ['JESHKA', 'Quando arriviamo al suo piazzale, lampeggia. Cinque volte, come la signora del furgone. Se esce lui, entro. Se non esce, giri e mi riporti qui e non ne parliamo più.'],
  ], s: [['Andiamo', null, 'sali']] },
  c: { r: [['JESHKA', 'Va bene. Tanto il banco è girato verso l\'ingresso. Ti vedo, quando torni.'], ['', 'Si mette il cavo in tasca.']], s: [['Va bene', null, 'dopo']] } },

  arrivo: { a: { r: [['', 'Jeshka non si muove dal sedile. Ha il cavo arrotolato intorno al polso.'], ['JESHKA', 'Non hai lampeggiato. Cinque. Me l\'avevi promesso.']], s: [['Esci nel piazzale e lampeggia', null, 'lampeggia'], ['Non ancora', null, 'aspetta']] } },

  biglietto: { a: { r: [['', 'Russian Kùstòm è chiuso. Resta acceso solo il neon sopra la porta. Sul cassetto dei fusibili c\'è un biglietto scritto in stampatello.'], ['', '«TORNO. IL CASSETTO NON TOCCATELO. J.»']], s: [['Va bene', null]] } },
};
// le due scene a tutto schermo
const JL_INCONTRO = [
  ['', 'Luca è sotto un cofano. Sente entrare qualcuno e grida, senza girarsi, di lasciare le chiavi sul banco.'],
  ['', 'Jeshka le posa. Accanto al banco c\'è un vecchio sedile d\'auto avvitato al pavimento, per i clienti. Si siede lì. Le tremano le ginocchia.'],
  ['JESHKA', 'Sono passata tre volte da quell\'area di merda.'],
  ['', 'Luca alza la testa. Ha in bocca il cappuccio di un pennarello e per rispondere deve prima toglierselo.'],
  ['LUCA', 'Io due.'],
  ['JESHKA', 'E la terza dov\'eri?'],
  ['LUCA', 'Qui.'],
  ['', 'Lei annuisce. Per la prima volta pensa a tutte le sere passate a guardare le macchine entrare da Russian Kùstòm, e al fatto che per lui sono durate uguali.'],
  ['', 'Luca le si siede accanto, per terra. Restano zitti abbastanza a lungo che pensi di dover uscire.'],
  ['LUCA', 'Comunque, come ti dicevo…'],
  ['', 'Jeshka scoppia a ridere così forte che scivola giù dal sedile e finisce per terra accanto a lui. Ride con la faccia contro la sua spalla, quella che gli fa male.'],
  ['', 'Gli passa le dita fra i capelli.'],
  ['JESHKA', 'Questi te li sei tagliati da solo.'],
  ['LUCA', 'Dietro com\'è?'],
  ['JESHKA', 'Dietro sei da denuncia.'],
];
const JL_FINE = [
  ['', 'Nel piazzale del tuning c\'è un\'auto appena regolata col motore acceso. Al volante c\'è Jeshka: per il primo giro vuole sentire che lavoro ha fatto lui.'],
  ['', 'Luca sale dal lato del passeggero. Dopo tutto quel tempo sulla strada, guarda ancora se l\'officina si vede nello specchietto.'],
  ['JESHKA', 'Dormi, se vuoi.'],
  ['LUCA', 'Ma figurati. Ti tengo compagnia.'],
  ['', 'Qualche chilometro più avanti, è lei a tirargli su il finestrino.'],
];

// --------------------------------------------------------------------------- la pagina
(function jlPagina() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const css = document.createElement('style');
  css.textContent = `
.jl-box{margin:0 0 12px;padding:12px 14px;border-radius:10px;background:linear-gradient(180deg,rgba(255,46,136,.10),rgba(0,0,0,.35));box-shadow:inset 0 0 0 1px rgba(255,46,136,.28)}
.jl-box p{margin:0 0 8px;font:400 14px/1.5 Georgia,'Times New Roman',serif;color:#efe6f0}
.jl-box p.jl-r{font-style:italic;color:#c9bccd}
.jl-box p b{font:700 11px/1 var(--f-data,monospace);letter-spacing:.14em;color:#ff7ab8;margin-right:6px}
.jl-box .row{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.jl-full{position:fixed;inset:0;z-index:99990;background:#06050a;color:#ece4ee;display:grid;place-items:center;padding:24px;cursor:pointer;text-align:center}
.jl-full .jl-w{max-width:600px}.jl-full .jl-chi{font:700 12px system-ui;letter-spacing:.2em;text-transform:uppercase;opacity:.55;margin-bottom:10px;min-height:14px}
.jl-full .jl-t{font:20px/1.55 Georgia,serif}.jl-full .jl-t.r{font-style:italic;opacity:.8}.jl-full .jl-h{font:12px system-ui;opacity:.38;margin-top:28px}`;
  document.head.appendChild(css);
  const esc = (t) => String(t).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const righe = (r) => r.map(([chi, t]) => chi ? `<p><b>${esc(chi)}</b>${esc(t)}</p>` : `<p class="jl-r">${esc(t)}</p>`).join('');
  // scena a tutto schermo: clic o spazio per andare avanti
  function schermo(lista, fine) {
    let i = 0; const box = document.createElement('div'); box.className = 'jl-full';
    box.innerHTML = '<div class="jl-w"><div class="jl-chi"></div><div class="jl-t"></div><div class="jl-h">clic o spazio per continuare</div></div>';
    const mostra = () => { const [chi, t] = lista[i]; box.querySelector('.jl-chi').textContent = chi; const T = box.querySelector('.jl-t'); T.textContent = t; T.className = 'jl-t' + (chi ? '' : ' r'); };
    const avanti = () => { if (++i >= lista.length) { document.removeEventListener('keydown', tasto, true); box.remove(); if (fine) fine(); } else mostra(); };
    const tasto = (e) => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); e.stopImmediatePropagation(); avanti(); } };
    box.addEventListener('click', avanti); document.addEventListener('keydown', tasto, true);
    document.body.appendChild(box); mostra();
  }
  const G = () => window.nightRun && window.nightRun.game;
  function incontro(g, I, ctx) {
    const extra = jlState(g).segnale ? [['LUCA', 'Ho visto i cinque lampi dal portone. Prima ho pensato alla signora del furgone. Poi ho pensato: no.']] : [];
    schermo(JL_INCONTRO.slice(0, 7).concat(extra, JL_INCONTRO.slice(7)), () => { jlFatto(g, 'incontro', null, I); if (ctx && ctx.save) ctx.save(); if (ctx && ctx.refresh) ctx.refresh(); });
  }
  function panel(body, I, ctx = {}) {
    const g = G(); if (!g || !g.s || !g.s.vg || !I) return null;
    const id = jlScena(g, I.id, I); if (!id) return null;
    if (id === 'arrivo' && jlState(g).segnale) { incontro(g, I, ctx); return null; }   // col segnale si entra dritti nell'incontro
    if (id === 'fine') { schermo(JL_FINE, () => { jlFatto(g, 'fine', null, I); if (ctx.save) ctx.save(); }); return null; }
    const S = JL_SCENE[id], box = document.createElement('div'); box.className = 'jl-box';
    const vai = (k) => {
      const p = S[k]; box.innerHTML = righe(p.r) + '<div class="row"></div>';
      const row = box.querySelector('.row');
      for (const [lbl, dopo, eff, cond] of p.s) {
        if (cond && !cond(g)) continue;
        const b = document.createElement('button'); b.type = 'button'; b.className = 'kbtn'; b.textContent = lbl;
        b.addEventListener('click', () => {
          if (eff === 'lampeggia') { jlState(g).segnale = true; incontro(g, I, ctx); box.remove(); return; }
          if (eff === 'aspetta') { box.remove(); return; }
          if (dopo) { if (eff) box.dataset.eff = eff; vai(dopo); return; }
          jlFatto(g, id, eff || box.dataset.eff || null, I); if (ctx.save) ctx.save(); box.remove();
        });
        row.appendChild(b);
      }
    };
    vai('a'); body.insertBefore(box, body.firstChild); return box;
  }
  window.NightJL = { panel, schermo };
  window.jlDebug = {
    stato: () => G() && jlState(G()),
    // salta a un punto della storia: 'neon2', 'luca2', 'neon3', 'auto', 'incontro'
    vai: (dove) => {
      const g = G(), J = jlState(g);
      const passi = { neon2: () => { J.neon = 1; J.luca = 1; J.quaderno = true; J.stop = {}; }, luca2: () => { J.neon = 2; J.luca = 1; J.nome = true; J.messaggio = true; J.quaderno = true; J.stop = {}; },
        neon3: () => { J.neon = 2; J.luca = 2; J.nome = true; J.messaggio = true; J.cavo = 1; J.stop = {}; }, auto: () => { J.neon = 2; J.luca = 2; J.nome = true; J.cavo = 2; jlFatto(g, 'neon3', 'sali'); } };
      if (passi[dove]) passi[dove](); return J;
    },
    incontro: () => schermo(JL_INCONTRO), fine: () => schermo(JL_FINE),
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { JL, JL_SCENE, jlState, jlScena, jlFatto });
