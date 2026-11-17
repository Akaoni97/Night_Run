// ============================================================================
//  Night Run · Le chat del telefono (dopo telefono.js)
//  Conversazioni vere: una persona ti scrive, tu scegli tra 2 o 3 risposte, e da quello che rispondi si aprono strade
//  diverse (alcune tornano sullo stesso punto, altre no). Ogni persona ha una BARRA DI CONFIDENZA: sale con le risposte
//  che le piacciono (i suoi gusti si scoprono col tempo) e a 25, 50, 75 e 100 si sbloccano altre conversazioni.
//  Non si è obbligati a rispondere a nessuno: una chat ignorata resta lì ad aspettare. Si può coltivare una persona
//  sola, o tutte (nessuna barra ne svuota un'altra).
//
//  Il file ha due parti: il MOTORE (funzioni pure sullo stato `game.s.chat`, provate in test/chat.test.js) e la
//  GRAFICA (messaggi con "sta scrivendo…", barre, rubrica a schede), che si aggancia a telefono.js.
//
//  I nodi (testi e bivi) stanno in chat_dati.js, generato da strumenti/importa_chat.py a partire dal materiale scritto da Codex.
//
//  Formato di un nodo (CHAT_LIST):
//    { id, who, text: 'riga' | ['riga', 'riga'], alt?: [{ req, text }],      // alt: versione diversa se req è vero
//      opts?: [{ t, to, tono, fx?: [...], req? }], next?: 'ID' }             // senza opts e senza next: la chat finisce
//  Effetti (fx): 'conf:Nome+4' · 'flag:nome' · 'cnt:legami+1' (conoscenza, legami, patti, varchi) · 'sblocca:ID' · 'chiude:ID'
//  Condizioni (req): 'flag:x' · '!flag:x' · 'conf:Nome>=50' · 'km>=10' (una stringa o un array: valgono tutte)
// ============================================================================
const CHAT_SOGLIE = [25, 50, 75, 100];
const CHAT_TIER = ['Sconosciuti', 'Conoscenti', 'Amici', 'Fidati', 'Complici'];
const CHAT_TIER_PRES = ['Estranea', 'Attenta', 'Insistente', 'Vicina', 'Dentro'];
const CHAT_TONI = ['sboccato', 'pacato', 'ironico', 'gentile', 'freddo', 'sincero', 'evasivo'];
const CHAT_CNT = ['conoscenza', 'legami', 'patti', 'varchi'];

// le persone: ruolo, colore, gusti (1 piace, −1 non piace, assente = indifferente) e quanto sale/scende la barra a ogni risposta
// (k: piace, indifferente, non piace). presenza = barra rossa e «fiducia». nobar = nome che compare senza barra (la presenza lo imita).
const CHAT_NPC = {
  Elena: { ruolo: 'Sorella', col: '#e879a6', k: [2, 1, -1], gusti: { ironico: 1, gentile: 1, sincero: 1, freddo: -1, evasivo: -1 } },
  Rosa: { ruolo: 'Meccanica', col: '#f59e0b', k: [3, 1, -1], gusti: { sboccato: 1, sincero: 1, ironico: 1, evasivo: -1, freddo: -1 } },
  Livia: { ruolo: 'Archivista', col: '#38bdf8', k: [3, 1, -2], gusti: { pacato: 1, sincero: 1, gentile: 1, sboccato: -1, evasivo: -1 } },
  Sconosciuto: { ruolo: 'Numero nascosto', col: '#ef4444', presenza: true, k: [4, 1, -1], gusti: { gentile: 1, sincero: 1, ironico: 1, freddo: -1, sboccato: -1 } },
  'Zio Claudio': { ruolo: 'Zio', col: '#9ca3af', k: [0, 0, 0], gusti: {}, nobar: true },
};
// CHAT_LIST, CHAT_START e CHAT_TONI_MAP stanno in chat_dati.js (generato da strumenti/importa_chat.py)
// CHAT_UNLOCK (cosa si apre a ogni soglia di confidenza) sta anche lui in chat_dati.js
const CHAT_NODES = {};
for (const n of CHAT_LIST) {
  CHAT_NODES[n.id] = n;
  const tt = CHAT_TONI_MAP[n.id] || [];
  (n.opts || []).forEach((o, i) => { o.tono = tt[i] || o.tono || 'pacato'; });
}

