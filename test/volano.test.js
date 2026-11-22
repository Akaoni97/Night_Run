// Volano e mappa pop & bang (v0.105). Il volano è un reparto a parte dalla frizione, con quattro livelli che cambiano
// l'inerzia del motore; il pop & bang non è più una spunta del menu di pausa ma una mappa in più sulla centralina più potente.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'cars.js', 'samples.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { CARS, SupraSim, TUNING_SUPRA, TUNING_PRESETS, tuningParams, SCHEDE: typeof SCHEDE !== "undefined" ? SCHEDE : {} }')();
const H = 1 / 240;
const run = (s, sec, f) => { for (let t = 0; t < sec; t += H) { if (f && f(s, t) === false) return t; s.update(H); s.events.length = 0; } return sec; };
const cat = (id) => (id === 'supra' ? E.TUNING_SUPRA : E.CARS[id].tuning);
const params = (id, pezzi) => {
  if (id === 'supra') return E.tuningParams(Object.assign({}, E.TUNING_PRESETS[0].sel, pezzi));
  const c = E.CARS[id], sel = Object.fromEntries(Object.keys(c.tuning).map((k) => [k, c.tuning[k].items[0].id]));
  return c.params(Object.assign(sel, pezzi));
};
function crea(id, pezzi) {
  const s = new E.SupraSim();
  if (id !== 'supra') { const c = E.CARS[id]; s.setCar(Object.assign({}, c.P)); s.P.fwd = !!c.fwd; s.P.rearW = c.driveW; }
  s.setTune(params(id, pezzi).sim); s.setIgnition(true);
  let ok = 0; run(s, 4, (x) => { ok = x.running ? ok + H : 0; x.setStarter(ok < 0.4); });
  return s;
}

test('volano: reparto in ogni auto, quattro livelli in ordine, la frizione non cambia più l\'inerzia', () => {
  for (const id of Object.keys(E.CARS)) {
    const v = cat(id).flywheel;
    assert.ok(v, `${id}: manca il volano`);
    assert.deepEqual(v.items.map((i) => i.id), ['oem', 'pesante', 'leggero', 'super'], id);
    const Ie = (fl, cl) => params(id, { flywheel: fl, clutch: cl }).sim.Ie;
    const top = cat(id).clutch.items.at(-1).id;
    assert.equal(Ie('oem', top), Ie('oem', 'oem'), `${id}: la frizione da corsa non deve alleggerire il motore`);
    assert.ok(Ie('pesante', 'oem') > Ie('oem', 'oem') && Ie('oem', 'oem') > Ie('leggero', 'oem') && Ie('leggero', 'oem') > Ie('super', 'oem'), `${id}: inerzie in ordine`);
  }
});

test('volano: il pesante sale e scende di giri più piano, il superleggero molto più in fretta; minimo più basso o ballerino', () => {
  for (const id of ['e36', 'panda141', 'supra']) {
    const m = {};
    for (const fl of ['oem', 'pesante', 'super']) {
      const s = crea(id, { flywheel: fl });
      const a = []; run(s, 6, (x) => { a.push(x.rpm); }); const b = a.slice(-720), med = b.reduce((x, y) => x + y) / b.length;
      const sd = Math.sqrt(b.reduce((x, y) => x + (y - med) ** 2, 0) / b.length);
      const up = run(s, 4, (x) => { x.in.thr = 1; if (x.rpm > x.P.limiter - 200) return false; }); s.in.thr = 0;
      const dn = run(s, 6, (x) => { if (x.rpm < x.P.idle + 300) return false; });
      assert.ok(s.running, `${id} ${fl}: il motore resta acceso`);
      m[fl] = { med, sd, up, dn };
    }
    assert.ok(m.pesante.up > m.oem.up * 1.2 && m.super.up < m.oem.up * 0.75, `${id}: salita ${JSON.stringify(m)}`);
    assert.ok(m.pesante.dn > m.oem.dn * 1.2 && m.super.dn < m.oem.dn * 0.75, `${id}: discesa`);
    assert.ok(m.pesante.med < m.oem.med - 20 && m.super.med > m.oem.med + 60, `${id}: minimo ${m.pesante.med.toFixed(0)} / ${m.oem.med.toFixed(0)} / ${m.super.med.toFixed(0)}`);
    assert.ok(m.super.sd > m.oem.sd * 1.5, `${id}: col superleggero il minimo balla (${m.super.sd.toFixed(0)} contro ${m.oem.sd.toFixed(0)})`);
  }
});

test('pop & bang: solo col livello «popbang» della centralina (niente sui diesel), stessa potenza della stand-alone', () => {
  for (const id of Object.keys(E.CARS)) {
    const items = cat(id).ecu.items, dz = (E.SCHEDE[id] || {}).fuel === 'diesel';
    for (const it of items) if (it.id !== 'popbang') assert.ok(!params(id, { ecu: it.id }).sim.ecuPops, `${id}: ${it.id} non deve fare scoppi da sola`);
    if (dz) { assert.ok(!items.some((i) => i.id === 'popbang'), `${id}: un diesel non ha la mappa pop & bang`); continue; }
    assert.equal(items.at(-1).id, 'popbang', `${id}: la mappa è l'ultimo livello della centralina`);
    const pb = params(id, { ecu: 'popbang' }).sim, sa = params(id, { ecu: id === 'supra' ? 'haltech' : 'standalone' }).sim;
    assert.ok(pb.ecuPops, `${id}: con la mappa gli scoppi ci sono`);
    assert.equal(pb.pw, sa.pw, `${id}: la mappa non dà cavalli`);
    assert.equal(pb.limiter, sa.limiter, `${id}: stesso limitatore`);
  }
});

test('volano superleggero e tutto al massimo: in partenza a gas pieno la frizione automatica non fa spegnere il motore', () => {
  // prima: il TC toglieva il gas a frizione chiusa vicino al minimo e la frizione si riapriva troppo piano (una partenza su sei spenta)
  for (const id of ['v40', 'e36', 'panda141', 'golf']) for (let r = 0; r < 8; r++) {
    const c = E.CARS[id], top = Object.fromEntries(Object.keys(c.tuning).map((k) => [k, c.tuning[k].items.at(-1).id]));
    const s = crea(id, Object.assign(top, { clutch: 'oem', flywheel: 'super', limiter: 'oem' }));
    s.cfg.tc = true; s.shift(1);
    run(s, 3, (x) => { x.in.thr = 1; });
    assert.ok(s.running && s.v > 3, `${id} (prova ${r}): partenza spenta o piantata, ${(s.v * 3.6).toFixed(0)} km/h`);
  }
});
