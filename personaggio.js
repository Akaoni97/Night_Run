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
const PG_DEF = { pelle: 2, capelli: 'corti', capCol: 0, testa: 'cappellino', testaCol: 0, sopra: 'giubbotto', sopraCol: 0, barba: 'no', occhiali: 'no' };

// un aspetto sempre valido (valori sconosciuti o mancanti tornano quelli di partenza)
function pgNorm(L) {
  const o = Object.assign({}, PG_DEF);
  if (L && typeof L === 'object') for (const q of PG_OPZ) {
    const v = L[q.k];
    if (q.col ? Number.isInteger(v) && v >= 0 && v < q.col.length : q.v.some((x) => x[0] === v)) o[q.k] = v;
  }
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
// P: { cx, cy (testa), sx (spalla), wx, wy (volante), C (colori di pgColors), look, turn, blink, breath, steer, elbow, shiftK }
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
  el(cx, cy, 3.6, 4.1, C.skin);
  el(cx - 1.3 - fp * 0.6 + fn * 0.4, cy + 0.4, 2.4 - fp * 0.8, 3.8, C.skinSh);                                    // guancia in ombra verso dietro
  const nx = cx + 3.2 - fp * 1.3 - fn * 0.5, nl = 1.3 * (1 - fp * 0.4);
  poly([[nx, cy - 0.8], [nx + nl, cy + 1.2], [nx + 0.1, cy + 1.6]], C.skin);                                     // naso
  const ex = cx + 2.3 - fp * 1.5 - fn * 0.4, ey = cy - 0.6 + (P.lookUp || 0) * -0.3;
  const eye = (xx) => { if (P.blink) line([[xx - 0.45, ey], [xx + 0.45, ey]], '#1a1414', 0.3); else el(xx, ey, 0.45, 0.4, '#1a1414'); };
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
    poly([[cx - 3.9, cy - 0.6], [cx - 3.4, cy - 3.6], [cx - 0.4, cy - 4.9], [cx + 2.7, cy - 4.3], [cx + 3.3, cy - 1.8]], C.cap);
    line([[cx - 2.8, cy - 3.8], [cx + 0.2, cy - 4.8], [cx + 2.4, cy - 4.3]], C.capHi, 0.55);
    if (L.testa === 'rovescio') poly([[cx - 3.2, cy - 2.4], [cx - 6.8, cy - 1.8], [cx - 6.5, cy - 1.1], [cx - 3.3, cy - 1.4]], C.capSh);   // visiera dietro
    else poly([[cx + 2.4, cy - 2.2], [cx + 6.2, cy - 1.6], [cx + 5.8, cy - 1], [cx + 2.6, cy - 1.3]], C.capSh);                         // visiera
  }
  return { hx: P.elbow > 0.5 ? null : wx };
}