// ------------------------------------------------------------ motore (funzioni pure sullo stato s)
// «chi parla» e «in che chat compare» possono differire: la presenza può scrivere dentro la chat di Elena o di zio Claudio
// (node.as = nome della chat; node.who = a chi vanno confidenza e gusti). La chiave di una chat è sempre il nome con cui compare.
function chatState(s) {
  if (!s.chat) s.chat = { conf: {}, taste: {}, flags: {}, cnt: { conoscenza: 0, legami: 0, patti: 0, varchi: 0 }, th: {}, started: {}, closed: {}, q: [] };
  const c = s.chat; for (const k of ['conf', 'taste', 'flags', 'th', 'started', 'closed']) if (!c[k]) c[k] = {};
  if (!c.cnt) c.cnt = { conoscenza: 0, legami: 0, patti: 0, varchi: 0 }; if (!Array.isArray(c.q)) c.q = [];
  return c;
}
const chatConf = (s, who) => chatState(s).conf[who] || 0;
const chatKey = (n) => n.as || n.who;
function chatThread(c, tk) { return c.th[tk] || (c.th[tk] = { who: tk, msgs: [], at: null, seen: 0, k: 0, done: {} }); }
function chatCond(s, km, req) {
  if (!req) return true; if (Array.isArray(req)) return req.every((r) => chatCond(s, km, r));
  const c = chatState(s); let m;
  if ((m = /^(!?)flag:(.+)$/.exec(req))) return !!c.flags[m[2]] !== (m[1] === '!');
  if ((m = /^conf:(.+?)(>=|<=|>|<)(\d+)$/.exec(req))) { const v = c.conf[m[1]] || 0, n = +m[3]; return m[2] === '>=' ? v >= n : m[2] === '<=' ? v <= n : m[2] === '>' ? v > n : v < n; }
  if ((m = /^km>=([\d.]+)$/.exec(req))) return km >= +m[1];
  if ((m = /^fatto:(.+)$/.exec(req))) return Object.values(c.th).some((t) => t.done[m[1]]);       // quel nodo è già stato letto
  return false;
}
// righe di un nodo, con la versione diversa se una condizione di `alt` è vera
function chatLines(s, km, node) {
  let t = node.text; for (const a of node.alt || []) if (chatCond(s, km, a.req)) { t = a.text; break; }
  return Array.isArray(t) ? t : [t];
}
// cambia la confidenza: restituisce le soglie appena superate
function chatSetConf(s, km, who, d) {
  const c = chatState(s), old = c.conf[who] || 0, nu = Math.max(0, Math.min(100, old + d)); c.conf[who] = nu;
  const crossed = d > 0 ? CHAT_SOGLIE.filter((t) => old < t && nu >= t) : [];
  if (!c.opened) c.opened = {};
  for (const t of crossed) {
    if (c.opened[who + ':' + t]) continue;                    // una soglia si consuma una volta sola: scendere e risalire non riapre la chat
    c.opened[who + ':' + t] = 1;
    for (const id of ((CHAT_UNLOCK[who] || {})[t] || [])) c.q.push({ node: id, km: km + 0.6 });
  }
  return crossed;
}
function chatApply(s, km, fx) {
  const c = chatState(s), ev = [];
  for (const f of fx || []) {
    let m;
    if ((m = /^conf:(.+?)([+-]\d+)$/.exec(f))) { const cr = chatSetConf(s, km, m[1], +m[2]); for (const t of cr) ev.push({ type: 'soglia', who: m[1], t }); }
    else if ((m = /^flag:(.+)$/.exec(f))) c.flags[m[1]] = 1;
    else if ((m = /^cnt:(\w+)([+-]\d+)$/.exec(f))) { if (CHAT_CNT.includes(m[1])) c.cnt[m[1]] = Math.max(0, (c.cnt[m[1]] || 0) + +m[2]); }
    else if ((m = /^sblocca:(.+)$/.exec(f))) c.q.push({ node: m[1], km: km + 0.3 });
    else if ((m = /^chiude:(.+)$/.exec(f))) c.closed[m[1]] = 1;
  }
  return ev;
}
// entra in un nodo: aggiunge le sue righe alla chat; se ha risposte la chat aspetta, se ha `next` prosegue, altrimenti finisce.
// Un nodo con `req` falso passa alla battuta `fallback` (se c'è), altrimenti non si legge.
function chatEnter(s, km, tk, id) {
  const c = chatState(s), th = chatThread(c, tk), ev = [];
  for (let guard = 0; guard < 6 && id; guard++) {
    let n = CHAT_NODES[id]; if (!n || c.closed[id]) { th.at = null; break; }
    if (n.req && !chatCond(s, km, n.req)) { if (n.fallback) { id = n.fallback; continue; } th.at = null; break; }
    const lines = chatLines(s, km, n);
    for (const x of lines) th.msgs.push({ d: 'i', x, k: km, n: n.id, im: n.as ? 1 : 0 });
    th.k = km; th.done[n.id] = 1; ev.push({ type: 'msg', who: tk, text: lines[lines.length - 1], node: n.id });
    if (n.opts && n.opts.length) { th.at = n.id; break; }
    th.at = null; id = n.next || null;
  }
  return ev;
}
// le risposte che si vedono adesso (quelle con condizione falsa restano nascoste: si sbloccano più avanti)
function chatOptions(s, km, tk) {
  const th = chatState(s).th[tk]; if (!th || !th.at) return [];
  const n = CHAT_NODES[th.at]; if (!n) return [];
  return (n.opts || []).map((o, i) => ({ i, t: o.t, tono: o.tono })).filter((o) => chatCond(s, km, n.opts[o.i].req));
}
// risponde: applica gli effetti, scopre il gusto, passa al nodo dopo. Restituisce { ok, target, reaction, delta, crossed, ev }
function chatReply(s, km, tk, i) {
  const c = chatState(s), th = c.th[tk]; if (!th || !th.at) return { ok: false };
  const n = CHAT_NODES[th.at], o = n && n.opts && n.opts[i]; if (!o || !chatCond(s, km, o.req)) return { ok: false };
  const who = n.who, npc = CHAT_NPC[who] || { gusti: {}, k: [2, 1, -1] };       // confidenza e gusti vanno a chi sta davvero scrivendo
  const g = npc.gusti[o.tono] || 0, fx = (o.fx || []).slice();
  const explicit = fx.some((f) => f.startsWith('conf:' + who));
  const delta = explicit ? 0 : g > 0 ? npc.k[0] : g < 0 ? npc.k[2] : npc.k[1];
  const before = c.conf[who] || 0, imit = !!n.as;
  th.seen = th.msgs.length;
  th.msgs.push({ d: 'o', x: o.t, k: km, tono: o.tono, r: imit ? 0 : g, tg: who }); th.seen = th.msgs.length; th.k = km; th.at = null;
  if (g !== 0 && o.tono) (c.taste[who] || (c.taste[who] = {}))[o.tono] = g > 0 ? 1 : -1;      // il gusto si scopre dalla reazione
  const crossed = delta ? chatSetConf(s, km, who, delta) : [];
  const ev = crossed.map((t) => ({ type: 'soglia', who, t })).concat(chatApply(s, km, fx));
  const after = c.conf[who] || 0;
  if (o.to && o.to !== 'FINE') ev.push(...chatEnter(s, km, tk, o.to));
  return { ok: true, target: who, reaction: imit ? 0 : g, delta: after - before, crossed: ev.filter((e) => e.type === 'soglia' && e.who === who).map((e) => e.t), ev };
}
// ogni secondo: comincia le conversazioni arrivate al loro km (e quelle sbloccate), se la chat di quella persona è libera
function chatTick(s, km) {
  const c = chatState(s), ev = [];
  if (s.vg && s.vg.eredita) c.flags['auto_' + s.vg.eredita] = 1;                  // l'auto scelta dal notaio: le battute possono cambiare di conseguenza (ALT se: auto_panda)
  for (const st of CHAT_START) {
    if (c.started[st.id] || km < st.km || !chatCond(s, km, st.req)) continue;
    if ((c.th[st.th] || {}).at) continue;
    c.started[st.id] = 1; ev.push(...chatEnter(s, km, st.th, st.node));
  }
  for (const q of c.q.slice()) {
    const n = CHAT_NODES[q.node]; if (!n) { c.q.splice(c.q.indexOf(q), 1); continue; }
    if (km < q.km || (c.th[chatKey(n)] || {}).at) continue;
    if (n.req && !n.fallback && !chatCond(s, km, n.req)) continue;     // aspetta i suoi prerequisiti invece di perdersi
    c.q.splice(c.q.indexOf(q), 1); ev.push(...chatEnter(s, km, chatKey(n), q.node));
  }
  return ev;
}
const chatUn = (th) => th.msgs.slice(th.seen).filter((m) => m.d === 'i').length;
const chatUnread = (s) => { const c = s && s.chat; return c ? Object.values(c.th).reduce((a, th) => a + chatUn(th), 0) : 0; };
const chatTier = (v) => { let t = 0; for (let i = 0; i < CHAT_SOGLIE.length; i++) if (v >= CHAT_SOGLIE[i]) t = i + 1; return t; };
const chatThreads = (s) => (s && s.chat ? Object.values(s.chat.th).filter((th) => th.msgs.length).sort((a, b) => b.k - a.k) : []);

