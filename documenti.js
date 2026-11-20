// ============================================================================
//  Night Run · I documenti dell'auto (dopo garage.js)
//  Ogni auto ha tre scadenze, in km di viaggio (nel gioco il tempo è la strada): assicurazione, bollo, revisione.
//  - L'auto ereditata è ferma da anni: tutto scaduto. Dall'Autosalone esce in regola. Dai privati arriva senza la tua
//    assicurazione e a volte col bollo o la revisione scaduti. La carcassa dello sfascio non ha niente.
//  - Assicurazione e bollo si pagano dal telefono (app Libretto); il bollo arretrato costa il 30 % in più.
//    La revisione si fa solo da Mario.
//  - Ai posti di controllo della polizia in prima corsia, passando, a volte ti fermano: con qualcosa di scaduto, multa.
//  Stato in game.s.cars[id].docs = { ass, bollo, rev } (km a cui scade ciascuno). Costanti in DOC.
// ============================================================================
const DOC = {
  durata: { ass: 300, bollo: 500, rev: 1000 },                  // km di validità quando si paga
  ass: { utilitaria: 320, familiare: 400, hot: 560, sportiva: 780, lavoro: 480 },   // premio per 300 km, secondo la categoria
  bolloCv: 1.9, bolloMin: 90, bolloMax: 650,                    // bollo: € per CV, con un minimo e un massimo
  mora: 0.3,                                                    // bollo arretrato: + 30 %
  rev: 85,                                                      // revisione da Mario
  multa: { ass: 650, bollo: 120, rev: 170 },                    // ai controlli
  controllo: 0.4,                                               // passando davanti a un posto di controllo: quanto spesso ti fermano
  avviso: 20,                                                   // km prima della scadenza: avviso sul telefono
  franchigia: 150,                                              // con l'assicurazione in regola carrozzeria e soccorso costano al massimo questo
  malus: 0.25, malusMax: 1, malusKm: 300,                       // ogni sinistro alza il premio del 25 % (al massimo il doppio); ne sparisce uno ogni 300 km senza danni
};
const DOC_NOMI = { ass: 'Assicurazione', bollo: 'Bollo', rev: 'Revisione' };

