// Prove dell'officina semplice (officina.js): livelli liberi, swap motore con il motore di un'altra auto, prezzo, sblocco, ritorno al motore di serie.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'officina.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { SupraSim, StreetGame, CARS, CAR_IDS, setActiveCar, tuningParams, offMerge, offEstimate, offSwapPrice, offSwapKm, offPreview, offSwapApply, offSwapDo, offSwapOf, offCatalog, offKgSerie, offPistoneRimborso, OFF, OFF_MOTORE, TUNING_SUPRA, TUNING_V40, getT: () => TUNING };')();

const nuovo = (car = 'v40') => {
  E.setActiveCar(car);
  const sim = new E.SupraSim(), game = new E.StreetGame(sim, () => 0.5); game.startTrip(); game.s.money = 100000; game.s.vg.firstDone = true;
  const S = { tune: {} }; for (const k in E.getT()) S.tune[k] = E.getT()[k].items[0].id;
  return { sim, game, S };
};
// come applySettings: catalogo, parametri, fisica, swap
const applica = (game, S, sim) => {
  const carId = game.car; E.setActiveCar(carId); E.offCatalog(game, carId);
  const TP = E.tuningParams(S.tune); sim.setCar(carId === 'supra' ? null : Object.assign({}, E.CARS[carId].P));
  const sw = E.offSwapApply(game, carId, TP, sim, S.tune); sim.setTune(TP.sim);
  return { TP, sw };
};

test('officina: i livelli 1 e 2 sono già sbloccati, dal 3 servono i chilometri', () => {
  const { game } = nuovo('supra');
  for (const [k, c] of Object.entries(E.getT())) c.items.forEach((it, i) => { if (i <= 2) assert.equal(game.partKm(k, it.id), 0, `${k} liv ${i}`); });
  const lim = E.getT().limiter.items; assert.ok(game.partKm('limiter', lim[3].id) > 0, 'il livello 3 vuole i km');
  assert.equal(game.partLocked('limiter', lim[1].id), false); assert.equal(game.partLocked('limiter', lim[3].id), true);
});

test('officina: swap, prezzo e sblocco da CV (sotto i 200 sempre libero, sopra servono i km)', () => {
  const e = E.offEstimate('supra'); assert.ok(e.cv > 250 && e.cv < 700, 'CV della Supra: ' + e.cv);
  const ids = E.CAR_IDS; for (const id of ids) { const x = E.offEstimate(id); assert.ok(x.cv >= 30 && x.cv < 1500 && x.nm > 30, `${id}: ${x.cv} CV ${x.nm} Nm`); }
  const { game } = nuovo('v40');
  const deboli = ids.filter((id) => E.offEstimate(id).cv <= E.OFF.liberoCv); assert.ok(deboli.length > 0);
  for (const id of deboli) assert.equal(E.offSwapKm(id), 0, id + ' libero');
  assert.ok(E.offSwapKm('supra') > 0, 'la Supra si sblocca coi km');
  assert.equal(E.offSwapPrice(game, 'supra'), Math.round((E.OFF.base + e.cv * E.OFF.euroPerCv) * game.disc() / 10) * 10);
});

test('officina: il catalogo con swap ha i pezzi del motore del donatore e i pezzi dell\'auto per il resto', () => {
  const m = E.offMerge('v40', 'supra');
  assert.ok(m.turbo.items.every((it) => it.id.startsWith('supra:')), 'turbo del donatore con id col prefisso');
  assert.equal(m.tires, E.TUNING_V40.tires, 'gomme e assetto restano dell\'auto');
  assert.equal(E.offMerge('v40', null), E.TUNING_V40); assert.equal(E.offMerge('v40', 'v40'), E.TUNING_V40);
  // un reparto che il donatore non ha resta con il solo pezzo di serie (non sparisce: altro codice lo cerca per nome)
  for (const k of E.OFF_MOTORE) if (E.TUNING_V40[k]) assert.ok(m[k] && m[k].items.length >= 1, k);
});

