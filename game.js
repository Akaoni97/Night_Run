// ============================================================================
//  StreetGame · carriera su strada: soldi, benzina, polizia, consegne
//  Indipendente dalla grafica: la scena 3D legge `ents`, `laneZ`, `s.dist`.
// ============================================================================
const GAME_FUEL_PRICE = 1.95;            // € al litro
// in rosso si può andare (multe, rate): per benzina, cibo e motel ti fanno credito fino a GAME_FIDO euro sotto zero
const GAME_FIDO = 500;
const GAME_COLORS = [0x2b4c7e, 0x8a8f96, 0x1d1f22, 0xe8e6df, 0x6b1b14, 0x2f5d3a, 0xb38b2d];
// traffico: tipi di veicolo con lunghezza (m), velocità tipica (m/s) e peso nella miscela
// velocità in autostrada (km/h): auto 110–135, kei 100–120, furgoni 100–125, camion 85–92, autobus 90–100; in città circa la metà
const GAME_TRAFFIC = [   // solo le auto disegnate dal giocatore; w = quanto spesso si vedono
  { vt: 'panda', len: 3.7, kmh: [95, 120], w: 14 }, { vt: 'punto', len: 4.0, kmh: [100, 125], w: 13 }, { vt: 'polo', len: 4.0, kmh: [100, 128], w: 13 },
  { vt: 'corsa', len: 4.0, kmh: [100, 125], w: 12 }, { vt: 'clio', len: 4.05, kmh: [105, 130], w: 12 }, { vt: 'p308', len: 4.25, kmh: [110, 135], w: 11 },
  { vt: 'a3', len: 4.3, kmh: [115, 140], w: 10 }, { vt: 'taxi', len: 4.7, kmh: [105, 130], w: 6 }, { vt: 'doblo', len: 4.4, kmh: [100, 120], w: 8 },
  { vt: 'van', len: 4.3, kmh: [95, 118], w: 8 }, { vt: 'bus', len: 12, kmh: [85, 95], w: 4 }, { vt: 'ambulanza', len: 5.9, kmh: [110, 130], w: 2 },
  { vt: 'a80', len: 4.5, kmh: [105, 125], w: 6 }, { vt: 'p206', len: 3.8, kmh: [110, 135], w: 6 }, { vt: 'v850', len: 4.7, kmh: [115, 140], w: 4 },
  { vt: 'golf', len: 3.8, kmh: [105, 130], w: 4 }, { vt: 'p205', len: 3.7, kmh: [110, 135], w: 3 }, { vt: 'williams', len: 3.7, kmh: [110, 135], w: 3 },
  { vt: 'a112', len: 3.2, kmh: [90, 115], w: 3 }, { vt: 'e36', len: 4.4, kmh: [110, 140], w: 4 }, { vt: 'e34', len: 4.7, kmh: [110, 140], w: 3 },
  { vt: 'e30', len: 4.3, kmh: [105, 130], w: 3 }, { vt: 'b2002', len: 4.2, kmh: [95, 120], w: 2 }, { vt: 'r5', len: 3.7, kmh: [110, 135], w: 2 }, { vt: 'v40', len: 4.5, kmh: [105, 130], w: 4 },
];
// luoghi della mappa del mondo: posti veri, ognuno con il suo sfondo 2D e il suo traffico
// bg: tipo di sfondo · lat/lon: coordinate reali · traffic: densità · mix: quanto pesa ogni tipo di veicolo · places: negozi e officine
const GAME_LOCS = [
  { id: 'tokyo', name: 'Tokyo · Shinjuku', country: 'Giappone', bg: 'city', lat: 35.6938, lon: 139.7034, traffic: 1.1, places: true,
    note: 'Insegne, izakaya e il treno sopraelevato. Qui ci sono il benzinaio, Luca, Mario e il Neon Kustom.' },
  { id: 'wangan', name: 'Wangan · Bayshore Route', country: 'Giappone', bg: 'highway', lat: 35.4614, lon: 139.6800, traffic: 1.6, mix: { truck: 2.6, bus: 0.3, kei: 0.5, taxi: 0.6 },
    note: 'L\'autostrada sopraelevata sulla baia di Tokyo verso Daikoku: barriere antirumore, lampioni al sodio, la città sull\'acqua.' },
  { id: 'hakone', name: 'Hakone Turnpike', country: 'Giappone', bg: 'mountain', lat: 35.2420, lon: 139.1040, traffic: 0.5, mix: { truck: 0.2, bus: 0.2, taxi: 0.2 },
    note: 'La salita tra i cedri sopra Odawara, col Fuji innevato all\'orizzonte. Niente lampioni: solo i tuoi fari e i catarifrangenti.' },
  { id: 'positano', name: 'Costiera Amalfitana · Positano', country: 'Italia', bg: 'sea', lat: 40.6281, lon: 14.4850, traffic: 0.8, mix: { bus: 1.5, truck: 0.3, kei: 0.3, taxi: 0.2, van: 1.3 },
    note: 'La statale 163 a picco sul Tirreno: muretto bianco, case colorate sulla roccia, la luna sul mare e le lampare.' },
  { id: 'bassa', name: 'Bassa Reggiana · Guastalla', country: 'Italia', bg: 'plain', lat: 44.9203, lon: 10.6555, traffic: 0.6, mix: { truck: 1.6, bus: 0.2, taxi: 0.1, kei: 0.4 },
    note: 'Pianura Padana vicino al Po: filari di pioppi, cascine, tralicci, banchi di nebbia sui campi.' },
  { id: 'sangimignano', name: 'San Gimignano', country: 'Italia', bg: 'village', lat: 43.4676, lon: 11.0434, traffic: 0.5, mix: { bus: 0.4, truck: 0.3, kei: 0.5, van: 1.3, taxi: 0.1 },
    note: 'Il borgo delle torri sulle colline senesi: case di pietra, persiane verdi, cipressi e il campanile.' },
  { id: 'route66', name: 'Route 66 · Amboy, Mojave', country: 'Stati Uniti', bg: 'desert', lat: 34.5583, lon: -115.7444, traffic: 0.4, mix: { truck: 2.2, bus: 0.1, kei: 0.05, taxi: 0, van: 1.2 },
    note: 'La Mother Road nel deserto della California: mesas sotto le stelle, pali del telefono, un motel col neon.' },
  { id: 'roma', name: 'Roma · Via del Corso', country: 'Italia', bg: 'city', cap: true, lat: 41.9028, lon: 12.4964, traffic: 1, places: true,
    note: 'Una capitale del Viaggio.' },
  { id: 'parigi', name: 'Parigi · Avenue des Champs-Élysées', country: 'Francia', bg: 'city', cap: true, lat: 48.8566, lon: 2.3522, traffic: 1, places: true,
    note: 'Una capitale del Viaggio.' },
  { id: 'londra', name: 'Londra · Regent Street', country: 'Regno Unito', bg: 'city', cap: true, lat: 51.5072, lon: -0.1276, traffic: 1, places: true,
    note: 'Una capitale del Viaggio.' },
  { id: 'stoccolma', name: 'Stoccolma · Drottninggatan', country: 'Svezia', bg: 'city', cap: true, lat: 59.3293, lon: 18.0686, traffic: 1, places: true,
    note: 'Una capitale del Viaggio.' },
  { id: 'berlino', name: 'Berlino · Unter den Linden', country: 'Germania', bg: 'city', cap: true, lat: 52.52, lon: 13.405, traffic: 1, places: true,
    note: 'Una capitale del Viaggio.' },
  { id: 'praga', name: 'Praga · Václavské náměstí', country: 'Cechia', bg: 'city', cap: true, lat: 50.0755, lon: 14.4378, traffic: 1, places: true,
    note: 'Una capitale del Viaggio.' },
  { id: 'vienna', name: 'Vienna · Ringstraße', country: 'Austria', bg: 'city', cap: true, lat: 48.2082, lon: 16.3738, traffic: 1, places: true,
    note: 'Una capitale del Viaggio.' },
  { id: 'madrid', name: 'Madrid · Gran Vía', country: 'Spagna', bg: 'city', cap: true, lat: 40.4168, lon: -3.7038, traffic: 1, places: true,
    note: 'Una capitale del Viaggio.' },
  { id: 'lisbona', name: 'Lisbona · Avenida da Liberdade', country: 'Portogallo', bg: 'city', cap: true, lat: 38.7223, lon: -9.1393, traffic: 1, places: true,
    note: 'Una capitale del Viaggio.' },
  { id: 'atene', name: 'Atene · Syntagma Square', country: 'Grecia', bg: 'city', cap: true, lat: 37.9838, lon: 23.7275, traffic: 1, places: true,
    note: 'Una capitale del Viaggio.' },
  { id: 'washington', name: 'Washington D.C. · Pennsylvania Avenue', country: 'Stati Uniti', bg: 'city', cap: true, lat: 38.9072, lon: -77.0369, traffic: 1, places: true,
    note: 'Una capitale del Viaggio.' },
];
const GAME_LANE_Z = { 0: 6.1, 1: 3.5, 2: 0, 3: -3.5 };

