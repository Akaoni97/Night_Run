// ============================================================================
//  Night Run · I traguardi (dopo valigette.js)
//  Cose da fare nel Viaggio, controllate mentre giochi: lavori, chilometri, sfide, velocità, freni roventi, scia,
//  finestrini giù in galleria, valigette, garage... Ognuno dà un premio (soldi o una valigetta). Quando ne sblocchi
//  uno scende un avviso dall'alto con un suono. Nel telefono c'è l'app Traguardi con la lista e i progressi.
//  Stato in game.s.ach. L'elenco è TRG_LIST (facile da allungare: id, nome, testo, premio, check).
//  check(g, c) → true quando è fatto, oppure [quanto, su quanto] per la barra; c = contatori e dati del momento.
// ============================================================================
const TRG_LIST = [
  { id: 'primo', name: 'Primo lavoro', text: 'Consegna il pacco del primo lavoro.', prize: { cassa: 'bronzo' }, check: (g) => !!(g.s.vg && g.s.vg.firstDone) },
  { id: 'corriere', name: 'Corriere', text: 'Fai 10 consegne.', prize: { soldi: 1500 }, check: (g) => [g.s.vg ? g.s.vg.jobs || 0 : 0, 10] },
  { id: 'fiducia', name: 'Uomo di fiducia', text: 'Completa 3 lavori della catena.', prize: { cassa: 'argento' }, check: (g) => [g.s.vg ? g.s.vg.misDone || 0 : 0, 3] },
  { id: 'maino', name: 'Quello che non dice di no', text: 'Completa 6 lavori della catena.', prize: { cassa: 'oro' }, check: (g) => [g.s.vg ? g.s.vg.misDone || 0 : 0, 6] },
  { id: 'km10', name: 'Fuori città', text: 'Percorri 10 km di viaggio.', prize: { soldi: 300 }, check: (g) => [Math.floor((g.s.dist || 0) / 1000), 10] },
  { id: 'km50', name: 'Mezza notte di strada', text: 'Percorri 50 km di viaggio.', prize: { cassa: 'bronzo' }, check: (g) => [Math.floor((g.s.dist || 0) / 1000), 50] },
  { id: 'km100', name: 'Cento', text: 'Percorri 100 km di viaggio.', prize: { cassa: 'argento' }, check: (g) => [Math.floor((g.s.dist || 0) / 1000), 100] },
  { id: 'km250', name: 'Senza fine', text: 'Percorri 250 km di viaggio.', prize: { cassa: 'oro' }, check: (g) => [Math.floor((g.s.dist || 0) / 1000), 250] },
  { id: 'sfida1', name: 'Abbagliato', text: 'Vinci una sfida lanciata con gli abbaglianti.', prize: { soldi: 500 }, check: (g) => [g.streetRep ? g.streetRep().w : 0, 1] },
  { id: 'sfida10', name: 'Re della corsia', text: 'Vinci 10 sfide.', prize: { cassa: 'argento' }, check: (g) => [g.streetRep ? g.streetRep().w : 0, 10] },
  { id: 'valig1', name: 'Curioso', text: 'Apri la prima valigetta.', prize: { soldi: 300 }, check: (g) => [g.s.cases ? g.s.cases.opened : 0, 1] },
  { id: 'epico', name: 'Viola', text: 'Trova un premio epico o migliore in una valigetta.', prize: { cassa: 'argento' }, check: (g) => !!(g.s.cases && g.s.cases.log.some((l) => l.rar >= 3)) },
  { id: 'legg', name: 'Leggenda', text: 'Trova un premio leggendario.', prize: { soldi: 10000 }, check: (g) => !!(g.s.cases && g.s.cases.log.some((l) => l.rar >= 5)) },
  { id: 'garage', name: 'Collezionista', text: 'Abbi 3 mezzi nel garage del motel.', prize: { cassa: 'argento' }, check: (g) => [g.s.vg ? g.s.vg.garage.length : 1, 3] },
  { id: 'v200', name: 'Duecento', text: 'Raggiungi i 200 km/h.', prize: { cassa: 'bronzo' }, check: (g, c) => [Math.floor(c.maxKmh || 0), 200] },
  { id: 'v250', name: 'Muro del suono', text: 'Raggiungi i 250 km/h.', prize: { cassa: 'argento' }, check: (g, c) => [Math.floor(c.maxKmh || 0), 250] },
  { id: 'rovente', name: 'Ferro rovente', text: 'Porta i dischi dei freni oltre i 600 °C.', prize: { soldi: 800 }, check: (g) => g.sim.brakeT > 600 },
  { id: 'bloccate', name: 'Vecchia scuola', text: 'Blocca le ruote sopra i 100 km/h, con un\'auto senza ABS.', prize: { soldi: 800 }, check: (g) => g.sim.locked && g.sim.kmh > 100 },
  { id: 'scia', name: 'Aspirato', text: 'Resta in scia a qualcuno per 20 secondi di fila.', prize: { cassa: 'bronzo' }, check: (g, c) => [Math.floor(c.draftT || 0), 20] },
  { id: 'capelli', name: 'Capelli al vento', text: 'Finestrini giù sopra i 150 km/h.', prize: { soldi: 500 }, check: (g) => g.sim.winPos > 0.9 && g.sim.kmh > 150 },
  { id: 'galleria', name: 'Sinfonia in galleria', text: 'In galleria, finestrini giù e motore vicino al limitatore.', prize: { cassa: 'bronzo' }, check: (g, c) => !!c.tunnel && g.sim.winPos > 0.9 && g.sim.rpm > g.sim.P.limiter - 700 },
  { id: 'pulito', name: 'Senza un graffio', text: 'Percorri 30 km di fila senza un nuovo danno.', prize: { cassa: 'argento' }, check: (g, c) => [Math.floor(c.cleanKm || 0), 30] },
  { id: 'vapori', name: 'Coi vapori', text: 'Guida con meno del 3 % di benzina nel serbatoio.', prize: { soldi: 500 }, check: (g) => g.sim.running && g.sim.fuel < 0.03 && g.sim.kmh > 20 },
  { id: 'ricco', name: 'Tasche piene', text: 'Abbi € 50.000 in contanti.', prize: { cassa: 'argento' }, check: (g) => [Math.floor(g.s.money), 50000] },
  { id: 'motel', name: 'Una notte all\'Ovunque', text: 'Dormi al Motel Ovunque.', prize: { soldi: 300 }, check: (g) => !!(g.s.vg && g.s.vg.sleepAt != null) },
  { id: 'ruota7', name: 'Abitudine', text: 'Gira la ruota 7 giorni di fila.', prize: { cassa: 'argento' }, check: (g) => [g.s.ruota ? g.s.ruota.best || 0 : 0, 7] },
  { id: 'habitue', name: 'Habitué', text: 'Entra in 5 locali diversi.', prize: { cassa: 'bronzo' }, check: (g, c) => [Object.keys(c.places || {}).length, 5] },
];

