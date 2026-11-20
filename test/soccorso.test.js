// Prove del soccorso stradale: prezzi dei servizi, chiamata, copione completo del furgone, pagamento e stato dell'auto.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'soccorso.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, SOC, GAME_FUEL_PRICE, GAME_LANE_Z } = new Function(src + ';return { SupraSim, StreetGame, SOC, GAME_FUEL_PRICE, GAME_LANE_Z };')();
const trip = () => { const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.money = 5000; game.trafficOn = false; game.prompt = null; return { sim, game }; };
// fa girare il gioco come il ciclo vero: i pedali li decide il gioco (control) e poi update
const run = (game, sec, until) => { for (let i = 0; i < sec * 30; i++) { game.control({ thr: 0, brake: 0 }, 1 / 30); game.update(1 / 30); if (until && until()) return i / 30; } return sec; };

test('prezzi: il pieno costa i litri che mancano, la carrozzeria i danni, e i servizi inutili sono grigi', () => {
  const { sim, game } = trip();
  sim.fuel = 0; sim.damage = 0; game.tyres().p = [2.3, 2.3, 2.3, 2.3];
  let S = Object.fromEntries(game.socServizi().map((s) => [s.id, s]));
  assert.equal(S.fuel.price, Math.round(sim.P.tank * GAME_FUEL_PRICE), 'a secco: il pieno intero');
  assert.ok(!S.body.ok && !S.tyres.ok, 'niente danni e gomme a posto: grigi');
  sim.fuel = 0.5; S = Object.fromEntries(game.socServizi().map((s) => [s.id, s]));
  assert.ok(Math.abs(S.fuel.price - Math.round(sim.P.tank * 0.5 * GAME_FUEL_PRICE)) <= 1, 'a metà: mezzo pieno');
  sim.fuel = 1; assert.ok(!game.socServizi().find((s) => s.id === 'fuel').ok, 'pieno: non serve');
  sim.damage = 0.4; assert.equal(game.socServizi().find((s) => s.id === 'body').price, game.repairCost());
  game.tyres().p[1] = 0.8; game.tyres().leak[3] = 0.2;
  const ty = game.socServizi().find((s) => s.id === 'tyres'); assert.deepEqual(ty.bad, [1, 3]); assert.equal(ty.price, 2 * SOC.gomma);
  game.maint().oil = 0.2; game.maint().pads = 0.3;
  const mt = game.socServizi().find((s) => s.id === 'maint'); assert.deepEqual(mt.keys, ['oil', 'pads']); assert.equal(mt.price, game.serviceCost('oil') + game.serviceCost('pads'));
  assert.equal(game.socTotale(['body']).total, game.repairCost() + SOC.uscita);
});

test('chiamata: rifiuta senza servizi, senza soldi, da dentro un locale o con la chiamata già in corso', () => {
  const { sim, game } = trip(); sim.damage = 0.5;
  assert.equal(game.socCall([]).ok, false);
  game.s.money = -5000; assert.equal(game.socCall(['body']).ok, false, 'né soldi né fido');
  game.s.money = 5000; game.inside = { id: 'bar' }; assert.equal(game.socCall(['body']).ok, false); game.inside = null;
  assert.equal(game.socCall(['body']).ok, true); assert.equal(game.socCall(['body']).ok, false, 'già in arrivo');
});

test('copione: l\'auto si ferma, il furgone arriva davanti con le quattro frecce, lavora, si paga e riparte', () => {
  const { sim, game } = trip();
  sim.damage = 0.5; sim.fuel = 0.1; sim.tireWear = 0.6; game.tyres().p[0] = 0.9; game.maint().oil = 0.1;
  sim.v = 20; sim.running = true;
  const money0 = game.s.money, cost = game.socTotale(['body', 'fuel', 'tyres', 'newtyres', 'maint']);
  assert.ok(game.socCall(['body', 'fuel', 'tyres', 'newtyres', 'maint']).ok);
  const fase = new Set(); let van = null, maxHaz = false;
  for (let i = 0; i < 90 * 30 && game.soc; i++) {
    // il vero ciclo: la fisica frena l'auto quando il gioco lo chiede
    const c = game.control({ thr: 0, brake: 0 }, 1 / 30);
    if (c.brake) sim.v = Math.max(0, sim.v - 7 * c.brake / 30 * 1.4);
    game.update(1 / 30);
    if (game.soc) { fase.add(game.soc.ph); van = game.soc.van || van; if (van && van.hazard) maxHaz = true; }
    if (game.soc && game.soc.ph === 'work' && !game.soc.visto) { game.soc.visto = true; assert.ok(Math.abs(sim.v) < 0.5, 'auto ferma'); assert.ok(van.x - game.s.dist > 6 && van.x - game.s.dist < 11, 'furgone davanti'); assert.equal(van.lane, game.lane, 'nella nostra corsia'); assert.equal(game.lane, 3, 'accostato a destra'); assert.ok(van.hazard, 'quattro frecce'); }
  }
  assert.equal(game.soc, null, 'chiamata finita');
  assert.deepEqual([...fase], ['brake', 'come', 'work', 'leave']); assert.ok(maxHaz);
  assert.equal(game.ap, null, 'l\'auto è di nuovo tua');
  assert.equal(sim.damage, 0); assert.ok(sim.fuel > 0.999); assert.equal(sim.tireWear, 0); assert.ok(game.tyres().p[0] >= 2.29); assert.equal(game.maint().oil, 1);
  assert.equal(Math.round(money0 - game.s.money), cost.total, 'si paga il totale: servizi più uscita');
  assert.ok(!van.soc && !van.still && !van.hazard, 'il furgone è diventato traffico normale');
});

test('soccorso: il furgone non tampona e non viene tamponato (nessun urto)', () => {
  const { sim, game } = trip(); sim.damage = 0.3; const crash0 = game.s.crashes || 0;
  game.socCall(['body']); run(game, 60, () => !game.soc);
  assert.equal(game.s.crashes || 0, crash0);
});
