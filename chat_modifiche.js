// ============================================================================
//  Night Run · Ritocchi ai testi delle chat (dopo chat_dati.js, prima di chat.js)
//  chat_dati.js è generato e non si tocca: i testi cambiati col file strumenti/editor_storia.html finiscono qui, per ID.
//  Si aggiorna con `node strumenti/assorbi_modifiche.mjs <modifiche_storia.json>` (non a mano).
//  Formato: { ID: { text: 'riga' | ['riga', ...], alt: { indice: 'testo' }, opts: { indice: 'testo risposta' } } }
//  Cambia solo i testi: bivi, condizioni, effetti e toni restano quelli di chat_dati.js.
// ============================================================================
const CHAT_MOD = /*MOD*/{}/*FINE*/;
function chatModApplica(list, mod) {
  const by = {}; let k = 0;
  for (const n of list) by[n.id] = n;
  for (const id of Object.keys(mod)) {
    const n = by[id], m = mod[id]; if (!n) continue;
    if (m.text != null) n.text = m.text;
    if (m.alt) for (const i of Object.keys(m.alt)) if (n.alt && n.alt[i]) n.alt[i].text = m.alt[i];
    if (m.opts) for (const i of Object.keys(m.opts)) if (n.opts && n.opts[i]) n.opts[i].t = m.opts[i];
    k++;
  }
  return k;
}
chatModApplica(CHAT_LIST, CHAT_MOD);
