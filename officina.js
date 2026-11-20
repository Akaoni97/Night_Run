// ============================================================================
//  Night Run · Officina semplice (dopo sfascio.js, prima di garage.js)
//  Da Luca Tuning una schermata sola, compatta, quasi tutta a clic (stile Forza / Gran Turismo):
//    · MODIFICHE: i pezzi del motore che hai sopra, a livelli (SERIE, LIV. 1, 2, 3...), un clic compra e monta; la «i» spiega cosa fa;
//    · SWAP MOTORE: metti sull'auto il motore di un'altra auto del gioco (CV, Nm, peso e prezzo sempre in vista).
//  Il vecchio Nico (livelli, magazzino, banco, motori costruiti) non si vede più: resta in `pistone/` ma spento di serie
//  (interruttore nella scheda Sviluppatori).
//  Regole: i livelli 1 e 2 sono già sbloccati (si compra e si monta subito), dal 3 in su servono i chilometri (`game.partKm`).
//  Swap: `game.s.swap[autoId] = donatore`. Il motore del donatore (curva di coppia, giri, turbo, cilindri, voce, peso) va sull'auto,
//  il resto (cambio, differenziale, gomme, assetto, frizione, carrozzeria) resta suo. I pezzi del motore (scarico, aspirazione, turbo,
//  centralina, intercooler...) diventano quelli del donatore: `offMerge` mette il catalogo del donatore al posto di quello dell'auto.
//  Parte pura (provata in test/officina.test.js): offMerge, offStock, offEstimate, offSwapPrice, offSwapApply.
//  Parte grafica: NightOfficina.panel(body, I, ctx), chiamata da openPlace (index.html) per Da Luca Tuning.
// ============================================================================
const OFF_GRUPPI = [
  { id: 'motore', nome: 'Motore', cats: ['intake', 'cams', 'ecu', 'limiter'], hint: 'Aspirazione, camme, centralina e limitatore: quanta potenza fa il motore e a che giri la dà.' },
  { id: 'turbo', nome: 'Turbo', cats: ['turbo', 'intercooler', 'wastegate', 'bov'], hint: 'Turbo, intercooler, wastegate e valvola pop-off: pressione e fischio.' },
  { id: 'scarico', nome: 'Scarico', cats: ['exhaust', 'cat'], hint: 'Scarico e catalizzatore: voce, fiamme e qualche cavallo.' },
  { id: 'trasm', nome: 'Trasmissione', cats: ['gearbox', 'final', 'clutch'], hint: 'Cambio, differenziale e frizione: come la potenza arriva alle ruote.' },
  { id: 'telaio', nome: 'Ruote e telaio', cats: ['tires', 'suspension', 'weight'], hint: 'Gomme, assetto e peso: aderenza e frenata.' },
];
// i reparti che appartengono al MOTORE (con lo swap diventano quelli del donatore); il limitatore è comune a tutte le auto
const OFF_MOTORE = ['exhaust', 'cat', 'intake', 'cams', 'ecu', 'turbo', 'intercooler', 'wastegate', 'bov'];
// campi della fisica e del suono che vengono dal motore (il resto dell'auto è quello dell'auto che ospita)
const OFF_SIM = ['turbo', 'pw', 'limiter', 'sparkCut', 'ecuLaunch', 'ecuPops', 'idle', 'camLow', 'camHigh', 'lope', 'ic', 'valve', 'boostK', 'limType', 'flatShift'];
const OFF_DSP = ['cyl', 'tb', 'bov', 'intake', 'scream', 'lope', 'spark', 'voice', 'ex', 'cat'];
const OFF = { liberoCv: 200, kmPerCv: 0.5, kmMax: 150, euroPerCv: 14, base: 500 };       // swap: fino a 200 CV sempre disponibile, oltre servono km; prezzo = base + CV × euroPerCv

