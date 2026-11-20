// ============================================================================
//  Night Run · Il diario di viaggio (dopo statistiche.js)
//  App Diario nel telefono: una riga per ogni momento importante del Viaggio, con una piccola foto presa in quel momento
//  quando serve. Si scrive da solo: arrivo in una capitale, incidente grosso, fuga dalla polizia, motore rotto, auto
//  nuova, soccorso e traino, ogni 100 km. Le righe stanno in `game.s.vg.dia` (testo corto, si salva con la partita);
//  le foto (192×108, JPEG) in `localStorage` `nr_diario_foto`, al massimo `DIA.fotoMax`, fuori dal salvataggio per non appesantirlo.
//  Gli altri file chiamano `game.diaAdd(tipo, testo, conFoto)` se c'è. Costanti in `DIA`.
// ============================================================================
const DIA = {
  max: 300,              // righe tenute (le più vecchie se ne vanno)
  fotoMax: 40,           // foto tenute
  attesa: 1.2,           // secondi tra il fatto e la foto (il tempo di vedere la scena)
  urto: 0.15,            // danni presi in un colpo per scrivere un incidente
  pausaUrto: 30,         // secondi tra un incidente e il successivo nel diario
  ogni: 100,             // km tra una riga «km di Viaggio» e l'altra
};
const DIA_TIPI = { cap: ['Capitale', '#ffd86a'], urto: ['Incidente', '#ff6b5a'], fuga: ['Fuga', '#6ea8ff'], guasto: ['Guasto', '#ff9f43'], auto: ['Auto', '#7ee787'], soc: ['Soccorso', '#ffb020'], km: ['Strada', '#b8bfd8'] };

