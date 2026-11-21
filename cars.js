// ============================================================================
//  Garage · le auto del giocatore
//  Tutte le auto hanno la stessa struttura:
//    tuning   catalogo prestazioni (categorie → tendine; ogni pezzo: prezzo, km per sbloccarlo, nota)
//    presets  preparazioni pronte
//    params   selezione → parametri di fisica, suono e aspetto
//    body     estetica propria dell'auto (oltre a quella comune del Russian Kùstòm)
//  Per aggiungere un'auto basta un'altra voce con questi campi.
// ============================================================================
/* global TUNING_SUPRA, SUPRA_PRESETS, supraParams, tuningItemOf */
let ACTIVE_CAR = 'supra';

// ---------------------------------------------------------------- Volvo V40 SW 2.0
// Note da preparatore: il B4204S è un aspirato da 140 CV con testata buona e basamento solido (lo stesso
// blocco della T4 sovralimentata). Aspirato rende poco con scarico e filtro (+3-5 % in tutto): il salto vero
// è il turbo. La trazione anteriore è il limite: oltre ~220 CV serve l'autobloccante, e un posteriore
// alleggerito toglie ancora peso dalle ruote motrici.
const TUNING_V40 = {
  exhaust: {
    label: 'Scarico',
    items: [
      { id: 'oem', price: 0, km: 0, brand: 'Volvo', name: 'Originale', note: 'Silenziatore centrale e terminale chiusi: voce sorda e educata.', sim: { pw: 1 }, dsp: 'stock' },
      { id: 'terminale', price: 350, km: 3, brand: 'Simons', name: 'Terminale sportivo in inox', note: 'Solo il silenziatore finale al posto di quello originale: voce un po\' più piena, qualche cavallo (+2 %).', sim: { pw: 1.02 }, dsp: 'sport', look: { tip: 1 } },
      { id: 'catback', price: 700, km: 8, brand: 'Simons', name: 'Catback in inox da 63 mm', note: 'Terminale ovale grande: voce piena e ruvida, rimbombo verso i 3000. Sull\'aspirato vale un +3 %.', sim: { pw: 1.03 }, dsp: 'sport', look: { tip: 1 } },
      { id: 'turboback', price: 1300, km: 30, brand: 'Ferrita', name: 'Turboback 76 mm senza silenziatore centrale', note: 'Tutto lo scarico dal turbo in giù: col turbo +6 % e spool più pronto, da aspirata solo rumore (+3 %).', sim: { pw: 1.03, pwTurbo: 1.06, spool: 0.92 }, dsp: 'race', look: { tip: 2 } },
    ],
  },
  intake: {
    label: 'Aspirazione',
    items: [
      { id: 'oem', price: 0, km: 0, brand: 'Volvo', name: 'Airbox originale', note: 'Chiusa e silenziosa.', sim: { pw: 1 }, dsp: { in: 1, roar: 1, wh: 1 } },
      { id: 'pf', price: 250, km: 4, brand: 'K&N', name: 'Filtro a fungo', note: 'Risucchio forte ai bassi, col turbo il fischio si sente il doppio. +2 % (aria più calda nel vano: niente miracoli).', sim: { pw: 1.02 }, dsp: { in: 2.2, roar: 2.4, wh: 1.7 } },
      { id: 'ram', price: 600, km: 12, brand: 'Forge', name: 'Airbox sportivo con presa d\'aria fredda', note: 'Pesca l\'aria da dietro il faro, lontano dal calore del motore: +4 % e un risucchio pieno senza rumore da fungo.', sim: { pw: 1.04 }, dsp: { in: 1.7, roar: 1.8, wh: 1.4 } },
    ],
  },
  cat: {
    label: 'Downpipe e catalizzatore',
    items: [
      { id: 'oem', price: 0, km: 0, pw: 1, pwTurbo: 1, brand: 'Volvo', name: 'Catalizzatore originale', note: 'Ceramico stretto vicino al collettore: pulito ma strozza un po\'.', dsp: { lp: 0, g: 1, pop: 1 } },
      { id: 'sport', price: 650, km: 10, pw: 1.02, pwTurbo: 1.06, brand: 'Ferrita', name: 'Downpipe da 76 mm con cat sportivo', note: 'Senza il collo di bottiglia dopo la turbina: col turbo +6 % e spool più pronto, da aspirata +2 %.', dsp: { lp: 5200, g: 1.0, pop: 1.25 } },
      { id: 'decat', price: 250, km: 15, pw: 1.03, pwTurbo: 1.09, brand: 'Su misura', name: 'Downpipe senza catalizzatore (solo pista)', note: 'Nessun filtro: col turbo +9 %, suono aperto e scoppi forti. Non è omologato.', dsp: { lp: 0, g: 1.15, pop: 1.7 } },
    ],
  },
  cams: {
    label: 'Alberi a camme',
    items: [
      { id: 'oem', price: 0, km: 0, brand: 'Volvo', name: 'Originali', note: 'Minimo regolare e coppia piena ai bassi.', sim: { idle: 800, low: 1, high: 1, lope: 0 }, dsp: { lope: 0 } },
      { id: 'sport', price: 900, km: 14, brand: 'Kelford', name: 'Fase sportiva (252°)', note: 'Un filo di irregolarità al minimo, un po\' meno coppia in basso e più potenza in alto (+6 %).', sim: { idle: 850, low: 0.97, high: 1.06, lope: 0.3 }, dsp: { lope: 0.3 } },
      { id: 'race', price: 1900, km: 32, brand: 'Kelford', name: 'Fase da corsa (272°)', note: 'Minimo zoppo e ballerino, sotto i 3000 giri è pigra: in alto +14 %.', sim: { idle: 1000, low: 0.9, high: 1.14, lope: 0.9 }, dsp: { lope: 0.9 } },
    ],
  },
  ecu: {
    label: 'Centralina',
    items: [
      { id: 'oem', price: 0, km: 0, brand: 'Bosch', name: 'Motronic originale', note: 'Limitatore a 6500, taglio d\'iniezione morbido. Col turbo grosso non regge più di 1 bar.', sim: { lim: 6500, pw: 1, spark: false, maxBoost: 1.0 } },
      { id: 'remap', price: 450, km: 6, brand: 'Su misura', name: 'Rimappatura', note: 'Anticipo e benzina rivisti, limitatore a 6900: +4 % e allungo. Col turbo regge 1,2 bar.', sim: { lim: 6900, pw: 1.04, spark: false, maxBoost: 1.2 } },
      { id: 'standalone', price: 1800, km: 30, brand: 'Link', name: 'G4X stand-alone', note: 'Taglio d\'accensione a 7200, launch control, mappa pop & bang: col turbo scoppi e fiammate.', sim: { lim: 7200, pw: 1.05, spark: true, maxBoost: 1.5 } },
    ],
  },
  limiter: LIMITER_CAT,

  turbo: {
    label: 'Turbo',
    items: [
      { id: 'none', price: 0, km: 0, brand: '—', name: 'Aspirato', note: '140 CV a 6000 giri, coppia piatta ma modesta.', sim: { turbo: null } },
      { id: 'mini05', price: 2200, km: 12, brand: 'Garrett', name: 'Turbo piccolo da 0,5 bar', note: 'Il più dolce: spinta pronta da 1800 giri, circa 185 CV. Regge con la centralina originale. Fischio e valvola a ricircolo.', sim: { turbo: { max: 0.5, a: 1800, b: 2600, up: 0.25, down: 0.7, twin: false }, flow: 1 }, dsp: { tb: { f0: 2700, f1: 9000, w: 0.03, wh: 0.05, damp: 1900, twin: 0, mani: 1 } }, look: { badge: 'T' } },
      { id: 'td04', price: 3800, km: 28, brand: 'Mitsubishi', name: 'Kit TD04HL della V40 T4 (0,7 bar)', note: 'Collettore, turbo, iniettori da 400 cc e pistoni bassi della T4: circa 210 CV, spinta da 2500. Fischio e valvola a ricircolo.', sim: { turbo: { max: 0.7, a: 2000, b: 3000, up: 0.3, down: 0.75, twin: false }, flow: 1 }, dsp: { tb: { f0: 2600, f1: 8800, w: 0.04, wh: 0.06, damp: 2000, twin: 0, mani: 1 } }, look: { badge: 'T4' } },
      { id: 'bar10', price: 4600, km: 36, brand: 'Garrett', name: 'Turbo medio da 1,0 bar (GT2860)', note: 'Un bar di pressione, arriva pieno a 2600: forte e ancora guidabile. La centralina originale lo tiene a 1 bar, la rimappata a 1,2.', sim: { turbo: { max: 1.0, a: 2600, b: 3600, up: 0.36, down: 0.8, twin: false }, flow: 1.2 }, dsp: { tb: { f0: 2300, f1: 8200, w: 0.045, wh: 0.07, damp: 2100, twin: 0, mani: 1 } }, look: { badge: 'T10' } },
      { id: 'td04_19t', price: 5500, km: 45, brand: 'Mitsubishi', name: 'TD04HL-19T (fino a 1,5 bar)', note: 'La turbina più grande della famiglia: arriva a 3000, poi spinge forte fino al limitatore. Serve una centralina per sfruttarlo e un intercooler serio.', sim: { turbo: { max: 1.5, a: 2800, b: 4000, up: 0.42, down: 0.85, twin: false }, flow: 1.3 }, dsp: { tb: { f0: 2100, f1: 7600, w: 0.05, wh: 0.08, damp: 2200, twin: 0, mani: 1 } }, look: { badge: 'T5' } },
      { id: 'big15', price: 8200, km: 60, brand: 'Garrett', name: 'Turbo grosso da 1,5 bar (GT3582)', note: 'Pigro sotto i 3500 e poi un calcio: 1,5 bar con una turbina da 450 CV. Vuole centralina stand-alone, intercooler frontale, scarico libero e un po\' di coraggio.', sim: { turbo: { max: 1.5, a: 3400, b: 4600, up: 0.5, down: 0.9, twin: false }, flow: 1.85 }, dsp: { tb: { f0: 1900, f1: 7000, w: 0.055, wh: 0.09, damp: 2300, twin: 0, mani: 1 } }, look: { badge: 'T15' } },
    ],
  },
  intercooler: {
    label: 'Intercooler',
    items: [
      { id: 'oem', price: 0, km: 0, brand: 'Volvo', name: 'Laterale piccolo (col kit turbo)', note: 'Quello della T4 dietro il paraurti: in un allungo l\'aria scalda e si perde fino al 10 %.', sim: { ic: { heat: 1.5 } } },
      { id: 'fmic', price: 900, km: 32, brand: 'Forge', name: 'Frontale maggiorato', note: 'Si vede dietro la griglia del paraurti: aria fresca anche a 1,5 bar, potenza costante tirando le marce.', sim: { ic: { heat: 0.4, lag: 1.05 } }, look: { fmic: 1 } },
    ],
  },
  tires: {
    label: 'Gomme anteriori',
    items: [
      { id: 'oem', price: 0, km: 0, brand: 'Michelin', name: 'Energy 195/55 R15', note: 'Da turismo: lavorano bene da fredde, ma oltre il 15 % di slittamento la presa cala e il muso allarga.', sim: { mu: 1.0, tyre: { B: 17, C: 1.4, E: 0.05, opt: 70, win: 75, crr: 0.011, brake: 0.95 } } },
      { id: 'sport', price: 650, km: 2, brand: 'Toyo', name: 'Proxes T1-R 205/45 R16', note: 'Sportive su cerchio da 16: +5 % di presa, sterzo più pronto, si scaldano a 85 °C.', sim: { mu: 1.05, tyre: { B: 20, C: 1.45, E: 0.2, opt: 85, win: 60, crr: 0.012 } } },
      { id: 'semislick', price: 1100, km: 25, brand: 'Toyo', name: 'Proxes R888R 205/45 R16', note: 'Semi-slick: +20 % di presa calde, scivolose da fredde. Con la trazione anteriore fanno la differenza in partenza.', sim: { mu: 1.2, tyre: { B: 22, C: 1.5, E: 0.4, opt: 95, win: 45, crr: 0.013 } } },
      { id: 'drag', price: 1800, km: 38, brand: 'Mickey Thompson', name: 'ET Street R 225/50 R15 (drag)', note: 'Radiali da drag: fianco morbido, picco largo e calo minimo, +55 % di presa da tiepide (70 °C). In curva e in frenata sono le peggiori: servono per partire.', sim: { mu: 1.55, tyre: { B: 15, C: 1.3, E: -0.3, opt: 70, win: 55, crr: 0.016, brake: 0.88 } } },
    ],
  },
  suspension: suspCat({ make: 'Volvo', ids: ['oem', 'springs', 'dampers', 'coilover', 'race', 'pro'], pitch: 1.1, fwd: true,
    note0: 'Morbido da familiare: in partenza il muso si alza e scarica le ruote motrici. Nessuna regolazione.',
    brand: { 1: 'Eibach', 3: 'Bilstein' }, name: { 1: 'Molle sportive −35 mm', 3: 'Coilover B14' } }),
  final: {
    label: 'Differenziale e finale',
    items: [
      { id: 'oem', price: 0, km: 0, brand: 'Volvo', name: 'Aperto, finale 4,0', note: 'Con tanta coppia la ruota interna pattina da sola.', sim: { fd: 4.0, diff: 'open' } },
      { id: 'quaife', price: 1800, km: 40, brand: 'Quaife', name: 'Autobloccante ATB e finale 4,45', note: 'Tiene giù la ruota scarica e accorcia tutte le marce: partenze piantate, 10 % in meno di velocità massima.', sim: { fd: 4.45, diff: 'lsd' } },
    ],
  },
  gearbox: {
    label: 'Cambio',
    items: [
      { id: 'oem', price: 0, km: 0, brand: 'Volvo', name: 'M56 a 5 marce originale', note: 'Rapporti di serie: prima lunga e comoda, quinta di riposo.', sim: { gears: null } },
      { id: 'close', price: 3200, km: 24, brand: 'Quaife', name: 'Ravvicinato a 5 marce', note: 'Marce più vicine: a ogni cambiata i giri calano poco e il turbo resta in pressione. Perdi un po\' di comodità.', sim: { gears: [0, 3.25, 2.18, 1.62, 1.28, 1.0] } },
      { id: 'drag', price: 4800, km: 44, brand: 'Su misura', name: 'Corto da drag a 5 marce', note: 'Prima cortissima e rapporti ravvicinati: partenza violenta, ma a 180 km/h sei già al limitatore.', sim: { gears: [0, 3.9, 2.55, 1.85, 1.4, 1.1] } },
    ],
  },
  clutch: {
    label: 'Frizione e volano',
    items: [
      { id: 'oem', price: 0, km: 0, brand: 'Sachs', name: 'Originale a doppia massa', note: 'Morbida e silenziosa; con il turbo grosso slitta.', sim: { Ie: 0.16, clutch: 420 }, dsp: { rattle: 0 } },
      { id: 'sport', price: 900, km: 20, brand: 'Sachs', name: 'Rinforzata con volano alleggerito', note: 'Giri che salgono di scatto e tintinnio in folle: regge 450 Nm.', sim: { Ie: 0.12, clutch: 620 }, dsp: { rattle: 1 } },
      { id: 'race', price: 2400, km: 40, brand: 'Sachs', name: 'Bidisco da corsa', note: 'Due dischi in ceramica: regge 900 Nm, pedale duro e rumoroso, giri che salgono di scatto. Serve con i turbo grossi.', sim: { Ie: 0.1, clutch: 920 }, dsp: { rattle: 1 } },
    ],
  },
  weight: {
    label: 'Alleggerimento',
    items: [
      { id: 'oem', price: 0, km: 0, brand: '—', name: 'Di serie', note: '1290 kg.', sim: { dm: 0, cabin: 1 } },
      { id: 's1', price: 400, km: 10, brand: '—', name: 'Via sedili posteriori, ruota di scorta e moquette', note: '−55 kg, quasi tutti dal posteriore: buono per la trazione anteriore.', sim: { dm: -55, cabin: 1.15, rearOff: 0.8 } },
      { id: 's2', price: 2200, km: 35, brand: 'Su misura', name: 'Cofano in fibra, sedili racing, batteria al litio', note: '−105 kg: rimbomba tutto, ma 1185 kg con 260 CV fanno paura.', sim: { dm: -105, cabin: 1.3, rearOff: 0.55 } },
    ],
  },
};
const V40_PRESETS = [
  { id: 'stock', name: 'Di serie', sel: { exhaust: 'oem', cat: 'oem', intake: 'oem', cams: 'oem', ecu: 'oem', turbo: 'none', intercooler: 'oem', tires: 'oem', suspension: 'oem', final: 'oem', gearbox: 'oem', clutch: 'oem', weight: 'oem' } },
  { id: 'street', name: 'Street aspirata', sel: { exhaust: 'catback', cat: 'oem', cams: 'oem', gearbox: 'oem', intake: 'pf', ecu: 'remap', turbo: 'none', intercooler: 'oem', tires: 'sport', suspension: 'springs', final: 'oem', clutch: 'oem', weight: 'oem' } },
  { id: 'sleeper', name: 'Sleeper T4', sel: { exhaust: 'oem', cat: 'oem', cams: 'oem', gearbox: 'oem', intake: 'oem', ecu: 'remap', turbo: 'td04', intercooler: 'oem', tires: 'sport', suspension: 'oem', final: 'quaife', clutch: 'sport', weight: 'oem' } },
  { id: 'full', name: 'Familiare cattiva', sel: { exhaust: 'turboback', cat: 'sport', intake: 'pf', cams: 'sport', ecu: 'standalone', turbo: 'td04_19t', intercooler: 'fmic', tires: 'semislick', suspension: 'coilover', final: 'quaife', gearbox: 'close', clutch: 'sport', weight: 's2' } },
  { id: 'drag', name: 'Drag 450', sel: { exhaust: 'turboback', cat: 'decat', intake: 'ram', cams: 'race', ecu: 'standalone', turbo: 'big15', intercooler: 'fmic', tires: 'drag', suspension: 'race', final: 'quaife', gearbox: 'drag', clutch: 'race', weight: 's2' } },
];
// scoppi delle Volvo: boato basso (boom), poco schiocco e poco passaggio dal silenziatore, così non sembrano petardi
const VOLVO_POP = { f: 0.8, crack: 0.45, len: 1.3, thump: 1.2, boom: 0.85, bf: 1, mid: 0.6 };
const V40_EX = {
  stock: { L: 3.6, r: -0.4, m: [['lp', 900, 0.6], ['lp', 1600, 0.5], ['peak', 130, 1.0, 3], ['peak', 480, 2, -4]], g: 1.5, jet: 0.1, rasp: 0.05, tips: 1 },
  sport: { L: 3.4, r: -0.6, m: [['lp', 2600, 0.6], ['peak', 170, 1.0, 4], ['peak', 1100, 1.4, 5], ['peak', 3200, 2, 1]], g: 2.2, jet: 0.6, rasp: 0.5, tips: 1 },
  race: { L: 3.1, r: -0.66, m: [['lp', 4600, 0.55], ['peak', 190, 0.9, 3], ['peak', 1500, 1.4, 6], ['peak', 3600, 2, 2]], g: 2.5, jet: 0.9, rasp: 0.75, tips: 1 },
};
function v40Params(sel, adj) {
  const g0 = (k) => tuningItemOf(TUNING_V40, k, (sel || {})[k]);
  return applyLimiter(v40ParamsBase(sel, adj), g0('limiter'), g0('ecu').sim);
}
function v40ParamsBase(sel, adj) {
  const g = (k) => tuningItemOf(TUNING_V40, k, (sel || {})[k]);
  const ex = g('exhaust'), ct = g('cat'), cm = g('cams'), gb = g('gearbox'), ecu = g('ecu'), tb = g('turbo'), ic = g('intercooler'), ty = g('tires'), su = suspResolve(g('suspension'), adj), fin = g('final'), cl = g('clutch'), wt = g('weight');
  const turbo = tb.sim.turbo ? Object.assign({}, tb.sim.turbo, { max: Math.min(tb.sim.turbo.max, ecu.sim.maxBoost) }) : { max: 0, a: 9000, b: 9900, up: 1, down: 1, twin: false };
  if (tb.sim.turbo && ex.sim.spool) { turbo.up *= ex.sim.spool; turbo.a *= 0.97; }
  const hasT = !!tb.sim.turbo;
  const pw = (hasT ? (ex.sim.pwTurbo || ex.sim.pw) : ex.sim.pw) * (hasT ? (ct.pwTurbo || ct.pw || 1) : (ct.pw || 1)) * g('intake').sim.pw * ecu.sim.pw;
  const pops = ecu.sim.spark && hasT;
  return {
    sim: {
      turbo, pw, limiter: ecu.sim.lim, sparkCut: ecu.sim.spark, ecuLaunch: ecu.sim.spark, ecuPops: pops,
      idle: cm.sim.idle, camLow: cm.sim.low, camHigh: cm.sim.high, lope: cm.sim.lope, Ie: cl.sim.Ie, clutchMax: cl.sim.clutch,
      mu: ty.sim.mu * su.susp.grip, tyre: ty.sim.tyre, susp: su.susp, ic: hasT ? ic.sim.ic : null,
      diff: fin.sim.diff, fd: fin.sim.fd, gears: gb.sim.gears, dm: wt.sim.dm, rearOff: wt.sim.rearOff || 1,
      valve: hasT ? 'bov' : 'recirc', boostK: 0.42 * ((tb.sim.flow) || 1),     // 1.9-2.0 litri: la stessa pressione rende meno che sul 3.0 della Supra
    },
    dsp: {
      voice: { pop: VOLVO_POP },
      cyl: 4, ex: V40_EX[ex.dsp], cat: { lp: ct.dsp.lp || (ex.dsp === 'stock' ? 2400 : 3800), g: ct.dsp.g > 1 ? 0.9 * ct.dsp.g : 0.9, pop: (pops ? 1.4 : hasT ? 0.7 : 0.25) * (ct.dsp.pop || 1) },
      tb: hasT ? tb.dsp.tb : { f0: 2500, f1: 8000, w: 0, wh: 0, damp: 1700, twin: 0, mani: 1 },
      bov: hasT ? { v: 1, f0: 2200, sw: 900, q: 0.8, g: 0.7, chirp: 0.3 } : { v: 0, f0: 1800, sw: 600, q: 0.7, g: 0.05, chirp: 0 },
      intake: g('intake').dsp, scream: 0, lope: cm.dsp.lope, rattle: cl.dsp.rattle, spark: ecu.sim.spark ? 1 : 0, cabin: wt.sim.cabin,
    },
    look: {
      low: su.low, susp: su.susp.pitch, exhaust: (ex.look || {}).tip || 0,
      turbo: hasT, turbo2: tb.id === 'td04_19t' || tb.id === 'big15', badge: (tb.look || {}).badge || '', fmic: hasT && !!(ic.look || {}).fmic,
    },
  };
}


