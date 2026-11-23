// Prove dei tre salvataggi (salvataggi.js, v0.101): lo scambio non perde niente, una partita vuota riparte da capo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../salvataggi.js', import.meta.url), 'utf8');
const { SLOT, slotRiassunto, slotScambia, slotNome, slotQuando } = new Function(src + ';return { SLOT, slotRiassunto, slotScambia, slotNome, slotQuando };')();
const finto = (o = {}) => { const m = new Map(Object.entries(o)); return { m, getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };
const partita = (km, soldi, auto) => JSON.stringify({ mode: 'career', s: { dist: km * 1000, money: soldi, carId: auto, vg: { on: true, prologo: 1 } } });

test('salvataggi: sono tre', () => { assert.equal(SLOT.n, 3); });

test('salvataggi: il riassunto dice auto, km e soldi; vuota o illeggibile = null', () => {
  const r = slotRiassunto(partita(123.4, 4500, 'v40'), { v40: { short: 'V40' } });
  assert.equal(r.auto, 'V40'); assert.equal(Math.round(r.km), 123); assert.equal(r.soldi, 4500); assert.equal(r.prologo, true);
  assert.equal(slotRiassunto(null), null); assert.equal(slotRiassunto('{rotto'), null); assert.equal(slotRiassunto(JSON.stringify({ s: {} })), null, 'senza viaggio');
});

test('salvataggi: andata e ritorno, la partita 1 torna identica (anche pezzi, personaggio e foto) e la 2 parte vuota', () => {
  const p1 = partita(80, 3000, 'panda');
  const L = finto({ 'nightrun-viaggio': p1, nr_pg: '{"pelle":3}', nr_diario_foto: '[1]', banco2jz: JSON.stringify({ trip: true, vol: 55, tunes: { panda: { exhaust: 'race' } }, coss: { panda: { rims: 'x' } }, adj: { panda: { h: -10 } }, paint: '#123456' }) });
  assert.equal(slotScambia(L, 1, 2), true);
  assert.equal(L.getItem('nr_slot'), '2');
  assert.equal(L.getItem('nightrun-viaggio'), null, 'la 2 è vuota: si parte da capo'); assert.equal(L.getItem('nr_pg'), null);
  let S = JSON.parse(L.getItem('banco2jz')); assert.deepEqual(S.tunes, {}); assert.equal(S.vol, 55, 'le impostazioni del computer restano');
  // nella 2 si gioca un po'
  L.setItem('nightrun-viaggio', partita(5, 900, 'polo')); S.tunes = { polo: { intake: 'cono' } }; S.paint = '#ff0000'; L.setItem('banco2jz', JSON.stringify(S));
  slotScambia(L, 2, 1);
  assert.equal(L.getItem('nightrun-viaggio'), p1); assert.equal(L.getItem('nr_pg'), '{"pelle":3}'); assert.equal(L.getItem('nr_diario_foto'), '[1]');
  S = JSON.parse(L.getItem('banco2jz')); assert.deepEqual(S.tunes, { panda: { exhaust: 'race' } }); assert.equal(S.paint, '#123456'); assert.deepEqual(S.adj, { panda: { h: -10 } });
  // e la 2 è rimasta da parte con i suoi pezzi
  slotScambia(L, 1, 2);
  assert.equal(JSON.parse(L.getItem('nightrun-viaggio')).s.carId, 'polo'); assert.deepEqual(JSON.parse(L.getItem('banco2jz')).tunes, { polo: { intake: 'cono' } });
});

test('salvataggi: scambiare con sé stessa non fa niente', () => {
  const L = finto({ 'nightrun-viaggio': 'x' }); assert.equal(slotScambia(L, 2, 2), false); assert.equal(L.getItem('nightrun-viaggio'), 'x');
});

test('salvataggi: nome scelto e ultima volta', () => {
  assert.equal(slotNome({}, 2), 'Partita 2');
  assert.equal(slotNome({ 2: { nome: '  Luca  ' } }, 2), 'Luca');
  assert.equal(slotNome({ 1: { nome: 'Un nome molto troppo lungo' } }, 1).length, 14);
  assert.equal(slotNome({ 3: { nome: '   ' } }, 3), 'Partita 3');
  const ora = new Date(2026, 10, 23, 15, 0).getTime(), g = (n, h = 10) => new Date(2026, 10, 23 - n, h, 0).getTime();
  assert.equal(slotQuando(0, ora), '');
  assert.equal(slotQuando(g(0, 1), ora), 'oggi');
  assert.equal(slotQuando(g(1, 23), ora), 'ieri');
  assert.equal(slotQuando(g(3), ora), '3 giorni fa');
  assert.equal(slotQuando(g(8), ora), '1 settimana fa');
  assert.equal(slotQuando(g(15), ora), '2 settimane fa');
  assert.equal(slotQuando(g(60), ora), 'più di un mese fa');
});