test('officina: montare il motore della Supra sulla V40 cambia coppia, giri, cilindri, voce e peso, ma non il cambio', () => {
  const { sim, game, S } = nuovo('v40');
  const base = applica(game, S, sim), cv0 = sim.estimatePeak().cv, gears0 = JSON.stringify(sim.P.gears), mass0 = base.TP.sim.dm || 0;
  game.s.cars[game.car] = Object.assign(game.s.cars[game.car] || {}, { km: 500 });
  const r = E.offSwapDo(game, S, 'v40', 'supra'); assert.ok(r.ok, r.why);
  assert.equal(E.offSwapOf(game, 'v40'), 'supra');
  const { TP, sw } = applica(game, S, sim), cv1 = sim.estimatePeak().cv;
  assert.ok(cv1 > cv0 * 1.8, `CV ${cv0} → ${cv1}`);
  assert.equal(TP.dsp.cyl, 6); assert.ok(TP.sim.turbo.max > 0, 'turbo della Supra');
  assert.equal(JSON.stringify(sim.P.gears), gears0, 'il cambio resta quello della V40');
  assert.ok((TP.sim.dm || 0) > mass0, 'il motore più grosso pesa di più');
  assert.ok(sw && sw.hp > 250 && /2JZ/.test(sw.tipo));
  // dopo lo swap i pezzi del motore sono quelli del donatore e si comprano e si montano come gli altri
  const t1 = E.getT().turbo.items[1].id; assert.ok(t1.startsWith('supra:'), t1);
  assert.ok(game.buy('turbo', t1).ok, 'si compra'); S.tune.turbo = t1;
  const { TP: TP2 } = applica(game, S, sim); assert.ok(sim.estimatePeak().cv > cv1, 'il turbo più grosso dà più cavalli');
  assert.ok(TP2.sim.turbo.max >= TP.sim.turbo.max);
  // rimettere quello di serie: tutto com'era
  assert.ok(E.offSwapDo(game, S, 'v40', null).ok);
  applica(game, S, sim); assert.equal(Math.round(sim.estimatePeak().cv), Math.round(cv0));
});

test('officina: lo swap si paga una volta sola, vuole i soldi e i chilometri, e i pezzi del motore tornano di serie', () => {
  const { sim, game, S } = nuovo('v40');
  game.s.money = 100; assert.equal(E.offSwapDo(game, S, 'v40', 'e30').ok, false, 'senza soldi');
  game.s.money = 100000; assert.equal(E.offSwapDo(game, S, 'v40', 'supra').ok, false, 'senza km');
  const prezzo = E.offSwapPrice(game, 'e30'), m0 = game.s.money;
  assert.ok(E.offSwapDo(game, S, 'v40', 'e30').ok); assert.equal(game.s.money, m0 - prezzo);
  E.offSwapDo(game, S, 'v40', null); const m1 = game.s.money;
  assert.ok(E.offSwapDo(game, S, 'v40', 'e30').ok); assert.equal(game.s.money, m1, 'rimontarlo è gratis');
  // dopo lo swap il turbo ecc. sono quelli del nuovo motore, di serie
  applica(game, S, sim); const m = E.getT(); for (const k of E.OFF_MOTORE) if (m[k]) assert.equal(S.tune[k], m[k].items[0].id, k);
});

test('officina: l\'anteprima di un pezzo dice quanto cambia senza montarlo', () => {
  const { game, S } = nuovo('v40');
  const cat = E.CARS.v40.tuning, stock = Object.assign({}, S.tune);
  const k = ['intake', 'cams', 'ecu'].find((x) => cat[x] && cat[x].items.length > 2) || Object.keys(cat).find((x) => cat[x].items.length > 2);
  const d = E.offPreview(game, stock, k, cat[k].items[2].id);
  assert.ok(d, 'l\'anteprima c\'è');
  assert.ok(Number.isFinite(d.dcv) && Number.isFinite(d.dnm) && Number.isFinite(d.det));
  assert.equal(stock[k], cat[k].items[0].id, 'non cambia la selezione passata');
});

test('officina: il peso del motore per lo swap (era del vecchio Pistone) resta giusto', () => {
  assert.equal(E.offKgSerie('supra'), 230); assert.equal(E.offKgSerie('v40'), 130); assert.equal(E.offKgSerie('nessuna'), 150);
  assert.equal(E.offEstimate('supra').kg, 230);
});

test('officina: chi aveva speso dal vecchio Nico riceve i soldi indietro, una volta sola', () => {
  const { game } = nuovo('v40'), m0 = game.s.money;
  game.s.vg.mot = { list: [{ id: 'm1', prezzo: 9000, sel: {} }], pz: [{ u: 'p1', cat: 'sovra', id: 'tp', dove: 'mag' }, { u: 'p2', cat: 'nessuno', id: 'x', dove: 'v40' }], liv: { blocco: 3, albero: 1 }, on: { v40: 'm1' } };
  assert.equal(E.offPistoneRimborso(game), 9000 + 2200 + 300 + 900);
  assert.equal(game.s.money, m0 + 12400); assert.equal(game.s.vg.mot, undefined);
  assert.equal(E.offPistoneRimborso(game), 0, 'una volta sola');
  const { game: g2 } = nuovo('v40'), m2 = g2.s.money; g2.s.vg.mot = { list: [{ prezzo: 5000 }] }; g2.update(1 / 60);
  assert.equal(g2.s.money >= m2 + 5000 - 1, true, 'parte da sola al primo passo della partita');
});
