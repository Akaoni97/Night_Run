// Scritte da fumetto in stile anime (v0.74): voci varie, solo lettere che il carattere a pixel sa disegnare, interruttore.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const dir = new URL('../', import.meta.url);
const strada = readFileSync(new URL('street2d.js', dir), 'utf8');
const PX_FONT = new Function('return ({' + strada.match(/const PX_FONT = \{([\s\S]*?)\n\};/)[1] + '})')();   // il carattere vero di street2d.js
class Street2D { constructor() { this.comics = []; this.C = { ink: '#000' }; } }
Street2D.shade = (c) => c;
new Function('Street2D', 'PX_FONT', readFileSync(new URL('fumetti2d.js', dir), 'utf8'))(Street2D, PX_FONT);
const T = Street2D.COMIC_TIPI;

test('ogni scritta usa solo lettere che il carattere a pixel disegna', () => {
  for (const [tipo, s] of Object.entries(T)) for (const v of s.voci) for (const ch of v) assert.ok(PX_FONT[ch], `${tipo}: «${v}» ha il carattere «${ch}» che manca`);
});

test('più voci per ogni rumore principale', () => {
  for (const t of ['scoppioL', 'scoppioF', 'colpo', 'colpoDietro', 'sfiato', 'partenza']) assert.ok(T[t].voci.length >= 5, `${t}: poche voci`);
  const tutte = new Set(Object.values(T).flatMap((s) => s.voci));
  assert.ok(tutte.size >= 60, `solo ${tutte.size} voci diverse`);
});

test('mai due volte di fila la stessa voce, e le grandezze restano quelle di prima', () => {
  const s = new Street2D();
  for (const t of ['scoppioL', 'colpo', 'sfiato']) {
    let ultima = null;
    for (let i = 0; i < 40; i++) { s.comics.length = 0; s.comicEv(t, 100, 100, 1); const w = s.comics[0].text; assert.notEqual(w, ultima, t); ultima = w; }
  }
  const dim = (t) => { s.comics.length = 0; s.comicEv(t, 100, 100, 2); return s.comics[0].size; };
  assert.equal(dim('colpo'), 5); assert.equal(dim('scoppioF'), 4); assert.equal(dim('scoppioL'), 3);   // come le vecchie scritte, qualunque sia la potenza
});

test('grafiche anime spente: nessuna scritta', () => {
  const s = new Street2D();
  s.comicsOn = false; s.comicEv('colpo', 1, 1); s.comic('PROVA', 1, 1, '#fff'); assert.equal(s.comics.length, 0);
  s.comicsOn = true; s.comicEv('colpo', 1, 1); assert.equal(s.comics.length, 1);
});

test('le scritte non si accumulano senza fine', () => {
  const s = new Street2D();
  for (let i = 0; i < 40; i++) s.comicEv('scoppioL', 1, 1);
  assert.ok(s.comics.length <= 9, `${s.comics.length} scritte insieme`);
});