// ---------------------------------------------------------------- auto con disegno del giocatore: costruttore comune
// Ogni auto descrive motore, cambio e i nomi dei suoi pezzi; catalogo, parametri e suono si costruiscono da qui.
const GEN_DATA = {"r5":{"tq":[[0,60],[500,80],[1000,100],[1500,118],[2000,147],[2500,189],[3000,163],[3500,152],[4000,153],[4500,152],[5000,152],[5500,151],[6000,151],[6500,146],[7000,138],[7500,131]],"sprite":{"w":169,"h":62,"wy":49.4,"wr":13.9,"ax":[32.2,139.1],"head":[159,33],"tail":[5,24,5,5],"ex":[3,51],"hx":78,"hy":-1,"refL":139.2,"slots":{"st_door":[92,35,25,11],"st_rear":[30,26,19,9],"st_glass":[46,13,19,6]},"ws":30,"fixed":1}},"b2002":{"tq":[[0,77],[500,103],[1000,130],[1500,148],[2000,167],[2500,180],[3000,200],[3500,203],[4000,199],[4500,199],[5000,199],[5500,194],[6000,187],[6500,178],[7000,168],[7500,159]],"sprite":{"w":186,"h":62,"wy":51.5,"wr":14.0,"ax":[37.7,147.7],"head":[176,29],"tail":[2,30,5,5],"ex":[3,51],"hx":95,"hy":-3,"refL":188.0,"slots":{"st_door":[102,35,27,11],"st_rear":[37,25,19,9],"st_glass":[60,11,19,6]},"ws":30,"fixed":1}},"e30":{"tq":[[0,98],[500,134],[1000,170],[1500,193],[2000,212],[2500,226],[3000,240],[3500,253],[4000,266],[4500,277],[5000,284],[5500,287],[6000,285],[6500,284],[7000,279],[7500,265]],"sprite":{"w":192,"h":65,"wy":54.2,"wr":13.9,"ax":[42.8,155.6],"head":[177,38],"tail":[3,31,5,5],"ex":[3,55],"hx":91,"hy":-2,"refL":198.8,"slots":{"st_door":[105,38,28,11],"st_rear":[41,29,19,9],"st_glass":[59,12,19,6]},"ws":30,"fixed":1}},"e36":{"tq":[[0,137],[500,188],[1000,240],[1500,273],[2000,299],[2500,320],[3000,340],[3500,357],[4000,364],[4500,368],[5000,370],[5500,372],[6000,373],[6500,375],[7000,372],[7500,351]],"sprite":{"w":196,"h":58,"wy":44.4,"wr":14.1,"ax":[39.4,158.7],"head":[182,33],"tail":[12,20,5,5],"ex":[3,47],"hx":91,"hy":-5,"refL":48.3,"slots":{"st_door":[107,30,29,11],"st_rear":[39,21,19,9],"st_glass":[60,9,19,6]},"ws":32,"fixed":1}},"e34":{"tq":[[0,154],[500,212],[1000,270],[1500,303],[2000,327],[2500,345],[3000,365],[3500,379],[4000,394],[4500,407],[5000,414],[5500,416],[6000,413],[6500,411],[7000,399],[7500,375]],"sprite":{"w":203,"h":60,"wy":48.5,"wr":13.7,"ax":[44.4,165.9],"head":[192,34],"tail":[3,25,5,5],"ex":[3,50],"hx":111,"hy":-7,"refL":29.2,"slots":{"st_door":[111,34,30,10],"st_rear":[43,25,19,9],"st_glass":[58,7,19,6]},"ws":30,"fixed":1}}};
const GEN_EX = {
  old4: { L: 3.8, r: -0.45, m: [['lp', 1300, 0.6], ['peak', 120, 1.0, 4], ['peak', 600, 1.4, 2], ['peak', 2200, 2, -4]], g: 1.7, jet: 0.2, rasp: 0.2, tips: 1 },
  rally4: { L: 3.2, r: -0.55, m: [['lp', 2400, 0.6], ['peak', 150, 1.0, 3], ['peak', 1300, 1.4, 4], ['peak', 3200, 2, 1]], g: 2.0, jet: 0.5, rasp: 0.5, tips: 1 },
  bmw4: { L: 3.6, r: -0.5, m: [['lp', 2600, 0.6], ['peak', 140, 1.0, 3], ['peak', 1200, 1.4, 4], ['peak', 3000, 2, 0]], g: 1.9, jet: 0.45, rasp: 0.4, tips: 1 },
  bmw6: { L: 4.2, r: -0.5, m: [['lp', 2200, 0.6], ['peak', 150, 1.0, 3], ['peak', 900, 1.3, 3], ['peak', 2600, 2, -2]], g: 1.9, jet: 0.35, rasp: 0.25, tips: 2 },
  sport4: { L: 3.4, r: -0.6, m: [['lp', 3000, 0.6], ['peak', 160, 1.0, 4], ['peak', 1300, 1.4, 5], ['peak', 3400, 2, 2]], g: 2.2, jet: 0.7, rasp: 0.6, tips: 1 },
  diesel: { L: 4.6, r: -0.4, m: [['lp', 900, 0.6], ['peak', 90, 1.0, 6], ['peak', 380, 1.4, 3], ['peak', 1800, 2, -6]], g: 1.9, jet: 0.25, rasp: 0.35, tips: 1 },
  sport6: { L: 4.0, r: -0.6, m: [['lp', 3200, 0.6], ['peak', 140, 1.0, 4], ['peak', 1400, 1.5, 6], ['peak', 3800, 2.5, 3]], g: 2.1, jet: 0.7, rasp: 0.55, tips: 2 },
  race: { L: 3.1, r: -0.66, m: [['lp', 4800, 0.55], ['peak', 180, 0.9, 3], ['peak', 1600, 1.4, 6], ['peak', 3800, 2, 2]], g: 2.5, jet: 1.0, rasp: 0.8, tips: 1 },
};
// catalogo con le stesse categorie per ogni auto (nomi, prezzi e chilometri dalla scheda dell'auto)
function genCatalog(c) {
  const M = c.mods || {}, dz = !!(c.voice && c.voice.diesel), n = c.names || {}, $ = (base) => Math.round(base * (c.priceK || 1) * (M.pk || 1) / 10) * 10, kk = (base) => Math.round(base * (c.kmK || 1) * (M.kk || 1));   // M = la personalità di quest'auto (schede.js)
  const T = c.turbo;                                // turbo di serie (o null se aspirata)
  const tb = [];
  if (T) tb.push({ id: 'stock', price: 0, km: 0, brand: T.brand, name: T.name, note: T.note, sim: { turbo: T.sim }, dsp: { tb: T.dsp } });
  else if (M.turboSerie) tb.push({ id: 'none', price: 0, km: 0, brand: M.turboSerie[0], name: M.turboSerie[1], note: M.turboSerie[2] + ' La sua spinta è già nella curva di coppia.', sim: { turbo: null } });
  else tb.push({ id: 'none', price: 0, km: 0, brand: '—', name: 'Aspirato', note: c.naNote || 'Nessuna sovralimentazione.', sim: { turbo: null } });
  for (const u of c.boost) tb.push({ id: u.id, price: $(u.price), km: kk(u.km), brand: u.brand, name: u.name, note: u.note, sim: { turbo: u.sim }, dsp: { tb: u.dsp }, look: u.look || {} });
  const cat = {
    exhaust: { label: 'Scarico', items: [
      { id: 'oem', price: 0, km: 0, brand: c.make, name: 'Originale', note: n.exOem || 'Silenziatori di serie.', sim: { pw: 1 }, dsp: c.exStock },
      { id: 'catback', price: $(800), km: kk(8), brand: M.ex ? M.ex[0] : (n.exBrand || 'Supersprint'), name: M.ex ? M.ex[1] : 'Catback in inox', note: (M.ex_nota ? M.ex_nota + ' ' : '') + 'Terminali più grandi: voce piena e ruvida. +3 % sull\'aspirato, +5 % col turbo.', sim: { pw: 1.03, pwTurbo: 1.05 }, dsp: c.cyl >= 5 ? 'sport6' : 'sport4', look: { tip: 1 } },
      { id: 'race', price: $(1500), km: kk(25), brand: 'Su misura', name: M.ex ? M.ex[2] : 'Scarico diretto da gara', note: 'Collettore tubolare e niente silenziatori: +5 % (col turbo +8 % e spool più pronto). Fortissimo.', sim: { pw: 1.05, pwTurbo: 1.08, spool: 0.9 }, dsp: 'race', look: { tip: 2 } } ] },
    intake: { label: 'Aspirazione', items: [
      { id: 'oem', price: 0, km: 0, brand: c.make, name: n.inOem || 'Airbox originale', note: 'Chiusa e silenziosa.', sim: { pw: 1 }, dsp: c.inStock || { in: 1, roar: 1, wh: 1 } },
      { id: 'pf', price: $(300), km: kk(4), brand: M.in ? M.in[0] : 'K&N', name: M.in ? M.in[1] : 'Filtro a fungo', note: 'Risucchio forte ai bassi, fischio del turbo più presente. +2 %.', sim: { pw: 1.02 }, dsp: { in: 2.2, roar: 2.4, wh: 1.7 } } ] },
    ecu: { label: 'Centralina', items: [
      { id: 'oem', price: 0, km: 0, brand: c.ecuBrand || 'Bosch', name: M.ecu ? M.ecu[0] : 'Originale', note: `Limitatore a ${c.P.limiter}, taglio d'iniezione morbido.`, sim: { lim: c.P.limiter, pw: 1, spark: false, maxBoost: c.ecuMax || 1.0 } },
      { id: 'remap', price: $(500), km: kk(6), brand: 'Su misura', name: M.ecu ? M.ecu[1] : 'Rimappatura', note: dz ? `Gasolio e pressione rivisti, limitatore a ${c.P.limiter + 300}: +10 %.` : `Anticipo e benzina rivisti, limitatore a ${c.P.limiter + 300}: +4 %.`, sim: { lim: c.P.limiter + 300, pw: dz ? 1.1 : 1.04, spark: false, maxBoost: (c.ecuMax || 1.0) + 0.3 } },
      { id: 'standalone', price: $(2000), km: kk(30), brand: dz ? 'Su misura' : 'MoTeC', name: M.ecu ? M.ecu[2] : (dz ? 'Gestione completa' : 'M84 stand-alone'), note: dz ? `Mappe complete di pressione e gasolio, limitatore a ${c.P.limiter + 500}: +12 %. Niente scoppi: è un diesel.` : `Taglio d'accensione a ${c.P.limiter + 500}, launch control, pop & bang.`, sim: { lim: c.P.limiter + 500, pw: dz ? 1.12 : 1.05, spark: !dz, maxBoost: (c.ecuMax || 1.0) + 0.8 } } ] },
    limiter: LIMITER_CAT,
    turbo: { label: T ? 'Turbo' : 'Sovralimentazione', items: tb },
    intercooler: { label: 'Intercooler', items: [
      { id: 'oem', price: 0, km: 0, brand: c.make, name: T ? 'Originale' : 'Del kit', note: 'Piccolo: tirando le marce l\'aria scalda e si perde fino al 10 %.', sim: { ic: { heat: T ? (T.icHeat || 1.2) : 1.4 } } },
      { id: 'fmic', price: $(1000), km: kk(30), brand: 'Wagner', name: 'Frontale maggiorato', note: 'Aria fresca anche ad alta pressione: la potenza non cala più.', sim: { ic: { heat: 0.4, lag: 1.05 } } } ] },
    tires: { label: c.fwd ? 'Gomme anteriori' : 'Gomme posteriori', items: [
      { id: 'oem', price: 0, km: 0, brand: M.ty ? M.ty[0] : (n.tyreBrand || 'Michelin'), name: n.tyreOem || 'Originali', note: 'Stradali: presa onesta, lavorano bene da fredde.', sim: { mu: c.mu || 1.05, tyre: { B: 19, C: 1.42, E: 0.1, opt: 80, win: 70, crr: 0.012 } } },
      { id: 'sport', price: $(800), km: kk(3), brand: M.ty ? 'Gomme' : 'Toyo', name: M.ty ? M.ty[1] : 'Proxes R1R', note: 'Sportive: +6 % di presa, sterzo più pronto, ideali a 85 °C.', sim: { mu: (c.mu || 1.05) * 1.06, tyre: { B: 20, C: 1.45, E: 0.2, opt: 85, win: 60, crr: 0.012 } } },
      { id: 'semislick', price: $(1200), km: kk(25), brand: M.ty ? 'Gomme' : 'Toyo', name: M.ty ? M.ty[2] : 'Proxes R888R', note: 'Semi-slick: +20 % di presa calde, scivolose da fredde.', sim: { mu: (c.mu || 1.05) * 1.2, tyre: { B: 22, C: 1.5, E: 0.4, opt: 95, win: 45, crr: 0.013 } } } ] },
    suspension: suspCat({ make: c.make, ids: ['oem', 'springs', 'dampers', 'coilover', 'race', 'pro'], pitch: c.pitch || 1, fwd: c.fwd, price: $, km: kk,
      note0: (c.suspNote || 'Comodo: la cassa si muove parecchio.') + ' Nessuna regolazione.' }),
    final: { label: 'Differenziale e finale', items: [
      { id: 'oem', price: 0, km: 0, brand: c.make, name: c.diff0.name, note: c.diff0.note, sim: { fd: c.P.fd, diff: c.diff0.diff } },
      { id: 'lsd', price: $(1600), km: kk(30), brand: 'Drexler', name: `Autobloccante al 40 %, finale ${(c.P.fd * 1.12).toFixed(2).replace('.', ',')}`, note: 'Blocca la ruota che slitta e accorcia le marce: partenze piantate, meno velocità massima.', sim: { fd: Math.round(c.P.fd * 1.12 * 100) / 100, diff: 'lsd' } } ] },
    clutch: { label: 'Frizione e volano', items: [
      { id: 'oem', price: 0, km: 0, brand: 'Sachs', name: 'Originale', note: 'Morbida; con molta coppia slitta.', sim: { Ie: c.P.Ie, clutch: c.P.clutchMax }, dsp: { rattle: 0 } },
      { id: 'sport', price: $(1000), km: kk(15), brand: 'Sachs', name: 'Rinforzata con volano alleggerito', note: 'Giri che salgono di scatto, tintinnio in folle.', sim: { Ie: Math.round(c.P.Ie * 0.75 * 100) / 100, clutch: Math.round(c.P.clutchMax * 1.5) }, dsp: { rattle: 1 } },
      { id: 'race', price: $(2600), km: kk(40), brand: 'Sachs', name: 'Bidisco da corsa con volano in acciaio leggero', note: 'Regge tutta la coppia che il motore può dare: niente slittamenti. Pedale duro, giri che salgono di scatto, tintinnio in folle.', sim: { Ie: Math.round(c.P.Ie * 0.6 * 100) / 100, clutch: Math.round(c.P.clutchMax * 3) }, dsp: { rattle: 1 } } ] },
    weight: { label: 'Alleggerimento', items: [
      { id: 'oem', price: 0, km: 0, brand: '—', name: 'Di serie', note: `${c.mass} kg.`, sim: { dm: 0, cabin: 1 } },
      { id: 's1', price: $(600), km: kk(10), brand: '—', name: 'Sedili racing, via insonorizzanti', note: `−${Math.round(c.mass * 0.045)} kg.`, sim: { dm: -Math.round(c.mass * 0.045), cabin: 1.15 } },
      { id: 's2', price: $(2600), km: kk(35), brand: 'Su misura', name: 'Cofano e portellone in fibra, vetri in policarbonato', note: `−${Math.round(c.mass * 0.09)} kg: rimbomba tutto.`, sim: { dm: -Math.round(c.mass * 0.09), cabin: 1.35 } } ] },
  };
  // reparti che dipendono dal motore: downpipe/cat e camme solo sui benzina (sui diesel lo scarico ha già il FAP), più il reparto SUO dell'auto
  if (!dz && M.ct) cat.cat = { label: 'Downpipe e catalizzatore', items: [
    { id: 'oem', price: 0, km: 0, pw: 1, pwTurbo: 1, brand: c.make, name: 'Catalizzatore originale', note: 'Ceramico di serie: pulito ma strozza un po\'.', dsp: { lp: 0, g: 1, pop: 1 } },
    { id: 'sport', price: $(650), km: kk(10), pw: 1.02, pwTurbo: 1.06, brand: M.ct[0], name: M.ct[1], note: 'Meno strozzatura: da aspirato +2 %, col turbo +6 % e spool più pronto.', dsp: { lp: 5200, g: 1.0, pop: 1.25 } },
    { id: 'decat', price: $(250), km: kk(15), pw: 1.03, pwTurbo: 1.09, brand: 'Su misura', name: M.ct[2], note: 'Nessun filtro: suono aperto e scoppi forti, col turbo +9 %. Non è omologato.', dsp: { lp: 0, g: 1.15, pop: 1.7 } } ] };
  if (!dz && M.cm) cat.cams = { label: 'Alberi a camme', items: [
    { id: 'oem', price: 0, km: 0, brand: c.make, name: 'Originali', note: 'Minimo regolare e coppia piena ai bassi.', sim: { idle: c.P.idle, low: 1, high: 1, lope: 0 }, dsp: { lope: 0 } },
    { id: 'sport', price: $(900), km: kk(14), brand: M.cm[0], name: M.cm[1], note: `Un filo di irregolarità al minimo, un po' meno coppia in basso e più potenza in alto (+${Math.round((M.cm[3] - 1) * 100)} %).`, sim: { idle: c.P.idle + 50, low: 0.97, high: M.cm[3], lope: 0.3 }, dsp: { lope: 0.3 } },
    { id: 'race', price: $(1900), km: kk(32), brand: M.cm[0], name: M.cm[2], note: `Minimo zoppo e ballerino, sotto i 3000 giri è pigra: in alto +${Math.round((M.cm[3] * 2 - 1.05 - 1) * 100)} %.`, sim: { idle: c.P.idle + 200, low: 0.9, high: Math.round((M.cm[3] * 2 - 1.05) * 100) / 100, lope: 0.9 }, dsp: { lope: 0.9 } } ] };
  if (M.sp) cat.special = { label: M.sp.label, items: [{ id: 'oem', price: 0, km: 0, brand: c.make, name: 'Di serie', note: 'Come esce dalla fabbrica.', pw: 1 }].concat(M.sp.items.map((s, i) => ({ id: 'sp' + (i + 1), brand: s[0], name: s[1], note: s[2], pw: s[3], price: $(s[4]), km: kk(s[5]) }))) };
  if (c.gearbox) cat.gearbox = { label: 'Cambio', items: [{ id: 'oem', price: 0, km: 0, brand: c.gearbox.brand0, name: c.gearbox.name0, note: c.gearbox.note0, sim: { gears: null } }].concat(c.gearbox.items.map((g) => Object.assign({ km: kk(g.km), price: $(g.price) }, g, { sim: { gears: g.gears } }))) };
  return cat;
}
function genPresets(c) {
  const base = { exhaust: 'oem', intake: 'oem', ecu: 'oem', turbo: c.turbo ? 'stock' : 'none', intercooler: 'oem', tires: 'oem', suspension: 'oem', final: 'oem', clutch: 'oem', weight: 'oem' };
  if (c.gearbox) base.gearbox = 'oem';
  const b1 = c.boost[0], b2 = c.boost[c.boost.length - 1], T = c.tuning, ext = (o) => Object.assign({}, T.cat ? { cat: o.cat } : {}, T.cams ? { cams: o.cams } : {}, T.special && o.sp ? { special: o.sp } : {});
  if (T.cat) base.cat = 'oem'; if (T.cams) base.cams = 'oem'; if (T.special) base.special = 'oem';
  return [
    { id: 'stock', name: 'Di serie', sel: base },
    { id: 'street', name: 'Street', sel: Object.assign({}, base, { exhaust: 'catback', intake: 'pf', ecu: 'remap', tires: 'sport', suspension: 'springs' }, ext({ cat: 'sport', cams: 'sport' })) },
    { id: 'boost', name: c.turbo ? 'Più pressione' : 'Sovralimentata', sel: Object.assign({}, base, { exhaust: 'catback', ecu: 'remap', turbo: b1.id, intercooler: 'fmic', tires: 'sport', suspension: 'springs', final: 'lsd' }, ext({ cat: 'sport', cams: 'sport', sp: 'sp1' })) },
    { id: 'full', name: 'Da gara', sel: Object.assign({}, base, { exhaust: 'race', intake: 'pf', ecu: 'standalone', turbo: b2.id, intercooler: 'fmic', tires: 'semislick', suspension: 'coilover', final: 'lsd', clutch: 'race', weight: 's2' }, ext({ cat: 'decat', cams: 'race', sp: 'sp2' }), c.gearbox ? { gearbox: c.gearbox.items[0].id } : {}) },
  ];
}
function genParams(c) {
  const base = genParamsBase(c);
  return (sel, adj) => applyLimiter(base(sel, adj), tuningItemOf(c.tuning, 'limiter', (sel || {}).limiter), tuningItemOf(c.tuning, 'ecu', (sel || {}).ecu).sim);
}
function genParamsBase(c) {
  return (sel, adj) => {
    const g = (k) => tuningItemOf(c.tuning, k, (sel || {})[k]);
    const ex = g('exhaust'), ecu = g('ecu'), tb = g('turbo'), ic = g('intercooler'), ty = g('tires'), su = suspResolve(g('suspension'), adj), fin = g('final'), cl = g('clutch'), wt = g('weight');
    const ct = c.tuning.cat ? g('cat') : null, cm = c.tuning.cams ? g('cams') : null, sp = c.tuning.special ? g('special') : null;   // reparti dell'auto (schede.js)
    const hasT = !!tb.sim.turbo;
    const turbo = hasT ? Object.assign({}, tb.sim.turbo, { max: Math.min(tb.sim.turbo.max, ecu.sim.maxBoost) }) : { max: 0, a: 9000, b: 9900, up: 1, down: 1, twin: false };
    if (hasT && ex.sim.spool) { turbo.up *= ex.sim.spool; turbo.a *= 0.97; }
    const pw = (hasT ? (ex.sim.pwTurbo || ex.sim.pw) : ex.sim.pw) * (ct ? (hasT ? (ct.pwTurbo || ct.pw || 1) : (ct.pw || 1)) : 1) * (sp ? sp.pw || 1 : 1) * g('intake').sim.pw * ecu.sim.pw;
    const pops = ecu.sim.spark && hasT;
    const exd = typeof ex.dsp === 'string' ? GEN_EX[ex.dsp] : ex.dsp;
    const vo = c.voice || {};
    return {
      sim: {
        turbo, pw, limiter: ecu.sim.lim, sparkCut: ecu.sim.spark, ecuLaunch: ecu.sim.spark, ecuPops: pops,
        idle: cm ? cm.sim.idle : c.P.idle, camLow: cm ? cm.sim.low : 1, camHigh: cm ? cm.sim.high : 1, lope: (vo.lope || 0) * 0.6 + (cm ? cm.sim.lope : 0), Ie: cl.sim.Ie, clutchMax: cl.sim.clutch,
        mu: ty.sim.mu * su.susp.grip, tyre: ty.sim.tyre, susp: su.susp, ic: hasT ? ic.sim.ic : null,
        diff: fin.sim.diff, fd: fin.sim.fd, gears: c.tuning.gearbox ? g('gearbox').sim.gears : null, dm: wt.sim.dm, rearOff: 0.6,
        valve: hasT ? 'bov' : 'recirc', boostK: c.boostK || (c.turbo ? 0.9 : 0.72),   // kit su aspirate: rapporto di compressione alto, si spinge meno
      },
      dsp: {
        cyl: c.cyl, ex: exd, cat: { lp: (ct && ct.dsp.lp) || (ex.id === 'oem' ? 2600 : 4200), g: ct && ct.dsp.g > 1 ? 0.95 * ct.dsp.g : 0.95, pop: (pops ? 1.4 : hasT ? 0.7 : 0.3) * (ct ? ct.dsp.pop || 1 : 1) },
        tb: hasT ? tb.dsp.tb : { f0: 2500, f1: 8000, w: 0, wh: 0, damp: 1700, twin: 0, mani: 1 },
        bov: hasT ? Object.assign({ v: 1, f0: 2200, sw: 900, q: 0.8, g: 0.75, chirp: 0.25 }, vo.bov) : { v: 0, f0: 1800, sw: 600, q: 0.7, g: 0.05, chirp: 0 },
        intake: g('intake').dsp, scream: 0, lope: (vo.lope || 0) + (cm ? cm.dsp.lope : 0), rattle: cl.dsp.rattle, spark: ecu.sim.spark ? 1 : 0, cabin: wt.sim.cabin,
        voice: vo,
      },
      look: { low: su.low, susp: su.susp.pitch, exhaust: (ex.look || {}).tip || 0, badge: (tb.look || {}).badge || '' },
    };
  };
}
function genCar(c) {
  const d = GEN_DATA[c.id];
  c.P.shiftK = c.shiftK || 1; c.P.hesK = c.hesK ?? 0.3;       // tempo di cambiata ed esitazione in apertura di gas
  c.P.tq = d.tq; c.sprite = Object.assign({ img: `img/${c.id}.png`, wheel: `img/${c.id}_wheel.png`, paint: `img/${c.id}_paint.png` }, d.sprite);
  if (!d.sprite.fixed) c.sprite.wy = Math.round((d.sprite.wy + d.sprite.wr) * 10) / 10;   // dati vecchi: "wy" era il bordo alto della gomma (strumenti/ripara_ruote.py li porta al centro)
  const S = (typeof SCHEDE !== 'undefined' && SCHEDE[c.id]) || null;      // scheda tecnica e personalità dei pezzi (schede.js)
  if (S) {
    c.scheda = S; c.mods = Object.assign({}, S.mods || {}, S.turboSerie ? { turboSerie: S.turboSerie } : {});
    if (c.mods.boost) c.boost = c.mods.boost.map((u) => u.kind === 'sc' ? KIT_SC(u.id, u.brand, u.name, u.bar, u.price, u.km, u.note) : KIT_T(u.id, u.brand, u.name, u.bar, u.a, u.b, u.price, u.km, u.note, u.badge));
  }
  c.tuning = genCatalog(c); c.presets = genPresets(c); c.params = genParams(c); c.body = c.body || {}; c.paint0 = 'orig';
  return c;
}
// turbo e compressori aggiuntivi, condivisi
const KIT_SC = (id, brand, name, bar, price, km, note) => ({ id, brand, name, price, km, note, sim: { max: bar, a: 1800, b: 5500, up: 0.2, down: 0.5, twin: false }, dsp: { f0: 3200, f1: 9800, w: 0.06, wh: 0.06, damp: 2600, twin: 0, mani: 1 } });
const KIT_T = (id, brand, name, bar, a, b, price, km, note, badge) => ({ id, brand, name, price, km, note, sim: { max: bar, a, b, up: 0.42, down: 0.85, twin: false }, dsp: { f0: 2000, f1: 7400, w: 0.055, wh: 0.08, damp: 2300, twin: 0, mani: 1 }, look: badge ? { badge } : {} });
const GEN_CARS = [
  { id: 'r5', name: 'Renault 5 Turbo 2', short: 'R5 Turbo', make: 'Renault', tag: 'Renault 5 Turbo 2 · 1.4 turbo a motore centrale · trazione posteriore · 5 marce',
    voice: { pop: { f: 1.25, crack: 1.45, len: 0.8 }, mani: [0.5, 0.45, 0.45, 0.5], rf: -0.46, pulse: 0.82, rough: 0.3, bias: [1.04, 0.95, 1.02, 0.97], metal: 0.3, metalF: 2400, boomRpm: 3900, hiRpm: 6600, bov: { f0: 2600, sw: 1300, q: 0.9, g: 0.95, chirp: 0.45 } },
    shiftK: 1.2, hesK: 0.6, engine: 'C1J 1.4 turbo Garrett T3', mass: 970, driveW: 0.6, fwd: false, cyl: 4, exStock: GEN_EX.rally4, pitch: 0.9, mu: 1.08, ecuBrand: 'Renix', ecuMax: 1.0,
    P: { idle: 900, limiter: 6800, launchRpm: 4200, Ie: 0.12, mass: 970, r: 0.30, cd: 0.37, A: 1.85, mu: 1.08, cgH: 0.46, wb: 2.43, tank: 50, gears: [0, 3.364, 2.059, 1.381, 1.037, 0.861], rev: -3.18, fd: 3.889, clutchMax: 380 },
    turbo: { brand: 'Garrett', name: 'T3 originale (0,9 bar)', note: 'Il turbo da rally: sotto i 3000 giri dorme, poi arriva tutto insieme.', sim: { max: 0.9, a: 2400, b: 3400, up: 0.38, down: 0.8, twin: false }, dsp: { f0: 2300, f1: 8600, w: 0.07, wh: 0.11, damp: 2100, twin: 0, mani: 1 }, icHeat: 1.3 },
    boost: [KIT_T('t3_12', 'Garrett', 'T3 con wastegate a 1,2 bar', 1.2, 2500, 3500, 1400, 18, 'Più pressione sullo stesso turbo: +20 % con la centralina.'),
      KIT_T('t3t4', 'Garrett', 'T3/T4 ibrido (1,6 bar)', 1.6, 3000, 4200, 4200, 40, 'Il kit Gruppo B stradale: ritardo enorme, poi una catapulta. Servono centralina e intercooler.')],
    diff0: { name: 'Aperto, finale 3,889', note: 'Con il motore dietro la trazione è già buona.', diff: 'open' }, suspNote: 'Motore centrale: in partenza il peso è già sulle ruote motrici.' },
  { id: 'b2002', name: 'BMW 2002 Turbo', short: '2002 Turbo', make: 'BMW', tag: 'BMW 2002 Turbo · 2.0 turbo KKK · trazione posteriore · 4 marce',
    voice: { pop: { f: 1.0, crack: 0.9, len: 1.2, thump: 1.2 }, mani: [0.74, 0.64, 0.64, 0.74], rf: -0.3, pulse: 1.18, rough: 0.45, lope: 0.3, bias: [1.06, 0.93, 1.03, 0.96], boomRpm: 2800, hiRpm: 6200, bov: { v: 2, f0: 1500, sw: 500, q: 0.7, g: 0.9, chirp: 0 } },
    shiftK: 1.35, hesK: 0.9, engine: 'M10 2.0 turbo KKK', mass: 1080, driveW: 0.46, fwd: false, cyl: 4, exStock: GEN_EX.old4, pitch: 1.25, mu: 1.0, ecuBrand: 'Kugelfischer', ecuMax: 0.8,
    P: { idle: 900, limiter: 6400, launchRpm: 4000, Ie: 0.16, mass: 1080, r: 0.29, cd: 0.40, A: 1.85, mu: 1.0, cgH: 0.52, wb: 2.5, tank: 70, gears: [0, 3.764, 2.02, 1.32, 1.0], rev: -4.1, fd: 3.36, clutchMax: 380 },
    turbo: { brand: 'KKK', name: 'BLD originale (0,55 bar)', note: 'Il primo turbo europeo di serie: ritardo leggendario, poi 170 CV su un\'auto da 1080 kg.', sim: { max: 0.55, a: 3000, b: 4000, up: 0.55, down: 0.9, twin: false }, dsp: { f0: 1700, f1: 6400, w: 0.045, wh: 0.13, damp: 1800, twin: 0, mani: 1 }, icHeat: 1.6 },
    boost: [KIT_T('kkk09', 'KKK', 'BLD regolato a 0,9 bar', 0.9, 3000, 4000, 1200, 16, 'Wastegate ritarata: +25 %, ma il ritardo resta.'),
      KIT_T('t3', 'Garrett', 'T3 moderno (1,3 bar)', 1.3, 2600, 3700, 3600, 38, 'Turbo a cuscinetti con iniezione elettronica: risposta molto più pronta.')],
    gearbox: { brand0: 'Getrag', name0: '4 marce originale', note0: 'Quarta diretta: a 180 km/h sei già al limitatore.', items: [{ id: 'g245', brand: 'Getrag', name: '245 a 5 marce', note: 'La quinta di riposo e marce più vicine.', price: 1800, km: 12, gears: [0, 3.368, 2.16, 1.58, 1.241, 1.0] }] },
    diff0: { name: 'Autobloccante 40 % (di serie), finale 3,36', note: 'Il Turbo aveva già l\'autobloccante.', diff: 'torsen' }, suspNote: 'Molle morbide anni 70: in partenza il muso si alza tantissimo.' },
  { id: 'e30', name: 'BMW M3 E30', short: 'M3 E30', make: 'BMW', tag: 'BMW M3 E30 · S14 2.3 16V · trazione posteriore · Getrag 265 "dogleg"',
    voice: { pop: { f: 1.2, crack: 1.25, len: 0.9 }, mani: [0.55, 0.5, 0.5, 0.55], rf: -0.42, pulse: 0.78, rough: 0.12, lope: 0.18, howl: 0.75, howlF: 820, metal: 0.5, metalF: 3100, boomRpm: 3600, hiRpm: 7250 },
    shiftK: 1.1, hesK: 0.4, engine: 'S14 2.3 16V aspirato', mass: 1200, driveW: 0.47, fwd: false, cyl: 4, exStock: GEN_EX.bmw4, pitch: 0.95, mu: 1.05, ecuBrand: 'Bosch Motronic', inStock: { in: 1.8, roar: 2.0, wh: 1 },
    naNote: 'Quattro farfalle singole: grida fino a 7250 giri.',
    P: { idle: 880, limiter: 7250, launchRpm: 4500, Ie: 0.13, mass: 1200, r: 0.30, cd: 0.33, A: 1.9, mu: 1.05, cgH: 0.48, wb: 2.565, tank: 70, gears: [0, 3.72, 2.40, 1.77, 1.26, 1.00], rev: -4.23, fd: 4.10, clutchMax: 450 },
    turbo: null,
    boost: [KIT_SC('sc', 'Rotrex', 'Compressore centrifugo (0,5 bar)', 0.5, 4200, 30, 'Spinta che cresce coi giri come un aspirato più grosso: +35 % in alto, fischio da compressore.'),
      KIT_T('turbo', 'Garrett', 'Kit turbo GT28 (1,0 bar)', 1.0, 2900, 4100, 5200, 45, 'Pistoni bassi e turbo: il 2.3 da corsa arriva a 330 CV.', 'TURBO')],
    diff0: { name: 'Autobloccante 25 %, finale 4,10', note: 'Di serie sulla M3.', diff: 'torsen' } },
  { id: 'e36', name: 'BMW M3 E36', short: 'M3 E36', make: 'BMW', tag: 'BMW M3 E36 coupé · S50 3.0 sei in linea · trazione posteriore · 5 marce',
    voice: { pop: { f: 0.95, crack: 1.05, len: 1.05 }, mani: [0.5, 0.47, 0.45, 0.45, 0.47, 0.5], split: 0.12, rf: -0.36, pulse: 0.84, howl: 0.35, howlF: 950, metal: 0.8, metalF: 3400, boomRpm: 3400, hiRpm: 7200 },
    shiftK: 1.0, hesK: 0.25, engine: 'S50 3.0 aspirato', mass: 1460, driveW: 0.49, fwd: false, cyl: 6, exStock: GEN_EX.bmw6, pitch: 0.9, mu: 1.07, ecuBrand: 'Bosch Motronic',
    naNote: 'Sei in linea col VANOS: coppia piena da 3000 giri.',
    P: { idle: 800, limiter: 7200, launchRpm: 4000, Ie: 0.17, mass: 1460, r: 0.31, cd: 0.32, A: 2.0, mu: 1.07, cgH: 0.48, wb: 2.71, tank: 62, gears: [0, 4.20, 2.49, 1.66, 1.24, 1.00], rev: -3.89, fd: 3.15, clutchMax: 560 },
    turbo: null,
    boost: [KIT_SC('sc', 'ESS', 'Compressore ESS VT1 (0,5 bar)', 0.5, 5600, 30, 'Il kit più diffuso sulla E36: +35 %, guidabilità da serie.'),
      KIT_T('turbo', 'Precision', 'Kit turbo 6262 (1,0 bar)', 1.0, 2800, 4000, 6800, 45, 'Single turbo su collettore tubolare: oltre 500 CV.', 'TURBO')],
    diff0: { name: 'Autobloccante 25 %, finale 3,15', note: 'Di serie sulla M3.', diff: 'torsen' } },
  { id: 'e34', name: 'BMW M5 E34', short: 'M5 E34', make: 'BMW', tag: 'BMW M5 E34 · S38 3.6 sei in linea · trazione posteriore · 5 marce',
    voice: { pop: { f: 0.82, crack: 0.9, len: 1.3, thump: 1.3 }, mani: [0.64, 0.6, 0.57, 0.57, 0.6, 0.64], split: 0.16, rf: -0.4, pulse: 0.95, lope: 0.12, howl: 0.85, howlF: 690, metal: 0.55, metalF: 2900, boomRpm: 3000, hiRpm: 7000 },
    shiftK: 1.05, hesK: 0.3, engine: 'S38 3.6 aspirato', mass: 1670, driveW: 0.48, fwd: false, cyl: 6, exStock: GEN_EX.bmw6, pitch: 1.0, mu: 1.07, ecuBrand: 'Bosch Motronic', inStock: { in: 1.8, roar: 2.0, wh: 1 },
    naNote: 'Sei farfalle singole, figlio del motore della M1: 315 CV a 6900 giri.',
    P: { idle: 850, limiter: 7200, launchRpm: 4000, Ie: 0.18, mass: 1670, r: 0.31, cd: 0.32, A: 2.05, mu: 1.07, cgH: 0.5, wb: 2.76, tank: 90, gears: [0, 3.51, 2.08, 1.35, 1.00, 0.81], rev: -3.71, fd: 3.91, clutchMax: 620 },
    turbo: null,
    boost: [KIT_SC('sc', 'Vortech', 'Compressore centrifugo (0,5 bar)', 0.5, 6200, 30, 'La berlina diventa una catapulta: +35 %.'),
      KIT_T('turbo', 'Garrett', 'Biturbo GT30 (0,9 bar)', 0.9, 2800, 3900, 8200, 50, 'Due turbo sul sei in linea: 500 CV da quattro porte.', 'BITURBO')],
    diff0: { name: 'Autobloccante 25 %, finale 3,91', note: 'Di serie sulla M5.', diff: 'torsen' } },
];


