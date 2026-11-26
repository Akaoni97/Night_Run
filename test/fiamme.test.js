// Prove delle fiamme secondo il tuning: livello dell'auto (flameTier) e tipo di fiammata (flameStyle).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['fiamme.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { flameTier, flameStyle, flameVariant, flamePalFor, FLAME_BIG_RPM } = new Function(src + ';return { flameTier, flameStyle, flameVariant, flamePalFor, FLAME_BIG_RPM };')();

const auto = (pw, max, spark, pops, extra = 1, ctl = 1) => ({ tune: { pw, turbo: { max }, sparkCut: spark, ecuPops: pops }, extraPw: extra, boostCtl: ctl });
const quote = (tier, kind, rpm) => {                          // frazione di ogni stile su una griglia fitta di numeri a caso
  const q = { torch: 0, free: 0, bang: 0, big: 0 }, N = 2000;
  for (let i = 0; i < N; i++) q[flameStyle(tier, kind, rpm, (i + 0.5) / N)]++;
  for (const k in q) q[k] /= N;
  return q;
};

test('fiamme: il livello dell\'auto va da leggero a spinto secondo pezzi e pressione', () => {
  assert.equal(flameTier(auto(1, 0, false, false), 0.25).tier, 0, 'V40 di serie');
  assert.equal(flameTier(auto(1, 0.75, false, false), 1).tier, 0, 'Supra di serie');
  assert.equal(flameTier(auto(1.04, 0.7, false, false), 0.7).tier, 1, 'V40 sleeper: medio');
  assert.equal(flameTier(auto(1.07, 1, true, true), 1.25).tier, 1, 'Supra street: medio');
  assert.equal(flameTier(auto(1.14, 1.5, true, true), 1.4).tier, 2, 'V40 full: spinto');
  assert.equal(flameTier(auto(1.1, 2.1, true, true), 1.7).tier, 2, 'Supra drag: spinto');
});

test('fiamme: la mappa del turbo sposta il livello (ECO abbassa, FORTE alza)', () => {
  const al = (ctl) => flameTier(auto(1.1, 1.5, true, true, 1, ctl), 1.1);
  assert.ok(al(0.6).score < al(1).score && al(1).score < al(1.2).score);
  assert.equal(al(1).tier, 2, 'NORMALE: spinto');
  assert.equal(al(0.6).tier, 1, 'ECO sullo stesso motore scende al medio');
  assert.equal(al(1.2).tier, 2, 'FORTE resta spinto');
});

test('fiamme: leggero = botti, medio = fiamme libere, spinto = ossidrica', () => {
  const l = quote(0, 'limiter', 0.95), m = quote(1, 'limiter', 0.95), s = quote(2, 'limiter', 0.95);
  assert.ok(l.bang > 0.75 && l.torch === 0, 'leggero: botto');
  assert.ok(m.free > 0.6 && m.free > m.torch && m.free > m.bang, 'medio: fiamma libera');
  assert.ok(s.torch > 0.6 && s.torch > s.free, 'spinto: ossidrica');
});

test('fiamme: rilascio sotto i 5.000 giri = fiamme di livello medio, sopra = una bella fiammata grossa', () => {
  assert.equal(FLAME_BIG_RPM, 5000);
  for (const t of [1, 2]) {
    const basso = quote(t, 'lift', 0.5), alto = quote(t, 'liftHigh', 0.9);
    assert.ok(basso.free > 0.75 && basso.big === 0, `livello ${t}, sotto i 5.000: fiamma libera (${basso.free.toFixed(2)})`);
    assert.ok(alto.big > 0.55 && alto.free < basso.free, `livello ${t}, sopra i 5.000: la grossa (${alto.big.toFixed(2)})`);
  }
  assert.ok(quote(2, 'liftHigh', 0.9).torch > 0.2, 'nello spinto la grossa ha anche l\'ossidrica');
  assert.ok(quote(0, 'lift', 0.5).bang > 0.8 && quote(0, 'liftHigh', 0.9).bang > 0.55, 'leggero: botti');
});

test('fiamme: ogni famiglia di fiammata esiste e le quote fanno 1', () => {
  const visti = new Set();
  for (const t of [0, 1, 2]) for (const k of ['limiter', 'lift', 'liftHigh', 'shift']) {
    const q = quote(t, k, 0.6); assert.ok(Math.abs(q.torch + q.free + q.bang + q.big - 1) < 1e-9, `${t} ${k}`);
    for (const n of Object.keys(q)) if (q[n] > 0) visti.add(n);
  }
  assert.deepEqual([...visti].sort(), ['bang', 'big', 'free', 'torch']);
  assert.ok(quote(2, 'shift', 0.6).bang > quote(2, 'limiter', 0.95).bang, 'nelle cambiate più botti che al limitatore');
});

