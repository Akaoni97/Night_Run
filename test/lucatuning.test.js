// Luca Tuning (v0.91): i pezzi nuovi cambiano davvero l'auto (aspirazione, cilindrata +300 cc, turbo fino a 2 bar,
// benzina e iniettori, cambio sport e da corsa regolabili, slick da drag) e le auto di serie restano come prima.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'cars.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { CARS, CAR_IDS, SupraSim, gbState, gbGears, SCHEDE }')();
const gen = E.CAR_IDS.filter((id) => !['supra', 'v40'].includes(id) && E.CARS[id].tuning);
const serie = (c) => Object.fromEntries(Object.keys(c.tuning).map((k) => [k, c.tuning[k].items[0].id]));
function picco(id, sel, adj) {
  const c = E.CARS[id], s = new E.SupraSim(); s.setCar(Object.assign({}, c.P)); const P = c.params(sel, adj); s.setTune(P.sim);
  return { cv: s.estimatePeak().cv, nm: s.estimatePeak().nm, P, s };
}

test('aspirazione: tanta scelta e ogni filtro rende più di quello di serie', () => {
  for (const id of gen.concat('v40')) {
    const c = E.CARS[id], L = c.tuning.intake.items, base = picco(id, serie(c)).cv;
    assert.ok(L.length >= 5, `${id}: solo ${L.length} aspirazioni`);
    assert.equal(new Set(L.map((x) => x.id)).size, L.length, `${id}: aspirazioni doppie`);
    for (const it of L.slice(1)) assert.ok(picco(id, Object.assign(serie(c), { intake: it.id })).cv > base, `${id}/${it.id}: non rende di più`);
  }
});

test('cilindrata: l\'ultimo passo è sempre +300 cc e la coppia cresce con la cilindrata', () => {
  for (const id of gen.concat('v40')) {
    const c = E.CARS[id], cat = c.tuning.displacement || c.tuning.special, last = cat.items[cat.items.length - 1];
    assert.equal(last.id, 'cc300', id);
    const cc = id === 'v40' ? 1948 : E.SCHEDE[id].cc, k = (cc + 300) / cc;
    const a = picco(id, serie(c)).nm, b = picco(id, Object.assign(serie(c), { [c.tuning.displacement ? 'displacement' : 'special']: 'cc300' })).nm;
    assert.ok(b / a > k - 0.02 && b / a < k * 1.2, `${id}: coppia ×${(b / a).toFixed(3)}, attesa ×${k.toFixed(3)} (le perdite interne restano uguali: la netta cresce un filo di più)`);
  }
});

test('turbo: piccolo, grosso, biturbo, geometria variabile e 2 bar; la pressione la lasciano centralina e benzina', () => {
  for (const id of gen.concat('v40')) {
    const c = E.CARS[id], T = c.tuning.turbo.items, ids = T.map((x) => x.id);
    for (const x of ['tb_twin', 'tb_vgt', 'tb_drag']) assert.ok(ids.includes(x), `${id}: manca ${x}`);
    assert.ok(T.find((x) => x.id === 'tb_twin').sim.turbo.twin, `${id}: il biturbo non è biturbo`);
    const s0 = Object.assign(serie(c), { turbo: 'tb_drag' });
    assert.ok(c.params(s0).sim.turbo.max <= 1.5 + 1e-9, `${id}: 2 bar con la centralina di serie`);
    const full = Object.assign({}, s0, { ecu: 'standalone', fuel: 'iniettori' });
    assert.equal(c.params(full).sim.turbo.max, 2, id);
    if (c.tuning.fuel.items[0].sim.cap < 2) {                       // chi aveva già un turbo da 2 bar (il pullman) ha la benzina che li regge
      assert.ok(c.params(Object.assign({}, full, { fuel: 'oem' })).sim.turbo.max < 2, `${id}: la benzina di serie regge i 2 bar`);
      assert.ok(picco(id, full).cv > picco(id, Object.assign({}, full, { fuel: 'oem' })).cv, `${id}: gli iniettori non servono a niente`);
    }
  }
  // il piccolo tira prima del grosso
  const c = E.CARS.panda141, t = (x) => c.tuning.turbo.items.find((i) => i.id === x).sim.turbo;
  assert.ok(t('tb_basso').a < t('tb_alto').a && t('tb_vgt').a < t('tb_drag').a);
});

test('cambio sport: un rapporto per tutte le marce; da corsa: marcia per marcia, sempre in ordine', () => {
  for (const id of gen.concat('v40')) {
    const c = E.CARS[id], g0 = c.P.gears, sp = c.tuning.gearbox.items.find((x) => x.id === 'sport'), rc = c.tuning.gearbox.items.find((x) => x.id === 'race');
    const a = E.gbGears(sp, { gk: 1.1 });
    for (let i = 1; i < g0.length; i++) assert.ok(Math.abs(a[i] - g0[i] * 1.1) < 0.002, `${id}: la ghiera non sposta tutte le marce`);
    const gr = rc.gb.m0.slice(); gr[2] = 1.3;
    const b = E.gbGears(rc, { gr });
    assert.ok(Math.abs(b[1] - E.gbGears(rc, null)[1]) < 1e-9, `${id}: toccando la seconda cambia la prima`);
    for (let i = 2; i < b.length; i++) assert.ok(b[i] < b[i - 1], `${id}: la ${i}ª è più corta della ${i - 1}ª`);
    const P = picco(id, Object.assign(serie(c), { gearbox: 'race' }), { gr }).s.P;
    assert.deepEqual(P.gears, b, `${id}: la fisica non ha i rapporti regolati`);
    assert.ok(P.shiftK < (c.P.shiftK || 1), `${id}: col cambio da corsa le cambiate non sono più rapide`);
  }
});

test('slick da drag: la presa più alta di tutte, anche in frenata', () => {
  for (const id of gen.concat('v40', 'supra')) {
    const L = id === 'supra' ? new Function(src + ';return TUNING_SUPRA')().tires.items : E.CARS[id].tuning.tires.items, sl = L[L.length - 1];
    assert.equal(sl.id, 'slick', id);
    assert.ok(L.every((x) => x === sl || x.sim.mu < sl.sim.mu), `${id}: c'è una gomma con più presa`);
    assert.ok((sl.sim.tyre.brake ?? 1) >= 1, `${id}: le slick frenano peggio`);
  }
});

test('di serie non cambia niente: V40 140 CV, rapporti e cambiate di fabbrica', () => {
  const v = picco('v40', serie(E.CARS.v40));
  assert.ok(Math.abs(v.cv - 140) < 3, `V40 di serie: ${v.cv.toFixed(1)} CV`);
  assert.equal(v.P.sim.gears, null); assert.equal(v.s.P.shiftK, E.CARS.v40.P.shiftK);
  for (const id of gen) { const r = picco(id, serie(E.CARS[id])); assert.equal(r.P.sim.gears, null, id); assert.equal(r.P.sim.shiftMul, 1, id); }
});

test('intercooler da competizione: raffredda più di tutti, su ogni auto con l\'intercooler', () => {
  const sup = new Function(src + ';return TUNING_SUPRA')();
  for (const [id, T] of gen.concat('v40').map((x) => [x, E.CARS[x].tuning]).concat([['supra', sup]])) {
    const L = T.intercooler.items, r = L.find((x) => x.id === 'race');
    assert.ok(r, `${id}: manca l'intercooler da competizione`);
    assert.ok(L.every((x) => x === r || x.sim.ic.heat > r.sim.ic.heat), `${id}: c'è un intercooler che raffredda di più`);
  }
});
