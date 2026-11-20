// ============================================================================
//  Night Run · Joystick, volante e pedali (dopo tasti.js, prima di menu.js)
//  Prima il gioco leggeva solo il PRIMO dispositivo collegato e presumeva la mappa «standard» (pad Xbox). Con più dispositivi
//  (cambio a H, pedali, pad) prendeva quello sbagliato, e un volante o un joystick non standard non rispondeva.
//  Adesso: i comandi si assegnano premendo/muovendo il controllo giusto, ciascuno può stare su un dispositivo diverso
//  (pedali su uno, cambio a H su un altro, pad su un terzo), i pedali si calibrano (riposo → a fondo). Quello che non
//  assegni lo fa il pad standard come prima (il primo con mappa «standard»). Salvato nel browser (`localStorage` `nr_pad`).
//  Parte pura (provata in test/joystick.test.js): padPoll, padLearnStart, padLearnStep. Parte grafica: finestra Joystick
//  (Impostazioni → Comandi) e window.nightPad.
// ============================================================================
// azioni: id, nome, tipo (a = analogica 0..1, s = sterzo −1..1, d = pulsante)
const PAD_AZIONI = [
  ['gas', 'Gas', 'a'], ['freno', 'Freno', 'a'], ['frizione', 'Frizione', 'a'], ['sterzo', 'Sterzo (gira tutto a destra)', 's'],
  ['su', 'Marcia su (automatico: leva verso D)', 'd'], ['giu', 'Marcia giù (automatico: leva verso P)', 'd'], ['avvio', 'Avviamento (tieni premuto)', 'd'],
  ['g1', 'Cambio a H: 1ª', 'd'], ['g2', 'Cambio a H: 2ª', 'd'], ['g3', 'Cambio a H: 3ª', 'd'], ['g4', 'Cambio a H: 4ª', 'd'], ['g5', 'Cambio a H: 5ª', 'd'], ['g6', 'Cambio a H: 6ª', 'd'],
  ['gr', 'Cambio a H: retromarcia', 'd'],
];
const PAD_GEARS = [['g1', 1], ['g2', 2], ['g3', 3], ['g4', 4], ['g5', 5], ['g6', 6], ['gr', -1]];

const padClamp = (x, a, b) => Math.max(a, Math.min(b, x));
// valore grezzo di un controllo (pulsante: 0..1; asse: come lo dà il browser)
function padRaw(p, b) {
  if (!p) return null;
  if (b.k === 'b') return p.buttons[b.i] ? p.buttons[b.i].value : 0;
  return p.axes[b.i] === undefined ? null : p.axes[b.i];
}
// posizione 0..1 tra riposo e fondo (i pedali di solito riposano a −1 o a 1 e vanno dall'altra parte)
function padPos(x, b) {
  if (x == null) return 0;
  if (b.k === 'b') return padClamp(x, 0, 1);
  const r = b.rest == null ? -1 : b.rest, f = b.full == null ? 1 : b.full, d = f - r;
  return Math.abs(d) < 0.05 ? 0 : padClamp((x - r) / d, 0, 1);
}
const padFind = (pads, id) => pads.find((p) => p && p.connected && p.id === id);
const padLista = (pads) => Array.from(pads || []).filter((p) => p && p.connected);

// il pad «di serie»: solo il primo con mappa standard (Xbox e simili). Un dispositivo non standard (cambio a H, pedali, volante, joystick
// strani) non fa niente finché non assegni i suoi comandi: i suoi pulsanti sono numerati a modo loro e darebbero gas e freno a caso
function padStd(list) {
  return list.find((p) => p.mapping === 'standard') || null;
}

