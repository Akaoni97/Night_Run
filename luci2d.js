// ============================================================================
//  Luci della vista 2D (si aggancia a Street2D, dopo street2d.js).
//  - lightPass: di notte la strada, i marciapiedi e le auto vanno in penombra bluastra e restano chiare solo
//    le pozze di luce vere: lampioni, vetrine, fari e stop (tuoi e del traffico), fiammate, lampeggianti.
//    È una mappa di luce a risoluzione logica moltiplicata sulla scena sotto i palazzi; la tua auto ha una luce
//    di riempimento, così resta leggibile anche al buio.
//  - lampCone: il cono di luce del lampione nell'aria, con un filo di pulviscolo che ci galleggia dentro.
//  - glowPass: il bagliore a due livelli (stretto e largo) nella presentazione.
//  Le sorgenti si raccolgono durante il disegno (lightAdd) e si consumano a fine scena.
// ============================================================================
(() => {
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, rnd = Street2D.rnd;
  const Y0 = 150, FADE = 214;                                    // la penombra parte dai piani bassi e arriva piena al marciapiede

  // sorgente: ellisse (x, y, rx, ry), colore "r,g,b", intensità 0..1
  // macchia di luce sfumata di un colore (in cache): si disegna ridimensionata invece di ricreare la sfumatura ogni volta
  const blobs = {};
  const blob = (rgb) => {
    if (blobs[rgb]) return blobs[rgb];
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(0.45, `rgba(${rgb},.55)`); gr.addColorStop(1, `rgba(${rgb},0)`); x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    return (blobs[rgb] = c);
  };
  S.lightAdd = function (x, y, rx, ry, rgb, a) { (this._ls || (this._ls = [])).push([x, y, rx, ry, rgb, a]); };

  S.lightPass = function (g, W, night, rain) {
    const L = this._ls || []; this._ls = [];
    if (night < 0.05 || this.quality === 'bassa' || this.noLuci) return;   // noLuci: Prestazioni (prestazioni.js)
    const H = 360 - Y0, c = this._lm || (this._lm = document.createElement('canvas'));
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const x = c.getContext('2d');
    // penombra: blu notte, più scura sotto la pioggia; sfuma verso l'alto per non toccare palazzi e cielo
    const k = night * (rain ? 1.08 : 1), amb = [1 - 0.42 * k, 1 - 0.37 * k, 1 - 0.2 * k].map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255));
    x.globalCompositeOperation = 'source-over';
    x.fillStyle = `rgb(${amb.join(',')})`; x.fillRect(0, 0, W, H);
    const fg = x.createLinearGradient(0, 0, 0, FADE - Y0); fg.addColorStop(0, 'rgba(255,255,255,1)'); fg.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = fg; x.fillRect(0, 0, W, FADE - Y0);
    // le luci rischiarano (si sommano)
    x.globalCompositeOperation = 'lighter';
    for (const [lx, ly, rx, ry, rgb, a] of L) {
      if (lx + rx < 0 || lx - rx > W || a < 0.01) continue;
      x.globalAlpha = Math.min(1, a); x.drawImage(blob(rgb), lx - rx, ly - Y0 - ry, rx * 2, ry * 2);   // sfumatura già pronta, solo ridimensionata
    }
    x.globalAlpha = 1;
    g.save(); g.globalCompositeOperation = 'multiply'; g.imageSmoothingEnabled = true; g.drawImage(c, 0, Y0, W, H); g.restore();
  };

  // cono del lampione nell'aria (x = palo, testa a y 126); col = colore della lampada
  S.lampCone = function (g, x, col, t, rain) {
    if (this.quality === 'bassa' || this.noLuci) return;
    const night = 1 - (this.day || 0); if (night < 0.2) return;
    const hx = x + 19, top = 128, bot = 300, a = (rain ? 0.14 : 0.085) * night, rgb = Street2D.rgb(col);
    const gr = g.createLinearGradient(0, top, 0, bot); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(0.7, `rgba(${rgb},${a * 0.35})`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr;
    g.beginPath(); g.moveTo(hx - 6, top); g.lineTo(hx + 6, top); g.lineTo(hx + 58, bot); g.lineTo(hx - 58, bot); g.closePath(); g.fill();
    // pulviscolo: puntini che salgono e scendono piano dentro il cono
    const u = 1 / (this.SS || 1);
    g.fillStyle = `rgba(${rgb},${0.5 * night})`;
    for (let i = 0; i < (rain ? 4 : 7); i++) {
      const s = x * 0.37 + i * 13.1, py = top + 10 + ((rnd(s) * 150 + t * (4 + rnd(s + 1) * 6)) % 150), w = (py - top) / (bot - top) * 50;
      const px = hx + (rnd(s + 2) - 0.5) * 2 * w + Math.sin(t * 0.7 + s) * 3;
      if (Math.sin(t * (1 + rnd(s + 3) * 2) + s) > -0.2) g.fillRect(px, py, u * 2, u * 2);
    }
    g.restore();
  };

  // bagliore a due livelli: stretto (1/4) per i contorni delle luci, largo (1/8) per l'alone morbido
  S.glowPass = function (c, src, SS) {
    if (typeof c.filter !== 'string' || this.glow === false || (this.quality || 'alta') !== 'alta') return;
    const day = this.day || 0, W2 = c.canvas.width, H2 = c.canvas.height; const todo = [];
    const pass = (key, div, filt, alpha) => {
      const bw = Math.max(1, Math.round(this.LW / div)), bh = Math.max(1, Math.round(360 / div));
      const cv = this[key] || (this[key] = document.createElement('canvas'));
      if (cv.width !== bw || cv.height !== bh) { cv.width = bw; cv.height = bh; }
      const b = cv.getContext('2d'); b.filter = filt; b.clearRect(0, 0, bw, bh);
      b.drawImage(this.lo, src[0] * SS, src[1] * SS, src[2] * SS, src[3] * SS, 0, 0, bw, bh); b.filter = 'none';
      todo.push([cv, alpha]);   // prima si leggono tutti e due dalla scena, poi si sommano (la scena può essere la tela stessa: present a densità vera)
    };
    pass('bl', 4, 'brightness(0.56) contrast(4) saturate(1.4) blur(2px)', 0.52 - day * 0.3);
    if (!this.slow) pass('bl2', 8, 'brightness(0.5) contrast(3.6) saturate(1.6) blur(5px)', 0.42 - day * 0.28);   // il largo si spegne sui dispositivi lenti
    for (const [cv, alpha] of todo) { c.save(); c.imageSmoothingEnabled = true; c.globalCompositeOperation = 'lighter'; c.globalAlpha = alpha; c.drawImage(cv, 0, 0, W2, H2); c.restore(); }
  };
})();
