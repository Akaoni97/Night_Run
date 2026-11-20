// ============================================================================
//  Night Run · I tasti (prima di menu.js e telefono.js)
//  Elenco di tutti i comandi con il loro tasto, e la possibilità di cambiarli. Il tasto scelto dal giocatore viene
//  tradotto nel tasto originale prima che lo veda il resto del gioco (un ascoltatore in fase di cattura, il primo
//  registrato): così index.html, menu.js e telefono.js restano come sono. Salvato nel browser (localStorage).
//  Pulsante TASTI nella barra in alto, accanto a MENU e TELEFONO. window.nightTasti.open() / .map() / .reset().
// ============================================================================
const TASTI = [
  // [id, tasto originale, cosa fa, gruppo]
  ['gas', 'w', 'Gas', 'Guida'], ['freno', 's', 'Freno', 'Guida'], ['sx', 'a', 'Sterza / corsia a sinistra', 'Guida'], ['dx', 'd', 'Sterza / corsia a destra', 'Guida'],
  ['su', 'e', 'Marcia su (automatico: leva verso D)', 'Guida'], ['giu', 'q', 'Marcia giù (automatico: leva verso P)', 'Guida'], ['folle', 'n', 'Folle (N)', 'Guida'], ['retro', 'r', 'Retromarcia (R)', 'Guida'],
  ['avvio', 'Enter', 'Avviamento (tieni premuto)', 'Guida'], ['quadro', 'i', 'Quadro acceso / spento', 'Guida'], ['spegni', 'o', 'Spegni il motore', 'Guida'],
  ['launch', 'l', 'Launch control', 'Guida'], ['clacson', 'h', 'Clacson', 'Guida'], ['fari', 'f', 'Sfanala (chiedi strada)', 'Guida'],
  ['finestrini', '8', 'Finestrini su / giù', 'Auto'], ['scorta', '9', 'Monta la ruota di scorta', 'Auto'], ['bagagliaio', 'b', 'Bagagliaio', 'Auto'], ['entra', 'u', 'Entra / esci dal locale', 'Auto'],
  ['menu', 'Tab', 'Menu', 'Schermate'], ['telefono', '0', 'Telefono', 'Schermate'], ['mappa', 't', 'Mappa del mondo', 'Schermate'], ['strumenti', 'j', 'Cambia strumenti', 'Schermate'],
  ['schermo', 'z', 'Schermo intero', 'Schermate'],
  ['ascolto', 'v', 'Punto d\'ascolto', 'Vista e suono'], ['radio', 'p', 'Radio: stazione dopo', 'Vista e suono'], ['muto', 'm', 'Audio sì / no', 'Vista e suono'],
  ['meteo', 'k', 'Meteo', 'Vista e suono'], ['foto', 'x', 'Foto', 'Vista e suono'], ['replay', 'y', 'Replay', 'Vista e suono'],
];
// tasti fissi che non si cambiano (si elencano soltanto)
const TASTI_FISSI = [['Frecce', 'Gas, freno, marcia su e giù'], ['1 - 6', 'Marce, o le risposte alle domande'], ['Esc', 'Chiude quello che è aperto']];

