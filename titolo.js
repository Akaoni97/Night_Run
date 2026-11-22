// ============================================================================
//  Night Run · La schermata iniziale (v1.02, chiesta da Nico: «una facciata da rifare completamente»)
//  Sfondo: una scena animata alla risoluzione del gioco (tela 1280×720, coordinate 640×360, presentazione ×n netta e
//  poi morbida), disegnata con gli attrezzi del gioco presi dal prologo (`NightPrologo.arte`: cielo e città, lampioni
//  e coni di luce di Street2D, auto ad alta definizione con le ruote che girano): l'autostrada di notte, la luna dietro
//  le nuvole, la città lontana con le antenne, l'insegna «SOLO AVANTI» sul tetto, il portale che passa, il traffico
//  (anche i camion) e in primo piano **l'auto della partita scelta**, coi fari, i fanali e ogni tanto un botto dallo
//  scarico. Ogni tanto un lampione si spegne da solo: la storia è horror.
//  Sopra: il logo nuovo (NIGHT RUN · THE LAST HIGHWAY) e il pannello (i tre salvataggi di salvataggi.js, il pulsante
//  che dice «Continua il viaggio» se la partita è già cominciata, i comandi, Crediti). Stessi id di prima (#gate,
//  #introMenu, #goBtn): index.html e gli altri file non cambiano. La scena si ferma quando la schermata si chiude.
//  Prova: NightTitolo.foto(secondo) disegna un momento preciso.
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

  // ------------------------------------------------------------ le auto
  let mia = null, traf = [], camion = null, pronti = false;
  async function prepara() {
    const G = window.nightRun && window.nightRun.game, id = (G && G.car) || 'v40';
    const ids = [id, 'panda', 'punto', 'polo', 'corsa', 'a80', 'golf', 'e30', 'p206'].filter((x, i, a) => a.indexOf(x) === i && typeof CARS !== 'undefined' && CARS[x] && CARS[x].sprite);
    const cars = await Promise.all(ids.map((x) => A.carOf(x)));
    mia = cars[0]; traf = cars.slice(1).filter(Boolean);
    camion = await A.carOf('tir_container') || await A.carOf('tir');
    pronti = true;
  }
  // il traffico: pochi veicoli che sorpassiamo nella corsia di sopra (più lenti) e che ci superano in quella di sotto
  const VEI = [];
  function nuovo(t, primo) {
    const camionK = camion && hash(t * 3.1) < 0.28, C = camionK ? camion : traf[Math.floor(hash(t * 7.7) * traf.length)];
    if (!C) return;
    const s = camionK ? 0.44 : 0.82;
    VEI.push({ C, s, gnd: 280, x: primo ? 300 + hash(t) * 300 : W + 40, v: -(90 + hash(t * 5.3) * 80), ang: 0 });
  }

  // ------------------------------------------------------------ la scena
  let T0 = performance.now(), raf = 0, viva = true, lastT = 0, nextVei = 2, pops = [], nextPop = 4;
  function scena(t, dt) {
    g.setTransform(SS, 0, 0, SS, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.imageSmoothingEnabled = false; A.kit(g);
    const v = 820;                                                                    // unità al secondo: la strada scorre (≈100 km/h)
    // cielo fermo, città e colline che scorrono piano
    paste(layer('cielo', cielo));
    const off = (t * 6) % W; paste(layer('colline', colline), -off); paste(layer('colline', colline), W - off);
    // l'insegna sul tetto della città: SOLO AVANTI, rosa, che ogni tanto sfarfalla
    { const on = hash(Math.floor(t * 8)) > 0.05, x0 = 130 - ((t * 3) % 900); for (const xx of [x0, x0 + 900]) if (xx > -120 && xx < W) { R(g, xx + 8, 150, 1, 10, '#1a1838'); R(g, xx + 70, 150, 1, 10, '#1a1838'); if (V().text) { const col = on ? '#ff5fa8' : '#5a2a48'; V().text(g, 'SOLO AVANTI', xx, 142, col, 1); if (on) light(g, xx + 39, 145, 50, 10, '#ff5fa8', 0.06); } } }
    paste(layer('strada', strada));
    // strisce che scorrono, lampioni coi coni di luce (uno ogni tanto si spegne da solo)
    const px = t * v;
    for (let k = -((px) % 64) - 64; k < W; k += 64) R(g, k, 286, 32, 2, '#d8d4c6');
    for (let gx = -((px * 0.9) % 50) - 50; gx < W + 50; gx += 50) R(g, gx, 222, 2, 14, '#3a3e4e');
    R(g, 0, 224, W, 4, '#5a5e70'); R(g, 0, 224, W, 1, '#8a90a8'); R(g, 0, 228, W, 1, '#2a2c38');
    const lx0 = -((px * 0.75) % 380) - 40;
    for (let i = 0; i < 3; i++) {
      const lx = lx0 + i * 380, idx = Math.floor((px * 0.75) / 380) + i, morto = hash(idx * 1.7) < 0.14, fl = morto ? (hash(Math.floor(t * 14) + idx) > 0.7 ? 1 : 0) : 1;
      if (V().lampHD) V().lampHD(g, lx, fl > 0, '#ffd9a0', idx);
      if (fl > 0) { if (V().lampCone) V().lampCone(g, lx, '#ffd9a0', t, false); light(g, lx + 19, 126, 16, 8, '#ffd9a0', 0.12); light(g, lx + 19, 240, 60, 8, '#ffcf8a', 0.04); }
    }
    // il portale verde passa ogni tanto
    { const per = 9, ph = t % per, gx = W + 40 - ph * 300;
      if (gx > -270 && gx < W + 10) {
        const uscita = Math.floor(t / per) % 2 === 1, a = uscita ? 'USCITA' : 'AUTOSTRADA', b = uscita ? '18 KM' : 'SOLO AVANTI';
        R(g, gx - 8, 60, 6, 176, '#2a2c38'); R(g, gx + 236, 60, 6, 176, '#2a2c38'); R(g, gx - 8, 60, 250, 4, '#3a3e4e');
        R(g, gx - 1, 66, 232, 70, INK); R(g, gx, 67, 230, 68, '#0b5a30'); R(g, gx + 3, 70, 224, 62, '#0e6a38'); R(g, gx + 6, 73, 218, 0.5, '#d8e8d8'); R(g, gx + 6, 128, 218, 0.5, '#d8e8d8');
        if (V().text) { V().text(g, a, gx + 115 - V().textW(a, 2) / 2, 82, '#f2f2e6', 2); V().text(g, b, gx + 115 - V().textW(b, 2) / 2, 104, '#f2f2e6', 2); }
        light(g, gx + 115, 100, 130, 40, '#9affc0', 0.025);
      }
    }
    // il traffico della corsia di sopra (lo sorpassiamo)
    if (pronti) {
      if (t > nextVei) { nuovo(t, false); nextVei = t + 3 + hash(t * 2.2) * 4; }
      for (const e of VEI) { e.x += e.v * dt; e.ang += (v + e.v) * dt / (e.C.D.wr * e.s); }
      for (let i = VEI.length - 1; i >= 0; i--) if (VEI[i].x < -VEI[i].C.D.w * VEI[i].s - 40) VEI.splice(i, 1);
      for (const e of VEI) {
        const D = e.C.D, top = e.gnd - (D.wy + D.wr) * e.s;
        A.shadowUnder(g, e.x, e.gnd, D.w * e.s, 0.5); A.drawCar(g, e.C, e.x, e.gnd, e.ang, e.s);
        const tl = D.tail; R(g, e.x + tl[0] * e.s, top + tl[1] * e.s, Math.max(2, tl[2] * e.s), Math.max(2, tl[3] * e.s), '#ff3a2a'); light(g, e.x + tl[0] * e.s + 1, top + tl[1] * e.s + 1, 10, 5, '#ff3020', 0.14);
        A.beam(g, e.x + D.head[0] * e.s, top + D.head[1] * e.s + 1, 120, 0.18, 0.6);
      }
    }
    // la nostra auto: corsia di sotto, un po' a sinistra, che ondeggia appena; fari, fanali, e ogni tanto un botto
    if (mia) {
      const D = mia.D, x = 150 + Math.sin(t * 0.6) * 10, gnd = 326 + Math.sin(t * 11) * 0.3, top = gnd - (D.wy + D.wr);
      A.reflect(g, x + D.head[0], gnd + 2, 16, 10, '#ffe8b0', 0.14, t); A.reflect(g, x + D.tail[0] + 2, gnd + 2, 12, 6, '#ff3a2a', 0.12, t);
      A.shadowUnder(g, x, gnd, D.w, 0.65);
      A.beam(g, x + D.head[0], top + D.head[1] + 2, 300, 0.36);
      A.drawCar(g, mia, x, gnd, px / D.wr, 1);
      const tl = D.tail; R(g, x + tl[0], top + tl[1], tl[2], tl[3], '#ff3a2a'); light(g, x + tl[0] + 2, top + tl[1] + 2, 16, 8, '#ff3020', 0.16);
      light(g, x + D.head[0], top + D.head[1], 12, 7, '#fff0c8', 0.28);
      // scarico: fumo leggero, e ogni tanto un botto con la fiammata
      if (t > nextPop) { pops.push({ t0: t, x: x + D.ex[0], y: top + D.ex[1] }); nextPop = t + 5 + hash(t) * 7; }
      for (const p of pops) {
        const a = t - p.t0; if (a > 0.35) continue;
        const k = 1 - a / 0.35, len = 10 + 14 * k;
        g.save(); g.globalCompositeOperation = 'lighter';
        g.fillStyle = `rgba(255,140,40,${0.8 * k})`; g.beginPath(); g.moveTo(p.x, p.y - 2); g.lineTo(p.x - len, p.y); g.lineTo(p.x, p.y + 2); g.fill();
        g.fillStyle = `rgba(255,230,140,${0.9 * k})`; g.beginPath(); g.moveTo(p.x, p.y - 1); g.lineTo(p.x - len * 0.5, p.y); g.lineTo(p.x, p.y + 1); g.fill();
        g.restore(); light(g, p.x - 6, p.y, 18, 10, '#ff8a2a', 0.2 * k);
      }
      pops = pops.filter((p) => t - p.t0 < 0.4);
    }
    // velo per leggere il logo (in alto a sinistra) e il pannello (a destra), e l'ombra ai bordi
    const vl = g.createLinearGradient(0, 0, 0, 150); vl.addColorStop(0, 'rgba(6,5,16,.55)'); vl.addColorStop(1, 'rgba(6,5,16,0)'); g.fillStyle = vl; g.fillRect(0, 0, W, 150);
    A.vignette(g, 0.5);
  }
  const V = () => A.kit(g);

  function frame(now) {
    if (!viva) return;
    raf = requestAnimationFrame(frame);
    if (gate.hidden || gate.classList.contains('out')) { if (gate.hidden) { viva = false; cancelAnimationFrame(raf); } return; }
    const t = (now - T0) / 1000, dt = Math.min(0.05, Math.max(0, t - lastT)); lastT = t;
    try { scena(t, dt); present(); } catch (e) { console.warn('titolo', e); viva = false; }
  }

  // ------------------------------------------------------------ il pannello: logo, salvataggi, pulsante giusto
  const CSS = `
.gate.intro.nt{background:#05040c}
.gate.intro.nt::before,.gate.intro.nt::after{display:none!important}
.gate.nt .nt-bg{position:absolute;inset:0;width:100%;height:100%;z-index:0;opacity:0;transition:opacity 1.2s}
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
@media (prefers-reduced-motion:reduce){.gate.nt .nt-bg{transition:none}}`;
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
    prepara().then(() => { gate.classList.add('nt-on'); }).catch(() => {});
    T0 = performance.now(); lastT = 0; raf = requestAnimationFrame(frame);
  }
  if (document.readyState === 'complete') setTimeout(avvia, 0); else window.addEventListener('load', avvia);

  // per le prove: disegna il secondo t (senza aspettare) e lo porta sullo schermo
  window.NightTitolo = { foto: (t) => { scena(t, 0.016); present(); }, pannello };
})();
