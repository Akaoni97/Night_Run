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
//  v0.121 (chiesta da Nico: «lavorare tanto sulla schermata iniziale»): la scena ora vive, ma sempre con animazioni CSS fatte dalla
//  scheda video (nessun ridisegno: lo scatto della v0.103 non torna). Sopra il quadro fermo c'è uno strato (`.nt-scena`, grande come la
//  scena e in scala con lei, 1 unità = `--u` px) con: auto del traffico che passano (fanali rossi e fari bianchi con la scia), le quattro
//  frecce che lampeggiano, il lampione spento che ogni tanto sfarfalla, il telefono che pulsa, le stelle che brillano e il tempo
//  (sereno, pioggia o nebbia, a caso a ogni avvio; `?meteo=pioggia` o `NightTitolo.meteo('nebbia')` per provarli). Il logo ha scintille
//  e sotto una frase che cambia (`NT_FRASI`). «Accendi e parti» gira la chiave: pannello giù, frecce spente, spinta in avanti sul
//  muso e un avviamento sintetizzato (`chiave`), poi parte il gioco di sempre. Solo se il clic o il tasto sono veri (le prove
//  automatiche partono subito). Le partite sono schede con auto, dove sei arrivato, soldi e ultima volta (`salvataggi.js`).
// ============================================================================
(function titolo() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const gate = document.getElementById('gate'), menu = document.getElementById('introMenu');
  if (!gate || !menu || !window.NightPrologo || !NightPrologo.arte) return;
  const A = NightPrologo.arte, { W, H, SS, R, hash, clamp, lerp, light, glow } = A;
  const ROAD = '#22263a', INK = '#0a0d18';

  // ------------------------------------------------------------ la tela e la presentazione (come il gioco)
  const cv = document.createElement('canvas'); cv.className = 'nt-bg'; cv.setAttribute('aria-hidden', 'true');
  const push = document.createElement('div'); push.className = 'nt-push'; push.setAttribute('aria-hidden', 'true');       // la spinta in avanti di «Accendi e parti»
  const cam = document.createElement('div'); cam.className = 'nt-cam';                                                      // la telecamera lenta (zoom CSS)
  const scena = document.createElement('div'); scena.className = 'nt-scena';                                                // gli strati animati, in scala con la scena
  cam.append(cv, scena); push.appendChild(cam); gate.insertBefore(push, gate.firstChild);
  const ctx = cv.getContext('2d');
  const lo = document.createElement('canvas'); lo.width = W * SS; lo.height = H * SS;
  const g = lo.getContext('2d'); A.kit(g);
  let up = null;
  function present() {
    const dpr = Math.min(2, window.devicePixelRatio || 1), cw = Math.round(cv.clientWidth * dpr), ch = Math.round(cv.clientHeight * dpr);
    if (!cw || !ch) return;
    if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
    const k = Math.max(cw / W, ch / H), dw = Math.round(W * k), dh = Math.round(H * k), dx = Math.floor((cw - dw) / 2), dy = Math.floor((ch - dh) * 0.7);   // riempie lo schermo (si taglia un po' di cielo, mai la strada)
    scena.style.cssText = `left:${dx / dpr}px;top:${dy / dpr}px;width:${dw / dpr}px;height:${dh / dpr}px;--u:${dw / dpr / W}px`;   // lo strato animato sta sulla scena
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
  const POS = { fl: [], head: null, phone: null };                                                                   // dove stanno frecce, fari e telefono (unità della scena)
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
      POS.fl = [[tl[0] + 1, tl[1] - 3], [D.head[0] - 4, D.head[1] + 3]].map(([fx, fy]) => [x + fx + 1.5, top + fy + 1]); POS.head = [x + D.head[0], top + D.head[1] + 2]; POS.tail = [x + tl[0] + 2, top + tl[1] + 2];
      // lui, appoggiato dietro l'auto, che guarda il telefono acceso
      if (typeof pgStanding === 'function') {
        const px = x - 22, py = gnd + 4, look = window.NightPG ? NightPG.now() : null;
        g.save(); pgStanding(g, px, py, 0.82, 0, false, look, 0.15, 1.3, 'phone'); g.restore();
        light(g, px + 6, py - 50, 12, 10, '#7fd8ff', 0.2);
        POS.phone = [px + 6, py - 50];
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
.gate.nt .nt-push{position:absolute;inset:0;z-index:0;overflow:hidden;transform-origin:28% 80%;transition:transform 1.8s cubic-bezier(.45,0,.75,.35)}
.gate.nt.nt-avvio .nt-push{transform:scale(1.32)}
.gate.nt .nt-cam{position:absolute;inset:0;transform-origin:62% 70%;will-change:transform}
.gate.nt.nt-on .nt-cam{animation:ntCam 46s ease-in-out infinite alternate}
@keyframes ntCam{from{transform:scale(1.02) translate(0,0)}to{transform:scale(1.09) translate(-1.6%,-.6%)}}
.gate.nt .nt-bg{position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 1.2s}
.gate.nt.nt-on .nt-bg,.gate.nt.nt-on .nt-scena{opacity:1}
.nt-scena{position:absolute;opacity:0;transition:opacity 1.6s;pointer-events:none;overflow:visible}
.nt-scena>*{position:absolute;pointer-events:none}
/* traffico: una coppia di luci (fanale rosso dietro, faro bianco davanti) con la sua scia, da sinistra a destra */
.nt-tr{left:0;width:calc(var(--u)*34);height:0;will-change:transform;animation:ntTr var(--d) linear var(--dl) infinite}
.nt-tr i{position:absolute;top:calc(var(--u)*-.8);height:calc(var(--u)*1.6);border-radius:3px}
.nt-tr .r{left:0;width:calc(var(--u)*2.4);background:#ff3a2a;box-shadow:0 0 calc(var(--u)*3) calc(var(--u)*.9) rgba(255,58,42,.85)}
.nt-tr .t{left:calc(var(--u)*-70);width:calc(var(--u)*70);top:calc(var(--u)*-.35);height:calc(var(--u)*.7);background:linear-gradient(90deg,transparent,rgba(255,70,50,.55))}
.nt-tr .f{right:0;width:calc(var(--u)*2.4);background:#fff4d8;box-shadow:0 0 calc(var(--u)*4) calc(var(--u)*1.2) rgba(255,244,216,.9)}
.nt-tr .b{right:calc(var(--u)*-26);width:calc(var(--u)*28);top:calc(var(--u)*-.6);height:calc(var(--u)*1.2);background:linear-gradient(90deg,rgba(255,244,216,.55),transparent)}
@keyframes ntTr{from{transform:translateX(calc(var(--u)*-110))}to{transform:translateX(calc(var(--u)*700))}}
/* le quattro frecce dell'auto ferma */
.nt-hz{width:calc(var(--u)*3.4);height:calc(var(--u)*2.4);margin:calc(var(--u)*-1.2) 0 0 calc(var(--u)*-1.7);border-radius:50%;background:#ffb12a;box-shadow:0 0 calc(var(--u)*7) calc(var(--u)*3) rgba(255,170,40,.8);animation:ntHz 1.05s steps(1) infinite;opacity:0}
@keyframes ntHz{0%{opacity:1}50%{opacity:0}}
.gate.nt.nt-avvio .nt-hz{animation:none;opacity:0;transition:opacity .3s}
/* il lampione spento che ogni tanto fa un lampo */
.nt-lamp{width:calc(var(--u)*30);height:calc(var(--u)*22);margin:calc(var(--u)*-11) 0 0 calc(var(--u)*-15);background:radial-gradient(closest-side,rgba(255,217,160,.55),rgba(255,217,160,0));opacity:0;animation:ntLamp 9s linear infinite}
@keyframes ntLamp{0%,41%{opacity:0}42%{opacity:.9}43%{opacity:.1}44.5%{opacity:.7}46%,78%{opacity:0}79%{opacity:.45}80.5%,100%{opacity:0}}
/* il telefono di lui che pulsa */
.nt-tel{width:calc(var(--u)*18);height:calc(var(--u)*16);margin:calc(var(--u)*-8) 0 0 calc(var(--u)*-9);background:radial-gradient(closest-side,rgba(127,216,255,.5),rgba(127,216,255,0));animation:ntTel 3.4s ease-in-out infinite}
@keyframes ntTel{0%,100%{opacity:.35}50%{opacity:.9}}
/* stelle che brillano */
.nt-st{width:calc(var(--u)*1.1);height:calc(var(--u)*1.1);margin:calc(var(--u)*-.5) 0 0 calc(var(--u)*-.5);background:#fff6e0;border-radius:50%;box-shadow:0 0 calc(var(--u)*2) rgba(255,246,224,.8);opacity:.2;animation:ntSt var(--d) ease-in-out var(--dl) infinite}
@keyframes ntSt{0%,100%{opacity:.12}50%{opacity:.95}}
/* i fari dell'auto che si accendono forte quando giri la chiave */
.nt-fari{width:calc(var(--u)*120);height:calc(var(--u)*34);margin:calc(var(--u)*-17) 0 0 calc(var(--u)*-6);background:radial-gradient(ellipse at 6% 50%,rgba(255,240,200,.9),rgba(255,240,200,.35) 28%,rgba(255,240,200,0) 70%);opacity:0;transition:opacity .5s}
.gate.nt.nt-avvio .nt-fari{opacity:1}
/* il tempo */
.nt-rain,.nt-rain2{inset:-12% -6% 0 -6%;opacity:0;will-change:transform}
.nt-rain{background:repeating-linear-gradient(103deg,transparent 0 calc(var(--u)*7.3),rgba(176,196,255,.26) calc(var(--u)*7.3) calc(var(--u)*7.9));animation:ntRain .7s linear infinite}
.nt-rain2{background:repeating-linear-gradient(103deg,transparent 0 calc(var(--u)*11.1),rgba(210,222,255,.16) calc(var(--u)*11.1) calc(var(--u)*11.5));animation:ntRain .5s linear -.2s infinite}
@keyframes ntRain{from{transform:translate(0,0)}to{transform:translate(calc(var(--u)*-6.2),calc(var(--u)*26))}}
.nt-wet{left:0;right:0;top:61%;bottom:0;background:linear-gradient(rgba(70,90,170,0),rgba(70,90,170,.22) 40%,rgba(90,110,190,.12));opacity:0}
.nt-fog{width:calc(var(--u)*520);height:calc(var(--u)*90);background:radial-gradient(closest-side,rgba(160,150,215,.62),rgba(160,150,215,0));opacity:0;animation:ntFog var(--d) ease-in-out var(--dl) infinite alternate}
@keyframes ntFog{from{transform:translateX(calc(var(--u)*-50))}to{transform:translateX(calc(var(--u)*50))}}
.gate.nt.nt-m-pioggia .nt-rain,.gate.nt.nt-m-pioggia .nt-rain2,.gate.nt.nt-m-pioggia .nt-wet{opacity:1}
.gate.nt.nt-m-nebbia .nt-fog{opacity:1}
.gate.nt.nt-m-pioggia .nt-st{opacity:0;animation:none}
/* il logo: scintille e la frase che cambia */
.gate.nt .intro-title{position:absolute}
.nt-spk{position:absolute;width:16px;height:16px;margin:-8px 0 0 -8px;pointer-events:none;opacity:0;animation:ntSpk 7s ease-in-out var(--dl) infinite}
.nt-spk::before,.nt-spk::after{content:"";position:absolute;left:50%;top:50%;background:#fff;box-shadow:0 0 8px 2px rgba(255,220,160,.9)}
.nt-spk::before{width:100%;height:2px;margin:-1px 0 0 -50%}
.nt-spk::after{width:2px;height:100%;margin:-50% 0 0 -1px}
@keyframes ntSpk{0%,86%,100%{opacity:0;transform:scale(.2) rotate(0)}91%{opacity:1;transform:scale(1) rotate(25deg)}96%{opacity:0;transform:scale(.4) rotate(45deg)}}
.gate.nt .intro-title .t3{transition:opacity .6s}
.gate.nt .intro-title .t3.nt-cambia{opacity:0}
/* girare la chiave: il pannello scende e sparisce, il logo si accende */
.gate.nt .intro-menu{transition:opacity .45s,transform .45s}
.gate.nt.nt-avvio .intro-menu{opacity:0;transform:translateY(16px);pointer-events:none}
.gate.nt.nt-avvio .intro-title .t1{text-shadow:0 0 46px rgba(255,170,60,.7),0 0 18px rgba(255,95,168,.6),0 6px 0 rgba(0,0,0,.5);transition:text-shadow .8s}
@media (prefers-reduced-motion:reduce){.nt-tr,.nt-hz,.nt-lamp,.nt-tel,.nt-st,.nt-rain,.nt-rain2,.nt-fog,.nt-spk{animation:none!important}.gate.nt .nt-push{transition:none}}
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
@media (prefers-reduced-motion:reduce){.gate.nt .nt-bg{transition:none}.gate.nt.nt-on .nt-cam{animation:none}}`;
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
    if (window.NightSalvataggi && NightSalvataggi.aggiorna) NightSalvataggi.aggiorna();                 // le schede delle partite col luogo (capitali.js arriva dopo salvataggi.js)
    const h = menu.querySelector('h2'); if (h) h.innerHTML = iniziata ? 'Il <em>Viaggio</em> continua' : 'Il <em>Viaggio</em>';
  }


  // ------------------------------------------------------------ gli strati animati (CSS, sulla scheda video)
  const NT_FRASI = ['Stanotte si corre', 'Dodici capitali da attraversare', 'Ogni motore ha la sua voce', 'Pioggia, nebbia, neve e vento', 'L’autostrada va solo avanti', 'Pezzi veri, suoni veri', 'Tre partite, un solo viaggio'];
  const pct = (v, m) => (v / m * 100).toFixed(3) + '%';
  const el = (cls, st, html) => { const e = document.createElement('div'); e.className = cls; if (st) e.style.cssText = st; if (html) e.innerHTML = html; scena.appendChild(e); return e; };
  let fatto = false;
  function strati() {
    if (fatto) return; fatto = true;
    // stelle
    for (let i = 0; i < 26; i++) el('nt-st', `left:${pct(8 + hash(i + 71) * 624, W)};top:${pct(6 + hash(i + 93) * 150, H)};--d:${(2.4 + hash(i + 5) * 4).toFixed(2)}s;--dl:${(-hash(i + 17) * 6).toFixed(2)}s`);
    // nebbia (tre banchi che vanno e vengono) e pioggia (due strati) + asfalto lucido
    for (let i = 0; i < 3; i++) el('nt-fog', `left:${pct(-40 + i * 200, W)};top:${pct(214 + i * 38, H)};--d:${24 + i * 9}s;--dl:${-i * 7}s`);
    el('nt-rain'); el('nt-rain2'); el('nt-wet');
    // il traffico: sette coppie di luci su quattro corsie, a velocità diverse (negative: si comincia a metà strada)
    const corsie = [252, 262, 268, 304, 310, 258, 300];
    corsie.forEach((y, i) => el('nt-tr', `top:${pct(y, H)};--d:${(4.2 + hash(i + 31) * 6).toFixed(2)}s;--dl:${(-hash(i + 7) * 9).toFixed(2)}s`, '<i class="t"></i><i class="r"></i><i class="b"></i><i class="f"></i>'));
    // l'auto ferma: fari forti (per la chiave), frecce, il lampione spento che sfarfalla, il telefono
    if (POS.head) el('nt-fari', `left:${pct(POS.head[0], W)};top:${pct(POS.head[1], H)}`);
    for (const [fx, fy] of POS.fl) el('nt-hz', `left:${pct(fx, W)};top:${pct(fy, H)}`);
    el('nt-lamp', `left:${pct(349, W)};top:${pct(126, H)}`);
    if (POS.phone) el('nt-tel', `left:${pct(POS.phone[0], W)};top:${pct(POS.phone[1], H)}`);
  }
  // il tempo di questo avvio
  const METEO = ['sereno', 'pioggia', 'nebbia'];
  function meteo(m) {
    if (!METEO.includes(m)) { const r = Math.random(); m = r < 0.5 ? 'sereno' : r < 0.78 ? 'pioggia' : 'nebbia'; }
    for (const q of METEO) gate.classList.toggle('nt-m-' + q, q === m); return m;
  }
  try { const q = new URLSearchParams(location.search).get('meteo'); meteo(q); } catch (e) { meteo(); }
  // la frase sotto il logo che cambia, e le scintille sul logo
  function frasi() {
    const t3 = gate.querySelector('.intro-title .t3'), tt = gate.querySelector('.intro-title'); if (!t3 || !tt) return;
    let i = 0; t3.textContent = NT_FRASI[0];
    setInterval(() => { if (gate.hidden) return; t3.classList.add('nt-cambia'); setTimeout(() => { i = (i + 1) % NT_FRASI.length; t3.textContent = NT_FRASI[i]; t3.classList.remove('nt-cambia'); }, 650); }, 5400);
    [[14, 14, 0], [48, 8, -2.4], [78, 30, -4.5], [31, 62, -1.2]].forEach(([x, y, d]) => { const k = document.createElement('i'); k.className = 'nt-spk'; k.style.cssText = `left:${x}%;top:${y}%;--dl:${d}s`; tt.appendChild(k); });
  }

  // ------------------------------------------------------------ «Accendi e parti» gira la chiave
  // l'avviamento: il motorino a scatti (come quando gira a vuoto), poi il motore che prende, un colpo di gas e il minimo
  function chiave(ac) {
    const t0 = ac.currentTime + 0.05, out = ac.createGain(); out.gain.value = 0.55; out.connect(ac.destination);
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520; lp.connect(out);
    // motorino: una sega bassa con la tensione che va a colpi (sei giri di compressione in 0,8 s)
    const m = ac.createOscillator(), mg = ac.createGain(); m.type = 'sawtooth'; m.frequency.setValueAtTime(26, t0); m.frequency.linearRampToValueAtTime(34, t0 + 0.8);
    mg.gain.setValueAtTime(0, t0); for (let i = 0; i < 6; i++) { const a = t0 + i * 0.135; mg.gain.setValueAtTime(0.0, a); mg.gain.linearRampToValueAtTime(0.7, a + 0.04); mg.gain.linearRampToValueAtTime(0.18, a + 0.12); }
    mg.gain.linearRampToValueAtTime(0, t0 + 0.86); m.connect(mg); mg.connect(lp); m.start(t0); m.stop(t0 + 0.9);
    // il motore che prende: sega che sale e si assesta sul minimo (con il «lope» a 7 Hz), un colpo di gas
    const e = ac.createOscillator(), eg = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain();
    e.type = 'sawtooth'; e.frequency.setValueAtTime(34, t0 + 0.82); e.frequency.linearRampToValueAtTime(56, t0 + 0.98); e.frequency.linearRampToValueAtTime(48, t0 + 1.15);
    e.frequency.linearRampToValueAtTime(96, t0 + 1.4); e.frequency.linearRampToValueAtTime(52, t0 + 1.85);
    eg.gain.setValueAtTime(0, t0 + 0.8); eg.gain.linearRampToValueAtTime(0.85, t0 + 0.98); eg.gain.linearRampToValueAtTime(0.5, t0 + 1.2); eg.gain.linearRampToValueAtTime(0.95, t0 + 1.4); eg.gain.linearRampToValueAtTime(0.38, t0 + 1.9); eg.gain.linearRampToValueAtTime(0, t0 + 2.6);
    lfo.frequency.value = 7; lg.gain.value = 0.18; lfo.connect(lg); lg.connect(eg.gain); e.connect(eg); eg.connect(lp); e.start(t0 + 0.8); lfo.start(t0 + 0.8); e.stop(t0 + 2.7); lfo.stop(t0 + 2.7);
    // un filo di scarico: rumore filtrato che segue il colpo di gas
    const n = ac.createBufferSource(), nb = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    n.buffer = nb; const nf = ac.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 180; nf.Q.value = 0.8; const ng = ac.createGain();
    ng.gain.setValueAtTime(0, t0 + 0.8); ng.gain.linearRampToValueAtTime(0.5, t0 + 1.0); ng.gain.linearRampToValueAtTime(0.1, t0 + 1.3); ng.gain.linearRampToValueAtTime(0.5, t0 + 1.4); ng.gain.linearRampToValueAtTime(0, t0 + 2.2);
    n.connect(nf); nf.connect(ng); ng.connect(out); n.start(t0 + 0.8); n.stop(t0 + 2.4);
    setTimeout(() => { try { ac.close(); } catch (er) { /* niente */ } }, 3200);
  }
  let via = false;
  function gira(vera) {
    if (via) return; via = true;
    gate.classList.add('nt-avvio');
    try { const AC = window.AudioContext || window.webkitAudioContext; if (AC) { const ac = new AC(); if (ac.state === 'suspended') ac.resume(); chiave(ac); } } catch (e) { /* senza audio si parte lo stesso */ }
    setTimeout(() => { window.__ntVia = true; const go = document.getElementById('goBtn'); if (go) go.click(); }, 1750);
  }
  const goBtn = document.getElementById('goBtn');
  if (goBtn) goBtn.addEventListener('click', (e) => { if (window.__ntVia || !e.isTrusted || gate.hidden) return; e.preventDefault(); e.stopImmediatePropagation(); gira(true); }, true);   // solo un clic vero: le prove automatiche partono subito
  window.addEventListener('keydown', (e) => {
    if (window.__ntVia || !e.isTrusted || gate.hidden || e.repeat || (e.key !== 'Enter' && e.key !== ' ')) return;
    if (e.metaKey || e.ctrlKey || e.altKey || (e.target.closest && e.target.closest('input, textarea'))) return;
    e.preventDefault(); e.stopImmediatePropagation(); gira(true);
  }, true);

  function avvia() {
    pannello();
    prepara().then(() => { quadro(); strati(); frasi(); present(); gate.classList.add('nt-on'); window.addEventListener('resize', () => { if (!gate.hidden) ridisegna(); }); }).catch(() => {});
  }
  if (document.readyState === 'complete') setTimeout(avvia, 0); else window.addEventListener('load', avvia);

  // per le prove: ridisegna il quadro subito
  window.NightTitolo = { foto: () => { quadro(); present(); }, pannello, meteo, NT_FRASI, gira };
})();