// luoghi fissi lungo la strada di città (vista 2D): si ripetono ogni GAME_PLACE_CYCLE metri
const GAME_PLACE_CYCLE = 2400;
const GAME_BACK_MAX = 60;                // metri che si possono fare in retromarcia dal punto più lontano raggiunto (per tornare davanti a un locale)
// entrata in un locale: l'auto svolta nel piazzale fino al suo posto auto, il protagonista scende, va a piedi alla porta
// ed entra, lo schermo si scurisce; uscendo il contrario (disegno in entrata2d.js). Tempi in secondi.
const GAME_ENT = { drive: 1.9, getOut: 0.5, walkV: 1.5, door: 0.35, dark: 0.45, getIn: 0.4, back: 1.5 };
// posto auto e porta di ogni locale, in metri dalla posizione del locale (misurati sulle facciate di locali2d.js,
// concessionario.js e sfascio.js): il posto è accanto alla porta, al benzinaio sulla pompa e la porta è quella del market
const GAME_POSTI = {
  bar: { park: -3.3, door: 0 }, fuel: { park: 2.6, door: 6.1 }, grill: { park: -2.4, door: 1.2 }, motel: { park: -3, door: 0.3 },
  niko: { park: -3.4, door: 0 }, shop: { park: -3.4, door: 0 }, style: { park: -1.6, door: 1.9 }, dealer: { park: -0.6, door: 2.9 },
  junk: { park: -1.2, door: 2.5 },
};
const GAME_ENT_IN = GAME_ENT.drive + GAME_ENT.dark, GAME_ENT_OUT = GAME_ENT.back + 0.35;   // senza la camminata (minimi)
const GAME_REV_MAX = 5;                  // velocità massima in retromarcia, m/s (18 km/h: una manovra, non una corsa)
const GAME_PLACES = [
  { id: 'fuel', at: 420, name: 'Benzina 24H', what: 'benzinaio', col: '#2ee6ff' },
  { id: 'shop', at: 950, name: 'Da Luca Tuning', what: 'tuning', col: '#ffb000' },
  { id: 'niko', at: 1450, name: 'Officina Mario', what: 'meccanico', col: '#5ad1ff' },
  { id: 'style', at: 1950, name: 'Neon Kustom', what: 'estetica', col: '#ff2e88' },
];
// sticker e decalcomanie (Neon Kustom): disegnati nel gioco; quelli del giocatore si aggiungono da img/stickers/manifest.json
const GAME_STICKERS = [
  { id: 'wakaba', name: 'Wakaba', price: 60 }, { id: 'sakura', name: 'Fiore di ciliegio', price: 90 },
  { id: 'jdm', name: 'JDM', price: 80 }, { id: 'oni', name: 'Maschera Oni', price: 200 },
  { id: 'n27', name: 'Numero di gara 27', price: 150 }, { id: 'nightrun', name: 'Night Run', price: 120 },
  { id: 'flames', name: 'Fiamme', price: 350 },
];
const GAME_STICKER_SLOTS = [['st_door', 'Portiera'], ['st_rear', 'Parafango posteriore'], ['st_glass', 'Vetro posteriore']];
// manutenzione da Mario: quanto dura ogni cosa (km di gioco) e quanto costa
const GAME_SERVICES = [
  { id: 'oil', name: 'Tagliando: olio e filtro', km: 40, price: 120, note: 'Olio vecchio: la pressione cala e il motore perde fino al 6 %.' },
  { id: 'plugs', name: 'Candele nuove', km: 90, price: 140, note: 'Candele consumate: accensioni perse a scatti sotto carico.' },
  { id: 'pads', name: 'Pastiglie dei freni', km: 35, price: 180, note: 'Pastiglie finite: frenate lunghe, poi ferro su ferro.' },
  { id: 'wash', name: 'Lavaggio e lucidatura', km: 15, price: 25, note: 'Fango e polvere si accumulano, di più con la pioggia.' },
];
// ricambi estetici: si comprano dal Neon Kustom e si vedono sulla Supra in 2D
const GAME_COSMETICS = {
  glow: { label: 'Neon sottoscocca', items: [
    { id: 'none', name: 'Nessuno', price: 0 },
    { id: '#2ee6ff', name: 'Ciano', price: 450 }, { id: '#ff2e88', name: 'Rosa', price: 450 },
    { id: '#b8ff3a', name: 'Verde acido', price: 450 }, { id: '#b07bff', name: 'Viola', price: 450 } ] },
  rims: { label: 'Colore dei cerchi', items: [
    { id: 'none', name: 'Argento di serie', price: 0 },
    { id: '#1c1d22', name: 'Neri opachi', price: 600 }, { id: '#d9a82e', name: 'Oro', price: 800 },
    { id: '#9a6a3a', name: 'Bronzo', price: 750 }, { id: '#ff2e88', name: 'Rosa', price: 700 } ] },
  stripe: { label: 'Strisce laterali', items: [
    { id: 'none', name: 'Nessuna', price: 0 },
    { id: '#f2f2ee', name: 'Bianche', price: 350 }, { id: '#0d0e10', name: 'Nere', price: 350 }, { id: '#d9a82e', name: 'Oro', price: 420 } ] },
  tint: { label: 'Vetri', items: [ { id: 'none', name: 'Chiari', price: 0 }, { id: 'dark', name: 'Oscurati', price: 250 } ] },
  decal: { label: 'Adesivo sulla portiera', items: [
    { id: 'none', name: 'Nessuno', price: 0 }, { id: '2JZ', name: '2JZ', price: 120 }, { id: 'JDM', name: 'JDM', price: 120 }, { id: 'NIGHT RUN', name: 'Night Run', price: 180 } ] },
  caliper: { label: 'Pinze dei freni', items: [
    { id: 'none', name: 'Oro di serie', price: 0 },
    { id: '#d0141e', name: 'Rosse', price: 300 }, { id: '#2e6bff', name: 'Blu', price: 300 },
    { id: '#b8ff3a', name: 'Verde acido', price: 350 }, { id: '#1c1d22', name: 'Nere', price: 250 } ] },
  paint: { label: 'Vernice speciale', items: [
    { id: 'none', name: 'Tinte di serie', price: 0 },
    { id: '#6d2bd9', name: 'Viola perlato', price: 900 }, { id: '#1f8f4e', name: 'Verde Kawasaki', price: 900 },
    { id: '#f2c200', name: 'Giallo Lancia', price: 900 }, { id: '#36c5d6', name: 'Azzurro Midnight', price: 1100 } ] },
};
// traguardi di chilometri: premi che non si comprano, si guadagnano guidando
const GAME_KM_PERKS = [
  { km: 25, id: 'rodaggio', name: 'Rodaggio finito', note: 'Motore sciolto: +3 % di potenza' },
  { km: 75, id: 'mano', name: 'Mano sul cambio', note: 'Cambiate più rapide' },
  { km: 150, id: 'cliente', name: 'Cliente fisso', note: '−10 % su pezzi, carrozziere e gomme' },
  { km: 300, id: 'leggenda', name: 'Leggenda della notte', note: '+3 % di potenza e +4 % di aderenza' },
];
// bagagliaio: 12 posti, 150 kg; il peso si somma alla massa della Supra
const TRUNK_SLOTS = 12, TRUNK_KG = 150, CAR_MASS = 1570;
const INV = {
  tanica: { name: 'Tanica 10 L', kg: 9, price: 35, note: 'Versa 10 litri nel serbatoio, anche a secco.' },
  kit: { name: 'Kit attrezzi', kg: 7, price: 120, uses: 3, note: 'Raddrizzi un po\' la carrozzeria per strada: −15 % di danni, tre usi.' },
  scorta: { name: 'Ruota di scorta', kg: 14, price: 90, note: 'Peso morto finché non serve. Toglierla alleggerisce l\'auto.' },
  pacco: { name: 'Pacco da consegnare', kg: 10, price: 0, note: 'Va portato a destinazione.' },
  zavorra: { name: 'Sacco di sabbia', kg: 25, price: 10, note: 'Peso sul posteriore: più trazione in partenza, ma più massa.' },
};
// limite dell'autostrada e multe per eccesso di velocità (tolleranza del 5 %, almeno 5 km/h: la multa scatta da 137 km/h).
// Scaglioni come il codice della strada: fino a 10 km/h oltre, da 10 a 40, da 40 a 60, oltre 60. null = niente multa.
const GAME_SPEED_LIMIT = 130;
function speedFine(kmh) {
  const over = Math.ceil(kmh - Math.max(5, kmh * 0.05) - GAME_SPEED_LIMIT);
  if (over < 1) return null;
  return { over, fine: over <= 10 ? 42 : over <= 40 ? 173 : over <= 60 ? 543 : 845 };
}

class StreetGame {
  constructor(sim, rnd = Math.random) {
    this.sim = sim;
    this.rnd = rnd;
    this.mode = 'career';                 // 'career' | 'free'
    this.s = { money: 3000, rep: 0, heat: 0, dist: 0, owned: {}, fines: 0, jobs: 0,
      trunk: [{ kind: 'scorta', kg: 14 }, { kind: 'kit', kg: 7, uses: 3 }, { kind: 'tanica', kg: 9 }] };
    this.ents = [];
    this.trip = 0;
    this.s.carId = 'supra'; this.s.cars = { supra: { km: 0, perks: [] }, v40: { km: 0, perks: [], up: 0, fuel: 0.55 } }; this.s.perks = [];
    this.prompt = null;
    this.ap = null;                        // pilota automatico (fermate)
    this.job = null;
    this.out = [];                         // messaggi per l'interfaccia
    this.lane = 1; this.laneZ = GAME_LANE_Z[1]; this.laneT = 0;
    this.nextSpawn = 250; this.id = 1;
    this.siren = 0;
    this.autoLane = true;      // sorpasso automatico (si può spegnere)
    this.track = 'city';       // c'era anche 'mountain' (la montagna in 3D, tolta il 20/11/2026)
    this.loc = GAME_LOCS[0];   // luogo della mappa del mondo (sfondo 2D e traffico)
    this.manualT = 0;          // secondi in cui la corsia l'ha scelta il pilota
    this.steerIn = 0;          // sterzo libero tenuto dal pilota: +1 sinistra, -1 destra
    this.latV = 0;             // velocità laterale (m/s)
    this.free = false;         // posizione libera sulla carreggiata, fuori dalle corsie
    this.fx = [];              // eventi grafici per le viste (tamponamenti…)
    this.applyMass();
  }

  // cambio corsia del pilota: dir +1 a sinistra (verso la corsia 3), -1 a destra (verso la 1)
  steer(dir) {
    if (this.ap) return false;
    const nl = Math.max(1, Math.min(3, this.lane + dir));
    if (nl === this.lane) return false;
    this.lane = nl; this.manualT = this.autoLane ? 5 : 1e9;
    return true;
  }

  // sterzo libero: finché il pilota tiene premuto, l'auto si sposta dove vuole sulla carreggiata
  steerHold(x) { this.steerIn = Math.max(-1, Math.min(1, x || 0)); }

