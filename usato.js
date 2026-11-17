// ============================================================================
//  Night Run · L'usato dei privati (dopo concessionario.js)
//  Annunci nell'app Annunci del telefono: un privato aspetta alla tappa con la sua auto e il cartello VENDESI.
//  Quando entri in quella tappa, nel pannello c'è l'annuncio: la guardi, ci fai un giro, chiami Niko a vederla,
//  tratti sul prezzo (più difetti hai scoperto, più è facile) e la compri. Le auto possono nascondere difetti:
//  carrozzeria rifatta, gomme finite, freni finiti, tagliando mai fatto, motore stanco (−15 % finché Niko non lo
//  revisiona), chilometri scalati. Comprata bene e sistemata, all'Autosalone si rivende con guadagno.
//  Stato in game.s.vg.usato. Gli annunci vengono dalla strada (sempre gli stessi per la stessa tappa).
// ============================================================================
const US = {
  chance: 0.4,          // probabilità che a una tappa ci sia un annuncio
  ahead: 10,            // quante tappe avanti si vedono nell'app
  niko: 120,            // Niko che viene a vederla
  tired: 0.85,          // potenza col motore stanco
  nego: [[0.1, 0.6, 0.15], [0.2, 0.3, 0.2], [0.3, 0.08, 0.22]],   // sconto, probabilità di base, in più per ogni difetto scoperto
};
const US_NAMES = ['Marco', 'Giulia', 'Sandro', 'Rita', 'Ivo', 'Lorena', 'Tonino', 'Paola', 'Franco', 'Elena', 'Bruno', 'Silvana', 'Dario', 'Nadia', 'Gino', 'Teresa'];
const US_LINES = ['Tenuta come una figlia.', 'Unico proprietario, sempre in garage.', 'La vendo perché mi trasferisco.', 'Mai fatto un incidente, giuro.', 'Tagliandi fatti tutti, il libretto l\'ho perso.',
  'Va che è una meraviglia.', 'Era di mio padre, la usava solo la domenica.', 'Prezzo trattabile, ma poco.', 'Ho bisogno di soldi, fai tu.', 'Qualche graffietto, niente di che.'];
// difetti: see = come si scopre prima di comprare (eye: guardandola, drive: facendo un giro, niko: solo Niko)
const US_DEF = {
  carrozzeria: { name: 'Carrozzeria rifatta male', note: 'sotto la vernice stucco e ruggine', see: 'eye', apply: (st) => { st.damage = Math.max(st.damage || 0, 0.35); } },
  gomme: { name: 'Gomme finite', note: 'battistrada quasi liscio', see: 'eye', apply: (st) => { st.tireWear = Math.max(st.tireWear || 0, 0.85); } },
  freni: { name: 'Freni finiti', note: 'il pedale va giù e fischia', see: 'drive', apply: (st, m) => { m.pads = Math.min(m.pads, 0.06); } },
  motore: { name: 'Motore stanco', note: 'fuma blu e tira poco: −15 % finché non lo revisioni', see: 'drive', apply: (st) => { st.tired = true; } },
  olio: { name: 'Tagliando mai fatto', note: 'olio nero, candele consumate', see: 'niko', apply: (st, m) => { m.oil = Math.min(m.oil, 0.05); m.plugs = Math.min(m.plugs, 0.15); } },
  km: { name: 'Chilometri scalati', note: 'il contachilometri è stato girato indietro', see: 'niko', apply: (st, m, L) => { st.km = (st.km || 0) + (L.kmExtra || 0); } },
};
const US_DEF_IDS = Object.keys(US_DEF);

