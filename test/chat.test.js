// Prove delle chat del telefono: il motore (bivi, confidenza, gusti, soglie, chat ignorate) e i dati importati dal materiale di Codex.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = ['chat_dati.js', 'chat.js'].map((f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8')).join('\n');
const E = new Function(src + ';return { CHAT_NPC, CHAT_LIST, CHAT_NODES, CHAT_START, CHAT_UNLOCK, CHAT_TONI, CHAT_SOGLIE, chatState, chatConf, chatCond, chatEnter, chatOptions, chatReply, chatTick, chatUnread, chatSetConf, chatThreads };')();
const tel = readFileSync(new URL('../telefono.js', import.meta.url), 'utf8');
const { TEL_APP_OFFERS, TEL_SMS } = new Function(tel + ';return { TEL_APP_OFFERS, TEL_SMS };')();
const fresh = () => ({});
const first = (id) => E.CHAT_START.find((s) => s.node === id);
// risponde sempre con la risposta n finché la chat aspetta
const walk = (s, km, tk, pick = () => 0) => { let g = 0; while ((s.chat.th[tk] || {}).at && g++ < 40) { const o = E.chatOptions(s, km, tk); assert.ok(o.length, 'una chat che aspetta deve avere risposte'); E.chatReply(s, km, tk, o[Math.min(pick(g), o.length - 1)].i); } };

test('chat: le 28 conversazioni di Elena, Rosa e Livia ci sono tutte', () => {
  const ing = ['ELE_ritiro_01', 'ELE_pasta_01', 'ELE_turno_01', 'ELE_coinquilino_01', 'ELE_cena_01', 'ELE_bollette_01', 'ELE_richiamo_01', 'ELE_litigio_01', 'ELE_distanza_01', 'ELE_riparazione_01', 'ELE_nonno_01', 'ELE_cena_ritorno_01',
    'ROS_attrezzi_01', 'ROS_prudenza_01', 'ROS_ricontrollo_01', 'ROS_passato_01', 'ROS_promessa_01', 'ROS_dopo_passaggio_01', 'ROS_segni_01', 'ROS_recupero_01', 'ROS_guardia_01', 'ROS_prima_porta_01',
    'LIV_primo_01', 'LIV_affido_01', 'LIV_ottavio_01', 'LIV_fiducia_01', 'LIV_irene_01', 'LIV_promessa_01'];
  assert.equal(ing.length, 28);
  for (const id of ing) assert.ok(first(id), `manca la partenza di ${id}`);
});

test('chat: ogni conversazione parte al suo km, e una chat ignorata resta lì ad aspettare', () => {
  const s = fresh(), st = first('ELE_ritiro_01');
  assert.ok(st.km >= 18, 'la prima chat non arriva subito');
  assert.equal(E.chatTick(s, st.km - 1).length, 0);
  assert.ok(E.chatTick(s, st.km).some((e) => e.who === 'Elena' && e.node === 'ELE_ritiro_01'));
  assert.equal(E.chatUnread(s), 1);
  E.chatTick(s, 9999);                                           // chilometri senza rispondere
  const th = s.chat.th.Elena;
  assert.equal(th.at, 'ELE_ritiro_01', 'la domanda aspetta');
  assert.equal(th.msgs.length, 1, 'e le altre chat con lei non la scavalcano');
});

test('chat: le risposte che piacciono alzano la barra e svelano il gusto; quelle che non piacciono la abbassano', () => {
  const s = fresh(); E.chatEnter(s, 20, 'Rosa', 'ROS_attrezzi_01');
  const o = E.chatOptions(s, 20, 'Rosa'), sbocc = o.find((x) => x.tono === 'sboccato'), freddo = o.find((x) => x.tono !== 'sboccato');
  assert.ok(sbocc, 'Rosa ha una risposta sboccata');
  const r = E.chatReply(s, 20, 'Rosa', sbocc.i);
  assert.equal(r.reaction, 1); assert.equal(r.delta, E.CHAT_NPC.Rosa.k[0]);
  assert.equal(s.chat.taste.Rosa.sboccato, 1, 'il gusto si scopre dalla reazione');
  assert.ok(freddo);
  const t = fresh(); E.chatEnter(t, 20, 'Livia', 'LIV_primo_01');
  const l = E.chatOptions(t, 20, 'Livia'), iro = l.find((x) => x.tono === 'ironico');
  assert.ok(iro, 'Livia ha una risposta ironica');
  E.chatSetConf(t, 20, 'Livia', 10);
  assert.equal(E.chatReply(t, 20, 'Livia', iro.i).reaction, 0, 'a Livia l\'ironia è indifferente: la barra sale poco');
  assert.equal(E.chatConf(t, 'Livia'), 10 + E.CHAT_NPC.Livia.k[1]);
});

