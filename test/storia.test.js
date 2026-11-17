// Prove del regista della storia: fasi, prove, scelte dell'ultima porta, finali, costi di Marco.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = ['chat_dati.js', 'chat.js', 'regia.js', 'storia.js'].map((f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8')).join('\n');
const E = new Function(src + ';return { STORIA_BEATS, STORIA_INC, STORIA_EPI, STORIA_FINALI, REGIA_EPI, chatState, regiaState, regiaSet, storiaState, storiaFase, storiaProve, storiaPorta, storiaFinale, storiaCostoMarco, storiaIncFatte };')();
const fresh = () => ({});
const sc = (s, id) => E.storiaPorta(s).find((x) => x.label === id);

test('storia: la fase segue le capitali raggiunte', () => {
  const s = fresh(); const f = E.chatState(s).flags;
  assert.equal(E.storiaFase(s), 'I'); f.luogo_parigi = 1; assert.equal(E.storiaFase(s), 'II'); f.luogo_londra = 1; assert.equal(E.storiaFase(s), 'III');
  f.luogo_madrid = 1; assert.equal(E.storiaFase(s), 'IV'); f.luogo_atene = 1; assert.equal(E.storiaFase(s), 'V');
});

test('storia: le incursioni rispettano la regola degli otto parole e hanno lampade e metri', () => {
  for (const [n, D] of Object.entries(E.STORIA_INC)) { assert.ok(D.lampade >= 4 && D.metri >= 1000 && D.lampT >= 12, n); for (const t of D.sub) assert.ok(t.split(/\s+/).length <= 8, t); }
});

test('storia: L\'ultima porta mostra sempre quattro azioni e dice perché una è grigia', () => {
  const s = fresh(); const p = E.storiaPorta(s); assert.equal(p.length, 4);
  for (const x of p) if (!x.ok) assert.ok(x.motivo && x.motivo.length > 5, x.label);
  assert.ok(!sc(s, 'Esci').ok && !sc(s, 'Chiudi').ok && !sc(s, 'Resta').ok);
});

test('storia: ogni finale si apre con le sue condizioni, e A non vale con un patto aperto', () => {
  const s = fresh(); const f = E.chatState(s).flags, st = E.storiaState(s);
  st.inc = { 1: 'ok', 2: 'ok' }; f.ev_uscita_autentica = 1; assert.ok(sc(s, 'Esci').ok);
  E.regiaSet(s, 'patto', 'esplicito'); assert.ok(!sc(s, 'Esci').ok, 'un patto aperto: non esci da solo');
  E.regiaSet(s, 'patto', 'rifiutato');
  f.ev_foto_originale = 1; E.chatState(s).conf.Livia = 30; f.ev_distanza_impossibile = 1; assert.ok(E.storiaProve(s) >= 3);
  assert.ok(sc(s, 'Chiudi').ok); f.promessa_rosa = 1; assert.ok(sc(s, 'Resta').ok);
  assert.ok(!sc(s, 'Apri').ok, 'senza varco aperto');
  E.regiaSet(s, 'varco', 'aperto'); st.verSkip = 3; const b1 = E.storiaPorta(s).find((x) => x.label === 'Apri'); assert.ok(b1.ok); assert.equal(b1.id, 'B1');
  f.ottavio_non_salvo = 1; f.marco_dentro = 1; f.ev_presenza_scoperta = 1; assert.equal(E.storiaPorta(s).find((x) => x.label === 'Apri').id, 'B2');
});

test('storia: i finali si memorizzano; A+ se Ottavio è salvo; gli epiloghi A, B1, B2, C, D esistono', () => {
  const s = fresh(); E.chatState(s).flags.ottavio_salvo = 1;
  assert.ok(E.storiaFinale(s, 'A')); assert.equal(E.storiaState(s).fine, 'A'); assert.ok(s.chat.flags.ottavio_telefona);
  assert.ok(!E.storiaFinale(s, 'Z'));
  for (const id of ['A', 'B1', 'B2', 'C', 'D']) { assert.ok(E.REGIA_EPI[id] && E.REGIA_EPI[id].length >= 6, id); assert.ok(E.STORIA_FINALI[id]); }
});

test('storia: i costi di Marco: la copia solo una volta, mai l\'originale; la lampada toglie margine', () => {
  const s = fresh(); const f = E.chatState(s).flags; f.mc_copia = 1; f.mc_lampada = 1;
  assert.equal(E.storiaCostoMarco(s, null).lampade, 1); E.storiaCostoMarco(s, null);
  assert.equal(E.storiaState(s).copie, 1, 'una sola copia lasciata, anche richiamando'); assert.ok(f.copia_lasciata_marco);
  let annullato = 0; const t = fresh(); E.chatState(t).flags.mc_carico = 1; E.storiaCostoMarco(t, { vgAnnullaLavoro: () => annullato++ }); E.storiaCostoMarco(t, { vgAnnullaLavoro: () => annullato++ });
  assert.equal(annullato, 1, 'il carico si annulla una volta');
});

test('storia: i momenti garantiti puntano a flag che aprono qualcosa', () => {
  const dati = readFileSync(new URL('../chat_dati.js', import.meta.url), 'utf8');
  for (const b of E.STORIA_BEATS) assert.ok(dati.includes(b.flag), b.flag + ' è letto da qualche conversazione');
});
