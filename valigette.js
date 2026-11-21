// ============================================================================
//  Night Run · Le valigette (dopo telefono.js)
//  Valigette da aprire con dentro premi di sei rarità: comune, non comune, raro, epico, mitico, leggendario.
//  - Si comprano nell'app Valigette del telefono (bronzo, argento, oro: cambiano le probabilità, non i premi) e si
//    guadagnano coi lavori (catena di missioni, primo lavoro, consegne).
//  - Premi: soldi, oggetti, ticket (tagliando gratis da Nico, modifica gratuita da Luca), potenziamenti del motore
//    a tempo (finiscono dopo un tot di km) fino all'epico e permanenti dal mitico, pezzi veri del catalogo (mai il turbo),
//    e nel leggendario un'auto in regalo.
//  - Solo soldi del gioco. Garanzia: almeno un raro ogni 10 valigette, almeno un epico ogni 40. Doppioni → soldi.
//  - L'apertura è una scena a tutto schermo (canvas + suoni sintetizzati): caduta, attesa con la luce che sale di
//    rarità, serrature, esplosione di luce, il premio che sale fuori.
//  Stato in game.s.cases. Probabilità e premi in CASE_TYPES e CASE_PRIZES (facili da cambiare).
// ============================================================================
const CASE_RAR = [
  { id: 'comune', name: 'Comune', col: '#c9ced6', rgb: '201,206,214' },
  { id: 'noncomune', name: 'Non comune', col: '#4ade80', rgb: '74,222,128' },
  { id: 'raro', name: 'Raro', col: '#3b9bff', rgb: '59,155,255' },
  { id: 'epico', name: 'Epico', col: '#b45cff', rgb: '180,92,255' },
  { id: 'mitico', name: 'Mitico', col: '#ff3b4a', rgb: '255,59,74' },
  { id: 'leggendario', name: 'Leggendario', col: '#ffc63a', rgb: '255,198,58' },
];
// probabilità in percento per rarità (comune → leggendario)
const CASE_TYPES = {
  bronzo: { name: 'Valigetta di bronzo', short: 'Bronzo', price: 1500, odds: [62, 27, 8.5, 2, 0.45, 0.05], note: 'Quasi sempre comuni e non comuni. Ogni tanto una sorpresa.' },
  argento: { name: 'Valigetta d\'argento', short: 'Argento', price: 6000, odds: [35, 35, 20, 7.5, 2, 0.5], note: 'Più rari ed epici. Il mitico comincia a farsi vedere.' },
  oro: { name: 'Valigetta d\'oro', short: 'Oro', price: 18000, odds: [0, 30, 38, 20, 9, 3], note: 'Mai un comune. L\'unica con una possibilità vera di leggendario.' },
};
const CASE_PITY = { raro: 10, epico: 40 };            // garanzia: entro tante aperture almeno un raro / un epico
const CASE_MOD_MAX = 5000;
let CASE_GIVE = null;                                 // i premi, riusati dalla ruota giornaliera                            // valore massimo del pezzo che si prende col ticket modifica

