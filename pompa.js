'use strict';
// ============================================================================
//  Night Run · La pompa del benzinaio (v0.180, dopo cambiogomma.js)
//  Prima «Pieno», «€ 20» e «€ 50» riempivano da soli. Ora la pistola si tiene in mano: tieni premuto (pulsante grande o
//  Spazio) e l'erogazione parte piano e cresce mentre stringi il grilletto (`POMPA.stringi`), lasci e si ferma subito.
//  Display della pompa con importo e litri che scorrono, prepagato (€ 10 / 20 / 50: la pompa si ferma da sola alla cifra),
//  serbatoio pieno = la pistola scatta (CLAC) e non entra più niente. Si paga riagganciando la pistola (o uscendo).
//  Cifra tonda: chi si ferma entro 5 centesimi da un euro intero, Rossana gli abbuona i centesimi (`POMPA.tondo`).
//  Suoni fatti a codice (motore della pompa, benzina che scorre, scatto del contatore a ogni litro, CLAC).
//  Logica pura su StreetGame (`pompaApri`, `pompaStringi`, `pompaPasso`, `pompaPaga`), stato in `game.inside.fill`
//  (`manual: true`; il rifornimento automatico di game.js resta per chi lo chiama ancora). Test in `test/pompa.test.js`.
// ============================================================================
const POMPA = {
  flussoMin: 1.2,      // litri al secondo appena si stringe
  flussoMax: 6.5,      // a grilletto tutto stretto (un pieno da 50 litri in ~9 s; a colpetti si mira ai centesimi)
  stringi: 1,          // secondi per stringere tutto il grilletto
  molla: 0.08,         // secondi per lasciarlo
  tondo: 0.05,         // € di tolleranza per la cifra tonda
  prepagati: [10, 20, 50],
};

(function pompaLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  const prezzo = () => (typeof GAME_FUEL_PRICE !== 'undefined' ? GAME_FUEL_PRICE : 1.95);
  const fido = () => (typeof GAME_FIDO !== 'undefined' ? GAME_FIDO : 500);
  // stacca la pistola: quanti litri possono entrare (serbatoio, prepagato, soldi e fido)
  P.pompaApri = function (limite) {
    const I = this.inside; if (!I || I.id !== 'fuel') return { ok: false };
    if (I.fill) return { ok: true, gia: true };
    const miss = (1 - this.sim.fuel) * this.sim.P.tank;
    if (miss < 0.3) return { ok: false, why: 'Il serbatoio è già pieno' };
    let liters = miss, perche = 'pieno';
    if (limite && limite / prezzo() < liters) { liters = limite / prezzo(); perche = 'prepagato'; }
    if (this.mode === 'career') {
      const max = (this.s.money + fido()) / prezzo();
      if (max < 0.3) return { ok: false, why: `Sei in rosso oltre i € ${fido()}: niente più credito, servono soldi` };
      if (max < liters) { liters = max; perche = 'credito'; }
    }
    I.fill = { manual: true, liters, got: 0, cost: 0, press: 0, flow: 0, stretta: false, scatto: false, perche, limite: limite || 0, ev: [] };
    return { ok: true };
  };
  P.pompaStringi = function (on) { const F = this.inside && this.inside.fill; if (F && F.manual) F.stretta = !!on; };
  // un passo dell'erogazione: il grilletto si stringe piano e si lascia di colpo, il flusso segue
  P.pompaPasso = function (dt) {
    const I = this.inside, F = I && I.fill; if (!F || !F.manual) return;
    const tgt = F.stretta && !F.scatto ? 1 : 0;
    F.press = tgt ? Math.min(1, F.press + dt / POMPA.stringi) : Math.max(0, F.press - dt / POMPA.molla);
    F.flow = F.press > 0.02 && !F.scatto ? POMPA.flussoMin + (POMPA.flussoMax - POMPA.flussoMin) * Math.pow(F.press, 1.5) : 0;
    if (!F.flow) return;
    const step = Math.min(F.flow * dt, F.liters - F.got), litri0 = Math.floor(F.got);
    F.got += step; F.cost = F.got * prezzo();
    this.sim.fuel = Math.min(1, this.sim.fuel + step / this.sim.P.tank); this.sim.dry = false;
    if (Math.floor(F.got) > litri0) F.ev.push('litro');
    if (F.got >= F.liters - 1e-6) { F.scatto = true; F.flow = 0; F.press = 0; F.ev.push('clac'); }
  };
  // riaggancia la pistola e paga (cifra tonda: i centesimi li abbuona Rossana)
  P.pompaPaga = function () {
    const I = this.inside, F = I && I.fill; if (!F || !F.manual) return { ok: false };
    I.fill = null;
    if (F.got < 0.05) return { ok: true, pagato: 0 };
    let c = Math.round(F.cost * 100) / 100, tondo = false;
    const intero = Math.round(c);
    if (!F.limite && intero >= 5 && Math.abs(c - intero) <= POMPA.tondo + 1e-9) { tondo = true; c = Math.min(c, intero); }
    if (this.mode === 'career') this.s.money -= c;
    I.filled = true;
    const L = F.got.toFixed(1).replace('.', ','), E = c.toFixed(2).replace('.', ',');
    this.say(tondo ? `Cifra tonda! ${L} litri, − € ${E}: Rossana chiude un occhio sui centesimi` : `Rifornimento: ${L} litri, − € ${E}`, 'fuel');
    return { ok: true, pagato: c, tondo, litri: F.got };
  };
  const up = P.update;
  P.update = function (dt) { up.call(this, dt); if (this.inside && this.inside.fill && this.inside.fill.manual) this.pompaPasso(dt); };
})();

