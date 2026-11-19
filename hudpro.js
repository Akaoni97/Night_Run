// ============================================================================
//  Night Run · cruscotto in gioco "Originale" in alta definizione (non a pixel)
//  Tachimetro e contagiri nello stile del quadro vero di ogni auto (CLUSTERS in cars.js), con benzina e acqua
//  dentro i quadranti come sulle auto vere; al centro il display: marcia, km, parziale, autonomia, consumo medio,
//  pressione delle gomme; sotto gli strumenti tuning scelti dal pilota (turbo, olio, acqua, pressione olio, volt, AFR).
// ============================================================================
const HUD_PODS = {
  boost: { name: 'Turbo', unit: 'bar', min: -1, max: 2, red: 1.6, fmt: (v) => (v >= 0 ? '+' : '') + v.toFixed(2) },
  oilT: { name: 'Olio', unit: '°C', min: 40, max: 150, red: 125, fmt: (v) => Math.round(v) },
  waterT: { name: 'Acqua', unit: '°C', min: 40, max: 130, red: 108, fmt: (v) => Math.round(v) },
  oilP: { name: 'Press. olio', unit: 'bar', min: 0, max: 8, low: 0.8, fmt: (v) => v.toFixed(1) },
  volt: { name: 'Volt', unit: 'V', min: 8, max: 16, low: 11.6, fmt: (v) => v.toFixed(1) },
  afr: { name: 'AFR', unit: '', min: 10, max: 20, fmt: (v) => v.toFixed(1) },
};
const HUD_PODS_DEFAULT = ['boost', 'oilT', 'waterT', 'oilP'];

