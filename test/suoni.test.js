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
    citta: ['panda', 'punto', 'corsa', 'panda141', 'ax', 'twingo', 'sandero'], berlina: ['a80'], sportiva: ['a112', 'golf', 'p205', 'p206', 'williams'], tre: ['polo', 'clio', 'p308', 'aygo'],
    turbo: ['a3'], cinque: ['v850'], diesel: ['doblo', 'taxi', 'van', 'polizia', 'ambulanza'], bus: ['bus'],
  };
  for (const [fam, ids] of Object.entries(att)) for (const id of ids) {
    assert.equal(suonoFamiglia(SCHEDE[id]), fam, `${id}`);
    assert.equal(CARS[id].sound, fam, `${id}: la famiglia nel gioco`);
  }
  assert.equal(gen.length, 25);
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

test('cinque scarichi, quattro ampliamenti: ogni livello è più corto, più aperto e più forte del precedente', () => {
  for (const id of gen) {
    const it = CARS[id].tuning.exhaust.items;
    assert.deepEqual(it.map((x) => x.id), ['oem', 'terminale', 'catback', 'centrale', 'race'], id);
    const d = it.map((x) => x.dsp);
    for (let i = 1; i < d.length; i++) {
      assert.ok(typeof d[i] === 'object' && d[i].L < d[i - 1].L, `${id}: livello ${i} non più corto (${d[i].L} / ${d[i - 1].L})`);
      assert.ok(d[i].m[0][1] > d[i - 1].m[0][1], `${id}: il filtro non si apre al livello ${i}`);
      assert.ok(d[i].g > d[i - 1].g, `${id}: il livello ${i} non è più forte`);
      assert.ok(d[i].rasp >= d[i - 1].rasp && d[i].jet >= d[i - 1].jet, `${id}: il livello ${i} non è più cattivo`);
    }
  }
});

test('gli scarichi si sentono: il suono cresce di livello in livello (media su tre regimi)', () => {
  for (const id of ['panda', 'p205', 'a3', 'v40']) {
    const c = CARS[id], lim = c.P.limiter, ids = c.tuning.exhaust.items.map((x) => x.id);
    const m = ids.map((e) => { let r = 0; for (const f of [0.3, 0.5, 0.7]) { seed = 71; const d = new EngineDSP(SR); d.msg({ cfg: { tune: c.params(Object.assign({}, c.presets[0].sel, { exhaust: e })).dsp, view: 1, vol: 1, fx: {} }, p: { rpm: lim * f, thr: 0.5, charge: 0.5, air: 0.5, running: 1 } }); const L = new Float32Array(SR * 2), R = new Float32Array(SR * 2); d.render(L, R, L.length); d.render(L, R, L.length); r += rms(L); } return r / 3; });
    assert.ok(m[m.length - 1] > m[0] * 1.5, `${id}: lo scarico da gara dovrebbe suonare molto più forte dell'originale (${m.map((x) => x.toFixed(3))})`);
    for (let i = 1; i < m.length; i++) assert.ok(m[i] > m[i - 1] * 0.97, `${id}: il livello ${ids[i]} suona meno del precedente (${m.map((x) => x.toFixed(3))})`);
  }
});

test('il collettore sportivo alza il tono e lo rende più cattivo: tono, mordente e grinta crescono coi livelli', () => {
  const mis = (id, cat) => {
    const c = CARS[id], lim = c.P.limiter; let r = 0, cen = 0;
    for (const f of [0.3, 0.5, 0.7]) {
      seed = 71; const d = new EngineDSP(SR);
      d.msg({ cfg: { tune: c.params(Object.assign({}, c.presets[0].sel, { cat })).dsp, view: 1, vol: 1, fx: {} }, p: { rpm: lim * f, thr: 0.5, charge: 0.5, air: 0.5, running: 1 } });
      const L = new Float32Array(SR * 2), R = new Float32Array(SR * 2); d.render(L, R, L.length); d.render(L, R, L.length);
      r += rms(L); cen += bright(L);
    }
    return { r: r / 3, b: cen / 3 };
  };
  for (const id of ['panda', 'a3', 'v40']) {
    const ids = CARS[id].tuning.cat.items.map((x) => x.id);
    assert.deepEqual(ids, ['oem', 'sport', 'tubolare', 'decat'], id);
    const d = CARS[id].tuning.cat.items.map((x) => x.dsp);
    for (let i = 1; i < d.length; i++) for (const k of ['len', 'tone', 'bark', 'edge', 'rasp', 'jet']) {
      if (k === 'len') assert.ok(d[i].len < (d[i - 1].len || 1), `${id}: ${ids[i]} non accorcia il tubo`);
      else assert.ok(d[i][k] > (d[i - 1][k] || 0), `${id}: ${ids[i]} non aumenta ${k}`);
    }
    const m = ids.map((c) => mis(id, c));
    assert.ok(m[3].b > m[0].b * 1.12, `${id}: il suono non sale di tono (${m.map((x) => x.b.toFixed(3))})`);
    assert.ok(m[3].r > m[0].r * 1.05, `${id}: il collettore aperto non ruggisce di più (${m.map((x) => x.r.toFixed(3))})`);
    for (let i = 1; i < m.length; i++) assert.ok(m[i].b > m[i - 1].b * 0.98, `${id}: ${ids[i]} è meno acuto del livello prima (${m.map((x) => x.b.toFixed(3))})`);
  }
});

test('audio valido anche a giri alti e gas pieno, in tutte le viste', () => {
  for (const id of gen) for (const view of [0, 1, 2]) {
    const c = CARS[id], a = render(id, c.P.limiter * 0.95, 1, view);
    for (const x of a) assert.ok(Number.isFinite(x) && Math.abs(x) <= 0.95, `${id} vista ${view}`);
  }
});
