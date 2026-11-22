// ============================================================================
//  Night Run · La notte (dopo polizia.js)
//  - GIORNO E NOTTE CONTANO: l'ora del gioco (index.html, un'ora ogni 20 s) arriva qui come game.dayK (0 notte, 1 giorno).
//    Di notte meno volanti e più cose strane; di giorno il contrario. notteK('police' | 'horror') dà il fattore.
//  - RADIO CHE DISTURBA: di notte, ogni tanto, la radio si sporca di fruscio e per due secondi trasmette qualcosa che hai
//    già sentito sulla strada (un avviso di qualche minuto prima). A volte si accende da sola. Niente testi nuovi di storia.
//  - «QUELLA DIETRO» (scena proposta da Codex, voluta dal cognato): di notte, uscendo da un benzinaio dopo il km 12, una volta.
//    Il benzinaio ha visto un'altra auto identica alla tua, ancora parcheggiata dietro. Poi un messaggio sul telefono.
//  - INTERFACCIA: Meccanico (tutto) o Essenziale (velocità, marcia, benzina, spie, lavoro), in Impostazioni > Grafica.
//    Durante le incursioni della storia il resto dell'interfaccia sparisce, il buio lascia libera la strada e il cruscotto.
// ============================================================================
const NOTTE = {
  soglia: 0.35,                                  // sotto questa luce del giorno è notte
  police: { notte: 0.45, giorno: 1 },            // volanti in giro
  horror: { notte: 1.6, giorno: 0.4 },           // cose strane (eventi strani del viaggio, radio)
  radioKm: [5, 11], radioP: 0.55, radioDur: 2.4, // radio: ogni quanti km ci prova, probabilità (di notte), durata
  ecoMin: 90,                                    // la radio ripete un avviso vecchio almeno di tanti secondi
  dietroKm: 12,                                  // «Quella dietro»: non prima di questo km
};
const NOTTE_DIETRO = {
  testo: 'Il benzinaio guarda {auto} mentre paghi. «Bella. È la seconda identica che vedo stanotte.» Gli chiedi quando è passata l\'altra. «Non è passata. È ancora parcheggiata dietro.»',
  vedi: 'Giri dietro il market. Il posto è vuoto. C\'è solo una macchia d\'olio fresca sull\'asfalto, della forma della tua coppa. Nessuno.',
  sms: 'Non accenderla. La tua è quella dietro.',
  via: 'Nello specchietto, dietro il benzinaio, il posto è vuoto.',
};