(function usatoLogica() {
  if (typeof StreetGame === 'undefined' || typeof VG_SHOP === 'undefined') return;
  const P = StreetGame.prototype;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const r50 = (v) => Math.round(v / 50) * 50;
  const km = (g) => (g.s.dist || 0) / 1000;
  P.us = function () { const v = this.s.vg; return v.usato || (v.usato = { done: {}, insp: {}, seen: {}, log: [], flips: 0, profit: 0 }); };

  // l'annuncio della tappa n (null se lì non vende nessuno)
  P.usAt = function (n) {
    const h = (k) => VG.hash(n * 31 + k * 7.13 + 0.5);
    if (n < 1 || h(1) > US.chance) return null;
    const stop = VG.stop(n); if (stop.id === 'dealer' || stop.id === 'junk') return null;
    const at = stop.x / 1000, pool = VG_SHOP.filter((q) => q.car && CARS[q.id] && CARS[q.id].sprite && q.km <= at + 60);
    if (!pool.length) return null;
    const id = pool[Math.floor(h(2) * pool.length)].id, it = VG_SHOP.find((q) => q.id === id);
    const kmCar = Math.round(30 + h(3) * 270), r = h(4), nd = r < 0.3 ? 0 : r < 0.72 ? 1 : 2;
    const defects = [];
    for (let k = 0; defects.length < nd && k < 12; k++) { const d = US_DEF_IDS[Math.floor(h(5 + k) * US_DEF_IDS.length)]; if (!defects.includes(d)) defects.push(d); }
    const dep = Math.max(0.3, 0.72 - kmCar / 1000 * 0.3);
    return { n, x: stop.x, place: stop.name, id, km: kmCar, defects, kmExtra: defects.includes('km') ? Math.round(80 + h(20) * 160) : 0,
      price: r50(it.price * dep * (0.82 + h(21) * 0.2)), seller: US_NAMES[Math.floor(h(22) * US_NAMES.length)], line: US_LINES[Math.floor(h(23) * US_LINES.length)] };
  };
  // annunci ancora validi dalla prossima tappa in avanti
  P.usList = function () {
    const v = this.s.vg; if (!v || !v.on) return [];
    const cur = Math.max(1, Math.ceil((this.s.dist - VG_STOP0 - 30) / VG_STEP)), out = [];
    for (let n = cur; n < cur + US.ahead; n++) { const L = this.usAt(n); if (L && !this.us().done[n]) out.push(L); }
    return out;
  };
  P.usInsp = function (n) { const U = this.us(); return U.insp[n] || (U.insp[n] = { rev: [], look: false, drive: false, niko: false, nego: null, price: null }); };
  P.usPrice = function (L) { const I = this.us().insp[L.n]; return I && I.price ? I.price : L.price; };
  const atStop = (g, n) => g.inside && Math.round((g.inside.x - VG_STOP0) / VG_STEP) === n;
  const reveal = (I, L, kind, p, rnd) => { const got = []; for (const d of L.defects) if (US_DEF[d].see === kind && !I.rev.includes(d) && (p >= 1 || rnd() < p)) { I.rev.push(d); got.push(d); } return got; };
  const names = (ds) => ds.map((d) => US_DEF[d].name.toLowerCase()).join(', ');

  P.usLook = function (n, rnd = Math.random) {
    const L = this.usAt(n); if (!L || !atStop(this, n)) return { ok: false, why: 'L\'auto è a un\'altra tappa' };
    const I = this.usInsp(n); if (I.look) return { ok: false, why: 'L\'hai già guardata' };
    I.look = true; const got = reveal(I, L, 'eye', 0.75, rnd);
    return { ok: true, got, msg: got.length ? `Giri intorno all'auto: ${names(got)}.` : 'Giri intorno all\'auto: a vista sembra a posto.' };
  };
  P.usDrive = function (n, rnd = Math.random) {
    const L = this.usAt(n); if (!L || !atStop(this, n)) return { ok: false, why: 'L\'auto è a un\'altra tappa' };
    const I = this.usInsp(n); if (I.drive) return { ok: false, why: 'Il giro l\'hai già fatto' };
    I.drive = true; const got = reveal(I, L, 'drive', 0.65, rnd);
    return { ok: true, got, msg: got.length ? `Un giro dell'isolato: ${names(got)}.` : 'Un giro dell\'isolato: va dritta, frena, non fa rumori strani.' };
  };
  P.usNiko = function (n) {
    const L = this.usAt(n); if (!L || !atStop(this, n)) return { ok: false, why: 'L\'auto è a un\'altra tappa' };
    const I = this.usInsp(n); if (I.niko) return { ok: false, why: 'Niko l\'ha già vista' };
    if (this.s.money < US.niko) return { ok: false, why: `Niko vuole € ${US.niko} per venire` };
    this.s.money -= US.niko; I.niko = true; I.look = true; I.drive = true;
    const got = [...reveal(I, L, 'eye', 1), ...reveal(I, L, 'drive', 1), ...reveal(I, L, 'niko', 1)];
    return { ok: true, got, msg: L.defects.length ? `Niko: «${I.rev.map((d) => US_DEF[d].name).join('. ')}.» (− € ${US.niko})` : `Niko: «Questa è sana. Prendila.» (− € ${US.niko})` };
  };
  // trattativa: una sola volta per annuncio. level 0, 1, 2 = −10, −20, −30 %
  P.usNego = function (n, level, rnd = Math.random) {
    const L = this.usAt(n); if (!L || !atStop(this, n)) return { ok: false, why: 'L\'auto è a un\'altra tappa' };
    const I = this.usInsp(n); if (I.nego) return { ok: false, why: I.nego === 'ok' ? 'Avete già chiuso sul prezzo' : `${L.seller}: «Il prezzo è quello.»` };
    const [d, p0, k] = US.nego[level] || US.nego[0], p = Math.min(0.95, p0 + k * I.rev.length);
    if (rnd() < p) { I.nego = 'ok'; I.price = r50(L.price * (1 - d)); return { ok: true, won: true, msg: `${L.seller}: «Va bene, € ${fmt(I.price)}. Ma solo perché è tardi.»` }; }
    I.nego = 'no'; return { ok: true, won: false, msg: `${L.seller}: «Ma scherzi? Il prezzo è quello.»` };
  };
  P.usChance = function (n, level) { const I = this.usInsp(n), [, p0, k] = US.nego[level]; return Math.min(0.95, p0 + k * I.rev.length); };

  // mette nel garage un'auto con i suoi chilometri e i difetti (anche per lo sfasciacarrozze)
  P.usGive = function (id, kmCar, defects, extra = {}, paid = 0) {
    const v = this.s.vg; v.garage.push(id); v.owned[id] = true;
    const st = this.carState(id); st.km = kmCar; st.fuel = Math.max(st.fuel || 0, 0.25); st.usedPaid = paid; st.defects = defects.slice();
    const m = st.maint || (st.maint = { oil: 0.7, plugs: 0.7, pads: 0.7, dirt: 0.6 });
    for (const d of defects) US_DEF[d].apply(st, m, extra);
    if (extra.damage) st.damage = Math.max(st.damage || 0, extra.damage);
    return st;
  };
  P.usBuy = function (n) {
    const L = this.usAt(n); if (!L || !atStop(this, n)) return { ok: false, why: 'L\'auto è a un\'altra tappa' };
    const v = this.s.vg; if (v.garage.includes(L.id)) return { ok: false, why: 'Una così ce l\'hai già' };
    const price = this.usPrice(L); if (this.s.money < price) return { ok: false, why: `${L.seller} vuole € ${fmt(price)}` };
    this.s.money -= price; this.us().done[n] = 'bought';
    this.usGive(L.id, L.km, L.defects, L, price);
    this.us().log.unshift({ id: L.id, paid: price, n, seller: L.seller }); this.us().log.length = Math.min(this.us().log.length, 12);
    this.say(`${CARS[L.id].name} di ${L.seller}: è tua (− € ${fmt(price)}). La trovi qui fuori: la cambi al motel o all'Autosalone.`, 'buy');
    return { ok: true, price };
  };

  // motore stanco: revisione da Niko
  P.usRevCost = function (id = this.car) { const it = VG_SHOP.find((q) => q.id === id); return r50((it ? it.price : 4000) * 0.06 + 500); };
  P.usRevision = function () {
    const st = this.carState(); if (!st.tired) return { ok: false, why: 'Il motore è a posto' };
    const c = this.usRevCost(); if (this.s.money < c) return { ok: false, why: `Niko vuole € ${fmt(c)}` };
    this.s.money -= c; st.tired = false; if (st.defects) st.defects = st.defects.filter((d) => d !== 'motore');
    this.say(`Motore revisionato: fasce, guarnizioni, valvole (− € ${fmt(c)})`, 'buy'); return { ok: true };
  };
  // il motore stanco toglie potenza (si somma ai potenziamenti delle valigette)
  if (P.caseBoosts) { const cb = P.caseBoosts; P.caseBoosts = function () { const b = cb.call(this); return this.s && this.s.vg && this.carState().tired ? b * US.tired : b; }; }
  // l'Autosalone valuta meno un motore stanco; e se rivendi un usato tiene il conto del guadagno
  if (P.dlValue) { const dv = P.dlValue; P.dlValue = function (id) { const st = (this.s.cars || {})[id] || {}; return st.tired ? Math.round(dv.call(this, id) * 0.75 / 50) * 50 : dv.call(this, id); }; }
  if (P.dlSell) {
    const ds = P.dlSell;
    P.dlSell = function (id) {
      const paid = ((this.s.cars || {})[id] || {}).usedPaid || 0, r = ds.call(this, id);
      if (r.ok && paid) { const U = this.us(); U.flips++; U.profit += r.val - paid; if (r.val > paid) U.best = Math.max(U.best || 0, r.val - paid); }
      return r;
    };
  }
})();

