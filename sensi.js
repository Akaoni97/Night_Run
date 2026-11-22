// ============================================================================
//  Night Run · I sensi del guidatore (22/11, chiesti da Nico)
//  - Sonno: al posto della vignetta scura, le palpebre. Sotto il 35 % di sonno gli occhi restano socchiusi (più stanco,
//    più chiusi), ogni tanto si chiudono pesanti e si riaprono a fatica; nel colpo di sonno (vg.blackout) si chiudono
//    del tutto. Street2D.prototype.palpebre(g, apertura) disegna; viaggio2d.js (drawTripFx) la usa.
//  - Incidente forte (urto con I ≥ SEN.botta, circa 36 km/h di differenza): fischio nelle orecchie (due toni acuti che
//    calano in qualche secondo), suoni del motore ovattati e lo schermo che si fa buio e torna piano.
//  Funzioni pure provate in test/sensi.test.js: senApertura, senBotta.
// ============================================================================
const SEN = { soglia: 0.35, minAperta: 0.42, botta: 1.0, durata: 6 };

// quanto sono aperti gli occhi (1 = del tutto, 0 = chiusi): sonno 0-1, t in secondi, blackout 0-1 (colpo di sonno)
function senApertura(sonno, t, blackout = 0) {
  if (blackout > 0) return Math.max(0, 1 - Math.min(1, blackout * 1.4));
  if (sonno >= SEN.soglia) return 1;
  const k = (SEN.soglia - sonno) / SEN.soglia;                    // 0 appena stanco, 1 sfinito
  let o = 1 - k * (1 - SEN.minAperta);
  // chiusure pesanti: ogni 3-8 s (più spesso se sei sfinito) gli occhi scendono quasi a chiudersi e risalgono lenti
  const per = 8 - 5 * k, ph = (t % per) / per, dur = 0.16 + 0.1 * k;
  if (ph < dur) { const u = ph / dur, giu = u < 0.35 ? u / 0.35 : 1 - (u - 0.35) / 0.65; o *= 1 - (0.55 + 0.4 * k) * Math.sin(giu * Math.PI / 2); }
  // il respiro: le palpebre tremano appena
  o *= 1 - 0.03 * k * (0.5 + 0.5 * Math.sin(t * 2.3));
  return Math.max(0, Math.min(1, o));
}
// buio e fischio dopo un urto: dato il tempo passato e la forza, quanto buio (0-1) e quanto fischio (0-1)
function senBotta(dt, I) {
  if (!(I >= SEN.botta) || dt < 0 || dt > SEN.durata) return { buio: 0, fischio: 0 };
  const f = Math.min(1, 0.65 + (I - SEN.botta) * 0.7), u = dt / SEN.durata;
  const buio = f * (dt < 0.15 ? dt / 0.15 : Math.pow(1 - u, 1.6)) * 0.88;
  const fischio = f * (dt < 0.05 ? dt / 0.05 : dt < 1.2 ? 1 : Math.pow(1 - (dt - 1.2) / (SEN.durata - 1.2), 1.4));
  return { buio, fischio };
}

(function senLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype, cr = P.crash;
  if (cr) P.crash = function (e, kind) {
    const n = (this.fx || []).length, r = cr.call(this, e, kind);
    const f = (this.fx || []).slice(n).find((x) => x.k === 'crash');
    if (f && f.I >= SEN.botta) this.botta = { t0: this.tAll ?? 0, I: f.I, wall: (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000 };
    return r;
  };
})();

