// Prove della notte (notte.js): giorno e notte cambiano volanti e cose strane, radio che disturba, «Quella dietro»;
// e i finali della storia: ogni condizione dell'ultima porta viene messa da qualcosa che nel gioco succede davvero.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const rd = (f) => readFileSync(new URL(f, dir), 'utf8');
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'valigette.js', 'traguardi.js', 'ruota.js', 'concessionario.js', 'usato.js', 'sfascio.js', 'garage.js', 'documenti.js', 'polizia.js', 'notte.js'].map(rd).join('\n');
const { SupraSim, StreetGame, NOTTE, NOTTE_DIETRO } = new Function(src + ';return { SupraSim, StreetGame, NOTTE, NOTTE_DIETRO };')();
const trip = (rnd = () => 0.5) => {
  const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.vg.firstDone = true;
  game.notteRnd = rnd; game.polRnd = () => 0.99; game.nextSpawn = 1e9; game.trafficOn = false; game.nextRoadEvent = 1e9;
  game.s.dist = 20000; game.s.far = 20000;
  for (let i = 0; i < 6; i++) { game.update(1 / 30); if (game.prompt) game.answer(0); }
  game.prompt = null;
  return { sim, game };
};

test('notte: di notte meno volanti e più cose strane, di giorno il contrario', () => {
  const { game } = trip();
  game.dayK = 0; assert.ok(game.notte()); assert.equal(game.notteK('police'), NOTTE.police.notte); assert.equal(game.notteK('horror'), NOTTE.horror.notte);
  game.dayK = 1; assert.ok(!game.notte()); assert.equal(game.notteK('police'), 1); assert.ok(game.notteK('horror') < 1);
  assert.ok(NOTTE.police.notte < NOTTE.police.giorno && NOTTE.horror.notte > NOTTE.horror.giorno);
});

test('notte: la radio disturba solo di notte e ripete un avviso di qualche minuto prima', () => {
  const { game } = trip(() => 0.1); const heard = [];
  game.onRadioDist = (t) => heard.push(t);
  game.say('Rifornimento: 30 litri, la pompa numero 4 gocciola', 'fuel');
  game.dayK = 1; game.s.vg.radioKm = 0; game.update(1 / 30);
  assert.equal(heard.length, 0, 'di giorno niente');
  game.notteT += NOTTE.ecoMin + 1; game.dayK = 0; game.s.vg.radioKm = 0; game.update(1 / 30);
  assert.equal(heard.length, 1); assert.ok(game._eco.some((e) => e.text === heard[0]), 'è un avviso già sentito: ' + heard[0]);
  assert.ok(game.s.vg.radioKm > game.s.dist / 1000 + NOTTE.radioKm[0] - 0.01, 'il prossimo tra qualche km');
});

test('notte: «Quella dietro» parte di notte uscendo dal benzinaio, una volta sola, e l\'altra sparisce quando te ne vai', () => {
  const { game } = trip(); game.dayK = 0;
  game.inside = { id: 'fuel', phase: 'shop', x: game.s.dist };
  game.exitPlace(); game.inside = null; game.update(1 / 30);
  assert.equal(game.prompt && game.prompt.title, 'Il benzinaio');
  const twin = game.ents.find((e) => e.twin); assert.ok(twin, 'l\'altra auto è parcheggiata dietro'); assert.equal(twin.vt, game.car); assert.equal(twin.lane, 0);
  game.answer(0); assert.equal(game.prompt.title, 'Dietro il market'); assert.ok(!game.ents.includes(twin), 'vai a vedere: il posto è vuoto'); game.answer(0);
  // chi lascia stare se la ritrova dietro finché non se ne va
  const c = trip().game; c.dayK = 0; c.inside = { id: 'fuel', phase: 'shop', x: c.s.dist }; c.exitPlace(); c.inside = null; c.update(1 / 30);
  const t2 = c.ents.find((e) => e.twin); c.answer(1); c.update(1 / 30); assert.ok(c.ents.includes(t2));
  c.s.dist += 120; c.update(1 / 30); assert.ok(!c.ents.includes(t2), 'allontanandosi non c\'è più');
  // una volta sola, e mai di giorno
  game.inside = { id: 'fuel', phase: 'shop', x: game.s.dist }; game.exitPlace(); game.inside = null; game.update(1 / 30);
  assert.ok(!game.prompt || game.prompt.title !== 'Il benzinaio');
  const b = trip().game; b.dayK = 1; b.inside = { id: 'fuel', phase: 'shop', x: b.s.dist }; b.exitPlace(); b.inside = null; b.update(1 / 30);
  assert.ok(!b.prompt || b.prompt.title !== 'Il benzinaio', 'di giorno no');
  assert.ok(NOTTE_DIETRO.sms.length > 10);
});

test('finali: ogni condizione dell\'ultima porta la mette qualcosa che nel gioco succede davvero', () => {
  // le condizioni lette da storiaPorta (f.nome) devono avere chi le mette: una risposta delle chat raggiungibile
  // da un ingresso, una scena della regia, oppure il codice di storia e regia
  const storia = rd('storia.js'), regia = rd('regia.js');
  const porta = storia.slice(storia.indexOf('function storiaPorta'), storia.indexOf('const chatConfOf'));
  const prove = storia.slice(storia.indexOf('function storiaProve'), storia.indexOf('function storiaPorta'));
  const nomi = [...new Set([...(porta + prove).matchAll(/f\.([a-z_]+)|'([a-z_]+)'/g)].map((m) => m[1] || m[2]).filter((n) => n && !['esplicito', 'aperto'].includes(n) && /_/.test(n) || n === 'livia'))];
  const D = new Function(rd('chat_dati.js') + ';return { CHAT_LIST, CHAT_START, CHAT_UNLOCK };')();
  const byId = new Map(D.CHAT_LIST.map((n) => [n.id, n]));
  // nodi raggiungibili: ingressi, soglie di confidenza, scene della regia, e da lì le risposte
  const start = [...D.CHAT_START.map((x) => x.node), ...Object.values(D.CHAT_UNLOCK).flatMap((o) => Object.values(o).flat()), ...[...regia.matchAll(/'(V2_[A-Z0-9_]+)'/g)].map((m) => m[1])];
  const seen = new Set(), q = start.filter((id) => byId.has(id));
  while (q.length) { const id = q.pop(); if (seen.has(id)) continue; seen.add(id); const n = byId.get(id); for (const o of n.opts || []) { if (o.to && byId.has(o.to)) q.push(o.to); } if (n.next && byId.has(n.next)) q.push(n.next); }
  const daChat = new Set();
  for (const id of seen) for (const o of byId.get(id).opts || []) for (const fx of o.fx || []) { const m = /^flag:([a-z_]+)/.exec(fx); if (m) daChat.add(m[1]); }
  const daCodice = (n) => new RegExp(`(f|flags)\\.${n}\\s*=|\\b${n}'\\s*[,}]|'${n}'`).test(storia + regia);
  const mancano = nomi.filter((n) => !daChat.has(n) && !daCodice(n));
  assert.ok(nomi.length >= 8, 'condizioni trovate: ' + nomi.join(', '));
  assert.deepEqual(mancano, [], 'nessuno le mette: ' + mancano.join(', '));
});
