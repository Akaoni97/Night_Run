// ============================================================================
//  Schermata di gioco compatta: la strada riempie la finestra, in alto una barra sottile (soldi, reputazione,
//  ricercato, MENU); tutto il resto (officina, bagagliaio, comandi di guida, rivali, vista, quadro, extra,
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

  // le schede: nome, titolo, pezzi della pagina da spostarci
  const TABS = [
    ['partita', 'Partita', () => {
      const box = document.createElement('div'); box.className = 'panel top-moved';
      const h = document.createElement('h2'); h.textContent = 'Partita'; box.appendChild(h);
      for (const el of [q('.carsel'), $('modeSw'), $('btnNew'), $('audioState')]) if (el) box.appendChild(el);
      const tag = $('carTag'); if (tag) { const p = document.createElement('p'); p.className = 'hint'; p.appendChild(tag); box.appendChild(p); }
      return [box];
    }],
    ['garage', 'Officina', () => [q('section.tuning')]],
    ['bagagliaio', 'Bagagliaio', () => [$('trunkPanel')]],
    ['guida', 'Guida', () => [q('section.deck')]],
    ['rivali', 'Rivali', () => [q('section.ladder')]],
    ['vista', 'Vista', () => {
      const box = document.createElement('div'); box.className = 'panel';
      const h = document.createElement('h2'); h.textContent = 'Vista e grafica'; box.appendChild(h);
      const rb = q('.roadbar'); if (rb) box.appendChild(rb);
      return [box, q('section.uiprefs')];
    }],
    ['quadro', 'Quadro e dati', () => [$('cluster'), q('section.tele')]],
    ['extra', 'Extra', () => [q('section.extras')]],
  ];

  // messaggi (flash) sopra la strada invece che dentro il quadro grande
  const msg = $('msg'); if (msg) stage.appendChild(msg);

  // il menu
  const menu = document.createElement('div'); menu.className = 'gamemenu'; menu.id = 'gameMenu'; menu.hidden = true;
  menu.setAttribute('role', 'dialog'); menu.setAttribute('aria-modal', 'true'); menu.setAttribute('aria-labelledby', 'gmTitle');
  menu.innerHTML = '<div class="gm-side"><div class="gm-head"><h2 id="gmTitle">Menu</h2><small>Tab o Esc per tornare in strada</small><button type="button" class="menubtn" id="gmClose">Torna in strada</button></div><nav class="gm-tabs" role="tablist"></nav><div class="gm-body"></div></div>';
  document.body.appendChild(menu);
  const nav = menu.querySelector('.gm-tabs'), body = menu.querySelector('.gm-body'), pages = {};
  for (const [id, title, get] of TABS) {
    const els = get().filter(Boolean); if (!els.length) continue;
    const b = document.createElement('button'); b.type = 'button'; b.role = 'tab'; b.textContent = title; b.dataset.tab = id; b.setAttribute('aria-selected', 'false');
    b.addEventListener('click', () => show(id)); nav.appendChild(b);
    const pg = document.createElement('section'); pg.className = 'gm-page'; pg.hidden = true; pg.dataset.tab = id;
    for (const el of els) pg.appendChild(el);
    body.appendChild(pg); pages[id] = { b, pg };
  }
  let last = 'partita';
  function show(id) {
    if (!pages[id]) id = Object.keys(pages)[0];
    last = id;
    for (const k in pages) { const on = k === id; pages[k].pg.hidden = !on; pages[k].b.setAttribute('aria-selected', on ? 'true' : 'false'); }
    body.scrollTop = 0;
    window.dispatchEvent(new Event('resize'));          // il quadro grande e i grafici si ridisegnano alla misura nuova
  }
  function open(id) { menu.hidden = false; show(id || last); }
  function close() { menu.hidden = true; window.dispatchEvent(new Event('resize')); }
  menu.addEventListener('click', (e) => { if (e.target === menu) close(); });
  $('gmClose').addEventListener('click', close);
  window.gameMenu = { open, close, get isOpen() { return !menu.hidden; } };

  // pulsante MENU nella barra in alto
  const top = q('header.top');
  const mb = document.createElement('button'); mb.type = 'button'; mb.className = 'menubtn'; mb.id = 'menuBtn'; mb.innerHTML = 'MENU<kbd>Tab</kbd>';
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