// ---------------------------------------------------------------- il pacchetto di auto del giocatore (traffico e concessionaria)
Object.assign(GEN_DATA, {"a80":{"tq":[],"sprite":{"w":204,"h":69,"wy":56.4,"wr":18.7,"ax":[47.4,162.2],"head":[193,40],"tail":[7,33,5,5],"ex":[3,55],"hx":94,"hy":-1,"refL":61.8,"slots":{"st_door":[112,33,30,14],"st_rear":[45,21,26,13],"st_glass":[50,13,26,8]},"ws":40,"fixed":1}},"a3":{"tq":[],"sprite":{"w":196,"h":66,"wy":54.0,"wr":15.2,"ax":[40.4,156.6],"head":[181,37],"tail":[12,28,5,5],"ex":[3,54],"hx":88,"hy":-1,"refL":51.8,"slots":{"st_door":[107,36,29,12],"st_rear":[37,26,21,10],"st_glass":[47,13,21,6]},"ws":34,"fixed":1}},"a112":{"tq":[],"sprite":{"w":145,"h":67,"wy":57.1,"wr":12.4,"ax":[22.6,112.3],"head":[138,37],"tail":[9,30,5,5],"ex":[3,58],"hx":69,"hy":0,"refL":58.0,"slots":{"st_door":[79,43,21,9],"st_rear":[24,35,17,8],"st_glass":[45,14,17,5]},"ws":28,"fixed":1}},"bus":{"tq":[],"sprite":{"w":531,"h":158,"wy":132.6,"wr":27.4,"ax":[134.7,394.3],"head":[503,104],"tail":[30,86,5,5],"ex":[3,137],"hx":327,"hy":28,"refL":209.0,"slots":{"st_door":[292,105,79,21],"st_rear":[132,87,38,19],"st_glass":[157,42,38,12]},"ws":58,"fixed":1}},"doblo":{"tq":[],"sprite":{"w":196,"h":96,"wy":81.4,"wr":17.0,"ax":[32.4,153.4],"head":[179,63],"tail":[5,39,5,5],"ex":[3,83],"hx":97,"hy":11,"refL":122.8,"slots":{"st_door":[107,63,29,13],"st_rear":[32,52,23,11],"st_glass":[53,25,23,7]},"ws":36,"fixed":1}},"panda":{"tq":[],"sprite":{"w":156,"h":80,"wy":67.0,"wr":14.2,"ax":[25.7,126.9],"head":[146,45],"tail":[7,31,5,5],"ex":[3,69],"hx":76,"hy":7,"refL":128.3,"slots":{"st_door":[85,52,23,11],"st_rear":[24,43,19,9],"st_glass":[42,21,19,6]},"ws":32,"fixed":1}},"punto":{"tq":[],"sprite":{"w":172,"h":81,"wy":66.0,"wr":15.9,"ax":[26.3,136.8],"head":[159,45],"tail":[10,23,5,5],"ex":[3,69],"hx":87,"hy":5,"refL":94.3,"slots":{"st_door":[94,50,25,12],"st_rear":[26,40,22,11],"st_glass":[55,19,22,7]},"ws":34,"fixed":1}},"golf":{"tq":[],"sprite":{"w":178,"h":61,"wy":49.7,"wr":17.6,"ax":[30.9,136.5],"head":[174,27],"tail":[4,24,5,5],"ex":[3,48],"hx":76,"hy":-6,"refL":70.7,"slots":{"st_door":[97,27,26,14],"st_rear":[31,16,24,12],"st_glass":[40,8,24,7]},"ws":38,"fixed":1}},"corsa":{"tq":[],"sprite":{"w":180,"h":83,"wy":67.8,"wr":15.9,"ax":[30.2,140.6],"head":[169,53],"tail":[11,34,5,5],"ex":[3,71],"hx":85,"hy":7,"refL":213.7,"slots":{"st_door":[99,52,27,12],"st_rear":[29,42,22,11],"st_glass":[44,21,22,7]},"ws":34,"fixed":1}},"p205":{"tq":[],"sprite":{"w":167,"h":64,"wy":52.7,"wr":16.4,"ax":[28.0,134.5],"head":[158,37],"tail":[3,30,5,5],"ex":[3,51],"hx":75,"hy":-3,"refL":51.3,"slots":{"st_door":[91,32,25,13],"st_rear":[27,21,22,11],"st_glass":[40,11,22,7]},"ws":36,"fixed":1}},"p206":{"tq":[],"sprite":{"w":174,"h":70,"wy":56.4,"wr":16.1,"ax":[29.5,136.9],"head":[161,42],"tail":[9,29,5,5],"ex":[3,58],"hx":92,"hy":0,"refL":67.3,"slots":{"st_door":[95,39,26,12],"st_rear":[29,28,22,11],"st_glass":[48,14,22,7]},"ws":36,"fixed":1}},"p308":{"tq":[],"sprite":{"w":189,"h":81,"wy":66.3,"wr":19.8,"ax":[32.7,148.0],"head":[174,45],"tail":[10,34,5,5],"ex":[3,66],"hx":87,"hy":3,"refL":41.0,"slots":{"st_door":[103,43,28,15],"st_rear":[32,30,27,13],"st_glass":[44,17,27,8]},"ws":42,"fixed":1}},"clio":{"tq":[],"sprite":{"w":179,"h":81,"wy":66.8,"wr":17.6,"ax":[29.8,143.8],"head":[165,45],"tail":[9,34,5,5],"ex":[3,68],"hx":100,"hy":2,"refL":81.3,"slots":{"st_door":[98,47,26,14],"st_rear":[29,36,24,12],"st_glass":[50,16,24,7]},"ws":38,"fixed":1}},"williams":{"tq":[],"sprite":{"w":175,"h":79,"wy":60.6,"wr":17.7,"ax":[28.7,137.4],"head":[164,47],"tail":[4,42,5,5],"ex":[3,65],"hx":90,"hy":2,"refL":75.0,"slots":{"st_door":[96,44,26,14],"st_rear":[28,33,24,12],"st_glass":[46,16,24,7]},"ws":38,"fixed":1}},"taxi":{"tq":[],"sprite":{"w":200,"h":71,"wy":56.0,"wr":14.9,"ax":[42.8,161.6],"head":[186,41],"tail":[11,45,5,5],"ex":[3,60],"hx":97,"hy":4,"refL":133.0,"slots":{"st_door":[110,42,30,11],"st_rear":[43,32,20,10],"st_glass":[70,18,20,6]},"ws":32,"fixed":1}},"v850":{"tq":[],"sprite":{"w":213,"h":71,"wy":56.1,"wr":15.8,"ax":[52.5,169.6],"head":[198,39],"tail":[8,21,5,5],"ex":[3,59],"hx":123,"hy":-4,"refL":30.0,"slots":{"st_door":[117,40,31,12],"st_rear":[51,30,22,11],"st_glass":[62,10,22,7]},"ws":34,"fixed":1}},"polo":{"tq":[],"sprite":{"w":175,"h":80,"wy":65.0,"wr":15.7,"ax":[30.3,139.0],"head":[161,44],"tail":[9,32,5,5],"ex":[3,68],"hx":90,"hy":2,"refL":113.0,"slots":{"st_door":[96,50,26,12],"st_rear":[30,40,21,10],"st_glass":[49,16,21,7]},"ws":34,"fixed":1}},"van":{"tq":[],"sprite":{"w":192,"h":91,"wy":77.3,"wr":16.0,"ax":[34.0,152.8],"head":[178,53],"tail":[6,38,5,5],"ex":[3,79],"hx":108,"hy":0,"refL":198.2,"slots":{"st_door":[105,60,28,12],"st_rear":[33,50,22,11],"st_glass":[51,14,22,7]},"ws":34,"fixed":1}},"ambulanza":{"tq":[],"sprite":{"w":267,"h":129,"wy":112.4,"wr":20.2,"ax":[55.0,216.5],"head":[249,81],"tail":[14,76,5,5],"ex":[3,113],"hx":136,"hy":-3,"refL":198.5,"slots":{"st_door":[146,90,40,16],"st_rear":[54,76,28,14],"st_glass":[66,11,28,9]},"ws":44,"fixed":1}},"polizia":{"tq":[],"sprite":{"w":193,"h":77,"wy":59.8,"wr":15.8,"ax":[37.3,152.6],"head":[180,48],"tail":[8,34,5,5],"ex":[3,65],"hx":108,"hy":-7,"refL":121.2,"slots":{"st_door":[106,46,28,12],"st_rear":[36,36,22,11],"st_glass":[55,7,22,7]},"ws":34,"fixed":1}}});

