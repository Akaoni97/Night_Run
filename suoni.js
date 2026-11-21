/* Famiglie di suono dei motori (dopo schede.js, prima di cars.js; senza di lui cars.js usa la voce comune di prima).
   Ogni auto da disegno prende il suo suono dalla SCHEDA del motore (schede.js): quanti cilindri, cilindrata, valvole,
   benzina o diesel, turbo, potenza specifica, giri massimi. Da lì `suonoFamiglia` sceglie la famiglia e `suonoDi` costruisce
   voce (voice), scarico di serie, scarichi sportivi, aspirazione, inerzia del motore (quanto in fretta sale e scende di giri)
   e tempi di cambiata. Dentro la famiglia ogni auto è un po' diversa (cilindrata, valvole, giri, firma deterministica).
   Famiglie: citta (piccoli aspirati a 8-16 valvole), berlina (due litri aspirati tranquilli), sportiva (quattro cilindri
   alti di giri, potenza specifica alta), tre (tricilindrici), turbo (quattro cilindri turbo moderni), cinque (cinque in
   linea turbo), diesel (common rail leggeri), bus (diesel pesante da nove litri).
   Test in test/suoni.test.js; misure con strumenti/ascolta.mjs. */
const SUONI_FAM = {
  // piccoli aspirati: voce sottile e squillante, poco corpo, scarico corto
  citta: {
    nome: 'Piccoli aspirati da città', ieK: 0.85, shiftK: 1.0, hesK: 0.3, lim: 0,
    ex: { L: 3.0, r: -0.5, m: [['lp', 2300, 0.6], ['peak', 210, 1.0, 2], ['peak', 950, 1.4, 3], ['peak', 2900, 2, 0]], g: 1.9, jet: 0.3, rasp: 0.2, tips: 1 },
    in: { in: 1.2, roar: 1.3, wh: 1 },
    voice: { pulse: 0.8, rough: 0.2, metal: 0.1, howl: 0 },
    pop: { f: 1.45, crack: 1.3, len: 0.72 },
  },
  // due litri aspirati da berlina: basso e pieno, lisci
  berlina: {
    nome: 'Berline aspirate', ieK: 1.1, shiftK: 1.15, hesK: 0.3,
    ex: { L: 4.6, r: -0.42, m: [['lp', 950, 0.6], ['peak', 105, 1.0, 5], ['peak', 420, 1.4, 3], ['peak', 1700, 2, -5]], g: 2.0, jet: 0.18, rasp: 0.12, tips: 1 },
    in: { in: 0.9, roar: 0.9, wh: 1 },
    voice: { pulse: 1.3, rough: 0.08, metal: 0, howl: 0 },
    pop: { f: 0.95, crack: 0.9, len: 1.1, thump: 1.1 },
  },
  // quattro cilindri sportivi: secchi, ringhianti, urlano in alto
  sportiva: {
    nome: 'Sportive a quattro cilindri', ieK: 0.62, shiftK: 0.95, hesK: 0.45,
    ex: { L: 3.4, r: -0.58, m: [['lp', 3100, 0.6], ['peak', 165, 1.0, 3], ['peak', 1400, 1.4, 5], ['peak', 3500, 2, 2]], g: 2.1, jet: 0.6, rasp: 0.5, tips: 1 },
    in: { in: 1.9, roar: 2.1, wh: 1.2 },
    voice: { pulse: 0.82, rough: 0.1, metal: 0.55, howl: 0.35 },
    pop: { f: 1.12, crack: 1.35, len: 0.85 },
  },
  // tricilindrici: un colpo ogni 240°, brontolio ruvido e irregolare
  tre: {
    nome: 'Tricilindrici', ieK: 0.78, shiftK: 1.0, hesK: 0.3,
    ex: { L: 3.7, r: -0.45, m: [['lp', 1500, 0.6], ['peak', 135, 1.0, 5], ['peak', 650, 1.5, 4], ['peak', 1900, 2, -3]], g: 1.9, jet: 0.3, rasp: 0.3, tips: 1 },
    in: { in: 1.3, roar: 1.5, wh: 1 },
    voice: { pulse: 1.25, rough: 0.42, metal: 0.05, howl: 0, lope: 0.14, rf: -0.3 },
    pop: { f: 1.05, crack: 1.25, len: 0.9, vary: 1.5 },
  },
  // quattro cilindri turbo moderni: scarico chiuso e educato, aspirazione che soffia
  turbo: {
    nome: 'Quattro cilindri turbo moderni', ieK: 0.95, shiftK: 1.05, hesK: 0.25,
    ex: { L: 5.0, r: -0.38, m: [['lp', 820, 0.6], ['peak', 95, 1.0, 3], ['peak', 450, 1.4, 2], ['peak', 1500, 2, -6]], g: 3.0, jet: 0.2, rasp: 0.1, tips: 1 },
    in: { in: 1.7, roar: 1.1, wh: 2.0 },
    voice: { pulse: 1.0, rough: 0.12, metal: 0.2, howl: 0 },
    pop: { f: 1.0, crack: 1.1, len: 1.0 },
  },
  // cinque in linea: il borbottio basso e largo, ordine 1-2-4-5-3
  cinque: {
    nome: 'Cinque cilindri', ieK: 1.0, shiftK: 1.1, hesK: 0.3,
    ex: { L: 4.4, r: -0.44, m: [['lp', 1500, 0.6], ['peak', 115, 1.0, 5], ['peak', 480, 1.5, 4], ['peak', 1400, 2, -1]], g: 1.85, jet: 0.25, rasp: 0.2, tips: 1 },
    in: { in: 1.3, roar: 1.4, wh: 1.2 },
    voice: { pulse: 1.0, rough: 0.12, metal: 0.3, howl: 0.15 },
    pop: { f: 0.85, crack: 1.0, len: 1.3, thump: 1.1 },
  },
  // diesel common rail leggeri: ticchettio, poca altezza, niente schiocco
  diesel: {
    nome: 'Diesel common rail', ieK: 1.5, shiftK: 1.25, hesK: 0.15,
    ex: { L: 4.6, r: -0.4, m: [['lp', 900, 0.6], ['peak', 90, 1.0, 6], ['peak', 380, 1.4, 3], ['peak', 1800, 2, -6]], g: 1.9, jet: 0.25, rasp: 0.35, tips: 1 },
    in: { in: 0.8, roar: 0.7, wh: 0.8 },
    voice: { pulse: 1.55, rough: 0.45, metal: 0, howl: 0, diesel: 1 },
    pop: { f: 0.7, crack: 0.5, len: 0.8 },
  },
  // nove litri da autobus: sordo, lunghissimo, lento
  bus: {
    nome: 'Diesel pesante', ieK: 1, shiftK: 1.6, hesK: 0.15,
    ex: { L: 6.5, r: -0.36, m: [['lp', 640, 0.6], ['peak', 78, 1.0, 7], ['peak', 300, 1.4, 3], ['peak', 1400, 2, -7]], g: 2.0, jet: 0.2, rasp: 0.35, tips: 1 },
    in: { in: 0.8, roar: 0.8, wh: 0.7 },
    voice: { pulse: 1.8, rough: 0.45, metal: 0, howl: 0, diesel: 1.2 },
    pop: { f: 0.6, crack: 0.45, len: 0.9 },
  },
};

