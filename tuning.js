// ============================================================================
//  Reparto tuning · catalogo delle parti e loro effetto su fisica e suono
//  I marchi identificano parti reali per la JZA80/2JZ; il carattere sonoro è
//  una nostra modellazione fisica, non una registrazione del prodotto.
// ============================================================================
// Ogni auto ha il suo catalogo con la stessa forma (categorie → tendine, pezzi con prezzo e chilometri).
// TUNING e TUNING_PRESETS puntano sempre al catalogo dell'auto in uso (vedi setActiveCar in cars.js).
// ---------------------------------------------------------------------------------------------------
//  Assetto a livelli (uguale per tutte le auto). Livello 0 = originale, nessuna regolazione. Più sale il livello,
//  più il pezzo parte basso e rigido, e più si può regolare: altezza (mm rispetto all'originale, negativo = più
//  bassa) e rigidità delle molle (moltiplicatore, 1 = originale). La regolazione sta in S.adj[auto] = { h, k }
//  ed è gratis; cambiando pezzo si riparte dai valori di fabbrica del livello.
// ---------------------------------------------------------------------------------------------------
const SUSP_LV = [
  { lv: 0, h0: 0, h: [0, 0], k0: 1, k: [1, 1] },
  { lv: 1, h0: -25, h: [-35, 10], k0: 1.2, k: [0.9, 1.4] },
  { lv: 2, h0: -35, h: [-55, 20], k0: 1.5, k: [0.8, 1.8] },
  { lv: 3, h0: -45, h: [-75, 35], k0: 1.9, k: [0.7, 2.4] },
  { lv: 4, h0: -55, h: [-100, 50], k0: 2.4, k: [0.6, 3.2] },
  { lv: 5, h0: -65, h: [-120, 90], k0: 3.0, k: [0.5, 4.2] },
];
const SUSP_NOTE = [
  null,
  'Molle più corte: un po\' più bassa e un po\' più ferma. Regolazione minima, qualche millimetro e un filo di rigidità.',
  'Molle e ammortizzatori sportivi: più bassa e più ferma. Regoli altezza e rigidità di poco.',
  'Coilover regolabili: scegli tu quanto abbassarla e quanto irrigidirla, senza esagerare.',
  'Coilover da pista a doppia regolazione: parte bassa e dura, ma puoi anche rialzarla o ammorbidirla. Sugli urti inizia a toccare.',
  'Assetto da competizione a tre vie: da radente a rally, da mollissima a durissima. Bassissima tocca per terra sugli urti.',
];
const SUSP_NAME = ['Originale', 'Molle sportive', 'Molle e ammortizzatori sportivi', 'Coilover regolabili', 'Coilover da pista', 'Assetto da competizione'];
const SUSP_BRAND = [null, 'Eibach', 'Bilstein', 'KW', 'Öhlins', 'Su misura'];
const SUSP_PRICE = [0, 600, 1000, 1600, 2800, 4500], SUSP_KM = [0, 5, 10, 18, 28, 42];
const suspClamp = (v, a, b) => Math.max(a, Math.min(b, v));
// costruisce la categoria "Assetto": o = { make, ids[6], note0, pitch, fwd, price(fn), km(fn), brand[], name[] }
function suspCat(o) {
  const pr = o.price || ((n) => n), km = o.km || ((n) => n);
  return { label: 'Assetto', items: SUSP_LV.map((L) => {
    const it = { id: o.ids[L.lv], price: pr(SUSP_PRICE[L.lv]), km: km(SUSP_KM[L.lv]), brand: L.lv ? ((o.brand || {})[L.lv] || SUSP_BRAND[L.lv]) : o.make,
      name: L.lv ? ((o.name || {})[L.lv] || SUSP_NAME[L.lv]) : 'Originale', note: L.lv ? SUSP_NOTE[L.lv] : o.note0,
      susp: { lv: L.lv, pitch: o.pitch || 1, fwd: !!o.fwd } };
    const r = suspResolve(it, null); it.sim = { susp: r.susp }; it.look = { low: r.low };
    return it;
  }) };
}
// valori correnti (h, k) di un pezzo con la regolazione dell'auto, sempre dentro i limiti del livello
function suspState(item, adj) {
  const sp = item && item.susp, L = SUSP_LV[sp ? sp.lv : 0];
  const h = suspClamp(adj && Number.isFinite(adj.h) ? adj.h : L.h0, L.h[0], L.h[1]);
  const k = suspClamp(adj && Number.isFinite(adj.k) ? adj.k : L.k0, L.k[0], L.k[1]);
  return { lv: L.lv, adjustable: L.h[0] !== L.h[1], h: Math.round(h / 5) * 5, k: Math.round(k * 10) / 10, hMin: L.h[0], hMax: L.h[1], kMin: L.k[0], kMax: L.k[1], h0: L.h0, k0: L.k0 };
}
// dalla regolazione alla fisica: beccheggio, presa, partenza, baricentro, aria, sensibilità alle buche e ai fondi bassi
function suspResolve(item, adj) {
  const sp = item && item.susp;
  if (!sp) return { susp: (item && item.sim && item.sim.susp) || { pitch: 1, grip: 1, launch: 1 }, low: ((item && item.look) || {}).low || 0, st: null };
  const st = suspState(item, adj), h = st.h, k = st.k;
  const lowN = suspClamp(-h / 90, -1, 1);                                   // 1 = molto bassa, −1 = molto alta
  const grip = Math.min(1.07, 1 + 0.05 * lowN + (k >= 1 ? 0.03 * Math.min(k - 1, 1.5) / 1.5 : -0.04 * (1 - k)));
  const launch = sp.fwd ? suspClamp(1 + 0.04 * (k - 1), 0.96, 1.05) : suspClamp(1 + 0.06 * (1 - k), 0.95, 1.07);
  const rough = suspClamp(Math.max(0, k - 1) * 0.22 + Math.max(0, -h - 40) / 120 * 0.5 - Math.max(0, h) / 200, 0, 1);
  return {
    susp: { pitch: sp.pitch * Math.pow(k, -0.85), grip, launch, dcg: 0.65 * h / 1000, cdK: 1 + (h < 0 ? 0.0006 : 0.0009) * h, rough, scrapeK: suspClamp((-h - 70) / 50, 0, 1), h, k },
    low: suspClamp(-h / 13, -7, 9) || 0, st,
  };
}

