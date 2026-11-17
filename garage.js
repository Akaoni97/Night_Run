// ============================================================================
//  Night Run · Il garage (dopo sfascio.js)
//  App Garage nel telefono: le tue auto con categoria, km, stato (carrozzeria, gomme, olio, pastiglie, pulizia),
//  potenza e valore all'Autosalone; quella che guidi in cima. Traguardi da collezionista (marche, categorie, ricomprare
//  le auto dello zio finite in salone). La collezione (auto avute almeno una volta) sta in
//  game.s.vg.coll. Le categorie (ST_CAT, stCat) sono in strada.js.
// ============================================================================
// le sei auto del garage dello zio (prologo): se ne sceglie una, le altre cinque finiscono in vendita all'Autosalone
const GAR_ZIO = ['panda', 'a80', 'v40', 'punto', 'corsa', 'polo'];
const GAR_NOMARCA = ['Taxi', 'Furgone', 'Autobus', 'Auto', 'Ambulanza'];    // mezzi senza marca nel nome

(function garageLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  // auto avute almeno una volta (si aggiorna da sola guardando il garage)
  P.garColl = function () { const v = this.s.vg; if (!v) return {}; const c = v.coll || (v.coll = {}); for (const id of v.garage || []) c[id] = 1; return c; };
  P.garMarca = function (id) { const n = (CARS[id] && CARS[id].name) || ''; const m = n.split(' ')[0]; return GAR_NOMARCA.includes(m) ? null : m; };
  // stato di un'auto: quella che guidi dalla fisica, le altre da quello che è salvato quando le hai lasciate
  P.garState = function (id) {
    const cur = id === this.car, st = this.s.cars[id] || {}, sim = this.sim;
    const m = st.maint || { oil: 1, plugs: 1, pads: 1, dirt: 0.2 };
    return { id, cur, km: st.km || 0, damage: cur ? sim.damage || 0 : st.damage || 0, wear: cur ? sim.tireWear || 0 : st.tireWear || 0, fuel: cur ? sim.fuel : st.fuel ?? 0.6,
      oil: m.oil ?? 1, pads: m.pads ?? 1, dirt: m.dirt ?? 0.2, tired: !!st.tired, cat: typeof stCat === 'function' ? stCat(id) : '',
      value: this.dlValue ? this.dlValue(id) : 0, test: !!(this.s.vg.test && this.s.vg.test.id === id) };
  };
  P.garList = function () { const v = this.s.vg; if (!v) return []; const ids = (v.garage || []).slice(); ids.sort((a, b) => (b === this.car) - (a === this.car)); return ids.map((id) => this.garState(id)); };

  // traguardi da collezionista (si aggiungono all'elenco di traguardi.js)
  if (typeof TRG_LIST === 'undefined') return;
  const cats = ['utilitaria', 'familiare', 'hot', 'sportiva'];
  TRG_LIST.push(
    { id: 'marche5', name: 'Cinque marche', text: 'Possiedi auto di cinque marche diverse (anche non insieme).', prize: { cassa: 'argento' },
      check: (g) => [new Set(Object.keys(g.garColl()).map((id) => g.garMarca(id)).filter(Boolean)).size, 5] },
    { id: 'categorie', name: 'Una per tipo', text: 'Possiedi un\'utilitaria, una familiare, una piccola sportiva e una sportiva (anche non insieme).', prize: { cassa: 'argento' },
      check: (g) => [new Set(Object.keys(g.garColl()).map((id) => stCat(id)).filter((c) => cats.includes(c))).size, 4] },
    { id: 'zio6', name: 'Il garage dello zio', text: 'Ricompra all\'Autosalone le cinque auto dello zio che non avevi scelto (anche non insieme).', prize: { cassa: 'argento' },
      check: (g) => { const c = g.garColl(); return [GAR_ZIO.filter((id) => c[id]).length, 6]; } },
  );
})();

