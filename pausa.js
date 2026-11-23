// ============================================================================
//  Night Run · Pausa a due livelli (v0.110, chiesta da Nico)
//  Primo livello: Esc sulla strada ferma il gioco (e il suono) e mostra una finestrella con Continua, Menu completo,
//  Impostazioni, Partite e «Salva e torna al titolo». Secondo livello: il menu a schede di `menu.js` (Menu completo,
//  Impostazioni, Partite lo aprono sulla scheda giusta); chiudendolo si torna alla finestrella, Esc o Continua riprende.
//  Il tempo si ferma con `window.__nrPausaM`, che il ciclo di `index.html` (`frame`) guarda come la pausa di quando
//  esci dalla finestra. Non si apre dentro un locale, al telefono, davanti a una domanda, sulla schermata iniziale,
//  nel prologo, al banco prova o a menu già aperto (lì Esc fa quello che faceva).
// ============================================================================
(function pausaDueLivelli() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const NR = () => window.nightRun, G = () => NR() && NR().game;
  const css = document.createElement('style');
  css.textContent = `
.nr-pausa{position:fixed;inset:0;z-index:96;display:grid;place-items:center;background:rgba(6,5,10,.72);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
.nr-pausa[hidden]{display:none}
.nr-pausa .pc{width:min(360px,92vw);padding:22px 22px 18px;border-radius:14px;background:linear-gradient(180deg,#1c1a16,#0a0d16);box-shadow:inset 0 0 0 1px #4a4234,inset 0 2px 0 #ffb347,0 30px 80px rgba(0,0,0,.7);color:#e8dcc0;font:500 14px/1.4 "Barlow Semi Condensed",system-ui,sans-serif;display:grid;gap:8px}
.nr-pausa h2{margin:0;font:400 30px/1 "Saira Stencil One",Impact,sans-serif;font-style:italic;letter-spacing:.08em;color:#ffd27a;text-shadow:0 0 18px rgba(255,179,71,.45)}
.nr-pausa .ri{font:600 12px/1.3 "Share Tech Mono",monospace;letter-spacing:.08em;color:#a8936a;margin:0 0 6px}
.nr-pausa button{all:unset;box-sizing:border-box;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:11px 14px;border-radius:9px;background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 1px rgba(255,255,255,.09);font:700 15px/1 "Barlow Semi Condensed",system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#f2ead8;transition:background .12s,box-shadow .12s}
.nr-pausa button:hover,.nr-pausa button:focus-visible{background:rgba(60,40,10,.55);box-shadow:inset 0 0 0 1px #ffb347}
.nr-pausa button.go{background:#b8ff3a;color:#141a04;box-shadow:none}
.nr-pausa button kbd{font:600 11px "Share Tech Mono",monospace;color:#8a8270;letter-spacing:.06em}
.nr-pausa button.go kbd{color:#3a4a10}
.nr-pausa .ask{padding:10px 12px;border-radius:9px;background:rgba(60,20,10,.55);box-shadow:inset 0 0 0 1px rgba(255,120,80,.4);display:grid;gap:8px}
.nr-pausa .ask div{display:flex;gap:8px}.nr-pausa .ask button{flex:1;justify-content:center}`;
  document.head.appendChild(css);

  const box = document.createElement('div'); box.className = 'nr-pausa'; box.hidden = true; box.id = 'nrPausa';
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Pausa');
  document.body.appendChild(box);
  let aperta = false, viaMenu = false, timer = 0;

  const fmt = (n, d = 0) => Number(n || 0).toLocaleString('it-IT', { maximumFractionDigits: d });
  function riga() {
    const g = G(); if (!g || !g.s) return '';
    const C = typeof CARS !== 'undefined' && CARS[g.car], nome = C ? (C.short || C.name) : g.car;
    return `${nome} · ${fmt((g.s.dist || 0) / 1000, 1)} km · € ${fmt(g.s.money)}`;
  }
  const ferma = (on) => {
    window.__nrPausaM = !!on;
    try { const a = NR() && NR().audio; if (a && a.ctx) { if (on) a.ctx.suspend(); else a.ctx.resume(); } } catch (e) { /* ignora */ }
  };
  function libero() {   // si può aprire solo sulla strada
    const g = G(), gt = document.getElementById('gate'), ph = document.getElementById('photoBox');
    if (!g || !g.s || !g.s.vg) return false;
    if (gt && !gt.hidden) return false;
    if (window.NightPrologo && NightPrologo.playing) return false;
    if (g.inside || g.prompt || window.__nrPausaM) return false;
    if (window.gameMenu && gameMenu.isOpen) return false;
    if (window.telefono && telefono.isOpen) return false;
    if (window.NightBanco && NightBanco.on) return false;
    if (ph && !ph.hidden) return false;
    if (document.querySelector('.nr-modal:not([hidden]), #riavviaBox:not([hidden])')) return false;
    return true;
  }

  function disegna(conferma) {
    box.innerHTML = '<div class="pc"><h2>Pausa</h2><p class="ri"></p>'
      + '<button type="button" class="go" data-a="continua">Continua<kbd>Esc</kbd></button>'
      + '<button type="button" data-a="menu">Menu completo<kbd>Tab</kbd></button>'
      + '<button type="button" data-a="imp">Impostazioni</button>'
      + '<button type="button" data-a="partita">Salvataggi e partita</button>'
      + '<button type="button" data-a="esci">Salva e torna al titolo</button>'
      + (conferma ? '<div class="ask"><span>La partita si salva e il gioco riparte dal titolo. Vuoi uscire?</span><div><button type="button" data-a="si">Sì, esci</button><button type="button" data-a="no">No</button></div></div>' : '') + '</div>';
    box.querySelector('.ri').textContent = riga();
    const primo = box.querySelector('.go'); if (primo) primo.focus({ preventScroll: true });
  }
  function apri() {
    if (aperta || !libero()) return false;
    aperta = true; ferma(true); disegna(false); box.hidden = false; return true;
  }
  function chiudi() {
    if (!aperta) return; aperta = false; viaMenu = false; clearInterval(timer); box.hidden = true; ferma(false);
    try { box.dispatchEvent(new Event('riprendi')); } catch (e) { /* ignora */ }
  }
  function aMenu(scheda) {   // secondo livello: il menu a schede; chiuso, si torna qui
    if (!window.gameMenu) return;
    box.hidden = true; viaMenu = true; gameMenu.open(scheda);
    clearInterval(timer); timer = setInterval(() => { if (!gameMenu.isOpen) { clearInterval(timer); if (aperta && viaMenu) { viaMenu = false; disegna(false); box.hidden = false; } } }, 150);
  }
  box.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('button'); if (!a) { if (e.target === box) chiudi(); return; }
    const k = a.dataset.a;
    if (k === 'continua') chiudi();
    else if (k === 'menu') aMenu();
    else if (k === 'imp') aMenu('imp');
    else if (k === 'partita') aMenu('partita');
    else if (k === 'esci') disegna(true);
    else if (k === 'no') disegna(false);
    else if (k === 'si') { try { NR().save(); } catch (err) { /* ignora */ } location.reload(); }
  });
  // Esc apre, chiude o, nella finestrella, Tab apre il menu: in cattura, prima del resto del gioco
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (aperta) {
      if (box.hidden) return;            // il menu a schede è aperto: ci pensa lui
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); chiudi(); }
      else if (e.key === 'Tab') { e.preventDefault(); e.stopImmediatePropagation(); aMenu(); }
      else if (e.key === 'Enter' && document.activeElement && box.contains(document.activeElement)) { e.stopImmediatePropagation(); }
      else e.stopImmediatePropagation();
      return;
    }
    if (e.key === 'Escape' && !e.repeat && !(e.target.closest && e.target.closest('input, textarea, select')) && apri()) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  window.NightPausa = { apri, chiudi, get aperta() { return aperta; } };
})();
