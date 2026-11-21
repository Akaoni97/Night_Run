// Scritte da fumetto in stile anime (dopo effetti2d.js, prima di meteo2d.js che si aggancia a drawComics).
// Le scritte sono le stesse di sempre (BANG!, CRASH!, PSSSH!...), ma ora hanno più voci per ogni rumore, più forme
// (scoppio a stella, esplosione irregolare, nuvoletta, strisce di velocità, raggi), testo a due colori con ombra e riflesso,
// puntini da retino, scintille e raggi d'urto. Impostazioni → Grafica → Grafiche anime le spegne (`street2d.comicsOn`).
//
//   Street2D.prototype.comicEv(tipo, x, y, pot)   scrive la scritta di un evento: sceglie voce, colori e forma
//   Street2D.prototype.comic(testo, x, y, col, size, burst, opzioni)   scritta a mano (opzioni: col2, shadow, shape, ...)
//   Street2D.COMIC_TIPI                            i tipi di evento, con le loro voci (provati in test/fumetti.test.js)
(function () {
  'use strict';
  if (typeof Street2D === 'undefined') return;
  const P = Street2D.prototype;

  // il carattere a pixel 3×5 non aveva W, X e Y: servono a WHAM!, KAPOW!, BIP BIP...
  Object.assign(PX_FONT, { W: '101101101111101', X: '101101010101101', Y: '101101010010010' });

  // ---------------------------------------------------------------- i tipi di evento
  // voci: quelle tra cui si sceglie a caso; size: grandezza del carattere; shape: star, jag, cloud, speed, rays, none
  const T = {
    scoppioL: { voci: ['POP!', 'PAF!', 'PAH!', 'TAC!', 'BRAP!', 'PAM!', 'BRRP!', 'PA-PAM!'], size: 3, col: '#ff5a1a', col2: '#ffb000', burst: '#ffd23f', shadow: null, shape: 'star', sparks: 3, life: 0.9 },
    scoppioF: { voci: ['BANG!', 'BOOM!', 'KABOOM!', 'BLAM!', 'BRAAAP!', 'PA-PAM!', 'WHAM!', 'KAPOW!'], size: 4, col: '#ffd23f', col2: '#ff8a2a', burst: '#ff2e1a', shadow: null, shape: 'jag', sparks: 5, life: 1 },
    colpo: { voci: ['CRASH!', 'SBAM!', 'KRAAASH!', 'CRUNCH!', 'SBENG!', 'WHAM!', 'CLANG!', 'KRAK!'], size: 5, col: '#ff2e4d', col2: '#ff6a4d', burst: '#ffd23f', shadow: null, shape: 'jag', sparks: 6, rays: true, life: 1.1 },
    colpoDietro: { voci: ['BANG!', 'SBAM!', 'BAM!', 'TUMP!', 'WHAM!', 'KRAK!'], size: 5, col: '#ff2e4d', col2: '#ff6a4d', burst: '#ffd23f', shadow: null, shape: 'jag', sparks: 6, rays: true, life: 1.1 },
    colpoLieve: { voci: ['BONK!', 'TOC!', 'TUMP!', 'BUMP!', 'TONK!', 'PUF!'], size: 3, col: '#ff8a4d', col2: '#ffb000', burst: '#ffe9a0', shadow: null, shape: 'star', sparks: 2, life: 0.85 },
    strisciata: { voci: ['SCRAAAPE!', 'SKREEEK!', 'FRRRSH!', 'KRRRRK!', 'SCRIIIK!'], size: 3, col: '#ffb000', col2: '#fff0c0', burst: null, shadow: null, shape: 'none', sparks: 0, life: 0.9 },
    sfiato: { voci: ['PSSSH!', 'PSHHH!', 'TSSS!', 'FSSSH!', 'SHHHT!', 'PFFFT!', 'TSHHH!'], size: 3, col: '#2ee6ff', col2: '#b8f4ff', burst: null, shadow: null, shape: 'puff', sparks: 0, life: 0.9 },
    cambio: { voci: ['GRRRK!', 'KRRRK!', 'GRAAAK!', 'CRRRK!', 'KRUNCH!'], size: 3, col: '#ffb000', col2: '#ff8a2a', burst: null, shadow: null, shape: 'none', sparks: 3, life: 0.9 },
    clacson: { voci: ['BEEEP!', 'HONK!', 'PEEEP!', 'TUUUT!', 'BIP BIP!', 'BEEP!'], size: 2, col: '#ffe14d', col2: '#ffb000', burst: null, shadow: null, shape: 'rays', sparks: 0, life: 0.9 },
    frenata: { voci: ['SCREEECH!', 'SKRRRT!', 'SCRIIIK!', 'SKREEE!', 'SCRRRIIK!'], size: 2, col: '#f4f1e6', col2: '#cfd6ff', burst: null, shadow: null, shape: 'none', sparks: 0, life: 1 },
    partenza: { voci: ['VROOOM!', 'BRRROOM!', 'VRUUUM!', 'RRROAR!', 'ZOOOM!', 'BRAAAAP!'], size: 4, col: '#ffd23f', col2: '#ff8a2a', burst: null, shadow: null, shape: 'speed', sparks: 0, life: 1.1 },
    sfiora: { voci: ['SWOOSH!', 'ZUUUM!', 'FIUUU!', 'WOOOSH!', 'ZIIIP!'], size: 3, col: '#ffffff', col2: '#9fe0ff', burst: null, shadow: null, shape: 'speed', sparks: 0, life: 0.8 },
  };
  Street2D.COMIC_TIPI = T;

  // la voce di un tipo: non due volte di seguito la stessa
  function voce(tipo, last) {
    const v = T[tipo].voci; let w = v[Math.floor(Math.random() * v.length)];
    if (v.length > 1 && w === last) w = v[(v.indexOf(w) + 1) % v.length];
    return w;
  }
  const fr = (n) => n - Math.floor(n);
  const ease = (a) => 1 - Math.pow(1 - Math.min(1, Math.max(0, a)), 3);

  // ---------------------------------------------------------------- scrivere
  P.comic = function (text, x, y, col, size = 3, burst = null, o = null) {
    if (this.comicsOn === false) return;
    if (this.comics.length > 8) this.comics.shift();
    this.comics.push(Object.assign({ text, x, y, col, size, burst, t: 0, life: 1.0, j: Math.random() * 6.28, shape: burst ? 'star' : 'none' }, o || {}));
  };
  P.comicEv = function (tipo, x, y, pot = 1, extra = null) {
    if (this.comicsOn === false || !T[tipo]) return;
    this._cLast = this._cLast || {};
    const s = T[tipo], text = voce(tipo, this._cLast[tipo]);
    this._cLast[tipo] = text;
    const o = { col2: s.col2, shadow: s.shadow, shape: s.shape, sparks: s.sparks, rays: !!s.rays, life: s.life * (0.9 + 0.2 * Math.min(1.5, pot)), dir: s.shape === 'speed' ? -1 : 0 };
    this.comic(text, x, y, s.col, s.size, s.burst, o);
    if (extra) Object.assign(this.comics[this.comics.length - 1], extra);
  };

  // ---------------------------------------------------------------- disegnare
  P.drawComics = function (g, dt) {
    const ink = this.C.ink;
    for (const c of this.comics) {
      c.t += dt;
      if (c.t < 0) continue;                                                   // scritta ritardata (l'eco dell'urto)
      const s = c.t < 0.14 ? 0.3 + 1.05 * ease(c.t / 0.14) : Math.max(1, 1.35 - (c.t - 0.14) * 1.4);
      const sz = Math.max(1, Math.round(c.size * s)), w = this.textW(c.text, sz), hh = 5 * sz;
      const shake = c.t < 0.3 ? 2 : 0.5;
      const cx = Math.round(c.x + Math.sin(c.t * 30 + c.j) * shake + (c.dx || 0) * c.t), cy = Math.round(c.y - c.t * (c.rise ?? 18));
      const fade = c.t > c.life - 0.2 ? Math.max(0, (c.life - c.t) / 0.2) : 1;
      g.save(); g.globalAlpha = fade;
      const R = w * 0.62 + 8;

      // ---- forma dietro la scritta
      if (c.burst && c.shape === 'cloud') { /* niente nuvole: coprivano l'auto */ }
      else if (c.burst && c.shape === 'jag') this._comicBurst(g, c, cx, cy, R, ink, true);
      else if (c.burst && c.shape === 'star') this._comicBurst(g, c, cx, cy, R, ink, false);
      if (c.shape === 'puff') this._comicPuff(g, c, cx, cy, w, hh, ink);
      if (c.shape === 'speed') this._comicSpeed(g, c, cx, cy, w, hh, sz, ink);
      if (c.shape === 'rays') this._comicRays(g, c, cx, cy, w, hh, ink);
      if (c.rays && c.t < 0.22) this._comicImpact(g, c, cx, cy, R, ink);
      if (c.sparks) this._comicSparks(g, c, cx, cy, R);

      // ---- testo: contorno, ombra colorata, colore, seconda tinta in basso e riflesso in alto
      const x0 = cx - Math.round(w / 2), y0 = cy - Math.round(hh / 2), u = Math.max(1, sz >> 1);
      if (c.shadow) this.text(g, c.text, x0 + u, y0 + u, c.shadow, sz);
      for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [1, -1], [-1, 1], [2, 2]]) this.text(g, c.text, x0 + ox * u, y0 + oy * u, ink, sz);
      this.text(g, c.text, x0, y0, c.col, sz);
      if (c.col2) { g.save(); g.beginPath(); g.rect(x0 - 4, y0 + Math.round(hh * 0.55), w + 8, hh); g.clip(); this.text(g, c.text, x0, y0, c.col2, sz); g.restore(); }
      g.save(); g.beginPath(); g.rect(x0 - 4, y0 - 1, w + 8, Math.max(1, Math.round(hh * 0.3))); g.clip(); this.text(g, c.text, x0, y0, 'rgba(255,255,255,.45)', sz); g.restore();
      g.restore();
    }
    this.comics = this.comics.filter((c) => c.t < c.life);
  };

  // scoppio: stella regolare o esplosione irregolare, contorno, colore, centro chiaro e puntini da retino
  P._comicBurst = function (g, c, cx, cy, R1, ink, irregular) {
    const n = irregular ? 11 : 12, R2 = R1 * (irregular ? 0.55 : 0.62), flat = 0.62, rot = c.j + c.t * (irregular ? 0 : 0.8);
    const path = (r1, r2, grow) => {
      g.beginPath();
      for (let i = 0; i < n * 2; i++) {
        const a = i * Math.PI / n + rot, k = i % 2 ? r2 : r1 * (irregular ? 0.78 + 0.45 * fr(Math.sin(i * 12.9898 + c.j * 78.233) * 43758.5) : 1);
        g.lineTo(cx + Math.cos(a) * (k + grow), cy + Math.sin(a) * (k + grow) * flat);
      }
      g.closePath();
    };
    g.fillStyle = ink; path(R1, R2, 3); g.fill();
    g.fillStyle = c.burst; path(R1, R2, 0); g.fill();
    g.save(); path(R1, R2, 0); g.clip();                                       // retino: puntini più scuri in basso a destra
    g.fillStyle = Street2D.shade ? Street2D.shade(c.burst, -0.22) : 'rgba(0,0,0,.2)';
    for (let yy = -R1; yy < R1; yy += 4) for (let xx = -R1; xx < R1; xx += 4) if (xx + yy * 1.4 > R1 * 0.2) g.fillRect(cx + xx + (((yy / 4) & 1) ? 2 : 0), cy + yy * flat, 2, 2);
    g.restore();
    g.fillStyle = '#fff6c2'; path(R1 * 0.55, R2 * 0.55, 0); g.fill();
    if (c.t < 0.06) { g.fillStyle = 'rgba(255,255,255,.85)'; path(R1 * 0.9, R2 * 0.9, 0); g.fill(); }   // lampo del primo istante
  };
  // sfiato: tre sbuffi tondi che salgono dalla scritta
  P._comicPuff = function (g, c, cx, cy, w, hh, ink) {
    for (let i = 0; i < 3; i++) {
      const px = cx - w * 0.5 + 4 + i * (w / 3) + Math.sin(c.t * 9 + i) * 1.5, py = cy - hh * 0.5 - 4 - c.t * (10 + i * 6) - i * 2, r = 2.5 + i * 0.8 + c.t * 3;
      g.globalAlpha *= Math.max(0, 1 - c.t * 1.1);
      g.fillStyle = ink; g.beginPath(); g.arc(px, py, r + 1.5, 0, 7); g.fill();
      g.fillStyle = i % 2 ? '#e8fbff' : '#b8f4ff'; g.beginPath(); g.arc(px, py, r, 0, 7); g.fill();
      g.globalAlpha /= Math.max(0.0001, 1 - c.t * 1.1);
    }
  };
  // strisce di velocità dietro la scritta (VROOOM, SCREEECH, SWOOSH)
  P._comicSpeed = function (g, c, cx, cy, w, hh, sz, ink) {
    const dir = c.dir || -1, ext = Math.min(1, c.t / 0.18);
    for (let i = 0; i < 4; i++) {
      const yy = cy - hh * 0.55 + i * hh * 0.36, len = (10 + 14 * fr(Math.sin(i * 5.7 + c.j) * 999)) * ext * (1 + sz * 0.1);
      const x1 = cx + dir * (w * 0.5 + 3 + (i % 2) * 4), x2 = x1 + dir * len, a = Math.min(x1, x2), l = Math.abs(len);
      g.fillStyle = ink; g.fillRect(a - 1, Math.round(yy) - 1, l + 2, 3);
      g.fillStyle = i % 2 ? (c.col2 || c.col) : '#ffffff'; g.fillRect(a, Math.round(yy), l, 1);
    }
  };
  // raggi tutt'intorno (clacson)
  P._comicRays = function (g, c, cx, cy, w, hh, ink) {
    const k = 0.6 + 0.4 * Math.sin(c.t * 24);
    for (let i = 0; i < 7; i++) {
      const a = -2.9 + i * 0.32 + c.j * 0.02, r1 = w * 0.5 + 6, r2 = r1 + 7 + 6 * k;
      for (const [lw, col] of [[3, ink], [1.2, c.col]]) {
        g.strokeStyle = col; g.lineWidth = lw; g.beginPath();
        g.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1 * 0.6); g.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2 * 0.6); g.stroke();
      }
    }
  };
  // raggi d'urto: linee sottili che schizzano via dal centro nei primi istanti
  P._comicImpact = function (g, c, cx, cy, R, ink) {
    const k = 1 - c.t / 0.22, n = 14;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 + c.j, r1 = R * (0.95 + 0.35 * (1 - k)), r2 = r1 + (10 + 18 * fr(Math.sin(i * 3.1 + c.j) * 999)) * k;
      for (const [lw, col] of [[3, ink], [1.2, '#ffffff']]) {
        g.strokeStyle = col; g.lineWidth = lw; g.beginPath();
        g.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1 * 0.62); g.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2 * 0.62); g.stroke();
      }
    }
  };
  // scintille che volano via e cadono
  P._comicSparks = function (g, c, cx, cy, R) {
    const n = c.sparks | 0, tt = c.t;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 + c.j * 1.3 + fr(Math.sin(i * 9.1) * 99) * 0.6, sp = 38 + 52 * fr(Math.sin(i * 4.7 + c.j) * 999);
      const px = cx + Math.cos(a) * (R * 0.7 + sp * tt), py = cy + Math.sin(a) * (R * 0.5 + sp * tt * 0.7) + 70 * tt * tt;
      const al = Math.max(0, 1 - tt / 0.55); if (al <= 0) continue;
      g.globalAlpha *= al;
      g.fillStyle = this.C.ink; g.fillRect(Math.round(px) - 1, Math.round(py) - 1, 3, 3);
      g.fillStyle = i % 2 ? '#ffffff' : (c.burst || c.col); g.fillRect(Math.round(px), Math.round(py), 1, 1);
      g.globalAlpha /= al;
    }
  };
})();
