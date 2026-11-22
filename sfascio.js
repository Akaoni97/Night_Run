// ============================================================================
//  Night Run · Lo sfasciacarrozze: Sfascio Ruggine (dopo usato.js)
//  Tappa nuova: prende il posto del secondo autogrill di ogni giro (VG_PATTERN[9], primo al km 30,6).
//  Dentro: pezzi usati per l'auto che guidi a meno della metà (Luca te li monta gratis), la carcassa da rimettere in
//  strada (si paga poco, ha tutti i difetti: con Nico, carrozziere e gomme torna a valere all'Autosalone),
//  rottamare un'auto tua, e rovistare tra le carcasse (€ 20, una volta per tappa: scegli quale e vedi cosa trovi).
//  Stato in game.s.vg.sfascio.
// ============================================================================
const JK = {
  partK: 0.45,          // pezzi usati: frazione del prezzo nuovo
  rareK: 0.6,           // il pezzo raro (il più caro) quando c'è
  wreckK: 0.2,          // carcassa: frazione del prezzo nuovo
  dig: 20,              // rovistare
  scrapKg: 0.15,        // € al kg per la rottamazione
};
// cosa si trova rovistando (w = peso)
const JK_FINDS = [
  { w: 22, k: 'niente' }, { w: 30, k: 'soldi' }, { w: 18, k: 'oggetto' }, { w: 8, k: 'ticket' }, { w: 14, k: 'pezzo' }, { w: 6, k: 'valigetta' }, { w: 2, k: 'jackpot' },
];

if (typeof VG_PLACE !== 'undefined') {
  VG_PLACE.junk = { name: () => 'Sfascio Ruggine', what: 'sfasciacarrozze', col: '#e0874a' };
  if (VG_PATTERN[9] === 'grill') VG_PATTERN[9] = 'junk';
}

