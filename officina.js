// ============================================================================
//  Night Run · Officina semplice (dopo sfascio.js, prima di garage.js)
//  Da Luca Tuning una schermata sola, compatta, quasi tutta a clic (stile Forza / Gran Turismo):
//    · MODIFICHE: i pezzi del motore che hai sopra, a livelli (SERIE, LIV. 1, 2, 3...), un clic compra e monta; la «i» spiega cosa fa;
//    · SWAP MOTORE: metti sull'auto il motore di un'altra auto del gioco (CV, Nm, peso e prezzo sempre in vista);
//    · SUONI: i campioni audio dei pezzi (valvola, turbo, scarico, centralina...), da campioni.js (NightCampioni.html/click).
//  Il vecchio negozio di Nico (cartella `pistone/`: livelli, magazzino, banco, motori costruiti) è stato cancellato il 21/11
//  sera: di suo serviva solo il peso del motore per lo swap (`offKgSerie`, qui sotto). Chi aveva speso da Nico riceve i soldi
//  indietro una volta sola (`offPistoneRimborso`).
//  Regole: i livelli 1 e 2 sono già sbloccati (si compra e si monta subito), dal 3 in su servono i chilometri (`game.partKm`).
//  Swap: `game.s.swap[autoId] = donatore`. Il motore del donatore (curva di coppia, giri, turbo, cilindri, voce, peso) va sull'auto,
//  il resto (cambio, differenziale, gomme, assetto, frizione, carrozzeria) resta suo. I pezzi del motore (scarico, aspirazione, turbo,
//  centralina, intercooler...) diventano quelli del donatore: `offMerge` mette il catalogo del donatore al posto di quello dell'auto.
//  Parte pura (provata in test/officina.test.js): offMerge, offStock, offEstimate, offSwapPrice, offSwapApply.
//  Parte grafica: NightOfficina.panel(body, I, ctx), chiamata da openPlace (index.html) per Da Luca Tuning.
// ============================================================================
const OFF_GRUPPI = [
  { id: 'motore', nome: 'Motore', cats: ['intake', 'displacement', 'cams', 'special', 'fuel', 'ecu', 'limiter'], hint: 'Aspirazione, cilindrata, camme, il reparto speciale dell\'auto, benzina, centralina e limitatore: quanta potenza fa il motore, a che giri la dà e quanta pressione regge.' },
  { id: 'turbo', nome: 'Turbo', cats: ['turbo', 'intercooler', 'wastegate', 'bov'], hint: 'Turbo, intercooler, wastegate e valvola pop-off: pressione e fischio.' },
  { id: 'scarico', nome: 'Scarico', cats: ['exhaust', 'cat'], hint: 'Scarico e catalizzatore: voce, fiamme e qualche cavallo.' },
  { id: 'trasm', nome: 'Trasmissione', cats: ['gearbox', 'final', 'clutch', 'flywheel'], hint: 'Cambio, differenziale, frizione e volano: come la potenza arriva alle ruote.' },
  { id: 'telaio', nome: 'Ruote e telaio', cats: ['tires', 'suspension', 'weight'], hint: 'Gomme, assetto e peso: aderenza e frenata.' },
];
// i reparti che appartengono al MOTORE (con lo swap diventano quelli del donatore); il limitatore è comune a tutte le auto
const OFF_MOTORE = ['exhaust', 'cat', 'intake', 'displacement', 'cams', 'special', 'fuel', 'ecu', 'turbo', 'intercooler', 'wastegate', 'bov'];
// campi della fisica e del suono che vengono dal motore (il resto dell'auto è quello dell'auto che ospita)
const OFF_SIM = ['turbo', 'pw', 'limiter', 'sparkCut', 'ecuLaunch', 'ecuPops', 'idle', 'camLow', 'camHigh', 'lope', 'ic', 'valve', 'boostK', 'limType', 'flatShift'];
const OFF_DSP = ['cyl', 'tb', 'bov', 'intake', 'scream', 'lope', 'spark', 'voice', 'ex', 'cat'];
const OFF = { liberoCv: 200, kmPerCv: 0.5, kmMax: 150, euroPerCv: 14, base: 500 };       // swap: fino a 200 CV sempre disponibile, oltre servono km; prezzo = base + CV × euroPerCv