const TUNING_SUPRA = {
  exhaust: {
    label: 'Scarico (catback)',
    items: [
      { id: 'oem', price: 0, pw: 1, brand: 'Toyota', name: 'Originale', note: 'Silenziatore a camere: cupo, trattenuto, il fischio del turbo resta in primo piano.',
        dsp: { L: 4.4, r: -0.42, m: [['lp', 360, 0.6], ['lp', 1000, 0.5], ['peak', 105, 1.0, 6], ['peak', 420, 2, -5]], g: 1.7, jet: 0.12, rasp: 0, tips: 1 } },
      { id: 'hks', price: 1300, pw: 1.03, brand: 'HKS', name: 'Hi-Power', note: 'Terminale singolo grande: basso pieno e profondo, rimbombo a 2000–3000 giri.',
        dsp: { L: 4.0, r: -0.55, m: [['lp', 1150, 0.6], ['peak', 118, 1.0, 6], ['peak', 520, 1.2, 3], ['peak', 2400, 1.5, -5]], g: 2.2, jet: 0.4, rasp: 0.2, tips: 1 } },
      { id: 'apexi', price: 1100, pw: 1.035, brand: 'Apexi', name: 'N1 Evolution', note: 'Il classico JDM: ruvido e aggressivo, medi in evidenza, doppia uscita.',
        dsp: { L: 4.0, r: -0.6, m: [['lp', 2200, 0.6], ['peak', 160, 1.0, 3], ['peak', 900, 1.3, 5], ['peak', 3000, 2, -2]], g: 2.1, jet: 0.6, rasp: 0.45, tips: 2 } },
      { id: 'tomei', price: 2400, pw: 1.04, brand: 'Tomei', name: 'Expreme Ti', note: 'Titanio a pareti sottili: timbro metallico e acuto, urlo in alto.',
        dsp: { L: 3.9, r: -0.62, m: [['lp', 3200, 0.6], ['peak', 140, 1.0, 2], ['peak', 1400, 1.6, 6], ['peak', 3800, 2.5, 3]], g: 1.9, jet: 0.8, rasp: 0.6, tips: 1 } },
      { id: 'blitz', price: 1500, pw: 1.03, brand: 'Blitz', name: 'Nür-Spec', note: 'Sportivo ma educato: tono profondo, poco rimbombo in crociera.',
        dsp: { L: 4.1, r: -0.5, m: [['lp', 1400, 0.6], ['peak', 110, 1.0, 5], ['peak', 700, 1.3, 2], ['peak', 2500, 1.5, -4]], g: 2.0, jet: 0.3, rasp: 0.15, tips: 2 } },
      { id: 'straight', price: 350, pw: 1.05, brand: 'Su misura', name: 'Straight pipe 3,5"', note: 'Tubo dritto senza silenziatori: tutto il motore, crudo e fortissimo.',
        dsp: { L: 3.5, r: -0.68, m: [['lp', 5200, 0.55], ['peak', 140, 0.9, 3], ['peak', 1850, 1.4, 5], ['peak', 3600, 2, 2]], g: 2.4, jet: 1.0, rasp: 0.8, tips: 1 } },
    ],
  },
  cat: {
    label: 'Downpipe e catalizzatore',
    items: [
      { id: 'oem', price: 0, pw: 1, brand: 'Toyota', name: 'Catalizzatore originale a 400 celle', note: 'Ceramico ad alta densità: smussa le alte frequenze, il tono resta cupo e chiuso.', dsp: { lp: 2600, g: 0.85, pop: 1 } },
      { id: 'sport', price: 650, pw: 1.02, brand: 'Su misura', name: 'Downpipe 3,5" con cat 200 celle', note: 'Metallico ad alto flusso: il tono sale un po\', il suono si fa più duro e ruvido, scoppiettii più vivi.', dsp: { lp: 5200, g: 1.0, pop: 1.25, len: 0.92, tone: 1.15, bark: 3, edge: 0.5, rasp: 0.12, jet: 0.1 } },
      { id: 'tubolare', price: 1400, pw: 1.03, brand: 'Su misura', name: 'Collettore tubolare con downpipe e cat a 100 celle', note: 'Tubi di lunghezza uguale e filtro quasi aperto: tono ancora più alto, cattivo e ruggente, scoppi forti.', dsp: { lp: 6500, g: 1.12, pop: 1.4, len: 0.82, tone: 1.35, bark: 6, edge: 0.95, rasp: 0.26, jet: 0.22 } },
      { id: 'decat', price: 250, pw: 1.03, brand: 'Su misura', name: 'Decat (solo pista)', note: 'Nessun filtro: tono altissimo, suono crudo e ruggente, afterfire fortissimi.', dsp: { lp: 0, g: 1.3, pop: 1.7, len: 0.72, tone: 1.6, bark: 9, edge: 1.5, rasp: 0.45, jet: 0.38 } },
    ],
  },
  turbo: {
    label: 'Turbocompressore',
    items: [
      { id: 'ct12b', price: 0, brand: 'Toyota', name: 'CT12B biturbo sequenziale', note: 'Due turbine piccole: spinta da 1800 giri, il secondo entra a 4000 con cambio di fischio. Con centralina aftermarket 1 bar.',
        sim: { max: 0.75, a: 1500, b: 3000, up: 0.26, down: 0.75, twin: true }, dsp: { f0: 2500, f1: 8700, w: 0.035, wh: 0.05, damp: 1700, twin: 1, mani: 0 } },
      { id: 'gtx3582', price: 4500, brand: 'Garrett', name: 'GTX3582R', note: 'Single a cuscinetti, risposta pronta: fischio pulito e acuto.',
        sim: { max: 1.6, a: 2900, b: 4300, up: 0.45, down: 0.9 }, dsp: { f0: 1800, f1: 6900, w: 0.055, wh: 0.08, damp: 2300, twin: 0, mani: 1 } },
      { id: 'pte6466', price: 3800, brand: 'Precision', name: '6466 Gen2', note: 'Il single da strada più diffuso sul 2JZ: spool rumoroso, sibilo pieno.',
        sim: { max: 1.95, a: 3200, b: 4600, up: 0.5, down: 0.95 }, dsp: { f0: 1500, f1: 6100, w: 0.07, wh: 0.09, damp: 2400, twin: 0, mani: 1 } },
      { id: 'efr9180', price: 5200, brand: 'BorgWarner', name: 'EFR 9180', note: 'Girante in titanio-alluminio, spool rapido per la taglia: fischio più discreto.',
        sim: { max: 1.9, a: 3100, b: 4500, up: 0.4, down: 0.9 }, dsp: { f0: 1900, f1: 7200, w: 0.045, wh: 0.07, damp: 2400, twin: 0, mani: 1 } },
      { id: 't51r', price: 6000, brand: 'HKS', name: 'T51R SPL', note: 'Il mostro anni 90 delle drag: tanto ritardo, poi un ululato enorme oltre 5000.',
        sim: { max: 2.1, a: 4000, b: 5600, up: 0.85, down: 1.1 }, dsp: { f0: 1300, f1: 5300, w: 0.095, wh: 0.11, damp: 2600, twin: 0, mani: 1 } },
    ],
  },
  bov: {
    label: 'Valvola pop-off',
    items: [
      { id: 'oem', price: 0, brand: 'Toyota', name: 'Ricircolo originale', note: 'Rimanda l’aria in aspirazione: solo un soffio leggero.', dsp: { v: 0, f0: 1800, sw: 600, q: 0.7, g: 0.12, chirp: 0 } },
      { id: 'ssqv', price: 380, brand: 'HKS', name: 'SSQV', note: 'Sfiato in atmosfera con il celebre sibilo acuto a “trombetta”.', dsp: { v: 1, f0: 2700, sw: 1100, q: 1.1, g: 0.85, chirp: 1 } },
      { id: 'raceport', price: 450, brand: 'Turbosmart', name: 'Race Port', note: 'Grande portata: soffio forte e pieno, molto aria.', dsp: { v: 1, f0: 2000, sw: 900, q: 0.7, g: 0.9, chirp: 0.2 } },
      { id: 'greddy', price: 300, brand: 'GReddy', name: 'Type-RS', note: 'Regolabile, tono più basso e rotondo.', dsp: { v: 1, f0: 1600, sw: 700, q: 0.75, g: 0.7, chirp: 0 } },
      { id: 'none', price: 0, brand: '—', name: 'Nessuna (flutter)', note: 'Il compressore va in pompaggio: il famoso “stu-tu-tu”.', dsp: { v: 2, f0: 1500, sw: 1000, q: 0.75, g: 0.75, chirp: 0 } },
    ],
  },
  wastegate: {
    label: 'Wastegate',
    items: [
      { id: 'int', price: 0, brand: 'Integrata', name: 'Interna / ricircolata', note: 'L’eccesso di gas torna nello scarico: nessun rumore in più.', dsp: { scream: 0 } },
      { id: 'tial', price: 900, brand: 'TiAL', name: 'MV-R 44 mm con screamer pipe', note: 'Scarico libero della wastegate: urlo e crepitio a pieno boost (solo single turbo).', dsp: { scream: 1 } },
    ],
  },
  intake: {
    label: 'Aspirazione',
    items: [
      { id: 'oem', price: 0, pw: 1, brand: 'Toyota', name: 'Airbox originale', note: 'Chiuso e silenziato.', dsp: { in: 1, roar: 1, wh: 1 } },
      { id: 'pf', price: 280, pw: 1.02, brand: 'HKS', name: 'Super Power Flow', note: 'Filtro a fungo aperto: risucchio forte, soffio e fischio del turbo amplificati.', dsp: { in: 2.4, roar: 2.6, wh: 1.7 } },
    ],
  },
  cams: {
    label: 'Alberi a camme',
    items: [
      { id: 'oem', price: 0, brand: 'Toyota', name: 'Originali', note: 'Minimo liscio come una turbina.', sim: { idle: 750, low: 1, high: 1, lope: 0 }, dsp: { lope: 0 } },
      { id: 'hks264', price: 1100, brand: 'HKS', name: '264° step pro', note: 'Un filo di irregolarità al minimo, più allungo.', sim: { idle: 800, low: 0.97, high: 1.04, lope: 0.35 }, dsp: { lope: 0.35 } },
      { id: 'hks272', price: 1200, brand: 'HKS', name: '272° step pro', note: 'Incrocio lungo: minimo “zoppo” e ballerino, coppia spostata in alto.', sim: { idle: 950, low: 0.9, high: 1.09, lope: 1 }, dsp: { lope: 1 } },
    ],
  },
  ecu: {
    label: 'Centralina',
    items: [
      { id: 'oem', price: 0, brand: 'Toyota', name: 'Originale', note: 'Limitatore a 7000 a taglio d’iniezione: niente scoppi, niente launch.', sim: { lim: 7000, spark: false, launch: false, pops: false } },
      { id: 'haltech', price: 2600, brand: 'Haltech', name: 'Elite 2500', note: 'Taglio d’accensione a 7600, launch control. Gli scoppi in rilascio vogliono la mappa pop & bang.', sim: { lim: 7600, spark: true, launch: true, pops: false } },
      { id: 'link', price: 2100, brand: 'Link', name: 'G4X', note: 'Taglio d’accensione a 7500, launch control. Gli scoppi in rilascio vogliono la mappa pop & bang.', sim: { lim: 7500, spark: true, launch: true, pops: false } },
      // pop & bang (v0.105): una mappa in più sulla centralina più potente, non più una spunta nel menu di pausa
      { id: 'popbang', price: 3050, brand: 'Haltech', name: 'Elite 2500 + mappa pop & bang', note: 'La Haltech più la mappa in più: in rilascio anticipo ritardato e benzina che brucia nello scarico, scoppi e fiammate. Niente potenza in più.', sim: { lim: 7600, spark: true, launch: true, pops: true } },
    ],
  },  limiter: null,

  tires: {
    label: 'Gomme posteriori',
    items: [
      // tyre: curva di Pacejka (B rigidezza, C forma, E caduta dopo il picco), temperatura ideale e ampiezza della finestra
      { id: 'oem', price: 0, brand: 'Bridgestone', name: 'Potenza originali 265/40 R17', note: 'Stradali: picco al 10 % di slittamento, poi calano dolcemente. Lavorano bene da freddo (ideale 80 °C).', sim: { mu: 1.1, tyre: { B: 20, C: 1.42, E: 0.1, opt: 80, win: 70, crr: 0.012 } }, dsp: {} },
      { id: 'r888r', price: 1100, brand: 'Toyo', name: 'Proxes R888R', note: 'Semi-slick: tanta presa ma picco stretto al 7 %, oltre mollano di colpo. Vanno scaldate (ideale 95 °C).', sim: { mu: 1.3, tyre: { B: 22, C: 1.5, E: 0.4, opt: 95, win: 45, crr: 0.013 } }, dsp: {} },
      { id: 'etstreet', price: 1500, brand: 'Mickey Thompson', name: 'ET Street R', note: 'Radiali da drag: fianco morbido, picco largo al 15 % e calo minimo. Ideali tiepide (70 °C); in curva e in frenata sono le peggiori.', sim: { mu: 1.55, tyre: { B: 15, C: 1.3, E: -0.3, opt: 70, win: 55, crr: 0.016, brake: 0.88 } }, dsp: {} },
      { id: 'slick', price: 2400, km: 45, brand: 'Mickey Thompson', name: 'Gomme da drag slick', note: 'Slick lisce da drag: la presa più alta di tutte, in partenza si piantano e in frenata mordono. Da fredde scivolano: scaldale (ideali 80 °C). Non omologate.', sim: { mu: 1.85, tyre: { B: 13, C: 1.35, E: -0.2, opt: 80, win: 50, crr: 0.017, brake: 1.0 } }, dsp: {} },
    ],
  },
  final: {
    label: 'Differenziale e rapporto finale',
    items: [
      { id: 'oem', price: 0, brand: 'Toyota', name: 'Torsen, finale 3,133', note: 'Il differenziale della RZ: ripartisce la coppia sulla ruota che tiene. Lungo: 285 km/h in sesta.', sim: { fd: 3.133, diff: 'torsen' } },
      { id: 'f3769', price: 900, brand: 'Toyota', name: 'Torsen, finale 3,769 (corto)', note: 'Coppia conica della versione automatica: +20 % di spinta in ogni marcia, meno allungo.', sim: { fd: 3.769, diff: 'torsen' } },
      { id: 'osg4083', price: 1900, brand: 'OS Giken', name: 'Autobloccante a 2 vie, finale 4,083', note: 'Da drag: blocca tutto in trazione e in rilascio, partenze cattive, velocità massima più bassa.', sim: { fd: 4.083, diff: 'lsd' } },
    ],
  },
  gearbox: {
    label: 'Cambio',
    items: [
      { id: 'oem', price: 0, brand: 'Getrag', name: 'V160 a 6 marce', note: 'Rapporti di serie: prima lunga, sesta di riposo.', sim: { gears: null } },
      { id: 'close', price: 4200, brand: 'Quaife', name: 'Ravvicinato a 6 marce', note: 'Prima più corta, marce vicine: a ogni cambiata i giri calano poco e il turbo resta in pressione.', sim: { gears: [0, 3.25, 2.25, 1.72, 1.38, 1.13, 0.94] } },
    ],
  },
  intercooler: {
    label: 'Intercooler',
    items: [
      { id: 'oem', price: 0, brand: 'Toyota', name: 'Originale (frontale piccolo)', note: 'Basta per la pressione di serie; in un allungo lungo o a 1 bar l\'aria scalda e la potenza cala anche del 7-8 %.', sim: { ic: { heat: 1.0 } } },
      { id: 'hks', price: 1300, brand: 'HKS', name: 'R-type frontale maggiorato', note: 'Massa radiante tripla: l\'aria resta fresca anche a 2 bar, la potenza non cala più tirando le marce. Un filo di ritardo in più del turbo.', sim: { ic: { heat: 0.35, lag: 1.06 } } },
      { id: 'race', price: 2600, brand: 'Wagner', name: 'Intercooler da competizione aria-acqua', note: 'Scambiatore aria-acqua col suo radiatore e la sua pompa: tubi cortissimi e aria quasi a temperatura esterna anche a 2 bar, allungo dopo allungo. La potenza non cala più e il turbo risponde come col piccolo di serie.', sim: { ic: { heat: 0.12, lag: 1.0 } }, look: { fmic: 1 } },
    ],
  },
  suspension: suspCat({ make: 'Toyota', ids: ['oem', 'springs', 'dampers', 'tein', 'race', 'pro'], pitch: 1,
    note0: 'Comodo: in partenza la coda si siede e il muso si alza molto, in frenata si tuffa. Nessuna regolazione.',
    brand: { 3: 'Tein', 4: 'Öhlins' }, name: { 3: 'Flex Z regolabile', 4: 'Road & Track' } }),
  weight: {
    label: 'Alleggerimento',
    items: [
      { id: 'oem', price: 0, brand: '—', name: 'Di serie', note: '1570 kg con il pieno a metà.', sim: { dm: 0, cabin: 1 } },
      { id: 's1', price: 900, brand: 'Bride', name: 'Sedili racing, via i posteriori', note: '−45 kg: un decimo sui 400 m. L\'abitacolo rimbomba un po\' di più.', sim: { dm: -45, cabin: 1.12 } },
      { id: 's2', price: 3200, brand: 'Seibon', name: 'Cofano e portellone in carbonio, batteria al litio', note: '−95 kg in tutto, e meno peso davanti: inserimento più pronto.', sim: { dm: -95, cabin: 1.2 } },
      { id: 's3', price: 6500, brand: 'Su misura', name: 'Interni smontati e vetri in policarbonato', note: '−160 kg: abitacolo nudo, si sente ogni sassolino e ogni scoppio. Solo per chi fa gare.', sim: { dm: -160, cabin: 1.45 } },
    ],
  },
  clutch: {
    label: 'Frizione',
    items: [
      { id: 'oem', price: 0, brand: 'Toyota', name: 'Monodisco originale', note: 'Regge 820 Nm: col biturbo spinto slitta.', sim: { Ie: 0.21, clutch: 820 }, dsp: { rattle: 0 } },
      { id: 'osgiken', price: 1800, brand: 'OS Giken', name: 'Trilama OS Giken', note: 'Regge fino a 1.500 Nm: niente slittamenti nemmeno col T51R e la cilindrata maggiorata. Pedale duro. Il volano è un reparto a parte.', sim: { Ie: 0.21, clutch: 1500 }, dsp: { rattle: 0 } },
    ],
  },
};

