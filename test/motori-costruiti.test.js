// Prove dei motori costruiti a pezzi (motori.js): calcolo, costruzione, swap su qualsiasi auto, rottura.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'motori.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const X = new Function(src + ';return { SupraSim, StreetGame, VG, VG_PATTERN, MOT, MOT_PARTI, MOT_BASE, motCalc, motApply, motKgSerie, CARS, tuningParams, setActiveCar };')();
const { SupraSim, StreetGame, VG, MOT, MOT_BASE, motCalc, motApply } = X;

const TURBO = { blocco: 'b4_20', albero: 'forg', bielle: 'h', pistoni: 'low', testata: 'v4', camme: 'sport', sovra: 'tm', iniettori: 'i750', centralina: 'prog' };
const viaggio = (soldi = 100000) => {
  const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip();
  game.trafficOn = false; game.nextRoadEvent = 1e9; game.ents = []; game.s.money = soldi;
  return { sim, game };
};
const alPistone = (game) => { let n = 0; while (VG.stop(n).id !== 'motori') n++; game.inside = { id: 'motori', x: VG.stopX(n), phase: 'shop' }; game.s.dist = VG.stopX(n); };

test('motori: il Pistone è una tappa del Viaggio (al posto del secondo bar di ogni giro)', () => {
  assert.equal(X.VG_PATTERN[4], 'motori');
  let n = 0; while (VG.stop(n).id !== 'motori') n++;
  assert.equal(VG.stop(n).name, 'Il Pistone'); assert.ok(n < 12);
});

test('motori: il calcolo coincide con la fisica (CV stimati = CV del simulatore)', () => {
  for (const sel of [MOT_BASE, TURBO, Object.assign({}, MOT_BASE, { blocco: 'b6_30', testata: 'v4p', camme: 'gara', pistoni: 'high', iniettori: 'i440', centralina: 'prog' })]) {
    const c = motCalc(sel); assert.ok(c.ok);
    const sim = new SupraSim(); sim.setCar(Object.assign({}, X.CARS.v40.P)); sim.P.tq = c.tq;
    sim.setTune({ turbo: c.turboSim || { max: 0, a: 9000, b: 9900, up: 1, down: 1, twin: false }, boostK: c.boostK, limiter: c.lim, idle: c.idle, pw: 1, camLow: 1, camHigh: 1 });
    const e = sim.estimatePeak();
    assert.ok(Math.abs(e.cv - c.hp) / c.hp < 0.03, `${c.tipo}: stima ${c.hp} CV, fisica ${Math.round(e.cv)} CV`);
  }
});

test('motori: più pezzi buoni = più CV; pezzi deboli e iniettori piccoli abbassano l\'affidabilità', () => {
  const base = motCalc(MOT_BASE), t = motCalc(TURBO);
  assert.ok(base.hp > 60 && base.hp < 110, `base ${base.hp} CV`);
  assert.ok(t.hp > base.hp * 3, `turbo ${t.hp} CV`);
  assert.ok(t.rel > 0.6, 'il turbo con bielle e pistoni forgiati regge');
  const fragile = motCalc(Object.assign({}, MOT_BASE, { blocco: 'b4_16', sovra: 'tg', centralina: 'prog', iniettori: 'i750' }));
  assert.ok(fragile.rel < 0.3 && fragile.deboli.includes('Bielle'), `turbo grande su pezzi di serie: ${Math.round(fragile.rel * 100)} %`);
  const magro = motCalc(Object.assign({}, TURBO, { iniettori: 'i250' }));
  assert.ok(magro.lean && magro.hp <= 42 * 4 + 2 && magro.rel <= 0.55, 'iniettori piccoli: la potenza si ferma e il motore soffre');
  const batte = motCalc(Object.assign({}, TURBO, { pistoni: 'high' }));
  assert.ok(batte.knock && batte.rel < t.rel, 'compressione alta col turbo: batte in testa');
  assert.equal(motCalc(Object.assign({}, TURBO, { centralina: 'serie' })).boost, 0.6, 'la centralina di serie non va oltre 0,6 bar');
  assert.equal(motCalc(Object.assign({}, TURBO, { camme: 'gara' })).cyl, 4);
  assert.equal(motCalc(Object.assign({}, TURBO, { blocco: 'b5_23' })).cyl, 5);
});

