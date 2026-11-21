import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const leggi = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const carica = (extra = '') => {
  const ctx = {}; vm.createContext(ctx);
  vm.runInContext((leggi('chat_dati.js') + '\n' + leggi('chat_modifiche.js') + extra).replace(/\bconst /g, 'var '), ctx);
  return ctx;
};
test('chat_modifiche: ogni ritocco punta a un nodo, una variante o una risposta che esistono', () => {
  const c = carica();
  const by = Object.fromEntries(c.CHAT_LIST.map((n) => [n.id, n]));
  for (const [id, m] of Object.entries(c.CHAT_MOD)) {
    assert.ok(by[id], 'nodo mancante ' + id);
    for (const i of Object.keys(m.alt || {})) assert.ok(by[id].alt && by[id].alt[i], `${id} alt ${i}`);
    for (const i of Object.keys(m.opts || {})) assert.ok(by[id].opts && by[id].opts[i], `${id} opts ${i}`);
  }
});
test('chatModApplica cambia solo i testi', () => {
  const c = carica();
  const lista = [{ id: 'X', text: 'a', alt: [{ req: 'flag:z', text: 'b' }], opts: [{ t: 'c', to: 'Y', fx: ['flag:k'] }] }];
  const k = c.chatModApplica(lista, { X: { text: ['uno', 'due'], alt: { 0: 'bb' }, opts: { 0: 'cc' } }, NONC: { text: 'x' } });
  assert.equal(k, 1);
  assert.deepEqual(lista[0].text, ['uno', 'due']);
  assert.equal(lista[0].alt[0].text, 'bb'); assert.equal(lista[0].alt[0].req, 'flag:z');
  assert.equal(lista[0].opts[0].t, 'cc'); assert.equal(lista[0].opts[0].to, 'Y'); assert.deepEqual(lista[0].opts[0].fx, ['flag:k']);
});
