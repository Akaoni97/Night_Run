// ============================================================================
//  Night Run · I motori costruiti a pezzi (dopo cars.js e viaggio.js; la grafica è in motori2d.js)
//  Al locale nuovo «Il Pistone» (tappa del Viaggio al posto del secondo bar di ogni giro, VG_PATTERN[4]) ti costruisci
//  un motore: scegli un pezzo per reparto (MOT_PARTI, nell'ordine in cui si montano, dal basso in alto), lo paghi,
//  lo monti a mano sul cavalletto (scena in motori2d.js) e diventa un motore tuo (game.s.vg.mot.list). Poi lo monti
//  su qualsiasi auto (swap libero): curva di coppia, giri, cilindri, turbo, voce del motore e peso dell'auto vengono
//  dal motore (motApply, chiamata da applySettings in index.html). Lo smonti e l'auto torna col suo motore di serie.
//  Il calcolo (motCalc) è puro: CV e Nm stimati, limitatore, peso, affidabilità. Se chiedi più di quanto reggono
//  blocco, albero, bielle e pistoni (o un turbo grosso su pistoni ad alta compressione), l'affidabilità scende: tirando
//  il motore al limitatore a gas pieno, a lungo andare si rompe (non riparte finché non lo ricostruisci al Pistone).
//  Prezzi e numeri in MOT, pezzi in MOT_PARTI. Test in test/motori-costruiti.test.js.
// ============================================================================
const MOT = {
  lavoro: 450,          // montare o smontare un motore su un'auto (manodopera)
  revisione: 0.35,      // rifare un motore rotto: frazione del prezzo dei pezzi
  maxMotori: 4,         // motori che si tengono in magazzino
  vendita: 0.55,        // rivendere un motore: frazione del prezzo dei pezzi (meno l'usura)
};

