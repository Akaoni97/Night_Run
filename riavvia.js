// ============================================================================
//  Night Run · Riavvia la partita (dopo crediti.js)
//  Pulsante RIAVVIA nella barra in alto (accanto a MENU, TELEFONO e TASTI) e, al tocco, il pulsante "Nuovo viaggio" della scheda Partita.
//  Chiede conferma (Sì / No); con Sì cancella il salvataggio del Viaggio e ricarica la pagina: si riparte dalla schermata del titolo,
//  poi l'editor del personaggio e il prologo, come la prima volta. Le impostazioni (volume, vista, tasti, personaggio) restano.
//  window.nightRiavvia.ask() apre la domanda, .now() riavvia senza chiedere (per le prove).
// ============================================================================
(function () {
  let box = null, btn = null;
  const css = `
#riavviaBox { position: fixed; inset: 0; z-index: 90; display: grid; place-items: center; background: rgba(4,4,10,.78); backdrop-filter: blur(3px); }
#riavviaBox[hidden] { display: none; }
#riavviaBox .rb { width: min(460px, calc(100vw - 24px)); background: #14121c; color: #ece6d6; border: 2px solid #ff5a4a; border-radius: 14px; padding: 20px 22px; box-shadow: 0 20px 60px rgba(0,0,0,.65); font: 14px/1.4 system-ui, sans-serif; }
#riavviaBox h2 { margin: 0 0 8px; font: 400 26px/1 var(--f-display, sans-serif); letter-spacing: .06em; color: #ff7a6a; }
#riavviaBox p { margin: 0 0 6px; color: #cfc8b8; }
#riavviaBox .bar { display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px; }
#riavviaBox .bar button { min-width: 96px; padding: 10px 16px; border-radius: 8px; border: 0; font: 700 15px/1 system-ui; cursor: pointer; }
#riavviaBox .no { background: #ffb347; color: #1a1206; } #riavviaBox .si { background: #3a2226; color: #ffb4a8; border: 1px solid #ff5a4a; }
#riavviaBox button:focus-visible { outline: 3px solid #fff; outline-offset: 2px; }
#riavviaBtn .ic { font-size: 16px; line-height: 1; font-weight: 700; }
html.tdash #riavviaBtn { display: none; }
@media (max-width: 900px) { #riavviaBtn .tx { display: none; } }`;

  function mount() {
    if (box) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    box = document.createElement('div'); box.id = 'riavviaBox'; box.hidden = true; box.setAttribute('role', 'alertdialog'); box.setAttribute('aria-label', 'Riavvia la partita');
    box.innerHTML = '<div class="rb"><h2>Riavviare la partita?</h2><p>Il viaggio di adesso va perso: km, soldi, auto, lavori e progressi.</p><p>Si riparte da zero, dalla schermata del titolo e dal filmato iniziale.</p>'
      + '<div class="bar"><button type="button" class="si">Sì, riavvia</button><button type="button" class="no">No</button></div></div>';
    document.body.appendChild(box);
    box.addEventListener('click', (e) => {
      if (e.target === box) { close(); return; }
      const b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('si')) now(); else close();
    });
  }
  function ask() { mount(); box.hidden = false; const no = box.querySelector('.no'); if (no) no.focus(); }
  function close() { if (box) box.hidden = true; }

  // via il salvataggio del Viaggio e dei pezzi montati, poi si ricarica: tutto riparte dal titolo
  function now() {
    window.__nrRiavvia = true;                                  // il gioco non risalva mentre la pagina si chiude
    try {
      localStorage.removeItem('nightrun-viaggio');
      const s = JSON.parse(localStorage.getItem('banco2jz') || '{}');
      if (s.trip === false) { s.tunesOther = s.tunes; s.cossOther = s.coss; }   // veniva da una modalità libera: i suoi pezzi restano da parte
      s.trip = true; s.tunes = {}; s.coss = {};
      localStorage.setItem('banco2jz', JSON.stringify(s));
    } catch (e) { /* storage non disponibile: si ricarica lo stesso */ }
    location.reload();
  }

  // finestra aperta: i tasti non arrivano al gioco (S = freno!), solo Esc chiude e Invio conferma il pulsante col fuoco
  const key = (e) => {
    if (!box || box.hidden) return;
    if (e.type === 'keydown' && e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key !== 'Tab' && e.key !== 'Enter' && e.key !== ' ') e.preventDefault();     // Tab, Invio e spazio muovono il fuoco o premono il pulsante: niente preventDefault
    e.stopImmediatePropagation();                                                           // ma al gioco non arriva niente (Invio = avviamento, Tab = menu)
  };
  window.addEventListener('keydown', key, true); window.addEventListener('keyup', key, true);

  function addBtn() {
    const top = document.querySelector('header.top'); if (!top || btn) return;
    mount();
    btn = document.createElement('button'); btn.type = 'button'; btn.className = 'menubtn'; btn.id = 'riavviaBtn'; btn.title = 'Riavvia la partita';
    btn.innerHTML = '<span class="ic" aria-hidden="true">↻</span><span class="tx">RIAVVIA</span>';
    btn.addEventListener('click', ask);
    top.appendChild(btn);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(addBtn, 0)); else setTimeout(addBtn, 0);
  window.nightRiavvia = { ask, now, close };
})();