// peso del motore di serie di un'auto (per lo swap): dai cilindri e dal tipo (era motKgSerie del vecchio Pistone)
function offKgSerie(carId) {
  const c = typeof CARS !== 'undefined' && CARS[carId]; if (!c) return 150;
  const cyl = carId === 'supra' ? 6 : c.cyl || ((c.tag || '').includes('cinque') ? 5 : 4), diesel = c.P && c.P.limiter < 5200;
  return (cyl >= 6 ? (carId === 'supra' ? 230 : 200) : cyl === 5 ? 165 : 130) + (diesel ? 25 : 0);
}
// il vecchio negozio di Nico non c'è più: quello che ci avevi speso torna in soldi, una volta sola (livelli imparati, pezzi
// comprati, motori costruiti a prezzo pieno). Prezzi dei pezzi copiati dal suo catalogo prima di cancellarlo.
const OFF_PIS_PEZZI = {"blocco:b4_16":900,"blocco:b4_20":1400,"blocco:b5_23":2600,"blocco:b6_25":3200,"blocco:b6_30":4800,"blocco:b4_20cd":4200,"blocco:b6_30cd":7500,"albero:fuso":400,"albero:forg":1300,"albero:stroker":1900,"albero:billet":2900,"bielle:fuse":300,"bielle:h":900,"bielle:harp":1400,"bielle:ti":2200,"pistoni:std":350,"pistoni:ipe":600,"pistoni:low":1000,"pistoni:high":1100,"pistoni:g2618":2200,"olio:serie":120,"olio:hv":450,"olio:hvr":1100,"olio:secco":3800,"testata:v2":600,"testata:v4":1500,"testata:v4p":2600,"testata:v4r":4300,"camme:serie":250,"camme:sport":700,"camme:gara":1300,"camme:vvt":2600,"sovra:tp":2200,"sovra:sc":3000,"sovra:tm":3600,"sovra:tg":5200,"sovra:tgs":7400,"intercooler:fms":700,"intercooler:fmg":1500,"intercooler:aa":3200,"iniettori:i250":200,"iniettori:i440":600,"iniettori:i750":1100,"iniettori:i1000":1700,"benzina:serie":150,"benzina:p255":450,"benzina:dop":1100,"benzina:mecc":2400,"centralina:serie":300,"centralina:rimap":700,"centralina:prog":1600,"centralina:gara":3400,"radiatore:serie":150,"radiatore:all2":550,"radiatore:all3":1200,"radiatore:gara":2600,"frizione:org":250,"frizione:rinf":600,"frizione:cer":1100,"frizione:bid":2600};
const OFF_PIS_LIV = [0, 0, 300, 900, 2400];
function offPistoneRimborso(game) {
  const v = game && game.s && game.s.vg, M = v && v.mot;
  if (!M) { if (game && game.s) delete game.s.vgMot; return 0; }
  let euro = 0;
  if (game.mode === 'career') {
    for (const e of M.list || []) euro += e.prezzo || 0;
    for (const p of M.pz || []) euro += OFF_PIS_PEZZI[p.cat + ':' + p.id] || 0;
    for (const k in M.liv || {}) for (let l = 2; l <= Math.min(4, M.liv[k] || 1); l++) euro += OFF_PIS_LIV[l];
  }
  delete v.mot; delete game.s.vgMot;
  if (euro) { game.s.money += euro; if (game.say) game.say(`Luca: «Nico ha chiuso il banco dei motori. Quello che ci avevi speso te lo ridiamo: € ${euro.toLocaleString('it-IT')}»`, 'money'); }
  return euro;
}
if (typeof StreetGame !== 'undefined') {                       // al primo passo della partita (anche caricata da un salvataggio)
  const up = StreetGame.prototype.update;
  StreetGame.prototype.update = function (dt) { if (!this._pisRim && this.s) { this._pisRim = true; offPistoneRimborso(this); } return up.call(this, dt); };
}

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
  r.kg = offKgSerie(id);
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
  TP.sim.dm = (TP.sim.dm || 0) + offKgSerie(dId) - offKgSerie(carId);              // il peso del motore in più (o in meno): lo somma game.applyMass
  TP.sim.boostK = D.sim.boostK !== undefined ? D.sim.boostK : 1;       // come il donatore (la Supra a piena efficienza, non quella dell'auto che ospita)
  // la frizione dell'auto è fatta per il suo motore: col motore di un altro il livello montato (serie, sport, corsa) vale quanto
  // quello stesso livello della frizione del donatore, mai meno di quello che l'auto aveva (senza, il motore scappa al limitatore)
  const hc = offCatalogOf(carId), dc = offCatalogOf(dId);
  if (hc && hc.clutch && dc && dc.clutch) {
    const i = Math.max(0, hc.clutch.items.findIndex((it) => it.id === (sel || {}).clutch));
    const d = dc.clutch.items[Math.min(i, dc.clutch.items.length - 1)];
    if (d && d.sim && d.sim.clutch > (TP.sim.clutchMax || 0)) TP.sim.clutchMax = d.sim.clutch;
  }
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

// Il carattere di un pezzo, scritto dai dati veri (niente stelline messe a mano). o = { lim, r, gears, gears0, fd }.
// Dà una frase corta («Pronto: risponde presto · entra tra 2.000 e 3.000 giri...») o '' se non c'è niente di più da dire oltre alla nota.
function offCarattere(k, it, o) {
  o = o || {}; it = it || {};
  const n = (x) => Math.round(x).toLocaleString('it-IT'), bar = (x) => x.toFixed(1).replace('.', ','), s = it.sim || {}, out = [];
  const giri130 = (gears, fd) => (gears && gears.length > 1 && o.r > 0 && fd > 0 ? Math.round(130 / 3.6 / o.r * gears[gears.length - 1] * fd * 60 / (2 * Math.PI)) : 0);
  if (k === 'turbo') {
    const T = s.turbo;
    if (!T) out.push(it.brand && it.brand !== '—' ? 'Turbo di serie: la sua spinta è già nella curva' : 'Aspirato: spinta lineare, nessun ritardo');
    else {
      const x = o.lim ? T.a / o.lim : 0.4;
      out.push(x < 0.34 ? 'Pronto: risponde presto, ripresa facile' : x < 0.46 ? 'Stradale: spinta ampia, compromesso fra risposta e allungo' : 'Allungo: sale più tardi e spinge forte in alto',
        `entra tra ${n(T.a)} e ${n(T.b)} giri`, `fino a ${bar(T.max)} bar`);
      if (o.used > 0 && o.used < T.max - 0.04) out.push(`con la centralina e la benzina che hai ne usi solo ${bar(o.used)}: servono quelle più grosse`);
    }
  } else if (k === 'final' || k === 'gearbox') {
    const gears = k === 'gearbox' ? (s.gears || o.gears0 || o.gears) : o.gears, fd = k === 'final' && s.fd ? s.fd : o.fd, ora = giri130(o.gears, o.fd), poi = giri130(gears, fd);
    if (poi) out.push(`A 130 km/h: ${n(poi)} giri in ${gears.length - 1}ª` + (ora && ora !== poi ? ` (adesso ${n(ora)})` : ''));
  } else if (k === 'weight') {
    const dm = s.dm || 0;
    out.push(dm < 0 ? `${n(-dm)} kg in meno` : 'Peso di serie');
  }
  return out.join(' · ');
}

