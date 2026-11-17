// ============================================================================
//  Night Run · Il concessionario: Autosalone Notte (dopo ruota.js)
//  Una tappa nuova del viaggio: prende il posto del terzo bar di ogni giro di tappe (VG_PATTERN[8], primo al km 27,4).
//  Dentro: il salone con le auto in vendita (quelle di VG_SHOP, sbloccate coi km), schede tecniche vere (cavalli, coppia
//  e peso calcolati dal modello del motore), l'occasione della tappa (−15 %), l'acquisto in contanti o a rate,
//  la vendita delle tue auto (valutazione da km, danni e pezzi montati), il giro di prova di 3 km.
//  Le auto si comprano solo qui; il Motel Ovunque resta il parcheggio dove si cambia mezzo (e vende il rimorchio).
//  Stato in game.s.vg: fin (finanziamenti), test (giro di prova in corso).
// ============================================================================
const DL = {
  down: 0.2,            // anticipo del finanziamento
  rate: 0.15,           // interessi su quello che resta
  n: 8,                 // numero di rate
  every: 10,            // una rata ogni tanti km
  late: 0.1,            // mora sulla rata saltata
  repo: 3,              // rate saltate di fila prima che si riprendano l'auto
  maxFin: 2,            // finanziamenti aperti al massimo
  payoff: 0.05,         // sconto se chiudi prima
  testKm: 3,            // giro di prova
  testOver: 250,        // € per km oltre il giro di prova (dopo 0,5 km di tolleranza)
  deal: 0.15,           // sconto dell'occasione
  v40: 4000,            // valore a nuovo della V40 (non è in vendita)
};
const DL_SPORT = ['supra', 'r5', 'e34', 'e30', 'e36', 'williams', 'b2002', 'v850', 'p205', 'golf'];
const DL_WORK = ['bus', 'van', 'doblo', 'ambulanza', 'polizia', 'taxi'];
const DL_CAT = (id) => (DL_WORK.includes(id) ? 'lavoro' : DL_SPORT.includes(id) ? 'sportive' : 'citta');
const DL_CATS = [['sportive', 'Sportive'], ['citta', 'Da tutti i giorni'], ['lavoro', 'Da lavoro']];

if (typeof VG_PLACE !== 'undefined') {
  VG_PLACE.dealer = { name: () => 'Autosalone Notte', what: 'concessionario', col: '#b69cff' };
  if (VG_PATTERN[8] === 'bar') VG_PATTERN[8] = 'dealer';
}

