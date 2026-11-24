// ============================================================================
//  Night Run · Il prologo (dopo la schermata iniziale, prima di partire)
//  Si vede a inizio partita, dopo "Accendi e parti": una lettera dello studio notarile (l'eredità di un parente),
//  la BMW E36 blu che arriva sotto la pioggia e parcheggia davanti allo studio (il protagonista scende, gira attorno
//  all'auto ed entra), il colloquio col notaio (lui di spalle in primo piano), la scelta dell'auto nel garage dello zio
//  (le sei auto, una alla volta sotto la lampada; il notaio con le chiavi) e l'auto scelta che imbocca l'autostrada.
//  Poi comincia il Viaggio (e al km 0 la scelta del cambio, in index.html).
//  Grafica alla stessa risoluzione del gioco (v0.98): tela interna 1280×720 (densità doppia, coordinate di disegno a
//  640×360 come Street2D, dettagli a mezze unità), disegni ad alta definizione delle auto (`_hd.png`; la V40 passa per
//  Scale2x), attrezzi del gioco (facciate, finestre, lampade di locali2d.js; lampioni, marciapiede, cordolo di
//  nitido2d.js; luci di street2d.js e luci2d.js; scritte a pixel di insegne2d.js) usati da un Street2D «finto» (`kit`),
//  e la stessa presentazione del gioco: ×n a pixel netti, poi morbida fino allo schermo (`present`).
//  Persone col disegno del gioco (`pgStanding`, `pgBack` di personaggio.js): il notaio in piedi ha il tratto `abito`.
//  Clic, Invio o Spazio vanno avanti; nel garage ← → scelgono l'auto e Invio la prende; Esc o SALTA chiudono tutto.
//  Dal resto del gioco: NightPrologo.shouldPlay(game), NightPrologo.play({ onDone, onPick, ctx }), NightPrologo.jump(n).
// ============================================================================
const PRO_PARENTE = 'Claudio';                   // lo zio morto (anche in telefono.js)
const PRO_LETTERA = [
  'STUDIO NOTARILE FERRI',
  'Via dei Cantieri 12',
  '',
  'Gentile erede,',
  '',
  `con profondo dispiacere le comunichiamo che suo zio ${PRO_PARENTE} è venuto a mancare.`,
  'Ha lasciato disposizioni precise a suo nome: un\'eredità, che si può ritirare soltanto di persona.',
  '',
  'La aspettiamo stasera alle 21:00. Porti un documento.',
  '',
  'Distinti saluti,',
  'Avv. D. Ferri',
];
// il colloquio: chi parla e cosa dice (segnaposto, si cambia qui)
const PRO_NOTAIO = [
  'Si accomodi. Mi dispiace per suo zio.',
  `${PRO_PARENTE} non ha lasciato soldi. Ha lasciato un garage, e sei auto.`,
  'Una sola potrà portarsela via stasera. Le altre aspetteranno.',
  'Scelga con calma. Ma non troppa: suo zio diceva che di notte la strada si fa più lunga.',
];
// le sei auto del garage (le più vecchie ed economiche del gioco, disegni del proprietario): il giocatore ne sceglie una,
// che diventa la sua auto del Viaggio (malconcia: è ferma da anni). Le altre restano nel garage.
const PRO_AUTO = [
  { id: 'panda', nome: 'Fiat Panda', ok: true }, { id: 'a80', nome: 'Audi 80 Avant', ok: true }, { id: 'v40', nome: 'Volvo V40 SW', ok: true },
  { id: 'punto', nome: 'Fiat Grande Punto', ok: true }, { id: 'corsa', nome: 'Opel Corsa', ok: true }, { id: 'polo', nome: 'Volkswagen Polo', ok: true },
];
// si gioca il prologo solo all'inizio di un Viaggio nuovo (km 0, mai visto)
const proShould = (s) => !!(s && s.vg && s.vg.on && !s.vg.prologo && (s.dist || 0) < 50);
// il notaio in piedi (garage): capelli grigi, occhiali, abito scuro con la cravatta (tratto `abito` di personaggio.js)
const PRO_NOTAIO_LOOK = { pelle: 1, capelli: 'corti', capCol: 5, testa: 'niente', testaCol: 0, sopra: 'giubbotto', sopraCol: 1, barba: 'no', occhiali: 'vista', x: { abito: true } };

