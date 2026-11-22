// Prove dei campioni audio dei pezzi (campioni.js): catalogo e file su disco, voce del pezzo montato, requisiti,
// acquisto e montaggio, flag che abbassano la sintesi (dsp.js) e i momenti in cui suonano (con un contesto audio finto).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'officina.js', 'campioni.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + `;return { EngineDSP, SupraSim, StreetGame, CARS, setActiveCar, tuningParams, offCatalog, offSwapApply, offSwapDo,
  CMP, CMP_SLOT, CMP_KIT, CMP_DIR, cmpInfo, cmpServe, cmpKitServe, cmpAuto, cmpRisolvi, cmpFx, cmpOwns, cmpPrezzo, cmpCompra, cmpMonta, cmpFiles, cmpIndiceI, CampioniPlayer, cmpVol, cmpVolSlot, cmpVolSet, CMP_VOL_MAX, getT: () => TUNING };`)();

// un'auto con dei pezzi montati: catalogo (anche con lo swap), parametri e cosa c'è sotto il cofano per i campioni
const auto = (car, pezzi = {}, swap = null) => {
  E.setActiveCar(car);
  const sim = new E.SupraSim(), game = new E.StreetGame(sim, () => 0.5); game.startTrip(); game.s.money = 100000; game.s.vg.firstDone = true;
  game.s.carId = car; if (swap) { game.s.swap = { [car]: swap }; }
  E.offCatalog(game, car);
  const S = { tune: {} }; for (const k in E.getT()) S.tune[k] = E.getT()[k].items[0].id;
  Object.assign(S.tune, pezzi);
  const TP = E.tuningParams(S.tune); sim.setCar(car === 'supra' ? null : Object.assign({}, E.CARS[car].P));
  E.offSwapApply(game, car, TP, sim, S.tune); sim.setTune(TP.sim);
  const x = E.cmpInfo(E.getT(), S.tune, TP, car);
  return { game, sim, S, TP, x, res: E.cmpRisolvi(game, car, x) };
};

// legge l'intestazione e i campioni di un WAV 16 bit mono
function wav(path) {
  const b = readFileSync(path);
  assert.equal(b.toString('ascii', 0, 4), 'RIFF'); assert.equal(b.toString('ascii', 8, 12), 'WAVE');
  let o = 12, fmt = null, data = null;
  while (o < b.length - 8) {
    const id = b.toString('ascii', o, o + 4), n = b.readUInt32LE(o + 4);
    if (id === 'fmt ') fmt = { ch: b.readUInt16LE(o + 10), sr: b.readUInt32LE(o + 12), bits: b.readUInt16LE(o + 22) };
    if (id === 'data') data = b.subarray(o + 8, o + 8 + n);
    o += 8 + n + (n & 1);
  }
  const s = new Float32Array(data.length / 2); for (let i = 0; i < s.length; i++) s[i] = data.readInt16LE(i * 2) / 32768;
  return { ...fmt, s, dur: s.length / fmt.sr };
}

test('campioni: ogni kit ha i suoi file su disco (e niente file avanzati), nomi, note e prezzi', () => {
  const slots = new Set(E.CMP_SLOT.map((s) => s.id)), root = new URL(E.CMP_DIR, dir);
  for (const [id, K] of Object.entries(E.CMP_KIT)) {
    assert.ok(slots.has(K.slot), id + ': componente');
    assert.ok(K.nome && K.nota && K.nota.length > 30 && /Verdetto/.test(K.nota), id + ': nome e nota da critico');
    assert.ok(Number.isFinite(K.prezzo) && K.prezzo >= 0 && K.prezzo <= 2000, id + ': prezzo');
    const files = E.cmpFiles(id); assert.ok(files.length > 0, id + ': file');
    const disk = readdirSync(new URL(id + '/', root)).filter((f) => f.endsWith('.wav')).map((f) => f.slice(0, -4)).sort();
    assert.deepEqual(disk, files.slice().sort(), id + ': i file del catalogo sono quelli della cartella');
  }
  for (const s of slots) assert.ok(Object.values(E.CMP_KIT).filter((K) => K.slot === s).length >= 2, s + ': almeno due kit per componente');
  const n = Object.keys(E.CMP_KIT).reduce((a, id) => a + E.cmpFiles(id).length, 0);
  assert.ok(n >= 150, 'tanti campioni: ' + n);
});

test('campioni: i WAV sono puliti (mono 16 bit, livello giusto, niente buchi), gli anelli si richiudono senza scatto', () => {
  let byte = 0;
  for (const id of Object.keys(E.CMP_KIT)) for (const f of E.cmpFiles(id)) {
    const p = new URL(E.CMP_DIR + id + '/' + f + '.wav', dir); byte += statSync(p).size;
    const w = wav(p);
    assert.equal(w.ch, 1, id + '/' + f + ' mono'); assert.equal(w.bits, 16); assert.ok(w.sr === 32000 || w.sr === 24000, 'frequenza ' + w.sr);
    let pk = 0, nan = false; for (const v of w.s) { if (!Number.isFinite(v)) nan = true; pk = Math.max(pk, Math.abs(v)); }
    assert.ok(!nan && pk > 0.05 && pk < 0.91, `${id}/${f}: picco ${pk}`);
    if (f === 'loop') {
      assert.ok(Math.abs(w.dur - 2) < 0.001, id + ' anello da 2 s');
      const a = w.s, n = a.length, d = Math.abs(a[0] - a[n - 1]), step = (() => { let m = 0; for (let i = 1; i < n; i++) m = Math.max(m, Math.abs(a[i] - a[i - 1])); return m; })();
      assert.ok(d <= step * 1.05 + 1e-3, `${id}: la giunta (${d.toFixed(3)}) non è più grande del passo normale (${step.toFixed(3)})`);
    } else {
      assert.ok(w.dur > 0.05 && w.dur < 3, `${id}/${f}: durata ${w.dur}`);
      assert.ok(Math.abs(w.s[0]) < 0.05 && Math.abs(w.s[w.s.length - 1]) < 0.02, `${id}/${f}: niente click agli estremi`);
    }
  }
  assert.ok(byte < 16e6, 'non pesano troppo: ' + (byte / 1e6).toFixed(1) + ' MB');
});

test('campioni: la voce del pezzo arriva da sola montando pezzi non di serie (e niente sulle auto di serie)', () => {
  const st = auto('supra');
  assert.ok(Object.values(st.res).every((v) => v === null), 'Supra di serie: solo la sintesi ' + JSON.stringify(st.res));
  assert.equal(auto('supra', { bov: 'none' }).res.valvola, 'valvola/stututu');
  assert.equal(auto('supra', { bov: 'ssqv' }).res.valvola, 'valvola/trombetta');
  assert.equal(auto('supra', { bov: 'raceport' }).res.valvola, 'valvola/pssh_grossa');
  const t51 = auto('supra', { turbo: 't51r', wastegate: 'tial' });
  assert.equal(t51.res.turbo, 'turbo/sirena'); assert.equal(t51.res.wastegate, 'wastegate/screamer', 'single turbo con la screamer');
  assert.equal(auto('supra', { wastegate: 'tial' }).res.wastegate, null, 'col biturbo di serie la wastegate esterna non c\'è');
  assert.equal(auto('supra', { exhaust: 'straight' }).res.scarico, 'scarico/pentola');
  assert.equal(auto('supra', { exhaust: 'tomei' }).res.scarico, 'scarico/titanio');
  assert.equal(auto('supra', { ecu: 'haltech' }).res.mappa, 'mappa/crackle');
  assert.equal(auto('supra', { limiter: '3step' }).res.limitatore, 'limitatore/fucilata');
  assert.equal(auto('supra', { limiter: 'stutter' }).res.limitatore, 'limitatore/stutter');
  assert.equal(auto('supra', { gearbox: 'close' }).res.cambio, 'cambio/denti_dritti');
  const v40 = auto('v40', { turbo: 'td04', intake: 'pf' });
  assert.equal(v40.res.valvola, 'valvola/pssh'); assert.equal(v40.res.turbo, 'turbo/fischio'); assert.equal(v40.res.aspirazione, 'aspirazione/fungo');
  assert.equal(auto('v40', { turbo: 'big15' }).res.turbo, 'turbo/ululato');
  assert.equal(auto('v40', { gearbox: 'drag' }).res.cambio, 'cambio/sequenziale', 'cambio da drag: innesti frontali');
  assert.equal(auto('v40', { exhaust: 'turboback' }).res.scarico, 'scarico/scoppiettio');
  assert.equal(auto('e30', { turbo: 'sc' }).res.compressore, 'compressore/centrifugo');
  assert.equal(auto('e30', { turbo: 'sc' }).res.valvola, null, 'il compressore non porta la valvola da sola');
  assert.equal(auto('e30', { intake: 'pf' }).res.aspirazione, 'aspirazione/cornetti', 'farfalle singole della M3');
  assert.equal(auto('panda', { turbo: 'sc' }).res.compressore, 'compressore/volumetrico');
  assert.equal(auto('e36', { exhaust: 'catback' }).res.scarico, 'scarico/gorgoglio', 'sei in linea');
  const taxi = auto('taxi', { exhaust: 'catback' });
  assert.equal(taxi.res.scarico, null); assert.match(E.cmpServe('scarico', taxi.x), /diesel/);
});

test('campioni: con lo swap contano i pezzi del motore del donatore (id col prefisso)', () => {
  const a = auto('v40', { turbo: 'supra:t51r', exhaust: 'supra:straight', ecu: 'supra:haltech' }, 'supra');
  assert.equal(a.res.turbo, 'turbo/sirena'); assert.equal(a.res.scarico, 'scarico/pentola'); assert.equal(a.res.mappa, 'mappa/crackle');
  assert.equal(a.res.valvola, 'valvola/pssh', 'la V40 non ha il reparto valvola: col turbo nuovo arriva lo sfiato in aria');
  assert.equal(auto('v40', {}, 'supra').res.turbo, null, 'il biturbo di serie della Supra non porta un fischio in più');
});

test('campioni: requisiti, acquisto una volta per tutte le auto, montaggio, spento, voce del pezzo gratis', () => {
  const a = auto('v40', { turbo: 'td04' });
  const g = a.game, x = a.x;
  assert.ok(E.cmpServe('compressore', x), 'senza compressore niente fischio dei rotori');
  assert.match(E.cmpServe('spurgo', x), /launch/);
  assert.ok(E.cmpOwns(g, 'valvola/pssh', x), 'la voce del pezzo arriva col pezzo');
  assert.equal(E.cmpPrezzo(g, 'valvola/pssh', x), 0);
  assert.equal(E.cmpOwns(g, 'valvola/stututu', x), false);
  const soldi = g.s.money, p = E.cmpPrezzo(g, 'valvola/stututu', x);
  assert.ok(p > 0);
  assert.equal(E.cmpMonta(g, 'v40', 'valvola', 'valvola/stututu', x).ok, true);
  assert.equal(g.s.money, soldi - p, 'pagato una volta');
  assert.equal(E.cmpRisolvi(g, 'v40', x).valvola, 'valvola/stututu');
  assert.equal(E.cmpMonta(g, 'v40', 'valvola', 'valvola/stututu', x).paid, 0, 'la seconda volta è gratis');
  assert.deepEqual(E.cmpFx(E.cmpRisolvi(g, 'v40', x)), { valv: 1, turb: 1, bur: 0 });
  assert.equal(E.cmpMonta(g, 'v40', 'valvola', 'off', x).ok, true); assert.equal(E.cmpRisolvi(g, 'v40', x).valvola, null, 'spento');
  assert.equal(E.cmpMonta(g, 'v40', 'valvola', 'auto', x).ok, true); assert.equal(E.cmpRisolvi(g, 'v40', x).valvola, 'valvola/pssh', 'di nuovo la voce del pezzo');
  assert.equal(E.cmpMonta(g, 'v40', 'valvola', 'turbo/fischio', x).ok, false, 'un kit va solo sul suo componente');
  const mezzo = E.cmpMonta(g, 'v40', 'compressore', 'compressore/vite', x); assert.equal(mezzo.ok, false); assert.match(mezzo.why, /compressore/);
  // tolto il turbo il kit resta comprato ma tace (niente valvola senza pressione)
  E.cmpMonta(g, 'v40', 'valvola', 'valvola/stututu', x);
  const na = auto('v40'); na.game.s.cmp = g.s.cmp; assert.equal(E.cmpRisolvi(na.game, 'v40', na.x).valvola, null);
  // l'anti-lag vuole i km e un turbo vero
  const r = E.cmpCompra(g, 'mappa/antilag', x); assert.equal(r.ok, false); assert.match(r.why, /km/);
  assert.match(E.cmpKitServe('mappa/antilag', auto('e30', { turbo: 'sc', ecu: 'standalone' }).x) || '', /turbo|mappa/);
  // soldi che non bastano, gioco libero che ha tutto
  g.s.money = 10; assert.equal(E.cmpCompra(g, 'valvola/gufo', x).ok, false);
  g.mode = 'free'; assert.ok(E.cmpOwns(g, 'valvola/gufo', x)); assert.equal(E.cmpPrezzo(g, 'valvola/gufo', x), 0);
  // da fermi
  g.mode = 'career'; g.sim.v = 20; assert.equal(E.cmpMonta(g, 'v40', 'valvola', 'off', x).ok, false);
});

test('campioni: senza flag la sintesi resta com\'era; coi campioni si abbassano valvola, fischio e borbottio', () => {
  const d = new E.EngineDSP(48000);
  d.msg({ cfg: { tune: E.EngineDSP.stock(), view: 1, vol: 1, fx: {} } });
  assert.deepEqual([d.fxB, d.fxT, d.fxS, d.burK], [1, 1, 1, 1]);
  d.msg({ cfg: { fx: { valv: 1, turb: 1, bur: 1 } } });
  assert.deepEqual([d.fxB, d.fxT, d.fxS, d.burK], [0, 0.45, 0, 0.35]);
  d.msg({ cfg: { fx: { bov: 1, turbo: 1 } } });
  assert.deepEqual([d.fxB, d.fxT, d.fxS, d.burK], [0, 0.25, 0, 1], 'i campioni dell\'utente come prima');
  const L = new Float32Array(256), R = new Float32Array(256); d.render(L, R, 256); assert.ok(L.every(Number.isFinite));
});

test('campioni: intensità della valvola → colpo graduato', () => {
  assert.equal(E.cmpIndiceI(0.45, 4, 0.5), 1); assert.equal(E.cmpIndiceI(1.2, 4, 0.5), 4); assert.equal(E.cmpIndiceI(0.8, 4, 0.5), 2);
  for (let I = 0.3; I < 1.4; I += 0.05) for (const r of [0.1, 0.5, 0.9]) { const k = E.cmpIndiceI(I, 4, r); assert.ok(k >= 1 && k <= 4); }
});

// ---- contesto audio finto: conta i colpi e guarda gli anelli
function finto() {
  const P = () => ({ value: 0, setTargetAtTime(v) { this.value = v; }, setValueAtTime(v) { this.value = v; }, linearRampToValueAtTime(v) { this.value = v; }, cancelScheduledValues() {} });
  const nodo = () => ({ gain: P(), frequency: P(), Q: P(), type: '', connect(n) { return n; }, disconnect() {} });
  const ctx = { currentTime: 0, sampleRate: 48000, state: 'running',
    createGain: nodo, createBiquadFilter: nodo, createConvolver: () => ({ buffer: null, connect(n) { return n; } }),
    createWaveShaper: () => ({ curve: null, oversample: 'none', connect(n) { return n; } }),
    createBuffer: (c, n, sr) => ({ duration: n / sr, getChannelData: () => new Float32Array(n) }),
    createBufferSource: () => ({ buffer: null, loop: false, playbackRate: P(), connect(n) { return n; }, start() { this.on = true; }, stop() { this.on = false; } }) };
  return ctx;
}
function player(res, info) {
  const ctx = finto(), pl = new E.CampioniPlayer(ctx, { connect() {} });
  pl.load = () => Promise.resolve();                                   // niente rete: i file "ci sono già"
  for (const id of Object.values(res).filter(Boolean)) for (const f of E.cmpFiles(id)) pl.buf[pl.url(id, f)] = { duration: f === 'loop' ? 2 : 0.6 };
  pl.setKits(res, info);
  const colpi = []; const sh = pl.shot.bind(pl); pl.shot = (slot, id, f, g, o) => { const d = sh(slot, id, f, g, o); if (d) colpi.push({ slot, id, f, g, t: ctx.currentTime }); return d; };
  return { ctx, pl, colpi };
}
const simFinta = (o = {}) => Object.assign({ running: true, rpm: 3000, thr: 0, cut: 0, v: 20, tur: 0, wg: 0, gear: 3, ww: 60, ratio: () => 4, ovr: 0, cfg: { pops: true }, shiftSeq: null, launchArmed: false }, o);
const passi = (P, sim, sec, fn, ev = () => []) => { const dt = 1 / 60; for (let t = 0; t < sec; t += dt) { if (fn) fn(sim, t); P.pl.tick(sim, ev(t), dt, { view: 1, env: 0, vol: 0.8, exh: 1 }); P.ctx.currentTime += dt; } };

test('campioni: valvola sul pssh della fisica, borbottio quando molli, botti della mappa, limitatore, aspirazione, spurgo, cambio', () => {
  // il caso del lettore (botti a caso nel rilascio) con un seme fisso: la prova dà sempre lo stesso risultato (prima 1 volta su ~30 zero botti)
  const rnd0 = Math.random; let seme = 12345; Math.random = () => ((seme = (seme * 1103515245 + 12345) % 2147483648) / 2147483648);
  try {
  const res = { valvola: 'valvola/stututu', scarico: 'scarico/borbottio', mappa: 'mappa/pop_bang', limitatore: 'limitatore/colpi', aspirazione: 'aspirazione/fungo', spurgo: 'spurgo/classico', cambio: 'cambio/sequenziale', wastegate: 'wastegate/screamer', turbo: 'turbo/sibilo' };
  const P = player(res, { spark: true });
  const s = simFinta();
  // valvola: un evento bov forte → il colpo più forte (4) e la wastegate che sbatte
  passi(P, s, 0.1, null, (t) => (t === 0 ? [{ type: 'bov', I: 1.2 }] : []));
  const v = P.colpi.filter((c) => c.slot === 'valvola'); assert.equal(v.length, 1); assert.ok(['3', '4'].includes(v[0].f), 'colpo forte: ' + v[0].f);
  assert.ok(P.colpi.some((c) => c.slot === 'wastegate' && /^chatter/.test(c.f)));
  // rilascio da 5000 giri: raffiche di borbottio e qualche botto, poi ridando gas si zittiscono
  P.colpi.length = 0;
  passi(P, s, 3, (q, t) => { q.cut = 1; q.thr = 0; q.ovr = t; q.rpm = 5000 - 800 * t; });
  const bur = P.colpi.filter((c) => c.slot === 'scarico').length, pop = P.colpi.filter((c) => c.slot === 'mappa').length;
  assert.ok(bur >= 3 && bur <= 14, 'raffiche di borbottio: ' + bur); assert.ok(pop >= 1, 'botti della mappa: ' + pop);
  // molli sotto i 2200 giri: niente borbottio
  P.colpi.length = 0; s.cut = 0; s.thr = 0.3; s.rpm = 1900; passi(P, s, 0.2);
  passi(P, s, 2, (q, t) => { q.cut = 1; q.thr = 0; q.ovr = t; q.rpm = 1900; });
  assert.equal(P.colpi.filter((c) => c.slot === 'scarico').length, 0, 'dai bassi giri il rilascio è muto');
  // senza mappa pop & bang accesa la centralina tace
  P.colpi.length = 0; s.cut = 0; s.thr = 0.8; s.rpm = 6000; passi(P, s, 0.2); s.cfg.pops = false;
  passi(P, s, 2, (q, t) => { q.cut = 1; q.thr = 0; q.ovr = t; });
  assert.equal(P.colpi.filter((c) => c.slot === 'mappa').length, 0); s.cfg.pops = true;
  // limitatore a taglio d'accensione: colpi sui tagli, non a ogni fotogramma
  P.colpi.length = 0; s.cut = 0; s.thr = 1; s.rpm = 7000;
  passi(P, s, 2, (q, t) => { q.cut = Math.floor(t * 30) % 2 ? 2 : 0; });
  const lim = P.colpi.filter((c) => c.slot === 'limitatore').length; assert.ok(lim >= 10 && lim <= 31, 'colpi di limitatore: ' + lim);
  // gas spalancato di colpo: una boccata sola
  P.colpi.length = 0; s.cut = 0; s.thr = 0; s.rpm = 2500; passi(P, s, 0.5);
  passi(P, s, 1, (q, t) => { q.thr = Math.min(1, t * 20); });
  assert.equal(P.colpi.filter((c) => c.slot === 'aspirazione').length, 1);
  // launch armato: uno spurgo, non di più
  P.colpi.length = 0; s.v = 0; passi(P, s, 3, (q) => { q.launchArmed = true; });
  assert.equal(P.colpi.filter((c) => c.slot === 'spurgo').length, 1);
  // innesto: clack e soffio dell'attuatore
  P.colpi.length = 0; passi(P, s, 0.1, null, (t) => (t === 0 ? [{ type: 'clunk' }] : []));
  assert.ok(P.colpi.some((c) => /^innesto/.test(c.f)) && P.colpi.some((c) => /^aria/.test(c.f)));
  // anelli: fischio del turbo che sale con la girante e il gas
  s.v = 25; s.thr = 1; s.tur = 0.9; passi(P, s, 0.5);
  const L = P.pl.loops.turbo; assert.ok(L && L.g.gain.value > 0.1 && L.src.playbackRate.value > 0.8, 'turbo in pressione');
  s.tur = 0; s.thr = 0; passi(P, s, 0.3); assert.ok(P.pl.loops.turbo.g.gain.value < 0.01, 'turbo fermo, fischio zitto');
  // cambio in folle: niente fischio degli ingranaggi
  s.gear = 0; passi(P, s, 0.3); assert.ok(!P.pl.loops.cambio || P.pl.loops.cambio.g.gain.value < 0.01);
  // tolto il kit l'anello si ferma
  P.pl.setKits(Object.assign({}, res, { turbo: null }), { spark: true }); passi(P, s, 0.1); assert.equal(P.pl.loops.turbo, undefined);
  } finally { Math.random = rnd0; }
});

test('campioni: l\'anti-lag spara al rilascio col turbo lanciato e a ogni cambiata', () => {
  const P = player({ mappa: 'mappa/antilag' }, { spark: true });
  const s = simFinta({ tur: 0.8, rpm: 6000, thr: 1 }); passi(P, s, 0.2);
  passi(P, s, 2.5, (q, t) => { q.cut = 1; q.thr = 0; q.ovr = t; });
  assert.ok(P.colpi.length >= 2, 'raffiche al rilascio: ' + P.colpi.length);
  P.colpi.length = 0; s.cut = 0; s.thr = 1; passi(P, s, 0.2); s.shiftSeq = { t: 0 }; passi(P, s, 0.05); s.shiftSeq = null; passi(P, s, 0.05);
  assert.equal(P.colpi.length, 1, 'un botto in cambiata');
});

test('campioni: volume per componente (scheda Suoni) su colpi, anelli e salvataggio', () => {
  const mem = {}; globalThis.localStorage = { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); } };
  try {
    assert.equal(E.cmpVolSlot('turbo'), 1, 'di serie 100 %');
    E.cmpVolSet('turbo', 1.6); E.cmpVolSet('valvola', 0); E.cmpVolSet('', 1.2);
    const o = JSON.parse(mem.nr_campioni);
    assert.equal(o.vol, 1.2); assert.equal(o.slot.turbo, 1.6); assert.equal(o.slot.valvola, 0);
    assert.equal(E.cmpVolSet('scarico', 9), E.CMP_VOL_MAX, 'tetto al 200 %');
    E.cmpVolSet('scarico', 1); assert.ok(!('scarico' in JSON.parse(mem.nr_campioni).slot), 'al 100 % non resta scritto');
    // valvola a zero: il pssh non suona; turbo al 160 %: l'anello è più forte di quello di un turbo al 100 %
    const res = { valvola: 'valvola/stututu', turbo: 'turbo/sibilo' };
    const P = player(res, {}), s = simFinta({ tur: 0.8, thr: 1 });
    passi(P, s, 0.5, null, (t) => (t === 0 ? [{ type: 'bov', I: 1 }] : []));
    assert.equal(P.colpi.filter((c) => c.slot === 'valvola').length, 0, 'valvola spenta col suo volume');
    const forte = P.pl.loops.turbo.g.gain.value;
    E.cmpVolSet('turbo', 1); passi(P, s, 0.1);
    const normale = P.pl.loops.turbo.g.gain.value;
    assert.ok(Math.abs(forte / normale - 1.6) < 0.01, `turbo al 160 %: ${forte} contro ${normale}`);
    E.cmpVolSet('valvola', 1); P.colpi.length = 0;
    passi(P, s, 0.1, null, (t) => (t === 0 ? [{ type: 'bov', I: 1 }] : []));
    assert.equal(P.colpi.filter((c) => c.slot === 'valvola').length, 1, 'valvola di nuovo al 100 %');
  } finally { delete globalThis.localStorage; E.cmpVolSet('turbo', 1); }
});