// coppia indicata da potenza e coppia vere (le perdite interne del modello si aggiungono, così i numeri netti tornano)
function genTq(hp, rpmHp, nm, rpmNm, lim) {
  const fr = (r) => 16 + 0.0035 * r + 0.9e-6 * r * r, nHp = hp * 7023 / rpmHp, out = [];
  for (let r = 0; r <= 7500; r += 500) {
    let t;
    if (r <= rpmNm) t = nm * (0.55 + 0.45 * Math.min(1, r / Math.max(1, rpmNm)));
    else if (r <= rpmHp) t = nm + (nHp - nm) * (r - rpmNm) / Math.max(1, rpmHp - rpmNm);
    else t = nHp * Math.max(0.35, 1 - (r - rpmHp) / Math.max(800, (lim + 900 - rpmHp)) * 0.55);
    out.push([r, Math.round(t + fr(r))]);
  }
  return out;
}
const G5 = [0, 3.55, 1.95, 1.32, 1.03, 0.82], G6 = [0, 3.77, 2.12, 1.36, 1.03, 0.81, 0.65];
// [id, nome, nome corto, marca, motore, kg, trazione anteriore, cilindri, CV, giri CV, Nm, giri Nm, limitatore, minimo, marce, finale, raggio ruota, cd, area, prezzo, km, diesel]
const GEN_NEW = [
  ['a80', 'Audi 80 Avant 2.0', 'Audi 80', 'Audi', '2.0 aspirato', 1250, true, 4, 115, 5400, 168, 3200, 6300, 800, G5, 4.1, 0.30, 0.33, 2.0, 4500, 0],
  ['a3', 'Audi A3 Sportback 1.5 TFSI', 'A3', 'Audi', '1.5 TFSI turbo', 1300, true, 4, 150, 5000, 250, 2000, 6200, 750, G6, 3.6, 0.315, 0.30, 2.15, 30000, 60],
  ['a112', 'Autobianchi A112 Abarth', 'A112', 'Autobianchi', '1050 Abarth', 700, true, 4, 70, 6600, 86, 4200, 7000, 900, [0, 3.58, 2.24, 1.48, 1.04, 0.86], 4.07, 0.27, 0.40, 1.6, 14000, 40],
  ['bus', 'Autobus urbano', 'Autobus', 'Autobus', '9 litri turbodiesel', 11500, false, 6, 300, 2000, 1250, 1100, 2300, 600, [0, 3.4, 1.9, 1.4, 1.0, 0.75, 0.65], 5.4, 0.5, 0.65, 8.5, 60000, 300, 1],
  ['doblo', 'Fiat Doblò 1.6 Multijet', 'Doblò', 'Fiat', '1.6 Multijet', 1500, true, 4, 105, 4000, 290, 1500, 4800, 780, G6, 3.8, 0.31, 0.35, 2.9, 22000, 50, 1],
  ['panda', 'Fiat Panda 1.2', 'Panda', 'Fiat', '1.2 8V', 940, true, 4, 69, 5500, 102, 3000, 6300, 800, G5, 4.07, 0.28, 0.32, 2.1, 13500, 0],
  ['punto', 'Fiat Grande Punto 1.4', 'Punto', 'Fiat', '1.4 8V', 1100, true, 4, 77, 6000, 115, 3000, 6500, 800, G5, 3.9, 0.29, 0.33, 2.1, 14000, 0],
  ['golf', 'Volkswagen Golf GTI', 'Golf GTI', 'Volkswagen', '1.8 GTI', 860, true, 4, 112, 5800, 157, 3500, 6800, 850, G5, 3.9, 0.28, 0.42, 1.8, 15000, 80],
  ['corsa', 'Opel Corsa 1.2', 'Corsa', 'Opel', '1.2 16V', 1100, true, 4, 70, 5600, 115, 4000, 6400, 800, G5, 3.9, 0.29, 0.33, 2.1, 15500, 0],
  ['p205', 'Peugeot 205 GTI 1.9', '205 GTI', 'Peugeot', '1.9 GTI', 880, true, 4, 130, 6000, 164, 4750, 6900, 850, G5, 4.06, 0.28, 0.35, 1.75, 19000, 120],
  ['p206', 'Peugeot 206 GTI 2.0', '206 GTI', 'Peugeot', '2.0 16V', 1100, true, 4, 136, 6000, 190, 4100, 6800, 800, G5, 4.0, 0.30, 0.33, 2.0, 6500, 40],
  ['p308', 'Peugeot 308 1.2 PureTech', '308', 'Peugeot', '1.2 PureTech turbo (3 cilindri)', 1200, true, 3, 130, 5500, 230, 1750, 6000, 750, G6, 3.6, 0.31, 0.29, 2.2, 25000, 60],
  ['clio', 'Renault Clio 0.9 TCe', 'Clio', 'Renault', '0.9 TCe turbo (3 cilindri)', 1050, true, 3, 90, 5250, 140, 2500, 6200, 780, G5, 4.0, 0.30, 0.32, 2.1, 17000, 20],
  ['williams', 'Renault Clio Williams', 'Williams', 'Renault', '2.0 16V F7R', 990, true, 4, 150, 6100, 175, 4500, 6800, 850, G5, 4.07, 0.29, 0.34, 1.9, 25000, 150],
  ['taxi', 'Taxi 2.0 diesel', 'Taxi', 'Taxi', '2.0 turbodiesel', 1450, true, 4, 150, 4000, 340, 1750, 4800, 780, G6, 3.4, 0.31, 0.29, 2.2, 9000, 30, 1],
  ['v850', 'Volvo 850 R', '850 R', 'Volvo', '2.3 cinque cilindri turbo', 1520, true, 5, 250, 5400, 350, 2500, 6500, 800, G5, 3.6, 0.31, 0.33, 2.1, 16000, 120],
  ['polo', 'Volkswagen Polo 1.0', 'Polo', 'Volkswagen', '1.0 MPI (3 cilindri)', 1080, true, 3, 75, 6200, 95, 3000, 6500, 800, G5, 3.9, 0.29, 0.32, 2.1, 17500, 0],
  ['van', 'Furgone 1.5 dCi', 'Furgone', 'Furgone', '1.5 dCi', 1400, true, 4, 90, 4000, 200, 1750, 4600, 780, G5, 4.0, 0.31, 0.36, 3.0, 24000, 60, 1],
  ['ambulanza', 'Ambulanza 2.1 CDI', 'Ambulanza', 'Ambulanza', '2.1 CDI', 2900, false, 4, 163, 3800, 360, 1400, 4500, 750, G6, 3.9, 0.35, 0.40, 4.5, 25000, 200, 1],
  ['polizia', 'Auto della polizia (dismessa)', 'Ex polizia', 'Polizia', '2.0 TDI', 1450, true, 4, 150, 4000, 340, 1750, 4800, 780, G6, 3.4, 0.31, 0.31, 2.2, 11000, 150, 1],
];
for (const q of GEN_NEW) {
  const [id, name, short, make, engine, mass, fwd, cyl, hp, rH, nm, rN, lim, idle, gears, fd, r, cd, A, price, km, diesel] = q;
  GEN_DATA[id].tq = genTq(hp, rH, nm, rN, lim);
  const heavy = mass > 5000;
  const voice = diesel ? { mani: cyl === 6 ? [0.88, 0.84, 0.82, 0.82, 0.84, 0.88] : [0.7, 0.66, 0.66, 0.7], rf: -0.3, pulse: heavy ? 1.8 : 1.5, rough: 0.45, diesel: heavy ? 1.2 : 1, boomRpm: lim * 0.4, hiRpm: lim }
    : { pulse: hp > 120 ? 0.85 : 1.05, rough: hp < 80 ? 0.2 : 0.1, metal: hp > 120 ? 0.35 : 0, boomRpm: lim * 0.5, hiRpm: lim };
  // scoppi dello scarico: le piccole acute e secche, le grosse più cupe e lunghe, i diesel quasi niente schiocco
  voice.pop = diesel ? { f: 0.7, crack: 0.5, len: 0.8 } : cyl === 6 ? { f: 0.9, crack: 1.0, len: 1.15, thump: 1.15 }
    : hp < 80 ? { f: 1.4, crack: 1.3, len: 0.75 } : hp < 120 ? { f: 1.2, crack: 1.15, len: 0.9 } : { f: 1.08, crack: 1.1, len: 1.0 };
  if (cyl === 3) { voice.rough = Math.max(voice.rough || 0, 0.38); voice.lope = 0.12; voice.pulse = (voice.pulse || 1) * 1.25; voice.rf = -0.3; voice.pop = Object.assign({}, voice.pop, { f: 1.05, crack: 1.2, len: 0.9, vary: 1.5 }); }   // un colpo ogni 240°: «brrr» ruvido e irregolare
  if (make === 'Volvo') voice.pop = Object.assign({}, VOLVO_POP, { f: 0.72, bf: 0.92, len: 1.5, boom: 0.65 });   // 850 R: ancora più cupa
  GEN_CARS.push({
    id, name, short, make, tag: `${name} · ${engine} · ${fwd ? 'trazione anteriore' : 'trazione posteriore'} · ${gears.length - 1} marce`,
    shiftK: heavy ? 1.6 : diesel ? 1.2 : 1.05, hesK: diesel ? 0.15 : 0.3, voice, buy: { price, km },
    engine, mass, driveW: fwd ? 0.62 : 0.55, fwd, cyl, exStock: diesel ? GEN_EX.diesel : cyl >= 5 ? GEN_EX.bmw6 : GEN_EX.old4, pitch: heavy ? 0.6 : 1.0, mu: heavy ? 0.9 : 1.0, ecuBrand: diesel ? 'Bosch EDC' : 'Originale',
    P: Object.assign({ idle, limiter: lim, launchRpm: diesel ? 2000 : 3800, Ie: heavy ? 2.6 : 0.14 + mass / 12000, mass, r, cd, A, mu: heavy ? 0.9 : 1.0, cgH: heavy ? 1.2 : 0.5, wb: heavy ? 5.9 : 2.5, tank: heavy ? 300 : 50, gears, rev: -3.5, fd, clutchMax: Math.round(nm * 1.6) },
      heavy ? { Iw: 36, Ks: 240000, vmax: 90 } : {}),
    turbo: null,
    boost: [KIT_SC('sc', 'Rotrex', 'Compressore volumetrico (0,5 bar)', 0.5, Math.round(2500 + price * 0.1), 30, 'Più spinta coi giri: +35 %.'),
      KIT_T('turbo', 'Garrett', 'Kit turbo (0,9 bar)', 0.9, 2600, 3800, Math.round(4000 + price * 0.15), 45, 'Il kit grosso: servono centralina e intercooler.', 'TURBO')],
    diff0: { name: 'Aperto', note: 'Di serie.', diff: 'open' }, priceK: heavy ? 3 : 1,
  });
}

