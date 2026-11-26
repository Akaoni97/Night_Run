// ============================================================================
//  Night Run · Le fiamme dello scarico secondo il tuning (prima di effetti2d.js)
//  Funzioni pure, provate in test/fiamme.test.js. Il disegno (fxFlame, fxTorch, fxBang) è in effetti2d.js, la scelta
//  del momento in `index.html` (blocco delle fiammate).
//    flameTier(sim, catPop)     quanto è preparata l'auto: 0 leggero, 1 medio, 2 spinto (da potenza, bar del turbo, centralina,
//                               scarico; la mappa ECO / FORTE del turbo conta)
//    flameStyle(tier, kind, rpmFrac, r)   che tipo di fiammata esce (rpmFrac non serve più: i 5.000 giri li decide il kind):
//        'torch'  OSSIDRICA   getto sottile, veloce, blu-bianco, con i «diamanti» del getto e scintille incandescenti
//        'free'   LIBERA      la fiammata larga di sempre (arancio, gialla, a volte blu alla radice), in quattro versioni
//        'bang'   BOTTO       niente fiamma: un piccolo scoppio quasi circolare dietro il tubo
//        'big'    GROSSA      la bella fiammata: libera e grande, con l'anello d'urto (e l'ossidrica insieme, nello spinto)
//    kind = in che momento: 'limiter' (taglio d'accensione), 'lift' (rilascio sotto i 5.000 giri), 'liftHigh' (rilascio sopra), 'shift' (cambiata)
//    marmittaPasso / marmittaRossa   il terminale che si arroventa tenendo i giri alti (MARMITTA)
//    FIAMME_KIT, fiammeKit, fiammeMonta, fiammeScegli, fiammePal   i kit delle fiamme di Luca Tuning (v0.143, scheda Fiamme)
//  Leggero: soprattutto botti. Medio: fiammate libere, diverse tra loro. Spinto: ossidrica, e fiamma libera quando si rilascia
//  ai giri medi; qualche botto nelle cambiate.
// ============================================================================
const FLAME_TIERS = ['leggero', 'medio', 'spinto'];
function flameTier(sim, catPop) {
  const tn = (sim && sim.tune) || {}, tc = tn.turbo || {}, boost = (tc.max || 0) * ((sim && sim.boostCtl) || 1);
  const score = ((tn.pw || 1) - 1) * 5 + (((sim && sim.extraPw) || 1) - 1) * 5 + boost * 0.55 + (tn.sparkCut ? 0.45 : 0) + (tn.ecuPops ? 0.25 : 0) + Math.max(0, (catPop || 0) - 1) * 0.8;
  return { score, tier: score >= 2 ? 2 : score >= 0.5 ? 1 : 0 };
}
const FLAME_BIG_RPM = 5000;                                                     // rilascio sopra questi giri: una bella fiammata grossa
const FLAME_W = [[0, 0.12, 0.88, 0], [0.14, 0.64, 0.22, 0], [0.56, 0.28, 0.16, 0]];    // limitatore e cambiate, per livello: [ossidrica, libera, botto, grossa]
function flameStyle(tier, kind, rpmFrac, r) {
  const t = Math.max(0, Math.min(2, tier | 0));
  let w;
  if (kind === 'liftHigh') w = [[0, 0.15, 0.6, 0.25], [0, 0.25, 0.1, 0.65], [0.25, 0.1, 0.05, 0.6]][t];     // rilascio sopra i 5.000 giri: la grossa
  else if (kind === 'lift') w = [[0, 0.12, 0.88, 0], [0.04, 0.86, 0.1, 0], [0.12, 0.8, 0.08, 0]][t];       // rilascio sotto i 5.000: fiamme di livello medio
  else {
    w = FLAME_W[t].slice();
    if (kind === 'limiter') { w[0] *= 1.5; w[2] *= 0.5; }
    else if (kind === 'shift') { w[2] *= 1.6; w[0] *= 0.7; }
  }
  let x = r * (w[0] + w[1] + w[2] + w[3]);
  if ((x -= w[0]) < 0) return 'torch';
  if ((x -= w[1]) < 0) return 'free';
  if ((x -= w[2]) < 0) return 'bang';
  return 'big';
}
// versione della fiamma libera: 0 classica, 1 doppia lingua, 2 lunga e sottile, 3 corta e tozza
function flameVariant(tier, r) {
  const c = tier >= 2 ? [0.5, 0.7, 1, 1] : tier === 1 ? [0.35, 0.6, 0.85, 1] : [0.45, 0.6, 0.7, 1];
  return r < c[0] ? 0 : r < c[1] ? 1 : r < c[2] ? 2 : 3;
}
// colore della fiamma libera: spinto blu alla radice (magra), medio arancio e giallo, leggero arancio
function flamePalFor(tier, r) {
  if (tier >= 2) return r < 0.7 ? 'blu' : 'arancio';
  if (tier === 1) return r < 0.45 ? 'arancio' : r < 0.85 ? 'gialla' : 'blu';
  return 'arancio';
}
// ---------------------------------------------------------------- marmitta rovente
// Tenendo il gas negli ultimi MARMITTA.banda giri prima del limitatore (limitatore compreso) lo scarico si scalda: dopo
// `inizio` secondi il terminale comincia a diventare rosso, a `picco` è incandescente. Per livello dell'auto (flameTier):
// di serie o poco preparata da 13 s a 21 s (passaggio lento, 8 s), media da 9,5 a 15, spinta da 3 a 7 (v0.130). Fuori dal tiro si raffredda (`fredda` secondi di
// calore persi al secondo, più piano dello scaldarsi) e il calore non sale oltre il picco + `margine`: dal massimo il rosso
// si spegne in una decina di secondi.
const MARMITTA = { banda: 1500, gas: 0.5, inizio: [13, 9.5, 3], picco: [21, 15, 7], fredda: 0.6, margine: 1 };
// calore accumulato (in secondi di tiro) dopo dt: o = { rpm, lim (giri del limitatore), gas (pedale 0-1), acceso, tier }
function marmittaPasso(h, dt, o) {
  const t = Math.max(0, Math.min(2, (o && o.tier) | 0)), M = MARMITTA;
  const tira = o && o.acceso && o.gas >= M.gas && o.rpm >= o.lim - M.banda;
  const top = M.picco[t] + M.margine;
  const n = tira ? Math.min(top, (h || 0) + dt) : Math.max(0, Math.min(top, h || 0) - dt * M.fredda);
  return n;
}
// quanto è rosso il terminale (0 freddo, 1 incandescente), con una curva morbida tra inizio e picco
function marmittaRossa(h, tier) {
  const t = Math.max(0, Math.min(2, tier | 0)), a = MARMITTA.inizio[t], b = MARMITTA.picco[t];
  const u = Math.max(0, Math.min(1, ((h || 0) - a) / (b - a)));
  return u * u * (3 - 2 * u);
}
// ---------------------------------------------------------------- i kit delle fiamme (Da Luca Tuning, scheda Fiamme)
// Il kit decide che fiamme escono dallo scarico, su qualunque auto: come i kit veri (candela nello scarico) le fa uscire anche
// da un'auto di serie, al rilascio e al limitatore. Si compra una volta e resta tuo; si monta auto per auto (gratis).
// w = pesi [ossidrica, libera, botto, grossa]; pal = colore (o colori a caso); len = fiamma libera più lunga; rate = più fitte.
// Stato in game.s.fiamme = { own: { id: true }, mont: { auto: id } }. Senza kit (o «come viene») tutto come prima.
const FIAMME_KIT = [
  { id: 'serie', nome: 'Come viene', prezzo: 0, testo: 'Le fiamme le decide la preparazione: botti sull\'auto poco toccata, fiammate libere sulla media, ossidrica blu sulla spinta. Su un\'auto di serie niente fiamme.' },
  { id: 'ossidrica', nome: 'Ossidrica blu', prezzo: 1800, w: [0.8, 0, 0.08, 0.12], pal: 'blu', tipi: { torch: 0.55, drag: 0.45 }, testo: 'Getto sottile e dritto, blu col cuore bianco e i «diamanti». Secco al limitatore, una lama al rilascio.' },
  { id: 'lancia', nome: 'Lanciafiamme', prezzo: 2600, w: [0, 0.5, 0, 0.5], pal: ['arancio', 'gialla'], len: 1.7, rate: 1.2, tipi: { drago: 0.75, race: 0.25 }, testo: 'Fiammata lunga e piena, arancio e gialla, con l\'anello d\'urto. Al rilascio sopra i 5.000 giri sembra un drago.' },
  { id: 'mitraglia', nome: 'Mitraglia', prezzo: 1500, w: [0, 0.1, 0.9, 0], pal: 'arancio', rate: 2.2, tipi: { mitraglia: 0.8, tuner: 0.2 }, testo: 'Poca fiamma e tanti botti a raffica, con le scintille. Al limitatore fa la mitragliatrice.' },
  { id: 'smeraldo', nome: 'Smeraldo', prezzo: 3200, w: [0, 0.75, 0.05, 0.2], pal: 'verde', tipi: { drag: 0.25, tuner: 0.25, race: 0.25, rally: 0.25 }, testo: 'Fiamme verdi, come quelle dei sali di rame. Alla Sosta 24 te le fotografano.' },
  { id: 'neon', nome: 'Neon viola', prezzo: 3600, w: [0, 0.75, 0.05, 0.2], pal: ['viola', 'viola', 'blu'], tipi: { tuner: 0.3, drag: 0.3, race: 0.2, rally: 0.2 }, testo: 'Fiamma viola e rosa con qualche lingua blu: si sposa col neon di Russian Kùstòm.' },
];
const fiammeDi = (id) => FIAMME_KIT.find((k) => k.id === id) || null;
// il kit montato sull'auto (null = «come viene»)
function fiammeKit(s, car) {
  const f = s && s.fiamme, id = f && f.mont && f.mont[car], k = fiammeDi(id);
  return k && k.id !== 'serie' ? k : null;
}
// compra (se non è tuo) e monta. gratis = partita libera. Dice { ok, why, spesa }
function fiammeMonta(s, car, id, gratis) {
  const k = fiammeDi(id); if (!k || !s) return { ok: false, why: 'Kit sconosciuto' };
  const f = s.fiamme || (s.fiamme = { own: {}, mont: {} }); f.own = f.own || {}; f.mont = f.mont || {};
  const mio = k.prezzo === 0 || f.own[id];
  if (!mio && !gratis && (s.money || 0) < k.prezzo) return { ok: false, why: `Mancano € ${Math.ceil(k.prezzo - (s.money || 0)).toLocaleString('it-IT')}` };
  const spesa = mio || gratis ? 0 : k.prezzo;
  s.money = (s.money || 0) - spesa; if (k.prezzo) f.own[id] = true;
  if (id === 'serie') delete f.mont[car]; else f.mont[car] = id;
  return { ok: true, spesa };
}
// che fiammata esce col kit: come flameStyle, ma coi pesi del kit (al rilascio sopra i 5.000 giri la grossa conta il doppio)
function fiammeScegli(kit, tier, kind, r) {
  if (!kit || !kit.w) return flameStyle(tier, kind, 0.6, r);
  const w = kit.w.slice();
  if (kind === 'liftHigh') w[3] *= 2;
  else if (kind === 'limiter') { w[0] *= 1.3; w[2] *= 1.2; }
  let x = r * (w[0] + w[1] + w[2] + w[3]);
  if ((x -= w[0]) < 0) return 'torch';
  if ((x -= w[1]) < 0) return 'free';
  if ((x -= w[2]) < 0) return 'bang';
  return 'big';
}
// il colore della fiamma col kit (null = quello di sempre)
function fiammePal(kit, r) {
  if (!kit || !kit.pal) return null;
  return Array.isArray(kit.pal) ? kit.pal[Math.min(kit.pal.length - 1, Math.floor(r * kit.pal.length))] : kit.pal;
}

