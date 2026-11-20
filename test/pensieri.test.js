// Prove dei pensieri del protagonista: arrivano al km giusto, non si ripetono, rispettano la pausa e i luoghi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'pensieri.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, PENS_KM, PENS_BISOGNI, PENS_ANIMO, PENS_STATO } = new Function(src + ";return { SupraSim, StreetGame, PENS_KM, PENS_BISOGNI, PENS_ANIMO, PENS_STATO };")();

// una partita del Viaggio che sta guidando a 72 km/h, senza la domanda del capitolo 0
function nuova(km = 0) {
  const g = new StreetGame(new SupraSim(), Math.random);
  g.startTrip(); g.prompt = null; g.sim.v = 20; g.s.dist = km * 1000; g.s.vg.lastKm = km;
  return g;
}
const passa = (g, sec) => { for (let i = 0; i < sec; i++) g.vgPensTick(1); };

test('pensieri: la radio arriva al km 1, una volta sola', () => {
  const g = nuova(0.5); passa(g, 60);
  assert.equal(g.thought, undefined, 'prima del km 1 niente');
  g.s.dist = 1200; passa(g, 1);
  assert.ok(/radio/i.test(g.thought.text) && /mai sentite/.test(g.thought.text), 'la radio che non conosce le stazioni');
  const id = g.thought.id; g.s.dist = 1500; passa(g, 120);
  assert.ok(g.thought.id === id || !/radio/i.test(g.thought.text), 'la radio non torna');
});

test('pensieri: durano da 8 a 10 secondi e poi scadono', () => {
  const g = nuova(1.2); passa(g, 1);
  const t = g.thought; assert.ok(t.left >= 8 - 1 && t.left <= 10, 'durata 8-10 s');
  passa(g, 11); assert.ok(g.thought.left <= 0, 'scaduto');
});

test('pensieri: fame, sete e sonno parlano presto e poi con urgenza, mai la stessa frase di fila', () => {
  const g = nuova(0); g.s.vg.pens = undefined; g.s.dist = 0;
  g.s.vg.needs.food = 0.4; passa(g, 1); assert.ok(PENS_BISOGNI.food[0].includes(g.thought.text), 'prima la fame leggera');
  passa(g, 30); const primo = g.thought.id;
  g.s.vg.needs.food = 0.1; passa(g, 1); assert.ok(g.thought.id !== primo && PENS_BISOGNI.food[1].includes(g.thought.text), 'poi quella forte');
  // il mazzo: finché non sono uscite tutte le frasi non se ne ripete nessuna
  const visti = new Set(); const n = PENS_BISOGNI.sleep[0].length;
  for (let i = 0; i < n; i++) visti.add(g.vgPensDraw(PENS_BISOGNI.sleep[0], 'sleep1'));
  assert.equal(visti.size, n, 'tutte diverse prima di ricominciare');
});

test('pensieri: rispettano la pausa e tacciono in un locale, davanti a una domanda e da fermi', () => {
  const g = nuova(0); g.s.vg.needs.water = 0.3; passa(g, 1);
  const id = g.thought.id; g.s.vg.needs.food = 0.1; passa(g, 10);
  assert.equal(g.thought.id, id, 'dopo meno di 25 secondi non ne arriva un altro');
  passa(g, 20); assert.ok(g.thought.id !== id, 'poi sì');
  const h = nuova(0); h.s.vg.needs.food = 0.1;
  h.inside = { id: 'bar' }; passa(h, 60); assert.equal(h.thought, undefined, 'dentro un locale no');
  h.inside = null; h.prompt = { kind: 'story' }; passa(h, 60); assert.equal(h.thought, undefined, 'con una domanda no');
  h.prompt = null; h.sim.v = 0; passa(h, 60); assert.equal(h.thought, undefined, 'da fermi no');
  h.sim.v = 20; passa(h, 1); assert.ok(h.thought, 'guidando sì');
});

test('pensieri: quelli a caso non si ripetono mai nella stessa partita', () => {
  const g = nuova(30); g.s.vg.needs = { food: 1, water: 1, sleep: 1, wash: 1 };
  g.vgPensTick(0);                                                                 // crea lo stato (e dice il primo pensiero per km)
  const p = g.s.vg.pens; for (const k of PENS_KM) p.seen[k.id] = true;           // i pensieri per km sono già usciti
  const visti = [];
  for (let i = 0; i < 4000 && visti.length < PENS_ANIMO.length + 3; i++) { const id = g.thoughtN || 0; g.vgPensTick(1); if ((g.thoughtN || 0) !== id) visti.push(g.thought.text); }
  assert.equal(new Set(visti).size, visti.length, 'nessuna ripetizione');
  assert.ok(visti.length >= 3 && visti.length <= PENS_ANIMO.length, 'ne escono, e non più di quanti ce ne sono');
});

test('pensieri: ogni frase è scritta bene', () => {
  const tutte = [...PENS_KM.map((k) => k.text), ...PENS_ANIMO, ...Object.values(PENS_BISOGNI).flat(2)];
  for (const t of tutte) assert.ok(t.length > 12 && t.length < 130, t);
  assert.equal(new Set(tutte).size, tutte.length, 'nessuna frase doppia');
});

test('pensieri: com\'è messa l\'auto (fari rotti, rosso, ricercato) si dice quando comincia, una volta', () => {
  const { game } = (() => { const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.vg.firstDone = true; return { sim, game }; })();
  const p = game.s.vg.pens || (game.vgPensTick(0), game.s.vg.pens);
  for (const k of Object.keys(PENS_KM)) p.seen[PENS_KM[k].id] = true;
  game.s.vg.needs = { food: 1, water: 1, sleep: 1, wash: 1 }; game.sim.v = 20; game.sim.damage = 0.5;
  game.prompt = null; game.inside = null; p.last = -999; game.vgPensTick(1);
  assert.ok(PENS_STATO.luci.frasi.includes(game.thought.text) || PENS_STATO.motore.frasi.includes(game.thought.text), game.thought.text);
});