test('motori: costruire costa i pezzi; montarlo su qualsiasi auto cambia coppia, giri, cilindri, turbo e peso', () => {
  const { sim, game } = viaggio(); alPistone(game);
  const c = motCalc(TURBO), m0 = game.s.money;
  const r = game.motBuild(TURBO); assert.ok(r.ok);
  assert.equal(game.s.money, m0 - c.price);
  assert.ok(game.motMount(r.e.id).ok); assert.equal(game.s.money, m0 - c.price - MOT.lavoro);
  // come applySettings in index.html
  X.setActiveCar(game.car); const TP = X.tuningParams({}); sim.setCar(Object.assign({}, X.CARS[game.car].P));
  const kg0 = sim.P.mass, applied = motApply(game, game.car, TP, sim);
  assert.ok(applied); assert.equal(TP.dsp.cyl, 4); assert.equal(TP.sim.limiter, c.lim); assert.equal(TP.sim.turbo.max, c.boost);
  assert.deepEqual(sim.P.tq, c.tq); assert.equal(TP.sim.dm, (X.tuningParams({}).sim.dm || 0) + c.kg - X.motKgSerie(game.car));
  game.applyMass(X.tuningParams({}).sim.dm || 0); const mStock = sim.P.mass; game.applyMass(TP.sim.dm, TP.sim.rearOff);
  assert.ok(Math.abs(sim.P.mass - mStock - (c.kg - X.motKgSerie(game.car))) < 1, 'l\'auto pesa quanto il motore nuovo in più'); void kg0;
  // smontato: torna il motore di serie
  assert.ok(game.motUnmount().ok); assert.equal(motApply(game, game.car, X.tuningParams({}), sim), null);
  // fuori dal Pistone non si monta
  game.inside = null; assert.equal(game.motMount(r.e.id).ok, false);
});

test('motori: un motore al limite, tirato a gas pieno sul limitatore, prima o poi si rompe e non riparte', () => {
  const { sim, game } = viaggio(); alPistone(game);
  const fragile = Object.assign({}, MOT_BASE, { blocco: 'b4_16', sovra: 'tg', centralina: 'prog', iniettori: 'i750' });
  const r = game.motBuild(fragile); game.motMount(r.e.id); game.inside = null;
  const c = motCalc(fragile); let rotto = false;
  for (let i = 0; i < 60 * 120 && !rotto; i++) { sim.running = true; sim.we = c.lim * 0.97 / 9.5493; sim.in.thr = 1; game.motTick(1 / 60, 0); rotto = r.e.rotto; }
  assert.ok(rotto, 'si è rotto'); assert.equal(sim.running, false);
  game.motTick(0.1, 0); sim.running = true; game.motTick(0.1, 0); assert.equal(sim.running, false, 'non riparte');
  alPistone(game); const m0 = game.s.money; assert.ok(game.motRepair(r.e.id).ok); assert.ok(game.s.money < m0); assert.equal(r.e.rotto, false);
  // uno che regge non si rompe mai
  const { sim: s2, game: g2 } = viaggio(); alPistone(g2); const r2 = g2.motBuild(MOT_BASE); g2.motMount(r2.e.id); g2.inside = null;
  for (let i = 0; i < 60 * 120; i++) { s2.running = true; s2.we = motCalc(MOT_BASE).lim / 9.5493; s2.in.thr = 1; g2.motTick(1 / 60, 0); }
  assert.equal(r2.e.rotto, false);
});

test('motori: magazzino limitato, vendita e soldi che non bastano', () => {
  const { game } = viaggio(4000); alPistone(game);
  assert.equal(game.motBuild(TURBO).ok, false, 'non bastano i soldi');
  game.s.money = 1e6;
  for (let i = 0; i < MOT.maxMotori; i++) assert.ok(game.motBuild(MOT_BASE).ok);
  assert.equal(game.motBuild(MOT_BASE).ok, false, 'magazzino pieno');
  const e = game.mot().list[0], m0 = game.s.money, v = game.motValue(e);
  assert.ok(game.motSell(e.id).ok); assert.equal(game.s.money, m0 + v); assert.ok(v > 0 && v < e.prezzo);
});