(function documentiLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  const km = (g) => (g.s.dist || 0) / 1000;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const cat = (id) => (typeof stCat === 'function' ? stCat(id) : 'familiare');
  // i documenti di un'auto (creati la prima volta che servono)
  P.docs = function (id = this.car) {
    const st = this.carState(id); if (st.docs) return st.docs;
    const v = this.s.vg || {}, k = km(this), D = DOC.durata;
    const ereditata = v.inherited && id === (v.eredita || 'v40');
    st.docs = ereditata ? { ass: 0, bollo: 0, rev: 0 } : { ass: k + D.ass, bollo: k + D.bollo, rev: k + D.rev };
    return st.docs;
  };
  P.docScaduti = function (id = this.car) { const d = this.docs(id), k = km(this); return Object.keys(DOC_NOMI).filter((x) => d[x] <= k); };
  // assicurazione in regola? sinistri ancora attivi (ne cala uno ogni DOC.malusKm km senza danni)? un danno coperto dall'assicurazione
  P.docAssOk = function (id = this.car) { return this.docs(id).ass > km(this); };
  P.docSinistri = function (id = this.car) { const d = this.docs(id); return Math.max(0, (d.sin || 0) - Math.floor((km(this) - (d.sinKm || 0)) / DOC.malusKm)); };
  P.docSinistro = function (coperto, id = this.car) {
    const d = this.docs(id); d.sin = this.docSinistri(id) + 1; d.sinKm = km(this);
    this.say(`Assicurazione: copre € ${fmt(coperto)} di danni. Sinistri attivi: ${d.sin}, il premio sale del ${Math.round(Math.min(DOC.malusMax, DOC.malus * d.sin) * 100)} %`, 'info');
  };
  P.docCosto = function (tipo, id = this.car) {
    if (tipo === 'ass') return Math.round((DOC.ass[cat(id)] || 400) * (1 + Math.min(DOC.malusMax, DOC.malus * this.docSinistri(id))) / 5) * 5;
    if (tipo === 'rev') return DOC.rev;
    const cv = this.dlSpec ? this.dlSpec(id).cv : 100, base = Math.min(DOC.bolloMax, Math.max(DOC.bolloMin, Math.round(cv * DOC.bolloCv / 5) * 5));
    return this.docs(id).bollo <= km(this) ? Math.round(base * (1 + DOC.mora) / 5) * 5 : base;
  };
  // paga: assicurazione e bollo ovunque (dal telefono), la revisione solo da Mario. Si rinnova da oggi, o dalla scadenza se non è ancora scaduto
  P.docPaga = function (tipo, id = this.car) {
    if (!DOC_NOMI[tipo]) return { ok: false };
    if (tipo === 'rev' && !(this.inside && this.inside.id === 'niko')) return { ok: false, why: 'La revisione si fa da Mario' };
    const c = this.docCosto(tipo, id); if (this.s.money < c) return { ok: false, why: `Servono € ${fmt(c)}` };
    const d = this.docs(id), k = km(this);
    if (d[tipo] - k > DOC.durata[tipo] * 0.5) return { ok: false, why: `${DOC_NOMI[tipo]}: è già a posto per altri ${fmt(d[tipo] - k)} km` };
    this.s.money -= c; d[tipo] = Math.max(d[tipo], k) + DOC.durata[tipo]; this.docSaid = null;
    this.say(`${DOC_NOMI[tipo]} della ${(CARS[id] && CARS[id].short) || id}: pagato € ${fmt(c)}, a posto fino al km ${fmt(d[tipo])}`, 'buy');
    return { ok: true, price: c };
  };
  // controllo della polizia: con qualcosa di scaduto si paga la multa (una per documento)
  P.docControllo = function () {
    const sc = this.docScaduti(); let tot = 0;
    for (const x of sc) tot += DOC.multa[x];
    this.s.docCtl = (this.s.docCtl || 0) + 1;
    if (!sc.length) { this.say('Posto di controllo: patente e libretto. «Tutto in regola, buona strada.»', 'police'); return { ok: true, multa: 0 }; }
    this.s.money -= tot; this.s.fines = (this.s.fines || 0) + tot;
    this.say(`Posto di controllo: ${sc.map((x) => DOC_NOMI[x].toLowerCase()).join(', ')} ${sc.length > 1 ? 'scaduti' : 'scaduta'}. Multa: − € ${fmt(tot)}. Mettiti in regola dall'app Libretto${sc.includes('rev') ? ' e da Mario' : ''}`, 'police');
    return { ok: true, multa: tot, scaduti: sc };
  };
  // auto comprate: dal privato senza la tua assicurazione (bollo e revisione a caso), dallo sfascio tutto scaduto
  const give = P.usGive;
  if (give) P.usGive = function (id, kmCar, defects, extra = {}, paid = 0) {
    const st = give.call(this, id, kmCar, defects, extra, paid), k = km(this), h = ((kmCar || 0) * 7 + id.length * 13) % 10;
    st.docs = extra.damage ? { ass: 0, bollo: 0, rev: 0 } : { ass: 0, bollo: h < 4 ? 0 : k + 120 + h * 30, rev: h < 3 ? 0 : k + 200 + h * 60 };
    return st;
  };
  // carrozziere (Mario) e soccorso: con l'assicurazione in regola si paga solo la franchigia; il resto lo copre lei e conta come sinistro
  const rc = P.repairCost;
  if (rc) {
    P.repairCostFull = rc;
    P.repairCost = function () { const full = rc.call(this); return this.docAssOk() ? Math.min(full, DOC.franchigia) : full; };
    const rep = P.repair;
    P.repair = function () {
      const full = rc.call(this), pagato = this.repairCost(), r = rep.call(this);
      if (r && r.ok && this.mode === 'career' && full > pagato) this.docSinistro(full - pagato);
      return r;
    };
  }
  // passando accanto a un posto di controllo in prima corsia (strada.js), a volte ti fermano; avvisi sul telefono prima delle scadenze
  const up = P.update;
  P.update = function (dt) {
    up.call(this, dt);
    const v = this.s.vg; if (!v || !v.on || this.inside) return;
    const d = this.s.dist;
    for (const e of this.ents) {
      if (e.kind !== 'police' || !e.busy || e.docChk) continue;
      if (Math.abs(e.x - d) < 14) {
        e.docChk = true; const chk = (this.docRnd || Math.random)() < DOC.controllo;
        if (typeof this.polCheck === 'function') this.polCheck(e, chk);      // con la polizia (polizia.js): passi e ti multano, anche per la velocità
        else if (chk) this.docControllo();
      }
    }
    const k = km(this), dd = this.docs(), prossimo = Object.keys(DOC_NOMI).filter((x) => dd[x] > k && dd[x] - k < DOC.avviso)[0];
    const key = prossimo ? this.car + prossimo + Math.floor(dd[prossimo]) : null;
    if (key && this.docSaid !== key) { this.docSaid = key; this.say(`${DOC_NOMI[prossimo]} della ${(CARS[this.car] && CARS[this.car].short) || ''} in scadenza tra ${fmt(dd[prossimo] - k)} km (app Libretto)`, 'info'); }
  };
  // l'auto ereditata: documenti scaduti da anni (anche se il gioco li aveva già creati prima della scelta nel prologo)
  const inh = P.vgInherit;
  if (inh) P.vgInherit = function () { const r = inh.call(this); if (r) this.carState(this.car).docs = { ass: 0, bollo: 0, rev: 0 }; return r; };
  if (typeof TRG_LIST !== 'undefined') TRG_LIST.push({ id: 'regola', name: 'In regola', text: 'Metti in regola assicurazione, bollo e revisione dell\'auto che guidi.', prize: { soldi: 500 },
    check: (g) => g.s.vg && g.s.vg.inherited && g.docScaduti().length === 0 && g.s.vg.garage.length > 0 });
})();