// ---------------------------------------------------------------- in piedi, di profilo (prologo, editor)
const PG_R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
function pgStanding(g, x, y, s, ph, walking, look, light = 0, t = 0) {
  const L = pgNorm(look), C = pgColors(L), R = PG_R;
  const jeans = '#26304c', jeansSh = '#1a2138', shoe = '#121016';
  g.save(); g.translate(Math.round(x), Math.round(y)); g.scale(s, s);
  const sw = walking ? Math.sin(ph * Math.PI * 2) : 0, bob = walking ? Math.abs(Math.cos(ph * Math.PI * 2)) * 1.6 : Math.sin(t * 1.6) * 0.5;
  const blink = !walking && t % 3.7 < 0.13;
  const leg = (a, col) => { g.save(); g.translate(0, -38 + bob); g.rotate(a * 0.42); R(g, -3, 0, 6, 20, col); g.translate(0, 19); g.rotate(Math.max(0, -a) * 0.5); R(g, -3, 0, 6, 17, col); R(g, -3, 16, 10, 4, shoe); g.restore(); };
  if (L.capelli === 'lunghi') R(g, -7, -84 + bob, 5, 20, C.hair);
  leg(-sw, jeansSh);
  const arm = (a, col) => { g.save(); g.translate(0, -64 + bob); g.rotate(a * 0.5); R(g, -3, 0, 6, 15, col); g.translate(0, 14); g.rotate(-Math.abs(a) * 0.3); R(g, -3, 0, 6, 12, col); R(g, -3, 11, 6, 5, C.skinSh); g.restore(); };
  arm(sw, C.jacketSh);
  R(g, -8, -68 + bob, 17, 31, C.jacket); R(g, 5, -67 + bob, 4, 29, C.jacketHi); R(g, -8, -40 + bob, 17, 3, C.jacketSh);
  if (L.sopra === 'camicia') { for (let q = -6; q < 9; q += 4) R(g, q, -67 + bob, 1, 27, C.check); for (let q = -64; q < -40; q += 5) R(g, -8, q + bob, 17, 1, C.jacketSh); R(g, 1, -68 + bob, 5, 3, C.check); }
  else if (L.sopra === 'felpa') { R(g, -9, -70 + bob, 9, 6, C.jacket); R(g, 4, -62 + bob, 1, 8, C.check); R(g, -7, -50 + bob, 15, 5, C.jacketSh); }   // cappuccio, laccio, tasca
  else R(g, 0, -67 + bob, 2, 27, L.sopra === 'pelle' ? '#3a3638' : '#1a1f2e');                               // zip
  leg(sw, jeans);
  R(g, -2, -72 + bob, 6, 5, C.skinSh);
  R(g, -6, -86 + bob, 13, 15, C.skin); R(g, 6, -79 + bob, 3, 3, C.skin);                                          // testa, naso
  R(g, -6, -86 + bob, 4, L.capelli === 'rasati' ? 6 : 13, C.hair);                                               // nuca
  if (L.capelli === 'ricci') for (const [a, b] of [[-7, -84], [-7, -79], [-6, -88]]) R(g, a, b + bob, 4, 4, C.hair);
  if (L.capelli === 'coda') { R(g, -10, -82 + bob, 5, 4, C.hair); R(g, -11, -79 + bob, 3, 7, C.hair); }
  R(g, 3, -81 + bob, 2, blink ? 1 : 2, '#1a1414'); R(g, -1, -80 + bob, 2, 3, C.skinSh);                          // occhio, orecchio
  if (L.barba !== 'no') { g.globalAlpha = L.barba === 'corta' ? 0.45 : 1; R(g, -1, -77 + bob, 9, 5, C.hair); if (L.barba === 'piena') R(g, 4, -78 + bob, 4, 1, C.hair); g.globalAlpha = 1; }
  if (L.occhiali === 'sole') { R(g, 1, -82 + bob, 6, 3, '#08080c'); R(g, -2, -81 + bob, 3, 1, '#08080c'); }
  else if (L.occhiali === 'vista') { R(g, 1, -82 + bob, 6, 1, '#1a1a1e'); R(g, 1, -80 + bob, 6, 1, '#1a1a1e'); R(g, 1, -82 + bob, 1, 3, '#1a1a1e'); R(g, 6, -82 + bob, 1, 3, '#1a1a1e'); R(g, -2, -82 + bob, 3, 1, '#1a1a1e'); }
  if (L.testa === 'niente') { R(g, -6, -89 + bob, 12, L.capelli === 'rasati' ? 2 : 4, C.hair); if (L.capelli === 'ricci') R(g, -5, -91 + bob, 10, 3, C.hair); }
  else if (L.testa === 'berretto') { R(g, -7, -92 + bob, 14, 8, C.cap); R(g, -7, -86 + bob, 14, 3, C.capSh); R(g, -4, -94 + bob, 8, 2, C.cap); }
  else { R(g, -7, -90 + bob, 14, 6, C.cap); R(g, -5, -91 + bob, 9, 2, C.capHi); if (L.testa === 'rovescio') R(g, -13, -86 + bob, 7, 2, C.capSh); else R(g, 6, -86 + bob, 7, 2, C.capSh); }
  arm(-sw, C.jacket);
  if (light > 0) { g.globalCompositeOperation = 'source-atop'; g.globalAlpha = light; g.fillStyle = '#ffd7a0'; g.fillRect(-14, -96, 32, 102); }
  g.restore();
}

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
    pgStanding(g, 510, 302, 2.6, 0, false, L, 0.08, t);
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
if (typeof window !== 'undefined') Object.assign(window, { PG_OPZ, PG_DEF, pgNorm, pgRandom, pgColors, pgDriver, pgStanding, pgBack });