const CARS = {
  supra: {
    id: 'supra', name: 'Toyota Supra RZ', short: 'Supra', tag: 'Toyota Supra RZ · JZA80 · sei in linea biturbo · Getrag V160',
    engine: '2JZ-GTE 3.0 biturbo', mass: 1570, driveW: 0.47, fwd: false,
    tuning: null, presets: null, params: null,                  // assegnati sotto (tuning.js è caricato prima)
    body: {},
  },
  v40: {
    id: 'v40', name: 'Volvo V40 SW 2.0', short: 'V40', tag: 'Volvo V40 SW · 2.0 16V B4204S · quattro in linea · cambio M56 a 5 marce',
    engine: 'B4204S 2.0 16V aspirato', mass: 1290, driveW: 0.61, fwd: true,
    // disegno per il traffico: carrozzeria del giocatore, ruota e maschera ricavate da strumenti/v40_traffico.py
    // (la V40 guidata dal giocatore si disegna a parte in street2d.js: v40Base, v40Wheel)
    sprite: { img: 'img/v40.png', wheel: 'img/v40_wheel.png', paint: 'img/v40_paint.png', w: 200, h: 71, wy: 56, wr: 14.4, ax: [41, 156], head: [190, 40], tail: [2, 26, 6, 7],
      ex: [3, 54], hx: 112, hy: 3, refL: 62.2, slots: { st_door: [124, 42, 30, 12], st_rear: [30, 38, 22, 11], st_glass: [72, 21, 22, 7] }, ws: 31, fixed: 1 },
    // fisica: 2.0 aspirato da 140 CV a 6000 giri e ~185 Nm a 4500, trazione anteriore, 5 marce
    P: {
      idle: 800, limiter: 6500, launchRpm: 3800, Ie: 0.16, mass: 1290, r: 0.308, cd: 0.33, A: 2.08, mu: 1.0, cgH: 0.52, wb: 2.56,
      tank: 60, gears: [0, 3.385, 1.905, 1.233, 0.906, 0.730], rev: -3.15, fd: 4.0, clutchMax: 420, shiftK: 1.15, hesK: 0.35,
      // coppia indicata (le perdite interne del modello si sottraggono): netti 140 CV a 6000 e ~185 Nm a 4500
      tq: [[0, 130], [500, 150], [1000, 185], [1500, 205], [2000, 216], [2500, 224], [3000, 229], [3500, 233],
        [4000, 236], [4500, 238], [5000, 238], [5500, 236], [6000, 233], [6500, 220], [7000, 200], [7500, 180]],
    },
    tuning: TUNING_V40, presets: V40_PRESETS, params: v40Params,
    // estetica propria (al Russian Kùstòm, oltre a vernice, neon, pinze, vetri e sticker comuni)
    body: {
      wheels: { label: 'Cerchi', items: [
        { id: 'none', name: 'Copricerchi di serie', price: 0 },
        { id: 'a5', name: 'Lega 5 razze 16"', price: 550 },
        { id: 'mesh', name: 'Lega a raggi 17"', price: 900 } ] },
      kit: { label: 'Kit carrozzeria', items: [
        { id: 'none', name: 'Di serie', price: 0 },
        { id: 'kit', name: 'Labbro, minigonne e diffusore', price: 1200 } ] },
      spoiler: { label: 'Spoiler', items: [
        { id: 'none', name: 'Nessuno', price: 0 },
        { id: 'roof', name: 'Sopra il portellone', price: 350 } ] },
    },
    // vecchia scala di potenziamenti (salvataggi precedenti): livello → pezzi ed estetica
    legacyUps: ['lavaggio', 'cerchi', 'assetto', 'scarico', 'aspira', 'kit', 'spoiler', 'turbo', 'turbo2', 'lsd'],
  },
};
CARS.supra.tuning = TUNING_SUPRA; CARS.supra.presets = SUPRA_PRESETS; CARS.supra.params = supraParams;
for (const c of GEN_CARS) CARS[c.id] = genCar(c);
const CAR_IDS = Object.keys(CARS);
// freni di ogni auto (la Supra ha i suoi in sim.js): abs = c'era di serie · bk = decelerazione massima a pedale pieno (g),
// con pastiglie fredde e senza limiti di gomma · bf = quota sull'asse anteriore · Iwf = inerzia delle ruote non motrici
// (kg·m²) · cl = portanza. Le auto degli anni 70-80 senza ABS bloccano le ruote; tamburi e servofreni deboli frenano meno.
const CAR_BRAKES = {
  v40: { abs: true, bk: 1.08, bf: 0.68, Iwf: 1.6 }, r5: { abs: false, bk: 1.05, bf: 0.6, Iwf: 1.4 }, b2002: { abs: false, bk: 0.92, bf: 0.68, Iwf: 1.6, cl: 0.2 },
  e30: { abs: true, bk: 1.1, bf: 0.66, cl: 0.12 }, e36: { abs: true, bk: 1.18, bf: 0.66 }, e34: { abs: true, bk: 1.15, bf: 0.65 },
  a80: { abs: true, bk: 1.0, bf: 0.68 }, a3: { abs: true, bk: 1.15, bf: 0.7 }, a112: { abs: false, bk: 0.9, bf: 0.7, cl: 0.2 },
  bus: { abs: true, bk: 0.62, bf: 0.55, cl: 0 }, doblo: { abs: true, bk: 1.0, bf: 0.7 }, panda: { abs: true, bk: 1.0, bf: 0.72 },
  punto: { abs: true, bk: 1.05, bf: 0.7 }, golf: { abs: false, bk: 0.98, bf: 0.72, cl: 0.18 }, corsa: { abs: true, bk: 1.0, bf: 0.7 },
  p205: { abs: false, bk: 1.0, bf: 0.7, cl: 0.15 }, p206: { abs: true, bk: 1.08, bf: 0.7 }, p308: { abs: true, bk: 1.12, bf: 0.7 },
  clio: { abs: true, bk: 1.08, bf: 0.7 }, williams: { abs: false, bk: 1.04, bf: 0.7 }, taxi: { abs: true, bk: 1.05, bf: 0.68 },
  v850: { abs: true, bk: 1.1, bf: 0.68 }, polo: { abs: true, bk: 1.02, bf: 0.7 }, van: { abs: true, bk: 0.95, bf: 0.66 },
  ambulanza: { abs: true, bk: 0.85, bf: 0.6 }, polizia: { abs: true, bk: 1.05, bf: 0.68 },
};
for (const id of CAR_IDS) if (id !== 'supra' && CARS[id].P) Object.assign(CARS[id].P, { abs: true, bk: 1.05, bf: 0.68 }, CAR_BRAKES[id] || {});
// quadro strumenti originale di ogni auto (banner in alto e strumenti in gioco)
// speed: fondo scala km/h · tach: fondo scala ×1000 · red: inizio zona rossa · face/num/needle: quadrante, numeri, lancette
// glow: luce notturna dei numeri · lcd: colore dei display · tachMid: contagiri al centro (Toyota) · m: strisce M · varRed: zona rossa che segue l'olio (E36)
const CLUSTERS = {
  supra: { brand: 'TOYOTA', model: '2JZ-GTE · 24V DOHC TWIN TURBO', speed: 180, tach: 9, red: 7, tachMid: true, face: ['#101114', '#050506'], num: '#f2f2ee', needle: '#ff5a1e', glow: 'rgba(255,255,255,.18)', lcd: '#ff7a3a', bez: ['#3a3b40', '#121316', '#26272c'], aux: 'BOOST', font: '"Russo One", "Arial Black", sans-serif' },
  v40: { brand: 'VOLVO', model: 'B4204S · 16V', speed: 240, tach: 7, red: 6.5, face: ['#121417', '#07080a'], num: '#eef3f0', needle: '#ff3b1f', glow: 'rgba(160,255,200,.12)', lcd: '#9fffc8', bez: ['#4a4c52', '#16171a', '#2c2e33'], aux: 'TEMP', font: '"Barlow Semi Condensed", "Arial Narrow", sans-serif' },
  r5: { brand: 'JAEGER', model: 'RENAULT 5 TURBO', speed: 240, tach: 8, red: 6.5, face: ['#0c0d0f', '#040405'], num: '#f4f1e4', needle: '#ff8a1a', glow: 'rgba(120,255,150,.22)', lcd: '#7dff9a', bez: ['#26272a', '#0c0c0d', '#1a1a1c'], aux: 'TURBO', font: '"Saira Stencil One", "Arial Black", sans-serif' },
  b2002: { brand: 'BMW', model: '2002 TURBO · KUGELFISCHER', speed: 240, tach: 8, red: 6.4, face: ['#0e0e0f', '#050505'], num: '#f4efe0', needle: '#f4efe0', glow: 'rgba(255,170,90,.2)', lcd: '#ffb060', bez: ['#9aa0a8', '#2a2c30', '#5a5e66'], aux: 'LADEDRUCK', font: '"Barlow Semi Condensed", "Arial Narrow", sans-serif', chrome: true },
  e30: { brand: 'BMW M TECHNIC', model: 'S14 · 2.3 16V', speed: 260, tach: 8, red: 7.3, m: true, face: ['#0d0d0e', '#040404'], num: '#ff8a2a', needle: '#ff5a14', glow: 'rgba(255,120,30,.3)', lcd: '#ff8a2a', bez: ['#2c2c2e', '#0b0b0c', '#1c1c1e'], aux: 'ÖL', font: '"Barlow Semi Condensed", "Arial Narrow", sans-serif' },
  e36: { brand: 'BMW M', model: 'S50B30 · VANOS', speed: 280, tach: 8, red: 7.0, m: true, varRed: true, face: ['#17181b', '#08090a'], num: '#ff8f3a', needle: '#ff3a1a', glow: 'rgba(255,130,40,.3)', lcd: '#ff8f3a', bez: ['#34353a', '#0e0f11', '#222327'], aux: 'ÖL', font: '"Barlow Semi Condensed", "Arial Narrow", sans-serif' },
  e34: { brand: 'BMW M', model: 'S38B36 · M POWER', speed: 280, tach: 8, red: 7.0, m: true, face: ['#121214', '#060607'], num: '#ff8a2a', needle: '#ff4a1a', glow: 'rgba(255,120,30,.3)', lcd: '#ff8a2a', bez: ['#303034', '#0c0c0e', '#202024'], aux: 'ÖL', font: '"Barlow Semi Condensed", "Arial Narrow", sans-serif' },
};
for (const id in CLUSTERS) if (CARS[id]) CARS[id].cluster = CLUSTERS[id];
// quadro di serie per le auto del pacchetto: scala secondo motore, colori sobri
for (const id of CAR_IDS) if (!CARS[id].cluster) {
  const c = CARS[id], lim = c.P.limiter, diesel = lim < 5200;
  CARS[id].cluster = { brand: c.make.toUpperCase(), model: c.engine.toUpperCase(), speed: c.mass > 5000 ? 125 : (c.P.tq ? 200 : 220), tach: lim < 3000 ? 3 : diesel ? 5 : lim > 6600 ? 8 : 7, red: Math.round((lim - 300) / 100) / 10,
    face: ['#121316', '#060708'], num: '#eef0f2', needle: diesel ? '#ffb000' : '#ff5a1e', glow: 'rgba(200,220,255,.14)', lcd: '#ffcf7a', bez: ['#3a3c40', '#121315', '#26282c'], aux: 'TURBO', font: '"Barlow Semi Condensed", "Arial Narrow", sans-serif' };
}