(function dealerLogica() {
  if (typeof StreetGame === 'undefined' || typeof VG_SHOP === 'undefined') return;
  const P = StreetGame.prototype;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const r50 = (v) => Math.round(v / 50) * 50, r10 = (v) => Math.ceil(v / 10) * 10;
  const km = (g) => (g.s.dist || 0) / 1000;
  const shop = () => VG_SHOP.filter((q) => q.car && CARS[q.id]);
  const V = (g) => g.s.vg;
  const fins = (g) => (V(g).fin = V(g).fin || []);

  // scheda tecnica di serie (cavalli e coppia dal modello del motore, col tuning di serie)
  const specCache = {};
  P.dlSpec = function (id) {
    if (specCache[id]) return specCache[id];
    let cv = 0, nm = 0, kg = CARS[id] && (CARS[id].mass || (CARS[id].P && CARS[id].P.mass)) || 0;
    try {
      const prev = typeof ACTIVE_CAR !== 'undefined' ? ACTIVE_CAR : 'supra';
      setActiveCar(id); const tp = tuningParams(CARS[id].presets[0].sel); setActiveCar(prev);
      const s = new SupraSim(); s.setCar(id === 'supra' ? null : Object.assign({}, CARS[id].P)); s.setTune(tp.sim);
      const e = s.estimatePeak(); cv = Math.round(e.cv); nm = Math.round(e.nm); kg = s.P.mass;
    } catch (e) { /* scheda non disponibile */ }
    const cargo = typeof VG_CARGO !== 'undefined' && VG_CARGO[id] ? VG_CARGO[id].kg : typeof TRUNK_KG !== 'undefined' ? TRUNK_KG : 150;
    const seats = typeof VG_SEATS !== 'undefined' ? VG_SEATS[id] || 4 : 4;
    return (specCache[id] = { cv, nm, kg, kgcv: cv ? kg / cv : 0, seats, cargo });
  };

  // l'occasione della tappa n: una delle auto già in vendita a quel km (sempre la stessa per la stessa tappa)
  P.dlDeal = function (n) {
    const at = VG.stopX(n) / 1000, v = V(this);
    const cand = shop().filter((q) => q.km <= at && !v.garage.includes(q.id));
    if (!cand.length) return null;
    return cand[Math.floor(VG.hash(n * 7 + 3) * cand.length)].id;
  };
  P.dlPrice = function (id, n) {
    const it = VG_SHOP.find((q) => q.id === id); if (!it) return 0;
    return n !== undefined && this.dlDeal(n) === id ? r50(it.price * (1 - DL.deal)) : it.price;
  };
  P.dlFinPlan = function (price) {
    const down = Math.round(price * DL.down / 100) * 100, rest = price - down, total = Math.round(rest * (1 + DL.rate));
    return { down, rata: r10(total / DL.n), n: DL.n, total: r10(total / DL.n) * DL.n, every: DL.every };
  };
  const here = (g) => g.inside && g.inside.id === 'dealer';
  const cargoAboard = (g) => (g.s.trunk || []).some((it) => it.kind === 'scatola' || it.kind === 'bancale' || it.kind === 'pacco');

  // compra: how = 'cash' | 'fin'. n = tappa (per l'occasione)
  P.dlBuy = function (id, how, n) {
    const v = V(this), it = VG_SHOP.find((q) => q.id === id && q.car); if (!it) return { ok: false };
    const testing = v.test && v.test.id === id;
    if (v.garage.includes(id) && !testing) return { ok: false, why: 'Ce l\'hai già' };
    if (km(this) < it.km) return { ok: false, why: `In vendita dal km ${it.km}` };
    const price = this.dlPrice(id, n);
    if (how === 'fin') {
      if (fins(this).length >= DL.maxFin) return { ok: false, why: `Hai già ${DL.maxFin} finanziamenti aperti` };
      if (fins(this).some((f) => f.miss > 0)) return { ok: false, why: 'Hai una rata arretrata: prima mettiti in pari' };
      const p = this.dlFinPlan(price);
      if (this.s.money < p.down) return { ok: false, why: `Per l'anticipo servono € ${fmt(p.down)}` };
      this.s.money -= p.down;
      fins(this).push({ id, rata: p.rata, left: p.n, next: Math.floor(km(this)) + DL.every, miss: 0, mora: 0, price });
      this.say(`${CARS[id].name}: anticipo € ${fmt(p.down)}, poi ${p.n} rate da € ${fmt(p.rata)} ogni ${DL.every} km`, 'buy');
    } else {
      if (this.s.money < price) return { ok: false, why: `Costa € ${fmt(price)}, ne hai ${fmt(Math.floor(this.s.money))}` };
      this.s.money -= price; this.say(`${CARS[id].name}: è tua (− € ${fmt(price)})`, 'buy');
    }
    if (testing) v.test = null; else { v.garage.push(id); this.carState(id); }
    v.owned[id] = true;
    v.bought = (v.bought || 0) + 1;
    return { ok: true, price };
  };

  // valutazione di un'auto tua: prezzo a nuovo, chilometri, danni, più un terzo dei pezzi montati
  P.dlParts = function (id) {
    const T = CARS[id] && CARS[id].tuning; if (!T) return 0;
    const pre = id === 'supra' ? '' : id + '|'; let sum = 0;
    for (const k in this.s.owned || {}) {
      if (!this.s.owned[k] || (pre ? !k.startsWith(pre) : k.includes('|'))) continue;
      const [cat, it] = k.slice(pre.length).split(':'); if (cat === 'cos' || !T[cat]) continue;
      const item = (T[cat].items || []).find((q) => q.id === it); if (item) sum += item.price || 0;
    }
    return sum;
  };
  P.dlValue = function (id) {
    const it = VG_SHOP.find((q) => q.id === id), base = it ? it.price : DL.v40;
    const st = (this.s.cars || {})[id] || {}, dmg = id === this.car ? this.sim.damage : st.damage || 0;
    const dep = Math.max(0.35, 0.75 - (st.km || 0) / 1000 * 0.3);
    return Math.max(200, r50(base * dep * (1 - 0.6 * dmg) + this.dlParts(id) * 0.33));
  };
  P.dlCanSell = function (id) {
    const v = V(this);
    if (!v.garage.includes(id) || !v.owned[id] && id !== 'v40') return { ok: false, why: 'Non è tua' };
    if (id === this.car) return { ok: false, why: 'Ci sei sopra: prima cambia auto' };
    if (fins(this).some((f) => f.id === id)) return { ok: false, why: 'È ancora in finanziamento' };
    if (v.test) return { ok: false, why: 'Prima finisci il giro di prova' };
    if (v.garage.filter((g) => !(v.test && v.test.id === g)).length <= 1) return { ok: false, why: 'È l\'unica che hai' };
    return { ok: true };
  };
  P.dlSell = function (id) {
    const c = this.dlCanSell(id); if (!c.ok) return c;
    const v = V(this), val = this.dlValue(id), pre = id === 'supra' ? '' : id + '|';
    this.s.money += val; v.garage = v.garage.filter((g) => g !== id); delete v.owned[id]; delete this.s.cars[id];
    for (const k in this.s.owned || {}) if (pre ? k.startsWith(pre) : !k.includes('|')) delete this.s.owned[k];
    this.say(`${CARS[id].name} venduta: + € ${fmt(val)}`, 'money');
    return { ok: true, val };
  };

  // chiudi un finanziamento in anticipo (con lo sconto)
  P.dlPayoff = function (i) {
    const f = fins(this)[i]; if (!f) return { ok: false };
    const due = Math.round((f.left * f.rata + (f.mora || 0)) * (1 - DL.payoff));
    if (this.s.money < due) return { ok: false, why: `Per chiuderlo servono € ${fmt(due)}` };
    this.s.money -= due; fins(this).splice(i, 1);
    this.say(`Finanziamento chiuso: la ${CARS[f.id].short || CARS[f.id].name} è tutta tua (− € ${fmt(due)})`, 'money');
    return { ok: true, due };
  };

  // giro di prova: l'auto è tua per 3 km, poi quando ti fermi il venditore viene a riprendersela
  P.dlTestStart = function (id) {
    const v = V(this), it = VG_SHOP.find((q) => q.id === id && q.car);
    if (!it) return { ok: false };
    if (v.test) return { ok: false, why: 'Hai già un giro di prova in corso' };
    if (v.garage.includes(id)) return { ok: false, why: 'Ce l\'hai già' };
    if (km(this) < it.km) return { ok: false, why: `In vendita dal km ${it.km}` };
    if (v.pax && v.pax.length) return { ok: false, why: 'Con i passeggeri a bordo niente prova' };
    if (cargoAboard(this)) return { ok: false, why: 'Prima consegna la merce che hai a bordo' };
    v.garage.push(id); const st = this.carState(id); st.fuel = Math.max(st.fuel || 0, 0.35);
    v.test = { id, prev: this.car, km0: km(this), warned: false, dmg0: 0 };
    return { ok: true };
  };
  P.dlTestLeft = function () { const T = V(this).test; return T ? Math.max(0, DL.testKm - (km(this) - T.km0)) : 0; };

  // cambio auto senza le regole del motel (fine prova, carro attrezzi)
  P.dlSwap = function (id) {
    if (!CARS[id] || id === this.car) return { ok: false };
    const sim = this.sim, cur = this.carState();
    Object.assign(cur, { fuel: sim.fuel, damage: sim.damage, tireWear: sim.tireWear });
    this.s.carId = id;
    const nx = this.carState();
    sim.fuel = nx.fuel ?? 0.6; sim.damage = nx.damage || 0; sim.tireWear = nx.tireWear || 0; sim.dry = false;
    this.applyMass();
    return { ok: true };
  };
  const sw = P.switchCar;
  P.switchCar = function (id) {
    if (this._dlForce === id) { this._dlForce = null; return this.dlSwap(id); }
    if (here(this) && this.s.vg && this.s.vg.on) {                 // al concessionario si cambia come al motel
      const ins = this.inside, ap = this.ap; this.inside = Object.assign({}, ins, { id: 'motel' }); this.ap = null;   // fermo davanti all'ingresso
      try { return sw.call(this, id); } finally { this.inside = ins; this.ap = ap; }
    }
    return sw.call(this, id);
  };

  // ogni mezzo secondo: rate e giro di prova. swap(id) cambia auto (nel browser passa dall'interfaccia).
  P.dlTick = function (swap = (id) => this.dlSwap(id)) {
    const v = V(this); if (!v || !v.on) return [];
    const out = [], k = km(this), stopped = this.sim.kmh < 2;
    // giro di prova
    const T = v.test;
    if (T) {
      const d = k - T.km0;
      if (this.car !== T.id && !here(this)) {                        // cambiata al motel: la riportano loro
        v.garage = v.garage.filter((g) => g !== T.id); delete this.s.cars[T.id]; v.test = null; out.push({ k: 'testGone' });
      } else if (this.car === T.id && d > DL.testKm) {
        if (!T.warned) { T.warned = true; this.say(`Giro di prova finito: fermati, il venditore viene a riprendersi la ${CARS[T.id].short || CARS[T.id].name}`, 'buy'); out.push({ k: 'testWarn' }); }
        if (stopped) {
          const over = Math.max(0, d - DL.testKm - 0.5), dmg = Math.max(0, this.sim.damage - (T.dmg0 || 0));
          const it = VG_SHOP.find((q) => q.id === T.id), cost = Math.round(over * DL.testOver + dmg * (it ? it.price : 10000) * 0.25);
          const prev = v.garage.includes(T.prev) ? T.prev : v.garage.find((g) => g !== T.id);
          if (prev && swap(prev) !== false && this.car === prev) {
            v.garage = v.garage.filter((g) => g !== T.id); delete this.s.cars[T.id]; v.test = null;
            if (cost > 0) this.s.money -= cost;
            this.say(cost > 0 ? `Il venditore si riprende l'auto: − € ${fmt(cost)} (${over > 0 ? fmt(over * 10 / 10) + ' km in più' : ''}${over > 0 && dmg > 0 ? ', ' : ''}${dmg > 0 ? 'danni' : ''})` : 'Il venditore si riprende l\'auto. «Allora, ti è piaciuta?»', cost > 0 ? 'lose' : 'buy');
            out.push({ k: 'testEnd', cost });
          }
        }
      }
    }
    // rate
    for (const f of fins(this).slice()) {
      while (k >= f.next && !f.repo) {
        const due = f.rata + (f.mora || 0);
        if (this.s.money >= due) {
          this.s.money -= due; f.left--; f.mora = 0; f.miss = 0;
          this.say(`Rata della ${CARS[f.id].short || CARS[f.id].name}: − € ${fmt(due)} (ne mancano ${f.left})`, 'buy'); out.push({ k: 'rata', id: f.id, due });
        } else {
          f.miss++; f.mora = (f.mora || 0) + Math.round(f.rata * DL.late);
          this.say(f.miss >= DL.repo ? `Terza rata saltata: si riprendono la ${CARS[f.id].short || CARS[f.id].name}` : `Rata saltata (${f.miss} di ${DL.repo}): ci sono € ${fmt(f.mora)} di mora`, 'lose');
          out.push({ k: 'miss', id: f.id, miss: f.miss });
          if (f.miss >= DL.repo) f.repo = true;
        }
        f.next += DL.every;
        if (f.left <= 0) { fins(this).splice(fins(this).indexOf(f), 1); this.say(`Ultima rata pagata: la ${CARS[f.id].short || CARS[f.id].name} è tutta tua`, 'money'); out.push({ k: 'paid', id: f.id }); break; }
      }
      if (f.repo) {                                                   // il carro attrezzi: subito se non ci sei sopra, se no appena ti fermi
        const other = v.garage.find((g) => g !== f.id && !(v.test && v.test.id === g));
        if (this.car === f.id) { if (!stopped || !other || swap(other) === false || this.car === f.id) continue; }
        v.garage = v.garage.filter((g) => g !== f.id); delete v.owned[f.id]; fins(this).splice(fins(this).indexOf(f), 1);
        this.say(`Il carro attrezzi si è portato via la ${CARS[f.id].short || CARS[f.id].name}`, 'lose'); out.push({ k: 'repo', id: f.id });
      }
    }
    return out;
  };
})();