// piccolo numero casuale ma sempre uguale per la stessa auto (la «firma» del motore)
function suonoFirma(id, n) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  const out = [];
  for (let k = 0; k < n; k++) { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; out.push((h / 4294967296) * 2 - 1); }
  return out;
}

// la famiglia dalla scheda del motore (se la scheda ha `suono` vale quello)
function suonoFamiglia(S) {
  if (!S) return 'citta';
  if (S.suono) return S.suono;
  if (S.fuel === 'diesel') return S.cc > 5000 ? 'bus' : 'diesel';
  if (S.cil === 3) return 'tre';
  if (S.cil === 5) return 'cinque';
  const hpL = S.hp / (S.cc / 1000), turbo = /turbo/i.test(S.alim);
  if (turbo) return 'turbo';
  if (hpL >= 60 && S.cc < 2100) return 'sportiva';
  return S.cc >= 1900 ? 'berlina' : 'citta';
}

const _ex = (e, k) => ({ L: e.L * k.L, r: e.r, m: e.m.map((x, i) => (i === 0 ? ['lp', Math.min(9000, Math.round(x[1] * k.lp)), x[2]] : x.slice())), g: e.g * k.g, jet: Math.min(1.2, e.jet + k.jet), rasp: Math.min(1, e.rasp + k.rasp), tips: e.tips });

/* Costruisce il suono di un'auto da disegno.
   d = { cyl, lim (giri massimi), hp }. Restituisce { fam, voice, ex, exCat, exRace, inStock, ieK, shiftK, hesK }. */