// rende attivo il catalogo dell'auto: TUNING e TUNING_PRESETS (usati dall'officina) puntano a quelli dell'auto
function setActiveCar(id) {
  ACTIVE_CAR = CARS[id] ? id : 'supra';
  TUNING = CARS[ACTIVE_CAR].tuning; TUNING_PRESETS = CARS[ACTIVE_CAR].presets;   // eslint-disable-line no-global-assign
}
// selezione e estetica ricavate dalla vecchia scala della V40
function v40FromLegacy(level) {
  const has = (id) => CARS.v40.legacyUps.indexOf(id) > -1 && CARS.v40.legacyUps.indexOf(id) < level;
  const sel = Object.assign({}, V40_PRESETS[0].sel);
  if (has('cerchi')) sel.tires = 'sport';
  if (has('assetto')) sel.suspension = 'springs';
  if (has('scarico')) sel.exhaust = 'catback';
  if (has('aspira')) { sel.intake = 'pf'; sel.ecu = 'remap'; }
  if (has('turbo')) sel.turbo = 'td04';
  if (has('turbo2')) { sel.turbo = 'td04_19t'; sel.ecu = 'standalone'; }
  if (has('lsd')) sel.final = 'quaife';
  const cos = { wheels: has('cerchi') ? 'a5' : 'none', kit: has('kit') ? 'kit' : 'none', spoiler: has('spoiler') ? 'roof' : 'none' };
  return { sel, cos, clean: has('lavaggio') };
}
if (typeof window !== 'undefined') Object.assign(window, { CARS, CAR_IDS, v40Params, setActiveCar, v40FromLegacy });
