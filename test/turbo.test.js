// Il turbo (v0.106): fisica più vicina a quella vera e suono più udibile.
// La girante la muove l'energia dei gas di scarico (giri, aria, pressione), la wastegate apre poco prima del target e in
// ritardo (picco e assestamento), a gas parziale meno pressione, a farfalla chiusa depressione nel collettore; nel suono il
// soffio dell'aria nel compressore si sente e la valvola fa un «pssh» brillante e netto.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'cars.js', 'samples.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { CARS, SupraSim, EngineDSP, BQ }')();
const H = 1 / 240;
const run = (s, sec, f) => { for (let t = 0; t < sec; t += H) { if (f && f(s, t) === false) return t; s.update(H); s.events.length = 0; } return sec; };

function crea(pz) {
  const c = E.CARS.e36, s = new E.SupraSim(), sel = Object.fromEntries(Object.keys(c.tuning).map((k) => [k, c.tuning[k].items[0].id]));
  Object.assign(sel, { clutch: 'race' }, pz);
  s.setCar(Object.assign({}, c.P)); s.setTune(c.params(sel).sim); s.P.rearW = c.driveW; s.cfg.tc = false; s.setIgnition(true);
  let ok = 0; run(s, 4, (x) => { ok = x.running ? ok + H : 0; x.setStarter(ok < 0.4); });
  return s;
}
// in 4ª intorno a rpm0 giri col gas leggero, pronta per il gas pieno
function in4(s, rpm0) { s.shift(1); run(s, 40, (x) => { x.in.thr = 0.35; if (!x.shiftSeq && x.gear < 4 && x.rpm > 3000) x.shift(x.gear + 1); if (x.gear === 4 && !x.shiftSeq && x.rpm > rpm0) return false; }); }

test('turbo: la pressione sfora un attimo il target (wastegate in ritardo) e poi si assesta lì', () => {
  const s = crea({ turbo: 'tb_basso', ecu: 'standalone', fuel: 'iniettori' }); in4(s, 2300);
  const B = s.boostTop(s.tune.turbo); let pk = 0; const dopo = [];
  run(s, 6, (x, t) => { x.in.thr = 1; pk = Math.max(pk, x.pipeP); if (t > 3) dopo.push(x.pipeP); if (x.rpm > x.P.limiter - 300) return false; });
  const media = dopo.reduce((a, b) => a + b, 0) / dopo.length;
  assert.ok(pk > B * 1.02 && pk < B * 1.2, `picco ${pk.toFixed(2)} bar su un target di ${B.toFixed(2)}`);
  assert.ok(Math.abs(media / B - 1) < 0.08, `a regime ${media.toFixed(2)} bar: vicino al target ${B.toFixed(2)}`);
});

test('turbo: a gas parziale meno pressione, a farfalla chiusa depressione nel collettore', () => {
  const p = (thr) => { const s = crea({ turbo: 'tb_basso' }); in4(s, 3300); let a = 0, n = 0; run(s, 4, (x, t) => { x.in.thr = thr; x.in.brake = x.rpm > 3500 ? 0.25 : 0; if (t > 2.5) { a += x.pipeP; n++; } }); return a / n; };
  const pieno = p(1), meta = p(0.5), quarto = p(0.25);
  assert.ok(meta < pieno * 0.9 && quarto < meta * 0.5, `pieno ${pieno.toFixed(2)}, metà ${meta.toFixed(2)}, un quarto ${quarto.toFixed(2)} bar`);
  const s = crea({ turbo: 'tb_basso' }); run(s, 2);
  assert.ok(s.mapB < -0.35, `al minimo il manometro va sotto zero: ${s.mapB.toFixed(2)} bar`);
});

test('turbo: nello stacco breve la girante resta lanciata e la pressione torna in fretta', () => {
  const s = crea({ turbo: 'tb_basso' }); in4(s, 2300);
  run(s, 3, (x) => { x.in.thr = 1; });
  const p0 = s.pipeP; let bov = 0;
  for (let t = 0; t < 0.5; t += H) { s.in.thr = 0; s.update(H); bov += s.events.filter((e) => e.type === 'bov').length; s.events.length = 0; }
  assert.equal(bov, 1, 'mollando con la pressione la valvola sfiata una volta');
  assert.ok(s.tur > 0.5, `girante ancora lanciata: ${s.tur.toFixed(2)}`);
  const tRe = run(s, 2, (x) => { x.in.thr = 1; if (x.pipeP > p0 * 0.8) return false; });
  assert.ok(tRe < 0.5, `pressione di nuovo all'80 % in ${tRe.toFixed(2)} s`);
});

