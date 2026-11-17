// Prove delle chat del telefono: conversazioni a bivi, confidenza, gusti che si scoprono, soglie, chat ignorate.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../chat.js', import.meta.url), 'utf8');
const E = new Function(src + ';return { CHAT_NPC, CHAT_LIST, CHAT_NODES, CHAT_START, CHAT_UNLOCK, CHAT_TONI, CHAT_SOGLIE, chatState, chatConf, chatCond, chatEnter, chatOptions, chatReply, chatTick, chatUnread, chatSetConf, chatThreads };')();
const tel = readFileSync(new URL('../telefono.js', import.meta.url), 'utf8');
const { TEL_APP_OFFERS, TEL_SMS } = new Function(tel + ';return { TEL_APP_OFFERS, TEL_SMS };')();
const fresh = () => ({});

test('chat: la conversazione comincia al suo km e una chat ignorata resta lì ad aspettare', () => {
  const s = fresh();
  assert.equal(E.chatTick(s, 7.9).length, 0, 'prima del km non scrive nessuno');
  const ev = E.chatTick(s, 8);
  assert.ok(ev.some((e) => e.who === 'Elena' && e.node === 'ELE_01'));
  assert.equal(E.chatUnread(s), 1);
  E.chatTick(s, 500);                                            // si va avanti per chilometri senza rispondere
  const th = s.chat.th.Elena;
  assert.equal(th.at, 'ELE_01', 'la domanda aspetta');
  assert.equal(th.msgs.length, 1, 'non si ripete');
  assert.equal(E.chatOptions(s, 500, 'Elena').length, 3);
});

test('chat: le risposte che piacciono alzano la barra e svelano il gusto, le altre la abbassano o no', () => {
  const s = fresh(); E.chatTick(s, 8);
  let r = E.chatReply(s, 8, 'Elena', 0);                          // «Parte.» · ironico: a Elena piace
  assert.ok(r.ok && r.reaction === 1 && r.delta === 4);
  assert.equal(E.chatConf(s, 'Elena'), 4);
  assert.equal(s.chat.taste.Elena.ironico, 1, 'il gusto si scopre dalla reazione');
  assert.equal(s.chat.th.Elena.at, 'ELE_02', 'prosegue al nodo dopo');
  const t = fresh(); E.chatTick(t, 28);
  r = E.chatReply(t, 28, 'Rosa', 2);                              // «Mi lasci in pace» · freddo: a Rosa non piace
  assert.equal(r.reaction, -1);
  assert.equal(E.chatConf(t, 'Rosa'), 0, 'non scende sotto zero');
  assert.equal(t.chat.taste.Rosa.freddo, -1);
  assert.equal(t.chat.th.Rosa.at, 'ROS_03', 'la risposta fredda apre una strada diversa');
});

test('chat: gusti diversi, persone diverse: lo sboccato piace a Rosa e non a Livia', () => {
  assert.equal(E.CHAT_NPC.Rosa.gusti.sboccato, 1);
  assert.equal(E.CHAT_NPC.Livia.gusti.sboccato, -1);
  const s = fresh(); E.chatTick(s, 28);
  const r = E.chatReply(s, 28, 'Rosa', 1);                        // «E tu chi cazzo sei?»
  assert.equal(r.delta, 4);
});

test('chat: i bivi tornano sullo stesso punto o ne aprono altri; le versioni diverse ricordano le scelte', () => {
  const a = fresh(); E.chatTick(a, 8); E.chatReply(a, 8, 'Elena', 0); E.chatReply(a, 8, 'Elena', 0);   // ELE_02 → «Le ho finite.» (sincero)
  const b = fresh(); E.chatTick(b, 8); E.chatReply(b, 8, 'Elena', 2); E.chatReply(b, 8, 'Elena', 0);   // ELE_03 → «Vi voglio bene»
  const fine = (s) => s.chat.th.Elena.msgs.filter((m) => m.n === 'ELE_fine').map((m) => m.x);
  assert.equal(fine(a).length, 2, 'dopo «Le ho finite» Elena aggiunge una riga');
  assert.equal(fine(b).length, 1, 'strada diversa, stesso punto d\'arrivo ma risposta più breve');
  assert.equal(a.chat.th.Elena.at, null, 'la conversazione è finita');
});

test('chat: alcune risposte compaiono solo più avanti (nodi nascosti)', () => {
  const s = fresh(); E.chatTick(s, 28); E.chatReply(s, 28, 'Rosa', 0);
  assert.equal(s.chat.th.Rosa.at, 'ROS_02');
  assert.equal(E.chatOptions(s, 28, 'Rosa').length, 2, 'con poca confidenza il caffè non c\'è');
  E.chatSetConf(s, 28, 'Rosa', 30);
  assert.equal(E.chatOptions(s, 28, 'Rosa').length, 3, 'a 25 compare');
});

