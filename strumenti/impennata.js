// Progetto impennata: banco di calcolo (docs/fisica/IMPENNATA.md). Per ogni auto a trazione posteriore fa delle partenze
// con la fisica vera (sim.js) e dice se il muso si alza, quanto e per quanto: di serie e preparata al massimo, con le
// barre di reazione di serie (G 1) o al massimo (G 1,6), asciutto e bagnato, frizione lasciata a giri alti.
// Uso: node strumenti/impennata.js [id,id] [--G 1.6] [--bar]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const src = 'var localStorage = { getItem: () => \'1\' };\n' + ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'suoni.js', 'cars.js', 'impennata.js'].map((f) => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
const E = new Function(src + ';return { CARS, SupraSim, IMP }')();
const args = process.argv.slice(2), solo = (args.find((a) => !a.startsWith('--') && isNaN(+a)) || '').split(',').filter(Boolean);
const H = 1 / 1000;

function selDi(c, max) {
  const sel = {};
  for (const k of Object.keys(c.tuning)) {
    const it = c.tuning[k].items;
    if (!max) { sel[k] = it[0].id; continue; }
    if (k === 'reazione' || k === 'wheeliebar') continue;
    if (k === 'flywheel') sel[k] = (it.find((x) => /pesante/i.test(x.id + x.name)) || it[0]).id;   // il volano pesante dà il colpo
    else if (k === 'limiter') sel[k] = it[0].id;
    else sel[k] = it[it.length - 1].id;
  }
  return sel;
}
function crea(id, max, rz, bar, wet, tc) {
  const s = new E.SupraSim(), c = E.CARS[id];
  if (id === 'supra') {
    s.setTune(c.params(Object.assign(selDi(c, max), { reazione: rz, wheeliebar: bar })).sim);
  } else {
    s.setCar(Object.assign({}, c.P)); s.setTune(c.params(Object.assign(selDi(c, max), { reazione: rz, wheeliebar: bar })).sim);
    s.P.fwd = !!c.fwd; s.P.rearW = c.driveW;
  }
  s.cfg.tc = !!tc; s.wet = wet ? 1 : 0;
  s.setIgnition(true); for (let t = 0; t < 3; t += H) { s.setStarter(t < 1.2); s.update(H); s.events.length = 0; }
  s.tireT = (s.tune.tyre && s.tune.tyre.opt) || 90;                 // gomme in temperatura (burnout fatto)
  return s;
}
// frizione lasciata di colpo a 3/4 del limitatore, in prima, gas a fondo per 2,5 s
function partenza(id, max, rz, bar, wet, tc) {
  const s = crea(id, max, rz, bar, wet, tc);
  s.cfg.autoClutch = false; s.in.clutch = 1; s.shift(1);
  const giri = s.P.idle + (s.P.limiter - s.P.idle) * 0.7;
  for (let t = 0; t < 1.5; t += H) { s.in.thr = s.rpm < giri ? 1 : 0.15; s.update(H); s.events.length = 0; }
  let thMax = 0, tUp = 0, aMax = 0, ev = 0, nm = 0, kMax = 0;
  for (let t = 0; t < 2.5; t += H) {
    s.in.clutch = Math.max(0, 1 - t / 0.08); s.in.thr = 1; s.update(H);
    for (const e of s.events) if (e.type === 'wheelie') ev++;
    s.events.length = 0;
    thMax = Math.max(thMax, s.whTh || 0); if ((s.whTh || 0) > 0.0017) tUp += H; aMax = Math.max(aMax, s.pz); nm = Math.max(nm, s.Tc || 0); kMax = Math.max(kMax, s.whK || 0);
  }
  return { deg: thMax * 180 / Math.PI, tUp, g: aMax / 9.81, nm, k: kMax };
}
const auto = Object.keys(E.CARS).filter((id) => E.CARS[id].tuning && E.CARS[id].tuning.reazione && (!solo.length || solo.includes(id)));
const f = (r) => (r.deg > 0.05 ? `SU ${r.deg.toFixed(1)}° ${r.tUp.toFixed(2)}s` : `no ${Math.round(r.k * 100)}%`).padEnd(13) + ` ${r.g.toFixed(2)}g`;
console.log('% = quanta della coppia che serve per alzare il muso c\'è (100 % = si alza). g = accelerazione massima');
console.log('auto       b/h  serve | di serie          | max, ponte serie   | max, 4-link        | max, 4-link drag   | drag + bar         | drag, bagnato      | drag + controllo trazione');
for (const id of auto) {
  const c = E.CARS[id], P = c.P || new E.SupraSim().P, b = P.wb * (1 - (c.driveW ?? P.rearW)), bh = b / P.cgH;
  const row = [partenza(id, false, 'oem', 'no'), partenza(id, true, 'oem', 'no'), partenza(id, true, 'link4', 'no'), partenza(id, true, 'drag', 'no'), partenza(id, true, 'drag', 'si'), partenza(id, true, 'drag', 'no', true), partenza(id, true, 'drag', 'no', false, true)];
  console.log(id.padEnd(10), bh.toFixed(2), (bh / 1.6).toFixed(2) + 'g', '|', row.map(f).join(' | '));
}