let TUNING = TUNING_SUPRA;
const SUPRA_PRESETS = [
  { id: 'stock', name: 'Originale', sel: { exhaust: 'oem', cat: 'oem', turbo: 'ct12b', bov: 'oem', wastegate: 'int', intake: 'oem', cams: 'oem', ecu: 'oem', clutch: 'oem', tires: 'oem', final: 'oem', gearbox: 'oem', intercooler: 'oem', suspension: 'oem', weight: 'oem' } },
  { id: 'street', name: 'Street biturbo', sel: { exhaust: 'hks', cat: 'sport', turbo: 'ct12b', bov: 'ssqv', wastegate: 'int', intake: 'pf', cams: 'oem', ecu: 'link', clutch: 'oem', tires: 'r888r', final: 'oem', gearbox: 'oem', intercooler: 'oem', suspension: 'tein', weight: 's1' } },
  { id: 'single', name: 'Big single', sel: { exhaust: 'tomei', cat: 'sport', turbo: 'pte6466', bov: 'raceport', wastegate: 'tial', intake: 'pf', cams: 'hks264', ecu: 'haltech', clutch: 'osgiken', tires: 'etstreet', final: 'f3769', gearbox: 'close', intercooler: 'hks', suspension: 'tein', weight: 's2' } },
  { id: 'drag', name: 'Drag anni 90', adj: { h: -20, k: 0.8 }, sel: { exhaust: 'straight', cat: 'decat', turbo: 't51r', bov: 'none', wastegate: 'tial', intake: 'pf', cams: 'hks272', ecu: 'haltech', clutch: 'osgiken', tires: 'etstreet', final: 'osg4083', gearbox: 'close', intercooler: 'hks', suspension: 'race', weight: 's3' } },
];
let TUNING_PRESETS = SUPRA_PRESETS;