(function prologo() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const W = 640, H = 360, SS = 2, GY = 216, INK = '#0a0d18';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x)), ease = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }, lerp = (a, b, k) => a + (b - a) * k;
  const easeOut = (x) => { x = clamp(x, 0, 1); return 1 - (1 - x) * (1 - x) * (1 - x); };
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);                       // 0 → 1 tra i secondi a e b
  const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const hx = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const mix = (a, b, k) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
  const rgba = (h, a) => `rgba(${hx(h).join(',')},${a})`;
  const q = (v) => Math.round(v * SS) / SS;                                         // a mezze unità (un pixel vero)
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(q(x), q(y), q(w), q(h)); };

  // ------------------------------------------------------------ il kit: gli attrezzi di disegno del gioco su un Street2D «finto»
  let V = null;
  function kit(g) {
    if (V) { V.g = g; return V; }
    const ok = typeof Street2D !== 'undefined';
    V = ok ? Object.create(Street2D.prototype) : {};
    Object.assign(V, {
      SS, LW: W, LH: H, day: 0, quality: 'alta', sharp: true, g, spr: {}, tiles: new Map(), st: { t: 0 },
      C: { ink: INK, road: '#22263a', road2: '#1b1f31', road3: '#2a2f46', line: '#e8e4d6', curb: '#3a3f58', walk: '#2b2f45',
        sky: ['#0a0922', '#100f30', '#16143c', '#1d1a48', '#252055', '#2e2662', '#382c6c', '#433274', '#4f387a'],
        mid: ['#123049', '#1b2a52', '#2a1f4f', '#163d4a', '#2b2a5c', '#3a2246'], win: ['#ffd36b', '#ffe6a3', '#7fe7ff', '#ffb35c', '#ff9ccf'] },
    });
    if (!ok) { V.light = () => {}; V.text = () => {}; V.textW = (s, sc = 1) => (String(s).length * 4 - 1) * sc; }
    return V;
  }
  const has = (fn) => V && typeof V[fn] === 'function';
  // luce che si somma (alone morbido, come quella del gioco a densità doppia)
  const light = (g, x, y, rx, ry, col, a) => { if (has('light')) V.light(g, x, y, rx, ry, col, a, 3); };
  function glow(g, x, y, r, col, a) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(col, a)); gr.addColorStop(1, rgba(col, 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
  function vignette(g, a = 0.55) { const gr = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, W * 0.62); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  // uno strato fermo disegnato una volta sola (alla densità della scena) e poi incollato
  const LAYERS = new Map();
  function layer(key, paint) {
    let c = LAYERS.get(key);
    if (!c) { c = document.createElement('canvas'); c.width = W * SS; c.height = H * SS; const x = c.getContext('2d'); x.setTransform(SS, 0, 0, SS, 0, 0); x.imageSmoothingEnabled = false; kit(x); paint(x); kit(g); LAYERS.set(key, c); }
    return c;
  }
  const paste = (g, c) => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(c, 0, 0); g.restore(); };

  // ------------------------------------------------------------ immagini: auto ad alta definizione (E36 ridipinta di blu)
  const IMG = {};
  const load = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(i); i.src = src; });
  const okImg = (i) => !!(i && i.width);
  const spriteOf = (id) => (typeof CARS !== 'undefined' && CARS[id] && CARS[id].sprite) || (typeof CAMION !== 'undefined' && CAMION[id] && CAMION[id].sprite) || null;
  // { b: carrozzeria, w: ruota, D: misure dello sprite, k: pixel dell'immagine per unità }
  async function carOf(id) {
    const D = spriteOf(id); if (!D) return null;
    let [b, w] = await Promise.all([load(D.imgHd || D.img || `img/${id}.png`), load(D.wheelHd || D.wheel || `img/${id}_wheel.png`)]);
    if (!okImg(b) && D.imgHd) [b, w] = await Promise.all([load(D.img), load(D.wheel)]);
    if (!okImg(b)) return null;
    let k = b.width / D.w;
    if (k < 1.5 && typeof Street2D !== 'undefined' && Street2D.x2) { try { b = Street2D.x2(b); if (okImg(w)) w = Street2D.x2(w); k *= 2; } catch (e) { /* va bene anche senza Scale2x */ } }
    return { b, w, D, k };
  }
  // ridipinge le parti di vernice (maschera del proprietario) di un colore, tenendo luci e ombre del disegno
  function recolor(body, mask, col) {
    const c = document.createElement('canvas'); c.width = body.width; c.height = body.height; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(body, 0, 0);
    if (!okImg(mask)) return c;
    const m = document.createElement('canvas'); m.width = c.width; m.height = c.height; const mx = m.getContext('2d', { willReadFrequently: true }); mx.drawImage(mask, 0, 0, c.width, c.height);
    const d = x.getImageData(0, 0, c.width, c.height), p = d.data, mk = mx.getImageData(0, 0, c.width, c.height).data, [Rr, Gg, Bb] = hx(col);
    for (let i = 0; i < p.length; i += 4) {
      if (mk[i + 3] < 128 || !p[i + 3]) continue;
      const k = Math.max(0.15, Math.min(1.9, ((p[i] + p[i + 1] + p[i + 2]) / 3) / 140)), lift = k > 1 ? (k - 1) * 0.6 : 0;   // luci e ombre del disegno restano
      p[i] = Math.min(255, Rr * Math.min(k, 1.1) + (255 - Rr) * lift); p[i + 1] = Math.min(255, Gg * Math.min(k, 1.1) + (255 - Gg) * lift); p[i + 2] = Math.min(255, Bb * Math.min(k, 1.1) + (255 - Bb) * lift);
    }
    x.putImageData(d, 0, 0); return c;
  }
  // la E36 con la portiera aperta: al posto della portiera l'abitacolo buio (sedile, volante), la portiera si disegna a parte
  const DOOR = { x0: 73, x1: 126, y0: 4, y1: 45 };                       // portiera della E36 in unità dello sprite (cerniera davanti, x1)
  function cabin(C) {
    const c = document.createElement('canvas'); c.width = C.b.width; c.height = C.b.height; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(C.b, 0, 0);
    const k = C.k, X0 = Math.round(DOOR.x0 * k), X1 = Math.round(DOOR.x1 * k), Y0 = Math.round(DOOR.y0 * k), Y1 = Math.round(DOOR.y1 * k);
    const d = x.getImageData(X0, Y0, X1 - X0, Y1 - Y0), p = d.data, w = X1 - X0, h = Y1 - Y0;
    for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) {
      const i = (y * w + xx) * 4; if (p[i + 3] < 100) continue;
      const u = xx / w, v = y / h, edge = xx < 2 || xx > w - 3 || y > h - 3;
      let col = edge ? [10, 13, 24] : v < 0.38 ? [26, 30, 44] : [16, 18, 28];                                // cielo dal finestrino, poi l'abitacolo
      if (!edge && v > 0.3 && v < 0.9 && u > 0.12 && u < 0.5) col = [30, 26, 30];                            // il sedile
      if (!edge && v > 0.3 && v < 0.4 && u > 0.14 && u < 0.46) col = [44, 40, 44];
      if (!edge && v > 0.42 && v < 0.62 && u > 0.72 && u < 0.86) col = [22, 22, 26];                         // il volante
      if (!edge && v > 0.88) col = [40, 40, 54];                                                              // la soglia
      p[i] = col[0]; p[i + 1] = col[1]; p[i + 2] = col[2]; p[i + 3] = 255;
    }
    x.putImageData(d, X0, Y0); return c;
  }
  async function prepare() {
    if (IMG.ready) return;
    const ids = PRO_AUTO.map((a) => a.id);
    const cars = await Promise.all(ids.map(carOf)); ids.forEach((id, i) => { if (cars[i]) IMG['car_' + id] = cars[i]; });
    const e = await carOf('e36');
    if (e) {
      const D = e.D, mask = await load(D.paintHd || D.paint || 'img/e36_paint.png');
      e.b = recolor(e.b, mask, '#1c4ac4'); e.open = cabin(e); IMG.e36 = e;
    }
    IMG.tir = await carOf('tir');
    IMG.ready = true;
  }
  // un'auto di profilo con le ruote che girano; x = bordo sinistro, ground = dove poggiano le ruote, s = scala
  function drawCar(g, C, x, ground, ang, s = 1, body) {
    x = q(x); const D = C.D, top = ground - (D.wy + D.wr) * s, bw = C.b.width / C.k * s, bh = C.b.height / C.k * s;
    g.save(); g.imageSmoothingEnabled = s < 0.99 || s > 1.01; g.imageSmoothingQuality = 'high';
    if (okImg(C.w)) {
      const ws = C.w.width / C.k * s;
      for (const ax of D.ax) { g.save(); g.translate(x + ax * s, top + D.wy * s); g.rotate(ang); g.drawImage(C.w, -ws / 2, -ws / 2, ws, ws); g.restore(); }
    }
    g.drawImage(body || C.b, x, q(top), bw, bh);
    g.restore();
    return top;
  }
  // fascio dei fari sull'asfalto bagnato
  function beam(g, x, y, len, a, spread = 1) {
    const gr = g.createLinearGradient(x, 0, x + len, 0); gr.addColorStop(0, `rgba(255,236,180,${a})`); gr.addColorStop(1, 'rgba(255,236,180,0)');
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.beginPath(); g.moveTo(x, y - 2); g.lineTo(x + len, y - 18 * spread); g.lineTo(x + len, y + 20 * spread); g.lineTo(x, y + 3); g.fill(); g.restore();
  }
  function shadowUnder(g, x, ground, w, a = 0.6) { g.save(); g.fillStyle = `rgba(4,5,12,${a})`; g.beginPath(); g.ellipse(x + w / 2, ground + 1, w * 0.52, 4, 0, 0, Math.PI * 2); g.fill(); g.restore(); }

  // ------------------------------------------------------------ persone (disegno del gioco, personaggio.js)
  const myLook = () => (window.NightPG ? NightPG.now() : null);
  function person(g, x, y, s, ph, walking, light = 0, pose, look, flip) {
    if (typeof pgStanding !== 'function') return;
    g.save(); if (flip) { g.translate(x * 2, 0); g.scale(-1, 1); }
    pgStanding(g, x, y, s, ph, walking, look || myLook(), light, performance.now() / 1000, pose); g.restore();
  }

  // ------------------------------------------------------------ audio: pochi suoni sintetizzati (pioggia, motore, portiere, passi)
  let actx = null, rainNode = null;
  const out = () => (actx && actx.state !== 'closed' ? actx.destination : null);
  function noiseBuf(sec = 2) { const b = actx.createBuffer(1, actx.sampleRate * sec, actx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; }
  function motor(f0, f1, dur, vol) {
    try {
      const o0 = out(); if (!o0) return; const t = actx.currentTime;
      const o = actx.createOscillator(), o2 = actx.createOscillator(), lp = actx.createBiquadFilter(), g = actx.createGain();
      o.type = 'sawtooth'; o2.type = 'square'; lp.type = 'lowpass'; lp.frequency.value = 420; lp.Q.value = 2;
      o.frequency.setValueAtTime(f0, t); o.frequency.linearRampToValueAtTime(f1, t + dur * 0.8); o2.frequency.setValueAtTime(f0 / 2, t); o2.frequency.linearRampToValueAtTime(f1 / 2, t + dur * 0.8);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.4); g.gain.setValueAtTime(vol, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(o0); o.start(t); o2.start(t); o.stop(t + dur + 0.1); o2.stop(t + dur + 0.1);
    } catch (e) { /* senza audio si va avanti lo stesso */ }
  }
  function thump(vol = 0.2, f = 120) {
    try {
      const o0 = out(); if (!o0) return; const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f / 3, t + 0.25); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.connect(g); g.connect(o0); o.start(t); o.stop(t + 0.35);
    } catch (e) { /* ignora */ }
  }
  function tick(vol = 0.05, f = 1800) {                        // un passo sul marciapiede bagnato, il clic della freccia
    try {
      const o0 = out(); if (!o0) return; const t = actx.currentTime, s = actx.createBufferSource(), bp = actx.createBiquadFilter(), g = actx.createGain();
      s.buffer = noiseBuf(0.1); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 1.4; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      s.connect(bp); bp.connect(g); g.connect(o0); s.start(t); s.stop(t + 0.1);
    } catch (e) { /* ignora */ }
  }
  function rain(vol) {                                          // la pioggia: rumore filtrato in sottofondo, si alza e si abbassa
    try {
      if (!out()) return;
      if (!rainNode) {
        const s = actx.createBufferSource(), hp = actx.createBiquadFilter(), lp = actx.createBiquadFilter(), g = actx.createGain();
        s.buffer = noiseBuf(3); s.loop = true; hp.type = 'highpass'; hp.frequency.value = 500; lp.type = 'lowpass'; lp.frequency.value = 5200; g.gain.value = 0;
        s.connect(hp); hp.connect(lp); lp.connect(g); g.connect(out()); s.start(); rainNode = { s, g, lp };
      }
      rainNode.g.gain.setTargetAtTime(vol, actx.currentTime, 0.6);
    } catch (e) { /* ignora */ }
  }
  function rainMuffle(f) { try { if (rainNode) rainNode.lp.frequency.setTargetAtTime(f, actx.currentTime, 0.3); } catch (e) { /* ignora */ } }
  function rainStop() { try { if (rainNode) { const n = rainNode; n.g.gain.setTargetAtTime(0, actx.currentTime, 0.3); setTimeout(() => { try { n.s.stop(); } catch (e) { /* già ferma */ } }, 1500); } } catch (e) { /* ignora */ } rainNode = null; }
  // i suoni a tempo di una scena: ognuno una volta sola quando t passa il suo secondo
  let cues = [];
  function cue(t) { for (const c of cues) if (!c.done && t >= c.t) { c.done = true; c.fn(); } }

  // ------------------------------------------------------------ pioggia nel disegno
  function rainFx(g, t, a = 1, x0 = 0, y0 = 0, w = W, h = H, n = 150) {
    g.save(); g.beginPath(); g.rect(x0, y0, w, h); g.clip();
    g.fillStyle = `rgba(170,190,235,${0.28 * a})`;
    for (let i = 0; i < n; i++) {
      const sp = 380 + hash(i + 3) * 160, y = y0 + ((hash(i) * (h + 40) + t * sp) % (h + 40)) - 20, x = x0 + ((hash(i + 9) * (w + 60) - (y - y0) * 0.18) % (w + 60) + w + 60) % (w + 60) - 30;
      for (let k = 0; k < 7; k++) g.fillRect(q(x - k * 0.18), q(y + k * 1), 0.5, 1);
    }
    g.restore();
  }
  function splashes(g, t, y0, y1, n = 26) {                     // gocce che rimbalzano sull'asfalto
    g.fillStyle = 'rgba(190,205,240,.35)';
    for (let i = 0; i < n; i++) { const ph = (t * 2.2 + hash(i * 3.3)) % 1, x = hash(i + Math.floor(t * 2.2 + hash(i * 3.3)) * 17) * W, y = y0 + hash(i * 7.7 + Math.floor(t * 2.2 + hash(i * 3.3))) * (y1 - y0); if (ph < 0.25) { const r = ph * 10; g.fillRect(q(x - r), q(y), q(r * 2) || 0.5, 0.5); } }
  }
  // riflesso verticale di una luce sull'asfalto bagnato (a strisce di mezza unità che tremano)
  function reflect(g, x, y0, len, w, col, a, t) {
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let y = 0; y < len; y += 0.5) { const k = 1 - y / len, wob = Math.sin(y * 0.9 + t * 6 + x) * 0.8 * (y / len + 0.2); if (hash(Math.floor(y * 2) + x * 3.1 + Math.floor(t * 8)) > 0.82) continue; g.fillStyle = rgba(col, a * k * k); g.fillRect(q(x - w / 2 + wob), y0 + y, q(w * (0.6 + 0.4 * k)), 0.5); }
    g.restore();
  }

  // ------------------------------------------------------------ cielo e città lontana (stile della strada del gioco)
  function skyCity(g, seed, base = GY, stars = true) {
    const C = V.C, gr = g.createLinearGradient(0, 0, 0, base);
    C.sky.forEach((c, i) => gr.addColorStop(i / (C.sky.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, W, base);
    if (stars) for (let i = 0; i < 60; i++) R(g, hash(i + seed) * W, hash(i + 90 + seed) * base * 0.45, 0.5, 0.5, `rgba(255,250,230,${0.25 + hash(i + 7) * 0.5})`);
    glow(g, W * 0.5, base, 330, '#6a3a8a', 0.22);                                                                        // il bagliore della città sulle nuvole
    for (const [col, hMin, hVar, wins, lay] of [['#171838', 50, 110, 0.1, 0], ['#121230', 30, 80, 0.16, 1]]) {
      for (let i = 0, x = -10; x < W + 20; i++) {
        const s = seed + lay * 100 + i, w = 22 + hash(s) * 38, h = hMin + hash(s + 40) * hVar;
        R(g, x, base - h, w, h, col);
        if (hash(s + 5) > 0.6) { R(g, x + w * 0.4, base - h - 10, 1, 10, col); R(g, x + w * 0.4 - 0.5, base - h - 11, 2, 1.5, '#ff3a3a'); }   // antenna con la luce rossa
        for (let yy = base - h + 5; yy < base - 4; yy += 6) for (let xx = x + 3; xx < x + w - 3; xx += 5) if (hash(s * 3.1 + xx * 0.7 + yy * 1.3) < wins) R(g, xx, yy, 2, 2.5, hash(xx + yy) > 0.5 ? '#ffb35c' : '#ffe6a3');
        x += w + 1;
      }
    }
  }

  // ------------------------------------------------------------ le scene
  // ognuna: dur (s, 0 = aspetta un clic), draw(g, t), enter() opzionale
  const SC = {};

  // 1 · la lettera sul tavolo, sotto la lampada: il foglio è in HTML, il tavolo e gli oggetti nella tela
  SC.lettera = { dur: 0, enter() { rain(0.02); }, draw(g, t) {
    paste(g, layer('tavolo', (x) => {
      R(x, 0, 0, W, H, '#1c120c');
      for (let r = 0, y = -10; y < H; r++, y += 44) {                                       // assi di legno con le venature
        const base = mix('#3a2416', '#2a190f', hash(r * 3.7)); R(x, 0, y, W, 44, base);
        for (let k = 0; k < 26; k++) { const yy = y + 2 + hash(r * 9 + k) * 40, ph = hash(k + r) * 6; x.fillStyle = rgba(hash(k * 5 + r) > 0.5 ? '#1a0e08' : '#4e321e', 0.45); for (let xx = 0; xx < W; xx += 2) x.fillRect(xx, q(yy + Math.sin(xx * 0.02 + ph) * 2.2), 2, 0.5); }
        for (let k = 0; k < 2; k++) { const kx = hash(r * 5 + k) * W, ky = y + 10 + hash(r + k * 3) * 24; x.fillStyle = 'rgba(20,10,6,.6)'; x.beginPath(); x.ellipse(kx, ky, 7, 3, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = 'rgba(70,44,26,.5)'; x.beginPath(); x.ellipse(kx, ky, 4, 1.5, 0, 0, Math.PI * 2); x.fill(); }   // nodi
        R(x, 0, y + 43, W, 1, '#120a06'); R(x, 0, y + 43.5, W, 0.5, '#4a3020');
      }
      // la busta aperta, in basso a sinistra: carta, lembo, francobollo, ceralacca
      R(x, 36, 226, 150, 92, 'rgba(0,0,0,.45)'); R(x, 30, 220, 150, 92, '#d9cfb4'); R(x, 30, 220, 150, 1, '#efe6cc'); R(x, 30, 311, 150, 1, '#9a8f74');
      x.fillStyle = '#c9be9f'; x.beginPath(); x.moveTo(30, 220); x.lineTo(105, 262); x.lineTo(180, 220); x.closePath(); x.fill();
      x.strokeStyle = '#a89c7c'; x.lineWidth = 0.5; x.beginPath(); x.moveTo(30, 312); x.lineTo(98, 268); x.moveTo(180, 312); x.lineTo(112, 268); x.stroke();
      R(x, 150, 228, 22, 26, '#e8e0c8'); R(x, 152, 230, 18, 22, '#3a6a8a'); R(x, 154, 232, 14, 12, '#e8c070'); R(x, 152, 250, 18, 2, '#2a4a6a');   // francobollo
      x.fillStyle = '#7a1418'; x.beginPath(); x.arc(105, 262, 10, 0, Math.PI * 2); x.fill(); x.fillStyle = '#a82028'; x.beginPath(); x.arc(104, 261, 7, 0, Math.PI * 2); x.fill();
      kit(x); if (has('text')) V.text(x, 'F', 102, 258, '#5a0a10', 1);
      for (let k = 0; k < 3; k++) R(x, 50, 284 + k * 7, 70 - k * 14, 1, '#8a8068');                                                   // l'indirizzo
      // la tazza di caffè (vista dall'alto) e le chiavi della E36
      x.fillStyle = 'rgba(0,0,0,.45)'; x.beginPath(); x.arc(556, 286, 27, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#d8d2c6'; x.beginPath(); x.arc(552, 282, 26, 0, Math.PI * 2); x.fill(); x.fillStyle = '#ece8df'; x.beginPath(); x.arc(552, 282, 22, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#2a160c'; x.beginPath(); x.arc(552, 282, 17, 0, Math.PI * 2); x.fill(); x.fillStyle = '#4a2a16'; x.beginPath(); x.arc(549, 279, 8, 0, Math.PI * 2); x.fill();
      R(x, 576, 276, 12, 8, '#d8d2c6'); R(x, 579, 278, 6, 4, '#3a2416');
      x.strokeStyle = '#b8b0a0'; x.lineWidth = 1.5; x.beginPath(); x.arc(470, 320, 9, 0, Math.PI * 2); x.stroke();
      R(x, 476, 322, 30, 4, '#c8c0b0'); R(x, 500, 320, 3, 8, '#c8c0b0'); R(x, 494, 322, 3, 6, '#c8c0b0'); R(x, 448, 314, 18, 12, '#16161c'); R(x, 450, 316, 6, 6, '#1d4ac4'); R(x, 458, 316, 6, 6, '#e8e8f0');   // chiave e telecomando
      // la penna
      R(x, 210, 330, 74, 4, '#14141a'); R(x, 210, 330, 74, 1, '#3a3a48'); R(x, 284, 330.5, 8, 3, '#c8a040');
    }));
    // la luce della lampada da tavolo: un cerchio caldo che respira appena, e il resto al buio
    const fl = 1 + 0.02 * Math.sin(t * 4.1) + 0.015 * Math.sin(t * 9.3);
    g.save(); g.globalCompositeOperation = 'multiply'; const gr = g.createRadialGradient(470, 70, 30, 360, 160, 440 * fl);
    gr.addColorStop(0, '#ffe2b0'); gr.addColorStop(0.45, '#b88a5a'); gr.addColorStop(1, '#1a1210'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore();
    light(g, 470, 80, 200, 150, '#ffb870', 0.06 * fl);
    // il fumo del caffè
    g.fillStyle = 'rgba(230,220,200,.08)'; for (let i = 0; i < 14; i++) { const p = ((t * 0.25 + i / 14) % 1), y = 270 - p * 70, x = 552 + Math.sin(p * 7 + i) * (4 + p * 10); g.beginPath(); g.arc(x, y, 3 + p * 6, 0, Math.PI * 2); g.fill(); }
    vignette(g, 0.6);
  } };

  // 2 · l'arrivo: via dei Cantieri, pioggia, la E36 blu cambia corsia, parcheggia, lui scende ed entra nello studio
  const DOORX = 298, DOORW = 26, DOORY = 172, LAMPS = [100, 424, 620];                    // il portone dello studio (bordo sinistro, larghezza, cima)
  function studioFacade(x) {
    kit(x); const V0 = V;
    skyCity(x, 3);
    // a sinistra: palazzo di mattoni con la saracinesca abbassata
    V0.lcWall(x, -6, 92, 160, GY - 92, '#5a3634', 'mattoni', 11); V0.lcCornice(x, -6, 92, 160, '#6a4644');
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) V0.lcWindow(x, 8 + c * 38, 104 + r * 36, 14, 20, { lit: (r * 4 + c) % 3 === 0, shut: '#3a4a3a', closed: (r + c) % 4 === 3, flowers: r === 1 && c === 1 });
    R(x, 12, 178, 120, 38, '#2a2c38'); for (let y = 179; y < 216; y += 2) R(x, 12, y, 120, 0.5, '#1c1e28'); R(x, 12, 178, 120, 2, '#14151e');   // saracinesca
    R(x, 30, 192, 26, 8, '#7a2a6a'); R(x, 32, 194, 6, 4, '#c84aa0'); R(x, 40, 193, 12, 2, '#3ac8c8'); R(x, 82, 196, 18, 6, '#c8c83a');           // scritte coi bombolette
    R(x, 154, 100, 12, GY - 100, '#0b0c1a');                                                                                                     // il vicolo
    // lo studio: palazzo d'epoca in pietra chiara, tre piani, cornicioni, finestre con le persiane, portone di legno
    const L = 166, T = 40, Wd = 264;
    V0.lcWall(x, L, T, Wd, GY - T, '#6a5c50', 'intonaco', 23); V0.lcCornice(x, L, T, Wd, '#7a6c5e');
    R(x, L, GY - 10, Wd, 10, '#4a4038'); R(x, L, GY - 10, Wd, 0.5, '#7a6c5e');                                                                 // zoccolo di pietra
    for (const y of [92, 142]) { R(x, L - 2, y, Wd + 4, 3, '#7a6c5e'); R(x, L - 2, y, Wd + 4, 0.5, '#9a8c7c'); R(x, L, y + 3, Wd, 1, 'rgba(0,0,0,.3)'); }   // marcapiani
    for (let c = 0; c < 5; c++) { const wx = L + 22 + c * 50; V0.lcWindow(x, wx, 54, 16, 28, { lit: c === 3, who: c === 3, shut: '#2f4a3a', closed: c === 0 }); V0.lcWindow(x, wx, 104, 16, 28, { lit: c === 1 || c === 2, shut: '#2f4a3a', closed: c === 4 }); }
    for (const wx of [L + 22, L + 72, L + 196, L + 238]) {                                                                                  // piano terra: finestre con l'inferriata
      R(x, wx - 1, 158, 18, 30, INK); R(x, wx, 159, 16, 28, wx === L + 196 ? '#3a3046' : '#1a1a28');
      for (let k = 2; k < 16; k += 4) R(x, wx + k, 159, 1, 28, '#14141c'); R(x, wx, 166, 16, 1, '#14141c'); R(x, wx, 180, 16, 1, '#14141c');
      R(x, wx - 2, 188, 20, 2, '#8a7c6c');
    }
    // la scritta dello studio (lettere d'ottone sulla fascia di pietra) e la targa accanto al portone
    R(x, DOORX - 80, 146, 186, 16, '#5a4e44'); R(x, DOORX - 80, 146, 186, 0.5, '#8a7c6c'); R(x, DOORX - 80, 161.5, 186, 0.5, '#3a3028');
    if (has('text')) { const s = 'STUDIO NOTARILE FERRI', w = V0.textW(s, 2); V0.text(x, s, DOORX + 13 - w / 2 + 0.5, 149.5, '#2a2014', 2); V0.text(x, s, DOORX + 13 - w / 2, 149, '#e0b860', 2); }
    R(x, DOORX + 34, 182, 14, 10, '#8a6a2a'); R(x, DOORX + 35, 183, 12, 8, '#d8b060'); for (let k = 0; k < 3; k++) R(x, DOORX + 37, 185 + k * 2, 8, 0.5, '#6a4a1a');
    R(x, DOORX + 34, 194, 6, 4, '#2a2a30'); R(x, DOORX + 35, 195, 4, 2, '#c8c0a0');                                                            // il campanello
    // l'arco di pietra del portone e i gradini
    R(x, DOORX - 6, DOORY - 8, DOORW + 12, GY - DOORY + 8, '#7a6c5e'); R(x, DOORX - 6, DOORY - 8, DOORW + 12, 1, '#9a8c7c');
    x.fillStyle = '#7a6c5e'; x.beginPath(); x.arc(DOORX + DOORW / 2, DOORY + 2, DOORW / 2 + 6, Math.PI, 0); x.fill();
    x.fillStyle = INK; x.beginPath(); x.arc(DOORX + DOORW / 2, DOORY + 2, DOORW / 2 + 1, Math.PI, 0); x.fill(); R(x, DOORX - 1, DOORY + 2, DOORW + 2, GY - DOORY - 2, INK);
    x.fillStyle = '#ffd890'; x.beginPath(); x.arc(DOORX + DOORW / 2, DOORY + 2, DOORW / 2, Math.PI, 0); x.fill();                             // il sopraluce acceso
    for (let k = -2; k <= 2; k++) { x.strokeStyle = '#3a2a1a'; x.lineWidth = 0.5; x.beginPath(); x.moveTo(DOORX + DOORW / 2, DOORY + 2); x.lineTo(DOORX + DOORW / 2 + Math.sin(k * 0.6) * 13, DOORY + 2 - Math.cos(k * 0.6) * 13); x.stroke(); }
    R(x, DOORX - 10, GY - 3, DOORW + 20, 3, '#8a7c6c'); R(x, DOORX - 10, GY - 3, DOORW + 20, 0.5, '#aa9c8c');
    // a destra: palazzo più moderno con la farmacia chiusa (la croce verde resta accesa)
    V0.lcWall(x, 430, 70, 220, GY - 70, '#3a3e58', 'pannelli', 37); V0.lcCornice(x, 430, 70, 220, '#4a4e68');
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) V0.lcWindow(x, 446 + c * 46, 82 + r * 30, 18, 18, { lit: (r * 3 + c) % 4 === 1, shut: '#4a3a2a', closed: (r + c) % 5 === 2 });
    V0.lcGlass(x, 450, 176, 70, 38, { col: '#9adfb0', mull: 3, kick: 4, noSpill: true });
    R(x, 528, 176, 90, 40, '#262a3c'); for (let y = 177; y < 216; y += 2) R(x, 528, y, 90, 0.5, '#1c1f2e');
    // il marciapiede e il cordolo del gioco, la strada
    if (!(has('walkHD') && V0.walkHD(x, 0, 30, W))) { R(x, 0, 215, W, 21, V0.C.walk); R(x, 0, 233, W, 3, V0.C.curb); }
    R(x, 0, 236, W, 103, V0.C.road);
    for (let i = 0; i < 900; i++) R(x, hash(i) * W, 236 + hash(i + 3) * 103, 0.5, 0.5, hash(i + 5) > 0.5 ? V0.C.road2 : V0.C.road3);       // grana dell'asfalto
    const g2 = x.createLinearGradient(0, 236, 0, 339); g2.addColorStop(0, 'rgba(8,8,20,.35)'); g2.addColorStop(0.4, 'rgba(8,8,20,0)'); x.fillStyle = g2; x.fillRect(0, 236, W, 103);
    for (let k = 0; k < W; k += 40) R(x, k + 6, 300, 22, 2, '#c8c4b6');                                                                     // la mezzeria a tratti
    R(x, 0, 334, W, 1.5, '#b8b4a6');
    if (!(has('curbHD') && V0.curbHD(x, 0, 30, W))) { R(x, 0, 339, W, 21, V0.C.walk); R(x, 0, 339, W, 2, V0.C.curb); }
    for (const lx of LAMPS) if (has('lampHD')) V0.lampHD(x, lx, true, '#ffd9a0', lx);                                            // i lampioni
  }
  // la porta della E36 che si apre verso di noi: si stringe sulla cerniera e lascia vedere l'abitacolo
  function e36Door(g, C, x, top, s, a) {
    const k = C.k, f = 1 - 0.72 * a, dw = (DOOR.x1 - DOOR.x0) * f * s, dx = x + DOOR.x1 * s - dw, dy = top + DOOR.y0 * s, dh = (DOOR.y1 - DOOR.y0) * s;
    g.save(); g.imageSmoothingEnabled = true;
    g.drawImage(C.b, DOOR.x0 * k, DOOR.y0 * k, (DOOR.x1 - DOOR.x0) * k, (DOOR.y1 - DOOR.y0) * k, dx, dy + a * 1.2, dw, dh);
    g.fillStyle = `rgba(0,0,0,${0.35 * a})`; g.fillRect(dx, dy + a * 1.2, dw, dh);                                         // la portiera girata prende meno luce
    R(g, dx - 1, dy + 2 + a * 1.2, 1.5, dh - 4, '#0e1a40'); R(g, dx - 0.5, dy + 4 + a * 1.2, 0.5, dh - 8, '#2a5ad0');      // lo spessore della portiera
    g.restore();
  }
  SC.arrivo = { dur: 14, enter() {
    rain(0.05); rainMuffle(5200);
    cues = [{ t: 0.05, fn: () => motor(62, 44, 5.2, 0.07) }, ...[1.3, 1.8, 2.3, 2.8, 3.3, 3.8, 4.3].map((t) => ({ t, fn: () => tick(0.03, 2400) })),
      { t: 5.1, fn: () => thump(0.06, 70) }, { t: 5.45, fn: () => thump(0.08, 160) }, { t: 6.75, fn: () => thump(0.16, 110) },
      ...[6.5, 6.95, 7.4, 7.85, 8.3, 8.75, 9.2, 9.65].map((t) => ({ t, fn: () => tick(0.04, 900) })), { t: 10.2, fn: () => thump(0.05, 90) }, { t: 11.9, fn: () => thump(0.12, 80) }];
    showCaption('Via dei Cantieri 12', 'le nove di sera · pioggia');
  }, draw(g, t) {
    cue(t);
    paste(g, layer('via', studioFacade));
    kit(g); const C = IMG.e36;
    // le luci accese: lampioni (cono e pozza), finestre, croce verde della farmacia, sopraluce del portone
    for (const lx of LAMPS) { if (has('lampCone')) V.lampCone(g, lx, '#ffd9a0', t, true); light(g, lx + 19, 126, 20, 9, '#ffd9a0', 0.12); light(g, lx + 19, 240, 70, 10, '#ffcf8a', 0.05); }
    const cross = hash(Math.floor(t * 3)) > 0.06; R(g, 580, 140, 4, 12, cross ? '#3aff8a' : '#1a5a3a'); R(g, 576, 144, 12, 4, cross ? '#3aff8a' : '#1a5a3a'); if (cross) light(g, 582, 146, 26, 22, '#3aff8a', 0.06);
    light(g, DOORX + 13, DOORY + 4, 30, 14, '#ffc870', 0.06); light(g, DOORX + 13, GY + 8, 40, 6, '#ffc870', 0.05);
    // la tenda della finestra in alto si muove: qualcuno guarda giù (il notaio aspetta)
    const who = Math.sin(t * 0.7) > 0.2; if (who) R(g, 166 + 22 + 150 + 7, 69, 3, 9, 'rgba(30,18,16,.75)');
    // il portone: due ante di legno che si aprono verso dentro (l'atrio acceso, le scale)
    const op = ease(seg(t, 9.4, 10.1)) * (1 - ease(seg(t, 11.3, 12))), dh = GY - 3 - (DOORY + 2);
    R(g, DOORX, DOORY + 2, DOORW, dh, '#e8b870'); for (let k = 0; k < 5; k++) R(g, DOORX + 4 + k * 4, DOORY + 30 - k * 4, 6, 1, '#b88a50');            // l'atrio: luce calda e i gradini della scala
    const lw = DOORW / 2 * (1 - 0.82 * op);
    for (const [lx, side] of [[DOORX, 0], [DOORX + DOORW - lw, 1]]) {
      R(g, lx, DOORY + 2, lw, dh, '#3a2416'); R(g, lx + (side ? 0 : lw - 1), DOORY + 2, 1, dh, '#1a0e08');
      if (lw > 4) { R(g, lx + 2, DOORY + 6, lw - 4, 14, '#4a3020'); R(g, lx + 2, DOORY + 24, lw - 4, 14, '#4a3020'); R(g, lx + 2, DOORY + 6, lw - 4, 0.5, '#6a4a30'); R(g, lx + 2, DOORY + 24, lw - 4, 0.5, '#6a4a30'); }
      R(g, side ? lx + 1 : lx + lw - 3, DOORY + 22, 1.5, 3, '#d8b060');                                                                                        // pomoli d'ottone
    }
    if (op > 0.05) light(g, DOORX + 13, GY - 2, 24, 8, '#ffc870', 0.12 * op);
    // la E36: arriva nella corsia di sotto, mette la freccia, si sposta accanto al marciapiede e frena
    const xs = 52, X = lerp(-240, xs, easeOut(t / 5)), lane = ease(seg(t, 1.6, 4.2)), gnd = lerp(326, 292, lane), s = lerp(0.98, 0.9, lane);
    const moving = t < 4.9, lightsOn = t < 6.2 ? 1 : 1 - seg(t, 6.2, 6.6), brake = t > 2.6 && t < 5.4, ang = (X - -240) / (14.2 * s);
    const D = C ? C.D : null;
    // lui: scende dalla portiera, gira davanti al cofano e sale sul marciapiede, poi va al portone
    const doorA = ease(seg(t, 5.5, 6.0)) * (1 - ease(seg(t, 6.6, 6.9)));
    const frontX = xs + (D ? D.w : 194) * 0.9, pa = seg(t, 5.8, 6.1);
    let px = 0, py = 0, ps = 0.6, walk = false, alpha = 0;
    if (t >= 5.8 && t < 10.9) {
      alpha = pa * (1 - seg(t, 10.3, 10.8)); walk = t > 6.2 && t < 10.3;
      if (t < 8.4) { const k = seg(t, 6.2, 8.4); px = lerp(xs + 104 * 0.9, frontX + 14, k); py = 300; ps = 0.6; }
      else if (t < 9.3) { const k = ease(seg(t, 8.4, 9.3)); px = lerp(frontX + 14, frontX + 40, k); py = lerp(300, 224, k); ps = lerp(0.6, 0.46, k); }
      else { const k = seg(t, 9.3, 10.4); px = lerp(frontX + 40, DOORX + 13, k); py = lerp(224, 214, k); ps = lerp(0.46, 0.42, k); }
    }
    const lit = clamp(1 - Math.abs(px - (DOORX + 13)) / 60, 0, 1) * 0.35;
    const drawMe = () => { if (alpha > 0.01) { g.save(); g.globalAlpha = alpha; if (t > 10.1) { g.beginPath(); g.rect(DOORX, 0, DOORW, GY); g.clip(); } person(g, px, py, ps, t * 1.7, walk, lit); g.restore(); } };
    if (py < 260) drawMe();                                                                                       // sul marciapiede: dietro l'auto
    if (C) {
      const top = gnd - (D.wy + D.wr) * s, bw = D.w * s;
      // i riflessi sull'asfalto bagnato: fari, fanali e la sagoma
      reflect(g, X + D.head[0] * s, gnd + 2, 26, 8, '#ffe8b0', 0.18 * lightsOn, t); reflect(g, X + D.tail[0] * s + 2, gnd + 2, 22, 6, '#ff3a2a', (brake ? 0.3 : 0.15) * lightsOn, t);
      shadowUnder(g, X, gnd, bw);
      drawCar(g, C, X, gnd, ang, s, doorA > 0.02 ? C.open : null);
      if (doorA > 0.02) e36Door(g, C, X, top, s, doorA);
      if (lightsOn > 0) {
        beam(g, X + D.head[0] * s, top + D.head[1] * s + 2, 190, 0.32 * lightsOn); light(g, X + D.head[0] * s, top + D.head[1] * s, 10, 6, '#fff0c8', 0.25 * lightsOn);
        const tl = D.tail; R(g, X + tl[0] * s, top + tl[1] * s, tl[2] * s, tl[3] * s, brake ? '#ff4a3a' : '#c8241a'); light(g, X + tl[0] * s + 2, top + tl[1] * s + 2, brake ? 18 : 10, brake ? 9 : 5, '#ff3020', (brake ? 0.2 : 0.1) * lightsOn);
      }
      if (t > 1.2 && t < 4.6 && (t * 1.6) % 1 < 0.5) { const ix = X + (D.head[0] - 4) * s, iy = top + (D.head[1] + 3) * s; R(g, ix, iy, 3, 2, '#ffae2a'); light(g, ix + 1, iy + 1, 10, 6, '#ffae2a', 0.18); }   // la freccia a destra
      if (t < 6.2) for (let i = 0; i < 5; i++) { const p = ((t * 0.9 + i / 5) % 1), ex = X + D.ex[0] * s - p * (moving ? 40 : 12), ey = top + D.ex[1] * s - p * 10; g.fillStyle = `rgba(200,205,220,${0.12 * (1 - p)})`; g.beginPath(); g.arc(ex, ey, 2 + p * 6, 0, Math.PI * 2); g.fill(); }   // il fumo dello scarico, al freddo
    }
    if (py >= 260) drawMe();                                                                                      // in strada: davanti all'auto
    rainFx(g, t, 1); splashes(g, t, 238, 336);
    vignette(g, 0.42);
    const fade = seg(t, 13, 14); if (fade > 0) R(g, 0, 0, W, H, `rgba(0,0,0,${fade})`);
  } };

  // 3 · lo studio: il notaio dietro la scrivania, lui di spalle seduto davanti
  function studioRoom(x) {
    kit(x);
    // carta da parati verde scuro a rombi, boiserie di legno sotto, parquet
    R(x, 0, 0, W, 200, '#1c2622');
    for (let y = 0; y < 200; y += 12) for (let k = 0; k < W; k += 12) { const o = (y / 12) % 2 ? 6 : 0; x.fillStyle = '#24312b'; x.beginPath(); x.moveTo(k + o, y + 1); x.lineTo(k + o + 4, y + 6); x.lineTo(k + o, y + 11); x.lineTo(k + o - 4, y + 6); x.fill(); R(x, k + o - 0.5, y + 5.5, 1, 1, '#3a4a3e'); }
    R(x, 0, 36, W, 3, '#3a2416'); R(x, 0, 36, W, 0.5, '#6a4a30');                                                                         // la cornice in alto
    R(x, 0, 196, W, 66, '#3a2214'); R(x, 0, 196, W, 3, '#5a3820'); R(x, 0, 196, W, 0.5, '#7a5634');
    for (let k = 8; k < W; k += 64) { R(x, k, 206, 54, 46, '#2e1a10'); R(x, k, 206, 54, 0.5, '#1a0e08'); R(x, k, 251.5, 54, 0.5, '#4e3220'); R(x, k + 53.5, 206, 0.5, 46, '#4e3220'); }   // pannelli
    R(x, 0, 258, W, 4, '#1a0e08');
    R(x, 0, 262, W, 98, '#2a1810');
    for (let y = 262; y < H; y += 7) { R(x, 0, y, W, 0.5, '#1a0e08'); for (let k = (y * 3) % 40; k < W; k += 40) R(x, k, y, 0.5, 7, '#1a0e08'); }   // parquet
    // il tappeto rosso con il bordo
    R(x, 120, 300, 420, 60, '#4a1416'); R(x, 126, 304, 408, 1, '#8a6a3a'); for (let k = 130; k < 530; k += 10) R(x, k, 308, 4, 2, '#6a2a24');
    // la finestra con le tende di velluto (la pioggia e la città si disegnano dopo)
    R(x, 30, 44, 124, 134, INK); R(x, 33, 47, 118, 128, '#0b0d1a');
    R(x, 24, 176, 136, 6, '#5a3820'); R(x, 24, 176, 136, 1, '#7a5634');
    for (const [cx, w] of [[10, 34], [140, 34]]) for (let k = 0; k < w; k += 2) { const v = Math.sin(k * 0.7) * 0.5 + 0.5; R(x, cx + k, 34, 2, 156, mix('#4a1014', '#8a2228', v)); }
    R(x, 4, 32, 176, 5, '#6a4a2a'); R(x, 4, 32, 176, 1, '#c8a040');                                                                          // il bastone delle tende
    // i diplomi incorniciati
    for (const dx of [246, 374]) { R(x, dx, 52, 40, 30, '#8a6a2a'); R(x, dx + 2, 54, 36, 26, '#e8e0c8'); R(x, dx + 6, 58, 28, 2, '#3a3020'); for (let k = 0; k < 4; k++) R(x, dx + 6, 63 + k * 3.5, 28 - (k % 2) * 6, 0.5, '#8a8068'); x.fillStyle = '#a82028'; x.beginPath(); x.arc(dx + 30, 75, 3, 0, Math.PI * 2); x.fill(); }
    // la libreria a destra: libri di altezze diverse, qualcuno inclinato, i faldoni, un busto di gesso
    R(x, 466, 30, 150, 230, '#2a1a10'); R(x, 466, 30, 150, 4, '#4a3020'); R(x, 470, 34, 142, 222, '#160c06');
    for (let i = 0; i < 5; i++) {
      const sy = 74 + i * 44; R(x, 470, sy, 142, 4, '#4a3020'); R(x, 470, sy, 142, 0.5, '#6a4a30');
      for (let bx = 473, k = 0; bx < 606; k++) {
        const s = i * 31 + k, bw = 5 + Math.floor(hash(s) * 6), bh = 26 + Math.floor(hash(s + 1) * 12), col = ['#5a2224', '#22344a', '#4a3d1a', '#2c2c36', '#3a4a2a', '#6a4a2a'][Math.floor(hash(s + 2) * 6)];
        if (i === 2 && k === 5) { R(x, bx + 2, sy - 22, 14, 22, '#c8c0b0'); R(x, bx + 4, sy - 32, 10, 12, '#d8d0c0'); R(x, bx + 6, sy - 28, 2, 2, '#8a8478'); bx += 20; continue; }   // il busto
        if (hash(s + 3) > 0.92 && bx < 590) { x.save(); x.translate(bx, sy); x.rotate(-0.25); R(x, 0, -bh, bw, bh, col); R(x, 1, -bh + 4, bw - 2, 1, '#c8a040'); x.restore(); bx += bw + 6; continue; }
        R(x, bx, sy - bh, bw, bh, col); R(x, bx, sy - bh, 1, bh, mix(col, '#ffffff', 0.15)); R(x, bx + 1, sy - bh + 4, bw - 2, 1, '#c8a040'); R(x, bx + 1, sy - 8, bw - 2, 1, '#c8a040'); bx += bw + 0.5;
      }
    }
    // l'orologio a pendolo: cassa con il frontone, il quadrante (le nove), lo sportello di vetro (il pendolo si muove dopo)
    R(x, 182, 22, 48, 172, '#2a1408'); R(x, 178, 16, 56, 8, '#3a2010'); R(x, 182, 12, 48, 5, '#4a2a14'); R(x, 182, 22, 1, 172, '#4a2a14');
    R(x, 186, 28, 40, 40, '#1a0c04'); x.fillStyle = '#e8dcc0'; x.beginPath(); x.arc(206, 48, 17, 0, Math.PI * 2); x.fill(); x.strokeStyle = '#8a6a2a'; x.lineWidth = 1; x.stroke();
    for (let h = 0; h < 12; h++) { const a = h / 12 * Math.PI * 2; R(x, 206 + Math.sin(a) * 14 - 0.5, 48 - Math.cos(a) * 14 - 0.5, 1, 1, '#2a2014'); }
    x.strokeStyle = '#14100a'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(206, 48); x.lineTo(197, 48); x.stroke(); x.lineWidth = 1; x.beginPath(); x.moveTo(206, 48); x.lineTo(206, 35); x.stroke();
    R(x, 188, 76, 36, 108, '#120804'); R(x, 188, 76, 36, 0.5, '#4a2a14'); R(x, 180, 190, 52, 6, '#3a2010');
  }
  function studioFront(x) {                                    // la scrivania davanti al notaio (si disegna dopo di lui)
    kit(x);
    // la scrivania: piano con il cuoio verde, il fronte coi cassetti e le maniglie d'ottone
    R(x, 176, 226, 290, 12, '#4a2a16'); R(x, 182, 227, 278, 9, '#1e3a2a'); R(x, 182, 227, 278, 0.5, '#2e5a40'); R(x, 176, 226, 290, 0.5, '#7a5030');
    R(x, 176, 238, 290, 64, '#33200f'); R(x, 176, 238, 290, 1, '#1a0e06');
    for (const dx of [188, 380]) { R(x, dx, 246, 74, 22, '#3e2612'); R(x, dx, 246, 74, 0.5, '#5a3a1e'); R(x, dx + 32, 255, 10, 2, '#c8a040'); R(x, dx, 272, 74, 22, '#3e2612'); R(x, dx, 272, 74, 0.5, '#5a3a1e'); R(x, dx + 32, 281, 10, 2, '#c8a040'); }
    R(x, 270, 246, 102, 48, '#2a180a'); R(x, 176, 300, 290, 4, '#1a0e06');
    // sul piano: le pratiche, il calamaio e la penna, la tazzina
    R(x, 330, 214, 56, 13, '#e4dccb'); R(x, 332, 210, 52, 5, '#d8cfba'); R(x, 334, 206, 48, 5, '#ccc2aa'); R(x, 336, 203, 30, 3, '#a8402a');
    R(x, 292, 219, 10, 8, '#14141a'); R(x, 294, 218, 6, 1.5, '#3a3a48'); R(x, 300, 212, 1, 10, '#c8a040');
    R(x, 408, 218, 9, 9, '#e8e0d0'); R(x, 417, 220, 3, 5, '#e8e0d0'); R(x, 404, 226, 17, 1.5, '#d8d0c0');
    // la lampada da notaio: base d'ottone, paralume di vetro verde
    R(x, 224, 222, 22, 5, '#8a6a2a'); R(x, 233, 200, 3, 22, '#a8842a'); R(x, 218, 190, 34, 11, '#1f5a3a'); R(x, 218, 190, 34, 2, '#3a8a5a'); R(x, 220, 200, 30, 1.5, '#0f3a22');
  }
  // il notaio dietro la scrivania, a mezze unità: capelli pettinati, occhiali con il riflesso, bocca che parla
  function notaryBust(g, t, talk, blink) {
    const nod = talk ? Math.sin(t * 5) * 0.5 : Math.sin(t * 0.9) * 0.3, b = Math.sin(t * 1.2) * 0.5;
    // giacca, spalle e revers
    g.fillStyle = '#16161e'; g.beginPath(); g.moveTo(258, 232); g.lineTo(266, 170 + b); g.quadraticCurveTo(320, 148 + b, 374, 170 + b); g.lineTo(382, 232); g.fill();
    g.fillStyle = '#20202c'; g.beginPath(); g.moveTo(268, 176 + b); g.quadraticCurveTo(290, 160 + b, 306, 156 + b); g.lineTo(300, 200); g.lineTo(272, 230); g.fill();
    R(g, 303, 152 + b, 34, 70, '#e6e1d6'); R(g, 303, 152 + b, 34, 1, '#ffffff'); R(g, 316, 155 + b, 8, 62, '#7a1c24'); R(g, 315, 154 + b, 10, 6, '#5a1018'); R(g, 317, 160 + b, 1, 56, '#9a2a34');
    g.fillStyle = '#262634'; g.beginPath(); g.moveTo(303, 152 + b); g.lineTo(313, 204); g.lineTo(294, 170 + b); g.fill(); g.beginPath(); g.moveTo(337, 152 + b); g.lineTo(327, 204); g.lineTo(346, 170 + b); g.fill();
    g.fillStyle = '#e6e1d6'; g.beginPath(); g.moveTo(348, 178 + b); g.lineTo(351, 173 + b); g.lineTo(354, 176 + b); g.lineTo(357, 172 + b); g.lineTo(358, 178 + b); g.fill();   // il fazzoletto nel taschino
    // collo e testa
    const y = nod + b;
    R(g, 309, 140 + y, 22, 14, '#b8826a'); R(g, 309, 150 + y, 22, 3, '#a0705a');
    g.fillStyle = '#d9a98a'; g.beginPath(); g.ellipse(320, 122 + y, 23, 27, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#c9957a'; g.beginPath(); g.ellipse(302, 128 + y, 6, 16, 0, 0, Math.PI * 2); g.fill(); 
    R(g, 294, 114 + y, 6, 15, '#d0a080'); R(g, 340, 114 + y, 6, 15, '#d0a080'); R(g, 295, 118 + y, 2, 7, '#b88a6a');            // orecchie
    g.fillStyle = '#9a9a9e'; g.beginPath(); g.ellipse(320, 103 + y, 25, 14, 0, Math.PI, Math.PI * 2); g.fill(); R(g, 295, 100 + y, 7, 20, '#9a9a9e'); R(g, 338, 100 + y, 7, 20, '#9a9a9e');
    for (let k = 0; k < 7; k++) R(g, 302 + k * 6, 95 + y + Math.abs(k - 3) * 0.8, 4, 0.5, '#b8b8bc');                         // la pettinata
    R(g, 304, 111 + y, 13, 2, '#6a6a6a'); R(g, 323, 111 + y, 13, 2, '#6a6a6a');
    R(g, 302, 115 + y, 16, 11, '#101018'); R(g, 322, 115 + y, 16, 11, '#101018'); R(g, 318, 118 + y, 4, 1.5, '#101018');          // la montatura
    const eye = blink ? '#c9957a' : '#d8e4f0'; R(g, 304, 117 + y, 12, 7, eye); R(g, 324, 117 + y, 12, 7, eye);
    if (!blink) { R(g, 308.5, 119.5 + y, 3, 3, '#2a2a34'); R(g, 328.5, 119.5 + y, 3, 3, '#2a2a34'); R(g, 309, 120 + y, 1, 1, '#ffffff'); R(g, 329, 120 + y, 1, 1, '#ffffff'); }
    R(g, 305, 117 + y, 4, 1, 'rgba(255,255,255,.5)'); R(g, 325, 117 + y, 4, 1, 'rgba(255,255,255,.5)');                             // il riflesso della lampada
    R(g, 318, 125 + y, 5, 9, '#c9957a'); R(g, 318, 133 + y, 6, 1, '#b07a60');                                                       // il naso
    R(g, 306, 133 + y, 1, 5, 'rgba(150,100,80,.6)'); R(g, 333, 133 + y, 1, 5, 'rgba(150,100,80,.6)');                               // le rughe
    const mo = talk ? 1 + Math.round((Math.sin(t * 19) * 0.5 + 0.5) * 3) : 1;
    R(g, 312, 139 + y, 16, mo, '#5a2420'); if (mo > 2) R(g, 314, 139 + y, 12, 1, '#e8e0d0');
  }
  // le mani sulla scrivania, una sopra l'altra, con i polsini bianchi e le maniche
  function notaryHands(g, t) {
    const f = Math.sin(t * 0.8) > 0.6 ? 1 : 0;                                                                 // ogni tanto tamburella con le dita
    R(g, 268, 219, 18, 9, '#16161e'); R(g, 282, 220, 4, 7, '#e6e1d6'); R(g, 286, 220, 22, 7, '#d9a98a'); R(g, 286, 220, 22, 1, '#e8bc9c'); for (let k = 0; k < 4; k++) R(g, 296 + k * 3, 225 - (k === 1 ? f : 0), 2, 2.5, '#c9957a');
    R(g, 350, 217, 20, 10, '#16161e'); R(g, 346, 218, 4, 8, '#e6e1d6'); R(g, 318, 218, 28, 8, '#d0a080'); R(g, 318, 218, 28, 1, '#e8bc9c'); R(g, 330, 223, 1, 3, '#b07a60');
  }
  SC.studio = { dur: 0, enter() { rain(0.025); rainMuffle(900); cues = []; }, draw(g, t) {
    paste(g, layer('studio', studioRoom));
    kit(g);
    // fuori dalla finestra: la città sotto la pioggia, ogni tanto un lampo lontano
    g.save(); g.beginPath(); g.rect(33, 47, 118, 128); g.clip();
    const lampo = (t % 11) > 10.6 ? 1 - ((t % 11) - 10.6) / 0.4 : 0;
    R(g, 33, 47, 118, 128, mix('#0b0d1a', '#5a6a9a', lampo * 0.6));
    for (let i = 0; i < 12; i++) { const bx = 33 + hash(i) * 120, bh = 30 + hash(i + 4) * 70; R(g, bx, 175 - bh, 12 + hash(i + 2) * 14, bh, '#070814'); for (let k = 0; k < 6; k++) if (hash(i * 7 + k) > 0.55) R(g, bx + 2 + (k % 3) * 4, 175 - bh + 4 + Math.floor(k / 3) * 8 + hash(k) * 30, 2, 2.5, '#ffb35c'); }
    rainFx(g, t, 0.9, 33, 47, 118, 128, 40);
    for (let i = 0; i < 8; i++) { const yy = 47 + ((hash(i) * 128 + t * (8 + hash(i + 1) * 10)) % 128), xx = 36 + hash(i + 5) * 112; R(g, xx, yy, 1, 2, 'rgba(180,200,240,.45)'); R(g, xx, yy - 6, 0.5, 6, 'rgba(180,200,240,.2)'); }   // gocce che scivolano sul vetro
    g.restore();
    R(g, 90, 47, 4, 128, '#3a2416'); R(g, 33, 108, 118, 3, '#3a2416');                                                    // gli infissi
    // il pendolo che oscilla dietro il vetro dello sportello
    { const a = Math.sin(t * 2.6) * 0.3; g.save(); g.beginPath(); g.rect(188, 76, 36, 108); g.clip(); g.translate(206, 78); g.rotate(a); R(g, -0.5, 0, 1.5, 80, '#b89040'); x0disc(g, 0, 84, 8); g.restore(); R(g, 188, 76, 36, 108, 'rgba(160,180,220,.06)'); }
    // il notaio (parla solo mentre scrive la sua battuta), poi la lampada che lo illumina
    const talk = !!(root && root.querySelector('.dlg') && !canNext), blink = (t % 4.3) < 0.12;
    notaryBust(g, t, talk, blink);
    paste(g, layer('studioFront', studioFront));
    notaryHands(g, t);
    light(g, 235, 210, 90, 40, '#ffd28a', 0.09); glow(g, 235, 204, 130, '#ffcc80', 0.16); light(g, 320, 140, 70, 60, '#ffc880', 0.025);
    // la tazzina che fuma
    g.fillStyle = 'rgba(230,220,200,.1)'; for (let i = 0; i < 6; i++) { const p = ((t * 0.3 + i / 6) % 1); g.beginPath(); g.arc(412 + Math.sin(p * 6 + i) * 3, 214 - p * 24, 1.5 + p * 3, 0, Math.PI * 2); g.fill(); }
    // lui di spalle, seduto sulla poltrona di cuoio (lo schienale gli copre la schiena)
    if (typeof pgBack === 'function') { g.save(); g.translate(140, 318); g.scale(0.82, 0.82); pgBack(g, 0, 0, t, myLook()); g.restore(); }
    g.fillStyle = '#2a1008'; g.beginPath(); g.moveTo(66, H); g.lineTo(70, 338); g.quadraticCurveTo(72, 326, 90, 324); g.quadraticCurveTo(140, 316, 190, 324); g.quadraticCurveTo(208, 326, 210, 338); g.lineTo(214, H); g.fill();
    g.fillStyle = '#4a1e10'; g.beginPath(); g.moveTo(74, H); g.lineTo(76, 340); g.quadraticCurveTo(78, 330, 92, 328); g.quadraticCurveTo(140, 321, 188, 328); g.quadraticCurveTo(202, 330, 204, 340); g.lineTo(206, H); g.fill();
    R(g, 92, 327.5, 96, 1, '#7a3a20');
    for (let r = 0; r < 2; r++) for (let k = 0; k < 5; k++) { const bx = 96 + k * 22 + (r ? 11 : 0), by = 340 + r * 11; R(g, bx, by, 2, 2, '#1a0804'); R(g, bx, by, 1, 1, '#6a3018'); }   // la poltrona capitonné
    vignette(g, 0.5);
  } };
  function x0disc(g, x, y, r) { g.fillStyle = '#d8b050'; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); g.fillStyle = '#f0d070'; g.beginPath(); g.arc(x - 2, y - 2, r * 0.4, 0, Math.PI * 2); g.fill(); }

  // 4 · il garage dello zio: le sei auto, una alla volta sotto la lampada
  function garageRoom(x) {
    kit(x);
    R(x, 0, 0, W, 250, '#1a1c24');
    for (let y = 0; y < 250; y += 16) for (let k = (y / 16) % 2 ? 0 : 16; k < W; k += 32) { R(x, k, y, 31.5, 15.5, '#1e2029'); R(x, k, y, 31.5, 0.5, '#24262f'); }   // blocchi di cemento
    for (let i = 0; i < 18; i++) { const sx = hash(i) * W; x.fillStyle = 'rgba(10,8,6,.25)'; x.fillRect(sx, 120 + hash(i + 1) * 60, 2 + hash(i + 2) * 4, 60 + hash(i + 3) * 70); }   // colature di umidità
    // la saracinesca chiusa in fondo al centro (fuori piove)
    R(x, 196, 40, 248, 210, '#2a2d38'); for (let y = 42; y < 250; y += 4) { R(x, 198, y, 244, 0.5, '#1c1e28'); R(x, 198, y + 0.5, 244, 0.5, '#353948'); }
    R(x, 190, 34, 260, 8, '#14151c'); R(x, 300, 240, 40, 4, '#4a4e5e');
    // la parete degli attrezzi (pannello forato con le sagome), il banco, la morsa, la cassetta rossa
    R(x, 16, 104, 132, 86, '#2a2c34'); for (let y = 110; y < 186; y += 6) for (let k = 22; k < 144; k += 6) R(x, k, y, 1, 1, '#16171d');
    for (const [kx, h, w] of [[30, 40, 3], [44, 30, 4], [58, 46, 3], [76, 26, 6], [94, 38, 3], [112, 32, 5], [128, 22, 8]]) { R(x, kx, 114, w, h, '#0e0f14'); R(x, kx - 2, 114, w + 4, 4, '#0e0f14'); R(x, kx, 114, w, h, 'rgba(120,130,150,.15)'); }
    R(x, 10, 192, 146, 8, '#4a3020'); R(x, 10, 192, 146, 1, '#6a4a30'); R(x, 16, 200, 6, 50, '#2a1e16'); R(x, 144, 200, 6, 50, '#2a1e16'); R(x, 10, 230, 146, 4, '#2a1e16');
    R(x, 54, 180, 24, 12, '#8a1e1e'); R(x, 54, 180, 24, 2, '#c82a2a'); R(x, 62, 177, 8, 3, '#2a2a2a'); R(x, 112, 184, 14, 8, '#4a4e5e'); R(x, 116, 180, 6, 4, '#6a6e7e');
    // il calendario dello zio, fermo a un mese di anni fa
    R(x, 64, 46, 34, 46, '#e8e0d0'); R(x, 64, 46, 34, 14, '#b82a2a'); for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) R(x, 67 + c * 6, 64 + r * 6, 4, 4, r === 2 && c === 3 ? '#b82a2a' : '#8a8478');
    if (has('text')) V.text(x, '1999', 70, 50, '#f0e0d0', 1);
    // gli scaffali con le latte d'olio e le scatole, la pila di gomme
    for (const sy of [96, 146, 196]) { R(x, 492, sy, 132, 5, '#3a3e4a'); R(x, 492, sy, 132, 1, '#5a5e6a'); }
    R(x, 494, 96, 4, 154, '#2a2d38'); R(x, 618, 96, 4, 154, '#2a2d38');
    for (let i = 0; i < 7; i++) { const c = ['#c8a020', '#2a5a9a', '#8a2a2a'][i % 3]; R(x, 502 + i * 16, 78, 11, 18, c); R(x, 502 + i * 16, 82, 11, 5, '#e8e0d0'); R(x, 505 + i * 16, 76, 4, 2, '#2a2a2a'); }
    for (let i = 0; i < 6; i++) { const c = ['#2a7a4a', '#c8a020', '#5a5a6a'][i % 3]; R(x, 504 + i * 18, 128, 13, 18, c); R(x, 504 + i * 18, 133, 13, 4, '#e8e0d0'); }
    R(x, 506, 172, 34, 24, '#4a3a24'); R(x, 506, 172, 34, 1, '#6a5a3a'); R(x, 548, 168, 50, 28, '#3a3a40'); R(x, 548, 168, 50, 1, '#5a5a60');
    for (let i = 0; i < 4; i++) { x.fillStyle = '#121216'; x.beginPath(); x.ellipse(458, 246 - i * 9, 24, 6, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = '#26262e'; x.beginPath(); x.ellipse(458, 244 - i * 9, 22, 4, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = '#0a0a0e'; x.beginPath(); x.ellipse(458, 244 - i * 9, 11, 2, 0, 0, Math.PI * 2); x.fill(); }
    // il pavimento di cemento: macchie d'olio, la riga gialla, il tombino
    R(x, 0, 250, W, 110, '#22242c'); R(x, 0, 250, W, 2, '#121318');
    for (let i = 0; i < 1400; i++) R(x, hash(i) * W, 252 + hash(i + 2) * 108, 0.5, 0.5, hash(i + 4) > 0.5 ? '#2a2c35' : '#1a1c22');
    for (const [ox, w] of [[120, 60], [380, 90], [560, 40], [250, 30]]) { x.fillStyle = 'rgba(0,0,0,.4)'; x.beginPath(); x.ellipse(ox, 300 + (ox % 30), w, 7, 0, 0, Math.PI * 2); x.fill(); }
    R(x, 0, 338, W, 3, '#8a7a2a'); for (let k = 0; k < W; k += 24) R(x, k, 338, 12, 3, '#2a2a20');
    R(x, 300, 350, 40, 6, '#14151a'); for (let k = 302; k < 338; k += 4) R(x, k, 351, 2, 4, '#26282e');
  }
  const DUST = new Map();
  function dusty(C, id) {                                        // l'auto ferma da anni: un velo di polvere sulla carrozzeria
    if (DUST.has(id)) return DUST.get(id);
    const c = document.createElement('canvas'); c.width = C.b.width; c.height = C.b.height; const x = c.getContext('2d'); x.drawImage(C.b, 0, 0);
    x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(150,140,120,.12)'; x.fillRect(0, 0, c.width, c.height);
    const top = x.createLinearGradient(0, 0, 0, c.height * 0.5); top.addColorStop(0, 'rgba(190,180,160,.22)'); top.addColorStop(1, 'rgba(190,180,160,0)'); x.fillStyle = top; x.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(200,190,170,${0.1 + hash(i + id.length) * 0.15})`; x.fillRect(Math.floor(hash(i * 7.3 + 1) * c.width), Math.floor(hash(i * 3.1 + id.length) * c.height), 1, 1); }
    DUST.set(id, c); return c;
  }
  let sel = 0, selFrom = 0, selT = 0;                             // l'auto in vista nel garage e l'animazione del cambio
  SC.garage = { dur: 0, enter() { rain(0.015); rainMuffle(600); cues = []; }, draw(g, t) {
    paste(g, layer('garage', garageRoom));
    kit(g);
    // i neon del soffitto (uno sfarfalla), la lampada sopra l'auto
    for (const [lx, w] of [[100, 70], [540, 70]]) { const fl = lx === 540 && hash(Math.floor(t * 12)) > 0.9 ? 0.3 : 1; R(g, lx - w / 2, 14, w, 4, '#3a3e4a'); R(g, lx - w / 2 + 2, 17, w - 4, 2, fl > 0.5 ? '#e8f2ff' : '#6a7080'); light(g, lx, 22, 120, 60, '#c8dcff', 0.04 * fl); }
    R(g, 316, 0, 1, 40, '#2a2c34'); g.fillStyle = '#2a2c34'; g.beginPath(); g.moveTo(300, 52); g.lineTo(306, 40); g.lineTo(328, 40); g.lineTo(334, 52); g.fill(); R(g, 304, 51, 26, 2, '#fff0c8');
    g.save(); g.globalCompositeOperation = 'lighter'; const cg = g.createLinearGradient(0, 52, 0, 330); cg.addColorStop(0, 'rgba(255,230,170,.16)'); cg.addColorStop(1, 'rgba(255,230,170,0)');
    g.fillStyle = cg; g.beginPath(); g.moveTo(302, 52); g.lineTo(332, 52); g.lineTo(470, 330); g.lineTo(164, 330); g.fill(); g.restore();
    light(g, 317, 294, 170, 16, '#ffd8a0', 0.06);
    // l'auto in vista: entra da destra (o da sinistra) quando cambi
    const k = ease(clamp((t - selT) / 0.45, 0, 1)), dir = sel > selFrom ? 1 : -1;
    const drawAt = (i, off, a) => {
      const a0 = PRO_AUTO[i], C = IMG['car_' + a0.id]; if (!C) return;
      const D = C.D, cx = 320 - D.w / 2 + off, gnd = 292;
      g.save(); g.globalAlpha = a;
      g.save(); g.translate(0, gnd * 2 + 2); g.scale(1, -1); g.globalAlpha = a * 0.12; drawCar(g, C, cx, gnd, 0, 1, dusty(C, a0.id)); g.restore();   // il riflesso sul cemento
      shadowUnder(g, cx, gnd, D.w, 0.7); drawCar(g, C, cx, gnd, 0, 1, dusty(C, a0.id)); g.restore();
    };
    if (k < 1 && selFrom !== sel) drawAt(selFrom, -dir * 260 * k, 1 - k);
    drawAt(sel, dir * 260 * (1 - k), k < 1 && selFrom !== sel ? k : 1);
    // il pulviscolo nel cono di luce
    g.fillStyle = 'rgba(255,240,200,.5)'; for (let i = 0; i < 26; i++) { const yy = 60 + ((hash(i) * 260 + t * (3 + hash(i + 1) * 5)) % 260), w = (yy - 52) / 278 * 150, xx = 317 + (hash(i + 2) - 0.5) * 2 * w + Math.sin(t * 0.6 + i) * 4; if (Math.sin(t * (1 + hash(i + 3)) + i) > -0.3) R(g, xx, yy, 0.5, 0.5, 'rgba(255,240,200,.6)'); }
    // il notaio con le chiavi (a sinistra), lui che guarda le auto (a destra, girato verso il centro)
    const ns = 0.88, ny = 300; for (const sx of [92, 552]) { g.fillStyle = 'rgba(4,5,12,.5)'; g.beginPath(); g.ellipse(sx + 2, ny + 1, 18, 3, 0, 0, Math.PI * 2); g.fill(); }
    person(g, 92, ny, ns, 0, false, 0.12, 'idle', PRO_NOTAIO_LOOK);
    const kx = 92 + 3 * ns * 1.1, ky = ny - 35 * ns * 1.1, jig = Math.sin(t * 5) * 0.8;
    R(g, kx + jig, ky, 1, 5, '#c8c0a8'); R(g, kx - 1 + jig, ky + 5, 4, 3, '#e8d890'); R(g, kx + 2 + jig, ky + 6, 3, 4, '#a8a090'); light(g, kx + 1, ky + 6, 6, 5, '#ffe6a0', 0.15);
    person(g, 552, 300, 0.88, 0, false, 0.1, 'pockets', null, true);
    vignette(g, 0.5);
  } };

  // 5 · l'autostrada: l'auto scelta esce dalla città, supera un camion, passa sotto il portale e poi il titolo
  function highway(x) {
    kit(x); skyCity(x, 33, 226);
    // colline scure davanti alla città e il guardrail
    x.fillStyle = '#0c0c1e'; x.beginPath(); x.moveTo(0, 226); for (let k = 0; k <= W; k += 8) x.lineTo(k, 206 + Math.sin(k * 0.013) * 8 + Math.sin(k * 0.041) * 4); x.lineTo(W, 226); x.fill();
    R(x, 0, 226, W, 10, '#14152a');
    R(x, 0, 236, W, 103, V.C.road); for (let i = 0; i < 900; i++) R(x, hash(i + 9) * W, 236 + hash(i + 13) * 103, 0.5, 0.5, hash(i + 5) > 0.5 ? V.C.road2 : V.C.road3);
    R(x, 0, 238, W, 1.5, '#d8d4c6'); R(x, 0, 334, W, 1.5, '#d8d4c6');
    if (!(has('curbHD') && V.curbHD(x, 0, 30, W))) R(x, 0, 339, W, 21, V.C.walk);
  }
  SC.strada = { dur: 14, enter() { rainStop(); cues = [{ t: 0, fn: () => motor(80, 170, 7, 0.09) }, { t: 6.5, fn: () => motor(150, 185, 6, 0.07) }]; }, draw(g, t) {
    cue(t);
    paste(g, layer('autostrada', highway));
    kit(g);
    const off = 6 * t + 20 * Math.max(0, t - 2) * Math.min(1, Math.max(0, t - 2) / 3);                              // metri percorsi (la strada scorre, sempre più veloce)
    const px = off * 30;                                                                                              // in unità (30 per metro)
    // lampioni e guardrail che scorrono, coni di luce
    for (let lx = -((px * 0.7) % 420) - 40; lx < W + 40; lx += 420) { if (has('lampHD')) V.lampHD(g, lx, true, '#ffd9a0', 7); if (has('lampCone')) V.lampCone(g, lx, '#ffd9a0', t, false); light(g, lx + 19, 126, 16, 8, '#ffd9a0', 0.12); }
    for (let gx = -((px * 0.8) % 60) - 60; gx < W + 60; gx += 60) { R(g, gx, 222, 2, 14, '#3a3e4e'); }
    R(g, 0, 224, W, 4, '#5a5e70'); R(g, 0, 224, W, 1, '#8a90a8'); R(g, 0, 228, W, 1, '#2a2c38');
    for (let k = -((px) % 60) - 60; k < W; k += 60) R(g, k, 286, 30, 2, '#d8d4c6');                                    // tratteggio tra le corsie
    // il camion nella corsia di sopra, più lento: lo superiamo
    const T = IMG.tir; if (T) { const ts = 0.5, tw = 17, tx = 360 + (tw * t - off) * 30, tg = 270; if (tx < W + 20 && tx > -T.D.w * ts - 20) { shadowUnder(g, tx, tg, T.D.w * ts, 0.5); drawCar(g, T, tx, tg, tw * t * 30 / (T.D.wr * ts), ts); const D = T.D, top = tg - (D.wy + D.wr) * ts; R(g, tx + D.tail[0] * ts, top + D.tail[1] * ts, 3, 3, '#ff3a2a'); light(g, tx + D.tail[0] * ts + 1, top + D.tail[1] * ts + 1, 10, 5, '#ff3020', 0.12); } }
    // il portale verde: AUTOSTRADA · SOLO AVANTI
    const gx = 700 - (t - 5) * 160;
    if (gx > -260 && gx < W + 20) {
      R(g, gx - 8, 50, 6, 186, '#2a2c38'); R(g, gx + 242, 50, 6, 186, '#2a2c38'); R(g, gx - 8, 50, 256, 4, '#3a3e4e');
      R(g, gx - 1, 57, 242, 86, INK); R(g, gx, 58, 240, 84, '#0b5a30'); R(g, gx + 3, 61, 234, 78, '#0e6a38'); R(g, gx + 3, 61, 234, 0.5, '#3aa06a');
      if (has('text')) { const a = 'AUTOSTRADA', b = 'SOLO AVANTI'; V.text(g, a, gx + 120 - V.textW(a, 3) / 2, 72, '#f2f2e6', 3); V.text(g, b, gx + 120 - V.textW(b, 3) / 2, 106, '#f2f2e6', 3); }
      R(g, gx + 6, 64, 228, 0.5, '#d8e8d8'); R(g, gx + 6, 135, 228, 0.5, '#d8e8d8'); light(g, gx + 120, 100, 140, 50, '#9affc0', 0.03);
    }
    // l'auto scelta: entra da sinistra e poi tiene la corsia, appena mossa dal fondo
    const C = IMG.drive || IMG.car_v40;
    if (C) {
      const D = C.D, vx = t < 3 ? lerp(-260, 150, easeOut(t / 3)) : 150 + Math.sin(t * 1.3) * 3, gnd = 324 + (t < 3 ? 0 : Math.sin(t * 9) * 0.3), top = gnd - (D.wy + D.wr);
      reflect(g, vx + D.head[0], gnd + 2, 14, 8, '#ffe8b0', 0.12, t); shadowUnder(g, vx, gnd, D.w);
      beam(g, vx + D.head[0], top + D.head[1] + 2, 260, 0.34); drawCar(g, C, vx, gnd, px / D.wr, 1);
      const tl = D.tail; R(g, vx + tl[0], top + tl[1], tl[2], tl[3], '#ff3a2a'); light(g, vx + tl[0] + 2, top + tl[1] + 2, 14, 7, '#ff3020', 0.14);
      light(g, vx + D.head[0], top + D.head[1], 12, 7, '#fff0c8', 0.25);
    }
    vignette(g, 0.4);
    // il titolo
    const fade = seg(t, 10, 11.4);
    if (fade > 0) {
      R(g, 0, 0, W, H, `rgba(0,0,0,${fade})`);
      const a = seg(t, 11, 12.2); if (a > 0) {
        g.save(); g.globalAlpha = a; g.textAlign = 'center';
        g.font = '44px "Saira Stencil One", "Russo One", Impact, sans-serif'; g.fillStyle = '#f0e6d2'; g.fillText('NIGHT RUN', W / 2, 184);
        g.font = '16px "Saira Stencil One", "Russo One", Impact, sans-serif'; g.fillStyle = '#ffb347'; g.fillText('THE LAST HIGHWAY', W / 2, 208);
        g.font = '12px "Share Tech Mono", monospace'; g.fillStyle = '#a8936a'; g.fillText('km 0', W / 2, 234); g.restore();
      }
    }
  } };
  const ORDER = ['lettera', 'arrivo', 'studio', 'garage', 'strada'];

  // ------------------------------------------------------------ sipario (HTML sopra la tela)
  const CSS = `
.pro{position:fixed;inset:0;z-index:95;background:#000;display:grid;place-items:center;font:16px/1.5 "Barlow Semi Condensed",system-ui,sans-serif;color:#f0e6d2;user-select:none;-webkit-user-select:none;cursor:pointer;overflow:hidden;transition:opacity .8s}
.pro.out{opacity:0}
.pro>canvas{position:absolute;inset:0;width:100%;height:100%;background:#000}
.pro .skip{position:absolute;right:max(14px,env(safe-area-inset-right));top:max(14px,env(safe-area-inset-top));z-index:4;border:0;background:rgba(10,9,7,.7);color:#a8936a;font:600 12px "Share Tech Mono",monospace;letter-spacing:.1em;padding:8px 12px;cursor:pointer;box-shadow:inset 0 0 0 1px #3a342a}
.pro .skip:hover{color:#ffb347}
.pro .hint{position:absolute;left:0;right:0;bottom:max(14px,env(safe-area-inset-bottom));text-align:center;font:12px "Share Tech Mono",monospace;letter-spacing:.14em;color:#c8b48acc;z-index:2;animation:pr 1.6s ease-in-out infinite;text-shadow:0 1px 3px #000}
@keyframes pr{50%{opacity:.35}}
.pro .letter{position:relative;z-index:2;width:min(600px,calc(100% - 32px));max-height:calc(100% - 90px);overflow:hidden;background:linear-gradient(170deg,#f1e8d0,#e4d8b8 60%,#d8caa4);color:#2a2418;padding:clamp(20px,3.4vh,34px) clamp(22px,3vw,38px);box-shadow:0 26px 60px #000d,0 0 0 1px #b8a880,inset 0 0 50px rgba(120,90,40,.28);transform:rotate(-1deg);font:clamp(14px,1.9vh,18px)/1.6 "Special Elite","Courier New",monospace}
.pro .letter .lh{text-align:center;border-bottom:1.5px solid #6a5a3a;padding-bottom:10px;margin-bottom:16px}
.pro .letter .lh b{display:block;font:700 clamp(15px,2.1vh,19px)/1.3 "Courier New",monospace;letter-spacing:.22em}
.pro .letter .lh span{font-size:.85em;letter-spacing:.1em;color:#5a4a30}
.pro .letter .lb{white-space:pre-wrap;min-height:8em}
.pro .letter .sig{margin-top:6px;text-align:right;font:italic clamp(20px,2.8vh,26px)/1.2 Georgia,"Times New Roman",serif;color:#1c2a5a;opacity:0;transition:opacity .9s}
.pro .letter .sig.on{opacity:1}
.pro .letter .stamp{position:absolute;right:26px;top:18px;width:64px;height:64px;border:2px solid #8a2a2acc;border-radius:50%;color:#8a2a2acc;font:700 9px/1.15 "Courier New",monospace;display:grid;place-items:center;text-align:center;transform:rotate(14deg);letter-spacing:.06em}
.pro .cap{position:absolute;z-index:2;left:max(26px,4vw);bottom:max(30px,6vh);text-shadow:0 2px 8px #000;opacity:0;transition:opacity 1.2s;pointer-events:none}
.pro .cap.on{opacity:1}
.pro .cap b{display:block;font:400 clamp(20px,3.2vh,30px)/1.1 "Saira Stencil One","Russo One",Impact,sans-serif;letter-spacing:.08em;color:#f0e6d2;text-transform:uppercase}
.pro .cap span{font:clamp(12px,1.6vh,15px) "Share Tech Mono",monospace;letter-spacing:.16em;color:#ffb347;text-transform:uppercase}
.pro .dlg{position:absolute;z-index:2;left:50%;bottom:max(46px,calc(env(safe-area-inset-bottom) + 30px));transform:translateX(-50%);width:min(680px,calc(100% - 28px));background:linear-gradient(180deg,rgba(30,27,22,.94),rgba(12,11,9,.94));padding:14px 18px 16px;box-shadow:inset 0 0 0 1px #4a4234,inset 0 2px 0 #ffb347,0 18px 40px #000a}
.pro .dlg.alto{bottom:auto;top:max(18px,env(safe-area-inset-top))}
.pro .dlg h4{margin:0 0 4px;font:400 14px "Saira Stencil One","Russo One",Impact,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#ffb347}
.pro .dlg p{margin:0;font-size:clamp(16px,2.2vh,20px);color:#f7e6c8;min-height:2.6em}
.pro .cars{position:absolute;z-index:3;left:50%;transform:translateX(-50%);bottom:max(16px,env(safe-area-inset-bottom));width:min(980px,calc(100% - 24px));display:grid;gap:8px;cursor:default}
.pro .row{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px}
.pro .car{position:relative;background:rgba(14,13,11,.86);box-shadow:inset 0 0 0 1px #3a342a;padding:6px 6px 5px;display:grid;gap:2px;justify-items:center;cursor:pointer;min-width:0;transition:box-shadow .2s,transform .2s,background .2s}
.pro .car canvas{width:100%;height:auto;aspect-ratio:200/90}
.pro .car b{font:400 12px "Saira Stencil One","Russo One",Impact,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:#a8936a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.pro .car:hover{transform:translateY(-2px);background:rgba(28,24,18,.9)}
.pro .car.sel{box-shadow:inset 0 0 0 2px #ffb347,0 0 22px rgba(255,179,71,.35)}.pro .car.sel b{color:#ffb347}
.pro .take{display:flex;align-items:center;justify-content:space-between;gap:12px;background:linear-gradient(180deg,rgba(30,27,22,.94),rgba(12,11,9,.94));box-shadow:inset 0 0 0 1px #4a4234;padding:8px 10px 8px 16px}
.pro .take .nm{font:400 clamp(17px,2.4vh,22px)/1.1 "Saira Stencil One","Russo One",Impact,sans-serif;letter-spacing:.06em;color:#f0e6d2;text-transform:uppercase}
.pro .take .nm small{display:block;font:12px "Share Tech Mono",monospace;letter-spacing:.08em;color:#a8936a;text-transform:none;margin-top:3px}
.pro .take .ar{display:flex;gap:6px}
.pro .take button{border:0;cursor:pointer;font:600 13px "Share Tech Mono",monospace;letter-spacing:.1em;padding:10px 14px;background:#2a251c;color:#e8d8b0;box-shadow:inset 0 0 0 1px #5a4e38}
.pro .take button:hover{color:#ffb347}
.pro .take button.go{background:#ffb347;color:#1a1208;box-shadow:none}.pro .take button.go:hover{background:#ffc66a;color:#1a1208}
.pro .take button:disabled{opacity:.5;cursor:default}
.pro .shake{animation:sh .3s}@keyframes sh{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
@media (max-width:700px){.pro .row{grid-template-columns:repeat(3,minmax(0,1fr))}.pro .letter .stamp{display:none}}
@media (max-height:520px){.pro .row{display:none}.pro .dlg{padding:8px 12px 10px}.pro .dlg p{font-size:15px;min-height:0}.pro .take{padding:6px 8px 6px 12px}.pro .take button{padding:8px 10px}.pro .letter{font-size:13px;padding:14px 18px}.pro .letter .lb{min-height:0}}
@media (prefers-reduced-motion:reduce){.pro .hint{animation:none}}`;

  let root = null, cv = null, ctx = null, lo = null, g = null, raf = 0, T0 = 0, cur = -1, done = false, opts = {}, typer = 0, lineI = 0, canNext = false, pickLocked = false, starting = false;
  const el = (h) => { const d = document.createElement('div'); d.innerHTML = h; return d.firstElementChild; };
  const clearUI = () => { clearInterval(typer); for (const n of [...root.querySelectorAll('.letter,.dlg,.cars,.hint,.cap')]) n.remove(); };
  const hint = (t) => root.appendChild(el(`<div class="hint">${t}</div>`));
  function showCaption(a, b) { const c = el(`<div class="cap"><b>${a}</b><span>${b}</span></div>`); root.appendChild(c); setTimeout(() => c.classList.add('on'), 900); setTimeout(() => c.classList.remove('on'), 9500); }

  function type(node, text, cb) {      // macchina da scrivere: tocca di nuovo per finire subito
    clearInterval(typer); let i = 0; node.textContent = ''; canNext = false; let fin = false;
    const end = () => { if (fin) return; fin = true; clearInterval(typer); node.textContent = text; canNext = true; cb && cb(); };
    typer = setInterval(() => { i += 2; node.textContent = text.slice(0, i); if (i >= text.length) end(); }, 28);
    node._finish = end;
  }

  function enterScene(i) {
    cur = i; const name = ORDER[i], sc = SC[name]; T0 = performance.now(); clearUI(); lineI = 0; canNext = false; cues = [];
    if (sc.enter) sc.enter();
    if (name === 'lettera') {
      // intestazione e firma non si battono a macchina: la carta intestata c'è già, la firma arriva alla fine
      const head = PRO_LETTERA.slice(0, 2), body = PRO_LETTERA.slice(3, -1).join('\n'), sig = PRO_LETTERA[PRO_LETTERA.length - 1];
      const L = el(`<div class="letter"><div class="stamp">STUDIO<br>NOTARILE<br>FERRI</div><div class="lh"><b>${head[0]}</b><span>${head[1]}</span></div><div class="lb"></div><div class="sig">${sig}</div></div>`);
      root.appendChild(L); type(L.querySelector('.lb'), body, () => { L.querySelector('.sig').classList.add('on'); hint('CLIC PER CONTINUARE'); });
    } else if (name === 'studio') speak(0);
    else if (name === 'garage') showCars();
  }
  function speak(n) {
    clearUI(); lineI = n;
    const d = el('<div class="dlg"><h4>Il notaio</h4><p></p></div>'); root.appendChild(d); type(d.querySelector('p'), PRO_NOTAIO[n], () => hint(n < PRO_NOTAIO.length - 1 ? 'CLIC PER CONTINUARE' : 'CLIC PER ANDARE AL GARAGE'));
  }
  function chosen(id) { const C = IMG['car_' + id]; IMG.drive = C || null; }
  function carThumb(c, a) {
    const k = c.getContext('2d'); c.width = 400; c.height = 180; k.setTransform(2, 0, 0, 2, 0, 0);
    const C = IMG['car_' + a.id]; if (!C) return;
    const gr = k.createRadialGradient(100, 70, 4, 100, 70, 100); gr.addColorStop(0, 'rgba(255,220,160,.22)'); gr.addColorStop(1, 'rgba(255,220,160,0)'); k.fillStyle = gr; k.fillRect(0, 0, 200, 90);
    const D = C.D, sc = Math.min(184 / D.w, 74 / D.h), x0 = (200 - D.w * sc) / 2;
    k.fillStyle = 'rgba(0,0,0,.5)'; k.beginPath(); k.ellipse(100, 84, D.w * sc * 0.5, 3, 0, 0, Math.PI * 2); k.fill();
    drawCar(k, C, x0, 84, 0, sc, dusty(C, a.id));
  }
  function carInfo(id) {
    const c = typeof CARS !== 'undefined' && CARS[id], sch = typeof SCHEDE !== 'undefined' && SCHEDE[id];
    const cv = sch && sch.hp ? `${sch.hp} CV` : '', cm = sch && sch.cambio ? `cambio a ${sch.cambio}` : '';
    return [c && c.name, cv, cm].filter(Boolean).join(' · ');
  }
  function showCars() {
    const box = el('<div class="cars"><div class="take"><div class="nm"></div><div class="ar"><button type="button" class="pv" aria-label="Auto precedente">◀</button><button type="button" class="nx" aria-label="Auto successiva">▶</button><button type="button" class="go">PRENDI QUESTA ›</button></div></div><div class="row"></div></div>');
    const row = box.querySelector('.row');
    PRO_AUTO.forEach((a, i) => { const c = el(`<div class="car" data-i="${i}" role="button" tabindex="0" aria-label="${a.nome}"><canvas></canvas><b>${a.nome}</b></div>`); carThumb(c.querySelector('canvas'), a); row.appendChild(c); });
    root.appendChild(box); focusCar(sel, true);
    const d = el('<div class="dlg alto"><h4>Il notaio</h4><p></p></div>'); root.appendChild(d); type(d.querySelector('p'), 'Sei auto, tutte ferme da anni. Le guardi pure. Una sola, stasera.');
  }
  function focusCar(i, now) {
    i = (i + PRO_AUTO.length) % PRO_AUTO.length; if (!now && i === sel) return;
    selFrom = now ? i : sel; sel = i; selT = (performance.now() - T0) / 1000; if (!now) tick(0.04, 1200);
    if (!root) return; for (const c of root.querySelectorAll('.car')) c.classList.toggle('sel', +c.dataset.i === sel);
    const nm = root.querySelector('.take .nm'); if (nm) nm.innerHTML = `${PRO_AUTO[sel].nome}<small>${carInfo(PRO_AUTO[sel].id)}</small>`;
  }
  function pick(i, node) {
    const a = PRO_AUTO[i]; if (pickLocked || !a) return;
    if (!a.ok) { if (node) { node.classList.remove('shake'); void node.offsetWidth; node.classList.add('shake'); } thump(0.1); const p = root.querySelector('.dlg p'); if (p) type(p, 'Quella no. Non ancora.'); return; }
    pickLocked = true; thump(0.2); chosen(a.id); if (opts.onPick) opts.onPick(a.id);
    for (const b of root.querySelectorAll('.take button')) b.disabled = true;
    const p = root.querySelector('.dlg p'); type(p, 'Le chiavi sono nel cruscotto. Come sempre. Buona strada.', () => setTimeout(() => { if (!done && ORDER[cur] === 'garage') go(cur + 1); }, 1400));
  }

  // clic / Invio / Spazio: va avanti dove ha senso
  function advance() {
    if (done) return; const name = ORDER[cur], d = root.querySelector('.letter .lb,.dlg p');
    if (!canNext && d && d._finish) { d._finish(); return; }
    if (name === 'lettera') go(1);
    else if (name === 'arrivo') go(2);
    else if (name === 'studio') { if (lineI < PRO_NOTAIO.length - 1) speak(lineI + 1); else go(3); }
  }
  function go(i) { if (i >= ORDER.length) return finish(); enterScene(i); }

  // la presentazione del gioco (nitido2d.js): la tela interna ×n a pixel netti, poi morbida fino allo schermo
  let up = null; const MS = { draw: 0, present: 0 };
  function present() {
    const dpr = Math.min(2, window.devicePixelRatio || 1), cw = Math.round(cv.clientWidth * dpr), ch = Math.round(cv.clientHeight * dpr);
    if (!cw || !ch) return;
    if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; }
    const k = Math.min(cw / W, ch / H), dw = Math.round(W * k), dh = Math.round(H * k), dx = Math.floor((cw - dw) / 2), dy = Math.floor((ch - dh) / 2);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cw, ch);
    const kk = dh / lo.height;
    if (kk < 1.02 || Math.abs(kk - Math.round(kk)) < 0.01) { ctx.imageSmoothingEnabled = kk < 0.99; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(lo, dx, dy, dw, dh); return; }
    const n = Math.min(4, Math.ceil(kk)), uw = lo.width * n, uh = lo.height * n;
    up = up || document.createElement('canvas'); if (up.width !== uw || up.height !== uh) { up.width = uw; up.height = uh; }
    const ux = up.getContext('2d'); ux.imageSmoothingEnabled = false; ux.drawImage(lo, 0, 0, uw, uh);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'medium'; ctx.drawImage(up, dx, dy, dw, dh);
  }
  function frame(now) {
    if (done) return; raf = requestAnimationFrame(frame);
    const t = (now - T0) / 1000, sc = SC[ORDER[cur]]; if (!sc) return;
    g.setTransform(SS, 0, 0, SS, 0, 0); g.imageSmoothingEnabled = false; g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    kit(g); V.st.t = t;
    const m0 = performance.now(); try { sc.draw(g, t); } catch (e) { console.warn('prologo', e); }
    const m1 = performance.now(); present(); const m2 = performance.now();
    MS.draw += (m1 - m0 - MS.draw) * 0.1; MS.present += (m2 - m1 - MS.present) * 0.1;               // tempi medi (per le prove: NightPrologo.ms)
    if (sc.dur && t >= sc.dur) go(cur + 1);
  }
  function finish() {
    if (done) return; done = true; cancelAnimationFrame(raf); clearInterval(typer); rainStop();
    window.removeEventListener('keydown', keys, true); const cb = opts.onDone;
    if (!root) { starting = false; if (cb) cb(); return; }
    root.classList.add('out');
    setTimeout(() => { if (root) root.remove(); root = null; starting = false; if (cb) cb(); }, 800);
  }
  function keys(e) {
    if (!root) return;
    const garage = ORDER[cur] === 'garage' && !pickLocked;
    if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); finish(); }
    else if (garage && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'd')) { e.preventDefault(); e.stopImmediatePropagation(); focusCar(sel + (e.key === 'ArrowLeft' || e.key === 'a' ? -1 : 1)); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopImmediatePropagation(); if (garage) pick(sel); else advance(); }
    else e.stopImmediatePropagation();                // durante il prologo i tasti del gioco non fanno niente
  }

  async function play(o = {}) {
    if (root || starting) return; starting = true; opts = o; done = false; pickLocked = false; sel = 0; selFrom = 0; IMG.drive = null;
    if (!document.getElementById('proCss')) { const s = document.createElement('style'); s.id = 'proCss'; s.textContent = CSS; document.head.appendChild(s); }
    // il sipario c'è subito (anche mentre si caricano i disegni): il gioco sotto sa che il prologo è in corso
    root = el('<div class="pro" role="dialog" aria-label="Prologo"><canvas></canvas><button type="button" class="skip">SALTA ›</button></div>');
    document.body.appendChild(root); cv = root.querySelector('canvas'); ctx = cv.getContext('2d');
    window.addEventListener('keydown', keys, true);
    root.addEventListener('click', (e) => {
      if (e.target.closest('.skip')) { finish(); return; }
      if (e.target.closest('.take .go')) { pick(sel); return; }
      if (e.target.closest('.take .pv')) { focusCar(sel - 1); return; }
      if (e.target.closest('.take .nx')) { focusCar(sel + 1); return; }
      const car = e.target.closest('.car'); if (car) { const i = +car.dataset.i; if (i === sel) pick(i, car); else focusCar(i); return; }
      if (!e.target.closest('.cars')) advance();
    });
    await prepare(); if (done) return;
    lo = document.createElement('canvas'); lo.width = W * SS; lo.height = H * SS; g = lo.getContext('2d'); kit(g);
    actx = (typeof o.ctx === 'function' ? o.ctx() : o.ctx) || null;
    enterScene(0); raf = requestAnimationFrame(frame);
  }

  // gli attrezzi di disegno, anche per la schermata iniziale (titolo.js)
  const arte = { W, H, SS, kit, carOf, recolor, load, drawCar, beam, shadowUnder, reflect, skyCity, light, glow, vignette, R, q, hash, ease, clamp, lerp, mix, rgba, prepare, IMG };
  window.NightPrologo = { play, shouldPlay: (game) => proShould(game && game.s), jump: (n, at = 0) => { if (root && g) { enterScene(n); T0 -= at * 1000; } }, get playing() { return !!root; }, arte, get ms() { return { draw: +MS.draw.toFixed(1), present: +MS.present.toFixed(1) }; }, finish };
})();
if (typeof window !== 'undefined') Object.assign(window, { PRO_LETTERA, PRO_NOTAIO, PRO_AUTO, PRO_NOTAIO_LOOK, proShould });