const HudPro = {
  cache: new Map(),
  // quadrante fisso (in cache): cornice, scala, numeri, zona rossa, scritte
  face(kind, cl, R, red, max, dpr) {
    const key = [kind, cl.brand, cl.model, R, red, max, dpr].join('|');
    if (this.cache.has(key)) return this.cache.get(key);
    const size = Math.ceil((R * 2 + 12) * dpr), c = document.createElement('canvas'); c.width = c.height = size;
    const g = c.getContext('2d'); g.scale(dpr, dpr); g.translate(R + 6, R + 6);
    const a0 = Math.PI * 0.75, sw = Math.PI * 1.5, A = (v) => a0 + sw * v / max;
    // cornice (cromata sulla 2002) e quadrante
    const bz = g.createLinearGradient(0, -R, 0, R); bz.addColorStop(0, cl.chrome ? '#e8ecf2' : cl.bez[0]); bz.addColorStop(0.5, cl.bez[1]); bz.addColorStop(1, cl.chrome ? '#8a9098' : cl.bez[2]);
    g.beginPath(); g.arc(0, 0, R + 5, 0, 7); g.fillStyle = bz; g.fill();
    const fc = g.createRadialGradient(0, -R * 0.3, R * 0.1, 0, 0, R); fc.addColorStop(0, cl.face[0]); fc.addColorStop(1, cl.face[1]);
    g.beginPath(); g.arc(0, 0, R, 0, 7); g.fillStyle = fc; g.fill();
    const gl = g.createRadialGradient(0, R * 0.5, 2, 0, R * 0.4, R); gl.addColorStop(0, cl.glow); gl.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gl; g.beginPath(); g.arc(0, 0, R, 0, 7); g.fill();
    // zona rossa
    if (red) { g.beginPath(); g.arc(0, 0, R * 0.9, A(red), A(max)); g.lineWidth = R * 0.07; g.strokeStyle = '#e8281e'; g.stroke(); }
    // tacche e numeri
    const major = kind === 'tach' ? 1000 : max <= 200 ? 20 : 20, label = kind === 'tach' ? 1000 : max <= 200 ? 20 : 40;
    g.shadowColor = cl.glow; g.shadowBlur = R * 0.06;
    for (let v = 0; v <= max + 1e-6; v += major / 2) {
      const a = A(v), maj = Math.abs(v / major - Math.round(v / major)) < 1e-6, r0 = R * (maj ? 0.8 : 0.86);
      g.beginPath(); g.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); g.lineTo(Math.cos(a) * R * 0.94, Math.sin(a) * R * 0.94);
      g.lineWidth = maj ? R * 0.028 : R * 0.012; g.strokeStyle = red && v >= red ? '#ff5a3a' : cl.num; g.stroke();
      if (maj && Math.abs(v / label - Math.round(v / label)) < 1e-6) {
        g.font = `600 ${Math.round(R * 0.15)}px ${cl.font}`; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillStyle = red && v >= red ? '#ff5a3a' : cl.num; g.fillText(String(kind === 'tach' ? v / 1000 : v), Math.cos(a) * R * 0.65, Math.sin(a) * R * 0.65);
      }
    }
    g.shadowBlur = 0;
    g.fillStyle = cl.num; g.globalAlpha = 0.8; g.textAlign = 'center';
    g.font = `700 ${Math.round(R * 0.11)}px ${cl.font}`; g.fillText(kind === 'tach' ? cl.brand : cl.brand.split(' ')[0], 0, -R * 0.36);
    g.font = `500 ${Math.round(R * 0.075)}px ${cl.font}`; g.fillText(kind === 'tach' ? '× 1000 r/min' : 'km/h', 0, -R * 0.22);
    g.globalAlpha = 1;
    if (kind === 'tach' && cl.m) [['#5bc0ff', -1], ['#1a3d9a', 0], ['#e8281e', 1]].forEach(([col, k]) => { g.fillStyle = col; g.fillRect(k * R * 0.08 - R * 0.035, -R * 0.13, R * 0.07, R * 0.03); });
    this.cache.set(key, c); return c;
  },
  needle(g, cx, cy, R, frac, col, glow) {
    const a = Math.PI * 0.75 + Math.PI * 1.5 * Math.max(0, Math.min(1.02, frac));
    g.save(); g.translate(cx, cy); g.rotate(a); g.shadowColor = glow; g.shadowBlur = R * 0.12;
    g.beginPath(); g.moveTo(-R * 0.14, -R * 0.025); g.lineTo(R * 0.88, -R * 0.008); g.lineTo(R * 0.9, 0); g.lineTo(R * 0.88, R * 0.008); g.lineTo(-R * 0.14, R * 0.025); g.closePath();
    g.fillStyle = col; g.fill(); g.restore();
    const hub = g.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, R * 0.09); hub.addColorStop(0, '#5a5c62'); hub.addColorStop(1, '#0a0a0b');
    g.beginPath(); g.arc(cx, cy, R * 0.09, 0, 7); g.fillStyle = hub; g.fill();
  },
  // piccolo arco dentro il quadrante (benzina, acqua) come sui quadri veri
  subArc(g, cx, cy, r, frac, cl, l0, l1, warn) {
    const a0 = Math.PI * 0.82, a1 = Math.PI * 0.18, f = Math.max(0, Math.min(1, frac));   // arco in basso, da sinistra a destra
    g.save(); g.lineCap = 'round'; g.lineWidth = 3;
    g.beginPath(); g.arc(cx, cy, r, a0, a1, true); g.strokeStyle = 'rgba(255,255,255,.12)'; g.stroke();
    if (f > 0.005) { g.beginPath(); g.arc(cx, cy, r, a0, a0 - (a0 - a1) * f, true); g.strokeStyle = warn ? '#ff3a24' : cl.needle; g.shadowColor = warn ? '#ff3a24' : cl.glow; g.shadowBlur = 6; g.stroke(); }
    g.shadowBlur = 0; g.font = `600 9px ${cl.font}`; g.fillStyle = cl.num; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(l0, cx + Math.cos(a0) * (r + 8), cy + Math.sin(a0) * (r + 8)); g.fillText(l1, cx + Math.cos(a1) * (r + 8), cy + Math.sin(a1) * (r + 8));
    g.restore();
  },
  pod(g, cx, cy, r, P, v, cl, lit) {
    const f = (Math.max(P.min, Math.min(P.max, v)) - P.min) / (P.max - P.min), warn = (P.red !== undefined && v >= P.red) || (P.low !== undefined && v < P.low && lit);
    g.save();
    g.beginPath(); g.arc(cx, cy, r + 3, 0, 7); g.fillStyle = '#1a1b1e'; g.fill();
    g.beginPath(); g.arc(cx, cy, r, 0, 7); const fc = g.createRadialGradient(cx, cy - r * 0.4, 1, cx, cy, r); fc.addColorStop(0, '#16181c'); fc.addColorStop(1, '#050506'); g.fillStyle = fc; g.fill();
    const a0 = Math.PI * 0.75, sw = Math.PI * 1.5;
    g.beginPath(); g.arc(cx, cy, r * 0.82, a0, a0 + sw); g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.12)'; g.stroke();
    if (lit) { g.beginPath(); g.arc(cx, cy, r * 0.82, a0, a0 + sw * f); g.lineWidth = 3; g.strokeStyle = warn ? '#ff3a24' : cl.needle; g.shadowColor = warn ? '#ff3a24' : cl.glow; g.shadowBlur = 8; g.stroke(); g.shadowBlur = 0; }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `700 ${Math.round(r * 0.42)}px "Share Tech Mono", monospace`; g.fillStyle = lit ? (warn ? '#ff5a3a' : cl.lcd) : '#2a2b2e'; g.fillText(lit ? String(P.fmt(v)) : '—', cx, cy + r * 0.02);
    g.font = `500 ${Math.round(r * 0.26)}px "Barlow Semi Condensed", sans-serif`; g.fillStyle = cl.num; g.globalAlpha = 0.75; g.fillText(P.name.toUpperCase(), cx, cy + r * 0.48); g.fillText(P.unit, cx, cy - r * 0.42); g.globalAlpha = 1;
    g.restore();
  },
  // una spia: icona semplice in un quadrato di lato 2r, centrata in (x, y)
  spia(g, id, x, y, r, col, on) {
    g.save(); g.translate(x, y); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 1.3; g.lineCap = 'round'; g.lineJoin = 'round';
    if (on) { g.shadowColor = col; g.shadowBlur = 7; }
    const P = (pts) => { g.beginPath(); pts.forEach(([a, b], i) => (i ? g.lineTo(a * r, b * r) : g.moveTo(a * r, b * r))); };
    if (id === 'motore') { P([[-0.9, -0.2], [-0.6, -0.2], [-0.6, -0.5], [0.4, -0.5], [0.6, -0.2], [0.9, -0.2], [0.9, 0.6], [-0.6, 0.6], [-0.6, 0.3], [-0.9, 0.3], [-0.9, -0.2]]); g.stroke(); P([[-0.2, -0.5], [-0.2, -0.8], [0.2, -0.8]]); g.stroke(); }
    else if (id === 'olio') { P([[-0.9, 0.5], [0.5, 0.5], [0.9, -0.3], [-0.4, -0.3], [-0.9, -0.1], [-0.9, 0.5]]); g.stroke(); P([[0.9, -0.3], [1.0, 0]]); g.stroke(); g.beginPath(); g.arc(0.95 * r, 0.45 * r, 0.12 * r, 0, 7); g.fill(); }
    else if (id === 'temp') { P([[0, -0.9], [0, 0.35]]); g.stroke(); g.beginPath(); g.arc(0, 0.55 * r, 0.25 * r, 0, 7); g.fill(); P([[0, -0.6], [0.35, -0.6]]); g.stroke(); P([[0, -0.25], [0.35, -0.25]]); g.stroke(); P([[-0.9, 0.85], [-0.45, 0.7], [0, 0.85], [0.45, 0.7], [0.9, 0.85]]); g.stroke(); }
    else if (id === 'freni') { g.beginPath(); g.arc(0, 0, 0.6 * r, 0, 7); g.stroke(); g.beginPath(); g.arc(0, 0, 0.9 * r, 2.3, 4); g.stroke(); g.beginPath(); g.arc(0, 0, 0.9 * r, -0.85, 0.85); g.stroke(); P([[0, -0.35], [0, 0.1]]); g.stroke(); g.beginPath(); g.arc(0, 0.32 * r, 0.08 * r, 0, 7); g.fill(); }
    else if (id === 'luci') { g.beginPath(); g.moveTo(-0.1 * r, -0.6 * r); g.quadraticCurveTo(-0.95 * r, 0, -0.1 * r, 0.6 * r); g.closePath(); g.stroke(); for (const k of [-0.45, 0, 0.45]) { P([[0.15, k], [0.9, k + 0.15]]); g.stroke(); } P([[-0.9, -0.9], [0.9, 0.9]]); g.stroke(); }
    else if (id === 'batteria') { g.strokeRect(-0.9 * r, -0.45 * r, 1.8 * r, 1.2 * r); g.fillRect(-0.65 * r, -0.7 * r, 0.3 * r, 0.25 * r); g.fillRect(0.35 * r, -0.7 * r, 0.3 * r, 0.25 * r); P([[-0.6, 0.1], [-0.2, 0.1]]); g.stroke(); P([[0.2, 0.1], [0.6, 0.1]]); g.stroke(); P([[0.4, -0.1], [0.4, 0.3]]); g.stroke(); }
    else if (id === 'gomme') { g.beginPath(); g.moveTo(-0.75 * r, -0.7 * r); g.quadraticCurveTo(-1 * r, 0.3 * r, -0.5 * r, 0.75 * r); g.lineTo(0.5 * r, 0.75 * r); g.quadraticCurveTo(1 * r, 0.3 * r, 0.75 * r, -0.7 * r); g.stroke(); P([[0, -0.45], [0, 0.15]]); g.stroke(); g.beginPath(); g.arc(0, 0.42 * r, 0.08 * r, 0, 7); g.fill(); }
    else if (id === 'benzina') { g.strokeRect(-0.8 * r, -0.75 * r, 1 * r, 1.55 * r); g.fillRect(-0.65 * r, -0.6 * r, 0.7 * r, 0.4 * r); P([[0.2, -0.3], [0.65, -0.3], [0.65, 0.5], [0.9, 0.5], [0.9, -0.5], [0.6, -0.8]]); g.stroke(); }
    g.restore();
  },
  // disegna tutto il cruscotto su un canvas logico W×H (già scalato per il DPR)
  draw(g, W, H, d, cl, dpr) {
    g.clearRect(0, 0, W, H);
    const lit = d.lit;
    // palpebra del cruscotto
    const pg = g.createLinearGradient(0, 0, 0, H); pg.addColorStop(0, 'rgba(10,10,12,.86)'); pg.addColorStop(1, 'rgba(4,4,6,.94)');
    g.fillStyle = pg; g.beginPath(); (g.roundRect ? g.roundRect(0, 16, W, H - 16, 22) : g.rect(0, 16, W, H - 16)); g.fill();
    g.strokeStyle = cl.bez[0]; g.lineWidth = 1.5; g.stroke();
    const R = 86, ly = 118, sx = 104, tx = W - 104;
    // tachimetro (con la benzina) e contagiri (con l'acqua)
    g.drawImage(this.face('speed', cl, R, 0, cl.speed, dpr), sx - R - 6, ly - R - 6, R * 2 + 12, R * 2 + 12);
    g.drawImage(this.face('tach', cl, R, d.red * 1000, cl.tach * 1000, dpr), tx - R - 6, ly - R - 6, R * 2 + 12, R * 2 + 12);
    this.subArc(g, sx, ly, R * 0.42, lit ? d.fuel : 0, cl, 'E', 'F', lit && d.fuel < 0.12);
    this.subArc(g, tx, ly, R * 0.42, lit ? (d.waterT - 40) / 90 : 0, cl, 'C', 'H', lit && d.waterT > 108);
    // cifre dentro i quadranti
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `700 22px "Share Tech Mono", monospace`; g.fillStyle = lit ? cl.lcd : '#2a2b2e'; g.fillText(lit ? String(Math.round(d.kmh)) : '', sx, ly + R * 0.62);
    g.font = `700 26px ${cl.font}`; g.fillStyle = d.shiftNow ? '#b8ff3a' : d.over ? '#ff3a24' : lit ? cl.lcd : '#2a2b2e'; g.fillText(d.gear, tx, ly + R * 0.6);
    this.needle(g, sx, ly, R, d.kmh / cl.speed, lit ? cl.needle : '#5a2a14', cl.glow);
    this.needle(g, tx, ly, R, d.rpm / (cl.tach * 1000), lit ? cl.needle : '#5a2a14', cl.glow);
    // luci della cambiata in alto
    for (let i = 0; i < 5; i++) {
      const x = W / 2 - 52 + i * 26, on = d.lights[i];
      g.beginPath(); g.arc(x, 14, 8, 0, 7); g.fillStyle = '#0a0a0b'; g.fill();
      g.beginPath(); g.arc(x, 14, 6, 0, 7); g.fillStyle = on || '#1c1e22'; if (on) { g.shadowColor = on; g.shadowBlur = 12; } g.fill(); g.shadowBlur = 0;
    }
    // display centrale
    const cx0 = sx + R + 14, cw = tx - R - 14 - cx0, cy0 = 34;
    g.fillStyle = 'rgba(0,0,0,.6)'; g.beginPath(); (g.roundRect ? g.roundRect(cx0, cy0, cw, 106, 8) : g.rect(cx0, cy0, cw, 106)); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.08)'; g.stroke();
    g.textAlign = 'left'; const col = lit ? cl.lcd : '#2a2b2e', dim = lit ? cl.num : '#2a2b2e';
    const line = (y, k, v) => { g.font = `500 10px "Barlow Semi Condensed", sans-serif`; g.globalAlpha = 0.7; g.fillStyle = dim; g.fillText(k, cx0 + 8, y); g.globalAlpha = 1; g.font = `700 13px "Share Tech Mono", monospace`; g.fillStyle = col; g.textAlign = 'right'; g.fillText(v, cx0 + cw - 8, y); g.textAlign = 'left'; };
    line(cy0 + 12, 'KM AUTO', d.odo); line(cy0 + 27, d.tripName, d.trip);
    line(cy0 + 42, 'AUTONOMIA', d.range); line(cy0 + 57, 'MEDIA', d.cons);
    // benzina: barra con litri
    const fw = cw - 86;
    g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(cx0 + 8, cy0 + 72, fw, 6);
    g.fillStyle = d.fuel < 0.12 ? '#ff3a24' : cl.needle; g.fillRect(cx0 + 8, cy0 + 72, fw * (lit ? d.fuel : 0), 6);
    g.font = `500 10px "Barlow Semi Condensed", sans-serif`; g.fillStyle = dim; g.fillText('BENZINA ' + d.liters, cx0 + 8, cy0 + 92);
    // pressione gomme: sagoma vista dall'alto
    const px = cx0 + cw - 58, py = cy0 + 78;
    g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 1; g.strokeRect(px + 14, py, 20, 26);
    d.tyres.forEach((p, i) => {
      const x = px + (i % 2 ? 36 : 0), y = py + (i < 2 ? 0 : 16), bad = p < 1.9, flat = p < 1.0;
      g.fillStyle = !lit ? '#2a2b2e' : flat ? '#ff3a24' : bad ? '#ffb000' : cl.lcd; g.font = `700 10px "Share Tech Mono", monospace`;
      g.fillText(p.toFixed(1), x, y + 9);
    });
    g.font = `500 8px "Barlow Semi Condensed", sans-serif`; g.fillStyle = dim; g.fillText('GOMME · bar', px, py - 4);
    // strumenti tuning
    const pods = d.pods, pr = 23, n = pods.length;
    pods.forEach((p, i) => { const P = HUD_PODS[p.id]; if (!P) return; this.pod(g, W / 2 + (i - (n - 1) / 2) * (pr * 2 + 10), H - pr - 10, pr, P, p.v, cl, lit && p.on !== false); });
    // spie dello stato dell'auto: una fila sotto il display centrale, spente al buio, accese nel loro colore
    const blink = Math.floor(performance.now() / 300) % 2;
    if (d.spie) {
      const n = d.spie.length, step = Math.min(19, cw / n), s0 = cx0 + (cw - step * n) / 2;
      d.spie.forEach((sp, i) => {
        const on = sp.on && (!sp.blink || blink), x = s0 + i * step + step / 2, y = cy0 + 106 + 16;
        this.spia(g, sp.id, x, y, Math.min(8.5, step * 0.42), on ? sp.col : 'rgba(255,255,255,.07)', on);
      });
    }
    g.font = `700 11px "Barlow Semi Condensed", sans-serif`; g.textAlign = 'left';
    let wx = 14; for (const [txt, c2, on] of d.warn) { if (!on) continue; if (c2 === '#ff3a24' && !blink) { wx += 44; continue; } g.fillStyle = c2; g.fillText(txt, wx, 30); wx += 44; }
  },
};
if (typeof window !== 'undefined') Object.assign(window, { HudPro, HUD_PODS, HUD_PODS_DEFAULT });
