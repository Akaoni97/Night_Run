// ============================================================================
//  Night Run · La ruota giornaliera (dopo valigette.js e traguardi.js)
//  Un giro al giorno (giorno del calendario, ora del dispositivo), dall'app Ruota nel telefono. Dodici spicchi:
//  il premio grosso è un'auto leggendaria in regalo nel garage del motel; il resto soldi, valigette, ticket,
//  potenziamenti a tempo. I premi riusano quelli delle valigette (CASE_GIVE in valigette.js).
//  Serie: girando giorni di fila la serie cresce; ogni 7° giorno è il "giro d'oro", senza i premi comuni.
//  Stato in game.s.ruota. Il premio si dà al tocco su GIRA, prima che la ruota si fermi (se si chiude, non si perde).
// ============================================================================
// w = peso in percento (la somma fa 100). L'ordine è quello sulla ruota, in senso orario dall'alto.
const RUOTA_SEG = [
  { id: 'auto', name: 'Auto leggendaria', short: 'AUTO', rar: 5, w: 1, icon: 'auto' },
  { id: 'm500', name: '€ 500', short: '€ 500', rar: 0, w: 23.5, icon: 'soldi', cash: 500 },
  { id: 'argento', name: 'Valigetta d\'argento', short: 'ARGENTO', rar: 3, w: 4, cassa: 'argento' },
  { id: 'm1000', name: '€ 1.000', short: '€ 1.000', rar: 0, w: 20, icon: 'soldi', cash: 1000 },
  { id: 'svc', name: 'Ticket tagliando', short: 'TAGLIANDO', rar: 1, w: 9, icon: 'ticket_svc', ticket: 'svc' },
  { id: 'cent', name: 'Centralina +8 %', short: '+8 %', rar: 2, w: 7, icon: 'centralina', boost: [0.08, 50, 'Centralina mappata'] },
  { id: 'm2500', name: '€ 2.500', short: '€ 2.500', rar: 1, w: 11, icon: 'soldi', cash: 2500 },
  { id: 'bronzo', name: 'Valigetta di bronzo', short: 'BRONZO', rar: 1, w: 10, cassa: 'bronzo' },
  { id: 'pista', name: 'Mappa da pista +15 %', short: '+15 %', rar: 3, w: 3, icon: 'centralina', boost: [0.15, 100, 'Mappa da pista'] },
  { id: 'm5000', name: '€ 5.000', short: '€ 5.000', rar: 2, w: 6, icon: 'soldi', cash: 5000 },
  { id: 'oro', name: 'Valigetta d\'oro', short: 'ORO', rar: 4, w: 1.5, cassa: 'oro' },
  { id: 'mod', name: 'Ticket modifica', short: 'MODIFICA', rar: 2, w: 4, icon: 'ticket_mod', ticket: 'mod' },
];
const RUOTA_GOLD_EVERY = 7;                               // ogni quanti giorni di fila arriva il giro d'oro
const RUOTA_CARS = ['supra', 'r5', 'e34', 'e30', 'e36', 'williams', 'b2002'];   // le leggendarie: solo sportive vere
const RUOTA_CAR_CASH = 60000;                             // se le hai già tutte
const RUOTA_DAY = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const RUOTA_PREV = (day) => { const [y, m, d] = day.split('-').map(Number); return RUOTA_DAY(new Date(y, m - 1, d - 1)); };

