// ============================================================================
//  Night Run · Lo sfasciacarrozze: Sfascio Ruggine (dopo usato.js)
//  Tappa nuova: prende il posto del secondo autogrill di ogni giro (VG_PATTERN[9], primo al km 30,6).
//  Dentro: pezzi usati per l'auto che guidi a meno della metà (Luca te li monta gratis), la carcassa da rimettere in
//  strada (si paga poco, ha tutti i difetti: con Niko, carrozziere e gomme torna a valere all'Autosalone),
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
    this.say(`Carcassa della ${CARS[W.id].name} (− € ${fmt(W.price)}): è nel tuo garage. Niko e il carrozziere ti aspettano.`, 'buy');
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
    p('Il ferrovecchio: «Qui niente garanzia, ma i prezzi sono questi. Il cane non morde.»');
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
        + `<div class="jk-est"><span>Carrozziere</span><b>€ ${fmt(R.body)}</b><span>Revisione del motore (Niko)</span><b>€ ${fmt(R.rev)}</b><span>Gomme nuove</span><b>€ ${fmt(R.tyres)}</b><span>Tagliando, candele, pastiglie</span><b>€ ${fmt(R.svc)}</b>`
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
    const C = this.C, ink = C.ink, t = st.t || 0, gy = 216, L = x - 170, Rr = x + 170, orange = '#e0874a';
    g.fillStyle = '#2a2420'; g.fillRect(x - 40, gy, 80, 16);
    // gru con il magnete che dondola
    const cx = x + 90, top = 70, arm = 120, sw = Math.sin(t * 0.6) * 0.12;
    g.fillStyle = ink; g.fillRect(cx - 4, top, 8, gy - top); g.fillStyle = '#c8a020'; g.fillRect(cx - 3, top, 6, gy - top);
    for (let y = top + 6; y < gy; y += 10) { g.fillStyle = '#8a6a10'; g.fillRect(cx - 3, y, 6, 1); }
    g.fillStyle = ink; g.fillRect(cx - arm, top - 3, arm + 30, 7); g.fillStyle = '#c8a020'; g.fillRect(cx - arm, top - 2, arm + 28, 5);
    const mx = cx - arm + 10 + Math.sin(sw) * 40, my = top + 60;
    g.strokeStyle = '#8a8f9e'; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - arm + 10, top + 3); g.lineTo(mx, my); g.stroke();
    g.fillStyle = ink; g.fillRect(mx - 13, my, 26, 8); g.fillStyle = '#5a5e6e'; g.fillRect(mx - 12, my + 1, 24, 6);
    g.fillStyle = '#6a3a3a'; g.fillRect(mx - 18, my + 8, 36, 12); g.fillStyle = '#4a2a2a'; g.fillRect(mx - 18, my + 14, 36, 2);   // un'auto schiacciata appesa
    // pile di auto schiacciate dietro la recinzione
    const cols = ['#6a3a3a', '#3a4a6a', '#5a5a3a', '#4a5a5a', '#6a5a4a', '#3a3a4a', '#7a4a2a'];
    for (let p = 0; p < 3; p++) for (let k = 0; k < 5 - p; k++) {
      const bx = L + 14 + p * 70 + (k % 2) * 6, by = gy - 64 - k * 13;
      g.fillStyle = ink; g.fillRect(bx - 1, by - 1, 58, 14); g.fillStyle = cols[(p * 5 + k) % cols.length]; g.fillRect(bx, by, 56, 12);
      g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(bx, by + 8, 56, 4); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(bx + 8, by + 2, 10, 2);
    }
    // recinzione di lamiera ondulata col cancello
    g.fillStyle = ink; g.fillRect(L - 2, gy - 52, Rr - L + 4, 52);
    for (let q = L; q < Rr; q += 4) { g.fillStyle = (q / 4) % 2 ? '#5a5248' : '#6a6258'; g.fillRect(q, gy - 50, 4, 50); }
    for (let k = 0; k < 9; k++) { g.fillStyle = 'rgba(140,70,30,.45)'; g.fillRect(L + ((k * 53) % (Rr - L - 20)), gy - 50 + ((k * 17) % 40), 6 + (k % 3) * 4, 4 + (k % 2) * 6); }   // ruggine
    const gW = 70, gL = x - 30 - gW / 2, oh = Math.round(gW / 2 * open);
    g.fillStyle = '#1a1612'; g.fillRect(gL, gy - 48, gW, 48);
    g.fillStyle = '#3a342c'; g.fillRect(gL, gy - 48, gW / 2 - oh, 48); g.fillRect(gL + gW / 2 + oh, gy - 48, gW / 2 - oh, 48);
    for (let q = 0; q < 6; q++) { g.fillStyle = '#2a2420'; g.fillRect(gL + 2 + q * 6, gy - 46, 1, 44); }
    // insegna dipinta a mano
    g.fillStyle = ink; g.fillRect(x - 76, gy - 82, 92, 26); g.fillStyle = '#e8dcc0'; g.fillRect(x - 75, gy - 81, 90, 24);
    this.text(g, 'SFASCIO', x - 70, gy - 78, '#b02a1a', 2); this.text(g, 'RUGGINE', x - 54, gy - 65, '#2a2420', 1);
    // bidone col fuoco e il lampione
    const bx = Rr - 30;
    g.fillStyle = ink; g.fillRect(bx - 8, gy - 22, 16, 22); g.fillStyle = '#4a4a4a'; g.fillRect(bx - 7, gy - 21, 14, 20);
    for (let k = 0; k < 5; k++) { const f = Math.sin(t * 9 + k * 1.7); g.fillStyle = k % 2 ? '#ffb000' : '#ff5a1e'; g.fillRect(bx - 6 + k * 3, gy - 26 - Math.round(4 + f * 3), 2, Math.round(4 + f * 3)); }
    this.light(g, bx, gy - 26, 60, 40, '#ff7a1e', 0.12 + 0.04 * Math.sin(t * 7), 3);
    g.fillStyle = ink; g.fillRect(L + 4, 90, 4, gy - 90); g.fillRect(L + 4, 88, 20, 5); g.fillStyle = '#f4f0d8'; g.fillRect(L + 18, 92, 8, 3);
    g.save(); g.globalCompositeOperation = 'lighter'; const cg = g.createLinearGradient(0, 95, 0, gy); cg.addColorStop(0, 'rgba(255,240,200,.18)'); cg.addColorStop(1, 'rgba(255,240,200,0)');
    g.fillStyle = cg; g.beginPath(); g.moveTo(L + 18, 95); g.lineTo(L + 26, 95); g.lineTo(L + 70, gy); g.lineTo(L - 20, gy); g.fill(); g.restore();
    this.placeTag(g, x, gy - 104, 'SFASCIO', orange, near);
    return true;
  };
})();
if (typeof window !== 'undefined') Object.assign(window, { JK });