test('fiamme: la fiamma libera ha quattro versioni e i colori seguono il livello', () => {
  for (const t of [0, 1, 2]) { const v = new Set(); for (let i = 0; i < 100; i++) v.add(flameVariant(t, i / 100)); assert.ok(v.size >= 3, `livello ${t}: ${[...v]}`); }
  const medio = new Set(), spinto = new Set();
  for (let i = 0; i < 100; i++) { medio.add(flamePalFor(1, i / 100)); spinto.add(flamePalFor(2, i / 100)); }
  assert.ok(medio.has('arancio') && medio.has('gialla'), 'il medio è arancio e giallo');
  assert.ok(spinto.has('blu') && flamePalFor(2, 0.1) === 'blu', 'lo spinto è blu');
  assert.equal(flamePalFor(0, 0.5), 'arancio');
});

// ---------------------------------------------------------------- marmitta rovente (v0.119)
const M = new Function(src + ';return { MARMITTA, marmittaPasso, marmittaRossa };')();
const tira = (tier, sec, o = {}) => {                  // secondi di gas negli ultimi giri, a passi di 1/60
  let h = 0; const n = Math.round(sec * 60);
  for (let i = 0; i < n; i++) h = M.marmittaPasso(h, 1 / 60, Object.assign({ rpm: 6200, lim: 6500, gas: 1, acceso: true, tier }, o));
  return h;
};
test('marmitta: di serie rossa da 13 s a 21 s, media da 9,5 a 15, spinta da 3 a 7', () => {
  assert.equal(M.marmittaRossa(tira(0, 12.9), 0), 0, 'di serie a 12,9 s ancora fredda');
  assert.ok(M.marmittaRossa(tira(0, 14), 0) > 0.01, 'di serie a 14 s comincia');
  assert.ok(M.marmittaRossa(tira(0, 17), 0) < 0.6, 'di serie a 17 s ancora a metà strada');
  assert.equal(M.marmittaRossa(tira(0, 21.1), 0), 1, 'di serie a 21 s incandescente');
  assert.equal(M.marmittaRossa(tira(1, 9.4), 1), 0, 'media a 9,4 s fredda');
  assert.ok(M.marmittaRossa(tira(1, 10.5), 1) > 0.01, 'media a 10,5 s comincia');
  assert.equal(M.marmittaRossa(tira(1, 15.1), 1), 1, 'media a 15 s incandescente');
  assert.equal(M.marmittaRossa(tira(2, 2.9), 2), 0, 'spinta a 2,9 s fredda');
  assert.ok(M.marmittaRossa(tira(2, 4.5), 2) > 0.1, 'spinta a 4,5 s già rossa');
  assert.ok(M.marmittaRossa(tira(2, 5.5), 2) < 0.9, 'spinta a 5,5 s non ancora al massimo');
  assert.equal(M.marmittaRossa(tira(2, 7.1), 2), 1, 'spinta a 7 s incandescente');
});
test('marmitta: sotto gli ultimi 1.500 giri, senza gas o a motore spento non si scalda; poi si raffredda piano', () => {
  assert.equal(tira(2, 10, { rpm: 4900 }), 0, 'a 4.900 giri su 6.500 niente');
  assert.equal(tira(2, 10, { gas: 0.3 }), 0, 'gas a un terzo niente');
  assert.equal(tira(2, 10, { acceso: false }), 0, 'motore spento niente');
  assert.ok(tira(2, 10, { rpm: 6500 }) > 5, 'sul limitatore sì');
  let h = tira(2, 30);
  assert.ok(h <= M.MARMITTA.picco[2] + M.MARMITTA.margine + 1e-9, 'il calore non cresce all\'infinito');
  for (let i = 0; i < 60 * 3; i++) h = M.marmittaPasso(h, 1 / 60, { rpm: 3000, lim: 6500, gas: 0.2, acceso: true, tier: 2 });
  assert.ok(M.marmittaRossa(h, 2) > 0.3, 'dopo 3 s di crociera è ancora rossa');
  for (let i = 0; i < 60 * 10; i++) h = M.marmittaPasso(h, 1 / 60, { rpm: 900, lim: 6500, gas: 0, acceso: true, tier: 2 });
  assert.equal(M.marmittaRossa(h, 2), 0, 'dopo altri 10 s è fredda');
});