(function ruotaLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  P.ruota = function () { const s = this.s; return s.ruota || (s.ruota = { last: null, streak: 0, best: 0, spins: 0, log: [] }); };
  P.ruotaReady = function (day = RUOTA_DAY()) { return this.ruota().last !== day; };
  // la serie che avrai girando oggi (continua se l'ultimo giro è di ieri)
  P.ruotaNextStreak = function (day = RUOTA_DAY()) { const R = this.ruota(); return R.last === day ? R.streak : R.last === RUOTA_PREV(day) ? R.streak + 1 : 1; };
  P.ruotaGold = function (day = RUOTA_DAY()) { return this.ruotaNextStreak(day) % RUOTA_GOLD_EVERY === 0; };
  // probabilità in percento per spicchio (nel giro d'oro i comuni spariscono e gli altri si allargano)
  P.ruotaOdds = function (gold) { const w = RUOTA_SEG.map((S) => (gold && S.rar === 0 ? 0 : S.w)), t = w.reduce((a, b) => a + b, 0); return w.map((v) => v / t * 100); };
  P.ruotaGive = function (S) {
    const G = typeof CASE_GIVE !== 'undefined' ? CASE_GIVE : null;
    const cash = (v, text) => { this.s.money += v; return { icon: 'soldi', name: `€ ${fmt(v)}`, text, v }; };
    if (S.cash) return Object.assign(cash(S.cash, 'Contanti, subito in tasca.'), { name: S.name });
    if (S.cassa) { this.caseGrant(S.cassa, 'la ruota'); return { icon: 'cassa_' + S.cassa, name: CASE_TYPES[S.cassa].name, text: 'Ti aspetta nell\'app Valigette, da aprire quando vuoi.' }; }
    if (S.ticket && G) return G.ticket(S.ticket)(this);
    if (S.boost && G) return G.boost(...S.boost)(this);
    if (S.id === 'auto') {
      const v = this.s.vg, cand = v && typeof CARS !== 'undefined' ? RUOTA_CARS.filter((id) => CARS[id] && !v.garage.includes(id)) : [];
      if (!cand.length) return cash(RUOTA_CAR_CASH, 'Le leggendarie della ruota le hai già tutte: il premio arriva in contanti.');
      const id = cand[Math.floor(Math.random() * cand.length)];
      v.garage.push(id); v.owned[id] = true; this.carState(id);
      return { icon: 'auto', car: id, name: CARS[id].name, text: 'Le chiavi sono tue: ti aspetta nel parcheggio del Motel Ovunque.' };
    }
    return cash(500, 'Contanti, subito in tasca.');
  };
  // gira: decide e dà subito il premio. null se oggi hai già girato. rnd e day per i test.
  P.ruotaSpin = function (rnd = Math.random, day = RUOTA_DAY()) {
    if (!this.ruotaReady(day)) return null;
    const R = this.ruota(), streak = this.ruotaNextStreak(day), gold = streak % RUOTA_GOLD_EVERY === 0, odds = this.ruotaOdds(gold);
    let x = rnd() * 100, i = 0; for (; i < odds.length - 1; i++) { x -= odds[i]; if (x < 0 && odds[i] > 0) break; }
    while (odds[i] <= 0) i = (i + 1) % odds.length;
    const S = RUOTA_SEG[i], prize = this.ruotaGive(S);
    R.last = day; R.streak = streak; R.best = Math.max(R.best || 0, streak); R.spins++;
    R.log.unshift({ day, seg: S.id, rar: S.rar, name: prize.name }); R.log.length = Math.min(R.log.length, 14);
    return Object.assign({ seg: i, rar: S.rar, gold, streak }, prize);
  };
})();