// ============================================================================
//  Pannello del concessionario, facciata sulla strada (solo nel browser)
// ============================================================================
(function dealerSchermo() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const G = () => window.nightRun && window.nightRun.game;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const UI = { tab: 0, sel: null };

  // ---------------------------------------------------------------- foto delle auto (il disegno con le ruote)
  const pics = {}, waiting = {};
  const pic = (id, cb) => {
    if (pics[id]) return pics[id];
    if (!waiting[id] && window.valigette && window.valigette.carPic) {
      waiting[id] = true;
      window.valigette.carPic(id, (c) => { try { pics[id] = c.toDataURL(); } catch (e) { pics[id] = ''; } if (cb) cb(); });
    }
    return '';
  };

  const CSS = document.createElement('style');
  CSS.textContent = `
.dl-tabs{display:flex;gap:6px;flex-wrap:wrap}.dl-tabs button{flex:1;border:0;padding:8px 10px;font:400 13px/1 var(--f-display);letter-spacing:.06em;text-transform:uppercase;background:#1c1a15;color:var(--muted);box-shadow:inset 0 0 0 1px #3a342a;cursor:pointer}
.dl-tabs button[aria-pressed="true"]{background:#b69cff;color:#120c22;box-shadow:none}
.dl-deal{position:relative;display:grid;gap:8px;padding:12px;background:radial-gradient(120% 90% at 50% 0%,#3a2a64,#141018 70%);box-shadow:inset 0 0 0 1px #b69cff88,0 0 24px rgba(182,156,255,.18)}
.dl-deal .rib{position:absolute;top:10px;right:-4px;background:#ffd23f;color:#1a1206;font:400 12px/1 var(--f-display);letter-spacing:.08em;padding:5px 10px 5px 12px;clip-path:polygon(8px 0,100% 0,100% 100%,8px 100%,0 50%)}
.dl-pic{display:grid;place-items:center;min-height:86px}.dl-pic img{max-width:100%;image-rendering:pixelated;filter:drop-shadow(0 10px 8px rgba(0,0,0,.6))}
.dl-deal .dl-pic{min-height:110px;background:radial-gradient(50% 30% at 50% 88%,rgba(182,156,255,.35),transparent)}
.dl-name{font:400 20px/1.1 var(--f-display);letter-spacing:.03em}.dl-name small{display:block;font:500 12.5px/1.3 var(--f-body);color:var(--muted);letter-spacing:0;margin-top:3px}
.dl-price{font:400 22px/1 var(--f-display);color:var(--lime)}.dl-price s{font-size:14px;color:var(--muted);margin-right:8px}
.dl-spec{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.dl-spec div{background:#0b0a08cc;padding:6px 8px;box-shadow:inset 0 0 0 1px #2a251d}.dl-spec b{display:block;font:400 10px/1 var(--f-data);letter-spacing:.1em;color:var(--muted);text-transform:uppercase}
.dl-spec span{font:400 16px/1.2 var(--f-display)}.dl-spec i{display:block;height:3px;margin-top:4px;background:#2a251d}.dl-spec i em{display:block;height:100%;background:#b69cff}
.dl-acts{display:flex;flex-wrap:wrap;gap:6px}.dl-acts .kbtn{flex:1 1 auto}
.dl-acts .kbtn:disabled{opacity:.38;cursor:default;filter:grayscale(.6)}.dl-acts small{color:var(--muted)}.dl-acts .kbtn.fin small{color:#2a1a50}.dl-acts .kbtn.buy small{color:#2a3408}
.dl-acts .kbtn.buy{background:linear-gradient(180deg,#c9dd5a,#8fa02a);color:#141a04}.dl-acts .kbtn.fin{background:linear-gradient(180deg,#c8b4ff,#8a6cf0);color:#120c22}
.dl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.dl-card{display:grid;gap:4px;padding:8px;background:#13120f;box-shadow:inset 0 0 0 1px #2a2620;cursor:pointer;text-align:left;border:0;color:var(--fg)}
.dl-card:hover,.dl-card.sel{box-shadow:inset 0 0 0 2px #b69cff}.dl-card.lock{opacity:.5}.dl-card b{font:400 14px/1.15 var(--f-display)}.dl-card small{font:500 12px/1.2 var(--f-body);color:var(--muted)}
.dl-card .dl-pic{min-height:52px}.dl-card .p{font:400 14px/1 var(--f-display);color:var(--lime)}.dl-card.lock .p{color:var(--muted)}
.dl-row{display:grid;grid-template-columns:110px 1fr;gap:10px;align-items:center;padding:8px;background:#13120f;box-shadow:inset 0 0 0 1px #2a2620}
.dl-row .dl-pic{min-height:40px}.dl-row b{font:400 15px/1.15 var(--f-display)}.dl-row small{display:block;color:var(--muted);font-size:12.5px}
.dl-row .dl-acts{margin-top:6px}.dl-bar{height:6px;background:#2a251d;margin:5px 0}.dl-bar i{display:block;height:100%;background:linear-gradient(90deg,#8a6cf0,#c8b4ff)}
.dl-warn{color:#ffb3bf}.dl-test{padding:8px 10px;background:#2a2206;box-shadow:inset 3px 0 0 #ffd23f;font-size:14px}`;
  document.head.appendChild(CSS);

  const specRow = (g, id) => {
    const s = g.dlSpec(id), bar = (v, max) => `<i><em style="width:${Math.min(100, Math.round(v / max * 100))}%"></em></i>`;
    return `<div class="dl-spec"><div><b>Potenza</b><span>${s.cv} CV</span>${bar(s.cv, 340)}</div><div><b>Coppia</b><span>${s.nm} Nm</span>${bar(Math.min(s.nm, 460), 460)}</div><div><b>Peso</b><span>${fmt(s.kg)} kg</span>${bar(Math.max(0, 2000 - Math.min(s.kg, 2000)), 1400)}</div>`
      + `<div><b>kg per CV</b><span>${String(s.kgcv.toFixed(1)).replace('.', ',')}</span>${bar(Math.max(0, 14 - s.kgcv), 10)}</div><div><b>Posti</b><span>${s.seats}</span>${bar(Math.min(s.seats, 9), 9)}</div><div><b>Carico</b><span>${fmt(s.cargo)} kg</span>${bar(Math.min(s.cargo, 1200), 1200)}</div></div>`;
  };

  let lastCtx = null;
  function panel(body, I, ctx) {
    const g = G(); if (!g) return; lastCtx = ctx;
    const v = g.s.vg, n = Math.round((I.x - VG_STOP0) / VG_STEP), deal = g.dlDeal(n), k = (g.s.dist || 0) / 1000;
    const redraw = () => ctx.refresh();
    const act = (fn) => (e) => { const r = fn(); if (r && r.ok === false && r.why) ctx.flash(r.why, 2.4); else if (r && r.ok) { ctx.save(); } redraw(); };
    const wrap = document.createElement('div'); wrap.style.cssText = 'display:grid;gap:12px';
    const note = (t) => { const p = document.createElement('p'); p.className = 'hint'; p.textContent = t; wrap.appendChild(p); };
    note(v.test ? 'Il venditore: «Allora? Com\'è andata? Se ti piace, la firmi e te la tieni.»' : deal ? 'Il venditore: «Guarda pure, le chiavi sono tutte in bacheca. Quella sulla pedana oggi te la faccio a meno.»' : 'Il venditore: «Hai già tutto quello che vendo. Torna quando hai qualcosa da darmi in cambio.»');
    if (v.test) { const d = document.createElement('div'); d.className = 'dl-test'; d.innerHTML = `Giro di prova in corso: <b>${esc(CARS[v.test.id].name)}</b> · mancano ${fmt(g.dlTestLeft(), 1)} km. Poi fermati e il venditore viene a riprendersela.`; wrap.appendChild(d); }
    const tabs = document.createElement('div'); tabs.className = 'dl-tabs';
    const F = (v.fin || []);
    [['Salone', 0], ['Le tue auto', 1], [`Rate${F.length ? ' (' + F.length + ')' : ''}`, 2]].forEach(([t, i]) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.setAttribute('aria-pressed', String(UI.tab === i)); b.addEventListener('click', () => { UI.tab = i; redraw(); }); tabs.appendChild(b); });
    wrap.appendChild(tabs);
    const h4 = (t) => { const h = document.createElement('h4'); h.textContent = t; h.style.cssText = 'margin:4px 0 0;font:400 14px/1 var(--f-display);letter-spacing:.06em;text-transform:uppercase;color:#b69cff'; wrap.appendChild(h); };
    const btn = (label, cls, fn, dis) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'kbtn ' + (cls || ''); b.innerHTML = label; if (dis) b.disabled = true; b.addEventListener('click', act(fn)); return b; };

    // le cinque auto del garage dello zio che non hai scelto nel prologo sono finite qui, in salone
    const zio = (id) => typeof GAR_ZIO !== 'undefined' && GAR_ZIO.includes(id) && id !== (v.eredita || 'v40');
    const ZIO = '<em style="display:block;font:italic 600 11px/1.3 system-ui;color:#ffb347">Era nel garage dello zio</em>';
    // scheda grande di un'auto (occasione o quella scelta)
    const big = (id, isDeal) => {
      const it = VG_SHOP.find((q) => q.id === id), price = g.dlPrice(id, n), plan = g.dlFinPlan(price), lock = k < it.km, testing = v.test && v.test.id === id;
      const d = document.createElement('div'); d.className = 'dl-deal';
      d.innerHTML = `${isDeal ? `<span class="rib">OCCASIONE −${Math.round(DL.deal * 100)} %</span>` : ''}<div class="dl-pic"><img alt="${esc(CARS[id].name)}" src="${pic(id, redraw)}"></div>`
        + `<div class="dl-name">${esc(CARS[id].name)}<small>${esc(it.note || CARS[id].tag || '')}</small>${zio(id) ? ZIO : ''}</div>`
        + `<div class="dl-price">${price !== it.price ? `<s>€ ${fmt(it.price)}</s>` : ''}€ ${fmt(price)}</div>${specRow(g, id)}`;
      const a = document.createElement('div'); a.className = 'dl-acts';
      if (lock) { const p = document.createElement('p'); p.className = 'hint'; p.textContent = `Arriva in salone dal km ${it.km}.`; d.appendChild(p); }
      else {
        a.appendChild(btn(`Compra · € ${fmt(price)}`, 'buy', () => g.dlBuy(id, 'cash', n), g.s.money < price));
        a.appendChild(btn(`A rate · anticipo € ${fmt(plan.down)}<small>poi ${plan.n} × € ${fmt(plan.rata)} ogni ${plan.every} km</small>`, 'fin', () => g.dlBuy(id, 'fin', n), g.s.money < plan.down));
        if (!testing) a.appendChild(btn(`Giro di prova<small>${DL.testKm} km, gratis</small>`, '', () => { const r = g.dlTestStart(id); if (!r.ok) return r; if (!window.nightRun.swapCar(id)) { v.garage = v.garage.filter((x) => x !== id); v.test = null; return { ok: false, why: 'Non si riesce a cambiare auto adesso' }; } ctx.flash(`Prova della ${CARS[id].short || CARS[id].name}: ${DL.testKm} km, poi fermati`, 2.6); return { ok: true }; }, !!v.test));
        d.appendChild(a);
      }
      return d;
    };

    if (UI.tab === 0) {
      const sel = UI.sel && !v.garage.includes(UI.sel) || UI.sel && v.test && v.test.id === UI.sel ? UI.sel : null;
      h4(sel && sel !== deal ? 'In vetrina' : 'Occasione della tappa');
      if (sel || deal) wrap.appendChild(big(sel || deal, (sel || deal) === deal));
      for (const [cat, title] of DL_CATS) {
        const list = VG_SHOP.filter((q) => q.car && CARS[q.id] && DL_CAT(q.id) === cat && (!v.garage.includes(q.id) || (v.test && v.test.id === q.id))).sort((a, b) => a.price - b.price);
        if (!list.length) continue;
        h4(title);
        const grid = document.createElement('div'); grid.className = 'dl-grid';
        for (const it of list) {
          const lock = k < it.km, s = g.dlSpec(it.id), price = g.dlPrice(it.id, n);
          const c = document.createElement('button'); c.type = 'button'; c.className = `dl-card ${lock ? 'lock' : ''} ${(sel || deal) === it.id ? 'sel' : ''}`;
          c.innerHTML = `<div class="dl-pic"><img alt="" src="${pic(it.id, redraw)}"></div><b>${esc(CARS[it.id].name)}</b><small>${s.cv} CV · ${fmt(s.kg)} kg</small>${zio(it.id) ? ZIO : ''}<span class="p">${lock ? 'dal km ' + it.km : '€ ' + fmt(price)}${it.id === deal ? ' ★' : ''}</span>`;
          c.addEventListener('click', () => { UI.sel = it.id; redraw(); const b = document.getElementById('placeBody'); if (b) b.scrollTo({ top: 0, behavior: 'smooth' }); });
          grid.appendChild(c);
        }
        wrap.appendChild(grid);
      }
    } else if (UI.tab === 1) {
      h4('Le tue auto');
      const p = document.createElement('p'); p.className = 'hint'; p.textContent = 'Il venditore te la valuta: conta il prezzo a nuovo, i chilometri, i danni e un terzo dei pezzi che ci hai montato. Qui puoi anche cambiare auto, come al parcheggio del motel.'; wrap.appendChild(p);
      for (const id of v.garage) {
        const st = (g.s.cars || {})[id] || {}, val = g.dlValue(id), can = g.dlCanSell(id), fin = F.find((f) => f.id === id), testing = v.test && v.test.id === id;
        const r = document.createElement('div'); r.className = 'dl-row';
        const dmg = id === g.car ? g.sim.damage : st.damage || 0;
        r.innerHTML = `<div class="dl-pic"><img alt="" src="${pic(id, redraw)}"></div><div><b>${id === g.car ? '● ' : ''}${esc(CARS[id].name)}</b><small>${fmt(st.km || 0)} km${dmg > 0.02 ? ` · carrozzeria al ${Math.round(dmg * 100)} %` : ''}${fin ? ' · in finanziamento' : ''}${testing ? ' · in prova' : ''}</small>${testing ? '' : `<small>Te la valuta <b style="color:var(--lime)">€ ${fmt(val)}</b></small>`}</div>`;
        const a = document.createElement('div'); a.className = 'dl-acts';
        if (!testing) a.appendChild(btn(`Vendi · € ${fmt(val)}`, 'buy', () => g.dlSell(id), !can.ok));
        if (id !== g.car && !testing) a.appendChild(btn('Guida questa', '', () => (window.nightRun.swapCar(id) ? { ok: true } : { ok: false, why: 'Non si può cambiare adesso' })));
        if (!can.ok && id !== g.car && !testing) { const w = document.createElement('small'); w.textContent = can.why; a.appendChild(w); }
        r.children[1].appendChild(a); wrap.appendChild(r);
      }
    } else {
      h4('Finanziamenti');
      const p = document.createElement('p'); p.className = 'hint'; p.textContent = `Anticipo del ${Math.round(DL.down * 100)} %, interessi del ${Math.round(DL.rate * 100)} %, ${DL.n} rate: una ogni ${DL.every} km, la pagano da sole dal portafoglio. Se non hai i soldi la rata salta, con il ${Math.round(DL.late * 100)} % di mora; alla ${DL.repo}ª di fila il carro attrezzi si riprende l'auto. Chiudere prima costa il ${Math.round(DL.payoff * 100)} % in meno.`;
      wrap.appendChild(p);
      if (!F.length) { const q = document.createElement('p'); q.className = 'hint'; q.textContent = 'Nessun finanziamento aperto.'; wrap.appendChild(q); }
      F.forEach((f, i) => {
        const due = Math.round((f.left * f.rata + (f.mora || 0)) * (1 - DL.payoff));
        const r = document.createElement('div'); r.className = 'dl-row';
        r.innerHTML = `<div class="dl-pic"><img alt="" src="${pic(f.id, redraw)}"></div><div><b>${esc(CARS[f.id].name)}</b><div class="dl-bar"><i style="width:${Math.round((DL.n - f.left) / DL.n * 100)}%"></i></div><small>${DL.n - f.left} rate pagate su ${DL.n} · € ${fmt(f.rata)} l'una · prossima al km ${f.next}</small>${f.miss ? `<small class="dl-warn">${f.miss} ${f.miss === 1 ? 'rata saltata' : 'rate saltate'} · mora € ${fmt(f.mora)}</small>` : ''}</div>`;
        const a = document.createElement('div'); a.className = 'dl-acts';
        a.appendChild(btn(`Chiudi ora · € ${fmt(due)}`, 'fin', () => g.dlPayoff(i), g.s.money < due));
        r.children[1].appendChild(a); wrap.appendChild(r);
      });
    }
    body.appendChild(wrap);
  }

  // ---------------------------------------------------------------- rate e prova mentre giochi
  setInterval(() => {
    const g = G(); if (!g || !g.s || !g.sim || !g.dlTick) return;
    let ev = [];
    try { ev = g.dlTick((id) => !!(window.nightRun.swapCar && window.nightRun.swapCar(id))); } catch (e) { return; }
    if (ev.some((e) => e.k !== 'rata') && window.nightRun.save) window.nightRun.save();
  }, 500);

  // auto in vetrina per la scena dell'interno: l'occasione della tappa in cui sei
  const featured = () => {
    const g = G(); if (!g || !g.inside) return null;
    const n = Math.round((g.inside.x - VG_STOP0) / VG_STEP);
    return UI.sel && !g.s.vg.garage.includes(UI.sel) ? UI.sel : g.dlDeal(n) || 'supra';
  };
  window.NightDealer = { panel, featured, pic, UI, tab(i) { UI.tab = i; if (i === 0) UI.sel = null; if (lastCtx) lastCtx.refresh(); const b = document.getElementById('placeBody'); if (b) b.scrollTo({ top: 0, behavior: 'smooth' }); } };

  // ---------------------------------------------------------------- facciata sulla strada (viaggio 2D)
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, prevTrip = S.drawTripPlace;
  S.drawTripPlace = function (g, e, x, st, near, open) {
    if (e.id !== 'dealer') return prevTrip ? prevTrip.call(this, g, e, x, st, near, open) : false;
    const C = this.C, t = st.t || 0, ink = C.ink, L = x - 168, Rr = x + 168, top = 118, gy = 216, lav = '#b69cff';
    // piazzale davanti
    g.fillStyle = '#23263a'; g.fillRect(x - 70, gy, 140, 16); g.fillStyle = '#4a5070'; g.fillRect(x - 70, gy, 140, 1);
    // fari che spazzano il cielo dagli angoli del tetto
    g.save(); g.globalCompositeOperation = 'lighter';
    for (const [bx, ph] of [[L + 12, 0], [Rr - 12, 1.7]]) {
      const a = -Math.PI / 2 + Math.sin(t * 0.5 + ph) * 0.5, len = 260, w = 0.06;
      const gr = g.createLinearGradient(bx, top, bx + Math.cos(a) * len, top + Math.sin(a) * len); gr.addColorStop(0, 'rgba(200,180,255,.22)'); gr.addColorStop(1, 'rgba(200,180,255,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(bx, top); g.lineTo(bx + Math.cos(a - w) * len, top + Math.sin(a - w) * len); g.lineTo(bx + Math.cos(a + w) * len, top + Math.sin(a + w) * len); g.closePath(); g.fill();
    }
    g.restore();
    // edificio: telaio d'acciaio e una vetrata intera
    g.fillStyle = ink; g.fillRect(L - 2, top - 2, Rr - L + 4, gy - top + 2);
    g.fillStyle = '#1b1a26'; g.fillRect(L, top, Rr - L, 20);                           // fascia del tetto
    g.fillStyle = '#2c2a3c'; g.fillRect(L, top, Rr - L, 2);
    const name = 'AUTOSALONE NOTTE', nw = this.textW(name, 2);
    this.text(g, name, Math.round(x - nw / 2), top + 5, Math.floor(t * 0.6) % 7 === 0 && (t % 1) < 0.12 ? '#6a5a9a' : lav, 2);
    this.light(g, x, top + 10, nw + 20, 16, lav, 0.08, 3);
    const gT = top + 20, gH = gy - gT;
    const gr = g.createLinearGradient(0, gT, 0, gy); gr.addColorStop(0, '#3a3456'); gr.addColorStop(0.75, '#5a4f82'); gr.addColorStop(1, '#2a2440');
    g.fillStyle = gr; g.fillRect(L, gT, Rr - L, gH);                                       // salone illuminato
    for (let q = 0; q < 6; q++) { g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(L + 20 + q * 56, gT + 2, 26, 3); }    // plafoniere
    // pavimento lucido
    g.fillStyle = '#4a4270'; g.fillRect(L, gy - 14, Rr - L, 14); for (let q = L; q < Rr; q += 16) { g.fillStyle = '#433b66'; g.fillRect(q, gy - 14, 1, 14); }
    // tre auto in vetrina (disegni del giocatore), quella in mezzo sulla pedana
    const pool = DL_SPORT.filter((id) => CARS[id] && CARS[id].sprite), h = Math.abs(Math.round(e.x)) % 97;
    const ids = [pool[h % pool.length], pool[(h + 3) % pool.length], pool[(h + 5) % pool.length]];
    [[x - 108, 0.36], [x, 0.44], [x + 108, 0.36]].forEach(([cx, k], i) => {
      const spr = this.trafficSprite && this.trafficSprite(ids[i], 'orig', k); if (!spr) return;
      const base = gy - 6, y = base - Math.round(spr.geo.wy * k + spr.geo.wr * k);
      if (i === 1) { g.fillStyle = '#2a2244'; g.beginPath(); g.ellipse(cx, base - 1, spr.width * 0.58, 4, 0, 0, 7); g.fill(); g.fillStyle = lav; g.beginPath(); g.ellipse(cx, base - 2, spr.width * 0.56, 3, 0, 0, 7); g.fill();
        for (let q = 0; q < 10; q++) { const a = t * 1.5 + q * 0.63; g.fillStyle = Math.cos(a) > 0 ? '#fff' : '#6a5a9a'; g.fillRect(Math.round(cx + Math.sin(a) * spr.width * 0.54), base - 2, 1, 1); } }
      g.drawImage(spr, Math.round(cx - spr.width / 2), y);
      if (spr.wheelImg && spr.wheelImg.width) for (const ax of spr.geo.ax) { const ww = spr.wheelImg.width * k, wh = spr.wheelImg.height * k; g.drawImage(spr.wheelImg, Math.round(cx - spr.width / 2 + ax * k - ww / 2), Math.round(y + spr.geo.wy * k - wh / 2), ww, wh); }
      g.save(); g.globalAlpha = 0.18; g.scale(1, -1); g.drawImage(spr, Math.round(cx - spr.width / 2), -(base * 2 - y) - 2); g.restore();   // riflesso sul pavimento
    });
    this.light(g, x, gy - 30, 90, 40, '#d8ccff', 0.1, 2);
    // montanti della vetrata, riflesso del vetro
    for (let q = L; q <= Rr; q += 56) { g.fillStyle = ink; g.fillRect(q - 1, gT, 3, gH); g.fillStyle = '#5a5a70'; g.fillRect(q, gT, 1, gH); }
    g.save(); g.globalAlpha = 0.07; g.fillStyle = '#fff'; for (let q = 0; q < 5; q++) { const sx = L + ((q * 83 + t * 6) % (Rr - L)); g.beginPath(); g.moveTo(sx, gT); g.lineTo(sx + 14, gT); g.lineTo(sx - 20, gy); g.lineTo(sx - 34, gy); g.fill(); } g.restore();
    // porta scorrevole
    const dW = 44, dL = x + 56 - dW / 2, oh = Math.round(dW / 2 * open);
    g.fillStyle = ink; g.fillRect(dL - 2, gy - 52, dW + 4, 52); g.fillStyle = 'rgba(230,220,255,.35)'; g.fillRect(dL, gy - 50, dW / 2 - oh, 50); g.fillRect(dL + dW / 2 + oh, gy - 50, dW / 2 - oh, 50);
    // totem con l'insegna
    const px = Rr + 28;
    g.fillStyle = ink; g.fillRect(px - 3, 62, 6, gy - 62); g.fillStyle = '#3a3a4a'; g.fillRect(px - 2, 62, 4, gy - 62);
    g.fillStyle = ink; g.fillRect(px - 26, 50, 52, 40); g.fillStyle = '#16122a'; g.fillRect(px - 24, 52, 48, 36);
    this.text(g, 'AUTO', px - Math.round(this.textW('AUTO', 2) / 2), 56, lav, 2);
    const blink = Math.floor(t * 2) % 2;
    this.text(g, 'OCCASIONI', px - Math.round(this.textW('OCCASIONI', 1) / 2), 72, blink ? '#ffd23f' : '#8a7a2a', 1);
    this.light(g, px, 70, 50, 40, lav, 0.1, 3);
    // festoni di bandierine dal totem al tetto
    for (let q = 0; q < 14; q++) {
      const f = q / 13, bx = Rr - 4 + (px - Rr + 4) * f, by = top + 2 + (58 - top + 2) * f + Math.sin(f * Math.PI) * 10;
      const col = ['#ff3b4a', '#ffd23f', '#3b9bff', '#4ade80'][q % 4], fl = Math.sin(t * 6 + q) > 0 ? 1 : 0;
      g.fillStyle = col; g.fillRect(Math.round(bx), Math.round(by), 3, 3 + fl); g.fillRect(Math.round(bx) + 1, Math.round(by) + 3 + fl, 1, 1);
    }
    this.placeTag(g, x, top - 18, 'CONCESSIONARIO', lav, near);
    return true;
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { DL, DL_CAT });