// Legge tutto in un colpo. bind = assegnazioni salvate (id azione → { id (dispositivo), k: 'b'|'a', i, rest?, full? }).
// st = stato tra una lettura e l'altra ({ prev: {} } per i fronti). Dà: thr, brake, clutch (0..1), steer (+1 = sinistra, come il gioco),
// up/down (un solo istante), start (finché è premuto), gear (marcia scelta dal cambio a H: −1..6, 0 = folle; undefined se non ce n'è uno).
function padPoll(pads, bind, st) {
  const list = padLista(pads), std = padStd(list), out = { thr: 0, brake: 0, clutch: 0, steer: 0, up: false, down: false, start: false, gear: undefined };
  const pr = st.prev || (st.prev = {});
  const edge = (key, now) => { const was = !!pr[key]; pr[key] = now; return now && !was; };
  const bound = (id) => bind && bind[id] && padFind(list, bind[id].id);
  const ana = (id, defIdx) => {
    if (bind && bind[id]) { const p = padFind(list, bind[id].id); return p ? padPos(padRaw(p, bind[id]), bind[id]) : 0; }
    return std && std.buttons[defIdx] ? std.buttons[defIdx].value : 0;
  };
  const dig = (id, defIdx) => {
    if (bind && bind[id]) { const p = padFind(list, bind[id].id); return p ? padPos(padRaw(p, bind[id]), bind[id]) > 0.6 : false; }
    return std ? defIdx.some((i) => std.buttons[i] && std.buttons[i].value > 0.5) : false;
  };
  out.thr = ana('gas', 7); out.brake = ana('freno', 6); out.clutch = ana('frizione', 1);
  if (bind && bind.sterzo) {
    const b = bind.sterzo, p = padFind(list, b.id);
    if (p) {
      const x = padRaw(p, b), c = b.rest == null ? 0 : b.rest, f = b.full == null ? 1 : b.full, d = f - c;
      let s = Math.abs(d) < 0.05 || x == null ? 0 : padClamp((x - c) / d, -1, 1);
      if (Math.abs(s) < 0.08) s = 0;
      out.steer = -s;                                       // «a destra» assegnato = steer negativo, come l'asse 0 del pad
    }
  } else if (std) {
    const bt = (i) => (std.buttons[i] ? std.buttons[i].value : 0), a0 = std.axes[0] || 0;
    out.steer = (bt(14) > 0.5 ? 1 : 0) - (bt(15) > 0.5 ? 1 : 0) - (Math.abs(a0) > 0.15 ? a0 : 0);
  }
  if (edge('su', dig('su', [0, 5]))) out.up = true;
  if (edge('giu', dig('giu', [2, 4]))) out.down = true;
  out.start = dig('avvio', [3]);
  const gb = PAD_GEARS.filter(([id]) => bound(id));
  if (gb.length) { out.gear = 0; for (const [id, n] of gb) { const b = bind[id], p = padFind(list, b.id); if (p && padPos(padRaw(p, b), b) > 0.6) out.gear = n; } }
  return out;
}

// ---- assegnare un comando: si guarda cosa si muove di più rispetto a quando si è cominciato
function padSnap(pads) {
  const o = {};
  for (const p of padLista(pads)) o[p.id] = { b: p.buttons.map((x) => x.value), a: p.axes.slice() };
  return o;
}
function padLearnStart(pads, tipo, t) { return { tipo, base: padSnap(pads), t0: t, cand: null, tDet: 0 }; }
// da chiamare a ogni giro; dà { done, bind?, hint }. Pulsanti: il primo premuto. Pedali e sterzo: il controllo che si muove di più (> 0,5),
// poi si tiene la posizione estrema per mezzo secondo (riposo = valore all'inizio, fondo = il più lontano).
function padLearnStep(ls, pads, t) {
  const list = padLista(pads);
  if (t - ls.t0 > 20000) return { done: false, timeout: true, hint: 'Tempo scaduto.' };
  if (ls.tipo === 'd') {
    for (const p of list) {
      const base = ls.base[p.id]; if (!base) { ls.base[p.id] = { b: p.buttons.map(() => 0), a: p.axes.slice() }; continue; }
      for (let i = 0; i < p.buttons.length; i++) if (p.buttons[i].value > 0.6 && (base.b[i] || 0) < 0.3) return { done: true, bind: { id: p.id, k: 'b', i } };
    }
    return { done: false, hint: 'Premi il pulsante che vuoi usare.' };
  }
  // analogico o sterzo
  if (!ls.cand) {
    let best = null;
    for (const p of list) {
      const base = ls.base[p.id]; if (!base) { ls.base[p.id] = { b: p.buttons.map((x) => x.value), a: p.axes.slice() }; continue; }
      p.axes.forEach((x, i) => { const d = Math.abs(x - (base.a[i] || 0)); if (d > 0.5 && Math.abs(x) <= 1.2 && (!best || d > best.d)) best = { id: p.id, k: 'a', i, rest: base.a[i] || 0, d, v: x }; });
      if (ls.tipo === 'a') p.buttons.forEach((x, i) => { const d = x.value - (base.b[i] || 0); if (d > 0.5 && (!best || d > best.d + 0.2)) best = { id: p.id, k: 'b', i, rest: 0, d, v: x.value }; });
    }
    if (best) { ls.cand = best; ls.tDet = t; }
    return { done: false, hint: ls.tipo === 's' ? 'Gira lo sterzo tutto a DESTRA e tieni.' : 'Premi il pedale (o il pulsante) a fondo e tieni.' };
  }
  const c = ls.cand, p = padFind(list, c.id), x = p ? padRaw(p, c) : null;
  if (x != null && Math.abs(x - c.rest) > Math.abs(c.v - c.rest)) c.v = x;
  if (t - ls.tDet > 600) {
    const bind = c.k === 'b' ? { id: c.id, k: 'b', i: c.i } : { id: c.id, k: 'a', i: c.i, rest: +c.rest.toFixed(3), full: +c.v.toFixed(3) };
    return { done: true, bind };
  }
  return { done: false, hint: 'Tieni ancora un attimo…' };
}

