// Schede tecniche delle auto (schede.js): dati veri dei motori e pezzi con personalità per ogni auto.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'cars.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
function carica() {
  let seed = 71;
  const math = Object.create(Math); math.random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  return new Function('Math', src + ';return { CARS, SCHEDE, EngineDSP, schedaTesto };')(math);
}
const { CARS, SCHEDE, EngineDSP, schedaTesto } = carica();
const ids = Object.keys(CARS), gen = ids.filter((i) => i !== 'supra' && i !== 'v40');

test('ogni auto ha la sua scheda tecnica con i dati veri', () => {
  for (const id of ids) {
    const s = SCHEDE[id];
    assert.ok(s, `manca la scheda di ${id}`);
    for (const k of ['cc', 'cil', 'disp', 'val', 'alim', 'fuel', 'hp', 'hpRpm', 'nm', 'nmRpm', 'cambio', 'trazione', 'nome']) assert.ok(s[k], `${id}: manca ${k}`);
    assert.ok(['benzina', 'diesel'].includes(s.fuel));
    assert.match(schedaTesto(id), /cc · \d cilindri/);
  }
});

test('la scheda e il gioco dicono la stessa cosa: cilindri, trazione, diesel, cambio', () => {
  for (const id of ids) {
    const s = SCHEDE[id], c = CARS[id];
    const cil = id === 'supra' ? 6 : c.cyl || 4;
    assert.equal(s.cil, cil, `${id}: cilindri della scheda ${s.cil}, nel gioco ${cil}`);
    if (id === 'supra') continue;
    assert.equal(s.trazione === 'anteriore', !!c.fwd, `${id}: trazione`);
    assert.equal(s.fuel === 'diesel', !!(c.voice && c.voice.diesel), `${id}: carburante`);
    const marce = c.P && c.P.gears ? c.P.gears.length - 1 : null;
    if (marce) assert.ok(s.cambio.includes(String(marce)), `${id}: ${marce} marce nel gioco, «${s.cambio}» nella scheda`);
  }
});

test('i motori veri: le tre auto con tre cilindri, la Panda a quattro, la 850 R a cinque, la M3 a sei', () => {
  for (const id of ['polo', 'clio', 'p308']) assert.equal(CARS[id].cyl, 3, id);
  assert.equal(CARS.panda.cyl, 4);
  assert.equal(CARS.v850.cyl, 5);
  assert.equal(CARS.e36.cyl, 6);
  assert.equal(SCHEDE.e36.cc, 2990);   // la M3 E36 è un 3.0 benzina a sei cilindri
});

test('la potenza della scheda torna con la curva di coppia del gioco (±12 %; r5 e 2002 hanno il turbo a parte)', () => {
  for (const id of gen.filter((i) => !CARS[i].turbo)) {
    const tq = CARS[id].P.tq, fr = (r) => 16 + 0.0035 * r + 0.9e-6 * r * r;
    const hp = Math.max(...tq.map(([r, t]) => (t - fr(r)) * r / 7023));
    const s = SCHEDE[id];
    assert.ok(Math.abs(hp - s.hp) / s.hp < 0.12, `${id}: scheda ${s.hp} CV, curva ${Math.round(hp)} CV`);
  }
});

test('ogni auto ha pezzi suoi: nessuna copia dello stesso elenco', () => {
  const firme = new Set();
  for (const id of gen) {
    const T = CARS[id].tuning, s = SCHEDE[id];
    const f = JSON.stringify([T.exhaust.items[1].name, T.intake.items.find((x) => x.id === 'pf').name, T.ecu.items[1].name, T.special && T.special.items.map((x) => x.name)]);   // 'pf' = l'aspirazione sua (le altre sono comuni)
    assert.ok(!firme.has(f), `${id}: catalogo uguale a quello di un'altra auto`);
    firme.add(f);
    assert.ok(T.special && T.special.items.length === (/cilindrata/i.test(T.special.label) ? 4 : 3), `${id}: manca il reparto suo`);   // dove è la cilindrata, in fondo c'è la maggiorazione +300 cc
    if (s.fuel === 'diesel') {
      assert.ok(!T.cat && !T.cams, `${id}: un diesel non ha downpipe né camme sportive`);
      assert.equal(T.ecu.items[2].sim.spark, false, `${id}: un diesel non fa scoppi`);
      assert.ok(T.ecu.items[1].sim.pw > 1.05, `${id}: la rimappatura di un diesel rende di più`);
    } else {
      assert.ok(T.cat && T.cams && T.cat.items.length === 4 && T.cams.items.length === 3, `${id}: mancano downpipe o camme`);
    }
  }
  assert.equal(firme.size, gen.length);
});

test('le auto col turbo di serie lo dicono, le aspirate no', () => {
  for (const id of ['a3', 'p308', 'clio', 'v850', 'taxi', 'doblo']) assert.notEqual(CARS[id].tuning.turbo.items[0].name, 'Aspirato', id);
  for (const id of ['panda', 'polo', 'e36']) assert.equal(CARS[id].tuning.turbo.items[0].name, 'Aspirato', id);
});

test('i pezzi nuovi fanno salire la potenza e quelli di serie non cambiano niente', () => {
  for (const id of gen) {
    const c = CARS[id], stock = c.params(c.presets[0].sel), full = c.params(c.presets.find((p) => p.id === 'full').sel);
    assert.ok(stock.sim.pw === 1, `${id}: di serie pw ${stock.sim.pw}`);
    assert.ok(full.sim.pw > stock.sim.pw, `${id}: da gara non rende di più`);
    assert.ok(Number.isFinite(full.sim.pw) && full.sim.pw < 2, `${id}: pw da gara ${full.sim.pw}`);
  }
});

test('tre cilindri: uno scoppio ogni 240° (75 al secondo a 3000 giri) e audio valido', () => {
  const dsp = new EngineDSP(48000), c = CARS.polo, sr = 48000;
  dsp.msg({ cfg: { tune: c.params(c.presets[0].sel).dsp, view: 1, vol: 0.6 }, p: { rpm: 3000, thr: 0.6, charge: 0.6, air: 0.6, running: 1 } });
  const L = new Float32Array(sr), R = new Float32Array(sr);
  dsp.render(L, R, sr);
  let fires = 0; const cycle = dsp.cycle.bind(dsp);
  dsp.cycle = (cy) => { fires++; cycle(cy); };
  dsp.render(L, R, sr);
  assert.equal(dsp.nCyl, 3);
  assert.ok(Math.abs(fires - 75) <= 2, `${fires} scoppi invece di 75`);
  for (const x of L) assert.ok(Number.isFinite(x) && Math.abs(x) <= 0.9);
});