  // tamponamento: la Supra rallenta di colpo, l'altra auto viene spinta avanti, si pagano i danni
  // ------------------------------------------------------------ guidatori del traffico
  // Ognuno ha un carattere: distanza di sicurezza in secondi (T), accelerazione (a) e frenata comoda (b).
  //   normale · prudente (più distanza, più calmo) · aggressivo (attaccato, più veloce, sfanala chi lo rallenta in corsia
  //   di sorpasso) · centralista (lento, sta in seconda corsia e non rientra) · distratto (circa 1 su 12: si accorge tardi
  //   di chi ha davanti, cioè di te, e frena poco: è quello che può tamponarti). I pesanti sono sempre normali e lenti.
  trafficDriver(e) {
    if (e.drv) return e.drv;
    const r = Math.random(), heavy = (e.len || 4.6) > 8;
    let t = 'normale';
    if (!heavy) t = r < 1 / 12 ? 'distratto' : r < 0.2 ? 'aggressivo' : r < 0.27 ? 'centralista' : r < 0.45 ? 'prudente' : 'normale';
    const D = { normale: [1.5, 1.6, 3], prudente: [2.1, 1.2, 2.5], aggressivo: [0.75, 2.4, 3.8], centralista: [1.8, 1.1, 2.6], distratto: [1.3, 1.5, 3] }[t];
    e.drv = { t, T: D[0] * (0.9 + Math.random() * 0.2), a: heavy ? 0.8 : D[1], b: heavy ? 2 : D[2] };
    if (e.vBase && !e.still) {
      if (t === 'aggressivo') { e.vBase *= 1.12; e.vT = e.vBase; }
      else if (t === 'centralista') { e.vBase *= 0.86; e.vT = e.vBase; }
    }
    return e.drv;
  }
  // accelerazione voluta (modello del guidatore intelligente, IDM): libera fino alla sua velocità, poi tiene la distanza
  // da chi ha davanti nella sua corsia (anche chi ci sta entrando) o dal giocatore, frenando quanto serve fino a 8,5 m/s².
  // Il distratto non guarda il giocatore finché non è a un secondo e mezzo dall'urto, e poi frena al massimo 4,5 m/s².
  trafficAccel(e, d, dt = 1 / 60) {
    const D = this.trafficDriver(e), sim = this.sim, v = Math.max(0, e.v || 0), v0 = Math.max(1, e.vT || e.vBase || v), lenE = e.len || 4.6;
    let gap = Infinity, vl = 0, al = 0, isMe = false;
    for (const o of this.ents) {
      if (o === e || !(o.kind === 'traffic' || o.kind === 'police') || o.chase || o.x <= e.x) continue;
      if (o.lane !== e.lane && o.to !== e.lane) continue;
      const s = o.x - e.x - ((o.len || 4.6) + lenE) / 2;
      if (o.lane !== e.lane && s < 8) continue;                         // chi mette la freccia accanto a noi non è ancora davanti: non si inchioda per lui
      if (s < gap) { gap = s; vl = o.v || 0; al = o.acc || 0; }
    }
    if (!this.inside && d > e.x && Math.abs(this.laneZ - GAME_LANE_Z[e.lane]) < 1.7) {
      const s = d - e.x - (lenE + 4.5) / 2;
      if (s < gap) {
        let sees = true;
        if (D.t === 'distratto') {
          const close = v - sim.v;
          if (s < 6 || (close > 0 && s / close < 1.5)) e.alertT = 2.5;
          sees = (e.alertT || 0) > 0;
        }
        if (sees) { gap = s; vl = sim.v; al = this.meAcc || 0; isMe = true; }
      }
    }
    if (e.alertT > 0) e.alertT -= dt;
    // curiosi: vicino a un incidente o a un posto di blocco tutti rallentano a guardare, di più nella corsia accanto
    // (da qui nascono le code a fisarmonica dietro, che l'IDM propaga da solo)
    let vMax = v0;
    for (const o of this.ents) {
      if (!o.hazard || !o.still) continue;
      const dx = o.x - e.x; if (dx < -25 || dx > 140) continue;
      const far = Math.abs(e.lane - o.lane), cur = far === 0 ? 11 : far === 1 ? 14 : 19;
      vMax = Math.min(vMax, cur + Math.max(0, dx - 60) * 0.12);
    }
    const free = 1 - Math.pow(v / Math.max(1, vMax), 4);
    let acc = D.a * free;
    if (gap < 300) {
      const dv = v - vl, ss = 2.5 + Math.max(0, v * D.T + v * dv / (2 * Math.sqrt(D.a * D.b)));
      const idm = D.a * (free - Math.pow(ss / Math.max(0.4, gap), 2));
      // l'IDM esagera quando ci si trova più vicini di quanto si vorrebbe (un'auto che nasce o rientra davanti): non si
      // frena più di quanto serve per non arrivargli addosso (tenendo conto di come frena lui), e se non ci si avvicina
      // si riapre la distanza con calma
      const kin = (dv > 0 ? -(dv * dv) / (2 * Math.max(0.5, gap - 2)) : 0) + Math.min(0, al);
      acc = idm >= kin * 1.3 - 0.4 ? idm : Math.max(idm, Math.min(kin * 1.3 - 0.4, dv > 0 ? 0 : -0.3), gap < 4 + v * 0.3 ? -8.5 : -D.b * (dv > 0 ? 3 : 1));
    }
    // uscita alla tappa (strada.js): frenata costante sui 2 m/s² per fermarsi davanti al locale; chi segue si accoda
    if (e.exitX > 0 && e.lane === 1) {
      const sx = e.exitX - e.x, need = (v * v) / (2 * Math.max(0.5, sx - 1));
      if (need > 1.9 || sx < 3) acc = Math.min(acc, sx < 3 ? -3 : -Math.min(3.5, need));
    }
    const maxB = (D.t === 'distratto' && isMe ? 4.5 : 8.5) * (1 - 0.3 * (sim.wet || 0));   // sul bagnato si frena meno
    return { acc: Math.max(-maxB, Math.min(D.a, acc)), gap, vl, isMe };
  }

  // urto con un altro veicolo: quantità di moto divisa secondo le masse, danni secondo la differenza di velocità
  crash(e, kind = 'front') {
    const sim = this.sim, m1 = sim.P.mass, m2 = (typeof CARS !== 'undefined' && CARS[e.vt] && CARS[e.vt].mass) || 1400;
    const dv = Math.abs(sim.v - e.v), I = Math.min(1.5, dv / 10);
    e.hitT = 1.2;
    if (kind === 'side') {
      // strisciata: si torna nella corsia da cui si veniva, un po' di velocità persa da entrambi
      const back = this.prevLaneSafe || (this.lane === 1 ? 2 : this.lane - 1);
      this.lane = this.laneZ > (e._gz ?? GAME_LANE_Z[e.lane]) ? Math.max(1, Math.min(3, (e.lane || 2) - 1)) : Math.max(1, Math.min(3, (e.lane || 2) + 1));
      if (this.lane === e.lane) this.lane = back;
      sim.v *= 0.94; e.v *= 0.97; this.manualT = 1.2; this.free = false;
      sim.damage = Math.min(1, sim.damage + 0.04 + dv * 0.004);
      const sI = Math.min(1.2, 0.45 + dv * 0.05 + sim.v * 0.01);
      sim.events.push({ type: 'crash', I: sI, kind: 'side' }); this.fx.push({ k: 'scrape', I: sI, vt: e.vt });
      if (sI > 0.6) e.dent = 1; e.hazT = Math.max(e.hazT || 0, 4);
      this.say(`Strisciata contro ${(typeof CARS !== 'undefined' && CARS[e.vt] && CARS[e.vt].short) || 'un\'auto'}: carrozzeria al ${Math.round(sim.damage * 100)} %`, 'police');
      this.s.crashes = (this.s.crashes || 0) + 1; return;
    }
    // urto quasi anelastico (restituzione 0,2)
    const vc = (m1 * sim.v + m2 * e.v) / (m1 + m2), r = 0.2;
    const v1 = vc - r * m2 * (sim.v - e.v) / (m1 + m2), v2 = vc + r * m1 * (sim.v - e.v) / (m1 + m2);
    sim.v = Math.max(0, v1); sim.ww = sim.v / sim.P.r; sim.wo = sim.ww; sim.phi = 0;
    if (sim.gear > 0 && sim.lock) sim.we = Math.max(sim.we * 0.6, sim.wo * sim.ratio(sim.gear));
    e.v = Math.max(0, v2);
    const half = ((e.len || 4.6) + 4.4) / 2 + 0.25;
    e.x = this.s.dist + (kind === 'front' ? half : -half);                 // si separano: niente urti ripetuti
    // un colpetto a pochi km/h (spingere chi sta davanti) lascia appena un graffio; un tamponamento vero fa male
    const soft = dv < 2.5;
    const dmg = soft ? 0.004 + dv * 0.004 : Math.min(0.45, (kind === 'front' ? 0.05 : 0.03) + dv * (kind === 'front' ? 0.022 : 0.012) * Math.min(2, m2 / 1400));
    sim.damage = Math.min(1, sim.damage + dmg);
    sim.events.push({ type: soft ? 'bump' : 'crash', I: soft ? 0.4 : I, kind, hit: true });
    if (soft) return;
    this.s.crashes = (this.s.crashes || 0) + 1; this.fx.push({ k: 'crash', I, kind, vt: e.vt });
    e.dent = 1; e.hazT = 10;                                              // l'altra auto: ammaccata, quattro frecce
    e.calmT = 2.5;                                                         // e per un paio di secondi rallenta piano, senza inchiodare
    if (kind === 'front') this.shockT = Math.max(this.shockT || 0, 0.8 + 0.8 * Math.min(1, I));   // chi guida molla il gas e frena d'istinto
    if (kind === 'front') this.shockE = e;                                   // l'auto colpita: la guida automatica le resta lontana
    this.say(kind === 'rear' ? `Ti hanno tamponato a ${Math.round(dv * 3.6)} km/h di differenza: danni al ${Math.round(sim.damage * 100)} %`
      : `Tamponamento a ${Math.round(dv * 3.6)} km/h di differenza: carrozzeria al ${Math.round(sim.damage * 100)} % di danni`, 'police');
  }

