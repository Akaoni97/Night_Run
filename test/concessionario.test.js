// Prove del concessionario: dove sta, schede, occasione, contanti, rate (pagate, saltate, carro attrezzi),
// vendita con valutazione, giro di prova.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'valigette.js', 'traguardi.js', 'ruota.js', 'concessionario.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, VG, VG_SHOP, DL } = new Function(src + ';return { SupraSim, StreetGame, VG, VG_SHOP, DL };')();

const trip = (kmNow = 300, money = 100000) => { const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.dist = kmNow * 1000; game.s.money = money; return { sim, game }; };
const price = (id) => VG_SHOP.find((q) => q.id === id).price;

test('concessionario: è la nona tappa di ogni giro (al posto di un bar), il primo al km 27,4', () => {
  const S = VG.stop(8); assert.equal(S.id, 'dealer'); assert.equal(S.name, 'Autosalone Notte'); assert.equal(S.x, 27400);
  assert.equal(VG.stop(20).id, 'dealer');
  assert.deepEqual([0, 1, 2, 3, 4, 5].map((n) => VG.stop(n).id), ['bar', 'fuel', 'grill', 'niko', 'bar', 'motel'], 'le prime tappe restano uguali');
});

test('concessionario: schede tecniche dal modello del motore', () => {
  const { game } = trip(), s = game.dlSpec('supra'), p = game.dlSpec('panda');
  assert.ok(s.cv > 300 && s.cv < 360, `Supra ${s.cv} CV`); assert.ok(p.cv > 55 && p.cv < 80, `Panda ${p.cv} CV`);
  assert.ok(s.kg > 1400 && s.kgcv > 3 && s.kgcv < 6);
});

test('concessionario: contanti, occasione scontata, km per sbloccare', () => {
  const { game } = trip(30, 200000), v = game.s.vg;
  assert.equal(game.dlBuy('supra', 'cash').ok, false, 'la Supra è dal km 260');
  game.s.dist = 300000;
  const n = 8, deal = game.dlDeal(n); assert.ok(deal, 'c\'è un\'occasione');
  assert.equal(game.dlPrice(deal, n), Math.round(price(deal) * (1 - DL.deal) / 50) * 50);
  const m = game.s.money, r = game.dlBuy(deal, 'cash', n);
  assert.ok(r.ok); assert.equal(game.s.money, m - r.price); assert.ok(v.garage.includes(deal) && v.owned[deal]);
  assert.equal(game.dlBuy(deal, 'cash', n).ok, false, 'non la ricompri');
  assert.notEqual(game.dlDeal(n), deal, 'l\'occasione passa a un\'altra');
});

test('concessionario: a rate si paga l\'anticipo e poi una rata ogni 10 km, fino a chiudere', () => {
  const { game } = trip(300, 50000), plan = game.dlFinPlan(price('supra'));
  assert.ok(game.dlBuy('supra', 'fin').ok); assert.equal(game.s.money, 50000 - plan.down);
  game.s.money = 100000;
  for (let k = 1; k <= DL.n; k++) { game.s.dist = (300 + k * DL.every) * 1000; game.dlTick(); }
  assert.equal(game.s.money, 100000 - plan.rata * DL.n);
  assert.equal((game.s.vg.fin || []).length, 0, 'finanziamento chiuso');
  assert.ok(plan.down + plan.total > price('supra') * 1.1, 'a rate costa di più');
});

test('concessionario: tre rate saltate e il carro attrezzi si riprende l\'auto (anche se ci sei sopra, quando ti fermi)', () => {
  const { game, sim } = trip(300, 20000);
  assert.ok(game.dlBuy('e30', 'fin').ok); game.dlSwap('e30'); assert.equal(game.car, 'e30');
  game.s.money = 0;
  game.s.dist = 310000; game.dlTick(); assert.equal(game.s.vg.fin[0].miss, 1); assert.ok(game.s.vg.fin[0].mora > 0);
  assert.equal(game.dlBuy('e36', 'fin').ok, false, 'niente altre rate con una arretrata');
  sim.v = 30; game.s.dist = 330000; game.dlTick();
  assert.ok(game.s.vg.garage.includes('e30'), 'in movimento non te la tolgono');
  sim.v = 0; game.dlTick();
  assert.ok(!game.s.vg.garage.includes('e30') && game.car === 'v40', 'portata via, sei di nuovo sulla V40');
});

test('concessionario: la valutazione scende coi km e coi danni; non vendi quella su cui sei né l\'ultima', () => {
  const { game } = trip(300, 100000);
  game.dlBuy('e34', 'cash');
  const v0 = game.dlValue('e34'); game.s.cars.e34.km = 600; const v1 = game.dlValue('e34'); game.s.cars.e34.damage = 0.5; const v2 = game.dlValue('e34');
  assert.ok(v0 > v1 && v1 > v2, `${v0} > ${v1} > ${v2}`); assert.ok(v0 < price('e34'));
  assert.equal(game.dlCanSell('v40').ok, false, 'ci sei sopra');
  const m = game.s.money, r = game.dlSell('e34'); assert.ok(r.ok); assert.equal(game.s.money, m + v2);
  assert.ok(!game.s.vg.garage.includes('e34') && !game.s.cars.e34);
  game.dlBuy('e30', 'cash'); game.dlSwap('e30');
  assert.ok(game.dlSell('v40').ok, 'la V40 si vende se hai un\'altra auto');
  assert.equal(game.dlCanSell('e30').ok, false);
});

test('concessionario: i pezzi montati alzano la valutazione', () => {
  const { game } = trip(300, 100000); game.dlBuy('e30', 'cash');
  const v0 = game.dlValue('e30'), T = game.s.owned;
  const C = new Function(src + ';return CARS')().e30.tuning, k = Object.keys(C).find((c) => C[c].items && C[c].items.some((i) => i.price > 1000));
  const it = C[k].items.find((i) => i.price > 1000); T['e30|' + k + ':' + it.id] = true;
  assert.ok(game.dlValue('e30') >= v0 + Math.floor(it.price * 0.3), 'un terzo del pezzo');
});

test('concessionario: giro di prova di 3 km, poi ti fermi e si riprendono l\'auto (e i km in più si pagano)', () => {
  const { game, sim } = trip(300, 1000);
  assert.ok(game.dlTestStart('supra').ok); game.dlSwap('supra'); assert.equal(game.car, 'supra');
  assert.equal(game.dlTestStart('e30').ok, false, 'una prova alla volta');
  game.s.dist += 2000; sim.v = 0; game.dlTick(); assert.equal(game.car, 'supra', 'a 2 km la prova continua');
  game.s.dist += 3000; sim.v = 25; const ev = game.dlTick(); assert.ok(ev.some((e) => e.k === 'testWarn')); assert.equal(game.car, 'supra');
  sim.v = 0; const m = game.s.money; game.dlTick();
  assert.equal(game.car, 'v40'); assert.ok(!game.s.vg.garage.includes('supra') && !game.s.vg.test);
  assert.equal(game.s.money, m - Math.round(1.5 * DL.testOver), '1,5 km oltre la tolleranza');
});

test('concessionario: se ti piace durante la prova la compri e resta tua', () => {
  const { game } = trip(300, 100000);
  game.dlTestStart('r5'); game.dlSwap('r5');
  assert.ok(game.dlBuy('r5', 'cash').ok); assert.ok(!game.s.vg.test && game.s.vg.garage.includes('r5'));
  game.s.dist += 6000; game.dlTick(); assert.equal(game.car, 'r5', 'non se la riprendono');
});