(function valigetteLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const kmNow = (g) => (g.s.dist || 0) / 1000;
  P.cases = function () {
    const s = this.s;
    return s.cases || (s.cases = { own: [], pity: { r: 0, e: 0 }, tickets: { svc: 0, mod: 0 }, boosts: [], perm: {}, seen: {}, opened: 0, log: [] });
  };
  P.caseGrant = function (type, why) {
    const C = this.cases(); C.own.push({ type, why: why || '' });
    this.say(`${CASE_TYPES[type].name} guadagnata${why ? ' (' + why + ')' : ''}: aprila dal telefono, app Valigette`, 'money');
    if (typeof window !== 'undefined' && window.valigette) window.valigette.notify(type, why);
  };
  P.caseBuy = function (type) {
    const T = CASE_TYPES[type]; if (!T) return { ok: false };
    if (this.s.money < T.price) return { ok: false, why: `Servono € ${fmt(T.price)}, ne hai ${fmt(Math.floor(this.s.money))}` };
    this.s.money -= T.price; this.cases().own.push({ type, why: 'comprata' });
    return { ok: true };
  };

  // ---------------------------------------------------------------- premi (g = partita). give() ritorna i dati del
  // premio da mostrare, o null se non si può dare (allora si passa ai soldi della stessa rarità)
  const money = (a, b) => (g, r) => { const v = Math.round((a + r * (b - a)) / 50) * 50; g.s.money += v; return { icon: 'soldi', name: `€ ${fmt(v)}`, text: 'Contanti, piegati in una busta.', v }; };
  const item = (kind, text) => (g) => { if (!g.addItem(kind)) return null; return { icon: kind, name: INV[kind].name, text: text || INV[kind].note }; };
  const boost = (pw, km, name) => (g) => {
    const C = g.cases(); C.boosts.push({ pw, until: kmNow(g) + km, car: g.car, name });
    return { icon: 'centralina', name, text: `+${Math.round(pw * 100)} % di potenza sulla ${CARS[g.car].short || CARS[g.car].name} per ${km} km. Poi la centralina torna come prima.` };
  };
  // pezzo vero del catalogo dell'auto in uso: dato, sbloccato anche senza i km (si monta da Luca senza pagarlo)
  const part = (pick) => (g) => {
    if (typeof TUNING === 'undefined' || g.mode !== 'career') return null;
    const cand = [];
    for (const cat in TUNING) if (cat !== 'turbo') for (const it of TUNING[cat].items || []) if (it.price > 0 && !g.owns(cat, it.id)) cand.push({ cat, it });
    const list = pick(cand); if (!list.length) return null;
    const c = list[Math.floor(Math.random() * list.length)];
    g.s.owned[g.ownKey(c.cat + ':' + c.it.id)] = true;
    return { icon: c.cat === 'turbo' ? 'turbo' : 'pezzo', name: `${c.it.brand} ${c.it.name}`, text: `${TUNING[c.cat].label}: è tuo e sbloccato. Luca te lo monta senza farti pagare (vale € ${fmt(c.it.price)}).` };
  };
  const midParts = (cand) => { const s = cand.filter((c) => c.it.price <= 4000); return s.length ? s : cand; };
  const topPart = (cand) => cand.sort((a, b) => b.it.price - a.it.price).slice(0, 1);
  const ticket = (k) => (g) => {
    g.cases().tickets[k]++;
    return k === 'svc'
      ? { icon: 'ticket_svc', name: 'Ticket tagliando gratis', text: 'Da Nico: un servizio a scelta (olio, candele, pastiglie, lavaggio) senza pagare.' }
      : { icon: 'ticket_mod', name: 'Ticket modifica gratuita', text: `Da Luca: un pezzo fino a € ${fmt(CASE_MOD_MAX)} senza pagare. Si usa da solo al prossimo acquisto.` };
  };
  const car = (g) => {
    const v = g.s.vg; if (!v || typeof VG_SHOP === 'undefined') return null;
    const cand = VG_SHOP.filter((q) => q.car && !v.garage.includes(q.id) && CARS[q.id]);
    if (!cand.length) return null;
    const c = cand[Math.floor(Math.random() * cand.length)];
    v.garage.push(c.id); v.owned[c.id] = true; g.carState(c.id);
    return { icon: 'auto', car: c.id, name: CARS[c.id].name, text: 'Le chiavi erano sotto l\'imbottitura. Ti aspetta nel parcheggio del Motel 4Ever.' };
  };
  const perm = (g) => {
    const C = g.cases(); C.perm[g.car] = Math.round(((C.perm[g.car] || 0) + 0.03) * 1000) / 1000;
    return { icon: 'motore', name: 'Testata lavorata a mano', text: `+3 % di potenza per sempre sulla ${CARS[g.car].short || CARS[g.car].name} (in tutto +${Math.round(C.perm[g.car] * 100)} %).` };
  };
  const oil = (g) => { const m = g.maint(); m.oil = 1; m.plugs = Math.min(1, m.plugs + 0.3); return { icon: 'olio', name: 'Olio sintetico e candele', text: 'Cambiati sul posto: il motore gira come nuovo.' }; };
  const tyres = (g) => { g.sim.tireWear = 0; return { icon: 'gomme', name: 'Treno di gomme nuove', text: 'Montate da un gommista che passava di lì. Aderenza piena.' }; };
  // rarità → premi pesati (w)
  const CASE_PRIZES = [
    [{ w: 3, give: money(300, 800) }, { w: 1, give: item('tanica') }, { w: 1, give: item('bomboletta') }, { w: 1, give: oil }],
    [{ w: 3, give: money(1500, 3000) }, { w: 2, give: ticket('svc') }, { w: 1, give: tyres }],
    [{ w: 2, give: ticket('mod') }, { w: 2, give: boost(0.08, 50, 'Centralina mappata') }, { w: 1, give: money(4500, 5500) }],
    [{ w: 2, give: part(midParts) }, { w: 2, give: boost(0.15, 100, 'Mappa da pista') }],
    [{ w: 1, give: part(topPart) }, { w: 1, give: money(25000, 25000) }, { w: 1, give: perm }],
    [{ w: 1, give: car }],
  ];
  const FALLBACK = [money(500, 900), money(2000, 3000), money(5000, 6000), money(9000, 11000), money(25000, 25000), money(60000, 60000)];
  if (typeof window !== 'undefined') window.CASE_PRIZES = CASE_PRIZES;
  CASE_GIVE = { money, item, boost, ticket, car, perm, oil, tyres, FALLBACK };   // anche per la ruota (ruota.js)

  // apre una valigetta (la toglie da quelle possedute) e dà subito il premio: anche se si chiude il gioco durante la
  // scena, il premio resta. rnd: generatore (per i test), di solito Math.random
  P.caseOpen = function (i, rnd = Math.random) {
    const C = this.cases(), it = C.own[i]; if (!it) return null;
    C.own.splice(i, 1);
    const odds = CASE_TYPES[it.type].odds, tot = odds.reduce((a, b) => a + b, 0);
    let x = rnd() * tot, ri = 0; for (; ri < odds.length - 1; ri++) { x -= odds[ri]; if (x < 0) break; }
    C.pity.r++; C.pity.e++;
    if (C.pity.e >= CASE_PITY.epico && ri < 3) ri = 3; else if (C.pity.r >= CASE_PITY.raro && ri < 2) ri = 2;
    if (ri >= 2) C.pity.r = 0; if (ri >= 3) C.pity.e = 0;
    const list = CASE_PRIZES[ri], wt = list.reduce((a, p) => a + p.w, 0);
    let y = rnd() * wt, pz = list[0]; for (const p of list) { y -= p.w; if (y < 0) { pz = p; break; } }
    let prize = pz.give(this, rnd());
    if (!prize) prize = Object.assign(FALLBACK[ri](this, rnd()), { text: 'Quello che c\'era dentro ce l\'hai già: Luca te lo ricompra in contanti.' });
    C.opened++; C.log.unshift({ type: it.type, rar: ri, name: prize.name }); C.log.length = Math.min(C.log.length, 30);
    return Object.assign({ type: it.type, rar: ri, why: it.why }, prize);
  };

  // potenziamenti attivi: a tempo (scadono coi km) per l'auto in uso, più quelli per sempre
  P.caseBoosts = function () {
    const C = this.cases(), k = kmNow(this);
    const ended = C.boosts.filter((b) => b.until <= k);
    if (ended.length) { C.boosts = C.boosts.filter((b) => b.until > k); for (const b of ended) this.say(`${b.name}: finita, la centralina torna di serie`, 'info'); }
    const temp = C.boosts.filter((b) => b.car === this.car).reduce((a, b) => a + b.pw, 0);
    return (1 + temp) * (1 + (C.perm[this.car] || 0));
  };

  // ticket: il tagliando di Nico e la modifica di Luca diventano gratis finché ce n'è uno
  const sc = P.serviceCost, sv = P.service, pr = P.price, by = P.buy;
  P.serviceCost = function (id) { const c = sc.call(this, id); return c > 0 && this.s && this.cases().tickets.svc > 0 ? 0 : c; };
  P.service = function (id) {
    const C = this.cases(), had = C.tickets.svc > 0 && sc.call(this, id) > 0;
    const r = sv.call(this, id); if (r.ok && had) { C.tickets.svc--; this.say('Ticket tagliando usato: Nico non ti chiede niente', 'buy'); }
    return r;
  };
  const modFree = (g, cat, id) => { const p = pr.call(g, cat, id); return p > 0 && p <= CASE_MOD_MAX && g.s && g.cases().tickets.mod > 0; };
  P.price = function (cat, id) { return modFree(this, cat, id) ? 0 : pr.call(this, cat, id); };
  P.buy = function (cat, id) {
    const had = modFree(this, cat, id), r = by.call(this, cat, id);
    if (r.ok && had) { this.cases().tickets.mod--; this.say('Ticket modifica usato: questo pezzo te lo regala Luca', 'buy'); }
    return r;
  };

  // ricompense: si guardano i contatori che il gioco tiene già (missioni, lavori)
  P.caseRewards = function () {
    const v = this.s.vg; if (!v || !v.on) return;
    const C = this.cases(), S = C.seen;
    if (S.mis === undefined) Object.assign(S, { mis: v.misDone || 0, first: !!v.firstDone, jobs: v.jobs || 0 });   // da qui in avanti, niente arretrati
    if (v.firstDone && !S.first) { S.first = true; this.caseGrant('bronzo', 'il primo lavoro'); }
    while ((v.misDone || 0) > S.mis) { S.mis++; this.caseGrant(S.mis % 3 === 0 ? 'oro' : 'argento', `lavoro ${S.mis} della catena`); }
    while ((v.jobs || 0) > S.jobs) { S.jobs++; if ((S.jobs * 7919 % 100) < 22) this.caseGrant('bronzo', 'una consegna'); }
  };
})();