  // ------------------------------------------------------------ luoghi (benzinaio, officina, estetica)
  placesBetween(a, b) {
    const out = [];
    for (let c = Math.floor(a / GAME_PLACE_CYCLE) - 1; c * GAME_PLACE_CYCLE <= b; c++)
      for (const p of GAME_PLACES) { const x = c * GAME_PLACE_CYCLE + p.at; if (x >= a && x <= b && x > 60) out.push(Object.assign({ x, kind: 'place' }, p)); }
    return out;
  }
  // il luogo davanti a cui ci si può fermare adesso (null se troppo lontano, o se a questa velocità non si riesce a frenare)
  nearPlace() {
    if (!this.placesOn || this.ap || this.inside) return null;
    const d = this.s.dist, v = Math.max(0, this.sim.v);
    const p = this.placesBetween(d - 12, d + 160)[0];
    if (!p) return null;
    const rel = p.x - d, stop = v * v / (2 * 4.5);
    return Object.assign(p, { rel, ok: rel > -12 && stop < rel + 8 });
  }
  // entra: accosta sul lato dei negozi, si ferma davanti all'ingresso e ci entra
  enterPlace(p) {
    if (!p || !p.ok) return false;
    this.prompt = null; this.lane = 3; this.manualT = 0; this.free = false;
    const go = () => {
      // dove parcheggia nel piazzale (metri dalla porta): chi è fermo prima della porta entra andando avanti,
      // chi l'ha appena passata entra in retro; sempre dentro la facciata (da −5 a +7 m)
      const c = this.s.dist - p.x, P = GAME_POSTI[p.id];
      const park = P ? P.park : c <= -1.5 ? Math.max(-4, Math.min(2.5, c + 6)) : Math.max(-4, Math.min(6, c - 5));
      const door = P ? P.door : park, E = GAME_ENT, walk = Math.abs(door - (park + 0.3)) / E.walkV;   // scende dalla portiera, poco avanti al centro dell'auto
      const drive = Math.max(E.drive * 0.85, Math.min(3.2, 1.2 + Math.abs(park - c) * 0.11));   // manovra più lunga se il posto è lontano
      this.inside = { id: p.id, x: p.x, name: p.name, col: p.col, phase: 'in', t: 0, from: c, park, door, walk, drive, z0: this.laneZ,   // z0: la corsia da cui parte la manovra
        dur: drive + E.getOut + walk + E.door + E.dark, durOut: 0.35 + walk + E.getIn + E.back };
      this.laneZ = GAME_LANE_Z[3];
    };
    // vicino, o già fermi lì davanti (anche a motore spento): la manovra fino al posto la fa l'animazione
    if (p.rel < 9 || (Math.abs(this.sim.v) < 1 && p.rel < 20)) this.stopAt(null, go); else this.stopAt(p.x + (GAME_POSTI[p.id] ? GAME_POSTI[p.id].park : 0) - 5, go);   // si ferma qualche metro prima del posto e da lì svolta dentro
    if (this.ap) this.ap.enter = true;
    this.say(`Accosto: ${p.name}`, p.id === 'fuel' ? 'fuel' : 'buy');
    return true;
  }
  // U durante la camminata: si salta al buio (entrando) o all'auto che riparte (uscendo)
  entSkip() {
    const I = this.inside; if (!I || !I.dur) return;
    if (I.phase === 'in' && I.t > (I.drive || GAME_ENT.drive)) I.t = Math.max(I.t, I.dur - GAME_ENT.dark);
    else if (I.phase === 'out') I.t = Math.max(I.t, I.durOut - GAME_ENT.back);
  }
  exitPlace() {
    const I = this.inside; if (!I || I.phase !== 'shop') return;
    if (I.fill && I.fill.got > 0.05) {       // pistola staccata a metà: si paga quello che è entrato
      const c = Math.round(I.fill.cost * 100) / 100; if (this.mode === 'career') this.s.money -= c;
      this.say(`Rifornimento interrotto: ${I.fill.got.toFixed(1).replace('.', ',')} litri, − € ${c.toFixed(2).replace('.', ',')}`, 'fuel');
    }
    I.fill = null; I.phase = 'out'; I.t = 0;
    // si riesce dal piazzale andando avanti: la strada riparte qualche metro più in là (mai indietro)
    I.outFrom = I.x + (I.park ?? 0); this.s.dist = Math.max(this.s.dist, I.outFrom + 4.5); I.outTo = this.s.dist;
  }
  // rifornimento alla pompa: litri che entrano un po' alla volta
  startFill(liters) {
    const I = this.inside; if (!I || I.id !== 'fuel' || I.fill) return { ok: false };
    const miss = (1 - this.sim.fuel) * this.sim.P.tank;
    liters = Math.max(0, Math.min(liters, miss));
    if (liters < 0.5) return { ok: false, why: 'Il serbatoio è già pieno' };
    const cost = liters * GAME_FUEL_PRICE;
    if (this.mode === 'career' && cost > this.s.money + GAME_FIDO + 0.5) liters = Math.max(0, (this.s.money + GAME_FIDO) / GAME_FUEL_PRICE);
    if (liters < 0.5) return { ok: false, why: `Sei in rosso oltre i € ${GAME_FIDO}: niente più credito, servono soldi` };
    if (this.mode === 'career' && cost > this.s.money + 0.5) this.say('Sei in rosso: il benzinaio ti fa credito, per stavolta', 'fuel');
    I.fill = { liters, got: 0, cost: 0 };
    return { ok: true };
  }
  // estetica: le categorie comuni più quelle proprie dell'auto; ogni auto ha i suoi acquisti
  cosCats() {
    const all = Object.assign({}, GAME_COSMETICS, (CARS[this.car] && CARS[this.car].body) || {});
    if (this.car !== 'supra') { delete all.stripe; delete all.tint; delete all.decal; }   // disegnati sullo sprite della Supra
    return all;
  }
  ownKey(k) { return (this.car === 'supra' ? '' : this.car + '|') + k; }
  cosOwned(cat, id) { const c = this.cosCats()[cat], it = c && c.items.find((x) => x.id === id); return this.mode === 'free' || id === 'none' || (it && !it.price) || !!this.s.owned[this.ownKey('cos:' + cat + ':' + id)]; }
  buyCos(cat, id, item) {
    const c = this.cosCats()[cat], it = item || (c && c.items.find((x) => x.id === id)); if (!it) return { ok: false };
    if (this.cosOwned(cat, id)) return { ok: true, paid: 0 };
    if (it.price > this.s.money) return { ok: false, why: `Servono € ${it.price}, ne hai ${Math.floor(this.s.money)}` };
    this.s.money -= it.price; this.s.owned[this.ownKey('cos:' + cat + ':' + id)] = true;
    this.say(`${c ? c.label : 'Sticker'}: ${it.name} − € ${it.price}`, 'buy');
    return { ok: true, paid: it.price };
  }
  // ------------------------------------------------------------ manutenzione (Mario)
  maint() { const st = this.carState(); return st.maint || (st.maint = { oil: 1, plugs: 1, pads: 1, dirt: st.clean === false ? 0.8 : 0.2 }); }
  wear(km, braking) {
    const m = this.maint();
    m.oil = Math.max(0, m.oil - km / 40); m.plugs = Math.max(0, m.plugs - km / 90);
    m.pads = Math.max(0, m.pads - km / 35 - braking);
    m.dirt = Math.min(1, m.dirt + km / 15 * (this.sim.wet ? 3 : 1));
  }
  serviceCost(id) { if (this.mode !== 'career') return 0; const s = GAME_SERVICES.find((x) => x.id === id); return Math.round(s.price * this.disc() / 5) * 5; }
  service(id) {
    const s = GAME_SERVICES.find((x) => x.id === id), m = this.maint(), c = this.serviceCost(id);
    const level = id === 'wash' ? 1 - m.dirt : m[id];
    if (level > 0.97) return { ok: false, why: 'Non serve: è a posto' };
    if (c > this.s.money) return { ok: false, why: `Mario vuole € ${c}` };
    this.s.money -= c; if (id === 'wash') m.dirt = 0; else m[id] = 1;
    this.say(`${s.name}${c ? `: − € ${c}` : ''}`, 'buy'); return { ok: true };
  }

  // ------------------------------------------------------------ salvataggio
  save() { return JSON.stringify({ mode: this.mode, s: this.s }); }
  load(json) {
    try { const o = JSON.parse(json); if (o && o.s) { Object.assign(this.s, o.s); this.mode = o.mode === 'free' ? 'free' : 'career'; this.loc = GAME_LOCS.find((l) => l.id === this.s.loc) || GAME_LOCS[0]; } } catch (e) { /* salvataggio illeggibile */ }
    if (!Array.isArray(this.s.trunk)) this.s.trunk = [];
    // contachilometri per auto (i salvataggi vecchi partono dalla distanza già percorsa)
    if (!this.s.cars || (!this.s.cars.supra && !this.s.vg)) this.s.cars = { supra: { km: Math.max(0, (this.s.dist || 0) / 1000) } };
    if (!Array.isArray(this.s.perks)) this.s.perks = GAME_KM_PERKS.filter((p) => ((this.s.cars.supra || {}).km || 0) >= p.km).map((p) => p.id);
    // ogni auto ha i suoi traguardi; la Volvo arriva nel garage con i salvataggi vecchi
    if (this.s.cars.supra && !Array.isArray(this.s.cars.supra.perks)) this.s.cars.supra.perks = this.s.perks.slice();
    if (!this.s.cars.v40) this.s.cars.v40 = { km: 0, perks: [], up: 0, fuel: 0.55 };
    if (this.s.vg && !CARS[this.s.carId]) this.s.carId = 'v40';
    if (!CARS[this.s.carId]) this.s.carId = 'supra';
    this.applyMass();
  }
  reset() { const m = this.mode; Object.assign(this, new StreetGame(this.sim, this.rnd)); this.mode = m; }