// ============================================================================
//  App Annunci, sezione dell'annuncio nel pannello del locale, auto col cartello sulla strada (solo nel browser)
// ============================================================================
(function usatoSchermo() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const G = () => window.nightRun && window.nightRun.game;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pic = (id, cb) => (window.NightDealer ? window.NightDealer.pic(id, cb) : '');
  const kmTo = (g, L) => Math.max(0, (L.x - g.s.dist) / 1000).toFixed(1).replace('.', ',');

  const CSS = document.createElement('style');
  CSS.textContent = `
.us-box{display:grid;gap:8px;padding:12px;background:linear-gradient(180deg,#1d1a12,#12110d);box-shadow:inset 0 0 0 1px #4a4234,inset 3px 0 0 #ffd23f}
.us-box h4{margin:0;font:400 15px/1.1 var(--f-display);letter-spacing:.05em;text-transform:uppercase;color:#ffd23f}
.us-top{display:grid;grid-template-columns:150px 1fr;gap:10px;align-items:center}.us-top img{max-width:100%;image-rendering:pixelated;filter:drop-shadow(0 6px 6px rgba(0,0,0,.6))}
.us-top b{font:400 18px/1.1 var(--f-display)}.us-top small{display:block;color:var(--muted);font-size:12.5px}.us-top q{display:block;font-style:italic;color:#f7d9ad;font-size:13.5px;margin-top:4px}
.us-price{font:400 20px/1 var(--f-display);color:var(--lime)}.us-price s{font-size:13px;color:var(--muted);margin-right:6px}
.us-defs{display:flex;flex-wrap:wrap;gap:5px}.us-defs span{font:500 12px/1.2 var(--f-body);padding:4px 8px;background:#3a0f16;color:#ffb3bf;box-shadow:inset 0 0 0 1px #8a2a3a}
.us-defs span.ok{background:#1a2a10;color:#c9dd5a;box-shadow:inset 0 0 0 1px #4a6a1a}
.us-acts{display:flex;flex-wrap:wrap;gap:6px}.us-acts .kbtn{flex:1 1 auto;font-size:12.5px;padding:8px 10px}.us-acts .kbtn:disabled{opacity:.38;cursor:default}
.us-acts .kbtn.buy{background:linear-gradient(180deg,#c9dd5a,#8fa02a);color:#141a04}.us-acts .kbtn small{color:inherit;opacity:.75}
.us-msg{font-size:13.5px;color:#f7d9ad;padding:6px 8px;background:#0b0a08;box-shadow:inset 0 0 0 1px #2a251d}`;
  document.head.appendChild(CSS);

  // sezione nel pannello del locale: l'annuncio di questa tappa, e da Niko la revisione del motore
  const UI = { msg: {} };
  function panel(body, I, ctx) {
    const holder = document.createElement('div'); holder.style.cssText = 'display:grid;gap:12px'; body.appendChild(holder);
    const draw = () => { holder.innerHTML = ''; fill(holder, I, Object.assign({}, ctx, { refresh: draw })); };
    draw();
  }
  function fill(body, I, ctx) {
    const g = G(); if (!g || !g.s.vg || !g.s.vg.on) return;
    const n = Math.round((I.x - VG_STOP0) / VG_STEP);
    if (I.id === 'niko' && g.carState().tired) {
      const d = document.createElement('div'); d.className = 'us-box';
      d.innerHTML = `<h4>Revisione del motore</h4><p class="hint" style="margin:0">Niko: «Questo motore è stanco: fasce, guarnizioni, valvole. Te lo rimetto in piedi.» Torna la potenza piena e all'Autosalone vale di più.</p>`;
      const a = document.createElement('div'); a.className = 'us-acts';
      const b = document.createElement('button'); b.type = 'button'; b.className = 'kbtn buy'; b.textContent = `Revisione · € ${fmt(g.usRevCost())}`;
      b.addEventListener('click', () => { const r = g.usRevision(); if (!r.ok) ctx.flash(r.why, 2.2); else { ctx.save(); ctx.refresh(); } });
      a.appendChild(b); d.appendChild(a); body.appendChild(d);
    }
    const L = g.usAt(n); if (!L || g.us().done[n]) return;
    const In = g.usInsp(n), price = g.usPrice(L);
    g.us().seen[n] = 1;
    const d = document.createElement('div'); d.className = 'us-box';
    const defs = In.rev.length ? In.rev.map((x) => `<span title="${esc(US_DEF[x].note)}">${esc(US_DEF[x].name)}</span>`).join('') : (In.niko ? '<span class="ok">Niko: è sana</span>' : '<span class="ok">Nessun difetto trovato (finora)</span>');
    d.innerHTML = `<h4>Vendesi · l'annuncio di ${esc(L.seller)}</h4>
      <div class="us-top"><img alt="" src="${pic(L.id, ctx.refresh)}"><div><b>${esc(CARS[L.id].name)}</b><small>${fmt(L.km)} km dichiarati · nel parcheggio</small><q>${esc(L.line)}</q><div class="us-price">${price !== L.price ? `<s>€ ${fmt(L.price)}</s>` : ''}€ ${fmt(price)}</div></div></div>
      <div class="us-defs">${defs}</div>${UI.msg[n] ? `<div class="us-msg">${esc(UI.msg[n])}</div>` : ''}`;
    const a = document.createElement('div'); a.className = 'us-acts';
    const btn = (label, cls, fn, dis) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'kbtn ' + cls; b.innerHTML = label; b.disabled = !!dis; b.addEventListener('click', () => { const r = fn(); if (r && r.ok === false) ctx.flash(r.why, 2.4); else { if (r && r.msg) UI.msg[n] = r.msg; ctx.save(); } ctx.refresh(); }); a.appendChild(b); };
    btn('Guardala bene<small> · gratis</small>', '', () => g.usLook(n), In.look);
    btn('Fai un giro<small> · gratis</small>', '', () => g.usDrive(n), In.drive);
    btn(`Chiama Niko<small> · € ${US.niko}</small>`, '', () => g.usNiko(n), In.niko || g.s.money < US.niko);
    if (!In.nego) US.nego.forEach(([dd], lv) => btn(`Offri −${Math.round(dd * 100)} %<small> · ${Math.round(g.usChance(n, lv) * 100)} % che accetti</small>`, '', () => g.usNego(n, lv)));
    btn(`Compra · € ${fmt(price)}`, 'buy', () => g.usBuy(n), g.s.money < price || g.s.vg.garage.includes(L.id));
    d.appendChild(a);
    if (g.s.vg.garage.includes(L.id)) { const p = document.createElement('p'); p.className = 'hint'; p.style.margin = '0'; p.textContent = 'Una così ce l\'hai già nel garage.'; d.appendChild(p); }
    body.appendChild(d);
  }

  // ---------------------------------------------------------------- app Annunci nel telefono
  const APPCSS = `
.us-it{display:grid;grid-template-columns:96px 1fr;gap:10px;align-items:center;padding:9px 4px;border-bottom:1px solid #ffffff12}
.us-it img{width:96px;image-rendering:pixelated}.us-it b{display:block;font-size:13.5px}.us-it small{display:block;color:var(--t2);font-size:11.5px}
.us-it .p{font:800 14px system-ui;color:#b8ff3a}.us-it .p s{color:var(--t2);font-weight:500;margin-right:4px}.us-it q{display:block;font-size:11.5px;font-style:italic;color:#e8dcc0}
.us-hd{background:linear-gradient(135deg,#3a2e08,#141008);border-radius:16px;padding:10px 12px;margin-bottom:8px;font-size:12px;color:var(--t2)}.us-hd b{display:block;font:800 16px system-ui;color:#fff}`;
  function render() {
    const g = G(); if (!g || !g.s.vg) return '';
    const list = g.usList(), U = g.us();
    for (const L of list) U.seen[L.n] = U.seen[L.n] || 2;
    return `<div class="view app"><div class="nav"><h3>Annunci</h3></div><div class="body">
      <div class="us-hd"><b>Auto usate da privati</b>Il venditore ti aspetta alla tappa: entra lì per vederla, provarla e trattare.${U.flips ? ` · Rivendute ${U.flips}, guadagno € ${fmt(U.profit)}` : ''}</div>
      ${list.length ? list.map((L) => { const p = g.usPrice(L); return `<div class="us-it"><img alt="" src="${pic(L.id, () => window.telefono.render())}"><div><b>${esc(CARS[L.id].name)}</b><small>${fmt(L.km)} km · ${esc(L.seller)} · ${esc(L.place)}, tra ${kmTo(g, L)} km</small><q>${esc(L.line)}</q><span class="p">${p !== L.price ? `<s>€ ${fmt(L.price)}</s>` : ''}€ ${fmt(p)}</span></div></div>`; }).join('') : '<p class="cen">Nessun annuncio nelle prossime tappe. Riprova più avanti.</p>'}
    </div></div>`;
  }
  const add = () => {
    if (!window.telefono || !window.telefono.addApp) return false;
    window.telefono.addApp({ id: 'usa', name: 'Annunci', color: 'linear-gradient(145deg,#ffe08a,#e8a020)', css: APPCSS,
      icon: '<path d="M4 6h16v12H4z"/><path d="M7 10h6M7 13h10M7 16h4"/><path d="M15 9h3v3h-3z" fill="#fff"/>',
      badge: () => { const g = G(); if (!g || !g.s || !g.s.vg) return 0; const U = g.us(); return g.usList().filter((L) => !U.seen[L.n]).length; }, render, click: () => {} });
    return true;
  };
  if (!add()) addEventListener('load', add);
  window.NightUsed = { panel, render };

  // ---------------------------------------------------------------- l'auto col cartello VENDESI davanti alla tappa
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, prev = S.drawTripPlace;
  S.drawTripPlace = function (g, e, x, st, near, open) {
    const game = G(), n = Math.round((e.x - VG_STOP0) / VG_STEP), L = game && game.usAt && game.s.vg && game.s.vg.on && !game.us().done[n] ? game.usAt(n) : null;
    if (L) {
      const k = 0.4, spr = this.trafficSprite && this.trafficSprite(L.id, 'orig', k);
      if (spr) {
        const cx = x - 200, base = 214, y = base - Math.round(spr.geo.wy * k + spr.geo.wr * k);
        g.drawImage(spr, Math.round(cx - spr.width / 2), y);
        if (spr.wheelImg && spr.wheelImg.width) for (const ax of spr.geo.ax) { const ww = spr.wheelImg.width * k, wh = spr.wheelImg.height * k; g.drawImage(spr.wheelImg, Math.round(cx - spr.width / 2 + ax * k - ww / 2), Math.round(y + spr.geo.wy * k - wh / 2), ww, wh); }
        // cartello sul vetro posteriore e prezzo su un cartoncino
        const C = this.C; g.fillStyle = C.ink; g.fillRect(Math.round(cx - 18), y - 16, 36, 12); g.fillStyle = '#ffd23f'; g.fillRect(Math.round(cx - 17), y - 15, 34, 10);
        this.text(g, 'VENDESI', Math.round(cx - this.textW('VENDESI', 1) / 2), y - 13, '#c42a1a', 1);
        if (near) this.light(g, cx, y - 10, 30, 10, '#ffd23f', 0.08, 2);
      }
    }
    return prev ? prev.call(this, g, e, x, st, near, open) : false;
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { US, US_DEF });
