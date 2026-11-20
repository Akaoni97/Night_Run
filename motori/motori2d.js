// ============================================================================
//  Night Run · Il Pistone, la grafica (dopo sfascio.js; la logica è in motori.js)
//  - la facciata del locale sulla strada (avvolge Street2D.drawTripPlace): officina di mattoni col portone alzato,
//    dentro un motore sul cavalletto sotto la lampada, insegna al neon col pistone, vetrina coi blocchi sugli scaffali;
//  - l'interno (NightInterni.SCENE.motori): l'officina coi cavalletti, il paranco, il banco e Nico il motorista;
//  - il pannello (NightMotori.panel): progetto del motore pezzo per pezzo con la scheda che si aggiorna (CV, Nm, giri,
//    peso, affidabilità, curva), i tuoi motori (monta, smonta, vendi, rifai);
//  - il banco di montaggio (NightMotori.banco): a tutto schermo, il motore sul cavalletto si costruisce dal basso
//    in alto; scegli tu il pezzo giusto dalla cassetta (sbagli: Nico ti dice cosa va prima), poi lo accendi.
//  drawEngine disegna il motore (visto di lato, con lo spaccato dei cilindri) a qualunque punto del montaggio.
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined' || typeof MOT_PARTI === 'undefined') return;
  const S = Street2D.prototype, rnd = Street2D.rnd, GY = 216;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const G = () => window.nightRun && window.nightRun.game;
  const ORDER = MOT_PARTI.map((c) => c.id);

  // ---------------------------------------------------------------- il motore disegnato (vista di lato, spaccato)
  // g: contesto; cx: centro; by: base del cavalletto (pavimento); sel: pezzi; upto: quanti reparti sono montati
  // (0-ORDER.length, anche frazionario per l'ultimo che sta entrando); run: 0 fermo, >0 acceso (giri al secondo del disegno)
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  function drawEngine(g, cx, by, sel, upto, t, run, only) {
    if (ORDER.some((k) => !motPart(k, sel[k]))) { const s2 = Object.assign({}, sel); for (const k of ORDER) if (!motPart(k, s2[k])) s2[k] = MOT_BASE[k]; sel = s2; }   // progetti di prima dei reparti nuovi
    const has = (k) => ORDER.indexOf(k) < upto && (!only || only === k), it = (k) => motPart(k, sel[k]);
    const B = it('blocco') || MOT_PARTI[0].items[0], cyl = B.cyl, bw = 26 * cyl + 34, bh = 64, bx = Math.round(cx - bw / 2), byT = by - 112;
    const shake = run ? Math.round(Math.sin(t * 61) * 1) : 0, ox = shake, ph = run ? t * run * Math.PI * 2 : 0;
    // cavalletto: piede a T con le ruote, colonna, braccio e piastra girevole (non quando si disegna un pezzo solo)
    if (!only) {
    R(g, cx - 70, by - 6, 140, 6, '#141418'); R(g, cx - 68, by - 5, 136, 4, '#c42a1a');
    for (const wx of [cx - 64, cx + 56]) { R(g, wx, by - 2, 10, 6, '#141418'); R(g, wx + 2, by, 6, 3, '#3a3a40'); }
    R(g, cx - 82, by - 70, 8, 66, '#141418'); R(g, cx - 81, by - 69, 6, 64, '#c42a1a');
    R(g, cx - 82, byT + 30, 30, 10, '#141418'); R(g, cx - 81, byT + 31, 28, 8, '#d43a2a');
    R(g, bx - 10, byT + 14, 10, 44, '#141418'); R(g, bx - 9, byT + 15, 8, 42, '#5a5e66');
    }
    if (!only && !has('blocco')) return;
    const iron = B.id.includes('20') || B.id.includes('30'), bcol = iron ? '#5c6068' : '#a8aeb8', bsh = iron ? '#40444c' : '#7e848e', bhi = iron ? '#767a84' : '#d0d4dc';
    const X = bx + ox;
    const bore = 18, gap = (bw - cyl * bore) / (cyl + 1);
    const cylX = (i) => Math.round(X + gap + i * (bore + gap));
    if (has('blocco')) {
    // coppa dell'olio e basamento
    R(g, X + 8, byT + bh, bw - 16, 18, '#141418'); R(g, X + 10, byT + bh, bw - 20, 16, '#2a2c32'); R(g, X + 10, byT + bh, bw - 20, 2, '#3a3c44');
    // blocco con lo spaccato: le canne dei cilindri si vedono, il resto è metallo con le nervature
    R(g, X - 1, byT - 1, bw + 2, bh + 2, '#0a0a0e'); R(g, X, byT, bw, bh, bcol);
    for (let k = 0; k < 6; k++) R(g, X + 4, byT + 8 + k * 9, bw - 8, 1, bsh);
    R(g, X, byT, bw, 2, bhi); R(g, X, byT + bh - 3, bw, 3, bsh);
    for (let q = 0; q < 14; q++) R(g, X + 3 + Math.floor(rnd(q * 3.1 + bw) * (bw - 6)), byT + 4 + Math.floor(rnd(q * 7.7) * (bh - 8)), 1, 1, bsh);   // fusione
    for (let i = 0; i < cyl; i++) { R(g, cylX(i) - 1, byT + 2, bore + 2, 46, '#0a0a0e'); R(g, cylX(i), byT + 2, bore, 45, '#1a1c22'); R(g, cylX(i), byT + 2, 2, 45, '#2a2c34'); }
    }
    // albero motore: lungo il fondo, con i contrappesi (girano se acceso)
    const crankY = byT + bh + 4;
    if (has('albero')) {
      const A = it('albero'), steel = A.id === 'fuso' ? '#7a7e88' : '#c8ccd6', big = A.id === 'stroker' ? 8 : 6;
      R(g, X + 2, crankY - 2, bw - 4, 4, '#0a0a0e'); R(g, X + 2, crankY - 1, bw - 4, 2, steel);
      for (let i = 0; i < cyl; i++) { const a = ph + i * Math.PI * 2 / cyl * 2, cxw = cylX(i) + bore / 2;
        R(g, cxw - big / 2 + Math.round(Math.cos(a) * 3), crankY - big / 2 + Math.round(Math.sin(a) * 3), big, big, '#0a0a0e'); R(g, cxw - big / 2 + 1 + Math.round(Math.cos(a) * 3), crankY - big / 2 + 1 + Math.round(Math.sin(a) * 3), big - 2, big - 2, steel); }
      R(g, X - 6, crankY - 3, 8, 6, '#2a2c32');                                   // puleggia
    }
    // bielle e pistoni, dentro le canne
    for (let i = 0; i < cyl; i++) {
      const a = ph + i * Math.PI * 2 / cyl * 2, cxw = cylX(i) + bore / 2, stroke = 9, pY = byT + 12 + Math.round((1 - Math.cos(a)) / 2 * stroke), pinY = pY + 10;
      const crX = cxw + Math.round(Math.sin(a) * 4), crY = crankY - 2 + Math.round(-Math.cos(a) * 3);
      if (has('bielle')) { const Bi = it('bielle'), rc = Bi.id === 'ti' ? '#7fa8d8' : Bi.id === 'h' ? '#d8dce4' : '#8a8e98';
        g.strokeStyle = '#0a0a0e'; g.lineWidth = 4; g.beginPath(); g.moveTo(cxw, pinY); g.lineTo(crX, crY); g.stroke();
        g.strokeStyle = rc; g.lineWidth = 2; g.beginPath(); g.moveTo(cxw, pinY); g.lineTo(crX, crY); g.stroke(); }
      if (has('pistoni')) { const Pi = it('pistoni'), pc = Pi.id === 'std' ? '#9aa0aa' : '#d8dce6';
        R(g, cylX(i) + 1, pY, bore - 2, 12, '#0a0a0e'); R(g, cylX(i) + 2, pY + 1, bore - 4, 10, pc);
        R(g, cylX(i) + 2, pY + 3, bore - 4, 1, '#5a5e66'); R(g, cylX(i) + 2, pY + 5, bore - 4, 1, '#5a5e66');
        if (Pi.comp === 'high') R(g, cylX(i) + 5, pY, bore - 10, 2, pc);          // cupola: compressione alta
        if (Pi.comp === 'low') R(g, cylX(i) + 5, pY + 1, bore - 10, 1, '#6a6e78');   // scodellino
        if (run && Math.cos(a) > 0.92) { g.save(); g.globalCompositeOperation = 'lighter'; R(g, cylX(i) + 2, byT + 3, bore - 4, Math.max(2, pY - byT - 3), 'rgba(255,140,40,.45)'); g.restore(); }   // scoppio
      }
    }
    // testata
    const hT = byT - 24;
    if (has('testata')) {
      const T = it('testata'), tall = T.id === 'v2' ? 18 : 22, hc = T.id === 'v4p' ? '#d0d4dc' : bcol;
      R(g, X - 3, byT - tall - 1, bw + 6, tall + 2, '#0a0a0e'); R(g, X - 2, byT - tall, bw + 4, tall, hc); R(g, X - 2, byT - 3, bw + 4, 3, '#2a2c32');   // guarnizione
      for (let i = 0; i < cyl; i++) R(g, cylX(i) + bore / 2 - 2, byT - tall + 4, 4, tall - 8, T.id === 'v2' ? '#3a3c44' : '#2a2c34');   // condotti
      if (T.id === 'v4p') for (let i = 0; i < cyl; i++) R(g, cylX(i) + 3, byT - tall + 3, bore - 6, 1, '#ffffff');
      // collettore di scarico (lato destro del disegno, verso il turbo)
      for (let i = 0; i < cyl; i++) { R(g, cylX(i) + bore / 2 - 1, byT - 6, 3, 8, '#6a4a3a'); }
      R(g, X + 2, byT + 1, bw - 4, 3, '#7a5a44');
    }
    // alberi a camme: il coperchio sopra la testata (colore secondo le camme)
    if (has('camme')) {
      const Cm = it('camme'), cc = Cm.id === 'gara' ? '#d9a82e' : Cm.id === 'sport' ? '#c42a1a' : '#1e1f24', top = byT - (it('testata') && it('testata').id === 'v2' ? 18 : 22) - 12;
      R(g, X + 4, top - 1, bw - 8, 14, '#0a0a0e'); R(g, X + 5, top, bw - 10, 12, cc); R(g, X + 5, top, bw - 10, 2, 'rgba(255,255,255,.25)');
      for (let i = 0; i < cyl; i++) R(g, cylX(i) + bore / 2 - 1, top + 4, 3, 5, '#0a0a0e');   // bobine / candele
      if (Cm.id !== 'serie') { g.fillStyle = Cm.id === 'gara' ? '#1a1206' : '#ffffff'; g.font = '700 7px "Share Tech Mono", monospace'; g.fillText(Cm.id === 'gara' ? 'RACE' : 'SPORT', X + 8, top + 9); }
    }
    // iniettori: il flauto della benzina sul fianco della testata
    if (has('iniettori')) {
      const In = it('iniettori'), ic = In.id === 'i750' ? '#2e8adf' : In.id === 'i440' ? '#d43a2a' : '#5a5e66', ry = byT - 30;
      R(g, X - 4, ry - 1, bw - 10, 5, '#0a0a0e'); R(g, X - 3, ry, bw - 12, 3, '#c8ccd6');
      for (let i = 0; i < cyl; i++) R(g, cylX(i) + 2, ry + 3, 4, 5, ic);
      R(g, X - 10, ry + 1, 8, 2, '#3a3a40');                                      // tubo della benzina
    }
    // sovralimentazione: chiocciola del turbo a destra (gira se acceso) o compressore sopra con la cinghia
    if (has('sovra')) {
      const Sv = it('sovra');
      if (Sv.sc) {
        const sx = X + bw / 2 - 30, sy = byT - 62;
        R(g, sx - 1, sy - 1, 62, 22, '#0a0a0e'); R(g, sx, sy, 60, 20, '#b8bcc6'); for (let k = 0; k < 6; k++) R(g, sx + 4 + k * 10, sy + 2, 2, 16, '#8a8e98');
        R(g, X - 8, sy + 8, 6, byT + bh - sy - 4, '#1a1a1e');                    // cinghia
      } else if (Sv.max > 0) {
        const r = Sv.id === 'tg' ? 17 : Sv.id === 'tm' ? 14 : 11, tx = X + bw + r + 6, ty = byT - 4;
        R(g, X + bw - 2, ty - 3, 10, 6, '#6a4a3a');
        g.fillStyle = '#0a0a0e'; g.beginPath(); g.arc(tx, ty, r + 1, 0, 7); g.fill();
        g.fillStyle = '#8a6a50'; g.beginPath(); g.arc(tx, ty, r, 0, 7); g.fill();
        g.fillStyle = '#b8bcc6'; g.beginPath(); g.arc(tx + r * 0.2, ty - r * 0.15, r * 0.62, 0, 7); g.fill();
        g.strokeStyle = '#3a3c44'; g.lineWidth = 1; const tr = ph * 6; for (let k = 0; k < 6; k++) { const a = tr + k * Math.PI / 3; g.beginPath(); g.moveTo(tx + r * 0.2, ty - r * 0.15); g.lineTo(tx + r * 0.2 + Math.cos(a) * r * 0.55, ty - r * 0.15 + Math.sin(a) * r * 0.55); g.stroke(); }
        R(g, tx - 4, ty - r - 12, 8, 12, '#c8ccd6');                              // aspirazione verso l'alto
        if (run) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,90,20,.25)'; g.beginPath(); g.arc(tx, ty, r + 3, 0, 7); g.fill(); g.restore(); }
      }
    }
    // centralina: la scatola sul braccio del cavalletto con i cavi
    if (has('centralina')) {
      const E = it('centralina'), ex = bx - 46, ey = byT + 50;
      R(g, ex - 1, ey - 1, 26, 18, '#0a0a0e'); R(g, ex, ey, 24, 16, E.id === 'prog' ? '#1a1c22' : '#3a3c44');
      R(g, ex + 3, ey + 3, 18, 2, E.id === 'prog' ? '#2ee6ff' : '#5a5e66');
      if (E.id === 'prog') R(g, ex + 18, ey + 9, 3, 3, Math.floor(t * 3) % 2 ? '#b8ff3a' : '#3a6a1a');
      g.strokeStyle = '#141418'; g.lineWidth = 2; g.beginPath(); g.moveTo(ex + 24, ey + 6); g.quadraticCurveTo(X - 10, ey - 40, X + 6, byT - 28); g.stroke();
    }
    const lvc = (k) => ['#7a7e88', '#7a7e88', '#c8ccd6', '#d43a2a', '#d9a82e'][motLvOf(k, sel[k])];   // colore del livello
    // pompa dell'olio: sotto la puleggia, davanti alla coppa (col carter secco anche il serbatoio a parte)
    if (has('olio')) {
      const O = it('olio'), oy = crankY + 3;
      R(g, X - 9, oy - 1, 12, 10, '#0a0a0e'); R(g, X - 8, oy, 10, 8, lvc('olio')); R(g, X - 6, oy + 2, 6, 1, '#2a2c32');
      if (O.kw) { R(g, X + 14, byT + bh + 19, 26, 6, '#0a0a0e'); for (let q = 0; q < 6; q++) R(g, X + 15 + q * 4, byT + bh + 20, 2, 4, '#9aa0aa'); }   // radiatore dell'olio
      if (O.id === 'secco') { R(g, X - 22, byT + bh - 20, 10, 26, '#0a0a0e'); R(g, X - 21, byT + bh - 19, 8, 24, '#c42a1a'); R(g, X - 14, byT + bh + 4, 6, 2, '#141418'); }
    }
    // intercooler: col turbo, il pacco alettato sopra il motore e il tubo che arriva dalla chiocciola
    if (has('intercooler') && it('sovra') && it('sovra').max > 0 && it('intercooler').cap > 0) {
      const Ic = it('intercooler'), w = Ic.id === 'fms' ? bw * 0.45 : bw * 0.62, iy = it('sovra').sc ? byT - 84 : byT - 62, ix = X + bw * 0.25;
      R(g, ix - 1, iy - 1, w + 2, 14, '#0a0a0e'); R(g, ix, iy, w, 12, Ic.id === 'aa' ? '#3a4a5a' : '#9aa0aa');
      for (let q = 2; q < w - 2; q += 3) R(g, ix + q, iy + 2, 1, 8, '#5a5e66');
      R(g, ix + w, iy + 4, X + bw + 8 - ix - w, 4, '#0a0a0e'); R(g, ix + w, iy + 5, X + bw + 8 - ix - w, 2, '#c8ccd6');   // tubo verso il turbo
      if (Ic.id === 'aa') { R(g, ix + 4, iy - 5, 6, 5, '#2e8adf'); R(g, ix + w - 10, iy - 5, 6, 5, '#2e8adf'); }      // raccordi dell'acqua
    }
    // pompa della benzina: il filtro e il regolatore all'inizio del flauto
    if (has('benzina')) { const ry = byT - 30; R(g, X - 20, ry - 6, 8, 13, '#0a0a0e'); R(g, X - 19, ry - 5, 6, 11, lvc('benzina')); R(g, X - 18, ry - 2, 4, 1, '#1a1a1e'); }
    // radiatore: davanti, oltre il turbo, coi manicotti dell'acqua (doppia ventola col livello da gara)
    if (has('radiatore')) {
      const Rd = it('radiatore'), rx = X + bw + 46, ry = byT - 40, rh = bh + 30, rw = 6 + motLvOf('radiatore', sel.radiatore) * 2;
      R(g, rx - 1, ry - 1, rw + 2, rh + 2, '#0a0a0e'); R(g, rx, ry, rw, rh, Rd.id === 'serie' ? '#3a3c44' : '#b8bcc6');
      for (let q = 2; q < rh - 2; q += 3) R(g, rx + 1, ry + q, rw - 2, 1, Rd.id === 'serie' ? '#2a2c32' : '#7a7e88');
      g.strokeStyle = '#141418'; g.lineWidth = 3; g.beginPath(); g.moveTo(X + bw - 4, byT - 16); g.quadraticCurveTo(rx - 10, ry - 6, rx, ry + 6); g.moveTo(X + bw - 4, byT + bh - 10); g.quadraticCurveTo(rx - 14, byT + bh + 6, rx, ry + rh - 8); g.stroke();
      const fans = Rd.id === 'gara' ? 2 : 1; for (let q = 0; q < fans; q++) { const fy = ry + rh * (fans === 2 ? 0.28 + q * 0.44 : 0.5); g.fillStyle = '#0a0a0e'; g.beginPath(); g.arc(rx - 4, fy, 8, 0, 7); g.fill(); g.strokeStyle = '#5a5e66'; g.lineWidth = 1; const fa = ph * 2 + q; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(rx - 4, fy); g.lineTo(rx - 4 + Math.cos(fa + k * 1.57) * 7, fy + Math.sin(fa + k * 1.57) * 7); g.stroke(); } }
    }
    // frizione: la campana dietro al blocco (lato del volano), col bordo del disco del suo colore
    if (has('frizione')) {
      const F = it('frizione'), fx = X - 14, fy = byT + 10;
      R(g, fx - 1, fy - 1, 12, bh + 2, '#0a0a0e'); R(g, fx, fy, 10, bh, '#8a8e98'); R(g, fx, fy, 10, 2, '#b8bcc6');
      R(g, fx + 3, fy + 6, 3, bh - 12, F.id === 'bid' ? '#d9a82e' : F.id === 'cer' ? '#c42a1a' : F.id === 'rinf' ? '#2e8adf' : '#3a3c44');
      if (F.id === 'bid') R(g, fx + 7, fy + 6, 2, bh - 12, '#d9a82e');
    }
    // acceso: fumo dallo scarico e un tremolio di calore
    if (run && !only) for (let k = 0; k < 5; k++) { const sx = X + bw + 24 + Math.sin(t * 3 + k) * 4, sy = byT + 20 - ((t * 30 + k * 12) % 50); g.fillStyle = `rgba(200,200,210,${0.12 * (1 - ((t * 30 + k * 12) % 50) / 50)})`; g.beginPath(); g.arc(sx, sy, 4 + k, 0, 7); g.fill(); }
  }

  // ---------------------------------------------------------------- facciata sulla strada
  const prev = S.drawTripPlace;
  S.drawTripPlace = function (g, e, x, st, near, open) {
    if (e.id !== 'motori') return prev ? prev.call(this, g, e, x, st, near, open) : false;
    const C = this.C, t = st.t, n = 1 - (this.day || 0), s = Math.round(e.x) % 977, ink = C.ink, X = Math.round(x);
    const L = X - 140, W = 290, T = 108, dL = X - 52, dW = 104, dT = 140, dH = GY - dT, oh = Math.round(dH * open);
    if (this.lcYard) this.lcYard(g, X, 140);
    // capannone: lamiera scura sopra, mattoni rossi sotto, cornicione
    if (this.lcWall) { this.lcWall(g, L, T, W, 34, '#2a2c34', 'lamiera', s); this.lcWall(g, L, T + 34, W, GY - T - 34, '#6a3426', 'mattoni', s + 1); }
    else R(g, L, T, W, GY - T, '#5a3426');
    if (this.lcCornice) this.lcCornice(g, L, T, W, '#1c1e24');
    g.fillStyle = ink; g.fillRect(L - 1, T, 1, GY - T); g.fillRect(L + W, T, 1, GY - T);
    // insegna: IL PISTONE al neon arancio, con un pistone disegnato accanto
    const sign = 'IL PISTONE', sw = this.textW(sign, 2), sL = Math.round(X - sw / 2) + 8;
    this.lcBox(g, sL - 30, T + 6, sw + 42, 20, '#0e0e12');
    this.lcNeon(g, sign, sL, T + 11, '#ff6a2a', 2, t, s + 3, sw);
    { const px = sL - 22, py = T + 9, on = n > 0.05; R(g, px, py, 12, 7, on ? '#ffb070' : '#7a4a2a'); R(g, px, py + 2, 12, 1, '#0e0e12'); R(g, px + 5, py + 7, 2, 6, on ? '#ffb070' : '#7a4a2a'); R(g, px + 3, py + 12, 6, 3, on ? '#ffb070' : '#7a4a2a');
      if (on) this.light(g, px + 6, py + 7, 14, 10, '#ff6a2a', 0.08 * n, 2); }
    this.text(g, 'MOTORI SU MISURA', X - 32, T + 30, '#e8e6df');
    // portone alzato: dentro il motore sul cavalletto sotto la lampada, il paranco, gli attrezzi
    g.fillStyle = ink; g.fillRect(dL - 4, dT - 4, dW + 8, dH + 4); g.fillStyle = '#8a8c94'; g.fillRect(dL - 3, dT - 3, dW + 6, 2);
    const gr = g.createLinearGradient(0, dT, 0, GY); gr.addColorStop(0, n > 0.1 ? '#4a3a30' : '#5a5a5e'); gr.addColorStop(1, n > 0.1 ? '#2a201a' : '#3a3a40'); g.fillStyle = gr; g.fillRect(dL, dT, dW, dH);
    R(g, dL + 6, dT + 4, dW - 12, 1, '#6a5a4a');
    g.fillStyle = 'rgba(30,26,30,.9)'; g.fillRect(dL + 4, dT + 10, 26, 30); for (let q = 0; q < 9; q++) R(g, dL + 7 + (q % 3) * 8, dT + 13 + Math.floor(q / 3) * 9, 2, 6, ['#c8ccd6', '#d42a2a', '#ffd23f'][q % 3]);   // pannello attrezzi
    R(g, dL + 70, dT + 2, 2, 26, '#1a1a1e'); R(g, dL + 66, dT + 28, 10, 3, '#c8a040');   // paranco con la catena
    g.save(); g.translate(dL + dW / 2 + 6, 0); g.scale(0.32, 0.32); drawEngine(g, 0, GY / 0.32 - 2, Object.assign({}, MOT_BASE, { blocco: 'b6_30', camme: 'sport', sovra: 'tm', intercooler: 'fmg' }), ORDER.length, t, 0); g.restore();
    if (n > 0.1) { this.light(g, dL + dW / 2 + 6, dT + 8, 34, 30, '#ffd9a0', 0.12 * n, 3); R(g, dL + dW / 2, dT + 2, 12, 3, '#ffe2a8'); }
    g.fillStyle = '#5a6070'; g.fillRect(dL, dT, dW, dH - oh);
    for (let yy = dT + 5; yy < dT + dH - oh; yy += 6) { R(g, dL, yy, dW, 1, '#454b5a'); R(g, dL, yy + 1, dW, 1, '#6a7080'); }
    if (n > 0.1 && oh > 2) this.light(g, X, GY + 4, 70, 8, '#ffd9a0', 0.1 * open * n, 3);
    // a destra: vetrina coi blocchi motore sugli scaffali e le casse
    this.lcGlass(g, dL + dW + 16, 146, 64, 36, { col: '#ffd9a0', inside: (g2, x0, y0, w, h) => {
      for (let r = 0; r < 2; r++) { R(g2, x0 + 2, y0 + 15 + r * 16, w - 4, 2, '#3a2a20'); for (let q = 0; q < 3; q++) { const bx = x0 + 5 + q * 20, by2 = y0 + 6 + r * 16; R(g2, bx, by2, 14, 9, q % 2 ? '#a8aeb8' : '#5c6068'); for (let c = 0; c < 3; c++) R(g2, bx + 2 + c * 4, by2 + 2, 2, 3, '#1a1c22'); } } } });
    this.text(g, 'RICOSTRUZIONI', dL + dW + 18, 186, '#ff9a5a'); this.text(g, 'ELABORATI', dL + dW + 20, 194, '#e8e6df');
    for (let q = 0; q < 2; q++) { R(g, L + W - 30 + q * 4, GY - 16 - q * 12, 22, 14, ink); R(g, L + W - 29 + q * 4, GY - 15 - q * 12, 20, 12, '#7a5a34'); R(g, L + W - 29 + q * 4, GY - 10 - q * 12, 20, 1, '#5a3a20'); }   // casse
    // a sinistra: ufficio con la finestra e il fusto dell'olio
    this.lcGlass(g, L + 14, 150, 46, 28, { col: '#e8f0ff', noSpill: true, inside: (g2, x0, y0, w, h) => { for (let yy = y0 + 2; yy < y0 + h; yy += 3) { g2.fillStyle = 'rgba(60,64,80,.5)'; g2.fillRect(x0, yy, w, 1); } } });
    R(g, L + 70, GY - 22, 16, 22, ink); R(g, L + 71, GY - 21, 14, 21, '#1a5a8a'); R(g, L + 71, GY - 16, 14, 1, '#0e3a5a'); R(g, L + 71, GY - 8, 14, 1, '#0e3a5a');
    this.lcLamp(g, dL - 22, dT - 8, '#ffcf7a'); this.lcLamp(g, dL + dW + 22, dT - 8, '#ffcf7a');
    this.placeTag(g, X, dT + 4, 'MOTORI', '#ff6a2a', near);
    return true;
  };

  // ---------------------------------------------------------------- l'interno (interni.js)
  function addScene() {
    if (!window.NightInterni || !NightInterni.SCENE || NightInterni.SCENE.motori) return;
    const W = 640, H = 360;
    NightInterni.SCENE.motori = {
      focus: 330, amb: 'shop', grade: '255,150,90', gradeA: 0.07,
      static(g, r) {
        // muro di mattoni, pavimento di cemento con le macchie d'olio, finestra alta sulla notte
        R(g, 0, 0, W, 230, '#2a1a16');
        for (let y = 0; y < 230; y += 8) for (let x = (y / 8) % 2 ? -10 : 0; x < W; x += 20) { const c = ['#4a2a22', '#3e2420', '#55302a'][Math.floor(r() * 3)]; R(g, x + 1, y + 1, 18, 6, c); }
        R(g, 380, 30, 200, 70, '#0a0a14'); for (let k = 0; k < 30; k++) R(g, 380 + Math.floor(r() * 200), 30 + Math.floor(r() * 70), 1, 1, '#c8ccd4');
        for (let x = 380; x <= 580; x += 50) R(g, x, 30, 3, 70, '#1a1a1e'); R(g, 380, 63, 200, 3, '#1a1a1e');
        R(g, 0, 230, W, H - 230, '#3a3a40'); for (let k = 0; k < 200; k++) R(g, Math.floor(r() * W), 232 + Math.floor(r() * 128), 2, 1, r() < 0.5 ? '#44444a' : '#303036');
        for (const [x, y, w] of [[120, 300, 80], [470, 320, 110], [300, 345, 60]]) { g.fillStyle = 'rgba(10,8,12,.6)'; g.beginPath(); g.ellipse(x, y, w / 2, 6, 0, 0, 7); g.fill(); }
        // pannello degli attrezzi e banco
        R(g, 20, 70, 150, 90, '#1c1e24'); for (let q = 0; q < 30; q++) R(g, 28 + (q % 10) * 14, 78 + Math.floor(q / 10) * 26, 3, 18, ['#c8ccd6', '#d42a2a', '#ffd23f', '#9aa0ae', '#2e8adf'][q % 5]);
        R(g, 10, 190, 190, 12, '#5a3a24'); R(g, 10, 202, 190, 4, '#3a2416'); R(g, 20, 206, 8, 40, '#2a2a30'); R(g, 180, 206, 8, 40, '#2a2a30');
        for (let q = 0; q < 4; q++) R(g, 30 + q * 40, 176, 24, 14, ['#a8aeb8', '#5c6068', '#c42a1a', '#d9a82e'][q]);   // testate e coperchi sul banco
        // scaffale coi blocchi e le scatole dei pezzi
        R(g, 560, 110, 74, 130, '#1a1a1e'); for (let s2 = 0; s2 < 4; s2++) { R(g, 562, 140 + s2 * 30, 70, 3, '#3a3a40'); for (let q = 0; q < 3; q++) R(g, 566 + q * 22, 124 + s2 * 30, 18, 15, ['#7a5a34', '#a8aeb8', '#5c6068'][(q + s2) % 3]); }
        // paranco a catena sopra il cavalletto
        R(g, 220, 0, 200, 10, '#2a2a30'); R(g, 318, 10, 4, 50, '#5a5a60');
      },
      dyn(g, t) {
        // il motore sul cavalletto: quello che stai progettando
        const game = G(), sel = game && game.mot ? game.mot().bozza : MOT_BASE;
        g.save(); g.translate(0, 0); drawEngine(g, 330, 290, sel, ORDER.length, t, 0); g.restore();
        // lampada che oscilla appena e la sua luce
        const lx = 330 + Math.sin(t * 0.7) * 3; R(g, lx - 14, 60, 28, 8, '#1a1a1e'); R(g, lx - 12, 67, 24, 2, '#ffe2a8');
        g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createRadialGradient(lx, 70, 4, lx, 200, 200); gr.addColorStop(0, 'rgba(255,220,160,.22)'); gr.addColorStop(1, 'rgba(255,220,160,0)'); g.fillStyle = gr; g.fillRect(lx - 220, 60, 440, 300); g.restore();
        // Nico il motorista: tuta blu, straccio in tasca, si pulisce le mani
        const ox = 470, oy = 300, b = Math.sin(t * 1.3) * 1;
        R(g, ox - 8, oy - 40, 7, 40, '#1a2a4a'); R(g, ox + 1, oy - 40, 7, 40, '#22345a'); R(g, ox - 10, oy - 2, 10, 3, '#0a0a0e'); R(g, ox, oy - 2, 10, 3, '#0a0a0e');
        R(g, ox - 12, oy - 78 + b, 24, 40, '#22345a'); R(g, ox - 12, oy - 78 + b, 24, 3, '#2e4470'); R(g, ox + 6, oy - 60 + b, 6, 8, '#d42a2a');
        R(g, ox - 8, oy - 96 + b, 16, 18, '#c8906a'); R(g, ox - 9, oy - 99 + b, 18, 6, '#d8d8dc'); R(g, ox - 4, oy - 88 + b, 2, 2, '#1a1010'); R(g, ox + 3, oy - 88 + b, 2, 2, '#1a1010'); R(g, ox - 5, oy - 82 + b, 10, 2, '#a8a8ac');   // capelli e baffi bianchi
        const hand = Math.sin(t * 4) * 3; R(g, ox - 18, oy - 60 + b + hand, 8, 6, '#c8906a'); R(g, ox - 20, oy - 58 + b - hand, 12, 4, '#e8e4d0');
        // scintille della mola ogni tanto, sul banco
        if ((t % 5) < 0.6) for (let k = 0; k < 8; k++) { const a = -0.5 - k * 0.12, d = ((t * 60 + k * 9) % 30); R(g, 160 + Math.cos(a) * d, 186 + Math.sin(a) * d, 2, 1, '#ffd23f'); }
      },
      hot: [{ x: 230, y: 120, w: 200, h: 180, label: 'Il motore sul cavalletto', go: 'Progetto del motore' }, { x: 440, y: 190, w: 70, h: 120, label: 'Nico', go: 'I tuoi motori' }, { x: 10, y: 60, w: 200, h: 150, label: 'La tua auto', go: 'La tua auto' }],
    };
  }
  addScene();

  // ---------------------------------------------------------------- il pannello del Pistone
  const css = document.createElement('style');
  css.textContent = `
  .mt-wrap{display:grid;gap:10px}.mt-h{margin:6px 0 0;font:400 17px/1.1 var(--f-display);letter-spacing:.04em;color:var(--fg)}
  .mt-cat{display:grid;gap:5px;padding:8px;border:1px solid rgba(255,255,255,.08);border-radius:6px;background:rgba(0,0,0,.18)}
  .mt-cat>b{font:600 11px/1 var(--f-data);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
  .mt-chips{display:flex;flex-wrap:wrap;gap:5px}.mt-chip{flex:1 1 140px;text-align:left;padding:6px 8px;border-radius:5px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:var(--fg);font:500 12px/1.2 var(--f-data);cursor:pointer}
  .mt-chip small{display:block;color:var(--muted);margin-top:2px}.mt-chip[aria-pressed=true]{border-color:#ff6a2a;background:rgba(255,106,42,.16);box-shadow:0 0 0 1px #ff6a2a inset}
  .mt-tree{display:grid;gap:4px;padding:8px;border-radius:6px;background:rgba(0,0,0,.22);border:1px solid rgba(255,255,255,.08)}
  .mt-tr{display:grid;grid-template-columns:minmax(110px,1fr) auto minmax(150px,1.4fr);gap:8px;align-items:center;font:12px/1.2 var(--f-data)}
  .mt-pips{display:flex;gap:3px}.mt-pips i{width:16px;height:16px;border-radius:3px;display:grid;place-items:center;font:600 10px/1 var(--f-data);font-style:normal;background:#2a2a30;color:#6a6470}
  .mt-pips i.on{background:#ff6a2a;color:#1a0a04}.mt-nx{display:grid;gap:2px;justify-items:end}.mt-nx small{color:var(--muted);text-align:right}
  .mt-nx .ok{color:#b8ff3a}.mt-nx .no{color:#ff7a6a}.mt-nx .kbtn{padding:3px 8px;font-size:12px}
  .mt-lv{display:inline-block;padding:0 4px;border-radius:3px;background:#2a2a30;color:#ff9a5a;font:600 10px/14px var(--f-data)}.mt-chip:disabled{opacity:.45;cursor:not-allowed}
  @media (max-width:700px){.mt-tr{grid-template-columns:1fr auto}.mt-nx{grid-column:1/-1;justify-items:start}.mt-nx small{text-align:left}}
  .mt-note{margin:0;font:12px/1.3 var(--f-data);color:var(--muted)}
  .mt-sheet{display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;padding:10px;border-radius:6px;background:#0e0c10;border:1px solid #ff6a2a55;font:13px/1.25 var(--f-data)}
  .mt-sheet span{color:var(--muted)}.mt-sheet b{text-align:right;color:var(--fg)}.mt-sheet .big{font:400 22px/1 var(--f-display);color:#ff9a5a}
  .mt-bar{grid-column:1/-1;height:8px;border-radius:4px;background:#2a2a30;overflow:hidden}.mt-bar i{display:block;height:100%}
  .mt-warn{grid-column:1/-1;margin:2px 0 0;color:#ffb347;font:12px/1.3 var(--f-data)}.mt-cv{grid-column:1/-1;width:100%;height:110px;display:block}
  .mt-eng{display:grid;grid-template-columns:1fr auto;gap:6px 10px;align-items:center;padding:8px;border-radius:6px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)}
  .mt-eng small{display:block;color:var(--muted);font:12px/1.3 var(--f-data)}.mt-eng .acts{display:flex;flex-wrap:wrap;gap:5px;justify-content:flex-end}
  .mt-bench{position:fixed;inset:0;z-index:60;background:#07060a;display:grid;grid-template-columns:1fr minmax(240px,30%);grid-template-rows:auto 1fr auto;color:var(--fg)}
  .mt-bench header{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:linear-gradient(#000,transparent)}
  .mt-bench h2{margin:0;font:400 clamp(18px,3vw,28px)/1 var(--f-display);letter-spacing:.06em;color:#ff9a5a}
  .mt-bench canvas{width:100%;height:100%;image-rendering:pixelated;display:block;min-height:0}
  .mt-tray{overflow:auto;padding:8px;display:grid;gap:6px;align-content:start;background:#100e14;border-left:1px solid #2a2630}
  .mt-tray button{text-align:left;padding:8px;border-radius:6px;border:1px solid #3a3440;background:#1a1720;color:var(--fg);font:500 13px/1.2 var(--f-data);cursor:pointer}
  .mt-tray button small{display:block;color:var(--muted)}.mt-tray button.sel{border-color:#ff6a2a;box-shadow:0 0 0 1px #ff6a2a inset}.mt-tray button.no{animation:mtNo .35s}
  .mt-say{grid-column:1/-1;padding:10px 14px;font:15px/1.35 var(--f-data);background:#0c0a10;border-top:1px solid #2a2630;min-height:44px}
  .mt-say b{color:#ff9a5a}@keyframes mtNo{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
  @media (max-width:700px){.mt-bench{grid-template-columns:1fr;grid-template-rows:auto 1fr auto auto}.mt-tray{max-height:34vh;border-left:0;border-top:1px solid #2a2630}}`;
  document.head.appendChild(css);

  // curva di CV e Nm del progetto sul suo canvas
  function curve(cv, c) {
    const W = cv.width = cv.clientWidth * 2 || 560, H = cv.height = 220, g = cv.getContext('2d');
    g.fillStyle = '#0e0c10'; g.fillRect(0, 0, W, H);
    const fr = (r) => 16 + 0.0035 * r + 0.9e-6 * r * r, bf = (0.9 + 0.78 * c.boostK * c.boost) / 0.9;
    const at = (r) => { const t = c.tq; for (let i = 1; i < t.length; i++) if (r < t[i][0]) { const [a, ta] = t[i - 1], [b, tb] = t[i]; return ta + (tb - ta) * (r - a) / (b - a); } return t[t.length - 1][1]; };
    const rMax = 9500, pts = []; let maxV = 1;
    for (let r = 1000; r <= c.lim; r += 100) { const T = Math.max(0, at(r) * bf - fr(r)), cv2 = T * r / 7023; pts.push([r, T, cv2]); maxV = Math.max(maxV, T, cv2); }
    const X = (r) => 30 + (r - 1000) / (rMax - 1000) * (W - 40), Y = (v) => H - 20 - v / (maxV * 1.1) * (H - 30);
    g.strokeStyle = '#2a2830'; g.lineWidth = 1; for (let r = 2000; r <= 9000; r += 1000) { g.beginPath(); g.moveTo(X(r), 6); g.lineTo(X(r), H - 20); g.stroke(); g.fillStyle = '#6a6470'; g.font = '18px "Share Tech Mono", monospace'; g.fillText(String(r / 1000), X(r) - 5, H - 3); }
    for (const [k, col] of [[2, '#ff6a2a'], [1, '#2ee6ff']]) { g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(X(p[0]), Y(p[k])) : g.moveTo(X(p[0]), Y(p[k])))); g.stroke(); }
    g.fillStyle = '#ff6a2a'; g.font = '20px "Share Tech Mono", monospace'; g.fillText('CV', 36, 24); g.fillStyle = '#2ee6ff'; g.fillText('Nm', 76, 24);
    g.fillStyle = 'rgba(255,40,40,.25)'; g.fillRect(X(c.lim), 6, 3, H - 26);
  }

  function sheet(c, game) {
    const d = document.createElement('div'); d.className = 'mt-sheet';
    const car = CARS[game.car], kgD = c.kg - motKgSerie(game.car), rel = Math.round(c.rel * 100), rc = rel > 85 ? '#b8ff3a' : rel > 55 ? '#ffd23f' : '#ff4a3a';
    d.innerHTML = `<span>Motore</span><b>${esc(c.tipo)}</b>`
      + `<span>Potenza</span><b class="big">${c.hp} CV</b><span>a</span><b>${fmt(c.rpmHp)} giri</b>`
      + `<span>Coppia</span><b class="big" style="color:#2ee6ff">${c.nm} Nm</b><span>Limitatore</span><b>${fmt(c.lim)} giri</b>`
      + `<span>Peso</span><b>${c.kg} kg <small style="color:var(--muted)">(${kgD >= 0 ? '+' : ''}${kgD} sulla ${esc(car.short || car.name)})</small></b>`
      + `<span>Pezzi</span><b style="color:#ff9a5a">€ ${fmt(c.price)}</b>`
      + `<span>Affidabilità</span><b style="color:${rc}">${rel} %</b><div class="mt-bar"><i style="width:${rel}%;background:${rc}"></i></div>`
      + (() => { const k = Math.round(c.coolK * 100), cc = k >= 110 ? '#2ee6ff' : k >= 100 ? '#b8ff3a' : k >= 80 ? '#ffd23f' : '#ff4a3a';
        return `<span>Raffreddamento</span><b style="color:${cc}">${k} % <small style="color:var(--muted)">(${c.qOut} kW su ${c.qIn})</small></b><div class="mt-bar"><i style="width:${Math.min(100, k / 1.5)}%;background:${cc}"></i></div>`; })()
      + `<span>Frizione</span><b style="color:${c.slitta ? '#ff4a3a' : 'var(--fg)'}">tiene ${c.clutch} Nm</b>`;
    const w = [];
    if (c.lean) w.push(c.leanPompa ? 'La pompa della benzina non ce la fa: a gas pieno la pressione cala, il motore gira magro e la potenza si ferma lì.' : 'Iniettori troppo piccoli: la benzina non basta, la potenza si ferma e il motore gira magro.');
    if (c.caldo > 0.15) w.push(c.parts.intercooler.cap ? `Intercooler piccolo per ${String(c.boost).replace('.', ',')} bar: l'aria entra calda, perde ossigeno, scalda il motore e fa battere.` : 'Turbo senza intercooler: l\'aria compressa entra calda, perdi potenza, l\'acqua scalda e il motore batte.');
    if (c.coolK < 1) w.push(`Il radiatore porta via ${c.qOut} kW, a gas pieno il motore ne butta nell'acqua ${c.qIn}: tirandolo a lungo la temperatura sale, la centralina va in protezione e se insisti salta la guarnizione.`);
    if (c.oilOver > 0) w.push(`La pompa dell'olio regge fino a ${fmt(c.parts.olio.rpmOk)} giri, il motore ne fa ${fmt(c.lim)}: in alto la pressione cala e le bronzine soffrono.`);
    if (c.slitta) w.push(`La frizione tiene ${c.clutch} Nm, il motore ne fa ${c.nm}: a gas pieno slitta.`);
    if (c.knock) w.push('Compressione alta col turbo: batte in testa. Pistoni a compressione bassa!');
    if (c.deboli.length) w.push('Al limite: ' + c.deboli.join(', ').toLowerCase() + '.');
    if (c.parts.sovra.max > c.boost + 0.01) w.push(`La centralina di serie tiene il turbo a ${String(c.boost).replace('.', ',')} bar.`);
    if (c.rel < 0.999) w.push('Sotto il 100 % il motore si può rompere se lo tieni al limitatore a gas pieno.');
    for (const t of w) { const p = document.createElement('p'); p.className = 'mt-warn'; p.textContent = '⚠ ' + t; d.appendChild(p); }
    const cv = document.createElement('canvas'); cv.className = 'mt-cv'; d.appendChild(cv); requestAnimationFrame(() => curve(cv, c));
    return d;
  }

  let lastCtx = null;
  function panel(body, I, ctx) {
    const game = G(); if (!game) return; lastCtx = ctx;
    const M = game.mot(), wrap = document.createElement('div'); wrap.className = 'mt-wrap';
    const h = (t) => { const e = document.createElement('h4'); e.className = 'mt-h'; e.textContent = t; wrap.appendChild(e); };
    const p = (t) => { const e = document.createElement('p'); e.className = 'hint'; e.style.margin = '0'; e.textContent = t; wrap.appendChild(e); };
    const btn = (t, f, dis) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'kbtn'; b.textContent = t; b.disabled = !!dis; b.addEventListener('click', f); return b; };
    const done = (r) => { if (r && r.ok === false) { if (r.why) ctx.flash(r.why, 2.4); } else ctx.save(); ctx.refresh(); };
    p('Nico: «Un motore si costruisce dal basso: blocco, albero, bielle, pistoni, poi la testa. E non basta che ogni pezzo sia forte: devono andare d\'accordo. Un turbo grosso con un radiatore piccolo ti cuoce la testata. I pezzi buoni te li insegno io, un livello alla volta.»');
    // la tua auto
    h('La tua auto');
    { const car = CARS[game.car], e = game.motOf(), c = e && motCalc(e.sel), d = document.createElement('div'); d.className = 'mt-eng';
      d.innerHTML = `<div><b>${esc(car.name)}</b><small>${e ? `motore costruito: ${esc(e.nome)} · ${c.hp} CV${e.rotto ? ' · ROTTO' : ''}` : `motore di serie: ${esc(car.engine || '')}`}</small></div>`;
      const a = document.createElement('div'); a.className = 'acts';
      if (e) a.appendChild(btn(`Rimetti quello di serie · € ${MOT.lavoro}`, () => done(game.motUnmount()), game.s.money < MOT.lavoro));
      d.appendChild(a); wrap.appendChild(d); }
    // l'albero dei pezzi: per ogni reparto il livello che conosci (1-4) e cosa serve per il prossimo
    h('Quello che ti ha insegnato Nico');
    { const tree = document.createElement('div'); tree.className = 'mt-tree';
      for (const C of MOT_PARTI) {
        const lv = game.motLiv(C.id), nx = game.motNext(C.id), row = document.createElement('div'); row.className = 'mt-tr';
        row.innerHTML = `<b>${esc(C.label)}</b><span class="mt-pips">${[1, 2, 3, 4].map((l) => `<i class="${l <= lv ? 'on' : ''}">${l}</i>`).join('')}</span>`;
        const a = document.createElement('div'); a.className = 'mt-nx';
        if (!nx) a.innerHTML = '<small>tutto</small>';
        else {
          const reqs = nx.req.map((r) => `<span class="${r.ok ? 'ok' : 'no'}">${esc(r.t)}</span>`).join(' ');
          const b = btn(`Livello ${nx.lv} · € ${fmt(nx.price)}`, () => { const r = game.motUnlock(C.id); if (r.ok) ctx.flash(`Nico ti ha insegnato ${C.label.toLowerCase()} di livello ${r.lv}: ${r.items.map((x) => x.name).join(', ')}`, 3.4); done(r); }, !nx.ok || game.s.money < nx.price);
          b.title = nx.items.map((x) => `${x.name}: ${x.note}`).join('\n');
          a.appendChild(b); if (reqs) { const q = document.createElement('small'); q.innerHTML = reqs; a.appendChild(q); }
        }
        row.appendChild(a); tree.appendChild(row);
      }
      wrap.appendChild(tree); }
    // progetto
    h('Progetto del motore');
    const B = M.bozza || (M.bozza = Object.assign({}, MOT_BASE));
    for (const k of ORDER) if (!motPart(k, B[k]) || !game.motPuoi(k, B[k])) B[k] = MOT_BASE[k];
    for (const C of MOT_PARTI) {
      const box = document.createElement('div'); box.className = 'mt-cat';
      box.innerHTML = `<b>${ORDER.indexOf(C.id) + 1}. ${esc(C.label)} <span style="color:#ff9a5a">· livello ${game.motLiv(C.id)}</span></b>`;
      const chips = document.createElement('div'); chips.className = 'mt-chips';
      for (const it of C.items) {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'mt-chip'; b.setAttribute('aria-pressed', String(B[C.id] === it.id));
        const sai = game.motPuoi(C.id, it.id), lv = it.lv || 1;
        b.innerHTML = `<span class="mt-lv">L${lv}</span> ${esc(it.name)}<small>${sai ? (it.price ? '€ ' + fmt(it.price) : 'gratis') : '🔒 livello ' + lv + ': te lo insegna Nico'}</small>`;
        b.disabled = !sai; b.title = it.note;
        b.addEventListener('click', () => { B[C.id] = it.id; ctx.refresh(); });
        chips.appendChild(b);
      }
      box.appendChild(chips);
      const note = document.createElement('p'); note.className = 'mt-note'; note.textContent = motPart(C.id, B[C.id]).note; box.appendChild(note);
      wrap.appendChild(box);
    }
    const c = motCalc(B);
    wrap.appendChild(sheet(c, game));
    const full = M.list.length >= MOT.maxMotori;
    const go = btn(`Al cavalletto: montalo tu · € ${fmt(c.price)}`, () => banco(c.sel, ctx), game.s.money < c.price || full);
    go.style.cssText = 'font-size:15px;padding:10px'; wrap.appendChild(go);
    if (full) p(`In magazzino ci stanno ${MOT.maxMotori} motori: vendine uno per costruirne un altro.`);
    else if (game.s.money < c.price) p('Non hai abbastanza soldi per tutti questi pezzi.');
    // i tuoi motori
    h('I tuoi motori');
    if (!M.list.length) p('Ancora nessuno. Quando lo costruisci resta qui: lo monti su qualunque auto del tuo garage.');
    for (const e of M.list) {
      const ce = motCalc(e.sel), onCar = Object.keys(M.on).find((k) => M.on[k] === e.id), d = document.createElement('div'); d.className = 'mt-eng';
      d.innerHTML = `<div><b>${esc(e.nome)}</b><small>${ce.hp} CV · ${ce.nm} Nm · ${fmt(ce.lim)} giri · ${ce.kg} kg · affidabilità ${Math.round(ce.rel * 100)} % · ${fmt(e.km || 0)} km${onCar ? ` · montato sulla ${esc(CARS[onCar].short || CARS[onCar].name)}` : ''}${e.rotto ? ' · <b style="color:#ff4a3a">ROTTO</b>' : ''}</small></div>`;
      const a = document.createElement('div'); a.className = 'acts';
      if (e.rotto) { const rc = Math.round(e.prezzo * MOT.revisione / 10) * 10; a.appendChild(btn(`Rifallo · € ${fmt(rc)}`, () => done(game.motRepair(e.id)), game.s.money < rc)); }
      else if (onCar !== game.car) a.appendChild(btn(`Montalo sulla ${CARS[game.car].short || CARS[game.car].name} · € ${MOT.lavoro}`, () => { const r = game.motMount(e.id); if (r.ok) ctx.flash(`Swap fatto: ${e.nome} sulla ${CARS[game.car].short || CARS[game.car].name}`, 2.6); done(r); }, game.s.money < MOT.lavoro || !!onCar));
      if (!onCar) a.appendChild(btn(`Vendi · € ${fmt(game.motValue(e))}`, () => done(game.motSell(e.id))));
      d.appendChild(a); wrap.appendChild(d);
    }
    body.appendChild(wrap);
  }

  // ---------------------------------------------------------------- il banco di montaggio (a tutto schermo)
  let AC = null;
  const ac = () => { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state !== 'running') AC.resume(); } catch (e) { AC = null; } return AC; };
  function clank(n = 1, f = 1) {        // chiave e bulloni
    const a = ac(); if (!a) return;
    for (let k = 0; k < n; k++) {
      const t0 = a.currentTime + k * 0.13, len = 0.06, buf = a.createBuffer(1, Math.floor(a.sampleRate * len), a.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.18));
      const s = a.createBufferSource(), bp = a.createBiquadFilter(), gg = a.createGain(); s.buffer = buf; bp.type = 'bandpass'; bp.frequency.value = 2400 * f + k * 300; bp.Q.value = 6; gg.gain.value = 0.35;
      s.connect(bp).connect(gg).connect(a.destination); s.start(t0);
    }
  }
  function startSound(cyl, lope) {     // il motore che si accende sul cavalletto: avviamento, poi due sgasate e il minimo
    const a = ac(); if (!a) return null;
    const o = a.createOscillator(), o2 = a.createOscillator(), lp = a.createBiquadFilter(), gg = a.createGain(), t0 = a.currentTime;
    o.type = 'sawtooth'; o2.type = 'square'; lp.type = 'lowpass'; lp.frequency.value = 900; gg.gain.value = 0;
    const f = (rpm) => rpm / 60 * cyl / 2, set = (p, v, t) => p.linearRampToValueAtTime(v, t0 + t);
    o.frequency.setValueAtTime(f(250), t0); o2.frequency.setValueAtTime(f(125), t0);
    set(gg.gain, 0.08, 0.05); set(o.frequency, f(260), 0.9);                                  // motorino
    set(o.frequency, f(1600), 1.15); set(gg.gain, 0.16, 1.15); set(lp.frequency, 1800, 1.15);   // parte
    set(o.frequency, f(900), 1.8); set(o.frequency, f(4200), 2.3); set(lp.frequency, 3200, 2.3); set(o.frequency, f(1000), 2.9); set(o.frequency, f(5200), 3.4); set(o.frequency, f(950), 4.1);
    for (const [p, v] of [[o2.frequency, 0]]) p.setValueAtTime(f(125), t0);
    o2.frequency.linearRampToValueAtTime(f(800) / 2, t0 + 1.15); o2.frequency.linearRampToValueAtTime(f(2100), t0 + 2.3); o2.frequency.linearRampToValueAtTime(f(500), t0 + 2.9); o2.frequency.linearRampToValueAtTime(f(2600), t0 + 3.4); o2.frequency.linearRampToValueAtTime(f(475), t0 + 4.1);
    const g2 = a.createGain(); g2.gain.value = 0.35;
    if (lope > 0.1) { const l = a.createOscillator(), lg = a.createGain(); l.frequency.value = 3 + lope * 2; lg.gain.value = 0.05 * lope; l.connect(lg).connect(gg.gain); l.start(); setTimeout(() => { try { l.stop(); } catch (e) { /* */ } }, 9000); }
    o.connect(lp); o2.connect(g2).connect(lp); lp.connect(gg).connect(a.destination); o.start(); o2.start();
    return { stop() { const t = a.currentTime; gg.gain.cancelScheduledValues(t); gg.gain.setValueAtTime(gg.gain.value, t); gg.gain.linearRampToValueAtTime(0, t + 0.4); setTimeout(() => { try { o.stop(); o2.stop(); } catch (e) { /* */ } }, 600); } };
  }

  const NICO = {
    ok: ['Bravo, va lì.', 'Perfetto. Stringi in croce, mi raccomando.', 'Così. Senti come entra?', 'Bene. Coppia di serraggio giusta.', 'Ecco fatto.'],
    no: (want, got) => `No no, ferma: ${got.toLowerCase()} va dopo. Prima ${want.toLowerCase()}: si monta dal basso verso l'alto.`,
  };
  function banco(sel, ctx) {
    const game = G(); if (!game) return;
    const c = motCalc(sel); if (!c.ok) return;
    if (game.s.money < c.price) { ctx.flash('Non hai abbastanza soldi', 2); return; }
    const box = document.createElement('div'); box.className = 'mt-bench'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Banco di montaggio');
    box.innerHTML = `<header><h2>Banco di montaggio · ${esc(c.tipo)}</h2><button class="kbtn" type="button" data-x>Lascia stare<small>Esc</small></button></header><canvas aria-label="Il motore sul cavalletto"></canvas><div class="mt-tray" aria-label="La cassetta dei pezzi"></div><div class="mt-say"></div>`;
    document.body.appendChild(box);
    const cv = box.querySelector('canvas'), tray = box.querySelector('.mt-tray'), say = box.querySelector('.mt-say'), g = cv.getContext('2d');
    const st = { upto: 0, anim: null, run: 0, done: false, t0: performance.now(), sel: 0, snd: null, built: null };
    const talk = (t) => { say.innerHTML = `<b>Nico:</b> ${esc(t)}`; };
    talk('Ecco la cassetta. Prendi il pezzo che va montato adesso: si parte dal basso. Clicca un pezzo (o frecce e Invio).');
    // i pezzi in cassetta, mescolati (sempre allo stesso modo per lo stesso progetto)
    const order = ORDER.slice().sort((a, b) => rnd(ORDER.indexOf(a) * 13.1 + c.price) - rnd(ORDER.indexOf(b) * 13.1 + c.price));
    const buttons = {};
    const renderTray = () => {
      tray.innerHTML = '';
      const left = order.filter((k) => ORDER.indexOf(k) >= st.upto && !(st.anim && st.anim.k === k));
      left.forEach((k, i) => {
        const it = motPart(k, sel[k]), b = document.createElement('button'); b.type = 'button'; if (i === st.sel) b.className = 'sel';
        b.innerHTML = `${esc(MOT_CAT[k].label)}<small>${esc(it.name)}</small>`;
        b.addEventListener('click', () => pick(k, b)); tray.appendChild(b); buttons[k] = b;
      });
      if (!left.length && !st.anim) {
        if (!st.run) { const b = document.createElement('button'); b.type = 'button'; b.className = 'sel'; b.innerHTML = 'Gira la chiave<small>accendi il motore sul cavalletto</small>'; b.addEventListener('click', accendi); tray.appendChild(b); }
        else if (st.done) { const b = document.createElement('button'); b.type = 'button'; b.className = 'sel'; b.innerHTML = 'Fatto<small>il motore va in magazzino</small>'; b.addEventListener('click', chiudi); tray.appendChild(b); }
      }
    };
    const pick = (k, b) => {
      if (st.anim || st.run) return;
      const want = ORDER[st.upto];
      if (k !== want) { if (b) { b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); } clank(1, 0.5); talk(NICO.no(MOT_CAT[want].label, MOT_CAT[k].label)); return; }
      st.anim = { k, t: 0 }; st.sel = 0; renderTray();
    };
    const accendi = () => {
      // si paga e il motore entra in magazzino adesso: è montato e funziona
      const r = game.motBuild(sel);
      if (!r.ok) { talk(r.why); return; }
      st.built = r; st.run = 0.01; ctx.save && ctx.save();
      talk('Contatto... gira, gira... ECCOLO! Senti che voce. ' + (c.rel < 0.6 ? 'Però occhio: così spinto, se lo tiri troppo si rompe.' : 'Questo dura una vita.'));
      st.snd = startSound(c.cyl, c.lope);
      setTimeout(() => { st.done = true; renderTray(); }, 4300);
      renderTray();
    };
    const chiudi = () => {
      if (st.snd) st.snd.stop();
      cancelAnimationFrame(st.raf); box.remove(); window.removeEventListener('keydown', key, true);
      if (st.built) ctx.flash(`${st.built.e.nome}: ${c.hp} CV. Ora montalo su un'auto (I tuoi motori)`, 3.2);
      ctx.refresh();
    };
    const key = (e) => {
      e.stopPropagation(); e.preventDefault();
      const left = order.filter((k) => ORDER.indexOf(k) >= st.upto);
      if (e.key === 'Escape') { chiudi(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { st.sel = Math.min(left.length - 1, st.sel + 1); renderTray(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { st.sel = Math.max(0, st.sel - 1); renderTray(); }
      if (e.key === 'Enter' || e.key === ' ') { if (left.length) pick(left[st.sel], buttons[left[st.sel]]); else if (!st.run) accendi(); else if (st.done) chiudi(); }
    };
    window.addEventListener('keydown', key, true);
    box.querySelector('[data-x]').addEventListener('click', chiudi);
    renderTray();
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000), t = (now - st.t0) / 1000; last = now;
      const W = 640, H = 360, r = cv.getBoundingClientRect(), sc = Math.max(1, Math.floor(Math.min(r.width / W, r.height / H) * (window.devicePixelRatio || 1) * 2) / 2);
      if (cv.width !== Math.round(r.width * (window.devicePixelRatio || 1))) { cv.width = Math.round(r.width * (window.devicePixelRatio || 1)); cv.height = Math.round(r.height * (window.devicePixelRatio || 1)); }
      const k = Math.min(cv.width / W, cv.height / H); g.setTransform(k, 0, 0, k, (cv.width - W * k) / 2, (cv.height - H * k) / 2); g.imageSmoothingEnabled = false;
      void sc;
      // officina: muro, pavimento, lampada
      R(g, -200, -200, W + 400, H + 400, '#07060a'); R(g, 0, 0, W, 250, '#21140f');
      for (let y = 0; y < 250; y += 10) for (let x = (y / 10) % 2 ? -12 : 0; x < W; x += 24) R(g, x + 1, y + 1, 22, 8, ['#3a2018', '#321c16', '#42261c'][Math.floor(rnd(x * 0.7 + y) * 3)]);
      R(g, 0, 250, W, 110, '#2e2e34'); for (let x = 0; x < W; x += 40) R(g, x, 250, 1, 110, '#26262c');
      g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createRadialGradient(320, 40, 10, 320, 220, 260); lg.addColorStop(0, 'rgba(255,220,160,.28)'); lg.addColorStop(1, 'rgba(255,220,160,0)'); g.fillStyle = lg; g.fillRect(0, 0, W, H); g.restore();
      R(g, 300, 20, 40, 10, '#1a1a1e'); R(g, 304, 29, 32, 3, '#ffe2a8');
      // il pezzo che sta entrando: scende dall'alto e si posa, poi i bulloni
      if (st.anim) {
        st.anim.t += dt;
        if (st.anim.t > 0.55 && !st.anim.c) { st.anim.c = 1; clank(3 + (st.anim.k === 'blocco' ? 2 : 0)); }
        if (st.anim.t > 1.0) { st.upto++; const k2 = st.anim.k; st.anim = null; talk(st.upto >= ORDER.length ? 'Ecco, è tutto montato. Adesso la prova del nove: gira la chiave.' : NICO.ok[Math.floor(rnd(st.upto * 3.3) * NICO.ok.length)] + ` (${MOT_CAT[k2].label.toLowerCase()} a posto: ora ${MOT_CAT[ORDER[st.upto]].label.toLowerCase()})`); renderTray(); }
      }
      const upto = st.upto + (st.anim ? Math.min(1, st.anim.t / 0.55) * 0.999 : 0);
      // il motore grande al centro (scala 1,6), il pezzo nuovo che scende dall'alto
      const big = (u, run2, dy = 0, only) => { g.save(); g.translate(320, 334 + dy); g.scale(1.6, 1.6); drawEngine(g, 0, 0, sel, u, t, run2, only); g.restore(); };
      if (st.anim) { const f = Math.min(1, st.anim.t / 0.55), e2 = 1 - Math.pow(1 - f, 3); big(st.upto, 0); big(st.upto + 1, 0, -(1 - e2) * 160, st.anim.k); }
      else big(upto, st.run ? 6 : 0);
      // l'avviamento: i giri salgono e scendono come le sgasate
      if (st.run) { st.run += dt; }
      // numeri del progetto in basso a sinistra
      g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(12, 10, 200, 50); g.fillStyle = '#ff9a5a'; g.font = '400 18px "Saira Stencil One", "Russo One", sans-serif'; g.fillText(`${c.hp} CV · ${c.nm} Nm`, 20, 32);
      g.fillStyle = '#c8c4cc'; g.font = '12px "Share Tech Mono", monospace'; g.fillText(`${c.tipo} · ${fmt(c.lim)} giri · ${c.kg} kg`, 20, 50);
      g.fillStyle = '#c8c4cc'; g.fillText(`pezzi montati ${st.upto}/${ORDER.length}`, 470, 50);
      st.raf = requestAnimationFrame(loop);
    };
    st.raf = requestAnimationFrame(loop);
  }

  window.NightMotori = { panel, banco, drawEngine, tab(name) { const b = document.getElementById('placeBody'); if (!b) return; const el = [...b.querySelectorAll('h4')].find((n) => n.textContent.startsWith(name)); if (el) el.scrollIntoView({ behavior: 'smooth' }); } };
})();