(function joystick() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  let bind = {}, hist = { prev: {} }, box = null, listen = null, raf = 0, open_ = false;
  try { bind = JSON.parse(localStorage.getItem('nr_pad') || '{}') || {}; } catch (e) { bind = {}; }
  const save = () => { try { localStorage.setItem('nr_pad', JSON.stringify(bind)); } catch (e) { /* niente */ } };
  const pads = () => (navigator.getGamepads ? navigator.getGamepads() : []);
  const nome = (id) => String(id).replace(/\s*\(.*$/, '').slice(0, 28);
  const where = (b) => `${nome(b.id)} · ${b.k === 'b' ? 'pulsante' : 'asse'} ${b.i}`;

  // letta dal ciclo del gioco; finestra aperta = il gioco non riceve niente (si sta assegnando)
  function poll() {
    if (open_) return { thr: 0, brake: 0, clutch: 0, steer: 0, up: false, down: false, start: false, gear: undefined };
    return padPoll(pads(), bind, hist);
  }

  const css = `
#padBox { position: fixed; inset: 0; z-index: 80; display: grid; place-items: center; background: rgba(4,4,10,.72); backdrop-filter: blur(3px); }
#padBox[hidden] { display: none; }
#padBox .pb { width: min(780px, calc(100vw - 24px)); max-height: calc(100vh - 32px); overflow: auto; background: #14121c; color: #ece6d6; border: 2px solid #38bdf8; border-radius: 14px; padding: 18px 20px; font: 14px/1.4 system-ui, sans-serif; }
#padBox h2 { margin: 0 0 4px; font: 400 24px/1 var(--f-display, sans-serif); letter-spacing: .06em; color: #7dd3fc; }
#padBox p.hint { margin: 0 0 10px; color: #b8b0a0; font-size: 13px; }
#padBox h4 { margin: 14px 0 6px; font: 600 12px/1 var(--f-data, monospace); letter-spacing: .12em; text-transform: uppercase; color: #ffd27a; }
#padBox .dv { font: 12px/1.5 var(--f-data, monospace); color: #9fb; padding: 6px 8px; background: #1e1b28; border-radius: 8px; margin: 3px 0; }
#padBox .dv small { color: #8a8478; }
#padBox .pr { display: grid; grid-template-columns: 1fr 120px 86px 28px; gap: 8px; align-items: center; padding: 5px 8px; background: #1e1b28; border-radius: 8px; margin: 3px 0; }
#padBox .pr .w { color: #8a8478; font: 11px/1.2 var(--f-data, monospace); }
#padBox .pr .m { height: 8px; background: #2a2636; border-radius: 4px; overflow: hidden; } #padBox .pr .m i { display: block; height: 100%; width: 0; background: #b8ff3a; }
#padBox .pr button { padding: 5px 8px; border: 1px solid #4a4458; border-bottom-width: 3px; border-radius: 7px; background: #2a2636; color: #fff; font: 700 12px/1 var(--f-data, monospace); cursor: pointer; }
#padBox .pr button.ask { background: #38bdf8; color: #06121a; animation: tbp .8s infinite alternate; }
#padBox .pr button.x { padding: 4px 6px; color: #ff7a6a; }
#padBox .msg { min-height: 1.3em; color: #7dd3fc; font-size: 13px; margin: 8px 0 0; }
#padBox .bar { display: flex; gap: 8px; justify-content: flex-end; margin-top: 14px; }
#padBox .bar button { padding: 8px 14px; border-radius: 8px; border: 0; font: 600 14px/1 system-ui; cursor: pointer; background: #2a2636; color: #ece6d6; } #padBox .bar .ok { background: #38bdf8; color: #06121a; }`;

  function render() {
    if (!box) return;
    const list = padLista(pads()), std = padStd(list);
    let h = '<div class="pb" role="dialog" aria-label="Joystick"><h2>JOYSTICK, VOLANTE E PEDALI</h2><p class="hint">Tocca «Assegna» di un comando e premi o muovi il controllo giusto, su qualunque dispositivo (Esc annulla). I pedali si calibrano: lasciali a riposo, poi premi a fondo e tieni. Se non vedi il tuo dispositivo premi un suo pulsante.</p><h4>Dispositivi collegati</h4>';
    h += list.length ? list.map((p) => `<div class="dv">${p.id}<br><small>${p.mapping === 'standard' ? 'pad standard' + (p === std ? ' · usato di serie per i comandi non assegnati' : '') : 'non standard'} · ${p.buttons.length} pulsanti · ${p.axes.length} assi</small></div>`).join('') : '<div class="dv">Nessuno. Premi un pulsante del joystick con questa finestra in primo piano.</div>';
    h += '<h4>Comandi</h4>';
    for (const [id, label, tipo] of PAD_AZIONI) {
      const b = bind[id];
      h += `<div class="pr" data-id="${id}"><span>${label}<br><span class="w">${b ? where(b) : (/^g[1-6r]$/.test(id) ? 'non assegnato' : std ? 'pad standard (di serie)' : 'non assegnato')}</span></span><span class="m">${tipo === 'd' ? '' : '<i></i>'}</span>` +
        `<button type="button" data-a="${id}" class="${listen && listen.id === id ? 'ask' : ''}">${listen && listen.id === id ? 'Fai…' : 'Assegna'}</button>${b ? `<button type="button" data-x="${id}" class="x" title="Togli">×</button>` : '<span></span>'}</div>`;
    }
    h += `<p class="msg" id="padMsg">${listen ? 'Premi o muovi…' : ''}</p><div class="bar"><button type="button" class="rs">Ripristina tutto</button><button type="button" class="ok">Fatto</button></div></div>`;
    box.innerHTML = h;
  }
  // indicatori in tempo reale (si aggiornano senza ridisegnare la finestra) e passo dell'assegnazione
  function loop(t) {
    if (!open_) { raf = 0; return; }
    const P = pads();
    if (listen) {
      const r = padLearnStep(listen.st, P, t);
      const msg = box && box.querySelector('#padMsg'); if (msg) msg.textContent = r.hint || '';
      if (r.done) { bind[listen.id] = r.bind; save(); listen = null; render(); }
      else if (r.timeout) { listen = null; render(); }
    }
    if (box && !listen) {
      const st = { prev: {} }, o = padPoll(P, bind, st);
      const set = (id, v) => { const m = box.querySelector(`.pr[data-id="${id}"] .m i`); if (m) m.style.width = Math.round(padClamp(v, 0, 1) * 100) + '%'; };
      set('gas', o.thr); set('freno', o.brake); set('frizione', o.clutch); set('sterzo', Math.abs(o.steer));
    }
    raf = requestAnimationFrame(loop);
  }
  function key(e) {                                           // finestra aperta: i tasti non arrivano al gioco (S è il freno)
    if (!open_) return;
    if (e.type === 'keydown' && e.key === 'Escape') { e.preventDefault(); if (listen) { listen = null; render(); } else close(); }
    else if (e.key !== 'Tab' && e.key !== 'Enter' && e.key !== ' ') e.preventDefault();
    e.stopImmediatePropagation();
  }
  function mount() {
    if (box) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    box = document.createElement('div'); box.id = 'padBox'; box.hidden = true; document.body.appendChild(box);
    box.addEventListener('click', (e) => {
      if (e.target === box) { close(); return; }
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.a) { const az = PAD_AZIONI.find((x) => x[0] === b.dataset.a); listen = { id: az[0], st: padLearnStart(pads(), az[2], performance.now()) }; render(); }
      else if (b.dataset.x) { delete bind[b.dataset.x]; save(); render(); }
      else if (b.classList.contains('rs')) { bind = {}; save(); render(); }
      else if (b.classList.contains('ok')) close();
    });
    window.addEventListener('keydown', key, true); window.addEventListener('keyup', key, true);
    window.addEventListener('gamepadconnected', () => { if (open_) render(); }); window.addEventListener('gamepaddisconnected', () => { if (open_) render(); });
  }
  function open() { mount(); open_ = true; listen = null; hist = { prev: {} }; render(); box.hidden = false; if (!raf) raf = requestAnimationFrame(loop); }
  function close() { open_ = false; listen = null; if (box) box.hidden = true; hist = { prev: {} }; }
  window.nightPad = { open, close, poll, map: () => JSON.parse(JSON.stringify(bind)), reset: () => { bind = {}; save(); } };
})();
