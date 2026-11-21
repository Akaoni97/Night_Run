'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { EventEmitter } = require('node:events');
const { Aggiornatore, confrontaVersioni, classificaErrore, pulisciNote } = require('../aggiorna');
const { Salvataggi } = require('../salvataggi');

// Updater finto con la stessa forma di electron-updater.
function finto({ versione = '0.2.9', errore = null, scaricoErrore = null } = {}) {
  const u = new EventEmitter();
  u.chiamate = { controlla: 0, scarica: 0 };
  u.checkForUpdates = async () => { u.chiamate.controlla++; await new Promise((r) => setImmediate(r)); if (errore) throw errore; return { updateInfo: { version: versione, releaseDate: '2026-11-21T10:00:00Z', releaseNotes: '<p>Novità <b>belle</b></p>' } }; };
  u.downloadUpdate = async () => { u.chiamate.scarica++; u.emit('download-progress', { percent: 42.4 }); if (scaricoErrore) throw scaricoErrore; };
  return u;
}
function crea(up, extra = {}) {
  const eventi = [];
  const reg = { salvati: [], checkpoint: [], installato: 0 };
  const a = new Aggiornatore({
    updater: up, info: { versione: '0.2.9', commit: 'abc' }, avvio: { impacchettato: true, portatile: false, ...(extra.avvio || {}) },
    salvaPrima: extra.salvaPrima || ((d) => reg.salvati.push(d)),
    checkpoint: (v) => reg.checkpoint.push(v),
    installa: () => { reg.installato++; },
    notifica: (s) => eventi.push(s.fase)
  });
  return { a, eventi, reg };
}

test('versioni: confronto SemVer, non di stringhe', () => {
  assert.equal(confrontaVersioni('0.2.10', '0.2.9'), 1);
  assert.equal(confrontaVersioni('0.2.9', '0.2.10'), -1);
  assert.equal(confrontaVersioni('v0.3.0', '0.2.99'), 1);
  assert.equal(confrontaVersioni('0.2.5', '0.2.5'), 0);
  assert.equal(confrontaVersioni('0.2.5', '0.2.5-beta.1'), 1);
  assert.equal(confrontaVersioni('v0.64', '0.2.5'), null);
  assert.equal(confrontaVersioni('', '0.2.5'), null);
});
test('errori: offline, nessuna versione, release incompleta, resto = fallito', () => {
  assert.equal(classificaErrore(new Error('net::ERR_INTERNET_DISCONNECTED')), 'offline');
  assert.equal(classificaErrore(Object.assign(new Error('x'), { code: 'ENOTFOUND' })), 'offline');
  assert.equal(classificaErrore(Object.assign(new Error('No published versions on GitHub'), { code: 'ERR_UPDATER_NO_PUBLISHED_VERSIONS' })), 'nessuna');
  assert.equal(classificaErrore(Object.assign(new Error('Cannot find latest.yml'), { code: 'ERR_UPDATER_CHANNEL_FILE_NOT_FOUND' })), 'nessuna');
  assert.equal(classificaErrore(new Error('sha512 checksum mismatch')), 'fallito');
});
test('note: via l\'HTML e lunghezza limitata', () => {
  assert.equal(pulisciNote('<p>Ciao <b>mondo</b></p>'), 'Ciao mondo');
  assert.ok(pulisciNote('x'.repeat(2000)).length <= 600);
  assert.equal(pulisciNote(null), '');
});

