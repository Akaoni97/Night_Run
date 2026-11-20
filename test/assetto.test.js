// Prove dell'assetto a livelli (altezza e rigidità regolabili da Luca): catalogo, limiti per livello e risposta della fisica.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, TUNING_SUPRA, TUNING_V40, CARS, SUSP_LV, tuningItemOf, tuningParams, suspResolve, suspState, setActiveCar } =
  new Function(src + ';return { SupraSim, TUNING_SUPRA, TUNING_V40, CARS, SUSP_LV, tuningItemOf, tuningParams, suspResolve, suspState, setActiveCar };')();

const IDS = ['oem', 'springs', 'dampers', 'coilover', 'race', 'pro'];
const supraIds = ['oem', 'springs', 'dampers', 'tein', 'race', 'pro'];
const item = (cat, id) => tuningItemOf(cat, 'suspension', id);

function drive(sim, seconds, each) { for (let t = 0; t < seconds; t += 1 / 60) { each?.(sim, t); sim.update(1 / 60); sim.events.length = 0; } }
function simWith(params) {
  const sim = new SupraSim(); sim.setTune(params.sim);
  sim.setIgnition(true); drive(sim, 4, (s, t) => s.setStarter(t < 1.2));
  return sim;
}

test('assetto: sei livelli in ogni catalogo, dal 0 originale al 5', () => {
  assert.equal(SUSP_LV.length, 6);
  for (const [cat, ids] of [[TUNING_SUPRA, supraIds], [TUNING_V40, IDS], [CARS.e36.tuning, IDS]]) {
    assert.deepEqual(cat.suspension.items.map((i) => i.id), ids);
    cat.suspension.items.forEach((i, n) => assert.equal(i.susp.lv, n));
    const prezzi = cat.suspension.items.map((i) => i.price);
    assert.equal(prezzi[0], 0);
    assert.ok(prezzi.every((p, n) => n === 0 || p > prezzi[n - 1]), 'più sale il livello, più costa');
  }
});

test('assetto: il livello 0 non si regola, i livelli più alti sì e sempre più largo', () => {
  const s0 = suspState(item(TUNING_V40, 'oem'), { h: 80, k: 3 });
  assert.equal(s0.adjustable, false); assert.equal(s0.h, 0); assert.equal(s0.k, 1);
  const r0 = suspResolve(item(TUNING_V40, 'oem'), { h: -90, k: 4 });
  assert.equal(r0.susp.grip, 1); assert.equal(r0.susp.dcg, 0); assert.equal(r0.susp.cdK, 1); assert.equal(r0.low, 0);
  let prev = 0;
  for (let n = 1; n <= 5; n++) {
    const st = suspState(item(TUNING_V40, IDS[n]), null), w = (st.hMax - st.hMin) + (st.kMax - st.kMin) * 30;
    assert.ok(st.adjustable && w > prev, `il livello ${n} regola più del precedente`); prev = w;
    assert.ok(st.h0 >= st.hMin && st.h0 <= st.hMax && st.k0 >= st.kMin && st.k0 <= st.kMax, 'i valori di fabbrica stanno nei limiti');
  }
});

test('assetto: più sale il livello, più il pezzo parte basso e rigido', () => {
  let h = 1, k = 0;
  for (let n = 1; n <= 5; n++) {
    const st = suspState(item(TUNING_V40, IDS[n]), null);
    assert.ok(st.h < h || n === 1, 'più bassa'); assert.ok(st.k > k, 'più rigida'); h = st.h; k = st.k;
  }
});

test('assetto: la regolazione non esce mai dai limiti del livello', () => {
  const l1 = suspState(item(TUNING_V40, 'springs'), { h: -500, k: 99 });
  assert.equal(l1.h, SUSP_LV[1].h[0]); assert.equal(l1.k, SUSP_LV[1].k[1]);
  const l5 = suspState(item(TUNING_V40, 'pro'), { h: 500, k: -3 });
  assert.equal(l5.h, SUSP_LV[5].h[1]); assert.equal(l5.k, SUSP_LV[5].k[0]);
  assert.ok(suspState(item(TUNING_V40, 'pro'), { h: NaN, k: undefined }).h === SUSP_LV[5].h0, 'valori mancanti: quelli di fabbrica');
});