if (typeof window !== 'undefined') Object.assign(window, { OFF, OFF_GRUPPI, offCarattere, OFF_MOTORE, offMerge, offEstimate, offSwapPrice, offSwapKm, offSwapOf, offPreview, offSwapApply, offCatalog, offSwapDo, offEngineName, offKgSerie, offPistoneRimborso });

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
.of-lv { display: flex; align-items: center; gap: 5px; }
.of-dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; flex: none; box-shadow: 0 0 0 2px #0006; }
.of-dot.on { background: #2fd16a; box-shadow: 0 0 0 2px #0006, 0 0 6px #2fd16acc; } .of-dot.own { background: #77736b; } .of-dot.off { background: #ff453a; }
.of-chip.cur .of-dot { box-shadow: 0 0 0 2px #1a1206; }
.of-chip.buy small { color: #ffd27a; } .of-chip.lock small { color: #ff8a7a; }
.of-chip small { font-weight: 500; color: #a9a396; margin-top: 2px; }
.of-chip.cur { background: #ffb347; border-color: #ffb347; color: #1a1206; } .of-chip.cur small { color: #3a2a0a; }
.of-chip.own { border-color: #8fe0a0; } .of-chip.own small { color: #8fe0a0; }
.of-chip.lock { opacity: .55; cursor: not-allowed; } .of-chip.poor { border-color: #7a3a3a; } .of-chip.poor small { color: #ff8a7a; }
.of-info { margin-top: 8px; padding: 8px 10px; background: #0f0d15; border-radius: 8px; color: #cfc8b8; font-size: 12.5px; }
.of-info p { margin: 3px 0; } .of-info b { color: #ffd27a; }
.of-chip.sel { outline: 2px solid #38bdf8; outline-offset: 1px; }
.of-lv { max-width: 150px; white-space: normal; line-height: 1.2; }
.of-card { margin-top: 8px; padding: 9px 11px; background: #0f1a22; border: 1px solid #38bdf8; border-radius: 10px; font-size: 13px; }
.of-card b.ttl { display: block; color: #ffd27a; font-size: 14px; } .of-card p { margin: 4px 0; color: #cfc8b8; }
.of-card .car { color: #8fd8ff; }
.of-dl { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0; } .of-dl span { padding: 3px 8px; border-radius: 7px; background: #1b1826; font: 700 12px/1.2 ui-monospace, monospace; color: #a9a396; } .of-dl .su { color: #8fe0a0; } .of-dl .giu { color: #ff8a7a; }
.of-card .of-go { width: 100%; margin-top: 6px; padding: 10px 12px; font-size: 13px; }
.of-sbtn { display: flex; gap: 6px; margin-top: 2px; } .of-sbtn button { padding: 5px 10px; border: 1px solid #4a4458; border-radius: 8px; background: #17141f; color: #b8b0a0; font: 600 12px/1 var(--f-data, sans-serif); cursor: pointer; }
.of-hint { color: #9a9486; font-size: 12.5px; margin: 6px 2px; }
.of-cur { margin: 8px 0; padding: 8px 10px; border: 1px solid #38bdf8; border-radius: 10px; background: #0f1a22; font-size: 13px; }
.of-swaps { max-height: 360px; overflow: auto; padding-right: 2px; }
.of-susp { display: grid; gap: 6px; padding: 6px 2px 2px; } .of-susp.off { opacity: .45; }
.of-sr { display: grid; grid-template-columns: 70px 1fr; gap: 2px 10px; align-items: center; }
.of-sr span { font: 400 11px/1 var(--f-data, monospace); letter-spacing: .1em; text-transform: uppercase; color: #9a9486; }
.of-sr b { font: 600 13px/1 var(--f-body, sans-serif); color: #ffb347; text-align: right; grid-column: 2; grid-row: 1; }
.of-sr input { grid-column: 1 / -1; width: 100%; accent-color: #ffb347; }
.of-sw { display: grid; grid-template-columns: 1fr auto auto; gap: 8px; align-items: center; }
.of-sw .nm b { display: block; font-size: 14px; } .of-sw .nm small { color: #9a9486; font-size: 12px; }
.of-sw .st { color: #ffd27a; font: 700 12px/1.2 var(--f-data, monospace); text-align: right; white-space: nowrap; }
.of-go { padding: 7px 12px; border: 1px solid #ffb347; border-radius: 8px; background: #ffb347; color: #1a1206; font: 700 12px/1 var(--f-data, monospace); cursor: pointer; }
.of-go:disabled { background: #2a2636; color: #8a8478; border-color: #4a4458; cursor: not-allowed; }
.of-fk { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 8px; margin: 8px 0; }
.of-fkc { display: flex; flex-direction: column; gap: 5px; padding: 8px; background: #1b1826; border: 1px solid #332e40; border-radius: 10px; }
.of-fkc.cur { border-color: #2fd16a; box-shadow: 0 0 0 1px #2fd16a55 inset; }
.of-fkc canvas { width: 100%; aspect-ratio: 200 / 64; border-radius: 7px; background: #07060c; image-rendering: pixelated; display: block; }
.of-fkc b { font-size: 14px; display: flex; align-items: center; gap: 6px; } .of-fkc b small { margin-left: auto; font: 700 12px/1 ui-monospace, monospace; color: #ffd27a; }
.of-fkc p { margin: 0; color: #b8b0a0; font-size: 12px; line-height: 1.35; flex: 1; }
@media (max-width: 520px) { .of-sum { grid-template-columns: repeat(2, 1fr); } }`;
  let tab = 'mod', grp = 'motore', open = {}, pick = null;   // pick = il pezzo toccato: si guarda prima, si compra dopo

  function panel(body, I, ctx) {
    if (!document.getElementById('ofCss')) { const st = document.createElement('style'); st.id = 'ofCss'; st.textContent = css; document.head.appendChild(st); }
    const box = document.createElement('div'); box.className = 'of'; body.appendChild(box);
    const render = () => draw(box, ctx);
    box.addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab]'); if (t) { tab = t.dataset.tab; render(); return; }
      const g = e.target.closest('[data-grp]'); if (g) { grp = g.dataset.grp; render(); return; }
      const i = e.target.closest('[data-i]'); if (i) { open[i.dataset.i] = !open[i.dataset.i]; render(); return; }
      const cp = e.target.closest('[data-cmp], [data-cmp-play], [data-cmp-i], [data-cmp-buy], [data-cmp-x], [data-cmp-v1]');            // scheda Suoni (campioni.js)
      if (cp && window.NightCampioni) { if (NightCampioni.click(cp, ctx)) render(); return; }
      const fk = e.target.closest('[data-fk]');
      if (fk) {                                                    // scheda Fiamme: compra (una volta) e monta il kit su quest'auto
        const r = fiammeMonta(ctx.game.s, ctx.game.car, fk.dataset.fk, ctx.game.mode !== 'career');
        if (!r.ok) { ctx.flash(r.why, 2.6); return; }
        ctx.save && ctx.save(); ctx.after && ctx.after();
        const k = FIAMME_KIT.find((q) => q.id === fk.dataset.fk);
        ctx.flash(k.id === 'serie' ? 'Fiamme come vengono: le decide la preparazione' : 'Fiamme montate: ' + k.nome + (r.spesa ? ` · € ${fmt(r.spesa)}` : ''), 2.2); render(); return;
      }
      const go = e.target.closest('[data-go]');
      if (go) {                                                    // pulsante della scheda: monta (e, se serve, compra)
        const k = go.dataset.go, id = go.dataset.id;
        ctx.mount(k, id);
        if (ctx.S.tune[k] === id) pick = null;                      // montato: la scheda si chiude (se non si è potuto, resta aperta col motivo)
        ctx.after && ctx.after(); render(); return;
      }
      const sres = e.target.closest('[data-sres]');
      if (sres && ctx.setAdj && ctx.adj) {                         // assetto: «Come di serie» o «Consigliato» dal kit
        const st = suspState(tuningItem('suspension', ctx.S.tune.suspension), ctx.adj());
        ctx.setAdj(sres.dataset.sres === 'serie' ? { h: 0, k: 1 } : { h: st.h0, k: st.k0 }, () => render()); ctx.after && ctx.after(); render(); return;
      }
      const gres = e.target.closest('[data-gbres]');
      if (gres && ctx.setAdj && ctx.adj) {                         // cambio: come di serie (×1) o i rapporti consigliati del pezzo
        const st = gbState(tuningItem('gearbox', ctx.S.tune.gearbox), ctx.adj()); if (!st) return;
        const serie = gres.dataset.gbres === 'serie';
        ctx.setAdj(st.mode === 'all' ? { gk: serie ? 1 : st.k0 } : { gr: serie ? st.mul.map(() => 1) : st.m0.slice() }, () => render()); ctx.after && ctx.after(); render(); return;
      }
      const c = e.target.closest('[data-k]');
      if (c) { pick = pick && pick.k === c.dataset.k && pick.id === c.dataset.id ? null : { k: c.dataset.k, id: c.dataset.id }; render(); return; }   // toccare un pezzo lo mostra, non spende niente
      const s = e.target.closest('[data-swap]');
      if (s) {
        const r = offSwapDo(ctx.game, ctx.S, ctx.game.car, s.dataset.swap === '-' ? null : s.dataset.swap);
        if (!r.ok) { ctx.flash(r.why, 2.6); return; }
        ctx.apply(); ctx.save(); ctx.after && ctx.after();
        ctx.flash(s.dataset.swap === '-' ? 'Motore di serie rimontato' : 'Motore montato: ' + offEngineName(s.dataset.swap), 2); render();
      }
    });
    // cursori dell'assetto: l'etichetta si muove mentre trascini, il valore si applica al rilascio
    box.addEventListener('input', (e) => {
      if (e.target.closest('[data-cmp-vol]') && window.NightCampioni) { NightCampioni.input(e.target); return; }   // volume dei campioni
      const gr = e.target.closest('[data-gb]');
      if (gr && ctx.adj) {                                         // cambio: rapporti e velocità massima si aggiornano mentre trascini
        const it = tuningItem('gearbox', ctx.S.tune.gearbox), st = gbState(it, ctx.adj()); if (!st) return;
        const a = Object.assign({}, ctx.adj() || {}, gbAdjDa(box, st)), s2 = gbState(it, a), gears = gbGears(it, a);
        if (s2.mode === 'all') box.querySelector('#ofGbK').textContent = gbKLab(s2.k);
        else s2.mul.forEach((m, i) => { const b = i && box.querySelector('#ofGb' + i); if (b) b.textContent = `${gbF(gears[i])} · ×${gbF(m)}`; });
        box.querySelector('#ofGbL').textContent = gbRiga(ctx, gears); return;
      }
      const r = e.target.closest('[data-susp]'); if (!r || !ctx.adj) return;
      const st = suspState(tuningItem('suspension', ctx.S.tune.suspension), ctx.adj()), h = box.querySelector('[data-susp="h"]'), k = box.querySelector('[data-susp="k"]');
      const L = suspLab(st, +h.value, +k.value); box.querySelector('#ofSuspHv').textContent = L.h; box.querySelector('#ofSuspKv').textContent = L.k;
    });
    box.addEventListener('change', (e) => {
      const gr = e.target.closest('[data-gb]');
      if (gr && ctx.setAdj && ctx.adj) {
        const st = gbState(tuningItem('gearbox', ctx.S.tune.gearbox), ctx.adj()); if (!st) return;
        ctx.setAdj(gbAdjDa(box, st), () => render()); ctx.after && ctx.after(); render(); return;
      }
      const r = e.target.closest('[data-susp]'); if (!r || !ctx.setAdj) return;
      ctx.setAdj(r.dataset.susp === 'h' ? { h: +r.value } : { k: +r.value }, () => render()); ctx.after && ctx.after(); render();
    });
    // anteprima (v0.160): CV, Nm, kg/CV e 400 m stanno sullo schermo del banco nella scena (interni_hd.js), non più qui.
    // Passando sopra un livello (o toccandolo) lo schermo mostra cosa cambierebbe: +2 CV in verde, −0,1 s... (non compra niente)
    let pv = null;
    const pickD = () => (pick ? offPreview(ctx.game, ctx.S.tune, pick.k, pick.id) : null);
    const pvOff = () => { clearTimeout(pv); NightOfficina.anteprima = pickD(); };
    box.addEventListener('mouseover', (e) => {
      const c = e.target.closest('[data-k]'); if (!c) return pvOff();
      if (c.classList.contains('cur')) return pvOff();
      clearTimeout(pv);
      pv = setTimeout(() => { NightOfficina.anteprima = offPreview(ctx.game, ctx.S.tune, c.dataset.k, c.dataset.id); }, 90);
    });
    box.addEventListener('mouseleave', pvOff);
    box.addEventListener('click', () => { clearTimeout(pv); setTimeout(() => { NightOfficina.anteprima = pickD(); }, 0); }, true);
    render();
    return box;
  }

  // d = anteprima di un pezzo (offPreview): sotto ogni numero la differenza, verde se migliora e rossa se peggiora
  function summary(ctx, d) {
    const sim = ctx.sim, g = ctx.game, est = sim.estimatePeak(), et = g.etEstimate(), kgcv = (sim.P.mass + 75) / est.cv;
    const dl = (v, dec, unit, buonoSeNeg) => { if (!d || Math.abs(v) < Math.pow(10, -dec) / 2) return d ? '<i class="of-d">=</i>' : '<i class="of-d" style="visibility:hidden">=</i>'; const ok = buonoSeNeg ? v < 0 : v > 0; return `<i class="of-d ${ok ? 'su' : 'giu'}">${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(dec).replace('.', ',')}${unit}</i>`; };
    const kgcv2 = d ? (sim.P.mass + 75) / Math.max(10, est.cv + d.dcv) - kgcv : 0;
    return `<div class="of-sum"><div><b>${fmt(Math.round(est.cv / 5) * 5)}</b><small>CV a ${fmt(est.rpmCv)}</small>${d ? dl(d.dcv, Math.abs(d.dcv) < 5 ? 1 : 0, ' CV', false) : dl()}</div><div><b>${fmt(Math.round(est.nm / 5) * 5)}</b><small>Nm</small>${d ? dl(d.dnm, Math.abs(d.dnm) < 5 ? 1 : 0, ' Nm', false) : dl()}</div>`
      + `<div><b>${kgcv.toFixed(1).replace('.', ',')}</b><small>kg per CV</small>${d ? dl(kgcv2, 2, '', true) : dl()}</div><div><b>${et.toFixed(1).replace('.', ',')} s</b><small>400 m stimati</small>${d ? dl(d.det, 2, ' s', true) : dl()}</div></div>`;
  }

  function draw(box, ctx) {
    const g = ctx.game, carId = g.car, career = g.mode === 'career', money = g.s.money, dId = offSwapOf(g, carId);
    let h = '';                                                   // CV, Nm, kg/CV e 400 m: sullo schermo del banco a sinistra (v0.160)
    const sch = typeof schedaTesto === 'function' ? schedaTesto(dId || carId) : '';   // scheda tecnica del motore montato (schede.js)
    if (sch) h += `<p class="of-sch" style="margin:6px 2px 2px;font-size:11px;color:#8a8478;line-height:1.35">${E(sch)}</p>`;
    { const est = ctx.sim.estimatePeak(), cl = ctx.sim.P.clutchMax;      // frizione più debole del motore: slitta e il motore sale al limitatore senza spingere
      if (est.nm > cl * 0.97) h += `<p class="of-warn" style="margin:6px 2px 2px;padding:6px 8px;border:1px solid #ff453a;border-radius:8px;color:#ffb3ad;font-size:12px;line-height:1.35">⚠ La frizione regge ${fmt(Math.round(cl))} Nm e il motore ne fa ${fmt(Math.round(est.nm / 5) * 5)}: slitta e i giri vanno al limitatore senza spingere. Vai in <b>Trasmissione</b> e monta una frizione più forte.</p>`; }
    const suoni = !!window.NightCampioni;                                            // campioni audio dei pezzi (campioni.js)
    if (tab === 'suoni' && !suoni) tab = 'mod';
    const fiamme = typeof FIAMME_KIT !== 'undefined';                                // kit delle fiamme (fiamme.js)
    if (tab === 'fiamme' && !fiamme) tab = 'mod';
    h += `<div class="of-tabs" role="tablist"><button type="button" role="tab" data-tab="mod" aria-selected="${tab === 'mod'}">Modifiche</button><button type="button" role="tab" data-tab="swap" aria-selected="${tab === 'swap'}">Swap motore${dId ? ' ✓' : ''}</button>`
      + (suoni ? `<button type="button" role="tab" data-tab="suoni" aria-selected="${tab === 'suoni'}">Suoni</button>` : '')
      + (fiamme ? `<button type="button" role="tab" data-tab="fiamme" aria-selected="${tab === 'fiamme'}">Fiamme${fiammeKit(g.s, carId) ? ' ✓' : ''}</button>` : '') + '</div>';
    h += tab === 'mod' ? drawMod(ctx, career, money) : tab === 'suoni' ? NightCampioni.html(ctx) : tab === 'fiamme' ? drawFiamme(ctx, carId, career, money) : drawSwap(ctx, carId, dId, career, money);
    box.innerHTML = h;
    if (tab === 'fiamme') fiammeAnima(box);
  }

  // ---------------------------------------------------------------- scheda Fiamme (kit di fiamme.js, v0.143)
  function drawFiamme(ctx, carId, career, money) {
    const f = ctx.game.s.fiamme || {}, own = f.own || {}, cur = (fiammeKit(ctx.game.s, carId) || { id: 'serie' }).id;
    let h = '<p class="of-hint">Il kit decide <b>che fiamme escono dallo scarico</b>: al rilascio del gas e al limitatore, <b>su qualunque auto</b>, anche di serie. Lo compri una volta e lo rimonti gratis su ogni auto. Con la valvola dello scarico in silenzio non esce niente.</p><div class="of-fk">';
    for (const k of FIAMME_KIT) {
      const mont = k.id === cur, mio = !k.prezzo || own[k.id], poor = career && !mio && k.prezzo > money;
      const stato = mont ? 'MONTATO' : mio ? (k.prezzo ? 'TUO' : 'GRATIS') : `€ ${fmt(k.prezzo)}`;
      const label = mont ? 'Montato' : mio ? 'Monta' : poor ? `Mancano € ${fmt(k.prezzo - money)}` : `Compra e monta · € ${fmt(k.prezzo)}`;
      h += `<div class="of-fkc${mont ? ' cur' : ''}"><canvas width="400" height="128" data-fkp="${k.id}" aria-hidden="true"></canvas>`
        + `<b><span class="of-dot ${mont ? 'on' : mio ? 'own' : 'off'}"></span>${E(k.nome)}<small>${stato}</small></b><p>${E(k.testo)}</p>`
        + `<button type="button" class="of-go" data-fk="${k.id}"${mont || poor ? ' disabled' : ''}>${label}</button></div>`;
    }
    return h + '</div>';
  }
  // l'anteprima: lo stesso disegno della strada (fxFlameV, fxTorch, fxBang di effetti2d.js) dietro un paraurti, a raffiche
  // come un rilascio sopra i 5.000 giri e poi il limitatore, finché la scheda è aperta
  function fiammeAnima(box) {
    if (typeof Street2D === 'undefined' || !Street2D.prototype.fxFlameV) return;
    const tele = [...box.querySelectorAll('canvas[data-fkp]')]; if (!tele.length) return;
    const V = Object.create(Street2D.prototype); V.st = { t: 0 }; V.SS = 2;
    const st = tele.map((c, i) => ({ c, g: c.getContext('2d'), kit: FIAMME_KIT.find((q) => q.id === c.dataset.fkp), flame: 0, torchT: 0, bangT: 0, fv: 0, pal: 'arancio', ph: i * 0.37 }));
    const rx = 64, exY = 19, y0 = 26, k = 1;                          // scena di 100×32 unità, ingrandita ×4
    const spawn = (s, kind) => {
      const kit = s.kit && s.kit.w ? s.kit : null, r = Math.random, style = kit ? fiammeScegli(kit, 1, kind, r()) : flameStyle(1, kind, 0.6, r());
      if (style === 'torch' || (style === 'big' && kit && kit.id === 'ossidrica')) { s.torchT = 0.07 + r() * 0.09; s.torchF = 0.8 + r() * 0.7; if (style === 'torch') return; }
      if (style === 'bang') { s.bangT = 0.24; return; }
      const big = style === 'big' || r() < 0.45;
      s.flame = big ? 1.1 + r() * 0.4 : 0.6 + r() * 0.4; s.fv = kit && kit.len ? 4 : (r() * 4) | 0;
      s.pal = (kit && fiammePal(kit, r())) || flamePalFor(1, r());
    };
    let last = performance.now();
    const passo = (now) => {
      if (!box.isConnected || tab !== 'fiamme' || !tele[0].isConnected) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now; V.st.t += dt;
      for (const s of st) {
        const g = s.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
        g.fillStyle = '#07060c'; g.fillRect(0, 0, 400, 128); g.setTransform(4, 0, 0, 4, 0, 0);
        g.fillStyle = '#15131d'; g.fillRect(0, y0, 100, 6); g.fillStyle = '#2a2633'; g.fillRect(0, y0, 100, 0.5);      // asfalto
        g.fillStyle = '#1d2230'; g.fillRect(rx + 3, 2, 40, 19); g.fillStyle = '#2c3446'; g.fillRect(rx + 3, 2, 40, 1.5);  // il retro dell'auto
        g.fillStyle = '#b0141c'; g.fillRect(rx + 4, 7, 4, 3); g.fillStyle = '#0c0c10'; g.fillRect(rx + 3, 20, 40, 4);     // fanale e paraurti
        g.fillStyle = '#1a1a1e'; g.beginPath(); g.arc(rx + 30, 24.5, 3.5, Math.PI, 0); g.fill();                          // la ruota che si vede
        g.fillStyle = '#5a5e68'; g.fillRect(rx - 1, exY - 1, 6, 2); g.fillStyle = '#16161a'; g.fillRect(rx - 1, exY - 0.5, 0.5, 1);   // terminale
        // ciclo di 2,6 s: raffica da rilascio, poi limitatore, poi pausa
        const t = (V.st.t + s.ph) % 2.6, kind = t < 1 ? 'liftHigh' : 'limiter', rate = (s.kit && s.kit.rate) || 1;
        if (t < 1.8 && Math.random() < dt * 9 * rate) spawn(s, kind);
        s.flame = Math.max(0, s.flame - dt * 8); s.torchT = Math.max(0, s.torchT - dt); s.bangT = Math.max(0, s.bangT - dt);
        if (s.torchT > 0) V.fxTorch(g, rx, exY, k, s.torchF, y0);
        if (s.bangT > 0) V.fxBang(g, rx, exY, k, 1 - s.bangT / 0.24, y0);
        if (s.flame > 0.05) V.fxFlameV(g, rx, exY, k, s.flame, y0, s.pal, s.fv);
      }
      requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
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
        const st = isCur ? 'montato' : owned ? 'MONTA' : lock ? `🔒 ${fmt(g.partKm(k, it.id))} km` : `COMPRA € ${fmt(price)}`;
        const buy = !isCur && !owned && !lock, sel = pick && pick.k === k && pick.id === it.id, cls = ['of-chip', sel ? 'sel' : '', isCur ? 'cur' : '', !isCur && owned ? 'own' : '', lock ? 'lock' : '', buy ? 'buy' : '', buy && career && price > money ? 'poor' : ''].filter(Boolean).join(' ');   // pallino verde = montato, grigio = tuo ma smontato, rosso = da comprare o bloccato
        return `<button type="button" class="${cls}" data-k="${k}" data-id="${E(it.id)}" title="${E((it.brand || '') + ' ' + it.name)}" ${lock ? 'aria-disabled="true"' : ''}><span class="of-lv"><i class="of-dot ${isCur ? 'on' : owned ? 'own' : 'off'}"></i>${E(shortName(it, i))}</span><small>${E(st)}</small></button>`;
      }).join('');
      const c = cat.items[ci];
      let info = '';
      if (open[k]) info = '<div class="of-info">' + cat.items.map((it, i) => `<p><b>${i === 0 ? 'Serie' : 'Liv. ' + i}${i === ci ? ' · montato' : ''}</b> · ${E(it.brand && !['Su misura', '—', 'Integrata'].includes(it.brand) ? it.brand + ' ' : '')}${E(it.name)} — ${E(it.note || '')}</p>`).join('') + '</div>';
      const pi = pick && pick.k === k ? cat.items.findIndex((x) => x.id === pick.id) : -1;
      const card = pi >= 0 ? pezzoCard(ctx, k, cat.items[pi], pi, ci, career, money) : '';
      h += `<div class="of-row${ci > 0 ? ' mod' : ''}"><div class="of-head">${typeof compHTML === 'function' ? compHTML(k, c.id, 'comp-mini') : ''}<span><b>${E(cat.label)}</b><em>${E(c.name || '')}</em></span><button type="button" class="of-i" data-i="${k}" aria-expanded="${!!open[k]}" aria-label="Cosa fa" title="Cosa fa">i</button></div><div class="of-chips">${chips}</div>${card}${info}</div>`;
      if (k === 'suspension' && typeof suspState === 'function' && ctx.adj) h += suspBlock(ctx, c);
      if (k === 'gearbox' && typeof gbState === 'function' && ctx.adj && c.gb) h += gbBlock(ctx, c);
    }
    return h + '<p class="of-hint"><b>Tocca un pezzo</b> per vedere cosa cambia: non spendi niente finché non premi il pulsante. <b style="color:#2fd16a">●</b> verde: montato. <b style="color:#77736b">●</b> grigio: è tuo, lo rimonti gratis. <b style="color:#ff453a">●</b> rosso: non ce l\'hai (da comprare, col lucchetto servono ancora chilometri). Quello che compri resta tuo.</p>';
  }

  // nome corto per la scelta: «Filtro a fungo» invece di «LIV. 1» (il nome completo sta nella scheda e nel suggerimento)
  function shortName(it, i) {
    if (i === 0) return 'Serie';
    const n = String(it.name || '').replace(/\s*\(.*?\)\s*/g, ' ').trim();
    return n.length > 30 ? n.slice(0, 29).trim() + '…' : n;
  }
  // la scheda del pezzo toccato: cosa fa, che carattere ha, cosa cambia (calcolato sulla tua auto) e UN pulsante che dice cosa succede
  function pezzoCard(ctx, k, it, i, ci, career, money) {
    const g = ctx.game, isCur = i === ci, owned = g.owns(k, it.id), lock = g.partLocked(k, it.id), price = g.price(k, it.id), sim = ctx.sim, P = sim.P;
    let used = 0;                                                  // turbo: la pressione che lasciano davvero centralina e benzina montate
    if (k === 'turbo' && !offSwapOf(g, g.car) && typeof tuningParams === 'function') try { used = tuningParams(Object.assign({}, ctx.S.tune, { turbo: it.id }), ctx.adj && ctx.adj()).sim.turbo.max; } catch (err) { used = 0; }
    const car = offCarattere(k, it, { lim: P.limiter, r: P.r, gears: P.gears, gears0: typeof CARS !== 'undefined' && CARS[g.car] && CARS[g.car].P ? CARS[g.car].P.gears : null, fd: P.fd, used });
    let dl = '', solo = '';
    if (!isCur) {
      const d = offPreview(g, ctx.S.tune, k, it.id);
      if (d) {
        const f = (v, dec, u, buonoSeNeg) => { if (Math.abs(v) < Math.pow(10, -dec) / 2) return `<span>${u.trim()} =</span>`; const ok = buonoSeNeg ? v < 0 : v > 0; return `<span class="${ok ? 'su' : 'giu'}">${v > 0 ? '+' : '−'}${Math.abs(v).toFixed(dec).replace('.', ',')}${u}</span>`; };
        dl = `<div class="of-dl">${f(d.dcv, Math.abs(d.dcv) < 5 ? 1 : 0, ' CV', false)}${f(d.dnm, Math.abs(d.dnm) < 5 ? 1 : 0, ' Nm', false)}${f(d.det, 2, ' s sui 400 m', true)}</div>`;
        if (['exhaust', 'cat', 'bov'].includes(k) && Math.abs(d.dcv) < 0.05 && Math.abs(d.dnm) < 0.05) solo = '<p class="car">Suono diverso · potenza invariata</p>';
      }
    }
    const brand = it.brand && !['Su misura', '—', 'Integrata'].includes(it.brand) ? it.brand + ' ' : '';
    let label, dis = false;
    if (isCur) { label = 'Montato adesso'; dis = true; }
    else if (owned) label = 'Monta';
    else if (lock) { label = `Si sblocca a ${fmt(g.partKm(k, it.id))} km`; dis = true; }
    else if (career && price > money) { label = `Mancano € ${fmt(price - money)}`; dis = true; }
    else label = `Compra e monta · € ${fmt(price)}`;
    return `<div class="of-card">${typeof compHTML === 'function' ? compHTML(k, it.id) : ''}<b class="ttl">${E(brand + (it.name || ''))}</b>${car ? `<p class="car">${E(car)}</p>` : ''}${it.note ? `<p>${E(it.note)}</p>` : ''}${solo}${dl}<button type="button" class="of-go" data-go="${k}" data-id="${E(it.id)}" ${dis ? 'disabled' : ''}>${E(label)}</button></div>`;
  }

  // altezza da terra e rigidità delle molle (assetto a livelli, tuning.js): gratis, da fermi e da Luca; il livello 0 non si regola
  function suspLab(st, h, k) {
    return { h: !st.adjustable ? 'fissa' : h === 0 ? 'come di serie' : (h > 0 ? '+' : '−') + Math.abs(h) + ' mm', k: !st.adjustable ? 'di serie' : Math.round(k * 100) + ' %' + (k <= 0.75 ? ' · mollissima' : k >= 3 ? ' · durissima' : '') };
  }
  function suspBlock(ctx, item) {
    const st = suspState(item, ctx.adj()), L = suspLab(st, st.h, st.k);
    return `<div class="of-susp${st.adjustable ? '' : ' off'}"><div class="of-sr"><span>Altezza</span><b id="ofSuspHv">${E(L.h)}</b><input type="range" data-susp="h" min="${st.hMin}" max="${st.hMax}" step="5" value="${st.h}" ${st.adjustable ? '' : 'disabled'} aria-label="Altezza da terra"></div>`
      + `<div class="of-sr"><span>Rigidità</span><b id="ofSuspKv">${E(L.k)}</b><input type="range" data-susp="k" min="${st.kMin}" max="${st.kMax}" step="0.1" value="${st.k}" ${st.adjustable ? '' : 'disabled'} aria-label="Rigidità delle molle"></div>`
      + (st.adjustable ? '<div class="of-sbtn"><button type="button" data-sres="serie">Come di serie</button><button type="button" data-sres="kit">Consigliato dal kit</button></div>' : '') + '</div>';
  }

  // cambio sport (un rapporto per tutte le marce) e da corsa (marcia per marcia): gratis, da fermi e da Luca come l'assetto
  const gbF = (v, d = 2) => v.toFixed(d).replace('.', ',');
  function gbRiga(ctx, gears) {
    const P = ctx.sim.P, n = gears.length - 1, v = P.limiter / 60 * 2 * Math.PI * P.r / (gears[n] * P.fd) * 3.6;
    return gears.slice(1).map((x, i) => `${i + 1}ª ${gbF(x)}`).join(' · ') + ` — in ${n}ª al limitatore ${fmt(v)} km/h`;
  }
  function gbKLab(k) { return '×' + gbF(k) + (k > 1.005 ? ' · più corte' : k < 0.995 ? ' · più lunghe' : ' · come di serie'); }
  function gbBlock(ctx, item) {
    const st = gbState(item, ctx.adj()), gears = gbGears(item, ctx.adj());
    let h = '<div class="of-susp">';
    if (st.mode === 'all') h += `<div class="of-sr"><span>Rapporto</span><b id="ofGbK">${E(gbKLab(st.k))}</b><input type="range" data-gb="k" min="${st.min}" max="${st.max}" step="0.01" value="${st.k}" aria-label="Rapporto di tutte le marce"></div>`;
    else h += st.mul.slice(1).map((m, i) => `<div class="of-sr"><span>${i + 1}ª marcia</span><b id="ofGb${i + 1}">${gbF(gears[i + 1])} · ×${gbF(m)}</b><input type="range" data-gb="${i + 1}" min="${st.min}" max="${st.max}" step="0.01" value="${m}" aria-label="Rapporto della ${i + 1}ª"></div>`).join('');
    return h + `<p class="of-hint" id="ofGbL" style="margin:2px">${E(gbRiga(ctx, gears))}</p><div class="of-sbtn"><button type="button" data-gbres="serie">Come di serie</button><button type="button" data-gbres="kit">Consigliato da Luca</button></div></div>`;
  }
  // la regolazione che darebbero i cursori adesso (mentre trascini)
  function gbAdjDa(box, st) {
    if (st.mode === 'all') return { gk: +box.querySelector('[data-gb="k"]').value };
    return { gr: st.mul.map((m, i) => { const r = box.querySelector(`[data-gb="${i}"]`); return i && r ? +r.value : m; }) };
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
        + (open['sw:' + id] ? `<div class="of-info"><p>${orig ? 'Rimonta il motore originale: i pezzi del motore tornano quelli di questa auto.' : `Monti il motore della ${E(CARS[id].name)} sulla tua auto: curva di coppia, giri, turbo, voce e peso del motore cambiano; cambio, differenziale, gomme e assetto restano quelli dell'auto; la frizione tiene la coppia del motore nuovo (stesso livello: serie, sport o corsa). I pezzi del motore diventano quelli di questo motore (di serie all'inizio).`}</p></div>` : '') + '</div>';
    };
    const cur = dId ? `<div class="of-cur">Motore montato: <b>${E(offEngineName(dId))}</b> (dalla ${E(CARS[dId].short || CARS[dId].name)}).</div>` : '';
    return cur + '<p class="of-hint">Metti sulla tua auto il motore di un\'altra auto del gioco. Il prezzo comprende la manodopera. Fino a 200 CV si monta subito, i più forti si sbloccano coi chilometri. Una volta pagato un motore, rimontarlo è gratis.</p>'
      + '<div class="of-swaps">' + row(carId, true) + list.map((id) => row(id, false)).join('') + '</div>';
  }

  window.NightOfficina = { panel, OFF_GRUPPI, anteprima: null };
})();