(function notteLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  const R = (g) => (g.notteRnd || Math.random)();
  P.notte = function () { return this.dayK === undefined || this.dayK < NOTTE.soglia; };
  P.notteK = function (what) { const t = NOTTE[what]; return t ? (this.notte() ? t.notte : t.giorno) : 1; };

  // memoria degli avvisi: la radio li ripete
  const say = P.say;
  P.say = function (text, kind) {
    if (typeof text === 'string' && text.length > 12) { const e = (this._eco = this._eco || []); e.push({ text, t: this.notteT || 0 }); if (e.length > 40) e.shift(); }
    return say.call(this, text, kind);
  };
  P.notteEco = function () {
    const old = (this._eco || []).filter((q) => (this.notteT || 0) - q.t >= NOTTE.ecoMin);
    if (old.length) return old[Math.floor(R(this) * old.length)].text;
    const km = Math.floor(this.s.dist / 1000);
    return `…km ${km}… km ${km}… km ${km}…`;
  };
  P.notteRadio = function () {
    const text = this.notteEco();
    this.lastRadioDist = text;
    if (this.onRadioDist) this.onRadioDist(text);
    return text;
  };

  // «Quella dietro»: uscendo dal benzinaio la scena parte appena l'auto è fuori
  const exit = P.exitPlace;
  P.exitPlace = function () {
    const I = this.inside, v = this.s.vg;
    exit.call(this);
    if (I && I.id === 'fuel' && v && !v.seen.quellaDietro && this.notte() && this.s.dist / 1000 >= NOTTE.dietroKm) this._dietro = { fase: 'attesa' };
  };
  P.notteDietro = function () {
    const D = this._dietro, v = this.s.vg, d = this.s.dist; if (!D) return;
    if (D.fase === 'attesa') {
      if (this.inside || this.prompt || this.ap) return;
      v.seen.quellaDietro = true; D.fase = 'scena'; D.d0 = d;
      // l'altra: la tua stessa auto, parcheggiata dietro, ferma
      const e = this.spawnTraffic ? this.spawnTraffic(d - 9, 1) : null;
      if (e) { e.lane = 0; e.v = 0; e.parked = true; e.still = true; e.twin = true; e.vt = CARS[this.car] && CARS[this.car].sprite ? this.car : e.vt; e.len = 4.5; e.color = parseInt(String(this.paintHex || '#c81d11').slice(1), 16); e.x = d - 9; D.e = e; }   // appena dietro di te, al bordo dello schermo
      const txt = typeof vgTesto === 'function' ? vgTesto(this, NOTTE_DIETRO.testo) : NOTTE_DIETRO.testo;
      const sms = () => { if (typeof window !== 'undefined' && window.telefono && window.telefono.sms) window.telefono.sms('Numero sconosciuto', NOTTE_DIETRO.sms, { bad: 1 }); else this.say('Numero sconosciuto: «' + NOTTE_DIETRO.sms + '»', 'bad'); };
      this.ask({ kind: 'odd', title: 'Il benzinaio', text: txt, time: 30, options: [
        { label: 'Vado a vedere', act: () => { if (D.e) { const i = this.ents.indexOf(D.e); if (i >= 0) this.ents.splice(i, 1); D.e = null; } this.ask({ kind: 'odd', title: 'Dietro il market', text: NOTTE_DIETRO.vedi, time: 20, options: [{ label: '…', act: sms }], onTimeout: sms }); } },
        { label: 'Lascio stare', act: () => { D.smsT = 4; } },
      ], onTimeout: () => { D.smsT = 4; } });
      return;
    }
    if (D.smsT !== undefined && !this.prompt) { D.smsT -= 1 / 30; if (D.smsT <= 0) { D.smsT = undefined; if (typeof window !== 'undefined' && window.telefono && window.telefono.sms) window.telefono.sms('Numero sconosciuto', NOTTE_DIETRO.sms, { bad: 1 }); else this.say('Numero sconosciuto: «' + NOTTE_DIETRO.sms + '»', 'bad'); } }
    // appena ti allontani l'altra non c'è più
    if (D.e && d - D.d0 > 80) { const i = this.ents.indexOf(D.e); if (i >= 0) this.ents.splice(i, 1); D.e = null; if (this.vgThink) this.vgThink(NOTTE_DIETRO.via); }
    if (!D.e && D.smsT === undefined && !this.prompt) this._dietro = null;
  };

  const up = P.update;
  P.update = function (dt) {
    up.call(this, dt);
    this.notteT = (this.notteT || 0) + dt;
    const v = this.s.vg; if (!v || this.inside || this.track !== 'city') return;
    if (this._dietro) this.notteDietro();
    // radio che disturba: solo di notte, ogni tanto, mai davanti a una domanda
    const km = this.s.dist / 1000;
    if (v.radioKm === undefined) v.radioKm = km + NOTTE.radioKm[0] + R(this) * (NOTTE.radioKm[1] - NOTTE.radioKm[0]);
    if (km >= v.radioKm) {
      v.radioKm = km + NOTTE.radioKm[0] + R(this) * (NOTTE.radioKm[1] - NOTTE.radioKm[0]);
      if (this.notte() && !this.prompt && !this.ap && R(this) < NOTTE.radioP) this.notteRadio();
    }
  };
})();