test('versione più nuova: disponibile con numero, data e note', async () => {
  const { a } = crea(finto({ versione: '0.2.10' }));
  const s = await a.controlla();
  assert.equal(s.fase, 'disponibile');
  assert.equal(s.nuova.versione, '0.2.10');
  assert.equal(s.nuova.note, 'Novità belle');
});
test('stessa versione o più vecchia: sei aggiornato (mai un ritorno indietro)', async () => {
  assert.equal((await crea(finto({ versione: '0.2.9' })).a.controlla()).fase, 'aggiornato');
  assert.equal((await crea(finto({ versione: '0.2.3' })).a.controlla()).fase, 'aggiornato');
});
test('rete assente e nessuna release: stati chiari, gioco intatto', async () => {
  assert.equal((await crea(finto({ errore: new Error('net::ERR_INTERNET_DISCONNECTED') })).a.controlla()).fase, 'offline');
  assert.equal((await crea(finto({ errore: Object.assign(new Error('No published versions'), { code: 'ERR_UPDATER_NO_PUBLISHED_VERSIONS' }) })).a.controlla()).fase, 'nessuna');
});
test('clic ripetuti: un solo controllo', async () => {
  const up = finto({ versione: '0.2.10' });
  const { a } = crea(up);
  await Promise.all([a.controlla(), a.controlla(), a.controlla()]);
  assert.equal(up.chiamate.controlla, 1);
});
test('impostazioni manuali: niente download né installazione automatici', () => {
  const up = finto();
  crea(up);
  assert.equal(up.autoDownload, false);
  assert.equal(up.autoInstallOnAppQuit, false);
  assert.equal(up.allowDowngrade, false);
  assert.equal(up.allowPrerelease, false);
});
test('download: avanzamento, poi pronto; senza «disponibile» non scarica', async () => {
  const up = finto({ versione: '0.2.10' });
  const { a, eventi } = crea(up);
  assert.equal((await a.scarica()).fase, 'inattivo');
  assert.equal(up.chiamate.scarica, 0);
  await a.controlla();
  const s = await a.scarica();
  assert.equal(s.fase, 'pronto');
  assert.ok(eventi.includes('scarico'));
});
test('download interrotto: errore, si può ricontrollare, la versione in uso non cambia', async () => {
  const up = finto({ versione: '0.2.10', scaricoErrore: new Error('sha512 checksum mismatch') });
  const { a } = crea(up);
  await a.controlla();
  const s = await a.scarica();
  assert.equal(s.fase, 'fallito');
  assert.equal(s.versione, '0.2.9');
  assert.equal(up.chiamate.scarica, 1);
});
test('installa: salva la fotografia, fa il checkpoint, poi installa una volta sola', async () => {
  const { a, reg } = crea(finto({ versione: '0.2.10' }));
  await a.controlla(); await a.scarica();
  const r = await a.installa({ nr_pg: 'x' });
  assert.equal(r.ok, true);
  assert.deepEqual(reg.salvati, [{ nr_pg: 'x' }]);
  assert.deepEqual(reg.checkpoint, ['0.2.10']);
  assert.equal((await a.installa({})).ok, false);   // doppio clic
  await new Promise((r) => setTimeout(r, 300));
  assert.equal(reg.installato, 1);
});
test('installa: se il salvataggio su file fallisce, non installa', async () => {
  const { a, reg } = crea(finto({ versione: '0.2.10' }), { salvaPrima: () => { throw new Error('disco pieno'); } });
  await a.controlla(); await a.scarica();
  const r = await a.installa({});
  assert.equal(r.ok, false);
  assert.match(r.errore, /disco pieno/);
  await new Promise((r) => setTimeout(r, 300));
  assert.equal(reg.installato, 0);
  assert.equal(reg.checkpoint.length, 0);
});
test('installa senza aggiornamento pronto: rifiutato', async () => {
  const { a, reg } = crea(finto({ versione: '0.2.10' }));
  await a.controlla();
  assert.equal((await a.installa({})).ok, false);
  assert.equal(reg.installato, 0);
});
test('sviluppo (non impacchettato): niente updater, messaggio chiaro', async () => {
  const up = finto();
  const { a } = crea(up, { avvio: { impacchettato: false } });
  const s = await a.controlla();
  assert.equal(s.fase, 'non-supportato');
  assert.equal(up.chiamate.controlla, 0);
});
test('portatile: controlla sì, ma non scarica né installa da solo', async () => {
  const up = finto({ versione: '0.2.10' });
  const { a, reg } = crea(up, { avvio: { portatile: true } });
  assert.equal((await a.controlla()).fase, 'disponibile');
  assert.equal((await a.scarica()).fase, 'disponibile');
  assert.equal(up.chiamate.scarica, 0);
  assert.equal((await a.installa({})).ok, false);
  assert.equal(reg.installato, 0);
  assert.equal(a.stato().portatile, true);
});

function archivio(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'night-run-prova-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return new Salvataggi(path.join(dir, 'salvataggi'));
}
test('checkpoint: copia a parte, non toccata dai salvataggi seguenti, ne restano tre', (t) => {
  const a = archivio(t);
  a.scrivi({ km: '10' });
  const f1 = a.checkpoint('0.2.10');
  a.scrivi({ km: '99' });
  assert.deepEqual(JSON.parse(fs.readFileSync(f1)), { km: '10' });
  assert.deepEqual(JSON.parse(fs.readFileSync(a.file)), { km: '99' });
  for (const v of ['0.2.11', '0.2.12', '0.2.13']) { a.checkpoint(v); }
  assert.equal(fs.readdirSync(a.cartella).filter((f) => f.startsWith('checkpoint-')).length, 3);
});
test('checkpoint: file corrente illeggibile, nessun checkpoint e nessun danno', (t) => {
  const a = archivio(t);
  a.scrivi({ km: '1' });
  fs.writeFileSync(a.file, '{rotto');
  assert.throws(() => a.checkpoint('0.2.10'));
});