// ============================================================================
//  App del telefono e scena d'apertura (solo nel browser)
// ============================================================================
(function valigetteSchermo() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const NR = () => window.nightRun, G = () => NR() && NR().game;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------- la valigetta in pixel art (120×110)
  // open: 0 chiusa → 1 coperchio ribaltato all'indietro · latch: serrature aperte (0, 1, 2) · leak: luce dalla fessura
  const SKIN = {
    bronzo: { body: '#6b3f1f', hi: '#8f5a2e', lo: '#4a2a12', stitch: '#c58a52', metal: '#c98a3a', mhi: '#ffd08a', mlo: '#7a4a1a', handle: '#3a200e', lining: '#5a1420' },
    argento: { body: '#9aa3b2', hi: '#dfe4ec', lo: '#6b7382', stitch: '#7d8696', metal: '#e8ecf2', mhi: '#ffffff', mlo: '#8a929e', handle: '#1a1c22', lining: '#14223a', ribs: 1 },
    oro: { body: '#17171d', hi: '#2c2c36', lo: '#0a0a0e', stitch: '#d4a830', metal: '#f0c040', mhi: '#fff2a8', mlo: '#9a7414', handle: '#0e0e12', lining: '#2a0a12', gold: 1 },
  };
  function drawCase(x, type, o = {}) {
    const K = SKIN[type] || SKIN.bronzo, ink = '#07070a';
    const px = (c, a, b, w = 1, h = 1) => { x.fillStyle = c; x.fillRect(a, b, w, h); };
    const open = o.open || 0, L = o.latch || 0;
    const X0 = 12, X1 = 108, HY = 34, SEAM = 52, BOT = 96;          // bordi, cerniera (alto del coperchio), fessura, fondo
    // ombra a terra
    x.fillStyle = 'rgba(0,0,0,.45)'; x.beginPath(); x.ellipse(60, BOT + 5, 52, 5, 0, 0, Math.PI * 2); x.fill();
    // ---- corpo (base)
    px(ink, X0 - 1, SEAM - 1, X1 - X0 + 2, BOT - SEAM + 2);
    px(K.body, X0, SEAM, X1 - X0, BOT - SEAM);
    px(K.hi, X0, SEAM, X1 - X0, 2); px(K.lo, X0, BOT - 3, X1 - X0, 3);
    if (K.ribs) for (let y = SEAM + 6; y < BOT - 4; y += 4) { px(K.lo, X0 + 2, y, X1 - X0 - 4, 1); px(K.hi, X0 + 2, y + 1, X1 - X0 - 4, 1); }
    else for (let xx = X0 + 4; xx < X1 - 4; xx += 3) { px(K.stitch, xx, BOT - 6, 2, 1); }   // cucitura
    if (K.gold) { px(K.stitch, X0 + 3, SEAM + 4, X1 - X0 - 6, 1); px(K.stitch, X0 + 3, BOT - 5, X1 - X0 - 6, 1); }
    // angoli in metallo
    const corner = (cx, cy, fx, fy) => { px(ink, cx - 1, cy - 1, 9, 9); px(K.metal, cx, cy, 7, 7); px(K.mhi, cx + (fx ? 4 : 1), cy + (fy ? 4 : 1), 2, 2); px(K.mlo, cx + (fx ? 0 : 5), cy + (fy ? 0 : 5), 2, 2); };
    corner(X0 - 2, BOT - 6, 0, 1); corner(X1 - 5, BOT - 6, 1, 1);
    // ---- interno (si vede quando il coperchio è su): imbottitura scura, nicchia illuminata
    if (open > 0.02) {
      const ih = Math.round((SEAM - HY) * Math.min(1, open * 1.4));
      px(ink, X0 - 1, SEAM - ih - 1, X1 - X0 + 2, ih + 1);
      px('#141018', X0, SEAM - ih, X1 - X0, ih);
      for (let xx = X0 + 2; xx < X1 - 2; xx += 4) px('#1e1824', xx, SEAM - ih + 1, 2, ih - 2);
      if (o.glow) { x.fillStyle = `rgba(${o.glow},${0.6 * open})`; x.fillRect(X0 + 30, SEAM - ih + 2, 36, Math.max(1, ih - 3)); }
    }
    // ---- coperchio: la faccia esterna si schiaccia verso la cerniera, sopra cresce la fodera interna
    const th = open * 1.85, fh = Math.round((SEAM - HY) * Math.max(0, Math.cos(th))), lin = Math.round(34 * Math.max(0, Math.sin(Math.min(th, 1.6))));
    if (lin > 0) {
      const ly = HY - lin;
      px(ink, X0 - 1, ly - 1, X1 - X0 + 2, lin + 1);
      px(K.metal, X0, ly, X1 - X0, lin); px(K.lining, X0 + 2, ly + 2, X1 - X0 - 4, lin - 3);   // bordino di metallo e velluto
      // velluto trapuntato a rombi: bottoncini e pieghe in luce e in ombra
      const sh = (a) => `rgba(0,0,0,${a})`, hl = (a) => `rgba(255,255,255,${a})`;
      for (let yy = ly + 5, r = 0; yy < HY - 3; yy += 8, r++) for (let xx = X0 + 6 + (r % 2) * 7; xx < X1 - 5; xx += 14) {
        px(sh(0.35), xx - 3, yy + 1, 7, 1); px(hl(0.08), xx - 4, yy - 2, 8, 1); px(sh(0.5), xx, yy, 1, 1); px(K.metal, xx, yy - 1, 1, 1);
      }
      if (o.glow) { const g = x.createLinearGradient(0, HY, 0, ly); g.addColorStop(0, `rgba(${o.glow},${0.32 * open})`); g.addColorStop(1, `rgba(${o.glow},0)`); x.fillStyle = g; x.fillRect(X0 + 2, ly + 2, X1 - X0 - 4, lin - 3); }
    }
    if (fh > 0) {
      const top = HY, bot = top + fh;
      px(ink, X0 - 1, top - 1, X1 - X0 + 2, fh + 2);
      px(K.body, X0, top, X1 - X0, fh);
      px(K.hi, X0, top, X1 - X0, Math.min(2, fh)); if (fh > 4) px(K.lo, X0, bot - 2, X1 - X0, 2);
      if (K.ribs) for (let y = top + 4; y < bot - 3; y += 4) { px(K.lo, X0 + 2, y, X1 - X0 - 4, 1); px(K.hi, X0 + 2, y + 1, X1 - X0 - 4, 1); }
      if (K.gold && fh > 8) {                                       // stemma a rombo
        const cx = 60, cy = top + fh / 2; for (let k = 0; k < 5; k++) px(K.metal, cx - k, cy - 4 + k, 1 + k * 2, 1); for (let k = 0; k < 4; k++) px(K.metal, cx - 3 + k, cy + 1 + k, 7 - k * 2, 1);
        px(K.mhi, cx - 1, cy - 2, 2, 2);
      }
      if (fh > 6) { corner(X0 - 2, top - 2, 0, 0); corner(X1 - 5, top - 2, 1, 0); }
    }
    // maniglia (sul coperchio chiuso; aperto resta dietro, si vede poco)
    if (open < 0.5) {
      const hy = HY - 8 + Math.round(open * 6);
      px(ink, 44, hy - 1, 32, 10); px(K.handle, 45, hy, 30, 3); px(K.handle, 45, hy, 4, 9); px(K.handle, 71, hy, 4, 9);
      px('rgba(255,255,255,.18)', 46, hy, 28, 1); px(K.metal, 43, hy + 6, 8, 3); px(K.metal, 69, hy + 6, 8, 3);
    }
    // luce dalla fessura (prima di aprire)
    if (o.leak && open < 0.05) {
      const a = Math.min(1, o.leak);
      x.fillStyle = `rgba(${o.glow || '255,255,255'},${a})`; x.fillRect(X0 + 2, SEAM - 1, X1 - X0 - 4, 2);
      x.fillStyle = `rgba(255,255,255,${a * 0.8})`; x.fillRect(X0 + 20, SEAM - 1, X1 - X0 - 40, 1);
    }
    // serrature: chiuse sulla fessura, aperte ribaltate in su
    for (const [k, lx] of [[0, 30], [1, 82]]) {
      if (open > 0.3) continue;
      const up = L > k;
      if (!up) { px(ink, lx - 1, SEAM - 5, 10, 11); px(K.metal, lx, SEAM - 4, 8, 9); px(K.mhi, lx + 1, SEAM - 4, 6, 1); px(K.mlo, lx, SEAM + 3, 8, 2); px(ink, lx + 3, SEAM, 2, 2); }
      else { px(ink, lx - 1, SEAM - 13, 10, 10); px(K.metal, lx, SEAM - 12, 8, 8); px(K.mhi, lx + 1, SEAM - 12, 6, 1); px(K.mlo, lx, SEAM - 6, 8, 2); px(ink, lx + 1, SEAM - 2, 6, 3); px(K.mlo, lx + 2, SEAM - 2, 4, 2); }
    }
  }
  const thumbCache = {};
  const thumb = (type) => {
    if (thumbCache[type]) return thumbCache[type];
    const c = document.createElement('canvas'); c.width = 120; c.height = 110; drawCase(c.getContext('2d'), type);
    return (thumbCache[type] = c.toDataURL());
  };

  // ---------------------------------------------------------------- icone dei premi (32×32, pixel art)
  function drawPrize(x, key, rar) {
    const px = (c, a, b, w = 1, h = 1) => { x.fillStyle = c; x.fillRect(a, b, w, h); }, ink = '#07070a', col = CASE_RAR[rar].col;
    if (key === 'soldi') {
      for (let k = 0; k < 3; k++) { const y = 18 - k * 5; px(ink, 3, y - 1, 26, 11); px('#2f8a4a', 4, y, 24, 9); px('#4fbf6a', 4, y, 24, 1); px('#1f5a32', 4, y + 8, 24, 1); px('#bfe8c8', 14, y + 2, 4, 5); px('#1f5a32', 15, y + 3, 2, 3); }
      px(ink, 12, 4, 8, 26); px('#c4a050', 13, 5, 6, 24);   // fascetta
    } else if (key === 'ticket_svc' || key === 'ticket_mod') {
      px(ink, 2, 7, 28, 19); px('#f4ecd8', 3, 8, 26, 17); px(col, 3, 8, 26, 4); for (let y = 9; y < 24; y += 3) px('#c8bca0', 21, y, 1, 2);
      px('#2a2a30', 6, 15, 11, 1); px('#2a2a30', 6, 18, 9, 1); px('#2a2a30', 6, 21, 12, 1);
      if (key === 'ticket_svc') { px('#2a2a30', 23, 14, 4, 6); px('#e8b020', 24, 15, 2, 4); } else { px('#2a2a30', 23, 13, 5, 2); px('#2a2a30', 24, 15, 2, 7); }
      px('#0c0d12', 2, 15, 2, 3); px('#0c0d12', 28, 15, 2, 3);
    } else if (key === 'centralina') {
      px(ink, 4, 8, 24, 18); px('#2a3a4a', 5, 9, 22, 16); px('#3e5266', 5, 9, 22, 2);
      for (let k = 0; k < 6; k++) { px('#c8ccd4', 6 + k * 3, 26, 1, 3); px('#c8ccd4', 6 + k * 3, 5, 1, 3); }
      px('#ffd23f', 15, 11, 4, 5); px('#ffd23f', 12, 15, 6, 2); px('#ffd23f', 13, 17, 4, 5); px('#fff3a0', 16, 12, 2, 2);
    } else if (key === 'pezzo' || key === 'motore') {
      x.strokeStyle = ink; x.lineWidth = 3; x.beginPath(); x.arc(16, 16, 9, 0, Math.PI * 2); x.stroke();
      x.strokeStyle = '#9aa3b2'; x.lineWidth = 2; x.beginPath(); x.arc(16, 16, 9, 0, Math.PI * 2); x.stroke();
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; px('#9aa3b2', Math.round(16 + Math.cos(a) * 12) - 2, Math.round(16 + Math.sin(a) * 12) - 2, 4, 4); }
      px('#e8ecf2', 14, 14, 4, 4); if (key === 'motore') { px(col, 12, 12, 8, 8); px('#fff', 14, 13, 2, 2); }
    } else if (key === 'turbo') {
      x.fillStyle = ink; x.beginPath(); x.arc(15, 17, 12, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#b8bec8'; x.beginPath(); x.arc(15, 17, 10.5, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#7a8290'; x.beginPath(); x.arc(15, 17, 6, 0, Math.PI * 2); x.fill();
      for (let k = 0; k < 7; k++) { const a = k * Math.PI * 2 / 7; x.strokeStyle = '#e8ecf2'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(15, 17); x.lineTo(15 + Math.cos(a) * 6 + Math.cos(a + 1) * 2, 17 + Math.sin(a) * 6 + Math.sin(a + 1) * 2); x.stroke(); }
      px(ink, 22, 3, 9, 9); px('#b8bec8', 23, 4, 7, 7); px('#5a6270', 25, 6, 3, 3);
    } else if (key === 'olio') {
      px(ink, 7, 7, 18, 23); px('#e8b020', 8, 8, 16, 21); px('#fff0a0', 9, 9, 2, 18); px('#2a2a30', 10, 15, 12, 7); px('#e8b020', 12, 17, 8, 3);
      px(ink, 13, 2, 8, 6); px('#2a2a30', 14, 3, 6, 4);
    } else if (key === 'gomme') {
      for (const [cx, cy] of [[11, 18], [21, 14]]) { x.fillStyle = ink; x.beginPath(); x.arc(cx, cy, 10, 0, Math.PI * 2); x.fill(); x.fillStyle = '#2c2f3a'; x.beginPath(); x.arc(cx, cy, 8.5, 0, Math.PI * 2); x.fill(); x.fillStyle = '#9aa3b2'; x.beginPath(); x.arc(cx, cy, 4.5, 0, Math.PI * 2); x.fill(); }
    } else if (typeof window.NR_ICON === 'function') {
      try { const ic = window.NR_ICON(key); if (ic) x.drawImage(ic, 0, 0, 32, 32); } catch (e) { /* icona mancante */ }
    }
  }

  // ---------------------------------------------------------------- suoni (sintetizzati al momento)
  let AC = null;
  const ac = () => { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state !== 'running') AC.resume(); } catch (e) { AC = null; } return AC; };
  const noiseBuf = () => { const a = ac(); if (!a) return null; if (noiseBuf.b) return noiseBuf.b; const b = a.createBuffer(1, a.sampleRate, a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return (noiseBuf.b = b); };
  const SND = {
    out(gain) { const a = ac(); if (!a) return null; const g = a.createGain(); g.gain.value = gain; g.connect(a.destination); return g; },
    tone(f, t0, dur, type, gain, f1, q) {
      const a = ac(); if (!a) return; const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + t0;
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      let n = o; if (q) { const f2 = a.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = q; o.connect(f2); n = f2; }
      n.connect(g); g.connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
    },
    noise(t0, dur, gain, type, f, f1, qv) {
      const a = ac(), b = noiseBuf(); if (!a || !b) return; const s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(), t = a.currentTime + t0;
      s.buffer = b; s.loop = true; fl.type = type || 'bandpass'; fl.frequency.setValueAtTime(f || 1000, t); if (f1) fl.frequency.exponentialRampToValueAtTime(f1, t + dur); fl.Q.value = qv || 1;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.03, dur / 3)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(fl); fl.connect(g); g.connect(a.destination); s.start(t); s.stop(t + dur + 0.05);
    },
    thud() { this.tone(90, 0, 0.35, 'sine', 0.55, 38); this.noise(0, 0.18, 0.25, 'lowpass', 600, 120); },
    rattle(k) { this.noise(0, 0.05, 0.08 + 0.03 * k, 'bandpass', 2200 + 300 * k, 1500, 3); this.tone(140 + 20 * k, 0, 0.06, 'square', 0.03, 90, 900); },
    step(lv) { const base = [523, 587, 659, 784, 880, 1047][lv]; this.tone(base, 0, 0.6, 'sine', 0.22); this.tone(base * 2, 0.02, 0.5, 'sine', 0.08); this.tone(base * 1.5, 0.05, 0.4, 'triangle', 0.06); this.noise(0, 0.25, 0.06, 'highpass', 6000); },
    latch() { this.noise(0, 0.04, 0.35, 'highpass', 3000); this.tone(2600, 0, 0.08, 'square', 0.05, 1800, 5000); this.tone(320, 0.01, 0.06, 'sine', 0.2, 180); },
    burst(lv) {
      this.noise(0, 0.9 + lv * 0.15, 0.35, 'bandpass', 300, 5000, 0.7);                 // fiammata d'aria
      this.tone(60, 0, 0.8, 'sine', 0.5, 30);                                             // colpo nel petto
      const ch = [[523, 659, 784], [587, 740, 880], [659, 831, 988], [698, 880, 1047], [784, 988, 1175], [880, 1109, 1319]][lv];
      ch.forEach((f, i) => { this.tone(f, 0.08 + i * 0.07, 1.2 + lv * 0.35, 'sawtooth', 0.05 + lv * 0.008, null, 2200 + lv * 500); this.tone(f * 2, 0.1 + i * 0.07, 1 + lv * 0.3, 'sine', 0.05); });
      if (lv >= 3) for (let k = 0; k < 8 + lv * 3; k++) this.tone(1500 + Math.random() * 2500, 0.3 + k * 0.06, 0.25, 'sine', 0.05);   // brillantini
      if (lv >= 5) { for (const f of [220, 277, 330, 440, 554, 659]) this.tone(f, 0.15, 3.2, 'sawtooth', 0.03, null, 1400); this.tone(1760, 0.5, 2.5, 'sine', 0.05); }   // coro d'oro
    },
    coins() { for (let k = 0; k < 7; k++) this.tone(2200 + Math.random() * 1600, 0.2 + k * 0.08, 0.18, 'square', 0.025, null, 6000); },
    whoosh() { this.noise(0, 0.35, 0.18, 'bandpass', 2500, 400, 1.2); },
  };

  // ---------------------------------------------------------------- l'auto col disegno del giocatore e le ruote (pronta in done)
  function carPic(id, done) {
    const sp = CARS[id] && CARS[id].sprite, body = new Image(), wheel = new Image(), cc = document.createElement('canvas');
    const geo = sp || (id === 'v40' ? { ax: [], wy: 56, wr: 14.4 } : { ax: [48, 158], wy: 42, wr: 15 });
    const build = () => {
      if (!body.complete || !body.naturalWidth || (sp && (!wheel.complete || !wheel.naturalWidth))) return;
      cc.width = body.naturalWidth; cc.height = Math.max(body.naturalHeight, Math.ceil(geo.wy + geo.wr + 1)); const q = cc.getContext('2d'); q.imageSmoothingEnabled = false;
      if (!sp && id !== 'v40') for (const ax of geo.ax) { q.fillStyle = '#0b0c10'; q.beginPath(); q.arc(ax, geo.wy, geo.wr, 0, Math.PI * 2); q.fill(); q.fillStyle = '#9aa3b2'; q.beginPath(); q.arc(ax, geo.wy, geo.wr * 0.55, 0, Math.PI * 2); q.fill(); }
      q.drawImage(body, 0, 0);
      if (sp) for (const ax of geo.ax) q.drawImage(wheel, Math.round(ax - wheel.naturalWidth / 2), Math.round(geo.wy - wheel.naturalHeight / 2));
      done(cc);
    };
    body.onload = wheel.onload = build;
    body.src = sp ? sp.img : id === 'v40' ? 'img/v40.png' : (typeof SUPRA2D_BODY !== 'undefined' ? SUPRA2D_BODY : '');
    if (sp) wheel.src = sp.wheel;
  }

  // ---------------------------------------------------------------- scena d'apertura a tutto schermo
  function play(prize, onDone) {
    const ri = prize.rar, R = CASE_RAR[ri], type = prize.type;
    const ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;z-index:90;cursor:pointer;touch-action:manipulation';
    const cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'; ov.appendChild(cv);
    document.body.appendChild(ov);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0; const fit = () => { W = innerWidth; H = innerHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); };
    fit(); addEventListener('resize', fit);
    const x = cv.getContext('2d');
    const off = document.createElement('canvas'); off.width = 120; off.height = 110; const ox = off.getContext('2d');
    const icn = document.createElement('canvas'); icn.width = 32; icn.height = 32; drawPrize(icn.getContext('2d'), prize.icon, ri);
    // l'auto regalata: il disegno del giocatore con le ruote (nei disegni del pacchetto sono a parte)
    let carImg = null;
    if (prize.car) carPic(prize.car, (c) => { carImg = c; });
    const ban = document.createElement('canvas'), bx = ban.getContext('2d');   // la scritta della rarità, col riflesso solo sulle lettere
    // tempi: caduta, attesa con un gradino di luce per ogni livello di rarità, serrature, esplosione, premio
    const T_LAND = 0.85, STEP = 0.55, T_SUS = 1.05, T_STEPS = Array.from({ length: ri }, (_, k) => T_SUS + 0.35 + k * STEP);
    const T_L1 = T_SUS + 0.6 + ri * STEP, T_L2 = T_L1 + 0.28, T_BURST = T_L2 + 0.42, T_READY = T_BURST + 1.6;
    let t = 0, last = performance.now(), lvl = 0, done = false, closing = 0, played = {};
    const parts = [], rings = [];
    const once = (k, fn) => { if (!played[k]) { played[k] = 1; fn(); } };
    const rgbOf = (k) => CASE_RAR[k].rgb;
    const spark = (n, cx, cy, sp, cols, kind) => { for (let k = 0; k < n; k++) { const a = Math.random() * Math.PI * 2, v = sp * (0.3 + Math.random()); parts.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - sp * 0.3, life: 1, dec: 0.5 + Math.random() * 0.8, col: cols[k % cols.length], s: 2 + Math.random() * 4, kind: kind || 'spark', rot: Math.random() * 6, vr: (Math.random() - 0.5) * 12 }); } };
    const skip = () => {
      if (t < T_BURST - 0.05) { t = T_BURST - 0.05; lvl = ri; played.l1 = played.l2 = played.land = 1; for (let k = 0; k < ri; k++) played['s' + k] = 1; }
      else if (t >= T_BURST + 0.5) close();
    };
    const close = () => { if (closing) return; closing = 0.0001; SND.whoosh(); };
    ov.addEventListener('click', skip);
    const key = (e) => { if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopImmediatePropagation(); skip(); } };
    addEventListener('keydown', key, true);

    const frame = (now) => {
      if (done) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt; if (closing) closing += dt;
      const s = dpr, cx = W / 2, sc = Math.max(2, Math.min(6, Math.floor(Math.min(W / 150, H / 170)))), cw = 120 * sc, ch = 110 * sc;
      x.setTransform(s, 0, 0, s, 0, 0);
      // sfondo: buio che sale, faro dall'alto
      const fade = Math.min(1, t / 0.4) * (closing ? Math.max(0, 1 - closing / 0.45) : 1);
      x.clearRect(0, 0, W, H);
      x.fillStyle = `rgba(4,4,8,${0.88 * fade})`; x.fillRect(0, 0, W, H);
      const bt0 = t - T_BURST, down = bt0 > 0 ? 1 - Math.pow(1 - Math.min(1, bt0 / 0.7), 3) : 0;
      const cy = H * 0.56 + down * H * 0.42, itemY = H * 0.4;          // centro della valigetta; dove si ferma il premio
      if (fade <= 0.01 && closing) { finish(); return; }
      x.globalAlpha = fade;
      const spot = x.createRadialGradient(cx, cy - ch * 0.1, 10, cx, cy, Math.max(W, H) * 0.55);
      spot.addColorStop(0, `rgba(${rgbOf(lvl)},0.18)`); spot.addColorStop(0.4, 'rgba(40,40,60,.10)'); spot.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = spot; x.fillRect(0, 0, W, H);
      // cono di luce dall'alto
      x.save(); x.globalCompositeOperation = 'lighter';
      const cone = x.createLinearGradient(0, 0, 0, cy + ch * 0.4); cone.addColorStop(0, 'rgba(255,240,210,.0)'); cone.addColorStop(0.3, 'rgba(255,240,210,.05)'); cone.addColorStop(1, `rgba(${rgbOf(lvl)},.08)`);
      x.fillStyle = cone; x.beginPath(); x.moveTo(cx - 40, 0); x.lineTo(cx + 40, 0); x.lineTo(cx + cw * 0.62, cy + ch * 0.4); x.lineTo(cx - cw * 0.62, cy + ch * 0.4); x.closePath(); x.fill();
      x.restore();

      // ---- gradini di rarità durante l'attesa
      for (let k = 0; k < ri; k++) if (t >= T_STEPS[k]) once('s' + k, () => { lvl = k + 1; SND.step(lvl); rings.push({ t: 0, col: rgbOf(lvl), w: 0.6 }); spark(16 + lvl * 6, cx, cy, 260, [CASE_RAR[lvl].col, '#ffffff']); });
      if (t >= T_LAND) once('land', () => { SND.thud(); spark(18, cx, cy + ch * 0.4, 150, ['#7a7068', '#9a8f84'], 'dust'); });
      if (t >= T_L1) once('l1', () => { SND.latch(); spark(8, cx - cw * 0.25, cy, 180, ['#ffe9a8', '#ffffff']); });
      if (t >= T_L2) once('l2', () => { SND.latch(); spark(8, cx + cw * 0.18, cy, 180, ['#ffe9a8', '#ffffff']); });
      if (t >= T_BURST) once('burst', () => {
        lvl = ri; SND.burst(ri); if (prize.icon === 'soldi') SND.coins();
        rings.push({ t: 0, col: rgbOf(ri), w: 1.6 }); rings.push({ t: -0.12, col: '255,255,255', w: 0.8 });
        spark(60 + ri * 40, cx, cy - ch * 0.12, 520 + ri * 90, [R.col, '#ffffff', R.col]);
        if (prize.icon === 'soldi') spark(26, cx, cy - ch * 0.1, 420, ['#ffd23f', '#e8b020', '#fff0a0'], 'coin');
        if (ri >= 4) spark(80, cx, cy - ch * 0.2, 640, ['#ff3a6a', '#ffd23f', '#3bd8ff', '#b45cff', '#4ade80'], 'confetti');
      });
      if (ri >= 5 && t > T_BURST && Math.random() < dt * 30) parts.push({ x: Math.random() * W, y: -10, vx: (Math.random() - 0.5) * 40, vy: 160 + Math.random() * 160, life: 1, dec: 0.25, col: Math.random() < 0.5 ? '#ffd23f' : '#fff0a0', s: 3 + Math.random() * 3, kind: 'confetti', rot: Math.random() * 6, vr: (Math.random() - 0.5) * 10 });

      // ---- raggi di luce dietro (dopo l'esplosione)
      const bt = t - T_BURST, rev = Math.max(0, Math.min(1, bt / 0.25));
      if (bt > 0) {
        x.save(); x.globalCompositeOperation = 'lighter'; x.translate(cx, itemY);
        const n = 10 + ri * 2, rr = Math.max(W, H);
        x.rotate(t * (0.18 + ri * 0.04));
        for (let k = 0; k < n; k++) {
          x.rotate(Math.PI * 2 / n);
          const gr = x.createLinearGradient(0, 0, rr, 0); gr.addColorStop(0, `rgba(${R.rgb},${0.32 * rev})`); gr.addColorStop(1, `rgba(${R.rgb},0)`);
          x.fillStyle = gr; x.beginPath(); x.moveTo(0, 0); x.lineTo(rr, -rr * 0.07); x.lineTo(rr, rr * 0.07); x.closePath(); x.fill();
        }
        x.restore();
      }

      // ---- la valigetta: caduta con rimbalzo, tremito che cresce, apertura
      let yOff = 0, shake = 0, squash = 1;
      if (t < T_LAND) { const u = t / T_LAND; yOff = -(1 - u * u) * (H * 0.7); }
      else if (t < T_LAND + 0.3) { const u = (t - T_LAND) / 0.3; yOff = -Math.sin(u * Math.PI) * 26 * (1 - u); squash = 1 - 0.12 * Math.sin(u * Math.PI) * (1 - u); }
      if (t > T_SUS && t < T_BURST) shake = (1.5 + lvl * 1.8 + (t - T_SUS) * 2.2) * (reduce ? 0.2 : 1);
      if (t > T_SUS && t < T_BURST && Math.random() < dt * (6 + lvl * 3)) SND.rattle(lvl);
      const open = Math.max(0, Math.min(1, (t - T_BURST) / 0.28));
      const leak = t > T_SUS ? 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (10 + lvl * 4))) * Math.min(1, (t - T_SUS) * 2) : 0;
      ox.clearRect(0, 0, 120, 110);
      drawCase(ox, type, { open, latch: t >= T_L2 ? 2 : t >= T_L1 ? 1 : 0, leak, glow: rgbOf(lvl) });
      const sx = (Math.random() - 0.5) * shake, sy = (Math.random() - 0.5) * shake * 0.6, rot = (Math.random() - 0.5) * shake * 0.004;
      x.save(); x.translate(cx + sx, cy + yOff + sy); x.rotate(rot); x.scale(1 / squash > 1 ? 1 + (1 - squash) : 1, squash);
      x.imageSmoothingEnabled = false; x.drawImage(off, -cw / 2, -ch / 2, cw, ch); x.restore();
      // alone della fessura
      if (t > T_SUS && t < T_BURST) { x.save(); x.globalCompositeOperation = 'lighter'; const gy = cy + yOff - ch / 2 + 52 * sc, g2 = x.createRadialGradient(cx, gy, 2, cx, gy, cw * 0.6); g2.addColorStop(0, `rgba(${rgbOf(lvl)},${0.35 * leak})`); g2.addColorStop(1, `rgba(${rgbOf(lvl)},0)`); x.fillStyle = g2; x.fillRect(cx - cw, gy - cw * 0.6, cw * 2, cw * 1.2); x.restore(); }

      // ---- anelli d'urto
      x.save(); x.globalCompositeOperation = 'lighter';
      for (const r of rings) { r.t += dt; if (r.t < 0) continue; const a = Math.max(0, 1 - r.t / 0.9); x.strokeStyle = `rgba(${r.col},${a * 0.8})`; x.lineWidth = 2 + 18 * a * r.w; x.beginPath(); x.arc(cx, t > T_BURST ? itemY : cy - ch * 0.1, 30 + r.t * 900 * r.w, 0, Math.PI * 2); x.stroke(); }
      x.restore();

      // ---- il premio sale fuori dalla valigetta
      if (bt > 0.05) {
        const u = Math.min(1, (bt - 0.05) / 0.7), ease = 1 - Math.pow(1 - u, 3), from = H * 0.56 - ch * 0.12, py = from + (itemY - from) * ease + Math.sin(t * 2.2) * 6 * u, isz = Math.min(W * 0.42, H * 0.3, sc * 46);
        const halo = x.createRadialGradient(cx, py, 4, cx, py, isz * 1.4); halo.addColorStop(0, `rgba(${R.rgb},${0.55 * u})`); halo.addColorStop(1, `rgba(${R.rgb},0)`);
        x.save(); x.globalCompositeOperation = 'lighter'; x.fillStyle = halo; x.fillRect(cx - isz * 1.5, py - isz * 1.5, isz * 3, isz * 3); x.restore();
        x.save(); x.globalAlpha = fade * Math.min(1, u * 1.5); x.imageSmoothingEnabled = false;
        if (carImg) { const cwid = Math.min(W * 0.7, isz * 3.4), chg = cwid * carImg.height / carImg.width; x.drawImage(carImg, cx - cwid / 2, py - chg / 2, cwid, chg); }
        else { const k = 0.85 + 0.15 * Math.sin(t * 3); x.drawImage(icn, cx - isz * k / 2, py - isz * k / 2, isz * k, isz * k); }
        x.restore();
        // stelline intorno
        if (Math.random() < dt * (8 + ri * 6)) parts.push({ x: cx + (Math.random() - 0.5) * isz * 2, y: py + (Math.random() - 0.5) * isz * 1.6, vx: 0, vy: -20, life: 1, dec: 1.4, col: '#ffffff', s: 3 + Math.random() * 4, kind: 'star', rot: 0, vr: 0 });
      }

      // ---- particelle
      x.save();
      for (let k = parts.length - 1; k >= 0; k--) {
        const p = parts[k]; p.life -= dt * p.dec; if (p.life <= 0) { parts.splice(k, 1); continue; }
        p.vy += (p.kind === 'confetti' ? 120 : p.kind === 'coin' ? 700 : p.kind === 'dust' ? -10 : 380) * dt; p.vx *= 1 - dt * (p.kind === 'confetti' ? 1.5 : 0.6);
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        x.globalAlpha = Math.min(1, p.life * 1.6) * fade;
        if (p.kind === 'confetti') { x.save(); x.translate(p.x, p.y); x.rotate(p.rot); x.fillStyle = p.col; x.fillRect(-p.s, -p.s * 0.4 * Math.abs(Math.cos(p.rot * 2)), p.s * 2, p.s * 0.8 * Math.abs(Math.cos(p.rot * 2)) + 0.5); x.restore(); }
        else if (p.kind === 'coin') { x.fillStyle = '#7a5a10'; x.beginPath(); x.ellipse(p.x, p.y, 6, 6 * Math.abs(Math.cos(p.rot)), 0, 0, Math.PI * 2); x.fill(); x.fillStyle = p.col; x.beginPath(); x.ellipse(p.x - 1, p.y - 1, 4.5, 4.5 * Math.abs(Math.cos(p.rot)), 0, 0, Math.PI * 2); x.fill(); }
        else if (p.kind === 'star') { x.fillStyle = p.col; const r = p.s * p.life; x.fillRect(p.x - r, p.y - 0.75, r * 2, 1.5); x.fillRect(p.x - 0.75, p.y - r, 1.5, r * 2); }
        else if (p.kind === 'dust') { x.fillStyle = p.col; x.globalAlpha *= 0.5; x.beginPath(); x.arc(p.x, p.y, p.s * (2 - p.life), 0, Math.PI * 2); x.fill(); }
        else { x.globalCompositeOperation = 'lighter'; x.fillStyle = p.col; x.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s); x.globalCompositeOperation = 'source-over'; }
      }
      x.restore();

      // ---- lampo dell'esplosione
      if (bt > 0 && bt < 0.6) { x.fillStyle = `rgba(${bt < 0.08 ? '255,255,255' : R.rgb},${(reduce ? 0.3 : 0.85) * (1 - bt / 0.6) * fade})`; x.fillRect(0, 0, W, H); }

      // ---- scritte: rarità che cala dall'alto, nome e descrizione del premio
      if (bt > 0.25) {
        const u = Math.min(1, (bt - 0.25) / 0.35), back = 1 + 2.4 * Math.pow(1 - u, 3) - 0.08 * Math.sin(u * Math.PI);
        const fs = Math.min(W * 0.12, 26 + ri * 6 + sc * 6), ty = H * 0.13;
        const label = R.name.toUpperCase(), font = `400 ${fs}px "Black Ops One", "Saira Stencil One", Impact, sans-serif`;
        bx.font = font; const mw = bx.measureText(label).width, bw = Math.ceil(mw + fs * 0.6), bh = Math.ceil(fs * 1.5);
        if (ban.width !== bw * 2 || ban.height !== bh * 2) { ban.width = bw * 2; ban.height = bh * 2; }
        bx.setTransform(2, 0, 0, 2, 0, 0); bx.clearRect(0, 0, bw, bh); bx.font = font; bx.textAlign = 'center'; bx.textBaseline = 'middle';
        bx.lineJoin = 'round'; bx.lineWidth = fs * 0.16; bx.strokeStyle = '#05050a'; bx.strokeText(label, bw / 2, bh / 2);
        const tg = bx.createLinearGradient(0, bh / 2 - fs / 2, 0, bh / 2 + fs / 2); tg.addColorStop(0, '#ffffff'); tg.addColorStop(0.45, R.col); tg.addColorStop(1, Street2DShade(R.col));
        bx.fillStyle = tg; bx.fillText(label, bw / 2, bh / 2);
        // riflesso che attraversa le lettere (solo dove c'è già scritta)
        const sw = ((bt * 0.9) % 2.2) - 0.6;
        bx.globalCompositeOperation = 'source-atop';
        const sx0 = sw * bw, shine = bx.createLinearGradient(sx0, 0, sx0 + fs, bh); shine.addColorStop(0, 'rgba(255,255,255,0)'); shine.addColorStop(0.5, 'rgba(255,255,255,.85)'); shine.addColorStop(1, 'rgba(255,255,255,0)');
        bx.fillStyle = shine; bx.fillRect(0, 0, bw, bh); bx.globalCompositeOperation = 'source-over';
        x.save(); x.globalAlpha = fade * Math.min(1, u * 2); x.translate(cx, ty); x.scale(back, back); x.rotate(-0.04);
        x.drawImage(ban, -bw / 2, -bh / 2, bw, bh);
        x.restore();
        const v = Math.min(1, (bt - 0.6) / 0.4);
        if (v > 0) {
          x.save(); x.globalAlpha = fade * v; x.textAlign = 'center'; x.textBaseline = 'top';
          const ny = itemY + Math.min(H * 0.17, sc * 34 * 0.75) + 8, f2 = Math.min(W * 0.065, 30);
          x.font = `400 ${f2}px "Saira Stencil One", "Black Ops One", Impact, sans-serif`; x.lineWidth = 6; x.strokeStyle = '#05050a'; x.strokeText(prize.name, cx, ny); x.fillStyle = '#ffffff'; x.fillText(prize.name, cx, ny);
          x.font = `500 ${Math.min(16, W * 0.04)}px "Barlow Semi Condensed", system-ui, sans-serif`; x.fillStyle = '#d8d2c4';
          const yEnd = wrap(x, prize.text, cx, ny + f2 + 10, Math.min(W - 40, 520), 20);
          if (t > T_READY) { x.fillStyle = `rgba(255,255,255,${0.45 + 0.35 * Math.sin(t * 4)})`; x.font = `600 13px system-ui, sans-serif`; x.fillText('Tocca per ritirare', cx, yEnd + 26); }
          x.restore();
        }
      }
      x.globalAlpha = 1;
      requestAnimationFrame(frame);
    };
    const finish = () => { if (done) return; done = true; ov.remove(); removeEventListener('resize', fit); removeEventListener('keydown', key, true); if (onDone) onDone(); };
    requestAnimationFrame(frame);
    return { skip, close, get t() { return t; }, T_BURST, T_READY };
  }
  // un colore più scuro per il fondo delle lettere
  function Street2DShade(hex) { const n = parseInt(hex.slice(1), 16), f = 0.45; return `rgb(${Math.round((n >> 16) * f)},${Math.round(((n >> 8) & 255) * f)},${Math.round((n & 255) * f)})`; }
  function wrap(x, text, cx, y, maxW, lh) {
    const words = String(text).split(' '); let line = '';
    for (const w of words) { const tt = line ? line + ' ' + w : w; if (x.measureText(tt).width > maxW && line) { x.fillText(line, cx, y); y += lh; line = w; } else line = tt; }
    if (line) x.fillText(line, cx, y);
    return y;
  }

  // ---------------------------------------------------------------- l'app nel telefono
  const UI = { tab: 0, msg: '' };
  const CSS = `
.vgl-hd{display:flex;justify-content:space-between;align-items:center;margin:0 4px 8px;font:600 12px system-ui;color:var(--t2)}.vgl-hd b{color:var(--grn);font:700 15px system-ui}
.vgl-case{position:relative;display:grid;grid-template-columns:86px 1fr;gap:10px;align-items:center;background:linear-gradient(135deg,var(--c1),var(--c2));border-radius:18px;padding:10px 12px;margin-bottom:10px;box-shadow:inset 0 0 0 1px #ffffff1a,0 6px 16px #0007;overflow:hidden}
.vgl-case::after{content:"";position:absolute;inset:-40%;background:linear-gradient(110deg,transparent 40%,#ffffff22 50%,transparent 60%);animation:vglshine 4.5s ease-in-out infinite;pointer-events:none}
@keyframes vglshine{0%,60%{transform:translateX(-60%)}100%{transform:translateX(60%)}}
.vgl-case img{width:86px;image-rendering:pixelated;filter:drop-shadow(0 4px 6px #000a);animation:vglbob 3s ease-in-out infinite}
@keyframes vglbob{50%{transform:translateY(-3px) rotate(-1deg)}}
.vgl-case h4{margin:0;font:800 15px/1.15 system-ui;letter-spacing:.01em}.vgl-case p{margin:2px 0 6px;font-size:11.5px;color:#ffffffb0}
.vgl-odds{display:flex;height:6px;border-radius:3px;overflow:hidden;margin:2px 0 4px;background:#0006}.vgl-odds i{display:block;height:100%}
.vgl-leg{display:flex;flex-wrap:wrap;gap:2px 8px;font:10px system-ui;color:#ffffffb0;margin-bottom:6px}.vgl-leg span::before{content:"";display:inline-block;width:6px;height:6px;border-radius:2px;background:var(--k);margin-right:3px}
.vgl-buy{border:0;border-radius:11px;padding:8px 10px;font:700 13px system-ui;cursor:pointer;width:100%;color:#111;background:linear-gradient(180deg,#fff,#d8dce4)}
.vgl-buy[disabled]{opacity:.45;cursor:default}
.vgl-row{display:flex;gap:10px;align-items:center;background:var(--s1);border-radius:14px;padding:8px 10px;margin-bottom:8px}
.vgl-row img{width:56px;image-rendering:pixelated}.vgl-row .tx{flex:1;min-width:0}.vgl-row b{display:block;font-size:13.5px}.vgl-row small{color:var(--t2);font-size:11.5px}
.vgl-open{border:0;border-radius:10px;padding:8px 14px;font:800 13px system-ui;cursor:pointer;color:#111;background:linear-gradient(180deg,#ffe28a,#ffb347);box-shadow:0 0 14px #ffb34766;animation:vglpulse 1.4s ease-in-out infinite}
@keyframes vglpulse{50%{box-shadow:0 0 4px #ffb34722}}
.vgl-chip{display:inline-flex;gap:6px;align-items:center;padding:5px 9px;border-radius:10px;background:var(--s2);font:600 11.5px system-ui;margin:0 6px 6px 0}
.vgl-log{font-size:11.5px;color:var(--t2);padding:3px 2px}.vgl-log b{font-weight:700}
.vgl-msg{background:#ffffff14;border-radius:12px;padding:8px 10px;font-size:12px;margin-bottom:8px}`;
  const BG = { bronzo: ['#5a3418', '#2a160a'], argento: ['#5c6474', '#22262e'], oro: ['#3a2c08', '#0e0c06'] };
  function render() {
    const g = G(); if (!g) return '';
    const C = g.cases(), own = C.own, money = Math.floor(g.s.money);
    const tabs = `<div class="tabs"><button data-x="tab" data-v="0" aria-pressed="${UI.tab === 0}">Negozio</button><button data-x="tab" data-v="1" aria-pressed="${UI.tab === 1}">Le mie${own.length ? ' (' + own.length + ')' : ''}</button><button data-x="tab" data-v="2" aria-pressed="${UI.tab === 2}">Premi</button></div>`;
    let body = '';
    if (UI.tab === 0) {
      body = Object.entries(CASE_TYPES).map(([k, T]) => {
        const bars = T.odds.map((p, i) => p > 0 ? `<i style="width:${Math.max(p, 1.5)}%;background:${CASE_RAR[i].col}"></i>` : '').join('');
        const leg = T.odds.map((p, i) => p > 0 ? `<span style="--k:${CASE_RAR[i].col}">${CASE_RAR[i].name} ${String(p).replace('.', ',')} %</span>` : '').join('');
        return `<div class="vgl-case" style="--c1:${BG[k][0]};--c2:${BG[k][1]}"><img src="${thumb(k)}" alt=""><div><h4>${T.name}</h4><p>${T.note}</p><div class="vgl-odds">${bars}</div><div class="vgl-leg">${leg}</div><button class="vgl-buy" data-x="buy" data-t="${k}" ${money < T.price ? 'disabled' : ''}>Compra · € ${fmt(T.price)}</button></div></div>`;
      }).join('') + `<p class="cen" style="font-size:11px">Garanzia: almeno un raro ogni ${CASE_PITY.raro} valigette, un epico ogni ${CASE_PITY.epico}. Si comprano solo coi soldi del viaggio.</p>`;
    } else if (UI.tab === 1) {
      body = own.length ? own.map((c, i) => `<div class="vgl-row"><img src="${thumb(c.type)}" alt=""><span class="tx"><b>${CASE_TYPES[c.type].name}</b><small>${c.why === 'comprata' ? 'comprata' : 'ricompensa: ' + esc(c.why)}</small></span><button class="vgl-open" data-x="open" data-i="${i}">Apri</button></div>`).join('')
        : '<p class="cen">Nessuna valigetta da aprire. Comprane una nel Negozio, o guadagnale coi lavori.</p>';
    } else {
      const k = (g.s.dist || 0) / 1000, mine = C.boosts.filter((b) => b.car === g.car);
      body = `<div>${C.tickets.svc ? `<span class="vgl-chip">🎫 Tagliando gratis × ${C.tickets.svc}</span>` : ''}${C.tickets.mod ? `<span class="vgl-chip">🎫 Modifica gratuita × ${C.tickets.mod}</span>` : ''}${mine.map((b) => `<span class="vgl-chip">⚡ ${esc(b.name)} +${Math.round(b.pw * 100)} % · ancora ${fmt(Math.max(0, b.until - k))} km</span>`).join('')}${C.perm[g.car] ? `<span class="vgl-chip">🔧 Per sempre +${Math.round(C.perm[g.car] * 100)} %</span>` : ''}</div>`
        + (!C.tickets.svc && !C.tickets.mod && !mine.length && !C.perm[g.car] ? '<p class="cen" style="font-size:12px">Ticket e potenziamenti attivi compaiono qui.</p>' : '')
        + `<h4 style="margin:10px 4px 4px;font:600 12px system-ui;color:var(--t2)">ULTIME APERTURE · ${C.opened}</h4>` + (C.log.length ? C.log.map((l) => `<div class="vgl-log"><b style="color:${CASE_RAR[l.rar].col}">${CASE_RAR[l.rar].name}</b> · ${esc(l.name)} <span style="opacity:.6">(${CASE_TYPES[l.type].short})</span></div>`).join('') : '<p class="cen" style="font-size:12px">Ancora nessuna.</p>');
    }
    return `<div class="view app"><div class="nav"><h3>Valigette</h3></div><div class="body"><div class="vgl-hd"><span>Contanti</span><b>€ ${fmt(money)}</b></div>${UI.msg ? `<div class="vgl-msg">${esc(UI.msg)}</div>` : ''}${tabs}${body}</div></div>`;
  }
  let opening = null;
  function openCase(i) {
    const g = G(); if (!g || opening) return;
    const pz = g.caseOpen(i); if (!pz) return;
    if (window.telefono) window.telefono.close();
    ac();                                                         // l'audio parte col tocco
    opening = play(pz, () => { opening = null; UI.tab = g.cases().own.length ? 1 : 2; UI.msg = ''; if (window.telefono) window.telefono.show('vgl'); });
  }
  function click(D) {
    const g = G(); if (!g) return;
    if (D.x === 'tab') { UI.tab = +D.v; UI.msg = ''; }
    else if (D.x === 'buy') { const r = g.caseBuy(D.t); UI.msg = r.ok ? `${CASE_TYPES[D.t].name} comprata: la trovi in "Le mie".` : r.why; if (r.ok) { SND.latch(); UI.tab = 1; } }
    else if (D.x === 'open') { openCase(+D.i); return; }
    window.telefono.render();
  }
  const ICON = '<path d="M3 11h14v9H3z"/><path d="M7 11V8h6v3M3 15h14"/><path d="M19.5 2.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="#fff"/>';
  const add = () => {
    if (!window.telefono || !window.telefono.addApp) return false;
    window.telefono.addApp({ id: 'vgl', name: 'Valigette', icon: ICON, color: 'linear-gradient(145deg,#ffcf5a,#c27a12)', css: CSS,
      badge: () => { const g = G(); return g && g.s ? g.cases().own.length : 0; }, render, click });
    return true;
  };
  if (!add()) addEventListener('load', add);

  // ogni mezzo secondo: ricompense, potenziamenti attivi (la fisica legge sim.extraPw)
  setInterval(() => {
    const g = G(); if (!g || !g.s || !g.sim) return;
    try { g.caseRewards(); g.sim.extraPw = g.caseBoosts(); } catch (e) { /* partita non pronta */ }
  }, 500);

  // nel telefono anche Valigette si scarica: un cartellone sulla strada dopo quello di Passeggeri (vedi TEL_APP_OFFERS).
  // Se si guadagna una valigetta prima, l'icona da scaricare compare subito.
  if (typeof TEL_APP_OFFERS !== 'undefined' && !TEL_APP_OFFERS.some((o) => o.app === 'vgl')) {
    const i = TEL_APP_OFFERS.findIndex((o) => o.app === 'pax');
    TEL_APP_OFFERS.splice(i >= 0 ? i + 1 : TEL_APP_OFFERS.length, 0, { app: 'vgl', km: 4, name: 'Valigette', sign: 'E SE CI FOSSE|DI PIU?' });
  }
  const offerApp = () => {
    const g = G(), t = g && g.s && g.s.tel; if (!t) return false;
    t.apps = t.apps || {};
    const st = t.apps.vgl && t.apps.vgl.st;
    if (st === 'ok' || st === 'dl' || st === 'offer') return false;
    t.apps.vgl = { st: 'offer' }; return true;
  };
  window.valigette = {
    play, openCase, drawCase, drawPrize, carPic, SND, ac,
    notify(type) {
      const nuova = offerApp();
      if (window.telefono && window.telefono.toast) window.telefono.toast('Valigette', nuova ? `${CASE_TYPES[type].name}! Scarica l'app Valigette dal telefono per aprirla.` : `${CASE_TYPES[type].name}: aprila dal telefono`, false);
      if (window.telefono && window.telefono.render) window.telefono.render();
    },
    // per provare la scena: window.valigette.demo('oro', 5)
    demo(type = 'oro', rar = 5, icon = 'soldi') { return play({ type, rar, icon, name: 'Prova', text: 'Solo una prova della scena.' }); },
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { CASE_RAR, CASE_TYPES, CASE_PITY, CASE_MOD_MAX });