(function tasti() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const norm = (k) => (k && k.length === 1 ? k.toLowerCase() : k);
  const DEF = Object.fromEntries(TASTI.map(([id, k]) => [id, k]));
  let custom = {};
  try { custom = JSON.parse(localStorage.getItem('nr_tasti') || '{}') || {}; } catch (e) { custom = {}; }
  const keyOf = (id) => custom[id] || DEF[id];
  // tabella di traduzione: tasto premuto → tasto originale; i tasti originali spostati altrove non fanno più niente
  let trans = {}, blocked = {};
  function build() {
    trans = {}; blocked = {};
    for (const [id, k0] of TASTI) { const k = keyOf(id); if (norm(k) !== norm(k0)) { trans[norm(k)] = k0; blocked[norm(k0)] = true; } }
    for (const k in trans) delete blocked[k];
    labels();
  }
  const save = () => { try { localStorage.setItem('nr_tasti', JSON.stringify(custom)); } catch (e) { /* niente */ } };
  const show = (k) => ({ ' ': 'Spazio', Enter: 'Invio', Tab: 'Tab', Escape: 'Esc', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', Backspace: '⌫', Shift: 'Maiusc', Control: 'Ctrl', Alt: 'Alt' }[k] || (k && k.length === 1 ? k.toUpperCase() : k));

  let listen = null;     // id del comando che aspetta il tasto nuovo
  const tr = (e) => {
    if (e._nr) return;                                     // evento già tradotto da qui
    if (listen && e.type === 'keydown') { e.preventDefault(); e.stopImmediatePropagation(); pick(e); return; }
    if (box && !box.hidden) { if (e.key === 'Escape' && e.type === 'keydown') { e.preventDefault(); e.stopImmediatePropagation(); close(); } return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target && e.target.closest && e.target.closest('input, textarea, select')) return;
    const k = norm(e.key), to = trans[k];
    if (to === undefined && !blocked[k]) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (to === undefined) return;                          // tasto originale assegnato a un altro comando: non fa niente
    const ev = new KeyboardEvent(e.type, { key: to, bubbles: true, cancelable: true, repeat: e.repeat });
    ev._nr = true; (document.body || window).dispatchEvent(ev);
  };
  window.addEventListener('keydown', tr, true); window.addEventListener('keyup', tr, true);

  // ---------------------------------------------------------------- la schermata dei tasti
  let box = null, btn = null;
  const css = `
#tastiBox { position: fixed; inset: 0; z-index: 80; display: grid; place-items: center; background: rgba(4,4,10,.72); backdrop-filter: blur(3px); }
#tastiBox[hidden] { display: none; }
#tastiBox .tb { width: min(760px, calc(100vw - 24px)); max-height: calc(100vh - 32px); overflow: auto; background: #14121c; color: #ece6d6; border: 2px solid #ffb347; border-radius: 14px; padding: 18px 20px; box-shadow: 0 20px 60px rgba(0,0,0,.6); font: 14px/1.35 system-ui, sans-serif; }
#tastiBox h2 { margin: 0 0 4px; font: 400 24px/1 var(--f-display, sans-serif); letter-spacing: .06em; color: #ffb347; }
#tastiBox p.hint { margin: 0 0 12px; color: #b8b0a0; font-size: 13px; }
#tastiBox h4 { margin: 14px 0 6px; font: 600 12px/1 var(--f-data, monospace); letter-spacing: .12em; text-transform: uppercase; color: #ffd27a; }
#tastiBox .tg { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 6px; }
#tastiBox .tr { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px; background: #1e1b28; border-radius: 8px; }
#tastiBox .tr button { min-width: 64px; padding: 5px 10px; border: 1px solid #4a4458; border-bottom-width: 3px; border-radius: 7px; background: #2a2636; color: #fff; font: 700 13px/1 var(--f-data, monospace); cursor: pointer; }
#tastiBox .tr button.mod { border-color: #ffb347; color: #ffd27a; }
#tastiBox .tr button.ask { background: #ffb347; color: #1a1206; animation: tbp .8s infinite alternate; }
@keyframes tbp { to { filter: brightness(1.25); } }
#tastiBox .fx { color: #8a8478; }
#tastiBox .bar { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; flex-wrap: wrap; }
#tastiBox .bar button { padding: 8px 14px; border-radius: 8px; border: 0; font: 600 14px/1 system-ui; cursor: pointer; }
#tastiBox .bar .rs { background: #2a2636; color: #ece6d6; } #tastiBox .bar .ok { background: #ffb347; color: #1a1206; }
#tastiBtn .ic { width: 16px; height: 11px; border: 2px solid #1a1206; border-radius: 3px; position: relative; box-sizing: border-box; }
#tastiBtn .ic::after { content: ''; position: absolute; left: 2px; right: 2px; bottom: 1px; height: 2px; background: #1a1206; }
@media (max-width: 700px) { #tastiBtn .tx { display: none; } }`;
  function render() {
    if (!box) return;
    const groups = [...new Set(TASTI.map((t) => t[3]))];
    let h = '<div class="tb" role="dialog" aria-label="Tasti"><h2>TASTI</h2><p class="hint">Tocca il tasto di un comando e premi quello nuovo (Esc annulla). Se il tasto era già usato, i due comandi si scambiano. Si salva da solo.</p>';
    for (const gname of groups) {
      h += `<h4>${gname}</h4><div class="tg">`;
      for (const [id, k0, label, gg] of TASTI) if (gg === gname) h += `<div class="tr"><span>${label}</span><button type="button" data-id="${id}" class="${listen === id ? 'ask' : norm(keyOf(id)) !== norm(k0) ? 'mod' : ''}">${listen === id ? 'premi…' : show(keyOf(id))}</button></div>`;
      h += '</div>';
    }
    h += '<h4>Fissi</h4><div class="tg">' + TASTI_FISSI.map(([k, t]) => `<div class="tr"><span>${t}</span><span class="fx">${k}</span></div>`).join('') + '</div>';
    h += '<div class="bar"><button type="button" class="rs">Ripristina tutti</button><button type="button" class="ok">Fatto</button></div></div>';
    box.innerHTML = h;
  }
  function pick(e) {
    const id = listen; listen = null;
    if (e.key !== 'Escape' && !['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
      const nk = e.key, other = TASTI.find(([o]) => o !== id && norm(keyOf(o)) === norm(nk));
      if (other) custom[other[0]] = keyOf(id);               // scambio
      custom[id] = nk;
      for (const [o, k0] of TASTI) if (norm(custom[o] || '') === norm(k0)) delete custom[o];
      save(); build();
    }
    render();
  }
  function open() { mount(); listen = null; render(); box.hidden = false; }
  function close() { if (box) box.hidden = true; listen = null; }
  function mount() {
    if (box) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    box = document.createElement('div'); box.id = 'tastiBox'; box.hidden = true; document.body.appendChild(box);
    box.addEventListener('click', (e) => {
      if (e.target === box) { close(); return; }
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.id) { listen = b.dataset.id; render(); }
      else if (b.classList.contains('rs')) { custom = {}; save(); build(); render(); }
      else if (b.classList.contains('ok')) close();
    });
  }
  // le etichette dei pulsanti MENU e TELEFONO mostrano il tasto vero
  function labels() {
    const set = (bid, id) => { const k = document.querySelector(`#${bid} kbd`); if (k) k.textContent = show(keyOf(id)); };
    set('menuBtn', 'menu'); set('telBtn', 'telefono'); set('tastiBtn', 'tasti');
  }
  function addBtn() {
    const top = document.querySelector('header.top'); if (!top || btn) return;
    mount();
    btn = document.createElement('button'); btn.type = 'button'; btn.className = 'menubtn'; btn.id = 'tastiBtn'; btn.title = 'Tasti e comandi';
    btn.innerHTML = '<span class="ic" aria-hidden="true"></span><span class="tx">TASTI</span>';
    btn.addEventListener('click', () => (box.hidden ? open() : close()));
    top.appendChild(btn); labels();
  }
  build();
  // dopo menu.js e telefono.js, così il pulsante va accanto ai loro
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(addBtn, 0)); else setTimeout(addBtn, 0);
  window.nightTasti = { open, close, map: () => Object.assign({}, custom), reset: () => { custom = {}; save(); build(); render(); } };
})();