// ---------------------------------------------------------------- app Garage nel telefono (solo nel browser)
(function garageApp() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const G = () => window.nightRun && window.nightRun.game;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pic = (id, cb) => (window.NightDealer && window.NightDealer.pic ? window.NightDealer.pic(id, cb) : '');
  const CSS = `
.gr-hd{background:linear-gradient(135deg,#123a4a,#0a1418);border-radius:16px;padding:10px 12px;margin-bottom:8px;font-size:12px;color:var(--t2)}.gr-hd b{display:block;font:800 16px system-ui;color:#fff}
.gr-it{padding:10px 4px 12px;border-bottom:1px solid #ffffff12}.gr-top{display:grid;grid-template-columns:96px 1fr;gap:10px;align-items:center}
.gr-it img{width:96px;image-rendering:pixelated}.gr-it b{display:block;font-size:13.5px}.gr-it small{display:block;color:var(--t2);font-size:11.5px}
.gr-tag{display:inline-block;margin-top:3px;padding:1px 7px;border-radius:9px;font:700 10.5px system-ui;background:#ffffff1a;color:#e8e8e8}.gr-tag.cur{background:#2fd16a;color:#062a12}.gr-tag.t{background:#ffb347;color:#2a1600}
.gr-v{font:800 14px system-ui;color:#b8ff3a}
.gr-bars{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:8px}.gr-bars div{font-size:10px;color:var(--t2)}.gr-bars i{display:block;height:5px;border-radius:3px;background:#ffffff1a;margin-top:3px;overflow:hidden}.gr-bars i u{display:block;height:100%}
.gr-warn{margin-top:6px;font-size:11px;color:#ffb347}`;
  const bar = (label, v) => { const k = Math.max(0, Math.min(1, v)), c = k > 0.6 ? '#2fd16a' : k > 0.3 ? '#ffb347' : '#ff453a'; return `<div>${label}<i><u style="width:${Math.round(k * 100)}%;background:${c}"></u></i></div>`; };
  function render() {
    const g = G(); if (!g || !g.s || !g.s.vg) return '';
    const list = g.garList(), tot = list.reduce((a, s) => a + (s.test ? 0 : s.value), 0);
    const re = () => window.telefono.render();
    const items = list.map((s) => {
      const c = CARS[s.id] || {}, spec = g.dlSpec ? g.dlSpec(s.id) : null, warn = [];
      if (s.damage > 0.3) warn.push('carrozzeria da sistemare'); if (s.wear > 0.6) warn.push('gomme da cambiare'); if (s.oil < 0.3) warn.push('tagliando da fare'); if (s.tired) warn.push('motore stanco (revisione da Niko)');
      return `<div class="gr-it"><div class="gr-top"><img alt="" src="${pic(s.id, re)}"><div><b>${esc(c.name || s.id)}</b>
        <small>${fmt(s.km)} km${spec ? ` · ${fmt(spec.cv)} CV · ${fmt(spec.kg)} kg` : ''}</small>
        <span class="gr-tag ${s.cur ? 'cur' : ''}">${s.cur ? 'La guidi ora' : 'In garage'}</span> <span class="gr-tag">${esc(typeof ST_CAT_ONE !== 'undefined' ? ST_CAT_ONE[s.cat] || '' : '')}</span>${s.test ? ' <span class="gr-tag t">Giro di prova</span>' : ''}
        ${s.test ? '' : `<div class="gr-v">vale € ${fmt(s.value)}</div>`}</div></div>
        <div class="gr-bars">${bar('Carrozzeria', 1 - s.damage)}${bar('Gomme', 1 - s.wear)}${bar('Olio', s.oil)}${bar('Pastiglie', s.pads)}${bar('Pulizia', 1 - s.dirt)}</div>
        ${warn.length ? `<div class="gr-warn">${esc(warn.join(' · '))}</div>` : ''}</div>`;
    }).join('');
    return `<div class="view app"><div class="nav"><h3>Garage</h3></div><div class="body">
      <div class="gr-hd"><b>${list.length} auto · valore € ${fmt(tot)}</b>Le auto si cambiano al Motel Ovunque e all'Autosalone Notte; si comprano lì o dai privati (app Annunci).</div>
      ${items || '<p class="cen">Nessuna auto.</p>'}
    </div></div>`;
  }
  const add = () => {
    if (!window.telefono || !window.telefono.addApp) return false;
    window.telefono.addApp({ id: 'gar', name: 'Garage', color: 'linear-gradient(145deg,#4ad0ff,#0a5a8a)', css: CSS,
      icon: '<path d="M3 10l9-6 9 6v10H3z"/><path d="M6 20v-6h12v6"/><path d="M8 17h8"/>', render, click: () => {} });
    if (window.telefono.install) window.telefono.install('gar');
    return true;
  };
  if (!add()) addEventListener('load', add);
})();
if (typeof window !== 'undefined') Object.assign(window, { GAR_ZIO });