// i reparti nell'ordine di montaggio; ogni pezzo: id, nome, prezzo, nota, kg e i suoi effetti
const MOT_PARTI = [
  { id: 'blocco', label: 'Blocco', items: [
    { id: 'b4_16', name: '4 cilindri 1.6 in alluminio', price: 900, kg: 95, cyl: 4, disp: 1.6, reg: 70, note: 'Leggero e piccolo: sale di giri volentieri, regge poco.' },
    { id: 'b4_20', name: '4 cilindri 2.0 in ghisa', price: 1400, kg: 135, cyl: 4, disp: 2.0, reg: 110, note: 'Pesante ma indistruttibile: la base classica per il turbo.' },
    { id: 'b5_23', name: '5 cilindri 2.3 in alluminio', price: 2600, kg: 150, cyl: 5, disp: 2.3, reg: 85, note: 'Cinque cilindri: uno scoppio ogni 144°, la voce rauca e storta.' },
    { id: 'b6_25', name: '6 cilindri 2.5 in alluminio', price: 3200, kg: 165, cyl: 6, disp: 2.5, reg: 75, note: 'Sei in linea: liscio come la seta, urla in alto.' },
    { id: 'b6_30', name: '6 cilindri 3.0 in ghisa', price: 4800, kg: 215, cyl: 6, disp: 3.0, reg: 120, note: 'Il blocco da 1000 cavalli: pesa, ma non si rompe mai.' } ] },
  { id: 'albero', label: 'Albero motore', items: [
    { id: 'fuso', name: 'In ghisa', price: 400, kg: 0, rpm: 7200, reg: 60, note: 'Di serie: va bene finché non esageri.' },
    { id: 'forg', name: 'Forgiato', price: 1300, kg: -2, rpm: 8600, reg: 120, note: 'Acciaio forgiato: regge giri e potenza.' },
    { id: 'stroker', name: 'Forgiato a corsa lunga', price: 1900, kg: 2, rpm: 7300, reg: 110, dispK: 1.1, lowK: 1.04, note: '+10 % di cilindrata: più coppia in basso, sale meno di giri.' } ] },
  { id: 'bielle', label: 'Bielle', items: [
    { id: 'fuse', name: 'Di serie, in ghisa', price: 300, kg: 0, rpm: 7000, reg: 45, note: 'Il punto debole di ogni motore spinto.' },
    { id: 'h', name: 'Forgiate ad H', price: 900, kg: 0, rpm: 8200, reg: 90, note: 'Le prime da mettere se vuoi il turbo.' },
    { id: 'ti', name: 'In titanio', price: 2200, kg: -2, rpm: 9200, reg: 125, note: 'Leggerissime: il motore prende giri come una moto.' } ] },
  { id: 'pistoni', label: 'Pistoni', items: [
    { id: 'std', name: 'Fusi, compressione 10:1', price: 350, kg: 0, comp: 'std', reg: 45, note: 'Di serie: un po\' di turbo lo reggono, non tanto.' },
    { id: 'low', name: 'Forgiati, compressione bassa 8,5:1', price: 1000, kg: 0, comp: 'low', reg: 110, note: 'Fatti per il turbo: meno spinta da aspirato, reggono pressioni alte.' },
    { id: 'high', name: 'Forgiati, compressione alta 11,5:1', price: 1100, kg: 0, comp: 'high', reg: 100, note: 'Per l\'aspirato: +6 % di coppia. Col turbo battono in testa.' } ] },
  { id: 'testata', label: 'Testata', items: [
    { id: 'v2', name: '2 valvole per cilindro, monoalbero', price: 600, kg: 20, tq: 88, rN: 3000, rH: 5200, rpm: 6300, fall: 0.82, note: 'Coppia in basso, tranquilla: in alto finisce presto.' },
    { id: 'v4', name: '4 valvole per cilindro, bialbero', price: 1500, kg: 28, tq: 94, rN: 4200, rH: 6200, rpm: 7300, fall: 0.88, note: 'Il giusto mezzo: piena dappertutto.' },
    { id: 'v4p', name: '4 valvole, condotti lucidati a mano', price: 2600, kg: 28, tq: 97, rN: 4600, rH: 6900, rpm: 7900, fall: 0.9, note: 'Respira meglio in alto: allunga e spinge fino in fondo.' } ] },
  { id: 'camme', label: 'Alberi a camme', items: [
    { id: 'serie', name: 'Di serie', price: 250, kg: 0, tqK: 1, dN: 0, dH: 0, dRpm: 0, lope: 0, idle: 0, note: 'Minimo regolare, guidabile.' },
    { id: 'sport', name: 'Sportivi (264°)', price: 700, kg: 0, tqK: 0.98, dN: 500, dH: 400, dRpm: 300, lope: 0.25, idle: 100, note: 'Il minimo comincia a scalciare, in alto c\'è di più.' },
    { id: 'gara', name: 'Da gara (280°)', price: 1300, kg: 0, tqK: 0.93, dN: 1000, dH: 900, dRpm: 700, lope: 0.6, idle: 250, note: 'Minimo che galoppa, in basso vuoto, in alto esplode.' } ] },
  { id: 'sovra', label: 'Sovralimentazione', items: [
    { id: 'na', name: 'Aspirato', price: 0, kg: 0, max: 0, note: 'Nessun turbo: risposta immediata.' },
    { id: 'tp', name: 'Turbo piccolo (0,7 bar)', price: 2200, kg: 14, max: 0.7, a: 2200, b: 3200, note: 'Si sveglia presto, spinta dolce.' },
    { id: 'tm', name: 'Turbo medio (1,1 bar)', price: 3600, kg: 18, max: 1.1, a: 2800, b: 3900, note: 'Un po\' di ritardo, poi una bella botta.' },
    { id: 'tg', name: 'Turbo grande (1,6 bar)', price: 5200, kg: 22, max: 1.6, a: 3400, b: 4700, note: 'Sotto i 3500 giri dorme. Poi una catapulta.' },
    { id: 'sc', name: 'Compressore volumetrico (0,6 bar)', price: 3000, kg: 16, max: 0.6, sc: true, note: 'Spinta subito e sempre, col fischio acuto.' } ] },
  { id: 'iniettori', label: 'Iniettori', items: [
    { id: 'i250', name: '250 cc', price: 200, kg: 0, cap: 42, note: 'Bastano per un aspirato tranquillo.' },
    { id: 'i440', name: '440 cc', price: 600, kg: 0, cap: 75, note: 'Per un turbo normale.' },
    { id: 'i750', name: '750 cc', price: 1100, kg: 0, cap: 135, note: 'Benzina per tutto quello che vuoi fare.' } ] },
  { id: 'centralina', label: 'Centralina', items: [
    { id: 'serie', name: 'Di serie', price: 300, kg: 0, maxBoost: 0.6, spark: false, pw: 1, rpm: 0, note: 'Non sopra 0,6 bar, niente launch e scoppi.' },
    { id: 'prog', name: 'Programmabile', price: 1600, kg: 0, maxBoost: 2.2, spark: true, pw: 1.03, rpm: 300, note: 'Tutta la pressione del turbo, +300 giri, launch control, pop & bang.' } ] },
];
const MOT_CAT = Object.fromEntries(MOT_PARTI.map((c) => [c.id, c]));
const motPart = (cat, id) => { const C = MOT_CAT[cat]; return C && (C.items.find((x) => x.id === id) || null); };
// la scelta più economica di ogni reparto (il motore "base")
const MOT_BASE = Object.fromEntries(MOT_PARTI.map((c) => [c.id, c.items[0].id]));

