// ============================================================================
//  Night Run · Il personaggio (prima di pilota2d.js e di prologo.js)
//  L'aspetto del protagonista, scelto in un piccolo editor prima del prologo (e cambiabile dal menu, scheda Partita):
//  pelle, capelli (taglio e colore), cosa porta in testa, cosa indossa, barba, occhiali. Lo stesso personaggio si vede
//  nel prologo (in piedi, di spalle) e in auto per tutto il viaggio (pilota2d.js usa pgDriver).
//  Stato: game.s.vg.pg (con la partita) e localStorage nr_pg (l'ultimo scelto, per le modalità libere).
//  Disegno:
//  - pgDriver(x, P): la figura in auto in "unità del finestrino" (le stesse di drawDriver), con i movimenti: testa che
//    gira (P.turn), occhi che sbattono (P.blink), respiro (P.breath), mano che segue il volante (P.steer), gomito
//    fuori dal finestrino (P.elbow), spalle che si muovono al cambio marcia (P.shiftK)
//  - pgStanding(g, x, y, s, ph, walking, look, light): in piedi di profilo (80 px a scala 1), anche mentre cammina
//  - pgBack(g, x, y, t, look): seduto di spalle, in primo piano
//  - NightPG.editor({ onDone, titolo }) apre l'editor; NightPG.get() / NightPG.set(look)
// ============================================================================
const PG_PELLE = ['#f1c9a8', '#e2ae88', '#d29a72', '#a8714c', '#74492f'];
const PG_COL_CAPELLI = ['#141010', '#3a2414', '#6e4422', '#b8873e', '#ddd0a0', '#8c8c8c'];
const PG_COL_TESTA = ['#a81e24', '#1d2c52', '#1c1c22', '#2e6a3a', '#e6e2d8', '#d8a020'];
const PG_COL_SOPRA = ['#2b3348', '#1b1b20', '#5e2a22', '#2e4a34', '#6a6a74', '#7a5636'];
// le scelte dell'editor: chiave, nome, valori (id, nome) o colori
const PG_OPZ = [
  { k: 'pelle', nome: 'Pelle', col: PG_PELLE },
  { k: 'capelli', nome: 'Capelli', v: [['corti', 'Corti'], ['rasati', 'Rasati'], ['lunghi', 'Lunghi'], ['ricci', 'Ricci'], ['coda', 'Coda']] },
  { k: 'capCol', nome: 'Colore dei capelli', col: PG_COL_CAPELLI },
  { k: 'testa', nome: 'In testa', v: [['cappellino', 'Cappellino'], ['rovescio', 'Al contrario'], ['berretto', 'Berretto'], ['niente', 'Niente']] },
  { k: 'testaCol', nome: 'Colore', col: PG_COL_TESTA, se: (L) => L.testa !== 'niente' },
  { k: 'sopra', nome: 'Addosso', v: [['giubbotto', 'Giubbotto'], ['felpa', 'Felpa'], ['pelle', 'Giacca di pelle'], ['camicia', 'Camicia a quadri']] },
  { k: 'sopraCol', nome: 'Colore', col: PG_COL_SOPRA },
  { k: 'barba', nome: 'Barba', v: [['no', 'No'], ['corta', 'Corta'], ['piena', 'Piena']] },
  { k: 'occhiali', nome: 'Occhiali', v: [['no', 'No'], ['vista', 'Da vista'], ['sole', 'Da sole']] },
];
// il protagonista di sempre: cappellino rosso, giubbotto blu, capelli corti scuri
const PG_X = ['canotta', 'tatuaggi', 'muscoli', 'catena', 'pazzo', 'barbone', 'abito'];
const PG_DEF = { pelle: 2, capelli: 'corti', capCol: 0, testa: 'cappellino', testaCol: 0, sopra: 'giubbotto', sopraCol: 0, barba: 'no', occhiali: 'no' };

// un aspetto sempre valido (valori sconosciuti o mancanti tornano quelli di partenza)
function pgNorm(L) {
  const o = Object.assign({}, PG_DEF);
  if (L && typeof L === 'object') for (const q of PG_OPZ) {
    const v = L[q.k];
    if (q.col ? Number.isInteger(v) && v >= 0 && v < q.col.length : q.v.some((x) => x[0] === v)) o[q.k] = v;
  }
  // tratti speciali dei personaggi del gioco (non nell'editor): L.x = { canotta, tatuaggi, muscoli, catena, pazzo, barbone, abito }
  if (L && L.x && typeof L.x === 'object') { const x = {}; for (const k of PG_X) if (L.x[k]) x[k] = true; if (Object.keys(x).length) o.x = x; }
  return o;
}
function pgRandom(rnd = Math.random) {
  const o = {}; for (const q of PG_OPZ) o[q.k] = q.col ? Math.floor(rnd() * q.col.length) : q.v[Math.floor(rnd() * q.v.length)][0];
  return pgNorm(o);
}
// schiarisce (f > 0) o scurisce (f < 0) un colore #rrggbb
function pgShade(hex, f) {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f));
  return '#' + c.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}
// i colori del personaggio; dk = quanto è in ombra (di notte in auto)
function pgColors(L, dk = 0) {
  L = pgNorm(L); const sh = (h, f) => pgShade(h, f - dk);
  const skin = PG_PELLE[L.pelle], top = L.sopra === 'pelle' && L.sopraCol === 0 ? '#1d1a1c' : PG_COL_SOPRA[L.sopraCol], hat = PG_COL_TESTA[L.testaCol];
  return {
    skin: sh(skin, 0), skinSh: sh(skin, -0.24), hair: sh(PG_COL_CAPELLI[L.capCol], 0), hairHi: sh(PG_COL_CAPELLI[L.capCol], 0.22),
    cap: sh(hat, 0), capHi: sh(hat, 0.28), capSh: sh(hat, -0.3),
    jacket: sh(top, 0), jacketHi: sh(top, L.sopra === 'pelle' ? 0.42 : 0.3), jacketSh: sh(top, -0.32), check: sh(top, 0.45),
  };
}