function suonoDi(id, S, d) {
  if (!S) return null;
  const fam = suonoFamiglia(S), F = SUONI_FAM[fam], f = suonoFirma(id, 8);
  const T = S.timbro || {};                                   // ritocchi del singolo motore (schede.js)
  const cc = S.cc, cyl = S.cil, lim = d.lim, perCyl = cc / cyl, v16 = /16|20|24/.test(S.val), v8 = /8 valvole|12 valvole/.test(S.val) && !v16;
  const big = Math.pow(perCyl / 350, 0.5);                          // cilindrata del singolo cilindro: più grande = più grave, colpi più lunghi
  // lunghezze dei collettori: più lunghe e più larghe nei motori grossi, un po' diverse da auto ad auto
  const base = fam === 'sportiva' ? 0.52 : fam === 'citta' ? 0.5 : fam === 'berlina' ? 0.72 : fam === 'bus' ? 0.9 : fam === 'diesel' ? 0.7 : 0.6;
  const mani = [0, 1, 2, 3, 4, 5].map((i) => +(base * (0.82 + 0.3 * big) * (1 + 0.05 * f[i] + (i % 2 ? 0.02 : -0.01))).toFixed(3));
  const voice = Object.assign({
    mani, rf: -0.4 + 0.05 * f[0], bias: [0, 1, 2, 3, 4, 5].map((i) => +(1 + 0.04 * f[(i + 2) % 8]).toFixed(3)), split: 0,
    boomRpm: Math.round(lim * (fam === 'diesel' || fam === 'bus' ? 0.4 : 0.5) * (1 + 0.06 * f[3])), hiRpm: lim,
  }, F.voice);
  voice.pulse = +(F.voice.pulse * (0.88 + 0.22 * big) * (1 + 0.04 * f[1])).toFixed(3);
  // 16 valvole: più metallico e ringhioso in alto; 8 valvole: più sordo
  if (v16 && fam !== 'diesel' && fam !== 'bus') { voice.metal = Math.max(voice.metal, 0.3) + 0.12; voice.howl = Math.max(voice.howl, 0.2); voice.pulse *= 0.92; }
  if (v8 && fam !== 'diesel' && fam !== 'bus') { voice.metal = Math.max(0, voice.metal - 0.15); voice.rough += 0.04; voice.pulse *= 1.08; }
  voice.metalF = Math.round((2700 + 0.12 * (lim - 5500)) * (1 + 0.1 * f[4]));
  voice.howlF = Math.round((750 + 0.04 * lim) * (1 + 0.1 * f[5]));
  if (fam === 'diesel') { voice.diesel = 0.85 + 0.3 * Math.min(1, perCyl / 520) + 0.05 * f[6]; voice.rough += 0.06 * f[7]; }
  for (const q in (T.voice || {})) voice[q] = typeof T.voice[q] === 'number' && q !== 'rough' && q !== 'metal' && q !== 'howl' && q !== 'lope' ? voice[q] * T.voice[q] : (voice[q] || 0) + T.voice[q];   // ritocchi del singolo motore: rough, metal, howl, lope si sommano, il resto si moltiplica
  voice.pop = Object.assign({}, F.pop);
  voice.pop.f = +(F.pop.f * (1 - 0.1 * (big - 1)) * (1 + 0.04 * f[2])).toFixed(3);
  // scarico di serie: più lungo e basso nei motori grossi
  const tx = T.ex || {};
  const k = { L: (0.92 + 0.1 * big + 0.03 * f[0]) * (tx.L || 1), lp: (1.06 - 0.12 * big + 0.04 * f[1]) * (tx.lp || 1), g: (1 + 0.03 * f[2]) * (tx.g || 1), jet: tx.jet || 0, rasp: tx.rasp || 0 };
  const ex = _ex(F.ex, k);
  // scarichi sportivi della stessa famiglia: stesso carattere, più corti, più aperti e più urlanti
  const dz = fam === 'diesel' || fam === 'bus';
  const exCat = _ex(F.ex, { L: k.L * 0.86, lp: k.lp * (dz ? 1.5 : 2.0), g: k.g * 1.12, jet: dz ? 0.12 : 0.25, rasp: dz ? 0.15 : 0.22 });
  const exRace = _ex(F.ex, { L: k.L * 0.7, lp: k.lp * (dz ? 2.2 : 3.4), g: k.g * 1.28, jet: dz ? 0.3 : 0.5, rasp: dz ? 0.3 : 0.4 });
  exCat.tips = 1; exRace.tips = 1;
  return { fam, nome: F.nome, voice, ex, exCat, exRace, inStock: Object.assign({}, F.in), ieK: F.ieK * (0.95 + 0.1 * (cc / 1600)) * (T.ieK || 1), shiftK: F.shiftK, hesK: F.hesK };
}
if (typeof window !== 'undefined') Object.assign(window, { SUONI_FAM, suonoFamiglia, suonoDi });