(function sfascioLogica() {
  if (typeof StreetGame === 'undefined' || typeof VG_SHOP === 'undefined') return;
  const P = StreetGame.prototype;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const r10 = (v) => Math.round(v / 10) * 10, r50 = (v) => Math.round(v / 50) * 50;
  const nOf = (g) => (g.inside ? Math.round((g.inside.x - VG_STOP0) / VG_STEP) : -1);
  P.jk = function () { const v = this.s.vg; return v.sfascio || (v.sfascio = { sold: {}, wreck: {}, dug: {}, finds: 0 }); };
  const carHash = (id) => [...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0);

  // pezzi usati per l'auto che guidi (sempre gli stessi per la stessa tappa e la stessa auto)
  P.jkStock = function (n) {
    const T = CARS[this.car] && CARS[this.car].tuning; if (!T) return [];
    const pre = this.car === 'supra' ? '' : this.car + '|', cand = [];
    for (const cat in T) for (const it of T[cat].items || []) if (it.price > 0 && !this.s.owned[pre + cat + ':' + it.id]) cand.push({ cat, it });
    if (!cand.length) return [];
    const h = (k) => VG.hash(n * 17 + k * 3.7 + carHash(this.car) * 0.13), out = [];
    for (let k = 0; out.length < Math.min(4, cand.length) && k < 30; k++) { const c = cand[Math.floor(h(k) * cand.length)]; if (!out.includes(c)) out.push(c); }
    const top = cand.slice().sort((a, b) => b.it.price - a.it.price)[0];
    const list = out.map((c) => ({ cat: c.cat, id: c.it.id, name: `${c.it.brand ? c.it.brand + ' ' : ''}${c.it.name}`, label: T[c.cat].label || c.cat, full: c.it.price, price: r10(c.it.price * JK.partK), rare: false }));
    if (h(40) < 0.3 && !out.includes(top)) list.push({ cat: top.cat, id: top.it.id, name: `${top.it.brand ? top.it.brand + ' ' : ''}${top.it.name}`, label: T[top.cat].label || top.cat, full: top.it.price, price: r10(top.it.price * JK.rareK), rare: true });
    return list.filter((p) => !this.jk().sold[n + ':' + this.car + ':' + p.cat + ':' + p.id]);
  };
  P.jkBuyPart = function (cat, id) {
    const n = nOf(this), p = this.jkStock(n).find((q) => q.cat === cat && q.id === id); if (!p) return { ok: false, why: 'Non c\'è più' };
    if (this.s.money < p.price) return { ok: false, why: `Costa € ${fmt(p.price)}` };
    this.s.money -= p.price; this.s.owned[(this.car === 'supra' ? '' : this.car + '|') + cat + ':' + id] = true; this.jk().sold[n + ':' + this.car + ':' + cat + ':' + id] = 1;
    this.say(`${p.name} usato (− € ${fmt(p.price)}): è tuo, Luca te lo monta senza farti pagare`, 'buy');
    return { ok: true, price: p.price };
  };

  // la carcassa della tappa: un'auto incidentata con tutti i difetti
  P.jkWreck = function (n) {
    if (this.jk().wreck[n]) return null;
    const at = VG.stopX(n) / 1000, h = (k) => VG.hash(n * 23 + k * 5.3 + 0.7), v = this.s.vg;
    const pool = VG_SHOP.filter((q) => q.car && CARS[q.id] && CARS[q.id].sprite && q.km <= at + 100 && !v.garage.includes(q.id));
    if (!pool.length) return null;
    const id = pool[Math.floor(h(1) * pool.length)].id, it = VG_SHOP.find((q) => q.id === id);
    return { n, id, km: Math.round(250 + h(2) * 270), price: r50(it.price * JK.wreckK), damage: 0.7 + h(3) * 0.15, defects: ['motore', 'gomme', 'olio', 'freni'] };
  };
  // quanto costa rimetterla in strada e quanto vale dopo all'Autosalone
  P.jkRestore = function (W) {
    const it = VG_SHOP.find((q) => q.id === W.id), d = this.disc ? this.disc() : 1;
    const body = Math.round(W.damage * 2600 * d / 10) * 10, rev = this.usRevCost(W.id), tyres = 450, svc = 70 + 110 + 150;
    const after = Math.max(200, r50(it.price * Math.max(0.35, 0.75 - W.km / 1000 * 0.3)));
    return { body, rev, tyres, svc, total: body + rev + tyres + svc, after, profit: after - W.price - (body + rev + tyres + svc) };
  };
  P.jkBuyWreck = function () {
    const n = nOf(this), W = this.jkWreck(n); if (!W) return { ok: false, why: 'Non c\'è più' };
    if (this.s.money < W.price) return { ok: false, why: `Costa € ${fmt(W.price)}` };
    this.s.money -= W.price; this.jk().wreck[n] = W.id;
    this.usGive(W.id, W.km, W.defects, { damage: W.damage }, W.price);
    this.say(`Carcassa della ${CARS[W.id].name} (− € ${fmt(W.price)}): è nel tuo garage. Nico e il carrozziere ti aspettano.`, 'buy');
    return { ok: true, price: W.price };
  };

  // rottamare: peso e un po' dei pezzi
  P.jkScrapValue = function (id) {
    const kg = (CARS[id] && (CARS[id].mass || (CARS[id].P && CARS[id].P.mass))) || 1200;
    return r10(kg * JK.scrapKg + (this.dlParts ? this.dlParts(id) * 0.2 : 0));
  };
  P.jkScrap = function (id) {
    const c = this.dlCanSell(id); if (!c.ok) return c;
    const v = this.s.vg, val = this.jkScrapValue(id), pre = id === 'supra' ? '' : id + '|';
    this.s.money += val; v.garage = v.garage.filter((g) => g !== id); delete v.owned[id]; delete this.s.cars[id];
    for (const k in this.s.owned || {}) if (pre ? k.startsWith(pre) : !k.includes('|')) delete this.s.owned[k];
    this.say(`${CARS[id].name} nella pressa: + € ${fmt(val)}`, 'money');
    return { ok: true, val };
  };

  // rovistare: una volta per tappa, scegli una delle sei carcasse
  P.jkDig = function (pick, rnd = Math.random) {
    const n = nOf(this), J = this.jk();
    if (n < 0) return { ok: false };
    if (J.dug[n]) return { ok: false, why: 'Hai già rovistato qui' };
    if (this.s.money < JK.dig) return { ok: false, why: `L'ingresso costa € ${JK.dig}` };
    this.s.money -= JK.dig;
    const tot = JK_FINDS.reduce((a, f) => a + f.w, 0); let x = rnd() * tot, f = JK_FINDS[0];
    for (const q of JK_FINDS) { x -= q.w; if (x < 0) { f = q; break; } }
    let out = { k: f.k, name: 'Niente', text: 'Solo ruggine e un vecchio scontrino.' };
    if (f.k === 'soldi') { const v = r10(40 + rnd() * 160); this.s.money += v; out = { k: 'soldi', name: `€ ${fmt(v)}`, text: 'Monete e banconote sotto i tappetini.' }; }
    else if (f.k === 'oggetto') { const kind = ['tanica', 'bomboletta', 'kit'][Math.floor(rnd() * 3)]; if (typeof INV !== 'undefined' && INV[kind] && this.addItem && this.addItem(kind)) out = { k: 'oggetto', kind, name: INV[kind].name, text: 'Nel bagagliaio di una carcassa. Funziona ancora.' }; else { this.s.money += 60; out = { k: 'soldi', name: '€ 60', text: 'Il bagagliaio era pieno: il ferrovecchio te lo ricompra.' }; } }
    else if (f.k === 'ticket') { if (typeof CASE_GIVE !== 'undefined' && CASE_GIVE) { CASE_GIVE.ticket('svc')(this); out = { k: 'ticket', name: 'Ticket tagliando gratis', text: 'Nel cassetto del cruscotto, ancora valido.' }; } }
    else if (f.k === 'pezzo') { const s = this.jkStock(n + 1000)[0]; if (s) { this.s.owned[(this.car === 'supra' ? '' : this.car + '|') + s.cat + ':' + s.id] = true; out = { k: 'pezzo', name: s.name, text: `${s.label} per la tua auto, smontato da una carcassa uguale. Luca te lo monta gratis.` }; } else { this.s.money += 150; out = { k: 'soldi', name: '€ 150', text: 'Un pezzo che non ti serve: il ferrovecchio te lo ricompra.' }; } }
    else if (f.k === 'valigetta') { if (this.caseGrant) { this.caseGrant('bronzo', 'lo sfasciacarrozze'); out = { k: 'valigetta', name: 'Valigetta di bronzo', text: 'Chiusa a chiave, sotto un sedile.' }; } }
    else if (f.k === 'jackpot') { const v = 2500; this.s.money += v; out = { k: 'jackpot', name: `€ ${fmt(v)}`, text: 'Una busta nascosta nella ruota di scorta. Chi l\'ha messa lì?' }; }
    J.dug[n] = { pick, out }; J.finds++;
    return Object.assign({ ok: true }, out);
  };
})();