  // ------------------------------------------------------------ officina
  // ---------------------------------------------------------------- bagagliaio
  trunkKg() { return (this.s.trunk || []).reduce((a, it) => a + it.kg, 0); }
  trunkFits(kg) { return (this.s.trunk || []).length < TRUNK_SLOTS && this.trunkKg() + kg <= TRUNK_KG; }
  applyMass(dm, rearOff) {
    // il peso nel bagagliaio va sul posteriore: aiuta la trazione posteriore (Supra), toglie un filo a quella anteriore (V40).
    // L'alleggerimento (dm < 0) toglie peso soprattutto dietro (rearOff = quota tolta dal posteriore)
    if (dm !== undefined) { this.massDelta = dm; this.massRear = rearOff ?? 0.6; }
    const kg = this.trunkKg(), P = this.sim.P, car = CARS[this.car] || CARS.supra, d = this.massDelta || 0, ro = this.massRear ?? 0.6;
    const m = car.mass + d, driveKg = car.driveW * car.mass + d * (car.fwd ? 1 - ro : ro);
    P.mass = m + kg; P.fwd = car.fwd; this.sim.trailerKg = 0;
    P.rearW = (driveKg + kg * (car.fwd ? 0.05 : 0.95)) / (m + kg);
  }
  // ------------------------------------------------------------ garage: più auto, ognuna con i suoi chilometri e potenziamenti
  get car() { return (this.s && CARS[this.s.carId] && this.s.carId) || 'supra'; }
  carState(id = this.car) { return this.s.cars[id] || (this.s.cars[id] = { km: 0, perks: [] }); }
  switchCar(id) {
    if (!CARS[id] || id === this.car) return { ok: false };
    if (Math.abs(this.sim.v) > 0.5 || this.inside || this.ap) return { ok: false, why: 'Per cambiare auto fermati' };
    const sim = this.sim, cur = this.carState();
    Object.assign(cur, { fuel: sim.fuel, damage: sim.damage, tireWear: sim.tireWear });
    this.s.carId = id;
    const nx = this.carState();
    sim.fuel = nx.fuel ?? 0.6; sim.damage = nx.damage || 0; sim.tireWear = nx.tireWear || 0; sim.dry = false;
    this.applyMass();
    this.say(`In garage: ${CARS[id].name}`, 'buy');
    return { ok: true };
  }
  // potenziamenti progressivi (V40): si montano in ordine
  ups() { return (CARS[this.car] && CARS[this.car].ups) || null; }
  upLevel() { return this.carState().up || 0; }
  nextUp() { const u = this.ups(); return u ? u[this.upLevel()] || null : null; }
  upPrice(u) { return this.mode === 'career' ? Math.round(u.price * this.disc() / 10) * 10 : 0; }
  buyUp() {
    const u = this.nextUp(); if (!u) return { ok: false, why: 'Tutto montato' };
    if (this.mode === 'career' && this.odo < u.km) return { ok: false, why: `Si sblocca a ${u.km} km: la ${CARS[this.car].short} ne ha ${Math.floor(this.odo)}` };
    const p = this.upPrice(u);
    if (p > this.s.money) return { ok: false, why: `Servono € ${p}, ne hai ${Math.floor(this.s.money)}` };
    this.s.money -= p; this.carState().up = this.upLevel() + 1;
    this.say(`${u.name}${p ? `: − € ${p}` : ''}`, 'buy');
    return { ok: true };
  }
  addItem(kind, extra = {}) {
    const it = Object.assign({ kind, kg: INV[kind].kg }, INV[kind].uses ? { uses: INV[kind].uses } : {}, extra);
    if (!this.trunkFits(it.kg)) return false;
    this.s.trunk.push(it); this.applyMass(); return true;
  }
  itemName(it) { return it.name || INV[it.kind].name; }
  buyItem(kind) {
    const p = this.mode === 'career' ? INV[kind].price : 0;
    if (p > this.s.money) return { ok: false, why: `Costa € ${p}` };
    if (!this.trunkFits(INV[kind].kg)) return { ok: false, why: 'Il bagagliaio è pieno' };
    this.s.money -= p; this.addItem(kind); this.say(`${INV[kind].name} nel bagagliaio${p ? `: − € ${p}` : ''}`, 'buy');
    return { ok: true };
  }
  useItem(i) {
    const it = this.s.trunk[i]; if (!it) return { ok: false, why: 'Posto vuoto' };
    const sim = this.sim;
    if (it.kind === 'tanica') {
      if (sim.fuel > 0.97) return { ok: false, why: 'Il serbatoio è già pieno' };
      sim.fuel = Math.min(1, sim.fuel + 10 / sim.P.tank); sim.dry = false; this.s.trunk.splice(i, 1);
      this.say('10 litri dalla tanica', 'fuel');
    } else if (it.kind === 'kit') {
      if (Math.abs(sim.v) > 0.5) return { ok: false, why: 'Fermati per usare gli attrezzi' };
      if (sim.damage < 0.01) return { ok: false, why: 'Non c\'è niente da raddrizzare' };
      sim.damage = Math.max(0, sim.damage - 0.15); it.uses -= 1; if (it.uses <= 0) this.s.trunk.splice(i, 1);
      this.say(`Martello e pazienza: danni al ${Math.round(sim.damage * 100)} %`, 'buy');
    } else return { ok: false, why: it.kind === 'pacco' ? 'Il pacco va consegnato, non aperto' : 'Questo oggetto non si usa: puoi solo toglierlo' };
    this.applyMass(); return { ok: true };
  }
  dropItem(i) {
    const it = this.s.trunk[i]; if (!it) return { ok: false };
    if (it.kind === 'pacco' && this.job) return { ok: false, why: 'Se butti il pacco perdi la consegna: portalo a destinazione' };
    this.s.trunk.splice(i, 1); this.applyMass(); this.say(`${this.itemName(it)} lasciato sul marciapiede`); return { ok: true };
  }

  // servizi d'officina: carrozziere e gomme nuove
  repairCost() { return Math.round(this.sim.damage * 2600 * this.disc() / 10) * 10; }
  tireCost() { return Math.round(Math.max(420, tuningItem('tires', this.tireId || 'oem').price * 0.55) * this.disc() / 10) * 10; }
  repair() {
    const c = this.mode === 'career' ? this.repairCost() : 0;
    if (!this.sim.damage) return { ok: false, why: 'La carrozzeria è già a posto' };
    if (c > this.s.money) return { ok: false, why: `Il carrozziere vuole € ${c}` };
    this.s.money -= c; this.sim.damage = 0; this.say(`Carrozzeria riparata${c ? `: − € ${c}` : ''}`, 'buy'); return { ok: true };
  }
  newTires() {
    const c = this.mode === 'career' ? this.tireCost() : 0;
    if (c > this.s.money) return { ok: false, why: `Un treno di gomme costa € ${c}` };
    this.s.money -= c; this.sim.tireWear = 0; this.sim.tireT = 24; this.say(`Gomme nuove montate${c ? `: − € ${c}` : ''}`, 'buy'); return { ok: true };
  }
  // ------------------------------------------------------------ chilometri
  get odo() { return (this.s.cars[this.car] || { km: 0 }).km; }
  hasPerk(id) { return (this.carState().perks || []).includes(id); }
  perkPow() { return 1 + (this.hasPerk('rodaggio') ? 0.03 : 0) + (this.hasPerk('leggenda') ? 0.03 : 0); }
  perkGrip() { return this.hasPerk('leggenda') ? 1.04 : 1; }
  disc() { return this.hasPerk('cliente') ? 0.9 : 1; }
  nextPerk() { return GAME_KM_PERKS.find((p) => !this.hasPerk(p.id)) || null; }
  // ogni pezzo chiede anche un po' di strada: più costa, più chilometri servono per sbloccarlo
  // ogni pezzo chiede anche un po' di strada (km del pezzo, oppure: più costa, più chilometri)
  partKm(cat, id) { const it = tuningItem(cat, id); if (!it || !it.price) return 0; return it.km ?? Math.max(5, Math.round(it.price / 150 / 5) * 5); }
  partLocked(cat, id) { return this.mode === 'career' && !this.owns(cat, id) && this.odo < this.partKm(cat, id); }
  owns(cat, id) { return this.mode === 'free' || !TUNING[cat] || TUNING[cat].items[0].id === id || tuningItem(cat, id).price === 0 || !!this.s.owned[this.ownKey(cat + ':' + id)]; }
  price(cat, id) { return this.owns(cat, id) ? 0 : Math.round(tuningItem(cat, id).price * this.disc() / 10) * 10; }
  canMount() { return this.mode === 'free' || Math.abs(this.sim.v) < 0.5; }
  // con i luoghi in città (2D, carriera) i pezzi si montano solo dentro l'officina
  inShop() { return !!(this.inside && this.inside.id === 'shop' && this.inside.phase === 'shop'); }
  needsShop() { return this.mode === 'career' && this.placesOn && !this.inShop(); }
  inNiko() { return !!(this.inside && this.inside.id === 'niko' && this.inside.phase === 'shop'); }
  needsNiko() { return this.mode === 'career' && this.placesOn && !this.inNiko(); }
  buy(cat, id) {
    const p = this.price(cat, id);
    if (this.partLocked(cat, id)) return { ok: false, why: `Si sblocca a ${this.partKm(cat, id)} km: la Supra ne ha ${Math.floor(this.odo)}` };
    if (p > this.s.money) return { ok: false, why: `Servono € ${p}, ne hai ${Math.floor(this.s.money)}` };
    this.s.money -= p;
    this.s.owned[this.ownKey(cat + ':' + id)] = true;
    if (p) this.say(`Comprato ${tuningItem(cat, id).brand} ${tuningItem(cat, id).name}: − € ${p}`, 'buy');
    return { ok: true, paid: p };
  }

  // viaggio verso un altro punto della mappa: cambia sfondo e traffico, la strada si svuota
  setLoc(id) {
    const L = GAME_LOCS.find((l) => l.id === id); if (!L) return false;
    this.loc = L; this.s.loc = L.id;
    this.ents = this.ents.filter((e) => e.kind === 'drop');
    this.nextTraffic = 0; this.inside = null; this.prompt = null;
    return true;
  }
  say(text, kind = 'info') { this.out.push({ text, kind }); }
  ask(p) { if (this.prompt) return false; this.prompt = Object.assign({ t: 9, time: 9 }, p); this.prompt.t = this.prompt.time; return true; }
  answer(i) {
    const p = this.prompt; if (!p) return;
    const o = p.options[i]; if (!o) return;
    this.prompt = null;
    if (o.act) o.act();
  }

  get kmh() { return this.sim.v * 3.6; }
  rel(e) { return e.x - this.s.dist; }

