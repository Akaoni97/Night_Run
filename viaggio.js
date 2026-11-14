// ============================================================================
//  Night Run · Il Viaggio
//  L'autostrada che va solo avanti: si parte dal km 0 sotto casa con un'auto di serie.
//  Bisogni del guidatore, soste (bar, autogrill, benzina, officine, Motel Ovunque con la cassa che ti segue),
//  lavori (passaggi, pacchi, rimorchio, furgone, camion, autobus), autostoppisti, capitoli della storia
//  e qualcosa che ogni tanto non torna.
//  Si appoggia a game.js (StreetGame): aggiunge lo stato in game.s.vg e si aggancia ai suoi metodi.
// ============================================================================

// ---------------------------------------------------------------- la strada: tappe e paesaggi
const VG_STOP0 = 1800, VG_STEP = 3200;                     // prima tappa al km 1,8, poi una ogni 3,2 km
const VG_PATTERN = ['bar', 'fuel', 'grill', 'niko', 'bar', 'motel', 'fuel', 'shop', 'bar', 'grill', 'style', 'motel'];
const VG_BARS = ['Bar Sport', 'Bar della Curva', 'Caffè del Ponte', 'Bar Stella', 'Bar dei Camionisti', 'Bar Luna', 'Caffè Centrale', 'Bar Ultima Sosta'];
const VG_PLACE = {
  bar: { name: (n) => VG_BARS[n % VG_BARS.length], what: 'bar', col: '#ffd23f' },
  grill: { name: () => 'Sosta 24', what: 'autogrill', col: '#ff7a3a' },
  motel: { name: () => 'Motel Ovunque', what: 'motel', col: '#ff5fa8' },
  fuel: { name: () => 'Benzina 24H', what: 'benzinaio', col: '#2ee6ff' },
  niko: { name: () => 'Officina Niko', what: 'meccanico', col: '#5ad1ff' },
  shop: { name: () => 'Da Luca Tuning', what: 'tuning', col: '#ffb000' },
  style: { name: () => 'Neon Kustom', what: 'estetica', col: '#ff2e88' },
};
// il paesaggio cambia lungo la strada: da casa (città) alla pianura, al borgo, al mare, ai monti, alla baia, al deserto… e poi ancora
const VG_ROUTE = [['tokyo', 12], ['bassa', 45], ['sangimignano', 40], ['positano', 50], ['hakone', 45], ['wangan', 55], ['route66', 60]];
const VG_ROUTE_LEN = VG_ROUTE.reduce((a, r) => a + r[1], 0);

const VG = {
  stopX: (n) => VG_STOP0 + n * VG_STEP,
  stopIndex: (x) => Math.round((x - VG_STOP0) / VG_STEP),
  stop(n) {
    const id = VG_PATTERN[((n % VG_PATTERN.length) + VG_PATTERN.length) % VG_PATTERN.length], P = VG_PLACE[id];
    return { x: VG.stopX(n), n, kind: 'place', id, name: P.name(n), what: P.what, col: P.col, at: 0 };
  },
  // luogo della mappa al km dato (il primo tratto è casa: Tokyo; poi il giro si ripete senza la città)
  locAt(km) {
    if (km < VG_ROUTE[0][1]) return 'tokyo';
    let k = (km - VG_ROUTE[0][1]) % (VG_ROUTE_LEN - VG_ROUTE[0][1]);
    for (let i = 1; i < VG_ROUTE.length; i++) { if (k < VG_ROUTE[i][1]) return VG_ROUTE[i][0]; k -= VG_ROUTE[i][1]; }
    return 'bassa';
  },
  // generatore deterministico (stesso seme, stessi eventi)
  hash(n) { const x = Math.sin(n * 91.345 + 47.853) * 43758.5453; return x - Math.floor(x); },
};

// ---------------------------------------------------------------- oggetti nuovi per il bagagliaio
Object.assign(INV, {
  panino: { name: 'Panino', kg: 0.3, price: 4.5, food: 0.45, note: 'Fame −45 %. Si mangia anche guidando.' },
  acqua: { name: 'Bottiglia d\'acqua', kg: 1, price: 1.2, water: 0.5, note: 'Sete −50 %.' },
  caffe: { name: 'Thermos di caffè', kg: 0.6, price: 3.5, sleep: 0.15, water: 0.05, note: 'Sonno −15 %. Non sostituisce un letto.' },
  energetico: { name: 'Bibita energetica', kg: 0.3, price: 3, sleep: 0.22, water: 0.1, note: 'Sonno −22 %, ma il cuore batte forte.' },
  salviette: { name: 'Salviette', kg: 0.2, price: 3, wash: 0.3, note: 'Igiene +30 %. Da fermo.' },
  scatola: { name: 'Scatola da consegnare', kg: 20, price: 0, note: 'Va lasciata al locale scritto sull\'etichetta.' },
  bancale: { name: 'Bancale', kg: 1000, price: 0, note: 'Merce su bancale per il camion.' },
  foto: { name: 'Vecchia fotografia', kg: 0.05, price: 0, note: 'La tua auto davanti a un Motel Ovunque. Sul retro una data di trent\'anni fa.' },
  bomboletta: { name: 'Bomboletta gonfia e ripara', kg: 0.5, price: 18, note: 'Rigonfia la gomma bucata a 1,9 bar e tappa quasi tutto il buco. Arrivi al prossimo gommista.' },
  forata: { name: 'Gomma forata', kg: 12, price: 0, note: 'Niko te la ripara e torna a essere la ruota di scorta.' },
  valigia: { name: 'Valigia della signora', kg: 12, price: 0, note: 'Chiusa. Non è tua. «Me la riporti quando torni indietro.»' },
});
const VG_FOODS = ['panino', 'acqua', 'caffe', 'energetico', 'salviette', 'bomboletta', 'scorta'];

// ---------------------------------------------------------------- mezzi: posti, carico, prezzi (concessionaria del Motel Ovunque)
const VG_SEATS = { v40: 4, supra: 1, r5: 1, b2002: 3, e30: 3, e36: 3, e34: 4, van: 2, truck: 1, bus: 40 };
const VG_CARGO = { van: { kg: 900, slots: 24 }, truck: { kg: 9000, slots: 18 }, bus: { kg: 300, slots: 16 } };
const VG_TRAILER = { kg: 300, slots: 10, mass: 320 };
const VG_SHOP = [
  { id: 'trailer', name: 'Gancio e rimorchietto', price: 1600, km: 20, note: 'Dieci posti e 300 kg in più per le scatole. Più peso, frenate lunghe e sopra i 110 km/h il rimorchio comincia a sbandare.' },
  { id: 'b2002', name: 'BMW 2002 Turbo (usata)', price: 16000, km: 60, car: true, note: 'Turbo anni \'70 e un ritardo leggendario.' },
  { id: 'e30', name: 'BMW M3 E30 (usata)', price: 24000, km: 120, car: true, note: 'Quattro farfalle e un cambio dogleg.' },
  { id: 'e36', name: 'BMW M3 E36 (usata)', price: 21000, km: 120, car: true, note: 'Sei in linea che urla.' },
  { id: 'e34', name: 'BMW M5 E34 (usata)', price: 26000, km: 160, car: true, note: 'La berlina che non sembra.' },
  { id: 'r5', name: 'Renault 5 Turbo 2', price: 30000, km: 220, car: true, note: 'Motore dietro, rally nel sangue.' },
  { id: 'supra', name: 'Toyota Supra RZ', price: 34000, km: 260, car: true, note: 'Il 2JZ. Lo sai.' },
];

