// ============================================================================
//  Night Run · Gli interni dei locali (dopo telefono.js)
//  Quando entri in un locale (bar, autogrill, motel, benzinaio, Da Luca Tuning, Officina Mario, Neon Kustom) sopra la
//  strada compare la scena dell'interno, in pixel art 640×360: chi ti serve dietro al bancone che si muove e sbatte gli
//  occhi, le luci (neon che tremano, lampade calde, tubi fluorescenti), le finestre con la notte fuori e il traffico che
//  passa, la tua auto vera (sul ponte da Luca, sopra la fossa da Mario, in cabina al Neon Kustom, alla pompa del
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
  const box = (g, x, y, w, h, c, ink = '#0a0a10') => { R(g, x - 1, y - 1, w + 2, h + 2, ink); R(g, x, y, w, h, c); R(g, x, y, w, 1, shade(c, 0.25)); R(g, x, y + h - 1, w, 1, shade(c, -0.35)); };
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
  const wood = (g, x, y, w, h, base, r, vertical) => {
    R(g, x, y, w, h, base);
    const pw = vertical ? 12 : 9;
    if (vertical) for (let xx = x; xx < x + w; xx += pw) { R(g, xx, y, 1, h, shade(base, -0.35)); for (let k = 0; k < h / 6; k++) R(g, xx + 2 + Math.floor(r() * (pw - 4)), y + Math.floor(r() * h), 1, 3 + Math.floor(r() * 6), shade(base, r() < 0.5 ? -0.15 : 0.1)); }
    else for (let yy = y; yy < y + h; yy += pw) { R(g, x, yy, w, 1, shade(base, -0.35)); for (let k = 0; k < w / 10; k++) R(g, x + Math.floor(r() * w), yy + 2 + Math.floor(r() * (pw - 3)), 4 + Math.floor(r() * 10), 1, shade(base, r() < 0.5 ? -0.14 : 0.1)); }
  };
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
      g.drawImage(spr.hd || spr, left, 0, tw, ch);
      const wi = spr.wheelImg, ws = wi && wi.width ? wi.width * sc : 0;
      for (const ax of G.ax) { const wx = left + ax * sc, wy = G.wy * sc; if (ws) g.drawImage(wi, wx - ws / 2, wy - ws / 2, ws, ws); else { R(g, wx - 3, wy - 3, 6, 6, '#111'); } }
      g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(left + 2, (G.wy + G.wr) * sc - 1, tw - 4, 2);   // ombra sotto
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
  // bottiglie su una mensola (con il bagliore del retro)
  const bottles = (g, x, y, w, r) => { for (let xx = x; xx < x + w - 6;) { const bw = 5 + Math.floor(r() * 4), bh = 14 + Math.floor(r() * 12), c = ['#2f7a3a', '#7a3a1a', '#c8a040', '#3a5a9a', '#9a2a3a', '#d8d0b0', '#5a2a6a'][Math.floor(r() * 7)];
    R(g, xx, y - bh, bw, bh, c); R(g, xx + Math.floor(bw / 2) - 1, y - bh - 5, 2, 5, c); R(g, xx + 1, y - bh + 2, 1, bh - 4, shade(c, 0.5)); R(g, xx, y - bh * 0.55, bw, 4, shade('#f0e8d0', -r() * 0.3)); xx += bw + 1 + Math.floor(r() * 3); } R(g, x, y, w, 3, '#3a2a1a'); R(g, x, y, w, 1, '#6a4a2a'); };

  // ---------------------------------------------------------------- persone (busto dietro al bancone, di fronte)
  // o: { skin, hair, hairStyle, shirt, vest, apron, overalls, hood, cap, glasses, mustache, beard, pose, s }
  // pose: 'wipe' (asciuga un bicchiere), 'type' (cassa), 'read' (giornale), 'arms' (braccia conserte), 'phone', 'tool', 'spray', 'lean'
  const person = (g, cx, base, o, t) => {
    const s = o.s || 1, sk = o.skin || '#d29a72', sh = o.shirt || '#e8e4d8', ink = '#0a0a10';
    const breathe = Math.sin(t * 1.6 + (o.seed || 0)) > 0.6 ? 1 : 0, look = Math.sin(t * 0.37 + (o.seed || 0)) * 2.2;
    const blink = ((t + (o.seed || 0)) % 4.3) < 0.13;
    const sw = 60 * s, top = base - 72 * s - breathe;
    // busto
    const bodyC = o.overalls || o.hood || sh;
    g.fillStyle = ink; g.beginPath(); g.moveTo(cx - sw / 2 - 1, base); g.lineTo(cx - sw / 2 + 4 * s, top + 26 * s); g.lineTo(cx + sw / 2 - 4 * s, top + 26 * s); g.lineTo(cx + sw / 2 + 1, base); g.fill();
    g.fillStyle = bodyC; g.beginPath(); g.moveTo(cx - sw / 2, base); g.lineTo(cx - sw / 2 + 5 * s, top + 27 * s); g.lineTo(cx + sw / 2 - 5 * s, top + 27 * s); g.lineTo(cx + sw / 2, base); g.fill();
    R(g, cx + sw * 0.18, top + 28 * s, sw * 0.28, base - top - 28 * s, shade(bodyC, -0.18));       // ombra a destra
    if (o.vest) { g.fillStyle = o.vest; g.beginPath(); g.moveTo(cx - sw / 2 + 2, base); g.lineTo(cx - sw / 2 + 7 * s, top + 28 * s); g.lineTo(cx - 6 * s, top + 28 * s); g.lineTo(cx - 2 * s, base); g.fill(); g.beginPath(); g.moveTo(cx + sw / 2 - 2, base); g.lineTo(cx + sw / 2 - 7 * s, top + 28 * s); g.lineTo(cx + 6 * s, top + 28 * s); g.lineTo(cx + 2 * s, base); g.fill(); for (let k = 0; k < 3; k++) R(g, cx - 4 * s, top + (38 + k * 9) * s, 2, 2, '#d8c070'); }
    if (o.apron) { R(g, cx - 16 * s, top + 40 * s, 32 * s, base - top - 40 * s, o.apron); R(g, cx - 16 * s, top + 40 * s, 32 * s, 2, shade(o.apron, 0.2)); line(g, cx - 14 * s, top + 40 * s, cx - 8 * s, top + 29 * s, o.apron); line(g, cx + 14 * s, top + 40 * s, cx + 8 * s, top + 29 * s, o.apron); }
    if (o.overalls) { R(g, cx - 13 * s, top + 34 * s, 26 * s, 12 * s, shade(o.overalls, 0.1)); R(g, cx - 10 * s, top + 36 * s, 8 * s, 6 * s, shade(o.overalls, -0.2)); R(g, cx - 18 * s, top + 28 * s, 4 * s, 10 * s, shade(o.overalls, -0.1)); R(g, cx + 14 * s, top + 28 * s, 4 * s, 10 * s, shade(o.overalls, -0.1)); R(g, cx - 18 * s, top + 36 * s, 3, 3, '#c8ccd4'); R(g, cx + 15 * s, top + 36 * s, 3, 3, '#c8ccd4'); if (o.rag) R(g, cx + 12 * s, top + 44 * s, 7 * s, 10 * s, '#c43a2a'); }
    if (o.logo) { R(g, cx - 18 * s, top + 34 * s, 10 * s, 6 * s, o.logo); }
    // colletto
    if (!o.hood) { g.fillStyle = shade(sh, 0.1); g.beginPath(); g.moveTo(cx - 9 * s, top + 26 * s); g.lineTo(cx, top + 34 * s); g.lineTo(cx + 9 * s, top + 26 * s); g.fill(); if (o.tie) { R(g, cx - 2 * s, top + 28 * s, 4 * s, 14 * s, o.tie); } }
    // collo e testa: testa arrotondata che si stringe alla mascella, luce da sinistra (tre toni), contorno scuro
    R(g, cx - 6 * s, top + 20 * s, 12 * s, 9 * s, shade(sk, -0.2)); R(g, cx - 6 * s, top + 20 * s, 12 * s, 3 * s, shade(sk, -0.32));
    const HW = Math.round(24 * s), HH = Math.round(26 * s), hx = Math.round(cx - HW / 2 + look * 0.4), hy = Math.round(top - 1 * s);
    const half = (yy) => { const f = yy / HH; let cut = 0; if (yy < 4) cut = [4, 2, 1, 0][yy]; else if (f > 0.68) cut = Math.round((f - 0.68) / 0.32 * 5 * s); return HW / 2 - cut; };
    if (o.hood) { R(g, hx - 5 * s, hy - 4 * s, HW + 10 * s, HH + 6 * s, ink); R(g, hx - 4 * s, hy - 3 * s, HW + 8 * s, HH + 4 * s, o.hood); R(g, hx - 4 * s, hy - 3 * s, HW + 8 * s, 2, shade(o.hood, 0.2)); }
    const mid = hx + HW / 2, skL = shade(sk, 0.08), skD = shade(sk, -0.16), skDD = shade(sk, -0.3);
    for (let yy = -1; yy <= HH; yy++) { const hw = half(Math.max(0, Math.min(HH - 1, yy))) + 1; R(g, mid - hw, hy + yy, hw * 2, 1, ink); }
    for (let yy = 0; yy < HH; yy++) {
      const hw = half(yy); R(g, mid - hw, hy + yy, hw * 2, 1, sk);
      R(g, mid + hw * 0.55, hy + yy, hw * 0.45, 1, skD); P(g, mid + hw * 0.55 - 1, hy + yy, shade(sk, -0.08));   // lato in ombra, con un pixel di passaggio
      if (yy > HH * 0.78) R(g, mid - hw, hy + yy, hw * 2, 1, yy > HH * 0.9 ? skDD : skD);   // sotto il mento
      if (yy > 3 && yy < HH * 0.45) R(g, mid - hw + 1, hy + yy, Math.max(1, hw * 0.35), 1, skL);   // fronte e guancia in luce
    }
    // orecchie
    R(g, hx - 2 * s, hy + 10 * s, 3 * s, 7 * s, ink); R(g, hx - 1.5 * s, hy + 10.5 * s, 2.5 * s, 6 * s, sk); R(g, hx - 0.5 * s, hy + 12 * s, 1, 3 * s, skDD);
    R(g, hx + HW - 1, hy + 10 * s, 3 * s, 7 * s, ink); R(g, hx + HW - 0.5, hy + 10.5 * s, 2.5 * s, 6 * s, skD);
    if (o.blush) { R(g, hx + 3 * s, hy + 16 * s, 4 * s, 2 * s, o.blush); R(g, hx + HW - 7 * s, hy + 16 * s, 4 * s, 2 * s, o.blush); }
    // capelli: volume sopra la testa, frangia irregolare, basette
    const hc = o.hair || '#2a1a10', hcL = shade(hc, 0.22), hcD = shade(hc, -0.3), st = o.hairStyle || 'short', fr = [0, 2, 1, 3, 1, 0, 2, 1, 3, 2, 0, 1];
    const fringe = (y0, depth) => { for (let xx = 0; xx < HW + 2; xx++) { const d = depth + fr[(xx + Math.round((o.seed || 0) * 7)) % fr.length] * s * 0.6; R(g, hx - 1 + xx, y0, 1, d, hc); } };
    if (st === 'short') { R(g, hx - 2, hy - 4 * s, HW + 4, 7 * s, ink); R(g, hx - 1, hy - 3 * s, HW + 2, 6 * s, hc); fringe(hy + 2 * s, 2 * s); R(g, hx - 1, hy, 3 * s, 10 * s, hc); R(g, hx + HW - 2 * s, hy, 3 * s, 9 * s, hcD); R(g, hx + 3 * s, hy - 3 * s, HW * 0.4, 1, hcL); }
    else if (st === 'bald') { R(g, hx - 1, hy + 7 * s, 3 * s, 7 * s, hc); R(g, hx + HW - 2 * s, hy + 7 * s, 3 * s, 7 * s, hcD); R(g, hx + 5 * s, hy + 2, 7 * s, 2, shade(sk, 0.35)); }
    else if (st === 'long') { R(g, hx - 4 * s, hy - 4 * s, HW + 8 * s, 8 * s, ink); R(g, hx - 3 * s, hy - 3 * s, HW + 6 * s, 7 * s, hc); fringe(hy + 3 * s, 1 * s); R(g, hx - 4 * s, hy, 6 * s, 32 * s, hc); R(g, hx + HW - 2 * s, hy, 6 * s, 32 * s, hcD); R(g, hx - 3 * s, hy + 2 * s, 1, 26 * s, hcL); R(g, hx + 2 * s, hy - 2 * s, HW * 0.5, 1, hcL); }
    else if (st === 'bun') { R(g, hx + 6 * s, hy - 10 * s, 12 * s, 8 * s, ink); R(g, hx + 7 * s, hy - 9 * s, 10 * s, 6 * s, hc); R(g, hx + 8 * s, hy - 9 * s, 4 * s, 1, hcL); R(g, hx - 2, hy - 4 * s, HW + 4, 8 * s, ink); R(g, hx - 1, hy - 3 * s, HW + 2, 7 * s, hc); fringe(hy + 3 * s, 1 * s); R(g, hx - 1, hy, 3 * s, 11 * s, hc); R(g, hx + HW - 2 * s, hy, 3 * s, 11 * s, hcD); R(g, hx + 3 * s, hy - 2 * s, HW * 0.4, 1, hcL); }
    if (o.cap) { R(g, hx - 3, hy - 5 * s, HW + 6, 9 * s, ink); R(g, hx - 2, hy - 4 * s, HW + 4, 8 * s, o.cap); R(g, hx - 2, hy - 4 * s, HW + 4, 2, shade(o.cap, 0.25)); if (o.capBack) R(g, hx + HW - 6 * s, hy + 1 * s, 10 * s, 3 * s, shade(o.cap, -0.2)); else { R(g, hx - 5 * s, hy + 3 * s, 22 * s, 3 * s, ink); R(g, hx - 4 * s, hy + 3 * s, 21 * s, 2 * s, shade(o.cap, -0.25)); } if (o.capText) text(g, o.capText, hx + 4 * s, hy - 2 * s, '#fff', 1); }
    if (o.beanie) { R(g, hx - 3, hy - 7 * s, HW + 6, 12 * s, ink); R(g, hx - 2, hy - 6 * s, HW + 4, 10 * s, o.beanie); for (let k = 0; k < HW + 4; k += 3) R(g, hx - 1 + k, hy - 6 * s, 1, 10 * s, shade(o.beanie, -0.2)); R(g, hx - 2, hy + 2 * s, HW + 4, 3 * s, shade(o.beanie, 0.15)); }
    // occhi (bianco, iride, riflesso, palpebra), sopracciglia, naso con la luce, bocca con le labbra
    const ey = Math.round(hy + 11 * s), ex1 = Math.round(hx + 5 * s + look * 0.6), ex2 = Math.round(hx + 14 * s + look * 0.6), es = Math.max(3, Math.round(4 * s)), eh = Math.max(2, Math.round(3 * s));
    if (blink) { R(g, ex1, ey + 1, es, 1, skDD); R(g, ex2, ey + 1, es, 1, skDD); }
    else for (const ex of [ex1, ex2]) { R(g, ex, ey, es, eh, '#f4f1e6'); const ix = Math.round(ex + es / 2 - 1 + look * 0.3); R(g, ix, ey, Math.max(2, Math.round(2 * s)), eh, o.eyes || '#3a2414'); R(g, ix, ey + eh - 1, Math.max(2, Math.round(2 * s)), 1, '#140a06'); P(g, ix, ey, '#ffffff'); R(g, ex, ey - 1, es, 1, skDD); }
    const bc = o.brows || shade(hc, -0.05); R(g, ex1 - 1, ey - 3 * s, es + 1, Math.max(1, Math.round(s)), bc); R(g, ex2, ey - 3 * s, es + 1, Math.max(1, Math.round(s)), bc); P(g, ex1 - 1, ey - 3 * s + 1, bc);
    const nx = Math.round(hx + 11 * s + look * 0.5); R(g, nx + 2 * s, ey + 2 * s, Math.max(1, s), 5 * s, skD); R(g, nx, ey + 6 * s, 4 * s, Math.max(1, s), skDD); P(g, nx + 1, ey + 3 * s, skL);
    if (o.mustache) { R(g, hx + 7 * s + look * 0.5, ey + 8.5 * s, 11 * s, 2 * s + 1, o.mustache); R(g, hx + 7 * s + look * 0.5, ey + 8.5 * s, 11 * s, 1, shade(o.mustache, 0.2)); }
    if (o.beard) { R(g, hx, hy + 16 * s, HW, 9 * s, o.beard); R(g, hx + 1, hy + 16 * s, 2, 9 * s, shade(o.beard, 0.15)); R(g, hx + 8 * s, hy + 18 * s, 8 * s, 2 * s, '#5a2a24'); }
    else if (o.mustache) { const mx = Math.round(hx + 9 * s + look * 0.5), my = Math.round(ey + 11.5 * s); R(g, mx + 1, my, 5 * s, 1, o.lips || shade(sk, -0.28)); }
    else { const mx = Math.round(hx + 8 * s + look * 0.5), my = Math.round(ey + 11 * s); R(g, mx + 1, my, 6 * s, 1, '#6a2a24'); R(g, mx + 2, my + 1, 4 * s, 1, o.lips || shade(sk, -0.25)); P(g, mx, my - 1, skDD); P(g, mx + 6 * s + 1, my - 1, skDD); }
    if (o.glasses) { g.strokeStyle = '#1a1a1a'; g.lineWidth = 1; g.strokeRect(ex1 - 1.5, ey - 1.5, es + 2, eh + 2); g.strokeRect(ex2 - 1.5, ey - 1.5, es + 2, eh + 2); line(g, ex1 + es, ey, ex2 - 1, ey, '#1a1a1a'); P(g, ex1, ey - 1, 'rgba(255,255,255,.6)'); }
    if (o.headphones) { R(g, hx - 5 * s, hy + 6 * s, 6 * s, 10 * s, '#14141c'); R(g, hx + HW - 1 * s, hy + 6 * s, 6 * s, 10 * s, '#14141c'); R(g, hx - 3 * s, hy - 5 * s, HW + 6 * s, 3 * s, '#14141c'); R(g, hx - 4 * s, hy + 8 * s, 4 * s, 6 * s, o.hpCol || '#ff2e88'); }
    // braccia e quello che hanno in mano
    const arm = (x0, y0, x1, y1, c) => {
      const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0))), w = Math.round(8 * s), cD = shade(c, -0.22), cL = shade(c, 0.12);
      for (const pass of [0, 1]) for (let i = 0; i <= n; i++) { const px = Math.round(x0 + (x1 - x0) * i / n - w / 2), py = Math.round(y0 + (y1 - y0) * i / n - w / 2);
        if (pass === 0) R(g, px - 1, py - 1, w + 2, w + 2, ink); else { R(g, px, py, w, w, c); R(g, px, py + w - 2, w, 2, cD); R(g, px + 1, py, w - 2, 1, cL); } }
      // piega del gomito e polsino
      R(g, Math.round(x1 - w / 2), Math.round(y1 - w / 2) - 1, w, 2, shade(c, -0.35));
    };
    const hand = (x, y) => { x = Math.round(x); y = Math.round(y); const hw = Math.round(7 * s), hh = Math.round(6 * s);
      R(g, x - hw / 2 - 1, y - hh / 2 - 1, hw + 2, hh + 2, ink); R(g, x - hw / 2, y - hh / 2, hw, hh, sk); R(g, x - hw / 2, y + hh / 2 - 2, hw, 2, shade(sk, -0.18));
      for (let k = 1; k < 4; k++) R(g, x - hw / 2 + Math.round(k * hw / 4), y - hh / 2 + 1, 1, hh - 2, shade(sk, -0.2));    // dita
      R(g, x - hw / 2, y - hh / 2, hw, 1, shade(sk, 0.15)); };
    const sleeve = o.sleeve || bodyC, L = cx - sw / 2 + 6 * s, Rr = cx + sw / 2 - 6 * s, sy = top + 32 * s, pose = o.pose || 'arms';
    if (pose === 'wipe') {
      const a = t * 3.2, gx = cx + 4 * s + Math.cos(a) * 3 * s, gy = top + 60 * s + Math.sin(a) * 2 * s;
      arm(Rr, sy, gx + 4 * s, gy + 4 * s, sleeve); arm(L, sy, gx - 6 * s, gy + 6 * s, sleeve);
      R(g, gx - 5 * s, gy - 10 * s, 10 * s, 14 * s, 'rgba(210,230,255,.55)'); R(g, gx - 5 * s, gy - 10 * s, 10 * s, 1, 'rgba(255,255,255,.8)'); R(g, gx - 3 * s, gy - 8 * s, 2, 10 * s, 'rgba(255,255,255,.6)');
      R(g, gx - 7 * s, gy - 2 * s, 14 * s, 8 * s, '#f0ece0'); hand(gx + 4 * s, gy + 4 * s); hand(gx - 6 * s, gy + 6 * s);
    } else if (pose === 'type') {
      const b = Math.sin(t * 9) > 0 ? 1 : 0, b2 = Math.sin(t * 9 + 1.7) > 0 ? 1 : 0;
      arm(L, sy, cx - 12 * s, base - 4 * s - b, sleeve); arm(Rr, sy, cx + 14 * s, base - 4 * s - b2, sleeve); hand(cx - 12 * s, base - 4 * s - b); hand(cx + 14 * s, base - 4 * s - b2);
    } else if (pose === 'read') {
      arm(L, sy, cx - 14 * s, base - 12 * s, sleeve); arm(Rr, sy, cx + 16 * s, base - 12 * s, sleeve);
      R(g, cx - 26 * s, base - 30 * s, 52 * s, 26 * s, '#e8e2cc'); R(g, cx - 26 * s, base - 30 * s, 52 * s, 1, '#fff'); R(g, cx - 1, base - 30 * s, 2, 26 * s, '#c8c0a8');
      for (let k = 0; k < 6; k++) { R(g, cx - 22 * s, base - 26 * s + k * 4 * s, 18 * s, 1, '#8a8478'); R(g, cx + 4 * s, base - 26 * s + k * 4 * s, 18 * s, 1, '#8a8478'); } text(g, 'GAZZETTA', cx - 22 * s, base - 29 * s, '#c43a6a', 1);
      hand(cx - 24 * s, base - 16 * s); hand(cx + 24 * s, base - 16 * s);
    } else if (pose === 'phone') {
      const px = hx + 26 * s, py = hy + 12 * s;
      arm(Rr, sy, px, py + 8 * s, sleeve); arm(L, sy, cx - 6 * s, base - 8 * s, sleeve); R(g, px - 3 * s, py - 6 * s, 6 * s, 12 * s, '#14141c'); hand(px, py + 6 * s); hand(cx - 6 * s, base - 8 * s);
      if (Math.sin(t * 0.8) > 0.5) glow(g, px, py, 10, '160,210,255', 0.25);
    } else if (pose === 'tool') {
      const a = Math.sin(t * 2.2) * 0.25, tx = cx + 26 * s, ty = top + 52 * s;
      arm(Rr, sy, tx, ty, sleeve); arm(L, sy, cx - 12 * s, base - 6 * s, sleeve); hand(cx - 12 * s, base - 6 * s);
      g.save(); g.translate(tx, ty); g.rotate(-0.9 + a); R(g, -2 * s, -26 * s, 4 * s, 24 * s, '#9aa3b2'); R(g, -5 * s, -32 * s, 10 * s, 7 * s, '#9aa3b2'); R(g, -2 * s, -32 * s, 4 * s, 4 * s, '#2a2d34'); R(g, -1, -26 * s, 1, 22 * s, '#d8dde6'); g.restore(); hand(tx, ty);
    } else if (pose === 'spray') {
      const px = cx + 30 * s + Math.sin(t * 2) * 6 * s, py = top + 48 * s + Math.cos(t * 2.3) * 3 * s;
      arm(Rr, sy, px, py, sleeve); arm(L, sy, cx - 10 * s, base - 6 * s, sleeve); R(g, px - 4 * s, py - 8 * s, 8 * s, 10 * s, '#c8ccd4'); R(g, px + 3 * s, py - 6 * s, 6 * s, 2 * s, '#5a5e6e'); hand(px, py); hand(cx - 10 * s, base - 6 * s);
      g.save(); g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 14; k++) { const d = ((t * 60 + k * 9) % 40); g.fillStyle = `rgba(${o.sprayRgb || '255,46,136'},${0.5 * (1 - d / 40)})`; g.fillRect(px + 9 * s + d, py - 6 * s + Math.sin(k * 1.7 + t * 5) * d * 0.25, 2, 2); } g.restore();
    } else if (pose === 'lean') {
      arm(L, sy, cx - 22 * s, base - 4 * s, sleeve); arm(Rr, sy, cx + 22 * s, base - 4 * s, sleeve); hand(cx - 22 * s, base - 4 * s); hand(cx + 22 * s, base - 4 * s);
    } else {   // braccia conserte
      arm(L, sy, cx + 10 * s, top + 52 * s, sleeve); arm(Rr, sy, cx - 10 * s, top + 54 * s, sleeve); R(g, cx - 16 * s, top + 48 * s, 32 * s, 9 * s, sleeve); R(g, cx - 16 * s, top + 48 * s, 32 * s, 1, shade(sleeve, 0.2)); hand(cx + 14 * s, top + 52 * s); hand(cx - 14 * s, top + 54 * s);
    }
  };

  // ---------------------------------------------------------------- la tua auto (lo stesso disegno della strada, con le ruote)
  const carPic = (k) => {
    const v = window.nightRun && window.nightRun.view2d; if (!v || !v.carSprite) return null;
    try {
      const spr = v.carSprite(1); if (!spr || !spr.width) return null;
      const G = v.geo(), hd = spr.hd || spr, w = spr.width, h = spr.height;
      const c = document.createElement('canvas'); c.width = Math.ceil(w * k) + 2; c.height = Math.ceil(Math.max(h, (G.wy + G.wr)) * k) + 2;
      const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
      x.drawImage(hd, 0, 0, w * k, h * k);
      const wf = v.wheelFn(); for (const [i, ax] of G.ax.entries()) wf(x, ax * k, G.wy * k, k, 0.4 + i, 0, i === 0);   // ruote sopra, come sulla strada (cerchi nuovi visibili)
      return c;
    } catch (e) { return null; }
  };

  // ---------------------------------------------------------------- le scene: static(g, r, S) una volta sola; dyn(g, t, S) a ogni fotogramma
  // hot: zone toccabili { x, y, w, h, label, go } (go = testo d'inizio del titolo di una sezione del pannello, o 'top', o una funzione)
  const SCENE = {};

  // ---- BAR: bancone di legno, macchina del caffè, bottiglie illuminate, barista che asciuga i bicchieri, vetrina sulla strada
  SCENE.bar = {
    focus: 200, amb: 'bar', grade: '255,170,90', gradeA: 0.06,
    static(g, r, S) {
      // parete: boiserie in basso, carta da parati a righe sopra
      for (let x = 0; x < W; x += 8) R(g, x, 0, 8, 150, (x / 8) % 2 ? '#3e2a22' : '#45302a');
      for (let x = 4; x < W; x += 16) for (let y = 6; y < 150; y += 14) P(g, x, y, '#5a4034');
      wood(g, 0, 150, W, 70, '#4a2c18', r, true); R(g, 0, 148, W, 4, '#2a1a10'); R(g, 0, 148, W, 1, '#7a5030');
      // vetrina a sinistra sulla strada (con l'auto parcheggiata)
      outside(g, 18, 34, 170, 132, r, { sky0: '#070818', sky1: '#241634' });
      S.carK = 0.62; S.car = carPic(0.62);
      // specchio e mensole delle bottiglie a destra del barista
      R(g, 300, 22, 320, 118, '#1a1418'); R(g, 300, 22, 320, 118, 'rgba(120,140,180,.12)');
      for (let k = 0; k < 3; k++) bottles(g, 306, 60 + k * 36, 304, r);
      // macchina del caffè (cromata) sul retro banco
      box(g, 206, 132, 86, 52, '#b8bec8'); R(g, 210, 136, 78, 6, '#e8ecf2'); R(g, 214, 146, 70, 2, '#7a8290'); for (let k = 0; k < 3; k++) { box(g, 216 + k * 24, 160, 10, 8, '#3a3e46'); R(g, 219 + k * 24, 168, 4, 6, '#2a2d34'); }
      text(g, 'ESPRESSO', 222, 150, '#7a1a1a', 1); for (let k = 0; k < 6; k++) { R(g, 212 + k * 12, 124, 8, 8, '#f4f1e6'); R(g, 212 + k * 12, 124, 8, 1, '#fff'); R(g, 219 + k * 12, 126, 2, 3, '#e8e4d8'); }
      // la bacheca di sughero coi lavori: foglietti appuntati, una foto, il primo lavoro col bordo verde
      box(g, 200, 26, 92, 84, '#5a3a1e'); R(g, 204, 30, 84, 76, '#b88a52'); for (let k = 0; k < 140; k++) P(g, 204 + Math.floor(r() * 84), 30 + Math.floor(r() * 76), r() < 0.5 ? '#a07440' : '#c89a62');
      const notes = [[208, 36, 26, 20, '#f4f1e6'], [238, 34, 22, 26, '#ffe9a8'], [264, 38, 20, 18, '#f4f1e6'], [212, 62, 30, 22, '#cfe8ff'], [246, 64, 20, 18, '#f4f1e6'], [270, 60, 14, 22, '#ffd0d8'], [220, 86, 24, 16, '#f4f1e6'], [250, 86, 30, 16, '#ffe9a8']];
      for (const [x, y, w, h, c] of notes) { R(g, x + 1, y + 1, w, h, 'rgba(0,0,0,.3)'); R(g, x, y, w, h, c); for (let yy = y + 5; yy < y + h - 2; yy += 3) R(g, x + 2, yy, w - 4 - Math.floor(r() * 6), 1, '#8a8478'); R(g, x + w / 2 - 1, y + 1, 2, 2, ['#c42a1a', '#2a6ad8', '#2a9a4a'][Math.floor(r() * 3)]); }
      R(g, 237, 33, 24, 28, 'rgba(0,0,0,0)'); g.strokeStyle = '#4ade80'; g.lineWidth = 1; g.strokeRect(237.5, 33.5, 23, 27);
      text(g, 'BACHECA', 218, 18, '#e8d8a0', 1);
      for (let k = 0; k < 10; k++) R(g, 270 + k * 4, 22 + (k % 2) * 2, 4, 26, k % 2 ? '#1a3a9a' : '#f4f1e6');
      // tv in alto a destra (partita)
      box(g, 560, 6, 70, 46, '#1a1a1e'); R(g, 564, 10, 62, 36, '#2a7a3a');
      // mobile del retro banco: ante di legno, piano scuro, piccolo frigo delle bibite con l'oblò
      R(g, 0, 184, W, 4, '#2a1608'); wood(g, 0, 188, W, 62, '#3a2210', r, true);
      for (let x = 8; x < W; x += 64) { box(g, x, 194, 56, 48, '#4a2a14'); R(g, x + 26, 214, 4, 8, '#c8a040'); }
      box(g, 420, 192, 70, 52, '#1a2a3a'); R(g, 424, 196, 62, 44, '#2a4a6a'); for (let k = 0; k < 3; k++) R(g, 426, 202 + k * 12, 58, 2, '#8aa8c8');
      // il bancone: piano di marmo e fronte di legno
      R(g, 0, 248, W, 10, '#e8e4dc'); R(g, 0, 248, W, 2, '#ffffff'); for (let k = 0; k < 40; k++) R(g, Math.floor(r() * W), 249 + Math.floor(r() * 8), 6 + Math.floor(r() * 18), 1, '#c8c4bc');
      wood(g, 0, 258, W, 102, '#5a3418', r, true); R(g, 0, 258, W, 4, '#2a1608'); for (let x = 20; x < W; x += 120) { box(g, x, 276, 96, 64, '#6a3e1e'); R(g, x + 6, 282, 84, 52, '#5a3418'); }
      R(g, 0, 352, W, 8, '#b8a070'); R(g, 0, 352, W, 1, '#e8d8a0');   // poggiapiedi d'ottone
      // tazzina e zuccheriera sul bancone, il giornale piegato
      box(g, 382, 238, 14, 9, '#f4f1e6'); R(g, 383, 236, 12, 3, '#3a1a08'); R(g, 396, 240, 3, 4, '#f4f1e6'); R(g, 376, 246, 28, 2, '#e8e4dc');
      box(g, 430, 232, 14, 16, 'rgba(220,230,240,.6)'); R(g, 430, 240, 14, 8, '#f4f1e6');
    },
    dyn(g, t, S) {
      const r = rng(1);
      // fuori: pioggia, traffico, la tua auto sotto il lampione
      g.save(); g.beginPath(); g.rect(18, 34, 170, 132); g.clip();
      traffic(g, 18, 34, 170, 132, t, 2);
      if (S.car) g.drawImage(S.car, 38, 166 - S.car.height + 10);
      R(g, 150, 70, 3, 96, '#2a2d38'); R(g, 140, 68, 18, 4, '#3a3e4a'); glow(g, 150, 74, 46, '255,207,122', 0.5); cone(g, 150, 74, 10, 70, 92, '255,207,122', 0.18);
      rain(g, 18, 34, 170, 132, t, 0.3);
      g.restore();
      drops(g, 18, 34, 170, 132, rng(5)); frame(g, 18, 34, 170, 132, '#3a2416', 2, 1);
      // insegna al neon appesa dentro la vetrina, rivolta verso chi entra
      const fl = Math.sin(t * 13) * Math.sin(t * 7.1) > 0.85 ? 0.2 : 1;
      R(g, 106, 38, 1, 8, '#1a1a1a'); R(g, 150, 38, 1, 8, '#1a1a1a'); neon(g, 'BAR', 104, 46, '255,90,60', 4, fl);
      // tv: partita (campo, giocatori che si muovono, sfarfallio)
      R(g, 564, 10, 62, 36, '#2a7a3a'); R(g, 564, 27, 62, 1, '#e8f0e8'); for (let k = 0; k < 6; k++) { const px = 566 + ((k * 13 + t * (k % 2 ? 9 : -7)) % 58 + 58) % 58; R(g, px, 14 + (k * 7) % 26, 2, 3, k % 2 ? '#c43a2a' : '#f4f1e6'); }
      R(g, 564, 10, 62, 36, `rgba(255,255,255,${0.04 + 0.04 * Math.sin(t * 20)})`); glow(g, 595, 40, 50, '120,220,140', 0.12);
      // la barista dietro al bancone
      person(g, 150, 248, { skin: '#e0a882', hair: '#2a1a10', hairStyle: 'short', shirt: '#f4f1e6', vest: '#1a1a22', mustache: '#2a1a10', pose: 'wipe', s: 1.25, seed: 1.3 }, t);
      // vapore dalla lancia della macchina del caffè (a sbuffi)
      if ((t % 6) < 2.2) for (let k = 0; k < 6; k++) { const d = ((t * 22 + k * 7) % 30); g.fillStyle = `rgba(230,230,240,${0.35 * (1 - d / 30)})`; g.fillRect(270 + Math.sin(k + t) * 3, 166 - d, 3 + d / 8, 3 + d / 8); }
      // vapore dalla tazzina
      for (let k = 0; k < 3; k++) { const d = ((t * 8 + k * 6) % 18); g.fillStyle = `rgba(240,240,240,${0.3 * (1 - d / 18)})`; g.fillRect(388 + Math.sin(t * 2 + k) * 2, 234 - d, 2, 2); }
      // ventilatore al soffitto
      const fa = t * 7; R(g, 380, 0, 2, 8, '#2a2a2a'); for (let k = 0; k < 3; k++) { const a = fa + k * 2.094; line(g, 381, 9, 381 + Math.cos(a) * 34, 9 + Math.sin(a) * 4, '#3a2a20'); } R(g, 377, 7, 9, 5, '#5a4a3a');
      // luci: lampade a sospensione calde sul bancone
      for (const lx of [90, 300, 470]) { R(g, lx, 0, 1, 40, '#1a1a1a'); g.fillStyle = '#2a2a30'; g.beginPath(); g.moveTo(lx - 14, 50); g.lineTo(lx + 15, 50); g.lineTo(lx + 6, 40); g.lineTo(lx - 5, 40); g.fill(); glow(g, lx, 52, 70, '255,190,110', 0.42, 0.7); cone(g, lx, 50, 26, 130, 200, '255,190,110', 0.09); }
      glow(g, 460, 100, 160, '255,120,60', 0.08);   // bagliore delle bottiglie
    },
    hot: [{ x: 200, y: 22, w: 92, h: 90, label: 'Bacheca dei lavori', go: 'Bacheca' }, { x: 0, y: 236, w: 640, h: 30, label: 'Bancone', go: 'Al bancone' }, { x: 200, y: 120, w: 96, h: 66, label: 'Caffè', go: 'Al bancone' }, { x: 18, y: 34, w: 170, h: 132, label: 'La tua auto', go: 'close' }],
  };

  // ---- AUTOGRILL "Sosta 24": tubi fluorescenti, market, banco del caldo, cassiera, vetrata sull'autostrada e le pompe
  SCENE.grill = {
    focus: 230, amb: 'grill', grade: '200,255,230', gradeA: 0.04,
    static(g, r, S) {
      R(g, 0, 0, W, 40, '#d8dcd4'); for (let x = 0; x < W; x += 32) R(g, x, 0, 1, 40, '#b8bcb4');   // controsoffitto
      R(g, 0, 40, W, 180, '#e8e4cc'); R(g, 0, 150, W, 70, '#c84a1a'); R(g, 0, 150, W, 4, '#ffb000');   // parete bianca, fascia arancione Sosta 24
      // vetrata sull'autostrada (in alto a sinistra)
      outside(g, 14, 52, 230, 92, r, { sky0: '#05060f', sky1: '#141a30', road: '#20222c' });
      S.carK = 0.45; S.car = carPic(0.45);
      // insegna
      box(g, 270, 50, 150, 40, '#c84a1a'); text(g, 'SOSTA 24', 282, 58, '#ffffff', 4);
      // scaffali del market (destra): pacchi colorati
      for (let k = 0; k < 4; k++) { const y = 100 + k * 30; R(g, 440, y + 22, 190, 4, '#8a8f9e'); for (let x = 444; x < 626;) { const w = 7 + Math.floor(r() * 8), h = 10 + Math.floor(r() * 10), c = ['#c42a1a', '#ffd23f', '#2a6ad8', '#2a9a4a', '#ff7a3a', '#f4f1e6', '#7a2ad8'][Math.floor(r() * 7)]; box(g, x, y + 22 - h, w, h, c); R(g, x + 1, y + 22 - h + 3, w - 2, 2, shade(c, 0.5)); x += w + 2; } }
      R(g, 440, 96, 190, 4, '#5a5e6e'); text(g, 'MARKET', 500, 86, '#2a2a2a', 2);
      // banco del caldo (vetrina riscaldata coi vassoi)
      floor(g, 220, 250, '#e8e4dc', '#c8c4bc', true, r);
      // bancone della cassa in primo piano
      R(g, 0, 246, W, 8, '#3a3e48'); R(g, 0, 246, W, 1, '#8a8f9e'); R(g, 0, 254, W, 106, '#c84a1a'); for (let x = 0; x < W; x += 4) R(g, x, 254, 1, 106, 'rgba(0,0,0,.08)'); R(g, 0, 300, W, 6, '#ffb000');
      text(g, 'CASSA', 40, 318, '#ffffff', 3);
      // registratore di cassa
      box(g, 150, 214, 60, 32, '#2a2d34'); R(g, 156, 218, 48, 12, '#0a2a1a'); for (let k = 0; k < 12; k++) R(g, 156 + (k % 4) * 12, 232 + Math.floor(k / 4) * 4, 9, 3, '#5a5e6e');
      // espositore di caramelle e gratta e vinci
      box(g, 230, 222, 60, 24, '#f4f1e6'); for (let k = 0; k < 10; k++) R(g, 233 + k * 6, 226, 4, 16, ['#ff2e88', '#2ee6ff', '#ffd23f', '#b8ff3a'][k % 4]);
      box(g, 310, 196, 110, 50, '#1a1c22'); R(g, 314, 200, 102, 40, 'rgba(255,190,120,.3)');   // vetrina del caldo
      for (let k = 0; k < 4; k++) { R(g, 318 + k * 25, 222, 22, 14, '#c8ccd4'); R(g, 320 + k * 25, 220, 18, 8, ['#c87a2a', '#e8c84a', '#7a3a1a', '#c84a2a'][k]); }
      text(g, 'PANINI CALDI', 320, 204, '#ffe9a8', 1);
    },
    dyn(g, t, S) {
      // fuori: l'autostrada, le pompe sotto la pensilina, la tua auto
      g.save(); g.beginPath(); g.rect(14, 52, 230, 92); g.clip();
      R(g, 140, 96, 104, 6, '#e8e4dc'); glow(g, 190, 102, 60, '220,255,240', 0.35, 0.4); for (const px of [160, 210]) { box(g, px, 108, 10, 22, '#c84a1a'); R(g, px + 2, 112, 6, 5, '#2ee6ff'); }
      traffic(g, 14, 52, 230, 92, t, 5);
      if (S.car) g.drawImage(S.car, 40, 144 - S.car.height + 4);
      g.restore(); frame(g, 14, 52, 230, 92, '#9aa0ae', 3, 1);
      // tubi al neon: uno trema
      for (const [k, lx] of [[0, 60], [1, 230], [2, 420], [3, 580]].map((v) => v)) { const fl = k === 2 ? (Math.sin(t * 31) > 0.3 || Math.sin(t * 3.1) > 0.6 ? 1 : 0.2) : 1; R(g, lx - 40, 34, 80, 5, fl > 0.5 ? '#f4fff8' : '#8a9a92'); glow(g, lx, 40, 120, '220,255,240', 0.22 * fl, 0.5); }
      // vetrina del caldo che brilla
      glow(g, 365, 222, 60, '255,170,90', 0.25, 0.6);
      // la cassiera: polo rossa, cappellino, batte gli scontrini
      person(g, 120, 246, { skin: '#e8b090', hair: '#7a3a1a', hairStyle: 'bun', shirt: '#c42a1a', cap: '#c42a1a', capText: '24', pose: 'type', s: 1.2, seed: 2.7 }, t);
      // display della cassa: cifre che cambiano
      R(g, 156, 218, 48, 12, '#0a2a1a'); text(g, (12 + Math.floor(t / 3) % 7) + ',' + (10 + Math.floor(t * 7) % 89), 160, 221, '#7aff9a', 1);
      // un camionista che mangia al tavolino, sulla destra: cappellino, camicia a quadri
      R(g, 530, 228, 100, 6, '#8a8f9e'); R(g, 576, 234, 6, 14, '#5a5e6e');
      person(g, 580, 230, { skin: '#c88a62', hair: '#3a2a1a', shirt: '#7a2a2a', cap: '#2a4a8a', beard: '#3a2a1a', pose: 'lean', s: 0.8, seed: 8.8 }, t);
      R(g, 548, 222, 22, 6, '#f4f1e6'); R(g, 552, 218, 14, 4, '#c87a2a'); box(g, 600, 216, 8, 12, '#c42a1a');
    },
    hot: [{ x: 100, y: 200, w: 120, h: 50, label: 'Cassa', go: 'Servizi' }, { x: 310, y: 196, w: 110, h: 50, label: 'Panini caldi', go: 'Servizi' }, { x: 440, y: 96, w: 190, h: 126, label: 'Market', go: 'Da portare via' }],
  };

  // ---- MOTEL OVUNQUE: reception di legno, portiere coi giornali, chiavi appese (manca la 7), tv con la neve, insegna rosa fuori
  SCENE.motel = {
    focus: 300, amb: 'motel', grade: '255,120,190', gradeA: 0.07,
    static(g, r, S) {
      wood(g, 0, 0, W, 228, '#5a3a24', r, true);
      // moquette a motivi
      floor(g, 226, 252, '#6a2a3a', '#5a1a2a', true, r);
      // finestra con le veneziane, fuori il parcheggio e l'insegna rosa
      outside(g, 24, 40, 150, 120, r, { sky0: '#06050c', sky1: '#1a1024' });
      S.carK = 0.5; S.car = carPic(0.5);
      // pannello delle chiavi dietro al portiere
      box(g, 230, 40, 150, 90, '#3a2214'); for (let k = 0; k < 12; k++) { const kx = 244 + (k % 6) * 22, ky = 56 + Math.floor(k / 6) * 38; R(g, kx, ky, 2, 4, '#c8a040'); text(g, String(k + 1), kx - 2, ky + 24, '#e8d8a0', 1); if (k !== 6) { R(g, kx - 1, ky + 4, 4, 10, '#c8a040'); R(g, kx - 4, ky + 13, 10, 7, '#7a2a1a'); } }
      text(g, 'CHIAVI', 278, 44, '#e8d8a0', 1);
      // quadro di un paesaggio (un lago) e lampada da terra
      box(g, 410, 40, 90, 60, '#c8a040'); R(g, 414, 44, 82, 52, '#2a4a6a'); R(g, 414, 72, 82, 24, '#1a3a2a'); R(g, 420, 64, 70, 8, '#4a6a8a'); for (let k = 0; k < 5; k++) R(g, 424 + k * 14, 58 - (k % 2) * 6, 8, 14 + (k % 2) * 6, '#0a1a14');
      // distributore automatico a destra
      box(g, 540, 70, 76, 156, '#c42a2a'); R(g, 548, 80, 46, 100, '#1a1c22'); for (let k = 0; k < 15; k++) R(g, 552 + (k % 3) * 14, 86 + Math.floor(k / 3) * 18, 10, 12, ['#ffd23f', '#2ee6ff', '#ff7a3a', '#f4f1e6', '#b8ff3a'][k % 5]); R(g, 598, 100, 12, 30, '#2a2d34'); text(g, 'COLA', 552, 190, '#ffffff', 2);
      // il bancone della reception
      R(g, 0, 244, W, 10, '#7a4a2a'); R(g, 0, 244, W, 2, '#a87048'); wood(g, 0, 254, W, 106, '#4a2a16', r, false); for (let x = 30; x < W; x += 150) box(g, x, 272, 120, 70, '#5a3420');
      box(g, 118, 236, 16, 8, '#c8a040'); R(g, 124, 232, 4, 4, '#e8c860');   // campanello
      box(g, 300, 226, 70, 18, '#f4f1e6'); for (let k = 0; k < 4; k++) R(g, 304, 230 + k * 3, 60, 1, '#8a8478'); R(g, 360, 222, 2, 20, '#1a1a8a');   // registro degli ospiti e penna
      // la tua cassa di legno, nell'angolo
      box(g, 470, 200, 56, 40, '#7a4a20'); R(g, 470, 214, 56, 2, '#4a2a10'); R(g, 494, 210, 8, 8, '#c8a040'); text(g, '7', 496, 222, '#e8d8a0', 2);
    },
    dyn(g, t, S) {
      g.save(); g.beginPath(); g.rect(24, 40, 150, 120); g.clip();
      traffic(g, 24, 40, 150, 120, t, 7);
      if (S.car) g.drawImage(S.car, 30, 160 - S.car.height + 6);
      const fl = Math.sin(t * 9) * Math.sin(t * 2.3) > 0.7 ? 0.3 : 1;
      neon(g, 'MOTEL', 108, 52, '255,95,168', 3, fl); neon(g, 'LIBERE', 116, 72, '120,255,160', 2, Math.sin(t * 1.5) > -0.6 ? 1 : 0);
      rain(g, 24, 40, 150, 120, t, 0.28);
      g.restore();
      // veneziane un po' storte
      for (let y = 42; y < 160; y += 7) { R(g, 24, y, 150, 2, 'rgba(200,180,150,.55)'); R(g, 24, y + 2, 150, 1, 'rgba(0,0,0,.25)'); }
      frame(g, 24, 40, 150, 120, '#3a2214', 1, 1);
      // il portiere: anziano, calvo, occhiali, cardigan, legge
      person(g, 300, 244, { skin: '#d8a888', hair: '#c8c4bc', hairStyle: 'bald', shirt: '#7a6a4a', glasses: true, pose: 'read', s: 1.25, seed: 0.4 }, t);
      // tv con la neve sul mobiletto
      box(g, 190, 186, 46, 34, '#2a2620'); for (let k = 0; k < 120; k++) P(g, 194 + Math.floor(Math.random() * 38), 190 + Math.floor(Math.random() * 26), Math.random() < 0.5 ? '#d8d8d8' : '#4a4a4a');
      glow(g, 213, 203, 40, '200,210,255', 0.18);
      // falene intorno al lampadario
      R(g, 400, 0, 2, 22, '#2a2a2a'); g.fillStyle = '#e8c890'; g.beginPath(); g.arc(401, 26, 7, 0, 7); g.fill(); glow(g, 401, 28, 110, '255,200,140', 0.45, 0.8);
      for (let k = 0; k < 3; k++) P(g, 401 + Math.cos(t * (2 + k) + k) * (10 + k * 4), 26 + Math.sin(t * (3 + k) + k * 2) * (6 + k * 3), '#d8d0b8');
      glow(g, 90, 70, 90, '255,95,168', 0.16);   // la luce rosa dell'insegna entra dalla finestra
      clock(g, 500, 160, 13, '#f4f1e6', '#3a2214');
    },
    hot: [{ x: 210, y: 150, w: 180, h: 100, label: 'Reception', go: 'La stanza 7' }, { x: 470, y: 196, w: 56, h: 46, label: 'La tua cassa', go: 'La tua cassa' }, { x: 24, y: 40, w: 150, h: 120, label: 'Parcheggio', go: 'Parcheggio' }, { x: 230, y: 40, w: 150, h: 90, label: 'Chiavi', go: 'La stanza 7' }],
  };

  // ---- BENZINAIO: chiosco notturno, sigarette e gratta e vinci, frigo delle bibite, il ragazzo col berretto al telefono
  SCENE.fuel = {
    focus: 330, amb: 'fuel', grade: '120,230,255', gradeA: 0.05,
    static(g, r, S) {
      R(g, 0, 0, W, 230, '#d8dcd8'); for (let y = 0; y < 230; y += 20) R(g, 0, y, W, 1, '#c8ccc8');
      // vetrata grande sulle pompe
      outside(g, 10, 20, 290, 150, r, { sky0: '#040610', sky1: '#10162a', road: '#22242e' });
      S.carK = 0.6; S.car = carPic(0.6);
      // muro delle sigarette dietro alla cassa
      box(g, 330, 62, 160, 110, '#2a2d34'); for (let k = 0; k < 40; k++) R(g, 336 + (k % 10) * 15, 68 + Math.floor(k / 10) * 26, 12, 20, ['#f4f1e6', '#c42a1a', '#1a3a9a', '#d8c070', '#2a2a2a'][(k * 7) % 5]);
      // frigo delle bibite (destra)
      box(g, 510, 24, 116, 200, '#3a3e48'); R(g, 516, 30, 104, 186, '#0a1a24'); for (let k = 0; k < 5; k++) { R(g, 516, 60 + k * 34, 104, 2, '#8a9aa8'); for (let x = 520; x < 614; x += 9) box(g, x, 40 + k * 34, 6, 18, ['#c42a1a', '#2a9a4a', '#ff7a3a', '#2a6ad8', '#f4f1e6'][(x + k) % 5]); }
      R(g, 567, 30, 2, 186, '#8a9aa8');
      floor(g, 224, 252, '#b8bcb8', '#a8aca8', false, r);
      // bancone
      R(g, 0, 244, W, 8, '#1a1c22'); R(g, 0, 244, W, 1, '#5a5e6e'); R(g, 0, 252, W, 108, '#1a6aa8'); R(g, 0, 252, W, 4, '#2ee6ff'); text(g, 'BENZINA 24H', 30, 300, '#ffffff', 4); R(g, 0, 344, W, 16, '#0a3a5a');
      // gratta e vinci, accendini, cartello dei prezzi a led
      box(g, 230, 214, 70, 30, '#ffd23f'); for (let k = 0; k < 4; k++) R(g, 234 + k * 16, 218, 13, 22, ['#ff2e88', '#2ee6ff', '#b8ff3a', '#ff7a3a'][k]);
      box(g, 410, 222, 40, 22, '#2a2a30'); for (let k = 0; k < 8; k++) R(g, 413 + k * 4.5, 225, 3, 16, ['#c42a1a', '#2a6ad8', '#2a9a4a', '#ffd23f'][k % 4]);
      box(g, 330, 8, 160, 44, '#0a0a10'); text(g, 'BENZINA', 336, 16, '#ffb000', 1); text(g, 'DIESEL', 336, 34, '#ffb000', 1);
    },
    dyn(g, t, S) {
      g.save(); g.beginPath(); g.rect(10, 20, 290, 150); g.clip();
      // la pensilina con le luci, le pompe, la tua auto alla pompa
      R(g, 10, 60, 290, 10, '#e8e4dc'); R(g, 10, 70, 290, 2, '#2ee6ff'); for (let x = 40; x < 300; x += 70) glow(g, x, 74, 60, '220,250,255', 0.35, 0.6);
      for (const px of [70, 220]) { box(g, px, 104, 18, 46, '#f4f1e6'); R(g, px + 3, 110, 12, 8, '#0a1a24'); text(g, '1,8', px + 3, 112, '#7aff9a', 1); R(g, px + 18, 116, 6, 2, '#2a2a2a'); }
      traffic(g, 10, 20, 290, 150, t, 3);
      if (S.car) g.drawImage(S.car, 92, 162 - S.car.height + 8);
      g.restore(); frame(g, 10, 20, 290, 150, '#5a5e6e', 3, 1);
      // prezzi a led che lampeggiano piano
      text(g, (1.8 + 0.01 * (Math.floor(t / 7) % 3)).toFixed(3).replace('.', ','), 420, 13, '#ff4a2a', 2); text(g, '1,679', 420, 31, '#ff4a2a', 2); glow(g, 450, 30, 50, '255,74,42', 0.15, 0.5);
      // il ragazzo al telefono: felpa col cappuccio, berretto
      person(g, 410, 244, { skin: '#c88a62', hood: '#2a3a2a', beanie: '#c43a2a', pose: 'phone', s: 1.2, seed: 3.1, shirt: '#2a3a2a' }, t);
      // il frigo brilla e ronza
      glow(g, 568, 120, 90, '170,230,255', 0.22, 1.4);
      for (const lx of [120, 330, 520]) { R(g, lx - 36, 4, 72, 4, '#f4fff8'); glow(g, lx, 8, 110, '220,250,255', 0.2, 0.5); }
    },
    hot: [{ x: 330, y: 62, w: 160, h: 184, label: 'Cassa', go: 'top' }, { x: 510, y: 24, w: 116, h: 200, label: 'Frigo e market', go: 'top' }, { x: 10, y: 20, w: 290, h: 150, label: 'Pompe', go: 'top' }],
  };

  // ---- DA LUCA TUNING: la tua auto sul ponte, parete degli attrezzi, turbo sul banco, Luca col cappellino al contrario
  SCENE.shop = {
    focus: 300, amb: 'shop', grade: '255,176,0', gradeA: 0.05,
    static(g, r, S) {
      R(g, 0, 0, W, 240, '#2a2d34'); for (let y = 0; y < 240; y += 24) for (let x = (y / 24) % 2 * 24; x < W; x += 48) R(g, x, y, 47, 23, '#30333a');   // blocchi di cemento
      R(g, 0, 120, W, 6, '#ffb000'); for (let x = 0; x < W; x += 16) R(g, x, 120, 8, 6, '#1a1a1a');   // striscia gialla e nera
      // pannello forato con gli attrezzi disegnati
      box(g, 20, 20, 170, 90, '#8a6a4a'); for (let y = 24; y < 108; y += 6) for (let x = 24; x < 188; x += 6) P(g, x, y, '#5a4a3a');
      const tools = [[30, 30, 6, 60], [44, 34, 4, 50], [56, 30, 12, 26], [76, 30, 4, 56], [90, 40, 20, 8], [116, 30, 6, 46], [130, 32, 30, 10], [130, 52, 26, 8], [166, 30, 8, 60]];
      for (const [x, y, w, h] of tools) { R(g, x - 1, y - 1, w + 2, h + 2, '#1a1a1a'); R(g, x, y, w, h, '#c8ccd4'); R(g, x, y, 1, h, '#f4f1e6'); }
      // insegna al neon LUCA (si accende in dyn)
      // scaffale delle gomme e dei pezzi (destra)
      for (let k = 0; k < 3; k++) { g.fillStyle = '#0e0e12'; g.beginPath(); g.ellipse(560, 232 - k * 20, 34, 11, 0, 0, 7); g.fill(); g.fillStyle = '#1a1c22'; g.beginPath(); g.ellipse(560, 229 - k * 20, 30, 8, 0, 0, 7); g.fill(); }
      box(g, 470, 30, 150, 80, '#14161c'); R(g, 474, 34, 142, 72, '#0a1018');   // schermo del banco prova
      // pavimento di resina e banco da lavoro
      R(g, 0, 240, W, 120, '#3a3e48'); for (let k = 0; k < 30; k++) R(g, Math.floor(r() * W), 244 + Math.floor(r() * 110), 20 + Math.floor(r() * 40), 1, '#444854');
      R(g, 0, 240, W, 2, '#5a5e6e');
      // il ponte sollevatore (bracci) – l'auto si disegna in dyn
      R(g, 200, 120, 10, 160, '#c42a1a'); R(g, 450, 120, 10, 160, '#c42a1a'); R(g, 200, 120, 10, 4, '#ff4a3a'); R(g, 450, 120, 10, 4, '#ff4a3a');
      S.carK = 1.15; S.car = carPic(1.15);
      // banco in primo piano con il turbo e i tubi
      R(g, 0, 300, 230, 10, '#5a5e6e'); R(g, 0, 310, 230, 50, '#2a2d34'); for (let k = 0; k < 3; k++) box(g, 10 + k * 74, 318, 64, 16, '#3a3e48');
      g.fillStyle = '#0a0a10'; g.beginPath(); g.arc(80, 284, 20, 0, 7); g.fill(); g.fillStyle = '#b8bec8'; g.beginPath(); g.arc(80, 284, 18, 0, 7); g.fill(); g.fillStyle = '#7a8290'; g.beginPath(); g.arc(80, 284, 10, 0, 7); g.fill(); R(g, 96, 274, 30, 12, '#b8bec8'); R(g, 96, 274, 30, 2, '#e8ecf2');
      for (let k = 0; k < 3; k++) { R(g, 140 + k * 26, 280, 20, 20, '#5a5e6e'); R(g, 144 + k * 26, 284, 12, 12, '#1a1c22'); }
    },
    dyn(g, t, S) {
      // la tua auto sul ponte, alzata, con la luce da sotto
      if (S.car) { const y = 150 - S.car.height + Math.sin(t * 0.6) * 0.5; g.drawImage(S.car, 330 - S.car.width / 2, y); R(g, 210, 150 + 2, 240, 4, '#8a8f9e'); }
      glow(g, 330, 160, 160, '255,190,110', 0.12, 0.4);
      // grafico del banco prova che scorre
      R(g, 474, 34, 142, 72, '#0a1018'); for (let x = 0; x < 140; x++) { const v = 0.5 + 0.35 * Math.sin((x + t * 30) * 0.06) + 0.1 * Math.sin((x + t * 30) * 0.21); P(g, 475 + x, 100 - v * 60, '#ffb000'); P(g, 475 + x, 100 - v * 50 + 10, '#2ee6ff'); }
      text(g, 'BANCO PROVA', 478, 38, '#7a8290', 1); text(g, Math.round(280 + 40 * Math.sin(t * 0.3)) + ' CV', 560, 38, '#ffb000', 1);
      const fl = Math.sin(t * 11) * Math.sin(t * 4.3) > 0.8 ? 0.15 : 1; neon(g, 'LUCA', 488, 134, '255,176,0', 5, fl); neon(g, 'TUNING', 494, 164, '255,90,40', 2, 1);
      // Luca: cappellino al contrario, canottiera, attrezzo in mano
      person(g, 150, 300, { skin: '#d8a078', hair: '#1a1010', hairStyle: 'short', shirt: '#14141c', cap: '#ffb000', capBack: true, pose: 'tool', s: 1.3, seed: 5.5, sleeve: '#d8a078' }, t);
      // luci a soffitto (tubi) e lampada sul banco
      for (const lx of [110, 330, 540]) { R(g, lx - 50, 2, 100, 4, '#f4fff8'); glow(g, lx, 6, 140, '230,245,255', 0.2, 0.5); }
      glow(g, 80, 270, 60, '255,210,150', 0.2);
    },
    hot: [{ x: 200, y: 60, w: 260, h: 100, label: 'La tua auto', go: 'top' }, { x: 470, y: 30, w: 150, h: 80, label: 'Banco prova', go: 'top' }, { x: 0, y: 260, w: 230, h: 100, label: 'Pezzi', go: 'top' }],
  };

  // ---- OFFICINA MARIO: officina vecchia, la tua auto sulla fossa, compressore, radio, Mario in tuta con lo straccio
  SCENE.niko = {
    focus: 250, amb: 'niko', grade: '120,200,255', gradeA: 0.05,
    static(g, r, S) {
      R(g, 0, 0, W, 236, '#4a4a40'); for (let k = 0; k < 120; k++) R(g, Math.floor(r() * W), Math.floor(r() * 236), 2 + Math.floor(r() * 10), 1 + Math.floor(r() * 3), r() < 0.5 ? '#3e3e36' : '#545448');   // intonaco macchiato
      R(g, 0, 150, W, 86, '#3a5a6a'); R(g, 0, 150, W, 3, '#2a4050');   // zoccolo verde petrolio
      // finestra a griglia con i vetri sporchi
      R(g, 30, 20, 130, 90, '#1a2a3a'); for (let x = 30; x < 160; x += 26) R(g, x, 20, 2, 90, '#2a2a24'); for (let y = 20; y < 110; y += 30) R(g, 30, y, 130, 2, '#2a2a24'); for (let k = 0; k < 60; k++) R(g, 30 + Math.floor(r() * 128), 20 + Math.floor(r() * 88), 3, 2, 'rgba(120,110,80,.4)');
      // calendario e targhe smaltate
      box(g, 180, 26, 50, 66, '#f4f1e6'); R(g, 184, 30, 42, 26, '#7a1a1a'); text(g, 'NOV', 194, 62, '#2a2a2a', 2); for (let k = 0; k < 15; k++) R(g, 186 + (k % 5) * 8, 74 + Math.floor(k / 5) * 5, 5, 3, '#c8c4b8');
      box(g, 246, 30, 60, 26, '#1a3a9a'); text(g, 'OLIO', 256, 36, '#ffd23f', 2); box(g, 246, 64, 60, 26, '#c42a1a'); text(g, 'GOMME', 252, 70, '#ffffff', 2);
      // compressore, caricabatterie, taniche
      box(g, 560, 160, 60, 76, '#c42a1a'); g.fillStyle = '#0a0a10'; g.beginPath(); g.arc(590, 180, 10, 0, 7); g.fill(); g.fillStyle = '#e8e4dc'; g.beginPath(); g.arc(590, 180, 8, 0, 7); g.fill(); R(g, 566, 210, 48, 20, '#8a1a1a');
      for (let k = 0; k < 3; k++) box(g, 500 + k * 16, 206, 12, 30, ['#c42a1a', '#2a6a2a', '#c42a1a'][k]);
      // mensola con la radio e i barattoli
      R(g, 330, 100, 140, 4, '#5a4a3a'); box(g, 340, 78, 42, 22, '#3a2a1a'); R(g, 344, 82, 18, 14, '#c8a040'); for (let k = 0; k < 4; k++) R(g, 366, 82 + k * 3, 12, 1, '#1a1a1a');
      for (let k = 0; k < 5; k++) box(g, 392 + k * 15, 84, 10, 16, ['#2a6ad8', '#ffd23f', '#c8ccd4', '#c42a1a', '#2a9a4a'][k]);
      // pavimento di cemento macchiato d'olio, la fossa
      R(g, 0, 236, W, 124, '#5a5a52'); for (let k = 0; k < 40; k++) { g.fillStyle = `rgba(10,10,10,${0.15 + r() * 0.25})`; g.beginPath(); g.ellipse(r() * W, 240 + r() * 120, 6 + r() * 26, 2 + r() * 6, 0, 0, 7); g.fill(); }
      R(g, 210, 250, 250, 20, '#1a1a16'); R(g, 210, 250, 250, 2, '#ffd23f'); for (let x = 210; x < 460; x += 14) R(g, x, 250, 7, 2, '#1a1a1a');
      S.carK = 1.1; S.car = carPic(1.1);
    },
    dyn(g, t, S) {
      if (S.car) g.drawImage(S.car, 335 - S.car.width / 2, 252 - S.car.height + 4);
      // luce da lavoro accesa sotto l'auto (dalla fossa)
      glow(g, 335, 262, 90, '255,230,170', 0.35, 0.3);
      // Mario: tuta blu, barba grigia, straccio rosso in tasca, si pulisce le mani
      person(g, 110, 330, { skin: '#d8a888', hair: '#9a9a92', hairStyle: 'short', beard: '#a8a8a0', overalls: '#2a4a8a', rag: true, pose: 'wipe', s: 1.35, seed: 4.2, shirt: '#2a4a8a' }, t);
      // la radio suona: lucina che pulsa
      if (Math.sin(t * 6) > 0) R(g, 380, 82, 2, 2, '#7aff9a');
      // tubi al neon, uno sfarfalla
      for (const [k, lx] of [[0, 120], [1, 330], [2, 540]]) { const fl = k === 1 ? (Math.sin(t * 23) > -0.2 ? 1 : 0.3) : 1; R(g, lx - 50, 4, 100, 4, fl > 0.5 ? '#f4fff8' : '#7a8a82'); glow(g, lx, 8, 130, '220,240,255', 0.2 * fl, 0.5); }
      // pulviscolo nella luce della finestra
      cone(g, 95, 20, 120, 200, 200, '200,220,255', 0.05);
      for (let k = 0; k < 10; k++) P(g, 60 + ((k * 37 + t * 4) % 120), 60 + ((k * 53 + Math.sin(t + k) * 20) % 140), 'rgba(255,255,240,.4)');
    },
    hot: [{ x: 200, y: 160, w: 270, h: 110, label: 'La tua auto', go: 'top' }, { x: 40, y: 220, w: 150, h: 120, label: 'Mario', go: 'top' }, { x: 560, y: 160, w: 60, h: 76, label: 'Gomme', go: 'top' }],
  };

  // ---- NEON KUSTOM: cabina di verniciatura con la tua auto sotto le luci viola, muro dei cerchi, rotoli di vinile, l'artista con l'aerografo
  SCENE.style = {
    focus: 420, amb: 'style', grade: '255,46,136', gradeA: 0.08,
    static(g, r, S) {
      R(g, 0, 0, W, 240, '#140c1e'); for (let x = 0; x < W; x += 40) R(g, x, 0, 1, 240, '#1e1430');
      // campionario dei colori
      for (let k = 0; k < 24; k++) { const c = ['#ff2e88', '#2ee6ff', '#b8ff3a', '#ffd23f', '#ff7a3a', '#7a2ad8', '#f4f1e6', '#1a1a1a'][k % 8]; box(g, 18 + (k % 6) * 22, 30 + Math.floor(k / 6) * 22, 18, 18, c); }
      // muro dei cerchi
      for (let k = 0; k < 6; k++) { const cx = 494 + (k % 3) * 46, cy = 46 + Math.floor(k / 3) * 50; g.fillStyle = '#0a0a10'; g.beginPath(); g.arc(cx, cy, 20, 0, 7); g.fill(); g.fillStyle = ['#c8ccd4', '#ffd23f', '#1a1a1a', '#ff2e88', '#c8ccd4', '#2ee6ff'][k]; g.beginPath(); g.arc(cx, cy, 16, 0, 7); g.fill(); g.fillStyle = '#0a0a10'; for (let s = 0; s < 5; s++) { const a = s * 1.256; g.beginPath(); g.arc(cx + Math.cos(a) * 9, cy + Math.sin(a) * 9, 4, 0, 7); g.fill(); } g.fillStyle = '#5a5e6e'; g.beginPath(); g.arc(cx, cy, 4, 0, 7); g.fill(); }
      // rotoli di vinile
      for (let k = 0; k < 5; k++) { box(g, 170 + k * 14, 110, 10, 100, ['#ff2e88', '#2ee6ff', '#1a1a1a', '#b8ff3a', '#f4f1e6'][k]); }
      // cabina: telaio di metallo con i filtri
      R(g, 240, 20, 230, 6, '#3a3e48'); R(g, 240, 20, 6, 220, '#3a3e48'); R(g, 464, 20, 6, 220, '#3a3e48'); for (let x = 250; x < 460; x += 24) R(g, x, 26, 20, 10, '#2a2d34');
      R(g, 0, 240, W, 120, '#1a1424'); for (let k = 0; k < 20; k++) R(g, Math.floor(r() * W), 244 + Math.floor(r() * 110), 1 + Math.floor(r() * 3), 1 + Math.floor(r() * 2), ['#ff2e88', '#2ee6ff', '#b8ff3a'][k % 3]);   // schizzi di vernice
      S.carK = 0.95; S.car = carPic(0.95);
      // banco basso con le bombolette in primo piano
      R(g, 0, 318, W, 8, '#2a2236'); R(g, 0, 326, W, 34, '#1a1424'); for (let k = 0; k < 14; k++) { const x = 20 + k * 40; box(g, x, 296, 12, 22, ['#ff2e88', '#2ee6ff', '#ffd23f', '#b8ff3a', '#f4f1e6', '#7a2ad8'][k % 6]); R(g, x + 3, 292, 6, 4, '#c8ccd4'); }
    },
    dyn(g, t, S) {
      // tubi al neon nella cabina che cambiano colore piano
      const hue = (Math.sin(t * 0.35) + 1) / 2, rgb = hue > 0.5 ? '255,46,136' : '46,230,255';
      for (const y of [44, 60]) { R(g, 260, y, 190, 3, `rgb(${rgb})`); glow(g, 355, y, 160, rgb, 0.28, 0.35); }
      if (S.car) g.drawImage(S.car, 355 - S.car.width / 2, 240 - S.car.height + 6);
      cone(g, 355, 62, 190, 260, 180, rgb, 0.08);
      // neon NEON KUSTOM che si accende lettera per lettera
      const n = Math.min(10, Math.floor(t * 4)), fl = Math.sin(t * 9) * Math.sin(t * 2.7) > 0.85 ? 0.25 : 1;   // si accende lettera per lettera, poi ogni tanto trema
      if (n > 0) neon(g, 'NEON'.slice(0, Math.min(4, n)), 34, 136, '255,46,136', 4, fl); if (n > 4) neon(g, 'KUSTOM'.slice(0, n - 4), 30, 160, '46,230,255', 3, 1);
      // l'artista con l'aerografo e le cuffie
      person(g, 520, 318, { skin: '#c88a62', hair: '#1a1010', hairStyle: 'long', shirt: '#2a2a3a', headphones: true, hpCol: '#2ee6ff', pose: 'spray', sprayRgb: rgb, s: 1.25, seed: 6.6 }, t);
      // casse che pulsano col basso
      const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * 2)), 8);
      for (const sx of [20, 600]) { box(g, sx, 250, 28, 40, '#0a0a10'); g.fillStyle = '#2a2d34'; g.beginPath(); g.arc(sx + 14, 275, 9 + beat * 1.5, 0, 7); g.fill(); g.fillStyle = '#5a5e6e'; g.beginPath(); g.arc(sx + 14, 275, 3, 0, 7); g.fill(); }
      glow(g, 70, 150, 120, '255,46,136', 0.12 + beat * 0.05);
    },
    hot: [{ x: 240, y: 30, w: 230, h: 210, label: 'Cabina', go: 'top' }, { x: 470, y: 20, w: 160, h: 110, label: 'Cerchi', go: 'top' }, { x: 10, y: 20, w: 140, h: 100, label: 'Colori', go: 'top' }],
  };

  // ---- AUTOSALONE NOTTE: showroom con la vetrata sulla notte, l'auto in vetrina sulla pedana che gira (il disegno del
  // giocatore, con le ruote), faretti, il venditore in giacca alla scrivania, divanetto e macchinetta del caffè
  const dealerCar = (S) => {
    const id = window.NightDealer && window.NightDealer.featured(); if (!id || id === S.fid) return;
    S.fid = id; S.feat = null;
    if (window.valigette && window.valigette.carPic) window.valigette.carPic(id, (c) => { if (S.fid === id) S.feat = c; });
  };
  SCENE.dealer = {
    focus: 300, amb: 'dealer', grade: '182,156,255', gradeA: 0.05,
    static(g, r, S) {
      // vetrata su tutta la parete di fondo, sulla notte
      R(g, 0, 0, W, 250, '#1a1826');
      outside(g, 0, 18, W, 200, r, { sky0: '#070818', sky1: '#241a3a' });
      for (let x = 0; x <= W; x += 80) { R(g, x - 2, 14, 5, 210, '#0a0a10'); R(g, x - 1, 14, 2, 210, '#4a4a5e'); }      // montanti
      R(g, 0, 12, W, 5, '#3a3a4e'); R(g, 0, 218, W, 6, '#2a2838'); R(g, 0, 224, W, 26, '#1c1a2a');
      // insegna appesa al soffitto, sopra la pedana
      R(g, 250, 10, 2, 16, '#5a5a6e'); R(g, 410, 10, 2, 16, '#5a5a6e'); box(g, 226, 24, 210, 58, '#120f1e');
      // soffitto con i binari dei faretti
      R(g, 0, 0, W, 10, '#0e0d16'); R(g, 60, 8, 520, 3, '#3a3a4e');
      for (const lx of [180, 330, 480]) { R(g, lx - 6, 10, 12, 8, '#2a2a36'); R(g, lx - 4, 18, 8, 5, '#5a5a6e'); }
      // pavimento lucido a quadroni
      floor(g, 250, H, '#2a2840', '#232136', true, r);
      // pedana girevole (l'auto si disegna in dyn)
      g.fillStyle = '#0a0a10'; g.beginPath(); g.ellipse(330, 268, 168, 26, 0, 0, 7); g.fill();
      g.fillStyle = '#3a3656'; g.beginPath(); g.ellipse(330, 264, 166, 24, 0, 0, 7); g.fill();
      g.fillStyle = '#4a4670'; g.beginPath(); g.ellipse(330, 262, 160, 20, 0, 0, 7); g.fill();
      // scrivania (destra): monitor, faldoni, pianta
      R(g, 500, 262, 140, 8, '#d8d4e8'); R(g, 504, 270, 136, 44, '#2a2838'); R(g, 504, 270, 136, 2, '#4a4660');
      box(g, 580, 222, 48, 34, '#14141c'); R(g, 582, 224, 44, 30, '#1a2a44'); R(g, 600, 256, 8, 6, '#14141c');
      for (let k = 0; k < 4; k++) box(g, 520 + k * 9, 238 - (k % 2) * 4, 7, 24 - (k % 2) * 4, ['#b69cff', '#ffd23f', '#3b9bff', '#ff3b4a'][k]);
      box(g, 614, 196, 22, 32, '#5a3a2a'); for (let k = 0; k < 9; k++) { g.fillStyle = k % 2 ? '#2f8a4a' : '#4fbf6a'; g.beginPath(); g.ellipse(625 + Math.cos(k * 0.8) * 10, 190 - k * 3, 9, 4, Math.cos(k) * 0.8, 0, 7); g.fill(); }
      // divanetto, tavolino con le riviste e macchinetta del caffè (sinistra)
      box(g, 4, 292, 96, 26, '#3a2a4a'); box(g, 4, 270, 96, 22, '#4a3660'); R(g, 6, 272, 92, 2, '#5a4676');
      box(g, 20, 230, 28, 48, '#2a2a36'); R(g, 24, 236, 20, 10, '#0a0a10'); R(g, 28, 260, 12, 2, '#c8ccd4');
      S.fid = null; dealerCar(S);
    },
    dyn(g, t, S) {
      dealerCar(S);
      traffic(g, 0, 18, W, 200, t, 4);
      // faretti sulla pedana e alone
      for (const lx of [180, 330, 480]) cone(g, lx, 22, 18, 120, 230, '220,210,255', 0.07);
      glow(g, 330, 250, 220, '182,156,255', 0.12, 0.3);
      // luci che girano sul bordo della pedana
      for (let k = 0; k < 24; k++) { const a = t * 0.9 + k * (Math.PI * 2 / 24), x = 330 + Math.cos(a) * 162, y = 263 + Math.sin(a) * 22; if (Math.sin(a) > -0.2) { R(g, x - 1, y - 1, 2, 2, k % 2 ? '#ffffff' : '#b69cff'); glow(g, x, y, 6, '182,156,255', 0.3); } }
      // l'auto in vetrina sulla pedana, col riflesso
      if (S.feat) {
        const c = S.feat, k = Math.min(1.2, 270 / c.width), w = c.width * k, h = c.height * k, y = 258 - h + Math.sin(t * 0.8) * 0.6;
        g.save(); g.imageSmoothingEnabled = false; g.drawImage(c, 330 - w / 2, y, w, h);
        g.globalAlpha = 0.16; g.scale(1, -1); g.drawImage(c, 330 - w / 2, -(258 * 2 - y) - 4, w, h); g.restore();
        const sx = 330 - w / 2 + ((t * 70) % (w + 120)) - 60; g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.12; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(sx, y + 4); g.lineTo(sx + 16, y + 4); g.lineTo(sx - 10, y + h - 14); g.lineTo(sx - 26, y + h - 14); g.fill(); g.restore();
      }
      // targhetta col prezzo sul bordo della pedana
      const dl = window.nightRun && window.nightRun.game, n = dl && dl.inside ? Math.round((dl.inside.x - VG_STOP0) / VG_STEP) : 0;
      if (dl && dl.dlPrice && S.fid) {
        const p = dl.dlPrice(S.fid, n), deal = dl.dlDeal(n) === S.fid, label = deal ? 'OCCASIONE' : 'IN VETRINA', pr = 'E ' + (p >= 1000 ? Math.floor(p / 1000) + '.' + String(p % 1000).padStart(3, '0') : p);
        const tw = Math.max(textW(label), textW(pr, 2)) + 12;
        box(g, 330 - tw / 2, 286, tw, 26, '#f4f1e6'); text(g, label, 330 - textW(label) / 2, 289, deal ? '#c43a6a' : '#5a5a70'); text(g, pr, 330 - textW(pr, 2) / 2, 297, '#1a1a24', 2);
      }
      // insegna AUTOSALONE / NOTTE
      const fl = Math.sin(t * 7) * Math.sin(t * 2.1) > 0.9 ? 0.3 : 1;
      neon(g, 'AUTOSALONE', 331 - textW('AUTOSALONE', 2) / 2, 32, '182,156,255', 2, fl); neon(g, 'NOTTE', 331 - textW('NOTTE', 4) / 2, 52, '255,210,63', 4, 1);
      // monitor della scrivania: tabella delle rate che scorre
      R(g, 582, 224, 44, 30, '#1a2a44'); for (let k = 0; k < 5; k++) { const yy = 227 + ((k * 6 + Math.floor(t * 8)) % 26); R(g, 585, yy, 16 + (k * 7) % 18, 1, '#9ec4ff'); R(g, 610, yy, 10, 1, '#b8ff3a'); }
      glow(g, 604, 238, 30, '160,200,255', 0.18);
      // il venditore accanto all'auto: giacca scura, camicia bianca, cravatta viola; a volte al telefono
      const ph = Math.floor(t / 7) % 3 === 2 ? 'phone' : 'arms';
      person(g, 150, 316, { skin: '#d8a078', hair: '#3a2a1a', hairStyle: 'short', shirt: '#f0eee8', vest: '#22203a', sleeve: '#22203a', tie: '#7a4ad8', pose: ph, s: 1.2, seed: 8.2 }, t);
      // luci a soffitto
      for (const lx of [180, 330, 480]) glow(g, lx, 20, 30, '255,250,235', 0.35);
    },
    hot: [{ x: 200, y: 110, w: 270, h: 200, label: 'In vetrina', go: () => window.NightDealer && NightDealer.tab(0) }, { x: 100, y: 180, w: 100, h: 140, label: 'Il venditore: rate', go: () => window.NightDealer && NightDealer.tab(2) }, { x: 500, y: 200, w: 140, h: 120, label: 'Le tue auto', go: () => window.NightDealer && NightDealer.tab(1) }],
  };

  // ---- SFASCIO RUGGINE: piazzale di notte, rete, pile di auto schiacciate, la gru col magnete, la carcassa in vendita,
  // il bidone col fuoco, il ferrovecchio con la smerigliatrice e le scintille, il cane che dorme
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
  SCENE.junk = {
    focus: 300, amb: 'junk', grade: '255,150,80', gradeA: 0.06,
    static(g, r, S) {
      vgrad(g, 0, 0, W, 200, '#06070f', '#1c1424', 6);
      for (let k = 0; k < 40; k++) P(g, Math.floor(r() * W), Math.floor(r() * 120), r() < 0.5 ? '#c8ccd4' : '#6a6e7e');
      g.fillStyle = '#e8e4d0'; g.beginPath(); g.arc(560, 46, 14, 0, 7); g.fill(); g.fillStyle = '#1c1424'; g.beginPath(); g.arc(566, 42, 12, 0, 7); g.fill();   // falce di luna
      for (let x = 0; x < W; x += 6 + Math.floor(r() * 10)) { const h = 10 + r() * 30; R(g, x, 170 - h, 8, h, '#120e18'); }   // città lontana
      // pile di auto schiacciate
      const cols = ['#5a2e2e', '#2e3a5a', '#4a4a2e', '#3a4a4a', '#5a4a3a', '#2e2e3a', '#6a3a1e', '#4a2a4a'];
      for (const [x0, n0] of [[10, 7], [130, 5], [420, 6], [540, 8]]) for (let k = 0; k < n0; k++) { const y = 196 - k * 14, x = x0 + (k % 2) * 8 + Math.floor(r() * 6); box(g, x, y, 84, 12, cols[Math.floor(r() * cols.length)]); R(g, x, y + 8, 84, 4, 'rgba(0,0,0,.35)'); R(g, x + 10 + Math.floor(r() * 50), y + 3, 12, 2, 'rgba(180,200,220,.25)'); }
      // rete metallica
      R(g, 0, 150, W, 2, '#5a5e6e'); for (let x = 0; x < W; x += 60) R(g, x, 150, 3, 70, '#4a4e5e');
      g.save(); g.globalAlpha = 0.18; g.strokeStyle = '#8a8f9e'; g.lineWidth = 1; for (let x = -80; x < W + 80; x += 8) { g.beginPath(); g.moveTo(x, 152); g.lineTo(x + 66, 218); g.stroke(); g.beginPath(); g.moveTo(x + 66, 152); g.lineTo(x, 218); g.stroke(); } g.restore();
      // terra battuta con pozze d'olio
      vgrad(g, 0, 218, W, H - 218, '#2a2018', '#1a140e', 5);
      for (let k = 0; k < 160; k++) P(g, Math.floor(r() * W), 220 + Math.floor(r() * 140), r() < 0.5 ? '#3a2e22' : '#14100a');
      for (const [x, y, w] of [[90, 300, 70], [420, 330, 90], [260, 340, 50]]) { g.fillStyle = '#0c0a10'; g.beginPath(); g.ellipse(x, y, w / 2, 5, 0, 0, 7); g.fill(); g.fillStyle = 'rgba(120,80,200,.18)'; g.beginPath(); g.ellipse(x - 6, y - 1, w / 3, 2, 0, 0, 7); g.fill(); }
      // gru (struttura): torre a destra, braccio verso sinistra
      R(g, 476, 30, 10, 200, '#0a0a10'); R(g, 477, 30, 8, 200, '#c8a020'); for (let y = 34; y < 230; y += 10) line(g, 477, y, 485, y + 9, '#8a6a10');
      R(g, 250, 26, 250, 8, '#0a0a10'); R(g, 250, 27, 248, 6, '#c8a020'); for (let x = 254; x < 496; x += 10) line(g, x, 28, x + 8, 32, '#8a6a10');
      // pila di gomme a destra, davanti
      for (let k = 0; k < 4; k++) { g.fillStyle = '#0a0a10'; g.beginPath(); g.ellipse(560, 318 - k * 13, 34, 10, 0, 0, 7); g.fill(); g.fillStyle = '#1e1e24'; g.beginPath(); g.ellipse(560, 315 - k * 13, 30, 7, 0, 0, 7); g.fill(); }
      // lampione a sinistra
      R(g, 40, 40, 5, 190, '#0a0a10'); R(g, 40, 38, 34, 5, '#0a0a10'); R(g, 62, 43, 14, 4, '#f4f0d8');
      S.wid = undefined; junkCar(S);
    },
    dyn(g, t, S) {
      junkCar(S);
      cone(g, 69, 46, 14, 220, 270, '255,240,200', 0.09);
      // il magnete che dondola con un'auto schiacciata
      const a = Math.sin(t * 0.55) * 0.18, hx = 290, hy = 34, len = 92, mx = hx + Math.sin(a) * len, my = hy + Math.cos(a) * len;
      line(g, hx, hy, Math.round(mx), Math.round(my), '#8a8f9e');
      box(g, mx - 16, my, 32, 9, '#4a4e5e'); box(g, mx - 30, my + 10, 60, 18, '#6a3a3a'); R(g, mx - 30, my + 22, 60, 6, 'rgba(0,0,0,.35)');
      // la carcassa in vendita
      if (S.wreck) {
        const c = S.wreck, k = Math.min(1.15, 260 / c.width), w = c.width * k, h = c.height * k;
        g.save(); g.imageSmoothingEnabled = false; g.translate(360, 300); g.rotate(-0.02); g.drawImage(c, -w / 2, -h, w, h); g.restore();
        box(g, 432, 256, 46, 26, '#b8a070'); text(g, 'VENDO', 436, 260, '#3a1a0a'); text(g, 'TRATTO', 435, 270, '#3a1a0a');
      } else { text(g, 'OGGI NIENTE CARCASSE', 270, 280, '#8a7a5a'); }
      // bidone col fuoco
      box(g, 116, 270, 30, 40, '#4a4a4a'); R(g, 116, 282, 30, 2, '#3a3a3a'); R(g, 116, 298, 30, 2, '#3a3a3a');
      for (let k = 0; k < 8; k++) { const f = Math.sin(t * 9 + k * 1.3) * 0.5 + 0.5, h = 8 + f * 14; R(g, 118 + k * 3.4, 270 - h, 3, h, k % 3 === 0 ? '#ffd23f' : k % 2 ? '#ff7a1e' : '#ff4a1a'); }
      glow(g, 131, 262, 70, '255,130,40', 0.32 + 0.08 * Math.sin(t * 7));
      for (let k = 0; k < 6; k++) { const ph = (t * 0.7 + k * 0.37) % 1; P(g, 125 + Math.sin(k * 3 + t) * 10, 262 - ph * 70, `rgba(255,${150 + k * 15},60,${1 - ph})`); }
      // il ferrovecchio con la smerigliatrice: scintille
      person(g, 200, 318, { skin: '#c88a62', hair: '#5a5a5a', hairStyle: 'bald', overalls: '#3a4a2a', cap: '#2a2a2a', beard: '#6a6a6a', pose: 'tool', s: 1.2, seed: 3.3 }, t);
      if (Math.sin(t * 1.3) > -0.2) for (let k = 0; k < 12; k++) { const a2 = -0.6 + Math.random() * 1.2, d = Math.random() * 30; P(g, 237 + Math.cos(a2) * d, 252 + Math.sin(a2) * d * 0.6 + d * 0.2, Math.random() < 0.5 ? '#ffd23f' : '#ffffff'); }
      if (Math.sin(t * 1.3) > -0.2) glow(g, 237, 252, 24, '255,210,120', 0.35);
      // il cane che dorme sulla coperta (respira)
      const br = Math.sin(t * 1.4) * 0.8;
      R(g, 300, 334, 54, 6, '#5a2a2a'); g.fillStyle = '#0a0a10'; g.beginPath(); g.ellipse(326, 330 - br / 2, 21, 8 + br / 2, 0, 0, 7); g.fill(); g.fillStyle = '#8a6a4a'; g.beginPath(); g.ellipse(326, 330 - br / 2, 19, 6.5 + br / 2, 0, 0, 7); g.fill();
      R(g, 304, 322, 12, 9, '#0a0a10'); R(g, 305, 323, 10, 7, '#8a6a4a'); R(g, 304, 320, 4, 4, '#5a4a2a'); R(g, 306, 326, 2, 1, '#0a0a10');
      if ((t % 6) < 2) text(g, 'Z', 300, 306 - (t % 2) * 6, '#8a8f9e');
      glow(g, 69, 50, 26, '255,240,200', 0.4);
    },
    hot: [{ x: 250, y: 200, w: 240, h: 100, label: 'La carcassa', go: 'La carcassa' }, { x: 100, y: 220, w: 140, h: 100, label: 'Rovista', go: 'Rovista' }, { x: 250, y: 20, w: 240, h: 150, label: 'Pezzi usati', go: 'Pezzi usati' }],
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
  let lastKey = '';
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
    const k = fitKey(); if (k !== lastKey) { lastKey = k; resize(); }
    alpha = closing ? Math.max(0, alpha - 0.06) : Math.min(1, alpha + 0.06);
    cv.style.opacity = String(alpha);
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
  function stop() { cancelAnimationFrame(raf); raf = 0; cur = null; closing = false; if (cv) { cv.style.opacity = '0'; cv.style.pointerEvents = 'none'; } if (tag) tag.style.opacity = 0; }

  window.NightInterni = {
    SCENE,
    // gli attrezzi di disegno, per le scene scritte in altri file (interni_hd.js)
    kit: { W, H, rng, R, P, shade, shade2, glow, cone, text, textW, neon, carPic, traffic, rain, drops, frame, clock, bottles, wood, outside, person, BAYER },
    open(place) {
      const id = place && place.id; if (!SCENE[id]) return false;
      mount(); if (!cv) return false;
      if (cur && cur.id === id && !closing) return true;               // il pannello si ridisegna: la scena resta
      const S = {}; setSS(SCENE[id].ss || 1); bgg.setTransform(SSc, 0, 0, SSc, 0, 0); bgg.clearRect(0, 0, W, H); bgg.imageSmoothingEnabled = false; SCENE[id].static(bgg, rng(id.length * 977 + 13), S);
      cur = { id, S }; closing = false; t0 = performance.now(); cv.style.pointerEvents = 'auto'; resize();
      if (!raf) raf = requestAnimationFrame(draw);
      AMB.start(SCENE[id].amb);
      return true;
    },
    close() { if (!cur) return; closing = true; AMB.stop(); },
    get current() { return cur && cur.id; },
    // da coordinate della scena (640×360) a coordinate dello schermo (per le prove)
    point(x, y) { if (!cv) return null; const b = cv.getBoundingClientRect(), dpr = cv.width / b.width; return { x: b.left + (fit.ox + x * fit.s) / dpr, y: b.top + (fit.oy + y * fit.s) / dpr }; },
  };
  window.addEventListener('resize', resize);
})();
