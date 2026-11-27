// Sigla di Duo Maniacs Studio (sigla.js, v0.168; marchio nuovo v0.172): caricata subito dopo leggero.js (il suo ascoltatore dei tasti
// deve venire prima degli altri), il disegno c'è, e nelle prove automatiche non parte.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const R = path.resolve(__dirname, '..');

test('la sigla si carica subito dopo leggero.js, prima di ogni altro script', () => {
  const html = fs.readFileSync(path.join(R, 'index.html'), 'utf8');
  const script = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
  assert.strictEqual(script[0], 'leggero.js');
  assert.strictEqual(script[1], 'sigla.js');
});

test('il disegno del logo è un PNG piccolo, e la sigla si spegne nelle prove automatiche', () => {
  const png = fs.readFileSync(path.join(R, 'img/dms/logo.png'));
  assert.strictEqual(png.toString('hex', 1, 4), '504e47');
  const w = png.readUInt32BE(16), h = png.readUInt32BE(20);
  assert.ok(w <= 320 && h <= 180, `troppo grande: ${w}×${h}`);
  const src = fs.readFileSync(path.join(R, 'sigla.js'), 'utf8');
  assert.match(src, /navigator\.webdriver/);
  assert.match(src, /sessionStorage/);
});
