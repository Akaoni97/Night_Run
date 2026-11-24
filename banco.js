// ============================================================================
//  Night Run · Il banco prova a rulli di Da Luca Tuning (dopo statistiche.js)
//  Nel pannello del negozio di tuning c'è "Sali sui rulli": una schermata a tutto schermo con l'auto sui rulli, il quadro
//  del banco (giri, velocità dei rulli, marcia, CV, Nm, turbo) e la curva di potenza e coppia. Si guida da qui:
//  acceleratore graduato (cursore 0-100 % con le tacche, tasti 0-9 e ↑ ↓), freno (S o tasto tenuto premuto, fa da carico),
//  marce (E su, Q giù), AVVIA/SPEGNI (Invio). Le curve si registrano a gas oltre il 90 % in marcia, frizione chiusa:
//  ogni nuovo strappo diventa la curva nuova, la precedente resta in grigio per il confronto.
//  Sui rulli c'è l'auto vera: stessa fisica, stesso cambio (anche l'automatico con la leva), stesso suono, stessa benzina.
//  game.rulli = true: le ruote girano ma la strada non scorre (game.js); NightBanco.on: gas e freno li dà il banco
//  (index.html, ciclo principale). Sui rulli niente aria (cd e portanza a zero, rimessi scendendo). Scendendo si frena
//  finché le ruote non sono ferme, poi si torna al negozio.
//  Rulli dal vivo (v0.147, di serie quando sali): il banco diventa una barra in basso (gas, marce, freno, giri, CV) e il
//  pannello dell'officina resta aperto e toccabile: monti un pezzo e lo senti subito, col motore in tiro (game.canMount lo
//  permette sui rulli). Al posto della scena dell'interno si vede la strada davanti al negozio con l'auto sui rulli
//  (game.rulliVista, NightInterni.hide): fiamme, marmitta rovente e scarichi sono quelli veri di street2d.js.
//  «Curve» apre il banco grande con la curva di potenza; «Barra» torna ai rulli dal vivo.
//  window.NightBanco.panel(body) aggiunge la sezione al pannello; .open() / .close(); .on, .thr, .brake mentre si è sopra.
// ============================================================================
const BANCO = {
  registra: 0.9,        // gas minimo per registrare la curva
  passo: 100,           // giri per ogni punto della curva
  ruota: 0.85,          // potenza alla ruota stimata: quella al motore per questo (perdite della trasmissione)
  gasVel: 3,            // quanto in fretta il pedale segue il cursore (frazione al secondo)
};
// curva: punti { rpm, cv, nm } dal più basso al più alto, il massimo per ogni gradino di giri
function bancoRegistra(curva, rpm, cv, nm, passo = BANCO.passo) {
  const k = Math.round(rpm / passo) * passo; let p = curva.find((q) => q.rpm === k);
  if (!p) { p = { rpm: k, cv: 0, nm: 0 }; curva.push(p); curva.sort((a, b) => a.rpm - b.rpm); }
  p.cv = Math.max(p.cv, cv); p.nm = Math.max(p.nm, nm);
  return curva;
}
// toglie i buchi di un attimo (un punto molto più basso di tutti e due i vicini): la curva che si disegna
function bancoPulita(curva) {
  return curva.filter((p, i) => {
    const a = curva[i - 1] || curva[i + 1], b = curva[i + 1] || curva[i - 1]; if (!a || !b) return true;   // ai bordi conta il solo vicino
    return !(p.cv < 0.85 * Math.min(a.cv, b.cv) || p.nm < 0.85 * Math.min(a.nm, b.nm));
  });
}
function bancoPicco(curva) {
  let cv = { v: 0, rpm: 0 }, nm = { v: 0, rpm: 0 };
  for (const p of curva) { if (p.cv > cv.v) cv = { v: p.cv, rpm: p.rpm }; if (p.nm > nm.v) nm = { v: p.nm, rpm: p.rpm }; }
  return { cv, nm };
}
// una copia della fisica con gli stessi pezzi (per le prove automatiche: nel gioco sui rulli c'è l'auto vera)
function bancoSim(sim, carId) {
  if (typeof SupraSim === 'undefined') return null;
  const d = new SupraSim();
  d.setCar(carId === 'supra' || typeof CARS === 'undefined' || !CARS[carId] ? null : Object.assign({}, CARS[carId].P));
  d.setTune(JSON.parse(JSON.stringify(sim.tune)));
  d.cfg = Object.assign({}, sim.cfg, { tc: false, launch: false, autoClutch: true });
  for (const k of ['extraPw', 'boostCtl', 'quickShift', 'damage', 'waterT', 'oilT', 'tireWear']) if (sim[k] !== undefined) d[k] = sim[k];
  d.P.cd = 0; d.P.cl = 0; d.fuel = Math.max(0.3, sim.fuel || 0.5); d.wet = 0;
  return d;
}

