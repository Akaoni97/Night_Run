// ============================================================================
//  Night Run · Interni in alta definizione (dopo interni.js)
//  Le scene rifatte con più dettaglio: doppia densità (ss 2, come la strada in qualità alta: si disegna a mezze unità
//  sulle coordinate 640×360), tre piani di profondità (fondo, chi ti serve, bancone e oggetti in primo piano tagliati dal
//  bordo), materiali con 3-4 toni per colore (ombre verso il blu-viola, luci verso il giallo), luci vere (lampade con il
//  cono e la pozza, insegne, frigo, fari delle auto che passano e scorrono sui muri), persone disegnate come il
//  protagonista (pgStanding di personaggio.js) e piccole animazioni.
//  Tutti e nove: bar (Nabir), benzinaio (Rossana), Sosta 24 (Phill Grill), Motel 4Ever (Tito), Officina Nico, Luca, Russian Kùstòm (Jeshka), Autosalone (Rocco Lostallone), sfascio (Massimo Lo Sfascio).
//  Scritte col carattere 5×7 leggibile (t5, neon5, sign). Le scene vecchie restano in NightInterni.SCENE.<id>_vecchio;
//  per tornare a una: NightInterni.SCENE.fuel = NightInterni.SCENE.fuel_vecchio (o togliere questo file da index.html).
// ============================================================================
(() => {
  const NI = window.NightInterni; if (!NI || !NI.kit || !NI.SCENE) return;
  const { W, H, rng, glow, cone, neon, carPic, traffic, rain, drops, text, textW } = NI.kit;
  const SS = 2;
  // rettangolo a mezze unità (alla doppia densità un'unità sono 2 pixel veri)
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x * SS) / SS, Math.round(y * SS) / SS, Math.round(w * SS) / SS, Math.round(h * SS) / SS); };
  const P = (g, x, y, c, s = 0.5) => R(g, x, y, s, s, c);
  const hex = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
  // rampa di colore con lo spostamento di tinta: ombre verso il blu-viola, luci verso il giallo caldo
  const ramp = (base) => ({ dd: mix(mix(base, '#1a1430', 0.45), '#000000', 0.35), d: mix(base, '#2a2040', 0.35), b: base, l: mix(base, '#fff2c8', 0.3), ll: mix(base, '#fffbe8', 0.6) });
  const smooth = (g, x, y, w, h, stops, vert = true) => { const gr = vert ? g.createLinearGradient(0, y, 0, y + h) : g.createLinearGradient(x, 0, x + w, 0); for (const [o, c] of stops) gr.addColorStop(o, c); g.fillStyle = gr; g.fillRect(x, y, w, h); };
  const ell = (g, x, y, rx, ry, c) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); };
  const INK = '#0b0810';

  // ---------------------------------------------------------------- pezzi d'arredo in HD
  // bottiglia: forma (vino, quadrata, alta, tonda), vetro col colore e la luce da dietro, etichetta, tappo, riflesso
  function bottle(g, x, base, kind, col, r) {
    const C = ramp(col), w = kind === 'tonda' ? 9 : kind === 'quadra' ? 9 : kind === 'alta' ? 6 : 7, h = kind === 'alta' ? 30 : kind === 'tonda' ? 18 : kind === 'quadra' ? 20 : 25;
    const neck = kind === 'quadra' ? 4 : kind === 'tonda' ? 5 : 8, nw = kind === 'tonda' ? 3 : 2.5, top = base - h;
    R(g, x - 0.5, top - 0.5, w + 1, h + 1, INK); R(g, x + (w - nw) / 2 - 0.5, top - neck - 0.5, nw + 1, neck + 1, INK);
    if (kind === 'tonda') { ell(g, x + w / 2, base - h / 2 + 2, w / 2 + 1, h / 2 - 1, INK); ell(g, x + w / 2, base - h / 2 + 2, w / 2 + 0.5, h / 2 - 1.5, C.b); }
    else { R(g, x, top + (kind === 'quadra' ? 0 : 3), w, h - (kind === 'quadra' ? 0 : 3), C.b); if (kind !== 'quadra') { R(g, x + 0.5, top + 1.5, w - 1, 2, C.b); R(g, x + 1.5, top + 0.5, w - 3, 1, C.b); } }
    R(g, x + (w - nw) / 2, top - neck, nw, neck + 1, C.b);
    R(g, x + w - 2, top + 3, 1.5, h - 4, C.d);                                        // lato in ombra
    R(g, x + 1, top + 3, 1, h - 6, C.ll); P(g, x + 1, top + 1.5, '#ffffff');         // riflesso del vetro
    R(g, x + 1, base - 4, w - 2, 2, C.l);                                             // la luce del ripiano da sotto, nel liquido
    const lab = kind === 'alta' ? 0 : 1;
    if (lab || r() < 0.5) { const ly = base - h * 0.55, lc = ['#efe6cc', '#d8c27a', '#1a1a20', '#e8e0d0', '#7a1a1a'][Math.floor(r() * 5)]; R(g, x + 0.5, ly, w - 1, h * 0.28, lc); R(g, x + 1.5, ly + 1.5, w - 3, 0.5, mix(lc, '#000000', 0.4)); R(g, x + 1.5, ly + 3, (w - 3) * 0.6, 0.5, mix(lc, '#000000', 0.3)); R(g, x + 0.5, ly, w - 1, 0.5, mix(lc, '#ffffff', 0.4)); }
    R(g, x + (w - nw) / 2 - 0.5, top - neck - 1.5, nw + 1, 2, ['#c8a040', '#1a1a1a', '#8a1a1a', '#c8ccd4'][Math.floor(r() * 4)]);   // tappo
    return w;
  }
  // ripiano di vetro con la striscia di luce calda sotto e le bottiglie
  function shelf(g, x, y, w, r) {
    let xx = x + 3;
    const kinds = ['vino', 'quadra', 'alta', 'tonda', 'vino', 'vino', 'alta', 'quadra'], cols = ['#2f6a34', '#8a4a1a', '#b88a30', '#3a5a9a', '#8a2030', '#d8d0b0', '#4a2a6a', '#c86a20', '#2a2a30', '#7a9a3a'];
    while (xx < x + w - 10) { const bw = bottle(g, xx, y, kinds[Math.floor(r() * kinds.length)], cols[Math.floor(r() * cols.length)], r); xx += bw + 1.5 + Math.floor(r() * 3); }
    R(g, x, y, w, 2, 'rgba(200,230,240,.55)'); R(g, x, y, w, 0.5, 'rgba(255,255,255,.8)'); R(g, x, y + 2, w, 1, 'rgba(10,8,16,.6)');
  }
  // tazzina col piattino
  function cup(g, x, y, steam) { ell(g, x + 5, y + 6, 8, 1.8, '#d8d4cc'); ell(g, x + 5, y + 5.5, 7.5, 1.4, '#f6f2ea'); R(g, x, y, 10, 5, '#f6f2ea'); R(g, x + 7, y, 3, 5, '#d0ccc4'); R(g, x + 1, y, 1, 4, '#ffffff'); R(g, x, y - 0.5, 10, 1, '#3a1a08'); R(g, x + 10, y + 1, 2.5, 2.5, '#e8e4dc'); R(g, x + 10.5, y + 1.5, 1.5, 1.5, '#9a968e'); }
  // sgabello in primo piano: seduta di pelle rossa, colonna cromata (tagliato dal bordo in basso)
  function stool(g, x, y) {
    R(g, x - 2, y + 6, 4, 60, '#2a2c34'); R(g, x - 2, y + 6, 1.5, 60, '#9aa0ae'); R(g, x + 1, y + 6, 1, 60, '#16181e');
    ell(g, x, y + 30, 14, 2.5, '#1a1c22'); ell(g, x, y + 29.5, 13, 1.8, '#7a808e');                       // anello poggiapiedi
    ell(g, x, y + 3, 24, 7, INK); ell(g, x, y + 2, 23, 6, '#5a1414'); ell(g, x, y + 1, 22, 5, '#8a2020'); ell(g, x - 6, y - 0.5, 9, 2, '#b84a3a'); ell(g, x - 8, y - 1, 4, 1, '#e0806a');
    for (let k = -18; k <= 18; k += 6) P(g, x + k, y + 5 + Math.abs(k) * 0.05, '#3a0a0a', 1);              // bottoni della trapuntatura
  }
  // insegna di carta / poster
  const poster = (g, x, y, w, h, bgc, lines) => { R(g, x - 0.5, y - 0.5, w + 1, h + 1, INK); R(g, x, y, w, h, bgc); for (const [t, c, sc, dy] of lines) text(g, t, x + (w - textW(t, sc)) / 2, y + dy, c, sc); };

  // ---------------------------------------------------------------- IL BAR
  // Nabir, il barista (stessa pixel art del protagonista): ricci, barba corta, camicia; va dalla macchina del caffè alla vetrinetta e torna
  const BARISTA = { pelle: 3, capelli: 'ricci', capCol: 0, testa: 'niente', testaCol: 0, sopra: 'camicia', sopraCol: 3, barba: 'corta', occhiali: 'no' };
  const STAZ = [{ x: 248, s: 4.5, cosa: 'caffe' }, { x: 380, s: 3 }, { x: 512, s: 3.5, cosa: 'brioche' }, { x: 380, s: 2.5 }];
  const WALK = 46;                                          // unità al secondo
  function baristaAt(t) {
    // percorso a tappe che si ripete: ferma, cammina, ferma...
    const legs = []; let T = 0;
    for (let i = 0; i < STAZ.length; i++) { const a = STAZ[i], b = STAZ[(i + 1) % STAZ.length], d = Math.abs(b.x - a.x) / WALK; legs.push({ t0: T, t1: T + a.s, x: a.x, stop: a }); T += a.s; legs.push({ t0: T, t1: T + d, a: a.x, b: b.x }); T += d; }
    const tt = t % T; const L = legs.find((l) => tt >= l.t0 && tt < l.t1) || legs[0];
    if (L.stop) return { x: L.x, walk: false, dir: L.stop.cosa === 'caffe' ? -1 : L.stop.cosa === 'brioche' ? 1 : 1, cosa: L.stop.cosa, k: (tt - L.t0) / (L.t1 - L.t0) };
    const f = (tt - L.t0) / (L.t1 - L.t0); return { x: L.a + (L.b - L.a) * f, walk: true, dir: L.b > L.a ? 1 : -1, ph: (tt - L.t0) * 1.6 };
  }

  const BAR = {
    ss: SS, focus: 235, amb: 'bar', grade: '255,170,90', gradeA: 0.05,
    static(g, r, S) {
      // ---- soffitto a travi e cornicione
      R(g, 0, 0, W, 12, '#140d09'); for (let x = 0; x < W; x += 40) { R(g, x, 0, 26, 10, '#24170e'); R(g, x, 9, 26, 1, '#3a2614'); R(g, x + 25, 0, 1, 10, '#0c0806'); }
      R(g, 0, 12, W, 4, '#3a2618'); R(g, 0, 12, W, 1, '#6a4a2a'); R(g, 0, 15.5, W, 0.5, '#0c0806');
      // ---- carta da parati verde scuro con il motivo damascato (rombi e gigli a mezze unità), più scura in alto
      R(g, 0, 16, W, 136, '#1c332d');
      for (let y = 18, row = 0; y < 150; y += 12, row++) for (let x = (row % 2) * 8; x < W; x += 16) {
        const c = '#24443b', c2 = '#2c5246';
        P(g, x + 3, y, c, 1); P(g, x + 2, y + 1, c, 1); P(g, x + 4, y + 1, c, 1); P(g, x + 1, y + 2, c, 1); P(g, x + 5, y + 2, c, 1); P(g, x + 2, y + 3, c, 1); P(g, x + 4, y + 3, c, 1); P(g, x + 3, y + 4, c, 1);
        P(g, x + 3, y + 2, c2, 1); P(g, x + 3, y + 6, c, 0.5); P(g, x + 3, y + 7, c, 0.5);
      }
      smooth(g, 0, 16, W, 136, [[0, 'rgba(6,4,10,.55)'], [0.45, 'rgba(6,4,10,.12)'], [1, 'rgba(6,4,10,.25)']]);
      R(g, 0, 150, W, 3, '#8a6a30'); R(g, 0, 150, W, 1, '#d8b060'); R(g, 0, 152.5, W, 0.5, '#3a2a10');        // listello d'ottone
      { const B2 = ramp('#3a2212'); R(g, 0, 153, W, 30, B2.d); for (let x = 2; x < W; x += 32) { R(g, x, 156, 28, 24, B2.b); R(g, x, 156, 28, 1, B2.dd); R(g, x, 179, 28, 1, B2.l); R(g, x + 27, 156, 1, 24, B2.l); } smooth(g, 0, 153, W, 30, [[0, 'rgba(6,4,10,.35)'], [1, 'rgba(6,4,10,.6)']]); }   // boiserie sotto lo specchio
      // ---- la vetrina sulla strada (a sinistra), incassata nel muro con lo sguincio
      R(g, 8, 24, 184, 152, '#120c08'); R(g, 10, 26, 180, 148, '#2a1a10');
      R(g, 186, 28, 4, 144, '#3e2818'); R(g, 10, 28, 4, 144, '#1a100a');                                       // sguinci: luce a destra, ombra a sinistra
      NI.kit.outside(g, 14, 30, 172, 136, r, { sky0: '#05061a', sky1: '#21142e' });
      S.carK = 1.24; S.car = carPic(1.24);
      // davanzale di marmo con la pianta e la lavagnetta
      R(g, 6, 168, 188, 6, '#c8c2b6'); R(g, 6, 168, 188, 1, '#f0ece2'); R(g, 6, 173.5, 188, 0.5, '#5a5448');
      R(g, 150, 150, 18, 18, INK); R(g, 151, 151, 16, 17, '#9a4a2a'); R(g, 151, 151, 16, 2, '#c87050'); R(g, 163, 152, 3, 15, '#6a2a14');   // vaso di coccio
      for (let k = 0; k < 26; k++) { const a = -1.4 + k * 0.11, len = 10 + r() * 14; g.strokeStyle = k % 3 ? '#2e6a34' : '#4a8a3a'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(159, 151); g.quadraticCurveTo(159 + Math.cos(a) * len * 0.5, 151 - len * 0.7, 159 + Math.cos(a) * len, 151 - Math.sin(-a) * 2 - len * 0.6); g.stroke(); }
      R(g, 24, 140, 40, 28, '#5a3a1e'); R(g, 26, 142, 36, 24, '#1e2420'); text(g, 'OGGI', 30, 145, '#f0ece2', 1); R(g, 30, 152, 26, 0.5, '#c8c2b6'); R(g, 30, 156, 20, 0.5, '#c8c2b6'); R(g, 30, 160, 24, 0.5, '#e0a0a0');
      // ---- la bacheca di sughero coi lavori: cornice smussata, sughero granuloso, foglietti un po' storti, puntine con l'ombra
      R(g, 197, 23, 96, 92, INK); R(g, 198, 24, 94, 90, '#6a4424'); R(g, 198, 24, 94, 1.5, '#9a6a3a'); R(g, 198, 112.5, 94, 1.5, '#3a2210');
      R(g, 203, 29, 84, 80, '#b88a52');
      for (let k = 0; k < 900; k++) P(g, 203 + r() * 84, 29 + r() * 80, ['#a07440', '#c89a62', '#986a38', '#d4a870'][Math.floor(r() * 4)]);
      smooth(g, 203, 29, 84, 80, [[0, 'rgba(0,0,0,.25)'], [0.15, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,.15)']]);
      const notes = [[208, 35, 25, 20, '#f4f1e6', -0.06], [237, 33, 23, 27, '#ffe9a8', 0.04, true], [264, 37, 20, 18, '#f4f1e6', 0.08], [210, 61, 30, 22, '#cfe8ff', 0.03], [245, 64, 20, 18, '#f4f1e6', -0.07], [269, 59, 14, 22, '#ffd0d8', 0.05], [216, 87, 24, 16, '#f4f1e6', -0.04], [248, 86, 30, 18, '#ffe9a8', 0.06]];
      for (const [x, y, w, h, c, a, first] of notes) {
        g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(a);
        g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-w / 2 + 1.5, -h / 2 + 1.5, w, h);
        g.fillStyle = c; g.fillRect(-w / 2, -h / 2, w, h); g.fillStyle = mix(c, '#000000', 0.08); g.fillRect(-w / 2, h / 2 - 2, w, 2);
        g.fillStyle = '#8a8478'; for (let yy = -h / 2 + 5; yy < h / 2 - 3; yy += 3) g.fillRect(-w / 2 + 2.5, yy, w - 5 - Math.floor(r() * 6), 0.5);
        if (first) { g.strokeStyle = '#4ade80'; g.lineWidth = 1; g.strokeRect(-w / 2 + 0.5, -h / 2 + 0.5, w - 1, h - 1); }
        g.restore();
        const pc = ['#c42a1a', '#2a6ad8', '#2a9a4a', '#e8b030'][Math.floor(r() * 4)]; ell(g, x + w / 2 + 1, y + 3, 1.6, 1, 'rgba(0,0,0,.4)'); ell(g, x + w / 2, y + 2, 1.6, 1.6, pc); P(g, x + w / 2 - 0.5, y + 1.5, '#ffffff');
      }
      // la polaroid della squadra
      g.save(); g.translate(280, 96); g.rotate(-0.12); R(g, -8, -9, 16, 18, '#f4f1e6'); R(g, -6.5, -7.5, 13, 11, '#3a6a8a'); R(g, -6.5, -1, 13, 4.5, '#2a7a3a'); for (let k = 0; k < 5; k++) R(g, -5.5 + k * 2.6, -3.5, 1.5, 3, k % 2 ? '#c42a1a' : '#f4f1e6'); g.restore();
      text(g, 'BACHECA', 228, 17.5, '#e8d8a0', 1);
      // ---- lo specchio dietro al banco con le mensole di vetro e le bottiglie
      R(g, 298, 20, 324, 134, INK); R(g, 300, 22, 320, 130, '#3a2414'); R(g, 300, 22, 320, 1.5, '#7a5030');
      smooth(g, 304, 26, 312, 122, [[0, '#2a2e36'], [0.5, '#1c1e26'], [1, '#121418']]);
      g.save(); g.globalAlpha = 0.07; g.fillStyle = '#ffffff'; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(320 + k * 70, 26); g.lineTo(350 + k * 70, 26); g.lineTo(300 + k * 70, 148); g.lineTo(270 + k * 70, 148); g.closePath(); g.fill(); } g.restore();   // riflessi diagonali
      for (let k = 0; k < 3; k++) shelf(g, 306, 62 + k * 38, 308, r);
      // ---- la tv in alto a destra sulla staffa
      R(g, 584, 4, 4, 8, '#2a2a30'); R(g, 546, 10, 82, 50, INK); R(g, 548, 12, 78, 46, '#202024'); R(g, 551, 15, 72, 38, '#0a0c10');
      // ---- il retro banco: piano scuro col bordo d'ottone, ante di legno a riquadri, il frigo delle bibite
      R(g, 0, 182, W, 6, '#24160c'); R(g, 0, 182, W, 1, '#5a3a20'); R(g, 0, 187, W, 1, '#b08a40');
      const WD = ramp('#4a2c16');
      R(g, 0, 188, W, 62, WD.d);
      for (let x = 4; x < W; x += 66) {
        R(g, x, 192, 60, 54, WD.dd); R(g, x + 0.5, 192.5, 59, 53, WD.b);
        R(g, x + 5, 197, 50, 44, WD.d); R(g, x + 5.5, 197.5, 49, 43, WD.b); R(g, x + 5, 197, 50, 1, WD.dd); R(g, x + 5, 240.5, 50, 1, WD.l); R(g, x + 54.5, 197, 1, 44, WD.l);   // riquadro in rilievo
        for (let k = 0; k < 6; k++) R(g, x + 8 + r() * 44, 200 + r() * 36, 1, 4 + r() * 8, WD.l);          // venature
        ell(g, x + 30, 218, 1.6, 1.6, '#d8b060'); P(g, x + 29.5, 217.5, '#fff2c0');
      }
      R(g, 418, 190, 76, 58, INK); R(g, 420, 192, 72, 54, '#c8ccd4'); R(g, 420, 192, 72, 1, '#ffffff');      // frigo inox
      R(g, 424, 196, 64, 46, '#1a3048'); smooth(g, 424, 196, 64, 46, [[0, 'rgba(160,210,255,.35)'], [1, 'rgba(160,210,255,.05)']]);
      for (let k = 0; k < 3; k++) { R(g, 425, 211 + k * 14, 62, 1, '#9ab8d8'); for (let b = 0; b < 9; b++) { const bc = ['#c42a1a', '#e8b030', '#2a9a4a', '#f4f1e6', '#2a6ad8'][(b + k) % 5]; R(g, 427 + b * 6.8, 201 + k * 14, 4.5, 10, bc); R(g, 427.5 + b * 6.8, 202 + k * 14, 1, 8, 'rgba(255,255,255,.5)'); } }
      R(g, 486, 200, 2, 16, '#9aa0ae');
      // ---- macchina del caffè cromata sul retro banco, col macinino accanto
      const mx = 204, my = 130;
      R(g, mx - 1, my - 1, 90, 54, INK);
      smooth(g, mx, my, 88, 52, [[0, '#e8ecf2'], [0.25, '#9aa2ae'], [0.5, '#f4f6fa'], [0.75, '#7a828e'], [1, '#c8ccd4']], false);
      R(g, mx, my, 88, 8, '#2a2a30'); R(g, mx, my, 88, 1, '#6a6a74'); for (let k = 0; k < 6; k++) cup(g, mx + 4 + k * 14, my - 7, false);   // scaldatazze con le tazzine
      R(g, mx, my + 8, 6, 44, '#8a1a1a'); R(g, mx + 82, my + 8, 6, 44, '#6a1010'); R(g, mx, my + 8, 1.5, 44, '#c84a3a');   // fianchi rossi
      ell(g, mx + 44, my + 18, 6, 6, INK); ell(g, mx + 44, my + 18, 5, 5, '#f4f1e6'); R(g, mx + 44, my + 15, 0.6, 3.5, '#c42a1a'); text(g, 'ESPRESSO', mx + 28, my + 27, '#5a1010', 1);
      for (let k = 0; k < 3; k++) { const gx = mx + 14 + k * 26; R(g, gx - 1, my + 34, 14, 7, INK); R(g, gx, my + 35, 12, 5, '#c8ccd4'); R(g, gx, my + 35, 12, 1, '#ffffff'); R(g, gx + 10, my + 37, 12, 2.5, '#1a1a1e'); R(g, gx + 4, my + 40, 4, 3, '#5a5e66'); }
      R(g, mx + 70, my + 30, 1.5, 16, '#c8ccd4');                                   // lancia del vapore
      R(g, mx - 18, my + 8, 14, 44, INK); R(g, mx - 17, my + 22, 12, 30, '#2a2a30'); R(g, mx - 17, my + 22, 3, 30, '#4a4a54');   // macinino
      g.fillStyle = INK; g.beginPath(); g.moveTo(mx - 19, my + 8); g.lineTo(mx - 3, my + 8); g.lineTo(mx - 7, my + 22); g.lineTo(mx - 15, my + 22); g.closePath(); g.fill();
      g.fillStyle = 'rgba(200,220,240,.35)'; g.beginPath(); g.moveTo(mx - 18, my + 9); g.lineTo(mx - 4, my + 9); g.lineTo(mx - 7.5, my + 21); g.lineTo(mx - 14.5, my + 21); g.closePath(); g.fill();
      for (let k = 0; k < 30; k++) ell(g, mx - 11 + (r() - 0.5) * 9, my + 14 + r() * 7, 1, 0.7, ['#3a1a08', '#5a2a10', '#2a1206'][k % 3]);   // chicchi
      // ---- insegne e quadretti sul muro
      poster(g, 568, 66, 44, 30, '#e8e0c8', [['LOTTERIA', '#c42a1a', 1, 4], ['GRATTA', '#1a1a1a', 1, 13], ['E VINCI', '#1a1a1a', 1, 20]]);
      // ---- primo piano: si disegna in dyn (dopo il barista), qui solo in cache
      S.front = document.createElement('canvas'); S.front.width = W * SS; S.front.height = H * SS;
      const f = S.front.getContext('2d'); f.setTransform(SS, 0, 0, SS, 0, 0); f.imageSmoothingEnabled = false; front(f, rng(77));
    },
    dyn(g, t, S) {
      // fuori: il traffico, la tua auto sotto il lampione, la pioggia
      g.save(); g.beginPath(); g.rect(14, 30, 172, 136); g.clip();
      traffic(g, 14, 30, 172, 136, t, 2);
      if (S.car) g.drawImage(S.car, 34, 166 - S.car.height / SS + 8, S.car.width / SS, S.car.height / SS);
      R(g, 148, 64, 3, 102, '#2a2d38'); R(g, 138, 62, 18, 4, '#3a3e4a'); glow(g, 148, 68, 50, '255,207,122', 0.5); cone(g, 148, 68, 10, 74, 98, '255,207,122', 0.18);
      rain(g, 14, 30, 172, 136, t, 0.28);
      g.restore();
      drops(g, 14, 30, 172, 136, rng(5)); NI.kit.frame(g, 14, 30, 172, 136, '#3a2416', 2, 1);
      // riflesso dell'interno sul vetro (le lampade) e insegna al neon appesa
      glow(g, 70, 60, 26, '255,190,110', 0.12); glow(g, 120, 46, 20, '255,190,110', 0.08);
      const fl = Math.sin(t * 13) * Math.sin(t * 7.1) > 0.86 ? 0.2 : 1;
      R(g, 30, 32, 0.5, 8, '#1a1a1a'); R(g, 62, 32, 0.5, 8, '#1a1a1a'); neon(g, 'BAR', 28, 40, '255,90,60', 3, fl);
      // tv: la partita
      R(g, 551, 15, 72, 38, '#2a7a3a'); R(g, 551, 33.5, 72, 0.5, '#e8f0e8'); ell(g, 587, 34, 6, 6, 'rgba(232,240,232,.5)'); ell(g, 587, 34, 5.5, 5.5, '#2a7a3a');
      for (let k = 0; k < 8; k++) { const px = 553 + ((k * 13 + t * (k % 2 ? 9 : -7)) % 68 + 68) % 68; R(g, px, 18 + (k * 7) % 31, 1.5, 3, k % 2 ? '#c43a2a' : '#f4f1e6'); }
      R(g, 551, 15, 72, 38, `rgba(255,255,255,${0.03 + 0.03 * Math.sin(t * 20)})`); glow(g, 587, 50, 46, '120,220,140', 0.1);
      // Nabir dietro al banco
      const B = baristaAt(t);
      if (typeof pgStanding === 'function') {
        g.save();
        if (B.dir < 0) { g.translate(B.x * 2, 0); g.scale(-1, 1); }
        pgStanding(g, B.x, 330, 1.95, B.ph || 0, B.walk, BARISTA, 0.18, t + 3.1, 'idle');
        g.restore();
      }
      // al caffè: sbuffi di vapore dal gruppo; alla vetrinetta: niente (sceglie la brioche)
      if (B.cosa === 'caffe' && B.k > 0.2) for (let k = 0; k < 7; k++) { const d = ((t * 24 + k * 6) % 34); g.fillStyle = `rgba(235,235,245,${0.4 * (1 - d / 34)})`; ell(g, 276 + Math.sin(k + t * 2) * 3, 168 - d, 1.5 + d / 9, 1.5 + d / 9, g.fillStyle); }
      // il primo piano: bancone, vetrinetta, sgabelli
      g.drawImage(S.front, 0, 0, W, H);
      // vapore dalla tazzina sul bancone
      for (let k = 0; k < 4; k++) { const d = ((t * 8 + k * 5) % 20); g.fillStyle = `rgba(240,240,240,${0.32 * (1 - d / 20)})`; ell(g, 389 + Math.sin(t * 2 + k) * 2, 236 - d, 1 + d / 14, 1 + d / 14, g.fillStyle); }
      // ---- luci: lampade a sospensione di vetro verde, coni, pozze sul marmo, bagliore del frigo e delle mensole
      for (const lx of [96, 300, 476]) {
        R(g, lx - 0.25, 0, 0.5, 34, '#1a1a1a');
        g.fillStyle = INK; g.beginPath(); g.moveTo(lx - 15, 47); g.quadraticCurveTo(lx, 30, lx + 15, 47); g.closePath(); g.fill();
        g.fillStyle = '#1e5a34'; g.beginPath(); g.moveTo(lx - 14, 46.5); g.quadraticCurveTo(lx, 31, lx + 14, 46.5); g.closePath(); g.fill();
        g.fillStyle = '#3a8a52'; g.beginPath(); g.moveTo(lx - 9, 42); g.quadraticCurveTo(lx - 4, 35, lx, 35); g.lineTo(lx - 2, 38); g.closePath(); g.fill();
        R(g, lx - 14, 46.5, 28, 1, '#c8a040'); ell(g, lx, 48, 6, 1.5, '#fff2c8');
        glow(g, lx, 50, 64, '255,200,120', 0.4, 0.6); cone(g, lx, 48, 24, 150, 196, '255,196,120', 0.075);
        g.save(); g.globalCompositeOperation = 'lighter'; glow(g, lx, 249, 48, '255,220,160', 0.16, 0.08); g.restore();
      }
      glow(g, 456, 220, 60, '150,200,255', 0.12, 0.7);                                // il frigo
      for (let k = 0; k < 3; k++) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, 62 + k * 38, 0, 62 + k * 38 - 30); gr.addColorStop(0, 'rgba(255,170,90,.22)'); gr.addColorStop(1, 'rgba(255,170,90,0)'); g.fillStyle = gr; g.fillRect(304, 32 + k * 38, 312, 30); g.restore(); }
      // i fari di un'auto che passa fuori: una lama di luce che scorre sul muro e sulle bottiglie
      const pass = (t % 9) / 9;
      if (pass < 0.35) { const px = -120 + pass / 0.35 * (W + 240); g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(px - 60, 0, px + 60, 0); gr.addColorStop(0, 'rgba(255,245,220,0)'); gr.addColorStop(0.5, 'rgba(255,245,220,.09)'); gr.addColorStop(1, 'rgba(255,245,220,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(px - 50, 16); g.lineTo(px + 70, 16); g.lineTo(px + 30, 182); g.lineTo(px - 90, 182); g.closePath(); g.fill(); g.restore(); }
      // falena intorno alla lampada di mezzo
      const ma = t * 3.1; ell(g, 300 + Math.cos(ma) * 9 + Math.sin(ma * 2.3) * 3, 56 + Math.sin(ma * 1.4) * 5, 1, 0.7, '#e8e0c8');
    },
    hot: [{ x: 198, y: 24, w: 94, h: 90, label: 'Bacheca dei lavori', go: 'Bacheca' }, { x: 0, y: 238, w: 640, h: 30, label: 'Nabir · bancone', go: 'Al bancone' }, { x: 186, y: 122, w: 108, h: 62, label: 'Caffè', go: 'Al bancone' }, { x: 14, y: 30, w: 172, h: 136, label: 'La tua auto', go: 'close' }],
  };
  // il primo piano del bar (disegnato una volta): bancone di marmo e legno, vetrinetta delle brioche, oggetti, sgabelli
  function front(g, r) {
    // piano di marmo: venature, bordo stondato con la luce, ombra sotto
    R(g, 0, 244, W, 12, '#d9d4ca');
    for (let k = 0; k < 26; k++) { let x = r() * W, y = 245 + r() * 10; g.strokeStyle = r() < 0.5 ? 'rgba(120,116,110,.35)' : 'rgba(160,150,140,.3)'; g.lineWidth = 0.5; g.beginPath(); g.moveTo(x, y); for (let s = 0; s < 4; s++) { x += 6 + r() * 14; y += (r() - 0.5) * 3; g.lineTo(x, Math.max(244.5, Math.min(255.5, y))); } g.stroke(); }
    R(g, 0, 244, W, 1, '#fffcf4'); R(g, 0, 254, W, 2, '#b8b2a6'); R(g, 0, 256, W, 1.5, '#5a544a'); R(g, 0, 257.5, W, 2, 'rgba(10,6,12,.55)');
    // fronte di legno a riquadri in rilievo (luce in alto a sinistra), zoccolo scuro, poggiapiedi d'ottone sulle staffe
    const WD = ramp('#6a3a18');
    R(g, 0, 259, W, 101, WD.d);
    for (let x = 6; x < W; x += 106) {
      R(g, x, 266, 98, 66, WD.dd); R(g, x + 1, 267, 96, 64, WD.b);
      R(g, x + 1, 267, 96, 1.5, WD.l); R(g, x + 1, 267, 1.5, 64, WD.l); R(g, x + 1, 329.5, 96, 1.5, WD.dd); R(g, x + 95.5, 267, 1.5, 64, WD.dd);
      R(g, x + 9, 275, 80, 48, WD.d); R(g, x + 9.5, 275.5, 79, 47, WD.b); R(g, x + 9, 275, 80, 1, WD.dd); R(g, x + 9, 322, 80, 1, WD.ll); R(g, x + 88, 275, 1, 48, WD.l);
      for (let k = 0; k < 14; k++) { const vx = x + 12 + r() * 74, vy = 278 + r() * 42; R(g, vx, vy, 1, 3 + r() * 9, r() < 0.5 ? WD.l : WD.d); }
    }
    R(g, 0, 340, W, 20, '#1e120a'); R(g, 0, 340, W, 1, '#3a2414');
    for (let x = 40; x < W; x += 140) { R(g, x, 330, 3, 10, '#8a6a30'); R(g, x, 330, 1, 10, '#e8c870'); }
    R(g, 0, 334, W, 5, '#8a6a30'); R(g, 0, 334, W, 1.5, '#f0d488'); R(g, 0, 335.5, W, 0.5, '#fff6d0'); R(g, 0, 338, W, 1, '#4a3418');
    // vetrinetta delle brioche sul banco: vetro curvo, luce calda dentro, cornetti e paste in due file, cartellini
    const vx = 466, vy = 212;
    R(g, vx - 1, vy - 1, 104, 34, INK); R(g, vx, vy, 102, 32, '#3a2616'); R(g, vx, vy + 28, 102, 4, '#c8a040');
    smooth(g, vx + 2, vy + 2, 98, 26, [[0, 'rgba(255,230,180,.55)'], [1, 'rgba(255,200,130,.25)']]);
    for (let row = 0; row < 2; row++) { R(g, vx + 3, vy + 13 + row * 13, 96, 1, '#e8e0d0'); for (let k = 0; k < 7; k++) {
      const cx = vx + 9 + k * 13.5, cy = vy + 10 + row * 13;
      if ((k + row) % 3 === 0) { ell(g, cx, cy, 5.5, 2.6, '#7a3a10'); ell(g, cx, cy - 0.5, 5, 2.2, '#c87a2a'); for (let s = -3; s <= 3; s += 2) R(g, cx + s, cy - 2, 0.5, 4, '#8a4a18'); ell(g, cx - 1.5, cy - 1.5, 2, 0.6, '#f0b060'); }   // cornetto
      else if ((k + row) % 3 === 1) { ell(g, cx, cy, 4.5, 2.8, '#d8a040'); ell(g, cx, cy - 1, 3, 1.4, '#7a2a1a'); P(g, cx - 1, cy - 1.5, '#e85a3a', 1); }   // crostatina
      else { ell(g, cx, cy, 4.8, 2.6, '#e8d8b8'); ell(g, cx, cy - 1, 3.5, 1.2, '#ffffff'); }   // bombolone
    } }
    g.fillStyle = 'rgba(220,240,255,.18)'; g.beginPath(); g.moveTo(vx, vy + 28); g.quadraticCurveTo(vx + 4, vy - 10, vx + 30, vy - 2); g.lineTo(vx + 30, vy); g.quadraticCurveTo(vx + 8, vy - 4, vx + 4, vy + 28); g.closePath(); g.fill();
    R(g, vx + 2, vy + 2, 98, 0.5, 'rgba(255,255,255,.7)'); R(g, vx + 6, vy + 3, 0.5, 22, 'rgba(255,255,255,.4)');
    for (let k = 0; k < 3; k++) { R(g, vx + 12 + k * 32, vy + 30, 12, 6, '#f4f1e6'); text(g, ['1,20', '1,50', '1,00'][k], vx + 13 + k * 32, vy + 31, '#1a1a1a', 1); }
    // sul banco: la tazzina col piattino, lo zuccheriere di vetro, il porta tovaglioli, il giornale piegato
    cup(g, 382, 238, true);
    R(g, 424, 230, 12, 15, 'rgba(210,230,240,.55)'); R(g, 424, 238, 12, 7, '#f4f1e6'); R(g, 423, 228, 14, 3, '#c8ccd4'); R(g, 425, 231, 1, 12, 'rgba(255,255,255,.7)');
    R(g, 444, 232, 14, 13, '#c8ccd4'); R(g, 445.5, 228, 11, 12, '#f8f6f0'); R(g, 444, 232, 14, 1, '#ffffff');
    g.save(); g.translate(120, 241); g.rotate(-0.05); R(g, -24, -4, 48, 8, '#e8e2cc'); R(g, -24, -4, 48, 1, '#ffffff'); R(g, 0, -4, 0.5, 8, '#c8c0a8'); text(g, 'GAZZETTA', -20, -3, '#c43a6a', 1); g.restore();
    // gli sgabelli in primo piano (tagliati dal bordo in basso)
    stool(g, 150, 312); stool(g, 352, 316); stool(g, 560, 314);
    // l'ombra del primo piano sul pavimento e una leggera vignettatura in basso
    smooth(g, 0, 330, W, 30, [[0, 'rgba(6,4,10,0)'], [1, 'rgba(6,4,10,.55)']]);
  }


  // ================================================================ attrezzi comuni per gli altri interni
  // carattere a pixel 5×7, leggibile (insegne, prezzi, display): px = lato di un pixel in unità (0,5 = un pixel vero)
  const F5 = { A: [14, 17, 17, 31, 17, 17, 17], B: [30, 17, 17, 30, 17, 17, 30], C: [14, 17, 16, 16, 16, 17, 14], D: [30, 17, 17, 17, 17, 17, 30], E: [31, 16, 16, 30, 16, 16, 31], F: [31, 16, 16, 30, 16, 16, 16], G: [14, 17, 16, 23, 17, 17, 15], H: [17, 17, 17, 31, 17, 17, 17], I: [14, 4, 4, 4, 4, 4, 14], J: [7, 2, 2, 2, 2, 18, 12], K: [17, 18, 20, 24, 20, 18, 17], L: [16, 16, 16, 16, 16, 16, 31], M: [17, 27, 21, 21, 17, 17, 17], N: [17, 17, 25, 21, 19, 17, 17], O: [14, 17, 17, 17, 17, 17, 14], P: [30, 17, 17, 30, 16, 16, 16], Q: [14, 17, 17, 17, 21, 18, 13], R: [30, 17, 17, 30, 20, 18, 17], S: [15, 16, 16, 14, 1, 1, 30], T: [31, 4, 4, 4, 4, 4, 4], U: [17, 17, 17, 17, 17, 17, 14], V: [17, 17, 17, 17, 17, 10, 4], W: [17, 17, 17, 21, 21, 21, 10], X: [17, 17, 10, 4, 10, 17, 17], Y: [17, 17, 17, 10, 4, 4, 4], Z: [31, 1, 2, 4, 8, 16, 31],
    0: [14, 17, 19, 21, 25, 17, 14], 1: [4, 12, 4, 4, 4, 4, 14], 2: [14, 17, 1, 2, 4, 8, 31], 3: [31, 2, 4, 2, 1, 17, 14], 4: [2, 6, 10, 18, 31, 2, 2], 5: [31, 16, 30, 1, 1, 17, 14], 6: [6, 8, 16, 30, 17, 17, 14], 7: [31, 1, 2, 4, 8, 8, 8], 8: [14, 17, 17, 14, 17, 17, 14], 9: [14, 17, 17, 15, 1, 2, 12],
    '.': [0, 0, 0, 0, 0, 12, 12], ',': [0, 0, 0, 0, 12, 4, 8], ':': [0, 12, 12, 0, 12, 12, 0], '-': [0, 0, 0, 31, 0, 0, 0], '/': [1, 1, 2, 4, 8, 16, 16], '€': [7, 8, 30, 8, 30, 8, 7], "'": [4, 4, 8, 0, 0, 0, 0], '!': [4, 4, 4, 4, 4, 0, 4], '?': [14, 17, 1, 2, 4, 0, 4], '%': [24, 25, 2, 4, 8, 19, 3], '+': [0, 4, 4, 31, 4, 4, 0], '·': [0, 0, 0, 4, 0, 0, 0], ' ': [0, 0, 0, 0, 0, 0, 0] };
  const tw5 = (s, px = 0.5) => String(s).length * 6 * px - px;
  function t5(g, s, x, y, col, px = 0.5, shadow) {
    let cx = x; g.fillStyle = col;
    for (const ch of String(s).toUpperCase()) { const f = F5[ch] || F5[' '];
      if (shadow) { g.fillStyle = shadow; for (let r2 = 0; r2 < 7; r2++) for (let c = 0; c < 5; c++) if (f[r2] & (16 >> c)) g.fillRect(cx + c * px + px, y + r2 * px + px, px, px); g.fillStyle = col; }
      for (let r2 = 0; r2 < 7; r2++) for (let c = 0; c < 5; c++) if (f[r2] & (16 >> c)) g.fillRect(cx + c * px, y + r2 * px, px, px);
      cx += 6 * px; }
    return cx - x;
  }
  // scritta al neon col carattere leggibile: tubo colorato, anima bianca, alone
  function neon5(g, s, x, y, rgb, px, on) {
    const w = tw5(s, px), lit = on > 0.1;
    if (lit) glow(g, x + w / 2, y + px * 3.5, w * 0.65, rgb, 0.32 * on, 0.45);
    t5(g, s, x + px * 0.5, y + px * 0.5, 'rgba(0,0,0,.55)', px);
    t5(g, s, x, y, lit ? `rgb(${rgb})` : '#4a4458', px);
    if (lit) { g.save(); g.globalAlpha = 0.4 * on; t5(g, s, x, y, '#ffffff', px); g.restore(); }   // l'anima chiara del tubo, sopra le stesse lettere
  }
  // cartello: fondo, bordo, righe di testo centrate [testo, colore, px, dy]
  function sign(g, x, y, w, h, bgc, lines, border = INK) { R(g, x - 0.5, y - 0.5, w + 1, h + 1, border); R(g, x, y, w, h, bgc); R(g, x, y, w, 0.5, mix(bgc, '#ffffff', 0.3)); for (const [s, c, px, dy] of lines) t5(g, s, x + (w - tw5(s, px)) / 2, y + dy, c, px); }
  // piastrelle (muri o pavimenti dritti) con le fughe e un po' di variazione
  function tiles(g, x, y, w, h, tw, th, base, grout, r, offset) {
    R(g, x, y, w, h, grout);
    for (let yy = y, row = 0; yy < y + h; yy += th, row++) for (let xx = x - (offset && row % 2 ? tw / 2 : 0); xx < x + w; xx += tw) {
      const c = mix(base, r() < 0.5 ? '#ffffff' : '#000000', r() * 0.06); R(g, Math.max(x, xx + 0.5), yy + 0.5, Math.min(tw - 1, x + w - xx - 0.5), th - 1, c); R(g, Math.max(x, xx + 0.5), yy + 0.5, Math.min(tw - 1, x + w - xx - 0.5), 0.5, mix(c, '#ffffff', 0.25)); }
  }
  // pavimento in prospettiva: righe che si allargano verso chi guarda, fughe che vanno al punto di fuga
  function floorP(g, y0, y1, c0, c1, r, vx = W / 2) {
    R(g, 0, y0, W, y1 - y0, c0);
    let y = y0, k = 0; while (y < y1) { const hh = 2 + (y - y0) * 0.16; R(g, 0, y, W, hh, k % 2 ? c0 : c1); R(g, 0, y, W, 0.5, mix(c1, '#000000', 0.25)); y += hh; k++; }
    g.strokeStyle = mix(c1, '#000000', 0.3); g.lineWidth = 0.5; for (let i = -14; i <= 14; i++) { g.beginPath(); g.moveTo(vx + i * 22, y0); g.lineTo(vx + i * 22 * (1 + (y1 - y0) / 40), y1); g.stroke(); }
    smooth(g, 0, y0, W, y1 - y0, [[0, 'rgba(6,4,10,.45)'], [0.5, 'rgba(6,4,10,.1)'], [1, 'rgba(6,4,10,.3)']]);
  }
  // tubo fluorescente col suo corpo e la luce (fl 0..1 per lo sfarfallio)
  function tube(g, x, y, w, fl = 1, rgb = '230,245,255') { R(g, x - 1, y - 1, w + 2, 4, '#2a2c34'); R(g, x, y, w, 2, fl > 0.5 ? '#f4fff8' : '#8a9a92'); if (fl > 0.5) { glow(g, x + w / 2, y + 2, w * 0.9, rgb, 0.22 * fl, 0.45); cone(g, x + w / 2, y + 3, w, w * 2.2, 160, rgb, 0.04 * fl); } }
  // finestra sulla notte (sfondo statico) e quello che passa (in dyn): traffico, la tua auto, la pioggia
  function winStatic(g, x, y, w, h, r, opt) { R(g, x - 4, y - 4, w + 8, h + 8, INK); NI.kit.outside(g, x, y, w, h, r, opt || {}); }
  function winDyn(g, S, x, y, w, h, t, seed, carX, carBase, extra) {
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    if (extra) extra(g);
    traffic(g, x, y, w, h, t, seed);
    if (S.car && carX !== undefined) g.drawImage(S.car, carX, carBase - S.car.height / SS, S.car.width / SS, S.car.height / SS);
    rain(g, x, y, w, h, t, 0.25);
    g.restore(); drops(g, x, y, w, h, rng(seed + 9));
  }
  // una persona (stessa pixel art del protagonista), anche girata a sinistra
  function pg(g, x, foot, s, look, t, o = {}) {
    if (typeof pgStanding !== 'function') return;
    g.save(); if (o.left) { g.translate(x * 2, 0); g.scale(-1, 1); }
    pgStanding(g, x, foot, s, o.ph || 0, !!o.walk, look, o.light ?? 0.15, t + (o.seed || 0), o.pose || 'idle');
    g.restore();
  }
  // va avanti e indietro tra due punti, fermandosi: { x, walk, left }
  function pace(t, a, b, stop = 3, speed = 40) { const d = Math.abs(b - a) / speed, T = 2 * (stop + d), tt = t % T;
    if (tt < stop) return { x: a, walk: false, left: a > b }; if (tt < stop + d) { const f = (tt - stop) / d; return { x: a + (b - a) * f, walk: true, left: b < a, ph: (tt - stop) * 1.6 }; }
    if (tt < 2 * stop + d) return { x: b, walk: false, left: b < a ? false : true }; const f = (tt - 2 * stop - d) / d; return { x: b + (a - b) * f, walk: true, left: a < b, ph: (tt - 2 * stop - d) * 1.6 }; }
  // bancone frontale (primo piano): piano, fronte colorata a pannelli, zoccolo
  function counterFront(g, y, h, top, faceBase, r, opt = {}) {
    const F = ramp(faceBase);
    R(g, 0, y, W, 8, top); R(g, 0, y, W, 1, mix(top, '#ffffff', 0.5)); R(g, 0, y + 7, W, 1, mix(top, '#000000', 0.5)); R(g, 0, y + 8, W, 2, 'rgba(10,6,12,.5)');
    R(g, 0, y + 10, W, h - 10, F.b);
    if (opt.stripes) for (let x = 0; x < W; x += 4) R(g, x, y + 10, 0.5, h - 10, F.d);
    if (opt.band) { R(g, 0, y + opt.band, W, 5, opt.bandCol); R(g, 0, y + opt.band, W, 1, mix(opt.bandCol, '#ffffff', 0.4)); }
    R(g, 0, y + h - 12, W, 12, F.dd); R(g, 0, y + h - 12, W, 1, F.d);
    smooth(g, 0, y + 10, W, h - 10, [[0, 'rgba(6,4,10,.35)'], [0.3, 'rgba(6,4,10,0)'], [1, 'rgba(6,4,10,.35)']]);
  }
  // pacchi sugli scaffali (market): scatole, bottiglie, lattine, con etichette e cartellini dei prezzi
  function stock(g, x, y, w, r, cols) {
    let xx = x + 1; const C = cols || ['#c42a1a', '#2a6ad8', '#e8b030', '#2a9a4a', '#f4f1e6', '#8a2a8a', '#ff7a3a', '#1a1a1a'];
    while (xx < x + w - 6) { const k = r(), c = C[Math.floor(r() * C.length)];
      if (k < 0.5) { const bw = 6 + Math.floor(r() * 5), bh = 9 + Math.floor(r() * 9); R(g, xx - 0.5, y - bh - 0.5, bw + 1, bh + 0.5, INK); R(g, xx, y - bh, bw, bh, c); R(g, xx, y - bh, bw, 1, mix(c, '#ffffff', 0.35)); R(g, xx + bw - 1.5, y - bh, 1.5, bh, mix(c, '#000000', 0.3)); R(g, xx + 1, y - bh * 0.6, bw - 2, bh * 0.25, '#f4f1e6'); xx += bw + 1; }
      else if (k < 0.8) { for (let q = 0; q < 3; q++) { R(g, xx + q * 4 - 0.5, y - 8.5, 4, 8.5, INK); R(g, xx + q * 4, y - 8, 3, 8, c); R(g, xx + q * 4, y - 8, 3, 1, '#c8ccd4'); R(g, xx + q * 4 + 0.5, y - 6, 0.5, 5, 'rgba(255,255,255,.5)'); } xx += 13; }
      else { const bw = 4; R(g, xx - 0.5, y - 15, bw + 1, 15, INK); R(g, xx, y - 12, bw, 12, c); R(g, xx + 1, y - 15, 2, 3, c); R(g, xx + 0.5, y - 10, 1, 8, 'rgba(255,255,255,.5)'); xx += bw + 1.5; } }
    R(g, x, y, w, 2.5, '#8a8f9e'); R(g, x, y, w, 0.5, '#d8dce4');
    for (let px = x + 8; px < x + w - 8; px += 26) { R(g, px, y + 0.5, 9, 3, '#ffe24a'); t5(g, (1 + Math.floor(r() * 4)) + ',' + (Math.floor(r() * 9)) + '0', px + 0.5, y + 0.8, '#1a1a1a', 0.35); }
  }

  const HD = { bar: BAR };
  // chi ti serve in ogni locale (stesse scelte dell'editor del personaggio): Rossana al benzinaio, Phill Grill alla cassa della Sosta 24
  // (cam: il cameriere che passa), Tito al Motel 4Ever, Nico in officina, Luca, Jeshka a Russian Kùstòm, Rocco Lostallone all'Autosalone,
  // Massimo Lo Sfascio allo sfascio
  const LOOK = {
    benz: { pelle: 1, capelli: 'lunghi', capCol: 2, testa: 'niente', testaCol: 0, sopra: 'felpa', sopraCol: 3, barba: 'no', occhiali: 'no' },
    cass: { pelle: 0, capelli: 'rasati', capCol: 2, testa: 'cappellino', testaCol: 0, sopra: 'felpa', sopraCol: 2, barba: 'corta', occhiali: 'no' },
    cam: { pelle: 3, capelli: 'corti', capCol: 1, testa: 'cappellino', testaCol: 1, sopra: 'camicia', sopraCol: 2, barba: 'piena', occhiali: 'no' },
    port: { pelle: 1, capelli: 'ricci', capCol: 4, testa: 'niente', testaCol: 0, sopra: 'camicia', sopraCol: 5, barba: 'corta', occhiali: 'vista', x: { pazzo: true } },   // Tito: vecchio e pazzo
    luca: { pelle: 2, capelli: 'corti', capCol: 0, testa: 'rovescio', testaCol: 5, sopra: 'felpa', sopraCol: 1, barba: 'corta', occhiali: 'no' },
    nico: { pelle: 2, capelli: 'corti', capCol: 0, testa: 'cappellino', testaCol: 2, sopra: 'felpa', sopraCol: 1, barba: 'corta', occhiali: 'sole', x: { canotta: true, tatuaggi: true, catena: true } },   // Nico: giovane, canotta, braccia tatuate, catenina e occhiali da sole
    neon: { pelle: 3, capelli: 'lunghi', capCol: 0, testa: 'niente', testaCol: 0, sopra: 'felpa', sopraCol: 1, barba: 'no', occhiali: 'no' },
    vend: { pelle: 3, capelli: 'rasati', capCol: 0, testa: 'niente', testaCol: 0, sopra: 'pelle', sopraCol: 4, barba: 'corta', occhiali: 'sole', x: { muscoli: true, canotta: true, catena: true } },   // Rocco Lostallone: fisicato, canotta attillata
    ferro: { pelle: 3, capelli: 'lunghi', capCol: 5, testa: 'berretto', testaCol: 2, sopra: 'giubbotto', sopraCol: 5, barba: 'piena', occhiali: 'no', x: { barbone: true } },   // Massimo Lo Sfascio: barbone
  };
  const frontCache = (S, fn) => { S.front = document.createElement('canvas'); S.front.width = W * SS; S.front.height = H * SS; const f = S.front.getContext('2d'); f.setTransform(SS, 0, 0, SS, 0, 0); f.imageSmoothingEnabled = false; fn(f, rng(91)); };
  // pompa di benzina (vista da dentro, oltre la vetrata)
  const pump = (g, x, y, h) => { R(g, x - 0.5, y - 0.5, 19, h + 1, INK); R(g, x, y, 18, h, '#e8ecf0'); R(g, x, y, 18, 6, '#c42a1a'); R(g, x, y + 6, 18, 0.5, '#7a1010'); R(g, x + 3, y + 9, 12, 8, '#0a1a14'); t5(g, '1,84', x + 3.5, y + 11, '#7aff9a', 0.42); R(g, x + 15, y + 20, 3, 10, '#2a2a30'); R(g, x + 2, y + h - 4, 14, 4, '#9aa0ae'); R(g, x + 16, y + 14, 1, 14, '#1a1a1a'); };

  // ---------------------------------------------------------------- BENZINAIO: chiosco notturno, piastrelle bianche, muro delle sigarette,
  // frigo delle bibite, i prezzi a led, il ragazzo col berretto al telefono
  HD.fuel = {
    ss: SS, focus: 330, amb: 'fuel', grade: '120,230,255', gradeA: 0.05,
    static(g, r, S) {
      R(g, 0, 0, W, 8, '#3a3e48'); R(g, 0, 7.5, W, 0.5, '#1a1c22');
      tiles(g, 0, 8, W, 232, 10, 10, '#e2e6e4', '#b4b8b6', r);
      smooth(g, 0, 8, W, 232, [[0, 'rgba(10,14,24,.25)'], [0.4, 'rgba(10,14,24,0)'], [1, 'rgba(10,14,24,.2)']]);
      R(g, 0, 150, W, 4, '#1a6aa8'); R(g, 0, 150, W, 1, '#2ee6ff');                                         // fascia blu della compagnia
      winStatic(g, 10, 20, 290, 150, r, { sky0: '#040610', sky1: '#10162a', road: '#22242e' }); NI.kit.frame(g, 10, 20, 290, 150, '#5a5e6e', 3, 1);
      S.carK = 1.2; S.car = carPic(1.2);
      // tabellone dei prezzi a led
      R(g, 329, 7, 162, 46, INK); R(g, 330, 8, 160, 44, '#0a0a10'); t5(g, 'BENZINA', 336, 15, '#ffb000', 0.75); t5(g, 'DIESEL', 336, 34, '#ffb000', 0.75); R(g, 330, 30, 160, 0.5, '#2a2a30');
      // muro delle sigarette dietro alla cassa, con l'insegna TABACCHI
      sign(g, 362, 56, 96, 13, '#1a3a8a', [['TABACCHI', '#ffffff', 0.9, 3]]);
      R(g, 328, 72, 164, 104, INK); R(g, 330, 74, 160, 100, '#2a2d34');
      for (let k = 0; k < 40; k++) { const px = 335 + (k % 10) * 15.4, py = 78 + Math.floor(k / 10) * 24, c = ['#f4f1e6', '#c42a1a', '#1a3a9a', '#d8c070', '#2a2a2a', '#e8e8f0'][(k * 7) % 6];
        R(g, px - 0.5, py - 0.5, 13, 20, INK); R(g, px, py, 12, 19, c); R(g, px, py, 12, 5, (k % 3) ? '#c42a1a' : '#1a1a1a'); R(g, px + 2, py + 9, 8, 1, '#8a8478'); R(g, px + 2, py + 12, 6, 0.5, '#8a8478'); R(g, px, py + 16, 12, 3, mix(c, '#000000', 0.15)); }
      for (let k = 0; k < 4; k++) R(g, 330, 98 + k * 24, 160, 1.5, '#5a5e66');
      // frigo delle bibite: due ante di vetro, ripiani, l'insegna
      sign(g, 512, 10, 112, 12, '#c42a1a', [['BIBITE FRESCHE', '#ffffff', 0.7, 3]]);
      R(g, 508, 24, 120, 202, INK); R(g, 510, 26, 116, 198, '#3a3e48'); R(g, 510, 26, 116, 1, '#8a8f9e');
      R(g, 515, 31, 106, 188, '#0c1a26');
      for (let k = 0; k < 5; k++) stock(g, 516, 62 + k * 34, 104, r, ['#c42a1a', '#2a9a4a', '#e8b030', '#f4f1e6', '#2a6ad8', '#ff7a3a']);
      smooth(g, 515, 31, 106, 188, [[0, 'rgba(170,230,255,.18)'], [1, 'rgba(170,230,255,.04)']]);
      R(g, 567, 31, 2, 188, '#8a9aa8'); R(g, 562, 100, 1.5, 40, '#c8ccd4'); R(g, 572, 100, 1.5, 40, '#c8ccd4');
      g.save(); g.globalAlpha = 0.08; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(525, 31); g.lineTo(545, 31); g.lineTo(520, 219); g.lineTo(515, 219); g.closePath(); g.fill(); g.restore();
      // retro banco basso: snack e caramelle
      R(g, 320, 176, 186, 64, '#2a2d34'); R(g, 320, 176, 186, 1, '#5a5e66'); stock(g, 324, 206, 176, r); stock(g, 324, 234, 176, r);
      frontCache(S, (f, rr) => {
        counterFront(f, 244, 116, '#1a1c22', '#1a6aa8', rr, { band: 2, bandCol: '#2ee6ff' });
        t5(f, 'BENZINA 24H', 34, 284, '#ffffff', 2.6, 'rgba(0,0,0,.45)'); t5(f, 'APERTO GIORNO E NOTTE', 36, 312, '#9fdcff', 1);
        sign(f, 300, 276, 70, 34, '#ffd23f', [['LAVAGGIO', '#1a3a8a', 0.8, 5], ['AUTO', '#1a3a8a', 1.4, 15]]); sign(f, 386, 280, 58, 28, '#f4f1e6', [['CAFFE', '#7a2a0a', 1, 5], ['1,20 €', '#c42a1a', 0.9, 16]]);
        sign(f, 460, 278, 76, 30, '#c42a1a', [['RICARICHE', '#ffffff', 0.8, 5], ['TELEFONICHE', '#ffffff', 0.7, 16]]); sign(f, 552, 282, 60, 24, '#2a9a4a', [['ARIA E ACQUA', '#ffffff', 0.55, 5], ['GRATIS', '#ffffff', 1, 13]]);
        for (let k = 0; k < 3; k++) { R(f, 30 + k * 18, 326, 12, 12, '#f4f1e6'); t5(f, ['V', 'M', 'B'][k], 33.5 + k * 18, 329, '#1a3a8a', 0.8); }   // adesivi delle carte
        // registratore di cassa, gratta e vinci, accendini, giornali
        R(f, 339.5, 213.5, 61, 31, INK); R(f, 340, 214, 60, 30, '#2a2d34'); R(f, 344, 218, 36, 10, '#0a2a1a'); for (let k = 0; k < 12; k++) R(f, 344 + (k % 4) * 9, 231 + Math.floor(k / 4) * 4, 7, 3, '#5a5e6e'); R(f, 384, 218, 12, 22, '#3a3e48');
        R(f, 229.5, 207.5, 71, 37, INK); R(f, 230, 208, 70, 36, '#ffd23f'); t5(f, 'GRATTA E VINCI', 234, 211, '#c42a1a', 0.5); for (let k = 0; k < 4; k++) { R(f, 234 + k * 16, 218, 13, 23, ['#ff2e88', '#2ee6ff', '#b8ff3a', '#ff7a3a'][k]); R(f, 236 + k * 16, 222, 9, 4, '#e8e8e8'); t5(f, String(k + 1) + '€', 236 + k * 16, 232, '#1a1a1a', 0.45); }
        R(f, 409.5, 221.5, 41, 23, INK); R(f, 410, 222, 40, 22, '#2a2a30'); for (let k = 0; k < 8; k++) { R(f, 413 + k * 4.5, 225, 3, 16, ['#c42a1a', '#2a6ad8', '#2a9a4a', '#ffd23f'][k % 4]); R(f, 413 + k * 4.5, 225, 3, 2, '#c8ccd4'); }
        R(f, 460, 226, 34, 18, '#e8e2cc'); R(f, 460, 226, 34, 1, '#ffffff'); t5(f, 'GIORNALE', 462, 228, '#c43a6a', 0.45); for (let k = 0; k < 4; k++) R(f, 462, 233 + k * 2.5, 28, 0.5, '#8a8478');
      });
    },
    dyn(g, t, S) {
      winDyn(g, S, 10, 20, 290, 150, t, 3, 92, 172, (x) => {
        R(x, 10, 60, 290, 10, '#e8e4dc'); R(x, 70, 70, 230, 2, '#2ee6ff'); R(x, 10, 69.5, 290, 0.5, '#9aa0ae'); for (let lx = 40; lx < 300; lx += 70) glow(x, lx, 74, 56, '220,250,255', 0.35, 0.6);
        R(x, 60, 70, 4, 100, '#9aa0ae'); R(x, 240, 70, 4, 100, '#9aa0ae'); pump(x, 70, 112, 48); pump(x, 216, 112, 48);
      });
      NI.kit.frame(g, 10, 20, 290, 150, '#5a5e6e', 3, 1);
      const p1 = (1.839 + 0.01 * (Math.floor(t / 7) % 3)).toFixed(3).replace('.', ',');
      t5(g, p1, 420, 12, '#ff4a2a', 1.2); t5(g, '1,679', 420, 31, '#ff4a2a', 1.2); glow(g, 450, 28, 56, '255,74,42', 0.16, 0.5);
      pg(g, 412, 334, 1.95, LOOK.benz, t, { pose: Math.floor(t / 9) % 3 === 2 ? 'idle' : 'phone', left: true, seed: 3 });
      g.drawImage(S.front, 0, 0, W, H);
      R(g, 344, 218, 36, 10, '#0a2a1a'); t5(g, (12 + Math.floor(t / 3) % 7) + ',' + (10 + Math.floor(t * 7) % 89), 346, 220, '#7aff9a', 0.7);
      glow(g, 568, 120, 96, '170,230,255', 0.22, 1.4);
      for (const lx of [120, 330, 520]) tube(g, lx - 40, 2, 80);
    },
    hot: [{ x: 330, y: 62, w: 160, h: 184, label: 'Rossana · cassa', go: 'top' }, { x: 510, y: 24, w: 116, h: 200, label: 'Frigo e market', go: 'top' }, { x: 10, y: 20, w: 290, h: 150, label: 'Pompe', go: 'top' }],
  };

  // ---------------------------------------------------------------- AUTOGRILL SOSTA 24
  HD.grill = {
    ss: SS, focus: 230, amb: 'grill', grade: '200,255,230', gradeA: 0.04,
    static(g, r, S) {
      tiles(g, 0, 0, W, 40, 32, 20, '#dfe2da', '#b8bcb4', r);
      R(g, 0, 40, W, 112, '#ece6cc'); for (let k = 0; k < 300; k++) P(g, r() * W, 40 + r() * 110, 'rgba(160,150,120,.25)');
      R(g, 0, 150, W, 72, '#c84a1a'); R(g, 0, 150, W, 4, '#ffb000'); R(g, 0, 154, W, 0.5, '#7a2a0a'); for (let x = 0; x < W; x += 3) R(g, x, 154, 0.5, 68, 'rgba(0,0,0,.06)');
      smooth(g, 0, 40, W, 182, [[0, 'rgba(10,14,24,.25)'], [0.5, 'rgba(10,14,24,0)'], [1, 'rgba(10,14,24,.25)']]);
      floorP(g, 222, 252, '#e2ded4', '#c8c4bc', r, 300);
      winStatic(g, 14, 52, 230, 92, r, { sky0: '#05060f', sky1: '#141a30', road: '#20222c' }); NI.kit.frame(g, 14, 52, 230, 92, '#9aa0ae', 3, 1);
      S.carK = 0.9; S.car = carPic(0.9);
      sign(g, 270, 50, 150, 40, '#c84a1a', [['SOSTA 24', '#ffffff', 2.9, 10]], '#5a1a08');
      R(g, 270, 50, 150, 40, 'rgba(0,0,0,0)'); R(g, 274, 84, 142, 2, '#ffb000');
      // lavagna del menu
      R(g, 271, 95, 148, 52, '#5a3a1e'); R(g, 274, 98, 142, 46, '#1e2420');
      const menu = [['PASTO COMPLETO', '12,90'], ['PANINO CALDO', '4,50'], ['CAFFE LUNGO', '1,30'], ['DOCCIA', '5,00']];
      menu.forEach(([a, b], i) => { t5(g, a, 278, 101 + i * 10, '#f0ece2', 0.6); t5(g, b, 412 - tw5(b, 0.6), 101 + i * 10, '#ffd23f', 0.6); });
      // market a destra: scaffali, insegna
      sign(g, 470, 80, 120, 13, '#2a6a3a', [['MARKET', '#ffffff', 1, 3]]);
      R(g, 438, 96, 194, 128, '#5a5e6e'); R(g, 440, 98, 190, 124, '#e8e8ec');
      for (let k = 0; k < 4; k++) stock(g, 442, 124 + k * 30, 186, r);
      // banco del caldo (vetrina riscaldata coi vassoi)
      R(g, 309.5, 195.5, 111, 51, INK); R(g, 310, 196, 110, 50, '#3a3e48'); smooth(g, 313, 199, 104, 34, [[0, 'rgba(255,200,130,.65)'], [1, 'rgba(255,170,90,.35)']]);
      for (let k = 0; k < 4; k++) { R(g, 316 + k * 25, 222, 22, 9, '#c8ccd4'); R(g, 316 + k * 25, 222, 22, 1, '#ffffff'); const c = ['#c87a2a', '#e8c84a', '#7a3a1a', '#c84a2a'][k]; for (let q = 0; q < 5; q++) ell(g, 319 + k * 25 + q * 4, 220 - (q % 2), 2.5, 2, c); }
      t5(g, 'PANINI CALDI', 330, 202, '#5a2a0a', 0.6); R(g, 310, 236, 110, 10, '#2a2d34');
      // tavolino alto dei camionisti
      R(g, 528, 230, 100, 4, '#8a8f9e'); R(g, 528, 230, 100, 1, '#d8dce4'); R(g, 576, 234, 4, 20, '#5a5e6e');
      frontCache(S, (f, rr) => {
        counterFront(f, 246, 114, '#3a3e48', '#c84a1a', rr, { stripes: true, band: 52, bandCol: '#ffb000' });
        t5(f, 'CASSA', 40, 270, '#ffffff', 2.6, 'rgba(0,0,0,.4)'); t5(f, 'PAGA QUI · BAGNI E DOCCE CON LO SCONTRINO', 40, 290, '#ffe0c0', 0.8);
        sign(f, 330, 262, 92, 34, '#f4f1e6', [['MENU CAMIONISTA', '#c84a1a', 0.7, 5], ['PRIMO SECONDO', '#3a3a3a', 0.6, 14], ['ACQUA E CAFFE', '#3a3a3a', 0.6, 22]]);
        sign(f, 440, 262, 80, 34, '#ffd23f', [['DOCCE', '#7a2a0a', 1.4, 6], ['24 ORE SU 24', '#7a2a0a', 0.6, 22]]); sign(f, 536, 266, 70, 26, '#2a6a3a', [['WI-FI', '#ffffff', 1.2, 5], ['GRATIS', '#ffffff', 0.7, 16]]);
        R(f, 149.5, 213.5, 61, 33, INK); R(f, 150, 214, 60, 32, '#2a2d34'); R(f, 156, 218, 48, 12, '#0a2a1a'); for (let k = 0; k < 12; k++) R(f, 156 + (k % 4) * 12, 233 + Math.floor(k / 4) * 4, 10, 3, '#5a5e6e');
        R(f, 229.5, 221.5, 61, 25, INK); R(f, 230, 222, 60, 24, '#f4f1e6'); for (let k = 0; k < 10; k++) { R(f, 233 + k * 5.6, 226, 4, 17, ['#ff2e88', '#2ee6ff', '#ffd23f', '#b8ff3a'][k % 4]); R(f, 233 + k * 5.6, 226, 4, 2, '#ffffff'); }
      });
    },
    dyn(g, t, S) {
      winDyn(g, S, 14, 52, 230, 92, t, 5, 40, 150, (x) => { R(x, 140, 96, 104, 6, '#e8e4dc'); glow(x, 190, 102, 60, '220,255,240', 0.35, 0.4); pump(x, 160, 108, 34); pump(x, 210, 108, 34); });
      NI.kit.frame(g, 14, 52, 230, 92, '#9aa0ae', 3, 1);
      glow(g, 365, 222, 64, '255,170,90', 0.25, 0.6);
      const tr = pace(t, 560, 600, 6, 12);
      pg(g, tr.x, 300, 1.35, LOOK.cam, t, { left: true, seed: 8, walk: tr.walk, ph: tr.ph });
      R(g, 528, 230, 100, 4, '#8a8f9e'); R(g, 528, 230, 100, 1, '#d8dce4'); R(g, 544, 225, 22, 5, '#f4f1e6'); ell(g, 555, 224, 7, 2.5, '#c87a2a'); R(g, 604, 219, 7, 11, '#c42a1a'); R(g, 604, 219, 7, 2, '#ffffff');
      pg(g, 120, 336, 1.92, LOOK.cass, t, { seed: 2 });
      g.drawImage(S.front, 0, 0, W, H);
      R(g, 156, 218, 48, 12, '#0a2a1a'); t5(g, (12 + Math.floor(t / 3) % 7) + ',' + (10 + Math.floor(t * 7) % 89), 160, 220, '#7aff9a', 0.9);
      for (const [k, lx] of [[0, 60], [1, 230], [2, 420], [3, 580]]) tube(g, lx - 40, 34, 80, k === 2 ? (Math.sin(t * 31) > 0.3 || Math.sin(t * 3.1) > 0.6 ? 1 : 0.2) : 1, '230,255,240');
    },
    hot: [{ x: 100, y: 200, w: 120, h: 50, label: 'Phill Grill · cassa', go: 'Servizi' }, { x: 310, y: 196, w: 110, h: 50, label: 'Panini caldi', go: 'Servizi' }, { x: 440, y: 96, w: 190, h: 126, label: 'Market', go: 'Da portare via' }],
  };

  // ---------------------------------------------------------------- MOTEL 4EVER: reception di legno, chiavi numerate (manca la 7)
  HD.motel = {
    ss: SS, focus: 300, amb: 'motel', grade: '255,120,190', gradeA: 0.06,
    static(g, r, S) {
      const WD = ramp('#5a3a24');
      for (let x = 0; x < W; x += 14) { const c = mix(WD.b, r() < 0.5 ? '#000000' : '#ffd8a0', r() * 0.12); R(g, x, 0, 14, 228, c); R(g, x, 0, 0.5, 228, WD.dd); R(g, x + 0.5, 0, 1, 228, WD.l); for (let k = 0; k < 10; k++) R(g, x + 2 + r() * 10, r() * 220, 0.5, 4 + r() * 10, r() < 0.5 ? WD.d : WD.l); if (r() < 0.3) ell(g, x + 7, r() * 220, 1.5, 2.5, WD.dd); }
      smooth(g, 0, 0, W, 228, [[0, 'rgba(10,4,14,.5)'], [0.5, 'rgba(10,4,14,.05)'], [1, 'rgba(10,4,14,.3)']]);
      R(g, 0, 224, W, 4, '#3a2214');
      floorP(g, 228, 252, '#6a2a3a', '#5a1a2a', r, 300);
      winStatic(g, 24, 40, 150, 120, r, { sky0: '#06050c', sky1: '#1a1024' });
      S.carK = 1.0; S.car = carPic(1.0);
      // pannello delle chiavi: ganci d'ottone, targhette numerate, la 7 non c'è
      R(g, 228, 34, 154, 100, INK); R(g, 230, 36, 150, 96, '#3a2214'); R(g, 230, 36, 150, 1, '#6a4a2a'); t5(g, 'CHIAVI', 288, 40, '#e8d8a0', 0.7);
      for (let k = 0; k < 12; k++) { const kx = 246 + (k % 6) * 22, ky = 56 + Math.floor(k / 6) * 38; R(g, kx, ky, 2, 3, '#c8a040'); R(g, kx + 0.5, ky, 1, 1, '#fff2c0'); t5(g, String(k + 1), kx - (k + 1 > 9 ? 2 : 0.5), ky + 26, k === 6 ? '#ff9ac8' : '#e8d8a0', 0.6);
        if (k !== 6) { R(g, kx + 0.5, ky + 3, 1, 6, '#c8a040'); R(g, kx - 2, ky + 9, 6, 9, '#7a1a1a'); R(g, kx - 2, ky + 9, 6, 1, '#b84a3a'); R(g, kx + 0.5, ky + 18, 1, 4, '#d8d8d8'); } }
      // quadro del lago con la cornice dorata
      R(g, 408, 38, 94, 64, INK); R(g, 410, 40, 90, 60, '#c8a040'); R(g, 410, 40, 90, 1, '#fff2a0'); R(g, 414, 44, 82, 52, '#2a4a6a'); smooth(g, 414, 44, 82, 28, [[0, '#f0a060'], [1, '#2a4a6a']]); R(g, 414, 72, 82, 24, '#1a3a2a'); R(g, 420, 64, 70, 8, '#4a6a8a');
      for (let k = 0; k < 6; k++) { g.fillStyle = '#0a1a14'; g.beginPath(); g.moveTo(422 + k * 13, 72); g.lineTo(427 + k * 13, 56 - (k % 2) * 6); g.lineTo(432 + k * 13, 72); g.fill(); }
      // distributore automatico
      R(g, 538, 68, 80, 160, INK); R(g, 540, 70, 76, 156, '#c42a2a'); R(g, 540, 70, 76, 1, '#ff6a5a'); sign(g, 548, 74, 46, 9, '#ffd23f', [['BIBITE', '#8a1a1a', 0.6, 1.5]]);
      R(g, 548, 86, 46, 96, '#0c0e14'); for (let k = 0; k < 15; k++) { const c = ['#ffd23f', '#2ee6ff', '#ff7a3a', '#f4f1e6', '#b8ff3a'][k % 5]; R(g, 552 + (k % 3) * 14, 90 + Math.floor(k / 3) * 18, 10, 13, c); R(g, 552 + (k % 3) * 14, 90 + Math.floor(k / 3) * 18, 10, 2, mix(c, '#ffffff', 0.4)); t5(g, 'A' + (k + 1), 553 + (k % 3) * 14, 104 + Math.floor(k / 3) * 18, '#e8e8e8', 0.32); }
      R(g, 600, 92, 12, 20, '#2a2a30'); R(g, 602, 96, 8, 3, '#7aff9a'); R(g, 604, 104, 4, 6, '#9aa0ae'); R(g, 552, 190, 40, 14, '#1a1a1e');
      R(g, 186, 184, 54, 38, INK); R(g, 188, 186, 50, 34, '#2a2620');   // tv sul mobiletto
      R(g, 180, 220, 66, 6, '#4a2a16');
      frontCache(S, (f, rr) => {
        const F = ramp('#4a2a16');
        R(f, 0, 244, W, 10, '#7a4a2a'); R(f, 0, 244, W, 1.5, '#b07a50'); R(f, 0, 253, W, 1, '#2a1608');
        R(f, 0, 254, W, 106, F.b); for (let y = 254; y < 360; y += 9) { R(f, 0, y, W, 0.5, F.dd); for (let k = 0; k < 20; k++) R(f, rr() * W, y + 2 + rr() * 5, 4 + rr() * 14, 0.5, rr() < 0.5 ? F.l : F.d); }
        for (let x = 30; x < W; x += 150) { R(f, x, 272, 120, 70, F.dd); R(f, x + 1, 273, 118, 68, F.b); R(f, x + 1, 273, 118, 1, F.l); R(f, x + 1, 273, 1, 68, F.l); R(f, x + 1, 340, 118, 1, F.dd); }
        smooth(f, 0, 254, W, 106, [[0, 'rgba(10,4,14,.4)'], [0.4, 'rgba(10,4,14,0)'], [1, 'rgba(10,4,14,.45)']]);
        ell(f, 126, 243, 9, 2, '#8a6a20'); ell(f, 126, 240, 6, 4, '#c8a040'); ell(f, 124.5, 238.5, 2, 1, '#fff2c0'); R(f, 125.5, 235, 1, 2, '#e8c860');   // campanello
        R(f, 299.5, 225.5, 71, 19, INK); R(f, 300, 226, 70, 18, '#f4f1e6'); R(f, 334.5, 226, 1, 18, '#c8c0a8'); t5(f, 'OSPITI', 304, 228, '#3a2a6a', 0.5); for (let k = 0; k < 4; k++) { R(f, 304, 233 + k * 2.5, 26, 0.5, '#8a8478'); R(f, 339, 230 + k * 3, 26, 0.5, '#8a8478'); } R(f, 360, 220, 1.5, 20, '#1a1a8a');
        R(f, 469.5, 199.5, 57, 41, INK); R(f, 470, 200, 56, 40, '#7a4a20'); R(f, 470, 200, 56, 1, '#a87040'); R(f, 470, 214, 56, 2, '#4a2a10'); R(f, 494, 208, 8, 8, '#c8a040'); t5(f, '7', 495.5, 222, '#ffd8ec', 1.4);
      });
    },
    dyn(g, t, S) {
      const fl = Math.sin(t * 9) * Math.sin(t * 2.3) > 0.7 ? 0.3 : 1;
      winDyn(g, S, 24, 40, 150, 120, t, 7, 30, 168, (x) => { neon5(x, 'MOTEL', 104, 50, '255,95,168', 2.2, fl); neon5(x, 'LIBERE', 110, 70, '120,255,160', 1.4, Math.sin(t * 1.5) > -0.6 ? 1 : 0); });
      for (let y = 42; y < 160; y += 7) { R(g, 24, y, 150, 2, 'rgba(200,180,150,.55)'); R(g, 24, y + 2, 150, 0.5, 'rgba(0,0,0,.3)'); }
      NI.kit.frame(g, 24, 40, 150, 120, '#3a2214', 1, 1);
      for (let k = 0; k < 160; k++) P(g, 190 + Math.random() * 46, 188 + Math.random() * 30, Math.random() < 0.5 ? '#d8d8d8' : '#4a4a4a'); glow(g, 213, 203, 40, '200,210,255', 0.18);
      pg(g, 300, 336, 1.92, LOOK.port, t, { seed: 0.4, pose: Math.floor(t / 8) % 4 === 3 ? 'pockets' : 'idle' });
      g.drawImage(S.front, 0, 0, W, H);
      R(g, 400, 0, 1, 20, '#2a2a2a'); ell(g, 401, 25, 8, 6, '#e8c890'); ell(g, 401, 23, 6, 3, '#fff2c8'); glow(g, 401, 28, 120, '255,200,140', 0.42, 0.8);
      for (let k = 0; k < 3; k++) P(g, 401 + Math.cos(t * (2 + k) + k) * (10 + k * 4), 26 + Math.sin(t * (3 + k) + k * 2) * (6 + k * 3), '#d8d0b8', 1);
      glow(g, 90, 80, 90, '255,95,168', 0.15);
      NI.kit.clock(g, 500, 160, 13, '#f4f1e6', '#3a2214');
    },
    hot: [{ x: 210, y: 150, w: 180, h: 100, label: 'Tito · reception', go: 'La stanza 7' }, { x: 470, y: 196, w: 56, h: 46, label: 'La tua cassa', go: 'La tua cassa' }, { x: 24, y: 40, w: 150, h: 120, label: 'Parcheggio', go: 'Parcheggio' }],
  };

  // ---------------------------------------------------------------- OFFICINA NICO: intonaco macchiato, la fossa, il carrello degli attrezzi
  HD.niko = {
    ss: SS, focus: 250, amb: 'niko', grade: '120,200,255', gradeA: 0.05,
    static(g, r, S) {
      R(g, 0, 0, W, 236, '#4c4c42'); for (let k = 0; k < 900; k++) P(g, r() * W, r() * 236, r() < 0.5 ? '#42423a' : '#56564a', 0.5 + r());
      for (let k = 0; k < 14; k++) { const x = r() * W; smooth(g, x, 0, 6 + r() * 10, 150, [[0, 'rgba(30,26,18,0)'], [1, 'rgba(30,26,18,.25)']]); }   // colature
      R(g, 0, 150, W, 86, '#3a5a6a'); R(g, 0, 150, W, 2, '#2a4050'); for (let k = 0; k < 60; k++) R(g, r() * W, 152 + r() * 80, 1 + r() * 4, 0.5 + r(), '#4c4c42');   // zoccolo verde petrolio scrostato
      smooth(g, 0, 0, W, 236, [[0, 'rgba(6,8,12,.45)'], [0.5, 'rgba(6,8,12,0)'], [1, 'rgba(6,8,12,.2)']]);
      R(g, 28, 18, 134, 94, '#2a2a24'); smooth(g, 30, 20, 130, 90, [[0, '#0e1a2a'], [1, '#2a3a50']]); for (let k = 0; k < 90; k++) P(g, 30 + r() * 128, 20 + r() * 88, 'rgba(150,140,110,.35)', 1 + r());
      for (let x = 30; x < 162; x += 26) R(g, x, 20, 1.5, 90, '#2a2a24'); for (let y = 20; y < 112; y += 30) R(g, 30, y, 130, 1.5, '#2a2a24');
      R(g, 178, 24, 54, 70, INK); R(g, 180, 26, 50, 66, '#f4f1e6'); R(g, 184, 30, 42, 24, '#7a1a1a'); ell(g, 205, 46, 12, 4, '#c8c8c8'); R(g, 196, 38, 18, 6, '#c42a2a');
      t5(g, 'NOVEMBRE', 185, 57, '#2a2a2a', 0.6); for (let k = 0; k < 30; k++) { t5(g, String(k + 1), 184 + (k % 7) * 6, 64 + Math.floor(k / 7) * 6, k === 19 ? '#c42a1a' : '#5a5a5a', 0.3); }
      sign(g, 244, 28, 64, 24, '#1a3a9a', [['OLIO', '#ffd23f', 1.6, 6]], '#c8ccd4'); sign(g, 244, 60, 64, 24, '#c42a1a', [['GOMME', '#ffffff', 1.4, 7]], '#c8ccd4');
      sign(g, 326, 26, 150, 22, '#e8e2cc', [['OFFICINA NICO', '#2a4a8a', 1.1, 3], ['TAGLIANDI · REVISIONI', '#5a5a5a', 0.55, 13]], '#5a4a3a');
      R(g, 328, 100, 144, 4, '#5a4a3a'); R(g, 328, 100, 144, 1, '#7a6a5a');
      R(g, 339.5, 77.5, 43, 23, INK); R(g, 340, 78, 42, 22, '#3a2a1a'); R(g, 344, 82, 18, 14, '#c8a040'); for (let k = 0; k < 4; k++) R(g, 366, 82 + k * 3, 12, 1, '#1a1a1a'); t5(g, 'FM', 346, 84, '#3a2a1a', 0.6);
      for (let k = 0; k < 5; k++) { const c = ['#2a6ad8', '#ffd23f', '#c8ccd4', '#c42a1a', '#2a9a4a'][k]; R(g, 391.5 + k * 15, 83.5, 11, 17, INK); R(g, 392 + k * 15, 84, 10, 16, c); R(g, 392 + k * 15, 84, 10, 2, '#e8e8e8'); R(g, 393 + k * 15, 90, 8, 4, '#f4f1e6'); }
      R(g, 0, 236, W, 124, '#5a5a52'); for (let k = 0; k < 500; k++) P(g, r() * W, 236 + r() * 124, r() < 0.5 ? '#525248' : '#646458', 0.5 + r());
      for (let k = 0; k < 30; k++) ell(g, r() * W, 244 + r() * 112, 6 + r() * 24, 2 + r() * 5, `rgba(12,10,8,${0.15 + r() * 0.25})`);
      R(g, 208, 248, 254, 24, '#ffd23f'); for (let x = 208; x < 462; x += 12) R(g, x, 248, 6, 24, '#1a1a1a'); R(g, 212, 252, 246, 18, '#0e0e0c'); smooth(g, 212, 252, 246, 18, [[0, 'rgba(255,230,170,.0)'], [1, 'rgba(255,230,170,.25)']]);
      // compressore, taniche, pila di gomme
      R(g, 495, 166, 52, 70, INK); R(g, 496, 167, 50, 68, '#c42a1a'); R(g, 496, 167, 50, 1, '#ff5a4a'); ell(g, 521, 186, 9, 9, INK); ell(g, 521, 186, 7.5, 7.5, '#f4f1e6'); R(g, 521, 180, 0.6, 6, '#c42a1a'); R(g, 500, 212, 42, 18, '#8a1a1a'); t5(g, 'ARIA', 509, 215, '#ffd8d0', 0.7);
      for (let k = 0; k < 3; k++) { const c = ['#c42a1a', '#2a6a2a', '#c42a1a'][k]; R(g, 455.5 + k * 13, 205.5, 11, 31, INK); R(g, 456 + k * 13, 206, 10, 30, c); R(g, 456 + k * 13, 206, 10, 2, mix(c, '#ffffff', 0.4)); R(g, 458 + k * 13, 202, 4, 4, '#1a1a1a'); }
      for (let k = 0; k < 4; k++) { ell(g, 590, 232 - k * 18, 30, 9, INK); ell(g, 590, 229 - k * 18, 28, 7.5, '#1c1c22'); ell(g, 590, 229 - k * 18, 16, 4, '#0a0a0e'); for (let q = -24; q <= 24; q += 4) R(g, 590 + q, 226 - k * 18 + Math.abs(q) * 0.08, 1.5, 0.5, '#3a3a42'); }
      S.carK = 2.2; S.car = carPic(2.2);
      frontCache(S, (f) => {   // carrello degli attrezzi in primo piano
        R(f, 487, 296, 90, 70, INK); R(f, 488, 297, 88, 70, '#b82418'); R(f, 488, 297, 88, 2, '#e85a48');
        for (let k = 0; k < 4; k++) { R(f, 492, 306 + k * 13, 80, 11, '#9a1e14'); R(f, 492, 306 + k * 13, 80, 1, '#d84a3a'); R(f, 522, 311 + k * 13, 20, 2, '#c8ccd4'); }
        R(f, 490, 290, 84, 7, '#3a3a42'); R(f, 496, 284, 30, 6, '#c8ccd4'); R(f, 530, 286, 22, 4, '#ffd23f'); R(f, 556, 282, 4, 10, '#9aa0ae');
        smooth(f, 487, 296, 90, 64, [[0, 'rgba(6,8,12,0)'], [1, 'rgba(6,8,12,.5)']]);
      });
    },
    dyn(g, t, S) {
      if (S.car) g.drawImage(S.car, 335 - S.car.width / SS / 2, 256 - S.car.height / SS, S.car.width / SS, S.car.height / SS);
      glow(g, 335, 264, 96, '255,230,170', 0.32, 0.3);
      pg(g, 110, 346, 1.95, LOOK.nico, t, { seed: 4.2, pose: Math.floor(t / 10) % 3 === 2 ? 'pockets' : 'idle' });
      g.drawImage(S.front, 0, 0, W, H);
      if (Math.sin(t * 6) > 0) R(g, 378, 82, 2, 2, '#7aff9a');
      for (const [k, lx] of [[0, 120], [1, 330], [2, 540]]) tube(g, lx - 50, 4, 100, k === 1 ? (Math.sin(t * 23) > -0.2 ? 1 : 0.3) : 1);
      cone(g, 95, 20, 120, 200, 210, '200,220,255', 0.05);
      for (let k = 0; k < 14; k++) P(g, 60 + ((k * 37 + t * 4) % 120), 60 + ((k * 53 + Math.sin(t + k) * 20) % 150), 'rgba(255,255,240,.45)', 0.7);
    },
    hot: [{ x: 200, y: 160, w: 270, h: 110, label: 'La tua auto', go: 'top' }, { x: 40, y: 220, w: 150, h: 120, label: 'Nico', go: 'top' }, { x: 560, y: 160, w: 60, h: 76, label: 'Gomme', go: 'top' }],
  };

  // ---------------------------------------------------------------- DA LUCA TUNING (Luca)
  HD.shop = {
    ss: SS, focus: 300, amb: 'shop', grade: '255,176,0', gradeA: 0.05,
    static(g, r, S) {
      R(g, 0, 0, W, 240, '#262930'); for (let y = 0, row = 0; y < 240; y += 16, row++) for (let x = -(row % 2) * 16; x < W; x += 32) { const c = mix('#30333a', r() < 0.5 ? '#000000' : '#ffffff', r() * 0.06); R(g, x + 0.5, y + 0.5, 31, 15, c); R(g, x + 0.5, y + 0.5, 31, 0.5, mix(c, '#ffffff', 0.12)); }
      smooth(g, 0, 0, W, 240, [[0, 'rgba(6,6,10,.5)'], [0.5, 'rgba(6,6,10,.05)'], [1, 'rgba(6,6,10,.25)']]);
      R(g, 0, 118, W, 7, '#ffb000'); for (let x = 0; x < W; x += 14) { g.fillStyle = '#1a1a1a'; g.beginPath(); g.moveTo(x, 118); g.lineTo(x + 7, 118); g.lineTo(x + 2, 125); g.lineTo(x - 5, 125); g.fill(); }
      // pannello forato con gli attrezzi (sagome disegnate)
      R(g, 18, 18, 174, 94, INK); R(g, 20, 20, 170, 90, '#9a7a52'); for (let y = 24; y < 108; y += 5) for (let x = 24; x < 188; x += 5) P(g, x, y, '#5a4a3a', 1);
      const tools = [[30, 30, 5, 60, '#c8ccd4'], [42, 34, 4, 52, '#c42a1a'], [54, 30, 12, 26, '#c8ccd4'], [74, 30, 4, 58, '#ffb000'], [88, 40, 22, 8, '#c8ccd4'], [114, 30, 6, 48, '#2a6ad8'], [128, 32, 30, 10, '#c8ccd4'], [128, 52, 26, 8, '#c42a1a'], [164, 30, 8, 62, '#c8ccd4']];
      for (const [x, y, w, h, c] of tools) { R(g, x - 0.5, y - 0.5, w + 1, h + 1, '#3a2a1a'); R(g, x, y, w, h, c); R(g, x, y, 1, h, '#ffffff'); R(g, x + w - 1, y, 1, h, mix(c, '#000000', 0.4)); }
      // schermo del banco prova
      R(g, 468, 28, 154, 84, INK); R(g, 470, 30, 150, 80, '#14161c'); R(g, 474, 34, 142, 72, '#0a1018'); for (let k = 0; k < 6; k++) R(g, 474, 40 + k * 12, 142, 0.5, '#1a2a3a');
      // rastrelliera delle gomme
      R(g, 520, 150, 4, 92, '#5a5e66'); R(g, 618, 150, 4, 92, '#5a5e66'); for (let k = 0; k < 3; k++) { R(g, 520, 170 + k * 26, 102, 2, '#8a8f9e'); for (let q = 0; q < 4; q++) { ell(g, 534 + q * 24, 162 + k * 26, 10, 10, INK); ell(g, 534 + q * 24, 162 + k * 26, 9, 9, '#1a1c22'); ell(g, 534 + q * 24, 162 + k * 26, 5, 5, ['#c8ccd4', '#ffb000', '#1a1a1a', '#c42a1a'][(q + k) % 4]); } }
      // pavimento di resina lucido, ponte sollevatore
      R(g, 0, 240, W, 120, '#3a3e48'); smooth(g, 0, 240, W, 120, [[0, '#2e323a'], [1, '#444854']]); for (let k = 0; k < 40; k++) R(g, r() * W, 244 + r() * 110, 20 + r() * 40, 0.5, 'rgba(255,255,255,.06)');
      R(g, 0, 240, W, 1.5, '#5a5e6e');
      for (const x of [198, 448]) { R(g, x - 0.5, 118, 13, 162, INK); R(g, x, 118, 12, 162, '#c42a1a'); R(g, x, 118, 3, 162, '#ff5a4a'); R(g, x + 9, 118, 3, 162, '#8a1a10'); R(g, x - 4, 276, 20, 6, '#3a3e48'); }
      S.carK = 2.3; S.car = carPic(2.3);
      frontCache(S, (f, rr) => {
        R(f, 0, 298, 232, 12, '#5a5e6e'); R(f, 0, 298, 232, 1.5, '#a8acb8'); R(f, 0, 310, 232, 50, '#2a2d34'); for (let k = 0; k < 3; k++) { R(f, 10 + k * 74, 318, 64, 16, '#3a3e48'); R(f, 10 + k * 74, 318, 64, 1, '#6a6e7a'); R(f, 36 + k * 74, 325, 12, 2, '#c8ccd4'); }
        // il turbo sul banco: chiocciola, girante, flangia
        ell(f, 80, 282, 21, 21, INK); ell(f, 80, 282, 19, 19, '#b8bec8'); ell(f, 77, 279, 13, 13, '#d8dce4'); ell(f, 80, 282, 10, 10, '#7a8290'); ell(f, 80, 282, 4, 4, '#3a3e46');
        for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; f.strokeStyle = '#c8ccd4'; f.lineWidth = 0.8; f.beginPath(); f.moveTo(80, 282); f.lineTo(80 + Math.cos(a) * 9, 282 + Math.sin(a) * 9); f.stroke(); }
        R(f, 96, 272, 30, 12, '#b8bec8'); R(f, 96, 272, 30, 2, '#e8ecf2'); R(f, 124, 270, 4, 16, '#8a8f9e');
        for (let k = 0; k < 3; k++) { R(f, 140 + k * 26, 280, 20, 18, '#5a5e6e'); R(f, 144 + k * 26, 284, 12, 12, '#1a1c22'); t5(f, ['HKS', 'BOV', 'ECU'][k], 144 + k * 26, 299, '#ffb000', 0.45); }
      });
    },
    dyn(g, t, S) {
      if (S.car) { const y = 152 - S.car.height / SS + Math.sin(t * 0.6) * 0.5; g.drawImage(S.car, 330 - S.car.width / SS / 2, y, S.car.width / SS, S.car.height / SS); R(g, 210, 153, 240, 4, '#8a8f9e'); R(g, 210, 153, 240, 1, '#d8dce4'); }
      glow(g, 330, 162, 160, '255,190,110', 0.12, 0.4);
      R(g, 474, 34, 142, 72, '#0a1018'); for (let k = 0; k < 6; k++) R(g, 474, 40 + k * 12, 142, 0.5, '#1a2a3a');
      for (let x = 0; x < 140; x += 0.5) { const v = 0.5 + 0.35 * Math.sin((x + t * 30) * 0.06) + 0.1 * Math.sin((x + t * 30) * 0.21); P(g, 475 + x, 100 - v * 56, '#ffb000', 0.7); P(g, 475 + x, 108 - v * 46, '#2ee6ff', 0.7); }
      t5(g, 'BANCO PROVA', 478, 36, '#9aa2ae', 0.55); t5(g, Math.round(280 + 40 * Math.sin(t * 0.3)) + ' CV', 578, 36, '#ffb000', 0.7);
      const fl = Math.sin(t * 11) * Math.sin(t * 4.3) > 0.8 ? 0.15 : 1; { const wl = tw5('LUCA', 3), wt = tw5('TUNING', 1.8), x0 = 330 - (wl + 8 + wt) / 2; neon5(g, 'LUCA', x0, 16, '255,176,0', 3, fl); neon5(g, 'TUNING', x0 + wl + 8, 24, '255,90,40', 1.8, 1); }
      pg(g, 150, 330, 1.9, LOOK.luca, t, { seed: 5.5, pose: Math.floor(t / 7) % 3 === 1 ? 'pockets' : 'idle' });
      g.drawImage(S.front, 0, 0, W, H);
      for (const lx of [110, 330, 540]) tube(g, lx - 50, 2, 100);
      glow(g, 80, 272, 60, '255,210,150', 0.2);
    },
    hot: [{ x: 200, y: 60, w: 260, h: 100, label: 'La tua auto', go: 'top' }, { x: 470, y: 30, w: 150, h: 80, label: 'Banco prova', go: 'top' }, { x: 0, y: 260, w: 230, h: 100, label: 'Pezzi', go: 'top' }],
  };

  // ---------------------------------------------------------------- RUSSIAN KUSTOM: cabina di verniciatura, cerchi, vinile, l'artista con l'aerografo
  HD.style = {
    ss: SS, focus: 420, amb: 'style', grade: '255,46,136', gradeA: 0.07,
    static(g, r, S) {
      R(g, 0, 0, W, 240, '#140c1e'); for (let x = 0; x < W; x += 20) { R(g, x, 0, 19.5, 240, mix('#1a1028', '#000000', r() * 0.2)); R(g, x + 19.5, 0, 0.5, 240, '#0a0610'); }   // pannelli fonoassorbenti
      for (let y = 6; y < 240; y += 10) for (let x = 4; x < W; x += 10) P(g, x, y, '#22183a', 1);
      // campionario dei colori con i nomi
      t5(g, 'COLORI', 18, 20, '#e8d8f8', 0.8);
      const sw = [['ROSA', '#ff2e88'], ['CIANO', '#2ee6ff'], ['LIME', '#b8ff3a'], ['ORO', '#ffd23f'], ['ARANCIO', '#ff7a3a'], ['VIOLA', '#7a2ad8'], ['PERLA', '#f4f1e6'], ['NERO', '#1a1a1a']];
      for (let k = 0; k < 24; k++) { const [nm, c] = sw[k % 8], x = 18 + (k % 6) * 22, y = 30 + Math.floor(k / 6) * 24; R(g, x - 0.5, y - 0.5, 19, 19, INK); R(g, x, y, 18, 14, c); R(g, x, y, 18, 1, mix(c, '#ffffff', 0.5)); R(g, x, y + 14, 18, 4, '#e8e4dc'); t5(g, nm.slice(0, 5), x + 0.5, y + 14.6, '#3a2a4a', 0.3); }
      // muro dei cerchi: razze e canale
      for (let k = 0; k < 6; k++) { const cx = 494 + (k % 3) * 46, cy = 46 + Math.floor(k / 3) * 50, c = ['#c8ccd4', '#ffd23f', '#2a2a30', '#ff2e88', '#c8ccd4', '#2ee6ff'][k];
        ell(g, cx, cy, 21, 21, INK); ell(g, cx, cy, 19.5, 19.5, '#141418'); ell(g, cx, cy, 15, 15, c); ell(g, cx, cy, 13, 13, mix(c, '#000000', 0.35));
        for (let q = 0; q < (k % 2 ? 10 : 5); q++) { const a = q * Math.PI * 2 / (k % 2 ? 10 : 5); g.strokeStyle = c; g.lineWidth = k % 2 ? 1.2 : 3; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * 13, cy + Math.sin(a) * 13); g.stroke(); }
        ell(g, cx, cy, 3.5, 3.5, '#3a3a42'); ell(g, cx - 5, cy - 8, 4, 1.5, 'rgba(255,255,255,.45)'); }
      // rotoli di vinile
      for (let k = 0; k < 5; k++) { const c = ['#ff2e88', '#2ee6ff', '#1a1a1a', '#b8ff3a', '#f4f1e6'][k], x = 170 + k * 14; R(g, x - 0.5, 109.5, 11, 101, INK); R(g, x, 110, 10, 100, c); R(g, x + 1, 110, 2, 100, mix(c, '#ffffff', 0.4)); R(g, x + 7, 110, 3, 100, mix(c, '#000000', 0.35)); ell(g, x + 5, 110, 5, 2, mix(c, '#ffffff', 0.2)); ell(g, x + 5, 110, 1.5, 1, INK); }
      // cabina: telaio, filtri, pavimento a grata
      R(g, 238, 18, 234, 8, '#3a3e48'); R(g, 238, 18, 8, 222, '#3a3e48'); R(g, 464, 18, 8, 222, '#3a3e48'); R(g, 238, 18, 234, 1, '#6a6e7a');
      for (let x = 250; x < 460; x += 24) { R(g, x, 26, 20, 10, '#2a2d34'); for (let q = 0; q < 4; q++) R(g, x + 2 + q * 5, 27, 0.5, 8, '#4a4e5a'); }
      R(g, 0, 240, W, 120, '#1a1424'); for (let x = 246; x < 466; x += 6) R(g, x, 240, 0.5, 30, '#2a2236');
      for (let k = 0; k < 18; k++) { const x = r() * W, y = 250 + r() * 100, c = ['#ff2e88', '#2ee6ff', '#b8ff3a', '#ffd23f'][k % 4]; ell(g, x, y, 3 + r() * 6, 1 + r() * 1.5, mix(c, '#1a1424', 0.55)); for (let q = 0; q < 4; q++) ell(g, x + (r() - 0.5) * 16, y + (r() - 0.5) * 4, 0.6, 0.4, mix(c, '#1a1424', 0.4)); }   // vecchie macchie di vernice, spente dal tempo
      S.carK = 1.9; S.car = carPic(1.9);
      frontCache(S, (f, rr) => {
        R(f, 0, 318, W, 8, '#2a2236'); R(f, 0, 318, W, 1, '#4a3a5a'); R(f, 0, 326, W, 34, '#130e1c');
        for (let k = 0; k < 14; k++) { const x = 20 + k * 44, c = ['#ff2e88', '#2ee6ff', '#ffd23f', '#b8ff3a', '#f4f1e6', '#7a2ad8'][k % 6]; if (x > 230 && x < 470) continue;
          R(f, x - 0.5, 295.5, 13, 23, INK); R(f, x, 296, 12, 22, '#c8ccd4'); R(f, x, 300, 12, 12, c); R(f, x + 1, 296, 2, 22, '#ffffff'); R(f, x + 3, 291, 6, 5, c); R(f, x + 5, 289, 2, 2, '#1a1a1a'); t5(f, 'K', x + 4.5, 303, '#ffffff', 0.5); }
      });
    },
    dyn(g, t, S) {
      const hue = (Math.sin(t * 0.35) + 1) / 2, rgb = hue > 0.5 ? '255,46,136' : '46,230,255';
      for (const y of [42, 58]) { R(g, 258, y, 194, 3, `rgb(${rgb})`); R(g, 258, y, 194, 1, '#ffffff'); glow(g, 355, y, 160, rgb, 0.28, 0.35); }
      if (S.car) g.drawImage(S.car, 355 - S.car.width / SS / 2, 246 - S.car.height / SS, S.car.width / SS, S.car.height / SS);
      cone(g, 355, 62, 190, 260, 180, rgb, 0.08);
      const n = Math.min(13, Math.floor(t * 4)), fl = Math.sin(t * 9) * Math.sin(t * 2.7) > 0.85 ? 0.25 : 1;
      if (n > 0) neon5(g, 'RUSSIAN'.slice(0, Math.min(7, n)), 22, 140, '255,46,136', 2.2, fl); if (n > 7) neon5(g, 'KUSTOM'.slice(0, n - 7), 26, 168, '46,230,255', 2.2, 1);
      pg(g, 524, 330, 1.9, LOOK.neon, t, { left: true, seed: 6.6 });
      // l'aerografo: la nuvola di vernice verso l'auto
      g.save(); g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 18; k++) { const d = ((t * 60 + k * 9) % 46); ell(g, 500 - d, 262 + Math.sin(k * 1.7 + t * 5) * d * 0.25, 1 + d * 0.04, 1 + d * 0.04, `rgba(${rgb},${0.5 * (1 - d / 46)})`); } g.restore();
      g.drawImage(S.front, 0, 0, W, H);
      const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 4)), 8);
      for (const sx of [196, 590]) { R(g, sx - 0.5, 249.5, 29, 41, INK); R(g, sx, 250, 28, 40, '#16141c'); ell(g, sx + 14, 276, 9 + beat * 1.5, 9 + beat * 1.5, '#2a2d34'); ell(g, sx + 14, 276, 3, 3, '#5a5e6e'); ell(g, sx + 14, 259, 4, 4, '#2a2d34'); }
      glow(g, 70, 150, 120, '255,46,136', 0.12 + beat * 0.05);
    },
    hot: [{ x: 240, y: 30, w: 230, h: 210, label: 'Cabina', go: 'top' }, { x: 470, y: 20, w: 160, h: 110, label: 'Cerchi', go: 'top' }, { x: 10, y: 20, w: 140, h: 100, label: 'Colori', go: 'top' }],
  };

  // ---------------------------------------------------------------- AUTOSALONE NOTTE: vetrata, pedana girevole, faretti, Rocco Lostallone
  HD.dealer = {
    ss: SS, focus: 300, amb: 'dealer', grade: '182,156,255', gradeA: 0.05,
    static(g, r, S) {
      R(g, 0, 0, W, 250, '#1a1826');
      NI.kit.outside(g, 0, 18, W, 200, r, { sky0: '#070818', sky1: '#241a3a' });
      for (let x = 0; x <= W; x += 80) { R(g, x - 2.5, 14, 5, 210, '#0a0a10'); R(g, x - 1, 14, 1.5, 210, '#5a5a70'); }
      R(g, 0, 10, W, 6, '#3a3a4e'); R(g, 0, 10, W, 1, '#6a6a80'); R(g, 0, 218, W, 6, '#2a2838'); R(g, 0, 224, W, 26, '#1c1a2a'); R(g, 0, 224, W, 0.5, '#4a4660');
      R(g, 0, 0, W, 10, '#0e0d16'); R(g, 60, 7, 520, 2, '#3a3a4e');
      for (const lx of [180, 330, 480]) { R(g, lx - 6, 9, 12, 8, '#2a2a36'); R(g, lx - 4, 17, 8, 5, '#5a5a6e'); R(g, lx - 4, 21.5, 8, 0.5, '#fff8e8'); }
      R(g, 250, 10, 1, 16, '#5a5a6e'); R(g, 410, 10, 1, 16, '#5a5a6e'); R(g, 225, 23, 212, 60, INK); R(g, 226, 24, 210, 58, '#120f1e');
      floorP(g, 250, H, '#2a2840', '#232136', r, 330);
      ell(g, 330, 270, 170, 27, INK); ell(g, 330, 266, 167, 24, '#2e2a46'); ell(g, 330, 263, 162, 21, '#4a4670'); ell(g, 330, 262, 150, 17, '#565280'); ell(g, 300, 258, 80, 5, 'rgba(255,255,255,.08)');
      // scrivania, monitor, faldoni, pianta
      R(g, 500, 262, 140, 7, '#d8d4e8'); R(g, 500, 262, 140, 1, '#ffffff'); R(g, 504, 269, 136, 46, '#2a2838'); R(g, 504, 269, 136, 1.5, '#4a4660');
      R(g, 579.5, 221.5, 49, 35, INK); R(g, 580, 222, 48, 34, '#14141c'); R(g, 600, 256, 8, 6, '#14141c');
      for (let k = 0; k < 4; k++) { const c = ['#b69cff', '#ffd23f', '#3b9bff', '#ff3b4a'][k]; R(g, 519.5 + k * 9, 237.5 - (k % 2) * 4, 8, 25 - (k % 2) * 4, INK); R(g, 520 + k * 9, 238 - (k % 2) * 4, 7, 24 - (k % 2) * 4, c); R(g, 521 + k * 9, 242, 5, 3, '#f4f1e6'); }
      R(g, 613.5, 195.5, 23, 33, INK); R(g, 614, 196, 22, 32, '#5a3a2a'); for (let k = 0; k < 12; k++) { g.fillStyle = k % 2 ? '#2f8a4a' : '#4fbf6a'; g.beginPath(); g.ellipse(625 + Math.cos(k * 0.8) * 10, 192 - k * 3, 9, 3.5, Math.cos(k) * 0.8, 0, 7); g.fill(); }
      // divanetto, macchinetta del caffè, riviste
      R(g, 3.5, 269.5, 97, 49, INK); R(g, 4, 270, 96, 22, '#4a3660'); R(g, 4, 292, 96, 26, '#3a2a4a'); R(g, 6, 272, 92, 2, '#6a5690'); for (let k = 0; k < 3; k++) R(g, 8 + k * 31, 293, 29, 22, '#43305a');
      R(g, 19.5, 229.5, 29, 49, INK); R(g, 20, 230, 28, 48, '#2a2a36'); R(g, 24, 236, 20, 10, '#0a0a10'); t5(g, 'CAFFE', 25, 238, '#b69cff', 0.55); R(g, 28, 262, 12, 2, '#c8ccd4');
      S.fid = null; NI.kit.dealerCar(S);
    },
    dyn(g, t, S) {
      NI.kit.dealerCar(S);
      traffic(g, 0, 18, W, 200, t, 4);
      for (const lx of [180, 330, 480]) cone(g, lx, 22, 18, 120, 236, '220,210,255', 0.07);
      glow(g, 330, 250, 220, '182,156,255', 0.12, 0.3);
      for (let k = 0; k < 28; k++) { const a = t * 0.9 + k * (Math.PI * 2 / 28), x = 330 + Math.cos(a) * 160, y = 263 + Math.sin(a) * 21; if (Math.sin(a) > -0.2) { R(g, x - 1, y - 1, 2, 2, k % 2 ? '#ffffff' : '#b69cff'); glow(g, x, y, 6, '182,156,255', 0.3); } }
      if (S.feat) {
        const c = S.feat, k = Math.min(1.2, 270 / c.width), w = c.width * k, h = c.height * k, y = 258 - h + Math.sin(t * 0.8) * 0.6;
        g.save(); g.imageSmoothingEnabled = false; g.drawImage(c, 330 - w / 2, y, w, h);
        g.globalAlpha = 0.16; g.scale(1, -1); g.drawImage(c, 330 - w / 2, -(258 * 2 - y) - 4, w, h); g.restore();
        const sx = 330 - w / 2 + ((t * 70) % (w + 120)) - 60; g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.12; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(sx, y + 4); g.lineTo(sx + 16, y + 4); g.lineTo(sx - 10, y + h - 14); g.lineTo(sx - 26, y + h - 14); g.closePath(); g.fill(); g.restore();
      }
      const dl = window.nightRun && window.nightRun.game, n = dl && dl.inside ? Math.round((dl.inside.x - VG_STOP0) / VG_STEP) : 0;
      if (dl && dl.dlPrice && S.fid) {
        const p = dl.dlPrice(S.fid, n), deal = dl.dlDeal(n) === S.fid, label = deal ? 'OCCASIONE' : 'IN VETRINA', pr = '€ ' + (p >= 1000 ? Math.floor(p / 1000) + '.' + String(p % 1000).padStart(3, '0') : p);
        const tw = Math.max(tw5(label, 0.7), tw5(pr, 1.5)) + 14;
        R(g, 330 - tw / 2 - 0.5, 285.5, tw + 1, 27, INK); R(g, 330 - tw / 2, 286, tw, 26, '#f4f1e6'); R(g, 330 - tw / 2, 286, tw, 1, '#ffffff');
        t5(g, label, 330 - tw5(label, 0.7) / 2, 289, deal ? '#c43a6a' : '#5a5a70', 0.7); t5(g, pr, 330 - tw5(pr, 1.5) / 2, 297, '#1a1a24', 1.5);
      }
      const fl = Math.sin(t * 7) * Math.sin(t * 2.1) > 0.9 ? 0.3 : 1;
      neon5(g, 'AUTOSALONE', 331 - tw5('AUTOSALONE', 1.3) / 2, 30, '182,156,255', 1.3, fl); neon5(g, 'NOTTE', 331 - tw5('NOTTE', 2.6) / 2, 50, '255,210,63', 2.6, 1);
      R(g, 582, 224, 44, 30, '#1a2a44'); t5(g, 'RATE', 585, 226, '#9ec4ff', 0.45); for (let k = 0; k < 4; k++) { const yy = 233 + ((k * 5 + Math.floor(t * 4)) % 20); R(g, 585, yy, 16 + (k * 7) % 18, 1, '#9ec4ff'); R(g, 610, yy, 10, 1, '#b8ff3a'); }
      glow(g, 604, 238, 30, '160,200,255', 0.18);
      pg(g, 150, 340, 2.05, LOOK.vend, t, { seed: 8.2, pose: Math.floor(t / 7) % 3 === 2 ? 'phone' : 'idle' });
      for (const lx of [180, 330, 480]) glow(g, lx, 22, 30, '255,250,235', 0.35);
    },
    hot: [{ x: 200, y: 110, w: 270, h: 200, label: 'In vetrina', go: () => window.NightDealer && NightDealer.tab(0) }, { x: 100, y: 180, w: 100, h: 140, label: 'Rocco: rate', go: () => window.NightDealer && NightDealer.tab(2) }, { x: 500, y: 200, w: 140, h: 120, label: 'Le tue auto', go: () => window.NightDealer && NightDealer.tab(1) }],
  };

  // ---------------------------------------------------------------- SFASCIO RUGGINE: piazzale di notte, pile di carcasse, gru, fuoco, cane
  HD.junk = {
    ss: SS, focus: 300, amb: 'junk', grade: '255,150,80', gradeA: 0.06,
    static(g, r, S) {
      smooth(g, 0, 0, W, 220, [[0, '#05060e'], [0.6, '#16101e'], [1, '#2a1a24']]);
      for (let k = 0; k < 120; k++) P(g, r() * W, r() * 130, r() < 0.3 ? '#ffffff' : r() < 0.6 ? '#c8ccd4' : '#6a6e7e', r() < 0.1 ? 1 : 0.5);
      ell(g, 560, 46, 15, 15, '#e8e4d0'); ell(g, 567, 42, 13.5, 13.5, '#120e1a'); glow(g, 556, 48, 40, '232,228,208', 0.15);
      for (let x = 0; x < W; x += 6 + Math.floor(r() * 10)) { const h = 10 + r() * 34, w = 8 + r() * 6; R(g, x, 172 - h, w, h, '#100c16'); for (let q = 0; q < h * w / 40; q++) if (r() < 0.4) P(g, x + 1 + r() * (w - 2), 172 - h + 2 + r() * (h - 4), ['#ffcf7a', '#9fd8ff'][Math.floor(r() * 2)]); }
      // pile di auto schiacciate (sagome con i finestrini e la ruggine)
      const cols = ['#5a2e2e', '#2e3a5a', '#4a4a2e', '#3a4a4a', '#5a4a3a', '#2e2e3a', '#6a3a1e', '#4a2a4a'];
      for (const [x0, n0] of [[10, 7], [130, 5], [420, 6], [540, 8]]) for (let k = 0; k < n0; k++) { const y = 196 - k * 13, x = x0 + (k % 2) * 8 + Math.floor(r() * 6), c = cols[Math.floor(r() * cols.length)];
        R(g, x - 0.5, y - 0.5, 85, 12, INK); R(g, x, y, 84, 11, c); R(g, x, y, 84, 1, mix(c, '#ffffff', 0.25)); R(g, x + 14, y + 2, 20, 3, '#1a2030'); R(g, x + 38, y + 2, 18, 3, '#1a2030'); R(g, x, y + 8, 84, 3, 'rgba(0,0,0,.35)');
        for (let q = 0; q < 5; q++) R(g, x + r() * 80, y + 3 + r() * 6, 2 + r() * 6, 1 + r() * 2, 'rgba(120,56,22,.6)'); ell(g, x + 14, y + 10, 4, 2, '#0e0e10'); ell(g, x + 70, y + 10, 4, 2, '#0e0e10'); }
      // rete metallica
      R(g, 0, 150, W, 1.5, '#6a6e7e'); for (let x = 0; x < W; x += 60) { R(g, x, 150, 3, 70, '#4a4e5e'); R(g, x, 150, 1, 70, '#7a7e8e'); }
      g.save(); g.globalAlpha = 0.2; g.strokeStyle = '#8a8f9e'; g.lineWidth = 0.5; for (let x = -80; x < W + 80; x += 6) { g.beginPath(); g.moveTo(x, 152); g.lineTo(x + 66, 218); g.stroke(); g.beginPath(); g.moveTo(x + 66, 152); g.lineTo(x, 218); g.stroke(); } g.restore();
      // terra battuta, pozze d'olio con l'arcobaleno
      smooth(g, 0, 218, W, H - 218, [[0, '#2a2018'], [1, '#16110c']]);
      for (let k = 0; k < 900; k++) P(g, r() * W, 220 + r() * 140, r() < 0.5 ? '#3a2e22' : '#14100a', 0.5 + r() * 0.5);
      for (const [x, y, w] of [[90, 300, 70], [420, 336, 90], [260, 344, 50]]) { ell(g, x, y, w / 2, 5, '#0c0a10'); ell(g, x - 6, y - 1, w / 3, 2, 'rgba(120,80,200,.2)'); ell(g, x + 4, y + 1, w / 4, 1.5, 'rgba(80,200,160,.15)'); }
      // gru: torre e braccio a traliccio
      R(g, 475.5, 29.5, 11, 201, INK); R(g, 476, 30, 10, 200, '#c8a020'); for (let y = 34; y < 230; y += 10) { g.strokeStyle = '#8a6a10'; g.lineWidth = 1; g.beginPath(); g.moveTo(477, y); g.lineTo(485, y + 9); g.stroke(); }
      R(g, 249.5, 25.5, 251, 9, INK); R(g, 250, 26, 250, 8, '#c8a020'); R(g, 250, 26, 250, 1, '#f0d050'); for (let x = 254; x < 496; x += 10) { g.strokeStyle = '#8a6a10'; g.beginPath(); g.moveTo(x, 27); g.lineTo(x + 8, 33); g.stroke(); }
      R(g, 482, 34, 30, 22, '#c8a020'); R(g, 486, 38, 14, 10, '#8ab8d8');   // cabina della gru
      // pila di gomme a destra e lampione a sinistra
      for (let k = 0; k < 4; k++) { ell(g, 560, 320 - k * 13, 35, 10.5, INK); ell(g, 560, 317 - k * 13, 32, 8, '#1e1e24'); ell(g, 560, 317 - k * 13, 17, 4, '#0a0a0e'); for (let q = -28; q <= 28; q += 4) R(g, 560 + q, 313 - k * 13 + Math.abs(q) * 0.06, 1.5, 0.5, '#34343c'); }
      R(g, 39.5, 39.5, 6, 191, INK); R(g, 40, 40, 5, 190, '#2a2d34'); R(g, 40, 38, 34, 5, '#2a2d34'); R(g, 62, 43, 14, 4, '#f4f0d8');
      S.wid = undefined; NI.kit.junkCar(S);
    },
    dyn(g, t, S) {
      NI.kit.junkCar(S);
      cone(g, 69, 46, 14, 220, 270, '255,240,200', 0.09);
      const a = Math.sin(t * 0.55) * 0.18, hx = 290, hy = 34, len = 92, mx = hx + Math.sin(a) * len, my = hy + Math.cos(a) * len;
      g.strokeStyle = '#8a8f9e'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(hx, hy); g.lineTo(mx, my); g.stroke();
      R(g, mx - 16, my, 32, 9, '#4a4e5e'); R(g, mx - 16, my, 32, 1.5, '#8a8f9e'); R(g, mx - 30, my + 10, 60, 18, '#6a3a3a'); R(g, mx - 30, my + 10, 60, 1.5, '#9a5a4a'); R(g, mx - 18, my + 13, 14, 5, '#1a2030'); R(g, mx - 30, my + 22, 60, 6, 'rgba(0,0,0,.35)');
      if (S.wreck) {
        const c = S.wreck, k = Math.min(1.15, 260 / c.width), w = c.width * k, h = c.height * k;
        g.save(); g.imageSmoothingEnabled = false; g.translate(360, 300); g.rotate(-0.02); g.drawImage(c, -w / 2, -h, w, h); g.restore();
        R(g, 454, 250, 2, 40, '#5a4a3a'); sign(g, 432, 252, 48, 28, '#c8b080', [['VENDO', '#3a1a0a', 1, 4], ['TRATTO', '#7a1a0a', 1, 15]], '#5a3a1a');
      } else sign(g, 268, 268, 144, 16, '#3a2a1a', [['OGGI NIENTE CARCASSE', '#c8a870', 0.8, 5]]);
      R(g, 115.5, 269.5, 31, 41, INK); R(g, 116, 270, 30, 40, '#4a4a4a'); R(g, 116, 270, 30, 2, '#6a6a6a'); R(g, 116, 282, 30, 1.5, '#3a3a3a'); R(g, 116, 298, 30, 1.5, '#3a3a3a'); for (let q = 0; q < 6; q++) R(g, 118 + q * 5, 274 + q * 5, 3, 2, 'rgba(120,56,22,.7)');
      for (let k = 0; k < 10; k++) { const f = Math.sin(t * 9 + k * 1.3) * 0.5 + 0.5, h = 8 + f * 16; R(g, 117 + k * 2.8, 270 - h, 2.5, h, k % 3 === 0 ? '#ffd23f' : k % 2 ? '#ff7a1e' : '#ff4a1a'); R(g, 117.5 + k * 2.8, 270 - h * 0.5, 1, h * 0.4, '#fff2a0'); }
      glow(g, 131, 262, 72, '255,130,40', 0.32 + 0.08 * Math.sin(t * 7));
      for (let k = 0; k < 8; k++) { const ph = (t * 0.7 + k * 0.37) % 1; P(g, 125 + Math.sin(k * 3 + t) * 10, 262 - ph * 74, `rgba(255,${150 + k * 12},60,${1 - ph})`, 1); }
      pg(g, 200, 342, 1.85, LOOK.ferro, t, { seed: 3.3 });
      if (Math.sin(t * 1.3) > -0.2) { for (let k = 0; k < 16; k++) { const a2 = -0.6 + Math.random() * 1.2, d = Math.random() * 34; P(g, 226 + Math.cos(a2) * d, 262 + Math.sin(a2) * d * 0.6 + d * 0.2, Math.random() < 0.5 ? '#ffd23f' : '#ffffff', 1); } glow(g, 226, 262, 26, '255,210,120', 0.35); }
      const br = Math.sin(t * 1.4) * 0.8;
      R(g, 298, 334, 58, 6, '#5a2a2a'); R(g, 298, 334, 58, 1, '#8a4a4a');
      ell(g, 326, 330 - br / 2, 21, 8 + br / 2, INK); ell(g, 326, 330 - br / 2, 19.5, 6.8 + br / 2, '#8a6a4a'); ell(g, 322, 327 - br / 2, 12, 3, '#a8885e');
      ell(g, 309, 326, 7, 5.5, INK); ell(g, 309, 326, 6, 4.5, '#8a6a4a'); R(g, 303, 321, 4, 5, '#5a4a2a'); R(g, 304, 327, 2, 0.6, INK); ell(g, 345, 333, 6, 2, '#7a5a3a');
      if ((t % 6) < 2) t5(g, 'Z', 300, 306 - (t % 2) * 6, '#8a8f9e', 0.8);
      glow(g, 69, 50, 26, '255,240,200', 0.4);
    },
    hot: [{ x: 250, y: 200, w: 240, h: 100, label: 'La carcassa', go: 'La carcassa' }, { x: 100, y: 220, w: 140, h: 100, label: 'Massimo · rovista', go: 'Rovista' }, { x: 250, y: 20, w: 240, h: 150, label: 'Pezzi usati', go: 'Pezzi usati' }],
  };

  // le scene nuove al posto delle vecchie; le vecchie restano come <id>_vecchio (per tornarci: SCENE.fuel = SCENE.fuel_vecchio...)
  for (const id in HD) { NI.SCENE[id + '_vecchio'] = NI.SCENE[id]; NI.SCENE[id] = HD[id]; }
})();