// ---------------------------------------------------------------- in auto (unità del finestrino, vedi pilota2d.js)
// P: { cx, cy (testa), sx (spalla), wx, wy (volante), C (colori di pgColors), look, turn, blink, breath, steer, elbow, shiftK,
//      sleepy (0..1: occhi pesanti), yawn (0..1: sbadiglio), sing (canticchia con la radio) }
function pgDriver(x, P) {
  const L = pgNorm(P.look), C = P.C, { cx, sx } = P, br = (P.breath || 0) * 0.35, cy = P.cy - br * 0.5, sk = P.shiftK || 0;
  const el = (ex, ey, rx, ry, col) => { x.fillStyle = col; x.beginPath(); x.ellipse(ex, ey, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2); x.fill(); };
  const poly = (pts, col) => { x.fillStyle = col; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) x.lineTo(p[0], p[1]); x.closePath(); x.fill(); };
  const line = (pts, col, wd) => { x.strokeStyle = col; x.lineWidth = wd; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) x.lineTo(p[0], p[1]); x.stroke(); };
  const ty = P.cy - br + sk * 0.5;                                                       // spalle: respiro e cambio marcia
  // capelli lunghi: scendono dietro sulle spalle, prima del busto
  if (L.capelli === 'lunghi') poly([[cx - 4.3, cy - 1], [cx - 1.6, cy - 1], [cx - 1.2, cy + 7.5], [cx - 4.8, cy + 8.2]], C.hair);
  // busto e spalla
  poly([[sx - 6.5, ty + 6.2], [sx - 2, ty + 4.8], [sx + 3.6, ty + 5.6], [sx + 6, ty + 18], [sx - 7.4, ty + 18]], C.jacket);
  line([[sx - 6.5, ty + 6.2], [sx - 2, ty + 4.8], [sx + 3.6, ty + 5.6], [sx + 6, ty + 18]], 'rgba(8,8,14,.7)', 0.35);   // contorno: lo stacca dai sedili
  if (L.sopra === 'camicia') { x.save(); x.beginPath(); x.moveTo(sx - 6.5, ty + 6.2); x.lineTo(sx - 2, ty + 4.8); x.lineTo(sx + 3.6, ty + 5.6); x.lineTo(sx + 6, ty + 18); x.lineTo(sx - 7.4, ty + 18); x.closePath(); x.clip();
    for (let q = -8; q < 8; q += 2.2) { line([[sx + q, ty + 4], [sx + q, ty + 18]], C.check, 0.35); line([[sx - 8, ty + 6 + (q + 8) * 0.8], [sx + 7, ty + 6 + (q + 8) * 0.8]], C.jacketSh, 0.3); } x.restore(); }
  line([[sx - 1.5, ty + 5], [sx + 3.4, ty + 5.8], [sx + 5.6, ty + 17]], C.jacketHi, L.sopra === 'pelle' ? 0.8 : 0.55);   // bordo in luce (la pelle luccica)
  if (L.sopra === 'felpa') { el(sx - 3.6, ty + 5.4, 2.6, 1.7, C.jacket); line([[sx - 5.8, ty + 4.8], [sx - 1.6, ty + 4.4]], C.jacketHi, 0.4); line([[sx + 0.6, ty + 6], [sx + 0.9, ty + 10]], C.check, 0.3); }   // cappuccio e laccio
  else if (L.sopra === 'camicia') poly([[sx - 1.6, ty + 4.6], [sx + 1.8, ty + 5], [sx + 0.6, ty + 7.4]], C.check);   // colletto
  else line([[sx - 0.5, ty + 5.2], [sx + 0.8, ty + 8.2]], C.jacketSh, 0.45);                                       // bavero
  // braccio: sul volante (la mano segue lo sterzo) o col gomito fuori dal finestrino abbassato
  const wx = P.wx, wy = P.wy;
  if (P.elbow > 0.5) {
    line([[sx + 1.6, ty + 7.5], [sx + 6.4, ty + 10.6], [sx + 9.8, ty + 9.6]], C.jacket, 2.5);
    line([[sx + 2.4, ty + 6.8], [sx + 6.8, ty + 9.8], [sx + 9.6, ty + 8.9]], C.jacketHi, 0.5);
    el(sx + 10.4, ty + 9.3, 1.3, 1.1, C.skin);
  } else {
    const hy = wy + 0.3 + (P.steer || 0) * 2.2, hx = wx - 1.1 - Math.abs(P.steer || 0) * 0.3;
    line([[sx + 1.6, ty + 7.5], [sx + 6.6, ty + 13.2 + (P.steer || 0) * 0.6], [hx - 0.7, hy + 0.5]], C.jacket, 2.5);
    line([[sx + 2.4, ty + 6.8], [sx + 7.2, ty + 12.4 + (P.steer || 0) * 0.6], [hx - 0.9, hy - 0.3]], C.jacketHi, 0.5);
    el(hx, hy, 1.4, 1.1, C.skin);
  }
  // collo e testa. turn > 0 gira la testa verso di noi (si vede più viso), turn < 0 verso l'altro finestrino
  const f = Math.max(-1, Math.min(1, P.turn || 0)), fp = Math.max(0, f), fn = Math.max(0, -f);
  poly([[cx - 1.3, cy + 2.4], [cx + 1.6, cy + 2.4], [cx + 1.9, cy + 5.6], [cx - 1.6, cy + 5.6]], C.skinSh);
  x.strokeStyle = 'rgba(8,8,14,.75)'; x.lineWidth = 0.4; x.beginPath(); x.ellipse(cx, cy, 3.75, 4.25, 0, 0, Math.PI * 2); x.stroke();   // contorno della testa
  el(cx, cy, 3.6, 4.1, C.skin);
  el(cx - 1.3 - fp * 0.6 + fn * 0.4, cy + 0.4, 2.4 - fp * 0.8, 3.8, C.skinSh);                                    // guancia in ombra verso dietro
  const nx = cx + 3.2 - fp * 1.3 - fn * 0.5, nl = 1.3 * (1 - fp * 0.4);
  poly([[nx, cy - 0.8], [nx + nl, cy + 1.2], [nx + 0.1, cy + 1.6]], C.skin);                                     // naso
  const ex = cx + 2.3 - fp * 1.5 - fn * 0.4, ey = cy - 0.6 + (P.lookUp || 0) * -0.3;
  const sl = P.sleepy || 0;
  const eye = (xx) => {
    if (P.blink) { line([[xx - 0.45, ey], [xx + 0.45, ey]], '#1a1414', 0.3); return; }
    el(xx, ey, 0.5, 0.42, '#f2ece2'); el(xx + 0.12, ey, 0.32, 0.36, '#1a1414');                                    // bianco e pupilla
    if (sl > 0.35) poly([[xx - 0.6, ey - 0.5], [xx + 0.6, ey - 0.5], [xx + 0.6, ey - 0.45 + sl * 0.5], [xx - 0.6, ey - 0.45 + sl * 0.5]], C.skinSh);   // palpebra pesante
  };
  line([[ex - 0.6, ey - 0.95 - (P.yawn || 0) * 0.3], [ex + 0.8, ey - 0.85 - (P.yawn || 0) * 0.3]], C.hair, 0.42);                    // sopracciglio
  const my = cy + 2.5, mx = nx - 0.6;
  if ((P.yawn || 0) > 0.05) el(mx, my + 0.2, 0.55, 0.3 + P.yawn * 0.75, '#3a1416');                               // sbadiglio
  else if (P.sing) el(mx, my, 0.45, 0.32, '#4a1a1c');                                                                   // canticchia
  else line([[mx - 0.5, my], [mx + 0.45, my - 0.05]], pgShade(C.skinSh, -0.2), 0.3);                                   // bocca chiusa
  if (fn < 0.6) eye(ex);
  if (fp > 0.45) eye(ex - 2.1);                                                                                   // si vede anche l'altro occhio
  el(cx - 0.7 - fp * 0.9 + fn * 0.8, cy + 0.6, 0.9, 1.3, pgShade(C.skinSh, -0.15));                              // orecchio
  // barba: corta = ombra sulla mascella, piena = barba vera e baffi
  if (L.barba !== 'no') {
    x.save(); x.globalAlpha = L.barba === 'corta' ? 0.42 : 1;
    poly([[cx - 1.4, cy + 0.9], [cx + 3.4 - fp, cy + 1.9], [cx + 2.8 - fp, cy + 4.1], [cx + 0.4, cy + 4.4], [cx - 1.6, cy + 3]], C.hair);
    if (L.barba === 'piena') line([[nx - 0.4, cy + 1.9], [nx + 0.8, cy + 2.1]], C.hair, 0.5);
    x.restore();
  }
  // occhiali
  if (L.occhiali !== 'no') {
    const gx = ex - 0.95, gy = ey - 0.65;
    if (L.occhiali === 'sole') { x.fillStyle = '#08080c'; x.fillRect(gx, gy, 2, 1.3); x.fillStyle = 'rgba(160,200,255,.5)'; x.fillRect(gx + 0.3, gy + 0.2, 0.6, 0.3); }
    else { x.strokeStyle = '#1a1a1e'; x.lineWidth = 0.28; x.strokeRect(gx, gy, 2, 1.3); }
    line([[gx, gy + 0.4], [cx - 0.4 - fp * 0.9, cy + 0.1]], '#1a1a1e', 0.28);                                      // stanghetta fino all'orecchio
  }
  // capelli e testa: prima i capelli, poi quello che si porta in testa
  const hat = L.testa !== 'niente';
  const nape = () => poly([[cx - 3.6, cy - 0.8], [cx - 3.9, cy + 2.6], [cx - 2.1, cy + 3.4], [cx - 2.2, cy - 0.8]], C.hair);
  if (L.capelli === 'rasati') { x.save(); x.globalAlpha = 0.55; nape(); x.restore(); }
  else if (L.capelli === 'ricci') { nape(); for (const [a, b] of [[-3.8, -0.2], [-3.5, 1.4], [-3, 2.8], [-2.6, -1.4]]) el(cx + a, cy + b, 1.05, 1, C.hair); }
  else nape();
  if (L.capelli === 'coda') { el(cx - 4.9, cy + 1.2, 1.5, 0.9, C.hair); el(cx - 5.6, cy + 2.4, 0.8, 1.6, C.hair); x.fillStyle = C.cap; x.fillRect(cx - 4.3, cy + 0.6, 0.6, 1); }
  if (!hat) {   // la testa scoperta: capelli sopra
    const top = L.capelli === 'rasati' ? 0.55 : 1; x.save(); x.globalAlpha = top;
    poly([[cx - 3.9, cy - 0.4], [cx - 3.5, cy - 3.4], [cx - 0.6, cy - 4.6 - (L.capelli === 'ricci' ? 0.8 : 0)], [cx + 2.4, cy - 4.1], [cx + 3.3, cy - 2.2], [cx + 1.6, cy - 2.6], [cx - 1, cy - 2]], C.hair);
    if (L.capelli === 'ricci') for (const [a, b] of [[-2.6, -4.2], [-0.4, -4.8], [1.8, -4.4], [-3.6, -2.6]]) el(cx + a, cy + b, 1.1, 1, C.hair);
    if (L.capelli !== 'rasati') line([[cx - 2.6, cy - 3.6], [cx + 0.4, cy - 4.3]], C.hairHi, 0.4);
    x.restore();
  } else if (L.testa === 'berretto') {
    el(cx - 0.2, cy - 2.4, 4.1, 3.2, C.cap); poly([[cx - 4.2, cy - 2.1], [cx + 3.6, cy - 2.4], [cx + 3.7, cy - 0.9], [cx - 4.2, cy - 0.4]], C.capSh);
    line([[cx - 2.8, cy - 4.4], [cx + 0.6, cy - 5.3]], C.capHi, 0.5);
  } else {
    line([[cx - 3.9, cy - 0.6], [cx - 3.4, cy - 3.6], [cx - 0.4, cy - 4.9], [cx + 2.7, cy - 4.3], [cx + 3.3, cy - 1.8]], 'rgba(8,8,14,.75)', 0.7);
    poly([[cx - 3.9, cy - 0.6], [cx - 3.4, cy - 3.6], [cx - 0.4, cy - 4.9], [cx + 2.7, cy - 4.3], [cx + 3.3, cy - 1.8]], C.cap);
    line([[cx - 2.8, cy - 3.8], [cx + 0.2, cy - 4.8], [cx + 2.4, cy - 4.3]], C.capHi, 0.55);
    if (L.testa === 'rovescio') poly([[cx - 3.2, cy - 2.4], [cx - 6.8, cy - 1.8], [cx - 6.5, cy - 1.1], [cx - 3.3, cy - 1.4]], C.capSh);   // visiera dietro
    else poly([[cx + 2.4, cy - 2.2], [cx + 6.2, cy - 1.6], [cx + 5.8, cy - 1], [cx + 2.6, cy - 1.3]], C.capSh);                         // visiera
  }
  return { hx: P.elbow > 0.5 ? null : wx };
}