test('chat: lo sboccato piace a Rosa e non a Livia', () => {
  assert.equal(E.CHAT_NPC.Rosa.gusti.sboccato, 1);
  assert.equal(E.CHAT_NPC.Livia.gusti.sboccato, -1);
});

test('chat: la presenza scrive dentro la chat di Elena ma la confidenza va a lei, e non lo dice', () => {
  const s = fresh(); E.chatEnter(s, 500, 'Elena', 'PRE_2_03');
  assert.equal(E.CHAT_NODES.PRE_2_03.who, 'Sconosciuto');
  assert.equal(s.chat.th.Elena.msgs[0].im, 1, 'il messaggio è segnato come imitazione');
  const o = E.chatOptions(s, 500, 'Elena'), r = E.chatReply(s, 500, 'Elena', o[0].i);
  assert.equal(r.target, 'Sconosciuto');
  assert.equal(E.chatConf(s, 'Elena'), 0, 'la barra di Elena non si muove');
  assert.ok(E.chatConf(s, 'Sconosciuto') > 0, 'quella della presenza sì');
  assert.equal(s.chat.th.Elena.msgs[1].r, 0, 'nessuna reazione che svela l\'imitazione');
});

test('chat: una battuta condizionata passa all\'altra se la condizione manca (PRE_1_08 → PRE_1_09)', () => {
  const s = fresh(); E.chatEnter(s, 200, 'Sconosciuto', 'PRE_1_07');
  const a = E.chatOptions(s, 200, 'Sconosciuto').find((x) => /confronto/i.test(x.t));
  E.chatReply(s, 200, 'Sconosciuto', a.i);
  const nodi = s.chat.th.Sconosciuto.msgs.map((m) => m.n);
  assert.ok(nodi.includes('PRE_1_09') && !nodi.includes('PRE_1_08'));
  const t = fresh(); E.chatState(t).flags.copia_conservata = 1; E.chatEnter(t, 200, 'Sconosciuto', 'PRE_1_07');
  E.chatReply(t, 200, 'Sconosciuto', E.chatOptions(t, 200, 'Sconosciuto').find((x) => /confronto/i.test(x.t)).i);
  assert.ok(t.chat.th.Sconosciuto.msgs.some((m) => m.n === 'PRE_1_08'));
});

test('chat: le conversazioni che ricordano una scelta partono solo se l\'hai fatta; quelle che aspettano un evento restano ferme', () => {
  const s = fresh(); E.chatTick(s, 130);
  assert.ok(!(s.chat.started.st_ELE_richiamo_01), 'senza la promessa della sosta il richiamo non parte');
  E.chatState(s).flags.elena_sosta_promessa = 1; E.chatTick(s, 130);
  assert.ok(s.chat.started.st_ELE_richiamo_01 || (s.chat.th.Elena || {}).at, 'con la promessa può partire (se la chat è libera)');
  const t = fresh(); E.chatTick(t, 99999);
  assert.ok(!t.chat.started.st_ROS_dopo_passaggio_01 && !t.chat.started.st_LIV_irene_01 && !t.chat.started.st_ELE_distanza_01, 'aspettano eventi che non ci sono ancora');
  E.chatState(t).flags.ev_incursione_1_conclusa = 1;
  for (let g = 0; g < 30 && !t.chat.started.st_ROS_dopo_passaggio_01; g++) { for (const th of Object.values(t.chat.th)) th.at = null; E.chatTick(t, 99999); }     // si liberano le chat una dopo l'altra, in ordine
  assert.ok(t.chat.started.st_ROS_dopo_passaggio_01, 'con l\'evento partono');
});

test('chat: le soglie di confidenza aprono una conversazione, ma solo se la chat di quella persona è libera', () => {
  E.CHAT_UNLOCK.Rosa = { 25: ['ROS_prudenza_01'] };
  try {
    const s = fresh(); E.chatEnter(s, 20, 'Rosa', 'ROS_attrezzi_01');
    assert.deepEqual(E.chatSetConf(s, 20, 'Rosa', 26), [25]);
    assert.equal(E.chatTick(s, 30).filter((e) => e.node === 'ROS_prudenza_01').length, 0, 'la chat con Rosa è occupata');
    walk(s, 30, 'Rosa');
    assert.equal(s.chat.th.Rosa.at, null);
    assert.ok(E.chatTick(s, 31).some((e) => e.node === 'ROS_prudenza_01'));
  } finally { delete E.CHAT_UNLOCK.Rosa; }
});

