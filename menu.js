// ============================================================================
//  Schermata di gioco compatta: la strada riempie la finestra, in alto una barra sottile (soldi, reputazione,
//  ricercato, MENU); tutto il resto (officina, bagagliaio, comandi di guida, vista, quadro, extra,
//  partita) va in un menu a schede che si apre col pulsante MENU o col tasto Tab e si chiude con Esc o Tab.
//  I pannelli non vengono riscritti: si spostano nelle schede, quindi il resto del gioco li trova come prima.
//  Sui telefoni compaiono anche i pedali GAS e FRENO sulla strada.
// ============================================================================
(() => {
  const $ = (id) => document.getElementById(id);
  const q = (sel) => document.querySelector(sel);
  const wrap = q('.wrap'), road = q('section.road'), stage = $('roadStage');
  if (!wrap || !road || !stage) return;
  document.documentElement.classList.add('game');

  // icone delle schede (disegnate a tratto, prendono il colore della scheda)
  const ICO = {
    partita: '<path d="M5 21V4m0 0h11l-2 4 2 4H5"/>',
    garage: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    bagagliaio: '<path d="M3 8l9-4 9 4v9l-9 4-9-4z"/><path d="M3 8l9 4 9-4M12 12v9"/>',
    guida: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.2"/><path d="M3.6 10.5h6.2M14.2 10.5h6.2M12 14.2V20.5"/>',
    vista: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    quadro: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-6"/><circle cx="12" cy="17" r="1.3"/>',
    extra: '<path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  };
  // le schede: nome, titolo, sottotitolo, colore, pezzi della pagina da spostarci
  const TABS = [
    ['partita', 'Partita', 'Il viaggio, l\'auto, le modalità', '#ffb347', () => {
      const sum = document.createElement('div'); sum.className = 'gm-summary'; sum.id = 'gmSummary';
      const box = document.createElement('div'); box.className = 'panel top-moved';
      const h = document.createElement('h2'); h.textContent = 'Modalità e auto'; box.appendChild(h);
      for (const el of [q('.carsel'), $('modeSw'), $('btnNew'), $('audioState')]) if (el) box.appendChild(el);
      const tag = $('carTag'); if (tag) { const p = document.createElement('p'); p.className = 'hint'; p.appendChild(tag); box.appendChild(p); }
      return [sum, box];
    }],
    ['garage', 'Officina', 'Manutenzione, rapporti, pezzi', '#ff7a3a', () => [q('section.tuning')]],
    ['bagagliaio', 'Bagagliaio', 'Quello che porti con te', '#2ee6ff', () => [$('trunkPanel')]],
    ['guida', 'Guida', 'Pedali, cambio, aiuti, limitatore', '#b8ff3a', () => [q('section.deck')]],
    ['vista', 'Vista', 'Grafica, colori, ora e meteo', '#7fd3ff', () => {
      const box = document.createElement('div'); box.className = 'panel';
      const h = document.createElement('h2'); h.textContent = 'Vista e grafica'; box.appendChild(h);
      const rb = q('.roadbar'); if (rb) box.appendChild(rb);
      return [box, q('section.uiprefs')];
    }],
    ['quadro', 'Quadro e dati', 'Strumenti grandi e telemetria', '#b07bff', () => [$('cluster'), q('section.tele')]],
    ['extra', 'Extra', 'Suoni, comandi, note', '#c9c2b0', () => [q('section.extras')]],
  ];

  // messaggi (flash) sopra la strada invece che dentro il quadro grande
  const msg = $('msg'); if (msg) stage.appendChild(msg);

  // il menu di pausa: barra laterale con le schede, testata, contenuto
  const menu = document.createElement('div'); menu.className = 'gamemenu'; menu.id = 'gameMenu'; menu.hidden = true;
  menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true'); menu.setAttribute('aria-labelledby', 'gmTitle');
  menu.innerHTML = '<div class="gm-shell"><aside class="gm-rail"><div class="gm-logo">Night <em>Run</em><small>in pausa</small></div><nav class="gm-tabs" role="tablist" aria-label="Sezioni"></nav>'
    + '<button type="button" class="gm-back" id="gmClose"><b>Torna in strada</b><kbd>Tab</kbd><kbd>Esc</kbd></button></aside>'
    + '<main class="gm-main"><header class="gm-head"><h2 id="gmTitle">Partita</h2><p id="gmSub"></p></header><div class="gm-body"></div></main></div>';
  document.body.appendChild(menu);
  const nav = menu.querySelector('.gm-tabs'), body = menu.querySelector('.gm-body'), pages = {};
  for (const [id, title, sub, col, get] of TABS) {
    const els = get().filter(Boolean); if (!els.length) continue;
    const b = document.createElement('button'); b.type = 'button'; b.role = 'tab'; b.dataset.tab = id; b.setAttribute('aria-selected', 'false'); b.style.setProperty('--tc', col);
    b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICO[id] || ''}</svg><span><b>${title}</b><small>${sub}</small></span>`;
    b.addEventListener('click', () => show(id)); nav.appendChild(b);
    const pg = document.createElement('section'); pg.className = 'gm-page'; pg.hidden = true; pg.dataset.tab = id;
    for (const el of els) pg.appendChild(el);
    body.appendChild(pg); pages[id] = { b, pg, title, sub, col };
  }
  let last = 'partita';
  function show(id) {
    if (!pages[id] || pages[id].b.hidden) id = Object.keys(pages)[0];
    last = id;
    for (const k in pages) { const on = k === id; pages[k].pg.hidden = !on; pages[k].b.setAttribute('aria-selected', on ? 'true' : 'false'); }
    menu.style.setProperty('--acc', pages[id].col); $('gmTitle').textContent = pages[id].title; $('gmSub').textContent = pages[id].sub;
    if (id === 'partita') summary();
    body.scrollTop = 0;
    window.dispatchEvent(new Event('resize'));          // il quadro grande e i grafici si ridisegnano alla misura nuova
  }
  function open(id) {
    menu.hidden = false; show(id || last);
  }
  // scheda riassuntiva della partita: l'auto disegnata e i numeri che contano
  const fmt = (n, d = 0) => Number(n || 0).toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });
  function summary() {
    const el = $('gmSummary'), NR = window.nightRun; if (!el || !NR) return;
    const g = NR.game, v2 = NR.view2d, s = g.s, vg = s.vg, car = (typeof CARS !== 'undefined' && CARS[g.car]) || { name: g.car };
    const goal = g.vgGoal ? g.vgGoal() : null;
    const stat = (k, v, cls = '') => `<div class="gs-stat ${cls}"><small>${k}</small><b>${v}</b></div>`;
    el.innerHTML = `<div class="gs-car"><canvas width="10" height="10" aria-hidden="true"></canvas><div><small>${vg ? 'Il Viaggio' : g.mode === 'free' ? 'Città libera' : 'Città'}</small><b>${car.name}</b><span>${car.engine || ''}</span></div></div>`
      + '<div class="gs-stats">' + stat('Contanti', '€ ' + fmt(s.money), 'money') + stat(vg ? 'Km del viaggio' : 'Km', fmt((s.dist || 0) / 1000, 1))
      + stat('Reputazione', fmt(s.rep)) + (vg ? stat('Lavori fatti', fmt(vg.jobs)) + stat('Guadagnato', '€ ' + fmt(vg.earned)) : '') + '</div>'
      + (goal ? `<div class="gs-goal"><small>${goal.title}</small><b>${goal.text}</b><span>${goal.left > 0.05 ? 'tra ' + fmt(goal.left, 1) + ' km · ' : ''}paga € ${fmt(goal.pay)}${goal.note ? ' · ' + goal.note : ''}</span></div>` : '');
    // l'auto: lo stesso disegno della strada, ingrandito a pixel netti
    const cv = el.querySelector('canvas');
    try {
      const spr = v2 && v2.carSprite ? v2.carSprite(1) : null, src = spr && (spr.hd || spr);
      if (src && src.width) { cv.width = src.width; cv.height = src.height; const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(src, 0, 0); }
      else cv.hidden = true;
    } catch (e) { cv.hidden = true; }
  }

  function close() { menu.hidden = true; window.dispatchEvent(new Event('resize')); }
  menu.addEventListener('click', (e) => { if (e.target === menu) close(); });
  $('gmClose').addEventListener('click', close);
  window.gameMenu = { open, close, get isOpen() { return !menu.hidden; } };

  // pulsante MENU nella barra in alto
  const top = q('header.top');
  const mb = document.createElement('button'); mb.type = 'button'; mb.className = 'menubtn'; mb.id = 'menuBtn'; mb.innerHTML = '<i aria-hidden="true"></i>MENU<kbd>Tab</kbd>';
  mb.addEventListener('click', () => (menu.hidden ? open() : close()));
  if (top) top.appendChild(mb);

  // Tab apre e chiude, Esc chiude (prima degli altri tasti del gioco)
  window.addEventListener('keydown', (e) => {
    const gate = $('gate'); if (gate && !gate.hidden && getComputedStyle(gate).display !== 'none') return;   // durante la sigla no
    if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && !e.metaKey) { e.preventDefault(); e.stopImmediatePropagation(); if (menu.hidden) open(); else close(); return; }
    if (e.key === 'Escape' && !menu.hidden) { e.preventDefault(); e.stopImmediatePropagation(); close(); }
  }, true);

  // pedali per il tocco (solo dove il puntatore è un dito): tengono premuti W e S come la tastiera
  const tp = document.createElement('div'); tp.className = 'touchpedals'; tp.innerHTML = '<button type="button" class="tp-brk" aria-label="Freno">FRENO</button><button type="button" class="tp-gas" aria-label="Gas">GAS</button>';
  const hold = (btn, key) => {
    const down = (e) => { e.preventDefault(); btn.classList.add('on'); window.dispatchEvent(new KeyboardEvent('keydown', { key })); };
    const up = () => { if (!btn.classList.contains('on')) return; btn.classList.remove('on'); window.dispatchEvent(new KeyboardEvent('keyup', { key })); };
    btn.addEventListener('pointerdown', down); for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) btn.addEventListener(ev, up);
  };
  hold(tp.children[0], 's'); hold(tp.children[1], 'w');
  const hud = stage.querySelector('.hud'); if (hud) hud.appendChild(tp);

  window.dispatchEvent(new Event('resize'));
})();