// ============================================================================
//  Scena a tutto schermo e app nel telefono (solo nel browser)
// ============================================================================
(function ruotaSchermo() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const G = () => window.nightRun && window.nightRun.game;
  const V = () => window.valigette || {};
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = RUOTA_SEG.length, SEG = Math.PI * 2 / N, TAU = Math.PI * 2;
  const RAR = (i) => (typeof CASE_RAR !== 'undefined' ? CASE_RAR[i] : { col: '#fff', rgb: '255,255,255', name: '' });
  const FONT = '"Saira Stencil One","Black Ops One",Impact,sans-serif', MONO = '"Share Tech Mono",ui-monospace,monospace';

  // ---------------------------------------------------------------- icone (32×32 in pixel art)
  function carIcon(x) {
    const px = (c, a, b, w = 1, h = 1) => { x.fillStyle = c; x.fillRect(a, b, w, h); }, ink = '#07070a';
    px(ink, 1, 13, 30, 11); px(ink, 8, 7, 15, 7);
    px('#f0c040', 2, 14, 28, 8); px('#f0c040', 9, 8, 13, 6); px('#fff2a8', 2, 14, 28, 1); px('#fff2a8', 9, 8, 13, 1);
    px('#9a7414', 2, 20, 28, 2); px('#bfe6ff', 10, 9, 5, 4); px('#bfe6ff', 16, 9, 5, 4); px('#fff6c8', 27, 15, 3, 2); px('#ff5a3a', 2, 15, 2, 2);
    for (const cx of [8, 24]) { x.fillStyle = ink; x.beginPath(); x.arc(cx, 23, 4.5, 0, TAU); x.fill(); x.fillStyle = '#c9ced6'; x.beginPath(); x.arc(cx, 23, 2, 0, TAU); x.fill(); }
  }
  const iconCache = {};
  function icon(key, rar) {
    const k = key + ':' + rar; if (iconCache[k]) return iconCache[k];
    let c;
    if (key.startsWith('cassa_')) {
      c = document.createElement('canvas'); c.width = 120; c.height = 110;
      try { V().drawCase(c.getContext('2d'), key.slice(6), {}); } catch (e) { /* valigette non pronte */ }
    } else {
      c = document.createElement('canvas'); c.width = 32; c.height = 32; const x = c.getContext('2d');
      if (key === 'auto') carIcon(x); else try { V().drawPrize(x, key, rar); } catch (e) { /* icona mancante */ }
    }
    return (iconCache[k] = c);
  }
  const segIcon = (S) => icon(S.cassa ? 'cassa_' + S.cassa : S.icon, S.rar);
  // disegna un'icona centrata in (cx, cy), lato s, senza sfumare i pixel
  const putIcon = (x, ic, cx, cy, s) => { const k = s / Math.max(ic.width, ic.height); x.imageSmoothingEnabled = false; x.drawImage(ic, cx - ic.width * k / 2, cy - ic.height * k / 2, ic.width * k, ic.height * k); x.imageSmoothingEnabled = true; };

  // ---------------------------------------------------------------- la ruota ferma (spicchi, icone, scritte, pioli)
  function wheelImage(r, dpr, gold) {
    const pad = Math.ceil(r * 0.04), S = Math.ceil((r + pad) * 2 * dpr), c = document.createElement('canvas'); c.width = c.height = S;
    const x = c.getContext('2d'); x.scale(dpr, dpr); x.translate(r + pad, r + pad);
    // ombra e bordo esterno
    x.fillStyle = '#07070a'; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill();
    for (let i = 0; i < N; i++) {
      const Sg = RUOTA_SEG[i], R = RAR(Sg.rar), a0 = -Math.PI / 2 + i * SEG - SEG / 2, a1 = a0 + SEG, off = gold && Sg.rar === 0;
      // spicchio scuro con una sfumatura del colore della rarità verso il bordo
      const gr = x.createRadialGradient(0, 0, r * 0.18, 0, 0, r * 0.92);
      if (Sg.rar === 5) { gr.addColorStop(0, '#3a2a06'); gr.addColorStop(0.6, '#8a6410'); gr.addColorStop(1, '#f0c040'); }
      else { const d = i % 2 ? '#15131c' : '#1d1a26'; gr.addColorStop(0, d); gr.addColorStop(0.7, d); gr.addColorStop(1, `rgba(${R.rgb},${off ? 0.08 : 0.32})`); }
      x.fillStyle = gr; x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, r * 0.93, a0, a1); x.closePath(); x.fill();
      // fascia colorata sul bordo
      x.fillStyle = off ? '#2a2830' : R.col; x.beginPath(); x.arc(0, 0, r * 0.93, a0, a1); x.arc(0, 0, r * 0.8, a1, a0, true); x.closePath(); x.fill();
      x.fillStyle = 'rgba(255,255,255,.18)'; x.beginPath(); x.arc(0, 0, r * 0.93, a0, a1); x.arc(0, 0, r * 0.9, a1, a0, true); x.closePath(); x.fill();
      // separatore
      x.strokeStyle = '#07070a'; x.lineWidth = Math.max(2, r * 0.018); x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(a0) * r * 0.93, Math.sin(a0) * r * 0.93); x.stroke();
      // icona e scritta, ruotate verso l'esterno
      x.save(); x.rotate(i * SEG); if (off) x.globalAlpha = 0.3;
      const ig = x.createRadialGradient(0, -r * 0.6, 0, 0, -r * 0.6, r * 0.2); ig.addColorStop(0, `rgba(${R.rgb},${off ? 0.05 : 0.45})`); ig.addColorStop(1, `rgba(${R.rgb},0)`);
      x.fillStyle = ig; x.beginPath(); x.arc(0, -r * 0.6, r * 0.2, 0, TAU); x.fill();
      putIcon(x, segIcon(Sg), 0, -r * 0.6, r * (Sg.cassa ? 0.26 : Sg.rar === 5 ? 0.3 : 0.24));
      const fs = Math.max(9, Math.round(r * (Sg.short.length > 7 ? 0.062 : 0.074)));
      x.font = `${fs}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillStyle = off ? '#8a8f9e' : '#0a0a10';
      const ang = i * SEG; if (ang > Math.PI / 2 + 0.01 && ang < Math.PI * 1.5 - 0.01) { x.save(); x.translate(0, -r * 0.865); x.rotate(Math.PI); x.fillText(Sg.short, 0, 0); x.restore(); } else x.fillText(Sg.short, 0, -r * 0.865);   // in basso le scritte si leggono dritte
      x.restore(); x.globalAlpha = 1;
    }
    // pioli sul bordo, uno per separatore
    for (let i = 0; i < N; i++) {
      const a = -Math.PI / 2 + i * SEG - SEG / 2, px = Math.cos(a) * r * 0.955, py = Math.sin(a) * r * 0.955;
      x.fillStyle = '#07070a'; x.beginPath(); x.arc(px, py, r * 0.03, 0, TAU); x.fill();
      x.fillStyle = '#e8ecf2'; x.beginPath(); x.arc(px, py, r * 0.019, 0, TAU); x.fill();
    }
    // mozzo
    const hub = x.createRadialGradient(-r * 0.04, -r * 0.05, r * 0.02, 0, 0, r * 0.2);
    hub.addColorStop(0, gold ? '#fff2a8' : '#4a4658'); hub.addColorStop(1, gold ? '#8a6410' : '#141218');
    x.fillStyle = '#07070a'; x.beginPath(); x.arc(0, 0, r * 0.2, 0, TAU); x.fill();
    x.fillStyle = hub; x.beginPath(); x.arc(0, 0, r * 0.18, 0, TAU); x.fill();
    return { c, half: r + pad };
  }

  // ---------------------------------------------------------------- suoni (quelli delle valigette, più il tic del piolo)
  const snd = () => V().SND || null;
  const tick = (k) => { const S = snd(); if (!S) return; S.tone(1700 + k * 400, 0, 0.035, 'square', 0.045, 900, 4000); S.noise(0, 0.025, 0.08, 'highpass', 3500); };

  // ---------------------------------------------------------------- scena
  let scene = null;
  function open(onDone) {
    const g = G(); if (!g || scene) return;
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:90;touch-action:manipulation;cursor:pointer';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Ruota giornaliera');
    const cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'; ov.appendChild(cv);
    const close = document.createElement('button'); close.textContent = '✕'; close.setAttribute('aria-label', 'Chiudi');
    close.style.cssText = 'position:absolute;top:max(12px,env(safe-area-inset-top));right:14px;width:40px;height:40px;border:0;border-radius:50%;background:#ffffff1c;color:#fff;font:700 18px system-ui;cursor:pointer';
    ov.appendChild(close); document.body.appendChild(ov);
    const x = cv.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1);
    const gold = g.ruotaGold(), streak = g.ruotaNextStreak();
    let W = 0, H = 0, r = 0, cx = 0, cy = 0, img = null;
    const fit = () => {
      W = innerWidth; H = innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      r = Math.max(110, Math.min(W * 0.44, H * 0.34, 330)); cx = W / 2; cy = H * 0.54; img = wheelImage(r, dpr, gold);
    };
    fit(); addEventListener('resize', fit);
    // stato: idle (in attesa del tocco) → spin → stop (spicchio che lampeggia) → show (premio) → chiusura
    const st = { ph: 'idle', t: 0, rot: 0, from: 0, to: 0, dur: 1, lastPeg: 0, flap: 0, prize: null, carImg: null, parts: [], shake: 0 };
    const t0 = performance.now(); let last = t0, raf = 0;
    const R = () => RAR(st.prize ? st.prize.rar : 0);

    function spin() {
      if (st.ph !== 'idle') return;
      const pz = g.ruotaSpin(); if (!pz) { finish(); return; }
      st.prize = pz; close.style.display = 'none';
      if (pz.car && V().carPic) V().carPic(pz.car, (c) => { st.carImg = c; });
      // dove fermarsi: il centro dello spicchio vinto sotto la lancetta, con un piccolo scarto (mai sul piolo)
      const off = (Math.random() - 0.5) * SEG * 0.7, turns = reduce ? 2 : 6 + Math.floor(Math.random() * 2);
      const base = st.rot - (st.rot % TAU);
      st.from = st.rot; st.to = base + turns * TAU + (TAU - pz.seg * SEG) - off;
      while (st.to - st.from < turns * TAU) st.to += TAU;
      st.dur = reduce ? 2.2 : 7.2; st.ph = 'spin'; st.t = 0;
      const S = snd(); if (S) { V().ac && V().ac(); S.whoosh(); S.tone(220, 0, 0.5, 'sawtooth', 0.04, 660, 1600); }
    }
    function finish() {
      cancelAnimationFrame(raf); removeEventListener('resize', fit); ov.remove(); scene = null;
      if (onDone) onDone(st.prize);
    }
    ov.addEventListener('click', (e) => {
      if (e.target === close) { if (st.ph === 'idle') finish(); return; }
      if (st.ph === 'idle') spin();
      else if (st.ph === 'show' && st.t > 1.1) finish();
      else if (st.ph === 'spin' && st.t > 1.2) st.t = Math.max(st.t, st.dur - 1.6);      // tocco durante il giro: accorcia il finale
    });
    const onKey = (e) => { if (!scene) { removeEventListener('keydown', onKey); return; } if (e.key === 'Escape' && st.ph === 'idle') finish(); else if ((e.key === 'Enter' || e.key === ' ') && (st.ph === 'idle' || (st.ph === 'show' && st.t > 1.1))) { e.preventDefault(); st.ph === 'idle' ? spin() : finish(); } };
    addEventListener('keydown', onKey);

    function burst() {
      const rr = st.prize.rar, n = 40 + rr * 30, cols = [R().col, '#ffffff', rr >= 4 ? '#fff2a8' : R().col];
      for (let k = 0; k < n; k++) { const a = Math.random() * TAU, v = 120 + Math.random() * (260 + rr * 90); st.parts.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, life: 1.4 + Math.random() * 1.2, t: 0, s: 2 + Math.random() * 4, c: cols[k % 3], spin: Math.random() * TAU }); }
      const S = snd(); if (S) { if (rr >= 2) S.burst(rr); else { S.step(rr); } S.coins(); }
      st.shake = rr >= 4 ? 14 : rr >= 2 ? 6 : 2;
    }

    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000), T = (now - t0) / 1000; last = now; st.t += dt;
      // movimento
      if (st.ph === 'idle') st.rot += dt * 0.25;
      else if (st.ph === 'spin') {
        const u = Math.min(1, st.t / st.dur), e = 1 - Math.pow(1 - u, 4);
        st.rot = st.from + (st.to - st.from) * e;
        if (u >= 1) { st.rot = st.to; st.ph = 'stop'; st.t = 0; const S = snd(); if (S) S.thud(); }
      } else if (st.ph === 'stop' && st.t > 0.9) { st.ph = 'show'; st.t = 0; burst(); }
      // pioli che passano sotto la lancetta
      const peg = Math.floor((st.rot + SEG / 2) / SEG);
      if (peg !== st.lastPeg) { if (st.ph === 'spin') tick(Math.random()); st.flap = 1; st.lastPeg = peg; }
      st.flap = Math.max(0, st.flap - dt * (st.ph === 'spin' ? 9 : 5));
      st.shake = Math.max(0, st.shake - dt * 30);

      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      // sfondo: notte, alone dietro la ruota
      const bg = x.createRadialGradient(cx, cy, r * 0.2, cx, cy, Math.max(W, H) * 0.8);
      bg.addColorStop(0, gold ? '#3a2a08' : '#241a3a'); bg.addColorStop(0.5, '#0c0a14'); bg.addColorStop(1, '#030306');
      x.fillStyle = bg; x.fillRect(0, 0, W, H);
      // raggi lenti dietro
      x.save(); x.translate(cx, cy); x.rotate(T * 0.08); x.globalAlpha = 0.07;
      for (let k = 0; k < 16; k++) { x.rotate(TAU / 16); x.fillStyle = gold ? '#ffc63a' : '#b45cff'; x.beginPath(); x.moveTo(0, 0); x.lineTo(-r * 0.25, -Math.max(W, H)); x.lineTo(r * 0.25, -Math.max(W, H)); x.fill(); }
      x.restore();
      const sx = (Math.random() - 0.5) * st.shake, sy = (Math.random() - 0.5) * st.shake;
      x.save(); x.translate(sx, sy);
      // titolo
      const ty = Math.max(34, cy - r - 70);
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = `${Math.round(Math.min(46, W * 0.085))}px ${FONT}`;
      x.shadowColor = gold ? '#ffc63a' : '#ff5fa8'; x.shadowBlur = 18; x.fillStyle = gold ? '#fff2a8' : '#ffd6ea';
      x.fillText(gold ? 'GIRO D\'ORO' : 'RUOTA DELLA NOTTE', cx, ty); x.shadowBlur = 0;
      x.font = `${Math.round(Math.min(15, W * 0.036))}px ${MONO}`; x.fillStyle = '#c9c2d8';
      x.fillText(gold ? `${streak} giorni di fila: niente premi comuni, oggi` : `Un giro al giorno · serie ${streak} ${streak === 1 ? 'giorno' : 'giorni'} · al ${RUOTA_GOLD_EVERY}° il giro d'oro`, cx, ty + Math.min(32, W * 0.07));
      // luci sul bordo esterno, che corrono (più veloci mentre gira)
      const nb = 36, sp = st.ph === 'spin' ? 18 : 4;
      x.fillStyle = '#100e16'; x.beginPath(); x.arc(cx, cy, r * 1.09, 0, TAU); x.fill();
      x.strokeStyle = gold ? '#9a7414' : '#3a3450'; x.lineWidth = r * 0.03; x.beginPath(); x.arc(cx, cy, r * 1.07, 0, TAU); x.stroke();
      for (let k = 0; k < nb; k++) {
        const a = k / nb * TAU, on = st.ph === 'show' ? (Math.floor(T * 8) + k) % 2 === 0 : (Math.floor(T * sp) - k) % 4 === 0 || (Math.floor(T * sp) - k) % 4 === 2 && st.ph === 'spin';
        const bx = cx + Math.cos(a) * r * 1.035, by = cy + Math.sin(a) * r * 1.035, col = st.ph === 'show' ? R().col : gold ? '#ffc63a' : '#ffd6ea';
        x.fillStyle = on ? col : '#2a2636'; x.beginPath(); x.arc(bx, by, r * 0.022, 0, TAU); x.fill();
        if (on) { x.globalAlpha = 0.35; x.beginPath(); x.arc(bx, by, r * 0.05, 0, TAU); x.fill(); x.globalAlpha = 1; }
      }
      // la ruota
      x.save(); x.translate(cx, cy); x.rotate(st.rot);
      x.drawImage(img.c, -img.half, -img.half, img.half * 2, img.half * 2);
      // lo spicchio vinto lampeggia
      if ((st.ph === 'stop' || st.ph === 'show') && st.prize) {
        const a0 = -Math.PI / 2 + st.prize.seg * SEG - SEG / 2;
        x.globalAlpha = 0.25 + 0.25 * Math.sin(T * 14); x.fillStyle = '#fff';
        x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, r * 0.93, a0, a0 + SEG); x.closePath(); x.fill(); x.globalAlpha = 1;
      }
      x.restore();
      // brillio sul vetro della ruota (fisso: la luce non gira)
      const gl = x.createLinearGradient(cx - r, cy - r, cx + r * 0.3, cy + r * 0.3);
      gl.addColorStop(0, 'rgba(255,255,255,.10)'); gl.addColorStop(0.45, 'rgba(255,255,255,0)'); x.fillStyle = gl;
      x.beginPath(); x.arc(cx, cy, r * 0.93, 0, TAU); x.fill();
      // pulsante GIRA al centro
      const pulse = st.ph === 'idle' ? 1 + 0.06 * Math.sin(T * 5) : 1, hr = r * 0.17 * pulse;
      x.fillStyle = st.ph === 'idle' ? (gold ? '#ffc63a' : '#ff5fa8') : '#2a2636'; x.beginPath(); x.arc(cx, cy, hr, 0, TAU); x.fill();
      x.fillStyle = 'rgba(255,255,255,.25)'; x.beginPath(); x.arc(cx, cy - hr * 0.25, hr * 0.7, Math.PI * 1.1, Math.PI * 1.9); x.fill();
      x.font = `${Math.round(r * 0.1)}px ${FONT}`; x.fillStyle = st.ph === 'idle' ? '#14060e' : '#8a8f9e';
      x.fillText(st.ph === 'idle' ? 'GIRA' : '★', cx, cy + 1);
      // lancetta in alto, che sbatte sui pioli
      x.save(); x.translate(cx, cy - r * 1.02); x.rotate(-st.flap * 0.45);
      x.fillStyle = '#07070a'; x.beginPath(); x.moveTo(-r * 0.085, -r * 0.07); x.lineTo(r * 0.085, -r * 0.07); x.lineTo(0, r * 0.13); x.closePath(); x.fill();
      x.fillStyle = gold ? '#ffc63a' : '#ff3b4a'; x.beginPath(); x.moveTo(-r * 0.06, -r * 0.05); x.lineTo(r * 0.06, -r * 0.05); x.lineTo(0, r * 0.1); x.closePath(); x.fill();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(0, -r * 0.035, r * 0.022, 0, TAU); x.fill();
      x.restore();
      // invito
      if (st.ph === 'idle') {
        x.globalAlpha = 0.55 + 0.45 * Math.sin(T * 4); x.font = `${Math.round(Math.min(15, W * 0.036))}px ${MONO}`; x.fillStyle = '#fff';
        x.fillText('Tocca la ruota per girare', cx, Math.min(H - 24, cy + r * 1.2 + 26)); x.globalAlpha = 1;
      }
      x.restore();

      // premio
      if (st.ph === 'show' && st.prize) {
        const pz = st.prize, k = Math.min(1, st.t / 0.45), ez = 1 - Math.pow(1 - k, 3);
        x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillStyle = `rgba(3,3,6,${0.72 * ez})`; x.fillRect(0, 0, W, H);
        // raggi del colore della rarità
        x.save(); x.translate(cx, cy); x.rotate(T * 0.5); x.globalAlpha = 0.22 * ez;
        for (let q = 0; q < 14; q++) { x.rotate(TAU / 14); x.fillStyle = R().col; x.beginPath(); x.moveTo(0, 0); x.lineTo(-r * 0.18, -r * 2.2); x.lineTo(r * 0.18, -r * 2.2); x.fill(); }
        x.restore(); x.globalAlpha = 1;
        const halo = x.createRadialGradient(cx, cy - r * 0.15, 0, cx, cy - r * 0.15, r * 0.9);
        halo.addColorStop(0, `rgba(${R().rgb},${0.55 * ez})`); halo.addColorStop(1, `rgba(${R().rgb},0)`);
        x.fillStyle = halo; x.fillRect(0, 0, W, H);
        // il premio sale e si ingrandisce
        const py = cy - r * 0.18 - 30 * (1 - ez) + Math.sin(T * 2.5) * 4;
        if (pz.car && st.carImg) { const cw = Math.min(W * 0.8, r * 1.9) * ez, k2 = cw / st.carImg.width; x.imageSmoothingEnabled = false; x.drawImage(st.carImg, cx - cw / 2, py - st.carImg.height * k2 / 2, cw, st.carImg.height * k2); x.imageSmoothingEnabled = true; }
        else putIcon(x, icon(pz.icon, pz.rar), cx, py, r * (pz.icon && pz.icon.startsWith('cassa_') ? 0.75 : 0.62) * (0.4 + 0.6 * ez));
        // cartiglio
        const by = Math.min(H - 110, cy + r * 0.48), bw = Math.min(W - 32, 560);
        x.globalAlpha = ez;
        x.fillStyle = '#07070a'; x.fillRect(cx - bw / 2 - 3, by - 3, bw + 6, 96);
        const bgr = x.createLinearGradient(0, by, 0, by + 90); bgr.addColorStop(0, `rgba(${R().rgb},.95)`); bgr.addColorStop(1, `rgba(${R().rgb},.55)`);
        x.fillStyle = bgr; x.fillRect(cx - bw / 2, by, bw, 90);
        x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(cx - bw / 2, by, bw, 3);
        x.fillStyle = '#0a0a10'; x.font = `12px ${MONO}`; x.fillText(`${RAR(pz.rar).name.toUpperCase()}${pz.gold ? ' · GIRO D\'ORO' : ''}`, cx, by + 15);
        x.font = `${Math.round(Math.min(30, bw * 0.06))}px ${FONT}`; x.fillText(pz.name.toUpperCase(), cx, by + 42);
        x.font = `13px system-ui,sans-serif`; x.fillStyle = '#14101c';
        const words = String(pz.text || '').split(' '); let line = '', ly = by + 68; const lines = [];
        for (const w of words) { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > bw - 30 && line) { lines.push(line); line = w; } else line = t; } if (line) lines.push(line);
        lines.slice(0, 2).forEach((l, i) => x.fillText(l, cx, ly + i * 15 - (lines.length > 1 ? 7 : 0)));
        x.globalAlpha = 1;
        if (st.t > 1.1) { x.globalAlpha = 0.5 + 0.5 * Math.sin(T * 4); x.font = `13px ${MONO}`; x.fillStyle = '#fff'; x.fillText('Tocca per continuare', cx, Math.min(H - 14, by + 116)); x.globalAlpha = 1; }
      }
      // coriandoli
      for (const p of st.parts) {
        p.t += dt; p.vy += 420 * dt; p.vx *= 0.99; p.x += p.vx * dt; p.y += p.vy * dt; p.spin += dt * 8;
        const a = 1 - p.t / p.life; if (a <= 0) continue;
        x.globalAlpha = a; x.fillStyle = p.c; x.fillRect(p.x, p.y, p.s, p.s * (0.4 + 0.6 * Math.abs(Math.sin(p.spin)))); x.globalAlpha = 1;
      }
      st.parts = st.parts.filter((p) => p.t < p.life);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    scene = { st, spin, finish };
    return scene;
  }

  // ---------------------------------------------------------------- app Ruota nel telefono
  let thumb = null;
  const wheelThumb = () => { if (thumb) return thumb; try { const im = wheelImage(56, 2, false); thumb = im.c.toDataURL(); } catch (e) { thumb = ''; } return thumb; };
  const untilMidnight = () => { const n = new Date(), m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1); const s = Math.max(0, (m - n) / 1000); return `${Math.floor(s / 3600)} h ${String(Math.floor(s / 60) % 60).padStart(2, '0')} min`; };
  const APPCSS = `
.rt-hd{display:grid;grid-template-columns:112px 1fr;gap:12px;align-items:center;background:radial-gradient(circle at 25% 50%,#3a2050,#120c1c 70%);border-radius:18px;padding:12px;margin-bottom:10px;box-shadow:inset 0 0 0 1px #ff5fa855}
.rt-hd.gold{background:radial-gradient(circle at 25% 50%,#5a420c,#141008 70%);box-shadow:inset 0 0 0 1px #ffc63a88}
.rt-hd img{width:112px;height:112px;animation:rtspin 24s linear infinite}@keyframes rtspin{to{transform:rotate(360deg)}}
.rt-hd b{display:block;font:800 17px system-ui}.rt-hd small{display:block;color:var(--t2);font-size:11.5px;margin:3px 0 8px}
.rt-go{width:100%;border:0;border-radius:12px;padding:10px;font:800 14px system-ui;color:#14060e;background:linear-gradient(180deg,#ff8cc6,#ff5fa8);box-shadow:0 0 16px #ff5fa877;cursor:pointer}
.rt-hd.gold .rt-go{background:linear-gradient(180deg,#ffe08a,#ffc63a);box-shadow:0 0 16px #ffc63a88}
.rt-go:disabled{background:var(--s3);color:var(--t2);box-shadow:none;cursor:default}
.rt-dots{display:flex;gap:5px;margin:2px 4px 10px;align-items:center;font-size:11px;color:var(--t2)}.rt-dots i{width:16px;height:16px;border-radius:50%;background:var(--s3);display:grid;place-items:center;font:700 9px system-ui;color:#0006;font-style:normal}
.rt-dots i.on{background:#ff5fa8}.rt-dots i.g{box-shadow:0 0 0 2px #ffc63a inset}.rt-dots i.g.on{background:#ffc63a}
.rt-row{display:grid;grid-template-columns:12px 1fr auto;gap:8px;align-items:center;padding:6px 4px;border-bottom:1px solid #ffffff10;font-size:12.5px}
.rt-row i{width:10px;height:10px;border-radius:3px}.rt-row span{color:var(--t2);font-variant-numeric:tabular-nums}.rt-row.off{opacity:.35}
.rt-h{margin:12px 4px 4px;font:600 11.5px system-ui;color:var(--t2);letter-spacing:.06em}
.rt-log{font-size:11.5px;color:var(--t2);padding:3px 4px}.rt-log b{font-weight:700}`;
  function render() {
    const g = G(); if (!g) return '';
    const R = g.ruota(), ready = g.ruotaReady(), gold = ready && g.ruotaGold(), next = ready ? g.ruotaNextStreak() : R.streak, odds = g.ruotaOdds(gold);
    const inCycle = next % RUOTA_GOLD_EVERY || RUOTA_GOLD_EVERY, done = ready ? inCycle - 1 : inCycle;
    const dots = Array.from({ length: RUOTA_GOLD_EVERY }, (_, k) => `<i class="${k < done ? 'on' : ''} ${k === RUOTA_GOLD_EVERY - 1 ? 'g' : ''}">${k === RUOTA_GOLD_EVERY - 1 ? '★' : k + 1}</i>`).join('');
    const pct = (v) => (v >= 1 ? v.toFixed(v % 1 ? 1 : 0) : v.toFixed(1)).replace('.', ',');
    return `<div class="view app"><div class="nav"><h3>Ruota</h3></div><div class="body">
      <div class="rt-hd ${gold ? 'gold' : ''}"><img src="${wheelThumb()}" alt=""><div><b>${ready ? (gold ? 'Giro d\'oro pronto!' : 'Il giro di oggi è pronto') : 'Giro fatto per oggi'}</b><small>${ready ? (gold ? 'Sette giorni di fila: oggi niente premi comuni.' : 'Premio grosso: un\'auto leggendaria nel garage del motel.') : 'Il prossimo tra ' + untilMidnight() + '.'}</small><button class="rt-go" data-x="spin" ${ready ? '' : 'disabled'}>${ready ? 'Gira la ruota' : 'Torna domani'}</button></div></div>
      <div class="rt-dots">${dots}<span style="margin-left:6px">serie ${R.last ? (ready ? Math.max(0, next - 1) : R.streak) : 0}${R.best > 1 ? ' · record ' + R.best : ''}</span></div>
      <div class="rt-h">PREMI E PROBABILITÀ${gold ? ' (GIRO D\'ORO)' : ''}</div>
      ${RUOTA_SEG.map((S, i) => ({ S, p: odds[i] })).sort((a, b) => b.S.rar - a.S.rar || a.p - b.p).map(({ S, p }) => `<div class="rt-row ${p <= 0 ? 'off' : ''}"><i style="background:${RAR(S.rar).col}"></i><div>${esc(S.name)}</div><span>${p > 0 ? pct(p) + ' %' : '—'}</span></div>`).join('')}
      ${R.log.length ? `<div class="rt-h">ULTIMI GIRI · ${R.spins}</div>` + R.log.slice(0, 7).map((l) => `<div class="rt-log">${l.day.split('-').reverse().slice(0, 2).join('/')} · <b style="color:${RAR(l.rar).col}">${esc(l.name)}</b></div>`).join('') : ''}
    </div></div>`;
  }
  function click(D) {
    if (D.x !== 'spin') return;
    const g = G(); if (!g || !g.ruotaReady()) return;
    if (window.telefono && window.telefono.close) window.telefono.close();
    open(() => { if (window.telefono) { window.telefono.show('rta'); } });
  }
  const add = () => {
    if (!window.telefono || !window.telefono.addApp) return false;
    window.telefono.addApp({ id: 'rta', name: 'Ruota', color: 'conic-gradient(from 15deg,#ff5fa8,#ffc63a,#3b9bff,#b45cff,#4ade80,#ff5fa8)', css: APPCSS,
      icon: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6L6 18"/><circle cx="12" cy="12" r="2.2" fill="#fff"/>',
      badge: () => { const g = G(); return g && g.s && g.ruotaReady() ? 1 : 0; }, render, click });
    return true;
  };
  if (!add()) addEventListener('load', add);

  window.ruota = { open, render, untilMidnight };
})();
if (typeof window !== 'undefined') Object.assign(window, { RUOTA_SEG, RUOTA_DAY });
