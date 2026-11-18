// ============================================================================
//  Schermata di gioco compatta: la strada riempie la finestra, in alto una barra sottile (soldi, reputazione,
//  ricercato, MENU); tutto il resto (officina, bagagliaio, comandi di guida, vista, quadro, extra,
//  partita) va in un menu a schede che si apre col pulsante MENU o col tasto Tab e si chiude con Esc o Tab.
//  I pannelli non vengono riscritti: si spostano nelle schede, quindi il resto del gioco li trova come prima.
//  Sui telefoni compaiono anche i comandi al tocco sulla strada: pedali, palette del cambio, AVVIA.
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
    ['guida', 'Guida', 'Comandi dell\'auto, aiuti, limitatore', '#b8ff3a', () => [q('section.deck')]],
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

  // ---------------------------------------------------------------- comandi al tocco (solo dove il puntatore è un dito)
  //  pollice destro: FRENO e GAS in basso a destra, sopra le palette del cambio (▼ sopra il freno, ▲ sopra il gas)
  //  con in mezzo la marcia inserita; pollice sinistro: ◀ ▶ affiancati (CSS); AVVIA rotondo accanto al cruscotto,
  //  lontano dai pedali. I tasti mandano gli stessi eventi della tastiera, già "tradotti" (_nr) così che i tasti
  //  cambiati dal giocatore in TASTI non li blocchino.
  const send = (type, key) => { const ev = new KeyboardEvent(type, { key, bubbles: true, cancelable: true }); ev._nr = true; window.dispatchEvent(ev); };
  const buzz = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* niente */ } };
  const tp = document.createElement('div'); tp.className = 'touchpedals'; tp.setAttribute('role', 'group'); tp.setAttribute('aria-label', 'Pedali e cambio');
  tp.innerHTML = '<button type="button" class="tp-sh tp-dn" aria-label="Marcia giù"><i aria-hidden="true">▼</i><small>GIÙ</small></button>'
    + '<b class="tp-gear" aria-live="polite" aria-label="Marcia inserita">N</b>'
    + '<button type="button" class="tp-sh tp-up" aria-label="Marcia su"><i aria-hidden="true">▲</i><small>SU</small></button>'
    + '<button type="button" class="tp-brk" aria-label="Freno">FRENO</button>'
    + '<button type="button" class="tp-gas" aria-label="Gas">GAS</button>';
  const [bDn, gearEl, bUp, bBrk, bGas] = tp.children;
  // tengono premuto il tasto finché il dito resta sul pulsante
  const hold = (btn, key, ms) => {
    const down = (e) => { e.preventDefault(); if (btn.classList.contains('on')) return; btn.classList.add('on'); if (ms) buzz(ms); send('keydown', key); };
    const up = () => { if (!btn.classList.contains('on')) return; btn.classList.remove('on'); send('keyup', key); };
    btn.addEventListener('pointerdown', down); for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) btn.addEventListener(ev, up);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  };
  hold(bBrk, 's'); hold(bGas, 'w'); hold(bDn, 'q', 12); hold(bUp, 'e', 12);
  const hud = stage.querySelector('.hud'); if (hud) hud.appendChild(tp);

  // AVVIA: un tocco gira la chiave; a motore acceso sparisce (da telefono non si spegne per sbaglio mentre si guida)
  const st = document.createElement('button'); st.type = 'button'; st.className = 'tp-start'; st.setAttribute('aria-label', 'Accensione: avvia il motore');
  st.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v8"/><path d="M6.6 6.6a7.5 7.5 0 1 0 10.8 0"/></svg><small>AVVIA</small>';
  st.addEventListener('click', () => { buzz(20); if (window.nightRun) window.nightRun.engineTap(); });
  const dash = $('dash'); if (dash) dash.appendChild(st); else if (hud) hud.appendChild(st);

  // stato: marcia inserita (o quella che sta entrando) e AVVIA solo a motore spento
  let lastG = null;
  setInterval(() => {
    const n = window.nightRun, sim = n && n.sim; if (!sim) return;
    st.hidden = !!sim.running;
    // accanto al bordo destro vero del cruscotto (il quadro disegnato può sporgere oltre la griglia di #dash)
    if (!st.hidden && dash && st.parentNode === dash) {
      let r = 0; for (const el of dash.children) if (el !== st && el.offsetParent) r = Math.max(r, el.offsetLeft + el.offsetWidth);
      const x = (r || dash.offsetWidth) + (innerHeight <= 520 ? 10 : 14) + 'px'; if (st.style.left !== x) st.style.left = x;
    }
    const g = sim.shiftSeq ? sim.shiftSeq.target : sim.gear, t = g === -1 ? 'R' : g === 0 ? 'N' : String(g);
    if (t !== lastG) { lastG = t; gearEl.textContent = t; gearEl.classList.remove('pop'); void gearEl.offsetWidth; gearEl.classList.add('pop'); }
    // spente a fine corsa (aria-disabled e non disabled: un pulsante disabilitato sotto il dito non riceve il rilascio)
    bUp.setAttribute('aria-disabled', String(g >= (sim.topGear ? sim.topGear() : 6))); bDn.setAttribute('aria-disabled', String(g <= 0));
  }, 120);

  // ---------------------------------------------------------------- telefono: meno roba sulla strada, schermo intero a portata di dito
  // al tocco (deciso all'avvio): in alto a sinistra il quadro strumenti con AVVIA accanto; in basso a sinistra, sopra ◀ ▶,
  // due pulsanti STRUMENTI e DATI che aprono due finestrelle: le funzioni dell'auto (la fila AUTO, TC... e i comandi di
  // comandi.js, a tessere) e i dati del viaggio (ora, lavoro, bisogni, carico: il riquadro che prima stava in alto a sinistra).
  // I pezzi della pagina si spostano, non si rifanno: chi li cerca per id li trova come prima.
  if (matchMedia('(pointer: coarse)').matches && dash && hud) {
    document.documentElement.classList.add('tdash');
    const cock = document.createElement('div'); cock.className = 'tcock';
    const hp = $('hudP'); if (hp) cock.appendChild(hp);
    cock.appendChild(st); hud.appendChild(cock);
    const ICON = {
      str: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
      dati: '<path d="M5 20V11M12 20V5M19 20v-6"/>',
    };
    const bar = document.createElement('div'); bar.className = 'tbar'; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Finestre');
    const mkBtn = (id, label) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.p = id; b.setAttribute('aria-expanded', 'false'); b.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[id]}</svg><span>${label}</span>`; bar.appendChild(b); return b; };
    const bStr = mkBtn('str', 'STRUMENTI'), bDati = mkBtn('dati', 'DATI');
    // finestrella STRUMENTI = #dash stesso (con le sue file di pulsanti), con una testata
    const head = (title, sub) => { const h = document.createElement('header'); h.className = 'tpan-h'; h.innerHTML = `<b>${title}</b><small>${sub}</small><button type="button" aria-label="Chiudi">✕</button>`; return h; };
    dash.classList.add('tpan', 'tpan-str'); dash.insertBefore(head('Strumenti', 'Funzioni dell\'auto'), dash.firstChild);
    // finestrella DATI con il riquadro hud-l
    const dati = document.createElement('div'); dati.className = 'tpan tpan-dati'; dati.appendChild(head('Dati', 'Viaggio, lavoro, bisogni'));
    const hl = q('.hud-l'); if (hl) dati.appendChild(hl);
    // tessera LEGGERA: grafica a densità normale e senza bagliore, per provare da telefono senza scatti
    // (è la qualità "leggera" delle impostazioni: un altro tocco torna a quella di prima)
    const qs = $('q3d');
    if (qs) {
      const row = document.createElement('div'); row.className = 'dash-btns'; row.setAttribute('role', 'group');
      const leg = document.createElement('button'); leg.type = 'button'; leg.id = 'tLeg'; leg.textContent = 'LEGGERA'; leg.title = 'Grafica leggera per le prove da telefono';
      let prima = qs.value === 'leggera' ? 'alta' : qs.value;
      const sync = () => leg.setAttribute('aria-pressed', String(qs.value === 'leggera'));
      leg.addEventListener('click', () => {
        if (qs.value !== 'leggera') prima = qs.value;
        qs.value = qs.value === 'leggera' ? prima : 'leggera'; qs.dispatchEvent(new Event('change', { bubbles: true })); sync();
      });
      qs.addEventListener('change', sync); row.appendChild(leg); dash.appendChild(row); setTimeout(sync, 0);
    }
    hud.appendChild(dati); hud.appendChild(bar);
    const pans = { str: [bStr, dash], dati: [bDati, dati] };
    let aperta = null;
    const apri = (id) => {
      aperta = aperta === id ? null : id;
      for (const k in pans) { const on = k === aperta; pans[k][1].classList.toggle('open', on); pans[k][0].setAttribute('aria-expanded', String(on)); }
    };
    bStr.addEventListener('click', () => apri('str')); bDati.addEventListener('click', () => apri('dati'));
    for (const k in pans) pans[k][1].querySelector('.tpan-h button').addEventListener('click', () => { if (aperta === k) apri(k); });
    // un tocco sulla strada fuori dalle finestre (anche sui pedali) le chiude
    stage.addEventListener('pointerdown', (e) => { if (aperta && !e.target.closest('.tpan, .tbar')) apri(aperta); }, true);
  }
  // SCHERMO INTERO nella barra in alto (dopo TELEFONO e TASTI, che si aggiungono dopo questo file): usa lo stesso pulsante della strada
  const fsb = $('fsBtn');
  setTimeout(() => {
    if (!top || !fsb) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'menubtn fstop'; b.id = 'fsTop'; b.title = 'Schermo intero (Z)';
    b.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 5V1h4M11 1h4v4M15 11v4h-4M5 15H1v-4"/></svg><span>SCHERMO INTERO</span>';
    b.addEventListener('click', () => fsb.click()); top.appendChild(b);
  }, 0);
  // a schermo intero la barra in alto non si vede: MENU e TELEFONO restano accanto al pulsante per uscire
  const dock = document.createElement('div'); dock.className = 'fsdock';
  dock.innerHTML = '<button type="button" data-a="menu" aria-label="Menu"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h12"/></svg></button>'
    + '<button type="button" data-a="tel" aria-label="Telefono"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="4" y="1.5" width="8" height="13" rx="1.6"/><path d="M7 12.2h2"/></svg></button>';
  dock.children[0].addEventListener('click', () => open());
  dock.children[1].addEventListener('click', () => { const t = $('telBtn'); if (t) t.click(); else if (window.telefono && window.telefono.open) window.telefono.open(); });
  if (hud) hud.appendChild(dock);

  // telefono in verticale: la strada è larga e i comandi non ci stanno, si chiede di girarlo (si può giocare lo stesso)
  const gira = document.createElement('div'); gira.className = 'gira'; gira.setAttribute('role', 'dialog'); gira.setAttribute('aria-label', 'Gira il telefono');
  gira.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="22" y="8" width="20" height="36" rx="3"/><path d="M44 50a14 14 0 0 1-20 4M24 54l-1-6 6 1"/></svg>'
    + '<b>Gira il telefono</b><span>Night Run si guida in orizzontale: strada larga, pedali sotto i pollici.</span><button type="button">Gioca lo stesso</button>';
  gira.querySelector('button').addEventListener('click', () => { document.documentElement.classList.add('gira-no'); });
  document.body.appendChild(gira);

  window.dispatchEvent(new Event('resize'));
})();