  // ------------------------------------------------------------ eventi
  spawn() {
    const sim = this.sim, d = this.s.dist, r = this.rnd;
    const w = [
      ['traffic', 40], ['police', 16], ['station', this.placesOn ? 0 : sim.fuel < 0.35 ? 34 : sim.fuel < 0.6 ? 12 : 4],
      ['job', !this.job ? 10 : 0],
    ];
    let k = r() * w.reduce((a, x) => a + x[1], 0), kind = 'traffic';
    for (const [n, p] of w) { if ((k -= p) < 0) { kind = n; break; } }
    if (kind === 'traffic') {
      const n = 1 + (r() < 0.35 ? 1 : 0);
      for (let i = 0; i < n; i++) this.spawnTraffic(d + 230 + r() * 160 + i * 45);
    } else if (kind === 'police') {
      const parked = r() < 0.6;
      this.ents.push({ id: this.id++, kind: 'police', lane: parked ? 0 : 1 + (r() < 0.5 ? 1 : 0), x: d + (parked ? 380 : 260), v: parked ? 0 : (80 + r() * 20) / 3.6 });   // in giro: 80-100 km/h, si supera
    } else if (kind === 'station') {
      if (!this.ents.some((e) => e.kind === 'station')) this.ents.push({ id: this.id++, kind: 'station', lane: 0, x: d + 760, v: 0 });
    } else if (kind === 'job') this.offerJob();
  }

  // un veicolo del traffico (tipo a caso secondo il luogo), in una corsia libera
  spawnTraffic(x, lane) {
    const r = this.rnd, mix = (this.loc && this.loc.mix) || {};
    const tot = GAME_TRAFFIC.reduce((a, t) => a + t.w * (mix[t.vt] ?? 1), 0);
    let k = r() * tot, T = GAME_TRAFFIC[0];
    for (const t of GAME_TRAFFIC) { if ((k -= t.w * (mix[t.vt] ?? 1)) < 0) { T = t; break; } }
    const heavy = T.vt === 'bus';
    lane = lane || (heavy ? (r() < 0.8 ? 1 : 2) : r() < 0.5 ? 1 : r() < 0.6 ? 2 : 3);
    if (this.ents.some((o) => o.kind === 'traffic' && o.lane === lane && Math.abs(o.x - x) < 30 + (o.len || 4.6))) return null;
    const cols = GAME_COLORS;
    const hw = !!(this.s && this.s.vg) || (this.loc && this.loc.bg === 'highway'), kv = hw ? 1 : 0.5;
    const v = (T.kmh[0] + r() * (T.kmh[1] - T.kmh[0])) * kv / 3.6;
    const e = { id: this.id++, kind: 'traffic', vt: T.vt, len: T.len, lane, x, v, vT: v, vBase: v, color: 'orig' };
    { const lead = this.ents.filter((o) => (o.kind === 'traffic' || o.kind === 'police') && o.lane === lane && o.x > x && o.x - x < 120).sort((a, b) => a.x - b.x)[0];
      if (lead && lead.v < v) e.v = Math.min(v, (lead.v || 0) + (lead.x - x - 30) / 6); }   // nasce già accodato, non lanciato contro chi va piano
    this.ents.push(e);
    // a volte un secondo pesante appena più veloce, dietro al primo: lo sorpassa piano piano in seconda corsia ("gara tra elefanti")
    if (heavy && hw && lane === 1 && !this._pair && r() < 0.35) {
      this._pair = true; const b = this.spawnTraffic(x - 70 - r() * 40, 1); this._pair = false;
      if (b && b.vt === 'bus') { b.vBase = b.vT = e.vBase + 0.6 + r() * 0.5; b.v = Math.min(b.v, b.vBase); }
      else if (b) b.drv = undefined;
    }
    return e;
  }

  offerJob() {
    const r = this.rnd, km = 2 + Math.round(r() * 30) / 10, pay = Math.round((90 + km * 45 + r() * 60) / 10) * 10;
    const goods = [['un pacco per un\'officina', 8], ['dei cerchi in lega', 36], ['una centralina riprogrammata', 3], ['dei pezzi di ricambio', 22], ['una cassa di olio motore', 28]];
    const [what, kg] = goods[Math.floor(r() * goods.length)];
    if (!this.trunkFits(kg)) { this.say(`Un lavoretto da ${kg} kg, ma il bagagliaio non ce la fa`, 'job'); return; }
    this.ask({
      kind: 'job', title: 'Lavoretto',
      text: `Porta ${what} (${kg} kg nel bagagliaio) a ${km.toLocaleString('it-IT')} km da qui. Paga € ${pay}, + 30% se arrivi entro ${Math.ceil(km / 0.95)} minuti.`,
      options: [
        { label: 'Lo faccio', act: () => {
          const to = this.s.dist + km * 1000;
          this.job = { to, pay, km, deadline: km / 0.95 * 60, t: 0 };
          this.addItem('pacco', { kg, name: what.replace(/^(un |una |dei |delle )/, '').replace(/^./, (c) => c.toUpperCase()) });
          this.ents.push({ id: this.id++, kind: 'drop', lane: 1, x: to, v: 0 });
          this.say(`Consegna accettata: ${km.toLocaleString('it-IT')} km`, 'job');
        } },
        { label: 'No grazie' },
      ],
    });
  }

  // tempo previsto sui 400 m con la formula di Hale (+ partenza da strada)
  etEstimate() {
    const cv = this.sim.estimatePeak().cv;
    return 5.825 * Math.pow((this.sim.P.mass + 75) * 2.2046 / (cv * 0.986), 1 / 3) + 0.45 + Math.max(0, 0.35 - (this.sim.P.mu - 1.1));
  }

  busted(e) {
    const kmh = this.kmh, sf = speedFine(kmh) || { over: 1, fine: 42 };
    const fine = Math.round(sf.fine * (1 + this.s.heat * 0.3) / 10) * 10;
    e.chase = true; e.lane = this.lane; e.x = Math.min(e.x, this.s.dist - 40);
    this.siren = 1;
    this.say(`Polizia! Fermato a ${Math.round(kmh)} km/h, limite ${GAME_SPEED_LIMIT}`, 'police');
    this.stopAt(null, () => {
      this.ask({
        kind: 'police', title: 'Posto di blocco', time: 12,
        text: `Patente e libretto. Il radar dice ${Math.round(kmh)} km/h, tolta la tolleranza ${GAME_SPEED_LIMIT + sf.over}: ${sf.over} km/h oltre il limite di ${GAME_SPEED_LIMIT}. Multa di € ${fine}.`,
        options: [{ label: `Paga € ${fine}`, act: () => this.payFine(e, fine) }],
        onTimeout: () => this.payFine(e, fine),
      });
    });
  }
  payFine(e, fine) {
    this.s.money -= fine; this.s.fines += fine; this.s.heat = Math.min(5, this.s.heat + 1);
    e.chase = false; e.v = 0; e.lane = 0; this.siren = 0; this.ap = null;
    this.say(`Multa pagata: − € ${fine}`, 'police');
  }

  // fermata guidata dal gioco; atX = posizione assoluta o null (prima possibile)
  stopAt(atX, onStop) { this.ap = { atX, onStop, stopped: false, t: 0 }; }

  // il gioco può prendere il controllo dei pedali (fermate, rifornimento)
  control(inp, dt) {
    const out = { thr: inp.thr, brake: inp.brake, auto: false };
    const ap = this.ap;
    // mai bloccati per sempre: se per 8 secondi l'auto non si avvicina al punto dove fermarsi, il controllo torna a te
    if (ap && !ap.stopped && ap.atX !== null) {
      const rel = ap.atX - this.s.dist;
      if (ap.best === undefined || rel < ap.best - 0.5) { ap.best = rel; ap.stuck = 0; } else ap.stuck = (ap.stuck || 0) + dt;
      if (ap.stuck > 8) { this.ap = null; this.say('Non riesco ad accostare: guida tu', 'info'); return out; }
    }
    if (ap) {
      out.auto = true; out.thr = 0;
      const v = Math.max(0, this.sim.v);
      if (!ap.stopped) {
        const rel = ap.atX === null ? 0 : ap.atX - this.s.dist;
        ap.fwd = ap.atX !== null && rel > 4;                              // il locale è davanti: si va avanti (col cambio automatico la leva va in D)
        if (this.sim.v < -0.3) out.brake = 1;                             // si arrivava in retro: prima fermi
        else if (ap.atX === null) out.brake = Math.min(1, 6 / 10.3 * 1.5 + 0.05);
        else {
          if (ap.fwd && this.sim.gear < 1 && !this.sim.shiftSeq && this.sim.cfg.autoClutch) this.sim.shift(1);   // mai gas in retro o in folle
          // velocità obiettivo: avvicinamento a ~50 km/h, poi frenata a 3 m/s² fino alla pompa
          const vt = Math.min(Math.max(v, 14), Math.sqrt(2 * 3 * Math.max(rel, 0)));
          const need = v * v / (2 * Math.max(rel, 0.8));
          out.brake = v > vt + 0.4 ? Math.min(1, need / 10.3 * 1.4 + (v - vt) * 0.05) : 0;
          if (v < vt - 1 && rel > 4 && this.sim.gear >= 1) out.thr = Math.min(0.5, 0.08 + (vt - v) * 0.1);
          if (rel < 1 && v < 2.5) out.brake = Math.max(out.brake, 0.7);   // arrivati: si frena deciso (prima gli ultimi centimetri si facevano a passo d'uomo)
        }
        if (Math.abs(this.sim.v) < (ap.atX !== null && rel < 1 ? 0.6 : 0.25) && (ap.atX === null || rel < 6)) {   // fermi davvero, anche se si arrivava in retro
          ap.stopped = true;
          if ((this.sim.gear > 1 || this.sim.gear === -1) && this.sim.cfg.autoClutch) this.sim.shift(1);
          if (ap.onStop) ap.onStop();
        }
      } else { out.brake = 1; ap.t += dt; if (ap.tick) ap.tick(dt); }
    }
    return out;
  }