// ---------------------------------------------------------------- i caratteri delle fiamme (v0.169)
// Prima ogni fiammata era la stessa lingua dritta, cambiava solo il colore. Ora ogni fiammata è una SCENA che dura qualche
// decimo di secondo e cambia forma mentre vive (nasce alla bocca, si gonfia, si stacca dal tubo e se ne va, si sfrangia),
// con un carattere preso dalle fiamme vere delle auto preparate:
//   burble     borbottio a gas mollato: lingue basse, blu alla radice e arancio in punta, piccole, a sbuffi (auto quasi di serie)
//   tuner      crackle da strada: raffica di 2-5 scoppietti gialli e arancio, ognuno con la sua direzione e la sua misura
//   rally      anti-lag da Gruppo B: lingua larga e a brandelli che sale, pezzi di fuoco che volano, doccia di scintille, spesso un secondo e un terzo sparo
//   drag       fiammata di cambiata / 2-step: foglio lungo e sottile, blu alla radice e arancio in punta, coi diamanti, che pulsa
//   race       botto da supercar: palla di fuoco corta e larga, spigolosa, con la stella di raggi e l'anello d'urto
//   drago      lanciafiamme (kit): fuoco lunghissimo che ribolle e sale a grumi
//   mitraglia  raffica fittissima di scoppietti minuscoli (kit)
//   torch      ossidrica (resta quella di sempre, in effetti2d.js)
// fiammaTipo sceglie il carattere (livello, momento, turbo, kit); fiammaCopione scrive la scena: gli «spari» (pops) con tempi,
// lunghezze, spessori, direzione e quello che lanciano (scintille, grumi, fuliggine). Il disegno è in fiamme2d.js.
const FIAMME_TIPI = ['burble', 'tuner', 'rally', 'drag', 'race', 'torch', 'drago', 'mitraglia'];
// pesi per livello (0 leggero, 1 medio, 2 spinto) e momento: [burble, tuner, rally, drag, race, torch]
const FT_PESI = {
  0: { lift: [0.75, 0.25, 0, 0, 0, 0], liftHigh: [0.5, 0.5, 0, 0, 0, 0], limiter: [0.3, 0.7, 0, 0, 0, 0], shift: [0.4, 0.6, 0, 0, 0, 0] },
  1: { lift: [0.2, 0.6, 0.2, 0, 0, 0], liftHigh: [0, 0.35, 0.3, 0, 0.35, 0], limiter: [0, 0.45, 0, 0.2, 0.35, 0], shift: [0, 0.4, 0, 0.6, 0, 0] },
  2: { lift: [0, 0.2, 0.45, 0, 0.2, 0.15], liftHigh: [0, 0, 0.4, 0.15, 0.25, 0.2], limiter: [0, 0, 0.15, 0.35, 0.2, 0.3], shift: [0, 0.15, 0, 0.65, 0, 0.2] },
};
// ctx = { turbo: l'auto ha il turbo } : l'anti-lag è roba da turbo, il botto secco da aspirato
function fiammaTipo(tier, kind, kit, ctx, r) {
  let nomi, w;
  if (kit && kit.tipi) { nomi = Object.keys(kit.tipi); w = nomi.map((n) => kit.tipi[n]); }
  else {
    const t = Math.max(0, Math.min(2, tier | 0)), tab = FT_PESI[t][kind] || FT_PESI[t].lift;
    nomi = FIAMME_TIPI.slice(0, 6); w = tab.slice();
    const turbo = !ctx || ctx.turbo !== false;
    w[2] *= turbo ? 1.7 : 0.35; w[4] *= turbo ? 0.75 : 1.4;
  }
  const tot = w.reduce((a, b) => a + b, 0) || 1;
  let x = r * tot;
  for (let i = 0; i < nomi.length; i++) if ((x -= w[i]) < 0) return nomi[i];
  return nomi[nomi.length - 1];
}
// colore naturale del carattere (il kit, se ce l'ha, comanda)
function fiammaPalTipo(tipo, kit, r) {
  const k = fiammePal(kit, r); if (k) return k;
  if (tipo === 'drag') return 'blu';
  if (tipo === 'burble') return r < 0.55 ? 'blu' : 'arancio';
  if (tipo === 'tuner') return r < 0.5 ? 'gialla' : r < 0.85 ? 'arancio' : 'blu';
  if (tipo === 'race') return r < 0.7 ? 'gialla' : 'blu';
  return r < 0.65 ? 'arancio' : 'gialla';                                        // rally, drago, mitraglia
}
const FIAMMA_POP = { t: 0, d: 0.15, len: 20, th: 3, ang: 0, bulb: 1.3, grow: 0.3, detach: 0.55, taper: 0.8, rag: 0, curl: 0.5, wob: 1, diam: 0, cone: 0, jag: 0,
  flick: 0, cut: 0, sparks: 0, sparkV: 1, clumps: 0, soot: 0, ring: 0, star: 0, luce: 1 };