// ---------------------------------------------------------------- app Libretto e revisione da Mario (solo nel browser)
(function documentiApp() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const G = () => window.nightRun && window.nightRun.game;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const CSS = `
.lb-hd{background:linear-gradient(135deg,#2a3a12,#0e1408);border-radius:16px;padding:10px 12px;margin-bottom:8px;font-size:12px;color:var(--t2)}.lb-hd b{display:block;font:800 16px system-ui;color:#fff}
.lb-car{padding:8px 2px 10px;border-bottom:1px solid #ffffff12}.lb-car>b{display:block;font-size:13.5px;margin-bottom:6px}
.lb-r{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:6px 8px;margin-top:5px;border-radius:10px;background:#ffffff0d}
.lb-r small{display:block;color:var(--t2);font-size:11px}.lb-r.ko{background:#ff453a22;box-shadow:inset 3px 0 #ff453a}.lb-r.warn{box-shadow:inset 3px 0 #ffb347}.lb-r.ok{box-shadow:inset 3px 0 #2fd16a}
.lb-r button{border:0;border-radius:9px;padding:7px 10px;font:700 12px system-ui;background:#2fd16a;color:#062a12}.lb-r button[disabled]{background:#ffffff1a;color:#ffffff66}`;
  const riga = (g, id, tipo) => {
    const d = g.docs(id), k = (g.s.dist || 0) / 1000, left = d[tipo] - k, ko = left <= 0, warn = !ko && left < DOC.avviso * 2, c = g.docCosto(tipo, id);
    const stato = ko ? (d[tipo] <= 0 ? 'scaduto da anni' : `scaduto da ${fmt(-left)} km`) : `valido ancora ${fmt(left)} km`;
    const cur = id === g.car, rev = tipo === 'rev', presto = left > DOC.durata[tipo] * 0.5;
    const btn = rev ? `<button disabled>da Mario · € ${fmt(c)}</button>` : `<button data-x="paga" data-v="${tipo}" data-id="${id}" ${presto ? 'disabled' : ''}>Paga € ${fmt(c)}</button>`;
    return `<div class="lb-r ${ko ? 'ko' : warn ? 'warn' : 'ok'}"><div>${DOC_NOMI[tipo]}<small>${stato}${!ko && !presto ? '' : ''}${cur && ko ? ' · ai controlli: multa € ' + fmt(DOC.multa[tipo]) : ''}</small></div>${btn}</div>`;
  };
  function render() {
    const g = G(); if (!g || !g.s || !g.s.vg) return '';
    const ids = (g.s.vg.garage || []).slice().sort((a, b) => (b === g.car) - (a === g.car)), sc = g.docScaduti();
    return `<div class="view app"><div class="nav"><h3>Libretto</h3></div><div class="body">
      <div class="lb-hd"><b>${sc.length ? 'Non sei in regola' : 'In regola'}</b>Assicurazione e bollo si pagano da qui; la revisione si fa da Mario. Ai posti di controllo in prima corsia la polizia a volte ti ferma.<br>Con l'assicurazione in regola carrozzeria e soccorso costano al massimo € ${fmt(DOC.franchigia)} (franchigia); ogni danno coperto è un sinistro e alza il premio.${g.docSinistri() ? ` Sinistri attivi: <b>${g.docSinistri()}</b> (premio +${Math.round(Math.min(DOC.malusMax, DOC.malus * g.docSinistri()) * 100)} %).` : ''}</div>
      ${ids.map((id) => `<div class="lb-car"><b>${esc((CARS[id] || {}).name || id)}${id === g.car ? ' · la guidi ora' : ''}</b>${['ass', 'bollo', 'rev'].map((t) => riga(g, id, t)).join('')}</div>`).join('')}
    </div></div>`;
  }
  const add = () => {
    if (!window.telefono || !window.telefono.addApp) return false;
    window.telefono.addApp({ id: 'lib', name: 'Libretto', color: 'linear-gradient(145deg,#b8e86a,#3a7a12)', css: CSS,
      icon: '<path d="M6 3h10l3 3v15H6z"/><path d="M9 9h7M9 13h7M9 17h4"/>',
      badge: () => { const g = G(); return g && g.s && g.s.vg && g.s.vg.inherited ? g.docScaduti().length : 0; },
      render, click: (D) => { const g = G(); if (D.x === 'paga' && g) { const r = g.docPaga(D.v, D.id); if (!r.ok && r.why && window.telefono.toast) window.telefono.toast('Libretto', r.why); if (window.nightRun.save) window.nightRun.save(); window.telefono.render(); } } });
    if (window.telefono.install) window.telefono.install('lib');
    return true;
  };
  if (!add()) addEventListener('load', add);
  // da Mario: la revisione nel pannello (dopo gli altri pezzi, ridisegnata da sola)
  window.NightDocs = {
    panel(body, I, ctx) {
      if (!I || I.id !== 'niko') return;
      const box = document.createElement('div'); box.className = 'vg-group'; body.appendChild(box);
      const draw = () => {
        const g = G(); if (!g) return; const d = g.docs(), k = (g.s.dist || 0) / 1000, left = d.rev - k, c = g.docCosto('rev');
        box.innerHTML = `<h4>Revisione</h4><p class="hint">${left > 0 ? `In regola ancora per ${fmt(left)} km.` : 'Scaduta: ai controlli sono € ' + fmt(DOC.multa.rev) + ' di multa.'} Mario te la fa al banco: freni, luci, emissioni.</p>`;
        const b = document.createElement('button'); b.type = 'button'; b.className = 'kbtn'; b.textContent = `Fai la revisione · € ${fmt(c)}`;
        if (left > DOC.durata.rev * 0.5) b.disabled = true;
        b.addEventListener('click', () => { const r = g.docPaga('rev'); if (!r.ok && r.why && ctx.flash) ctx.flash(r.why, 2); if (ctx.save) ctx.save(); draw(); });
        box.appendChild(b);
      };
      draw();
    },
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { DOC, DOC_NOMI });