test('chat: lo stato si salva e si riprende (JSON)', () => {
  const s = fresh(); E.chatEnter(s, 20, 'Elena', 'ELE_ritiro_01'); E.chatReply(s, 20, 'Elena', 0);
  const back = JSON.parse(JSON.stringify(s));
  assert.equal(E.chatConf(back, 'Elena'), E.chatConf(s, 'Elena'));
  assert.ok(E.chatOptions(back, 21, 'Elena').length > 0, 'si può continuare dopo il ricaricamento');
});

test('chat: ogni conversazione, comunque si risponda, arriva in fondo', () => {
  for (const st of E.CHAT_START) {
    for (const pick of [() => 0, () => 1, () => 2, (g) => g % 3]) {
      const s = fresh(); E.chatState(s).flags.copia_conservata = 1; E.chatEnter(s, 100, st.th, st.node); walk(s, 100, st.th, pick);
      assert.equal((s.chat.th[st.th] || { at: null }).at, null, `${st.node} non finisce`);
    }
  }
});

test('chat: i dati sono coerenti (nodi che esistono, toni noti, frasi brevi, flag richiesti impostati da qualcuno)', () => {
  const setf = new Set(), need = new Set();
  for (const n of E.CHAT_LIST) {
    for (const o of n.opts || []) {
      assert.ok(o.to === 'FINE' || E.CHAT_NODES[o.to], `${n.id}: manca ${o.to}`); assert.ok(E.CHAT_TONI.includes(o.tono), `${n.id}: tono ${o.tono}`);
      assert.ok(o.t.length <= 90, `${n.id}: risposta lunga`); for (const f of o.fx || []) if (f.startsWith('flag:')) setf.add(f.slice(5));
    }
    assert.ok((n.opts || []).length <= 3, `${n.id}: più di 3 risposte`);
    for (const x of [].concat(n.text, ...(n.alt || []).map((a) => a.text))) assert.ok(x.length <= 90, `${n.id}: riga lunga (${x.length})`);
    assert.ok(E.CHAT_NPC[n.who] && (!n.as || E.CHAT_NPC[n.as]), `${n.id}: persona sconosciuta`);
    if (n.fallback) assert.ok(E.CHAT_NODES[n.fallback]);
  }
  for (const st of E.CHAT_START) { assert.ok(E.CHAT_NODES[st.node]); for (const r of [].concat(st.req || [])) { const m = /^flag:(.+)$/.exec(r); if (m) need.add(m[1]); } }
  for (const f of need) assert.ok(setf.has(f) || /^ev_/.test(f), `flag richiesto ma mai impostato: ${f}`);
  for (const [who, p] of Object.entries(E.CHAT_NPC)) for (const k of Object.keys(p.gusti)) assert.ok(E.CHAT_TONI.includes(k), `${who}: gusto ${k}`);
});

test('ritmo: le chat non partono tutte insieme, e tra cartelloni e messaggi passano alcuni minuti di guida', () => {
  const kms = E.CHAT_START.filter((s) => !(s.req || []).some((r) => /ev_/.test(r))).map((s) => s.km).sort((a, b) => a - b);
  assert.ok(kms[0] >= 18, 'la prima chat arriva dopo i primi minuti');
  for (let i = 1; i < kms.length; i++) assert.ok(kms[i] - kms[i - 1] >= 9, `chat troppo vicine: km ${kms[i - 1]} e ${kms[i]}`);
  const km = TEL_APP_OFFERS.map((o) => o.km);
  assert.ok(km[0] >= 4, 'il primo cartellone non arriva subito');
  for (let i = 1; i < km.length; i++) assert.ok(km[i] - km[i - 1] >= 6, `cartelloni troppo vicini: ${km[i - 1]} e ${km[i]}`);
  const sms = TEL_SMS.filter((m) => m.km > 0 && m.km < 100 && m.dir !== 'o').map((m) => m.km);
  for (let i = 1; i < sms.length; i++) assert.ok(sms[i] - sms[i - 1] >= 5, 'messaggi troppo vicini');
});
