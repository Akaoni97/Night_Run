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
  bomboletta: { name: 'Bomboletta gonfia e ripara', kg: 0.5, price: 18, note: 'Rigonfia la gomma bucata a 1,9 bar e tappa quasi tutto il buco. Arrivi al prossimo gommista.' },
  forata: { name: 'Gomma forata', kg: 12, price: 0, note: 'Niko te la ripara e torna a essere la ruota di scorta.' },
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

// le auto del pacchetto del giocatore si comprano alla concessionaria del motel; posti a sedere secondo la carrozzeria
for (const c of GEN_CARS) if (c.buy && !VG_SHOP.some((q) => q.id === c.id)) VG_SHOP.push({ id: c.id, name: c.name, price: c.buy.price, km: c.buy.km, car: true, note: c.tag });
Object.assign(VG_SEATS, { a80: 4, a3: 4, a112: 3, panda: 4, punto: 4, golf: 4, corsa: 4, p205: 4, p206: 4, p308: 4, clio: 4, williams: 4, taxi: 4, v850: 4, polo: 4, doblo: 4, ambulanza: 2, polizia: 4 });

// ---------------------------------------------------------------- persone: autostoppisti normali e quelli che ricorderai
const VG_NAMES = ['Marco', 'Giulia', 'Sergio', 'Elena', 'Tommaso', 'Rita', 'Kenji', 'Aiko', 'Bruno', 'Lucia', 'Dario', 'Nadia', 'Hiro', 'Ada', 'Walter', 'Sofia'];
const VG_SMALLTALK = [
  'Dice che sta andando a trovare sua sorella.',
  'Racconta di aver lavorato tutta la vita in un autogrill. «Sempre lo stesso caffè, sempre la stessa gente.»',
  'Dorme quasi subito, con la testa contro il finestrino.',
  'Accende la radio, cerca una stazione, la spegne. «Meglio il motore.»',
  'Ti offre una caramella alla menta.',
  'Parla del tempo, della benzina che costa, della squadra del cuore.',
];
const VG_RUMORS = [
  '«Dicono che più avanti la strada si allarga e diventa a dieci corsie. Io non ci credo.»',
  '«Il caffè del Sosta 24 è il migliore della tratta. Chiedi la miscela della casa.»',
  '«Ai Motel Ovunque la cassa arriva sempre prima di te. Sono organizzati, quelli.»',
  '«Se hai fame fermati al prossimo autogrill: dopo c\'è un lungo tratto senza niente.»',
];

// capitoli: si leggono al passaggio dei chilometri. Per ora solo la partenza: il resto lo scrive la nuova storia
// (km, title, text; ogni capitolo si legge una volta)
const VG_CHAPTERS = [
  { km: 0, title: 'Km 0', text: 'La Volvo di tuo zio, il motore ancora freddo. In tasca pochi soldi, nel bagagliaio la ruota di scorta. Davanti l\'autostrada, e un cartello solo: «SOLO AVANTI». Al bar del km 1,8 qualcuno ti aspetta con un lavoro: un pacco da portare al benzinaio dopo, pagano diecimila. Metti la prima.' },
];

// ---------------------------------------------------------------- eventi strani (per ora vuoto: li scrive la nuova storia)
// Ogni evento: id, where (dove succede: fuel, bar, grill, motel, niko, road, radio, ride), km (da quanti km in poi), once (una sola volta),
// need (id di un evento già visto), title e text (il messaggio). Effetti già pronti: sign (cartello scritto a mano), cippo, parked, twin,
// ghost, glitch, gives (un oggetto nella cassa del motel). Il testo può usare {km} e {km10}.
const VG_ODD = [];