// cambio regolabile (auto da disegno, v0.91): «sport» = un rapporto unico che allunga o accorcia tutte le marce insieme,
// «da corsa» = ogni marcia per conto suo. La regolazione sta in S.adj[auto] (gk e gr) accanto ad altezza e rigidità dell'assetto.
const GB_ADJ = { all: [0.8, 1.2], each: [0.7, 1.3] };
function gbState(item, adj) {
  const gb = item && item.gb; if (!gb) return null;
  // il pezzo può allargare la ghiera verso il lungo (gb.lo, v0.107: i cambi di Luca arrivano a 300-350 all'ora)
  const R0 = GB_ADJ[gb.mode === 'all' ? 'all' : 'each'], R = [Math.min(R0[0], gb.lo || R0[0]), R0[1]], cl = (v) => Math.round(Math.min(R[1], Math.max(R[0], v)) * 1000) / 1000, base = gb.base;
  if (gb.mode === 'all') { const k = cl(adj && Number.isFinite(adj.gk) ? adj.gk : gb.k0); return { mode: 'all', k, k0: gb.k0, min: R[0], max: R[1], base, mul: base.map((_, i) => (i ? k : 1)) }; }
  const mul = base.map((_, i) => (i ? cl(adj && Array.isArray(adj.gr) && Number.isFinite(adj.gr[i]) ? adj.gr[i] : gb.m0[i]) : 1));
  return { mode: 'each', min: R[0], max: R[1], base, mul, m0: gb.m0 };
}
// rapporti veri dal pezzo e dalla regolazione: una marcia non può essere più corta (rapporto più alto) di quella prima
function gbGears(item, adj) {
  const st = gbState(item, adj); if (!st) return item && item.sim ? item.sim.gears : null;
  const g = st.base.map((v, i) => (i ? v * st.mul[i] : 0));
  for (let i = 2; i < g.length; i++) g[i] = Math.min(g[i], g[i - 1] * 0.97);
  return g.map((v) => Math.round(v * 1000) / 1000);
}
// ---- Volano (v0.105): reparto suo, separato dalla frizione (che decide solo quanta coppia regge). Quattro livelli che cambiano
// l'inerzia del motore (P.Ie): pesante = giri che salgono e scendono piano, minimo più rotondo, partenze che non si spengono;
// leggero e superleggero = motore nervoso che prende e perde giri in fretta (e tintinnio del cambio in folle).
// Ie0 = inerzia di serie dell'auto; pr(n) e kk(n) = prezzo e km dell'auto (le generiche li scalano)
const VOLANO_LV = [
  { id: 'oem', k: 1, name: 'Originale', note: 'Il volano di fabbrica: né pigro né nervoso.' },
  { id: 'pesante', k: 1.4, price: 350, km: 0, name: 'Pesante in ghisa', note: 'Più massa che gira: il motore sale e scende di giri più piano, il minimo è più rotondo e corposo, in partenza non si spegne. In ripresa sembra più lento.' },
  { id: 'leggero', k: 0.72, price: 700, km: 10, name: 'Alleggerito', note: 'Acciaio tornito: i giri salgono e scendono più in fretta, le cambiate sono più svelte. Un po\' di tintinnio del cambio in folle.' },
  { id: 'super', k: 0.5, price: 1400, km: 25, name: 'Superleggero in alluminio', note: 'Metà dell\'inerzia: motore nervosissimo, prende giri a ogni tocco del gas e li perde appena molli. Minimo ballerino, partenze da dosare o si spegne, tintinnio forte in folle.' },
];
function volanoCat(Ie0, pr, kk, brand) {
  pr = pr || ((n) => n); kk = kk || ((n) => n);
  return { label: 'Volano', items: VOLANO_LV.map((v) => ({ id: v.id, price: v.id === 'oem' ? 0 : pr(v.price), km: v.id === 'oem' ? 0 : kk(v.km), brand: v.id === 'oem' ? (brand || 'Di serie') : v.id === 'pesante' ? 'Sachs' : 'Fidanza',
    name: v.name, note: v.note, sim: { Ie: Math.round(Ie0 * v.k * 1000) / 1000, k: v.k, idle: v.k > 1 ? -40 : v.k <= 0.5 ? 110 : v.k < 1 ? 40 : 0, hunt: v.k <= 0.5 ? 75 : v.k < 1 ? 25 : 0 }, dsp: { rattle: v.k <= 0.5 ? 1 : v.k < 1 ? 0.6 : 0 } })) };
}
// inerzia e tintinnio da volano e frizione (senza reparto Volano resta quella della frizione, come prima)
function volanoIe(fly, cl) { return fly && fly.sim && fly.sim.Ie ? fly.sim.Ie : cl.sim.Ie; }
function volanoRattle(fly, cl) { return Math.max((cl.dsp && cl.dsp.rattle) || 0, (fly && fly.dsp && fly.dsp.rattle) || 0); }