// parametri di un'auto (la Supra non ha `params` nel suo record)
function offParamsOf(id, sel) {
  const c = typeof CARS !== 'undefined' && CARS[id];
  return c && c.params ? c.params(sel) : supraParams(sel);
}
const offCatalogOf = (id) => (typeof CARS !== 'undefined' && CARS[id] && CARS[id].tuning) || (id === 'supra' ? TUNING_SUPRA : null);
let _offSupraP = null;
function offPOf(id) {                                         // il record P di un'auto (la Supra: quello di serie della fisica)
  const c = typeof CARS !== 'undefined' && CARS[id];
  if (c && c.P) return c.P;
  return _offSupraP || (_offSupraP = new SupraSim().P);
}
const offStockSel = (cat) => Object.fromEntries(Object.keys(cat || {}).map((k) => [k, cat[k].items[0].id]));

// catalogo dell'auto che ospita, con i reparti del motore presi dal donatore (id con il prefisso «donatore:», così non si confondono
// e un pezzo comprato sull'auto non vale come comprato sul motore). Un reparto che il donatore non ha resta con il solo pezzo di serie.
function offMerge(hostId, donorId) {
  const host = offCatalogOf(hostId), donor = donorId && donorId !== hostId ? offCatalogOf(donorId) : null;
  if (!host || !donor) return host;
  const out = Object.assign({}, host);
  for (const k of OFF_MOTORE) {
    if (!host[k]) continue;
    if (donor[k]) out[k] = { label: donor[k].label, items: donor[k].items.map((it) => Object.assign({}, it, { id: donorId + ':' + it.id })) };
    else out[k] = { label: host[k].label, items: [host[k].items[0]] };
  }
  return out;
}
const offStrip = (sel, donorId) => Object.fromEntries(Object.entries(sel || {}).map(([k, v]) => [k, k === 'limiter' ? v : typeof v === 'string' && v.startsWith(donorId + ':') ? v.slice(donorId.length + 1) : '__stock']));   // il limitatore è comune a tutte le auto

// CV, Nm e giri del motore di serie di un'auto (con la fisica vera: stessa stima dell'officina), in cache
const _offEst = {};
function offEstimate(id) {
  if (_offEst[id]) return _offEst[id];
  let r;
  try {
    const cat = offCatalogOf(id), D = offParamsOf(id, offStockSel(cat)), s = new SupraSim();
    s.setCar(id === 'supra' ? null : Object.assign({}, CARS[id].P)); s.setTune(D.sim);
    const e = s.estimatePeak(); r = { cv: Math.round(e.cv / 5) * 5, nm: Math.round(e.nm / 5) * 5, rpm: Math.round(e.rpmCv / 100) * 100 };
  } catch (err) { r = { cv: 150, nm: 200, rpm: 6000 }; }
  r.kg = typeof motKgSerie === 'function' ? motKgSerie(id) : 150;
  r.lim = offPOf(id).limiter; r.turbo = !!(offParamsOf(id, offStockSel(offCatalogOf(id))).sim.turbo || {}).max;
  r.cyl = id === 'supra' ? 6 : ((CARS[id] && CARS[id].cyl) || 4);
  return (_offEst[id] = r);
}
// prezzo (con lo sconto del giocatore) e km di sblocco di uno swap
// anteprima di un pezzo (prima di pagare): quanto cambiano CV e Nm montandolo al posto di quello montato adesso. Stessa stima dell'officina
// su una fisica usa e getta, per differenza (così gli errori di stima si cancellano); con uno swap guarda il motore del donatore.
function offPicco(carId, sel, dId) {
  const id = dId || carId, s = new SupraSim(), D = offParamsOf(id, dId ? offStrip(sel, dId) : sel);
  s.setCar(id === 'supra' ? null : Object.assign({}, CARS[id].P)); s.setTune(D.sim);
  const e = s.estimatePeak(); return { cv: e.cv, nm: e.nm };
}
function offPreview(game, sel, k, itemId) {
  try {
    const dId = offSwapOf(game, game.car), a = offPicco(game.car, sel, dId), b = offPicco(game.car, Object.assign({}, sel, { [k]: itemId }), dId);
    const mass = game.sim.P.mass + 75, cv0 = game.sim.estimatePeak().cv, f = (cv) => 5.825 * Math.pow(mass * 2.2046 / (cv * 0.986), 1 / 3);
    const dcv = b.cv - a.cv;
    return { dcv, dnm: b.nm - a.nm, det: f(Math.max(10, cv0 + dcv)) - f(cv0) };
  } catch (err) { return null; }
}