// la scena: { tipo, dur, cool (secondi prima della prossima), pops: [...] }. rn() = numeri a caso in [0,1) (nei test, un generatore con seme)
function fiammaCopione(tipo, tier, rn) {
  const pop = (t, o) => Object.assign({}, FIAMMA_POP, { t }, o);
  const pops = []; let cool = 0.2, t = 0;
  const fine = () => pops.reduce((m, p) => Math.max(m, p.t + p.d), 0);
  if (tipo === 'burble') {
    const n = 3 + Math.floor(rn() * 4);
    for (let i = 0; i < n; i++) { pops.push(pop(t, { d: 0.12 + 0.08 * rn(), len: 5 + 7 * rn(), th: 1.5 + 1.2 * rn(), ang: (rn() - 0.5) * 0.2, bulb: 1.3, grow: 0.3, detach: 0.6, rag: 0.25, curl: 0.5 + rn() * 0.4, cut: 0.35, luce: 0.3 })); t += 0.05 + 0.08 * rn(); }
    cool = 0.1 + 0.12 * rn();
  } else if (tipo === 'tuner') {
    const n = 2 + Math.floor(rn() * 3) + (tier >= 2 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const g = i === 0 ? 0.6 + 0.4 * rn() : 0.3 + 0.7 * rn();
      pops.push(pop(t, { d: 0.1 + 0.07 * rn(), len: 9 + 16 * g, th: 2.4 + 2.2 * g, ang: (rn() - 0.5) * 0.28, bulb: 1.5, grow: 0.28, detach: 0.42, rag: 0.45,
        curl: 0.7 + rn() * 0.6, wob: 1.3, jag: 0.12, cut: rn() < 0.25 ? 0.35 : 0, sparks: g > 0.6 ? 2 + Math.floor(rn() * 3) : Math.floor(rn() * 2), soot: i === 0 ? 1 : 0, luce: 0.5 + 0.5 * g }));
      t += 0.035 + 0.07 * rn();
    }
    cool = 0.16 + 0.2 * rn();
  } else if (tipo === 'rally') {
    pops.push(pop(0, { d: 0.3 + 0.14 * rn(), len: 46 + 26 * rn(), th: 5.5 + 3 * rn(), bulb: 1.4, grow: 0.22, detach: 0.34, taper: 0.6, rag: 0.8, curl: 1.2, wob: 1.6, jag: 0.1,
      sparks: 10 + Math.floor(rn() * 10), sparkV: 1.2, clumps: 5 + Math.floor(rn() * 6), soot: 1, ring: rn() < 0.6 ? 1 : 0, luce: 1 }));
    t = 0.09 + 0.07 * rn();
    pops.push(pop(t, { d: 0.2 + 0.08 * rn(), len: 28 + 14 * rn(), th: 4 + 2 * rn(), ang: (rn() - 0.5) * 0.2, bulb: 1.3, grow: 0.25, detach: 0.4, taper: 0.7, rag: 0.7, curl: 1, wob: 1.4, sparks: 5, clumps: 2, luce: 0.8 }));
    if (rn() < 0.4) pops.push(pop(t + 0.1 + 0.06 * rn(), { d: 0.16, len: 16 + 10 * rn(), th: 3 + rn(), ang: (rn() - 0.5) * 0.3, bulb: 1.4, rag: 0.6, curl: 0.9, sparks: 3, luce: 0.6 }));
    cool = 0.14 + 0.16 * rn();
  } else if (tipo === 'drag') {
    pops.push(pop(0, { d: 0.3 + 0.22 * rn(), len: 70 + 38 * rn(), th: 2.3 + 0.9 * rn(), bulb: 1.2, grow: 0.16, detach: 0.82, taper: 0.55, rag: 0.1, curl: 0.25, wob: 0.6,
      diam: 4, flick: 22 + rn() * 10, cut: 0.42, sparks: 2 + Math.floor(rn() * 3), luce: 1 }));
    if (rn() < 0.6) pops.push(pop(pops[0].d * 0.8, { d: 0.12 + 0.05 * rn(), len: 22 + 14 * rn(), th: 1.8 + 0.6 * rn(), bulb: 1.4, grow: 0.3, detach: 0.5, rag: 0.3, curl: 0.5, cut: 0.4, sparks: 1, luce: 0.6 }));
    cool = pops[0].d * 0.7;
  } else if (tipo === 'race') {
    pops.push(pop(0, { d: 0.17 + 0.08 * rn(), len: 24 + 12 * rn(), th: 8 + 3 * rn(), cone: 1, bulb: 1.1, grow: 0.24, detach: 0.5, taper: 0.9, rag: 0.3, jag: 0.5, curl: 0.4, wob: 0.5,
      star: 1, ring: 1, sparks: 6 + Math.floor(rn() * 6), soot: 1, luce: 1.2 }));
    if (rn() < 0.5) pops.push(pop(0.1 + 0.05 * rn(), { d: 0.14, len: 14 + 8 * rn(), th: 4 + 2 * rn(), cone: 1, ang: (rn() - 0.5) * 0.3, jag: 0.5, rag: 0.3, sparks: 3, luce: 0.7 }));
    cool = 0.25 + 0.2 * rn();
  } else if (tipo === 'drago') {
    pops.push(pop(0, { d: 0.55 + 0.25 * rn(), len: 92 + 36 * rn(), th: 6 + 2.5 * rn(), bulb: 1.25, grow: 0.34, detach: 0.5, taper: 0.5, rag: 0.5, curl: 2.4, wob: 1.3,
      sparks: 8, clumps: 8, soot: 2, ring: 1, luce: 1.2 }));
    pops.push(pop(0.18 + 0.1 * rn(), { d: 0.4, len: 56 + 20 * rn(), th: 5, ang: 0.08, bulb: 1.3, grow: 0.3, detach: 0.45, rag: 0.55, curl: 2.8, wob: 1.5, clumps: 4, sparks: 4, luce: 0.9 }));
    cool = pops[0].d * 0.85;
  } else if (tipo === 'mitraglia') {
    const n = 6 + Math.floor(rn() * 5);
    for (let i = 0; i < n; i++) { pops.push(pop(t, { d: 0.09 + 0.04 * rn(), len: 7 + 9 * rn(), th: 1.8 + 1.4 * rn(), ang: (rn() - 0.5) * 0.4, bulb: 1.6, grow: 0.25, detach: 0.4, rag: 0.3, jag: 0.15, curl: 0.5, sparks: 2 + Math.floor(rn() * 2), luce: 0.5 })); t += 0.045 + 0.04 * rn(); }
    cool = fine() * 0.9;
  } else return null;
  const dur = fine() + 0.04;
  return { tipo, dur, cool: Math.max(cool, 0.08), pops };
}
// generatore con seme (mulberry32): per le prove e per riprodurre una scena
function fiammaRnd(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
if (typeof window !== 'undefined') Object.assign(window, { flameTier, flameStyle, flameVariant, flamePalFor, FLAME_TIERS, FLAME_BIG_RPM, MARMITTA, marmittaPasso, marmittaRossa, FIAMME_KIT, fiammeKit, fiammeMonta, fiammeScegli, fiammePal, FIAMME_TIPI, fiammaTipo, fiammaPalTipo, fiammaCopione, fiammaRnd });
