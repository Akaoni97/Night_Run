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
if (typeof window !== 'undefined') Object.assign(window, { flameTier, flameStyle, flameVariant, flamePalFor, FLAME_TIERS, FLAME_BIG_RPM });