// ---------------------------------------------------------------- il pannello e i suoni (solo nel browser)
(function pompaInterfaccia() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const G = () => window.nightRun && window.nightRun.game;
  const css = document.createElement('style');
  css.textContent = `
.pompa{display:grid;gap:10px;user-select:none;-webkit-user-select:none}
.pompa .testa{background:linear-gradient(180deg,#26282e,#141519);border:1px solid #3a3d45;border-radius:12px;padding:10px 12px;box-shadow:inset 0 1px 0 #ffffff14,0 6px 18px #0008}
.pompa .marca{display:flex;justify-content:space-between;align-items:center;font:800 11px system-ui;letter-spacing:.14em;color:#ff4a3a;margin-bottom:8px}
.pompa .marca span:last-child{color:#9aa3b2;letter-spacing:.06em}
.pompa .led{display:grid;grid-template-columns:auto 1fr;align-items:baseline;gap:2px 10px;background:#06110b;border:1px solid #0d2a1a;border-radius:6px;padding:6px 10px;box-shadow:inset 0 0 18px #000}
.pompa .led small{font:700 10px system-ui;color:#3f8a5a;letter-spacing:.1em}
.pompa .led b{font:400 30px 'Share Tech Mono',monospace;color:#7dffa6;text-align:right;text-shadow:0 0 8px #3cff7a88;letter-spacing:.04em}
.pompa .led b.lt{font-size:22px;color:#ffd36a;text-shadow:0 0 8px #ffb02a77}
.pompa .led b.pz{font-size:15px;color:#9fd8b4;text-shadow:none}
.pompa .prep{display:flex;gap:6px;flex-wrap:wrap}.pompa .prep button[aria-pressed=true]{outline:2px solid #ffb02a}
.pompa .serb{display:grid;gap:4px}.pompa .serb div:first-child{display:flex;justify-content:space-between;font:600 12px system-ui;color:#c9cfe8}
.pompa .pist{position:relative;display:grid;grid-template-columns:120px 1fr;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;border:2px solid #ffb02a66;background:radial-gradient(120% 140% at 20% 50%,#3a2a10,#16120a);color:#ffe2a8;font:800 14px system-ui;cursor:pointer;touch-action:none}
.pompa .pist.on{border-color:#ffb02a;box-shadow:0 0 0 3px #ffb02a33,0 0 22px #ffb02a55}
.pompa .pist.stop{border-color:#ff4a3a;background:radial-gradient(120% 140% at 20% 50%,#3a1410,#160a08)}
.pompa .pist small{display:block;font:600 11.5px system-ui;color:#d8bf8a;margin-top:3px}
.pompa .pist svg{width:120px;height:70px;overflow:visible}
.pompa .riag{font-weight:800}
.pompa .riga{font:600 12px system-ui;color:#c9cfe8;min-height:1.2em}`;
  document.head.appendChild(css);

  // la pistola in figura: il grilletto ruota con la stretta, gocce quando scorre
  const SVG = `<svg viewBox="0 0 120 70" aria-hidden="true">
    <path d="M2 18 C 18 6, 30 30, 46 22" fill="none" stroke="#151515" stroke-width="7" stroke-linecap="round"/>
    <path d="M2 18 C 18 6, 30 30, 46 22" fill="none" stroke="#2c2c30" stroke-width="4" stroke-linecap="round"/>
    <rect x="44" y="14" width="40" height="18" rx="5" fill="#1d1f24" stroke="#000" stroke-width="1.5"/>
    <rect x="47" y="17" width="20" height="5" rx="2" fill="#3a3e47"/>
    <path d="M82 18 L112 26 L112 31 L82 28 Z" fill="#9aa0ae" stroke="#000" stroke-width="1.2"/>
    <path d="M84 20 L110 27" stroke="#d6dbe4" stroke-width="1"/>
    <path d="M50 32 L56 54 L66 54 L70 32" fill="#141519" stroke="#000" stroke-width="1.5"/>
    <g class="gril" style="transform-origin:70px 33px"><path d="M70 33 Q 82 44, 74 54 L 70 52 Q 76 43, 66 35 Z" fill="#c42a1a" stroke="#000" stroke-width="1.2"/></g>
    <g class="gocce" opacity="0"><circle cx="113" cy="36" r="2" fill="#ffd36a"/><circle cx="114" cy="45" r="1.6" fill="#ffd36a"/><circle cx="113" cy="54" r="1.3" fill="#ffd36a"/></g>
  </svg>`;

  // suoni: motore della pompa, benzina che scorre, scatto del contatore, CLAC
  let A = null;
  function audio() {
    if (A) return A;
    const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return null;
    const c = new Ctx(), out = c.createGain(); out.gain.value = 0.9; out.connect(c.destination);
    const mot = c.createOscillator(); mot.type = 'sawtooth'; mot.frequency.value = 96;
    const mlp = c.createBiquadFilter(); mlp.type = 'lowpass'; mlp.frequency.value = 420;
    const mg = c.createGain(); mg.gain.value = 0; mot.connect(mlp).connect(mg).connect(out); mot.start();
    const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const rum = c.createBufferSource(); rum.buffer = buf; rum.loop = true;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 1.4;
    const fg = c.createGain(); fg.gain.value = 0; rum.connect(bp).connect(fg).connect(out); rum.start();
    const colpo = (f, dur, vol, tipo) => {
      const t = c.currentTime, o = c.createOscillator(), g = c.createGain(); o.type = tipo || 'square'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(Math.max(40, f * 0.4), t + dur);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g).connect(out); o.start(t); o.stop(t + dur + 0.02);
    };
    A = { c, mg, fg, bp, mot, colpo };
    return A;
  }
  function suona(F, aperta) {
    if (!A) return; const t = A.c.currentTime, fl = F ? F.flow / POMPA.flussoMax : 0;
    A.mg.gain.setTargetAtTime(aperta && F ? 0.02 + 0.05 * fl : 0, t, 0.08);
    A.mot.frequency.setTargetAtTime(96 + 40 * fl, t, 0.1);
    A.fg.gain.setTargetAtTime(0.11 * fl, t, 0.05);
    A.bp.frequency.setTargetAtTime(700 + 600 * fl + Math.sin(t * 23) * 120, t, 0.03);
    if (F) for (const e of F.ev.splice(0)) {
      if (e === 'litro') A.colpo(2400, 0.03, 0.05, 'triangle');
      if (e === 'clac') { A.colpo(180, 0.12, 0.25, 'square'); A.colpo(1200, 0.05, 0.12, 'triangle'); }
    }
  }

  const fmt2 = (v) => v.toFixed(2).replace('.', ',');
  // il pannello della pompa, al posto dei pulsanti di prima (index.html, openPlace di 'fuel')
  function panel(body, ctx) {
    const g = G(); if (!g) return;
    const box = document.createElement('div'); box.className = 'pompa'; box.id = 'pompaBox';
    const prezzoL = typeof GAME_FUEL_PRICE !== 'undefined' ? GAME_FUEL_PRICE : 1.95;
    box.innerHTML = `<div class="testa"><div class="marca"><span>BENZINA · SELF</span><span>POMPA 2</span></div>
      <div class="led"><small>IMPORTO €</small><b class="eu">0,00</b><small>LITRI</small><b class="lt">0,00</b><small>€ / LITRO</small><b class="pz">${fmt2(prezzoL)}</b></div></div>
      <div class="prep"><button type="button" class="kbtn" data-p="0" aria-pressed="true">Libero</button>${POMPA.prepagati.map((p) => `<button type="button" class="kbtn" data-p="${p}" aria-pressed="false">Prepagato € ${p}</button>`).join('')}</div>
      <div class="serb"><div><span>Serbatoio</span><span class="sl"></span></div><div class="fuelgauge"><i class="sb"></i></div></div>
      <div class="pist" role="button" tabindex="0">${SVG}<div><span class="tit">Tieni premuto per erogare</span><small>Spazio o tieni premuto qui · lascia per fermarti</small></div></div>
      <button type="button" class="kbtn riag" disabled>Riaggancia la pistola e paga</button>
      <div class="riga"></div>`;
    body.appendChild(box);
    const $ = (s) => box.querySelector(s), pist = $('.pist'), gril = $('.gril'), gocce = $('.gocce');
    let limite = 0, tenuto = false, raf = 0;
    const riga = (t) => { $('.riga').textContent = t; };
    riga('Rossana, dalla cassa: «Stacca la pistola e servi pure. Se fai cifra tonda, i centesimi te li abbono.»');
    box.querySelectorAll('.prep button').forEach((b) => b.addEventListener('click', () => {
      const gg = G(); if (gg.inside && gg.inside.fill) { ctx.flash('Prima riaggancia la pistola', 1.6); return; }
      limite = +b.dataset.p; box.querySelectorAll('.prep button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    }));
    const premi = () => {
      const gg = G(); if (!gg || tenuto) return; audio(); if (A && A.c.state === 'suspended') A.c.resume();
      const r = gg.pompaApri(limite); if (!r.ok) { if (r.why) ctx.flash(r.why, 2); return; }
      tenuto = true; gg.pompaStringi(true);
    };
    const lascia = () => { if (!tenuto) return; tenuto = false; const gg = G(); if (gg) gg.pompaStringi(false); };
    pist.addEventListener('pointerdown', (e) => { e.preventDefault(); try { pist.setPointerCapture(e.pointerId); } catch (er) { /* niente */ } premi(); });
    pist.addEventListener('pointerup', lascia); pist.addEventListener('pointercancel', lascia); pist.addEventListener('lostpointercapture', lascia);
    const kd = (e) => { if (e.code !== 'Space' || !document.body.contains(box)) return; e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) premi(); };
    const ku = (e) => { if (e.code !== 'Space' || !document.body.contains(box)) return; e.preventDefault(); e.stopImmediatePropagation(); lascia(); };
    window.addEventListener('keydown', kd, true); window.addEventListener('keyup', ku, true);
    $('.riag').addEventListener('click', () => {
      const gg = G(); lascia(); const r = gg.pompaPaga();
      if (r.ok && r.pagato) riga(r.tondo ? 'Rossana: «Cifra tonda, bravo. I centesimi lasciali stare.»' : 'Rossana: «Grazie, buon viaggio. Occhio alla strada.»');
      ctx.save();
    });
    let clacDetto = false;
    const giro = () => {
      if (!document.body.contains(box)) { window.removeEventListener('keydown', kd, true); window.removeEventListener('keyup', ku, true); suona(null, false); return; }
      const gg = G(), I = gg && gg.inside, F = I && I.fill && I.fill.manual ? I.fill : null, sim = gg && gg.sim;
      $('.eu').textContent = fmt2(F ? F.cost : 0); $('.lt').textContent = fmt2(F ? F.got : 0);
      if (sim) { $('.sl').textContent = `${(sim.fuel * sim.P.tank).toFixed(1).replace('.', ',')} / ${sim.P.tank} litri`; $('.sb').style.width = (sim.fuel * 100).toFixed(1) + '%'; }
      const p = F ? F.press : 0, scorre = F && F.flow > 0;
      gril.style.transform = `rotate(${-18 * p}deg)`; gocce.setAttribute('opacity', scorre ? String(0.5 + 0.5 * Math.abs(Math.sin(performance.now() / 70))) : '0');
      pist.classList.toggle('on', !!scorre); pist.classList.toggle('stop', !!(F && F.scatto));
      $('.tit').textContent = F && F.scatto ? (F.perche === 'prepagato' ? `CLAC! Prepagato raggiunto: riaggancia e paga` : F.perche === 'credito' ? 'CLAC! Il credito è finito: riaggancia e paga' : 'CLAC! Serbatoio pieno: riaggancia e paga') : scorre ? 'Erogazione…' : F ? 'Pistola in mano: stringi per erogare' : 'Tieni premuto per erogare';
      if (F && F.scatto && !clacDetto) { clacDetto = true; riga(F.perche === 'pieno' ? 'La pistola scatta: il serbatoio è pieno fino all\'orlo.' : F.perche === 'prepagato' ? `La pompa si ferma da sola a € ${F.limite}.` : 'Rossana: «Basta così, il credito è finito.»'); }
      if (!F) clacDetto = false;
      $('.riag').disabled = !F || F.got < 0.05;
      box.querySelectorAll('.prep button').forEach((b) => { b.disabled = !!F; });
      suona(F, !!F);
      raf = requestAnimationFrame(giro);
    };
    raf = requestAnimationFrame(giro);
  }
  window.NightPompa = { panel, POMPA };
})();

if (typeof window !== 'undefined') window.POMPA = POMPA;
