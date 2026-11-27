'use strict';
// La sigla di Duo Maniacs Studio (v0.168, marchio nuovo nella v0.172): appena si apre il gioco, prima della schermata iniziale.
// Il logo in pixel art (img/dms/logo.png, 200×99: due anelli intrecciati grigio acciaio e rosso cupo su nero, DUO MANIACS grigio chiaro e STUDIO rosso, v0.173, fatto dal logo vettoriale) si compone pixel per pixel:
// all'inizio un punto solo che lampeggia come un fanale lontano, poi pochi pixel che arrivano di corsa da
// destra e sinistra con la scia, sempre più fitti, finché il logo è intero; lampo, bagliore rosa e «PRESENTA».
// Finché il gioco si carica resta solo il fanale che lampeggia (gli script pesanti farebbero andare a scatti il volo):
// la composizione parte all'evento load, o dopo SIG.attesa secondi al massimo. Un clic, un tocco o un tasto la saltano. Una volta per scheda del browser (sessionStorage `nr_sigla`):
// ricaricando la pagina, o dopo «Riavvia», non torna. Non parte nelle prove automatiche (navigator.webdriver),
// con `?sigla=0` o con localStorage `nr_sigla_off = '1'`. Finché c'è, nessun tasto arriva al gioco.
// Va caricato subito dopo leggero.js: l'ascoltatore dei tasti deve venire prima di tutti gli altri.
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const SIG = { img: 'img/dms/logo.png', attesa: 8, buio: 0.35, arrivo: 1.75, volo: 0.75, lampo: 2.75, fine: 4.3, sfuma: 0.55 };
  let off = false;
  try {
    off = !!navigator.webdriver || /[?&]sigla=0\b/.test(location.search) || localStorage.getItem('nr_sigla_off') === '1' || sessionStorage.getItem('nr_sigla') === '1';
    if (/[?&]sigla=1\b/.test(location.search)) off = false;   // per riguardarla a mano
  } catch (e) { /* storage bloccato: la sigla parte lo stesso */ }
  if (off) return;
  try { sessionStorage.setItem('nr_sigla', '1'); } catch (e) { /* niente */ }

  let aperta = true, chiusa = false, t0 = 0, raf = 0, inizio = 0, t = 0;
  let pronto = document.readyState === 'complete';
  window.addEventListener('load', () => { pronto = true; }, { once: true });
  const salta = (e) => { if (!aperta) return; if (e) { e.preventDefault(); e.stopImmediatePropagation(); } chiudi(true); };
  // i tasti si fermano qui finché la sigla è aperta (primo ascoltatore registrato, in cattura)
  window.addEventListener('keydown', (e) => { if (aperta) salta(e); }, true);
  window.addEventListener('keyup', (e) => { if (aperta) { e.stopImmediatePropagation(); } }, true);

  const ov = document.createElement('div');
  ov.id = 'sigla';
  ov.setAttribute('role', 'img'); ov.setAttribute('aria-label', 'Duo Maniacs Studio presenta');
  ov.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#0a0a0b;cursor:pointer;transition:opacity .55s ease;touch-action:none';
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated';
  ov.appendChild(cv);
  ov.addEventListener('pointerdown', salta);
  const monta = () => { if (!chiusa) (document.body || document.documentElement).appendChild(ov); };
  if (document.body) monta(); else document.addEventListener('DOMContentLoaded', monta, { once: true });

  const g = cv.getContext('2d');
  const img = new Image();
  let P = null, logo = null, LW = 0, LH = 0;
  // le particelle si disegnano a un pixel l'una su una tela piccola (margini MX, MY per chi arriva da lontano), poi una sola copia ingrandita
  const MX = 320, MY = 200, vol = document.createElement('canvas'), vg = vol.getContext('2d');
  // ogni pixel del logo diventa una particella: colore, posto d'arrivo, partenza, ritardo
  function prepara() {
    LW = img.naturalWidth; LH = img.naturalHeight;
    const c = document.createElement('canvas'); c.width = LW; c.height = LH;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0); logo = c;
    const d = x.getImageData(0, 0, LW, LH).data, lista = [];
    let seme = 7; const rnd = () => ((seme = (seme * 16807) % 2147483647) / 2147483647);
    for (let y = 0; y < LH; y++) for (let i = 0; i < LW; i++) {
      const k = (y * LW + i) * 4; if (d[k + 3] < 128) continue;
      const col = `rgb(${d[k]},${d[k + 1]},${d[k + 2]})`;
      // più tardi arriva, più sono: pochi pixel all'inizio, poi sempre più fitti (la radice dà la densità che cresce)
      const rit = SIG.buio + Math.pow(rnd(), 0.3) * (SIG.arrivo - SIG.buio);
      const lato = i < LW / 2 ? -1 : 1, ang = (rnd() - 0.5) * 0.9;
      const dist = 140 + rnd() * 160;
      lista.push({ i, y, col, rit, sx: i + lato * dist * Math.cos(ang), sy: y + dist * Math.sin(ang) * 0.6 });
    }
    lista.sort((a, b) => (a.col < b.col ? -1 : a.col > b.col ? 1 : 0));   // un fillStyle per colore
    P = lista; vol.width = LW + MX * 2; vol.height = LH + MY * 2;
  }
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  function misura() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
    g.imageSmoothingEnabled = false;
    return dpr;
  }
  function frame(now) {
    if (chiusa) return;
    if (!inizio) inizio = now;
    if (!pronto && (now - inizio) / 1000 > SIG.attesa) pronto = true;
    if (pronto && !t0) t0 = now;
    t = t0 ? (now - t0) / 1000 : 0;   // il tempo della sigla comincia a gioco caricato
    const dpr = misura(), W = cv.width, H = cv.height;
    // scala intera: il logo occupa circa metà della larghezza
    const k = Math.max(1, Math.floor(Math.min(W * 0.52 / LW, H * 0.5 / LH)));
    const ox = Math.round((W - LW * k) / 2), oy = Math.round((H - LH * k) / 2 - H * 0.04);
    g.fillStyle = '#0a0a0b'; g.fillRect(0, 0, W, H);
    // il fanale lontano che lampeggia al centro
    if (t < SIG.buio + 0.4) {
      const tb = (now - inizio) / 1000, on = Math.sin(tb * 9) > -0.2 ? 1 : 0.3, a = Math.min(1, tb / 0.12) * on;
      g.fillStyle = `rgba(226,50,59,${a})`; g.fillRect(Math.round(W / 2 - k), Math.round(oy + LH * k * 0.42), k * 2, k * 2);
    }
    if (t < SIG.lampo) {
      // particelle in volo con la scia, a un pixel l'una sulla tela piccola
      vg.clearRect(0, 0, vol.width, vol.height);
      let ultimo = '';
      for (const p of P) {
        const u = (t - p.rit) / SIG.volo; if (u <= 0) continue;
        if (p.col !== ultimo) { vg.fillStyle = p.col; ultimo = p.col; }
        const e = easeOut(Math.min(1, u)), x = p.sx + (p.i - p.sx) * e, y = Math.round(p.sy + (p.y - p.sy) * e) + MY;
        if (u < 1) {
          const e2 = easeOut(Math.max(0, u - 0.12)), x2 = p.sx + (p.i - p.sx) * e2;
          vg.globalAlpha = 0.35; vg.fillRect(Math.round(Math.min(x, x2)) + MX, y, Math.max(1, Math.round(Math.abs(x - x2))), 1); vg.globalAlpha = 1;
        }
        vg.fillRect(Math.round(x) + MX, y, 1, 1);
      }
      g.drawImage(vol, ox - MX * k, oy - MY * k, vol.width * k, vol.height * k);
    } else {
      g.drawImage(logo, ox, oy, LW * k, LH * k);
      // bagliore: il logo sfocato in somma, che pulsa piano
      const b = t - SIG.lampo, pul = 0.55 + 0.15 * Math.sin(b * 4);
      g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = Math.max(0.18, pul * Math.exp(-b * 1.2)) ;
      g.filter = `blur(${Math.round(6 * dpr)}px)`; g.drawImage(logo, ox, oy, LW * k, LH * k); g.restore();
      // lampo bianco che si spegne in fretta
      if (b < 0.35) { g.fillStyle = `rgba(255,240,220,${0.55 * (1 - b / 0.35)})`; g.fillRect(0, 0, W, H); }
      // PRESENTA, lettera per lettera
      const txt = 'PRESENTA', n = Math.min(txt.length, Math.floor((b - 0.25) / 0.05));
      if (n > 0) {
        const fs = Math.max(12, Math.round(k * 7));
        g.font = `${fs}px "Share Tech Mono", monospace`; g.textAlign = 'center'; g.textBaseline = 'top';
        g.fillStyle = '#8d8f95'; g.letterSpacing = `${Math.round(fs * 0.6)}px`;
        g.fillText(txt.slice(0, n), W / 2, oy + LH * k + k * 8);
        g.letterSpacing = '0px';
      }
    }
    // righe dello schermo, leggere
    g.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 0; y < H; y += 4 * dpr) g.fillRect(0, y, W, 2 * dpr);
    if (t >= SIG.fine) { chiudi(false); return; }
    raf = requestAnimationFrame(frame);
  }
  function chiudi(subito) {
    if (chiusa) return; aperta = false;
    const via = () => { chiusa = true; cancelAnimationFrame(raf); ov.remove(); };
    if (subito) { via(); return; }
    ov.style.opacity = '0'; setTimeout(via, SIG.sfuma * 1000);
  }
  img.onload = () => { if (chiusa) return; prepara(); if (matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { SIG.buio = 0; SIG.arrivo = 0.01; SIG.volo = 0.01; SIG.lampo = 0.05; SIG.fine = 1.8; } raf = requestAnimationFrame(frame); };
  img.onerror = () => chiudi(true);   // senza il disegno niente sigla
  img.src = SIG.img;
  window.NightSigla = { salta: () => chiudi(true), get aperta() { return aperta; }, get t() { return t; }, SIG };
})();