// ---------------------------------------------------------------- persone: autostoppisti normali e quelli che ricorderai
const VG_NAMES = ['Marco', 'Giulia', 'Sergio', 'Elena', 'Tommaso', 'Rita', 'Kenji', 'Aiko', 'Bruno', 'Lucia', 'Dario', 'Nadia', 'Hiro', 'Ada', 'Walter', 'Sofia'];
const VG_SMALLTALK = [
  'Dice che sta andando a trovare sua sorella, «più avanti».',
  'Racconta di aver lavorato tutta la vita in un autogrill. «Sempre lo stesso caffè, sempre la stessa gente.»',
  'Ti chiede se hai mai visto la fine della strada. Ride prima che tu risponda.',
  'Dorme quasi subito, con la testa contro il finestrino.',
  'Accende la radio, cerca una stazione, la spegne. «Meglio il motore.»',
  'Ti offre una caramella alla menta. È vecchissima.',
  'Conta i cippi chilometrici a bassa voce.',
  'Parla del tempo, della benzina che costa, della squadra del cuore. Una persona normale. Per fortuna.',
];
const VG_RUMORS = [
  '«Dicono che più avanti la strada si allarga e diventa a dieci corsie. Io non ci credo.»',
  '«Mio nonno diceva che in fondo c\'è un casello. Uno solo. E non accetta contanti.»',
  '«I camionisti vecchi non si fermano mai al motel due volte di fila. Chiedi a loro.»',
  '«L\'autobus delle 4 passa sempre vuoto. Sempre. Ma si ferma lo stesso.»',
  '«Hai notato che i Motel Ovunque hanno tutti la stessa moquette? Anche la stessa macchia davanti alla stanza 7.»',
  '«C\'è chi giura di essere arrivato in fondo ed è tornato. Peccato che non si torni indietro.»',
  '«La benzina più avanti c\'è sempre. Nessuno l\'ha mai vista arrivare.»',
  '«Se di notte vedi un\'auto uguale alla tua, non sorpassarla.»',
];

// capitoli: si leggono al passaggio dei chilometri
const VG_CHAPTERS = [
  { km: 0, title: 'Km 0', text: 'Sotto casa, il motore acceso. In tasca pochi soldi, nel bagagliaio la ruota di scorta. Tutti dicono la stessa cosa: l\'autostrada va solo avanti, e da qualche parte si arriva. Nessuno sa dove. Nessuno è mai tornato a raccontarlo. Metti la prima.' },
  { km: 1, title: 'Il primo cartello', text: 'Un cartello verde, appena fuori dalla città: «AUTOSTRADA · SOLO AVANTI». Sotto, qualcuno ha scritto a pennarello: «buon viaggio».' },
  { km: 10, title: 'Dieci', text: 'Dieci chilometri. Lo specchietto mostra la città, piccola. Poi una curva, e la città non c\'è più.' },
  { km: 25, title: 'La catena', text: 'Hai già visto due cartelli dei Motel Ovunque. «La tua cassa ti aspetta in camera». Dicono che sia il loro vanto: lasci le tue cose in un motel, le ritrovi nel prossimo. Come facciano, nessuno lo chiede.' },
  { km: 50, title: 'Cinquanta', text: 'Ai bar ormai ti salutano. Qualcuno ti chiama per nome. Non ricordi di averlo detto.' },
  { km: 100, title: 'Cento', text: 'Cento chilometri. Il contachilometri della tua auto e quello del viaggio non vanno più d\'accordo di qualche metro. Probabilmente è niente.' },
  { km: 200, title: 'Chi guida da sempre', text: 'Al bar un camionista ti mostra le mani: «Trentotto anni di strada. Mai visto un incrocio. Mai vista un\'uscita aperta. Ma la paga arriva sempre.»' },
  { km: 350, title: 'La mappa', text: 'Trovi una cartina nel cassetto di un motel. È tutta una linea dritta, con i motel segnati a matita. In fondo, dove dovrebbe finire, la carta è strappata.' },
  { km: 500, title: 'Cinquecento', text: 'Mezzo migliaio di chilometri. Paesaggi che non dovrebbero stare uno dopo l\'altro: le risaie, la pianura col Po, il mare, i cedri, il deserto. Nessun confine. Nessuna dogana. Solo la linea bianca.' },
  { km: 750, title: 'Le firme', text: 'Sul registro di un Motel Ovunque sfogli le pagine vecchie. Le firme sono tante, tutte diverse. Una però è la tua, con la tua calligrafia. Di vent\'anni fa.' },
  { km: 1000, title: 'Mille', text: 'Al km 1000 c\'è un cartello nuovo, bianco, enorme: «BENTORNATO». La strada continua. Più avanti, a destra, una casa che conosci: la luce della cucina è accesa, e in strada c\'è un\'auto uguale alla tua, col motore caldo. Qualcuno sta per partire. Tu non ti fermi. La strada va solo avanti.' },
];