test('chat: le soglie sbloccano conversazioni, ma una alla volta e solo se la chat è libera', () => {
  const s = fresh(); E.chatTick(s, 28);
  const crossed = E.chatSetConf(s, 28, 'Rosa', 26);
  assert.deepEqual(crossed, [25]);
  assert.equal(E.chatTick(s, 29).filter((e) => e.node === 'ROS_s25').length, 0, 'la chat con Rosa è occupata: aspetta');
  E.chatReply(s, 29, 'Rosa', 0); E.chatReply(s, 29, 'Rosa', 0); E.chatReply(s, 29, 'Rosa', 0);   // finisce la prima conversazione
  assert.equal(s.chat.th.Rosa.at, null);
  assert.ok(E.chatTick(s, 30).some((e) => e.node === 'ROS_s25'), 'ora arriva quella sbloccata');
});

test('chat: la presenza ha la sua barra, e un effetto esplicito vale al posto di quello dei gusti', () => {
  const s = fresh(); E.chatTick(s, 42);
  assert.ok(E.CHAT_NPC.Sconosciuto.presenza);
  E.chatReply(s, 42, 'Sconosciuto', 0);                           // «Chi sei?»
  const r = E.chatReply(s, 42, 'Sconosciuto', 1);                 // «Cosa dovrei ricordare?»: conf:+3 esplicito
  assert.equal(r.delta, 3);
});

test('chat: lo stato si salva e si riprende (JSON), e una partita nuova parte da zero', () => {
  const s = fresh(); E.chatTick(s, 8); E.chatReply(s, 8, 'Elena', 1);
  const back = JSON.parse(JSON.stringify(s));
  assert.equal(E.chatConf(back, 'Elena'), 4);
  assert.ok(E.chatReply(back, 9, 'Elena', 0).ok, 'si può continuare dopo il ricaricamento');
  assert.equal(E.chatConf(fresh(), 'Elena'), 0);
});

test('chat: i dati sono coerenti (nodi che esistono, toni noti, frasi brevi, nessun vicolo cieco)', () => {
  for (const n of E.CHAT_LIST) {
    for (const o of n.opts || []) { assert.ok(E.CHAT_NODES[o.to], `${n.id}: manca ${o.to}`); assert.ok(E.CHAT_TONI.includes(o.tono), `${n.id}: tono ${o.tono}`); assert.ok(o.t.length <= 90, `${n.id}: risposta lunga`); assert.ok((n.opts || []).length <= 3, `${n.id}: più di 3 risposte`); }
    const lines = [].concat(n.text, ...(n.alt || []).map((a) => a.text));
    for (const x of lines) assert.ok(x.length <= 90, `${n.id}: riga lunga (${x.length})`);
    assert.ok(E.CHAT_NPC[n.who], `${n.id}: persona sconosciuta`);
  }
  for (const st of E.CHAT_START) assert.ok(E.CHAT_NODES[st.node], 'nodo di partenza che non esiste');
  for (const [who, u] of Object.entries(E.CHAT_UNLOCK)) for (const ids of Object.values(u)) for (const id of ids) assert.equal(E.CHAT_NODES[id].who, who);
  for (const [who, p] of Object.entries(E.CHAT_NPC)) for (const k of Object.keys(p.gusti)) assert.ok(E.CHAT_TONI.includes(k), `${who}: gusto ${k}`);
  // ogni conversazione, comunque si risponda, arriva in fondo
  for (const st of E.CHAT_START) {
    const seen = new Set(), go = (id) => { if (seen.has(id)) return; seen.add(id); const n = E.CHAT_NODES[id]; for (const o of n.opts || []) go(o.to); if (n.next) go(n.next); };
    go(st.node); assert.ok([...seen].some((id) => !(E.CHAT_NODES[id].opts || []).length), `${st.node}: nessuna uscita`);
  }
});

test('ritmo: tra un cartellone e l\'altro passano alcuni minuti di guida, e i primi messaggi non sono tutti insieme', () => {
  const km = TEL_APP_OFFERS.map((o) => o.km);
  assert.ok(km[0] >= 4, 'il primo cartellone non arriva subito');
  for (let i = 1; i < km.length; i++) assert.ok(km[i] - km[i - 1] >= 6, `cartelloni troppo vicini: ${km[i - 1]} e ${km[i]}`);
  const sms = TEL_SMS.filter((m) => m.km > 0 && m.km < 100 && m.dir !== 'o').map((m) => m.km);
  for (let i = 1; i < sms.length; i++) assert.ok(sms[i] - sms[i - 1] >= 5, 'messaggi troppo vicini');
});
