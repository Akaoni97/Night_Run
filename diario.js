// ============================================================================
//  Night Run · Il diario di viaggio (dopo statistiche.js)
//  App Diario nel telefono: una riga per ogni momento importante del Viaggio, con una piccola foto presa in quel momento
//  quando serve. Si scrive da solo: arrivo in una capitale, incidente grosso, fuga dalla polizia, auto
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

// ---------------------------------------------------------------- mappa del Viaggio (v0.110, pure, provate in test/diario.test.js)
// i km a cui comincia ogni capitale lungo il giro (`route` = VG_ROUTE, `ordine` = CAP_ORDER)
function diaPercorso(route, ordine) {
  const out = []; let k = 0;
  for (const [id, len] of route) { if (ordine.includes(id) && !out.some((c) => c.id === id)) out.push({ id, km: k }); k += len; }
  return out.sort((a, b) => ordine.indexOf(a.id) - ordine.indexOf(b.id));
}
// dove sta un km sulla spezzata delle capitali: indice frazionario (0 = prima capitale, 1 = seconda...), fermo all'ultima
function diaPunto(perc, km) {
  if (!perc.length) return 0; if (km <= perc[0].km) return 0;
  for (let i = 1; i < perc.length; i++) if (km < perc[i].km) return i - 1 + (km - perc[i - 1].km) / Math.max(1e-6, perc[i].km - perc[i - 1].km);
  return perc.length - 1;
}

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
    // auto nuova
    const nG = (v.garage || []).length;
    if (this._diaG !== undefined && nG > this._diaG) { const id = v.garage[nG - 1]; this.diaAdd('auto', `Nuova auto: ${(typeof CARS !== 'undefined' && CARS[id] && CARS[id].name) || id}`, true); }
    this._diaG = nG;
    // ogni 100 km
    const m = Math.floor(k / DIA.ogni);
    if (v.diaKm === undefined) v.diaKm = m; else if (m > v.diaKm) { v.diaKm = m; this.diaAdd('km', `${m * DIA.ogni} km di Viaggio`); }
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { DIA, DIA_TIPI, diaPercorso, diaPunto });

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
.dr-map{background:linear-gradient(180deg,#0e1424,#080b14);border-radius:16px;padding:8px 6px 4px;margin-bottom:8px;box-shadow:inset 0 0 0 1px #ffffff14}.dr-map svg{display:block;width:100%;height:auto}.dr-map small{display:block;text-align:center;color:var(--t2);font-size:10.5px;padding:2px 0 4px}
.dr-it.big{grid-template-columns:1fr}.dr-it.big img{width:100%}.dr-it img{cursor:zoom-in}
.dr-tag{display:inline-block;padding:1px 7px;border-radius:9px;font:700 10px system-ui;color:#10121c;margin-right:6px}`;
  const UI = { big: 0 };
  // la mappa: le capitali (a serpentina: la rotta vera è impossibile), la linea
  // fatta finora, la posizione adesso e un punto per ogni momento del diario nel colore del suo tipo
  function mappa(g, L) {
    if (typeof CAP === 'undefined' || typeof CAP_ORDER === 'undefined' || typeof VG_ROUTE === 'undefined') return '';
    const perc = diaPercorso(VG_ROUTE, CAP_ORDER), k = (g.s.dist || 0) / 1000;
    if (perc.length < 2) return '';
    // le dodici capitali a serpentina, nell'ordine del giro (tra un continente e l'altro ci sono le gallerie: niente geografia vera)
    const W = 300, H = 132, P = perc.map((c, i) => { const r = Math.floor(i / 4), q = i % 4; return { id: c.id, x: 36 + (r % 2 ? 3 - q : q) * 76, y: 24 + r * 42 }; });
    const at = (t) => { const i = Math.min(P.length - 2, Math.floor(t)), f = Math.min(1, t - i); return { x: P[i].x + (P[i + 1].x - P[i].x) * f, y: P[i].y + (P[i + 1].y - P[i].y) * f }; };
    const tNow = diaPunto(perc, k), vis = g.s.vg.diaCap || {};
    let fatto = `M${P[0].x.toFixed(1)} ${P[0].y.toFixed(1)}`; const n = Math.floor(tNow);
    for (let i = 1; i <= n; i++) fatto += `L${P[i].x.toFixed(1)} ${P[i].y.toFixed(1)}`;
    const a = at(tNow); fatto += `L${a.x.toFixed(1)} ${a.y.toFixed(1)}`;
    const tutto = P.map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join('');
    const pt = L.map((e) => { const q = at(diaPunto(perc, e.km)), T = DIA_TIPI[e.tipo] || ['', '#b8bfd8']; return `<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="2.2" fill="${T[1]}" opacity=".85"/>`; }).join('');
    const nomi = P.map((p, i) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${i <= tNow + 0.01 ? 3.6 : 2.6}" fill="${vis[p.id] || i === 0 ? '#ffd86a' : '#3a4258'}"/><text x="${p.x.toFixed(1)}" y="${(p.y + 12).toFixed(1)}" font-size="8" fill="${vis[p.id] || i === 0 ? '#e8e0c8' : '#6a7490'}" text-anchor="middle" font-family="system-ui">${esc(CAP[p.id].name)}</text>`).join('');
    return `<div class="dr-map"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Mappa del Viaggio"><path d="${tutto}" fill="none" stroke="#2a3250" stroke-width="1.4" stroke-dasharray="3 3"/><path d="${fatto}" fill="none" stroke="#6ea8ff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>${pt}${nomi}<circle cx="${a.x.toFixed(1)}" cy="${a.y.toFixed(1)}" r="4.6" fill="#ff5fa8" stroke="#fff" stroke-width="1.2"/></svg><small>Il tuo Viaggio · km ${fmt(k, 1)} · i punti sono i momenti del diario</small></div>`;
  }
  function render() {
    const g = G(); if (!g || !g.s || !g.s.vg) return '';
    const L = g.dia().slice().reverse(), foto = leggi(), caps = Object.keys(g.s.vg.diaCap || {}).length;
    const items = L.map((e) => {
      const T = DIA_TIPI[e.tipo] || ['', '#b8bfd8'], img = e.foto === 2 && foto[e.n] ? `<img alt="" src="${foto[e.n]}">` : '';
      return `<div class="dr-it ${img ? (UI.big === e.n ? 'big' : '') : 'nof'}">${img ? `<img alt="" data-x="foto" data-v="${e.n}" src="${foto[e.n]}">` : ''}<div><span class="dr-tag" style="background:${T[1]}">${T[0]}</span><small>km ${fmt(e.km, 1)}</small><b>${esc(e.txt)}</b></div></div>`;
    }).join('');
    return `<div class="view app"><div class="nav"><h3>Diario</h3></div><div class="body">
      <div class="dr-hd"><b>${fmt((g.s.dist || 0) / 1000, 1)} km di Viaggio</b>${caps} ${caps === 1 ? 'capitale' : 'capitali'} · ${L.length} ${L.length === 1 ? 'momento' : 'momenti'}. Si scrive da solo.</div>
      ${mappa(g, L)}${items || '<p class="cen">Ancora niente. Il diario si riempie strada facendo.</p>'}
    </div></div>`;
  }
  const add = () => {
    if (!window.telefono || !window.telefono.addApp) return false;
    window.telefono.addApp({ id: 'dia', name: 'Diario', color: 'linear-gradient(145deg,#6ea8ff,#2a4a9a)', css: CSS,
      icon: '<path d="M6 3h11a2 2 0 0 1 2 2v15H8a2 2 0 0 1-2-2z"/><path d="M6 18a2 2 0 0 1 2-2h11"/><path d="M10 8h6M10 11h4"/>', render, click: (D) => { if (D.x === 'foto') { UI.big = UI.big === +D.v ? 0 : +D.v; window.telefono.render(); } } });
    if (window.telefono.install) window.telefono.install('dia');
    return true;
  };
  if (!add()) addEventListener('load', add);
})();
