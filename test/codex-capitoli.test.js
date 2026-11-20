// Modifica Codex (adattata da Claude il 18/11): un capitolo del Viaggio è letto quando lo confermi, non quando compare.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame } = new Function(src + ';return { SupraSim, StreetGame };')();

const nuova = () => { const g = new StreetGame(new SupraSim(), () => 0.5); g.startTrip(); g.trafficOn = false; g.nextRoadEvent = 1e9; return g; };
const gira = (g, secs) => { for (let i = 0; i < secs * 60; i++) { g.sim.v = 0; g.update(1 / 60); } };

test('capitoli: il primo capitolo compare alla partenza ma non è ancora letto', () => {
  const g = nuova();
  assert.equal(g.prompt && g.prompt.kind, 'story');
  assert.ok(!g.s.vg.chapters[0]);
  g.answer(0); assert.equal(g.s.vg.chapters[0], true, 'con «Parti» diventa letto');
});

test('capitoli: se la domanda sparisce senza risposta (pagina ricaricata, locale) il capitolo ritorna', () => {
  const g = nuova(); const titolo = g.prompt.title;
  g.prompt = null;                                   // come una ricarica a capitolo aperto: la domanda non si salva
  const g2 = new StreetGame(new SupraSim(), () => 0.5); g2.load(g.save()); g2.trafficOn = false; g2.nextRoadEvent = 1e9;
  gira(g2, 0.5);
  assert.ok(g2.prompt && g2.prompt.title === titolo, 'il capitolo si ripresenta');
});

test('capitoli: se scade il tempo vale come letto e non si ripete', () => {
  const g = nuova(), titolo = g.prompt.title; gira(g, 42);
  assert.equal(g.s.vg.chapters[0], true);
  gira(g, 2); assert.ok(!g.prompt || g.prompt.title !== titolo, 'non ricompare');
});

test('capitoli: non scavalca un\'altra domanda già aperta', () => {
  const g = nuova(); g.answer(0); g.s.vg.chapters = {};
  g.ask({ kind: 'altro', title: 'Altra domanda', options: [{ label: 'Ok' }] });
  g.vgChapter(0);
  assert.equal(g.prompt.kind, 'altro');
});