// ---------------------------------------------------------------- quello che non torna (eventi rari, sempre più strani coi chilometri)
// where: dove succede (fuel, bar, grill, motel, niko, road, radio, ride) · km: da quanti km in poi · once: una sola volta
const VG_ODD = [
  { id: 'benzina50', where: 'fuel', km: 12, minStops: 4, once: true, title: 'Il benzinaio', text: '«Ragazzo, ti sei mai chiesto perché più avanti c\'è sempre benzina? Chi ce la porta? Io guido da cinquant\'anni e un\'autocisterna non l\'ho mai vista.»' },
  { id: 'solito', where: 'bar', km: 20, once: true, title: 'Il barista', text: 'Il barista ti vede entrare e prende già la tazzina. «Il solito?» Non sei mai stato qui.' },
  { id: 'solito2', where: 'bar', km: 300, once: true, need: 'solito', title: 'Il barista', text: 'Stesso bancone, stessa macchia a forma di Italia, stessa faccia. Mille bar fa. «Il solito?»' },
  { id: 'cassaPresto', where: 'motel', km: 40, once: true, title: 'Reception', text: '«La sua cassa è già in camera, è arrivata stamattina.» Hai deciso di fermarti dieci minuti fa.' },
  { id: 'stanza7', where: 'motel', km: 120, once: true, title: 'Stanza 7', text: 'Anche stavolta ti danno la stanza 7. In ogni Motel Ovunque, da quando sei partito. Non l\'hai mai chiesta.' },
  { id: 'registro', where: 'motel', km: 450, once: true, title: 'Il registro', text: 'Il registro degli ospiti è aperto sul bancone. La tua firma c\'è già. La data è di domani.' },
  { id: 'foto', where: 'motel', km: 300, once: true, gives: 'foto', title: 'La cassa', text: 'Nella cassa c\'è una cosa che non hai messo tu: una vecchia fotografia della tua auto, parcheggiata davanti a questo stesso motel. Sul retro, una data di trent\'anni fa.' },
  { id: 'pesante', where: 'motel', km: 520, once: true, title: 'La cassa', text: 'Stanotte la cassa pesa di più. La apri: dentro non c\'è niente di nuovo. La richiudi. Pesa ancora di più.' },
  { id: 'nonDormire', where: 'grill', km: 80, once: true, title: 'Il vecchio', text: 'Un vecchio seduto al tavolo accanto ti afferra il polso: «Non dormire mai due notti di fila nello stesso motel. Non chiedermi perché. Fallo e basta.»' },
  { id: 'pezzi', where: 'niko', km: 120, once: true, title: 'Il meccanico', text: 'Il meccanico gira intorno alla tua auto. «Questi pezzi li conosco. Li ho montati io, su un\'auto uguale. Tanti anni fa.» Si pulisce le mani e non dice altro.' },
  { id: 'bambino', where: 'fuel', km: 250, once: true, title: 'Il bambino', text: 'Un bambino seduto sul bordo del marciapiede: «Papà dice che quando arriviamo in fondo la mamma ci aspetta.» Ti guardi intorno. Non c\'è nessun papà, non c\'è nessuna auto oltre la tua.' },
  { id: 'ultimaUscita', where: 'road', km: 100, once: true, sign: 'ULTIMA USCITA', title: 'Ultima uscita', text: 'Un cartello: «ULTIMA USCITA». Lo svincolo è chiuso da un muro di mattoni, vecchio, coperto di muschio.' },
  { id: 'scritta', where: 'road', km: 200, once: true, sign: 'SE LEGGI QUESTO SEI GIA PASSATO DI QUI', title: 'Il cartello', text: 'Un pezzo di cartone legato al guardrail, scritto a mano: «SE LEGGI QUESTO, SEI GIÀ PASSATO DI QUI».' },
  { id: 'cippo', where: 'road', km: 180, once: true, cippo: true, title: 'Il cippo', text: 'Km 512, km 513… km 9. Poi km 515. Lo hai visto bene.' },
  { id: 'areaVuota', where: 'road', km: 260, once: true, parked: true, title: 'L\'area di sosta', text: 'Un\'area di sosta piena di auto, tutte coi fari accesi. Dentro, nessuno.' },
  { id: 'gemella', where: 'road', km: 350, once: true, twin: true, title: 'Nella corsia accanto', text: 'Ti affianca un\'auto del tuo stesso colore. Stessa auto. Stessi adesivi. Poi accelera e sparisce.' },
  { id: 'targhe', where: 'radio', km: 150, once: true, title: 'Radio', text: 'Tra due canzoni, una voce piatta legge un elenco di targhe. Una dopo l\'altra. La quinta è la tua.' },
  { id: 'incidente', where: 'radio', km: 500, once: true, title: 'Radio', text: 'Notiziario: «Incidente al chilometro {km10}, coinvolta un\'auto del colore della tua. Nessun ferito, nessun conducente trovato.» Sei al km {km}.' },
  { id: 'motore', where: 'radio', km: 600, once: true, title: 'Radio', text: 'La radio trasmette solo il rumore di un motore. Lo riconosci: è il tuo. Spegni la radio. Il rumore resta lo stesso.' },
  { id: 'odometro', where: 'road', km: 200, glitch: true, title: '', text: '' },
  { id: 'fantasma', where: 'road', km: 40, ghost: true, sleepy: true, title: '', text: '' },
];

// storie a bordo: autostoppisti particolari (compaiono una volta, in ordine di chilometri)
const VG_STORY_PAX = [
  { id: 'kmzero', km: 60, name: 'L\'uomo col cappotto', ask: '«Mi porti al km 0?» Gli dici che il km 0 è dietro. Lui sorride: «Più avanti.»', vanish: true,
    end: 'Ti giri per dirgli che siete arrivati alla prossima uscita. Il sedile è vuoto. Sul cruscotto ci sono 60 euro, piegati in quattro.' },
  { id: 'valigia', km: 140, name: 'La signora con la valigia', ask: 'Una signora elegante, una valigia rigida tra le ginocchia. Non la apre mai.', gives: 'valigia',
    end: 'Scendendo ti mette in mano la valigia. «Me la riporti quando torni indietro.» Prima che tu possa dire che indietro non si torna, è già sparita dietro il guardrail.' },
  { id: 'ragazzo', km: 220, name: 'Il ragazzo', ask: 'Un ragazzo con lo zaino. Sale e ti dice subito: «Sei al km {km}, vero? Io sono al 41.200. Tu sei appena partito.»',
    end: 'Scende senza salutare. Sul sedile ha lasciato un biglietto: «Non fermarti al 1000».' },
  { id: 'ritorno', km: 320, name: '{again}', ask: 'Sul ciglio della strada c\'è {again}. Lo stesso che hai lasciato trecento chilometri fa. Stessi vestiti. «Grazie per l\'altra volta.»',
    end: '«Ci vediamo più avanti», dice scendendo. Ne sembra sicuro.' },
  { id: 'coppia', km: 400, name: 'La coppia', seats: 2, ask: 'Una coppia giovane. Salgono dietro. «Per favore, non guardare nello specchietto finché non scendiamo.»', mirror: true,
    end: 'Le portiere si chiudono. Guardi nello specchietto: il sedile dietro è pieno di sabbia.' },
];

// ---------------------------------------------------------------- stato
function vgFresh() {
  return { on: true, needs: { food: 0.9, water: 0.9, sleep: 0.95, wash: 0.9 }, cassa: [], garage: ['v40'], owned: {}, trailer: false, trailerOn: false,
    pax: [], seen: {}, chapters: {}, stops: 0, fuelStops: 0, lastKm: 0, nextHitch: 1.2, nextOdd: 8, oddCount: 0, lastMotel: -1, sleepAt: null,
    jobs: 0, earned: 0, line: null, horrorT: 0, glitch: 0, blackout: 0, again: null };
}
const vgOn = (game) => !!(game.s && game.s.vg && game.s.vg.on);
const vgKm = (game) => (game.s.dist || 0) / 1000;

