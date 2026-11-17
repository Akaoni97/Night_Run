// L'auto ereditata all'inizio del primo Viaggio: malconcia, una volta sola.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js', 'samples.js', 'game.js', 'viaggio.js', 'strada.js', 'missioni.js']
  .map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim, StreetGame } = new Function(src + ';return { SupraSim, StreetGame };')();

test('eredità: gomme sgonfie e consumate, tagliando da fare, ammaccata, poca benzina; non si ripete', () => {
  const sim = new SupraSim(), game = new StreetGame(sim, () => 0.5); game.startTrip();
  assert.ok(game.vgInherit());
  assert.ok(Math.max(...game.tyres().p) < 2, 'gomme sgonfie'); assert.ok(sim.tireWear > 0.4 && sim.damage > 0.1 && sim.fuel < 0.3);
  const m = game.maint(); assert.ok(m.oil < 0.3 && m.pads < 0.4 && m.dirt > 0.9);
  game.inflate(); game.tyreUpdate(0.1, 0); const k = sim.tyreK; assert.ok(k > 0.95, 'gonfiate tornano a posto');
  assert.equal(game.vgInherit(), false, 'una volta sola');
});