// curva di coppia indicata (come genTq di cars.js, ma fino a dove serve) dai numeri chiave
function motTq(hp, rpmHp, nm, rpmNm, lim) {
  const fr = (r) => 16 + 0.0035 * r + 0.9e-6 * r * r, nHp = hp * 7023 / rpmHp, out = [];
  for (let r = 0; r <= Math.max(7500, lim + 1000); r += 500) {
    let t;
    if (r <= rpmNm) t = nm * (0.55 + 0.45 * Math.min(1, r / Math.max(1, rpmNm)));
    else if (r <= rpmHp) t = nm + (nHp - nm) * (r - rpmNm) / Math.max(1, rpmHp - rpmNm);
    else t = nHp * Math.max(0.35, 1 - (r - rpmHp) / Math.max(800, (lim + 900 - rpmHp)) * 0.55);
    out.push([r, Math.round(t + fr(r))]);
  }
  return out;
}

// dai pezzi al motore: tutto quello che serve a fisica, suono e negozio
function motCalc(sel) {
  sel = sel || {};
  const P = {}, missing = [];
  for (const C of MOT_PARTI) { const it = motPart(C.id, sel[C.id]); if (it) P[C.id] = it; else missing.push(C.id); }
  if (missing.length) return { ok: false, missing };
  const B = P.blocco, A = P.albero, Bi = P.bielle, Pi = P.pistoni, T = P.testata, Cm = P.camme, S = P.sovra, In = P.iniettori, E = P.centralina;
  const cyl = B.cyl, disp = Math.round(B.disp * (A.dispK || 1) * 10) / 10;
  const compK = { std: 1, low: 0.95, high: 1.06 }[Pi.comp];
  const nm = Math.round(disp * T.tq * compK * Cm.tqK * (A.lowK || 1));
  const lim = Math.min(A.rpm, Bi.rpm, T.rpm + Cm.dRpm + E.rpm);
  const rH = Math.min(T.rH + Cm.dH, lim - 300), rN = Math.min(T.rN + Cm.dN, rH - 800);
  const hpNA = nm * T.fall * rH / 7023;
  // sovralimentazione: la centralina di serie non va oltre i suoi bar; la compressione alta batte in testa
  const boost = Math.min(S.max, E.maxBoost), boostK = { low: 1, std: 0.85, high: 0.6 }[Pi.comp] * 0.95;
  const bf = (0.9 + 0.78 * boostK * boost) / 0.9;                       // la stessa spinta che calcola sim.js a turbo pieno
  // CV e Nm veri: come li calcola sim.js (estimatePeak) con il turbo a pressione piena, giro per giro
  const fr = (r) => 16 + 0.0035 * r + 0.9e-6 * r * r, base = motTq(hpNA, rH, nm, rN, lim);
  const at = (t, r) => { for (let i = 1; i < t.length; i++) if (r < t[i][0]) { const [a, ta] = t[i - 1], [b, tb] = t[i]; return ta + (tb - ta) * (r - a) / (b - a); } return t[t.length - 1][1]; };
  const peak = (k) => { let cv = 0, T0 = 0; for (let r = 1000; r <= lim; r += 50) { const T = at(base, r) * k * bf - fr(r); cv = Math.max(cv, T * r / 7023); T0 = Math.max(T0, T); } return { cv, nm: T0 }; };
  let k = E.pw, pk = peak(k);
  const cap = In.cap * cyl, lean = pk.cv > cap * 1.02;                   // iniettori piccoli: la benzina non basta, la potenza si ferma lì
  if (lean) for (let q = 0; q < 6; q++) { k *= Math.pow(cap / pk.cv, 0.8); pk = peak(k); }
  const hp = pk.cv, fuelK = k / E.pw;
  let reg = cyl * Math.min(B.reg, A.reg, Bi.reg, Pi.reg);
  const knock = Pi.comp === 'high' && boost > 0.45;                      // compressione alta + turbo: detonazione
  if (knock) reg *= 0.6;
  const stress = hp / reg;
  let rel = Math.max(0, Math.min(1, 1 - (stress - 0.9) * 3));
  if (lean) rel = Math.min(rel, 0.55);                                   // magra: pistoni che scaldano
  const kg = MOT_PARTI.reduce((a, C) => a + (P[C.id].kg || 0), 0) + 40;   // più testata, collettori, accessori
  const price = MOT_PARTI.reduce((a, C) => a + P[C.id].price, 0);
  const turboSim = S.max > 0 ? (S.sc ? { max: boost, a: 1800, b: 5500, up: 0.2, down: 0.5, twin: false } : { max: boost, a: S.a, b: S.b, up: 0.42, down: 0.85, twin: false }) : null;
  const turboDsp = S.max > 0 ? (S.sc ? { f0: 3200, f1: 9800, w: 0.06, wh: 0.06, damp: 2600, twin: 0, mani: 1 } : { f0: 2000, f1: 7400, w: 0.055, wh: 0.08, damp: 2300, twin: 0, mani: 1 }) : null;
  const voice = {
    pulse: hp > 160 ? 0.85 : 1.0, rough: 0.1 + Cm.lope * 0.3, metal: S.max > 0 ? 0.25 : 0.12, boomRpm: Math.round(lim * 0.45), hiRpm: lim, lope: Cm.lope,
    pop: cyl === 6 ? { f: 0.9, crack: 1.0, len: 1.15, thump: 1.15 } : cyl === 5 ? { f: 0.85, crack: 1.0, len: 1.3, thump: 1.1 } : { f: 1.15, crack: 1.15, len: 0.9 },
  };
  const tipo = `${cyl} cilindri ${disp.toFixed(1)}${S.max > 0 ? (S.sc ? ' volumetrico' : ' turbo') : ''}`;
  return {
    ok: true, sel: Object.assign({}, sel), parts: P, cyl, disp, nm: Math.round(pk.nm), nmNA: nm, hp: Math.round(hp), hpNA: Math.round(hpNA),
    rpmHp: rH, rpmNm: rN, lim, idle: 800 + Cm.idle, lope: Cm.lope, boost, boostK, turboSim, turboDsp, spark: E.spark, fuelK,
    kg: Math.round(kg), price, rel, stress, lean, knock, tq: base.map(([r, t]) => [r, Math.round(t * k)]), voice, tipo,
    deboli: MOT_PARTI.filter((C) => C.id !== 'blocco' && P[C.id].reg !== undefined && P[C.id].reg * cyl * (knock ? 0.6 : 1) < hp * 1.1).map((C) => C.label),
  };
}
// peso del motore di serie di un'auto (per lo swap): dai cilindri e dal tipo
function motKgSerie(carId) {
  const c = typeof CARS !== 'undefined' && CARS[carId]; if (!c) return 150;
  const cyl = carId === 'supra' ? 6 : c.cyl || ((c.tag || '').includes('cinque') ? 5 : 4), diesel = c.P && c.P.limiter < 5200;
  return (cyl >= 6 ? (carId === 'supra' ? 230 : 200) : cyl === 5 ? 165 : 130) + (diesel ? 25 : 0);
}