function tuningItemOf(catalog, cat, id) {
  const c = catalog[cat]; if (!c) return { id: 'oem', price: 0, name: '', sim: {}, dsp: {} };
  return c.items.find((i) => i.id === id) || c.items[0];
}
function tuningItem(cat, id) {
  const c = TUNING[cat];
  if (!c) return { id: 'oem', price: 0, name: '', sim: {}, dsp: {} };
  return c.items.find((i) => i.id === id) || c.items[0];
}

// limitatore: stesso reparto per tutte le auto, scatole e centraline della scena drag/street americana
const LIMITER_CAT = {
  label: 'Limitatore',
  items: [
    { id: 'oem', price: 0, km: 0, brand: 'Di serie', name: 'Taglio d’iniezione', note: 'Al limite chiude gli iniettori: i giri rimbalzano piano, niente scoppi.', sim: { lt: 'fuel' } },
    { id: 'soft', price: 450, km: 6, brand: 'Holley', name: 'Soft cut a ritardo d’accensione', note: 'Come le centraline da strada americane: negli ultimi 300 giri toglie anticipo, il motore galleggia contro il limite ronzando e sputacchiando, senza strappi.', sim: { lt: 'soft' } },
    { id: 'msd', price: 600, km: 10, brand: 'MSD', name: '6AL hard cut (taglio d’accensione)', note: 'La scatola rossa dei drag: taglia le scintille, la benzina arriva incombusta nello scarico ed esplode. Al limite bang e fiamme.', sim: { lt: 'spark' } },
    { id: '2step', price: 850, km: 16, brand: 'MSD', name: '6AL-2 con 2-step', note: 'Secondo limitatore per la partenza: da fermo, launch inserito (L), freno o frizione e gas a fondo, il motore resta ai giri di launch sparando e il turbo si carica.', sim: { lt: 'spark', twoStep: true } },
    { id: '3step', price: 1300, km: 28, brand: 'Holley', name: 'EFI 2-step + 3-step (flat shift)', note: 'In più il terzo stadio: cambi senza alzare il piede, la centralina taglia per un attimo, la pressione resta e la marcia entra prima. Ogni cambiata è un colpo di fucile.', sim: { lt: 'spark', twoStep: true, flat: true } },
    { id: 'stutter', price: 700, km: 20, brand: 'Stutter box', name: 'Limitatore ritmato “brap-brap”', note: 'La moda dei muscle e dei pick-up americani: da fermo (in folle o col launch) taglia a tempo, regolare come una mitragliatrice, ai giri di launch.', sim: { lt: 'stutter', twoStep: true } },
  ],
};
TUNING_SUPRA.limiter = LIMITER_CAT;
TUNING_SUPRA.flywheel = volanoCat(0.21, null, null, 'Toyota');
// applica il limitatore scelto ai parametri della fisica e del suono
function applyLimiter(out, item, ecuSim) {
  const L = (item && item.sim) || { lt: 'fuel' };
  const spark = L.lt === 'spark' || L.lt === 'stutter' || (L.lt === 'fuel' && !!ecuSim.spark);
  out.sim.limType = L.lt === 'fuel' && ecuSim.spark ? 'spark' : L.lt;
  out.sim.sparkCut = spark; out.sim.ecuLaunch = !!(ecuSim.launch ?? ecuSim.spark) || !!L.twoStep; out.sim.flatShift = !!L.flat;
  out.dsp.spark = spark ? 1 : 0;
  return out;
}

