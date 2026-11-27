// Schermata iniziale viva (titolo_vivo.js, v0.174): caricata dopo titolo.js, disegna con una copia del gioco e non tocca la partita.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const R = path.resolve(__dirname, '..');

test('titolo_vivo.js viene subito dopo titolo.js e usa una copia del gioco', () => {
  const html = fs.readFileSync(path.join(R, 'index.html'), 'utf8');
  const script = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
  assert.strictEqual(script[script.indexOf('titolo.js') + 1], 'titolo_vivo.js');
  const src = fs.readFileSync(path.join(R, 'titolo_vivo.js'), 'utf8');
  assert.match(src, /Object\.create\(G\)/);                 // la partita vera non si tocca
  assert.match(src, /st\.s = Object\.assign\(\{\}, G\.s/);   // km suoi
  assert.match(src, /titolo=fermo/);                        // il quadro di prima resta per le prove
});
