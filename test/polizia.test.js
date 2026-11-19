// Prove della polizia (polizia.js): fermo con documenti, contestazione, fuga, autovelox e Tutor, pattuglia in coda, etilometro.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'valigette.js', 'traguardi.js', 'ruota.js', 'concessionario.js', 'usato.js', 'sfascio.js', 'garage.js', 'documenti.js', 'polizia.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, DOC, POL, POL_SCUSE, alcFine, VG } = new Function(src + ';return { SupraSim, StreetGame, DOC, POL, POL_SCUSE, alcFine, VG };')();
// viaggio in corso, documenti in regola, auto che va dritta a una velocità fissa
const trip = (rnd = () => 0.5) => {
  const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.money = 10000; game.s.vg.firstDone = true;
  game.polRnd = rnd; game.nextSpawn = 1e9; game.trafficOn = false; game.nextRoadEvent = 1e9;
  const d = game.docs(); d.ass = d.bollo = d.rev = 1e6;
  game.s.dist = 20000; game.s.far = 20000;
  for (let i = 0; i < 6; i++) { game.update(1 / 30); if (game.prompt) game.answer(0); }   // capitolo e domande d'inizio
  game.prompt = null;
  return { sim, game };
};
const run = (game, sec, v) => { for (let t = 0; t < sec; t += 1 / 30) { if (v !== undefined && !game.ap) { game.sim.v = v; } game.update(1 / 30); if (game.prompt && game.prompt.kind !== 'police') game.answer(0); } };

test('polizia: fermato oltre i 136, si può pagare, contestare o scappare; i documenti si guardano sempre', () => {
  const { game } = trip(); const kmh = 160, sf = { over: 23, fine: 173 };
  game.sim.v = kmh / 3.6; game.polStop(null, 'speed', { kmh, sf });
  assert.ok(game.ap, 'il gioco ti fa accostare'); game.ap.onStop();
  assert.equal(game.prompt.title, 'Eccesso di velocità');
  assert.deepEqual(game.prompt.options.map((o) => o.label), ['Paga € 170', 'Contesta', 'Scappa']);
  assert.match(game.prompt.text, /in regola/);
  const m = game.s.money; game.answer(0);
  assert.equal(game.s.money, m - 170); assert.equal(game.s.heat, 1); assert.equal(game.pol.stop, null);
});

test('polizia: con l\'assicurazione scaduta la paghi lì, oltre alle multe dei documenti', () => {
  const { game } = trip(); const d = game.docs(); d.ass = 0;
  game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop();
  const ass = game.docCosto('ass'), tot = 170 + DOC.multa.ass;
  assert.equal(game.prompt.options[0].label, `Paga € ${(tot + ass).toLocaleString('it-IT')}`);
  game.answer(0);
  assert.deepEqual(game.docScaduti(), [], 'assicurazione rinnovata');
});

test('polizia: la contestazione ha quattro esiti con le probabilità della scusa', () => {
  const q = POL_SCUSE[3];                                      // «Mi scusi, ha ragione»: [0.1, 0.5, 0.38, 0.02]
  const esito = (k) => { const { game } = trip(() => k); game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop(); const S = game.pol.stop; game.polScusa(S, q); return S; };
  assert.equal(esito(0.05).esito, 0); assert.equal(esito(0.3).esito, 1); assert.equal(esito(0.3).tot, 90);
  assert.equal(esito(0.8).esito, 2); assert.equal(esito(0.995).esito, 3); assert.equal(esito(0.995).tot, 260);
  for (const s of POL_SCUSE) assert.ok(Math.abs(s.p.reduce((a, b) => a + b, 0) - 1) < 1e-9, s.t);
  const { game } = trip(); game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop();
  game.answer(1); assert.equal(game.prompt.title, 'Contesti'); assert.equal(game.prompt.options.length, 3);
  assert.ok(game.prompt.options.every((o) => !/analcolica|assicurazione/i.test(o.label)), 'solo scuse buone per la velocità');
});

test('polizia: scappando sei ricercato; la volante distanziata sparisce ma resti ricercato, e se ti raggiunge non ti ferma', () => {
  const { game } = trip(() => 0.9);                              // 0.9: niente posto di blocco
  game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop(); game.answer(2);
  assert.ok(game.pol.ch, 'inseguimento'); assert.equal(game.polState().fuga, true);
  run(game, 40, 70);                                             // 252 km/h: più forte della volante
  assert.equal(game.pol.ch, null, 'sparita dagli specchietti'); assert.equal(game.polState().fuga, true, 'ancora ricercato');
  assert.ok(game.s.heat >= 3, 'ricercato: ' + game.s.heat);
  const b = trip(() => 0.9).game;
  b.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); b.ap.onStop(); b.answer(2);
  run(b, 30, 8);                                                  // va piano: la volante gli sta dietro
  assert.equal(b.pol.stop, null, 'nessun fermo'); assert.equal(b.ap, null, 'nessuna frenata automatica'); assert.ok(b.pol.ch, 'ancora dietro');
});

