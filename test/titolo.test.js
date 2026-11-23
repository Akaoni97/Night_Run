// Schermata iniziale (titolo.js, v0.121): le frasi, i keyframes usati dal CSS e le schede delle partite con il luogo.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const R = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(R, 'titolo.js'), 'utf8');

test('le frasi sotto il logo sono poche righe, corte e uniche', () => {
  const frasi = [...src.match(/const NT_FRASI = \[([^\]]*)\]/)[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]);
  assert.ok(frasi.length >= 5);
  assert.strictEqual(new Set(frasi).size, frasi.length);
  for (const f of frasi) assert.ok(f.length <= 34, 'troppo lunga: ' + f);
});

test('ogni animazione del CSS ha il suo @keyframes', () => {
  const usati = new Set([...src.matchAll(/animation:\s*(nt[A-Za-z]+)/g)].map((m) => m[1]));
  assert.ok(usati.size >= 8);
  for (const k of usati) assert.ok(new RegExp('@keyframes ' + k + '[{ ]').test(src), 'manca @keyframes ' + k);
});

test('«Accendi e parti» gira la chiave solo con un clic o un tasto veri (le prove automatiche partono subito)', () => {
  assert.ok(/e\.isTrusted/.test(src));
  assert.ok(/window\.__ntVia/.test(src));
});

test('le schede delle partite dicono anche dove sei arrivato', () => {
  const sal = fs.readFileSync(path.join(R, 'salvataggi.js'), 'utf8');
  const { slotRiassunto } = new Function(sal + ';return { slotRiassunto };')();
  const json = JSON.stringify({ s: { carId: 'v40', dist: 62500, money: 1200, vg: { prologo: 1 } } });
  const r = slotRiassunto(json, { v40: { short: 'V40' } }, (km) => (km > 60 ? 'Roma' : 'Tokyo'));
  assert.strictEqual(r.luogo, 'Roma'); assert.strictEqual(r.auto, 'V40'); assert.strictEqual(r.km, 62.5);
  assert.strictEqual(slotRiassunto(json, { v40: { short: 'V40' } }).luogo, '');                                   // senza la funzione resta vuoto
  assert.strictEqual(slotRiassunto(json, {}, () => { throw new Error('x'); }).luogo, '');                           // e un errore non rompe la scheda
});