// posto auto e porta davanti al Pistone (entrata2d.js): l'auto a sinistra del portone, si entra dal portone
if (typeof GAME_POSTI !== 'undefined') GAME_POSTI.motori = { park: -3.3, door: 0 };
if (typeof VG_PLACE !== 'undefined') {
  VG_PLACE.motori = { name: () => 'Il Pistone', what: 'motori', col: '#ff6a2a' };
  if (VG_PATTERN[4] === 'bar') VG_PATTERN[4] = 'motori';
}

(function motoriLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  P.mot = function () { const v = this.s.vg || (this.s.vgMot = this.s.vgMot || {}); return v.mot || (v.mot = { list: [], on: {}, n: 0, bozza: Object.assign({}, MOT_BASE) }); };
  P.motAlPistone = function () { return !!(this.inside && this.inside.id === 'motori'); };
  P.motOf = function (carId) { const M = this.mot(), id = M.on[carId || this.car]; return id ? M.list.find((e) => e.id === id) || null : null; };
  // costruire: si paga e il motore entra in magazzino (lo chiama la scena del montaggio, quando l'ultimo pezzo è al suo posto)
  P.motBuild = function (sel, nome) {
    const c = motCalc(sel); if (!c.ok) return { ok: false, why: 'Manca un pezzo: ' + c.missing.map((k) => MOT_CAT[k].label.toLowerCase()).join(', ') };
    const M = this.mot();
    if (M.list.length >= MOT.maxMotori) return { ok: false, why: `In magazzino ci stanno ${MOT.maxMotori} motori: vendine uno` };
    if (this.mode === 'career' && this.s.money < c.price) return { ok: false, why: `Servono € ${fmt(c.price)}` };
    if (this.mode === 'career') this.s.money -= c.price;
    M.n = (M.n || 0) + 1;
    const e = { id: 'm' + M.n, nome: nome || `${c.tipo} n. ${M.n}`, sel: Object.assign({}, sel), km: 0, rotto: false, prezzo: c.price };
    M.list.push(e);
    if (this.statAdd) this.statAdd('motori');
    return { ok: true, e, c };
  };
  // montare su un'auto del garage (al Pistone, da fermi): il motore che c'era (se costruito) torna in magazzino
  P.motMount = function (eid, carId) {
    carId = carId || this.car;
    const M = this.mot(), e = M.list.find((x) => x.id === eid);
    if (!e) return { ok: false, why: 'Motore non trovato' };
    if (!this.motAlPistone()) return { ok: false, why: 'I motori si montano al Pistone' };
    if (e.rotto) return { ok: false, why: 'È rotto: prima va rifatto' };
    for (const k in M.on) if (M.on[k] === eid && k !== carId) return { ok: false, why: `È montato sulla ${CARS[k] ? CARS[k].short || CARS[k].name : k}: smontalo prima` };
    if (M.on[carId] === eid) return { ok: false, why: 'È già montato lì' };
    if (this.mode === 'career' && this.s.money < MOT.lavoro) return { ok: false, why: `La manodopera costa € ${MOT.lavoro}` };
    if (this.mode === 'career') this.s.money -= MOT.lavoro;
    M.on[carId] = eid;
    return { ok: true };
  };
  P.motUnmount = function (carId) {
    carId = carId || this.car; const M = this.mot();
    if (!M.on[carId]) return { ok: false, why: 'Ha già il suo motore di serie' };
    if (!this.motAlPistone()) return { ok: false, why: 'I motori si smontano al Pistone' };
    if (this.mode === 'career' && this.s.money < MOT.lavoro) return { ok: false, why: `La manodopera costa € ${MOT.lavoro}` };
    if (this.mode === 'career') this.s.money -= MOT.lavoro;
    delete M.on[carId];
    return { ok: true };
  };
  P.motSell = function (eid) {
    const M = this.mot(), i = M.list.findIndex((x) => x.id === eid); if (i < 0) return { ok: false, why: 'Motore non trovato' };
    if (Object.values(M.on).includes(eid)) return { ok: false, why: 'Prima smontalo' };
    if (!this.motAlPistone()) return { ok: false, why: 'I motori si vendono al Pistone' };
    const e = M.list[i], v = this.motValue(e);
    M.list.splice(i, 1); if (this.mode === 'career') this.s.money += v;
    return { ok: true, v };
  };
  P.motValue = function (e) { return e.rotto ? Math.round(e.prezzo * 0.15 / 10) * 10 : Math.round(e.prezzo * MOT.vendita * Math.max(0.4, 1 - (e.km || 0) / 4000) / 10) * 10; };
  P.motRepair = function (eid) {
    const M = this.mot(), e = M.list.find((x) => x.id === eid); if (!e || !e.rotto) return { ok: false, why: 'Non è rotto' };
    if (!this.motAlPistone()) return { ok: false, why: 'I motori si rifanno al Pistone' };
    const c = Math.round(e.prezzo * MOT.revisione / 10) * 10;
    if (this.mode === 'career' && this.s.money < c) return { ok: false, why: `La revisione costa € ${fmt(c)}` };
    if (this.mode === 'career') this.s.money -= c;
    e.rotto = false; e.risk = 0; return { ok: true, c };
  };
  // usura e rotture: solo il motore montato sull'auto che guidi; più è spinto oltre quello che regge, più rischia
  // quando lo tieni sul limitatore a gas pieno
  P.motTick = function (dt, dkm) {
    const e = this.motOf(); if (!e) return;
    e.km = (e.km || 0) + (dkm || 0);
    const sim = this.sim;
    if (e.rotto) { if (sim.running) sim.running = false; if (sim.starter) sim.catchAt = 1e9; return; }
    const c = motCalc(e.sel); if (!c.ok || c.rel >= 0.999) return;
    if (sim.running && sim.rpm > c.lim * 0.9 && (sim.in.thr || 0) > 0.8) {
      e.risk = (e.risk || 0) + dt * (1 - c.rel) * (1 - c.rel) * 0.35;          // tirato al limite: lo stress si accumula
      if (e.risk > 1 && Math.random() < dt * 0.6) {
        e.rotto = true; e.risk = 0; sim.running = false;
        this.say(c.lean ? 'Il motore ha grippato: la benzina non bastava e i pistoni si sono fusi. Portalo al Pistone' : 'CRACK! Una biella ha ceduto: il motore è rotto. Portalo al Pistone (carro attrezzi o a spinta)', 'bad');
        if (sim.events) sim.events.push({ type: 'crash', I: 1.2, kind: 'front' });
      } else if (e.risk > 0.6 && !e.warn) { e.warn = true; this.say('Il motore batte in testa e fa un rumore che non ti piace', 'bad'); }
    }
  };
  const up = P.update;
  P.update = function (dt) { const d0 = this.s.dist; up.call(this, dt); if (this.s && this.s.vg) this.motTick(dt, Math.max(0, this.s.dist - d0) / 1000); };
})();

