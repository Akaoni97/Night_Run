// Prove dell'usato dei privati e dello sfasciacarrozze.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'valigette.js', 'traguardi.js', 'ruota.js', 'concessionario.js', 'usato.js', 'sfascio.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, VG, VG_SHOP, US, JK } = new Function(src + ';return { SupraSim, StreetGame, VG, VG_SHOP, US, JK };')();

const trip = (kmNow = 100, money = 100000) => { const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.dist = kmNow * 1000; game.s.money = money; return { sim, game }; };
// il primo annuncio (con o senza difetti) dalla tappa from in avanti
const find = (game, pred, from = 1) => { for (let n = from; n < from + 400; n++) { const L = game.usAt(n); if (L && pred(L)) return L; } return null; };
const at = (game, L) => { game.inside = { id: VG.stop(L.n).id, x: L.x, phase: 'shop' }; game.s.dist = L.x; };

test('sfasciacarrozze: decima tappa di ogni giro, al posto del secondo autogrill', () => {
  assert.equal(VG.stop(9).id, 'junk'); assert.equal(VG.stop(21).id, 'junk'); assert.equal(VG.stop(2).id, 'grill'); assert.equal(VG.stop(8).id, 'dealer');
});

test('usato: annunci sempre uguali per la stessa tappa, mai all\'Autosalone o allo sfascio, prezzo sotto il nuovo', () => {
  const { game } = trip();
  let count = 0;
  for (let n = 1; n < 200; n++) {
    const L = game.usAt(n); if (!L) continue; count++;
    assert.deepEqual(game.usAt(n), L, 'ripetibile');
    assert.ok(!['dealer', 'junk'].includes(VG.stop(n).id));
    assert.ok(L.price < VG_SHOP.find((q) => q.id === L.id).price && L.price > 0);
    assert.ok(L.defects.length <= 2);
  }
  assert.ok(count > 50 && count < 110, `${count} annunci su 200 tappe`);
  assert.ok(game.usList().length > 0 && game.usList().length <= US.ahead);
});

test('usato: guardarla, provarla e Mario scoprono i difetti; trattare è più facile se ne hai trovati', () => {
  const { game } = trip(), L = find(game, (x) => x.defects.includes('olio') && x.defects.length === 2); at(game, L);
  const p0 = game.usChance(L.n, 1);
  assert.equal(game.usLook(9999).ok, false, 'l\'auto è da un\'altra parte');
  const m = game.s.money, r = game.usNiko(L.n); assert.ok(r.ok); assert.equal(game.s.money, m - US.niko);
  assert.deepEqual(game.usInsp(L.n).rev.slice().sort(), L.defects.slice().sort(), 'Mario trova tutto');
  assert.ok(game.usChance(L.n, 1) > p0);
  assert.equal(game.usNiko(L.n).ok, false, 'una volta sola');
  const n = game.usNego(L.n, 1, () => 0); assert.ok(n.won); assert.equal(game.usPrice(L), Math.round(L.price * 0.8 / 50) * 50);
  assert.equal(game.usNego(L.n, 2, () => 0).ok, false, 'si tratta una volta');
});

test('usato: comprata, porta con sé i difetti; il motore stanco toglie il 15 %, Mario lo revisiona', () => {
  const { game } = trip(), L = find(game, (x) => x.defects.includes('motore') && !game.s.vg.garage.includes(x.id)); at(game, L);
  const price = game.usPrice(L), m = game.s.money;
  assert.ok(game.usBuy(L.n).ok); assert.equal(game.s.money, m - price);
  assert.ok(game.s.vg.garage.includes(L.id)); assert.equal(game.usBuy(L.n).ok, false, 'venduta');
  const st = game.s.cars[L.id]; assert.ok(st.tired); assert.equal(st.usedPaid, price);
  assert.ok(st.km >= L.km);
  game.inside = null; game.dlSwap(L.id);
  const b0 = game.caseBoosts(); assert.ok(Math.abs(b0 - US.tired) < 1e-9, `potenza × ${b0}`);
  const v0 = game.dlValue(L.id);
  game.s.money = 100000; assert.ok(game.usRevision().ok); assert.equal(game.caseBoosts(), 1); assert.ok(game.dlValue(L.id) > v0, 'rivale di più');
});

