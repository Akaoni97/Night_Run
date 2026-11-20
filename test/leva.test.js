// Prove del parcheggio (leva in P del cambio automatico): sim.park blocca il cambio e tiene ferma l'auto; di serie è spento.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const src = ['dsp.js', 'sim.js', 'tuning.js', 'cars.js'].map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
const { SupraSim } = new Function(src + ';return { SupraSim };')();

const gira = (sim, secs) => { for (let i = 0; i < secs * 60; i++) sim.update(1 / 60); };

test('leva: di serie il parcheggio è spento e l\'auto in folle rotola come prima', () => {
  const sim = new SupraSim(); assert.equal(sim.park, false);
  sim.gear = 0; sim.v = 3; gira(sim, 0.5);
  assert.ok(sim.v > 2, `rotola: ${sim.v.toFixed(2)} m/s`);
});

test('leva: in P l\'auto si ferma e resta ferma anche col gas', () => {
  const sim = new SupraSim(); sim.setIgnition(true); sim.setStarter(true); gira(sim, 2); sim.setStarter(false);
  sim.gear = 0; sim.park = true; sim.v = 1; sim.in.thr = 1; gira(sim, 2);
  assert.equal(sim.v, 0); assert.equal(sim.ww, 0);
  assert.ok(sim.rpm > 2000 || !sim.running, 'il motore sale di giri (si sgasa) ma le ruote non girano');
});
