// ============================================================================
//  Night Run · Interni in alta definizione (dopo interni.js)
//  Le scene rifatte con più dettaglio: doppia densità (ss 2, come la strada in qualità alta: si disegna a mezze unità
//  sulle coordinate 640×360), tre piani di profondità (fondo, chi ti serve, bancone e oggetti in primo piano tagliati dal
//  bordo), materiali con 3-4 toni per colore (ombre verso il blu-viola, luci verso il giallo), luci vere (lampade con il
//  cono e la pozza, insegne, frigo, fari delle auto che passano e scorrono sui muri), persone disegnate come il
//  protagonista (pgStanding di personaggio.js) e piccole animazioni.
//  Per ora: il BAR (prototipo). La scena vecchia resta in NightInterni.SCENE.bar_vecchio; per tornarci:
//  NightInterni.SCENE.bar = NightInterni.SCENE.bar_vecchio (o togliere questo file da index.html).
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
  // la barista (stessa pixel art del protagonista): coda, camicia; va dalla macchina del caffè alla vetrinetta e torna
  const BARISTA = { pelle: 1, capelli: 'coda', capCol: 1, testa: 'niente', testaCol: 0, sopra: 'camicia', sopraCol: 3, barba: 'no', occhiali: 'no' };
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
      // ---- primo piano: si disegna in dyn (dopo la barista), qui solo in cache
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
      // la barista dietro al banco
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
    hot: [{ x: 198, y: 24, w: 94, h: 90, label: 'Bacheca dei lavori', go: 'Bacheca' }, { x: 0, y: 238, w: 640, h: 30, label: 'Bancone', go: 'Al bancone' }, { x: 186, y: 122, w: 108, h: 62, label: 'Caffè', go: 'Al bancone' }, { x: 14, y: 30, w: 172, h: 136, label: 'La tua auto', go: 'close' }],
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

  NI.SCENE.bar_vecchio = NI.SCENE.bar;
  NI.SCENE.bar = BAR;
})();