(function traguardiLogica() {
  if (typeof StreetGame === 'undefined') return;
  const P = StreetGame.prototype;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  P.ach = function () { const s = this.s; return s.ach || (s.ach = { got: {}, c: { maxKmh: 0, draftT: 0, cleanKm: 0, places: {} } }); };
  const done = (r) => (Array.isArray(r) ? r[0] >= r[1] : !!r);
  P.achPrizeText = function (p) { return p.cassa ? `${typeof CASE_TYPES !== 'undefined' ? CASE_TYPES[p.cassa].name : 'Valigetta'}` : `€ ${fmt(p.soldi)}`; };
  // un passo: aggiorna i contatori (dt in secondi; f: { tunnel }) e sblocca quello che è fatto. Ritorna i nuovi.
  P.achStep = function (dt, f = {}) {
    const A = this.ach(), c = A.c, sim = this.sim, out = [];
    if (!this.s.vg || !this.s.vg.on) return out;
    c.maxKmh = Math.max(c.maxKmh || 0, sim.kmh || 0);
    c.draftT = (sim.draft || 0) > 0.15 && sim.kmh > 40 ? (c.draftT || 0) + dt : 0;
    const km = (this.s.dist || 0) / 1000;
    if (c.lastDmg === undefined || sim.damage > c.lastDmg + 0.001) { c.cleanFrom = km; }
    c.lastDmg = sim.damage; c.cleanKm = Math.max(0, km - (c.cleanFrom ?? km));
    if (this.inside && this.inside.id) { c.places = c.places || {}; c.places[this.inside.id] = 1; }
    c.tunnel = !!f.tunnel;
    for (const T of TRG_LIST) {
      if (A.got[T.id]) continue;
      let r; try { r = T.check(this, c); } catch (e) { r = false; }
      if (!done(r)) continue;
      A.got[T.id] = { km: Math.round(km * 10) / 10, at: Date.now() };
      if (T.prize.soldi) this.s.money += T.prize.soldi;
      if (T.prize.cassa && this.caseGrant) this.caseGrant(T.prize.cassa, 'traguardo: ' + T.name);
      out.push(T);
    }
    return out;
  };
  P.achProgress = function (T) { const A = this.ach(); if (A.got[T.id]) return 1; let r; try { r = T.check(this, A.c); } catch (e) { r = false; } return Array.isArray(r) ? Math.max(0, Math.min(1, r[0] / r[1])) : 0; };
})();