// ---------------------------------------------------------------- in piedi, in pixel art (prologo, editor)
// Il personaggio è disegnato pixel per pixel su una tela piccola (44×86, piedi sulla riga 84, guarda a destra), con le
// ombre dietro, la luce davanti e un contorno scuro calcolato da solo; poi si ingrandisce senza sfumare.
// Pose: 'idle' (respira, sposta il peso, sbatte gli occhi, ogni tanto si guarda indietro), 'walk' (8 fotogrammi),
// 'wave' (saluta), 'phone' (guarda il telefono), 'pockets' (mani in tasca). I disegni finiti restano in cache.
const PG_SW = 44, PG_SH = 86, PG_FOOT = 84;
const PG_CACHE = new Map();
function pgSprite(look, pose, f, blink, light) {
  const L = pgNorm(look), key = JSON.stringify(L) + pose + '|' + f + '|' + (blink ? 1 : 0) + '|' + Math.round((light || 0) * 10);
  if (PG_CACHE.has(key)) return PG_CACHE.get(key);
  if (typeof document === 'undefined') return null;
  if (PG_CACHE.size > 400) PG_CACHE.clear();
  const c = document.createElement('canvas'); c.width = PG_SW; c.height = PG_SH; const g = c.getContext('2d', { willReadFrequently: true });
  pgPaint(g, L, pose, f, blink);
  pgOutline(g, '#0c0a12');
  if (light > 0.02) { g.globalCompositeOperation = 'source-atop'; g.globalAlpha = Math.min(0.5, light); g.fillStyle = '#ffd39a'; g.fillRect(0, 0, PG_SW, PG_SH); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
  PG_CACHE.set(key, c); return c;
}
// contorno di un pixel attorno a tutto quello che è disegnato
function pgOutline(g, col) {
  const w = g.canvas.width, h = g.canvas.height, im = g.getImageData(0, 0, w, h), d = im.data, a = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) a[i] = d[i * 4 + 3] > 40 ? 1 : 0;
  const n = parseInt(col.slice(1), 16), R = n >> 16, G = (n >> 8) & 255, B = n & 255;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x; if (a[i]) continue;
    if ((x > 0 && a[i - 1]) || (x < w - 1 && a[i + 1]) || (y > 0 && a[i - w]) || (y < h - 1 && a[i + w])) { d[i * 4] = R; d[i * 4 + 1] = G; d[i * 4 + 2] = B; d[i * 4 + 3] = 255; }
  }
  g.putImageData(im, 0, 0);
}
function pgPaint(g, L, pose, f, blink) {
  const C = pgColors(L), px = (x, y, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), 1, 1); };
  const rect = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  // un arto: quadratini lungo il segmento (pixel netti)
  const limb = (x0, y0, x1, y1, w, col) => { const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2) + 1; for (let i = 0; i <= n; i++) { const k = i / n; rect(x0 + (x1 - x0) * k - w / 2, y0 + (y1 - y0) * k - w / 2, w, w, col); } };
  const ab = !!(L.x && L.x.abito);                            // abito (il notaio del prologo): pantaloni scuri e scarpe di cuoio
  const jeans = ab ? '#23232e' : '#2a3556', jeansSh = ab ? '#15151c' : '#1c2440', jeansHi = ab ? '#34344a' : '#3d4c78', shoe = ab ? '#120c0a' : '#16141c', sole = ab ? '#2a1c16' : '#c8c0b0';
  // posa: angoli di gambe e braccia (0 = giù dritto, positivo = in avanti), respiro, testa
  const P = { bob: 0, lA: 0, lK: 0, rA: 0, rK: 0, bArm: 0.08, bEl: 0.25, fArm: -0.05, fEl: 0.3, head: 0, eyeDown: 0, mouth: 0, phone: false, pockets: false, wave: 0 };
  if (pose === 'walk') {
    const p = (f % 8) / 8 * Math.PI * 2, s = Math.sin(p);
    Object.assign(P, { lA: s * 0.5, rA: -s * 0.5, lK: Math.max(0, -Math.sin(p + 0.9)) * 0.75, rK: Math.max(0, Math.sin(p + 0.9)) * 0.75, bArm: -s * 0.45, fArm: s * 0.45, bEl: 0.35, fEl: 0.35, bob: Math.abs(Math.cos(p)) > 0.7 ? 0 : 1 });
  } else if (pose === 'wave') { Object.assign(P, { fArm: -2.5, fEl: -0.6 + Math.sin(f * 1.6) * 0.5, mouth: 1, bob: f % 4 < 2 ? 0 : 1 });
  } else if (pose === 'phone') { Object.assign(P, { fArm: -1.05, fEl: 2.45, head: 1, eyeDown: 1, phone: true, bob: f % 4 < 2 ? 0 : 1 });
  } else if (pose === 'pockets') { Object.assign(P, { pockets: true, bArm: 0.12, fArm: 0.15, bob: f % 4 < 2 ? 0 : 1, eyeDown: f % 16 > 12 ? 1 : 0 });
  } else { Object.assign(P, { bob: f % 4 < 2 ? 0 : 1, lA: f % 32 < 16 ? 0.04 : 0, rA: f % 32 < 16 ? 0 : -0.04, eyeDown: f % 24 > 20 ? 1 : 0 }); }
  const B = P.bob, X = 20;                                    // X = asse del corpo
  const hipY = 53 + B, shY = 26 + B;
  // gamba: anca → ginocchio → caviglia, scarpa verso destra
  const leg = (a, k, col, hi) => {
    const kx = X + Math.sin(a) * 14, ky = hipY + Math.cos(a) * 14, sa = a - k, ax = kx + Math.sin(sa) * 14, ay = Math.min(PG_FOOT - 3, ky + Math.cos(sa) * 14);
    limb(X, hipY, kx, ky, 8, jeansSh); limb(kx, ky, ax, ay, 7, jeansSh); limb(X, hipY, kx, ky, 6, col); limb(kx, ky, ax, ay, 5, col); limb(X + 2, hipY + 1, kx + 2, ky, 1, hi);
    rect(ax - 3, ay, 9, 3, shoe); rect(ax - 3, ay + 2, 9, 1, sole); rect(ax + 3, ay - 1, 3, 1, shoe);
  };
  const Xs = L.x || {}, mu = Xs.muscoli ? 2 : 0;                    // tratti speciali (pgNorm): muscoli = braccia e spalle più grosse
  const arm = (a, e, col, hand, sh = C.jacketSh, back = false) => {
    if (Xs.canotta) { col = back ? C.skinSh : C.skin; sh = back ? pgShade(C.skinSh, -0.25) : C.skinSh; }   // braccia nude
    const ex = X + Math.sin(a) * 11, ey = shY + 2 + Math.cos(a) * 11, fa = a + e, hx = ex + Math.sin(fa) * 10, hy = ey + Math.cos(fa) * 10;
    limb(X, shY + 2, ex, ey, 6 + mu, sh); limb(ex, ey, hx, hy, 5 + mu, sh); limb(X, shY + 2, ex, ey, 4 + mu, col); limb(ex, ey, hx, hy, 3 + mu, col);   // bordo scuro: il braccio si stacca dal busto
    if (Xs.tatuaggi && !back) {                                       // tatuaggi su tutto il braccio, a macchie d'inchiostro
      const ink = ['#24345a', '#2a2a3a', '#6a2434'];
      [[0.25, 0], [0.45, 1], [0.6, -1], [0.8, 0]].forEach(([k, o], i) => rect(X + (ex - X) * k + o, shY + 2 + (ey - shY - 2) * k, 2, 1, ink[i % 3]));
      [[0.2, 0], [0.45, 1], [0.7, 0]].forEach(([k, o], i) => rect(ex + (hx - ex) * k + o - 0.5, ey + (hy - ey) * k, 2, 1, ink[(i + 1) % 3]));
      px(ex, ey + 1, ink[2]);
    }
    rect(hx - 1.5, hy - 1, 4, 4, hand); px(hx + 1.5, hy - 1, pgShade(hand, 0.15)); return [hx, hy];
  };
  // dietro: capelli lunghi, gamba e braccio lontani (più scuri)
  if (L.capelli === 'lunghi') rect(X - 9, 6 + B, 6, 26, C.hair);
  if (L.sopra === 'felpa') rect(X - 9, shY - 6, 8, 8, C.jacketSh);                                  // il cappuccio dietro il collo
  leg(P.rA, P.rK, jeansSh, jeansSh);
  if (!P.pockets) arm(P.bArm, P.bEl, C.jacketSh, C.skinSh, C.jacketSh, true); else limb(X - 1, shY + 2, X - 3, shY + 14, 5, C.jacketSh);
  // busto
  let rows = [[-4, 4], [-6, 6], [-7, 7], [-7, 7], [-7, 7], [-7, 7], [-7, 7], [-7, 7], [-7, 7], [-7, 6], [-7, 6], [-7, 6], [-7, 6], [-7, 6], [-7, 6], [-7, 6], [-7, 6], [-7, 6], [-6, 6], [-6, 6], [-6, 6], [-6, 6], [-6, 6], [-6, 6], [-6, 6], [-6, 6], [-6, 6]];
  if (mu) rows = rows.map(([a, b], i) => (i < 12 ? [a - 2, b + 2] : i < 18 ? [a - 1, b + 1] : [a, b]));   // spalle larghe, vita stretta
  rows.forEach(([a, b], i) => { const y = shY + i; rect(X + a, y, b - a + 1, 1, C.jacket); rect(X + a, y, 2, 1, C.jacketSh); rect(X + b - 1, y, 2, 1, C.jacketHi); });
  const tb = shY + rows.length;                                                                     // fondo del busto
  if (Xs.abito) {                                                                                   // abito: camicia bianca a V, cravatta, revers, bottoni
    for (let i = 0; i < 11; i++) rect(X + 1 - Math.floor(i / 3), shY + i, 2 + 2 * Math.floor(i / 3) - (i > 8 ? 2 : 0), 1, '#e6e1d6');
    rect(X + 1, shY + 1, 2, 11, '#7a1c24'); rect(X + 1, shY + 1, 2, 1, '#5a1018'); px(X + 2, shY + 3, '#9a2a34');
    for (let i = 0; i < 9; i++) { px(X - 1 - Math.floor(i / 3), shY + i, C.jacketHi); px(X + 4 + Math.floor(i / 3), shY + i, C.jacketHi); }
    px(X + 2, shY + 14, '#5a5a66'); px(X + 2, shY + 19, '#5a5a66'); rect(X - 5, shY + 9, 3, 1, '#e6e1d6');   // bottoni, fazzoletto nel taschino
  } else if (Xs.canotta) {                                                                          // canotta: spalle e scollo di pelle, due spalline
    rows.slice(0, 6).forEach(([a, b], i) => { rect(X + a, shY + i, 3, 1, C.skin); rect(X + b - 2, shY + i, 3, 1, C.skinSh); });
    rect(X - 2, shY, 6, 4, C.skin); rect(X - 1, shY + 4, 4, 1, C.skin);
  } else if (L.sopra === 'camicia') { for (let y = shY + 1; y < tb; y++) for (let x = X - 6; x <= X + 5; x++) { if ((x - X) % 3 === 0) px(x, y, C.check); else if ((y - shY) % 3 === 0) px(x, y, C.jacketSh); } rect(X + 1, shY, 4, 3, '#e8e2d4'); for (let y = shY + 4; y < tb; y += 4) px(X + 4, y, '#e8e2d4'); }
  else if (L.sopra === 'felpa') { rect(X - 1, shY + 13, 7, 6, C.jacketSh); rect(X, shY + 13, 5, 1, C.jacket); px(X + 3, shY + 2, C.check); px(X + 3, shY + 3, C.check); px(X + 4, shY + 4, C.check); px(X + 4, shY + 5, C.check); }
  else if (L.sopra === 'pelle') { rect(X + 1, shY, 1, rows.length, '#9a9aa4'); rect(X - 1, shY, 6, 3, C.jacketHi); rect(X + 3, shY + 3, 2, 4, C.jacketHi); rect(X + 5, shY + 6, 1, 10, '#5a5662'); }
  else { rect(X + 2, shY + 1, 1, rows.length - 2, C.jacketSh); rect(X - 3, shY - 2, 7, 3, C.jacket); rect(X - 3, shY - 2, 2, 3, C.jacketSh); rect(X + 4, shY + 12, 2, 1, C.jacketSh); }   // zip, colletto alzato, taschino
  if (mu) { rect(X - 4, shY + 7, 9, 1, C.jacketSh); px(X + 1, shY + 8, C.jacketSh); }               // pettorali
  if (Xs.barbone) {                                                                                 // toppe, strappi e sporco
    rect(X - 5, shY + 8, 3, 3, '#6a5a3a'); px(X - 5, shY + 8, '#3a2e1e'); rect(X + 2, shY + 17, 3, 2, '#4a5a3a'); rect(X - 2, shY + 13, 1, 2, '#141018');
    for (let x = X - 7; x <= X + 6; x += 2) rect(x, tb, 1, 1 + ((x * 7) % 3), C.jacketSh);
  }
  rect(X - 7, tb - 2, 14, 2, C.jacketSh);                                                           // orlo
  rect(X - 6, tb, 12, 2, '#1a1a20'); px(X + 3, tb, '#c8b070');                                     // cintura e fibbia
  // gamba e braccio vicini
  leg(P.lA, P.lK, jeans, jeansHi);
  let hand = null;
  if (P.pockets) { limb(X + 1, shY + 2, X + 4, shY + 13, 5, C.jacket); rect(X + 2, shY + 13, 5, 3, C.jacketSh); }
  else hand = arm(P.fArm, P.fEl, C.jacket, C.skin);
  if (Xs.barbone) { px(X + 1, hipY + 8, '#5a4a32'); rect(X - 2, hipY + 16, 2, 1, '#5a4a32'); px(X + 4, hipY + 22, '#4a3a28'); }   // jeans sporchi
  if (Xs.barbone && hand && !P.phone) { rect(hand[0] + 1, hand[1] - 6, 2, 7, '#2e4a24'); rect(hand[0] + 1, hand[1] - 8, 2, 2, '#1e3018'); px(hand[0] + 2, hand[1] - 5, '#7aa060'); }   // la bottiglia
  if (P.phone && hand) { rect(hand[0] + 1, hand[1] - 4, 2, 5, '#1a1a22'); rect(hand[0] + 2, hand[1] - 3, 1, 3, '#7fd8ff'); }   // il telefono acceso
  // collo e testa (profilo verso destra)
  const hy = 4 + B + P.head, hx = X + (P.head > 0 ? 1 : 0);
  rect(hx - 2, hy + 16, 5, 6, C.skinSh); rect(hx + 1, hy + 16, 2, 5, C.skin);
  if (Xs.catena) { rect(hx - 2, hy + 21, 7, 1, '#e8c040'); px(hx + 2, hy + 22, '#ffe27a'); px(hx + 2, hy + 23, '#c89a20'); }   // catenina d'oro
  const head = [[-4, 3], [-6, 5], [-7, 6], [-7, 7], [-7, 7], [-7, 7], [-7, 7], [-7, 7], [-7, 8], [-7, 8], [-7, 9], [-6, 9], [-6, 8], [-6, 8], [-5, 8], [-4, 7], [-3, 5]];
  if (P.head < 0) {                                                                                  // si guarda indietro: si vede la nuca, niente viso
    head.forEach(([a], i) => rect(hx + a, hy + i, 13 - (i > 13 ? 3 : 0), 1, C.skinSh));
  } else head.forEach(([a, b], i) => {
    rect(hx + a, hy + i, b - a + 1, 1, C.skin); rect(hx + a, hy + i, 3, 1, C.skinSh);
    if (i >= 3 && i <= 9) px(hx + b, hy + i, pgShade(C.skin, 0.18));
  });
  if (P.head >= 0) {
    const ey = hy + 8 + P.eyeDown;
    rect(hx + 3, hy + 7, 4, 1, C.hair);                                                              // sopracciglio
    if (Xs.pazzo) { rect(hx + 3, hy + 5, 4, 1, C.hair); px(hx + 7, hy + 4, C.hair); rect(hx + 3, ey - 1, 4, 3, '#f4efe6'); px(hx + 4 + (Math.floor(f / 6) % 2), ey, '#1a1414'); }   // occhi sbarrati, sopracciglio per aria
    else if (blink) rect(hx + 4, ey, 2, 1, C.skinSh); else { rect(hx + 4, ey, 2, 1, '#f4efe6'); px(hx + 5, ey, '#1a1414'); }
    px(hx + 9, hy + 11, C.skinSh); px(hx + 8, hy + 12, C.skinSh);                                    // narice
    if (Xs.pazzo) { rect(hx + 4, hy + 13, 5, 2, '#5a2226'); rect(hx + 5, hy + 13, 3, 1, '#e8e0c8'); }   // sorriso storto coi denti
    else if (P.mouth) rect(hx + 5, hy + 13, 3, 2, '#5a2226'); else rect(hx + 5, hy + 13, 3, 1, pgShade(C.skin, -0.3));
    rect(hx - 1, hy + 7, 3, 4, C.skinSh); px(hx, hy + 8, pgShade(C.skinSh, -0.25));                 // orecchio
    rect(hx + 1, hy + 15, 6, 1, pgShade(C.skin, -0.12));                                             // mascella
    if (L.barba !== 'no') {
      for (let y = hy + 11; y <= hy + 16; y++) for (let x = hx - 1; x <= hx + 8; x++) {
        const inHead = head[y - hy] && x >= hx + head[y - hy][0] + 2 && x <= hx + head[y - hy][1];
        if (!inHead || (y === hy + 13 && x >= hx + 5 && x <= hx + 7)) continue;
        if (L.barba === 'piena' || (x + y) % 2 === 0) px(x, y, L.barba === 'piena' ? C.hair : pgShade(C.hair, 0.15));
      }
      if (L.barba === 'piena') rect(hx + 5, hy + 12, 4, 1, C.hair);
      if (Xs.barbone) for (let y = hy + 16; y <= hy + 21; y++) for (let x = hx; x <= hx + 7 - (y - hy - 16); x++) if ((x * 3 + y) % 4) px(x, y, (x + y) % 3 ? C.hair : pgShade(C.hair, 0.2));   // barbone: barba lunga e incolta
    }
    if (L.occhiali !== 'no') {
      if (L.occhiali === 'sole') { rect(hx + 3, ey - 1, 5, 3, '#08080c'); px(hx + 6, ey - 1, '#6a8ab8'); }
      else { rect(hx + 3, ey - 1, 5, 1, '#1a1a1e'); rect(hx + 3, ey + 1, 5, 1, '#1a1a1e'); px(hx + 3, ey, '#1a1a1e'); px(hx + 7, ey, '#1a1a1e'); }
      rect(hx, ey - 1, 3, 1, '#1a1a1e');                                                             // stanghetta
    }
  }
  // capelli
  const hairTop = L.testa === 'niente';
  const hcol = L.capelli === 'rasati' ? pgShade(C.hair, 0.25) : C.hair;
  rect(hx - 7, hy + 3, 4, L.capelli === 'rasati' ? 6 : 10, hcol); rect(hx - 6, hy + 2, 3, 1, hcol);  // nuca
  if (L.capelli !== 'rasati') rect(hx + 1, hy + 7, 1, 4, hcol);                                     // basetta
  if (L.capelli === 'ricci') for (const [a, b] of [[-8, 4], [-8, 8], [-8, 11], [-7, 13]]) rect(hx + a, hy + b, 2, 2, C.hair);
  if (L.capelli === 'coda') { rect(hx - 11, hy + 7, 4, 3, C.hair); rect(hx - 12, hy + 9, 3, 8, C.hair); rect(hx - 9, hy + 7, 1, 3, C.cap); }
  if (hairTop) {
    const th = L.capelli === 'rasati' ? 2 : L.capelli === 'ricci' ? 5 : 4;
    rect(hx - 6, hy - th + 2, 12, th, hcol); rect(hx - 4, hy - th + 1, 8, 1, hcol);
    if (L.capelli !== 'rasati') { rect(hx + 3, hy + 2, 4, 2, hcol); rect(hx - 3, hy - th + 2, 6, 1, C.hairHi); }   // ciuffo sulla fronte
    if (L.capelli === 'ricci') for (let x = -6; x <= 5; x += 3) rect(hx + x, hy - 4, 2, 2, C.hair);
  } else if (L.testa === 'berretto') {
    rect(hx - 8, hy - 3, 16, 9, C.cap); rect(hx - 6, hy - 4, 12, 1, C.cap); rect(hx - 8, hy + 3, 16, 3, C.capSh);
    for (let x = hx - 7; x < hx + 8; x += 2) px(x, hy + 4, C.capHi); rect(hx - 5, hy - 3, 6, 1, C.capHi);
  } else {
    rect(hx - 7, hy - 2, 14, 6, C.cap); rect(hx - 5, hy - 3, 10, 1, C.cap); rect(hx - 4, hy - 2, 6, 1, C.capHi); px(hx, hy - 4, C.capSh);
    rect(hx - 7, hy + 3, 14, 1, C.capSh);
    if (L.testa === 'rovescio') { rect(hx - 14, hy + 3, 8, 2, C.capSh); rect(hx + 3, hy + 3, 4, 1, hcol); }
    else { rect(hx + 6, hy + 3, 7, 2, C.capSh); rect(hx + 6, hy + 3, 7, 1, C.cap); }
  }
  if (Xs.pazzo) for (const [a, b] of [[-10, 1], [-11, 6], [-10, 11], [-8, -3], [-5, -5], [-1, -6], [3, -5], [6, -3], [8, 0]]) { rect(hx + a, hy + b, 3, 2, C.hair); px(hx + a + 1, hy + b, C.hairHi); }   // capelli sparati in aria
}
function pgStanding(g, x, y, s, ph, walking, look, light = 0, t = 0, pose) {
  const P = walking ? 'walk' : pose || 'idle';
  const f = walking ? Math.floor(((ph % 1) + 1) % 1 * 8) : Math.floor(t * 4) % 32;
  const blink = !walking && P !== 'phone' && (t % 3.7) < 0.14;
  const spr = pgSprite(look, P, f, blink, light); if (!spr) return;
  const k = s * 1.1;
  g.save(); g.imageSmoothingEnabled = false;
  g.drawImage(spr, Math.round(x - 20 * k), Math.round(y - PG_FOOT * k), Math.round(PG_SW * k), Math.round(PG_SH * k));
  g.restore();
}