test('usato: i chilometri scalati si scoprono dopo (e contano nella valutazione)', () => {
  const { game } = trip(), L = find(game, (x) => x.defects.includes('km') && !game.s.vg.garage.includes(x.id)); at(game, L);
  game.usBuy(L.n); assert.equal(game.s.cars[L.id].km, L.km + L.kmExtra);
});

test('usato: comprata sana e rivenduta all\'Autosalone, il guadagno si conta (e dà il traguardo)', () => {
  const { game } = trip(), L = find(game, (x) => !x.defects.length && !game.s.vg.garage.includes(x.id)); at(game, L);
  game.usNego(L.n, 2, () => 0); game.usBuy(L.n); game.inside = null;
  const r = game.dlSell(L.id); assert.ok(r.ok);
  const U = game.us(); assert.equal(U.flips, 1); assert.equal(U.profit, r.val - game.usPrice(L));
  assert.ok(U.best > 0, `guadagno ${U.profit}`);
  game.achStep(0.25); assert.ok(game.ach().got.commercio, 'traguardo Commerciante');
});

test('sfascio: pezzi usati a meno della metà, diventano tuoi; non si ricomprano', () => {
  const { game } = trip(); game.inside = { id: 'junk', x: VG.stopX(9), phase: 'shop' };
  const st = game.jkStock(9); assert.ok(st.length >= 3);
  const p = st.find((q) => !q.rare); assert.equal(p.price, Math.round(p.full * JK.partK / 10) * 10);
  const m = game.s.money; assert.ok(game.jkBuyPart(p.cat, p.id).ok); assert.equal(game.s.money, m - p.price);
  assert.ok(game.s.owned['v40|' + p.cat + ':' + p.id]);
  assert.ok(!game.jkStock(9).some((q) => q.cat === p.cat && q.id === p.id));
});

test('sfascio: la carcassa costa poco, arriva distrutta; con le riparazioni torna a valere', () => {
  const { game } = trip(300, 100000); game.inside = { id: 'junk', x: VG.stopX(21), phase: 'shop' };
  const W = game.jkWreck(21); assert.ok(W && W.price === Math.round(VG_SHOP.find((q) => q.id === W.id).price * JK.wreckK / 50) * 50);
  const R = game.jkRestore(W); assert.ok(R.total > 0 && R.after > W.price);
  assert.ok(game.jkBuyWreck().ok); assert.equal(game.jkWreck(21), null, 'venduta');
  const st = game.s.cars[W.id]; assert.ok(st.damage >= 0.7 && st.tired && st.tireWear >= 0.85 && st.maint.pads < 0.1);
  const v0 = game.dlValue(W.id); st.damage = 0; st.tired = false; assert.ok(game.dlValue(W.id) > v0 * 2, 'riparata vale molto di più');
});

test('sfascio: rottamare paga a peso; rovistare costa 20 € e si fa una volta per tappa', () => {
  const { game } = trip(300, 100000); game.dlBuy('e30', 'cash'); game.inside = { id: 'junk', x: VG.stopX(9), phase: 'shop' };
  const val = game.jkScrapValue('e30'), m = game.s.money; assert.ok(game.jkScrap('e30').ok); assert.equal(game.s.money, m + val);
  assert.equal(game.jkScrap('v40').ok, false, 'non quella su cui sei');
  const m2 = game.s.money, r = game.jkDig(2, () => 0.001); assert.ok(r.ok); assert.equal(r.k, 'niente'); assert.equal(game.s.money, m2 - JK.dig);
  assert.equal(game.jkDig(3).ok, false, 'una volta per tappa');
  game.inside = { id: 'junk', x: VG.stopX(21), phase: 'shop' }; const r2 = game.jkDig(0, () => 0.3); assert.ok(r2.ok && r2.k === 'soldi');
});
