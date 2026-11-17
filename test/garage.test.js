// Prove del garage: categorie delle sfide, collezione, traguardi da collezionista.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'valigette.js', 'traguardi.js', 'ruota.js', 'concessionario.js', 'usato.js', 'sfascio.js', 'garage.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, ST_CAT, stCat, GAME_LANE_Z, GAR_ZIO, CARS } = new Function(src + ';return { SupraSim, StreetGame, ST_CAT, stCat, GAME_LANE_Z, GAR_ZIO, CARS };')();
const trip = () => { const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.dist = 20000; game.s.money = 100000; return { sim, game }; };

test('categorie: ogni auto del gioco ne ha una sola', () => {
  const all = Object.values(ST_CAT).flat();
  assert.equal(new Set(all).size, all.length, 'nessuna auto in due categorie');
  for (const id of Object.keys(CARS)) assert.ok(all.includes(id), `${id} senza categoria`);
});

// quante volte, su 200 colpi di abbaglianti, l'auto davanti accetta la sfida
function sfide(game, sim, vt) {
  let n = 0;
  for (let i = 0; i < 200; i++) {
    game.street = null; game.race = null;
    game.ents = [{ id: i, kind: 'traffic', vt, len: 4.2, lane: game.lane, x: game.s.dist + 30, v: 25, vT: 25, vBase: 25 }];
    game.laneZ = GAME_LANE_Z[game.lane]; sim.v = 30;
    if (game.flashLights() === 'race') n++;
  }
  return n;
}
test('sfide: solo tra auto della stessa categoria', () => {
  const { game, sim } = trip();                                          // si parte con la V40: familiare
  assert.equal(stCat(game.car), 'familiare');
  assert.equal(sfide(game, sim, 'e36'), 0, 'una sportiva non sfida una familiare');
  assert.equal(sfide(game, sim, 'panda'), 0, 'un\'utilitaria nemmeno');
  assert.ok(sfide(game, sim, 'a80') > 40, 'un\'altra familiare sì');
  assert.equal(sfide(game, sim, 'doblo'), 0, 'i mezzi da lavoro mai');
});

test('collezione: le auto avute restano contate anche dopo averle vendute; traguardi', () => {
  const { game } = trip(); game.s.dist = 300000;
  game.dlBuy('panda', 'cash'); game.dlBuy('e30', 'cash');
  assert.deepEqual(Object.keys(game.garColl()).sort(), ['e30', 'panda', 'v40']);
  game.achStep(0.25); assert.ok(game.ach().got.garage, 'tre auto nel garage (traguardo che c\'era già)');
  game.inside = null; game.dlSell('e30'); assert.ok(game.garColl().e30, 'venduta ma contata');
  for (const id of GAR_ZIO) if (!game.s.vg.garage.includes(id)) game.dlBuy(id, 'cash');
  game.achStep(0.25); assert.ok(game.ach().got.zio6, 'le sei del garage dello zio');
  assert.ok(game.ach().got.marche5, 'Fiat, Audi, Volvo, Opel, Volkswagen, BMW');
  assert.ok(!game.ach().got.categorie, 'manca la piccola sportiva');
  game.dlBuy('golf', 'cash'); game.achStep(0.25); assert.ok(game.ach().got.categorie);
});

test('garage: stato delle auto (quella che guidi in cima) e valore', () => {
  const { game, sim } = trip(); game.dlBuy('panda', 'cash'); sim.damage = 0.4;
  const L = game.garList(); assert.equal(L[0].id, game.car); assert.ok(L[0].cur && Math.abs(L[0].damage - 0.4) < 1e-9);
  assert.ok(L.find((s) => s.id === 'panda').value > 0);
});
