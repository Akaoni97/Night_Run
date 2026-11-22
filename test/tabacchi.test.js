// Gratta e vinci, sigarette (tabacchi.js) e i sensi del guidatore (sensi.js): v0.91, chiesti da Nico il 22/11.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const files = ['dsp.js', 'sim.js', 'tuning.js', 'schede.js', 'suoni.js', 'cars.js', 'game.js', 'viaggio.js', 'traguardi.js', 'tabacchi.js', 'sensi.js'];
const src = files.map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const E = new Function(src + ';return { SupraSim, StreetGame, INV, GV_PREMI, GV_TIPI, TABACCHI, gvEstrai, gvGriglia, gvMedia, gvVincita, TRG_LIST, senApertura, senBotta, SEN }')();
const PR = { gv_notte: 2, gv_sorpasso: 5, gv_jackpot: 10 };
const gioco = () => { const g = new E.StreetGame(new E.SupraSim()); g.s.vg = g.s.vg || {}; g.s.vg.needs = { food: 1, water: 1, sleep: 0.3, wash: 1, pee: 1, poo: 1 }; g.s.money = 1000; return g; };
const caso = (seed) => () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

test('gratta e vinci: si vince circa una volta su quattro e alla lunga ci si perde', () => {
  for (const t of E.GV_TIPI) {
    const p = E.gvVincita(t), r = E.gvMedia(t) / PR[t];
    assert.ok(p > 0.18 && p < 0.32, `${t}: vinci il ${(p * 100).toFixed(1)} %`);
    assert.ok(r > 0.6 && r < 0.9, `${t}: torna il ${(r * 100).toFixed(0)} %`);
    assert.equal(E.INV[t].price, PR[t]);
  }
  // diecimila biglietti da 2 €: qualcuno vince, non tutti
  const rnd = caso(7); let v = 0; for (let i = 0; i < 10000; i++) if (E.gvEstrai('gv_notte', rnd())) v++;
  assert.ok(v > 1800 && v < 3200, `vinti ${v} su 10000`);
});

test('la griglia: tre importi uguali solo se si vince', () => {
  const rnd = caso(3);
  for (let n = 0; n < 300; n++) for (const t of E.GV_TIPI) {
    const premio = n % 3 ? 0 : E.GV_PREMI[t][n % E.GV_PREMI[t].length][0], gr = E.gvGriglia(t, premio, rnd), conta = {};
    assert.equal(gr.length, 9);
    for (const x of gr) conta[x] = (conta[x] || 0) + 1;
    const tris = Object.entries(conta).filter(([, c]) => c >= 3).map(([k]) => +k);
    assert.deepEqual(tris, premio ? [premio] : [], `${t} premio ${premio}: ${gr}`);
  }
});

test('si compra all\'autogrill, si gratta da fermi e la vincita arriva subito', () => {
  const g = gioco();
  assert.ok(E.TABACCHI.includes('gv_jackpot') && E.TABACCHI.includes('sigarette'));
  assert.ok(g.buyItem('gv_notte').ok); const i = g.s.trunk.findIndex((x) => x.kind === 'gv_notte');
  g.sim.v = 20; assert.equal(g.useItem(i).ok, false, 'in marcia no'); g.sim.v = 0;
  const c = caso(11); let prima = true;
  const soldi = g.s.money, r = g.tabGratta(i, () => (prima ? ((prima = false), 0.01) : c()));   // 0,01: vince il premio più piccolo
  assert.ok(r.ok && r.gratta.premio === 2 && g.s.money === soldi + 2);
  assert.ok(!g.s.trunk.some((x) => x.kind === 'gv_notte')); assert.equal(g.tab().grattati, 1);
});

test('le sigarette tolgono un po\' di sonno, una dietro l\'altra quasi niente', () => {
  const g = gioco(); g.buyItem('sigarette'); const N = g.s.vg.needs, i = () => g.s.trunk.findIndex((x) => x.kind === 'sigarette');
  const s0 = N.sleep; assert.ok(g.useItem(i()).ok); const s1 = N.sleep;
  assert.ok(s1 - s0 > 0.06, 'la prima sveglia'); assert.ok(g.useItem(i()).ok);
  assert.ok(N.sleep - s1 < 0.03, 'la seconda subito no');
  assert.equal(g.s.trunk[i()].uses, 8, 'restano otto sigarette');
  g.s.dist += 4000; const s2 = N.sleep; g.useItem(i()); assert.ok(N.sleep - s2 > 0.06, 'dopo qualche km di nuovo');
});

test('traguardo Botta di fortuna', () => {
  const t = E.TRG_LIST.find((x) => x.id === 'grattaFortuna'), g = gioco();
  assert.ok(t); assert.deepEqual(t.check(g), [0, 100]); g.tab().massimo = 500; assert.deepEqual(t.check(g), [100, 100]);
});

test('i sensi: occhi che si chiudono col sonno e buio con fischio dopo un urto forte', () => {
  assert.equal(E.senApertura(0.9, 3), 1, 'riposato: occhi aperti');
  const media = (s) => { let a = 0; for (let t = 0; t < 30; t += 0.05) a += E.senApertura(s, t); return a / 600; };
  assert.ok(media(0.25) < 0.97 && media(0.05) < media(0.25) - 0.1, 'più stanco, più chiusi');
  let min = 1; for (let t = 0; t < 30; t += 0.02) min = Math.min(min, E.senApertura(0.05, t)); assert.ok(min < 0.2, 'ogni tanto si chiudono quasi del tutto');
  assert.equal(E.senApertura(0.9, 1, 1), 0, 'colpo di sonno: chiusi');
  assert.deepEqual(E.senBotta(0.5, 0.5), { buio: 0, fischio: 0 }, 'urto leggero: niente');
  const a = E.senBotta(0.5, 1.2), b = E.senBotta(4, 1.2);
  assert.ok(a.buio > 0.3 && a.fischio > 0.7 && b.buio < a.buio && b.fischio < a.fischio, 'forte: buio e fischio che calano');
  // il gioco se ne accorge: un tamponamento a 50 km/h di differenza
  const g = gioco(); g.sim.v = 30; g.crash({ v: 15, vt: 'panda', lane: 1, x: 0 }, 'front');
  assert.ok(g.botta && g.botta.I >= E.SEN.botta, 'botta registrata');
  const h = gioco(); h.sim.v = 12; h.crash({ v: 8, vt: 'panda', lane: 1, x: 0 }, 'front'); assert.ok(!h.botta, 'colpetto: niente');
});