// ---------------------------------------------------------------- i kit delle fiamme di Luca Tuning (v0.143)
const K = new Function(src + ';return { FIAMME_KIT, fiammeKit, fiammeMonta, fiammeScegli, fiammePal };')();
const quoteKit = (kit, kind) => { const q = { torch: 0, free: 0, bang: 0, big: 0 }, N = 2000; for (let i = 0; i < N; i++) q[K.fiammeScegli(kit, 0, kind, (i + 0.5) / N)]++; for (const k in q) q[k] /= N; return q; };
const kitDi = (id) => K.FIAMME_KIT.find((k) => k.id === id);

test('fiamme: cinque kit più «come viene», ognuno col suo nome, prezzo e testo', () => {
  assert.equal(K.FIAMME_KIT[0].id, 'serie'); assert.equal(K.FIAMME_KIT[0].prezzo, 0);
  const kit = K.FIAMME_KIT.slice(1); assert.equal(kit.length, 5);
  assert.equal(new Set(K.FIAMME_KIT.map((k) => k.id)).size, K.FIAMME_KIT.length, 'id diversi');
  for (const k of kit) { assert.ok(k.prezzo > 0 && k.nome && k.testo.length > 30 && k.w.length === 4 && k.pal, k.id); }
});

test('fiamme: si compra una volta, si monta auto per auto, «come viene» toglie il kit', () => {
  const s = { money: 2000 };
  assert.equal(K.fiammeMonta(s, 'v40', 'lancia').ok, false, 'non bastano i soldi');
  assert.equal(s.money, 2000);
  const r = K.fiammeMonta(s, 'v40', 'ossidrica'); assert.ok(r.ok); assert.equal(r.spesa, 1800); assert.equal(s.money, 200);
  assert.equal(K.fiammeKit(s, 'v40').id, 'ossidrica'); assert.equal(K.fiammeKit(s, 'panda141'), null, 'sulle altre auto no');
  assert.equal(K.fiammeMonta(s, 'panda141', 'ossidrica').spesa, 0, 'già tuo: rimontarlo è gratis'); assert.equal(s.money, 200);
  K.fiammeMonta(s, 'v40', 'serie'); assert.equal(K.fiammeKit(s, 'v40'), null);
  assert.equal(K.fiammeMonta(s, 'v40', 'ossidrica').spesa, 0, 'resta tuo anche smontato');
  assert.equal(K.fiammeMonta({ money: 0 }, 'v40', 'neon', true).ok, true, 'partita libera: gratis');
});

test('fiamme: ogni kit ha il suo carattere', () => {
  assert.ok(quoteKit(kitDi('ossidrica'), 'limiter').torch > 0.7, 'ossidrica: getto blu');
  const l = quoteKit(kitDi('lancia'), 'liftHigh'); assert.ok(l.big > 0.6 && l.bang === 0, 'lanciafiamme: grosse al rilascio alto');
  assert.ok(quoteKit(kitDi('mitraglia'), 'limiter').bang > 0.85, 'mitraglia: botti');
  for (const id of ['smeraldo', 'neon']) { const q = quoteKit(kitDi(id), 'lift'); assert.ok(q.free > 0.6 && q.torch === 0, id); }
  assert.equal(K.fiammePal(kitDi('smeraldo'), 0.5), 'verde');
  assert.equal(K.fiammePal(kitDi('neon'), 0.1), 'viola'); assert.equal(K.fiammePal(kitDi('neon'), 0.99), 'blu');
  assert.ok(['arancio', 'gialla'].includes(K.fiammePal(kitDi('lancia'), 0.7)));
  assert.equal(K.fiammePal(null, 0.5), null, 'senza kit il colore di sempre');
});

// ---------------------------------------------------------------- i caratteri delle fiamme (v0.169)
const C = new Function(src + ';return { FIAMME_TIPI, fiammaTipo, fiammaPalTipo, fiammaCopione, fiammaRnd, FIAMME_KIT };')();
const qTipo = (tier, kind, kit, ctx) => { const q = {}, N = 3000; for (let i = 0; i < N; i++) { const t = C.fiammaTipo(tier, kind, kit, ctx, (i + 0.5) / N); q[t] = (q[t] || 0) + 1 / N; } return q; };