// ============================================================================
//  Pannello e facciata (solo nel browser)
// ============================================================================
(function sfascioSchermo() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const G = () => window.nightRun && window.nightRun.game;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pic = (id, cb) => (window.NightDealer ? window.NightDealer.pic(id, cb) : '');
  const CSS = document.createElement('style');
  CSS.textContent = `
.jk-h{margin:4px 0 0;font:400 14px/1 var(--f-display);letter-spacing:.06em;text-transform:uppercase;color:#e0874a}
.jk-dig{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.jk-w{position:relative;aspect-ratio:1.5;border:0;cursor:pointer;background:linear-gradient(180deg,#3a2a1e,#1a120c);box-shadow:inset 0 0 0 1px #5a3e2a;color:#f0e6d2;font:400 12px/1.2 var(--f-data);display:grid;place-items:center;padding:6px;overflow:hidden}
.jk-w::before{content:"";position:absolute;left:12%;right:12%;bottom:18%;height:34%;background:#5a4a3a;clip-path:polygon(0 100%,4% 40%,22% 30%,34% 0,70% 6%,84% 36%,100% 50%,100% 100%);opacity:.9}
.jk-w::after{content:"";position:absolute;left:16%;bottom:12%;width:14%;aspect-ratio:1;border-radius:50%;background:#14100c;box-shadow:calc(var(--w,60px) * 1) 0 0 #14100c}
.jk-w:hover:not(:disabled){box-shadow:inset 0 0 0 2px #e0874a}.jk-w:disabled{cursor:default;opacity:.45}
.jk-w.got{opacity:1;background:radial-gradient(circle,#5a4a10,#1a120c);box-shadow:inset 0 0 0 2px #ffd23f;animation:jkflip .5s ease-out}.jk-w.got::before,.jk-w.got::after{display:none}
.jk-w span{position:relative;z-index:1;text-align:center}.jk-w.got span b{display:block;font:400 15px/1.1 var(--f-display);color:#ffd23f}
@keyframes jkflip{from{transform:rotateY(90deg)}}
.jk-part{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:8px 10px;background:#13120f;box-shadow:inset 0 0 0 1px #2a2620}
.jk-part b{font:400 14px/1.15 var(--f-display)}.jk-part small{display:block;color:var(--muted);font-size:12px}.jk-part s{color:var(--muted)}.jk-part.rare{box-shadow:inset 0 0 0 1px #ffd23f,inset 3px 0 0 #ffd23f}
.jk-wreck{display:grid;gap:8px;padding:12px;background:linear-gradient(180deg,#2a1c12,#120c08);box-shadow:inset 0 0 0 1px #5a3e2a}
.jk-wreck img{max-width:100%;image-rendering:pixelated;filter:sepia(.7) saturate(.6) brightness(.7) contrast(1.1)}
.jk-est{display:grid;grid-template-columns:1fr auto;gap:2px 10px;font-size:13px}.jk-est b{font-weight:600;text-align:right}.jk-est .tot{border-top:1px solid #3a342a;padding-top:3px}
.jk-wreck .kbtn,.jk-part .kbtn{font-size:12.5px;padding:8px 12px}.jk-wreck .kbtn:disabled,.jk-part .kbtn:disabled{opacity:.38}`;
  document.head.appendChild(CSS);

  function panel(body, I, ctx) {
    const g = G(); if (!g) return;
    const n = Math.round((I.x - VG_STOP0) / VG_STEP), J = g.jk(), wrap = document.createElement('div'); wrap.style.cssText = 'display:grid;gap:10px';
    const h = (t) => { const e = document.createElement('h4'); e.className = 'jk-h'; e.textContent = t; wrap.appendChild(e); };
    const p = (t) => { const e = document.createElement('p'); e.className = 'hint'; e.style.margin = '0'; e.textContent = t; wrap.appendChild(e); };
    const done = (r) => { if (r && r.ok === false) { if (r.why) ctx.flash(r.why, 2.4); } else ctx.save(); ctx.refresh(); };
    p('Massimo Lo Sfascio: «Qui niente garanzia, ma i prezzi sono questi. Il cane non morde.»');
    // rovistare
    h(`Rovista tra le carcasse · € ${JK.dig}`);
    const dug = J.dug[n], grid = document.createElement('div'); grid.className = 'jk-dig';
    for (let k = 0; k < 6; k++) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'jk-w' + (dug && dug.pick === k ? ' got' : '');
      b.innerHTML = dug && dug.pick === k ? `<span><b>${esc(dug.out.name)}</b>${esc(dug.out.text)}</span>` : `<span>Carcassa ${k + 1}</span>`;
      b.disabled = !!dug || g.s.money < JK.dig;
      b.addEventListener('click', () => { const r = g.jkDig(k); if (r.ok && window.valigette && window.valigette.SND) { const S = window.valigette.SND; try { window.valigette.ac(); S.rattle(2); setTimeout(() => (r.k === 'niente' ? S.thud() : S.coins()), 300); } catch (e) { /* audio */ } } done(r); });
      grid.appendChild(b);
    }
    wrap.appendChild(grid);
    if (!dug) p('Una sola volta per sosta: scegli quale aprire.');
    // la carcassa
    const W = g.jkWreck(n);
    if (W) {
      const R = g.jkRestore(W);
      h('La carcassa da rimettere in strada');
      const d = document.createElement('div'); d.className = 'jk-wreck';
      d.innerHTML = `<div style="display:grid;place-items:center"><img alt="" src="${pic(W.id, ctx.refresh)}"></div><b style="font:400 18px/1.1 var(--f-display)">${esc(CARS[W.id].name)} · € ${fmt(W.price)}</b>`
        + `<small style="color:var(--muted)">${fmt(W.km)} km · carrozzeria al ${Math.round(W.damage * 100)} % · motore stanco, freni e gomme finiti, tagliando da fare</small>`
        + `<div class="jk-est"><span>Carrozziere</span><b>€ ${fmt(R.body)}</b><span>Revisione del motore (Nico)</span><b>€ ${fmt(R.rev)}</b><span>Gomme nuove</span><b>€ ${fmt(R.tyres)}</b><span>Tagliando, candele, pastiglie</span><b>€ ${fmt(R.svc)}</b>`
        + `<span class="tot">Dopo, all'Autosalone vale circa</span><b class="tot" style="color:var(--lime)">€ ${fmt(R.after)}</b><span>Ci guadagni (o ci perdi)</span><b style="color:${R.profit >= 0 ? 'var(--lime)' : 'var(--crit)'}">${R.profit >= 0 ? '+' : '−'} € ${fmt(Math.abs(R.profit))}</b></div>`;
      const b = document.createElement('button'); b.type = 'button'; b.className = 'kbtn'; b.textContent = `Comprala · € ${fmt(W.price)}`; b.disabled = g.s.money < W.price;
      b.addEventListener('click', () => done(g.jkBuyWreck())); d.appendChild(b); wrap.appendChild(d);
    }
    // pezzi usati
    const stock = g.jkStock(n);
    h(`Pezzi usati per la tua ${CARS[g.car].short || CARS[g.car].name}`);
    if (!stock.length) p('Per la tua auto oggi non c\'è niente.');
    for (const s of stock) {
      const r = document.createElement('div'); r.className = 'jk-part' + (s.rare ? ' rare' : '');
      r.innerHTML = `<div><b>${s.rare ? '★ ' : ''}${esc(s.name)}</b><small>${esc(s.label)} · nuovo <s>€ ${fmt(s.full)}</s>${s.rare ? ' · raro' : ''}</small></div>`;
      const b = document.createElement('button'); b.type = 'button'; b.className = 'kbtn'; b.textContent = `€ ${fmt(s.price)}`; b.disabled = g.s.money < s.price;
      b.addEventListener('click', () => done(g.jkBuyPart(s.cat, s.id))); r.appendChild(b); wrap.appendChild(r);
    }
    p('I pezzi diventano tuoi: Luca te li monta senza farti pagare il pezzo.');
    // rottamare
    const mine = g.s.vg.garage.filter((id) => id !== g.car);
    if (mine.length) {
      h('Rottama un\'auto');
      for (const id of mine) {
        const c = g.dlCanSell(id), val = g.jkScrapValue(id), dv = g.dlValue(id);
        const r = document.createElement('div'); r.className = 'jk-part';
        r.innerHTML = `<div><b>${esc(CARS[id].name)}</b><small>Nella pressa: € ${fmt(val)} · all'Autosalone ne prenderesti € ${fmt(dv)}${c.ok ? '' : ' · ' + esc(c.why)}</small></div>`;
        const b = document.createElement('button'); b.type = 'button'; b.className = 'kbtn'; b.textContent = 'Rottama'; b.disabled = !c.ok;
        b.addEventListener('click', () => { if (!confirm(`Rottamare la ${CARS[id].name} per € ${fmt(val)}?`)) return; done(g.jkScrap(id)); }); r.appendChild(b); wrap.appendChild(r);
      }
    }
    body.appendChild(wrap);
  }
  window.NightJunk = { panel };

  // ---------------------------------------------------------------- facciata sulla strada
  if (typeof Street2D === 'undefined') return;
  const S = Street2D.prototype, prev = S.drawTripPlace;
  S.drawTripPlace = function (g, e, x, st, near, open) {
    if (e.id !== 'junk') return prev ? prev.call(this, g, e, x, st, near, open) : false;
    // piazzale recintato di notte: gru col magnete, pile di carcasse vere (i disegni delle auto, ingialliti e schiacciati),
    // lamiera ondulata col filo spinato, cancello a rete che scorre, ufficio in un container, bidone col fuoco, faro sul palo
    const C = this.C, ink = C.ink, t = st.t || 0, gy = 216, X = Math.round(x), L = X - 150, Rr = X + 172, orange = '#e0874a';
    const n = 1 - (this.day || 0), rnd = Street2D.rnd, seed = Math.round(e.x) % 953;
    const POOL = ['panda', 'punto', 'corsa', 'polo', 'golf', 'clio', 'a80', 'p205', 'p206', 'taxi', 'v40', 'e30', 'r5', 'a112', 'panda141', 'ax', 'twingo'].filter((id) => typeof CARS !== 'undefined' && CARS[id] && CARS[id].sprite);
    const wreck = (i) => this.lcWreck && POOL.length ? this.lcWreck(POOL[(seed + i * 5) % POOL.length]) : null;
    // un'auto schiacciata: lo stesso disegno, alto la metà
    const crushed = (c, cx, by, k, sq) => { if (!c) return; const w = c.width * k, h = c.height * k * sq; g.drawImage(c, Math.round(cx - w / 2), Math.round(by - h), Math.round(w), Math.round(h)); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(Math.round(cx - w / 2), Math.round(by - 2), Math.round(w), 2); };
    this.lcYard && this.lcYard(g, X - 28, 96);
    // faro sul palo a sinistra, col cono di luce
    const fx = L + 6;
    g.fillStyle = ink; g.fillRect(fx, 102, 4, gy - 102); g.fillRect(fx, 100, 22, 4); g.fillStyle = n > 0.15 ? '#f4f0d8' : '#9a9888'; g.fillRect(fx + 16, 104, 9, 3);
    if (n > 0.15) { g.save(); g.globalCompositeOperation = 'lighter'; const cg = g.createLinearGradient(0, 107, 0, gy); cg.addColorStop(0, `rgba(255,240,200,${0.2 * n})`); cg.addColorStop(1, 'rgba(255,240,200,0)');
      g.fillStyle = cg; g.beginPath(); g.moveTo(fx + 16, 107); g.lineTo(fx + 25, 107); g.lineTo(fx + 80, gy); g.lineTo(fx - 20, gy); g.closePath(); g.fill(); g.restore(); }
    // gru: torre a traliccio, cabina, braccio verso sinistra, contrappeso, cavo e magnete con una carcassa
    const tx = X + 128, top = 98, arm = 168;
    g.fillStyle = ink; g.fillRect(tx - 7, top, 14, gy - top);
    g.fillStyle = '#c8a020'; g.fillRect(tx - 6, top, 2, gy - top); g.fillRect(tx + 4, top, 2, gy - top);
    for (let y = top + 2; y < gy - 4; y += 10) { g.fillStyle = '#c8a020'; for (let q = 0; q < 10; q++) { g.fillRect(tx - 4 + q, y + q, 1, 1); g.fillRect(tx + 4 - q, y + q, 1, 1); } g.fillRect(tx - 4, y, 8, 1); }
    g.fillStyle = ink; g.fillRect(tx - arm, top - 4, arm + 44, 7); g.fillStyle = '#c8a020'; g.fillRect(tx - arm, top - 3, arm + 42, 5); g.fillStyle = '#8a6a10'; for (let q = tx - arm; q < tx + 40; q += 8) g.fillRect(q, top - 3, 1, 5);
    this.lcBox ? this.lcBox(g, tx + 26, top + 3, 16, 12, '#7a7470') : 0; g.fillStyle = '#5a5450'; g.fillRect(tx + 26, top + 8, 16, 1);   // contrappeso
    this.lcBox ? this.lcBox(g, tx - 12, top + 4, 14, 12, '#c8a020') : 0; g.fillStyle = n > 0.15 ? '#ffe2a0' : '#6a7a90'; g.fillRect(tx - 10, top + 6, 8, 5);   // cabina
    if (n > 0.15) this.light(g, tx - 6, top + 8, 8, 6, '#ffd9a0', 0.1 * n, 2);
    g.fillStyle = Math.floor(t * 1.5) % 2 ? '#ff3a2a' : '#5a1a14'; g.fillRect(tx - arm, top - 7, 3, 3);   // luce rossa in punta
    if (n > 0.15 && Math.floor(t * 1.5) % 2) this.light(g, tx - arm + 1, top - 6, 6, 6, '#ff3a2a', 0.18 * n, 2);
    const hx = X + 70, sw = Math.sin(t * 0.6) * 0.12, len = 44, mx = hx + Math.sin(sw) * len, my = top + 3 + Math.cos(sw) * len;
    g.strokeStyle = '#8a8f9e'; g.lineWidth = 1; g.beginPath(); g.moveTo(hx, top + 3); g.lineTo(mx, my); g.stroke();
    g.fillStyle = ink; g.fillRect(Math.round(mx) - 10, Math.round(my), 20, 6); g.fillStyle = '#5a5e6e'; g.fillRect(Math.round(mx) - 9, Math.round(my) + 1, 18, 4);
    crushed(wreck(9), mx, my + 6 + 13, 0.3, 0.55);
    // pile di carcasse schiacciate dietro la recinzione
    for (const [px, nn, k0] of [[L + 44, 4, 0], [X - 34, 3, 4]]) for (let q = 0; q < nn; q++) crushed(wreck(k0 + q), px + (q % 2 ? 5 : -4), gy - 44 - q * 13, 0.3, 0.45);
    // recinzione di lamiera ondulata con la ruggine che cola e il filo spinato
    const fT = gy - 48, gW = 64, gL = X - 28 - gW / 2;
    g.fillStyle = ink; g.fillRect(L - 2, fT - 2, Rr - L + 4, gy - fT + 2);
    for (let q = L; q < Rr; q += 4) { const sh = (q / 4) % 2; g.fillStyle = sh ? '#5a5248' : '#6a6258'; g.fillRect(q, fT, 4, gy - fT); }
    for (let k = 0; k < 18; k++) { const rx = L + Math.floor(rnd(seed + k) * (Rr - L - 6)), ry = fT + Math.floor(rnd(seed + k * 3) * 16); g.fillStyle = 'rgba(140,66,26,.45)'; g.fillRect(rx, ry, 2 + (k % 3), 8 + Math.floor(rnd(k + 1) * 24)); }
    for (let q = L; q < Rr; q += 46) { g.fillStyle = ink; g.fillRect(q, fT - 8, 2, 10); }
    g.fillStyle = '#8a8f9e'; for (let q = L; q < Rr; q++) { const y = fT - 5 + Math.round(Math.sin(q * 0.55) * 2); g.fillRect(q, y, 1, 1); if (q % 7 === 0) g.fillRect(q, y - 1, 1, 3); }
    // copricerchi inchiodati sulla lamiera
    for (let q = 0; q < 5; q++) { const cx = L + 18 + q * 15, cy = fT + 14 + (q % 2) * 6; g.fillStyle = ink; this.span(g, cx, cy, 6, 6); g.fillStyle = ['#c9ced6', '#9aa0aa', '#d9a82e', '#c9ced6', '#7a808a'][q]; this.span(g, cx, cy, 5, 5); g.fillStyle = 'rgba(0,0,0,.4)'; this.span(g, cx + 1, cy + 1, 2, 2); g.fillStyle = '#fff'; g.fillRect(cx - 3, cy - 3, 1, 1); }
    this.lcBox ? this.lcBox(g, L + 26, fT + 30, 40, 13, '#e8dcc0') : 0; this.text(g, 'ATTENTI', L + 32, fT + 32, '#b02a1a'); this.text(g, 'AL CANE', L + 32, fT + 38, '#2a2420');
    // cancello a rete che scorre: dietro si vede il piazzale con una carcassa intera
    g.fillStyle = '#1e1a16'; g.fillRect(gL, fT, gW, gy - fT);
    if (n > 0.15) this.light(g, gL + gW / 2, gy - 10, gW * 0.5, 10, '#ffe0a0', 0.05 * n, 2);
    { const c = wreck(2); if (c) { const k = 0.32; g.save(); g.beginPath(); g.rect(gL, fT, gW, gy - fT); g.clip(); g.drawImage(c, Math.round(gL + gW / 2 - c.width * k / 2), Math.round(gy - 3 - c.height * k), Math.round(c.width * k), Math.round(c.height * k)); g.restore(); } }
    const oh = Math.round(gW * 0.9 * open), gx = gL + oh;
    g.save(); g.beginPath(); g.rect(gL, fT, gW, gy - fT); g.clip();
    g.fillStyle = ink; g.fillRect(gx, fT, gW, 2); g.fillRect(gx, gy - 2, gW, 2); g.fillRect(gx, fT, 2, gy - fT); g.fillRect(gx + gW - 2, fT, 2, gy - fT); g.fillRect(gx + gW / 2 - 1, fT, 2, gy - fT);
    g.fillStyle = 'rgba(150,156,170,.55)'; for (let q = -48; q < gW; q += 5) for (let y = 0; y < 48; y += 1) { const a = gx + q + y, b = gx + q + 48 - y; if (a > gx && a < gx + gW) g.fillRect(a, fT + y, 1, 1); if (y % 2 === 0 && b > gx && b < gx + gW) g.fillRect(b, fT + y, 1, 1); }
    g.restore();
    // insegna dipinta su compensato, su due pali, con la lampada a collo d'oca
    const sL = X - 82, sT = fT - 40;
    g.fillStyle = ink; g.fillRect(sL + 10, sT + 26, 3, fT - sT - 26); g.fillRect(sL + 86, sT + 26, 3, fT - sT - 26);
    this.lcBox ? this.lcBox(g, sL, sT, 100, 27, '#e2d4b4') : 0; g.fillStyle = '#c8b894'; for (let q = sT + 4; q < sT + 27; q += 5) g.fillRect(sL, q, 100, 1);
    this.text(g, 'SFASCIO', sL + 8, sT + 4, '#b02a1a', 2); this.text(g, 'RUGGINE', sL + 64, sT + 10, '#2a2420', 1);
    this.text(g, 'PEZZI USATI - CARCASSE', sL + 6, sT + 18, '#4a3a2a', 1);
    for (let q = 0; q < 6; q++) { g.fillStyle = 'rgba(120,56,22,.5)'; g.fillRect(sL + 4 + q * 17, sT + 22 + (q % 2), 2, 4 + (q % 3) * 2); }
    if (this.lcLamp) { this.lcLamp(g, sL + 30, sT - 1, '#ffe2a8', true); this.lcLamp(g, sL + 70, sT - 1, '#ffe2a8', true); }
    // ufficio in un container: lamiera, finestra accesa con le veneziane, porta, scalino, condizionatore
    const oL = X + 22, oW = 76, oT = gy - 40;
    g.fillStyle = ink; g.fillRect(oL - 1, oT - 1, oW + 2, gy - oT + 1);
    for (let q = oL; q < oL + oW; q += 3) { g.fillStyle = (q - oL) % 6 ? '#3a5a4a' : '#2e4a3c'; g.fillRect(q, oT, 3, gy - oT - 2); }
    g.fillStyle = '#4a6a5a'; g.fillRect(oL, oT, oW, 2);
    if (this.lcGlass) this.lcGlass(g, oL + 8, oT + 10, 28, 16, { col: '#ffd9a0', noSpill: true, inside: (g2, x0, y0, w, h) => { for (let yy = y0 + 1; yy < y0 + h; yy += 2) { g2.fillStyle = 'rgba(80,60,40,.5)'; g2.fillRect(x0, yy, w, 1); } } });
    g.fillStyle = ink; g.fillRect(oL + 46, oT + 8, 16, gy - oT - 8); g.fillStyle = '#5a6a5a'; g.fillRect(oL + 47, oT + 9, 14, gy - oT - 9); g.fillStyle = '#d8b040'; g.fillRect(oL + 58, oT + 22, 2, 2);
    g.fillStyle = ink; g.fillRect(oL + 44, gy - 3, 20, 3); this.text(g, 'UFFICIO', oL + 6, oT + 30, '#e8e6df');
    if (this.lcLamp) this.lcLamp(g, oL + 54, oT + 4);
    this.lcBox ? this.lcBox(g, oL + oW - 12, oT + 8, 10, 8, '#8a8c94') : 0;
    // pila di gomme e bidone col fuoco
    for (let q = 0; q < 4; q++) { g.fillStyle = ink; g.fillRect(Rr - 54, gy - 7 - q * 7, 22, 7); g.fillStyle = '#1b1b20'; g.fillRect(Rr - 53, gy - 6 - q * 7, 20, 5); g.fillStyle = '#34343c'; g.fillRect(Rr - 53, gy - 6 - q * 7, 20, 1); }
    const bx = Rr - 14;
    g.fillStyle = ink; g.fillRect(bx - 8, gy - 22, 16, 22); g.fillStyle = '#4a4a4a'; g.fillRect(bx - 7, gy - 21, 14, 20); g.fillStyle = '#3a3a3a'; g.fillRect(bx - 7, gy - 15, 14, 1); g.fillRect(bx - 7, gy - 8, 14, 1);
    for (let k = 0; k < 5; k++) { const f = Math.sin(t * 9 + k * 1.7); g.fillStyle = k % 2 ? '#ffb000' : '#ff5a1e'; g.fillRect(bx - 6 + k * 3, gy - 26 - Math.round(4 + f * 3), 2, Math.round(4 + f * 3)); }
    for (let k = 0; k < 4; k++) { const ph = (t * 0.8 + k * 0.29) % 1; g.fillStyle = `rgba(255,${150 + k * 20},60,${1 - ph})`; g.fillRect(Math.round(bx - 2 + Math.sin(k * 3 + t * 2) * 4), Math.round(gy - 30 - ph * 30), 1, 1); }
    this.light(g, bx, gy - 26, 60, 40, '#ff7a1e', 0.12 + 0.04 * Math.sin(t * 7), 3);
    this.placeTag(g, X - 28, fT + 6, 'SFASCIO', orange, near);
    return true;
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { JK });
