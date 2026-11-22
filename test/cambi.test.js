// Cambi, Supra completa e compressori (v0.107).
// Cambio da corsa: di serie l'ultima tira fino a 350 km/h sulle belle sportive, 320 sulle normali, 300 sulle piccole e sui
// mezzi pesanti (al limitatore, rapporto al ponte di serie); il cambio sport con la ghiera tutta lunga arriva a 300/275/255/200.
// La Supra ha le stesse aggiunte di Luca Tuning delle altre. I compressori a cinghia non si comportano come un turbo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'cars.js', 'samples.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { CARS, SupraSim, TUNING_SUPRA, TUNING_PRESETS, tuningParams, gbGears, gbState, gbVtop, GB_VMAX, SCHEDE }')();
const H = 1 / 240;
const run = (s, sec, f) => { for (let t = 0; t < sec; t += H) { if (f && f(s, t) === false) return t; s.update(H); s.events.length = 0; } return sec; };
const cat = (id) => (id === 'supra' ? E.TUNING_SUPRA : E.CARS[id].tuning);
const Pdi = (id) => (id === 'supra' ? { limiter: 7000, r: 0.322, fd: 3.133 } : id === 'v40' ? { limiter: 6500, r: 0.308, fd: 4 } : E.CARS[id].P);
const atteso = (id) => {
  if (['bus', 'van', 'doblo', 'ambulanza'].includes(id)) return E.GB_VMAX.pesante;
  const hp = id === 'supra' ? 280 : id === 'v40' ? 140 : E.SCHEDE[id].hp;
  return hp >= 200 ? E.GB_VMAX.super : hp <= 90 ? E.GB_VMAX.piccola : E.GB_VMAX.normale;
};

test('cambio da corsa: l\'ultima al limitatore tira fino a 350 / 320 / 300 all\'ora secondo l\'auto', () => {
  for (const id of Object.keys(E.CARS)) {
    const rc = cat(id).gearbox.items.find((x) => x.id === 'race');
    assert.ok(rc, `${id}: manca il cambio da corsa`);
    const v = E.gbVtop(Pdi(id), E.gbGears(rc, null)), V = atteso(id).race;
    assert.ok(Math.abs(v - V) < 6, `${id}: ${Math.round(v)} km/h invece di ${V}`);
    const g = E.gbGears(rc, null);
    for (let i = 2; i < g.length; i++) assert.ok(g[i] < g[i - 1], `${id}: le marce del cambio da corsa sono in ordine`);
  }
  for (const id of ['supra', 'e36', 'e34']) assert.equal(atteso(id).race, 350, `${id}: è una delle belle`);
  for (const id of ['panda', 'panda141', 'twingo']) assert.equal(atteso(id).race, 300, `${id}: è una piccola`);
});

test('cambio sport: tutto lungo arriva almeno alla velocità della sua classe (il bus a 200)', () => {
  for (const id of Object.keys(E.CARS)) {
    const sp = cat(id).gearbox.items.find((x) => x.id === 'sport'), st = E.gbState(sp, null);
    const v = E.gbVtop(Pdi(id), E.gbGears(sp, { gk: st.min }));
    assert.ok(v >= atteso(id).sport - 6, `${id}: col cambio sport tutto lungo ${Math.round(v)} km/h, ne servono ${atteso(id).sport}`);
    assert.equal(st.k0, 1.06, `${id}: di serie il cambio sport resta corto`);
  }
});

test('Supra: ha aspirazioni, cilindrata, benzina e cambi regolabili come le altre, e contano davvero', () => {
  const T = E.TUNING_SUPRA;
  for (const id of ['pannello', 'cono', 'pf', 'airbox', 'cornetti']) assert.ok(T.intake.items.some((x) => x.id === id), `manca l'aspirazione ${id}`);
  assert.deepEqual(T.displacement.items.map((x) => x.id), ['oem', 'alesata', 'cc300']);
  assert.ok(T.fuel && T.fuel.items.length === 3, 'benzina e iniettori');
  const base = E.TUNING_PRESETS[0].sel, cv = (x) => { const s = new E.SupraSim(); s.setTune(E.tuningParams(Object.assign({}, base, x)).sim); return s.estimatePeak().cv; };
  const c0 = cv({});
  assert.ok(cv({ displacement: 'cc300' }) > c0 * 1.08, '+300 cc dà più cavalli');
  assert.ok(cv({ intake: 'airbox' }) > c0 * 1.02, 'l\'airbox dà più cavalli');
  assert.ok(Math.abs(cv({ turbo: 't51r', ecu: 'haltech' }) / cv({ turbo: 't51r', ecu: 'haltech', fuel: 'pompa' }) - 1) < 0.02, 'la benzina di serie regge già il T51R');
  const p = E.tuningParams(Object.assign({}, base, { gearbox: 'race' })).sim;
  assert.ok(p.shiftMul < 1 && p.gears && p.gears.length === 7, 'il cambio da corsa arriva alla fisica');
});

function sc(id) {
  const c = E.CARS[id], sel = Object.fromEntries(Object.keys(c.tuning).map((k) => [k, c.tuning[k].items[0].id]));
  Object.assign(sel, { turbo: 'sc', clutch: 'race' });
  const s = new E.SupraSim(); s.setCar(Object.assign({}, c.P)); s.setTune(c.params(sel).sim); s.P.rearW = c.driveW; s.cfg.tc = false; s.setIgnition(true);
  let ok = 0; run(s, 4, (x) => { ok = x.running ? ok + H : 0; x.setStarter(ok < 0.4); });
  s.shift(1); run(s, 30, (x) => { x.in.thr = 0.3; if (!x.shiftSeq && x.gear < 3 && x.rpm > 3000) x.shift(x.gear + 1); if (x.gear === 3 && !x.shiftSeq && x.rpm > 1800) return false; });
  return s;
}
test('compressore volumetrico: pressione piena dai bassi, niente picco, niente sfiato in rilascio', () => {
  const s = sc('golf'), B = s.boostTop(s.tune.turbo); let pk = 0, a3 = 0;
  assert.equal(s.tune.turbo.sc, 'vol');
  run(s, 10, (x) => { x.in.thr = 1; pk = Math.max(pk, x.pipeP); if (!a3 && x.rpm > 3000) a3 = x.pipeP; if (x.rpm > x.P.limiter - 200) return false; });
  assert.ok(a3 > B * 0.9, `a 3.000 giri già ${a3.toFixed(2)} bar su ${B}`);
  assert.ok(pk <= B * 1.01, `nessun picco: ${pk.toFixed(2)} bar`);
  let bov = 0; for (let t = 0; t < 0.5; t += H) { s.in.thr = 0; s.update(H); bov += s.events.filter((e) => e.type === 'bov').length; s.events.length = 0; }
  assert.equal(bov, 0, 'il bypass rimanda l\'aria in aspirazione: niente pssh');
});
test('compressore centrifugo: la pressione cresce coi giri, il massimo in cima', () => {
  const s = sc('e36'), B = s.boostTop(s.tune.turbo); let p3 = 0, p6 = 0;
  assert.equal(s.tune.turbo.sc, 'cen');
  run(s, 12, (x) => { x.in.thr = 1; if (!p3 && x.rpm > 3600) p3 = x.pipeP; if (!p6 && x.rpm > 6600) p6 = x.pipeP; if (x.rpm > x.P.limiter - 150) return false; });
  assert.ok(p6 > p3 * 2.5 && p6 > B * 0.75, `3.600 giri ${p3.toFixed(2)} bar, 6.600 giri ${p6.toFixed(2)} bar`);
});
