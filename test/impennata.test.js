// Progetto impennata (impennata.js + SupraSim.impennata in sim.js, docs/fisica/IMPENNATA.md): il muso si alza solo se
// gomme, peso e motore lo permettono. Spento non cambia niente.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const file = (f) => readFileSync(new URL(f, dir), 'utf8');
const base = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'suoni.js', 'cars.js'].map(file).join('\n');
const carica = (on) => new Function(`var localStorage = { getItem: () => ${on ? "'1'" : "'0'"} };\n` + base + '\n' + file('impennata.js') + ';return { CARS, SupraSim, IMP }')();
const ON = carica(true), OFF = carica(false), NO = new Function(base + ';return { CARS }')();
const H = 1 / 1000;

function sel(c, max, extra) {
  const s = {};
  for (const k of Object.keys(c.tuning)) {
    const it = c.tuning[k].items;
    s[k] = !max || k === 'limiter' || k === 'reazione' || k === 'wheeliebar' ? it[0].id : k === 'flywheel' ? (it.find((x) => /pesante/i.test(x.id + x.name)) || it[0]).id : it[it.length - 1].id;
  }
  return Object.assign(s, extra);
}
// frizione lasciata a 3/4 del limitatore, gomme in temperatura, gas a fondo per 2 s
function partenza(E, id, max, extra, { wet = 0, wl } = {}) {
  const c = E.CARS[id], s = new E.SupraSim();
  if (c.P) s.setCar(Object.assign({}, c.P));
  const tn = c.params(sel(c, max, extra)).sim; if (wl) tn.wheelie = Object.assign({}, tn.wheelie, wl);
  s.setTune(tn); if (c.P) { s.P.fwd = !!c.fwd; s.P.rearW = c.driveW; }
  s.cfg.tc = false; s.wet = wet;
  s.setIgnition(true); for (let t = 0; t < 3; t += H) { s.setStarter(t < 1.2); s.update(H); s.events.length = 0; }
  s.tireT = (s.tune.tyre && s.tune.tyre.opt) || 90;
  s.cfg.autoClutch = false; s.in.clutch = 1; s.shift(1);
  const giri = s.P.idle + (s.P.limiter - s.P.idle) * 0.7;
  for (let t = 0; t < 1.5; t += H) { s.in.thr = s.rpm < giri ? 1 : 0.15; s.update(H); s.events.length = 0; }
  const r = { th: 0, k: 0, ev: [] };
  for (let t = 0; t < 2; t += H) {
    s.in.clutch = Math.max(0, 1 - t / 0.08); s.in.thr = 1; s.update(H);
    for (const e of s.events) r.ev.push(e.type);
    s.events.length = 0; r.th = Math.max(r.th, s.whTh || 0); r.k = Math.max(r.k, s.whK || 0);
  }
  return r;
}

test('spento: niente pezzi nuovi e parametri identici a prima', () => {
  for (const id of Object.keys(NO.CARS)) {
    const a = OFF.CARS[id], b = NO.CARS[id];
    if (!b.tuning || typeof b.params !== 'function') continue;
    assert.ok(!a.tuning.reazione && !a.tuning.wheeliebar, `${id}: pezzi dell'impennata con il progetto spento`);
    const s = sel(b, true);
    assert.equal(JSON.stringify(a.params(s)), JSON.stringify(b.params(s)), `${id}: parametri cambiati`);
  }
});

test('acceso: i pezzi ci sono solo sulle trazioni posteriori', () => {
  for (const [id, c] of Object.entries(ON.CARS)) {
    if (!c.tuning) continue;
    if (c.fwd) assert.ok(!c.tuning.reazione, `${id}: trazione anteriore con il 4-link`);
    else { assert.ok(c.tuning.reazione && c.tuning.wheeliebar, `${id}: mancano i pezzi`); assert.equal(c.params(sel(c, false)).sim.wheelie.G, 1); }
  }
});

test('una Supra di serie non ci va nemmeno vicino, la R5 preparata da drag sì', () => {
  const sup = partenza(ON, 'supra', false);
  assert.equal(sup.th, 0); assert.ok(sup.k < 0.5, `Supra di serie: ${sup.k.toFixed(2)} della spinta che serve`);
  const r5 = partenza(ON, 'r5', true, { reazione: 'drag' });
  assert.ok(r5.k > 0.9, `R5 da drag: solo ${r5.k.toFixed(2)} della spinta che serve`);
  const r5s = partenza(ON, 'r5', true);
  assert.ok(r5s.k < r5.k - 0.1, 'il 4-link deve fare la differenza');
});

test('col bagnato le gomme slittano e il muso resta giù', () => {
  const asc = partenza(ON, 'r5', true, { reazione: 'drag' }), bag = partenza(ON, 'r5', true, { reazione: 'drag' }, { wet: 1 });
  assert.equal(bag.th, 0); assert.ok(bag.k < asc.k - 0.1, `bagnato ${bag.k.toFixed(2)}, asciutto ${asc.k.toFixed(2)}`);
});

test('quando si alza: tetto della wheelie bar, del paraurti, e ricade con una botta', () => {
  // geometria esagerata per forzare il muso su: si prova solo il tetto e la ricaduta
  const sb = partenza(ON, 'r5', true, { reazione: 'drag', wheeliebar: 'si' }, { wl: { G: 3 } });
  const nb = partenza(ON, 'r5', true, { reazione: 'drag' }, { wl: { G: 3 } });
  const deg = (r) => r.th * 180 / Math.PI;
  assert.ok(deg(sb) > 1 && deg(sb) <= 2.51, `con la wheelie bar ${deg(sb).toFixed(2)}°`);
  assert.ok(deg(nb) > deg(sb) && deg(nb) <= 7.51, `senza ${deg(nb).toFixed(2)}°`);
  assert.ok(nb.ev.includes('wheelie') && nb.ev.includes('bump'), 'eventi di stacco e ricaduta');
});

test('le trazioni anteriori non si alzano mai, nemmeno con la geometria forzata', () => {
  const id = Object.keys(ON.CARS).find((x) => ON.CARS[x].fwd && ON.CARS[x].tuning);
  const r = partenza(ON, id, true, {}, { wl: { G: 3 } });
  assert.equal(r.th, 0);
});