// ============================================================================
//  Avviso, app del telefono (solo nel browser)
// ============================================================================
(function traguardiSchermo() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const G = () => window.nightRun && window.nightRun.game;
  const fmt = (n) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: 0 });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // coppa in pixel art (svg, 16×16)
  const CUP = (col = '#ffc63a') => `<svg viewBox="0 0 16 16" width="100%" height="100%" shape-rendering="crispEdges" aria-hidden="true"><path fill="#0a0a10" d="M3 1h10v1h2v4h-1v1h-1v1h-1v1h-1v2h1v1h1v3H3v-3h1v-1h1V9H4V8H3V7H2V6H1V2h2z"/><path fill="${col}" d="M4 2h8v5h-1v1h-1v1H6V8H5V7H4z"/><path fill="#fff6c8" d="M5 3h1v3H5z"/><path fill="${col}" d="M2 3h1v2h1v1H3V5H2zM13 3h1v2h-1v1h-1V5h1zM7 10h2v1h1v1H6v-1h1zM4 13h8v1H4z"/></svg>`;

  // ---------------------------------------------------------------- avviso che scende dall'alto (uno alla volta)
  const queue = []; let showing = false, AC = null;
  const chime = () => {
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state !== 'running') AC.resume(); } catch (e) { return; }
    const t = AC.currentTime;
    [[784, 0], [1047, 0.09], [1319, 0.18], [1568, 0.27]].forEach(([f, d]) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t + d); g.gain.exponentialRampToValueAtTime(0.12, t + d + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.6); o.connect(g); g.connect(AC.destination); o.start(t + d); o.stop(t + d + 0.7); });
  };
  const css = document.createElement('style');
  css.textContent = `
.trg-pop{position:fixed;left:50%;top:14px;z-index:85;display:grid;grid-template-columns:52px 1fr;gap:12px;align-items:center;min-width:min(380px,92vw);max-width:92vw;padding:12px 16px 12px 12px;
  background:linear-gradient(135deg,#221a08,#0c0b08 70%);color:#f4ead2;border-radius:14px;box-shadow:0 0 0 2px #ffc63a,0 0 30px rgba(255,198,58,.45),0 18px 40px rgba(0,0,0,.6);
  transform:translate(-50%,-140%);transition:transform .55s cubic-bezier(.2,1.4,.4,1);overflow:hidden;pointer-events:none;font-family:"Barlow Semi Condensed",system-ui,sans-serif}
.trg-pop.on{transform:translate(-50%,0)}
.trg-pop::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 35%,rgba(255,240,180,.35) 50%,transparent 65%);transform:translateX(-120%);animation:trgshine 1.2s .45s ease-out forwards}
@keyframes trgshine{to{transform:translateX(120%)}}
.trg-pop .cup{width:52px;height:52px;image-rendering:pixelated;filter:drop-shadow(0 0 8px rgba(255,198,58,.7));animation:trgcup 1s ease-in-out infinite}
@keyframes trgcup{50%{transform:translateY(-3px) rotate(-4deg)}}
.trg-pop small{display:block;font:600 11px/1 "Share Tech Mono",monospace;letter-spacing:.14em;color:#ffc63a}
.trg-pop b{display:block;font:400 22px/1.1 "Saira Stencil One","Black Ops One",Impact,sans-serif;margin:3px 0 2px}
.trg-pop span{font-size:13px;color:#d8cfb8}.trg-pop em{font-style:normal;color:#b8ff3a;font-weight:700}
@media (prefers-reduced-motion:reduce){.trg-pop{transition:none}.trg-pop::after,.trg-pop .cup{animation:none}}`;
  document.head.appendChild(css);
  function next() {
    if (showing || !queue.length) return;
    const T = queue.shift(), g = G(); showing = true;
    const el = document.createElement('div'); el.className = 'trg-pop'; el.setAttribute('role', 'status');
    el.innerHTML = `<div class="cup">${CUP()}</div><div><small>TRAGUARDO SBLOCCATO</small><b>${esc(T.name)}</b><span>${esc(T.text)} · premio <em>${esc(g ? g.achPrizeText(T.prize) : '')}</em></span></div>`;
    document.body.appendChild(el); chime();
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('on')));
    setTimeout(() => { el.classList.remove('on'); setTimeout(() => { el.remove(); showing = false; next(); }, 600); }, 4200);
  }

  // ---------------------------------------------------------------- app Traguardi nel telefono
  const UI = { tab: 0 };
  const APPCSS = `
.trg-hd{display:grid;grid-template-columns:44px 1fr;gap:10px;align-items:center;background:linear-gradient(135deg,#2a2008,#14110a);border-radius:16px;padding:10px 12px;margin-bottom:10px;box-shadow:inset 0 0 0 1px #ffc63a55}
.trg-hd .cup{width:44px;height:44px}.trg-hd b{font:800 20px system-ui}.trg-hd small{display:block;color:var(--t2);font-size:11.5px}
.trg-bar{height:6px;border-radius:3px;background:var(--s3);overflow:hidden;margin-top:5px}.trg-bar i{display:block;height:100%;background:linear-gradient(90deg,#ffb347,#ffc63a)}
.trg-it{display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center;padding:9px 6px;border-bottom:1px solid #ffffff12}
.trg-it .cup{width:30px;height:30px;opacity:.25;filter:grayscale(1)}.trg-it.ok .cup{opacity:1;filter:none}
.trg-it b{display:block;font-size:13.5px}.trg-it small{display:block;color:var(--t2);font-size:11.5px}.trg-it .pz{font:700 11px system-ui;color:var(--t2);text-align:right;max-width:76px}
.trg-it.ok .pz{color:#b8ff3a}.trg-it .trg-bar{margin-top:4px;height:4px}`;
  function render() {
    const g = G(); if (!g) return '';
    const A = g.ach(), got = TRG_LIST.filter((T) => A.got[T.id]).length;
    const list = TRG_LIST.filter((T) => UI.tab === 0 ? !A.got[T.id] : !!A.got[T.id]);
    return `<div class="view app"><div class="nav"><h3>Traguardi</h3></div><div class="body">
      <div class="trg-hd"><div class="cup">${CUP()}</div><div><b>${got} / ${TRG_LIST.length}</b><small>traguardi sbloccati</small><div class="trg-bar"><i style="width:${Math.round(got / TRG_LIST.length * 100)}%"></i></div></div></div>
      <div class="tabs"><button data-x="tab" data-v="0" aria-pressed="${UI.tab === 0}">Da fare</button><button data-x="tab" data-v="1" aria-pressed="${UI.tab === 1}">Fatti (${got})</button></div>
      ${list.length ? list.map((T) => { const ok = !!A.got[T.id], p = g.achProgress(T); return `<div class="trg-it ${ok ? 'ok' : ''}"><div class="cup">${CUP(ok ? '#ffc63a' : '#8a8f9e')}</div><div><b>${esc(T.name)}</b><small>${esc(T.text)}</small>${!ok && p > 0 ? `<div class="trg-bar"><i style="width:${Math.round(p * 100)}%"></i></div>` : ''}${ok ? `<small>al km ${String(A.got[T.id].km).replace('.', ',')}</small>` : ''}</div><div class="pz">${esc(g.achPrizeText(T.prize))}</div></div>`; }).join('') : `<p class="cen">${UI.tab === 0 ? 'Li hai fatti tutti.' : 'Ancora nessuno: comincia dal primo lavoro.'}</p>`}
    </div></div>`;
  }
  const add = () => {
    if (!window.telefono || !window.telefono.addApp) return false;
    window.telefono.addApp({ id: 'trg', name: 'Traguardi', color: 'linear-gradient(145deg,#ffd86a,#b8860b)', css: APPCSS,
      icon: '<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M12 14v6"/>',
      render, click: (D) => { if (D.x === 'tab') { UI.tab = +D.v; window.telefono.render(); } } });
    return true;
  };
  if (!add()) addEventListener('load', add);

  // ---------------------------------------------------------------- controllo, 4 volte al secondo
  let last = performance.now();
  setInterval(() => {
    const g = G(), now = performance.now(), dt = Math.min(1, (now - last) / 1000); last = now;
    if (!g || !g.s || !g.sim) return;
    let tunnel = false;
    try { const v = window.nightRun.view2d, d = g.s.dist, T = v && v.tunnelSpan ? v.tunnelSpan(g, d, d) : null; tunnel = !!(T && d > T.a + 4 && d < T.b - 4); } catch (e) { /* vista non pronta */ }
    let nuovi = [];
    try { nuovi = g.achStep(dt, { tunnel }); } catch (e) { return; }
    for (const T of nuovi) queue.push(T);
    next();
  }, 250);

  window.traguardi = { list: TRG_LIST, demo(i = 0) { queue.push(TRG_LIST[i]); next(); } };
})();
if (typeof window !== 'undefined') Object.assign(window, { TRG_LIST });
