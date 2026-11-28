// La pompa del benzinaio (pompa.js, v0.180): la pistola si tiene premuta, il grilletto si stringe piano, si ferma da sola
// a serbatoio pieno o al prepagato, si paga riagganciando (o uscendo), cifra tonda abbonata.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js', 'pompa.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame, POMPA, GAME_FUEL_PRICE } = new Function(src + ';return { SupraSim, StreetGame, POMPA, GAME_FUEL_PRICE };')();
const alla = (fuel = 0.2, money = 500) => {
  const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip(); game.s.money = money; game.prompt = null;
  sim.fuel = fuel; game.inside = { id: 'fuel', phase: 'shop', t: 0, x: game.s.dist, park: 0 }; return { sim, game };
};
const tieni = (game, s, dt = 1 / 60) => { game.pompaStringi(true); for (let i = 0; i < s / dt; i++) game.pompaPasso(dt); game.pompaStringi(false); for (let i = 0; i < 20; i++) game.pompaPasso(dt); };

test('pompa: tenendo premuto entra benzina, piano all\'inizio e più forte col grilletto stretto; lasciando si ferma', () => {
  const { sim, game } = alla();
  assert.ok(game.pompaApri(0).ok);
  const F = game.inside.fill; game.pompaStringi(true);
  for (let i = 0; i < 6; i++) game.pompaPasso(1 / 60);
  const presto = F.flow;
  for (let i = 0; i < 60; i++) game.pompaPasso(1 / 60);
  assert.ok(presto > 0 && presto < F.flow, 'il flusso cresce mentre stringi');
  assert.ok(Math.abs(F.flow - POMPA.flussoMax) < 0.01, 'grilletto tutto stretto');
  game.pompaStringi(false); for (let i = 0; i < 10; i++) game.pompaPasso(1 / 60);
  assert.equal(F.flow, 0, 'lasciato: si ferma');
  const g0 = F.got; for (let i = 0; i < 60; i++) game.pompaPasso(1 / 60); assert.equal(F.got, g0);
  assert.ok(Math.abs(sim.fuel * sim.P.tank - (0.2 * sim.P.tank + F.got)) < 1e-6, 'nel serbatoio quello che è uscito');
});

test('pompa: a serbatoio pieno la pistola scatta; si paga riagganciando, solo quello che è entrato', () => {
  const { sim, game } = alla(0.5, 500);
  game.pompaApri(0); tieni(game, 30);
  const F = game.inside.fill; assert.ok(F.scatto && F.perche === 'pieno'); assert.ok(sim.fuel > 0.999);
  const soldi = game.s.money, r = game.pompaPaga();
  assert.ok(r.ok); assert.ok(Math.abs(soldi - game.s.money - r.pagato) < 1e-9); assert.equal(game.inside.fill, null);
  assert.ok(Math.abs(r.litri - 0.5 * sim.P.tank) < 0.01);
});

test('pompa: prepagato si ferma alla cifra; cifra tonda abbonata; uscendo con la pistola in mano si paga', () => {
  { const { game } = alla(0.1); game.pompaApri(20); tieni(game, 20); const F = game.inside.fill;
    assert.ok(F.scatto && F.perche === 'prepagato'); assert.ok(Math.abs(F.cost - 20) < 0.01); }
  { const { game } = alla(0.1); game.pompaApri(0); const F = game.inside.fill;
    F.got = 20.02 / GAME_FUEL_PRICE; F.cost = 20.02; const m = game.s.money, r = game.pompaPaga();
    assert.ok(r.tondo); assert.equal(Math.round((m - game.s.money) * 100) / 100, 20); }
  { const { game } = alla(0.1); game.pompaApri(0); tieni(game, 1); const F = game.inside.fill, c = Math.round(F.cost * 100) / 100, m = game.s.money;
    game.exitPlace(); assert.ok(Math.abs(m - game.s.money - c) < 0.051, 'pagato uscendo'); assert.equal(game.inside.fill, null); }
  { const { game } = alla(0.1, -600); assert.equal(game.pompaApri(0).ok, false, 'oltre il fido niente benzina'); }
});