test('fiamme: ogni carattere ha una scena con più spari ordinati nel tempo, diversa a ogni seme', () => {
  for (const tipo of C.FIAMME_TIPI.filter((t) => t !== 'torch')) {
    const a = C.fiammaCopione(tipo, 1, C.fiammaRnd(5)), b = C.fiammaCopione(tipo, 1, C.fiammaRnd(5)), c = C.fiammaCopione(tipo, 1, C.fiammaRnd(99));
    assert.ok(a && a.pops.length >= 1 && a.dur > 0.1 && a.cool > 0, tipo);
    assert.deepEqual(a, b, `${tipo}: stesso seme, stessa scena`);
    assert.notDeepEqual(a, c, `${tipo}: un altro seme, un'altra scena`);
    for (let i = 1; i < a.pops.length; i++) assert.ok(a.pops[i].t >= a.pops[i - 1].t, `${tipo}: spari in ordine`);
    for (const p of a.pops) assert.ok(p.t + p.d <= a.dur + 1e-9 && p.len > 0 && p.th > 0 && p.grow > 0 && p.detach < 1, `${tipo}: sparo dentro la scena`);
  }
  assert.equal(C.fiammaCopione('torch', 1, C.fiammaRnd(1)), null, 'l\'ossidrica resta quella di sempre');
});

test('fiamme: i caratteri hanno forme davvero diverse (lunghezza, spessore, raffica)', () => {
  const med = (tipo, f) => { let s = 0; for (let i = 0; i < 40; i++) s += f(C.fiammaCopione(tipo, 1, C.fiammaRnd(i + 1))); return s / 40; };
  const lungo = (c) => Math.max(...c.pops.map((p) => p.len)), n = (c) => c.pops.length;
  assert.ok(med('drag', lungo) > med('rally', lungo) && med('drag', lungo) > 70, 'il drag è un foglio lungo');
  assert.ok(med('drago', lungo) > med('drag', lungo), 'il lanciafiamme è più lungo di tutti');
  assert.ok(med('tuner', n) >= 2.5 && med('burble', n) >= 3.5 && med('mitraglia', n) >= 7, 'rafficata di scoppietti');
  assert.ok(med('tuner', lungo) < 30 && med('mitraglia', lungo) < 20, 'i botti sono piccoli');
  assert.ok(med('rally', (c) => Math.max(...c.pops.map((p) => p.clumps))) >= 5, 'il rally lancia grumi di fuoco');
  assert.ok(med('drag', (c) => c.pops[0].diam) >= 4 && med('race', (c) => c.pops[0].star) === 1, 'diamanti del drag e stella del botto');
  assert.ok(med('rally', (c) => c.pops[0].rag) > 0.6 && med('drag', (c) => c.pops[0].rag) < 0.2, 'il rally si spezza, il drag no');
});

test('fiamme: il carattere segue livello, momento e turbo', () => {
  const l = qTipo(0, 'lift', null, { turbo: false });
  assert.ok(l.burble > 0.7 && !l.rally && !l.drag && !l.race && !l.torch, 'di serie: solo borbottii e scoppietti');
  const s = qTipo(2, 'shift', null, { turbo: true });
  assert.ok(s.drag > 0.5, 'cambiata spinta: la fiammata da drag');
  const t = qTipo(2, 'lift', null, { turbo: true }), n = qTipo(2, 'lift', null, { turbo: false });
  assert.ok(t.rally > n.rally * 3 && t.rally > 0.4, 'l\'anti-lag da rally è roba da turbo');
  assert.ok(n.race > t.race, 'sull\'aspirato il botto secco');
  const m = qTipo(1, 'liftHigh', null, { turbo: true });
  assert.ok(m.tuner > 0.15 && m.rally > 0.2 && m.race > 0.15, 'la media ha più caratteri insieme');
  for (const tier of [0, 1, 2]) for (const k of ['limiter', 'lift', 'liftHigh', 'shift']) {
    const q = qTipo(tier, k, null, {}); assert.ok(Math.abs(Object.values(q).reduce((a, b) => a + b, 0) - 1) < 1e-6, `${tier} ${k}`);
    for (const nome of Object.keys(q)) assert.ok(C.FIAMME_TIPI.includes(nome), nome);
  }
});

test('fiamme: i kit di Luca scelgono il loro carattere e il loro colore', () => {
  const kit = (id) => C.FIAMME_KIT.find((q) => q.id === id);
  assert.ok(qTipo(0, 'liftHigh', kit('lancia'), {}).drago > 0.7, 'lanciafiamme');
  assert.ok(qTipo(0, 'limiter', kit('mitraglia'), {}).mitraglia > 0.7, 'mitraglia');
  const o = qTipo(0, 'limiter', kit('ossidrica'), {}); assert.ok(o.torch > 0.5 && o.drag > 0.3, 'ossidrica: getto e foglio blu');
  assert.equal(C.fiammaPalTipo('rally', kit('smeraldo'), 0.4), 'verde', 'il kit comanda sul colore');
  assert.equal(C.fiammaPalTipo('drag', null, 0.4), 'blu'); assert.ok(['arancio', 'gialla'].includes(C.fiammaPalTipo('rally', null, 0.4)));
});