// storie a bordo: autostoppisti particolari (per ora vuoto: li scrive la nuova storia)
// Ogni passeggero: id, km (da quanti km compare, una volta), name, ask (cosa dice quando lo incontri), end (cosa succede quando scende),
// e al bisogno vanish (sparisce a metà strada), gives (oggetto che lascia), seats (posti occupati), mirror (lo specchietto cambia).
const VG_STORY_PAX = [];

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
    if (v && v.on && v.trailerOn && !VG_CARGO[this.car]) this.sim.trailerKg = VG_TRAILER.mass;   // ha le sue ruote: spinge, non pesa sugli assi
  };
  // cambio mezzo: nel viaggio solo quelli tuoi, e solo al motel
  const sc = P.switchCar;
  P.switchCar = function (id) {
    if (vgOn(this)) {
      const v = this.s.vg;
      if (!v.garage.includes(id)) return { ok: false, why: typeof DL !== 'undefined' ? 'Non è tua: le auto si comprano all\'Autosalone Notte' : 'Non è tua: le auto e i mezzi si comprano al parcheggio del Motel Ovunque' };
      if (!(this.inside && this.inside.id === 'motel')) return { ok: false, why: 'I mezzi si cambiano nel parcheggio del Motel Ovunque' };
      if (v.pax.length) return { ok: false, why: 'Hai ancora passeggeri a bordo' };
      if ((this.s.trunk || []).some((it) => it.kind === 'scatola' || it.kind === 'bancale' || it.kind === 'pacco')) return { ok: false, why: 'Prima consegna la merce che hai a bordo' };
    }
    const ins = this.inside, ap = this.ap; this.inside = null;   // al motel si è "dentro", ma il cambio si fa nel parcheggio
    if (ins && Math.abs(this.sim.v) < 0.5) this.ap = null;    // fermo davanti all'ingresso: l'accosto automatico non conta
    const r = sc.call(this, id); this.inside = ins; this.ap = ap; return r;
  };
  // oggetti nuovi: cibo, bevande, salviette
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
  // un salvataggio con oggetti che non esistono più (per esempio quelli della vecchia storia) li perde invece di rompersi
  const ld = P.load;
  P.load = function (json) {
    const r = ld.call(this, json), ok = (it) => it && INV[it.kind];
    if (Array.isArray(this.s.trunk)) this.s.trunk = this.s.trunk.filter(ok);
    if (this.s.vg && Array.isArray(this.s.vg.cassa)) this.s.vg.cassa = this.s.vg.cassa.filter(ok);
    return r;
  };
  const di = P.dropItem;
  P.dropItem = function (i) {
    const it = this.s.trunk[i];
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
        this.say(fast ? `Foratura! Gomma ${TYRE_NAMES[i]} a terra: fermati e cambiala (9)` : `La gomma ${TYRE_NAMES[i]} perde pressione piano piano`, 'bad');
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
    let got = 0, n = 0, first = false;
    this.s.trunk = this.s.trunk.filter((it) => { if ((it.kind === 'scatola' || it.kind === 'bancale') && it.to === pl.n) { got += it.pay || 0; n++; if (it.first) first = true; return false; } return true; });
    if (first) { v.firstDone = true; this.fx.push({ k: 'missionDone', pay: VG_FIRST.pay }); this.say(`Primo lavoro fatto! Il benzinaio firma senza guardarti in faccia e ti conta i soldi sul cofano: + € ${VG_FIRST.pay.toLocaleString('it-IT')}. Adesso puoi comprare pezzi, benzina, un'altra auto.`, 'money'); }
    if (n) { this.applyMass(); this.s.money += got; v.earned += got; v.jobs += n; this.say(`Consegnato: ${n} ${n === 1 ? 'collo' : 'colli'} a ${pl.name}, + € ${got}`, 'money'); }
    // linea dell'autobus: alla fermata scendono e salgono
    if (this.car === 'bus' && v.line) this.vgBusStop(pl);
    this.vgOdd(pl.id, vgKm(this));
  };

  // ------------------------------------------------------------ lavori: bacheca dei locali
  // prima missione: al primo locale c'è un pacco da portare alla tappa dopo, paga € 10.000 (soldi da spendere subito)
  const VG_FIRST = { pay: 10000, kg: 4, from: 0, to: 1 };
  P.vgFirstOffer = function () {
    const dest = VG.stop(VG_FIRST.to);
    return { k: 'primo', kind: 'scatola', kg: VG_FIRST.kg, to: VG_FIRST.to, toName: dest.name, kmTo: Math.round(dest.x / 100) / 10, pay: VG_FIRST.pay, first: true };
  };
  // obiettivo da mostrare a schermo finché la prima missione non è finita
  P.vgGoal = function () {
    const v = this.s.vg; if (!v || v.firstDone) return null;
    const km = vgKm(this), carried = this.s.trunk.some((it) => it.first), A = VG.stop(VG_FIRST.from), B = VG.stop(VG_FIRST.to);
    const at = carried ? B : A, left = Math.max(0, at.x / 1000 - km);
    return carried
      ? { title: 'Consegna il pacco', text: `${B.name} · km ${(B.x / 1000).toFixed(1).replace('.', ',')}`, left, pay: VG_FIRST.pay, x: B.x }
      : { title: 'Primo lavoro', text: `Ritira il pacco a ${A.name} (bacheca)`, left, pay: VG_FIRST.pay, x: A.x };
  };
  P.vgOffers = function (n) {
    const car = this.car, offers = [], h = (k) => VG.hash(n * 13 + k);
    if (n === VG_FIRST.from && !this.s.vg.firstDone) offers.push(this.vgFirstOffer());
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
    this.s.trunk.push({ kind: o.kind, kg: o.kg, to: o.to, pay: o.pay, first: !!o.first, name: o.first ? `Il pacco sigillato per ${o.toName} (km ${o.kmTo})` : `${INV[o.kind].name} per ${o.toName} (km ${o.kmTo})` });
    this.applyMass();
    if (o.first) { this.say(`Il barista ti dà un pacco sigillato, pesante il giusto. «Portalo a ${o.toName}, al km ${o.kmTo}. Ti pagano lì.»`, 'job'); this.fx.push({ k: 'mission' }); }
    else this.say(`Carico ${o.kg} kg per ${o.toName}, km ${o.kmTo}: € ${o.pay} alla consegna`, 'job');
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
    const r = this.vgPay(45, 'Notte al Motel Ovunque'); if (!r.ok) return r;
    v.needs.sleep = 1; v.needs.wash = Math.min(1, v.needs.wash + 0.2); v.needs.food = Math.max(0, v.needs.food - 0.15); v.needs.water = Math.max(0, v.needs.water - 0.2);
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
    if (o.twin) { const e = this.spawnTraffic(d - 30, this.lane === 1 ? 2 : 1); if (e) { e.vt = CARS[this.car] && CARS[this.car].sprite ? this.car : 'e36'; e.len = 4.5; e.twin = true; e.v = this.sim.v + 9; e.color = parseInt(String(this.paintHex || '#c81d11').slice(1), 16); } }
    if (o.gives) v.cassa.push({ kind: o.gives, kg: INV[o.gives].kg });
    const text = o.text.replace('{km10}', Math.floor(km) + 10).replace('{km}', Math.floor(km));
    if (where === 'road' && (o.sign || o.cippo || o.parked)) { setTimeout(() => this.ask({ kind: 'odd', title: o.title, text, time: 18, options: [{ label: '…' }] }), 6000); return; }
    this.ask({ kind: 'odd', title: o.title, text, time: 22, options: [{ label: '…' }] });
  };

  // stato per l'interfaccia
  P.vgView = function () {
    const v = this.s.vg; if (!v) return null;
    return { km: vgKm(this), needs: v.needs, pax: v.pax.map((p) => ({ name: p.gone ? '' : p.name, to: p.to, gone: !!p.gone, n: (VG_STORY_PAX.find((q) => q.id === p.story) || {}).seats || 1 })), seats: this.vgSeats(), blackout: v.blackout, glitch: v.glitch, mirror: v.mirror || 0, weak: v.weak, sway: v.sway || 0, cap: this.vgCap(), kg: this.trunkKg(), line: v.line };
  };
})();

if (typeof window !== 'undefined') Object.assign(window, { VG, VG_SHOP, VG_CHAPTERS, VG_ODD, VG_STORY_PAX, VG_FOODS, VG_SEATS, VG_RUMORS, vgOn });
