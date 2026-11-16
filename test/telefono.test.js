// Prove del telefono: gli atti seguono i km, i messaggi arrivano al chilometro giusto, le conversazioni si raggruppano.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../telefono.js', import.meta.url), 'utf8');
const { TEL_ATTI, TEL_SMS, telAtto, telThreads } = new Function(src + ';return { TEL_ATTI, TEL_SMS, telAtto, telThreads };')();

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
  assert.ok(!telThreads(TEL_ATTI[1] - 1).some((t) => t.n === 'Zio Remo'), 'lo zio scrive solo dopo');
  const tardi = telThreads(TEL_ATTI[2] + 5);
  assert.ok(tardi.some((t) => t.n === 'Sconosciuto') && tardi.find((t) => t.n === 'Zio Remo').bad, 'tardi i messaggi sono sporchi');
  assert.equal(tardi[0].km >= tardi[tardi.length - 1].km, true, 'la conversazione più recente è in cima');
});

test('telefono: ogni messaggio ha mittente, testo e km', () => {
  for (const m of TEL_SMS) assert.ok(m.from && m.text && typeof m.km === 'number');
});