(function banco() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const $ = (id) => document.getElementById(id);
  const fmt = (n, d = 0) => Number(n || 0).toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });
  const css = document.createElement('style');
  css.textContent = `
.banco{position:fixed;inset:0;z-index:88;display:grid;place-items:center;padding:14px;background:rgba(5,4,8,.9);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)}
.banco[hidden]{display:none}
.banco .bc-card{width:min(840px,100%);max-height:100%;overflow:auto;padding:12px 16px;background:linear-gradient(180deg,#1d1a14,#0b0a10);box-shadow:inset 0 0 0 1px #4a4234,inset 0 2px 0 #ffb000,0 30px 80px rgba(0,0,0,.7);color:#f0e6d2;display:grid;gap:8px}
.banco h2{margin:0;font:400 26px/1 var(--f-display,Impact,sans-serif);font-style:italic;text-transform:uppercase;letter-spacing:.04em}
.banco h2 small{display:block;margin-top:4px;font:500 11px/1 var(--f-data,monospace);font-style:normal;letter-spacing:.2em;color:#ffb000}
.banco canvas{width:100%;display:block;image-rendering:pixelated;background:#0a0910;border-radius:8px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}
.banco .bc-live{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px}
.banco .bc-live div{padding:7px 9px;border-radius:8px;background:rgba(0,0,0,.45);box-shadow:inset 0 0 0 1px rgba(255,255,255,.07)}
.banco .bc-live small{display:block;font:500 10px/1 var(--f-data,monospace);letter-spacing:.14em;color:#a8936a}
.banco .bc-live b{display:block;margin-top:4px;font:400 22px/1 var(--f-display,Impact,sans-serif);font-variant-numeric:tabular-nums}
.banco .bc-ctl{display:grid;grid-template-columns:auto auto 1fr auto auto;gap:10px;align-items:center}
.banco .bc-gas{display:grid;gap:4px}
.banco .bc-gas label{font:500 11px/1 var(--f-data,monospace);letter-spacing:.12em;color:#a8936a}
.banco .bc-gas input{width:100%;accent-color:#b8ff3a}
.banco .bc-ticks{display:flex;justify-content:space-between;font:500 10px/1 var(--f-data,monospace);color:#7d6d52}
.banco .bc-ticks button{border:0;background:none;color:inherit;font:inherit;cursor:pointer;padding:2px 4px}
.banco .bc-gear{display:flex;align-items:center;gap:6px}
.banco .bc-gear b{min-width:34px;text-align:center;font:400 30px/1 var(--f-display,Impact,sans-serif);color:#b8ff3a}
.banco .bc-brk.on{background:#ff3a24;color:#fff}
.banco.dock{inset:0;place-items:end stretch;padding:8px;background:none;backdrop-filter:none;-webkit-backdrop-filter:none;pointer-events:none}
.banco.dock .bc-card{width:100%;pointer-events:auto;padding:8px 10px;gap:6px;background:linear-gradient(180deg,rgba(29,26,20,.92),rgba(11,10,16,.94))}
.banco.dock canvas,.banco.dock .bc-full,.banco.dock h2{display:none}
.banco .bc-dk{display:none}.banco.dock .bc-dk{display:inline-block}
.banco.dock .bc-live b{font-size:18px}.banco.dock .bc-live div{padding:4px 7px}
.banco.dock .bc-foot span{display:none}
.banco .bc-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;font:400 12px/1.35 var(--f-data,monospace);color:#7d6d52}
@media (max-width:700px){.banco.dock .bc-live div:nth-child(n+4){display:none}.banco.dock .bc-ctl{gap:6px}.banco .bc-live{grid-template-columns:repeat(3,minmax(0,1fr))}.banco .bc-ctl{grid-template-columns:1fr 1fr}.banco .bc-gas{grid-column:1/-1}}`;
  document.head.appendChild(css);

  const box = document.createElement('div'); box.className = 'banco'; box.hidden = true;
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Banco prova');
  box.innerHTML = `<div class="bc-card">
    <h2>Banco prova<small>DA LUCA TUNING · RULLI</small></h2>
    <canvas id="bcScene" width="640" height="160"></canvas>
    <div class="bc-live"><div><small>GIRI</small><b id="bcRpm">0</b></div><div><small>RULLI KM/H</small><b id="bcKmh">0</b></div>
      <div><small>CV MOTORE</small><b id="bcCv">0</b></div><div><small>NM</small><b id="bcNm">0</b></div><div><small>TURBO BAR</small><b id="bcBoost">—</b></div><div><small>PICCO</small><b id="bcPeak">—</b></div></div>
    <canvas id="bcChart" width="640" height="160"></canvas>
    <div class="bc-ctl">
      <button type="button" class="kbtn" id="bcEng">AVVIA</button>
      <div class="bc-gear"><button type="button" class="kbtn" id="bcDn" aria-label="Marcia giù">−</button><b id="bcGear">N</b><button type="button" class="kbtn" id="bcUp" aria-label="Marcia su">+</button></div>
      <div class="bc-gas"><label for="bcGas">ACCELERATORE <span id="bcGasV">0 %</span></label><input type="range" id="bcGas" min="0" max="100" step="5" value="0">
        <div class="bc-ticks">${[0, 25, 50, 75, 100].map((v) => `<button type="button" data-g="${v}">${v}</button>`).join('')}</div></div>
      <button type="button" class="kbtn bc-brk" id="bcBrk">FRENO</button>
      <button type="button" class="kbtn bc-full" id="bcReset">AZZERA CURVE</button>
    </div>
    <div class="bc-foot"><span>Invio avvia · 0-9 e ↑ ↓ il gas · S frena (fa da carico) · E/Q marce. Curva registrata col gas oltre il 90 %. Potenza al motore; alla ruota circa l'85 %.</span><span style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="kbtn" id="bcMode">Curve</button><button type="button" class="kbtn" id="bcClose">Scendi dai rulli</button></span></div>
  </div>`;
  document.body.appendChild(box);

  let dock = false, posT = 0;
  // rulli dal vivo: la barra sta sotto la parte di schermo lasciata libera dal pannello del negozio
  // (a sinistra sul computer, sopra il pannello sul telefono)
  function piazza() {
    const pb = $('placeBox'), r = pb && !pb.hidden ? pb.getBoundingClientRect() : null, W = window.innerWidth, H = window.innerHeight;
    if (!dock || !r || !r.width) { box.style.right = ''; box.style.bottom = ''; return; }
    if (r.left > W * 0.3) { box.style.right = Math.round(W - r.left) + 'px'; box.style.bottom = '0px'; }
    else { box.style.right = '0px'; box.style.bottom = Math.round(H - r.top) + 'px'; }
  }
  function modo(dk) {
    dock = dk; box.classList.toggle('dock', dock);
    if (dock) box.removeAttribute('aria-modal'); else box.setAttribute('aria-modal', 'true');
    $('bcMode').textContent = dock ? 'Curve' : 'Barra';
    piazza();
  }
  let regT = 0, offT = 99, d = null, raf = 0, last = 0, gasCmd = 0, brk = false, curva = [], prima = null, regOn = false, ang = 0, back = null, aria = null, scendi = false;
  const NR = () => window.nightRun, B = () => window.NightBanco;
  const setGas = (v) => { gasCmd = Math.max(0, Math.min(100, Math.round(v / 5) * 5)); $('bcGas').value = gasCmd; $('bcGasV').textContent = gasCmd + ' %'; };
  function open() {
    const n = NR(); if (!n || !n.sim || !n.game) return;
    if (scendi) finish();
    d = n.sim; n.game.rulli = true; aria = { cd: d.P.cd, cl: d.P.cl }; d.P.cd = 0; d.P.cl = 0;
    const b = B(); b.on = true; b.thr = 0; b.brake = 0;
    n.game.rulliVista = true; if (window.NightInterni && NightInterni.hide) NightInterni.hide(true);
    back = document.activeElement; box.hidden = false; curva = []; prima = null; regOn = false; setGas(0); brk = false; modo(false);
    last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); $('bcClose').focus();
  }
  // scendendo: gas a zero e freno finché le ruote non si fermano, poi la strada torna a scorrere
  function close() {
    box.hidden = true; if (!d) return;
    scendi = true; setGas(0); const b = B(); b.thr = 0; b.brake = 1;
    if (back && back.focus) back.focus();
  }
  function finish() {
    const n = NR(), b = B(); cancelAnimationFrame(raf); raf = 0; scendi = false;
    if (d) { d.v = 0; d.ww = 0; d.wo = 0; if (aria) { d.P.cd = aria.cd; d.P.cl = aria.cl; } }
    if (n && n.game) { n.game.rulli = false; n.game.rulliVista = false; }
    if (window.NightInterni && NightInterni.hide) NightInterni.hide(false);
    b.on = false; b.thr = 0; b.brake = 0; d = null;
  }
  // accensione e marce come in strada (anche la leva dell'automatico)
  function engine() {
    const n = NR(); if (!n || !n.engineTap) return;
    if (!n.sim.running && n.levaNow && n.levaNow !== 'P' && n.levaNow !== 'N' && n.leva) n.leva('N');   // l'automatico si avvia solo in P o N
    n.engineTap();
  }
  const shift = (k) => { const n = NR(); if (!n) return; if (k > 0 && n.shiftUp) n.shiftUp(); else if (k < 0 && n.shiftDown) n.shiftDown(); };
  function step(dt) {
    const b = B(), want = gasCmd / 100;
    if (d.P.cd || d.P.cl) { aria = { cd: d.P.cd, cl: d.P.cl }; d.P.cd = 0; d.P.cl = 0; }   // montando un pezzo la fisica rimette l'aria: sui rulli non c'è
    b.thr += Math.max(-BANCO.gasVel * dt, Math.min(BANCO.gasVel * dt, want - b.thr));
    b.brake = brk ? 1 : 0;
    const rpm = d.rpm, nm = Math.max(0, d.Tnet || 0), cv = nm * rpm / 7023;
    const reg = d.running && d.in.thr >= BANCO.registra && b.thr >= BANCO.registra && d.gear > 0 && d.lock && !d.shiftSeq && rpm > 1200;
    // nuovo strappo (gas mollato per più di un secondo e mezzo): la curva di prima va in grigio; una cambiata no
    if (reg && !regOn) { if (offT > 1.5) { if (curva.length > 5) prima = curva; curva = []; } regT = 0; }
    regOn = reg; if (reg) { regT += dt; offT = 0; } else offT += dt;
    // si registra dopo mezzo secondo di gas pieno (il motore si assesta) e senza i buchi di un attimo (cambiata, frizione)
    const prec = curva.length ? curva[curva.length - 1] : null;
    if (reg && regT > 0.5 && !(prec && rpm > prec.rpm && cv < prec.cv * 0.85)) bancoRegistra(curva, rpm, cv, nm);
    ang += d.v / 0.32 * dt;
    return { rpm, nm, cv };
  }
  function loop(t) {
    if (!d) return;
    const dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (scendi) { if (Math.abs(d.v) < 0.3) { finish(); return; } raf = requestAnimationFrame(loop); return; }
    const n0 = NR(); if (n0 && n0.game && !n0.game.inside) { close(); raf = requestAnimationFrame(loop); return; }   // uscito dal negozio: si scende
    const L = step(dt);
    if (!dock) { drawScene(); drawChart(); }
    if ((posT -= dt) <= 0) { posT = 0.5; piazza(); }
    $('bcRpm').textContent = fmt(L.rpm); $('bcKmh').textContent = fmt(d.v * 3.6);
    $('bcCv').textContent = fmt(L.cv); $('bcNm').textContent = fmt(L.nm);
    $('bcBoost').textContent = d.tune.turbo && d.tune.turbo.max > 0 ? fmt(Math.max(0, d.pipeP), 2) : '—';
    const pk = bancoPicco(bancoPulita(curva.length ? curva : prima || []));
    $('bcPeak').textContent = pk.cv.v ? `${fmt(pk.cv.v)} CV` : '—';
    const n = NR(); $('bcGear').textContent = n && n.gearLabel ? n.gearLabel(true) : d.gear === 0 ? 'N' : d.gear < 0 ? 'R' : String(d.gear);
    $('bcEng').textContent = d.running ? 'SPEGNI' : d.starter ? '…' : 'AVVIA';
    raf = requestAnimationFrame(loop);
  }
  // l'auto sui rulli: capannone, rulli che girano, cinghie, ventilatore, ruote che girano
  function drawScene() {
    const c = $('bcScene'), g = c.getContext('2d'), W = c.width, H = c.height, n = NR(), v2 = n && n.view2d;
    g.imageSmoothingEnabled = false;
    g.fillStyle = '#14121c'; g.fillRect(0, 0, W, H);
    const FL = H - 50;                                                         // filo del pavimento
    for (let x = 0; x < W; x += 40) { g.fillStyle = x % 80 ? '#17151f' : '#1a1824'; g.fillRect(x, 0, 40, FL); }   // pannelli del capannone
    g.fillStyle = '#26232f'; g.fillRect(0, FL, W, H - FL); g.fillStyle = '#ffb000'; for (let x = 10; x < W; x += 28) g.fillRect(x, FL, 14, 3);   // pavimento con le strisce gialle
    // ventilatore davanti all'auto
    g.fillStyle = '#0c0b10'; g.fillRect(W - 92, FL - 70, 70, 70); g.strokeStyle = '#3a3646'; g.lineWidth = 2; g.beginPath(); g.arc(W - 57, FL - 35, 28, 0, 7); g.stroke();
    g.save(); g.translate(W - 57, FL - 35); g.rotate(ang * 0.2 + (d && d.running ? performance.now() / 60 : 0)); g.fillStyle = '#4a4656';
    for (let i = 0; i < 4; i++) { g.rotate(Math.PI / 2); g.fillRect(-3, 4, 6, 20); } g.restore();
    const spr = v2 && v2.carSprite ? v2.carSprite(1) : null, src = spr && (spr.hd || spr), geo = v2 && v2.geo ? v2.geo() : null;
    const dw = 300, f = spr ? dw / spr.width : 1, x0 = 130, base = FL + 10;
    if (src && src.width && geo) {
      const dh = spr.height * f, y0 = base - (geo.wy + geo.wr) * f - 6;
      // rulli sotto le ruote, in una buca. Girano solo sotto le ruote motrici: davanti con la trazione anteriore (V40, Panda...),
      // dietro con la posteriore; l'altro asse resta fermo (l'ultimo dell'elenco è quello davanti: le auto guardano a destra)
      const fwd = !!(d && d.P && d.P.fwd), mot = (i) => (fwd ? i === geo.ax.length - 1 : i !== geo.ax.length - 1);
      for (const [i, ax] of geo.ax.entries()) {
        const wx = x0 + ax * f, ry = base + 4, rr = 14, aR = mot(i) ? ang : 0;
        g.fillStyle = '#08070b'; g.fillRect(wx - 34, base - 2, 68, 30);
        for (const dx of [-14, 14]) {
          g.fillStyle = '#5a5866'; g.beginPath(); g.arc(wx + dx, ry, rr, 0, 7); g.fill();
          g.strokeStyle = '#8a8896'; g.lineWidth = 1.5; g.beginPath(); for (let k = 0; k < 4; k++) { const a = -aR * (geo.wr * f / rr) + k * Math.PI / 2; g.moveTo(wx + dx, ry); g.lineTo(wx + dx + Math.cos(a) * rr, ry + Math.sin(a) * rr); } g.stroke();
        }
      }
      g.drawImage(src, x0, y0, dw, dh);
      // ruote che girano: raggi sopra il cerchio del disegno (solo le motrici)
      for (const [i, ax] of geo.ax.entries()) {
        if (!mot(i)) continue;
        const wx = x0 + ax * f, wy = y0 + geo.wy * f, r = geo.wr * f * 0.55;
        g.strokeStyle = 'rgba(30,30,36,.85)'; g.lineWidth = 2; g.beginPath();
        for (let k = 0; k < 5; k++) { const a = ang + k * 2 * Math.PI / 5; g.moveTo(wx, wy); g.lineTo(wx + Math.cos(a) * r, wy + Math.sin(a) * r); }
        g.stroke();
      }
      // cinghie di fissaggio
      g.strokeStyle = '#d0a020'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0 - 10, base + 8); g.lineTo(x0 + 12, y0 + dh * 0.55); g.moveTo(x0 + dw + 10, base + 8); g.lineTo(x0 + dw - 14, y0 + dh * 0.55); g.stroke();
    } else { g.fillStyle = '#888'; g.font = '14px sans-serif'; g.fillText('Disegno dell\'auto non pronto', 240, H / 2); }
    // fumo dallo scarico a gas aperto
    if (d && d.running && d.in.thr > 0.5) { g.fillStyle = `rgba(160,160,170,${0.12 + 0.15 * d.in.thr})`; for (let k = 0; k < 4; k++) { const p = (performance.now() / 300 + k / 4) % 1; g.beginPath(); g.arc(x0 - 10 - p * 50, base - 22 - p * 18, 4 + p * 10, 0, 7); g.fill(); } }
  }
  // curva: CV (giallo) e Nm (azzurro) sui giri; la curva di prima in grigio
  function drawChart() {
    const c = $('bcChart'), g = c.getContext('2d'), W = c.width, H = c.height, L = 44, R = 40, T = 14, B = 26;
    g.fillStyle = '#0a0910'; g.fillRect(0, 0, W, H);
    const lim = (d && d.P.limiter) || 7000, xMax = Math.ceil((lim + 500) / 1000) * 1000;
    const all = curva.concat(prima || []), est = d && d.estimatePeak ? d.estimatePeak() : { cv: 100, nm: 200 };
    const cvMax = Math.max(100, est.cv * 1.15, ...all.map((p) => p.cv * 1.1)), nmMax = Math.max(150, est.nm * 1.15, ...all.map((p) => p.nm * 1.1));
    const X = (r) => L + (r / xMax) * (W - L - R), Yc = (v) => H - B - (v / cvMax) * (H - T - B), Yn = (v) => H - B - (v / nmMax) * (H - T - B);
    g.font = '10px "Share Tech Mono", monospace'; g.textAlign = 'center';
    for (let r = 0; r <= xMax; r += 1000) { g.fillStyle = '#1e1c28'; g.fillRect(X(r), T, 1, H - T - B); g.fillStyle = '#7d6d52'; g.fillText(r / 1000 + 'k', X(r), H - 9); }
    for (let i = 0; i <= 4; i++) { const y = T + i * (H - T - B) / 4; g.fillStyle = '#1e1c28'; g.fillRect(L, y, W - L - R, 1);
      g.fillStyle = '#ffd23f'; g.textAlign = 'right'; g.fillText(fmt(cvMax * (1 - i / 4)), L - 4, y + 3); g.fillStyle = '#4fd6ff'; g.textAlign = 'left'; g.fillText(fmt(nmMax * (1 - i / 4)), W - R + 4, y + 3); }
    g.fillStyle = 'rgba(255,58,36,.12)'; g.fillRect(X(lim), T, W - R - X(lim), H - T - B);   // oltre il limitatore
    const line = (pts, key, Y, col, w) => { if (pts.length < 2) return; g.strokeStyle = col; g.lineWidth = w; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(X(p.rpm), Y(p[key])) : g.moveTo(X(p.rpm), Y(p[key])))); g.stroke(); };
    const cu = bancoPulita(curva), pr = prima ? bancoPulita(prima) : null;
    if (pr) { line(pr, 'cv', Yc, 'rgba(200,190,170,.35)', 1.5); line(pr, 'nm', Yn, 'rgba(160,200,220,.3)', 1.5); }
    line(cu, 'nm', Yn, '#4fd6ff', 2); line(cu, 'cv', Yc, '#ffd23f', 2.5);
    g.textAlign = 'left'; g.fillStyle = '#ffd23f'; g.fillText('CV', L + 6, T + 10); g.fillStyle = '#4fd6ff'; g.fillText('NM', L + 30, T + 10);
    const pk = bancoPicco(cu.length ? cu : pr || []);
    if (pk.cv.v) { g.fillStyle = '#f0e6d2'; g.textAlign = 'right'; g.fillText(`${fmt(pk.cv.v)} CV a ${fmt(pk.cv.rpm)} · ${fmt(pk.nm.v)} Nm a ${fmt(pk.nm.rpm)} · alla ruota ~${fmt(pk.cv.v * BANCO.ruota)} CV`, W - R - 4, T + 10); }
    else { g.fillStyle = '#7d6d52'; g.textAlign = 'right'; g.fillText(`Dichiarati: ${fmt(est.cv)} CV · ${fmt(est.nm)} Nm. Metti una marcia e dai gas oltre il 90 %`, W - R - 4, T + 10); }
    if (regOn) { g.fillStyle = Math.floor(performance.now() / 250) % 2 ? '#ff3a24' : '#5a1a14'; g.beginPath(); g.arc(L + 66, T + 7, 4, 0, 7); g.fill(); g.fillStyle = '#ff7a64'; g.textAlign = 'left'; g.fillText('REC', L + 74, T + 10); }
  }

  $('bcEng').addEventListener('click', engine);
  $('bcUp').addEventListener('click', () => shift(1)); $('bcDn').addEventListener('click', () => shift(-1));
  $('bcGas').addEventListener('input', (e) => setGas(+e.target.value));
  box.querySelectorAll('.bc-ticks button').forEach((b) => b.addEventListener('click', () => setGas(+b.dataset.g)));
  const bb = $('bcBrk');
  bb.addEventListener('pointerdown', (e) => { e.preventDefault(); brk = true; bb.classList.add('on'); });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) bb.addEventListener(ev, () => { brk = false; bb.classList.remove('on'); });
  $('bcReset').addEventListener('click', () => { curva = []; prima = null; });
  $('bcClose').addEventListener('click', close);
  $('bcMode').addEventListener('click', () => modo(!dock));
  window.addEventListener('resize', () => { if (!box.hidden) piazza(); });
  // finché il banco è aperto i tasti vanno al banco e non al gioco
  window.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    e.stopImmediatePropagation();
    const k = e.key;
    if (k === 'Escape') { e.preventDefault(); close(); return; }
    if (e.target && e.target.tagName === 'INPUT' && (k === 'ArrowLeft' || k === 'ArrowRight')) return;   // il cursore si muove da sé
    if (/^[0-9]$/.test(k)) { e.preventDefault(); setGas(+k * 10 + (k === '0' && gasCmd >= 90 ? 100 : 0)); return; }
    if (k === 'ArrowUp' || k === 'w' || k === 'W') { e.preventDefault(); setGas(gasCmd + 5); return; }
    if (k === 'ArrowDown') { e.preventDefault(); setGas(gasCmd - 5); return; }
    if (k === 's' || k === 'S') { e.preventDefault(); brk = true; bb.classList.add('on'); return; }
    if (k === 'e' || k === 'E') { e.preventDefault(); if (!e.repeat) shift(1); return; }   // con l'automatico spostano la leva verso D / verso P
    if (k === 'q' || k === 'Q') { e.preventDefault(); if (!e.repeat) shift(-1); return; }
    if (k === 'Enter') { e.preventDefault(); if (!e.repeat) engine(); }
  }, true);
  window.addEventListener('keyup', (e) => { if (box.hidden) return; e.stopImmediatePropagation(); if (e.key === 's' || e.key === 'S') { brk = false; bb.classList.remove('on'); } }, true);

  // la sezione nel pannello del negozio
  function panel(body) {
    const sec = document.createElement('div'); sec.className = 'bc-panel';
    sec.innerHTML = '<h4 style="margin:12px 0 4px">Banco prova a rulli</h4><p class="hint" style="margin:0 0 8px">Luca: «Sali sui rulli e vediamo quanti cavalli ci sono davvero, prima e dopo i pezzi.» Anche senza rulli, qui il gas è tuo: sgasa mentre monti i pezzi e li senti subito.</p>';
    const b = document.createElement('button'); b.type = 'button'; b.className = 'kbtn'; b.textContent = 'Sali sui rulli'; b.addEventListener('click', () => { if (NR() && NR().game && NR().game.rulli) { modo(false); return; } open(); });
    sec.appendChild(b); body.appendChild(sec); return sec;
  }
  window.NightBanco = { open, close, panel, modo, get dock() { return dock; }, on: false, thr: 0, brake: 0, get sim() { return d; }, get curva() { return curva; }, get prima() { return prima; }, setGas, engine, shift };
})();
if (typeof window !== 'undefined') Object.assign(window, { BANCO, bancoRegistra, bancoPicco, bancoPulita, bancoSim });
