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

// ---- assicurazione, traino, guasti e diario (v0.55)
const srcAll = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'capitali.js', 'valigette.js', 'traguardi.js', 'ruota.js', 'concessionario.js', 'usato.js', 'sfascio.js', 'garage.js', 'soccorso.js', 'documenti.js', 'statistiche.js', 'diario.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const X = new Function(srcAll + ';return { SupraSim, StreetGame, SOC, DOC, DIA, VG };')();
const trip2 = () => { const sim = new X.SupraSim(), game = new X.StreetGame(sim, () => 0.5); game.startTrip(); game.s.money = 20000; game.trafficOn = false; game.s.vg.firstDone = true; game.s.dist = 5000; game.update(1 / 30); game.prompt = null; return { sim, game }; };   // primo lavoro dato per fatto (se no il tutorial ti riporta indietro)
const giro = (game, sec, until) => { for (let i = 0; i < sec * 30; i++) { const c = game.control({ thr: 0, brake: 0 }, 1 / 30); if (c.brake) game.sim.v = Math.max(0, game.sim.v - 7 * c.brake / 30 * 1.4); game.update(1 / 30); if (until && until()) return true; } return false; };

test('assicurazione: in regola la carrozzeria costa la franchigia e conta come sinistro; il premio sale; scaduta si paga tutto', () => {
  const { sim, game } = trip2(); sim.damage = 0.8;
  const full = game.repairCostFull(); assert.ok(full > X.DOC.franchigia);
  const d = game.docs(); d.ass = game.s.dist / 1000 + 100;
  assert.equal(game.repairCost(), X.DOC.franchigia, 'assicurata: solo la franchigia');
  const premio0 = game.docCosto('ass'), soldi = game.s.money;
  assert.ok(game.repair().ok); assert.equal(Math.round(soldi - game.s.money), X.DOC.franchigia);
  assert.equal(game.docSinistri(), 1); assert.ok(game.docCosto('ass') > premio0, 'premio col malus');
  game.s.dist += 301000; assert.equal(game.docSinistri(), 0, 'un sinistro sparisce ogni 300 km');
  sim.damage = 0.8; game.docs().ass = 0; assert.equal(game.repairCost(), full, 'scaduta: tutto a tuo carico');
});

test('soccorso: la carrozzeria assicurata costa la franchigia e fa un sinistro', () => {
  const { sim, game } = trip2(); sim.damage = 0.8; game.docs().ass = game.s.dist / 1000 + 100;
  const sv = game.socServizi().find((s) => s.id === 'body'); assert.equal(sv.price, X.DOC.franchigia); assert.ok(sv.full > sv.price);
  assert.ok(game.socCall(['body']).ok); giro(game, 90, () => !game.soc);
  assert.equal(sim.damage, 0); assert.equal(game.docSinistri(), 1);
});

test('traino: auto distrutta = da Mario, motore rotto = da Luca; si arriva davanti all\'officina, si paga e il furgone riparte', () => {
  const { sim, game } = trip2(); sim.damage = 0.9;
  const tw = game.socServizi().find((s) => s.id === 'traino'); assert.ok(tw.ok); assert.equal(tw.dest, 'niko'); assert.ok(tw.st.x > game.s.dist);
  assert.equal(game.socTotale(['traino', 'body', 'fuel']).sv.length, 1, 'il traino sostituisce tutto');
  const soldi = game.s.money, prezzo = tw.price, x0 = tw.st.x;
  assert.ok(game.socCall(['traino']).ok); assert.ok(giro(game, 120, () => !game.soc), 'finisce');
  assert.equal(Math.round(soldi - game.s.money), prezzo, 'solo il traino, niente uscita');
  assert.ok(Math.abs(game.s.dist - (x0 - 22)) < 1, 'davanti all\'officina'); assert.equal(game.ap, null);
  assert.ok(game.dia().some((e) => e.tipo === 'soc' && /Trainato/.test(e.txt)));
  const b = trip2(); b.sim.damage = 0.1; assert.ok(!b.game.socServizi().find((s) => s.id === 'traino').ok, 'l\'auto cammina: niente traino');
});

test('traino: se salteresti la consegna non si può', () => {
  const { sim, game } = trip2(); sim.damage = 0.9;
  const x = game.socServizi().find((s) => s.id === 'traino').st.x; game.vgGoal = () => ({ x: x - 100 }); assert.ok(game.socServizi().find((s) => s.id === 'traino').ok, 'senza consegna in corso si può'); game.s.trunk.push({ kind: 'missione', kg: 1 });
  const tw = game.socServizi().find((s) => s.id === 'traino'); assert.ok(!tw.ok); assert.match(tw.info, /consegna/);
});

test('guasti: da fermo con la gomma a terra la domanda propone il soccorso, una volta sola', () => {
  const { sim, game } = trip2(); game.tyres().p[1] = 0.2; sim.v = 0;
  const chiedi = () => { for (let i = 0; i < 6; i++) { game.update(1 / 30); if (game.prompt && game.prompt.kind === 'soccorso') return true; const o = game.prompt && game.prompt.options && game.prompt.options[0]; if (o && o.act) o.act(); game.prompt = null; } return false; };   // altre domande (storia) passano prima
  assert.ok(chiedi(), 'la propone');
  game.prompt = null; assert.ok(!chiedi(), 'non la richiede');
  game.tyres().p[1] = 2.3; game.update(1 / 30); game.tyres().p[1] = 0.2; assert.ok(chiedi(), 'un guasto nuovo la richiede');
});

test('diario: capitali, incidenti, km e foto in coda', () => {
  const { sim, game } = trip2(); const foto = [];
  game.diaShot = (e) => { foto.push(e.n); return true; };
  game.update(1 / 30); game.sim.damage = 0.05; game.update(1 / 30); sim.damage = 0.4; game.update(1 / 30);
  assert.ok(game.dia().some((e) => e.tipo === 'urto'), 'incidente scritto');
  const n = game.dia().length; sim.damage = 0.9; game.update(1 / 30); assert.equal(game.dia().length, n, 'pausa tra due incidenti');
  game.s.dist += 120000; game.update(1 / 30); assert.ok(game.dia().some((e) => e.tipo === 'km' && /100 km/.test(e.txt)));
  game.loc = { id: 'tokyo', cap: true }; game.update(1 / 30); assert.ok(game.dia().some((e) => e.tipo === 'cap' && /Tokyo/.test(e.txt)));
  for (let i = 0; i < 60; i++) game.update(1 / 30);
  assert.ok(foto.length >= 2, 'foto scattate dopo l\'attesa'); assert.ok(game.dia().filter((e) => e.foto === 2).length >= 2);
  game.loc = { id: 'tokyo', cap: true }; const c = game.dia().length; game.update(1 / 30); assert.equal(game.dia().length, c, 'la capitale si scrive una volta');
});
