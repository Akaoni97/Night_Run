// Prove delle capitali con l'aspetto delle città vere (citta2d.js e citta_dati.js, v0.112):
// ogni capitale (tranne Tokyo) ha i suoi quartieri, i quartieri usano solo stili, palazzi e monumenti che esistono,
// i nomi si possono scrivere col carattere a pixel e ogni facciata e monumento si disegna senza errori.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ctx = () => new Proxy({}, { get: (t, k) => (k in t ? t[k] : () => {}), set: (t, k, v) => { t[k] = v; return true; } });
globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: ctx }) };
class SD {}
SD.shade = (c) => c; SD.rnd = (n) => { const x = Math.sin(n * 91.345 + 47.853) * 43758.5453; return x - Math.floor(x); };
SD.prototype.C = { ink: '#05060c', skin: '#e0b090' };
SD.prototype.textW = (w, sc) => w.length * 4 * sc; SD.prototype.text = () => {};
SD.prototype.landmark = function () { return { c: { width: 1, height: 1 } }; };
SD.prototype.districtInfo = function () { return { D: null }; }; SD.prototype.districtMix = function () { return null; }; SD.prototype.kindExtra = function () { return { base: true }; };
globalThis.Street2D = SD;
const run = (f) => new Function(readFileSync(new URL('../' + f, import.meta.url), 'utf8'))();
run('citta2d.js'); run('citta_dati.js'); run('citta_monumenti.js'); run('citta_dettagli.js');
const CITY = SD.CITY_DISTRICTS, FAC = SD.CITY_FACADES, LM = SD.CITY_LANDMARKS, PROP = SD.CITY_PROPS, ROAD = SD.CITY_ROAD;
const CAPS = ['roma', 'parigi', 'londra', 'stoccolma', 'berlino', 'praga', 'vienna', 'madrid', 'lisbona', 'atene', 'washington'];
const KINDS_BASE = new Set(['tower', 'office', 'hotel', 'boutique', 'park', 'containers', 'house', 'konbini', 'warehouse', 'factory']);
const FONT = /^[A-Z0-9 ,.\/\-!?]+$/;

test('città: ogni capitale tranne Tokyo ha i suoi quartieri', () => {
  for (const id of CAPS) assert.ok(CITY[id] && CITY[id].length >= 2, id);
  assert.equal(CITY.tokyo, undefined);
});
test('città: i quartieri usano solo stili, palazzi e monumenti che esistono', () => {
  for (const id of CAPS) for (const d of CITY[id]) {
    for (const k of Object.keys(d.kinds)) assert.ok(k.startsWith('fac:') ? FAC[k.slice(4)] : KINDS_BASE.has(k), id + ' ' + k);
    for (const l of String(d.land).split('|')) assert.ok(LM[l] || ['spire', 'ferris', 'crane', 'tank', 'pagoda'].includes(l), id + ' land ' + l);
    for (const f of ['mid', 'far', 'haze', 'glow', 'grade', 'neon', 'words']) assert.ok(d[f] && d[f].length, id + ' ' + f);
    assert.ok(d.len > 0 && d.lamp.startsWith('#'));
  }
});
test('città: nomi, insegne e parole si scrivono col carattere a pixel', () => {
  for (const id of CAPS) for (const d of CITY[id]) { assert.match(d.name, FONT, d.name); for (const w of d.words) assert.match(w, FONT, id + ' ' + w); }
});
test('città: ogni facciata si disegna e dà una tessera con le sue parti', () => {
  const s = new SD(); const D = { words: ['BAR'], neon: ['#fff'], signP: 1, flick: 0 };
  for (const id of Object.keys(FAC)) for (let k = 0; k < 6; k++) {
    const t = s.cityFacade(id, (n) => SD.rnd(k * 7.7 + n), D);
    assert.ok(t.c && t.w > 40 && t.h > 60 && Array.isArray(t.signs) && Array.isArray(t.glows), id);
  }
});
test('città: ogni monumento si disegna', () => {
  const s = new SD(); s.landmark = Object.getPrototypeOf(s).landmark;
  const proto = SD.prototype; const D = { far: ['#2a2a5a'], neon: ['#fff'] };
  for (const id of Object.keys(LM)) { const t = proto.landmark.call(s, id, (n) => SD.rnd(n), D); assert.ok(t.c && t.w > 10 && t.h > 40, id); assert.equal(t.hd, true, id + ' ad alta definizione'); }
  assert.ok(Object.keys(LM).length >= 26);
});
test('città: districtInfo segue la città in cui si è, Tokyo e fuori città come prima', () => {
  const s = new SD(); s._city = 'roma';
  assert.equal(SD.prototype.districtInfo.call(s, 0).D.id, 'roma_corso');
  const tot = CITY.roma.reduce((a, d) => a + d.len, 0);
  assert.equal(SD.prototype.districtInfo.call(s, tot + 5).D.id, 'roma_corso');
  assert.equal(SD.prototype.districtInfo.call(s, CITY.roma[0].len + 1).D.id, 'roma_popolo');
  s._city = null; assert.equal(SD.prototype.districtInfo.call(s, 0).D, null);
  s.tiles = new Map([['a', 1]]); s._city = 'parigi'; s.setCity('londra'); assert.equal(s.tiles.size, 0); s.tiles.set('b', 2); s.setCity('londra'); assert.equal(s.tiles.size, 1);
  s.setCity(null); assert.equal(s._city, null);
});

test('città: ogni quartiere ha i suoi oggetti del marciapiede e ognuno si disegna', () => {
  const g = ctx(), c = { g, px: () => {}, X: 100, ink: '#000', night: 1, t: 1.5, r: (n) => SD.rnd(n), S: { text: () => {}, lightAdd: () => {}, light: () => {} } };
  for (const id of CAPS) for (const d of CITY[id]) { assert.ok(d.props.length >= 3 && d.propP > 0, d.id); for (const k of d.props) assert.equal(typeof PROP[k], 'function', d.id + ' ' + k); }
  for (const k of Object.keys(PROP)) assert.doesNotThrow(() => PROP[k](c), k);
});
test('città: segni sull\'asfalto solo per città che esistono', () => {
  for (const id of Object.keys(ROAD)) assert.ok(CITY[id], id);
  assert.ok(ROAD.londra && ROAD.roma && ROAD.washington);
});
test('città: i particolari di facciata usati dagli stili esistono (targhe, bandiere, ecc.)', () => {
  const s = new SD(); const D = { words: ['BAR'], neon: ['#fff'], signP: 1, flick: 0 };
  for (const id of Object.keys(FAC)) { const P = FAC[id]; if (P.ex && P.ex.includes('plate')) assert.ok(P.plate && P.plate[2].length >= 3, id); if (P.ex && P.ex.includes('flag')) assert.ok(P.flag, id);
    for (let k = 0; k < 12; k++) assert.doesNotThrow(() => s.cityFacade(id, (n) => SD.rnd(k * 3.3 + n), D), id); }
});