// parametri dell'auto in uso (le altre auto registrano la loro funzione in cars.js)
function tuningParams(sel, adj) {
  const car = typeof ACTIVE_CAR !== 'undefined' ? ACTIVE_CAR : 'supra';
  const fn = typeof CARS !== 'undefined' && CARS[car] && CARS[car].params;
  return fn ? fn(sel, adj) : supraParams(sel, adj);
}
// trasforma la selezione in parametri per la fisica e per il DSP (Supra)
function supraParams(sel, adj) {
  const g = (k) => tuningItemOf(TUNING_SUPRA, k, sel[k]);
  return applyLimiter(supraParamsBase(sel, g, adj), g('limiter'), g('ecu').sim);
}
function supraParamsBase(sel, g, adj) {
  const tb = g('turbo'), ecu = g('ecu'), cams = g('cams'), cl = g('clutch'), fly = g('flywheel');
  // con una centralina programmabile i turbo di serie reggono circa 1 bar
  let turbo = tb.sim.twin && ecu.id !== 'oem' ? Object.assign({}, tb.sim, { max: 1.0 }) : tb.sim;
  // aggiunte di Luca Tuning (v0.107): aspirazioni nuove (pw in sim), cilindrata, benzina che limita la pressione, cambi regolabili
  const inn = g('intake'), dp = TUNING_SUPRA.displacement ? g('displacement') : null, fu = TUNING_SUPRA.fuel ? g('fuel') : null, gb = g('gearbox');
  const cap = fu && fu.sim && fu.sim.cap;
  if (cap && turbo && turbo.max > cap) turbo = Object.assign({}, turbo, { max: cap, cap });
  const inPw = inn.pw ?? (inn.sim && inn.sim.pw) ?? 1;
  const pw = g('exhaust').pw * g('cat').pw * inPw * ((dp && dp.sim && dp.sim.pw) || 1) * ((fu && fu.sim && fu.sim.pw) || 1), su = suspResolve(g('suspension'), adj);
  return {
    sim: {
      turbo, pw, limiter: ecu.sim.lim, sparkCut: ecu.sim.spark, ecuLaunch: ecu.sim.launch, ecuPops: ecu.sim.pops,
      idle: cams.sim.idle, camLow: cams.sim.low * ((inn.sim && inn.sim.low) || 1), camHigh: cams.sim.high * ((inn.sim && inn.sim.high) || 1), lope: cams.sim.lope, Ie: volanoIe(fly, cl), flyIdle: (fly.sim && fly.sim.idle) || 0, flyHunt: (fly.sim && fly.sim.hunt) || 0, clutchMax: cl.sim.clutch,
      mu: g('tires').sim.mu * su.susp.grip, tyre: g('tires').sim.tyre,
      ic: g('intercooler').sim.ic, susp: su.susp, dm: g('weight').sim.dm, fd: g('final').sim.fd, diff: g('final').sim.diff, gears: gbGears(gb, adj), shiftMul: (gb.sim && gb.sim.shift) || 1,
      valve: g('bov').dsp.v === 2 ? 'flutter' : g('bov').dsp.v === 1 ? 'bov' : 'recirc',
    },
    dsp: {
      ex: g('exhaust').dsp, cat: g('cat').dsp, tb: tb.dsp, bov: g('bov').dsp,
      scream: tb.sim.twin ? 0 : g('wastegate').dsp.scream, intake: inn.dsp, lope: cams.dsp.lope,
      voice: inn.dsp.howl ? { howl: inn.dsp.howl, howlF: inn.dsp.howlF } : undefined,
      rattle: volanoRattle(fly, cl), spark: ecu.sim.spark ? 1 : 0, cabin: g('weight').sim.cabin,
    },
    look: { low: su.low, susp: su.susp.pitch },
  };
}