  update(dt) {
    const sim = this.sim, d0 = this.s.dist;
    if (dt > 0) { this.meAcc = this.meV === undefined ? 0 : (sim.v - this.meV) / dt; this.meV = sim.v; }
    if (this.rulli) { /* sui rulli del banco prova (banco.js): le ruote girano ma l'auto resta ferma nel negozio */ }
    else if (sim.v > 0) this.s.dist += sim.v * dt;
    else if (sim.v < 0) {                  // retromarcia: si torna indietro di poco, l'autostrada resta a senso unico
      const far = Math.min(Math.max(this.s.far || 0, d0), d0 + GAME_BACK_MAX), lim = Math.min(d0, Math.max(0, far - GAME_BACK_MAX));
      this.s.dist = Math.max(lim, d0 + sim.v * dt);
      if (this.s.dist <= lim + 1e-6) {     // in fondo: l'auto si ferma davvero (prima la strada si fermava ma la fisica continuava ad andare indietro)
        sim.v = 0; sim.ww = 0; sim.wo = 0; sim.phi = 0;
        if (!this.backWall) this.say('Più indietro di così non si torna: l\'autostrada va solo avanti', 'info');
        this.backWall = true;
      }
    }
    if (this.backWall && (sim.gear !== -1 || sim.v > 0.05)) this.backWall = false;
    sim.revMax = this.backWall ? 0 : GAME_REV_MAX;                       // retro lenta; contro il muro niente gas in retro
    if (!(this.s.far >= this.s.dist) || this.s.far - this.s.dist > GAME_BACK_MAX + 1) this.s.far = this.s.dist;   // più lontano raggiunto (si azzera se la strada salta: partita nuova, tutorial)
    const d = this.s.dist;
    // contachilometri e traguardi
    if (d > d0) {
      const km = (d - d0) / 1000, car = this.s.cars[this.car] || (this.s.cars[this.car] = { km: 0 });
      car.km += km; this.trip += km;
      this.wear(km, sim.in.brake > 0.5 && sim.v > 8 ? km * 0.04 : 0);
      const np = this.nextPerk();
      if (np && car.km >= np.km) { (car.perks || (car.perks = [])).push(np.id); this.perkUp = np; this.say(`${np.km} km: ${np.name}! ${np.note}`, 'money'); }
    }
    if (this.prompt) {
      this.prompt.t -= dt;
      if (this.prompt.t <= 0) {          // senza risposta vale l'ultima opzione (di solito "no")
        const p = this.prompt; this.prompt = null;
        if (p.onTimeout) p.onTimeout(); else { const o = p.options[p.options.length - 1]; if (o.act) o.act(); }
      }
    }
    this.s.heat = Math.max(0, this.s.heat - dt * 0.004);
    const I = this.inside;
    if (I) {
      I.t += dt;
      if (I.phase === 'in' && I.t > (I.dur || GAME_ENT_IN)) { I.phase = 'shop'; I.t = 0; }
      if (I.phase === 'out' && I.t > (I.durOut || GAME_ENT_OUT)) { this.inside = null; this.ap = null; this.lane = 3; this.laneZ = GAME_LANE_Z[3]; this.manualT = 4; }
      if (I.fill) {
        const F = I.fill, step = Math.min(F.liters - F.got, dt * 8);
        F.got += step; sim.fuel = Math.min(1, sim.fuel + step / sim.P.tank); sim.dry = false;
        F.cost = F.got * GAME_FUEL_PRICE;
        if (F.got >= F.liters - 1e-6) {
          const c = Math.round(F.cost * 100) / 100;
          if (this.mode === 'career') this.s.money -= c;
          this.say(`Rifornimento: ${F.got.toFixed(1).replace('.', ',')} litri, − € ${c.toFixed(2).replace('.', ',')}`, 'fuel');
          I.fill = null; I.filled = true;
        }
      }
      return;
    }

    // traffico continuo (città e luoghi della mappa): densità secondo il luogo
    if (this.track === 'city' && !this.ap && !this.inside && this.trafficOn !== false && d > (this.nextTraffic || 0)) {
      const dens = (this.loc && this.loc.traffic) || 1;
      if (this.ents.filter((e) => e.kind === 'traffic' && e.x - d > -60 && e.x - d < 700).length < 3 + dens * 5) {
        // se andiamo più piano del traffico qualcuno arriva da dietro e ci sorpassa
        if (sim.v < 29 && this.rnd() < 0.45) { const e = this.spawnTraffic(d - 140 - this.rnd() * 80, this.rnd() < 0.6 ? 2 : 3); if (e && e.v < sim.v + 3) e.v = e.vT = e.vBase = sim.v + 4 + this.rnd() * 6; }
        else this.spawnTraffic(d + 240 + this.rnd() * 260);
      }
      this.nextTraffic = d + (40 + this.rnd() * 90) / dens;
    }
    if (this.mode === 'career' && sim.running && !this.ap && d > this.nextSpawn) {
      this.spawn(); this.nextSpawn = d + 220 + this.rnd() * 380;
    }
    if (!sim.dry) this.dryDeclined = false;
    if (this.mode === 'career' && sim.dry && Math.abs(sim.v) < 0.5 && !this.prompt && !this.ap && !this.dryDeclined) {
      this.ask({
        kind: 'fuel', title: 'A secco', time: 30,
        text: 'Il serbatoio è vuoto. Il carro attrezzi ti porta 10 litri per € 120.',
        options: [{ label: 'Chiama il furgone (app Soccorso)', act: () => { this.dryDeclined = true; if (typeof window !== 'undefined' && window.telefono && window.telefono.show) window.telefono.show('soc'); } }, { label: 'Solo 10 litri (€ 120)', act: () => { this.dryDeclined = false; this.s.money -= 120; sim.fuel = Math.min(1, sim.fuel + 10 / sim.P.tank); sim.dry = false; this.say('10 litri nel serbatoio. Riavvia il motore.', 'fuel'); } }],
        onTimeout: () => {},
      });
    }

    // scia: dietro un veicolo nella tua corsia l'aria è già smossa. Fino a un terzo di resistenza in meno a pochi metri
    // (quasi metà dietro un autobus), niente oltre i 30 m
    let draft = 0;
    for (const e of this.ents) {
      if ((e.kind !== 'traffic' && e.kind !== 'police') || e.chase || Math.abs(this.laneZ - GAME_LANE_Z[e.lane]) > 1.2) continue;
      const gap = e.x - d - ((e.len || 4.6) + 4.5) / 2;
      if (gap > 0 && gap < 30) draft = Math.max(draft, ((e.len || 4.6) > 8 ? 0.45 : 0.32) * Math.pow(1 - gap / 30, 1.5));
    }
    sim.draft = draft;
    // freni: oltre i 480 °C le pastiglie perdono presa (fading); lo si dice una volta, finché non si raffreddano
    if (sim.brakeT > 480 && !this.fadeSaid) { this.fadeSaid = true; this.say('Freni roventi: il pedale si allunga. Lasciali raffreddare', 'police'); }
    if (sim.brakeT < 300) this.fadeSaid = false;

    // entità
    for (const e of this.ents) {
      if (e.chase) { e.x += (d - 9 - e.x) * Math.min(1, dt * 1.6) + sim.v * dt; e.lane = this.lane; continue; }
      e.x += (e.v || 0) * dt;
      const rel = e.x - d;
      // traffico vivo: ogni tanto cambia corsia (con la freccia prima), e suona se gli stai attaccato
      if (e.kind === 'traffic' && !e.racing && !e.still) {
        // coda: chi raggiunge un veicolo più lento nella sua corsia rallenta e prima o poi mette la freccia
        // ogni guidatore cambia un po' andatura nel tempo; accelera e frena con dei limiti, non a scatti
        e.driftT = (e.driftT || 0) - dt;
        if (e.driftT <= 0 && e.vBase) { e.driftT = 6 + Math.random() * 10; e.vT = e.vBase * (0.93 + Math.random() * 0.12); }
        const F = this.trafficAccel(e, d, dt);
        let acc = F.acc;
        if (e.calmT > 0) { e.calmT -= dt; acc = Math.max(acc, -1.2); }
        e.acc = acc; e.v = Math.max(0, e.v + acc * dt);
        // inchiodata: gomme che stridono (una volta per frenata), luci dei freni accese (e.acc, street2d.js)
        e.skidCool = Math.max(0, (e.skidCool || 0) - dt);
        if (acc < -5.5 && e.v > 7 && !e.skidCool) { e.skidCool = 2.5; e.skidT = 1; this.fx.push({ k: 'skid', I: Math.min(1, 0.4 + (-acc - 5.5) / 3), rel: e.x - d, id: e.id }); }
        if (e.skidT > 0) e.skidT -= dt;
        const lead = F.gap < 12 + e.v * 1.2 && F.vl < e.v + 0.5 && !F.isMe, meAhead = F.isMe && F.gap < 12 + e.v * 1.2;
        if (e.sig > 0) {
          e.sig -= dt;
          if (e.sig <= 0 && e.to) {
            // entra solo se nel momento in cui sposta il volante c'è ancora posto (davanti e per chi arriva da dietro)
            const ok = !(Math.abs(this.laneZ - GAME_LANE_Z[e.to]) < 1.7 && Math.abs(d - e.x) < 14 + Math.abs(sim.v - e.v) * 2)
              && !this.ents.some((o) => o !== e && (o.kind === 'traffic' || o.kind === 'police') && o.lane === e.to && (() => {
                const dx = o.x - e.x, need = ((o.len || 4.6) + (e.len || 4.6)) / 2 + 3;
                return dx > -(need + Math.max(0, (o.v || 0) - e.v) * 1.8) && dx < need + Math.max(0, e.v - (o.v || 0)) * 1.2;
              })());
            if (ok) e.lane = e.to;
            e.to = 0;
          }
        }
        else if (!(this.s.vg || (this.loc && this.loc.bg === 'highway')) && (rel > 30 || rel < -15) && Math.random() < dt * (lead || meAhead ? 0.5 : 0.05)) {
          const to = e.lane + (e.lane === 1 ? 1 : e.lane === 3 ? -1 : Math.random() < 0.5 ? 1 : -1);
          if (!this.ents.some((o) => o !== e && o.kind === 'traffic' && (o.lane === to || o.to === to) && Math.abs(o.x - e.x) < 14 + Math.abs(o.v - e.v) * 2)
            && !(Math.abs(this.laneZ - GAME_LANE_Z[to]) < 1.7 && Math.abs(d - e.x) < 22 + Math.abs(sim.v - e.v) * 2.5)) { e.to = to; e.sig = 1.6; }   // non ci taglia la strada
        }
        // passaggio accanto: suono con effetto doppler
        if (e.prevRel !== undefined && Math.sign(e.prevRel) !== Math.sign(rel) && Math.abs(GAME_LANE_Z[e.lane] - this.laneZ) < 5 && Math.abs(sim.v - (e.v || 0)) > 4)
          this.fx.push({ k: 'pass', dv: sim.v - (e.v || 0), near: Math.abs(GAME_LANE_Z[e.lane] - this.laneZ) < 2.5 });
        e.prevRel = rel;
        e.honk = Math.max(0, (e.honk || 0) - dt);
        if (rel > 3 && rel < 9 && Math.abs(GAME_LANE_Z[e.lane] - this.laneZ) < 1.4 && sim.v > (e.v || 0) + 2 && !e.honk) { e.honk = 4; this.fx.push({ k: 'honk', x: e.x }); }
      }
      if (e.kind === 'police' && !e.checked && !e.busy && rel < 3 && rel > -8 && this.mode === 'career') {
        e.checked = true;
        if (!this.ap && speedFine(this.kmh)) this.busted(e);
      }
      if (e.kind === 'station' && !e.asked && rel < 620 && rel > 120) {
        e.asked = true;
        const missing = Math.max(0, (1 - sim.fuel) * sim.P.tank), full = Math.ceil(missing * GAME_FUEL_PRICE);
        this.ask({
          kind: 'station', title: 'Distributore tra 600 m',
          text: `Nel serbatoio hai ${Math.round(sim.fuel * sim.P.tank)} litri su ${sim.P.tank}. Benzina a € ${GAME_FUEL_PRICE.toLocaleString('it-IT')} al litro.`,
          options: [
            { label: `Pieno · € ${full}`, act: () => this.planFuel(e, missing) },
            { label: '€ 20 di benzina', act: () => this.planFuel(e, 20 / GAME_FUEL_PRICE) },
            { label: 'Tiro dritto' },
          ],
        });
      }
      if (e.kind === 'drop' && this.job && rel <= 0) {
        const j = this.job, bonus = j.t <= j.deadline ? Math.round(j.pay * 0.3) : 0;
        this.s.money += j.pay + bonus; this.s.jobs++; this.s.rep += 3;
        this.say(`Consegna fatta: + € ${j.pay}${bonus ? ` e € ${bonus} di bonus puntualità` : ''}`, 'money');
        this.job = null; e.done = true;
        const pi = this.s.trunk.findIndex((it) => it.kind === 'pacco'); if (pi >= 0) { this.s.trunk.splice(pi, 1); this.applyMass(); }
      }
    }
    if (this.job) this.job.t += dt;
    this.ents = this.ents.filter((e) => !e.done && (e.chase || e.racing || e.kind === 'drop' || (e.x - d > -220 && e.x - d < 1500)));

    // sorpasso automatico: resta a destra; se davanti c'è qualcuno più lento guarda la corsia accanto (prima a sinistra,
    // poi a destra) tenendo conto delle velocità: davanti deve esserci spazio per sorpassare, dietro nessuno che arriva forte
    const moving = (e) => e.kind === 'traffic' || (e.kind === 'police' && !e.chase && (e.v > 0 || e.still));
    const laneFree = (lane, back, front) => !this.ents.some((e) => moving(e) && (e.lane === lane || e.to === lane) && (() => {
      const rel = e.x - d, half = ((e.len || 4.6) + 4.5) / 2, dv = sim.v - e.v;
      // davanti: spazio che serve per non raggiungerlo durante il cambio; dietro: chi è più veloce ci arriverebbe addosso
      return rel > -half - back - Math.max(0, -dv) * 2.2 && rel < half + front + Math.max(0, dv) * 1.6;
    })());
    this.laneT = Math.max(0, this.laneT - dt);
    this.manualT = Math.max(0, this.manualT - dt);
    this.blocked = false;
    if (!this.ap && this.autoLane && this.manualT === 0) {
      const look = 22 + sim.v * 2.4, L = this.lane;
      const lead = this.ents.filter((e) => moving(e) && e.lane === L && e.x - d > -2 && e.x - d < look && e.v < sim.v - 0.2).sort((a, b) => a.x - b.x)[0];
      if (lead && this.laneT === 0) {
        if (L < 3 && laneFree(L + 1, 6, 10)) { this.lane = L + 1; this.laneT = 1.4; }
        else if (L > 1 && laneFree(L - 1, 6, 10)) { this.lane = L - 1; this.laneT = 1.4; }
      } else if (!lead && L > 1 && this.laneT === 0 && laneFree(L - 1, 10, 25 + sim.v * 1.2)) { this.lane = L - 1; this.laneT = 2.2; }
      // nessuno spazio: si accoda dietro a chi è più lento (frenata dolce, più decisa se si è vicini)
      this.blockBrake = 0;
      if (lead && this.lane === L) {
        const gap = lead.x - d - ((lead.len || 4.6) + 4.5) / 2, dv = sim.v - lead.v;
        this.blocked = gap < 10 + dv * 2.2 + sim.v * 0.5;
        // frenata che serve per non arrivargli addosso (più forte quanto più si è vicini e veloci)
        if (this.blocked) this.blockBrake = Math.min(1, 0.12 + Math.max(0, dv) * Math.max(0, dv) / (2 * Math.max(1.5, gap - 4)) / 9 + (gap < 6 ? 0.3 : 0));
      }
    }
    // contatti: tamponi (muso contro coda), vieni tamponato (coda contro muso), strisciate di fianco in cambio corsia
    if (this.shockT > 0) this.shockT -= dt;
    for (const e of this.ents) {
      if (e.hazT > 0) e.hazT -= dt;
      if (!moving(e) || e.soc) continue;                               // il furgone del soccorso (soccorso.js) non urta nessuno
      if ((e.hitT || 0) > 0) { e.hitT -= dt; continue; }
      const rel = e.x - d, half = ((e.len || 4.6) + 4.4) / 2, dz = Math.abs(this.laneZ - (e._gz ?? GAME_LANE_Z[e.lane]));
      if (Math.abs(rel) > half) continue;
      if (dz < 1.6) {
        if (rel > 0 && sim.v > e.v + 0.5) this.crash(e, 'front');
        else if (rel <= 0 && e.v > sim.v + 0.5) this.crash(e, 'rear');
      } else if (dz < 2.6 && Math.abs(rel) < half - 0.6) this.crash(e, 'side');
    }
    // frecce: lampeggiano qualche secondo quando cambia la corsia scelta
    if (this.prevLane !== undefined && this.lane !== this.prevLane) this.signal = { dir: this.lane > this.prevLane ? 'L' : 'R', t: 2.6 };
    this.prevLane = this.lane;
    if (this.signal) { this.signal.t -= dt; if (this.signal.t <= 0) this.signal = null; }
    // sterzo libero: velocità laterale che cresce con la velocità, nessuno scatto tra le corsie
    const freeOK = !this.ap && sim.v > 0.3;
    if (freeOK && Math.abs(this.steerIn) > 0.05) {
      this.free = true; this.manualT = this.autoLane ? 5 : 1e9;
      // più reattivo: la velocità laterale arriva quasi subito e cresce con la velocità dell'auto
      const vmax = 2.4 + Math.min(4.6, sim.v * 0.15);
      // risposta un po' non lineare: piccole correzioni morbide, sterzata piena decisa
      const k = Math.sign(this.steerIn) * Math.pow(Math.abs(this.steerIn), 1.4);
      this.latV += (-k * vmax - this.latV) * Math.min(1, dt * 16);
    } else this.latV += (0 - this.latV) * Math.min(1, dt * 16);
    if (!freeOK || (this.manualT === 0 && Math.abs(this.steerIn) <= 0.05)) this.free = false;
    if (this.free) {
      this.laneZ = Math.max(GAME_LANE_Z[3] - 1.4, Math.min(GAME_LANE_Z[1] + 1.4, this.laneZ + this.latV * dt));
      // assistenza: mollato lo sterzo a meno di 30 cm dal centro di una corsia, la Supra ci si centra piano
      if (Math.abs(this.steerIn) <= 0.05 && Math.abs(this.latV) < 0.3) {
        let c = GAME_LANE_Z[1]; for (const l of [2, 3]) if (Math.abs(GAME_LANE_Z[l] - this.laneZ) < Math.abs(c - this.laneZ)) c = GAME_LANE_Z[l];
        if (Math.abs(c - this.laneZ) < 0.3) this.laneZ += Math.sign(c - this.laneZ) * Math.min(Math.abs(c - this.laneZ), dt * 0.8);
      }
      if (this.laneZ === GAME_LANE_Z[3] - 1.4 || this.laneZ === GAME_LANE_Z[1] + 1.4) this.latV = 0;   // cordolo
      let best = 1; for (const l of [2, 3]) if (Math.abs(GAME_LANE_Z[l] - this.laneZ) < Math.abs(GAME_LANE_Z[best] - this.laneZ)) best = l;
      this.lane = best; this.prevLane = best;
    } else {
      this.latV = 0;
      const zT = GAME_LANE_Z[this.lane];
      // cambio corsia deciso: ~0,7 s a velocità d'autostrada, più morbido da fermi
      this.laneZ += Math.sign(zT - this.laneZ) * Math.min(Math.abs(zT - this.laneZ), dt * (sim.v > 1 || (this.ap && this.ap.enter) ? 3 + Math.min(2.6, sim.v * 0.07) : 0.8));   // accostando a un locale si va a destra decisi, anche piano (prima si attraversavano le corsie a passo d'uomo e da dietro ti tamponavano)
    }

  }

  planFuel(e, liters) {
    liters = Math.max(0, Math.min(liters, (1 - this.sim.fuel) * this.sim.P.tank));
    this.lane = 1;
    this.stopAt(e.x, null);
    const ap = this.ap; let got = 0;
    ap.onStop = () => this.say('Pompa n. 3, sblocca il tappo…', 'fuel');
    ap.tick = (dt) => {
      if (ap.t < 1) return;
      const step = Math.min(liters - got, dt * 9);
      got += step; this.sim.fuel = Math.min(1, this.sim.fuel + step / this.sim.P.tank);
      if (got >= liters - 1e-6) {
        const cost = Math.round(got * GAME_FUEL_PRICE);
        this.s.money -= cost; this.ap = null; this.sim.dry = false;
        this.say(`Rifornimento: ${Math.round(got)} litri, − € ${cost}`, 'fuel');
      }
    };
  }

  // polizia più vicina davanti (per l'avviso radar)
  radar() {
    const d = this.s.dist;
    let best = null;
    for (const e of this.ents) if (e.kind === 'police' && !e.chase && e.x - d > 0 && e.x - d < 450 && (!best || e.x < best.x)) best = e;
    return best ? best.x - d : null;
  }
}
