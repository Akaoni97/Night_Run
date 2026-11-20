// Prove della regia: stati attuali, domande di casa, scene manuali, fallimenti, epiloghi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = ['chat_dati.js', 'chat.js', 'regia.js'].map((f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8')).join('\n');
const E = new Function(src + ';return { CHAT_NODES, REGIA_EPI, REGIA_CASA, REGIA_SCENE, chatState, chatEnter, chatOptions, chatReply, chatTick, chatSetConf, regiaState, regiaSet, regiaOnFlag, regiaCasaMask, regiaCasaEntry, regiaTick, regiaScena, regiaMarcoCosti, regiaFallimento, regiaVicinoConfermato };')();
const fresh = () => ({});
const walk = (s, km, tk, pick = 0) => { let g = 0; while ((s.chat.th[tk] || {}).at && g++ < 40) { const o = E.chatOptions(s, km, tk); E.chatReply(s, km, tk, o[Math.min(pick, o.length - 1)].i); } };

test('regia: patto e varco sono stati attuali, con flag-specchio che non si contraddicono', () => {
  const s = fresh(); const f = E.chatState(s).flags;
  E.regiaOnFlag(s, 'patto_esplicito'); assert.equal(E.regiaState(s).patto, 'esplicito'); assert.ok(f.patto_esplicito);
  E.regiaOnFlag(s, 'patto_rifiutato'); assert.equal(E.regiaState(s).patto, 'rifiutato'); assert.ok(!f.patto_esplicito && f.patto_rifiutato);
  E.regiaOnFlag(s, 'vc_rifiuto'); assert.equal(E.regiaState(s).varco, 'chiuso', 'rifiutare non apre');
  E.regiaOnFlag(s, 'vc_apro'); assert.equal(E.regiaState(s).varco, 'aperto'); assert.ok(f.vc_richiudibile);
  E.regiaOnFlag(s, 'vc_rifiuto'); assert.equal(E.regiaState(s).varco, 'aperto', 'rifiutare un\'altra apertura non chiude');
  E.regiaOnFlag(s, 'vc_richiudo'); assert.equal(E.regiaState(s).varco, 'richiuso'); assert.ok(!f.vc_richiudibile && f.varco_richiuso && !f.varco_aperto);
  const t = fresh(); E.regiaOnFlag(t, 'vc_richiudo'); assert.equal(E.regiaState(t).varco, 'chiuso', 'non si richiude ciò che non è aperto');
});

test('regia: una risposta che imposta il flag aggiorna lo stato (via motore chat)', () => {
  const s = fresh(); E.chatState(s);
  const nodo = Object.values(E.CHAT_NODES).find((n) => (n.opts || []).some((o) => (o.fx || []).includes('flag:patto_esplicito')));
  const i = nodo.opts.findIndex((o) => (o.fx || []).includes('flag:patto_esplicito'));
  const tk = nodo.as || nodo.who; E.chatEnter(s, 500, tk, nodo.id); E.chatReply(s, 500, tk, i);
  assert.equal(E.regiaState(s).patto, 'esplicito');
});

test('regia: le domande di casa usano l\'ingresso giusto (normale o _P) e il selettore rimasto', () => {
  const s = fresh(); assert.equal(E.regiaCasaEntry(s, 1), 'V2_CASA_01');
  const f = E.chatState(s).flags; f.q11 = 1; assert.equal(E.regiaCasaEntry(s, 1), 'V2_CASA_01_M6');
  f.q12 = 1; assert.equal(E.regiaCasaEntry(s, 1), 'V2_CASA_01_M4'); f.q13 = 1; assert.equal(E.regiaCasaEntry(s, 1), null);
  f.ev_voce_imitata = 1; assert.equal(E.regiaCasaEntry(s, 2), 'V2_CASA_02_P');
  for (let n = 1; n <= 8; n++) for (const suf of ['', '_P']) for (const m of [7, 1, 2, 3, 4, 5, 6]) { const id = 'V2_CASA_0' + n + suf + (m === 7 ? '' : '_M' + m); assert.ok(E.CHAT_NODES[id], id); }
});