function offSwapPrice(game, id) {
  const e = offEstimate(id), full = OFF.base + e.cv * OFF.euroPerCv, disc = game && game.disc ? game.disc() : 1;
  return Math.round(full * disc / 10) * 10;
}
const offSwapKm = (id) => Math.min(OFF.kmMax, Math.max(0, Math.round((offEstimate(id).cv - OFF.liberoCv) * OFF.kmPerCv / 5) * 5));
const offEngineName = (id) => (CARS[id] && CARS[id].engine) || '—';
function offSwapOf(game, carId) { const w = game && game.s && game.s.swap; return w && w[carId] && w[carId] !== carId && typeof CARS !== 'undefined' && CARS[w[carId]] ? w[carId] : null; }

// applica lo swap ai parametri già calcolati per l'auto (TP) e alla fisica (sim). Dà { tipo, hp } o null. `sel` = pezzi scelti (S.tune).
function offSwapApply(game, carId, TP, sim, sel) {
  const dId = offSwapOf(game, carId); if (!dId) return null;
  const D = offParamsOf(dId, offStrip(sel, dId)), Dp = offPOf(dId);
  for (const k of OFF_SIM) if (D.sim[k] !== undefined) TP.sim[k] = D.sim[k];
  TP.dsp = TP.dsp || {};
  for (const k of OFF_DSP) { if (D.dsp[k] !== undefined) TP.dsp[k] = D.dsp[k]; else delete TP.dsp[k]; }   // un campo che il donatore non ha (la voce della Supra) torna quello di serie del suono
  if (TP.dsp.cyl === undefined) TP.dsp.cyl = offEstimate(dId).cyl;
  if (D.look) { TP.look = TP.look || {}; TP.look.badge = D.look.badge || ''; }
  sim.P.tq = Dp.tq; sim.P.idle = TP.sim.idle != null ? TP.sim.idle : Dp.idle;
  const kg = (id) => (typeof motKgSerie === 'function' ? motKgSerie(id) : 150);
  TP.sim.dm = (TP.sim.dm || 0) + kg(dId) - kg(carId);              // il peso del motore in più (o in meno): lo somma game.applyMass
  TP.sim.boostK = D.sim.boostK !== undefined ? D.sim.boostK : 1;       // come il donatore (la Supra a piena efficienza, non quella dell'auto che ospita)
  const e = offEstimate(dId);
  return { tipo: offEngineName(dId), hp: e.cv };
}
// TUNING globale: il catalogo con i reparti del motore del donatore, se c'è uno swap (chiamata da applySettings dopo useCar)
function offCatalog(game, carId) {
  const dId = offSwapOf(game, carId);
  if (dId) { const m = offMerge(carId, dId); if (m) TUNING = m; }        // eslint-disable-line no-global-assign
  return dId;
}
// monta un motore (donatore) o rimette quello di serie (donatore = null). Dà { ok, why }. Soldi e manodopera in un prezzo solo.
function offSwapDo(game, S, carId, donorId) {
  if (typeof game.canMount === 'function' && !game.canMount()) return { ok: false, why: 'Le parti si montano da fermo: accosta e frena' };
  game.s.swap = game.s.swap || {}; game.s.swapOwn = game.s.swapOwn || {};
  const cur = offSwapOf(game, carId);
  if (!donorId || donorId === carId) { if (!cur) return { ok: true }; delete game.s.swap[carId]; }
  else {
    if (donorId === cur) return { ok: true };
    const key = carId + '|' + donorId, career = game.mode === 'career';
    if (!game.s.swapOwn[key]) {
      const km = offSwapKm(donorId), price = offSwapPrice(game, donorId);
      if (career && game.odo < km) return { ok: false, why: `Questo motore si sblocca a ${km} km: ne hai ${Math.floor(game.odo)}` };
      if (career && game.s.money < price) return { ok: false, why: `Mancano € ${(price - Math.floor(game.s.money)).toLocaleString('it-IT')}` };
      if (career) game.s.money -= price;
      game.s.swapOwn[key] = 1;
    }
    game.s.swap[carId] = donorId;
  }
  // i pezzi del motore tornano di serie (quelli di prima non c'entrano con il motore nuovo)
  const m = offMerge(carId, offSwapOf(game, carId)) || offCatalogOf(carId);
  if (S && S.tune && m) for (const k of OFF_MOTORE) if (m[k]) S.tune[k] = m[k].items[0].id;
  return { ok: true };
}

