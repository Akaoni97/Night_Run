// ============================================================================
//  Night Run · Gli interni dei locali (dopo telefono.js)
//  Quando entri in un locale (bar, autogrill, motel, benzinaio, Da Luca Tuning, Officina Nico, Russian Kùstòm) sopra la
//  strada compare la scena dell'interno, in pixel art 640×360: chi ti serve dietro al bancone che si muove e sbatte gli
//  occhi, le luci (neon che tremano, lampade calde, tubi fluorescenti), le finestre con la notte fuori e il traffico che
//  passa, la tua auto vera (sul ponte da Luca, sopra la fossa da Nico, in cabina al Russian Kùstòm, alla pompa del
//  benzinaio, fuori dalla vetrina del bar). Gli oggetti importanti si toccano: portano alla sezione giusta del pannello.
//  Ogni locale ha anche il suo sottofondo (brusio, macchina del caffè, frigoriferi, compressore...), sintetizzato.
//  Dal resto del gioco: NightInterni.open(place), .close(). Le scene sono in SCENE (una funzione per locale).
// ============================================================================
(function interni() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const W = 640, H = 360;
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------- strumenti di disegno
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const P = (g, x, y, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), 1, 1); };
  const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
    if (f >= 0) { r += (255 - r) * f; gg += (255 - gg) * f; b += (255 - b) * f; } else { r *= 1 + f; gg *= 1 + f; b *= 1 + f; }
    return '#' + [r, gg, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join(''); };
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  // sfumatura verticale a bande con retino (stile pixel)
  const vgrad = (g, x, y, w, h, c0, c1, steps = 6) => {
    for (let i = 0; i < h; i++) {
      const f = i / Math.max(1, h - 1) * (steps - 1), k = Math.floor(f), fr = f - k, ca = shade2(c0, c1, k / (steps - 1)), cb = shade2(c0, c1, Math.min(1, (k + 1) / (steps - 1)));
      for (let xx = 0; xx < w; xx++) P(g, x + xx, y + i, BAYER[((y + i) % 4) * 4 + ((x + xx) % 4)] / 16 < fr ? cb : ca);
    }
  };
  const shade2 = (a, b, t) => { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(((A >> s) & 255) + (((B >> s) & 255) - ((A >> s) & 255)) * t); return '#' + [16, 8, 0].map((s) => m(s).toString(16).padStart(2, '0')).join(''); };
  const line = (g, x0, y0, x1, y1, c) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0; for (let i = 0; i <= n; i++) P(g, x0 + (x1 - x0) * i / Math.max(1, n), y0 + (y1 - y0) * i / Math.max(1, n), c); };
  const glow = (g, x, y, r, rgb, a, sy = 1) => { if (a <= 0.003 || !(r > 0.5)) return; g.save(); g.globalCompositeOperation = 'lighter'; g.translate(x, y); g.scale(1, sy); const gr = g.createRadialGradient(0, 0, 0, 0, 0, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(0.45, `rgba(${rgb},${a * 0.4})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.fillRect(-r, -r, r * 2, r * 2); g.restore(); };
  const cone = (g, x, y, w0, w1, h, rgb, a) => { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = gr; g.beginPath(); g.moveTo(x - w0 / 2, y); g.lineTo(x + w0 / 2, y); g.lineTo(x + w1 / 2, y + h); g.lineTo(x - w1 / 2, y + h); g.closePath(); g.fill(); g.restore(); };
  // carattere a pixel 3×5 (maiuscole, cifre, qualche segno)
  const FONT = { A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010', Z: '111001010100111',
    0: '111101101101111', 1: '010110010010111', 2: '110001010100111', 3: '110001010001110', 4: '101101111001001', 5: '111100110001110', 6: '011100110101010', 7: '111001010010010', 8: '010101010101010', 9: '010101011001110', ' ': '000000000000000', '.': '000000000000010', ',': '000000000010100', ':': '000010000010000', '!': '010010010000010', '?': '110001010000010', '-': '000000111000000', '/': '001001010100100', '€': '011100110100011', "'": '010010000000000', '%': '101001010100101', '+': '000010111010000', '&': '010101010101011' };
  const text = (g, s, x, y, c, sc = 1, sp = 1) => { let cx = x; for (const ch of String(s).toUpperCase()) { const f = FONT[ch] || FONT[' ']; for (let i = 0; i < 15; i++) if (f[i] === '1') R(g, cx + (i % 3) * sc, y + Math.floor(i / 3) * sc, sc, sc, c); cx += (3 + sp) * sc; } return cx - x; };
  const textW = (s, sc = 1, sp = 1) => String(s).length * (3 + sp) * sc - sp * sc;
  // insegna al neon: tubo chiaro, bordo colorato, alone; flick 0..1 (spento ogni tanto)
  const neon = (g, s, x, y, rgb, sc, on) => {
    const lit = on > 0.1, col = lit ? `rgb(${rgb})` : '#4a4458';
    if (lit) glow(g, x + textW(s, sc) / 2, y + sc * 2.5, textW(s, sc) * 0.7, rgb, 0.35 * on, 0.45);
    text(g, s, x + 1, y + 1, 'rgba(0,0,0,.5)', sc); text(g, s, x, y, col, sc);
    if (lit) { g.save(); g.globalAlpha = 0.45 * on; text(g, s, x, y, '#ffffff', sc); g.restore(); }   // anima chiara del tubo
  };

  // ---------------------------------------------------------------- pezzi d'arredo
  // pavimento in prospettiva: righe che si allargano verso chi guarda
  const floor = (g, y0, y1, c0, c1, checker, r) => {
    let y = y0, k = 0;
    while (y < y1) {
      const hh = 3 + Math.floor((y - y0) / 14), off = (k % 2) * 14;
      for (let x = -off; x < W; x += 28) { const n = (Math.floor((x + off) / 28) + k) % 2; R(g, x, y, 28, hh, checker ? (n ? c0 : c1) : (r() < 0.5 ? c0 : shade(c0, -0.05))); R(g, x, y, 1, hh, shade(c0, -0.3)); }
      R(g, 0, y, W, 1, shade(c1, -0.3)); y += hh; k++;
    }
  };
  // finestra sulla notte: cielo, palazzi lontani con le finestre, strada, lampione, e quello che passa
  const outside = (g, x, y, w, h, r, opt = {}) => {
    vgrad(g, x, y, w, h * 0.7, opt.sky0 || '#0b0d22', opt.sky1 || '#2a1d3e', 5);
    for (let b = 0; b < w; b += 10 + Math.floor(r() * 18)) { const bh = h * (0.25 + r() * 0.35), bw = 8 + Math.floor(r() * 16); R(g, x + b, y + h * 0.7 - bh, bw, bh, shade('#141428', r() * 0.15)); for (let k = 0; k < bw * bh / 30; k++) if (r() < 0.45) R(g, x + b + 1 + Math.floor(r() * (bw - 2)), y + h * 0.7 - bh + 2 + Math.floor(r() * (bh - 4)), 1, 2, ['#ffcf7a', '#9fd8ff', '#ffe9a8'][Math.floor(r() * 3)]); }
    R(g, x, y + h * 0.7, w, h * 0.3, opt.road || '#1a1c26'); R(g, x, y + h * 0.7, w, 1, '#3a3e52');
    for (let k = 0; k < w; k += 18) R(g, x + k, y + h * 0.86, 9, 1, '#5a5e6e');
  };
  // traffico fuori dalla finestra: le auto vere del gioco (gli stessi disegni della strada, con le ruote), più piccole
  // della tua perché passano sulla carreggiata dietro; una per corsia, in un senso e nell'altro, fari e fanali accesi
  const TRAF_IDS = ['panda', 'punto', 'polo', 'corsa', 'clio', 'p308', 'a3', 'taxi', 'doblo', 'van'];
  const traffic = (g, x, y, w, h, t, seed) => {
    const v = window.nightRun && window.nightRun.view2d; if (!v || !v.trafficSprite || typeof CARS === 'undefined') return;
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
    for (let k = 0; k < 2; k++) {
      const per = 7 + k * 4 + seed % 3, n = Math.floor((t + k * 3.3 + seed) / per), ph = ((t + k * 3.3 + seed) % per) / per, dir = k % 2 ? 1 : -1;
      const id = TRAF_IDS[(n * 7 + seed * 3 + k * 5) % TRAF_IDS.length]; if (!CARS[id] || !CARS[id].sprite) continue;
      let spr = null; try { spr = v.trafficSprite(id, 'orig', 1); } catch (e) { spr = null; }
      if (!spr || !spr.geo) continue;
      const G = spr.geo, tw = h * (k ? 0.42 : 0.5) * (CARS[id].sprite.w / 200), sc = tw / G.w, ch = spr.height * sc;
      const cx = dir > 0 ? x - tw + ph * (w + tw * 2) : x + w + tw - ph * (w + tw * 2), cy = y + h * (0.86 + k * 0.06);   // cy = asfalto sotto le ruote
      const top = cy - (G.wy + G.wr) * sc;
      g.save(); g.translate(Math.round(cx), Math.round(top)); if (dir < 0) g.scale(-1, 1);
      const left = -tw / 2; g.imageSmoothingEnabled = false;
      g.fillStyle = 'rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(0, (G.wy + G.wr) * sc, tw * 0.44, Math.max(0.5, sc * 3), 0, 0, Math.PI * 2); g.fill();
      g.drawImage(spr.hd || spr, left, 0, tw, ch);
      const wi = spr.wheelImg, ws = wi && wi.width ? wi.width * sc * G.scalaRuota : 0;
      for (const ax of G.ax) { const wx = left + ax * sc, wy = G.wy * sc; if (ws) g.drawImage(wi, wx - ws / 2, wy - ws / 2, ws, ws); else { R(g, wx - 3, wy - 3, 6, 6, '#111'); } }
      g.restore();
      glow(g, cx + dir * tw / 2, top + ch * 0.55, 22, '255,240,200', 0.4); glow(g, cx - dir * tw / 2, top + ch * 0.5, 9, '255,40,40', 0.45);
    }
    g.restore();
  };
  const rain = (g, x, y, w, h, t, a = 0.35) => { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = `rgba(170,190,230,${a})`; for (let k = 0; k < w * h / 260; k++) { const px = x + ((k * 53.7 + t * 40) % w), py = y + ((k * 91.3 + t * 260) % h); g.fillRect(px, py, 1, 4); } g.restore(); };
  // gocce sul vetro (ferme, con un riflesso)
  const drops = (g, x, y, w, h, r) => { for (let k = 0; k < w * h / 180; k++) { const px = x + Math.floor(r() * w), py = y + Math.floor(r() * h); P(g, px, py, 'rgba(200,220,255,.35)'); P(g, px, py + 1, 'rgba(20,30,60,.4)'); } };
  // telaio della finestra o della vetrina
  const frame = (g, x, y, w, h, c, cols = 1, rows = 1) => { R(g, x - 3, y - 3, w + 6, 3, c); R(g, x - 3, y + h, w + 6, 4, shade(c, -0.2)); R(g, x - 3, y, 3, h, c); R(g, x + w, y, 3, h, shade(c, -0.15)); for (let i = 1; i < cols; i++) R(g, x + w * i / cols - 1, y, 2, h, c); for (let i = 1; i < rows; i++) R(g, x, y + h * i / rows - 1, w, 2, c); R(g, x, y, w, 1, 'rgba(255,255,255,.12)'); };
  // orologio da parete con l'ora vera
  const clock = (g, x, y, rr, face, rim) => {
    g.fillStyle = rim; g.beginPath(); g.arc(x, y, rr + 2, 0, 7); g.fill(); g.fillStyle = face; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill();
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; P(g, x + Math.cos(a) * (rr - 2), y + Math.sin(a) * (rr - 2), '#333'); }
    const d = new Date(), hA = ((d.getHours() % 12) + d.getMinutes() / 60) / 12 * Math.PI * 2 - Math.PI / 2, mA = d.getMinutes() / 60 * Math.PI * 2 - Math.PI / 2, sA = d.getSeconds() / 60 * Math.PI * 2 - Math.PI / 2;
    line(g, x, y, x + Math.cos(hA) * rr * 0.5, y + Math.sin(hA) * rr * 0.5, '#111'); line(g, x, y, x + Math.cos(mA) * rr * 0.8, y + Math.sin(mA) * rr * 0.8, '#111'); line(g, x, y, x + Math.cos(sA) * rr * 0.85, y + Math.sin(sA) * rr * 0.85, '#c42a1a');
  };


  // ---------------------------------------------------------------- la tua auto (lo stesso disegno della strada, con le ruote)
  const carPic = (k) => {
    const v = window.nightRun && window.nightRun.view2d; if (!v || !v.carSprite) return null;
    try {
      const spr = v.carSprite(1); if (!spr || !spr.width) return null;
      const G = v.geo(), hd = spr.hd2 || spr.hd || spr, w = spr.width, h = spr.height;
      // assetto: la scocca scende (o sale) rispetto alle ruote, come sulla strada (G.low è in unità del disegno)
      const lowPx = Math.round((G.low || 0) * k), up = Math.max(0, -lowPx);
      const c = document.createElement('canvas'); c.width = Math.ceil(w * k) + 2; c.height = Math.ceil(Math.max(h, G.wy + G.wr) * k + up) + 2;   // il terreno resta alla base delle ruote: da bassa la scocca affonda un po' (come sulla strada)
      const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
      x.drawImage(hd, 0, up + lowPx, w * k, h * k);
      const wf = v.wheelFn(); for (const [i, ax] of G.ax.entries()) wf(x, ax * k, up + G.wy * k, k, 0.4 + i, 0, i === 0);   // ruote sopra, come sulla strada (cerchi nuovi visibili)
      c.spriteAuto = spr;
      return c;
    } catch (e) { return null; }
  };

  // ---------------------------------------------------------------- le scene: static(g, r, S) una volta sola; dyn(g, t, S) a ogni fotogramma
  // hot: zone toccabili { x, y, w, h, label, go } (go = testo d'inizio del titolo di una sezione del pannello, o 'top', o una funzione)
  const SCENE = {};

  // le scene di tutti i locali sono in interni_hd.js (in alta definizione); qui restano gli attrezzi comuni.
  // Le scene vecchie a densità semplice sono state tolte il 21/11/2026 (v0.77): sono nella storia di git.
  // l'auto in vetrina dell'Autosalone (il disegno del giocatore, con le ruote)
  const dealerCar = (S) => {
    const id = window.NightDealer && window.NightDealer.featured(); if (!id || id === S.fid) return;
    S.fid = id; S.feat = null;
    if (window.valigette && window.valigette.carPic) window.valigette.carPic(id, (c) => { if (S.fid === id) S.feat = c; });
  };
  // la carcassa in vendita allo sfascio: il disegno vero, ingiallito, con ruggine e un vetro rotto
  const junkCar = (S) => {
    const g = window.nightRun && window.nightRun.game; if (!g || !g.jkWreck || !g.inside) return;
    const n = Math.round((g.inside.x - VG_STOP0) / VG_STEP), W = g.jkWreck(n), id = W ? W.id : null;
    if (id === S.wid) return; S.wid = id; S.wreck = null;
    if (id && window.valigette && window.valigette.carPic) window.valigette.carPic(id, (c) => {
      if (S.wid !== id) return;
      const k = document.createElement('canvas'); k.width = c.width; k.height = c.height; const x = k.getContext('2d'); x.imageSmoothingEnabled = false;
      try { x.filter = 'sepia(0.75) saturate(0.55) brightness(0.62) contrast(1.15)'; } catch (e) { /* senza filtri */ }
      x.drawImage(c, 0, 0); x.filter = 'none';
      // ammaccature, ruggine, un vetro rotto
      x.globalCompositeOperation = 'source-atop';
      const rr = rng(c.width * 7 + c.height);
      for (let q = 0; q < 22; q++) { x.fillStyle = q % 3 ? 'rgba(110,50,20,.55)' : 'rgba(20,14,10,.6)'; x.fillRect(Math.floor(rr() * c.width), Math.floor(c.height * 0.25 + rr() * c.height * 0.6), 4 + Math.floor(rr() * 14), 2 + Math.floor(rr() * 6)); }
      x.fillStyle = 'rgba(10,8,6,.7)'; x.beginPath(); x.moveTo(c.width * 0.8, c.height * 0.3); x.lineTo(c.width, c.height * 0.45); x.lineTo(c.width * 0.95, c.height * 0.75); x.lineTo(c.width * 0.82, c.height * 0.6); x.fill();
      S.wreck = k;
    });
  };

  // ---------------------------------------------------------------- suoni d'ambiente (sintetizzati, molto bassi)
  const AMB = {
    start(kind) {
      try { this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
      const c = this.ctx; if (c.state !== 'running') c.resume();
      this.stop(); const out = c.createGain(); out.gain.value = 0; out.gain.linearRampToValueAtTime(0.11, c.currentTime + 0.8); out.connect(c.destination); this.out = out; this.nodes = [];
      const nb = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const noise = (type, f, q, gain) => { const s = c.createBufferSource(); s.buffer = nb; s.loop = true; const fl = c.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const g = c.createGain(); g.gain.value = gain; s.connect(fl); fl.connect(g); g.connect(out); s.start(); this.nodes.push(s); return g; };
      const hum = (f, gain) => { const o = c.createOscillator(); o.frequency.value = f; const g = c.createGain(); g.gain.value = gain; o.connect(g); g.connect(out); o.start(); this.nodes.push(o); };
      const tick = (fn, ms) => { this.timers.push(setInterval(() => { if (c.state === 'running') fn(c.currentTime); }, ms)); };
      this.timers = [];
      const blip = (f, dur, gain, type = 'sine') => { const o = c.createOscillator(), g = c.createGain(), t = c.currentTime; o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.02); };
      const hiss = (dur, gain, f = 3000) => { const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime; s.buffer = nb; fl.type = 'bandpass'; fl.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(gain, t + 0.1); g.gain.linearRampToValueAtTime(0.0001, t + dur); s.connect(fl); fl.connect(g); g.connect(out); s.start(t); s.stop(t + dur + 0.05); };
      if (kind === 'bar') { noise('bandpass', 500, 0.8, 0.5); noise('bandpass', 1200, 1.2, 0.18); tick(() => { if (Math.random() < 0.35) blip(2400 + Math.random() * 1600, 0.12, 0.25, 'triangle'); }, 900); tick(() => { if (Math.random() < 0.25) hiss(1.8, 0.35); }, 6000); }
      else if (kind === 'grill') { hum(100, 0.05); hum(50, 0.12); noise('bandpass', 700, 0.7, 0.18); tick(() => { if (Math.random() < 0.3) blip(1850, 0.09, 0.3, 'square'); }, 1600); }
      else if (kind === 'motel') { hum(60, 0.08); noise('lowpass', 300, 0.7, 0.22); noise('bandpass', 5000, 0.6, 0.06); tick(() => blip(2600, 0.02, 0.12, 'square'), 1000); }
      else if (kind === 'fuel') { hum(50, 0.14); hum(150, 0.03); noise('bandpass', 2400, 0.5, 0.04); tick(() => { if (Math.random() < 0.15) blip(1400, 0.1, 0.25, 'square'); }, 2500); }
      else if (kind === 'shop' || kind === 'niko') { noise('lowpass', 400, 0.7, 0.2); hum(kind === 'niko' ? 60 : 50, 0.05); tick(() => { if (Math.random() < 0.3) { for (let k = 0; k < 6; k++) setTimeout(() => blip(180 + Math.random() * 60, 0.05, 0.3, 'sawtooth'), k * 55); } if (Math.random() < 0.2) blip(3200 + Math.random() * 900, 0.3, 0.12, 'triangle'); }, 3000); tick(() => { if (Math.random() < 0.15) hiss(2.5, 0.25, 900); }, 7000); }
      else if (kind === 'dealer') { hum(55, 0.04); noise('lowpass', 600, 0.6, 0.12); noise('bandpass', 3000, 0.7, 0.02); tick(() => { if (Math.random() < 0.18) { blip(1320, 0.5, 0.18); setTimeout(() => blip(990, 0.7, 0.16), 260); } }, 5000); tick(() => { if (Math.random() < 0.25) for (let k = 0; k < 4; k++) setTimeout(() => blip(2600 + Math.random() * 400, 0.03, 0.06, 'square'), k * 90); }, 2300); }
      else if (kind === 'junk') { noise('lowpass', 250, 0.6, 0.2); hum(48, 0.03); tick(() => { if (Math.random() < 0.35) hiss(0.8 + Math.random(), 0.25, 5000); }, 2600); tick(() => { if (Math.random() < 0.12) { blip(180, 0.35, 0.25, 'square'); setTimeout(() => blip(140, 0.4, 0.2, 'square'), 220); } }, 7000); noise('bandpass', 900, 0.4, 0.05); }
      else if (kind === 'style') { tick((t0) => { blip(55, 0.22, 0.6); blip(110, 0.1, 0.15); }, 500); noise('bandpass', 4000, 0.8, 0.05); tick(() => { if (Math.random() < 0.4) hiss(1.2, 0.3, 6000); }, 4000); }
    },
    stop() { if (this.out) { const o = this.out, c = this.ctx; o.gain.cancelScheduledValues(c.currentTime); o.gain.setTargetAtTime(0, c.currentTime, 0.2); setTimeout(() => o.disconnect(), 900); } const c2 = this.ctx; for (const n of this.nodes || []) try { n.stop(c2 ? c2.currentTime + 0.9 : 0); } catch (e) { /* già fermo */ } for (const t of this.timers || []) clearInterval(t); this.out = null; this.nodes = []; this.timers = []; },
  };

  // ---------------------------------------------------------------- scena sullo schermo
  let cv = null, tag = null, cur = null, raf = 0, t0 = 0, alpha = 0, closing = false, hover = null;
  const off = document.createElement('canvas'); off.width = W; off.height = H; const og = off.getContext('2d');
  const bg = document.createElement('canvas'); bg.width = W; bg.height = H; const bgg = bg.getContext('2d');
  // densità della scena: 1 = pixel da 640×360 come sempre, 2 = doppia (1280×720, come la strada in qualità alta).
  // Le coordinate di disegno restano 640×360: con 2 si può disegnare a mezze unità. La sceglie la scena (ss).
  let SSc = 1;
  const setSS = (ss) => { if (SSc === ss) return; SSc = ss; off.width = bg.width = W * ss; off.height = bg.height = H * ss; };
  let fit = { s: 1, ox: 0, oy: 0 };
  function mount() {
    if (cv) return;
    const stage = document.getElementById('roadStage'); if (!stage) return;
    cv = document.createElement('canvas'); cv.id = 'interiorCv';
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:2;opacity:0;transition:opacity .45s;image-rendering:pixelated;cursor:default';
    const hud = stage.querySelector('.hud'); stage.insertBefore(cv, hud || null);
    tag = document.createElement('div'); tag.style.cssText = 'position:absolute;z-index:3;pointer-events:none;padding:4px 8px;font:600 12px/1 "Share Tech Mono",monospace;color:#0b0a08;background:#ffb347;box-shadow:0 0 0 2px #000;transform:translate(-50%,-140%) skewX(-8deg);opacity:0;transition:opacity .15s;white-space:nowrap';
    stage.appendChild(tag);
    cv.addEventListener('pointermove', (e) => { hover = hit(e); cv.style.cursor = hover ? 'pointer' : 'default'; showTag(e); });
    cv.addEventListener('pointerleave', () => { hover = null; tag.style.opacity = 0; });
    cv.addEventListener('click', (e) => { const h = hit(e); if (h) act(h); });
  }
  const local = (e) => { const b = cv.getBoundingClientRect(), dpr = cv.width / b.width; return { x: ((e.clientX - b.left) * dpr - fit.ox) / fit.s, y: ((e.clientY - b.top) * dpr - fit.oy) / fit.s, bx: e.clientX - b.left, by: e.clientY - b.top }; };
  const hit = (e) => { if (!cur) return null; const p = local(e); return (SCENE[cur.id].hot || []).find((h) => p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h) || null; };
  function showTag(e) { if (!hover) { tag.style.opacity = 0; return; } const p = local(e); tag.textContent = hover.label; tag.style.left = p.bx + 'px'; tag.style.top = p.by + 'px'; tag.style.opacity = 1; }
  function act(h) {
    if (typeof h.go === 'function') { h.go(); return; }
    if (h.go === 'close') { const g = window.nightRun && window.nightRun.game; if (g) g.exitPlace(); return; }
    const body = document.getElementById('placeBody'), box = document.getElementById('placeBox'); if (!body || !box) return;
    let el = null;
    if (h.go && h.go !== 'top') el = [...body.querySelectorAll('h4, h2, .hint')].find((n) => n.textContent.trim().startsWith(h.go));
    const target = el ? (el.closest('.vg-group') || el) : body.firstElementChild;
    if (target) { target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); target.animate && target.animate([{ boxShadow: '0 0 0 3px #ffb347' }, { boxShadow: '0 0 0 0 transparent' }], { duration: 900 }); }
  }
  // inquadratura: la scena copre la parte di schermo che il pannello del locale lascia libera (a sinistra sul computer,
  // in alto sul telefono) e si centra sul punto importante della scena (focus: chi ti serve, la tua auto)
  let lastKey = '', fitT = 0, fitDirty = true, fullT = 0, vela = false;
  function resize() {
    if (!cv) return; const b = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(2, Math.round(b.width * dpr)), h = Math.max(2, Math.round(b.height * dpr)); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    const pb = document.getElementById('placeBox'), pr = pb && !pb.hidden ? pb.getBoundingClientRect() : null;
    let vx = 0, vy = 0, vw = b.width, vh = b.height;
    if (pr && pr.width > 0) {
      if (pr.left - b.left > b.width * 0.3) vw = Math.max(b.width * 0.35, pr.left - b.left);            // pannello a destra
      else if (pr.top - b.top > b.height * 0.15) vh = Math.max(b.height * 0.25, pr.top - b.top);          // pannello in basso
    }
    vx *= dpr; vy *= dpr; vw *= dpr; vh *= dpr;
    const s = Math.max(vw / W, vh / H), fx = (cur && SCENE[cur.id].focus) || W / 2, fy = H * 0.55;
    let ox = vx + vw / 2 - fx * s, oy = vy + vh / 2 - fy * s;
    ox = Math.min(vx, Math.max(vx + vw - W * s, ox)); oy = Math.min(0, Math.max(Math.min(vy + vh, h) - H * s, oy));
    fit = { s, ox, oy };
  }
  const fitKey = () => { const pb = document.getElementById('placeBox'), r = pb && !pb.hidden ? pb.getBoundingClientRect() : null; const b = cv.getBoundingClientRect(); return [b.width, b.height, r ? Math.round(r.left) : -1, r ? Math.round(r.top) : -1].join(','); };
  function draw(now) {
    if (!cur) return;
    const t = (now - t0) / 1000, S = SCENE[cur.id];
    // misure della pagina 4 volte al secondo (e al cambio di finestra): leggerle a ogni fotogramma obbligava il browser a rifare l'impaginazione
    if (!(t - (fitT || 0) < 0.25) || fitDirty) { fitT = t; fitDirty = false; const k = fitKey(); if (k !== lastKey) { lastKey = k; resize(); } }
    alpha = closing ? Math.max(0, alpha - 0.06) : Math.min(1, alpha + 0.06);
    cv.style.opacity = vela ? '0' : String(alpha); cv.style.pointerEvents = vela || closing ? 'none' : 'auto';   // vela: rulli dal vivo, si vede la strada
    if (alpha >= 1 && !closing) { if (!fullT) fullT = performance.now(); } else fullT = 0;
    og.setTransform(SSc, 0, 0, SSc, 0, 0); og.globalCompositeOperation = 'source-over'; og.globalAlpha = 1; og.imageSmoothingEnabled = false;
    og.drawImage(bg, 0, 0, W, H);
    // la tua auto si ridisegna due volte al secondo: vernice, cerchi e pezzi provati o comprati si vedono subito
    if (cur.S.carK && t - (cur.S.carT || 0) > 0.5) { cur.S.carT = t; const c = carPic(cur.S.carK); if (c) cur.S.car = c; }
    S.dyn(og, t, cur.S);
    // zona toccabile sotto il puntatore: contorno che pulsa
    if (hover) { og.strokeStyle = `rgba(255,179,71,${0.5 + 0.4 * Math.sin(t * 6)})`; og.lineWidth = 2; og.setLineDash([4, 3]); og.strokeRect(hover.x + 1, hover.y + 1, hover.w - 2, hover.h - 2); og.setLineDash([]); }
    // tinta del locale e vignettatura
    og.fillStyle = `rgba(${S.grade},${S.gradeA})`; og.globalCompositeOperation = 'soft-light'; og.fillRect(0, 0, W, H); og.globalCompositeOperation = 'source-over';
    const vg = og.createRadialGradient(W * 0.4, H * 0.5, H * 0.35, W * 0.4, H * 0.5, W * 0.75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); og.fillStyle = vg; og.fillRect(0, 0, W, H);
    const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.fillStyle = '#000'; x.fillRect(0, 0, cv.width, cv.height);
    x.drawImage(off, Math.round(fit.ox), Math.round(fit.oy), Math.round(W * fit.s), Math.round(H * fit.s));
    if (closing && alpha <= 0) { stop(); return; }
    raf = requestAnimationFrame(draw);
  }
  function stop() { cancelAnimationFrame(raf); raf = 0; cur = null; fullT = 0; closing = false; if (cv) { cv.style.opacity = '0'; cv.style.pointerEvents = 'none'; } if (tag) tag.style.opacity = 0; }

  window.NightInterni = {
    SCENE,
    // gli attrezzi di disegno, per le scene scritte in altri file (interni_hd.js)
    kit: { W, H, rng, R, P, shade, shade2, glow, cone, text, textW, neon, carPic, traffic, rain, drops, frame, clock, outside, BAYER, dealerCar, junkCar },
    open(place) {
      const id = place && place.id; if (!SCENE[id]) return false;
      mount(); if (!cv) return false;
      if (cur && cur.id === id && !closing) return true;               // il pannello si ridisegna: la scena resta
      const S = {}; setSS(SCENE[id].ss || 1); bgg.setTransform(SSc, 0, 0, SSc, 0, 0); bgg.clearRect(0, 0, W, H); bgg.imageSmoothingEnabled = false; SCENE[id].static(bgg, rng(id.length * 977 + 13), S);
      cur = { id, S }; closing = false; t0 = performance.now(); fitDirty = true; cv.style.pointerEvents = 'auto'; resize();
      if (!raf) raf = requestAnimationFrame(draw);
      AMB.start(SCENE[id].amb);
      return true;
    },
    close() { if (!cur) return; closing = true; AMB.stop(); },
    get current() { return cur && cur.id; },
    // la scena copre tutta la strada (piena e non in dissolvenza): street2d.js non presenta la strada sotto (prestazioni)
    hide(on) { vela = !!on; if (cv) { cv.style.opacity = vela ? '0' : String(alpha); cv.style.pointerEvents = vela ? 'none' : 'auto'; } },
    get covers() { return !vela && !!(cur && !closing && alpha >= 1 && fullT && performance.now() - fullT > 700); },   // 0,7 s: la dissolvenza CSS (0,45 s) è finita
    // da coordinate della scena (640×360) a coordinate dello schermo (per le prove)
    point(x, y) { if (!cv) return null; const b = cv.getBoundingClientRect(), dpr = cv.width / b.width; return { x: b.left + (fit.ox + x * fit.s) / dpr, y: b.top + (fit.oy + y * fit.s) / dpr }; },
  };
  window.addEventListener('resize', () => { fitDirty = true; resize(); });
})();
