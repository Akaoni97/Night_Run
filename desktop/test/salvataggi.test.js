'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Salvataggi } = require('../salvataggi');

function archivio(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'night-run-prova-'));
  t.after(() => {
    if (!path.basename(dir).startsWith('night-run-prova-') || path.dirname(dir) !== os.tmpdir()) throw new Error('Percorso di prova non valido');
    fs.rmSync(dir, { recursive: true, force: true });
  });
  return new Salvataggi(path.join(dir, 'salvataggi'));
}

test('file assente: richiede la prima migrazione dei dati locali', (t) => {
  const a = archivio(t);
  assert.equal(a.carica().migra, true);
});
test('riapertura: tutte le chiavi e le stringhe Unicode sopravvivono', (t) => {
  const a = archivio(t);
  const dati = { 'nightrun-viaggio': '{"km":42}', nr_tasti: 'àè🚗', ['__proto__']: 'valore' };
  a.scrivi(dati);
  assert.deepEqual(new Salvataggi(a.cartella).carica().dati, dati);
  assert.equal(fs.readFileSync(a.file, 'utf8'), fs.readFileSync(a.backup, 'utf8'));
});
test('JSON corrotto: recupera il backup valido e ripara il primario', (t) => {
  const a = archivio(t);
  a.scrivi({ nr_pg: 'personaggio' });
  fs.writeFileSync(a.file, '{interrotto');
  const ripreso = new Salvataggi(a.cartella).carica();
  assert.equal(ripreso.fonte, 'backup');
  assert.deepEqual(JSON.parse(fs.readFileSync(a.file)), { nr_pg: 'personaggio' });
});
test('entrambi corrotti: riparte da zero senza dati risorti', (t) => {
  const a = archivio(t);
  a.scrivi({ vecchio: 'dato' });
  fs.writeFileSync(a.file, 'null');
  fs.writeFileSync(a.backup, '[1]');
  assert.deepEqual(new Salvataggi(a.cartella).carica().dati, {});
});
test('RIAVVIA: rimozioni e modifiche rispecchiate anche nel backup', (t) => {
  const a = archivio(t);
  a.scrivi({ 'nightrun-viaggio': 'vecchio', banco2jz: '{"tunes":{"turbo":3}}', nr_tasti: 'tasti' });
  const azzerato = { banco2jz: '{"tunes":{},"coss":{},"trip":true}', nr_tasti: 'tasti' };
  a.scrivi(azzerato);
  fs.writeFileSync(a.file, 'corrotto');
  assert.deepEqual(new Salvataggi(a.cartella).carica().dati, azzerato);
});
test('stato vuoto: mantiene due file contenenti {}', (t) => {
  const a = archivio(t);
  a.scrivi({});
  assert.equal(fs.readFileSync(a.file, 'utf8'), '{}');
  assert.equal(fs.readFileSync(a.backup, 'utf8'), '{}');
  assert.equal(new Salvataggi(a.cartella).carica().migra, false);
});
test('valori non stringa vengono rifiutati senza sovrascrivere i dati', (t) => {
  const a = archivio(t);
  a.scrivi({ conserva: 'sì' });
  assert.throws(() => a.scrivi({ conserva: 42 }));
  assert.deepEqual(JSON.parse(fs.readFileSync(a.file)), { conserva: 'sì' });
});
test('errore del filesystem viene propagato, non trattato come JSON corrotto', (t) => {
  const a = archivio(t);
  fs.mkdirSync(a.file, { recursive: true });
  assert.throws(() => a.carica());
});