if (typeof window !== 'undefined') Object.assign(window, { OFF, OFF_GRUPPI, OFF_MOTORE, offMerge, offEstimate, offSwapPrice, offSwapKm, offSwapOf, offPreview, offSwapApply, offCatalog, offSwapDo, offEngineName });

// ---------------------------------------------------------------- la schermata
(function officina() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const E = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (n) => Math.round(n).toLocaleString('it-IT');
  const css = `
.of { margin: 12px 0 16px; color: #ece6d6; font: 14px/1.4 system-ui, sans-serif; }
.of-sum { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 10px; }
.of-sum div { background: #1b1826; border: 1px solid #3a3548; border-radius: 10px; padding: 6px 8px; }
.of-sum b { display: block; font: 700 18px/1.1 var(--f-display, sans-serif); color: #ffd27a; } .of-sum small { color: #9a9486; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; }
.of-tabs, .of-grp { display: flex; gap: 6px; flex-wrap: wrap; margin: 6px 0; }
.of-tabs button { flex: 1; padding: 9px 10px; border: 1px solid #4a4458; border-radius: 10px; background: #1e1b28; color: #cfc8b8; font: 700 14px/1 var(--f-data, sans-serif); cursor: pointer; letter-spacing: .04em; text-transform: uppercase; }
.of-tabs button[aria-selected="true"] { background: #ffb347; color: #1a1206; border-color: #ffb347; }
.of-grp button { padding: 6px 10px; border: 1px solid #3a3548; border-radius: 999px; background: #17141f; color: #b8b0a0; font: 600 12px/1 var(--f-data, sans-serif); cursor: pointer; }
.of-grp button[aria-selected="true"] { border-color: #ffb347; color: #ffd27a; background: #2a2230; }
.of-grp button small { color: #8fe0a0; margin-left: 4px; }
.of-row { margin: 6px 0; padding: 8px 10px; background: #1b1826; border: 1px solid #332e40; border-radius: 10px; }
.of-row.mod { border-color: #6a5a2a; }
.of-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.of-head b { font-size: 14px; } .of-head em { font-style: normal; color: #8a8478; font-size: 12px; margin-left: 6px; }
.of-i { width: 24px; height: 24px; border-radius: 50%; border: 1px solid #6a6478; background: #14121c; color: #cfc8b8; font: italic 700 13px/1 Georgia, serif; cursor: pointer; flex: none; }
.of-i[aria-expanded="true"] { background: #38bdf8; color: #06121a; border-color: #38bdf8; }
.of-d { display: block; margin-top: 2px; font: 700 11px/1 ui-monospace, monospace; font-style: normal; color: #a9a396; } .of-d.su { color: #8fe0a0; } .of-d.giu { color: #ff8a7a; }
.of-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 7px; }
.of-chip { display: flex; flex-direction: column; align-items: flex-start; min-width: 78px; padding: 6px 9px; border: 1px solid #4a4458; border-bottom-width: 3px; border-radius: 9px; background: #262232; color: #ece6d6; cursor: pointer; font: 700 12px/1.15 var(--f-data, monospace); text-align: left; }
.of-chip small { font-weight: 500; color: #a9a396; margin-top: 2px; }
.of-chip.cur { background: #ffb347; border-color: #ffb347; color: #1a1206; } .of-chip.cur small { color: #3a2a0a; }
.of-chip.own { border-color: #8fe0a0; } .of-chip.own small { color: #8fe0a0; }
.of-chip.lock { opacity: .55; cursor: not-allowed; } .of-chip.poor { border-color: #7a3a3a; } .of-chip.poor small { color: #ff8a7a; }
.of-info { margin-top: 8px; padding: 8px 10px; background: #0f0d15; border-radius: 8px; color: #cfc8b8; font-size: 12.5px; }
.of-info p { margin: 3px 0; } .of-info b { color: #ffd27a; }
.of-hint { color: #9a9486; font-size: 12.5px; margin: 6px 2px; }
.of-cur { margin: 8px 0; padding: 8px 10px; border: 1px solid #38bdf8; border-radius: 10px; background: #0f1a22; font-size: 13px; }
.of-swaps { max-height: 360px; overflow: auto; padding-right: 2px; }
.of-sw { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: center; }
.of-sw .nm b { display: block; font-size: 14px; } .of-sw .nm small { color: #9a9486; font-size: 12px; }
.of-sw .st { color: #ffd27a; font: 700 12px/1.2 var(--f-data, monospace); text-align: right; white-space: nowrap; }
.of-go { padding: 7px 12px; border: 1px solid #ffb347; border-radius: 8px; background: #ffb347; color: #1a1206; font: 700 12px/1 var(--f-data, monospace); cursor: pointer; }
.of-go:disabled { background: #2a2636; color: #8a8478; border-color: #4a4458; cursor: not-allowed; }
@media (max-width: 520px) { .of-sum { grid-template-columns: repeat(2, 1fr); } }`;
  let tab = 'mod', grp = 'motore', open = {};

  function panel(body, I, ctx) {
    if (!document.getElementById('ofCss')) { const st = document.createElement('style'); st.id = 'ofCss'; st.textContent = css; document.head.appendChild(st); }
    const box = document.createElement('div'); box.className = 'of'; body.appendChild(box);
    const render = () => draw(box, ctx);
    box.addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab]'); if (t) { tab = t.dataset.tab; render(); return; }
      const g = e.target.closest('[data-grp]'); if (g) { grp = g.dataset.grp; render(); return; }
      const i = e.target.closest('[data-i]'); if (i) { open[i.dataset.i] = !open[i.dataset.i]; render(); return; }
      const c = e.target.closest('[data-k]'); if (c && !c.classList.contains('cur')) { ctx.mount(c.dataset.k, c.dataset.id); ctx.after && ctx.after(); render(); return; }
      const s = e.target.closest('[data-swap]');
      if (s) {
        const r = offSwapDo(ctx.game, ctx.S, ctx.game.car, s.dataset.swap === '-' ? null : s.dataset.swap);
        if (!r.ok) { ctx.flash(r.why, 2.6); return; }
        ctx.apply(); ctx.save(); ctx.after && ctx.after();
        ctx.flash(s.dataset.swap === '-' ? 'Motore di serie rimontato' : 'Motore montato: ' + offEngineName(s.dataset.swap), 2); render();
      }
    });
    // anteprima: passando sopra un livello le barre in alto mostrano cosa cambierebbe (non compra niente)
    let pv = null;
    const sumEl = () => box.querySelector('.of-sum');
    const pvOff = () => { clearTimeout(pv); if (box._pvOn) { box._pvOn = false; const s = sumEl(); if (s) s.outerHTML = summary(ctx); } };
    box.addEventListener('mouseover', (e) => {
      const c = e.target.closest('[data-k]'); if (!c) return pvOff();
      if (c.classList.contains('cur')) return pvOff();
      clearTimeout(pv);
      pv = setTimeout(() => { const d = offPreview(ctx.game, ctx.S.tune, c.dataset.k, c.dataset.id), s = sumEl(); if (d && s) { box._pvOn = true; s.outerHTML = summary(ctx, d); } }, 90);
    });
    box.addEventListener('mouseleave', pvOff);
    box.addEventListener('click', () => { clearTimeout(pv); box._pvOn = false; }, true);
    render();
    return box;
  }

  // d = anteprima di un pezzo (offPreview): sotto ogni numero la differenza, verde se migliora e rossa se peggiora
  function summary(ctx, d) {
    const sim = ctx.sim, g = ctx.game, est = sim.estimatePeak(), et = g.etEstimate(), kgcv = (sim.P.mass + 75) / est.cv;
    const dl = (v, dec, unit, buonoSeNeg) => { if (!d || Math.abs(v) < Math.pow(10, -dec) / 2) return d ? '<i class="of-d">=</i>' : ''; const ok = buonoSeNeg ? v < 0 : v > 0; return `<i class="of-d ${ok ? 'su' : 'giu'}">${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(dec).replace('.', ',')}${unit}</i>`; };
    const kgcv2 = d ? (sim.P.mass + 75) / Math.max(10, est.cv + d.dcv) - kgcv : 0;
    return `<div class="of-sum"><div><b>${fmt(Math.round(est.cv / 5) * 5)}</b><small>CV a ${fmt(est.rpmCv)}</small>${d ? dl(d.dcv, 0, ' CV', false) : ''}</div><div><b>${fmt(Math.round(est.nm / 5) * 5)}</b><small>Nm</small>${d ? dl(d.dnm, 0, ' Nm', false) : ''}</div>`
      + `<div><b>${kgcv.toFixed(1).replace('.', ',')}</b><small>kg per CV</small>${d ? dl(kgcv2, 2, '', true) : ''}</div><div><b>${et.toFixed(1).replace('.', ',')} s</b><small>400 m stimati</small>${d ? dl(d.det, 2, ' s', true) : ''}</div></div>`;
  }

  function draw(box, ctx) {
    const g = ctx.game, carId = g.car, career = g.mode === 'career', money = g.s.money, dId = offSwapOf(g, carId);
    let h = summary(ctx);
    h += `<div class="of-tabs" role="tablist"><button type="button" role="tab" data-tab="mod" aria-selected="${tab === 'mod'}">Modifiche</button><button type="button" role="tab" data-tab="swap" aria-selected="${tab === 'swap'}">Swap motore${dId ? ' ✓' : ''}</button></div>`;
    h += tab === 'mod' ? drawMod(ctx, career, money) : drawSwap(ctx, carId, dId, career, money);
    box.innerHTML = h;
  }

  function drawMod(ctx, career, money) {
    const g = ctx.game, S = ctx.S, T = TUNING;
    const vis = (k) => T[k] && T[k].items.length > 1;
    const groups = OFF_GRUPPI.map((G) => Object.assign({}, G, { cats: G.cats.filter(vis) }));
    const known = new Set(OFF_GRUPPI.flatMap((G) => G.cats)), rest = Object.keys(T).filter((k) => !known.has(k) && vis(k));
    if (rest.length) groups.push({ id: 'altro', nome: 'Altro', cats: rest, hint: '' });
    const shown = groups.filter((G) => G.cats.length);
    if (!shown.some((G) => G.id === grp)) grp = shown.length ? shown[0].id : 'motore';
    const cur = (k) => Math.max(0, T[k].items.findIndex((it) => it.id === S.tune[k]));
    let h = '<div class="of-grp" role="tablist">' + shown.map((G) => { const up = G.cats.filter((k) => cur(k) > 0).length; return `<button type="button" role="tab" data-grp="${G.id}" aria-selected="${G.id === grp}">${E(G.nome)}${up ? `<small>${up}</small>` : ''}</button>`; }).join('') + '</div>';
    const G = shown.find((x) => x.id === grp); if (!G) return h + '<p class="of-hint">Niente da modificare su questa auto.</p>';
    h += `<p class="of-hint">${E(G.hint)}</p>`;
    for (const k of G.cats) {
      const cat = T[k], ci = cur(k);
      const chips = cat.items.map((it, i) => {
        const isCur = i === ci, owned = g.owns(k, it.id), lock = g.partLocked(k, it.id), price = g.price(k, it.id);
        const st = isCur ? 'montato' : owned ? 'tuo' : lock ? `🔒 ${fmt(g.partKm(k, it.id))} km` : `€ ${fmt(price)}`;
        const cls = ['of-chip', isCur ? 'cur' : '', !isCur && owned ? 'own' : '', lock ? 'lock' : '', !isCur && !owned && !lock && career && price > money ? 'poor' : ''].filter(Boolean).join(' ');
        return `<button type="button" class="${cls}" data-k="${k}" data-id="${E(it.id)}" title="${E((it.brand || '') + ' ' + it.name)}" ${lock ? 'aria-disabled="true"' : ''}>${i === 0 ? 'SERIE' : 'LIV. ' + i}<small>${E(st)}</small></button>`;
      }).join('');
      const c = cat.items[ci];
      let info = '';
      if (open[k]) info = '<div class="of-info">' + cat.items.map((it, i) => `<p><b>${i === 0 ? 'Serie' : 'Liv. ' + i}${i === ci ? ' · montato' : ''}</b> · ${E(it.brand && !['Su misura', '—', 'Integrata'].includes(it.brand) ? it.brand + ' ' : '')}${E(it.name)} — ${E(it.note || '')}</p>`).join('') + '</div>';
      h += `<div class="of-row${ci > 0 ? ' mod' : ''}"><div class="of-head"><span><b>${E(cat.label)}</b><em>${E(c.name || '')}</em></span><button type="button" class="of-i" data-i="${k}" aria-expanded="${!!open[k]}" aria-label="Cosa fa" title="Cosa fa">i</button></div><div class="of-chips">${chips}</div>${info}</div>`;
    }
    return h + '<p class="of-hint">Un clic compra e monta. I livelli 1 e 2 sono sempre disponibili, i migliori si sbloccano coi chilometri. Quello che compri resta tuo.</p>';
  }

  function drawSwap(ctx, carId, dId, career, money) {
    const g = ctx.game, ids = ['supra'].concat(CAR_IDS.filter((x) => x !== 'supra')).filter((x) => CARS[x]);
    const cv0 = offEstimate(carId).cv, list = ids.filter((x) => x !== carId && offEstimate(x).cv > cv0).sort((a, b) => offEstimate(b).cv - offEstimate(a).cv);   // solo motori più forti di quello di serie, i più forti in cima
    const row = (id, orig) => {
      const e = offEstimate(id), cur = orig ? !dId : dId === id, owned = !!(g.s.swapOwn && g.s.swapOwn[carId + '|' + id]);
      const km = orig ? 0 : offSwapKm(id), price = orig ? 0 : offSwapPrice(g, id), lock = !orig && !owned && career && g.odo < km, poor = !orig && !owned && career && price > money;
      const st = cur ? 'MONTATO' : orig ? 'gratis' : owned ? 'tuo · gratis' : lock ? `🔒 da ${km} km` : `€ ${fmt(price)}`;
      const info = [`${e.cyl} cilindri${e.turbo ? ', turbo' : ', aspirato'}`, `limitatore ${fmt(e.lim)} giri`, `circa ${e.kg} kg`, `${fmt(e.cv)} CV a ${fmt(e.rpm)} giri`].join(' · ');
      const name = orig ? `${offEngineName(carId)} (di serie)` : `${offEngineName(id)}`;
      const sub = orig ? 'Il motore con cui l\'auto è nata' : `dalla ${CARS[id].short || CARS[id].name}`;
      return `<div class="of-row"><div class="of-sw"><span class="nm"><b>${E(name)}</b><small>${E(sub)} · ${fmt(e.cv)} CV · ${fmt(e.nm)} Nm · ${e.kg} kg</small></span>`
        + `<span class="st">${E(st)}</span><button type="button" class="of-go" data-swap="${orig ? '-' : id}" ${cur || lock || poor ? 'disabled' : ''}>${cur ? 'Montato' : 'Monta'}</button></div>`
        + `<div class="of-head" style="margin-top:4px"><small style="color:#8a8478">${E(info)}</small><button type="button" class="of-i" data-i="sw:${id}" aria-expanded="${!!open['sw:' + id]}" title="Cosa cambia">i</button></div>`
        + (open['sw:' + id] ? `<div class="of-info"><p>${orig ? 'Rimonta il motore originale: i pezzi del motore tornano quelli di questa auto.' : `Monti il motore della ${E(CARS[id].name)} sulla tua auto: curva di coppia, giri, turbo, voce e peso del motore cambiano; cambio, differenziale, gomme, assetto e frizione restano quelli dell'auto. La frizione può slittare se il motore è troppo forte. I pezzi del motore diventano quelli di questo motore (di serie all'inizio).`}</p></div>` : '') + '</div>';
    };
    const cur = dId ? `<div class="of-cur">Motore montato: <b>${E(offEngineName(dId))}</b> (dalla ${E(CARS[dId].short || CARS[dId].name)}).</div>` : '';
    return cur + '<p class="of-hint">Metti sulla tua auto il motore di un\'altra auto del gioco. Il prezzo comprende la manodopera. Fino a 200 CV si monta subito, i più forti si sbloccano coi chilometri. Una volta pagato un motore, rimontarlo è gratis.</p>'
      + '<div class="of-swaps">' + row(carId, true) + list.map((id) => row(id, false)).join('') + '</div>';
  }

  window.NightOfficina = { panel, OFF_GRUPPI };
})();
