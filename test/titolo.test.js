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
    dataset: {},
    addEventListener(name, handler) { handlers[name] = handler; },
    setPointerCapture() {},
  };
  const widget = { querySelector: (selector) => selector === '.nr-switch' ? dial : status };
  class HTMLElement { appendChild() {} }
  let timer = null;
  const window = { addEventListener(name, handler) { handlers[name] = handler; } };
  new Function('window', 'document', 'HTMLElement', 'setTimeout', 'clearTimeout', ignition)(
    window, { createElement: () => widget }, HTMLElement,
    (callback) => { timer = callback; return 1; }, () => { timer = null; }
  );
  let avvii = 0, suoni = 0, silenzi = 0;
  const chiave = window.createRacingIgnition(new HTMLElement(), () => avvii++, () => {
    suoni++;
    return () => silenzi++;
  });
  return { handlers, status, chiave, fine: () => timer?.(),
    get avvii() { return avvii; }, get suoni() { return suoni; }, get silenzi() { return silenzi; } };
}

test('il rilascio anticipato riporta la chiave su OFF e sfuma il motorino', () => {
  const prova = accensione();
  const pointer = { pointerId: 1, isPrimary: true, button: 0 };
  prova.handlers.pointerdown(pointer);
  assert.equal(prova.status.textContent, 'START');
  assert.equal(prova.suoni, 1);
  prova.handlers.pointerup(pointer);
  prova.handlers.click({ detail: 1 });
  prova.fine();
  assert.equal(prova.status.textContent, 'OFF');
  assert.equal(prova.silenzi, 1);
  assert.equal(prova.avvii, 0);
  prova.handlers.pointerdown(pointer);
  prova.fine();
  prova.handlers.pointerup(pointer);
  prova.chiave.start();
  assert.equal(prova.avvii, 1);
  assert.equal(prova.silenzi, 1);
});

test('Invio e Spazio riproducono la sequenza una volta anche con il focus sulla chiave', () => {
  for (const key of ['Enter', ' ']) {
    const prova = accensione();
    let fermato = false;
    const e = { key, preventDefault() {}, stopPropagation() { fermato = true; } };
    prova.handlers.keydown({ ...e, repeat: true });
    assert.equal(prova.suoni, 0);
    prova.handlers.keydown(e);
    assert.equal(fermato, true);
    assert.equal(prova.suoni, 1);
    assert.equal(prova.avvii, 0);
    prova.fine();
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