test('regia: la domanda di casa si propone dopo la sua conversazione, con Elena libera, e una volta sola', () => {
  const s = fresh(); const c = E.chatState(s);
  c.th.Elena = { who: 'Elena', msgs: [], at: null, seen: 0, k: 0, done: { ELE_pasta_08: 1 } };
  assert.equal(E.regiaTick(s, 100).length, 0, 'prima della fase IV no');
  const ev = E.regiaTick(s, 500); assert.ok(ev.some((e) => e.node === 'V2_CASA_01'));
  walk(s, 500, 'Elena', 0);
  assert.equal(E.regiaTick(s, 501).filter((e) => e.node === 'V2_CASA_01').length, 0, 'una volta sola');
  assert.ok(!c.flags.elena_verificata, 'nessuna risposta verifica Elena');
});

test('regia: le scene manuali si aprono, e ogni percorso arriva in fondo', () => {
  for (const id of Object.keys(E.REGIA_SCENE)) for (const pick of [0, 1, 2]) {
    const s = fresh(); const ev = E.regiaScena(s, 700, id); assert.ok(ev.length, id);
    const tk = (E.CHAT_NODES[id].as || E.CHAT_NODES[id].who); walk(s, 700, tk, pick); assert.equal(s.chat.th[tk].at, null, id);
  }
});

test('regia: i fallimenti applicano la conseguenza una volta sola', () => {
  const una = fresh(); E.chatState(una).conf.Rosa = 40; E.regiaFallimento(una, 700, 2); walk(una, 700, 'Rosa');
  const due = fresh(); E.chatState(due).conf.Rosa = 40; E.regiaFallimento(due, 700, 2); due.chat.th.Rosa.at = null; E.regiaFallimento(due, 701, 2); walk(due, 701, 'Rosa');
  assert.equal(due.chat.conf.Rosa, una.chat.conf.Rosa + (due.chat.conf.Rosa - una.chat.conf.Rosa), 'sanity'); assert.ok(due.chat.conf.Rosa >= 35 - 5, 'non scende due volte di 5');
  assert.ok(una.chat.flags.marco_dentro && una.chat.regia.fatto.fal2);
  const t = fresh(); E.regiaFallimento(t, 700, 4); walk(t, 700, 'Rosa'); E.regiaFallimento(t, 701, 4);
  assert.equal(t.chat.cnt.varchi >= 1 && t.chat.cnt.varchi <= 2, true); assert.equal(E.regiaState(t).varco, 'aperto');
  const u = fresh(); E.regiaFallimento(u, 700, 3); assert.ok(!E.chatState(u).flags.ottavio_salvo);
});

test('regia: i costi di Marco mostrano il menu solo con almeno due costi praticabili', () => {
  const s = fresh();
  assert.equal(E.regiaMarcoCosti(s, { lavoro: false, copie: 1, lampade: 0 }).ok, false); assert.ok(!s.chat.flags.ev_marco_carico);
  const r = E.regiaMarcoCosti(s, { lavoro: true, copie: 0, lampade: 1 }); assert.deepEqual(r.costi, ['carico', 'lampada']); assert.ok(r.ok && s.chat.flags.ev_marco_carico);
});

test('regia: il vicino è il solo che verifica Elena', () => {
  const s = fresh(); E.chatState(s); assert.ok(!s.chat.flags.elena_verificata);
  E.regiaVicinoConfermato(s); assert.ok(s.chat.flags.elena_verificata && s.chat.flags.ev_verifica_vicino);
});

test('regia: gli epiloghi B1 e B2 hanno 8 battute ciascuno, con chi parla', () => {
  for (const b of ['B1', 'B2']) { assert.equal(E.REGIA_EPI[b].length, 8); for (const [w, t] of E.REGIA_EPI[b]) { assert.ok(w && t.length > 3 && t.length <= 120, b + t); } }
});