// ---------------------------------------------------------------- aggancio a StreetGame
(function hook() {
  const P = StreetGame.prototype;

  // nuova partita del viaggio
  P.startTrip = function () {
    this.reset(); this.mode = 'career';
    this.s.money = 450; this.s.dist = 0; this.s.carId = 'v40';
    this.s.cars = { v40: { km: 0, perks: [], up: 0, fuel: 0.6 } };
    this.s.trunk = [{ kind: 'scorta', kg: 14 }, { kind: 'panino', kg: 0.3 }, { kind: 'acqua', kg: 1 }];
    this.s.vg = vgFresh();
    this.loc = GAME_LOCS[0]; this.s.loc = 'tokyo';
    this.sim.fuel = 0.6; this.sim.damage = 0; this.sim.tireWear = 0;
    this.applyMass();
    this.vgChapter(0);
  };

  // tappe: nel viaggio i luoghi vengono dalla strada infinita
  const pb = P.placesBetween;
  P.placesBetween = function (a, b) {
    if (!vgOn(this)) return pb.call(this, a, b);
    const out = [];
    for (let n = Math.max(0, Math.floor((a - VG_STOP0) / VG_STEP)); VG.stopX(n) <= b; n++) { const x = VG.stopX(n); if (x >= a) out.push(VG.stop(n)); }
    return out;
  };

  // bagagliaio: capacità del mezzo e del rimorchio
  const tf = P.trunkFits;
  P.vgCap = function () {
    const c = VG_CARGO[this.car], v = this.s.vg;
    let kg = c ? c.kg : TRUNK_KG, slots = c ? c.slots : TRUNK_SLOTS;
    if (v && v.trailerOn && !c) { kg += VG_TRAILER.kg; slots += VG_TRAILER.slots; }
    return { kg, slots };
  };
  P.trunkFits = function (kg) {
    if (!vgOn(this)) return tf.call(this, kg);
    const cap = this.vgCap();
    return (this.s.trunk || []).length < cap.slots && this.trunkKg() + kg <= cap.kg;
  };
  // massa: il rimorchio si porta dietro il suo peso
  const am = P.applyMass;
  P.applyMass = function (dm, rearOff) {
    am.call(this, dm, rearOff);
    const v = this.s && this.s.vg;
    if (v && v.on && v.trailerOn && !VG_CARGO[this.car]) this.sim.P.mass += VG_TRAILER.mass;
  };
  // cambio mezzo: nel viaggio solo quelli tuoi, e solo al motel
  const sc = P.switchCar;
  P.switchCar = function (id) {
    if (vgOn(this)) {
      const v = this.s.vg;
      if (!v.garage.includes(id)) return { ok: false, why: 'Non è tua: le auto e i mezzi si comprano al parcheggio del Motel Ovunque' };
      if (!(this.inside && this.inside.id === 'motel')) return { ok: false, why: 'I mezzi si cambiano nel parcheggio del Motel Ovunque' };
      if (v.pax.length) return { ok: false, why: 'Hai ancora passeggeri a bordo' };
      if ((this.s.trunk || []).some((it) => it.kind === 'scatola' || it.kind === 'bancale' || it.kind === 'pacco')) return { ok: false, why: 'Prima consegna la merce che hai a bordo' };
    }
    const ins = this.inside; this.inside = null;              // al motel si è "dentro", ma il cambio si fa nel parcheggio
    const r = sc.call(this, id); this.inside = ins; return r;
  };
  // oggetti nuovi: cibo, bevande, salviette; la valigia non si butta
  const ui = P.useItem;
  P.useItem = function (i) {
    const it = this.s.trunk[i], d = it && INV[it.kind];
    if (it && it.kind === 'bomboletta') {
      const T = this.tyres(), k = T.p.indexOf(Math.min(...T.p));
      if (T.p[k] > 1.9 && !T.leak[k]) return { ok: false, why: 'Nessuna gomma da gonfiare' };
      if (Math.abs(this.sim.v) > 0.5) return { ok: false, why: 'Fermati prima' };
      T.p[k] = Math.max(T.p[k], 1.9); T.leak[k] *= 0.08; this.s.trunk.splice(i, 1); this.applyMass();
      this.say('Schiuma nella gomma: tiene, fino al prossimo gommista', 'buy'); return { ok: true };
    }
    if (it && d && (d.food || d.water || d.sleep || d.wash)) {
      const v = this.s.vg; if (!v) return { ok: false, why: 'Lo tieni per il viaggio' };
      if (d.wash && Math.abs(this.sim.v) > 0.5) return { ok: false, why: 'Le salviette si usano da fermi' };
      const N = v.needs;
      if (d.food) N.food = Math.min(1, N.food + d.food);
      if (d.water) N.water = Math.min(1, N.water + d.water);
      if (d.sleep) N.sleep = Math.min(1, N.sleep + d.sleep);
      if (d.wash) N.wash = Math.min(1, N.wash + d.wash);
      this.s.trunk.splice(i, 1); this.applyMass();
      this.say(`${d.name}: ${d.food ? 'fame ' : ''}${d.water ? 'sete ' : ''}${d.sleep ? 'sonno ' : ''}${d.wash ? 'igiene ' : ''}meglio`.replace(/ meglio$/, ' meglio'), 'buy');
      return { ok: true };
    }
    return ui.call(this, i);
  };
  const di = P.dropItem;
  P.dropItem = function (i) {
    const it = this.s.trunk[i];
    if (it && it.kind === 'valigia' && vgOn(this)) {
      this.s.trunk.splice(i, 1); this.applyMass(); this.s.vg.valigiaBack = true;
      this.say('Lasci la valigia sul ciglio della strada.'); return { ok: true };
    }
    if (it && (it.kind === 'scatola' || it.kind === 'bancale') && vgOn(this)) return { ok: false, why: 'È merce da consegnare: se la butti la paghi tu' };
    return di.call(this, i);
  };
  // entrando in un locale: consegne, linea dell'autobus, quello che non torna
  const ep = P.enterPlace;
  P.enterPlace = function (p) {
    const r = ep.call(this, p);
    if (r && vgOn(this)) { const v = this.s.vg; v.pendingPlace = { id: p.id, n: VG.stopIndex(p.x), name: p.name }; }
    return r;
  };
  // gli eventi casuali della carriera: nel viaggio niente consegne della carriera (ci sono i lavori)
  const sp = P.spawn;
  P.spawn = function () {
    if (vgOn(this)) { const j = this.job; this.job = this.job || { fake: true }; sp.call(this); if (this.job && this.job.fake) this.job = j; return; }
    sp.call(this);
  };
  const up = P.update;
  P.update = function (dt) { const d0 = this.s.dist; up.call(this, dt); this.tyreUpdate(dt, Math.abs(this.s.dist - d0) / 1000); if (vgOn(this)) this.vgUpdate(dt); };

  // ------------------------------------------------------------ gomme (pressione, forature) e consumo medio: in tutte le modalità
  const TYRE_P = 2.3, TYRE_NAMES = ['anteriore sinistra', 'anteriore destra', 'posteriore sinistra', 'posteriore destra'];
  P.tyres = function () {
    const t = this.s.tyres;
    if (!t || !Array.isArray(t.p)) this.s.tyres = { p: [TYRE_P, TYRE_P, TYRE_P, TYRE_P], leak: [0, 0, 0, 0] };
    return this.s.tyres;
  };
  P.tyreUpdate = function (dt, dkm) {
    const T = this.tyres(), sim = this.sim;
    for (let i = 0; i < 4; i++) if (T.leak[i] > 0) T.p[i] = Math.max(0.1, T.p[i] - T.leak[i] * dt * (Math.abs(sim.v) > 1 ? 1 : 0.4));
    // forature: solo nel viaggio, rare, più probabili con le gomme consumate e dopo le botte
    if (vgOn(this) && dkm > 0 && Math.random() < dkm / 260 * (1 + 2 * (sim.tireWear || 0))) {
      const i = Math.floor(Math.random() * 4); if (!T.leak[i]) {
        const fast = Math.random() < 0.3; T.leak[i] = fast ? 0.22 : 0.01 + Math.random() * 0.02;
        this.say(fast ? `Foratura! Gomma ${TYRE_NAMES[i]} a terra: fermati e cambiala (5)` : `La gomma ${TYRE_NAMES[i]} perde pressione piano piano`, 'bad');
      }
    }
    // effetto sulla guida: meno aderenza e più attrito di rotolamento; a terra in velocità si rovina il cerchio
    const f = (q) => Math.max(0.3, Math.min(1, (q - 0.3) / 1.6));
    const drive = sim.P.fwd ? [0, 1] : [2, 3];
    sim.tyreK = Math.pow(Math.min(f(T.p[drive[0]]), f(T.p[drive[1]])), 0.7) * Math.pow(Math.min(...T.p.map(f)), 0.25);
    sim.crrK = 1 + T.p.reduce((a, q) => a + Math.max(0, 2.1 - q), 0) * 0.6;
    if (Math.min(...T.p) < 0.5 && Math.abs(sim.v) > 14) { sim.damage = Math.min(1, sim.damage + dt * 0.004); if (!this.rimWarn) { this.rimWarn = true; this.say('Stai correndo sul cerchione: fermati!', 'bad'); } } else this.rimWarn = false;
    // consumo medio sugli ultimi ~60 km
    const c = this.s.cons || (this.s.cons = { l: 0, km: 0 });
    c.l += (sim.fuelRate || 0) * dt; c.km += dkm;
    if (c.km > 60) { c.l *= 60 / c.km; c.km = 60; }
  };
  P.consumption = function () {
    const c = this.s.cons || { l: 0, km: 0 }, tank = this.sim.fuel * this.sim.P.tank;
    if (c.km < 0.3) return { per100: null, range: null };
    const per100 = c.l / c.km * 100;
    return { per100, range: per100 > 0.1 ? tank / per100 * 100 : null };
  };
  // cambio gomma con la ruota di scorta (da fermi, ci vuole un po')
  P.changeTyre = function () {
    const T = this.tyres(), sim = this.sim, i = T.p.indexOf(Math.min(...T.p));
    if (T.p[i] > 1.9 && !T.leak[i]) return { ok: false, why: 'Le gomme sono a posto' };
    if (Math.abs(sim.v) > 0.5) return { ok: false, why: 'Fermati per cambiare la gomma' };
    const si = this.s.trunk.findIndex((it) => it.kind === 'scorta');
    if (si < 0) return { ok: false, why: 'Non hai la ruota di scorta: bomboletta, soccorso, o la compri al benzinaio' };
    if (this.ap) return { ok: false, why: 'Aspetta' };
    this.s.trunk.splice(si, 1); this.say('Crick, bulloni, ruota di scorta…', 'buy');
    this.stopAt(null, () => {});
    const ap = this.ap; ap.tick = () => {
      if (ap.t > 14 && this.ap === ap) {
        T.p[i] = TYRE_P; T.leak[i] = 0; this.ap = null;
        if (!this.addItem('forata')) this.say('La gomma forata non ci sta nel bagagliaio: la lasci sul ciglio della strada');
        this.applyMass(); this.say(`Gomma ${TYRE_NAMES[i]} cambiata. Fai riparare quella forata da Niko.`, 'buy');
      }
    };
    return { ok: true };
  };
  P.inflate = function () { const T = this.tyres(); for (let i = 0; i < 4; i++) if (T.leak[i] < 0.05) T.p[i] = TYRE_P; return { ok: true }; };
  P.repairTyre = function () {
    const i = this.s.trunk.findIndex((it) => it.kind === 'forata'); if (i < 0) return { ok: false, why: 'Non hai gomme forate da riparare' };
    if (this.s.money < 25) return { ok: false, why: 'Costa € 25' };
    this.s.money -= 25; this.s.trunk[i] = { kind: 'scorta', kg: 14 }; this.applyMass(); this.say('Niko ripara la gomma: è di nuovo la ruota di scorta (− € 25)', 'buy'); return { ok: true };
  };

  // ------------------------------------------------------------ ciclo del viaggio
  P.vgUpdate = function (dt) {
    const v = this.s.vg, sim = this.sim, km = vgKm(this), dkm = Math.max(0, km - v.lastKm);
    v.lastKm = km;
    if (this.mode !== 'career') return;
    // paesaggio della strada
    const lid = VG.locAt(km);
    if ((!this.loc || this.loc.id !== lid) && !this.inside && !this.prompt && !this.ap && !this.race) {
      const was = this.loc && this.loc.id; this.setLoc(lid);
      if (was && was !== lid) this.say(`${this.loc.name}. Non ricordi di aver passato un confine.`, 'info');
    }
    // bisogni: con i km e col tempo (di più a motore acceso)
    const N = v.needs, t = dt / 60;
    const tired = 1 + (v.sleepAt !== null && km - v.sleepAt > 150 ? 0.5 : 0);
    N.food = Math.max(0, N.food - dkm / 60 - t * 0.003);
    N.water = Math.max(0, N.water - dkm / 45 - t * 0.004);
    N.sleep = Math.max(0, N.sleep - dkm / 140 * tired - t * 0.002);
    N.wash = Math.max(0, N.wash - dkm / 180 - t * 0.001);
    const low = Math.min(N.food, N.water, N.sleep);
    for (const k of ['food', 'water', 'sleep', 'wash']) {
      const was = v['warn' + k] || 0, lvl = N[k] < 0.08 ? 2 : N[k] < 0.25 ? 1 : 0;
      if (lvl > was) this.say({ food: ['Ti brontola lo stomaco', 'Hai fame: ti tremano le mani'], water: ['Hai la gola secca', 'Hai una sete che non vedi niente'], sleep: ['Ti si chiudono gli occhi', 'Stai per addormentarti al volante'], wash: ['Ti senti appiccicoso', 'I passeggeri aprono il finestrino'] }[k][lvl - 1], 'bad');
      v['warn' + k] = lvl;
    }
    // sonno: colpi di sonno sempre più frequenti; a zero ti addormenti
    v.blackout = Math.max(0, v.blackout - dt * 1.4);
    if (Math.abs(sim.v) > 3 && N.sleep < 0.22 && !v.blackout && Math.random() < dt * (0.22 - N.sleep) * 0.9) {
      v.blackout = 1; if (Math.random() < 0.5 && !this.race && !this.ap) { this.lane = Math.max(1, Math.min(3, this.lane + (Math.random() < 0.5 ? 1 : -1))); this.manualT = 2; }
      this.say('Colpo di sonno!', 'bad');
    }
    // fame e sete a zero: le mani non rispondono bene (il gas va e viene)
    v.weak = low < 0.08 ? 1 : 0;
    // rimorchio sopra i 110 km/h: sbanda
    v.sway = v.trailerOn && !VG_CARGO[this.car] ? Math.max(0, (Math.abs(sim.v) * 3.6 - 110) / 30) : 0;
    if (v.sway > 0.6 && Math.random() < dt * v.sway * 0.4 && !this.race) { this.say('Il rimorchio sbanda: rallenta!', 'bad'); sim.v *= 0.985; }
    // capitoli
    for (const c of VG_CHAPTERS) if (km >= c.km && !v.chapters[c.km]) { if (!this.prompt) this.vgChapter(c.km); break; }
    // locale appena raggiunto (si gestisce quando si è dentro)
    if (v.pendingPlace && this.inside && this.inside.phase === 'shop') { this.vgArrive(v.pendingPlace); v.pendingPlace = null; }
    // passeggeri: comfort e arrivo
    this.vgRide(dt, km);
    // autostoppisti al bordo strada
    this.vgHitch(dt, km);
    // linea dell'autobus: fermate lungo la strada
    // quello che non torna
    v.glitch = Math.max(0, v.glitch - dt);
    if (km > v.nextOdd && !this.prompt && !this.inside && !this.race && !this.ap) this.vgOdd('road', km);
    // cippi chilometrici: cartelli speciali piazzati poco avanti
    this.ents = this.ents.filter((e) => !(e.kind === 'vgsign' || e.kind === 'parked') || e.x - this.s.dist > -150);
  };

  P.vgChapter = function (k) {
    const v = this.s.vg, c = VG_CHAPTERS.find((q) => q.km === k); if (!c) return;
    v.chapters[k] = true;
    this.prompt = null;
    this.ask({ kind: 'story', title: c.title, text: c.text, time: 40, options: [{ label: k === 0 ? 'Parti' : 'Continua' }] });
  };

  // ------------------------------------------------------------ autostoppisti
  P.vgSeats = function () { return VG_SEATS[this.car] || 3; };
  P.vgHitch = function (dt, km) {
    const v = this.s.vg, d = this.s.dist;
    if (this.car === 'bus' || this.race) return;
    // compare al bordo strada più avanti
    if (km > v.nextHitch && !this.ents.some((e) => e.kind === 'hitch')) {
      v.nextHitch = km + 2.5 + Math.random() * 4.5;
      if (v.pax.length >= this.vgSeats()) return;
      const story = VG_STORY_PAX.find((s) => km >= s.km && !v.seen['pax_' + s.id] && (s.id !== 'ritorno' || v.again) && (s.seats || 1) <= this.vgSeats() - v.pax.length);
      v.recent = v.recent || [];
      const free = VG_NAMES.filter((nm) => !v.recent.includes(nm) && nm !== v.again);
      const name = story ? story.name.replace('{again}', v.again || '') : free[Math.floor(Math.random() * free.length)];
      if (!story) { v.recent.push(name); if (v.recent.length > 8) v.recent.shift(); }
      const far = 3 + Math.floor(Math.random() * 14);
      this.ents.push({ id: this.id++, kind: 'hitch', lane: 0, x: d + 260 + Math.random() * 120, v: 0, name, story: story ? story.id : null,
        to: Math.round(km + far), pay: Math.round(18 + far * (3.5 + Math.random() * 2)) });
    }
    // ci si ferma accanto: la domanda
    for (const e of this.ents) {
      if (e.kind !== 'hitch' || e.asked) continue;
      const rel = e.x - d;
      if (rel < 30 && rel > -18 && Math.abs(this.sim.v) < 1.6 && !this.prompt) {
        e.asked = true;
        const st = e.story && VG_STORY_PAX.find((s) => s.id === e.story);
        const txt = st ? st.ask.replace('{km}', Math.floor(km)).replace('{again}', v.again || '') : `${e.name} chiede un passaggio fino al km ${e.to}. Pagherebbe circa € ${e.pay}, mancia compresa se guidi bene.`;
        this.ask({ kind: 'hitch', title: st ? st.name.replace('{again}', v.again || '') : 'Autostoppista', text: txt, time: 14, options: [
          { label: 'Sali', act: () => this.vgBoard(e) },
          { label: 'No, mi spiace', act: () => { e.done = true; this.say(`${e.name} abbassa il pollice.`); } },
        ] });
      }
      if (rel < -60) e.done = true;
    }
  };
  P.vgBoard = function (e) {
    const v = this.s.vg, st = e.story && VG_STORY_PAX.find((s) => s.id === e.story);
    if (v.pax.length + ((st && st.seats) || 1) > this.vgSeats()) { this.say('Non c\'è posto', 'bad'); return; }
    e.done = true;
    const p = { name: e.name, to: st ? Math.floor(vgKm(this)) + 6 + Math.floor(Math.random() * 6) : e.to, pay: e.pay, harsh: 0, from: vgKm(this), story: e.story, talk: 0 };
    if (st) { v.seen['pax_' + st.id] = true; p.pay = st.id === 'kmzero' ? 60 : 30; }
    v.pax.push(p);
    if (!st && !v.again && Math.random() < 0.5) v.again = e.name;
    this.say(`${e.name} sale a bordo: scende al km ${p.to}`, 'job');
  };
  P.vgRide = function (dt, km) {
    const v = this.s.vg, sim = this.sim;
    for (const p of v.pax) {
      // guida brusca, eccesso di velocità e botte abbassano la mancia
      p.harsh += dt * ((Math.abs(sim.acc || 0) > 4.5 ? 1 : 0) + (Math.abs(sim.v) * 3.6 > 135 ? 0.6 : 0)) * 0.08;
      p.talk += dt;
      if (p.talk > 45 && !p.said && !p.story && !this.prompt) { p.said = true; this.say(`${p.name}: ${VG_SMALLTALK[Math.floor(Math.random() * VG_SMALLTALK.length)]}`, 'info'); }
      const st = p.story && VG_STORY_PAX.find((s) => s.id === p.story);
      if (st && st.mirror) v.mirror = 1;
      // chi non scende: sparisce a metà strada
      if (st && st.vanish && km > p.from + 3 && !p.gone) { p.gone = true; }
      if (km >= p.to - 0.05 && !p.leaving && !this.ap && !this.race) {
        p.leaving = true;
        const stopX = Math.max(this.s.dist + 40, p.to * 1000);
        this.stopAt(stopX, () => { this.vgDrop(p); const ap = this.ap; if (ap) ap.tick = () => { if (ap.t > 1.4 && this.ap === ap) this.ap = null; }; });   // scende, saluta, si riparte
      }
    }
  };
  P.vgDrop = function (p) {
    const v = this.s.vg, st = p.story && VG_STORY_PAX.find((s) => s.id === p.story);
    v.pax = v.pax.filter((q) => q !== p); v.mirror = 0;
    const wash = v.needs.wash < 0.3 ? 0.5 : 1;
    const pay = Math.max(5, Math.round(p.pay * Math.max(0.3, 1.15 - p.harsh) * wash));
    this.s.money += pay; v.earned += pay; v.jobs++;
    if (st) {
      if (st.gives) { if (!this.addItem(st.gives)) v.cassa.push({ kind: st.gives, kg: INV[st.gives].kg }); }
      this.ask({ kind: 'story', title: st.name.replace('{again}', v.again || ''), text: st.end + `\n\n+ € ${pay}`, time: 30, options: [{ label: 'Riparti' }] });
    } else this.say(`${p.name} scende al km ${p.to}: + € ${pay}${p.harsh > 0.3 ? ' (poca mancia: guida più dolce)' : wash < 1 ? ' (ha storto il naso: lavati)' : ' con la mancia'}`, 'money');
  };

  // ------------------------------------------------------------ arrivo in un locale
  P.vgArrive = function (pl) {
    const v = this.s.vg;
    v.stops++; if (pl.id === 'fuel') v.fuelStops++;
    // consegne: la merce con questa tappa come destinazione
    let got = 0, n = 0;
    this.s.trunk = this.s.trunk.filter((it) => { if ((it.kind === 'scatola' || it.kind === 'bancale') && it.to === pl.n) { got += it.pay || 0; n++; return false; } return true; });
    if (n) { this.applyMass(); this.s.money += got; v.earned += got; v.jobs += n; this.say(`Consegnato: ${n} ${n === 1 ? 'collo' : 'colli'} a ${pl.name}, + € ${got}`, 'money'); }
    // la valigia torna sempre
    if (pl.id === 'motel' && v.valigiaBack) { v.valigiaBack = false; v.cassa.push({ kind: 'valigia', kg: 12 }); this.say('Nella cassa c\'è la valigia della signora. Non ricordi di avercela messa.', 'bad'); }
    // linea dell'autobus: alla fermata scendono e salgono
    if (this.car === 'bus' && v.line) this.vgBusStop(pl);
    this.vgOdd(pl.id, vgKm(this));
  };

  // ------------------------------------------------------------ lavori: bacheca dei locali
  P.vgOffers = function (n) {
    const car = this.car, offers = [], h = (k) => VG.hash(n * 13 + k);
    const kind = car === 'truck' ? 'bancale' : 'scatola';
    const base = car === 'truck' ? 1000 : car === 'van' ? 120 : this.s.vg.trailerOn ? 40 : 10;
    for (let k = 0; k < 3; k++) {
      const hops = 1 + Math.floor(h(k) * 6), to = n + hops, dest = VG.stop(to), kmTo = (dest.x / 1000);
      const kg = Math.round(base * (1 + h(k + 5) * (car === 'truck' ? 1 : 3)));
      const pay = Math.round((12 + hops * 3.2 * (car === 'truck' ? 9 : car === 'van' ? 2.4 : 1) * (1 + kg / (base * 3))) * (car === 'truck' ? 6 : 1) / 5) * 5;
      offers.push({ k, kind, kg, to, toName: dest.name, kmTo: Math.round(kmTo * 10) / 10, pay });
    }
    return offers;
  };
  P.vgTake = function (o, n) {
    const v = this.s.vg; v.taken = v.taken || {};
    const key = n + ':' + o.k; if (v.taken[key]) return { ok: false, why: 'Già presa' };
    if (!this.trunkFits(o.kg)) return { ok: false, why: this.car === 'truck' || this.car === 'van' || v.trailerOn ? 'Non ci sta: il carico è pieno' : 'Non ci sta nel bagagliaio: serve il rimorchietto o un furgone' };
    v.taken[key] = true;
    this.s.trunk.push({ kind: o.kind, kg: o.kg, to: o.to, pay: o.pay, name: `${INV[o.kind].name} per ${o.toName} (km ${o.kmTo})` });
    this.applyMass();
    this.say(`Carico ${o.kg} kg per ${o.toName}, km ${o.kmTo}: € ${o.pay} alla consegna`, 'job');
    return { ok: true };
  };
  // autobus: si prende una linea al motel o all'autogrill; a ogni locale salgono e scendono persone
  P.vgStartLine = function (n) {
    const v = this.s.vg; if (this.car !== 'bus') return { ok: false, why: 'Serve l\'autobus' };
    v.line = { from: n, to: n + 8, onboard: 0, earned: 0 };
    this.say('Linea notturna: otto fermate. Biglietti a bordo.', 'job'); return { ok: true };
  };
  P.vgBusStop = function (pl) {
    const v = this.s.vg, L = v.line;
    const off = Math.floor(L.onboard * (0.2 + Math.random() * 0.4)), on = pl.n >= L.to ? 0 : Math.floor(Math.random() * 9);
    L.onboard = Math.min(40, L.onboard - off + on);
    const pay = on * 6; L.earned += pay; this.s.money += pay; v.earned += pay;
    this.say(`Fermata ${pl.name}: scendono ${off}, salgono ${on} (+ € ${pay})${L.onboard ? `, a bordo ${L.onboard}` : ''}`, 'money');
    if (pl.n >= L.to) { this.say(`Fine linea: incassati € ${L.earned}`, 'money'); v.line = null; v.jobs++; }
    if (Math.random() < 0.12 && !v.seen.busEmpty && vgKm(this) > 420) {
      v.seen.busEmpty = true;
      this.ask({ kind: 'story', title: 'L\'ultimo passeggero', text: 'Un passeggero sale, timbra il biglietto e va in fondo. Allo specchio il fondo dell\'autobus è vuoto. Il biglietto timbrato è sul cruscotto: «km 0».', time: 30, options: [{ label: 'Riparti' }] });
    }
  };

  // ------------------------------------------------------------ servizi dei locali
  P.vgPay = function (eur, what) {
    if (this.s.money < eur) return { ok: false, why: `Costa € ${eur}` };
    this.s.money -= eur; if (what) this.say(`${what}: − € ${eur}`, 'buy'); return { ok: true };
  };
  P.vgEat = function (food, water, eur, what) {
    const r = this.vgPay(eur, what); if (!r.ok) return r;
    const N = this.s.vg.needs; N.food = Math.min(1, N.food + food); N.water = Math.min(1, N.water + water); return r;
  };
  P.vgShower = function (eur) { const r = this.vgPay(eur, 'Doccia'); if (r.ok) this.s.vg.needs.wash = 1; return r; };
  P.vgSleep = function () {
    const v = this.s.vg, km = vgKm(this), n = this.inside ? VG.stopIndex(this.inside.x) : -1;
    const r = this.vgPay(45, 'Notte al Motel Ovunque, stanza 7'); if (!r.ok) return r;
    v.needs.sleep = 1; v.needs.wash = Math.min(1, v.needs.wash + 0.2); v.needs.food = Math.max(0, v.needs.food - 0.15); v.needs.water = Math.max(0, v.needs.water - 0.2);
    if (v.lastMotel === n - 6 && km > 60 && !v.seen.dueNotti) {   // il vecchio lo aveva detto
      v.seen.dueNotti = true;
      this.ask({ kind: 'story', title: 'Di notte', text: 'Ti svegli alle 3:33. Fuori dalla finestra, nel parcheggio, c\'è la tua auto coi fari accesi e qualcuno al volante. Ti riaddormenti senza volerlo. Al mattino il serbatoio ha qualche litro in meno.', time: 30, options: [{ label: 'Colazione' }] });
      this.sim.fuel = Math.max(0.05, this.sim.fuel - 0.06);
    }
    v.lastMotel = n; v.sleepAt = km;
    return r;
  };
  P.vgBuy = function (id) {
    const v = this.s.vg, it = VG_SHOP.find((q) => q.id === id); if (!it) return { ok: false };
    if (v.owned[id] || v.garage.includes(id)) return { ok: false, why: 'Ce l\'hai già' };
    if (vgKm(this) < it.km) return { ok: false, why: `In vendita dal km ${it.km}` };
    if (it.need && !v.owned[it.need]) return { ok: false, why: `Serve prima la ${VG_SHOP.find((q) => q.id === it.need).name}` };
    const r = this.vgPay(it.price, it.name); if (!r.ok) return r;
    if (id === 'trailer') { v.trailer = true; v.trailerOn = true; this.applyMass(); }
    else if (id.startsWith('lic')) v.owned[id] = true;
    else { v.garage.push(id); this.carState(id); }
    v.owned[id] = true;
    return { ok: true };
  };
  P.vgTrailer = function (on) {
    const v = this.s.vg; if (!v.trailer) return { ok: false, why: 'Non hai il rimorchio' };
    if (VG_CARGO[this.car]) return { ok: false, why: 'Il rimorchio si attacca alle auto' };
    if (!on && (this.s.trunk || []).length > TRUNK_SLOTS) return { ok: false, why: 'Prima scarica: nel bagagliaio non ci sta tutto' };
    v.trailerOn = on; this.applyMass(); return { ok: true };
  };
  // cassa del motel: si sposta con te di motel in motel
  P.vgToCassa = function (i) { const it = this.s.trunk[i]; if (!it || it.kind === 'scatola' || it.kind === 'bancale') return { ok: false, why: 'La merce resta a bordo' }; this.s.trunk.splice(i, 1); this.s.vg.cassa.push(it); this.applyMass(); return { ok: true }; };
  P.vgFromCassa = function (i) { const it = this.s.vg.cassa[i]; if (!it) return { ok: false }; if (!this.trunkFits(it.kg)) return { ok: false, why: 'Nel bagagliaio non ci sta' }; this.s.vg.cassa.splice(i, 1); this.s.trunk.push(it); this.applyMass(); return { ok: true }; };

  // ------------------------------------------------------------ quello che non torna
  P.vgOdd = function (where, km) {
    const v = this.s.vg;
    if (where === 'road') v.nextOdd = km + 6 + Math.random() * 10 * Math.max(0.35, 1 - km / 1500);
    const sleepy = v.needs.sleep < 0.3;
    // più raro all'inizio, più frequente coi chilometri e col sonno
    const chance = where === 'road' ? 0.35 + Math.min(0.4, km / 1500) + (sleepy ? 0.25 : 0) : 0.3 + Math.min(0.45, km / 1200);
    if (Math.random() > chance) return;
    const pool = VG_ODD.filter((o) => (o.where === where || (where === 'road' && o.where === 'radio')) && km >= o.km && !(o.once && v.seen[o.id]) && (!o.need || v.seen[o.need])
      && (!o.minStops || v.fuelStops >= o.minStops) && (!o.sleepy || sleepy));
    if (!pool.length) return;
    const o = pool[Math.floor(Math.random() * pool.length)];
    v.seen[o.id] = true; v.oddCount++;
    const d = this.s.dist;
    if (o.glitch) { v.glitch = 0.9; return; }
    if (o.ghost) { this.ents.push({ id: this.id++, kind: 'ghost', lane: 1 + Math.floor(Math.random() * 3), x: d + 40 + Math.random() * 60, v: Math.max(0, this.sim.v), ttl: 6 }); return; }
    if (o.sign || o.cippo) this.ents.push({ id: this.id++, kind: 'vgsign', lane: 0, x: d + 240, v: 0, text: o.sign || 'KM 9', cippo: !!o.cippo, wall: o.id === 'ultimaUscita' });
    if (o.parked) for (let q = 0; q < 6; q++) this.ents.push({ id: this.id++, kind: 'parked', lane: 0, x: d + 220 + q * 7, v: 0, color: GAME_COLORS[q % GAME_COLORS.length] });
    if (o.twin) { const e = this.spawnTraffic(d - 30, this.lane === 1 ? 2 : 1); if (e) { e.vt = 'sedan'; e.twin = true; e.v = this.sim.v + 9; e.color = parseInt(String(this.paintHex || '#c81d11').slice(1), 16); } }
    if (o.gives) v.cassa.push({ kind: o.gives, kg: INV[o.gives].kg });
    const text = o.text.replace('{km10}', Math.floor(km) + 10).replace('{km}', Math.floor(km));
    if (where === 'road' && (o.sign || o.cippo || o.parked)) { setTimeout(() => this.ask({ kind: 'odd', title: o.title, text, time: 18, options: [{ label: '…' }] }), 6000); return; }
    this.ask({ kind: 'odd', title: o.title, text, time: 22, options: [{ label: '…' }] });
  };

  // stato per l'interfaccia
  P.vgView = function () {
    const v = this.s.vg; if (!v) return null;
    return { km: vgKm(this), needs: v.needs, pax: v.pax.map((p) => ({ name: p.gone ? '' : p.name, to: p.to })), seats: this.vgSeats(), blackout: v.blackout, glitch: v.glitch, mirror: v.mirror || 0, weak: v.weak, sway: v.sway || 0, cap: this.vgCap(), kg: this.trunkKg(), line: v.line };
  };
})();

if (typeof window !== 'undefined') Object.assign(window, { VG, VG_SHOP, VG_CHAPTERS, VG_ODD, VG_STORY_PAX, VG_FOODS, VG_SEATS, VG_RUMORS, vgOn });
