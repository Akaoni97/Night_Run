// Reazioni del protagonista (reazioni.js, v0.119; solo versi dalla v0.124): versi, scelta per motore e preparazione, accelerazione filtrata, stupore in faccia.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const R = path.resolve(__dirname, '..');
const api = new Function(fs.readFileSync(path.join(R, 'reazioni.js'), 'utf8') + ';return { REA_LINES, REA_FAM, REA_BOTTO, REA_COL, reaFam, reaPick, reaAccelStep };')();
const font = fs.readFileSync(path.join(R, 'street2d.js'), 'utf8').match(/const PX_FONT = \{([\s\S]*?)\n\};/)[1];
const lettere = new Set([...font.matchAll(/(?:^|[\s,{])(?:'(.)'|([A-Z0-9])):/g)].map((m) => m[1] || m[2]).concat(['W', 'X', 'Y']));   // W, X e Y le aggiunge fumetti2d.js

test('ogni verso usa solo lettere del carattere a pixel, al massimo due righe corte, ed è un verso (finisce col punto esclamativo)', () => {
  const tutti = [...Object.values(api.REA_LINES), ...Object.values(api.REA_FAM).flatMap((f) => Object.values(f)), ...api.REA_BOTTO];
  for (const tipo of Object.keys(api.REA_LINES)) assert.ok(api.REA_COL[tipo], 'colore per ' + tipo);
  for (const f of Object.keys(api.REA_FAM)) for (const t of Object.keys(api.REA_FAM[f])) assert.ok(api.REA_LINES[t], `${f}.${t}: momento che non esiste`);
  for (const frasi of tutti) for (const f of frasi) {
    const righe = f.split('|'); assert.ok(righe.length <= 2, f); assert.ok(f.endsWith('!'), 'non è un verso: ' + f);
    for (const r of righe) { assert.ok(r.length <= 13, 'riga lunga: ' + r); for (const ch of r) assert.ok(lettere.has(ch), `«${ch}» non c'è nel carattere (${f})`); }
  }
  // niente parole di prima (deciso da Luca, v0.124)
  for (const parola of ['WOW', 'ANCORA', 'SORPASSO', 'CIAO', 'TURBO', 'PRONTI', 'VIA!']) for (const frasi of tutti) for (const f of frasi) assert.ok(!f.includes(parola), f);
});

test('il verso segue il motore e, negli scoppi, la preparazione', () => {
  assert.strictEqual(api.reaFam('polo', { sound: 'tre' }), 'tre');
  assert.strictEqual(api.reaFam('supra', null), 'sei');
  assert.strictEqual(api.reaFam('e30', { cyl: 4 }), null);
  assert.strictEqual(api.reaFam('x', { diesel: true, cyl: 4 }), 'diesel');
  for (let i = 0; i < 20; i++) {
    assert.ok(api.REA_FAM.tre.accel.includes(api.reaPick('accel', null, i / 20, 'tre')));
    assert.ok(api.REA_LINES.accel.includes(api.reaPick('accel', null, i / 20, null)));
    for (const t of [0, 1, 2]) assert.ok(api.REA_BOTTO[t].includes(api.reaPick('botto', null, i / 20, 'sportiva', t)));
    assert.ok(api.REA_FAM.diesel.botto.includes(api.reaPick('botto', null, i / 20, 'diesel', 2)), 'il diesel non fa TRATATAN');
  }
});

test('reaPick: un verso del tipo, mai uguale alla precedente', () => {
  for (const tipo of Object.keys(api.REA_LINES)) for (let i = 0; i < 50; i++) {
    const prima = api.reaPick(tipo, null, i / 50), poi = api.reaPick(tipo, prima, i / 50);
    assert.ok(api.REA_LINES[tipo].includes(prima)); assert.notStrictEqual(poi, prima);
  }
  assert.strictEqual(api.reaPick('non_esiste', null, 0.5), null);
});

test('reaAccelStep: fermo o a velocità costante 0, in accelerazione si avvicina al valore vero', () => {
  const S = {}; let v = 20;
  for (let i = 0; i < 60; i++) api.reaAccelStep(S, v, 1 / 60);
  assert.ok(Math.abs(S.a) < 0.01);
  for (let i = 0; i < 120; i++) { v += 10 / 60; api.reaAccelStep(S, v, 1 / 60); }
  assert.ok(S.a > 9 && S.a < 10.5, 'a = ' + S.a);
});

test('lo stupore arriva alla faccia: pgDriver legge awe (occhi, sopracciglia, bocca) e pilota2d lo passa', () => {
  const pg = fs.readFileSync(path.join(R, 'personaggio.js'), 'utf8'), pil = fs.readFileSync(path.join(R, 'pilota2d.js'), 'utf8');
  assert.ok(/P\.awe/.test(pg) && /wow/.test(pg));
  assert.ok(/awe: this\._rea/.test(pil) && /_drvHead/.test(pil));
});
