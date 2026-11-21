// Prove dell'alta definizione leggera di insegne e oggetti (insegne2d.js): il carattere fine copre tutte le lettere del vecchio.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../insegne2d.js', import.meta.url), 'utf8');
const PX = readFileSync(new URL('../street2d.js', import.meta.url), 'utf8').match(/const PX_FONT = \{([\s\S]*?)\n\};/)[1];
const pxKeys = [...PX.matchAll(/^\s*'?(.)'?\s*:/gm)].map((m) => m[1]);

test('insegne: il carattere 5×7 ha tutte le lettere e le cifre del carattere a pixel della strada', () => {
  function Street2D() {} Street2D.prototype.text = () => {}; Street2D.prototype.prop = () => {};
  new Function('Street2D', src)(Street2D);
  const F5 = Street2D.insegneHD.F5;
  for (const k of pxKeys) if (/[A-Z0-9]/.test(k)) assert.ok(F5[k], `manca ${k}`);
  for (const k in F5) assert.equal(F5[k].length, 7, `${k}: sette righe`);
});