test('assetto: altezza e rigidità cambiano la fisica nel verso giusto', () => {
  const it = item(TUNING_SUPRA, 'pro'), R = (h, k) => suspResolve(it, { h, k });
  const bassa = R(-120, 3), alta = R(90, 3), dura = R(-50, 4.2), molle = R(-50, 0.5);
  assert.ok(bassa.susp.dcg < alta.susp.dcg && bassa.susp.dcg < 0, 'baricentro più basso quando è bassa');
  assert.ok(bassa.susp.cdK < 1 && alta.susp.cdK > 1, 'più bassa taglia l\'aria, più alta la prende');
  assert.ok(bassa.susp.grip > alta.susp.grip, 'più presa da bassa che da alta');
  assert.ok(bassa.low > 0 && alta.low < 0, 'si vede: bassa abbassa la scocca, alta la alza');
  assert.ok(dura.susp.pitch < molle.susp.pitch, 'dura: la cassa si muove meno');
  assert.ok(dura.susp.rough > molle.susp.rough, 'dura: le buche scuotono di più');
  assert.ok(bassa.susp.scrapeK > 0 && R(-40, 3).susp.scrapeK === 0, 'solo molto bassa tocca per terra');
  assert.ok(alta.susp.rough < R(-50, 3).susp.rough, 'alta regge meglio le strade rotte');
});

test('assetto: tuningParams porta la regolazione alla fisica e al disegno', () => {
  setActiveCar('v40');
  const sel = { ...CARS.v40.presets[0].sel, suspension: 'race' };
  const basso = tuningParams(sel, { h: -90, k: 3 }), alto = tuningParams(sel, { h: 40, k: 3 }), fab = tuningParams(sel);
  assert.ok(basso.look.low > fab.look.low && fab.look.low > alto.look.low);
  assert.ok(basso.sim.susp.dcg < alto.sim.susp.dcg);
  assert.ok(basso.sim.mu > alto.sim.mu);
  const orig = tuningParams(CARS.v40.presets[0].sel, { h: -90, k: 3 });
  assert.equal(orig.look.low, 0); assert.equal(orig.sim.susp.grip, 1);
  setActiveCar('supra');
});

test('assetto: da bassa la Supra frena e tiene meglio, da alta soffre il trasferimento di carico', () => {
  const sel = { ...CARS.supra.presets[0].sel, suspension: 'pro' };
  const brake = (adj) => {
    const sim = simWith(tuningParams(sel, adj)); sim.v = 36; sim.gear = 0; sim.we = sim.P.idle * 0.1047; sim.ww = sim.v / sim.P.r; sim.wo = sim.ww;
    const t0 = sim.v; let d = 0; for (let t = 0; t < 4 && sim.v > 1; t += 1 / 120) { sim.in.brake = 1; sim.update(1 / 120); sim.events.length = 0; d += sim.v / 120; }
    return d;
  };
  const dLow = brake({ h: -110, k: 3 }), dHigh = brake({ h: 80, k: 3 });
  assert.ok(Number.isFinite(dLow) && Number.isFinite(dHigh));
  assert.ok(dLow < dHigh, `frenata da bassa ${dLow.toFixed(1)} m, da alta ${dHigh.toFixed(1)} m`);
});

test('assetto: troppo basso il fondo tocca sugli urti e frena, a quota normale no', () => {
  const sel = { ...CARS.supra.presets[0].sel, suspension: 'pro' };
  const basso = simWith(tuningParams(sel, { h: -120, k: 3 })), normale = simWith(tuningParams(sel, { h: -30, k: 1.5 }));
  basso.v = normale.v = 30;
  let toccate = 0, mai = 0;
  for (let i = 0; i < 40; i++) { if (basso.roadBump(0.9)) toccate++; if (normale.roadBump(0.9)) mai++; basso.scrapeT = 0; }
  assert.ok(toccate > 30, `da bassissima tocca spesso (${toccate}/40)`); assert.equal(mai, 0);
  basso.bumpU = normale.bumpU = 0; basso.roadBump(0.5); normale.roadBump(0.5);
  assert.ok(basso.bumpU > 0, 'l\'assetto duro e radente fa saltellare la gomma');
  assert.ok(normale.bumpU < basso.bumpU, 'a quota normale e molle morbide scuote meno');
  // piano: la strisciata passa e la presa torna
  basso.scrapeT = 0; drive(basso, 2); assert.equal(basso.bumpU, 0); assert.equal(basso.scrapeT, 0);
});

test('assetto: da fermi in prima, la regolazione morbida carica il posteriore in partenza (trazione posteriore)', () => {
  const sel = { ...CARS.supra.presets[0].sel, suspension: 'pro' };
  const lancio = (k) => suspResolve(item(TUNING_SUPRA, 'pro'), { h: -40, k }).susp.launch;
  assert.ok(lancio(0.6) > lancio(4), 'morbida: la coda si siede e trazione posteriore ne guadagna');
  setActiveCar('v40'); const lanV = (k) => suspResolve(item(TUNING_V40, 'pro'), { h: -40, k }).susp.launch; setActiveCar('supra');
  assert.ok(lanV(3) > lanV(0.6), 'trazione anteriore: dura, il muso non si alza');
  assert.ok(sel.suspension === 'pro');
});