// ------------------------------------------------------------ grafica (solo nel browser, dentro il telefono)
(function chatUI() {
  if (typeof document === 'undefined' || typeof window === 'undefined' || !window.telefono || !window.telefono.setMessages) return;
  const TEL = window.telefono, NR = () => window.nightRun, G = () => NR() && NR().game;
  const S = () => { const g = G(); return g && g.s ? g.s : null; };
  const KM = () => { const s = S(); return s ? (s.dist || 0) / 1000 : 0; };
  const fmt = (n, d = 0) => Number(n || 0).toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });
  const UI = { prev: {}, delta: {}, who: null };       // solo grafica: confidenza mostrata prima, scatto appena fatto
  let revT = 0, ctx = null;

  TEL.addCss(`
.ring{width:48px;height:48px;border-radius:50%;padding:3px;flex:none;background:conic-gradient(var(--c) calc(var(--p)*1%),#2c303d 0);display:grid;place-items:center}
.ring .av{width:100%;height:100%;background:var(--s1)}.ring.lg{width:62px;height:62px;padding:3px}.ring.lg .av{font-size:18px}
.ring.pres{animation:flick2 5s steps(1) infinite}@keyframes flick2{0%,92%{opacity:1}94%{opacity:.45}96%{opacity:1}98%{opacity:.7}}
.cstrip{margin:0 12px 6px;padding:8px 10px;border-radius:14px;background:var(--s1);display:grid;gap:5px}
.cstrip .tl{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:2px 8px;font-size:11px;color:var(--t2)}.cstrip .tl b{color:#fff;font:600 12px system-ui}
.cb{position:relative;height:8px;border-radius:5px;background:var(--s3);overflow:visible}
.cb i{position:absolute;left:0;top:0;bottom:0;border-radius:5px;background:var(--c);transition:width .8s cubic-bezier(.2,.8,.2,1);box-shadow:0 0 10px var(--c)}
.cb u{position:absolute;top:-2px;bottom:-2px;width:2px;background:#0c0d12;border-radius:1px}.cb u.on{background:#fff9}
.fl{position:absolute;right:0;top:-18px;font:700 12px system-ui;color:var(--c);animation:fl 1.6s ease-out forwards;pointer-events:none}.fl.neg{color:var(--red)}
@keyframes fl{0%{opacity:0;transform:translateY(6px)}15%{opacity:1}100%{opacity:0;transform:translateY(-12px)}}
.m{animation:pop .22s ease-out}@keyframes pop{from{opacity:0;transform:translateY(6px) scale(.96)}}
.m.cl{border-bottom-right-radius:5px}.m.in{border-bottom-left-radius:5px}
.ts{align-self:center;font-size:10.5px;color:var(--t2);margin:4px 0 0}
.rx{align-self:flex-end;font-size:11px;margin:-2px 4px 0;opacity:.95}.rx.up{color:var(--grn)}.rx.dn{color:var(--red)}
.st{align-self:flex-end;font-size:10px;color:var(--t2);margin:-3px 6px 0}
.typ{align-self:flex-start;display:flex;gap:4px;padding:11px 13px;border-radius:17px;background:var(--s2)}
.typ i{width:7px;height:7px;border-radius:50%;background:#8d92a3;animation:tp 1s infinite}.typ i:nth-child(2){animation-delay:.15s}.typ i:nth-child(3){animation-delay:.3s}
@keyframes tp{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-4px);opacity:1}}
.tray{display:grid;gap:6px;padding:6px 10px 10px;border-top:1px solid #ffffff12;background:#0c0d12}
.tray button{border:1px solid #3b82f666;background:#3b82f61f;color:#cfe0ff;border-radius:15px;padding:8px 12px;font:13px/1.25 system-ui;text-align:left;cursor:pointer}
.tray button:hover{background:#3b82f633}.tray .hint{color:var(--t2);font-size:11.5px;text-align:center;padding:4px}
.pc{display:flex;gap:10px;align-items:center;padding:10px 8px;margin-bottom:8px;border-radius:16px;background:var(--s1);cursor:pointer}.pc:hover{background:var(--s2)}
.pc .px{flex:1;min-width:0;display:grid;gap:4px}.pc b{font:600 14px system-ui}.pc small{color:var(--t2);font-size:11.5px}
.pc .gs{display:flex;flex-wrap:wrap;gap:3px 6px;font-size:10.5px;color:var(--t2)}.pc .gs .u{color:var(--grn)}.pc .gs .d{color:var(--red)}
.pc .dm{letter-spacing:2px;font-size:10px;color:#ffffff55}.pc .dm .on{color:var(--amb)}
.cbtn{width:34px;height:34px;border-radius:50%;border:0;background:var(--s3);color:#fff;font-size:15px;cursor:pointer;flex:none}
.sec{margin:8px 4px 6px;font:600 11px system-ui;color:var(--t2);text-transform:uppercase;letter-spacing:.07em}
.lrow .tx small.typing{color:var(--blue)}
`);

  // un suono breve e morbido per ogni messaggio (solo se il browser lo permette: parte dopo il primo tocco)
  function blip() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      if (!ctx) ctx = new AC(); if (ctx.state === 'suspended') ctx.resume(); if (ctx.state !== 'running') return;
      const t = ctx.currentTime, g = ctx.createGain(); g.connect(ctx.destination); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      for (const [f, d] of [[880, 0], [1320, 0.09]]) { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.connect(g); o.start(t + d); o.stop(t + d + 0.16); }
    } catch (e) { /* senza suono */ }
  }
  window.addEventListener('pointerdown', () => { try { if (ctx && ctx.state === 'suspended') ctx.resume(); } catch (e) { /* ok */ } }, { once: true, capture: true });

  const npc = (who) => CHAT_NPC[who] || { ruolo: '', col: '#8d92a3', gusti: {} };
  const tierName = (who, v) => ((npc(who).presenza ? CHAT_TIER_PRES : CHAT_TIER)[chatTier(v)]);
  const ring = (H, who, lg) => `<span class="ring ${lg ? 'lg' : ''} ${npc(who).presenza ? 'pres' : ''}" style="--p:${chatConf(S(), who)};--c:${npc(who).col}">${H.av(who, npc(who).presenza)}</span>`;
  const bar = (who, v, w) => `<div class="cb" style="--c:${npc(who).col}"><i data-w="${v}" style="width:${w}%"></i>${CHAT_SOGLIE.slice(0, 3).map((t) => `<u class="${v >= t ? 'on' : ''}" style="left:${t}%"></u>`).join('')}${UI.delta[who] ? `<span class="fl ${UI.delta[who] < 0 ? 'neg' : ''}">${UI.delta[who] > 0 ? '+' : '−'}${Math.abs(UI.delta[who])}</span>` : ''}</div>`;
  const tastes = (who) => {
    const t = chatState(S()).taste[who] || {}, known = Object.keys(t);
    const chips = known.map((k) => `<span class="${t[k] > 0 ? 'u' : 'd'}">${t[k] > 0 ? '▲' : '▼'} ${k}</span>`).join('');
    const left = Math.min(3, CHAT_TONI.length - known.length);
    return chips + (left > 0 ? `<span>${'? '.repeat(left).trim()}</span>` : '');
  };
  const diamonds = (v) => `<span class="dm">${CHAT_SOGLIE.map((t) => `<span class="${v >= t ? 'on' : ''}">◆</span>`).join('')}</span>`;
  const last = (th) => th.msgs[th.msgs.length - 1];

  // lista dei messaggi: le chat (con la loro barra) e i vecchi messaggi sciolti, mescolati per tempo
  function renderMsg(H) {
    const s = S(), st = H.ST.stack[1];
    if (typeof st === 'string' && st.startsWith('ch:')) return thread(H, st.slice(3));
    const rows = [];
    for (const th of chatThreads(s)) {
      const who = th.who, u = chatUn(th), l = last(th), typing = u > 0 && UI.typing === who;
      rows.push({ k: th.k, html: `<div class="row lrow" data-ch="open" data-who="${H.esc(who)}">${ring(H, who)}<span class="tx"><b>${H.esc(who)}</b><small class="${typing ? 'typing' : ''}">${typing ? 'sta scrivendo…' : (l.d === 'o' ? 'Tu: ' : '') + H.esc(l.x)}</small></span>${u ? `<span class="un">${u}</span>` : ''}</div>` });
    }
    const leg = H.telThreads(KM());
    leg.forEach((t, i) => { const u = H.unreadOf(t); rows.push({ k: t.km, html: `<div class="row" data-push="${i}">${H.av(t.n, t.bad)}<span class="tx"><b>${H.esc(t.n)}</b><small>${H.esc(t.m[t.m.length - 1].text)}</small></span>${u ? `<span class="un">${u}</span>` : ''}</div>` }); });
    rows.sort((a, b) => b.k - a.k);
    return `<div class="view app">${H.nav('Messaggi')}<div class="body">${rows.length ? rows.map((r) => r.html).join('') : '<p class="cen">Nessun messaggio.</p>'}</div></div>`;
  }
  function thread(H, who) {
    const s = S(), c = chatState(s), th = c.th[who]; if (!th) return `<div class="view app">${H.nav(H.esc(who), 1)}<div class="body"><p class="cen">Nessun messaggio.</p></div></div>`;
    const v = chatConf(s, who), vis = th.msgs.slice(0, th.seen), more = th.seen < th.msgs.length, nextIn = more && th.msgs[th.seen].d === 'i';
    UI.who = who; UI.typing = nextIn ? who : null;
    const w0 = UI.prev[who] === undefined ? v : UI.prev[who];
    let html = '', pk = -99;
    vis.forEach((m, i) => {
      if (Math.abs(m.k - pk) >= 1 || i === 0) { html += `<div class="ts">km ${fmt(m.k, 1)}</div>`; pk = m.k; }
      html += `<div class="m ${m.d === 'o' ? 'me cl' : 'in'} ${npc(who).presenza && m.d === 'i' ? 'bad' : ''}">${H.esc(m.x)}</div>`;
      if (m.d === 'o') {
        const nx = vis[i + 1], first = H.esc(who);
        if (m.r > 0) html += `<div class="rx up">▲ ${first} apprezza</div>`; else if (m.r < 0) html += `<div class="rx dn">▼ ${first} storce il naso</div>`;
        if (i === vis.length - 1 || (nx && nx.d === 'i')) html += `<div class="st">${nx ? '✓✓ letto' : '✓ inviato'}</div>`;
      }
    });
    if (nextIn) html += `<div class="typ"><i></i><i></i><i></i></div>`;
    const opts = !more ? chatOptions(s, KM(), who) : [];
    const tray = more ? '<div class="tray"><div class="hint">…</div></div>'
      : opts.length ? `<div class="tray">${opts.map((o) => `<button data-ch="r" data-who="${H.esc(who)}" data-i="${o.i}">${H.esc(o.t)}</button>`).join('')}</div>`
      : `<div class="tray"><div class="hint">${th.at ? '' : 'La conversazione è finita. Se ti scrive ancora, lo vedrai qui.'}</div></div>`;
    const strip = npc(who).nobar ? '' : `<div class="cstrip" style="--c:${npc(who).col}"><div class="tl"><b>${npc(who).ruolo}</b><span>${npc(who).presenza ? 'fiducia' : 'confidenza'} ${v} · ${tierName(who, v)}</span></div>${bar(who, v, w0)}</div>`;
    return `<div class="view app">${H.nav(H.esc(who), 1)}${strip}<div class="body" id="chbody"><div class="chat">${html}</div></div>${tray}</div>`;
  }
  function renderCon(H) {
    const s = S(), a = H.atto(), ths = chatThreads(s).map((t) => t.who).filter((w) => !npc(w).nobar), names = new Set(ths);
    const cards = ths.map((who) => { const v = chatConf(s, who); return `<div class="pc" data-ch="open" data-who="${H.esc(who)}" style="--c:${npc(who).col}">${ring(H, who, 1)}<div class="px"><b>${H.esc(who)}</b><small>${npc(who).ruolo} · ${tierName(who, v)}</small>${bar(who, v, v)}<div class="gs">${tastes(who)}</div><div>${diamonds(v)} <span class="dm">${v}/100</span></div></div><button class="cbtn" data-call="${H.esc(who)}">✆</button></div>`; }).join('');
    const rest = H.rubrica.filter((c) => a >= c[2] && !names.has(c[0])).map((c) => `<div class="row" data-call="${H.esc(c[0])}">${H.av(c[0], c[2] > 0)}<span class="tx"><b>${H.esc(c[0])}</b><small>${H.esc(c[1])}</small></span></div>`).join('');
    return `<div class="view app">${H.nav('Rubrica')}<div class="body">${cards ? `<div class="sec">Persone</div>${cards}<div class="sec">Altri numeri</div>` : ''}${rest}</div></div>`;
  }

  // dopo ogni disegno: barra che scatta, scorrimento in fondo, e il prossimo messaggio con "sta scrivendo…"
  function after(scr, H) {
    const body = scr.getElementById ? scr.getElementById('chbody') : scr.querySelector('#chbody'); if (body) body.scrollTop = body.scrollHeight;
    scr.querySelectorAll('.cb i[data-w]').forEach((el) => { const to = el.getAttribute('data-w'); requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = to + '%'; })); });
    const who = UI.who, st = H.ST.stack[1];
    if (H.ST.view !== 'msg' || typeof st !== 'string' || !st.startsWith('ch:')) { clearTimeout(revT); return; }
    const w = st.slice(3); UI.prev[w] = chatConf(S(), w); UI.delta[w] = 0;
    const th = chatState(S()).th[w]; clearTimeout(revT);
    if (th && th.seen < th.msgs.length) {
      const m = th.msgs[th.seen], wait = m.d === 'o' ? 0 : Math.min(2000, 650 + m.x.length * 16);
      revT = setTimeout(() => { if (H.ST.view === 'msg' && H.ST.stack[1] === st) { th.seen++; blip(); H.render(true); H.refreshBtn(); } }, wait);
    } else H.refreshBtn();
  }
  function click(D, t, H) {
    const s = S(); if (!s) return;
    if (D.ch === 'open') { H.ST.view = 'msg'; H.ST.stack = ['msg', 'ch:' + D.who]; H.render(); return; }
    if (D.ch === 'r') {
      const who = D.who, r = chatReply(s, KM(), who, +D.i); if (!r.ok) return;
      const tg = r.target || who; UI.prev[tg] = UI.prev[tg] === undefined ? chatConf(s, tg) - r.delta : UI.prev[tg]; UI.delta[tg] = r.delta;
      for (const e of r.ev) if (e.type === 'soglia') H.toast(e.who, `Confidenza ${e.t}: ${tierName(e.who, e.t)}. Si apre qualcosa di nuovo.`, 0);
      if (window.nightRun && window.nightRun.save) window.nightRun.save();
      H.render(true);
    }
  }
  // ogni secondo: conversazioni che cominciano (con avviso) e chat già aperta che si aggiorna
  function tick(k, g, H) {
    const s = g && g.s; if (!s) return;
    const ev = chatTick(s, k), msgs = ev.filter((e) => e.type === 'msg');
    for (const e of msgs) {
      const viewing = H.ST.on && H.ST.view === 'msg' && H.ST.stack[1] === 'ch:' + e.who;
      if (!viewing) H.toast(e.who, e.text, !!npc(e.who).presenza, () => { TEL.show('msg'); H.ST.stack = ['msg', 'ch:' + e.who]; H.render(); });
      blip();
    }
    if (ev.length) { if (window.nightRun && window.nightRun.save) window.nightRun.save(); H.refreshBtn(); if (H.ST.on && (H.ST.view === 'msg' || H.ST.view === 'con')) H.render(true); }
  }
  TEL.setMessages({
    renderMsg, renderCon, after, click, tick,
    unread: () => chatUnread(S()),
    last: () => { const th = chatThreads(S())[0]; return th ? { from: th.who, text: last(th).x, km: th.k } : null; },
  });
})();

