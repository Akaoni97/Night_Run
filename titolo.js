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
//  #introMenu, #titleIgnition). La scena si ferma quando la schermata si chiude.
//  Prova: NightTitolo.foto() ridisegna il quadro.
//  v0.121 (chiesta da Nico: «lavorare tanto sulla schermata iniziale»): la scena ora vive, ma sempre con animazioni CSS fatte dalla
//  scheda video (nessun ridisegno: lo scatto della v0.103 non torna). Sopra il quadro fermo c'è uno strato (`.nt-scena`, grande come la
//  scena e in scala con lei, 1 unità = `--u` px) con: auto del traffico che passano (fanali rossi e fari bianchi con la scia), le quattro
//  frecce che lampeggiano, il lampione spento che ogni tanto sfarfalla, il telefono che pulsa, le stelle che brillano e il tempo
//  (sereno o nebbia, a caso a ogni avvio; dalla v0.167 la pioggia solo a mano con `?meteo=pioggia` o `NightTitolo.meteo('nebbia')` per provarli). Il logo ha scintille
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
  const push = document.createElement('div'); push.className = 'nt-push'; push.setAttribute('aria-hidden', 'true');       // la spinta in avanti all’avviamento
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
    // v0.138: profondità. La foschia vela la città lontana (più chiara e meno contrastata verso il basso) e all'orizzonte
    // c'è il bagliore delle luci di città, caldo in basso e viola sopra
    { const hz = x.createLinearGradient(0, 120, 0, 226); hz.addColorStop(0, 'rgba(46,34,92,0)'); hz.addColorStop(0.65, 'rgba(46,34,92,.2)'); hz.addColorStop(1, 'rgba(70,46,110,.34)'); x.fillStyle = hz; x.fillRect(0, 120, W, 106);
      x.save(); x.globalCompositeOperation = 'lighter';
      const bg = x.createLinearGradient(0, 168, 0, 226); bg.addColorStop(0, 'rgba(255,110,140,0)'); bg.addColorStop(0.7, 'rgba(255,120,110,.07)'); bg.addColorStop(1, 'rgba(255,170,110,.13)'); x.fillStyle = bg; x.fillRect(0, 168, W, 58);
      x.restore(); }
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
    // le case sulle colline: tetti a falde, camini, finestre accese, pini
    const hy = (k) => 200 + Math.sin(k * 0.011 + 1) * 9 + Math.sin(k * 0.037) * 4;
    for (let k = 4, n = 0; k < W - 6; n++) {
      const w = 8 + Math.floor(hash(n + 61) * 8), h = 6 + Math.floor(hash(n + 71) * 5), by = Math.round(hy(k + w / 2)) + 3;
      if (k > 364 && k < 422) { k += 62; continue; }                                     // sotto la ruota panoramica non ci sono case
      if (hash(n + 81) < 0.22) { const th = 8 + hash(n + 5) * 8; x.fillStyle = '#0c0b20'; x.beginPath(); x.moveTo(k, by); x.lineTo(k + 3, by - th); x.lineTo(k + 6, by); x.fill(); k += 7; continue; }   // un pino
      const bc = ['#1a1840', '#171637', '#201c44', '#14132f'][Math.floor(hash(n + 91) * 4)];
      R(x, k, by - h, w, h, bc); x.fillStyle = '#0d0c26'; x.beginPath(); x.moveTo(k - 1, by - h); x.lineTo(k + w / 2, by - h - 4 - hash(n + 3) * 3); x.lineTo(k + w + 1, by - h); x.fill();
      if (hash(n + 13) < 0.5) R(x, k + w - 3, by - h - 6, 2, 4, '#0d0c26');             // il camino
      const nw = w > 11 ? 2 : 1; for (let q = 0; q < nw; q++) if (hash(n * 5 + q + 21) < 0.62) { const wx = k + 2 + q * 5; R(x, wx, by - h + 2, 2, 2, hash(n * 7 + q) < 0.2 ? '#7fd8ff' : '#ffcf7a'); glow(x, wx + 1, by - h + 3, 5, '#ffb84a', 0.1); }
      k += w + 2 + Math.floor(hash(n + 41) * 12);
    }
    // la ruota panoramica: le gambe (la ruota gira sopra, a parte)
    { const rx = 392, ry = 152, b = hy(rx) + 4; x.strokeStyle = '#1e1b40'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(rx, ry); x.lineTo(rx - 15, b); x.moveTo(rx, ry); x.lineTo(rx + 15, b); x.stroke(); R(x, rx - 17, b - 1, 34, 2, '#14122e'); }
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
    // v0.138: partita nuova (il prologo non c'è ancora stato) = la E36 blu con cui arriva lui nel prologo, disegno ad alta
    // definizione; partita cominciata = l'auto che guidi
    const G = window.nightRun && window.nightRun.game, iniziata = !!(G && G.s && G.s.vg && G.s.vg.prologo);
    const id = iniziata ? (G.car || 'v40') : 'e36';
    mia = (typeof CARS !== 'undefined' && CARS[id] && CARS[id].sprite) ? await A.carOf(id) : null;
    if (mia && !iniziata && A.recolor && A.load) {                       // la E36 blu del prologo (stesso colore, stessa maschera della vernice)
      try { const mask = await A.load(mia.D.paintHd || mia.D.paint || 'img/e36_paint.png'); mia.b = A.recolor(mia.b, mask, '#1c4ac4'); } catch (e) { /* resta del suo colore */ }
    }
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

  // ------------------------------------------------------------ l'auto in primo piano (v0.138, chiesta da Nico: «la qualità dell'auto»)
  // La carrozzeria si disegna a parte e prende la luce della scena (fredda dal cielo sul tetto, calda dal lampione dietro),
  // un contorno scuro di mezza unità che la stacca dallo sfondo come nel gioco, e il suo riflesso sull'asfalto, appena mosso.
  function autoBella(x, gnd) {
    const D = mia.D, M = 4, bw = Math.ceil(mia.b.width / mia.k) + M * 2, bh = Math.ceil(mia.b.height / mia.k) + M * 2, hh = D.wy + D.wr;
    const tela = () => { const c = document.createElement('canvas'); c.width = bw * SS; c.height = bh * SS; const t = c.getContext('2d'); t.setTransform(SS, 0, 0, SS, 0, 0); return [c, t]; };
    const [cc, cx] = tela(); A.drawCar(cx, mia, M, M + hh, 0, 1);
    // la luce della scena, solo sulla carrozzeria
    cx.save(); cx.globalCompositeOperation = 'source-atop';
    const cielo = cx.createLinearGradient(0, M, 0, M + hh * 0.5); cielo.addColorStop(0, 'rgba(150,165,255,.3)'); cielo.addColorStop(1, 'rgba(150,165,255,0)'); cx.fillStyle = cielo; cx.fillRect(0, 0, bw, bh);
    const lamp = cx.createRadialGradient(M - 40, M - 10, 4, M - 40, M - 10, bw * 0.75); lamp.addColorStop(0, 'rgba(255,205,150,.32)'); lamp.addColorStop(1, 'rgba(255,205,150,0)'); cx.fillStyle = lamp; cx.fillRect(0, 0, bw, bh);
    cx.restore();
    // il contorno: la sagoma scura spostata di mezza unità nelle quattro direzioni
    const [sc, sx] = tela(); sx.setTransform(1, 0, 0, 1, 0, 0); sx.drawImage(cc, 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = INK; sx.fillRect(0, 0, sc.width, sc.height);
    // il riflesso: capovolto, schiacciato, che sfuma e ondeggia a strisce
    const [rc, rx] = tela(); rx.setTransform(1, 0, 0, -1, 0, rc.height); rx.drawImage(cc, 0, 0); rx.setTransform(1, 0, 0, 1, 0, 0);
    const fd = rx.createLinearGradient(0, 0, 0, rc.height * 0.55); fd.addColorStop(0, 'rgba(0,0,0,.9)'); fd.addColorStop(1, 'rgba(0,0,0,0)');
    rx.globalCompositeOperation = 'destination-in'; rx.fillStyle = fd; rx.fillRect(0, 0, rc.width, rc.height);
    const X = x - M, Y = gnd - hh - M, top0 = (bh - M - hh) * SS;       // top0: dove comincia la carrozzeria capovolta nella tela del riflesso
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = true; g.globalAlpha = 0.3;
    for (let r = 0; r < 24 * SS; r += 2) {                                   // strisce di un'unità schiacciate a 0,6, ognuna spostata di poco
      const wob = Math.round(Math.sin(r * 0.5 + 1.3) * 0.8 * SS), sy = top0 + r / 0.6;
      if (sy + 2 / 0.6 > rc.height) break;
      g.drawImage(rc, 0, sy, rc.width, 2 / 0.6, X * SS + wob, (gnd + 0.5) * SS + r, rc.width, 2);
    }
    g.restore();
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = false; g.globalAlpha = 0.9;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) g.drawImage(sc, X * SS + dx, Y * SS + dy);
    g.globalAlpha = 1; g.drawImage(cc, X * SS, Y * SS); g.restore();
  }

  // ------------------------------------------------------------ il quadro: si disegna una volta sola (e a ogni cambio di misura)
  function quadro() {
    g.setTransform(SS, 0, 0, SS, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.imageSmoothingEnabled = false; A.kit(g);
    const t = 3.2;                                                                     // un istante fisso (coni, riflessi, pulviscolo)
    paste(layer('cielo', cielo)); paste(layer('colline', colline));
    paste(layer('strada', strada));
    for (let k = 4; k < W; k += 64) R(g, k, 286, 32, 2, '#d8d4c6');                                                    // tratteggio
    // v0.138: le luci della città e delle colline si specchiano appena sull'asfalto della corsia lontana
    for (let i = 0; i < 14; i++) { const rx = 20 + hash(i * 13 + 7) * (W - 40); if (rx > 150 && rx < 430) continue; A.reflect(g, rx, 241, 26 + hash(i + 3) * 30, 2 + hash(i + 5) * 3, ['#ffcf7a', '#7fd8ff', '#ff8fb8', '#ffd9a0'][i % 4], 0.05 + hash(i + 9) * 0.05, t + i); }
    for (let gx = 6; gx < W + 50; gx += 50) R(g, gx, 222, 2, 14, '#3a3e4e');                                           // guardrail
    R(g, 0, 224, W, 4, '#5a5e70'); R(g, 0, 224, W, 1, '#8a90a8'); R(g, 0, 228, W, 1, '#2a2c38');
    // il cartello verde a bordo strada: ULTIMA USCITA (quello che non cambia mai)
    { const sx = 206; R(g, sx + 6, 170, 3, 56, '#2a2c38'); R(g, sx + 58, 170, 3, 56, '#2a2c38'); R(g, sx - 1, 139, 70, 33, INK); R(g, sx, 140, 68, 31, '#0b5a30'); R(g, sx + 2, 142, 64, 27, '#0e6a38'); R(g, sx + 4, 144, 60, 0.5, '#d8e8d8');
      if (V().text) { V().text(g, 'ULTIMA', sx + 34 - V().textW('ULTIMA', 2) / 2, 145, '#f2f2e6', 2); V().text(g, 'USCITA', sx + 34 - V().textW('USCITA', 2) / 2, 157, '#f2f2e6', 2); } light(g, sx + 34, 156, 40, 18, '#9affc0', 0.03); }
    // i lampioni: due accesi, quello in mezzo spento
    for (const [lx, acceso] of [[70, true], [330, false], [530, true]]) {
      if (V().lampHD) V().lampHD(g, lx, acceso, '#ffd9a0', lx);
      if (acceso) { if (V().lampCone && lx < 400) V().lampCone(g, lx, '#ffd9a0', t, false); light(g, lx + 19, 126, 18, 9, '#ffd9a0', 0.14); if (lx < 400) { light(g, lx + 19, 300, 90, 16, '#ffcf8a', 0.05); A.reflect(g, lx + 19, 240, 60, 10, '#ffd9a0', 0.12, t); } }
    }
    // la nostra auto ferma in corsia d'emergenza, con le quattro frecce e i fari accesi
    if (mia) {
      const D = mia.D, x = 196, gnd = 332, top = gnd - (D.wy + D.wr);
      A.reflect(g, x + D.head[0], gnd + 2, 18, 12, '#ffe8b0', 0.16, t); A.reflect(g, x + D.tail[0] + 2, gnd + 2, 14, 7, '#ff3a2a', 0.14, t);
      A.shadowUnder(g, x, gnd, D.w, 0.7);
      A.beam(g, x + D.head[0], top + D.head[1] + 2, 80, 0.36);
      autoBella(x, gnd);
      const tl = D.tail; R(g, x + tl[0], top + tl[1], tl[2], tl[3], '#ff3a2a'); light(g, x + tl[0] + 2, top + tl[1] + 2, 16, 8, '#ff3020', 0.18);
      light(g, x + D.head[0], top + D.head[1], 12, 7, '#fff0c8', 0.3);
      // il faro: una lama di luce orizzontale e una piccola stella (v0.138)
      { const hx = x + D.head[0], hy = top + D.head[1] + 1; g.save(); g.globalCompositeOperation = 'lighter';
        const fl = g.createLinearGradient(hx - 60, 0, hx + 60, 0); fl.addColorStop(0, 'rgba(255,236,190,0)'); fl.addColorStop(0.5, 'rgba(255,240,205,.55)'); fl.addColorStop(1, 'rgba(255,236,190,0)');
        g.fillStyle = fl; g.fillRect(hx - 60, hy - 0.25, 120, 0.5); g.fillStyle = 'rgba(255,240,205,.35)'; g.fillRect(hx - 0.25, hy - 5, 0.5, 10); g.restore(); }
      for (const [fx, fy] of [[tl[0] + 1, tl[1] - 3], [D.head[0] - 4, D.head[1] + 3]]) { R(g, x + fx, top + fy, 3, 2, '#ffae2a'); light(g, x + fx + 1, top + fy + 1, 14, 8, '#ffae2a', 0.22); }   // le quattro frecce
      POS.fl = [[tl[0] + 1, tl[1] - 3], [D.head[0] - 4, D.head[1] + 3]].map(([fx, fy]) => [x + fx + 1.5, top + fy + 1]); POS.head = [x + D.head[0], top + D.head[1] + 2]; POS.tail = [x + tl[0] + 2, top + tl[1] + 2];
      // lui, appoggiato dietro l'auto, che guarda il telefono acceso
      if (typeof pgStanding === 'function') {
        const px = x - 30, py = gnd + 4, look = window.NightPG ? NightPG.now() : null;
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
/* lo sfondo che vive: nuvole, luna, fari di ricerca, aereo, luci rosse in cima ai grattacieli, finestre che si accendono e si spengono */
.nt-nu{width:calc(var(--u)*280);height:calc(var(--u)*30);background:radial-gradient(closest-side,rgba(104,86,160,.42),rgba(104,86,160,0));animation:ntNu var(--d) linear var(--dl) infinite}
@keyframes ntNu{from{transform:translateX(calc(var(--u)*-320))}to{transform:translateX(calc(var(--u)*720))}}
.nt-luna{width:calc(var(--u)*120);height:calc(var(--u)*120);margin:calc(var(--u)*-60) 0 0 calc(var(--u)*-60);background:radial-gradient(closest-side,rgba(255,244,220,.5),rgba(184,176,255,.2) 45%,rgba(184,176,255,0));animation:ntLuna 7s ease-in-out infinite alternate}
@keyframes ntLuna{from{opacity:.45;transform:scale(.94)}to{opacity:.9;transform:scale(1.06)}}
.nt-aereo{left:0;top:calc(var(--u)*34);width:calc(var(--u)*3);height:calc(var(--u)*3);animation:ntAereo 70s linear var(--dl) infinite}
.nt-aereo::before{content:"";position:absolute;left:0;top:0;width:100%;height:100%;border-radius:50%;background:#fff;box-shadow:0 0 calc(var(--u)*4) calc(var(--u)*1.5) rgba(255,255,255,.9);animation:ntStrobo 1.6s steps(1) infinite}
.nt-aereo::after{content:"";position:absolute;left:calc(var(--u)*-8);top:calc(var(--u)*.6);width:calc(var(--u)*1.6);height:calc(var(--u)*1.6);border-radius:50%;background:#ff3030;box-shadow:0 0 calc(var(--u)*3) calc(var(--u)*1) rgba(255,50,50,.9);animation:ntStrobo 1.6s steps(1) -.6s infinite}
@keyframes ntStrobo{0%,86%{opacity:.15}90%,96%{opacity:1}}
@keyframes ntAereo{0%{transform:translate(calc(var(--u)*-30),calc(var(--u)*6))}38%{transform:translate(calc(var(--u)*690),calc(var(--u)*-10))}100%{transform:translate(calc(var(--u)*690),calc(var(--u)*-10))}}
.nt-bea{width:calc(var(--u)*3);height:calc(var(--u)*3);margin:calc(var(--u)*-1.5) 0 0 calc(var(--u)*-1.5);border-radius:50%;background:#ff3a3a;box-shadow:0 0 calc(var(--u)*8) calc(var(--u)*3) rgba(255,58,58,.9);animation:ntBea 2.2s steps(1) var(--dl) infinite}
@keyframes ntBea{0%,55%{opacity:1}56%,100%{opacity:.08}}
.nt-fin{inset:0;width:100%;height:100%;image-rendering:pixelated;animation:ntFin var(--d) steps(1) var(--dl) infinite}
@keyframes ntFin{0%{opacity:0}18%{opacity:1}41%{opacity:0}57%{opacity:1}64%{opacity:0}88%{opacity:1}100%{opacity:0}}
/* fari di ricerca nel cielo (ritagliati sopra la città), dirigibile, ruota panoramica, stelle cadenti, uccelli */
.nt-scena>.nt-sk{left:0;top:0;width:100%;overflow:hidden;clip-path:inset(0);contain:paint}
.nt-sk>*{position:absolute}
.nt-sk .nt-faro{width:calc(var(--u)*34);height:calc(var(--u)*230);margin-left:calc(var(--u)*-17);background:linear-gradient(to top,rgba(236,228,255,.3),rgba(236,228,255,.1) 35%,rgba(236,228,255,.02) 62%,rgba(236,228,255,0) 80%);clip-path:polygon(47% 100%,53% 100%,100% 0,0 0);transform-origin:50% 100%;animation:ntFaro var(--d) ease-in-out var(--dl) infinite alternate}
@keyframes ntFaro{from{transform:rotate(var(--a))}to{transform:rotate(var(--b))}}
.nt-fbase{width:calc(var(--u)*9);height:calc(var(--u)*5);margin:calc(var(--u)*-2.5) 0 0 calc(var(--u)*-4.5);border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.9),rgba(236,228,255,0));animation:ntFB 3.4s ease-in-out var(--dl) infinite}
@keyframes ntFB{0%,100%{opacity:.5}50%{opacity:1}}
.nt-dir{left:0;width:calc(var(--u)*50);height:calc(var(--u)*16);animation:ntDir 130s linear var(--dl) infinite}
@keyframes ntDir{from{transform:translateX(calc(var(--u)*-70))}to{transform:translateX(calc(var(--u)*700))}}
.nt-dir .c{position:absolute;left:0;top:0;width:100%;height:calc(var(--u)*12);border-radius:50%;background:radial-gradient(ellipse at 50% 28%,#4a4690,#211f4a 62%,#12102c);box-shadow:inset 0 calc(var(--u)*-1.5) calc(var(--u)*2) rgba(0,0,0,.5)}
.nt-dir .g{position:absolute;left:calc(var(--u)*21);top:calc(var(--u)*11);width:calc(var(--u)*8);height:calc(var(--u)*3);border-radius:0 0 40% 40%;background:#1a1838;box-shadow:0 0 calc(var(--u)*3) rgba(255,207,122,.6)}
.nt-dir .p{position:absolute;right:calc(var(--u)*1);top:calc(var(--u)*5);width:calc(var(--u)*2);height:calc(var(--u)*2);border-radius:50%;background:#ff3a3a;box-shadow:0 0 calc(var(--u)*4) rgba(255,58,58,.9);animation:ntStrobo 1.4s steps(1) infinite}
.nt-dir b{position:absolute;left:0;width:100%;top:calc(var(--u)*3.4);text-align:center;font:400 calc(var(--u)*3.6)/1 "Share Tech Mono",monospace;letter-spacing:.12em;color:#ff7ab8;text-shadow:0 0 calc(var(--u)*2.5) #ff5fa8;animation:ntLed 5s steps(1) infinite}
@keyframes ntLed{0%,70%{opacity:1}72%{opacity:.3}74%{opacity:1}78%{opacity:.3}80%,100%{opacity:1}}
.nt-ruota{width:calc(var(--u)*66);height:calc(var(--u)*66);margin:calc(var(--u)*-33) 0 0 calc(var(--u)*-33);animation:ntGira 70s linear infinite}
.nt-ruota svg{width:100%;height:100%;overflow:visible;display:block}
@keyframes ntGira{to{transform:rotate(360deg)}}
.nt-ruota .cb{animation:ntCab 2.6s ease-in-out calc(var(--i)*-.22s) infinite alternate}
@keyframes ntCab{from{opacity:.35}to{opacity:1}}
.nt-cad{width:calc(var(--u)*16);height:calc(var(--u)*.9);background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.95));border-radius:50%;opacity:0;animation:ntCad var(--d) linear var(--dl) infinite}
@keyframes ntCad{0%,90%{opacity:0;transform:rotate(24deg) translateX(0)}91%{opacity:1}100%{opacity:0;transform:rotate(24deg) translateX(calc(var(--u)*70))}}
.nt-uc{left:0;width:calc(var(--u)*40);height:calc(var(--u)*12);animation:ntUc var(--d) linear var(--dl) infinite}
@keyframes ntUc{from{transform:translateX(calc(var(--u)*-50))}to{transform:translateX(calc(var(--u)*700))}}
.nt-uc i{position:absolute;width:calc(var(--u)*4);height:calc(var(--u)*1.2);animation:ntAli var(--f) ease-in-out infinite alternate}
.nt-uc i::before,.nt-uc i::after{content:"";position:absolute;top:0;width:55%;height:100%;background:#3b3566;border-radius:50%}
.nt-uc i::before{left:0;transform-origin:100% 50%;transform:rotate(-20deg)}
.nt-uc i::after{right:0;transform-origin:0 50%;transform:rotate(20deg)}
@keyframes ntAli{from{transform:scaleY(1)}to{transform:scaleY(-1)}}
/* i lampioni che sfarfallano: un buio sulla testa e lampi di luce */
.nt-lamd{width:calc(var(--u)*17);height:calc(var(--u)*6);margin:calc(var(--u)*-3) 0 0 calc(var(--u)*-8);border-radius:40%;background:rgba(10,8,26,.8);animation:ntLamD var(--d) steps(1) var(--dl) infinite}
@keyframes ntLamD{0%,30%{opacity:0}31%{opacity:1}33%{opacity:0}34%{opacity:1}36%,70%{opacity:0}71%{opacity:1}72%{opacity:0}73%{opacity:1}75%,100%{opacity:0}}
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

/* il cruscotto: al posto del pannello, le partite sono i portachiavi e «Accendi e parti» è il blocchetto d'accensione */
.gate.nt .intro-menu{background:none!important;box-shadow:none!important;border:0!important;padding:0!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;gap:0;width:auto}
@media (min-width:900px){.gate.nt .intro-menu{right:max(30px,3.4vw);bottom:max(22px,4vh);width:min(470px,36vw)}}
.gate.nt .intro-menu h2,.gate.nt .intro-menu ul,.gate.nt.nt-nuova .intro-menu ul{display:none!important}
.nt-cr{display:grid;gap:10px;justify-items:center}
.gate.nt .nt-cr .nr-slots{margin:0;width:100%;gap:10px;position:relative;padding-top:12px}
.gate.nt .nt-cr .nr-slots::before{content:"";position:absolute;left:4%;right:4%;top:6px;height:5px;border-radius:3px;background:linear-gradient(#6a6e7c,#2a2c36);box-shadow:0 2px 6px rgba(0,0,0,.6)}
.gate.nt .nr-slots-h{display:none}
.gate.nt .nr-slot{background:linear-gradient(160deg,#1c1d27,#0d0e14)!important;border-radius:6px 6px 14px 14px;padding:16px 11px 10px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.09),0 6px 14px rgba(0,0,0,.55);position:relative;transition:transform .25s,box-shadow .25s}
.gate.nt .nr-slot::before{content:"";position:absolute;left:50%;top:-9px;width:14px;height:14px;margin-left:-7px;border-radius:50%;border:3px solid #9aa0ae;background:#05060a;box-sizing:border-box;box-shadow:0 1px 3px rgba(0,0,0,.7)}
.gate.nt .nr-slot:hover,.gate.nt .nr-slot:focus-visible{transform:translateY(-3px) rotate(-1.5deg)}
.gate.nt .nr-slot.on{background:linear-gradient(160deg,#3a2810,#18100a)!important;box-shadow:inset 0 0 0 2px #ffb347,0 0 22px rgba(255,170,60,.35),0 6px 14px rgba(0,0,0,.55)}
.gate.nt .nr-slot .ed{top:8px}
.nt-pie{display:flex;gap:14px;align-items:center;justify-content:center;font:500 12px/1 "Barlow Semi Condensed",system-ui,sans-serif;color:#9a927e}
.gate.nt .nt-pie small{font-size:0;color:inherit;display:inline}
.gate.nt .nt-pie small a{font-size:12px;color:#b9ae94}
.nt-aiuto{all:unset;cursor:pointer;font:500 13px/1 "Barlow Semi Condensed",system-ui,sans-serif;color:#ece2c8;border-bottom:1px dotted #a89a7c}
/* v0.166: le scritte sotto il blocchetto stanno sulla strada (righe bianche, fari): un fondo scuro le tiene leggibili */
.gate.nt .night-run-ignition .nr-instructions,.gate.nt .night-run-ignition .nr-state{width:fit-content;max-width:100%;box-sizing:border-box;margin:.35rem auto;padding:3px 10px;border-radius:6px;background:rgba(8,9,16,.8);text-shadow:0 1px 2px #000}
.gate.nt .nt-pie{width:fit-content;margin:0 auto;padding:6px 12px;border-radius:8px;background:rgba(8,9,16,.8)}
.nt-aiuto:hover,.nt-aiuto:focus-visible{color:#ffb347}
.nt-pop{position:absolute;right:0;bottom:calc(100% + 10px);width:min(440px,90vw);padding:14px 16px;border-radius:12px;background:rgba(10,10,18,.94);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1),0 12px 34px rgba(0,0,0,.6);display:none;z-index:5}
.nt-pop.on{display:block}
.nt-pop h3{margin:0 0 8px;font:400 15px/1 "Saira Stencil One",Impact,sans-serif;letter-spacing:.08em;color:#ffb347}
.nt-pop p{margin:0 0 10px;font:500 13px/1.45 "Barlow Semi Condensed",system-ui,sans-serif;color:#e0d8c8}
.gate.nt .nt-pop .keys{display:flex!important;flex-wrap:wrap;gap:6px 12px;margin:0}
.gate.nt.nt-avvio .nt-cr .nr-slots,.gate.nt.nt-avvio .nt-pie{opacity:0;transition:opacity .5s}
@media (max-width:900px){.gate.nt .intro-menu{left:auto;right:50%;transform:translateX(50%);bottom:10px;width:min(96vw,440px)}}
/* girare la chiave: il pannello scende e sparisce, il logo si accende */
.gate.nt .intro-menu{transition:opacity .45s,transform .45s}
.gate.nt.nt-avvio .intro-menu{pointer-events:none}
.gate.nt.nt-avvio .intro-title .t1{text-shadow:0 0 46px rgba(255,170,60,.7),0 0 18px rgba(255,95,168,.6),0 6px 0 rgba(0,0,0,.5);transition:text-shadow .8s}
@media (prefers-reduced-motion:reduce){.nt-nu,.nt-luna,.nt-faro,.nt-fbase,.nt-dir,.nt-ruota,.nt-cad,.nt-uc,.nt-aereo,.nt-bea,.nt-fin,.nt-lamd,.nt-hz,.nt-lamp,.nt-tel,.nt-st,.nt-rain,.nt-rain2,.nt-fog,.nt-spk{animation:none!important}.gate.nt .nt-push{transition:none}}
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
/* telefono in orizzontale e finestre basse (sospeso 26, v0.138): il cruscotto sta a destra, più piccolo, e non esce dallo schermo;
   il titolo resta a sinistra, piccolo. Vince su .intro .intro-menu di index.html (left 50% e spostamento) e sulla regola dei 900 px */
@media (max-height:520px){
.gate.intro.nt .intro-menu,.gate.intro.nt.menu .intro-menu{left:auto!important;right:max(10px,env(safe-area-inset-right))!important;top:auto!important;bottom:6px!important;transform:none!important;width:min(250px,40vw)!important;max-height:calc(100% - 12px);overflow:visible!important}
.gate.nt .nt-cr{gap:5px}
.gate.nt .nt-cr .nr-slots{gap:6px;padding-top:9px}
.gate.nt .nr-slot{padding:10px 6px 5px!important;font-size:10px}
.gate.nt .nr-slot b{font-size:10.5px;letter-spacing:.02em;white-space:nowrap}
.gate.nt .nr-slot .ed{display:none}
.gate.nt .nt-pie{gap:10px}
.gate.nt .intro-title{display:grid!important;left:max(14px,env(safe-area-inset-left));top:10px}
.gate.nt .intro-title .t1{font-size:clamp(26px,9vh,46px)}
.gate.nt .intro-title .t2{font-size:clamp(10px,2.6vh,15px)}
.gate.nt .intro-title .t3,.gate.nt .intro-title::after{display:none}}
@media (prefers-reduced-motion:reduce){.gate.nt .nt-bg{transition:none}.gate.nt.nt-on .nt-cam{animation:none}}`;
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  gate.classList.add('nt');
  const cont = document.createElement('p'); cont.className = 'nt-cont'; const ul = menu.querySelector('ul'); if (ul) ul.after(cont);
  // il testo del pannello e del pulsante secondo la partita scelta (nuova o già cominciata)
  function pannello() {
    const G = window.nightRun && window.nightRun.game, s = G && G.s, vg = s && s.vg, iniziata = !!(vg && vg.prologo);
    gate.classList.toggle('nt-nuova', !iniziata);
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
  // le finestre accese e le luci rosse si trovano nei pixel del quadro (una volta sola): le finestre sono quadratini gialli, le luci rosse puntini rossi
  function trova() {
    const x0 = 0, y0 = 70 * SS, w = lo.width, h = 160 * SS, im = g.getImageData(x0, y0, w, h), d = im.data;
    const m = new Uint8Array(w * h), rosso = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const r = d[i * 4], gg = d[i * 4 + 1], b = d[i * 4 + 2];
      m[i] = r > 170 && gg > 130 && b < 150 && r - b > 40 ? 1 : 0;
      rosso[i] = r > 200 && gg < 100 && b < 100 ? 1 : 0;
    }
    const comp = (mask, mn, mx) => {
      const out = [], seen = new Uint8Array(w * h);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const k = y * w + x; if (!mask[k] || seen[k]) continue;
        let minx = x, maxx = x, miny = y, maxy = y, n = 0; const st = [k]; seen[k] = 1;
        while (st.length) { const q = st.pop(), qx = q % w, qy = (q - qx) / w; n++; if (qx < minx) minx = qx; if (qx > maxx) maxx = qx; if (qy < miny) miny = qy; if (qy > maxy) maxy = qy;
          for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = qx + ax, ny = qy + ay; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue; const nk = ny * w + nx; if (mask[nk] && !seen[nk]) { seen[nk] = 1; st.push(nk); } } }
        if (n >= mn && n <= mx) out.push({ x: minx, y: miny + y0, w: maxx - minx + 1, h: maxy - miny + 1 });
      }
      return out;
    };
    return { fin: comp(m, 2, 60), ros: comp(rosso, 1, 30), dati: d, w, y0 };
  }
  // la ruota panoramica (si disegna una volta, gira con una animazione CSS)
  const RUOTA = (() => { const cab = ['#ff5fa8', '#ffcf7a', '#7fd8ff', '#9affc0'], pts = []; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, x = 50 + Math.sin(a) * 41, y = 50 - Math.cos(a) * 41; pts.push(`<line x1="50" y1="50" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#a79bff" stroke-opacity=".55" stroke-width=".8"/><circle class="cb" style="--i:${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${cab[i % 4]}"/>`); }
    return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="rgba(8,6,24,.5)"/><circle cx="50" cy="50" r="41" fill="none" stroke="#c3b9ff" stroke-opacity=".7" stroke-width="1.2"/><circle cx="50" cy="50" r="30" fill="none" stroke="#a79bff" stroke-opacity=".35" stroke-width=".7"/>${pts.join('')}<circle cx="50" cy="50" r="3" fill="#ffd9a0"/></svg>`; })();
  function strati() {
    if (fatto) return; fatto = true;
    // stelle
    for (let i = 0; i < 26; i++) el('nt-st', `left:${pct(8 + hash(i + 71) * 624, W)};top:${pct(6 + hash(i + 93) * 150, H)};--d:${(2.4 + hash(i + 5) * 4).toFixed(2)}s;--dl:${(-hash(i + 17) * 6).toFixed(2)}s`);
    // la luna che respira e le nuvole che le passano davanti
    el('nt-luna', `left:${pct(470, W)};top:${pct(70, H)}`);
    for (let i = 0; i < 5; i++) el('nt-nu', `top:${pct(46 + hash(i + 40) * 120, H)};transform-origin:0 0;--d:${(70 + hash(i + 9) * 70).toFixed(0)}s;--dl:${(-hash(i + 3) * 120).toFixed(0)}s;opacity:${(0.55 + hash(i) * 0.45).toFixed(2)}`);
    // i fari di ricerca dalla città e l'aereo con i lampeggianti
    { const sk = el('nt-sk', `height:${pct(214, H)}`);            // i fari di ricerca stanno nel cielo: non arrivano mai sulla strada
      [[150, 196, 12, -3, 1], [300, 190, 15, -8, 2], [455, 194, 18, -5, 3], [30, 198, 14, -11, 4]].forEach(([x, y, d, dl, n]) => {
        const b = document.createElement('div'); b.className = 'nt-faro'; b.style.cssText = `left:${pct(x, W)};top:${pct(y - 230, H)};--d:${d}s;--dl:${dl}s;--a:${n % 2 ? -34 : 30}deg;--b:${n % 2 ? 24 : -36}deg`; sk.appendChild(b);
        const h = document.createElement('div'); h.className = 'nt-fbase'; h.style.cssText = `left:${pct(x, W)};top:${pct(y, H)};--dl:${dl}s`; sk.appendChild(h); }); }
    el('nt-aereo', `--dl:${-6}s`);
    // il dirigibile con la scritta a led, la ruota panoramica che gira, le stelle cadenti e gli uccelli
    el('nt-dir', `top:${pct(112, H)};--dl:${-40}s`, '<i class="c"></i><i class="g"></i><i class="p"></i><b>NIGHT RUN</b>');
    el('nt-ruota', `left:${pct(392, W)};top:${pct(152, H)}`, RUOTA);
    for (let i = 0; i < 3; i++) el('nt-cad', `left:${pct(120 + i * 190 + hash(i) * 60, W)};top:${pct(14 + i * 24, H)};--d:${11 + i * 5}s;--dl:${-3 - i * 4.3}s`);
    for (let i = 0; i < 2; i++) { const e = el('nt-uc', `top:${pct(150 + i * 14, H)};--d:${36 + i * 13}s;--dl:${-9 - i * 17}s`); for (let b = 0; b < 5; b++) { const u = document.createElement('i'); u.style.cssText = `left:calc(var(--u)*${(b * 7 + (b % 2) * 3)});top:calc(var(--u)*${(b % 3) * 3 - 3});--f:${(0.5 + hash(b + i * 9) * 0.4).toFixed(2)}s`; e.appendChild(u); } }
    // le finestre che si spengono e si riaccendono (tre gruppi con tempi diversi) e le luci rosse in cima ai palazzi che lampeggiano
    try {
      const T = trova(), G = [0, 1, 2, 3, 4].map((i) => { const c = document.createElement('canvas'); c.width = lo.width; c.height = lo.height; c.className = 'nt-fin'; c.style.cssText = `--d:${[7, 11, 16, 21, 9][i]}s;--dl:${-i * 3.3}s`; scena.appendChild(c); return c.getContext('2d'); });
      T.fin.forEach((f, i) => {
        const gr = hash(i * 3.7 + 1); if (gr > 0.7) return;                                  // un po' di finestre resta sempre accesa
        const cx = G[Math.floor(gr * 7) % 5], bx = Math.max(0, f.x - 2), k = ((f.y - T.y0) * T.w + bx) * 4;
        cx.fillStyle = `rgb(${T.dati[k]},${T.dati[k + 1]},${T.dati[k + 2]})`; cx.fillRect(f.x, f.y, f.w, f.h);   // il colore del palazzo accanto
      });
      T.ros.forEach((r, i) => el('nt-bea', `left:${pct((r.x + r.w / 2) / SS, W)};top:${pct((r.y + r.h / 2) / SS, H)};--dl:${(-i * 0.7).toFixed(2)}s`));
    } catch (e) { /* senza le finestre il resto va avanti */ }
    // nebbia (tre banchi che vanno e vengono) e pioggia (due strati) + asfalto lucido
    for (let i = 0; i < 3; i++) el('nt-fog', `left:${pct(-40 + i * 200, W)};top:${pct(214 + i * 38, H)};--d:${24 + i * 9}s;--dl:${-i * 7}s`);
    el('nt-rain'); el('nt-rain2'); el('nt-wet');
    // l'auto ferma: fari forti (per la chiave), frecce, il telefono; i lampioni che sfarfallano (il centrale, spento, fa qualche lampo)
    if (POS.head) el('nt-fari', `left:${pct(POS.head[0], W)};top:${pct(POS.head[1], H)}`);
    for (const [fx, fy] of POS.fl) el('nt-hz', `left:${pct(fx, W)};top:${pct(fy, H)}`);
    el('nt-lamp', `left:${pct(349, W)};top:${pct(126, H)}`);
    [[89, 11, -2], [549, 15, -7]].forEach(([x, d, dl]) => el('nt-lamd', `left:${pct(x, W)};top:${pct(126, H)};--d:${d}s;--dl:${dl}s`));
    if (POS.phone) el('nt-tel', `left:${pct(POS.phone[0], W)};top:${pct(POS.phone[1], H)}`);
  }
  // il tempo di questo avvio
  const METEO = ['sereno', 'pioggia', 'nebbia'];
  function meteo(m) {
    if (!METEO.includes(m)) m = Math.random() < 0.65 ? 'sereno' : 'nebbia';   // v0.167: niente pioggia a caso (le righe che attraversano lo schermo, tolte da Nico); resta con ?meteo=pioggia
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

  // ------------------------------------------------------------ il cruscotto: il blocchetto d'accensione e i portachiavi
  const goBtn = document.getElementById('goBtn');
  function cruscotto() {
    if (!goBtn) return;
    const cr = document.createElement('div'); cr.className = 'nt-cr';
    const slots = menu.querySelector('.nr-slots'); if (slots) cr.appendChild(slots);
    cr.append(document.getElementById('titleIgnition'), goBtn);
    const pie = document.createElement('div'); pie.className = 'nt-pie';
    const aiuto = document.createElement('button'); aiuto.type = 'button'; aiuto.className = 'nt-aiuto'; aiuto.textContent = 'Come si gioca';
    const pop = document.createElement('div'); pop.className = 'nt-pop';
    pop.innerHTML = '<h3>Come si gioca</h3><p>Si parte dal km 0 con la Volvo di tuo zio e € 450 in tasca. L’autostrada va solo avanti. Al bar del km 1,8 ti aspetta il primo lavoro. Mangia, bevi, dormi al Motel 4Ever e tieni d’occhio il telefono (tasto 0).</p>';
    const keys = menu.querySelector('.keys'); if (keys) pop.appendChild(keys);
    pie.append(aiuto); const small = menu.querySelector('small'); if (small) pie.appendChild(small);
    cr.appendChild(pie); menu.appendChild(cr); cr.style.position = 'relative'; cr.appendChild(pop);
    aiuto.addEventListener('click', (e) => { e.stopPropagation(); pop.classList.toggle('on'); });
    document.addEventListener('click', () => pop.classList.remove('on'));
  }

  // ------------------------------------------------------------ il suono dell'avviamento: il motore vero del gioco (dsp.js + sim.js), reso una volta sola
  // motorino che gira, il motore che prende, un colpo di gas e il minimo (3,4 s); l'auto è quella della partita scelta, di serie
  let SUONO = null, rendendo = false;
  function rendiMotore() {
    if (SUONO || rendendo || typeof EngineDSP === 'undefined' || typeof SupraSim === 'undefined' || typeof CARS === 'undefined') return;
    rendendo = true;
    try {
      const G = window.nightRun && window.nightRun.game, id = (G && CARS[G.car] && G.car) || 'v40', C = CARS[id], tp = C.params(C.presets[0].sel);
      const sim = new SupraSim(); sim.setCar(id === 'supra' ? null : Object.assign({}, C.P)); sim.setTune(tp.sim);
      const SR = 48000, DT = 1 / 60, FR = Math.round(3.4 / DT), per = Math.round(SR * DT), Bk = 128, dsp = new EngineDSP(SR);
      dsp.msg({ cfg: { tune: tp.dsp, view: 1, vol: 0.9, pops: 0, fx: {} } }); dsp.msg({ env: 0 });
      const L = new Float32Array(FR * per), Rr = new Float32Array(FR * per), bl = new Float32Array(Bk), br = new Float32Array(Bk);
      sim.setIgnition(true); sim.setStarter(true);
      let f = 0;
      const fetta = () => {
        const t1 = performance.now() + 14;                       // a fette da pochi millisecondi: la schermata non si ferma
        while (f < FR && performance.now() < t1) {
          const t = f * DT;
          if (t > 0.95) sim.setStarter(false);                    // il motorino si stacca quando il motore ha preso
          sim.in.thr = t > 1.7 && t < 2.05 ? 0.7 : 0; sim.in.brake = 0; sim.in.clutch = 0; sim.update(DT);
          dsp.msg({ p: sim.audioParams(), ev: sim.events.splice(0) });
          for (let i = 0; i < per; i += Bk) { const n = Math.min(Bk, per - i); dsp.render(bl, br, Bk); L.set(bl.subarray(0, n), f * per + i); Rr.set(br.subarray(0, n), f * per + i); }
          f++;
        }
        if (f < FR) { setTimeout(fetta, 0); return; }
        let pk = 0; for (let i = 0; i < L.length; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(Rr[i]));
        const gn = pk > 0 ? Math.min(1.6, 0.8 / pk) : 1; for (let i = 0; i < L.length; i++) { L[i] *= gn; Rr[i] *= gn; }
        for (let i = 0; i < 2400; i++) { const k = i / 2400; L[L.length - 1 - i] *= k; Rr[Rr.length - 1 - i] *= k; }   // coda morbida
        SUONO = { L, R: Rr, sr: SR }; rendendo = false;
      };
      fetta();
    } catch (e) { rendendo = false; SUONO = null; }
  }
  // Parte quando si preme. Se la chiave torna su OFF, il motorino sfuma.
  function motorino(ctx, volume) {
    if (!ctx || volume <= 0) return;
    const uscita = ctx.createGain();
    uscita.gain.value = volume;
    uscita.connect(ctx.destination);
    let fine;
    if (SUONO) {
      const b = ctx.createBuffer(2, SUONO.L.length, SUONO.sr);
      b.copyToChannel(SUONO.L, 0); b.copyToChannel(SUONO.R, 1);
      const src = ctx.createBufferSource(); src.buffer = b; src.connect(uscita); src.start();
      fine = src;
    } else fine = semplice(ctx, uscita);
    fine.onended = () => uscita.disconnect();
    return () => {
      const ora = ctx.currentTime;
      uscita.gain.setTargetAtTime(0, ora, 0.02);
      setTimeout(() => uscita.disconnect(), 120);
    };
  }
  function semplice(ac, destinazione) {                                         // riserva: motorino a scatti e un minimo semplice
    const t0 = ac.currentTime + 0.03, out = ac.createGain(); out.gain.value = 0.5; out.connect(destinazione);
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 480; lp.connect(out);
    const m = ac.createOscillator(), mg = ac.createGain(); m.type = 'sawtooth'; m.frequency.value = 30; mg.gain.value = 0; m.connect(mg); mg.connect(lp);
    for (let i = 0; i < 6; i++) { const a = t0 + i * 0.14; mg.gain.setValueAtTime(0, a); mg.gain.linearRampToValueAtTime(0.7, a + 0.04); mg.gain.linearRampToValueAtTime(0.2, a + 0.12); }
    mg.gain.setValueAtTime(0, t0 + 0.86); m.start(t0); m.stop(t0 + 0.9);
    const e = ac.createOscillator(), eg = ac.createGain(); e.type = 'sawtooth'; e.frequency.setValueAtTime(40, t0 + 0.85); e.frequency.linearRampToValueAtTime(52, t0 + 1.2);
    eg.gain.setValueAtTime(0, t0 + 0.85); eg.gain.linearRampToValueAtTime(0.7, t0 + 1.0); eg.gain.linearRampToValueAtTime(0, t0 + 2.4); e.connect(eg); eg.connect(lp); e.start(t0 + 0.85); e.stop(t0 + 2.5);
    return e;
  }

  function avviamento() {
    gate.classList.add('nt-avvio');
  }

  function avvia() {
    cruscotto(); pannello(); setTimeout(rendiMotore, 1800);
    prepara().then(() => { quadro(); strati(); frasi(); present(); gate.classList.add('nt-on'); window.addEventListener('resize', () => { if (!gate.hidden) ridisegna(); }); }).catch(() => {});
  }
  if (document.readyState === 'complete') setTimeout(avvia, 0); else window.addEventListener('load', avvia);

  // per le prove: ridisegna il quadro subito
  window.NightTitolo = { foto: () => { quadro(); present(); }, pannello, meteo, NT_FRASI, avviamento, motorino, accendi: () => {
    if (window.titleIgnition) window.titleIgnition.start();
    else if (goBtn) goBtn.click();
  } };
})();