test('turbo: il turbo grosso «entra» (dal 10 al 90 % della pressione in poco), non sale a rampa coi giri', () => {
  const s = crea({ turbo: 'tb_alto', ecu: 'standalone', fuel: 'iniettori' }); in4(s, 2300);
  const B = s.boostTop(s.tune.turbo); let r10 = 0, r90 = 0;
  run(s, 20, (x) => { x.in.thr = 1; if (!r10 && x.pipeP > 0.1 * B) r10 = x.rpm; if (!r90 && x.pipeP > 0.9 * B) { r90 = x.rpm; return false; } if (x.rpm > x.P.limiter - 100) return false; });
  assert.ok(r90 > 0, 'arriva al 90 % della pressione prima del limitatore');
  assert.ok(r90 - r10 < 1500, `dal 10 al 90 % in ${Math.round(r90 - r10)} giri (${Math.round(r10)} → ${Math.round(r90)})`);
});

// ---- suono: energia di una banda su un pezzo di suono del motore audio
function suona(tune, p, sec, ev) {
  const SR = 48000, d = new E.EngineDSP(SR), B = 128, n = Math.round(sec * SR), out = new Float32Array(n), l = new Float32Array(B), r = new Float32Array(B);
  d.msg({ cfg: { tune, view: 1, vol: 1, pops: 0, fx: {} } });
  for (let i = 0; i < n; i += B) { d.msg({ p, ev: i === 0 ? ev || [] : [] }); d.render(l, r, B); out.set(l.subarray(0, Math.min(B, n - i)), i); }
  return out;
}
function banda(x, lo, hi, da = 0, a = x.length) {
  const SR = 48000, f = [new E.BQ().set('hp', lo, 0.7, SR), new E.BQ().set('lp', hi, 0.7, SR), new E.BQ().set('hp', lo, 0.7, SR), new E.BQ().set('lp', hi, 0.7, SR)];
  let s = 0; for (let i = 0; i < a; i++) { let y = x[i]; for (const q of f) y = q.p(y); if (i >= da) s += y * y; } return s / (a - da);
}

test('turbo, suono: il soffio dell\'aria nel compressore si sente a girante lanciata e cresce con la pressione', () => {
  const tune = E.EngineDSP.stock(), p0 = { rpm: 5000, charge: 1.5, air: 1, thr: 1, running: 1, speed: 25, drive: 0.5 };
  const muto = suona(Object.assign({}, tune, { tb: Object.assign({}, tune.tb, { w: 0, wh: 0 }) }), Object.assign({ turbo: 0.9, boost: 0.8 }, p0), 1);
  const piano = suona(tune, Object.assign({ turbo: 0.5, boost: 0.1 }, p0), 1), forte = suona(tune, Object.assign({ turbo: 0.95, boost: 0.9 }, p0), 1);
  const hm = banda(muto, 2500, 6000, 24000), hp = banda(piano, 2500, 6000, 24000), hf = banda(forte, 2500, 6000, 24000);
  assert.ok(hf > hm * 2, `col turbo lanciato il soffio aggiunge energia tra 2,5 e 6 kHz (${(10 * Math.log10(hf / hm)).toFixed(1)} dB)`);
  assert.ok(hf > hp * 1.5, `più girante e più pressione, più soffio (${(10 * Math.log10(hf / hp)).toFixed(1)} dB)`);
});

test('turbo, suono: la valvola in atmosfera fa un «pssh» brillante e netto, quella a ricircolo un soffio ovattato', () => {
  const base = E.EngineDSP.stock(), p = { rpm: 3000, charge: 0.3, air: 0.1, thr: 0, running: 1, turbo: 0.8, boost: 0, speed: 25 };
  const conBov = (bov) => suona(Object.assign({}, base, { bov }), p, 0.6, [{ type: 'bov', I: 1 }]);
  const atm = conBov({ v: 1, f0: 2200, sw: 900, q: 0.8, g: 0.75, chirp: 0 }), ric = conBov({ v: 0, f0: 1800, sw: 600, q: 0.7, g: 0.75, chirp: 0 });
  const senza = suona(base, p, 0.6);
  const alto = (x) => banda(x, 3000, 9000, 0, 9600), basso = (x) => banda(x, 80, 600, 0, 9600);
  assert.ok(alto(atm) > alto(senza) * 4, 'il pssh si sente sopra il motore nei primi 0,2 s');
  assert.ok(alto(atm) / basso(atm) > alto(ric) / basso(ric) * 2, 'in atmosfera è molto più brillante del ricircolo');
  // attacco netto: metà del picco del getto entro 5 ms dall'apertura
  const d = atm.map((v, i) => v - senza[i]); let pk = 0; for (let i = 0; i < 9600; i++) pk = Math.max(pk, Math.abs(d[i]));
  let t50 = 0; for (let i = 0; i < 9600; i++) if (Math.abs(d[i]) > pk * 0.5) { t50 = i / 48000; break; }
  assert.ok(t50 < 0.005, `attacco in ${(t50 * 1000).toFixed(1)} ms`);
});
