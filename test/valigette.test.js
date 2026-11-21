// Prove delle valigette: probabilità, garanzia, premi, ticket, potenziamenti, ricompense dei lavori.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'valigette.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, CASE_TYPES, CASE_RAR, CASE_PITY, VG, tuning } =
  new Function(src + ';return { SupraSim, StreetGame, CASE_TYPES, CASE_RAR, CASE_PITY, VG, tuning: () => TUNING };')();

const trip = () => { const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); return { sim, game }; };
// generatore ripetibile
const lcg = (seed) => () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);

test('valigette: sei rarità, tre tipi, probabilità che fanno 100', () => {
  assert.equal(CASE_RAR.length, 6);
  for (const k of ['bronzo', 'argento', 'oro']) assert.ok(Math.abs(CASE_TYPES[k].odds.reduce((a, b) => a + b, 0) - 100) < 1e-9, k);
  assert.equal(CASE_TYPES.oro.odds[0], 0, 'nell\'oro niente comuni');
  assert.deepEqual([CASE_TYPES.bronzo.price, CASE_TYPES.argento.price, CASE_TYPES.oro.price], [1500, 6000, 18000]);
});

test('valigette: si comprano solo coi soldi che hai', () => {
  const { game } = trip();
  game.s.money = 1000; assert.equal(game.caseBuy('bronzo').ok, false);
  game.s.money = 20000; assert.ok(game.caseBuy('oro').ok); assert.equal(game.s.money, 2000);
  assert.equal(game.cases().own.length, 1);
});

test('valigette: la garanzia dà un raro entro 10 aperture e un epico entro 40', () => {
  const { game } = trip(); game.s.money = 0;
  const rnd = () => 0.01;                                        // sempre il primo esito: il più comune
  const rars = [];
  for (let k = 0; k < 40; k++) { game.cases().own.push({ type: 'bronzo', why: 'test' }); rars.push(game.caseOpen(0, rnd).rar); }
  assert.ok(rars.slice(0, CASE_PITY.raro).some((r) => r >= 2), 'un raro nelle prime 10');
  assert.ok(rars.some((r) => r >= 3), 'un epico entro 40');
  assert.equal(game.cases().own.length, 0, 'le valigette aperte spariscono');
});

test('valigette: le frequenze seguono le probabilità dichiarate (argento)', () => {
  const { game } = trip(), rnd = lcg(7), n = 4000, cnt = [0, 0, 0, 0, 0, 0];
  for (let k = 0; k < n; k++) { const C = game.cases(); C.pity = { r: 0, e: 0 }; C.own.push({ type: 'argento' }); cnt[game.caseOpen(0, rnd).rar]++; }
  CASE_TYPES.argento.odds.forEach((p, i) => { const f = cnt[i] / n * 100; assert.ok(Math.abs(f - p) < Math.max(2, p * 0.25), `${CASE_RAR[i].name}: ${f.toFixed(1)} % contro ${p} %`); });
});

test('valigette: ticket tagliando e modifica rendono gratis Nico e Luca, una volta', () => {
  const { game } = trip(), C = game.cases();
  game.s.money = 100000; game.maint().oil = 0.2; C.tickets.svc = 1;
  assert.equal(game.serviceCost('oil'), 0);
  const m0 = game.s.money; assert.ok(game.service('oil').ok); assert.equal(game.s.money, m0, 'tagliando gratis');
  assert.equal(C.tickets.svc, 0); game.maint().oil = 0.2; assert.ok(game.serviceCost('oil') > 0, 'finito il ticket si paga');
  // modifica: un pezzo da meno di 5000 della V40, sbloccato coi km
  game.s.cars[game.car].km = 500; C.tickets.mod = 1;
  const it = TUNING_FIND(game);
  assert.equal(game.price(it.cat, it.id), 0);
  const m1 = game.s.money; assert.ok(game.buy(it.cat, it.id).ok); assert.equal(game.s.money, m1);
  assert.equal(C.tickets.mod, 0);
});
function TUNING_FIND(game) {
  const T = tuning();
  for (const cat in T) for (const it of T[cat].items) if (it.price > 0 && it.price <= 5000 && !game.owns(cat, it.id)) return { cat, id: it.id };
  return null;
}

test('valigette: i potenziamenti a tempo scadono coi km, quelli per sempre restano', () => {
  const { game } = trip(), C = game.cases();
  C.boosts.push({ pw: 0.15, until: 10, car: game.car, name: 'Mappa da pista' }); C.perm[game.car] = 0.03;
  game.s.dist = 5000; assert.ok(Math.abs(game.caseBoosts() - 1.15 * 1.03) < 1e-9);
  game.s.dist = 11000; assert.ok(Math.abs(game.caseBoosts() - 1.03) < 1e-9, 'scaduto a 10 km');
  assert.equal(C.boosts.length, 0);
});

test('valigette: il leggendario regala un\'auto che non hai, nel garage del motel', () => {
  const { game } = trip(), v = game.s.vg;
  game.cases().own.push({ type: 'oro' });
  const pz = game.caseOpen(0, () => 0.999);                       // l'ultimo esito: leggendario
  assert.equal(pz.rar, 5); assert.ok(pz.car && v.garage.includes(pz.car), `auto ${pz.car} nel garage`);
});

test('valigette: mai un turbo tra i pezzi regalati', () => {
  const { game } = trip(); game.mode = 'career';
  for (let k = 0; k < 120; k++) for (const rar of [3, 4]) {
    game.cases().own.push({ type: 'oro' }); const pz = game.caseOpen(0, lcg(k * 7 + rar));
    assert.notEqual(pz.icon, 'turbo', `${pz.name}: un turbo regalato`);       // l'icona 'turbo' esce solo per la categoria turbo (un intercooler può chiamarsi «per turbo»)
  }
  for (const it of (tuning().turbo || {}).items || []) if (it.price > 0) assert.equal(game.owns('turbo', it.id), false, `turbo ${it.id} regalato`);
});

test('valigette: i lavori danno valigette', () => {
  const { game } = trip();
  game.caseRewards();                                             // fotografia di partenza
  game.vgTake(game.vgOffers(0).find((x) => x.first), 0); game.s.dist = VG.stopX(1); game.vgArrive(VG.stop(1));
  game.caseRewards();
  assert.ok(game.cases().own.some((c) => c.type === 'bronzo' && /primo lavoro/.test(c.why)), 'bronzo per il primo lavoro');
  game.s.vg.misDone = (game.s.vg.misDone || 0) + 1; game.caseRewards();
  assert.ok(game.cases().own.some((c) => c.type === 'argento'), 'argento per un lavoro della catena');
});