// applySettings (index.html) la chiama dopo aver letto i pezzi dell'auto: se l'auto ha un motore costruito,
// coppia, giri, turbo, voce e peso vengono dal motore. Restituisce il motore applicato (o null).
function motApply(game, carId, TP, sim) {
  if (!game || !game.motOf) return null;
  const e = game.motOf(carId); if (!e) return null;
  const c = motCalc(e.sel); if (!c.ok) return null;
  sim.P.tq = c.tq;
  TP.sim.dm = (TP.sim.dm || 0) + c.kg - motKgSerie(carId);          // il peso del motore in più (o in meno) rispetto a quello di serie: lo somma game.applyMass
  const hasT = !!c.turboSim;
  Object.assign(TP.sim, {
    turbo: hasT ? Object.assign({}, c.turboSim) : { max: 0, a: 9000, b: 9900, up: 1, down: 1, twin: false },
    boostK: c.boostK, limiter: c.lim, idle: c.idle, lope: c.lope * 0.6, camLow: 1, camHigh: 1,
    sparkCut: c.spark, ecuLaunch: c.spark, ecuPops: c.spark && hasT, ic: hasT ? { heat: 0.8 } : null, valve: hasT && !c.parts.sovra.sc ? 'bov' : 'recirc',
  });
  if (!TP.dsp) TP.dsp = {};
  Object.assign(TP.dsp, {
    cyl: c.cyl, voice: c.voice, lope: c.lope, spark: c.spark ? 1 : 0,
    tb: hasT ? c.turboDsp : { f0: 2500, f1: 8000, w: 0, wh: 0, damp: 1700, twin: 0, mani: 1 },
    bov: hasT && !c.parts.sovra.sc ? { v: 1, f0: 2200, sw: 900, q: 0.8, g: 0.75, chirp: 0.25 } : { v: 0, f0: 1800, sw: 600, q: 0.7, g: 0.05, chirp: 0 },
  });
  if (TP.dsp.cat) TP.dsp.cat = Object.assign({}, TP.dsp.cat, { pop: c.spark && hasT ? 1.4 : hasT ? 0.7 : 0.3 });
  return c;
}

if (typeof window !== 'undefined') Object.assign(window, { MOT, MOT_PARTI, MOT_BASE, motCalc, motApply, motKgSerie });