if (typeof window !== 'undefined') {
  Object.assign(window, { CHAT_NPC, CHAT_LIST, CHAT_NODES, CHAT_START, CHAT_UNLOCK, CHAT_SOGLIE, CHAT_TONI, chatState, chatConf, chatCond, chatLines, chatEnter, chatOptions, chatReply, chatTick, chatUnread, chatThreads, chatSetConf });
  // per provare senza giocare per ore: chatDebug.flag('ev_fase_v') · .conf('Rosa', 60) · .vai('ROS_attrezzi_01') · .km(300)
  window.chatDebug = {
    flag: (n) => { const g = window.nightRun && window.nightRun.game; if (g) chatState(g.s).flags[n] = 1; },
    conf: (who, v) => { const g = window.nightRun && window.nightRun.game; if (g) chatSetConf(g.s, g.s.dist / 1000, who, v - chatConf(g.s, who)); },
    vai: (id) => { const g = window.nightRun && window.nightRun.game, n = CHAT_NODES[id]; if (g && n) { const th = chatThread(chatState(g.s), chatKey(n)); th.at = null; chatEnter(g.s, g.s.dist / 1000, chatKey(n), id); } },
    stato: () => { const g = window.nightRun && window.nightRun.game; return g ? JSON.stringify(chatState(g.s)) : null; },
  };
}