(function senUI() {
  if (typeof Street2D === 'undefined' || typeof document === 'undefined') return;
  const S = Street2D.prototype;
  // le palpebre: sopra e sotto, con l'orlo curvo come un occhio e un bordo sfumato; a 0 si toccano
  S.palpebre = function (g, o) {
    if (o >= 0.999) return;
    const W = this.LW, H = 360, m = H / 2, lerp = (a, b, k) => a + (b - a) * k;
    const ang = lerp(m, H * 0.08, o), cen = lerp(m, -40, o);           // angoli e centro dell'orlo di sopra
    const ctrl = 2 * cen - ang;
    const lid = (top) => {
      g.beginPath();
      if (top) { g.moveTo(-2, -2); g.lineTo(W + 2, -2); g.lineTo(W + 2, ang); g.quadraticCurveTo(W / 2, ctrl, -2, ang); }
      else { g.moveTo(-2, H + 2); g.lineTo(W + 2, H + 2); g.lineTo(W + 2, H - ang); g.quadraticCurveTo(W / 2, H - ctrl, -2, H - ang); }
      g.closePath();
    };
    g.save();
    // ombra morbida verso l'interno (la palpebra non ha un taglio netto)
    for (let i = 3; i >= 1; i--) {
      g.fillStyle = `rgba(6,3,10,${0.18})`; g.save();
      g.translate(0, 0); const d = i * 7 * (0.4 + 0.6 * o);
      g.beginPath(); g.moveTo(-2, -2); g.lineTo(W + 2, -2); g.lineTo(W + 2, ang + d); g.quadraticCurveTo(W / 2, ctrl + d, -2, ang + d); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(-2, H + 2); g.lineTo(W + 2, H + 2); g.lineTo(W + 2, H - ang - d); g.quadraticCurveTo(W / 2, H - ctrl - d, -2, H - ang - d); g.closePath(); g.fill();
      g.restore();
    }
    g.fillStyle = '#050209'; lid(true); g.fill(); lid(false); g.fill();
    // le ciglia: un filo più scuro sull'orlo, e un velo rossastro quando gli occhi bruciano
    g.strokeStyle = 'rgba(0,0,0,.9)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(W + 2, ang); g.quadraticCurveTo(W / 2, ctrl, -2, ang); g.stroke();
    g.beginPath(); g.moveTo(W + 2, H - ang); g.quadraticCurveTo(W / 2, H - ctrl, -2, H - ang); g.stroke();
    if (o < 0.8) { g.fillStyle = `rgba(90,20,30,${(0.8 - o) * 0.18})`; g.fillRect(0, 0, W, H); }
    g.restore();
  };

  // l'incidente forte: buio che torna piano e un'ombra ai bordi; si disegna sopra la scena, sotto le scritte
  const dc = S.drawComics;
  S.drawComics = function (g, dt) {
    try {
      const game = window.nightRun && window.nightRun.game, b = game && game.botta;
      if (b) {
        const passati = performance.now() / 1000 - b.wall, e = senBotta(passati, b.I);
        if (passati > SEN.durata) game.botta = null;
        else if (e.buio > 0.01) {
          const W = this.LW, H = 360;
          g.save(); g.fillStyle = `rgba(0,0,0,${e.buio})`; g.fillRect(0, 0, W, H);
          const gr = g.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, W * 0.6); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${Math.min(0.9, e.buio * 1.2)})`);
          g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore();
        }
        fischio(b);
      }
    } catch (err) { /* i sensi non devono mai rompere il disegno */ }
    return dc ? dc.call(this, g, dt) : undefined;
  };

  // il fischio: due toni acuti un po' stonati tra loro (battono), e il resto del suono ovattato da un passa-basso
  let F = null;
  function fischio(b) {
    const au = window.nightRun && window.nightRun.audio, ctx = au && au.ctx;
    if (!ctx || !au.comp) return;
    try {
      if (!F) {
        const ear = ctx.createBiquadFilter(); ear.type = 'lowpass'; ear.frequency.value = 20000; ear.Q.value = 0.5;
        au.comp.disconnect(); au.comp.connect(ear).connect(ctx.destination);
        const g = ctx.createGain(); g.gain.value = 0; g.connect(ctx.destination);
        const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(); o1.frequency.value = 4100; o2.frequency.value = 4117; o1.type = o2.type = 'sine';
        const g2 = ctx.createGain(); g2.gain.value = 0.6; o1.connect(g); o2.connect(g2).connect(g); o1.start(); o2.start();
        F = { ear, g, last: null };
      }
      if (F.last === b) return;                       // un solo inviluppo per urto
      F.last = b;
      const t = ctx.currentTime, f = Math.min(1, 0.65 + (b.I - SEN.botta) * 0.7), D = SEN.durata;
      F.g.gain.cancelScheduledValues(t); F.g.gain.setValueAtTime(0, t); F.g.gain.linearRampToValueAtTime(0.05 * f, t + 0.05);
      F.g.gain.setValueAtTime(0.05 * f, t + 1.2); F.g.gain.exponentialRampToValueAtTime(0.0005, t + D);
      F.ear.frequency.cancelScheduledValues(t); F.ear.frequency.setValueAtTime(20000, t); F.ear.frequency.exponentialRampToValueAtTime(380, t + 0.08);
      F.ear.frequency.setValueAtTime(380, t + 1.4); F.ear.frequency.exponentialRampToValueAtTime(20000, t + D);
    } catch (e) { /* senza audio va bene lo stesso */ }
  }
  window.NightSensi = { prova: (I = 1.3) => { const game = window.nightRun && window.nightRun.game; if (game) game.botta = { t0: 0, I, wall: performance.now() / 1000 }; } };
})();

if (typeof window !== 'undefined') Object.assign(window, { SEN, senApertura, senBotta });