(function diarioLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  const km = (g) => (g.s.dist || 0) / 1000;
  const vg = (g) => g.s.vg;
  P.dia = function () { const v = vg(this); return v ? (v.dia || (v.dia = [])) : []; };
  // aggiunge una riga; con conFoto la foto parte dopo DIA.attesa secondi (se il browser la sa fare)
  P.diaAdd = function (tipo, testo, conFoto) {
    const v = vg(this); if (!v || this.mode !== 'career') return null;
    const L = this.dia(), n = (v.diaN = (v.diaN || 0) + 1);
    const e = { n, km: Math.round(km(this) * 10) / 10, tipo, txt: String(testo).slice(0, 120), foto: conFoto && !this.inside ? 1 : 0, w: DIA.attesa };
    L.push(e); while (L.length > DIA.max) L.shift();
    return e;
  };
  P.diaStep = function (dt) {
    for (const e of this.dia()) {
      if (e.foto !== 1) continue;
      e.w -= dt; if (e.w > 0) continue;
      e.foto = this.diaShot && !this.inside && this.diaShot(e) ? 2 : 0;       // senza browser (o dentro un locale) la riga resta senza foto
    }
  };
  const up = P.update;
  P.update = function (dt) {
    up.call(this, dt);
    const v = vg(this); if (!v || this.mode !== 'career') return;
    this.diaStep(dt);
    const sim = this.sim, k = km(this), lid = this.loc && this.loc.id;
    // capitali (una volta sola ciascuna)
    if (typeof CAP !== 'undefined' && lid && CAP[lid]) { const m = v.diaCap || (v.diaCap = {}); if (!m[lid]) { m[lid] = 1; this.diaAdd('cap', `Arrivo a ${CAP[lid].name}`, true); } }
    // incidente: danni di colpo
    this._diaT = (this._diaT || 0) + dt;
    const dm = sim.damage || 0;
    if (this._diaDm !== undefined && dm - this._diaDm >= DIA.urto && this._diaT - (this._diaU ?? -99) > DIA.pausaUrto) { this._diaU = this._diaT; this.diaAdd('urto', `Incidente: danni al ${Math.round(dm * 100)} %`, true); }
    this._diaDm = dm;
    // fuga dalla polizia
    const fuga = !!(this.s.pol && this.s.pol.fuga);
    if (this._diaFuga === false && fuga) this.diaAdd('fuga', 'Scappi alla polizia', true);
    this._diaFuga = fuga;
    // motore rotto
    const e = this.motOf && this.motOf(), rotto = !!(e && e.rotto);
    if (this._diaRotto === false && rotto) this.diaAdd('guasto', 'Il motore si rompe');
    this._diaRotto = rotto;
    // auto nuova
    const nG = (v.garage || []).length;
    if (this._diaG !== undefined && nG > this._diaG) { const id = v.garage[nG - 1]; this.diaAdd('auto', `Nuova auto: ${(typeof CARS !== 'undefined' && CARS[id] && CARS[id].name) || id}`, true); }
    this._diaG = nG;
    // ogni 100 km
    const m = Math.floor(k / DIA.ogni);
    if (v.diaKm === undefined) v.diaKm = m; else if (m > v.diaKm) { v.diaKm = m; this.diaAdd('km', `${m * DIA.ogni} km di Viaggio`); }
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { DIA, DIA_TIPI });

// ---------------------------------------------------------------- foto e app nel telefono (solo nel browser)
(function diarioApp() {
  if (typeof document === 'undefined' || typeof window === 'undefined' || typeof StreetGame === 'undefined') return;
  const KEY = 'nr_diario_foto';
  const G = () => window.nightRun && window.nightRun.game;
  const fmt = (n, d = 0) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: d });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const leggi = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (err) { return {}; } };
  // la foto: la strada com'è adesso, piccola
  StreetGame.prototype.diaShot = function (e) {
    try {
      const c = document.getElementById('g2d'); if (!c || !c.width) return false;
      const t = document.createElement('canvas'); t.width = 192; t.height = 108;
      t.getContext('2d').drawImage(c, 0, 0, c.width, c.height, 0, 0, 192, 108);
      const m = leggi(); m[e.n] = t.toDataURL('image/jpeg', 0.6);
      const ks = Object.keys(m).map(Number).sort((a, b) => a - b); while (ks.length > DIA.fotoMax) delete m[ks.shift()];
      localStorage.setItem(KEY, JSON.stringify(m)); return true;
    } catch (err) { return false; }
  };
  const CSS = `
.dr-hd{background:linear-gradient(135deg,#1c2a4a,#0a0e18);border-radius:16px;padding:10px 12px;margin-bottom:8px;font-size:12px;color:var(--t2)}.dr-hd b{display:block;font:800 16px system-ui;color:#fff}
.dr-it{display:grid;grid-template-columns:96px 1fr;gap:10px;padding:8px 2px 10px;border-bottom:1px solid #ffffff12;align-items:center}.dr-it.nof{grid-template-columns:1fr}
.dr-it img{width:96px;border-radius:8px;image-rendering:auto}.dr-it b{display:block;font-size:13px}.dr-it small{color:var(--t2);font-size:11.5px}
.dr-tag{display:inline-block;padding:1px 7px;border-radius:9px;font:700 10px system-ui;color:#10121c;margin-right:6px}`;
  function render() {
    const g = G(); if (!g || !g.s || !g.s.vg) return '';
    const L = g.dia().slice().reverse(), foto = leggi(), caps = Object.keys(g.s.vg.diaCap || {}).length;
    const items = L.map((e) => {
      const T = DIA_TIPI[e.tipo] || ['', '#b8bfd8'], img = e.foto === 2 && foto[e.n] ? `<img alt="" src="${foto[e.n]}">` : '';
      return `<div class="dr-it ${img ? '' : 'nof'}">${img}<div><span class="dr-tag" style="background:${T[1]}">${T[0]}</span><small>km ${fmt(e.km, 1)}</small><b>${esc(e.txt)}</b></div></div>`;
    }).join('');
    return `<div class="view app"><div class="nav"><h3>Diario</h3></div><div class="body">
      <div class="dr-hd"><b>${fmt((g.s.dist || 0) / 1000, 1)} km di Viaggio</b>${caps} ${caps === 1 ? 'capitale' : 'capitali'} · ${L.length} ${L.length === 1 ? 'momento' : 'momenti'}. Si scrive da solo.</div>
      ${items || '<p class="cen">Ancora niente. Il diario si riempie strada facendo.</p>'}
    </div></div>`;
  }
  const add = () => {
    if (!window.telefono || !window.telefono.addApp) return false;
    window.telefono.addApp({ id: 'dia', name: 'Diario', color: 'linear-gradient(145deg,#6ea8ff,#2a4a9a)', css: CSS,
      icon: '<path d="M6 3h11a2 2 0 0 1 2 2v15H8a2 2 0 0 1-2-2z"/><path d="M6 18a2 2 0 0 1 2-2h11"/><path d="M10 8h6M10 11h4"/>', render, click: () => {} });
    if (window.telefono.install) window.telefono.install('dia');
    return true;
  };
  if (!add()) addEventListener('load', add);
})();