test('polizia: da ricercato le altre pattuglie non ti fanno accostare, ti inseguono; entrando in un locale si dimenticano di te', () => {
  const { game } = trip(() => 0.9);
  game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }); game.ap.onStop(); game.answer(2);
  run(game, 40, 70); assert.equal(game.pol.ch, null);
  // nessun fermo automatico: velocità, posto di controllo, etilometro
  assert.equal(game.polStop(null, 'speed', { kmh: 200, sf: { over: 60, fine: 543 } }), false);
  assert.equal(game.polStop(null, 'docs'), false); assert.equal(game.polStop(null, 'alcol', { gl: 1 }), false);
  assert.equal(game.ap, null); assert.equal(game.prompt, null);
  // una volante ferma più avanti: la bruci a 200 km/h e ti insegue lei
  const e = { id: 999, kind: 'police', lane: 0, x: game.s.dist + 40, v: 0, busy: true, still: true, hazard: true };
  game.ents.push(e); run(game, 1.5, 200 / 3.6);
  assert.equal(game.pol.stop, null); assert.equal(game.ap, null, 'niente frenata');
  assert.ok(game.pol.ch && game.pol.ch.e === e, 'la volante bruciata ti insegue'); assert.ok(!e.hazard && !e.busy);
  // ti infili in un locale: ricercato azzerato
  const p = { ok: true, id: 'bar', x: game.s.dist + 30, name: 'Bar', rel: 30 };
  assert.ok(game.enterPlace(p));
  assert.equal(game.polState().fuga, false); assert.equal(game.s.heat, 0); assert.equal(game.pol.ch, null);
  assert.ok(!game.ents.includes(e), 'la volante è andata avanti');
  // e dopo si torna alla normalità: la prossima volante ti ferma di nuovo
  game.ap = null; game.inside = null;
  assert.equal(game.polStop(null, 'speed', { kmh: 150, sf: { over: 13, fine: 173 } }), true);
});

test('polizia: autovelox e Tutor sono pochi, a volte con tratti liberi di 7-12 km, e il verbale arriva dopo', () => {
  const { game } = trip(); const S = game.polState();
  for (let k = 0; k < 200; k++) { game.s.dist += 1000; game.polPlan(); }
  const xs = []; let free = 0;
  const all = [];                                                // tutti quelli pianificati (polPlan butta i vecchi)
  const g2 = trip(Math.random).game; for (let k = 0; k < 400; k++) { g2.s.dist += 1000; g2.polPlan(); for (const c of g2.polState().ctl) if (!all.includes(c)) all.push(c); }
  all.sort((a, b) => a.x - b.x);
  for (let i = 1; i < all.length; i++) { const gap = (all[i].x - (all[i - 1].x2 || all[i - 1].x)) / 1000; xs.push(gap); if (gap >= 7) free++; }
  assert.ok(Math.min(...xs) >= 2.4, 'mai uno sopra l\'altro');
  assert.ok(free / xs.length > 0.2 && free / xs.length < 0.5, 'tratti liberi ogni tanto: ' + free / xs.length);
  assert.ok(S.ctl.length > 0);
  // autovelox: a 160 scatta, il verbale arriva qualche km dopo
  const { game: g } = trip(); g.polState().nextKm = 1e9; g.polState().ctl = [{ k: 'velox', x: g.s.dist + 30 }];
  const m = g.s.money; run(g, 1.5, 160 / 3.6);
  assert.equal(g.polState().verb.length, 1); assert.equal(g.s.money, m, 'non subito');
  g.s.dist += 6000; g.update(1 / 30); assert.equal(g.s.money, m - 173);
  // Tutor: conta la media, non la punta
  const { game: t } = trip(); t.polState().nextKm = 1e9; t.polState().ctl = [{ k: 'tutor', x: t.s.dist + 10, x2: t.s.dist + 1010 }];
  run(t, 4, 40); run(t, 30, 30);                                // una punta a 144 e poi 108: media sotto i 136
  assert.equal(t.polState().verb.length, 0);
  assert.ok(t.polPins(t.s.dist - 5000, t.s.dist + 5000).length >= 0);
});

test('polizia: la pattuglia in coda ti ferma solo se passi i 136', () => {
  const { game } = trip(() => 0.1); const S = game.polState(); S.codaKm = 0; S.nextKm = 1e9;
  run(game, 0.2, 30); assert.ok(game.pol.tail, 'volante dietro');
  run(game, 3, 34); assert.ok(!game.pol.stop, "a 122 km/h non succede niente");
  run(game, 3, 42); assert.ok(game.pol.stop && game.pol.stop.why === 'speed');
});

test('polizia: etilometro a un bar su cinque, multa sopra 0,5 g/l, l\'alcol cala col tempo', () => {
  const { game } = trip(); const bars = [];
  for (let n = 0; n < 100; n++) if (game.polBarCheck(n)) bars.push(n);
  assert.equal(bars.length, 20);
  assert.equal(alcFine(0.3), 0); assert.equal(alcFine(0.6), 543); assert.equal(alcFine(1), 800); assert.equal(alcFine(2), 1500);
  assert.ok(game.polDrink('birra').ok); assert.ok(game.polDrink('whisky').ok); assert.ok(Math.abs(game.s.vg.alc - 0.65) < 1e-9);
  game.polStop({ id: 9, kind: 'police', lane: 0, x: game.s.dist, v: 0 }, 'alcol', { gl: game.s.vg.alc }); game.ap.onStop();
  assert.match(game.prompt.text, /0,65 g\/l/); assert.equal(game.prompt.options[0].label, 'Paga € 543');
  game.answer(0);
  game.s.vg.alc = 0.2; assert.equal(game.polStop(null, 'alcol', { gl: 0.2 }), false, 'sotto il limite si riparte');
  game.s.vg.alc = 1; game.polAlc(1000); assert.ok(game.s.vg.alc < 0.7);
});
