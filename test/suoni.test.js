// Famiglie di suono (suoni.js): ogni auto prende il suo suono dalla scheda del motore.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'suoni.js', 'cars.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
let seed = 71;
const math = Object.create(Math); math.random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
const { CARS, SCHEDE, EngineDSP, suonoFamiglia, SUONI_FAM } = new Function('Math', src + ';return { CARS, SCHEDE, EngineDSP, suonoFamiglia, SUONI_FAM };')(math);
const gen = Object.keys(CARS).filter((i) => CARS[i].sound);
const SR = 16000;
function render(id, rpm, thr, view = 1) {
  seed = 71;
  const c = CARS[id], dsp = new EngineDSP(SR);
  dsp.msg({ cfg: { tune: c.params(c.presets[0].sel).dsp, view, vol: 1, fx: {} }, p: { rpm, thr, charge: thr, air: thr, running: 1 } });
  const N = SR * 2, L = new Float32Array(N), R = new Float32Array(N);
  dsp.render(L, R, N); dsp.render(L, R, N);
  return L;
}
function rms(a) { return Math.sqrt(a.reduce((s, x) => s + x * x, 0) / a.length); }
// «brillantezza»: quanta energia c'è nei salti rapidi rispetto al segnale (proxy del centroide spettrale)
function bright(a) { let d = 0, e = 0; for (let i = 1; i < a.length; i++) { d += (a[i] - a[i - 1]) ** 2; e += a[i] ** 2; } return Math.sqrt(d / (e || 1)); }

test('le famiglie vengono dalla scheda del motore', () => {
  const att = {
    citta: ['panda', 'punto', 'corsa'], berlina: ['a80'], sportiva: ['a112', 'golf', 'p205', 'p206', 'williams'], tre: ['polo', 'clio', 'p308'],
    turbo: ['a3'], cinque: ['v850'], diesel: ['doblo', 'taxi', 'van', 'polizia', 'ambulanza'], bus: ['bus'],
  };
  for (const [fam, ids] of Object.entries(att)) for (const id of ids) {
    assert.equal(suonoFamiglia(SCHEDE[id]), fam, `${id}`);
    assert.equal(CARS[id].sound, fam, `${id}: la famiglia nel gioco`);
  }
  assert.equal(gen.length, 20);
  for (const f of Object.keys(att)) assert.ok(SUONI_FAM[f]);
});

test('nessuna auto ha lo stesso suono di un\'altra: voce, scarico e inerzia diversi', () => {
  const firme = new Set();
  for (const id of gen) {
    const c = CARS[id], f = JSON.stringify([c.voice, c.exStock, c.P.Ie]);
    assert.ok(!firme.has(f), `${id}: stesso suono di un'altra auto`);
    firme.add(f);
  }
});

test('i suoni si sentono davvero diversi: nessuna coppia di auto è uguale a 3000 giri', () => {
  const m = gen.map((id) => { const a = render(id, 3000, 0.6); return { id, r: rms(a), b: bright(a) }; });
  for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) {
    const dr = Math.abs(m[i].r - m[j].r) / Math.max(m[i].r, m[j].r), db = Math.abs(m[i].b - m[j].b) / Math.max(m[i].b, m[j].b);
    assert.ok(dr > 0.01 || db > 0.01, `${m[i].id} e ${m[j].id} suonano uguali (volume ${m[i].r.toFixed(3)} / ${m[j].r.toFixed(3)})`);
  }
});

test('le famiglie si distinguono: il diesel è più sordo del quattro cilindri sportivo, il tre cilindri è irregolare', () => {
  const dies = render('doblo', 4000, 0.6), sport = render('p205', 4000, 0.6);
  assert.ok(bright(dies) < bright(sport) * 0.5, 'il diesel è molto più sordo della sportiva');
  assert.ok(bright(render('panda', 4000, 0.6)) > bright(render('a80', 4000, 0.6)) * 2, 'il piccolo aspirato è più squillante della berlina');
  const media = (ids) => ids.reduce((s, i) => s + bright(render(i, 3500, 0.6)), 0) / ids.length;
  assert.notEqual(media(['doblo', 'taxi']).toFixed(4), media(['p205', 'williams']).toFixed(4));
  const tri = CARS.polo.voice, quattro = CARS.panda.voice;
  assert.ok(tri.rough > quattro.rough, 'il tricilindrico è più ruvido del piccolo quattro cilindri');
  assert.ok(CARS.doblo.voice.diesel > 0 && !CARS.panda.voice.diesel);
});

test('il comportamento cambia con la famiglia: i diesel sono più lenti a salire di giri delle sportive', () => {
  assert.ok(CARS.p205.P.Ie < CARS.panda.P.Ie, 'la sportiva è più leggera della citycar');
  assert.ok(CARS.panda.P.Ie < CARS.doblo.P.Ie, 'il diesel ha il volano più pesante');
  assert.ok(CARS.doblo.P.shiftK > CARS.p205.P.shiftK, 'il diesel cambia più piano');
});

test('gli scarichi sportivi restano della famiglia: più corti e più aperti di quello di serie', () => {
  for (const id of gen) {
    const ex = CARS[id].tuning.exhaust.items, st = ex[0].dsp, cb = ex[1].dsp, rc = ex[2].dsp;
    assert.ok(typeof st === 'object' && cb.L < st.L && rc.L < cb.L, `${id}: lunghezze ${st.L} / ${cb.L} / ${rc.L}`);
    assert.ok(rc.m[0][1] > cb.m[0][1] && cb.m[0][1] > st.m[0][1], `${id}: il filtro si apre`);
  }
});

test('audio valido anche a giri alti e gas pieno, in tutte le viste', () => {
  for (const id of gen) for (const view of [0, 1, 2]) {
    const c = CARS[id], a = render(id, c.P.limiter * 0.95, 1, view);
    for (const x of a) assert.ok(Number.isFinite(x) && Math.abs(x) <= 0.95, `${id} vista ${view}`);
  }
});
