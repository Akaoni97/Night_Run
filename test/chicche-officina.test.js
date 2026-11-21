// Chicche dell'officina (v0.76): tetto di pressione sul FORTE e carattere dei pezzi calcolato dai dati veri.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'suoni.js', 'cars.js', 'officina.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { SupraSim, CARS, offCarattere };')();

function sim(id, sel) {
  const c = E.CARS[id], tp = c.params(Object.assign({}, c.presets[0].sel, sel));
  const s = new E.SupraSim(); s.setCar(Object.assign({}, c.P)); s.setTune(tp.sim); return { s, tp };
}

test('FORTE non supera il limite della centralina: il turbo grosso sull\'originale resta a 1,0 bar', () => {
  const { s, tp } = sim('v40', { turbo: 'big15', ecu: 'oem' });
  assert.equal(tp.sim.turbo.cap, 1.0, 'il limite della centralina arriva alla fisica');
  s.boostCtl = 1;   const norm = s.boostTop(s.tune.turbo);
  s.boostCtl = 1.2; const forte = s.boostTop(s.tune.turbo);
  assert.equal(forte, norm, `NORMALE ${norm} bar e FORTE ${forte} bar: il limite deve tenere`);
  s.boostCtl = 1; const cvN = s.estimatePeak().cv; s.boostCtl = 1.2; assert.ok(Math.abs(s.estimatePeak().cv - cvN) < 0.01, 'e i cavalli non salgono');
});

test('FORTE serve ancora quando c\'è margine: il turbo piccolo da 0,5 bar sale fino a 0,6', () => {
  const { s } = sim('v40', { turbo: 'mini05', ecu: 'oem' });
  s.boostCtl = 1; const norm = s.boostTop(s.tune.turbo); s.boostCtl = 1.2; const forte = s.boostTop(s.tune.turbo);
  assert.ok(Math.abs(norm - 0.5) < 1e-9 && Math.abs(forte - 0.6) < 1e-9, `${norm} → ${forte}`);
  s.boostCtl = 0.6; assert.ok(s.boostTop(s.tune.turbo) < norm, 'ECO resta più basso');
});

test('senza `cap` (Supra e vecchi pezzi) la mappa del turbo funziona come prima', () => {
  const s = new E.SupraSim(); s.tune.turbo.max = 0.9; delete s.tune.turbo.cap;
  s.boostCtl = 1.2; assert.ok(Math.abs(s.boostTop(s.tune.turbo) - 1.08) < 1e-9);
});

test('carattere del turbo: piccolo = Pronto, medio = Stradale, grosso = Allungo, con i giri veri', () => {
  const car = (sel, id) => E.CARS.v40.tuning.turbo.items.find((x) => x.id === id);
  const o = { lim: 6500 };
  const t = (id) => E.offCarattere('turbo', car(null, id), o);
  assert.match(t('mini05'), /^Pronto/); assert.match(t('mini05'), /entra tra 1\.?800 e 2\.?600 giri/); assert.match(t('mini05'), /fino a 0,5 bar/);
  assert.match(t('bar10'), /^Stradale/);
  assert.match(t('big15'), /^Allungo/); assert.match(t('big15'), /3\.?400/);
  assert.match(E.offCarattere('turbo', E.CARS.panda.tuning.turbo.items[0], o), /Aspirato/);
  assert.match(E.offCarattere('turbo', E.CARS.a3.tuning.turbo.items[0], o), /Turbo di serie/);
});

test('rapporto finale e cambio: i giri a 130 km/h dalla ruota e dai rapporti veri', () => {
  const c = E.CARS.panda, P = c.P, o = { r: P.r, gears: P.gears, gears0: P.gears, fd: P.fd };
  const attesi = (g, fd) => Math.round(130 / 3.6 / P.r * g * fd * 60 / (2 * Math.PI)).toLocaleString('it-IT');
  const lsd = c.tuning.final.items.find((x) => x.id === 'lsd');
  const txt = E.offCarattere('final', lsd, o);
  assert.ok(txt.includes(attesi(P.gears[P.gears.length - 1], lsd.sim.fd)), txt);
  assert.match(txt, /in 5ª/); assert.match(txt, /adesso/, 'e dice quanti erano prima');
  assert.equal(E.offCarattere('final', c.tuning.final.items[0], o).includes('adesso'), false, 'il pezzo montato non confronta con sé stesso');
  const b2 = E.CARS.b2002, ob = { r: b2.P.r, gears: b2.P.gears, gears0: b2.P.gears, fd: b2.P.fd };
  assert.match(E.offCarattere('gearbox', b2.tuning.gearbox.items[1], ob), /in 5ª/, 'il cambio a 5 marce dà la quinta');
});

test('alleggerimento: dice i chili veri, senza CV inventati', () => {
  const w = E.CARS.panda.tuning.weight.items;
  assert.equal(E.offCarattere('weight', w[0], {}), 'Peso di serie');
  assert.match(E.offCarattere('weight', w[1], {}), /\d+ kg in meno/);
  assert.equal(E.offCarattere('intake', E.CARS.panda.tuning.intake.items[1], {}), '', 'dove non c\'è niente di più da dire non scrive niente');
});
