// ============================================================================
//  Night Run · La schermata iniziale (v0.102, chiesta da Nico: «una facciata da rifare completamente»)
//  Sfondo (v0.103, dopo la prova di Nico: l'animazione scattava e le ruote sembravano ferme): un quadro fermo, disegnato
//  una volta sola alla risoluzione del gioco (tela 1280×720, coordinate 640×360, presentazione ×n netta e poi morbida)
//  con gli attrezzi del prologo (`NightPrologo.arte`): l'autostrada di notte, la luna, la città con l'insegna «SOLO
//  AVANTI», il cartello «USCITA 18 KM», i lampioni (quello in mezzo spento), le scie del traffico come in una foto a
//  lunga posa e in primo piano **l'auto della partita scelta** ferma in corsia d'emergenza con le quattro frecce, e il
//  protagonista appoggiato dietro che guarda il telefono. Si muove solo la «telecamera», piano, con una trasformazione
//  CSS (fatta dalla scheda video: non ridisegna niente, non può scattare). Si ridisegna solo se cambia la finestra.
//  Sopra: il logo nuovo (NIGHT RUN · THE LAST HIGHWAY) e il pannello (i tre salvataggi di salvataggi.js, il pulsante
//  che dice «Continua il viaggio» se la partita è già cominciata, i comandi, Crediti). Stessi id di prima (#gate,
//  #introMenu, #goBtn): index.html e gli altri file non cambiano. La scena si ferma quando la schermata si chiude.
//  Prova: NightTitolo.foto() ridisegna il quadro.
// ============================================================================
(function titolo() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const gate = document.getElementById('gate'), menu = document.getElementById('introMenu');
  if (!gate || !menu || !window.NightPrologo || !NightPrologo.arte) return;
  const A = NightPrologo.arte, { W, H, SS, R, hash, clamp, lerp, light, glow } = A;
  const ROAD = '#22263a', INK = '#0a0d18';

  // ------------------------------------------------------------ la tela e la presentazione (come il gioco)
  const cv = document.createElement('canvas'); cv.className = 'nt-bg'; cv.setAttribute('aria-hidden', 'true');
  gate.insertBefore(cv, gate.firstChild);
  const ctx = cv.getContext('2d');
  const lo = document.createElement('canvas'); lo.width = W * SS; lo.height = H * SS;
  const g = lo.getContext('2d'); A.kit(g);
  let up = null;
  function present() {
    const dpr = Math.min(2, window.devicePixelRatio || 1), cw = Math.round(cv.clientWidth * dpr), ch = Math.round(cv.clientHeight * dpr);
    if (!cw || !ch) return;
    if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
    const k = Math.max(cw / W, ch / H), dw = Math.round(W * k), dh = Math.round(H * k), dx = Math.floor((cw - dw) / 2), dy = Math.floor((ch - dh) * 0.7);   // riempie lo schermo (si taglia un po' di cielo, mai la strada)
    const kk = dh / lo.height;
    if (kk < 1.02 || Math.abs(kk - Math.round(kk)) < 0.01) { ctx.imageSmoothingEnabled = kk < 0.99; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(lo, dx, dy, dw, dh); return; }
    const n = Math.min(4, Math.ceil(kk)), uw = lo.width * n, uh = lo.height * n;
    up = up || document.createElement('canvas'); if (up.width !== uw || up.height !== uh) { up.width = uw; up.height = uh; }
    const ux = up.getContext('2d'); ux.imageSmoothingEnabled = false; ux.drawImage(lo, 0, 0, uw, uh);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'medium'; ctx.drawImage(up, dx, dy, dw, dh);
  }

  // ------------------------------------------------------------ gli strati fermi
  const LAY = {};
  function layer(key, paint) {
    if (LAY[key]) return LAY[key];
    const c = document.createElement('canvas'); c.width = W * SS; c.height = H * SS; const x = c.getContext('2d'); x.setTransform(SS, 0, 0, SS, 0, 0); x.imageSmoothingEnabled = false;
    A.kit(x); paint(x); A.kit(g); return (LAY[key] = c);
  }
  const paste = (c, ox = 0) => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(c, Math.round(ox * SS), 0); g.restore(); };
  // cielo, luna, colline e città lontana (si ripete in orizzontale per lo scorrere lento)
  function cielo(x) {
    A.skyCity(x, 7, 226, true);
    // la luna dietro un velo di nuvole
    glow(x, 470, 70, 80, '#b8b0ff', 0.2); glow(x, 470, 70, 30, '#fff4dc', 0.25);
    const mg = x.createRadialGradient(465, 65, 2, 470, 70, 17); mg.addColorStop(0, '#fffaf0'); mg.addColorStop(0.7, '#ece4cc'); mg.addColorStop(1, '#c8bea4');
    x.fillStyle = mg; x.beginPath(); x.arc(470, 70, 17, 0, Math.PI * 2); x.fill();
    x.fillStyle = 'rgba(150,140,120,.35)'; for (const [a, b, r] of [[464, 64, 3.5], [477, 73, 2.5], [467, 77, 2], [475, 62, 1.5]]) { x.beginPath(); x.arc(a, b, r, 0, Math.PI * 2); x.fill(); }   // i crateri
    // nuvole lunghe e sottili che passano davanti (morbide, non a righe)
    for (let i = 0; i < 4; i++) { const cy = 60 + i * 12, cx = 420 + hash(i + 3) * 140, rw = 70 + hash(i) * 60; const cg = x.createRadialGradient(cx, cy, 2, cx, cy, rw); cg.addColorStop(0, `rgba(70,54,110,${0.5 + hash(i + 9) * 0.2})`); cg.addColorStop(1, 'rgba(70,54,110,0)'); x.save(); x.translate(cx, cy); x.scale(1, 0.09); x.translate(-cx, -cy); x.fillStyle = cg; x.fillRect(cx - rw, cy - rw, rw * 2, rw * 2); x.restore(); }
  }
  function colline(x) {
    x.fillStyle = '#0d0c22'; x.beginPath(); x.moveTo(0, 226); for (let k = 0; k <= W; k += 4) x.lineTo(k, 200 + Math.sin(k * 0.011 + 1) * 9 + Math.sin(k * 0.037) * 4); x.lineTo(W, 226); x.fill();
    // piloni dell'alta tensione sulle colline
    for (const px of [90, 300, 520]) { const y = 196 + Math.sin(px * 0.011 + 1) * 9; R(x, px, y - 26, 1, 26, '#1c1a38'); R(x, px - 5, y - 24, 11, 1, '#1c1a38'); R(x, px - 3, y - 18, 7, 1, '#1c1a38'); }
    x.strokeStyle = 'rgba(40,36,80,.8)'; x.lineWidth = 0.5; x.beginPath(); x.moveTo(-10, 176); x.quadraticCurveTo(195, 186, 300, 172); x.quadraticCurveTo(410, 186, 520, 172); x.quadraticCurveTo(600, 182, 660, 176); x.stroke();
  }
  // la strada: asfalto con la grana, il bordo, la banchina in basso (le strisce scorrono a parte)
  function strada(x) {
    R(x, 0, 226, W, 10, '#151632');
    R(x, 0, 236, W, 103, ROAD); for (let i = 0; i < 1100; i++) R(x, hash(i + 9) * W, 236 + hash(i + 13) * 103, 0.5, 0.5, hash(i + 5) > 0.5 ? '#1b1f31' : '#2a2f46');
    const gr = x.createLinearGradient(0, 236, 0, 339); gr.addColorStop(0, 'rgba(8,8,24,.45)'); gr.addColorStop(0.45, 'rgba(8,8,24,0)'); x.fillStyle = gr; x.fillRect(0, 236, W, 103);
    R(x, 0, 238, W, 1.5, '#d8d4c6'); R(x, 0, 334, W, 1.5, '#d8d4c6');
    const K = A.kit(x); if (!(K.curbHD && K.curbHD(x, 0, 30, W))) R(x, 0, 339, W, 21, '#2b2f45');
  }

  // ------------------------------------------------------------ l'auto della partita (ferma: niente ruote che girano)
  let mia = null;
  async function prepara() {
    const G = window.nightRun && window.nightRun.game, id = (G && G.car) || 'v40';
    mia = (typeof CARS !== 'undefined' && CARS[id] && CARS[id].sprite) ? await A.carOf(id) : null;
    if (!mia) mia = await A.carOf('v40');
  }
  const V = () => A.kit(g);

  // le scie del traffico come in una foto a lunga posa: fari bianchi e fanali rossi che attraversano tutta la strada
  function scie(y, col, a, n, seed) {
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const yy = y + (hash(seed + i) - 0.5) * 3, x0 = -20 + hash(seed + i * 3) * 120, x1 = W - hash(seed + i * 5) * 140, aa = a * (0.4 + hash(seed + i * 7) * 0.6);
      const gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(0.15, `rgba(${col},${aa})`); gr.addColorStop(0.85, `rgba(${col},${aa})`); gr.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = gr; g.fillRect(x0, yy, x1 - x0, 0.5 + hash(seed + i * 11)); 
      g.fillStyle = `rgba(${col},${aa * 0.25})`; g.fillRect(x0, yy - 1, x1 - x0, 3);   // l'alone
    }
    g.restore();
  }

  // ------------------------------------------------------------ il quadro: si disegna una volta sola (e a ogni cambio di misura)
  function quadro() {
    g.setTransform(SS, 0, 0, SS, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.imageSmoothingEnabled = false; A.kit(g);
    const t = 3.2;                                                                     // un istante fisso (coni, riflessi, pulviscolo)
    paste(layer('cielo', cielo)); paste(layer('colline', colline));
    // l'insegna SOLO AVANTI sul tetto della città, rosa
    { const xx = 120; R(g, xx + 8, 150, 1, 10, '#1a1838'); R(g, xx + 70, 150, 1, 10, '#1a1838'); if (V().text) { V().text(g, 'SOLO AVANTI', xx, 142, '#ff5fa8', 1); light(g, xx + 39, 145, 50, 10, '#ff5fa8', 0.07); } }
    paste(layer('strada', strada));
    for (let k = 4; k < W; k += 64) R(g, k, 286, 32, 2, '#d8d4c6');                                                    // tratteggio
    for (let gx = 6; gx < W + 50; gx += 50) R(g, gx, 222, 2, 14, '#3a3e4e');                                           // guardrail
    R(g, 0, 224, W, 4, '#5a5e70'); R(g, 0, 224, W, 1, '#8a90a8'); R(g, 0, 228, W, 1, '#2a2c38');
    // il cartello verde a bordo strada: USCITA 18 KM (quello che non cambia mai)
    { const sx = 206; R(g, sx + 6, 170, 3, 56, '#2a2c38'); R(g, sx + 58, 170, 3, 56, '#2a2c38'); R(g, sx - 1, 139, 70, 33, INK); R(g, sx, 140, 68, 31, '#0b5a30'); R(g, sx + 2, 142, 64, 27, '#0e6a38'); R(g, sx + 4, 144, 60, 0.5, '#d8e8d8');
      if (V().text) { V().text(g, 'USCITA', sx + 34 - V().textW('USCITA', 1) / 2, 148, '#f2f2e6', 1); V().text(g, '18 KM', sx + 34 - V().textW('18 KM', 2) / 2, 156, '#f2f2e6', 2); } light(g, sx + 34, 156, 40, 18, '#9affc0', 0.03); }
    // i lampioni: due accesi, quello in mezzo spento
    for (const [lx, acceso] of [[70, true], [330, false], [530, true]]) {
      if (V().lampHD) V().lampHD(g, lx, acceso, '#ffd9a0', lx);
      if (acceso) { if (V().lampCone) V().lampCone(g, lx, '#ffd9a0', t, false); light(g, lx + 19, 126, 18, 9, '#ffd9a0', 0.14); light(g, lx + 19, 300, 90, 16, '#ffcf8a', 0.05); A.reflect(g, lx + 19, 240, 60, 10, '#ffd9a0', 0.12, t); }
    }
    // le scie del traffico nelle due corsie di sopra: chi va avanti (fanali rossi) e il riflesso sull'asfalto bagnato
    scie(262, '255,60,40', 0.55, 5, 11); scie(268, '255,236,190', 0.45, 4, 23); scie(304, '255,60,40', 0.45, 4, 37); scie(310, '255,236,190', 0.4, 3, 41);
    scie(252, '255,170,60', 0.35, 2, 53);                                                                               // le luci di ingombro di un camion
    // la nostra auto ferma in corsia d'emergenza, con le quattro frecce e i fari accesi
    if (mia) {
      const D = mia.D, x = 196, gnd = 332, top = gnd - (D.wy + D.wr);
      A.reflect(g, x + D.head[0], gnd + 2, 18, 12, '#ffe8b0', 0.16, t); A.reflect(g, x + D.tail[0] + 2, gnd + 2, 14, 7, '#ff3a2a', 0.14, t);
      A.shadowUnder(g, x, gnd, D.w, 0.7);
      A.beam(g, x + D.head[0], top + D.head[1] + 2, 300, 0.36);
      A.drawCar(g, mia, x, gnd, 0, 1);
      const tl = D.tail; R(g, x + tl[0], top + tl[1], tl[2], tl[3], '#ff3a2a'); light(g, x + tl[0] + 2, top + tl[1] + 2, 16, 8, '#ff3020', 0.18);
      light(g, x + D.head[0], top + D.head[1], 12, 7, '#fff0c8', 0.3);
      for (const [fx, fy] of [[tl[0] + 1, tl[1] - 3], [D.head[0] - 4, D.head[1] + 3]]) { R(g, x + fx, top + fy, 3, 2, '#ffae2a'); light(g, x + fx + 1, top + fy + 1, 14, 8, '#ffae2a', 0.22); }   // le quattro frecce
      // lui, appoggiato dietro l'auto, che guarda il telefono acceso
      if (typeof pgStanding === 'function') {
        const px = x - 22, py = gnd + 4, look = window.NightPG ? NightPG.now() : null;
        g.save(); pgStanding(g, px, py, 0.82, 0, false, look, 0.15, 1.3, 'phone'); g.restore();
        light(g, px + 6, py - 50, 12, 10, '#7fd8ff', 0.2);
      }
    }
    // velo per leggere il logo e il pannello, ombra ai bordi
    const vl = g.createLinearGradient(0, 0, 0, 150); vl.addColorStop(0, 'rgba(6,5,16,.55)'); vl.addColorStop(1, 'rgba(6,5,16,0)'); g.fillStyle = vl; g.fillRect(0, 0, W, 150);
    A.vignette(g, 0.5);
  }
  let giro = 0;
  const ridisegna = () => { clearTimeout(giro); giro = setTimeout(() => { try { present(); } catch (e) { /* niente */ } }, 120); };

  // ------------------------------------------------------------ il pannello: logo, salvataggi, pulsante giusto
  const CSS = `
.gate.intro.nt{background:#05040c}
.gate.intro.nt::before,.gate.intro.nt::after{display:none!important}
.gate.nt .nt-bg{position:absolute;inset:0;width:100%;height:100%;z-index:0;opacity:0;transition:opacity 1.2s;transform-origin:62% 70%;will-change:transform}
.gate.nt.nt-on .nt-bg{animation:ntCam 46s ease-in-out infinite alternate}
@keyframes ntCam{from{transform:scale(1.02) translate(0,0)}to{transform:scale(1.09) translate(-1.6%,-.6%)}}
.gate.nt.nt-on .nt-bg{opacity:1}
.gate.nt .intro-title{z-index:1;left:max(28px,4vw);top:max(26px,6vh);transform:none!important;justify-items:start;text-align:left;opacity:1}
.gate.nt .intro-title .t1{font-size:clamp(46px,7.4vw,112px);text-shadow:0 0 30px rgba(255,95,168,.35),0 6px 0 rgba(0,0,0,.5)}
.gate.nt .intro-title .t2{font-size:clamp(15px,1.9vw,28px);padding-left:.2em;letter-spacing:.32em}
.gate.nt .intro-title .t3{font-size:clamp(11px,1.1vw,14px);letter-spacing:.6em;color:#ff8fb8;opacity:.85}
.gate.nt .intro-title::after{content:"";display:block;width:min(46vw,560px);height:2px;margin-top:14px;background:linear-gradient(90deg,#ffb347,#ff5fa8 60%,transparent)}
.gate.nt .intro-menu{z-index:2}
@media (min-width:900px){.gate.nt .intro-menu{right:max(28px,3vw);bottom:max(28px,6vh);width:380px}}
.gate.nt .intro-menu ul{display:none}
.gate.nt.nt-nuova .intro-menu ul{display:grid}
.gate.nt .nt-cont{display:none;margin:0;font:500 14px/1.45 "Barlow Semi Condensed",system-ui,sans-serif;color:#e8e0d2}
.gate.nt:not(.nt-nuova) .nt-cont{display:block}
.gate.nt .nt-cont b{color:#ffb347;font-weight:600}
@media (max-height:600px){.gate.nt .intro-title{top:14px}.gate.nt .intro-title .t1{font-size:clamp(34px,9vh,64px)}.gate.nt .intro-title .t3,.gate.nt .intro-title::after{display:none}}
@media (max-height:520px){.gate.nt .intro-menu{bottom:8px;top:auto;max-height:calc(100% - 16px);overflow:auto;padding:12px 14px;gap:8px}.gate.nt .intro-menu ul,.gate.nt.nt-nuova .intro-menu ul,.gate.nt .intro-menu .keys{display:none!important}.gate.nt .intro-menu h2{font-size:18px}.gate.nt .nr-slots{margin:4px 0 0}}
@media (max-height:520px) and (max-width:900px){.gate.nt .intro-title{display:none}}
@media (prefers-reduced-motion:reduce){.gate.nt .nt-bg{transition:none}.gate.nt.nt-on .nt-bg{animation:none}}`;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  gate.classList.add('nt');
  const cont = document.createElement('p'); cont.className = 'nt-cont'; const ul = menu.querySelector('ul'); if (ul) ul.after(cont);
  // il testo del pannello e del pulsante secondo la partita scelta (nuova o già cominciata)
  function pannello() {
    const G = window.nightRun && window.nightRun.game, s = G && G.s, vg = s && s.vg, iniziata = !!(vg && vg.prologo);
    gate.classList.toggle('nt-nuova', !iniziata);
    const go = document.getElementById('goBtn'); if (go) go.textContent = iniziata ? 'Continua il viaggio' : 'Accendi e parti';
    if (iniziata) {
      const C = typeof CARS !== 'undefined' && CARS[G.car], km = Math.max(0, (s.dist || 0) / 1000);
      cont.innerHTML = `Riparti da dove eri: <b>${C ? C.name : G.car}</b>, km <b>${km.toLocaleString('it-IT', { maximumFractionDigits: 1 })}</b>, in tasca <b>€ ${Math.round(s.money || 0).toLocaleString('it-IT')}</b>.`;
    }
    const h = menu.querySelector('h2'); if (h) h.innerHTML = iniziata ? 'Il <em>Viaggio</em> continua' : 'Il <em>Viaggio</em>';
  }

  function avvia() {
    pannello();
    prepara().then(() => { quadro(); present(); gate.classList.add('nt-on'); window.addEventListener('resize', () => { if (!gate.hidden) ridisegna(); }); }).catch(() => {});
  }
  if (document.readyState === 'complete') setTimeout(avvia, 0); else window.addEventListener('load', avvia);

  // per le prove: ridisegna il quadro subito
  window.NightTitolo = { foto: () => { quadro(); present(); }, pannello };
})();