const PG_R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
// ---------------------------------------------------------------- di spalle, seduto (prologo: davanti al notaio)
function pgBack(g, x, y, t, look) {
  const L = pgNorm(look), C = pgColors(L), R = PG_R, b = Math.sin(t * 1.3) * 0.8;
  if (L.capelli === 'lunghi') R(g, x - 22, y - 30 + b, 44, 44, C.hair);
  g.fillStyle = C.jacket; g.beginPath(); g.moveTo(x - 70, y + 80); g.lineTo(x - 60, y + 6 + b); g.quadraticCurveTo(x, y - 10 + b, x + 60, y + 6 + b); g.lineTo(x + 70, y + 80); g.fill();
  if (L.sopra === 'camicia') for (let q = -60; q < 66; q += 14) R(g, x + q, y + 6 + b, 2, 74, C.check);
  if (L.sopra === 'felpa') { g.fillStyle = C.jacketSh; g.beginPath(); g.ellipse(x, y + 10 + b, 30, 14, 0, 0, Math.PI); g.fill(); }   // il cappuccio
  R(g, x + 40, y + 6 + b, 6, 70, C.jacketHi); R(g, x - 2, y + 4 + b, 4, 76, C.jacketSh);
  R(g, x - 12, y - 14 + b, 24, 16, C.skinSh);
  g.fillStyle = C.skinSh; g.beginPath(); g.ellipse(x, y - 30 + b, 23, 25, 0, 0, Math.PI * 2); g.fill();
  g.globalAlpha = L.capelli === 'rasati' ? 0.55 : 1; g.fillStyle = C.hair; g.beginPath(); g.ellipse(x, y - 36 + b, 23, 20, 0, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
  if (L.capelli === 'ricci') for (let i = -18; i <= 18; i += 9) { g.beginPath(); g.ellipse(x + i, y - 22 + b, 6, 5, 0, 0, Math.PI * 2); g.fill(); }
  if (L.capelli === 'coda') { R(g, x - 5, y - 26 + b, 10, 22, C.hair); R(g, x - 6, y - 28 + b, 12, 4, C.cap); }
  for (let i = -16; i <= 16; i += 5) R(g, x + i, y - 30 + b, 2, 3, C.hairHi);
  R(g, x - 26, y - 36 + b, 5, 11, C.skin); R(g, x + 21, y - 36 + b, 5, 11, C.skin);
  if (L.occhiali !== 'no') { R(g, x - 27, y - 40 + b, 7, 2, '#1a1a1e'); R(g, x + 20, y - 40 + b, 7, 2, '#1a1a1e'); }   // le stanghette sopra le orecchie
  if (L.testa === 'niente') { g.fillStyle = C.hair; g.beginPath(); g.ellipse(x, y - 46 + b, 24, 16, 0, Math.PI, Math.PI * 2); g.fill(); }
  else if (L.testa === 'berretto') { g.fillStyle = C.cap; g.beginPath(); g.ellipse(x, y - 44 + b, 27, 26, 0, Math.PI, Math.PI * 2); g.fill(); R(g, x - 27, y - 48 + b, 54, 9, C.capSh); }
  else {
    g.fillStyle = C.cap; g.beginPath(); g.ellipse(x, y - 44 + b, 26, 22, 0, Math.PI, Math.PI * 2); g.fill(); R(g, x - 26, y - 46 + b, 52, 6, C.cap);
    if (L.testa === 'rovescio') { R(g, x - 16, y - 46 + b, 32, 7, C.capSh); }                                     // la visiera girata verso di noi
    else { g.fillStyle = C.hair; g.beginPath(); g.ellipse(x, y - 41 + b, 7, 5, 0, Math.PI, Math.PI * 2); g.fill(); R(g, x - 7, y - 42 + b, 14, 2, C.capSh); }
    R(g, x - 14, y - 64 + b, 18, 3, C.capHi);
  }
}

// ---------------------------------------------------------------- stato e editor (solo nel browser)
(function personaggio() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  let cur = null;
  const get = () => { if (!cur) { try { cur = pgNorm(JSON.parse(localStorage.getItem('nr_pg') || 'null')); } catch (e) { cur = pgNorm(null); } } return cur; };
  const set = (L, keep = true) => { cur = pgNorm(L); if (keep) try { localStorage.setItem('nr_pg', JSON.stringify(cur)); } catch (e) { /* ignora */ } return cur; };

  const CSS = `
.pged{position:fixed;inset:0;z-index:96;background:radial-gradient(900px 500px at 30% 30%,#1c1820,#08070b);display:grid;grid-template-columns:minmax(0,1.25fr) minmax(300px,1fr);gap:18px;padding:22px max(16px,env(safe-area-inset-right)) 22px max(16px,env(safe-area-inset-left));color:#f0e6d2;font:15px/1.4 "Barlow Semi Condensed",system-ui,sans-serif;overflow:auto}
.pged h2{margin:0;font:400 30px/1 "Saira Stencil One","Russo One",Impact,sans-serif;font-style:italic;text-transform:uppercase}.pged h2 em{color:#ffb347;font-style:inherit}
.pged .pg-sub{margin:4px 0 0;color:#a8936a;font-size:14px}
.pged .pg-view{display:grid;align-content:start;gap:12px;min-width:0}
.pged canvas{width:100%;height:auto;aspect-ratio:16/9;image-rendering:pixelated;background:#0b0a0e;box-shadow:inset 0 0 0 1px #3a342a,0 20px 50px #000a}
.pged .pg-opts{display:grid;align-content:start;gap:12px;min-width:0}
.pged .pg-row b{display:block;font:600 11px/1 "Share Tech Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#a8936a;margin-bottom:6px}
.pged .pg-row div{display:flex;flex-wrap:wrap;gap:6px}
.pged .pg-row button{border:0;cursor:pointer;color:#e8dcc4;background:#211d18;box-shadow:inset 0 0 0 1px #3a342a;padding:7px 11px;font:600 14px "Barlow Semi Condensed",sans-serif}
.pged .pg-row button[aria-pressed="true"]{background:#ffb347;color:#1a1206;box-shadow:none}
.pged .pg-row button.sw{width:30px;height:30px;padding:0;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(0,0,0,.35)}
.pged .pg-row button.sw[aria-pressed="true"]{box-shadow:0 0 0 2px #0b0a0e,0 0 0 4px #ffb347}
.pged .pg-row[hidden]{display:none}
.pged .pg-act{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
.pged .pg-act button{border:0;cursor:pointer;padding:12px 20px;font:400 16px "Saira Stencil One","Russo One",Impact,sans-serif;letter-spacing:.08em;text-transform:uppercase;clip-path:polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%)}
.pged .pg-go{background:#c9dd5a;color:#141a04}.pged .pg-rnd{background:#2a2520;color:#e8dcc4}
@media (max-width:820px){.pged{grid-template-columns:1fr}}`;

  // l'anteprima: a sinistra il finestrino dell'auto con lui alla guida (la stessa figura del gioco, ingrandita),
  // a destra in piedi sul marciapiede, sotto un lampione
  function preview(g, L, t) {
    const W = 640, H = 360; g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = false;
    g.fillStyle = '#0b0a10'; g.fillRect(0, 0, W, H);
    // la portiera e il finestrino
    g.fillStyle = '#1e2a3a'; g.fillRect(10, 40, 400, 300); g.fillStyle = '#2c3d55'; g.fillRect(10, 40, 400, 6);
    g.save(); g.beginPath(); g.moveTo(40, 70); g.lineTo(330, 70); g.lineTo(395, 210); g.lineTo(40, 210); g.closePath(); g.clip();
    const sky = g.createLinearGradient(0, 70, 0, 210); sky.addColorStop(0, '#1a2034'); sky.addColorStop(1, '#2a2438'); g.fillStyle = sky; g.fillRect(40, 70, 360, 140);
    for (let i = 0; i < 9; i++) { const xx = ((i * 83 - t * 40) % 450 + 450) % 450 - 20; g.fillStyle = '#121626'; g.fillRect(40 + xx, 150 - (i % 3) * 20, 40, 80); g.fillStyle = '#ffcf7a'; g.fillRect(48 + xx, 160 - (i % 3) * 20, 4, 5); }
    // lui, in unità del finestrino ingrandite (scala 6,5: la testa sotto il tetto, le spalle alla linea di cintura)
    const k = 6.5, ax = 14, ay = 9.5, look = Math.sin(t * 0.7);
    g.save(); g.translate(150, 70 + 6.2 * k); g.scale(k, k); g.translate(-ax, -ay);
    const C = pgColors(L, 0), cx = ax + Math.sin(t * 0.9) * 0.15, cy = ay, sx = ax;
    g.fillStyle = '#1c1e26'; g.beginPath(); g.roundRect(sx - 10.2, cy - 6.5, 4.4, 7.5, 1.6); g.fill(); g.fillRect(sx - 11, cy + 3, 5.5, 15);   // poggiatesta e sedile
    const turn = look > 0.75 ? (look - 0.75) * 4 : look < -0.8 ? (look + 0.8) * 3 : 0;
    pgDriver(g, { cx, cy, sx, wx: sx + 14.5, wy: cy + 8.5, C, look: L, turn, blink: t % 3.3 < 0.12, breath: Math.sin(t * 1.7), steer: Math.sin(t * 0.5) * 0.3 });
    g.strokeStyle = '#0c0d12'; g.lineWidth = 1; g.beginPath(); g.ellipse(sx + 14.5, cy + 8, 1.3, 4.6, -0.3, 0, Math.PI * 2); g.stroke();   // volante
    g.restore();
    const dash = g.createRadialGradient(300, 200, 0, 300, 200, 220); dash.addColorStop(0, 'rgba(255,150,60,.18)'); dash.addColorStop(1, 'rgba(255,150,60,0)'); g.fillStyle = dash; g.fillRect(40, 70, 360, 140);
    g.restore();
    g.fillStyle = '#121a26'; g.fillRect(10, 210, 400, 8); g.fillStyle = '#0a0f18'; g.fillRect(70, 250, 60, 8);    // linea di cintura, maniglia
    // in piedi sotto il lampione
    g.fillStyle = '#16141c'; g.fillRect(420, 300, 220, 60); g.fillStyle = '#26232e'; g.fillRect(420, 300, 220, 3);
    g.fillStyle = '#1d1d24'; g.fillRect(600, 60, 4, 240); g.fillRect(560, 58, 44, 4); g.fillStyle = '#ffe9a8'; g.fillRect(562, 62, 22, 3);
    const lg = g.createRadialGradient(573, 70, 0, 560, 200, 190); lg.addColorStop(0, 'rgba(255,200,120,.32)'); lg.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = lg; g.fillRect(420, 40, 220, 270);
    // in piedi, grande (ogni pixel del disegno = 3×3): passa da solo tra le animazioni
    const q = t % 17, pose = q < 4 ? 'idle' : q < 8 ? 'walk' : q < 10.5 ? 'wave' : q < 14 ? 'phone' : 'pockets';
    pgStanding(g, 505, 304, 3 / 1.1, t * 1.25, pose === 'walk', L, 0.06, t * (pose === 'wave' ? 1.6 : 1), pose);
    g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(510, 305, 30, 4, 0, 0, Math.PI * 2); g.fill();
  }

  let box = null, raf = 0;
  function editor(o = {}) {
    if (box) return;
    if (!document.getElementById('pgCss')) { const s = document.createElement('style'); s.id = 'pgCss'; s.textContent = CSS; document.head.appendChild(s); }
    let L = pgNorm(now());
    box = document.createElement('div'); box.className = 'pged'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Il tuo personaggio');
    box.innerHTML = `<div class="pg-view"><div><h2>Il tuo <em>personaggio</em></h2><p class="pg-sub">${o.titolo || 'Chi guida stanotte? Lo vedrai nel prologo e al volante per tutto il viaggio.'}</p></div><canvas width="640" height="360"></canvas></div><div class="pg-opts"></div>`;
    document.body.appendChild(box);
    const cv = box.querySelector('canvas'), g = cv.getContext('2d'), opts = box.querySelector('.pg-opts');
    const rows = PG_OPZ.map((q) => {
      const r = document.createElement('div'); r.className = 'pg-row'; r.innerHTML = `<b>${q.nome}</b><div></div>`; const d = r.querySelector('div');
      (q.col ? q.col.map((c, i) => [i, c]) : q.v).forEach(([v, lab]) => {
        const b = document.createElement('button'); b.type = 'button';
        if (q.col) { b.className = 'sw'; b.style.background = lab; b.setAttribute('aria-label', `${q.nome} ${v + 1}`); } else b.textContent = lab;
        b.addEventListener('click', () => { L[q.k] = v; sync(); }); b.dataset.v = v; d.appendChild(b);
      });
      opts.appendChild(r); return [q, r];
    });
    const act = document.createElement('div'); act.className = 'pg-act';
    act.innerHTML = '<button type="button" class="pg-rnd">Casuale</button><button type="button" class="pg-go">' + (o.ok || 'Va bene così') + '</button>';
    opts.appendChild(act);
    function sync() { for (const [q, r] of rows) { r.hidden = q.se ? !q.se(L) : false; for (const b of r.querySelectorAll('button')) b.setAttribute('aria-pressed', String(String(L[q.k]) === b.dataset.v)); } }
    act.querySelector('.pg-rnd').addEventListener('click', () => { L = pgRandom(); sync(); });
    const done = () => { cancelAnimationFrame(raf); window.removeEventListener('keydown', keys, true); box.remove(); box = null; const v = set(L); if (o.onDone) o.onDone(Object.assign({}, v)); };
    act.querySelector('.pg-go').addEventListener('click', done);
    function keys(e) { e.stopImmediatePropagation(); if (e.key === 'Enter') { e.preventDefault(); done(); } }
    window.addEventListener('keydown', keys, true);
    sync();
    const T0 = performance.now(); const loop = (now) => { if (!box) return; preview(g, L, (now - T0) / 1000); raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop);
    setTimeout(() => { const b = box && box.querySelector('.pg-go'); if (b) b.focus(); }, 50);
  }

  // il personaggio da disegnare: quello della partita in corso, se c'è, altrimenti l'ultimo scelto
  const now = () => { const G = window.nightRun && window.nightRun.game, v = G && G.s && G.s.vg; return v && v.pg ? (v.pg._n ? v.pg : (v.pg = Object.assign(pgNorm(v.pg), { _n: 1 }))) : get(); };
  window.NightPG = { editor, get, set, now, get open() { return !!box; } };
})();
if (typeof window !== 'undefined') Object.assign(window, { PG_OPZ, PG_DEF, pgNorm, pgRandom, pgColors, pgDriver, pgStanding, pgBack, pgSprite });
