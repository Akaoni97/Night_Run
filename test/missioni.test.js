// Prove delle missioni del Viaggio: la cassa pesante (serve il rimorchietto) non deve fermare la catena per sempre.
// L'obiettivo dice cosa serve; in bacheca si può lasciar perdere e il lavoro dopo arriva alla bacheca successiva.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, VG, VG_MISSIONS, VG_BOARDS } = new Function(src + ';return { SupraSim, StreetGame, VG, VG_MISSIONS, VG_BOARDS };')();

// partita arrivata alla cassa pesante, davanti alla sua bacheca
const allaCassa = () => {
  const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip();
  game.s.vg.firstDone = true; game.s.vg.tutEnd = true;
  const m = game.vgMisState(), i = VG_MISSIONS.findIndex((M) => M.id === 'cassa');
  m.i = i; m.phase = 'go';
  const n = m.giverN; game.s.dist = VG.stopX(n) - 50;
  return { game, m, n, i };
};

test('missioni: senza rimorchio l\'obiettivo della cassa pesante dice che serve il rimorchietto e dove', () => {
  const { game } = allaCassa();
  const G = game.vgGoal();
  assert.match(G.text, /cassa pesante/i);
  assert.match(G.note, /rimorchietto.*Motel Ovunque.*2\.200/);
});

test('missioni: in bacheca la cassa non si prende, ma si può lasciar perdere e la catena va avanti', () => {
  const { game, m, n, i } = allaCassa();
  const offers = game.vgOffers(n), cassa = offers.find((o) => o.mission), salta = offers.find((o) => o.salta);
  assert.ok(cassa, 'la cassa è in bacheca');
  const r = game.vgTake(cassa, n);
  assert.equal(r.ok, false); assert.match(r.why, /rimorchietto.*lascia perdere/);
  assert.ok(salta, 'c\'è «lascia perdere»');
  assert.equal(game.vgTake(salta, n).ok, true);
  assert.equal(m.i, i + 1, 'si passa al lavoro dopo');
  assert.equal(m.phase, 'go');
  assert.ok(m.giverN > n && VG_BOARDS.includes(VG.stop(m.giverN).id), 'alla bacheca successiva');
  assert.ok(game.vgOffers(m.giverN).some((o) => o.mission && o.title === VG_MISSIONS[i + 1].title), 'e lì c\'è la busta');
});

test('missioni: col rimorchietto attaccato la cassa si prende e «lascia perdere» non c\'è', () => {
  const { game, n } = allaCassa();
  game.s.money = 10000; game.s.dist = 30000;
  assert.equal(game.vgBuy('trailer').ok, true);
  const offers = game.vgOffers(n);
  assert.ok(!offers.some((o) => o.salta));
  assert.equal(game.vgTake(offers.find((o) => o.mission), n).ok, true);
  assert.equal(game.vgMisState().phase, 'carry');
});

test('missioni: rimorchio comprato ma staccato, l\'obiettivo dice di attaccarlo', () => {
  const { game } = allaCassa();
  game.s.money = 10000; game.s.dist = 30000; game.vgBuy('trailer'); game.vgTrailer(false);
  assert.match(game.vgGoal().note, /attacca il rimorchio/);
});