// ---------------------------------------------------------------- il browser: radio, interfaccia, buio
(function notteBrowser() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const css = document.createElement('style');
  css.textContent = `
body.hud-ess #hudNext, body.hud-ess #hudVg, body.hud-ess .dash-btns, body.hud-ess #replayTag { display: none !important; }
body.buio .hud-l, body.buio .radio-chip, body.buio .minimap, body.buio .dash-btns, body.buio .toasts, body.buio .fsbtn, body.buio .pensiero, body.buio #radar { opacity: 0 !important; pointer-events: none !important; transition: opacity 1.2s; }
body.buio #stDark { background: radial-gradient(ellipse 75% 55% at 45% 78%, transparent 38%, rgba(0,0,0,.92) 100%) !important; }
.radio-chip.rvdist { animation: rvdist .11s steps(2) infinite; }
.radio-chip.rvdist .rv-t, .radio-chip.rvdist .rv-sta { color: #ff6b6b !important; }
@keyframes rvdist { 0% { filter: none; transform: translateX(0); } 50% { filter: hue-rotate(160deg) contrast(1.6); transform: translateX(1px); } }`;
  document.head.appendChild(css);
  const $ = (id) => document.getElementById(id);
  // interfaccia Essenziale / Meccanico
  const applyHud = (m) => { document.body.classList.toggle('hud-ess', m === 'ess'); const s = $('hudModeSel'); if (s) s.value = m; try { localStorage.setItem('nr_hud', m); } catch (e) { /* ignora */ } };
  let mode = 'mecc'; try { mode = localStorage.getItem('nr_hud') || 'mecc'; } catch (e) { /* ignora */ }
  const ready = () => {
    applyHud(mode);
    const sel = $('hudModeSel'); if (sel) sel.addEventListener('change', (e) => applyHud(e.target.value));
    const g = window.nightRun && window.nightRun.game; if (!g) return setTimeout(ready, 300);
    g.onRadioDist = (text) => disturbo(text);
  };
  // la radio che disturba: fruscio, titolo che diventa un avviso vecchio, poi torna com'era
  const sporca = (t) => t.split('').map((c) => (c !== ' ' && Math.random() < 0.18 ? '▒' : c)).join('');
  let busy = false;
  function disturbo(text) {
    if (busy) return; busy = true;
    const btn = $('radioBtn'), r = window.nightRun && window.nightRun.radio;
    const T = btn && btn.querySelector('.rv-t'), St = btn && btn.querySelector('.rv-sta');
    const prima = [T && T.textContent, St && St.textContent];
    if (r && r.ctx && r.out && r.noiseBuf) {
      try {
        const c = r.ctx, s = c.createBufferSource(), g = c.createGain(), bp = c.createBiquadFilter(), t = c.currentTime, D = NOTTE.radioDur;
        s.buffer = r.noiseBuf; s.loop = true; bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 0.8;
        const lvl = Math.max(0.12, r.level ? r.level() * 1.2 : 0.3);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(lvl, t + 0.06); g.gain.setValueAtTime(lvl * 0.5, t + D * 0.4); g.gain.linearRampToValueAtTime(lvl, t + D * 0.7); g.gain.linearRampToValueAtTime(0, t + D);
        bp.frequency.setValueAtTime(900, t); bp.frequency.linearRampToValueAtTime(2600, t + D);
        s.connect(bp); bp.connect(g); g.connect(r.out); s.start(t); s.stop(t + D + 0.05);
        if (r.el && !r.el.paused) { const v0 = r.el.volume; r.el.volume = Math.max(0, v0 * 0.25); setTimeout(() => { try { r.el.volume = v0; } catch (e) { /* ignora */ } }, D * 1000); }
      } catch (e) { /* niente audio: resta il titolo */ }
    }
    if (btn) {
      btn.classList.add('rvdist');
      let k = 0; const iv = setInterval(() => { if (T) T.textContent = '«' + sporca(text) + '»'; if (St) St.textContent = k++ % 2 ? '??.?' : 'FM ' + (87 + Math.random() * 20).toFixed(1); }, 140);
      setTimeout(() => { clearInterval(iv); btn.classList.remove('rvdist'); if (T && prima[0] !== null) T.textContent = prima[0]; if (St && prima[1] !== null) St.textContent = prima[1]; busy = false; }, NOTTE.radioDur * 1000);
    } else setTimeout(() => { busy = false; }, NOTTE.radioDur * 1000);
  }
  // buio delle incursioni: il resto dell'interfaccia sparisce, la strada e il cruscotto restano
  setInterval(() => {
    const g = window.nightRun && window.nightRun.game, st = g && g.s && g.s.vg && g.s.vg.story;
    document.body.classList.toggle('buio', !!(st && st.att));
  }, 250);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready); else ready();
  window.NightNotte = { disturbo, hud: applyHud };
})();
if (typeof window !== 'undefined') Object.assign(window, { NOTTE, NOTTE_DIETRO });
