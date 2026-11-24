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

const ignition = fs.readFileSync(path.join(R, 'img/nottolino/nottolino.js'), 'utf8');

function accensione() {
  const handlers = {};
  const status = {};
  const dial = {
    style: { setProperty() {} }, dataset: {},
    addEventListener(name, handler) { handlers[name] = handler; },
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 990, height: 708 }),
    setPointerCapture() {},
  };
  const widget = { querySelector: (selector) => selector === '.nr-switch' ? dial : status };
  class HTMLElement { appendChild() {} }
  const window = {};
  new Function('window', 'document', 'HTMLElement', 'setTimeout', ignition)(
    window, { createElement: () => widget }, HTMLElement, () => {}
  );
  let avvii = 0;
  const chiave = window.createRacingIgnition(new HTMLElement(), () => avvii++);
  return { handlers, status, chiave, get avvii() { return avvii; } };
}

test('la chiave avvia una sola volta al rilascio su START', () => {
  const prova = accensione();
  const punto = (deg) => {
    const rad = deg * Math.PI / 180;
    return { clientX: 495 + 184 * Math.cos(rad), clientY: 365 + 184 * Math.sin(rad),
      pointerId: 1, isPrimary: true, button: 0 };
  };
  prova.handlers.pointerdown(punto(-151));
  prova.handlers.pointermove(punto(-114));
  prova.handlers.pointerup(punto(-114));
  assert.equal(prova.status.textContent, 'ACC');
  assert.equal(prova.avvii, 0);
  prova.handlers.pointerdown(punto(-114));
  prova.handlers.pointermove(punto(-37));
  assert.equal(prova.avvii, 0);
  prova.handlers.pointerup(punto(-37));
  prova.handlers.click({ detail: 1 });
  prova.chiave.start();
  assert.equal(prova.avvii, 1);
});

test('Invio e Spazio avviano la partita anche con il focus sulla chiave', () => {
  for (const key of ['Enter', ' ']) {
    const prova = accensione();
    let fermato = false;
    const e = { key, preventDefault() {}, stopPropagation() { fermato = true; } };
    prova.handlers.keydown({ ...e, repeat: true });
    assert.equal(prova.avvii, 0);
    prova.handlers.keydown(e);
    assert.equal(fermato, true);
    assert.equal(prova.avvii, 1);
  }
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
