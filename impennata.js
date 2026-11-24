// Progetto impennata (in prova, docs/fisica/IMPENNATA.md). Spento di serie: si accende da Sviluppatori
// (localStorage nr_impennata = '1') e la pagina si ricarica. Acceso, alle auto a trazione posteriore aggiunge due reparti
// in officina (Ruote e telaio): le barre di reazione / il 4-link, che cambiano quanta spinta delle gomme diventa
// "muso su" (G), e la wheelie bar, che ferma il muso a pochi gradi. La fisica è in sim.js (SupraSim.impennata):
// qui ci sono solo i pezzi e l'interruttore. Le trazioni anteriori non hanno niente: spingendo, il peso va via
// dalle ruote che tirano e il muso non si alza mai.
const IMP = {
  on: (() => { try { return typeof localStorage !== 'undefined' && localStorage.getItem('nr_impennata') === '1'; } catch (e) { return false; } })(),
  // G = quanto della spinta diventa coppia che alza il muso (1 = ponte di serie). Prezzi in euro, km per sbloccarli in carriera
  REAZ: [
    { id: 'oem', G: 1, price: 0, km: 0, brand: '—', name: 'Ponte di serie', note: 'Le sospensioni di serie: in partenza il dietro si abbassa e una parte della spinta si perde a schiacciare le molle.' },
    { id: 'barre', G: 1.15, price: 600, km: 10, brand: 'Su misura', name: 'Barre di reazione regolabili', note: 'Il ponte non si torce più sotto coppia: la spinta va di più sul muso. Da sola raramente basta per alzarlo.' },
    { id: 'link4', G: 1.35, price: 1800, km: 25, brand: 'Su misura', name: 'Ponte a 4 bracci (4-link)', note: 'Geometria che spinge il muso in su quando le gomme tirano (anti-squat alto). Con gomme da gara le auto corte e leggere si sollevano.' },
    { id: 'drag', G: 1.6, price: 3500, km: 40, brand: 'Su misura', name: '4-link da drag, anti-squat al massimo', note: 'Tutto per la partenza: se le gomme tengono, il muso si alza. Se piove o le gomme sono fredde, sgomma e basta.' },
  ],
  BAR: [
    { id: 'no', bar: false, price: 0, km: 0, brand: '—', name: 'Niente wheelie bar', note: 'Se il muso sale, sale finché il paraurti posteriore tocca l\'asfalto (7-8 gradi).' },
    { id: 'si', bar: true, price: 900, km: 25, brand: 'Su misura', name: 'Wheelie bar', note: 'Due rotelline dietro il paraurti: il muso si ferma a 2-3 gradi e la spinta resta sulle gomme.' },
  ],
  // gomma da drag in partenza (v0.149): sotto i 22 km/h tiene di più, fino agli 80 torna normale. Una slick da drag calda
  // (fianco morbido che si accartoccia e poi stende il battistrada, mescola tenera, burnout) in partenza arriva a μ 2,5-3:
  // le slick del gioco hanno μ ≈ 1,7-2 tutto il tempo, quindi in partenza ×1,6 (μ 2,7-3,1). Le radiali da drag (ET Street) ×1,25.
  // Sul bagnato niente: una slick sull'acqua è una saponetta (−30 % in più del bagnato normale)
  DRAG: { slick: 1.6, radiale: 1.25 },
  // tetto dell'angolo e smorzamento (vedi SupraSim.impennata): senza wheelie bar sale finché il paraurti dietro tocca
  // (sbalzo ~0,85 m, paraurti a ~0,3 m da terra: una dozzina di gradi; v0.159 tetto a 10° per non esagerare)
  barDeg: 3, maxDeg: 10, c: 2.2,
  // scena (v0.159): il muso si alza quando la spinta di adesso (accelerazione della cassa) supera quella che serve a
  // quell'auto (peso × distanza del baricentro dall'asse dietro, contro accelerazione × altezza del baricentro × G × film).
  // film = quanto manca alla fisica semplice del gioco (ponte che si torce, molle che rimbalzano); le gomme da drag ci
  // aggiungono il 15 %, e cresce coi CV per tonnellata (pwRif 450 CV/t = ×1, da ×0,7 a ×1,2: il ponte si torce di più con
  // più coppia). tauA = 0,4 s: la spinta deve durare, il primo colpo schiaccia solo la cassa (il muso parte dopo 3-5 m).
  // pieno = di quanto sopra la soglia il muso arriva al tetto. Niente mosse: succede o non succede
  scena: { film: 1.6, pieno: 0.3, k: 70, c: 10, tauA: 0.4, pwRif: 450, filmMin: 0.7, filmMax: 1.2, v0: 20, v1: 32, vCala: 0.6 },
};
(function impennataPezzi() {
  if (!IMP.on || typeof CARS === 'undefined') return;
  for (const id of Object.keys(CARS)) {
    const c = CARS[id];
    if (!c || c.fwd || !c.tuning || typeof c.params !== 'function') continue;
    const $ = (p) => Math.round(p * (c.priceK || 1) / 10) * 10, it = (x, extra) => Object.assign({ price: $(x.price), km: x.km, brand: x.brand, name: x.name, note: x.note, dsp: {} }, extra);
    c.tuning.reazione = { label: 'Barre di reazione', items: IMP.REAZ.map((x) => it(x, { id: x.id, sim: { G: x.G } })) };
    c.tuning.wheeliebar = { label: 'Wheelie bar', items: IMP.BAR.map((x) => it(x, { id: x.id, sim: { bar: x.bar } })) };
    const p0 = c.params;
    c.params = (sel, adj) => {
      const r = p0(sel, adj), s = sel || {};
      const G = tuningItemOf(c.tuning, 'reazione', s.reazione).sim.G, bar = tuningItemOf(c.tuning, 'wheeliebar', s.wheeliebar).sim.bar;
      const ty = tuningItemOf(c.tuning, 'tires', s.tires), tn = ((ty && ty.id) || '') + ' ' + ((ty && ty.name) || '');
      const drag = /slick/i.test(tn) && /drag/i.test(tn) ? IMP.DRAG.slick : /et ?street|radiale da drag/i.test(tn) ? IMP.DRAG.radiale : 1;
      r.sim.wheelie = { G, bar, drag, barDeg: IMP.barDeg, maxDeg: IMP.maxDeg, c: IMP.c, scena: IMP.scena };
      return r;
    };
  }
})();
if (typeof window !== 'undefined') Object.assign(window, { IMP });
