// Prove del telefono: gli atti seguono i km, i messaggi arrivano al chilometro giusto, le conversazioni si raggruppano.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../telefono.js', import.meta.url), 'utf8');
const { TEL_ATTI, TEL_SMS, TEL_APP_OFFERS, telAtto, telThreads, telNextOffer } = new Function(src + ';return { TEL_ATTI, TEL_SMS, TEL_APP_OFFERS, telAtto, telThreads, telNextOffer };')();

test('telefono: l\'atto cresce coi km e non torna indietro', () => {
  assert.equal(telAtto(0), 0);
  assert.equal(telAtto(TEL_ATTI[1] - 0.1), 0);
  assert.equal(telAtto(TEL_ATTI[1]), 1);
  assert.equal(telAtto(TEL_ATTI[2]), 2);
  assert.equal(telAtto(99999), TEL_ATTI.length - 1);
});

test('telefono: i messaggi arrivano al loro km e si raggruppano per mittente', () => {
  const t0 = telThreads(0);
  assert.deepEqual(t0.map((t) => t.n), ['Studio Ferri'], 'alla partenza c\'è solo lo studio');
  assert.equal(t0[0].m.length, 3, 'due messaggi in arrivo e la risposta');
  assert.ok(!telThreads(TEL_ATTI[2] + 5).some((t) => t.n === 'Zio Claudio' || t.n === 'Sconosciuto'), 'zio Claudio e lo sconosciuto scrivono dalle chat, non dai vecchi messaggi');
  const tardi = telThreads(TEL_ATTI[2] + 5);
  assert.equal(tardi[0].km >= tardi[tardi.length - 1].km, true, 'la conversazione più recente è in cima');
});

test('telefono: ogni messaggio ha mittente, testo e km', () => {
  for (const m of TEL_SMS) assert.ok(m.from && m.text && typeof m.km === 'number');
});

test('telefono: le app da scaricare arrivano una alla volta, nell\'ordine, ognuna al suo km', () => {
  assert.equal(telNextOffer(0, {}), null, 'all\'inizio nessun cartellone');
  assert.equal(telNextOffer(TEL_APP_OFFERS[0].km, {}).app, 'job', 'prima i lavori');
  assert.equal(telNextOffer(99, { job: { st: 'sign' } }).app, 'pax', 'poi i passeggeri');
  assert.equal(telNextOffer(99, { job: { st: 'ok' }, pax: { st: 'ok' } }).app, 'motel');
  assert.equal(telNextOffer(99, { job: {}, pax: {}, motel: {} }), null, 'finite');
  assert.equal(telNextOffer(0.1, {}), null, 'troppo presto');
  assert.ok(TEL_APP_OFFERS.every((o) => /^[A-Z0-9?|. ]+$/.test(o.sign)), 'i cartelloni usano il font pixel: solo maiuscole e simboli semplici');
});
